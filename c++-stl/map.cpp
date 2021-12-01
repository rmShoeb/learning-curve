#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<map>
#include<iterator>
#include<algorithm>
using namespace std;

int main(void)
{
    map<string, int>m;
    map<string, int>::iterator it;
    string temp_string;
    int temp_int;

    //m["rmShoeb"]=13;

    for(int i=0;i<10;i++)
    {
        cout<<"Enter name: ";
        cin>>temp_string;
        cout<<"Enter roll: ";
        cin>>temp_int;
        m.insert(make_pair(temp_string,temp_int));
    }
    for(it=m.begin();it!=m.end();it++)
        cout<<"Name: "<<it->first<<" Roll: "<<it->second<<endl;
}
