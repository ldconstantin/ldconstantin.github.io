# Aviation documentation design study

Historical design study. Its homepage project card and demonstration notices
describe an earlier version of the site.

## Goal and constraints

Refine Academic Flight Manual using actual aviation documents and document
design research. Preserve the existing page regions, element positions,
navigation hierarchy, and content. Retain Inter for sans-serif text,
Merriweather for serif text, and JetBrains Mono for code and technical labels.
The header keeps the content background; the sidebar stays related to the
title strip. Support both light and dark themes.

The requested Impeccable-style workflow is represented locally by the curated
toolkit's rendered visual inspection and accessibility procedures. The
toolkit recorded this relationship in its source provenance file (`SOURCES.md`).
This pass uses `accessibility-review` and `verification`. No separate
Impeccable runtime, launcher, or installation was used.

## Inspected references

| Source | Inspection | Observed design information |
| --- | --- | --- |
| [Cessna T206H POH excerpts, hosted by NTSB](https://data.ntsb.gov/Docket/Document/docBLOB?FileExtension=pdf&FileName=POH+Excerpts-Rel.pdf&ID=20552801) | Rendered PDF pages 2–3; printed pages 4-7 and 7-23 | Stable section identifiers, bold titles, numbered steps, distinct note labels, and document references at consistent locations |
| [NASA CR-177605: On the Typography of Flight-Deck Documentation](https://ntrs.nasa.gov/api/citations/19930010781/downloads/19930010781.pdf) | Text and rendered PDF page 34; printed recommendation pages 31–32 | Typography, spacing, contrast, restrained emphasis, and evaluation in the intended conditions |
| [NASA TM-2016-219421: Designing Flightdeck Procedures](https://ntrs.nasa.gov/api/citations/20160013263/downloads/20160013263.pdf) | Text, sections 2.5.5–2.5.7, printed pages 42–44 | Format depends on use; grouping and clear titles support keeping one's place; avoid dense all-capital text and excessive gaps |

The local inspected PDF copies live under ignored `references/aviation-manuals/`.
The Cessna artwork and text are not copied into the website. NASA's 1992
recommendations are historical guidance, not a current web standard. The 2016
report also cautions that a format must be evaluated for its actual use.

## Inferred design signature and implementation

The following is our interpretation of these references, not a published
aviation specification or a claim that all flight manuals share one style.

| Inferred signature | Website adaptation | Deliberately preserved |
| --- | --- | --- |
| Identity and location stay predictable | Existing title strip, header, sidebar, and breadcrumbs; selected sidebar entry gains a narrow location bar as well as an underline | All page regions and navigation destinations |
| A document has a clear hierarchy | Thin rules below second-level headings; existing serif headings retain their academic voice | Font families, heading sizes, and spacing |
| Labels differ from running text | JetBrains Mono for the small template label, homepage eyebrow, and section numbers | Inter body text and existing label locations |
| Navigation has a stable order | The header follows `_data/navigation.yml`: Ensino, Pesquisa, Extensão, CV | Each destination remains a separate page |
| Information aligns for scanning | Tabular numerals in tables and list markers; defined table-header surfaces | Existing tables and list structure |
| Emphasis has a purpose | Strong text and boundaries for controls; labelled demo notices remain visible | Underlined links, focus outlines, and sun/moon shapes |
| Document surfaces stay quiet | Crisp off-white and ink in light mode; dark blue-green surfaces in dark mode; restrained green accents | Header/content color match and sidebar/title relationship |

Monospaced labels, the new palette, and the dark mode are our contemporary
adaptations. They are not prescribed by NASA or Cessna. We do not copy cockpit
display colors wholesale: the site's green still identifies branding and
interaction, not operational approval or safety. Warning colors remain reserved
for actual labelled warnings. There are no fake document revisions, approval
stamps, aircraft controls, company marks, or decorative cockpit graphics.

The indexed homepage markers are decorative duplicates of the link names and
are hidden from assistive technology. No new knowledge is encoded only by color
or by the markers. The existing demo data stays explicitly labelled.

## Backup

Before editing, the site was archived under:

`docs/backups/before-aviation-manual-20261022-233920/`

The directory contains `site-source.tar.gz`, `rendered-site.tar.gz`, and a
`sha256.json` manifest for 66 source files. Previous backups, reference
checkouts, private skills, and `inir/` were not copied into the archive.
Backups are locally ignored and excluded from the Jekyll output with `docs/`.
Use this snapshot to restore the earlier source files when needed; it does
not include or manage the independent checkouts.

## Verification

The Jekyll build and local link checks cover 37 generated pages. Browser
verification uses the built site through the local preview server. A temporary
Chromium DevTools script switches between the backed-up stylesheet and the
new stylesheet with the same loaded fonts and DOM. Added decorative index
markers are hidden during the baseline measurement.

At 1366 × 900 and 390 × 844 in both themes, the measured bounds of the sidebar,
title strip, search region, header, main content region, hero, action group,
grid, and each card match the backup within a 0.6 CSS-pixel tolerance.
This measurement covers those elements on the homepage; it does not prove
that every element on every page has unchanged geometry.

Behavior checks cover theme changes and saved preference after reload,
keyboard-visible focus on the theme button, native search results, nested
sidebar expansion, header section selection, and the mobile menu. Screenshots
include both themes, desktop/mobile views, a publication detail page, grayscale,
and forced colors. Grayscale and forced-colors images are inspection aids,
not substitutes for testing with readers and assistive technology.

Selected palette checks require at least 4.5:1 for eight text/background pairs
per theme and 3:1 for control boundaries against the page, sidebar, and surface
backgrounds. Quiet separators do not serve as the sole control indicator.
Print overrides use a white page with dark text; inspect actual browser/print
output before relying on a published print edition.

Temporary browser results and screenshots are in `/tmp/afm-aviation-review/`.
The local review commands are:

```sh
bundle exec jekyll build
python3 /tmp/check_afm_navigation.py _site
node /tmp/afm-visual-review.mjs
git diff --check
```

The two `/tmp` scripts are session review aids, not template dependencies.
These checks establish the observed behavior and selected contrast results;
they do not establish complete accessibility or aviation-standard conformance.
