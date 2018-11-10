<?php


class AdSetInsightExportHelper extends AbstractExportHelper
{
    protected function getNodeInsights($nodeId, $sinceDate, $utilDate)
    {
        $insightArray = AdManagerFacade::getAllFiledInsight($nodeId, AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET,
            $sinceDate, $utilDate);
        if(empty($insightArray))
        {
            return array();
        }

        return $insightArray;
    }

    protected function getNodeIds($parentId, $parentType)
    {
        $filterStatus = array(AdManageConstants::EFFECTIVE_STATUS_ACTIVE);
        $nodeIds = AdManagerFacade::getAdSetIdsByParentId($parentId, $parentType, $filterStatus, true);
        if(empty($nodeIds))
        {
            ServerLogger::instance()->writeLog(Info, 'The nodeIds is empty.');
            return array();
        }
        return $nodeIds;
    }

    protected function initOptionInstance($insightData)
    {
        $this->entities = array();
        $adsetId = $insightData[InsightExporterConstants::INSIGHT_EXPORT_FIELD_ADSET_ID];
        $adset = AdManagerFacade::getAdsetById($adsetId);
        if(!empty($adset))
        {
            $this->entities[] = $adset;

            $targetingInfo = $adset->getTargeting();
            if(!empty($targetingInfo))
            {
                $entity = new TargetingFieldsEntity();
                $entity->setTargetingInfo($targetingInfo);
                $this->entities[] = $entity;
            }
        }
    }

    protected function isNodeLevelExport($optionLevels)
    {
        //空说明没有设置level
        if(empty($optionLevels))
        {
            return true;
        }
        else
        {
            return in_array(InsightExporterConstants::OPTION_LEVEL_AD_SET, $optionLevels);
        }
    }
}