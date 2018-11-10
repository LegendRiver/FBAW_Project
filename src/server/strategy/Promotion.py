
from FBAdObjects import *
from ConstPromotion import *
import abc
import json
import jsonpickle


class PromotionInfo(object):
    def __init__(self, url, publisher, campaignType, adAccountId, configId, adOperation, campaignSpendCap, 
        suggestedBid, timeStart, timeEnd = None, countries = None, optimizationGoals = None, bidDiscounts = None):
        self.url = url
        self.publisher = publisher
        self.campaignType = campaignType
        self.adAccountId = adAccountId
        self.configId = configId
        self.adOperation = adOperation
        self.campaignSpendCap = campaignSpendCap
        self.suggestedBid =  suggestedBid
        self.timeStart = timeStart
        self.timeEnd = timeEnd
        self.countries = countries
        self.optimizationGoals = optimizationGoals
        self.bidDiscounts = bidDiscounts

        if not self.timeEnd:
            self.timeEnd = (timeStart + datetime.timedelta(days = ConstValue.daysToRunCampaign)).strftime("%Y-%m-%d %H:%M")

        if not self.optimizationGoals:
            self.optimizationGoals = OptimizationGoalsPerCampaignType[self.campaignType]

class Promotion(object):        
    def __init__(self, promotionInfo):
        self.promotionInfo = promotionInfo
        self.promotionResult = None

    @abc.abstractmethod  
    def promote(self):      
        pass 

    def getPromoteResult(self):
        return self.promotionResult

    def setPromoteResult(self, campaign):
        self.promotionResult = json.dumps(json.loads(jsonpickle.encode(campaign, unpicklable=False)), indent=4, sort_keys=True)

