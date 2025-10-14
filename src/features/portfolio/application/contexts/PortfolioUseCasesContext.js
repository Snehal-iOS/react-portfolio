import { createContext } from "react";

const PortfolioUseCasesContext = createContext({
  getPortfolioOverview: async () => ({
    portfolio: null,
    metadata: { holdingsCount: 0, marketValue: 0 },
  }),
});

export default PortfolioUseCasesContext;
