import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import { RemindWorkflow } from "../workflows/remind_workflow.ts";

const RemindTrigger: Trigger<typeof RemindWorkflow.definition> = {
  type: TriggerTypes.Scheduled,
  name: "返却のリマインド",
  description: "毎日の頻度で返却期限をチェック",
  workflow: `#/workflows/${RemindWorkflow.definition.callback_id}`,
  schedule: {
    // 最初の実行日時(UTC)
    start_time: "2025-12-12T05:38:00Z",
    frequency: {
      type: "daily",
    },
  },
};

export default RemindTrigger;
