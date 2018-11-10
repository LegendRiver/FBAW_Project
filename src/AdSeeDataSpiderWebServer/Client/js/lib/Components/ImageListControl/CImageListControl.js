/**
 * Created by zengtao on 2/7/17.
 */

function CImageListControl()
{
    BiComponent.call(this); //call super
    this.setId(newGuid());
    this.setCssClassName("eli-image-list");

    this.__Location = null;
    this.__Size = null;

    this.__ImageListItems = null;
}

CImageListControl.prototype = new BiComponent;
CImageListControl.prototype._className = "CImageListControl";

CImageListControl.prototype.initObject = function(location, size)
{
    this.__Location = location;
    this.__Size = size;
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

    this.__ImageListItems = [];
};

CImageListControl.prototype.addImageListItem = function(imageListItem)
{
    this.__ImageListItems.push(imageListItem);
    this.add(imageListItem);
};

CImageListControl.prototype.cleaItems = function()
{
    var imageItem = null;
    var itemNumber = this.__ImageListItems.length;
    for(var index = 0; index < itemNumber; ++index)
    {
        imageItem = this.__ImageListItems[index];
        if(imageItem)
        {
            this.remove(imageItem);
        }
    }

    this.__ImageListItems = [];
};
