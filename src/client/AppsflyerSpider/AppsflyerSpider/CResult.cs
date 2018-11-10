using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AutoWebBrowser
{
    public class CResult
    {
        public int error_code { get; set; }
        public string message { get; set; }
        public string data { get; set; }

        public CResult()
        {
        }

    }
}
