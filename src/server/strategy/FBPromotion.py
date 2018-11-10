
from Promotion import *
from ConstPromotion import *
from Config import *
from FBAdObjects import *
import time
import datetime
import sys
import random
import abc

class FBPromotion(Promotion):
    def __init__(self, promotionInfo):
        super(FBPromotion, self).__init__(promotionInfo)
        if not self.promotionInfo.bidDiscounts:
            self.promotionInfo.bidDiscounts = ConstValue.bidDiscounts

    @abc.abstractmethod
    def promote(self):
        pass

    def getImagePathsForAdFormat(paths, adFormat):
        for k, v in MaxImagesNumPerAdFormat.items():
            if adFormat == k and len(paths) > v:
                return paths[0:v]
        return paths

    def getCreativeNameAndId(self, title, adFormat):
        pseudoId = random.randint(1, sys.maxint)
        name = title.split(' ')[0] + ';' + adFormat + ';' + str(pseudoId)
        return pseudoId, name

    def getCreativePermutations(self, titles, messages, imagePaths, pageId, callToActionTypes, adFormats, descriptions):
        creatives = []
        for title in titles:
            for message in messages:
                for desc in descriptions:
                    for callToActionType in callToActionTypes:
                        for adFormat in adFormats:                            
                            if adFormat == AdFormatType.Image:
                                for i in range(min(len(imagePaths), ConstValue.maxCreativesOfSingleImage)):
                                    pseudoId, name = self.getCreativeNameAndId(title, adFormat)
                                    creatives.append(FBCreative(name, pseudoId, title, message, imagePaths[i], self.promotionInfo.url, pageId, callToActionType, adFormat, desc))
                            elif len(imagePaths) > 1 and \
                                (adFormat == AdFormatType.Slideshow or adFormat == AdFormatType.Carousel):
                                pseudoId, name = self.getCreativeNameAndId(title, adFormat)
                                creatives.append(FBCreative(name, pseudoId, title, message, imagePaths, self.promotionInfo.url, pageId, callToActionType, adFormat, desc))
                            # elif adFormat == AdFormatType.Video:
                            #     creatives.append()
        return creatives

    def getAdByCreativeType(self, creatives, callToActionType, adFormat):
        for c in creatives:
            if c.callToActionType == callToActionType and c.adFormat == adFormat:
                return [FBAd(c.name, creativePseudoId = c.pseudoId)]
        return []

    def getAdsPerCreatives(self, creatives):
        ads = []
        for c in creatives:
            ads.append(FBAd(c.name, creativePseudoId = c.pseudoId))
        return ads

    def getCountryGroups(self):
        countryGroups = []
        groupNum = min(ConstValue.maxCountryGroups, len(self.promotionInfo.countries))
        for i in range(groupNum):
            if i < ConstValue.maxCountryGroups - 1:
                countryGroups.append([self.promotionInfo.countries[i]]) # one country in a group
            else:
                countryGroups.append(self.promotionInfo.countries[i:])  # all remaining countries in the last group
        return countryGroups

    def getTargetingPermutations(self, genders, ages, locales, countryGroups, interests, userOs, devicePlatforms, publisherPlatforms, positions):
        targetings = []
        for gender in genders:
            for age in ages:
                for locale in locales:
                    for country in countryGroups:
                        for interest in interests:
                            for device in devicePlatforms:
                                for pub in publisherPlatforms:
                                    for pos in positions:
                                        targetings.append(FBTargeting(gender, age[0], age[1], locale, country, interest, userOs, device, pub, pos))
        return targetings

    def getTargetingByType(self, targetings, gender, locales, countries):
        for t in targetings:
            if t.gender == gender and t.locales == locales and t.countries == countries:
                return [t]
        return []

    def getBids(self):        
        return [d * self.promotionInfo.suggestedBid for d in  self.promotionInfo.bidDiscounts]

    def getAdsetName(self, targeting, bid, optimizationGoal, billEvent):
        return targeting.gender[0] + ';' + str(targeting.ageMin) + '-' + str(targeting.ageMax) + ';' + targeting.locales[0][0:3] + ';' + \
            targeting.countries[0][0:4] + ';' + targeting.publisherPlatforms[0][0:6] + ';' + optimizationGoal[0:5] + ';' + \
            billEvent[0:5] + ';' + 'B' + str(bid)
        
    def getBudgetAmount(self, billEvent):
        # TODO: adjust min budget, check promotionInfo.campaignSpendCap and budgetAmount
        minBudget = MinDailyBudgetPerBillEvent[billEvent]
        return minBudget

    # budgetAmount = 0 means using default budgetAmount getBudgetAmount()
    def getAdsetPermutations(self, targetings, budgetTypes, scheduleTypes, optimizationGoals, billEventsPerGoal, bids, ads, budgetAmount = 0):
        adsets = []

        timeStart = self.promotionInfo.timeStart
        timeEnd = self.promotionInfo.timeEnd

        for budgetType in budgetTypes:
            for scheduleType in scheduleTypes:
                for goal in optimizationGoals:
                    for billEvent in billEventsPerGoal[goal]:
                        for targeting in targetings:
                            for bid in bids:
                                name = self.getAdsetName(targeting, bid, goal, billEvent)
                                budgetAmountAdset = self.getBudgetAmount(billEvent) if budgetAmount == 0 else budgetAmount
                                adsets.append(FBAdset(name, AdOperation.New, targeting, budgetType, scheduleType, 
                                    timeStart, timeEnd, budgetAmountAdset, goal, billEvent, bid, self.promotionInfo.url, ads))
        return adsets
        

