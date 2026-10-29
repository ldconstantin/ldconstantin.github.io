# Content integrations

## Author content without per-page setup

The website shares one content loader across both languages. Use an isolated source fixture when browser checks
need sample content. Figures in code examples are illustrative.

Kramdown interprets unescaped `|` characters as table columns, even in otherwise
ordinary paragraphs and list items. In CV entries and other prose, prefer `·`
between fields or escape a literal vertical bar as `\|`.

| Feature | Author input | Implementation |
| --- | --- | --- |
| MathJax 3.2.2 | Inline `$...$` or `\(...\)`, display `$$...$$` or `\[...\]`, MathML | Detect content math, load the SVG renderer, preserve code examples |
| Mermaid 11.12.2 | A fenced `mermaid` block | Render an accessible SVG; redraw on theme changes |
| Plotly.js 3.6.0 | A fenced `plotly` JSON block with `data` and optional `layout`, `config`, `description` | Render a responsive interactive chart; redraw theme defaults |
| Leaflet 1.9.4 | A fenced `leaflet` JSON block | Render an OpenStreetMap map with marker coordinates and optional GeoJSON |
| Syntax highlighting | A language-labelled code fence | Native Kramdown/Rouge and Just the Docs |
| Code copying | Code fences and media source disclosures | Native JTD buttons or a media-source button; HTTPS or localhost clipboard support |
| Tables, footnotes, TOC | Standard Markdown and Kramdown `{:toc}` | Native Jekyll/Kramdown |
| Icons | Font Awesome or Academicons classes with visible labels | Versioned CSS and font resources |
| Emoji | `:airplane:` and other supported shortcodes | `jemoji` |
| Sitemap and robots | Site pages | `jekyll-sitemap`; `/sitemap.xml` and `/robots.txt` |
| Redirects | Explicit destinations in `aliases/`; `redirect_from` where appropriate | Shared redirect layout preserves query/hash and uses a shared section translation map; `jekyll-redirect-from` handles plugin aliases |
| Gist embeds | The plugin's Liquid `gist` tag | `jekyll-gist`; fetching a gist is a build-time network operation |
| SEO metadata | Page title and site configuration | Existing `jekyll-seo-tag` from the theme |

Marp is not a Jekyll Markdown renderer. Marp slide decks require a separate export to HTML or PDF
with Marp CLI before they can be linked or embedded. The Jekyll build does not
invoke Marp. Pagefind search indexing separately requires Node.js and npx.

Plotly blocks use JSON, not executable JavaScript. Explicit author layout
properties override theme defaults. Add a `description` and a data table or
other equivalent explanation. Do not rely on color alone to distinguish traces.
Mermaid authors should supply `accTitle` and `accDescr`; the renderer uses strict
security mode. Maps use normal OpenStreetMap cartography in both site themes.
Marker labels are text, and image markers have descriptive alternative text.

The media loader uses one initialization path. The old independent JTD Mermaid
footer hook is replaced by the shared loader so a diagram is not rendered twice.
Source blocks remain available in a disclosure after rendering. Failed loads
or invalid blocks show a status message and preserve their source; one malformed
block does not stop the other integrations. Math follows the page text color.

## Configure resources

`_config.yml` contains pinned MathJax, Mermaid, Plotly, and Leaflet URLs under
`academic_media`. Each library loads only when relevant content exists in the
page. Math detection ignores code samples.
Set a specific resource to `false` to disable it, or `academic_media: false` to
disable the entire media loader. Font Awesome 6.7.2 and Academicons 1.9.4 CSS
are linked in `_includes/head_custom.html`; the browser loads fonts when used.

These defaults need an internet connection for CDN resources and map tiles.
To self-host, download complete dependency distributions and their licenses,
including Mermaid chunks and MathJax font resources. Then set root-relative
resource paths such as `/assets/vendor/mermaid/mermaid.esm.min.mjs`.
The loader prefixes the site's `baseurl` for those root-relative paths.
Leaflet's tile provider is OpenStreetMap and remains a separate network service.
This implementation does not promise offline availability of remote resources.

MathJax supports both common inline delimiter forms. Escape literal currency
delimiters where needed. Kramdown can consume backslashes, so check the rendered
HTML when writing literal TeX delimiters; `$...$` and `$$...$$` are the simplest
Markdown authoring forms. Legacy `script[type="math/tex"]` output is normalized
before loading MathJax.

MathJax is deliberately pinned to 3.2.2 with SVG output. Plotly 3.6.0's
`svg_text_utils.js` accepts MathJax major versions 2 and 3, not 4. The chart
loader waits for MathJax when formulas exist, including formulas inside chart
JSON. This supports mathematical chart labels as well as page equations. If
MathJax fails or is disabled, Plotly receives `typesetMath: false` so the chart
still renders with source labels. The two libraries are tested together.

## Build plugins

The site does not publish posts, feeds, or paginated blog pages. The Gemfile
lists the sitemap, redirect, gist, and emoji plugins. `bundle install` installs
them locally in the existing project bundle. GitHub Actions builds with Ruby
3.4 and uses the versioned `Gemfile.lock` for dependency resolution. Pagefind
1.5.2 runs through npx after Jekyll; no project `node_modules` directory is
required. CI also runs bilingual-route and language-redirect checks.
Analytics, comment-provider accounts, and personal profile identifiers are
maintained separately from content rendering.

## Verification

Run the build and routing checks in the [bilingual guide](bilingual-content.md),
then generate Pagefind's index as shown in the [README](../README.md). Confirm
that both course titles and descriptions appear in search and that placeholder,
redirect, and error pages remain excluded. Do not remove meaningful content
from indexing merely to shorten result excerpts.

When changing the media loader or dependency versions, exercise TeX and MathML,
Mermaid SVG, Plotly charts, Leaflet maps and tiles, icons, TOC, emoji, footnotes,
clipboard controls, both themes, and narrow layouts in a browser. Check malformed
source and blocked CDN requests for readable fallbacks and uncaught exceptions.
Recheck integrations after changing their implementation or dependency versions.

The build publishes content pages, a sitemap, robots file, and redirects. It
does not generate a posts feed or pagination pages. The Gist tag is enabled
through its official plugin; a live remote fetch needs its own check. Build and
structure checks do not establish assistive-technology accessibility for
arbitrary authored charts.

## Primary documentation

- [MathJax 3 configuration](https://docs.mathjax.org/en/v3.2/web/configuration.html)
  and [SVG output](https://docs.mathjax.org/en/v3.2/options/output/svg.html).
- [Mermaid API usage](https://mermaid.js.org/config/usage.html).
- [Plotly configuration](https://plotly.com/javascript/configuration-options/)
  and [responsive figures](https://plotly.com/javascript/responsive-fluid-layout/).
- [Plotly 3.6.0 math renderer](https://github.com/plotly/plotly.js/blob/v3.6.0/src/lib/svg_text_utils.js):
  the MathJax version compatibility boundary verified for this integration.
- [Leaflet quick start](https://leafletjs.com/examples/quick-start/).
- Official Jekyll plugins: [sitemap](https://github.com/jekyll/jekyll-sitemap),
  [redirects](https://github.com/jekyll/jekyll-redirect-from),
  [emoji](https://github.com/jekyll/jemoji).
