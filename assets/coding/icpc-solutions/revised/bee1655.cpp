// Revised educational C++ implementation (2026, AI-assisted).
// Keep the maximum among parallel edges and set diagonal probabilities to 1.
#include <iostream>
#include <iomanip>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n && n != 0) {
        int m; cin >> m;
        vector<vector<double>> prob(n + 1, vector<double>(n + 1));
        for (int i = 1; i <= n; ++i) prob[i][i] = 1.0;
        while (m--) {
            int u, v; double p;
            cin >> u >> v >> p; p /= 100.0;
            prob[u][v] = max(prob[u][v], p);
            prob[v][u] = max(prob[v][u], p);
        }
        for (int k = 1; k <= n; ++k)
            for (int i = 1; i <= n; ++i)
                for (int j = 1; j <= n; ++j)
                    prob[i][j] = max(prob[i][j], prob[i][k] * prob[k][j]);
        cout << fixed << setprecision(6) << prob[1][n] * 100.0 << " percent\n";
    }
}
