import PortfolioRepository from "../domain/repositories/portfolioRepository";
import { mapPortfolioResponseToEntity } from "./mappers/portfolioMapper";

const PORTFOLIO_API_URL = "https://dummyjson.com/c/60b7-70a6-4ee3-bae8";

/**
 * Portfolio repository implementation that fetches data from a remote API.
 * @extends PortfolioRepository
 */
export default class RemotePortfolioRepository extends PortfolioRepository {
  async getPortfolio() {
    const response = await fetch(PORTFOLIO_API_URL);

    if (!response.ok) {
      // Error message key: errors.portfolioLoadFailed
      throw new Error("errors.portfolioLoadFailed");
    }

    const data = await response.json();
    return mapPortfolioResponseToEntity(data);
  }
}
