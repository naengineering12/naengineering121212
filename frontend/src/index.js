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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

function ActiveNavBridge(){
  React.useEffect(()=>{
    let frame=0;
    const syncActive=()=>{
      frame=0;
      const path=window.location.pathname.replace(/\/$/,"") || "/";
      document.querySelectorAll('.nav-links a').forEach(link=>{
        const href=(link.getAttribute('href')||"").replace(/\/$/,"") || "/";
        const isActive=href===path || (href!=="/" && path.startsWith(href+"/"));
        if(link.classList.contains('nav-active')!==isActive){
          link.classList.toggle('nav-active',isActive);
          link.setAttribute('aria-current',isActive?'page':'false');
        }
      });
    };
    const scheduleSync=()=>{
      if(frame) return;
      frame=requestAnimationFrame(syncActive);
    };
    scheduleSync();
    const observer=new MutationObserver(scheduleSync);
    observer.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('popstate',scheduleSync,{passive:true});
    document.addEventListener('click',scheduleSync,true);
    return ()=>{
      if(frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('popstate',scheduleSync);
      document.removeEventListener('click',scheduleSync,true);
    };
  },[]);
  return null;
}

function ContactNavBridge(){
  React.useEffect(()=>{
    let frame=0;
    const addContactLinks=()=>{
      frame=0;
      const nav=document.querySelector('.nav-links');
      if(nav && !nav.querySelector('[data-contact-bridge]')){
        const link=document.createElement('a');
        link.href='/contact';
        link.textContent='Contact Us';
        link.dataset.contactBridge='true';
        link.dataset.testid='nav-contact-us';
        nav.appendChild(link);
      }
      const company=[...document.querySelectorAll('.footer-grid h4')].find(x=>x.textContent.trim()==='Company');
      const column=company?.parentElement;
      if(column && !column.querySelector('[data-footer-contact-bridge]')){
        const link=document.createElement('a');
        link.href='/contact';
        link.textContent='Contact Us';
        link.dataset.footerContactBridge='true';
        column.appendChild(link);
      }
    };
    const scheduleAdd=()=>{
      if(frame) return;
      frame=requestAnimationFrame(addContactLinks);
    };
    scheduleAdd();
    const observer=new MutationObserver(scheduleAdd);
    observer.observe(document.body,{childList:true,subtree:true});
    return ()=>{
      if(frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  },[]);
  return null;
}

const App = React.lazy(()=>import("./App"));
const ContactPage = React.lazy(()=>import("./ContactPage"));

function RootApp(){
  const isContact=window.location.pathname==='/contact';
  return (
    <React.Suspense fallback={null}>
      {isContact ? <ContactPage/> : <><App/><ActiveNavBridge/><ContactNavBridge/></>}
    </React.Suspense>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
);
