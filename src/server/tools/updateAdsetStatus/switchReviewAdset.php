<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

pausedReviewAdset();

function pausedReviewAdset()
{
    $accountIds = array(
        'act_1227059294037094'
    );

    $adList = array();
    $filterStatus = array(AdManageConstants::EFFECTIVE_STATUS_REVIEW);
    foreach ($accountIds as $actId)
    {
        $ads = AdManagerFacade::getAdEntity($actId, AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT, $filterStatus, true);
        $adList = array_merge($adList, $ads);
    }

    $status = 'PAUSED';
    $succeedPausedIds = array();
    foreach($adList as $entity)
    {
        $adId = $entity->getId();
        $updateStatus = AdManagerFacade::updateAdStatus($adId, $status);
        if(false === $updateStatus)
        {
            print_r('!!!!!Failed to pause ad: ' . $adId .'......'. PHP_EOL);
            ServerLogger::instance()->writeLog(Info, '!!!!!Failed to pause ad: ' . $adId);
        }
        else
        {
            print_r('@@@@@@Succeed to pause ad:' . $adId .'......'. PHP_EOL);
            ServerLogger::instance()->writeLog(Info, '@@@@@@Succeed to pause ad:' . $adId);
            $succeedPausedIds[] = $adId;
        }
    }

    FileHelper::writeJsonFile($succeedPausedIds, 'paused_ad_id.json');
}