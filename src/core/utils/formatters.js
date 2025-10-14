const currencyFormatterCache = {};

/**
 * Formats a numeric value into a currency string.
 * @param {number} value
 * @param {string} currency
 */
export function formatCurrency(value, currency = "USD") {
  const cacheKey = currency;
  if (!currencyFormatterCache[cacheKey]) {
    currencyFormatterCache[cacheKey] = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    });
  }

  return currencyFormatterCache[cacheKey].format(value);
}

/**
 * Formats a numeric value with default locale options.
 * @param {number} value
 * @param {Intl.NumberFormatOptions} options
 */
export function formatNumber(value, options) {
  return new Intl.NumberFormat("en-US", options).format(value);
}
