// Adaptação didática em C++ (2026), com auxílio de IA.
// Base histórica em Python: Leonardo Deliyannis Constantin, Clube de Programação UPF.
// Preserva o cálculo de minutos entre horários, inclusive virada da meia-noite.
#include <iostream>
using namespace std;

int main() {
    int h1, m1, h2, m2;
    while (cin >> h1 >> m1 >> h2 >> m2) {
        if (h1 == 0 && m1 == 0 && h2 == 0 && m2 == 0)
            break;
        int start = h1 * 60 + m1;
        int finish = h2 * 60 + m2;
        cout << (finish - start + 24 * 60) % (24 * 60) << '\n';
    }
}
