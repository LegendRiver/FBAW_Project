import sys
import urllib2
import json
from urlparse import urlparse
from AppInfo import *
from AppCrawler import *

class AppleStoreCrawler(AppCrawler):

    def __init__(self, appUrl):
        super(AppleStoreCrawler, self).__init__(appUrl)

    def extractAppId(self):
        r = urlparse(self.appUrl) 
        strId = r.path.split("/")[-1] # r.path example: '/us/app/solitaire/id1100578622'
        
        s = strId.find("id") + len("id")
        e = s + 1
        while e < len(strId) and strId[e].isdigit():
            e += 1
        return strId[s:e]

    def crawl(self):
        # example:
        # appUrl = "https://itunes.apple.com/us/app/ff/id927819872#?mt=8"
        # urlSearch = "https://itunes.apple.com/lookup?id=927819872"        
        urlSearch = "https://itunes.apple.com/lookup?id=" + self.extractAppId()
        #print(urlSearch)

        appStr = urllib2.urlopen(urlSearch).read()
        # print appStr
        app = json.loads(appStr)
        if app["resultCount"] == 1:
            appFields = app["results"][0]  
            title = self.getAppField(appFields, "trackName")
            description = self.getAppField(appFields, "description")
            imagePaths = self.getAppField(appFields, "screenshotUrls", [])
            genre = self.getAppField(appFields, "primaryGenreName")
            price = self.getAppField(appFields, "price")
            rating = self.getAppField(appFields, "averageUserRating")
            minimumOsVersion = self.getAppField(appFields, "minimumOsVersion")
            releaseDate = self.getAppField(appFields, "currentVersionReleaseDate")
            supportedDevices = self.getAppField(appFields, "supportedDevices", [])
            genreDetails = self.getAppField(appFields, "genres", [])  # example: ["Games", "Card", "Entertainment", "Puzzle"]
            self.appInfo = AppInfo(title, description, imagePaths, genre, price, rating, "iOS", minimumOsVersion,
                releaseDate, supportedDevices, genreDetails)
        else:
            raise Exception("Apple store resultCount is " + app["resultCount"] + ": " + appStr)
