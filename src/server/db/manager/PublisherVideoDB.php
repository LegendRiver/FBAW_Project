<?php


class PublisherVideoDB extends AbstractDBManager
{
    public function __construct()
    {
        $this->TableName = DBConstants::VIDEO_TABLE_NAME;
        parent::__construct();
    }

    public function addVideoRecord(PublisherVideoEntity $entity)
    {
        try
        {
            $this->initDBField($entity);

            $recordNum = 0;
            $errorCode = $this->addRecord($recordNum);
            if ($errorCode != OK)
            {
                $message = sprintf("Insert Fb video <%s> failed, error code<%d>.", $entity->getVideoId(), $errorCode);
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
        $this->dbEntityInstance = new PublisherVideoEntity();

        $this->field2FunctinName = array(
            DBConstants::VIDEO_UUID => 'setUuid',
            DBConstants::VIDEO_PUBLISHER_ID => 'setVideoId',
            DBConstants::VIDEO_TYPE => 'setVideoType',
            DBConstants::VIDEO_DURATION_TIME => 'setDurationTime',
            DBConstants::VIDEO_TRANSITION_TIME => 'setTransitionTime',
        );
    }

    private function initDBField(PublisherVideoEntity $entity)
    {
        $uuid = $entity->getUuid();
        $videoId = $entity->getVideoId();
        $type = $entity->getVideoType();
        $duration = $entity->getDurationTime();
        $transition = $entity->getTransitionTime();

        $this->setFieldValue(DBConstants::VIDEO_UUID, $uuid);
        $this->setFieldValue(DBConstants::VIDEO_PUBLISHER_ID, $videoId);
        $this->setFieldValue(DBConstants::VIDEO_TYPE, $type);
        $this->setFieldValue(DBConstants::VIDEO_DURATION_TIME, $duration);
        $this->setFieldValue(DBConstants::VIDEO_TRANSITION_TIME, $transition);
    }

    protected function initTableFields()
    {
        $this->addField(DBConstants::VIDEO_UUID, STRING, '');
        $this->addField(DBConstants::VIDEO_PUBLISHER_ID, STRING, '');
        $this->addField(DBConstants::VIDEO_TYPE, INTEGER, 0);
        $this->addField(DBConstants::VIDEO_DURATION_TIME, INTEGER, 0);
        $this->addField(DBConstants::VIDEO_TRANSITION_TIME, INTEGER, 0);
    }
}