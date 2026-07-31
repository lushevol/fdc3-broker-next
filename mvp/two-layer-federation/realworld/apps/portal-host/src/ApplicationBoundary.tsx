import React, { type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@fm/ratan-design-webkit';

interface Props { applicationName: string; resetKey: string; children: ReactNode }
interface State { error: Error | null }

export class ApplicationBoundary extends React.Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error): State { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `Federated application render failure\n${error.stack ?? error.message}\n${info.componentStack ?? ''}`,
    );
  }
  componentDidUpdate(previous: Props) {
    if (previous.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }
  render() {
    if (this.state.error) {
      return (
        <ErrorState
          title={`${this.props.applicationName} failed:`}
          message={` ${this.state.error.message}`}
        />
      );
    }
    return this.props.children;
  }
}
