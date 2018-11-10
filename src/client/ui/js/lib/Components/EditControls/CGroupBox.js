/**
 * Created by zengtao on 2016/4/2.
 */

function CGroupBox()
{
    BiComponent.call(this); //call super
    this.setId(newGuid());
    this.setCssClassName("fact-group-box");
    this.__TITLE_HEIGHT = 30;
    this.__GROUP_BOX_TITLE_WIDTH = 120;
    this.__GROUP_BOX_TITLE_HEIGHT = 30;
}

CGroupBox.prototype = new BiComponent;
CGroupBox.prototype._className = "CGroupBox";

CGroupBox.prototype.initObject = function(location, size, title)
{
    this.__Location = location;
    this.__Size = size;
    this.__Title = title;
    this.setLeft(this.__Location.x);
    this.setTop(this.__Location.y);
    if(this.__Size.Width > -1)
    {
        this.setWidth(this.__Size.Width);
    }
    else
    {
        this.setRight(0);
    }

    if(this.__Size.Height > -1)
    {
        this.setHeight(this.__Size.Height);
    }
    else
    {
        this.setBottom(0);
    }

    this.__TitleComponent = null;
    this.__GroupBoxContentPanel = null;

    this.__ItemTable = null;
    this.__init();
};

CGroupBox.prototype.__init = function()
{
    this.__ItemTable = new BiHashTable();
    this.__TitleComponent = new BiLabel();
    this.__TitleComponent.setCssClassName("fact-beidou-history-display-config-group-title");
    this.__TitleComponent.setLeft(5);
    this.__TitleComponent.setTop(0);
    this.__TitleComponent.setHeight(this.__GROUP_BOX_TITLE_HEIGHT);
    this.__TitleComponent.setWidth(this.__GROUP_BOX_TITLE_WIDTH);
    this.__TitleComponent.setAlign("center");
    this.__TitleComponent.setText(this.__Title);
    this.add(this.__TitleComponent);

    this.__GroupBoxContentPanel = new BiComponent();
    this.__GroupBoxContentPanel.setCssClassName("fact-beidou-history-display-config-group-content-panel");
    this.__GroupBoxContentPanel.setLeft(5);
    this.__GroupBoxContentPanel.setTop(this.__GROUP_BOX_TITLE_HEIGHT - 1);
    this.__GroupBoxContentPanel.setRight(0);
    this.__GroupBoxContentPanel.setBottom(0);
    this.add(this.__GroupBoxContentPanel);
};

CGroupBox.prototype.addItem = function(itemControl)
{
    var itemId = itemControl.getId();
    if(this.__ItemTable.hasKey(itemId))
    {
        return false;
    }

    this.__GroupBoxContentPanel.add(itemControl);
    this.__ItemTable.add(itemId, itemControl);
    return true;
};

CGroupBox.prototype.getItem = function(itemId)
{
    if(this.__ItemTable.hasKey(itemId))
    {
        return this.__ItemTable.item(itemId);
    }

    return null;
};