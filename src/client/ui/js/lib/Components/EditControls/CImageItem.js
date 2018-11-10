/**
 * Created by fact  zengtao on 4/12/15 1:19 PM.
 */

function CImageItem()
{
    BiComponent.call(this); //call super
}

CImageItem.prototype = new BiComponent;
CImageItem.prototype._className = "CImageItem";

CImageItem.prototype.initObject = function(controlDef)
{
    this.__ControlDef = controlDef;
    this.setCssClassName(this.__ControlDef.CssClassName);
    this.setLeft(this.__ControlDef.Location.x);
    this.setTop(this.__ControlDef.Location.y);
    this.setWidth(this.__ControlDef.Size.Width);
    this.setHeight(this.__ControlDef.Size.Height);

    this._init();
};

CImageItem.prototype._init = function()
{
    if(this.__ControlDef.Id)
    {
        this.setId(this.__ControlDef.Id);
    }
    else
    {
        this.setId(newGuid());
    }

    this.ContentData = this.__ControlDef.DefaultImageUrl;
    this.__loadImage();
};

CImageItem.prototype.__loadImage = function()
{
    if(this.HeaderImage)
    {
        this.remove(this.HeaderImage);
        this.HeaderImage = null;
    }

    this.HeaderImage = new BiImage(this.ContentData);
    this.HeaderImage.setId(newGuid());
    this.HeaderImage.setLeft(2);
    this.HeaderImage.setTop(2);
    this.HeaderImage.setWidth(this.__ControlDef.Size.Width - 4);
    this.HeaderImage.setHeight(this.__ControlDef.Size.Height - 4);
    this.addEventListener("error", function(event){
        this.updateFieldValue(this.__ControlDef.DefaultImageUrl);
    }, this);

    this.addEventListener("load", function(event){
        writeLogMessage("INFO", "Load images....");
    });

    this.addEventListener("click", function(evnet){
        if(this.__ControlDef.Caller && this.__ControlDef.ActionEvent)
        {
            this.__ControlDef.ActionEvent(this.__ControlDef.Caller, this);
        }
    },this);
    this.add(this.HeaderImage);
};

CImageItem.prototype.updateFieldValue = function(fieldValue)
{
    this.ContentData  = fieldValue;
    this.__loadImage();
};

CImageItem.prototype.getFieldValue = function()
{
    return this.ContentData;
};

CImageItem.prototype.getFieldIndex = function()
{
    return this.__ControlDef.FieldIndex;
};