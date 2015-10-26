<?php

// Here is the start of a function
function randString() {
    $string = "";
    return $string;
}

if(isset($_POST['i1'])){
    //Task #1 Here
    $result = "";
} elseif(isset($_POST['i2'])){
    //Task #2 Here
    $result = "";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Assignment</title>
</head>
<body>
<h1>Task #1</h1>
<p>What to do? Input a string into the form, have it check against an associative array and have it return the result.</p>
<form action="index.php" method="post">
    String: <input type="text" name="i1"><input type="submit">
</form>

<h1>Task #2</h1>
<p>What to do? Input a string into form, create a randomized 5 char string (fyi url does not have anything to do with
    randomized string not yet anyway, have it return the randomized string.</p>
<form action="index.php" method="post">
    String: <input type="text" name="i2"><input type="submit">
</form>

<?php
if(!empty($result)){
    echo $result;
}
?>
</body>
</html>