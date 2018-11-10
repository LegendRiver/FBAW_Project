#!/usr/bin/env bash

function modifyCsvTitle()
{
    firstLine=`sed -n '1p' $1`

    replaceString=${firstLine}$2
    commandString=${replaceString}
    `sed -i "1c ${commandString}" $1`
}

if [[ -z $1 ]]||[[ -z $2 ]]
then
        echo "Usage: $0 <appendString> <nodeType>"
        exit 0;
fi

appendString=$1
nodeType=$2

adInsightPath="/var/www/html/eli/server/insightExporter/AdInsight/"
adSetInsightPath="/var/www/html/eli/server/insightExporter/AdSetInsight/"
campaignInsightPath="/var/www/html/eli/server/insightExporter/CampaignInsight/"

adFilePrefix="ad_insight_"
adSetFilePrefix="adset_insight_"
campaignFilePrefix="campaign_insight_"

#accountIds=(1202579213151769 1227059300703760)
accounts=`php getAllAccount.php`
accounts=${accounts:1}
accountIds=(${accounts//,/ })

dateStr=`date +%F`

for actId in ${accountIds[@]}
do
    if [[ ${actId} == *[!0-9]* ]]
    then
        continue
    fi

    if [[ ${nodeType} =~ "a" ]]
    then
        adFileName=${adFilePrefix}${dateStr}".tsv"
        adFilePath=${adInsightPath}${actId}"/"${adFileName}
        echo ${adFilePath}
        modifyCsvTitle ${adFilePath} ${appendString}
    fi

    if [[ ${nodeType} =~ "s" ]]
    then
        adSetFileName=${adSetFilePrefix}${dateStr}".tsv"
        adSetFilePath=${adSetInsightPath}${actId}"/"${adSetFileName}
        echo ${adSetFilePath}
        modifyCsvTitle ${adSetFilePath} ${appendString}
    fi

    if [[ ${nodeType} =~ "c" ]]
    then
        campaignFileName=${campaignFilePrefix}${dateStr}".tsv"
        campaignFilePath=${campaignInsightPath}${actId}"/"${campaignFileName}
        echo ${campaignFilePath}
        modifyCsvTitle ${campaignFilePath} ${appendString}
    fi
done
