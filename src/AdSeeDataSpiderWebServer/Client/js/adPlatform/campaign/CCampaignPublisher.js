/**
 * Created by yangtian on 16/10/20.
 */
function CCampaignPublisher()
{
    BiComponent.call(this);
    this.setId(newGuid());

    this.__PanelTop = 0;
    this.__PanelSize = {
        buttonHeight : 45,
        labelSpace : 5,
    };

    this.__ImgHashTable = new BiHashTable();
    this.__ImgStatus = new BiHashTable();
}

CCampaignPublisher.prototype = new BiComponent;
CCampaignPublisher.prototype._className = "CCampaignPublisher";

CCampaignPublisher.prototype.initObject = function(options)
{
    this.__Options = options;
    this._init();
};

CCampaignPublisher.prototype._init = function()
{
    this._createPublishers(this.__Options);
    this.setHeight(this.__PanelTop);
};

CCampaignPublisher.prototype._createPublishers = function(options)
{
    var len = options.length;
    for(var i=0; i<len; i++)
    {
        this._createPublisherPanel(options[i], this.__PanelTop, this.__PanelSize.buttonHeight, options[i]);
    }
};

CCampaignPublisher.prototype._createPublisherPanel = function(userData, top, height, text)
{
    var panel = new BiComponent();
    panel.setId(newGuid());
    panel.setCssClassName("eli-group-publisher");
    panel.setUserData(userData);
    panel.setLeft(0);
    panel.setTop(top);
    panel.setRight(0);
    panel.setHeight(height);
    panel.addEventListener("click", function () {
        this._onCheckButtonClick(userData);
    }, this);

    this.__PanelTop = this.__PanelTop + height;

    var image = new BiComponent();
    image.setId(newGuid());
    image.setCssClassName("eli-group-check-off");
    image.setLeft(0);
    image.setTop(0);
    image.setWidth(height);
    image.setHeight(height);
    panel.add(image);
    this.__ImgHashTable.add(userData, image);
    this.__ImgStatus.add(userData, false);
    this.add(panel);

    var textLabel = new BiLabel();
    textLabel.setId(newGuid());
    textLabel.setText(text);
    textLabel.setCssClassName("eli-group-radio-text");
    textLabel.setLeft(image.getLeft()+image.getWidth() + this.__PanelSize.labelSpace);
    textLabel.setRight(0);
    textLabel.setTop(0);
    textLabel.setBottom(0);
    textLabel.setStyleProperty("line-height", sprintf("%dpx", height));
    panel.add(textLabel);
};

CCampaignPublisher.prototype._onCheckButtonClick = function(userData)
{
    var imgLabel= this.__ImgHashTable.item(userData);
    var imgStatus = this.__ImgStatus.item(userData);
    this.__ImgStatus.remove(userData);
    this.__ImgStatus.add(userData, !imgStatus);
    if(imgStatus)
    {
        imgLabel.setCssClassName("eli-group-check-off");
    }
    else{
        imgLabel.setCssClassName("eli-group-check-on");
    }
};

CCampaignPublisher.prototype.getPublishersHeight = function()
{
    return this.__PanelTop;
};

CCampaignPublisher.prototype.getCheckStatus = function()
{
    return this.__ImgStatus;
};

