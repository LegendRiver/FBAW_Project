/**
 * Created by yangtian on 16/9/19.
 */

function CAdvanceComponent()
{
    BiComponent.call(this);
    this.__BasicInfoLeft = 0;
    this.__BasicInfoTop = 30;
    this.__BasicInfoWidth = 160;
    this.__BasicInfoHeight = 40;

    this.__PanelSpace = 10;

    this.__LabelWidth = 165;
    this.__PanelHeight = 45;
    this.__PromptHeight = 35;
    this.__PanelWidth = 580;
    this.__PanelLeft = 150;

    ///////////////////////////
    this.__BudgetPercentPanelHeight = 200;
    this.__DeliveryTypePanelHeight = 90;

    this.__AdvanceContent = {
        budgetPercent : "预算占比",
        publisherBudget : "渠道预算占比",
        audienceTitle : "投放人群",
        locations : "投放地区",
        age : "年龄区间",
        gender : "性别",
        deliveryTitle : "投放",
        deliveryType : "投放类型"
    };

    this.__AdvanceUserData = {
        publisherBudget : "budgetPercent",
        locations : "locations",
        age : "age",
        gender : "gender",
        deliveryType : "deliveryType"
    };

    this.__AdvancePromptText = {
        publisherBudget : "publisherBudget",
        locations : "locations",
        age : "age",
        gender : "gender",
        deliveryType : "",
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

    this.__LastPanelBottom = 0;

    this.__InfoPanelHash = new BiHashTable();
    this.__InfoLabelHash = new BiHashTable();
    this.__InfoPromptHash = new BiHashTable();
    this.__InfoSelectHash = new BiHashTable();
    this.__MsgLabelHash = new BiHashTable();
}

CAdvanceComponent.prototype = new BiComponent;
CAdvanceComponent.prototype._className = "CAdvanceComponent";

CAdvanceComponent.prototype.initObject = function(eliApplication, parent)
{
    this.__EliApplication = eliApplication;
    this.__Parent = parent;
    this._init();
};

CAdvanceComponent.prototype._init = function()
{

    // basic info title
    this._createInfoTitlePanel(
        this.__AdvanceContent.budgetPercent,
        this.__BasicInfoTop,
        this.__BasicInfoLeft,
        this.__BasicInfoWidth,
        this.__BasicInfoHeight
    );

    // budget percent
    this._createSinglePanel(
        this.__AdvanceUserData.publisherBudget,
        this.__AdvanceContent.publisherBudget,
        this.__PanelLeft,
        this.__LastPanelBottom,
        new CSize(this.__PanelWidth, this.__BudgetPercentPanelHeight),
        this.__AdvancePromptText.publisherBudget
    );

    // audience title
    this._createInfoTitlePanel(
        this.__AdvanceContent.audienceTitle,
        this.__LastPanelBottom,
        this.__BasicInfoLeft,
        this.__BasicInfoWidth,
        this.__BasicInfoHeight
    );

    // locations
    this._createSinglePanel(
        this.__AdvanceUserData.locations,
        this.__AdvanceContent.locations,
        this.__PanelLeft,
        this.__LastPanelBottom,
        new CSize(this.__PanelWidth, this.__PanelHeight),
        this.__AdvancePromptText.locations
    );

    // age
    this._createSinglePanel(
        this.__AdvanceUserData.age,
        this.__AdvanceContent.age,
        this.__PanelLeft,
        this.__LastPanelBottom,
        new CSize(this.__PanelWidth, this.__PanelHeight),
        this.__AdvancePromptText.age
    );

    //gender
    this._createSinglePanel(
        this.__AdvanceUserData.gender,
        this.__AdvanceContent.gender,
        this.__PanelLeft,
        this.__LastPanelBottom,
        new CSize(this.__PanelWidth, this.__PanelHeight),
        this.__AdvancePromptText.gender
    );

    // delivery title
    this._createInfoTitlePanel(
        this.__AdvanceContent.deliveryTitle,
        this.__LastPanelBottom,
        this.__BasicInfoLeft,
        this.__BasicInfoWidth,
        this.__BasicInfoHeight
    );

    // delivery Type
    this._createSinglePanel(
        this.__AdvanceUserData.deliveryType,
        this.__AdvanceContent.deliveryType,
        this.__PanelLeft,
        this.__LastPanelBottom,
        new CSize(this.__PanelWidth, this.__DeliveryTypePanelHeight),
        this.__AdvancePromptText.deliveryType
    );

};


CAdvanceComponent.prototype._createInfoTitlePanel = function(title, top, left, width, height)
{
    var infoTitle = new BiLabel();
    infoTitle.setId(newGuid());
    infoTitle.setText(title);
    infoTitle.setCssClassName("eli-campaign-basic-title-text");
    infoTitle.setTop(top);
    infoTitle.setLeft(left);
    infoTitle.setWidth(width);
    infoTitle.setHeight(height);

    this.add(infoTitle);

    this._computeLastPanelBottom(infoTitle, this.__PanelSpace)
};

CAdvanceComponent.prototype._computeLastPanelBottom = function(panel, space)
{
    this.__LastPanelBottom = this.__LastPanelBottom + panel.getHeight()+space;
};

CAdvanceComponent.prototype._createSinglePanel = function(userData, labelName, left, top, size, promptText)
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
    this._computeLastPanelBottom(panel, this.__PanelSpace);
};

CAdvanceComponent.prototype._createInfoPanel = function(userData, name, height, parent, promptText)
{
    var nameLabel = new BiLabel();
    nameLabel.setCssClassName("eli-campaign-label-text");
    nameLabel.setId(newGuid());
    nameLabel.setUserData(userData);
    nameLabel.setText(name);
    nameLabel.setTop(0);
    nameLabel.setBottom(0);
    nameLabel.setLeft(0);
    nameLabel.setWidth(this.__LabelWidth);
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
    prompt.setWidth(this.__PromptHeight);
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
    this.__InfoSelectHash.add(selectPanel);
    parent.add(selectPanel);
};

CAdvanceComponent.prototype.getLastPanelBottom = function()
{
    return this.__LastPanelBottom;
};

CAdvanceComponent.prototype.advanceInfoCheck = function()
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

CAdvanceComponent.prototype._initStatus = function()
{
    this.__BasicStatus = true;
    var labels = this.__MsgLabelHash.getValues();
    for(var i=0; i<labels.length; i++)
    {
        labels[i].setVisible(false);
        labels[i].setText("");
    }
};



