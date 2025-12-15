import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import MasterDataWorkflow from "../workflows/master_data_workflow.ts";

const MasterDataTrigger: Trigger<typeof MasterDataWorkflow.definition> = {
  type: TriggerTypes.Scheduled,
  name: "利用者マスタデータの整理",
  description: "毎日の頻度で利用者マスタデータを整理",
  workflow: `#/workflows/${MasterDataWorkflow.definition.callback_id}`,
  schedule: {
    // 最初の実行日時(UTC)
    start_time: "2025-12-15T15:00:00Z",
    frequency: {
      type: "daily",
    },
  },
};

export default MasterDataTrigger;
