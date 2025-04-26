# System Patterns: Attendify

**Wersja:** 0.1
**Data:** 2025-04-26

## 1. Architektura Ogólna

Wybrana architektura to **monolit modułowy**. Główne założenia to:

*   **Separacja Warstw:** Wyraźne oddzielenie warstwy Frontend (Panel Organizatora), Backend (API) i Bazy Danych.
*   **API-First:** Backend udostępnia RESTful API pod `https://attendify.pl/api/`, które jest konsumowane przez Frontend oraz potencjalnie inne przyszłe klienty.
*   **Modułowość Kodu:** Kod backendu i frontendu powinien być zorganizowany w logiczne moduły odpowiadające funkcjonalnościom (np. Auth, Events, Analytics).
*   **Stanowość vs Bezstanowość:**
    *   Interakcje z panelem organizatora (po zalogowaniu) są stanowe (np. oparte o sesje lub tokeny JWT).
    *   Interakcje z publicznym widżetem iframe (`/widget/event/{public_id}`) oraz endpointami śledzącymi (`/track/...`) i generującymi pliki kalendarza (`/calendar/...`) są **bezstanowe**, identyfikowane przez `public_id` wydarzenia.

## 2. Główne Komponenty Systemu

*   **Frontend (Panel Organizatora):**
    *   Dostępny po zalogowaniu na `https://attendify.pl`.
    *   Aplikacja typu SPA (Single Page Application) lub tradycyjna aplikacja renderowana po stronie serwera.
    *   Komunikuje się z Backend API w celu zarządzania danymi i pobierania informacji.
*   **Backend (API):**
    *   Serwer działający pod `https://attendify.pl`.
    *   Odpowiedzialny za logikę biznesową, zarządzanie danymi, uwierzytelnianie, autoryzację.
    *   Udostępnia RESTful API (`/api/...`).
    *   Serwuje publiczny widżet iframe (`/widget/event/{public_id}`).
    *   Obsługuje endpointy śledzące kliknięcia (`/track/...`).
    *   Generuje pliki `.ics` dla kalendarzy (`/calendar/{public_id}/download.ics`).
*   **Baza Danych:**
    *   Relacyjna baza danych (preferowany PostgreSQL).
    *   Przechowuje dane użytkowników, wydarzeń, ustawień personalizacji i interakcji z widżetem.
*   **Iframe (Widżet dla Uczestnika):**
    *   Fragment HTML/CSS/JS serwowany przez Backend z `https://attendify.pl/widget/event/{public_id}`.
    *   Osadzany na zewnętrznych stronach internetowych organizatorów.
    *   Wyświetla informacje o wydarzeniu i przyciski "Dodaj do Kalendarza".
    *   Wygląd jest dynamicznie dostosowywany na podstawie ustawień personalizacji.
    *   Przyciski kierują do endpointów śledzących (`/track/...`).

## 3. Kluczowe Moduły (Faza 1) i Ich Relacje

```mermaid
graph TD
    subgraph Frontend [Panel Organizatora]
        FE_Auth[Logowanie/Rejestracja]
        FE_Events[Zarządzanie Wydarzeniami CRUD]
        FE_Iframe[Pobieranie Kodu Iframe]
        FE_Customize[Ustawienia Personalizacji]
        FE_Stats[Widok Statystyk]
    end

    subgraph Backend [API & Logika Biznesowa na https://attendify.pl]
        API_Auth[/api/auth/*]
        API_Events[/api/events/*]
        API_Settings[/api/settings/iframe]
        API_Stats[/api/events/{eventId}/stats]
        WidgetServer[/widget/event/{public_id}]
        TrackEndpoint[/track/{public_id}/{type}]
        CalendarEndpoint[/calendar/{public_id}/download.ics]

        subgraph ModulyLogiki [Moduły Logiki Wewnętrznej]
            M_Auth[Moduł Uwierzytelniania]
            M_Events[Moduł Zarządzania Wydarzeniami]
            M_Customize[Moduł Personalizacji]
            M_IframeGen[Moduł Generatora Iframe]
            M_Calendar[Moduł Obsługi Kalendarzy]
            M_Analytics[Moduł Analityki]
        end
    end

    subgraph BazaDanych [Baza Danych]
        DB_Users[users]
        DB_Events[events]
        DB_Settings[user_settings]
        DB_Interactions[widget_interactions]
    end

    subgraph IframeWidget [Widżet Iframe na Zewnętrznej Stronie]
        IframeContent[Zawartość HTML/CSS/JS]
        IframeButtons[Przyciski Kalendarza]
    end

    %% Relacje Frontend -> Backend API
    FE_Auth --> API_Auth
    FE_Events --> API_Events
    FE_Iframe --> API_Events
    FE_Customize --> API_Settings
    FE_Stats --> API_Stats

    %% Relacje Backend API -> Moduły Logiki
    API_Auth --> M_Auth
    API_Events --> M_Events
    API_Events --> M_Customize
    API_Settings --> M_Customize
    API_Stats --> M_Analytics
    WidgetServer --> M_Events
    WidgetServer --> M_Customize
    WidgetServer --> M_IframeGen
    TrackEndpoint --> M_Analytics
    TrackEndpoint --> M_Calendar
    CalendarEndpoint --> M_Calendar
    CalendarEndpoint --> M_Events

    %% Relacje Moduły Logiki -> Baza Danych
    M_Auth --> DB_Users
    M_Events --> DB_Events
    M_Events --> DB_Users
    M_Customize --> DB_Settings
    M_Customize --> DB_Events
    M_Analytics --> DB_Interactions
    M_Analytics --> DB_Events
    M_Calendar --> DB_Events

    %% Relacje Backend -> Iframe
    WidgetServer --> IframeContent

    %% Relacje Iframe -> Backend
    IframeButtons --> TrackEndpoint

```

**Opis przepływu dla widżetu:**

1.  Organizator pobiera kod `<iframe>` przez `FE_Iframe` (wołając `API_Events`).
2.  Kod zawiera `src="https://attendify.pl/widget/event/{public_id}"`.
3.  Przeglądarka użytkownika odwiedzającego stronę z iframe wysyła żądanie GET do `WidgetServer`.
4.  `WidgetServer` (korzystając z `M_Events` i `M_Customize`) pobiera dane wydarzenia i ustawienia personalizacji z `DB_Events` i `DB_Settings`.
5.  `WidgetServer` (korzystając z `M_IframeGen`) generuje i zwraca `IframeContent` (HTML/CSS/JS).
6.  Użytkownik klika przycisk w `IframeButtons`.
7.  Przeglądarka wysyła żądanie GET do `TrackEndpoint` (np. `/track/{public_id}/google`).
8.  `TrackEndpoint` (korzystając z `M_Analytics`) zapisuje interakcję w `DB_Interactions`.
9.  `TrackEndpoint` (korzystając z `M_Calendar`) generuje docelowy URL (np. link Google Calendar) lub URL do pobrania pliku `.ics` (`/calendar/...`).
10. `TrackEndpoint` wykonuje przekierowanie (302) na wygenerowany URL.
11. Jeśli celem jest plik `.ics`, przeglądarka wysyła żądanie GET do `CalendarEndpoint`.
12. `CalendarEndpoint` (korzystając z `M_Calendar` i `M_Events`) generuje i zwraca plik `.ics`.

## 4. Kluczowe Wzorce i Decyzje

*   **Publiczny Identyfikator (`public_id`):** Używany w URL-ach publicznych (`/widget`, `/track`, `/calendar`) do identyfikacji wydarzenia bez ujawniania wewnętrznego ID bazy danych. Musi być unikalny.
*   **JSONB dla Personalizacji:** Przechowywanie ustawień personalizacji (domyślnych użytkownika i nadpisanych dla wydarzenia) jako obiektów JSON w bazie danych (`iframe_defaults`, `customization_settings`) zapewnia elastyczność.
*   **Śledzenie Interakcji:** Zapisywanie każdego kliknięcia w tabeli `widget_interactions`. Należy zwrócić uwagę na wydajność zapisu i potencjalne problemy z prywatnością (GDPR) przy logowaniu IP/User-Agent. Rozważyć asynchroniczne przetwarzanie logów.
*   **Generowanie Plików `.ics`:** Dynamiczne generowanie plików `.ics` na żądanie dla kompatybilności z różnymi kalendarzami (Outlook, Apple Calendar).
*   **CORS:** Konieczność odpowiedniej konfiguracji Cross-Origin Resource Sharing (CORS) na serwerze API, aby umożliwić komunikację z frontendu (potencjalnie z innej subdomeny lub portu w trybie deweloperskim) oraz poprawne działanie widżetu iframe osadzonego na dowolnych domenach zewnętrznych.
