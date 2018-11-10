/**
 * Created by yangtian on 16/12/2.
 */

function CPageController()
{
    BiComponent.call(this);

    this.__PanelSize = {
        buttonWidth : 60,
        buttonHeight : 45
    };

    this.setId(newGuid());
    this.setCssClassName("eli-page-control-panel");
    this.setWidth(3*this.__PanelSize.buttonWidth);
    this.setHeight(this.__PanelSize.buttonHeight);

    this.__PageNum = 0;
    this.__CurrentPageIndex = 0;

    this.__LastPanelLeft = 0;
}

CPageController.prototype = new BiComponent;
CPageController.prototype._className = "";

CPageController.prototype.initObject = function(parent)
{
    this.__Parent = parent;
    this._init();
};

CPageController.prototype._init = function()
{
    this._initPreButton(this.__LastPanelLeft);
    this._pageInfoPanel(this.__LastPanelLeft);
    this._initNextButton(this.__LastPanelLeft);
};

CPageController.prototype._initPreButton = function(left)
{
    this.__PreButton = new BiLabel();
    this.__PreButton.setId(newGuid());
    this.__PreButton.setCssClassName("eli-page-control-text");
    this.__PreButton.setText("< 上一页");
    this.__PreButton.setLeft(left);
    this.__PreButton.setTop(0);
    this.__PreButton.setWidth(this.__PanelSize.buttonWidth);
    this.__PreButton.setHeight(this.__PanelSize.buttonHeight);
    this.__PreButton.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.buttonHeight));
    this.__PreButton.setEnabled(false);
    this.__PreButton.addEventListener("click", function () {
        this._onPreButtonClick();
    }, this);
    this.add(this.__PreButton);

    this.__LastPanelLeft = this.__PreButton.getWidth() + left;
};

CPageController.prototype._pageInfoPanel = function(left)
{
    this.__PageInfo = new BiLabel();
    this.__PageInfo.setId(newGuid());
    this.__PageInfo.setCssClassName("eli-page-control-text");
    this.__PageInfo.setLeft(left);
    this.__PageInfo.setTop(0);
    this.__PageInfo.setWidth(this.__PanelSize.buttonWidth);
    this.__PageInfo.setHeight(this.__PanelSize.buttonHeight);
    this.__PageInfo.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.buttonHeight));
    this.add(this.__PageInfo);

    this.__LastPanelLeft =this.__PageInfo.getWidth() + left;
};

CPageController.prototype._initNextButton = function(left)
{
    this.__NextButton = new BiLabel();
    this.__NextButton.setId(newGuid());
    this.__NextButton.setCssClassName("eli-page-control-text");
    this.__NextButton.setText("下一页 >");
    this.__NextButton.setLeft(left);
    this.__NextButton.setTop(0);
    this.__NextButton.setWidth(this.__PanelSize.buttonWidth);
    this.__NextButton.setHeight(this.__PanelSize.buttonHeight);
    this.__NextButton.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.buttonHeight));
    this.__NextButton.addEventListener("click", function () {
        this._onNextButtonClick();
    }, this);
    this.add(this.__NextButton);

    this.__LastPanelLeft = this.__NextButton.getWidth() + left;
};

CPageController.prototype._onNextButtonClick = function()
{
    if(this.__CurrentPageIndex >= this.__PageNum-1)
    {
        return;
    }

    this.__CurrentPageIndex++;
    this.__Parent.updateCurrentPageIndex(this.__CurrentPageIndex);
    this.__Parent.updateCurrentPageData();

};

CPageController.prototype._onPreButtonClick = function()
{
    if(this.__CurrentPageIndex <=0)
    {
        return;
    }

    this.__CurrentPageIndex--;
    this.__Parent.updateCurrentPageIndex(this.__CurrentPageIndex);
    this.__Parent.updateCurrentPageData();
};

CPageController.prototype._updateButtonStatus = function()
{
    if(this.__PageNum == 1)
    {
        this.__PreButton.setEnabled(false);
        this.__NextButton.setEnabled(false);
        return;
    }

    if(this.__CurrentPageIndex >= this.__PageNum-1)
    {
        this.__PreButton.setEnabled(true);
        this.__NextButton.setEnabled(false);
        return;
    }

    if(this.__CurrentPageIndex <=0)
    {
        this.__PreButton.setEnabled(false);
        this.__NextButton.setEnabled(true);
        return;
    }

    this.__PreButton.setEnabled(true);
    this.__NextButton.setEnabled(true);
};

CPageController.prototype.updatePageInfo = function(pageNum, currentPage)
{
    this.__PageNum = pageNum;
    this.__CurrentPageIndex = currentPage;

    var text = this.__CurrentPageIndex+1 + " / " + this.__PageNum;

    this.__PageInfo.setText(text);

    this._updateButtonStatus();
};