# activeContext.md

## Ostatnie działania (w środowisku lokalnym)
- **Naprawa logowania:** Rozwiązano problem z logowaniem przez email (błąd 400, wymagane pole `username`) poprzez stworzenie niestandardowego serializera i widoku w backendzie.
- **Implementacja CRUD wydarzeń:** Zaimplementowano pełne zarządzanie wydarzeniami (tworzenie, odczyt listy, edycja, usuwanie) w panelu `Dashboard.js`.
- **Personalizacja widżetu:** Dodano możliwość ustawiania kolorów tła i tekstu widżetu podczas tworzenia/edycji wydarzenia. Zaktualizowano szablon widżetu w backendzie, aby używał tych ustawień.
- **Generowanie kodu widżetu:** Dodano funkcjonalność wyświetlania i kopiowania kodu `<iframe>` dla widżetu wydarzenia.
- **Statystyki:** Zaimplementowano wyświetlanie podstawowych statystyk kliknięć w widżecie (łącznie i wg typu kalendarza) w modalu.
- **Poprawki UI/UX:**
    - Zmieniono widok listy wydarzeń z tabeli na siatkę kart (`List`, `Card`).
    - Ujednolicono wygląd stron logowania, rejestracji i panelu (layout, tło, kontenery).
    - Poprawiono wygląd głównego paska nawigacyjnego (użycie `Layout.Header`, gradientowe tło, usunięcie duplikatów).
    - Poprawiono przyciski akcji na kartach wydarzeń (ikony + `Tooltip`).
    - Dodano blokowanie wyboru dat przeszłych w `DatePicker`.
    - Wprowadzono dalsze poprawki, w tym responsywność (RWD).
- **Implementacja resetowania hasła:** Dodano formularze i logikę API do żądania i potwierdzania resetu hasła. Naprawiono problemy z generowaniem linku (CORS, NoReverseMatch, routing frontendu).
- **Walidacja tokenu JWT:** Zaimplementowano weryfikację tokenu przy starcie aplikacji frontendowej (`App.js`).
- **Rozbudowa statystyk:** Dodano wykres kołowy (`recharts`) do modalu statystyk w `Dashboard.js`, wizualizujący podział kliknięć wg typu kalendarza.
- **Naprawa problemu z uruchomieniem frontendu:** Zidentyfikowano problem z zależnościami frontendu (`react-scripts`, `eslint-plugin-jsx-a11y`). Wykonano czystą instalację zależności (`npm install` po usunięciu `node_modules` i `package-lock.json`), co rozwiązało problem z uruchomieniem serwera deweloperskiego.
- **Naprawa wyświetlania statystyk:** Rozwiązano problem z wyświetlaniem szczegółów i statystyk wydarzenia w modalu poprzez poprawienie importu komponentu `Tooltip` w `Dashboard.js`.
- **Próba wdrożenia na produkcję:** Wykonano lokalny build frontendu i skopiowano zawartość katalogu `build` na serwer produkcyjny do `/home/admin/domains/attendify.pl/public_html/panel/`. Uruchomiono kontenery Docker z backendem.

## Status środowiska lokalnego
- **Faza 1 zakończona:** Wszystkie kluczowe funkcjonalności Fazy 1 są zaimplementowane i działają w środowisku lokalnym.
- **Uwierzytelnianie:** Pełna obsługa logowania, rejestracji, resetowania hasła i walidacji sesji (tokenu JWT).
- **UI/UX:** Interfejs użytkownika został znacząco dopracowany, w tym pod kątem responsywności.
- **Statystyki rozbudowane i działające:** Dodano wizualizację podziału kliknięć (wykres kołowy), a problem z wyświetlaniem szczegółów/statystyk został rozwiązany.

## Stan backendu
- API Django (DRF) jest stabilne i obsługuje wszystkie zaimplementowane funkcjonalności frontendu.

## Status środowiska produkcyjnego
- **Panel działa poprawnie na produkcji.**

## Ostatnie działania (serwer produkcyjny)
- **Problem z uruchomieniem panelu został rozwiązany.**
- **Zaktualizowano dane bazy danych w `backend/attendify_project/settings.py`.**

## Decyzje i kolejne kroki
- **Zakończono:** Wdrożenie panelu na serwer produkcyjny.
- **Zakończono:** Aktualizacja danych bazy danych.
- **Następny krok:** Przejście do kolejnych zadań.
