// Revised educational C++ implementation (2026, AI-assisted).
// Simulate top-down memoization with an explicit call stack.
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
constexpr int INF = 0x3f3f3f3f;
struct Frame { int length, next_coin; };
int solve(const vector<int>& coins, int target) {
    vector<int> memo(target + 1, -1);
    memo[0] = 0;
    vector<Frame> stack{{target, 0}};
    while (!stack.empty()) {
        Frame& frame = stack.back();
        int x = frame.length;
        if (memo[x] != -1) { stack.pop_back(); continue; }
        if (frame.next_coin < (int)coins.size()) {
            int coin = coins[frame.next_coin++];
            if (coin > 0 && coin <= x && memo[x - coin] == -1)
                stack.push_back({x - coin, 0});
        } else {
            int answer = INF;
            for (int coin : coins)
                if (coin > 0 && coin <= x)
                    answer = min(answer, memo[x - coin] + 1);
            memo[x] = answer;
            stack.pop_back();
        }
    }
    return memo[target];
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin >> t;
    while (t--) {
        int n, m; cin >> n >> m;
        vector<int> coins(n);
        for (auto& x : coins) cin >> x;
        cout << solve(coins, m) << '\n';
    }
}
