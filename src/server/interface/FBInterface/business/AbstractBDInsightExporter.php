<?php

/**
 * Created by IntelliJ IDEA.
 * User: Feng
 * Date: 2017/11/21
 * Time: 下午7:27
 */
abstract class AbstractBDInsightExporter
{
    public function getInsightByBD($nodeId, $nodeType, $startDate, $endDate)
    {
        $param = $this->buildBDParam();
        $fields = $this->buildInsightFields();

        $insightData = AdManagerFacade::getFlexibleInsight($nodeId, $nodeType, $startDate, $endDate, $fields, $param);
        if(empty($insightData))
        {
            return array();
        }

        return $this->readBDFieldInsight($insightData);
    }

    private function readBDFieldInsight($insightData)
    {
        $resultInsightData = array();
        $conf = $this->buildReadConf();
        foreach($insightData as $data)
        {
            $insightValue = InsightValueReader::readInsightValue($data, $conf);
            $resultInsightData[] = $insightValue;
        }

        return $resultInsightData;
    }

    abstract protected function buildBDParam();

    abstract protected function buildInsightFields();

    abstract protected function buildReadConf();

}