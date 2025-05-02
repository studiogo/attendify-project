# systemPatterns.md

## Architektura systemu
- Frontend: React (create-react-app), SPA, build serwowany przez Nginx z katalogu `/public_html/panel`.
- Backend: Django + Django REST Framework, API JWT, obsługa użytkowników i wydarzeń.
- Autoryzacja: JWT (logowanie, odświeżanie, weryfikacja tokenu).
- Reverse proxy Nginx (w razie potrzeby), domyślnie statyczne pliki serwowane bezpośrednio.
- Komunikacja frontend-backend przez REST API (ścieżka `/api/`).

## Wzorce i decyzje
- PublicPath React ustawiony na `/panel/` (pole "homepage" w package.json), aby uniknąć błędów 404 przy serwowaniu z podkatalogu.
- Panel React jako SPA – fallback na index.html (jeśli potrzebny, do konfiguracji w Nginx).
- Każda funkcjonalność panelu (logowanie, rejestracja, dashboard) oparta o endpointy backendu.
- Pliki statyczne i index.html kopiowane do katalogu docelowego po każdym buildzie.
- Do wizualizacji statystyk w panelu używana jest biblioteka `recharts`.

## Relacje komponentów
- Panel React komunikuje się z backendem przez fetch/axios (autoryzacja, pobieranie danych, operacje CRUD).
- Użytkownik loguje się przez panel, token JWT przechowywany w localStorage/sessionStorage.
- Po zalogowaniu panel pobiera dane użytkownika i listę wydarzeń.

## Decyzje na przyszłość
- Rozbudowa panelu o kolejne widoki po wdrożeniu logowania.
- Możliwość rozbudowy backendu o kolejne endpointy (np. uprawnienia, role, powiadomienia).
