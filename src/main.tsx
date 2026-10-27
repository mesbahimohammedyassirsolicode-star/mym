import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "@fontsource-variable/inter/index.css";
import App from "./app/App";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/utilities.css";
import "./styles/components.css";
import "./styles/sections.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <>
      <App />
      <Analytics />
    </>
  </StrictMode>,
);
