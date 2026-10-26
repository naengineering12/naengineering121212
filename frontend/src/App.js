import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import "./index.css";
import "./clients-responsive.css";
import "./clients-fix.css";
import "./clients-enhancements";
import "./ChatFix.css";
import ContactPage from "./ContactPage";
import InsightsPage, { InsightsPreview, insightArticles } from "./InsightsPage";
import { BrowserRouter, Routes, Route, Link, NavLink, Navigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowRight, ArrowUpRight, Building2, CheckCircle2, ChefHat, ChevronDown, ChevronRight, CircleDot, Clock, Factory, FlaskConical, Flame, Droplets, Gauge, Waves, HardHat, Headphones, Instagram, Laptop, Boxes, PenTool, Cpu, Server, Wifi, Printer, Camera, Mail, MapPin, Menu, MessageCircle, PackageCheck, Phone, Plane, Quote, Send, ShieldCheck, Shirt, Snowflake, Sparkles, Truck, Users, Wrench, X, Zap } from "lucide-react";
import { toast, Toaster } from "sonner";
import "./site-quality.css";
import "./header-redesign.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
// Resize remote photos at the source CDN rather than downloading full-resolution originals.
const imageUrl = (url,w=640,q=60) => {
  if (typeof url !== "string" || !url) return url;
  const base = url.split("?")[0];
  const width = Math.max(320, Math.min(1200, Math.round(w)));
  if (base.includes("images.unsplash.com")) return `${base}?auto=format&fit=crop&w=${width}&q=${q}`;
  if (base.includes("images.pexels.com")) return `${base}?auto=compress&cs=tinysrgb&w=${width}`;
  return base;
};
const img = (url,w=640) => imageUrl(url,w,60);
// Avoid requesting several competing image variants; each card gets one appropriately sized image.
const imgSet = () => undefined;

function SmartImage({src,srcSet,sizes,alt,loading="lazy",fetchPriority="low",className="",...rest}){
  const [useFallback,setUseFallback] = useState(false);
  useEffect(()=>{setUseFallback(false)},[src]);
  const source = src;
  const fallbackSource = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=640&q=55";
  return <img
    src={useFallback ? fallbackSource : source}
    loading={loading}
    fetchPriority={fetchPriority}
    decoding="async"
    alt={alt}
    className={className}
    {...rest}
    onError={()=>{if(!useFallback) setUseFallback(true)}}
  />;
}
const services = [
  { slug:"civil-engineering", title:"Civil Engineering", icon:Building2, image:"https://images.unsplash.com/photo-1565008447742-97f6f38c985c", text:"Civil construction, building works, concrete, flooring, waterproofing, site development, rehabilitation and project execution." },
  { slug:"engineering-consultancy", title:"Engineering Consultancy", icon:PenTool, image:"https://images.unsplash.com/photo-1503387762-592deb58ef4e", text:"Practical engineering consultancy for scope definition, technical reviews, project planning, material specifications, contractor coordination and execution support for industrial and commercial requirements." },
  { slug:"mechanical-engineering", title:"Mechanical Engineering", icon:Wrench, image:"https://images.unsplash.com/photo-1606337321936-02d1b1a4d5ef", text:"Equipment, pumps, motors, conveyors, fabrication, welding, industrial repair and spare parts." },
  { slug:"peb-works", title:"PEB Works", icon:Factory, image:"https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a", text:"Pre-engineered buildings, structural steel, sheds, platforms, walkways, canopies and modifications." },
  { slug:"electrical-works", title:"Electrical Works", icon:Zap, image:"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e", text:"Industrial installation, lighting, cables, accessories, maintenance, troubleshooting and material supply." },
  { slug:"mechanical-electrical-supplies", title:"Mechanical & Electrical Supplies and Services", icon:Wrench, image:"https://images.unsplash.com/photo-1513828583688-c52646db42da", text:"Industrial motors, gearboxes, pumps, blowers, compressors, conveyors, bearings, valves, pneumatic fittings, SS/MS pipes and flanges, plus electrical panels, breakers, contactors, relays, cables and wiring accessories — with repair, maintenance and on-site technical support." },
  { slug:"utilities-facility-maintenance", title:"Utilities & Facility Maintenance Supplies and Services", icon:Gauge, image:"https://images.unsplash.com/photo-1581578731548-c64695cc6952", text:"Maintenance and repair support for water, compressed air and steam utility systems, supply of maintenance consumables, preventive and corrective maintenance, AMC support and air compressor / boiler parts supply and service." },
  { slug:"boiler-chemicals", title:"Boiler Chemicals - Supply and Services", icon:FlaskConical, image:"https://images.unsplash.com/photo-1611581372056-30cf28a7bd2e", text:"Boiler water treatment chemicals — scale inhibitors, oxygen scavengers and pH adjusters — dosing systems, on-site testing and analysis, and recommendations to improve boiler efficiency and prevent corrosion and scaling." },
  { slug:"seamless-pipes-fittings", title:"Seamless MS & SS Pipes and Fittings", icon:Factory, image:"https://images.pexels.com/photos/33996167/pexels-photo-33996167.jpeg", text:"Seamless Mild Steel and Stainless Steel pipes and fittings in different schedules, grades and sizes as per project requirements, including flanges, elbows, reducers, tees and related accessories." },
  { slug:"wastewater-treatment-plant", title:"Wastewater Treatment Plant (WWTP) Supplies and Services", icon:Waves, image:"https://images.unsplash.com/photo-1533163238111-4a7ced54f2e4", text:"WWTP equipment such as pumps, blowers, diffusers and dosing systems, treatment chemicals, operation and maintenance support and technical guidance for performance improvement and compliance with standards." },
  { slug:"hvac-supplies-services", title:"HVAC Systems - Supplies and Services", icon:Snowflake, image:"https://images.unsplash.com/photo-1615309662243-70f6df917b59", text:"Supply and installation of HVAC equipment — chillers, AHUs, FCUs, exhaust and fresh-air systems and ducting — with parts supply, preventive and corrective maintenance, filter replacement, duct cleaning and performance optimization." },
  { slug:"fire-fighting-equipment", title:"Fire Fighting Equipment - Supplies and Services", icon:Flame, image:"https://images.pexels.com/photos/18329661/pexels-photo-18329661.jpeg", text:"Fire extinguishers, fire hoses, hydrants, sprinklers and related accessories, with basic installation and refilling services and support in upgrading existing fire protection equipment." },
  { slug:"safety-security-systems", title:"Safety & Security Systems", icon:ShieldCheck, image:"https://images.unsplash.com/photo-1557597774-9d273605dfa9", text:"Safety and security system support covering CCTV, access control, biometric attendance, alarms, emergency lighting, safety signage and related equipment supply." },
  { slug:"waterproofing-solutions", title:"Waterproofing Solutions - Supplies and Services", icon:Droplets, image:"https://images.unsplash.com/photo-1602064828974-fcac67d33f4e", text:"Supply and application of waterproof chemicals and membranes for roofs, basements, water tanks and wet areas, including leakage rectification and long-term protective solutions." },
  { slug:"pumps-valves-pneumatic", title:"Pumps, Valves, and Pneumatic Fittings", icon:Wrench, image:"https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0", text:"Industrial pumps (centrifugal, submersible, dosing), valves (gate, globe, butterfly, check, ball) and pneumatic fittings, hoses, regulators and accessories, with selection support based on process and application requirements." },
];
const industries = ["Manufacturing","Pharmaceutical","Food & Beverage","Industrial Plants","Power & Utilities","Construction","Commercial Buildings","Warehouses","Offices","Facility Management"];
const supplyGroups = [
  {title:"General Hardware & Tools", icon:HardHat, image:"https://images.unsplash.com/photo-1530124566582-a618bc2615dc", desc:"Hand tools, power tools and material-handling essentials for daily site and workshop use.", items:["Hand tools - spanners, pliers, screwdrivers, hammers, cutters","Measuring tapes, vernier calipers and levels","Tool kits and toolboxes","Drill machines, grinder wheels and drill bits","Ladders, trolleys and small material-handling items"]},
  {title:"Electrical General Items", icon:Zap, image:"https://images.unsplash.com/photo-1544724569-5f546fd6f2b5", desc:"Everyday domestic and industrial electrical accessories, wiring and lighting.", items:["Switches, sockets and plug tops","Extension boards and multi-plugs","Cables and wires (domestic / industrial)","Lamps, LED bulbs, tube lights and holders","Cable ties, lugs, glands and terminals"]},
  {title:"Safety & PPE Items", icon:ShieldCheck, image:"https://images.unsplash.com/photo-1567954970774-58d6aa6c50dc", desc:"Personal protective equipment and site safety gear to keep your teams protected.", items:["Safety helmets, gloves, goggles and masks","Safety shoes and high-visibility jackets","Ear plugs / earmuffs and face shields","Safety cones, caution tapes and sign boards"]},
  {title:"Cleaning & Janitorial Supplies", icon:Sparkles, image:"https://images.unsplash.com/photo-1563453392212-326f5e854473", desc:"Cleaning, janitorial and hygiene consumables for facilities of every size.", items:["Mops, brooms, brushes and dustpans","Floor cleaners, detergents and disinfectants","Waste bins and garbage bags","Tissue rolls, hand towels and liquid soap","Air fresheners and glass cleaners"]},
  {title:"Industrial & Maintenance Consumables", icon:Wrench, image:"https://images.unsplash.com/photo-1587293852726-70cdb56c2866", desc:"Fasteners, seals, belts, lubricants and consumables for maintenance and shutdowns.", items:["Nuts, bolts, washers, screws and anchors","Bearings, seals, O-rings and gaskets","V-belts, hose pipes and clamps","Industrial tapes - Teflon, insulation and duct tape","Grease, lubricants, sprays and adhesives"]},
  {title:"Packaging Materials", icon:Boxes, image:"https://images.unsplash.com/photo-1553413077-190dd305871c", desc:"Boxes, wraps and strapping for safe packing, storage and dispatch.", items:["Cartons and corrugated boxes","Stretch film and shrink wrap","Strapping rolls and strapping clips","Bubble wrap, packing tape and labels"]},
  {title:"Canteen & Pantry Items", icon:ChefHat, image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085", desc:"Pantry and canteen consumables to keep your workplace running (as needed).", items:["Disposable cups, plates and spoons","Drinking water bottles / dispensers","Tea, coffee, sugar and powdered milk","Napkins and tissue rolls"]},
  {title:"IT & Miscellaneous Items", icon:Laptop, image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3", desc:"Everyday IT peripherals, accessories and small electronics.", items:["Keyboards, mouse and USB drives","Power strips and surge protectors","Network cables and adapters","Small electronic accessories as required"]},
  {title:"Office & Stationery Items", icon:PenTool, image:"https://images.unsplash.com/photo-1497032628192-86f99bcd76bc", desc:"Complete office stationery, filing and printer consumables.", items:["A4 / Legal paper reams","Ball pens, markers and highlighters","Notebooks, registers, files and folders","Staplers, punch machines, pins and clips","Whiteboards, notice boards, dusters and board markers","Toner cartridges, printer ribbons and inkjet / laser supplies"]}
];
const commitments = ["Quality and quantity are never compromised - materials are supplied as per agreed specifications","We strive to offer competitive and market-justified prices","Timely delivery and professional communication for your maintenance, projects and shutdowns","Long-term relationships built on trust, reliability and consistent performance"];
const serviceFaqs={
"Engineering Consultancy":[["What engineering consultancy support is available in Lahore?","NA Engineering Solutions can discuss project scope, technical requirements, material specifications, planning and execution coordination for industrial and commercial work in Lahore."],["Can you help define a project scope before quotation?","Yes. Sharing drawings, dimensions, photos, existing equipment details and site constraints helps the team understand the requirement before preparing a suitable scope and quotation."],["Do you provide consultancy together with supply or site execution?","Where the project requires it, consultancy discussions can be coordinated with engineering services, supply and site execution. The agreed deliverables are defined for each requirement."]],
"Civil Engineering":[["What civil engineering services do you provide in Lahore?","NA Engineering Solutions provides civil construction, building works, concrete, flooring, waterproofing, site development, repair, maintenance and project execution support in Lahore."],["Do you handle flooring and waterproofing work?","Yes. Civil engineering support includes flooring, waterproofing and leakage-related work as part of site rehabilitation and project execution."],["Who can use your civil engineering services?","The service is intended for industrial plants, commercial facilities, construction projects and other sites that require practical civil engineering support."]],
"Mechanical Engineering":[["What mechanical engineering services do you provide in Lahore?","NA Engineering Solutions supports pumps, motors, gearboxes, chains, sprockets, conveyors, fabrication, welding, industrial repair and mechanical spare parts requirements in Lahore."],["Do you supply mechanical equipment and spare parts?","Yes. Mechanical support includes equipment and spare-part sourcing alongside repair, fabrication and maintenance work."],["Do you provide on-site mechanical support?","Yes. Scope can include inspection, repair, fabrication, maintenance and technical support at the customer site."]],
"PEB Works":[["What PEB services do you provide in Lahore?","NA Engineering Solutions provides pre-engineered buildings, PEB sheds, structural steel, platforms, walkways, canopies, installation, modification and repair support in Lahore."],["Can you support PEB modifications and industrial structures?","Yes. The service covers structural steel and industrial structures as well as modifications, installation and repair."],["Do you provide complete PEB project support?","Yes. The scope can cover planning, sourcing, fabrication and site execution according to the agreed project requirements."]],
"Electrical Works":[["What electrical services do you provide in Lahore?","NA Engineering Solutions provides industrial electrical installation, lighting, cables, lugs, switches, accessories, maintenance, troubleshooting and electrical material supply in Lahore."],["Do you provide industrial electrical maintenance?","Yes. Electrical support includes maintenance and troubleshooting for industrial and commercial requirements."],["Can you supply electrical materials as well as provide installation?","Yes. The service combines electrical works with material and accessory supply based on project requirements."]],
"Mechanical & Electrical Supplies and Services":[["What mechanical and electrical items do you supply in Lahore?","Supply includes industrial motors, gearboxes, pumps, blowers, compressors, conveyors, bearings, valves, pneumatic fittings, SS/MS pipes and flanges, plus electrical panels, breakers, contactors, relays, cables and wiring accessories."],["Do you also provide repair and maintenance support?","Yes. The service includes repair, replacement, on-site troubleshooting, maintenance and technical support in addition to material supply."],["Can you source project-specific industrial items?","Yes. Items can be sourced according to required specifications, equipment type and application."]],
"Utilities & Facility Maintenance Supplies and Services":[["What facility and utility maintenance services do you provide in Lahore?","NA Engineering Solutions supports water, compressed air and steam utility systems, preventive and corrective maintenance, maintenance consumables, AMC support and air-compressor and boiler parts supply and service."],["Do you offer AMC and preventive maintenance support?","Yes. Annual Maintenance Contract support and preventive/corrective maintenance can be provided according to client requirements."],["Do you supply compressor and boiler parts?","Yes. Air compressor and boiler parts supply and related services are included in the scope."]],
"Boiler Chemicals - Supply and Services":[["What boiler chemicals do you supply in Lahore?","Supply includes boiler water treatment chemicals such as scale inhibitors, oxygen scavengers and pH adjusters, along with dosing systems and monitoring support."],["Do you provide boiler water testing and analysis?","Yes. Support includes on-site testing, analysis and recommendations intended to improve boiler efficiency and help prevent corrosion and scaling."],["Are boiler chemical recommendations based on the system?","Yes. Recommendations are made around the boiler system, water conditions and operational requirements."]],
"Seamless MS & SS Pipes and Fittings":[["What seamless pipes and fittings do you supply in Lahore?","NA Engineering Solutions supplies seamless Mild Steel and Stainless Steel pipes and fittings in different schedules, grades and sizes, including flanges, elbows, reducers and tees."],["Can you supply project-specific pipe sizes and grades?","Yes. Sourcing can be arranged according to project specifications, required grade, schedule, size and fitting requirements."],["Do you supply fittings along with seamless pipes?","Yes. Related fittings and accessories such as flanges, elbows, reducers and tees are included in the supply scope."]],
"Wastewater Treatment Plant (WWTP) Supplies and Services":[["What WWTP supplies and services do you provide in Lahore?","NA Engineering Solutions supports wastewater treatment plants with pumps, blowers, diffusers, dosing systems, treatment chemicals, operation and maintenance support and technical guidance."],["Do you supply WWTP equipment and chemicals?","Yes. Equipment and treatment chemicals can be supplied according to the existing plant and project requirements."],["Do you provide WWTP operation and maintenance support?","Yes. Operation and maintenance support is available for existing WWTP systems, together with performance-improvement guidance."]],
"HVAC Systems - Supplies and Services":[["What HVAC services do you provide in Lahore?","NA Engineering Solutions provides HVAC equipment supply and installation, chillers, AHUs, FCUs, exhaust and fresh-air systems, ducting, parts supply, preventive and corrective maintenance, filter replacement and duct cleaning."],["Do you provide industrial HVAC ducting and maintenance?","Yes. HVAC support includes ducting, maintenance, filter replacement, duct cleaning and performance optimization for industrial and commercial facilities."],["Can you supply HVAC equipment and spare parts?","Yes. Equipment, parts and related services can be sourced and provided according to the required system and application."]],
"Fire Fighting Equipment - Supplies and Services":[["What fire fighting equipment do you supply in Lahore?","NA Engineering Solutions supplies fire extinguishers, fire hoses, hydrants, sprinklers and related accessories, with basic installation and refilling support where applicable."],["Do you provide fire extinguisher refilling and servicing support?","Yes. The service includes basic refilling and support in servicing and upgrading existing fire protection equipment, where applicable."],["Can you support upgrades to existing fire protection systems?","Yes. The scope includes support for upgrading existing fire protection equipment and matching solutions to facility requirements."]],
"Safety & Security Systems":[["What safety and security systems do you support in Lahore?","NA Engineering Solutions can discuss CCTV, access control, biometric attendance, alarm systems, emergency lighting, safety signage and related equipment requirements."],["Can you help source items for an existing security system?","Yes. Share the current make and model, photos or part numbers so the requirement can be reviewed against the existing system and compatibility needs."],["Do you support installation and maintenance?","Installation coordination and maintenance support can be discussed based on the system, site conditions and the agreed project scope."]],
"Waterproofing Solutions - Supplies and Services":[["What waterproofing services do you provide in Lahore?","NA Engineering Solutions supplies and applies waterproof chemicals and membranes for roofs, basements, water tanks and wet areas, including leakage rectification."],["Do you provide roof and water tank waterproofing?","Yes. Waterproofing support covers roofs, basements, water tanks and wet areas according to site conditions."],["Do you also handle leakage rectification?","Yes. Leakage rectification is included in the waterproofing service scope."]],
"Pumps, Valves, and Pneumatic Fittings":[["What pumps and valves do you supply in Lahore?","NA Engineering Solutions supplies centrifugal, submersible and dosing pumps, plus gate, globe, butterfly, check and ball valves."],["Do you supply pneumatic fittings and accessories?","Yes. The range includes pneumatic fittings, hoses, regulators and related accessories."],["Can you help select the right pump, valve or pneumatic item?","Yes. Selection support is provided based on the process, application and project requirements."]
]};

const detailFeatures={"Engineering Consultancy":["Requirement and scope review","Technical specifications and material selection support","Project planning and execution coordination","Site assessment and contractor / supplier coordination"],"Civil Engineering":["Civil construction and building works","Concrete, flooring and waterproofing","Site development, repair and maintenance","Structural support and project execution"],HVAC:["HVAC installation and maintenance","GI ducting, fabrication and insulation","Duct dismantling and rerouting","Exhaust fans, ventilation, filters and equipment supply"],"Mechanical Engineering":["Mechanical equipment, pumps and motors","Gearboxes, chains, sprockets and conveyors","Welding, fabrication and industrial repair","Maintenance and industrial spare parts"],"PEB Works":["Pre-engineered buildings and PEB sheds","Structural steel and industrial structures","Walkways, platforms and canopies","Installation, modification and repair"],"Electrical Works":["Electrical and industrial installation","Lighting, LED lights, cables and lugs","Switches, accessories and electrical hardware","Maintenance, troubleshooting and material supply"],"Fire Fighting":["Fire fighting equipment and extinguishers","DCP and CO2 extinguisher refilling","Inspection, servicing and maintenance","Industrial and commercial fire safety"],"Mechanical & Electrical Supplies and Services":["Industrial motors, gearboxes, pumps, blowers and compressors","Belt conveyors, bearings, gaskets, valves, pneumatic fittings, SS/MS pipes and flanges","Electrical panels, breakers, contactors, relays, cables, lighting and wiring accessories","Repair, maintenance, replacement, on-site troubleshooting and technical support","Hand pallet lifters, hand and platform trolleys, pallet jacks","Ropes, chains and cargo straps"],"Utilities & Facility Maintenance Supplies and Services":["Maintenance and repair support for water, compressed air and steam utility systems","Maintenance consumables - gaskets, fasteners, seals, bearings and belts","Preventive and corrective maintenance for plant and building facilities","AMC (Annual Maintenance Contract) support as per client requirement","Air compressor parts supply and services","Boiler parts supply and services"],"Boiler Chemicals - Supply and Services":["Boiler water treatment chemicals - scale inhibitors, oxygen scavengers, pH adjusters","Dosing systems and monitoring solutions","On-site testing, analysis and system-optimization recommendations","Support to improve boiler efficiency and protect against corrosion and scaling"],"Seamless MS & SS Pipes and Fittings":["Seamless Mild Steel (MS) and Stainless Steel (SS) pipes and fittings","Different schedules, grades and sizes as per project requirements","Flanges, elbows, reducers, tees and related accessories","Project-specific sourcing to technical specifications"],"Wastewater Treatment Plant (WWTP) Supplies and Services":["WWTP equipment - pumps, blowers, diffusers and dosing systems","Treatment chemicals - coagulants, flocculants and disinfectants","Operation and maintenance support for existing WWTP systems","Technical guidance for performance improvement and standards compliance"],"HVAC Systems - Supplies and Services":["HVAC equipment - chillers, AHUs, FCUs, exhaust and fresh-air systems and ducting","HVAC parts supply and services","Preventive and corrective HVAC maintenance","Filter replacement, duct cleaning and performance optimization for industrial and commercial facilities"],"Fire Fighting Equipment - Supplies and Services":["Fire extinguishers, fire hoses, hydrants, sprinklers and accessories","Basic installation and refilling services where applicable","Support in upgrading existing fire protection equipment","Solutions matched to facility and safety requirements"],"Safety & Security Systems":["CCTV and surveillance equipment","Access control and biometric attendance systems","Alarm systems, emergency lighting and safety signage","Equipment sourcing and maintenance coordination"],"Waterproofing Solutions - Supplies and Services":["Waterproof chemicals and membranes - supply and application","Roof, basement, water tank and wet-area waterproofing","Leakage rectification","Long-term protective and moisture-control solutions"],"Pumps, Valves, and Pneumatic Fittings":["Industrial pumps - centrifugal, submersible and dosing","Valves - gate, globe, butterfly, check and ball valves","Pneumatic fittings, hoses, regulators and accessories","Selection support based on process and application requirements"]};

function Logo(){ return <Link to="/" className="logo" data-testid="brand-logo" aria-label="NA Engineering Solutions — Home"><img className="logo-img" src="/logo-gradient-transparent-v2.webp" alt="NA Engineering Solutions" width="50" height="50"/><span className="logo-text"><b>NA ENGINEERING</b><small>SOLUTIONS</small></span></Link> }
function Header(){
  const [open,setOpen]=useState(false);
  const nav=[["Home","/"],["Services","/services"],["General Order Supplies","/supplies"],["IT Services","/it-services"],["Industries","/industries"],["Blog","/blog"],["Our Clients","/clients"]];
  return <header className="site-header" style={{position:"fixed",top:0,left:0,right:0,width:"100%",zIndex:99999,height:"78px"}}>
    <div className="site-container nav-wrap">
      <div className="header-brand-pill"><Logo/></div>
      <button className="menu-toggle" data-testid="mobile-menu-button" onClick={()=>setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>{open?<X/>:<Menu/>}</button>
      <div className={open?"nav-cluster open":"nav-cluster"}>
        <nav className={open?"nav-links open":"nav-links"} aria-label="Main navigation">
          {nav.map(([label,to])=><NavLink key={to} to={to} end={to==="/"} onClick={()=>setOpen(false)} className={({isActive})=>isActive?"nav-page-link nav-current":"nav-page-link"} data-testid={`nav-${label.toLowerCase().replaceAll(" ","-")}`}>{label}</NavLink>)}
          <NavLink to="/contact" onClick={()=>setOpen(false)} className="nav-page-link nav-contact-cta" data-testid="nav-contact-cta">Contact Us <ArrowRight size={17}/></NavLink>
        </nav>
      </div>
    </div>
  </header>
}
function Footer(){ return <footer className="footer"><div className="site-container footer-grid"><div><Logo/><p className="footer-intro">Engineering • Construction • Industrial Solutions • General Order Supplies & Services</p><div className="socials"><a href="https://www.tiktok.com/@na_engineering.co" target="_blank" rel="noreferrer" data-testid="social-tiktok" aria-label="TikTok"><svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a><a href="https://www.instagram.com/na_engineering.co/" target="_blank" rel="noreferrer" data-testid="social-instagram" aria-label="Instagram"><Instagram size={17}/></a><a href="https://x.com/NA_engsolutions" target="_blank" rel="noreferrer" data-testid="social-x" aria-label="X"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6 9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg></a></div></div><div><h3 className="footer-heading">Company</h3>{[['Home','/'],['Services','/services'],['General Order Supplies','/supplies'],['IT Services','/it-services'],['Industries','/industries'],['Blog','/blog'],['Our Clients','/clients']].map(([x,y])=><Link key={y} to={y} data-testid={`footer-${x.toLowerCase().replaceAll(' ','-')}`}>{x}</Link>)}</div><div><h3 className="footer-heading">Services</h3>{services.slice(0,5).map(s=><Link key={s.slug} to={`/services/${s.slug}`} data-testid={`footer-service-${s.slug}`}>{s.title}</Link>)}</div></div><div className="site-container footer-contact-strip"><a className="footer-contact-pill" href="https://www.google.com/maps/place/31%C2%B025%2738.7%22N+74%C2%B013%2717.5%22E/@31.4274139,74.2189598,17z/data=!3m1!4b1!4m4!3m3!8m2!3d31.4274139!4d74.2215347?hl=en&entry=ttu&g_ep=EgoyMDI2MDgyNS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer"><MapPin size={17}/><span>593 Block-A LDA Avenue, 1 Raiwind Rd, Lahore, 54000</span></a><a className="footer-contact-pill" href="https://mail.google.com/mail/?view=cm&to=na.engineeringsolutions2023@gmail.com" target="_blank" rel="noreferrer"><Mail size={17}/><span>na.engineeringsolutions2023@gmail.com</span></a><a className="footer-contact-pill" href="tel:+923008596393"><Phone size={16}/><span>+92 300 8596393&nbsp;&nbsp;|&nbsp;&nbsp;+92 302 6880398</span></a></div><div className="site-container footer-bottom"><span>© {new Date().getFullYear()} NA Engineering Solutions</span><span>Built for dependable project delivery.</span></div></footer> }function Button({to='/',children='Request a Quote',secondary=false,testid}){ return <Link to={to} className={secondary?'button button-secondary':'button'} data-testid={testid||`button-${children.toLowerCase().replaceAll(' ','-')}`}>{children}<ArrowRight size={16}/></Link> }
function PageIntro({eyebrow,title,children}){return <section className="page-intro"><div className="site-container"><span className="eyebrow">{eyebrow}</span><h1 data-testid="page-heading">{title}</h1><p>{children}</p></div></section>}
function SectionLabel({children}){return <span className="eyebrow"><CircleDot size={13}/>{children}</span>}
function Hero(){return <section className="hero"><div className="hero-bg"/><div className="site-container hero-content"><div className="hero-copy"><span className="eyebrow">ENGINEERING / SUPPLY / EXECUTION</span><h1><span className="mask-line"><span style={{color:"var(--amber)"}}>NA Engineering Solutions</span></span><span className="mask-line"><span>Engineering Services in Lahore</span></span></h1><p>NA Engineering Solutions supports factories, commercial facilities and project teams in Lahore with engineering consultancy, civil and mechanical works, HVAC, electrical installation, PEB, fire protection, industrial maintenance and General Order Supplies & Services. Tell us your scope, item list or site requirement and we will discuss the practical next steps.</p><div className="hero-actions"><Button to="/services" secondary testid="hero-explore-services">Explore Our Services</Button></div></div><div className="hero-note"><span>01</span><span>Planning to<br/>project support</span></div></div><div className="hero-scroll">SCROLL TO EXPLORE <ChevronDown size={15}/></div></section>}
function Marquee(){const items=["General Order Supplies & Services","Civil Engineering","HVAC","Mechanical Engineering","PEB Works","Electrical Works","Fire Fighting"];const row=[...items,...items];return <div className="marquee" aria-hidden="true"><div className="marquee-track">{row.map((x,i)=><span key={i} className={i%2?"marquee-outline":""}>{x}</span>)}</div></div>}
function Reveal({children}){return <div className="reveal-static">{children}</div>}
function Home(){return <><Hero/><Marquee/><main>
  <Reveal><section className="section section-light"><div className="site-container split"><div><SectionLabel>01 / THE PARTNER</SectionLabel><h2>Engineering work and supply support, from one team.</h2></div><div><p className="lead">NA Engineering Solutions supports industrial, commercial and construction teams across Lahore with engineering consultancy, maintenance and General Order Supplies &amp; Services. From assessing the scope and sourcing materials to coordinating on-site execution, we focus on practical solutions, clear communication and dependable support throughout the job.</p></div></div></section></Reveal>
  <Reveal><section className="section why-section"><div className="site-container"><SectionLabel>02 / WHY NA ENGINEERING</SectionLabel><div className="section-heading"><h2>Practical support, clearly scoped.</h2><p>We work to your specifications, site conditions and agreed delivery needs.</p></div><div className="value-grid">{['Scope understood','Specification-led sourcing','Site coordination','Clear communication','Maintenance support','Quotation by requirement','Project follow-through','One supply contact'].map((x,i)=><div className="value-card" key={x}><span>0{i+1}</span><CheckCircle2 size={18}/><h2>{x}</h2></div>)}</div></div></section></Reveal>
  <Reveal><section className="section section-light"><div className="site-container"><SectionLabel>03 / ENGINEERING SERVICES</SectionLabel><div className="section-heading"><h2>Choose the service that fits your requirement.</h2><p>Each service has its own scope, supporting details and common questions.</p></div><div className="cap-grid">{services.slice(0,6).map((s,i)=><Link to={`/services/${s.slug}`} className="cap-card" key={s.slug} data-testid={`capability-${s.slug}`}><SmartImage loading="lazy" fetchPriority="low" src={img(s.image,480)} sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" alt={`${s.title} engineering service`}/><div><s.icon size={21}/><span>0{i+1}</span><h2>{s.title}</h2><ArrowUpRight size={18}/></div></Link>)}</div><div className="home-extra-links"><Link to="/services">All engineering services <ArrowRight size={16}/></Link><Link to="/supplies">General Order Supplies <ArrowRight size={16}/></Link><Link to="/it-services">IT Services &amp; Equipment <ArrowRight size={16}/></Link><Link to="/contact">Request a quotation <ArrowRight size={16}/></Link></div></div></section></Reveal>
  <Reveal><section className="section industry-section"><div className="site-container"><div className="split"><div><SectionLabel>04 / INDUSTRIES</SectionLabel><h2>Support shaped around your site.</h2></div><div><p className="lead">From manufacturing and pharmaceutical environments to warehouses, utilities and commercial facilities, we discuss the actual site requirement before agreeing on a scope.</p><Button to="/industries" secondary testid="home-industries-link">Explore industries</Button></div></div><div className="industry-list">{industries.map((x,i)=><span key={x}><b>{String(i+1).padStart(2,'0')}</b>{x}<ArrowUpRight size={16}/></span>)}</div></div></section></Reveal>
  <Reveal><section className="section home-seo-section"><div className="site-container">
    <div className="section-heading"><div><SectionLabel>05 / SCOPE &amp; PROCUREMENT</SectionLabel><h2>Engineering Services &amp; General Order Supplies in Lahore</h2></div><p>One point of contact for technical work, industrial materials and day-to-day procurement requirements.</p></div>
    <h3 className="home-seo-support-heading">How NA Engineering Solutions supports Lahore businesses</h3>
    <p className="home-seo-intro">NA Engineering Solutions supports Lahore businesses with engineering consultancy, engineering services, general order supplies and project support. We help customers define requirements, review specifications, coordinate sourcing and plan practical site work. Each quotation is based on the agreed scope, quantities, technical details and delivery needs rather than a one-size-fits-all package.</p>
    <p className="home-seo-intro">For businesses in Lahore, a clear request helps us assess engineering services and general order supplies efficiently. For materials, include the item description, quantity, size, grade, brand preference and delivery location where known. For maintenance or installation work, share site photos, drawings, equipment details, access requirements and the expected completion date. Our team can review the information, identify any missing specifications and discuss sourcing or site-work options before a quotation is finalized. Availability, timelines and the agreed scope are confirmed for each request.</p>
    <div className="home-seo-grid">
      <article className="home-seo-card"><h3>Engineering, civil and technical services</h3><p>Our engineering services cover civil engineering and building works, mechanical engineering, HVAC systems, electrical works, pre-engineered buildings (PEB), fire fighting equipment, safety and security systems, waterproofing, and utility or facility maintenance. Support can include a discussion of site conditions, drawings, equipment information and execution requirements so the requested work is clearly described before scheduling. The final scope is confirmed project by project.</p></article>
      <article className="home-seo-card"><h3>General Order Supplies &amp; Services</h3><p>General order supplies can include hardware and hand tools, electrical and mechanical items, industrial spare parts, pumps and valves, HVAC materials, PPE and safety products, janitorial and cleaning consumables, office stationery, furniture, IT equipment and other approved project items. We source to the client's stated brand, model, size, material, grade or other specification wherever provided, and confirm availability and delivery details during quotation.</p></article>
      <article className="home-seo-card"><h3>Industrial maintenance and project support</h3><p>We work with procurement teams, maintenance staff, contractors and facility managers who need one point of contact for multiple line items or a defined job. For recurring requirements, planned maintenance or a one-off project, a clear item list and agreed scope help reduce clarification cycles and keep communication organized. Where site work is required, the work plan and deliverables are agreed before execution.</p></article>
      <article className="home-seo-card"><h3>What to share: BOQ or item list for a quotation</h3><p>Send a BOQ or item list where available, along with quantities, sizes, technical datasheets, photos or drawings, preferred brands and the required delivery date. For site work, include the location, dimensions, existing conditions and expected scope. These details help us review the request and respond with the information needed to discuss next steps.</p></article>
    </div>
  </div></section></Reveal>
  <InsightsPreview/>
  <CTA/>
</main></>}
function CTA(){return <section className="cta cta-sitewide"><div className="site-container cta-inner cta-inner-split"><div className="cta-copy"><SectionLabel>START A CONVERSATION</SectionLabel><h2>Have an engineering, supply<br/>or project requirement?</h2><p>Tell us what you need and our team will help you find the right solution.</p></div><div className="cta-actions"><Link to="/contact" className="button cta-contact-button" data-testid="cta-contact-button">Discuss your requirement <ArrowRight size={16}/></Link></div></div></section>}
function Services(){return <><PageIntro eyebrow="CAPABILITIES / 01" title="Engineering services in Lahore">We provide practical engineering and maintenance support for factories, commercial facilities and project sites, covering civil, mechanical, electrical, HVAC, PEB, fire fighting, waterproofing and industrial work.</PageIntro><main className="section section-light service-list-page"><div className="site-container service-list">{services.map((s,i)=><article className="service-row" key={s.slug}><div className="service-image"><SmartImage loading={i===0?"eager":"lazy"} fetchPriority={i===0?"high":"low"} src={img(s.image)} srcSet={imgSet(s.image)} sizes="(max-width: 800px) 100vw, 50vw" alt={`${s.title} service`} /></div><div className="service-copy"><SectionLabel>{s.title.toUpperCase()}</SectionLabel><h2>{s.title}</h2><p>{s.text}</p><div className="service-features"><span><CheckCircle2 size={15}/> Site-ready planning</span><span><CheckCircle2 size={15}/> Quality-led execution</span></div><div><Button to={`/services/${s.slug}`} secondary testid={`learn-more-${s.slug}`}>Learn More</Button></div></div></article>)}</div></main></>}
function ServiceDetail({service}){const faqs=serviceFaqs[service.title]||[];return <><PageIntro eyebrow={`SERVICES / ${service.title.toUpperCase()}`} title={service.title}>{service.text}</PageIntro><main className="section section-light"><div className="site-container detail-grid"><SmartImage className="detail-image" loading="eager" fetchPriority="high" src={img(service.image,760)} srcSet={imgSet(service.image)} sizes="(max-width: 800px) 100vw, 52vw" alt={`${service.title} professional project`} /><div><SectionLabel>WHAT WE SUPPORT</SectionLabel><h2>Practical support for demanding environments.</h2><p>We help customers plan, source and execute the work required to keep their sites, systems and projects operating effectively. Scope is agreed around your requirements and site conditions.</p><ul className="feature-list">{(detailFeatures[service.title]||[]).map(x=><li key={x}><CheckCircle2 size={17}/>{x}</li>)}</ul></div></div></main><section className="section service-faq-section"><div className="site-container"><SectionLabel>COMMON QUESTIONS</SectionLabel><div className="section-heading"><h2>Questions about this service.</h2><p>Clear answers for procurement, maintenance and project teams.</p></div><div className="service-faq-list">{faqs.map(([q,a])=><article className="service-faq-item" key={q}><h3>{q}</h3><p>{a}</p></article>)}</div></div></section></>}
function Supplies(){const faqs=[["What does NA Engineering Solutions supply in Lahore?","We supply a broad range of general order items including hardware and tools, electrical items, PPE and safety equipment, janitorial products, maintenance consumables, packaging materials, pantry items, office stationery and IT accessories."],["Can you handle mixed general order requirements?","Yes. Customers can send a mixed requirement and we can source different categories through one procurement point, subject to availability and agreed specifications."],["Do you supply industrial maintenance items as well as office supplies?","Yes. Our scope covers both industrial maintenance requirements and everyday office or facility supplies, depending on the order."],["Where do you provide general order supply services?","Our business is based in Lahore and supports procurement requirements for businesses, industrial facilities, commercial sites and projects in Lahore and elsewhere in Pakistan."]];return <><PageIntro eyebrow="GENERAL ORDER / 01" title="General Order Supplies in Lahore">Need several types of items from one supplier? NA Engineering Solutions handles general order requirements covering industrial supplies, office stationery, PPE, hardware, electrical accessories, janitorial products, maintenance consumables, packaging, pantry items and IT accessories.</PageIntro><main className="section section-light service-list-page"><div className="site-container service-list">{supplyGroups.map((g,i)=><article className="service-row" key={g.title}><div className="service-image"><SmartImage loading={i===0?"eager":"lazy"} fetchPriority={i===0?"high":"low"} src={img(g.image)} srcSet={imgSet(g.image)} sizes="(max-width: 800px) 100vw, 50vw" alt={`${g.title}`} /></div><div className="service-copy"><SectionLabel>{g.title.toUpperCase()}</SectionLabel><h2>{g.title}</h2><p>{g.desc}</p><ul className="feature-list">{g.items.map(x=><li key={x}><CheckCircle2 size={17}/>{x}</li>)}</ul></div></article>)}</div></main><section className="section service-faq-section"><div className="site-container"><SectionLabel>COMMON QUESTIONS</SectionLabel><div className="section-heading"><h2>Questions about general order supply.</h2><p>Straight answers for procurement and facility teams.</p></div><div className="service-faq-list">{faqs.map(([q,a])=><article className="service-faq-item" key={q}><h3>{q}</h3><p>{a}</p></article>)}</div></div></section><section className="section why-section"><div className="site-container"><SectionLabel>OUR COMMITMENT</SectionLabel><div className="section-heading"><h2>Reliable supply, handled professionally.</h2><p>At NA Engineering Solutions, every supply order is handled with the same care as our engineering projects.</p></div><div className="value-grid">{commitments.map((c,i)=><div className="value-card" key={c}><span>0{i+1}</span><CheckCircle2 size={18}/><h2>{c}</h2></div>)}</div><p className="lead" style={{marginTop:'2.5rem',maxWidth:'760px'}}>We would be glad to be considered for your upcoming and future procurement requirements, and are happy to share detailed quotations, data sheets or site support whenever required.</p></div></section><CTA/></>}
const itGroups = [
  {title:"Computers, Laptops & Displays", icon:Laptop, image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853", desc:"Complete computing hardware for offices, sites and control rooms — from workstations to displays and mobile devices.", items:["Laptop, Desktop & All-in-One PCs","Monitors, LED & Displays","Mobile Phones, Tablets & Accessories"]},
  {title:"PC Components & Storage", icon:Cpu, image:"https://images.unsplash.com/photo-1591405351990-4726e331f141", desc:"Genuine internal components, storage and everyday accessories to build, upgrade or maintain any system.", items:["Graphics Cards, Motherboards, Processors & PC Components","SSD, HDD, RAM, USB & Memory Cards","Keyboards, Mouse & Computer Accessories","Chargers, Adapters & Power Supplies"]},
  {title:"Printing, Peripherals & Consumables", icon:Printer, image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3", desc:"Printing, scanning and point-of-sale hardware with the consumables and cleaning supplies that keep them running.", items:["Printers, Scanners & Photocopiers","Toners, Ink & Cartridges","Barcode Scanners & POS Equipment","Cleaning Kits & IT Maintenance Consumables"]},
  {title:"Networking & Connectivity", icon:Wifi, image:"https://images.unsplash.com/photo-1544197150-b99a580bb7a8", desc:"Reliable networking hardware and cabling for stable wired and wireless connectivity across your facility.", items:["Routers, Switches, Access Points & Wi-Fi Devices","LAN, Cat6/Cat6A, Fiber Optic & Network Cables","HDMI, VGA, USB, DisplayPort & Other Cables","Connectors, Plugs, Patch Cords & Network Accessories"]},
  {title:"Servers, Storage & Power Backup", icon:Server, image:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31", desc:"Data-centre grade servers, storage, structured cabling and power protection for critical operations.", items:["Servers, NAS & Storage Solutions","Racks, Patch Panels & Cable Management","UPS, Batteries, Surge Protectors & Power Backup"]},
  {title:"Security, AV & Conferencing", icon:Camera, image:"https://images.unsplash.com/photo-1557597774-9d273605dfa9", desc:"Surveillance, access control and audio-visual equipment for safe, well-connected workplaces and meeting rooms.", items:["CCTV Cameras, DVR/NVR & Security Accessories","Biometric Attendance & Access Control Systems","Projectors, Screens & Presentation Equipment","Speakers, Headsets, Microphones & Video Conferencing Equipment","Webcams & Conference Cameras"]},
  {title:"Software & IT Services", icon:Wrench, image:"https://images.unsplash.com/photo-1573164713988-8665fc963095", desc:"Licensed software, IT furniture and hands-on technical services to install, maintain and support your setup.", items:["Software, Operating Systems & Licenses","Computer Tables, Racks & IT Furniture","IT Hardware Repair, Installation & Maintenance"]}
];
function ITServices(){const faqs=[["What IT equipment do you supply in Lahore?","We supply computers, laptops, displays, PC components, storage, printers, networking equipment, servers, UPS systems, CCTV, access control, AV equipment and common IT accessories."],["Do you provide IT installation and maintenance?","Yes. IT support includes hardware installation, repair, maintenance, networking support and setup assistance according to the agreed requirement."],["Can you supply complete office IT requirements?","Yes. We can source a mixed requirement covering computers, printers, networking, displays, power backup, security and related accessories."],["Do you supply genuine IT components and accessories?","We source items against the customer's required make, model, specification and availability. Brand and model should be confirmed in the quotation."]];return <><PageIntro eyebrow="IT SERVICES / 01" title="IT Services & Equipment in Lahore">We supply and support everyday business IT — computers, laptops, printers, networking, servers, CCTV, power backup and accessories — with installation and maintenance support when required.</PageIntro><main className="section section-light service-list-page"><div className="site-container service-list">{itGroups.map((g,i)=><article className="service-row" key={g.title}><div className="service-image"><SmartImage loading={i===0?"eager":"lazy"} fetchPriority={i===0?"high":"low"} src={img(g.image)} srcSet={imgSet(g.image)} sizes="(max-width: 800px) 100vw, 50vw" alt={`${g.title}`} /></div><div className="service-copy"><SectionLabel>{g.title.toUpperCase()}</SectionLabel><h2>{g.title}</h2><p>{g.desc}</p><ul className="feature-list">{g.items.map(x=><li key={x}><CheckCircle2 size={17}/>{x}</li>)}</ul></div></article>)}</div></main><section className="section service-faq-section"><div className="site-container"><SectionLabel>COMMON QUESTIONS</SectionLabel><div className="section-heading"><h2>Questions about IT supply and support.</h2><p>Useful information before you send a requirement.</p></div><div className="service-faq-list">{faqs.map(([q,a])=><article className="service-faq-item" key={q}><h3>{q}</h3><p>{a}</p></article>)}</div></div></section><CTA/></>}
function Industries(){const cards=[{n:"Manufacturing",im:"1567789884554-0b844b597180",d:"We keep production lines running with machinery support, MRO supplies and planned maintenance. From motors, bearings, belts and pneumatics to on-site troubleshooting, our team helps reduce downtime. We also supply tools, safety gear and consumables so operations stay efficient, safe and on schedule."},{n:"Pharmaceutical",im:"1579165466741-7f35e4755660",d:"Pharmaceutical facilities demand clean, controlled environments. We support HVAC systems, clean utilities and compliant facility supplies, along with preventive maintenance and calibration-ready equipment. Our sourcing follows your specifications so hygiene, air quality and regulatory standards are consistently maintained across production and storage areas."},{n:"Food & Beverage",im:"1556910103-1c02745aae4d",d:"Food and beverage plants rely on hygienic, well-ventilated facilities. We provide sanitary maintenance, ventilation and exhaust support, and process-related supplies that meet strict cleanliness requirements. From HVAC servicing to safe cleaning consumables, we help keep production areas compliant, efficient and running without interruption."},{n:"Industrial Plants",im:"1513828583688-c52646db42da",d:"Industrial plants need dependable mechanical, electrical and maintenance support. We supply pumps, motors, valves, cables and industrial spares, and provide fabrication, installation and shutdown support. Our engineers work on-site to keep utilities, equipment and processes operating reliably, safely and with minimal unplanned downtime."},{n:"Power & Utilities",im:"1509391366360-2e959784a276",d:"Utility environments require robust electrical works and reliable materials. We handle installation, cabling, lighting and maintenance, and supply panels, breakers and accessories to specification. Our team supports the safe, continuous operation of power and utility infrastructure with prompt response and quality-led execution."},{n:"Construction",im:"1541888946425-d81bb19240f5",d:"From groundwork to structure, we support construction projects with civil works, PEB fabrication and site supplies. We deliver materials, tools, safety equipment and skilled execution on schedule. Whether it is a new build or a modification, our team helps keep the project moving safely and efficiently."},{n:"Commercial Buildings",im:"1486406146926-c627a92ad1ab",d:"Commercial buildings need integrated HVAC, electrical, fire and facility services. We install and maintain building systems and supply the accessories and consumables required to keep them running. Our support helps property teams ensure comfort, safety and reliable day-to-day operation for occupants and tenants."},{n:"Warehouses",im:"1553413077-190dd305871c",d:"Warehouses and storage facilities depend on good ventilation, lighting and safety. We supply and maintain fans, lighting, racking accessories, PPE and maintenance consumables. Our team helps keep storage environments safe, well-lit and organised so goods and staff are protected and operations run smoothly."},{n:"Offices",im:"1497366811353-6870744d04b2",d:"We support office environments with fit-out assistance, general order supplies and ongoing facility maintenance. From stationery, IT accessories and pantry items to electrical and cleaning support, we help offices source everyday requirements from one reliable partner and keep the workplace comfortable and productive."},{n:"Facility Management",im:"1497366216548-37526070297c",d:"Facility management teams need a dependable supply and technical partner. We provide day-to-day maintenance materials, spares and consumables, plus responsive technical support and preventive maintenance. Our aim is to simplify procurement and keep every building system operating reliably with minimal disruption."},{n:"Infrastructure Projects",im:"1508450859948-4e04fabaa4ea",d:"Infrastructure projects require materials, fabrication and hands-on execution support. We supply steel, piping, electrical and civil materials to specification, and provide fabrication and site services. Our team helps deliver demanding infrastructure work safely, on time and to the required quality standards."}];return <><PageIntro eyebrow="INDUSTRIES / PROJECTS" title="Industries we serve in Lahore and Pakistan">We work with factories, commercial facilities and project teams where reliable engineering, maintenance and supply support are needed day to day.</PageIntro><main className="section section-light service-list-page"><div className="site-container service-list">{cards.map((x,i)=><article className="service-row" key={x.n} data-testid={`industry-${i}`}><div className="service-image"><SmartImage loading={i===0?"eager":"lazy"} fetchPriority={i===0?"high":"low"} src={img(`https://images.unsplash.com/photo-${x.im}`)} srcSet={imgSet(`https://images.unsplash.com/photo-${x.im}`)} sizes="(max-width: 800px) 100vw, 50vw" alt={`${x.n} industry`}/></div><div className="service-copy"><SectionLabel>{`INDUSTRY / ${String(i+1).padStart(2,'0')}`}</SectionLabel><h2>{x.n}</h2><p>{x.d}</p></div></article>)}</div></main><CTA/></>}
function useLenis(){useEffect(()=>{window.__lenis=null},[])}
function ScrollToTop(){const {pathname}=useLocation();useLayoutEffect(()=>{if(window.__lenis)window.__lenis.scrollTo(0,{immediate:true});window.scrollTo({top:0,left:0,behavior:"auto"});if(document.documentElement)document.documentElement.scrollTop=0;if(document.body)document.body.scrollTop=0},[pathname]);return null}
function ChatWidget(){
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState([{role:'assistant',text:'Hello! I am the NA Engineering assistant. Ask me anything about our engineering services or general order supplies.'}]);
  const [text,setText]=useState(''); const [busy,setBusy]=useState(false);
  const [model,setModel]=useState('gpt');
  const session=useRef(`web-${Math.random().toString(36).slice(2)}`);
  const bodyRef=useRef(null);
  useEffect(()=>{if(bodyRef.current)bodyRef.current.scrollTop=bodyRef.current.scrollHeight},[msgs,open]);
  const send=async(e)=>{e.preventDefault();const message=text.trim();if(!message||busy)return;setText('');setBusy(true);setMsgs(m=>[...m,{role:'user',text:message},{role:'assistant',text:''}]);
    try{
      const res=await fetch(`${API}/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session_id:session.current,message,model})});
      if(!res.ok||!res.body)throw new Error('chat failed');
      const reader=res.body.getReader();const dec=new TextDecoder();let buf='';let acc='';
      for(;;){const{done,value}=await reader.read();if(done)break;buf+=dec.decode(value,{stream:true});const parts=buf.split('\n\n');buf=parts.pop();
        for(const p of parts){const line=p.trim();if(!line.startsWith('data:'))continue;const data=line.slice(5).trim();if(data==='[DONE]')continue;try{acc+=JSON.parse(data).delta;const snapshot=acc;setMsgs(m=>{const c=[...m];c[c.length-1]={role:'assistant',text:snapshot};return c})}catch(parseErr){}}}
    }catch(err){setMsgs(m=>{const c=[...m];c[c.length-1]={role:'assistant',text:'Sorry — I could not answer right now. Please email na.engineeringsolutions2023@gmail.com or message us on WhatsApp.'};return c})}
    setBusy(false);
  };
  return <div className="chat-widget"><a className="chat-toggle whatsapp-toggle" href="https://wa.me/923008596393?text=Hello%20NA%20Engineering%20Solutions%2C%20I%20would%20like%20to%20discuss%20a%20requirement." target="_blank" rel="noreferrer" data-testid="whatsapp-button" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.198.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a><button className="chat-toggle" data-testid="chat-toggle-button" onClick={()=>setOpen(!open)} aria-label="Chat with AI assistant">{open?<X size={20}/>:<MessageCircle size={20}/>}</button>{open&&<div className="chat-panel" data-testid="chat-panel"><div className="chat-head"><img src="/logo-gradient-transparent-v2.webp" alt="NA Engineering Solutions"/><div><b>NA Assistant</b><span>{model==='gemini'?'Gemini 3.5 Flash':'GPT-5.4'} · replies instantly</span></div><div className="chat-models"><button type="button" className={model==='gpt'?'on':''} onClick={()=>setModel('gpt')} data-testid="chat-model-gpt">GPT</button><button type="button" className={model==='gemini'?'on':''} onClick={()=>setModel('gemini')} data-testid="chat-model-gemini">Gemini</button></div></div><div className="chat-body" ref={bodyRef} data-testid="chat-messages">{msgs.map((m,i)=><div key={i} className={m.role==='user'?'chat-msg user':'chat-msg'}>{m.text}{busy&&i===msgs.length-1&&m.role==='assistant'&&<span className="chat-caret"/>}</div>)}</div><form className="chat-form" onSubmit={send}><input value={text} onChange={e=>setText(e.target.value)} placeholder="Ask about services, supplies, quotes..." data-testid="chat-input"/><button type="submit" disabled={busy} data-testid="chat-send-button" aria-label="Send message"><Send size={16}/></button></form></div>}</div>
}

function Counter({to,suffix=""}){return <b>{to}{suffix}</b>}
const clients=[
  {n:"Gerry's Dnata",ind:"Aviation & Cargo",icon:Plane,mono:"GD",d:"Aviation and cargo-site requirements, where timing, coordination and safety are essential."},
  {n:"Interloop",ind:"Textile Manufacturing",icon:Shirt,mono:"IL",d:"Industrial and facility requirements in a large-scale manufacturing environment."},
  {n:"Sialkot Airport",ind:"Aviation",icon:Plane,mono:"SA",d:"Airport-related facility and supply requirements."},
  {n:"Joyland Group",ind:"Leisure & Facilities",icon:Building2,mono:"JG",d:"Facility and operational supply requirements."},
  {n:"Lake City Power House & Management",ind:"Power & Property Management",icon:Zap,mono:"LC",d:"Utility, property and facility-support requirements."},
  {n:"Fatima Fertilizer",ind:"Fertilizer & Industrial",icon:FlaskConical,mono:"FF",d:"Industrial requirements where technical specifications and site coordination matter."},
  {n:"ZIC Oil",ind:"Lubricants & Industry",icon:Factory,mono:"ZIC",d:"Industrial and lubricant-related supply environments."}
]
function Clients(){
  const projects=[
    {t:"HVAC duct work",loc:"BF Biosciences — Packaging Hall",s:"Ductwork scope and coordination for a packaging-area HVAC requirement",im:"1615309662243-70f6df917b59"},
    {t:"Epoxy flooring rehabilitation",loc:"Neutro Pharma facility",s:"Industrial floor rehabilitation planning and site coordination",im:"1541888946425-d81bb19240f5"},
    {t:"Cargo gate track and drive support",loc:"Cargo / logistics facility",s:"Wheel-track replacement and gate motor / gear troubleshooting scope",im:"1558618666-fcd25c85cd64"},
    {t:"Roof waterproofing and heat-proofing",loc:"Commercial and industrial roof areas",s:"Roof preparation, waterproof treatment and leakage-protection scope",im:"1602064828974-fcac67d33f4e"}
  ];
  const why=[[Users,'Professional coordination','A clear discussion of the requirement, site conditions and specifications before work starts.'],[Clock,'Delivery planning','Realistic lead times and updates around the agreed scope.'],[ShieldCheck,'Site safety','Attention to site access, permits, PPE and working conditions.'],[Headphones,'After-delivery support','Follow-up for maintenance, spares and technical questions within the agreed scope.']];
  return <><PageIntro eyebrow="PORTFOLIO / PROJECT EXPERIENCE" title="Project scopes and site experience">Examples of engineering, maintenance and supply requirements that reflect the kinds of work our team supports. Final deliverables and site conditions are confirmed for each individual project.</PageIntro><main>
    <Reveal><section className="section section-light"><div className="site-container"><SectionLabel>CLIENT & SITE ENVIRONMENTS</SectionLabel><div className="section-heading"><h2>Experience across industrial and commercial settings.</h2><p>Our background includes aviation and cargo, manufacturing, chemical and pharmaceutical, facility and other project environments.</p></div><div className="logos-row">{clients.map(c=><div className="logo-chip" key={c.n} title={c.n}><span className="logo-mono">{c.mono}</span>{c.lg&&<img src={c.lg} alt={`${c.n} logo`} onError={e=>{e.currentTarget.style.display='none'}}/>}</div>)}</div><div className="clients-grid">{clients.map((c,i)=><div className="client-card" key={c.n} data-testid={`client-${i}`}><c.icon size={26}/><span className="client-ind">{c.ind}</span><h3>{c.n}</h3><p>{c.d}</p></div>)}</div></div></section></Reveal>
    <Reveal><section className="section industry-section"><div className="site-container"><SectionLabel>SELECTED PROJECT SCOPES</SectionLabel><div className="section-heading"><h2>Work begins with the actual requirement.</h2><p>These examples describe project scopes discussed and supported; scope can differ by customer and site. Photos are illustrative and are not presented as documentary images from the named sites.</p></div><div className="projects-grid">{projects.map((p,i)=><div className="project-card" key={p.t} data-testid={`project-${i}`}><div className="project-card-img"><SmartImage loading="lazy" fetchPriority="low" src={img(`https://images.unsplash.com/photo-${p.im}`,480)} sizes="(max-width: 800px) 100vw, 33vw" alt={`Illustrative image for ${p.t}`}/><span>0{i+1}</span></div><h3>{p.t}</h3><div className="proj-loc"><MapPin size={13}/>{p.loc}</div><p><b>Scope:</b> {p.s}</p></div>)}</div></div></section></Reveal>
    <Reveal><section className="section section-light"><div className="site-container"><SectionLabel>HOW WE WORK</SectionLabel><div className="section-heading"><h2>What you can expect from our team.</h2></div><div className="why-grid">{why.map(([Icon,t,d])=><div className="supply-card" key={t}><Icon size={24}/><h3>{t}</h3><p>{d}</p></div>)}</div><div className="home-extra-links"><Link to="/services">Explore engineering services <ArrowRight size={16}/></Link><Link to="/supplies">General Order Supplies <ArrowRight size={16}/></Link><Link to="/contact">Discuss a project <ArrowRight size={16}/></Link></div></div></section></Reveal>
    <section className="cta"><div className="site-container cta-inner"><SectionLabel>START YOUR PROJECT</SectionLabel><h2>Have a site or supply requirement?</h2><p>Send us the scope, specification or item list so we can discuss the next steps.</p><div className="cta-actions"><Link to="/contact" className="button">Contact our team <ArrowRight size={16}/></Link></div></div></section>
  </main></>
}

function formatDetail(detail){if(detail==null)return 'Something went wrong. Please try again.';if(typeof detail==='string')return detail;if(Array.isArray(detail))return detail.map(e=>e&&typeof e.msg==='string'?e.msg:JSON.stringify(e)).filter(Boolean).join(' ');if(detail&&typeof detail.msg==='string')return detail.msg;return String(detail)}
function Admin(){
  const [token,setToken]=useState(localStorage.getItem('na_admin_token'));
  const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState('');
  const [tab,setTab]=useState('quotes');const [quotes,setQuotes]=useState([]);const [chats,setChats]=useState([]);const [loading,setLoading]=useState(false);
  useEffect(()=>{if(!token)return;const headers={Authorization:`Bearer ${token}`};setLoading(true);
    axios.get(`${API}/admin/quotes`,{headers}).then(r=>setQuotes(r.data)).catch(err=>{if(err.response&&err.response.status===401){localStorage.removeItem('na_admin_token');setToken(null)}});
    axios.get(`${API}/admin/chats`,{headers}).then(r=>setChats(r.data)).catch(()=>{}).finally(()=>setLoading(false));},[token]);
  const login=async(e)=>{e.preventDefault();setError('');try{const{data}=await axios.post(`${API}/admin/login`,{email,password});localStorage.setItem('na_admin_token',data.token);setToken(data.token)}catch(err){setError(formatDetail(err.response&&err.response.data&&err.response.data.detail))}};
  const logout=()=>{localStorage.removeItem('na_admin_token');setToken(null)};
  const toggleHandled=async(q)=>{try{const{data}=await axios.patch(`${API}/admin/quotes/${q.id}/handled`,{handled:!q.handled},{headers:{Authorization:`Bearer ${token}`}});setQuotes(qs=>qs.map(x=>x.id===q.id?{...x,handled:data.handled}:x))}catch(e){toast.error('Could not update status')}};
  const downloadAttachment=async(q)=>{try{const res=await axios.get(`${API}/admin/files/${q.id}`,{headers:{Authorization:`Bearer ${token}`},responseType:'blob'});const url=URL.createObjectURL(res.data);const a=document.createElement('a');a.href=url;a.download=q.attachment_name||'attachment';a.click();URL.revokeObjectURL(url)}catch(e){toast.error('Could not download attachment')}};
  if(!token)return <main className="admin-wrap"><div className="site-container"><form className="admin-login" onSubmit={login} data-testid="admin-login-form"><SectionLabel>TEAM ACCESS</SectionLabel><h2 style={{margin:'14px 0 20px'}}>Admin sign in</h2>{error&&<p className="admin-error" data-testid="admin-login-error">{error}</p>}<label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required data-testid="admin-email-input" placeholder="admin email"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required data-testid="admin-password-input" placeholder="password"/></label><button className="button form-submit" data-testid="admin-login-button">Sign in<ArrowRight size={16}/></button></form></div></main>;
  const sessions=chats.reduce((acc,m)=>{(acc[m.session_id]=acc[m.session_id]||[]).push(m);return acc},{});
  return <main className="admin-wrap"><div className="site-container"><div className="admin-head"><div><SectionLabel>INTERNAL DASHBOARD</SectionLabel><h2 style={{margin:'12px 0 0'}}>Quote requests & conversations</h2></div><button className="button button-secondary" onClick={logout} data-testid="admin-logout-button">Log out</button></div><div className="admin-tabs"><button className={tab==='quotes'?'active':''} onClick={()=>setTab('quotes')} data-testid="admin-tab-quotes">Quote Requests ({quotes.length})</button><button className={tab==='chats'?'active':''} onClick={()=>setTab('chats')} data-testid="admin-tab-chats">Chat Conversations ({Object.keys(sessions).length})</button></div>
  {tab==='quotes'&&(quotes.length?<div className="table-scroll"><table className="admin-table" data-testid="quotes-table"><thead><tr><th>Date</th><th>Name</th><th>Company</th><th>Email</th><th>Phone</th><th>Service</th><th>Message</th><th>Attachment</th><th>Status</th></tr></thead><tbody>{quotes.map(q=><tr key={q.id}><td>{new Date(q.created_at).toLocaleString()}</td><td>{q.full_name}</td><td>{q.company_name||'-'}</td><td>{q.email}</td><td>{q.phone||'-'}</td><td>{q.service_required}</td><td>{q.message}</td><td>{q.attachment_path?<button className="link-btn" onClick={()=>downloadAttachment(q)} data-testid={`download-${q.id}`}>{q.attachment_name}</button>:(q.attachment_name||'-')}</td><td><button className={q.handled?'badge-handled on':'badge-handled'} onClick={()=>toggleHandled(q)} data-testid={`handled-${q.id}`}>{q.handled?'Handled ✓':'Mark handled'}</button></td></tr>)}</tbody></table></div>:<p className="admin-muted">{loading?'Loading...':'No quote requests yet.'}</p>)}
  {tab==='chats'&&(Object.keys(sessions).length?<div data-testid="chat-list">{Object.entries(sessions).map(([sid,msgs])=><div className="chat-session" key={sid}><h4>Session {sid} · {msgs.length} messages · {new Date(msgs[0].created_at).toLocaleString()}</h4>{msgs.map((m,i)=><div className="line" key={i}><b>{m.role}</b>{m.text}</div>)}</div>)}</div>:<p className="admin-muted">{loading?'Loading...':'No chat conversations yet.'}</p>)}
  </div></main>
}

function RouteSEO() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const service = path.startsWith("/services/")
      ? services.find((item) => path === `/services/${item.slug}`)
      : null;
    // Article records are imported from InsightsPage; the public URL is now /blog.
    const article = path.startsWith("/blog/")
      ? insightArticles.find((item) => path === `/blog/${item.slug}`)
      : null;

    const page = (() => {
      if (path === "/") return {
        title: "NA Engineering Solutions | Engineering Services & Supplies in Lahore",
        description: "Engineering services, industrial maintenance and General Order Supplies & Services for commercial, industrial and construction projects in Lahore, Pakistan."
      };
      if (path === "/services") return {
        title: "Engineering Services in Lahore | NA Engineering Solutions",
        description: "Explore civil, mechanical, electrical, HVAC, PEB, fire-fighting and other engineering services for industrial and commercial projects in Lahore."
      };
      if (service) return {
        title: service.slug === "boiler-chemicals" ? "Boiler Chemicals in Lahore | NA Engineering Solutions" : service.slug === "mechanical-electrical-supplies" ? "Mechanical & Electrical Supplies in Lahore | NA Engineering Solutions" : service.slug === "utilities-facility-maintenance" ? "Utility & Facility Maintenance in Lahore | NA Engineering Solutions" : service.slug === "seamless-pipes-fittings" ? "Seamless Pipes & Fittings in Lahore | NA Engineering Solutions" : service.slug === "wastewater-treatment-plant" ? "Wastewater Treatment Plant Services | NA Engineering Solutions" : service.slug === "hvac-supplies-services" ? "HVAC Services in Lahore | NA Engineering Solutions" : service.slug === "fire-fighting-equipment" ? "Fire Fighting Services in Lahore | NA Engineering Solutions" : service.slug === "waterproofing-solutions" ? "Waterproofing in Lahore | NA Engineering Solutions" : service.slug === "pumps-valves-pneumatic" ? "Pumps & Valves in Lahore | NA Engineering Solutions" : `${service.title} in Lahore | NA Engineering Solutions`,
        description: service.slug === "boiler-chemicals"
          ? "NA Engineering Solutions supplies boiler water treatment chemicals, dosing systems and testing support for industrial boilers in Lahore, Pakistan."
          : service.slug === "engineering-consultancy"
            ? "Engineering consultancy in Lahore for project planning, technical reviews, specifications and execution support for commercial and industrial projects."
            : service.slug === "mechanical-electrical-supplies"
              ? "NA Engineering Solutions supplies industrial motors, pumps, gearboxes, valves, cables and electrical panels for industrial projects in Lahore, Pakistan."
              : service.slug === "utilities-facility-maintenance"
                ? "Utility and facility maintenance in Lahore for water, compressed air, steam and boiler systems, preventive servicing and repairs by NA Engineering Solutions."
                : service.slug === "seamless-pipes-fittings"
                  ? "NA Engineering Solutions supplies seamless MS and SS pipes, flanges, elbows, reducers and tees in project-specific grades and sizes across Lahore, Pakistan."
                  : service.slug === "wastewater-treatment-plant"
                    ? "NA Engineering Solutions supplies wastewater treatment equipment, pumps, blowers, diffusers and dosing systems for industrial projects in Lahore, Pakistan."
                    : service.slug === "hvac-supplies-services"
                      ? "HVAC installation, ducting, chillers, AHUs, FCUs and preventive maintenance for commercial and industrial facilities in Lahore by NA Engineering Solutions."
                      : service.slug === "fire-fighting-equipment"
                        ? "Fire extinguishers, hydrants, hoses, sprinklers and fire protection equipment, plus inspection and maintenance support in Lahore from NA Engineering Solutions."
                        : service.slug === "safety-security-systems"
                          ? "NA Engineering Solutions supplies CCTV, access control, biometric attendance, alarm systems, emergency lighting and safety signage across Lahore, Pakistan."
                          : service.slug === "waterproofing-solutions"
                            ? "Roof, basement and water tank waterproofing in Lahore, including membranes, protective coatings and leakage repairs for commercial and industrial properties."
                            : service.slug === "pumps-valves-pneumatic"
                              ? "Industrial pumps, valves, pneumatic fittings, hoses and regulators supplied in Lahore with application-based selection support by NA Engineering Solutions."
                              : service.slug === "civil-engineering"
                                ? "Civil engineering services in Lahore covering construction, concrete, flooring, waterproofing and site development for commercial and industrial projects."
                                : `${service.text} NA Engineering Solutions supports industrial and commercial projects in Lahore, Pakistan.`
      };
      if (path === "/supplies") return {
        title: "General Order Supplies in Lahore | NA Engineering Solutions",
        description: "Source industrial materials, hardware, tools, PPE, electrical items, office supplies and facility maintenance products through one general order supplier in Lahore."
      };
      if (path === "/it-services") return {
        title: "IT Services & Technology Supplies in Lahore | NA Engineering Solutions",
        description: "IT support and technology supply solutions for businesses, offices and project teams in Lahore, Pakistan."
      };
      if (path === "/industries") return {
        title: "Industries We Serve | NA Engineering Solutions Lahore",
        description: "Engineering, maintenance and procurement support for industrial, commercial, construction and facility operations in Lahore and across Pakistan."
      };
      if (path === "/blog") return {
        title: "Engineering & Industrial Blog | NA Engineering Solutions",
        description: "Practical engineering guides, industrial maintenance checklists, HVAC tips, PEB planning and general order procurement advice for businesses in Pakistan."
      };
      if (article) return {
        title: article.seoTitle || `${article.title} | NA Engineering Solutions`,
        description: article.description
      };
      if (path === "/clients") return {
        title: "Clients & Project Experience | NA Engineering Solutions",
        description: "Learn about the sectors and project environments supported by NA Engineering Solutions through engineering services and general order supplies."
      };
      if (path === "/contact") return {
        title: "Contact NA Engineering Solutions | Lahore, Pakistan",
        description: "Contact NA Engineering Solutions in Lahore for engineering services, industrial supplies, general order procurement and project support."
      };
      if (path === "/admin") return {
        title: "Admin | NA Engineering Solutions",
        description: "Website administration.",
        noindex: true
      };
      return {
        title: "Page Not Found | NA Engineering Solutions",
        description: "This page could not be found. Browse our engineering services and general order supplies or contact our Lahore team.",
        noindex: true
      };
    })();

    const canonicalUrl = `https://www.naengineeringsolutions.com${path === "/" ? "/" : path}`;
    document.title = page.title;

    const setMeta = (selector, attribute, key, value) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', "name", "description", page.description);
    setMeta('meta[name="robots"]', "name", "robots", page.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    setMeta('meta[property="og:title"]', "property", "og:title", page.title);
    setMeta('meta[property="og:description"]', "property", "og:description", page.description);
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    const socialImage = article?.image || "https://www.naengineeringsolutions.com/logo.png";
    setMeta('meta[property="og:image"]', "property", "og:image", socialImage);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", socialImage);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", page.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", page.description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    const schemaGraph = [];
    if (path !== "/" && !page.noindex) {
      schemaGraph.push({
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.naengineeringsolutions.com/" },
          { "@type": "ListItem", position: 2, name: page.title.replace(" | NA Engineering Solutions", "").replace(" | NA Engineering Solutions Lahore", ""), item: canonicalUrl }
        ]
      });
    }
    if (service) {
      schemaGraph.push({
        "@type": "Service",
        name: service.title,
        description: service.text,
        serviceType: service.title,
        areaServed: { "@type": "City", name: "Lahore" },
        provider: {
          "@type": "ProfessionalService",
          name: "NA Engineering Solutions",
          url: "https://www.naengineeringsolutions.com/"
        },
        url: canonicalUrl
      });
    }
    if (article) {
      schemaGraph.push({
        "@type": "BlogPosting",
        headline: article.title,
        description: article.description,
        image: [article.image],
        articleSection: article.category,
        keywords: [article.category, "engineering", "industrial maintenance", "general order supplies", "Lahore"],
        inLanguage: "en-PK",
        mainEntityOfPage: canonicalUrl,
        author: { "@type": "Organization", name: "NA Engineering Solutions" },
        publisher: {
          "@type": "Organization",
          name: "NA Engineering Solutions",
          logo: { "@type": "ImageObject", url: "https://www.naengineeringsolutions.com/logo.png" }
        }
      });
    }
    let schemaScript = document.head.querySelector("#route-seo-schema");
    if (schemaGraph.length) {
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.id = "route-seo-schema";
        schemaScript.type = "application/ld+json";
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph });
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [location.pathname]);

  return null;
}

function App() {
  useLenis();
  return (
    <BrowserRouter><div className="App"><Toaster position="top-right" />
      <ScrollToTop/>
      <RouteSEO/>
      <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services/>}/>
          <Route path="/services/:slug" element={<ServiceRoute/>}/>
          <Route path="/supplies" element={<Supplies/>}/>
          <Route path="/it-services" element={<ITServices/>}/>
          <Route path="/industries" element={<Industries/>}/>
          <Route path="/blog" element={<InsightsPage/>}/>
          <Route path="/blog/:slug" element={<InsightsPage/>}/>
          <Route path="/insights" element={<Navigate to="/blog" replace/>}/>
          <Route path="/insights/:slug" element={<LegacyBlogRedirect/>}/>
          <Route path="/clients" element={<Clients/>}/>
          <Route path="/contact" element={<ContactPage/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      <Footer/>
      <ChatWidget/>
    </div></BrowserRouter>
  );
}

function LegacyBlogRedirect(){const {slug}=useParams();return <Navigate to={slug?`/blog/${slug}`:"/blog"} replace/>}
function ServiceRoute(){const {pathname}=useLocation();const service=services.find(s=>pathname.endsWith(s.slug));return service?<ServiceDetail service={service}/>:<NotFound/>}

function NotFound(){return <><PageIntro eyebrow="404 / PAGE NOT FOUND" title="This page could not be found.">The address may have changed or the link may be incorrect. You can browse our engineering services, explore General Order Supplies, or contact our Lahore team for help.</PageIntro><main className="section section-light"><div className="site-container"><div className="home-extra-links"><Link to="/services">Explore engineering services <ArrowRight size={16}/></Link><Link to="/supplies">General Order Supplies <ArrowRight size={16}/></Link><Link to="/contact">Contact our team <ArrowRight size={16}/></Link></div></div></main></>}

export default App;
