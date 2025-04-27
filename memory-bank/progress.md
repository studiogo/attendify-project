# progress.md

## Co działa (na serwerze produkcyjnym)
- Podstawowa wersja panelu Attendify (frontend React) jest dostępna pod https://attendify.pl/panel/.
- Routing React działa dla podstawowych ścieżek (`/`, `/login`, `/register`).
- Backend Django (DRF) w kontenerze Docker udostępnia API.

## Co zostało do zrobienia (w środowisku lokalnym)
- **Wybór i integracja biblioteki UI:** Wybór i dodanie biblioteki (np. Ant Design, Chakra UI, React Bootstrap) lub rozpoczęcie stylowania ręcznego.
- **Implementacja frontendu (lokalnie):**
    - Stylowanie aplikacji / integracja biblioteki UI.
    - Ekran logowania (formularz + integracja z API `/api/auth/token/`).
    - Ekran rejestracji (integracja z `/api/auth/register/`).
    - Obsługa tokenów JWT (przechowywanie, odświeżanie).
    - Pobieranie danych użytkownika (`/api/auth/me/`).
    - Dashboard (wyświetlanie wydarzeń, CRUD).
- **Testowanie:** Lokalnie.
- **Wdrożenie na serwer:** Po zakończeniu prac nad daną funkcjonalnością, wykonanie lokalnego builda i wgranie na serwer.

## Status
- **Środowisko lokalne gotowe:** Programista pomyślnie uruchomił projekt lokalnie.
- **Praca na serwerze wstrzymana:** Rozwój odbywa się lokalnie. Serwer produkcyjny będzie aktualizowany wdrożeniami lokalnych buildów.
- **Kolejny krok:** Decyzja o sposobie stylowania (biblioteka UI / CSS) i rozpoczęcie implementacji logowania.
