<?php

use FacebookAds\Object\Ad;
use FacebookAds\Object\AdsInsights;
use FacebookAds\Object\AdSet;
use FacebookAds\Object\Fields\AdsInsightsFields;
use FacebookAds\Object\Fields\AdReportRunFields;
use FacebookAds\Object\Campaign;
use FacebookAds\Object\AdAccount;
use FacebookAds\Object\Values\AdDatePresetValues;

class AdInsightManager
{
    private static $instance = null;


    private $paramArray;

    private $defaultFields;

    private $allFields;

    private function __construct()
    {
        $this->paramArray = array(
            AdReportRunFields::DATE_PRESET => AdDatePresetValues::TODAY,
        );

        $this->defaultFields = array(
            AdsInsightsFields::ACCOUNT_ID,
            AdsInsightsFields::CAMPAIGN_ID,
            AdsInsightsFields::ADSET_ID,
            AdsInsightsFields::AD_ID,
            AdsInsightsFields::DATE_START,
            AdsInsightsFields::DATE_STOP,
            AdsInsightsFields::OBJECTIVE,
            AdsInsightsFields::ACTIONS,
            AdsInsightsFields::SPEND,

            AdsInsightsFields::REACH,
            AdsInsightsFields::IMPRESSIONS,
            //后续api会废弃掉,https://developers.facebook.com/ads/blog/post/2016/03/16/link-clicks-updates/
            //AdsInsightsFields::CLICKS,
            AdsInsightsFields::INLINE_LINK_CLICKS,
            AdsInsightsFields::CALL_TO_ACTION_CLICKS,

            //AdsInsightsFields::UNIQUE_CLICKS,
            AdsInsightsFields::UNIQUE_INLINE_LINK_CLICKS,

            //AdsInsightsFields::CPC,
            AdsInsightsFields::COST_PER_INLINE_LINK_CLICK,

            AdsInsightsFields::CPM,

            //AdsInsightsFields::CTR,
            AdsInsightsFields::INLINE_LINK_CLICK_CTR,

            AdsInsightsFields::CPP,
        );

        $this->initAllFields();
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function  getAdInsightByIds($adIdArray, $dateSince = '', $dateUtil = '')
    {
        $resultArray = array();

        foreach ($adIdArray as $adId)
        {
            $insightArray = $this->getAdInsight($adId, $dateSince, $dateUtil);
            if(false === $insightArray)
            {
                ServerLogger::instance()->writeLog(Error, 'Failed to get insight of ad : ' . $adId);
                return false;
            }
            $resultArray = array_merge($resultArray, $insightArray);
        }

        return $resultArray;
    }


    public function getAdInsight($adId, $dateSince = '', $dateUtil = '')
    {
        try
        {
            $this->initDataRange($dateSince, $dateUtil);

            $ad = new Ad($adId);
            $insightCursor = $ad->getInsights($this->defaultFields, $this->paramArray);
            return $this->tranverseInsightCursor($insightCursor);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }
    public function getAdSetInsight($adSetId, $dateSince = '', $dateUtil = '')
    {
        try
        {
            $this->initDataRange($dateSince, $dateUtil);

            $adset = new AdSet($adSetId);
            $insightCursor = $adset->getInsights($this->defaultFields, $this->paramArray);
            return $this->tranverseInsightCursor($insightCursor);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }
    public function getCampaignInsight($campaignId, $dateSince = '', $dateUtil = '')
    {
        try
        {
            $this->initDataRange($dateSince, $dateUtil);

            $campaign = new Campaign($campaignId);
            $insightCursor = $campaign->getInsights($this->defaultFields, $this->paramArray);
            return $this->tranverseInsightCursor($insightCursor);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }
    public function getAccountInsight($accountId, $dateSince = '', $dateUtil = '')
    {
        try
        {
            $this->initDataRange($dateSince, $dateUtil);

            $account = new AdAccount($accountId);
            $insightCursor = $account->getInsights($this->defaultFields, $this->paramArray);
            return $this->tranverseInsightCursor($insightCursor);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    //测试及小工具使用
    public function getAllFieldInsight($nodeId, $dateSince = '', $dateUtil = '', $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_AD)
    {
        $resultArray = $this->getFlexibleInsight($nodeId, $nodeType, $dateSince, $dateUtil);
        return $resultArray;
    }

    public function getFlexibleInsight($nodeId, $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_AD, $dateSince = '',
                                       $dateUtil = '', $insightField = array(), $otherParam = array())
    {
        try
        {
            $this->initDataRange($dateSince, $dateUtil);

            if(!empty($otherParam))
            {
                $this->paramArray = array_merge($this->paramArray, $otherParam);
            }

            $insightCursor = $this->getInsightCursor($nodeId, $nodeType, $insightField);

            $resultArray = array();
            while ($insightCursor->valid())
            {
                $currentInsight = $insightCursor->current();
                $resultArray[] = $currentInsight->exportData();
                $insightCursor->next();
            }

            return $resultArray;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    private function getInsightCursor($nodeId, $nodeType, $insightField = array())
    {
        if(empty($insightField))
        {
            $fields = $this->allFields;

        }
        else
        {
            $fields = $insightField;
        }

        if(AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET == $nodeType)
        {
            $nodeAdset = new AdSet($nodeId);
            $insightCursor = $nodeAdset->getInsights($fields, $this->paramArray);
        }
        else if(AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN == $nodeType)
        {
            $nodeCampaign = new Campaign($nodeId);
            $insightCursor = $nodeCampaign->getInsights($fields, $this->paramArray);
        }
        else if(AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT == $nodeType)
        {
            $nodeCampaign = new AdAccount($nodeId);
            $insightCursor = $nodeCampaign->getInsights($fields, $this->paramArray);
        }
        else
        {
            $nodeAd = new Ad($nodeId);
            $insightCursor = $nodeAd->getInsights($fields, $this->paramArray);
        }

        return $insightCursor;
    }

    private function initDataRange($dateSince, $dateUtil)
    {
        $isValid = false;
        if(CommonHelper::checkDateStrValid($dateSince) && CommonHelper::checkDateStrValid($dateUtil))
        {
            $sinceTime = strtotime($dateSince);
            $utilTime = strtotime($dateUtil);
            if($sinceTime <= $utilTime)
            {
                $isValid = true;
            }
        }

        if($isValid)
        {
            $this->paramArray = array(
                AdReportRunFields::TIME_RANGE => array(
                    AdManageConstants::TIME_RANGE_SINCE => $dateSince,
                    AdManageConstants::TIME_RANGE_UNTIL => $dateUtil,
                ),
            );
        }
        else
        {
            $this->paramArray = array(
                AdReportRunFields::DATE_PRESET => AdDatePresetValues::TODAY,
            );
        }
    }

    private function tranverseInsightCursor($cursor)
    {
        $resultArray = array();

        while ($cursor->valid())
        {
            $currentInsight = $cursor->current();
            $entity = $this->newInsightEntity($currentInsight);
            $resultArray[] = $entity;
            $cursor->next();
        }

        return $resultArray;
    }

    private function newInsightEntity(AdsInsights $insight)
    {
        $entity = new InsightEntity();
        $entity->setAccountId($insight->{AdsInsightsFields::ACCOUNT_ID});
        $entity->setCampaignId($insight->{AdsInsightsFields::CAMPAIGN_ID});
        $entity->setAdSetId($insight->{AdsInsightsFields::ADSET_ID});
        $entity->setAdId($insight->{AdsInsightsFields::AD_ID});
        $entity->setStartDate($insight->{AdsInsightsFields::DATE_START});
        $entity->setStopDate($insight->{AdsInsightsFields::DATE_STOP});

        $entity->setObjective($insight->{AdsInsightsFields::OBJECTIVE});
        $entity->setActionsArray($insight->{AdsInsightsFields::ACTIONS});

        $entity->setSpend($insight->{AdsInsightsFields::SPEND});
        $entity->setImpressions($insight->{AdsInsightsFields::IMPRESSIONS});
        $entity->setReach($insight->{AdsInsightsFields::REACH});

        //$entity->setClicks($insight->{AdsInsightsFields::CLICKS});
        $entity->setClicks($insight->{AdsInsightsFields::INLINE_LINK_CLICKS});

        $entity->setCallToActionClicks($insight->{AdsInsightsFields::CALL_TO_ACTION_CLICKS});

        //$entity->setUniqueClicks($insight->{AdsInsightsFields::UNIQUE_CLICKS});
        $entity->setUniqueClicks($insight->{AdsInsightsFields::UNIQUE_INLINE_LINK_CLICKS});

        //$entity->setCpc($insight->{AdsInsightsFields::CPC});
        $entity->setCpc($insight->{AdsInsightsFields::COST_PER_INLINE_LINK_CLICK});

        $entity->setCpm($insight->{AdsInsightsFields::CPM});
        $entity->setCpp($insight->{AdsInsightsFields::CPP});

        //$entity->setCtr($insight->{AdsInsightsFields::CTR});
        $entity->setCtr($insight->{AdsInsightsFields::INLINE_LINK_CLICK_CTR});

        return $entity;
    }


    private function initAllFields()
    {
        //文档中除了social vedio 所有字段
        $this->allFields = array(
            AdsInsightsFields::ACCOUNT_ID,
            AdsInsightsFields::ACCOUNT_NAME,
            AdsInsightsFields::ACTION_VALUES,
            AdsInsightsFields::ACTIONS,
            AdsInsightsFields::AD_ID,
            AdsInsightsFields::AD_NAME,
            AdsInsightsFields::ADSET_ID,
            AdsInsightsFields::ADSET_NAME,
            //AdsInsightsFields::APP_STORE_CLICKS,
            AdsInsightsFields::BUYING_TYPE,
            AdsInsightsFields::CALL_TO_ACTION_CLICKS,
            AdsInsightsFields::CAMPAIGN_ID,
            AdsInsightsFields::CAMPAIGN_NAME,
            AdsInsightsFields::CANVAS_AVG_VIEW_PERCENT,
            AdsInsightsFields::CANVAS_AVG_VIEW_TIME,
            AdsInsightsFields::CLICKS,
            AdsInsightsFields::COST_PER_10_SEC_VIDEO_VIEW,
            AdsInsightsFields::COST_PER_INLINE_POST_ENGAGEMENT,
            AdsInsightsFields::COST_PER_ACTION_TYPE,
            AdsInsightsFields::COST_PER_TOTAL_ACTION,
            AdsInsightsFields::COST_PER_UNIQUE_CLICK,
            AdsInsightsFields::COST_PER_UNIQUE_ACTION_TYPE,
            AdsInsightsFields::COST_PER_INLINE_LINK_CLICK,
            AdsInsightsFields::COST_PER_UNIQUE_INLINE_LINK_CLICK,
            AdsInsightsFields::CPC,
            AdsInsightsFields::CPM,
            AdsInsightsFields::CTR,
            AdsInsightsFields::CPP,
            AdsInsightsFields::DATE_START,
            AdsInsightsFields::DATE_STOP,
            AdsInsightsFields::FREQUENCY,
            AdsInsightsFields::IMPRESSIONS,
            AdsInsightsFields::INLINE_LINK_CLICKS,
            AdsInsightsFields::INLINE_LINK_CLICK_CTR,
            AdsInsightsFields::INLINE_POST_ENGAGEMENT,
            //AdsInsightsFields::NEWSFEED_AVG_POSITION,
            //AdsInsightsFields::NEWSFEED_CLICKS,
            //AdsInsightsFields::NEWSFEED_IMPRESSIONS,
            AdsInsightsFields::OBJECTIVE,
            AdsInsightsFields::PLACE_PAGE_NAME,
            AdsInsightsFields::REACH,
            AdsInsightsFields::RELEVANCE_SCORE,
            AdsInsightsFields::SPEND,
            AdsInsightsFields::TOTAL_ACTIONS,
            AdsInsightsFields::TOTAL_ACTION_VALUE,
            AdsInsightsFields::TOTAL_UNIQUE_ACTIONS,
            AdsInsightsFields::UNIQUE_ACTIONS,
            AdsInsightsFields::UNIQUE_CTR,
            AdsInsightsFields::UNIQUE_CLICKS,
            //AdsInsightsFields::UNIQUE_IMPRESSIONS, //v2.9 deprecated, same as reach
            AdsInsightsFields::UNIQUE_INLINE_LINK_CLICKS,
            AdsInsightsFields::UNIQUE_INLINE_LINK_CLICK_CTR,
            AdsInsightsFields::UNIQUE_LINK_CLICKS_CTR,
            //AdsInsightsFields::WEBSITE_CLICKS,
            AdsInsightsFields::WEBSITE_CTR,
            AdsInsightsFields::COST_PER_10_SEC_VIDEO_VIEW,
            AdsInsightsFields::VIDEO_10_SEC_WATCHED_ACTIONS,
            //AdsInsightsFields::VIDEO_15_SEC_WATCHED_ACTIONS,
            AdsInsightsFields::VIDEO_30_SEC_WATCHED_ACTIONS,
            //AdsInsightsFields::VIDEO_AVG_PCT_WATCHED_ACTIONS,
            //AdsInsightsFields::VIDEO_AVG_SEC_WATCHED_ACTIONS,
            //AdsInsightsFields::VIDEO_COMPLETE_WATCHED_ACTIONS, //v2.9 deprecated , same as video_30_sec_watched_action
            AdsInsightsFields::VIDEO_P100_WATCHED_ACTIONS,
            AdsInsightsFields::VIDEO_P95_WATCHED_ACTIONS,
            AdsInsightsFields::VIDEO_P75_WATCHED_ACTIONS,
            AdsInsightsFields::VIDEO_P50_WATCHED_ACTIONS,
            AdsInsightsFields::VIDEO_P25_WATCHED_ACTIONS,
            AdsInsightsFields::SOCIAL_CLICKS,
            AdsInsightsFields::SOCIAL_IMPRESSIONS,
            AdsInsightsFields::SOCIAL_REACH,
            AdsInsightsFields::SOCIAL_SPEND,
            AdsInsightsFields::UNIQUE_SOCIAL_CLICKS,
            //AdsInsightsFields::UNIQUE_SOCIAL_IMPRESSIONS, //v2.9 deprecated, same as social_reach

            //v2.9 new field, but some are not invalid
            //AdsInsightsFields::AGE,
            //AdsInsightsFields::CALL_TO_ACTION_ASSET,
            AdsInsightsFields::CANVAS_COMPONENT_AVG_PCT_VIEW,
            //AdsInsightsFields::COUNTRY,
            //AdsInsightsFields::DMA,
            //AdsInsightsFields::FREQUENCY_VALUE,
            //AdsInsightsFields::GENDER,
            //AdsInsightsFields::HOURLY_STATS_AGGREGATED_BY_ADVERTISER_TIME_ZONE,
            //AdsInsightsFields::HOURLY_STATS_AGGREGATED_BY_AUDIENCE_TIME_ZONE,
            //AdsInsightsFields::IMPRESSION_DEVICE,
            //AdsInsightsFields::PLACE_PAGE_ID,
            //AdsInsightsFields::PLACEMENT,
            //AdsInsightsFields::PRODUCT_ID,
            //AdsInsightsFields::REGION,
        );
    }
}