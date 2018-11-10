<?php


class CampaignParamHandler extends AbstractParamHandler
{

    protected function initParamInstanceFunction()
    {
        $this->paramInstance = new CampaignCreateParam();

        $this->field2SetFunction = array(
            StrategyConstants::ST_CAMPAIGN_ACCOUNT_ID => 'setAdAccountId',
            StrategyConstants::ST_CAMPAIGN_NAME => 'setName',
            StrategyConstants::ST_CAMPAIGN_TYPE => 'setCampaignType',
            StrategyConstants::ST_CAMPAIGN_SPEND_CAP => 'setSpendCap',
            StrategyConstants::ST_CAMPAIGN_STATUS => 'setStatus',
            StrategyConstants::ST_CAMPAIGN_PRODUCT_CATALOG_ID => 'setProductCatalogId',
        );
    }

    protected function initValueMaps()
    {
        $this->field2Valuemaps = array();

        $statusValue = array(
            StrategyConstants::ST_V_NODE_STATUS_PAUSED => AdManageConstants::PARAM_STATUS_PAUSED,
            StrategyConstants::ST_V_NODE_STATUS_ACTIVE => AdManageConstants::PARAM_STATUS_ACTIVE,
        );
        $this->field2Valuemaps[StrategyConstants::ST_CAMPAIGN_STATUS] = $statusValue;

        $campaignType = array(
            StrategyConstants::ST_V_CAMPAIGN_TYPE_APPINSTALL => AdManageConstants::CAMPAIGN_PARAM_TYPE_APP,
            StrategyConstants::ST_V_CAMPAIGN_TYPE_LINKCLICK => AdManageConstants::CAMPAIGN_PARAM_TYPE_WEBSITE,
            StrategyConstants::ST_V_CAMPAIGN_TYPE_PROUCTSALES => AdManageConstants::CAMPAIGN_PARAM_TYPE_PRODUCT_SALES,
            StrategyConstants::ST_V_CAMPAIGN_TYPE_PAGELIKE => AdManageConstants::CAMPAIGN_PARAM_TYPE_PROMOTE_PAGE,
            StrategyConstants::ST_V_CAMPAIGN_TYPE_BRANDAWARENESS => AdManageConstants::CAMPAIGN_PARAM_TYPE_BRAND_AWARENESS,
        );
        $this->field2Valuemaps[StrategyConstants::ST_CAMPAIGN_TYPE] = $campaignType;
    }

    protected function initOptionFields()
    {
        $this->optionFields = array(
            StrategyConstants::ST_CAMPAIGN_STATUS,
            StrategyConstants::ST_CAMPAIGN_SPEND_CAP,
            StrategyConstants::ST_CAMPAIGN_PRODUCT_CATALOG_ID,
        );
    }

    protected function preHandleStrategyInfo($strategyInfoArray)
    {
        $accountId = $strategyInfoArray[StrategyConstants::ST_CAMPAIGN_ACCOUNT_ID];
        if(!strstr($accountId, AdManageConstants::ADACCOUNT_ID_PREFIX))
        {
            $strategyInfoArray[StrategyConstants::ST_CAMPAIGN_ACCOUNT_ID] = AdManageConstants::ADACCOUNT_ID_PREFIX . $accountId;
        }

        return $strategyInfoArray;
    }
}