/**
 * Created by fact  zengtao on 10/2/15 9:32 AM.
 */

function CMessageBox()
{
    BiDialog.call(this);

}

CMessageBox.prototype = new BiDialog;
CMessageBox.prototype._className = "CMessageBox";

CMessageBox.prototype.initObject = function(owner, size, messageBoxType, dialogResultEvent)
{
    this.__Owner = owner;
    this.__Size = size;
    this.__DialogResultEvent = dialogResultEvent;
    this.setId(newGuid());
    this.setDisposeOnClose(false);
    this.setWidth(this.__Size.Width);
    this.setHeight(this.__Size.Height);
    this.addEventListener("dialogresult", function(event){
        if(this.__DialogResultEvent)
        {
            this.__DialogResultEvent(event);
        }
    }, this);
    this.setCentered(true);

    this.__MESSAGE_CONTENT_COMPONENT_HEIGHT = 40;

    this.__ICON_SIZE = new CSize(this.__MESSAGE_CONTENT_COMPONENT_HEIGHT, this.__MESSAGE_CONTENT_COMPONENT_HEIGHT);
    this.__MessageBoxType = messageBoxType;
    this.__Caption = null;
    this.__MessageData = null;
    this.__ContentPanel = null;
    this.__init();
};

CMessageBox.prototype.registerDialogResultEvent = function(event)
{
    this.__DialogResultEvent = event;
};

CMessageBox.prototype.__init = function()
{
    this.__ContentPanel = this.getContentPane();
    this.__ContentPanel.setId(newGuid());
    this.getWireFrame().setId(newGuid());
    this.__initMessageBoxByType();
};

CMessageBox.prototype.showMessage = function(caption, data)
{
    this.__Caption = caption;
    this.__MessageData = data;
    this.__updateMessage();
};

CMessageBox.prototype.updateProgress = function(progressValue)
{
    if(this.__MessageBoxType != MESSAGE_BOX_TYPE.PROGRESS)
    {
        return;
    }
    this.__MessageData = progressValue;
    this.__QueryProgressBar.setValue(parseInt(this.__MessageData));
};

CMessageBox.prototype.__initMessageBoxByType = function()
{
    switch (this.__MessageBoxType)
    {
        case MESSAGE_BOX_TYPE.ERROR:
        case MESSAGE_BOX_TYPE.INFO:
            this.__initMessageBox();
            break;
        case MESSAGE_BOX_TYPE.PROGRESS:
            this.__initProgressMessageBox();
            break;
        default :
            break;
    }
};

CMessageBox.prototype.__updateMessage = function()
{
    this.setCaption(this.__Caption);
    switch (this.__MessageBoxType)
    {
        case MESSAGE_BOX_TYPE.ERROR:
        case MESSAGE_BOX_TYPE.INFO:
            this.__MessageLabel.setText(this.__MessageData);
            break;
        case MESSAGE_BOX_TYPE.PROGRESS:
            this.__QueryProgressBar.setValue(parseInt(this.__MessageData));
            break;
        default :
            break;
    }
};

CMessageBox.prototype.__initMessageBox = function()
{
    if(!this.__PageContainerComponent)
    {
        this.__PageContainerComponent = new BiComponent();
        this.__PageContainerComponent.setId(newGuid());
        this.__PageContainerComponent.setStyleProperty("left", sprintf("%dpx", 0));
        this.__PageContainerComponent.setStyleProperty("top", sprintf("%dpx", 0));
        this.__PageContainerComponent.setStyleProperty("right", sprintf("%dpx", 0));
        this.__PageContainerComponent.setStyleProperty("height", sprintf("%dpx", this.__MESSAGE_CONTENT_COMPONENT_HEIGHT));
        this.__ContentPanel.add(this.__PageContainerComponent);

        this.__InfoIcon = new BiComponent();
        this.__InfoIcon.setId(newGuid());
        this.__InfoIcon.setCssClassName((this.__MessageBoxType == MESSAGE_BOX_TYPE.ERROR ? "fact-message-box-error-icon" : "fact-message-box-info-icon"));
        this.__InfoIcon.setStyleProperty("left", sprintf("%dpx", 0));
        this.__InfoIcon.setStyleProperty("top", sprintf("%dpx", 0));
        this.__InfoIcon.setStyleProperty("width", sprintf("%dpx", this.__ICON_SIZE.Width));
        this.__InfoIcon.setStyleProperty("height", sprintf("%dpx", this.__ICON_SIZE.Height));
        this.__PageContainerComponent.add(this.__InfoIcon);

        this.__MessageLabel = new BiLabel();
        this.__MessageLabel.setId(newGuid());
        this.__MessageLabel.setCssClassName((this.__MessageBoxType == MESSAGE_BOX_TYPE.ERROR ? "fact-message-box-error-info":"fact-message-box-message-info"));
        this.__MessageLabel.setStyleProperty("left", sprintf("%dpx", this.__ICON_SIZE.Width));
        this.__MessageLabel.setStyleProperty("top", sprintf("%dpx", 0));
        this.__MessageLabel.setStyleProperty("right", sprintf("%dpx", 0));
        this.__MessageLabel.setStyleProperty("height", sprintf("%dpx", this.__MESSAGE_CONTENT_COMPONENT_HEIGHT));
        this.__MessageLabel.setAlign("justify");
        this.__MessageLabel.setWrap("true");
        this.__PageContainerComponent.add(this.__MessageLabel);
    }

    if(!this.__BottomComponent)
    {
        this.__BottomComponent = new BiComponent();
        this.__BottomComponent.setId(newGuid());
        this.__BottomComponent.setStyleProperty("left", sprintf("%dpx", 0));
        this.__BottomComponent.setStyleProperty("top", sprintf("%dpx", this.__MESSAGE_CONTENT_COMPONENT_HEIGHT));
        this.__BottomComponent.setStyleProperty("right", sprintf("%dpx", 0));
        this.__BottomComponent.setStyleProperty("bottom", sprintf("%dpx", 0));
        this.__ContentPanel.add(this.__BottomComponent);

        this.__OKButton = new BiLabel();
        this.__OKButton.setId(newGuid());
        this.__OKButton.setStyleProperty("left", "40%");
        this.__OKButton.setStyleProperty("top", "15%");
        this.__OKButton.setStyleProperty("width", sprintf("%dpx", 80));
        this.__OKButton.setStyleProperty("height", sprintf("%dpx", 30));
        this.__OKButton.setCssClassName("fact-button");
        this.__OKButton.setAlign("center");
        this.__OKButton.setText(SYSTEM_CONST_VARIABLE.MESSAGE_BOX_OK_LABEL);
        this.__OKButton.addEventListener("click", function(evnet){
            this.close();
        }, this);
        this.__BottomComponent.add(this.__OKButton);
    }
};

CMessageBox.prototype.__initProgressMessageBox = function()
{
    this.setCaption(this.__Caption);
    if(!this.__PageContainerComponent)
    {
        this.__PageContainerComponent = new BiComponent();
        this.__PageContainerComponent.setId(newGuid());
        this.__PageContainerComponent.setLeft(0);
        this.__PageContainerComponent.setTop(0);
        this.__PageContainerComponent.setRight(0);
        this.__PageContainerComponent.setHeight(this.__MESSAGE_CONTENT_COMPONENT_HEIGHT);
        this.__ContentPanel.add(this.__PageContainerComponent);

        this.__InfoIcon = new BiComponent();
        this.__InfoIcon.setId(newGuid());
        this.__InfoIcon.setCssClassName("fact-message-box-progress");
        this.__InfoIcon.setLeft(0);
        this.__InfoIcon.setTop(0);
        this.__InfoIcon.setWidth(this.__ICON_SIZE.Width);
        this.__InfoIcon.setHeight(this.__ICON_SIZE.Height);
        this.__PageContainerComponent.add(this.__InfoIcon);

        this.__QueryProgressBar = new BiProgressBar(0);
        this.__QueryProgressBar.setId(newGuid());
        this.__QueryProgressBar.setLeft(this.__ICON_SIZE.Width);
        this.__QueryProgressBar.setTop(0);
        this.__QueryProgressBar.setRight(0);
        this.__QueryProgressBar.setBottom(0);
        this.__QueryProgressBar.setMaximum(100);
        this.__QueryProgressBar.setMinimum(0);
        this.__PageContainerComponent.add(this.__QueryProgressBar);
    }

    if(!this.__BottomComponent)
    {
        this.__BottomComponent = new BiComponent();
        this.__BottomComponent.setId(newGuid());
        this.__BottomComponent.setLeft(0);
        this.__BottomComponent.setTop(this.__MESSAGE_CONTENT_COMPONENT_HEIGHT);
        this.__BottomComponent.setRight(0);
        this.__BottomComponent.setBottom(0);
        this.__ContentPanel.add(this.__BottomComponent);

        this.__CancelButton = new BiLabel();
        this.__CancelButton.setId(newGuid());
        this.__CancelButton.setCssClassName("fact-button");
        this.__CancelButton.setStyleProperty("left", "40%");
        this.__CancelButton.setStyleProperty("top", "15%");
        this.__CancelButton.setStyleProperty("width", sprintf("%dpx", 80));
        this.__CancelButton.setStyleProperty("height", sprintf("%dpx", 30));

        this.__CancelButton.setAlign("center");
        this.__CancelButton.setText(SYSTEM_CONST_VARIABLE.MESSAGE_BOX_STOP_SEARCH_LABEL);
        this.__CancelButton.addEventListener("click", function(evnet){
            if(this.__Owner.abort)
            {
                this.__Owner.abort();
            }
            this.close();
        }, this);
        this.__BottomComponent.add(this.__CancelButton);
    }
};

CMessageBox.prototype.getMessageData = function()
{
    return this.__MessageData;
};