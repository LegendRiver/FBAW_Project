<?php
require_once(__DIR__ . "/../includeFile/interfaceInitFile.php");


//DBManager::instance();
selectProductInfoTest();

function selectAccountInfoTest()
{
    $dbManager = new AccountDBManager();
    $dbManager->selectAccountByProductId(4);
}

function selectProductInfoTest()
{
    $dbManager = new ProductDBManager();
//    $dbManager->selectAllProduct();
    $dbManager->selectValidProduct();
}

function videoDBAddTest()
{
    $videoEntity = new PublisherVideoEntity();

    $videoEntity->setUuid('v0001');
    $videoEntity->setVideoId('fv0001');
    $videoEntity->setVideoType(AdManageConstants::VIDEO_TYPE_SLIDESHOW);
    $videoEntity->setDurationTime(1000);
    $videoEntity->setTransitionTime(200);

    $dbManager = new PublisherVideoDB();
    $dbManager->addVideoRecord($videoEntity);
}

function campaignReportAddTest()
{
    $campaignReportEntity = new CampaignReportEntity();

    $campaignReportEntity->setUuid('camR0002');
    $campaignReportEntity->setCampaignUid('c12112');
    $campaignReportEntity->setCampaignId('fc0001');
    $campaignReportEntity->setStartTime(date('Y-m-d H:i:s'));
    $campaignReportEntity->setEndTime(date('Y-m-d H:i:s'));
    $campaignReportEntity->setRequestTime(date('Y-m-d H:i:s'));
    $campaignReportEntity->setResultValue(45);
    $campaignReportEntity->setResultType('install');
    $campaignReportEntity->setReach(3456);
    $campaignReportEntity->setCostPerResult(3.67);
    $campaignReportEntity->setSpend(217);
    $campaignReportEntity->setImpression(16746);
    $campaignReportEntity->setClick(246);
    $campaignReportEntity->setCpc(0.0975);
    $campaignReportEntity->setCtr(2.32);
    $campaignReportEntity->setResultRate(1.36);
    $campaignReportEntity->setCpm(1.4079422382671);
    $campaignReportEntity->setCpi(1.4076422382671);
    $campaignReportEntity->setCvr(1.4078422382671);

    $dbManager = new CampaignReportDB();

    $result = $dbManager->addCampaignReportRecord($campaignReportEntity);
    print_r($result);

}

function adReportAddTest()
{
    $adReportEntity = new AdReportEntity();

    $adReportEntity->setUuid('adR0002');
    $adReportEntity->setCampaignUid('c12112');
    $adReportEntity->setAdsetUid('as23232');
    $adReportEntity->setAdUid('ad242323');
    $adReportEntity->setCampaignId('fc0001');
    $adReportEntity->setAdsetId('fas00001');
    $adReportEntity->setAdId('fad000001');
    $adReportEntity->setStartTime(date('Y-m-d H:i:s'));
    $adReportEntity->setEndTime(date('Y-m-d H:i:s'));
    $adReportEntity->setRequestTime(date('Y-m-d H:i:s'));
    $adReportEntity->setResultValue(45);
    $adReportEntity->setResultType('install');
    $adReportEntity->setReach(3456);
    $adReportEntity->setCostPerResult(3.67);
    $adReportEntity->setSpend(217);
    $adReportEntity->setImpression(16746);
    $adReportEntity->setClick(246);
    $adReportEntity->setCpc(0.0975);
    $adReportEntity->setCtr(2.32);
    $adReportEntity->setResultRate(1.36);
    $adReportEntity->setCpm(1.4079422382671);
    $adReportEntity->setCpi(1.4076422382671);
    $adReportEntity->setCvr(1.4078422382671);

    $dbManager = new AdReportDB();

    $result = $dbManager->addAdReportRecord($adReportEntity);
    print_r($result);
}

function publisherAUpdateStatusTest()
{
    $adId = 'pad0001';
    $status = 2;

    $dbManager = new PublisherAdDB();

    $result = $dbManager->updateStatus($status, $adId);

    var_dump($result);
}

function publisherAdsetUpdateStatusTest()
{
    $adsetId = 'padset0001';
    $status = 2;

    $dbManager = new PublisherAdsetDB();

    $result = $dbManager->updateStatus($status, $adsetId);

    var_dump($result);
}

function getCampaignByAdsetTest()
{
    $adsetId = 'padset0001';

    $dbManager = new PublisherCampaignDB();
    $resultArray = $dbManager->selectCampaignInfoByAdsetId($adsetId);

    print_r($resultArray);
}

function publisherImageAddTest()
{
    $imageEntity = new PublisherImageEntity();

    $imageEntity->setUuid('image0002');
    $imageEntity->setImageId('pim0002-0002');
    $imageEntity->setAccountId('act_0001');
    $imageEntity->setImageHash('imh0002');
    $imageEntity->setImageUrl('http://imageUrl.com');
    $imageEntity->setLocalPath('/opt/dd/im2.png');
    $imageEntity->setImageName('Image Name');
    $imageEntity->setHeight(600);
    $imageEntity->setWidth(600);
    $imageEntity->setOriginalUrl('http://original.com');

    $dbManager = new PublisherImageDB();
    $dbManager->addImageRecord($imageEntity);
}

function publisherAdAddTest()
{
    $adEntity = new PublisherAdEntity();

    $adEntity->setUuid('ad0005');
    $adEntity->setAdsetUid('adset002');
    $adEntity->setAdId('23842511511460794');
    $adEntity->setCreativeUid('pcr0001');
    $adEntity->setPublisherType(AdManageConstants::PUBLISHER_TYPE_GOOGLE);
    $adEntity->setStatus(0);
    $adEntity->setName('AD Name');
    $adEntity->setCreateTime(date('Y-m-d H:i:s'));
    $adEntity->setModifyTime(date('Y-m-d H:i:s'));

    $dbManager = new PublisherAdDB();
    $dbManager->addAdRecord($adEntity);
}

function publisherCreativeAddTest()
{
    $creativeEntity = new PublisherCreativeEntity();

    $creativeEntity->setUuid('cr0001');
    $creativeEntity->setCreativeId('pcr0001');
    $creativeEntity->setAccountId('act_0001');
    $creativeEntity->setCreativeName('Creative Name');
    $creativeEntity->setAdFormat(0);
    $creativeEntity->setLinkType(0);
    $creativeEntity->setTitle('Creative Title');
    $creativeEntity->setDescription('Creative Description');
    $creativeEntity->setCaption('Creative Caption');
    $creativeEntity->setMessage('Creative Message');
    $creativeEntity->setPageId('page0001');
    $creativeEntity->setImageHash('imh0001');
    $creativeEntity->setCreateTime(date('Y-m-d H:i:s'));
    $creativeEntity->setModifyTime(date('Y-m-d H:i:s'));
    $creativeEntity->setUrl('www.creative.com');
    $creativeEntity->setCallToActionType(0);
    $creativeEntity->setImageUids('sssss;ddddd;eeee');
    $creativeEntity->setCarouselNames('Carousel Name1; name2;name3');
    $creativeEntity->setCarouselDescs('Carousel Descs1; descs2; descs3');
    $creativeEntity->setSlideShowDurationTime(1000);
    $creativeEntity->setSlideShowTransitionTime(200);

    $dbManager = new PublisherCreativeDB();
    $dbManager->addCreativeRecord($creativeEntity);
}

function publisherAdsetAddTest()
{
    $adSetEntity = new PublisherAdSetEntity();

    $uid = 'adset002';
    $adSetEntity->setUid($uid);

    $campaignUid = 'pc0001';
    $adSetEntity->setCampaignUid($campaignUid);

    $adsetId = 'padset0001';
    $adSetEntity->setAdsetId($adsetId);

    $name = 'Adset';
    $adSetEntity->setName($name);

    $adSetEntity->setPublisherType(AdManageConstants::PUBLISHER_TYPE_GOOGLE);

    $budget = 20000;
    $adSetEntity->setBudget($budget);

    $scheduleStart = date('Y-m-d');
    $adSetEntity->setScheduleStart($scheduleStart);

    $scheduleEnd = date('Y-m-d');
    $adSetEntity->setScheduleEnd($scheduleEnd);

    $timeStart = 0;
    $adSetEntity->setTimeStart($timeStart);

    $timeEnd = 1440;
    $adSetEntity->setTimeEnd($timeEnd);

    //targeting
    $audience = 'da;sds';
    $adSetEntity->setAudience($audience);

    $bid = 230;
    $adSetEntity->setBid($bid);

    $bidType = 0;
    $adSetEntity->setBidType($bidType);

    $chargeType = 0;
    $adSetEntity->setChargeType($chargeType);

    $deliveryType = 0;
    $adSetEntity->setDeliveryType($deliveryType);

    $budgetType = 0;
    $adSetEntity->setBudgetType($budgetType);

    $status = 0;
    $adSetEntity->setStatus($status);

    $keyWord = '';
    $adSetEntity->setKeyWord($keyWord);

    $matchType = 0;
    $adSetEntity->setMatchType($matchType);

    $createTime = date('Y-m-d H:i:s');
    $adSetEntity->setCreateTime($createTime);

    $modifyTime =date('Y-m-d H:i:s');
    $adSetEntity->setModifyTime($modifyTime);

    $dbManager = new PublisherAdsetDB();
    $dbManager->addAdsetRecord($adSetEntity);
}

function publisherCampaignSelectTest()
{
    $campaignId = 'fc0001';

//    $selectField = array(
//        DBConstants::PUBLISHER_CAMPAIGN_ACCOUNTID,
//        DBConstants::PUBLISHER_CAMPAIGN_TYPE,
//    );
    $dbManager = new PublisherCampaignDB();
//    $result = $dbManager->selectByFBCampaignId($campaignId, $selectField);
    $result = $dbManager->selectByFBCampaignId($campaignId);

    var_dump($result);
}

function publisherCampaignUpdateTest()
{
    $status = 2;
    $campaignId = 'fc0001';

    $dbManager = new PublisherCampaignDB();
    $result = $dbManager->updateStatus($status, $campaignId);

    var_dump($result);
}

function buildSelectSqlTest()
{
    $tableName = 'T_TABLE_TEST';
    $fieldArray = array('F_001','F_002', 'F_003');
    $whereArray = array('W_001', 'W_002');

    $result = DBHelper::buildSelectSql($tableName, $fieldArray, $whereArray);

    echo $result . PHP_EOL;
}

function buildUpdateSqlTest()
{
    $tableName = 'T_TABLE_TEST';
    $fieldArray = array('F_001','F_002', 'F_003');
    $whereArray = array('W_001', 'W_002');

    $result = DBHelper::buildUpdateSql($tableName, $fieldArray, $whereArray);

    echo $result . PHP_EOL;
    var_dump(empty($result)) ;
}

function publisherCampaignDBAddTest()
{
    $publishCamEntity = new PublisherCampaignEntity();
    $publishCamEntity->setUid('pc0002');
    $publishCamEntity->setName('publisherCampaign0001');
    $publishCamEntity->setCampaignId('fc0001');
    $publishCamEntity->setConfigId('f0001');
    $publishCamEntity->setAccountId('act0001');
    $publishCamEntity->setCampaignType(0);
    $publishCamEntity->setPublisherType(1);
    $publishCamEntity->setStatus(0);
    $publishCamEntity->setSpendCap(2222.34);
    $publishCamEntity->setCreateTime(date('Y-m-d H:i:s'));
    $publishCamEntity->setModifyTime(date('Y-m-d H:i:s'));

    $dbManager = new PublisherCampaignDB();
    $dbManager->addPublisherCamRecord($publishCamEntity);
}

function camConfigDbAddTest()
{
    $configEntity = new CamConfigEntity();
    $configEntity->setConfigId('f0002');
    $configEntity->setCampaignId('c0001');
    $configEntity->setPublisherId('p0001');
    $configEntity->setBudget(50000);
    $configEntity->setSpent(0);
    $configEntity->setStatus(0);
    $configEntity->setCreateTime(date('Y-m-d H:i:s'));
    $configEntity->setModifyTime(date('Y-m-d H:i:s'));

    $dbManager = new ELICamConfigDB();
    $result = $dbManager->addCamConfigRecord($configEntity);

    print_r($result);
}


function eliCampaignDbAddTest()
{
    $campaignEntity = new EliCampaignEntity();
    $campaignEntity->setId('c0001');
    $campaignEntity->setAccountId('a0001');
    $campaignEntity->setName('campaign001');
    $campaignEntity->setCampaignType(0);
    $campaignEntity->setUrl('https://itunes.apple.com/app/id1112071930');
    $campaignEntity->setTitle('GAME');
    $campaignEntity->setDescription('Try out it.');
    $campaignEntity->setImageList('');
    $campaignEntity->setScheduleStart(date('Y-m-d H:i:s'));
    $campaignEntity->setScheduleEnd(date('Y-m-d H:i:s'));
    $campaignEntity->setTimeStart(date('Y-m-d H:i:s'));
    $campaignEntity->setTimeEnd(date('Y-m-d H:i:s'));
    $campaignEntity->setAudience('');
    $campaignEntity->setStatus(0);
    $campaignEntity->setBudget(200000);
    $campaignEntity->setSpend(34);
    $campaignEntity->setDeliveryType(1);
    $campaignEntity->setKeyWord('');
    $campaignEntity->setMatchType(0);
    $campaignEntity->setCreateTime(date('Y-m-d H:i:s'));
    $campaignEntity->setModifyTime(date('Y-m-d H:i:s'));


    $configEntity = new CamConfigEntity();
    $configEntity->setConfigId('f0001');
    $configEntity->setCampaignId('c0001');
    $configEntity->setPublisherId('p0001');
    $configEntity->setBudget(20000);
    $configEntity->setSpent(0);
    $configEntity->setStatus(0);
    $configEntity->setCreateTime(date('Y-m-d H:i:s'));
    $configEntity->setModifyTime(date('Y-m-d H:i:s'));

    $configArray = array();
    $configArray[] = $configEntity;

    $campaignEntity->setCamConfigArray($configArray);

    $campaignDb = new ELICampaignDB();
    $result = $campaignDb->addCampaignRecord($campaignEntity);

    print_r($result);
}
