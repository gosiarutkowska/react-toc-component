import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.scss';

type ErrorBoundaryProps = {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

type ErrorBoundaryState = {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('TOC Component Error:', error);
        console.error('Error Info:', errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // Call optional error handler
        this.props.onError?.(error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({
            hasError: false,
            error: undefined,
            errorInfo: undefined,
        });
    };

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className={styles.errorBoundary}>
                    <div className={styles.errorContent}>
                        <div className={styles.errorIcon}>⚠️</div>
                        <h3 className={styles.errorTitle}>Something went wrong</h3>
                        <p className={styles.errorMessage}>
                            The Table of Contents component encountered an error and couldn't render properly.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className={styles.errorDetails}>
                                <summary>Error Details (Development)</summary>
                                <pre className={styles.errorStack}>
                  {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                </pre>
                            </details>
                        )}

                        <div className={styles.errorActions}>
                            <button
                                onClick={this.handleRetry}
                                className={styles.retryButton}
                                title="Try to render the component again"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={this.handleReload}
                                className={styles.reloadButton}
                                title="Reload the entire page"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;