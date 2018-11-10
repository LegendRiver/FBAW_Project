using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using QueryPageOrder;
using System.IO;

namespace AutoWebBrowser
{
    public class CAppsFlyerDataSpiderConfig
    {
        private static string PARAMETER_START_DATE = "PARAMETER_START_DATE";
        private static string PARAMETER_END_DATE = "PARAMETER_END_DATE";
        private static string PARAMETER_APPLICATION_ID = "PARAMETER_APPLICATION_ID";
        //日志存储路径
        private static string CONFIG_ITEM_USER_LOG_PATH = "USER_LOG_PATH";

        //JS引擎名称
        private static string CONFIG_ITEM_PHANTOMJS_PROCESS_NAME = "PHANTOMJS_PROCESS_NAME";

        //JS引擎日志存储路径
        private static string CONFIG_ITEM_WEBDRIVER_LOG_PATH = "WEBDRIVER_LOG_PATH";

        //APPSFLYER数据处理延迟天数
        private static string CONFIG_ITEM_APPSFLYER_DELAY_DAY = "APPSFLYER_DELAY_DAY";
        //留存率周期
        private static string CONFIG_ITEM_RETENTION_PERIOD = "RETENTION_PERIOD";

        //appsflyer系统登录URL地址
        private static string CONFIG_ITEM_APPSFLYER_SYSTEM_LOGIN_URL = "APPSFLYER_SYSTEM_LOGIN_URL";

        private static string CONFIG_ITEM_USER_NAME_PAGE_ELEMENT_NAME = "USER_NAME_PAGE_ELEMENT_NAME";
        //登录系统用户名
        private static string CONFIG_ITEM_USER_NAME = "USER_NAME";

        private static string CONFIG_ITEM_PASSWORD_PAGE_ELEMENT_NAME = "PASSWORD_PAGE_ELEMENT_NAME";
        //用户密码
        private static string CONFIG_ITEM_PASSWORD = "PASSWORD";

        //install_amount参数值
        private static string CONFIG_ITEM_PARAMETER_INSTALL_AMOUNT = "PARAMETER_INSTALL_AMOUNT";

        //grouping 参数
        private static string CONFIG_ITEM_PARAMETER_GROUPING = "PARAMETER_GROUPING";

        //filter 参数
        private static string CONFIG_ITEM_PARAMETER_FILTER = "PARAMETER_FILTER";

        //ADNROID数据查询URL地址
        private static string CONFIG_ITEM_QUERY_DATA_URL = "QUERY_DATA_URL";

        //ANDROID应用ID数组
        private static string CONFIG_ITEM_ANDROID_APPLICATION_ID_ARRAY = "ANDROID_APPLICATION_ID_ARRAY";

        //IOS数据查询URL地址
        private static string CONFIG_ITEM_IOS_QUERY_DATA_URL = "IOS_QUERY_DATA_URL";

        //IOS应用ID数组
        private static string CONFIG_ITEM_IOS_APPLICATION_ID_ARRAY = "IOS_APPLICATION_ID_ARRAY";

        //是否输入网页屏幕截图
        private static string CONFIG_ITEM_IS_STORE_SCREEN_SHORT = "IS_STORE_SCREEN_SHORT";

        //网页截屏存储路径
        private static string CONFIG_ITEM_SCREEN_SHOT_STORE_PATH = "SCREEN_SHOT_STORE_PATH";

        //是否输出日志到屏幕
        private static string CONFIG_ITEM_IS_WRITE_LOG_TO_SCREEN = "IS_WRITE_LOG_TO_SCREEN";

        
        //输出日志级别
        private static string CONFIG_ITEM_WRITR_LOG_LEVEL = "WRITR_LOG_LEVEL";

        //数据存储路径
        private static string CONFIG_ITEM_USER_DATA_PATH = "USER_DATA_PATH";

        //数据提取间隔
        private static string CONFIG_ITEM_CHECK_CYCLE = "CHECK_CYCLE";


        //绩效报告存储路径
        private static string CONFIG_ITEM_PERFORMANCE_REPORT_DATA = "PERFORMANCE_REPORT_DATA";

        //绩效报告抓取间隔,单位小时
        private static string CONFIG_ITEM_PERFORMANCE_REPORT_SPIDER_GAP = "PERFORMANCE_REPORT_SPIDER_GAP";
        //绩效报告抓取天数,单位天
        private static string CONFIG_ITEM_PERFORMANCE_REPORT_SPIDER_DAY = "PERFORMANCE_REPORT_SPIDER_DAY";

        private CSystemConfig _AppsflyerConfig = null;
        private string _ConfigFile = string.Empty;

        private CSystemLog _SystemLog = null;
        public CAppsFlyerDataSpiderConfig(string configFile, CSystemLog systemLog)
        {
            _ConfigFile = configFile;
            _SystemLog = systemLog;
        }

        public E_ERROR_CODE initConfig()
        {
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            _AppsflyerConfig = new CSystemConfig(_ConfigFile, _SystemLog);
            errorCode = _AppsflyerConfig.initConfig();
            if(errorCode != E_ERROR_CODE.OK)
            {
                _AppsflyerConfig = null;
                return errorCode;
            }

            return errorCode;
        }

        internal string getLogPath()
        {
            return string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_USER_LOG_PATH));
        }

        internal LOG_LEVEL getLogLevel()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_WRITR_LOG_LEVEL));
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

        internal string getWebdriverLogStorePath()
        {
            return string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_WEBDRIVER_LOG_PATH));
        }
        
        internal string getLoginPageUrl()
        {
            return string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_APPSFLYER_SYSTEM_LOGIN_URL));
        }

        internal string getQueryDataUrl(DateTime startDate, DateTime endDate, string applicationId)
        {
            string androidDataQueryUrlTemplete = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_QUERY_DATA_URL));
            string startDateString = CPublic.getDateString(startDate);
            string endDateString = CPublic.getDateString(endDate);
            string grouping = getGrouping();
            string filter = getFilter();
            string installAmount = string.Format("{0}", getInstallAmount());

            return androidDataQueryUrlTemplete.Replace(PARAMETER_START_DATE, startDateString)
                .Replace(PARAMETER_END_DATE, endDateString)
                .Replace(PARAMETER_APPLICATION_ID, applicationId)
                .Replace(CONFIG_ITEM_PARAMETER_GROUPING, grouping)
                .Replace(CONFIG_ITEM_PARAMETER_FILTER, filter)
                .Replace(CONFIG_ITEM_PARAMETER_INSTALL_AMOUNT, installAmount);
        }


        internal string getAndroidDataStorePath()
        {
            string dataStorePath = string.Format("{0}/{1}", getDataStorePath(), "android");
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
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_USER_DATA_PATH));
            if(configItemValue == null)
            {
                return string.Format("{0}/{1}", CPublic.getAppStartPath(), "data");
            }

            return configItemValue;
        }

        internal string[] getAndroidApplicationIds()
        {
            string configItemValue =string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_ANDROID_APPLICATION_ID_ARRAY));
            return configItemValue.Split(',');
        }

        internal string[] getIOSApplicationIds()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_IOS_APPLICATION_ID_ARRAY));
            return configItemValue.Split(',');
        }

        private int getInstallAmount()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_PARAMETER_INSTALL_AMOUNT));
            try
            {
                return Convert.ToInt32(configItemValue);
            }
            catch(Exception ex)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Convert install amount <{0}> failed, error message <{1}>.", configItemValue, ex.Message));
                return 1;
            }
        }

        private string getGrouping()
        {
            return string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_PARAMETER_GROUPING)).Trim();
        } 

        private string getFilter()
        {
            return string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_PARAMETER_FILTER)).Trim();
        }
        internal bool getIsWriteLog2Screen()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_IS_STORE_SCREEN_SHORT));
            try
            {
                return Boolean.Parse(configItemValue);
            }
            catch(Exception ex)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Parse is write log to screen failed, config <{0}>, error message <{1}>.", configItemValue, ex.Message));
                return true;
            }
        }

        internal string getUserName()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_USER_NAME)).Trim();
            if (configItemValue.Length == 0)
            {
                return null;
            }

            return configItemValue;
        }

        internal string getPassword()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_PASSWORD)).Trim();
            if (configItemValue.Length == 0)
            {
                return null;
            }

            return configItemValue;
        }

        internal int getAppsflyerDelayDay()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_APPSFLYER_DELAY_DAY)).Trim();
            if (configItemValue.Length == 0)
            {
                return 2;
            }

            try
            {
                return Convert.ToInt16(configItemValue);
            }
            catch(Exception ex)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Parse appsflyer delay day failed, config <{0}>, error message <{1}>.", configItemValue, ex.Message));
                return 2;
            }
        }

        internal int getRetentionPeriod()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_RETENTION_PERIOD)).Trim();
            if (configItemValue.Length == 0)
            {
                return 7;
            }

            try
            {
                return Convert.ToInt16(configItemValue);
            }
            catch (Exception ex)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Parse retention period failed, config <{0}>, error message <{1}>.", configItemValue, ex.Message));
                return 7;
            }
        }

        public int getDownloadDataCycle()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_CHECK_CYCLE)).Trim();
            if (configItemValue.Length == 0)
            {
                return (30 * 60);
            }

            try
            {
                return Convert.ToInt32(configItemValue);
            }
            catch (Exception ex)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Parse appsflyer delay day failed, config <{0}>, error message <{1}>.", configItemValue, ex.Message));
                return (30 * 60);
            }
        }

        internal string getIOSDataStorePath()
        {
            string dataStorePath = string.Format("{0}/{1}", getDataStorePath(), "ios");
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

        internal string getElementPassword()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_PASSWORD_PAGE_ELEMENT_NAME)).Trim();
            if (configItemValue.Length == 0)
            {
                return "password";
            }

            return configItemValue;
        }

        internal string getElementUserName()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_USER_NAME_PAGE_ELEMENT_NAME)).Trim();
            if (configItemValue.Length == 0)
            {
                return "username";
            }

            return configItemValue;
        }

        /// <summary>
        /// 绩效报告存储路径
        /// </summary>
        /// <returns>绩效报告存储路径</returns>
        internal string getPerformanceReportDataStorePath()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_PERFORMANCE_REPORT_DATA));
            if (configItemValue == null)
            {
                return string.Format("{0}/{1}", CPublic.getAppStartPath(), "performance_report_data");
            }

            return configItemValue;
        }

        /// <summary>
        /// 绩效报告抓取间隔,单位小时
        /// </summary>
        /// <returns></returns>
        internal int getPerformanceReportSpiderGap()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_PERFORMANCE_REPORT_SPIDER_GAP)).Trim();
            if (configItemValue.Length == 0)
            {
                return 1;
            }

            try
            {
                return Convert.ToInt32(configItemValue);
            }
            catch (Exception ex)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Parse performance report spider gap failed, config <{0}>, error message <{1}>.", configItemValue, ex.Message));
                return 1;
            }
        }

        /// <summary>
        /// 绩效报告抓取天数,单位天
        /// </summary>
        /// <returns></returns>
        internal int getPerformanceReportSpiderDay()
        {
            string configItemValue = string.Format("{0}", _AppsflyerConfig.getConfigItem(CONFIG_ITEM_PERFORMANCE_REPORT_SPIDER_DAY)).Trim();
            if (configItemValue.Length == 0)
            {
                return 3;
            }

            try
            {
                return Convert.ToInt32(configItemValue);
            }
            catch (Exception ex)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Parse performance report spider gap failed, config <{0}>, error message <{1}>.", configItemValue, ex.Message));
                return 3;
            }
        }
    }
}
