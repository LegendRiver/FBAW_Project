/**
 * Created by mac on 16/9/05.
 */

function CSettingComponent()
{
    BiComponent.call(this);
    this.setCssClassName("eli-ad-platform-main");
    this.setLeft(0);
    this.setRight(0);
    this.setTop(0);
    this.setBottom(0);

    this.__SettingContent = {
        headText : "账户信息详情"
    };

    this.__SettingSize = {
        headPanelHeight : 60,
        headTextLabelWidth : 320,
        headTextLabelHeight : 40,
        headTextLabelLeft : 20,
        headTextLabelTop : 10,
    };

    this.__LastPanelBottom = 0;


    this.__SettingMainPanel = null;
    this.__HeadPanel = null;
}

CSettingComponent.prototype = new BiComponent;
CSettingComponent.prototype._className = "CSettingComponent";

CSettingComponent.prototype.initObject = function(eliApplication)
{
    this.__EliApplication = eliApplication;
    this._init();
};

CSettingComponent.prototype._init = function()
{
    this._initHeadPanel();
    this._initSettingMainPanel();
};


CSettingComponent.prototype._initHeadPanel = function()
{
    this.__HeadPanel = new BiComponent();
    this.__HeadPanel.setId(newGuid());
    this.__HeadPanel.setCssClassName("eli-dashboard-head-panel");
    this.__HeadPanel.setLeft(0);
    this.__HeadPanel.setRight(0);
    this.__HeadPanel.setTop(0);
    this.__HeadPanel.setHeight(this.__SettingSize.headPanelHeight);
    this.add(this.__HeadPanel);

    this.__HeadTextLabel = new BiLabel();
    this.__HeadTextLabel.setId(newGuid());
    this.__HeadTextLabel.setText(this.__SettingContent.headText);
    this.__HeadTextLabel.setCssClassName("eli-campaign-main-head-text");
    this.__HeadTextLabel.setLeft(this.__SettingSize.headTextLabelLeft);
    this.__HeadTextLabel.setTop(this.__SettingSize.headTextLabelTop);
    this.__HeadTextLabel.setWidth(this.__SettingSize.headTextLabelWidth);
    this.__HeadTextLabel.setHeight(this.__SettingSize.headPanelHeight);
    this.__HeadTextLabel.setStyleProperty("line-height", sprintf("%dpx", this.__SettingSize.headPanelHeight));
    this.__HeadPanel.add(this.__HeadTextLabel);

};

CSettingComponent.prototype._initSettingMainPanel = function()
{
    if(!this.__SettingMainPanel)
    {
        this.__SettingMainPanel = new CSettingMainPanel();
        this.__SettingMainPanel.initObject(this.__EliApplication, this);
        this.__SettingMainPanel.setId(newGuid());
        this.__SettingMainPanel.setCssClassName("eli-setting-main-panel");
        this.__SettingMainPanel.setLeft(0);
        this.__SettingMainPanel.setRight(0);
        this.__SettingMainPanel.setTop(this.__SettingSize.headPanelHeight);
    }

    //var mainPanelHeight = this.__SettingMainPanel.getLastPanelBottom();
    //this.__SettingMainPanel.setHeight(mainPanelHeight);
    this.add(this.__SettingMainPanel);

};



