import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { BorrowFunction } from "../functions/borrow_function.ts";

const BorrowWorkflow = DefineWorkflow({
  callback_id: "borrow_workflow",
  title: "書籍の貸出",
  description: "書籍を借りる",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

BorrowWorkflow.addStep(
  BorrowFunction,
  {
    interactivity: BorrowWorkflow.inputs.interactivity,
  },
);

export default BorrowWorkflow;
