import React, { Component, useEffect, useRef } from "react";
import { useLocation } from "react-router";

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
      return (
        <>
          <Component error={state.error} />
          <LocationHook locationChanged={() => this.setState({})} />
        </>
      );
    }

    return props.children;
  }
}

interface LocationHookProps {
  locationChanged: () => void;
}

const LocationHook: React.FC<LocationHookProps> = props => {
  const location = useLocation();
  const callback = useRef(props.locationChanged);
  const isOn = useRef(false);

  useEffect(() => (callback.current = props.locationChanged), [
    props.locationChanged
  ]);

  useEffect(() => {
    if (isOn.current) {
      callback.current();
    }
  }, [location.pathname]);

  useEffect(() => {
    isOn.current = true;
  }, []);

  return null;
};

export default ErrorBoundary;
