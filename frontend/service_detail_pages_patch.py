from pathlib import Path
import re

APP = Path("src/App.js")
CSS = Path("src/App.css")
source = APP.read_text()

DETAIL_DATA = r'''
const specialistDetailData={
  "Mechanical & Electrical Supplies and Services":{
    intro:"Complete mechanical and electrical supply support for industrial plants, commercial facilities, maintenance teams and project requirements.",
    overview:"NA Engineering Solutions supplies a broad range of mechanical and electrical equipment, spare parts and accessories according to approved specifications, site conditions and application requirements. We also support repair, replacement, troubleshooting and on-site technical coordination.",
    items:[
      {title:"Motors, Gearboxes & Drives",text:"Industrial motors, gearboxes, geared drives and related components for machinery, conveyors and plant equipment."},
      {title:"Pumps, Blowers & Compressors",text:"Industrial pumps, blowers, compressors and replacement parts for process, utility and facility applications."},
      {title:"Conveyors & Material Handling",text:"Belt conveyors, conveyor components, hand pallet lifter parts, hand trolleys, platform trolleys and pallet jacks."},
      {title:"Bearings, Valves & Mechanical Parts",text:"Bearings, gaskets, seals, valves, pneumatic fittings, chains, sprockets and other maintenance components."},
      {title:"Pipes, Fittings & Flanges",text:"MS and SS pipes, flanges, elbows, reducers, tees and related piping accessories according to project specifications."},
      {title:"Electrical Materials",text:"Panels, breakers, contactors, relays, cables, lighting, switches and wiring accessories for industrial and commercial applications."},
      {title:"Repair & Technical Support",text:"Replacement, preventive maintenance, troubleshooting and on-site technical support for mechanical and electrical systems."}
    ],
    applications:["Manufacturing plants","Industrial maintenance","Commercial facilities","Production lines","Warehouses and logistics","Engineering projects"]
  },
  "Utilities & Facility Maintenance Supplies and Services":{
    intro:"Reliable utility and facility maintenance support for systems that keep industrial and commercial operations running.",
    overview:"We provide maintenance materials, spare parts and technical support for water, compressed air, steam and general utility systems. Services can be arranged for preventive maintenance, corrective work and annual maintenance requirements.",
    items:[
      {title:"Utility System Maintenance",text:"Maintenance and repair support for water, compressed-air, steam and other essential utility systems."},
      {title:"Maintenance Consumables",text:"Gaskets, fasteners, seals, bearings, belts and other frequently required maintenance materials."},
      {title:"Preventive Maintenance",text:"Planned inspections and preventive maintenance to reduce breakdowns and improve equipment reliability."},
      {title:"Corrective Maintenance",text:"Troubleshooting, repair and replacement support when utility or facility equipment develops a fault."},
      {title:"AMC Support",text:"Annual maintenance contract support tailored to site requirements, equipment condition and service schedules."},
      {title:"Compressor & Boiler Parts",text:"Supply of air-compressor components and boiler parts as required for maintenance and replacement."}
    ],
    applications:["Factories","Process plants","Commercial buildings","Utility rooms","Facility management","Production facilities"]
  },
  "Boiler Chemicals – Supply and Services":{
    intro:"Boiler water-treatment chemicals and technical support focused on efficient operation and equipment protection.",
    overview:"Our boiler chemical supply and service support helps manage water quality, scaling and corrosion risks. Chemical selection and dosing should be based on boiler type, feed-water conditions, operating parameters and site testing.",
    items:[
      {title:"Scale Inhibitors",text:"Water-treatment chemicals designed to control scale formation and help maintain heat-transfer efficiency."},
      {title:"Oxygen Scavengers",text:"Treatment chemicals used to reduce dissolved oxygen and help protect boiler and condensate systems from corrosion."},
      {title:"pH Control",text:"pH adjustment support to help maintain suitable water chemistry for boiler operation."},
      {title:"Dosing & Monitoring",text:"Chemical dosing systems and monitoring solutions to support controlled and consistent treatment."},
      {title:"On-Site Testing",text:"Boiler-water testing and analysis to identify treatment requirements and support informed recommendations."},
      {title:"Efficiency & Protection",text:"Recommendations aimed at improving boiler efficiency and reducing corrosion and scaling-related equipment issues."}
    ],
    applications:["Industrial boilers","Steam systems","Process plants","Manufacturing facilities","Utility plants","Commercial boiler rooms"]
  },
  "Seamless MS & SS Pipes and Fittings":{
    intro:"Project-specific supply of seamless Mild Steel and Stainless Steel pipes, fittings and piping accessories.",
    overview:"We source seamless MS and SS pipes and fittings in different schedules, grades, wall thicknesses and sizes according to approved drawings, BOQs and technical specifications. Supporting fittings can be supplied as part of the same requirement.",
    items:[
      {title:"Seamless MS Pipes",text:"Mild Steel seamless pipes for industrial, utility, fabrication and project piping applications."},
      {title:"Stainless Steel Pipes",text:"Stainless Steel seamless pipes for applications requiring corrosion resistance and suitable material performance."},
      {title:"Schedules & Sizes",text:"Multiple schedules, grades, wall thicknesses and nominal sizes sourced according to project requirements."},
      {title:"Flanges & Elbows",text:"Piping accessories including flanges and elbows selected according to size, rating and application."},
      {title:"Reducers & Tees",text:"Reducers, tees and related fittings for piping assemblies and plant maintenance requirements."},
      {title:"Specification-Based Procurement",text:"Supply coordinated against BOQs, drawings, material specifications and client-approved requirements."}
    ],
    applications:["Process piping","Utility lines","Industrial plants","Boiler systems","Water systems","Maintenance projects"]
  },
  "Wastewater Treatment Plant (WWTP) Supplies and Services":{
    intro:"Equipment, treatment chemicals and maintenance support for wastewater treatment plant operations.",
    overview:"NA Engineering Solutions supports WWTP requirements through equipment supply, treatment chemicals, maintenance assistance and technical coordination. Solutions are matched to the plant process, operating conditions and required treatment performance.",
    items:[
      {title:"Pumps & Blowers",text:"Supply of pumps and blowers for wastewater transfer, aeration and process support."},
      {title:"Diffusers & Dosing Systems",text:"Aeration diffusers and chemical dosing equipment for controlled treatment processes."},
      {title:"Treatment Chemicals",text:"Coagulants, flocculants, disinfectants and other process chemicals according to treatment requirements."},
      {title:"O&M Support",text:"Operation and maintenance support for existing WWTP equipment and process systems."},
      {title:"Troubleshooting",text:"Technical assistance for equipment and process issues affecting plant performance."},
      {title:"Performance Improvement",text:"Technical guidance to improve treatment performance and support compliance with applicable requirements."}
    ],
    applications:["Industrial effluent plants","Factories","Food processing","Pharmaceutical facilities","Commercial wastewater systems","Process industries"]
  },
  "HVAC Systems – Supplies and Services":{
    intro:"HVAC equipment, ducting, parts, installation and maintenance services for industrial and commercial facilities.",
    overview:"We support HVAC requirements from equipment and material supply through installation, maintenance and performance optimization. Scope can include ducting, ventilation, filtration, fresh-air and exhaust systems according to site requirements.",
    items:[
      {title:"Chillers, AHUs & FCUs",text:"Supply and support for chillers, air handling units, fan coil units and associated HVAC components."},
      {title:"Ducting & Insulation",text:"GI ducting, fabrication, insulation and associated accessories for air distribution systems."},
      {title:"Fresh Air & Exhaust",text:"Fresh-air systems, exhaust fans and ventilation arrangements for industrial and commercial environments."},
      {title:"HVAC Parts Supply",text:"Replacement filters, motors, belts, controls and other HVAC spare parts and accessories."},
      {title:"Preventive & Corrective Maintenance",text:"Planned servicing and corrective maintenance to improve reliability and reduce unexpected downtime."},
      {title:"Duct Cleaning & Optimization",text:"Duct cleaning, inspection and performance optimization for improved airflow and system operation."}
    ],
    applications:["Pharmaceutical facilities","Manufacturing plants","Packaging halls","Commercial buildings","Offices","Warehouses"]
  },
  "Waterproofing Solutions – Supplies and Services":{
    intro:"Waterproofing materials and application support for roofs, basements, water tanks and other moisture-sensitive areas.",
    overview:"We provide waterproof chemicals, coatings and membranes along with application support for new construction, rehabilitation and leakage rectification. The system is selected according to substrate, exposure, water pressure and service conditions.",
    items:[
      {title:"Roof Waterproofing",text:"Protective waterproofing systems for exposed and covered roofs, terraces and roof structures."},
      {title:"Basement Protection",text:"Waterproofing solutions for below-ground structures exposed to dampness and water ingress."},
      {title:"Water Tank Waterproofing",text:"Suitable waterproof coatings and treatment systems for water tanks and wet service areas."},
      {title:"Wet Area Protection",text:"Waterproofing for bathrooms, utility areas and other moisture-prone building spaces."},
      {title:"Leakage Rectification",text:"Inspection and repair support for leakage, seepage and moisture-related defects."},
      {title:"Long-Term Protection",text:"Surface preparation and protective systems selected for durable moisture resistance and service life."}
    ],
    applications:["Industrial roofs","Basements","Water tanks","Commercial buildings","Bathrooms and wet areas","Maintenance and rehabilitation"]
  },
  "Pumps, Valves, and Pneumatic Fittings":{
    intro:"Industrial pumps, process valves and pneumatic fittings supplied according to application, pressure, size and operating requirements.",
    overview:"We supply pumps, valves, pneumatic fittings, hoses and accessories for industrial process, utility and maintenance applications. Selection is coordinated around flow, pressure, media, connection type and operating conditions.",
    items:[
      {title:"Industrial Pumps",text:"Centrifugal, submersible and dosing pumps for process, utility, transfer and chemical dosing applications."},
      {title:"Process Valves",text:"Gate, globe, butterfly, check and ball valves for isolation, regulation and flow-control requirements."},
      {title:"Pneumatic Fittings",text:"Pneumatic fittings, hoses, regulators and accessories for compressed-air and automation applications."},
      {title:"Application Selection",text:"Technical selection support based on process requirements, pressure, flow, size and service conditions."},
      {title:"Replacement & Maintenance",text:"Replacement pumps, valves and fittings for plant maintenance and equipment restoration."},
      {title:"Project Procurement",text:"Sourcing coordinated with BOQs, approved specifications, drawings and project schedules."}
    ],
    applications:["Process plants","Water systems","Compressed-air systems","Manufacturing","Chemical handling","Industrial maintenance"]
  }
};
'''

if 'const specialistDetailData=' not in source:
    marker='function Logo(){'
    source=source.replace(marker, DETAIL_DATA+'\n'+marker, 1)

new_service_detail=r'''function ServiceDetail({service}){
  const data=specialistDetailData[service.title]||{
    intro:service.text,
    overview:"We provide practical engineering, supply, installation and maintenance support according to your site requirements, specifications and project scope.",
    items:(specialistDetailFeatures[service.title]||detailFeatures[service.title]||[]).map(x=>({title:x,text:"Supplied and supported according to customer specifications, site conditions and project requirements."})),
    applications:["Industrial facilities","Commercial facilities","Construction projects","Maintenance requirements"]
  };
  return <>
    <PageIntro eyebrow={`SERVICES / ${service.title.toUpperCase()}`} title={service.title}>{data.intro}</PageIntro>
    <main className="section section-light">
      <div className="container detail-grid">
        <img className="detail-image" src={img(service.image)} alt={`${service.title} professional service`} />
        <div>
          <SectionLabel>WHAT WE PROVIDE</SectionLabel>
          <h2>Professional supply, technical support and execution.</h2>
          <p>{data.overview}</p>
          <ul className="feature-list">{data.items.slice(0,6).map(x=><li key={x.title}><CheckCircle2 size={17}/>{x.title}</li>)}</ul>
          <div className="detail-actions"><Button to="/contact" testid={`service-detail-quote-${service.slug}`}>Request a Quote</Button></div>
        </div>
      </div>
      <div className="container specialist-detail-block">
        <SectionLabel>DETAILED SCOPE</SectionLabel>
        <div className="specialist-grid">
          {data.items.map((x,i)=><article className="specialist-card" key={x.title}>
            <span>{String(i+1).padStart(2,'0')}</span><h3>{x.title}</h3><p>{x.text}</p>
          </article>)}
        </div>
        <div className="detail-bottom-grid">
          <div><SectionLabel>APPLICATIONS</SectionLabel><h2>Where we support your requirement.</h2><div className="application-list">{data.applications.map(x=><span key={x}><CheckCircle2 size={16}/>{x}</span>)}</div></div>
          <div className="detail-callout"><span>NA ENGINEERING SOLUTIONS</span><h3>Requirement-based sourcing and dependable project support.</h3><p>Share your BOQ, drawing, specification or site requirement and our team can help define the right supply or service scope.</p><Button to="/contact" secondary testid={`service-detail-contact-${service.slug}`}>Discuss Your Requirement</Button></div>
        </div>
      </div>
    </main>
  </>
}'''

source,n=re.subn(r'function ServiceDetail\(\{service\}\)\{.*?\nfunction Supplies\(\)', new_service_detail+'\nfunction Supplies()', source, flags=re.S)
if n!=1:
    raise SystemExit(f"Could not replace ServiceDetail; matches={n}")

APP.write_text(source)

css=CSS.read_text()
CSS_ADD='''\n/* Detailed service pages */\n.detail-actions{display:flex;gap:12px;margin-top:28px}\n.specialist-detail-block{margin-top:105px}\n.specialist-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);margin-top:28px}\n.specialist-card{background:#fff;min-height:190px;padding:28px 25px;border:1px solid transparent;transition:transform .2s ease,box-shadow .2s ease}\n.specialist-card:hover{transform:translateY(-3px);box-shadow:0 14px 32px rgba(10,17,40,.08);position:relative;z-index:1}\n.specialist-card>span{color:var(--blue);font:700 11px Chivo;letter-spacing:.08em}\n.specialist-card h3{font-size:20px;line-height:1.15;margin:28px 0 10px}\n.specialist-card p{color:#627083;line-height:1.7;font-size:13px;margin:0}\n.detail-bottom-grid{display:grid;grid-template-columns:1fr 1fr;gap:70px;margin-top:80px;align-items:start}\n.detail-bottom-grid h2{font-size:clamp(30px,3.5vw,45px);line-height:1.08;letter-spacing:-.05em;margin:16px 0 25px}\n.application-list{display:grid;grid-template-columns:1fr 1fr;gap:12px}\n.application-list span{display:flex;align-items:center;gap:9px;color:#4c5b6b;font-size:13px;padding:12px 0;border-bottom:1px solid var(--line)}\n.application-list svg{color:var(--blue);flex:none}\n.detail-callout{background:var(--navy);color:#fff;padding:35px}\n.detail-callout>span{color:var(--amber);font-size:10px;font-weight:800;letter-spacing:.16em}\n.detail-callout h3{font-size:29px;line-height:1.15;margin:18px 0 12px}\n.detail-callout p{color:#bdc9d8;line-height:1.7;font-size:14px;margin-bottom:25px}\n@media(max-width:900px){.specialist-grid{grid-template-columns:1fr 1fr}.detail-bottom-grid{grid-template-columns:1fr;gap:45px}}\n@media(max-width:600px){.specialist-grid{grid-template-columns:1fr}.application-list{grid-template-columns:1fr}.specialist-detail-block{margin-top:70px}.detail-callout{padding:28px 22px}}\n'''
if '/* Detailed service pages */' not in css:
    CSS.write_text(css+CSS_ADD)

print('Applied dedicated detail pages for every service card, with detailed scope, applications and quote CTA.')
