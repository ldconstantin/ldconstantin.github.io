# Website writing and design guide

## Purpose

Help students, colleagues, and other readers find information about Leonardo
D. Constantin's academic background, teaching, research interests, and extension
activities. The website uses Just the Docs' structure, Pagefind search,
Academic Pages' navigation and light/dark behavior, and the Air color theme.

Use Leonardo's name as the site identity and familiar words for navigation and
controls. Keep the header, sidebar, search control, and content positions
consistent across pages.

## Writing rules

Keep repository documentation and commit messages in English.
The website has Brazilian Portuguese and American English pages. Follow the
[bilingual content guide](bilingual-content.md) for language selection and routes.
Apply these principles to new content and to content revisions:

- State the page's subject first. Give the reader a clear next step when one
  exists.
- Use familiar, literal words and active verbs. Name the person who acts when
  that information matters.
- Give one instruction per step. Keep each sentence focused on one idea.
- Use the same term for the same thing. Do not alternate between synonyms for
  navigation labels, controls, or technical concepts.
- Explain a technical term or abbreviation on first use. Keep precise terms
  when replacing them would change the academic meaning.
- Use short paragraphs and descriptive headings. State dates, units, and
  conditions explicitly when ambiguity could affect the reader's decision.
- Describe the destination of a link. Avoid generic labels such as “click
  here”. Do not tell readers to locate a control only by color or position.
- Separate established facts, work in progress, and missing information. Add
  sources for academic claims. Do not fill empty pages with invented work.

ASD-STE100 defines controlled English for technical documentation. Its writing
discipline informs the website's prose, but its English dictionary is not a
Portuguese vocabulary rule. Do not describe Portuguese pages as ASD-STE100
conformant. No automatic sentence-length score proves that text is clear.

## Readability and Easy Read

Use left-aligned text, visible section boundaries, descriptive links, and
short reading blocks. Preserve text resizing and browser zoom. Body text and
navigation use the operating system's sans-serif fonts, and code uses its
monospace fonts. This avoids downloading web fonts before the page can render.
Reading text has a 1.5 line height.

The centered desktop layout uses a 15rem sidebar and a 47rem content region
(including its padding). The intermediate sidebar is 14.5rem; navigation keeps
its existing 50rem and 66.5rem breakpoints. At the default browser size, prose
uses 18px on desktop and mobile. Headings use the Academic Pages scale and bold
weights; headings and navigation use natural letter spacing and sentence case.
The root follows the reader's browser font preference rather than shrinking
on small screens. Header links wrap when needed. The sidebar links to H2, H3, and H4 headings
from the open page, including explicitly anchored sections and the homepage.
Parent headings retain their own section links alongside expansion controls.
The professional profile appears in the homepage's main content and uses a
shared optimized local image with descriptive alternative text.
The portrait is `assets/images/profile.webp`, preloaded on both homepages.
Replace that file deliberately when updating the photo; it does not make a
runtime request to GitHub.
Pagefind search opens in a modal from a magnifying-glass button in the header,
alongside the language and light/dark controls. The dialog supports keyboard search.
Only the main page content is indexed, including course descriptions and titles,
excluding navigation and footer material. About and Publications placeholders
stay out of search and the sitemap until substantive content is ready.
The Ensino page presents current, previous, and proposed course titles with
short descriptions and no links to course pages. Individual course pages and
lesson files are not currently published. Keep profile metadata at a
consistent readable size. Public profile links use a compact height with fine
pointers and stay at least 44px high with coarse pointers. Sidebar navigation
uses 16px; footer text uses 14px. Headings with subsections have expansion
buttons; leaf entries link directly to their headings. Neutral surfaces and consistent
insets group the sidebar without gradients or additional colored bands.
The site uses the Air color theme, with separate light and dark Sass files;
the header button changes the mode. Table cells and code blocks use 16px.
Tables have no decorative shadow, and syntax highlighting follows the active
mode. Professional roles on the homepage are headings, with institutions and
dates presented as secondary text.
The same metadata style applies to extension entries and post dates.
Redirect fallbacks share the site
stylesheet and saved theme preference.

These choices support readable academic pages. They do not make the default
site a validated Easy Read edition. Inclusion Europe's guidance goes further,
including reader involvement, simple sentence structure, supporting images
where useful, and specific layout and typography choices. A future Easy Read
version should use a dedicated single-column, sans-serif reading presentation
and be reviewed with its intended readers. Preserve scientific meaning when
simplifying text. Provide a technical version when needed.

## Color language

Color reinforces meaning. Readers must also receive that meaning without
color. The base palette does not assign a different color to each discipline.
The Air palette identifies links and navigation. Link underlines,
selected-state marks and named controls communicate their purpose independently
of color. Accent colors do not mean “approved”, “safe”, “complete”, or “published”.

The light Air palette uses `#f7f8f8` reading areas and `#353f44` body text;
dark mode uses `#283034` and `#e6eae9`. Link colors derive from `#2a5978`
in light mode and `#79b6d0` in dark mode, with adjustments in the Sass files.
The sidebar, separators, hover backgrounds, and secondary text derive from
the background and text colors. Structural dividers
remain 1px and use the separator token in both themes. Focus outlines and
selected-state underlines remain stronger than decorative dividers.
Filled actions use white ink on the theme's brand color. The exact color
definitions are in `_sass/theme/_air_light.scss` and `_sass/theme/_air_dark.scss`.
The [color theme guide](color-themes.md) records their relationship to Academic Pages.

| Role in SCSS | Meaning | Visible cue beyond color |
| --- | --- | --- |
| `--site-background`, `--site-surface` | Reading areas | Headings, spacing, and content grouping |
| `--site-sidebar`, `--site-brand` | Site identity and navigation region | Stable position, site name, named links |
| `--site-text`, `--site-heading`, `--site-muted` | Text hierarchy | Heading structure and wording; muted text is still readable |
| `--site-link` | A destination or action | Underlined reading links and card titles; button boundaries |
| `--site-hover` | Pointer feedback | Links remain recognizable before hover |
| `--site-rule` | Separation | Grouping only; a quiet rule must not be the only control boundary |
| `--site-control` | Identifiable control boundary | Search field shape and explicit label; contrast checked separately from decorative rules |
| `--site-action-ink` | Text on filled action backgrounds | Action text and the button boundary |
| `--site-brand-ink` | Text and icons on filled brand surfaces | Use only against the corresponding brand background |

The header links to Teaching, Research, and Extension in the current language.
The sidebar lists sections and subsections of the current page.
The current header destination exposes
`aria-current="page"`. Keyboard focus uses an outline.
The theme control uses distinct sun/moon shapes and a named pressed state.
The header's theme button switches between Air's light and dark modes.
Do not depend on tooltips as the only accessible label.

If status messages are added, show a visible label such as “Informação”,
“Atenção”, “Erro”, or “Concluído”. Explain what happened and what the reader
can do. Pair color with that label and, when helpful, a distinct symbol.
An error must not be indicated only by a red border. Charts need labels,
patterns, or line styles as well as color, and a text or tabular equivalent.
Do not infer urgency or severity from hue alone.

## Review before publication

1. Check the rendered page and its sources. Confirm that links, dates, and
   academic claims are correct.
2. Check both themes. Target at least 4.5:1 for normal text, 3:1 for large text,
   and 3:1 for required non-text control and state indicators against adjacent
   colors. Quiet decorative separators have a different role from indicators.
3. Read the page in grayscale. Confirm that links, selected navigation, focus,
   and any status or chart remain understandable. Use color-vision simulation
   as an additional check, not as proof of access for all readers.
4. Use the keyboard. Check the skip link, menu, search, section links, and
   theme button. Keep focus visible throughout.
5. Check narrow screens and zoom. Confirm the reading order and that controls
   and text remain reachable. Test assistive technology where available.
6. Ask intended readers to review wording and tasks. Include readers with
   relevant access needs. Record problems and revise the page.

The current implementation has build and selected structural, behavior, and
contrast checks. These checks do not establish complete WCAG conformance,
screen-reader compatibility, or comprehension by the intended audience.

## Sources and adaptation boundary

- [ASD-STE100 official site](https://www.asd-ste100.org/): the standard and its
  English-language scope. The official site restricts some automated access;
  consult the official issue before claiming rule-level conformity.
- [Inclusion Europe: Easy-to-read guidelines](https://inclusion.eu/easy-to-read/guidelines/):
  the primary European Easy Read resources, including a Portuguese version.
- [EU Publications Office: plain language and Easy-to-read](https://op.europa.eu/en/web/webguide/plain-language-and-easy-to-read):
  a distinction between general clarity and the specialized Easy Read format.
- [W3C: use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html):
  meaning must not depend only on color.
- [W3C: contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html):
  the contrast targets used for review.

The rules above are the website's design policy, informed by these sources.
They are not a reproduction of the standards or a certification.
