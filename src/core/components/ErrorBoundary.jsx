import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View } from "react-native";
import colors from "../theme/colors";
import spacing from "../theme/spacing";

/**
 * Error Boundary component to catch and handle React errors gracefully.
 * Displays a user-friendly error message when a component tree crashes.
 *
 * @component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (__DEV__) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
    // TODO: Log to error reporting service in production
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry for the inconvenience. Please restart the app.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.errorDetails}>
              {this.state.error.toString()}
            </Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.backgroundPrimary,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  errorDetails: {
    marginTop: spacing.xl,
    fontSize: 12,
    color: colors.negative,
    fontFamily: "monospace",
    textAlign: "center",
  },
});

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
