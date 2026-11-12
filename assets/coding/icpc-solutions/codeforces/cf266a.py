# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import sys


def main():
    tokens = iter(sys.stdin.buffer.read().split())
    out = []
    while True:
        try:
            n = int(next(tokens))
            colors = next(tokens).decode()
        except StopIteration:
            break
        out.append(str(sum(colors[i] == colors[i - 1]
                           for i in range(1, min(n, len(colors))))))
    print("\n".join(out), end="\n" if out else "")


if __name__ == "__main__":
    main()
