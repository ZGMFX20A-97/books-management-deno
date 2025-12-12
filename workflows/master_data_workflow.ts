import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { MasterDataFunction } from "../functions/master_data_function.ts";

export const MasterDataWorkflow = DefineWorkflow({
  callback_id: "master_data_workflow",
  description: "利用者マスタデータの整理",
  title: "マスタデータワークフロー",
});

MasterDataWorkflow.addStep(MasterDataFunction, {});

export default MasterDataWorkflow;
