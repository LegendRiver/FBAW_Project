<?php

//SDK
require_once(EL_PROJECT_PATH . 'sdk/facebook/vendor/autoload.php');

if(!class_exists('FBAPIConfConstants'))
{
    require_once(EL_FBINTERFACE_PATH . 'constant/FBAPIConfConstants.php');
}
if(!class_exists('FBAPIManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'common/FBAPIManager.php');
}

require_once(EL_FBINTERFACE_PATH . 'constant/APIConstants.php');
require_once(EL_FBINTERFACE_PATH . 'common/APIInit.php');

//common
require_once(EL_FBINTERFACE_PATH . 'util/AdUserAccountUtil.php');
require_once(EL_FBINTERFACE_PATH . 'constant/AdManageConstants.php');
require_once(EL_FBINTERFACE_PATH . 'builder/IFieldBuilder.php');
require_once(EL_FBINTERFACE_PATH . 'constant/TargetingConstants.php');
require_once(EL_FBINTERFACE_PATH . 'constant/ReachFrequencyConstants.php');
require_once(EL_FBINTERFACE_PATH . 'util/TargetingUtil.php');
require_once(EL_FBINTERFACE_PATH . 'util/TargetingSearchUtil.php');
require_once(EL_FBINTERFACE_PATH . 'util/CampaignUtil.php');
require_once(EL_FBINTERFACE_PATH . 'util/AdSetUtil.php');
require_once(EL_FBINTERFACE_PATH . 'util/CreativeUtil.php');
require_once(EL_FBINTERFACE_PATH . 'util/AdUtil.php');
require_once(EL_FBINTERFACE_PATH . 'util/APIRequestUtil.php');

if(!class_exists('InsightExporterConstants'))
{
    require_once(EL_FBINTERFACE_PATH . 'constant/InsightExporterConstants.php');
}

//manager
if(!class_exists('AdUserManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/AdUserManager.php');
}
if(!class_exists('AdAccountManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/AdAccountManager.php');
}
if(!class_exists('AdCampaignManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/AdCampaignManager.php');
}
if(!class_exists('AdSetManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/AdSetManager.php');
}
if(!class_exists('AdImageManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/AdImageManager.php');
}
if(!class_exists('AdCreativeManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/AdCreativeManager.php');
}
if(!class_exists('AdManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/AdManager.php');
}
if(!class_exists('AdInsightManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/AdInsightManager.php');
}
if(!class_exists('AdVideoManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/AdVideoManager.php');
}
if(!class_exists('ProductCatalogManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/ProductCatalogManager.php');
}
if(!class_exists('BusinessManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/BusinessManager.php');
}
if(!class_exists('PageManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/PageManager.php');
}
if(!class_exists('EliAdAccount'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/EliAdAccount.php');
}
if(!class_exists('EliAdSet'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/EliAdSet.php');
}
if(!class_exists('EliImage'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/EliImage.php');
}
if(!class_exists('UploadMaterialManager'))
{
    require_once(EL_FBINTERFACE_PATH . 'manager/UploadMaterialManager.php');
}


if(!class_exists('InsightValueReader'))
{
    require_once(EL_FBINTERFACE_PATH . 'common/InsightValueReader.php');
}


//entity
if(!class_exists('AdUserEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/AdUserEntity.php');
}
if(!class_exists('AdAccountEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/AdAccountEntity.php');
}
if(!class_exists('CampaignEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/CampaignEntity.php');
}
if(!class_exists('TargetingSearchEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/TargetingSearchEntity.php');
}
if(!class_exists('ApplicationEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/ApplicationEntity.php');
}
if(!class_exists('AdSetEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/AdsetEntity.php');
}
if(!class_exists('AdImageEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/AdImageEntity.php');
}
if(!class_exists('AdCreativeEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/AdCreativeEntity.php');
}
if(!class_exists('AdEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/AdEntity.php');
}
if(!class_exists('InsightEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/InsightEntity.php');
}
if(!class_exists('AdVideoEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/AdVideoEntity.php');
}
if(!class_exists('CountrySearchEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/CountrySearchEntity.php');
}
if(!class_exists('ReachEstimateEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/ReachEstimateEntity.php');
}
if(!class_exists('TargetingFieldsEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/TargetingFieldsEntity.php');
}
if(!class_exists('ReachFrequencyEntity'))
{
    require_once(EL_FBINTERFACE_PATH . 'entity/ReachFrequencyEntity.php');
}

//builder
if(!class_exists('CampaignFieldBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/CampaignFieldBuilder.php');
}
if(!class_exists('LocationTargetingBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/LocationTargetingBuilder.php');
}
if(!class_exists('OsPlacementTargetingBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/OsPlacementTargetingBuilder.php');
}
if(!class_exists('BasicTargetingBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/BasicTargetingBuilder.php');
}
if(!class_exists('FlexibleTargetingBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/FlexibleTargetingBuilder.php');
}
if(!class_exists('TargetingBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/TargetingBuilder.php');
}
if(!class_exists('ScheduleBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/ScheduleBuilder.php');
}
if(!class_exists('BidBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/BidBuilder.php');
}
if(!class_exists('AppInstallObjectBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/AppInstallObjectBuilder.php');
}
if(!class_exists('AdSetFieldBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/AdSetFieldBuilder.php');
}
if(!class_exists('CallToActionBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/CallToActionBuilder.php');
}
if(!class_exists('CreativeLinkDataBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/CreativeLinkDataBuilder.php');
}
if(!class_exists('CreativeFieldBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/CreativeFieldBuilder.php');
}
if(!class_exists('AdFieldBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/AdFieldBuilder.php');
}
if(!class_exists('AttachmentFieldBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/AttachmentFieldBuilder.php');
}
if(!class_exists('AdVideoFieldBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/AdVideoFieldBuilder.php');
}
if(!class_exists('CreativeVideoDataBuilder'))
{
    require_once(EL_FBINTERFACE_PATH . 'builder/CreativeVideoDataBuilder.php');
}



//param
if(!class_exists('CampaignCreateParam'))
{
    require_once(EL_FBINTERFACE_PATH . 'param/CampaignCreateParam.php');
}
if(!class_exists('AdsetCreateParam'))
{
    require_once(EL_FBINTERFACE_PATH . 'param/AdsetCreateParam.php');
}
if(!class_exists('AdCreativeParam'))
{
    require_once(EL_FBINTERFACE_PATH . 'param/AdCreativeParam.php');
}
if(!class_exists('AdCreateParam'))
{
    require_once(EL_FBINTERFACE_PATH . 'param/AdCreateParam.php');
}
if(!class_exists('AdVideoParam'))
{
    require_once(EL_FBINTERFACE_PATH . 'param/AdVideoParam.php');
}

if(!class_exists('AbstractBDInsightExporter'))
{
    require_once(EL_FBINTERFACE_PATH . 'business/AbstractBDInsightExporter.php');
}
if(!class_exists('CountryBDInsightExporter'))
{
    require_once(EL_FBINTERFACE_PATH . 'business/CountryBDInsightExporter.php');
}

//interface
if(!class_exists('AdManagerFacade'))
{
    require_once(EL_FBINTERFACE_PATH . 'facade/AdManagerFacade.php');
}




//初始化API
APIInit::init();
