import { mount } from "svelte";
import "lxgw-wenkai-webfont/lxgwwenkai-regular.css";
import "lxgw-wenkai-webfont/lxgwwenkai-bold.css";
import "./app.css";
import App from "./App.svelte";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
