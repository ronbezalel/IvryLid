 <?php
 include("db.php");
 
 $query = "SELECT * FROM tbl_updates_226";
 
 $result = mysqli_query($connection, $query);
 if(!$result){
 	die("DB query failed");
 }
while($row = mysqli_fetch_row($result)){
$table_data[] = array(
"id"=>$row[0], "date"=>$row[1], "day"=>$row[2],
"description"=>$row[3], "title"=>$row[4], "imageURL"=>$row[5]);
}
echo json_encode($table_data);
 mysqli_free_result($result);
 mysqli_close($connection);
?>
