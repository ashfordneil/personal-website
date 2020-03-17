import React, { Component } from "react";

export interface Props {
  children: React.ReactNode;
  fallback: React.FC<{ error: Error }>;
}

interface State {
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { props, state } = this;

    if (state.error) {
      const Component = props.fallback;
      return <Component error={state.error} />;
    }

    return props.children;
  }
}

export default ErrorBoundary;
