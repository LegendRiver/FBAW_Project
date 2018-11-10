<?php

use FacebookAds\Object\Fields\FlexibleTargetingFields;

/**
 * 根据需求增加成员，如behavior等
 * Class FlexibleTargetingBuilder
 */
class FlexibleTargetingBuilder implements IFieldBuilder
{
    //只需要ID数组
    private $interestArray;
    private $behaviorArray;
    private $lifeEventArray;
    private $industryArray;
    private $politicsArray;
    private $ethnicAffinityArray;
    private $generationArray;
    private $householdCompositionArray;
    private $familyStatusArray;
    private $relationShipArray;
    private $educationStatusArray;

    //下面的还没有添加代码
    //private $incomeArray; //暂时没有值，查询不到
    //private $netWorthArray; //暂时没有值，查询不到
    //private $homeTypeArray; //暂时没有值，查询不到
    //private $homeOwnershipArray; //暂时没有值，查询不到
    //private $momArray; //暂时没有值，查询不到
    //private $officeTypeArray; //暂时没有值，查询不到


    private $interestedInArray;
    private $educationSchoolArray;
    private $collegeYearsArray;
    private $educationMajorArray;
    private $workEmployerArray;
    private $workPositionArray;

    private $outputArray;
    private $secondOutputArray;

    public function __construct()
    {
        $this->interestArray = array();
        $this->behaviorArray = array();
        $this->lifeEventArray = array();

        $this->outputArray = array();
        $this->secondOutputArray = array();
    }

    public function getOutputField()
    {
        $this->outputArray = array();

        $this->getInnerOutputField();

        if(!empty($this->secondOutputArray))
        {
            $this->outputArray[] = $this->secondOutputArray;
        }
        return $this->outputArray;
    }

    public function getInnerOutputField()
    {
        $this->secondOutputArray = array();

        //转换interest数组
        $interestIDArray = $this->switchIDArray($this->interestArray);
        if(!empty($interestIDArray))
        {
            $this->secondOutputArray[FlexibleTargetingFields::INTERESTS] = $interestIDArray;
        }

        //behavior
        $behaviorIDArray = $this->switchIDArray($this->behaviorArray);
        if(!empty($behaviorIDArray))
        {
            $this->secondOutputArray[FlexibleTargetingFields::BEHAVIORS] = $behaviorIDArray;
        }

        $lifeEventIDArray = $this->switchIDArray($this->lifeEventArray);
        if(!empty($lifeEventIDArray))
        {
            $this->secondOutputArray[FlexibleTargetingFields::LIFE_EVENTS] = $lifeEventIDArray;
        }

        $industryIDArray = $this->switchIDArray($this->industryArray);
        if(!empty($industryIDArray))
        {
            $this->secondOutputArray[FlexibleTargetingFields::INDUSTRIES] = $industryIDArray;
        }

        $politicIDArray = $this->switchIDArray($this->politicsArray);
        if(!empty($politicIDArray))
        {
            $this->secondOutputArray[FlexibleTargetingFields::POLITICS] = $politicIDArray;
        }
        $ethnicIDArray = $this->switchIDArray($this->ethnicAffinityArray);
        if(!empty($ethnicIDArray))
        {
            $this->secondOutputArray[FlexibleTargetingFields::ETHNIC_AFFINITY] = $ethnicIDArray;
        }
        $generationIDArray = $this->switchIDArray($this->generationArray);
        if(!empty($generationIDArray))
        {
            $this->secondOutputArray[FlexibleTargetingFields::GENERATION] = $generationIDArray;
        }
        $familyStatusIDArray = $this->switchIDArray($this->familyStatusArray);
        if(!empty($familyStatusIDArray))
        {
            $this->secondOutputArray[FlexibleTargetingFields::FAMILY_STATUSES] = $familyStatusIDArray;
        }
        $householdComIDArray = $this->switchIDArray($this->householdCompositionArray);
        if(!empty($householdComIDArray))
        {
            $this->secondOutputArray[FlexibleTargetingFields::HOUSEHOLD_COMPOSITION] = $householdComIDArray;
        }

        if(!empty($this->relationShipArray))
        {
            $this->secondOutputArray[FlexibleTargetingFields::RELATIONSHIP_STATUSES] = $this->relationShipArray;
        }
        if(!empty($this->educationStatusArray))
        {
            $this->secondOutputArray[FlexibleTargetingFields::EDUCATION_STATUSES] = $this->educationStatusArray;
        }

        return $this->secondOutputArray;
    }


    private function switchIDArray($idListArray)
    {
        $outputIDArray = array();
        if(is_null($idListArray))
        {
            return $outputIDArray;
        }

        foreach($idListArray as $id)
        {
            $tmpArray = array();
            $tmpArray[TargetingConstants::TARGETING_COMMON_ID] = $id;
            $outputIDArray[] = $tmpArray;
        }

        return $outputIDArray;
    }

    /**
     * @param mixed $interestArray
     */
    public function setInterestArray($interestArray)
    {
        $this->interestArray = (array)$interestArray;
    }

    /**
     * @param array $behaviorArray
     */
    public function setBehaviorArray($behaviorArray)
    {
        $this->behaviorArray = $behaviorArray;
    }

    /**
     * @param mixed $collegeYearsArray
     */
    public function setCollegeYearsArray($collegeYearsArray)
    {
        $this->collegeYearsArray = $collegeYearsArray;
    }

    /**
     * @param mixed $educationMajorArray
     */
    public function setEducationMajorArray($educationMajorArray)
    {
        $this->educationMajorArray = $educationMajorArray;
    }

    /**
     * @param mixed $educationSchoolArray
     */
    public function setEducationSchoolArray($educationSchoolArray)
    {
        $this->educationSchoolArray = $educationSchoolArray;
    }

    /**
     * @param mixed $educationStatusArray
     */
    public function setEducationStatusArray($educationStatusArray)
    {
        $this->educationStatusArray = $educationStatusArray;
    }

    /**
     * @param mixed $ethnicAffinityArray
     */
    public function setEthnicAffinityArray($ethnicAffinityArray)
    {
        $this->ethnicAffinityArray = $ethnicAffinityArray;
    }

    /**
     * @param mixed $familyStatusArray
     */
    public function setFamilyStatusArray($familyStatusArray)
    {
        $this->familyStatusArray = $familyStatusArray;
    }

    /**
     * @param mixed $generationArray
     */
    public function setGenerationArray($generationArray)
    {
        $this->generationArray = $generationArray;
    }

    /**
     * @param mixed $householdCompositionArray
     */
    public function setHouseholdCompositionArray($householdCompositionArray)
    {
        $this->householdCompositionArray = $householdCompositionArray;
    }

    /**
     * @param mixed $industryArray
     */
    public function setIndustryArray($industryArray)
    {
        $this->industryArray = $industryArray;
    }

    /**
     * @param mixed $interestedInArray
     */
    public function setInterestedInArray($interestedInArray)
    {
        $this->interestedInArray = $interestedInArray;
    }

    /**
     * @param mixed $lifeEventArray
     */
    public function setLifeEventArray($lifeEventArray)
    {
        $this->lifeEventArray = $lifeEventArray;
    }

    /**
     * @param array $outputArray
     */
    public function setOutputArray($outputArray)
    {
        $this->outputArray = $outputArray;
    }

    /**
     * @param mixed $politicsArray
     */
    public function setPoliticsArray($politicsArray)
    {
        $this->politicsArray = $politicsArray;
    }

    /**
     * @param mixed $relationShipArray
     */
    public function setRelationShipArray($relationShipArray)
    {
        $this->relationShipArray = $relationShipArray;
    }

    /**
     * @param array $secondOutputArray
     */
    public function setSecondOutputArray($secondOutputArray)
    {
        $this->secondOutputArray = $secondOutputArray;
    }

    /**
     * @param mixed $workEmployerArray
     */
    public function setWorkEmployerArray($workEmployerArray)
    {
        $this->workEmployerArray = $workEmployerArray;
    }

    /**
     * @param mixed $workPositionArray
     */
    public function setWorkPositionArray($workPositionArray)
    {
        $this->workPositionArray = $workPositionArray;
    }

}