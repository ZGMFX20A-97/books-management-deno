import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import { checkDueDate } from "../utils/sheet.ts";

// ファンクションの定義
export const RemindFunction = DefineFunction({
  callback_id: "remind_function",
  title: "返却期限のチェック",
  source_file: "functions/remind_function.ts",
});

export default SlackFunction(RemindFunction, async ({ client, env }) => {
  const reminderTargets = await checkDueDate(env);

  console.log("Checking due date...");

  if (reminderTargets.length === 0) {
    console.log("リマインド対象はありませんでした。");
    return { outputs: {}, completed: true };
  }
  let response;
  // 4. 対象者に通知を送る
  for (const target of reminderTargets) {
    const message =
      `🚨 <@${target.userId}> さん\n書籍 *『${target.bookTitle}』* の返却期限になりました。\n返却をお願いします！`;

    response = await client.chat.postMessage({
      channel: env["CHANNEL_ID"],
      text: message,
    });

    if (!response.ok) {
      console.log(`リマインドエラー発生: ${response.error}`);
    }
  }

  return { outputs: {}, completed: true };
});
