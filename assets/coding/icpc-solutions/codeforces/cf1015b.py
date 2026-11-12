# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import sys


def transform(source, target):
    s = list(source)
    moves = []
    for i, expected in enumerate(target):
        if s[i] == expected:
            continue
        try:
            pos = s.index(expected, i + 1)
        except ValueError:
            return None
        while pos > i:
            s[pos - 1], s[pos] = s[pos], s[pos - 1]
            moves.append(pos)
            pos -= 1
    return moves if s == list(target) else None


def main():
    tokens = iter(sys.stdin.buffer.read().decode().split())
    out = []
    while True:
        try:
            n = int(next(tokens))
            s, t = next(tokens), next(tokens)
        except StopIteration:
            break
        moves = transform(s[:n], t[:n])
        if moves is None:
            out.append("-1")
        else:
            out.append(str(len(moves)))
            if moves:
                out.append(" ".join(map(str, moves)))
    print("\n".join(out), end="\n" if out else "")


if __name__ == "__main__":
    main()
