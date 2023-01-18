<?php

// indexed arrays
// index starts from 0
$cars = array('volvo', 'toyota', 'mitshubishi');
print("$cars[0]<br>");
$cars[3] = 'tesla';
print_r($cars);
print("<br>");

// associative arrays
// python dict-like
$age = array('Riyad'=>24, 'Isty'=>23, 'Durlov'=>25);
print_r($age);
print("<br>");
print($age['Riyad']);
print("<br>");

// multi-dimensional arrays
$cars = array (
    array("Volvo",22,18),
    array("BMW",15,13),
    array("Saab",5,2),
    array("Land Rover",17,15)
);
foreach($cars as $car){
    print_r($car);
    print("<br>");
}

?>