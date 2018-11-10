<?php


class OppositeSyncManager
{
    public static function updateConfigReportDB($fields, $records)
    {
        $dataArray = array();
        $dataArray[PARAMETER_ELI_FIELDS] = $fields;
        $dataArray[PARAMETER_ELI_RECORDS] = $records;
        $jsonData = json_encode($dataArray);
        $dataValue = base64_encode($jsonData);

        $parameters= array();
        $parameters[SERVICE_NAME] = 'EliAccountManagerService';
        $parameters[CLASS_INSTANCE] = 'CEliAccountManager';
        $parameters[FUNCTION_NAME] = 'updateCampaignConfigSpent';
        $parameters[PARAMETER_ELI_DATA] = $dataValue;
        $parameters[PARAMETER_CALL_TAG] = 'CONFIG_REPORT';

        $resultJsonValue = CHttpRequest::sendPost(SyncConstants::FRONT_SERVER_SYNC_URL, $parameters, true, null);

        $result = json_decode($resultJsonValue);
        if(!$result)
        {
            ServerLogger::instance()->writeLog(Error, 'The format of json result is invalid : ' . $resultJsonValue);
            return ERR_CONFIG_REPORT_RESULT_FORMAT_INVALID;
        }
        else
        {
            ServerLogger::instance()->writeLog(Info, 'The sync report return json: ' . $resultJsonValue);
        }

        $errorCodeField = $result->{'errorCode'};
        if(!is_numeric($errorCodeField))
        {
            return ERR_CONFIG_REPORT_ERRORCODE_FORMAT_INVALID;
        }

        $errorCode = intval($errorCodeField);
        return $errorCode;
    }
}