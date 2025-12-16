import { Env } from "deno-slack-sdk/types.ts";
import {
  buildBorrowMsgBlock,
  buildRequestMsgBlock,
  buildReturnMsgBlock,
  buildShelveMsgBlock,
} from "../views/block.ts";

export async function borrowBook(
  env: Env,
  selectedBook: string,
  userName: string,
  selectedDate: string,
) {
  const returnDate = selectedDate.replaceAll("-", "/");
  // 処理の詳細はAppsScriptの中身を参照
  const response = await fetch(env["GAS_URL"], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "borrowBook",
      selectedBook,
      userName,
      returnDate,
    }),
  });
  const result = await response.json();

  if (result.error) {
    throw Error(result.error);
  }

  const borrowMsgBlocks = buildBorrowMsgBlock(
    selectedBook,
    result.userId,
    result.borrowedDate,
    returnDate,
  );

  return borrowMsgBlocks;
}

export async function getAvailableBooks(env: Env, keyword: string): Promise<string[]> {
  const formattedKeyword = keyword.toLowerCase().replace(" ", "");
  const response = await fetch(env["GAS_URL"], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "getAvailableBooks",
      keyword: formattedKeyword,
    }),
    redirect: "follow",
  });
  const result = await response.json();

  if (result.error) {
    throw Error(result.error);
  }
  console.log(result.books);
  return result.books;
}

export async function updateUserMasterData(env: Env, users: string[][]) {
  const response = await fetch(env["GAS_URL"], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updateMaster",
      users,
    }),
    redirect: "follow",
  });
  const result = await response.json();

  if (result.error) {
    throw Error(result.error);
  }

  console.log(result.message);
}

export async function request(
  env: Env,
  userName: string,
  publisher: string,
  bookTitle: string,
  price: string,
  purchaseMethod: string,
  url: string,
) {
  const response = await fetch(env["GAS_URL"], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "purchaseRequest",
      userName,
      publisher,
      bookTitle,
      price,
      purchaseMethod,
      url,
    }),
    redirect: "follow",
  });
  const result = await response.json();

  if (result.error) {
    throw Error(result.error);
  }

  console.log(result.message);

  const requestMsgBlocks = buildRequestMsgBlock(
    result.userId,
    result.requestedDate,
    url,
    bookTitle,
  );
  return requestMsgBlocks;
}

export async function checkDueDate(
  env: Env,
): Promise<Array<{ bookTitle: string; userId: string }>> {
  const response = await fetch(env["GAS_URL"], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "checkDueDate",
    }),
    redirect: "follow",
  });
  const result = await response.json();

  if (result.error) {
    throw Error(result.error);
  }

  console.log(JSON.stringify(result.reminderTargets));
  return result.reminderTargets;
}

export async function getMyBooks(env: Env, userName: string): Promise<string[]> {
  const response = await fetch(env["GAS_URL"], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "getMyBooks",
      userName,
    }),
    redirect: "follow",
  });

  const result = await response.json();

  if (result.error) {
    throw Error(result.error);
  }

  console.log(result.message);
  return result.books;
}

export async function returnBook(env: Env, selectedBook: string, userName: string) {
  const response = await fetch(env["GAS_URL"], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "returnBook",
      selectedBook,
      userName,
    }),
    redirect: "follow",
  });

  const result = await response.json();

  if (result.error) {
    throw Error(result.error);
  }

  console.log(result.message);
  const returnMsgBlocks = buildReturnMsgBlock(selectedBook, result.userId, result.returnedDate);

  return returnMsgBlocks;
}

export async function shelve(env: Env, publisher: string, bookTitle: string, url: string) {
  const response = await fetch(env["GAS_URL"], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "shelve",
      publisher,
      bookTitle,
      url,
    }),
    redirect: "follow",
  });

  const result = await response.json();

  if (result.error) {
    throw Error(result.error);
  }

  console.log(result.message);
  const shelveMsgBlocks = buildShelveMsgBlock(bookTitle, result.registeredDate);
  return shelveMsgBlocks;
}
