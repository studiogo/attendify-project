# Project Progress: Attendify (Initialization)

## 1. Current Status

*   Project initialization phase complete.
*   Memory Bank core files created based on Technical Documentation v0.3.
*   Domain confirmed: `https://attendify.pl`.
*   Phase 1 scope and requirements are documented.
*   Technology stack options are identified, but final choices are pending.
*   No code implementation has started yet.

## 2. What Works

*   N/A (Project not yet implemented)

## 3. What's Left to Build (Phase 1 Focus)

*   **Core Backend Modules:**
    *   Authentication (Registration, Login, Token Management)
    *   Event Management (CRUD for events)
    *   Iframe Customization (User defaults & event overrides)
    *   Calendar Functionality (Google Link generation, .ics file generation/serving)
    *   Basic Analytics (Tracking endpoint `/track/...`, Statistics API `/api/events/.../stats`)
    *   Iframe Generator/Server (`/widget/event/...` endpoint)
*   **Frontend Organizer Panel:**
    *   Login/Registration UI
    *   Dashboard
    *   Event List View (with actions: Edit, Delete, Copy Iframe Code, View Stats)
    *   Event Create/Edit Form (including customization options)
    *   Account Settings / Default Iframe Customization View
    *   Event Statistics View
*   **Iframe Widget:**
    *   Display event information.
    *   Apply customization settings.
    *   Include functional "Add to Calendar" buttons linking to `/track/...`.
*   **Infrastructure & Deployment:**
    *   Finalize technology stack selection.
    *   Set up development environment.
    *   Configure VPS server (DNS, Web Server, HTTPS, CORS).
    *   Implement CI/CD pipeline (optional but recommended).
    *   Deploy Phase 1 to `https://attendify.pl`.

## 4. Known Issues & Considerations

*   **GDPR Compliance:** Careful handling of `ip_address` and `user_agent` in `widget_interactions` is required. Need clear policies and potentially consent mechanisms.
*   **`/track` Endpoint Performance:** High potential for traffic. Requires optimization, likely asynchronous processing and efficient database writes/indexing.
*   **CORS Configuration:** Needs careful setup for both the API (allowing frontend access) and public endpoints (allowing access from any domain embedding the iframe).
*   **Time Zone Handling:** Consistent use of UTC in the backend and database is crucial.
*   **Security:** Requires diligent implementation of security best practices (Input validation, AuthZ/AuthN, HTTPS, etc.).
