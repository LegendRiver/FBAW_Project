using System;
using System.IO;
using System.Threading;
using System.Text;
using System.Linq;

namespace AppsflyerSpiderServer
{
	public class CSystemLog
	{
		private Mutex _LogFileMutex = new Mutex();
		private StreamWriter _StreamWriter = null;
		private string _LogFileName = string.Empty;
		private DateTime _LastSavedTime = DateTime.MinValue;

		private bool _IsWriteLog2Screen = false;
		private LOG_LEVEL _LogLevel = LOG_LEVEL.ERR;
		private string _LogStorePath = string.Empty;
		public CSystemLog (string logStorePath, LOG_LEVEL logLevel, bool isOutputToScreen)
		{
			_LogStorePath = logStorePath;
			_LogLevel = logLevel;
			_IsWriteLog2Screen = isOutputToScreen;

			initLogWriter ();
		}

		~CSystemLog()
		{
		}


		private void initLogWriter()
		{
			try
			{
				_LogFileName = getSystemLogFile ();
				_StreamWriter = new StreamWriter(_LogFileName, true);
				_StreamWriter.AutoFlush = false;
				_LastSavedTime = DateTime.Now;
			}
			catch(Exception ex) 
			{
				_StreamWriter = null;
				Console.WriteLine (string.Format ("Create log writer {0}> faild, error message<{1}>.", _LogFileName, ex.Message));
			}
		}

		private void closeStreamWriter(StreamWriter streamWriter)
		{
			if (streamWriter == null) {
				return;
			}
			_StreamWriter.Flush ();
			_StreamWriter.Close ();
			_StreamWriter.Dispose ();
			_StreamWriter = null;
			return;
		}
		private StreamWriter getLogWriter()
		{
			DateTime currentTime = DateTime.Now;
			_LogFileMutex.WaitOne ();
			/* 日期有变更 */
			if (DateTime.Compare (_LastSavedTime.Date, currentTime.Date) != 0) {
				_LogFileMutex.WaitOne ();
				closeStreamWriter (_StreamWriter);
				initLogWriter ();

			}

			if (_StreamWriter == null) {
				initLogWriter ();
			}
			_LogFileMutex.ReleaseMutex ();

			return _StreamWriter;
		}

		private string getSystemLogFile()
		{
			DateTime currentDate = DateTime.Now;
			return string.Format("{0}/{1}/{2}.log",
				CPublic.getAppStartPath(),
				_LogStorePath,
				currentDate.ToString("yyyyMMdd"));
		}

		public static void writeLog2ScreenOnly(LOG_LEVEL loglevel, string message)
		{			
			ConsoleColor textColor = ConsoleColor.White;
			switch (loglevel)
			{
			case LOG_LEVEL.EMERG:
				textColor = ConsoleColor.DarkRed;
				Console.Beep();
				break;
			case LOG_LEVEL.ERR:
			case LOG_LEVEL.CRIT:
				textColor = ConsoleColor.Red;
				Console.Beep();
				break;
			case LOG_LEVEL.WARNING:
				textColor = ConsoleColor.DarkYellow;
				Console.Beep();
				break;
			case LOG_LEVEL.ALERT:
				textColor = ConsoleColor.Yellow;
				Console.Beep();
				break;
			case LOG_LEVEL.NOTICE:
				textColor = ConsoleColor.Cyan;
				break;
			case LOG_LEVEL.INFO:
				textColor = ConsoleColor.Magenta;
				break;
			case LOG_LEVEL.DEBUG:
				textColor = ConsoleColor.Green;
				break;
			}

			Console.BackgroundColor = ConsoleColor.Black;
			Console.ForegroundColor = textColor;
			string logMessage = string.Format("[{0}][{1}][{2}][{3}]",
				DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
				Thread.CurrentThread.ManagedThreadId,
				loglevel,
				message);
			Console.WriteLine (logMessage);
			return;
		}

		public void writeLog(LOG_LEVEL loglevel, string message)
		{
			if (loglevel > _LogLevel) {
				return;
			}
			
			ConsoleColor textColor = ConsoleColor.White;
			switch (loglevel)
			{
			case LOG_LEVEL.EMERG:
				textColor = ConsoleColor.DarkRed;
				Console.Beep();
				break;
			case LOG_LEVEL.ERR:
			case LOG_LEVEL.CRIT:
				textColor = ConsoleColor.Red;
				Console.Beep();
				break;
			case LOG_LEVEL.WARNING:
				textColor = ConsoleColor.DarkYellow;
				Console.Beep();
				break;
			case LOG_LEVEL.ALERT:
				textColor = ConsoleColor.Yellow;
				Console.Beep();
				break;
			case LOG_LEVEL.NOTICE:
				textColor = ConsoleColor.Cyan;
				break;
			case LOG_LEVEL.INFO:
				textColor = ConsoleColor.Magenta;
				break;
			case LOG_LEVEL.DEBUG:
				textColor = ConsoleColor.Green;
				break;
			}

			Console.BackgroundColor = ConsoleColor.Black;
			Console.ForegroundColor = textColor;
			string logMessage = string.Format("[{0}][{1}][{2}][{3}]",
				DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
				Thread.CurrentThread.ManagedThreadId,
				loglevel,
				message);
			if (_IsWriteLog2Screen) {
				Console.WriteLine (logMessage);
			}
			writeLog2File (logMessage);
		}

		public void disposeLogWriter()
		{
			_LogFileMutex.WaitOne();
			closeStreamWriter (_StreamWriter);
			_LogFileMutex.WaitOne();
			_LogFileMutex.Dispose ();
			_LogFileMutex = null;
			return;
		}

		private void writeLog2File(string logMessage)
		{
			StreamWriter streamWriter = getLogWriter();

			_LogFileMutex.WaitOne();
			if (streamWriter != null) {
				streamWriter.WriteLine (logMessage);
				streamWriter.Flush ();
			} else {
				Console.WriteLine ("Get log writer faild.");
			}
			_LogFileMutex.ReleaseMutex();

			return;
		}


	}
}

