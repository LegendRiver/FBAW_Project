import sys
import urllib2
import json
from AppInfo import AppInfo
import abc

class AppCrawler(object):
    def __init__(self, appUrl):
        self.appUrl = appUrl
        self.appInfo = None

    @abc.abstractmethod  
    def crawl(self):
        pass 

    def getAppInfo(self):
        if not self.appInfo:
            self.crawl()
        return self.appInfo

    def getAppField(self, appFields, name, defaultValue = ""):
        if name in appFields:
            return appFields[name]
        else:
            return defaultValue
