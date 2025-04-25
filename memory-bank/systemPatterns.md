# System Patterns: Attendify

## 1. Core Architecture: Modular Monolith

The proposed architecture for Attendify (https://attendify.pl) is a **Modular Monolith**. This approach aims to balance the development speed of a monolith with the organizational benefits of modularity, allowing for clearer separation of concerns and easier future scaling or potential extraction of services if needed.

## 2. Key Architectural Principles

*   **Layer Separation:** Clear distinction between the Frontend (Organizer Panel), Backend (API), and Data Persistence (Database) layers.
*   **API-First:** The backend exposes a RESTful API (at https://attendify.pl/api/...) which serves as the primary interface for the frontend panel and potentially future clients. The iframe widget interacts with separate, dedicated public endpoints.
*   **Modularity:** The backend codebase is organized into distinct modules, each responsible for a specific domain (e.g., Auth, Events, Analytics). This promotes maintainability and independent development.
*   **State Management:**
    *   Organizer Panel interactions are stateful, likely managed via session cookies or JWT tokens obtained during login.
    *   Iframe widget interactions are designed to be stateless from the user's perspective, relying on a unique public identifier (`public_id`) embedded in the widget's URL (e.g., `https://attendify.pl/widget/event/{public_id}`). Tracking endpoints also use this `public_id`.

## 3. Major Components

*   **Frontend (Organizer Panel):** A web application (likely SPA, but could be server-rendered) accessible after login at https://attendify.pl. Used by organizers to manage their account and events.
*   **Backend (API Server):** The core application logic resides here, running on the server hosting https://attendify.pl. It handles:
    *   Business logic (user management, event CRUD, etc.).
    *   Data persistence operations.
    *   Serving the RESTful API for the organizer panel.
    *   Generating and serving the iframe widget content.
    *   Handling calendar file generation (.ics).
    *   Processing tracking requests from the widget.
    *   Providing analytics data via the API.
*   **Database:** A relational database (PostgreSQL recommended) storing all persistent data (users, events, settings, interactions).
*   **Iframe Widget (Participant Facing):** A self-contained snippet of HTML, CSS, and JavaScript served from a public endpoint (e.g., `https://attendify.pl/widget/event/{public_id}`). This is embedded on external organizer websites. It displays event info and calendar buttons which link to tracking endpoints.

## 4. Phase 1 Modules (Backend Focus)

*   **Auth:** Handles organizer registration, login, session/token management.
*   **Events:** Manages CRUD operations for webinar events. Links events to users and customization settings. Generates `public_id`.
*   **Customization:** Stores and applies iframe appearance settings (user defaults and event-specific overrides).
*   **IframeGenerator:** Responsible for generating the `<iframe>` embed code snippet for organizers.
*   **Calendar:**
    *   Provides the public endpoint (`/widget/event/{public_id}`) that serves the actual HTML/CSS/JS for the iframe.
    *   Generates Google Calendar links.
    *   Generates and serves `.ics` files via a dedicated endpoint (`/calendar/{public_id}/download.ics`).
*   **Analytics:**
    *   Provides public tracking endpoints (`/track/{public_id}/{type}`) that log interactions.
    *   Handles redirection from tracking endpoints to the actual calendar links or .ics download.
    *   Provides API endpoints (`/api/events/{eventId}/stats`) for organizers to retrieve interaction statistics.

## 5. Key Interactions Flow (Add to Calendar)

1.  Organizer embeds `<iframe src="https://attendify.pl/widget/event/{public_id}">` on their site.
2.  Registrant views the page with the iframe.
3.  Browser requests `https://attendify.pl/widget/event/{public_id}`.
4.  Backend serves the personalized iframe HTML/CSS/JS (Calendar Module).
5.  Registrant clicks a calendar button (e.g., Google).
6.  Button link points to `https://attendify.pl/track/{public_id}/google`.
7.  Browser requests the tracking URL.
8.  Backend logs the interaction (Analytics Module) including `event_id` (looked up via `public_id`), type ('google'), timestamp, etc. (respecting GDPR).
9.  Backend generates the appropriate Google Calendar link.
10. Backend responds with an HTTP 302 Redirect to the Google Calendar link.
11. Browser follows the redirect.
