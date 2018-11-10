/**
 * Created by yangtian on 16/11/8.
 */

function CAccountData()
{
    this.__CampaignsData = null;
    this.__Parent = null;

    this.__AccountBudget = 0;
    this.__AccountImpression = 0;
    this.__AccountClick = 0;
    this.__AccountSpent = 0;
    this.__AccountCTR = 0;
    this.__AccountCPM = 0;
    this.__AccountCPC = 0;
    this.__AccountImpressionDateArray = [];
    this.__AccountDailyImpression = new BiHashTable();
    this.__AccountClickDateArray = [];
    this.__AccountDailyClick = new BiHashTable();

    this.__AccountDailyCtr = new BiHashTable();
    this.__AccountDailyCpm = new BiHashTable();
    this.__AccountDailyCpc = new BiHashTable();
    this.__AccountDailySpent = new BiHashTable();
    this.__PublisherHash = new BiHashTable();
    this.__PublisherSpentHash = new BiHashTable();
}

CAccountData.prototype.initObject = function(parent,campaignsData)
{
    this.__Parent = parent;
    this.accountDataProcess(campaignsData)
};

CAccountData.prototype.accountDataProcess = function(campaignsData)
{
    if(campaignsData == null) {
        return;
    }

    var len = campaignsData.length;


    for(var index=0; index<len; index++)
    {
        var campaignData = campaignsData[index];
        var publishersData = campaignData[CampaignFields.PublishersInfo.Index];
        var publisherNum = publishersData.length;

        for(var publisherIndex=0; publisherIndex<publisherNum; publisherIndex++)
        {
            var publisherData = publishersData[publisherIndex];
            var publisherName = publisherData[PublisherFields.Name.Index];
            if(!this.__PublisherHash.hasKey(publisherName))
            {
                var publisherDataObject = new CDashboardPublisherData();
                this.__PublisherHash.add(publisherName, publisherDataObject);
            }

            var publisherInsights = publisherData[PublisherFields.Insights.Index];
            var insightsNum = publisherInsights.length;

            var publisherObject = this.__PublisherHash.item(publisherName);

            for(var insightIndex=0; insightIndex<insightsNum; insightIndex++)
            {
                var insight = publisherInsights[insightIndex];
                var spent = parseFloat(insight[InsightFields.SPENT.Index]); // spent
                var date = insight[InsightFields.START_TIME.Index];
                //var dateObject = new Date(date);
                var impression = insight[InsightFields.IMPRESSION.Index];
                var click = insight[InsightFields.CLICK.Index];

                this._accountDailyInfoProcess(date, impression, click, spent);
                publisherObject.updatePublisherData(date, impression, click, spent);
                this.__AccountSpent += spent;
            }
        }
    }

    this._computeAccountDailyOtherIndex(
        this.__AccountClickDateArray,
        this.__AccountDailyImpression,
        this.__AccountDailyClick,
        this.__AccountDailySpent
    );

};

CAccountData.prototype._accountDailyInfoProcess = function(date, impression, click, spent)
{


    this._computeAccountDailyImpression(date, impression);
    this._computeAccountDailyClick(date, click);
    this._computeAccountDailySpent(date, spent);
};

CAccountData.prototype._computeAccountDailyImpression = function(date, impression)
{
    if(!this.__AccountDailyImpression.hasKey(date))
    {
        this.__AccountDailyImpression.add(date, impression);
        this.__AccountImpressionDateArray.push(date);
        return;
    }

    var accountDailyImpression = this.__AccountDailyImpression.item(date);
    accountDailyImpression += impression;
    this.__AccountDailyImpression.remove(date);
    this.__AccountDailyImpression.add(date, accountDailyImpression);
};

CAccountData.prototype._computeAccountDailyClick = function(date, click)
{
    if(!this.__AccountDailyClick.hasKey(date))
    {
        this.__AccountDailyClick.add(date, click);
        this.__AccountClickDateArray.push(date);
        return;
    }

    var accountDailyClick = this.__AccountDailyClick.item(date);
    accountDailyClick += click;
    this.__AccountDailyClick.remove(date);
    this.__AccountDailyClick.add(date, accountDailyClick);
};

CAccountData.prototype._computeAccountDailySpent = function(date, spent)
{
    if(!this.__AccountDailySpent.hasKey(date))
    {
        this.__AccountDailySpent.add(date, spent);
        return;
    }

    var accountDailySpent = this.__AccountDailySpent.item(date);
    accountDailySpent += spent;
    this.__AccountDailySpent.remove(date);
    this.__AccountDailySpent.add(date, accountDailySpent);
};

CAccountData.prototype._computeAccountDailyOtherIndex = function(dates, impressionHash, clickHash, spentHash)
{
    var len = dates.length;
    for(var index=0; index<len; index++)
    {
        var date = dates[index];
        var impression = impressionHash.item(date);
        var click = clickHash.item(date);
        var spent = spentHash.item(date);

        var ctr = 0;
        var cpm = 0;
        var cpc = 0;
        if(impression!=0)
        {
            ctr = parseFloat(click/impression);
            cpm = parseFloat(spent*1000/impression);
        }

        if(click !=0)
        {
            cpc = parseFloat(spent/click);
        }

        if(!this.__AccountDailyCtr.hasKey(date))
        {
            this.__AccountDailyCtr.add(date, ctr);
            this.__AccountDailyCpm.add(date, cpm);
            this.__AccountDailyCpc.add(date, cpc);
        }
    }
};

CAccountData.prototype.getAccountBudget = function()
{
    return this.__AccountBudget;
};

CAccountData.prototype.getAccountSpent = function()
{
    return this.__AccountSpent;
};

CAccountData.prototype.getAccountPublisherData = function()
{
    return this.__PublisherHash;
};

CAccountData.prototype.getAccountDailyDate = function()
{
    return this.__AccountImpressionDateArray;
};

CAccountData.prototype.getAccountDailyImpression = function()
{
    return this.__AccountDailyImpression;
};

CAccountData.prototype.getAccountDailyClick = function()
{
    return this.__AccountDailyClick;
};

CAccountData.prototype.getAccountDailyCTR = function()
{
    return this.__AccountDailyCtr;
};

CAccountData.prototype.getAccountDailyCPC = function()
{
    return this.__AccountDailyCpc;
};

CAccountData.prototype.getAccountDailyCPM = function()
{
    return this.__AccountDailyCpm;
};