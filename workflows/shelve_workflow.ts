import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ShelveFunction } from "../functions/shelve_function.ts";

const ShelveWorkflow = DefineWorkflow({
  callback_id: "shelve_workflow",
  title: "書籍の配架",
  description: "書籍を配架する",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

ShelveWorkflow.addStep(
  ShelveFunction,
  {
    interactivity: ShelveWorkflow.inputs.interactivity,
  },
);

export default ShelveWorkflow;
