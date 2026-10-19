const fs = require("fs");
const path = require("path");

const root = __dirname;
const buildDir = path.join(root, "build");
const appSource = fs.readFileSync(path.join(root, "src", "App.js"), "utf8");
const insightsSource = fs.readFileSync(path.join(root, "src", "InsightsPage.js"), "utf8");
const sitemapSource = fs.readFileSync(path.join(root, "public", "sitemap.xml"), "utf8");
const templatePath = path.join(buildDir, "index.html");

if (!fs.existsSync(templatePath)) {
  throw new Error("CRA build output was not found; run this script after the frontend build.");
}

const serviceBlock = appSource.match(/const services = \[([\s\S]*?)\n\];/)?.[1] || "";
const services = [...serviceBlock.matchAll(/\{\s*slug:"([^"]+)",\s*title:"([^"]+)"[\s\S]*?text:"([^"]+)"\s*\}/g)]
  .map((match) => ({ slug: match[1], title: match[2], description: match[3] }));

const articleBlock = insightsSource.match(/export const insightArticles = \[([\s\S]*?)\n\];/)?.[1] || "";
const articles = [...articleBlock.matchAll(/\{\s*slug:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",\s*description:\s*"([^"]+)"/g)]
  .map((match) => ({ slug: match[1], title: match[2], description: match[3] }));

if (services.length < 10 || articles.length < 5) {
  throw new Error("Could not safely read route metadata from source (services=" + services.length + ", articles=" + articles.length + ").");
}

const topLevel = {
  "/services": {
    title: "Engineering Services in Lahore | NA Engineering Solutions",
    description: "Explore civil, mechanical, electrical, HVAC, PEB, fire-fighting and other engineering services for industrial and commercial projects in Lahore."
  },
  "/supplies": {
    title: "General Order Supplies in Lahore | NA Engineering Solutions",
    description: "Source industrial materials, hardware, tools, PPE, electrical items, office supplies and facility maintenance products through one general order supplier in Lahore."
  },
  "/it-services": {
    title: "IT Services & Technology Supplies in Lahore | NA Engineering Solutions",
    description: "IT support and technology supply solutions for businesses, offices and project teams in Lahore, Pakistan."
  },
  "/industries": {
    title: "Industries We Serve | NA Engineering Solutions Lahore",
    description: "Engineering, maintenance and procurement support for industrial, commercial, construction and facility operations in Lahore and across Pakistan."
  },
  "/insights": {
    title: "Engineering & Procurement Insights | NA Engineering Solutions",
    description: "Practical guidance on general order procurement, engineering services, industrial maintenance and project supplies in Pakistan."
  },
  "/clients": {
    title: "Clients & Project Experience | NA Engineering Solutions",
    description: "Learn about the sectors and project environments supported by NA Engineering Solutions through engineering services and general order supplies."
  },
  "/contact": {
    title: "Contact NA Engineering Solutions | Lahore, Pakistan",
    description: "Contact NA Engineering Solutions in Lahore for engineering services, industrial supplies, general order procurement and project support."
  }
};

const escapeHtml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

function replaceOrInsert(html, pattern, replacement) {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace("</head>", "  " + replacement + "\n</head>");
}

function setMeta(html, attribute, key, value) {
  const safe = escapeHtml(value);
  const tag = '<meta ' + attribute + '="' + key + '" content="' + safe + '" />';
  const pattern = new RegExp('<meta\\s+' + attribute + '="' + key + '"[^>]*\\/?>', "i");
  return replaceOrInsert(html, pattern, tag);
}

function routeMetadata(route) {
  if (topLevel[route]) return { ...topLevel[route], type: "website" };

  if (route.startsWith("/services/")) {
    const slug = route.slice("/services/".length);
    const service = services.find((item) => item.slug === slug);
    if (!service) return null;
    return {
      title: service.title + " in Lahore | NA Engineering Solutions",
      description: service.description + " NA Engineering Solutions supports industrial and commercial projects in Lahore, Pakistan.",
      type: "service",
      service
    };
  }

  if (route.startsWith("/insights/")) {
    const slug = route.slice("/insights/".length);
    const article = articles.find((item) => item.slug === slug);
    if (!article) return null;
    return {
      title: article.title + " | NA Engineering Solutions",
      description: article.description,
      type: "article",
      article
    };
  }

  if (route === "/admin") {
    return { title: "Admin | NA Engineering Solutions", description: "Website administration.", noindex: true, type: "website" };
  }

  return null;
}

function makeSchema(route, page) {
  if (page.noindex) return null;
  const canonical = "https://www.naengineeringsolutions.com" + route;
  const graph = [{
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.naengineeringsolutions.com/" },
      { "@type": "ListItem", position: 2, name: page.title, item: canonical }
    ]
  }];

  if (page.type === "service" && page.service) {
    graph.push({
      "@type": "Service",
      name: page.service.title,
      description: page.description,
      serviceType: page.service.title,
      areaServed: { "@type": "City", name: "Lahore" },
      provider: {
        "@type": "ProfessionalService",
        name: "NA Engineering Solutions",
        url: "https://www.naengineeringsolutions.com/"
      },
      url: canonical
    });
  }

  if (page.type === "article" && page.article) {
    graph.push({
      "@type": "BlogPosting",
      headline: page.article.title,
      description: page.article.description,
      mainEntityOfPage: canonical,
      author: { "@type": "Organization", name: "NA Engineering Solutions" },
      publisher: {
        "@type": "Organization",
        name: "NA Engineering Solutions",
        logo: { "@type": "ImageObject", url: "https://www.naengineeringsolutions.com/logo.png" }
      }
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function renderPage(route, page, template) {
  const canonical = "https://www.naengineeringsolutions.com" + route;
  let html = template;
  html = replaceOrInsert(html, /<title>[\s\S]*?<\/title>/i, "<title>" + escapeHtml(page.title) + "</title>");
  html = setMeta(html, "name", "description", page.description);
  html = setMeta(html, "name", "robots", page.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
  html = setMeta(html, "property", "og:type", page.type === "article" ? "article" : "website");
  html = setMeta(html, "property", "og:title", page.title);
  html = setMeta(html, "property", "og:description", page.description);
  html = setMeta(html, "property", "og:url", canonical);
  html = setMeta(html, "name", "twitter:title", page.title);
  html = setMeta(html, "name", "twitter:description", page.description);
  html = replaceOrInsert(html, /<link\s+rel=["']canonical["'][^>]*\/?>/i, '<link rel="canonical" href="' + canonical + '" />');

  const schema = makeSchema(route, page);
  const schemaTag = schema
    ? '<script id="route-seo-schema" type="application/ld+json">' + JSON.stringify(schema) + '</script>'
    : "";
  const existingSchema = /<script\s+id=["']route-seo-schema["'][\s\S]*?<\/script>/i;
  if (existingSchema.test(html)) {
    html = html.replace(existingSchema, schemaTag);
  } else if (schemaTag) {
    html = html.replace("</head>", "  " + schemaTag + "\n</head>");
  }

  const relative = route.replace(/^\/+/, "");
  const output = path.join(buildDir, "seo-pages", relative + ".html");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html, "utf8");
  return output;
}

const routes = [...sitemapSource.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname)
  .filter((route) => route !== "/");
routes.push("/admin");

let generated = 0;
const template = fs.readFileSync(templatePath, "utf8");
for (const route of [...new Set(routes)]) {
  const page = routeMetadata(route);
  if (!page) {
    console.warn("Skipped route without explicit metadata: " + route);
    continue;
  }
  renderPage(route, page, template);
  generated += 1;
}

if (generated < 25) {
  throw new Error("Expected at least 25 SEO route snapshots but generated only " + generated + ".");
}
console.log("Generated " + generated + " route-specific static HTML metadata snapshots.");
