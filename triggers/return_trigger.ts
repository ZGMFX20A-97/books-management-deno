import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import ReturnWorkflow from "../workflows/return_workflow.ts";

const ReturnTrigger: Trigger<typeof ReturnWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "/return",
  description: "書籍を返却",
  workflow: `#/workflows/${ReturnWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default ReturnTrigger;
