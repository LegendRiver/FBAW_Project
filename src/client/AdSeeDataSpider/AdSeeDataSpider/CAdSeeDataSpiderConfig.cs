using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace AdSeeDataSpider
{
    public class CAdSeeDataSpiderConfig
    {
        //日志存储路径
        private static string CONFIG_ITEM_USER_LOG_PATH = "USER_LOG_PATH";

        //JS引擎名称
        private static string CONFIG_ITEM_PHANTOMJS_PROCESS_NAME = "PHANTOMJS_PROCESS_NAME";

        //JS引擎日志存储路径
        private static string CONFIG_ITEM_WEBDRIVER_LOG_PATH = "WEBDRIVER_LOG_PATH";

        private static string CONFIG_ITEM_ADSEEDATA_SYSTEM_HOME_PAGE = "ADSEEDATA_SYSTEM_HOME_PAGE";
        //系统登录URL地址
        private static string CONFIG_ITEM_ADSEEDATA_SYSTEM_LOGIN_URL = "ADSEEDATA_SYSTEM_LOGIN_URL";
        //检查用户是否已经登录
        private static string CONFIG_ITEM_CHECK_USER_IS_LOGIN_URL = "CHECK_USER_IS_LOGIN_URL";

        //广告汇总信息
        private static string CONFIG_ITEM_ADSEEDATA_SYSTEM_APP_AD_SUMMARY_URL = "ADSEEDATA_SYSTEM_APP_AD_SUMMARY_URL";
        //广告列表数据
        private static string CONFIG_ITEM_ADSEEDATA_SYSTEM_APP_AD_LIST_URL = "ADSEEDATA_SYSTEM_APP_AD_LIST_URL";

        //android app id data file
        private static string CONFIG_ITEM_ANDROID_APPLICATION_ID_ARRAY = "ANDROID_APPLICATION_ID_ARRAY";
        private static string CONFIG_ITEM_IOS_APPLICATION_ID_ARRAY = "IOS_APPLICATION_ID_ARRAY";

        //广告数据存储路径
        private static string CONFIG_ITEM_USER_DATA_PATH = "DATA_PATH";
        //日志记录级别
        private static string CONFIG_ITEM_WRITR_LOG_LEVEL = "LOG_LEVEL";

        private CSystemConfig _Config = null;
        private string _ConfigFile = string.Empty;

        private CSystemLog _SystemLog = null;
        public CAdSeeDataSpiderConfig(string configFile, CSystemLog systemLog)
        {
            _ConfigFile = configFile;
            _SystemLog = systemLog;
        }

        public E_ERROR_CODE initConfig()
        {
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            _Config = new CSystemConfig(_ConfigFile, _SystemLog);
            errorCode = _Config.initConfig();
            if(errorCode != E_ERROR_CODE.OK)
            {
                _Config = null;
                return errorCode;
            }

            return errorCode;
        }

        internal string getLogPath()
        {
            return string.Format("{0}", _Config.getConfigItem(CONFIG_ITEM_USER_LOG_PATH));
        }

        internal LOG_LEVEL getLogLevel()
        {
            string configItemValue = string.Format("{0}", _Config.getConfigItem(CONFIG_ITEM_WRITR_LOG_LEVEL));
            try
            {
                return (LOG_LEVEL)Enum.Parse(typeof(LOG_LEVEL), configItemValue);
            }
            catch (Exception ex)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Parse log level failed, config <{0}>, error message <{1}>.", configItemValue, ex.Message));
                return LOG_LEVEL.ERR;
            }
        }

        internal string getHomePageUrl()
        {
            return string.Format("{0}", _Config.getConfigItem(CONFIG_ITEM_ADSEEDATA_SYSTEM_HOME_PAGE));
        }

        internal string getWebdriverLogStorePath()
        {
            return string.Format("{0}", _Config.getConfigItem(CONFIG_ITEM_WEBDRIVER_LOG_PATH));
        }
        
        internal string getLoginUrl()
        {
            return string.Format("{0}", _Config.getConfigItem(CONFIG_ITEM_ADSEEDATA_SYSTEM_LOGIN_URL));
        }

        internal string getCheckUserLoginUrl(string userId, string accessToken)
        {
            string checkUserLoginUrl = string.Format("{0}", _Config.getConfigItem(CONFIG_ITEM_CHECK_USER_IS_LOGIN_URL));
            return checkUserLoginUrl.Replace("PARAMETER_USER_ID", userId)
                .Replace("PARAMETER_ACCESS_TOKEN", accessToken);
        }

        internal string getAdSummaryUrl(string appPackage, string userId, string accessToken)
        {
            /* https://www.adseedata.com/d/app?pkg=PARAMETER_APP_PACKAGE_NAME&uid=PARAMETER_USER_ID&accessToken=PARAMETER_ACCESS_TOKEN */
            string androidDataQueryUrlTemplete = string.Format("{0}", _Config.getConfigItem(CONFIG_ITEM_ADSEEDATA_SYSTEM_APP_AD_SUMMARY_URL));

            return androidDataQueryUrlTemplete.Replace("PARAMETER_APP_PACKAGE_NAME", appPackage)
                .Replace("PARAMETER_USER_ID", userId)
                .Replace("PARAMETER_ACCESS_TOKEN", accessToken);
        }

        internal string getAdListUrl(string appPackage, string userId, string accessToken, int pageNo)
        {
            //https://www.adseedata.com/d/record_list?pkg=PARAMETER_APP_PACKAGE_NAME&pageNo=1&uid=PARAMETER_USER_ID&accessToken=PARAMETER_ACCESS_TOKEN&from=null&orderBy=first_advertising_time&orderType=desc
            string androidAdListQueryUrlTemplete = string.Format("{0}", _Config.getConfigItem(CONFIG_ITEM_ADSEEDATA_SYSTEM_APP_AD_LIST_URL));
          
            return androidAdListQueryUrlTemplete.Replace("PARAMETER_APP_PACKAGE_NAME", appPackage)
                .Replace("PARAMETER_USER_ID", userId)
                .Replace("PARAMETER_ACCESS_TOKEN", accessToken)
                .Replace("PARAMETER_PAGE_NO", string.Format("{0}", pageNo));
        }


        internal string getAndroidDataStorePath()
        {
            string dataStorePath = string.Format("{0}/{1}", getDataStorePath(), "android_ad");
            if(Directory.Exists(dataStorePath))
            {
                return dataStorePath;
            }

            try
            {
                Directory.CreateDirectory(dataStorePath);
                return dataStorePath;
            }
            catch(Exception ex)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Create android data store path <{0}> failed, error message <{1}>.", dataStorePath, ex.Message));
                return null;
            }
        }

        private string getDataStorePath()
        {
            string configItemValue = string.Format("{0}", _Config.getConfigItem(CONFIG_ITEM_USER_DATA_PATH));
            if(configItemValue == null)
            {
                return string.Format("{0}/{1}", CPublic.getAppStartPath(), "data");
            }

            return configItemValue;
        }

        internal string[] getAndroidApplicationIds()
        {
            string configItemValue =string.Format("{0}", _Config.getConfigItem(CONFIG_ITEM_ANDROID_APPLICATION_ID_ARRAY));
            return configItemValue.Split(',');
        }

        internal E_ERROR_CODE loadAndroidApplicationIds(List<string> androidApplicationIdList)
        {
            string message = string.Empty;
            string[] androidIds = null;
            string androidApplicationIdDataFile = string.Format("{0}", _Config.getConfigItem(CONFIG_ITEM_ANDROID_APPLICATION_ID_ARRAY));
            if (!File.Exists(androidApplicationIdDataFile))
            {
                message = string.Format("Android id data file <{0}> not exist.", androidApplicationIdDataFile);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_ANDROID_ID_DATA_FILE_NOT_EXIST;
            }

            try
            {
                androidIds = File.ReadAllLines(androidApplicationIdDataFile,Encoding.UTF8);
                androidApplicationIdList.AddRange(androidIds);
            }
            catch (Exception ex)
            {
                message = string.Format("Read data from file <{0}> failed, error mesage <{1}>.", androidApplicationIdDataFile, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_READ_ANDROID_ID_DATA_FROM_FILE;
            }

            return E_ERROR_CODE.OK;
        }

        internal string[] getIOSApplicationIds()
        {
            string configItemValue = string.Format("{0}", _Config.getConfigItem(CONFIG_ITEM_IOS_APPLICATION_ID_ARRAY));
            return configItemValue.Split(',');
        }
        
        internal string getIOSDataStorePath()
        {
            string dataStorePath = string.Format("{0}/{1}", getDataStorePath(), "ios_ad");
            if (Directory.Exists(dataStorePath))
            {
                return dataStorePath;
            }

            try
            {
                Directory.CreateDirectory(dataStorePath);
                return dataStorePath;
            }
            catch (Exception ex)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Create ios data store path <{0}> failed, error message <{1}>.", dataStorePath, ex.Message));
                return null;
            }
        }
    }
}
