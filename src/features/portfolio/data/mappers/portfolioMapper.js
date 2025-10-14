import { createHolding } from "../../domain/entities/holding";
import { createPortfolio } from "../../domain/entities/portfolio";

const DEFAULT_OWNER = "John Doe";
const DEFAULT_CURRENCY = "USD";

/**
 * Normalises API payload into domain entities.
 * @param {any} payload
 */
export function mapPortfolioResponseToEntity(payload) {
  if (!payload || !payload.portfolio) {
    throw new Error("Invalid portfolio response");
  }

  const { portfolio } = payload;
  const balance = portfolio.balance ?? {};
  const positions = Array.isArray(portfolio.positions) ? portfolio.positions : [];

  const holdings = positions.map((position, index) => {
    const instrument = position.instrument ?? {};

    return createHolding({
      id: `${instrument.ticker ?? `holding-${index}`}`.toLowerCase(),
      symbol: instrument.ticker ?? "N/A",
      name: instrument.name ?? "Unknown Instrument",
      exchange: instrument.exchange ?? "Unknown Exchange",
      quantity: Number(position.quantity ?? 0),
      averagePrice: Number(position.averagePrice ?? 0),
      lastTradedPrice: Number(instrument.lastTradedPrice ?? 0),
      investedAmount: Number(position.cost ?? 0),
      marketValue: Number(position.marketValue ?? 0),
      pnlValue: Number(position.pnl ?? 0),
      pnlPercent: Number(position.pnlPercentage ?? 0),
      currency: instrument.currency ?? DEFAULT_CURRENCY,
    });
  });

  return createPortfolio({
    id: payload.portfolio.id ?? "remote-portfolio",
    ownerName: payload.portfolio.ownerName ?? DEFAULT_OWNER,
    netValue: Number(balance.netValue ?? 0),
    pnlValue: Number(balance.pnl ?? 0),
    pnlPercent: Number(balance.pnlPercentage ?? 0),
    baseCurrency: balance.currency ?? DEFAULT_CURRENCY,
    holdings,
  });
}
