/* eslint-disable react-refresh/only-export-components -- server entry, not a Fast Refresh module */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom";
import { routes } from "./app/routes";
import { getPageSeo, renderHead } from "./config/seo";
import { SITE_URL } from "./config/site";

export const PUBLIC_ROUTES = ["/", "/services", "/projects", "/about", "/contact"] as const;
export const NOT_FOUND_ROUTE = "/404";

export async function render(url: string) {
  const normalized = url !== "/" ? url.replace(/\/+$/, "") : "/";
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(new URL(normalized, SITE_URL)));
  if (context instanceof Response) {
    throw new Error(`Static handler returned ${context.status} for ${normalized}`);
  }
  const router = createStaticRouter(routes, context);
  const appHtml = renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </StrictMode>,
  );
  return { appHtml, head: renderHead(getPageSeo(normalized)) };
}
