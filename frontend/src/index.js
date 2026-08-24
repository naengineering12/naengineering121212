import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "./clients-responsive.css";
import "./clients-enhancements";
import "./ChatFix.css";
import App from "./App";
import ContactPage from "./ContactPage";

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
    const syncActive=()=>{
      const path=window.location.pathname.replace(/\/$/,"") || "/";
      document.querySelectorAll('.nav-links a').forEach(link=>{
        const href=(link.getAttribute('href')||"").replace(/\/$/,"") || "/";
        const isActive=href===path || (href!=="/" && path.startsWith(href+"/"));
        link.classList.toggle('nav-active',isActive);
        link.setAttribute('aria-current',isActive?'page':'false');
      });
    };
    syncActive();
    const observer=new MutationObserver(syncActive);
    observer.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('popstate',syncActive);
    document.addEventListener('click',syncActive,true);
    return ()=>{
      observer.disconnect();
      window.removeEventListener('popstate',syncActive);
      document.removeEventListener('click',syncActive,true);
    };
  },[]);
  return null;
}

function ContactNavBridge(){
  React.useEffect(()=>{
    const addContactLinks=()=>{
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
    addContactLinks();
    const observer=new MutationObserver(addContactLinks);
    observer.observe(document.body,{childList:true,subtree:true});
    return ()=>observer.disconnect();
  },[]);
  return null;
}

function RootApp(){
  if(window.location.pathname==='/contact') return <ContactPage/>;
  return <><App/><ActiveNavBridge/><ContactNavBridge/></>;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RootApp />
    </QueryClientProvider>
  </React.StrictMode>,
);
