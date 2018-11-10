using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;
using System.Threading;
using System.Text.RegularExpressions;
using System.Diagnostics;
using System.Net.NetworkInformation;
using System.Net;
using System.IO;
using System.Windows.Forms;
using System.Web.Script.Serialization;

namespace QueryPageOrder
{
    public enum LOG_LEVEL
    {
        EMERG = 0,
        ALERT,
        CRIT,
        ERR,
        WARNING,
        NOTICE,
        INFO,
        DEBUG
    };
		
    public class CPublic
    {
        public static string SYSTEM_CONFIG_FILE = "config/system.cfg";
         
        private static string PHANTOMJS_PROCESS_NAME = "PhantomJS.exe";

        [DllImport("user32.dll", EntryPoint = "ShowWindow", SetLastError = true)]
        public static extern bool ShowWindow(IntPtr hWnd, uint nCmdShow);

        public static int getRandomNumber(int min, int max)
        {
            Thread.Sleep(1);
            Random ra = new Random((int)(DateTime.Now.Ticks & 15485863) | (int)(DateTime.Now.Ticks >> 32));            
            return ra.Next(min, max);
        }

        public static long generateIntID(string guidString)
        {
            Guid guid = Guid.Parse(guidString);
            byte[] buffer = guid.ToByteArray();

            return BitConverter.ToInt64(buffer, 0);

        }


        public static double getRandomValue()
		{
			Thread.Sleep (1);
			Random ra = new Random ((int)DateTime.Now.Ticks);
			return ra.NextDouble ();
		}

        public static string unicode_js_GBK(string str)
        {
            string outStr = "";
            Regex reg = new Regex(@"(?i)\\u([0-9a-f]{4})");
            outStr = reg.Replace(str, delegate(Match m1)
            {
                return ((char)Convert.ToInt32(m1.Groups[1].Value, 16)).ToString();
            });
            return outStr;
        }

        public static string getCodeLineAndFileName()
        {
            StackTrace insStackTrace = new StackTrace(true);
            StackFrame insStackFrame = insStackTrace.GetFrame(1);
            return String.Format("[{0}][{1}]", insStackFrame.GetFileName(), insStackFrame.GetFileLineNumber());
        }

        //返回描述本地计算机上的网络接口的对象(网络接口也称为网络适配器)。
        public static NetworkInterface[] NetCardInfo()
        {
            return NetworkInterface.GetAllNetworkInterfaces();
        }

        ///<summary>
        /// 通过NetworkInterface读取网卡Mac
        ///</summary>
        ///<returns></returns>
        public static List<string> getMacByNetworkInterface()
        {
            List<string> macs = new List<string>();
            NetworkInterface[] interfaces = NetworkInterface.GetAllNetworkInterfaces();
            foreach (NetworkInterface ni in interfaces)
            {
                if ((ni.NetworkInterfaceType == NetworkInterfaceType.Ethernet) ||
                    (ni.NetworkInterfaceType == NetworkInterfaceType.GigabitEthernet) ||
                    (ni.NetworkInterfaceType == NetworkInterfaceType.Wireless80211))
                {
                    macs.Add(ni.GetPhysicalAddress().ToString());
                }
            }

            return macs;
        }

        public static List<string> getLocalIpAddress()
        {
            List<string> ipAddressList = new List<string>();
            IPHostEntry IpEntry = Dns.GetHostEntry(Dns.GetHostName());
            foreach (IPAddress ipAddress in IpEntry.AddressList)
            {
                if (ipAddress.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                {
                    ipAddressList.Add(ipAddress.ToString());
                }
            }

            return ipAddressList;
        }

        internal static void clearEnvironment()
        {
            Process[] findProcesses = Process.GetProcessesByName(PHANTOMJS_PROCESS_NAME);
            foreach (Process process in findProcesses)
            {
                killProcess(process.Id);
            }
        }

        public static void killProcess(int processId)
        {
            if (processId > 0)
            {
                try
                {
                    Process process = Process.GetProcessById(processId);
                    if (process != null)
                    {
                        if (!process.CloseMainWindow())
                        {
                            process.Kill();
                        }
                    }
                }
                catch
                {
                    return;
                }
            }
            return;
        }

        public static string getAppStartPath()
        {
            return Application.StartupPath;
        }

        public static string getDateTimeString(DateTime datetime)
        {
            return datetime.ToString("yyyy-MM-dd HH:mm:ss");
        }

        public static string getDateString(DateTime datetime)
        {
            return datetime.ToString("yyyy-MM-dd");
        }
    }
}
