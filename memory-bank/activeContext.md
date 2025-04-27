# activeContext.md

## Ostatnie działania
- Panel Attendify (frontend React) został zbudowany i wdrożony do katalogu `/home/admin/domains/attendify.pl/public_html/panel`.
- Nginx serwuje statyczne pliki React bezpośrednio pod adresem `https://attendify.pl/panel/`.
- Rozwiązano problem z błędami 404 plików statycznych przez ustawienie `"homepage": "https://attendify.pl/panel"` w `package.json` i ponowny build.
- Panel wyświetla nagłówek "Attendify Panel". Routing działa poprawnie.
- **Problem:** Serwer VPS ma zbyt mało pamięci, aby zbudować projekt React z użyciem większych bibliotek UI.
- **Decyzja:** Praca nad projektem została przeniesiona na lokalne środowisko deweloperskie z powodu ograniczeń pamięci serwera VPS uniemożliwiających budowanie frontendu z bibliotekami UI.

## Status środowiska lokalnego
- **Sukces:** Programista pomyślnie skonfigurował i uruchomił lokalne środowisko deweloperskie (frontend na `localhost:3000`, backend i baza danych w Dockerze na `localhost:8000`).
- **Gotowość:** Projekt jest gotowy do dalszego rozwoju funkcjonalności w środowisku lokalnym.

## Stan backendu
- API Django (DRF) jest gotowe i udostępnia:
  - Rejestrację użytkownika (`/api/auth/register/`)
  - Logowanie JWT (`/api/auth/token/`)
  - Odświeżanie tokenu (`/api/auth/token/refresh/`)
  - Pobieranie danych zalogowanego użytkownika (`/api/auth/me/`)
  - Zarządzanie wydarzeniami (`/api/events/`, `/api/events/{id}/`, statystyki, kalendarz, widgety)
- Możliwa jest pełna integracja panelu z backendem.

## Decyzje i kolejne kroki
- **Priorytet:** Rozpoczęcie implementacji funkcjonalności frontendu w środowisku lokalnym.
- **Następny krok:** Wybór i integracja biblioteki UI (np. Ant Design, Chakra UI, React Bootstrap) lub rozpoczęcie stylowania ręcznego.
- **Dalsze kroki:**
    - Implementacja logowania (formularz + integracja z API `/api/auth/token/`).
    - Implementacja rejestracji (formularz + integracja z API `/api/auth/register/`).
    - Zarządzanie stanem (np. tokeny JWT, dane użytkownika).
    - Rozbudowa Dashboardu.
