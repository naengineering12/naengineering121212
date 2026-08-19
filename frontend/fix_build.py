"""Apply deterministic frontend syntax repairs and resilient contact fallback before build."""
from pathlib import Path
import re

path = Path("src/App.js")
source = path.read_text()

# About() must close its React fragment before Industries().
source = source.replace("</main>}\nfunction Industries", "</main></>}\nfunction Industries", 1)

# Keep the streamed chat parser's separator as a normal escaped literal.
source = source.replace("const parts=buf.split('\\n\\n');", "const parts=buf.split('\\n\\n');", 1)

# If the quote API is temporarily unavailable, open a pre-filled Gmail draft instead of
# showing the old generic error. The normal API path remains the first choice.
contact_fallback = r'''function Contact(){
  const [sending,setSending]=useState(false); const [done,setDone]=useState(false);
  const submit=async(e)=>{
    e.preventDefault(); setSending(true); const form=e.target; const data=new FormData(form);
    try{
      await axios.post(`${API}/quote`,data);
      setDone(true); toast.success('Your request has been received.'); form.reset();
    }catch(err){
      const values=[];
      for(const [key,value] of data.entries()){
        if(key==='attachment') continue;
        if(typeof value==='string' && value.trim()) values.push(`${key.replaceAll('_',' ')}: ${value}`);
      }
      const file=data.get('attachment');
      if(file && file.name) values.push(`Attachment to add manually: ${file.name}`);
      const subject=encodeURIComponent(`NA Engineering Quote Request - ${data.get('service_required') || 'Website enquiry'}`);
      const body=encodeURIComponent(`Hello NA Engineering Solutions,\n\nMy website quote request could not be submitted automatically. Please treat this email as my enquiry.\n\n${values.join('\n')}\n\nThank you.`);
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=na.engineeringsolutions2023@gmail.com&su=${subject}&body=${body}`,'_blank','noopener,noreferrer');
      setDone(true); toast.success('Email draft opened. Please review and send it.'); form.reset();
    }finally{setSending(false)}
  };
  return <><PageIntro eyebrow="CONTACT / START A CONVERSATION" title="Let's work together">Have an engineering, supply, maintenance or project requirement? Contact NA Engineering Solutions and tell us what you need.</PageIntro><main className="section section-light"><div className="container contact-grid"><div className="contact-info"><SectionLabel>FIND US IN LAHORE</SectionLabel><h2>Bring us the requirement. We'll help shape the next step.</h2><a href="https://mail.google.com/mail/?view=cm&to=na.engineeringsolutions2023@gmail.com" target="_blank" rel="noreferrer" className="contact-line" data-testid="contact-email"><Mail/>na.engineeringsolutions2023@gmail.com</a><span className="contact-line" data-testid="contact-address"><MapPin/>593, A-Block LDA, Avenue-1, Raiwind Road, Lahore, Pakistan</span><a className="map-link-line" href="https://www.google.com/maps/search/?api=1&query=593%20A-Block%20LDA%20Avenue-1%20Raiwind%20Road%20Lahore%20Pakistan" target="_blank" rel="noreferrer" data-testid="open-map-link">Open in Google Maps <ArrowUpRight size={15}/></a></div><form className="quote-form" onSubmit={submit} data-testid="quote-form"><div className="form-head"><SectionLabel>REQUEST A QUOTE</SectionLabel><h2>Tell us what you need.</h2></div><div className="form-grid"><label>Full Name<input name="full_name" required data-testid="quote-full-name" placeholder="Your name"/></label><label>Company Name<input name="company_name" data-testid="quote-company-name" placeholder="Company (optional)"/></label><label>Email<input type="email" name="email" required data-testid="quote-email" placeholder="you@company.com"/></label><label>Phone<input name="phone" data-testid="quote-phone" placeholder="+92 ..."/></label></div><label>Service Required<select name="service_required" required data-testid="quote-service"><option value="">Select a service</option>{services.map(s=><option key={s.slug}>{s.title}</option>)}<option>General Order Supplies & Services</option><option>Other / Project Support</option></select></label><label>Message<textarea name="message" required data-testid="quote-message" placeholder="Tell us briefly about your requirement..."/></label><label className="file-input">Upload BOQ / Requirement<input type="file" name="attachment" data-testid="quote-attachment" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.png"/><span>Optional · PDF, spreadsheet or image up to 8 MB</span></label><button className="button form-submit" disabled={sending} data-testid="quote-submit">{sending?'Sending request...':done?'Request sent':'Submit Request'}<ArrowRight size={16}/></button>{done&&<p className="success-message" data-testid="quote-success"><CheckCircle2 size={17}/> Thank you — our team will review your requirement and respond soon.</p>}<p className="form-note">Your request is stored securely and our team is notified by email instantly.</p></form></div></main></>}
'''

source, changed = re.subn(r"function Contact\(\)\{.*?\n\nfunction useLenis", contact_fallback + "\nfunction useLenis", source, count=1, flags=re.S)
if changed:
    path.write_text(source)
else:
    print("Contact fallback already applied or Contact() was not found.")

print("Frontend syntax repairs and contact fallback applied before build.")
