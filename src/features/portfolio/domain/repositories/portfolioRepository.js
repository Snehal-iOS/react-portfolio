/**
 * Abstract repository to retrieve portfolio data.
 * Concrete implementations should provide actual data sources.
 */
export default class PortfolioRepository {
  /**
   * @returns {Promise<import("../entities/portfolio").Portfolio>}
   */
  async getPortfolio() {
    throw new Error(`${this.constructor.name} must implement getPortfolio`);
  }
}
