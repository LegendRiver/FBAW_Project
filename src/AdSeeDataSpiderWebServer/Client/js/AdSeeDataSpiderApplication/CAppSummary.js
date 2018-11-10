/**
 * Created by zengtao on 2/7/17.
 */

function CAppSummary()
{
    Object.call(this);
    this.adCount = 0;
    this.appCategory = "";
    this.appFavoritestate = 0;
    this.appName = "";
    this.appType = "";
    this.clientType = "";
    this.createTime = "";
    this.heat = 0;
    this.icon = "";
    this.imgCount = 0;
    this.incrLikeCount = 0;
    this.installCount = "";
    this.likeCount = 0;
    this.logTime = "";
    this.maxAdTime = "";
    this.minAdTime = "";
    this.occurCount =0;
    this.pkg = "";
    this.ranking = 0;
    this.rmPkgfilter = false;
    this.typeId = "";
    this.typeIdlist = "";
    this.updateTime = "";

    this.__AppAdCountOnePage = 20;

    this.CurrentPageIndex = 0;
    this.__AdPageTable = new BiHashTable();
}

CAppSummary.prototype.parse = function(recordData)
{
    var appSummaryObjectContent = null;
    var appSummaryObject = null;
    if(!recordData)
    {
        return false;
    }

    try
    {
        appSummaryObjectContent = decodeURIComponent(BiBase64.decode(recordData.APP_AD_SUMMARY_DATA));
    }
    catch(exception)
    {
        return false;
    }

    try
    {
        appSummaryObject = eval('(' + appSummaryObjectContent + ')');
    }
    catch(ex)
    {
        writeLogMessage("ERROR", sprintf("Response data format invalid, error message<%s>.", ex.message));
        return false;
    }

    if(parseInt(appSummaryObject.state.code) != 0)
    {
        return false;
    }

    var appSummaryData = appSummaryObject.data.object;
    if(!appSummaryData)
    {
        return false;
    }

    this.__AppAdCountOnePage = parseInt(recordData.APP_AD_COUNT_ONE_PAGE);
    this.adCount = appSummaryData.adCount;
    this.appCategory = appSummaryData.appCategory;
    this.appFavoritestate = appSummaryData.appFavoritestate;
    this.appName = replaceAll(appSummaryData.appName,'+', ' ');
    this.appType = appSummaryData.appType;
    this.clientType = appSummaryData.clientType;
    this.createTime = replaceAll(appSummaryData.createTime,'+',' ');
    this.heat = appSummaryData.heat;
    this.icon = appSummaryData.icon;
    this.imgCount = appSummaryData.imgCount;
    this.incrLikeCount = appSummaryData.incrLikeCount;
    this.installCount = replaceAll(appSummaryData.installCount,'+',' ');
    this.likeCount = appSummaryData.likeCount;
    this.logTime = replaceAll(appSummaryData.logTime, '+', ' ');
    this.maxAdTime = replaceAll(appSummaryData.maxAdTime, '+',' ');
    this.minAdTime = replaceAll(appSummaryData.minAdTime, '+',' ');
    this.occurCount =appSummaryData.occurCount;
    this.pkg = appSummaryData.pkg;
    this.ranking = appSummaryData.ranking;
    this.rmPkgfilter = appSummaryData.rmPkgfilter;
    this.typeId = appSummaryData.typeId;
    this.typeIdlist = appSummaryData.typeIdlist;
    this.updateTime = replaceAll(appSummaryData.updateTime, '+', ' ');

    return true;
};

CAppSummary.prototype.addAdPage = function(adPage)
{
    this.__AdPageTable.add(adPage.PageId, adPage);
};

CAppSummary.prototype.getImage = function()
{
    return this.icon;
};

CAppSummary.prototype.getTitle = function()
{
    return this.appName;
};

CAppSummary.prototype.getPageNumber = function()
{
    return Math.ceil(this.adCount / this.__AppAdCountOnePage);
};

CAppSummary.prototype.getAdPage = function(pageIndex)
{
    if(this.__AdPageTable.hasKey(pageIndex))
    {
        return this.__AdPageTable.item(pageIndex);
    }

    return null;
};