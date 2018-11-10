<?php

use FacebookAds\Object\Ad;

class AdUtil
{
    public static function transformAdField(AdCreateParam $param)
    {
        $builder = new AdFieldBuilder();

        $builder->setName($param->getName());
        $builder->setAdsetId($param->getAdsetId());
        $builder->setCreativeId($param->getCreativeId());

        $status = self::getAdStatus($param->getStatus());
        $builder->setStatus($status);

        return $builder->getOutputField();
    }

    private static function getAdStatus($status)
    {
        $resultStatus = Ad::STATUS_ACTIVE;
        if(CommonHelper::notSetValue($status))
        {
            return $resultStatus;
        }

        if(AdManageConstants::PARAM_STATUS_ACTIVE == $status)
        {
            $resultStatus = Ad::STATUS_ACTIVE;
        }
        else if(AdManageConstants::PARAM_STATUS_PAUSED == $status)
        {
            $resultStatus = Ad::STATUS_PAUSED;
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, 'Only ACTIVE and PAUSED are valid during creation');
        }

        return $resultStatus;
    }
}