<?php

if(!class_exists('DBManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_BASIC . DIRECTORY_SEPARATOR . 'DBManager.php');
}
if(!class_exists('DBConstants'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_CONSTANTS . DIRECTORY_SEPARATOR . 'DBConstants.php');
}
if(!class_exists('AbstractDBManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/AbstractDBManager.php');
}
//helper
if(!class_exists('DBHelper'))
{
    require_once(EL_SERVER_PATH . 'helper/DBHelper.php');
}

if(!class_exists('AdvertiserDBFields'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'fieldConstants/AdvertiserDBFields.php');
}
if(!class_exists('OrionTableNameConstants'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'fieldConstants/OrionTableNameConstants.php');
}
if(!class_exists('ProductDBFields'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'fieldConstants/ProductDBFields.php');
}
if(!class_exists('PlatformDBFields'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'fieldConstants/PlatformDBFields.php');
}
if(!class_exists('ProductDeliveryMapFields'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'fieldConstants/ProductDeliveryMapFields.php');
}
if(!class_exists('AccountDBFields'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'fieldConstants/AccountDBFields.php');
}
if(!class_exists('SelectAliasConstants'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'fieldConstants/SelectAliasConstants.php');
}

if(!class_exists('AdvertiserInfoEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'orionEntity/AdvertiserInfoEntity.php');
}
if(!class_exists('ProductInfoEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'orionEntity/ProductInfoEntity.php');
}
if(!class_exists('AccountInfoEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'orionEntity/AccountInfoEntity.php');
}

if(!class_exists('ProductDBManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'orionManager/ProductDBManager.php');
}
if(!class_exists('AccountDBManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'orionManager/AccountDBManager.php');
}
