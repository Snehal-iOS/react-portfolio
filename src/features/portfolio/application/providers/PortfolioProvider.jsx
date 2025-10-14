import { useMemo } from "react";
import PortfolioUseCasesContext from "../contexts/PortfolioUseCasesContext";
import RemotePortfolioRepository from "../../data/remotePortfolioRepository";
import { createGetPortfolioOverviewUseCase } from "../../domain/usecases/getPortfolioOverview";

const repository = new RemotePortfolioRepository();

const PortfolioProvider = ({ children }) => {
  const value = useMemo(
    () => ({
      getPortfolioOverview: createGetPortfolioOverviewUseCase(repository),
    }),
    []
  );

  return (
    <PortfolioUseCasesContext.Provider value={value}>
      {children}
    </PortfolioUseCasesContext.Provider>
  );
};

export default PortfolioProvider;
