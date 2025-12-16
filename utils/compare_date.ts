export function compareDate(selectedDate: string) {
  // 入力された日付をDateオブジェクトに変換
  const selected = new Date(selectedDate);
  const today = new Date();

  // 日付の比較を行うため、時分秒ミリ秒を0に設定
  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // 入力日付が今日以降であるかを比較
  return selected >= today;
}
