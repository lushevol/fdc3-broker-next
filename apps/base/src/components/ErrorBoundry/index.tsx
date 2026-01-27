import React, { Component, type ReactElement } from 'react';
import type { ComponentPropsDefault, ErrorState } from '../../hooks/model/root';
import Fallback from '../FallbackError';

class ErrorBoundary extends Component<ComponentPropsDefault, ErrorState> {
  state: ErrorState = {
    hasError: false,
    error: undefined,
    emailSupport: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      emailSupport: props.emailSupport,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  /*componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo)
    }*/

  render() {
    if (this.state.hasError) {
      return <Fallback {...this.state} />;
    }
    return this.props.children;
  }
}

interface ErrorProps extends ComponentPropsDefault {
  emailSupport?: string;
}

const ErrorComponent: React.FC<ErrorProps> = (props: ErrorProps): ReactElement => {
  return <ErrorBoundary {...props} />;
};
export default React.memo(ErrorComponent);
