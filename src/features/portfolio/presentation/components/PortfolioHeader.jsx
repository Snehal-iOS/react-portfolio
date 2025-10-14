import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../../../core/theme/colors";
import spacing from "../../../../core/theme/spacing";
import { formatCurrency } from "../../../../core/utils/formatters";
import useLocalization from "../../../../core/localization/useLocalization";

const PortfolioHeader = ({ portfolio }) => {
  const { t, toggleLocale, isRTL } = useLocalization();
  const isNegative = portfolio.pnlValue < 0;
  const pnlColor = isNegative ? colors.backgroundCard : colors.pnlNegativeBg;
  const pnlTextColor = isNegative ? colors.pnlNegativeText : colors.pnlPositiveText;
  const pnlLabelColor = colors.whiteOverlay75;

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientContainer, isRTL && styles.gradientContainerRtl]}
    >
      <View
        style={[styles.headerTopRow, isRTL && styles.rowReverse]}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={24} color={colors.gradientEnd} />
        </View>
        <View
          style={[styles.ownerInfo, isRTL && styles.ownerInfoRtl]}
        >
          <Text
            style={[styles.ownerName, isRTL && styles.textRight]}
          >
            {portfolio.ownerName}
          </Text>
          <Text
            style={[styles.netValueLabel, isRTL && styles.textRight]}
          >
            {t("portfolio.netValue")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleLocale}
          style={[styles.languagePill, isRTL && styles.rowReverse]}
          accessibilityRole="button"
          accessibilityLabel={t("portfolio.toggleLabel")}
        >
          <Feather name="globe" size={18} color={colors.backgroundCard} />
          <Text style={styles.languageText}>{t("portfolio.toggleTo")}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.netValue}>
        {formatCurrency(portfolio.netValue, portfolio.baseCurrency)}
      </Text>

      <View style={styles.pnlCard}>
        <View style={styles.pnlLeft}>
          <Text
            style={[
              styles.pnlLabel,
              { color: pnlLabelColor },
              isRTL && styles.textRight,
            ]}
          >
            {t("portfolio.pnl")}
          </Text>
          <View
            style={[styles.pnlValueRow, isRTL && styles.rowReverse]}
          >
            <Feather
              name={isNegative ? "trending-down" : "trending-up"}
              size={18}
              color={pnlTextColor}
            />
            <Text style={[styles.pnlValue, { color: pnlTextColor }]}>
              {formatCurrency(portfolio.pnlValue, portfolio.baseCurrency)}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.pnlChangePill,
            {
              backgroundColor: pnlColor,
            },
            isRTL && styles.rowReverse,
          ]}
        >
          <Feather
            name={isNegative ? "arrow-down-right" : "arrow-up-right"}
            size={16}
            color={isNegative ? colors.negative : colors.positive}
          />
          <Text
            style={[
              styles.pnlChangeText,
              { color: isNegative ? colors.negative : colors.positive },
            ]}
          >
            {`${portfolio.pnlPercent.toFixed(2)}%`}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: 32,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 18,
  },
  gradientContainerRtl: {
    writingDirection: "rtl",
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.whiteOverlay28,
    alignItems: "center",
    justifyContent: "center",
  },
  ownerInfo: {
    flex: 1,
    marginStart: spacing.md,
  },
  ownerName: {
    color: colors.backgroundCard,
    fontSize: 18,
    fontWeight: "600",
  },
  netValueLabel: {
    color: colors.whiteOverlay75,
    marginTop: 4,
    fontSize: 14,
  },
  languagePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.whiteOverlay24,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 18,
  },
  languageText: {
    color: colors.backgroundCard,
    fontWeight: "600",
    fontSize: 14,
    marginStart: spacing.xs,
  },
  netValue: {
    color: colors.backgroundCard,
    fontSize: 38,
    fontWeight: "700",
    marginBottom: spacing.lg,
  },
  pnlCard: {
    backgroundColor: colors.whiteOverlay16,
    borderRadius: 24,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pnlLabel: {
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  pnlLeft: {
    flexDirection: "column",
  },
  pnlValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pnlValue: {
    fontSize: 22,
    fontWeight: "600",
    marginStart: spacing.sm,
  },
  pnlChangePill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  pnlChangeText: {
    fontSize: 16,
    fontWeight: "600",
    marginStart: spacing.xs,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  ownerInfoRtl: {
    marginStart: 0,
    marginEnd: spacing.md,
    alignItems: "flex-end",
  },
  textRight: {
    textAlign: "right",
  },
});

export default PortfolioHeader;
