import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import { fetchActiveMembers } from "../utils/get_name.ts";
import { updateUserMasterData } from "../utils/sheet.ts";

// ファンクションの定義
export const MasterDataFunction = DefineFunction({
  callback_id: "master_data_function",
  title: "利用者マスタデータの整理",
  source_file: "functions/master_data_function.ts",
});

export default SlackFunction(MasterDataFunction, async ({ client, env }) => {
  console.log("Updating members master data...");
  try {
    // チャンネルメンバーを取得
    const activeMembers = await fetchActiveMembers(env, client);
    console.log(`取得したメンバー数: ${activeMembers.length}`);

    if (activeMembers.length === 0) {
      console.log("メンバーがいませんでした。");
      return {
        outputs: {
          response_action: "error",
          error: "チャンネルメンバーメンバーがいませんでした。",
        },
        completed: true,
      };
    }

    // ユーザーマスタデータを更新
    await updateUserMasterData(env, activeMembers);
  } catch (error) {
    console.error(`Error fetching channel members: ${error}`);
    return {
      outputs: { response_action: "error", error: "チャンネルメンバーの取得に失敗しました。" },
      completed: true,
    };
  }
  // 関数の完了を通知
  return { outputs: {}, completed: true };
});
