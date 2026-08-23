import React from "react";
import { ArrowUpRight, Mail, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import "./ContactPage.css";

const navItems = [
  ["Home", "/"],
  ["Services", "/services"],
  ["General Order Supplies", "/supplies"],
  ["IT Services", "/it-services"],
  ["Industries", "/industries"],
  ["Our Clients", "/clients"],
  ["Contact", "/contact"],
];

export default function ContactPage(){
  const [open,setOpen]=React.useState(false);
  const cards=[
    {icon:MapPin,title:"Lahore Office",text:"593-A, Block LDA Avenue-1, Raiwind Road, Lahore, Pakistan",href:"https://www.google.com/maps/search/?api=1&query=593%20A-Block%20LDA%20Avenue-1%20Raiwind%20Road%20Lahore%20Pakistan",label:"Open in Google Maps"},
    {icon:Phone,title:"Primary Phone",text:"+92 300 8596393",href:"tel:+923008596393",label:"Call us"},
    {icon:Phone,title:"Alternate Phone",text:"+92 302 6880398",href:"tel:+923026880398",label:"Call us"},
    {icon:Mail,title:"Email",text:"na.engineeringsolutions2023@gmail.com",href:"mailto:na.engineeringsolutions2023@gmail.com",label:"Send an email"},
  ];
  return <div className="contact-site">
    <header className="contact-header"><div className="contact-container contact-nav-wrap"><a href="/" className="contact-logo"><img src="/logo.png" alt="NA Engineering Solutions"/><span><b>NA ENGINEERING</b><small>SOLUTIONS</small></span></a><button className="contact-menu" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button><nav className={open?"contact-nav open":"contact-nav"}>{navItems.map(([label,to])=><a key={to} href={to} onClick={()=>setOpen(false)} className={to==="/contact"?"active":""}>{label}</a>)}</nav></div></header>
    <section className="contact-intro"><div className="contact-container"><span className="contact-eyebrow"><i/> CONTACT / NA ENGINEERING SOLUTIONS</span><h1>Let's work together.</h1><p>Have an engineering, supply, maintenance or project requirement? Contact NA Engineering Solutions directly — <strong>no form required.</strong></p></div></section>
    <main>
      <section className="contact-section contact-light"><div className="contact-container contact-main-grid"><div className="contact-main-copy"><span className="contact-eyebrow dark"><i/> GET IN TOUCH</span><h2>Speak directly with our team.</h2><p>Whether you need engineering services, industrial supplies, facility maintenance, project support or General Order Supplies &amp; Services, our team is ready to discuss your requirement.</p><p>Call us, email us, message us on WhatsApp, visit our Lahore office or open our website — choose the contact method that works best for you.</p><div className="contact-buttons"><a className="contact-btn primary" href="https://wa.me/923008596393?text=Hello%20NA%20Engineering%20Solutions%2C%20I%20would%20like%20to%20discuss%20a%20requirement." target="_blank" rel="noreferrer"><MessageCircle size={18}/> WhatsApp Us <ArrowUpRight size={16}/></a><a className="contact-btn secondary" href="mailto:na.engineeringsolutions2023@gmail.com"><Mail size={18}/> Email Us <ArrowUpRight size={16}/></a></div></div><div className="contact-card-grid">{cards.map(({icon:Icon,title,text,href,label})=><a className="contact-card" href={href} target={href.startsWith("http")?"_blank":undefined} rel={href.startsWith("http")?"noreferrer":undefined} key={title}><span className="contact-card-icon"><Icon size={21}/></span><span><b>{title}</b><strong>{text}</strong><small>{label} <ArrowUpRight size={13}/></small></span></a>)}</div></div></section>
      <section className="contact-section contact-dark"><div className="contact-container contact-details-grid"><div><span className="contact-eyebrow"><i/> COMPANY CONTACT DETAILS</span><h2>NA Engineering Solutions</h2><p>General Order Supplier | Engineering | Maintenance Services</p></div><div className="contact-detail-list"><div><span>Office</span><b>593-A, Block LDA Avenue-1, Raiwind Road, Lahore, Pakistan</b></div><div><span>Phone</span><b>+92 300 8596393 &nbsp; | &nbsp; +92 302 6880398</b></div><div><span>Email</span><b>na.engineeringsolutions2023@gmail.com</b></div><div><span>Business Email</span><b>info@naengineeringsolutions.com</b></div><div><span>Website</span><a href="https://www.naengineeringsolutions.com" target="_blank" rel="noreferrer">www.naengineeringsolutions.com <ArrowUpRight size={14}/></a></div></div></div></section>
      <section className="contact-section contact-light"><div className="contact-container"><span className="contact-eyebrow dark"><i/> WHAT YOU CAN CONTACT US ABOUT</span><div className="contact-heading"><h2>One team for engineering, supplies and support.</h2><p>Contact us for complete or individual requirements across our service and supply capabilities.</p></div><div className="contact-service-grid">{["Civil Engineering","HVAC Systems","Mechanical Engineering","PEB Works","Electrical Works","Fire Fighting","Safety & Security Systems","Industrial Maintenance","Mechanical & Electrical Supplies","Utilities & Facility Maintenance","General Order Supplies & Services","IT Services"].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b><ArrowUpRight size={15}/></div>)}</div></div></section>
      <section className="contact-map"><div className="contact-container contact-map-inner"><div><span className="contact-eyebrow dark"><i/> VISIT OUR LAHORE OFFICE</span><h2>593-A, Block LDA Avenue-1, Raiwind Road, Lahore.</h2><p>Open our office location directly in Google Maps for directions.</p></div><a href="https://www.google.com/maps/search/?api=1&query=593%20A-Block%20LDA%20Avenue-1%20Raiwind%20Road%20Lahore%20Pakistan" target="_blank" rel="noreferrer">Open Google Maps <ArrowUpRight size={17}/></a></div></section>
    </main>
    <footer className="contact-footer"><div className="contact-container contact-footer-grid"><div><a href="/" className="contact-logo"><img src="/logo.png" alt="NA Engineering Solutions"/><span><b>NA ENGINEERING</b><small>SOLUTIONS</small></span></a><p>Engineering • Construction • Industrial Solutions • General Order Supplies &amp; Services</p></div><div><h4>Contact</h4><a href="mailto:na.engineeringsolutions2023@gmail.com">na.engineeringsolutions2023@gmail.com</a><a href="tel:+923008596393">+92 300 8596393</a><a href="tel:+923026880398">+92 302 6880398</a></div><div><h4>Office</h4><span>593-A, Block LDA Avenue-1,<br/>Raiwind Road, Lahore, Pakistan</span><a href="https://www.naengineeringsolutions.com" target="_blank" rel="noreferrer">www.naengineeringsolutions.com</a></div></div><div className="contact-footer-bottom"><div className="contact-container"><span>© {new Date().getFullYear()} NA Engineering Solutions</span><span>Built for dependable project delivery.</span></div></div></footer>
  </div>;
}
