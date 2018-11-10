<?php

    /**
     * Created by IntelliJ IDEA.
     * User: zengtao
     * Date: 12/31/15
     * Time: 6:23 PM
     */
    class CDbMySqliInterface
    {
        protected $ServerIp;//String
        protected $ServerPort;//int
        protected $UserId;//String
        protected $Password;//String
        protected $DatabaseName;//String
        protected $Connection;//int
        protected $ErrorNo;//int
        protected $ErrorMsg;//String

        private $Config = null;
        private $Log = null;

        private static $CHECK_TABLE_EXISTS_SQL = "SELECT COUNT(1) AS TABLE_EXISTS FROM information_schema.tables WHERE (table_schema = ?) AND (table_name = ?)";
        private static $QUERY_TABLE_SQL = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ?";
        private static $TABLE_EXISTS = "TABLE_EXISTS";
        private static $TABLE_NAME = "TABLE_NAME";

        function __construct($config, $log)
        {
            $this->Config = $config;
            $this->Log = $log;

            $this->ServerIp = $this->Config->getConfigItemValue(DbServerIp);
            $this->ServerPort = $this->Config->getConfigItemValue(DbServerPort);
            $this->UserId = $this->Config->getConfigItemValue(DbUserId);
            $this->Password = $this->Config->getConfigItemValue(DbUserPassword);
            $this->DatabaseName = $this->Config->getConfigItemValue(DbDatabaseName);

            $errorCode = $this->initDbConnection();
            if($errorCode != OK)
            {
                $this->Log->writeLog(Emergency, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("Db connection init failed <%s,%d>", $this->ErrorMsg, $this->ErrorNo));
            }
        }

        function __destruct()
        {
            $this->closeDbConnection();
            unset($this);
        }

        private function initDbConnection()
        {
            $this->Connection = new mysqli($this->ServerIp, $this->UserId, $this->Password, $this->DatabaseName, $this->ServerPort);
            $this->ErrorNo = intval($this->Connection->connect_errno);
            if ($this->ErrorNo != 0)
            {
                $this->ErrorMsg = sprintf("Connect db server fail,Server IP <%s:%d,%s,%s,%s>", $this->ServerIp, $this->ServerPort, $this->UserId, $this->Password, $this->DatabaseName);
                $this->Log->writeLog(Emergency, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("<%s,%d>", $this->ErrorMsg, $this->ErrorNo));

                return CONNECT_DB_SERVER_FAIL;
            }

            if (!$this->Connection->set_charset(DB_CHARSET))
            {
                $this->ErrorNo = intval($this->Connection->connect_errno);
                $this->ErrorMsg = sprintf("Change db charset to <%s> failed.", DB_CHARSET);
                $this->Log->writeLog(Emergency, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("<%s,%d>", $this->ErrorMsg, $this->ErrorNo));

                return ERR_CHANGE_DB_CHARSET_FAILED;
            }

            return OK;
        }

        private function closeDbConnection()
        {
            unset($this->Connection);
            $this->Connection = null;
        }

        public function closeAutoCommit()
        {
            $this->Connection->autocommit(false);
        }

        public function openAutoCommit()
        {
            $this->Connection->autocommit(true);
        }

        public function beginTransaction()
        {
            return $this->Connection->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
        }

        public function commit()
        {
            return $this->Connection->commit();
        }

        public function rollback()
        {
            return $this->Connection->rollback();
        }

        public function callFunction($classInstance, $functionName, $parameters)
        {
            return call_user_func_array(array($classInstance, $functionName), $parameters);
        }

        public function checkTableExists($tableName, &$isTableExists)
        {
            $isTableExists = false;
            $queryStmt = $this->Connection->stmt_init();
            if (!$queryStmt->prepare(self::$CHECK_TABLE_EXISTS_SQL))
            {
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("<%d,%s>", $this->ErrorNo, $this->ErrorMsg));

                return ERR_STMT_PREPARE_SQL_FAILED;
            }

            $parameters = array();
            $dbNameParameter = new CDbParameter("database_name", $this->DatabaseName, "s");
            $tableNameParameter = new CDbParameter("table_name", $tableName, "s");
            array_push($parameters, $dbNameParameter);
            array_push($parameters, $tableNameParameter);

            if (!$this->bindParameters($queryStmt, $parameters))
            {
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("<%d,%s>", $this->ErrorNo, $this->ErrorMsg));

                return ERR_STMT_BIND_PARAMETER_FAILED;
            }

            if (!$queryStmt->execute())
            {
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("<%d,%s>", $this->ErrorNo, $this->ErrorMsg));

                return ERR_EXECUTE_SQL_FAILED;
            }

            $queryStmt->store_result();
            while ($assoc_array = $this->fetchAssocStatement($queryStmt))
            {
                $isTableExists = ($assoc_array[self::$TABLE_EXISTS] == 1);
                break;
            }

            unset($assoc_array);
            $queryStmt->close();

            return OK;
        }

        private function bindParameters($stmt, $dbParameters)
        {
            $parameterArray = array();
            $parameterArray[] = $this->getParameterTypes($dbParameters);
            foreach ($dbParameters as $dbParameter)
            {
                $parameterArray[] = &$dbParameter->Value;
            }

            return $this->callFunction($stmt, "bind_param", $parameterArray);
        }

        private function getParameterTypes($dbParameters)
        {
            $typeString = "";
            foreach ($dbParameters as $dbParameter)
            {
                $typeString = sprintf("%s%s", $typeString, $dbParameter->Type);
            }

            return $typeString;
        }

        public function getTableList(&$tables)
        {
            $queryStmt = $this->Connection->stmt_init();
            if (!$queryStmt->prepare(self::$QUERY_TABLE_SQL))
            {
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("<%d,%s>", $this->ErrorNo, $this->ErrorMsg));

                return ERR_STMT_PREPARE_SQL_FAILED;
            }

            if (!$queryStmt->bind_param("s", $this->DatabaseName))
            {
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("<%d,%s>", $this->ErrorNo, $this->ErrorMsg));

                return ERR_STMT_BIND_PARAMETER_FAILED;
            }

            if (!$queryStmt->execute())
            {
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("<%d,%s>", $this->ErrorNo, $this->ErrorMsg));

                return ERR_EXECUTE_SQL_FAILED;
            }

            $queryStmt->store_result();
            while ($assoc_array = $this->fetchAssocStatement($queryStmt))
            {
                array_push($tables, $assoc_array[self::$TABLE_NAME]);
            }

            $queryStmt->close();

            return OK;
        }

        function fetchAssocStatement($stmt)
        {
            if ($stmt->num_rows > 0)
            {
                $result = array();
                $md = $stmt->result_metadata();
                $params = array();
                while ($field = $md->fetch_field())
                {
                    $params[] = &$result[$field->name];
                }

                call_user_func_array(array($stmt, 'bind_result'), $params);
                if ($stmt->fetch())
                {
                    return $result;
                }
            }

            return null;
        }

        public function executeSql($querySql, $dbParameters, &$changedRecordNumber)
        {
            $queryStmt = $this->Connection->stmt_init();
            if (!$queryStmt->prepare($querySql))
            {
                $changedRecordNumber = 0;
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Prepare sql<%s> failed,error code<%d>, error message<%s>", $querySql, $this->ErrorNo, $this->ErrorMsg));

                return ERR_STMT_PREPARE_SQL_FAILED;
            }

            if (!$this->bindParameters($queryStmt, $dbParameters))
            {
                $changedRecordNumber = 0;
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Bind parameters<%s> failed,error code<%d>, error message<%s>", $querySql, $this->ErrorNo, $this->ErrorMsg));

                return ERR_STMT_BIND_PARAMETER_FAILED;
            }

            if (!$queryStmt->execute())
            {
                $changedRecordNumber = 0;
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute sql<%s> failed,error code<%d>, error message<%s>", $querySql, $this->ErrorNo, $this->ErrorMsg));

                return ERR_EXECUTE_SQL_FAILED;
            }

            $changedRecordNumber = $queryStmt->affected_rows;
            $queryStmt->close();

            return OK;
        }

        public function update($updateQuerySql, $dbParameters, &$updateRecordNumber)
        {
            $queryStmt = $this->Connection->stmt_init();
            if (!$queryStmt->prepare($updateQuerySql))
            {
                $updateRecordNumber = 0;
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Prepare sql<%s> failed,error code<%d>, error message<%s>", $updateQuerySql, $this->ErrorNo, $this->ErrorMsg));

                return ERR_STMT_PREPARE_SQL_FAILED;
            }

            if (!$this->bindParameters($queryStmt, $dbParameters))
            {
                $updateRecordNumber = 0;
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Bind parameters<%s> failed,error code<%d>, error message<%s>", $updateQuerySql, $this->ErrorNo, $this->ErrorMsg));

                return ERR_STMT_BIND_PARAMETER_FAILED;
            }

            if (!$queryStmt->execute())
            {
                $updateRecordNumber = 0;
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute sql<%s> failed,error code<%d>, error message<%s>", $updateQuerySql, $this->ErrorNo, $this->ErrorMsg));

                return ERR_EXECUTE_SQL_FAILED;
            }

            $updateRecordNumber = $queryStmt->affected_rows;
            $queryStmt->close();

            return OK;
        }

        public function insert($insertQuerySql, $dbParameters, &$insertRecordNumber)
        {
            $queryStmt = $this->Connection->stmt_init();
            if (!$queryStmt->prepare($insertQuerySql))
            {
                $insertRecordNumber = 0;
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("<%d,%s>", $this->ErrorNo, $this->ErrorMsg));

                return ERR_STMT_PREPARE_SQL_FAILED;
            }

            if (!$this->bindParameters($queryStmt, $dbParameters))
            {
                $insertRecordNumber = 0;
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("<%d,%s>", $this->ErrorNo, $this->ErrorMsg));

                return ERR_STMT_BIND_PARAMETER_FAILED;
            }

            if (!$queryStmt->execute())
            {
                $insertRecordNumber = 0;
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("<%d,%s>", $this->ErrorNo, $this->ErrorMsg));
                $queryStmt->close();
                return ERR_EXECUTE_SQL_FAILED;
            }

            $insertRecordNumber = $queryStmt->affected_rows;
            $queryStmt->close();

            return OK;
        }

        public function queryRecords($querySql, $dbParameters, &$recordRows)
        {
            $queryStmt = $this->Connection->stmt_init();

            if(!$queryStmt)
            {
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Prepare query sql <%s> failed, error code<%d>, error message<%s>.", $querySql, $this->ErrorNo, $this->ErrorMsg));

                return ERR_STMT_INIT_FAILED;
            }

            if (!$queryStmt->prepare($querySql))
            {
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Prepare query sql <%s> failed, error code<%d>, error message<%s>.", $querySql, $this->ErrorNo, $this->ErrorMsg));
                return ERR_STMT_PREPARE_SQL_FAILED;
            }

            if(count($dbParameters) > 0)
            {
                if (!$this->bindParameters($queryStmt, $dbParameters))
                {
                    $this->ErrorNo = $this->Connection->errno;
                    $this->ErrorMsg = $this->Connection->error;
                    $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Prepare query sql <%s> failed, error code<%d>, error message<%s>.", $querySql, $this->ErrorNo, $this->ErrorMsg));
                    $queryStmt->close();
                    return ERR_STMT_BIND_PARAMETER_FAILED;
                }
            }

            if (!$queryStmt->execute())
            {
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("<%d,%s>", $this->ErrorNo, $this->ErrorMsg));
                $queryStmt->close();
                return ERR_EXECUTE_SQL_FAILED;
            }

            $queryStmt->store_result();
            while ($assoc_array = $this->fetchAssocStatement($queryStmt))
            {
                array_push($recordRows, $assoc_array);
            }

            $queryStmt->close();

            return OK;
        }

        public function  deleteRecords($deleteSql, $dbParameters, &$deleteRecordNumber)
        {
            $queryStmt = $this->Connection->stmt_init();
            if (!$queryStmt->prepare($deleteSql))
            {
                $deleteRecordNumber = 0;
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("<%d,%s>", $this->ErrorNo, $this->ErrorMsg));

                return ERR_STMT_PREPARE_SQL_FAILED;
            }

            if (!$this->bindParameters($queryStmt, $dbParameters))
            {
                $deleteRecordNumber = 0;
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("<%d,%s>", $this->ErrorNo, $this->ErrorMsg));

                return ERR_STMT_BIND_PARAMETER_FAILED;
            }

            if (!$queryStmt->execute())
            {
                $deleteRecordNumber = 0;
                $this->ErrorNo = $this->Connection->errno;
                $this->ErrorMsg = $this->Connection->error;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("<%d,%s>", $this->ErrorNo, $this->ErrorMsg));
                $queryStmt->close();
                return ERR_EXECUTE_SQL_FAILED;
            }

            $deleteRecordNumber = $queryStmt->affected_rows;
            $queryStmt->close();

            return OK;
        }
    }