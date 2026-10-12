/**
 * Money as people read it (the API's common/money.ts, same rule). The
 * marketplace prices in US dollars, so USD (or no currency) shows "$1,250". A
 * record that carries another currency code shows the code after the amount
 * ("1,250 EUR") instead of a dollar sign it doesn't have.
 */
export function formatMoney(
  amount: number,
  currency?: string | null,
  { cents = false }: { cents?: boolean } = {},
): string {
  const value = cents ? amount / 100 : amount;
  const digits = value.toLocaleString("en-US", {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: 2,
  });
  const code = (currency ?? "").trim().toUpperCase();
  return !code || code === "USD" ? `$${digits}` : `${digits} ${code}`;
}
