/**
 * Created by mac on 16/9/20.
 */

function CDashboardChartComponent()
{
    BiComponent.call(this);
    this.__AccountDailyData = null;
    this.__DataFormat = {
        currency : 'currency',
        decimal : 'decimal',
        percent : 'percent'
    };

    this.__UserData = {
        basic : "basic",
        publisher : "publisher",
        demographics : "demographics"
    };

    this.__AccountChartTitle = {
        impression : "展现",
        click : "点击",
        ctr : "CTR",
        cpm : "CPM",
        cpc : "CPC"
    };
}

CDashboardChartComponent.prototype = new BiComponent;
CDashboardChartComponent.prototype._className = "CDashboardChartComponent";

CDashboardChartComponent.prototype.initObject = function(eliApplication, parent)
{
    this.__EliApplication = eliApplication;
    this.__Parent = parent;
    this.__Charts = google.charts;
    this._init();
};

CDashboardChartComponent.prototype._init = function()
{

    this.__Charts.load('current', {'packages': ['corechart']});

    this._initAccountChartsComponent();
    //this._initPublisherCharts();


    //this.updateAccoutChartsData(data);

    //this._initPublisherBudgetChart();
};

CDashboardChartComponent.prototype._initAccountChartsComponent = function()
{
    if(!this.__AccountChartsPanel)
    {
        this.__AccountChartsPanel = new CDashboardAccountGraph();
        this.__AccountChartsPanel.setUserData(this.__UserData.basic);
        this.__AccountChartsPanel.initObject(this, this.__Charts, this.__AccountDailyData);
        this.__AccountChartsPanel.setLeft(0);
        this.__AccountChartsPanel.setTop(0);
        this.__AccountChartsPanel.setRight(0);
        this.__AccountChartsPanel.setHeight(0);
    }

    this.add(this.__AccountChartsPanel);
};

CDashboardChartComponent.prototype._initPublisherCharts = function()
{
    if(!this.__PublisherChartsPanel)
    {
        this.__PublisherChartsPanel = new CAccountPublisherGraph();
        this.__PublisherChartsPanel.setUserData(this.__UserData.publisher);
        this.__PublisherChartsPanel.initObject(this, this.__Charts, this.__AccountDailyData);
        this.__PublisherChartsPanel.setLeft(0);
        this.__PublisherChartsPanel.setTop(0);
        this.__PublisherChartsPanel.setRight(0);
        this.__PublisherChartsPanel.setHeight(0);
        this.__PublisherChartsPanel.setVisible(false);
    }

    this.add(this.__PublisherChartsPanel);
};




CDashboardChartComponent.prototype.setAccountChartsVisible = function(flag)
{
    this.__AccountChartsPanel.setVisible(flag);
    this.__PublisherChartsPanel.setVisible(!flag);
};


/*-----update data -----------*/

CDashboardChartComponent.prototype.updateAccountChartsData = function(accountFields, accountDataObject)
{
    var accountBudget = accountFields.accountBudget;
    var accountSpent = accountDataObject.getAccountSpent();
    var dateArray = accountDataObject.getAccountDailyDate();
    var accountDailyImpression = accountDataObject.getAccountDailyImpression();
    var accountDailyClick = accountDataObject.getAccountDailyClick();
    var accountDailyCtr = accountDataObject.getAccountDailyCTR();
    var accountDailyCpm = accountDataObject.getAccountDailyCPM();
    var accountDailyCpc = accountDataObject.getAccountDailyCPC();

    this._updateAccountPieChartData(accountBudget, accountSpent);
    this._updateAccountChartsData(dateArray, accountDailyImpression, this.__AccountChartTitle.impression);
    this._updateAccountChartsData(dateArray, accountDailyClick, this.__AccountChartTitle.click);
    this._updateAccountChartsData(dateArray, accountDailyCtr, this.__AccountChartTitle.ctr);
    this._updateAccountChartsData(dateArray, accountDailyCpm, this.__AccountChartTitle.cpm);
    this._updateAccountChartsData(dateArray, accountDailyCpc, this.__AccountChartTitle.cpc);
};

CDashboardChartComponent.prototype._updateAccountPieChartData = function(budget, spent)
{
    var data = [['name', 'money']];
    var arraySpent = ['消费'];
    arraySpent.push(spent);
    var balance = budget-spent;
    var arrayBalance = ['余额'];
    arrayBalance.push(balance);

    data.push(arraySpent);
    data.push(arrayBalance);

    this.__AccountChartsPanel.updateBudgetPieChart(data);
};

CDashboardChartComponent.prototype._updateAccountChartsData = function(dates, dailyData, title)
{
    
    var chartDailyData = [['date', title]];
    var array = [];
    var len = dates.length;
    for(var index=0; index<len; index++)
    {
        var date = dates[index].split("-");
        var impression = dailyData.item(dates[index]);
        /*var year = date[0];
        var month = date[1];
        var day = date[2];*/

       // var dateObject = new Date(year,month,day);
        var dateObject = new Date(date);
        array = [];
        array.push(dateObject);
        array.push(impression);
        chartDailyData.push(array);
    }

    switch (title)
    {
        case this.__AccountChartTitle.impression :
            this.__AccountChartsPanel.updateImpressionChartData(chartDailyData);
            break;
        case this.__AccountChartTitle.click :
            this.__AccountChartsPanel.updateClickChartData(chartDailyData);
            break;
        case this.__AccountChartTitle.ctr :
            this.__AccountChartsPanel.updateCTRChartData(chartDailyData);
            break;
        case this.__AccountChartTitle.cpm :
            this.__AccountChartsPanel.updateAccountCPMData(chartDailyData);
            break;
        case this.__AccountChartTitle.cpc :
            this.__AccountChartsPanel.updateAccountCPCData(chartDailyData);
            break;
        default :
            break;
    }
};
