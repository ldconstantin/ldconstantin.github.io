# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import math
import sys


def areas(a, b, c):
    semi = (a + b + c) / 2
    area = math.sqrt(max(0.0, semi * (semi - a) * (semi - b) * (semi - c)))
    if area == 0:
        raise ValueError("Degenerate triangle: incircle and circumcircle are undefined")
    small = area / semi
    large = a * b * c / (4 * area)
    incircle = math.pi * small**2
    circumcircle = math.pi * large**2
    return circumcircle - area, area - incircle, incircle


def main():
    values = list(map(int, sys.stdin.buffer.read().split()))
    out = []
    for i in range(0, len(values), 3):
        outer, middle, inner = areas(*values[i:i + 3])
        out.append(f"{outer:.4f} {middle:.4f} {inner:.4f}")
    print("\n".join(out), end="\n" if out else "")


if __name__ == "__main__":
    main()
