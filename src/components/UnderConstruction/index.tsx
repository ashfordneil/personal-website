import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools } from "@fortawesome/free-solid-svg-icons";

import Link from "components/Link";

import css from "./UnderConstruction.module.scss";

export interface Props {
  ticket: number;
}

const UnderConstruction: React.FC<Props> = props => {
  const link = `https://github.com/ashfordneil/personal-website/issues/${props.ticket}`;
  return (
    <div>
      <h2 className={css.heading}>
        <FontAwesomeIcon icon={faTools} /> Under construction
      </h2>
      <div className={css.body}>This area has not been built yet</div>
      <div className={css.generic}>
        There is a <Link href={link}>GitHub issue</Link> open to track work on
        this area of the site. Have a look there to see how it's going.
      </div>
    </div>
  );
};

export default UnderConstruction;
