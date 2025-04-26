# activeContext.md

## Ostatnie działania
- Panel Attendify (frontend React) został zbudowany i wdrożony do katalogu `/home/admin/domains/attendify.pl/public_html/panel`.
- Nginx serwuje statyczne pliki React bezpośrednio pod adresem `https://attendify.pl/panel/`.
- Rozwiązano problem z błędami 404 plików statycznych przez ustawienie `"homepage": "https://attendify.pl/panel"` w `package.json` i ponowny build.
- Panel wyświetla nagłówek "Attendify Panel". Routing działa poprawnie.
- **Problem:** Serwer VPS ma zbyt mało pamięci, aby zbudować projekt React z użyciem większych bibliotek UI.
- **Decyzja:** Przechodzimy na w pełni lokalny przepływ pracy (local development workflow). Budowanie i uruchamianie aplikacji (frontend i backend) będzie odbywać się na komputerze programisty. Serwer będzie używany tylko do wdrożenia produkcyjnej wersji.

## Aktualny problem i rozwiązanie
- **Problem:** Konieczność skonfigurowania lokalnego środowiska deweloperskiego.
- **Rozwiązanie:** Programista pobierze kod z repozytorium Git i skonfiguruje lokalne środowisko zgodnie z instrukcjami w `techContext.md`.

## Stan backendu
- API Django (DRF) jest gotowe i udostępnia:
  - Rejestrację użytkownika (`/api/auth/register/`)
  - Logowanie JWT (`/api/auth/token/`)
  - Odświeżanie tokenu (`/api/auth/token/refresh/`)
  - Pobieranie danych zalogowanego użytkownika (`/api/auth/me/`)
  - Zarządzanie wydarzeniami (`/api/events/`, `/api/events/{id}/`, statystyki, kalendarz, widgety)
- Możliwa jest pełna integracja panelu z backendem.

## Decyzje i kolejne kroki
- **Priorytet:** Skonfigurowanie lokalnego środowiska deweloperskiego przez programistę.
- **Następny krok (dla programisty):**
    1. Pobrać kod projektu z repozytorium Git (`git clone https://github.com/studiogo/attendify-project.git`).
    2. Zainstalować wymagane oprogramowanie (Node.js, Python, Docker Desktop).
    3. Skonfigurować lokalne środowisko uruchomieniowe dla frontendu i backendu zgodnie z instrukcjami w `techContext.md`.
    4. Uruchomić lokalnie frontend (`npm start`) i backend (`docker-compose up -d`).
    5. Poinformować Cline o gotowości do dalszej pracy w środowisku lokalnym.
- **Dalsze kroki (po uruchomieniu lokalnym):**
    - Wybór i integracja biblioteki UI (np. Ant Design).
    - Implementacja logowania, rejestracji, dashboardu itd.
