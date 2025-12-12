import { SlackAPIClient } from "deno-slack-api/types.ts";

export async function fetchChannelMembers(
  client: SlackAPIClient,
  channelId: string,
): Promise<string[]> {
  const response = await client.conversations.members({
    channel: channelId,
    limit: 1000, // 一回で取れる最大数にしておく
  });

  if (!response.ok) {
    console.error(`Error fetching members: ${response.error}`);
    return [];
  }

  return response.members ?? [];
}
