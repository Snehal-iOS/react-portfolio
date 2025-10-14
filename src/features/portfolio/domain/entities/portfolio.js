/**
 * @typedef {import("./holding").Holding} Holding
 */

/**
 * @typedef {Object} Portfolio
 * @property {string} id
 * @property {string} ownerName
 * @property {number} netValue
 * @property {number} pnlValue
 * @property {number} pnlPercent
 * @property {string} baseCurrency
 * @property {Holding[]} holdings
 */

/**
 * Builds a Portfolio aggregate with basic validation.
 * @param {Portfolio} params
 * @returns {Portfolio}
 */
export function createPortfolio(params) {
  const {
    id,
    ownerName,
    netValue,
    pnlValue,
    pnlPercent,
    baseCurrency,
    holdings,
  } = params;

  if (!Array.isArray(holdings)) {
    throw new Error("Portfolio holdings must be an array");
  }

  return Object.freeze({
    id,
    ownerName,
    netValue,
    pnlValue,
    pnlPercent,
    baseCurrency,
    holdings,
  });
}
