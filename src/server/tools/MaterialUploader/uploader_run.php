<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");

$materialPath = __DIR__ . DIRECTORY_SEPARATOR . 'material';
uploadMaterial($materialPath, 'act_590058764508176');

function uploadMaterial($materialPath, $accountId)
{
    $uploadManager = new UploadMaterialManager($materialPath);
    $uploadManager->uploadMaterial($accountId);
}




