using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MySql.Data.MySqlClient;
using System.Threading;
using System.Data.SqlClient;
 
namespace AdSeeDataSpider
{
    public class CDbConnection
    {
        public delegate void processDbReaderDelegate(MySqlDataReader sqlReader);
        private string _DbConnectString = string.Empty;
		private CSystemLog _SystemLog = null;
        public CDbConnection(string connectString,CSystemLog systemLog)
        {
            _DbConnectString = connectString;
			_SystemLog = systemLog;
        }

		public bool testConnect()
		{
			string message = string.Empty;
			MySqlConnection dbConnection = null;
			try
			{
				dbConnection = getDbConnection ();
				return (dbConnection.State == System.Data.ConnectionState.Open);
			}
			catch(Exception ex) {
				message = string.Format ("Open db faild, error message<{0}>.", ex.Message);
				_SystemLog.writeLog2Console (LOG_LEVEL.CRIT, message);
				return false;
			}
			finally 
			{
				if (dbConnection != null) 
				{
					dbConnection.Close ();
					dbConnection.Dispose ();
					dbConnection = null;
				}
			}
		}

        private MySqlConnection getDbConnection()
        {
            MySqlConnection dbConnection = new MySqlConnection(_DbConnectString);
            dbConnection.Open();
            return dbConnection;
        }

        public void queryRecords(List<string> sqlList, out int insertRecordCount)
        {
            string message = string.Empty;
            int insertCount = 0;
            MySqlCommand dbCommand = null;
            MySqlTransaction dbTransaction = null;
            MySqlConnection dbConnection = null;

            try
            {
                dbConnection = getDbConnection();

                dbTransaction = dbConnection.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);
                dbCommand = dbConnection.CreateCommand();
                dbCommand.Transaction = dbTransaction;
                foreach (string querySql in sqlList)
                {
                    dbCommand.CommandType = System.Data.CommandType.Text;
                    dbCommand.CommandText = querySql;
                    insertCount += dbCommand.ExecuteNonQuery();
                }

                insertRecordCount = insertCount;
                dbTransaction.Commit();
            }
            catch (Exception ex)
            {
                dbTransaction.Rollback();
                insertRecordCount = 0;
                message = string.Format("Insert record to db faild.error message:<{0}>", ex.Message);
				_SystemLog.writeLog2Console(LOG_LEVEL.INFO, message);
            }
            finally
            {
                if (dbTransaction != null)
                {
                    dbTransaction.Dispose();
                    dbTransaction = null;
                }

                if (dbCommand != null)
                {
                    dbCommand.Dispose();
                    dbCommand = null;
                }
                if (dbConnection != null)
                {
                    dbConnection.Close();
                    dbConnection.Dispose();
                    dbConnection = null;
                }
            }

        }

        public void queryRecords(string querySql, processDbReaderDelegate processDbReader)
        {
            string message = string.Empty;
            MySqlConnection dbConnection = null;
            MySqlDataReader dbDataReader = null;
            MySqlCommand dbCommand = null;

            try
            {
                dbConnection = getDbConnection();
                if (dbConnection == null)
                {
                    throw new NullReferenceException("DbConnection is null.");
                }

                if (dbConnection.State != System.Data.ConnectionState.Open)
                {
                    return;
                }

                dbCommand = dbConnection.CreateCommand();
                dbCommand.CommandType = System.Data.CommandType.Text;
                dbCommand.CommandText = querySql;
                IAsyncResult result = dbCommand.BeginExecuteReader();
                while (!result.IsCompleted)
                {
					_SystemLog.writeLog2Console(LOG_LEVEL.DEBUG, string.Format("Load... data from db, query sql<{0}>.", querySql));
                    Thread.Sleep(TimeSpan.FromSeconds(1));
                }

                dbDataReader = dbCommand.EndExecuteReader(result);
                processDbReader(dbDataReader);                
            }
            catch (MySqlException ex)
            {
                message = string.Format("Load data from db has some error, error message:<{0}>", ex.Message);
				_SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
            }
            finally
            {
                if (dbDataReader != null)
                {
                    dbDataReader.Close();
                    dbDataReader.Dispose();
                    dbDataReader = null;
                }

                if (dbCommand != null)
                {
                    dbCommand.Dispose();
                    dbCommand = null;
                }

                if (dbConnection != null)
                {
                    dbConnection.Close();
                    dbConnection.Dispose();
                    dbConnection = null;
                }
            }
        }
    }
}
