# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
from collections import deque
import sys

UNREACHABLE = 10**9


def distance(adj, source, target):
    dist = [-1] * len(adj)
    dist[source] = 0
    queue = deque([source])
    while queue:
        u = queue.popleft()
        if u == target:
            return dist[u]
        for v in adj[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                queue.append(v)
    return UNREACHABLE


def main():
    values = iter(sys.stdin.buffer.read().split())
    out = []
    while True:
        try:
            n, e = int(next(values)), int(next(values))
        except StopIteration:
            break
        adj = [[] for _ in range(n)]
        for _ in range(e):
            a, b = next(values), next(values)
            u, v = a[0] - 65, b[0] - 65
            adj[u].append(v)
            adj[v].append(u)
        q = int(next(values))
        for _ in range(q):
            a, b = next(values), next(values)
            out.append(str(distance(adj, a[0] - 65, b[0] - 65)))
    print("\n".join(out), end="\n" if out else "")


if __name__ == "__main__":
    main()
