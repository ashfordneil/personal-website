import React, { useState, useEffect, Suspense } from "react";
import { useRouteMatch } from "react-router";
import { prefetch, refetch } from "react-suspense-fetch";

import ErrorBoundary from "components/ErrorBoundary";
import ErrorFallback from "components/ErrorFallback";
import Image from "components/Image";
import Link from "components/Link";
import Spinner from "components/Spinner";

import { getStory as getStoryRaw, Story } from "utility/stories";
import parse, {
  TreeNode,
  getChildren,
  extractDescendentsOfType
} from "utility/markdown";

import css from "./StoryView.module.scss";

const getStory = (story: string | null): Promise<Story> =>
  story ? getStoryRaw(story) : new Promise(() => {});
const initialData = prefetch(getStory, null as string | null);

const StoryView: React.FC = () => {
  const story = useStoryName();
  const [data, setData] = useState(initialData);
  useEffect(() => setData(data => refetch(data, story as string | null)), [
    story
  ]);

  return (
    <Suspense fallback={<Spinner big />}>
      <RenderStory get={() => data} />
    </Suspense>
  );
};

interface RenderProps {
  get: () => Story;
}

const RenderStory: React.FC<RenderProps> = props => {
  const story = props.get();
  const similar = new URL("/browse", window.location.href);
  story.tags.forEach(tag => similar.searchParams.append("search", tag));

  return (
    <>
      <h1 className={css.title}>{story.name}</h1>
      <span className={css.date}>{story.updated.toLocaleDateString()}</span>
      <ErrorBoundary fallback={ErrorFallback}>
        <StoryBody {...story} />
      </ErrorBoundary>
      <footer className={css.footer}>
        – Neil
        <br />
        If you liked this post,{" "}
        <Link href={similar.toString()}> here is a link to some like it</Link>
      </footer>
    </>
  );
};

const StoryBody: React.FC<Story> = props => {
  const tree = parse(props.body);
  return (
    <>
      {tree.map((node, i) => (
        <RenderTree key={i} {...node} />
      ))}
    </>
  );
};

const RenderTree: React.FC<TreeNode> = node => {
  // Some elements (like paragraph) cannot have img nodes as children in valid
  // HTML. If we're about to render one of those, extract the images from the
  // child list first so it can be rendered below.
  const images =
    node.type === "paragraph" ? extractDescendentsOfType(node, "image") : [];
  const children = (getChildren(node) || []).map((node, i) => (
    <RenderTree key={i} {...node} />
  ));

  switch (node.type) {
    case "heading":
      const Component = `h${node.level}` as "h1";
      return <Component className={css.heading}>{children}</Component>;
    case "link":
      return <Link href={node.href}>{children}</Link>;
    case "bullet_list":
      return <ul>{children}</ul>;
    case "list_item":
      return <li className={css.listItem}>{children}</li>;
    case "paragraph":
      return (
        <>
          <p className={css.paragraph}>{children}</p>
          {images.map((node, i) => (
            <RenderTree key={i} {...node} />
          ))}
        </>
      );
    case "em":
      return <em className={css.em}>{children}</em>;
    case "strong":
      return <strong className={css.strong}>{children}</strong>;
    case "code":
      return <code className={css.code}>{node.data}</code>;
    case "text":
      return <>{node.data}</>;
    case "inline":
      return <>{children}</>;
    case "image":
      const [alt, ratio, base64] = node.alt.split("|");
      return (
        <Image
          src={node.src}
          alt={alt}
          base64={base64}
          ratio={parseFloat(ratio)}
        />
      );
    default:
      return null;
  }
};

// implemented as a react hook that will update as things change
const useStoryName = (): string => {
  const match = useRouteMatch<{ story: string }>("/story/:story");
  if (!match) {
    throw new Error("Story component rendered at incorrect URL");
  }

  return match.params.story;
};

export default StoryView;
