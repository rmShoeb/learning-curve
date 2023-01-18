<?php

$x = 1;
while($x <= 5){
    echo $x;
    $x++;
}

$x = 1;
do{
    echo $x;
    $x++;
} while ($x <= 10);

for($x=0; $x<5; $x++){
    echo($x . "<br>");
}

$colors = array('red', 'green', 'blue', 'yellow', 'purple', 'black', 'white');
foreach($colors as $color){
    echo($color . '<br>');
}

$age = array("Peter"=>"35", "Ben"=>"37", "Joe"=>"43");
foreach($age as $x => $val) {
    echo "$x = $val<br>";
}

// break and continue has the same functions as in other languages

?>