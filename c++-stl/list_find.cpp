#include<iostream>
#include<list>
#include<iterator>
#include<algorithm>
using namespace std;

int main(void)
{
    int temp,n,i;
    list<int>mylist;
    list<int>::iterator it;

    cout<<"Enter the length of your input:";
    cin>>n;
    for(i=0;i<n;i++)
    {
        cin>>temp;
        mylist.push_front(temp);
        mylist.push_back(temp);
    }
    for(it=mylist.begin();it!=mylist.end();it++)
        cout<<*it<<"\t";
    cout<<endl;
    cout<<"Enter the data you want to find:";
    cin>>temp;
    it=find(mylist.begin(),mylist.end(),temp);
    if(it==mylist.end())
        cout<<"NOT FOUND"<<endl;
    else
        cout<<"FOUND"<<endl;
}
