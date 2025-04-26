# progress.md

## Co działa
- Panel Attendify (frontend React) jest dostępny pod https://attendify.pl/panel/ i serwowany przez Nginx.
- Statyczne pliki React są poprawnie serwowane (rozwiązano problem z 404).
- Backend Django (DRF) udostępnia kompletne API do rejestracji, logowania (JWT), pobierania danych użytkownika oraz zarządzania wydarzeniami.

## Co zostało do zrobienia
- Wdrożenie ekranu logowania w panelu (integracja z /api/auth/token/).
- Wdrożenie rejestracji użytkownika (integracja z /api/auth/register/).
- Obsługa przechowywania i odświeżania tokenu JWT.
- Pobieranie danych zalogowanego użytkownika (/api/auth/me/).
- Po zalogowaniu – dashboard z listą wydarzeń i operacjami CRUD.

## Status
- Frontend i backend są gotowe do integracji.
- Kolejny krok: implementacja logowania w panelu.
