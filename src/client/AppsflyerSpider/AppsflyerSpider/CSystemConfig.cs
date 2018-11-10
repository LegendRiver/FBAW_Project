using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Linq;

using QueryPageOrder;

namespace AutoWebBrowser
{
	public class CSystemConfig
	{
		private Dictionary<string, object> _ConfigItemTable = null;
        private string _ConfigFile = string.Empty;
        //private string _configFile = CPublic.SYSTEM_CONFIG_FILE;
		private int errorCode = 1;
        private CSystemLog _SystemLog = null;
		public CSystemConfig(string configFile, CSystemLog systemLog)
		{
            _ConfigFile = configFile;
            _SystemLog = systemLog;
            _ConfigItemTable = new Dictionary<string, object> ();
		}

        public E_ERROR_CODE initConfig()
        {
            StreamReader configReader = null;
            if (!File.Exists(_ConfigFile))
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.CRIT, string.Format("Config file <{0}> not exist.", _ConfigFile));
                return E_ERROR_CODE.ERROR_FILE_NOT_EXIST;
            }

            try
            {
                configReader = new StreamReader(_ConfigFile, Encoding.UTF8);
                parseConfigFile(configReader);
                return E_ERROR_CODE.OK;
            }
            catch(Exception ex)
            {
                _SystemLog.writeLog2Console(LOG_LEVEL.CRIT, string.Format("Open config file <{0}> failed, error message <{1}>.", _ConfigFile, ex.Message));
                return E_ERROR_CODE.ERROR_OPEN_FILE_FAILED;
            }
            finally
            {
                configReader.Close();
                configReader.Dispose();
                configReader = null;
            }
        }

		public int getErrorCode()
		{
			return errorCode;
		}

		public void printSystemConfig()
		{
			string message = string.Empty;
			foreach (KeyValuePair<string, object> kvp in _ConfigItemTable) 
			{
				message = string.Format ("{0}={1}", kvp.Key, kvp.Value.ToString ());
				_SystemLog.writeLog2Console (LOG_LEVEL.NOTICE, message);
			}
		}

		public string getUserDataStorePath()
		{
			return getConfigItem("USER_DATA_PATH").ToString();
		} 

		private void parseConfigFile(StreamReader configReader)
		{
			int equalSignPosition = -1;
			string readLine = string.Empty;
			while ((readLine = configReader.ReadLine ()) != null) 
			{
				readLine = readLine.Trim ();
				if (readLine.Length > 0) 
				{
					if (readLine.First<char> () == '#') 
					{
						continue;
					}

					equalSignPosition = readLine.IndexOf ('=');
					if (equalSignPosition <= 0) 
					{
						continue;
					}

					string configItemName = readLine.Substring(0, equalSignPosition).Trim();
					string configItemValue = readLine.Substring(equalSignPosition + 1).Trim();
					if (!_ConfigItemTable.ContainsKey (configItemName)) 
					{
						_ConfigItemTable.Add (configItemName, configItemValue);
					}
				}
			}
		}

		public object getConfigItem(string configItemName)
		{
			if (_ConfigItemTable.ContainsKey (configItemName)) 
			{
				return _ConfigItemTable [configItemName];
			}

			return null;
		}
	}
}

