
from ConstPromotion import *
from FBAppInstallPromotion import *

class PromotionFactory(object):
    @staticmethod
    def createPromotion(promotionInfo):
        if promotionInfo.publisher == PublisherType.FB:
            if promotionInfo.campaignType == CampaignType.AppInstall:
                return FBAppInstallPromotion(promotionInfo)
            elif promotionInfo.campaignType == CampaignType.LinkClick:
                pass
            elif promotionInfo.campaignType == CampaignType.AppUse:
                pass