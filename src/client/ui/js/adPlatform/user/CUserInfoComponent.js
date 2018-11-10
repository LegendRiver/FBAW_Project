/**
 * Created by mac on 16/10/12.
 */

function CUserInfoComponent()
{
    BiComponent.call(this);


    this.__PanelSize = {
        componentWidth : 400,
        nameLabelWidth : 200,
        labelHeight : 35,
        loginOutButtonWidth : 100
    };

    this.__LoginOutText = "退出登录";
    this.__LoginOutFailed = "退出失败";
    this.__CallTag = "LogOut";

    this.setWidth(this.__PanelSize.componentWidth);
    this.setBottom(5);
    this.setHeight(this.__PanelSize.labelHeight);
    this.setRight(0);
    this.setCssClassName("eli-userInfo-panel");
    this.__EliApplication = null;
    this.__AccountInfo = null;
    this.__AccessToken = null;
}

CUserInfoComponent.prototype = new BiComponent;
CUserInfoComponent.prototype._className = "CUserInfoComponent";

CUserInfoComponent.prototype.initObject = function(applicaion, parent)
{
    this.__EliApplication = applicaion;
    this.__Parent = parent;

    this._init();
};

CUserInfoComponent.prototype._init = function()
{
    this._createNameLabel();
};

CUserInfoComponent.prototype._createNameLabel = function()
{
    this.__CompanyName = new BiLabel();
    this.__CompanyName.setId(newGuid());
    //this.__CompanyName.setText(this.__UserInfo.companyName);
    this.__CompanyName.setCssClassName("eli-company-name-label");
    this.__CompanyName.setLeft(0);
    this.__CompanyName.setTop(0);
    this.__CompanyName.setWidth(this.__PanelSize.nameLabelWidth);
    this.__CompanyName.setHeight(this.__PanelSize.labelHeight);
    this.__CompanyName.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.labelHeight));
    this.add(this.__CompanyName);

    this.__LoginOut = new BiLabel();
    this.__LoginOut.setId(newGuid());
    this.__LoginOut.setText(this.__LoginOutText);
    this.__LoginOut.setCssClassName("eli-loginOut-button");
    this.__LoginOut.setLeft(this.__CompanyName.getLeft() + this.__CompanyName.getWidth()+10);
    this.__LoginOut.setTop(0);
    this.__LoginOut.setWidth(this.__PanelSize.loginOutButtonWidth);
    this.__LoginOut.setHeight(this.__PanelSize.labelHeight);
    this.__LoginOut.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.labelHeight));
    this.__LoginOut.addEventListener("click", function () {
        this._onLoginOutButtonClick();
    }, this);
    this.add(this.__LoginOut);
};

CUserInfoComponent.prototype.setUserInfoData = function(text)
{
    this.__CompanyName.setText(text);
};

CUserInfoComponent.prototype._onLoginOutButtonClick = function () {

    this.__AccountInfo = this.__Parent.getAccountInfo();
    this.__AccessToken = this.__Parent.getAccessToken();

    this.__AccountInfo.loginOut(this.__AccessToken, this.__CallTag, this._logOutCallBack);
};

CUserInfoComponent.prototype._logOutCallBack = function(response)
{
    var errorCode = parseInt(response.errorCode);
    if(0 == errorCode)
    {
        this.__Parent.setVisible(false);

    }
    else
    {
        alert(this.__LoginOutFailed);
    }

    window.location.reload(true);
};
