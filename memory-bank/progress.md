# progress.md

## Co działa (na serwerze produkcyjnym)
- Podstawowa wersja panelu Attendify (frontend React) jest dostępna pod https://attendify.pl/panel/.
- Routing React działa dla podstawowych ścieżek (`/`, `/login`, `/register`).
- Backend Django (DRF) w kontenerze Docker udostępnia API.

## Co zostało do zrobienia (w środowisku lokalnym)
- **Konfiguracja środowiska lokalnego:** Programista musi skonfigurować lokalne środowisko zgodnie z `techContext.md`.
- **Wybór i integracja biblioteki UI:** Wybór i dodanie biblioteki (np. Ant Design) do frontendu.
- **Implementacja frontendu:**
    - Ekran logowania (integracja z `/api/auth/token/`).
    - Ekran rejestracji (integracja z `/api/auth/register/`).
    - Obsługa tokenów JWT (przechowywanie, odświeżanie).
    - Pobieranie danych użytkownika (`/api/auth/me/`).
    - Dashboard (wyświetlanie wydarzeń, CRUD).
- **Testowanie:** Lokalnie i na serwerze po wdrożeniu builda.

## Status
- **Praca przeniesiona na środowisko lokalne:** Ze względu na ograniczenia pamięci serwera, dalszy rozwój (zwłaszcza frontendu z bibliotekami UI) musi odbywać się lokalnie.
- **Zablokowane na serwerze:** Brak możliwości budowania frontendu na serwerze.
- **Kolejny krok:** Skonfigurowanie i uruchomienie projektu lokalnie przez programistę.
