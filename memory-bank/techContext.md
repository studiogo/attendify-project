# Technical Context: Attendify

## 1. Selected Technology Stack (v0.3 - Finalized)

*   **Backend:** **Python / Django**
    *   *Rationale:* Batteries-included framework (ORM, Admin, Auth), strong modularity via "apps", good ecosystem (DRF, Celery), scales well. Chosen for rapid development of Phase 1 features.
*   **Database:** **PostgreSQL** (Recommended choice)
    *   *Rationale:* Robust, good performance with Django, excellent JSONB support for customization fields.
*   **Frontend (Organizer Panel):** **Vue.js**
    *   *Rationale:* Good developer experience, performant, flexible, well-suited for SPA development. Chosen for faster panel development.
*   **Iframe Widget:** **Alpine.js**
    *   *Rationale:* Extremely lightweight, declarative, simple integration with server-rendered HTML, minimal overhead for embedded widget.
*   **Hosting:** VPS (Confirmed requirement). Docker is suggested for containerization.
*   **Infrastructure/Other:**
    *   Git for version control.
    *   CI/CD pipeline (to be defined).
    *   Consideration for a task queue (e.g., Celery, Redis Queue) for handling `/track` requests asynchronously to ensure performance, especially under load.
    *   Web Server (e.g., Nginx, Apache) for serving the application and handling HTTPS.
    *   SSL Certificate (e.g., Let's Encrypt) for `https://attendify.pl`.

## 2. Data Model (Phase 1 Schema)

*   **`users`**: Stores organizer account information.
    *   `id`: Primary Key
    *   `email`: VARCHAR (Unique, Indexed)
    *   `password_hash`: VARCHAR
    *   `full_name`: VARCHAR (Optional)
    *   `created_at`: TIMESTAMPTZ
    *   `updated_at`: TIMESTAMPTZ
*   **`events`**: Stores details about each webinar event.
    *   `id`: Primary Key
    *   `user_id`: Foreign Key to `users.id` (Indexed)
    *   `title`: VARCHAR
    *   `description`: TEXT
    *   `start_datetime`: TIMESTAMPTZ
    *   `end_datetime`: TIMESTAMPTZ
    *   `webinar_url`: VARCHAR
    *   `public_id`: VARCHAR (Unique, Indexed - used in widget/tracking URLs)
    *   `customization_settings`: JSONB (Stores event-specific iframe overrides)
    *   `created_at`: TIMESTAMPTZ
    *   `updated_at`: TIMESTAMPTZ
*   **`user_settings`**: Stores default iframe customization for each user.
    *   `id`: Primary Key
    *   `user_id`: Foreign Key to `users.id` (Unique)
    *   `iframe_defaults`: JSONB (Stores default iframe appearance settings)
    *   `updated_at`: TIMESTAMPTZ
*   **`widget_interactions`**: Logs clicks on the "Add to Calendar" buttons.
    *   `id`: Primary Key (BIGSERIAL or UUID recommended for high volume)
    *   `event_id`: Foreign Key to `events.id` (Indexed)
    *   `interaction_type`: ENUM or VARCHAR (e.g., 'google', 'ics', 'outlook')
    *   `ip_address`: VARCHAR (Nullable - **GDPR Consideration**: Collect only if necessary and with justification/consent)
    *   `user_agent`: TEXT (Nullable - **GDPR Consideration**)
    *   `clicked_at`: TIMESTAMPTZ (Indexed)

## 3. API Endpoints (Phase 1 - `https://attendify.pl/api/...`)

*Authentication (`/api/auth/...`)*
    *   `POST /register`: New user registration (No Auth Required)
    *   `POST /login`: User login, returns JWT/session token (No Auth Required)
    *   `POST /logout`: Invalidate current session/token (Auth Required)
    *   `GET /me`: Get details of the currently logged-in user (Auth Required)

*Event Management (`/api/events/...`)*
    *   `POST /`: Create a new event (Auth Required)
    *   `GET /`: List events for the logged-in user (Auth Required)
    *   `GET /{eventId}`: Get details of a specific event (Auth Required)
    *   `PUT /{eventId}`: Update an event (including `customization_settings`) (Auth Required)
    *   `DELETE /{eventId}`: Delete an event (Auth Required)
    *   `GET /{eventId}/iframe-code`: Get the HTML embed code for the iframe (Auth Required)
        *   *Response:* `{ "iframe_html": "<iframe src='https://attendify.pl/widget/event/{public_id}' ...></iframe>" }`
    *   `GET /{eventId}/stats`: Get interaction statistics for an event (Auth Required)
        *   *Response:* `{ "total_clicks": ..., "clicks_by_type": {...}, "clicks_timeline": [...] }`

*Settings (`/api/settings/...`)*
    *   `GET /iframe`: Get user's default iframe customization settings (Auth Required)
    *   `PUT /iframe`: Update user's default iframe customization settings (Auth Required)

## 4. Public Endpoints (No Auth Required)

*   `GET https://attendify.pl/widget/event/{public_id}`: Serves the actual iframe content (HTML/CSS/JS). Fetches event data and customization based on `public_id`. Buttons link to `/track/...` endpoints.
*   `GET https://attendify.pl/track/{public_id}/{type}`: Tracks a click (`type` = 'google', 'ics', 'outlook').
    *   Logs the interaction in `widget_interactions`.
    *   Performs a 302 Redirect to the appropriate calendar URL or `/calendar/{public_id}/download.ics`.
*   `GET https://attendify.pl/calendar/{public_id}/download.ics`: Generates and serves the `.ics` calendar file for the event associated with `public_id`.

## 5. Key Technical Considerations

*   **Security:**
    *   Standard web vulnerabilities: CSRF, XSS prevention.
    *   Secure password hashing.
    *   Input validation on all API endpoints and forms.
    *   Proper authorization checks (ensure users can only access/modify their own data).
    *   JWT/Session security best practices.
    *   Rate limiting on public endpoints (especially `/track`) and auth endpoints.
    *   HTTPS enforcement across the entire `attendify.pl` domain.
    *   **CORS:** API (`/api/...`) needs to be configured to allow requests from the frontend domain (likely `https://attendify.pl` itself, but confirm based on frontend deployment). Public endpoints (`/widget`, `/track`, `/calendar`) need permissive CORS headers to allow embedding and interaction from *any* domain where the iframe might be placed.
*   **Scalability:**
    *   Database indexing is crucial, especially on foreign keys and fields used in lookups (`events.public_id`, `widget_interactions.event_id`, `widget_interactions.clicked_at`).
    *   Optimize database queries, particularly for statistics aggregation.
    *   Consider read replicas for the database if analytics load becomes heavy.
    *   Asynchronous processing for `/track` endpoint is highly recommended to avoid blocking and ensure fast response times for the user clicking the widget button.
*   **Time Zones:** Store all date/time information in the database in UTC. Perform conversions to the user's local time zone (or the event's specified time zone, if added later) in the backend API or frontend as needed. The `.ics` file standard requires UTC times or floating times with timezone information.
*   **GDPR/Privacy:**
    *   Minimize collection of personal data in `widget_interactions`. Avoid logging IP addresses and User Agents unless strictly necessary and legally justified (e.g., for abuse prevention). If collected, ensure clear communication in privacy policy and obtain consent if required.
    *   Provide clear Privacy Policy and Terms of Service.
*   **Performance:**
    *   Optimize the `/track` endpoint for speed. Logging should be fast (consider async).
    *   Cache aggregated statistics if generation is slow.
    *   Keep the iframe widget JavaScript lightweight.
