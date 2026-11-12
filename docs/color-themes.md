# Color theme

The site uses the Mint color theme in light or dark mode. The header button
switches modes; before a manual choice, the browser's color preference applies.
Manual mode choices are saved in `localStorage` as `theme`.

## Configuration

- `_config.yml`: set `site_theme` to the site-wide theme (`mint`).
- `_sass/theme/_mint_light.scss`: Mint light colors.
- `_sass/theme/_mint_dark.scss`: Mint dark colors.
- `assets/js/theme.js`: applies the system preference and saved mode.

The separate light and dark files follow the
[Academic Pages theme structure](https://github.com/academicpages/academicpages.github.io/tree/master/_sass/theme).
The Mint colors use the existing site's `--site-*` roles and Just the Docs
layout. The font families, weights, and sizes remain unchanged. Academic Pages is MIT licensed; its notice is preserved in
[`third-party/academicpages-LICENSE.txt`](third-party/academicpages-LICENSE.txt).
