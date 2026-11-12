// Revised educational C++ example (2026, AI-assisted).
// Historical C++ source remains available and is NOT rewritten.
// Identify undirected edges by ID to handle parallel edges and self-loops.
#include <iostream>
#include <vector>
#include <utility>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m) {
        vector<vector<pair<int,int>>> adj(n);
        for (int i = 0; i < m; ++i) {
            int u, v; cin >> u >> v; --u; --v;
            adj[u].push_back({v, i});
            adj[v].push_back({u, i});
        }
        vector<char> visited(n, 0);
        int components = 0;
        bool cyclic = false;
        for (int start = 0; start < n; ++start) {
            if (visited[start]) continue;
            ++components;
            visited[start] = 1;
            vector<pair<int,int>> stack{{start, -1}};
            while (!stack.empty()) {
                auto [u, parent_edge] = stack.back();
                stack.pop_back();
                for (auto [v, eid] : adj[u]) {
                    if (eid == parent_edge) continue;
                    if (visited[v]) cyclic = true;
                    else {
                        visited[v] = 1;
                        stack.push_back({v, eid});
                    }
                }
            }
        }
        cout << "Ciclico: " << (cyclic ? "Sim" : "Nao") << '\n';
        cout << "Componentes conexas: " << components << '\n';
    }
}
