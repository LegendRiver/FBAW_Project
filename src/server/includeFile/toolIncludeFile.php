<?php

if(!class_exists('TargetingCsvFileHandler'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'FBTargetingExporter/handler/TargetingCsvFileHandler.php');
}
if(!class_exists('TargetingSearchCsvUtil'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'FBTargetingExporter/handler/TargetingSearchCsvUtil.php');
}
if(!class_exists('ExportCsvConstant'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'FBTargetingExporter/common/ExportCsvConstant.php');
}
if(!class_exists('ExportTargetingEntity'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'FBTargetingExporter/common/ExportTargetingEntity.php');
}
if(!class_exists('ExportTargetingParam'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'FBTargetingExporter/common/ExportTargetingParam.php');
}
if(!class_exists('CurveDataEntity'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'FBTargetingExporter/common/CurveDataEntity.php');
}
if(!class_exists('ExportExcelHandler'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'FBTargetingExporter/handler/ExportExcelHandler.php');
}
if(!class_exists('DailyReachCalculator'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'FBTargetingExporter/dailyReach/DailyReachCalculator.php');
}
if(!class_exists('ExportRun'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'FBTargetingExporter/handler/ExportRun.php');
}

if(!class_exists('AbstractExportHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'AdInsightExporter/AbstractExportHelper.php');
}
if(!class_exists('AdInsightExportHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'AdInsightExporter/AdInsightExportHelper.php');
}
if(!class_exists('AdSetInsightExportHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'AdInsightExporter/AdSetInsightExportHelper.php');
}
if(!class_exists('AdSetAttributeHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'AdInsightExporter/attributionInsight/AdSetAttributeHelper.php');
}
if(!class_exists('CampaignExportHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'AdInsightExporter/CampaignExportHelper.php');
}
if(!class_exists('ExporterUtil'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'AdInsightExporter/ExporterUtil.php');
}
if(!class_exists('ExportConfigHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'AdInsightExporter/ExportConfigHelper.php');
}

if(!class_exists('SwitcherConstants'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'StatusSwitcher/SwitcherConstants.php');
}
if(!class_exists('SwitcherHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'StatusSwitcher/SwitcherHelper.php');
}

if(!class_exists('ConfigFileReader'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'InsightReporter/ConfigFileReader.php');
}
if(!class_exists('ReportExcelHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'InsightReporter/ReportExcelHelper.php');
}
if(!class_exists('ReporterInsightHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'InsightReporter/ReporterInsightHelper.php');
}
if(!class_exists('ReporterConstants'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'InsightReporter/ReporterConstants.php');
}
if(!class_exists('OSInsightHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'InsightReporter/OSInsightHelper.php');
}
if(!class_exists('HotdayReportHandler'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'InsightReporter/hotdayReport/HotdayReportHandler.php');
}
if(!class_exists('ReportRun'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'InsightReporter/ReportRun.php');
}
if(!class_exists('ProfitAutoConstants'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'InsightReporter/constants/ProfitAutoConstants.php');
}
if(!class_exists('BreakdownInsightHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'InsightReporter/breakdownReporter/BreakdownInsightHelper.php');
}
if(!class_exists('BDConfReader'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'InsightReporter/breakdownReporter/BDConfReader.php');
}
if(!class_exists('DeviceBDConfReader'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'InsightReporter/breakdownReporter/DeviceBDConfReader.php');
}
if(!class_exists('BDReportHandler'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'InsightReporter/breakdownReporter/BDReportHandler.php');
}
if(!class_exists('DeviceBDHandler'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'InsightReporter/breakdownReporter/DeviceBDHandler.php');
}

if(!class_exists('SuggestBidHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'bidSuggester/SuggestBidHelper.php');
}

if(!class_exists('ReachFrequencyHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'ReachFrequencyEstimate/ReachFrequencyHelper.php');
}

if(!class_exists('RuleToolConstants'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'RuleTool/constants/RuleToolConstants.php');
}
if(!class_exists('RuleToolHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'RuleTool/handler/RuleToolHelper.php');
}
if(!class_exists('RuleHandler'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'RuleTool/handler/RuleHandler.php');
}
if(!class_exists('LogicRuleHandler'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'RuleTool/handler/LogicRuleHandler.php');
}
if(!class_exists('RuleParser'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'RuleTool/handler/RuleParser.php');
}
if(!class_exists('RuleChecker'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'RuleTool/handler/RuleChecker.php');
}

if(!class_exists('AlarmConstants'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'AccountInfoExporter/balanceAlarm/AlarmConstants.php');
}
if(!class_exists('DuplicateHandler'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'duplicateAd/manager/DuplicateHandler.php');
}
if(!class_exists('CopyFBHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'duplicateAd/manager/CopyFBHelper.php');
}
if(!class_exists('DuplicateAdConstants'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'duplicateAd/constants/DuplicateAdConstants.php');
}
if(!class_exists('CarouselHandler'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'duplicateAd/manager/CarouselHandler.php');
}
if(!class_exists('ScannerHelper'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'RejectAdScanner/ScannerHelper.php');
}
if(!class_exists('ScannerConstants'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'RejectAdScanner/ScannerConstants.php');
}

if(!class_exists('UACConstants'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'createUAC/constant/UACConstants.php');
}
if(!class_exists('UACParameterBuilder'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'createUAC/handler/UACParameterBuilder.php');
}


if(!class_exists('BidAdjustManager'))
{
    require_once(EL_SERVER_PATH . 'tools' . DIRECTORY_SEPARATOR . 'AdjustBidding/BidAdjustManager.php');
}
