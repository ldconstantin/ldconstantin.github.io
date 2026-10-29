# Academic Pages demonstration import

This is a historical source and license record. The imported pages have been
removed from the site and the current source tree. The ledger and license stay
here to preserve attribution for the files retained in Git history.

## Source and license

The local reference checkout is `references/academicpages.github.io` at
revision `7b958332ce9970cfb6987a049d7684ac615397e8`.
Its MIT license is preserved at `third-party/academicpages-LICENSE.txt`.
`_data/academicpages_import.yml` records source paths, destination paths, and
source SHA-256 hashes. Imported text is demonstration material, not evidence
of the site owner's work or credentials. Each rendered demo page states this
and links to its source revision.

## Header destinations

| Upstream main page | Local destination | Adaptation |
| --- | --- | --- |
| Publications | Not published | Five sample papers, retained as source material with metadata and source-hosted document links |
| Talks | Not published | Four sample talks with detail pages, retained as source material |
| Teaching | `/examples/teaching/` | Two sample courses, separate from the real `/teaching/` root |
| Portfolio | Not published | Two sample projects, retained as source material |
| Blog Posts | `/blog/`, `/year-archive/` | Four sample posts listed as demos, separate from the owner's `site.posts` and feed |
| CV | `/examples/cv/` | Explicitly fictional upstream education, work, and skills; production links point to demo archives |
| Guide | Not published | Local configuration/navigation guide and an imported Markdown/HTML specimen, retained as source material |

The 18 imported specimen pages preserve English sample text and mark its
language. The surrounding interface remains in Brazilian Portuguese.
The upstream post dated 2199 is deliberately omitted. No future-publication
setting is enabled. The shared content integration renders sample math,
Mermaid, Plotly, and Leaflet maps without per-page setup. The imported guide
content remains available in source, but its routes are excluded from the build.
The original talk-map notebook pipeline is not required. Portfolio archive
excerpts use plain text, so they do not depend on upstream placeholder images.
PDF, slides, and BibTeX links continue to point to their supplied upstream URLs;
this import verifies local links, not availability of external documents.

The source archive and CV templates depend on Minimal Mistakes includes. They
are adapted to `layout: default` and small local archive/metadata includes.
The upstream main-page source hashes are retained even where the local page
has been rewritten to match this runtime. This is an adaptation, not a binary
copy of the upstream theme.

## Sidebar contract

The root groups are Ensino, Pesquisa, Extensão, Projetos, CV, Blog, and
Demonstrações. The unmodified Just the Docs `site_nav` include builds the tree.
Archive pages use `parent: Demonstrações`. Imported entries also name the
archive as `parent` and use `grand_parent: Demonstrações`. Thus the header can
open an archive while its sidebar branch expands and highlights the active
entry. Nested demonstration pages underline the appropriate header section;
only an exact destination uses `aria-current="page"`.

For owner content, create a root-level Markdown page or a page in a normal
source folder. Set `parent` to the section's title, such as `Ensino`. Add
`grand_parent` for a third level. A URL prefix alone does not establish a
Just the Docs navigation relationship. `projects/academic-flight-manual.md`
provides a real child page under Projetos.

The original Portuguese source filenames are retained. Their permalinks now
use `/teaching/`, `/research/`, and `/projects/`. Static redirects preserve the
previous Portuguese URLs without adding a plugin. Homepage links use the new
URLs. No separate Academic Pages theme or collection engine is installed.
