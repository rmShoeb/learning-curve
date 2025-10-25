<?php

$x = 0;
$y = 5;

function test(){
    // the $GLOBALS[] array contains the global variables
    $GLOBALS['x'] = $GLOBALS['x']+$GLOBALS['y'];
    // after a function call is completed, all local info are deleted
    // if we want to retain the local variables, we should use static
    static $x = 0;
    $x += $GLOBALS['x'];
    print($x . "<br>");
}

test();
print($x . "<br>");
test();
echo "this ", "string ", "is made", "with ", "multiple parameters <br>";
echo "Display variables with echo " . $x . "<br>";
print("Display variables with print " . $x . "<br>");

/* variable types
* int
* float
* string
* bool (true, false)
* array, e.g. $cars = array('volvo', 'bmw', 'toyota')
* object
* NULL, e.g. $x = null
        * when a variable is created without value, it contains null
        * variables can be emptied using null
* Resource, e.g. reference to function or database call
*/


?>