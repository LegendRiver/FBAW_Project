/**
 * Created by yangtian on 16/12/1.
 */

function CHeadTabPanel()
{
    BiComponent.call(this);

    this.__PanelSize = {
        width: 80,
        height: 38,
    };

    this.setId(newGuid());
    this.setCssClassName("eli-statements-head-panel");
    this.setHeight(this.__PanelSize.height+2);


    this.__TabHash = new BiHashTable();

    this.__CurrentTabButton = null;
    this.__CurrentTabUserData = null;
}

CHeadTabPanel.prototype = new BiComponent;
CHeadTabPanel.prototype._className = "CHeadTabPanel";

CHeadTabPanel.prototype.initObject = function(application, parent, userData)
{
    this.__EliApplication = application;
    this.__Parent = parent;
    this.__UserData = userData;
    this._init();
};

CHeadTabPanel.prototype._init = function()
{
    this._initTabPanel();
    this._initCurrentTabButton();
};

CHeadTabPanel.prototype._initTabPanel = function()
{
    var left = 0;
    var length = this.__UserData.length;

    if(0 == length)
    {
        return;
    }

    for(var i=0; i<length; i++)
    {
        this._initSingleTab(i, this.__UserData[i], left);
        left += this.__PanelSize.width;
    }

    this.setWidth(left);
};

CHeadTabPanel.prototype._initSingleTab = function(userData,text, left)
{
    this.__SingleTab = new BiLabel();
    this.__SingleTab.setId();
    this.__SingleTab.setUserData(userData);
    this.__SingleTab.setText(text);
    this.__SingleTab.setCssClassName("eli-statements-tab");
    this.__SingleTab.setWidth(this.__PanelSize.width);
    this.__SingleTab.setHeight(this.__PanelSize.height);
    this.__SingleTab.setTop(0);
    this.__SingleTab.setLeft(left);
    this.__SingleTab.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.height));
    this.__SingleTab.addEventListener("click", function () {
        this._onSingleTabClick(userData);
    }, this);
    this.add(this.__SingleTab);

    this.__TabHash.add(userData, this.__SingleTab);
};

CHeadTabPanel.prototype._initCurrentTabButton = function()
{
    this.__CurrentTabUserData = 0
    this.__CurrentTabButton = this.__TabHash.item(this.__CurrentTabUserData);
    this.__CurrentTabButton.setCssClassName("eli-statements-tab-select");
};

CHeadTabPanel.prototype._onSingleTabClick = function(userData)
{
    this.updateCurrentTabButton(userData);
    this.__Parent.getStatementsData(userData);
};

CHeadTabPanel.prototype.updateCurrentTabButton = function(userData)
{
    this.__CurrentTabButton.setCssClassName("eli-statements-tab");
    this.__CurrentTabButton = this.__TabHash.item(userData);
    this.__CurrentTabButton.setCssClassName("eli-statements-tab-select");
    this.__CurrentTabUserData = userData;
};








