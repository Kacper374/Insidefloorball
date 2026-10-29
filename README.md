# inside. floorball

Website of **inside. floorball**, the biggest worldwide floorball media account in English: news, highlights, tournament breakdowns and commentary.

Live site: https://insidefloorball.com

A simple static site (HTML, CSS, JavaScript) hosted on GitHub Pages. No build step: every file uploaded to `main` goes live in about a minute.

---

## Struktura projektu

| Plik / folder | Co to jest |
|---|---|
| `index.html` | Strona główna: logo, statystyki, karty social mediów, wykres krajów |
| `studio.html` | Studio Videos: rolki z Instagrama w układzie 3×3 |
| `partners.html` | Partnerzy (piramida) i formularz kontaktowy |
| `privacy-policy.html` | Polityka prywatności |
| `404.html` | Strona błędu |
| `css/style.css` | Wszystkie style strony |
| `js/script.js` | Menu mobilne, udostępnianie rolek i drobne skrypty |
| `images/partners/` | Logo partnerów |
| `images/studio/` | Zdjęcie studia |
| `images/news/` | Stare obrazki do newsów (na przyszłość) |
| `favicon.png` | Logo inside. (menu, ikonka karty, podgląd w social mediach) |
| `sitemap.xml`, `robots.txt` | Dla wyszukiwarek |
| `CNAME` | Domena `insidefloorball.com`. Nie usuwaj! |

Strony **News** i **Highlights** zostały ukryte (październik 2026) i wrócą po wdrożeniu automatyzacji. Ich pełna wersja jest w historii commitów na GitHubie.

---

## Jak coś zmienić (bez programowania)

Każdą zmianę robisz tak samo: wgraj podmieniony plik na GitHub (**Add file → Upload files**) w tym samym folderze, w którym leży stary, i zatwierdź (**Commit changes**). Strona sama się odświeży.

### Podmiana rolki na Studio
1. Otwórz rolkę na instagram.com, kliknij udostępnij i **Kopiuj link**.
2. W `studio.html` znajdź kafelek "Coming soon" (`reel-card--soon`) albo rolkę, którą chcesz zastąpić.
3. Wklej nowy link w `data-instgrm-permalink="..."`. Instrukcja jest też w komentarzu w pliku.

Trzymaj liczbę rolek podzielną przez 3 (układ 3×3).

### Zdjęcie studia
1. Wgraj poziome zdjęcie (ok. 1600 px szerokości) jako `images/studio/studio.jpg`.
2. W `studio.html` usuń komentarz wokół bloku `studio-photo`.

### Nowe logo inside.
Podmień plik `favicon.png` w głównym katalogu na nowy o **tej samej nazwie**. Zmieni się menu, stopka, logo na stronie głównej i podgląd w social mediach.

### Logo partnera (np. Playmakerz)
1. Wgraj logo do `images/partners/` (np. `playmakerz.png`, najlepiej PNG z przezroczystym tłem).
2. W `partners.html` podmień blok z napisem na kartę z obrazkiem. Gotowy wzór jest w komentarzu nad nim.

Główny partner to karta na górze piramidy (`partner-card--main`).

### Liczby na stronie głównej
- Główne statystyki (31K+, 3M+, 100K+) są na górze `index.html`, w `stats-grid`.
- Liczby platform (Instagram, TikTok, Facebook, YouTube) są w kartach `platform-card`. Zmień tekst w `platform-num`.
- Wykres krajów to lista `country-list`. W każdym wierszu zmień nazwę, wartość procentową i szerokość słupka w `--w`. Szerokość to `wartość / największa wartość × 100%`, np. 15,2 / 32,2 = 47,2%.

### Wyszukiwarki (SEO)
- Po większej zmianie treści zaktualizuj `<title>` i `description` w `<head>` danej strony.
- Gdy dodasz nową podstronę, dopisz ją do `sitemap.xml`.
- Po wgraniu warto w Google Search Console zgłosić sitemapę: `https://insidefloorball.com/sitemap.xml`.

---

## Dobre praktyki
- Przed większymi zmianami pobierz kopię repo (**Code → Download ZIP**).
- Obrazki zmniejszaj przed wgraniem (szerokość do ok. 1600 px, najlepiej WebP lub JPG), żeby strona ładowała się szybko.
- Zmiany wgrywaj paczkami w jednym commicie, żeby strona nigdy nie była "w połowie".

---

© 2022–2026 inside. floorball. inside. is an independent floorball media project and is not officially affiliated with any club, league, or federation.
