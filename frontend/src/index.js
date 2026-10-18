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

function BootScreen() {
  return (
    <main style={{minHeight:"100vh",background:"#0B1F3A",color:"#fff",fontFamily:"Inter,Arial,sans-serif"}}>
      <style>{`@media(max-width:900px){.boot-navigation{gap:10px!important;flex-wrap:wrap;justify-content:flex-end;font-size:10px!important}}@media(max-width:700px){.boot-navigation{display:none!important}.boot-header{height:60px!important}.boot-hero{min-height:560px!important}.boot-title{font-size:clamp(34px,9vw,46px)!important}}`}</style>
      <header className="boot-header" style={{height:"66px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"24px",padding:"0 clamp(20px,6vw,90px)",background:"#0B1F3A",borderBottom:"1px solid rgba(255,255,255,.12)",boxSizing:"border-box"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:"10px",color:"#fff",textDecoration:"none",minWidth:0}}>
          <img src="/logo.png" alt="" width="40" height="40" style={{objectFit:"contain"}} />
          <span style={{fontSize:"11px",lineHeight:1.4,fontWeight:800,letterSpacing:".08em"}}>NA ENGINEERING<br/><span style={{fontSize:"8px",letterSpacing:".25em",color:"#9BA7BB"}}>SOLUTIONS</span></span>
        </a>
        <nav className="boot-navigation" style={{display:"flex",alignItems:"center",gap:"clamp(12px,2vw,28px)",fontSize:"12px"}}>
          { [["Home","/"],["Services","/services"],["General Order Supplies","/supplies"],["IT Services","/it-services"],["Industries","/industries"],["Insights","/insights"],["Our Clients","/clients"],["Contact Us","/contact"]].map(([label,href]) => <a key={href} href={href} style={{color:href==="/"?"#F4A261":"#C6CEDA",textDecoration:"none"}}>{label}</a>) }
        </nav>
      </header>
      <section className="boot-hero" style={{position:"relative",minHeight:"620px",display:"flex",alignItems:"center",overflow:"hidden",backgroundImage:"linear-gradient(90deg,rgba(11,31,58,.97) 10%,rgba(11,31,58,.8) 52%,rgba(11,31,58,.35)),url('https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?auto=format&fit=crop&w=1600&q=72')",backgroundPosition:"center",backgroundSize:"cover"}}>
        <div style={{width:"min(1330px,100%)",boxSizing:"border-box",padding:"70px clamp(20px,6vw,90px)",margin:"0 auto"}}>
          <p style={{margin:0,color:"#F4A261",fontSize:"10px",fontWeight:800,letterSpacing:".17em"}}>ENGINEERING / SUPPLY / EXECUTION</p>
          <h1 className="boot-title" style={{maxWidth:"760px",fontSize:"clamp(38px,5vw,66px)",fontWeight:600,lineHeight:1.03,letterSpacing:"-.05em",margin:"22px 0",color:"#F4A261"}}>NA Engineering Solutions — Engineering Services in Lahore</h1>
          <p style={{maxWidth:"650px",fontSize:"16px",lineHeight:1.8,color:"#C5CFDD",margin:"0 0 28px"}}>NA Engineering Solutions supports factories, commercial facilities and project teams in Lahore with engineering consultancy, civil and mechanical works, HVAC, electrical installation, PEB, fire protection, industrial maintenance and General Order Supplies &amp; Services.</p>
          <a href="/services" style={{display:"inline-block",background:"#F4A261",color:"#0B1F3A",textDecoration:"none",fontSize:"12px",fontWeight:700,padding:"14px 18px"}}>Explore Our Services →</a>
          <p style={{marginTop:"26px",color:"#A8B4C6",fontSize:"11px"}}>Loading website…</p>
        </div>
      </section>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>,
);
