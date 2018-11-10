from Naked.toolshed.shell import execute_js, muterun_js
import os
import json
from urlparse import urlparse
from AppInfo import AppInfo
from AppCrawler import *

class GooglePlayCrawler(AppCrawler):

    def __init__(self, appUrl):
        super(GooglePlayCrawler, self).__init__(appUrl)

    def extractAppId(self):
        r = urlparse(self.appUrl) 
        
        for s in r.query.split("&"):     # r.query example: 'id=com.dxco.pandavszombies&hl=en'
            if s.startswith("id="):
                return s[len("id="):]
        return ""

    def crawl(self):
        # appUrl = https://play.google.com/store/apps/details?id=com.surpax.ledflashlight.panel
        # extractAppId() returns 'com.surpax.ledflashlight.panel'
        #js = os.path.join(os.path.dirname(__file__), "GooglePlayCrawler.js")
        js = "GooglePlayCrawler.js"
        response = muterun_js(js, self.extractAppId())    #execute_js does not return response

        if response.exitcode == 0:
            # the command was successful (returned 0 exit code)            
            appFields = json.loads(response.stdout)            

            title = self.getAppField(appFields, "title")
            description = self.getAppField(appFields, "summary")
            imagePaths = map(lambda u: ("http:" + u) if u.startswith("//") else u, self.getAppField(appFields, "screenshots", [])) # add "http:"
            genre = self.getAppField(appFields, "genre")
            price = self.getAppField(appFields, "price")
            rating = self.getAppField(appFields, "score")
            minimumOsVersion = self.getAppField(appFields, "androidVersion")  # TODO: can be VARY, https://play.google.com/store/apps/details?id=com.surpax.ledflashlight.panel&hl=en&gl=us
            releaseDate = self.getAppField(appFields, "updated")
            supportedDevices = []            
            genreDetails = self.getAppField(appFields, "genreId").split('_')  # example: ["games", "action"]
            self.appInfo = AppInfo(title, description, imagePaths, genre, price, rating, "Android", minimumOsVersion,
                releaseDate, supportedDevices, genreDetails)

        else:
            # the command was not successful (returned non-0 exit code)
            raise Exception(response.stderr)


