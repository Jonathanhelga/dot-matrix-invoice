# Nota / Invoice (dot-matrix print form)

A single-page, client-side invoice form. No backend, no database, nothing is
saved: everything lives only in the page while it's open, and refreshing the
page clears it.

## How it works

You type directly into the fields laid out exactly like the printed form
(company/date/recipient block, item table, signature boxes). What you see on
screen is what gets printed, so there's no separate "preview" step.

- `+ Tambah Baris` adds another item row.
- Each row's `JUMLAH` (amount) is `QTY x HARGA`, calculated automatically.
- The total `JUMLAH` row at the bottom sums all rows automatically.
- `Reset` clears every field back to a blank form (asks for confirmation
  first, since it can't be undone).
- `Print` opens the browser's print dialog.

## Printing on a dot-matrix printer

The print stylesheet is deliberately plain: monospace font, solid black
borders, no shading, gradients, or background fills, so it survives draft
mode on a dot-matrix printer without wasting ink/ribbon on things that won't
render well as a bitmap.

The page size is set in `style.css` to `9.5in x 5.5in`, matching a common
Indonesian continuous "1/2 folio" nota form (works with printers like the
Epson LX-310/LX-800). If your pre-printed stationery is a different size:

1. Open `style.css`.
2. Change the `--page-width` and `--page-height` variables near the top of
   the file to match your paper.
3. Also set the matching paper size in your printer driver / OS print
   dialog (custom paper size), so the browser and the printer agree.

## Running it locally

It's plain HTML/CSS/JS, no build step. Either:

- Open `index.html` directly in a browser, or
- Serve the folder with any static server, e.g. `python3 -m http.server`
  and visit `http://localhost:8000`.

## Hosting for free on GitHub Pages

GitHub Pages serves static files (HTML/CSS/JS) straight from a repository
at no cost, which fits this project exactly since there's no backend.

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings -> Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a
   branch**, pick the branch (e.g. `main`) and folder (`/root`), then save.
4. GitHub publishes the site at
   `https://<your-username>.github.io/<repo-name>/` within a minute or two.
