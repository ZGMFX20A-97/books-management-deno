import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { shelveModal } from "../views/modal.ts";
import { extractFormValues } from "../utils/extract_form_values.ts";
import { shelve } from "../utils/sheet.ts";

export const ShelveFunction = DefineFunction({
  callback_id: "shelve_function",
  title: "書籍の配架",
  description: "書籍配架モーダルを出す",
  source_file: "functions/shelve_function.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
});

export default SlackFunction(
  ShelveFunction,
  async ({ inputs, client }) => {
    // モーダルを開く
    const response = await client.views.open({
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: shelveModal,
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
).addViewSubmissionHandler("shelve_modal", async ({ view, env, client, body }) => {
  // モーダルの入力値を取得
  const formData = extractFormValues(view.state.values);
  const publisher = formData.publisher_select;
  const bookTitle = formData.bookTitle_select;
  const url = formData.url_select;

  let msgBlocks;
  try {
    // 配架を処理
    msgBlocks = await shelve(env, publisher, bookTitle, url);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { response_actions: "errors", error: `配架処理エラー: ${errorMessage}` };
  }

  const response = await client.chat.postMessage({
    channel: env["CHANNEL_ID"],
    text: "配架完了", // 通知用テキスト
    blocks: msgBlocks, // ★ここで構築したブロックを渡す
  });

  if (!response.ok) {
    return { error: `Failed to post message: ${response.error}` };
  }

  // 関数の完了を通知
  await client.functions.completeSuccess({
    function_execution_id: body.function_data.execution_id,
    outputs: {},
  });
}).addViewClosedHandler("shelve_modal", ({ view }) => {
  console.log(`view_closed handler called: ${JSON.stringify(view)}`);
  return { completed: true };
});
