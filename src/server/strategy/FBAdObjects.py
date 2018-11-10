

class FBCreative(object):
    def __init__(self, name, pseudoId, title, message, imagePaths, linkUrl, pageId, callToActionType, adFormat, description = ""):
        self.name = name
        self.pseudoId = pseudoId
        self.title = title
        self.message = message
        self.description = description  # Only visible in link click ads (not app ads)
        self.imagePaths = imagePaths
        self.linkUrl = linkUrl
        self.pageId = pageId
        self.callToActionType = callToActionType
        self.adFormat = adFormat
        # TODO: add carousel

class FBAd(object):
    def __init__(self, name, adsetId = "", creativeId = "", creativePseudoId = ""):
        self.name = name
        self.adsetId = adsetId  # can be empty ""
        self.creativeId = creativeId
        self.creativePseudoId = creativePseudoId

class FBTargeting(object):
    def __init__(self, gender, ageMin, ageMax, locales, countries, interest, userOSs, devicePlatforms, publisherPlatforms, positions):
        self.gender = gender
        self.ageMin = ageMin
        self.ageMax = ageMax
        self.locales = locales
        self.countries = countries
        self.interest = interest
        self.userOSs = userOSs
        self.devicePlatforms = devicePlatforms
        self.publisherPlatforms = publisherPlatforms
        self.positions = positions

class FBAdset(object):
    def __init__(self, name, adOperation, targeting, budgetType, scheduleType, timeStart, timeEnd, budgetAmount, 
        optimizationGoal, billEvent, bidAmount, appStoreUrl, ads, campaignId = "", adsetId = ""):
        self.name = name
        self.campaignId = campaignId    # can be empty ""
        self.adsetId = adsetId      # can be empty ""
        self.adOperation = adOperation
        self.targeting = targeting
        self.budgetType = budgetType
        self.scheduleType = scheduleType
        self.timeStart = timeStart
        self.timeEnd = timeEnd
        self.budgetAmount = budgetAmount
        self.optimizationGoal = optimizationGoal
        self.billEvent = billEvent
        self.bidAmount = bidAmount
        self.appStoreUrl = appStoreUrl
        self.ads = ads

class FBCampaign():
    def __init__(self, name, adAccountId, adOperation, campaignSpendCap, campaignType, adsets, creatives, campaignId = ""):
        self.name = name
        self.adAccountId = adAccountId
        self.campaignId = campaignId    # can be empty ""
        self.adOperation = adOperation
        self.campaignSpendCap = campaignSpendCap
        self.campaignType = campaignType 
        self.adsets = adsets 
        self.creatives = creatives

