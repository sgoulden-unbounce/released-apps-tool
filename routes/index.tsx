/** @jsx h */
import { h } from "preact";
import App from "../islands/App.tsx";
import { tw } from "../utils/twind.ts";

export default function Home() {
  return (
    <div>
      <img
        src="/unbounce-icon-dark.svg"
        class={tw`h-24`}
      />
      <h3 class={tw`text-xl`}>
        App Release tool
      </h3>
      <App />
    </div>
  );
}
