/**
 * Created by zengtao on 2/9/17.
 */

function CAppAdPage()
{
    this.PageId = 0;
    this.AppAdList = [];
}

CAppAdPage.prototype.parse = function(adPageData)
{
    var appAdPageObjectContent = null;
    var appAdPageObject = null;
    var appAdList = null;
    var appAdData = null;
    var appAd = null;
    if(!adPageData)
    {
        return false;
    }

    try
    {
        this.PageId = parseInt(adPageData.APP_AD_PAGE_NUMBER);
    }
    catch(exception)
    {
        return false;
    }

    try
    {
        appAdPageObjectContent = decodeURIComponent(BiBase64.decode(adPageData.APP_AD_LIST_DATA));
    }
    catch(exception)
    {
        return false;
    }

    try
    {
        appAdPageObject = eval('(' + appAdPageObjectContent + ')');
    }
    catch(ex)
    {
        writeLogMessage("ERROR", sprintf("Response data format invalid, error message<%s>.", ex.message));
        return false;
    }

    if(parseInt(appAdPageObject.state.code) != 0)
    {
        return false;
    }

    appAdList = appAdPageObject.data.list;
    if(appAdList == null)
    {
        return false;
    }

    var itemNumber = appAdList.length;
    for(var index = 0; index < itemNumber;++index)
    {
        appAdData = appAdList[index];
        appAd = new CAppAd();
        if(appAd.parse(appAdData))
        {
            this.addAppAd(appAd);
        }
    }

    return true;
};

CAppAdPage.prototype.addAppAd = function(appAd)
{
    this.AppAdList.push(appAd);
};

CAppAdPage.prototype.clear = function()
{
    this.AppAdList = [];
};