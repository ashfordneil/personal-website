import React from "react";
import { useHistory } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import css from "./Link.module.scss";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface Props {
  icon?: IconDefinition;
  children: React.ReactNode;
  href: string;
}

const Link: React.FC<Props> = props => {
  const history = useHistory();
  const url = new URL(props.href, window.location.href);

  const body = (
    <>
      {props.icon && <FontAwesomeIcon className={css.icon} icon={props.icon} />}
      <span className={css.inner}>{props.children}</span>
    </>
  );

  if (url.origin === window.origin) {
    const onClick = () => {
      history.push(props.href);
    };

    return (
      <button className={css.main} onClick={onClick}>
        {body}
      </button>
    );
  } else {
    return (
      <a
        className={css.main}
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
      </a>
    );
  }
};

export default Link;
