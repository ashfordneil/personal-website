import React from "react";
import { useLocation } from "react-router";

import Browser from "components/Browser";

import css from "./Default.module.scss";

const Default: React.FC = () => {
  const { pathname } = useLocation();
  const message =
    pathname === "/"
      ? "Hi! My name is Neil, and welcome to my website. Have a look around."
      : "We couldn't find that. Maybe you meant one of these?";

  return (
    <>
      <h1 className={css.text}>{message}</h1>
      <Browser />
    </>
  );
};

export default Default;
