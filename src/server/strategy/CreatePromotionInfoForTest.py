
import json
import jsonpickle
import argparse
from FBAdObjects import *
from Promotion import *
from PromotionFactory import *
from Config import *

def createPromotionInfoForTest():
    return PromotionInfo(
        "https://itunes.apple.com/us/app/solitaire/id1100578622?mt=8", # "https://play.google.com/store/apps/details?id=com.surpax.ledflashlight.panel&hl=en&gl=us"
        PublisherType.FB,
        CampaignType.AppInstall,
        "584939305020122",
        None, # Config Id
        AdOperation.New,
        30000,
        50,
        '2016-10-10 00:00',
        '2016-11-10 00:00',
        ["Vietnam", "Indonesia", "Malaysia", "Thailand", "India"],
        [OptimizationGoalType.AppInstall, OptimizationGoalType.LinkClick],
        ConstValue.bidDiscounts)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    # parser.add_argument("--echo", help="echo the string")  # optional arg example    
    parser.add_argument("OutputFile", help="Output file name")
    args = parser.parse_args()

    with open(args.OutputFile, 'w') as f:
        promoInfo = createPromotionInfoForTest()
        promotionResult = json.dumps(json.loads(jsonpickle.encode(promoInfo)), indent=4, sort_keys=True)
        f.write(promotionResult)