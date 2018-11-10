using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AdSeeDataSpider
{
    public class CQueueProcessStatus
    {
        private DateTime _StartTime = DateTime.Now;
        public DateTime StartTime
        {
            get { return _StartTime; }
            set { _StartTime = value; }
        }

        private DateTime _EndTime = DateTime.Now;
        public DateTime EndTime
        {
            get { return _EndTime; }
            set { _EndTime = value; }
        }

        private int _TaskNumber = 0;
        public int TaskNmber
        {
            get { return _TaskNumber; }
            set { _TaskNumber = value; }
        }

        private int _CompleteNumber = 0;
        public int CompleteNumber
        {
            get { return _CompleteNumber; }
            set { _CompleteNumber = value; }
        }

        public CQueueProcessStatus()
        {
        }

        public bool isComplete()
        {
            return (TaskNmber == CompleteNumber);
        }

        public override string ToString()
        {
            return string.Format("<{0},{1},{2},{3}>", StartTime.ToUniversalTime(), EndTime.ToUniversalTime(), CompleteNumber, TaskNmber);
        }

    }
}
