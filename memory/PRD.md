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
- Footer now includes clickable phone contacts +92 300 8596393 and +92 302 6880398 (updated 2026-08-16; WhatsApp button also uses the first number).
- About page now includes an image-led field-note feature section with responsive construction imagery and a company signature treatment.
- 2026-08-16: Company logo (transparent PNG processed from user upload) now shown in sticky header and footer, and used as favicon.
- 2026-08-16: "Home" added to header navigation; logo click returns to Home page.
- 2026-08-16: All 7 service images replaced with verified topic-matching photos (construction cranes, HVAC ducts, lathe machining, steel structure, power lines, fire, safety helmet).
- 2026-08-16: All 7 General Order Supplies category cards now display matching photos (industrial pump, breaker panel, tools, PPE gloves, cleaning, office desk, warehouse shelving).
- 2026-08-16: AI chat assistant (NA Assistant) added sitewide — floating widget, streaming GPT-5.4 replies via Emergent universal key through POST /api/chat (SSE), conversation history stored in MongoDB chat_messages.
- 2026-08-16: Motion/design upgrade — Lenis smooth scrolling, framer-motion masked line-by-line hero reveal with parallax, page-intro reveals, scroll-reveal sections, slow editorial marquee strip.
- 2026-08-16: "Why NA Engineering" section restyled from dark navy to a warm sand gradient with white cards per user request.
- 2026-08-16: Industries page rebuilt — all 11 industries now have matching photos and short description cards.
- 2026-08-16: Fixed "Can't resolve 'lenis'" compile error (frontend restart after yarn add lenis).
- 2026-08-16: WhatsApp tap-to-chat button (wa.me/923009596393) added beside the AI assistant.
- 2026-08-16: Private admin dashboard at /admin — JWT login (env credentials), quote requests table, chat conversation viewer. Endpoints: POST /api/admin/login, GET /api/admin/quotes, GET /api/admin/chats.
- 2026-08-16: Resend email notification on quote submission is code-complete and config-ready; activates when RESEND_API_KEY is added to backend/.env (currently logs a skip, quotes still save).
- 2026-08-16: Attachments now stored in Emergent object storage (na-engineering/uploads/...); admins download the real BOQ file from the dashboard via GET /api/admin/files/{quote_id} (verified byte-for-byte).
- 2026-08-16: Read/unread follow-up tracking — PATCH /api/admin/quotes/{id}/handled plus a "Mark handled / Handled ✓" toggle in the dashboard Status column.
- 2026-08-16: Gemini AI added — chat widget now has a GPT / Gemini model switcher; /api/chat accepts model="gpt" (gpt-5.4) or "gemini" (gemini-3.5-flash), both streaming via Emergent universal key.
- 2026-08-16: About page — sparkle icons removed from Core Values; Our Process rebuilt as 6 image cards with explanations, moved above Core Values.
- 2026-08-17: New "Our Clients" page at /clients (in header nav + footer) — 6 client cards, project showcase with images, animated stat counters, Why Clients Choose Us cards, hover gallery, testimonials, CTA with Get a Free Quote / Contact Us / WhatsApp Us buttons.
- Company logo (user-provided) now replaces text branding in the sticky header and footer, served locally as a transparent, trimmed PNG at /logo.png and used as the site favicon.

## Prioritized Backlog
- P0: Connect an outbound email provider if automatic email notifications are required.
- P1: Add a private team inbox/dashboard for reviewing quote requests and attachments.
- P2: Add a downloadable company capability statement and project case-study content when approved by the company.
- 2026-08-21: Repo imported to preview. Restored missing .env files (backend MONGO_URL/DB_NAME/CORS_ORIGINS + EMERGENT_LLM_KEY; frontend REACT_APP_BACKEND_URL). Fixed missing </> fragment in About(); installed 'resend' module.
- 2026-08-21: AI chat endpoint (/api/chat) rewritten to use emergentintegrations LlmChat (openai/gpt-5.4) with Emergent universal key; SSE streaming + MongoDB persistence verified by testing agent.
- 2026-08-21: Quote endpoint (/api/quote) made MongoDB-primary; email via Resend is now best-effort (no longer 503 when RESEND_API_KEY absent). Verified.
- 2026-08-21: Mechanical Engineering service image replaced with an on-topic machinery photo.
- 2026-08-21: Added 9 new services to the Services page (below Fire Fighting) as cards with detail pages + bullet lists: Mechanical & Electrical Supplies, Utilities & Facility Maintenance, Boiler Chemicals, Seamless MS & SS Pipes, WWTP, HVAC Systems Supplies, Fire Fighting Equipment, Waterproofing Solutions, Pumps/Valves/Pneumatic. Services page now lists 15 services.
- 2026-08-21: REMOVED all Python build-patch scripts. Baked their effects into source (services array, detailFeatures, services hover CSS). Both package.json "build" and frontend/vercel.json buildCommand are now plain "craco build"; deleted 9 .py patch files. Production build verified passing (CI=true).
