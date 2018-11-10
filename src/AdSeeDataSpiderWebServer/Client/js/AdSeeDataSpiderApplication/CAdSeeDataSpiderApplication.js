/**
 * Created by zengtao on 2/7/17.
 */

function CAdSeeDataSpiderApplication()
{
    Object.call(this);
    this.__Id = newGuid();
    this.__ThemeManager = null;
    this.__ApplicationWindow = null;

    this.__METHOD_TYPE="POST";
    this.__PARAMETER_SERVICE_NAME="SERVICE_NAME";
    this.__PARAMETER_CLASS_INSTANCE="CLASS_INSTANCE";
    this.__PARAMETER_FUNCTION_NAME="FUNCTION_NAME";
    this.__PARAMETER_APP_AD_PAGE_NUMBER="APP_AD_PAGE_NUMBER";
    this.__PARAMETER_APP_PACKAGE_NAME="APP_PACKAGE_NAME";
    this.__PARAMETER_CALL_TAG="CALL_TAG";
    this.__PARAMETER_USER_TOKEN="USER_TOKEN";

    this.__APP_AD_SERVICE="AppAdService";
    this.__APP_AD_SUMMARY_CLASS="CAppAdSummary";
    this.__GET_APP_AD_SUMMARY_FUNCTION="getAppList";
    this.__GET_APP_AD_PAGE_FUNCTION="getAppAdListByPage";

    this.__GET_APP_LIST_DATA_TAG = newGuid();
    this.__GET_APP_AD_LIST_TAG = newGuid();
    this.__ServiceUrl = null;
    this.__AjaxClient = null;

    this.__APP_CATEGORY_ITEM_HEIGHT = 30;
    this.__IMAGE_LIST_ITEM_SIZE = new CSize(200,200);
    this.__APP_AD_ITEM_SIZE = new CSize(-1,530);

    this.__AppCategoryListControl = null;
    this.__AppCategoryControlList = null;
    this.__SelectedAppCategoryControl = null;

    this.__AppListControl = null;
    this.__SelectedAppImageItem = null;
    this.__AppAdListControl = null;
    this.__ErrorMessageBox = null;

    this.__AppAdSummaryControl = null;

    this.__AppImageItemList = null;
    this.__AppAdControlList = [];

    this.__UserLoginWindow = null;
    this.__UserLoginData = null;
    this.__AppTable = null;
}

CAdSeeDataSpiderApplication.prototype.initObject = function(serviceUrl)
{
    this.__ServiceUrl = serviceUrl;
    this.__AjaxClient = new CAjax(this.__ServiceUrl, this.__METHOD_TYPE, this);
    this.__AppImageItemList = [];
    this.__AppCategoryControlList = [];
    this.__AppTable = new BiHashTable();
    this.__ApplicationWindow = application.getWindow();
    this.__initThemeManager();
    this.changeTheme('Eli');
    this.__initMessageBoxes();
    this.showUserLoginWindow();
};


CAdSeeDataSpiderApplication.prototype.showUserLoginWindow = function ()
{
    if(!this.__UserLoginWindow)
    {
        this.__UserLoginWindow = new CUserLoginWidow();
        this.__UserLoginWindow.initObject(this);
        this.__UserLoginWindow.setWidth(320);
        this.__UserLoginWindow.setHeight(240);
    }

    this.__UserLoginWindow.initControl();
    this.__UserLoginWindow.setVisible(true);
};

CAdSeeDataSpiderApplication.prototype.__initMessageBoxes = function()
{
    //function(owner, size, messageBoxType, dialogResultEvent)
    this.__ErrorMessageBox = new CMessageBox();
    this.__ErrorMessageBox.initObject(this, new CSize(320, 200), MESSAGE_BOX_TYPE.ERROR, null);
    this.__ErrorMessageBox.setVisible(false);
    this.__ApplicationWindow.add(this.__ErrorMessageBox);
};

CAdSeeDataSpiderApplication.prototype.showErrorMessageBox = function(errorMessage)
{
    if(!this.__ErrorMessageBox)
    {
        this.__initMessageBoxes();
    }

    this.__ErrorMessageBox.showMessage("错误信息", errorMessage);
    this.__ErrorMessageBox.setVisible(true);
};

CAdSeeDataSpiderApplication.prototype.__initAppCategoriesList = function()
{
    this.__AppCategoryListControl = new BiComponent();
    this.__AppCategoryListControl.setId(newGuid());
    this.__AppCategoryListControl.setCssClassName("eli-app-category-list");
    this.__AppCategoryListControl.setLeft(0);
    this.__AppCategoryListControl.setTop(0);
    this.__AppCategoryListControl.setWidth(this.__IMAGE_LIST_ITEM_SIZE.Width);
    this.__AppCategoryListControl.setHeight(this.__IMAGE_LIST_ITEM_SIZE.Width);
    this.__ApplicationWindow.add(this.__AppCategoryListControl);
};

CAdSeeDataSpiderApplication.prototype.__initAppListControl = function()
{
    this.__AppListControl = new CImageListControl();
    this.__AppListControl.initObject(new CPoint(0, this.__IMAGE_LIST_ITEM_SIZE.Width), new CSize(this.__IMAGE_LIST_ITEM_SIZE.Width,-1));
    this.__ApplicationWindow.add(this.__AppListControl);
};

CAdSeeDataSpiderApplication.prototype.__initAppAdSummaryControl = function()
{
    this.__AppAdSummaryControl = new CAppAdSummaryComponent();
    this.__AppAdSummaryControl.initObject(this);
    this.__AppAdSummaryControl.setLeft(this.__IMAGE_LIST_ITEM_SIZE.Width);
    this.__AppAdSummaryControl.setTop(this.__AppCategoryListControl.getTop());
    this.__AppAdSummaryControl.setRight(0);
    this.__AppAdSummaryControl.setHeight(this.__IMAGE_LIST_ITEM_SIZE.Height);
    this.__ApplicationWindow.add(this.__AppAdSummaryControl);
};

CAdSeeDataSpiderApplication.prototype.__initAppAdListControl = function()
{
    this.__AppAdListControl = new BiComponent();
    this.__AppAdListControl.setId(newGuid());
    this.__AppAdListControl.setCssClassName("eli-app-ad-list-container");
    this.__AppAdListControl.setLeft(this.__IMAGE_LIST_ITEM_SIZE.Width);
    this.__AppAdListControl.setTop(this.__IMAGE_LIST_ITEM_SIZE.Height);
    this.__AppAdListControl.setRight(0);
    this.__AppAdListControl.setBottom(0);
    this.__ApplicationWindow.add(this.__AppAdListControl);
};

CAdSeeDataSpiderApplication.prototype.changeTheme = function(themeName)
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

CAdSeeDataSpiderApplication.prototype.__initThemeManager = function()
{
    this.__ThemeManager = application.getThemeManager();
};

CAdSeeDataSpiderApplication.prototype.getId = function()
{
    return this.__Id;
};

CAdSeeDataSpiderApplication.prototype.__initControls = function ()
{
    this.__initAppCategoriesList();
    this.__initAppListControl();
    this.__initAppAdSummaryControl();
    this.__initAppAdListControl();
};

CAdSeeDataSpiderApplication.prototype.loadAppData = function(userLoginData)
{
    this.__UserLoginData = userLoginData;
    this.__initControls();
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__APP_AD_SERVICE);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__APP_AD_SUMMARY_CLASS);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__GET_APP_AD_SUMMARY_FUNCTION);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, this.__GET_APP_LIST_DATA_TAG);
    this.__AjaxClient.registerParameter(this.__PARAMETER_USER_TOKEN, this.__UserLoginData[0]);
    this.__AjaxClient.callAjax();
};

CAdSeeDataSpiderApplication.prototype.__loadAppAdPageData = function(packageName, pageNumber)
{
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__APP_AD_SERVICE);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__APP_AD_SUMMARY_CLASS);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__GET_APP_AD_PAGE_FUNCTION);
    this.__AjaxClient.registerParameter(this.__PARAMETER_USER_TOKEN, this.__UserLoginData[0]);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, this.__GET_APP_AD_LIST_TAG);
    this.__AjaxClient.registerParameter(this.__PARAMETER_APP_PACKAGE_NAME, packageName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_APP_AD_PAGE_NUMBER, pageNumber);

    this.__AjaxClient.callAjax();
};

CAdSeeDataSpiderApplication.prototype.setData = function(responseData)
{
    var resultObj = null;
    try
    {
        resultObj = eval('(' + responseData + ')');
    }
    catch(ex)
    {
        writeLogMessage("ERROR", sprintf("Response data format invalid, error message<%s>.", ex.message));
        return;
    }

    var errorCode = parseInt(resultObj.errorCode);
    if(errorCode != 0)
    {
        this.showErrorMessageBox(resultObj.message);
        return;
    }

    var callTag = resultObj.CALL_TAG;
    switch (callTag)
    {
        case this.__GET_APP_LIST_DATA_TAG:
            this.__processAppListData(resultObj.data);
            break;
        case this.__GET_APP_AD_LIST_TAG:
            this.__processAppAdPage(resultObj.data);
            break;
    }
};

CAdSeeDataSpiderApplication.prototype.__processAppListData = function(data)
{
    var appData = null;
    var appAdSummary = null;
    var appNumber = data.length;
    for(var index = 0; index < appNumber; ++index)
    {
        appData = data[index];
        appAdSummary = new CAppSummary();
        if(appAdSummary.parse(appData))
        {
            this.__addAppAdSummary(appAdSummary);
        }
    }

    this.__createAppCategoryItems();
};

CAdSeeDataSpiderApplication.prototype.__createAppCategoryItems = function()
{
    var appCategories = this.__AppTable.getKeys();
    var appCategoryNumber = appCategories.length;
    var appCategory = null;
    var appCategoryControl = null;
    var location = new CPoint(0, 0);
    for(var index = 0; index < appCategoryNumber; ++index)
    {
        appCategory = appCategories[index];
        if(appCategory)
        {
            appCategoryControl = new BiLabel();
            appCategoryControl.setId(newGuid());
            appCategoryControl.setCssClassName("eli-app-category-button");
            appCategoryControl.setLeft(location.x);
            appCategoryControl.setTop(location.y);
            appCategoryControl.setRight(0);
            appCategoryControl.setHeight(this.__APP_CATEGORY_ITEM_HEIGHT);
            appCategoryControl.setText(appCategory);
            appCategoryControl.setUserData(this.__AppTable.item(appCategory));
            appCategoryControl.addEventListener("click", function(event){
                this.__showAppList(event);
            }, this);
            this.__AppCategoryListControl.add(appCategoryControl);
            this.__AppCategoryControlList.push(appCategoryControl);
            location.y += this.__APP_CATEGORY_ITEM_HEIGHT;
        }
    }

    if(this.__AppCategoryControlList.length > 0)
    {
        this.__SelectedAppCategoryControl = this.__AppCategoryControlList[0];
        this.__SelectedAppCategoryControl.setCssClassName('eli-app-category-button-selected');
        this.__createAppItems(this.__SelectedAppCategoryControl.getUserData());
    }
};

CAdSeeDataSpiderApplication.prototype.__showAppList = function(event)
{
    var eventControl = event.getCurrentTarget();
    if(this.__SelectedAppCategoryControl == eventControl)
    {
        return;
    }

    if(this.__SelectedAppCategoryControl)
    {
        this.__SelectedAppCategoryControl.setCssClassName('eli-app-category-button');
    }

    this.__SelectedAppCategoryControl = eventControl;
    this.__SelectedAppCategoryControl.setCssClassName('eli-app-category-button-selected');
    var userData = null;
    if(eventControl && (eventControl instanceof  BiLabel))
    {
        userData = eventControl.getUserData();
        if(userData && (userData instanceof BiHashTable))
        {
            this.__createAppItems(userData);
        }
    }
};

CAdSeeDataSpiderApplication.prototype.__clearAppItems = function()
{
    var appNumber = this.__AppImageItemList.length;
    var appItem = null;
    for(var index = 0; index < appNumber; ++index)
    {
        appItem = this.__AppImageItemList[index];
        if(appItem)
        {
            this.__AppListControl.remove(appItem);
            delete  appItem;
            appItem = null;
        }
    }

    this.__AppImageItemList = [];
};

CAdSeeDataSpiderApplication.prototype.__createAppItems = function(appTable)
{
    var appAdSummary = null;
    var appImageListItem = null;
    this.__clearAppItems();
    var apps = appTable.getValues();
    var appNumber = apps.length;
    var location = new CPoint(0,0);
    for(var index = 0; index < appNumber; ++index)
    {
        appAdSummary = apps[index];
        appImageListItem = new CImageListItem();
        appImageListItem.setLeft(location.x);
        appImageListItem.setTop(location.y);
        appImageListItem.initObject(this.__IMAGE_LIST_ITEM_SIZE);
        appImageListItem.setData(appAdSummary);
        appImageListItem.addEventListener("click", function(event){
            this.__showAppAdList(event);
        }, this);
        this.__AppListControl.addImageListItem(appImageListItem);
        this.__AppImageItemList.push(appImageListItem);
        location.y += this.__IMAGE_LIST_ITEM_SIZE.Height;
    }

    if(this.__AppImageItemList.length > 0)
    {
        this.__SelectedAppImageItem = this.__AppImageItemList[0];
        this.__SelectedAppImageItem.setSelected();
        this.__showAppAdSummaryInformation(this.__SelectedAppImageItem.getData())
    }
};

CAdSeeDataSpiderApplication.prototype.__addAppAdSummary = function(appAdSummary)
{
    var appCategory = appAdSummary.appCategory;
    var pkg = appAdSummary.pkg;
    var appTable = null;
    if(this.__AppTable.hasKey(appCategory))
    {
        appTable = this.__AppTable.item(appCategory);
    }
    else
    {
        appTable = new BiHashTable();
        this.__AppTable.add(appCategory, appTable);
    }

    if(!appTable.hasKey(pkg))
    {
        appTable.add(pkg, appAdSummary);
    }
};

CAdSeeDataSpiderApplication.prototype.__processAppAdPage = function(data)
{
    this.clearAdItems();
    var appAdSummaryData = this.__SelectedAppImageItem.getData();
    var appAdPage = new CAppAdPage();
    if(appAdPage.parse(data))
    {
        appAdSummaryData.addAdPage(appAdPage);
        this.__createAppAdItems(appAdPage);
    }
};

CAdSeeDataSpiderApplication.prototype.__createAppAdItems = function(appAdPage)
{
    var adControl = null;
    var appAdData = null;
    var location = new CPoint(0,0);
    var itemNumber = appAdPage.AppAdList.length;
    for(var index = 0; index < itemNumber;++index)
    {
        appAdData = appAdPage.AppAdList[index];
        adControl = new CAppAdComponent();
        adControl.initObject(this);
        adControl.setLeft(location.x);
        adControl.setTop(location.y);
        adControl.setRight(0);
        adControl.setHeight(this.__APP_AD_ITEM_SIZE.Height);
        this.__AppAdListControl.add(adControl);
        adControl.setAppAdData(appAdData);
        this.__AppAdControlList.push(adControl);
        location.y += this.__APP_AD_ITEM_SIZE.Height;
    }
};

CAdSeeDataSpiderApplication.prototype.clearAdItems = function()
{
    var adControl = null;
    var itemNumber = this.__AppAdControlList.length;
    for(var index = 0; index < itemNumber; ++index)
    {
        adControl = this.__AppAdControlList[index];
        if(adControl)
        {
            this.__AppAdListControl.remove(adControl);
        }
    }

    this.__AppAdControlList = [];
};

CAdSeeDataSpiderApplication.prototype.__showAppAdList = function(event)
{
    var imageListItem = event.getCurrentTarget();
    var appAdSummaryData = null;
    if(imageListItem instanceof  CImageListItem)
    {
        if(this.__SelectedAppImageItem == imageListItem)
        {
            return;
        }

        if(this.__SelectedAppImageItem)
        {
            this.__SelectedAppImageItem.setNoneSelected();
        }
        this.__SelectedAppImageItem = imageListItem;
        this.__SelectedAppImageItem.setSelected();
        appAdSummaryData = this.__SelectedAppImageItem.getData();
        if(!appAdSummaryData)
        {
            return;
        }

        this.__showAppAdSummaryInformation(appAdSummaryData);
    }
};

CAdSeeDataSpiderApplication.prototype.__showAppAdSummaryInformation = function(appAdSummaryData)
{
    this.__AppAdSummaryControl.setAppAdSummaryData(appAdSummaryData);
};

CAdSeeDataSpiderApplication.prototype.getApp  = function(packageName)
{
    var appCategories = this.__AppTable.getKeys();
    var appCategoryNumber = appCategories.length;
    var appTable = null;
    var appAdSummary = null;
    var appCategory = null;
    for(var index = 0; index < appCategoryNumber; ++index)
    {
        appCategory = appCategories[index];
        if(!this.__AppTable.hasKey(appCategory))
        {
            continue;
        }

        appTable = this.__AppTable.item(appCategory);
        if(appTable)
        {
            appAdSummary = appTable.item(packageName);
            if(appAdSummary)
            {
                return appAdSummary;
            }
        }
    }

    return null;
};

CAdSeeDataSpiderApplication.prototype.loadAppAdPage = function(packageName, pageIndex)
{
    var appAdSummary = this.getApp(packageName);
    if(!appAdSummary)
    {
        this.showErrorMessageBox(sprintf("App %s not exist.", packageName));
        return;
    }

    var adPage = appAdSummary.getAdPage(pageIndex);
    if(!adPage)
    {
        this.__loadAppAdPageData(packageName, pageIndex);
    }
    else
    {
        this.clearAdItems();
        this.__createAppAdItems(adPage);
    }
};