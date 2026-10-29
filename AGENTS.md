# Project conventions

This is a bilingual Jekyll website using Just the Docs, with `_pages` included as
ordinary pages following the Academic Pages organization. Read
[the bilingual content guide](docs/bilingual-content.md) before changing pages or routing.

## Languages, filenames, and URLs

- Source content lives in `_pages/en/` (en-US) and `_pages/pt/` (pt-BR).
- Keep source filenames and directory names in English in both language trees.
  Translate public URL slugs in the page's `permalink` to its actual language.
- Portuguese URLs have no language prefix; English URLs keep `/en/`. Examples:
  - `_pages/pt/teaching.md` → `/ensino/`;
    `_pages/en/teaching.md` → `/en/teaching/`.
  - `_pages/pt/research.md` → `/pesquisa/`.
  - `_pages/pt/extension.md` → `/extensao/`.
  - Portuguese About, Publications, and CV use `/sobre/`,
    `/publicacoes/`, and `/curriculo/`.
- Apply the same convention recursively when adding actual course pages:
  `_pages/pt/teaching/data-structures-iii.md` →
  `/ensino/estruturas-de-dados-iii/`; the English counterpart uses
  `/en/teaching/data-structures-iii/`.
  `operating-systems-ii.md` uses `/ensino/sistemas-operacionais-ii/`
  and `/en/teaching/operating-systems-ii/`.
  Current courses are sections, not separate pages; do not create empty pages merely
  to materialize this naming convention.
- Use lowercase ASCII slugs with hyphens; remove Portuguese diacritics.
- Paired pages declare `lang`, `locale`, a shared stable English `translation_key`,
  and a unique `permalink`. Nested keys must be unique across the site (for example
  `teaching/data-structures-iii`). Match language counterparts by `translation_key`;
  never infer translated routes by replacing only `/en/` with `/`.
- Preserve previous URLs using redirects in `aliases/`; exclude redirects from
  search and sitemap. Language-detecting redirects must declare both
  `redirect_to` (English fallback) and `redirect_to_pt` explicitly.
- Internal links and assets use Jekyll `relative_url`, respecting `baseurl` and the
  current host. Canonical and alternate-language metadata may use `absolute_url`.
- Update `_data/navigation.yml`, internal links, alternate links, and checks when
  changing routes. UI translations belong in `_data/locales/{en,pt}.yml`.
- Label Extensão as **Extension** in English (never Outreach).
- Show both `PT | EN` options and underline the active language.
- `/` uses an explicit saved language preference, then the browser's first supported
  language, falling back to English.
  Portuguese slugs and `/en/` URLs preserve their language; only `/` auto-selects.
  The root renders Portuguese and only redirects when English is selected. Avoid
  self-redirects. `/404.html` is the Portuguese GitHub Pages error entry point;
  requests under `/en/` use `/en/404.html`. Keep old `/pt/` URLs as redirects only. No geolocation is needed.

## Validation and local preview

Run `bundle exec jekyll build`, `python3 scripts/check_bilingual_site.py _site`,
and `node scripts/check_language_redirect.cjs`. For route changes, also validate
with a nonempty baseurl (see the bilingual guide).

Jekyll does not reload `_config.yml` while serving: restart the preview after
configuration changes. On this workstation, `academic-site-preview.service`
serves port 4000 from `/run/user/1000/academic-site-preview/site`, independently
of `_site/`. Building `_site/` alone does not update that service's configuration.
Validate the actual HTTP routes before claiming that a live preview is fixed.

Keep shared layouts, scripts, and styles shared. Do not duplicate assets or create
new collections unless real content needs them. Preserve academic facts during translation.

Repository documentation and commit messages use English unless another language
is explicitly requested, necessary for the task, or recommended by the context;
public pages remain bilingual. Follow Conventional Commits for every new commit:
`type(scope): description`, with an optional scope and an English description.
Use a type that describes the change, such as `fix`, `feat`, `perf`, `docs`,
`refactor`, `test`, `ci`, or `chore`. Keep local references, machine configuration,
backups, and review artifacts ignored and excluded from the generated site. Keep
`Gemfile.lock` versioned. Do not commit, push, enable Pages, or deploy without the
user's explicit confirmation. Deployment uses a manual workflow with
`deploy: true`.
