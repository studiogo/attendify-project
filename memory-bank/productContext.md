# Product Context: Attendify

**Wersja:** 0.1
**Data:** 2025-04-26

## 1. Dlaczego ten projekt istnieje? (Problem)

Projekt Attendify powstał w odpowiedzi na powszechny problem organizatorów webinarów: **niski wskaźnik frekwencji** uczestników w stosunku do liczby osób, które się zapisały. Obecnie brakuje skutecznych i łatwych w użyciu narzędzi, które pomogłyby organizatorom **angażować zapisane osoby** w okresie poprzedzającym wydarzenie, co prowadzi do "zapominania" o webinarze i niższej obecności na żywo.

## 2. Jakie problemy rozwiązuje? (Rozwiązanie)

Attendify ma na celu rozwiązanie problemu niskiej frekwencji poprzez dostarczenie platformy SaaS (`https://attendify.pl`), która oferuje konkretne narzędzia:

*   **Ułatwienie zapamiętania wydarzenia:** Główną funkcją Fazy 1 jest generowanie widżetu (iframe) z przyciskami "Dodaj do Kalendarza". Umożliwia to uczestnikom łatwe dodanie terminu webinaru do ich osobistych kalendarzy (Google, Outlook, Apple), co znacząco zwiększa szansę na pamiętanie o wydarzeniu.
*   **Mierzenie zaangażowania:** Platforma będzie śledzić interakcje z przyciskami w widżecie, dostarczając organizatorom cennych danych na temat tego, ile osób aktywnie dodało wydarzenie do swojego kalendarza.
*   **Personalizacja:** Możliwość dostosowania wyglądu widżetu (kolory, logo) pozwala organizatorom na utrzymanie spójności wizualnej z ich marką.

## 3. Jak to powinno działać? (Doświadczenie Użytkownika - Cele)

*   **Dla Organizatora:**
    *   Proces tworzenia wydarzenia i generowania kodu iframe powinien być **intuicyjny i szybki**.
    *   Panel zarządzania powinien być **przejrzysty**, umożliwiając łatwy dostęp do listy wydarzeń, statystyk i ustawień personalizacji.
    *   Statystyki powinny być prezentowane w **zrozumiałej formie**, dając jasny obraz skuteczności widżetu.
*   **Dla Uczestnika Webinaru (interakcja z iframe):**
    *   Widżet powinien być **prosty i czytelny**.
    *   Dodawanie wydarzenia do kalendarza powinno wymagać **minimalnej liczby kliknięć**.
    *   Proces powinien być **niezawodny** na różnych urządzeniach i w różnych systemach operacyjnych (obsługa popularnych kalendarzy).
*   **Ogólne:**
    *   Platforma ma być **stabilna i wydajna**, szczególnie w zakresie śledzenia kliknięć i serwowania widżetów.
    *   Architektura ma być **modułowa**, aby w przyszłości łatwo dodawać nowe funkcje angażujące (np. quizy, przypomnienia).
