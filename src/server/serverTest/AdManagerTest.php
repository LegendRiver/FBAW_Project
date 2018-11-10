<?php
require_once(__DIR__ . "/../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../includeFile/toolIncludeFile.php");
require_once(__DIR__ . '/BuilderTest.php');

use FacebookAds\Object\Campaign;
use FacebookAds\Object\Values\CampaignObjectiveValues;
use FacebookAds\Object\Values\AdsInsightsBreakdownsValues;
use FacebookAds\Object\Fields\AdReportRunFields;
use FacebookAds\Object\Values\AdStatusValues;

//queryCreativeByIDTest();
//queryAdsetByIdTest();
//adsetDeliveryTest();
//breakdownInsightTest();
//createAdTest();
//getCampaignByIdTest();

//copyAdsetTest();
//getVideoByIdTest();

copyAdsetFacadeTest();

function breakdownInsightTest()
{
    $nodeId = '23842564471700758';
    $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN;
    $param = array(
        AdReportRunFields::BREAKDOWNS => array(
            AdsInsightsBreakdownsValues::COUNTRY,
        ),
    );

    AdManagerFacade::getFlexibleInsight($nodeId, $nodeType, '2017-05-23', '2017-05-26', array(),$param);
}

function copyAdsetFacadeTest()
{
    $adsetId = '23842715117470233';
    $adset = new EliAdSet($adsetId);
    $copyData = $adset->copyAdset();
    print_r($copyData);
}

function copyAdsetTest()
{
    $adsetId = '23842603715990762';
    $adId = '23842603716110762';
    $copyHelper = new CopyFBHelper($adsetId, $adId);
    //$copyHelper->duplicateAdset('test001');
    //$copyHelper->duplicateAdsetByCopy('test002');
    $copyHelper->duplicateAdToAdset($adsetId, '20170202_002', 1, '2de3e7e867c61c530f76abb1ef8abccf');
}

function apiManagerTest()
{
    FBAPIManager::instance();
}

function adsetDeliveryTest()
{
    $id = '6081448315511';
    $adset = new EliAdSet($id);
    $result = $adset->getDeliveryEstimate(array('daily_outcomes_curve', 'estimate_dau'));
    var_dump($result);
}

function pageTest()
{
//    $pageId = '598675606983869';
//    $pageId = '796529220474667';
//    $pageId = '948384375296201';
    $pageId = '407974779537271';
    PageManager::instance()->readPageById($pageId);
}

function inviteAdminPeopleTest()
{
    $bmId = AdManageConstants::DEFAULT_BM_ID;
    $email = 'xufeng@eliads.com';
    BusinessManager::instance()->inviteAdminPeople($bmId, $email);
}
function listBMPeopleTest()
{
    $bmId = AdManageConstants::DEFAULT_BM_ID;
    $userList = BusinessManager::instance()->getBusinessUserList($bmId);
    print_r($userList);
}

function getAccountList()
{
    $bmid = '584936385020414';
    $accountList = AdManagerFacade::getAllAccountsByBMId($bmid);
    print_r($accountList);

}

function deleteVideoTest()
{
    $ids = array(
        '212819185825072',
    );
    foreach($ids as $id)
    {
       $result = AdVideoManager::instance()->deleteVideo($id);
        if(false === $result)
        {
            print_r('Failed to delete video : ' . $id. PHP_EOL);
        }
    }

}

function getAllInsightCampaignTest()
{
    $campaignId = '23842640537580616';
    $insights = AdInsightManager::instance()->getAllFieldInsight($campaignId, '2017-02-01', '2017-02-11', AdManageConstants::INSIGHT_EXPORT_TYPE_AD);
    print_r($insights);

}

function getAllInsightTest()
{
    $accountId = 'act_1202579213151769';
    $adIds = AdManagerFacade::getAdIdsByParentId($accountId);
    if(false === $adIds)
    {
        return false;
    }

    $resultInsight = array();
    foreach($adIds as $adId)
    {
        $adInsight = AdInsightManager::instance()->getAllFieldInsight($adId);
        if(false === $adInsight)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to get the insights by adIds.');
            return false;
        }

        $resultInsight[] = $adInsight;
    }

    CommonHelper::writeObjectInfo($resultInsight, 'insights.txt');
}

function searchStatusTest()
{
    $path = __DIR__ . DIRECTORY_SEPARATOR;
    TargetingSearchCsvUtil::exportStatusInfo(TargetingConstants::P_SEARCH_CLASS_EDUCATION_STATUS, $path, 'ID');
}

function searchDemographicTest()
{
    $path = __DIR__ . DIRECTORY_SEPARATOR;
    $entity = new ExportTargetingParam();
    $entity->setCountryCode('ID');
    //TargetingSearchCsvUtil::exportTargetingInfo(TargetingConstants::SEARCH_CLASS_DEMOGRAPHIC, $path);
    TargetingSearchCsvUtil::exportTargetingInfo(TargetingConstants::SEARCH_CLASS_POLITICS, $path, $entity);
}

function searchBehaviorTest()
{
    $path = __DIR__ . DIRECTORY_SEPARATOR;
    $entity = new ExportTargetingParam();
    $entity->setCountryCode('ID');
    TargetingSearchCsvUtil::exportTargetingInfo(TargetingConstants::SEARCH_CLASS_BEHAVIOR, $path, $entity);
}

function searchInterestTest()
{
    $path = __DIR__ . DIRECTORY_SEPARATOR;
    $entity = new ExportTargetingParam();
    $entity->setCountryCode('ID');
    TargetingSearchCsvUtil::exportTargetingInfo(TargetingConstants::SEARCH_CLASS_INTEREST, $path, $entity);
}

function searchUserDeviceTest()
{
    $path = __DIR__ . DIRECTORY_SEPARATOR;
    $entity = new ExportTargetingParam();
    TargetingSearchCsvUtil::exportTargetingInfo(TargetingConstants::SEARCH_CLASS_USER_DEVICE, $path, $entity);
}


function productCatalogCreateTest()
{
    $result = ProductCatalogManager::createCatalog('584936385020414');
    var_dump($result);
}

function campaignInsightTest()
{
    $campaignId = '6056550689911';
    $dateSince = '2016-08-04';
    $dateUtil = '2016-08-04';
    $result = AdInsightManager::instance()->getCampaignInsight($campaignId, $dateSince, $dateUtil);
    print_r($result);
}

function countrySearchTest()
{
    $optionalParam = array(
        'country_code' => 'US',
        'region_id' => '3843',
    );
    TargetingSearchUtil::searchLocationCode(TargetingConstants::CITY_SEARCH_PARAM, 'a', $optionalParam);
}

function localeSearchTest()
{
    TargetingSearchUtil::searchLocalID(null);
}

function applicationSearchTest()
{
    //$appurl = 'https://play.google.com/store/apps/details?id=com.kongregate.mobile.throwdown.google';
    //$appurl = 'https://play.google.com/store/apps/details?id=com.sagosago.Construction.googleplay';
    //$appurl = 'https://play.google.com/store/apps/details?id=com.bftv.PlayPhone';
    //$appurl = 'https://play.google.com/store/apps/details?id=valsar.dungeonwarfare';
    //$appurl = 'https://play.google.com/store/apps/details?id=me.dreamsky.stickman';
    //$appurl = 'https://play.google.com/store/apps/details?id=com.drpanda.bathtime';
    //$appurl = 'https://play.google.com/store/apps/details?id=com.blizzard.wowcompanion';
    //$appurl = 'https://play.google.com/store/apps/details?id=com.gramgames.toppletap';
    //$appurl = 'https://play.google.com/store/apps/details?id=com.playrix.gardenscapes';
    //$appurl = 'https://play.google.com/store/apps/details?id=com.skonec.choochoohero';
    //$appurl = 'https://itunes.apple.com/cn/app/ke-lu-lu-xing-tan-suo-yu-ding/id961850126?mt=8';
    //$appurl = 'https://itunes.apple.com/cn/app/ri-ri-zhu-daydaycook/id1060973985?mt=8';
    //$appurl = 'https://itunes.apple.com/cn/app/da-zhong-dian-ping-fa-xian/id351091731?mt=8';
    //$appurl = 'https://itunes.apple.com/cn/app/mei-tu-xiu-xiu/id416048305?mt=8';
    //$appurl = 'https://itunes.apple.com/cn/app/tou-piao-poll-for-imessage/id1151990256?mt=8';
    //$appurl = 'https://itunes.apple.com/us/app/agent-walker-secret-journey/id1130218866?mt=12';
    //$appurl = 'https://play.google.com/store/apps/details?id=com.smile.gifmaker&hl=zh-CN';
    //$appurl = 'https://play.google.com/store/apps/details?id=com.smile.gifmaker&hl=ru';
//    $appurl = 'https://play.google.com/store/apps/details?id=com.kwai.mercury&hl=zh-CN';
//    $appurl = 'https://itunes.apple.com/app/apple-store/id440948110?pt=572643&mt=8&ct=';
//    $appurl = 'https://play.google.com/store/apps/details?id=com.leyoogroup.free.solitaire';
    $appurl = 'https://play.google.com/store/apps/details?id=com.fafa.goodbuy';



    $appEntity = TargetingSearchUtil::searchApplicationEntity($appurl);

    CommonHelper::writeObjectInfo($appEntity, 'applicationInfo.txt');
}

function createSlideShowVideoTest()
{
    $videoField = videoBuilderTest();
    $accountId = 'act_584939305020122';
    $videoEntity = AdVideoManager::instance()->createVideo($accountId, $videoField);
    var_dump($videoEntity);
}

function getVideoByAccountTest()
{
    $accountId = 'act_1093146064125710';
    $videos = AdVideoManager::instance()->getVideoByAccount($accountId);
    $title = array(
        'ID',
        'CreateTime',
        'UpdateTime',
        'URL',
    );
    $writeContent = array();
    $writeContent[] = $title;

    foreach($videos as $video)
    {
        $valueArray = array();
        $valueArray[] = $video->getVideoId();
        $valueArray[] = $video->getCreateTime();
        $valueArray[] = $video->getUpdateTime();
        $valueArray[] = $video->getEmbedHtml();

        $writeContent[] = $valueArray;
    }

    FileHelper::saveCsv('videoInfo.csv', $writeContent);
}

function getVideoByIdTest()
{
    $video = '175786229627166';
    $videos = AdVideoManager::instance()->getVideoById($video);
    var_dump($videos);
}

function insightTest()
{
    //$adId = '6056550695511';
    $adId = '6064028744911';
    $entity = AdInsightManager::instance()->getAdInsight($adId);

    print_r($entity);
}


function createAdTest()
{
    $accountId = 'act_783764878472006';

//    $adFieldArray = AdFieldBuilderTest();
    $adBuilder = new AdFieldBuilder();
    $adBuilder->setAdsetId('23842591209350762');
    $adBuilder->setCreativeId('23842591209390762');
    $adBuilder->setName('20170621_dancing');
    $adBuilder->setStatus(AdStatusValues::ACTIVE);
    $entity = AdManager::instance()->createAd($accountId, $adBuilder->getOutputField());
    print_r($entity);
}

function queryAdTest()
{
    $adSetId = '6056550690911';
    $ads = AdManager::instance()->getAdsByAdSet($adSetId);
    print_r($ads);
}

function createCreativeTest()
{
    $accountId = 'act_584939305020122';

    $creativeFieldArray = creativeBuilderTest();
    $entity = AdCreativeManager::instance()->createCreative($accountId, $creativeFieldArray);
    print_r($entity);
}

function queryCreativeByAdSetTest()
{
    $adsetId = '6057955853911';
    $arrayCreative = AdCreativeManager::instance()->getAllCreativeByAdset($adsetId);
    print_r($arrayCreative);
}

function queryCreativeByIDTest()
{
    $creativeId = '23842580572590042';
    $arrayCreative = AdCreativeManager::instance()->getCreativeById($creativeId);
    print_r($arrayCreative);
}

function queryCreativeByAccountTest()
{
    $accountId = 'act_584939305020122';
    $arrayCreative = AdCreativeManager::instance()->getAllCreativeByAccount($accountId);
    print_r($arrayCreative);
}

function deleteImageByIDTest()
{
    $accountId = 'act_584939305020122';
    $imageId = '584939305020122:b1eda9a4c8d9fc04de8e7120cf3e0c38';
    $deleteHash = 'b1eda9a4c8d9fc04de8e7120cf3e0c38';
    AdImageManager::instance()->deleteImageById($imageId, $deleteHash, $accountId);
}

function deleteImageByHashTest()
{
    $accountId = 'act_584939305020122';
    $deleteHash = array('dfeb3cb82ce360b68366b677a8d6e01a');
    $deletEntity = AdImageManager::instance()->deleteImageByHashes($deleteHash, $accountId);
    print_r($deletEntity);
}

function queryImageTest()
{
    $accountId = 'act_584939305020122';
    $imageArray = AdImageManager::instance()->getAllImagesByAccount($accountId);
    CommonHelper::writeObjectInfo($imageArray, 'imageInfo.txt');
//    print_r($imageArray);
}

function createImageTest()
{
    $accountId = 'act_958784954303330';
//    $imagePath = __DIR__ . DIRECTORY_SEPARATOR . 'resources/image_houhan.jpg';
//    $imageData2 = file_get_contents($imagePath);
    $url = 'https://piccdn.accimg.com/ddoriginimg/9604556d348eca1d.png';
    $imageData = FileHelper::getImageByCurl($url);
    $base64Data = base64_encode($imageData);

    $entity = AdImageManager::instance()->createImageByByte($base64Data, $accountId);
    print_r($entity);
}

function queryAdsetByCampaignTest()
{
    $campaignId = '6060237816911';

    $adsets = AdSetManager::instance()->getAdsetsByCampaignId($campaignId);
    print_r($adsets);
}

function queryAdsetByIdTest()
{
    $adsetId = '23842584030950411';

    $adsets = AdSetManager::instance()->getAdsetById($adsetId);
    print_r($adsets);
}

function targetingFieldsEntityTest()
{
    $adsetId = '23842626497380616';
    $adsets = AdSetManager::instance()->getAdsetById($adsetId);
    $targeting = $adsets->getTargeting();

    $entity = new TargetingFieldsEntity();
    $entity->setTargetingInfo($targeting);

    $result = $entity->getTargetingExcludeBehaviorId();
    print_r($result);
}

function updateAdsetBudgetTest()
{
    $adsetId = '6061112165111';
    $adsets = AdSetManager::instance()->updateBudget($adsetId, false, 35000);
    var_dump($adsets);
}

function createAdsetTest()
{
    $accountId = 'act_584939305020122';

//    if(IsAPP)
//    {
//        $campaignId = '6060127844711';
//    }
//    else
//    {
//        $campaignId = '6060127934311';
//    }

    $adsetField = adsetFieldBuilderTest();
    $entity = AdSetManager::instance()->createAdSet($accountId, $adsetField);

    print_r($entity);
}

function deleteCampaignTest()
{
    $campaignId = '23842507095600298';
    $result = AdCampaignManager::instance()->deleteCampaign($campaignId);
    var_dump($result);
}

function switchCampaignStatusTest()
{
    $campaignId = '23842507095600298';
    $status = Campaign::STATUS_PAUSED;
    $result = AdCampaignManager::instance()->switchStatus($campaignId, $status);
    var_dump($result);
}
function switchAdStatusTest()
{
    $adId = '23842575564190228';
    $status = Campaign::STATUS_ACTIVE;
    $result = AdManager::instance()->switchStatus($adId, $status);
    var_dump($result);
}

function getCampaignByAccountTest()
{
    $accountId = 'act_584939305020122';
    $accounts = AdCampaignManager::instance()->getCampaignByAccount($accountId);
    print_r($accounts);
}

function getCampaignByIdTest()
{
    $campaignId = '23842578525280758';
    $entity = AdCampaignManager::instance()->getCampaignById($campaignId);
    var_dump($entity);
}

function createCampaignTest()
{
    $accountId = 'act_584939305020122';
    if(IsAPP)
    {
        $campaignName = 'App Install Campaign 001';
        $objectType = CampaignObjectiveValues::APP_INSTALLS;
        $status = Campaign::STATUS_PAUSED;
    }
    else
    {
        $campaignName = 'Link Click Campaign 001';
        $objectType = CampaignObjectiveValues::LINK_CLICKS;
        $status = Campaign::STATUS_PAUSED;
    }

    //单位是美分
    $spendCap = 10100;

    $builder = new CampaignFieldBuilder();
    $builder->setCampaignName($campaignName);
    $builder->setStatus($status);
    $builder->setObjectType($objectType);
    $builder->setSpendCap($spendCap);

    $campaign = AdCampaignManager::instance()->createCampaign($accountId, $builder->getOutputField());
    if(isset($campaign))
    {
        print_r($campaign);
    }
    else
    {
        echo 'EXCEPTION' . PHP_EOL;
    }

}

function queryAdAccountByIdTest()
{
    $accountId = 'act_1048962291877421';
    $account = AdAccountManager::instance()->getAccountById($accountId);
    print_r($account);
}

function queryAllAdAccountTest()
{
    $account = AdManagerFacade::getCurrentUserAllAccounts();
    print_r($account);
}



function queryAdAccountByUserTest()
{
    $userId = '122819168158751';
    $accounts = AdAccountManager::instance()->getAllAccountByUser($userId);
    print_r($accounts);
    echo '###################' . PHP_EOL;
    $properAccount = AdAccountManager::instance()->getProperAccount($userId);
    print_r($properAccount);
}

function getDefaultUserTest()
{
    $userEntity = AdUserManager::instance()->getUserInfo();
    print_r($userEntity);
}
