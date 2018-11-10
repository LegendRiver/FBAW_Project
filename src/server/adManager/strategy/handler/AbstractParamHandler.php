<?php


abstract class AbstractParamHandler
{
    protected $field2SetFunction;

    protected $paramInstance;

    protected $field2Valuemaps;

    protected $optionFields;

    protected $field2CheckFuction;

    protected $checkInstance;

    protected $logPrefix;

    public function __construct()
    {
        $this->initData();

        $this->logPrefix = 'instance: ' . get_class($this->paramInstance) . ' ;';
    }

    public function transformStrategy($strategyInfoArray)
    {
        $preResult = $this->preHandleStrategyInfo($strategyInfoArray);
        if(false === $preResult)
        {
            return false;
        }
        else
        {
           $strategyInfoArray = $preResult;
        }

        foreach($this->field2SetFunction as $field=>$setFunction)
        {
            $checkResult = $this->checkField($field, $strategyInfoArray);
            if(false === $checkResult)
            {
                return false;
            }

            if(StrategyConstants::TRANSFORM_CHECK_FIELD_OPTION === $checkResult)
            {
                continue;
            }

            $setResult = $this->setTransformValue($field, $strategyInfoArray);
            if(false === $setResult)
            {
                return false;
            }
        }

        return $this->paramInstance;
    }

    private function setTransformValue($field, $strategyInfoArray)
    {
        $strategyValue = $strategyInfoArray[$field];
        if(array_key_exists($field, $this->field2Valuemaps))
        {
            $allValues = $this->field2Valuemaps[$field];
        }
        else
        {
            $allValues = array();
        }

        $setFunction = $this->field2SetFunction[$field];

        if(!method_exists($this->paramInstance, $setFunction))
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'There is not the function :' . $setFunction);
            return false;
        }

        if(empty($strategyValue))
        {
            if(in_array($field, $this->optionFields))
            {
                ServerLogger::instance()->writeStrategyLog(Info, $this->logPrefix . 'The option field is empty. ' . $field);
                return true;
            }
            else
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The field value is empty : ' . $field);
                return false;
            }
        }
        //检查值是否是预定义的接口值
        $checkDefine = $this->checkValueDefined($strategyValue, $allValues);
        if(false === $checkDefine)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'Failed to check defined is field : ' . $field);
            return false;
        }

        //检查值的业务有效性


        //获取转换后的值
        $transformValue = $this->getTransformValue($strategyValue, $allValues);
        $setResult = call_user_func_array(array($this->paramInstance, $setFunction), array($transformValue));
        if(false === $setResult)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'Failed to call function : ' . $setFunction);
            return false;
        }

    }


    private function getTransformValue($strategyValue, $allValueMaps)
    {
        if(empty($allValueMaps))
        {
            return $strategyValue;
        }
        else
        {
            return $allValueMaps[$strategyValue];
        }
    }

    private function checkValueDefined($strategyValue, $allValueMaps)
    {
        if(!empty($allValueMaps))
        {
            $allSTValues = array_keys($allValueMaps);
            $arrSTValue = (array)$strategyValue;
            $diffResult = array_diff($arrSTValue, $allSTValues);
            if(!empty($diffResult))
            {
                ServerLogger::instance()->writeStrategyLog(Error, 'The invalid value is : ' . print_r($diffResult, true) .
                    ' ; The predefined values : ' . print_r($allSTValues, true));
                return false;
            }
        }

        return true;
    }

    private function checkField($field, $strategyArray)
    {
        if(!is_array($strategyArray))
        {
            ServerLogger::instance()->writeStrategyLog(Warning, 'The strategyArray is not array.');
            return false;
        }

        if (!array_key_exists($field, $strategyArray))
        {
            if(in_array($field, $this->optionFields))
            {
                ServerLogger::instance()->writeStrategyLog(Info, $this->logPrefix .
                    'There is not option field in strategy. : ' . $field);
                return StrategyConstants::TRANSFORM_CHECK_FIELD_OPTION;
            }
            else
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix .
                    'There is not field in strategy array. field: '. $field);
                return false;
            }
        }

        if(!array_key_exists($field, $this->field2SetFunction))
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'There is not set function of field : '. $field);
            return false;
        }

        return true;
    }

    private function initData()
    {
        $this->initParamInstanceFunction();
        $this->initValueMaps();
        $this->initOptionFields();
    }

    abstract protected function initParamInstanceFunction();

    abstract protected function initValueMaps();

    abstract protected function initOptionFields();

    protected function preHandleStrategyInfo($strategyInfoArray)
    {
        return $strategyInfoArray;
    }

}