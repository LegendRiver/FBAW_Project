<?php


class PublisherImageDB extends ELIBaseObject
{
    public function __construct()
    {
        $this->TableName = DBConstants::IMAGE_TABLE_NAME;
        parent::__construct();
    }

    public function addImageRecord(PublisherImageEntity $entity)
    {
        try
        {
            $this->initDBField($entity);

            $recordNum = 0;
            $errorCode = $this->addRecord($recordNum);
            if ($errorCode != OK)
            {
                $message = sprintf("Insert Fb Image <%s> failed, error code<%d>.", $entity->getImageName(), $errorCode);
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

    private function initDBField(PublisherImageEntity $entity)
    {
        $uid = $entity->getUuid();
        $imageId = $entity->getImageId();
        $accountId = $entity->getAccountId();
        $imageHash = $entity->getImageHash();
        $imageUrl = $entity->getImageUrl();
        $name = $entity->getImageName();
        $height = $entity->getHeight();
        $width = $entity->getWidth();
        $localPath = $entity->getLocalPath();
        $originalUrl = $entity->getOriginalUrl();

        $this->setFieldValue(DBConstants::IMAGE_UUID, $uid);
        $this->setFieldValue(DBConstants::IMAGE_ID, $imageId);
        $this->setFieldValue(DBConstants::IMAGE_ACCOUNT, $accountId);
        $this->setFieldValue(DBConstants::IMAGE_HASH, $imageHash);
        $this->setFieldValue(DBConstants::IMAGE_URL, $imageUrl);
        $this->setFieldValue(DBConstants::IMAGE_NAME, $name);
        $this->setFieldValue(DBConstants::IMAGE_HEIGHT, $height);
        $this->setFieldValue(DBConstants::IMAGE_WIDTH, $width);
        $this->setFieldValue(DBConstants::IMAGE_LOCAL_PATH, $localPath);
        $this->setFieldValue(DBConstants::IMAGE_ORIGINAL_URL, $originalUrl);
    }

    protected function initTableFields()
    {
        $this->addField(DBConstants::IMAGE_UUID, STRING, "");
        $this->addField(DBConstants::IMAGE_ID, STRING, "");
        $this->addField(DBConstants::IMAGE_ACCOUNT, STRING, "");
        $this->addField(DBConstants::IMAGE_HASH, STRING, "");
        $this->addField(DBConstants::IMAGE_URL, STRING, "");
        $this->addField(DBConstants::IMAGE_NAME, STRING, "");
        $this->addField(DBConstants::IMAGE_HEIGHT, INTEGER, 0);
        $this->addField(DBConstants::IMAGE_WIDTH, INTEGER, 0);
        $this->addField(DBConstants::IMAGE_LOCAL_PATH, STRING, "");
        $this->addField(DBConstants::IMAGE_ORIGINAL_URL, STRING, "");
    }
}