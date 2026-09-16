(function () {
  const SITE = 'https://www.naengineeringsolutions.com';
  const DEFAULT = {
    title: 'NA Engineering Solutions | Engineering Services & General Order Supplies Lahore',
    description: 'NA Engineering Solutions is a Lahore-based engineering services and general order supplies company providing civil, mechanical, electrical, HVAC, PEB, fire fighting, maintenance and industrial supply solutions in Pakistan.'
  };
  const pages = {
    '/': DEFAULT,
    '/services': { title: 'Engineering Services in Lahore | NA Engineering Solutions', description: 'NA Engineering Solutions provides engineering services in Lahore including civil, mechanical, electrical, HVAC, PEB, fire fighting, waterproofing, industrial maintenance and utility solutions.' },
    '/supplies': { title: 'General Order Supplies in Lahore | NA Engineering Solutions', description: 'NA Engineering Solutions is a general order supplier in Lahore for industrial, electrical, mechanical, safety, PPE, hardware, janitorial, office, IT and maintenance supplies.' },
    '/it-services': { title: 'IT Services & Equipment Supplier Lahore | NA Engineering Solutions', description: 'NA Engineering Solutions provides IT services and equipment supply in Lahore including computers, laptops, printers, networking accessories, cables, peripherals and office technology.' },
    '/industries': { title: 'Industries We Serve | NA Engineering Solutions Lahore', description: 'Engineering, maintenance and general order supply solutions by NA Engineering Solutions for manufacturing, pharmaceutical, food, construction, utilities, warehouses, offices and commercial facilities.' },
    '/clients': { title: 'Our Clients | NA Engineering Solutions Lahore', description: 'Explore client and project experience of NA Engineering Solutions across industrial, commercial, engineering and general order supply requirements in Pakistan.' }
  };
  const servicePages = {
    'civil-engineering': ['Civil Engineering Services Lahore | NA Engineering Solutions', 'Civil engineering, construction, concrete, flooring, waterproofing, site development and project execution services by NA Engineering Solutions in Lahore.'],
    'mechanical-engineering': ['Mechanical Engineering Services Lahore | NA Engineering Solutions', 'Mechanical engineering, pumps, motors, conveyors, fabrication, welding, industrial repair and spare parts supply by NA Engineering Solutions in Lahore.'],
    'peb-works': ['PEB Works Lahore | Pre-Engineered Buildings | NA Engineering Solutions', 'PEB works in Lahore including pre-engineered buildings, structural steel, industrial sheds, platforms, walkways, canopies and modifications.'],
    'electrical-works': ['Electrical Works Lahore | Industrial Electrical Services | NA Engineering Solutions', 'Industrial electrical installation, lighting, cables, accessories, maintenance, troubleshooting and electrical material supply in Lahore.'],
    'mechanical-electrical-supplies': ['Mechanical & Electrical Supplies Lahore | NA Engineering Solutions', 'Mechanical and electrical industrial supplies in Lahore including motors, pumps, gearboxes, valves, cables, panels, breakers and spare parts.'],
    'utilities-facility-maintenance': ['Facility & Utility Maintenance Lahore | NA Engineering Solutions', 'Facility and utility maintenance in Lahore for water, compressed air, steam, compressors, boilers, preventive maintenance and AMC support.'],
    'boiler-chemicals': ['Boiler Chemicals & Water Treatment Lahore | NA Engineering Solutions', 'Boiler water treatment chemicals, dosing systems, testing and technical support for corrosion, scaling and boiler efficiency in Lahore.'],
    'seamless-pipes-fittings': ['Seamless MS & SS Pipes and Fittings Lahore | NA Engineering Solutions', 'Seamless mild steel and stainless steel pipes, flanges, elbows, reducers, tees and project-specific fittings supplied in Lahore.'],
    'wastewater-treatment-plant': ['WWTP Supplies & Services Lahore | NA Engineering Solutions', 'Wastewater treatment plant equipment, pumps, blowers, diffusers, dosing systems, chemicals and O&M support in Lahore.'],
    'hvac-supplies-services': ['HVAC Services & Supplies Lahore | NA Engineering Solutions', 'HVAC supply and installation in Lahore including chillers, AHUs, FCUs, exhaust, fresh air systems, ducting, filters and maintenance.'],
    'fire-fighting-equipment': ['Fire Fighting Equipment & Services Lahore | NA Engineering Solutions', 'Fire fighting equipment supplier in Lahore for extinguishers, hoses, hydrants, sprinklers, accessories, refilling and maintenance support.'],
    'waterproofing-solutions': ['Waterproofing Services Lahore | NA Engineering Solutions', 'Waterproofing solutions in Lahore for roofs, basements, water tanks and wet areas, including waterproof chemicals, membranes and leakage rectification.'],
    'pumps-valves-pneumatic': ['Pumps, Valves & Pneumatic Fittings Lahore | NA Engineering Solutions', 'Industrial pumps, valves, pneumatic fittings, hoses and regulators supplied in Lahore with application-based selection support.']
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
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
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
    });
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
