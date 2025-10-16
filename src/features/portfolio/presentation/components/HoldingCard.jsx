import { Feather } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../../../../core/theme/colors";
import spacing from "../../../../core/theme/spacing";
import { formatCurrency, formatNumber } from "../../../../core/utils/formatters";
import useLocalization from "../../../../core/localization/useLocalization";

/**
 * Displays a single holding card with performance metrics and trading information.
 * Shows symbol, name, P&L, quantity, average price, last traded price, invested amount, and market value.
 * Supports RTL layouts and press interactions.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.holding - The holding data to display
 * @param {Function} [props.onPress] - Optional callback when card is pressed
 */
const HoldingCard = ({ holding, onPress }) => {
  const { t, isRTL } = useLocalization();
  const isNegative = holding.pnlValue < 0;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isRTL && styles.cardRtl,
        pressed && styles.cardPressed
      ]}
      onPress={() => onPress?.(holding)}
    >
      <View style={[styles.headerRow, isRTL && styles.rowReverse]}>
        <View style={styles.symbolBadge}>
          <Text style={styles.symbolText}>{holding.symbol}</Text>
        </View>
        <View style={[styles.nameBlock, isRTL && styles.nameBlockRtl]}>
          <Text style={[styles.instrumentName, isRTL && styles.textRight]}>
            {holding.name}
          </Text>
          <Text style={[styles.exchangeText, isRTL && styles.textRight]}>
            {holding.exchange}
          </Text>
        </View>
        <View style={[styles.performanceBlock, isRTL && styles.performanceBlockRtl]}>
          <View style={[styles.pnlRow, isRTL && styles.rowReverse]}>
            <Feather
              name={isNegative ? "trending-down" : "trending-up"}
              size={16}
              color={isNegative ? colors.negative : colors.positive}
            />
            <Text
              style={[
                styles.pnlValue,
                { color: isNegative ? colors.negative : colors.positive },
              ]}
            >
              {formatCurrency(holding.pnlValue, holding.currency)}
            </Text>
          </View>
          <View
            style={[
              styles.pnlPercentBadge,
              {
                backgroundColor: isNegative
                  ? "rgba(240, 68, 56, 0.12)"
                  : "rgba(74, 222, 128, 0.16)",
              },
            ]}
          >
            <Text
              style={[
                styles.pnlPercentText,
                { color: isNegative ? colors.negative : colors.positive },
              ]}
            >
              {`${holding.pnlPercent.toFixed(2)}%`}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={[styles.metricsRow, isRTL && styles.rowReverse]}>
        <View style={[styles.metricBlock, isRTL && styles.metricBlockRtl]}>
          <Text style={[styles.metricLabel, isRTL && styles.textRight]}>
            {t("holdings.quantity")}
          </Text>
          <Text style={[styles.metricValue, isRTL && styles.textRight]}>
            {formatNumber(holding.quantity, { maximumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={[styles.metricBlock, isRTL && styles.metricBlockRtl]}>
          <Text style={[styles.metricLabel, isRTL && styles.textRight]}>
            {t("holdings.average")}
          </Text>
          <Text style={[styles.metricValue, isRTL && styles.textRight]}>
            {formatCurrency(holding.averagePrice, holding.currency)}
          </Text>
        </View>
        <View style={[styles.metricBlock, isRTL && styles.metricBlockRtl]}>
          <Text style={[styles.metricLabel, isRTL && styles.textRight]}>
            {t("holdings.lastTrade")}
          </Text>
          <Text style={[styles.metricValue, isRTL && styles.textRight]}>
            {formatCurrency(holding.lastTradedPrice, holding.currency)}
          </Text>
        </View>
        <View style={[styles.metricBlock, isRTL && styles.metricBlockRtl]}>
          <Text style={[styles.metricLabel, isRTL && styles.textRight]}>
            {t("holdings.invested")}
          </Text>
          <Text style={[styles.metricValue, isRTL && styles.textRight]}>
            {formatCurrency(holding.investedAmount, holding.currency)}
          </Text>
        </View>
      </View>

      <View style={[styles.footerRow, isRTL && styles.rowReverse]}>
        <Text style={[styles.footerLabel, isRTL && styles.textRight]}>
          {t("holdings.marketValue")}
        </Text>
        <Text style={[styles.footerValue, isRTL && styles.textRight]}>
          {formatCurrency(holding.marketValue, holding.currency)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    backgroundColor: colors.backgroundCard,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    shadowColor: "rgba(15, 23, 42, 0.08)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 12,
  },
  cardRtl: {
    writingDirection: "rtl",
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  symbolBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: "rgba(59, 130, 246, 0.12)",
    borderRadius: 12,
  },
  symbolText: {
    color: colors.accent,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  nameBlock: {
    flex: 1,
    marginStart: spacing.md,
  },
  nameBlockRtl: {
    marginStart: 0,
    marginEnd: spacing.md,
    alignItems: "flex-end",
  },
  instrumentName: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 16,
  },
  exchangeText: {
    color: colors.textMuted,
    marginTop: 4,
  },
  performanceBlock: {
    alignItems: "flex-end",
  },
  performanceBlockRtl: {
    alignItems: "flex-start",
  },
  pnlRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pnlValue: {
    fontWeight: "600",
    fontSize: 16,
    marginStart: spacing.xs,
  },
  pnlPercentBadge: {
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  pnlPercentText: {
    fontWeight: "600",
    fontSize: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.lg,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  metricBlock: {
    flex: 1,
    alignItems: "center",
  },
  metricBlockRtl: {
    alignItems: "center",
  },
  metricLabel: {
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  metricValue: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLabel: {
    color: colors.textMuted,
  },
  footerValue: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 16,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  textRight: {
    textAlign: "right",
  },
});

HoldingCard.propTypes = {
  holding: PropTypes.shape({
    id: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    exchange: PropTypes.string.isRequired,
    pnlValue: PropTypes.number.isRequired,
    pnlPercent: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    averagePrice: PropTypes.number.isRequired,
    lastTradedPrice: PropTypes.number.isRequired,
    investedAmount: PropTypes.number.isRequired,
    marketValue: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
  }).isRequired,
  onPress: PropTypes.func,
};

export default HoldingCard;
