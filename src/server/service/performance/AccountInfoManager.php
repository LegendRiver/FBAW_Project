<?php

/**
 * Created by IntelliJ IDEA.
 * User: Feng
 * Date: 2017/10/21
 * Time: 上午11:27
 */
class AccountInfoManager extends ServiceObject
{
    public function queryCountryPerformance($parameters=array())
    {
        if(!array_key_exists(ServiceParamFields::S_PRODUCT_ID, $parameters))
        {
            return array();
        }

        if(array_key_exists(ServiceParamFields::S_ACCOUNT_PERFORMANCE_START, $parameters) &&
            array_key_exists(ServiceParamFields::S_ACCOUNT_PERFORMANCE_END, $parameters))
        {
            $startDate = $parameters[ServiceParamFields::S_ACCOUNT_PERFORMANCE_START];
            $endDate = $parameters[ServiceParamFields::S_ACCOUNT_PERFORMANCE_END];
        }
        else
        {
            $startDate = CommonHelper::getTodayDate();
            $endDate = $startDate;
        }
        $productId = $parameters[ServiceParamFields::S_PRODUCT_ID];

        $countryPerformance = BasicInfoDataHandler::instance()->getActCountryPerformance($productId, $startDate, $endDate);

        return $countryPerformance;
    }

    public function queryActBasicInfo($parameters)
    {
        if(!array_key_exists(ServiceParamFields::S_PRODUCT_ID, $parameters))
        {
            return array();
        }
        $productId = $parameters[ServiceParamFields::S_PRODUCT_ID];
        $accountBasicInfo = BasicInfoDataHandler::instance()->getAccountBasicInfo($productId);
        return $accountBasicInfo;
    }

}

