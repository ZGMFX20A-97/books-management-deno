import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { PurchaseRequestFunction } from "../functions/purchase_request_function.ts";

const PurchaseRequestWorkflow = DefineWorkflow({
  callback_id: "purchase_request_workflow",
  title: "書籍の購入申請",
  description: "書籍の購入を申請する",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

PurchaseRequestWorkflow.addStep(
  PurchaseRequestFunction,
  {
    interactivity: PurchaseRequestWorkflow.inputs.interactivity,
  },
);

export default PurchaseRequestWorkflow;
