# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import sys

def mst_edges(n, edges):
    parent = list(range(n))
    size = [1] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    chosen = []
    for weight, u, v in sorted(edges):
        a, b = find(u), find(v)
        if a == b:
            continue
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]
        chosen.append((u, v, weight))
    return chosen


def main():
    data = iter(map(int, sys.stdin.buffer.read().split()))
    out = []
    while True:
        try:
            n, e = next(data), next(data)
        except StopIteration:
            break
        edges = [(next(data), next(data), next(data)) for _ in range(e)]
        # A entrada fornece u, v e peso; a ordenação exige peso primeiro.
        edges = [(w, u, v) for u, v, w in edges]
        out.extend(f"{u} {v} {w}" for u, v, w in mst_edges(n, edges))
    sys.stdout.write("\n".join(out) + ("\n" if out else ""))


if __name__ == "__main__":
    main()
