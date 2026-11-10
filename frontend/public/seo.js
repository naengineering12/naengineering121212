(function () {
  const SITE = 'https://www.naengineeringsolutions.com';
  const DEFAULT = {
    title: 'Engineering Company in Lahore | NA Engineering Solutions',
    description: 'Lahore-based engineering company and general order supplier providing industrial supplies, engineering services, maintenance and project support for businesses across Pakistan.'
  };
  const pages = {
    "/": { title: "Engineering & Industrial Supplies in Lahore | NA Engineering Solutions", description: "NA Engineering Solutions provides General Order Supplies & Services, industrial procurement and engineering support for Lahore factories and projects." },
    "/services": { title: "Engineering Services in Lahore | NA Engineering Solutions", description: "Civil, mechanical, electrical, HVAC, PEB, fire fighting, waterproofing and industrial maintenance services for facilities and projects in Lahore." },
    "/supplies": { title: "General Order Supplier Company in Lahore | NA Engineering Solutions", description: "General order supplier company in Lahore for factories, offices and projects. BOQ-based sourcing for industrial, electrical, mechanical, PPE and maintenance supplies." },
    "/it-services": { title: "IT Equipment Supplier in Lahore | NA Engineering Solutions", description: "Business IT supplies in Lahore: computers, laptops, printers, networking equipment, servers, CCTV, UPS and accessories, with installation and support." },
    "/industries": { title: "Industrial & Commercial Engineering Support | NA Engineering", description: "Engineering, maintenance and procurement support for manufacturing, pharmaceutical, food, construction, power, warehouses and commercial facilities in Lahore." },
    "/blog": { title: "Engineering & Industrial Blog | NA Engineering Solutions", description: "Practical guides for industrial maintenance, HVAC, general order procurement, PEB planning and fire safety from NA Engineering Solutions in Lahore.", image: "https://images.pexels.com/photos/10202865/pexels-photo-10202865.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", imageAlt: "Engineering and industrial project environment" },
    "/clients": { title: "Clients & Project Experience | NA Engineering Solutions", description: "See the industries and project environments supported by NA Engineering Solutions across aviation, manufacturing, chemicals, food production and facilities." },
    "/contact": { title: "Contact NA Engineering Solutions | Lahore", description: "Contact NA Engineering Solutions in Lahore for engineering services, industrial supplies, maintenance, IT equipment and General Order Supplies & Services." },
    "/insights": { title: "Engineering & Industrial Blog | NA Engineering Solutions", description: "Practical guides for industrial maintenance, HVAC, general order procurement, PEB planning and fire safety from NA Engineering Solutions in Lahore.", image: "https://images.pexels.com/photos/10202865/pexels-photo-10202865.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", imageAlt: "Engineering and industrial project environment" }
  };
const servicePages = {
    "civil-engineering": ["Civil Engineering in Lahore | NA Engineering Solutions", "Civil engineering in Lahore for construction, concrete, flooring, waterproofing, site development and rehabilitation at industrial and commercial properties. Request a scope-based quote."],
    "mechanical-engineering": ["Mechanical Engineering in Lahore | NA Engineering Solutions", "Mechanical engineering services in Lahore for pumps, motors, conveyors, fabrication, welding, industrial repairs and spare parts."],
    "peb-works": ["PEB Contractor in Lahore | NA Engineering Solutions", "PEB contractor support in Lahore for pre-engineered steel sheds, industrial buildings, platforms, walkways and structural modifications. Discuss your project scope."],
    "electrical-works": ["Electrical Works in Lahore | NA Engineering Solutions", "Industrial electrical works in Lahore including wiring, lighting, panels, cables, installation, troubleshooting and maintenance."],
    "mechanical-electrical-supplies": ["Mechanical & Electrical Supplies in Lahore | NA Engineering Solutions", "Industrial mechanical and electrical supplies in Lahore: motors, pumps, gearboxes, valves, cables, breakers and panels, sourced to your specifications."],
    "utilities-facility-maintenance": ["Industrial Maintenance Services in Lahore | NA Engineering Solutions", "Industrial maintenance services in Lahore for pumps, compressors, boilers, water, compressed-air and steam utility systems, including preventive and corrective support."],
    "boiler-chemicals": ["Boiler Chemicals Supplier in Lahore | NA Engineering Solutions", "Boiler water treatment chemicals in Lahore, including scale inhibitors, oxygen scavengers and pH control products, with dosing and testing support."],
    "seamless-pipes-fittings": ["Seamless MS & SS Pipes in Lahore | NA Engineering Solutions", "Seamless MS and SS pipes and fittings in Lahore, including flanges, elbows, reducers and tees in project-specific grades, schedules and sizes."],
    "wastewater-treatment-plant": ["Wastewater Treatment Plant Services in Lahore | NA Engineering Solutions", "Wastewater treatment plant equipment and services in Lahore, including pumps, blowers, diffusers, dosing systems and maintenance support."],
    "hvac-supplies-services": ["HVAC Services in Lahore | NA Engineering Solutions", "HVAC services in Lahore for industrial and commercial facilities, including chillers, AHUs, FCUs, ducting, ventilation, installation and maintenance."],
    "fire-fighting-equipment": ["Fire Fighting Equipment in Lahore | NA Engineering Solutions", "Fire fighting equipment in Lahore, including extinguishers, hydrants, hoses, sprinklers and related installation, inspection and maintenance support."],
    "safety-security-systems": ["Safety & Security Systems in Lahore | NA Engineering Solutions", "Safety and security systems in Lahore, including CCTV, access control, biometric attendance, alarms, emergency lighting and safety signage."],
    "waterproofing-solutions": ["Waterproofing Services in Lahore | NA Engineering Solutions", "Waterproofing services in Lahore for roofs, basements, water tanks and wet areas, including membranes, protective coatings and leakage rectification."],
    "pumps-valves-pneumatic": ["Industrial Pumps & Valves Supplier in Lahore | NA Engineering Solutions", "Industrial pumps and valves supplier in Lahore for centrifugal, submersible and dosing pumps, gate and ball valves, pneumatic fittings, hoses and regulators."],
    "engineering-consultancy": ["Engineering Consultancy in Lahore | NA Engineering Solutions", "Engineering consultancy in Lahore for project planning, technical reviews, scope definition, specifications and execution coordination."],
  };
const articlePages = {
    "prepare-a-general-order-supply-request": ["General Order Supply Request | NA Engineering Solutions", "Prepare a clear general order supply request with item specifications, quantities, approved alternatives and delivery details so suppliers can quote accurately.", "https://www.naengineeringsolutions.com/images/local/hardware-tools-v1.svg", "Organized industrial spare parts and components on warehouse shelving"],
    "industrial-maintenance-supplier-checklist": ["Industrial Maintenance Partner | NA Engineering Solutions", "Use this checklist to assess an industrial maintenance partner's technical fit, site safety, response times, spare-parts support and service records.", "https://www.naengineeringsolutions.com/images/local/maintenance-consumables-v1.svg", "Industrial warehouse aisle with stocked shelves and organized materials"],
    "hvac-preventive-maintenance-checklist": ["HVAC Maintenance Checklist | NA Engineering Solutions", "Use a practical HVAC maintenance checklist for filters, airflow, drains, operating checks and service records in commercial and industrial facilities.", "https://www.naengineeringsolutions.com/images/local/hvac-systems-v1.svg", "HVAC technician checking an industrial cooling and refrigeration unit"],
    "peb-project-planning-checklist": ["PEB Project Planning Checklist | NA Engineering Solutions", "Plan a pre-engineered building project by confirming dimensions, loads, foundations, drawings, services, delivery and safe installation before fabrication.", "https://www.naengineeringsolutions.com/images/local/peb-steelworks-v1.svg", "Steel frame erection for a pre-engineered warehouse building"],
    "fire-safety-equipment-site-planning": ["Fire Safety Equipment Planning | NA Engineering Solutions", "Review fire safety equipment for industrial and commercial sites, including hazard assessment, suitable equipment, clear access, inspections and staff training.", "https://www.naengineeringsolutions.com/images/local/fire-protection-v1.svg", "Industrial fire safety installation and equipment in a facility"],
    "industrial-electrical-maintenance-checklist": ["Electrical Maintenance Checklist | NA Engineering Solutions", "Plan safer electrical maintenance with asset records, visible checks, qualified testing, isolation procedures and documented follow-up for each finding.", "https://www.naengineeringsolutions.com/images/local/electrical-systems-v1.svg", "Industrial technician inspecting an electrical control panel"],
    "industrial-spare-parts-inventory-planning": ["Industrial Spare Parts Planning | NA Engineering Solutions", "Identify critical industrial spares, verify part numbers, set replenishment points and coordinate supplier lead times to avoid preventable downtime.", "https://www.naengineeringsolutions.com/images/local/mechanical-engineering-v1.svg", "Industrial mechanical spare parts arranged for inspection and maintenance"],
    "compare-industrial-supplier-quotations": ["Industrial Quote Comparison | NA Engineering Solutions", "Compare industrial supplier quotations by technical compliance, delivery, warranty, documentation and total evaluated cost—not just the headline price.", "https://www.naengineeringsolutions.com/images/local/packaging-logistics-v1.svg", "Warehouse employee checking stock and inventory with a handheld scanner"]
  };
function upsert(name, content) {
    let el = document.head.querySelector('meta[name="' + name + '"]');
    if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
    el.content = content;
  }
  function upsertProperty(property, content) {
    let el = document.head.querySelector('meta[property="' + property + '"]');
    if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
    el.content = content;
  }
  function canonical(url) {
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el); }
    el.href = url;
  }
  function improveImageAlt() {
    document.querySelectorAll('img').forEach(function (image) {
      if (image.getAttribute('alt') && image.getAttribute('alt').trim()) return;
      const heading = image.closest('article,section,figure,div')?.querySelector('h2,h3,h4');
      const label = heading?.textContent?.trim() || document.title.split('|')[0].trim();
      image.setAttribute('alt', label + ' - NA Engineering Solutions');
    });
  }
  function apply() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const canonicalPath = path === '/insights' ? '/blog' : path.startsWith('/insights/') ? path.replace(/^\/insights\//, '/blog/') : path;
    const canonicalUrl = SITE + canonicalPath;
    const serviceMatch = path.match(/^\/services\/([^/]+)$/);
    const articleMatch = path.match(/^\/(?:blog|insights)\/([^/]+)$/);
    const serviceData = serviceMatch ? servicePages[serviceMatch[1]] : null;
    const articleData = articleMatch ? articlePages[articleMatch[1]] : null;
    const isAdmin = path === '/admin';
    const isKnownPath = Boolean(pages[path] || serviceData || articleData);
    const isNotFound = !isAdmin && !isKnownPath;
    let data = pages[path] || DEFAULT;
    if (serviceData) data = { title: serviceData[0], description: serviceData[1] };
    if (articleData) data = { title: articleData[0], description: articleData[1] };
    if (isAdmin) data = {
      title: 'Admin Sign In | NA Engineering Solutions',
      description: 'Private administration page for NA Engineering Solutions.'
    };
    if (isNotFound) data = {
      title: 'Page Not Found | NA Engineering Solutions',
      description: 'This page could not be found. Explore NA Engineering Solutions services, general order supplies or contact our Lahore team.'
    };
    document.title = data.title;
    upsert('description', data.description);
    upsert('robots', (isAdmin || isNotFound) ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    upsertProperty('og:type', articleData ? 'article' : 'website');
    upsertProperty('og:site_name', 'NA Engineering Solutions');
    upsertProperty('og:locale', 'en_PK');
    upsertProperty('og:title', data.title);
    upsertProperty('og:description', data.description);
    upsertProperty('og:url', canonicalUrl);
    const socialImage = articleData?.[2] || pages[path]?.image || SITE + '/logo.png';
    const socialImageAlt = articleData?.[3] || pages[path]?.imageAlt || 'NA Engineering Solutions company logo';
    upsertProperty('og:image', socialImage);
    upsertProperty('og:image:alt', socialImageAlt);
    upsert('twitter:card', 'summary_large_image');
    upsert('twitter:title', data.title);
    upsert('twitter:description', data.description);
    upsert('twitter:image', socialImage);
    upsert('twitter:image:alt', socialImageAlt);
    if (isAdmin || isNotFound) {
      const existingCanonical = document.head.querySelector('link[rel="canonical"]');
      if (existingCanonical) existingCanonical.remove();
      const staleSchema = document.getElementById('dynamic-seo-schema');
      if (staleSchema) staleSchema.remove();
      const staleFaq = document.getElementById('dynamic-service-faq-schema');
      if (staleFaq) staleFaq.remove();
      setTimeout(improveImageAlt, 350);
      return;
    }
    canonical(canonicalUrl);
    setTimeout(improveImageAlt, 350);
    let schema = document.getElementById('dynamic-seo-schema');
    if (!schema) { schema = document.createElement('script'); schema.id = 'dynamic-seo-schema'; schema.type = 'application/ld+json'; document.head.appendChild(schema); }
    // Reuse the canonical ProfessionalService and WebSite entities in the base document's JSON-LD.
    const graph = [];
    const serviceKey = serviceMatch && servicePages[serviceMatch[1]] ? serviceMatch[1] : null;
    const standaloneService = path === '/supplies'
      ? {name: 'General Order Supplies', description: pages['/supplies'].description}
      : path === '/it-services'
        ? {name: 'IT Services & Equipment', description: pages['/it-services'].description}
        : null;
    const serviceName = serviceKey
      ? data.title.split(' | ')[0]
      : (standaloneService ? standaloneService.name : null);
    const serviceDescription = serviceKey
      ? data.description
      : (standaloneService ? standaloneService.description : null);
    graph.push({
      '@type': 'WebPage',
      '@id': canonicalUrl + '#webpage',
      name: data.title.split(' | ')[0],
      url: canonicalUrl,
      description: data.description,
      isPartOf: {'@id': SITE + '/#website'},
      about: {'@id': SITE + '/#business'}
    });
    if (serviceName) {
      graph.push({
        '@type': 'Service',
        '@id': canonicalUrl + '#service',
        name: serviceName,
        serviceType: serviceName,
        description: serviceDescription,
        url: canonicalUrl,
        provider: { '@id': SITE + '/#business' },
        areaServed: { '@type': 'City', name: 'Lahore' },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl }
      });
    }
    if (articleData) {
      graph.push({
        '@type': 'BlogPosting',
        '@id': canonicalUrl + '#article',
        headline: data.title.split(' | ')[0],
        description: data.description,
        url: canonicalUrl,
        image: [articleData?.[2]],
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        author: { '@id': SITE + '/#business' },
        publisher: { '@id': SITE + '/#business' },
        inLanguage: 'en-PK',
        articleSection: 'Engineering, maintenance and procurement'
      });
    }
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': canonicalUrl + '#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        ...(articleData
          ? [
              { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog' },
              { '@type': 'ListItem', position: 3, name: data.title.split(' | ')[0], item: canonicalUrl }
            ]
          : serviceKey
            ? [
                { '@type': 'ListItem', position: 2, name: 'Services', item: SITE + '/services' },
                { '@type': 'ListItem', position: 3, name: serviceName, item: canonicalUrl }
              ]
            : (path === '/insights' || path === '/blog')
              ? [{ '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog' }]
              : [{ '@type': 'ListItem', position: 2, name: data.title.split(' | ')[0], item: canonicalUrl }])
      ]
    });
    schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    setTimeout(function(){
      if (!serviceKey && !standaloneService) {
        const staleFaq = document.getElementById('dynamic-service-faq-schema');
        if (staleFaq) staleFaq.remove();
        return;
      }
      const items = Array.from(document.querySelectorAll('.service-faq-item')).map(function(item){
        const question = item.querySelector('h3')?.textContent?.trim();
        const answer = item.querySelector('p')?.textContent?.trim();
        return question && answer ? {
          '@type':'Question',
          name:question,
          acceptedAnswer:{'@type':'Answer',text:answer}
        } : null;
      }).filter(Boolean);
      if (!items.length) return;
      const faq = document.createElement('script');
      faq.type='application/ld+json';
      faq.id='dynamic-service-faq-schema';
      faq.textContent=JSON.stringify({
        '@context':'https://schema.org',
        '@type':'FAQPage',
        mainEntity:items
      });
      const previous=document.getElementById('dynamic-service-faq-schema');
      if(previous) previous.remove();
      document.head.appendChild(faq);
    }, 250);
  }
  function stabilizeMobile() {
    const touchDevice = window.matchMedia('(max-width: 800px), (pointer: coarse)').matches;
    if (touchDevice && window.__lenis) {
      try { window.__lenis.destroy(); } catch (e) {}
      window.__lenis = null;
    }
  }
  apply();
  stabilizeMobile();
  let lastPath = window.location.pathname;
  setInterval(function () {
    stabilizeMobile();
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      apply();
    }
  }, 2000);
})();

/* deployment trigger: keep homepage visual layout unchanged */
