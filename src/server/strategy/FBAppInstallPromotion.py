from FBAppPromotion import *
from AppCrawler.AppInfo import AppInfo
from AppCrawler.AppCrawlerFactory import AppCrawlerFactory
from AppCrawler.AppleStoreCrawler import AppleStoreCrawler
from AppCrawler.GooglePlayCrawler import GooglePlayCrawler
from Config import *
from ConstPromotion import *

class FBAppInstallPromotion(FBAppPromotion):
    def __init__(self, promotionInfo):
        super(FBAppInstallPromotion, self).__init__(promotionInfo)

    def validateLen(self, s, lenLimit, postfix = "", appendDots = False):
        if len(s + postfix) <= lenLimit:
            return s + postfix
        else:            
            postfixAll = ('...' if appendDots else '') + postfix 
            lenLimit = lenLimit - len(postfixAll)
            return s[0 : s[0:lenLimit].rfind(' ')].strip() + postfixAll

    def addTitle(self, titles, t, postfix = ""):
        titles.append(self.validateLen(t, AdsLimit.maxFBAdTitleLen, postfix))

    def addMessage(self, messages, m, postfix = ""):
        messages.append(self.validateLen(m, AdsLimit.maxFBAdMessageLen, postfix, True))

    def getTitles(self):
        titles = []
        self.addTitle(titles, self.app.title)
        
        if self.isGame:
            self.addTitle(titles, titles[0], ConstStr.titleGreatGame)
        else:
            self.addTitle(titles, titles[0], ConstStr.titleGreatApp)

        if self.isFree:
            self.addTitle(titles, titles[0], ConstStr.titleFree)
        else:
            self.addTitle(titles, titles[0], ConstStr.titlePrice + ' ' + str(self.app.price))

        return list(set(titles))

    def getMessages(self):
        messages = []
        message = self.app.description.replace('\n', ' ').replace('\t', ' ')
        self.addMessage(messages, message)

        if self.isGame:
            self.addMessage(messages, messages[0], ConstStr.messageSuperFun)
        else:
            self.addMessage(messages, messages[0], ConstStr.messageMustHave)

        return list(set(messages))

    # return one adset for each targeting, one adset for all ads, one adset for each bid setting
    def getAdsetsForTargetingsAndAds(self, targetings, ads, creatives):
        adsets = []
        singleTargeting = self.getTargetingByType(targetings, self.genders[0], self.locales[0], [self.promotionInfo.countries[0]])
        singleAd = self.getAdByCreativeType(creatives, CallToActionType.InstallMobileApp, AdFormatType.Carousel)

        budgetTypes = [BudgetType.Daily] #, BudgetType.Schedule]
        scheduleTypes = [ScheduleType.AllTime]

        # one adset for EACH targeting
        optimizationGoals = [self.promotionInfo.optimizationGoals[0]]
        billEventsPerGoal = {optimizationGoals[0]: [BillEventType.Impression]}
        bids = [self.promotionInfo.suggestedBid * 0.7]
        adsets += self.getAdsetPermutations(targetings, budgetTypes, scheduleTypes, optimizationGoals, billEventsPerGoal, bids, singleAd)

        # one adset for ALL ads
        budgetAmount = 10000  #TODO: get it from parameters
        adsets += self.getAdsetPermutations(singleTargeting, budgetTypes, scheduleTypes, optimizationGoals, billEventsPerGoal, bids, ads, budgetAmount)

        # one adset for EACH bid setting
        optimizationGoals = self.promotionInfo.optimizationGoals
        billEventsPerGoal = {opt: BillEventTypesPerOptimizationGoal[opt] for opt in optimizationGoals}
        allbids = self.getBids()
        adsets += self.getAdsetPermutations(singleTargeting, budgetTypes, scheduleTypes, optimizationGoals, billEventsPerGoal, allbids, singleAd)
        return adsets

    def promote(self):
        self.getAppInfo()

        # creatives and ads
        creatives = self.getCreativePermutations(self.getTitles(), self.getMessages(), self.app.imagePaths, ConstStr.fbPageId, 
            [CallToActionType.InstallMobileApp, CallToActionType.Download], 
            [AdFormatType.Image, AdFormatType.Carousel, AdFormatType.Slideshow], 
            [""])   # empty description for app, cannot overwrite FB's default description
        ads = self.getAdsPerCreatives(creatives)

        # targetings
        targetings = self.getTargetings()

        # adsets
        adsets = self.getAdsetsForTargetingsAndAds(targetings, ads, creatives)

        # campaign
        promotionInfo = self.promotionInfo
        name = self.validateLen(self.app.title, AdsLimit.maxFBAdTitleLen) + ';' + promotionInfo.publisher + ';' + promotionInfo.campaignType
        campaign = FBCampaign(name, promotionInfo.adAccountId, AdOperation.New, promotionInfo.campaignSpendCap, promotionInfo.campaignType, adsets, creatives)
    
        self.setPromoteResult(campaign)
        
