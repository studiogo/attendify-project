# techContext.md

## Technologie i narzędzia
- **Frontend:** React (create-react-app), react-router-dom, recharts (do wykresów)
- **Backend:** Django 4.x, Django REST Framework, Simple JWT
- **Baza danych:** MySQL (na serwerze), PostgreSQL (lokalnie w Dockerze)
- **Konteneryzacja:** Docker, Docker Compose (dla backendu i bazy danych)
- **Serwer produkcyjny:** Linux, Nginx (serwowanie statycznego builda React), Apache (za Nginx, obsługa Django - prawdopodobnie), DirectAdmin
- **Środowisko deweloperskie (lokalne):** Windows/macOS/Linux z Node.js, Python, Docker Desktop
- **Autoryzacja:** JWT (logowanie, odświeżanie, weryfikacja tokenu)

## Konfiguracja nowego serwera

### Wymagania sprzętowe
- 4GB RAM (minimum)
- 2 vCPU
- 50GB dysku SSD

### Instalacja podstawowa
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv postgresql postgresql-contrib nginx redis
```

### Konfiguracja PostgreSQL
```bash
sudo -u postgres psql -c "CREATE DATABASE attendify;"
sudo -u postgres psql -c "CREATE USER attendify WITH PASSWORD 'bezpieczne_haslo';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE attendify TO attendify;"
```

### Instalacja Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs npm
```

### Środowisko Python
```bash
cd /home/admin/domains/attendify.pl/public_html/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Konfiguracja Nginx
Przykładowa konfiguracja:
```nginx
server {
    listen 80;
    server_name attendify.pl;

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /home/admin/domains/attendify.pl/public_html/panel;
        try_files $uri /index.html;
    }
}
```

### Uruchomienie aplikacji
Backend:
```bash
gunicorn -w 4 -b 0.0.0.0:8000 attendify_project.wsgi:application
```

Frontend:
```bash
cd frontend/attendify-panel
npm install
npm run build
```

### Zmienne środowiskowe
Wymagane w backend/.env:
```
DATABASE_URL=postgres://attendify:hasło@localhost/attendify
SECRET_KEY=twoj_sekretny_klucz
DEBUG=False
ALLOWED_HOSTS=attendify.pl
```

## Migracja na nowy serwer przez Git

### Konfiguracja Gita na VPS:
1. Sprawdź czy masz skonfigurowany Git:
```bash
git config --list
```

2. Jeśli nie masz ustawionego user.name i user.email:
```bash
git config --global user.name "Twoja Nazwa"
git config --global user.email "twoj@email.com"
```

3. Generuj klucz SSH (jeśli nie masz):
```bash
ssh-keygen -t ed25519 -C "twoj@email.com"
cat ~/.ssh/id_ed25519.pub
```

4. Dodaj klucz SSH do swojego konta na GitHub/GitLab

### Wysłanie kodu z VPS do repozytorium:
1. Zrób commit zmian:
```bash
git add .
git commit -m "Przygotowanie do migracji"
```

2. Sprawdź czy masz zdalne repozytorium:
```bash
git remote -v
```

3. Jeśli nie masz, dodaj zdalne repozytorium:
```bash
git remote add origin git@github.com:twoj-uzytkownik/twoj-repozytorium.git
```

4. Wyślij zmiany:
```bash
git push -u origin master
```

2. Na nowym serwerze:
```bash
git clone https://github.com/twoj-repozytorium/attendify.git
cd attendify
```

3. Konfiguracja środowiska (jak w sekcji "Konfiguracja nowego serwera")

Uwaga:
- Pamiętaj o skopiowaniu plików .env osobno (nie powinny być w repozytorium)
- Pliki buildowane (jak panel/static/) należy zbudować na nowym serwerze

## Lokalne środowisko deweloperskie
[... pozostała istniejąca zawartość pliku ...]
