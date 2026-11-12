"""Validate bilingual plain-language alternatives for the main website sections.

They are shorter complementary summaries, not a claim of certified Easy Read compliance.
The complete pages and code must remain accessible.
"""
import json
import sys
from pathlib import Path
from html import unescape

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / "_data/easy_read.json").read_text(encoding="utf-8"))
entries = json.loads((ROOT / "_data/icpc_solutions.json").read_text(encoding="utf-8"))
routes = {
    "pt": {"home": "index.html", "teaching": "ensino/index.html",
           "research": "pesquisa/index.html", "extension": "extensao/index.html",
           "solutions": "codigos/index.html"},
    "en": {"home": "en/index.html", "teaching": "en/teaching/index.html",
           "research": "en/research/index.html", "extension": "en/extension/index.html",
           "solutions": "en/solutions/index.html"}
}
for locale, pages in routes.items():
    assert set(data[locale]) == set(pages)
    for key, item in data[locale].items():
        assert item["title"] and item["intro"]
        assert 3 <= len(item["points"]) <= 9, (locale, key)
        assert len(item["links"]) >= 2
        assert all(p.strip() and len(p.split()) <= 42 for p in item["points"])
        assert all(link["url"].startswith("/") and link["label"] for link in item["links"])
        if locale == "pt" and key == "home":
            assert "Metodologias Ativas para Desenvolvimento no Ensino Superior" in " ".join(item["points"])
        if locale == "en" and key == "home":
            assert "Metodologias Ativas para Desenvolvimento no Ensino Superior" in " ".join(item["points"])
for item in entries:
    assert item["summary_pt"] and item["summary_en"]
    assert item["method_pt"] and item["method_en"]
    assert item["limits_pt"] and item["limits_en"]

if len(sys.argv) > 1:
    site = Path(sys.argv[1])
    for locale, pages in routes.items():
        for key, relative in pages.items():
            rendered = (site / relative).read_text(encoding="utf-8")
            assert 'id="easy-reading-toggle"' in rendered, relative
            assert 'id="easy-reading-panel"' in rendered, relative
            assert 'id="full-reading-content"' in rendered, relative
            assert 'data-easy-reading-controls' in rendered, relative
            assert 'data-pagefind-ignore' in rendered
            assert unescape(data[locale][key]["intro"]) in unescape(rendered), relative
    for solution in entries:
        for locale, route in [("pt", solution["detail_pt"]), ("en", solution["detail_en"])]:
            rendered = (site / route.lstrip("/") / "index.html").read_text(encoding="utf-8")
            assert 'id="easy-reading-toggle"' in rendered, route
            assert 'id="easy-reading-panel"' in rendered, route
            assert 'id="full-reading-content"' in rendered, route
            assert solution["source_cpp"] in rendered and solution["source_python"] in rendered
            assert unescape(solution[f"summary_{locale}"]) in unescape(rendered), route
            assert unescape(solution[f"method_{locale}"]) in unescape(rendered), route
    print("Easy-reading rendered pages checked: 10 sections + 36 algorithm guides.")
print("Easy-reading content is consistent in PT and EN.")
