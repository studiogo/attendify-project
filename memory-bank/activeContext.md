# Active Context: Attendify

**Wersja:** 0.1
**Data:** 2025-04-26

## 1. Aktualny Fokus Pracy

*   **Inicjalizacja Projektu:** Tworzenie podstawowej struktury projektu i dokumentacji (Memory Bank) na podstawie dostarczonej specyfikacji technicznej v0.3.
*   **Przygotowanie do Implementacji Fazy 1:** Zdefiniowanie i udokumentowanie wymagań, architektury, modelu danych i API dla pierwszej fazy rozwoju Attendify.

## 2. Ostatnie Zmiany

*   Utworzono strukturę katalogów `memory-bank/`.
*   Utworzono i wypełniono podstawowe pliki Memory Bank (v0.1).
*   Potwierdzono użycie domeny `https://attendify.pl`.
*   **Wybrano finalny stos technologiczny:** Backend: Django, Frontend: React, Baza: **MySQL/MariaDB**.
*   Zaktualizowano `techContext.md` i `activeContext.md` o wybrany stos i bazę danych.
*   **Utworzono podstawową strukturę katalogów projektu:** `backend/`, `frontend/`.
*   **Zakończono podstawowy Setup Backendu (Django):** Utworzono venv, zainstalowano Django, utworzono projekt `attendify_project` oraz aplikacje `users`, `events`, `api`.
*   **Zakończono podstawowy Setup Frontendu (React):** Zainicjowano projekt `attendify-panel` za pomocą `create-react-app` w katalogu `frontend/`.
*   **Zakończono Setup Bazy Danych (MySQL/MariaDB):** Utworzono użytkownika/bazę, zainstalowano zależności (`libmariadb-dev`, `mysqlclient`, `python-dotenv`), utworzono plik `.env`, skonfigurowano `settings.py`, pomyślnie uruchomiono migracje.

## 3. Następne Kroki

1.  **Kontrola Wersji (Git):** Inicjalizacja repozytorium, utworzenie `.gitignore`, pierwszy commit.
2.  **(Opcjonalnie) Docker:** Przygotowanie `Dockerfile` i `docker-compose.yml`.
3.  **Setup Bazy Danych (PostgreSQL):** Utworzenie użytkownika/bazy danych, konfiguracja połączenia w Django.
4.  **Kontrola Wersji (Git):** Inicjalizacja repozytorium, utworzenie `.gitignore`, pierwszy commit.
5.  **(Opcjonalnie) Docker:** Przygotowanie `Dockerfile` i `docker-compose.yml`.
6.  **Implementacja Modułu Auth (Backend):** Rozpoczęcie kodowania funkcjonalności rejestracji, logowania, zarządzania sesją/tokenami JWT w Django.
3.  **Implementacja Modułu Events (Backend):** CRUD dla wydarzeń w Django.
4.  **Implementacja Modułu Events:** CRUD dla wydarzeń.
5.  **Implementacja Modułu Customization:** Zarządzanie domyślnymi i specyficznymi dla wydarzenia ustawieniami personalizacji.
6.  **Implementacja Modułu Calendar:** Generowanie linków Google Calendar i plików `.ics`.
7.  **Implementacja podstawowego Modułu Analytics:** Endpointy śledzące (`/track`) i zapisujące interakcje (z uwzględnieniem GDPR).
8.  **Implementacja Modułu IframeGenerator:** Endpoint serwujący widżet (`/widget/event/{public_id}`).
9.  **Stworzenie interfejsu Panelu Organizatora:** Implementacja widoków frontendu.
10. **Testowanie:** Jednostkowe, integracyjne, E2E, wydajnościowe (`/track`).
11. **Konfiguracja serwera (VPS):** DNS dla `attendify.pl`, serwer WWW (Nginx/Apache), HTTPS (Let's Encrypt), CORS.
12. **Dokumentacja dla użytkowników.**
13. **Wdrożenie Fazy 1** na `https://attendify.pl`.

## 4. Aktywne Decyzje i Rozważania

*   **Architektura:** Potwierdzono monolit modułowy z podejściem API-First.
*   **Domena:** `https://attendify.pl` jest główną domeną projektu.
*   **Hosting:** Wybrano VPS i konteneryzację Docker.
*   **Baza Danych:** **MySQL/MariaDB** (dostępna w systemie).
*   **Kluczowe Wyzwania (do monitorowania):** Wydajność endpointu `/track`, zgodność z GDPR, konfiguracja CORS, bezpieczeństwo (JWT, XSS, CSRF).
*   **Stos Technologiczny:** **Wybrano:** Backend - **Python/Django**, Frontend - **React**, Baza Danych - **MySQL/MariaDB**.
