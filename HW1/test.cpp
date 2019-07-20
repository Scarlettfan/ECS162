#include<iostream>
#include<vector>

using namespace std;

vector<string> Split(const string& str, const string& split = " ")
{
    vector<string>vec_str;
    string tmp, str1 = str;
    size_t found = str1.find(split);
    
    if(split != " "){
    while(found != string::npos)
    {
        vec_str.push_back(str1.substr(0,found));
        str1 = str1.substr(found+1);
        found = str1.find(split);
    }
    vec_str.push_back(str1);
    }
    else{
    for(int i = 0; i < str.size();i++)
    {
        if(isalpha(str[i]))
            tmp += str[i];
        else
        {
            if(!tmp.empty())
                vec_str.push_back(tmp);
            tmp = "";
        }
        
    }
    }
    for(int i = 0; i < vec_str.size();i++)
    {
        cout << vec_str[i] << endl;
    }
    return vec_str;
}

int add(int a=2, int b)
{
    return a+b;
}

int main(void)
{   
    /*string a =  "A\t tougher\t test to\t pass!";
    string b = "A\\B\\C\\D\\E";
    Split(b,"\\");
    Split(a);*/

    cout << add(2) << endl;
    return 0;
}