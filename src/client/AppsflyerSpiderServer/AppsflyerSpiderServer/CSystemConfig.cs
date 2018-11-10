using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Linq;

namespace AppsflyerSpiderServer
{
	public class CSystemConfig
	{
		private Dictionary<string, object> _ConfigItemTable = null;
		private string _configFile = CPublic.SYSTEM_CONFIG_FILE;
		private int errorCode = 1;
		public CSystemConfig()
		{
			_ConfigItemTable = new Dictionary<string, object> ();
			if (File.Exists (_configFile)) 
			{
				StreamReader configReader = new StreamReader (_configFile, Encoding.UTF8);
				if (configReader == null) 
				{
					errorCode = 1;
					return;
				}

				parseConfigFile (configReader);
				configReader.Close ();
				configReader.Dispose ();
				configReader = null;
				errorCode = 0;
			} 
			else 
			{
				errorCode = 2;
			}
		}

		public int getErrorCode()
		{
			return errorCode;
		}

		public void printSystemConfig(CSystemLog systemLog)
		{
			string message = string.Empty;
			foreach (KeyValuePair<string, object> kvp in _ConfigItemTable) 
			{
				message = string.Format ("{0}={1}", kvp.Key, kvp.Value.ToString ());
				systemLog.writeLog (LOG_LEVEL.NOTICE, message);
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

