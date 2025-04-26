# Tech Context: Attendify

**Wersja:** 0.1
**Data:** 2025-04-26

## 1. Wybrany Stos Technologiczny

*   **Backend:** **Python (Django)**
    *   *Uzasadnienie:* Dojrzały framework "batteries-included", wspiera szybki rozwój, promuje czystą architekturę, duża społeczność, dobry dla API-First i SaaS.
*   **Baza Danych:** **MySQL / MariaDB**
    *   *Uzasadnienie:* Dostępna w systemie (MariaDB 10.6.21), popularna, dobrze wspierana przez Django, wystarczająca dla potrzeb Fazy 1. (Uwaga: JSONField w Django na MySQL może mieć pewne ograniczenia w porównaniu do JSONB w PostgreSQL, ale powinno być wystarczające).
*   **Frontend (Panel Organizatora):** **React**
    *   *Uzasadnienie:* Najpopularniejsza biblioteka UI, ogromny ekosystem komponentów, elastyczność, wydajność, komponentowa architektura wspierająca rozbudowę.
*   **Iframe (Widżet):**
    *   HTML
    *   CSS
    *   JavaScript (Vanilla JS lub lekki framework np. Alpine.js, Preact) - priorytetem jest niski rozmiar i szybkość ładowania.
*   **Hosting:**
    *   **VPS (potwierdzony)**
    *   **Docker** (do konteneryzacji aplikacji)
*   **Inne Narzędzia:**
    *   **Git** (kontrola wersji)
    *   **CI/CD** (rozważyć wdrożenie dla automatyzacji testów i deploymentu)
    *   **Kolejkowanie (Opcjonalnie):** Rozważyć użycie (np. Celery z Redis/RabbitMQ, Redis Queue) dla asynchronicznego przetwarzania zadań śledzenia kliknięć (`/track`), aby odciążyć główny wątek aplikacji i zapewnić szybką odpowiedź endpointu.

## 2. Model Danych (Schemat Bazy Danych - Faza 1)

*   **`users`**:
    *   `id`: Primary Key (np. SERIAL, UUID)
    *   `email`: VARCHAR, UNIQUE, NOT NULL
    *   `password_hash`: VARCHAR, NOT NULL
    *   `full_name`: VARCHAR, nullable
    *   `created_at`: TIMESTAMPTZ, default NOW()
    *   `updated_at`: TIMESTAMPTZ, default NOW()
*   **`events`**:
    *   `id`: Primary Key (np. SERIAL, UUID)
    *   `user_id`: Foreign Key (references `users.id`), NOT NULL, INDEX
    *   `title`: VARCHAR, NOT NULL
    *   `description`: TEXT, nullable
    *   `start_datetime`: TIMESTAMPTZ, NOT NULL
    *   `end_datetime`: TIMESTAMPTZ, NOT NULL
    *   `webinar_url`: VARCHAR, nullable
    *   `public_id`: VARCHAR, UNIQUE, NOT NULL, INDEX (do użytku w publicznych URL-ach)
    *   `customization_settings`: JSONB, nullable (przechowuje nadpisane ustawienia personalizacji dla tego wydarzenia)
    *   `created_at`: TIMESTAMPTZ, default NOW()
    *   `updated_at`: TIMESTAMPTZ, default NOW()
*   **`user_settings`**:
    *   `id`: Primary Key (np. SERIAL, UUID)
    *   `user_id`: Foreign Key (references `users.id`), UNIQUE, NOT NULL
    *   `iframe_defaults`: JSONB, nullable (przechowuje domyślne ustawienia personalizacji iframe dla użytkownika)
    *   `updated_at`: TIMESTAMPTZ, default NOW()
*   **`widget_interactions`**:
    *   `id`: Primary Key (np. BIGSERIAL, UUID)
    *   `event_id`: Foreign Key (references `events.id`), NOT NULL, INDEX
    *   `interaction_type`: VARCHAR lub ENUM (np. 'google', 'ics', 'outlook'), NOT NULL
    *   `ip_address`: VARCHAR, nullable (Uwaga na GDPR!)
    *   `user_agent`: TEXT, nullable (Uwaga na GDPR!)
    *   `clicked_at`: TIMESTAMPTZ, default NOW(), INDEX

## 3. API Endpoints (Faza 1)

*   **Format:** `METODA https://attendify.pl/ścieżka`
*   **Uwierzytelnianie:** Oparte o tokeny **JWT** (JSON Web Tokens) przekazywane w nagłówku `Authorization: Bearer <token>`.
*   **Główne grupy endpointów:**
    *   `/api/auth/*`: Rejestracja, logowanie, wylogowanie, pobieranie danych użytkownika.
    *   `/api/events/*`: CRUD dla wydarzeń, pobieranie kodu iframe, pobieranie statystyk.
    *   `/api/settings/iframe`: Zarządzanie domyślnymi ustawieniami personalizacji.
*   **Publiczne endpointy (bez uwierzytelniania):**
    *   `/widget/event/{public_id}`: Serwuje HTML/CSS/JS widżetu iframe.
    *   `/track/{public_id}/{type}`: Rejestruje kliknięcie i przekierowuje do celu.
    *   `/calendar/{public_id}/download.ics`: Generuje i zwraca plik `.ics`.

## 4. Kluczowe Kwestie Techniczne i Ograniczenia

*   **Bezpieczeństwo:**
    *   Ochrona przed **CSRF** (Cross-Site Request Forgery) i **XSS** (Cross-Site Scripting).
    *   Bezpieczne przechowywanie haseł (**hashing**).
    *   Walidacja danych wejściowych po stronie serwera.
    *   Poprawna implementacja **autoryzacji** (sprawdzanie uprawnień do zasobów).
    *   Zabezpieczenie endpointów API (np. **Rate Limiting**).
    *   Użycie **HTTPS** na całej platformie `attendify.pl` (konieczne dla bezpieczeństwa i działania niektórych funkcji przeglądarek).
    *   Konfiguracja **CORS** (Cross-Origin Resource Sharing) - API musi zezwalać na żądania z domeny frontendu oraz z dowolnej domeny, na której osadzony jest iframe.
*   **Skalowalność:**
    *   Optymalizacja zapytań do bazy danych, szczególnie dla tabeli `widget_interactions` i endpointu statystyk.
    *   Możliwość skalowania serwera API (np. poprzez uruchomienie wielu instancji za load balancerem, jeśli zajdzie potrzeba).
*   **Strefy Czasowe:**
    *   Wszystkie daty i czasy w bazie danych powinny być przechowywane w **UTC**.
    *   Konwersja do lokalnej strefy czasowej użytkownika powinna odbywać się w warstwie prezentacji (frontend lub podczas generowania widżetu/pliku .ics).
*   **Zgodność z GDPR/Prywatność:**
    *   Minimalizacja zbieranych danych osobowych.
    *   Szczególna ostrożność przy logowaniu `ip_address` i `user_agent` w `widget_interactions`. Rozważyć anonimizację lub całkowite pominięcie tych danych, jeśli nie są absolutnie konieczne.
    *   Konieczność posiadania Polityki Prywatności i Regulaminu.
*   **Wydajność Śledzenia Kliknięć (`/track`):**
    *   Endpoint musi odpowiadać **bardzo szybko**, aby nie opóźniać przekierowania użytkownika.
    *   Zapis do `widget_interactions` powinien być zoptymalizowany (indeksy).
    *   Rozważyć **asynchroniczne logowanie** (np. przez kolejkę zadań), aby zapis do bazy nie blokował odpowiedzi HTTP.
*   **Generowanie `public_id`:** Należy zapewnić mechanizm generowania unikalnych, trudnych do odgadnięcia identyfikatorów publicznych dla wydarzeń.
