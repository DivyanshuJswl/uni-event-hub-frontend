import React, { Component } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Refresh, Warning, BugReport } from "@mui/icons-material";
import PropTypes from "prop-types";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState((prev) => ({
      error,
      errorInfo,
      errorCount: prev.errorCount + 1,
    }));

    console.error("Error Boundary caught:", error, errorInfo);

    // Prevent infinite error loops
    if (this.state.errorCount > 5) {
      console.error("Too many errors, stopping error boundary");
      return;
    }
  }

  handleRefresh = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            p: 3,
            backgroundColor: "background.default",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: "600px",
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Warning sx={{ fontSize: 72, color: "error.main", mb: 2 }} />

            <Typography variant="h4" gutterBottom fontWeight="bold">
              Something went wrong
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We encountered an unexpected error. Please try refreshing the page.
            </Typography>

            {this.props.showDetails && this.state.error && (
              <Box
                sx={{
                  backgroundColor: "grey.100",
                  p: 2,
                  borderRadius: 2,
                  textAlign: "left",
                  mb: 3,
                  maxHeight: "300px",
                  overflow: "auto",
                  fontFamily: "monospace",
                }}
              >
                <Typography variant="body2" component="pre" color="error.dark">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                onClick={this.handleRefresh}
              >
                Refresh Page
              </Button>

              {this.props.onReset && (
                <Button variant="outlined" color="primary" onClick={this.handleReset}>
                  Try Again
                </Button>
              )}
            </Box>

            {this.props.contactSupport && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                If the problem persists,{" "}
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  startIcon={<BugReport />}
                  onClick={this.props.contactSupport}
                >
                  contact support
                </Button>
              </Typography>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  showDetails: PropTypes.bool,
  contactSupport: PropTypes.func,
  onReset: PropTypes.func,
};

ErrorBoundary.defaultProps = {
  showDetails: process.env.NODE_ENV === "development",
  contactSupport: null,
  onReset: null,
};

export default ErrorBoundary;
