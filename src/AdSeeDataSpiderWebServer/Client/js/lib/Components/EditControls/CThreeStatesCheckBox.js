/**
 * Created by zengtao on 1/16/16.
 */

function CThreeStatesCheckBox()
{
    BiLabel.call(this); //call super

}

CThreeStatesCheckBox.prototype = new BiLabel;
CThreeStatesCheckBox.prototype._className = "CThreeStatesCheckBox";

CThreeStatesCheckBox.THREE_STATES=
{
    SELECT_ALL:0,
    SELECT_ANYONE:1,
    SELECT_NOTHING:2
};

CThreeStatesCheckBox.prototype.initObject = function(location, size, text, value, caller, onClickCallbackEvent)
{
    this.__Size = size;
    this.__Text = text;
    this.__Value = value;
    this.__OnClickCallbackEvent = onClickCallbackEvent;
    this.__Caller = caller;
    this.__CurrentState = THREE_STATES_CHECK_SELECTED_STATE.SELECT_ALL;
    this.setId(newGuid());
    this.setIconPosition("left");
    this.setStyleProperty("left", sprintf("%dpx", location.x));
    this.setStyleProperty("top", sprintf("%dpx", location.y));
    this.setStyleProperty("width", sprintf("%dpx", this.__Size.Width));
    this.setStyleProperty("height", sprintf("%dpx", this.__Size.Height));
    this.setCssClassName("fact-checkbox-item-component");
    this.__SelectedImage = null;
    this.__UnSelectedImage = null;
    this.__init();
};

CThreeStatesCheckBox.prototype.__init = function()
{
    this.setText(this.__Text);
    this.setUserData(this.__Value);
    this.__SelectedImage = new BiImage("/images/controls/checked_32.png", 24, 24);
    this.__UnSelectedImage = new BiImage("/images/controls/unchecked_32.png", 24, 24);
    this.__SelectedAnyoneImage = new BiImage("/images/controls/selected_anyone.png", 24,24);
    this.addEventListener("click", function(event){
        if(this.__CurrentState == CThreeStatesCheckBox.THREE_STATES.SELECT_ALL)
        {
            this.__CurrentState = CThreeStatesCheckBox.THREE_STATES.SELECT_NOTHING;
        }
        else
        {
            this.__CurrentState = CThreeStatesCheckBox.THREE_STATES.SELECT_ALL;
        }

        this.__updateSelectedState();
        if(this.__OnClickCallbackEvent)
        {
            this.__OnClickCallbackEvent(this.__Caller, this.__CurrentState);
        }
    }, this);
    this.__updateSelectedState();
};

CThreeStatesCheckBox.prototype.__updateSelectedState = function()
{
    switch (this.__CurrentState)
    {
        case CThreeStatesCheckBox.THREE_STATES.SELECT_ALL:
            this.setIcon(this.__SelectedImage);
            break;
        case CThreeStatesCheckBox.THREE_STATES.SELECT_ANYONE:
            this.setIcon(this.__SelectedAnyoneImage);
            break;
        case CThreeStatesCheckBox.THREE_STATES.SELECT_NOTHING:
            this.setIcon(this.__UnSelectedImage);
            break;
        default:
            this.setIcon(this.__UnSelectedImage);
            break;
    }
};

CThreeStatesCheckBox.prototype.setCheckBoxText = function(text)
{
    this.setText(text);
};

CThreeStatesCheckBox.prototype.getFieldValue = function()
{
    return this.__CurrentState;
};

CThreeStatesCheckBox.prototype.getUserData = function()
{
    return this.__CurrentState;
};

CThreeStatesCheckBox.prototype.setSelectedState = function(state)
{
    this.__CurrentState = state;
    this.__updateSelectedState();
};

CThreeStatesCheckBox.prototype.initControl = function()
{
    this.__CurrentState = CThreeStatesCheckBox.THREE_STATES.SELECT_ALL;
    this.__updateSelectedState();
};