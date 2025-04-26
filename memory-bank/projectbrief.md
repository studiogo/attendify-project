# Project Brief: Attendify

**Wersja:** 0.1
**Data:** 2025-04-26

## 1. Problem

Organizatorzy webinarów borykają się z niskim wskaźnikiem frekwencji w porównaniu do liczby zapisów. Brakuje narzędzi do efektywnego angażowania zapisanych osób przed wydarzeniem.

## 2. Rozwiązanie

Stworzenie aplikacji webowej SaaS (Software as a Service) pod nazwą Attendify, dostępnej pod domeną `https://attendify.pl`. Aplikacja dostarczy organizatorom narzędzi do zwiększania zaangażowania i frekwencji na ich webinarach.

## 3. Główne Cele Projektu

*   **Zwiększenie frekwencji:** Podniesienie wskaźnika frekwencji na webinarach organizowanych przez użytkowników Attendify.
*   **Narzędzia angażujące:** Dostarczenie łatwych w użyciu narzędzi angażujących uczestników przed wydarzeniem.
*   **Modułowość:** Stworzenie platformy o architekturze modułowej, umożliwiającej łatwe dodawanie nowych funkcjonalności w przyszłości.

## 4. Cele Fazy 1

*   **Rejestracja/Logowanie:** Umożliwienie rejestracji i logowania dla organizatorów webinarów.
*   **Zarządzanie Wydarzeniami (CRUD):** Umożliwienie organizatorom tworzenia, edycji i usuwania informacji o swoich wydarzeniach (webinarach).
*   **Generator Iframe:** Automatyczne generowanie embedowalnego kodu `<iframe>` dla każdego wydarzenia.
    *   Iframe będzie zawierał podstawowe informacje o wydarzeniu.
    *   Iframe będzie zawierał przyciski "Dodaj do Kalendarza" (Google Calendar, Outlook Calendar, Apple Calendar - plik .ics).
*   **Personalizacja Iframe:** Umożliwienie organizatorom podstawowej personalizacji wyglądu iframe (kolory, logo).
*   **Statystyki:** Zapewnienie szczegółowych statystyk dotyczących interakcji z przyciskami "Dodaj do Kalendarza" w iframe dla każdego wydarzenia.

## 5. Kluczowa Domena

Główna domena aplikacji to `https://attendify.pl`. Wszystkie endpointy API, panel organizatora oraz widżety iframe będą serwowane z tej domeny lub jej subdomen/ścieżek.
