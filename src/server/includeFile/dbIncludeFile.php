<?php
require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_BASIC . DIRECTORY_SEPARATOR . 'DBManager.php');
require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_CONSTANTS . DIRECTORY_SEPARATOR . 'DBConstants.php');


//manager
if(!class_exists('AbstractDBManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/AbstractDBManager.php');
}
if(!class_exists('ELICamConfigDB'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/ELICamConfigDB.php');
}
if(!class_exists('ELICampaignDB'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/ELICampaignDB.php');
}
if(!class_exists('PublisherCampaignDB'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/PublisherCampaignDB.php');
}
if(!class_exists('PublisherAdsetDB'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/PublisherAdsetDB.php');
}
if(!class_exists('PublisherCreativeDB'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/PublisherCreativeDB.php');
}
if(!class_exists('PublisherAdDB'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/PublisherAdDB.php');
}
if(!class_exists('PublisherImageDB'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/PublisherImageDB.php');
}
if(!class_exists('AdReportDB'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/AdReportDB.php');
}
if(!class_exists('CampaignReportDB'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/CampaignReportDB.php');
}
if(!class_exists('PublisherVideoDB'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/PublisherVideoDB.php');
}
if(!class_exists('ProfitDB'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/ProfitDB.php');
}
if(!class_exists('DailySpendDB'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'manager/DailySpendDB.php');
}


//entity
if(!class_exists('CamConfigEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'entity/CamConfigEntity.php');
}
if(!class_exists('EliCampaignEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'entity/EliCampaignEntity.php');
}
if(!class_exists('PublisherCampaignEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'entity/PublisherCampaignEntity.php');
}
if(!class_exists('PublisherAdSetEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'entity/PublisherAdSetEntity.php');
}
if(!class_exists('PublisherCreativeEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'entity/PublisherCreativeEntity.php');
}
if(!class_exists('PublisherAdEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'entity/PublisherAdEntity.php');
}
if(!class_exists('PublisherImageEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'entity/PublisherImageEntity.php');
}
if(!class_exists('CommonReportEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'entity/CommonReportEntity.php');
}
if(!class_exists('AdReportEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'entity/AdReportEntity.php');
}
if(!class_exists('CampaignReportEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'entity/CampaignReportEntity.php');
}
if(!class_exists('PublisherVideoEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'entity/PublisherVideoEntity.php');
}
if(!class_exists('ProfitDBEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'entity/ProfitDBEntity.php');
}
if(!class_exists('DailySpendEntity'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_DB . DIRECTORY_SEPARATOR . 'entity/DailySpendEntity.php');
}

//helper
if(!class_exists('DBHelper'))
{
    require_once(EL_SERVER_PATH . 'helper/DBHelper.php');
}
