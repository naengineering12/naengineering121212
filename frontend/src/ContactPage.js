import React from "react";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import "./ContactPage.css";

const officeAddress="593 Block-A LDA Avenue, 1 Raiwind Rd, Lahore, 54000";
const mapsUrl="https://www.google.com/maps/place/31%C2%B025'38.7%22N+74%C2%B013'17.5%22E/@31.4274139,74.2189598,17z/data=!3m1!4b1!4m4!3m3!8m2!3d31.4274139!4d74.2215347?hl=en&entry=ttu&g_ep=EgoyMDI2MDgyNS4wIKXMDSoASAFQAw%3D%3D";
const emailAddress="na.engineeringsolutions2023@gmail.com";
const emailUrl=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`;

export default function ContactPage(){
  const [inquiryStatus,setInquiryStatus]=React.useState({kind:"idle",message:""});
  const submitInquiry=async(event)=>{
    event.preventDefault();
    const formElement=event.currentTarget;
    setInquiryStatus({kind:"sending",message:"Sending your request..."});
    try{
      const apiBase=(process.env.REACT_APP_BACKEND_URL||"").replace(/\\/+$/,"");
      const response=await fetch(`${apiBase}/api/quote`,{method:"POST",body:new FormData(formElement)});
      const payload=await response.json().catch(()=>({}));
      if(!response.ok){
        const detail=typeof payload.detail==="string"?payload.detail:"We could not send your request right now.";
        throw new Error(detail);
      }
      formElement.reset();
      setInquiryStatus({kind:"success",message:"Thank you. Your enquiry has been submitted. Our team will follow up using the contact details you provided."});
    }catch(error){
      setInquiryStatus({kind:"error",message:error.message||"Your enquiry could not be submitted. Please email na.engineeringsolutions2023@gmail.com or call us directly."});
    }
  };
  const cards=[
    {icon:MapPin,title:"Lahore Office",text:officeAddress,href:mapsUrl,label:"Get directions in Google Maps"},
    {icon:Phone,title:"Primary Phone",text:"+92 300 8596393",href:"tel:+923008596393",label:"Call us"},
    {icon:Phone,title:"Alternate Phone",text:"+92 302 6880398",href:"tel:+923026880398",label:"Call us"},
    {icon:Mail,title:"Email",text:emailAddress,href:emailUrl,label:"Send an email"},
  ];
  return <div className="contact-site">
    <section className="contact-intro"><div className="contact-container"><span className="contact-eyebrow"><i/> CONTACT US / NA ENGINEERING SOLUTIONS</span><h1>Let's work together.</h1><p>Have an engineering, supply, maintenance or project requirement? Tell us what you need and speak directly with NA Engineering Solutions.</p></div></section>
    <main>
      <section className="contact-section contact-light"><div className="contact-container contact-main-grid"><div className="contact-main-copy"><span className="contact-eyebrow dark"><i/> GET IN TOUCH</span><h2>Speak directly with our team.</h2><p>Need engineering work, industrial supplies, facility maintenance, IT equipment or General Order Supplies &amp; Services? Send us the requirement and we will discuss the scope with you.</p><p>You can call, email, message us on WhatsApp or visit our Lahore office. For quotations, sharing the item list, specification or site requirement helps us respond accurately.</p><div className="contact-buttons"><a className="contact-btn primary" href="https://wa.me/923008596393?text=Hello%20NA%20Engineering%20Solutions%2C%20I%20would%20like%20to%20discuss%20a%20requirement." target="_blank" rel="noreferrer"><MessageCircle size={18}/> WhatsApp Us <ArrowUpRight size={16}/></a><a className="contact-btn secondary" href={emailUrl} target="_blank" rel="noreferrer"><Mail size={18}/> Email Us <ArrowUpRight size={16}/></a></div></div><div className="contact-card-grid">{cards.map(({icon:Icon,title,text,href,label})=><a className="contact-card" href={href} target={href.startsWith("http")?"_blank":undefined} rel={href.startsWith("http")?"noreferrer":undefined} key={title}><span className="contact-card-icon"><Icon size={21}/></span><span><b>{title}</b><strong>{text}</strong><small>{label} <ArrowUpRight size={13}/></small></span></a>)}</div></div></section>
      <section className="contact-section contact-light contact-inquiry-section">
        <div className="contact-container contact-inquiry-grid">
          <div className="contact-inquiry-copy">
            <span className="contact-eyebrow dark"><i/> REQUEST A QUOTATION</span>
            <h2>Tell us what your site or team needs.</h2>
            <p>Share the item list, drawings, specifications or the service required. The more detail you provide, the easier it is for us to review the scope and respond accurately.</p>
            <div className="contact-inquiry-points">
              <p><b>01</b> Engineering and maintenance requirements</p>
              <p><b>02</b> General order and industrial supply lists</p>
              <p><b>03</b> Site/project coordination and equipment support</p>
            </div>
          </div>
          <form className="contact-inquiry-form" onSubmit={submitInquiry} data-testid="contact-inquiry-form">
            <div className="contact-inquiry-form-head"><span>ENQUIRY FORM</span><small>Fields marked * are required</small></div>
            <div className="contact-inquiry-fields">
              <label>Full name *<input name="full_name" type="text" autoComplete="name" maxLength="120" required placeholder="Your name"/></label>
              <label>Company / organization<input name="company_name" type="text" autoComplete="organization" maxLength="160" placeholder="Company name"/></label>
              <label>Email address *<input name="email" type="email" autoComplete="email" maxLength="254" required placeholder="you@company.com"/></label>
              <label>Phone number<input name="phone" type="tel" autoComplete="tel" maxLength="40" placeholder="+92 ..."/></label>
              <label className="contact-inquiry-full">Service / requirement *<select name="service_required" required defaultValue=""><option value="" disabled>Select a requirement</option><option>Engineering Consultancy</option><option>Civil Engineering</option><option>Mechanical Engineering</option><option>HVAC Systems & Services</option><option>PEB Works</option><option>Electrical Works</option><option>Fire Fighting Equipment</option><option>Industrial Maintenance</option><option>Mechanical & Electrical Supplies</option><option>General Order Supplies & Services</option><option>IT Services & Equipment</option><option>Other / Multiple Requirements</option></select></label>
              <label className="contact-inquiry-full">Tell us about the requirement *<textarea name="message" minLength="8" maxLength="5000" required rows="5" placeholder="Item list, quantities, specifications, site location, target date or project scope..."/></label>
              <label className="contact-inquiry-full contact-inquiry-file">Attach drawings or item list (optional)<input name="attachment" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"/><small>PDF, Word, Excel, CSV, JPG or PNG. Maximum file size: 8 MB.</small></label>
            </div>
            {inquiryStatus.message&&<p className={`contact-inquiry-status ${inquiryStatus.kind}`} role="status" aria-live="polite">{inquiryStatus.message}</p>}
            <button className="contact-inquiry-submit" type="submit" disabled={inquiryStatus.kind==="sending"}>{inquiryStatus.kind==="sending"?"Sending...":"Submit enquiry"} <ArrowUpRight size={17}/></button>
            <p className="contact-inquiry-privacy">Your details are used to respond to this enquiry and discuss the requested work or supplies.</p>
          </form>
        </div>
      </section>
      <section className="contact-section contact-dark"><div className="contact-container contact-details-grid"><div><span className="contact-eyebrow"><i/> COMPANY CONTACT DETAILS</span><h2>NA Engineering Solutions</h2><p>General Order Supplies &amp; Services | Engineering | Maintenance</p></div><div className="contact-detail-list"><div><span>Office</span><b>{officeAddress}</b></div><div><span>Phone</span><b>+92 300 8596393 &nbsp; | &nbsp; +92 302 6880398</b></div><div><span>Email</span><a href={emailUrl} target="_blank" rel="noreferrer">{emailAddress}</a></div><div><span>Website</span><a href="https://www.naengineeringsolutions.com" target="_blank" rel="noreferrer">www.naengineeringsolutions.com <ArrowUpRight size={14}/></a></div></div></div></section>
      <section className="contact-section contact-light"><div className="contact-container"><span className="contact-eyebrow dark"><i/> WHAT YOU CAN CONTACT US ABOUT</span><div className="contact-heading"><h2>Engineering, supplies and support from one team.</h2><p>Contact us for a complete project or a single item, service or maintenance requirement.</p></div><div className="contact-service-grid">{["Civil Engineering","HVAC Systems","Mechanical Engineering","PEB Works","Electrical Works","Fire Fighting","Safety & Security Systems","Industrial Maintenance","Mechanical & Electrical Supplies","Utilities & Facility Maintenance","General Order Supplies & Services","IT Services"].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b><ArrowUpRight size={15}/></div>)}</div></div></section>
      <section className="contact-map"><div className="contact-container contact-map-inner"><div><span className="contact-eyebrow"><i/> VISIT OUR LAHORE OFFICE</span><h2>{officeAddress}</h2><p>Our office is in LDA Avenue on Raiwind Road, Lahore.</p></div><a href={mapsUrl} target="_blank" rel="noreferrer">Get Directions <ArrowUpRight size={17}/></a></div></section>
    </main>
  </div>;
}
