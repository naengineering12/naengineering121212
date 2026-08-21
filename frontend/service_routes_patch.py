from pathlib import Path

app = Path('src/App.js')
source = app.read_text()

# Ensure useParams is available for the universal service detail route.
source = source.replace(
    'BrowserRouter, Routes, Route, Link, useLocation, useNavigate',
    'BrowserRouter, Routes, Route, Link, useLocation, useNavigate, useParams',
    1,
)

component = r'''
function UniversalServiceRoute(){
  const {slug}=useParams();
  const service=services.find(s=>s.slug===slug);
  if(!service){
    return <PageIntro eyebrow="SERVICES / NOT FOUND" title="Service not found">The requested service could not be found. Please return to our services catalogue and select a service.</PageIntro>;
  }
  const features=(typeof specialistDetailFeatures!=='undefined'&&specialistDetailFeatures[service.title])||detailFeatures[service.title]||[
    `Supply and support for ${service.title.toLowerCase()}`,
    'Site-ready planning, sourcing and technical coordination',
    'Installation, repair, replacement and maintenance support',
    'Project-specific solutions based on customer requirements'
  ];
  return <>
    <PageIntro eyebrow={`SERVICES / ${service.title.toUpperCase()}`} title={service.title}>{service.text}</PageIntro>
    <main className="section section-light">
      <div className="container detail-grid">
        <div className="detail-image-wrap">
          <img className="detail-image" src={img(service.image)} alt={`${service.title} professional project`} />
        </div>
        <div className="detail-copy">
          <SectionLabel>WHAT WE SUPPORT</SectionLabel>
          <h2>Practical support for demanding environments.</h2>
          <p>NA Engineering Solutions helps customers plan, source and execute the work required to keep their sites, systems and projects operating effectively. We build the scope around your requirements, technical specifications and actual site conditions.</p>
          <ul className="feature-list">{features.map(x=><li key={x}><CheckCircle2 size={17}/>{x}</li>)}</ul>
          <p>From material sourcing and technical coordination to installation, maintenance and replacement support, our team works to provide a dependable and practical solution for each requirement.</p>
        </div>
      </div>
    </main>
  </>;
}
'''

if 'function UniversalServiceRoute()' not in source:
    marker = '\nfunction App() {'
    if marker not in source:
        raise SystemExit('Could not find App component marker')
    source = source.replace(marker, '\n' + component + marker, 1)

# Route every service slug through the universal detail page. This replaces any
# older ServiceRoute implementation so newly-added services cannot fall through.
source = source.replace(
    '<Route path="/services/:slug" element={<ServiceRoute/>}/>',
    '<Route path="/services/:slug" element={<UniversalServiceRoute/>}/>',
    1,
)

app.write_text(source)
print('Universal service detail routing applied.')
