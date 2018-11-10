/**
 * Created by zengt on 2016-08-17.
 */

function CPageNavigationComponent()
{
    BiComponent.call(this); //call super
    this.setId(newGuid());
    this.setCssClassName("eli-page-navigation-component");
    this.__EliApplication = null;
    this.__MainPanel = null;
    this.__BUTTON_HEIGHT = 30;
    this.__BUTTON_WIDTH = 100;
    this.__BUTTON_SPACE = 30;
    this.__BUTTON_TOP_POSITION = 0;

    this.__BackgroundPanel = null;
    this.__RegisterContentPanel = null;
    this.__HomeButton = null;
    this.__ProductServiceButton = null;
    this.__AboutButton = null;
    this.__ContactUsButton = null;
    this.__SpaceLineComponent = null;

    this.__RegisterButton = null;
    this.__LoginButton = null;

    this.__LoginPanel = null;
}

CPageNavigationComponent.prototype = new BiComponent;
CPageNavigationComponent.prototype._className = "CPageNavigationComponent";

CPageNavigationComponent.prototype.initObject = function(eliApplication)
{
    this.__EliApplication = eliApplication;
    this.__MainPanel = this.__EliApplication.getMainPanel();
    this.__RegisterPanel = this.__EliApplication.getRegisterComponent();
    this.__LoginPanel = this.__EliApplication.getLoginComponent();

    this.__initContentPanel();
    this.__initNavigationButtons();
};

CPageNavigationComponent.prototype.__initContentPanel = function ()
{
    this.__RegisterContentPanel = new BiComponent();
    this.__RegisterContentPanel.setId(newGuid());
    this.__RegisterContentPanel.setCssClassName("fact-page-navigation");
    this.__RegisterContentPanel.setLeft(0);
    this.__RegisterContentPanel.setTop(0);
    this.__RegisterContentPanel.setBottom(0);
    this.__RegisterContentPanel.setRight(0);
    this.add(this.__RegisterContentPanel);
};

CPageNavigationComponent.prototype.__initNavigationButtons = function()
{
    this.__LogComponent = new BiComponent();
    this.__LogComponent.setId(newGuid());
    this.__LogComponent.setCssClassName("eli-page-top-log");
    this.__LogComponent.setLeft(0);
    this.__LogComponent.setTop(20);
    this.__LogComponent.setStyleProperty("width", sprintf("%d%s", 20, "%"));
    this.__LogComponent.setHeight(100);
    this.__RegisterContentPanel.add(this.__LogComponent);

    this.__HomeButton = new BiLabel();
    this.__HomeButton.setId(newGuid());
    this.__HomeButton.setCssClassName("eli-home-button");
    this.__HomeButton.setStyleProperty("left", sprintf("%d%s", 20, "%"));
    this.__HomeButton.setHeight(this.__BUTTON_HEIGHT);
    this.__HomeButton.setStyleProperty("width", sprintf("%d%s", 12, "%"));
    this.__HomeButton.setStyleProperty("bottom", sprintf("%d%s", 10, "px"));
    this.__HomeButton.setText("首页");
    this.__HomeButton.setAlign("center");
    this.__HomeButton.setUserData(0);
    this.__HomeButton.addEventListener("click", function (event)
    {
        var pageIndex = parseInt(this.__HomeButton.getUserData());
        this.__gotoPage(pageIndex);
    },this);
    this.__RegisterContentPanel.add(this.__HomeButton);

    this.__ProductServiceButton = new BiLabel();
    this.__ProductServiceButton.setId(newGuid());
    this.__ProductServiceButton.setCssClassName("eli-home-button");
    this.__ProductServiceButton.setStyleProperty("left", sprintf("%d%s", 32, "%"));
    this.__ProductServiceButton.setHeight(this.__BUTTON_HEIGHT);
    this.__ProductServiceButton.setStyleProperty("width", sprintf("%d%s", 12, "%"));
    this.__ProductServiceButton.setStyleProperty("bottom", sprintf("%d%s", 10, "px"));
    this.__ProductServiceButton.setText("产品服务");
    this.__ProductServiceButton.setAlign("center");
    this.__ProductServiceButton.setUserData(1);
    this.__ProductServiceButton.addEventListener("click", function (event)
    {
        var pageIndex = parseInt(this.__ProductServiceButton.getUserData());
        this.__gotoPage(pageIndex);
    },this);
    this.__RegisterContentPanel.add(this.__ProductServiceButton);

    this.__AboutButton = new BiLabel();
    this.__AboutButton.setId(newGuid());
    this.__AboutButton.setCssClassName("eli-home-button");
    this.__AboutButton.setStyleProperty("left", sprintf("%d%s", 44, "%"));
    this.__AboutButton.setHeight(this.__BUTTON_HEIGHT);
    this.__AboutButton.setStyleProperty("width", sprintf("%d%s", 12, "%"));
    this.__AboutButton.setStyleProperty("bottom", sprintf("%d%s", 10, "px"));
    this.__AboutButton.setText("关于亿栗");
    this.__AboutButton.setAlign("center");
    this.__AboutButton.setUserData(2);
    this.__AboutButton.addEventListener("click", function (event)
    {
        var pageIndex = parseInt(this.__AboutButton.getUserData());
        this.__gotoPage(pageIndex);
    },this);
    this.__RegisterContentPanel.add(this.__AboutButton);

    this.__ContactUsButton = new BiLabel();
    this.__ContactUsButton.setId(newGuid());
    this.__ContactUsButton.setCssClassName("eli-home-button");
    this.__ContactUsButton.setStyleProperty("left", sprintf("%d%s", 56, "%"));
    this.__ContactUsButton.setHeight(this.__BUTTON_HEIGHT);
    this.__ContactUsButton.setStyleProperty("width", sprintf("%d%s", 12, "%"));
    this.__ContactUsButton.setStyleProperty("bottom", sprintf("%d%s", 10, "px"));
    this.__ContactUsButton.setText("联系我们");
    this.__ContactUsButton.setAlign("center");
    this.__ContactUsButton.setUserData(3);
    this.__ContactUsButton.addEventListener("click", function (event)
    {
        var pageIndex = parseInt(this.__ContactUsButton.getUserData());
        this.__gotoPage(pageIndex);
    },this);
    this.__RegisterContentPanel.add(this.__ContactUsButton);

    this.__SpaceLineComponent = new BiComponent();
    this.__SpaceLineComponent.setId(newGuid());
    this.__SpaceLineComponent.setCssClassName("eli-page-navigation-space-line");
    this.__SpaceLineComponent.setLeft(this.__ContactUsButton.getLeft() + this.__ContactUsButton.getWidth() + this.__BUTTON_SPACE);
    this.__SpaceLineComponent.setHeight(this.__BUTTON_HEIGHT);
    this.__SpaceLineComponent.setWidth(this.__BUTTON_WIDTH);
    this.__SpaceLineComponent.setTop(this.__BUTTON_TOP_POSITION);
    this.add(this.__SpaceLineComponent);

    this.__RegisterButton = new BiLabel();
    this.__RegisterButton.setId(newGuid());
    this.__RegisterButton.setCssClassName("eli-home-button");
    this.__RegisterButton.setLeft(this.__SpaceLineComponent.getLeft() + this.__SpaceLineComponent.getWidth() + this.__BUTTON_SPACE);
    this.__RegisterButton.setHeight(this.__BUTTON_HEIGHT);
    this.__RegisterButton.setWidth(this.__BUTTON_WIDTH);
    this.__RegisterButton.setTop(this.__BUTTON_TOP_POSITION);
    this.__RegisterButton.setText("注册");
    this.__RegisterButton.setAlign("center");
    this.__RegisterButton.addEventListener("click", function () {
        this.__RegisterButtonOnClick();
    }, this);
    this.__RegisterContentPanel.add(this.__RegisterButton);

    this.__initSignIn();
};

CPageNavigationComponent.prototype.__initSignIn = function () {
    this.__LoginButton = new BiLabel();
    this.__LoginButton.setId(newGuid());
    this.__LoginButton.setCssClassName("eli-home-button");
    this.__LoginButton.setLeft(this.__RegisterButton.getLeft() + this.__RegisterButton.getWidth() + this.__BUTTON_SPACE);
    this.__LoginButton.setHeight(this.__BUTTON_HEIGHT);
    this.__LoginButton.setWidth(this.__BUTTON_WIDTH);
    this.__LoginButton.setTop(this.__BUTTON_TOP_POSITION);
    this.__LoginButton.setText("登录");
    this.__LoginButton.setAlign("center");
    this.__LoginButton.addEventListener("click", function () {
        this.__LoginButtonOnClick();
    }, this);
    this.add(this.__LoginButton);
};

CPageNavigationComponent.prototype.__RegisterButtonOnClick = function () {

    this.__RegisterPanel.setVisible(true);
};

CPageNavigationComponent.prototype.__LoginButtonOnClick = function () {

    this.__LoginPanel.setVisible(true);
};

CPageNavigationComponent.prototype.__gotoPage = function (pageIndex)
{
    this.__EliApplication.gotoPage(pageIndex);
};