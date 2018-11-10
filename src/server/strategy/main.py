
import argparse
import jsonpickle
from FBAdObjects import *
from Promotion import *
from PromotionFactory import *

if __name__ == "__main__":
    # try:
        parser = argparse.ArgumentParser()
        # parser.add_argument("--echo", help="echo the string")  # optional arg example
        parser.add_argument("ConfigFile", help="Json config file name")
        parser.add_argument("OutputFile", help="Output file name")
        args = parser.parse_args()

        with open(args.ConfigFile, 'r') as f:
            promoInfo = jsonpickle.decode(f.read()) 
            promo = PromotionFactory.createPromotion(promoInfo)
            promo.promote()
            result = promo.getPromoteResult()

            with open(args.OutputFile, 'w') as f:
                f.write(result)
        
        exit(0)

    # except Exception as e:
    #     print(e)