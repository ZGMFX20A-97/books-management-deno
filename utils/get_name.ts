import { SlackAPIClient } from "deno-slack-api/types.ts";
import { Env } from "deno-slack-sdk/types.ts";

export function extractName(displayName: string): string {
  if (!displayName) return "";
  return displayName
    .replace(/[a-zA-Z]/g, "") // 1. アルファベットを除去
    .replace(/[\s　]/g, "") // 2. あらゆる空白（半角・全角・改行）を除去
    .trim(); // 3. ゴミ取り
}

/**
 * ユーザーIDからSlack APIを叩いて表示名を取得・整形する関数
 */
export async function getUserName(client: SlackAPIClient, userId: string): Promise<string> {
  // 1. APIでユーザーの詳細情報を取得
  const response = await client.users.info({ user: userId });

  if (!response.ok) {
    console.error(`Error fetching user: ${response.error}`);
    return "不明なユーザー";
  }

  const profile = response.user?.profile;

  // 2. 表示名(display_name) を優先し、なければ 本名(real_name) を使う
  // (表示名を設定していない人がいる場合の対策)
  const rawName = profile?.display_name || profile?.real_name || "名無し";

  // 3. 名前の整形処理
  return extractName(rawName);
}

export async function fetchActiveMembers(
  env: Env,
  client: SlackAPIClient,
): Promise<string[][]> {
  try {
    // メンバーのユーザーIDを取得、IDの配列が帰ってくる
    // client.conversations.membersはボットユーザーや解除済みユーザーの区別がつかない
    const response = await client.conversations.members({
      channel: env["CHANNEL_FOR_GET_MEMBERS"],
      limit: 1000,
    });
    if (!response.ok) {
      console.error(`users.list error: ${response.error}`);
      return [];
    }
    // シートへの書き込みは２次元配列が必要
    let activeMembers: string[][] = [];
    // 検索を高速化するために Set に変換する
    const channelMemberIds = new Set(response.members || []);

    // 2. ワークスペースの全ユーザー情報を取得
    const usersRes = await client.users.list({
      limit: 1000,
    });

    if (!usersRes.ok) {
      console.error(`users.list error: ${usersRes.error}`);
      return [];
    }

    const allUsers = usersRes.members || [];

    // 3. 全ユーザーの中から「指定チャンネルにいる」かつ「有効な人間」を抽出
    for (const user of allUsers) {
      // (A) そのユーザーIDが、チャンネルのメンバーリストに含まれているか確認
      if (!user.id || !channelMemberIds.has(user.id)) continue;

      // (B) Bot や 削除済み、Slack公式Bot を除外
      if (user.is_bot || user.deleted || user.id === "USLACKBOT") continue;

      // プロフィール取得
      const profile = user.profile;
      const rawName = profile?.display_name || profile?.real_name || "名無し";
      const cleanName = extractName(rawName);

      // 名前が取れた場合のみ追加
      if (cleanName) {
        activeMembers.push([cleanName, user.id]);
      }
    }
    console.log(activeMembers);

    return activeMembers;
  } catch (error) {
    console.error(error);
    return [];
  }
}
