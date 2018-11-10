using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using QueryPageOrder;
using System.Threading;
using System.IO;
using System.Text.RegularExpressions;

namespace AutoWebBrowser
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

            CAppsFlyerDataSpider appsFlyerDataSpider = new CAppsFlyerDataSpider(_AppsflyerConfigFilePath, _SystemLog);
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

            int retentionPeriod = appsFlyerDataSpider.AppsFlyerDataSpiderConfig.getRetentionPeriod();
            int appsflyerDelayDay = appsFlyerDataSpider.AppsFlyerDataSpiderConfig.getAppsflyerDelayDay();
            int queryCycle = appsFlyerDataSpider.AppsFlyerDataSpiderConfig.getDownloadDataCycle();
            while (true)
            {
                _CurrentTime = DateTime.Now;
                _LastTime = _CurrentTime;
                errorCode = appsFlyerDataSpider.loginSystem();
                if ((errorCode != E_ERROR_CODE.OK) || (!appsFlyerDataSpider.IsLoginSuccessed))
                {
                    _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Login appsflyer system failed, after <{0}> login again.", 60));
                    Thread.Sleep(TimeSpan.FromSeconds(30));
                }

                /* 每8小时取一个留存数据 */
                if(_CurrentTime.Subtract(_LastTime).Hours >= queryCycle)
                {
                    DateTime endDate = _CurrentTime.Date.Subtract(TimeSpan.FromDays(appsflyerDelayDay));
                    DateTime startDate = endDate.Subtract(TimeSpan.FromDays((retentionPeriod - 1)));
                    errorCode = appsFlyerDataSpider.downloadAndroidData(startDate, endDate);
                    if (errorCode != E_ERROR_CODE.OK)
                    {
                        _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Download android data <{0},{1}> failed .", CPublic.getDateString(startDate), CPublic.getDateString(endDate)));
                    }

                    errorCode = appsFlyerDataSpider.downloadIOSData(startDate, endDate);
                    if (errorCode != E_ERROR_CODE.OK)
                    {
                        _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Download ios data <{0},{1}> failed .", CPublic.getDateString(startDate), CPublic.getDateString(endDate)));
                    }
                }

                /* AppsFlyer汇总绩效报告 Performance report */
                if (_CurrentTime.Hour != _LastTime.Hour )
                {
                    errorCode = appsFlyerDataSpider.downloadAndroidPerformanceReportData(_CurrentTime);
                    if (errorCode != E_ERROR_CODE.OK)
                    {
                        _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Download android performance report data <{0}> failed .", CPublic.getDateString(_CurrentTime)));
                    }

                    errorCode = appsFlyerDataSpider.downloadIOSPerformanceReportData(_CurrentTime);
                    if (errorCode != E_ERROR_CODE.OK)
                    {
                        _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Download ios performance report data <{0}> failed .", CPublic.getDateString(_CurrentTime)));
                    }
                }

                _LastTime = _CurrentTime;
                _SystemLog.writeLog2Console(LOG_LEVEL.INFO, string.Format("Query cycle <{0}>, Current time <{1}>, Next download data at <{2}> .", queryCycle, CPublic.getDateTimeString(_CurrentTime), CPublic.getDateTimeString(_CurrentTime.AddSeconds(queryCycle))));

                Thread.Sleep(TimeSpan.FromSeconds(30 * 60));
            }
        }
        
        private static void initLocalVaribles()
        {
            _LocalMacAddressList = CPublic.getMacByNetworkInterface();
            _LocalIPAddressList = CPublic.getLocalIpAddress();
        }
        
    }
}
