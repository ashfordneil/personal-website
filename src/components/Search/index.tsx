import React from "react";

import css from "./Search.module.scss";

export interface Props {
  placeholder: string;
  value: string;
  setValue: (input: string) => void;
}

const Search: React.FC<Props> = props => {
  return (
    <form onSubmit={e => e.preventDefault()} className={css.wrapper}>
      <input
        className={css.input}
        value={props.value}
        onChange={e => props.setValue(e.target.value)}
        placeholder={props.placeholder}
      />
    </form>
  );
};

export default Search;
