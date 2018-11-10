/**
 * Created by yangtian on 16/9/15.
 */

function CReportComponent()
{
    BiComponent.call(this);
    this.setCssClassName("eli-ad-platform-main");
    this.setLeft(0);
    this.setRight(0);
    this.setTop(0);
    this.setBottom(0);

    this.__PanelSize = {
        mainHeadPanelHeight : 60,
        mainPanelLeft : 40,
        tabBarPanelWidth : 242,
        tabBarPanelHeight : 40,
        tabBarPanelLeft : 20,
        tabBarPanelTop : 10,
        buttonWidth : 80,
    };
    this.__NumOfCampaignPerPage = 5;

    this.__Content = {
        allCampaign : "全部",
        active : "投放中",
        noActive : "暂停"
    };

    this.__UserData = {
        allCampaign : "all",
        active : "active",
        noActive : "noActive"
    };

    this.__TabButtonHash = new BiHashTable();
    this.__CampaignsInfoData = [];

    this.__ReportMainComponent = null;
    this.__ReportCampaignInfo = null;

    this.__ReportInfoCallTag = "getCampaign";
    this.__ButtonWidth = 0;



    this.__TestData = [
        [0, 1111, "广汽－巴林推广计划1", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 20000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划2", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 21000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划3", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 202000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划4", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 220000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划5", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 230000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划6", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 240000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划7", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 240000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划8", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 205000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划9", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 206000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划10", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 270000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划11", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 270000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划12", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 208000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划13", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 208000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划14", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 208000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划15", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 208000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
        [0, 1111, "广汽－巴林推广计划16", 1, "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", 1, 208000, 1345, "", "", "", "", "", 2000000, 13456, "0.7%", "$3.6", "$10"],
    ];







    this.__Publisher1Insights = [
        [1, 1,1,1,"2016-11-01", "","","","","","",  2364, 86, 1.24, 0.7, "", 4.2, 5.7, 2.3, 30],
        [2, 1,1,1,"2016-11-02", "","","","","","",  2234, 15, 1.24, 0.7, "", 4.2, 5.7, 2.3, 40],
        [3, 1,1,1,"2016-11-03", "","","","","","",  2253, 15, 1.24, 0.7, "", 4.2, 5.7, 2.3, 32],
        [4, 1,1,1,"2016-11-04", "","","","","","",  2123, 14, 1.24, 0.7, "", 4.2, 5.7, 2.3, 33],
        [5, 1,1,1,"2016-11-05", "","","","","","",  2343, 17, 1.24, 0.7, "", 4.2, 5.7, 2.3, 35],
    ];

    this.__Publisher1Insights1 = [
        [1, 1,1,1,"2016-11-01", "","","","","","",  2164, 76, 1.24, 0.7, "", 4.2, 5.7, 2.3, 30],
        [2, 1,1,1,"2016-11-02", "","","","","","",  2534, 55, 1.24, 0.7, "", 4.2, 5.7, 2.3, 49],
        [3, 1,1,1,"2016-11-03", "","","","","","",  2653, 45, 1.24, 0.7, "", 4.2, 5.7, 2.3, 36],
        [4, 1,1,1,"2016-11-04", "","","","","","",  2023, 54, 1.24, 0.7, "", 4.2, 5.7, 2.3, 38],
        [5, 1,1,1,"2016-11-05", "","","","","","",  2043, 67, 1.24, 0.7, "", 4.2, 5.7, 2.3, 39],
    ];

    this.__Publisher1Insights2 = [
        [1, 1,1,1,"2016-11-01", "","","","","","", 2166, 76, 1.24, 0.7, "", 4.2, 5.7, 2.3, 30],
        [2, 1,1,1,"2016-11-02", "","","","","","",  2534, 55, 1.24, 0.7, "", 4.2, 5.7, 2.3, 39],
        [3, 1,1,1,"2016-11-03", "","","","","","",  2753, 45, 1.24, 0.7, "", 4.2, 5.7, 2.3, 58],
        [4, 1,1,1,"2016-11-04", "","","","","","",  2125, 54, 1.24, 0.7, "", 4.2, 5.7, 2.3, 38],
        [5, 1,1,1,"2016-11-05", "","","","","","",  2672, 67, 1.24, 0.7, "", 4.2, 5.7, 2.3, 60],
    ];

    /*this.__Publisher1Insights3 = [
        [1, 1,1,1,"2016-11-01", "","","","","","", 2136, 77, 1.24, 0.7, "", 4.2, 5.7, 2.3, 40, 23],
        [2, 2,1,1,"2016-11-02", "","","","","","", 2738, 58, 1.24, 0.7, "", 4.2, 5.7, 2.3, 59, 23],
        [3, 3,1,1,"2016-11-03", "","","","","","", 2153, 45, 1.24, 0.7, "", 4.2, 5.7, 2.3, 35, 23],
        [4, 4,1,1,"2016-11-04", "","","","","","", 2625, 58, 1.24, 0.7, "", 4.2, 5.7, 2.3, 54, 23],
        [5, 5,1,1,"2016-11-05", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-06", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-07", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-08", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-09", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-10", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-11", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-12", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-13", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-14", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-15", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-16", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-17", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-18", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
        [5, 5,1,1,"2016-11-19", "","","","","","", 2872, 62, 1.24, 0.7, "", 4.2, 5.7, 2.3, 41, 23],
    ];*/

    this.__Publisher1Insights3 = [
        [1, 1,1,1,"2016-11-01", "","","","","","", 2136, 77, 1.24, 0.7, "", 4.2, 5.7, 2.3, 40, 23],
    ];

    this.__Publishs = [
        [1, 123, 1, "Google", 23413, 123, "","active", "2016-11-01", "", this.__Publisher1Insights],
        [2, 123, 2, "Youtube", 32130, 158, "","active", "2016-11-01", "", this.__Publisher1Insights1],
        [3, 123, 3, "Facebook", 34213, 180, "","active", "2016-11-01", "", this.__Publisher1Insights2],
        [4, 123, 4, "Instagram", 33699, 196, "","active", "2016-11-01", "", this.__Publisher1Insights3],
    ];



    this.__AllTestData = [
        [1, 123, "巴林推广计划1", "app", "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", "active", 7000, 123456, 0, "", "", "2016-11-01", "", this.__Publishs],
        [1, 123, "巴林推广计划2", "app", "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", "active", 8200, 123456, 0, "", "", "2016-11-01", "", this.__Publishs],
        [1, 123, "巴林推广计划3", "app", "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", "active", 8000, 123456, 0, "", "", "2016-11-01", "", this.__Publishs],
        [1, 123, "巴林推广计划4", "app", "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", "active", 7000, 123456, 0, "", "", "2016-11-01", "", this.__Publishs],
        [1, 123, "科威特推广计划", "app", "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", "active", 8000, 123456, 0, "", "", "2016-11-01", "", this.__Publishs],
        [1, 123, "科威特推广计划2", "app", "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", "active", 6000, 123456, 0, "", "", "2016-11-01", "", this.__Publishs],
        [1, 123, "科威特推广计划3", "app", "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", "active", 5000, 123456, 0, "", "", "2016-11-01", "", this.__Publishs],
        [1, 123, "科威特推广计划4", "app", "", "", "", "", "2016-10-01", "2016-11-02", "", "", "", "active", 7000, 123456, 0, "", "", "2016-11-01", "", this.__Publishs],
    ];
}

CReportComponent.prototype = new BiComponent;
CReportComponent.prototype._className = "CReportComponent";

CReportComponent.prototype.initObject = function(eliApplication)
{
    this.__EliApplication = eliApplication;
    this._initCampaignInfo();
    this._init();
};

CReportComponent.prototype._init = function()
{
    this._initMainHeadPanel();
    // all
    this._initHeadNavigationPanel(this.__Content.allCampaign,
        this.__UserData.allCampaign, 0, this.__PanelSize.buttonWidth);

    this._initCurrentButton(this.__UserData.allCampaign);
    // active
    /*this._initHeadNavigationPanel(this.__Content.active, this.__UserData.active,
        this.__PanelSize.buttonWidth , this.__PanelSize.buttonWidth);
    // noActive
    this._initHeadNavigationPanel(this.__Content.noActive, this.__UserData.noActive,
        this.__PanelSize.buttonWidth*2 , this.__PanelSize.buttonWidth);*/

    this._initNoDataPanel();
    this._initMainComponent();
    this._initPageControl();
    this._initPublisherComponent();
    //this._initPublisherChartComponent();
};

CReportComponent.prototype._initMainHeadPanel = function()
{
    this.__MainHeadPanel = new BiComponent();
    this.__MainHeadPanel.setId(newGuid());
    this.__MainHeadPanel.setCssClassName("eli-dashboard-head-panel");
    this.__MainHeadPanel.setLeft(0);
    this.__MainHeadPanel.setRight(0);
    this.__MainHeadPanel.setTop(0);
    this.__MainHeadPanel.setHeight(this.__PanelSize.mainHeadPanelHeight);

    this._initTabBarPanel();
    this._nameLevelPanel();
    this._initDateComponent();
};

CReportComponent.prototype._initTabBarPanel = function()
{
    this.__TabBarPanel = new BiComponent();
    this.__TabBarPanel.setId(newGuid());
    this.__TabBarPanel.setCssClassName("eli-dashboard-tab-bar-panel");
    this.__TabBarPanel.setLeft(this.__PanelSize.tabBarPanelLeft);
    this.__TabBarPanel.setWidth(this.__PanelSize.tabBarPanelWidth);
    this.__TabBarPanel.setHeight(this.__PanelSize.tabBarPanelHeight);
    this.__TabBarPanel.setTop(this.__PanelSize.tabBarPanelTop);
    this.__MainHeadPanel.add(this.__TabBarPanel);

    this.add(this.__MainHeadPanel);
};

CReportComponent.prototype._initHeadNavigationPanel = function(text,userData, left, width)
{
    this.__NavigationButton = new BiLabel();
    this.__NavigationButton.setId(newGuid());
    this.__NavigationButton.setText(text);
    this.__NavigationButton.setCssClassName("eli-tab-bar-text");
    this.__NavigationButton.setUserData(userData);
    this.__NavigationButton.setLeft(left);
    this.__NavigationButton.setTop(0);
    this.__NavigationButton.setBottom(0);
    this.__NavigationButton.setWidth(width);
    this.__NavigationButton.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.tabBarPanelHeight));
    this.__NavigationButton.addEventListener("click", function() {
        this._onButtonClick(userData);
    }, this);
    this.__TabBarPanel.add(this.__NavigationButton);

    if(!this.__TabButtonHash.hasKey())
    {
        this.__TabButtonHash.add(userData, this.__NavigationButton);
    }

    this.__ButtonWidth += width;
    this.__TabBarPanel.setWidth(this.__ButtonWidth);
};

CReportComponent.prototype._nameLevelPanel = function()
{
    this.__NameLevelPanel = new CReportNavigationComponent();
    this.__NameLevelPanel.initObject(this.__EliApplication, this);
    this.__NameLevelPanel.setId(newGuid());
    this.__NameLevelPanel.setCssClassName("eli-level-navigation-panel");
    this.__NameLevelPanel.setLeft(this.__PanelSize.tabBarPanelLeft);
    this.__NameLevelPanel.setTop(this.__PanelSize.tabBarPanelTop);
    this.__NameLevelPanel.setWidth(this.__NameLevelPanel.getPanelWidth());
    this.__NameLevelPanel.setHeight(this.__PanelSize.tabBarPanelHeight);
    this.__NameLevelPanel.setVisible(false);
    this.__MainHeadPanel.add(this.__NameLevelPanel);

};

CReportComponent.prototype._initDateComponent = function()
{
    if(!this.__DateComponent)
    {
        this.__DateComponent = new CDateSearchComponent();
        this.__DateComponent.initObject(this.__EliApplication, this);
        this.__DateComponent.setTop(this.__PanelSize.tabBarPanelTop);
        this.__DateComponent.setRight(10);
        this.__DateComponent.setWidth(this.__DateComponent.getDateComponentWidth());
        this.__DateComponent.setHeight(this.__PanelSize.tabBarPanelHeight);
        this.__MainHeadPanel.add(this.__DateComponent);
    }
};

CReportComponent.prototype._initCurrentButton = function(userData)
{
    this.__CurrentButton = this.__TabButtonHash.item(userData);
    this.__CurrentButton.setCssClassName("eli-tab-bar-text-select");
};

CReportComponent.prototype._onButtonClick = function(userData)
{
    this._updateButtonStyle(userData);
};

CReportComponent.prototype._updateButtonStyle = function(userData)
{
    this.__CurrentButton.setCssClassName("eli-tab-bar-text");
    this.__CurrentButton = this.__TabButtonHash.item(userData);
    this.__CurrentButton.setCssClassName("eli-tab-bar-text-select");
};

CReportComponent.prototype._initMainComponent = function()
{
    if(!this.__ReportMainComponent)
    {
        this.__ReportMainComponent = new CReportMainComponent();
        this.__ReportMainComponent.initObject(this.__EliApplication, this);
        this.__ReportMainComponent.setId(newGuid());
        this.__ReportMainComponent.setCssClassName("eli-report-main-panel");
        this.__ReportMainComponent.setLeft(this.__PanelSize.mainPanelLeft);
        this.__ReportMainComponent.setRight(this.__PanelSize.mainPanelLeft);
        this.__ReportMainComponent.setTop(this.__PanelSize.mainHeadPanelHeight + 60);
        this.__ReportMainComponent.setHeight(this.__ReportMainComponent.getLastPanelBottom());
    }

    this.add(this.__ReportMainComponent);
};

CReportComponent.prototype._initPublisherComponent = function()
{
    if(!this.__PublisherMainComponent)
    {
        this.__PublisherMainComponent = new CPublisherMainPanel();
        this.__PublisherMainComponent.initObject(this.__EliApplication, this);
        this.__PublisherMainComponent.setId(newGuid());
        this.__PublisherMainComponent.setCssClassName("eli-publisher-main-component");
        this.__PublisherMainComponent.setLeft(this.__PanelSize.mainPanelLeft);
        this.__PublisherMainComponent.setRight(this.__PanelSize.mainPanelLeft);
        this.__PublisherMainComponent.setTop(this.__PanelSize.mainHeadPanelHeight + 60);
        this.__PublisherMainComponent.setHeight(this.__PublisherMainComponent.getTableHeight() + 100);
        this.__PublisherMainComponent.setVisible(false);
    }

    this.add(this.__PublisherMainComponent);
};

CReportComponent.prototype._initPageControl = function()
{
    if(!this.__PageControlPanel)
    {
        this.__PageControlPanel = new CReportPageControl();
        this.__PageControlPanel.initObject(this.__EliApplication, this);
        this.__PageControlPanel.setTop(this.__ReportMainComponent.getTop() + this.__ReportMainComponent.getHeight());
        this.__PageControlPanel.setLeft(this.__PanelSize.pageControlLeft);
    }
    this.add(this.__PageControlPanel);
};

CReportComponent.prototype._initCampaignInfo = function()
{
    if(!this.__ReportCampaignInfo)
    {
        this.__ReportCampaignInfo = new CCampaignInfo();
        this.__ReportCampaignInfo.initObject(this.__EliApplication, this);
    }
};

CReportComponent.prototype._initNoDataPanel = function()
{
    if(!this.__NoDataPanel)
    {
        this.__NoDataPanel = new CReportNoDataComponent();
        this.__NoDataPanel.initObject(this);
        this.__NoDataPanel.setTop(this.__PanelSize.mainHeadPanelHeight);
        this.__NoDataPanel.setLeft(0);
        this.__NoDataPanel.setRight(0);
        this.__NoDataPanel.setBottom(0);
        this.__NoDataPanel.setVisible(false);
        this.add(this.__NoDataPanel);
    }
};

CReportComponent.prototype.setNoDataPanelVisible = function(flag)
{
    this.__NoDataPanel.setVisible(flag);
    this.__ReportMainComponent.setVisible(!flag);
    this.__PageControlPanel.setVisible(!flag);
};

/*--------update date -----------*/


CReportComponent.prototype.updateReportInfo = function(startTime, endTime)
{
    this.getCampaignList(startTime, endTime);
};

CReportComponent.prototype.getCampaignList = function(startTime, endTime)
{
    this.__ReportCampaignInfo.getCampaignList(
        this.__EliApplication.getAccessToken(),
        this.__ReportInfoCallTag,
        this._getCampaignListCallBack,
        startTime,
        endTime
    );
};

CReportComponent.prototype.clearCampaignsInfo = function()
{
    this.__CampaignsInfoData = [];
};

CReportComponent.prototype._getCampaignListCallBack = function(response)
{
    var errorCode = parseInt(response.errorCode);
    if(0 != errorCode)
    {
        return;
    }

    var data = response.data.RECORDS;

    if(0 == data.length)
    {
        this.__Parent.setNoDataPanelVisible(true);
        return;
    }
    this.__Parent.clearCampaignsInfo();
    this.__Parent.setNoDataPanelVisible(false);
    //this.__Parent.updateCampaignListInfo(this.__Parent.__AllTestData);
    this.__Parent.updateCampaignListInfo(data);
};

CReportComponent.prototype.updateCampaignListInfo  = function(campaignRecords)
{
    var dataProcess = new CCampaignDataProcess();
    dataProcess.initObject(campaignRecords, this.__PublisherMainComponent.getPublisherFields());

    var campaignObjects = dataProcess.getCampaignObjects();
    this.updateReportMainComponent(campaignObjects);
};

CReportComponent.prototype.updateReportMainComponent = function(campaignObjects)
{
    this.__Pages = this._segmentData(campaignObjects);
    this.__CurrentPage =0;

    this.updateReportData(this.__Pages);
};

CReportComponent.prototype.updateReportData = function(pages)
{
    this.__ReportMainComponent.updateCampaignData(pages[this.__CurrentPage]);
    this.__PageControlPanel.updatePageInfo(this.__CurrentPage+1, pages);
    this.setPanelVisible(false);
};

CReportComponent.prototype._segmentData = function(data)
{
    var len = data.length;
    var perNum = this.__NumOfCampaignPerPage;
    var pages = [];
    var pageNum = Math.ceil(len/perNum);
    this._setPageNum(pageNum);

    for(var i=0; i<pageNum; i++)
    {
        var pageArrays = [];
        for(var j=0; j< perNum; j++)
        {
            var index = j+i*perNum;
            pageArrays.push(data[index]);
        }
        pages.push(pageArrays);
    }

    return pages;
};

CReportComponent.prototype.getMainComponent = function()
{
    return this.__ReportMainComponent;
};

CReportComponent.prototype._setPageNum = function(pageNum)
{
    this.__PageNum = pageNum;
};

CReportComponent.prototype.getPageNum = function()
{
    return this.__PageNum;
};

CReportComponent.prototype.getCampaignPageNum = function()
{
    return this.__NumOfCampaignPerPage;
};

CReportComponent.prototype.getCurrentPage = function()
{
    return this.__CurrentPage;
};

CReportComponent.prototype.setCurrentPage = function(currentPage)
{
    this.__CurrentPage = currentPage;
};

CReportComponent.prototype.getPagesData = function()
{
    return this.__Pages;
};

CReportComponent.prototype.setPanelVisible = function(flag)
{
    this.__PublisherMainComponent.setVisible(flag);
    this.__PublisherMainComponent.updatePublisherTableVisible(flag);
    //this.__PublisherMainComponent.updatePublisherChartVisible(flag);
    this.__NameLevelPanel.setVisible(flag);
    this.__PageControlPanel.setVisible(!flag);
    this.__ReportMainComponent.setVisible(!flag);
    this.__TabBarPanel.setVisible(!flag);
};

CReportComponent.prototype.setCampaignName = function(text, flag)
{
    this.__NameLevelPanel.updateCampaignLevelName(text, flag);
};

CReportComponent.prototype.setPublisherName = function(text, flag)
{
    this.__NameLevelPanel.updatePublisherLevelName(text, flag);
};

CReportComponent.prototype.getPublisherComponent = function()
{
    return this.__PublisherMainComponent;
};

CReportComponent.prototype.setDateComponentVisible = function(flag)
{
    this.__DateComponent.setVisible(flag);
};

CReportComponent.prototype.setNoDataPanelVisible = function(flag)
{
    this.__NoDataPanel.setVisible(flag);
};

CReportComponent.prototype.initDateComponentTimeText = function()
{
    this.__DateComponent.initTimeText();
}

