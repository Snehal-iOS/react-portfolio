import { calculatePortfolioMetadata } from "../services/portfolioMetrics";

/**
 * Factory for the GetPortfolioOverview use case.
 * @param {import("../repositories/portfolioRepository").default} repository
 */
export function createGetPortfolioOverviewUseCase(repository) {
  return async function getPortfolioOverview() {
    const portfolio = await repository.getPortfolio();

    return {
      portfolio,
      metadata: calculatePortfolioMetadata(portfolio),
    };
  };
}
