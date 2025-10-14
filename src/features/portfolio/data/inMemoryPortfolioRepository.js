import { createHolding } from "../domain/entities/holding";
import { createPortfolio } from "../domain/entities/portfolio";
import PortfolioRepository from "../domain/repositories/portfolioRepository";

const demoHoldings = [
  createHolding({
    id: "sxr8",
    symbol: "SXR8",
    name: "iShares Core S&P 500",
    exchange: "IBIS",
    quantity: 8,
    averagePrice: 393.77,
    lastTradedPrice: 191.85,
    investedAmount: 3307.7,
    marketValue: 1611.53,
    pnlValue: -1696.17,
    pnlPercent: -51.28,
    currency: "EUR",
  }),
  createHolding({
    id: "goog",
    symbol: "GOOG",
    name: "Alphabet Inc.",
    exchange: "NASDAQ",
    quantity: 12,
    averagePrice: 88.16,
    lastTradedPrice: 32.36,
    investedAmount: 1066.7,
    marketValue: 388.32,
    pnlValue: -678.38,
    pnlPercent: -63.58,
    currency: "USD",
  }),
  createHolding({
    id: "tsla",
    symbol: "TSLA",
    name: "Tesla, Inc.",
    exchange: "NASDAQ",
    quantity: 5,
    averagePrice: 220.12,
    lastTradedPrice: 180.44,
    investedAmount: 1100.6,
    marketValue: 902.2,
    pnlValue: -198.4,
    pnlPercent: -18.03,
    currency: "USD",
  }),
];

const demoPortfolio = createPortfolio({
  id: "portfolio-001",
  ownerName: "John Doe",
  netValue: 5235.12,
  pnlValue: -3655.78,
  pnlPercent: -41.12,
  baseCurrency: "USD",
  holdings: demoHoldings,
});

export default class InMemoryPortfolioRepository extends PortfolioRepository {
  async getPortfolio() {
    return demoPortfolio;
  }
}
