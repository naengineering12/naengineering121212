import React from "react";
import ReactDOM from "react-dom/client";

// The frontend and AI backend are separate Vercel projects. Use the stable
// backend project URL instead of a deployment-specific URL that can become stale.
const LIVE_BACKEND = "https://naengineering121212-b.vercel.app";
const nativeFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  const rawUrl = typeof input === "string" ? input : input?.url || "";
  const isChatRequest = rawUrl.includes("/api/chat") || rawUrl.includes("undefined/api/chat");
  if (isChatRequest) {
    try {
      const target = new URL(rawUrl, window.location.origin);
      const targetUrl = `${LIVE_BACKEND}${target.pathname}${target.search}`;
      return nativeFetch(targetUrl, init);
    } catch (_) {
      return nativeFetch(`${LIVE_BACKEND}/api/chat`, init);
    }
  }
  return nativeFetch(input, init);
};

const App = React.lazy(()=>import("./App"));
function RootApp(){
  return (
    <React.Suspense fallback={null}>
      <App/>
    </React.Suspense>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
);
