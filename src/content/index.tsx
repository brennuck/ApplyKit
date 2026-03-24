import { createRoot } from "react-dom/client";
import App from "./App";
import cssText from "./styles.css?inline";

const HOST_ID = "applykit-root";

if (!document.getElementById(HOST_ID)) {
  const host = document.createElement("div");
  host.id = HOST_ID;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = cssText;
  shadow.appendChild(style);

  const mountPoint = document.createElement("div");
  shadow.appendChild(mountPoint);

  createRoot(mountPoint).render(<App />);
}
