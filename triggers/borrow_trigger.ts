import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import BorrowWorkflow from "../workflows/borrow_workflow.ts";

const BorrowTrigger: Trigger<typeof BorrowWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "/borrow",
  description: "書籍を貸出す",
  workflow: `#/workflows/${BorrowWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default BorrowTrigger;
