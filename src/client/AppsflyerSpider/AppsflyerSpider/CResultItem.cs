using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace QueryPageOrder
{
    public class CResultItem
    {
        private string _SrcId = string.Empty;
        public string SrcId
        {
            get { return _SrcId; }
            set { _SrcId = value; }
        }

        private int _CurrentOrder = 0;
        public int CurrentOrder
        {
            get { return _CurrentOrder; }
            set { _CurrentOrder = value; }
        }

        private string _ResultTitle = string.Empty;
        public string ResultTitle
        {
            get { return _ResultTitle; }
            set { _ResultTitle = value; }
        }

        private string _ResultSite = string.Empty;
        public string ResultSite
        {
            get { return _ResultSite; }
            set { _ResultSite = value; }
        }

        private string _ResultUrl = string.Empty;
        public string ResultUrl
        {
            get { return _ResultUrl; }
            set { _ResultUrl = value; }
        }

        private int _PageIndex = 0;
        public int PageIndex
        {
            get { return _PageIndex; }
            set { _PageIndex = value; }
        }

        public override string ToString()
        {            
            return string.Format("[{0}][{1}][{2}][{3}][{4}]", PageIndex, CurrentOrder, ResultTitle, SrcId, ResultUrl);
        }

        public CResultItem()
        {

        }
    }
}
