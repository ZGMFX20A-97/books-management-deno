import { Manifest } from "deno-slack-sdk/mod.ts";
import BorrowWorkflow from "./workflows/borrow_workflow.ts";
import { BorrowFunction } from "./functions/borrow_function.ts";
import ReturnWorkflow from "./workflows/return_workflow.ts";
import { ReturnFunction } from "./functions/return_function.ts";
import RemindWorkflow from "./workflows/remind_workflow.ts";
import { RemindFunction } from "./functions/remind_function.ts";
import { ShelveFunction } from "./functions/shelve_function.ts";
import ShelveWorkflow from "./workflows/shelve_workflow.ts";
import PurchaseRequestWorkflow from "./workflows/purchase_request_workflow.ts";
import { PurchaseRequestFunction } from "./functions/purchase_request_function.ts";
import MasterDataWorkflow from "./workflows/master_data_workflow.ts";
import { MasterDataFunction } from "./functions/master_data_function.ts";

export default Manifest({
  name: "LibraryBot",
  description: "書籍管理ボット",
  icon: "assets/icon.png",
  workflows: [
    BorrowWorkflow,
    ReturnWorkflow,
    RemindWorkflow,
    ShelveWorkflow,
    PurchaseRequestWorkflow,
    MasterDataWorkflow,
  ],
  functions: [
    BorrowFunction,
    ReturnFunction,
    RemindFunction,
    ShelveFunction,
    PurchaseRequestFunction,
    MasterDataFunction,
  ],
  outgoingDomains: [
    "www.googleapis.com",
    "oauth2.googleapis.com",
    "sheets.googleapis.com",
    "script.google.com",
    "script.googleusercontent.com",
  ],
  datastores: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "users:read",
    "channels:read",
    "groups:read",
    "im:read",
  ],
});
