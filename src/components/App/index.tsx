import React, { Suspense } from "react";
import { Router } from "react-router";

import Spinner from "components/Spinner";
import Navbar from "components/Navbar";

import history from "utility/history";

import css from "./App.module.scss";

const App: React.FC = () => {
  return (
    <Router history={history}>
      <div className={css.page}>
        <Navbar />
        <div className={css.main}>
          <Suspense fallback={<Spinner big />}>{null}</Suspense>
        </div>
      </div>
    </Router>
  );
};

export default App;
