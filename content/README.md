# Treść strony: jak ją zmieniać

Cała treść strony jest w tym folderze. Kodu w `src/` nie trzeba ruszać, żeby dodać wpis, projekt albo zmienić teksty.
Po wypchnięciu zmian na gałąź `main` Vercel sam przebudowuje stronę (około 1–2 minut).

| Co | Gdzie |
|---|---|
| Nazwa strony, e-mail, linki, menu, teksty strony głównej | `site.yaml` |
| Strona About (opis, doświadczenie, umiejętności) | `about.yaml` |
| Projekty (strona Analyses i karty na stronie głównej) | `projects/<nazwa>.yaml` |
| Wpisy na blog | `blog/<nazwa>.ipynb` |
| Obrazy (okładki projektów, dane do mapy) | `../public/projects/`, `../public/data/` |

Pliki, których nazwa zaczyna się od `_`, nie są publikowane (szablony, notatki).
Jeśli w pliku YAML zabraknie wymaganego pola albo będzie literówka, budowanie strony zatrzyma się z komunikatem,
który podaje plik i pole. Strona na żywo się wtedy nie zmienia.

## Nowy wpis na blog (z notatnika Jupyter / Colab)

1. Skopiuj `blog/_template.ipynb` albo zacznij własny notatnik.
2. **Pierwsza komórka (markdown) to metadane** w YAML:

   ```yaml
   title: "Tytuł wpisu"
   date: "2026-10-18"
   summary: "Jedno–dwa zdania na listę wpisów."
   tags: [Sentinel-2, Python]
   project: agriscreen      # opcjonalnie: podpina wpis pod projekt z projects/agriscreen.yaml
   draft: true             # opcjonalnie: szkic widoczny tylko lokalnie; usuń, żeby opublikować
   ```

   Odznaka „Open in Colab” przed tą komórką jest dozwolona i nie pojawi się na stronie.
3. Uruchom notatnik od góry do dołu i zapisz go **z wynikami**: na stronie pokazują się zapisane wykresy, tabele i tekst.
4. Zapisz plik jako `blog/<adres-wpisu>.ipynb`. Nazwa pliku to adres: `blog/egms-groningen.ipynb` → `/blog/egms-groningen`.
   Z Colaba: *Plik → Zapisz kopię w GitHub*, repozytorium `geoworldlook/geoworldlook-web`, ścieżka `content/blog/<adres-wpisu>.ipynb`.

**Sterowanie komórkami kodu** (pierwsze linie komórki):

| Linia | Efekt na stronie |
|---|---|
| `#\| echo: false` | tylko wynik (np. sam wykres), bez kodu |
| `#\| output: false` | tylko kod, bez wyniku |
| `#\| include: false` | komórka ukryta w całości (montowanie Dysku, klucze, pobieranie danych) |

Komórki z formularzem Colab (`#@title`) automatycznie ukrywają kod, tak jak w Colabie.
Obrazy wklejone do komórek markdown w Colabie też się wyświetlają.

## Nowy projekt

Skopiuj `projects/egms-check.yaml` pod nową nazwą i zmień pola. Najważniejsze:

- `featured: true` pokazuje projekt na stronie głównej (maksymalnie 3 karty, kolejność według `order`);
- `image` to okładka z `public/projects/`; bez obrazu karta pokazuje ikonę z pola `icon`;
- `status`: `active`, `completed` albo `archived`;
- wpisy z `project: <nazwa-pliku>` pojawiają się na stronie projektu automatycznie.
- `panel` (opcjonalnie) osadza na stronie projektu panel na żywo, czyli stronę, którą projekt sam aktualizuje:
  `url` (adres panelu, np. z GitHub Pages), `height` (wysokość ramki w pikselach), `title`, `note`.

## Monitoring na żywo na stronie głównej

Sekcja jest włączona (`home.map.enabled: true` w `site.yaml`). Każdy wpis na liście `home.map.sources` to jedna karta
z mapą i listą ostatnich odczytów:

| Pole | Znaczenie |
|---|---|
| `label`, `text` | tytuł i opis karty |
| `url` | plik GeoJSON, który projekt publikuje po każdym przebiegu (np. `docs/showcase/map_points.geojson` na GitHub Pages) |
| `color` | kolor punktów na mapie |
| `href` | odnośnik do strony projektu |
| `sort` | kolejność listy odczytów: `reading` (od największego odczytu) albo `title` (alfabetycznie) |

Strona czyta te pliki w przeglądarce przy każdym wejściu, więc mapy i odczyty są zawsze aktualne i nie trzeba
przebudowywać strony. Punkt w pliku GeoJSON może mieć właściwości: `title`, `description` (dymek), `status`
(kolor kropki na liście), `reading`, `reading_unit`, `reading_date`, `updated`, `url` (odnośnik do panelu).

Bez listy `sources` sekcja pokazuje jedną mapę z pliku wskazanego w `home.map.geojson` (np. `public/data/map.geojson`).

## Formularz kontaktowy

Wiadomości wysyła usługa Formspree. W `site.yaml` wpisz `contact.formspreeId` (część adresu po `formspree.io/f/`).
Dopóki pole jest puste, formularz prosi o kontakt mailowy.

## Podgląd lokalny

```bash
npm install
npm run dev   # http://localhost:9002 (pokazuje też szkice)
```
