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

using QueryPageOrder;
using System.Net;
using Newtonsoft.Json.Linq;

namespace AutoWebBrowser
{
	public class CAppsFlyerDataSpider
	{
        private string _SearchEngineName = string.Empty;
        private QA.IWebDriver _WebDriver = null;//存储WebDriver对象
        private int PhantomjsDriverProcessId = -1;

        private string message = string.Empty;
        private CSystemLog _SystemLog = null;
        private CAppsFlyerDataSpiderConfig _AppsFlyerDataSpiderConfig = null;
        public CAppsFlyerDataSpiderConfig AppsFlyerDataSpiderConfig { get { return _AppsFlyerDataSpiderConfig; } }

        private bool _IsInitWebDriverCompleted = false;
        private bool _IsLoginSuccessed = false;
        public bool IsLoginSuccessed { get { return _IsLoginSuccessed; } }
        private string _AccessWebUrl = string.Empty;
        private string _UserAgent = null;//存储当前使用的浏览器代理
		public CAppsFlyerDataSpider (string appsflyerConfigFile, CSystemLog systemLog)
		{
            _UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36";
            _AppsFlyerDataSpiderConfig = new CAppsFlyerDataSpiderConfig(appsflyerConfigFile, systemLog);
		}
        
        public E_ERROR_CODE initAppsFlyerSpiderConfig()
        {
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            errorCode = _AppsFlyerDataSpiderConfig.initConfig();
            if(errorCode!= E_ERROR_CODE.OK)
            {
                return errorCode;
            }

            _SystemLog = new CSystemLog(_AppsFlyerDataSpiderConfig.getIsWriteLog2Screen(), _AppsFlyerDataSpiderConfig.getLogLevel(), _AppsFlyerDataSpiderConfig.getLogPath());
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
        
        public E_ERROR_CODE loginSystem()
        {
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            string appsflyerHomePageUrl = _AppsFlyerDataSpiderConfig.getLoginPageUrl();

            errorCode = openHomePage(appsflyerHomePageUrl);
            if(errorCode != E_ERROR_CODE.OK)
            {
                return errorCode;
            }

            string userName = _AppsFlyerDataSpiderConfig.getUserName();
            string password = _AppsFlyerDataSpiderConfig.getPassword();
            if((userName== null) || (password == null))
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.CRIT, string.Format("UserName <{0}> or password <{1}> invalid.", userName, password));
                return E_ERROR_CODE.ERROR_USERNAME_OR_PASSWORD_IS_NULL;
            }

            return loginAppsflyerSystem(userName, password);
        }

        internal E_ERROR_CODE downloadAndroidPerformanceReportData(DateTime currentTime)
        {
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            errorCode = downloadAndroidCampaignPerformanceReportData(currentTime);
            if(errorCode != E_ERROR_CODE.OK)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Download android campaing performance report data <{0}> failed.", currentTime.ToString("yyyy-MM-dd HH:mm")));
            }

            errorCode = downloadAndroidAdsetPerformanceReportData(currentTime);
            if (errorCode != E_ERROR_CODE.OK)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Download android adset performance report data <{0}> failed.", currentTime.ToString("yyyy-MM-dd HH:mm")));
            }

            return errorCode;
        }

        private E_ERROR_CODE downloadAndroidAdsetPerformanceReportData(DateTime currentTime)
        {
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            DateTime queryDate = currentTime;
            int days = _AppsFlyerDataSpiderConfig.getAppsflyerDelayDay();
            for(int index = 0; index < days; ++index)
            {
                queryDate = currentTime.Subtract(TimeSpan.FromDays(1));
                errorCode = downloadAndroidAdsetPerformanceReportDataByDate(queryDate);
                if(errorCode != E_ERROR_CODE.OK)
                {
                    _SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Download android adset performance report data for date <{0}> failed, error code <{1}>.", queryDate.ToString("yyyy-MM-dd HH:mm"), errorCode));
                }
            }

            return errorCode;
        }

        private E_ERROR_CODE downloadAndroidAdsetPerformanceReportDataByDate(DateTime queryDate)
        {
            throw new NotImplementedException();
        }

        private E_ERROR_CODE downloadAndroidCampaignPerformanceReportData(DateTime currentTime)
        {
            throw new NotImplementedException();
        }

        internal E_ERROR_CODE downloadIOSPerformanceReportData(DateTime _CurrentTime)
        {
            throw new NotImplementedException();
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
                _IsInitWebDriverCompleted = true;
                PhantomjsDriverProcessId = driverService.ProcessId;
                return E_ERROR_CODE.OK;
			}
			catch (Exception ex)
			{
                _IsInitWebDriverCompleted = false;
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
				_WebDriver.Manage().Timeouts().SetPageLoadTimeout(TimeSpan.FromSeconds(10));
				_WebDriver.Manage().Timeouts().SetScriptTimeout(TimeSpan.FromSeconds(10));
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
        
        public E_ERROR_CODE downloadAndroidData(DateTime startDate, DateTime endDate)
        {
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            string message = string.Empty;
            string queryDataUrl = string.Empty;
            string dataFile = string.Empty;
            string androidDataStorePath = _AppsFlyerDataSpiderConfig.getAndroidDataStorePath();
            string[] androidApplicationIds = _AppsFlyerDataSpiderConfig.getAndroidApplicationIds();

            if(androidDataStorePath == null)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, "Get android data file store path failed.");
                return E_ERROR_CODE.ERROR_GET_ANDROID_DATA_FILE_STORE_PATH_FAILED;
            }

            foreach(string androidApplicationId in androidApplicationIds)
            {
                queryDataUrl = _AppsFlyerDataSpiderConfig.getQueryDataUrl(startDate, endDate, androidApplicationId);
                dataFile = string.Format("{0}/{1}_{2}.dat", androidDataStorePath, CPublic.getDateString(startDate), CPublic.getDateString(endDate));
                message = string.Format("Query data url <{0}>, dataFile <{1}>.", queryDataUrl, dataFile);
                _SystemLog.writeLog2Console(LOG_LEVEL.DEBUG, message);
                errorCode = downloadData(queryDataUrl, _WebDriver, dataFile);
                if(errorCode != E_ERROR_CODE.OK)
                {
                    message = string.Format("Android application <{0}> download data failed, error code <{1}>.", androidApplicationId, errorCode);
                    _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                }
            }

            return E_ERROR_CODE.OK;
        }



        public E_ERROR_CODE downloadIOSData(DateTime startDate, DateTime endDate)
        {
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            string message = string.Empty;
            string queryDataUrl = string.Empty;
            string dataFile = string.Empty;
            string iosDataStorePath = _AppsFlyerDataSpiderConfig.getIOSDataStorePath();
            string[] iosApplicationIds = _AppsFlyerDataSpiderConfig.getIOSApplicationIds();

            if (iosDataStorePath == null)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, "Get android data file store path failed.");
                return E_ERROR_CODE.ERROR_GET_ANDROID_DATA_FILE_STORE_PATH_FAILED;
            }

            foreach (string androidApplicationId in iosApplicationIds)
            {
                queryDataUrl = _AppsFlyerDataSpiderConfig.getQueryDataUrl(startDate, endDate, androidApplicationId);
                dataFile = string.Format("{0}/{1}_{2}.dat", iosDataStorePath, CPublic.getDateString(startDate), CPublic.getDateString(endDate));
                message = string.Format("Query data url <{0}>, dataFile <{1}>.", queryDataUrl, dataFile);
                _SystemLog.writeLog2Console(LOG_LEVEL.DEBUG, message);
                errorCode = downloadData(queryDataUrl, _WebDriver, dataFile);
                if (errorCode != E_ERROR_CODE.OK)
                {
                    message = string.Format("ios application <{0}> download data failed, error code <{1}>.", androidApplicationId, errorCode);
                    _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                }
            }

            return E_ERROR_CODE.OK;
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
            E_ERROR_CODE errorCode = E_ERROR_CODE.ERROR;
            List<List<object>> recordTable = new List<List<object>>();
            StreamWriter dataStreamWriter = null;

            errorCode = convertFormat(recordTable, responseContent);
            if (errorCode != E_ERROR_CODE.OK)
            {
                message = string.Format("Covert json data to record failed <{0}>.", dataFileName);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_OPEN_DATA_FILE_FAILED;
            }

            if (recordTable.Count == 0)
            {
                message = string.Format("No data need to save failed, <{0}>.", dataFileName);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.OK;
            }

            try
            {
                dataStreamWriter = new StreamWriter(dataFileName, false, Encoding.UTF8);
                dataStreamWriter.AutoFlush = true;

                foreach(List<object> record in recordTable)
                {
                    dataStreamWriter.WriteLine(String.Join(",", record));
                }

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

        private E_ERROR_CODE loginAppsflyerSystem(string userName, string password)
        {
            string message = string.Empty;
            string elementUserName = _AppsFlyerDataSpiderConfig.getElementUserName();
            string elementPassword = _AppsFlyerDataSpiderConfig.getElementPassword();
            QA.IWebElement searchNameElement = null;
            QA.IWebElement searchPasswordElement = null;
            QA.IWebElement submitButtonElement = null;
            QA.IWebElement searchSubmitDivContainerElement = null;

            if((elementUserName == null) || (elementPassword == null))
            {
                message = string.Format("Not conmfig element user name <{0}> or password <{1}>.", elementUserName, elementPassword);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_CONFIG_ELEMENT_USER_NAME_OR_PASSWORD;
            }

            searchNameElement = FindElementByName(elementUserName);
            if (searchNameElement == null)
            {
                message = string.Format("Not found element <{0}>.", elementUserName);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_FOUND_ELEMENT_USER_NAME;
            }

            searchPasswordElement = FindElementByName(elementPassword);
            if (searchPasswordElement == null)
            {
                message = string.Format("Not found element <{0}>.", elementPassword);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_FOUND_ELEMENT_PASSWORD;
            }

            SendKeysToElement(searchNameElement, userName);
            SendKeysToElement(searchPasswordElement, password);

            //*[@id="login-form"]/div[6]/button
            searchSubmitDivContainerElement = FindElementByClassName("form-buttons");
            if (searchSubmitDivContainerElement == null)
            {
                message = "Not found element submit button container div.";
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_FOUND_FORM_BUTTONS_CONTAINER_ELEMENT;
            }

            submitButtonElement = searchSubmitDivContainerElement.FindElement(QA.By.TagName("button"));
            if (submitButtonElement == null)
            {
                message = "Not found element submit button.";
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_FOUND_ELEMENT_SUBMIT_BUTTON;
            }

            try
            {
                _WebDriver.Manage().Timeouts().SetScriptTimeout(TimeSpan.FromSeconds(20));
                _WebDriver.Manage().Timeouts().SetPageLoadTimeout(TimeSpan.FromSeconds(20));
                submitButtonElement.Submit();
            }
            catch (Exception ex)
            {
                message = string.Format("Submit search form faild, error message<{0}>,UA<{1}>.", ex.Message, _UserAgent);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_LOGIN_FAILED;
            }

            if (!checkLoginSuccess(userName))
            {
                TakeScreenshot(string.Format("login_failed_{0}.png", CPublic.getDateString(DateTime.Now)));
                message = string.Format("Login failed,task<{0}>,keywords<{1}>.", userName, password);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_LOGIN_FAILED;
            }
            _IsLoginSuccessed = true;
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

