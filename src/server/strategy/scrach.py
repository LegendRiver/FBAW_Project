
import argparse
import json
from FBAdObjects import *
from Promotion import *
from PromotionFactory import *
import json
import jsonpickle
import main


if __name__ == "__main__":
        parser = argparse.ArgumentParser()
        # parser.add_argument("--echo", help="echo the string")  # optional arg example
        parser.add_argument("ConfigFile", help="Json config file name")        
        args = parser.parse_args()

        with open(args.ConfigFile, 'r') as f:
            promoInfo = jsonpickle.decode(f.read())
            print(type(promoInfo))
            for k,v in promoInfo.items():
                print(k + ": " + str(v))



    # promoInfo = main.createPromotionInfoForTest()
    # promotionResult = json.dumps(json.loads(jsonpickle.encode(promoInfo, unpicklable=False)), indent=4, sort_keys=True)
    # print(promotionResult)

    # with open('InputForTest.json', 'r') as f:
    #     promoInfo = json.loads(f.read())
    #     print(type(promoInfo))
    #     for k in promoInfo:
    #         print(k + ":" + str(promoInfo[k]))
    #     print("\n")
    #     for k,v in promoInfo.items():
    #         print(k + ": " + str(v))


# import json
# import urllib2
# appStr = urllib2.urlopen("https://itunes.apple.com/lookup?id=1130218866").read()
# app = json.loads(appStr)
# appFields = app["results"][0]  
# "trackName" in appFields
# "supportedDevices" in appFields


# # jsonpickle
# import jsonpickle
# print(json.dumps(json.loads(jsonpickle.encode(adset, unpicklable=False)), indent=4))


# class FBAddict(dict):
#     def __init__(self, name, adsetId, creativeId = "", creativePseudoId = ""):
#         self.name = name
#         self.adsetId = adsetId  # can be "NEW"
#         self.creativeId = creativeId
#         self.creativePseudoId = creativePseudoId


# addict = []
# addict.append(FBAddict("n1", "NEW", creativePseudoId = "111"))
# addict.append(FBAddict("n2", "NEW", creativePseudoId = "222"))
# addict.append(FBAddict("n3", "NEW", creativeId = "creative id 333"))


# print(json.dumps(addict, indent=4, separators=(',', ': ')))


# print(json.dumps(json.loads(jsonpickle.encode(ads[0], unpicklable=False)), indent=4))
# print(json.dumps(json.loads(jsonpickle.encode(adset, unpicklable=False)), indent=4))

# print(json.dumps(ads[0].__dict__, indent=4, separators=(',', ': ')))