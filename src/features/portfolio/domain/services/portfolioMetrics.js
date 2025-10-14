/**
 * Calculates metadata for a given portfolio.
 * @param {import("../entities/portfolio").Portfolio} portfolio
 */
export function calculatePortfolioMetadata(portfolio) {
  const marketValue = portfolio.holdings.reduce(
    (acc, item) => acc + item.marketValue,
    0
  );

  return {
    holdingsCount: portfolio.holdings.length,
    marketValue,
  };
}
