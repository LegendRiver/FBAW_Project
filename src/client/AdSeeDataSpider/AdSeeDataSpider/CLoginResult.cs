using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AdSeeDataSpider
{
    public class CLoginResult
    {
        public string position { get; set; }
        public string lastName { get; set; }
        public string phone { get; set; }
        public string accessToken { get; set; }
        public string workplace { get; set; }

        public string regsource { get; set; }

        public string country { get; set; }
        public int flag { get; set; }
        public string email { get; set; }
        public string userId { get; set; }
        public string company { get; set; }
        public string companyType { get; set; }
        public string firstName { get; set; }
        public int leftDate { get; set; }
        public string spending { get; set; }
        
        public CLoginResult()
        {

        }
    }
}
