<?php


class STProcessInfoManager
{
    private $accountId;

    private $campaignType;

    private $campaignId2Uuid;

    private $adsetId2Uuid;

    private $creativeId2Uuid;

    private $adsetPid2Id;

    private $creativePid2Id;

    private $creativePid2ImageUuids;
    private $creativePid2ImageHashes;

    public function __construct()
    {
        $this->clearProcessInfo();
    }

    public function clearProcessInfo()
    {
        $this->campaignId2Uuid = array();
        $this->adsetId2Uuid = array();
        $this->creativeId2Uuid = array();
        $this->adsetPid2Id = array();
        $this->creativePid2Id = array();
        $this->creativePid2ImageUuids = array();
        $this->creativePid2ImageHashes = array();
    }

    public function addImageHashes($creativePid, $imageHashes)
    {
        $this->creativePid2ImageHashes[$creativePid] = $imageHashes;
    }

    public function getImageHashes($creativePid)
    {
        if(array_key_exists($creativePid, $this->creativePid2ImageHashes))
        {
            return $this->creativePid2ImageHashes[$creativePid];
        }
        else
        {
            return false;
        }
    }

    public function addImageUuids($creativePid, $imageUuids)
    {
        $this->creativePid2ImageUuids[$creativePid] = $imageUuids;
    }

    public function getImageUuids($creativePid)
    {
        if(array_key_exists($creativePid, $this->creativePid2ImageUuids))
        {
            return $this->creativePid2ImageUuids[$creativePid];
        }
        else
        {
            return false;
        }
    }

    public function addCreativePid($pid, $creativeId)
    {
        $this->creativePid2Id[$pid] = $creativeId;
    }

    public function getCreativeIdByPid($pid)
    {
        if(array_key_exists($pid, $this->creativePid2Id))
        {
            return $this->creativePid2Id[$pid];
        }
        else
        {
            return false;
        }
    }

    public function addCreativeUuid($creativeid, $uuid)
    {
        $this->creativeId2Uuid[$creativeid] = $uuid;
    }

    public function getCreativeUuid($creativeId)
    {
        if(array_key_exists($creativeId, $this->creativeId2Uuid))
        {
            return $this->creativeId2Uuid[$creativeId];
        }
        else
        {
            return false;
        }
    }

    public function addAdsetPid($pid, $adsetId)
    {
        $this->adsetPid2Id[$pid] = $adsetId;
    }

    public function getAdsetIdByPid($pid)
    {
        if(array_key_exists($pid, $this->adsetPid2Id))
        {
            return $this->adsetPid2Id[$pid];
        }
        else
        {
            return false;
        }

    }

    public function getAdsetUuid($adsetId)
    {
        if(array_key_exists($adsetId, $this->adsetId2Uuid))
        {
            return $this->adsetId2Uuid[$adsetId];
        }
        else
        {
            return false;
        }
    }

    public function addAdsetUuid($adsetId, $adsetUuid)
    {
        $this->adsetId2Uuid[$adsetId] = $adsetUuid;
    }

    public function getCampaignId()
    {
        if(count($this->campaignId2Uuid) === 0)
        {
            return false;
        }

        $keys = array_keys($this->campaignId2Uuid);
        return $keys[0];
    }

    public function getCampaignUuid()
    {
        if(count($this->campaignId2Uuid) === 0)
        {
            return false;
        }

        $values = array_values($this->campaignId2Uuid);
        return $values[0];
    }

    public function setCampaignUuidMap($campaignId, $campaignUuid)
    {
        $this->campaignId2Uuid[$campaignId] = $campaignUuid;
    }

    public function getAccountId()
    {
        return $this->accountId;
    }

    public function setAccountId($accountId)
    {
        $this->accountId = $accountId;
    }

    public function getCampaignType()
    {
        return $this->campaignType;
    }

    public function setCampaignType($campaignType)
    {
        $this->campaignType = $campaignType;
    }

}