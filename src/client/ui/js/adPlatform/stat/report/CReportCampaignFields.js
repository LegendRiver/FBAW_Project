/**
 * Created by yangtian on 16/10/21.
 */

function CReportCampaignFields()
{
    this.CampaignId = null;
    this.Name = null;
    this.CampaignType = null;
    this.ScheduleStart = null;
    this.ScheduleEnd = null;
    this.CampaignStatus = null;
    this.CampaignSpent = null;
    this.CampaignBugdet = null;
    this.CampaignBalance = null;
    this.CampaignExpression = null;
    this.CampaignClick = null;
    this.CampaignCTR = null;
    this.CampaignCPM = null;
    this.CampaignCPC = null;

    this.__CampaignFeildsHash = new BiHashTable();
}

CReportCampaignFields.prototype.initObject = function(campaignsData)
{
    this.__CampaignData = campaignsData;
};


CReportCampaignFields.prototype.setCampaignFields = function(key, value)
{
    this.__CampaignFeildsHash.add(key, value);
};

CReportCampaignFields.prototype.getCampaignFieldsHash = function()
{
    return this.__CampaignFeildsHash;
};