<?php
require_once(__DIR__ . "/../includeFile/interfaceInitFile.php");

queryCampaignReportTest();

function readStrategyFileTaskTest()
{
    $task = new StrategyHandleTask();
    $task->run();
}

function strategyFileReadTest()
{
    $task = new StrategyHandleTask();
    $task->run();
}

function queryAdReportTest()
{
    $task = new QueryFbInsightTask();
    $task->runAdReportExport();
}

function queryCampaignReportTest()
{
    $task = new QueryFbInsightTask();
    $task->runCampaignReportExport();
}

function profitConfigReadTest()
{
    //profit = ProfitManager::getNewProfit();
    //print_r($profit);
}

function sendPostTest()
{
    $parameters= array();
    $parameters[SERVICE_NAME] = 'EliAccountManagerService';
    $parameters[CLASS_INSTANCE] = 'CEliAccountManager';
    $parameters[FUNCTION_NAME] = 'getPublicAudience';
    $parameters['ELI_SESSION_ACCESS_TOKEN'] = '559EA509-5E81-BFF3-9E70-63EB5C1489FC';
    $parameters[PARAMETER_CALL_TAG] = '3';

    $resultJsonValue = CHttpRequest::sendPost('http://192.168.1.114/client/service/EliAccountManagerService.php',
        $parameters, true, null);

//    $dataValue = 'eyJGSUVMRFMiOlsiSUQiLCJFTElfQ0FNUEFJR05fSUQiLCJQVUJMSVNIRVJfQ0FNUEFJR05fSUQiLCJFTElfQ09ORklHX0lEIiwiUkVQT1JUX1NUQVJUX1RJTUUiLCJSRVBPUlRfRU5EX1RJTUUiLCJSRVNVTFRfVFlQRSIsIlJFU1VMVF9WQUxVRSIsIlJFQUNIIiwiQ09TVF9QRVJfUkVTVUxUIiwiU1BFTlQiLCJJTVBSRVNTSU9OUyIsIkNMSUNLUyIsIkNQQyIsIkNUUiIsIlJFU1VMVF9SQVRFIiwiQ1BNIiwiSU5TVEFMTFMiLCJDUEkiLCJDVlIiXSwiUkVDT1JEUyI6W1siOEEzM0VGNDEtQkQ4Ri04RjlGLUMzQzAtN0YxQzRBNTlDM0YwIiwiN0NDMEUzNzctN0QzQi00NDUzLUMwMzItNTVEOTUwRkJEOTQxIiwiNjA2NDAyODc0MDExMSIsImNvbmZpZzAwMDIiLCIyMDE2LTA3LTE5IiwiMjAxNi0xMC0yMCIsImxpbmtfY2xpY2siLDIsOTc3LDAuMTQsMC4yOCwxMDQwLDMsMC4wOTMsMC4yOSwwLDAuMjY5LDAsMCwwXSxbIjQwQkQ2NEUzLTU5RkUtQkE3RS1CNUMwLUIyN0VGRjUyQzVCNiIsIjk1RkExMkZELUFCODAtRkM2Ni1CN0MyLUU2OEI2ODdDM0EwNSIsIjYwNTY1NTA2ODk5MTEiLCJjb25maWcwMDAzIiwiMjAxNi0wNy0xOSIsIjIwMTYtMTAtMjAiLCJtb2JpbGVfYXBwX2luc3RhbGwiLDEwLDMwNTksMC42NjEsNi42MSwzMjQ2LDM0LDAuMTk0LDEuMDUsMCwyLjAzNiwxMCwwLjY2MSwwLjMxXV19';
//    $parameters= array();
//    $parameters[SERVICE_NAME] = 'EliAccountManagerService';
//    $parameters[CLASS_INSTANCE] = 'CEliAccountManager';
//    $parameters[FUNCTION_NAME] = 'updateCampaignConfigSpent';
//    $parameters[PARAMETER_ELI_DATA] = $dataValue;
//    $parameters[PARAMETER_CALL_TAG] = 'CONFIG_REPORT';
//
//    $resultJsonValue = CHttpRequest::sendPost(SyncConstants::FRONT_SERVER_SYNC_URL, $parameters, true, null);

    $result = json_decode($resultJsonValue);
    print_r($result);
}

function syncCampaignTest()
{
    $data = 'eyJJRCI6IjNBM0I4NTBDLTNCMTUtOTVGNS05RURBLUIwM0I3RERDQURGRSIsIkVMSV9BQ0NPVU5UX0lEIjoiMUYwMEFFMzctMjFBRi1COEFCLTVDNkMtREZFMTk1NUVDRjNFIiwiTkFNRSI6InRlc3RDYW1wYWlnbjUiLCJDQU1QQUlHTl9UWVBFIjoxLCJVUkwiOiJodHRwOlwvXC93d3cuYWJjLmNvbSIsIlRJVExFIjoiIiwiREVTQ1JJUFRJT04iOiIiLCJJTUFHRV9MSVNUIjoiIiwiU0NIRURVTEVfU1RBUlQiOiIyMDE2LTA5LTE4IiwiU0NIRURVTEVfRU5EIjoiMjAxNy0wOS0xOCIsIlRJTUVfU1RBUlQiOiIwOTowMCIsIlRJTUVfRU5EIjoiMTg6MDAiLCJBVURJRU5DRSI6eyJHRU5ERVIiOiJBbGwiLCJBR0UiOlsxMCw2MF0sIkNPVU5UUklFUyI6W1siQXVzdHJpYSIsIkFUIl1dfSwiU1RBVFVTIjoxLCJCVURHRVQiOjEwMCwiU1BFTlQiOjAsIkRFTElWRVJZX1RZUEUiOjAsIktFWVdPUkQiOiIiLCJNQVRDSF9UWVBFIjowLCJDUkVBVEVfVElNRSI6IjIwMTYtMTAtMjQgMTE6MDU6MDAiLCJMQVNUX01PRElGWV9USU1FIjoiMjAxNi0xMC0yNCAxMTowNTowMCIsIkNPTkZJR1MiOlt7IklEIjoiMUVGRjBDRTItOUVCNC1CN0FCLTQxMEQtOEY3MjBCQzI5NjVBIiwiRUxJX0NBTVBBSUdOX0lEIjoiM0EzQjg1MEMtM0IxNS05NUY1LTlFREEtQjAzQjdERENBREZFIiwiRUxJX1BVQkxJU0hFUl9JRCI6IjdDMDk3MTBCLTlGRjgtNDMzNy05QjlFLTQzRjBEMDAxOTBDNSIsIkJVREdFVCI6IjUwLjAwIiwiU1BFTlQiOiIwLjAwIiwiU1RBVFVTIjowLCJDUkVBVEVfVElNRSI6IjIwMTYtMTAtMjQgMTE6MDU6MDAiLCJMQVNUX01PRElGWV9USU1FIjoiMjAxNi0xMC0yNCAxMTowNTowMCJ9LHsiSUQiOiJFQUU2MUE1MC02QTMwLTU5RDEtREUwRC0xOTg2QUI0NjVCRTQiLCJFTElfQ0FNUEFJR05fSUQiOiIzQTNCODUwQy0zQjE1LTk1RjUtOUVEQS1CMDNCN0REQ0FERkUiLCJFTElfUFVCTElTSEVSX0lEIjoiM0FBOEYyMDAtMEIyNy00NEJCLThBRkQtMEIzNUVEODg3QTA3IiwiQlVER0VUIjoiNTAuMDAiLCJTUEVOVCI6IjAuMDAiLCJTVEFUVVMiOjAsIkNSRUFURV9USU1FIjoiMjAxNi0xMC0yNCAxMTowNTowMCIsIkxBU1RfTU9ESUZZX1RJTUUiOiIyMDE2LTEwLTI0IDExOjA1OjAwIn1dfQ==';
    $param = array(SyncConstants::SYNC_INTERFACED_PARAM_DATA => $data);

    $manager = new SyncManager();
    $result = $manager->syncEliCampaignData($param);
    print_r($result);
}

function queryReportTest()
{
    $queryTask = new QueryFbInsightTask();
    $queryTask->run();
}

function strategyInputParamTest()
{
    $testFile = __DIR__ . "/resources/eliCampaignTest.json";
    $campaignInfo = FileHelper::readJsonFile($testFile);
    $inputParam = StrategyInputParamBuilder::buildStrategyParam($campaignInfo);

    print_r($inputParam);
}

function campaignReportTest()
{
    //获取要insight的AdID
    $campaignIdArray = array('6054818124511',);
    $reportQuery = new FBReportQuery();
    $result = $reportQuery->queryFbCampaignReport($campaignIdArray);
    var_dump($result);
}

function adReportTest()
{
    //获取要insight的AdID
    $adIdArray = array('6056550695511',);
    $reportQuery = new FBReportQuery();
    $result = $reportQuery->queryFbAdReport($adIdArray);
    var_dump($result);
}

function parseStrategyFileTest()
{
    $file = __DIR__ . '/resources/strategyInterfaceFile.json';

    $parser = new StrategyFileParser();
    $parser->parseStrategyParam($file);

    $campaign = $parser->getCampaignInfo();
    CommonHelper::writeObjectInfo($campaign, 'parser.txt');

    $adset = $parser->getAdsetMap();
    CommonHelper::writeObjectInfo($adset, 'parser.txt');

    $creative = $parser->getCreativeMap();
    CommonHelper::writeObjectInfo($creative, 'parser.txt');

    $ad = $parser->getAdMap();
    CommonHelper::writeObjectInfo($ad, 'parser.txt');
}


function createSTCampaignTest()
{
    $file = __DIR__ . '/resources/resultAllv3.json';

    $manager = new StrategyManager();

    $result = $manager->handleStrategy($file);
    print_r($result);
}

function handleImageTest()
{
    $imageUrls = array(
        "http://a1.mzstatic.com/us/r30/Purple62/v4/da/e9/1d/dae91dd9-8056-2fa6-2146-e5654c27f2ff/screen696x696.jpeg",
        "http://a3.mzstatic.com/us/r30/Purple62/v4/22/d1/7e/22d17e34-7eb6-a42f-167b-07a739c5d892/screen406x722.jpeg"
    );

    $accountId = 'act_584939305020122';

    $creativeName = 'Test Creative 001';

    $imageProcesser = new ImageProcesser();
    $imageProcesser->resetProcess($creativeName, $imageUrls, $accountId);

    $result = $imageProcesser->downloadImages();
    $imageEntity = $imageProcesser->getDownloadImageInfo();
    print_r($imageEntity);
}
