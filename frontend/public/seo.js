(function () {
  const SITE = 'https://www.naengineeringsolutions.com';
  const DEFAULT = {
    title: 'NA Engineering Solutions Lahore | Engineering Services',
    description: 'NA Engineering Solutions provides engineering services, industrial maintenance and General Order Supplies & Services in Lahore, including civil, mechanical, electrical, HVAC, PEB, fire fighting and industrial supplies.'
  };
  const pages = {
    "/": { title: "NA Engineering Solutions | General Order Supplies & Services", description: "NA Engineering Solutions supports Lahore businesses with engineering consultancy, engineering services, general order supplies and project support." },
    "/services": { title: "Engineering Services in Lahore | NA Engineering Solutions", description: "Civil, mechanical, electrical, HVAC, PEB, fire fighting, waterproofing and industrial maintenance services for facilities and projects in Lahore." },
    "/supplies": { title: "General Order Supplier in Lahore | NA Engineering Solutions", description: "General Order Supplies in Lahore covering hardware, tools, PPE, electrical items, janitorial products, maintenance consumables, stationery, IT and more." },
    "/it-services": { title: "IT Services & Equipment in Lahore | NA Engineering Solutions", description: "IT equipment and support in Lahore: computers, laptops, printers, networking, servers, CCTV, power backup, accessories and maintenance." },
    "/industries": { title: "Industries We Serve in Lahore | NA Engineering Solutions", description: "Engineering, maintenance and supply support for manufacturing, pharmaceutical, food, construction, power, warehouses, offices and commercial facilities." },
    "/blog": { title: "Engineering & Industrial Blog | NA Engineering Solutions", description: "Practical guides for industrial maintenance, HVAC, general order procurement, PEB planning and fire safety from NA Engineering Solutions in Lahore.", image: "https://images.pexels.com/photos/10202865/pexels-photo-10202865.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", imageAlt: "Engineering and industrial project environment" },
    "/clients": { title: "Clients & Project Experience | NA Engineering Solutions", description: "See the industries and project environments supported by NA Engineering Solutions across aviation, manufacturing, chemicals, food production and facilities." },
    "/contact": { title: "Contact NA Engineering Solutions | Lahore", description: "Contact NA Engineering Solutions in Lahore for engineering services, industrial supplies, maintenance, IT equipment and General Order Supplies & Services." },
    "/insights": { title: "Engineering & Industrial Blog | NA Engineering Solutions", description: "Practical guides for industrial maintenance, HVAC, general order procurement, PEB planning and fire safety from NA Engineering Solutions in Lahore.", image: "https://images.pexels.com/photos/10202865/pexels-photo-10202865.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", imageAlt: "Engineering and industrial project environment" }
  };
const servicePages = {
    "civil-engineering": ["Civil Engineering in Lahore | NA Engineering Solutions", "Civil engineering services in Lahore covering construction, concrete, flooring, waterproofing and site development for commercial and industrial projects."],
    "mechanical-engineering": ["Mechanical Engineering in Lahore | NA Engineering Solutions", "Mechanical engineering in Lahore for pumps, motors, conveyors, fabrication, welding, industrial repairs and spare parts from NA Engineering Solutions."],
    "peb-works": ["PEB Works in Lahore | NA Engineering Solutions", "PEB works in Lahore for steel sheds, industrial structures, platforms and canopies, with installation and modification support by NA Engineering Solutions."],
    "electrical-works": ["Electrical Works in Lahore | NA Engineering Solutions", "Electrical works in Lahore covering industrial wiring, lighting, panels, cables, installation, troubleshooting and maintenance by NA Engineering Solutions."],
    "mechanical-electrical-supplies": ["Mechanical & Electrical Supplies | NA Engineering Solutions", "NA Engineering Solutions supplies industrial motors, pumps, gearboxes, valves, cables and electrical panels for industrial projects in Lahore, Pakistan."],
    "utilities-facility-maintenance": ["Utility Maintenance in Lahore | NA Engineering Solutions", "Utility and facility maintenance in Lahore for water, compressed air, steam and boiler systems, preventive servicing and repairs by NA Engineering Solutions."],
    "boiler-chemicals": ["Boiler Chemicals in Lahore | NA Engineering Solutions", "NA Engineering Solutions supplies boiler water treatment chemicals, dosing systems and testing support for industrial boilers in Lahore, Pakistan."],
    "seamless-pipes-fittings": ["Seamless Pipes & Fittings | NA Engineering Solutions", "NA Engineering Solutions supplies seamless MS and SS pipes, flanges, elbows, reducers and tees in project-specific grades and sizes across Lahore, Pakistan."],
    "wastewater-treatment-plant": ["Wastewater Treatment in Lahore | NA Engineering Solutions", "NA Engineering Solutions supplies wastewater treatment equipment, pumps, blowers, diffusers and dosing systems for industrial projects in Lahore, Pakistan."],
    "hvac-supplies-services": ["HVAC Services in Lahore | NA Engineering Solutions", "HVAC installation, ducting, chillers, AHUs, FCUs and preventive maintenance for commercial and industrial facilities in Lahore by NA Engineering Solutions."],
    "fire-fighting-equipment": ["Fire Fighting Services in Lahore | NA Engineering Solutions", "Fire extinguishers, hydrants, hoses, sprinklers and fire protection equipment, plus inspection and maintenance support in Lahore from NA Engineering Solutions."],
    "safety-security-systems": ["Safety & Security in Lahore | NA Engineering Solutions", "NA Engineering Solutions supplies CCTV, access control, biometric attendance, alarm systems, emergency lighting and safety signage across Lahore, Pakistan."],
    "waterproofing-solutions": ["Waterproofing in Lahore | NA Engineering Solutions", "Roof, basement and water tank waterproofing in Lahore, including membranes, protective coatings and leakage repairs for commercial and industrial properties."],
    "pumps-valves-pneumatic": ["Pumps & Valves in Lahore | NA Engineering Solutions", "Industrial pumps, valves, pneumatic fittings, hoses and regulators supplied in Lahore with application-based selection support by NA Engineering Solutions."],
    "engineering-consultancy": ["Engineering Consultancy in Lahore | NA Engineering Solutions", "Engineering consultancy in Lahore for project planning, technical reviews, specifications and execution support for commercial and industrial projects."]
  };
const articlePages = {
    "prepare-a-general-order-supply-request": ["General Order Supply Request | NA Engineering Solutions", "Prepare a clear general order supply request with item specifications, quantities, approved alternatives and delivery details so suppliers can quote accurately.", "https://images.pexels.com/photos/37912780/pexels-photo-37912780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Organized industrial spare parts and components on warehouse shelving"],
    "industrial-maintenance-supplier-checklist": ["Industrial Maintenance Partner | NA Engineering Solutions", "Use this checklist to assess an industrial maintenance partner's technical fit, site safety, response times, spare-parts support and service records.", "https://images.pexels.com/photos/4483773/pexels-photo-4483773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Industrial warehouse aisle with stocked shelves and organized materials"],
    "hvac-preventive-maintenance-checklist": ["HVAC Maintenance Checklist | NA Engineering Solutions", "Use a practical HVAC maintenance checklist for filters, airflow, drains, operating checks and service records in commercial and industrial facilities.", "https://images.pexels.com/photos/32497161/pexels-photo-32497161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "HVAC technician checking an industrial cooling and refrigeration unit"],
    "peb-project-planning-checklist": ["PEB Project Planning Checklist | NA Engineering Solutions", "Plan a pre-engineered building project by confirming dimensions, loads, foundations, drawings, services, delivery and safe installation before fabrication.", "https://images.pexels.com/photos/7961889/pexels-photo-7961889.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Steel frame erection for a pre-engineered warehouse building"],
    "fire-safety-equipment-site-planning": ["Fire Safety Equipment Planning | NA Engineering Solutions", "Review fire safety equipment for industrial and commercial sites, including hazard assessment, suitable equipment, clear access, inspections and staff training.", "https://images.pexels.com/photos/19143940/pexels-photo-19143940.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Industrial fire safety installation and equipment in a facility"],
    "industrial-electrical-maintenance-checklist": ["Electrical Maintenance Checklist | NA Engineering Solutions", "Plan safer electrical maintenance with asset records, visible checks, qualified testing, isolation procedures and documented follow-up for each finding.", "https://images.pexels.com/photos/33531833/pexels-photo-33531833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Industrial technician inspecting an electrical control panel"],
    "industrial-spare-parts-inventory-planning": ["Industrial Spare Parts Planning | NA Engineering Solutions", "Identify critical industrial spares, verify part numbers, set replenishment points and coordinate supplier lead times to avoid preventable downtime.", "https://images.pexels.com/photos/7568418/pexels-photo-7568418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Industrial mechanical spare parts arranged for inspection and maintenance"],
    "compare-industrial-supplier-quotations": ["Industrial Quote Comparison | NA Engineering Solutions", "Compare industrial supplier quotations by technical compliance, delivery, warranty, documentation and total evaluated cost—not just the headline price.", "https://images.pexels.com/photos/4484154/pexels-photo-4484154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Warehouse employee checking stock and inventory with a handheld scanner"]
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
