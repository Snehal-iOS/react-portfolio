import PropTypes from "prop-types";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../../../core/theme/colors";
import spacing from "../../../../core/theme/spacing";
import HoldingCard from "./HoldingCard";
import useLocalization from "../../../../core/localization/useLocalization";

/**
 * Displays a list of holdings with a header showing the total count.
 * Supports RTL layouts and delegates press events to individual holding cards.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.holdings - Array of holding objects to display
 * @param {number} props.count - Total count of holdings
 * @param {Function} [props.onHoldingPress] - Optional callback when a holding is pressed
 */
const HoldingsList = ({ holdings, count, onHoldingPress }) => {
  const { t, isRTL } = useLocalization();

  return (
    <View style={[styles.container, isRTL && styles.containerRtl]}>
      <View style={[styles.headerRow, isRTL && styles.headerRowRtl]}>
        <Text style={[styles.title, isRTL && styles.titleRtl]}>
          {t("holdings.title")}
        </Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </View>

      <View style={styles.list}>
        {holdings.map((holding, index) => (
          <View
            key={holding.id}
            style={[
              styles.cardWrapper,
              index !== holdings.length - 1 && styles.cardSpacing,
            ]}
          >
            <HoldingCard holding={holding} onPress={onHoldingPress} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  containerRtl: {
    writingDirection: "rtl",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerRowRtl: {
    flexDirection: "row-reverse",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  titleRtl: {
    textAlign: "right",
  },
  countBadge: {
    minWidth: 28,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 14,
    backgroundColor: colors.backgroundCardMuted,
    alignItems: "center",
  },
  countText: {
    color: colors.accent,
    fontWeight: "600",
  },
  list: {
    marginTop: spacing.lg,
  },
  cardWrapper: {
    width: "100%",
  },
  cardSpacing: {
    marginBottom: spacing.lg,
  },
});

HoldingsList.propTypes = {
  holdings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  count: PropTypes.number.isRequired,
  onHoldingPress: PropTypes.func,
};

export default HoldingsList;
