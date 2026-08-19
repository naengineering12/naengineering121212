import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";

// The Clients page is maintained as a standalone, source-controlled page.
// Redirect both direct visits and SPA navigations so /clients always uses that page.
const CLIENTS_PATH = "/clients";
const CLIENTS_PAGE = "/clients.html";

if (window.location.pathname === CLIENTS_PATH) {
  window.location.replace(CLIENTS_PAGE);
} else {
  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);
  const redirectClients = (url) => {
    if (!url) return false;
    try {
      const target = new URL(url, window.location.origin);
      if (target.pathname === CLIENTS_PATH) {
        window.location.assign(CLIENTS_PAGE);
        return true;
      }
    } catch (_) {}
    return false;
  };
  window.history.pushState = function(state, title, url) {
    if (redirectClients(url)) return;
    return originalPushState(state, title, url);
  };
  window.history.replaceState = function(state, title, url) {
    if (redirectClients(url)) return;
    return originalReplaceState(state, title, url);
  };
  window.addEventListener("popstate", () => {
    if (window.location.pathname === CLIENTS_PATH) window.location.replace(CLIENTS_PAGE);
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
