<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json;charset=utf-8");
require_once(__DIR__ . '/../../includeFile/interfaceInitFile.php');

echo ServiceCallUtil::callService($_REQUEST);
