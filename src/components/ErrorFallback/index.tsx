import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

import Link from "components/Link";

import css from "./ErrorFallback.module.scss";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export interface Props {
  error: Error;
}

const ErrorFallback: React.FC<Props> = props => {
  const string = props.error.message;
  const link = new URL(
    "https://github.com/ashfordneil/personal-website/issues"
  );
  link.searchParams.append("q", string);

  return (
    <div className={css.main}>
      <div>
        <h2 className={css.heading}>
          <FontAwesomeIcon icon={faExclamationTriangle} /> Something has gone
          wrong
        </h2>
        <div className={css.body}>{string}</div>
        <div className={css.generic}>
          Try refreshing the page, or see if there's an{" "}
          <Link icon={faGithub} href={link.toString()}>
            issue
          </Link>{" "}
          open for this.
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
