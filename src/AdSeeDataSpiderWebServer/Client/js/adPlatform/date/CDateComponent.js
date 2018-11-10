/**
 * Created by yangtian on 16/10/28.
 */
function CDateComponent()
{
    BiDatePicker.call(this);
    this.setId(newGuid());
    this.setWidth(200);
    this.setHeight(40);
}

CDateComponent.prototype = new BiDatePicker();
CDateComponent.prototype._className = "CDateComponent";

CDateComponent.prototype.initObject = function(application, parent)
{
    this.__EliApplication = application;
    this.__Parent = parent;
    this._init();
};

CDateComponent.prototype._init = function()
{
    this.getTextField().setReadOnly(true);
    this.getTextField().setCssClassName("eli-date-text");
};

CDateComponent.prototype.updatePlaceholderText = function(text)
{
    this.getTextField().setHtmlProperty("placeholder", text);
};

CDateComponent.prototype.getUserSelectedDate = function()
{
    return this.getSelectedDate();
};