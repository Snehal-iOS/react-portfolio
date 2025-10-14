/**
 * @typedef {Object} Holding
 * @property {string} id
 * @property {string} symbol
 * @property {string} name
 * @property {string} exchange
 * @property {number} quantity
 * @property {number} averagePrice
 * @property {number} lastTradedPrice
 * @property {number} investedAmount
 * @property {number} marketValue
 * @property {number} pnlValue
 * @property {number} pnlPercent
 * @property {string} currency
 */

/**
 * Creates an immutable Holding entity.
 * @param {Holding} params
 * @returns {Holding}
 */
export function createHolding(params) {
  const {
    id,
    symbol,
    name,
    exchange,
    quantity,
    averagePrice,
    lastTradedPrice,
    investedAmount,
    marketValue,
    pnlValue,
    pnlPercent,
    currency,
  } = params;

  return Object.freeze({
    id,
    symbol,
    name,
    exchange,
    quantity,
    averagePrice,
    lastTradedPrice,
    investedAmount,
    marketValue,
    pnlValue,
    pnlPercent,
    currency,
  });
}
