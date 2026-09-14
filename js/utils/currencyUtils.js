// Formats a numeric amount as an Indian Rupee display string, e.g. 10500 -> "₹10,500".
const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount) {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "—";
  return INR_FORMATTER.format(amount);
}
