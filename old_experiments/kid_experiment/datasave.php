<?php
	$result_string = $_POST['postresult_string'];
	file_put_contents('contrast_select_v1.csv', $result_string, FILE_APPEND);
?>