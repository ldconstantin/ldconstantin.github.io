# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
from math import comb
import sys


def regions(n):
    # 1 + C(n, 2) + C(n, 4): aritmética inteira, sem perda por arredondamento.
    return 1 + comb(n, 2) + (comb(n, 4) if n >= 4 else 0)


def main():
    values = map(int, sys.stdin.buffer.read().split())
    print("\n".join(str(regions(n)) for n in values))


if __name__ == "__main__":
    main()
