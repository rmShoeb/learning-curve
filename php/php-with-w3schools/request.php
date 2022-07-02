<html>
<body>

<form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
<!-- <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']);?>"> -->
<!-- the second way ensures security -->
<!-- htmlspecialchars() does some magic, which prevents attackers from injecting malicious codes -->
<!-- $_SERVER['PHP_SELF'] returns the filename of the currently executing script -->
    Name: <input type="text" name="fname">
    <input type="submit">
</form>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // collect value of input field
    $name = $_REQUEST['fname'];
    if(empty($name)){ // empty() checks whether the variable is empty or not
        echo "Name is empty";
    }
    else{
        echo $name;
    }
}
?>

</body>
</html>