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

## Prioritized Backlog
- P0: Connect an outbound email provider if automatic email notifications are required.
- P1: Add a private team inbox/dashboard for reviewing quote requests and attachments.
- P2: Add a downloadable company capability statement and project case-study content when approved by the company.
