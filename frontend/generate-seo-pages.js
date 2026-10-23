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
const articles = [...articleBlock.matchAll(/\{\s*slug:\s*"([^"]+)",\s*category:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",\s*seoTitle:\s*"([^"]+)",\s*description:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)",\s*imageAlt:\s*"([^"]+)"/g)]
  .map((match) => ({
    slug: match[1],
    category: match[2],
    title: match[3],
    seoTitle: match[4],
    description: match[5],
    image: match[6],
    imageAlt: match[7]
  }));

if (services.length < 10 || articles.length < 5) {
  throw new Error("Could not safely read route metadata from source (services=" + services.length + ", articles=" + articles.length + ").");
}

const topLevel = {
  "/": {
    title: "NA Engineering Solutions | Engineering Services & Supplies in Lahore",
    description: "NA Engineering Solutions provides engineering consultancy, civil and mechanical works, HVAC, electrical installation, PEB, fire protection, industrial maintenance and General Order Supplies & Services in Lahore, Pakistan."
  },
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
  "/blog": {
    title: "Engineering & Industrial Blog | NA Engineering Solutions",
    description: "Practical engineering guides, industrial maintenance checklists, HVAC tips, PEB planning and general order procurement advice for businesses in Pakistan.",
    image: "https://images.pexels.com/photos/10202865/pexels-photo-10202865.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
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
    const serviceTitleOverrides = {
      "boiler-chemicals": "Boiler Chemicals in Lahore | NA Engineering Solutions"
    };
    const serviceDescriptionOverrides = {
      "boiler-chemicals": "NA Engineering Solutions supplies boiler water treatment chemicals, dosing systems and testing support for industrial boilers in Lahore, Pakistan."
    };
    return {
      title: serviceTitleOverrides[slug] || (service.title + " in Lahore | NA Engineering Solutions"),
      description: serviceDescriptionOverrides[slug] || (service.description + " NA Engineering Solutions supports industrial and commercial projects in Lahore, Pakistan."),
      type: "service",
      service
    };
  }

  if (route.startsWith("/blog/")) {
    const slug = route.slice("/blog/".length);
    const article = articles.find((item) => item.slug === slug);
    if (!article) return null;
    return {
      title: article.seoTitle || (article.title + " | NA Engineering Solutions"),
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
  if (page.noindex || route === "/") return null;
  const canonical = "https://www.naengineeringsolutions.com" + route;
  const graph = [{
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.naengineeringsolutions.com/" },
      { "@type": "ListItem", position: 2, name: page.title, item: canonical }
    ]
  }];

  if (route === "/blog") {
    graph.push({
      "@type": "Blog",
      name: "NA Engineering Solutions Blog",
      description: page.description,
      url: canonical,
      inLanguage: "en-PK",
      blogPost: articles.map((article) => ({
        "@type": "BlogPosting",
        headline: article.title,
        description: article.description,
        url: "https://www.naengineeringsolutions.com/blog/" + article.slug,
        image: [article.image],
        articleSection: article.category,
        inLanguage: "en-PK",
        author: { "@type": "Organization", name: "NA Engineering Solutions" },
        publisher: {
          "@type": "Organization",
          name: "NA Engineering Solutions",
          logo: { "@type": "ImageObject", url: "https://www.naengineeringsolutions.com/logo.png" }
        }
      }))
    });
  }

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
      image: [page.article.image],
      articleSection: page.article.category,
      keywords: [page.article.category, "engineering", "industrial maintenance", "general order supplies", "Lahore"],
      inLanguage: "en-PK",
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
  const socialImage = page.article?.image || page.image || "https://www.naengineeringsolutions.com/logo.png";
  const socialImageAlt = page.article?.imageAlt || "NA Engineering Solutions engineering blog";
  html = setMeta(html, "property", "og:image", socialImage);
  html = setMeta(html, "property", "og:image:alt", socialImageAlt);
  html = setMeta(html, "name", "twitter:image", socialImage);
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

  // Replace the source homepage hero with a route-specific, visible page intro.
  // This gives crawlers a semantic H1 in the initial HTML before the React app mounts.
  if (route !== "/") {
    const fallbackStartIndex = html.indexOf('<section class="hero">');
    if (fallbackStartIndex >= 0) {
      const fallbackEndIndex = html.indexOf("</section>", fallbackStartIndex);
      if (fallbackEndIndex >= 0) {
        let eyebrow = "NA ENGINEERING SOLUTIONS";
        let heading = page.service?.title || page.article?.title || page.title.split(" | ")[0];
        let intro = page.description || "";

        if (route === "/services") {
          eyebrow = "CAPABILITIES / 01";
          heading = "Engineering services in Lahore";
          intro = "We provide practical engineering and maintenance support for factories, commercial facilities and project sites, covering civil, mechanical, electrical, HVAC, PEB, fire fighting, waterproofing and industrial work.";
        } else if (route === "/supplies") {
          eyebrow = "GENERAL ORDER / 01";
          heading = "General Order Supplies in Lahore";
        } else if (route === "/it-services") {
          eyebrow = "IT SERVICES / 01";
          heading = "IT Services & Equipment in Lahore";
        } else if (route === "/industries") {
          eyebrow = "INDUSTRIES / 01";
          heading = "Industries We Serve";
        } else if (route === "/clients") {
          eyebrow = "OUR CLIENTS / 01";
          heading = "Our Clients & Project Experience";
        } else if (route === "/contact") {
          eyebrow = "CONTACT / 01";
          heading = "Contact NA Engineering Solutions";
        } else if (route === "/blog") {
          eyebrow = "ENGINEERING / INDUSTRIAL INSIGHTS";
          heading = "Engineering & Industrial Blog";
        } else if (route.startsWith("/services/")) {
          eyebrow = "SERVICES / " + (page.service?.title || "ENGINEERING").toUpperCase();
          heading = page.service?.title || heading;
        } else if (route.startsWith("/blog/")) {
          eyebrow = "ENGINEERING / INDUSTRIAL INSIGHTS";
          heading = page.article?.title || heading;
        }

        const staticIntro = route === "/admin"
          ? ""
          : '<section class="page-intro"><div class="site-container"><span class="eyebrow">' + escapeHtml(eyebrow) + '</span><h1 data-testid="page-heading">' + escapeHtml(heading) + '</h1><p>' + escapeHtml(intro) + '</p></div></section>';
        html = html.slice(0, fallbackStartIndex) + staticIntro + html.slice(fallbackEndIndex + "</section>".length);
      }
    }
  }

  const relative = route.slice(1);
  const output = path.join(buildDir, "seo-pages", relative + ".html");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html, "utf8");
  return output;
}

const sitemapRoutes = [...sitemapSource.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((match) => match[1].replace("https://www.naengineeringsolutions.com", "") || "/");
const routes = sitemapRoutes.filter((route) => route !== "/");
const expectedBlogRoutes = ["/blog", ...articles.map((article) => "/blog/" + article.slug)];
const missingBlogRoutes = expectedBlogRoutes.filter((route) => !routes.includes(route));
const oldInsightsRoutes = routes.filter((route) => route === "/insights" || route.startsWith("/insights/"));

if (missingBlogRoutes.length) {
  throw new Error("Blog sitemap is missing canonical URLs: " + missingBlogRoutes.join(", "));
}
if (oldInsightsRoutes.length) {
  throw new Error("Sitemap must use canonical /blog URLs, not legacy /insights URLs.");
}
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

const expectedSnapshotCount = new Set(routes).size;
if (generated !== expectedSnapshotCount) {
  throw new Error("Expected " + expectedSnapshotCount + " route snapshots but generated only " + generated + ".");
}
console.log("Generated " + generated + " route-specific static HTML metadata snapshots.");
