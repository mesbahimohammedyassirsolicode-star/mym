import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "@fontsource-variable/inter/index.css";
import App from "./app/App";
import { clientRoutes } from "./app/clientRoutes";
import MotionProvider from "./components/motion/MotionProvider";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/utilities.css";
import "./styles/components.css";
import "./styles/sections.css";
import "./styles/pages.css";
import "./styles/motion.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found.");
}

const root = rootElement;

function waitForRouter(router: ReturnType<typeof createBrowserRouter>) {
  if (router.state.initialized) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const unsubscribe = router.subscribe((state) => {
      if (state.initialized) {
        unsubscribe();
        resolve();
      }
    });
  });
}

async function bootstrap() {
  const router = createBrowserRouter(clientRoutes);

  try {
    await waitForRouter(router);
  } catch (error) {
    console.error("Router failed to initialize.", error);
    return;
  }

  if (router.state.errors) {
    console.error("Router reported errors during initialization.", router.state.errors);
    return;
  }

  const app = (
    <StrictMode>
      <MotionProvider>
        <App router={router} />
        <Analytics />
      </MotionProvider>
    </StrictMode>
  );

  if (root.hasChildNodes()) {
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
}

void bootstrap();
