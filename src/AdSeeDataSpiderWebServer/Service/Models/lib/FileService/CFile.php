<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 15/1/5
 * Time: PM11:26
 */
class CFile extends CBaseObject
{
    /*
     *  +---------------+---------------+------+-----+---------+-------+
        | Field         | Type          | Null | Key | Default | Extra |
        +---------------+---------------+------+-----+---------+-------+
        | ID            | varchar(40)   | NO   | PRI | NULL    |       |
        | NAME          | varchar(256)  | NO   |     | NULL    |       |
        | MD5           | varchar(40)   | NO   | UNI | NULL    |       |
        | TYPE          | varchar(32)   | NO   |     | NULL    |       |
        | SIZE          | int(11)       | NO   |     | NULL    |       |
        | USER_ID       | varchar(40)   | NO   |     | NULL    |       |
        | STORE_PATH    | varchar(1024) | NO   |     | NULL    |       |
        | UPLOAD_STATUS | int(11)       | NO   |     | NULL    |       |
        | UPLOAD_TIME   | datetime      | NO   |     | NULL    |       |
        | TOTAL_CHUNKS  | int(11)       | NO   |     | NULL    |       |
        | DESCRIPTION   | varchar(64)   | YES  |     | NULL    |       |
        +---------------+---------------+------+-----+---------+-------+
     */
    private static $TABLE_NAME = "T_UPLOAD_FILE";
    private static $ID = "ID";
    private static $NAME = "NAME";
    private static $MD5 = "MD5";
    private static $TYPE = "TYPE";
    private static $SIZE = "SIZE";
    private static $USER_ID = "USER_ID";
    private static $STORE_PATH = "STORE_PATH";
    private static $DESCRIPTION = "DESCRIPTION";
    private static $UPLOAD_STATUS = "UPLOAD_STATUS";
    private static $UPLOAD_TIME = "UPLOAD_TIME";
    private static $TOTAL_CHUNKS = "TOTAL_CHUNKS";

    private static $PARAMETER_FILE_EXISTS_OVERWRITE = "EXISTS_OVERWRITE";
    private static $PARAMETER_FILE_DATA = "FILE_DATA";

    private static $PARAMETER_UPLOAD_SESSION_ID = "UPLOAD_SESSION_ID";
    private static $PARAMETER_FILE_CHUNK_INDEX = "CHUNK_INDEX";
    private static $PARAMETER_FILE_CHUNK_POS = "CHUNK_POS";
    private static $PARAMETER_FILE_CHUNK_SIZE = "CHUNK_SIZE";
    private static $PARAMETER_FILE_CHUNK_DATA = "CHUNK_DATA";
    private static $PARAMETER_FILE_URL = "URL";

    private $UploadStoreRootPath = "";
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CFile";
        $this->TableName = self::$TABLE_NAME;
        parent::__construct($config, $log, $dbInterface);
        $this->initUploadRootPath();
        $this->addAllowAccessFunction('startUpload');
        $this->addAllowAccessFunction('uploadBlock');
        $this->addAllowAccessFunction('endUpload');
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function startUpload($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            PARAMETER_CALL_TAG,
            self::$NAME,
            self::$MD5,
            self::$SIZE,
            self::$TYPE,
            self::$TOTAL_CHUNKS);

        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $accessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $postParameters = array();
        $postParameters[SERVICE_NAME]="EliSystemManagerService";
        $postParameters[CLASS_INSTANCE]="CEliSystemManager";
        $postParameters[FUNCTION_NAME]="isUserTokenStillValid";
        $postParameters[PARAMETER_CALL_TAG]=$callTag;
        $postParameters[PARAMETER_ACCESS_TOKEN]=$accessToken;
        $checkTokenResult = CHttpRequest::sendPost(SERVICE_URL_CHECK_USERTOKEN, $postParameters, true, false);
        if(!$checkTokenResult)
        {
            $result->setErrorCode(ERR_CHECK_USER_ACCESS_TOKEN_FAILED);
            $result->setMessage(sprintf("Check user access token <%s> failed, error code<%d>.", $accessToken, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $checkTokenResult = str_replace("\xEF\xBB\xBF",'',$checkTokenResult);//clean utf bom
        $checkTokenResultDecoded = json_decode($checkTokenResult);
        if(!$checkTokenResultDecoded)
        {
            $result->setErrorCode(ERR_CHECK_TOKEN_RESULT_DECODE_FAILED);
            $result->setMessage(sprintf("Check user access token <%s,%s> json decode failed, error code<%d>.", $accessToken, $checkTokenResult, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $errorCode = intval($checkTokenResultDecoded->{CResult::$ERROR_CODE});
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Check user access token <%s> invalid, error code<%d>.", $accessToken, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
            return $result;
        }

        $userId = $checkTokenResultDecoded->{CResult::$DATA}[0];
        $fileName = $parameters[self::$NAME];
        $fileMd5 = $parameters[self::$MD5];
        $fileSize = $parameters[self::$SIZE];
        $fileType = $parameters[self::$TYPE];
        $fileTotalChunks = $parameters[self::$TOTAL_CHUNKS];

        if(is_null($fileType))
        {
            $result->setErrorCode(ERR_MEDIA_TYPE_INVALID);
            $result->setMessage(sprintf("Media type <%s> invalid.", $fileType));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if (!is_numeric($fileSize))
        {
            $result->setErrorCode(ERR_PARAMETER_FILE_SIZE_FORMAT_INVALID);
            $result->setMessage(sprintf("Parameter <%s> is null.", self::$SIZE));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $fileSize = intval($fileSize);
        if ($fileSize <= 0)
        {
            $result->setErrorCode(ERR_FILE_SIZE_INVALID);
            $result->setMessage(sprintf("File size <%d> invalid.", $fileSize));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if ($fileSize > UPLOAD_FILE_MAX_SIZE)
        {
            $result->setErrorCode(ERR_FILE_SIZE_IS_OVERFLOW);
            $result->setMessage(sprintf("File size <%d> invalid.", $fileSize));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if (!$fileMd5)
        {
            $result->setErrorCode(ERR_FILE_MD5_IS_NULL);
            $result->setMessage(sprintf("File md5 is null, error code<%d>.", $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $existOverwrite = true;
        if (array_key_exists(self::$PARAMETER_FILE_EXISTS_OVERWRITE, $parameters))
        {
            $existOverwrite = $parameters[self::$PARAMETER_FILE_EXISTS_OVERWRITE];
        }

        if($this->checkParameter(self::$DESCRIPTION, $parameters, $result))
        {
            $description = $parameters[self::$DESCRIPTION];
        }
        else
        {
            $description = "";
        }

        $mediaTypeName = $this->getMediaTypePath($fileType);
        $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
        $fileFullPath = sprintf("/%s/%s/%s.%s", $userId, $mediaTypeName, $fileMd5, $fileExtension);
        $serverFileName = sprintf("%s/%s", $this->UploadStoreRootPath, $fileFullPath);
        $attachmentId = CPublic::getGuid();
        $currentDate = new DateTime(date('Y-m-d H:i:s'));

        $this->setFieldValue(self::$ID, $attachmentId);
        $this->setFieldValue(self::$NAME, $fileName);
        $this->setFieldValue(self::$USER_ID, $userId);
        $this->setFieldValue(self::$MD5, $fileMd5);
        $this->setFieldValue(self::$TYPE, $fileType);
        $this->setFieldValue(self::$SIZE, $fileSize);
        $this->setFieldValue(self::$STORE_PATH, $fileFullPath);
        $this->setFieldValue(self::$UPLOAD_STATUS, ATTACHMENT_UPLOAD_INIT);
        $this->setFieldValue(self::$UPLOAD_TIME, $currentDate->format('Y-m-d H:i:s'));
        $this->setFieldValue(self::$TOTAL_CHUNKS,$fileTotalChunks);
        $this->setFieldValue(self::$DESCRIPTION, $description);

        $errorCode = $this->initUpload($existOverwrite, $serverFileName);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Init upload file <%s> env failed.", $fileName));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setMessage("");
        $result->setData(array(self::$UPLOAD_STATUS=>UPLOAD_SERVER_RESULT_INIT,
            "SESSION_ID"=>$attachmentId,
            self::$ID=>$attachmentId));

        return $result;
    }

    public function uploadBlock($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            self::$PARAMETER_UPLOAD_SESSION_ID,
            self::$PARAMETER_FILE_CHUNK_INDEX,
            self::$PARAMETER_FILE_CHUNK_POS,
            self::$PARAMETER_FILE_CHUNK_SIZE,
            self::$PARAMETER_FILE_CHUNK_DATA);

        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $uploadSessionId = $parameters[self::$PARAMETER_UPLOAD_SESSION_ID];
        $chunkIndex = intval($parameters[self::$PARAMETER_FILE_CHUNK_INDEX]);
        $chunkPos = intval($parameters[self::$PARAMETER_FILE_CHUNK_POS]);
        $chunkSize = intval($parameters[self::$PARAMETER_FILE_CHUNK_SIZE]);
        $chunkData = $parameters[self::$PARAMETER_FILE_CHUNK_DATA];

        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $uploadSessionId);
        $errorCode = $this->load();
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setErrorCode($errorCode);
            $result->setMessage(sprintf("Upload session id <%s> invalid, error code <%d>.", $uploadSessionId, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $errorCode = $this->writeFileChunk($chunkPos, $chunkSize, $chunkData);
        $result->setErrorCode($errorCode);
        if($errorCode!=OK)
        {
            $result->setData(array(self::$UPLOAD_STATUS=>UPLOAD_CHUNK, "CHUNK_INDEX"=>$chunkIndex));
            $result->setMessage(sprintf("Write chunk block <%d> failed, upload session id <%s>.", $chunkIndex, $uploadSessionId));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }


        $result->setData(array(self::$UPLOAD_STATUS=>UPLOAD_CHUNK, "CHUNK_INDEX"=>$chunkIndex));
        $result->setMessage("");
        return $result;
    }

    public function endUpload($parameters)
    {
        $changedRecordNumber = 0;
        $result = new CResult();
        $needCheckParameters = array(self::$PARAMETER_UPLOAD_SESSION_ID);
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $uploadSessionId = $parameters[self::$PARAMETER_UPLOAD_SESSION_ID];
        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $uploadSessionId);
        $errorCode = $this->load();
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setErrorCode($errorCode);
            $result->setMessage(sprintf("Upload session id <%s> invalid.", $uploadSessionId));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $absoluteFilePath = $this->getAbsoluteFilePath();
        try
        {
            $calFileMd5 = strtoupper(md5_file($absoluteFilePath));

        }
        catch(Exception $exception)
        {
            $this->setFieldValue(self::$UPLOAD_STATUS, ATTACHMENT_UPLOAD_FAILED);
            $this->deleteRecord($changedRecordNumber);
            $result->setErrorCode(ERR_CAL_FILE_MD5_FAILED);
            $result->setMessage(sprintf("Cal file <%s> md5 failed, error message <%s>.", $absoluteFilePath, $exception->getMessage()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $userInputMd5 = $this->Fields[self::$MD5]->Value;
        if (strcasecmp($calFileMd5, $userInputMd5) != 0)
        {
            try
            {
                unlink($absoluteFilePath);
            }
            catch(Exception $exception)
            {
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Delete temp file <%s> failed, error message <%s>.", $absoluteFilePath, $exception->getMessage()));
            }

            $this->setFieldValue(self::$UPLOAD_STATUS, ATTACHMENT_UPLOAD_FAILED);
            $this->deleteRecord($changedRecordNumber);
            $result->setErrorCode(ERR_FILE_MD5_NOT_EQUAL);
            $result->setMessage(sprintf("Write file <%s> content has some error, file checksum <%s> not equal <%s>.", $absoluteFilePath, $calFileMd5, $userInputMd5));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $this->setFieldValue(self::$UPLOAD_STATUS, ATTACHMENT_UPLOAD_SUCCESS);
        $errorCode = $this->updateRecord($changedRecordNumber);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Update upload session <%s> failed.", $uploadSessionId));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $result->setData(array(self::$UPLOAD_STATUS=>UPLOAD_END_UPLOAD));
        $result->setMessage("");

        return $result;
    }

    private function writeFileChunk($chunkPos, $chunkSize, $chunkData)
    {
        $fileHandle = null;
        $errorCode = $this->getFileHandle($fileHandle);
        if ($errorCode != OK)
        {
            return $errorCode;
        }


        if (fseek($fileHandle, $chunkPos, SEEK_SET) == -1)
        {
            return ERR_FILE_SEEK_FAILED;
        }


        $writeLen = fwrite($fileHandle, base64_decode($chunkData), $chunkSize);
        if ($writeLen === false)
        {
            return ERR_WRITE_BLOCK_DATA_FAIL;
        }

        if($writeLen != $chunkSize)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Write size <%d>, chunk data size <%d>.", $writeLen, $chunkSize));
            return ERR_WRITE_DATA_LENGTH_NOT_EQUAL_DATA_LENGTH;
        }

        return OK;
    }

    public function getFile($attachmentId, $uploadStatus)
    {
        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $attachmentId);
        $this->setPrimaryKey(self::$UPLOAD_STATUS, $uploadStatus);
        $errorCode = $this->load();
        if($errorCode != OK)
        {
            return null;
        }

        return $this;
    }

    private function removeAttachment($attachmentId)
    {
        $changedRecordNumber = 0;
        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $attachmentId);
        $filePath =  sprintf("%s/%s", $_SERVER['DOCUMENT_ROOT'],$this->Fields[self::$STORE_PATH]);
        if(!$this->deleteRecord($changedRecordNumber))
        {
            return ERR_DELETE_ATTACHMENT_INFO_FAILED;
        }

        if (!file_exists($filePath))
        {
            return ERR_FILE_NOT_EXISTS;
        }

        if(!unlink($filePath))
        {
            return ERR_DELETE_FILE_FAILED;
        }

        return OK;
    }

    private function getFileUrlPath($filePath='')
    {
    	if (!$filePath)
        {
        	return "";
    	}

        return sprintf("http://%s%s","www.eliads.com:9090/UPLOAD", $filePath);
    }

    public function getAttachmentByID($attachmentId, $uploadStatus, &$resultFields, &$fileInfoArray)
    {
        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $attachmentId);
        $this->setPrimaryKey(self::$UPLOAD_STATUS, $uploadStatus);
        $errorCode = $this->load();
        if($errorCode != OK)
        {
            array_push($resultFields, FILE_NAME);
            array_push($resultFields, FILE_URL);

            array_push($fileInfoArray, "");
            array_push($fileInfoArray, "");
            return $errorCode;
        }

        array_push($resultFields, FILE_NAME);
        array_push($resultFields, FILE_URL);

        array_push($fileInfoArray, $this->Fields[self::$NAME]->Value);
        array_push($fileInfoArray, $this->getFileUrlPath($this->Fields[self::$STORE_PATH]->Value));

        return $errorCode;
    }
    
    public function uploadWholeFile($parameters)
    {
        $existOverwrite = true;
        $result = new CResult();
        $needCheckParameters = array(
            self::$NAME,
            self::$MD5,
            self::$SIZE,
            self::$TYPE,
            self::$PARAMETER_FILE_DATA);

        if (!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $fileName = $parameters[self::$NAME];
        $fileSize = $parameters[self::$SIZE];
        $fileData = $parameters[self::$PARAMETER_FILE_DATA];
        $fileMd5 = strtoupper($parameters[self::$MD5]);
        $fileMediaType = $parameters[self::$TYPE];

        if(is_null($fileMediaType))
        {
            $result->setErrorCode(ERR_MEDIA_TYPE_INVALID);
            $result->setMessage(sprintf("Media type <%s> invalid.", $fileMediaType));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setMessage(sprintf("File media type <%s>.", $fileMediaType));
        if (!is_numeric($fileSize))
        {
            $result->setErrorCode(ERR_PARAMETER_FILE_SIZE_FORMAT_INVALID);
            $result->setMessage(sprintf("Parameter<%s> is null.", self::$SIZE));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $fileSize = intval($fileSize);
        if ($fileSize <= 0)
        {
            $result->setErrorCode(ERR_FILE_SIZE_INVALID);
            $result->setMessage(sprintf("File size <%d> invalid.", $fileSize));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if ($fileSize > UPLOAD_FILE_MAX_SIZE) {
            $result->setErrorCode(ERR_FILE_SIZE_IS_OVERFLOW);
            $result->setMessage(sprintf("File size <%d> invalid.", $fileSize));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if (!$fileMd5)
        {
            $result->setErrorCode(ERR_FILE_MD5_IS_NULL);
            $result->setMessage(sprintf("File md5 is null, error code<%d>.", $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if (array_key_exists(CFile::$PARAMETER_FILE_EXISTS_OVERWRITE, $parameters))
        {
            $existOverwrite = $parameters[CFile::$PARAMETER_FILE_EXISTS_OVERWRITE];
        }

        if (is_null($fileData))
        {
            $result->setErrorCode(ERR_FILE_DATA_IS_NULL);
            $result->setMessage(sprintf("File data is null, error code<%d>.", $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if($this->checkParameter(self::$DESCRIPTION, $parameters, $result))
        {
            $description = $parameters[self::$DESCRIPTION];
        }
        else
        {
            $description = "";
        }

        $fileUploadStorePath = $this->Config->getConfigItemValue(UploadFileStorePath);
        $mediaTypeName = strtoupper($fileMediaType);
        $fileExtension = pathinfo ( $fileName, PATHINFO_EXTENSION);
        $fileFullPath = sprintf("/%s/%s/%s.%s", $fileUploadStorePath, $mediaTypeName, $fileMd5, $fileExtension);
        $serverFileName = sprintf("%s%s", $_SERVER['DOCUMENT_ROOT'], $fileFullPath);

        $attachmentId = CPublic::getGuid();
        $currentDate = date('Y-m-d H:i:s');
        $this->setFieldValue(self::$ID, $attachmentId);
        $this->setFieldValue(self::$NAME, $fileName);
        $this->setFieldValue(self::$USER_ID, $attachmentId);
        $this->setFieldValue(self::$MD5, $fileMd5);
        $this->setFieldValue(self::$TYPE, $fileMediaType);
        $this->setFieldValue(self::$SIZE, $fileSize);
        $this->setFieldValue(self::$STORE_PATH, $fileFullPath);
        $this->setFieldValue(self::$UPLOAD_STATUS, ATTACHMENT_UPLOAD_INIT);
        $this->setFieldValue(self::$TOTAL_CHUNKS, 1);
        $this->setFieldValue(self::$UPLOAD_TIME, $currentDate);
        $this->setFieldValue(self::$DESCRIPTION, $description);

        $this->Log->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());

        $errorCode = $this->initUpload($existOverwrite, $serverFileName);
        if ($errorCode != OK)
        {
            $result->setErrorCode($errorCode);
            $result->setMessage(sprintf("File init upload failed, error code<%d>.", $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $fileBlock = new CChunk();
        $fileBlock->BlockData = $fileData;
        $fileBlock->BlockSize = $fileSize;
        $fileBlock->Pos = 0;
        $fileBlock->UploadSessionId = $attachmentId;

        $errorCode = $this->writeBlock($fileBlock);
        $this->Log->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
        if ($errorCode != OK)
        {
            $result->setErrorCode($errorCode);
            $result->setMessage(sprintf("File write failed, error code<%d>.", $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $errorCode = $this->closeUpload(null);
        $this->Log->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
        $result->setErrorCode($errorCode);
        if ($errorCode != OK)
        {
            $result->setMessage(sprintf("File write failed, error code<%d>.", $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setErrorCode($errorCode);
        $result->setMessage(sprintf("File <%s> write success <%d>, server file path<%s>.", $fileName, $fileSize));
        $result->setData(array());

        return $result;
    }

    private function initUploadRootPath()
    {
        $this->UploadStoreRootPath = $this->Config->getConfigItemValue(UploadFileStorePath);
        if(!file_exists($this->UploadStoreRootPath))
        {
            $this->UploadStoreRootPath = sprintf("%s/%s", $_SERVER['DOCUMENT_ROOT'], "UPLOAD");
        }

        $this->Log->writeLog(Debug, __FILE__, __FUNCTION__, __LINE__, sprintf("Upload root path<%s>.", $this->UploadStoreRootPath));
    }

    private function getAbsoluteFilePath()
    {
        return sprintf("%s/%s", $this->UploadStoreRootPath, $this->Fields[self::$STORE_PATH]->Value);
    }

    private function getMediaTypePath($mediaType)
    {
        return strtoupper($mediaType);
    }

    private function getFileHandle(&$fileHandle)
    {
        $storeFile = $this->getAbsoluteFilePath();
        $storeDirectory = dirname($storeFile);

        $this->Log->writeLog(Debug, __FILE__, __FUNCTION__, __LINE__, sprintf("Store file<%s> directory<%s>.", $storeFile, $storeDirectory));

        if (!is_dir($storeDirectory))
        {
            $result = mkdir($storeDirectory, 0777, true);
            if (!$result)
            {
                return ERR_CREATE_STORE_PATH_FAIL;
            }
        }

        $fileHandle = fopen($storeFile, "a+");
        return OK;
    }

    private function initUpload($existsOverwrite, $filePath)
    {
        if (file_exists($filePath))
        {
            if($existsOverwrite)
            {
                unlink($filePath);
            }
            else
            {
                return ERR_FILE_EXISTS;
            }
        }

        $recordNumber = 0;
        return $this->addRecord($recordNumber);
    }

    private function writeBlock($fileBlock)
    {
        $fileHandle = null;
        $result = $this->getFileHandle($fileHandle);
        if ($result != OK)
        {
            return $result;
        }

        if (fseek($fileHandle, $fileBlock->Pos, SEEK_SET) == -1)
        {
            return ERR_FILE_SEEK_FAILED;
        }

        $data = base64_decode($fileBlock->BlockData);
        if(!$data)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Base64 decode failed,block size<%lu> error code<%d>", $fileBlock->BlockSize, ERR_USER_INFO_BASE64_DECODER_FAIL));
            return ERR_USER_INFO_BASE64_DECODER_FAIL;
        }

        $writeLength = fwrite($fileHandle, $data, $fileBlock->BlockSize);
        if (!$writeLength)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Write block <%d>, block size <%d>.", $writeLength, $fileBlock->BlockSize));
            return ERR_WRITE_BLOCK_DATA_FAIL;
        }

        if($writeLength != $fileBlock->BlockSize)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Write length<%d>, block size<%d>.", $writeLength, $fileBlock->BlockSize));
            return ERR_WRITE_FILE_FAILED;
        }

        return OK;
    }

    private function closeUpload($fileBlock)
    {
        $changedRecordNumber = 0;
        $this->setPrimaryKey(self::$ID, $this->Fields[self::$ID]);
        if ($fileBlock)
        {
            $errorCode = $this->writeBlock($fileBlock);
            if ($errorCode != OK)
            {
                $this->setFieldValue(self::$UPLOAD_STATUS, ATTACHMENT_UPLOAD_FAILED);
                return $this->updateRecord($changedRecordNumber);
            }
        }

        $fileMd5 = strtoupper(md5_file($this->getAbsoluteFilePath()));
        if (strcasecmp($fileMd5, $this->Fields[self::$MD5]) == 0)
        {
            $this->setFieldValue(self::$UPLOAD_STATUS, ATTACHMENT_UPLOAD_SUCCESS);
            return $this->updateRecord($changedRecordNumber);
        }

        unlink($this->getAbsoluteFilePath());
        $this->setFieldValue(self::$UPLOAD_STATUS, ATTACHMENT_UPLOAD_FAILED);

        return $this->updateRecord($changedRecordNumber);
    }

    /**
     * init table fields
     */
    protected function initTableFields()
    {
        // TODO: Implement initProperties() method.
        $this->addField(self::$ID, STRING, "");
        $this->addField(self::$NAME, STRING, "");
        $this->addField(self::$MD5, STRING, "");
        $this->addField(self::$TYPE, STRING, "");
        $this->addField(self::$SIZE, INTEGER, 0);
        $this->addField(self::$TOTAL_CHUNKS, INTEGER, 0);
        $this->addField(self::$USER_ID, STRING, "");
        $this->addField(self::$UPLOAD_STATUS, INTEGER, ATTACHMENT_UPLOAD_INIT);
        $this->addField(self::$STORE_PATH, STRING, "");
        $this->addField(self::$UPLOAD_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$DESCRIPTION, STRING, "");
    }


    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }
}
