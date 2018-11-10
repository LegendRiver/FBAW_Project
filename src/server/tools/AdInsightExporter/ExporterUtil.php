<?php

class ExporterUtil
{
    public static function getRetentionDates($days)
    {
        $dateList = array();
        for($iDay=1; $iDay<=$days; ++$iDay )
        {
            $strDate = '-' . $iDay . ' day';
            $dateDes = date("Y-m-d",strtotime($strDate));
            $dateList[] = $dateDes;
        }

        return $dateList;
    }

    public static function generateInsightInfo($sampleAdId, $sinceDate='', $utilDate='', $outputFile='')
    {
        $insightArray = AdManagerFacade::getAllFiledInsight($sampleAdId, AdManageConstants::INSIGHT_EXPORT_TYPE_AD,
            $sinceDate, $utilDate);
        if(empty($insightArray))
        {
            return;
        }
        $oneInsightInfo = $insightArray[0];
        self::writeInsightKey($oneInsightInfo, $outputFile);
    }

    private static function writeInsightKey($insightArray, $outputFile)
    {
        $insightKeyResult = array();
        foreach($insightArray as $insightKey => $insightValue)
        {
            if(is_array($insightValue))
            {
                $secondKeys = array_keys($insightValue);
                if(is_numeric($secondKeys[0]))
                {
                    $insightKeyResult[$insightKey] = array(InsightExporterConstants::INSIGHT_INFO_TYPE =>
                        InsightExporterConstants::INSIGHT_FIELD_TYPE_LIST);
                    $displayKeys = array();
                    $keyValue = '';
                    $keyKey = '';
                    foreach($insightValue as $subValue)
                    {
                        $keyArray = array_keys($subValue);
                        $keyKey = $keyArray[0];
                        $keyValue = $keyArray[1];
                        $displayKeys[] = $subValue[$keyKey];
                    }
                    $insightKeyResult[$insightKey][InsightExporterConstants::INSIGHT_INFO_DISPLAY_KEYS] = $displayKeys;
                    $insightKeyResult[$insightKey][InsightExporterConstants::INSIGHT_INFO_VALUE_KEY] = $keyValue;
                    $insightKeyResult[$insightKey][InsightExporterConstants::INSIGHT_INFO_KEY_KEY] = $keyKey;
                }
                else
                {
                    $insightKeyResult[$insightKey] = array(InsightExporterConstants::INSIGHT_INFO_TYPE =>
                        InsightExporterConstants::INSIGHT_FIELD_TYPE_MAP);
                    $valueKeys = array_keys($insightValue);
                    $valueKey = $valueKeys[0];
                    $insightKeyResult[$insightKey][InsightExporterConstants::INSIGHT_INFO_VALUE_KEY] = $valueKey;
                }
            }
            else
            {
                $insightKeyResult[$insightKey] = array(InsightExporterConstants::INSIGHT_INFO_TYPE =>
                    InsightExporterConstants::INSIGHT_FIELD_TYPE_VALUE);
            }
        }

        if(empty($outputFile))
        {
            $outputFile = __DIR__ . DIRECTORY_SEPARATOR . 'conf/insightInfo.json';
        }
        FileHelper::writeJsonFile($insightKeyResult, $outputFile);
    }

    public static function getAllValidAccounts($accountConfFile)
    {
        $actListInfo = FileHelper::readJsonFile($accountConfFile);

        $excludeAccountIds = $actListInfo[InsightExporterConstants::BASIC_INFO_EXCLUDE_ACCOUNT];
        $includeAccountIds = $actListInfo[InsightExporterConstants::BASIC_INFO_INCLUDE_ACCOUNT];
        $accountEntities = AdManagerFacade::getAllAccountsByBMId(AdManageConstants::DEFAULT_BM_ID);
        if(empty($accountEntities))
        {
            return $includeAccountIds;
        }
        else
        {
            $allAccountIds = array();
            foreach($accountEntities as $account)
            {
                $accountId = $account->getId();
                if(in_array($accountId, $excludeAccountIds))
                {
                    continue;
                }
                $allAccountIds[] = $accountId;
            }

            return $allAccountIds;
        }
    }
}