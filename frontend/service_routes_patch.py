from pathlib import Path
import re

# The detailed-page patch contains the actual content/layout for the new service
# pages. Run it as part of the existing build hook so it cannot be skipped.
detail_patch = Path("service_detail_pages_patch.py")
if detail_patch.exists():
    exec(compile(detail_patch.read_text(), str(detail_patch), "exec"), {"__name__": "service_detail_pages_patch"})

app = Path("src/App.js")
source = app.read_text()

# Ensure useParams is available for the universal service detail route.
source = re.sub(
    r"BrowserRouter, Routes, Route, Link, useLocation, useNavigate(?!, useParams)",
    "BrowserRouter, Routes, Route, Link, useLocation, useNavigate, useParams",
    source,
    count=1,
)

component = r'''
function UniversalServiceRoute(){
  const {slug}=useParams();
  const service=services.find(s=>s.slug===slug);
  if(!service){
    return <PageIntro eyebrow="SERVICES / NOT FOUND" title="Service not found">The requested service could not be found. Please return to our services catalogue and select a service.</PageIntro>;
  }
  const data=(typeof specialistDetailData!=='undefined'&&specialistDetailData[service.title])||null;
  const features=(typeof specialistDetailFeatures!=='undefined'&&specialistDetailFeatures[service.title])||detailFeatures[service.title]||[];
  return <>
    <PageIntro eyebrow={`SERVICES / ${service.title.toUpperCase()}`} title={service.title}>{data?.intro||service.text}</PageIntro>
    <main className="section section-light">
      <div className="container detail-grid">
        <img className="detail-image" src={img(service.image)} alt={`${service.title} professional service`} />
        <div>
          <SectionLabel>WHAT WE PROVIDE</SectionLabel>
          <h2>{data?.overview||'Professional supply, technical support and execution.'}</h2>
          <p>{service.text}</p>
          <ul className="feature-list">
            {(data?.items?.slice(0,6)||features).map((x,i)=><li key={typeof x==='string'?x:x.title}><CheckCircle2 size={17}/>{typeof x==='string'?x:x.title}</li>)}
          </ul>
          <Button to="/contact" secondary testid={`service-detail-contact-${service.slug}`}>Discuss This Requirement</Button>
        </div>
      </div>
      {data&&<div className="container specialist-detail-block">
        <SectionLabel>DETAILED SCOPE</SectionLabel>
        <div className="specialist-grid">
          {data.items.map((x,i)=><article className="specialist-card" key={x.title}><span>{String(i+1).padStart(2,'0')}</span><h3>{x.title}</h3><p>{x.text}</p></article>)}
        </div>
        <div className="detail-bottom-grid">
          <div><SectionLabel>APPLICATIONS</SectionLabel><h2>Where we support your requirement.</h2><div className="application-list">{data.applications.map(x=><span key={x}><CheckCircle2 size={16}/>{x}</span>)}</div></div>
          <div className="detail-callout"><span>NA ENGINEERING SOLUTIONS</span><h3>Requirement-based sourcing and dependable project support.</h3><p>Share your BOQ, drawing, specification or site requirement and our team can help define the right supply or service scope.</p><Button to="/contact" secondary>Request a Quote</Button></div>
        </div>
      </div>}
    </main>
  </>;
}
'''

if "function UniversalServiceRoute()" not in source:
    marker = "\nfunction App() {"
    if marker not in source:
        raise SystemExit("Could not find App component marker")
    source = source.replace(marker, "\n" + component + marker, 1)

# Remove every older /services/:slug route first. The previous implementation
# used a nested JSX expression, so the old regex could miss it and leave the
# old route before the universal route. React Router would then match the old
# route first, hiding the new detailed-page content.
source = re.sub(
    r'<Route\s+path=["\']/services/:slug["\']\s+element=\{<[^>]+/>\}\s*/>',
    '',
    source,
    flags=re.S,
)

# Insert exactly one universal route immediately before the wildcard route.
universal_route = '<Route path="/services/:slug" element={<UniversalServiceRoute/>}/>'
if universal_route not in source:
    wildcard = '<Route path="*" element={<Home/>}/>'
    if wildcard not in source:
        raise SystemExit("Could not find wildcard route")
    source = source.replace(wildcard, universal_route + wildcard, 1)

app.write_text(source)
print("Service detail pages and universal service routing applied.")
