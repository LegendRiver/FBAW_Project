<?php
require_once(EL_PROJECT_PATH . 'sdk/google/vendor/autoload.php');

if(!class_exists('AWCommonConstants'))
{
    require_once(EL_AWINTERFACE_PATH . 'constants/AWCommonConstants.php');
}
if(!class_exists('AccountFieldConstants'))
{
    require_once(EL_AWINTERFACE_PATH . 'constants/fieldConstants/AccountFieldConstants.php');
}
if(!class_exists('CampaignFieldConstants'))
{
    require_once(EL_AWINTERFACE_PATH . 'constants/fieldConstants/CampaignFieldConstants.php');
}
if(!class_exists('BudgetFieldConstants'))
{
    require_once(EL_AWINTERFACE_PATH . 'constants/fieldConstants/BudgetFieldConstants.php');
}
if(!class_exists('ImageFieldConstants'))
{
    require_once(EL_AWINTERFACE_PATH . 'constants/fieldConstants/ImageFieldConstants.php');
}
if(!class_exists('VideoFieldConstants'))
{
    require_once(EL_AWINTERFACE_PATH . 'constants/fieldConstants/VideoFieldConstants.php');
}

if(!class_exists('AWCampaignValues'))
{
    require_once(EL_AWINTERFACE_PATH . 'constants/AWCampaignValues.php');
}

if(!class_exists('SelectorBuilder'))
{
    require_once(EL_AWINTERFACE_PATH . 'builder/SelectorBuilder.php');
}

if(!class_exists('AWManagerFacade'))
{
    require_once(EL_AWINTERFACE_PATH . 'facade/AWManagerFacade.php');
}

if(!class_exists('AWAccountEntity'))
{
    require_once(EL_AWINTERFACE_PATH . 'entity/AWAccountEntity.php');
}
if(!class_exists('AWCampaignEntity'))
{
    require_once(EL_AWINTERFACE_PATH . 'entity/AWCampaignEntity.php');
}
if(!class_exists('AWCampaignParam'))
{
    require_once(EL_AWINTERFACE_PATH . 'entity/AWCampaignParam.php');
}
if(!class_exists('UACCampaignParam'))
{
    require_once(EL_AWINTERFACE_PATH . 'entity/UACCampaignParam.php');
}
if(!class_exists('LocationCriteriaEntity'))
{
    require_once(EL_AWINTERFACE_PATH . 'entity/LocationCriteriaEntity.php');
}
if(!class_exists('AWImageEntity'))
{
    require_once(EL_AWINTERFACE_PATH . 'entity/AWImageEntity.php');
}

if(!class_exists('ApiConfManager'))
{
    require_once(EL_AWINTERFACE_PATH . 'common/ApiConfManager.php');
}
if(!class_exists('AWServiceManager'))
{
    require_once(EL_AWINTERFACE_PATH . 'common/AWServiceManager.php');
}
if(!class_exists('SessionCredentialManager'))
{
    require_once(EL_AWINTERFACE_PATH . 'common/SessionCredentialManager.php');
}

if(!class_exists('AbstractAWManager'))
{
    require_once(EL_AWINTERFACE_PATH . 'manager/AbstractAWManager.php');
}
if(!class_exists('AWAccountManager'))
{
    require_once(EL_AWINTERFACE_PATH . 'manager/AWAccountManager.php');
}
if(!class_exists('AWCampaignManager'))
{
    require_once(EL_AWINTERFACE_PATH . 'manager/AWCampaignManager.php');
}
if(!class_exists('AWBudgetManager'))
{
    require_once(EL_AWINTERFACE_PATH . 'manager/AWBudgetManager.php');
}
if(!class_exists('AWBidStrategyManager'))
{
    require_once(EL_AWINTERFACE_PATH . 'manager/AWBidStrategyManager.php');
}
if(!class_exists('AWBidStrategyManager'))
{
    require_once(EL_AWINTERFACE_PATH . 'manager/AWBidStrategyManager.php');
}
if(!class_exists('AWLocationManager'))
{
    require_once(EL_AWINTERFACE_PATH . 'manager/AWLocationManager.php');
}
if(!class_exists('AWConstantDataManager'))
{
    require_once(EL_AWINTERFACE_PATH . 'manager/AWConstantDataManager.php');
}
if(!class_exists('AWMediaManager'))
{
    require_once(EL_AWINTERFACE_PATH . 'manager/AWMediaManager.php');
}
if(!class_exists('AWReportManager'))
{
    require_once(EL_AWINTERFACE_PATH . 'manager/AWReportManager.php');
}

if(!class_exists('CampaignSettingFactory'))
{
    require_once(EL_AWINTERFACE_PATH . 'factory/CampaignSettingFactory.php');
}
if(!class_exists('CampaignCriteriaFactory'))
{
    require_once(EL_AWINTERFACE_PATH . 'factory/CampaignCriteriaFactory.php');
}

