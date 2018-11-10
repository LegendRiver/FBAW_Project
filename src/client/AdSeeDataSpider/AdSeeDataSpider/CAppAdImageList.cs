using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Linq;

namespace AdSeeDataSpider
{
    public class CAppAdImageList
    {
        public string pageid { get; set; }
        public int PageNo { get; set; }
        public int AdIndex { get; set; }
        private List<string> _ImageList = null;
        public List<string> ImageList { get { return _ImageList; } }

        private CSystemLog _SystemLog = null;
        public CAppAdImageList(int pageNo, int adIndex, CSystemLog systemLog)
        {
            PageNo = pageNo;
            AdIndex = adIndex;
            _SystemLog = systemLog;
            _ImageList = new List<string>();
        }

        internal E_ERROR_CODE parse(JObject adItem)
        {
            string message = string.Empty;

            if(adItem == null)
            {
                message = "Aditem is null";
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_APP_AD_IMAGE_ITEM_IS_NULL;
            }

            try
            {
                pageid = adItem.GetValue("pageid").Value<string>();
            }
            catch(Exception ex)
            {
                message = string.Format("Not foun pageid <{0}>, error message <{1}>.", adItem.ToString(), ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_FOUND_FIELD_PAGEID;
            }
            
            try
            {
                ImageList.Add(adItem.GetValue("actorImg").Value<string>());
            }
            catch(Exception ex)
            {
                message = string.Format("Not foun actorImg <{0}>, error message <{1}>.", adItem.ToString(), ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_FOUND_FIELD_ACTOR_IMG;
            }
            
            try
            {
                ImageList.Add(adItem.GetValue("cdnMarkImg").Value<string>());
            }
            catch(Exception ex)
            {
                message = string.Format("Not foun cdnMarkImg <{0}>, error message <{1}>.", adItem.ToString(), ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_FOUND_FIELD_ACTOR_CDN_MARK_IMG;
            }

            try
            {
                ImageList.Add(adItem.GetValue("cdnOriginImg").Value<string>());
            }
            catch(Exception ex)
            {
                message = string.Format("Not foun cdnOriginImg <{0}>, error message <{1}>.", adItem.ToString(), ex.Message);
                _SystemLog.writeLog2Console(LOG_LEVEL.ERR, message);
                return E_ERROR_CODE.ERROR_NOT_FOUND_FIELD_ACTOR_CDN_ORIGIN_IMG;
            }

            return E_ERROR_CODE.OK;
        }
    }
}
