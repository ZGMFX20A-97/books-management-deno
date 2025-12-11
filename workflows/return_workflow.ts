import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ReturnFunction } from "../functions/return_function.ts";

const ReturnWorkflow = DefineWorkflow({
  callback_id: "return_workflow",
  title: "書籍の返却",
  description: "書籍を返す",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

ReturnWorkflow.addStep(
  ReturnFunction,
  {
    interactivity: ReturnWorkflow.inputs.interactivity,
  },
);

export default ReturnWorkflow;
