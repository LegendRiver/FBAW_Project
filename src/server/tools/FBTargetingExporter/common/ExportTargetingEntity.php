<?php


class ExportTargetingEntity
{
    private $id;

    private $name;

    private $audienceSize;

    private $path;

    private $description;

    private $type;

    private $platform;

    private $countryCode;

    private $gender;

    private $targetingAudienceSize;

    private $bidMin;

    private $bidMax;

    private $bidMedian;

    private $dau;

    private $cpaCurveData;

    private $curve;

    private $dailyReachMin;

    private $dailyReachMax;

    /**
     * @return mixed
     */
    public function getCurve()
    {
        return $this->curve;
    }

    /**
     * @param mixed $curve
     */
    public function setCurve($curve)
    {
        $this->curve = $curve;
    }

    /**
     * @return mixed
     */
    public function getCpaCurveData()
    {
        return $this->cpaCurveData;
    }

    /**
     * @param mixed $cpaCurveData
     */
    public function setCpaCurveData($cpaCurveData)
    {
        $this->cpaCurveData = $cpaCurveData;
    }

    /**
     * @return mixed
     */
    public function getDailyReachMax()
    {
        return $this->dailyReachMax;
    }

    /**
     * @param mixed $dailyReachMax
     */
    public function setDailyReachMax($dailyReachMax)
    {
        $this->dailyReachMax = $dailyReachMax;
    }

    /**
     * @return mixed
     */
    public function getDailyReachMin()
    {
        return $this->dailyReachMin;
    }

    /**
     * @param mixed $dailyReachMin
     */
    public function setDailyReachMin($dailyReachMin)
    {
        $this->dailyReachMin = $dailyReachMin;
    }

    /**
     * @return mixed
     */
    public function getDau()
    {
        return $this->dau;
    }

    /**
     * @param mixed $dau
     */
    public function setDau($dau)
    {
        $this->dau = $dau;
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
    public function getAudienceSize()
    {
        return $this->audienceSize;
    }

    /**
     * @param mixed $audienceSize
     */
    public function setAudienceSize($audienceSize)
    {
        $this->audienceSize = $audienceSize;
    }

    /**
     * @return mixed
     */
    public function getBidMax()
    {
        return $this->bidMax;
    }

    /**
     * @param mixed $bidMax
     */
    public function setBidMax($bidMax)
    {
        $this->bidMax = $bidMax;
    }

    /**
     * @return mixed
     */
    public function getBidMedian()
    {
        return $this->bidMedian;
    }

    /**
     * @param mixed $bidMedian
     */
    public function setBidMedian($bidMedian)
    {
        $this->bidMedian = $bidMedian;
    }

    /**
     * @return mixed
     */
    public function getBidMin()
    {
        return $this->bidMin;
    }

    /**
     * @param mixed $bidMin
     */
    public function setBidMin($bidMin)
    {
        $this->bidMin = $bidMin;
    }

    /**
     * @return mixed
     */
    public function getTargetingAudienceSize()
    {
        return $this->targetingAudienceSize;
    }

    /**
     * @param mixed $targetingAudienceSize
     */
    public function setTargetingAudienceSize($targetingAudienceSize)
    {
        $this->targetingAudienceSize = $targetingAudienceSize;
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

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * @param mixed $path
     */
    public function setPath($path)
    {
        $this->path = $path;
    }

    /**
     * @return mixed
     */
    public function getPlatform()
    {
        return $this->platform;
    }

    /**
     * @param mixed $platform
     */
    public function setPlatform($platform)
    {
        $this->platform = $platform;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }


    public function getTitleDescription()
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