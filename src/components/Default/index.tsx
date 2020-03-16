import React from "react";
import { useHistory } from "react-router";

import Browser from "components/Browser";

import css from "./Default.module.scss";

const Default: React.FC = () => {
  const history = useHistory();
  const { pathname } = history.location;
  const message =
    pathname === "/"
      ? "Hi! My name is Neil, and welcome to my website."
      : "We couldn't find that. Maybe you meant one of these?";

  return (
    <>
      <h1 className={css.text}>{message}</h1>
      <Browser />
    </>
  );
};

export default Default;
