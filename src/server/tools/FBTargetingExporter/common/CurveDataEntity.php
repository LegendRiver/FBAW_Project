<?php


class CurveDataEntity
{
    private $actions=0;

    private $bid=0;

    private $impression=0;

    private $reach=0;

    private $spend=0;

    /**
     * @return mixed
     */
    public function getActions()
    {
        return $this->actions;
    }

    /**
     * @param mixed $actions
     */
    public function setActions($actions)
    {
        $this->actions = $actions;
    }

    /**
     * @return mixed
     */
    public function getBid()
    {
        return $this->bid;
    }

    /**
     * @param mixed $bid
     */
    public function setBid($bid)
    {
        $this->bid = $bid;
    }

    /**
     * @return mixed
     */
    public function getImpression()
    {
        return $this->impression;
    }

    /**
     * @param mixed $impression
     */
    public function setImpression($impression)
    {
        $this->impression = $impression;
    }

    /**
     * @return mixed
     */
    public function getReach()
    {
        return $this->reach;
    }

    /**
     * @param mixed $reach
     */
    public function setReach($reach)
    {
        $this->reach = $reach;
    }

    /**
     * @return mixed
     */
    public function getSpend()
    {
        return $this->spend;
    }

    /**
     * @param mixed $spend
     */
    public function setSpend($spend)
    {
        $this->spend = $spend;
    }

}