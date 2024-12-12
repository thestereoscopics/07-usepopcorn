import { useRef } from "react";
import { useKey } from "./useKey";

export default function Search({ query, onSetQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", (e) => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    onSetQuery("");
  });

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
