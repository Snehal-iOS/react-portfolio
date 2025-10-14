import { useContext, useEffect, useRef, useState } from "react";
import { calculatePortfolioMetadata } from "../../domain/services/portfolioMetrics";
import { simulatePortfolioUpdate } from "../../domain/services/portfolioSimulator";
import PortfolioUseCasesContext from "../../application/contexts/PortfolioUseCasesContext";

/**
 * Provides portfolio overview data and loading state.
 */
export default function usePortfolioOverview() {
  const [state, setState] = useState({
    portfolio: null,
    metadata: { holdingsCount: 0, marketValue: 0 },
    status: "loading",
    error: null,
  });

  const { getPortfolioOverview } = useContext(PortfolioUseCasesContext);
  const simulationRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const result = await getPortfolioOverview();
        if (isMounted) {
          setState({
            ...result,
            status: "success",
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            status: "error",
            error,
          }));
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [getPortfolioOverview]);

  useEffect(() => {
    if (state.status === "success" && !simulationRef.current) {
      simulationRef.current = setInterval(() => {
        setState((prevState) => {
          if (prevState.status !== "success" || !prevState.portfolio) {
            return prevState;
          }

          const updatedPortfolio = simulatePortfolioUpdate(prevState.portfolio);
          return {
            ...prevState,
            portfolio: updatedPortfolio,
            metadata: calculatePortfolioMetadata(updatedPortfolio),
          };
        });
      }, 1000);
    }

    if (state.status !== "success" && simulationRef.current) {
      clearInterval(simulationRef.current);
      simulationRef.current = null;
    }

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
    };
  }, [state.status]);

  return state;
}
