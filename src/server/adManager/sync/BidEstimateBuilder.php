<?php

class BidEstimateBuilder
{
    public static function estimateBid(AdsetCreateParam $createParam)
    {
        $bidEstimateArray = array();

        //获取平均竞价
        $estimateEntityArray = AdManagerFacade::getReachEstimateByAccount($createParam);
        if(empty($estimateEntityArray))
        {
            return $bidEstimateArray;
        }
        //目前暂时只需一个
        $estimateEntity = $estimateEntityArray[0];
        $bidEstimateArray['ALL'] = $estimateEntity->toArray();

        //各国家竞价
        $countryArray = $createParam->getCountryArray();
        if(count($countryArray)<1)
        {
            return $bidEstimateArray;
        }

        foreach ($countryArray as $country)
        {
            $newParam = clone $createParam;
            $newParam->setCountryArray(array($country));
            $estimateEntityArray = AdManagerFacade::getReachEstimateByAccount($newParam);
            if(empty($estimateEntityArray))
            {
                continue;
            }

            $estimateEntity = $estimateEntityArray[0];
            $bidEstimateArray[$country] = $estimateEntity->toArray();
        }

        return $bidEstimateArray;

    }

}