/**
 * Created by yangtian on 16/10/27.
 */

function CCampaignDataProcess()
{
    this.__CampaignsData = [];
    this.__CampaignObjects = [];
}

CCampaignDataProcess.prototype.initObject = function(campaignsData, publisherFields)
{
    this.__CampaignsData = campaignsData;
    this.__PubliserFields = publisherFields;

    this._computeCampaignsData();
};

CCampaignDataProcess.prototype._computeCampaignsData = function()
{
    var len = this.__CampaignsData.length;

    for(var index=0; index<len; index++)
    {
        var campaignData = new CCampaignData();
        campaignData.initObject(this.__CampaignsData[index], this.__PubliserFields);
        //campaignData.computePublishersData(campaignData.getPublishersData());

        this.__CampaignObjects.push(campaignData);
    }
};

CCampaignDataProcess.prototype.getCampaignObjects = function()
{
    return this.__CampaignObjects;
};



