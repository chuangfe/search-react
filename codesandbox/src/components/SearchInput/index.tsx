import React from "react";
import "./styles.css";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SearchInput(props: SearchInputProps) {
  return (
    <input
      className="search-input"
      value={props.value}
      onChange={props.onChange}
    />
  );
}

export default React.memo(SearchInput);
