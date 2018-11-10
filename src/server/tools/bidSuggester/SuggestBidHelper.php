<?php


class SuggestBidHelper
{
    private $parser;

    private $adsetHandler;

    private $isAnalysis;

    private $isExportCurve;

    private $rootPath;

    public function __construct($filePath)
    {
        $this->parser = new StrategyFileParser();
        $this->adsetHandler = new AdsetParamHandler();
        $this->rootPath = $filePath;

        $jsonFile = $this->rootPath . "/basicInfo.json";
        $basicConfig = FileHelper::readJsonFile($jsonFile);
        $this->isAnalysis = $basicConfig['isAnalysis'];
        $this->isExportCurve = $basicConfig['isExportCurve'];

    }

    public function exportSuggestBidFile($configFile)
    {
        $adsetArray = $this->getAdsetArray($configFile);
        foreach($adsetArray as $adsetInfo)
        {
            $optimizationList = $adsetInfo[StrategyConstants::ST_ADSET_OPTIMIZATION_GOAL];
            $adsetId = $adsetInfo[StrategyConstants::ST_ADSET_ID];
            $adsetName = $adsetInfo[StrategyConstants::ST_AD_NAME];

            foreach($optimizationList as $optimization)
            {
                $curDate = date('Y-m-d');
                $fileName = $adsetName . '_' . $optimization . '_' . $curDate . '.csv';

                $adsetInfo[StrategyConstants::ST_ADSET_OPTIMIZATION_GOAL] = $optimization;
                if(empty($adsetId))
                {
                    $targetingArray = $this->getALLTargeting($adsetInfo[StrategyConstants::ST_ADSET_TARGETING]);
                    $bidDatas = $this->getBidDatas($targetingArray, $adsetInfo);
                }
                else
                {
                    $bidDatas = $this->getBidDataByAdsetId($adsetId, $optimization);
                }

                $filePath = $this->rootPath . DIRECTORY_SEPARATOR . 'output' . DIRECTORY_SEPARATOR . $fileName;
                if(file_exists($filePath))
                {
                    array_shift($bidDatas);
                }
                FileHelper::saveCsv($filePath, $bidDatas);
            }
        }
    }

    private function getBidDataByAdsetId($adsetId, $optimization)
    {
        $bidData = array();
        $bidDatas[] = self::$analysisTitle;

        $accountId = $this->parser->getAccountId();
        $adsetInfo = AdManagerFacade::getAdsetById($adsetId);
        $estimateParam = $this->getEstimateParam($adsetInfo, $optimization);
        $bidArray = AdManagerFacade::getBidEstimateByAccount($accountId, $estimateParam);
        if(false === $bidArray)
        {
            return $bidData;
        }
        $bidEntity = $bidArray[0];
        $bidDatas[] = $this->getAnalysisEstimateData($bidEntity);
        if($this->isExportCurve)
        {
            $adsetData = AdManagerFacade::getBidEstimateByAdset($adsetId);
            $bidEntity->setCurve($adsetData[AdManageConstants::DELIVERY_FIELD_CURVE]);
            $filePath = $this->rootPath . DIRECTORY_SEPARATOR . 'output' .DIRECTORY_SEPARATOR . $adsetId .
                '_' . $optimization . '_curve_' . time() . '.csv';
            $this->exportCurveCsv($bidEntity, $filePath);
        }

        return $bidDatas;
    }

    private function getEstimateParam(AdsetEntity $adsetInfo, $optimization)
    {
        $estimateParam = array();

        $targetingFields = $adsetInfo->getTargeting();
        if(!empty($targetingFields))
        {
            $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_TARGETING] = $targetingFields;
        }

        if($optimization == StrategyConstants::ST_V_OPTIMIZATION_APPINSTALL)
        {
            $optimizationReal = AdManageConstants::ADSET_OPTIMIZATION_APPINSTALL;
        }
        else if($optimization == StrategyConstants::ST_V_OPTIMIZATION_LINKCLICK)
        {
            $optimizationReal = AdManageConstants::ADSET_OPTIMIZATION_LINKCLICK;
        }

        $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_OPTIMIZATION] = AdSetUtil::getOptimization($optimizationReal);

        $url = $adsetInfo->getPromoteObjectAppUrl();
        if(isset($url))
        {
            $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_URL] = $url;
        }

        $dailyBudget = $adsetInfo->getDailyBudget();
        if(!empty($dailyBudget))
        {
            $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_DAILY_BUDGET] = $dailyBudget;
        }

        $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_CURRENCY] = 'USD';

        return $estimateParam;
    }


    private function getBidDatas($targetingArray, $adsetInfo)
    {
        $bidDatas = array();
        if($this->isAnalysis)
        {
            $bidDatas[] = self::$analysisTitle;
        }
        else
        {
            $bidDatas[] = self::$readTitle;
        }


        $lines = count($targetingArray);
        print_r('Total records : ' . $lines . PHP_EOL);
        foreach($targetingArray as $newTargeting)
        {
            $newAdsetInfo = $adsetInfo;
            $newAdsetInfo[StrategyConstants::ST_ADSET_TARGETING] = $newTargeting;
            $adsetParam = @$this->adsetHandler->transformStrategy($newAdsetInfo);
            $adsetParam->setCampaignType($this->parser->getCampaignInfo()[StrategyConstants::ST_CAMPAIGN_TYPE]);
            $adsetParam->setAccountId($this->parser->getAccountId());
            $bidArray = AdManagerFacade::getReachEstimateByAccount($adsetParam);
            if(false === $bidArray)
            {
                continue;
            }
            $bidEntity = $bidArray[0];
            if($this->isAnalysis)
            {
                $bidDatas[] = $this->getAnalysisEstimateData($bidEntity);
            }
            else
            {
                $bidDatas[] = $this->getReadEstimateData($newTargeting, $bidEntity);
            }

            print_r('Leaving ' . (--$lines) . ' lines......' . PHP_EOL);
        }

        return $bidDatas;
    }

    private function getAdsetArray($configFile)
    {
        $parseResult = @$this->parser->parseStrategyParam($configFile);
        if (false === $parseResult)
        {
            print_r('Failed to parse strategy file : ' . $configFile);
            return array();
        }

        $adsetMap = $this->parser->getAdsetMap();
        return array_values($adsetMap);
    }

    private function getAnalysisEstimateData(ReachEstimateEntity $bidEntity)
    {
        $analysisData = array();
        $curDate = date(BasicConstants::DATE_DEFAULT_FORMAT);

        $analysisData[] = round($bidEntity->getBidMedian()/100, 2);
        $analysisData[] = $bidEntity->getUserCount();
        $analysisData[] = $curDate;

        return $analysisData;

    }

    private function getReadEstimateData($targeting, ReachEstimateEntity $bidEntity)
    {
        $country = implode(' ',$targeting[StrategyConstants::ST_TARGETING_COUNTRIES]);
        $ageMin = $targeting[StrategyConstants::ST_TARGETING_AGE_MIN];
        $ageMax = $targeting[StrategyConstants::ST_TARGETING_AGE_MAX];
        $locale = implode(' ', $targeting[StrategyConstants::ST_TARGETING_LOCALE]);
        $gender = $targeting[StrategyConstants::ST_TARGETING_GENDER];

        $estimateValue = array();
        $estimateValue[] = $country;

        $ageDes = '';
        $ageDes .= '[ ';
        $ageDes .= $ageMin;
        $ageDes .= '- ';
        $ageDes .= $ageMax;
        $ageDes .= ' ]';
        $estimateValue[] = $ageDes;

        $estimateValue[] = $gender;
        $estimateValue[] = $locale;

        $minBid = round($bidEntity->getBidMin()/100, 2);
        $maxBid = round($bidEntity->getBidMax()/100, 2);
        $suggestBid = round($bidEntity->getBidMedian()/100, 2);
        $bidDes = '$';
        $bidDes .= $suggestBid;
        $bidDes .= '( ';
        $bidDes .= '$';
        $bidDes .= $minBid;
        $bidDes .= ' - ';
        $bidDes .= '$';
        $bidDes .= $maxBid;
        $bidDes .= ' )';
        $estimateValue[] = $bidDes;

        $reach = $bidEntity->getUserCount();
        $estimateValue[] = $reach;

        return $estimateValue;
    }

    private function getALLTargeting($originalTargeting)
    {
        $countries = $originalTargeting[StrategyConstants::ST_TARGETING_COUNTRIES];
        $ageMins = (array)$originalTargeting[StrategyConstants::ST_TARGETING_AGE_MIN];
        $ageMaxs = (array)$originalTargeting[StrategyConstants::ST_TARGETING_AGE_MAX];
        $locales = $originalTargeting[StrategyConstants::ST_TARGETING_LOCALE];
        $genders = $originalTargeting[StrategyConstants::ST_TARGETING_GENDER];

        if(empty($countries))
        {
            return array();
        }
        $countryTargeting = $this->getCountryTargeting($countries, $originalTargeting);
        $ageTargeting = $this->getAgeTargeting($ageMins, $ageMaxs, $countryTargeting);
        $genderTargeting = $this->getGenderTargeting($genders, $ageTargeting);
        $targetingArray = $this->getLocaleTargeting($locales, $genderTargeting);

        return $targetingArray;
    }

    private function getCountryTargeting($countries, $originalTargeting)
    {
        $countryTargeting = array();
        foreach($countries as $country)
        {
            $cTargeting = $originalTargeting;
            $cTargeting[StrategyConstants::ST_TARGETING_COUNTRIES] = array($country,);
            $countryTargeting[] = $cTargeting;
        }

        return $countryTargeting;
    }

    private function getAgeTargeting($ageMins, $ageMaxs, $targetingArray)
    {
        $ageTargeting = array();
        if(0 === count($ageMins))
        {
            $ageMins = (array)TargetingConstants::AGE_MIN_DEFAULT;
            $ageMaxs = (array)TargetingConstants::AGE_MAX_DEFAULT;
        }

        foreach($targetingArray as $oneTargeting)
        {
            $ageCount = count($ageMins);
            for($i=0; $i< $ageCount; ++$i)
            {
                $ageMin = $ageMins[$i];
                $ageMax = $ageMaxs[$i];
                $newTargeting = $oneTargeting;
                $newTargeting[StrategyConstants::ST_TARGETING_AGE_MIN] = $ageMin;
                $newTargeting[StrategyConstants::ST_TARGETING_AGE_MAX] = $ageMax;
                $ageTargeting[] = $newTargeting;
            }
        }

        return $ageTargeting;
    }

    private function getLocaleTargeting($locales, $targetingArray)
    {
        $localeTargeting = array();
        if(empty($locales))
        {
            return $targetingArray;
        }

        foreach($targetingArray as $oneTargeting)
        {
            foreach($locales as $locale)
            {
                $newTargeting = $oneTargeting;
                $newTargeting[StrategyConstants::ST_TARGETING_LOCALE] = array($locale,);
                $localeTargeting[] = $newTargeting;
            }
        }

        return $localeTargeting;
    }

    private function getGenderTargeting($genders, $targetingArray)
    {
        $genderTargeting = array();
        if(empty($genders))
        {
            return $targetingArray;
        }

        foreach($targetingArray as $oneTargeting)
        {
            foreach($genders as $gender)
            {
                $newTargeting = $oneTargeting;
                $newTargeting[StrategyConstants::ST_TARGETING_GENDER] = $gender;
                $genderTargeting[] = $newTargeting;
            }
        }

        return $genderTargeting;
    }

    private function exportCurveCsv(ReachEstimateEntity $estimateBidEntity, $filePath)
    {
        $curveArray = $estimateBidEntity->getCurve();

        $resultArray = array();
//        $csvtitle = array('bid', 'spend', 'reach', 'impression', 'action');
        $csvtitle = array('spend', 'reach', 'impression', 'action');
        $resultArray[] = $csvtitle;

        foreach($curveArray as $curve)
        {
            $resultArray[] = array_values($curve);
        }

        FileHelper::saveCsv($filePath, $resultArray);
    }

    private static $readTitle = array(
        'Country',
        'Age',
        'Gender',
        'Locale',
        'Bid',
        'AudienceSize',
      );

    private static $analysisTitle = array(
        'suggestBid',
        'AudienceSize',
        'requestTime',
      );

}