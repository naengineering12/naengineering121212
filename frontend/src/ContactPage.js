import React from "react";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import "./ContactPage.css";

const officeAddress="593 Block-A LDA Avenue, 1 Raiwind Rd, Lahore, 54000";
const mapsUrl="https://www.google.com/maps/place/31%C2%B025'38.7%22N+74%C2%B013'17.5%22E/@31.4274139,74.2189598,17z/data=!3m1!4b1!4m4!3m3!8m2!3d31.4274139!4d74.2215347?hl=en&entry=ttu&g_ep=EgoyMDI2MDgyNS4wIKXMDSoASAFQAw%3D%3D";
const emailAddress="na.engineeringsolutions2023@gmail.com";
const emailUrl=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`;
export default function ContactPage(){
  const cards=[
    {icon:MapPin,title:"Lahore Office",text:officeAddress,href:mapsUrl,label:"Get directions in Google Maps"},
    {icon:Phone,title:"Primary Phone",text:"+92 300 8596393",href:"tel:+923008596393",label:"Call us"},
    {icon:Phone,title:"Alternate Phone",text:"+92 302 6880398",href:"tel:+923026880398",label:"Call us"},
    {icon:Mail,title:"Email",text:emailAddress,href:emailUrl,label:"Send an email"},
  ];
  return <div className="contact-site">
    <section className="contact-intro"><div className="contact-container"><span className="contact-eyebrow"><i/> CONTACT US / NA ENGINEERING SOLUTIONS</span><h1>Contact our team.</h1><p>For engineering services, industrial supplies or maintenance support, contact our Lahore team to discuss your requirement.</p></div></section>
    <main>
      <section className="contact-section contact-light"><div className="contact-container contact-main-grid"><div className="contact-main-copy"><span className="contact-eyebrow dark"><i/> GET IN TOUCH</span><h2>Let’s discuss your requirement.</h2><p>From a single industrial item to a larger engineering or maintenance project, we’ll help clarify the scope and next steps.</p><p>Call, email or message us on WhatsApp. For a faster, more accurate response, keep your item list, specification or site details ready.</p><div className="contact-buttons"><a className="contact-btn primary" href="https://wa.me/923008596393?text=Hello%20NA%20Engineering%20Solutions%2C%20I%20would%20like%20to%20discuss%20a%20requirement." target="_blank" rel="noreferrer"><MessageCircle size={18}/> WhatsApp Us <ArrowUpRight size={16}/></a><a className="contact-btn secondary" href={emailUrl} target="_blank" rel="noreferrer"><Mail size={18}/> Email Us <ArrowUpRight size={16}/></a><a className="contact-btn secondary" href="tel:+923008596393"><Phone size={18}/> Call Us <ArrowUpRight size={16}/></a></div></div><div className="contact-card-grid">{cards.map(({icon:Icon,title,text,href,label})=><a className="contact-card" href={href} target={href.startsWith("http")?"_blank":undefined} rel={href.startsWith("http")?"noreferrer":undefined} key={title}><span className="contact-card-icon"><Icon size={21}/></span><span><b>{title}</b><strong>{text}</strong><small>{label} <ArrowUpRight size={13}/></small></span></a>)}</div></div></section>

      <section className="contact-section contact-dark"><div className="contact-container contact-details-grid"><div><span className="contact-eyebrow"><i/> COMPANY CONTACT DETAILS</span><h2>NA Engineering Solutions</h2><p>General Order Supplies &amp; Services | Engineering | Maintenance</p></div><div className="contact-detail-list"><div><span>Office</span><b>{officeAddress}</b></div><div><span>Phone</span><b>+92 300 8596393 &nbsp; | &nbsp; +92 302 6880398</b></div><div><span>Email</span><a href={emailUrl} target="_blank" rel="noreferrer">{emailAddress}</a></div><div><span>Website</span><a href="https://www.naengineeringsolutions.com" target="_blank" rel="noreferrer">www.naengineeringsolutions.com <ArrowUpRight size={14}/></a></div></div></div></section>
      <section className="contact-section contact-light"><div className="contact-container"><span className="contact-eyebrow dark"><i/> HOW WE CAN HELP</span><div className="contact-heading"><h2>One point of contact for practical project support.</h2><p>Reach out about any of the services and supply categories below. We’ll confirm the scope with you before proceeding.</p></div><div className="contact-service-grid">{["Civil Engineering","HVAC Systems","Mechanical Engineering","PEB Works","Electrical Works","Fire Fighting","Safety & Security Systems","Industrial Maintenance","Mechanical & Electrical Supplies","Utilities & Facility Maintenance","General Order Supplies & Services","IT Services"].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b><ArrowUpRight size={15}/></div>)}</div></div></section>
      <section className="contact-map"><div className="contact-container contact-map-inner"><div><span className="contact-eyebrow"><i/> VISIT OUR LAHORE OFFICE</span><h2>{officeAddress}</h2><p>Find our office on LDA Avenue, Raiwind Road, Lahore. Open the map for directions before visiting.</p></div><a href={mapsUrl} target="_blank" rel="noreferrer">Get Directions <ArrowUpRight size={17}/></a></div></section>
    </main>
  </div>;
}
