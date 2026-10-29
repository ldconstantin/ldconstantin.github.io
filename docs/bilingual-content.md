# Bilingual content

Like Academic Pages, this site includes `_pages` as ordinary Jekyll pages.
Just the Docs remains the theme. Sources stay in `_pages/pt/` (pt-BR) and
`_pages/en/` (en-US), with matching English filenames and directory names.

Portuguese public URLs have **no `/pt/` prefix**. English URLs keep `/en/`.

| Filename | Portuguese URL | English URL |
| --- | --- | --- |
| `home.md` | `/` | `/en/` |
| `teaching.md` | `/ensino/` | `/en/teaching/` |
| `research.md` | `/pesquisa/` | `/en/research/` |
| `extension.md` | `/extensao/` | `/en/extension/` |
| `about.md` | `/sobre/` | `/en/about/` |
| `publications.md` | `/publicacoes/` | `/en/publications/` |
| `cv.md` | `/curriculo/` | `/en/cv/` |
| `404.md` | `/404.html` | `/en/404.html` |

CV routes redirect to their respective homepages. Apply the URL convention
recursively to future subpages: `_pages/pt/teaching/data-structures-iii.md` uses
`/ensino/estruturas-de-dados-iii/`, and its English counterpart uses
`/en/teaching/data-structures-iii/`. Operating Systems II uses
`/ensino/sistemas-operacionais-ii/` and `/en/teaching/operating-systems-ii/`.
Current courses are sections; these subpages do not exist yet.
Use lowercase ASCII slugs with hyphens and no accents.

Each page declares `lang`, `locale`, a stable English `translation_key` shared by
both versions, and a unique `permalink`. Nested translation keys include their
parent path, such as `teaching/data-structures-iii`. Switch languages by matching
`translation_key`; never infer translated slugs by replacing URL prefixes.
All internal links and assets use `relative_url`, respecting `baseurl` and the
current host. Metadata uses `absolute_url` for canonical and alternate links.

`/` renders the Portuguese homepage. Its entry script checks an explicit
`?lang=pt` query choice first, then a saved explicit choice, then
the browser's first supported language, with English as the fallback. It redirects to
`/en/` only when English is selected; Portuguese stays at `/` without reloading.
PT links to the homepage use `/?lang=pt` (with `relative_url`) and save the
choice when storage is available. The query makes the intent explicit even
when storage is blocked. Without JavaScript, `/` displays Portuguese. Portuguese slugs and `/en/` URLs preserve
their language. No geolocation is requested.

Keep previous `/pt/` paths and English-slug routes as redirects in `aliases/`.
Unprefixed Portuguese slugs now serve actual content rather than redirects.
Language-detecting legacy redirects declare both `redirect_to` (English fallback)
and `redirect_to_pt` explicitly. Redirects preserve the query string and hash;
known legacy section anchors use a shared section translation map to reach
the current anchor in the destination language. Keep that map in sync when
renaming sections. Redirects to the
Portuguese homepage include explicit `?lang=pt` intent to avoid bouncing to
English when storage is blocked. Exclude redirects from search and sitemap.

Navigation is in `_data/navigation.yml`; UI text is in `_data/locales/{pt,en}.yml`.
The language selector displays `PT | EN`, underlines the current language, and
links to the equivalent page or that language's homepage if no translation exists.
Its links work without JavaScript; storage failures leave navigation available.
Shared layouts, CSS, images, and scripts remain shared. Label Extensão as
**Extension** in English. Preserve institution names, competitions, and academic facts.

`_pages/pt/404.md` also serves as GitHub Pages' root `/404.html` error entry point.
It displays Portuguese for unprefixed missing URLs and redirects requests under
`/en/` to `/en/404.html`. Error pages are excluded from search and sitemap.
Pagefind uses each document's HTML language to build separate language indexes.
The Portuguese homepage sets its search-result URL to `/?lang=pt` through
Pagefind metadata, so search links preserve language even when storage is blocked.
Course descriptions and titles are searchable. About and Publications placeholders
also declare `search_exclude: true` and `sitemap: false`; remove those exclusions
only when substantive content is ready.

Build and validate:

```sh
bundle exec jekyll build
python3 scripts/check_bilingual_site.py _site
node scripts/check_language_redirect.cjs
npx --yes pagefind@1.5.2 --site _site
bundle exec jekyll build --baseurl /project --destination /tmp/bilingual-subpath
python3 scripts/check_bilingual_site.py /tmp/bilingual-subpath /project
```

Restart the preview after `_config.yml` changes: Jekyll does not reload it while
serving. The local `academic-site-preview.service` serves port 4000 from
`/run/user/1000/academic-site-preview/site`, independently of `_site/`.

CI runs the bilingual-site and redirect checks before publication. Also verify
the actual preview HTTP routes after restarting a configured preview; rebuilding
`_site/` alone does not update the service above.
