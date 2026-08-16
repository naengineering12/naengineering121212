# NA Engineering Solutions — Product Requirements Document

## Original Problem Statement
Build a premium, modern, professional and fully functional corporate website for NA Engineering Solutions, an engineering, construction, industrial solutions and general order supply company based in Lahore, Pakistan. The website must explain engineering services, project support and GENERAL ORDER SUPPLIES & SERVICES, with responsive pages, working navigation, quote form, imagery, social links and professional animations.

## Architecture Decisions
- React frontend with React Router, Lucide icons and CSS design system.
- FastAPI backend with MongoDB using existing MONGO_URL and DB_NAME environment variables.
- Quote requests are stored in MongoDB through POST /api/quote with optional validated attachments up to 8 MB.
- External imagery uses the selected Unsplash references; location uses a styled map card and Google Maps search link.

## Implemented
- Home, About, Services, seven service detail routes, General Order Supplies & Services, Industries and Contact pages.
- Sticky responsive header, mobile menu, footer, internal links, social links, quote CTAs, animations, metadata and mobile-safe layouts.
- Quote form with required fields, optional BOQ upload, success feedback, size and extension/MIME validation.
- Service, supply category, industry, process, mission, vision and core value content based on supplied company information.
- Footer now includes clickable phone contacts +92 300 9596393 and +92 302 6880298.
- About page now includes an image-led field-note feature section with responsive construction imagery and a company signature treatment.
- 2026-08-16: Company logo (transparent PNG processed from user upload) now shown in sticky header and footer, and used as favicon.
- 2026-08-16: "Home" added to header navigation; logo click returns to Home page.
- 2026-08-16: All 7 service images replaced with verified topic-matching photos (construction cranes, HVAC ducts, lathe machining, steel structure, power lines, fire, safety helmet).
- 2026-08-16: All 7 General Order Supplies category cards now display matching photos (industrial pump, breaker panel, tools, PPE gloves, cleaning, office desk, warehouse shelving).
- Company logo (user-provided) now replaces text branding in the sticky header and footer, served locally as a transparent, trimmed PNG at /logo.png and used as the site favicon.

## Prioritized Backlog
- P0: Connect an outbound email provider if automatic email notifications are required.
- P1: Add a private team inbox/dashboard for reviewing quote requests and attachments.
- P2: Add a downloadable company capability statement and project case-study content when approved by the company.
