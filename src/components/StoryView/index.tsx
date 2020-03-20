import React, { Suspense } from "react";
import { useRouteMatch } from "react-router";
import { prefetch } from "react-suspense-fetch";
import Remarkable, { Token, HeadingToken, TextToken } from "remarkable";

import ErrorFallback from "components/ErrorFallback";
import Spinner from "components/Spinner";

import { getStory, Story } from "utility/stories";

import css from "./Story.module.scss";

const StoryView: React.FC = () => {
  const story = useStoryName();
  const data = prefetch(getStory, story);

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
  const parser = new Remarkable("commonmark");
  const tokens = parser.parse(story.body, {});
  const unknownTokens = new Set<string>();
  const ast = toTree(tokens, unknownTokens);

  return (
    <>
      <h1 className={css.title}>{story.name}</h1>
      <span className={css.date}>{story.updated.toLocaleDateString()}</span>
      {ast.map((node, i) => (
        <RenderTree key={i} node={node} />
      ))}
      {[...unknownTokens].map((token, i) => (
        <ErrorFallback
          key={i}
          error={new Error(`Unhandled markdown token: ${token}`)}
        />
      ))}
    </>
  );
};

// implemented as a react hook that will update as things change
const useStoryName = (): string => {
  const match = useRouteMatch<{ story: string }>("/story/:story");
  if (!match) {
    throw new Error("Story component rendered at incorrect URL");
  }

  return match.params.story;
};

interface HeadingNode {
  type: "heading";
  level: number;
  children: TreeNode[];
}

const RenderHeading: React.FC<HeadingNode> = ({ level, children }) => {
  const Component = `h${level}` as "h1";
  return (
    <Component className={css.heading}>
      {children.map((node, i) => (
        <RenderTree key={i} node={node} />
      ))}
    </Component>
  );
};

interface ParagraphNode {
  type: "paragraph";
  children: TreeNode[];
}

const RenderParagraph: React.FC<ParagraphNode> = ({ children }) => {
  return (
    <p className={css.paragraph}>
      {children.map((node, i) => (
        <RenderTree key={i} node={node} />
      ))}
    </p>
  );
};

interface InlineNode {
  type: "inline";
  children: TreeNode[];
}

const RenderInline: React.FC<InlineNode> = ({ children }) => {
  return (
    <>
      {children.map((node, i) => (
        <RenderTree key={i} node={node} />
      ))}
    </>
  );
};

interface EmNode {
  type: "em";
  children: TreeNode[];
}

const RenderEm: React.FC<EmNode> = ({ children }) => {
  return (
    <em className={css.em}>
      {children.map((node, i) => (
        <RenderTree key={i} node={node} />
      ))}
    </em>
  );
};

interface StrongNode {
  type: "strong";
  children: TreeNode[];
}

const RenderStrong: React.FC<StrongNode> = ({ children }) => {
  return (
    <strong className={css.strong}>
      {children.map((node, i) => (
        <RenderTree key={i} node={node} />
      ))}
    </strong>
  );
};

type TreeNode =
  | string
  | HeadingNode
  | ParagraphNode
  | InlineNode
  | EmNode
  | StrongNode;

const RenderTree: React.FC<{ node: TreeNode }> = ({ node }) => {
  if (typeof node === "string") {
    return <>{node}</>;
  }
  switch (node.type) {
    case "heading":
      return <RenderHeading {...node} />;
    case "paragraph":
      return <RenderParagraph {...node} />;
    case "inline":
      return <RenderInline {...node} />;
    case "em":
      return <RenderEm {...node} />;
    case "strong":
      return <RenderStrong {...node} />;
  }
};

const toTree = (tokens: Token[], unknown: Set<string>): TreeNode[] => {
  const output = [] as TreeNode[];
  while (tokens.length) {
    const next = tokens[0];
    const match = next.type.match(/^(.*)_open$/);
    if (match) {
      const type = match[1];
      let [depth, i] = [1, 1];
      for (; i < tokens.length && depth; ++i) {
        if (tokens[i].type === `${type}_open`) {
          depth += 1;
        } else if (tokens[i].type === `${type}_close`) {
          depth -= 1;
        }
      }

      if (depth) {
        throw new Error("Incomplete parse");
      }

      const taken = tokens.splice(0, i);
      const children = toTree(taken.slice(1, taken.length - 1), unknown);
      switch (type) {
        case "heading":
          output.push({
            type: "heading",
            level: (next as HeadingToken).hLevel,
            children
          });
          break;
        case "paragraph":
          output.push({
            type: "paragraph",
            children
          });
          break;
        case "em":
          output.push({
            type: "em",
            children
          });
          break;
        case "strong":
          output.push({
            type: "strong",
            children
          });
          break;
        default:
          unknown.add(type);
      }
    } else if (next.type === "text") {
      tokens = tokens.splice(1);
      output.push((next as TextToken).content!);
    } else if (next.type === "inline") {
      tokens = tokens.splice(1);
      const children = toTree((next as any).children, unknown);
      output.push({
        type: "inline",
        children
      });
    } else {
      unknown.add(next.type);
      tokens = tokens.splice(1);
    }
  }

  return output;
};

export default StoryView;
