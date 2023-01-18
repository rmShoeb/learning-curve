<?php

$str = "This is a string";

echo strlen($str) . "<br>"; // how many characters
echo str_word_count($str) . "<br>"; // how many words
echo strrev($str); // reverses the string
echo strpos($str, "is"); // search for string-2 in string-1
echo str_replace("is", "was", $str); // replace string-1 with string-2 from string-3

?>