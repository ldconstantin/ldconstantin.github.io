# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import sys


def main():
    out = []
    for token in sys.stdin.buffer.read().split():
        parts = sorted(token.decode().split("+"), key=int)
        out.append("+".join(parts))
    print("\n".join(out), end="\n" if out else "")


if __name__ == "__main__":
    main()
