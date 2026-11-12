# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import sys


class SegmentTree:
    def __init__(self, values):
        self.n = len(values)
        self.size = 1
        while self.size < self.n:
            self.size *= 2
        self.low = [10**18] * (2 * self.size)
        self.high = [-10**18] * (2 * self.size)
        for i, value in enumerate(values):
            self.low[self.size + i] = self.high[self.size + i] = value
        for p in range(self.size - 1, 0, -1):
            self.low[p] = min(self.low[2 * p], self.low[2 * p + 1])
            self.high[p] = max(self.high[2 * p], self.high[2 * p + 1])

    def update(self, index, value):
        p = self.size + index
        self.low[p] = self.high[p] = value
        while p > 1:
            p //= 2
            self.low[p] = min(self.low[2 * p], self.low[2 * p + 1])
            self.high[p] = max(self.high[2 * p], self.high[2 * p + 1])

    def difference(self, left, right):
        left += self.size
        right += self.size
        lowest, highest = 10**18, -10**18
        while left <= right:
            if left & 1:
                lowest = min(lowest, self.low[left])
                highest = max(highest, self.high[left])
                left += 1
            if not right & 1:
                lowest = min(lowest, self.low[right])
                highest = max(highest, self.high[right])
                right -= 1
            left //= 2
            right //= 2
        return highest - lowest


def main():
    values = iter(map(int, sys.stdin.buffer.read().split()))
    out = []
    while True:
        try:
            n = next(values)
        except StopIteration:
            break
        tree = SegmentTree([next(values) for _ in range(n)])
        q = next(values)
        for _ in range(q):
            command, a, b = next(values), next(values), next(values)
            if command == 1:
                tree.update(a - 1, b)
            else:
                left, right = sorted((a - 1, b - 1))
                out.append(str(tree.difference(left, right)))
    print("\n".join(out), end="\n" if out else "")


if __name__ == "__main__":
    main()
