#include<iostream>
#include<set>
#include<iterator>
#include<iterator>
using namespace std;

int main(void)
{
    set<int>s;
    set<int>::iterator it;
    int i,temp;
    for(i=0;i<10;i++)
    {
        cin>>temp;
        s.insert(temp);
    }
    for(it=s.begin(); it!=s.end(); it++)
        cout<<*it<<endl;
    cout<<"Enter the value you want to find: ";
    cin>>temp;
    it=s.find(temp);
    if(it!=s.end())
        cout<<"FOUND"<<endl;
    else
        cout<<"NOT FOUND"<<endl;
    cout<<"Enter the data you want to delete: ";
    cin>>temp;
    it=s.find(temp);
    s.erase(it);
    for(it=s.begin(); it!=s.end(); it++)
        cout<<*it<<endl;
}
