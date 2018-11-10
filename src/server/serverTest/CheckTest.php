<?php
require_once(__DIR__ . "/../includeFile/interfaceInitFile.php");

//campaignCheckTest();

function mockCampaignParam()
{
    $campaignParam = new CampaignCreateParam();

    $campaignParam->setName('app test 001');
    $campaignParam->setAdAccountId('act_1202809339795423');
    $campaignParam->setCampaignType(AdManageConstants::CAMPAIGN_PARAM_TYPE_APP);
    //$campaignParam->setProductCatalogId('866482600118257');
    $campaignParam->setStatus(AdManageConstants::PARAM_STATUS_PAUSED);
    //$campaignParam->setSpendCap('10100');

    return $campaignParam;
}

function mockAdsetParam()
{
    $adsetParam = new AdsetCreateParam();

    $adsetParam->setName('app AdSet 013');
    //$adsetParam->setAccountId('act_1093146064125710');
    $adsetParam->setAccountId('act_584939305020122');
    $adsetParam->setCampaignId('6060127844711');
    $adsetParam->setStatus(AdManageConstants::PARAM_STATUS_ACTIVE);
    $adsetParam->setCampaignType(AdManageConstants::CAMPAIGN_PARAM_TYPE_APP);
    //$adsetParam->setLinkAdType(AdManageConstants::LINK_AD_TYPE_CALLTOACTION);

    $adsetParam->setGenderArray(array(TargetingConstants::GENDER_MALE,));
    $adsetParam->setAgeMax(34);
    $adsetParam->setAgeMin(13);
    $adsetParam->setLocaleArray(array(6,));
    $adsetParam->setCountryArray(array('ID', 'JP'));
    //$adsetParam->setInterestDesc('mobile game');
    $adsetParam->setUserOsArray(array(TargetingConstants::USER_OS_IOS,));
    $adsetParam->setDevicePlatformArray(array(TargetingConstants::DEVICE_PLATFORM_MOBILE));
    $adsetParam->setWirelessCarrier(array(TargetingConstants::WIRELESS_CARRIER));
    $adsetParam->setExcludeInterestIds(array('6003020834693'));
    //$adsetParam->setRelationShipStatus(array(1));
    //$adsetParam->setEducationStatus(array(2));
    //$adsetParam->setPoliticIds(array('6015759997983'));
    //adsetParam->setFamilyStatusIds(array('6002714398372'));
    //$adsetParam->setHouseholdCompositionIds(array('6024956936183'));
    //$adsetParam->setEthnicIds(array('6003133212372'));
    //$adsetParam->setGenerationIds(array('6002714401172'));
    //$adsetParam->setLifeEventIds(array('6002714398172'));
    //$adsetParam->setIndustryIds(array('6009003307783'));
    //$adsetParam->setBehaviorIds(array('6002714895372'));
    //$adsetParam->setUserDeviceArray(array('iPhone'));
    //$adsetParam->setExcludeDeviceArray(array('iPod'));
    //$adsetParam->setCustomAudienceIdArray(array('6067801989111'));
    //$adsetParam->setConnectionIdArray(array('1839553039611528'));

    $adsetParam->setBudgetType(AdManageConstants::ADSET_BUDGET_TYPE_SCHEDULE);
    $adsetParam->setBudgetAmount(20000);
    $adsetParam->setStartTime('2017-12-23 08:00:00');
    $adsetParam->setEndTime('2017-12-26 08:00:00');
    $adsetParam->setScheduleType(AdManageConstants::SCHEDULE_TYPE_SCHEDULE);
    $adsetParam->setDayArray(array(0,1,5,6));
    $adsetParam->setStartMin(480);
    $adsetParam->setEndMin(1260);

    $adsetParam->setOptimization(AdManageConstants::ADSET_OPTIMIZATION_APPINSTALL);
    $adsetParam->setBidAmount(2500);
    $adsetParam->setBillEvent(AdManageConstants::ADSET_BILL_EVENT_IMPRESSIONS);
    $adsetParam->setDeliveryType(AdManageConstants::DELIVERY_TYPE_ACCELERATE);

    $adsetParam->setApplicationUrl('https://itunes.apple.com/app/id1112071930');
    //$adsetParam->setPromoteProductSetId('260803744305847');

    return $adsetParam;
}

function mockCreativeParam()
{
    $param = new AdCreativeParam();

    //$param->setAccountId('act_584939305020122');
    $param->setAccountId('act_1093146064125710');
    $param->setCampaignType(AdManageConstants::CAMPAIGN_PARAM_TYPE_WEBSITE);
    //$param->setProductSetId('260803744305847');
    $param->setLinkAdType(AdManageConstants::LINK_AD_TYPE_LINKDATA);
    $param->setAdFormat(AdManageConstants::AD_FORMAT_VIDEO);

    $param->setName('video Creative 001');
    //$param->setTitle('NAME {{product.name | titleize}}');
    $param->setTitle('video test Title');
    //$param->setMessage('Product sales. Try it out.');
    $param->setMessage('message');
    $param->setObjectUrl('http://www.mofang.com.tw/');
    $param->setPageId('152556761834179');
    //$param->setLinkDataCaption('Caption {{product.price}}');
    //$param->setLinkDataDescription('Description {{product.price}}');
    $param->setLinkDataDescription('description');
    //$param->setImageHash('dfeb3cb82ce360b68366b677a8d6e01a');
    $param->setImageHash('bbb7dd63699b5191701d56ab536240bc');

    $param->setVideoId('212819185825072');

//    $nameArray = array(
//        'Game Website 001',
//        'Game Website 002',
//        'Game Website 003',
//    );
//    $param->setCarouselNameArray($nameArray);
//    $imageHashArray = array(
//        'c79f7eeb7c8018988d55b63ab040fa91',
//        'ebe7c151abf8308f5ab9cd741210d025',
//        'b5ebf52b437abfe877a8f8db918adc92',
//    );
//    $param->setCarouselImageHashArray($imageHashArray);

    $param->setCallToActionType(AdManageConstants::CREATIVE_CALLTOACTION_OPEN_LINK);

    return $param;
}

function mockAdParam()
{
    $param = new AdCreateParam();

    $param->setName('Video Ad 001');
    $param->setStatus(AdManageConstants::PARAM_STATUS_ACTIVE);
    $param->setCreativeId('23842603716020762');
    $param->setAdsetId('23842603715990762');
    $param->setAccountId('act_783764878472006');

    return $param;
}














