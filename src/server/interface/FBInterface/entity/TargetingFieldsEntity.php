<?php


class TargetingFieldsEntity
{
    const FIELD_KEY = 'field_key';
    const FIELD_TYPE = 'field_type';
    const FIELD_TYPE_LIST = 'list';
    const FIELD_TYPE_MAP = 'map';

    private $targetingInfo;

    public function getTargetingAgeMax()
    {
        $fieldList = array(
            array(
                TargetingFieldsEntity::FIELD_KEY => AdManageConstants::TARGETING_FIELD_AGE_MAX,
                TargetingFieldsEntity::FIELD_TYPE => TargetingFieldsEntity::FIELD_TYPE_MAP,
            ),
        );

        return $this->getTargetingValues($fieldList);
    }

    public function getTargetingAgeMin()
    {
        $fieldList = array(
            array(
                TargetingFieldsEntity::FIELD_KEY => AdManageConstants::TARGETING_FIELD_AGE_MIN,
                TargetingFieldsEntity::FIELD_TYPE => TargetingFieldsEntity::FIELD_TYPE_MAP,
            ),
        );

        return $this->getTargetingValues($fieldList);
    }

    public function getTargetingGender()
    {
        $fieldList = array(
        array(
            TargetingFieldsEntity::FIELD_KEY => AdManageConstants::TARGETING_FIELD_GENDER,
            TargetingFieldsEntity::FIELD_TYPE => TargetingFieldsEntity::FIELD_TYPE_MAP,
        ),
    );

        return $this->getTargetingValues($fieldList);
    }

    public function getTargetingCountry()
    {
        $fieldList = array(
            array(
                TargetingFieldsEntity::FIELD_KEY => AdManageConstants::TARGETING_FIELD_LOCATION,
                TargetingFieldsEntity::FIELD_TYPE => TargetingFieldsEntity::FIELD_TYPE_MAP,
            ),
            array(
                TargetingFieldsEntity::FIELD_KEY => AdManageConstants::TARGETING_FIELD_COUNTRY,
                TargetingFieldsEntity::FIELD_TYPE => TargetingFieldsEntity::FIELD_TYPE_MAP,
            ),
        );

        return $this->getTargetingValues($fieldList);
    }

    public function getTargetingLocale()
    {
        $fieldList = array(
            array(
                TargetingFieldsEntity::FIELD_KEY => AdManageConstants::TARGETING_FIELD_LOCALE,
                TargetingFieldsEntity::FIELD_TYPE => TargetingFieldsEntity::FIELD_TYPE_MAP,
            ),
        );

        return $this->getTargetingValues($fieldList);
    }

    public function getTargetingCustomAudienceID()
    {
        $fieldList = array(
            array(
                TargetingFieldsEntity::FIELD_KEY => AdManageConstants::TARGETING_FIELD_CUSTOM_AUDIENCE,
                TargetingFieldsEntity::FIELD_TYPE => TargetingFieldsEntity::FIELD_TYPE_MAP,
            ),
            array(
                TargetingFieldsEntity::FIELD_KEY => AdManageConstants::TARGETING_FIELD_ID,
                TargetingFieldsEntity::FIELD_TYPE => TargetingFieldsEntity::FIELD_TYPE_LIST,
            ),
        );

        return $this->getTargetingValues($fieldList);
    }

    public function getTargetingCustomAudienceName()
    {
        $fieldList = array(
            array(
                TargetingFieldsEntity::FIELD_KEY => AdManageConstants::TARGETING_FIELD_CUSTOM_AUDIENCE,
                TargetingFieldsEntity::FIELD_TYPE => TargetingFieldsEntity::FIELD_TYPE_MAP,
            ),
            array(
                TargetingFieldsEntity::FIELD_KEY => AdManageConstants::TARGETING_FIELD_NAME,
                TargetingFieldsEntity::FIELD_TYPE => TargetingFieldsEntity::FIELD_TYPE_LIST,
            ),
        );

        return $this->getTargetingValues($fieldList);
    }

    public function getTargetingInterestId()
    {
        return $this->getFlexibleTargetingValue(
            AdManageConstants::TARGETING_FIELD_FLEXIBLE,
            AdManageConstants::TARGETING_FIELD_INTEREST,
            AdManageConstants::TARGETING_FIELD_ID);
    }
    public function getTargetingInterestName()
    {
        return $this->getFlexibleTargetingValue(
            AdManageConstants::TARGETING_FIELD_FLEXIBLE,
            AdManageConstants::TARGETING_FIELD_INTEREST,
            AdManageConstants::TARGETING_FIELD_NAME);
    }

    public function getTargetingExcludeBehaviorId()
    {
        return $this->getFlexibleTargetingValue(
            AdManageConstants::TARGETING_FIELD_EXCLUSION,
            AdManageConstants::TARGETING_FIELD_BEHAVIOR,
            AdManageConstants::TARGETING_FIELD_ID);
    }

    private function getTargetingValues($fieldList, $isReturnArray = false, $nodeArray = array())
    {
        if(empty($nodeArray))
        {
            $nodeArray = $this->targetingInfo;
        }

        if(empty($nodeArray))
        {
            return '';
        }

        $targetingValue = $nodeArray;
        foreach($fieldList as $fieldTuple)
        {
            $field = $fieldTuple[TargetingFieldsEntity::FIELD_KEY];
            $fieldType = $fieldTuple[TargetingFieldsEntity::FIELD_TYPE];

            if(is_null($targetingValue))
            {
                return '';
            }

            if($fieldType == TargetingFieldsEntity::FIELD_TYPE_LIST)
            {
                $resultArray = array();
                foreach($targetingValue as $nodeValue)
                {
                    $resultArray[] = $nodeValue[$field];
                }

                $targetingValue = $resultArray;
                break;
            }
            else
            {
                if(!array_key_exists($field, $targetingValue))
                {
                    return '';
                }
                $targetingValue = $targetingValue[$field];
            }

        }

        if((!$isReturnArray) && is_array($targetingValue))
        {
            $targetingValue = implode(';', $targetingValue);
        }

        return $targetingValue;
    }

    private function getFlexibleTargetingValue($flexibleType, $nodeField, $attributeField)
    {
        $flexibleField = array(
            array(
                TargetingFieldsEntity::FIELD_KEY => $flexibleType,
                TargetingFieldsEntity::FIELD_TYPE => TargetingFieldsEntity::FIELD_TYPE_MAP,
            ),
        );
        $flexibleArray = $this->getTargetingValues($flexibleField, true);
        if(empty($flexibleArray))
        {
            return '';
        }

        if($flexibleType == AdManageConstants::TARGETING_FIELD_EXCLUSION)
        {
            $flexibleValue = $flexibleArray;
        }
        else
        {
            $flexibleValue = $flexibleArray[0];
        }

        $subNodeField = array(
            array(
                TargetingFieldsEntity::FIELD_KEY => $nodeField,
                TargetingFieldsEntity::FIELD_TYPE => TargetingFieldsEntity::FIELD_TYPE_MAP,
            ),
            array(
                TargetingFieldsEntity::FIELD_KEY => $attributeField,
                TargetingFieldsEntity::FIELD_TYPE => TargetingFieldsEntity::FIELD_TYPE_LIST,
            ),
        );

        return $this->getTargetingValues($subNodeField, false, $flexibleValue);
    }

    /**
     * @return mixed
     */
    public function getTargetingInfo()
    {
        return $this->targetingInfo;
    }

    /**
     * @param mixed $targetingInfo
     */
    public function setTargetingInfo($targetingInfo)
    {
        $this->targetingInfo = $targetingInfo;
    }


}