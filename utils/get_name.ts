export function extractName(displayName: string): string {
  if (!displayName) return "名無し";

  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 0) return "名無し";

  const last = parts[parts.length - 1];

  // 「漢字を含むか」をざっくり判定
  const hasKanji = /[\u4E00-\u9FFF]/.test(last);

  return hasKanji ? last : displayName;
}
import { SlackAPIClient } from "deno-slack-api/types.ts";

/**
 * ユーザーIDからSlack APIを叩いて表示名を取得・整形する関数
 */
export async function getUserName(client: SlackAPIClient, userId: string): Promise<string> {
  // 1. APIで情報を取得
  const response = await client.users.info({ user: userId });

  if (!response.ok) {
    console.error(`Error fetching user: ${response.error}`);
    return "不明なユーザー";
  }

  const profile = response.user?.profile;

  // 2. 表示名(display_name) を優先し、なければ 本名(real_name) を使う
  // (表示名を設定していない人がいる場合の対策)
  const rawName = profile?.display_name || profile?.real_name || "名無し";

  // 3. 名前の整形処理 (旧 extractName のロジックをここに書く)
  return extractName(rawName);
}
