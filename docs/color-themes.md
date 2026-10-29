# Color theme

The site uses the Air color theme in light or dark mode. The header button
switches modes; before a manual choice, the browser's color preference applies.
Manual mode choices are saved in `localStorage` as `theme`.

## Configuration

- `_config.yml`: set `site_theme` to the site-wide theme (`air`).
- `_sass/theme/_air_light.scss`: Air light colors.
- `_sass/theme/_air_dark.scss`: Air dark colors.
- `assets/js/theme.js`: applies the system preference and saved mode.

The separate light and dark files follow the
[Academic Pages theme structure](https://github.com/academicpages/academicpages.github.io/tree/master/_sass/theme).
The Air colors are adapted to the site's `--site-*` roles and Just the Docs
layout. Academic Pages is MIT licensed; its notice is preserved in
[`third-party/academicpages-LICENSE.txt`](third-party/academicpages-LICENSE.txt).
