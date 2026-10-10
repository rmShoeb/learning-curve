<?php

// defining a class
class User{
    //  public, private, protected
    public $name;
    public $usename;
    public $follower_count;
}

// creating a new object
$rm = new User();

// accessring object elements/attributes
$rm->name = "Riyad Morshed Shoeb";
$rm->usename = "@rmShoeb";
$rm->follower_count = 3;

// raw print
print_r($rm);

?>