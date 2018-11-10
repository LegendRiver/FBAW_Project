<?php


class ExportTargetingParam
{
    private $countryCode;

    private $gender;

    private $accountId;

    private $appUrl;

    private $dailyBudget;

    private $bidAmount;

    private $isSetPlacement;

    public function __construct()
    {
        $this->countryCode = '';
        $this->gender = '';
        $this->isSetPlacement = false;
    }

    /**
     * @return mixed
     */
    public function getIsSetPlacement()
    {
        return $this->isSetPlacement;
    }

    /**
     * @param mixed $isSetPlacement
     */
    public function setIsSetPlacement($isSetPlacement)
    {
        $this->isSetPlacement = $isSetPlacement;
    }

    /**
     * @return mixed
     */
    public function getBidAmount()
    {
        return $this->bidAmount;
    }

    /**
     * @param mixed $bidAmount
     */
    public function setBidAmount($bidAmount)
    {
        $this->bidAmount = $bidAmount;
    }

    /**
     * @return mixed
     */
    public function getDailyBudget()
    {
        return $this->dailyBudget;
    }

    /**
     * @param mixed $dailyBudget
     */
    public function setDailyBudget($dailyBudget)
    {
        $this->dailyBudget = $dailyBudget;
    }

    /**
     * @return mixed
     */
    public function getAccountId()
    {
        return $this->accountId;
    }

    /**
     * @param mixed $accountId
     */
    public function setAccountId($accountId)
    {
        $this->accountId = $accountId;
    }

    /**
     * @return mixed
     */
    public function getAppUrl()
    {
        return $this->appUrl;
    }

    /**
     * @param mixed $appUrl
     */
    public function setAppUrl($appUrl)
    {
        $this->appUrl = $appUrl;
    }

    /**
     * @return mixed
     */
    public function getGender()
    {
        return $this->gender;
    }

    /**
     * @param mixed $gender
     */
    public function setGender($gender)
    {
        $this->gender = $gender;
    }

    /**
     * @return mixed
     */
    public function getCountryCode()
    {
        return $this->countryCode;
    }

    /**
     * @param mixed $countryCode
     */
    public function setCountryCode($countryCode)
    {
        $this->countryCode = $countryCode;
    }

    public function getDescription()
    {
        if(empty($this->countryCode))
        {
            return '';
        }

        $genderDescription = $this->getGenderDesc();

        $description = '';
        $description .= $this->countryCode;
        $description .= '_';
        $description .= $genderDescription;

        return $description;
    }

    private function getGenderDesc()
    {
        $gender = $this->getGender();
        if(empty($gender))
        {
           return '';
        }

        if(TargetingConstants::GENDER_MALE == $gender)
        {
            return 'Male';
        }
        else if(TargetingConstants::GENDER_FEMALE == $gender)
        {
            return 'Female';
        }
        else
        {
            return 'All';
        }
    }
}