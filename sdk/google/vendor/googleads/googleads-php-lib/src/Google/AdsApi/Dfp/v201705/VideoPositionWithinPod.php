<?php

namespace Google\AdsApi\Dfp\v201705;


/**
 * This file was generated from WSDL. DO NOT EDIT.
 */
class VideoPositionWithinPod
{

    /**
     * @var int $index
     */
    protected $index = null;

    /**
     * @param int $index
     */
    public function __construct($index = null)
    {
      $this->index = $index;
    }

    /**
     * @return int
     */
    public function getIndex()
    {
      return $this->index;
    }

    /**
     * @param int $index
     * @return \Google\AdsApi\Dfp\v201705\VideoPositionWithinPod
     */
    public function setIndex($index)
    {
      $this->index = $index;
      return $this;
    }

}
