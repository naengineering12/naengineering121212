"""Add the Engineering Supplies & Services hub page and navigation before build."""
from pathlib import Path

path = Path("src/App.js")
source = path.read_text()

# Add a dedicated navigation item immediately after Services.
old_nav = "const nav=[['Home','/'],['Services','/services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']];"
new_nav = "const nav=[['Home','/'],['Services','/services'],['Engineering Supplies & Services','/engineering-supplies-services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']];"
source = source.replace(old_nav, new_nav, 1)

# Add the page before the General Order Supplies page.
marker = "function Supplies(){"
page = r'''function EngineeringSuppliesServices(){const groups=[
  {title:"Mechanical & Electrical Supplies and Services",icon:Wrench,image:"https://www.mpofcinci.com/wp-content/uploads/2025/09/shutterstock_2551326641-1024x768.webp",text:"Industrial motors, gearboxes, pumps, blowers, compressors, conveyors, bearings, valves, fittings, electrical panels, breakers, cables and on-site repair support."},
  {title:"Utilities & Facility Maintenance",icon:PackageCheck,image:"https://images.unsplash.com/photo-1581578731548-c64695cc6952",text:"Maintenance supplies and technical support for water, compressed air, steam and building utilities, including preventive maintenance and AMC support."},
  {title:"Boiler Chemicals – Supply and Services",icon:FlaskConical,image:"https://haoshpumps.com/wp-content/uploads/2024/01/Boiler-Chemical-for-Dosing-Pump.jpg",text:"Boiler water-treatment chemicals, dosing support, testing and practical recommendations for scale and corrosion control."},
  {title:"Seamless MS & SS Pipes and Fittings",icon:Wrench,image:"https://maximt.au/assets/images/instrumental/gauge_Root_Valves%20.png",text:"Seamless Mild Steel and Stainless Steel pipes, flanges, elbows, reducers, tees and fittings in project-specific sizes, grades and schedules."},
  {title:"Wastewater Treatment Plant (WWTP) Supplies and Services",icon:Factory,image:"https://static.wixstatic.com/media/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg/v1/fill/w_980%2Ch_735%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg",text:"WWTP pumps, blowers, diffusers, dosing systems and treatment chemicals, with operation, maintenance and performance support."},
  {title:"Waterproofing Solutions – Supplies and Services",icon:Building2,image:"https://www.constructionlondon.co.uk/gallery/6695/8f21032a-3505-476c-9dee-f9ffa11326ff.jpg",text:"Waterproofing materials and application for roofs, basements, water tanks and wet areas, including leakage inspection and rectification."},
  {title:"Pumps, Valves, and Pneumatic Fittings",icon:Zap,image:"https://www.rivistacmi.it/uploads/tx_etim/RS_COMPONENTS-pneumatics-image.jpg",text:"Industrial pumps, process valves, pneumatic fittings, hoses, regulators and accessories selected around the application, duty and site requirement."}
];return <><PageIntro eyebrow="ENGINEERING SUPPLIES & SERVICES / 01" title="Engineering Supplies & Services">Beyond our core engineering disciplines, NA Engineering Solutions supports industrial and facility teams with dependable equipment, maintenance materials, utility products and technical services — sourced around the actual requirement.</PageIntro><main className="section section-light"><div className="container"><SectionLabel>INDUSTRIAL SUPPORT / SUPPLY + SERVICE</SectionLabel><div className="section-heading"><h2>One place for the items and support that keep your operation moving.</h2><p>From a single replacement component to a recurring maintenance requirement, we help customers source the right material and arrange practical technical support around it.</p></div><div className="supply-grid">{groups.map((g,i)=><article className="supply-card" key={g.title}><div className="supply-card-image"><img src={img(g.image)} alt={`${g.title} NA Engineering Solutions`} /><span>{String(i+1).padStart(2,'0')}</span></div><g.icon size={24}/><h3>{g.title}</h3><p>{g.text}</p><div className="service-features"><span><CheckCircle2 size={15}/> Specification-led sourcing</span><span><CheckCircle2 size={15}/> Technical support</span></div></article>)}</div></div></main><section className="section industry-section"><div className="container"><div className="split"><div><SectionLabel>HOW WE HELP</SectionLabel><h2>Supply when you need it. Service when it matters.</h2></div><div><p className="lead">Share your BOQ, specification, part number, photo or site requirement. Our team can help identify the practical supply route and coordinate the service scope.</p><Button to="/contact" testid="engineering-supplies-contact">Discuss Your Requirement</Button></div></div></div></section></>}
'''
if "function EngineeringSuppliesServices()" not in source:
    source = source.replace(marker, page + marker, 1)

# Register the new route beside the existing Services route.
route_old = '<Route path="/services" element={<Services/>}/><Route path="/services/:slug" element={<ServiceRoute/>}/>'
route_new = '<Route path="/services" element={<Services/>}/><Route path="/engineering-supplies-services" element={<EngineeringSuppliesServices/>}/><Route path="/services/:slug" element={<ServiceRoute/>}/>'
source = source.replace(route_old, route_new, 1)

# Keep the footer company navigation consistent with the header.
footer_old = "[['Home','/'],['Services','/services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']]"
footer_new = "[['Home','/'],['Services','/services'],['Engineering Supplies & Services','/engineering-supplies-services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']]"
source = source.replace(footer_old, footer_new, 1)

path.write_text(source)
print("Engineering Supplies & Services hub page and navigation applied.")
