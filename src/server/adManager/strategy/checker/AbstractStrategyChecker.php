<?php


abstract class AbstractStrategyChecker
{
    //特殊字符判断
    //日期格式（需要时区设置）
    protected $fileParser;

    protected $campaignType;

    protected $notNullFields;

    protected $field2Values;

    public function __construct(StrategyFileParser $parser)
    {
        $this->fileParser = $parser;
        $this->notNullFields = array();
        $this->field2Values = array();
    }

    public function checkStrategyFile()
    {
        //初始化公共变量
        $this->initCommonVar();

        //具体检查
        $checkResult = $this->checkJsonContent();

        return $checkResult;
    }

    private function initCommonVar()
    {
        $campaignInfo = $this->fileParser->getCampaignInfo();
        $this->campaignType = $campaignInfo[StrategyConstants::ST_CAMPAIGN_TYPE];
        $this->initFieldInfo();
    }

    protected function checkFieldValueValid($infoArray)
    {
        foreach($this->notNullFields as $checkField)
        {
            if(!array_key_exists($checkField, $infoArray))
            {
                ServerLogger::instance()->writeStrategyLog(Error, 'There is not field('. $checkField . ') in info array');
                return false;
            }

            $value = $infoArray[$checkField];

            if(is_null($value))
            {
                ServerLogger::instance()->writeStrategyLog(Error, 'The value of field (' . $checkField . ') is null');
                return false;
            }

            if(is_array($value))
            {
                if(0 === count($value))
                {
                    ServerLogger::instance()->writeStrategyLog(Error, 'The value(array) of field (' . $checkField . ') is empty.');
                    return false;
                }
            }

            if(is_string($value))
            {
                if(0 === strlen($value))
                {
                    ServerLogger::instance()->writeStrategyLog(Error, 'The value(string) of field (' . $checkField . ') is empty.');
                    return false;
                }
            }
        }

        foreach($this->field2Values as $field=>$valueArray)
        {
            if(!array_key_exists($field, $infoArray))
            {
                continue;
            }

            $value = $infoArray[$field];
            if(!in_array($value, $valueArray))
            {
                ServerLogger::instance()->writeStrategyLog(Error, 'The value of field (' . $field . '):' . $value . ' is not in '
                    . print_r($valueArray, true));
                return false;
            }
        }

        return true;
    }
    
    abstract protected function checkJsonContent();

    abstract protected function initFieldInfo();
}