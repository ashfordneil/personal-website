import React, { useState } from "react";
import { useHistory } from "react-router";

import useInterval from "utility/interval";
import { StoryMetadata } from "utility/stories";

import css from "./StoryThumbnail.module.scss";

const StoryThumbnail: React.FC<StoryMetadata> = props => {
  const history = useHistory();

  let tags = [...props.tags];
  while (tags.length < 3) {
    tags.push("");
  }
  if (tags.length < 5) {
    tags = [...tags, ...tags];
  }
  const length = tags.length;

  const [main, setMain] = useState(0);
  useInterval(() => setMain(main => (main + 1) % length), 1500);

  return (
    <div
      className={css.main}
      onClick={() => history.push(`/story/${props.name}`)}
    >
      <h3 className={css.name}>{props.name}</h3>
      <div className={css.date}>{props.updated.toLocaleDateString()}</div>
      <div className={css.tags}>
        {tags.map((tag, i) => (
          <div key={i} className={`${css.tag} ${getClass(i, main, length)}`}>
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

const getClass = (i: number, main: number, length: number) => {
  if (i === main) {
    return css.tag0;
  }

  if ((i + 1) % length === main) {
    return css.tag1;
  }

  if (i === (main + 1) % length) {
    return css.tagNeg1;
  }

  if ((i + 2) % length === main) {
    return css.tag2;
  }

  if (i === (main + 2) % length) {
    return css.tagNeg2;
  }

  return css.tagHidden;
};

export default StoryThumbnail;
