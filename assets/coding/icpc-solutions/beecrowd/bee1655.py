# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import sys


def max_probability(n, edges):
    prob = [[0.0] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        prob[i][i] = 1.0
    for u, v, percent in edges:
        p = percent / 100.0
        prob[u][v] = max(prob[u][v], p)
        prob[v][u] = max(prob[v][u], p)
    for k in range(1, n + 1):
        for i in range(1, n + 1):
            if prob[i][k] == 0:
                continue
            for j in range(1, n + 1):
                candidate = prob[i][k] * prob[k][j]
                if candidate > prob[i][j]:
                    prob[i][j] = candidate
    return prob[1][n] * 100


def main():
    values = iter(map(int, sys.stdin.buffer.read().split()))
    out = []
    for n in values:
        if n == 0:
            break
        m = next(values)
        edges = [(next(values), next(values), next(values)) for _ in range(m)]
        out.append(f"{max_probability(n, edges):.6f} percent")
    print("\n".join(out), end="\n" if out else "")


if __name__ == "__main__":
    main()
