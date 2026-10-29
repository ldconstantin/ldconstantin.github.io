"""Check generated bilingual pages: python3 scripts/check_bilingual_site.py _site."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from collections import Counter
import json
import sys

site = Path(sys.argv[1] if len(sys.argv) > 1 else '_site')
baseurl = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else ''


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.links, self.ids, self.switches = [], set(), []
        self.id_counts, self.section_links, self.assets = Counter(), {}, []
        self.in_local_nav, self.in_map, self.map_json = False, False, ''
        self.list_ids = []
        self.active_languages = []
        self.lang = None
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html':
            self.lang = attrs.get('lang')
        if 'id' in attrs:
            self.ids.add(attrs['id'])
            self.id_counts[attrs['id']] += 1
        if tag == 'nav' and attrs.get('id') == 'site-nav':
            self.in_local_nav = True
        if self.in_local_nav and tag == 'ul':
            self.list_ids.append(attrs.get('id'))
        if tag == 'script' and attrs.get('id') == 'language-section-map':
            self.in_map = True
        if tag in ['img', 'script'] and attrs.get('src'):
            self.assets.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') == 'stylesheet':
            self.assets.append(attrs['href'])
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs['href'])
            if self.in_local_nav:
                self.section_links[attrs['href']] = self.list_ids.copy()
            if 'language-option' in attrs.get('class', '').split():
                self.switches.append(attrs['href'])
                if attrs.get('aria-current') == 'page':
                    self.active_languages.append(attrs.get('data-locale'))

    def handle_endtag(self, tag):
        if tag == 'ul' and self.in_local_nav:
            self.list_ids.pop()
        if tag == 'nav':
            self.in_local_nav = False
        if tag == 'script':
            self.in_map = False

    def handle_data(self, data):
        if self.in_map:
            self.map_json += data


translated_slugs = {'teaching': 'ensino', 'research': 'pesquisa', 'extension': 'extensao',
                    'about': 'sobre', 'publications': 'publicacoes', 'cv': 'curriculo'}


def localized_slug(slug, locale):
    return translated_slugs.get(slug.rstrip('/'), slug.rstrip('/')) + '/' if locale == 'pt' and slug.endswith('/') else slug


pages = {p.relative_to(site).as_posix(): Page(p) for p in site.rglob('*.html')}
for locale, lang, other in [('pt', 'pt-BR', 'en'), ('en', 'en-US', 'pt')]:
    for slug in ['', 'teaching/', 'research/', 'extension/', 'about/', 'publications/', '404.html']:
        path = ('en/' if locale == 'en' else '') + localized_slug(slug, locale)
        key = path if path.endswith('.html') else path + 'index.html'
        page = pages[key]
        assert page.lang == lang, (key, page.lang)
        assert page.switches == [baseurl + ('/en/' if code == 'en' else '/') + localized_slug(slug, code) + ('?lang=pt' if code == 'pt' and slug == '' else '') for code in ['pt', 'en']], (key, page.switches)
        assert page.active_languages == [locale], (key, page.active_languages)
        for href in page.links:
            url = urlsplit(href)
            if url.scheme or url.netloc:
                continue
            if url.path:
                assert url.path.startswith(baseurl + '/'), (key, href, baseurl)
                target = unquote(url.path[len(baseurl):]).lstrip('/')
            else:
                target = key
            if not target or target.endswith('/'):
                target += 'index.html'
            assert (site / target).exists(), (key, href)
            if url.fragment and target in pages:
                assert unquote(url.fragment) in pages[target].ids, (key, href)
    cv = (site / ('en' if locale == 'en' else '') / localized_slug('cv/', locale) / 'index.html').read_text()
    assert f'url={baseurl}/' + ('en/' if locale == 'en' else '') in cv, locale

for old, target in [('teaching/', 'teaching/'), ('research/', 'research/'),
                    ('extension/', 'extension/'), ('cv/', '')]:
    html = (site / old / 'index.html').read_text()
    assert f'url={baseurl}/en/{target}' in html, old
    pt_target = localized_slug(target, 'pt')
    if not pt_target:
        pt_target = '?lang=pt'
    assert f'data-pt-url="{baseurl}/{pt_target}"' in html, old
for old, new in translated_slugs.items():
    for previous in [old, new]:
        html = (site / 'pt' / previous / 'index.html').read_text()
        assert f'url={baseurl}/{new}/' in html, previous
assert f'url={baseurl}/' in (site / 'pt/index.html').read_text()
assert f'url={baseurl}/404.html' in (site / 'pt/404.html').read_text()
assert 'data-error-page="true"' in (site / '404.html').read_text()

for key, page in pages.items():
    assert all(count == 1 for count in page.id_counts.values()), (key, page.id_counts)
    for asset in page.assets:
        url = urlsplit(asset)
        if not url.scheme and not url.netloc:
            if url.path.startswith(baseurl + '/pagefind/') and not (site / 'pagefind').exists():
                continue  # Pagefind runs after the Jekyll build.
            assert url.path.startswith(baseurl + '/'), (key, asset)
            assert (site / unquote(url.path[len(baseurl):]).lstrip('/')).is_file(), (key, asset)
for portuguese, english, alias in [('index.html', 'en/index.html', 'index.html'),
        ('ensino/index.html', 'en/teaching/index.html', 'teaching/index.html'),
        ('pesquisa/index.html', 'en/research/index.html', 'research/index.html'),
        ('extensao/index.html', 'en/extension/index.html', 'extension/index.html')]:
    for en_id, pt_id in json.loads(pages[alias].map_json).items():
        assert en_id in pages[english].ids and pt_id in pages[portuguese].ids, (alias, en_id, pt_id)
for key, heading, course in [('ensino/index.html', 'disciplinas-atuais-titulo', 'introducao-a-linguagem-de-programacao-cpp'),
                             ('en/teaching/index.html', 'current-courses-title', 'introduction-to-cpp')]:
    assert '#' + heading in pages[key].section_links, key
    assert 'local-subnav-20261' in pages[key].section_links['#' + course], key
for key, heading in [('extensao/index.html', 'outras-atividades'),
                     ('en/extension/index.html', 'other-activities')]:
    assert '#' + heading in pages[key].section_links, (key, 'Sidebar must use the heading ID, not an inline legacy ID')
sitemap = (site / 'sitemap.xml').read_text()
for route in ['sobre/', 'publicacoes/', 'en/about/', 'en/publications/']:
    assert baseurl + '/' + route + '</loc>' not in sitemap, route
    assert 'data-pagefind-body' not in (site / route / 'index.html').read_text(), route
for route in ['index.html', 'en/index.html']:
    assert baseurl + '/assets/images/profile.webp' in pages[route].assets, route
print('Verified bilingual routes, anchors, nested navigation, local assets, redirect maps, placeholder exclusions, and root 404.')
