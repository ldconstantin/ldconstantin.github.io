# Architecture decision 001: academic website first

**Status:** Accepted for the initial implementation (2026-10-22).

## Context

This GitHub user-site repository is primarily a public academic website. Local references and a separate `inir/` checkout also exist in the working directory.

## Options considered

1. **Jekyll website at repository root.** Smallest route to a GitHub user site, easy Markdown editing, and one local build command. Requires an explicit exclusion list for development directories.
2. **Jekyll website under `site/`.** Stronger source separation but requires build-directory configuration and a slightly more complex local workflow.

## Decision

Use **Jekyll at the repository root**, with the **Just the Docs 0.12.0 theme** and a pinned major Jekyll version. GitHub Actions will build the site and deploy `_site/` when publication is enabled. Site pages use Markdown with front matter and Portuguese (Brazil) by default.

Personal development tooling is maintained outside this repository. No local reference checkout belongs in the public website artifact. The website builds independently of personal tooling.

## Consequences and safeguards

- Keep a minimal page structure: home, teaching, research, extension, and CV. Add collections only when actual content requires them.
- The header links to Ensino, Pesquisa, Extensão, and CV. The sidebar lists headings from the current page and does not repeat the header links. The title links to home.
- Exclude local reference repositories and operational files from the Jekyll build.
- Review academic claims and citation details before publication; placeholders are not evidence of published work.
- Verify each new page with a local build and a human review of navigation, accessibility, and rendered content.
- Publication requires a configured GitHub Pages source and an authorized push to `main`; no deployment is implied by this local decision.

## Revisit when

The site overrides now form the **Academic Flight Manual** template. Keep
template identity separate from the owner's title in `_config.yml`. Follow
`academic-flight-manual.md` for writing, color meaning, and review policy.
This remains a root-level Jekyll site with theme overrides; a separate theme
package or repository is a later distribution decision. Build and deployment
conventions remain the same.

Content integrations now use a shared, conditional browser loader for MathJax,
Mermaid, Plotly, and Leaflet. Versioned CDN URLs are configured in `_config.yml`.
The root build enables sitemap, redirect, gist, and emoji plugins. The site
does not publish posts, feeds, or paginated blog pages. See
`content-integrations.md` for active integrations and dependencies.

The website needs multilingual navigation, structured publication metadata, substantial course collections, or a more complex content workflow. Measure the actual editing and maintenance cost before introducing additional tooling.

Search now uses Pagefind 1.5.2 after Jekyll renders HTML. The deployment workflow
generates `_site/pagefind/` before uploading the site; the Just the Docs Lunr
integration stays disabled. Search indexes main content only and uses a modal
trigger in the header. Local previews need a separate Pagefind indexing step.
