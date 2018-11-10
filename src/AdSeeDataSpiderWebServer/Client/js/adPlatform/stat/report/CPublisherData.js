/**
 * Created by yangtian on 16/10/27.
 */
function CPublisherData()
{
    this.__PublisherOriData = null;
    this.__PublisherDailyData = [];
    this.__PublisherDailyImpression = [];
    this.__PublisherDailyClick = [];
    this.__PublisherDailyCTR = [];
    this.__PublisherDailyCPM = [];
    this.__PublisherDailyCPC = [];
    this.__PublisherDate = [];

    this.__PublisherName = null;
    this.__PublisherId = null;
    this.__PublisherSpent = 0;
    this.__PublisherImpression = 0;
    this.__PublisherClick = 0;
    this.__PublisherBudget = 0;
    this.__PublisherBalance = 0;
    this.__PublisherCtr = 0;
    this.__PublisherCpm = 0;
    this.__PublisherCPC = 0;
    this.__PublisherStatus = null;
    this.__PublisherCreateTime = null

    this.__PublisherTotalData = [];


}

CPublisherData.prototype.initObject = function(publisherOriData, fieldsData)
{
    this.__FieldsData = fieldsData;
    this.__PublisherOriData = publisherOriData;
    this._computePublisherData(this.__PublisherOriData);

};

CPublisherData.prototype._computePublisherData = function(publisherOriData)
{

    this.__PublisherName = publisherOriData[PublisherFields.Name.Index];
    this.__PublisherBudget = publisherOriData[PublisherFields.Budget.Index];
    this.__PublisherStatus = publisherOriData[PublisherFields.Status.Index];
    this.__PublisherCreateTime = publisherOriData[PublisherFields.CreateTime.Index].split(" ")[0];
    this.__PublisherInsights = publisherOriData[PublisherFields.Insights.Index];

    this._computePublisherInsights(this.__PublisherInsights);
};

CPublisherData.prototype._computePublisherInsights = function(data)
{
    var len = data.length;
    for(var index=0; index<len; index++)
    {
        var array = [];
        var date = data[index][InsightFields.START_TIME.Index];
        var spent = parseFloat(data[index][InsightFields.SPENT.Index]);
        var impression = data[index][InsightFields.IMPRESSION.Index];
        var click = data[index][InsightFields.CLICK.Index];
        var cpc = parseFloat(data[index][InsightFields.CPC.Index]);
        var ctr = parseFloat(data[index][InsightFields.CTR.Index]);
        var cpm = parseFloat(data[index][InsightFields.CPM.Index]);
        array.push(date);  // time 0
        array.push(spent); // spent 1
        this.__PublisherSpent = this.__PublisherSpent + spent;

        array.push(impression);  // impression 2
        this.__PublisherImpression = this.__PublisherImpression + impression;

        array.push(click);  // click 3
        this.__PublisherClick = this.__PublisherClick +click;

        array.push(cpc);  // cpc
        array.push(ctr); // ctr
        array.push(cpm); // cpm
        this.__PublisherDailyData.push(array);
        var arrayDate = date.split(" ");//2016-01-10 00:00:00
        //var arrayDate = date.split("-");
        //var dateObject = new Date(arrayDate[0], arrayDate[1],arrayDate[2]);
        var dateObject = new Date(arrayDate[0]);
        this.__PublisherDate.push(dateObject);
        this.__PublisherDailyImpression.push(impression);
        this.__PublisherDailyClick.push(click);
        this.__PublisherDailyCTR.push(ctr);
        this.__PublisherDailyCPM.push(cpm);
        this.__PublisherDailyCPC.push(cpc);
    }


    if(this.__PublisherImpression != 0){
        this.__PublisherCtr = (this.__PublisherClick * 100 / this.__PublisherImpression).toFixed(2);
        this.__PublisherCpm = (this.__PublisherSpent * 1000 / this.__PublisherImpression).toFixed(2);
    }

    if(this.__PublisherClick !=0 )
    {
        this.__PublisherCPC = (this.__PublisherSpent / this.__PublisherClick).toFixed(2);
    }

    this.__PublisherBalance = this.__PublisherBudget - this.__PublisherSpent;

    this._addPublisherTotalData();
};

CPublisherData.prototype._addPublisherTotalData = function()
{
    var array = [];
    array.push(this.__PublisherName); //0
    array.push(this.__PublisherStatus); //1
    array.push(this.__PublisherCreateTime); //2
    array.push(this.__PublisherBudget); //3
    array.push(this.__PublisherSpent);  //4
    array.push(this.__PublisherBalance); // 5
    array.push(this.__PublisherImpression); // 6
    array.push(this.__PublisherClick); //7
    array.push(this.__PublisherCtr); //8
    array.push(this.__PublisherCpm); //9
    array.push(this.__PublisherCPC); //10
    this.__PublisherTotalData = array;
};

CPublisherData.prototype.getPublisherTotalData = function()
{
    return this.__PublisherTotalData;
};

CPublisherData.prototype.getPublisherDailyData = function()
{
    return this.__PublisherDailyData;
};

CPublisherData.prototype.getPublisherName = function()
{
    return this.__PublisherName;
};

CPublisherData.prototype.getPublisherBalance = function()
{
    return this.__PublisherBalance;
};

CPublisherData.prototype.getPublisherSpent = function()
{
    return this.__PublisherSpent;
};

CPublisherData.prototype.getPublisherDate = function()
{
    return this.__PublisherDate;
};

CPublisherData.prototype.getPublisherDailyImpression = function()
{
    return this.__PublisherDailyImpression;
};

CPublisherData.prototype.getPublisherDailyClick = function()
{
    return this.__PublisherDailyClick;
};

CPublisherData.prototype.getPublisherDailyCTR = function()
{
    return this.__PublisherDailyCTR;
};

CPublisherData.prototype.getPublisherDailyCPM = function()
{
    return this.__PublisherDailyCPM;
};

CPublisherData.prototype.getPublisherDailyCPC = function()
{
    return this.__PublisherDailyCPC;
};