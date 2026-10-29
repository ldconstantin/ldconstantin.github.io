# Publication readiness — 2026-10-29

Local validation passed. The website is ready for an approved first push and
deployment, subject to GitHub Actions passing on the remote repository.
No commit, push, Pages enablement, or deployment has been performed.

## Completed corrections

- Portuguese homepage, CV, legacy redirects, and search results preserve their
  language when browser storage is unavailable. Explicit homepage links use
  `?lang=pt`; ordinary visits to `/` retain saved/browser language selection.
- Redirects preserve query parameters and translate known section fragments.
  Existing query/fragment encoding does not cause a self-redirect at the root.
- Sidebar sections have separate links and disclosure buttons. Courses are
  nested under their semesters, selected anchors are marked, and mobile menus
  close after section navigation.
- Current and previous course headings share typography, spacing, and theme
  colors. The mobile menu hover state keeps the icon visible in both modes.
- Course descriptions are searchable. Pending About/Publications pages are
  excluded from search and sitemap output.
- Both homepages use a preloaded local 400×400 WebP portrait: 10,726 bytes,
  about 30% smaller than the previous image, with no runtime GitHub request.
- Documentation and commit-message policy use English. Local references,
  machine artifacts, generated output, and unrelated records are ignored and
  excluded from the website. `Gemfile.lock` is available for version control.
- Pushes validate the site; deployment requires a manual workflow dispatch
  with `deploy: true`. The input defaults to `false`.

## Verification

| Check | Result |
| --- | --- |
| Ruby dependencies and Jekyll build | Passed |
| Bilingual routes, local assets, anchors, nested navigation, and redirect maps | Passed at `/` and `/project` |
| Node language-redirect regressions | 6 groups passed |
| Chromium navigation, search click-through, image loading, themes, and no-JavaScript fallbacks | 9 groups passed at each base path; 18 total |
| Responsive layout matrix | Both languages and themes at widths 320, 375, 768, 799, 800, and 1440; no horizontal overflow |
| Pagefind index | 8 content pages across 2 languages |
| Documentation links, workflow YAML, and Git whitespace checks | Passed |

Browser validation used Chromium 155.0.8059.84 and Playwright 1.58.2.
Desktop and mobile screenshots were captured and visually inspected.
An independent review found a Portuguese homepage search-result issue; its
mouse and keyboard regressions pass after correction.
See [the README](../README.md) for reproducible build and browser commands.

The Portuguese homepage search URL uses Pagefind's
[result URL metadata](https://pagefind.app/docs/components/results/), keeping
language intent in the link itself.

## Approval and hosted verification

The public repository is `ldconstantin/ldconstantin.github.io`. Local `origin`
and the `gh` default point there; the authenticated account has write/admin
permission. The remote is empty and GitHub Pages is currently disabled.

After explicit approval: commit and push the reviewed changes with English
messages, verify remote CI, enable GitHub Pages with the GitHub Actions source,
and run the manual deployment with `deploy: true`. Then verify public HTTPS
routes, language switching, search, and the portrait on the deployed host.

Remote CI and hosted behavior remain unverified until that approved publication.
This review does not establish full accessibility conformance or coverage of
every external profile link and browser engine.
