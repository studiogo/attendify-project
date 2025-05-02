# techContext.md

## Technologie i narzędzia
- **Frontend:** React (create-react-app), react-router-dom, recharts (do wykresów)
- **Backend:** Django 4.x, Django REST Framework, Simple JWT
- **Baza danych:** MySQL (na serwerze), PostgreSQL (lokalnie w Dockerze)
- **Konteneryzacja:** Docker, Docker Compose (dla backendu i bazy danych)
- **Serwer produkcyjny:** Linux, Nginx (serwowanie statycznego builda React), Apache (za Nginx, obsługa Django - prawdopodobnie), DirectAdmin
- **Środowisko deweloperskie (lokalne):** Windows/macOS/Linux z Node.js, Python, Docker Desktop
- **Autoryzacja:** JWT (logowanie, odświeżanie, weryfikacja tokenu)

## Zależności frontend
- react, react-dom, react-router-dom, react-scripts, web-vitals
- antd (biblioteka UI)
- dayjs (biblioteka do obsługi dat, wymagana przez antd v5 DatePicker)
- recharts (biblioteka do wykresów)
- @testing-library/* (testy)

## Zależności backend
- django, djangorestframework, djangorestframework-simplejwt
- inne zależności wg requirements.txt

## Integracje
- REST API: `/api/` (autoryzacja, użytkownicy, wydarzenia)
- Panel React komunikuje się z backendem przez fetch/axios

## Ograniczenia i uwagi
- Pliki statyczne React muszą być budowane z poprawnym publicPath (homepage w package.json)
- Panel React (frontend) jest dostępny na produkcji pod ścieżką `/panel/`.
- Problem z uruchomieniem frontendu związany z zależnościami ESLint został rozwiązany poprzez czystą instalację.

## Lokalne środowisko deweloperskie
- **Wymagania:**
    - Node.js (wersja LTS) i npm
    - Python (wersja zgodna z Django, np. 3.9+)
    - Docker i Docker Compose (lub Docker Desktop dla Windows/macOS)
    - Git
- **Uruchomienie frontendu:**
    1. Przejdź do katalogu `frontend/attendify-panel`.
    2. Uruchom `npm install` (instalacja zależności).
    3. Uruchom `npm start` (uruchomienie serwera deweloperskiego React, zazwyczaj na `http://localhost:3000`).
- **Uruchomienie backendu:**
    1. Przejdź do głównego katalogu projektu.
    2. Utwórz plik `.env` w katalogu `backend/` (na podstawie `backend/attendify_project/settings.py` i `.env` z serwera, jeśli potrzebne są klucze). Wymagane zmienne dla lokalnego środowiska Docker:
        ```dotenv
        # Zmienne dla bazy danych PostgreSQL w Dockerze (zgodnie z docker-compose.yml)
        DB_ENGINE=django.db.backends.postgresql
        DB_NAME=attendify_db_local
        DB_USER=attendify_user_local
        DB_PASSWORD=attendify_password_local
        DB_HOST=db # Nazwa usługi bazy danych w docker-compose.yml
        DB_PORT=5432

        # Klucz sekretny Django (wygeneruj nowy dla środowiska lokalnego)
        DJANGO_SECRET_KEY='wygeneruj_nowy_bezpieczny_klucz_tutaj'

        # Ustawienia debugowania
        DJANGO_DEBUG=True
        DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
        ```
    3. Uruchom kontenery: `docker-compose up -d`. Spowoduje to uruchomienie backendu Django i bazy danych PostgreSQL.
    4. Wykonaj migracje bazy danych: `docker-compose exec backend python manage.py migrate`.
    5. Backend będzie dostępny pod adresem `http://localhost:8000` (zgodnie z `docker-compose.yml`).
- **Ważne:** Frontend uruchomiony przez `npm start` będzie automatycznie odświeżał się po zmianach w kodzie. Backend w kontenerze Docker również powinien automatycznie przeładowywać się po zmianach dzięki konfiguracji woluminów w `docker-compose.yml`.

## Wdrażanie na serwer produkcyjny

### Aktualny stan produkcyjny
- Frontend: dostępny pod `attendify.pl/panel/` (stara wersja)
- Backend: dostępny pod `api.attendify.pl` (prawdopodobnie Docker)
- Baza danych: MariaDB/MySQL

### Proces migracji przez GitHub
1. Utwórz prywatne repozytorium GitHub dla projektu
2. Dodaj plik .gitignore z wykluczeniem:
   - node_modules/
   - .env
   - __pycache__/
3. Wgraj kod na GitHub:
   ```
   git init
   git remote add origin [URL_REPOZYTORIUM]
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```
4. Na serwerze produkcyjnym:
   ```
   git clone [URL_REPOZYTORIUM]
   cd attendify
   ```

### Kroki wdrożeniowe
1. **Backend:**
   - Skopiuj plik .env z ustawieniami produkcyjnymi
   - Uruchom kontenery: `docker-compose up -d --build`
   - Wykonaj migracje: `docker-compose exec backend python manage.py migrate`

2. **Frontend:**
   - Zbuduj lokalnie: `cd frontend/attendify-panel && npm run build`
   - Skopiuj build na serwer: `scp -r build/ user@server:/var/www/attendify-panel`

3. **Konfiguracja Nginx:**
   - Skonfiguruj reverse proxy dla backendu
   - Ustaw serwowanie plików statycznych frontendu
   - Wyczyść cache: `nginx -s reload`

### Weryfikacja
1. Sprawdź działanie API: `curl https://api.attendify.pl/api/healthcheck`
2. Sprawdź frontend: otwórz `https://attendify.pl/panel/` w trybie incognito
3. Sprawdź logi: `docker-compose logs -f` i `tail -f /var/log/nginx/error.log`
