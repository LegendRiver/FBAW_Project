<?php


class RuleParser
{
    private $configList;

    private $ruleListMap;

    public function __construct($configInfo)
    {
        $this->configList = $configInfo;
        $this->ruleListMap = array();
        $this->parseConfig();
    }

    private function parseConfig()
    {
        foreach ($this->configList as $config)
        {
            $ruleKey = $config[RuleToolConstants::CONF_ITEM_RULE_KEY];
            $ruleList = $config[RuleToolConstants::CONF_ITEM_RULE_LIST];

            $ruleCheckerList = array();
            foreach ($ruleList as $ruleInfo)
            {
                $ruleType = $ruleInfo[RuleToolConstants::CONF_ITEM_RULE_TYPE];
                $ruleFields = $ruleInfo[RuleToolConstants::CONF_ITEM_FIELDS];

                $warningTh = array();
                if(array_key_exists(RuleToolConstants::CONF_ITEM_WARNING_THRESHOLD, $ruleInfo))
                {
                   $warningTh = $ruleInfo[RuleToolConstants::CONF_ITEM_WARNING_THRESHOLD];
                }

                $errorTh = array();
                if(array_key_exists(RuleToolConstants::CONF_ITEM_ERROR_THRESHOLD, $ruleInfo))
                {
                    $errorTh = $ruleInfo[RuleToolConstants::CONF_ITEM_ERROR_THRESHOLD];
                }

                $ruleChecker = new RuleChecker($ruleType, $ruleFields, $warningTh, $errorTh);
                $ruleCheckerList[] = $ruleChecker;
            }

            $this->ruleListMap[$ruleKey] = $ruleCheckerList;
        }
    }

    public function getRuleChecker($ruleKey)
    {
        $ruleCheckers = array();

        if(array_key_exists($ruleKey, $this->ruleListMap))
        {
            $ruleCheckers = $this->ruleListMap[$ruleKey];
        }

        return $ruleCheckers;
    }

}