import React, { useState, useTransition, Suspense, useEffect } from "react";
import { prefetch, refetch } from "react-suspense-fetch";

import Spinner from "components/Spinner";
import StoryThumbnail from "components/StoryThumbnail";

import { getStories } from "utility/stories";

import css from "./Browser.module.scss";

const Browser: React.FC = () => {
  const [search, setSearch] = useState("");

  const update = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setSearch(event.target.value);
  };

  return (
    <div className={css.main}>
      <input
        placeholder="Search for an article"
        className={css.search}
        value={search}
        onChange={update}
      />
      <Suspense fallback={<Spinner big />}>
        <RenderResults query={search} />
      </Suspense>
    </div>
  );
};

const data = prefetch(getStories, {});

interface Props {
  query: string;
}

const RenderResults: React.FC<Props> = props => {
  if (!data.length) {
    throw new Error("No stories found in the database");
  }

  const queries = props.query.split(" ");

  const filtered = data.filter(item => {
    const searchable = [item.name, ...item.tags];
    let output = true;
    for (let query of queries) {
      let tmp = false;
      for (let tag of searchable) {
        tmp = tmp || tag.toLowerCase().startsWith(query.toLowerCase());
      }
      output = output && tmp;
    }
    return output;
  });
  return (
    <div className={css.results}>
      {filtered.map(story => (
        <StoryThumbnail key={story.etag} {...story} />
      ))}
    </div>
  );
};

export default Browser;
