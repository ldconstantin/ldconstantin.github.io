# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import heapq
import sys


def prim_cost(adj):
    if not adj:
        return 0
    visited = [False] * len(adj)
    heap = [(0, 0)]
    total = 0
    while heap:
        weight, u = heapq.heappop(heap)
        if visited[u]:
            continue
        visited[u] = True
        total += weight
        for v, cost in adj[u]:
            if not visited[v]:
                heapq.heappush(heap, (cost, v))
    # Mesma convenção do exemplo: componente alcançável a partir do vértice 0.
    return total


def main():
    values = iter(map(int, sys.stdin.buffer.read().split()))
    answers = []
    while True:
        try:
            n, e = next(values), next(values)
        except StopIteration:
            break
        adj = [[] for _ in range(n)]
        for _ in range(e):
            u, v, w = next(values), next(values), next(values)
            adj[u].append((v, w))
            adj[v].append((u, w))
        answers.append(str(prim_cost(adj)))
    print("\n".join(answers), end="\n" if answers else "")


if __name__ == "__main__":
    main()
