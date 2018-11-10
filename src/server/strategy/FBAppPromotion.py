from FBPromotion import *
from ConstPromotion import *
from AppCrawler.AppCrawlerFactory import AppCrawlerFactory
import abc

class FBAppPromotion(FBPromotion):
    def __init__(self, promotionInfo):
        super(FBAppPromotion, self).__init__(promotionInfo)
        self.app = None
        self.isGame = False
        self.isFree = False
        self.genders = [Gender.All, Gender.Male, Gender.Female]
        self.ages = [[13,25], [26, 40], [41, 65]]
        self.locales = [["English (All)"]] # , ""]         
        self.interests = [""]    # TODO: 
        self.devicePlatforms = [[DevicePlatform.Mobile]]
        self.publisherPlatforms = [[PublisherType.FB], [PublisherType.FBAudienceNetwork, PublisherType.FB]]
        self.positions = [[AdPosition.Feed]]

    @abc.abstractmethod
    def promote(self):
        pass

    def getAppInfo(self):
        self.app = AppCrawlerFactory.createAppCrawler(self.promotionInfo.url).getAppInfo()
        self.isGame = self.app.genre.find("game") >= 0
        self.isFree = self.app.price == 0

    def getUserOs(self):
        if not self.app.minimumOsVersion:
            return [self.app.os + "_ver_" + self.app.minimumOsVersion + "_and_above"]
        else:
            return [self.app.os]

    def getTargetings(self):
        countryGroups = self.getCountryGroups()
        userOs = self.getUserOs()

        return self.getTargetingPermutations(self.genders, self.ages, self.locales, countryGroups, 
            self.interests, userOs, self.devicePlatforms, self.publisherPlatforms, self.positions)

















    
