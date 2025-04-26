# Progress: Attendify

**Wersja:** 0.1
**Data:** 2025-04-26

## 1. Co działa (Faza 1)

*   Na ten moment (początek projektu) żadna funkcjonalność Fazy 1 nie została jeszcze zaimplementowana.
*   Struktura Memory Bank została utworzona i wypełniona na podstawie dokumentacji technicznej v0.3.

## 2. Co pozostało do zbudowania (Faza 1)

Wszystkie funkcjonalności zdefiniowane w Celach Fazy 1 (`projectbrief.md`) oraz opisane w modułach (`systemPatterns.md`) i endpointach API (`techContext.md`):

*   **Moduł Uwierzytelniania (Auth):** Rejestracja, Logowanie, Zarządzanie sesją/tokenem.
*   **Moduł Zarządzania Wydarzeniami (Events):** Pełen CRUD dla wydarzeń.
*   **Moduł Personalizacji Iframe (Customization):** Zarządzanie domyślnymi ustawieniami użytkownika i nadpisywanie ich dla konkretnych wydarzeń.
*   **Moduł Generatora Iframe (IframeGenerator):** Endpoint `/widget/event/{public_id}` serwujący spersonalizowany widżet.
*   **Moduł Obsługi Kalendarzy (Calendar):** Generowanie linków Google Calendar i plików `.ics` (endpoint `/calendar/{public_id}/download.ics`).
*   **Moduł Analityki (Analytics):** Endpointy śledzące `/track/{public_id}/{type}` zapisujące interakcje oraz endpoint API `/api/events/{eventId}/stats` do pobierania statystyk.
*   **Interfejs Użytkownika (Frontend - Panel Organizatora):** Wszystkie widoki opisane w dokumentacji (Logowanie, Dashboard, Lista Wydarzeń, Formularz Wydarzenia, Ustawienia, Statystyki).
*   **Konfiguracja Środowiska:** Wybór stosu, setup środowiska dev, konfiguracja serwera VPS, DNS, HTTPS, CORS.
*   **Testy:** Jednostkowe, integracyjne, E2E, wydajnościowe.
*   **Dokumentacja:** Dla użytkowników końcowych.

## 3. Aktualny Status

*   **Faza:** Inicjalizacja projektu / Planowanie implementacji Fazy 1.
*   **Postęp:** 0% implementacji kodu Fazy 1.
*   **Następny krok:** Wybór finalnego stosu technologicznego i setup środowiska deweloperskiego (zgodnie z `activeContext.md`).

## 4. Znane Problemy / Ryzyka (do monitorowania)

*   **Wydajność `/track`:** Konieczność zapewnienia bardzo szybkiej odpowiedzi endpointu śledzącego, potencjalna potrzeba optymalizacji lub asynchronicznego przetwarzania.
*   **Zgodność z GDPR:** Ostrożność przy zbieraniu i przetwarzaniu danych (IP, User Agent).
*   **Konfiguracja CORS:** Może być problematyczna, wymaga dokładnego przetestowania dla różnych scenariuszy osadzania iframe.
*   **Bezpieczeństwo:** Standardowe ryzyka aplikacji webowych (XSS, CSRF, bezpieczeństwo JWT, walidacja danych).
*   **Zależność od zewnętrznych kalendarzy:** Poprawność generowania linków/plików dla różnych wersji kalendarzy (Google, Outlook, Apple).
