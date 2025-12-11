import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import { RemindWorkflow } from "../workflows/remind_workflow.ts"; // ※後で作るワークフロー

const RemindTrigger: Trigger<typeof RemindWorkflow.definition> = {
  type: TriggerTypes.Scheduled,
  name: "返却のリマインド",
  description: "毎日9時に返却期限をチェック",
  workflow: `#/workflows/${RemindWorkflow.definition.callback_id}`,
  schedule: {
    // 最初の実行日時 (未来の日付を指定してください)
    start_time: "2025-12-11T15:00:00Z",
    frequency: {
      type: "daily",
    },
  },
};

export default RemindTrigger;
