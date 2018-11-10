<?php

class TargetingUtil
{
    public static function getBehaviorList()
    {

    }

    public static function checkAgeValid($age)
    {
        $boolResult = true;
        if(!is_int($age))
        {
            $boolResult = false;
        }

        if($age < TargetingConstants::AGE_MIN_LIMIT || $age > TargetingConstants::AGE_MAX_LIMIT)
        {
            $boolResult = false;
        }

        return $boolResult;
    }

    public static function checkGenderValid($gender)
    {
        $boolResult = false;
        $checkArray = array(TargetingConstants::GENDER_MALE, TargetingConstants::GENDER_FEMALE);
        if(is_int($gender))
        {
            if(in_array($gender, $checkArray, true))
            {
                $boolResult = true;
            }
        }
        else if(is_array($gender))
        {
            $uniqueArray = array_unique($gender);
            $acount = count($uniqueArray);
            if($acount <= 2 && $acount > 0)
            {
                $diffArray = array_diff($gender, $checkArray);
                if(0 == count($diffArray))
                {
                    $boolResult = true;
                }
            }
        }
        else
        {
            $boolResult = false;
        }

        return $boolResult;
    }

}