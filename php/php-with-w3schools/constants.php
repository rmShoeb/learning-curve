<?php

// constants are global accross entire script
// syntax
// define(name, value, case_sensitive=false)
define("Greeting", "Hello");
echo Greeting;

// constant array
define("cars", [
    "Alfa Romeo",
    "BMW",
    "Toyota"
]);

echo cars[0];

?>