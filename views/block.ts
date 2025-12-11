export function buildBorrowMsgBlock(
  bookTitle: string,
  userName: string,
  today: string,
  returnDate: string,
) {
  const msgBlock = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "📚 書籍が貸し出されました",
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*書籍名:*\n${bookTitle}`,
        },
        {
          type: "mrkdwn",
          text: `*借りた人:*\n${userName}`, // user_idをメンション形式にする
        },
        {
          type: "mrkdwn",
          text: `*貸出日:*\n${today}`, // user_idをメンション形式にする
        },
        {
          type: "mrkdwn",
          text: `*返却予定日:*\n${returnDate}`,
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          "type": "mrkdwn",
          "text": "⚠️ 読み終わったら早めに返却してくださいね",
        },
      ],
    },
  ];
  return msgBlock;
}
export function buildReturnMsgBlock(bookTitle: string, userName: string, today: string) {
  const msgBlock = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "📚 書籍が返却されました",
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*書籍名:*\n${bookTitle}`,
        },
        {
          type: "mrkdwn",
          text: `*返した人:*\n${userName}`, // user_idをメンション形式にする
        },
        {
          type: "mrkdwn",
          text: `*返却日:*\n${today}`,
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          "type": "mrkdwn",
          "text": "🤓 返却ありがとうございます！",
        },
      ],
    },
  ];
  return msgBlock;
}

export function buildShelveMsgBlock(bookTitle: string, today: string) {
  const msgBlock = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "📚 書籍が配架されました",
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*書籍名:*\n${bookTitle}`,
        },
        {
          type: "mrkdwn",
          text: `*配架日:*\n${today}`,
        },
      ],
    },
  ];
  return msgBlock;
}
export function buildRequestMsgBlock(
  userName: string,
  today: string,
  url: string,
  bookTitle: string,
) {
  const msgBlock = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "書籍の購入申請が入りました:",
      },
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": `*申請者:*\n${userName}`,
        },
        {
          "type": "mrkdwn",
          "text": `*申請日:*\n${today}`,
        },
        {
          "type": "mrkdwn",
          "text": `*書籍:*\n*<${url}|${bookTitle}>*`,
        },
      ],
    },
  ];
  return msgBlock;
}
