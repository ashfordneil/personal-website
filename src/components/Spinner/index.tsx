import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import css from "./Spinner.module.scss";

export interface Props {
  // Make this a large spinner, that will position itself relative to its
  // container rather than just sitting where it's told.
  big?: true;
}

const Spinner: React.FC<Props> = props => {
  const className = [css.main, props.big && css.big].join(" ");

  return (
    <div className={className}>
      <FontAwesomeIcon className={css.inner} icon={faSpinner} />
    </div>
  );
};

export default Spinner;
