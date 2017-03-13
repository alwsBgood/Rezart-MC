<?php
$jsonString = file_get_contents('users.json');
$data = json_decode($jsonString, true);

$data['users_value'] += 1;

$newJsonString = json_encode($data);
file_put_contents('users.json', $newJsonString);
?>