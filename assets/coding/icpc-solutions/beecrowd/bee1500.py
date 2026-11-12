# Adaptação didática em Python (2026), com auxílio de IA.
# Base histórica: código atribuído a Leonardo Deliyannis Constantin no Clube de Programação UPF.
# Consulte a página do site para procedência, testes e diferenças de comportamento.
import sys


class SegmentTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (4 * n)
        self.lazy = [0] * (4 * n)

    def push(self, p, left, right):
        pending = self.lazy[p]
        if pending == 0:
            return
        self.tree[p] += (right - left + 1) * pending
        if left != right:
            self.lazy[2 * p] += pending
            self.lazy[2 * p + 1] += pending
        self.lazy[p] = 0

    def update(self, p, left, right, ql, qr, value):
        self.push(p, left, right)
        if qr < left or ql > right:
            return
        if ql <= left and right <= qr:
            self.lazy[p] += value
            self.push(p, left, right)
            return
        mid = (left + right) // 2
        self.update(2 * p, left, mid, ql, qr, value)
        self.update(2 * p + 1, mid + 1, right, ql, qr, value)
        self.tree[p] = self.tree[2 * p] + self.tree[2 * p + 1]

    def query(self, p, left, right, ql, qr):
        self.push(p, left, right)
        if qr < left or ql > right:
            return 0
        if ql <= left and right <= qr:
            return self.tree[p]
        mid = (left + right) // 2
        return (self.query(2 * p, left, mid, ql, qr) +
                self.query(2 * p + 1, mid + 1, right, ql, qr))

    def add(self, left, right, value):
        self.update(1, 0, self.n - 1, left, right, value)

    def sum(self, left, right):
        return self.query(1, 0, self.n - 1, left, right)


def main():
    values = iter(map(int, sys.stdin.buffer.read().split()))
    try:
        cases = next(values)
    except StopIteration:
        return
    out = []
    for _ in range(cases):
        n, operations = next(values), next(values)
        tree = SegmentTree(n)
        for _ in range(operations):
            command, left, right = next(values), next(values), next(values)
            left, right = sorted((left - 1, right - 1))
            if command == 0:
                tree.add(left, right, next(values))
            else:
                out.append(str(tree.sum(left, right)))
    print("\n".join(out), end="\n" if out else "")


if __name__ == "__main__":
    main()
