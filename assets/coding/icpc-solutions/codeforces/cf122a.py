# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import sys


def is_almost_lucky(n):
    values = [4, 7]
    i = 0
    while i < len(values):
        lucky = values[i]
        i += 1
        if lucky > n:
            continue
        if n % lucky == 0:
            return True
        values.extend((10 * lucky + 4, 10 * lucky + 7))
    return False


def main():
    answers = ("YES" if is_almost_lucky(int(token)) else "NO"
               for token in sys.stdin.buffer.read().split())
    print("\n".join(answers))


if __name__ == "__main__":
    main()
