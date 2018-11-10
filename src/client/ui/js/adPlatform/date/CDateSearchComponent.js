/**
 * Created by yangtian on 16/10/28.
 */
function CDateSearchComponent()
{
    BiComponent.call(this);

    this.__PanelSize = {
        panelHeight : 40,
        submitWidth : 70,
        lineWidth : 20,
        msgPanelWidth : 200,
    };

    this.__Content = {
        search : "查询",
        start : "开始时间",
        end : "结束时间",
        msgError : "查询开始时间不能晚于结束时间",
    };

    this.__LastPanelLeft = 0;
}

CDateSearchComponent.prototype = new BiComponent;
CDateSearchComponent.prototype._className = "CDateSearchComponent";

CDateSearchComponent.prototype.initObject = function(application, parent)
{
    this.__EliApplication = application
    this.__Parent = parent;
    this._init();
};

CDateSearchComponent.prototype._init = function()
{
    this._initMsgPanel(this.__LastPanelLeft);
    this._initStartPanel(this.__LastPanelLeft);
    this._initLineComponent(this.__LastPanelLeft);
    this._initEndPanel(this.__LastPanelLeft);
    this._submitButton(this.__LastPanelLeft);

};

CDateSearchComponent.prototype._submitButton = function(left)
{
    this.__SubmitButton = new BiLabel();
    this.__SubmitButton.setId(newGuid());
    this.__SubmitButton.setCssClassName("eli-date-search-button");
    this.__SubmitButton.setText(this.__Content.search);
    this.__SubmitButton.setLeft(left);
    this.__SubmitButton.setHeight(this.__PanelSize.panelHeight);
    this.__SubmitButton.setTop(0);
    this.__SubmitButton.setWidth(this.__PanelSize.submitWidth);
    this.__SubmitButton.setStyleProperty("line-height", sprintf("%dpx", this.__SubmitButton.getHeight()));
    this.__SubmitButton.addEventListener("click", function () {
        this._onButtonClick();
    }, this);
    this.__LastPanelLeft =left + this.__SubmitButton.getWidth();
    this.add(this.__SubmitButton);
};

CDateSearchComponent.prototype._initEndPanel = function(left)
{
    this.__EndPanel = new CDateComponent();
    this.__EndPanel.initObject(this.__EliApplication, this);
    this.__EndPanel.setLeft(left);
    this.__EndPanel.setTop(0);
    this.__EndPanel.updatePlaceholderText(this.__Content.end);
    this.__LastPanelLeft = left + this.__EndPanel.getWidth();
    this.add(this.__EndPanel)
};

CDateSearchComponent.prototype._initLineComponent = function(left)
{
    this.__LineComponet = new BiComponent();
    this.__LineComponet.setId(newGuid());
    this.__LineComponet.setCssClassName("eli-date-line-component");
    this.__LineComponet.setWidth(this.__PanelSize.lineWidth);
    this.__LineComponet.setHeight(1);
    this.__LineComponet.setLeft(left);
    this.__LineComponet.setTop(this.__PanelSize.panelHeight/2);
    this.__LastPanelLeft = left + this.__LineComponet.getWidth();
    this.add(this.__LineComponet);
};

CDateSearchComponent.prototype._initStartPanel = function(left)
{
    this.__StartPanel = new CDateComponent();
    this.__StartPanel.initObject(this.__EliApplication, this);
    this.__StartPanel.setLeft(left);
    this.__StartPanel.setTop(0);
    this.__StartPanel.updatePlaceholderText(this.__Content.start);
    this.__LastPanelLeft = left + this.__StartPanel.getWidth();
    this.add(this.__StartPanel)
};

CDateSearchComponent.prototype._initMsgPanel = function(left)
{
    this.__MsgPanel = new BiLabel();
    this.__MsgPanel.setId(newGuid());
    this.__MsgPanel.setCssClassName("eli-date-panel-msg");
    this.__MsgPanel.setLeft(left);
    this.__MsgPanel.setTop(0);
    this.__MsgPanel.setHeight(this.__PanelSize.panelHeight);
    this.__MsgPanel.setWidth(this.__PanelSize.msgPanelWidth);
    this.__MsgPanel.setStyleProperty("line-height", sprintf("%dpx", this.__MsgPanel.getHeight()));
    this.__LastPanelLeft = left + this.__MsgPanel.getWidth();
    this.add(this.__MsgPanel);
};

CDateSearchComponent.prototype._onButtonClick = function()
{
    this.__MsgPanel.setText("");
    this.__StartTime = this.__StartPanel.getUserSelectedDate();

    if(!this.__StartTime)
    {
        this.__MsgPanel.setText("开始时间不能为空");
        return;
    }

    var startTime = this._formatDate(this.__StartTime);

    this.__EndTime = this.__EndPanel.getUserSelectedDate();
    if(!this.__EndTime)
    {
        this.__MsgPanel.setText("结束时间不能为空");
        return;
    }

    var endTime = this._formatDate(this.__EndTime);

    var startSeconds = this.__StartTime.getTime();
    var endSeconds = this.__EndTime.getTime();

    if(endSeconds <= startSeconds)
    {
        this.__MsgPanel.setText(this.__Content.msgError);
        return;
    }

    this.__Parent.updateReportInfo(startTime, endTime);
};

CDateSearchComponent.prototype._formatDate = function(date)
{
    var mon = date.getMonth() + 1;
    var day = date.getDate();
    var nowDay = date.getFullYear() + "-" + (mon<10?"0"+mon:mon) + "-" + (day<10?"0"+day:day);
    return nowDay;
};

CDateSearchComponent.prototype.getDateComponentWidth = function()
{
    return this.__LastPanelLeft;
};

CDateSearchComponent.prototype.initTimeText = function()
{
    this.__StartPanel.setText(this.__Content.start);
    this.__EndPanel.setText(this.__Content.end);
};








