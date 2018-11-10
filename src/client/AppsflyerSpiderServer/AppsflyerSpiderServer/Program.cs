using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.IO;
using System.Text.RegularExpressions;

namespace AppsflyerSpiderServer
{
    class Program
    {
		private static string CONFIG_ITEM_APP_INSTALL_DATA_STORE_ROOT_PATH = "APP_INSTALL_DATA_STORE_ROOT_PATH";
        private static string CONFIG_ITEM_APP_EVENT_DATA_STORE_ROOT_PATH = "APP_EVENT_DATA_STORE_ROOT_PATH";
        private static string CONFIG_ITEM_SPIDER_TASK_CONFIG_FILE = "SPIDER_TASK_CONFIG_FILE";
        private static string CONFIG_ITEM_SPIDER_TASK_CHECK_CYCLE = "SPIDER_TASK_CHECK_CYCLE";

        private static string CONFIG_ITEM_IS_WRITE_LOG_TO_SCREEN = "IS_WRITE_LOG_TO_SCREEN";
		private static string CONFIG_ITEM_WRITR_LOG_LEVEL = "WRITR_LOG_LEVEL";
		private static string CONFIG_ITEM_REQUEST_CYCLE = "REQUEST_CYCLE";

		private static string _LogStorePath = string.Empty;
		private static bool _IsWriteLog2Screen = false;
		private static LOG_LEVEL _FilterLogLevel = LOG_LEVEL.WARNING;		
		private static string _PinenBeiDouServiceUrl = string.Empty;
		private static int _RequestCycle = 20;
        private static CDbConnection _DbConnection = null;
       
		private static CSystemConfig _SystemConfig = null;
		private static CSystemLog _SystemLog = null;
		private static string _DbConnectStr = null;
		private static CBeiDevieManager _BeiDouDeviceManager = null;
        static int Main(string[] args)
        {
            string message = string.Empty;	
			_SystemConfig = new CSystemConfig ();
			if (_SystemConfig.getErrorCode () != 0) 
			{
				return 1;
			}

			E_ERROR_CODE errorCode = loadConfigData ();

            if (errorCode != E_ERROR_CODE.OK) 
            {
                return (int)errorCode;
			}

			_DbConnection = new CDbConnection(_DbConnectStr, _SystemLog);
			if (!_DbConnection.testConnect ()) 
			{
				_SystemLog.disposeLogWriter ();
				return (int)E_ERROR_CODE.ERROR_CONNECT_DB_FAILED;
			}

			initLocalVaribles();
            
            while (true)
            {
                _BeiDouDeviceManager.processBeiDevice();
                message = string.Format("Run cycle <{0}>, Next run time <{1}>....", _RequestCycle, CPublic.getDateTimeString(DateTime.Now.AddSeconds(_RequestCycle)));
                _SystemLog.writeLog(LOG_LEVEL.WARNING, message);
				Thread.Sleep(TimeSpan.FromSeconds(_RequestCycle));
            }
        }

        private static E_ERROR_CODE loadConfigData()
        {
            object configItem = null;
            configItem = _SystemConfig.getConfigItem(CONFIG_ITEM_USER_LOG_PATH);
            if (configItem == null)
            {
                Console.Write(string.Format("Not config<{0}>, plase config it.", CONFIG_ITEM_USER_LOG_PATH));
                return E_ERROR_CODE.ERROR_CONFIG_ITEM_USER_LOG_PATH_NOT_EXIST;
            }

            _LogStorePath = configItem.ToString();

            configItem = _SystemConfig.getConfigItem(CONFIG_ITEM_IS_WRITE_LOG_TO_SCREEN);
            if (configItem == null)
            {
                Console.Write(string.Format("Not config<{0}>, plase config it.", CONFIG_ITEM_IS_WRITE_LOG_TO_SCREEN));
                return E_ERROR_CODE.CONFIG_ITEM_IS_WRITE_LOG_TO_SCREEN_NOT_EXIST;
            }

            try
            {
                _IsWriteLog2Screen = Boolean.Parse(configItem.ToString());
            }
            catch
            {
                _IsWriteLog2Screen = false;
            }

            configItem = _SystemConfig.getConfigItem(CONFIG_ITEM_WRITR_LOG_LEVEL);
            if (configItem == null)
            {
                Console.Write(string.Format("Not config<{0}>, plase config it.", CONFIG_ITEM_WRITR_LOG_LEVEL));
                return E_ERROR_CODE.CONFIG_ITEM_WRITR_LOG_LEVEL_NOT_EXIST;
            }

            if (!Enum.TryParse(configItem.ToString(), out _FilterLogLevel))
            {
                _FilterLogLevel = LOG_LEVEL.WARNING;
            }

            _SystemLog = new CSystemLog(_LogStorePath, _FilterLogLevel, _IsWriteLog2Screen);
            configItem = _SystemConfig.getConfigItem(CONFIG_ITEM_DB_MYSQL_CONNECT_STR);
            if (configItem == null)
            {
                Console.Write(string.Format("Not config<{0}>, plase config it.", CONFIG_ITEM_DB_MYSQL_CONNECT_STR));
                return E_ERROR_CODE.CONFIG_ITEM_DB_MYSQL_CONNECT_STR_NOT_EXIST;
            }

            _DbConnectStr = configItem.ToString();

            configItem = _SystemConfig.getConfigItem(CONFIG_ITEM_UPDATE_BEIDOU_SERVICE_URL);
            if (configItem == null)
            {
                Console.Write(string.Format("Not config<{0}>, plase config it.", CONFIG_ITEM_UPDATE_BEIDOU_SERVICE_URL));
                return E_ERROR_CODE.CONFIG_ITEM_PINEN_BEIDOU_SERVICE_URL_NOT_EXIST;
            }

            _PinenBeiDouServiceUrl = configItem.ToString();

            configItem = _SystemConfig.getConfigItem(CONFIG_ITEM_REQUEST_CYCLE);
            if (configItem == null)
            {
                Console.Write(string.Format("Not config<{0}>, plase config it.", CONFIG_ITEM_REQUEST_CYCLE));
                return E_ERROR_CODE.CONFIG_ITEM_REQUEST_CYCLE_NOT_EXIST;
            }

            try
            {
                _RequestCycle = int.Parse(configItem.ToString());
            }
            catch
            {
                _RequestCycle = 30;
            }

            return E_ERROR_CODE.OK;
        }

        private static void initLocalVaribles()
        {
            _BeiDouDeviceManager = new CBeiDevieManager(_PinenBeiDouServiceUrl, _DbConnection, _SystemLog);
        }

    }
}
