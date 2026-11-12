# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import sys

INF = 0x3F3F3F3F


def minimum_blocks(coins, target):
    dp = [INF] * (target + 1)
    dp[0] = 0
    for x in range(1, target + 1):
        for coin in coins:
            if 0 < coin <= x:
                dp[x] = min(dp[x], dp[x - coin] + 1)
    return dp[target]


def main():
    values = iter(map(int, sys.stdin.buffer.read().split()))
    try:
        cases = next(values)
    except StopIteration:
        return
    out = []
    for _ in range(cases):
        n, target = next(values), next(values)
        coins = [next(values) for _ in range(n)]
        out.append(str(minimum_blocks(coins, target)))
    print("\n".join(out), end="\n" if out else "")


if __name__ == "__main__":
    main()
