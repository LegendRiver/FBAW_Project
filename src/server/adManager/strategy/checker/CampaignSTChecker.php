<?php


class CampaignSTChecker extends AbstractStrategyChecker
{

    private $logPrefix = '';

    //下限不少于100美元
    //account 下数量限制
    //字符串特殊字符判断以及空字符串判断
    //adaccountId 是否带有'act_'
    //Type status 的值是否正确
    protected function checkJsonContent()
    {
        $campaignInfo = $this->fileParser->getCampaignInfo();

        $this->logPrefix = 'Campaign Name : ' . $campaignInfo[StrategyConstants::ST_CAMPAIGN_NAME] . '; ';

        //通用检查
        $commonCheck = $this->checkFieldValueValid($campaignInfo);
        if(false === $commonCheck)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'Failed to pass the campaign common check.');
            return ERR_STRATEGY_CAMPAIGN_COMMON_CHECK;
        }

        $spendCap = $campaignInfo[StrategyConstants::ST_CAMPAIGN_SPEND_CAP];
        $spendResult = $this->checkSpendCap($spendCap);
        if(OK != $spendCap)
        {
            return $spendResult;
        }

        if($this->campaignType == StrategyConstants::ST_V_CAMPAIGN_TYPE_PROUCTSALES)
        {
            $productCatalogId = $campaignInfo[StrategyConstants::ST_CAMPAIGN_PRODUCT_CATALOG_ID];
            if(empty($productCatalogId))
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix .
                    'The product catalog id is empty in product sales Campaign.');
                return ERR_PRODUCT_CATALOG_ID_NULL;
            }
        }

        return OK;
    }

    private function checkSpendCap($spendCap)
    {
        if(!CommonHelper::checkFbMoneyInt($spendCap))
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'The spendCap is not int type : ' . $spendCap);
            return ERR_MONEY_IS_NOT_INT;
        }
        if($spendCap < AdManageConstants::CAMPAIGN_SPEND_CAP_LIMIT)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The campaign spend cap is less than ' .
                AdManageConstants::CAMPAIGN_SPEND_CAP_LIMIT);
            return ERR_SPEND_CAP_SMALL;
        }

        return OK;
    }

    protected function initFieldInfo()
    {
        $this->notNullFields = array(
            StrategyConstants::ST_CAMPAIGN_NAME,
            StrategyConstants::ST_CAMPAIGN_ACCOUNT_ID,
            StrategyConstants::ST_CAMPAIGN_OPERATION,
            StrategyConstants::ST_CAMPAIGN_TYPE,
            StrategyConstants::ST_CAMPAIGN_CONFIGID,
        );

        $this->field2Values = array(
            StrategyConstants::ST_CAMPAIGN_STATUS => array(
                StrategyConstants::ST_V_NODE_STATUS_PAUSED,
                StrategyConstants::ST_V_NODE_STATUS_ACTIVE,),

            StrategyConstants::ST_CAMPAIGN_TYPE => array(
                StrategyConstants::ST_V_CAMPAIGN_TYPE_APPINSTALL,
                StrategyConstants::ST_V_CAMPAIGN_TYPE_LINKCLICK,
                StrategyConstants::ST_V_CAMPAIGN_TYPE_PROUCTSALES,),
        );
    }
}