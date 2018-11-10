from AppleStoreCrawler import *
from GooglePlayCrawler import *

class AppCrawlerFactory(object):
    @staticmethod
    def createAppCrawler(url):
        if url.find("itunes.apple.com/") >= 0:
            return AppleStoreCrawler(url)
        elif url.find("play.google.com/") >= 0:
            return GooglePlayCrawler(url)
        else:
            raise Exception("AppCrawlerFactory error: invalid url " + url)
