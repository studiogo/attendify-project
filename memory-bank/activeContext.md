# activeContext.md

## Ostatnie działania
- Panel Attendify (frontend React) został zbudowany i wdrożony do katalogu `/home/admin/domains/attendify.pl/public_html/panel`.
- Nginx serwuje statyczne pliki React bezpośrednio pod adresem `https://attendify.pl/panel/`.
- Rozwiązano problem z błędami 404 plików statycznych przez ustawienie `"homepage": "https://attendify.pl/panel"` w `package.json` i ponowny build.
- Panel wyświetla nagłówek "Attendify Panel". Routing działa poprawnie.
- **Problem:** Próby dodania bibliotek UI (Ant Design, Chakra UI) i przebudowania aplikacji na serwerze nie powiodły się z powodu niewystarczającej ilości pamięci (RAM/swap).

## Aktualny problem i rozwiązanie
- **Problem:** Serwer VPS ma zbyt mało pamięci, aby zbudować projekt React z użyciem większych bibliotek UI.
- **Rozwiązanie:** Proces budowania frontendu (`npm run build`) musi być wykonywany **lokalnie** na komputerze programisty, a następnie gotowy katalog `build` musi zostać wgrany na serwer do `/home/admin/domains/attendify.pl/public_html/panel/`. Szczegółowe instrukcje znajdują się w `techContext.md`.

## Stan backendu
- API Django (DRF) jest gotowe i udostępnia:
  - Rejestrację użytkownika (`/api/auth/register/`)
  - Logowanie JWT (`/api/auth/token/`)
  - Odświeżanie tokenu (`/api/auth/token/refresh/`)
  - Pobieranie danych zalogowanego użytkownika (`/api/auth/me/`)
  - Zarządzanie wydarzeniami (`/api/events/`, `/api/events/{id}/`, statystyki, kalendarz, widgety)
- Możliwa jest pełna integracja panelu z backendem.

## Decyzje i kolejne kroki
- **Zablokowane:** Dalszy rozwój frontendu (dodawanie stylów, integracja z API) jest zablokowany do czasu wgrania na serwer builda wykonanego lokalnie przez programistę.
- **Następny krok (dla programisty):**
    1. Pobrać aktualny kod projektu na lokalny komputer.
    2. Wykonać kroki budowania lokalnego opisane w `techContext.md` (w tym instalacja wybranej biblioteki UI, jeśli jest taka decyzja).
    3. Wgrać zawartość lokalnego katalogu `build` do `/home/admin/domains/attendify.pl/public_html/panel/` na serwerze.
    4. Poinformować Cline o wgraniu nowego builda, aby można było kontynuować pracę.
