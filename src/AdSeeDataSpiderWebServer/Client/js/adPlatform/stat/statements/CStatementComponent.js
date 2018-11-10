/**
 * Created by yangtian on 16/9/20.
 */

function CStatementComponent()
{
    BiComponent.call(this);
    this.setId(newGuid());
    this.setCssClassName("eli-statement-main-component");
    this.setLeft(0);
    this.setRight(0);
    this.setTop(0);
    this.setBottom(0);

    this.__PanelSize = {
        headPanelHeight : 60,
        headTextLabelLeft : 20,
        headTextLabelTop : 10,
    };
    this.__LastPanelBottom = 0;

    this.__SettingMainPanel = null;
    this.__HeadPanel = null;

    this.__CurrentDataIndex = 0;
    this.__CurrentRecevieData = [];

    this.__TabBarUserData = [
        ConstStatementsContent.WeeklyReport.Chinese,
        ConstStatementsContent.MonthlyReport.Chinese,
        ConstStatementsContent.YearlyReport.Chinese,
    ];

}

CStatementComponent.prototype = new BiComponent();
CStatementComponent.prototype._className = "CStatementComponent";

CStatementComponent.prototype.initObject = function(eliApplication, parent)
{
    this.__EliApplication = eliApplication;
    this.__Parent = parent;
    this._init();
};

CStatementComponent.prototype._init = function()
{
    this._initHeadPanel(this.__LastPanelBottom);
    this._initTabBarPanel();
    this._initMainPanel(this.__LastPanelBottom);
    this._initNoDataPanel();
    this._initTableData(this.__CurrentDataIndex);
};

CStatementComponent.prototype._initHeadPanel = function(top)
{
    this.__HeadPanel = new BiComponent();
    this.__HeadPanel.setId(newGuid());
    this.__HeadPanel.setCssClassName("eli-dashboard-head-panel");
    this.__HeadPanel.setLeft(0);
    this.__HeadPanel.setRight(0);
    this.__HeadPanel.setTop(top);
    this.__HeadPanel.setHeight(this.__PanelSize.headPanelHeight);
    this.add(this.__HeadPanel);

    this.__LastPanelBottom = this.__HeadPanel.getHeight() + top;
};

CStatementComponent.prototype._initMainPanel = function(top)
{
    this.__MainPanel = new CStatementsMainPanel();
    this.__MainPanel.initObject(this.__EliApplication, this);
    this.__MainPanel.setTop(top);
    this.add(this.__MainPanel);
    this.__LastPanelBottom = this.__MainPanel.getHeight() + top;
};

CStatementComponent.prototype._initNoDataPanel = function()
{
    this.__NoDataPanel = new CReportNoDataComponent();
    this.__NoDataPanel.initObject(this);
    this.__NoDataPanel.setLeft(0);
    this.__NoDataPanel.setTop(this.__PanelSize.headPanelHeight);
    this.__NoDataPanel.setRight(0);
    this.__NoDataPanel.setHeight(0);
    this.__NoDataPanel.setVisible(false);
    this.add(this.__NoDataPanel);
};

CStatementComponent.prototype._initTabBarPanel = function()
{
    this.__HeadTabBar = new CHeadTabPanel();
    this.__HeadTabBar.initObject(this.__EliApplication, this, this.__TabBarUserData);
    this.__HeadTabBar.setLeft(this.__PanelSize.headTextLabelLeft);
    this.__HeadTabBar.setTop(this.__PanelSize.headTextLabelTop);
    this.__HeadPanel.add(this.__HeadTabBar);
};

CStatementComponent.prototype._initTableData = function(userData)
{
    this.getStatementsData(userData);
};

CStatementComponent.prototype.getStatementsData = function(userData)
{
    this.__CurrentDataIndex = userData;
    this.getDataByIndex(userData);
};

CStatementComponent.prototype.getDataByIndex = function(userData)
{
    this.__CurrentRecevieData = [];
    switch (this.__TabBarUserData[userData]) {
        case ConstStatementsContent.WeeklyReport.Chinese :
            this._getWeeklyData(userData);
            break;
        case ConstStatementsContent.MonthlyReport.Chinese :
            this._getMonthlyData(userData);
            break;
        case ConstStatementsContent.YearlyReport.Chinese :
            this._getYearlyData(userData);
            break;
        default :
            break;
    }
    var data = this.__CurrentRecevieData;
    this._updateStatementsPanelData(this.__TabBarUserData[userData], data);

};

CStatementComponent.prototype._getWeeklyData = function(userData)
{
    this.__CurrentRecevieData =  TestStatementsData;
};

CStatementComponent.prototype._getMonthlyData = function(userData)
{
    this.__CurrentRecevieData = TestMonthData;
};

CStatementComponent.prototype._getYearlyData = function(userData)
{
    this.__CurrentRecevieData = TestYearlyData;
};


CStatementComponent.prototype._updateStatementsPanelData = function(name, data)
{
    if(0 == data.length)
    {
        this.__NoDataPanel.setVisible(true);
        this.__MainPanel.setVisible(false);
        return;
    }
    else
    {
        this.__NoDataPanel.setVisible(false);
        this.__MainPanel.setVisible(true);
    }
    this.__MainPanel.updateData(name, data);
};




