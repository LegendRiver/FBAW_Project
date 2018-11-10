/**
 * Created by yangtian on 16/10/27.
 */
function CReportTablePageControl()
{
    BiComponent.call(this);

    this.setId(newGuid());
    this.setCssClassName("eli-campaign-control-panel");
    this.setWidth(210);
    this.setHeight(45);

    this.__UserData = {
        forward : "forward",
        backward : "backward",
        page : "page"
    };

    this.__PanelSize = {
        buttonWidth : 70
    };

}

CReportTablePageControl.prototype = new BiComponent;
CReportTablePageControl.prototype._className = "CReportTablePageControl";

CReportTablePageControl.prototype.initObject = function(table, parent)
{
    this.__Table = table;
    this.__Parent = parent;
    this._init();
};

CReportTablePageControl.prototype._init = function()
{
    this._initForwardComponent();
    this._initPageComponent();
    this._initBackwardComponent();
};

CReportTablePageControl.prototype._initForwardComponent = function()
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

CReportTablePageControl.prototype._initPageComponent = function()
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

CReportTablePageControl.prototype._initBackwardComponent = function()
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

CReportTablePageControl.prototype.updatePageLabel = function(currentPage, pageNum)
{
    this.__pageLabel.setText(currentPage+1 + "/" + pageNum);
};

CReportTablePageControl.prototype.updatePageControlInfo = function(currentPage, pages)
{
    this.__CurrentPage = currentPage;
    this.__PageNum = pages.length;
    this.__AllData = pages;

    this.updatePageLabel(this.__CurrentPage, this.__PageNum);
};

CReportTablePageControl.prototype.updateTableData = function(tableData)
{
    this.__Table.updateTableData(tableData);
};

CReportTablePageControl.prototype._onButtonClick = function(userData)
{
    if((userData == this.__UserData.forward) && (this.__CurrentPage > 0))
    {
        this.__CurrentPage--;
    }
    else if ((userData == this.__UserData.backward) && (this.__CurrentPage < this.__PageNum-1))
    {
        this.__CurrentPage++;
    }
    else
    {
        return;
    }

    this.updatePageLabel(this.__CurrentPage, this.__PageNum);
    this.updateTableData(this.__AllData[this.__CurrentPage]);
};

CReportTablePageControl.prototype.getPageControlHeight = function () {
    return this.getHeight();
};