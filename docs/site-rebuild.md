# Academic website redesign — initial implementation

Historical implementation record. Its project and demonstration routes were
later removed from the site.

## Purpose and scope

Rebuild the academic website using Jekyll at the repository root. Keep
Just the Docs 0.12.0 as the layout and search foundation. The site serves
Brazilian Portuguese readers looking for teaching, research, projects,
publications, and profile information. Do not invent academic credentials,
publications, or projects while substantive content is being assembled.

## Inspected local references

| Local checkout | Used for | Decision |
| --- | --- | --- |
| `references/just-the-docs` | Layout, sidebar, search JS and Sass | Override the smallest relevant includes; keep native search |
| `references/academicpages.github.io` | `_data/navigation.yml` pattern | Use a top-level horizontal navigation sourced from `_data/navigation.yml` |
| `references/aviator-jekyll-template` | Green, charcoal, light-gray palette | Original SCSS with `#35d69b` as accent and dark green for links |

## Layout contract

The header exposes seven Academic Pages demonstrations: Publicações, Palestras,
Ensino, Portfólio, Blog, CV, and Guia. Teaching and CV demonstrations use
`/examples/teaching/` and `/examples/cv/` so they do not replace owner content.

The standard Just the Docs sidebar owns the hierarchy. Its root sections are
Ensino (`/teaching/`), Pesquisa (`/research/`), Extensão (`/extension/`), Projetos
(`/projects/`), CV (`/cv/`), Blog (`/blog/`), and Demonstrações (`/examples/`).
Demo archives are children of Demonstrações; imported entries are grandchildren.
Root pages use `has_children`, child pages use `parent`, and third-level pages
also use `grand_parent`. The existing theme renderer handles expansion and
page selection. The real Academic Flight Manual project page is a child of
Projetos. Legacy `/ensino/`, `/pesquisa/`, and `/projetos/` URLs redirect to the
new roots with a plain link fallback.

The sidebar search reuses Just the Docs' `search_header.html` and its
client-side search index. The `id` attributes expected by the upstream
JavaScript stay unchanged. On narrow screens the top section links scroll
horizontally; the menu button still expands the theme's sidebar navigation.

Site-specific styling lives in `_sass/custom/custom.scss`. Header and
sidebar include overrides live in `_includes/components/`. The customized
`_layouts/default.html` translates the keyboard skip link and preserves
the theme's layout structure.

Typography uses Inter for interface and body text, Merriweather for headings
and quotations, and JetBrains Mono for code. Fonts load through Google Fonts
with swap rendering and generic fallback families.

## Accessibility and testing

The header includes a sun/moon theme button following the Academic Pages
reference behavior. `assets/js/theme.js` applies the saved `theme` preference
before body rendering, defaults to the system preference, and follows system
changes until a manual choice is made. Storage failures leave the button
functional for the current page. CSS variables provide both palettes without
changing stylesheets. The button has a Portuguese label and pressed state.

- Use structural landmarks and Portuguese labels for the page, search,
  and navigation.
- Mark the current section with `aria-current="page"`.
- Preserve keyboard focus indicators and a skip link.
- Keep the green accent distinct from link text; use `#086445` for readable
  links on light backgrounds.
- Verify a Jekyll build, the generated HTML structure, search index, page
  outputs, and the absence of development directories in `_site/`.
- Visual testing at mobile and desktop widths, keyboard navigation, and
  assistive-technology checks remain necessary before publication.

## Next content work

Replace the section introductions with reviewed academic material and
linked sources. Add structured collections only after content volume
justifies them. Keep local reference material and the independent `inir/`
checkout outside the published site.
