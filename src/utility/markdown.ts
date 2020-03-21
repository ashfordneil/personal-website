import Remarkable, {
  Token,
  HeadingToken,
  TextToken,
  BlockContentToken,
  LinkOpenToken,
  ImageToken,
  CodeToken
} from "remarkable";

// Here we convert the output from remarkable to a more react-friendly tree
// structure.

// # Content
export interface HeadingNode {
  type: "heading";
  // h1 -> h6
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: TreeNode[];
}

// [content](href)
export interface LinkNode {
  type: "link";
  // where to link to
  href: string;
  children: TreeNode[];
}

// Wrapper element around a series of
// - Content
export interface ListNode {
  type: "bullet_list";
  children: TreeNode[];
}

// - Content
export interface ListItemNode {
  type: "list_item";
  children: TreeNode[];
}

// ![alt](src)
export interface ImageNode {
  type: "image";
  // where the image is
  src: string;
  // what to show if there is no image
  alt: string;
}

// Just a regular paragraph
export interface ParagraphNode {
  type: "paragraph";
  children: TreeNode[];
}

// _Content_ or *Content*
// It's meant to be italic that's the gist
export interface EmNode {
  type: "em";
  children: TreeNode[];
}

// **Content**
// Make it bold
export interface StrongNode {
  type: "strong";
  children: TreeNode[];
}

// `Code`
export interface CodeNode {
  type: "code";
  data: string;
}

// Just plain old text.
export interface TextNode {
  type: "text";
  data: string;
}

// Just a regular span of content. Typically found inside of other nodes.
export interface InlineNode {
  type: "inline";
  children: TreeNode[];
}

// All nodes will be one of these types of nodes. Either that or you'll be
// catching errors, I guess.
export type TreeNode =
  | HeadingNode
  | LinkNode
  | ListNode
  | ListItemNode
  | ImageNode
  | ParagraphNode
  | EmNode
  | StrongNode
  | CodeNode
  | TextNode
  | InlineNode;

// Take a series of tokens, as yielded by remarkable, and convert them to the
// above tree structure.
const toTree = (tokens: Token[]): TreeNode[] => {
  const output = [] as TreeNode[];
  // add an extra counter just to make sure it terminates
  let loopBreaker = tokens.length;
  for (; loopBreaker && tokens.length; --loopBreaker) {
    if (!extractSiblings(tokens, output)) {
      const next = tokens[0];
      const { type } = next;
      // remove the node we've found
      tokens.splice(0, 1);
      switch (type) {
        case "text":
          output.push({ type, data: (next as TextToken).content || "" });
          break;
        case "softbreak":
          output.push({ type: "text", data: "\n" });
          break;
        case "code":
          output.push({ type, data: (next as CodeToken).content || "" });
          break;
        case "inline":
          const children = toTree((next as BlockContentToken).children || []);
          output.push({ type, children });
          break;
        case "image":
          const { src, alt } = next as ImageToken;
          output.push({ type, src, alt });
          break;
        default:
          throw new Error(`Unknown markdown token: ${type}`);
      }
    }
  }

  return output;
};

// So while remarkable emits mainly tree structures, many elements are
// implemented as siblings. The pattern we're looking for here is emitted tokens
// looking like:
//    typename_open ... typename_close
//
// This helper function finds that pattern, extracts it into a TreeNode, and
// returns true. If the node at the top of the tokens list does not match the
// pattern, it returns false.
const extractSiblings = (tokens: Token[], output: TreeNode[]): boolean => {
  const next = tokens[0];
  const match = next.type.match(/^(.*)_open$/);
  if (!match) {
    return false;
  }
  const type = match[1];
  let [i, depth] = [1, 1];
  // search through and find the matching close node
  for (; i < tokens.length && depth; ++i) {
    if (tokens[i].type === `${type}_open`) {
      depth += 1;
    } else if (tokens[i].type === `${type}_close`) {
      depth -= 1;
    }
  }

  if (depth) {
    throw new Error("Reached end of token stream before finding matching node");
  }

  // extract the nodes we want, and remove them from the input so we can
  // keep looping later
  let taken = tokens.splice(0, i);
  taken = taken.slice(1, taken.length - 1);
  const children = toTree(taken);
  switch (type) {
    case "heading":
      const level = (next as HeadingToken).hLevel;
      // To convince typescript that level is 1..6, we need to manually check
      // against each number that hLevel could be that is not within 1..6
      if (level === 7 || level === 8 || level === 9) {
        throw new Error("Invalid heading level");
      }
      output.push({
        type,
        level,
        children
      });
      break;
    case "link":
      const href = (next as LinkOpenToken).href;
      output.push({ type, href, children });
      break;
    case "bullet_list":
    case "list_item":
    case "paragraph":
    case "em":
    case "strong":
      output.push({ type, children });
      break;
    default:
      throw new Error(`Unknown markdown token: ${type}`);
  }

  return true;
};

const parse = (input: string): TreeNode[] => {
  const parser = new Remarkable("commonmark");
  const tokens = parser.parse(input, {});
  const tree = toTree(tokens);

  return tree;
};

export const getChildren = (tree: TreeNode): TreeNode[] | null => {
  if (tree.type !== "text" && tree.type !== "image" && tree.type !== "code") {
    const children: TreeNode[] = tree.children;
    return children;
  } else {
    return null;
  }
};

export const hasDescendentOfType = (node: TreeNode, type: string): boolean => {
  if (node.type === type) {
    return true;
  }

  for (let child of getChildren(node) || []) {
    if (hasDescendentOfType(child, type)) {
      return true;
    }
  }

  return false;
};

export default parse;
