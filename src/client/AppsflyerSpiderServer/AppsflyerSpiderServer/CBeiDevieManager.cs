using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace AppsflyerSpiderServer
{
    public class CBeiDevieManager
    {
        private CDbConnection _DbConnection = null;
        private CSystemLog _SystemLog = null;
        private string _QueryServiceUrl = string.Empty;
        private Dictionary<string, CBeiDouDevice> _DbBeiDouDeviceTable = null;
        private Dictionary<string, CBeiDouDevice> _RemoteServerBeiDouDeviceTable = null;

        private static string _QUERY_ALL_BEIDOU_DEVICE_SQL = "SELECT ID,NAME,HAS_CAMER,RTSP_ADDRESS," +
            "LAST_MODIFY_TIME,DEVICE_TYPE,DEVICE_STATE,LONGITUDE,LATITUDE,ALTITUDE,ORGANIZATION_CODE,LAST_LOCATE_TIME," +
            "LONGITUDE_DIRECTION,LATITUDE_DIRECTION,AVERAGE_SPEED,IS_DELETED,DESCRIPTION FROM T_BEIDOU_DEVICE";
        private List<CBeiDouDevice> _InsertDeviceArray = null;
        private List<CBeiDouDevice> _DeleteDeviceArray = null;
        private List<CBeiDouDevice> _UpdateDeviceArray = null;
        public CBeiDevieManager(string queryServiceUrl, CDbConnection dbConnection, CSystemLog systemLog)

        {
            _QueryServiceUrl = queryServiceUrl;
            _DbConnection = dbConnection;
            _SystemLog = systemLog;
            _DbBeiDouDeviceTable = new Dictionary<string, CBeiDouDevice>();
            _RemoteServerBeiDouDeviceTable = new Dictionary<string, CBeiDouDevice>();
            _InsertDeviceArray = new List<CBeiDouDevice>();
            _DeleteDeviceArray = new List<CBeiDouDevice>();
            _UpdateDeviceArray = new List<CBeiDouDevice>();
        }        

        public E_ERROR_CODE processBeiDevice()
        {
            string message = string.Empty;
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            errorCode = loadBeiDeviceFromDb();
            if (errorCode != E_ERROR_CODE.OK)
            {
                return errorCode;
            }

            errorCode = queryBeiDouDeviceFromRemoteServer();
            if (errorCode != E_ERROR_CODE.OK)
            {
                return errorCode;
            }

            findInsertDevice();
            findDeleteDevice();
            findUpdateDevice();
            errorCode = insertDeviceToDb();
            if (errorCode != E_ERROR_CODE.OK)
            {
                message = "Insert devices to db faild.";
                _SystemLog.writeLog(LOG_LEVEL.ERR, message);  
            }

            errorCode = updateDeviceToDb();
            if (errorCode != E_ERROR_CODE.OK)
            {
                message = "Update devices to db faild.";
                _SystemLog.writeLog(LOG_LEVEL.ERR, message);  
            }

            return errorCode;
        }

        private E_ERROR_CODE insertDeviceToDb()
        {
            string message = string.Empty;
			List<List<CDbParameter>> recordTable = new List<List<CDbParameter>>();
            foreach (CBeiDouDevice beiDevice in _InsertDeviceArray)
            {
                List<CDbParameter> recordParameter = beiDevice.convert2DbParameterList();
                if (recordParameter != null)
                {
                    recordTable.Add(recordParameter);
                }
                else
                {
                    message = string.Format("Conver device<{0}> to db parameter list faild.", beiDevice.Id);
                    _SystemLog.writeLog(LOG_LEVEL.ERR, message);                    
                }
            }
            int addDeviceCount = 0;
            bool dbConnectionsaveRecords = _DbConnection.saveRecords(CBeiDouDevice.INSERT_RECORD_SQL, recordTable, CBeiDouDevice.getFieldNameList(), out addDeviceCount);
            message = string.Format("Add <{0}> devices to db.", addDeviceCount);
            _SystemLog.writeLog(LOG_LEVEL.INFO, message);   
            return (dbConnectionsaveRecords ? E_ERROR_CODE.OK : E_ERROR_CODE.ERROR); 		
        }

        private E_ERROR_CODE updateDeviceToDb()
        {
            string message = string.Empty;
            List<List<CDbParameter>> recordTable = new List<List<CDbParameter>>();
            foreach (CBeiDouDevice beiDevice in _DeleteDeviceArray)
            {
                List<CDbParameter> recordParameter = beiDevice.convert2DbParameterList();
                if (recordParameter != null)
                {
                    recordTable.Add(recordParameter);
                }
                else
                {
                    message = string.Format("Conver device<{0}> to db parameter list faild.", beiDevice.Id);
                    _SystemLog.writeLog(LOG_LEVEL.ERR, message);
                }
            }

            foreach (CBeiDouDevice beiDevice in _UpdateDeviceArray)
            {
                List<CDbParameter> recordParameter = beiDevice.convert2DbParameterList();
                if (recordParameter != null)
                {
                    recordTable.Add(recordParameter);
                }
                else
                {
                    message = string.Format("Conver device<{0}> to db parameter list faild.", beiDevice.Id);
                    _SystemLog.writeLog(LOG_LEVEL.ERR, message);
                }
            }
            int updateDeviceCount = 0;
            bool dbConnectionsaveRecords = _DbConnection.saveRecords(CBeiDouDevice.UPDATE_RECORD_SQL, recordTable, CBeiDouDevice.getUpdateFieldNameList(), out updateDeviceCount);
            message = string.Format("Update <{0}> devices to db.", updateDeviceCount);
            _SystemLog.writeLog(LOG_LEVEL.INFO, message);
            return (dbConnectionsaveRecords ? E_ERROR_CODE.OK : E_ERROR_CODE.ERROR);
        }

        private E_ERROR_CODE loadBeiDeviceFromDb()
        {
            _DbConnection.queryRecords(_QUERY_ALL_BEIDOU_DEVICE_SQL, processDbReaderDelegate);
            return E_ERROR_CODE.OK;
        }

        private void processDbReaderDelegate(MySqlDataReader mySqlDataReader)
        {
            while (mySqlDataReader.Read())
            {
                CBeiDouDevice beiDouDevice = new CBeiDouDevice(_SystemLog, _DbConnection);
                beiDouDevice.Id = mySqlDataReader.GetString(CBeiDouDevice.ID);
                beiDouDevice.Name = mySqlDataReader.GetString(CBeiDouDevice.NAME);
                beiDouDevice.HasCamer = mySqlDataReader.GetBoolean(CBeiDouDevice.HAS_CAMER);
                try
                {
                    beiDouDevice.RtspAddress = mySqlDataReader.GetString(CBeiDouDevice.RTSP_ADDRESS);
                }
                catch
                {
                    beiDouDevice.RtspAddress = "";
                }

                try
                {
                    beiDouDevice.LastModifyTime = mySqlDataReader.GetDateTime(CBeiDouDevice.LAST_MODIFY_TIME);
                }
                catch
                {
                    beiDouDevice.LastModifyTime = DateTime.Now;
                }

                beiDouDevice.DeviceType = (E_DEVICE_TYPE) mySqlDataReader.GetInt16(CBeiDouDevice.DEVICE_TYPE);
                beiDouDevice.DeviceState = mySqlDataReader.GetInt16(CBeiDouDevice.DEVICE_STATE);
                beiDouDevice.Longitude = mySqlDataReader.GetFloat(CBeiDouDevice.LONGITUDE);
                beiDouDevice.Latitude = mySqlDataReader.GetFloat(CBeiDouDevice.LATITUDE);
                beiDouDevice.Altitude = mySqlDataReader.GetFloat(CBeiDouDevice.ALTITUDE);
                beiDouDevice.OrganizationCode = mySqlDataReader.GetString(CBeiDouDevice.ORGANIZATION_CODE);
                beiDouDevice.LastLocateTime = mySqlDataReader.GetDateTime(CBeiDouDevice.LAST_LOCATE_TIME);
                beiDouDevice.LongitudeDirection = mySqlDataReader.GetString(CBeiDouDevice.LONGITUDE_DIRECTION);
                beiDouDevice.LatitudeDirection = mySqlDataReader.GetString(CBeiDouDevice.LATITUDE_DIRECTION);
                beiDouDevice.AverageSpeed = mySqlDataReader.GetFloat(CBeiDouDevice.AVERAGE_SPEED);
                beiDouDevice.IsDeleted = mySqlDataReader.GetBoolean(CBeiDouDevice.IS_DELETED);
                try
                {
                    beiDouDevice.Description = mySqlDataReader.GetString(CBeiDouDevice.DESCRIPTION);
                }
                catch
                {
                    beiDouDevice.Description = "";
                }

                if (!_DbBeiDouDeviceTable.ContainsKey(beiDouDevice.Id))
                {
                    _DbBeiDouDeviceTable.Add(beiDouDevice.Id, beiDouDevice);
                }
            }
        }

        private string loadJsonTestData()
        {
            return File.ReadAllText("./testdata/test.json",Encoding.UTF8);
        }

        private E_ERROR_CODE queryBeiDouDeviceFromRemoteServer()
        {            
            _RemoteServerBeiDouDeviceTable.Clear();
            string errorMessage = string.Empty;
            string httpRequestErrorMessage = string.Empty;
            string resultContent = CHttpRequest.GetHttpWebRequest(_QueryServiceUrl, out httpRequestErrorMessage);
            if (resultContent == null)
            {
                errorMessage = string.Format("Load from server<{0}>,error message<{1}> faild.", _QueryServiceUrl, httpRequestErrorMessage);
                _SystemLog.writeLog(LOG_LEVEL.ERR, errorMessage);
                return E_ERROR_CODE.ERROR_QUERY_DEVICE_FROM_SERVICE_FAILED;
            }
            
            JObject resultObject = JObject.Parse(resultContent);
            if (resultObject == null)
            {
                errorMessage = string.Format("Service<{0}> response data is invalid.", _QueryServiceUrl);
                _SystemLog.writeLog(LOG_LEVEL.ERR, errorMessage);
                return E_ERROR_CODE.ERROR_JSON_PARSE_FAILED;
            }

            int errorCode = resultObject["errorCode"].Value<int>();
            if (errorCode != 0)
            {
                errorMessage = string.Format("Request faild, error code<{0}> error message<{1}>.", errorCode, resultObject["message"].Value<string>());
                _SystemLog.writeLog(LOG_LEVEL.ERR, errorMessage);
                return E_ERROR_CODE.ERROR_SERVER_RESULT_HAS_SOME_ERROR;
            }

            JArray deviceRecordArray = resultObject["data"].Value<JArray>();
            if ((deviceRecordArray == null) || (deviceRecordArray.Count == 0))
            {
                errorMessage = string.Format("Convert to JObject faild, content<{0}>.", resultContent);
                _SystemLog.writeLog(LOG_LEVEL.INFO, errorMessage);
                return E_ERROR_CODE.ERROR_NO_DEVICE_DATA;
            }

            return (parseDeviceRecord(deviceRecordArray) ? E_ERROR_CODE.OK : E_ERROR_CODE.ERROR);
        }

        private bool parseDeviceRecord(JArray beiDouDeviceRecords)
        {
            string errorMessage = string.Empty;
            foreach (JToken beiDouRecord in beiDouDeviceRecords)
            {
                if (beiDouRecord == null)
                {
                    errorMessage = string.Format("Convert to JObject faild, content<{0}>.", beiDouRecord);
                    _SystemLog.writeLog(LOG_LEVEL.ERR, errorMessage);
                    continue;
                }

                string deviceId = beiDouRecord[0].Value<string>();
                if(_RemoteServerBeiDouDeviceTable.ContainsKey(deviceId))
                {
                    errorMessage = string.Format("Device <{0}> exist, this device record will be discard.", deviceId);
                    _SystemLog.writeLog(LOG_LEVEL.WARNING, errorMessage);
                    continue;
                }

                /*
                 * 0	string	√	设备编号
                    1	integer	√	设备类型(0:指挥机，1:终端)
                    2	float	√	当前位置，经度
                    3	float	√	当前位置，纬度
                    4	float	√	当前位置，高度
                    5	integer	√	设备状态(0:正常,1:故障)
                    6	string	×	备注
                 **/

                CBeiDouDevice beiDouDevice = new CBeiDouDevice(_SystemLog, _DbConnection);
                beiDouDevice.Id = deviceId;
                try
                {
                    beiDouDevice.DeviceType = (E_DEVICE_TYPE)beiDouRecord[1].Value<int>();
                }
                catch
                {
                    continue;
                }

                try
                {
                    beiDouDevice.Longitude = beiDouRecord[2].Value<float>();
                }
                catch
                {
                    continue;
                }

                try
                {
                    beiDouDevice.Latitude = beiDouRecord[3].Value<float>();
                }
                catch
                {
                    continue;
                }

                try
                {
                    beiDouDevice.Altitude = beiDouRecord[4].Value<float>();
                }
                catch
                {
                    continue;
                }

                try
                {
                    beiDouDevice.DeviceState = beiDouRecord[5].Value<int>();
                }
                catch
                {
                    continue;
                }

                try
                {
                    beiDouDevice.Description = beiDouRecord[6].Value<string>();
                }
                catch
                {
                    beiDouDevice.Description = "";
                }

                _RemoteServerBeiDouDeviceTable.Add(beiDouDevice.Id, beiDouDevice);
            }

            return true;
        }

        private void findInsertDevice()
        {
            _InsertDeviceArray.Clear();
            foreach (KeyValuePair<string, CBeiDouDevice> kvp in _RemoteServerBeiDouDeviceTable)
            {
                string deviceId = kvp.Key;
                if (!_DbBeiDouDeviceTable.ContainsKey(deviceId)) //not in db
                {
                    kvp.Value.Name = deviceId;
                    _InsertDeviceArray.Add(kvp.Value);
                }
            }
        }

        private void findDeleteDevice()
        {
            _DeleteDeviceArray.Clear();
            foreach (KeyValuePair<string, CBeiDouDevice> kvp in _DbBeiDouDeviceTable)
            {
                string deviceId = kvp.Key;
                if (!_RemoteServerBeiDouDeviceTable.ContainsKey(deviceId)) //not in db
                {
                    _DeleteDeviceArray.Add(kvp.Value);
                }
            }
        }

        private void findUpdateDevice()
        {
            _UpdateDeviceArray.Clear();
            foreach (KeyValuePair<string, CBeiDouDevice> kvp in _RemoteServerBeiDouDeviceTable)
            {
                string deviceId = kvp.Key;
                if (_DbBeiDouDeviceTable.ContainsKey(deviceId)) //not in db
                {
                    CBeiDouDevice dbBeiDouDevice = _DbBeiDouDeviceTable[deviceId];
                    if (dbBeiDouDevice.IsDeleted)
                    {
                        dbBeiDouDevice.IsDeleted = false;
                        _UpdateDeviceArray.Add(dbBeiDouDevice);
                    }
                }
            }
        }
    }
}
