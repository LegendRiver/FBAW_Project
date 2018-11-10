<?php
require_once(__DIR__ . '/CheckTest.php');

createAdFacadeTest();

function getCreativeByAdIdTest()
{
    //carousel video
//  $adId = '23842692701520616';
    //single video
//    $adId = '23842692704490616';
    $adId = '23842702505590616';
    //carousel image
    //$adId = '23842547111470513';
    $creativeEntity = AdManagerFacade::getCreativeByAdId($adId);
    print_r($creativeEntity);
}

function getAdByIdTest()
{
    $adId = '23842584030940411';
    $adEntity = AdManagerFacade::getAdById($adId);
    print_r($adEntity);
}

function createVideoTest()
{
    $accountId = 'act_584939305020122';
    $sourcePath = EL_SERVER_PATH . 'serverTest/resources/320172866-1.mp4';
    $videoParam = new AdVideoParam();
    $videoParam->setVideoType(AdManageConstants::VIDEO_TYPE_COMMON);
    $videoParam->setSource($sourcePath);
    $videoParam->setAccountId($accountId);

    $videoEntity = AdManagerFacade::createAdVideo($videoParam);
    print_r($videoEntity);
}

function getAdIdsByAccount()
{
    $accountid = 'act_783764878472006';
    $ids = AdManagerFacade::getAdIdsByParentId($accountid, AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT, true);
    print_r($ids);
}

function bidEstimateBuilderTest()
{
    $param = mockAdsetParam();

    $estimateResult = BidEstimateBuilder::estimateBid($param);
    //CommonHelper::writeObjectInfo($estimateResult, 'estimateTest.txt');

    print_r($param);
}

function reachEstimateTest()
{
    $param = mockAdsetParam();
    $result = AdManagerFacade::getReachEstimateByAccount($param);
    print_r($result);
}

function getAllAdInsightOfAccount()
{
    $accountId = 'act_1202579213151769';

    $insights = AdManagerFacade::getAllAdInsightByAccount($accountId);

    CommonHelper::writeObjectInfo($insights, 'insights.txt');
}

function createAdFacadeTest()
{
    $param = mockAdParam();
    $adEntity = AdManagerFacade::createMediaAd($param);
    print_r($adEntity);
}

function createCreativeFacadeTest()
{
    $param = mockCreativeParam();
    $creative = AdManagerFacade::createCreative($param);
    print_r($creative);
}

function createImageFacadeTest()
{
    $imagePath = EL_SERVER_PATH . 'serverTest/resources/image_heiyang_m.jpg';
    $accountId = 'act_584939305020122';
    $image = AdManagerFacade::createImage($imagePath, $accountId);
    print_r($image);
}

function createAppAdSetFacadeTest()
{
    $param = mockAdsetParam();
    $adsetEntity = AdManagerFacade::createMediaAdSet($param);
    print_r($adsetEntity);
}

function createAppCampaignFacadeTest()
{
    $param = mockCampaignParam();
    $campaignEntity = AdManagerFacade::createMediaCampaign($param);
    print_r($campaignEntity);
}



