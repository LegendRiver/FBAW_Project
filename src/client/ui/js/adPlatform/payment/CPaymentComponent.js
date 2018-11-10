/**
 * Created by mac on 16/9/08.
 */

function CPaymentComponent()
{
    BiComponent.call(this);
    this.setCssClassName("eli-ad-platform-main");
    this.setLeft(0);
    this.setRight(0);
    this.setTop(0);
    this.setBottom(0);

    this.__MainHeadPanelHeight = 60;
    this.__PayInfoLabelWidth = 100;
    this.__PayInfoLabelHeight = 40;
    this.__PayInfoLabelLeft = 20;
    this.__PayInfoLabelTop = 10;

    this.__BankLogoPanelWidth = 200;
    this.__BankLogoPanelHeight = 32;
    this.__BankTextPanelWidth = 300;
    this.__BankTextPanelHeight = 25;

    this.__payInfoText = "付款信息";
    this.__bankNameText = "开户行: 中国银行珠海香洲支行";
    this.__accountNameText = "账户名: 亿栗科技（珠海）有限公司";
    this.__accountText = "账  号 : 658768033347";
}

CPaymentComponent.prototype = new BiComponent;
CPaymentComponent.prototype._className = "CPaymentComponent";

CPaymentComponent.prototype.initObject = function(eliApplication)
{
    this.__EliApplication = eliApplication;
    this._init();
};

CPaymentComponent.prototype._init = function()
{
    this._initMainHeadPanel();
    this._initPayInfoLabel();
    this._initBankPanel();
    this._initBankLogoPanel();
    this._initBankInfoLabel();
};

CPaymentComponent.prototype._initMainHeadPanel = function()
{
    this.__MainHeadPanel = new BiComponent();
    this.__MainHeadPanel.setId(newGuid());
    this.__MainHeadPanel.setCssClassName("eli-dashboard-head-panel");
    this.__MainHeadPanel.setLeft(0);
    this.__MainHeadPanel.setRight(0);
    this.__MainHeadPanel.setTop(0);
    this.__MainHeadPanel.setHeight(this.__MainHeadPanelHeight);

    this.add(this.__MainHeadPanel);
};

CPaymentComponent.prototype._initPayInfoLabel = function()
{
    this.__PayInfoLabel = new BiLabel();
    this.__PayInfoLabel.setId(newGuid());
    this.__PayInfoLabel.setText(this.__payInfoText);
    this.__PayInfoLabel.setCssClassName("eli-payment-head-label");
    this.__PayInfoLabel.setTop(this.__PayInfoLabelTop);
    this.__PayInfoLabel.setLeft(this.__PayInfoLabelLeft);
    this.__PayInfoLabel.setWidth(this.__PayInfoLabelWidth);
    this.__PayInfoLabel.setHeight(this.__PayInfoLabelHeight);
    this.__PayInfoLabel.setStyleProperty("line-height", sprintf("%dpx", this.__PayInfoLabelHeight));
    this.__MainHeadPanel.add(this.__PayInfoLabel);
};

CPaymentComponent.prototype._initBankPanel = function()
{
    this.__BankPanel = new BiComponent();
    this.__BankPanel.setId(newGuid());
    this.__BankPanel.setCssClassName("eli-payment-bank-panel");
    this.__BankPanel.setLeft(40);
    this.__BankPanel.setTop(this.__MainHeadPanel.getHeight()+20);
    this.__BankPanel.setWidth(600);
    this.__BankPanel.setBottom(20);
    this.add(this.__BankPanel);
};

CPaymentComponent.prototype._initBankLogoPanel = function()
{
    this.__BankLogoPanel = new BiComponent();
    this.__BankLogoPanel.setId(newGuid());
    this.__BankLogoPanel.setCssClassName("eli-payment-bank-image");
    this.__BankLogoPanel.setLeft(0);
    this.__BankLogoPanel.setTop(0);
    this.__BankLogoPanel.setWidth(this.__BankLogoPanelWidth);
    this.__BankLogoPanel.setHeight(this.__BankLogoPanelHeight);
    this.__BankPanel.add(this.__BankLogoPanel);
};

CPaymentComponent.prototype._initBankInfoLabel = function()
{
    this.__BankNameLabel = new BiLabel();
    this.__BankNameLabel.setId(newGuid());
    this.__BankNameLabel.setText(this.__bankNameText);
    this.__BankNameLabel.setCssClassName("eli-payment-bankInfo-text");
    this.__BankNameLabel.setLeft(this.__BankLogoPanel.getLeft()+10);
    this.__BankNameLabel.setTop(this.__BankLogoPanel.getTop() + this.__BankLogoPanel.getHeight()+10);
    this.__BankNameLabel.setWidth(this.__BankTextPanelWidth);
    this.__BankNameLabel.setHeight(this.__BankTextPanelHeight);
    this.__BankNameLabel.setStyleProperty("line-height", sprintf("%dpx", this.__BankLogoPanelHeight));
    this.__BankPanel.add(this.__BankNameLabel);

    this.__BankAccountNameLabel = new BiLabel();
    this.__BankAccountNameLabel.setId(newGuid());
    this.__BankAccountNameLabel.setText(this.__accountNameText);
    this.__BankAccountNameLabel.setCssClassName("eli-payment-bankInfo-text");
    this.__BankAccountNameLabel.setLeft(this.__BankNameLabel.getLeft());
    this.__BankAccountNameLabel.setTop(this.__BankNameLabel.getTop()+this.__BankNameLabel.getHeight());
    this.__BankAccountNameLabel.setWidth(this.__BankTextPanelWidth);
    this.__BankAccountNameLabel.setHeight(this.__BankTextPanelHeight);
    this.__BankAccountNameLabel.setStyleProperty("line-height", sprintf("%dpx", this.__BankLogoPanelHeight));
    this.__BankPanel.add(this.__BankAccountNameLabel);

    this.__BankAccountLabel = new BiLabel();
    this.__BankAccountLabel.setId(newGuid());
    this.__BankAccountLabel.setText(this.__accountText);
    this.__BankAccountLabel.setCssClassName("eli-payment-bankInfo-text");
    this.__BankAccountLabel.setLeft(this.__BankNameLabel.getLeft());
    this.__BankAccountLabel.setTop(this.__BankAccountNameLabel.getTop()+this.__BankAccountNameLabel.getHeight());
    this.__BankAccountLabel.setWidth(this.__BankTextPanelWidth);
    this.__BankAccountLabel.setHeight(this.__BankTextPanelHeight);
    this.__BankAccountLabel.setStyleProperty("line-height", sprintf("%dpx", this.__BankLogoPanelHeight));
    this.__BankPanel.add(this.__BankAccountLabel);
};