// Revised educational C++ implementation (2026, AI-assisted).
// Historical C++ source remains available and is NOT rewritten.
// Integer combinatorics avoids floating-point rounding.
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
using i128 = __int128_t;
string to_decimal(i128 n) {
    if (n == 0) return "0";
    string out;
    while (n) {
        out += char('0' + n % 10);
        n /= 10;
    }
    reverse(out.begin(), out.end());
    return out;
}
int main() {
    int n;
    while (cin >> n) {
        i128 x = n;
        i128 c2 = x * (x - 1) / 2;
        i128 c4 = n >= 4 ? x * (x - 1) * (x - 2) * (x - 3) / 24 : 0;
        cout << to_decimal(1 + c2 + c4) << '\n';
    }
}
