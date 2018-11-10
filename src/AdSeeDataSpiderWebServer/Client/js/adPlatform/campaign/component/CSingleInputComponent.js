/**
 * Created by yangtian on 16/12/31.
 */
function CSingleInputComponent()
{
    BiComponent.call(this);

    this.__PanelSize = {
        componentHeight : 45,
        componentWidth : 580,
        namePanelWidth : 165,

        panelSpace : 10,
        labelSpace : 35,
        msgLabelWidth : 200,
        msgLabelHeight : 45
    };
}

CSingleInputComponent.prototype = new BiComponent;
CSingleInputComponent.prototype._className = "CSingleInputComponent";

CSingleInputComponent.prototype.initObject = function(parent, top, left, userData, holderText, nameText)
{
    this.__Parent = parent;
    this.__Top = top;
    this.__Left = left;
    this.__UserData = userData;
    this.__HolderText = holderText;
    this.__NameText = nameText;

    this._init();
};

CSingleInputComponent.prototype._init =function()
{
    this._initComponentSize();
    this._initNamePanel();
    this._initInputPanel();
    this._initMessagePanel();
};

CSingleInputComponent.prototype._initComponentSize = function()
{
    this.setId(newGuid());
    this.setCssClassName("eli-campaign-input-component");
    this.setUserData(this.__UserData);
    this.setHeight(this.__PanelSize.componentHeight);
    this.setWidth(this.__PanelSize.componentWidth);
    this.setLeft(this.__Left);
    this.setTop(this.__Top);
};

CSingleInputComponent.prototype._initNamePanel = function()
{
    this.__NamePanel = new BiLabel();
    this.__NamePanel.setId(newGuid());
    this.__NamePanel.setUserData(this.__UserData);
    this.__NamePanel.setCssClassName("eli-campaign-label-text");
    this.__NamePanel.setText(this.__NameText);
    this.__NamePanel.setTop(0);
    this.__NamePanel.setBottom(0);
    this.__NamePanel.setLeft(0);
    this.__NamePanel.setWidth(this.__PanelSize.namePanelWidth);
    this.__NamePanel.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.componentHeight));
    this.add(this.__NamePanel);
};

CSingleInputComponent.prototype._initInputPanel = function()
{
    this.__InputPanel = new BiTextField();
    this.__InputPanel.setUserData(this.__UserData);
    this.__InputPanel.setId(newGuid());
    this.__InputPanel.setCssClassName("eli-campaign-input-component-text");
    this.__InputPanel.setLeft(this.__NamePanel.getLeft() + this.__NamePanel.getWidth() + this.__PanelSize.labelSpace);
    this.__InputPanel.setRight(0);
    this.__InputPanel.setTop(0);
    this.__InputPanel.setBottom(0);
    this.__InputPanel.setHtmlProperty("placeholder", this.__HolderText);
    this.add(this.__InputPanel);
};

CSingleInputComponent.prototype._initMessagePanel = function()
{
    this.__MsgLabel = new BiLabel();
    this.__MsgLabel.setId(newGuid());
    this.__MsgLabel.setUserData(this.__UserData);
    this.__MsgLabel.setCssClassName("eli-msg-context");
    this.__MsgLabel.setLeft(this.__InputPanel.getLeft() + this.__InputPanel.getWidth() + this.__PanelSize.panelSpace);
    this.__MsgLabel.setTop(top);
    this.__MsgLabel.setWidth(this.__PanelSize.msgLabelWidth);
    this.__MsgLabel.setHeight(this.__PanelSize.msgLabelHeight);
    this.__MsgLabel.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.msgLabelHeight));
    this.add(this.__MsgLabel);
};

CSingleInputComponent.prototype.getInputText = function()
{
    return this.__InputPanel.getText();
};

CSingleInputComponent.prototype.clearInputText = function()
{
    this.__InputPanel.setText("");
};

CSingleInputComponent.prototype.setMsgLabelText = function(text)
{
    this.__MsgLabel.setText(text);
};

CSingleInputComponent.prototype.clearMsgLabelText = function()
{
    this.__MsgLabel.setText("");
};
