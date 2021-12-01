#include<iostream>
#include<cstdlib>
#include<cstdio>
#include<cmath>
#include<complex>
#include<algorithm>
using namespace std;

int main(void)
{
    double a,b,c;
    double result;

    cin>>a>>b>>c;
    result=(-b+sqrt(b*b-4*a*c))/(2*a);
    cout<<result<<endl;
    result=(-b-sqrt(b*b-4*a*c))/(2*a);
    cout<<result;
}
