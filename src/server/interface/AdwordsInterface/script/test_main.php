<?php
require_once(__DIR__ . "/../../../includeFile/basicIncludeFile.php");
require_once(__DIR__ . "/../../../includeFile/googleIncludeFile.php");

use Google\AdsApi\AdWords\AdWordsSession;
use Google\AdsApi\AdWords\AdWordsSessionBuilder;
use Google\AdsApi\AdWords\Reporting\v201705\DownloadFormat;
use Google\AdsApi\AdWords\Reporting\v201705\ReportDefinition;
use Google\AdsApi\AdWords\Reporting\v201705\ReportDefinitionDateRangeType;
use Google\AdsApi\AdWords\Reporting\v201705\ReportDownloader;
use Google\AdsApi\AdWords\ReportSettingsBuilder;
use Google\AdsApi\AdWords\v201705\cm\Predicate;
use Google\AdsApi\AdWords\v201705\cm\PredicateOperator;
use Google\AdsApi\AdWords\v201705\cm\ReportDefinitionReportType;
use Google\AdsApi\AdWords\v201705\cm\Selector;
use Google\AdsApi\Common\OAuth2TokenBuilder;
use Google\AdsApi\AdWords\AdWordsServices;
use Google\AdsApi\AdWords\v201705\cm\CampaignService;
use Google\AdsApi\AdWords\v201705\cm\OrderBy;
use Google\AdsApi\AdWords\v201705\cm\Paging;
use Google\AdsApi\AdWords\v201705\cm\SortOrder;
/**
 * This example creates a new account under an AdWords manager account. Note:
 * this example must be run using the credentials of an AdWords manager account,
 * and by default the new account will only be accessible via the parent AdWords
 * manager account.
 */
//class DownloadCriteriaReportWithSelector {
//
//    public static function runExample(AdWordsSession $session, $filePath) {
//        // Create selector.
//        $selector = new Selector();
//        $selector->setFields(['CampaignId', 'AdGroupId', 'Id', 'Criteria',
//            'CriteriaType', 'Impressions', 'Clicks', 'Cost']);
//
//        // Use a predicate to filter out paused criteria (this is optional).
//        $selector->setPredicates([
//            new Predicate('Status', PredicateOperator::NOT_IN, ['PAUSED'])]);
//
//        // Create report definition.
//        $reportDefinition = new ReportDefinition();
//        $reportDefinition->setSelector($selector);
//        $reportDefinition->setReportName(
//            'Criteria performance report #' . uniqid());
//        $reportDefinition->setDateRangeType(
//            ReportDefinitionDateRangeType::LAST_7_DAYS);
//        $reportDefinition->setReportType(
//            ReportDefinitionReportType::CRITERIA_PERFORMANCE_REPORT);
//        $reportDefinition->setDownloadFormat(DownloadFormat::CSV);
//
//        // Download report.
//        $reportDownloader = new ReportDownloader($session);
//        $reportDownloadResult =
//            $reportDownloader->downloadReport($reportDefinition);
//        $reportDownloadResult->saveToFile($filePath);
//        printf("Report with name '%s' was downloaded to '%s'.\n",
//            $reportDefinition->getReportName(), $filePath);
//    }
//
//    public static function main() {
//        // Generate a refreshable OAuth2 credential for authentication.
//        $init_file = __DIR__ . '/../conf/adsapi_php_test.ini';
//        $oAuth2Credential = (new OAuth2TokenBuilder())
//            ->fromFile($init_file)
//            ->build();
//
//        // See: ReportSettingsBuilder for more options (e.g., suppress headers)
//        // or set them in your adsapi_php.ini file.
//        $reportSettings = (new ReportSettingsBuilder())
//            ->fromFile($init_file)
//            ->includeZeroImpressions(true)
//            ->build();
//
//        // See: AdWordsSessionBuilder for setting a client customer ID that is
//        // different from that specified in your adsapi_php.ini file.
//        // Construct an API session configured from a properties file and the OAuth2
//        // credentials above.
//        $session = (new AdWordsSessionBuilder())
//            ->fromFile($init_file)
//            ->withOAuth2Credential($oAuth2Credential)
//            ->withReportSettings($reportSettings)
//            ->build();
//
//        $filePath = sprintf(
//            '%s.csv',
//            tempnam(sys_get_temp_dir(), 'criteria-report-')
//        );
//        self::runExample($session, $filePath);
//    }
//}
//
//DownloadCriteriaReportWithSelector::main();
class GetCampaigns {

    const PAGE_LIMIT = 500;

    public static function runExample(AdWordsServices $adWordsServices,
                                      AdWordsSession $session) {
        $campaignService = $adWordsServices->get($session, CampaignService::class);

        // Create selector.
        $selector = new Selector();
        $selector->setFields(['Id', 'Name']);
        $selector->setOrdering([new OrderBy('Name', SortOrder::ASCENDING)]);
        $selector->setPaging(new Paging(0, self::PAGE_LIMIT));

        $totalNumEntries = 0;
        do {
            // Make the get request.
            $page = $campaignService->get($selector);

            // Display results.
            if ($page->getEntries() !== null) {
                $totalNumEntries = $page->getTotalNumEntries();
                foreach ($page->getEntries() as $campaign) {
                    printf(
                        "Campaign with ID %d and name '%s' was found.\n",
                        $campaign->getId(),
                        $campaign->getName()
                    );
                }
            }

            // Advance the paging index.
            $selector->getPaging()->setStartIndex(
                $selector->getPaging()->getStartIndex() + self::PAGE_LIMIT);
        } while ($selector->getPaging()->getStartIndex() < $totalNumEntries);

        printf("Number of results found: %d\n", $totalNumEntries);
    }

    public static function main() {
        // Generate a refreshable OAuth2 credential for authentication.
        $init_file = __DIR__ . '/../conf/adsapi_php_test.ini';
        $oAuth2Credential = (new OAuth2TokenBuilder())
            ->fromFile($init_file)
            ->build();

        // Construct an API session configured from a properties file and the OAuth2
        // credentials above.
        $session = (new AdWordsSessionBuilder())
            ->fromFile($init_file)
            ->withOAuth2Credential($oAuth2Credential)
            ->build();
        self::runExample(new AdWordsServices(), $session);
    }
}

GetCampaigns::main();