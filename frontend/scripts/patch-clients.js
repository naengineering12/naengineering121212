const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'src', 'App.js');
let source = fs.readFileSync(appPath, 'utf8');

const clientsStart = source.indexOf('const clients=[');
const clientsEnd = source.indexOf('\n\nfunction formatDetail', clientsStart);
if (clientsStart === -1 || clientsEnd === -1) {
  throw new Error('Could not locate the Clients section in App.js');
}

const replacement = `const clientLogo = (domain) => \`https://www.google.com/s2/favicons?domain=\${domain}&sz=128\`;
const clients = [
  { n:"Gerry's dnata", ind:"Aviation & Ground Handling", icon:Plane, domain:"gerrysdnata.com", d:"Ground handling, cargo and airport support services across Pakistan." },
  { n:"Interloop Limited", ind:"Textile Manufacturing", icon:Shirt, domain:"interloop-pk.com", d:"Facility, engineering and industrial support for large-scale textile production." },
  { n:"Joyland Group", ind:"Recreation & Entertainment", icon:Sparkles, domain:"joyland.com.pk", d:"Engineering, facility and maintenance support for recreation environments." },
  { n:"Lake City", ind:"Real Estate & Facilities", icon:Building2, domain:"lakecitylahore.com", d:"Facility, maintenance and project support for residential and commercial environments." },
  { n:"Fatima Fertilizer", ind:"Fertilizer & Industrial", icon:FlaskConical, domain:"fatimafertilizer.com", d:"Industrial maintenance, engineering and supply support for fertilizer operations." },
  { n:"ZIC Oil", ind:"Lubricants & Industrial", icon:Factory, domain:"zicoil.pk", d:"Industrial, maintenance and supply support for lubricant and automotive environments." },
  { n:"Dandot Cement", ind:"Cement & Construction Materials", icon:Factory, domain:"dandotcement.com", d:"Mechanical, electrical and industrial support for cement plant environments." },
  { n:"Nimir Chemicals", ind:"Chemical & Industrial", icon:FlaskConical, domain:"nimirchemicals.com", d:"Industrial supplies, maintenance and engineering support for chemical processing operations." },
];

const airportSites = [
  { n:"Lahore International Airport", mono:"LA", d:"Facility support and technical services for airport operations environments." },
  { n:"Sialkot International Airport", mono:"SA", domain:"sial.com.pk", d:"Maintenance and supply support for airport infrastructure." },
  { n:"Multan International Airport", mono:"MUX", d:"Airport facility, maintenance and technical support." },
];

function ClientLogo({domain, mono, alt}) {
  const [failed, setFailed] = useState(false);
  return <div className="client-logo-wrap">{domain && !failed ? <img src={clientLogo(domain)} alt={alt || "Client logo"} loading="lazy" onError={()=>setFailed(true)} /> : null}<span className="logo-mono" aria-hidden="true">{mono}</span></div>;
}

function Clients(){
  const projects=[{t:"Airport Facility Maintenance Support",loc:"Lahore / Sialkot / Multan Airports",s:"HVAC maintenance, electrical works, technical support and PPE supply",im:"1615309662243-70f6df917b59"},{t:"Plant Mechanical Supply & Support",loc:"Nimir Chemicals, Lahore",s:"Pumps, motors, industrial spares and maintenance",im:"1513828583688-c52646db42da"},{t:"Textile Facility Support Program",loc:"Interloop Limited",s:"Tools, safety equipment and facility consumables",im:"1553413077-190dd305871c"}];
  const stats=[[180,'+','Projects Completed'],[170,'+','Happy Clients'],[35,'+','Sites Served'],[28,'+','Years of Experience']];
  const why=[[Users,'Professional Team','Trained engineers and coordinators who understand industrial sites.'],[Clock,'On-Time Delivery','Materials and work delivered on schedule, every time.'],[ShieldCheck,'Industrial Safety','Safety-led execution with proper PPE and site practices.'],[Headphones,'Technical Support','Responsive help before, during and after every job.']];
  const gallery=[["1541888946425-d81bb19240f5","Site execution"],["1558618666-fcd25c85cd64","Mechanical works"],["1567954970774-58d6aa6c50dc","Safety first"],["1473341304170-971dccb5ac1e","Electrical works"],["1530124566582-a618bc2615dc","Tools & hardware"],["1587293852726-70cdb56c2866","Supply & storage"]];
  const testimonials=[["Response time is excellent — materials arrive as specified, every time.","Procurement Manager · Food & Beverage"],["Their team understands industrial sites. Work is planned, safe and on schedule.","Maintenance Lead · Cement Industry"],["One call covers supplies and technical work. It simplifies our procurement.","Facility Manager · Aviation"]];
  return <><PageIntro eyebrow="OUR CLIENTS" title="Our Clients">Trusted by leading organizations across Pakistan.</PageIntro><main>
    <Reveal><section className="section section-light clients-page"><div className="container"><SectionLabel>WHO WE SERVE</SectionLabel><div className="section-heading clients-heading"><div><h2>Partnerships built on delivery.</h2></div><p>From aviation to food production, organizations rely on us for dependable engineering, maintenance, project execution and supply support.</p></div>
      <div className="airport-client-card"><div className="airport-client-head"><div><span className="client-ind">Aviation</span><h3>Lahore International Airport</h3><p>Airport support across Lahore, Sialkot and Multan.</p></div><Plane size={30}/></div><div className="airport-sites">{airportSites.map((site)=><a className="airport-site" key={site.n} href={site.domain ? \`https://\${site.domain}\` : undefined} target={site.domain ? "_blank" : undefined} rel={site.domain ? "noreferrer" : undefined}><ClientLogo domain={site.domain} mono={site.mono} alt={site.n + " logo"}/><div><h4>{site.n}</h4><span>{site.d}</span></div><ArrowUpRight size={17}/></a>)}</div></div>
      <div className="clients-grid">{clients.map((c,i)=><a className="client-card client-card-link" href={\`https://\${c.domain}\`} target="_blank" rel="noreferrer" key={c.n} data-testid={\`client-\${i}\`}><ClientLogo domain={c.domain} mono={c.n.split(' ').map(x=>x[0]).join('').slice(0,3)} alt={c.n + " logo"}/><span className="client-ind">{c.ind}</span><h3>{c.n}</h3><p>{c.d}</p><span className="client-arrow">↗</span></a>)}</div>
      <p className="clients-note">Client names and logos are presented for identification of organizations served by NA Engineering Solutions. Each available client card links to its official website.</p>
    </div></section></Reveal>
    <Reveal><section className="section industry-section"><div className="container"><SectionLabel>PROJECT SHOWCASE</SectionLabel><div className="section-heading"><h2>Recent support, on real sites.</h2></div><div className="projects-grid">{projects.map((p,i)=><div className="project-card" key={p.t} data-testid={\`project-\${i}\`}><div className="project-card-img"><img src={img(\`https://images.unsplash.com/photo-\${p.im}\`)} alt={p.t}/><span>0{i+1}</span></div><h3>{p.t}</h3><div className="proj-loc"><MapPin size={13}/>{p.loc}</div><p><b>Services:</b> {p.s}</p></div>)}</div></div></section></Reveal>
    <section className="stats-band"><div className="container"><div className="stats-grid">{stats.map(([n,s,l])=><div className="stat" key={l} data-testid={\`stat-\${l.toLowerCase().replaceAll(' ','-')}\`}><Counter to={n} suffix={s}/><span>{l}</span></div>)}</div></div></section>
    <Reveal><section className="section section-light"><div className="container"><SectionLabel>WHY CLIENTS CHOOSE US</SectionLabel><div className="section-heading"><h2>The reasons they stay.</h2></div><div className="why-grid">{why.map(([Icon,t,d],i)=><div className="supply-card" key={t}><Icon size={24}/><h3>{t}</h3><p>{d}</p></div>)}</div></div></section></Reveal>
    <Reveal><section className="section industry-section"><div className="container"><SectionLabel>GALLERY</SectionLabel><div className="section-heading"><h2>Work, up close.</h2></div><div className="gallery-grid">{gallery.map(([im,cap])=><div className="gallery-item" key={im}><img src={img(\`https://images.unsplash.com/photo-\${im}\`)} alt={cap}/><span>{cap}</span></div>)}</div></div></section></Reveal>
    <Reveal><section className="section section-light"><div className="container"><SectionLabel>TESTIMONIALS</SectionLabel><div className="section-heading"><h2>What clients tell us.</h2></div><div className="testi-grid">{testimonials.map(([q,who],i)=><div className="testi-card" key={i} data-testid={\`testimonial-\${i}\`}><Quote size={22}/><p>"{q}"</p><span>{who}</span></div>)}</div></div></section></Reveal>
    <section className="cta"><div className="container cta-inner"><SectionLabel>START YOUR PROJECT</SectionLabel><h2>Let's build your next<br/>engineering project.</h2><p>Tell us what you need — supplies, services or complete project support.</p><div className="cta-actions"><Button testid="clients-get-quote">Get a Free Quote</Button><Button to="/contact" secondary testid="clients-contact">Contact Us</Button><a className="button button-whatsapp" href="https://wa.me/923008596393?text=Hello%20NA%20Engineering%20Solutions%2C%20I%20would%20like%20to%20discuss%20a%20project." target="_blank" rel="noreferrer" data-testid="clients-whatsapp">WhatsApp Us</a></div></div></section>
  </main></>
}`;

source = source.slice(0, clientsStart) + replacement + source.slice(clientsEnd);
if (!source.includes('import "./clients-responsive.css";')) {
  source = source.replace('import "./App.css";', 'import "./App.css";\nimport "./clients-responsive.css";');
}
fs.writeFileSync(appPath, source);
console.log('Clients page patch applied for production build.');
