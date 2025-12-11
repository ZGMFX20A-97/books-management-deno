export function compareDate(selectedDate: string) {
  const selected = new Date(selectedDate);
  const today = new Date();

  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selected >= today;
}
