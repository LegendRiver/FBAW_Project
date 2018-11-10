<?php

if(!class_exists('ServiceCallUtil'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_SERVICE . DIRECTORY_SEPARATOR .'common/ServiceCallUtil.php');
}
if(!class_exists('ServiceObject'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_SERVICE . DIRECTORY_SEPARATOR .'common/ServiceObject.php');
}

if(!class_exists('ServiceConstants'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_SERVICE . DIRECTORY_SEPARATOR .'constants/ServiceConstants.php');
}
if(!class_exists('ReactStateKeys'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_SERVICE . DIRECTORY_SEPARATOR .'constants/ReactStateKeys.php');
}
if(!class_exists('ServiceParamFields'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_SERVICE . DIRECTORY_SEPARATOR .'constants/ServiceParamFields.php');
}
if(!class_exists('ReactStateDataConstants'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_SERVICE . DIRECTORY_SEPARATOR .'constants/ReactStateDataConstants.php');
}

if(!class_exists('BasicInfoDataHandler'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_SERVICE . DIRECTORY_SEPARATOR .'dataHandler/BasicInfoDataHandler.php');
}

if(!class_exists('AccountInfoManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_SERVICE . DIRECTORY_SEPARATOR .'performance/AccountInfoManager.php');
}


if(!class_exists('ProductInfoManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_SERVICE . DIRECTORY_SEPARATOR .'performance/ProductInfoManager.php');
}
