"""Check 18 dual-language solutions and selected behavioral equivalence.

New ports are educational, AI-assisted adaptations; original sources stay untouched.
Expected outputs are checked independently. Parity is checked on supported examples,
not claimed for all inputs or for historical bugs.
"""
import json
import math
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
entries = json.loads((ROOT / "_data/icpc_solutions.json").read_text(encoding="utf-8"))
assert len(entries) == 18

# (stdin, expected stdout); multiple cases where useful.
fixtures = {
    "kruskal": ("3 3\n0 1 2\n1 2 3\n0 2 9\n", "0 1 2\n1 2 3\n"),
    "prim": ("3 3\n0 1 2\n1 2 3\n0 2 9\n", "5\n"),
    "bfs": ("4 2\nA B\nB C\n3\nA C\nA D\nD D\n",
            "2\n1000000000\n0\n"),
    "dfs": ("4 2\n1 2\n3 4\n", "Ciclico: Nao\nComponentes conexas: 2\n"),
    "bee1655": ("3\n3\n1 2 50\n2 3 50\n1 3 10\n0\n",
                "25.000000 percent\n"),
    "bee1301": ("3 4\n-1 2 3\nP 1 3\nC 1 0\nP 1 3\nP 2 3\n", "-0+\n"),
    "bee1500": ("1\n5 5\n0 1 3 2\n1 1 5\n0 2 5 1\n1 1 5\n1 3 3\n",
                "6\n10\n3\n"),
    "bee2531": ("4\n1 5 3 8\n4\n2 1 4\n1 2 9\n2 2 4\n2 3 3\n",
                "7\n6\n0\n"),
    "bee1034-bottomup": ("2\n2 6\n1 3\n3 8\n1 3 4\n", "2\n2\n"),
    "bee1034-topdown": ("2\n2 6\n1 3\n3 8\n1 3 4\n", "2\n2\n"),
    "bee1127": ("3 2\nC D E\nD E\n3 2\nC D E\nC E\n0 0\n", "S\nN\n"),
    "bee1219": ("3 4 5\n", "13.6350 2.8584 3.1416\n"),
    "bee1103": ("1 2 3 4\n23 59 0 1\n0 0 0 0\n", "122\n2\n"),
    "bee2802": ("1\n2\n3\n4\n", "1\n2\n4\n8\n"),
    "cf122a": ("47\n16\n1\n", "YES\nYES\nNO\n"),
    "cf266a": ("3\nRRG\n", "1\n"),
    "cf339a": ("3+2+1\n", "1+2+3\n"),
    "cf1015b": ("4\nabcd\nbadc\n", "2\n1 3\n"),
}
assert set(fixtures) == {entry["id"] for entry in entries}

def run(command, input_data):
    result = subprocess.run(command, input=input_data, capture_output=True,
                            text=True, check=True, timeout=8)
    return result.stdout

with tempfile.TemporaryDirectory(prefix="solution-ports-") as directory:
    for entry in entries:
        source_cpp = ROOT / entry["source_cpp"].lstrip("/")
        source_py = ROOT / entry["source_python"].lstrip("/")
        original = ROOT / entry["source"].lstrip("/")
        assert source_cpp.is_file() and source_cpp.suffix == ".cpp"
        assert source_py.is_file() and source_py.suffix == ".py"
        assert original.is_file()
        if entry.get("cpp_revised"):
            assert entry["source_cpp"].startswith("/assets/coding/icpc-solutions/revised/")
            assert original.resolve() not in (source_cpp.resolve(), source_py.resolve())
            assert original.suffix == ".cpp"
        else:
            assert original.resolve() in (source_cpp.resolve(), source_py.resolve())
        assert entry["historical_language"] in ("cpp", "python")
        assert entry["adapted_language"] != entry["historical_language"]
        assert entry["adaptation_note_pt"] and entry["adaptation_note_en"]
        adaptation = source_py if entry["adapted_language"] == "python" else source_cpp
        assert "auxílio de IA" in adaptation.read_text(encoding="utf-8")
        compile(source_py.read_text(encoding="utf-8"), str(source_py), "exec")
        binary = Path(directory) / entry["id"]
        subprocess.run(["g++", "-std=c++17", "-O0", str(source_cpp), "-o", str(binary)],
                       check=True, capture_output=True, text=True, timeout=45)
        stdin, expected = fixtures[entry["id"]]
        python_output = run([sys.executable, "-B", str(source_py)], stdin)
        cpp_output = run([str(binary)], stdin)
        normalized = lambda output: output.split()
        assert normalized(python_output) == normalized(expected), (
            entry["id"], "Python", repr(python_output), repr(expected))
        assert normalized(cpp_output) == normalized(expected), (
            entry["id"], "C++", repr(cpp_output), repr(expected))
        print("Two-language fixture OK:", entry["id"])

    # Targeted regression: historical C++ used a modular product and can
    # lose the sign of a nonzero interval. The port deliberately corrects it.
    by_id = {entry["id"]: entry for entry in entries}
    case = "2 1\n1000000007 1\nP 1 2\n"
    for mode in ("source_cpp", "source_python"):
        path = ROOT / by_id["bee1301"][mode].lstrip("/")
        command = [str(Path(directory) / "bee1301")] if mode == "source_cpp" else [sys.executable, "-B", str(path)]
        corrected = run(command, case)
        assert corrected == "+\n", (mode, repr(corrected))

    # Python integer arithmetic avoids the floating-point formula of the
    # historical circle-regions implementation.
    n = 1000000
    expected = 1 + math.comb(n, 2) + math.comb(n, 4)
    actual = run([sys.executable, "-B",
                  str(ROOT / by_id["bee2802"]["source_python"].lstrip("/"))],
                 str(n) + "\n")
    assert actual.strip() == str(expected)

    # Top-down memoization must also work at depths exceeding Python's
    # default recursion limit.
    case = "1\n1 1500\n1\n"
    actual = run([sys.executable, "-B",
                  str(ROOT / by_id["bee1034-topdown"]["source_python"].lstrip("/"))], case)
    assert actual == "1500\n"


    # Independent oracles, deterministic fixtures. These are regression checks,
    # not claims of full proof or acceptance by an online judge.
    import random
    rng = random.Random(20261112)

    # 1. Range-product sign, including zeros, negative numbers and MOD multiples.
    for _ in range(60):
        n = rng.randint(1, 12)
        initial = [rng.choice([-1000000007, -12, -1, 0, 1, 9, 1000000007])
                   for _ in range(n)]
        current = initial.copy()
        ops, expected = [], []
        for _ in range(25):
            if rng.randrange(3) == 0:
                i = rng.randrange(n)
                v = rng.choice([-1000000007, -8, -1, 0, 1, 8, 1000000007])
                ops.append(f"C {i + 1} {v}")
                current[i] = v
            else:
                l, r = sorted(rng.sample(range(n), k=2)) if n > 1 else (0, 0)
                ops.append(f"P {l + 1} {r + 1}")
                values = current[l:r + 1]
                sign = 0 if any(v == 0 for v in values) else (-1 if sum(v < 0 for v in values) % 2 else 1)
                expected.append("0" if sign == 0 else "-" if sign < 0 else "+")
        case = f"{n} {len(ops)}\n" + " ".join(map(str, initial)) + "\n" + "\n".join(ops) + "\n"
        for mode in ("source_cpp", "source_python"):
            file = ROOT / by_id["bee1301"][mode].lstrip("/")
            cmd = [str(Path(directory) / "bee1301")] if mode == "source_cpp" else [sys.executable, "-B", str(file)]
            got = run(cmd, case).strip()
            assert got == "".join(expected), ("range sign", mode, case, got, expected)

    # 2. Exact circle counts, including a case beyond ordinary double precision.
    values = [0, 1, 2, 3, 4, 5, 9, 100, 1000000, 2147483647]
    expected = [1 + math.comb(n, 2) + (math.comb(n, 4) if n >= 4 else 0) for n in values]
    for mode in ("source_cpp", "source_python"):
        file = ROOT / by_id["bee2802"][mode].lstrip("/")
        cmd = [str(Path(directory) / "bee2802")] if mode == "source_cpp" else [sys.executable, "-B", str(file)]
        got = run(cmd, "\n".join(map(str, values)) + "\n").split()
        assert got == list(map(str, expected)), ("circle regions", mode, got)

    # 3. Independent undirected-multigraph cycle oracle using DSU.
    graph_input, graph_expected = [], []
    for _ in range(100):
        n = rng.randrange(1, 10)
        m = rng.randrange(0, 25)
        edges = [(rng.randrange(n), rng.randrange(n)) for _ in range(m)]
        parent = list(range(n))
        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x
        cyclic = False
        for u, v in edges:
            a, b = find(u), find(v)
            if a == b:
                cyclic = True
            else:
                parent[a] = b
        count = len({find(i) for i in range(n)})
        graph_input.append(f"{n} {m}\n" + "".join(f"{u+1} {v+1}\n" for u, v in edges))
        graph_expected.extend([f"Ciclico: {'Sim' if cyclic else 'Nao'}", f"Componentes conexas: {count}"])
    case = "".join(graph_input)
    expected_output = "\n".join(graph_expected) + "\n"
    for mode in ("source_cpp", "source_python"):
        file = ROOT / by_id["dfs"][mode].lstrip("/")
        cmd = [str(Path(directory) / "dfs")] if mode == "source_cpp" else [sys.executable, "-B", str(file)]
        assert run(cmd, case) == expected_output, ("multigraph DFS", mode)

    # 4. Duplicated roads must preserve the best probability.
    roads = "3\n4\n1 2 95\n1 2 10\n2 3 50\n1 3 40\n0\n"
    for mode in ("source_cpp", "source_python"):
        file = ROOT / by_id["bee1655"][mode].lstrip("/")
        cmd = [str(Path(directory) / "bee1655")] if mode == "source_cpp" else [sys.executable, "-B", str(file)]
        assert run(cmd, roads).strip() == "47.500000 percent", ("parallel probabilities", mode)

    # 5. The geometry version must survive large int-sided triangles.
    triangle = "30000 40000 50000\n"
    for mode in ("source_cpp", "source_python"):
        file = ROOT / by_id["bee1219"][mode].lstrip("/")
        cmd = [str(Path(directory) / "bee1219")] if mode == "source_cpp" else [sys.executable, "-B", str(file)]
        out = run(cmd, triangle).strip().split()
        assert len(out) == 3 and all(float(x) > 0 for x in out), ("triangle", mode, out)
        assert abs(float(out[2]) - math.pi * 10000**2) <= 0.1, ("incircle", mode, out)

    # 6. Deep DP should not rely on 100k levels of recursion.
    deep = "1\n1 100000\n1\n"
    for mode in ("source_cpp", "source_python"):
        file = ROOT / by_id["bee1034-topdown"][mode].lstrip("/")
        cmd = [str(Path(directory) / "bee1034-topdown")] if mode == "source_cpp" else [sys.executable, "-B", str(file)]
        assert run(cmd, deep).strip() == "100000", ("deep DP", mode)

    print("Independent property/regression checks passed (range signs, multigraphs, combinatorics, probability, geometry, deep DP).")

    print("Three targeted port regressions OK.")
print("18 dual-language implementations validated.")
