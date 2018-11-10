/**
 * Created by yangtian on 16/9/21.
 */
function CBasicInfoComponent()
{
    BiComponent.call(this);
    this.setCssClassName("eli-campaign-basic-panel");

    this.__PanelHeight = 35;
    this.__PanelWidth = 580;
    this.__PanelLeft = 150;

    this.__LastPanelBottom = 30;
    this.__ButtonTop = null;

    this.__UserData = {
        basicInfoTitle : "basicInfoTitle",
        campaignName : "campaignName",
        campaignType : "campaignType",
        urlAddress : "urlAddress",
        budget : "budget",
        timeSchedule : "timeSchedule",
        publisher : "publisher",
        showAdvanceText : "showAdvanceText",
        hideAdvanceText : "hideAdvanceText",
        createCampaignButton : "createCampaignButton"

    };

    this.__Content = {
        basicInfoTitle : "基本信息",
        campaignName : "推广名称",
        campaignType : "推广类型",
        urlAddress : "URL地址",
        budget : "推广预算",
        timeSchedule : "投放时段",
        publisher : "投放媒体",
        showAdvanceText : "显示更多高级选项",
        hideAdvanceText : "隐藏高级选项",
        createCampaignButton : "创建计划"
    };

    this.__PanelSize = {
        panelSpace : 10,
        infoTitleLeft : 0,
        infoTitleWidth : 160,
        infoTitleHeight : 40,

        panelLeft : 150,
        panelWidth : 580,
        panelHeight : 45,
        nameLabelWidth : 165,

        promptWidth : 35,

        msgLabelWidth : 200,
        msgLabelHeight : 45

    };

    this.__BasicPromptText = {
        campaignName : "",
        campaignType : "推广类型",
        urlAddress : "URL地址",
        budget : "推广预算",
        timeSchedule : "投放时段",
        publisher : "投放媒体"
    };

    this.__BasicHolder = {
        campaignNameHolder : "请输入推广计划的名称",
        urlHolder : "请输入App或网站的URL地址",
        budgetHolder : "请输入推广计划的预算,不低于10000",
    };

    this.__Options = ["app", "website"];
    this.__Publishers = ["Facebook", "Google", "Instagram", "Youtube"];

    this.__InfoPanelHash = new BiHashTable();
    this.__InfoLabelHash = new BiHashTable();
    this.__InfoPromptHash = new BiHashTable();
    this.__InfoSelectHash = new BiHashTable();
    this.__InputLabelHash = new BiHashTable();
    this.__MsgLabelHash = new BiHashTable();

    this.__BasicInputComponentHash = new BiHashTable();

    this.__AdvanceHash = new BiHashTable();
    this.__AdvanceInfoComponent = null;
    this.__CurrentButton = null;
    this.__ButtonComponentTop = null;
    this.__BasicStatus = true;

    this.__RadioGroupComponent = null;

    this.__CallTag = "getPublishers";
}

CBasicInfoComponent.prototype = new BiComponent;
CBasicInfoComponent.prototype._className = "CBasicInfoComponent";

CBasicInfoComponent.prototype.initObject = function(eliApplication, parent)
{
    this.__EliApplication = eliApplication;
    this.__Parent = parent;
    this.__Verfication = parent.getVerification();
    this._init();
};

CBasicInfoComponent.prototype._init = function ()
{
    this._initInfoPanel();
    this.__CampaignInfo = this.__Parent.getCampaignInfo();
    this._initPublishers();
};

CBasicInfoComponent.prototype._initInfoPanel = function()
{
    //basic title
    this._createInfoTitle(
        this.__UserData.basicInfoTitle,
        this.__Content.basicInfoTitle,
        this.__LastPanelBottom,
        this.__PanelSize.infoTitleLeft,
        this.__PanelSize.infoTitleWidth,
        this.__PanelSize.infoTitleHeight
    );

    //campaign name
    this._initSingleInputComponent(
        this.__LastPanelBottom,
        this.__PanelSize.panelLeft,
        this.__UserData.campaignName,
        this.__BasicHolder.campaignNameHolder,
        this.__Content.campaignName
    );

    //campaign type
    this._initCampaignTypeComponent(
        this.__LastPanelBottom,
        this.__PanelSize.panelLeft,
        this.__UserData.campaignType,
        this.__Content.campaignType
    );

    //campaign URL
    this._initSingleInputComponent(
        this.__LastPanelBottom,
        this.__PanelSize.panelLeft,
        this.__UserData.urlAddress,
        this.__BasicHolder.urlHolder,
        this.__Content.urlAddress
    );

    //budget

    this._initSingleInputComponent(
        this.__LastPanelBottom,
        this.__PanelSize.panelLeft,
        this.__UserData.budget,
        this.__BasicHolder.budgetHolder,
        this.__Content.budget
    );

    //schedule
    this._createSinglePanel(
        this.__UserData.timeSchedule,
        this.__Content.timeSchedule,
        this.__PanelSize.panelLeft,
        this.__LastPanelBottom,
        new CSize(this.__PanelSize.panelWidth, this.__PanelSize.panelHeight*2+20),
        this.__BasicPromptText.timeSchedule
    );

    //publisher
    this._createSinglePanel(
        this.__UserData.publisher,
        this.__Content.publisher,
        this.__PanelSize.panelLeft,
        this.__LastPanelBottom,
        new CSize(this.__PanelSize.panelWidth, this.__PanelSize.panelHeight*4),
        this.__BasicPromptText.publisher
    );

    this._createPublisherCheckBox();

    //button
    var buttonLeft = this.__PanelSize.panelLeft+this.__PanelSize.nameLabelWidth + this.__PanelSize.panelHeight;
    this._createButton(
        buttonLeft ,
        this.__LastPanelBottom,
        new CSize(this.__PanelSize.panelWidth, this.__PanelSize.panelHeight)
    );

    //cut line
    this._createCutLine(this.__LastPanelBottom);
};

CBasicInfoComponent.prototype._computeLastPanelBottom = function(panel, space)
{
    this.__LastPanelBottom = this.__LastPanelBottom + panel.getHeight()+space;
};

CBasicInfoComponent.prototype._initSingleInputComponent = function(top, left, userData, holderText, nameText)
{
    var inputComponent = new CSingleInputComponent();
    inputComponent.initObject(this, top, left, userData, holderText, nameText);
    this.add(inputComponent);
    this.__BasicInputComponentHash.add(userData, inputComponent);
    this._computeLastPanelBottom(inputComponent, this.__PanelSize.panelSpace);
};

CBasicInfoComponent.prototype._initCampaignTypeComponent = function(top, left, userData, nameText)
{
    var campaignTypeComponent = new CCampaignTypeComponent();
    campaignTypeComponent.initObject(this, top, left, userData, nameText);
    this.add(campaignTypeComponent);

    this.__BasicInputComponentHash.add(userData, campaignTypeComponent);
    this._computeLastPanelBottom(campaignTypeComponent, this.__PanelSize.panelSpace);
};

CBasicInfoComponent.prototype._createInfoTitle = function(userData, labelName, top, left, width , height)
{
    var infoTitle = new BiLabel();
    infoTitle.setId(newGuid());
    infoTitle.setUserData(userData);
    infoTitle.setText(labelName);
    infoTitle.setCssClassName("eli-campaign-basic-title-text");
    infoTitle.setTop(top);
    infoTitle.setLeft(left);
    infoTitle.setWidth(width);
    infoTitle.setHeight(height);
    this.add(infoTitle);
    this._computeLastPanelBottom(infoTitle, this.__PanelSize.panelSpace);

};

CBasicInfoComponent.prototype._createSinglePanel = function(userData, labelName, left, top, size, promptText)
{
    var panel = new BiComponent();
    panel.setId(newGuid());
    panel.setUserData(userData);
    panel.setCssClassName("eli-campaign-main-panel");
    panel.setLeft(left);
    panel.setTop(top);
    panel.setWidth(size.Width);
    panel.setHeight(size.Height);
    this.__InfoPanelHash.add(userData, panel);
    this.add(panel);

    var msgLabel = new BiLabel();
    msgLabel.setId(newGuid());
    msgLabel.setCssClassName("eli-msg-context");
    msgLabel.setLeft(panel.getLeft() + panel.getWidth() + this.__PanelSize.panelSpace);
    msgLabel.setTop(top);
    msgLabel.setWidth(this.__PanelSize.msgLabelWidth);
    msgLabel.setHeight(this.__PanelSize.msgLabelHeight);
    msgLabel.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.msgLabelHeight));
    msgLabel.setVisible(false);
    this.__MsgLabelHash.add(userData, msgLabel);
    this.add(msgLabel);

    this._createInfoPanel(userData, labelName, size.Height , panel, promptText);
    this._computeLastPanelBottom(panel, this.__PanelSize.panelSpace);
};

CBasicInfoComponent.prototype._createInfoPanel = function(userData, name, height, parent, promptText)
{
    var nameLabel = new BiLabel();
    nameLabel.setCssClassName("eli-campaign-label-text");
    nameLabel.setId(newGuid());
    nameLabel.setUserData(userData);
    nameLabel.setText(name);
    nameLabel.setTop(0);
    nameLabel.setBottom(0);
    nameLabel.setLeft(0);
    nameLabel.setWidth(this.__PanelSize.nameLabelWidth);
    nameLabel.setStyleProperty("line-height", sprintf("%dpx", height));
    this.__InfoLabelHash.add(userData, nameLabel);
    parent.add(nameLabel);

    var prompt = new BiComponent();
    prompt.setCssClassName("eli-campaign-prompt-image");
    prompt.setId(newGuid());
    prompt.setUserData(userData);
    prompt.setLeft(nameLabel.getLeft() + nameLabel.getWidth());
    prompt.setTop(0);
    prompt.setBottom(0);
    prompt.setWidth(this.__PanelSize.promptWidth);
    this.__InfoPromptHash.add(userData, prompt);
    parent.add(prompt);

    var selectPanel = new BiComponent();
    selectPanel.setCssClassName("eli-dashboard-tab-bar-panel");
    selectPanel.setId(newGuid());
    selectPanel.setUserData(userData);
    selectPanel.setLeft(prompt.getLeft()+prompt.getWidth());
    selectPanel.setTop(0);
    selectPanel.setBottom(0);
    selectPanel.setRight(0);
    this.__InfoSelectHash.add(userData,selectPanel);
    parent.add(selectPanel);
};

CBasicInfoComponent.prototype._createButton = function(left, top ,size)
{
    this.__ButtonComponent = new BiComponent();
    this.__ButtonComponent.setId(newGuid());
    this.__ButtonComponent.setUserData("show");
    this.__ButtonComponent.setCssClassName("eli-campaign-main-panel");
    this.__ButtonComponent.setTop(top);
    this.__ButtonComponent.setLeft(left);
    this.__ButtonComponent.setWidth(size.Width);
    this.__ButtonComponent.setHeight(size.Height);
    this.__ButtonComponent.setStyleProperty("line-height", sprintf("%dpx", size.Height));
    this.__AdvanceHash.add(this.__ButtonComponent.getUserData, this.__ButtonComponent);

    this.add(this.__ButtonComponent);
    this.__CurrentButton = this.__ButtonComponent;

    this._createShowAdvanceButton(0,0, new CSize(120 , this.__PanelHeight));
    this._createSubmitButton(220, 0, new CSize(110, this.__PanelHeight));
    this.__ButtonTop = this.__LastPanelBottom;
    this._computeLastPanelBottom(this.__ButtonComponent, this.__PanelSize.panelSpace);
};

CBasicInfoComponent.prototype._createShowAdvanceButton = function(left,top,size)
{
    this.__AdvanceLabel = new BiLabel();
    this.__AdvanceLabel.setId(newGuid());
    this.__AdvanceLabel.setUserData("show");
    this.__AdvanceLabel.setText(this.__Content.showAdvanceText);
    this.__AdvanceLabel.setCssClassName("eli-campaign-show-advance");
    this.__AdvanceLabel.setTop(top);
    this.__AdvanceLabel.setLeft(left);
    this.__AdvanceLabel.setWidth(size.Width);
    this.__AdvanceLabel.setHeight(size.Height);
    this.__AdvanceLabel.setStyleProperty("line-height", sprintf("%dpx", size.Height));
    this.__AdvanceLabel.addEventListener("click", function () {
        this._onAdvanceClick(this.__AdvanceLabel.getUserData());
    }, this);
    this.__ButtonComponent.add(this.__AdvanceLabel);
    this.__CurrentButton = this.__AdvanceLabel;
};

CBasicInfoComponent.prototype._createSubmitButton = function(right,top,size)
{
    this.__SubmitButton = new BiLabel();
    this.__SubmitButton.setId(newGuid());
    this.__SubmitButton.setText(this.__Content.createCampaignButton);
    this.__SubmitButton.setCssClassName("eli-complete-submit-button");
    this.__SubmitButton.setTop(top);
    this.__SubmitButton.setRight(right);
    this.__SubmitButton.setWidth(size.Width);
    this.__SubmitButton.setHeight(size.Height);
    this.__SubmitButton.setStyleProperty("line-height", sprintf("%dpx", size.Height));
    this.__ButtonComponent.add(this.__SubmitButton);
};

CBasicInfoComponent.prototype._createCutLine = function(top)
{
    this.__CutLine = new BiComponent();
    this.__CutLine.setId(newGuid());
    this.__CutLine.setCssClassName("eli-campaign-line-component");
    this.__CutLine.setRight(20);
    this.__CutLine.setHeight(3);
    this.__CutLine.setLeft(20);
    this.__CutLine.setTop(top);
    this.__CutLine.setVisible(false);
    this.add(this.__CutLine);
};


CBasicInfoComponent.prototype._onAdvanceClick = function(name)
{
    //this._createAdvanceInfoComponent();
    var advanceInfoComponent = this.__Parent.getAdvanceInfoComponent();

    var left = this.__PanelLeft+this.__PanelSize.nameLabelWidth+this.__PanelHeight;
    if(name == "show") {

        this.__ButtonComponentTop = advanceInfoComponent.getLastPanelBottom()+30+ this.__CutLine.getTop();
        this._updatePositionAndData(left, this.__ButtonComponentTop, "hide", this.__Content.hideAdvanceText);
        advanceInfoComponent.setVisible(true);
        this.__CutLine.setVisible(true);

    }
    else if(name == "hide" ) {
        this._updatePositionAndData(left, this.__ButtonTop, "show", this.__Content.showAdvanceText);
        advanceInfoComponent.setVisible(false);
        this.__CutLine.setVisible(false);
    }


};

CBasicInfoComponent.prototype._updatePositionAndData = function(left,top, data, text)
{
    this.__ButtonComponent.setLeft(left);
    this.__ButtonComponent.setTop(top);
    this.__ButtonComponent.setUserData(data);
    this.__AdvanceLabel.setText(text);
    this.__AdvanceLabel.setUserData(data);
};

CBasicInfoComponent.prototype.basicInfoCheck = function()
{
    this._initStatus();
    var campaignName = this.__InputLabelHash.item(this.__UserData.campaignName).getText();
    var msg = this.__Verfication.inputCheck(campaignName);
    if(msg != 0)
    {
        var msgLabel = this.__MsgLabelHash.item(this.__UserData.campaignName);
        msgLabel.setText(msg);
        msgLabel.setVisible(true);
        this.__BasicStatus = false;
    }

    var urlAddress = this.__InputLabelHash.item(this.__UserData.urlAddress).getText();
    msg = this.__Verfication.inputCheck(urlAddress);
    if(msg != 0)
    {
        var msgLabel = this.__MsgLabelHash.item(this.__UserData.urlAddress);
        msgLabel.setText(msg);
        msgLabel.setVisible(true);
        this.__BasicStatus = false;
    }

    var budget = this.__InputLabelHash.item(this.__UserData.budget).getText();
    msg = this.__Verfication.inputCheck(budget);
    if(msg != 0)
    {
        var msgLabel = this.__MsgLabelHash.item(this.__UserData.budget);
        msgLabel.setText(msg);
        msgLabel.setVisible(true);
        this.__BasicStatus = false;
    }

    if(!this.__BasicStatus)
    {
        return ;
    }

    alert("success");
};

CBasicInfoComponent.prototype._initStatus = function()
{
    this.__BasicStatus = true;
    var labels = this.__MsgLabelHash.getValues();
    for(var i=0; i<labels.length; i++)
    {
        labels[i].setVisible(false);
        labels[i].setText("");
    }
};

CBasicInfoComponent.prototype._initPublishers = function()
{
    this.__CampaignInfo.getPublisher(
        this.__EliApplication.getAccessToken(),
        this.__CallTag,
        this._getPublishersCallBack
    );
};

CBasicInfoComponent.prototype._getPublishersCallBack = function(response)
{
    var errorCode = parseInt(response.errorCode);
    if(0 == errorCode)
    {

    }
};

CBasicInfoComponent.prototype._createPublisherCheckBox = function()
{
    if(!this.__PublisherCheckBox)
    {
        this.__PublisherCheckBox = new CCampaignPublisher();
        this.__PublisherCheckBox.initObject(this.__Publishers);
        this.__PublisherCheckBox.setCssClassName("eli-group-publisher");
        this.__PublisherCheckBox.setLeft(0);
        this.__PublisherCheckBox.setRight(0);
        this.__PublisherCheckBox.setTop(0);
        //var height = this.__PublisherCheckBox.getPublishersHeight();
        var panel = this.__InfoSelectHash.item(this.__UserData.publisher);
        panel.add(this.__PublisherCheckBox);
    }
};

CBasicInfoComponent.prototype.getLastPanelBottom = function()
{
    return this.__LastPanelBottom;
};

CBasicInfoComponent.prototype.getUserData = function()
{
    return this.__UserData;
};

CBasicInfoComponent.prototype.getInputLabelHash = function()
{
    return this.__InputLabelHash;
};

CBasicInfoComponent.prototype.getSubmitButton = function()
{
    return this.__SubmitButton;
};

CBasicInfoComponent.prototype.getRadioGroupValue = function()
{

};

CBasicInfoComponent.prototype.getBasicInfoValues = function()
{

};





