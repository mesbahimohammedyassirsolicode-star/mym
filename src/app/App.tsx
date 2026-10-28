import type { ComponentProps } from "react";
import { RouterProvider } from "react-router-dom";

type AppProps = { router: ComponentProps<typeof RouterProvider>["router"] };

export default function App({ router }: AppProps) {
  return <RouterProvider router={router} />;
}
