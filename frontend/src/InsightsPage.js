import React, { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, Search, Share2 } from "lucide-react";
import "./InsightsPage.css";

export const insightArticles = [
  {
    slug: "prepare-a-general-order-supply-request",
    category: "PROCUREMENT",
    title: "How to Prepare a General Order Supply Request",
    seoTitle: "General Order Supply Request | NA Engineering Solutions",
    description: "Prepare a clear general order supply request with item specifications, quantities, approved alternatives and delivery details so suppliers can quote accurately.",
    excerpt: "Good procurement starts with a clear request. Share the exact item details, quantities, acceptable brands and delivery needs before asking suppliers to quote.",
    readTime: "4 min read",
    image: "https://images.pexels.com/photos/37912780/pexels-photo-37912780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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
    title: "How to Choose an Industrial Maintenance Partner",
    seoTitle: "Industrial Maintenance Partner | NA Engineering Solutions",
    description: "Use this checklist to assess an industrial maintenance partner's technical fit, site safety, response times, spare-parts support and service records.",
    excerpt: "A reliable maintenance partner needs to understand your equipment, site rules and operating priorities—not simply offer the lowest price.",
    readTime: "5 min read",
    image: "https://images.pexels.com/photos/4483773/pexels-photo-4483773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imageAlt: "Industrial warehouse aisle with stocked shelves and organized materials",
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
    title: "HVAC Preventive Maintenance Checklist for Facilities",
    seoTitle: "HVAC Maintenance Checklist | NA Engineering Solutions",
    description: "Use a practical HVAC maintenance checklist for filters, airflow, drains, operating checks and service records in commercial and industrial facilities.",
    excerpt: "Routine checks of filters, airflow, drains and operating conditions help facility teams spot issues early and plan maintenance before disruption occurs.",
    readTime: "5 min read",
    image: "https://images.pexels.com/photos/32497161/pexels-photo-32497161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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
    title: "PEB Project Planning: What to Confirm Before Fabrication",
    seoTitle: "PEB Project Planning Checklist | NA Engineering Solutions",
    description: "Plan a pre-engineered building project by confirming dimensions, loads, foundations, drawings, services, delivery sequence and safe installation before fabrication.",
    excerpt: "Before steel fabrication starts, align the owner, designer, supplier and installer on site conditions, dimensions, foundations and the installation sequence.",
    readTime: "4 min read",
    image: "https://images.pexels.com/photos/7961889/pexels-photo-7961889.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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
    title: "Fire Safety Equipment Planning for Industrial Sites",
    seoTitle: "Fire Safety Equipment Planning | NA Engineering Solutions",
    description: "Review fire safety equipment for industrial and commercial sites, including hazard assessment, suitable equipment, clear access, inspections and staff training.",
    excerpt: "Fire protection should match the site's actual hazards. Review equipment needs, access routes and inspection responsibilities with a qualified fire-safety professional.",
    readTime: "4 min read",
    image: "https://images.pexels.com/photos/19143940/pexels-photo-19143940.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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
  },
  {
    slug: "industrial-electrical-maintenance-checklist",
    category: "ELECTRICAL",
    title: "Industrial Electrical Maintenance: A Safe Inspection Checklist",
    seoTitle: "Electrical Maintenance Checklist | NA Engineering Solutions",
    description: "Plan safer electrical maintenance with asset records, visible checks, qualified testing, isolation procedures and documented follow-up for each finding.",
    excerpt: "A consistent inspection process helps teams record warning signs, arrange qualified testing and close out electrical maintenance actions safely.",
    readTime: "6 min read",
    image: "https://images.pexels.com/photos/33531833/pexels-photo-33531833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imageAlt: "Industrial technician inspecting an electrical control panel",
    sections: [
      { heading: "Start with asset identification and history", paragraphs: ["List the equipment covered by the inspection, including distribution boards, control panels, motors, isolators and critical loads. Use the site's asset tags and drawings so findings can be traced to the correct equipment.", "Review previous faults, nuisance trips, repairs, load changes and outstanding recommendations before planning the visit. A repeated fault should be investigated rather than treated as a new isolated event each time."] },
      { heading: "Make the work area safe before inspection", paragraphs: ["Electrical inspection and testing must be planned and performed by appropriately qualified personnel under the site's permit, isolation and lockout procedures. Verify the required safe state before opening equipment or touching conductors, and use the specified personal protective equipment.", "Do not open or work on energized panels unless the task has been specifically assessed and authorized under the facility's electrical safety procedure. If access, isolation or equipment condition is uncertain, stop and escalate to the responsible electrical professional."] },
      { heading: "Record visible warning signs", paragraphs: ["From a safe position, note damaged enclosures, missing covers, blocked access, water ingress, corrosion, discoloration, unusual smell, excessive noise or evidence of overheating. These observations are not a substitute for electrical testing, but they can identify conditions requiring prompt professional assessment.", "Check that panel labels, circuit identification and warning signs remain legible. Clear labelling supports safer maintenance and helps future teams confirm which equipment and circuits are involved."] },
      { heading: "Plan qualified testing and corrective work", paragraphs: ["Testing, torque checks, thermal inspection, protective-device verification and earthing checks should follow the equipment manufacturer's instructions, the applicable standards and the facility's maintenance plan. The qualified person should select the method and acceptance criteria for the equipment concerned.", "Record any parts replaced, adjustments made, test results and unresolved limitations. Protective devices must never be bypassed simply to keep a process running; investigate the cause of a trip or abnormal reading."] },
      { heading: "Close out findings and follow-up", paragraphs: ["Give each finding an owner, priority and due date. Distinguish urgent safety concerns from routine work so that critical defects are not lost in a general maintenance list.", "After approved work is complete, update the asset history and drawings where required, record the return-to-service approval and communicate any temporary restrictions to operations."] },
      { heading: "Electrical inspection record checklist", bullets: ["Asset tag, location, panel or equipment reference recorded", "Previous faults and outstanding actions reviewed", "Site permit, isolation and access requirements confirmed", "Visible damage, obstruction, moisture or overheating signs documented", "Qualified testing and corrective actions recorded", "Parts, test results, approvals and outstanding restrictions noted", "Owner and due date assigned for every follow-up action"] }
    ],
    related: [{ label: "Electrical works", href: "/services/electrical-works" }, { label: "Mechanical & electrical supplies", href: "/services/mechanical-electrical-supplies" }, { label: "Contact our team", href: "/contact" }]
  },
  {
    slug: "industrial-spare-parts-inventory-planning",
    category: "INVENTORY",
    title: "How to Plan Critical Industrial Spare Parts",
    seoTitle: "Industrial Spare Parts Planning | NA Engineering Solutions",
    description: "Identify critical industrial spares, verify part numbers, set replenishment points and coordinate supplier lead times to avoid preventable downtime.",
    excerpt: "A useful spare-parts plan balances equipment criticality, supplier lead times, storage conditions and accurate inventory records.",
    readTime: "6 min read",
    image: "https://images.pexels.com/photos/7568418/pexels-photo-7568418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imageAlt: "Industrial mechanical spare parts arranged for inspection and maintenance",
    sections: [
      { heading: "Identify which assets matter most", paragraphs: ["Start with a list of the equipment that supports production, utilities, safety and essential building services. For each asset, consider the operational impact of failure, the availability of a backup and the likely time required to repair or replace it.", "Criticality should guide stocking decisions. A low-cost part can be highly important if its absence stops a line or utility, while an expensive component may not need to be held if a reliable alternative or short lead time exists."] },
      { heading: "Build an accurate item master", paragraphs: ["Record a clear description, manufacturer, model or part number, dimensions, material or rating where applicable, unit of measure, equipment references and approved substitutes. Use photographs or datasheets where they help distinguish similar-looking items.", "Avoid creating duplicate inventory records for the same part under different names. Incorrect descriptions and untracked substitutions can result in a stock balance that looks healthy but cannot meet the maintenance need."] },
      { heading: "Use lead time and usage to set stock levels", paragraphs: ["Review historic consumption, planned maintenance, shutdown schedules, minimum order quantities and supplier lead times. A practical replenishment trigger should give the buyer enough time to order and receive the part before it is likely to be required.", "Set min/max or reorder points for suitable items and review them after a major equipment change, supplier delay, change in consumption or stock-out. Avoid treating a single rule as appropriate for every spare."] },
      { heading: "Keep storage and traceability under control", paragraphs: ["Store parts according to the manufacturer's requirements and site conditions. Protect items from moisture, contamination, damage and mix-ups; retain packaging, labels, batch details and certificates when traceability matters.", "Use a documented process for receipts, issues, returns and obsolete stock. For safety-critical or regulated components, confirm the source and technical documentation before the item is released for use."] },
      { heading: "Coordinate inventory with procurement", paragraphs: ["Share the approved specification, required delivery date and acceptable makes with suppliers. Confirm actual availability, delivery lead time, warranty and documentation rather than assuming a catalogue listing means the item is ready to ship.", "For shutdowns or planned work, link the material list to the job plan and check availability before the maintenance window is confirmed. This reduces last-minute sourcing and avoidable schedule risk."] },
      { heading: "Critical spares planning checklist", bullets: ["Equipment criticality and backup availability reviewed", "Correct part numbers, specifications and units verified", "Historic usage, lead times and maintenance plans considered", "Reorder triggers and approval limits documented", "Storage conditions, labelling and issue records maintained", "Approved alternatives and technical documents reviewed", "Obsolete stock and recurring stock-outs reviewed regularly"] }
    ],
    related: [{ label: "General Order Supplies", href: "/supplies" }, { label: "Mechanical & electrical supplies", href: "/services/mechanical-electrical-supplies" }, { label: "Contact our team", href: "/contact" }]
  },
  {
    slug: "compare-industrial-supplier-quotations",
    category: "PROCUREMENT",
    title: "How to Compare Industrial Supplier Quotations",
    seoTitle: "Industrial Supplier Quote Comparison | NA Engineering",
    description: "Compare industrial supplier quotations by technical compliance, delivery, warranty, documentation and total evaluated cost—not just the headline price.",
    excerpt: "The lowest quotation is not always the best value. Compare each supplier's offer against the same specification, delivery scope and commercial terms.",
    readTime: "5 min read",
    image: "https://images.pexels.com/photos/4484154/pexels-photo-4484154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imageAlt: "Warehouse employee checking stock and inventory with a handheld scanner",
    sections: [
      { heading: "Issue the same scope to every supplier", paragraphs: ["Use the same item description, brand or approved equivalent, technical specification, quantity, unit of measure, delivery location and required date for each quotation request. If the scope differs, the resulting prices are not directly comparable.", "Attach drawings, photographs, datasheets or previous part references where needed. Ask suppliers to list any assumptions or information they still require before they can confirm compliance."] },
      { heading: "Check technical compliance first", paragraphs: ["Compare the offered make, model, capacity, material, dimensions, rating and relevant certificates against the request. Mark each line as compliant, requiring clarification or proposed as an alternative instead of silently accepting a similar description.", "For critical equipment and safety-related items, send deviations to the responsible engineer, end user or safety professional for written review before an award is made. Procurement should not decide technical equivalence on price alone."] },
      { heading: "Normalize the commercial offer", paragraphs: ["Check whether delivery, installation, commissioning, testing, packaging, taxes, freight and documentation are included or excluded. Note the quotation validity, payment terms, warranty conditions and any minimum order requirement.", "A comparison sheet should show the total like-for-like evaluated cost as well as the original quoted amount. Record any assumptions used in that comparison so an approver can follow the decision."] },
      { heading: "Validate availability and delivery commitments", paragraphs: ["Ask whether stock is physically available, whether the order is subject to confirmation, and what lead time applies after purchase-order acceptance. For partial deliveries, identify which items can arrive first and how that affects the job plan.", "For urgent or shutdown-related orders, agree the date, delivery point, access instructions and escalation contact. Keep supplier promises in writing and communicate risks early if the schedule changes."] },
      { heading: "Create an auditable award recommendation", paragraphs: ["Summarize technical compliance, evaluated cost, lead time, warranty, documentation, deviations and open clarifications. Explain why the recommended offer represents the best fit for the requirement rather than simply selecting the lowest line total.", "Keep the request for quotation, supplier responses, clarifications, approvals, purchase order and delivery records together. A consistent record supports later queries and helps improve future sourcing decisions."] },
      { heading: "Quotation comparison checklist", bullets: ["Identical item scope and quantities sent to suppliers", "Brand, model and specification compliance checked line by line", "Deviations and substitutions reviewed by the right technical owner", "Freight, tax, installation and other exclusions normalized", "Stock status, realistic lead time and validity confirmed", "Warranty and required datasheets or certificates reviewed", "Award rationale and approvals recorded before order placement"] }
    ],
    related: [{ label: "General Order Supplies", href: "/supplies" }, { label: "Engineering services", href: "/services" }, { label: "Contact our team", href: "/contact" }]
  },
];

function ArticleCard({ article }) {
  return <article className="insight-card">
    <Link className="insight-card-image-link" to={`/blog/${article.slug}`} aria-label={`Read: ${article.title}`}>
      <img className="insight-card-image" src={article.image} alt={article.imageAlt} loading="lazy" decoding="async" />
      <span className="insight-card-image-label">FIELD GUIDE <ArrowRight size={14}/></span>
    </Link>
    <div className="insight-card-content">
      <div className="insight-card-top"><span>{article.category}</span><span><Clock3 size={13}/> {article.readTime}</span></div>
      <h2><Link to={`/blog/${article.slug}`}>{article.title}</Link></h2>
      <p>{article.excerpt}</p>
      <Link className="insight-read-link" to={`/blog/${article.slug}`}>Read article <ArrowRight size={16}/></Link>
    </div>
  </article>;
}

export function InsightsPreview() {
  return <section className="section insights-preview">
    <div className="site-container">
      <div className="section-heading">
        <div><span className="insight-eyebrow"><BookOpen size={14}/> FIELD NOTES / PRACTICAL GUIDES</span><h2>Useful notes for site and procurement teams.</h2></div>
        <Link className="insight-all-link" to="/blog">All blog posts <ArrowRight size={16}/></Link>
      </div>
      <div className="insight-card-grid">{insightArticles.slice(0,3).map(article=><ArticleCard key={article.slug} article={article}/>)}</div>
    </div>
  </section>;
}

function sectionId(heading) {
  return String(heading)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ArticleShareLinks({ article }) {
  const url = "https://www.naengineeringsolutions.com/blog/" + article.slug;
  const shareText = article.title + " — NA Engineering Solutions";
  return (
    <div className="blog-share-links" aria-label="Share this article">
      <a href={"https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url)} target="_blank" rel="noreferrer">
        Share on LinkedIn <Share2 size={14}/>
      </a>
      <a href={"https://wa.me/?text=" + encodeURIComponent(shareText + " " + url)} target="_blank" rel="noreferrer">
        Share on WhatsApp <Share2 size={14}/>
      </a>
      <a href={"mailto:?subject=" + encodeURIComponent(shareText) + "&body=" + encodeURIComponent(url)}>
        Email article <ArrowRight size={14}/>
      </a>
    </div>
  );
}

function RelatedArticles({ article }) {
  const sameCategory = insightArticles.filter((item) => item.slug !== article.slug && item.category === article.category);
  const others = insightArticles.filter((item) => item.slug !== article.slug && item.category !== article.category);
  const related = [...sameCategory, ...others].slice(0, 3);
  if (!related.length) return null;

  return (
    <section className="blog-related-section">
      <div className="site-container">
        <div className="blog-section-heading">
          <div>
            <span className="insight-eyebrow">KEEP EXPLORING</span>
            <h2>Related engineering guides</h2>
          </div>
          <Link className="insight-all-link" to="/blog">All blog articles <ArrowRight size={16}/></Link>
        </div>
        <div className="insight-card-grid">
          {related.map((item) => <ArticleCard key={item.slug} article={item}/>)}
        </div>
      </div>
    </section>
  );
}

export default function InsightsPage() {
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const categories = ["ALL", ...new Set(insightArticles.map((article) => article.category))];

  if (slug) {
    const article = insightArticles.find((item) => item.slug === slug);
    if (!article) return <Navigate to="/blog" replace />;

    return (
      <main className="insight-article-page">
        <header className="insight-article-hero">
          <div className="site-container">
            <Link className="insight-back" to="/blog"><ArrowLeft size={15}/> Back to Blog</Link>
            <span className="insight-eyebrow">{article.category} / PRACTICAL GUIDE</span>
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <div className="insight-article-meta">
              <span><BookOpen size={14}/> NA Engineering Solutions Editorial Team</span>
              <span><Clock3 size={14}/> {article.readTime}</span>
              <span>{article.sections.length} sections</span>
            </div>
          </div>
        </header>

        <div className="site-container">
          <figure className="insight-article-cover">
            <img src={article.image} alt={article.imageAlt} loading="eager" decoding="async" />
          </figure>
        </div>

        <div className="site-container insight-article-layout">
          <article className="insight-article-body">
            <p className="blog-article-intro">{article.excerpt}</p>
            <div className="blog-article-actions">
              <span>Share this guide</span>
              <ArticleShareLinks article={article}/>
            </div>
            <div className="blog-guide-note">
              <strong>In this guide</strong>
              <p>Practical points to help your team prepare, ask the right questions and coordinate the next step. Project-specific engineering, safety and compliance decisions should be confirmed with the responsible qualified professional.</p>
            </div>
            {article.sections.map((section) => (
              <section id={sectionId(section.heading)} key={section.heading}>
                <h2>{section.heading}</h2>
                {(section.paragraphs || []).map((para, index) => <p key={index}>{para}</p>)}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((item) => <li key={item}><CheckCircle2 size={17}/><span>{item}</span></li>)}
                  </ul>
                )}
              </section>
            ))}
            <div className="blog-article-endnote">
              <span className="insight-eyebrow">NEED HELP WITH A LIVE REQUIREMENT?</span>
              <h2>Discuss your specifications with our team.</h2>
              <p>Share your item list, drawings, dimensions or site requirements so the scope can be reviewed before the next step.</p>
              <Link to="/contact" className="blog-contact-link">Contact NA Engineering Solutions <ArrowRight size={16}/></Link>
            </div>
          </article>

          <aside className="insight-aside blog-article-aside">
            <span>IN THIS GUIDE</span>
            <nav aria-label="Article contents" className="blog-table-of-contents">
              {article.sections.map((section) => (
                <a key={section.heading} href={"#" + sectionId(section.heading)}>{section.heading}<ArrowRight size={13}/></a>
              ))}
            </nav>
            <div className="blog-aside-cta">
              <span>NA ENGINEERING SOLUTIONS</span>
              <h2>Planning a requirement?</h2>
              <p>Share your scope, specifications or site details with our team to discuss a practical next step.</p>
              <Link to="/contact">Contact our team <ArrowRight size={16}/></Link>
              <Link to="/supplies">General Order Supplies <ArrowRight size={16}/></Link>
              <Link to="/services">Engineering services <ArrowRight size={16}/></Link>
            </div>
          </aside>
        </div>
        <RelatedArticles article={article}/>
      </main>
    );
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredArticles = insightArticles.filter((article) => {
    const matchesCategory = activeCategory === "ALL" || article.category === activeCategory;
    const searchableContent = [
      article.title,
      article.category,
      article.description,
      article.excerpt,
      ...article.sections.flatMap((section) => [
        section.heading,
        ...(section.paragraphs || []),
        ...(section.bullets || [])
      ])
    ].join(" ").toLowerCase();
    return matchesCategory && (!normalizedSearch || searchableContent.includes(normalizedSearch));
  });
  const featuredArticle = insightArticles[0];

  return (
    <main className="insights-index-page">
      <header className="insights-index-hero">
        <div className="site-container insights-index-hero-grid">
          <div className="insights-index-hero-copy">
            <span className="insight-eyebrow"><BookOpen size={14}/> NA ENGINEERING SOLUTIONS / BLOG</span>
            <h1>Engineering &amp; Procurement Guides for Real-World Projects</h1>
            <p>Explore practical guidance on industrial procurement, HVAC maintenance, steel building projects and fire safety. Each guide gives buyers, facility teams and project professionals clear questions and checklists to plan their next step with confidence.</p>
            <div className="insights-hero-points"><span>Procurement checklists</span><span>Maintenance guidance</span><span>Project planning</span></div>
            <a className="blog-hero-button" href="#blog-library">Explore all guides <ArrowRight size={16}/></a>
          </div>
          <div className="insights-index-hero-visual">
            <img src="https://images.pexels.com/photos/10202865/pexels-photo-10202865.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Industrial engineers coordinating mechanical equipment and pipework" loading="eager" decoding="async"/>
            <div className="insights-hero-image-caption"><span>FIELD NOTES / 01</span><strong>Engineering. Supply. Execution.</strong></div>
          </div>
        </div>
      </header>

      <section className="blog-featured-section">
        <div className="site-container">
          <div className="blog-featured-card">
            <Link className="blog-featured-image" to={"/blog/" + featuredArticle.slug} aria-label={"Read " + featuredArticle.title}>
              <img src={featuredArticle.image} alt={featuredArticle.imageAlt} loading="lazy" decoding="async"/>
            </Link>
            <div className="blog-featured-content">
              <span className="blog-featured-kicker"><span className="blog-featured-dot"/> FEATURED FIELD GUIDE</span>
              <span className="blog-featured-category">{featuredArticle.category} <span>•</span> {featuredArticle.readTime}</span>
              <h2><Link to={"/blog/" + featuredArticle.slug}>{featuredArticle.title}</Link></h2>
              <p>{featuredArticle.excerpt}</p>
              <Link className="insight-read-link" to={"/blog/" + featuredArticle.slug}>Read featured guide <ArrowRight size={16}/></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section insights-blog-listing" id="blog-library">
        <div className="site-container">
          <div className="insights-listing-heading">
            <div><span className="insight-eyebrow">THE KNOWLEDGE DESK</span><h2>Guides for the work you do every day.</h2></div>
            <p>Browse practical notes, planning prompts and checklists. Always validate project-specific design, safety and compliance decisions with the responsible qualified professional.</p>
          </div>

          <div className="blog-library-tools">
            <label className="blog-search-field">
              <Search size={18} aria-hidden="true"/>
              <span className="sr-only">Search blog articles</span>
              <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search procurement, HVAC, maintenance..." aria-label="Search blog articles"/>
              {searchTerm && <button type="button" onClick={() => setSearchTerm("")} aria-label="Clear search">Clear</button>}
            </label>
            <span className="blog-results-count">{filteredArticles.length} of {insightArticles.length} guides</span>
          </div>

          <div className="blog-category-filter" role="group" aria-label="Filter blog articles by topic">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={activeCategory === category ? "blog-category-chip is-active" : "blog-category-chip"}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >{category === "ALL" ? "All topics" : category}</button>
            ))}
          </div>

          {filteredArticles.length ? (
            <div className="insight-card-grid">
              {filteredArticles.map((article) => <ArticleCard key={article.slug} article={article}/>)}
            </div>
          ) : (
            <div className="blog-empty-state">
              <Search size={24}/>
              <h3>No guides match your search</h3>
              <p>Try a different keyword or choose another topic.</p>
              <button type="button" onClick={() => { setSearchTerm(""); setActiveCategory("ALL"); }}>Show all guides</button>
            </div>
          )}

          <div className="insights-contact-cta">
            <div><span className="insight-eyebrow">HAVE A SPECIFIC REQUIREMENT?</span><h2>Let's discuss the scope before you commit.</h2></div>
            <Link to="/contact">Contact NA Engineering <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
