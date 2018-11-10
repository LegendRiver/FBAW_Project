<?php
require_once(__DIR__ . "/../includeFile/interfaceInitFile.php");

use FacebookAds\Object\Campaign;
use FacebookAds\Object\AdSet;
use FacebookAds\Object\Ad;
use FacebookAds\Object\Values\CampaignObjectiveValues;
use FacebookAds\Object\Values\AdSetOptimizationGoalValues;
use FacebookAds\Object\Values\AdSetBillingEventValues;
use FacebookAds\Object\Values\AdCreativeCallToActionTypeValues;


define('IsAPP',true);
define('LinkCreativeType', 2);
define('ISIOS', true);
define('ISCAROUSEL', false);



function videoBuilderTest()
{
    $imageUrls = array(
        'https://scontent.xx.fbcdn.net/t45.1600-4/14058639_6058767325311_1244858961_n.png',
        'https://scontent.xx.fbcdn.net/t45.1600-4/14290422_6060129438711_966833205_n.png',
        'https://scontent.xx.fbcdn.net/t45.1600-4/14057712_6060129405911_1078127995_n.png',
    );

    $durationMs = 2000;
    $trasitionMs = 200;
    $name = 'slideShow001';

    $builder = new AdVideoFieldBuilder();
    $builder->setImageUrls($imageUrls);
    $builder->setDurationMs($durationMs);
    $builder->setTransitionMs($trasitionMs);

    //print_r($builder->getOutputField());
    return $builder->getOutputField();
}

function AttachmentBuilderTest()
{
    $attachmentArray = array();

    $link = 'https://itunes.apple.com/app/id1112071930';
    $name = 'Game Image 00';
    $description = 'a ios game 00';
    $callType = AdCreativeCallToActionTypeValues::INSTALL_MOBILE_APP;
    $imageHashArray = array(
        'c79f7eeb7c8018988d55b63ab040fa91',
        'ebe7c151abf8308f5ab9cd741210d025',
        'b5ebf52b437abfe877a8f8db918adc92',
    );

    $attachmentSize = count($imageHashArray);

    for($i = 0; $i < $attachmentSize; ++$i)
    {
        $callBuilder = new CallToActionBuilder();
        $callBuilder->setLinkTitle($name . $i);
        $callBuilder->setLinkUrl($link);
        $callBuilder->setType($callType);

        $attachmentBuilder = new AttachmentFieldBuilder();
        $attachmentBuilder->setLink($link);
        $attachmentBuilder->setImageHash($imageHashArray[$i]);
        $attachmentBuilder->setDescription($description . $i);
        $attachmentBuilder->setCallToActionArray($callBuilder->getOutputField());

        $attachmentArray[] = $attachmentBuilder->getOutputField();
    }

    //print_r($attachmentArray);
    return $attachmentArray;
}


function AdFieldBuilderTest()
{
    $builder = new AdFieldBuilder();
    $status = Ad::STATUS_ACTIVE;
    $builder->setStatus($status);

    if(IsAPP)
    {
        $name = 'app install Ad 006';
        $creativeId = '6061355647711';
        $adSetId = '6060544093911';
    }
    else
    {
        if(LinkCreativeType == 1)
        {
            $name = 'link click Ad 001';
            $creativeId = '6060129938911';
            $adSetId = '6060128949911';
        }
        else if(LinkCreativeType == 2)
        {
            $name = 'link click Ad 022';
            $creativeId = '6061353925911';
            $adSetId = '6060128949911';
        }
        else if(LinkCreativeType == 3)
        {
            $name = 'link click Ad 003';
            $creativeId = '6060130093311';
            $adSetId = '6060164576111';
        }

    }

    $builder->setName($name);
    $builder->setAdsetId($adSetId);
    $builder->setCreativeId($creativeId);

    //print_r($builder->getOutputField());
    return $builder->getOutputField();
}

function creativeBuilderTest()
{
    $builder = new CreativeFieldBuilder();


    if(IsAPP)
    {
        $name = 'app creative 006';
        $pageId = '152556761834179';
        $objectData = linkDataBuilderTest();
        //$objectData = videoDataBuilderTest();

        $builder->setName($name);
        $builder->setPageId($pageId);
        $builder->setObjectDataType(AdManageConstants::STORY_LINK_DATA);
        $builder->setObjectDataArray($objectData);
    }
    else
    {
        if(LinkCreativeType == 3)
        {
            $name = 'link creative 3';
            $body = 'A good game webSite 3.';
            $title = 'Games webSite 3';
            $objectUrl = 'http://www.mofang.com.tw/';
            $imageHash = 'bbb7dd63699b5191701d56ab536240bc';
            $builder->setName($name);
            $builder->setBody($body);
            $builder->setTitle($title);
            $builder->setObjectUrl($objectUrl);
            $builder->setImageHash($imageHash);
        }
        else if(LinkCreativeType ==2)
        {
            $name = 'link creative 22';
            $pageId = '152556761834179';
            $linkData = linkDataBuilderTest();
            $builder->setName($name);
            $builder->setPageId($pageId);
            $builder->setObjectDataArray($linkData);
        }
        else if(LinkCreativeType == 1)
        {
            $name = 'link creative 1';
            $pageId = '152556761834179';
            $linkData = linkDataBuilderTest();
            $builder->setName($name);
            $builder->setPageId($pageId);
            $builder->setObjectDataArray($linkData);
        }

    }

    //print_r($builder->getOutputField());

    return $builder->getOutputField();
}

function videoDataBuilderTest()
{
    $builder = new CreativeVideoDataBuilder();

    $builder->setDescription('A Video Ad.');
    $builder->setVideoId('174340193006648');
    $builder->setImageHash('b5ebf52b437abfe877a8f8db918adc92');

    $callToAction = callToActionBuilderTest();

    $builder->setCallToActionArray($callToAction);

    return $builder->getOutputField();
}

function linkDataBuilderTest()
{
    //1 全有，2 只有一个， 3 无

    $builder = new CreativeLinkDataBuilder();

    if(IsAPP)
    {
        if(ISCAROUSEL)
        {
            $message = 'A good game APP. Try it out.';
            $linkUrl = 'https://itunes.apple.com/app/id1112071930';
            $attachments = AttachmentBuilderTest();

            $builder->setMessage($message);
            $builder->setLinkUrl($linkUrl);
            $builder->setAttachmentsArray($attachments);
        }
        else
        {
            $message = 'A good game APP. Try it out.';
            $linkUrl = 'https://itunes.apple.com/app/id1112071930';
            $imageHash = '48f548ec3d398456419df45d40b40ac9';
            $callArray = callToActionBuilderTest();
            $builder->setImageHash($imageHash);
            $builder->setMessage($message);
            $builder->setLinkUrl($linkUrl);
            $builder->setCallToActionArray($callArray);
        }

    }
    else
    {
        if(LinkCreativeType == 3)
        {
            return array();
        }

        $message = 'A good game webSite.';
        $linkUrl = 'http://www.mofang.com.tw/';
        $imageHash = 'bbb7dd63699b5191701d56ab536240bc';
        $builder->setImageHash($imageHash);
        $builder->setMessage($message);
        $builder->setLinkUrl($linkUrl);
        if(LinkCreativeType == 1)
        {
            $callArray = callToActionBuilderTest();
            $builder->setCallToActionArray($callArray);
        }
        else if(LinkCreativeType ==2)
        {
            $linkTitle = 'Games Website 2';
            $builder->setCaption($linkTitle);
        }
    }

    //print_r($builder->getOutputField());

    return $builder->getOutputField();
}

function callToActionBuilderTest()
{
    if(IsAPP)
    {
        $linkUrl = 'https://itunes.apple.com/app/id1112071930';
        $linkTitle = 'APP Store DownLoad';
        $callType = AdCreativeCallToActionTypeValues::INSTALL_MOBILE_APP;
    }
    else
    {
        $linkUrl = 'http://www.mofang.com.tw/';
        $linkTitle = 'Games Website';
        $callType = AdCreativeCallToActionTypeValues::OPEN_LINK;
    }

    $builder = new CallToActionBuilder();
    $builder->setLinkTitle($linkTitle);
    $builder->setLinkUrl($linkUrl);
    $builder->setType($callType);

    //print_r($builder->getOutputField());

    return $builder->getOutputField();
}

function adsetFieldBuilderTest()
{
    if(IsAPP)
    {
        $name = 'app install adset 004';
        $campaignId = '6060127844711';
    }
    else
    {
        $name = 'link click adset 003';
        $campaignId = '6060127934311';
    }

    $status = AdSet::STATUS_PAUSED;
    $targeting = targetingBuilderTest();
    $schedule = scheduleBuilderTest();
    $bid = bidBuilderTest();

    $builder = new AdSetFieldBuilder();
    $builder->setName($name);
    $builder->setCampaignId($campaignId);
    $builder->setStatus($status);
    $builder->setTargetingArray($targeting);
    $builder->setScheduleArray($schedule);
    $builder->setBidArray($bid);

    if(IsAPP)
    {
        $appObject = appObjectBuilderTest();
        $builder->setObjectiveArray($appObject);
    }


    //print_r($builder->getOutputField());
    return $builder->getOutputField();

}

function appObjectBuilderTest()
{
    $appurl = 'http://play.google.com/store/apps/details?id=com.surpax.ledflashlight.panel';
    $appEntity = TargetingSearchUtil::searchApplicationEntity($appurl);

    $builder = new AppInstallObjectBuilder();
    $builder->setApplicationId($appEntity->getId());
    $builder->setApplicationStoreUrl($appEntity->getStoreUrl());

    //print_r($builder->getOutputField());
    return $builder->getOutputField();
}

function bidBuilderTest()
{
    if(IsAPP)
    {
        $optimization = AdSetOptimizationGoalValues::APP_INSTALLS;
    }
    else
    {
        $optimization = AdSetOptimizationGoalValues::LINK_CLICKS;
    }

    $bidAmount = 500;
    $billEvent = AdSetBillingEventValues::IMPRESSIONS;

    $builder = new BidBuilder();
    $builder->setBidAmount($bidAmount);
    $builder->setBillEvent($billEvent);
    $builder->setOptimizationGoal($optimization);

    //var_dump($builder->getOutputField());
    return $builder->getOutputField();
}

function scheduleBuilderTest()
{
    $budgetType = AdManageConstants::ADSET_BUDGET_TYPE_SCHEDULE;
    $budgetAmount = 10000;
    $startTime = (new DateTime("2016-12-14 14:52:10"))->format(\DateTime::ISO8601);
    $endTime = (new DateTime("2016-12-18 14:52:10"))->format(\DateTime::ISO8601);

    $builder = new ScheduleBuilder();

    $builder->setBudgetType($budgetType);
    $builder->setBudgetAmount($budgetAmount);
    $builder->setStartTime($startTime);
    $builder->setEndTime($endTime);

    //print_r($builder->getOutputField());
    return $builder->getOutputField();
}

function targetingBuilderTest()
{
    $basic = basicTargetingBuilderTest();
    $location = locationBuilderTest();
    $flexible = flexibleBuilderTest();

    $builder = new TargetingBuilder();
    $builder->setBasicArray($basic);
    $builder->setLocationArray($location);
    $builder->setFlexibleArray($flexible);

    if(LinkCreativeType != 3)
    {
        $osPlacement = osPlacementBuilderTest();
        $builder->setOsPlacementArray($osPlacement);
    }

    //print_r($builder->getOutputField());

    return $builder->getOutputField();
}

function flexibleBuilderTest()
{
    $interestDes = 'basketball';
    $resultArray = TargetingSearchUtil::searchInterestId($interestDes);

    $builder = new FlexibleTargetingBuilder();
    $builder->setInterestArray($resultArray);

    //print_r($builder->getOutputField());

    return $builder->getOutputField();
}


function basicTargetingBuilderTest()
{
    $builder = new BasicTargetingBuilder();
    $localeArray = array(6);
    $builder->setLocaleArray($localeArray);
    //print_r($builder->getOutputField());

    return $builder->getOutputField();
}

function osPlacementBuilderTest()
{
    $builder = new OsPlacementTargetingBuilder();
    if(ISIOS)
    {
        $builder->setUserOSArray(TargetingConstants::USER_OS_IOS);
    }
    else
    {
        $builder->setUserOSArray(TargetingConstants::USER_OS_ANDROID);
    }

    if(IsAPP)
    {
        $builder->setDevicePlatFormArray(array(TargetingConstants::DEVICE_PLATFORM_MOBILE));
    }
    else
    {
        $builder->setDevicePlatFormArray(array(TargetingConstants::DEVICE_PLATFORM_MOBILE, TargetingConstants::DEVICE_PLATFORM_DESKTOP));
    }

    //print_r($builder->getOutputField());

    return $builder->getOutputField();
}

function campaignBuilderTest()
{
    $campaignName = 'Link Click Campaign 001';
    $objectType = CampaignObjectiveValues::LINK_CLICKS;
    $status = Campaign::STATUS_ACTIVE;
    $spendCap = 10100;

    $builder = new CampaignFieldBuilder();
    $builder->setCampaignName($campaignName);
    $builder->setStatus($status);
    $builder->setObjectType($objectType);
    $builder->setSpendCap($spendCap);

    print_r($builder->getOutputField());
}

function locationBuilderTest()
{
    $location = new LocationTargetingBuilder();
    $location->addCountryCode("US");
    $location->addCountryCode(array("EN"));
    $location->removeCountryCode("EN");
    $field = $location->getOutputField();
    //print_r($field);
    return $field;
}