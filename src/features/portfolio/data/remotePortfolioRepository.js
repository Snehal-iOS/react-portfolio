import PortfolioRepository from "../domain/repositories/portfolioRepository";
import { mapPortfolioResponseToEntity } from "./mappers/portfolioMapper";

const PORTFOLIO_API_URL = "https://dummyjson.com/c/60b7-70a6-4ee3-bae8";

export default class RemotePortfolioRepository extends PortfolioRepository {
  async getPortfolio() {
    const response = await fetch(PORTFOLIO_API_URL);

    if (!response.ok) {
      throw new Error("Unable to load portfolio data");
    }

    const data = await response.json();
    return mapPortfolioResponseToEntity(data);
  }
}
