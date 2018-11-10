using System;

namespace AppsflyerSpiderServer
{
	public class CDbParameter
	{
		private string _ParameterName = string.Empty;
		public string ParameterName{
			get{ return _ParameterName; }
			set{ _ParameterName = value; }
		}

		private object _ParameterValue = null;
		public object ParameterValue
		{
			get{ return _ParameterValue; }
			set{ _ParameterValue = value; }
		}

		public CDbParameter ()
		{
			
		}
	}
}

