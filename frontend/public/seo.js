(function () {
  const SITE = 'https://www.naengineeringsolutions.com';
  const DEFAULT = {
    title: 'NA Engineering Solutions Lahore | Engineering Services',
    description: 'NA Engineering Solutions provides engineering services, industrial maintenance and General Order Supplies & Services in Lahore, including civil, mechanical, electrical, HVAC, PEB, fire fighting and industrial supplies.'
  };
  const pages = {
    '/': {
      title: 'NA Engineering Solutions | General Order Supplies & Services',
      description: 'NA Engineering Solutions supports Lahore businesses with engineering consultancy, engineering services, general order supplies and project support.'
    },
    '/services': {
      title: 'Engineering Services in Lahore | NA Engineering Solutions',
      description: 'Civil, mechanical, electrical, HVAC, PEB, fire fighting, waterproofing and industrial maintenance services for facilities and projects in Lahore.'
    },
    '/supplies': {
      title: 'General Order Supplier in Lahore | NA Engineering Solutions',
      description: 'General Order Supplies in Lahore covering hardware, tools, PPE, electrical items, janitorial products, maintenance consumables, stationery, IT and more.'
    },
    '/it-services': {
      title: 'IT Services & Equipment in Lahore | NA Engineering Solutions',
      description: 'IT equipment and support in Lahore: computers, laptops, printers, networking, servers, CCTV, power backup, accessories and maintenance.'
    },
    '/industries': {
      title: 'Industrial Engineering Solutions | Lahore & Pakistan',
      description: 'Engineering, maintenance and supply support for manufacturing, pharmaceutical, food, construction, power, warehouses, offices and commercial facilities.'
    },
    '/clients': {
      title: 'Clients & Project Experience | NA Engineering Solutions',
      description: 'See the industries and project environments supported by NA Engineering Solutions across aviation, manufacturing, chemicals, food production and facilities.'
    },
    '/contact': {
      title: 'Contact NA Engineering Solutions | Lahore',
      description: 'Contact NA Engineering Solutions in Lahore for engineering services, industrial supplies, maintenance, IT equipment and General Order Supplies & Services.'
    },
    '/insights': {
      title: 'Engineering & Industrial Supply Guides | NA Engineering Solutions',
      description: 'Practical guides for industrial maintenance, HVAC, general order procurement, PEB planning and fire safety from NA Engineering Solutions in Lahore.'
    }
  };
  const servicePages = {
    'civil-engineering': ['Civil Engineering in Lahore | NA Engineering Solutions', "Civil engineering services in Lahore covering construction, concrete, flooring, waterproofing and site development for commercial and industrial projects."],
    'mechanical-engineering': ['Mechanical Engineering Services in Lahore | NA Engineering Solutions', "Mechanical engineering in Lahore for pumps, motors, conveyors, fabrication, welding, industrial repairs and spare parts from NA Engineering Solutions."],
    'peb-works': ['PEB Works in Lahore | NA Engineering Solutions', 'PEB sheds, structural steel, industrial structures, platforms, walkways, canopies, installation and modification support in Lahore.'],
    'electrical-works': ['Electrical Works in Lahore | NA Engineering Solutions', 'Industrial electrical installation, lighting, cables, accessories, maintenance, troubleshooting and material supply in Lahore.'],
    'mechanical-electrical-supplies': ["Mechanical & Electrical Supplies in Lahore | NA Engineering Solutions", "NA Engineering Solutions supplies industrial motors, pumps, gearboxes, valves, cables and electrical panels for industrial projects in Lahore, Pakistan."],
    'utilities-facility-maintenance': ["Utility & Facility Maintenance in Lahore | NA Engineering Solutions", "Utility and facility maintenance in Lahore for water, compressed air, steam and boiler systems, preventive servicing and repairs by NA Engineering Solutions."],
    'boiler-chemicals': ["Boiler Chemicals in Lahore | NA Engineering Solutions", "NA Engineering Solutions supplies boiler water treatment chemicals, dosing systems and testing support for industrial boilers in Lahore, Pakistan."],
    'seamless-pipes-fittings': ["Seamless Pipes & Fittings in Lahore | NA Engineering Solutions", "NA Engineering Solutions supplies seamless MS and SS pipes, flanges, elbows, reducers and tees in project-specific grades and sizes across Lahore, Pakistan."],
    'wastewater-treatment-plant': ["Wastewater Treatment Plant Services | NA Engineering Solutions", "NA Engineering Solutions supplies wastewater treatment equipment, pumps, blowers, diffusers and dosing systems for industrial projects in Lahore, Pakistan."],
    'hvac-supplies-services': ["HVAC Services in Lahore | NA Engineering Solutions", "HVAC installation, ducting, chillers, AHUs, FCUs and preventive maintenance for commercial and industrial facilities in Lahore by NA Engineering Solutions."],
    'fire-fighting-equipment': ["Fire Fighting Services in Lahore | NA Engineering Solutions", "Fire extinguishers, hydrants, hoses, sprinklers and fire protection equipment, plus inspection and maintenance support in Lahore from NA Engineering Solutions."],
    'safety-security-systems': ['Safety & Security Systems in Lahore | NA Engineering Solutions', "NA Engineering Solutions supplies CCTV, access control, biometric attendance, alarm systems, emergency lighting and safety signage across Lahore, Pakistan."],
    'waterproofing-solutions': ["Waterproofing in Lahore | NA Engineering Solutions", "Roof, basement and water tank waterproofing in Lahore, including membranes, protective coatings and leakage repairs for commercial and industrial properties."],
    'pumps-valves-pneumatic': ["Pumps & Valves in Lahore | NA Engineering Solutions", "Industrial pumps, valves, pneumatic fittings, hoses and regulators supplied in Lahore with application-based selection support by NA Engineering Solutions."],
    'engineering-consultancy': ["Engineering Consultancy in Lahore | NA Engineering Solutions", "Engineering consultancy in Lahore for project planning, technical reviews, specifications and execution support for commercial and industrial projects."]
  };
  const articlePages = {
    'prepare-a-general-order-supply-request': ['How to Prepare a General Order Supply Request | NA Engineering Solutions', 'A checklist for clear item descriptions, specifications, quantities, delivery details and documents when requesting general order supplies.'],
    'industrial-maintenance-supplier-checklist': ['Choosing an Industrial Maintenance Supplier | NA Engineering Solutions', 'Questions to ask about technical fit, site safety, scope, lead times and after-delivery support when choosing an industrial maintenance supplier.'],
    'hvac-preventive-maintenance-checklist': ['HVAC Preventive Maintenance Checklist | NA Engineering Solutions', 'A practical facility checklist covering HVAC filters, airflow, drainage, operating condition, accessibility and maintenance records.'],
    'peb-project-planning-checklist': ['PEB Project Planning Checklist | NA Engineering Solutions', 'What to confirm before a PEB project, including dimensions, design loads, foundations, drainage, building services and installation coordination.'],
    'fire-safety-equipment-site-planning': ['Fire Safety Equipment Planning Guide | NA Engineering Solutions', 'Key considerations for fire safety equipment selection, placement, inspection and records at commercial and industrial sites.']
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
    const serviceMatch = path.match(/^\/services\/([^/]+)$/);
    const articleMatch = path.match(/^\/insights\/([^/]+)$/);
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
    upsert('robots', (isAdmin || isNotFound) ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    upsertProperty('og:type', articleData ? 'article' : 'website');
    upsertProperty('og:site_name', 'NA Engineering Solutions');
    upsertProperty('og:locale', 'en_PK');
    upsertProperty('og:title', data.title);
    upsertProperty('og:description', data.description);
    upsertProperty('og:url', SITE + path);
    upsertProperty('og:image', SITE + '/logo.png');
    upsertProperty('og:image:alt', 'NA Engineering Solutions company logo');
    upsert('twitter:card', 'summary_large_image');
    upsert('twitter:title', data.title);
    upsert('twitter:description', data.description);
    upsert('twitter:image', SITE + '/logo.png');
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
    canonical(SITE + path);
    setTimeout(improveImageAlt, 350);
    let schema = document.getElementById('dynamic-seo-schema');
    if (!schema) { schema = document.createElement('script'); schema.id = 'dynamic-seo-schema'; schema.type = 'application/ld+json'; document.head.appendChild(schema); }
    const business = {
      '@type': 'ProfessionalService',
      '@id': SITE + '/#business',
      name: 'NA Engineering Solutions',
      alternateName: ['NA Engineering', 'NA Engineering Solutions Lahore'],
      url: SITE,
      logo: SITE + '/logo.png',
      image: SITE + '/logo.png',
      description: 'NA Engineering Solutions is a Lahore-based engineering services and general order supplies company serving industrial, commercial and construction requirements in Pakistan.',
      email: 'na.engineeringsolutions2023@gmail.com',
      telephone: '+92 300 8596393',
      address: { '@type': 'PostalAddress', streetAddress: '593 Block-A LDA Avenue, 1 Raiwind Rd', addressLocality: 'Lahore', postalCode: '54000', addressCountry: 'PK' },
      geo: { '@type': 'GeoCoordinates', latitude: 31.4274139, longitude: 74.2215347 },
      areaServed: [{ '@type': 'City', name: 'Lahore' }, { '@type': 'Country', name: 'Pakistan' }],
      serviceType: ['Engineering Consultancy', 'Engineering Services', 'General Order Supplies & Services', 'Industrial Maintenance', 'Utilities & Facility Maintenance', 'HVAC Services', 'Mechanical Engineering', 'Electrical Works', 'Civil Engineering', 'PEB Works', 'Fire Fighting Equipment', 'Safety & Security Systems', 'IT Services & Equipment', 'Wastewater Treatment Plant Supplies', 'Boiler Water Treatment Chemicals', 'Seamless MS & SS Pipes & Fittings', 'Waterproofing Solutions', 'Pumps, Valves & Pneumatic Fittings', 'Industrial Supplies'],
      sameAs: ['https://www.tiktok.com/@na_engineering.co', 'https://www.instagram.com/na_engineering.co/', 'https://x.com/NA_engsolutions']
    };
    const graph = [business];
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
      '@id': SITE + path + '#webpage',
      name: data.title.split(' | ')[0],
      url: SITE + path,
      description: data.description,
      isPartOf: {'@id': SITE + '/#website'},
      about: {'@id': SITE + '/#business'}
    });
    if (serviceName) {
      graph.push({
        '@type': 'Service',
        '@id': SITE + path + '#service',
        name: serviceName,
        serviceType: serviceName,
        description: serviceDescription,
        url: SITE + path,
        provider: { '@id': SITE + '/#business' },
        areaServed: { '@type': 'City', name: 'Lahore' },
        mainEntityOfPage: { '@type': 'WebPage', '@id': SITE + path }
      });
    }
    if (articleData) {
      graph.push({
        '@type': 'BlogPosting',
        '@id': SITE + path + '#article',
        headline: data.title.split(' | ')[0],
        description: data.description,
        url: SITE + path,
        mainEntityOfPage: { '@type': 'WebPage', '@id': SITE + path },
        author: { '@type': 'Organization', '@id': SITE + '/#business', name: 'NA Engineering Solutions' },
        publisher: { '@id': SITE + '/#business' },
        inLanguage: 'en-PK',
        articleSection: 'Engineering, maintenance and procurement'
      });
    }
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': SITE + path + '#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        ...(articleData
          ? [
              { '@type': 'ListItem', position: 2, name: 'Insights', item: SITE + '/insights' },
              { '@type': 'ListItem', position: 3, name: data.title.split(' | ')[0], item: SITE + path }
            ]
          : serviceKey
            ? [
                { '@type': 'ListItem', position: 2, name: 'Services', item: SITE + '/services' },
                { '@type': 'ListItem', position: 3, name: serviceName, item: SITE + path }
              ]
            : path === '/insights'
              ? [{ '@type': 'ListItem', position: 2, name: 'Insights', item: SITE + path }]
              : [{ '@type': 'ListItem', position: 2, name: data.title.split(' | ')[0], item: SITE + path }])
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
