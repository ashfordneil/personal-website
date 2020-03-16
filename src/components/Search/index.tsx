import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import css from "./Search.module.scss";

export interface Props {
  placeholder: string;
  initial?: string;
  setTags: (input: string[]) => void;
}

const Search: React.FC<Props> = props => {
  // the tags we've currently got
  const [tags, setTagsRaw] = useState<string[]>([]);
  const setTags = (tags: string[]) => {
    setTagsRaw(tags);
    props.setTags(tags);
  };
  // the tag we're writing
  const [text, setText] = useState("");

  // Add a tag when the input is submitted
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prettied = text.trim();
    if (tags.indexOf(prettied) !== -1) {
      // we already have this tag
      return;
    }

    setTags([...tags, prettied]);
    setText("");
  };

  // Remove a tag when they press backspace (while text is empty)
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { keyCode } = event;
    if (keyCode === 8 || keyCode === 46) {
      if (text === "") {
        setTags(tags.filter((_tag, i) => i + 1 < tags.length));
      }
    }
  };

  return (
    <div className={css.main}>
      {tags.map((tag, i) => (
        <Tag key={i} body={tag} tags={tags} setTags={setTags} />
      ))}
      <form className={css.form} onSubmit={onSubmit}>
        <input
          className={css.rawInput}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={props.placeholder}
        />
      </form>
    </div>
  );
};

interface TagProps {
  body: string;
  tags: string[];
  setTags: (input: string[]) => void;
}

const Tag: React.FC<TagProps> = props => {
  const remove = () => {
    props.setTags(props.tags.filter(tag => tag !== props.body));
  };
  return (
    <div className={css.tag} onClick={remove}>
      <FontAwesomeIcon className={css.closeTag} icon={faTimes} />
      {props.body}
    </div>
  );
};

export default Search;
