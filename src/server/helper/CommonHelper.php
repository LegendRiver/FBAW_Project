<?php


class CommonHelper
{
    public static function filterMapByKeys($sourceArray, $keys)
    {
        $filteredInfo = array();
        foreach ($keys as $field)
        {
            if(array_key_exists($field, $sourceArray))
            {
                $filteredInfo[$field] = $sourceArray[$field];
            }
        }

        return $filteredInfo;
    }

    public static function isArrayAllEmpty($arrayData)
    {
        foreach ($arrayData as $item)
        {
            if(!empty($item))
            {
                return false;
            }
        }

        return true;
    }

    public static function getArrayValueByKey($key, $array)
    {
        if(!is_array($array))
        {
            return null;
        }
        if(array_key_exists($key, $array))
        {
            return $array[$key];
        }
        else
        {
            return null;
        }

    }

    public static function getDeltaDate($days, $format = 'Y-m-d')
    {
        $timeStr = $days . " day";
        return date($format,strtotime($timeStr));
    }

    public static function getYesterdayDate($format = 'Y-m-d')
    {
        return date($format,strtotime("-1 day"));
    }
    public static function getTodayDate($format = 'Y-m-d')
    {
        return date($format);
    }
    public static function getTomorrowDate($format = 'Y-m-d')
    {
        return date($format,strtotime("+1 day"));
    }
    public static function getCurrentDateTime()
    {
        return strtotime(date('Y-m-d'));
    }

    public static function getCurrentTimeStamp()
    {
        return strtotime(date(BasicConstants::DATE_DEFAULT_FORMAT));
    }

    public static function checkDateStrValid($dateStr)
    {
        if(!is_string($dateStr))
        {
            return false;
        }

        if(0 == strlen($dateStr))
        {
            return false;
        }

        list($y,$m,$d)=explode('-',$dateStr);
        return checkdate($m,$d,$y);
    }

    public static function divisionOperate($dividend, $divisor)
    {
        if($divisor == 0)
        {
            return 0;
        }
        else
        {
            return $dividend/$divisor;
        }
    }

    public static function checkFbMoneyInt($moneyAmount)
    {
        //如果不为整数，取整后为0，返回false
        if(!is_int($moneyAmount))
        {
            ServerLogger::instance()->writeLog(Info, 'The value of money is not int type. ' . $moneyAmount);
            $convertValue = floor($moneyAmount);
            if($convertValue <= 0)
            {
                return false;
            }
        }

        return true;
    }

    public static function writeObjectInfo($instance, $filePath)
    {
        $contentInfo = print_r($instance, true);
        file_put_contents($filePath, $contentInfo, FILE_APPEND);
    }

    public static function notSetValue($var)
    {
        if(isset($var))
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    public static function notSetReturnMessage($field, $node)
    {
        $message = sprintf(AdManageConstants::CHECK_NOT_SET_FORMAT, $field, $node);
        return $message;
    }

    public static function transformFailedMessage($node)
    {
        $message = sprintf(AdManageConstants::TRANSFORM_FAILED_FORMAT, $node);
        return $message;
    }

    public static function getDayCountBetweenDate(DateTime $startDate, DateTime $endDate)
    {
        $interval = date_diff($startDate, $endDate);
        $dayCount = $interval->d + 1;
        return $dayCount;
    }

    public static function getWeekdayByDate(DateTime $date)
    {
        return date('w', $date->getTimestamp());
    }

    public static function getWeekdaysBetweenDate(DateTime $startDate, DateTime $endDate)
    {
        $startTime = $startDate->getTimestamp();
        $endTime = $endDate->getTimestamp();
        if($startTime > $endTime)
        {
            return array();
        }

        $dayCount = self::getDayCountBetweenDate($startDate, $endDate);
        if($dayCount >= 7)
        {
            return range(0,6);
        }

        $startWeekday = self::getWeekdayByDate($startDate);
        $endWeekday = self::getWeekdayByDate($endDate);
        if($startWeekday <= $endWeekday)
        {
            return range($startWeekday, $endWeekday);
        }
        else
        {
            $tmpArray = range($startWeekday, $endWeekday+7);
            $func = function($weekday)
            {
                return $weekday%7;
            };

            return array_map($func, $tmpArray);
        }

    }

    public static function getDateListBetweenDate($startDate, $endDate, $dateFormat='Y-m-d')
    {
        $startTime = strtotime($startDate);
        $endTime = strtotime($endDate);

        $dateList = array();
        for($temTime = $startTime; $temTime <= $endTime; $temTime+=86400)
        {
            $dateStr = date($dateFormat, $temTime);
            $dateList[] = $dateStr;
        }

        return $dateList;
    }

    public static function dateFormatConvert($dateFormat, $dateString)
    {
        $timeStamp = strtotime($dateString);
        return date($dateFormat, $timeStamp);
    }

    public static function isStringEmpty($strContent)
    {
        if(is_null($strContent))
        {
            return true;
        }

        if(empty($strContent))
        {
            return true;
        }

        return false;
    }

    public static function strContains($srcString, $subString)
    {
        $position = strpos($srcString, $subString);
        if(false === $position)
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    public static function writeClassMethods($className, $filePath)
    {
        $methods = get_class_methods($className);
        foreach ($methods as $method )
        {
            $methodFormat = $method . PHP_EOL;
            file_put_contents($filePath, $methodFormat, FILE_APPEND);
        }
    }

    public static function addOperate($addend, $summand)
    {
        return $addend + $summand;
    }

    public static function compareOperate($left, $right)
    {
        if($left > $right)
        {
            return 1;
        }
        else if($left < $right)
        {
            return -1;
        }
        else
        {
            return 0;
        }
    }
}