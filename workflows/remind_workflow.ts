import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { RemindFunction } from "../functions/remind_function.ts";

export const RemindWorkflow = DefineWorkflow({
  callback_id: "remind_workflow",
  description: "返却をリマインド",
  title: "リマインダーワークフロー",
});

RemindWorkflow.addStep(RemindFunction, {});

export default RemindWorkflow;
