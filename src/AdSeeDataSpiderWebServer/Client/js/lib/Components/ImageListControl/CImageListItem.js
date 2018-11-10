/**
 * Created by zengtao on 2/7/17.
 */

function CImageListItem()
{
    BiComponent.call(this); //call super
    this.setId(newGuid());
    this.setCssClassName("eli-image-list-item");

    this.__Title
    this.__Size = null;
    this.__ImageComponent = null;

    this.__TitleComponent = null;
    this.__UserData = null;
}

CImageListItem.prototype = new BiComponent;
CImageListItem.prototype._className = "CImageListItem";

CImageListItem.prototype.initObject = function(size)
{
    this.__Size = size;
    this.setWidth(this.__Size.Width);
    this.setHeight(this.__Size.Height);
    this.__init();
};

CImageListItem.prototype.__init = function()
{
    this.__ImageComponent = new BiComponent();
    this.__ImageComponent.setId(newGuid());
    this.__ImageComponent.setCssClassName("eli-image-list-item-image");
    this.__ImageComponent.setLeft(0);
    this.__ImageComponent.setTop(0);
    this.__ImageComponent.setRight(0);
    this.__ImageComponent.setBottom(0);
    this.add(this.__ImageComponent);

    this.__TitleComponent = new BiLabel();
    this.__TitleComponent.setId(newGuid());
    this.__TitleComponent.setCssClassName("eli-image-list-item-title");
    this.__TitleComponent.setBottom(0);
    this.__TitleComponent.setLeft(0);
    this.__TitleComponent.setRight(0);
    this.__TitleComponent.setHeight(30);
    this.add(this.__TitleComponent);
};

CImageListItem.prototype.setData = function(userData)
{
    if(!userData)
    {
        return;
    }

    this.__UserData = userData;
    if(userData.getImage)
    {
        this.__ImageComponent.setBackgroundImage(userData.getImage());
    }

    if(userData.getTitle)
    {
        this.__TitleComponent.setText(userData.getTitle());
        this.setHtmlProperty("title", userData.getTitle());
    }

    return;
};

CImageListItem.prototype.getData = function()
{
    return this.__UserData;
};

CImageListItem.prototype.setSelected = function()
{
    this.setCssClassName("eli-image-list-item-selected");
};

CImageListItem.prototype.setNoneSelected = function()
{
    this.setCssClassName("eli-image-list-item");
};