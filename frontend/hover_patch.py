from pathlib import Path
import json

css = Path("src/App.css")
source = css.read_text()
marker = "/* NA SERVICES HOVER EFFECT */"
if marker not in source:
    source += r'''

/* NA SERVICES HOVER EFFECT */
.service-row{position:relative;transition:transform .45s cubic-bezier(.22,1,.36,1)}
.service-row:after{content:"";position:absolute;left:0;right:0;bottom:-24px;height:1px;background:linear-gradient(90deg,var(--amber),transparent);transform:scaleX(0);transform-origin:left;transition:transform .45s ease}
.service-row:hover{transform:translateY(-5px)}
.service-row:hover:after{transform:scaleX(1)}
.service-image{box-shadow:0 0 0 1px rgba(10,17,40,.04);transition:box-shadow .45s ease,transform .45s ease}
.service-image:after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,17,40,.05),rgba(10,17,40,.5));opacity:0;transition:opacity .45s ease;pointer-events:none}
.service-image img{transition:transform .7s cubic-bezier(.22,1,.36,1),filter .5s ease}
.service-row:hover .service-image{box-shadow:0 22px 45px rgba(10,17,40,.16);transform:scale(1.012)}
.service-row:hover .service-image:after{opacity:1}
.service-row:hover .service-image img{transform:scale(1.07);filter:saturate(1.08) contrast(1.03)}
.service-image span{z-index:2;transition:transform .4s ease,background .4s ease}
.service-row:hover .service-image span{transform:translate(5px,5px);background:#ffc184}
.service-copy h2{position:relative;display:inline-block;transition:transform .4s ease,color .4s ease}
.service-copy h2:after{content:"";position:absolute;left:0;bottom:-7px;width:42px;height:3px;background:var(--amber);transform:scaleX(.35);transform-origin:left;transition:transform .45s ease}
.service-row:hover .service-copy h2{transform:translateX(5px);color:var(--blue)}
.service-row:hover .service-copy h2:after{transform:scaleX(1)}
.service-features span{transition:transform .35s ease,color .35s ease}
.service-row:hover .service-features span{transform:translateX(3px);color:var(--blue)}
.service-copy .button{transition:transform .35s ease,background .35s ease,box-shadow .35s ease}
.service-row:hover .service-copy .button{transform:translateY(-3px);box-shadow:0 10px 24px rgba(10,17,40,.12)}
@media(max-width:800px){.service-row:hover{transform:none}.service-row:after{display:none}.service-row:hover .service-image{transform:none;box-shadow:none}.service-row:hover .service-copy h2{transform:none}.service-row:hover .service-image img{transform:scale(1.02)}}
'''
    css.write_text(source)

app = Path("src/App.js")
source = app.read_text()

art = {
    "civil-engineering": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07112f"/><stop offset="1" stop-color="#34556a"/></linearGradient></defs><rect width="1200" height="900" fill="url(#g)"/><path d="M120 690h960M190 690V350l160-120 160 120v340M690 690V300l170-110 160 110v390" fill="none" stroke="#ffb15c" stroke-width="18"/><path d="M350 250v-80M800 220v-80" stroke="#fff" stroke-width="12"/><text x="70" y="110" fill="#fff" font-family="Arial" font-size="52" font-weight="700">CIVIL ENGINEERING</text></svg>''',
    "hvac": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07112f"/><stop offset="1" stop-color="#0b7285"/></linearGradient></defs><rect width="1200" height="900" fill="url(#g)"/><g fill="none" stroke="#fff" stroke-width="22"><path d="M160 300h880v170H160zM260 470v210M940 470v210M330 300V190h540v110"/></g><path d="M470 555h260" stroke="#ffb15c" stroke-width="28"/><text x="70" y="110" fill="#fff" font-family="Arial" font-size="52" font-weight="700">HVAC SYSTEMS</text></svg>''',
    "mechanical-engineering": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07112f"/><stop offset="1" stop-color="#40556d"/></linearGradient></defs><rect width="1200" height="900" fill="url(#g)"/><circle cx="600" cy="470" r="210" fill="none" stroke="#ffb15c" stroke-width="35"/><circle cx="600" cy="470" r="80" fill="none" stroke="#fff" stroke-width="28"/><path d="M600 230v-90M600 700v90M360 470h-90M840 470h90" stroke="#fff" stroke-width="24"/><text x="70" y="110" fill="#fff" font-family="Arial" font-size="48" font-weight="700">MECHANICAL ENGINEERING</text></svg>''',
    "peb-works": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07112f"/><stop offset="1" stop-color="#52677a"/></linearGradient></defs><rect width="1200" height="900" fill="url(#g)"/><path d="M130 700h940M190 700V360l410-220 410 220v340M360 700V430h480v270" fill="none" stroke="#ffb15c" stroke-width="22"/><path d="M600 140v560" stroke="#fff" stroke-width="16"/><text x="70" y="105" fill="#fff" font-family="Arial" font-size="52" font-weight="700">PEB WORKS</text></svg>''',
    "electrical-works": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07112f"/><stop offset="1" stop-color="#0b7285"/></linearGradient></defs><rect width="1200" height="900" fill="url(#g)"/><g fill="none" stroke="#ffb15c" stroke-width="18"><path d="M150 690h900M220 690V310l160-110 160 110v380M730 690V270l170-90 170 90v420"/></g><g fill="#fff"><rect x="300" y="370" width="70" height="120" rx="8"/><rect x="450" y="370" width="70" height="120" rx="8"/><rect x="790" y="340" width="70" height="120" rx="8"/><rect x="940" y="340" width="70" height="120" rx="8"/></g><path d="M590 300l-80 190h75l-40 120 150-220h-80z" fill="#ffb15c"/><text x="70" y="110" fill="#fff" font-family="Arial" font-size="52" font-weight="700">ELECTRICAL WORKS</text></svg>''',
    "fire-fighting": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07112f"/><stop offset="1" stop-color="#7b2d2d"/></linearGradient></defs><rect width="1200" height="900" fill="url(#g)"/><path d="M510 650h180V300H510zM540 300v-70h120v70" fill="#ffb15c"/><path d="M690 360h90v120" fill="none" stroke="#fff" stroke-width="22"/><path d="M600 190c-70 70-85 125-35 175 20-55 55-70 70-115 45 55 55 105 10 155 90-25 105-110 35-215-20 50-45 70-80 0z" fill="#fff"/><text x="70" y="110" fill="#fff" font-family="Arial" font-size="52" font-weight="700">FIRE FIGHTING</text></svg>''',
    "safety-security": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07112f"/><stop offset="1" stop-color="#1c4258"/></linearGradient></defs><rect width="1200" height="900" fill="url(#g)"/><path d="M600 220c115 25 190 65 190 65v185c0 150-90 245-190 285-100-40-190-135-190-285V285s75-40 190-65z" fill="#ffb15c"/><path d="M510 445l60 60 125-145" fill="none" stroke="#07112f" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><path d="M360 690h480" stroke="#fff" stroke-width="20"/><circle cx="340" cy="690" r="35" fill="#ffb15c"/><circle cx="860" cy="690" r="35" fill="#ffb15c"/><text x="70" y="110" fill="#fff" font-family="Arial" font-size="52" font-weight="700">SAFETY &amp; SECURITY</text><text x="72" y="160" fill="#c9d6e6" font-family="Arial" font-size="25">PPE • FACILITY SAFETY • PROTECTION</text></svg>'''
}

art_js = "const SERVICE_ART = " + json.dumps(art, ensure_ascii=False) + ";\n"
map_js = '''const SERVICE_IMAGE_MAP = {\n  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c":"civil-engineering",\n  "https://images.unsplash.com/photo-1615309662243-70f6df917b59":"hvac",\n  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64":"mechanical-engineering",\n  "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a":"peb-works",\n  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e":"electrical-works",\n  "https://images.unsplash.com/photo-1523861751938-121b5323b48b":"fire-fighting",\n  "https://images.unsplash.com/photo-1567954970774-58d6aa6c50dc":"safety-security"\n};\n'''
helper = '''const serviceFallback = (slug) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SERVICE_ART[slug] || SERVICE_ART["electrical-works"])}`;\nconst img = (url) => { const slug = SERVICE_IMAGE_MAP[url] || (url.startsWith("/service-images/") ? url.split("/").pop().replace(".svg", "") : null); return slug && SERVICE_ART[slug] ? serviceFallback(slug) : `${url}?auto=format&fit=crop&w=1600&q=82`; };'''

start = source.find('const SERVICE_ART = ')
if start != -1:
    end = source.find('const services = [', start)
    if end != -1:
        source = source[:start] + source[end:]

source = source.replace('const img = (url) => `${url}?auto=format&fit=crop&w=1600&q=82`;', art_js + map_js + helper, 1)

for url, local_path in {
    "https://images.unsplash.com/photo-1565008447742-97f6f38c985c":"/service-images/civil-engineering.svg",
    "https://images.unsplash.com/photo-1615309662243-70f6df917b59":"/service-images/hvac.svg",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64":"/service-images/mechanical-engineering.svg",
    "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a":"/service-images/peb-works.svg",
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e":"/service-images/electrical-works.svg",
    "https://images.unsplash.com/photo-1523861751938-121b5323b48b":"/service-images/fire-fighting.svg",
    "https://images.unsplash.com/photo-1567954970774-58d6aa6c50dc":"/service-images/safety-security.svg",
}.items():
    source = source.replace(url, local_path)

SAFETY_IMAGE = "https://www.lsh.sg/cdn/shop/files/worker-on-construction-site.jpg?v=1701737515"
source = source.replace("/service-images/safety-security.svg", SAFETY_IMAGE)
source = source.replace('services.map((s,i)=><article className="service-row"', 'services.filter(s=>s.slug!=="safety-security").map((s,i)=><article className="service-row"', 1)

app.write_text(source)

# Add the specialist services requested for the Services catalogue.
new_services = [
    '{ slug:"mechanical-electrical-supplies-services", title:"Mechanical & Electrical Supplies and Services", icon:Wrench, image:"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e", text:"Supply of industrial motors, gearboxes, pumps, blowers, compressors, belt conveyors, bearings, gaskets, valves, pneumatic fittings, SS/MS pipes, flanges and related accessories. Electrical panels, breakers, contactors, relays, cables, lighting and wiring accessories. Repair, maintenance, replacement, on-site troubleshooting and technical support." }',
    '{ slug:"utilities-facility-maintenance", title:"Utilities & Facility Maintenance Supplies and Services", icon:Wrench, image:"https://images.unsplash.com/photo-1581092921461-eab62e97a780", text:"Maintenance and repair support for water, compressed air, steam and other utility systems. Supply of gaskets, fasteners, seals, bearings and belts; preventive and corrective maintenance; AMC support; air compressor parts; and boiler parts as required." }',
    '{ slug:"boiler-chemicals-supply-services", title:"Boiler Chemicals – Supply and Services", icon:FlaskConical, image:"https://haoshpumps.com/wp-content/uploads/2024/01/Boiler-Chemical-for-Dosing-Pump.jpg", text:"Supply of boiler water treatment chemicals including scale inhibitors, oxygen scavengers and pH adjusters, dosing systems and monitoring solutions, on-site testing and analysis, and recommendations to improve boiler efficiency and protect equipment from corrosion and scaling." }',
    '{ slug:"seamless-ms-ss-pipes-fittings", title:"Seamless MS & SS Pipes and Fittings", icon:Wrench, image:"https://image.made-in-china.com/2f0j00nrAcGvgMnbuz/ASTM-A312-304-201-316-309-310-321-409-439-2205-2507-904L-Stainless-Steel-Seamless-Pipe.jpg", text:"Supply of seamless Mild Steel and Stainless Steel pipes and fittings in different schedules, grades and sizes according to project requirements, including flanges, elbows, reducers, tees and related accessories." }',
    '{ slug:"wastewater-treatment-plant-supplies-services", title:"Wastewater Treatment Plant (WWTP) Supplies and Services", icon:Factory, image:"https://static.wixstatic.com/media/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg/v1/fill/w_980,h_735,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg", text:"Supply of WWTP equipment including pumps, blowers, diffusers and dosing systems; treatment chemicals such as coagulants, flocculants and disinfectants; operation and maintenance support; and technical guidance for performance improvement and compliance with standards." }',
    '{ slug:"hvac-systems-supplies-services", title:"HVAC Systems – Supplies and Services", icon:Snowflake, image:"https://mojoair.com.au/assets/images/web-image-industrial.jpg", text:"Supply and installation of HVAC equipment including chillers, AHUs, FCUs, exhaust and fresh-air systems and ducting. HVAC parts supply and services, preventive and corrective maintenance, filter replacement, duct cleaning and performance optimization for industrial and commercial facilities." }',
    '{ slug:"waterproofing-solutions", title:"Waterproofing Solutions – Supplies and Services", icon:Building2, image:"https://www.constructionlondon.co.uk/gallery/6695/8f21032a-3505-476c-9dee-f9ffa11326ff.jpg", text:"Supply and application of waterproof chemicals and membranes for roofs, basements, water tanks and wet areas, including leakage rectification and long-term protective solutions." }',
    '{ slug:"pumps-valves-pneumatic-fittings", title:"Pumps, Valves, and Pneumatic Fittings", icon:Wrench, image:"https://www.rivistacmi.it/uploads/tx_etim/RS_COMPONENTS-pneumatics-image.jpg", text:"Supply of industrial centrifugal, submersible and dosing pumps; gate, globe, butterfly, check and ball valves; pneumatic fittings, hoses, regulators and accessories; and selection support based on process and application requirements." }'
]
if 'mechanical-electrical-supplies-services' not in source:
    block = ',\n  ' + ',\n  '.join(new_services)
    source = source.replace('\n];\nconst industries', block + '\n];\nconst industries', 1)

# Add dedicated feature lists so every new Learn More page has useful service-specific detail.
new_features = '''\nconst specialistDetailFeatures={\n  "Mechanical & Electrical Supplies and Services":["Industrial motors, gearboxes, pumps, blowers and compressors","Belt conveyors, bearings, gaskets, valves, pneumatic fittings, SS/MS pipes and flanges","Electrical panels, breakers, contactors, relays, cables, lighting and wiring accessories","Repair, replacement, troubleshooting and on-site technical support"],\n  "Utilities & Facility Maintenance Supplies and Services":["Water, compressed-air, steam and utility-system maintenance support","Gaskets, fasteners, seals, bearings, belts and maintenance consumables","Preventive and corrective plant and building maintenance","AMC support, air compressor parts and boiler parts"],\n  "Boiler Chemicals – Supply and Services":["Scale inhibitors, oxygen scavengers and pH adjusters","Chemical dosing systems and monitoring solutions","On-site boiler-water testing and analysis","Corrosion and scaling protection and efficiency improvement support"],\n  "Seamless MS & SS Pipes and Fittings":["Seamless Mild Steel and Stainless Steel pipes","Multiple schedules, grades, wall thicknesses and sizes","Flanges, elbows, reducers and tees","Project-specific sourcing according to technical specifications"],\n  "Wastewater Treatment Plant (WWTP) Supplies and Services":["Pumps, blowers, diffusers and dosing systems","Coagulants, flocculants and disinfectants","Operation and maintenance support for existing WWTP systems","Performance improvement, troubleshooting and technical guidance"],\n  "HVAC Systems – Supplies and Services":["Chillers, AHUs, FCUs, exhaust and fresh-air systems","HVAC ducting, equipment and replacement parts","Preventive and corrective HVAC maintenance","Filter replacement, duct cleaning and system optimization"],\n  "Waterproofing Solutions – Supplies and Services":["Waterproof chemicals, coatings and membranes","Roof, basement, water-tank and wet-area waterproofing","Leakage inspection and rectification","Long-term moisture protection solutions"],\n  "Pumps, Valves, and Pneumatic Fittings":["Centrifugal, submersible and dosing pumps","Gate, globe, butterfly, check and ball valves","Pneumatic fittings, hoses, regulators and accessories","Application-based selection support according to process and project requirements"]\n};\n'''
if 'const specialistDetailFeatures=' not in source:
    source = source.replace('\nfunction Logo(){', new_features + '\nfunction Logo(){', 1)

source = source.replace('{(detailFeatures[service.title]||[]).map(x=><li key={x}><CheckCircle2 size={17}/>{x}</li>)}', '{(specialistDetailFeatures[service.title]||detailFeatures[service.title]||[]).map(x=><li key={x}><CheckCircle2 size={17}/>{x}</li>)}', 1)
app.write_text(source)
print("Service artwork rebuilt and all specialist service detail pages added.")
