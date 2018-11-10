using System;
using System.IO;
using System.Threading;
using System.Text;
using System.Linq;

namespace AdSeeDataSpider
{
	public class CSystemLog
	{
		private static Mutex _LogFileMutex = new Mutex();
		private static StreamWriter _StreamWriter = null;
        private string _LogPath = string.Empty;
		private string _LogFileName = string.Empty;
		private bool _IsWriteLog2Screen = true;
		private LOG_LEVEL _WriteLogLevel = LOG_LEVEL.ERR;
		public CSystemLog (bool isWriteLog2Screen, LOG_LEVEL outputLogLevel, string logPath)
		{
            _IsWriteLog2Screen = isWriteLog2Screen;
            _WriteLogLevel = outputLogLevel;
            _LogPath = logPath;
        }

		~CSystemLog()
		{
           
        }


		private StreamWriter getLogWriter()
		{
			string logFile = getUserRunLogFile ();
			if ((_LogFileName.CompareTo (logFile) != 0) && (_StreamWriter != null)) {
				_StreamWriter.Flush ();
				_StreamWriter.Close ();
				_StreamWriter.Dispose ();
				_StreamWriter = null;
			}

			if (_StreamWriter != null) {
				return _StreamWriter;
			}

			_LogFileName = logFile;
			try
			{
				_StreamWriter = new StreamWriter(_LogFileName, true);
				_StreamWriter.AutoFlush = true;
			}
			catch(Exception ex) {
				_StreamWriter = null;
				Console.WriteLine (string.Format ("Create log writer {0}> faild, error message<{1}>.", logFile, ex.Message));
			}

			return _StreamWriter;
		}

        private string getUserRunLogFile()
        {
            DateTime currentDate = DateTime.Now;
            return string.Format("{0}/{1}.log", _LogPath, currentDate.ToString("yyyyMMdd"));
        }

		public void writeLog2Console(LOG_LEVEL loglevel, string message)
		{
			if (loglevel > _WriteLogLevel)
            {
				return;
			}

			DateTime currentTime = DateTime.Now;
			string logMessage = string.Format("[{0}][{1}][{2}][{3}]",
				DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
				Thread.CurrentThread.ManagedThreadId,
				loglevel,
				message);
			if (_IsWriteLog2Screen) {
				Console.WriteLine (logMessage);
			}
			writeLog2File(logMessage);
		}

		public void closeLogWriter()
		{
			StreamWriter streamWriter = null;
			_LogFileMutex.WaitOne();
			streamWriter = getLogWriter();
			if (streamWriter == null)
			{
				_LogFileMutex.ReleaseMutex();
				return;
			}
			streamWriter.Flush ();
			streamWriter.Close();
			streamWriter.Dispose();
			streamWriter = null;
			_LogFileMutex.ReleaseMutex();
			_LogFileMutex.Dispose ();
			_LogFileMutex = null;
			return;
		}

		private void writeLog2File(string logMessage)
		{
			StreamWriter streamWriter = null;
			_LogFileMutex.WaitOne();
            if(!Directory.Exists(_LogPath))
            {
                Directory.CreateDirectory(_LogPath);
            }

			streamWriter = getLogWriter();
			if (streamWriter != null)
			{
				streamWriter.WriteLine(logMessage);
				streamWriter.Flush();
			}
			_LogFileMutex.ReleaseMutex();

			return;
		}


	}
}

