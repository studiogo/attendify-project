# progress.md

## Co działa (w środowisku lokalnym)
- **Backend:**
    - API Django (DRF) gotowe i działające w Dockerze (`localhost:8001`).
    - Endpointy: rejestracja, logowanie (przez email), odświeżanie tokenu, pobieranie danych użytkownika, CRUD wydarzeń, statystyki wydarzeń, generowanie widżetu, śledzenie kliknięć, żądanie resetu hasła, potwierdzenie resetu hasła.
- **Frontend (Panel React na `localhost:3000/3001/3002`):**
    - **Uwierzytelnianie:**
        - Logowanie i rejestracja użytkownika działają (z poprawioną obsługą logowania przez email).
        - Obsługa stanu zalogowania i routing chroniony.
        - Resetowanie hasła (formularz żądania i formularz potwierdzenia).
        - Walidacja tokenu JWT przy starcie aplikacji.
    - **Dashboard:**
        - Wyświetlanie listy wydarzeń użytkownika (w widoku kart).
        - Pełne zarządzanie wydarzeniami (CRUD - tworzenie, edycja, usuwanie).
        - Możliwość ustawienia personalizacji kolorów widżetu dla wydarzenia.
        - Wyświetlanie kodu widżetu (iframe) do osadzenia.
        - Wyświetlanie statystyk kliknięć dla wydarzenia (w tym wykres kołowy podziału wg typu kalendarza) - **działa poprawnie po naprawie wyświetlania**.
    - **UI/UX:** Interfejs użytkownika dopracowany (Ant Design, layout, nawigacja, responsywność).
    - **Uruchomienie:** Serwer dewelwoperski frontendu uruchamia się poprawnie po rozwiązaniu problemu z zależnościami.

## Aktualny stan produkcyjny
- **Frontend:** Stara wersja dostępna pod `attendify.pl/panel/`
- **Backend:** Prawdopodobnie Docker, dostępny pod `api.attendify.pl`
- **Baza danych:** MariaDB/MySQL

## Zadania migracyjne
1. **Przygotowanie repozytorium:**
   - Utworzyć prywatne repo GitHub
   - Dodać odpowiedni .gitignore
   - Wgrać aktualny kod

2. **Migracja backendu:**
   - Skopiować plik .env z ustawieniami produkcyjnymi
   - Uruchomić kontenery Docker
   - Wykonać migracje bazy danych

3. **Migracja frontendu:**
   - Zbudować nową wersję lokalnie
   - Wgrać na serwer produkcyjny
   - Skonfigurować Nginx

4. **Weryfikacja:**
   - Sprawdzić działanie API
   - Przetestować nowy frontend
   - Monitorować logi

## Co zostało do zrobienia
- **Rozwiązanie problemów:**
    - Cache'owanie starej wersji frontendu
    - Konfiguracja reverse proxy w Nginx
    - Synchronizacja środowisk dev/prod

## Status
- **Faza 1 zakończona w środowisku lokalnym:** Wszystkie kluczowe funkcjonalności Fazy 1 zostały zaimplementowane i działają poprawnie.
- **Uwierzytelnianie kompletne:** Logowanie, rejestracja, reset hasła, walidacja sesji działają.
- **UI/UX dopracowane:** Interfejs jest spójny i responsywny.
- **Statystyki rozbudowane i działające:** Dodano wizualizację podziału kliknięć (wykres kołowy), a problem z wyświetlaniem szczegółów/statystyk został rozwiązany.
- **Problem na produkcji:** Stara wersja frontendu jest serwowana po wdrożeniu nowego builda.
- **Kolejny krok:** Diagnoza problemu z serwowaniem starej wersji frontendu na produkcji.
