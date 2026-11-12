# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import sys


def sign(value):
    return (value > 0) - (value < 0)


class SegmentTree:
    def __init__(self, values):
        self.n = len(values)
        self.size = 1
        while self.size < self.n:
            self.size *= 2
        self.tree = [1] * (2 * self.size)
        for i, value in enumerate(values):
            self.tree[self.size + i] = sign(value)
        for p in range(self.size - 1, 0, -1):
            self.tree[p] = self.tree[2 * p] * self.tree[2 * p + 1]

    def update(self, index, value):
        p = self.size + index
        self.tree[p] = sign(value)
        while p > 1:
            p //= 2
            self.tree[p] = self.tree[2 * p] * self.tree[2 * p + 1]

    def query(self, left, right):
        left += self.size
        right += self.size
        result = 1
        while left <= right:
            if left & 1:
                result *= self.tree[left]
                left += 1
            if not right & 1:
                result *= self.tree[right]
                right -= 1
            left //= 2
            right //= 2
        return result


def main():
    tokens = iter(sys.stdin.buffer.read().split())
    out = []
    while True:
        try:
            n, k = int(next(tokens)), int(next(tokens))
        except StopIteration:
            break
        tree = SegmentTree([int(next(tokens)) for _ in range(n)])
        line = []
        for _ in range(k):
            op = next(tokens)
            a, b = int(next(tokens)), int(next(tokens))
            if op == b"C":
                tree.update(a - 1, b)
            else:
                result = tree.query(a - 1, b - 1)
                line.append("0" if result == 0 else "+" if result > 0 else "-")
        out.append("".join(line))
    print("\n".join(out), end="\n" if out else "")


if __name__ == "__main__":
    main()
