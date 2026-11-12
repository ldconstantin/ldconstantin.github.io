# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import sys

NOTES = {}
for name, pitch in zip("CDEFGAB", (0, 2, 4, 5, 7, 9, 11)):
    NOTES[name] = pitch
    NOTES[name + "#"] = (pitch + 1) % 12
    NOTES[name + "b"] = (pitch - 1) % 12


def contains(notes, pattern):
    if not pattern:
        return True
    # KMP funciona diretamente nas diferenças de semitons:
    # transpor todas as notas pela mesma quantidade não altera as diferenças.
    def differences(seq):
        return [(seq[i + 1] - seq[i]) % 12 for i in range(len(seq) - 1)]
    if len(pattern) == 1:
        return bool(notes)
    text = differences(notes)
    target = differences(pattern)
    failure = [0] * len(target)
    j = 0
    for i in range(1, len(target)):
        while j and target[i] != target[j]:
            j = failure[j - 1]
        if target[i] == target[j]:
            j += 1
        failure[i] = j
    j = 0
    for note in text:
        while j and note != target[j]:
            j = failure[j - 1]
        if note == target[j]:
            j += 1
        if j == len(target):
            return True
    return False


def main():
    tokens = iter(sys.stdin.buffer.read().decode().split())
    out = []
    while True:
        try:
            n, m = int(next(tokens)), int(next(tokens))
        except StopIteration:
            break
        if n == 0:
            break
        notes = [NOTES[next(tokens)] for _ in range(n)]
        pattern = [NOTES[next(tokens)] for _ in range(m)]
        out.append("S" if contains(notes, pattern) else "N")
    print("\n".join(out), end="\n" if out else "")


if __name__ == "__main__":
    main()
