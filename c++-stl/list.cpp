#include<iostream>
#include<cstdio>
#include<list>
#include<iterator>
#include<algorithm>
using namespace std;

int main(void)
{
    list<int>data;
    list<int>::iterator iter;
    int temp,i;
    for(i=0;i<10;i++)
    {
        cin>>temp;
        data.push_back(temp);
    }
    /*for(i=0;i<10;i++)
        cout<<data[i]<<endl;*/        ///it does not work for list.....donno why!

    for(iter=data.begin(); iter!=data.end(); iter++)
        cout << *iter << "\t";
    cout<<endl;

    data.push_front(100);
    for(iter=data.begin(); iter!=data.end(); iter++)
        cout << *iter << "\t";
    cout<<endl;

    data.reverse();
    for(iter=data.begin(); iter!=data.end(); iter++)
        cout << *iter << "\t";
    cout<<endl;

    /*sort(data.begin(), data.end());
    for(iter=data.begin(); iter!=data.end(); iter++)
        cout << *iter << "\t";
    cout<<endl;

    sort(data.begin(), data.end(), greater<int>());
    for(iter=data.begin(); iter!=data.end(); iter++)
        cout << *iter << "\t";
    cout<<endl;*/
}
