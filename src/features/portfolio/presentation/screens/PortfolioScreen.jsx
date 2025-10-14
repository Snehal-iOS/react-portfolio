import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../core/theme/colors";
import spacing from "../../../../core/theme/spacing";
import HoldingsList from "../components/HoldingsList";
import PortfolioHeader from "../components/PortfolioHeader";
import usePortfolioOverview from "../hooks/usePortfolioOverview";
import useLocalization from "../../../../core/localization/useLocalization";

const PortfolioScreen = () => {
  const { portfolio, metadata, status, error } = usePortfolioOverview();
  const { t, isRTL } = useLocalization();

  if (status === "loading") {
    return (
      <SafeAreaView style={[styles.safeArea, isRTL && styles.safeAreaRtl]}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loaderText}>{t("common.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === "error") {
    return (
      <SafeAreaView style={[styles.safeArea, isRTL && styles.safeAreaRtl]}>
        <View style={styles.loaderContainer}>
          <Text style={styles.errorTitle}>{t("common.errorTitle")}</Text>
          <Text style={styles.errorSubtitle}>
            {error?.message ?? t("common.errorSubtitle")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, isRTL && styles.safeAreaRtl]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.scrollContent,
          isRTL && styles.scrollContentRtl,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <PortfolioHeader portfolio={portfolio} />
        <HoldingsList holdings={portfolio.holdings} count={metadata.holdingsCount} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  safeAreaRtl: {
    writingDirection: "rtl",
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  scrollContentRtl: {
    writingDirection: "rtl",
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  loaderText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  errorSubtitle: {
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default PortfolioScreen;
