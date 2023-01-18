<?php //declare(strict_types=1); // strict requirement, to act as strongly-typed

function my_func(){
    echo("just a message!<br>");
}
function func_w_args($name){
    echo("hello $name!<br>");
}
function arg_w_type(int $number){
    echo("$number!<br>");
    var_dump($number);
}
function return_with_type(int $argument):int{
    return $argument;
}

my_func();
func_w_args("Riyad");
func_w_args(100); // will take any type as argument
// arg_w_type("Riyad"); // any type other than int as parameter will raise error
arg_w_type(100);

?>