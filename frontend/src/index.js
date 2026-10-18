import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

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

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("NA Engineering Solutions failed to render.", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:"32px",boxSizing:"border-box",background:"#0B1F3A",color:"#fff",fontFamily:"Inter,Arial,sans-serif"}}>
          <section style={{maxWidth:"560px",textAlign:"center"}}>
            <p style={{color:"#F4A261",fontSize:"11px",fontWeight:800,letterSpacing:".16em"}}>NA ENGINEERING SOLUTIONS</p>
            <h1 style={{fontSize:"clamp(28px,5vw,42px)",lineHeight:1.1,margin:"18px 0"}}>We’re having trouble loading the website.</h1>
            <p style={{color:"#c5cfdd",lineHeight:1.7}}>Please reload the page. If the issue continues, contact our team directly.</p>
            <button type="button" onClick={() => window.location.reload()} style={{marginTop:"16px",border:0,background:"#F4A261",color:"#0B1F3A",padding:"14px 20px",fontWeight:700,cursor:"pointer"}}>Reload website</button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>,
);
