import type { ComponentType } from "react";
import type { RouteObject } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const lazyComponent = (
  loader: () => Promise<{ default: ComponentType }>,
): RouteObject["lazy"] =>
  async () => ({ Component: (await loader()).default });

export const clientRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", lazy: lazyComponent(() => import("../pages/Home/HomePage")) },
      {
        path: "/services",
        lazy: lazyComponent(() => import("../pages/Services/ServicesPage")),
      },
      {
        path: "/projects",
        lazy: lazyComponent(() => import("../pages/Projects/ProjectsPage")),
      },
      {
        path: "/about",
        lazy: lazyComponent(() => import("../pages/About/AboutPage")),
      },
      {
        path: "/contact",
        lazy: lazyComponent(() => import("../pages/Contact/ContactPage")),
      },
      {
        path: "*",
        lazy: lazyComponent(() => import("../pages/NotFound/NotFoundPage")),
      },
    ],
  },
];
