
import json
from AppCrawler import AppCrawler
from AppCrawlerFactory import AppCrawlerFactory
#from GooglePlayCrawler import GooglePlayCrawler
import os

googleUrls = [
    'https://play.google.com/store/apps/details?id=com.kongregate.mobile.throwdown.google',
    'https://play.google.com/store/apps/details?id=com.sagosago.Construction.googleplay',
    'https://play.google.com/store/apps/details?id=com.bftv.PlayPhone',
    'https://play.google.com/store/apps/details?id=valsar.dungeonwarfare',
    'https://play.google.com/store/apps/details?id=me.dreamsky.stickman',
    'https://play.google.com/store/apps/details?id=com.drpanda.bathtime',
    'https://play.google.com/store/apps/details?id=com.blizzard.wowcompanion',
    'https://play.google.com/store/apps/details?id=com.gramgames.toppletap',
    'https://play.google.com/store/apps/details?id=com.playrix.gardenscapes',
    'https://play.google.com/store/apps/details?id=com.skonec.choochoohero'
    ]

appleUrls = [
    'https://itunes.apple.com/us/app/solitaire/id1100578622?mt=8',
    'https://itunes.apple.com/cn/app/ke-lu-lu-xing-tan-suo-yu-ding/id961850126?mt=8',
    'https://itunes.apple.com/cn/app/ri-ri-zhu-daydaycook/id1060973985?mt=8',
    'https://itunes.apple.com/cn/app/da-zhong-dian-ping-fa-xian/id351091731?mt=8',
    'https://itunes.apple.com/cn/app/mei-tu-xiu-xiu/id416048305?mt=8',
    'https://itunes.apple.com/cn/app/tou-piao-poll-for-imessage/id1151990256?mt=8'
    ]

def getAppInfo(urls, filename):
    with open(filename, 'w') as f:
        for u in urls:
            app = AppCrawlerFactory.createAppCrawler(u).getAppInfo()
            f.write("///" + u + "\n")
            f.write(json.dumps(app.__dict__, sort_keys=True, indent=4, separators=(',', ': ')))

getAppInfo(appleUrls, 'appleAppInfo.json')
getAppInfo(googleUrls, 'googleAppInfo.json')



