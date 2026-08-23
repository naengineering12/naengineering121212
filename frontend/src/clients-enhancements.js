/* Our Clients enhancement: verified company domains, sharper logo sources and complete client grid. */
const CLIENTS = [
  { name: "Gerry's dnata", category: "Aviation & Ground Handling", initials: "GD", domain: "gerrysdnata.com", href: "https://www.gerrysdnata.com/", description: "Ground handling, cargo and airport support services across Pakistan." },
  { name: "Interloop Limited", category: "Textile Manufacturing", initials: "IL", domain: "interloop-pk.com", href: "https://interloop-pk.com/", description: "Engineering, facility and industrial support for large-scale textile manufacturing." },
  { name: "Lahore International Airport", category: "Aviation & Infrastructure", initials: "LA", domain: "paa.gov.pk", href: "#", logo: "https://www.app.com.pk/wp-content/uploads/2025/08/The-Pakistan-Airports-Authority-PAA.png", description: "Facility, engineering and technical support for airport operations." },
  { name: "Sialkot International Airport", category: "Aviation & Infrastructure", initials: "SA", domain: "sial.com.pk", href: "https://www.sial.com.pk/", description: "Maintenance, engineering and supply support for airport infrastructure." },
  { name: "Multan International Airport", category: "Aviation & Infrastructure", initials: "MA", domain: "paa.gov.pk", href: "#", logo: "https://www.app.com.pk/wp-content/uploads/2025/08/The-Pakistan-Airports-Authority-PAA.png", description: "Technical, maintenance and supply support for airport operations." },
  { name: "Joyland Group", category: "Recreation & Entertainment", initials: "JG", domain: "joyland.com.pk", href: "https://joyland.com.pk/", description: "Facility engineering, maintenance and operational support." },
  { name: "Lake City", category: "Real Estate & Facilities", initials: "LC", domain: "lakecitylahore.com", href: "https://www.lakecitylahore.com/", logo: "https://www.muqaddimrealestate.com/storage/uploads/6/24080632_ake-city.jpg", description: "Engineering, facility maintenance and site support for real estate operations." },
  { name: "Fatima Fertilizer", category: "Fertilizer & Industrial", initials: "FF", domain: "fatima-group.com", href: "https://www.fatima-group.com/", description: "Industrial engineering, maintenance and supply support for fertilizer operations." },
  { name: "ZIC Oil", category: "Lubricants & Industrial", initials: "ZIC", domain: "zicoil.pk", href: "https://zicoil.pk/", logo: "https://image.slidesharecdn.com/zicmotoroil-161018163831/85/Zic-motor-oil-Pakistan-1-638.jpg", logoCrop: "zic", description: "Industrial lubricant and facility support requirements." },
  { name: "Dandot Cement", category: "Cement & Construction Materials", initials: "DC", domain: "dandotcement.com", href: "https://www.dandotcement.com/", logo: "https://media.licdn.com/dms/image/v2/D4E22AQEgjnklEID7Xw/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1713618119312?e=2147483647&t=yWqbEzNTauZfmRnw5pkAWUGt-ml74umUaJ8adKre4&v=beta", logoCrop: "dandot", description: "Mechanical, electrical and industrial support for cement plant environments." },
  { name: "Nimir Chemicals", category: "Chemical & Industrial", initials: "NC", domain: "nimirchemicals.com", href: "https://nimirchemicals.com/", description: "Industrial supplies, maintenance and engineering support for chemical processing." },
];

/* Use known logo artwork for clients whose domains expose an unsuitable generic favicon.
   Other clients continue using their company/domain icon with initials as the final fallback. */
const logoUrl = (domain) => `https://icons.duckduckgo.com/ip3/${domain}.ico`;

function logoImage(client, className = '') {
  if (client.logo && client.logoCrop) {
    const cropStyle = client.logoCrop === 'dandot'
      ? "background-size:500% auto;background-position:8% 8%;"
      : "background-size:220% auto;background-position:center;";
    return `<span class="${className} client-logo-crop" style="display:block;width:64px;height:64px;background-repeat:no-repeat;background-color:transparent;${cropStyle}background-image:url('${client.logo}')" role="img" aria-label="${client.name} logo"></span>`;
  }
  const primary = client.logo || logoUrl(client.domain);
  return `<img class="${className}" src="${primary}" alt="${client.name} logo" loading="lazy" decoding="async"
    onload="this.previousElementSibling.style.display='none'"
    onerror="this.style.display='none';this.previousElementSibling.style.display='flex'" />`;
}

function cardHtml(client, index) {
  const external = client.href !== '#';
  return `<a class="client-card client-card-enhanced" href="${client.href}" ${external ? 'target="_blank" rel="noreferrer"' : ''} aria-label="${client.name}">
    <span class="client-card-number">${String(index + 1).padStart(2, '0')}</span>
    <div class="client-logo-wrap"><span class="client-logo-fallback">${client.initials}</span>${logoImage(client, 'client-company-logo')}</div>
    <span class="client-ind">${client.category}</span>
    <h3>${client.name}</h3>
    <p>${client.description}</p>
    ${external ? '<span class="client-card-arrow">↗</span>' : '<span class="client-card-arrow client-card-arrow-muted">•</span>'}
  </a>`;
}

function logoChipHtml(client) {
  return `<a class="logo-chip logo-chip-enhanced" href="${client.href}" ${client.href !== '#' ? 'target="_blank" rel="noreferrer"' : ''} title="${client.name}"><span class="logo-mono">${client.initials}</span>${logoImage(client, 'client-company-logo-chip')}<span class="logo-chip-name">${client.name}</span></a>`;
}

function storyHtml() {
  return `<div class="clients-story-panel" data-na-story="true">
    <div class="clients-story-main">
      <span class="clients-story-kicker">ENGINEERING × PARTNERSHIP</span>
      <h3>Built around the way our clients work.</h3>
      <p>Every client requirement is different. We combine engineering know-how, dependable sourcing and practical site support to help organizations keep projects moving — from airport operations and manufacturing plants to industrial, commercial and facility environments.</p>
    </div>
    <div class="clients-story-points">
      <div><strong>01</strong><span>Understand the requirement</span></div>
      <div><strong>02</strong><span>Source the right solution</span></div>
      <div><strong>03</strong><span>Deliver with site-ready support</span></div>
    </div>
  </div>`;
}

function heroDescriptionHtml() {
  return `<p data-na-hero-description="true" style="max-width:900px;margin-top:24px;font-size:18px;line-height:1.7;color:rgba(220,230,242,.82);">NA Engineering Solutions is a Pakistan-based multidisciplinary engineering and supply company providing reliable engineering services, industrial solutions, general order supplies and project support. We serve industrial, commercial, construction and facility requirements with Civil Engineering, HVAC, Mechanical & Electrical Works, PEB Works, Fire Fighting, Safety & Security Systems, maintenance, procurement and dependable material supply.</p>`;
}

function enhanceClientsPage() {
  if (window.location.pathname !== '/clients') return false;
  const grid = document.querySelector('.clients-grid');
  const logos = document.querySelector('.logos-row');
  if (!grid || !logos) return false;

  const pageHeadings = Array.from(document.querySelectorAll('h1'));
  const heroTitle = pageHeadings.find((heading) => heading.textContent.trim().toLowerCase() === 'our clients');
  if (heroTitle && !document.querySelector('[data-na-hero-description="true"]')) {
    const heroSubtitle = heroTitle.parentElement?.querySelector('p');
    if (heroSubtitle) heroSubtitle.insertAdjacentHTML('afterend', heroDescriptionHtml());
    else heroTitle.insertAdjacentHTML('afterend', heroDescriptionHtml());
  }

  if (grid.dataset.naEnhanced === 'true') return true;

  const sectionHeading = logos.parentElement?.querySelector('.section-heading');
  if (sectionHeading) {
    const paragraph = sectionHeading.querySelector('p');
    if (paragraph) paragraph.textContent = 'NA Engineering Solutions is a Pakistan-based engineering, construction, industrial supplies and general order supply company, providing reliable solutions for industrial, commercial, construction and facility requirements. We support clients with Civil Engineering, Mechanical & Electrical Works, HVAC, PEB Works, Fire Fighting, Safety & Security Systems, industrial maintenance and a wide range of engineering and general supplies. Our focus is on quality, dependable sourcing, timely delivery and long-term client relationships.';
  }

  if (!document.querySelector('.clients-story-panel')) logos.insertAdjacentHTML('afterend', storyHtml());
  grid.innerHTML = CLIENTS.map(cardHtml).join('');
  grid.dataset.naEnhanced = 'true';
  logos.innerHTML = CLIENTS.map(logoChipHtml).join('');
  logos.dataset.naEnhanced = 'true';
  return true;
}

let attempts = 0;
const boot = () => {
  if (enhanceClientsPage()) return;
  if (attempts++ < 120) window.setTimeout(boot, 100);
};
boot();
const observer = new MutationObserver(() => {
  if (window.location.pathname === '/clients') enhanceClientsPage();
});
observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener('popstate', boot);
