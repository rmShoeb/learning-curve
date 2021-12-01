#include<iostream>
#include<utility>
#include<vector>
#include<iterator>
#include<cstring>
using namespace std;

int main(void)
{
    vector<pair<string,int>>v;
    vector<pair<string,int>>::iterator it;
    int i, temp_int;
    string temp_string;

    for(i=0;i<10;i++)
    {
        cout<<"Enter name: ";
        cin>>temp_string;
        cout<<"Enter roll: ";
        cin>>temp_int;
        v.push_back(make_pair(temp_string, temp_int));
    }

    for(it=v.begin(); it!=v.end(); it++)
    {
        cout<<"Name: "<< it->first <<" Roll: "<< it->second <<endl;
    }
}
