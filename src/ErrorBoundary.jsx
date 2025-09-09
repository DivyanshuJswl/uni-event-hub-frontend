import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Refresh, Warning } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to monitoring service (you can integrate with Sentry, LogRocket, etc.)
    console.error('Error caught by boundary:', error, errorInfo);
    
    // You can also send this to your error tracking service
    // trackError(error, errorInfo);
  }

  handleRefresh = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null 
    });
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null 
    });
    
    // If you have a way to reset the application state, call it here
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            p: 3,
            backgroundColor: 'background.default',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: '500px',
              textAlign: 'center',
              borderRadius: 2,
            }}
          >
            <Warning
              sx={{
                fontSize: 64,
                color: 'warning.main',
                mb: 2,
              }}
            />
            
            <Typography variant="h5" gutterBottom color="text.primary" fontWeight="bold">
              Oops! Something went wrong
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We encountered an unexpected error. This might be temporary, and refreshing the page could help.
            </Typography>

            {this.props.showDetails && this.state.error && (
              <Box
                sx={{
                  backgroundColor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  textAlign: 'left',
                  mb: 3,
                  maxHeight: '200px',
                  overflow: 'auto',
                }}
              >
                <Typography variant="caption" component="pre" color="error">
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                onClick={this.handleRefresh}
                sx={{ borderRadius: 2 }}
              >
                Refresh Page
              </Button>
              
              {this.props.onReset && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.handleReset}
                  sx={{ borderRadius: 2 }}
                >
                  Try Again
                </Button>
              )}
            </Box>

            {this.props.contactSupport && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                If the problem persists, please{' '}
                <Button
                  variant="text"
                  color="primary"
                  size="small"
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

// Default props
ErrorBoundary.defaultProps = {
  showDetails: process.env.NODE_ENV === 'development',
  contactSupport: null,
  onReset: null,
};

export default ErrorBoundary;