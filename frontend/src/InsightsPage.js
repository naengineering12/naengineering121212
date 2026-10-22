import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3 } from "lucide-react";
import "./InsightsPage.css";

export const insightArticles = [
  {
    slug: "prepare-a-general-order-supply-request",
    category: "PROCUREMENT",
    title: "How to Prepare a Clear General Order Supply Request",
    description: "A practical checklist for preparing a general order supply request so a supplier can quote accurately and reduce follow-up questions.",
    excerpt: "A little detail up front can make procurement faster. Use this checklist before sending an item list to a general order supplier in Lahore.",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0478/1123/1902/files/contact_uip.png?v=1767893282&width=800",
    imageAlt: "Organized industrial spare parts and components on warehouse shelving",
    sections: [
      { heading: "Start with a clear item description", paragraphs: ["Include the common item name and, where possible, the brand, model, part number, material, size, grade or technical specification. A description such as “bearing” may be too broad to identify the exact part."] },
      { heading: "Confirm quantities and units", paragraphs: ["List the quantity and unit for every line — for example, each, set, metre, litre, kilogram or box. If substitutions are acceptable, state that clearly instead of assuming the supplier will choose an alternative."] },
      { heading: "Share delivery and timing details", paragraphs: ["Mention the delivery site, required date, unloading or access restrictions and whether the order can be delivered in stages. These details help the supplier assess availability and logistics."] },
      { heading: "Include documents and compliance needs", paragraphs: ["If your site requires a datasheet, test certificate, warranty, country of origin, safety data sheet or approved brand, note it with the relevant line item. Attachments can be useful for drawings, photos and previous purchase-order references."] },
      { heading: "A quick send-before-you-submit checklist", bullets: ["Item description and specification confirmed", "Quantity and unit included for every item", "Approved make / model or acceptable alternative stated", "Delivery location and deadline provided", "Required certificates, warranty or datasheets mentioned", "A contact person is available for clarification"] },
      {"heading":"Make quotations comparable","paragraphs":["When requesting prices from multiple suppliers, send the same specification, quantity, delivery location and required date to each one. Ask suppliers to state the offered brand or make, country of origin where relevant, availability, delivery lead time, warranty and any exclusions. This makes it easier to compare equivalent offers instead of comparing only the final price.","For technical items, ask for a datasheet or model reference before approving a substitute. Do not accept an alternative solely because its description looks similar; confirm compatibility with the responsible engineer or end user."]},
      {"heading":"Confirm the commercial and delivery details","paragraphs":["State whether the quotation should include delivery, installation, testing, taxes, documentation or other charges. Confirm the quotation validity period and the payment or purchase-order requirements used by your organization. These details help avoid misunderstandings after an offer is accepted.","Before issuing the purchase order, reconcile the final approved quotation against the requested quantities, unit of measure, rates, delivery point and promised schedule. Keep the request, quotation, approval and delivery record together for traceability."]},
      {"heading":"A practical RFQ email structure","bullets":["Subject line with the project/site and RFQ reference","Item list with specifications, quantities and units","Approved brands or rules for acceptable alternatives","Delivery address, access rules and required date","Required datasheets, certificates, warranty or inspection records","Quotation deadline and the contact person for technical questions"]}
    ],
    related: [{ label: "General Order Supplies", href: "/supplies" }, { label: "Contact our team", href: "/contact" }]
  },
  {
    slug: "industrial-maintenance-supplier-checklist",
    category: "MAINTENANCE",
    title: "Choosing an Industrial Maintenance and Supply Partner",
    description: "Key questions to ask when selecting an industrial maintenance and supply partner for a factory, warehouse or commercial facility.",
    excerpt: "The right partner should understand specifications, site conditions, safety rules, lead times and support after delivery — not just the lowest line price.",
    readTime: "5 min read",
    image: "https://wahaair.com/assets/img/services/mechanical-installation-services.webp",
    imageAlt: "Technicians inspecting industrial mechanical pipework and equipment",
    sections: [
      { heading: "Look for scope clarity", paragraphs: ["Ask whether the supplier can explain the proposed scope, exclusions, assumptions and handover requirements. Clear scope reduces the risk of missing materials or unexpected site work later."] },
      { heading: "Match the work to site conditions", paragraphs: ["Industrial environments have different access, shutdown, safety and operating constraints. Share site photos, equipment tags, dimensions, drawings and permit requirements before the quotation is finalised."] },
      { heading: "Review technical fit before price", paragraphs: ["Check specifications, materials, capacity, ratings, compatible parts and required documentation. The cheapest quote is not useful if an item does not fit the equipment or approved standard."] },
      { heading: "Agree delivery and communication", paragraphs: ["Confirm who will respond to technical questions, how changes are approved and how delivery or execution updates will be shared. For urgent requirements, ask for realistic availability rather than an unsupported promise."] },
      { heading: "Plan the after-delivery handover", paragraphs: ["For installation or maintenance work, confirm testing, commissioning, inspection notes, warranty terms and any recommended follow-up. For supplies, keep part numbers and documentation with your maintenance records."] },
      {"heading":"Separate preventive work from corrective work","paragraphs":["Ask the provider to distinguish routine inspections and servicing from repair work that depends on a fault being found. For each task, agree what is included, what counts as additional work, what approvals are required and how any unexpected issue will be reported.","For critical assets, discuss how urgent faults will be escalated, whether spare parts are available and what information the site team must provide to start troubleshooting. Avoid relying on a response-time promise until the coverage hours and exclusions are clear."]},
      {"heading":"Check safety, competence and records","paragraphs":["Before work begins, confirm site induction, permits, isolation or lockout requirements, personal protective equipment and supervision responsibilities. The facility should identify who authorizes the work and who accepts the equipment back into service.","A useful service record identifies the asset, date, work completed, parts used, observations, outstanding defects and the next action. These records help the facility track recurring faults, plan spares and decide when equipment needs further assessment."]},
      {"heading":"Supplier evaluation checklist","bullets":["Relevant experience with the equipment and operating environment","Clear scope, exclusions, deliverables and approval points","Technician competence and site safety arrangements","Realistic lead times for labour and replacement parts","Documented service reports, warranties and handover","A named contact and an agreed escalation route"]}
    ],
    related: [{ label: "Engineering services", href: "/services" }, { label: "Mechanical & electrical supplies", href: "/services/mechanical-electrical-supplies" }, { label: "Contact our team", href: "/contact" }]
  },
  {
    slug: "hvac-preventive-maintenance-checklist",
    category: "HVAC",
    title: "HVAC Preventive Maintenance: A Practical Facility Checklist",
    description: "A practical HVAC preventive maintenance checklist for commercial buildings, factories, packaging areas and other facilities.",
    excerpt: "Routine inspections help facilities teams spot airflow, filter, drainage and operating issues before they become disruptive. Use this checklist with the equipment manufacturer's instructions.",
    readTime: "5 min read",
    image: "https://quorvia-congo.com/assets/maintenance-climatisation-froid.webp",
    imageAlt: "HVAC technician checking an industrial cooling and refrigeration unit",
    sections: [
      { heading: "Inspect filters and airflow", paragraphs: ["Check filter condition and replacement intervals, inspect accessible grilles and confirm that supply and return paths are not blocked. Abnormal noise or uneven airflow may need a qualified technician to investigate."] },
      { heading: "Check drainage and visible leaks", paragraphs: ["Inspect condensate drains, trays and nearby surfaces for blockages, standing water or signs of leakage. Follow site procedures before opening or servicing equipment."] },
      { heading: "Review operating condition", paragraphs: ["Record unusual noise, vibration, temperature variation, error indicators and cycling behaviour. Compare readings with the equipment's documented operating range instead of relying on guesswork."] },
      { heading: "Keep ductwork and equipment areas accessible", paragraphs: ["Look for visible damage, loose access panels and obstructions around air-handling equipment. Duct cleaning, refrigerant work and electrical maintenance should be carried out by appropriately trained personnel."] },
      { heading: "Keep a maintenance record", bullets: ["Date and equipment identification", "Filter and drain inspection notes", "Reported issues and any readings taken", "Parts replaced and technician observations", "Follow-up actions and next service date"] },
      {"heading":"Use a repeatable inspection routine","paragraphs":["Keep a site-specific checklist for each unit or system. Record the asset tag, date, operating state, visible condition, filter status, drain condition, reported symptoms and corrective actions. Consistent records make gradual changes easier to spot than isolated verbal updates.","Follow the equipment manufacturer's guidance for inspection intervals and service limits. Filters, coils, belts, condensate drains, electrical terminals and refrigerant circuits do not all require the same skill level or maintenance frequency."]},
      {"heading":"Protect people and equipment before servicing","paragraphs":["Only appropriately trained personnel should perform tasks that expose them to electrical hazards, rotating equipment, pressurized refrigerant or elevated work. Follow site isolation procedures and use the specified protective equipment before opening panels or removing guards.","Stop and escalate when there is a burning smell, electrical damage, abnormal vibration, refrigerant concern, repeated trips or any unsafe access condition. Do not bypass a safety device or change operating settings to hide a fault."]},
      {"heading":"What a useful HVAC service record includes","bullets":["Unit identification, location and date of inspection","Filter, coil, drain and visible ductwork observations","Operating readings taken and the manufacturer's relevant range","Fault codes, unusual noise, leaks or repeat complaints","Work completed, parts replaced and items still outstanding","Responsible technician and next planned service date"]}
    ],
    related: [{ label: "HVAC supplies & services", href: "/services/hvac-supplies-services" }, { label: "Facility maintenance", href: "/services/utilities-facility-maintenance" }, { label: "Contact our team", href: "/contact" }]
  },
  {
    slug: "peb-project-planning-checklist",
    category: "CONSTRUCTION",
    title: "What to Confirm Before Starting a PEB Project",
    description: "A pre-engineered building planning checklist covering use, dimensions, loads, foundations, access, services and installation coordination.",
    excerpt: "Before a PEB shed or industrial steel structure moves to fabrication, align the site team, designer, supplier and installer on the critical project inputs.",
    readTime: "4 min read",
    image: "https://image.made-in-china.com/202f0j00YHVBUTMzOqbc/High-Quality-Pre-Engineered-Building-Steel-Warehouse-Steel-Frame-Structure-with-Galvanized-or-Painting.webp",
    imageAlt: "Steel frame erection for a pre-engineered warehouse building",
    sections: [
      { heading: "Define the use and clear dimensions", paragraphs: ["Confirm the intended use, building length and width, clear height, bay spacing, door openings, crane requirements and future expansion needs. These decisions affect the structural scheme and layout."] },
      { heading: "Coordinate loads and local conditions", paragraphs: ["The responsible designer should consider applicable wind, seismic, roof, equipment and imposed loads as well as the site's ground and environmental conditions. Do not rely on a generic structure without engineering review."] },
      { heading: "Coordinate foundations and drainage", paragraphs: ["Ensure that foundation design and anchor-bolt positions are coordinated with the structural design. Plan roof drainage, finished floor levels, access and water run-off before the site works progress."] },
      { heading: "Plan services and installation", paragraphs: ["Identify lighting, power, ventilation, fire protection, wall cladding, insulation and service penetrations early. Agree access, lifting equipment, installation sequence, work permits and inspection points before work begins."] },
      {"heading":"Freeze coordinated drawings before fabrication","paragraphs":["Establish a controlled set of structural drawings, dimensions, connection details and approved revisions. Coordinate doors, louvers, roof lights, cladding openings, equipment supports and service penetrations before fabrication begins; late changes can affect steel members, procurement and installation sequence.","Confirm who is responsible for design review, foundation information, anchor-bolt setting-out, shop drawings and approval of changes. Keep a written record of issued-for-construction drawings and any revisions that affect the site team."]},
      {"heading":"Align procurement, transport and installation","paragraphs":["Break the programme into design approval, material procurement, fabrication, delivery, foundations, erection, cladding and services coordination. Confirm access for trailers and cranes, unloading space, temporary storage and the sequence for bringing members to the work area.","Agree the responsibility for lifting equipment, temporary bracing, work-at-height controls, permits and inspection hold points. The erection method and structural stability during installation must be planned by competent professionals rather than improvised on site."]},
      {"heading":"Pre-start project coordination checklist","bullets":["Intended use, dimensions, clear height and future expansion needs confirmed","Design loads and site conditions reviewed by the responsible engineer","Foundation design and anchor-bolt layout coordinated","Approved drawings and revision control agreed","Roof drainage, utilities, fire protection and access openings coordinated","Transport, lifting, installation safety and inspection plan agreed","Scope, exclusions, testing and handover documents defined"]}
    ],
    related: [{ label: "PEB works", href: "/services/peb-works" }, { label: "Civil engineering", href: "/services/civil-engineering" }, { label: "Contact our team", href: "/contact" }]
  },
  {
    slug: "fire-safety-equipment-site-planning",
    category: "SAFETY",
    title: "Planning Fire Safety Equipment for a Commercial or Industrial Site",
    description: "Important considerations when reviewing fire safety equipment needs for a commercial building or industrial facility.",
    excerpt: "Equipment selection should follow a site's hazards, layout, applicable codes and assessment by a qualified fire-safety professional.",
    readTime: "4 min read",
    image: "https://deltahashim.com/images/sectors/Industrial-Facilities.jpeg",
    imageAlt: "Industrial fire safety installation and equipment in a facility",
    sections: [
      { heading: "Start with a documented risk assessment", paragraphs: ["Review the site's activities, combustible materials, electrical areas, storage layout, occupancy and access routes. Equipment selection and placement should be based on the hazard assessment and applicable local requirements."] },
      { heading: "Choose equipment for the actual hazard", paragraphs: ["Different fire classes and hazards require different equipment. Confirm extinguisher type, capacity, rating and placement with the responsible fire-safety professional rather than treating all extinguishers as interchangeable."] },
      { heading: "Keep access and signage clear", paragraphs: ["Ensure equipment is visible, accessible, correctly mounted and not blocked by stored goods or machinery. Emergency routes and signage should remain clear during normal operation."] },
      { heading: "Plan inspection and records", paragraphs: ["Assign responsibility for routine visual checks, scheduled servicing and record keeping. Damaged, discharged or overdue equipment should be referred for appropriate maintenance or replacement."] },
      {"heading":"Match equipment to the actual risk","paragraphs":["Map the activities, storage areas, electrical installations, process hazards, occupancy and access routes before deciding what protection is required. Fire classes, suitable extinguishing media, equipment ratings and placement need to be assessed against the site's hazards and applicable local requirements.","Portable extinguishers are only one element of a fire protection plan. Depending on the building and hazard assessment, the plan may also need detection and alarm, emergency lighting, hydrants, sprinklers, suppression systems, signage and unobstructed escape routes."]},
      {"heading":"Make the plan workable for site teams","paragraphs":["Place equipment so it can be found and reached without creating a new hazard. Keep access to extinguishers, alarm call points, hose reels, exits and fire doors clear of stored materials and temporary work. Changes to the site layout should trigger a review of equipment access and signage.","Make sure staff and contractors know how to raise an alarm, report a hazard and follow the evacuation procedure. Practical training, clear responsibilities and drills are important; people should not attempt to fight a fire unless they are trained, it is safe to do so and the site procedure permits it."]},
      {"heading":"Schedule inspections and keep records","paragraphs":["Assign responsibility for routine visual checks, scheduled servicing and keeping inspection records. Follow the manufacturer's instructions and the schedule required by the site's safety plan and applicable regulations. Damaged, discharged, inaccessible or overdue equipment should be reported and addressed promptly.","Keep records of equipment locations and identification, inspection dates, service findings, corrective actions, training and any system impairment. If a fire system must be taken out of service, follow the facility's formal impairment and notification procedure."]},
      {"heading":"Before approving the site plan","bullets":["Documented hazard assessment and site layout reviewed","Equipment type, rating and location checked by a qualified fire-safety professional","Escape routes, signage and emergency access kept clear","Inspection, servicing and defect-reporting responsibilities assigned","Staff and contractor emergency instructions communicated","Required approvals and records kept available for review"]}
    ],
    related: [{ label: "Fire fighting equipment", href: "/services/fire-fighting-equipment" }, { label: "Contact our team", href: "/contact" }]
  }
];

function ArticleCard({ article }) {
  return <article className="insight-card">
    <Link className="insight-card-image-link" to={`/insights/${article.slug}`} aria-label={`Read: ${article.title}`}>
      <img className="insight-card-image" src={article.image} alt={article.imageAlt} loading="lazy" decoding="async" />
      <span className="insight-card-image-label">FIELD GUIDE <ArrowRight size={14}/></span>
    </Link>
    <div className="insight-card-content">
      <div className="insight-card-top"><span>{article.category}</span><span><Clock3 size={13}/> {article.readTime}</span></div>
      <h2><Link to={`/insights/${article.slug}`}>{article.title}</Link></h2>
      <p>{article.excerpt}</p>
      <Link className="insight-read-link" to={`/insights/${article.slug}`}>Read article <ArrowRight size={16}/></Link>
    </div>
  </article>;
}

export function InsightsPreview() {
  return <section className="section insights-preview">
    <div className="site-container">
      <div className="section-heading">
        <div><span className="insight-eyebrow"><BookOpen size={14}/> FIELD NOTES / PRACTICAL GUIDES</span><h2>Useful notes for site and procurement teams.</h2></div>
        <Link className="insight-all-link" to="/insights">All blog posts <ArrowRight size={16}/></Link>
      </div>
      <div className="insight-card-grid">{insightArticles.slice(0,3).map(article=><ArticleCard key={article.slug} article={article}/>)}</div>
    </div>
  </section>;
}

export default function InsightsPage() {
  const { slug } = useParams();
  if (slug) {
    const article = insightArticles.find(item => item.slug === slug);
    if (!article) return <Navigate to="/insights" replace />;
    return <main className="insight-article-page">
      <header className="insight-article-hero"><div className="site-container">
        <Link className="insight-back" to="/insights"><ArrowLeft size={15}/> Back to Blog</Link>
        <span className="insight-eyebrow">{article.category} / PRACTICAL GUIDE</span>
        <h1>{article.title}</h1><p>{article.description}</p>
        <div className="insight-article-meta"><span><BookOpen size={14}/> NA Engineering Solutions</span><span><Clock3 size={14}/> {article.readTime}</span><span>Updated October 2026</span></div>
      </div></header>
      <div className="site-container">
        <figure className="insight-article-cover">
          <img src={article.image} alt={article.imageAlt} loading="eager" decoding="async" />
          <figcaption>{article.imageAlt}</figcaption>
        </figure>
      </div>
      <div className="site-container insight-article-layout">
        <article className="insight-article-body">
          {article.sections.map((section,index)=><section key={section.heading}><h2>{section.heading}</h2>{(section.paragraphs||[]).map((para,i)=><p key={i}>{para}</p>)}{section.bullets&&<ul>{section.bullets.map(item=><li key={item}><CheckCircle2 size={17}/><span>{item}</span></li>)}</ul>}</section>)}
          <div className="insight-related"><h2>Related services</h2><div>{article.related.map(item=><Link key={item.href} to={item.href}>{item.label}<ArrowRight size={15}/></Link>)}</div></div>
        </article>
        <aside className="insight-aside"><span>NA ENGINEERING SOLUTIONS</span><h2>Planning a requirement?</h2><p>Share your scope, specifications or site details with our team to discuss the next practical step.</p><Link to="/contact">Contact our team <ArrowRight size={16}/></Link><Link to="/supplies">General Order Supplies <ArrowRight size={16}/></Link><Link to="/services">Engineering services <ArrowRight size={16}/></Link></aside>
      </div>
    </main>;
  }
  return <main className="insights-index-page">
    <header className="insights-index-hero"><div className="site-container insights-index-hero-grid">
    <div className="insights-index-hero-copy">
      <span className="insight-eyebrow"><BookOpen size={14}/> NA ENGINEERING SOLUTIONS / BLOG</span>
      <h1>Practical knowledge for better project decisions.</h1>
      <p>Clear, useful guides for industrial procurement, facility maintenance, HVAC systems, steel building projects and fire safety. Built for buyers, facility teams and project professionals who need the right questions before work begins.</p>
      <div className="insights-hero-points"><span>Procurement checklists</span><span>Maintenance guidance</span><span>Project planning</span></div>
    </div>
    <div className="insights-index-hero-visual">
      <img src="https://wahaair.com/assets/img/services/mechanical-installation-services.webp" alt="Industrial engineers coordinating mechanical equipment and pipework" loading="eager" decoding="async"/>
      <div className="insights-hero-image-caption"><span>FIELD NOTES / 01</span><strong>Engineering. Supply. Execution.</strong></div>
    </div>
  </div></header>
    <section className="section insights-blog-listing"><div className="site-container"><div className="insights-listing-heading"><div><span className="insight-eyebrow">THE KNOWLEDGE DESK</span><h2>Guides for the work you do every day.</h2></div><p>Browse practical notes, planning prompts and checklists. Always validate project-specific design, safety and compliance decisions with the responsible qualified professional.</p></div><div className="insight-card-grid">{insightArticles.map(article=><ArticleCard key={article.slug} article={article}/>)}</div><div className="insights-contact-cta"><div><span className="insight-eyebrow">HAVE A SPECIFIC REQUIREMENT?</span><h2>Let's discuss the scope before you commit.</h2></div><Link to="/contact">Contact NA Engineering <ArrowRight size={16}/></Link></div></div></section>
  </main>;
}
