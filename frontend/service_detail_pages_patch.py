from pathlib import Path
import re

APP = Path("src/App.js")
CSS = Path("src/App.css")
source = APP.read_text()

# Keep the detailed content data already present in App.js.
route_fallback = r'''
const specialistRouteFallbacks={
  "mechanical-electrical-supplies-services":{
    title:"Mechanical & Electrical Supplies and Services",image:"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e",text:"Supply of industrial motors, gearboxes, pumps, blowers, compressors, conveyors, bearings, valves, pneumatic fittings, pipes and electrical materials, with repair and maintenance support."
  },
  "utilities-facility-maintenance":{
    title:"Utilities & Facility Maintenance Supplies and Services",image:"https://images.unsplash.com/photo-1581092921461-eab62e97a780",text:"Maintenance and repair support for water, compressed air, steam and utility systems, including maintenance consumables, AMC support and spare parts."
  },
  "boiler-chemicals-supply-services":{
    title:"Boiler Chemicals – Supply and Services",image:"https://haoshpumps.com/wp-content/uploads/2024/01/Boiler-Chemical-for-Dosing-Pump.jpg",text:"Boiler water-treatment chemicals, dosing systems, monitoring, testing and technical support for scaling and corrosion control."
  },
  "seamless-ms-ss-pipes-fittings":{
    title:"Seamless MS & SS Pipes and Fittings",image:"https://image.made-in-china.com/2f0j00nrAcGvgMnbuz/ASTM-A312-304-201-316-309-310-321-409-439-2205-2507-904L-Stainless-Steel-Seamless-Pipe.jpg",text:"Seamless Mild Steel and Stainless Steel pipes and fittings in project-specific schedules, grades, sizes and configurations."
  },
  "wastewater-treatment-plant-supplies-services":{
    title:"Wastewater Treatment Plant (WWTP) Supplies and Services",image:"https://static.wixstatic.com/media/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg/v1/fill/w_980,h_735,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg",text:"WWTP equipment, treatment chemicals, operation and maintenance support, troubleshooting and technical coordination."
  },
  "hvac-systems-supplies-services":{
    title:"HVAC Systems – Supplies and Services",image:"https://mojoair.com.au/assets/images/web-image-industrial.jpg",text:"HVAC equipment, ducting, parts, installation, preventive and corrective maintenance, filter replacement and duct cleaning."
  },
  "waterproofing-solutions":{
    title:"Waterproofing Solutions – Supplies and Services",image:"https://www.constructionlondon.co.uk/gallery/6695/8f21032a-3505-476c-9dee-f9ffa11326ff.jpg",text:"Waterproofing materials and application support for roofs, basements, water tanks and wet areas, including leakage rectification."
  },
  "pumps-valves-pneumatic-fittings":{
    title:"Pumps, Valves, and Pneumatic Fittings",image:"https://www.rivistacmi.it/uploads/tx_etim/RS_COMPONENTS-pneumatics-image.jpg",text:"Industrial pumps, process valves, pneumatic fittings, hoses, regulators and accessories selected according to application, pressure, size and operating requirements."
  }
};
'''

if 'const specialistRouteFallbacks=' not in source:
    marker='function ServiceDetail({service}){'
    if marker not in source:
        raise SystemExit('ServiceDetail marker not found')
    source=source.replace(marker, route_fallback+'\n'+marker, 1)

# Make ServiceRoute resolve both the normal services array and every patched
# service slug. Match both the old one-line route and a previously expanded route.
new_route=r'''function ServiceRoute(){
  const {pathname}=useLocation();
  const slug=pathname.split('/').filter(Boolean).pop()||'';
  const service=services.find(s=>s.slug===slug)||(
    specialistRouteFallbacks[slug] ? {slug,...specialistRouteFallbacks[slug]} : services[0]
  );
  return <ServiceDetail service={service}/>;
}'''
old_route=r'function ServiceRoute(){const {pathname}=useLocation();const service=services.find(s=>pathname.endsWith(s.slug))||services[0];return <ServiceDetail service={service}/>}'
if old_route in source:
    source=source.replace(old_route,new_route,1)
else:
    source,n=re.subn(r'function ServiceRoute\(\)\{[\s\S]*?\n\}\s*\n\nexport default App;', new_route+'\n\nexport default App;', source, count=1)
    if n!=1:
        raise SystemExit(f'ServiceRoute replacement failed: {n}')

APP.write_text(source)

css=CSS.read_text()
CSS_ADD='''
/* Detailed service pages */
.detail-actions{display:flex;gap:12px;margin-top:28px}
.specialist-detail-block{margin-top:105px}
.specialist-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);margin-top:28px}
.specialist-card{background:#fff;min-height:190px;padding:28px 25px;border:1px solid transparent;transition:transform .2s ease,box-shadow .2s ease}
.specialist-card:hover{transform:translateY(-3px);box-shadow:0 14px 32px rgba(10,17,40,.08);position:relative;z-index:1}
.specialist-card>span{color:var(--blue);font:700 11px Chivo;letter-spacing:.08em}
.specialist-card h3{font-size:20px;line-height:1.15;margin:28px 0 10px}
.specialist-card p{color:#627083;line-height:1.7;font-size:13px;margin:0}
.detail-bottom-grid{display:grid;grid-template-columns:1fr 1fr;gap:70px;margin-top:80px;align-items:start}
.detail-bottom-grid h2{font-size:clamp(30px,3.5vw,45px);line-height:1.08;letter-spacing:-.05em;margin:16px 0 25px}
.application-list{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.application-list span{display:flex;align-items:center;gap:9px;color:#4c5b6b;font-size:13px;padding:12px 0;border-bottom:1px solid var(--line)}
.application-list svg{color:var(--blue);flex:none}
.detail-callout{background:var(--navy);color:#fff;padding:35px}
.detail-callout>span{color:var(--amber);font-size:10px;font-weight:800;letter-spacing:.16em}
.detail-callout h3{font-size:29px;line-height:1.15;margin:18px 0 12px}
.detail-callout p{color:#bdc9d8;line-height:1.7;font-size:14px;margin-bottom:25px}
@media(max-width:900px){.specialist-grid{grid-template-columns:1fr 1fr}.detail-bottom-grid{grid-template-columns:1fr;gap:45px}}
@media(max-width:600px){.specialist-grid{grid-template-columns:1fr}.application-list{grid-template-columns:1fr}.specialist-detail-block{margin-top:70px}.detail-callout{padding:28px 22px}}
'''
if '/* Detailed service pages */' not in css:
    CSS.write_text(css+CSS_ADD)

print('Fixed universal service routing: every patched service slug now resolves to its own detail page.')