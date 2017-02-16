 <?php
 include("db.php");
 if(
 	isset($_POST['date']) && isset($_POST['day']) && isset($_POST['title']) && 
 	isset($_POST['description']) && isset($_POST['imgURL'])
 ) {
 	$date = mysqli_real_escape_string($connection, $_POST['date']);
	$day = mysqli_real_escape_string($connection, $_POST['day']);
	$title = mysqli_real_escape_string($connection, $_POST['title']);
	$description = mysqli_real_escape_string($connection, $_POST['description']);
	$imgURL = mysqli_real_escape_string($connection, $_POST['imgURL']);
	
	$insertQuery = "insert into tbl_updates_226(date,day,description,title,imageURL) values ('$date','$day','$description','$title','$imgURL')";
	$insertResult = mysqli_query($connection, $insertQuery);
 	mysqli_free_result($insertResult);
 }
 mysqli_close($connection);
?>
