# Strona o mnie — Krzysztof Siudek

Lekka, responsywna strona osobista: HTML/CSS/JavaScript, backend Cloudflare Worker i baza SQLite Cloudflare D1. Bez frameworka na froncie i bez zewnętrznych skryptów śledzących.

## Funkcje

- Strona główna, opis i pasje; osiem wybranych zdjęć z materiałów właściciela.
- Galeria pobierana z D1, kategorie, pełny kadr w oknie dialogowym, strzałki klawiatury i Escape.
- Obrazy WebP oraz mniejsze miniatury, lazy loading galerii; metadane EXIF usunięte w eksportach.
- Profile Instagram/TikTok/Facebook są domyślnie wyłączone. Nie ma fikcyjnych kont ani postów.
- Obsługa błędów pobierania i ponowienia, wersja mobilna, reduced motion, etykiety dostępności.
- Publiczny backend jest tylko do odczytu. Brak panelu admina i publicznych endpointów zapisu.

## Lokalnie

Wymagany Node.js 22 lub nowszy.

```sh
npm ci
npm run db:local
npm run dev
```

Otwórz adres wyświetlony przez Wrangler (zwykle http://localhost:8787).
Lokalna baza nie wymaga konta Cloudflare; konfiguracyjny zerowy ID to placeholder.

```sh
npm run check
npm run build
```

## Cloudflare — pierwsze wdrożenie

Kod jest przygotowany, ale samo zapisanie na GitHubie nie publikuje witryny.

1. `npx wrangler login` — zaloguj się na swoje konto Cloudflare.
2. `npx wrangler d1 create strona-o-mnie` — utwórz bazę.
3. W `wrangler.jsonc` zastąp zerowy `database_id` prawdziwym ID otrzymanej bazy. Nie dodawaj tokenów do repo.
4. `npm run db:remote` — zastosuj migracje na tej bazie.
5. `npm run deploy` — opublikuj frontend i Worker. Ta komenda udostępnia stronę w internecie; przed jej wykonaniem zaakceptuj treści i zdjęcia.

Cloudflare poda rzeczywisty adres `https://krzysztof-siudek.<twoja-subdomena>.workers.dev` (wymaga włączonego workers.dev). Nie jest to gotowy adres do kliknięcia. Własną domenę można podłączyć później. Limity i dostępność bezpłatnego planu sprawdź na swoim koncie.

## Edycja danych

Opis i pasje: `public/index.html`. Wygląd: `public/style.css`.
Zdjęcia: `public/images/`. Kolejne zmiany danych dodawaj jako nowe migracje SQL w `migrations/`; nie zmieniaj migracji już zastosowanych.

Przykład aktywacji profilu (zastąp adres swoim, dodaj jako nową migrację):

```sql
UPDATE social_profiles SET url = 'https://www.instagram.com/TWOJ_LOGIN/', enabled = 1 WHERE platform = 'instagram';
```

To włącza link do profilu. Automatyczne najnowsze posty nie są jeszcze zaimplementowane: wymagają podania kont, sprawdzenia dostępnej oficjalnej integracji i ewentualnej autoryzacji. Sekcja nie ładuje teraz zewnętrznych embedów ani cookies.

Wybrane zdjęcia są gotowymi kopiami do strony, nie archiwum wszystkich 60 przesłanych zdjęć. Oryginały nie są umieszczane w repozytorium. W tej wersji nie dodano zdjęć medycznych ani prywatnych szczegółów rodzinnych.

## Dokumentacja

- https://developers.cloudflare.com/workers/static-assets/
- https://developers.cloudflare.com/d1/get-started/
- https://developers.cloudflare.com/workers/wrangler/configuration/
