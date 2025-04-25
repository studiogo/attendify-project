# Active Context: Attendify (Initialization)

## 1. Current Work Focus

*   Initializing the project structure and Memory Bank based on the provided Technical Documentation (Version 0.3).
*   Establishing the foundational understanding of the project requirements, architecture, and technical plan for Phase 1.

## 2. Recent Changes

*   Created initial Memory Bank files:
    *   `projectbrief.md`
    *   `productContext.md`
    *   `systemPatterns.md`
    *   `techContext.md`
*   Confirmed the project domain: `https://attendify.pl`.

## 3. Immediate Next Steps (Post Stack Selection)

1.  **Setup Development Environment:** Configure local development setup for Django (Python), Vue.js (Node.js/npm/yarn), and PostgreSQL. Set up version control (Git repository). Plan Docker configurations.
2.  **Implement Core Modules (Phase 1):** Begin development, likely starting with:
    *   Django Project/App Structure Setup
    *   Auth Module (User registration/login - Django models, views, potentially DRF endpoints)
    *   Events Module (CRUD operations - Django models, views, DRF endpoints)
3.  **Server Configuration Planning:** Outline steps for VPS setup tailored for Django/Vue/Postgres deployment (e.g., Nginx/Gunicorn, Node.js for Vue build, Postgres installation/configuration), including DNS, HTTPS (Let's Encrypt), and CORS.

## 4. Active Decisions & Considerations

*   **Architecture:** Modular Monolith confirmed.
*   **Domain:** `https://attendify.pl` confirmed.
*   **Phase 1 Scope:** Clearly defined.
*   **Technology Stack:** **Finalized**
    *   Backend: Python / Django
    *   Database: PostgreSQL
    *   Frontend Panel: Vue.js
    *   Iframe Widget: Alpine.js
*   **Key Considerations (from `techContext.md`):** Security, Scalability (`/track` endpoint), Time Zones, GDPR, CORS remain critical focus areas during implementation.
