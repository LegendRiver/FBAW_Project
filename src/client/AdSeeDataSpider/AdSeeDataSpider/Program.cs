using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.IO;
using System.Text.RegularExpressions;

namespace AdSeeDataSpider
{
    class Program
    {
        private static string CONFIG_ITEM_APPSFLYER_CONFIG_FILE = "APPSFLYER_CONFIG_FILE";

        private static DateTime _CurrentTime = DateTime.MinValue;
        private static DateTime _LastTime = DateTime.MinValue;
        private static List<string> _LocalMacAddressList = null;
        private static List<string> _LocalIPAddressList = null;

		private static CSystemConfig _SystemConfig = null;
		private static CSystemLog _SystemLog = null;
        private static string _AppsflyerConfigFilePath = string.Empty;
        static int Main(string[] args)
        {
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            _SystemLog = new CSystemLog(true, LOG_LEVEL.DEBUG, string.Format("{0}/{1}", CPublic.getAppStartPath(), "system_log"));
            _SystemConfig = new CSystemConfig (CPublic.SYSTEM_CONFIG_FILE, _SystemLog);
            errorCode = _SystemConfig.initConfig();
            if(errorCode != E_ERROR_CODE.OK)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.CRIT, string.Format("Init system config <{0}> failed, error code <{1}>.", CPublic.SYSTEM_CONFIG_FILE, errorCode));
                return (int)errorCode;
            }
            
            _SystemConfig.printSystemConfig();

            _AppsflyerConfigFilePath = string.Format("{0}", _SystemConfig.getConfigItem(CONFIG_ITEM_APPSFLYER_CONFIG_FILE)).Trim();
            if(!File.Exists(_AppsflyerConfigFilePath))
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.CRIT, string.Format("Appsflyer config file <{0}> not exits.", _AppsflyerConfigFilePath));
                return (int)E_ERROR_CODE.ERROR_FILE_NOT_EXIST;
            }

            CAdSeeDataSpider appsFlyerDataSpider = new CAdSeeDataSpider(_AppsflyerConfigFilePath, _SystemLog);
            errorCode = appsFlyerDataSpider.initAppsFlyerSpiderConfig();
            if (errorCode != E_ERROR_CODE.OK)
            {
                appsFlyerDataSpider.cleanUp();
                _SystemLog.writeLog2Console(LOG_LEVEL.CRIT, string.Format("Init appsflyer spider config failed, error code <{0}>.", errorCode));
                return (int)errorCode;
            }

            errorCode = appsFlyerDataSpider.initWebDriver();
            if(errorCode != E_ERROR_CODE.OK)
            {
                appsFlyerDataSpider.cleanUp();
                _SystemLog.writeLog2Console(LOG_LEVEL.CRIT, string.Format("Init webdriver failed, error code <{0}>.", errorCode));
                return (int)errorCode;
            }
            errorCode = appsFlyerDataSpider.openHomePage();
            if ((errorCode != E_ERROR_CODE.OK) || (!appsFlyerDataSpider.IsLoginSuccessed))
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Login appsflyer system failed, after <{0}> login again.", 60));
                return (int)errorCode;
            }

            errorCode = appsFlyerDataSpider.downloadAndroidAppAdData();
            return (int)errorCode;
        }
        
        private static void initLocalVaribles()
        {
            _LocalMacAddressList = CPublic.getMacByNetworkInterface();
            _LocalIPAddressList = CPublic.getLocalIpAddress();
        }
        
    }
}
