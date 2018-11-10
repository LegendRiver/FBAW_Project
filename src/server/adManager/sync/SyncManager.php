<?php


class SyncManager extends ELIBaseObject
{
    private $eliCampaignDB;

    private $callStrageyManager;

    public function __construct()
    {
        parent::__construct();
        $this->_ClassName = get_class($this);
        $this->TableName = "NONE_TABLE";
        $this->addAllowAccessFunction("syncEliCampaignData");

        $this->eliCampaignDB = new ELICampaignDB();
        $this->callStrageyManager = new CallStrategyManager();
    }

    public function syncEliCampaignData($params)
    {
        $result = new CResult();

        $jsonData = $params[SyncConstants::SYNC_INTERFACED_PARAM_DATA];
        $jsonStr = base64_decode($jsonData);
        $campaignInfo = FileHelper::decodeJsonString($jsonStr);
        if(false === $campaignInfo)
        {
            $errorMsg = 'Failed to parse CampaignInfo json.';
            ServerLogger::instance()->writeLog(Warning, $errorMsg);
            $result->setErrorCode(ERR_INTERFACE_PARSE_CAMPAIGN_JSON);
            $result->setMessage($errorMsg);
            return $result;
        }

        //判断campaign是否已经同步过
        $campaignId = $params[DBConstants::ELI_CAMPAIGN_ID];
        if($this->isHaveSyncCampaign($campaignId))
        {
            $errorMsg = 'Have sync campaign : '. $campaignId .'.';
            ServerLogger::instance()->writeLog(Warning, $errorMsg);
            $result->setErrorCode(ERR_INTERFACE_HAVE_SYNC_CAMPAIGN);
            $result->setMessage($errorMsg);
            return $result;
        }

        //初始化利润参数
        $profitArray = ProfitHandler::handleSyncProfit($campaignInfo);
        if(false === $profitArray)
        {
            ServerLogger::instance()->writeLog(Error, 'Failed get profit by the parameter: ' . print_r($campaignInfo, true));
            $result->setErrorCode(ERR_INTERFACE_GET_PROFIT);
            $result->setMessage('Failed get profit by the parameter.');
            return $result;
        }

        //存储
        $eliCampaignEntity = EliDBEntityBuilder::buildEliCampaignEntity($campaignInfo, $profitArray);
        $resultCode = $this->eliCampaignDB->addCampaignRecord($eliCampaignEntity);
        if(OK != $resultCode)
        {
            $errorMsg = 'Failed to store Campaign and config.';
            ServerLogger::instance()->writeLog(Warning, $errorMsg);
            $result->setErrorCode($resultCode);
            $result->setMessage($errorMsg);
            return $result;
        }

        //构建策略接口数据
        $inputParamArray = StrategyInputParamBuilder::buildStrategyParam($campaignInfo);
        if(false === $inputParamArray)
        {
            $errorMsg = 'Failed to build strategy parameters.';
            ServerLogger::instance()->writeLog(Warning, $errorMsg);
            $result->setErrorCode(ERR_INTERFACE_BUILDE_STRATEGY_PARAM);
            $result->setMessage($errorMsg);
            return $result;
        }

        $notifyResult = $this->callStrageyManager->notifyStrategyCampaignInfo($inputParamArray);
        if(false === $notifyResult)
        {
            $errorMsg = 'Failed to notify strategy.';
            ServerLogger::instance()->writeLog(Warning, $errorMsg);
            $result->setErrorCode(ERR_INTERFACE_NOTIFY_STRATEGY);
            $result->setMessage($errorMsg);
            return $result;
        }

        $result->setErrorCode(OK);
        $result->setMessage('Successed.');
        $result->setData(json_encode($inputParamArray));
        return $result;
    }

    private function isHaveSyncCampaign($campaignId)
    {
        $eliCampaign = $this->eliCampaignDB->selectById($campaignId);

        return !(empty($eliCampaign));
    }

}