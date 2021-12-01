#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<vector>
#include<iterator>
#include<algorithm>
using namespace std;

int main(void)
{
    vector<int>data;
    vector<int>::iterator iter;
    int temp;

    ///use of push_back()
    for(int i=0;i<10;i++)
    {
        cin>>temp;
        data.push_back(temp);
    }
    for(iter=data.begin(); iter!=data.end(); iter++)
        cout << *iter << "\t";
    cout<<endl;

    ///use of sort() for ascending order
    sort(data.begin(), data.end());
    for(iter=data.begin(); iter!=data.end(); iter++)
        cout << *iter << "\t";
    cout<<endl;

    ///use of sort() for descending order
    sort(data.begin(), data.end(), greater<int>());
    for(iter=data.begin(); iter!=data.end(); iter++)
        cout << *iter << "\t";
    cout<<endl;

    ///use of pop_back()
    data.pop_back();
    for(iter=data.begin(); iter!=data.end(); iter++)
        cout << *iter << "\t";
    cout<<endl;

    ///use of insert()
    data.insert(data.begin(),4);
    for(iter=data.begin(); iter!=data.end(); iter++)
        cout << *iter << "\t";
    cout<<endl;

    ///use of find()
    cout<<"Enter the data you want to find: ";
    cin>>temp;
    iter=find(data.begin(), data.end(), temp);
    if(iter!=data.end())
        cout<<"FOUND"<<endl;
    else
        cout<<"NOT FOUND"<<endl;

    ///use of erase()
    cout<<"Enter the data you want to delete: ";
    cin>>temp;
    for(iter=data.begin(); iter!=data.end(); iter++)
    {
        if(*iter==temp)
            break;
    }
    if(iter==data.end())
        cout<<"NOT FOUND"<<endl;
    else
        data.erase(iter);
    for(iter=data.begin(); iter!=data.end(); iter++)
        cout << *iter << "\t";
    cout<<endl;

    data.clear();
    cout<<data.size();
}
