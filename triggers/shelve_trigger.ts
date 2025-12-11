import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import ShelveWorkflow from "../workflows/shelve_workflow.ts";

const ShelveTrigger: Trigger<typeof ShelveWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "/shelve",
  description: "書籍を配架",
  workflow: `#/workflows/${ShelveWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default ShelveTrigger;
