dziala# techContext.md

## Technologie i narzędzia
- **Frontend:** React (create-react-app), react-router-dom, build serwowany przez Nginx z `/public_html/panel`
- **Backend:** Django 4.x, Django REST Framework, Simple JWT
- **Serwer:** Nginx (statyczne pliki React, reverse proxy jeśli potrzebne)
- **Autoryzacja:** JWT (logowanie, odświeżanie, weryfikacja tokenu)
- **Baza danych:** domyślnie SQLite lub PostgreSQL (wg ustawień Django)
- **Docker:** docker-compose dla backendu i frontendu (dev)
- **Deploy:** build React kopiowany do katalogu `/public_html/panel`, backend uruchamiany przez Docker
- **Środowisko:** Linux, DirectAdmin (zarządzanie vhostami)

## Zależności frontend
- react, react-dom, react-router-dom, react-scripts, web-vitals
- @testing-library/* (testy)

## Zależności backend
- django, djangorestframework, djangorestframework-simplejwt
- inne zależności wg requirements.txt

## Integracje
- REST API: `/api/` (autoryzacja, użytkownicy, wydarzenia)
- Panel React komunikuje się z backendem przez fetch/axios

## Ograniczenia i uwagi
- Pliki statyczne React muszą być budowane z poprawnym publicPath (homepage w package.json)
- Panel dostępny pod `/panel/` – wszystkie ścieżki muszą być zgodne z tym prefixem
- Reverse proxy Nginx nie jest wymagane przy serwowaniu statycznych plików, ale może być użyte w przyszłości

## Proces budowania frontendu (WAŻNE!)
- **Ograniczenie serwera:** Serwer VPS posiada niewystarczającą ilość pamięci RAM/swap, aby zbudować projekt React z użyciem większych bibliotek UI (np. Ant Design, Chakra UI). Próby budowania na serwerze kończą się błędem braku pamięci.
- **Wymagane budowanie lokalne:** Proces `npm run build` dla frontendu **musi** być wykonywany na lokalnym komputerze programisty.
- **Kroki budowania lokalnego:**
    1.  **Wymagania:** Zainstalowany Node.js (LTS) i npm, opcjonalnie Git.
    2.  **Pobranie kodu:** Sklonować repozytorium lub pobrać pliki projektu z serwera. Upewnić się, że kod jest aktualny.
    3.  **Instalacja zależności:** W terminalu, w katalogu `frontend/attendify-panel`, uruchomić `npm install`.
    4.  **(Opcjonalnie) Instalacja biblioteki UI:** Jeśli wybrano bibliotekę UI, zainstalować ją (np. `npm install antd`).
    5.  **Budowanie:** Uruchomić `npm run build`. W katalogu `frontend/attendify-panel` zostanie utworzony podkatalog `build`.
    6.  **Wgranie na serwer:** Skopiować **zawartość** lokalnego katalogu `build` na serwer do ścieżki `/home/admin/domains/attendify.pl/public_html/panel/`, nadpisując istniejące pliki (np. za pomocą WinSCP, FileZilla).
