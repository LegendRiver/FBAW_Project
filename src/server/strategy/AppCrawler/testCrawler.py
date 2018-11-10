
import json
from AppCrawler import AppCrawler
from AppCrawlerFactory import AppCrawlerFactory
#from GooglePlayCrawler import GooglePlayCrawler
from copy import copy

# # c = GooglePlayCrawler("https://play.google.com/store/apps/details?id=com.surpax.ledflashlight.panel&hl=en&gl=us")
# # c.crawl()
# # app = c.getAppInfo()
# c = AppCrawlerFactory.createAppCrawler("https://play.google.com/store/apps/details?id=com.surpax.ledflashlight.panel&hl=en&gl=us")
# app = c.getAppInfo()
# print("google play:")
# #print(json.dumps(app.__dict__, indent=4, separators=(',', ': ')))
# print(app.title)
# print(app.genre)    



# c = AppleStoreCrawler("https://itunes.apple.com/us/app/solitaire/id1100578622?mt=8")
# c.crawl()
# app = c.getAppInfo()
# app = AppCrawlerFactory.createAppCrawler("https://itunes.apple.com/us/app/solitaire/id1100578622?mt=8").getAppInfo()
app = AppCrawlerFactory.createAppCrawler("https://itunes.apple.com/us/app/agent-walker-secret-journey/id1130218866?mt=12").getAppInfo()
print("apple:")
#print(json.dumps(app.__dict__, indent=4, separators=(',', ': ')))
print(app.title)


print("test copy")
app1 = copy(app)
print(json.dumps(app.__dict__, indent=4, separators=(',', ': '), sort_keys=True))

app1.title = "change title"
print(app1.title)
print(app.title)