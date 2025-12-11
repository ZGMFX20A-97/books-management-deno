export const extractFormValues = (values: any): Record<string, string> => {
  const result: Record<string, string> = {};

  // 1. ブロックID (publisher_block, etc.) でループ
  for (const blockId in values) {
    const block = values[blockId];

    // 2. アクションID (publisher_select, etc.) でループ
    for (const actionId in block) {
      const action = block[actionId];

      // 3. 入力タイプに応じて値を取り出す
      // 優先順位:
      // A. テキスト入力やURL入力などは .value に入っている
      // B. プルダウン(static_select)は .selected_option.value に入っている
      // C. 日付(datepicker)は .selected_date に入っている

      const val = action.value ??
        action.selected_option?.value ??
        action.selected_date ??
        action.selected_user ??
        null;

      // 値が存在する場合のみ結果に追加
      if (val !== null) {
        result[actionId] = val;
      }
    }
  }

  return result;
};
