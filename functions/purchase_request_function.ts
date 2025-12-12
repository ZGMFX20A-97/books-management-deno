import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { getUserName } from "../utils/get_name.ts";
import { purchaseRequestModal } from "../views/modal.ts";
import { SheetClient } from "../utils/sheet_operation.ts";
import { extractFormValues } from "../utils/extract_form_values.ts";

export const PurchaseRequestFunction = DefineFunction({
  callback_id: "purchase_request_function",
  title: "書籍の購入申請",
  description: "書籍の購入申請モーダルを出す",
  source_file: "functions/purchase_request_function.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
});

export default SlackFunction(
  PurchaseRequestFunction,
  async ({ inputs, client }) => {
    const response = await client.views.open({
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: purchaseRequestModal,
    });
    if (response.error) {
      const error =
        `Failed to open a modal in the demo workflow. Contact the app maintainers with the following information - (error: ${response.error})`;
      return { error };
    }
    return {
      completed: false,
    };
  },
).addViewSubmissionHandler("purchase_request_modal", async ({ body, view, env, client }) => {
  const formData = extractFormValues(view.state.values);
  const bookTitle = formData.bookTitle_select;
  const publisher = formData.publisher_select;
  const url = formData.url_select;
  const price = formData.price_select;
  const purchaseMethod = formData.purchaseMethod_select;
  const userName = await getUserName(client, body.user.id);

  let msgBlocks;

  try {
    const Bot = new SheetClient(env);
    msgBlocks = await Bot.request(userName, publisher, bookTitle, price, purchaseMethod, url);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { response_actions: "errors", error: `申請処理エラー: ${errorMessage}` };
  }

  const response = await client.chat.postMessage({
    channel: env["CHANNEL_ID"],
    text: "申請完了", // 通知用テキスト
    blocks: msgBlocks, // ★ここで構築したブロックを渡す
  });

  if (!response.ok) {
    return { error: `Failed to post message: ${response.error}` };
  }

  await client.functions.completeSuccess({
    function_execution_id: body.function_data.execution_id,
    outputs: {},
  });
}).addViewClosedHandler("purchase_request_modal", ({ view }) => {
  console.log(`view_closed handler called: ${JSON.stringify(view)}`);
  return { completed: true };
});
