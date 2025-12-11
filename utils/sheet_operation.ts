import { google } from "googleapis";
import {
  buildBorrowMsgBlock,
  buildRequestMsgBlock,
  buildReturnMsgBlock,
  buildShelveMsgBlock,
} from "../views/block.ts";
import { Env } from "deno-slack-sdk/types.ts";
import { RequestStatus } from "./value_object.ts";

export class SheetClient {
  private sheets;
  private spreadsheetId: string;

  constructor(env: Env) {
    const auth = new google.auth.JWT({
      email: env["CLIENT_EMAIL"],
      key: env["PRIVATE_KEY"],
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ],
    });

    this.sheets = google.sheets({ version: "v4", auth });
    this.spreadsheetId = env["SPREAD_SHEET_ID"];
  }

  // 全データを取得 (get_all_values相当)
  async getAllValues(range = "管理シート!C:G") {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range,
    });
    return res.data.values || [];
  }

  // 貸出処理
  async borrowBook(
    selectedBook: string,
    userName: string,
    selectedDate: string,
  ) {
    const rows = await this.getAllValues();

    // ヘッダー(0行目)をスキップして探す
    // mapで元の行番号(rowIndex)を保持しておくのがポイント
    const target = rows.map((row, index) => ({ row, index }))
      .slice(1) // ヘッダー飛ばし
      .find(({ row }) => {
        // C列=Title, D列=Status
        return row[0] === selectedBook && row[1] === "書架";
      });
    if (!target) throw new Error("貸し出せる書籍が存在しません");

    const rowIndex = target.index + 1; // スプシは1始まり

    // 今日の日付 (YYYY/MM/DD)
    const today = new Date().toLocaleDateString();
    const returnDate = selectedDate.replaceAll("-", "/");

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `管理シート!D${rowIndex}:G${rowIndex}`,
      valueInputOption: "USER_ENTERED", // プルダウン保持のため重要
      requestBody: {
        values: [["貸出中", userName, today, returnDate]],
      },
    });
    const borrowMsgBlocks = buildBorrowMsgBlock(selectedBook, userName, today, returnDate);

    return borrowMsgBlocks;
  }

  // 返却処理
  async returnBook(selectedBook: string, userName: string) {
    const rows = await this.getAllValues();
    const today = new Date().toLocaleDateString();

    const target = rows.map((row, index) => ({ row, index }))
      .slice(1)
      .find(({ row }) => {
        // C列=Title, D列=Status, E列=Borrower
        return row[0] === selectedBook && row[1] === "貸出中" && row[2] === userName;
      });

    if (!target) throw new Error("借り出した書籍が存在しません");

    const rowIndex = target.index + 1;

    // クリア (D〜G列を空文字で上書き)
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `管理シート!D${rowIndex}:G${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["書架", "", "", ""]],
      },
    });
    const returnMsgBlocks = buildReturnMsgBlock(selectedBook, userName, today);

    return returnMsgBlocks;
  }

  // 自分が借りている本リストを取得
  async getMyBooks(userName: string): Promise<string[]> {
    const rows = await this.getAllValues();
    return rows
      .slice(1)
      .filter((row) => row[1] === "貸出中" && row[2] === userName)
      .map((row) => row[0]); // タイトルを返す
  }

  // 貸出可能な本リストを取得（検索用）
  async getAvailableBooks(keyword: string): Promise<string[]> {
    const rows = await this.getAllValues();
    const formattedKeyword = keyword.toLowerCase().replace(" ", "");
    return rows
      .slice(1)
      .filter((row) => row[1] === "書架")
      .filter((row) => row[0].toLowerCase().replace(" ", "").includes(formattedKeyword)) // プルダウンに合わせて修正
      .map((row) => row[0]);
  }

  async checkDueDate(): Promise<Array<{ bookTitle: string; user: string }>> {
    const rows = await this.getAllValues();
    const today = new Date();
    today.setDate(today.getDate() + 3);
    const targetDate = today.toLocaleDateString();

    return rows
      .slice(1)
      .filter((row) => row[4] === targetDate) // プルダウンに合わせて修正
      .map((row) => ({ bookTitle: row[0], user: row[2] }));
  }

  async shelve(publisher: string, bookTitle: string, url: string) {
    const today = new Date().toLocaleDateString();

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: "管理シート", // シート名（必要に応じて変更）
      valueInputOption: "USER_ENTERED", // 文字列を適切に変換して入力
      requestBody: {
        values: [
          // 追加する行のデータ（配列の配列）
          [
            today, // A列: 配架日
            publisher, // B列: 出版社
            bookTitle, // C列: 書籍名
            "書架", // D列: 貸出状況
            "", // E列: 利用者
            "", // F列: 貸出日
            "", // G列: 返却予定日
            today, // H列: 最終書架確認日
            url, // I列: URL
          ],
        ],
      },
    });
    const shelveMsgBlocks = buildShelveMsgBlock(bookTitle, today);
    return shelveMsgBlocks;
  }
  async request(
    userName: string,
    publisher: string,
    bookTitle: string,
    price: string,
    purchaseMethod: string,
    url: string,
  ) {
    const today = new Date().toLocaleDateString();

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: "申請シート", // シート名（必要に応じて変更）
      valueInputOption: "USER_ENTERED", // 文字列を適切に変換して入力
      requestBody: {
        values: [
          // 追加する行のデータ（配列の配列）
          [
            today,
            userName, // A列: 申請日
            publisher, // B列: 出版社
            bookTitle, // C列: 書籍名
            price, // D列: 価格
            purchaseMethod, // E列: 購入方法
            RequestStatus.PENDING, // F列: 申請状況
            url, // G列: URL
          ],
        ],
      },
    });
    const requestMsgBlocks = buildRequestMsgBlock(userName, today, url, bookTitle);
    return requestMsgBlocks;
  }
}
