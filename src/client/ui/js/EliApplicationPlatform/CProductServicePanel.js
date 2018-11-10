/**
 * Created by mac on 16/9/22.
 */

function CProductServicePanel()
{
    BiComponent.call(this);
    this.__StyleDefineRecord = null;
}

CProductServicePanel.prototype = new BiComponent;
CProductServicePanel.prototype._className = "CProductServicePanel";

CProductServicePanel.DETAIL_PANEL_STYLE = {Index:0};
CProductServicePanel.DETAIL_IMAGE_STYLE = {Index:1};
CProductServicePanel.DETAIL_CONTENT = {Index:2};
CProductServicePanel.HEIGHT = {Index:3};
CProductServicePanel.FLAG = {Index:4};
CProductServicePanel.DETAIL_CONTENT_TITLE = {Index:5};
CProductServicePanel.DETAIL_CONTENT_DESC = {Index:6};

CProductServicePanel.prototype.initObject = function(eliApplication,styleDefineRecord)
{
    this.__EliApplication = eliApplication;
    this.__StyleDefineRecord = styleDefineRecord;
    this.setHeight(this.__StyleDefineRecord[CProductServicePanel.HEIGHT.Index]);
    this.setCssClassName(this.__StyleDefineRecord[CProductServicePanel.DETAIL_PANEL_STYLE.Index]);
    this._init();
};

CProductServicePanel.prototype._init = function()
{
    this._createDetailPanel();
};

CProductServicePanel.prototype._createDetailPanel = function()
{
    this.__DetailLeftPanel = new BiComponent();
    this.__DetailLeftPanel.setId(newGuid());
    this.__DetailLeftPanel.setCssClassName("eli-product-left-panel");
    this.add(this.__DetailLeftPanel);

    this.__DetailRightPanel = new BiComponent();
    this.__DetailRightPanel.setId(newGuid());
    this.__DetailRightPanel.setCssClassName("eli-product-right-panel");
    this.add(this.__DetailRightPanel);

    this.__DetailImage = new BiComponent();
    this.__DetailImage.setId(newGuid());
    this.__DetailImage.setCssClassName(this.__StyleDefineRecord[CProductServicePanel.DETAIL_IMAGE_STYLE.Index]);


    this.__RegisterContentPanel = new BiComponent();
    this.__RegisterContentPanel.setId(newGuid());
    this.__RegisterContentPanel.setCssClassName("eli-product-content-panel");

    this.__DetailTitle  = new BiLabel();
    this.__DetailTitle.setId(newGuid());
    this.__DetailTitle.setText(this.__StyleDefineRecord[CProductServicePanel.DETAIL_CONTENT_TITLE.Index]);
    this.__DetailTitle.setCssClassName("eli-product-detail-title");
;
    this.__DetailDesc = new BiLabel();
    this.__DetailDesc.setId(newGuid());
    this.__DetailDesc.setCssClassName("eli-product-detail-desc");
    this.__DetailDesc.setHtml(this.__StyleDefineRecord[CProductServicePanel.DETAIL_CONTENT_DESC.Index]);

    this.__RegisterContentPanel.add(this.__DetailTitle);
    this.__RegisterContentPanel.add(this.__DetailDesc);


    if(this.__StyleDefineRecord[CProductServicePanel.FLAG.Index] == "left")
    {
        this.__DetailLeftPanel.add(this.__DetailImage);
        this.__DetailRightPanel.add(this.__DetailTitle);
        this.__DetailRightPanel.add(this.__DetailDesc);
        this.__DetailTitle.setAlign("left");
        this.__DetailDesc.setAlign("left");
        this.setStyleProperty("background-color","#F5F5F5");
    }
    else
    {
        this.__DetailLeftPanel.add(this.__DetailTitle);
        this.__DetailRightPanel.add(this.__DetailImage);
        this.__DetailLeftPanel.add(this.__DetailTitle);
        this.__DetailLeftPanel.add(this.__DetailDesc);
        this.__DetailTitle.setAlign("right");
        this.__DetailDesc.setAlign("right");
        this.setStyleProperty("background-color", "#FAFAFA");
    }
};

CProductServicePanel.initMainStaticPages =  function (application, mainPageContainer)
{
    var height = 630;
    var pageNumber = STATIC_MAIN_PAGES.length;
    for(var index = 0; index < pageNumber; ++index)
    {
        var sectionContent = new CProductServicePanel();
        sectionContent.initObject(application, STATIC_MAIN_PAGES[index]);
        sectionContent.setTop(height);
        mainPageContainer.add(sectionContent);
        height += sectionContent.getHeight();
    }

    mainPageContainer.setHeight(height);
};

CProductServicePanel.gotoPage = function (pageIndex, initPageOffset)
{
    var pageHeight = initPageOffset;
    for(var index = 0; index < pageIndex; ++index)
    {
        pageHeight += STATIC_MAIN_PAGES[pageIndex][CProductServicePanel.HEIGHT.Index];
    }

    window.scrollTo(0,pageHeight);
};