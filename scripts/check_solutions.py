"""Validate curated source provenance, compilation and selected local smoke tests.

Compilation verifies syntax, not acceptance by an online judge.
No third-party packages or network access are required.
"""
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
entries = json.loads((ROOT / "_data/icpc_solutions.json").read_text(encoding="utf-8"))
categories = json.loads((ROOT / "_data/icpc_categories.json").read_text(encoding="utf-8"))
ids = {item["id"] for item in categories}
assert len(ids) == len(categories) and len(ids) == 9
assert len(entries) == 18, "The initial catalogue is deliberately curated and fixed at 18 entries"
assert len({item["source"] for item in entries}) == len(entries)
assert {item["judge"] for item in entries} == {"examples", "beecrowd", "codeforces"}

for item in entries:
    name = item["filename"]
    source = item["source"]
    path = ROOT / source.lstrip("/")
    assert source.startswith("/assets/coding/icpc-solutions/"), source
    assert path.is_file(), path
    assert name == path.name and path.suffix in {".cpp", ".py"}
    assert item["author"] == "Leonardo Deliyannis Constantin"
    assert item["original_url"].startswith("https://github.com/maratonaupf/codigos/blob/")
    assert re.fullmatch(r"[a-f0-9]{40}", item["original_commit"])
    assert item["original_commit"] in item["original_url"]
    assert item["topics"] and set(item["topics"]) <= ids
    assert item["validation"] == "compile-only"
    for field in ["summary_pt", "summary_en", "method_pt", "method_en", "limits_pt", "limits_en", "detail_pt", "detail_en"]:
        assert isinstance(item[field], str) and len(item[field]) >= 12, (item["id"], field)
    assert "Leonardo Deliyannis Constantin" in path.read_text(encoding="utf-8")
    if item["judge"] == "beecrowd":
        assert re.fullmatch(r"bee[0-9]+(?:-[a-z]+)?\.(?:cpp|py)", name), name
    if path.suffix == ".cpp":
        compile_result = subprocess.run(
            ["g++", "-std=c++17", "-fsyntax-only", str(path)],
            capture_output=True, text=True, timeout=30, check=False
        )
        assert compile_result.returncode == 0, f"{name}:\n{compile_result.stderr[:2500]}"
    else:
        compile(path.read_text(encoding="utf-8"), str(path), "exec")
    print("Syntax OK:", source)

# Small behavior checks only for examples with known, locally reproducible outcomes.
cases = [
    ("algorithms/kruskal.cpp", "3 3\n0 1 2\n1 2 3\n0 2 9\n", "0 1 2\n1 2 3\n"),
    ("beecrowd/bee1034-bottomup.cpp", "2\n2 6\n1 3\n3 8\n1 3 4\n", "2\n2\n"),
    ("beecrowd/bee1500.cpp", "1\n5 5\n0 1 3 2\n1 1 5\n0 2 5 1\n1 1 5\n1 3 3\n", "6\n10\n3\n"),
    ("codeforces/cf122a.cpp", "47\n", "YES\n"),
    ("codeforces/cf266a.cpp", "3\nRRG\n", "1\n"),
    ("codeforces/cf339a.cpp", "3+2+1\n", "1+2+3\n"),
]
with tempfile.TemporaryDirectory(prefix="icpc-check-") as temp:
    for index, (relative, stdin, expected) in enumerate(cases):
        source = ROOT / "assets/coding/icpc-solutions" / relative
        binary = Path(temp) / f"solution-{index}"
        subprocess.run(["g++", "-std=c++17", "-O0", str(source), "-o", str(binary)],
                       check=True, capture_output=True, text=True, timeout=30)
        got = subprocess.run([str(binary)], input=stdin, capture_output=True,
                             text=True, check=True, timeout=5).stdout
        assert got == expected, (relative, got, expected)
        print("Smoke OK:", relative)
    py = ROOT / "assets/coding/icpc-solutions/beecrowd/bee1103.py"
    got = subprocess.run([sys.executable, str(py)], input="1 2 3 4\n0 0 0 0\n",
                         capture_output=True, text=True, check=True, timeout=5).stdout
    assert got == "122\n", ("bee1103.py", got)
    print("Smoke OK: beecrowd/bee1103.py")

if len(sys.argv) == 3 and sys.argv[1] == "--site":
    site = Path(sys.argv[2])
    assert (site / "assets/favicon.svg").is_file()
    assert (site / "favicon.ico").is_file()
    from html.parser import HTMLParser
    from html import unescape
    class DetailLinks(HTMLParser):
        def __init__(self):
            super().__init__()
            self.anchors = []
        def handle_starttag(self, tag, attrs):
            if tag == "a":
                self.anchors.append(dict(attrs))
    for item in entries:
        for route_key, heading_key in [("detail_pt", "title_pt"), ("detail_en", "title_en")]:
            route = item[route_key].lstrip("/") + "index.html"
            detail = (site / route).read_text(encoding="utf-8")
            parsed = DetailLinks()
            parsed.feed(detail)
            assert unescape(item[heading_key]) in unescape(detail), route
            assert item["source"] in detail, (route, "missing source path")
            for language_path in ("source_cpp", "source_python"):
                assert item[language_path] in detail, (route, language_path)
            assert detail.count('role="tab"') == 2, (route, "tabs missing")
            assert detail.count('role="tabpanel"') == 2, (route, "panels missing")
            assert 'aria-selected="true"' in detail and 'aria-selected="false"' in detail
            assert 'AI' in detail or "IA" in detail or 'auxílio de IA' in detail, route
            assert item["original_url"] in detail, (route, "missing provenance")
            assert 'data-solution-source=' in detail, route
            assert 'solution-source.js' in detail, route
            assert 'prism-bundle.min.js' in detail, route
            assert 'language-cpp' in detail and 'language-python' in detail, route
            if item.get("cpp_revised"):
                assert "Historical C++ source" in detail or "C++ histórico original" in detail
                assert item["source"] in detail
            assert 'rel="alternate"' in detail, route
            if item["problem_url"]:
                external = [a for a in parsed.anchors if a.get("href") == item["problem_url"]]
                assert external and all(a.get("target") == "_blank" and
                    "noopener" in a.get("rel", "") and "noreferrer" in a.get("rel", "")
                    for a in external), (route, "problem links must open in a safe new tab")
            print("Dedicated page OK:", route)
    for url in ["codigos/index.html", "en/solutions/index.html"]:
        page = (site / url).read_text(encoding="utf-8")
        assert "Academic cap" not in page  # The favicon is external, not a decorative page image.
        assert 'rel="icon"' in page
        assert 'class="solution-topic-nav"' in page and 'href="#solutions-' in page, url
        assert "LinkedIn" in page or "solutions" in page.lower() or "codigos" in page.lower()
        for item in entries:
            assert item["source"] in page, (url, item["source"])
            assert item["original_commit"] in page, (url, item["original_commit"])
        print("Rendered catalogue OK:", url)
print("All curated source checks passed.")
