import React, { useState } from "react";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import "./ContactPage.css";

const officeAddress="593 Block-A LDA Avenue, 1 Raiwind Rd, Lahore, 54000";
const mapsUrl="https://www.google.com/maps/place/31%C2%B025'38.7%22N+74%C2%B013'17.5%22E/@31.4274139,74.2189598,17z/data=!3m1!4b1!4m4!3m3!8m2!3d31.4274139!4d74.2215347?hl=en&entry=ttu&g_ep=EgoyMDI2MDgyNS4wIKXMDSoASAFQAw%3D%3D";
const emailAddress="na.engineeringsolutions2023@gmail.com";
const emailUrl=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`;
const API = process.env.REACT_APP_API_URL || `${process.env.REACT_APP_BACKEND_URL || ""}/api`;

export default function ContactPage(){

  const [quote, setQuote] = useState({ full_name: "", company_name: "", email: "", phone: "", service_required: "", message: "" });
  const [attachment, setAttachment] = useState(null);
  const [quoteStatus, setQuoteStatus] = useState({ type: "", message: "" });
  const [quoteBusy, setQuoteBusy] = useState(false);

  const updateQuote = (event) => {
    const { name, value } = event.target;
    setQuote((current) => ({ ...current, [name]: value }));
  };

  const submitQuote = async (event) => {
    event.preventDefault();
    if (quoteBusy) return;
    if (!API || API === "/api") {
      setQuoteStatus({ type: "error", message: "The quote service is not configured right now. Please email na.engineeringsolutions2023@gmail.com." });
      return;
    }
    if (attachment && attachment.size > 8 * 1024 * 1024) {
      setQuoteStatus({ type: "error", message: "Please choose a file smaller than 8 MB." });
      return;
    }
    const payload = new FormData();
    Object.entries(quote).forEach(([key, value]) => payload.append(key, value));
    if (attachment) payload.append("attachment", attachment);
    setQuoteBusy(true);
    setQuoteStatus({ type: "", message: "" });
    try {
      const response = await fetch(API.replace(/\/$/, "") + "/quote", { method: "POST", body: payload });
      let result = {};
      try { result = await response.json(); } catch (_) {}
      if (!response.ok) {
        const detail = typeof result.detail === "string" ? result.detail : "We could not submit your request. Please email na.engineeringsolutions2023@gmail.com.";
        throw new Error(detail);
      }
      setQuoteStatus({ type: "success", message: "Thank you. Your quote request has been submitted successfully. Our team will review the details." });
      setQuote({ full_name: "", company_name: "", email: "", phone: "", service_required: "", message: "" });
      setAttachment(null);
      const fileInput = event.currentTarget.querySelector('input[name="attachment"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setQuoteStatus({ type: "error", message: error.message || "We could not submit your request. Please email na.engineeringsolutions2023@gmail.com." });
    } finally {
      setQuoteBusy(false);
    }
  };

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

      <section className="contact-section contact-quote-section" id="request-a-quote">
        <div className="contact-container contact-quote-grid">
          <div className="contact-quote-intro">
            <span className="contact-eyebrow dark"><i/> REQUEST A QUOTE</span>
            <h2>Tell us what you need.</h2>
            <p>Share your service requirement or item list. Add a specification, BOQ or reference document if it will help us understand the scope.</p>
            <p className="contact-quote-note">Required fields are marked. Attachments: PDF, Word, Excel, CSV, JPG or PNG, up to 8 MB.</p>
          </div>
          <form className="contact-quote-form" onSubmit={submitQuote} data-testid="quote-request-form">
            <div className="contact-quote-fields">
              <label>Full name <span aria-hidden="true">*</span><input name="full_name" value={quote.full_name} onChange={updateQuote} autoComplete="name" required maxLength={120} /></label>
              <label>Company name<input name="company_name" value={quote.company_name} onChange={updateQuote} autoComplete="organization" maxLength={160} /></label>
              <label>Email address <span aria-hidden="true">*</span><input type="email" name="email" value={quote.email} onChange={updateQuote} autoComplete="email" required maxLength={254} /></label>
              <label>Phone number<input type="tel" name="phone" value={quote.phone} onChange={updateQuote} autoComplete="tel" maxLength={40} /></label>
              <label className="contact-quote-wide">Service / item category <span aria-hidden="true">*</span>
                <select name="service_required" value={quote.service_required} onChange={updateQuote} required>
                  <option value="">Select a requirement</option>
                  <option>General Order Supplies &amp; Services</option>
                  <option>Civil Engineering</option>
                  <option>HVAC Works</option>
                  <option>Mechanical Engineering</option>
                  <option>PEB Works</option>
                  <option>Electrical Works</option>
                  <option>Fire Fighting</option>
                  <option>Safety &amp; Security Systems</option>
                  <option>Industrial / Facility Maintenance</option>
                  <option>IT Services &amp; Equipment</option>
                  <option>Other / Project-specific requirement</option>
                </select>
              </label>
              <label className="contact-quote-wide">Requirement details <span aria-hidden="true">*</span><textarea name="message" value={quote.message} onChange={updateQuote} required minLength={5} maxLength={5000} rows={5} placeholder="Include specifications, quantity, delivery location or site details." /></label>
              <label className="contact-quote-wide">Attach BOQ or specification (optional)<input type="file" name="attachment" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png" onChange={(event) => setAttachment(event.target.files && event.target.files[0] ? event.target.files[0] : null)} /><small>Maximum file size: 8 MB.</small></label>
            </div>
            {quoteStatus.message && <p className={"contact-quote-status " + quoteStatus.type} role={quoteStatus.type === "error" ? "alert" : "status"}>{quoteStatus.message}</p>}
            <button className="contact-quote-submit" type="submit" disabled={quoteBusy}>{quoteBusy ? "Submitting request..." : "Submit quote request"} <ArrowUpRight size={17}/></button>
          </form>
        </div>
      </section>
      <section className="contact-section contact-dark"><div className="contact-container contact-details-grid"><div><span className="contact-eyebrow"><i/> COMPANY CONTACT DETAILS</span><h2>NA Engineering Solutions</h2><p>General Order Supplies &amp; Services | Engineering | Maintenance</p></div><div className="contact-detail-list"><div><span>Office</span><b>{officeAddress}</b></div><div><span>Phone</span><b>+92 300 8596393 &nbsp; | &nbsp; +92 302 6880398</b></div><div><span>Email</span><a href={emailUrl} target="_blank" rel="noreferrer">{emailAddress}</a></div><div><span>Website</span><a href="https://www.naengineeringsolutions.com" target="_blank" rel="noreferrer">www.naengineeringsolutions.com <ArrowUpRight size={14}/></a></div></div></div></section>
      <section className="contact-section contact-light"><div className="contact-container"><span className="contact-eyebrow dark"><i/> HOW WE CAN HELP</span><div className="contact-heading"><h2>One point of contact for practical project support.</h2><p>Reach out about any of the services and supply categories below. We’ll confirm the scope with you before proceeding.</p></div><div className="contact-service-grid">{["Civil Engineering","HVAC Systems","Mechanical Engineering","PEB Works","Electrical Works","Fire Fighting","Safety & Security Systems","Industrial Maintenance","Mechanical & Electrical Supplies","Utilities & Facility Maintenance","General Order Supplies & Services","IT Services"].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b><ArrowUpRight size={15}/></div>)}</div></div></section>
      <section className="contact-map"><div className="contact-container contact-map-inner"><div><span className="contact-eyebrow"><i/> VISIT OUR LAHORE OFFICE</span><h2>{officeAddress}</h2><p>Find our office on LDA Avenue, Raiwind Road, Lahore. Open the map for directions before visiting.</p></div><a href={mapsUrl} target="_blank" rel="noreferrer">Get Directions <ArrowUpRight size={17}/></a></div></section>
    </main>
  </div>;
}
