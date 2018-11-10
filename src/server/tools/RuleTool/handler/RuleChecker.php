<?php


class RuleChecker
{
    private $fields;

    private $warningThreshold;

    private $errorThreshold;

    private $type;

    public function __construct($ruleType, $checkFields, $warningTh, $errorTh)
    {
        $this->type = $ruleType;
        $this->fields = $checkFields;
        $this->warningThreshold = $warningTh;
        $this->errorThreshold = $errorTh;
    }

    public function checkWarning($insightValues)
    {
        return $this->checkInsightValue($insightValues, $this->warningThreshold);
    }

    public function checkError($insightValues)
    {
        return $this->checkInsightValue($insightValues, $this->errorThreshold);
    }

    private function checkInsightValue($insightValues, $thresholds)
    {
        $specifiedValues = array();
        if(empty($thresholds))
        {
            return true;
        }

        foreach ($this->fields as $field)
        {
            if(array_key_exists($field, $insightValues))
            {
                $oneValue = $insightValues[$field];
            }
            else
            {
                $oneValue = 0;
            }

            $specifiedValues[] = $oneValue;
        }

        $compareResult = array_map(array('CommonHelper','compareOperate'), $specifiedValues, $thresholds);

        return array_sum($compareResult) != count($thresholds);
    }

    /**
     * @return mixed
     */
    public function getFields()
    {
        return $this->fields;
    }

    /**
     * @return mixed
     */
    public function getWarningThreshold()
    {
        return $this->warningThreshold;
    }

    /**
     * @return mixed
     */
    public function getErrorThreshold()
    {
        return $this->errorThreshold;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

}