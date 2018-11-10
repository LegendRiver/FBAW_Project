using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MySql.Data.MySqlClient;
using System.Threading;
using System.Data.SqlClient;
namespace AppsflyerSpiderServer
{
    public class CDbConnection
    {
        public delegate void processDbReaderDelegate(MySqlDataReader sqlReader);
        private string _DbConnectString = string.Empty;
		private CSystemLog _SystemLog = null;

		private static string CHECK_TABLE = "select 1 as TABLE_EXIST from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='{0}' and TABLE_NAME='{1}'";
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
				_SystemLog.writeLog (LOG_LEVEL.CRIT, message);
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

		public bool checkTable(string tableName)
		{
			string message = string.Empty;
			MySqlConnection dbConnection = null;
			MySqlCommand sqlCommand = null;
			try{
				dbConnection = getDbConnection();
				sqlCommand = dbConnection.CreateCommand();
				sqlCommand.CommandType = System.Data.CommandType.Text;
				sqlCommand.CommandText = string.Format(CHECK_TABLE,dbConnection.Database, tableName);
				MySqlDataReader dataReader = sqlCommand.ExecuteReader();
				if(dataReader.HasRows)
				{
					dataReader.Close();
					dataReader.Dispose();
					dataReader = null;
					return true;
				}

				dataReader.Close();
				dataReader.Dispose();
				dataReader = null;

				return false;

			}
			catch(Exception ex) {
				message = string.Format ("rror message<{0}>.", ex.Message);
				_SystemLog.writeLog (LOG_LEVEL.ERR, message);
				return false;
			}
			finally{
				if (sqlCommand != null) {
					sqlCommand.Dispose ();
					sqlCommand = null;
				}
				if (dbConnection != null) {
					dbConnection.Close ();
					dbConnection.Dispose ();
					dbConnection = null;
				}
			}
		}

		public bool saveRecords(string commandText, List<List<CDbParameter>> recordTable, List<string> parameterNames, out int updateRecordCount)
		{
			int insertRecordCount = 0;
			string message = string.Empty;
			MySqlConnection dbConnection = null;
			MySqlCommand sqlCommand = null;
			MySqlTransaction sqlTransaction = null;
			try
			{
				dbConnection = getDbConnection();
				sqlTransaction = dbConnection.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);
				sqlCommand = dbConnection.CreateCommand();
				sqlCommand.CommandType = System.Data.CommandType.Text;
				sqlCommand.CommandText = commandText;
				sqlCommand.Transaction = sqlTransaction;
				sqlCommand.Prepare();

				foreach(string parameterName in parameterNames)
				{
					string sqlParameterName = string.Format("@{0}", parameterName);
					sqlCommand.Parameters.Add( new MySqlParameter(sqlParameterName,null));
				}

				foreach(List<CDbParameter> record in recordTable)
				{
					foreach(CDbParameter dbParameter in record)
					{
                        if(sqlCommand.Parameters.Contains(string.Format("@{0}", dbParameter.ParameterName)))
						{
                            sqlCommand.Parameters[string.Format("@{0}", dbParameter.ParameterName)].Value = dbParameter.ParameterValue;
                        }
					}
					insertRecordCount += sqlCommand.ExecuteNonQuery();
				}

				sqlTransaction.Commit();
                updateRecordCount = insertRecordCount;
				return true;
			}
			catch (MySqlException ex)
			{
				sqlTransaction.Rollback ();
				message = string.Format ("Command text<{0}>,error code<{1}>,error message<{2}>.", commandText, ex.Number, ex.Message);
				_SystemLog.writeLog (LOG_LEVEL.ERR, message);
                updateRecordCount = 0;
				return false;
			}
			finally {
				if (sqlTransaction != null) {
					sqlTransaction.Dispose ();
					sqlTransaction = null;
				}

				if (sqlCommand != null) {
					sqlCommand.Dispose ();
					sqlCommand = null;
				}
				if (dbConnection != null) {
					dbConnection.Close ();
					dbConnection.Dispose ();
					dbConnection = null;
				}
			}
		}

		public bool queryRecords(List<string> sqlList, out int insertRecordCount)
		{
			string message = string.Empty;
			int insertCount = 0;
			MySqlCommand dbCommand = null;
			MySqlTransaction dbTransaction = null;
			MySqlConnection dbConnection = null;

			try {
				
				dbConnection = getDbConnection ();
				dbTransaction = dbConnection.BeginTransaction (System.Data.IsolationLevel.ReadUncommitted);
				dbCommand = dbConnection.CreateCommand ();
				dbCommand.Transaction = dbTransaction;
				dbCommand.CommandType = System.Data.CommandType.Text;
				foreach (string querySql in sqlList) {
					dbCommand.CommandText = querySql;
					insertCount += dbCommand.ExecuteNonQuery ();
				}

				insertRecordCount = insertCount;
				dbTransaction.Commit ();
				return true;
			} catch (Exception ex) {
				dbTransaction.Rollback ();
				insertRecordCount = 0;
				message = string.Format ("Insert record to db faild.error message:<{0}>", ex.Message);
				_SystemLog.writeLog (LOG_LEVEL.ERR, message);
				return false;
			} finally {
				if (dbTransaction != null) {
					dbTransaction.Dispose ();
					dbTransaction = null;
				}

				if (dbCommand != null) {
					dbCommand.Dispose ();
					dbCommand = null;
				}
				if (dbConnection != null) {
					dbConnection.Close ();
					dbConnection.Dispose ();
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
					_SystemLog.writeLog(LOG_LEVEL.DEBUG, string.Format("Load... data from db, query sql<{0}>.", querySql));
                    Thread.Sleep(TimeSpan.FromSeconds(1));
                }

                dbDataReader = dbCommand.EndExecuteReader(result);
                processDbReader(dbDataReader);                
            }
            catch (MySqlException ex)
            {
                message = string.Format("Load data from db has some error, error message:<{0}>", ex.Message);
				_SystemLog.writeLog(LOG_LEVEL.ERR, message);
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
