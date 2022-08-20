/** @jsx h */
import { h } from "preact";

export function Checkbox(props: { onClick: () => void; checked: boolean }) {
  return (
    <input type="checkbox" checked={props.checked} onClick={props.onClick} />
  );
}
