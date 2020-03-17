import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router";
import { prefetch, refetch } from "react-suspense-fetch";

import UnderConstruction from "components/UnderConstruction";

import { getStory } from "utility/stories";

import css from "./Story.module.scss";

const StoryView: React.FC = () => {
  const story = useStoryName();
  const [data, setData] = useState(initialResult);
  useEffect(() => {
    setData(refetch(data, story));
  }, [story]);

  return (
    <>
      <h1 className={css.heading}>{data.name}</h1>
      <span className={css.date}>{data.updated.toLocaleDateString()}</span>
      <UnderConstruction ticket={1} />
    </>
  );
};

// performed directly so we can fetch before we render
const getStoryName = (): string => {
  const { pathname } = window.location;
  const match = pathname.match(/^\/story\/([^/]*)$/);
  if (!match) {
    throw new Error("Story component loaded at incorrect URL");
  }

  return match[1];
};

// pre-fetched data
const initialResult = prefetch(getStory, getStoryName());

// implemented as a react hook that will update as things change
const useStoryName = (): string => {
  const match = useRouteMatch<{ story: string }>("/story/:story");
  if (!match) {
    throw new Error("Story component rendered at incorrect URL");
  }

  return match.params.story;
};

export default StoryView;
