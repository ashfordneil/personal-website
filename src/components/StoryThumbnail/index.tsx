import React from "react";

import { Story } from "utility/stories";

import css from "./StoryThumbnail.module.scss";

const StoryThumbnail: React.FC<Story> = props => (
  <div className={css.main}>
    <h3 className={css.name}>{props.name}</h3>
    <div className={css.date}>{props.updated.toLocaleDateString()}</div>
    <div className={css.tags}>
      {props.tags.map((tag, i) => (
        <div key={i} className={css.tag}>
          {tag}
        </div>
      ))}
    </div>
  </div>
);

export default StoryThumbnail;
