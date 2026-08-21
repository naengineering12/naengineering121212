from pathlib import Path
import re

path = Path("src/App.js")
source = path.read_text()

# Navigation / IT Services hub.
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
source = source.replace('<Route path="/services" element={<Services/>}/><Route path="/services/:slug" element={<ServiceRoute/>}/>','<Route path="/services" element={<Services/>}/><Route path="/it-services" element={<ITServices/>}/><Route path="/services/:slug" element={<ServiceRoute/>}/>',1)

# Requested service catalogue: exact professional scopes with service-matched images.
service_updates = {
"Mechanical & Electrical Supplies and Services":("mechanical-electrical-supplies-services","https://images.unsplash.com/photo-1473341304170-971dccb5ac1e","Industrial motors, gearboxes, pumps, blowers, compressors, belt conveyors, bearings, gaskets, valves, pneumatic fittings, SS/MS pipes, flanges and related accessories. Electrical panels, breakers, contactors, relays, cables, lighting and wiring accessories. Repair, maintenance, replacement, on-site troubleshooting and technical support, plus hand pallet lifter parts, hand trolleys, platform trolleys, pallet jacks, ropes, chains and cargo straps."),
"Utilities & Facility Maintenance Supplies and Services":("utilities-facility-maintenance","https://images.unsplash.com/photo-1581092921461-eab62e97a780","Maintenance and repair support for water, compressed air, steam and other utility systems. Supply of gaskets, fasteners, seals, bearings and belts; preventive and corrective maintenance; AMC support; air compressor parts; and boiler parts as required."),
"Boiler Chemicals – Supply and Services":("boiler-chemicals-supply-services","https://haoshpumps.com/wp-content/uploads/2024/01/Boiler-Chemical-for-Dosing-Pump.jpg","Boiler water-treatment chemicals including scale inhibitors, oxygen scavengers and pH adjusters, dosing systems and monitoring solutions, on-site testing and analysis, and recommendations to improve boiler efficiency and protect equipment from corrosion and scaling."),
"Seamless MS & SS Pipes and Fittings":("seamless-ms-ss-pipes-fittings","https://www.maxim-tube.com/wp-content/uploads/2023/05/stainless-steel-pipe-fittings.jpg","Seamless Mild Steel and Stainless Steel pipes and fittings in different schedules, grades and sizes according to project requirements, including flanges, elbows, reducers, tees and related accessories."),
"Wastewater Treatment Plant (WWTP) Supplies and Services":("wastewater-treatment-plant-supplies-services","https://static.wixstatic.com/media/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg/v1/fill/w_980%2Ch_735%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg","WWTP equipment including pumps, blowers, diffusers and dosing systems; treatment chemicals such as coagulants, flocculants and disinfectants; operation and maintenance support; and technical guidance for performance improvement and compliance with standards."),
"HVAC Systems – Supplies and Services":("hvac-systems-supplies-services","https://mojoair.com.au/assets/images/web-image-industrial.jpg","Supply and installation of HVAC equipment including chillers, AHUs, FCUs, exhaust and fresh-air systems and ducting. HVAC parts supply and services, preventive and corrective maintenance, filter replacement, duct cleaning and performance optimization for industrial and commercial facilities."),
"Waterproofing Solutions – Supplies and Services":("waterproofing-solutions","https://www.constructionlondon.co.uk/gallery/6695/8f21032a-3505-476c-9dee-f9ffa11326ff.jpg","Supply and application of waterproof chemicals and membranes for roofs, basements, water tanks and wet areas, including leakage rectification and long-term protective solutions."),
"Pumps, Valves, and Pneumatic Fittings":("pumps-valves-pneumatic-fittings","https://www.rivistacmi.it/uploads/tx_etim/RS_COMPONENTS-pneumatics-image.jpg","Industrial centrifugal, submersible and dosing pumps; gate, globe, butterfly, check and ball valves; pneumatic fittings, hoses, regulators and accessories; and selection support according to process and application requirements.")
}

# Replace existing service objects by title. If a requested service is absent, insert it into the service array.
for title,(slug,image,text) in service_updates.items():
    pattern = r'\{[^{}]*title:"' + re.escape(title) + r'"[^{}]*\},'
    replacement = '{ slug:"%s", title:"%s", icon:Wrench, image:"%s", text:"%s" },' % (slug,title,image,text.replace('"','\\"'))
    if re.search(pattern, source):
        source = re.sub(pattern, replacement, source, count=1)
    else:
        # Locate the end of the services array by its nearby safety-security entry.
        safety_marker = '  { slug:"safety-security",'
        pos = source.find(safety_marker)
        if pos != -1:
            end = source.find('\n];', pos)
            if end != -1:
                source = source[:end] + '\n  ' + replacement + source[end:]

path.write_text(source)
print("Requested service catalogue applied with matched images.")
