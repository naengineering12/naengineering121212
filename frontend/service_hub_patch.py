"""Add the IT Services hub page and navigation before build."""
from pathlib import Path

path = Path("src/App.js")
source = path.read_text()

new_nav = "const nav=[['Home','/'],['Services','/services'],['IT Services','/it-services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']];"
source = source.replace("const nav=[['Home','/'],['Services','/services'],['Engineering Supplies & Services','/engineering-supplies-services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']];", new_nav, 1)
source = source.replace("const nav=[['Home','/'],['Services','/services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']];", new_nav, 1)

marker = "function Supplies(){"
page = r'''function ITServices(){const groups=[
{title:"IT Infrastructure & Networking",icon:Wrench,image:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31",text:"Network design, structured cabling, switches, routers, Wi-Fi, racks and practical infrastructure support for offices and industrial sites."},
{title:"CCTV & Surveillance",icon:ShieldCheck,image:"https://images.unsplash.com/photo-1557597774-9d273605dfa9",text:"CCTV cameras, recording systems, monitoring and surveillance solutions designed around site coverage, security and operational needs."},
{title:"Access Control",icon:ShieldCheck,image:"https://images.unsplash.com/photo-1558008258-3256797b43f3",text:"Door access systems, biometric devices, RFID solutions and controlled-entry setups for offices, facilities and restricted areas."},
{title:"Computer & Laptop Supply",icon:Building2,image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853",text:"Business computers, laptops, workstations and accessories supplied according to user requirements, performance needs and budget."},
{title:"Printers & Scanners",icon:PackageCheck,image:"https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6",text:"Office printers, scanners, multifunction devices, consumables and related support for reliable day-to-day document handling."},
{title:"Servers & Storage",icon:Factory,image:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31",text:"Server hardware, storage, backup equipment and infrastructure support for businesses that need dependable data and system availability."},
{title:"Software & IT Support",icon:Headphones,image:"https://images.unsplash.com/photo-1515879218367-8466d910aaa4",text:"Software setup, user support, troubleshooting, system configuration and practical IT assistance for everyday business operations."},
{title:"IT Hardware & All Accessories",icon:HardHat,image:"https://images.unsplash.com/photo-1593640408182-31c70c8268f5",text:"Keyboards, mice, monitors, UPS units, cables, adapters, networking accessories, storage devices and other IT hardware."},
{title:"Annual Maintenance / Technical Support",icon:Wrench,image:"https://images.unsplash.com/photo-1581092921461-eab62e97a780",text:"Planned maintenance, troubleshooting and technical support to keep workplace IT systems available, organised and performing reliably."}
];return <><PageIntro eyebrow="IT SERVICES / TECHNOLOGY SUPPORT" title="IT Services that keep your workplace connected.">NA Engineering Solutions provides practical IT infrastructure, security, hardware and technical support for businesses that need dependable technology without unnecessary complexity.</PageIntro><main className="section section-light"><div className="container"><SectionLabel>IT INFRASTRUCTURE / SECURITY / SUPPORT</SectionLabel><div className="section-heading"><h2>From a new network to everyday technical support, we help keep your systems working.</h2><p>Tell us what your office, facility or project needs. NA Engineering Solutions can supply the equipment, coordinate installation and provide ongoing technical support around the requirement.</p></div><div className="supply-grid">{groups.map((g,i)=><article className="supply-card" key={g.title}><div className="supply-card-image"><img loading="lazy" decoding="async" src={img(g.image)} alt={`${g.title} by NA Engineering Solutions`} /><span>{String(i+1).padStart(2,'0')}</span></div><g.icon size={24}/><h3>{g.title}</h3><p>{g.text}</p><div className="service-features"><span><CheckCircle2 size={15}/> Requirement-led solutions</span><span><CheckCircle2 size={15}/> Technical support</span></div></article>)}</div></div></main><section className="section industry-section"><div className="container"><div className="split"><div><SectionLabel>LET'S GET YOUR IT WORKING</SectionLabel><h2>Need a complete setup or just one reliable component?</h2></div><div><p className="lead">Send us your requirement, BOQ, equipment list or site details. Our team can help with specification, supply, installation and ongoing support.</p><Button to="/contact" testid="it-services-contact">Discuss Your IT Requirement</Button></div></div></div></section></>}
'''
if "function ITServices()" not in source:
    source = source.replace(marker, page + marker, 1)
source = source.replace('<Route path="/engineering-supplies-services" element={<EngineeringSuppliesServices/>}/>','',1)
route_old = '<Route path="/services" element={<Services/>}/><Route path="/services/:slug" element={<ServiceRoute/>}/>'
route_new = '<Route path="/services" element={<Services/>}/><Route path="/it-services" element={<ITServices/>}/><Route path="/services/:slug" element={<ServiceRoute/>}/>'
source = source.replace(route_old, route_new, 1)
source = source.replace("[['Home','/'],['Services','/services'],['Engineering Supplies & Services','/engineering-supplies-services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']]", "[['Home','/'],['Services','/services'],['IT Services','/it-services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']]", 1)
source = source.replace("[['Home','/'],['Services','/services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']]", "[['Home','/'],['Services','/services'],['IT Services','/it-services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']]", 1)
path.write_text(source)
print("IT Services hub page and navigation applied.")
