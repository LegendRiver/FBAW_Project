/**
 * Created by fact  zengtao on 11/8/15 1:53 PM.
 */

function CCheckBox()
{
    BiLabel.call(this); //call super

}

CCheckBox.prototype = new BiLabel;
CCheckBox.prototype._className = "CCheckBox";

CCheckBox.prototype.initObject = function(location, size, text, value, isSelected)
{
    this.__Size = size;
    this.__Text = text;
    this.__Value = value;
    this.__IsSelected = isSelected;
    this.setId(newGuid());
    this.setIconPosition("left");
    this.setStyleProperty("left", sprintf("%dpx", location.x));
    this.setStyleProperty("top", sprintf("%dpx", location.y));
    this.setStyleProperty("width", sprintf("%dpx", this.__Size.Width));
    this.setStyleProperty("height", sprintf("%dpx", this.__Size.Height));
    this.setCssClassName("fact-checkbox-item-component");
    this.__SelectedImage = null;
    this.__UnSelectedImage = null;
    this.__Caller = null;
    this.__CallBackevent = null;
    this.__init();
};

CCheckBox.prototype.__init = function()
{
    this.setText(this.__Text);
    this.setUserData(this.__Value);
    this.__SelectedImage = new BiImage("/images/controls/checked_32.png", 24, 24);
    this.__UnSelectedImage = new BiImage("/images/controls/unchecked_32.png", 24, 24);
    this.addEventListener("click", function(event){
        this.__IsSelected = !this.__IsSelected;
        this.__updateSelectedState();

        if(this.__Caller && this.__CallBackevent)
        {
            this.__CallBackevent(this.__Caller, this.__IsSelected, this.__Value);
        }
    }, this);
    this.__updateSelectedState();
};

CCheckBox.prototype.registerClickCallbackEvent = function(caller, callBackEvent)
{
    this.__Caller = caller;
    this.__CallBackevent = callBackEvent;
};

CCheckBox.prototype.__updateSelectedState = function()
{
    if(this.__IsSelected)
    {
        this.setIcon(this.__SelectedImage);
    }
    else
    {
        this.setIcon(this.__UnSelectedImage);
    }
};

CCheckBox.prototype.getFieldValue = function()
{
    return this.__IsSelected;
};

CCheckBox.prototype.getUserData = function()
{
    return this.__Value;
};

CCheckBox.prototype.setSelectedState = function(isSelected)
{
    this.__IsSelected = isSelected;
    this.__updateSelectedState();
};

CCheckBox.prototype.initControl = function()
{
    this.__IsSelected = false;
    this.__updateSelectedState();
};
