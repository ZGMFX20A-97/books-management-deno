import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { getUserName } from "../utils/get_name.ts";
import { returnModal } from "../views/modal.ts";
import { SheetClient } from "../utils/sheet_operation.ts";
import { extractFormValues } from "../utils/extract_form_values.ts";

export const ReturnFunction = DefineFunction({
  callback_id: "return_function",
  title: "書籍の返却",
  description: "書籍の返却モーダルを出す",
  source_file: "functions/return_function.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
});

export default SlackFunction(
  ReturnFunction,
  async ({ inputs, client }) => {
    const response = await client.views.open({
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: returnModal,
    });
    if (response.error) {
      const error =
        `Failed to open a modal in the demo workflow. Contact the app maintainers with the following information - (error: ${response.error})`;
      return { error };
    }
    return {
      // To continue with this interaction, return false for the completion
      completed: false,
    };
  },
).addBlockSuggestionHandler(
  "bookTitle_select",
  async ({ client, body, env }) => {
    const userName = await getUserName(client, body.user.id);

    const Bot = new SheetClient(env);
    const availableBooks = await Bot.getMyBooks(userName);

    const opts = {
      "options": availableBooks.map((book) => ({
        value: `${book}`,
        text: { type: "plain_text" as const, text: book },
      })),
    };
    return opts;
  },
).addViewSubmissionHandler("return_modal", async ({ view, env, client, body }) => {
  const formData = extractFormValues(view.state.values);
  const bookTitle = formData.bookTitle_select;
  const userName = await getUserName(client, body.user.id);

  let msgBlocks;
  try {
    const Bot = new SheetClient(env);
    msgBlocks = await Bot.returnBook(bookTitle, userName);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { response_actions: "errors", error: `返却処理エラー: ${errorMessage}` };
  }

  const response = await client.chat.postMessage({
    channel: env["CHANNEL_ID"],
    text: "返却完了", // 通知用テキスト
    blocks: msgBlocks, // ★ここで構築したブロックを渡す
  });

  if (!response.ok) {
    return { error: `Failed to post message: ${response.error}` };
  }
  await client.functions.completeSuccess({
    function_execution_id: body.function_data.execution_id,
    outputs: {},
  });
}).addViewClosedHandler("return_modal", ({ view }) => {
  console.log(`view_closed handler called: ${JSON.stringify(view)}`);
  return { completed: true };
});
