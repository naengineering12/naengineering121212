from pathlib import Path
import re

# Apply the detailed service data/layout patch first.
detail_patch = Path("service_detail_pages_patch.py")
if detail_patch.exists():
    exec(compile(detail_patch.read_text(), str(detail_patch), "exec"), {"__name__": "service_detail_pages_patch"})

app = Path("src/App.js")
source = app.read_text()

# The base App imports react-router-dom without useParams. Add it safely.
if "useParams" not in source.split("\n", 8)[2]:
    source = source.replace(
        'import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";',
        'import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, useParams } from "react-router-dom";',
        1,
    )

# Dedicated fallback data for every newly added service. These are intentionally
# independent from the base services array so a Learn More URL always resolves.
fallback = '''
const universalServiceData = {
  "utilities-facility-maintenance": {title:"Utilities & Facility Maintenance Supplies and Services", image:"https://images.unsplash.com/photo-1581092921461-eab62e97a780", intro:"Reliable maintenance support for plant utilities and facility systems, including water, compressed air, steam, equipment spares and planned maintenance.", items:["Water, compressed-air and steam utility maintenance","Gaskets, fasteners, seals, bearings and belts","Preventive and corrective facility maintenance","AMC support according to client requirements","Air compressor parts and service support","Boiler parts, spares and maintenance support"], applications:["Manufacturing Plants","Industrial Utilities","Commercial Facilities","Production Areas","Facility Management","Maintenance Workshops"]},
  "boiler-chemicals-supply-services": {title:"Boiler Chemicals – Supply and Services", image:"https://images.unsplash.com/photo-1532187863486-abf9dbad1b69", intro:"Boiler water-treatment chemicals and technical support focused on scale control, corrosion protection, water chemistry and reliable boiler operation.", items:["Scale inhibitors and deposit-control chemicals","Oxygen scavengers and corrosion-control treatment","pH adjusters and water-conditioning chemicals","Dosing systems and chemical-feed accessories","On-site testing, analysis and recommendations","Support for efficiency and treatment optimization"], applications:["Boiler Houses","Process Plants","Food & Beverage","Pharmaceutical Facilities","Textile Plants","Industrial Utilities"]},
  "seamless-ms-ss-pipes-fittings": {title:"Seamless MS & SS Pipes and Fittings", image:"https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122", intro:"Supply of seamless Mild Steel and Stainless Steel pipes and fittings in project-specific grades, schedules, sizes and configurations.", items:["Seamless Mild Steel pipes","Stainless Steel seamless pipes","Project-specific schedules, grades and sizes","Flanges, elbows, reducers and tees","Process and utility piping accessories","Specification-based sourcing and procurement"], applications:["Process Piping","Steam Lines","Water Utilities","Industrial Plants","Chemical Facilities","Construction Projects"]},
  "wastewater-treatment-plant-supplies-services": {title:"Wastewater Treatment Plant (WWTP) Supplies and Services", image:"https://images.unsplash.com/photo-1538300342682-cf57afb97285", intro:"WWTP equipment, treatment chemicals and operation and maintenance support for reliable plant performance and process improvement.", items:["Pumps, blowers and diffusers","Chemical dosing systems and accessories","Coagulants, flocculants and disinfectants","Operation and maintenance support","Troubleshooting and performance improvement","Technical guidance for treatment compliance"], applications:["Industrial WWTPs","Factories","Food & Beverage Plants","Pharmaceutical Facilities","Commercial Wastewater Systems","Utilities"]},
  "hvac-systems-supplies-services": {title:"HVAC Systems – Supplies and Services", image:"https://images.unsplash.com/photo-1631545806609-3f2c4a2e8a0f", intro:"HVAC equipment, ducting, parts, installation and maintenance support for industrial and commercial facilities.", items:["Chillers, AHUs and FCUs","Exhaust and fresh-air systems","GI ducting, insulation and accessories","HVAC spare parts and consumables","Preventive and corrective maintenance","Filter replacement, duct cleaning and optimization"], applications:["Industrial Facilities","Pharmaceutical Plants","Commercial Buildings","Packaging Halls","Warehouses","Production Areas"]},
  "waterproofing-solutions": {title:"Waterproofing Solutions – Supplies and Services", image:"https://images.unsplash.com/photo-1503387762-592deb58ef4e", intro:"Waterproofing materials and application support for roofs, basements, water tanks and wet areas, with leakage rectification and protective solutions.", items:["Waterproofing chemicals and membranes","Roof and terrace waterproofing","Basement waterproofing","Water tank waterproofing","Wet-area protection","Leakage rectification and protective coatings"], applications:["Industrial Buildings","Commercial Buildings","Roofs & Terraces","Basements","Water Tanks","Wet Areas"]},
  "pumps-valves-pneumatic-fittings": {title:"Pumps, Valves, and Pneumatic Fittings", image:"https://images.unsplash.com/photo-1581092160562-40aa08e78837", intro:"Industrial pumps, valves and pneumatic fittings selected according to application, pressure, size, connection standard and operating requirements.", items:["Centrifugal, submersible and dosing pumps","Gate, globe, butterfly, check and ball valves","Pneumatic fittings, hoses and tubing","Regulators and pneumatic accessories","Flanges, strainers and related fittings","Specification and application-based selection support"], applications:["Water & Utility Systems","Industrial Process Lines","HVAC Systems","Manufacturing Plants","Chemical & Process Industries","Maintenance & MRO"]}
};
'''
if "const universalServiceData =" not in source:
    marker = "const services = ["
    source = source.replace(marker, fallback + "\n" + marker, 1)

component = r'''
function UniversalServiceRoute(){
  const {slug}=useParams();
  const base=services.find(s=>s.slug===slug);
  const data=universalServiceData[slug];
  const service=base || (data ? {slug,title:data.title,image:data.image,text:data.intro} : null);
  if(!service) return <PageIntro eyebrow="SERVICES / NOT FOUND" title="Service not found">Please return to the Services catalogue and select a valid service.</PageIntro>;
  const points=data?.items || detailFeatures[service.title] || [];
  return <>
    <PageIntro eyebrow={`SERVICES / ${service.title.toUpperCase()}`} title={service.title}>{data?.intro || service.text}</PageIntro>
    <main className="section section-light">
      <div className="container detail-grid">
        <img className="detail-image" src={img(service.image)} alt={service.title}/>
        <div><SectionLabel>WHAT WE PROVIDE</SectionLabel><h2>{data?.intro || 'Professional supply, technical support and project execution.'}</h2><p>{service.text}</p><ul className="feature-list">{points.slice(0,6).map(x=><li key={x}><CheckCircle2 size={17}/>{x}</li>)}</ul></div>
      </div>
      <div className="container specialist-detail-block"><SectionLabel>DETAILED SERVICE SCOPE</SectionLabel><div className="specialist-grid">{points.map((x,i)=><article className="specialist-card" key={x}><span>{String(i+1).padStart(2,'0')}</span><h3>{x}</h3><p>{data?.intro || service.text}</p></article>)}</div>{data&&<div className="detail-bottom-grid"><div><SectionLabel>APPLICATIONS</SectionLabel><h2>Where we support your requirement.</h2><div className="application-list">{data.applications.map(x=><span key={x}><CheckCircle2 size={16}/>{x}</span>)}</div></div><div className="detail-callout"><span>NA ENGINEERING SOLUTIONS</span><h3>Requirement-based sourcing and dependable project support.</h3><p>Share your BOQ, drawing, specification or site requirement for a quotation.</p><Button to="/contact" secondary>Request a Quote</Button></div></div>}</div>
    </main>
  </>;
}
'''
if "function UniversalServiceRoute()" not in source:
    marker="\nfunction App() {"
    source=source.replace(marker,"\n"+component+marker,1)

# Remove stale dynamic service routes and insert exactly one universal route before wildcard.
source=re.sub(r'<Route\s+path=["\']/services/:slug["\'].*?/>','',source,flags=re.S)
universal='<Route path="/services/:slug" element={<UniversalServiceRoute/>}/>'
if universal not in source:
    wildcard='<Route path="*" element={<Home/>}/>'
    if wildcard not in source:
        raise SystemExit("Could not find wildcard route")
    source=source.replace(wildcard,universal+wildcard,1)

app.write_text(source)
print("All service Learn More routes configured.")
