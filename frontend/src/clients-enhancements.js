const CLIENTS = [
  { name: "Gerry's dnata", category: "Aviation & Ground Handling", initials: "GD", domain: "gerrysdnata.com", href: "https://www.gerrysdnata.com/", description: "Ground handling, cargo and airport support services across Pakistan." },
  { name: "Interloop Limited", category: "Textile Manufacturing", initials: "IL", domain: "interloop-pk.com", href: "https://interloop-pk.com/", description: "Engineering, facility and industrial support for large-scale textile manufacturing." },
  { name: "Lahore International Airport", category: "Aviation & Infrastructure", initials: "LA", domain: "airportauthority.com.pk", href: "#", description: "Facility, engineering and technical support for airport operations." },
  { name: "Sialkot International Airport", category: "Aviation & Infrastructure", initials: "SA", domain: "sial.com.pk", href: "https://www.sial.com.pk/", description: "Maintenance, engineering and supply support for airport infrastructure." },
  { name: "Multan International Airport", category: "Aviation & Infrastructure", initials: "MA", domain: "multaninternationalairport.com", href: "#", description: "Technical, maintenance and supply support for airport operations." },
  { name: "Joyland Group", category: "Recreation & Entertainment", initials: "JG", domain: "joyland.com.pk", href: "https://joyland.com.pk/", description: "Facility engineering, maintenance and operational support." },
  { name: "Lake City", category: "Real Estate & Facilities", initials: "LC", domain: "lakecitylahore.com", href: "https://www.lakecitylahore.com/", description: "Engineering, facility maintenance and site support for real estate operations." },
  { name: "Fatima Fertilizer", category: "Fertilizer & Industrial", initials: "FF", domain: "fatimafertilizer.com", href: "https://fatimafertilizer.com/", description: "Industrial engineering, maintenance and supply support for fertilizer operations." },
  { name: "ZIC Oil", category: "Lubricants & Industrial", initials: "ZIC", domain: "zicoil.pk", href: "https://zicoil.pk/", description: "Industrial lubricant and facility support requirements." },
  { name: "Dandot Cement", category: "Cement & Construction Materials", initials: "DC", domain: "dandotcement.com", href: "https://www.dandotcement.com/", description: "Mechanical, electrical and industrial support for cement plant environments." },
  { name: "Nimir Chemicals", category: "Chemical & Industrial", initials: "NC", domain: "nimirchemicals.com", href: "https://nimirchemicals.com/", description: "Industrial supplies, maintenance and engineering support for chemical processing." },
];

const logoUrl = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

function cardHtml(client, index) {
  const external = client.href !== '#';
  return `<a class="client-card client-card-enhanced" href="${client.href}" ${external ? 'target="_blank" rel="noreferrer"' : ''} aria-label="${client.name}">
    <div class="client-logo-wrap"><span class="client-logo-fallback">${client.initials}</span><img src="${logoUrl(client.domain)}" alt="${client.name} logo" loading="lazy" onerror="this.style.display='none'" /></div>
    <span class="client-ind">${client.category}</span>
    <h3>${client.name}</h3>
    <p>${client.description}</p>
    ${external ? '<span class="client-card-arrow">↗</span>' : ''}
  </a>`;
}

function logoChipHtml(client) {
  return `<a class="logo-chip logo-chip-enhanced" href="${client.href}" ${client.href !== '#' ? 'target="_blank" rel="noreferrer"' : ''} title="${client.name}"><span class="logo-mono">${client.initials}</span><img src="${logoUrl(client.domain)}" alt="${client.name} logo" loading="lazy" onerror="this.style.display='none'"/><span class="logo-chip-name">${client.name}</span></a>`;
}

function enhanceClientsPage() {
  if (window.location.pathname !== '/clients') return false;
  const grid = document.querySelector('.clients-grid');
  const logos = document.querySelector('.logos-row');
  if (!grid || !logos) return false;
  if (grid.dataset.naEnhanced === 'true') return true;
  grid.innerHTML = CLIENTS.map(cardHtml).join('');
  logos.innerHTML = CLIENTS.map(logoChipHtml).join('');
  grid.dataset.naEnhanced = 'true';
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
