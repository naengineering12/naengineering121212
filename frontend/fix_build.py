"""Apply deterministic frontend syntax repairs and a safe quote fallback before build."""
from pathlib import Path

path = Path("src/App.js")
source = path.read_text()

# About() must close its React fragment before Industries().
source = source.replace("</main>}\nfunction Industries", "</main></>}\nfunction Industries", 1)

# Keep the streamed chat parser's separator as a normal escaped literal.
source = source.replace("const parts=buf.split('\\n\\n');", "const parts=buf.split('\\n\\n');", 1)

# If the quote API/email service is unavailable, open a pre-filled Gmail draft
# instead of leaving the visitor with a dead-end error message. The API remains first choice.
old = "catch(err){toast.error('We could not submit your request. Please email us directly.')}"
new = r'''catch(err){
  const values=[];
  for(const [key,value] of form.entries()){
    if(key==='attachment') continue;
    if(typeof value==='string' && value.trim()) values.push(`${key.replaceAll('_',' ')}: ${value}`);
  }
  const file=form.get('attachment');
  if(file && file.name) values.push(`Attachment to add manually: ${file.name}`);
  const subject=encodeURIComponent(`NA Engineering Quote Request - ${form.get('service_required') || 'Website enquiry'}`);
  const body=encodeURIComponent(`Hello NA Engineering Solutions,\n\nMy website quote request could not be submitted automatically. Please treat this email as my enquiry.\n\n${values.join('\\n')}\n\nThank you.`);
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=na.engineeringsolutions2023@gmail.com&su=${subject}&body=${body}`,'_blank','noopener,noreferrer');
  toast.success('Email draft opened. Please review and send it.');
}'''
if old in source:
    source = source.replace(old, new, 1)

path.write_text(source)
print("Frontend syntax repairs and quote email fallback applied before build.")
