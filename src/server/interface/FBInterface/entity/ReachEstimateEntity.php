<?php


class ReachEstimateEntity
{
    private $userCount;

    private $bidMin;

    private $bidMax;

    private $bidMedian;

    private $cpaCurveData;

    private $curve;

    private $dua;

    public function toArray()
    {
        return get_object_vars($this);
    }

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
    public function getDua()
    {
        return $this->dua;
    }

    /**
     * @param mixed $dua
     */
    public function setDua($dua)
    {
        $this->dua = $dua;
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
    public function getUserCount()
    {
        return $this->userCount;
    }

    /**
     * @param mixed $userCount
     */
    public function setUserCount($userCount)
    {
        $this->userCount = $userCount;
    }

}