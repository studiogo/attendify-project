# Product Context: Attendify

## 1. Problem Domain

Webinar organizers face a significant challenge: the gap between the number of people who register for an event and the number who actually attend. Existing tools often lack effective mechanisms to keep registrants engaged and remind them effectively in the period leading up to the webinar. This leads to wasted marketing effort and lower impact for the organizers.

## 2. Core Value Proposition

Attendify aims to directly address the low attendance rate problem by providing organizers with simple, embeddable tools focused on pre-webinar engagement. The core idea is to make it extremely easy for registrants to add the event to their personal calendars, thereby increasing the likelihood of them remembering and attending.

## 3. How it Should Work (User Experience - Phase 1)

*   **Organizer:**
    *   Registers/Logs into the Attendify platform (https://attendify.pl).
    *   Creates a new event (webinar), providing details like title, description, date/time, and the webinar link.
    *   Optionally customizes the appearance (colors, logo) of the engagement widget for this specific event, or relies on their default settings.
    *   Copies a generated `<iframe>` code snippet.
    *   Pastes this iframe code onto their webinar registration confirmation page ("Thank You" page) or in confirmation emails.
    *   Tracks the effectiveness of the widget by viewing statistics on how many registrants clicked the "Add to Calendar" buttons for each event.
*   **Registrant (End User):**
    *   Registers for a webinar on the organizer's website/platform.
    *   Sees the Attendify widget embedded on the confirmation page or in an email.
    *   Clicks the button corresponding to their preferred calendar (Google, Outlook, Apple/ICS).
    *   Is either redirected to their calendar service with pre-filled event details or prompted to download an .ics file.

## 4. Key Success Metrics (Phase 1)

*   High adoption rate of the "Add to Calendar" feature by registrants interacting with the widget.
*   Positive feedback from organizers regarding ease of use.
*   Measurable increase in attendance rates for webinars using Attendify (long-term goal, tracked via organizer feedback initially).
*   Reliable tracking and reporting of widget interaction statistics.
