import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import PurchaseRequestWorkflow from "../workflows/purchase_request_workflow.ts";

const PurchaseRequestTrigger: Trigger<typeof PurchaseRequestWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "/request",
  description: "書籍の購入を申請",
  workflow: `#/workflows/${PurchaseRequestWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default PurchaseRequestTrigger;
