#!/usr/bin/env bash

function scpServerFile()
{
   scp -i zengtao.pem -r ubuntu@ec2-52-42-202-255.us-west-2.compute.amazonaws.com:$1 $2
}

function createLocalPath()
{
    adLocalPath=$1
    if [ ! -e ${adLocalPath} ]
    then
        mkdir -p ${adLocalPath} || exit -1
        echo "Created path:""${adLocalPath}"
    fi
}

#密钥授权
chmod 400 zengtao.pem

adInsightPath="/var/www/html/eli/server/insightExporter/AdInsight/"
adSetInsightPath="/var/www/html/eli/server/insightExporter/AdSetInsight/"
campaignInsightPath="/var/www/html/eli/server/insightExporter/CampaignInsight/"

adFilePrefix="ad_insight_"
adSetFilePrefix="adset_insight_"
campaignFilePrefix="campaign_insight_"

#accountIds=(1202579213151769 1227059300703760 1227059297370427 631702523677133)
accounts=`php getAllAccount.php`
accounts=${accounts:1}
accountIds=(${accounts//,/ })


if [[ -z $1 ]]||[[ -z $2 ]]
then
        echo "Usage: $0 YYYYMMDD YYYYMMDD <localPath>"
        exit 0;
fi

#mac date 用法与linux不一样
beg_date=`date -j -f %Y%m%d $1 +%s`
end_date=`date -j -f %Y%m%d $2 +%s`

if [[ ${beg_date} > ${end_date} ]]
then
        echo "The end_date < beg_date ;Please input the right date,example: $0 20140101 20140301"
        exit 0;
fi

for (( i=${beg_date};i<=${end_date};i=i+86400))
do
        dateStr=`date -r ${i} +%Y-%m-%d`

        if [ -z $3 ]
        then
            localPath=$(cd `dirname $0`; pwd)"/"
        else
            localPath=$3"/"
        fi

        for actId in ${accountIds[@]}
        do
            if [[ ${actId} == *[!0-9]* ]]
            then
                continue
            fi
            #下载adInsight
            adFileName=${adFilePrefix}${dateStr}".tsv"

            adLocalPath=${localPath}"adInsight/"${actId}"/"
            createLocalPath ${adLocalPath}
            adFilePath=${adInsightPath}${actId}"/"${adFileName}
            adLocalFilePath=${adLocalPath}${adFileName}

            scpServerFile ${adFilePath} ${adLocalFilePath}

            #下载adSetInsight
            adSetFileName=${adSetFilePrefix}${dateStr}".tsv"

            adSetLocalPath=${localPath}"adSetInsight/"${actId}"/"
            createLocalPath ${adSetLocalPath}
            adSetFilePath=${adSetInsightPath}${actId}"/"${adSetFileName}
            adSetLocalFilePath=${adSetLocalPath}${adSetFileName}

            scpServerFile ${adSetFilePath} ${adSetLocalFilePath}

            #下载campaignInsight
            campaignFileName=${campaignFilePrefix}${dateStr}".tsv"

            campaignLocalPath=${localPath}"campaignInsight/"${actId}"/"
            createLocalPath ${campaignLocalPath}
            campaignFilePath=${campaignInsightPath}${actId}"/"${campaignFileName}
            campaignLocalFilePath=${campaignLocalPath}${campaignFileName}

            scpServerFile ${campaignFilePath} ${campaignLocalFilePath}
        done
done


