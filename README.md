# Academic Flight Manual

A Jekyll academic website template that combines Just the Docs' structure,
Pagefind search, Academic Pages' section navigation and theme toggle, and Aviator's
visual direction. This repository also contains the owner's website at
`https://ldconstantin.github.io/`.

The site uses [Just the Docs](https://just-the-docs.com/) for page navigation
and [Pagefind](https://pagefind.app/) for static search across Ensino, Pesquisa,
Extensão, and CV. Public content is
written in Markdown, with Portuguese (Brazil) as the default language.

The [template guide](docs/academic-flight-manual.md) defines writing, reading,
color, and interaction rules. It adapts clarity principles from ASD-STE100 and
Easy Read guidance. This is a design approach, not a claim of standards
conformance or a validated Easy Read edition.

The [aviation design study](docs/aviation-design-study.md) traces the current
visual treatment to inspected Cessna and NASA documentation, with a backup
record and the checks used to preserve layout and behavior.

## Adapt the template

1. Set `title`, `description`, `url`, `baseurl`, and `repository` in `_config.yml`.
   `title` identifies the site owner; `template_name` identifies the template.
2. Edit the header links in `_data/navigation.yml`. The sidebar lists section
   headings from the page that is open. Use clear `##` and `###` headings.
3. Add reviewed academic facts and sources. Remove the current owner's text
   when you create another person's site.
4. Configure the theme in `_config.yml`; Air's light and dark colors live in
   `_sass/theme/_air_light.scss` and `_sass/theme/_air_dark.scss`.
5. Build and preview the site. Check links, keyboard focus, zoom, small-screen
   navigation, and meaning in grayscale before publishing.

The template works independently of local development tooling and reference
checkouts. It remains a set of Jekyll overrides in this repository;
it is not yet distributed as a separate theme gem.

## Content and integrations

MathJax, Mermaid, Plotly, and Leaflet render automatically from page content.
The [integration guide](docs/content-integrations.md) covers syntax, themes,
icons, copying code, redirects, and dependency configuration.

The homepage (`/`) includes the owner's professional profile and academic CV.
Other main routes are `/teaching/`, `/research/`, and `/extension/`.
The former `/cv/` route redirects to the homepage.
The import record in `docs/academicpages-import.md` and its license file retain
the source history of examples that are no longer part of the website.

## Local preview

Ruby, Bundler, and Node.js (for indexing search) are required.

```sh
bundle install
bundle exec jekyll build
npx --yes pagefind@1.5.2 --site _site
python3 -m http.server --directory _site 4000
```

Open `http://localhost:4000/` to inspect the complete site. `jekyll serve`
also rebuilds the Pagefind index after each change (Node.js and npx required).

## Publishing

The `.github/workflows/pages.yml` workflow builds the site from `main` and uploads `_site/` to GitHub Pages. Configure **Settings → Pages → Build and deployment → Source: GitHub Actions** in the GitHub repository before using that workflow. Pushing to `main` will then trigger publication. Publication is a separate decision from editing and reviewing the site locally.

## Project boundaries

See [the architecture decision](docs/architecture.md) for responsibilities and scope. Local `references/` and `inir/` are separate from published site content.
