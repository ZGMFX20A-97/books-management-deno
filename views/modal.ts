export const borrowModal = {
  "title": {
    "type": "plain_text",
    "text": "書籍の貸出",
  },
  "submit": {
    "type": "plain_text",
    "text": "貸出",
  },
  "type": "modal",
  "callback_id": "borrow_modal",
  "notify_on_close": true,

  "close": {
    "type": "plain_text",
    "text": "キャンセル",
  },
  "blocks": [
    {
      "type": "input",
      "block_id": "book_block",
      "optional": false,
      "label": {
        "type": "plain_text",
        "text": "書籍を検索",
      },
      "element": {
        "type": "external_select",
        "action_id": "bookTitle_select",
        "placeholder": {
          "type": "plain_text",
          "text": "書籍名を検索...",
        },
        "min_query_length": 1,
      },
    },
    {
      "type": "input",
      "block_id": "date_block",
      "optional": false,
      "label": {
        "type": "plain_text",
        "text": "返却予定日",
      },
      "element": {
        "type": "datepicker",
        "action_id": "date_select",
        "placeholder": {
          "type": "plain_text",
          "text": "返却予定日を選択",
        },
      },
    },
  ],
};

export const returnModal = {
  "type": "modal",
  "callback_id": "return_modal",
  "title": { type: "plain_text", text: "書籍の返却" },
  "close": { type: "plain_text", text: "キャンセル" },
  "submit": {
    "type": "plain_text",
    "text": "返却",
  },
  "blocks": [
    {
      "type": "input",
      "block_id": "book_block",
      "optional": false,
      "label": {
        "type": "plain_text",
        "text": "あなたが借りた書籍",
      },
      "element": {
        "type": "external_select",
        "action_id": "BookTitle_select",
        "placeholder": {
          "type": "plain_text",
          "text": "クリックして候補を見る",
        },
        "min_query_length": 0,
      },
    },
  ],
};

export const shelveModal = {
  "type": "modal",
  "callback_id": "shelve_modal",
  "title": { type: "plain_text", text: "書籍の配架" },
  "close": { type: "plain_text", text: "キャンセル" },
  "submit": {
    "type": "plain_text",
    "text": "配架",
  },
  "blocks": [
    {
      "type": "input",
      "block_id": "publisher_block",
      "optional": false,
      "label": {
        "type": "plain_text",
        "text": "出版社",
      },
      "element": {
        "type": "plain_text_input",
        "action_id": "publisher_select",
        "placeholder": {
          "type": "plain_text",
          "text": "出版社を入力してください",
        },
      },
    },
    {
      "type": "input",
      "block_id": "book_block",
      "optional": false,
      "label": {
        "type": "plain_text",
        "text": "書籍名",
      },
      "element": {
        "type": "plain_text_input",
        "action_id": "bookTitle_select",
        "placeholder": {
          "type": "plain_text",
          "text": "書籍名を入力してください",
        },
      },
    },
    {
      "type": "input",
      "block_id": "url_block",
      "optional": true,
      "label": {
        "type": "plain_text",
        "text": "書籍の商品ページURL",
      },
      "element": {
        "type": "url_text_input",
        "action_id": "url_select",
        "placeholder": {
          "type": "plain_text",
          "text": "書籍の商品ページURLを入力",
        },
      },
    },
  ],
};
export const purchaseRequestModal = {
  "type": "modal",
  "callback_id": "purchase_request_modal",
  "title": { "type": "plain_text", "text": "書籍の購入申請" },
  "close": { "type": "plain_text", "text": "キャンセル" },
  "submit": {
    "type": "plain_text",
    "text": "申請",
  },
  "blocks": [
    {
      "type": "input",
      "block_id": "publisher_block",
      "optional": false,
      "label": {
        "type": "plain_text",
        "text": "出版社",
      },
      "element": {
        "type": "plain_text_input",
        "action_id": "publisher_select",
        "placeholder": {
          "type": "plain_text",
          "text": "出版社を入力してください",
        },
      },
    },
    {
      "type": "input",
      "block_id": "book_block",
      "optional": false,
      "label": {
        "type": "plain_text",
        "text": "書籍名",
      },
      "element": {
        "type": "plain_text_input",
        "action_id": "bookTitle_select",
        "placeholder": {
          "type": "plain_text",
          "text": "書籍名を入力してください",
        },
      },
    },
    {
      "type": "input",
      "block_id": "price_block",
      "optional": false,
      "label": {
        "type": "plain_text",
        "text": "価格（税込）",
      },
      "element": {
        "type": "number_input",
        "is_decimal_allowed": false,
        "action_id": "price_select",
        "placeholder": {
          "type": "plain_text",
          "text": "例: 2500",
        },
      },
    },
    {
      "type": "input",
      "block_id": "url_block",
      "optional": false,
      "label": {
        "type": "plain_text",
        "text": "書籍の商品ページURL",
      },
      "element": {
        "type": "url_text_input",
        "action_id": "url_select",
        "placeholder": {
          "type": "plain_text",
          "text": "書籍の商品ページURLを入力",
        },
      },
    },
    {
      "type": "input",
      "block_id": "purchase_method_block",
      "optional": false,
      "label": {
        "type": "plain_text",
        "text": "購入方法",
      },
      "element": {
        "type": "static_select",
        "action_id": "purchaseMethod_select",
        "placeholder": {
          "type": "plain_text",
          "text": "購入方法を選択",
        },
        "options": [
          {
            "text": { "type": "plain_text", "text": "購入依頼" },
            "value": "購入依頼",
          },
          {
            "text": { "type": "plain_text", "text": "立替" },
            "value": "立替",
          },
        ],
      },
    },
    {
      type: "context",
      elements: [
        {
          "type": "mrkdwn",
          "text": "💸 立替の場合は精算申請してくださいね",
        },
      ],
    },
  ],
};
