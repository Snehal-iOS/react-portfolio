import { createHolding } from "../entities/holding";
import { createPortfolio } from "../entities/portfolio";

const MIN_FACTOR = 0.9;
const MAX_FACTOR = 1.1;

function generateRandomFactor() {
  return MIN_FACTOR + Math.random() * (MAX_FACTOR - MIN_FACTOR);
}

/**
 * Produces a new portfolio object with simulated price movements.
 * @param {import("../entities/portfolio").Portfolio} portfolio
 */
export function simulatePortfolioUpdate(portfolio) {
  const updatedHoldings = portfolio.holdings.map((holding, index) => {
    const basePrice = holding.lastTradedPrice || holding.marketValue / Math.max(holding.quantity, 1);
    const randomFactor = generateRandomFactor();
    const newPrice = basePrice * randomFactor;

    const marketValue = newPrice * holding.quantity;
    const pnlValue = marketValue - holding.investedAmount;
    const pnlPercent =
      holding.investedAmount !== 0 ? (pnlValue * 100) / holding.investedAmount : 0;

    return createHolding({
      ...holding,
      id: holding.id ?? `holding-${index}`,
      lastTradedPrice: newPrice,
      marketValue,
      pnlValue,
      pnlPercent,
    });
  });

  const netValue = updatedHoldings.reduce((acc, item) => acc + item.marketValue, 0);
  const pnlValue = updatedHoldings.reduce((acc, item) => acc + item.pnlValue, 0);
  const totalCost = updatedHoldings.reduce((acc, item) => acc + item.investedAmount, 0);
  const pnlPercent = totalCost !== 0 ? (pnlValue * 100) / totalCost : 0;

  return createPortfolio({
    ...portfolio,
    holdings: updatedHoldings,
    netValue,
    pnlValue,
    pnlPercent,
  });
}
