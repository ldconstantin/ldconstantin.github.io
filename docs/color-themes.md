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

## Icon source

The favicon's academic cap geometry is adapted from
[Academic Pages' favicon](https://github.com/academicpages/academicpages.github.io/blob/master/images/favicon.svg),
which credits the [OOjs UI academic-progressive icon](https://commons.wikimedia.org/wiki/File:OOjs_UI_icon_academic-progressive.svg).
Its blue color was changed to teal; the SVG is accompanied by a 32px ICO fallback.
Profile links use compact inline SVG icons while keeping visible, accessible link labels.
Typography and font family configuration remain unchanged.
