// Revised educational C++ implementation (2026, AI-assisted).
// Historical C++ source remains available and is NOT rewritten.
// Track only signs: multiplying residues modulo 1e9+7 is incorrect here.
#include <iostream>
#include <vector>
using namespace std;
int sign(long long x) { return (x > 0) - (x < 0); }
class SegmentTree {
    int size = 1;
    vector<int> tree;
public:
    explicit SegmentTree(const vector<long long>& a) {
        while (size < (int)a.size()) size *= 2;
        tree.assign(size * 2, 1);
        for (int i = 0; i < (int)a.size(); ++i) tree[size + i] = sign(a[i]);
        for (int p = size - 1; p; --p) tree[p] = tree[p * 2] * tree[p * 2 + 1];
    }
    void update(int index, long long value) {
        int p = index + size;
        tree[p] = sign(value);
        for (p /= 2; p; p /= 2) tree[p] = tree[p * 2] * tree[p * 2 + 1];
    }
    int query(int left, int right) const {
        left += size; right += size;
        int result = 1;
        while (left <= right) {
            if (left & 1) result *= tree[left++];
            if (!(right & 1)) result *= tree[right--];
            left /= 2; right /= 2;
        }
        return result;
    }
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    while (cin >> n >> k) {
        vector<long long> a(n);
        for (auto &x : a) cin >> x;
        SegmentTree tree(a);
        string output;
        while (k--) {
            char op; int i; long long j;
            cin >> op >> i >> j;
            if (op == 'C') tree.update(i - 1, j);
            else {
                int s = tree.query(i - 1, (int)j - 1);
                output += s == 0 ? '0' : s > 0 ? '+' : '-';
            }
        }
        cout << output << '\n';
    }
}
