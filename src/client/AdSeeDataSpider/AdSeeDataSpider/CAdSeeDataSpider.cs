using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using QA = OpenQA.Selenium;
using UI = OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Remote;
using OpenQA.Selenium.PhantomJS;
using System.Text.RegularExpressions;
using System.Diagnostics;
using System.Threading;
using System.IO;
using System.Collections.ObjectModel;
using System.Web.Script.Serialization;
using System.Web;
using OpenQA.Selenium.Support.UI;
using System.Windows.Forms;
using System.Net;
using Newtonsoft.Json.Linq;

namespace AdSeeDataSpider
{
	public class CAdSeeDataSpider
	{
        private string _SearchEngineName = string.Empty;
        private QA.IWebDriver _WebDriver = null;//存储WebDriver对象
        private int PhantomjsDriverProcessId = -1;

        private string message = string.Empty;
        private CSystemLog _SystemLog = null;
        private CAdSeeDataSpiderConfig _AppsFlyerDataSpiderConfig = null;
        public CAdSeeDataSpiderConfig AppsFlyerDataSpiderConfig { get { return _AppsFlyerDataSpiderConfig; } }

        public CLoginResult _LoginResult = null;
        private bool _IsLoginSuccessed = false;

        private List<CAppAdImageList> _AppAdImageList = null;
        public bool IsLoginSuccessed { get { return _IsLoginSuccessed; } }
        private string _AccessWebUrl = string.Empty;
        private string _UserAgent = null;//存储当前使用的浏览器代理
		public CAdSeeDataSpider (string appsflyerConfigFile, CSystemLog systemLog)
		{
            _UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36";
            _AppsFlyerDataSpiderConfig = new CAdSeeDataSpiderConfig(appsflyerConfigFile, systemLog);
            _AppAdImageList = new List<CAppAdImageList>();

        }
        
        public E_ERROR_CODE initAppsFlyerSpiderConfig()
        {
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            errorCode = _AppsFlyerDataSpiderConfig.initConfig();
            if(errorCode!= E_ERROR_CODE.OK)
            {
                return errorCode;
            }

            _SystemLog = new CSystemLog(true, _AppsFlyerDataSpiderConfig.getLogLevel(), _AppsFlyerDataSpiderConfig.getLogPath());
            return E_ERROR_CODE.OK;
        }

		private string getWebDriverLogFile()
		{
			string message = string.Empty;
			string webDriverPath = _AppsFlyerDataSpiderConfig.getWebdriverLogStorePath ();
			if ((webDriverPath == null) || (webDriverPath == string.Empty)) 
			{
				message = string.Format ("Not config web driver log path<{0}>.", "WEBDRIVER_LOG_PATH");
				_SystemLog.writeLog2Console (LOG_LEVEL.WARNING, message);
				return string.Format("{0}/{1}.log", Application.StartupPath, Thread.CurrentThread.ManagedThreadId);
			}

			string logPath = string.Format("{0}/{1}", Application.StartupPath, webDriverPath);
			if (!Directory.Exists(logPath))
			{
				Directory.CreateDirectory(logPath);
			}

			return string.Format("{0}/{1}.log", logPath, Thread.CurrentThread.ManagedThreadId);
		}

		/// <summary>
		/// 清空执行环境状态数据
		/// </summary>
		public void cleanUp()
		{
			string message = string.Empty;
			if (_WebDriver == null)
			{
				return;
			}

			clearAllCookies();
			try
			{
				_WebDriver.Quit();
			}
			catch (Exception ex)
			{
				message = string.Format("Exit webdriver faild,error message<{0}>.", ex.Message);
				_SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
			}

			try
			{
				_WebDriver.Dispose();
			}
			catch (Exception ex)
			{
				message = string.Format("Dispose webdriver faild,error message<{0}>.", ex.Message);
				_SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
			}

			_WebDriver = null;

			CPublic.killProcess(PhantomjsDriverProcessId);
		}

		/// <summary>
		/// 清除保存的cookies数据
		/// </summary>
		private void clearAllCookies()
		{
			string message = string.Empty;
			try
			{
				message = "Clear cookies successed.";
				_WebDriver.Manage().Cookies.DeleteAllCookies();
				_SystemLog.writeLog2Console(LOG_LEVEL.INFO, message);
			}
			catch (Exception ex)
			{
				message = string.Format("Clear cookies faild,error message<{0}>.", ex.Message);
				_SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
			}
		}
        
        public E_ERROR_CODE openHomePage()
        {
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            string appsflyerHomePageUrl = _AppsFlyerDataSpiderConfig.getHomePageUrl();

            errorCode = openHomePage(appsflyerHomePageUrl);
            if(errorCode != E_ERROR_CODE.OK)
            {
                return errorCode;
            }

            return loginSystemUseHttpRequest(_WebDriver);
        }
        

        /// <summary>
        /// 创建浏览器驱动对象
        /// </summary>
        /// <returns>失败返回null,成功返回对象指针</returns>
        public E_ERROR_CODE initWebDriver()
		{
			string message = string.Empty;

			PhantomJSDriverService driverService = PhantomJSDriverService.CreateDefaultService(CPublic.getAppStartPath());
			driverService.LogFile = getWebDriverLogFile();
			driverService.LocalStoragePath = string.Format("{0}/{1}", CPublic.getAppStartPath(), "LocalStorage");
			driverService.LocalStorageQuota = 1024 * 1024 * 5;
			driverService.HideCommandPromptWindow = true;
			driverService.IgnoreSslErrors = true;
			driverService.DiskCache = true;
            driverService.MaxDiskCacheSize = 1024 * 1024 * 10;
			driverService.LocalToRemoteUrlAccess = true;
			driverService.CookiesFile = string.Format("{0}/{1}/{2}", CPublic.getAppStartPath(), "cookies", Guid.NewGuid().ToString());
            
			PhantomJSOptions options = new PhantomJSOptions();
			options.AddAdditionalCapability("phantomjs.page.settings.userAgent", _UserAgent);

			try
			{
				_WebDriver = new QA.PhantomJS.PhantomJSDriver(driverService, options);
                
                PhantomjsDriverProcessId = driverService.ProcessId;
                return E_ERROR_CODE.OK;
			}
			catch (Exception ex)
			{
                _WebDriver = null;
				message = string.Format("Init webdriver faild:{0}", ex.Message);
				_SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
				return E_ERROR_CODE.ERROR_INIT_WEBDRIVER_FAILED;
			}
		}

		/// <summary>
		/// 找末指定的URL地址
		/// </summary>
		/// <param name="url">要打开的url地址</param>
		/// <returns>成功返回true,失败返回false</returns>
		private E_ERROR_CODE openHomePage(string url)
		{
			string message = string.Empty;
			try
			{
				_WebDriver.Manage().Timeouts().SetPageLoadTimeout(TimeSpan.FromSeconds(20));
				_WebDriver.Manage().Timeouts().SetScriptTimeout(TimeSpan.FromSeconds(20));
				_WebDriver.Navigate().GoToUrl(url);
				if (_WebDriver.Url.IndexOf(url) == -1)
				{
					message = string.Format("Open appsflyer home page <{0}> failed.", url);
					_SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
					return E_ERROR_CODE.ERROR_OPEN_LOGIN_PAGE_FAILED;
				}

				return E_ERROR_CODE.OK;
			}
			catch (Exception ex)
			{
				message = string.Format("Open appsflyer home home page<{0}> failed, error message<{1}>.", url, ex.Message);
				_SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
				return E_ERROR_CODE.ERROR_OPEN_LOGIN_PAGE_FAILED;
			}
		}
        
        public E_ERROR_CODE downloadAndroidAppAdData()
        {
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            List<string> androidIdList = new List<string>();
            int adCount = 0;
            int pageNo = 1;
            int recordNumberOnPage = 20;
            int totalPages = 1;
            string message = string.Empty;
            string queryAppAdSummaryUrl = string.Empty;
            string queryAdListUrl = string.Empty;
            string dataFile = string.Empty;
            string androidDataStorePath = _AppsFlyerDataSpiderConfig.getAndroidDataStorePath();
            string appDataStorePath = string.Empty;

            if (androidDataStorePath == null)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, "Get android data file store path failed.");
                return E_ERROR_CODE.ERROR_GET_ANDROID_DATA_FILE_STORE_PATH_FAILED;
            }

            errorCode = _AppsFlyerDataSpiderConfig.loadAndroidApplicationIds(androidIdList);
            if(errorCode != E_ERROR_CODE.OK)
            {
                return errorCode;
            }
            
            foreach(string androidApplicationId in androidIdList)
            {
                appDataStorePath = string.Format("{0}/{1}", androidDataStorePath, androidApplicationId);
                if (!Directory.Exists(appDataStorePath))
                {
                    try
                    {
                        Directory.CreateDirectory(appDataStorePath);
                    }
                    catch (Exception ex)
                    {
                        message = string.Format("Create app <{0}> data store path failed, error message <{1}>.", androidApplicationId, ex.Message);
                        _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                        continue;
                    }
                }

                message = string.Format("Start download app <{0}> .......", androidApplicationId);
                _SystemLog.writeLog2Console(LOG_LEVEL.DEBUG, message);

                queryAppAdSummaryUrl = _AppsFlyerDataSpiderConfig.getAdSummaryUrl(androidApplicationId,_LoginResult.userId, _LoginResult.accessToken);
                dataFile = string.Format("{0}/{1}_ad_summary.dat", appDataStorePath, androidApplicationId);
                message = string.Format("Query data url <{0}>, dataFile <{1}>.", queryAppAdSummaryUrl, dataFile);
                _SystemLog.writeLog2Console(LOG_LEVEL.DEBUG, message);
                if(checkUserLogin() != E_ERROR_CODE.OK)
                {
                    errorCode = loginSystemUseHttpRequest(_WebDriver);
                    if(errorCode != E_ERROR_CODE.OK)
                    {
                        message = string.Format("Login failed, application <{0}> download data failed, error code <{1}>.", androidApplicationId, errorCode);
                        _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                    }
                }

                errorCode = downloadAppAdSummaryData(queryAppAdSummaryUrl, _WebDriver, dataFile, out adCount);
                if(errorCode != E_ERROR_CODE.OK)
                {
                    message = string.Format("Android application <{0}> download data failed, error code <{1}>.", androidApplicationId, errorCode);
                    _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                }

                totalPages = (int)Math.Ceiling((adCount * 1.0) / recordNumberOnPage);
                message = string.Format("app <{0}> total ad count <{1}>, total pages <{2}>.......", androidApplicationId, adCount, totalPages);
                _SystemLog.writeLog2Console(LOG_LEVEL.DEBUG, message);
                for (pageNo = 1; pageNo <= totalPages; ++pageNo)
                {
                    message = string.Format("Start download app <{0}> page <{1}>.......", androidApplicationId, pageNo);
                    _SystemLog.writeLog2Console(LOG_LEVEL.DEBUG, message);
                    if (checkUserLogin() != E_ERROR_CODE.OK)
                    {
                        errorCode = loginSystemUseHttpRequest(_WebDriver);
                        if (errorCode != E_ERROR_CODE.OK)
                        {
                            message = string.Format("Login failed, application <{0}> page <{1}>, error code <{2}>.", androidApplicationId, pageNo, errorCode);
                            _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                        }
                    }

                    downloadAppAdPage(androidApplicationId, appDataStorePath, pageNo);
                    message = string.Format("End download app <{0}> page <{1}>.......", androidApplicationId, pageNo);
                    _SystemLog.writeLog2Console(LOG_LEVEL.DEBUG, message);
                    Thread.Sleep(TimeSpan.FromSeconds(Math.Round(8.0)));
                }
                
                message = string.Format("End download app <{0}> .......", androidApplicationId);
                _SystemLog.writeLog2Console(LOG_LEVEL.DEBUG, message);

                Thread.Sleep(TimeSpan.FromSeconds(Math.Round(30.0)));
            }

            return E_ERROR_CODE.OK;
        }

        private void downloadAppAdPage(string androidApplicationId, string appDataStorePath, int pageNo)
        {
            string dataFile = string.Empty;
            string queryAdListUrl = string.Empty;
            string message = string.Empty;
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            queryAdListUrl = _AppsFlyerDataSpiderConfig.getAdListUrl(androidApplicationId, _LoginResult.userId, _LoginResult.accessToken, pageNo);
            dataFile = string.Format("{0}/{1}_P{2}_ad_list.dat", appDataStorePath, androidApplicationId, pageNo);
            message = string.Format("Query ad list url <{0}>, dataFile <{1}>.", queryAdListUrl, dataFile);
            _SystemLog.writeLog2Console(LOG_LEVEL.DEBUG, message);

            errorCode = downloadAppAdListData(queryAdListUrl, _WebDriver, dataFile, pageNo);
            if (errorCode != E_ERROR_CODE.OK)
            {
                message = string.Format("Android application <{0}> download data failed, error code <{1}>.", androidApplicationId, errorCode);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
            }

            errorCode = downloadAppAdImages(appDataStorePath);
            if (errorCode != E_ERROR_CODE.OK)
            {
                message = string.Format("Download images <{0}> download app ad images failed, error code <{1}>.", androidApplicationId, errorCode);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
            }
        }
        private E_ERROR_CODE downloadAppAdSummaryData(string queryAdSummaryUrl, QA.IWebDriver webDriver, string dataFileName, out int adCount)
        {
            string message = string.Empty;
            string responseContent = string.Empty;
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            StreamReader responseStreamReader = null;
            HttpWebResponse httpResponse = null;
            HttpWebRequest httpRequest = null;
            try
            {
                httpRequest = (HttpWebRequest)WebRequest.Create(queryAdSummaryUrl);
            }
            catch (Exception ex)
            {
                adCount = 0;
                message = string.Format("Create web request failed <{0}>,error message<{1}>.", queryAdSummaryUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_HTTP_WEB_REQUEST_FAILED;
            }

            httpRequest.CookieContainer = new System.Net.CookieContainer();

            for (int i = 0; i < webDriver.Manage().Cookies.AllCookies.Count - 1; i++)
            {
                System.Net.Cookie cookie = new System.Net.Cookie(webDriver.Manage().Cookies.AllCookies[i].Name,
                    webDriver.Manage().Cookies.AllCookies[i].Value,
                    webDriver.Manage().Cookies.AllCookies[i].Path,
                    webDriver.Manage().Cookies.AllCookies[i].Domain);
                httpRequest.CookieContainer.Add(cookie);
            }

            httpRequest.Accept = "text/html; charset=UTF-8";
            httpRequest.UserAgent = _UserAgent;
            try
            {
                httpResponse = (HttpWebResponse)httpRequest.GetResponse();
            }
            catch (Exception ex)
            {
                adCount = 0;
                message = string.Format("Get web response failed <{0}>,error message<{1}>.", queryAdSummaryUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_GET_RESPONSE_FAILED;
            }

            try
            {
                responseStreamReader = new StreamReader(httpResponse.GetResponseStream(), Encoding.UTF8);
            }
            catch (Exception ex)
            {
                adCount = 0;
                message = string.Format("Create response stream redaer failed <{0}>,error message<{1}>.", queryAdSummaryUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_RESPONSE_STREAM_READER;
            }

            try
            {
                responseContent = responseStreamReader.ReadToEnd();
            }
            catch (Exception ex)
            {
                adCount = 0;
                message = string.Format("Read response stream content failed <{0}>,error message<{1}>.", queryAdSummaryUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_RESPONSE_STREAM_READER;
            }
            finally
            {
                if (responseStreamReader != null)
                {
                    responseStreamReader.Close();
                    responseStreamReader.Dispose();
                    responseStreamReader = null;
                }
            }

            responseContent = responseContent.Replace("\ufeff", "");

            errorCode = writeDataToFile(responseContent, dataFileName);
            if (errorCode != E_ERROR_CODE.OK)
            {
                adCount = 0;
                message = string.Format("Write ad list content to file <{0}> failed,error code<{1}>.", dataFileName, errorCode);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return errorCode;
            }

            return processAppAdSummaryInfo(responseContent, out adCount);
        }

        private E_ERROR_CODE processAppAdSummaryInfo(string responseContent, out int adCount)
        {
            string message = string.Empty;
            JObject summaryResultObject = null;
            JObject requestState = null;
            JObject resultData = null;
            JObject resultDataObject = null;
            int stateCode = 1;
            try
            {
                summaryResultObject = JObject.Parse(responseContent);
            }
            catch(Exception ex)
            {
                adCount = 0;
                message = string.Format("Parse ad summary content to JObject <{0}> failed,error message<{1}>.", responseContent, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_JSON_PARSE_AD_SUMMARY_CONTENT_FAILED;
            }

            try
            {
                requestState = summaryResultObject.GetValue("state").Value<JObject>();
            }
            catch(Exception ex)
            {
                adCount = 0;
                message = string.Format("Not found field <{0}> failed,error message<{1}>.", "state", ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_FOUND_FIELD_STATE;
            }

            stateCode = requestState.GetValue("code").Value<int>();
            if(stateCode != 0)
            {
                adCount = 0;
                message = string.Format("Server process query failed <{0}> failed,error message<{1}>.", stateCode, requestState.GetValue("msg").Value<string>());
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_SERVER_PROCESS_FAILED;
            }

            try
            {
                resultData = summaryResultObject.GetValue("data").Value<JObject>();
            }
            catch (Exception ex)
            {
                adCount = 0;
                message = string.Format("Not found field <{0}> failed,error message<{1}>.", "data", ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_FOUND_FIELD_DATA;
            }

            
            try
            {
                resultDataObject = resultData.GetValue("object").Value<JObject>();
            }
            catch (Exception ex)
            {
                adCount = 0;
                message = string.Format("Not found field <{0}> failed,error message<{1}>.", "object", ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_FOUND_FIELD_DATA_OBJECT;
            }

            try
            {
                adCount = resultDataObject.GetValue("adCount").Value<int>();
            }
            catch (Exception ex)
            {
                adCount = 0;
                message = string.Format("Not found field <{0}> failed,error message<{1}>.", "adCount", ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_FOUND_FIELD_DATA_OBJECT_AD_COUNT;
            }

            return E_ERROR_CODE.OK;
        }

        private E_ERROR_CODE downloadAppAdListData(string queryAdListUrl, QA.IWebDriver webDriver, string dataFileName, int pageNo)
        {
            string message = string.Empty;
            string responseContent = string.Empty;
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            StreamReader responseStreamReader = null;
            HttpWebResponse httpResponse = null;
            HttpWebRequest httpRequest = null;
            try
            {
                httpRequest = (HttpWebRequest)WebRequest.Create(queryAdListUrl);
            }
            catch (Exception ex)
            {
                message = string.Format("Create web request failed <{0}>,error message<{1}>.", queryAdListUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_HTTP_WEB_REQUEST_FAILED;
            }

            httpRequest.CookieContainer = new System.Net.CookieContainer();

            for (int i = 0; i < webDriver.Manage().Cookies.AllCookies.Count - 1; i++)
            {
                System.Net.Cookie cookie = new System.Net.Cookie(webDriver.Manage().Cookies.AllCookies[i].Name, 
                    webDriver.Manage().Cookies.AllCookies[i].Value,
                    webDriver.Manage().Cookies.AllCookies[i].Path, 
                    webDriver.Manage().Cookies.AllCookies[i].Domain);
                httpRequest.CookieContainer.Add(cookie);
            }

            httpRequest.Accept = "text/html; charset=UTF-8";
            httpRequest.UserAgent = _UserAgent;
            try
            {
                httpResponse = (HttpWebResponse)httpRequest.GetResponse();
            }
            catch (Exception ex)
            {
                message = string.Format("Get web response failed <{0}>,error message<{1}>.", queryAdListUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_GET_RESPONSE_FAILED;
            }

            try
            {
                responseStreamReader = new StreamReader(httpResponse.GetResponseStream(), Encoding.UTF8);
            }
            catch (Exception ex)
            {
                message = string.Format("Create response stream redaer failed <{0}>,error message<{1}>.", queryAdListUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_RESPONSE_STREAM_READER;
            }

            try
            {
                responseContent = responseStreamReader.ReadToEnd();
            }
            catch (Exception ex)
            {
                message = string.Format("Read response stream content failed <{0}>,error message<{1}>.", queryAdListUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_RESPONSE_STREAM_READER;
            }
            finally
            {
                if (responseStreamReader != null)
                {
                    responseStreamReader.Close();
                    responseStreamReader.Dispose();
                    responseStreamReader = null;
                }
            }

            responseContent = responseContent.Replace("\ufeff", "");
            
            errorCode =writeDataToFile(responseContent, dataFileName);
            if(errorCode !=  E_ERROR_CODE.OK)
            {
                message = string.Format("Write ad list content to file <{0}> failed,error code<{1}>.", dataFileName, errorCode);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return errorCode;
            }

            return processAppAdImages(responseContent, pageNo);
        }

        private E_ERROR_CODE processAppAdImages(string adListContent, int pageNo)
        {
            string message = string.Empty;
            JObject adListContentObject = null;
            JObject resultStateObject = null;
            JObject adListDataContent = null;
            JArray adList = null;
            int adIndex = 0;
            _AppAdImageList.Clear();
            try
            {
                adListContentObject = JObject.Parse(adListContent);
            }
            catch(Exception ex)
            {
                message = string.Format("Parse ad list content failed <{0}>,error message<{1}>.", adListContent, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_JSON_PARSE_AD_LIST_CONTENT_FAILED;
            }

            try
            {
                resultStateObject = adListContentObject.GetValue("state").Value<JObject>();
            }
            catch(Exception ex)
            {
                message = string.Format("Not found state,error message<{0}>.", ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_JSON_PARSE_AD_LIST_CONTENT_FAILED;
            }

            if(resultStateObject.GetValue("code").Value<int>() != 0)
            {
                message = "Get Ad list data failed.";
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_GET_AD_LIST_DATA_FAILED;
            }

            try
            {
                adListDataContent = adListContentObject.GetValue("data").Value<JObject>();
            }
            catch(Exception ex)
            {
                message = string.Format("Not found data,error message<{0}>.", ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_JSON_PARSE_AD_DATA_CONTENT_FAILED;
            }

            try
            {
                adList = adListDataContent.GetValue("list").Value<JArray>();
            }
            catch(Exception ex)
            {
                message = string.Format("Not found list,error message<{0}>.", ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_JSON_PARSE_AD_DATA_CONTENT_FAILED;
            }

            foreach(JObject adItem in adList)
            {
                CAppAdImageList appAdImageList = new CAppAdImageList(pageNo, adIndex, _SystemLog);
                adIndex += 1;
                if (appAdImageList.parse(adItem) != E_ERROR_CODE.OK)
                {
                    message = string.Format("Parse app ad <{0}> images failed.", adItem.GetValue("pageid").Value<string>());
                    _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                    continue;
                }

                _AppAdImageList.Add(appAdImageList);
            }

            return E_ERROR_CODE.OK;
        }

        private E_ERROR_CODE downloadAppAdImages(string appDataStorePath)
        {
            string imageStorePath = string.Empty;
            string imageStoreFile = string.Empty;
            foreach (CAppAdImageList appAdImageList in _AppAdImageList)
            {
                imageStorePath = string.Format("{0}/P{1}/AI{2}", appDataStorePath, appAdImageList.PageNo, appAdImageList.AdIndex);
                if(!Directory.Exists(imageStorePath))
                {
                    try
                    {
                        Directory.CreateDirectory(imageStorePath);
                    }
                    catch(Exception ex)
                    {
                        message = string.Format("Create app ad <{0}> images failed,error message<{1}>.", appAdImageList.pageid, ex.Message);
                        _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                        continue;
                    }
                }

                foreach (string imageFileUrl in appAdImageList.ImageList)
                {
                    message = string.Format("Start download image file <{0}> .......", imageFileUrl);
                    _SystemLog.writeLog2Console(LOG_LEVEL.DEBUG, message);
                    imageStoreFile = string.Format("{0}/P{1}_AI{2}_{3}", imageStorePath, appAdImageList.PageNo, appAdImageList.AdIndex, GetFileNameFromUrl(imageFileUrl));
                    if(File.Exists(imageStoreFile))
                    {
                        continue;
                    }

                    try
                    {
                        CHttpRequest.downloadImageFile(imageFileUrl, imageStoreFile, _UserAgent);
                        message = string.Format("End download image file <{0}> .......", imageFileUrl);
                        _SystemLog.writeLog2Console(LOG_LEVEL.DEBUG, message);
                    }
                    catch(Exception ex)
                    {
                        message = string.Format("Download image file  <{0}> page id <{1}> failed,error message <{2}>.", imageFileUrl, appAdImageList.pageid, ex.Message);
                        _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                    }
                }
            }

            return E_ERROR_CODE.OK;
        }

        private string GetFileNameFromUrl(string url)
        {
            Uri uri;
            if (!Uri.TryCreate(url, UriKind.Absolute, out uri))
                uri = new Uri(url);

            return Path.GetFileName(uri.LocalPath);
        }

        private E_ERROR_CODE loginSystemUseHttpRequest(QA.IWebDriver driver)
        {
            string message = string.Empty;
            string responseContent = string.Empty;
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            StreamReader responseStreamReader = null;
            HttpWebResponse httpResponse = null;
            HttpWebRequest httpRequest = null;
            string loginUrl = _AppsFlyerDataSpiderConfig.getLoginUrl();
            try
            {
                httpRequest = (HttpWebRequest)WebRequest.Create(loginUrl);
            }
            catch (Exception ex)
            {
                message = string.Format("Create web request failed <{0}>,error message<{1}>.", loginUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_HTTP_WEB_REQUEST_FAILED;
            }

            httpRequest.CookieContainer = new System.Net.CookieContainer();

            for (int i = 0; i < driver.Manage().Cookies.AllCookies.Count - 1; i++)
            {
                System.Net.Cookie cookie = new System.Net.Cookie(driver.Manage().Cookies.AllCookies[i].Name, driver.Manage().Cookies.AllCookies[i].Value, driver.Manage().Cookies.AllCookies[i].Path, driver.Manage().Cookies.AllCookies[i].Domain);
                httpRequest.CookieContainer.Add(cookie);
            }

            httpRequest.Accept = "text/html; charset=UTF-8";
            httpRequest.UserAgent = _UserAgent;
            try
            {
                httpResponse = (HttpWebResponse)httpRequest.GetResponse();
            }
            catch (Exception ex)
            {
                message = string.Format("Get web response failed <{0}>,error message<{1}>.", loginUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_GET_RESPONSE_FAILED;
            }

            try
            {
                responseStreamReader = new StreamReader(httpResponse.GetResponseStream(), Encoding.UTF8);
            }
            catch (Exception ex)
            {
                message = string.Format("Create response stream redaer failed <{0}>,error message<{1}>.", loginUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_RESPONSE_STREAM_READER;
            }

            try
            {
                responseContent = responseStreamReader.ReadToEnd();
                responseContent = responseContent.Replace("\ufeff", "");

                errorCode = processLoginData(responseContent);
                if(errorCode == E_ERROR_CODE.OK)
                {
                    //writeCookies(driver);
                }

                return errorCode;
            }
            catch (Exception ex)
            {
                message = string.Format("Read response stream content failed <{0}>,error message<{1}>.", loginUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_RESPONSE_STREAM_READER;
            }
            finally
            {
                if (responseStreamReader != null)
                {
                    responseStreamReader.Close();
                    responseStreamReader.Dispose();
                    responseStreamReader = null;
                }
            }
        }

        private E_ERROR_CODE checkUserLogin()
        {
            string checkUserLoginUrl = _AppsFlyerDataSpiderConfig.getCheckUserLoginUrl(_LoginResult.userId, _LoginResult.accessToken);
            string message = string.Empty;
            string responseContent = string.Empty;
            StreamReader responseStreamReader = null;
            HttpWebResponse httpResponse = null;
            HttpWebRequest httpRequest = null;
            try
            {
                httpRequest = (HttpWebRequest)WebRequest.Create(checkUserLoginUrl);
            }
            catch (Exception ex)
            {
                message = string.Format("Create check user login web request failed <{0}>,error message<{1}>.", checkUserLoginUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_HTTP_WEB_REQUEST_FAILED;
            }
            
            httpRequest.Accept = "text/html; charset=UTF-8";
            httpRequest.UserAgent = _UserAgent;
            try
            {
                httpResponse = (HttpWebResponse)httpRequest.GetResponse();
            }
            catch (Exception ex)
            {
                message = string.Format("Get check user login web response failed <{0}>,error message<{1}>.", checkUserLoginUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_GET_RESPONSE_FAILED;
            }

            try
            {
                responseStreamReader = new StreamReader(httpResponse.GetResponseStream(), Encoding.UTF8);
            }
            catch (Exception ex)
            {
                message = string.Format("Create response stream redaer failed <{0}>,error message<{1}>.", checkUserLoginUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_RESPONSE_STREAM_READER;
            }

            try
            {
                responseContent = responseStreamReader.ReadToEnd();
                responseContent = responseContent.Replace("\ufeff", "");

                return processCheckLoginData(responseContent);
            }
            catch (Exception ex)
            {
                message = string.Format("Read check user login response stream content failed <{0}>,error message<{1}>.", checkUserLoginUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_RESPONSE_STREAM_READER;
            }
            finally
            {
                if (responseStreamReader != null)
                {
                    responseStreamReader.Close();
                    responseStreamReader.Dispose();
                    responseStreamReader = null;
                }
            }
        }

        private E_ERROR_CODE processCheckLoginData(string responseContent)
        {
            /* 
             * 
             * {"state":{"code":0,"msg":"ok"}}
             * */
            string message = string.Empty;
            JObject responseObject = null;
            try
            {
                responseObject = JObject.Parse(responseContent);
            }
            catch (Exception ex)
            {
                message = string.Format("JSON decode <{0}> failed,error message<{1}>.", responseContent, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_JSON_DATA_PARSE_FAILED;
            }

            JObject returnStateObject = responseObject.GetValue("state").Value<JObject>();
            if (returnStateObject == null)
            {
                message = string.Format("JSON field <{0}> not found.", "state");
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_FIELD_STATE_NOT_FOUND;
            }

            int errorCode = returnStateObject.GetValue("code").Value<int>();
            if (errorCode != 0)
            {
                message = "User not login system failed.";
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_USER_NOT_LOGIN;
            }

            return E_ERROR_CODE.OK;
        }

        private E_ERROR_CODE processLoginData(string responseContent)
        {
            string message = string.Empty;
            JObject resultData = null;
            JObject responseObject = null;
            try
            {
                responseObject = JObject.Parse(responseContent);
            }
            catch(Exception ex)
            {
                message = string.Format("JSON decode <{0}> failed,error message<{1}>.", responseContent, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_JSON_DATA_PARSE_FAILED;
            }

            JObject returnStateObject = responseObject.GetValue("state").Value<JObject>();
            if(returnStateObject == null)
            {
                message = string.Format("JSON field <{0}> not found.", "state");
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_FIELD_STATE_NOT_FOUND;
            }

            int errorCode = returnStateObject.GetValue("code").Value<int>();
            if(errorCode != 0)
            {
                message = "Login system failed.";
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_LOGIN_FAILED;
            }

            try
            {
                resultData = responseObject.GetValue("data").Value<JObject>();
            }
            catch(Exception ex)
            {
                message = string.Format("JSON field <{0}> not found, error message <{1}>.", "data", ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_FOUND_FIELD_DATA;
            }

            _LoginResult = new CLoginResult();
            _LoginResult.company = resultData.GetValue("company").Value<string>();
            _LoginResult.companyType = resultData.GetValue("companyType").Value<string>();
            _LoginResult.country = resultData.GetValue("country").Value<string>();
            _LoginResult.phone = resultData.GetValue("phone").Value<string>();
            _LoginResult.position = resultData.GetValue("position").Value<string>();
            _LoginResult.regsource = resultData.GetValue("regsource").Value<string>();
            _LoginResult.spending = resultData.GetValue("spending").Value<string>();
            _LoginResult.workplace = resultData.GetValue("workplace").Value<string>();
            _LoginResult.email = resultData.GetValue("email").Value<string>();
            _LoginResult.accessToken = resultData.GetValue("accessToken").Value<string>();
            _LoginResult.userId = resultData.GetValue("userId").Value<string>();
            _LoginResult.firstName = resultData.GetValue("firstName").Value<string>();
            _LoginResult.lastName = resultData.GetValue("lastName").Value<string>();
            _IsLoginSuccessed = true;
            return E_ERROR_CODE.OK;
        }

        private void writeCookies(QA.IWebDriver driver)
        {
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("company", _LoginResult.company));
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("companyType", _LoginResult.companyType));
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("country", _LoginResult.country));
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("phone", _LoginResult.phone));
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("position", _LoginResult.position));
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("regsource", _LoginResult.regsource));
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("spending", _LoginResult.spending));
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("workplace", _LoginResult.workplace));
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("email", _LoginResult.email));
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("token", _LoginResult.accessToken));
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("username", _LoginResult.email));
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("userId", _LoginResult.userId));
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("firstName", _LoginResult.firstName));
            driver.Manage().Cookies.AddCookie(new OpenQA.Selenium.Cookie("lastName", _LoginResult.lastName));
        }

        private E_ERROR_CODE downloadData(string queryDataUrl, QA.IWebDriver driver, string dataFileName)
        {
            string message = string.Empty;
            string responseContent = string.Empty;
            StreamReader responseStreamReader = null;
            HttpWebResponse httpResponse = null;
            HttpWebRequest httpRequest = null;
            try
            {
                httpRequest = (HttpWebRequest)WebRequest.Create(queryDataUrl);
            }
            catch(Exception ex)
            {
                message = string.Format("Create web request failed <{0}>,error message<{1}>.", queryDataUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_HTTP_WEB_REQUEST_FAILED;
            }

            httpRequest.CookieContainer = new System.Net.CookieContainer();

            for (int i = 0; i < driver.Manage().Cookies.AllCookies.Count - 1; i++)
            {
                System.Net.Cookie cookie = new System.Net.Cookie(driver.Manage().Cookies.AllCookies[i].Name, driver.Manage().Cookies.AllCookies[i].Value, driver.Manage().Cookies.AllCookies[i].Path, driver.Manage().Cookies.AllCookies[i].Domain);
                httpRequest.CookieContainer.Add(cookie);
            }

            httpRequest.Accept = "text/html; charset=UTF-8";
            httpRequest.UserAgent = _UserAgent;
            try
            {
                httpResponse = (HttpWebResponse)httpRequest.GetResponse();
            }
            catch(Exception ex)
            {
                message = string.Format("Get web response failed <{0}>,error message<{1}>.", queryDataUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_GET_RESPONSE_FAILED;
            }

            try
            {
                responseStreamReader = new StreamReader(httpResponse.GetResponseStream(), Encoding.UTF8);
            }
            catch(Exception ex)
            {
                message = string.Format("Create response stream redaer failed <{0}>,error message<{1}>.", queryDataUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_RESPONSE_STREAM_READER;
            }

            try
            {
                responseContent = responseStreamReader.ReadToEnd();
                responseContent = responseContent.Replace("\ufeff", "");
                return writeDataToFile(responseContent, dataFileName);
            }
            catch(Exception ex)
            {
                message = string.Format("Read response stream content failed <{0}>,error message<{1}>.", queryDataUrl, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_CREATE_RESPONSE_STREAM_READER;
            }
            finally
            {
                if(responseStreamReader != null)
                {
                    responseStreamReader.Close();
                    responseStreamReader.Dispose();
                    responseStreamReader = null;
                }
            }
        }

        private E_ERROR_CODE writeDataToFile(string responseContent, string dataFileName)
        {
            string message = string.Empty;
            List<List<object>> recordTable = new List<List<object>>();
            StreamWriter dataStreamWriter = null;
           
            try
            {
                dataStreamWriter = new StreamWriter(dataFileName, false, Encoding.UTF8);
                dataStreamWriter.AutoFlush = true;
                dataStreamWriter.Write(responseContent);
                return E_ERROR_CODE.OK;
            }
            catch(Exception ex)
            {
                message = string.Format("Open data stream writer failed <{0}>,error message<{1}>.", dataFileName, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_OPEN_DATA_FILE_FAILED;
            }
            finally
            {
                if(dataStreamWriter != null)
                {
                    dataStreamWriter.Flush();
                    dataStreamWriter.Close();
                    dataStreamWriter.Dispose();
                    dataStreamWriter = null;
                }
            }
        }

        private E_ERROR_CODE convertFormat(List<List<object>> recordTable, string responseContent)
        {
            List<object> record = null;
            JObject responseContentObject = null;
            JArray tableData = null;
            try
            {
                responseContentObject = JObject.Parse(responseContent);
            }
            catch(Exception ex)
            {
                message = string.Format("JSON decode failed <{0}>,error message<{1}>.", responseContent, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_JSON_DECODE_FAILED;
            }

            try
            {
                tableData = responseContentObject.GetValue("table-data").Value<JArray>();
            }
            catch(Exception ex)
            {
                message = string.Format("Get table data failed <{0}>,error message<{1}>.", responseContent, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_GET_TABLE_DATA_FAILED;
            }

            foreach(JObject arrayItem in tableData)
            {
                record = new List<object>();
                record.Add(arrayItem.GetValue("media_source").Value<string>());
                record.Add(arrayItem.GetValue("fb_adset").Value<string>());
                record.Add(arrayItem.GetValue("users").Value<int>());
                record.Add(arrayItem.GetValue("cohort_day").Value<string>());
                foreach (JToken valueItem in arrayItem.GetValue("values"))
                {
                    record.Add(valueItem.Value<int>());
                }

                recordTable.Add(record);
            }

            return E_ERROR_CODE.OK;
        }

        private bool checkLoginSuccess(string userName)
        {
            return (_WebDriver.PageSource.IndexOf(userName) >= 0);
        }

        protected bool findResultElement()
        {
            string message = string.Empty;
            string oldUrl = _WebDriver.Url;
            
            string containerDIVClassName = "container";
            QA.IWebElement containerElement = FindElementByClassName(containerDIVClassName);
            if(containerElement == null)
            {
                message = string.Format("Not found element <{0}>.", containerDIVClassName);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return false;
            }
            
            IList<QA.IWebElement> webElements = containerElement.FindElements(QA.By.TagName("span"));
            foreach(QA.IWebElement webElement in webElements)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.DEBUG, string.Format("Element<{0}><{1}>.", webElement.TagName, webElement.Text));
            }

            return true;
        }

        /// <summary>
        /// 模拟用户输入指定内容到页面指定输入框
        /// </summary>
        /// <param name="element">输入框页面元素</param>
        /// <param name="text">输入内容</param>
        protected bool SendKeysToElement(QA.IWebElement element, string text)
		{
			try
			{
				_WebDriver.Manage().Timeouts().SetScriptTimeout(TimeSpan.FromSeconds(5));
				_WebDriver.Manage().Timeouts().SetPageLoadTimeout(TimeSpan.FromSeconds(5));
				element.SendKeys(text);
				return true;
			}
			catch (Exception ex)
			{
				_SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Input keywords faild, keywords<{0}>,error message<{1}>.", text, ex.Message));
				return false;
			}
		}

		/// <summary>
		/// 根据ID查找页面指定元素
		/// </summary>
		/// <param name="id">元素ID</param>
		/// <returns>返回找到的元素，未找到返回NULL</returns>
		protected QA.IWebElement FindElementById(string id)
		{
			string message = string.Empty;
			QA.IWebElement theElement = null;
			try
			{
				_WebDriver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(5));
				theElement = (QA.IWebElement)_WebDriver.FindElement(QA.By.Id(id));
			}
			catch (Exception ex)
			{
				message = string.Format("Find element faild<{0}>,error message<{1}>.", id, ex.Message);
				_SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
				theElement = null;
			}

			return theElement;
		}

        protected QA.IWebElement FindElementByName(string name)
        {
            string message = string.Empty;
            QA.IWebElement theElement = null;
            try
            {
                _WebDriver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(5));
                theElement = (QA.IWebElement)_WebDriver.FindElement(QA.By.Name(name));
            }
            catch (Exception ex)
            {
                message = string.Format("Find element faild<{0}>,error message<{1}>.", name, ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                theElement = null;
            }

            return theElement;
        }

        /// <summary>
        /// Get the alert text
        /// </summary>
        /// <returns></returns>
        protected string GetAlertString()
		{
			string theString = string.Empty;
			QA.IAlert alert = null;
			alert = _WebDriver.SwitchTo().Alert();
			if (alert != null)
			{
				theString = alert.Text;
			}
			return theString;
		}

		/// <summary>
		/// Accepts the alert
		/// </summary>
		protected void AlertAccept()
		{
			QA.IAlert alert = null;
			alert = _WebDriver.SwitchTo().Alert();
			if (alert != null)
			{
				alert.Accept();
			}
		}

		/// <summary>
		/// Dismisses the alert
		/// </summary>
		protected void AlertDismiss()
		{
			QA.IAlert alert = null;
			alert = _WebDriver.SwitchTo().Alert();
			if (alert != null)
			{
				alert.Dismiss();
			}
		}

		/// <summary>
		/// Get a screen shot of the current window
		/// </summary>
		/// <param name="savePath"></param>
		protected void TakeScreenshot(string savePath)
		{
		
			QA.Screenshot theScreenshot = ((QA.PhantomJS.PhantomJSDriver)_WebDriver).GetScreenshot();
			if (theScreenshot != null)
			{
				theScreenshot.SaveAsFile(savePath, System.Drawing.Imaging.ImageFormat.Png);
			}
		}

		protected QA.IWebElement FindElementByLinkText(string text)
		{
			QA.IWebElement theElement = null;
			try
			{
				_WebDriver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(3)); 
				theElement = _WebDriver.FindElement(QA.By.LinkText(text));
			}
			catch { }
			return theElement;
		}

        protected QA.IWebElement FindElementByClassName(string className)
        {
            QA.IWebElement theElement = null;
            try
            {
                _WebDriver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(3));
                theElement = _WebDriver.FindElement(QA.By.ClassName(className));
            }
            catch { }
            return theElement;
        }

        protected IList<QA.IWebElement> FindElementsByLinkText(string text)
		{
			IList<QA.IWebElement> theElement = null;
			_WebDriver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(3)); 
			theElement = (IList<QA.IWebElement>)_WebDriver.FindElements(QA.By.LinkText(text));
			return theElement;
		}

		protected IList<QA.IWebElement> FindElementsByPartialLinkText(string text)
		{
			IList<QA.IWebElement> theElement = null;
			_WebDriver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(3)); 
			theElement = (IList<QA.IWebElement>)_WebDriver.FindElements(QA.By.PartialLinkText(text));
			return theElement;
		}

		protected IList<QA.IWebElement> FindElementsByClassName(string clsName)
		{
			IList<QA.IWebElement> theElement = null;
			_WebDriver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(3)); 
			theElement = (IList<QA.IWebElement>)_WebDriver.FindElements(QA.By.ClassName(clsName));
			return theElement;
		}

		protected IList<QA.IWebElement> FindElementsByTagName(string tagName)
		{
			IList<QA.IWebElement> theElement = null;
			_WebDriver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(3)); 
			theElement = (IList<QA.IWebElement>)_WebDriver.FindElements(QA.By.TagName(tagName));
			return theElement;
		}

		protected IList<QA.IWebElement> FindElementsByCssSelector(string css)
		{
			IList<QA.IWebElement> theElement = null;
			_WebDriver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(3)); 
			theElement = (IList<QA.IWebElement>)_WebDriver.FindElements(QA.By.CssSelector(css));
			return theElement;
		}

		protected IList<QA.IWebElement> FindElementsByXPathName(string xpath)
		{
			IList<QA.IWebElement> theElements = null;
			_WebDriver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(3)); 
			theElements = (IList<QA.IWebElement>)_WebDriver.FindElements(QA.By.XPath(xpath));
			return theElements;
		}

        protected IList<QA.IWebElement> FindElementsByTag(string tagName)
        {
            _WebDriver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(3));
            return (IList<QA.IWebElement>)_WebDriver.FindElements(QA.By.TagName(tagName));
        }

        protected QA.IWebElement FindElementByXPathName(string xpath)
		{
			QA.IWebElement theElement = null;
			_WebDriver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(3)); 
			theElement = _WebDriver.FindElement(QA.By.XPath(xpath));
			return theElement;
		}
        
        

    }
}

