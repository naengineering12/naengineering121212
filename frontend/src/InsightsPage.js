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
    sections: [
      { heading: "Start with a clear item description", paragraphs: ["Include the common item name and, where possible, the brand, model, part number, material, size, grade or technical specification. A description such as “bearing” may be too broad to identify the exact part."] },
      { heading: "Confirm quantities and units", paragraphs: ["List the quantity and unit for every line — for example, each, set, metre, litre, kilogram or box. If substitutions are acceptable, state that clearly instead of assuming the supplier will choose an alternative."] },
      { heading: "Share delivery and timing details", paragraphs: ["Mention the delivery site, required date, unloading or access restrictions and whether the order can be delivered in stages. These details help the supplier assess availability and logistics."] },
      { heading: "Include documents and compliance needs", paragraphs: ["If your site requires a datasheet, test certificate, warranty, country of origin, safety data sheet or approved brand, note it with the relevant line item. Attachments can be useful for drawings, photos and previous purchase-order references."] },
      { heading: "A quick send-before-you-submit checklist", bullets: ["Item description and specification confirmed", "Quantity and unit included for every item", "Approved make / model or acceptable alternative stated", "Delivery location and deadline provided", "Required certificates, warranty or datasheets mentioned", "A contact person is available for clarification"] }
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
    sections: [
      { heading: "Look for scope clarity", paragraphs: ["Ask whether the supplier can explain the proposed scope, exclusions, assumptions and handover requirements. Clear scope reduces the risk of missing materials or unexpected site work later."] },
      { heading: "Match the work to site conditions", paragraphs: ["Industrial environments have different access, shutdown, safety and operating constraints. Share site photos, equipment tags, dimensions, drawings and permit requirements before the quotation is finalised."] },
      { heading: "Review technical fit before price", paragraphs: ["Check specifications, materials, capacity, ratings, compatible parts and required documentation. The cheapest quote is not useful if an item does not fit the equipment or approved standard."] },
      { heading: "Agree delivery and communication", paragraphs: ["Confirm who will respond to technical questions, how changes are approved and how delivery or execution updates will be shared. For urgent requirements, ask for realistic availability rather than an unsupported promise."] },
      { heading: "Plan the after-delivery handover", paragraphs: ["For installation or maintenance work, confirm testing, commissioning, inspection notes, warranty terms and any recommended follow-up. For supplies, keep part numbers and documentation with your maintenance records."] }
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
    sections: [
      { heading: "Inspect filters and airflow", paragraphs: ["Check filter condition and replacement intervals, inspect accessible grilles and confirm that supply and return paths are not blocked. Abnormal noise or uneven airflow may need a qualified technician to investigate."] },
      { heading: "Check drainage and visible leaks", paragraphs: ["Inspect condensate drains, trays and nearby surfaces for blockages, standing water or signs of leakage. Follow site procedures before opening or servicing equipment."] },
      { heading: "Review operating condition", paragraphs: ["Record unusual noise, vibration, temperature variation, error indicators and cycling behaviour. Compare readings with the equipment's documented operating range instead of relying on guesswork."] },
      { heading: "Keep ductwork and equipment areas accessible", paragraphs: ["Look for visible damage, loose access panels and obstructions around air-handling equipment. Duct cleaning, refrigerant work and electrical maintenance should be carried out by appropriately trained personnel."] },
      { heading: "Keep a maintenance record", bullets: ["Date and equipment identification", "Filter and drain inspection notes", "Reported issues and any readings taken", "Parts replaced and technician observations", "Follow-up actions and next service date"] }
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
    sections: [
      { heading: "Define the use and clear dimensions", paragraphs: ["Confirm the intended use, building length and width, clear height, bay spacing, door openings, crane requirements and future expansion needs. These decisions affect the structural scheme and layout."] },
      { heading: "Coordinate loads and local conditions", paragraphs: ["The responsible designer should consider applicable wind, seismic, roof, equipment and imposed loads as well as the site's ground and environmental conditions. Do not rely on a generic structure without engineering review."] },
      { heading: "Coordinate foundations and drainage", paragraphs: ["Ensure that foundation design and anchor-bolt positions are coordinated with the structural design. Plan roof drainage, finished floor levels, access and water run-off before the site works progress."] },
      { heading: "Plan services and installation", paragraphs: ["Identify lighting, power, ventilation, fire protection, wall cladding, insulation and service penetrations early. Agree access, lifting equipment, installation sequence, work permits and inspection points before work begins."] }
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
    sections: [
      { heading: "Start with a documented risk assessment", paragraphs: ["Review the site's activities, combustible materials, electrical areas, storage layout, occupancy and access routes. Equipment selection and placement should be based on the hazard assessment and applicable local requirements."] },
      { heading: "Choose equipment for the actual hazard", paragraphs: ["Different fire classes and hazards require different equipment. Confirm extinguisher type, capacity, rating and placement with the responsible fire-safety professional rather than treating all extinguishers as interchangeable."] },
      { heading: "Keep access and signage clear", paragraphs: ["Ensure equipment is visible, accessible, correctly mounted and not blocked by stored goods or machinery. Emergency routes and signage should remain clear during normal operation."] },
      { heading: "Plan inspection and records", paragraphs: ["Assign responsibility for routine visual checks, scheduled servicing and record keeping. Damaged, discharged or overdue equipment should be referred for appropriate maintenance or replacement."] }
    ],
    related: [{ label: "Fire fighting equipment", href: "/services/fire-fighting-equipment" }, { label: "Contact our team", href: "/contact" }]
  }
];

function ArticleCard({ article }) {
  return <article className="insight-card">
    <div className="insight-card-top"><span>{article.category}</span><span><Clock3 size={13}/> {article.readTime}</span></div>
    <h2><Link to={`/insights/${article.slug}`}>{article.title}</Link></h2>
    <p>{article.excerpt}</p>
    <Link className="insight-read-link" to={`/insights/${article.slug}`}>Read practical guide <ArrowRight size={16}/></Link>
  </article>;
}

export function InsightsPreview() {
  return <section className="section insights-preview">
    <div className="site-container">
      <div className="section-heading">
        <div><span className="insight-eyebrow"><BookOpen size={14}/> FIELD NOTES / PRACTICAL GUIDES</span><h2>Useful notes for site and procurement teams.</h2></div>
        <Link className="insight-all-link" to="/insights">All insights <ArrowRight size={16}/></Link>
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
        <Link className="insight-back" to="/insights"><ArrowLeft size={15}/> All insights</Link>
        <span className="insight-eyebrow">{article.category} / PRACTICAL GUIDE</span>
        <h1>{article.title}</h1><p>{article.excerpt}</p>
        <span className="insight-read-time"><Clock3 size={14}/> {article.readTime}</span>
      </div></header>
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
    <header className="insights-index-hero"><div className="site-container"><span className="insight-eyebrow"><BookOpen size={14}/> INSIGHTS / FIELD NOTES</span><h1>Practical guides for engineering, maintenance and procurement.</h1><p>Checklists and straightforward guidance for industrial facilities, project teams and buyers. For a site-specific decision, confirm requirements with the responsible engineer or safety professional.</p></div></header>
    <section className="section"><div className="site-container"><div className="insight-card-grid">{insightArticles.map(article=><ArticleCard key={article.slug} article={article}/>)}</div><div className="insights-contact-cta"><div><span className="insight-eyebrow">HAVE A SPECIFIC REQUIREMENT?</span><h2>Let's discuss the scope before you commit.</h2></div><Link to="/contact">Contact NA Engineering <ArrowRight size={16}/></Link></div></div></section>
  </main>;
}
