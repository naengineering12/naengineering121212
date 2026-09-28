(function () {
  const SITE = 'https://www.naengineeringsolutions.com';
  const DEFAULT = {
    title: 'NA Engineering Solutions Lahore | Engineering Services',
    description: 'NA Engineering Solutions provides engineering services, industrial maintenance and General Order Supplies & Services in Lahore, including civil, mechanical, electrical, HVAC, PEB, fire fighting and industrial supplies.'
  };
  const pages = {
    '/': {
      title: 'NA Engineering Solutions | Engineering & Industrial Supply Lahore',
      description: 'NA Engineering Solutions in Lahore provides engineering services, industrial maintenance and General Order Supplies & Services for factories, facilities and projects.'
    },
    '/about': {
      title: 'About NA Engineering Solutions | Lahore',
      description: 'Learn about NA Engineering Solutions, a Lahore-based engineering, maintenance and general order supply company supporting industrial and commercial sites.'
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
    }
  };
  const servicePages = {
    'civil-engineering': ['Civil Engineering Services in Lahore | NA Engineering Solutions', 'Civil construction, concrete, flooring, waterproofing, site development, repair and project execution support in Lahore.'],
    'mechanical-engineering': ['Mechanical Engineering Services in Lahore | NA Engineering Solutions', 'Mechanical services in Lahore covering pumps, motors, gearboxes, conveyors, fabrication, welding, industrial repair and spare parts.'],
    'peb-works': ['PEB Works in Lahore | NA Engineering Solutions', 'PEB sheds, structural steel, industrial structures, platforms, walkways, canopies, installation and modification support in Lahore.'],
    'electrical-works': ['Electrical Works in Lahore | NA Engineering Solutions', 'Industrial electrical installation, lighting, cables, accessories, maintenance, troubleshooting and material supply in Lahore.'],
    'mechanical-electrical-supplies': ['Mechanical & Electrical Supplies in Lahore | NA Engineering Solutions', 'Industrial motors, pumps, gearboxes, valves, conveyors, cables, panels, breakers and spare parts supplied in Lahore.'],
    'utilities-facility-maintenance': ['Utility & Facility Maintenance in Lahore | NA Engineering Solutions', 'Maintenance support for water, compressed air and steam systems, compressors, boilers, preventive maintenance and AMC requirements in Lahore.'],
    'boiler-chemicals': ['Boiler Chemicals & Water Treatment | Lahore | NA Engineering Solutions', 'Boiler water treatment chemicals, dosing systems, testing and technical support for corrosion, scaling and efficiency requirements in Lahore.'],
    'seamless-pipes-fittings': ['Seamless MS & SS Pipes & Fittings | Lahore', 'Seamless Mild Steel and Stainless Steel pipes, flanges, elbows, reducers, tees and project-specific fittings supplied in Lahore.'],
    'wastewater-treatment-plant': ['WWTP Supplies & Services in Lahore | NA Engineering Solutions', 'Wastewater treatment equipment, pumps, blowers, diffusers, dosing systems, chemicals and O&M support in Lahore.'],
    'hvac-supplies-services': ['HVAC Services & Supplies in Lahore | NA Engineering Solutions', 'HVAC equipment, installation, ducting, chillers, AHUs, FCUs, exhaust and fresh-air systems, maintenance and filters in Lahore.'],
    'fire-fighting-equipment': ['Fire Fighting Equipment in Lahore | NA Engineering Solutions', 'Fire extinguishers, hoses, hydrants, sprinklers and related accessories with refilling and service support in Lahore.'],
    'waterproofing-solutions': ['Waterproofing Services in Lahore | NA Engineering Solutions', 'Roof, basement, water tank and wet-area waterproofing with chemicals, membranes and leakage rectification in Lahore.'],
    'pumps-valves-pneumatic': ['Pumps, Valves & Pneumatic Fittings | Lahore', 'Industrial pumps, valves, pneumatic fittings, hoses and regulators supplied in Lahore with application-based selection support.']
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
    let data = pages[path] || DEFAULT;
    const serviceMatch = path.match(/^\/services\/([^/]+)$/);
    if (serviceMatch && servicePages[serviceMatch[1]]) data = { title: servicePages[serviceMatch[1]][0], description: servicePages[serviceMatch[1]][1] };
    document.title = data.title;
    upsert('description', data.description);
    upsert('robots', 'index, follow, max-image-preview:large');
    upsertProperty('og:type', 'website');
    upsertProperty('og:site_name', 'NA Engineering Solutions');
    upsertProperty('og:title', data.title);
    upsertProperty('og:description', data.description);
    upsertProperty('og:url', SITE + path);
    upsertProperty('og:image', SITE + '/logo.png');
    upsert('twitter:card', 'summary_large_image');
    upsert('twitter:title', data.title);
    upsert('twitter:description', data.description);
    upsert('twitter:image', SITE + '/logo.png');
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
      serviceType: ['Engineering Services', 'General Order Supplies', 'Industrial Maintenance', 'HVAC Services', 'Mechanical Engineering', 'Electrical Works', 'Civil Engineering', 'PEB Works', 'Fire Fighting', 'Industrial Supplies'],
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
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': SITE + path + '#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        ...(serviceKey
          ? [
              { '@type': 'ListItem', position: 2, name: 'Services', item: SITE + '/services' },
              { '@type': 'ListItem', position: 3, name: serviceName, item: SITE + path }
            ]
          : [{ '@type': 'ListItem', position: 2, name: data.title.split(' | ')[0], item: SITE + path }])
      ]
    });
    schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    setTimeout(function(){
      if (!serviceKey && !standaloneService) return;
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
