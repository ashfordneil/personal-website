import React, { Suspense } from "react";
import { Router, Switch, Route } from "react-router";

import ErrorBoundary from "components/ErrorBoundary";
import ErrorFallback from "components/ErrorFallback";
import Spinner from "components/Spinner";
import Navbar from "components/Navbar";

import history from "utility/history";

import css from "./App.module.scss";

const Browser = React.lazy(async () => import("components/Browser"));
const Default = React.lazy(async () => import("components/Default"));

const App: React.FC = () => {
  return (
    <Router history={history}>
      <div className={css.page}>
        <Navbar />
        <div className={css.main}>
          <ErrorBoundary fallback={ErrorFallback}>
            <Suspense fallback={<Spinner big />}>
              <Switch>
                <Route path="/browse" exact>
                  <Browser />
                </Route>
                <Route path="/">
                  <Default />
                </Route>
              </Switch>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </Router>
  );
};

export default App;
