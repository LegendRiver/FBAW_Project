using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using Newtonsoft.Json;
using System.Text;

namespace AppsflyerSpiderServer
{
    public class CBeiDouDevice
	{
        public static string INSERT_RECORD_SQL = "INSERT INTO T_BEIDOU_DEVICE(ID,NAME,HAS_CAMER,RTSP_ADDRESS," +
            "LAST_MODIFY_TIME,DEVICE_TYPE,DEVICE_STATE,LONGITUDE,LATITUDE,ALTITUDE,ORGANIZATION_CODE,LAST_LOCATE_TIME,"+
            "LONGITUDE_DIRECTION,LATITUDE_DIRECTION,AVERAGE_SPEED,IS_DELETED,DESCRIPTION)" +
            " VALUES(@ID,@NAME,@HAS_CAMER,@RTSP_ADDRESS,"+
            "@LAST_MODIFY_TIME,@DEVICE_TYPE,@DEVICE_STATE,@LONGITUDE,@LATITUDE,@ALTITUDE,@ORGANIZATION_CODE,@LAST_LOCATE_TIME,"+
            "@LONGITUDE_DIRECTION,@LATITUDE_DIRECTION,@AVERAGE_SPEED,@IS_DELETED,@DESCRIPTION)";

        public static string UPDATE_RECORD_SQL = "UPDATE T_BEIDOU_DEVICE SET IS_DELETED = @IS_DELETED, LAST_MODIFY_TIME=@LAST_MODIFY_TIME WHERE ID=@ID";

		private string _Id = string.Empty;
		public string Id
		{
			get{ return _Id; }
			set{ _Id = value; }
		}

		private string _Name = string.Empty;
		public string Name
		{
			get{ return _Name; }
			set{ _Name = value; }
		}

		private bool _HasCamer = false;
		public bool HasCamer
		{
			get{ return _HasCamer; }
			set{ _HasCamer = value; }
		}

		private string _RtspAddress = string.Empty;
		public string RtspAddress
		{
			get{ return _RtspAddress; }
			set{ _RtspAddress = value; }
		}
        
        private DateTime _LastModifyTime = DateTime.Now;
        public DateTime LastModifyTime
        {
            get { return _LastModifyTime; }
            set { _LastModifyTime = value; }
        }

        private E_DEVICE_TYPE _DeviceType = E_DEVICE_TYPE.TERMINAL;
        public E_DEVICE_TYPE DeviceType
        {
            get { return _DeviceType; }
            set { _DeviceType = value; }
        }

        private int _DeviceState = 0;
        public int DeviceState
        {
            get { return _DeviceState; }
            set { _DeviceState = value; }
        }

        private float _Longitude = 0.0f;
        public float Longitude
        {
            get { return _Longitude; }
            set { _Longitude = value; }
        }

        private float _Latitude = 0.0f;
        public float Latitude
        {
            get { return _Latitude; }
            set { _Latitude = value; }
        }

        private float _Altitude = 0.0f;
        public float Altitude
        {
            get { return _Altitude; }
            set { _Altitude = value; }
        }

        private string _OrganizationCode = "01";
        public string OrganizationCode
        {
            get { return _OrganizationCode; }
            set { _OrganizationCode = value; }
        }

        private DateTime _LastLocateTime = DateTime.Now;
        public DateTime LastLocateTime
        {
            get { return _LastLocateTime; }
            set { _LastLocateTime = value; }
        }
       
        private string _LongitudeDirection = "E";
        public string LongitudeDirection
        {
            get { return _LongitudeDirection; }
            set { _LongitudeDirection = value; }
        }

        private string _LatitudeDirection = "N";
        public string LatitudeDirection
        {
            get { return _LatitudeDirection; }
            set { _LatitudeDirection = value; }
        }

        private float _AverageSpeed = 0.0f;
        public float AverageSpeed
        {
            get { return _AverageSpeed; }
            set { _AverageSpeed = value; }
        }

        private bool _IsDeleted = false;
        public bool IsDeleted
        {
            get { return _IsDeleted; }
            set { _IsDeleted = value; }
        }

		private string _Description = string.Empty;
		public string Description
		{
			get{ return _Description; }
			set{ _Description = value; }
		}


		private string message = string.Empty;
		private CSystemLog _SystemLog = null;
		private CDbConnection _DbConnection = null;        
        public CBeiDouDevice(CSystemLog systemLog, CDbConnection dbConnection)
		{
			_SystemLog = systemLog;
			_DbConnection = dbConnection;
		}
        
		public bool save2Db()
		{
            int addRecordCount = 0;
			List<List<CDbParameter>> recordTable = new List<List<CDbParameter>>();
			List<CDbParameter> recordParameter = convert2DbParameterList();
			if (recordParameter != null) {
				recordTable.Add (recordParameter);
			} else {
				message = string.Format ("Conver device<{0}> to db parameter list faild.", Id);
				_SystemLog.writeLog (LOG_LEVEL.ERR, message);
				return false;
			}

            return _DbConnection.saveRecords(INSERT_RECORD_SQL, recordTable, getFieldNameList(), out addRecordCount); 
		}

        public bool update()
        {
            int updateDeviceCount = 0;
            List<List<CDbParameter>> recordTable = new List<List<CDbParameter>>();
			List<CDbParameter> recordParameter = convert2DbParameterList();
			if (recordParameter != null) {
				recordTable.Add (recordParameter);
			} else {
				message = string.Format ("Conver device<{0}> to db parameter list faild.", Id);
				_SystemLog.writeLog (LOG_LEVEL.ERR, message);
				return false;
			}

            return _DbConnection.saveRecords(UPDATE_RECORD_SQL, recordTable, getUpdateFieldNameList(), out updateDeviceCount); 
        }

		public List<CDbParameter> convert2DbParameterList()
		{
			//,,,
			List<CDbParameter> recordParameters = new List<CDbParameter>();
            CDbParameter idParameter = new CDbParameter() { ParameterName = ID, ParameterValue = Id };
			recordParameters.Add(idParameter);

            /*
             * " VALUES(@ID,@NAME,@HAS_CAMER,@RTSP_ADDRESS,"+
            "@LAST_MODIFY_TIME,@DEVICE_TYPE,@DEVICE_STATE,@LONGITUDE,@LATITUDE,@ALTITUDE,@ORGANIZATION_CODE,@LAST_LOCATE_TIME,"+
            "@LONGITUDE_DIRECTION,@LATITUDE_DIRECTION,@AVERAGE_SPEED,@IS_DELETED,@DESCRIPTION)";
             * */
            
            CDbParameter nameParameter = new CDbParameter() { ParameterName = NAME, ParameterValue = Name };
            recordParameters.Add(nameParameter);

            CDbParameter hasCameraParameter = new CDbParameter() { ParameterName = HAS_CAMER, ParameterValue = Convert.ToInt16(HasCamer) };
            recordParameters.Add(hasCameraParameter);

            CDbParameter rtspAddressParameter = new CDbParameter() { ParameterName = RTSP_ADDRESS, ParameterValue = RtspAddress };
            recordParameters.Add(rtspAddressParameter);

            CDbParameter lastModifyTimeParameter = new CDbParameter() { ParameterName = LAST_MODIFY_TIME, ParameterValue = CPublic.getDateTimeString(LastModifyTime) };
            recordParameters.Add(lastModifyTimeParameter);

            CDbParameter deviceTypeParameter = new CDbParameter() { ParameterName = DEVICE_TYPE, ParameterValue = (int)DeviceType };
            recordParameters.Add(deviceTypeParameter);

            CDbParameter deviceStateParameter = new CDbParameter() { ParameterName = DEVICE_STATE, ParameterValue = DeviceState };
            recordParameters.Add(deviceStateParameter);

            CDbParameter longitudeParameter = new CDbParameter() { ParameterName = LONGITUDE, ParameterValue = Longitude };
			recordParameters.Add(longitudeParameter);

            CDbParameter latitudeParameter = new CDbParameter() { ParameterName = LATITUDE, ParameterValue = Latitude };
			recordParameters.Add(latitudeParameter);

            CDbParameter altitudeParameter = new CDbParameter() { ParameterName = ALTITUDE, ParameterValue = Altitude };
			recordParameters.Add(altitudeParameter);

            CDbParameter organizationCodeParameter = new CDbParameter() { ParameterName = ORGANIZATION_CODE, ParameterValue = OrganizationCode };
            recordParameters.Add(organizationCodeParameter);

            CDbParameter lastLocateTimeParameter = new CDbParameter() { ParameterName = LAST_LOCATE_TIME, ParameterValue = LastLocateTime };
            recordParameters.Add(lastLocateTimeParameter);

            CDbParameter longitudeDirectionParameter = new CDbParameter() { ParameterName = LONGITUDE_DIRECTION, ParameterValue = LongitudeDirection };
            recordParameters.Add(longitudeDirectionParameter);

            CDbParameter latitudeDirectionParameter = new CDbParameter() { ParameterName = LATITUDE_DIRECTION, ParameterValue = LatitudeDirection };
            recordParameters.Add(latitudeDirectionParameter);

            CDbParameter averageSpeedParameter = new CDbParameter() { ParameterName = AVERAGE_SPEED, ParameterValue = AverageSpeed };
            recordParameters.Add(averageSpeedParameter);

            CDbParameter isDeletedParameter = new CDbParameter() { ParameterName = IS_DELETED, ParameterValue = Convert.ToInt16(IsDeleted) };
            recordParameters.Add(isDeletedParameter);

            CDbParameter descriptionParameter = new CDbParameter() { ParameterName = DESCRIPTION, ParameterValue = Description };
            recordParameters.Add(descriptionParameter);

			return recordParameters;
		}


        public static List<string> getUpdateFieldNameList()
        {
            List<string> fieldNameList = new List<string>();
            fieldNameList.Add(ID);
            fieldNameList.Add(LAST_MODIFY_TIME);
            fieldNameList.Add(IS_DELETED);

            return fieldNameList;
        }

        public static List<string> getFieldNameList()
		{
            List<string> fieldNameList = new List<string>();
            fieldNameList.Add(ID);
            fieldNameList.Add(NAME);
            fieldNameList.Add(HAS_CAMER);
            fieldNameList.Add(RTSP_ADDRESS);
            fieldNameList.Add(LAST_MODIFY_TIME);
            fieldNameList.Add(DEVICE_TYPE);
            fieldNameList.Add(DEVICE_STATE);
            fieldNameList.Add(LONGITUDE);
            fieldNameList.Add(LATITUDE);
            fieldNameList.Add(ALTITUDE);
            fieldNameList.Add(ORGANIZATION_CODE);
            fieldNameList.Add(LAST_LOCATE_TIME);
            fieldNameList.Add(LONGITUDE_DIRECTION);
            fieldNameList.Add(LATITUDE_DIRECTION);
            fieldNameList.Add(AVERAGE_SPEED);
            fieldNameList.Add(IS_DELETED);
            fieldNameList.Add(DESCRIPTION);

			return fieldNameList;
		}

		public override string ToString ()
		{
			return string.Format ("[CBeiDouDevice: {0}]", JsonConvert.SerializeObject(this));
		}

		public bool loadBeiDouDeviceFromFile(string deviceDataFile, Dictionary<string, CBeiDouDevice> beiDouDeviceTable, bool isStore2Db)
		{
			int savedCount = 0;
			if (!File.Exists (deviceDataFile)) {
				message = string.Format ("Device data file<{0}> not exists.", deviceDataFile);
				_SystemLog.writeLog (LOG_LEVEL.ERR, message);
				return false;
			}

			StreamReader fileReader = new StreamReader (deviceDataFile, Encoding.UTF8);
			if (fileReader == null) {
				message = string.Format ("Open device data file<{0}> faild.", deviceDataFile);
				_SystemLog.writeLog (LOG_LEVEL.ERR, message);
				return false;
			}

			string readLine = null;
			while ((readLine = fileReader.ReadLine ()) != null) {
				readLine = readLine.Trim ();
				CBeiDouDevice beiDouDevice = parseBeiDouDevice (readLine);
				if (beiDouDeviceTable.ContainsKey (beiDouDevice.Id)) {
					message = string.Format ("Device<{0}> exists.", beiDouDevice);
					_SystemLog.writeLog (LOG_LEVEL.ERR, message);
					continue;
				}

				beiDouDeviceTable.Add (beiDouDevice.Id, beiDouDevice);
			}

			fileReader.Close ();
			fileReader.Dispose ();
			fileReader = null;

			if (isStore2Db) {
				foreach (KeyValuePair<string,CBeiDouDevice> kvp in beiDouDeviceTable) {
					if (kvp.Value.save2Db ()) {
						savedCount += 1;
					} else {
						message = string.Format ("Device <{0}> save to db faild.", kvp.Value);
						_SystemLog.writeLog (LOG_LEVEL.ERR, message);
					}
				}
			}

			return (beiDouDeviceTable.Count == savedCount);
		}

		private CBeiDouDevice parseBeiDouDevice(string deviceLine)
		{
			string[] deviceItems = deviceLine.Split (',');
			if (deviceItems.Length < 4) {
				message = string.Format ("Device data format error,<{0}>.", deviceLine);
				_SystemLog.writeLog (LOG_LEVEL.ERR, message);
				return null;
			}

			CBeiDouDevice beiDouDevice = new CBeiDouDevice (_SystemLog, _DbConnection);
			beiDouDevice.Id = deviceItems [0];
			beiDouDevice.Name = deviceItems [1];
			bool deviceHasCamer = false;
			if (!bool.TryParse (deviceItems [2], out deviceHasCamer)) {
				deviceHasCamer = false;
			}

			beiDouDevice.HasCamer = deviceHasCamer;
			beiDouDevice.RtspAddress = deviceItems [3];
			if (deviceItems.Length == 5) {
				beiDouDevice.Description = deviceItems [4];
			}

			return beiDouDevice;
		}

        public static string ID = "ID";
        public static string NAME = "NAME";
        public static string HAS_CAMER = "HAS_CAMER";
        public static string RTSP_ADDRESS = "RTSP_ADDRESS";
        public static string LAST_MODIFY_TIME = "LAST_MODIFY_TIME";
        public static string DEVICE_TYPE = "DEVICE_TYPE";
        public static string DEVICE_STATE = "DEVICE_STATE";
        public static string LONGITUDE = "LONGITUDE";
        public static string LATITUDE = "LATITUDE";
        public static string ALTITUDE = "ALTITUDE";
        public static string ORGANIZATION_CODE = "ORGANIZATION_CODE";
        public static string LAST_LOCATE_TIME = "LAST_LOCATE_TIME";
        public static string LONGITUDE_DIRECTION = "LONGITUDE_DIRECTION";
        public static string LATITUDE_DIRECTION = "LATITUDE_DIRECTION";
        public static string AVERAGE_SPEED = "AVERAGE_SPEED";
        public static string IS_DELETED = "IS_DELETED";
        public static string DESCRIPTION = "DESCRIPTION";            
    }
}


