<?php


class AdManagerFacade
{

    public static function getProperAccount()
    {
        $userEntity = AdUserManager::instance()->getUserInfo();
        $accountEntity = AdAccountManager::instance()->getProperAccount($userEntity->getUserID());
        return $accountEntity;
    }

    public static function getAllAccountsByBMId($bmId)
    {
        $accountEntities = AdAccountManager::instance()->getAccountByBMId($bmId);
        if(false === $accountEntities)
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to get accounts by bm id ' . $bmId);
            return false;
        }
        return $accountEntities;
    }

    public static function getCurrentUserAllAccounts()
    {
        $userEntity = AdUserManager::instance()->getUserInfo();
        $accountEntities = AdAccountManager::instance()->getAllAccountByUser($userEntity->getUserID());
        if(false === $accountEntities)
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to get accounts by user id ' . $userEntity->getUserID());
            return false;
        }
        return $accountEntities;
    }

    public static function createMediaCampaign(CampaignCreateParam $param)
    {
        //转化参数
        $adAccountId = $param->getAdAccountId();
        $fieldArray = CampaignUtil::transformCampaignField($param);
        if(false === $fieldArray)
        {
            $message = CommonHelper::transformFailedMessage('Campaign');
            ServerLogger::instance()->writeLog(Error, $message);
            return false;
        }

        $campaignManager = AdCampaignManager::instance();
        $newCampaign = $campaignManager->createCampaign($adAccountId, $fieldArray);
        if(!isset($newCampaign))
        {
            //有一种异常不返回也创建成功，后面在解决这个问题;估计是手动删除的原因
            ServerLogger::instance()->writeLog(Warning,'The return value of campaign create is null');
            return false;
        }

        return $newCampaign;
    }

    public static function createMediaAdSet(AdsetCreateParam $param)
    {
        //获取AdsetFields
        $accountId = $param->getAccountId();

        $fieldArray = AdSetUtil::transformAdSetField($param);
        if(false === $fieldArray)
        {
            $message = CommonHelper::transformFailedMessage('AdSet');
            ServerLogger::instance()->writeLog(Error, $message);
            return false;
        }

        ServerLogger::instance()->writeLog(Debug, print_r($fieldArray, true));

        return self::createAdsetByFields($accountId, $fieldArray);
    }

    public static function createAdsetByFields($accountId, array $fields)
    {
        $adsetEntity = AdSetManager::instance()->createAdSet($accountId, $fields);
        if(!isset($adsetEntity))
        {
            //有一种异常不返回也建成功，后面在解决这个问题;估计是手动删除的原因
            //还有超时的异常要做处理
            ServerLogger::instance()->writeLog(Warning,'The return value of adset create is null');
            return false;
        }
        return $adsetEntity;
    }

    public static function copyAdset($adsetId, array $param=array())
    {
        $copyResult = AdSetManager::instance()->copyAdset($adsetId, $param);
        if(empty($copyResult))
        {
            ServerLogger::instance()->writeLog(Warning,'Failed to copy adset: ' . $adsetId);
            return false;
        }
        return $copyResult;
    }

    public static function updateAdsetName($adsetId, $name)
    {
        $updateResult = AdSetManager::instance()->updateName($adsetId, $name);
        if(false === $updateResult)
        {
            ServerLogger::instance()->writeLog(Warning,'Failed to update adset name: ' . $adsetId);
            return false;
        }
        return $updateResult;
    }

    public static function createImage($imagePath, $accountId)
    {
        $imageEntity = AdImageManager::instance()->createImage($imagePath, $accountId);
        if(false === $imageEntity)
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to Create Image.' . $imagePath);
            return false;
        }

        return $imageEntity;
    }

    public static function createAdVideo(AdVideoParam $videoParam)
    {
        $videoField = CreativeUtil::transformVideoField($videoParam);

        $accountId = $videoParam->getAccountId();
        $videoEntity = AdVideoManager::instance()->createVideo($accountId, $videoField);
        if(false === $videoEntity)
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to Create video.' . print_r($videoParam, true));
            return false;
        }

        return $videoEntity;
    }

    public static function getVedioById($videoId)
    {
        $videoEntity = AdVideoManager::instance()->getVideoById($videoId);
        if(false === $videoEntity)
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to get video by ' . $videoId);
            return false;
        }

        return $videoEntity;
    }

    public static function createCreative(AdCreativeParam $param)
    {
        $accountId = $param->getAccountId();
        $creativeField = CreativeUtil::transformCreativeField($param);
        if(false === $creativeField)
        {
            $message = CommonHelper::transformFailedMessage('Creative');
            ServerLogger::instance()->writeLog(Error, $message);
            return false;
        }

        return self::createCreativeByField($accountId, $creativeField);
    }

    public static function createCreativeByField($accountId, $creativeField)
    {
        $creativeEntity = AdCreativeManager::instance()->createCreative($accountId, $creativeField);
        if(false === $creativeEntity || !isset($creativeEntity))
        {
            //有一种异常不返回也创建成功，后面在解决这个问题;估计是手动删除的原因
            //还有超时的异常要做处理
            ServerLogger::instance()->writeLog(Warning, 'The return value of creative create is null : ' .
                gettype($creativeEntity));

            return false;
        }

        return $creativeEntity;
    }

    public static function createMediaAd(AdCreateParam $param)
    {
        $accountId = $param->getAccountId();
        $adField = AdUtil::transformAdField($param);

        return self::createAdByField($accountId, $adField);
    }

    public static function createAdByField($accountId, $adFiledArray)
    {
        $adEntity = AdManager::instance()->createAd($accountId, $adFiledArray);
        if(false === $adEntity || !isset($adEntity))
        {
            //有一种异常不返回也创建成功，后面在解决这个问题;估计是手动删除的原因
            //还有超时的异常要做处理
            ServerLogger::instance()->writeLog(Warning, 'The return value of ad create is invalid : ' .
                print_r($adEntity, true));
            return false;
        }

        return $adEntity;
    }

    public static function getAllAdInsightByAccount($accountId, $dateSince = '', $dateUtil = '')
    {
        $adIds = self::getAdIdsByParentId($accountId);
        if(false === $adIds)
        {
            return false;
        }

        $adInsight = AdInsightManager::instance()->getAdInsightByIds($adIds, $dateSince, $dateUtil);
        if(false === $adInsight)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to get the insights by adIds.');
            return false;
        }

        return $adInsight;
    }

    public static function getAdIdsByParentId($parentId, $type = AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT,
                                              $filterStatus = array(), $isHerarchy = false)
    {
        $adArray = self::getAdEntity($parentId, $type, $filterStatus, $isHerarchy);

        if(false === $adArray || CommonHelper::notSetValue($adArray))
        {
            ServerLogger::instance()->writeLog(Info, 'There is no ad got by '. $type . ' : ' . $parentId);
            return false;
        }

        $adIds = array();

        foreach($adArray as $adEntity)
        {
            $adIds[] = $adEntity->getId();
        }

        return $adIds;
    }

    public static function getAdSetIdsByParentId($parentId, $type = AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT,
                                                 $status = array(), $isClassCampaign = false)
    {
        $adsetArray = self::getAdSetEntity($parentId, $type, $status, $isClassCampaign);

        if(false === $adsetArray || CommonHelper::notSetValue($adsetArray))
        {
            ServerLogger::instance()->writeLog(Info, 'There is no ad got by '. $type . ' : ' . $parentId);
            return false;
        }

        $adsetIds = array();

        foreach($adsetArray as $adSetEntity)
        {
            $adsetIds[] = $adSetEntity->getId();
        }

        return $adsetIds;
    }

    public static function getDisapprovedAdByAccount($accountId)
    {
        return AdManager::instance()->getDisapprovedAdByAccount($accountId);
    }

    public static function getAdEntity($exportId, $exportDimension, $filterStatus = array(), $isClass=false)
    {
        $adEntities = array();

        if($exportDimension == AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN)
        {
            $adEntities = AdManager::instance()->getAdsByCampaign($exportId, $filterStatus);
        }
        else if($exportDimension == AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT)
        {
            if($isClass)
            {
               $adEntities = self::getAdByActHierarchy($exportId, $filterStatus);
            }
            else
            {
                $adEntities = AdManager::instance()->getAdsByAccount($exportId, $filterStatus);
            }
        }
        else if($exportDimension == AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET)
        {
            $adEntities = AdManager::instance()->getAdsByAdSet($exportId, $filterStatus);
        }

        return $adEntities;
    }

    public static function getAdSetEntity($parentId, $parentType, $status = array(), $queryFields=array(), $isCampaignClass=false)
    {
        $adSetEntities = array();
        if($parentType == AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN)
        {
            $adSetEntities = AdSetManager::instance()->getAdsetsByCampaignId($parentId, $status);
        }
        else if($parentType == AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT)
        {
            if($isCampaignClass)
            {
                $adSetEntities = self::getAdsetByActHierarchy($parentId, $status, $queryFields);
            }
            else
            {
                $adSetEntities = AdSetManager::instance()->getAdsetsByAccountId($parentId, $status);
            }
        }

        return $adSetEntities;
    }

    private static function getAdsetByActHierarchy($accountId, $status=array(), $fields = array())
    {
        $adSetEntities = array();
        $campaignIds = self::getCampaignIdsByAccount($accountId);
        if(!empty($campaignIds))
        {
            foreach ($campaignIds as $camid)
            {
                $adSets = AdSetManager::instance()->getAdsetsByCampaignId($camid, $status, $fields);
                if(empty($adSets))
                {
                    continue;
                }
                $adSetEntities = array_merge($adSetEntities, $adSets);
            }
        }

        return $adSetEntities;
    }

    private static function getAdByCamHierarchy($campaignId, $filterStatus=array())
    {
        $adList = array();
        //注意ad的filterstatus 不一定适用于 adset, 此处暂时是相同的，如有不同场景，需要修改
        $adsetIds = self::getAdSetIdsByParentId($campaignId, AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN, $filterStatus);
        if(!empty($adsetIds))
        {
            foreach ($adsetIds as $id)
            {
                $ad = AdManager::instance()->getAdsByAdSet($id, $filterStatus);
                if(empty($ad))
                {
                    continue;
                }
                $adList = array_merge($adList, $ad);
            }
        }

        return $adList;
    }

    private static function getAdByActHierarchy($accountId, $filterStatus=array())
    {
        $adList = array();
        $campaignIds = self::getCampaignIdsByAccount($accountId);
        if(!empty($campaignIds))
        {
            foreach ($campaignIds as $camid)
            {
                $ad = AdManager::instance()->getAdsByCampaign($camid, $filterStatus);
                if(empty($ad))
                {
                    continue;
                }
                $adList = array_merge($adList, $ad);
            }
        }

        return $adList;
    }


    public static function getCampaignIdsByAccount($accountId)
    {
        $campaignEntityArray = AdCampaignManager::instance()->getCampaignByAccount($accountId);

        if (false === $campaignEntityArray || CommonHelper::notSetValue($campaignEntityArray))
        {
            ServerLogger::instance()->writeLog(Info, 'There is no campaign got by accountID: ' . $accountId);
            return false;
        }

        $campaignIds = array();

        foreach ($campaignEntityArray as $campaignEntity)
        {
            $campaignIds[] = $campaignEntity->getCampaignId();
        }

        return $campaignIds;
    }

    public static function getOneAdInsight($adId, $dateSince = '', $dateUtil = '')
    {
        $adInsight = AdInsightManager::instance()->getAdInsight($adId, $dateSince, $dateUtil);
        if(false === $adInsight)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to get the insights by adId: ' . $adId);
            return false;
        }

        return $adInsight;
    }
    public static function getOneAdsetInsight($adsetId, $dateSince = '', $dateUtil = '')
    {
        $adsetInsight = AdInsightManager::instance()->getAdSetInsight($adsetId, $dateSince, $dateUtil);
        if(false === $adsetInsight)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to get the insights by adsetId: ' . $adsetId);
            return false;
        }

        return $adsetInsight;
    }
    public static function getOneCampaignInsight($campaignId, $dateSince = '', $dateUtil = '')
    {
        $campaignInsight = AdInsightManager::instance()->getCampaignInsight($campaignId, $dateSince, $dateUtil);
        if(false === $campaignInsight)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to get the insights by campaignId: ' . $campaignId);
            return false;
        }

        return $campaignInsight;
    }
    public static function getOneAccountInsight($accountID, $dateSince = '', $dateUtil = '')
    {
        $accountInsight = AdInsightManager::instance()->getAccountInsight($accountID, $dateSince, $dateUtil);
        if(false === $accountInsight)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to get the insights by accountId: ' . $accountID);
            return false;
        }

        return $accountInsight;
    }


    public static function getReachEstimateByAccount(AdsetCreateParam $param)
    {
        $accountId = $param->getAccountId();
        $estimateParam = AdSetUtil::getReachEstimateParam($param);
        return self::getBidEstimateByAccount($accountId, $estimateParam);
    }

    public static function getBidEstimateByAccount($accountId, $estimateParam)
    {
        $deliveryParam = self::buildDeliveryParam($estimateParam);
        if(false === $estimateParam)
        {
            return false;
        }
        $estimateArray = TargetingSearchUtil::estimateReachBid($accountId, $estimateParam, $deliveryParam);
        return $estimateArray;
    }

    public static function getBidEstimateByAdset($adsetId)
    {
        $estimateArray = TargetingSearchUtil::getDeliveryEstimateByAdSet($adsetId);
        return $estimateArray;
    }

    private static function buildDeliveryParam($estimateParam)
    {
        $targeting = $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_TARGETING];
        if(array_key_exists(AdManageConstants::REACH_ESTIMATE_PARAM_OPTIMIZATION, $estimateParam))
        {
            $optimizationGoal = $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_OPTIMIZATION];
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, 'The optimization goal of delivery estimate is empty');
            return false;
        }

        $deliveryParam = array();
        $deliveryParam[AdManageConstants::DELIVERY_ESTIMATE_PARAM_TARGETING] = $targeting;
        $deliveryParam[AdManageConstants::DELIVERY_ESTIMATE_PARAM_OPTIMIZATION] = $optimizationGoal;
        return $deliveryParam;
    }

    public static function getAdsetById($adsetId)
    {
        $adsetEntity = AdSetManager::instance()->getAdsetById($adsetId);
        if(false === $adsetEntity)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to get adset by adsetID : ' . $adsetId);
            return false;
        }

        return $adsetEntity;
    }

    public static function getAllFieldAdsetById($adsetId)
    {
        $adset = AdSetManager::instance()->getAllFieldAdsetById($adsetId);
        if(false === $adset)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to get all field adset by adsetID : ' . $adsetId);
            return false;
        }

        return $adset;
    }
    public static function getCampaignById($campaignId)
    {
        $campaignEntity = AdCampaignManager::instance()->getCampaignById($campaignId);
        if(false === $campaignEntity)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to get campaign by campaignId : ' . $campaignId);
            return false;
        }

        return $campaignEntity;
    }
    public static function getAccountById($accountId)
    {
        $accountEntity = AdAccountManager::instance()->getAccountById($accountId);
        if(false === $accountEntity)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to get account by accountId : ' . $accountId);
            return false;
        }

        return $accountEntity;
    }

    public static function getAdById($adId)
    {
        $adEntity = AdManager::instance()->getAdById($adId);
        if(false === $adEntity)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to ad by adID : ' . $adId);
            return false;
        }

        return $adEntity;
    }

    public static function getAdsetByCampaignId($campaignId)
    {
        $adsetEntities = AdSetManager::instance()->getAdsetsByCampaignId($campaignId);
        if(false === $adsetEntities)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to adset by campaignId : ' . $campaignId);
            return false;
        }

        return $adsetEntities;
    }

    public static function updateAdsetBudget($adsetId, $budgetAmount, $isDailyBudget)
    {
        return AdSetManager::instance()->updateBudget($adsetId, $isDailyBudget, $budgetAmount);
    }

    public static function deleteCampaign($campaignId)
    {
        return AdCampaignManager::instance()->deleteCampaign($campaignId);
    }

    public static function updateCampaignStatus($campaignId, $status)
    {
        return AdCampaignManager::instance()->switchStatus($campaignId, $status);
    }
    public static function updateAdSetStatus($adsetId, $status)
    {
        return AdSetManager::instance()->switchStatus($adsetId, $status);
    }
    public static function updateAdStatus($adId, $status)
    {
        return AdManager::instance()->switchStatus($adId, $status);
    }

    public static function updateAdsetBid($adsetId, $bidAmount)
    {
        return AdSetManager::instance()->updateBid($adsetId, $bidAmount);
    }

    public static function getCreativeByAdId($adId)
    {
        $adEntity = self::getAdById($adId);
        if(false === $adEntity)
        {
            return false;
        }

        $creativeId = $adEntity->getCreativeId();
        $creativeEntity = AdCreativeManager::instance()->getCreativeById($creativeId);
        if (false === $creativeEntity)
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to get creative by id: ' . $creativeId);
            return false;
        }

        return $creativeEntity;
    }

    public static function getAllFieldCreativeById($creativeId)
    {
        $creativeArray = AdCreativeManager::instance()->getAllFieldCreative($creativeId);
        if (false === $creativeArray)
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to get all field creative by id: ' . $creativeId);
            return false;
        }

        return $creativeArray;
    }

    public static function getFlexibleInsight($nodeId, $nodeType, $dateSince='', $dateUtil='', $insightField=array(),
                                              $otherParam=array())
    {
        $insights = AdInsightManager::instance()->getFlexibleInsight($nodeId, $nodeType, $dateSince, $dateUtil,
            $insightField, $otherParam);

        if(false === $insights)
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to get flexible insight by id: ' . $nodeId .
                '; node type: ' . $nodeType);
            return false;
        }

        return $insights;
    }

    public static function getAllFiledInsight($nodeId, $nodeType, $dateSince='', $dateUtil='')
    {
        $insights = AdInsightManager::instance()->getAllFieldInsight($nodeId, $dateSince, $dateUtil, $nodeType);

        if(false === $insights)
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to get flexible insight by id: ' . $nodeId .
                '; node type: ' . $nodeType);
            return false;
        }

        return $insights;
    }
}