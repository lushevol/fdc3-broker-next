/**
 * MFE Tile Application
 *
 * This is a micro-frontend tile that demonstrates FDC3 integration.
 * For a complete example with FDC3 operations, see:
 * ./components/ExampleFDC3Tile.tsx
 */

import React from 'react';

class SimpleErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MF Tile Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red', border: '1px solid red' }}>
          <h2>MF Tile Error Caught Locally</h2>
          <pre>{this.state.error?.toString()}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = (_props: any) => {
  return (
    <SimpleErrorBoundary>
      <div className="content">
        <h1>mf_tile</h1>
      </div>
    </SimpleErrorBoundary>
  );
};

export default App;
