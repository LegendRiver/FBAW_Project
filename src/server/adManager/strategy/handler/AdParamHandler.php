<?php


class AdParamHandler extends AbstractParamHandler
{

    protected function initParamInstanceFunction()
    {
        $this->paramInstance = new AdCreateParam();

        $this->field2SetFunction = array(
            //'setAccountId',
            StrategyConstants::ST_AD_NAME => 'setName',
            StrategyConstants::ST_AD_CREATIVE_ID => 'setCreativeId',
            StrategyConstants::ST_AD_ADSET_ID => 'setAdsetId',
            StrategyConstants::ST_AD_STATUS => 'setStatus',
        );
    }

    protected function initValueMaps()
    {
        $this->field2Valuemaps = array();

        $statusValue = array(
            StrategyConstants::ST_V_NODE_STATUS_PAUSED => AdManageConstants::PARAM_STATUS_PAUSED,
            StrategyConstants::ST_V_NODE_STATUS_ACTIVE => AdManageConstants::PARAM_STATUS_ACTIVE,
        );
        $this->field2Valuemaps[StrategyConstants::ST_AD_STATUS] = $statusValue;

    }

    protected function initOptionFields()
    {
        $this->optionFields = array(
            StrategyConstants::ST_AD_STATUS,
        );
    }
}