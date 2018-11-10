from ConstPromotion import *

class ConstStr:    
    fbPageId = "316660178725422"  # "TestApp Community" on business manager

    titleGreatGame =  " - Great Game"
    titleGreatApp = " - Great App"
    titleFree = " - FREE"
    titlePrice = " - Just "

    messageSuperFun =  " *Super fun*"
    messageMustHave = " *Must Have*"

class ConstValue:
    maxCreativesOfSingleImage = 3
    maxCountryGroups = 3
    daysToRunCampaign = 30
    bidDiscounts = [0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0]   # 0 means auto bidding, ohters mean manual bidding

class AdsLimit:
    maxFBAdTitleLen = 25
    maxFBAdMessageLen = 90
    maxImagesNumOfSlideshow = 7
    maxImagesNumOfCarousel = 10

MaxImagesNumPerAdFormat = {
    AdFormatType.Slideshow: AdsLimit.maxImagesNumOfSlideshow,
    AdFormatType.Carousel: AdsLimit.maxImagesNumOfCarousel
}

MinDailyBudgetPerBillEvent = {
    # US cents
    BillEventType.Impression: 500,
    BillEventType.AppInstall: 4000,
    BillEventType.LinkClick: 4000
}

OptimizationGoalsPerCampaignType = {
    CampaignType.AppInstall: [OptimizationGoalType.AppInstall, OptimizationGoalType.LinkClick]
}


BillEventTypesPerOptimizationGoal = {
    OptimizationGoalType.AppInstall: [BillEventType.Impression, BillEventType.AppInstall],
    OptimizationGoalType.LinkClick: [BillEventType.Impression, BillEventType.LinkClick]    
}
