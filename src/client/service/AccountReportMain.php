<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 12/12/16
 * Time: 12:24 PM
 */

require_once("Models/Report/initEliReportThread.php");

$systemConfig = $GLOBALS['gSystemConfig'];
$systemLog = $GLOBALS['gLog'];

$weekReportThread = new CWeekReportThread($systemConfig, $systemLog);
$weekReportThread->start();
