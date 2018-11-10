<?php
require_once(__DIR__ . "/../includeFile/interfaceInitFile.php");

pregReplaceTest();

function pregReplaceTest()
{
    $currentTime = date('Ymd_Hi');

    $objectString = 'SA_MF_20170606_1024_ChatApp_MB_Oi_Cim_girlsAndFamily';

    $pattern1 = '/(\d{6,8}_\d{3,4})/';

    $result = preg_replace($pattern1, $currentTime, $objectString);
    print_r($result);

    $pos = strrpos($result, '_');
    if(false === $pos)
    {
        $pos = strlen($result);
    }

    echo PHP_EOL;
    print_r(substr($result,0, strlen($result)));
}

function mailTest()
{
    $toAddressList = array(
        'xufeng@eliads.com',
    );
    $subject='标题';
    $message = "您好：<br>  hello world <br> 谢谢！";

    print_r($message);

    $result = MailerHelper::instance()->sendMail($toAddressList, $subject, $message);

    if($result)
    {
        print_r('success');
    }
    else
    {
        print_r('failed');
    }
}


function dateListTest()
{
    $dateList = CommonHelper::getDateListBetweenDate('2017-02-23', '2017-03-05');
    print_r($dateList);
}

function readImageTest()
{
    $path = __DIR__ . DIRECTORY_SEPARATOR . 'resources/image_heiyang_m.jpg';
    $entity = FileHelper::readLocalImage($path);
    print_r($entity);
}

function yesterdayDateTest()
{
    print_r(CommonHelper::getYesterdayDate());
}

function removeDirTest()
{
    $path = EL_SERVER_PATH . 'serverTest/strategyBackup';
    $result = FileHelper::removeDir($path);
    var_dump($result);
}

function serverConfigTest()
{
    $imageDir = ConfigManager::instance()->getConfigValue(BasicConstants::CONFIG_DOWNLOAD_IMAGE_DIR);
    print_r($imageDir);

    $outputDir = ConfigManager::instance()->getConfigValue(BasicConstants::CONFIG_STRATEGY_OUTPUT_DIR);
    print_r($outputDir);

    $inputDir = ConfigManager::instance()->getConfigValue(BasicConstants::CONFIG_STRATEGY_INPUT_PARAM_DIR);
    print_r($inputDir);

}

function generateFrontInterfaceJson()
{
    $eliCampaignDb = new ELICampaignDB();
    $campaignInfos = $eliCampaignDb->selectById('c0001');
    $campaignInfo = $campaignInfos[0];

    $configDB = new ELICamConfigDB();
    $configInfos = $configDB->selectByCampaignId('c0001');

    $campaignInfo['CONFIGS'] = $configInfos;

    FileHelper::writeJsonFile($campaignInfo, 'eliCampaign.json');

}

function reportEnumTest()
{
    $constants = ReportFieldManager::instance()->getConstants();
    foreach($constants as $constant)
    {
        print_r($constant . PHP_EOL);
    }

}

function getWeekDaysTest()
{
    $startDate = new DateTime('2016-10-01 12:03:00');
    $endDate = new DateTime('2016-10-04 12:03:00');
    $days = CommonHelper::getWeekdaysBetweenDate($startDate, $endDate);

    print_r($days);
}

function pathManagerTest()
{
    echo EL_FBINTERFACE_PATH . PHP_EOL;
    echo EL_LIB_PATH . PHP_EOL;
    echo EL_SRC_PATH . PHP_EOL;
    echo EL_SERVER_PATH . PHP_EOL;
    echo EL_PROJECT_PATH . PHP_EOL;
}

function configDownloadPathTest()
{
    $path = ConfigManager::instance()->getConfigValue(ImageDownloadPath);
    echo $path;
}


function loggerTest()
{
    $message = 'Hello world!!';
    ServerLogger::instance()->writeLog(Error, $message);
}

function downloadImageTest()
{
    $url = 'http://www.005.tv/uploads/allimg/160824/22-160R415242b36.jpg';
    $path = __DIR__;
    $name = 'image001';

    $entity = FileHelper::downloadImage($url, $path, $name);
    print_r($entity);
}