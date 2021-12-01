#include<iostream>
#include<stack>
#include<iterator>
#include<cstring>
using namespace std;

int main(void)
{
    stack<string>s;
    string temp;

    s.push("riyad");
    s.push("morshed");
    s.push("Shoeb");

    while(!s.empty())
    {
        temp=s.top();
        cout<<temp<<endl;
        s.pop();
    }
}
