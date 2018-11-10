/**
 * Created by mac on 16/10/11.
 */

function CRadioGroup()
{
    BiComponent.call(this);
    this.setId(newGuid());
    this.setCssClassName("eli-group-radio");

    this.__Options = null;

    this.__CurrentButton = null;

    this.__ButtonSize = {
        buttonHeight : 45,
        labelSpace : 5,
    };
    this.__buttonTop = 0;

    this.__ButtonHash = new BiHashTable();
}

CRadioGroup.prototype = new BiComponent;
CRadioGroup.prototype._cssClassName = "CRadioGroup";

CRadioGroup.prototype.initObject = function(options)
{
    this.__Options = options;
    this._init();
};

CRadioGroup.prototype._init = function()
{
    this._createRadioGroup(this.__Options);
    this._initCurrentButton();
    this.setHeight(this.__buttonTop);
};

CRadioGroup.prototype._initCurrentButton = function()
{
    this.__CurrentButton = this.__ButtonHash.item(0);
    this.__CurrentButton.setCssClassName("eli-group-radio-on");
};

CRadioGroup.prototype._createRadioGroup = function(options)
{
    var len = options.length;
    for(var i=0; i<len; i++)
    {
        this._createRadioButton( i, this.__buttonTop, this.__ButtonSize.buttonHeight, options[i]);
    }
};

CRadioGroup.prototype._createRadioButton = function(index, top, height, text)
{
    var panel = new BiComponent();
    panel.setId(newGuid());
    panel.setCssClassName("eli-group-radio");
    panel.setUserData(index);
    panel.setLeft(0);
    panel.setRight(0);
    panel.setTop(top);
    panel.setHeight(height);
    panel.addEventListener("click", function () {
        this._onRadioButtonClick(index);
    }, this);
    this.__buttonTop = this.__buttonTop + height;

    this.add(panel);

    var image = new BiComponent();
    image.setId(newGuid());
    image.setCssClassName("eli-group-radio-off");
    image.setLeft(0);
    image.setTop(0);
    image.setWidth(height);
    image.setHeight(height);
    panel.add(image);
    this.__ButtonHash.add(index, image);

    var textLabel = new BiLabel();
    textLabel.setId(newGuid());
    textLabel.setText(text);
    textLabel.setCssClassName("eli-group-radio-text");
    textLabel.setLeft(image.getLeft()+image.getWidth() + this.__ButtonSize.labelSpace);
    textLabel.setRight(0);
    textLabel.setTop(0);
    textLabel.setBottom(0);
    textLabel.setStyleProperty("line-height", sprintf("%dpx", height));
    panel.add(textLabel);
};

CRadioGroup.prototype._onRadioButtonClick = function(index)
{
    this.__CurrentButton.setCssClassName("eli-group-radio-off");
    this.__CurrentButton = this.__ButtonHash.item(index);
    this.__CurrentButton.setCssClassName("eli-group-radio-on");
};

CRadioGroup.prototype.getRadioGroupHeight = function()
{
    return this.__buttonTop;
};

CRadioGroup.prototype.getCurrentButtonUserData = function()
{
    return this.__CurrentButton.getUserData();
};

CRadioGroup.prototype.clearSelectedStatus = function()
{
    this._initCurrentButton();
};
