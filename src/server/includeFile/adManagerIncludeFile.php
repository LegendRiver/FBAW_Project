<?php

if(!class_exists('StrategyConstants'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_CONSTANTS . DIRECTORY_SEPARATOR .'StrategyConstants.php');
}
if(!class_exists('SyncConstants'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_CONSTANTS . DIRECTORY_SEPARATOR .'SyncConstants.php');
}

if(!class_exists('ReportConstants'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_CONSTANTS . DIRECTORY_SEPARATOR .'ReportConstants.php');
}
if(!class_exists('ProfitConstants'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_CONSTANTS . DIRECTORY_SEPARATOR .'ProfitConstants.php');
}

if(!class_exists('BidEstimateBuilder'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'sync/BidEstimateBuilder.php');
}
if(!class_exists('SyncManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'sync/SyncManager.php');
}
if(!class_exists('EliDBEntityBuilder'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'sync/EliDBEntityBuilder.php');
}
if(!class_exists('StrategyInputParamBuilder'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'sync/StrategyInputParamBuilder.php');
}
if(!class_exists('OppositeSyncManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'sync/OppositeSyncManager.php');
}


if(!class_exists('AdManagerDBFacade'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'common/AdManagerDBFacade.php');
}

if(!class_exists('CallStrategyManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/CallStrategyManager.php');
}
if(!class_exists('StrategyFileParser'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/StrategyFileParser.php');
}
if(!class_exists('StrategyManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/StrategyManager.php');
}
if(!class_exists('FBParamTransformer'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/FBParamTransformer.php');
}
if(!class_exists('PublisherDBEntityBuilder'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/PublisherDBEntityBuilder.php');
}
if(!class_exists('STProcessInfoManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/STProcessInfoManager.php');
}
if(!class_exists('ImageProcesser'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/ImageProcesser.php');
}
if(!class_exists('VideoProcesser'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/VideoProcesser.php');
}
if(!class_exists('StrategyHandleTask'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/StrategyHandleTask.php');
}


if(!class_exists('AbstractParamHandler'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/handler/AbstractParamHandler.php');
}
if(!class_exists('AdsetParamHandler'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/handler/AdsetParamHandler.php');
}
if(!class_exists('CreativeParamHandler'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/handler/CreativeParamHandler.php');
}
if(!class_exists('AdParamHandler'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/handler/AdParamHandler.php');
}
if(!class_exists('CampaignParamHandler'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/handler/CampaignParamHandler.php');
}


if(!class_exists('StrategyCheckManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/checker/StrategyCheckManager.php');
}
if(!class_exists('AbstractStrategyChecker'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/checker/AbstractStrategyChecker.php');
}
if(!class_exists('AdsetSTChecker'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/checker/AdsetSTChecker.php');
}
if(!class_exists('CampaignSTChecker'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/checker/CampaignSTChecker.php');
}
if(!class_exists('CreativeSTChecker'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'strategy/checker/CreativeSTChecker.php');
}


if(!class_exists('FBInsightTransformer'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'report/FBInsightTransformer.php');
}
if(!class_exists('FBReportQuery'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'report/FBReportQuery.php');
}
if(!class_exists('QueryFbInsightTask'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'report/QueryFbInsightTask.php');
}
if(!class_exists('FBInsightLogExporter'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'report/FBInsightLogExporter.php');
}
if(!class_exists('ConfigReportManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'report/ConfigReportManager.php');
}
if(!class_exists('ReportFieldManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'report/ReportFieldManager.php');
}

if(!class_exists('ProfitDBFacade'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'profit/ProfitDBFacade.php');
}
if(!class_exists('ProfitHandler'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'profit/ProfitHandler.php');
}
if(!class_exists('ProfitManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_ADMANAGER . DIRECTORY_SEPARATOR .'profit/ProfitManager.php');
}




