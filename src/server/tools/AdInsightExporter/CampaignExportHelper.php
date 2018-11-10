<?php


class CampaignExportHelper extends AbstractExportHelper
{

    protected function getNodeInsights($nodeId, $sinceDate, $utilDate)
    {
        $insightArray = AdManagerFacade::getAllFiledInsight($nodeId, AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN,
            $sinceDate, $utilDate);
        if(empty($insightArray))
        {
            return array();
        }

        return $insightArray;
    }

    protected function getNodeIds($parentId, $parentType)
    {
        $nodeIds = AdManagerFacade::getCampaignIdsByAccount($parentId);
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
            return in_array(InsightExporterConstants::OPTION_LEVEL_CAMPAIGN, $optionLevels);
        }
    }
}