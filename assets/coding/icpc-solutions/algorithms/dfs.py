# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import sys


def components_and_cycles(adj):
    n = len(adj)
    visited = [False] * n
    components = 0
    cyclic = False
    for start in range(n):
        if visited[start]:
            continue
        components += 1
        visited[start] = True
        stack = [(start, -1)]
        while stack:
            u, parent = stack.pop()
            for v in adj[u]:
                if not visited[v]:
                    visited[v] = True
                    stack.append((v, u))
                elif v != parent:
                    cyclic = True
    return components, cyclic


def main():
    values = iter(map(int, sys.stdin.buffer.read().split()))
    out = []
    while True:
        try:
            n, e = next(values), next(values)
        except StopIteration:
            break
        adj = [[] for _ in range(n)]
        for _ in range(e):
            u, v = next(values) - 1, next(values) - 1
            adj[u].append(v)
            adj[v].append(u)
        components, cyclic = components_and_cycles(adj)
        out.extend([f"Ciclico: {'Sim' if cyclic else 'Nao'}", f"Componentes conexas: {components}"])
    print("\n".join(out), end="\n" if out else "")


if __name__ == "__main__":
    main()
