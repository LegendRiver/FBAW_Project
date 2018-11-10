/**
 * Created by yangtian on 16/10/27.
 */

function CCampaignData()
{
    this.__Id = null;
    this.__Name = null;
    this.__Status = null;
    this.__Budget = 0;
    this.__Spent = 0;
    this.__Balance = 0;
    this.__Impression = 0;
    this.__Click = 0;
    this.__CPC = 0;
    this.__CPM = 0;
    this.__CTR = 0;
    this.__CreateTime = null;

    this.__CampaignData = null;
    this.__PublisherFieldsData = null;

    this.__PublishersTotalData = [];
    this.__PublishersDailyData = [];

    this.__CampaignTotalData = [];
    this.__CampaignDailyData = [];
    this.__Date = [];
    this.__DateHash = new BiHashTable();

    this.__PublisherObjects = [];
}

CCampaignData.prototype.initObject = function(campaignData, publisherFieldsData)
{
    this.__CampaignData = campaignData;
    this.__Name = campaignData[CampaignFields.Name.Index];
    this.__Budget = campaignData[CampaignFields.Budget.Index];
    this.__Status = campaignData[CampaignFields.Status.Index];
    this.__CreateTime = campaignData[CampaignFields.CreateTime.Index].split(" ")[0];
    this.__PublisherFieldsData = publisherFieldsData;
    this.__PublishersData = this.__CampaignData[CampaignFields.PublishersInfo.Index];
    this.computePublishersData(this.__PublishersData);

};


CCampaignData.prototype.computePublishersData = function(publishersData)
{
    var len = publishersData.length;
    for(var index=0; index<len; index++)
    {
        var publisherData = new CPublisherData();
        publisherData.initObject(publishersData[index], this.__PublisherFieldsData);

        this.__PublishersTotalData.push(publisherData.getPublisherTotalData());
        this.__PublishersDailyData.push(publisherData.getPublisherDailyData());
        this.__PublisherObjects.push(publisherData);
    }

    this._computeCampaignTotalData(this.__PublishersTotalData);
    this._computeCampaignDailyInfoHash(this.__PublishersDailyData);
};

CCampaignData.prototype._computeCampaignTotalData = function(publishersTotalData)
{
    var len = publishersTotalData.length;
    for(var index=0; index<len; index++)
    {
        this.__Spent = this.__Spent + publishersTotalData[index][4];
        this.__Impression = this.__Impression + publishersTotalData[index][6];
        this.__Click = this.__Click + publishersTotalData[index][7];
    }

    if(this.__Impression !=0)
    {
        this.__CTR = (100* this.__Click/this.__Impression).toFixed(2);
        this.__CPM = (this.__Spent * 1000 / this.__Impression).toFixed(2);
    }

    if(this.__Click != 0)
    {
        this.__CPC = (this.__Spent/this.__Click).toFixed(2);
    }

    this.__Balance = this.__Budget - this.__Spent;

    this._addCampaignTotalData();
};

CCampaignData.prototype._computeCampaignDailyInfoHash= function(publishersDailyData)
{
    var num = publishersDailyData.length;
    for(var i=0; i<num; i++)
    {
        var publishDailyData = publishersDailyData[i];
        var days = publishDailyData.length;

        for(var j=0; j<days; j++)
        {
            var array = [];
            var date = publishDailyData[j][0];
            var spent = publishDailyData[j][1];
            var impression = publishDailyData[j][2];
            var click = publishDailyData[j][3];

            if(!this.__DateHash.hasKey(date))
            {
                array.push(date);
                array.push(spent);
                array.push(impression);
                array.push(click);
                this.__DateHash.add(date, array);
                this.__Date.push(date);
            }
            else
            {
                var dataArray = this.__DateHash.item(date);
                dataArray[1] += spent;
                dataArray[2] += impression;
                dataArray[3] += click;

                this.__DateHash.remove(date);
                this.__DateHash.add(date, dataArray);
            }
        }
    }

    this._computeCampaignDailyData(this.__Date, this.__DateHash);

};

CCampaignData.prototype._computeCampaignDailyData = function(dates, dataHash)
{
    var len = dates.length;
    for(var index=0; index<len; index++)
    {
        var date = dates[index];
        var array = dataHash.item(date);
        var spent = array[1];
        var impression = array[2];
        var click = array[3];

        var cpc = spent / click;
        var cpm = spent*1000/ impression;
        var ctr = click/impression;

        array.push(cpc);
        array.push(ctr);
        array.push(cpm);
        this.__CampaignDailyData.push(array);
    }
};

CCampaignData.prototype._addCampaignTotalData = function()
{
    this.__CampaignTotalData.push(this.__Name); //0
    this.__CampaignTotalData.push(this.__Status); //1
    this.__CampaignTotalData.push(this.__CreateTime); //2
    this.__CampaignTotalData.push(this.__Budget); //3
    this.__CampaignTotalData.push(this.__Spent); //4
    this.__CampaignTotalData.push(this.__Balance); //5
    this.__CampaignTotalData.push(this.__Impression); //6
    this.__CampaignTotalData.push(this.__Click); //7
    this.__CampaignTotalData.push(this.__CTR); //8
    this.__CampaignTotalData.push(this.__CPM); //9
    this.__CampaignTotalData.push(this.__CPC); //10
};

CCampaignData.prototype.getCampaignTotalData = function()
{
    return this.__CampaignTotalData;
};

CCampaignData.prototype.getCampaignDailyData = function()
{
    return this.__CampaignDailyData;
};
CCampaignData.prototype.getPublisherObject = function()
{
    return this.__PublisherObjects;
};

CCampaignData.prototype.getCampaignName = function()
{
    return this.__Name;
};

CCampaignData.prototype.getPublishersData = function()
{
    return this.__PublishersData;
};


