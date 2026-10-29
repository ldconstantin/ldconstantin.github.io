# Architecture decision 001: academic website first

**Status:** Accepted on 2026-10-22; updated for the bilingual personal website on 2026-10-29.

## Context

This repository contains Leonardo D. Constantin's personal and academic website,
configured for `https://ldconstantin.github.io/`. It presents his background,
teaching, research interests, and extension activities in Portuguese and English.
Local references and development tooling are outside the published site.

## Options considered

1. **Jekyll website at repository root.** Smallest route to a GitHub user site, easy Markdown editing, and one local build command. Requires an explicit exclusion list for development directories.
2. **Jekyll website under `site/`.** Stronger source separation but requires build-directory configuration and a slightly more complex local workflow.

## Decision

Use **Jekyll at the repository root**, with the **Just the Docs 0.12.0 theme**
and Jekyll 4.4. GitHub Actions builds and validates the site on pushes to `main`. Deployment
of `_site/` requires a manual `workflow_dispatch` run with boolean `deploy: true`;
the input defaults to `false`. Pages use Markdown with front matter in `_pages/pt/`
and `_pages/en/`, included as ordinary pages following Academic Pages'
organization. The [bilingual guide](bilingual-content.md) defines routes,
translation keys, language preference, and legacy redirects.

Personal development tooling is maintained outside this repository. No local reference checkout belongs in the public website artifact. The website builds independently of personal tooling.

## Consequences and safeguards

- Keep the main content focused on the homepage, teaching, research, and extension.
  The homepage contains the professional profile and CV; legacy CV routes
  redirect there. About and Publications currently contain pending-content notices and are
  excluded from search and sitemap output.
- The header links to Ensino, Pesquisa, and Extensão, or their English
  counterparts. The sidebar links to H2, H3, and H4 headings and explicitly anchored sections
  from the current page; parent headings remain navigable. The title
  links to that language's homepage. Shared controls provide search, language
  selection, and light/dark mode. Both homepages share an optimized local avatar.
- Pair pages by `translation_key`, keep language-specific public permalinks,
  and use `relative_url` for internal destinations and assets. Add collections
  only when actual content requires them.
- Exclude local reference repositories and operational files from the Jekyll build.
- Review academic claims and citation details before publication; placeholders are not evidence of published work.
- Verify each new page with a local build and a human review of navigation, accessibility, and rendered content.
- Keep `Gemfile.lock` versioned for reproducible Ruby dependency resolution.
- CI validates bilingual routes and language redirects before uploading the site.
- Publication requires a configured GitHub Pages source and confirmation before
  committing, pushing, or deploying.
- Ignore local references, agent and machine configuration, generated output,
  and historical backups. Already tracked local files require explicit removal
  from tracking during the final commit review; ignore rules alone do not do this.

## Shared presentation and integrations

The layouts, includes, styles, and scripts serve this website. The site title
identifies Leonardo D. Constantin. Follow the
[writing and design guide](site-guide.md) for presentation and
review policy, and [color theme documentation](color-themes.md) for the Air
light/dark implementation.

Content integrations now use a shared, conditional browser loader for MathJax,
Mermaid, Plotly, and Leaflet. Versioned CDN URLs are configured in `_config.yml`.
The root build enables sitemap, redirect, gist, and emoji plugins. The site
does not publish posts, feeds, or paginated blog pages. See
[content integrations](content-integrations.md) for active integrations and dependencies.

Search now uses Pagefind 1.5.2 after Jekyll renders HTML. The workflow
generates `_site/pagefind/` before uploading the site; the Just the Docs Lunr
integration stays disabled. Search indexes main content, including course descriptions, and uses a modal
trigger in the header. Static builds need a separate Pagefind indexing step;
the local `jekyll serve` hook rebuilds the index automatically.

## Revisit when

Structured publication metadata, substantial course content, or a more complex
editing workflow requires new organization. Measure the maintenance cost before
introducing collections or additional tooling.
