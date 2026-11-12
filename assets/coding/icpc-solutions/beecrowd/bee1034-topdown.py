# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import sys

INF = 0x3F3F3F3F


def minimum_blocks(coins, target):
    # Memoização de cima para baixo com pilha explícita:
    # evita limite de recursão do Python para alvos grandes.
    coins = sorted({c for c in coins if c > 0})
    memo = {0: 0}
    scheduled = {target}
    stack = [(target, False)]
    while stack:
        x, ready = stack.pop()
        if x in memo:
            continue
        if ready:
            memo[x] = min((memo[x - c] + 1 for c in coins if c <= x),
                          default=INF)
            scheduled.discard(x)
            continue
        stack.append((x, True))
        for c in coins:
            child = x - c
            if child < 0:
                break
            if child not in memo and child not in scheduled:
                scheduled.add(child)
                stack.append((child, False))
    return memo[target]


def main():
    values = iter(map(int, sys.stdin.buffer.read().split()))
    try:
        cases = next(values)
    except StopIteration:
        return
    out = []
    for _ in range(cases):
        n, target = next(values), next(values)
        out.append(str(minimum_blocks([next(values) for _ in range(n)], target)))
    print("\n".join(out), end="\n" if out else "")


if __name__ == "__main__":
    main()
