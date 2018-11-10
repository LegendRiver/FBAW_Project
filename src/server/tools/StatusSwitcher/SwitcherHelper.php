<?php


class SwitcherHelper
{
    public static function activeNodes($nodeIds, $nodeType)
    {
        self::updateNodeStatus($nodeIds, $nodeType, SwitcherConstants::STATUS_ACTIVE);
    }

    public static function inactiveNodes($nodeIds, $nodeType)
    {
        self::updateNodeStatus($nodeIds, $nodeType, SwitcherConstants::STATUS_PAUSED);
    }

    private function updateNodeStatus($nodeIds, $nodeType, $status)
    {

        foreach($nodeIds as $nodeId)
        {
            $result = self::updateOneNode($nodeId, $nodeType, $status);
            if(false === $result)
            {
                ServerLogger::instance()->writeLog('[Switcher]Failed to update node id : ' .
                    $nodeId . '; node Type: '. $nodeType);
                //重试一次
                sleep(30);
                self::updateOneNode($nodeId, $nodeType, $status);
            }
        }
    }

    private static function updateOneNode($nodeId, $nodeType, $status)
    {
        if(SwitcherConstants::NODE_TYPE_AD == $nodeType)
        {
            $result = AdManagerFacade::updateAdStatus($nodeId, $status);
        }
        else if(SwitcherConstants::NODE_TYPE_ADSET == $nodeType)
        {
            $result = AdManagerFacade::updateAdSetStatus($nodeId, $status);
        }
        else if(SwitcherConstants::NODE_TYPE_CAMPAIGN == $nodeType)
        {
            $result = AdManagerFacade::updateCampaignStatus($nodeId, $status);
        }
        else
        {
            ServerLogger::instance()->writeLog('The node type is invalid : ' . $nodeType );
            $result = false;
        }

        return $result;
    }

}