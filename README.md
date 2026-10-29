# Leonardo D. Constantin — personal and academic website

Source for [Leonardo D. Constantin's website](https://ldconstantin.github.io/),
with my academic background, professional experience, teaching, research
interests, and extension activities. The site is available in Brazilian
Portuguese and American English.

The website uses Jekyll, [Just the Docs](https://just-the-docs.com/), and
[Pagefind](https://pagefind.app/). Its section navigation and light/dark behavior
draw on Academic Pages. Local reference checkouts are excluded from the
published website.

## Maintain the website

- Edit Portuguese content in `_pages/pt/` and English content in `_pages/en/`.
  Keep matching English source filenames and pair translations by
  `translation_key`. Follow the [bilingual content guide](docs/bilingual-content.md)
  for page metadata, public URLs, language switching, and redirects.
- Edit the main menu in `_data/navigation.yml` and interface translations in
  `_data/locales/`. The sidebar links to H2, H3, and H4 headings from the current page,
  including explicitly anchored sections.
- Keep shared layouts, scripts, and styles in their existing directories.
  The Air colors live in `_sass/theme/_air_light.scss` and
  `_sass/theme/_air_dark.scss`.
- Check academic facts, dates, references, and links before publication.
  Add course pages or collections when there is substantive content to publish.

The [writing and design guide](docs/site-guide.md) records the
website's presentation rules. The [architecture decision](docs/architecture.md)
describes its structure. The [color theme guide](docs/color-themes.md) covers
the shared Air light and dark modes.

## Content and integrations

MathJax, Mermaid, Plotly, and Leaflet render automatically from page content.
The [integration guide](docs/content-integrations.md) covers syntax, themes,
icons, copying code, redirects, and dependency configuration.

The homepages (`/` and `/en/`) include my professional profile and academic CV.
English pages use `teaching/`, `research/`, `extension/`, `about/`, and `publications/`;
Portuguese pages use `ensino/`, `pesquisa/`, `extensao/`, `sobre/`, and `publicacoes/`.
Only the root automatically selects a language: explicit `?lang=pt` intent
takes precedence, followed by a saved preference, then the
browser's first supported language, falling back to English. PT homepage links
include `?lang=pt` so they also work when browser storage is unavailable.
`/en/cv/` and `/curriculo/` redirect to their respective homepages. Legacy
redirects preserve query strings and fragments, using a shared section
translation map for known old anchors.
See [bilingual content](docs/bilingual-content.md) for editing and routing conventions.
Search includes course descriptions as well as titles. About and Publications
remain placeholders and are excluded from search and the sitemap. Both homepages
use the same optimized local profile image.

Third-party notices remain in [Academic Pages' license](docs/third-party/academicpages-LICENSE.txt)
and [Minimal Mistakes' license](docs/third-party/minimal-mistakes-LICENSE.txt).
Preserve these notices with adapted code.

## Local preview

Ruby, Bundler, Python 3 (for validation), and Node.js (for indexing search and
redirect checks) are required. Keep `Gemfile.lock` in version control so local
and CI builds resolve the same Ruby dependencies.

```sh
bundle install
bundle exec jekyll build
npx --yes pagefind@1.5.2 --site _site
python3 scripts/check_bilingual_site.py _site
node scripts/check_language_redirect.cjs
python3 -m http.server --directory _site 4000
```

Open `http://localhost:4000/` to inspect the complete site. `jekyll serve`
also rebuilds the Pagefind index after each change (Node.js and npx required).
Restart Jekyll after changing `_config.yml`. On this workstation,
`academic-site-preview.service` uses port 4000 and serves
`/run/user/1000/academic-site-preview/site`; building `_site/` alone does not
update that preview. The simple Python server above serves static files and
does not reproduce GitHub Pages' custom 404 handling.

With a running Jekyll preview, browser regression checks use Playwright 1.58.2:

```sh
npm install --prefix /tmp/site-browser-check --no-package-lock --no-save playwright@1.58.2
node /tmp/site-browser-check/node_modules/playwright/cli.js install chromium
PLAYWRIGHT_MODULE=/tmp/site-browser-check/node_modules/playwright node scripts/check_navigation.cjs
```

`SITE_URL` selects another preview address or base path; `CHROMIUM_PATH` selects
an existing Chromium executable. CI runs the same browser checks before upload.

## Publishing

The [publication readiness record](docs/publication-readiness.md) lists the
checks completed and the remaining approval and hosted verification steps.

The `.github/workflows/pages.yml` workflow builds and validates the site on
pushes to `main`. Configure **Settings → Pages → Build and deployment → Source:
GitHub Actions** in the repository. Deployment runs only through a manual
`workflow_dispatch` run with the boolean `deploy` input set to `true`; it defaults
to `false`. A push or a manual run with the default input does not deploy.

Review the final diff and obtain confirmation before committing,
pushing, or deploying. Use English for repository documentation and commit
messages; public content remains bilingual.

## Project boundaries

See [the architecture decision](docs/architecture.md) for responsibilities and
scope. Local references, machine configuration, review output, and backups are ignored
and excluded from publication. Ignore rules do not remove already tracked files;
review those removals explicitly before the final commit.
