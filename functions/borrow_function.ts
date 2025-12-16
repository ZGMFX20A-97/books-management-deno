import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { getUserName } from "../utils/get_name.ts";
import { borrowModal } from "../views/modal.ts";
import { compareDate } from "../utils/compare_date.ts";
import { extractFormValues } from "../utils/extract_form_values.ts";
import { borrowBook, getAvailableBooks } from "../utils/sheet.ts";

export const BorrowFunction = DefineFunction({
  callback_id: "borrow_function",
  title: "書籍の貸出",
  description: "書籍の貸出モーダルを出す",
  source_file: "functions/borrow_function.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
});

export default SlackFunction(
  BorrowFunction,
  async ({ inputs, client }) => {
    // モーダルを開く
    const response = await client.views.open({
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: borrowModal,
    });
    if (response.error) {
      const error =
        `Failed to open a modal in the demo workflow. Contact the app maintainers with the following information - (error: ${response.error})`;
      return { error };
    }
    // モーダルが開く状態を保持するため、completedはfalse
    return {
      completed: false,
    };
  },
).addBlockSuggestionHandler(
  "bookTitle_select",
  async ({ body, env }) => {
    // ユーザーが入力したキーワードを取得
    const keyword = body.value;
    // 利用可能な書籍を取得
    const availableBooks = await getAvailableBooks(
      env,
      keyword,
    );
    // 利用可能な書籍をオプションとして設定
    const opts = {
      "options": availableBooks.map((book) => ({
        value: `${book}`,
        text: { type: "plain_text" as const, text: book },
      })),
    };
    return opts;
  },
).addViewSubmissionHandler("borrow_modal", async ({ body, view, env, client }) => {
  // モーダルからの入力値を抽出
  const formData = extractFormValues(view.state.values);
  const date = formData.date_select;
  const bookTitle = formData.bookTitle_select;
  const userName = await getUserName(client, body.user.id);

  // 日付が過去の場合はエラーを返す
  if (!compareDate(date)) {
    return {
      response_action: "errors",
      errors: { "date_block": "過去の日付は選択できません。今日以降の日付にしてください。" },
    };
  }
  let msgBlocks;
  try {
    // 書籍を貸出す処理、必要情報をBlocksへ埋め込んで返す
    msgBlocks = await borrowBook(
      env,
      bookTitle,
      userName,
      date,
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { response_actions: "errors", error: `貸出処理エラー: ${errorMessage}` };
  }
  // 貸出完了メッセージをチャンネルに投稿
  const response = await client.chat.postMessage({
    channel: env["CHANNEL_ID"],
    text: "貸出完了", // 通知用テキスト
    blocks: msgBlocks, // ★ここで構築したブロックを渡す
  });

  if (!response.ok) {
    return { error: `Failed to post message: ${response.error}` };
  }
  // 関数の完了を通知、通知しないとモーダルが閉じられない
  await client.functions.completeSuccess({
    function_execution_id: body.function_data.execution_id,
    outputs: {},
  });
}).addViewClosedHandler("borrow_modal", ({ view }) => {
  console.log(`view_closed handler called: ${JSON.stringify(view)}`);
  return { completed: true };
});
