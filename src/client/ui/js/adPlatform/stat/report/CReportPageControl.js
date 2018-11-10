/**
 * Created by yangtian on 16/10/24.
 */
function CReportPageControl()
{
    BiComponent.call(this);
    this.setId(newGuid());
    this.setCssClassName("eli-campaign-control-panel");
    this.setWidth(180);
    this.setHeight(45);

    this.__UserData = {
        forward : "forward",
        backward : "backward",
        page : "page"
    };

    this.__PanelSize = {
        buttonWidth : 60
    };

    this.__EliApplication = null;
    this.__Parent = null;

    this.__CurrentPage = 0;
    this.__PageNum = 0;

}

CReportPageControl.prototype = new BiComponent;
CReportPageControl.prototype._className = "CReportPageControl";

CReportPageControl.prototype.initObject = function(application, parent)
{
    this.__EliApplication = application;
    this.__Parent = parent;
    this._init();
};

CReportPageControl.prototype._init = function()
{
    this._initForwardComponent();
    this._initPageComponent();
    this._initBackwardComponent();
};

CReportPageControl.prototype._initForwardComponent = function()
{
    this.__ForwardComponent = new BiLabel();
    this.__ForwardComponent.setId(newGuid());
    this.__ForwardComponent.setUserData(this.__UserData.forward);
    this.__ForwardComponent.setCssClassName("eli-campaign-control-text");
    this.__ForwardComponent.setText("< 上一页");
    this.__ForwardComponent.setLeft(0);
    this.__ForwardComponent.setWidth(this.__PanelSize.buttonWidth);
    this.__ForwardComponent.setTop(0);
    this.__ForwardComponent.setBottom(0);
    this.__ForwardComponent.setStyleProperty("line-height", sprintf("%dpx", this.getHeight()));
    this.__ForwardComponent.addEventListener("click", function () {
        this._onButtonClick(this.__ForwardComponent.getUserData());
    }, this);
    this.add(this.__ForwardComponent);
};

CReportPageControl.prototype._initPageComponent = function()
{
    this.__pageLabel = new BiLabel();
    this.__pageLabel.setUserData(this.__UserData.page);
    this.__pageLabel.setCssClassName("eli-campaign-control-text");
    this.__pageLabel.setId(newGuid());
    this.__pageLabel.setTop(0);
    this.__pageLabel.setBottom(0);
    this.__pageLabel.setLeft(this.__ForwardComponent.getLeft() + this.__ForwardComponent.getWidth());
    this.__pageLabel.setWidth(this.__PanelSize.buttonWidth);
    this.__pageLabel.setStyleProperty("line-height", sprintf("%dpx", this.getHeight()));
    this.add(this.__pageLabel);
};

CReportPageControl.prototype._initBackwardComponent = function()
{
    this.__BackwardComponent = new BiLabel();
    this.__BackwardComponent.setId(newGuid());
    this.__BackwardComponent.setText("下一页 >");
    this.__BackwardComponent.setUserData(this.__UserData.backward);
    this.__BackwardComponent.setCssClassName("eli-campaign-control-text");
    this.__BackwardComponent.setTop(0);
    this.__BackwardComponent.setBottom(0);
    this.__BackwardComponent.setLeft(this.__pageLabel.getLeft()+ this.__pageLabel.getWidth());
    this.__BackwardComponent.setRight(0);
    this.__BackwardComponent.setStyleProperty("line-height", sprintf("%dpx", this.getHeight()));
    this.__BackwardComponent.addEventListener("click", function () {
        this._onButtonClick(this.__BackwardComponent.getUserData());
    }, this);

    this.add(this.__BackwardComponent);
};

CReportPageControl.prototype.updatePageInfo = function(currentPage, data)
{
    var pageNum = data.length;
    this.__PageData = data;
    this.__pageLabel.setText(currentPage + "/" + pageNum);
};

CReportPageControl.prototype._onButtonClick = function(userData)
{
    var currentPage = this.__Parent.getCurrentPage();
    var pageNum = this.__Parent.getPageNum();
    if((userData == this.__UserData.forward) && (currentPage > 0))
    {
        currentPage--;
        this.__Parent.setCurrentPage(currentPage);
    }
    else if ((userData == this.__UserData.backward) && (currentPage < pageNum-1))
    {
        currentPage++;
        this.__Parent.setCurrentPage(currentPage);
    }
    else
    {
        return;
    }

    //var pagesData = this.__Parent.getPagesData();
    var mainComponent = this.__Parent.getMainComponent();
    mainComponent.resetCampaignPanelVisible();
    mainComponent.updateItemsValue(this.__PageData[currentPage]);
    this.updatePageInfo(currentPage+1, this.__PageData);
};



