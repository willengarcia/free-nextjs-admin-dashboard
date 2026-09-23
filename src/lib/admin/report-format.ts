const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
export const formatReportMoney = (value: number) => currency.format(value);

// Spring returns local dates/times without a zone. Preserve that wall-clock time
// and do not parse date-only strings as UTC (which shifts the day in Brazil).
export function formatReportDate(
  value: string | null,
  withTime = true,
): string | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(value);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  return `${day}/${month}/${year}${withTime && hour ? ` ${hour}:${minute}` : ""}`;
}
