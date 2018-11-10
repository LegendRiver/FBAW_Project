<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 12/12/16
 * Time: 10:41 AM
 */
class CWeekReportThread extends Thread
{
    private static $DbInterface = null;
    private $SystemConfig = null;
    private $SystemLog = null;
    private static $WeekReport = null;

    public function __construct($systemConfig, $systemLog)
    {
        $this->SystemConfig = $systemConfig;
        $this->SystemLog = $systemLog;
    }

    public function run()
    {
        self::$DbInterface = new CDbMySqliInterface($this->SystemConfig, $this->SystemLog);
        self::$WeekReport = new CWeekReport($this->SystemConfig, $this->SystemLog, self::$DbInterface);
        while(true)
        {
            $weekNumber = date('w');
            $reportWeek = (date('W') - 1);
            $tables = array();
            self::$DbInterface->getTableList($tables);
            $errorCode = self::$WeekReport->buildReport($reportWeek);

            if($weekNumber == 0)
            {
                if($errorCode != OK)
                {
                    $this->SystemLog->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Build week report <%d> failed, error code <%d>.", $reportWeek, $errorCode));
                }
                else
                {
                    $this->SystemLog->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Build week report <%d> success.", $reportWeek));
                }
            }
            else
            {
                $sleepTime = (5);//(24 * 60 * 60);
                $this->SystemLog->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, sprintf("next execute time after <%d> seconds.", $sleepTime));
                sleep($sleepTime);
            }
        }
    }
}