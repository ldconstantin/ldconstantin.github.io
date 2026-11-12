// Revised educational C++ implementation (2026, AI-assisted).
// Compute the side product in long double, not in 32-bit int.
#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;
int main() {
    long double a, b, c;
    const long double pi = acosl(-1.0L);
    while (cin >> a >> b >> c) {
        long double s = (a + b + c) / 2;
        long double area = sqrtl(s * (s - a) * (s - b) * (s - c));
        long double inradius = area / s;
        long double circumradius = (a * b * c) / (4 * area);
        long double inside = pi * inradius * inradius;
        long double outside = pi * circumradius * circumradius;
        cout << fixed << setprecision(4)
             << outside - area << " " << area - inside << " " << inside << '\n';
    }
}
