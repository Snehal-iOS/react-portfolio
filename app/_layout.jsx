import colors from "@/src/core/theme/colors";
import { Stack } from "expo-router";
import ErrorBoundary from "../src/core/components/ErrorBoundary";
import LocalizationProvider from "../src/core/localization/LocalizationProvider";
import PortfolioProvider from "../src/features/portfolio/application/providers/PortfolioProvider.jsx";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <LocalizationProvider>
        <PortfolioProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: colors.backgroundPrimary,
              },
            }}
          >
            <Stack.Screen name="index" options={{ title: "Portfolio" }} />
          </Stack>
        </PortfolioProvider>
      </LocalizationProvider>
    </ErrorBoundary>
  );
}
