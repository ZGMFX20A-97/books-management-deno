import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SheetClient } from "../utils/sheet_operation.ts";

// ファンクションの定義
export const RemindFunction = DefineFunction({
  callback_id: "remind_function",
  title: "返却期限のチェック",
  source_file: "functions/remind_function.ts",
});

export default SlackFunction(RemindFunction, async ({ client, env }) => {
  const Bot = new SheetClient(env); // 環境変数からシートID取得

  const remindTargets = await Bot.checkDueDate();

  console.log("Checking due date...");

  if (remindTargets.length === 0) {
    console.log("リマインド対象はありませんでした。");
    return { outputs: {}, completed: true };
  }
  let response;
  // 4. 対象者に通知を送る
  for (const target of remindTargets) {
    const message =
      `🚨 ${target.user} さん\n書籍『${target.bookTitle}』の返却期限が3日後に迫っています。\n返却の準備をお願いします！`;

    response = await client.chat.postMessage({
      channel: env["CHANNEL_ID"],
      text: message, // メンション付きテキスト
    });

    if (!response.ok) {
      console.log(`リマインドエラー発生: ${response.error}`);
    }
  }

  return { outputs: {}, completed: true };
});
