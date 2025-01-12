import type { LinksFunction } from "@remix-run/cloudflare";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import "./tailwind.css";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./components/not-found";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "icon",
    type: "image/svg+xml",
    href: "/linky-logo.svg",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {isRouteErrorResponse(error) && error.status === 404 && (
          <NotFound
            message="Page not found"
            description="The page you're looking for doesn't exist or has been moved."
          />
        )}
        {isRouteErrorResponse(error) && error.status === 401 && (
          <NotFound
            message="Unauthorized"
            description="You have no access to the page"
          />
        )}
        {!isRouteErrorResponse(error) && (
          <NotFound
          />
        )}

        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
