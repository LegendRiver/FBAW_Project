/**
 * Created by zengt on 2016-08-17.
 */
function CEliApplication()
{
    Object.call(this);
    this.__ThemeManager = null;
    this.__ApplicationWindow = null;

    this.__MAIN_PAGE_WIDTH = 1440;
    this.__PAGE_TOP_PANEL_HEIGHT = 130;
    this.__PAGE_BOTTOM_PANEL_HEIGHT = 60;
    this.__ELI_LOG_WIDTH = 108;

    this.__MainPanel = null;
    this.__PageTopPanel = null;
    this.__LogComponent = null;
    this.__PageNavigationPanel = null;
    this.__PageNavigationComponent = null;

    this.__PageContentPanel = null;
    this.__PageBottomPanel = null;
    this.__CopyrightPanel = null;

    this.__AdPlatformPanel = null;
    this.__RegisterPanel = null;
    this.__LoginPanel = null;
    this.__EliAccessToken = null;
    this.__AccountStatus = null;
}

CEliApplication.prototype.initObject = function()
{
    this.__ApplicationWindow = application.getWindow();
    this.__initThemeManager();
    this.changeTheme('Eli');
    //this.__initMainPanel();
    this.__initEntrancePanel();
    this.__initLoginComponent();
    //this.__initPageTopPanel();
    //this.__initPageContentPanel();
    //this.__initPageBottomPanel();

};



CEliApplication.prototype.__initMainPanel = function()
{
    this.__MainPanel = new BiComponent();
    this.__MainPanel.setId(newGuid());
    this.__MainPanel.setCssClassName("eli-main-page");
    this.__MainPanel.setTop(0);
    this.__MainPanel.setWidth(this.__MAIN_PAGE_WIDTH);
    this.__MainPanel.setBottom(0);
    this.__ApplicationWindow.add(this.__MainPanel);
};

CEliApplication.prototype.__initEntrancePanel = function()
{
    this.__EntrancePanel = new CEliSystemEntrance();
    this.__EntrancePanel.initObject(this);
    this.__EntrancePanel.setLeft(0);
    this.__EntrancePanel.setTop(0);
    this.__EntrancePanel.setRight(0);
    this.__EntrancePanel.setStyleProperty("bottom", "0px");
    this.__ApplicationWindow.add(this.__EntrancePanel);
};

CEliApplication.prototype.__initPageTopPanel = function()
{
    this.__PageTopPanel = new BiComponent();
    this.__PageTopPanel.setId(newGuid());
    this.__PageTopPanel.setCssClassName("eli-page-top-panel");
    this.__PageTopPanel.setLeft(0);
    this.__PageTopPanel.setTop(0);
    this.__PageTopPanel.setRight(0);
    this.__PageTopPanel.setHeight(this.__PAGE_TOP_PANEL_HEIGHT);
    this.__MainPanel.add(this.__PageTopPanel);

    this.__initLogComponent();
    this.__initRegisterComponent();
    this.__initLoginComponent();
    this.__initPageNavigationPanel();

};

CEliApplication.prototype.__initLogComponent = function()
{
    this.__LogComponent = new BiComponent();
    this.__LogComponent.setId(newGuid());
    this.__LogComponent.setCssClassName("eli-page-top-log");
    this.__LogComponent.setLeft(80);
    this.__LogComponent.setTop(42);
    this.__LogComponent.setWidth(this.__ELI_LOG_WIDTH);
    this.__LogComponent.setHeight(68);
    this.__PageTopPanel.add(this.__LogComponent);
};

CEliApplication.prototype.__initPageNavigationPanel = function()
{
    this.__PageNavigationPanel = new BiComponent();
    this.__PageNavigationPanel.setId(newGuid());
    this.__PageNavigationPanel.setCssClassName("eli-page-navigation-panel");
    this.__PageNavigationPanel.setLeft(this.__LogComponent.getLeft() + this.__LogComponent.getWidth());
    this.__PageNavigationPanel.setTop(0);
    this.__PageNavigationPanel.setRight(0);
    this.__PageNavigationPanel.setBottom(0);
    this.__PageTopPanel.add(this.__PageNavigationPanel);

    this.__initPageNavigationComponent();
};

CEliApplication.prototype.__initPageNavigationComponent = function()
{
    this.__PageNavigationComponent = new CPageNavigationComponent();
    this.__PageNavigationComponent.initObject(this);
    this.__PageNavigationComponent.setLeft(200);
    this.__PageNavigationComponent.setTop(80);
    this.__PageNavigationComponent.setRight(90);
    this.__PageNavigationComponent.setHeight(30);
    this.__PageNavigationPanel.add(this.__PageNavigationComponent);
};

CEliApplication.prototype.__initRegisterComponent = function()
{
    if (!this.__RegisterPanel) {
        this.__RegisterPanel = new CRegisterComponent();
        this.__RegisterPanel.initObject(this);
        this.__RegisterPanel.setCentered(true);
        this.__MainPanel.add(this.__RegisterPanel);
    }
};

CEliApplication.prototype.getRegisterComponent = function()
{
    return this.__RegisterPanel;
};

CEliApplication.prototype.__initLoginComponent = function () {
    if (!this.__LoginPanel) {
        this.__LoginPanel = new CLoginComponent();
        this.__LoginPanel.initObject(this);
        this.__LoginPanel.setCentered(true);
        this.__EntrancePanel.add(this.__LoginPanel);
    }
};

CEliApplication.prototype.getLoginComponent = function()
{
    return this.__LoginPanel;
};

CEliApplication.prototype.__initPageContentPanel = function()
{
    this.__PageContentPanel = new BiComponent();
    this.__PageContentPanel.setId(newGuid());
    this.__PageContentPanel.setCssClassName("eli-page-content-panel");
    this.__PageContentPanel.setLeft(0);
    this.__PageContentPanel.setTop(this.__PAGE_TOP_PANEL_HEIGHT);
    this.__PageContentPanel.setRight(0);
    this.__PageContentPanel.setBottom(this.__PAGE_BOTTOM_PANEL_HEIGHT);
    this.__MainPanel.add(this.__PageContentPanel);
};

CEliApplication.prototype.__initPageBottomPanel = function()
{
    this.__PageBottomPanel = new BiComponent();
    this.__PageBottomPanel.setId(newGuid());
    this.__PageBottomPanel.setCssClassName("eli-page-bottom-panel");
    this.__PageBottomPanel.setLeft(0);
    this.__PageBottomPanel.setRight(0);
    this.__PageBottomPanel.setHeight(this.__PAGE_BOTTOM_PANEL_HEIGHT);
    this.__PageBottomPanel.setBottom(0);
    this.__MainPanel.add(this.__PageBottomPanel);
    this.__initCopyrightPanel();
};

CEliApplication.prototype.__initCopyrightPanel = function()
{
    this.__CopyrightPanel = new CCopyRightComponent();
    this.__CopyrightPanel.initObject(this);
    this.__CopyrightPanel.setLeft(0);
    this.__CopyrightPanel.setTop(0);
    this.__CopyrightPanel.setRight(0);
    this.__CopyrightPanel.setBottom(0);
    this.__PageBottomPanel.add(this.__CopyrightPanel);
};

CEliApplication.prototype.__initThemeManager = function()
{
    this.__ThemeManager = application.getThemeManager();
};

CEliApplication.prototype.getMainPanel = function()
{
    return this.__MainPanel;
};

CEliApplication.prototype.changeTheme = function(themeName)
{
    if(this.__ThemeManager == null)
    {
        this.__initThemeManager();
    }

    var themes = this.__ThemeManager.getThemes();
    var themeNumber = themes.length;

    for(var index = 0; index < themeNumber; ++index)
    {
        var theme = themes[index];
        if(theme.getName() === themeName)
        {
            this.__ThemeManager.setDefaultTheme(theme);
            break;
        }
    }

    return;
};

CEliApplication.prototype.changeLanguage = function(languageName)
{

};

CEliApplication.prototype.getPageNavigationPanel = function()
{
    return this.__PageNavigationPanel;
};

CEliApplication.prototype.getPageContentPanel = function()
{
    return this.__PageContentPanel;
};

CEliApplication.prototype.getPageContentPanel = function()
{
    return this.__PageBottomPanel;
};

CEliApplication.prototype.showAdPlatformPanel = function (status, token) {
    if (!this.__AdPlatformPanel) {
        this.__AdPlatformPanel = new CAdPlatformPanel();
        this.__AdPlatformPanel.initObject(this, status, token);
        this.__ApplicationWindow.add(this.__AdPlatformPanel);
    }
    this.__AdPlatformPanel.setVisible(true);
    this.__AdPlatformPanel.showCompleteInfoPanel(status);
    //this.__AdPlatformPanel.accountInfo(token)
};

CEliApplication.prototype.getAdPlatformPanel = function()
{
    return this.__AdPlatformPanel;
};

CEliApplication.prototype.setAccessToken = function (token)
{
    this.__EliAccessToken = token;
};

CEliApplication.prototype.getAccessToken = function()
{
    return this.__EliAccessToken;
};

CEliApplication.prototype.setAccountStatus = function(status)
{
    this.__AccountStatus = status;
};

CEliApplication.prototype.getAccountStatus = function()
{
    return this.__AccountStatus;
};

CEliApplication.prototype.getAdPlatformPanel = function()
{
    return this.__AdPlatformPanel;
};