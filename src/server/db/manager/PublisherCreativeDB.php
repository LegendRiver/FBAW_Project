<?php


class PublisherCreativeDB extends AbstractDBManager
{
    public function __construct()
    {
        $this->TableName = DBConstants::CREATIVE_TABLE_NAME;
        parent::__construct();
    }

    public function selectByCreativeUid($fbCreativeUid, $fieldArray = array())
    {
        if(empty($fieldArray))
        {
            $fieldArray = array_keys($this->Fields);
        }

        $selectParamMap = array();
        $adWParam = new CDbParameter(DBConstants::CREATIVE_UUID, $fbCreativeUid, STRING);
        $selectParamMap[DBConstants::CREATIVE_UUID] = $adWParam;

        $entityArray = $this->selectDbRecord($fieldArray, $selectParamMap);
        if(false === $entityArray)
        {
            return false;
        }

        return $entityArray;
    }

    public function addCreativeRecord(PublisherCreativeEntity $entity)
    {
        try
        {
            $this->initDBField($entity);

            $recordNum = 0;
            $errorCode = $this->addRecord($recordNum);
            if ($errorCode != OK)
            {
                $message = sprintf("Insert Fb Creative <%s> failed, error code<%d>.", $entity->getCreativeName(), $errorCode);
                ServerLogger::instance()->writeLog(Error, $message);
                return $errorCode;
            }

            return OK;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return ERR_SERVER_DB_EXCEPTION;
        }
    }

    protected function initEntityCondition()
    {
        $this->dbEntityInstance = new PublisherCreativeEntity();

        $this->field2FunctinName = array(
            DBConstants::CREATIVE_UUID => 'setUuid',
            DBConstants::CREATIVE_ID => 'setCreativeId',
            DBConstants::CREATIVE_ACCOUNT_ID => 'setAccountId',
            DBConstants::CREATIVE_NAME => 'setCreativeName',
            DBConstants::CREATIVE_AD_FORMAT => 'setAdFormat',
            DBConstants::CREATIVE_LINK_TYPE => 'setLinkType',
            DBConstants::CREATIVE_TITLE => 'setTitle',
            DBConstants::CREATIVE_DESCRIPTION => 'setDescription',
            DBConstants::CREATIVE_CAPTION => 'setCaption',
            DBConstants::CREATIVE_MESSAGE => 'setMessage',
            DBConstants::CREATIVE_PAGE_ID => 'setPageId',
            DBConstants::CREATIVE_IMAGE_HASH => 'setImageHash',
            DBConstants::CREATIVE_URL => 'setUrl',
            DBConstants::CREATIVE_CALLTOACTION_TYPE => 'setCallToActionType',
            DBConstants::CREATIVE_IMAGE_UUIDS => 'setImageUids',
            DBConstants::CREATIVE_CAROUSEL_NAMES => 'setCarouselNames',
            DBConstants::CREATIVE_CAROUSEL_DESCS => 'setCarouselDescs',
            DBConstants::CREATIVE_SLIDESHOW_DURATION => 'setSlideShowDurationTime',
            DBConstants::CREATIVE_SLIDESHOW_TRANSITION => 'setSlideShowTransitionTime',
            DBConstants::CREATIVE_CREATE_TIME => 'setCreateTime',
            DBConstants::CREATIVE_MODIFY_TIME => 'setModifyTime',
        );
    }

    private function initDBField(PublisherCreativeEntity $entity)
    {
        $uid = $entity->getUuid();
        $creativeId = $entity->getCreativeId();
        $accountId = $entity->getAccountId();
        $name = $entity->getCreativeName();
        $adFormat = $entity->getAdFormat();
        $linkType = $entity->getLinkType();
        $title = $entity->getTitle();
        $description = $entity->getDescription();
        $caption = $entity->getCaption();
        $message = $entity->getMessage();
        $pageId = $entity->getPageId();
        $imageHash = $entity->getImageHash();
        $linkUrl = $entity->getUrl();
        $callToActionType = $entity->getCallToActionType();
        $imageUids = $entity->getImageUids();
        $carouselNames = $entity->getCarouselNames();
        $carouselDescs = $entity->getCarouselDescs();
        $slideshowDuration = $entity->getSlideShowDurationTime();
        $slideshowTransition = $entity->getSlideShowTransitionTime();
        $createTime = $entity->getCreateTime();
        $modifyTime = $entity->getModifyTime();


        $this->setFieldValue(DBConstants::CREATIVE_UUID, $uid);
        $this->setFieldValue(DBConstants::CREATIVE_ID, $creativeId);
        $this->setFieldValue(DBConstants::CREATIVE_ACCOUNT_ID, $accountId);
        $this->setFieldValue(DBConstants::CREATIVE_NAME, $name);
        $this->setFieldValue(DBConstants::CREATIVE_AD_FORMAT, $adFormat);
        $this->setFieldValue(DBConstants::CREATIVE_LINK_TYPE, $linkType);
        $this->setFieldValue(DBConstants::CREATIVE_TITLE, $title);
        $this->setFieldValue(DBConstants::CREATIVE_DESCRIPTION, $description);
        $this->setFieldValue(DBConstants::CREATIVE_CAPTION, $caption);
        $this->setFieldValue(DBConstants::CREATIVE_MESSAGE, $message);
        $this->setFieldValue(DBConstants::CREATIVE_PAGE_ID, $pageId);
        $this->setFieldValue(DBConstants::CREATIVE_IMAGE_HASH, $imageHash);
        $this->setFieldValue(DBConstants::CREATIVE_URL, $linkUrl);
        $this->setFieldValue(DBConstants::CREATIVE_CALLTOACTION_TYPE, $callToActionType);
        $this->setFieldValue(DBConstants::CREATIVE_IMAGE_UUIDS, $imageUids);
        $this->setFieldValue(DBConstants::CREATIVE_CAROUSEL_NAMES, $carouselNames);
        $this->setFieldValue(DBConstants::CREATIVE_CAROUSEL_DESCS, $carouselDescs);
        $this->setFieldValue(DBConstants::CREATIVE_SLIDESHOW_DURATION, $slideshowDuration);
        $this->setFieldValue(DBConstants::CREATIVE_SLIDESHOW_TRANSITION, $slideshowTransition);
        $this->setFieldValue(DBConstants::CREATIVE_CREATE_TIME, $createTime);
        $this->setFieldValue(DBConstants::CREATIVE_MODIFY_TIME, $modifyTime);

    }

    protected function initTableFields()
    {
        $this->addField(DBConstants::CREATIVE_UUID, STRING, "");
        $this->addField(DBConstants::CREATIVE_ID, STRING, "");
        $this->addField(DBConstants::CREATIVE_ACCOUNT_ID, STRING, "");
        $this->addField(DBConstants::CREATIVE_NAME, STRING, "");
        $this->addField(DBConstants::CREATIVE_AD_FORMAT, INTEGER, 0);
        $this->addField(DBConstants::CREATIVE_LINK_TYPE, INTEGER, 2);
        $this->addField(DBConstants::CREATIVE_TITLE, STRING, "");
        $this->addField(DBConstants::CREATIVE_DESCRIPTION, STRING, "");
        $this->addField(DBConstants::CREATIVE_CAPTION, STRING, "");
        $this->addField(DBConstants::CREATIVE_MESSAGE, STRING, "");
        $this->addField(DBConstants::CREATIVE_PAGE_ID, STRING, "");
        $this->addField(DBConstants::CREATIVE_IMAGE_HASH, STRING, "");
        $this->addField(DBConstants::CREATIVE_URL, STRING, "");
        $this->addField(DBConstants::CREATIVE_CALLTOACTION_TYPE, INTEGER, 0);
        $this->addField(DBConstants::CREATIVE_IMAGE_UUIDS, STRING, "");
        $this->addField(DBConstants::CREATIVE_CAROUSEL_NAMES, STRING, "");
        $this->addField(DBConstants::CREATIVE_CAROUSEL_DESCS, STRING, "");
        $this->addField(DBConstants::CREATIVE_SLIDESHOW_DURATION, STRING, "");
        $this->addField(DBConstants::CREATIVE_SLIDESHOW_TRANSITION, STRING, "");
        $this->addField(DBConstants::CREATIVE_CREATE_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::CREATIVE_MODIFY_TIME, STRING, date('Y-m-d H:i:s'));
    }

}