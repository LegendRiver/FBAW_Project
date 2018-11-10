/**
 * Created by zengtao on 2/8/17.
 */

function CAppAdSummaryComponent()
{
    BiComponent.call(this); //call super
    this.setId(newGuid());
    this.setCssClassName("eli-app-ad-summary-info");
    this.__AdSeeDataSpiderApplication = null;

    this.__AppAdSummaryData = null;
    this.__APP_ICON_SIZE = new CSize(200,200);
    this.__DETAIL_ITEM_HEIGHT = 30;
    this.__AppIconControl = null;
    this.__AppAdSummaryDetailContainerControl = null;
    this.__AppNameControl = null;
    this.__AppAdCountControl = null;
    this.__HeatControl = null;
    this.__ImgCountControl = null;
    this.__InstallCountControl = null;
    this.__AppCategoryControl = null;
    this.__TypeIdControl = null;

    this.__MaxAdTimeControl = null;
    this.__MinAdTimeControl = null;
    this.__LogTimeControl = null;
    this.__UpdateTimeControl = null;

    this.__PrevPageControl = null;
    this.__PageInfoControl = null;
    this.__NextPageControl = null;
}

CAppAdSummaryComponent.prototype = new BiComponent;
CAppAdSummaryComponent.prototype._className = "CAppAdSummaryComponent";

CAppAdSummaryComponent.prototype.initObject = function(adSeeDataSpiderApplication)
{
    this.__AdSeeDataSpiderApplication = adSeeDataSpiderApplication;
    this.__init();
};


CAppAdSummaryComponent.prototype.__init = function()
{
    this.__initAppIconControl();
    this.__initAppAdSummaryDetailContainerControl();
};

CAppAdSummaryComponent.prototype.__initAppIconControl = function()
{
    this.__AppIconControl = new BiComponent();
    this.__AppIconControl.setId(newGuid());
    this.__AppIconControl.setCssClassName("eli-app-ad-summary-app-icon");
    this.__AppIconControl.setLeft(0);
    this.__AppIconControl.setTop(0);
    this.__AppIconControl.setWidth(this.__APP_ICON_SIZE.Width);
    this.__AppIconControl.setHeight(this.__APP_ICON_SIZE.Height);
    this.add(this.__AppIconControl);
};

CAppAdSummaryComponent.prototype.__initAppAdSummaryDetailContainerControl = function()
{
    this.__AppAdSummaryDetailContainerControl = new BiComponent();
    this.__AppAdSummaryDetailContainerControl.setId(newGuid());
    this.__AppAdSummaryDetailContainerControl.setCssClassName("eli-app-ad-summary-app-summary-detail-container");
    this.__AppAdSummaryDetailContainerControl.setLeft(this.__APP_ICON_SIZE.Width);
    this.__AppAdSummaryDetailContainerControl.setTop(0);
    this.__AppAdSummaryDetailContainerControl.setRight(0);
    this.__AppAdSummaryDetailContainerControl.setHeight(this.__APP_ICON_SIZE.Height);
    this.add(this.__AppAdSummaryDetailContainerControl);

    this.__AppNameControl = new BiLabel();
    this.__AppNameControl.setId(newGuid());
    this.__AppNameControl.setCssClassName("eli-app-ad-summary-label");
    this.__AppNameControl.setLeft(5);
    this.__AppNameControl.setTop(5);
    this.__AppNameControl.setRight(5);
    this.__AppNameControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__AppAdSummaryDetailContainerControl.add(this.__AppNameControl);

    this.__AppAdCountControl = new BiLabel();
    this.__AppAdCountControl.setId(newGuid());
    this.__AppAdCountControl.setCssClassName("eli-app-ad-summary-label");
    this.__AppAdCountControl.setLeft(this.__AppNameControl.getLeft());
    this.__AppAdCountControl.setTop(this.__AppNameControl.getTop() + this.__DETAIL_ITEM_HEIGHT + 2);
    this.__AppAdCountControl.setWidth(150);
    this.__AppAdCountControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__AppAdSummaryDetailContainerControl.add(this.__AppAdCountControl);

    this.__HeatControl = new BiLabel();
    this.__HeatControl.setId(newGuid());
    this.__HeatControl.setCssClassName("eli-app-ad-summary-label");
    this.__HeatControl.setLeft(this.__AppAdCountControl.getLeft() + this.__AppAdCountControl.getWidth());
    this.__HeatControl.setTop(this.__AppAdCountControl.getTop());
    this.__HeatControl.setWidth(150);
    this.__HeatControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__AppAdSummaryDetailContainerControl.add(this.__HeatControl);

    this.__ImgCountControl = new BiLabel();
    this.__ImgCountControl.setId(newGuid());
    this.__ImgCountControl.setCssClassName("eli-app-ad-summary-label");
    this.__ImgCountControl.setLeft(this.__HeatControl.getLeft() + this.__HeatControl.getWidth());
    this.__ImgCountControl.setTop(this.__HeatControl.getTop());
    this.__ImgCountControl.setWidth(150);
    this.__ImgCountControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__AppAdSummaryDetailContainerControl.add(this.__ImgCountControl);

    this.__InstallCountControl = new BiLabel();
    this.__InstallCountControl.setId(newGuid());
    this.__InstallCountControl.setCssClassName("eli-app-ad-summary-label");
    this.__InstallCountControl.setLeft(this.__AppAdCountControl.getLeft());
    this.__InstallCountControl.setTop(this.__AppAdCountControl.getTop() + this.__DETAIL_ITEM_HEIGHT + 2);
    this.__InstallCountControl.setWidth(240);
    this.__InstallCountControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__AppAdSummaryDetailContainerControl.add(this.__InstallCountControl);

    this.__AppCategoryControl = new BiLabel();
    this.__AppCategoryControl.setId(newGuid());
    this.__AppCategoryControl.setCssClassName("eli-app-ad-summary-label");
    this.__AppCategoryControl.setLeft(this.__InstallCountControl.getLeft() + this.__InstallCountControl.getWidth());
    this.__AppCategoryControl.setTop(this.__InstallCountControl.getTop());
    this.__AppCategoryControl.setWidth(300);
    this.__AppCategoryControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__AppAdSummaryDetailContainerControl.add(this.__AppCategoryControl);

    this.__TypeIdControl = new BiLabel();
    this.__TypeIdControl.setId(newGuid());
    this.__TypeIdControl.setCssClassName("eli-app-ad-summary-label");
    this.__TypeIdControl.setLeft(this.__AppCategoryControl.getLeft() + this.__AppCategoryControl.getWidth());
    this.__TypeIdControl.setTop(this.__InstallCountControl.getTop());
    this.__TypeIdControl.setWidth(300);
    this.__TypeIdControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__AppAdSummaryDetailContainerControl.add(this.__TypeIdControl);

    this.__MaxAdTimeControl = new BiLabel();
    this.__MaxAdTimeControl.setId(newGuid());
    this.__MaxAdTimeControl.setCssClassName("eli-app-ad-summary-label");
    this.__MaxAdTimeControl.setLeft(this.__InstallCountControl.getLeft());
    this.__MaxAdTimeControl.setTop(this.__InstallCountControl.getTop() + this.__DETAIL_ITEM_HEIGHT + 2);
    this.__MaxAdTimeControl.setWidth(300);
    this.__MaxAdTimeControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__AppAdSummaryDetailContainerControl.add(this.__MaxAdTimeControl);

    this.__MinAdTimeControl = new BiLabel();
    this.__MinAdTimeControl.setId(newGuid());
    this.__MinAdTimeControl.setCssClassName("eli-app-ad-summary-label");
    this.__MinAdTimeControl.setLeft(this.__MaxAdTimeControl.getLeft() + this.__MaxAdTimeControl.getWidth());
    this.__MinAdTimeControl.setTop(this.__MaxAdTimeControl.getTop());
    this.__MinAdTimeControl.setWidth(300);
    this.__MinAdTimeControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__AppAdSummaryDetailContainerControl.add(this.__MinAdTimeControl);

    this.__LogTimeControl = new BiLabel();
    this.__LogTimeControl.setId(newGuid());
    this.__LogTimeControl.setCssClassName("eli-app-ad-summary-label");
    this.__LogTimeControl.setLeft(this.__MaxAdTimeControl.getLeft());
    this.__LogTimeControl.setTop(this.__MaxAdTimeControl.getTop() + this.__DETAIL_ITEM_HEIGHT + 2);
    this.__LogTimeControl.setWidth(300);
    this.__LogTimeControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__AppAdSummaryDetailContainerControl.add(this.__LogTimeControl);

    this.__UpdateTimeControl = new BiLabel();
    this.__UpdateTimeControl.setId(newGuid());
    this.__UpdateTimeControl.setCssClassName("eli-app-ad-summary-label");
    this.__UpdateTimeControl.setLeft(this.__LogTimeControl.getLeft() + this.__LogTimeControl.getWidth());
    this.__UpdateTimeControl.setTop(this.__LogTimeControl.getTop());
    this.__UpdateTimeControl.setWidth(300);
    this.__UpdateTimeControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__AppAdSummaryDetailContainerControl.add(this.__UpdateTimeControl);

    this.__initAdPageNavigationControl();
};

CAppAdSummaryComponent.prototype.__initAdPageNavigationControl = function()
{
    this.__PrevPageControl = new BiLabel();
    this.__PrevPageControl.setId(newGuid());
    this.__PrevPageControl.setCssClassName("eli-app-ad-button");
    this.__PrevPageControl.setLeft(0);
    this.__PrevPageControl.setTop(this.__UpdateTimeControl.getTop() + this.__UpdateTimeControl.getHeight() + 5);
    this.__PrevPageControl.setWidth(50);
    this.__PrevPageControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__PrevPageControl.setText("<");
    this.__PrevPageControl.addEventListener("click", function(event){
        this.__loadPrevPage();
    }, this);
    this.__AppAdSummaryDetailContainerControl.add(this.__PrevPageControl);

    this.__PageInfoControl = new BiLabel();
    this.__PageInfoControl.setId(newGuid());
    this.__PageInfoControl.setCssClassName("eli-app-ad-summary-label");
    this.__PageInfoControl.setLeft(this.__PrevPageControl.getLeft() + this.__PrevPageControl.getWidth());
    this.__PageInfoControl.setTop(this.__PrevPageControl.getTop());
    this.__PageInfoControl.setWidth(100);
    this.__PageInfoControl.setAlign("center");
    this.__PageInfoControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__AppAdSummaryDetailContainerControl.add(this.__PageInfoControl);

    this.__NextPageControl = new BiLabel();
    this.__NextPageControl.setId(newGuid());
    this.__NextPageControl.setCssClassName("eli-app-ad-button");
    this.__NextPageControl.setLeft(this.__PageInfoControl.getLeft() + this.__PageInfoControl.getWidth());
    this.__NextPageControl.setTop(this.__PageInfoControl.getTop());
    this.__NextPageControl.setWidth(50);
    this.__NextPageControl.setHeight(this.__DETAIL_ITEM_HEIGHT);
    this.__NextPageControl.setText(">");
    this.__NextPageControl.addEventListener("click", function(event){
        this.__loadNextPage();
    }, this);
    this.__AppAdSummaryDetailContainerControl.add(this.__NextPageControl);
};

CAppAdSummaryComponent.prototype.setAppAdSummaryData = function(appAdSummaryData)
{
    this.__AppAdSummaryData = appAdSummaryData;
    this.__AppIconControl.setBackgroundImage(this.__AppAdSummaryData.icon);
    this.__AppNameControl.setText(this.__AppAdSummaryData.appName);
    this.__AppAdCountControl.setText(sprintf("Ad Count:%d", this.__AppAdSummaryData.adCount));
    this.__HeatControl.setText(sprintf("Heat:%d", this.__AppAdSummaryData.heat));
    this.__ImgCountControl.setText(sprintf("Img Count:%d", this.__AppAdSummaryData.imgCount));
    this.__InstallCountControl.setText(sprintf("Install Count:%s", this.__AppAdSummaryData.installCount));
    this.__AppCategoryControl.setText(sprintf("App Category:%s", this.__AppAdSummaryData.appCategory));
    this.__TypeIdControl.setText(sprintf("Type Id:%s", this.__AppAdSummaryData.typeId));

    this.__MaxAdTimeControl.setText(sprintf("Max Ad Time:%s", this.__AppAdSummaryData.maxAdTime));
    this.__MinAdTimeControl.setText(sprintf("Min Ad Time:%s", this.__AppAdSummaryData.minAdTime));
    this.__LogTimeControl.setText(sprintf("Min Ad Time:%s", this.__AppAdSummaryData.logTime));
    this.__UpdateTimeControl.setText(sprintf("Update Time:%s", this.__AppAdSummaryData.updateTime));


    this.__AppAdSummaryData.CurrentPageIndex = 1;
    var pageNumber = this.__AppAdSummaryData.getPageNumber();
    this.__PageInfoControl.setText(sprintf("%d/%d", this.__AppAdSummaryData.CurrentPageIndex, pageNumber));
    this.__AdSeeDataSpiderApplication.loadAppAdPage(this.__AppAdSummaryData.pkg, this.__AppAdSummaryData.CurrentPageIndex);
};

CAppAdSummaryComponent.prototype.__loadPrevPage = function()
{
    var pageNumber = this.__AppAdSummaryData.getPageNumber();
    if(this.__AppAdSummaryData.CurrentPageIndex > 1)
    {
        this.__AppAdSummaryData.CurrentPageIndex -= 1;
        this.__PageInfoControl.setText(sprintf("%d/%d", this.__AppAdSummaryData.CurrentPageIndex, pageNumber));
        this.__AdSeeDataSpiderApplication.loadAppAdPage(this.__AppAdSummaryData.pkg, this.__AppAdSummaryData.CurrentPageIndex);
    }
};

CAppAdSummaryComponent.prototype.__loadNextPage = function()
{
    var pageNumber = this.__AppAdSummaryData.getPageNumber();
    if(this.__AppAdSummaryData.CurrentPageIndex < pageNumber)
    {
        this.__AppAdSummaryData.CurrentPageIndex += 1;
        this.__PageInfoControl.setText(sprintf("%d/%d", this.__AppAdSummaryData.CurrentPageIndex, pageNumber));
        this.__AdSeeDataSpiderApplication.loadAppAdPage(this.__AppAdSummaryData.pkg, this.__AppAdSummaryData.CurrentPageIndex);
    }
};