import React, { useState } from "react";
import { useHistory } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faExclamationTriangle,
  faFingerprint,
  faGraduationCap,
  faHandsHelping,
  faUserTie
} from "@fortawesome/free-solid-svg-icons";
import { faReact, faLinux } from "@fortawesome/free-brands-svg-icons";

import useInterval from "utility/interval";
import { StoryMetadata } from "utility/stories";

import css from "./StoryThumbnail.module.scss";

const StoryThumbnail: React.FC<StoryMetadata> = props => {
  const history = useHistory();

  let tags = [...props.tags];
  while (tags.length < 3) {
    tags.push("");
  }
  const length = tags.length;

  const [main, setMain] = useState(0);
  useInterval(() => setMain(main => (main + 1) % length), 1500);

  return (
    <div
      className={css.main}
      onClick={() => history.push(`/story/${props.name}`)}
    >
      <div className={css.info}>
        <h3 className={css.name}>{props.name}</h3>
        <div className={css.date}>{props.created.toLocaleDateString()}</div>
      </div>
      <div className={css.tags}>
        {tags.map((tag, i) => (
          <div key={i} className={`${css.tag} ${getClass(i, main, length)}`}>
            <FontAwesomeIcon className={css.tagIcon} icon={getIcon(tag)} />
            <span>{tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const getClass = (i: number, main: number, length: number) => {
  if (i === main) {
    return css.here;
  }

  if ((i + 1) % length === main) {
    return css.leaving;
  }

  if (i === (main + 1) % length) {
    return css.arriving;
  }

  return css.hidden;
};

const getIcon = (tag: string): IconDefinition => {
  switch (tag) {
    case "About Me":
      return faFingerprint;
    case "Community":
      return faHandsHelping;
    case "Linux":
      return faLinux;
    case "React":
      return faReact;
    case "Professional":
      return faUserTie;
    case "University":
      return faGraduationCap;
    default:
      return faExclamationTriangle;
  }
};

export default StoryThumbnail;
