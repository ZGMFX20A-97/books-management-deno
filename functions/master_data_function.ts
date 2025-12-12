import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SheetClient } from "../utils/sheet_operation.ts";
import { fetchChannelMembers } from "../utils/fetch_channel_members.ts";
import { fetchUserNameMap } from "../utils/get_name.ts";

// ファンクションの定義
export const MasterDataFunction = DefineFunction({
  callback_id: "master_data_function",
  title: "利用者マスタデータの整理",
  source_file: "functions/master_data_function.ts",
});

export default SlackFunction(MasterDataFunction, async ({ client, env, team_id }) => {
  console.log("Updating members master data...");
  try {
    const channelMemberIds = await fetchChannelMembers(client, env["CHANNEL_ID"]);
    console.log(`取得したメンバーID数: ${channelMemberIds.length}`);
    const userMap = await fetchUserNameMap(client, team_id);
    const memberNames = channelMemberIds.map((id) => {
      // Mapから探す。見つからなければ "不明" とする
      return [userMap[id]];
    });

    if (memberNames.length === 0) {
      console.log("メンバーがいませんでした。");
      return {
        outputs: {
          response_action: "error",
          error: "チャンネルメンバーメンバーがいませんでした。",
        },
        completed: true,
      };
    }

    const Bot = new SheetClient(env);
    await Bot.updateUserMasterData(memberNames);
  } catch (error) {
    console.error(`Error fetching channel members: ${error}`);
    return {
      outputs: { response_action: "error", error: "チャンネルメンバーの取得に失敗しました。" },
      completed: true,
    };
  }

  return { outputs: {}, completed: true };
});
