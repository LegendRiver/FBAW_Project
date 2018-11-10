<?php

use FacebookAds\Object\Values\AdSetOptimizationGoalValues;

class TargetingSearchCsvUtil
{
    public static function exportTargetingInfo($searchClass, $csvPath, ExportTargetingParam $commonParam)
    {
        if(empty($commonParam->getDescription()))
        {
            $targetingInfoResult = TargetingSearchUtil::queryTargetingList($searchClass);
            $isWithCountry = false;
        }
        else
        {
            $targetingInfoResult = self::queryTargetingByParam($searchClass, $commonParam);
            $isWithCountry = true;
        }

        $maxDepth = self::getInterestMaxPath($targetingInfoResult);

        $fileContent = array();
        foreach ($targetingInfoResult as $searchEntity)
        {
            if(empty($fileContent))
            {
                $title = self::getTargetingSearchCsvTitle($searchEntity->getTitleDescription(), $searchClass, $maxDepth, $isWithCountry);
                $fileContent[] = $title;
            }

            $value = self::getTargetingSearchCsvValue($searchEntity, $searchClass, $maxDepth, $isWithCountry);
            $fileContent[] = $value;
        }

        $savePath = self::getOutputFileName($csvPath, $searchClass);
        FileHelper::saveCsv($savePath, $fileContent);
    }

    public static function exportGeneralTargetingCsv($targetingClass, $csvPath,
                                                     ExportTargetingParam $commonConfig, $valueNameMap)
    {
        $writeContent = array();
        $titleArray = self::getTargetingSearchCsvTitle($commonConfig->getDescription(), ExportCsvConstant::TITLE_CLASS_WITHOUT_ID);
        $writeContent[] = $titleArray;

        $totalCount = count($valueNameMap);
        foreach($valueNameMap as $value=>$name)
        {
            $estimateParam = self::builtTargetingEstimate($targetingClass, $commonConfig, $value);
            $estimateEntityArray = AdManagerFacade::getBidEstimateByAccount($commonConfig->getAccountId(), $estimateParam);
            if(false === $estimateEntityArray)
            {
                continue;
            }
            $estimateEntity = $estimateEntityArray[0];

            $exportEntity = self::buildGeneralExportEntity($estimateEntity, $name);
            DailyReachCalculator::calculateDailyReach($exportEntity, $commonConfig->getDailyBudget(),
                $commonConfig->getBidAmount());
            $valueArray = self::getTargetingSearchCsvValue($exportEntity, ExportCsvConstant::TITLE_CLASS_WITHOUT_ID);
            $writeContent[] = $valueArray;

            print_r('Leaving ' . --$totalCount . '......' . PHP_EOL);
        }
        $savePath = self::getOutputFileName($csvPath, $targetingClass[1]);
        FileHelper::saveCsv($savePath, $writeContent);
    }

    private static function buildGeneralExportEntity(ReachEstimateEntity $estimateEntity, $name)
    {
        $exportEntity = new ExportTargetingEntity();
        $exportEntity->setName($name);
        $exportEntity->setAudienceSize($estimateEntity->getUserCount());
        $exportEntity->setTargetingAudienceSize($estimateEntity->getUserCount());
        $exportEntity->setBidMax(round($estimateEntity->getBidMax()/100, 2));
        $exportEntity->setBidMedian(round($estimateEntity->getBidMedian()/100,2));
        $exportEntity->setBidMin(round($estimateEntity->getBidMin()/100, 2));
        $exportEntity->setDau($estimateEntity->getDua());
        $exportEntity->setCpaCurveData($estimateEntity->getCpaCurveData());
        $exportEntity->setCurve($estimateEntity->getCurve());

        return $exportEntity;
    }

    public static function getCommonParamList($commonConfig, $estimateParam)
    {
        $countryCodeList = $commonConfig[ExportCsvConstant::CONFIG_ITEM_NAME_COM_COUNTRY];
        $genderList = $commonConfig[ExportCsvConstant::CONFIG_ITEM_NAME_COM_GENDER];

        $countryParam = self::getCountryParamList($countryCodeList);
        $ageParam = self::getGenderParamList($genderList, $countryParam);

        $paramEntityList = array();

        $accountId = $estimateParam[ExportCsvConstant::CONFIG_ITEM_NAME_ACCOUNT_ID];
        $appUrl = $estimateParam[ExportCsvConstant::CONFIG_ITEM_NAME_APP_URL];
        $dailyBudget = $estimateParam[ExportCsvConstant::CONFIG_ITEM_NAME_DAILY_BUDGET];
        $bidAmount = $estimateParam[ExportCsvConstant::CONFIG_ITEM_NAME_BID_AMOUNT];
        foreach($ageParam as $param)
        {
            $entity = new ExportTargetingParam();
            $entity->setCountryCode($param[ExportCsvConstant::CONFIG_ITEM_NAME_COM_COUNTRY]);
            $entity->setGender($param[ExportCsvConstant::CONFIG_ITEM_NAME_COM_GENDER]);
            $entity->setAccountId($accountId);
            $entity->setAppUrl($appUrl);
            $entity->setDailyBudget($dailyBudget);
            $entity->setBidAmount($bidAmount);
            $paramEntityList[] = $entity;
        }

        return $paramEntityList;
    }

    private static function getGenderParamList($genderList, $countryParam)
    {
        if(empty($genderList))
        {
            return $countryParam;
        }

        $ageParamList = array();
        foreach($countryParam as $param)
        {
            $param[ExportCsvConstant::CONFIG_ITEM_NAME_COM_GENDER] = '';
            foreach($genderList as $gender)
            {
                $ageParam = $param;
                $ageParam[ExportCsvConstant::CONFIG_ITEM_NAME_COM_GENDER] = $gender;
                $ageParamList[] = $ageParam;
            }
        }

        return $ageParamList;
    }

    private static function getCountryParamList($countryCodeList)
    {
        $countryParamList = array();
        foreach($countryCodeList as $countryCode)
        {
            $paramMap = array(
                ExportCsvConstant::CONFIG_ITEM_NAME_COM_COUNTRY => $countryCode,
            );

            $countryParamList[] = $paramMap;
        }

        return $countryParamList;
    }

    private static function getOutputFileName($csvPath, $classFlag)
    {
        return $csvPath. DIRECTORY_SEPARATOR . $classFlag . ExportCsvConstant::CSV_FILE_NAME_CONNECTOR . time() . '.csv';
    }

    private static function getTargetingValue($searchClass, $targetingEntity)
    {
        if($searchClass == TargetingConstants::SEARCH_CLASS_USER_DEVICE)
        {
            return $targetingEntity->getName();
        }
        else
        {
            return $targetingEntity->getId();
        }
    }

    private static function getFirstLevelClass($searchClass)
    {
        if($searchClass == TargetingConstants::SEARCH_CLASS_USER_DEVICE)
        {
            return ExportCsvConstant::CONFIG_ITEM_NAME_PLACEMENT;
        }
        else
        {
            return ExportCsvConstant::CONFIG_ITEM_NAME_FLEXIBLE;
        }
    }

    private static function queryTargetingByParam($searchClass, ExportTargetingParam $paramEntity)
    {
        $targetingArray = TargetingSearchUtil::queryTargetingList($searchClass);
        $totalCount = count($targetingArray);
        $accountId = $paramEntity->getAccountId();
        $exportArray = array();
        foreach($targetingArray as $targetingEntity)
        {
            $targetingValue = self::getTargetingValue($searchClass, $targetingEntity);

            $firstLevel = self::getFirstLevelClass($searchClass);
            $classParam = array($firstLevel, $searchClass);
            $estimateParam = self::builtTargetingEstimate($classParam, $paramEntity, $targetingValue);
            $estimateEntityArray = AdManagerFacade::getBidEstimateByAccount($accountId, $estimateParam);
            if(false === $estimateEntityArray)
            {
                continue;
            }
            $estimateEntity = $estimateEntityArray[0];

            $exportEntity = self::buildExportTargetingEntity($targetingEntity, $estimateEntity, $paramEntity);

            DailyReachCalculator::calculateDailyReach($exportEntity, $paramEntity->getDailyBudget(),
                $paramEntity->getBidAmount());

            $exportArray[] = $exportEntity;

            print_r('Leaving ' . --$totalCount . '......' . PHP_EOL);
        }

        return $exportArray;
    }

    private static function buildExportTargetingEntity(TargetingSearchEntity $searchEntity, ReachEstimateEntity $estimateEntity,
                                                ExportTargetingParam $configEntity)
    {
        $exportEntity = new ExportTargetingEntity();
        $exportEntity->setId($searchEntity->getId());
        $exportEntity->setName($searchEntity->getName());
        $exportEntity->setPath($searchEntity->getPath());
        $exportEntity->setDescription($searchEntity->getDescription());
        $exportEntity->setPlatform($searchEntity->getPlatform());
        $exportEntity->setType($searchEntity->getType());
        $exportEntity->setAudienceSize($searchEntity->getAudienceSize());

        $exportEntity->setTargetingAudienceSize($estimateEntity->getUserCount());
        $exportEntity->setBidMax(round($estimateEntity->getBidMax()/100, 2));
        $exportEntity->setBidMedian(round($estimateEntity->getBidMedian()/100,2));
        $exportEntity->setBidMin(round($estimateEntity->getBidMin()/100, 2));
        $exportEntity->setDau($estimateEntity->getDua());
        $exportEntity->setCpaCurveData($estimateEntity->getCpaCurveData());
        $exportEntity->setCurve($estimateEntity->getCurve());

        $exportEntity->setCountryCode($configEntity->getCountryCode());
        $exportEntity->setGender($configEntity->getGender());

        return $exportEntity;
    }

    private static function builtTargetingEstimate($targetingClassArray, ExportTargetingParam $paramEntity, $targetingValue)
    {
        if(count($targetingClassArray) < 1)
        {
            return array();
        }

        $countryCode = $paramEntity->getCountryCode();
        $gender = $paramEntity->getGender();

        $targetingBuilder = new TargetingBuilder();
        $locationBuilder = new LocationTargetingBuilder();
        $locationBuilder->setCountryArray(array($countryCode));
        $targetingBuilder->setLocationArray($locationBuilder->getOutputField());

        //后续有需要就增加配置项，下面有Device设置需要统一
        if($paramEntity->getIsSetPlacement())
        {
            $placementBuilder = new OsPlacementTargetingBuilder();
            $placementBuilder->setUserOSArray(array(TargetingConstants::USER_OS_ANDROID));
            $placementBuilder->setPublisherPlatFormArray(array(TargetingConstants::PUBLISHER_PLATFORM_FACEBOOK,));
            $placementBuilder->setDevicePlatFormArray(array(TargetingConstants::DEVICE_PLATFORM_MOBILE));
            $placementBuilder->setFacebookPositionArray(array(TargetingConstants::FACEBOOK_POSITION_FEED));
            $targetingBuilder->setOsPlacementArray($placementBuilder->getOutputField());
        }

        $basicBuilder = new BasicTargetingBuilder();
        $basicBuilder->setGenderArray((array)$gender);

        //目前二级目录
        $firstClass = $targetingClassArray[0];
        $secondClass = $targetingClassArray[1];

        if($firstClass == ExportCsvConstant::CONFIG_ITEM_NAME_FLEXIBLE)
        {
            $targetingBuilder->setFlexibleArray(self::getFlexibleArray($secondClass, $targetingValue));
            $targetingBuilder->setBasicArray($basicBuilder->getOutputField());
        }
        else if($firstClass == ExportCsvConstant::CONFIG_ITEM_NAME_BASIC)
        {
            $targetingBuilder->setBasicArray(self::getBasicArray($basicBuilder, $secondClass, $targetingValue));
        }
        else if($firstClass == ExportCsvConstant::CONFIG_ITEM_NAME_PLACEMENT)
        {
            $placementBuilder = new OsPlacementTargetingBuilder();
            $placementBuilder->setUserOSArray(array(TargetingConstants::USER_OS_ANDROID, TargetingConstants::USER_OS_IOS));
            $placementBuilder->setUserDeviceArray((array)$targetingValue);
            $targetingBuilder->setOsPlacementArray($placementBuilder->getOutputField());
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, 'Can not math the first class.');
        }

        $targetingFields = $targetingBuilder->getOutputField();
        $estimateParam = array();
        $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_TARGETING] = $targetingFields;

        if(!empty($paramEntity->getDailyBudget()))
        {
            $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_DAILY_BUDGET] = $paramEntity->getDailyBudget();
        }

        $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_OPTIMIZATION] = AdSetOptimizationGoalValues::APP_INSTALLS;

        if(!empty($paramEntity->getAppUrl()))
        {
            $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_URL] = $paramEntity->getAppUrl();
        }

        $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_CURRENCY] = 'USD';

        return $estimateParam;
    }

    private static function getFlexibleArray($searchClass, $targetingId)
    {
        $flexibleBuilder = new FlexibleTargetingBuilder();

        if(array_key_exists($searchClass, self::$flexibleBuilderMap))
        {
            call_user_func_array(array($flexibleBuilder, self::$flexibleBuilderMap[$searchClass]), array(array($targetingId),));
        }

        return $flexibleBuilder->getOutputField();
    }

    private static function getBasicArray($basicBuilder, $basicClass, $targetingValue)
    {
        if(array_key_exists($basicClass, self::$basicBuilderMap))
        {
            //需要判断后续新增参数是否要转数组
            $valueInput = (array)$targetingValue;
            call_user_func_array(array($basicBuilder, self::$basicBuilderMap[$basicClass]), array($valueInput));
        }

        return $basicBuilder->getOutputField();
    }

    private static function getInterestMaxPath($searchEntities)
    {
        $maxDepth = 0;
        foreach($searchEntities as $entity)
        {
            $currentDepth = 1;
            $pathArray = $entity->getPath();
            if(is_array($pathArray))
            {
                $currentDepth = count($pathArray);
            }

            $maxDepth = max($maxDepth, $currentDepth);
        }

        return $maxDepth;
    }


    private static function getTargetingSearchCsvTitle($titlePostfix, $searchClass = TargetingConstants::SEARCH_CLASS_INTEREST,
                                                      $maxPathDepth = 1, $isWithCountry = true)
    {
        $csvTitle = array();
        $csvKeys = self::getCsvKeys($searchClass, $isWithCountry);

        foreach ($csvKeys as $key)
        {
            $tTitle = self::$csvTitles[$key];
            if($key == self::PROPERTY_PATH)
            {
                $pathArray = self::appendPathTitle($maxPathDepth, $tTitle);
                $csvTitle = array_merge($csvTitle, $pathArray);
            }
            else if(in_array($key, self::$countryFieldList))
            {
                $cAudienceSize = $tTitle . $titlePostfix;
                $csvTitle[] = $cAudienceSize;
            }
            else
            {
                $csvTitle[] = $tTitle;
            }
        }

        return $csvTitle;

    }

    private static function getTargetingSearchCsvValue(ExportTargetingEntity $entity,
                                                      $searchClass = TargetingConstants::SEARCH_CLASS_INTEREST,
                                                      $maxPathDepth = 1, $isWithCountry = true)
    {
        $csvValues = array();
        $csvKeys = self::getCsvKeys($searchClass, $isWithCountry);

        foreach ($csvKeys as $key)
        {
            $method = 'get' . ucfirst($key);
            $tValue = call_user_func_array(array($entity, $method),array());
            if($key == self::PROPERTY_PATH)
            {
                $pathValues = self::appendPathValue($tValue, $maxPathDepth);
                $csvValues = array_merge($csvValues, $pathValues);
            }
            else
            {
                if(is_null($tValue))
                {
                    $csvValues[] = '';
                }
                else
                {
                    $csvValues[] = $tValue;
                }
            }
        }

        return $csvValues;
    }


    private static function appendPathTitle($maxPathDepth, $pathTitle)
    {
        $pathArray = array();
        for($i = 0; $i < $maxPathDepth; ++$i)
        {
            $indexTitle = $pathTitle . $i;
            $pathArray[] = $indexTitle;
        }

        return $pathArray;
    }

    private static function appendPathValue($paths, $maxPathDepth)
    {
        $valuePathArray = array();
        $currentPathDepth = 1;
        if(is_array($paths))
        {
            $currentPathDepth = count($paths);
            for($pathIndex = 0; $pathIndex < $currentPathDepth; ++$pathIndex)
            {
                $valuePathArray[] = $paths[$pathIndex];
            }
        }
        else
        {
            $valuePathArray[] = $paths;
        }

        $nullPathCount = $maxPathDepth - $currentPathDepth;
        for($nullIndex=0; $nullIndex < $nullPathCount; ++$nullIndex)
        {
            $valuePathArray[] = '';
        }

        return $valuePathArray;
    }

    private static function getCsvKeys($searchClass, $isWithPostfix=true)
    {
        $titleKeys = array(
            self::PROPERTY_PATH,
            self::PROPERTY_NAME,
            self::PROPERTY_ID,
            self::PROPERTY_AUDIENCE_SIZE,
        );

        if($searchClass == TargetingConstants::SEARCH_CLASS_USER_OS)
        {
            $titleKeys = array(
                self::PROPERTY_NAME,
                self::PROPERTY_PLATFORM,
                self::PROPERTY_DESCRIPTION,
            );
        }
        else if($searchClass == TargetingConstants::SEARCH_CLASS_USER_DEVICE)
        {
            $titleKeys = array(
                self::PROPERTY_NAME,
                self::PROPERTY_PLATFORM,
                self::PROPERTY_AUDIENCE_SIZE,
                self::PROPERTY_DESCRIPTION,
            );
        }
        else if($searchClass == TargetingConstants::SEARCH_CLASS_DEMOGRAPHIC)
        {
            $titleKeys[] = self::PROPERTY_TYPE;
            $titleKeys[] = self::PROPERTY_DESCRIPTION;
        }
        else if($searchClass == ExportCsvConstant::TITLE_CLASS_WITHOUT_ID)
        {
            $titleKeys = array(self::PROPERTY_NAME);
        }

        if($isWithPostfix)
        {
            $titleKeys[] = self::PROPERTY_COUNTRY_AUDIENCE;
            $titleKeys[] = self::PROPERTY_COUNTRY_BID_MEDIAN;
            $titleKeys[] = self::PROPERTY_COUNTRY_BID_MIN;
            $titleKeys[] = self::PROPERTY_COUNTRY_BID_MAX;
            $titleKeys[] = self::PROPERTY_COUNTRY_DAILY_REACH_MIN;
            $titleKeys[] = self::PROPERTY_COUNTRY_DAILY_REACH_MAX;
        }

        return $titleKeys;
    }

    //常量与类ExportTargetingEntity的属性名一致
    const PROPERTY_ID = 'id';
    const PROPERTY_NAME = 'name';
    const PROPERTY_AUDIENCE_SIZE = 'audienceSize';
    const PROPERTY_PATH = 'path';
    const PROPERTY_DESCRIPTION = 'description';
    const PROPERTY_TYPE = 'type';
    const PROPERTY_PLATFORM = 'platform';
    const PROPERTY_COUNTRY_CODE = 'countryCode';
    const PROPERTY_COUNTRY_AUDIENCE = 'targetingAudienceSize';
    const PROPERTY_COUNTRY_BID_MAX = 'bidMax';
    const PROPERTY_COUNTRY_BID_MEDIAN = 'bidMedian';
    const PROPERTY_COUNTRY_BID_MIN = 'bidMin';
    const PROPERTY_COUNTRY_DAILY_REACH_MIN = 'dailyReachMin';
    const PROPERTY_COUNTRY_DAILY_REACH_MAX = 'dailyReachMax';

    private static $csvTitles = array(
        self::PROPERTY_ID => ExportCsvConstant::CSV_FIELD_NAME_ID,
        self::PROPERTY_NAME => ExportCsvConstant::CSV_FIELD_NAME_NAME,
        self::PROPERTY_AUDIENCE_SIZE => ExportCsvConstant::CSV_FIELD_NAME_AUDIENCE_SIZE,
        self::PROPERTY_PATH => ExportCsvConstant::CSV_FIELD_NAME_PATH,
        self::PROPERTY_DESCRIPTION => ExportCsvConstant::CSV_FIELD_NAME_DESCRIPTION,
        self::PROPERTY_TYPE => ExportCsvConstant::CSV_FIELD_NAME_TYPE,
        self::PROPERTY_PLATFORM => ExportCsvConstant::CSV_FIELD_NAME_PLATFORM,

        self::PROPERTY_COUNTRY_CODE => ExportCsvConstant::CSV_FIELD_NAME_COUNTRY_CODE,
        self::PROPERTY_COUNTRY_AUDIENCE => ExportCsvConstant::CSV_FIELD_NAME_COUNTRY_AUDIENCE_SIZE,

        self::PROPERTY_COUNTRY_BID_MEDIAN => ExportCsvConstant::CSV_FIELD_NAME_COUNTRY_BID_MEDIAN,
        self::PROPERTY_COUNTRY_BID_MIN => ExportCsvConstant::CSV_FIELD_NAME_COUNTRY_BID_MIN,
        self::PROPERTY_COUNTRY_BID_MAX => ExportCsvConstant::CSV_FIELD_NAME_COUNTRY_BID_MAX,
        self::PROPERTY_COUNTRY_DAILY_REACH_MIN => ExportCsvConstant::CSV_FIELD_NAME_COUNTRY_DAILY_REACH_MIN,
        self::PROPERTY_COUNTRY_DAILY_REACH_MAX => ExportCsvConstant::CSV_FIELD_NAME_COUNTRY_DAILY_REACH_MAX,

    );

    private static $flexibleBuilderMap = array(
        TargetingConstants::SEARCH_CLASS_INTEREST => 'setInterestArray',
        TargetingConstants::SEARCH_CLASS_BEHAVIOR => 'setBehaviorArray',
        TargetingConstants::SEARCH_CLASS_LIFE_EVENT => 'setLifeEventArray',
        TargetingConstants::SEARCH_CLASS_INDUSTRY => 'setIndustryArray',
        TargetingConstants::SEARCH_CLASS_POLITICS => 'setPoliticsArray',
        TargetingConstants::SEARCH_CLASS_FAMILY_STATUSES => 'setFamilyStatusArray',
        TargetingConstants::SEARCH_CLASS_HOUSEHOLD_COMPOSITION => 'setHouseholdCompositionArray',
        TargetingConstants::SEARCH_CLASS_GENERATION => 'setGenerationArray',
        TargetingConstants::SEARCH_CLASS_ETHNIC_AFFINITY => 'setEthnicAffinityArray',
        TargetingConstants::P_SEARCH_CLASS_RELATIONSHIP_STATUS => 'setRelationShipArray',
        TargetingConstants::P_SEARCH_CLASS_EDUCATION_STATUS => 'setEducationStatusArray',
    );
    private static $basicBuilderMap = array(
        ExportCsvConstant::CONFIG_ITEM_NAME_LOCALE => 'setLocaleArray',
    );

    public static $relationShipMap = array(
        TargetingConstants::RELATIONSHIP_STATUSE_SINGLE => 'single',
        TargetingConstants::RELATIONSHIP_STATUSE_IN_RELATIONSHIP => 'in_relationship',
        TargetingConstants::RELATIONSHIP_STATUSE_MARRIED => 'married',
        TargetingConstants::RELATIONSHIP_STATUSE_ENGAGED => 'engaged',
        TargetingConstants::RELATIONSHIP_STATUSE_NOT_SPECIFIED => 'not specified',
        TargetingConstants::RELATIONSHIP_STATUSE_CIVILUNION => 'in a civil union',
        TargetingConstants::RELATIONSHIP_STATUSE_DOMESTIC_PARTNERSHIP => 'in a domestic partnership',
        TargetingConstants::RELATIONSHIP_STATUSE_OPEN_RELATIONSHIP => 'In an open relationship',
        TargetingConstants::RELATIONSHIP_STATUSE_COMPLICATED => 'Its complicated',
        TargetingConstants::RELATIONSHIP_STATUSE_SEPARATED => 'Separated',
        TargetingConstants::RELATIONSHIP_STATUSE_DIVORCED => 'Divorced',
        TargetingConstants::RELATIONSHIP_STATUSE_WIDOWED => 'Widowed',
    );

    public static $educationStatusMap = array(
        TargetingConstants::EDUCATION_STATUSES_HIGH_SCHOOL => 'HIGH_SCHOOL',
        TargetingConstants::EDUCATION_STATUSES_UNDERGRAD => 'UNDERGRAD',
        TargetingConstants::EDUCATION_STATUSES_ALUM => 'ALUM',
        TargetingConstants::EDUCATION_STATUSES_HIGH_SCHOOL_GRAD => 'HIGH_SCHOOL_GRAD',
        TargetingConstants::EDUCATION_STATUSES_SOME_COLLEGE => 'SOME_COLLEGE',
        TargetingConstants::EDUCATION_STATUSES_ASSOCIATE_DEGREE => 'ASSOCIATE_DEGREE',
        TargetingConstants::EDUCATION_STATUSES_IN_GRAD_SCHOOL => 'IN_GRAD_SCHOOL',
        TargetingConstants::EDUCATION_STATUSES_SOME_GRAD_SCHOOL => 'SOME_GRAD_SCHOOL',
        TargetingConstants::EDUCATION_STATUSES_MASTER_DEGREE => 'MASTER_DEGREE',
        TargetingConstants::EDUCATION_STATUSES_PROFESSIONAL_DEGREE => 'PROFESSIONAL_DEGREE',
        TargetingConstants::EDUCATION_STATUSES_DOCTORATE_DEGREE => 'DOCTORATE_DEGREE',
        TargetingConstants::EDUCATION_STATUSES_UNSPECIFIED => 'UNSPECIFIED',
        TargetingConstants::EDUCATION_STATUSES_SOME_HIGH_SCHOOL => 'SOME_HIGH_SCHOOL',
    );

    public static $countryFieldList = array(
        self::PROPERTY_COUNTRY_AUDIENCE,
        self::PROPERTY_COUNTRY_BID_MEDIAN,
        self::PROPERTY_COUNTRY_BID_MIN,
        self::PROPERTY_COUNTRY_BID_MAX,
        self::PROPERTY_COUNTRY_DAILY_REACH_MIN,
        self::PROPERTY_COUNTRY_DAILY_REACH_MAX,
    );

}