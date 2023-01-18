<?php

$age = array("Peter"=>35, "Ben"=>37, "Joe"=>43);
echo(json_encode($age));

print("<br>");

$jsonobj = '{"Peter":35,"Ben":37,"Joe":43}';
var_dump(json_decode($jsonobj));
print("<br>");
var_dump(json_decode($jsonobj, true)); // this will return an associative array

?>