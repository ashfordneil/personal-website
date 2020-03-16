import React, { useState, useTransition, Suspense, useEffect } from "react";
import { prefetch, refetch } from "react-suspense-fetch";

import Search from "components/Search";
import Spinner from "components/Spinner";
import StoryThumbnail from "components/StoryThumbnail";

import { getStories } from "utility/stories";

import css from "./Browser.module.scss";

const Browser: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <>
      <Search placeholder="Search for anything..." setTags={setTags} />
      <Suspense fallback={<Spinner big />}>
        <RenderResults tags={tags} />
      </Suspense>
    </>
  );
};

const data = prefetch(getStories, {});

interface Props {
  tags: string[];
}

const RenderResults: React.FC<Props> = props => {
  if (!data.length) {
    throw new Error("No stories found in the database");
  }

  const filtered = data.filter(item => {
    const searchable = [item.name, ...item.tags];
    let output = true;
    for (let query of props.tags) {
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
