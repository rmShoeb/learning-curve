<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Constructor</title>
</head>
<body>
<?php

require 'comment.php';

$comment = new Comment("This is a comment!");
echo $comment->text;

?>
</body>
</html>