using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using System.Web;
using System.Text.RegularExpressions;
using Newtonsoft.Json.Linq;
using MySql.Data.MySqlClient;

namespace AdSeeDataSpider
{
    class CNetProxyComparer : IEqualityComparer<CNetProxy>
    {
        // Products are equal if their names and product numbers are equal.
        public bool Equals(CNetProxy x, CNetProxy y)
        {

            //Check whether the compared objects reference the same data.
            if (Object.ReferenceEquals(x, y))
            {
                return true;
            }

            //Check whether any of the compared objects is null.
            if (Object.ReferenceEquals(x, null) || Object.ReferenceEquals(y, null))
            {
                return false;
            }

            //Check whether the products' properties are equal.
            return ((x.IpAddress.CompareTo(y.IpAddress) == 0) && (x.Port == y.Port));
        }

        public int GetHashCode(CNetProxy netProxy)
        {
            return string.Format("{0}:{1}", netProxy.IpAddress, netProxy.Port).GetHashCode();
        }
    }

    public class CNetProxy
    {
        private static string INSERT_SQL = "REPLACE INTO T_NET_PROXY(ID,NAME,IP_ADDRESS,PORT,DESCRIPTION,STATUS) " +
            " VALUES('{0}','{1}','{2}',{3},'{4}',{5})";
        private static string UPDATE_SQL = "UPDATE T_NET_PROXY SET STATUS={0} WHERE NAME='{1}'";

        private static string QUERY_SQL = "SELECT ID,NAME,IP_ADDRESS,PORT,DESCRIPTION,STATUS FROM T_NET_PROXY";

        private static string netProxyProviderTemplate = "http://www.kuaidaili.com/api/getproxy/?orderid=902060121785512&num={1}&browser=1&protocol=1&method=1&an_ha=1&sort=0&dedup=1&format=text&sep=4";
        private string _Id = string.Empty;
        public string Id
        {
            get{return _Id;}
            set{_Id = value;}
        }

        private string _Name = string.Empty;
        public string Name
        {
            get{return _Name;}
            set{_Name = value;}
        }
        
        private string _IpAddress =  string.Empty;
        public string IpAddress
        {
            get{return _IpAddress;}
            set{_IpAddress = value;}
        }

        private int _Port = 80;
        public int Port
        {
            get{return _Port;}
            set{_Port = value;}
        }

        private string _Description = string.Empty;
        public string Description
        {
            get{return _Description;}
            set{_Description = value;}
        }

        private int _Status = 1;
        public int Status
        {
            get { return _Status; }
            set { _Status = value; }
        }

	    private CDbConnection _DbConnection = null;

        private List<CNetProxy> _netProxyList = null;
		private CSystemLog _SystemLog = null;
		private CSystemConfig _SystemConfig = null;
		public CNetProxy(CSystemLog systemLog, CSystemConfig systemConfig)
        {
			_SystemLog = systemLog;
			_SystemConfig = systemConfig;
			_DbConnection = new CDbConnection(_SystemConfig.getConfigItem("DB_MYSQL_CONNECT_STR").ToString(), _SystemLog);
			Id = Guid.NewGuid ().ToString ().ToUpper ();
        }

		public CNetProxy()
		{
			Id = Guid.NewGuid ().ToString ().ToUpper ();
		}

        public override string ToString()
	    {
	        return string.Format("{0}:{1}",IpAddress,Port);
	    }

        public bool update()
        {
            int updateRecordCount = 0;
            List<string> sqlList = new List<string>();
            string updateSql = string.Format(UPDATE_SQL, Status, Id);
            sqlList.Add(updateSql);
            _DbConnection.queryRecords(sqlList, out updateRecordCount);

            return (updateRecordCount == sqlList.Count);
        }

        public int getIpAddress()
        {
            try
            {
                IPAddress ipAddress = IPAddress.Parse(IpAddress);
                Byte[] bytes = ipAddress.GetAddressBytes();
                return Math.Abs(BitConverter.ToInt32(bytes, 0));
            }
            catch (Exception ex)
            {
				_SystemLog.writeLog2Console(LOG_LEVEL.ERR, string.Format("Address is not valid ip address<{0}>, error message<{1}>.", IpAddress, ex.Message));
                return -1;
            }
        }

	    public string createInsertSql()
	    {
	        return string.Format(INSERT_SQL,Id,Name,IpAddress,Port,Description, Status);
	    }

        public string createUpdateSql()
        {
            return string.Format(UPDATE_SQL, Status, Name);
        }

        public bool batchSubmitNetProxyList(List<CNetProxy> netProxyTable)
        {
             int insertRecordCount = 0;
             List<string> sqlList = new List<string>();
             foreach(CNetProxy netProxy in netProxyTable)
             {
                 sqlList.Add(netProxy.createInsertSql());
             }

             _DbConnection.queryRecords(sqlList, out insertRecordCount);
             return (insertRecordCount == sqlList.Count);
        }

        public bool getNetProxyFromKuaiDaili(List<CNetProxy> netProxyTable, string orderId, int requestNumber)
        {
            DateTime getDateTime = DateTime.Now;
            string netProxyStr = string.Format(netProxyProviderTemplate, orderId, requestNumber);
            string netProxyListContent = CHttpRequest.GetWebRequest(netProxyStr, Encoding.UTF8);
            if (netProxyListContent == null)
            {
				_SystemLog.writeLog2Console(LOG_LEVEL.ERR, "Response is null.");
                return false;
            }

            if (netProxyListContent.IndexOf("ERROR") >= 0)
            {
				_SystemLog.writeLog2Console(LOG_LEVEL.ERR, netProxyListContent);
                return false;
            }

            string[] netProxyAddressList = netProxyListContent.Split('|');            
            foreach (string netProxyAddress in netProxyAddressList)
            {
                if (netProxyAddress.Trim().Length == 0)
                {
                    continue;
                }
                
				_SystemLog.writeLog2Console(LOG_LEVEL.DEBUG,string.Format("proxy value <{0}>",netProxyAddress));
                string[] stringValues = netProxyAddress.Split(':');
                CNetProxy netProxy = new CNetProxy();
                netProxy.Id = string.Format("{0}", Guid.NewGuid().ToString().ToUpper());
                netProxy.IpAddress = stringValues[0];
                netProxy.Port = Convert.ToInt32(stringValues[1]);
                netProxy.Description = string.Format("{0}", getDateTime);
                netProxy.Name = string.Format("{0}:{1}", netProxy.IpAddress, netProxy.Port);
                netProxy.Status = 1;
                netProxyTable.Add(netProxy);
            }

            if (batchSubmitNetProxyList(netProxyTable))
            {
				_SystemLog.writeLog2Console(LOG_LEVEL.ERR,"BATH SUBMIT SUCCESS");
            }
            else
            {
				_SystemLog.writeLog2Console(LOG_LEVEL.ERR, "BATH SUBMIT FAILD");
            }

            return true;
        }

		public bool loadNetPorxyFromTianLuServer(List<CNetProxy> netProxyList)
		{
			//
			string errorMessage = string.Empty;
			string httpRequestErrorMessage = string.Empty;
			string netProxyContent = string.Empty;
			string serverUrl = @"http://office.tianluweiye.com:8008/service/proxies?speed=10000&num=30";
			netProxyContent = CHttpRequest.GetHttpWebRequest(serverUrl, out errorMessage);
			if (netProxyContent == null)
			{
				errorMessage = string.Format("Load from server<{0}>,error message<{1}> faild.", serverUrl, httpRequestErrorMessage);
				return false;
			}

			string afterConvert = CPublic.unicode_js_GBK(netProxyContent);
			JArray items =  JArray.Parse (afterConvert);
			if ((items == null) || (items.Count == 0))
			{
				errorMessage = string.Format("Convert to JObject faild, content<{0}>.", afterConvert);
				return false;
			}

			return parseNetProxyFromTianLu(netProxyList, items);
		}

		private bool parseNetProxyFromTianLu(List<CNetProxy> netProxyList, JArray netProxyItems)
		{
			foreach (JToken netProxyItem in netProxyItems) {
				CNetProxy netProxy = new CNetProxy ();
				netProxy.Id = netProxyItem ["id"].Value<string> ();
				netProxy.IpAddress = netProxyItem ["ip"].Value<string> ();
				netProxy.Port = netProxyItem ["port"].Value<int> ();
				netProxy.Description = netProxyItem ["area"].Value<string> ();
				netProxyList.Add (netProxy);
			}

			return true;
		}

        public bool loadNetProxyFromServer(List<CNetProxy> netProxyTable, out string errorMessage)
        {
			string httpRequestErrorMessage = string.Empty;
            string netProxyContent = string.Empty;
			string serverUrl = _SystemConfig.getConfigItem ("NetProxyManagementServiceUrl").ToString ();
            UTF8Encoding encoder = new UTF8Encoding();

			if ((serverUrl == null) || (serverUrl == string.Empty)) 
			{
				errorMessage = string.Format ("Not config<{0}>, please check it.", "NetProxyManagementServiceUrl");
				return false;
			}

			netProxyContent = CHttpRequest.getHttpWebRequest(serverUrl, "func=QUERY_NO_BASE64", encoder, out httpRequestErrorMessage);
            if (netProxyContent == null)
            {
				errorMessage = string.Format("Load from server<{0}>,error message<{1}> faild.", serverUrl, httpRequestErrorMessage);
                return false;
            }

            string afterConvert = CPublic.unicode_js_GBK(netProxyContent);
            JObject jobject = JObject.Parse(afterConvert);
            if (jobject == null)
            {
                errorMessage = string.Format("Convert to JObject faild, content<{0}>.", afterConvert);
                return false;
            }

            int errorCode = jobject["error_code"].Value<int>();
            if ( errorCode != 0)
            {
				errorMessage = string.Format("Load net proxy data from server<{0}> faild, error code<{1}>,error message<{2}>.", serverUrl,
                    errorCode,
                    jobject["message"].Value<string>());
                return false;
            }
            
            errorMessage = "";

            return parseNetProxyList(jobject["data"].ToArray<JToken>(), netProxyTable);
        }

        private static bool parseNetProxyList(JToken[] netProxyItems, List<CNetProxy> netProxyTable)
        {
            if (netProxyItems == null)
            {
                return false;
            }

            foreach (JToken netProxyItem in netProxyItems)
            {
                CNetProxy netProxy = parseNetProxyItem(netProxyItem);
                if (netProxy != null)
                {
                    netProxyTable.Add(netProxy);
                }
            }

            return true;
        }

        private static CNetProxy parseNetProxyItem(JToken netPorxyItem)
        {
            CNetProxy netProxy = null;
            if (netPorxyItem == null)
            {
                return null;
            }

            netProxy = new CNetProxy();
            netProxy.Id = netPorxyItem["ID"].Value<string>();
            netProxy.Name = netPorxyItem["NAME"].Value<string>();
            netProxy.IpAddress = netPorxyItem["IP_ADDRESS"].Value<string>();
            netProxy.Port = netPorxyItem["PORT"].Value<int>();
            netProxy.Description = netPorxyItem["DESCRIPTION"].Value<string>();
            netProxy.Status = netPorxyItem["STATUS"].Value<int>();

            return netProxy;
        }


        public List<CNetProxy> loadNetProxyFromDb()
        {
            if (_netProxyList == null)
            {
                _netProxyList = new List<CNetProxy>();
            }
            else
            {
                _netProxyList.Clear();
            }

            _DbConnection.queryRecords(QUERY_SQL, parseNetPrxyRecord);
            return _netProxyList;
        }

        private void parseNetPrxyRecord(MySqlDataReader mySqlDataReader)
        {
            while (mySqlDataReader.Read())
            {
                CNetProxy netProxy = new CNetProxy();
                netProxy.Id = mySqlDataReader["ID"].ToString();
                netProxy.Name = mySqlDataReader["NAME"].ToString();
                netProxy.IpAddress = mySqlDataReader["IP_ADDRESS"].ToString();
                netProxy.Port = Convert.ToInt32(mySqlDataReader["PORT"]);
                netProxy.Description = mySqlDataReader["IP_ADDRESS"].ToString();
                netProxy.Status = 1;
                _netProxyList.Add(netProxy);
            }
        }
    }
}
