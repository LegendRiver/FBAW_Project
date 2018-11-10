/**
 * Created by yangtian on 16/12/2.
 */

function CStatementSinglePanel()
{
    BiComponent.call(this);

    this.__PanelSize = {
        panelHeight : 45,
        timeLabelWidth : 200,
        nameLabelWidth : 600,
    };

    this.setId(newGuid());
    this.setCssClassName("eli-statements-single-panel");
    this.setHeight(this.__PanelSize.panelHeight);
    this.setWidth(this.__PanelSize.timeLabelWidth + this.__PanelSize.nameLabelWidth);
    this.setVisible(false);
    this.__LastLabelRight = 0;

    this.__CurrentData = [];
    this.__CurrentTime = "";
    this.__CurrentName = ""

}

CStatementSinglePanel.prototype = new BiComponent;
CStatementSinglePanel.prototype._className = "CStatementSinglePanel";

CStatementSinglePanel.prototype.initObject = function(parent)
{
    this.__Parent = parent;
    this._init();
};

CStatementSinglePanel.prototype._init = function()
{
    this._initTimeLabel(this.__LastLabelRight);
    this._initNameLabel(this.__LastLabelRight);
};

CStatementSinglePanel.prototype._initTimeLabel = function(left)
{
    this.__TimeLabel = new BiLabel();
    this.__TimeLabel.setId(newGuid());
    this.__TimeLabel.setCssClassName("eli-statements-single-panel-time");
    this.__TimeLabel.setLeft(left);
    this.__TimeLabel.setTop(0);
    this.__TimeLabel.setHeight(this.__PanelSize.panelHeight);
    this.__TimeLabel.setWidth(this.__PanelSize.timeLabelWidth);
    this.__TimeLabel.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.panelHeight));
    this.add(this.__TimeLabel);

    this.__LastLabelRight = this.__TimeLabel.getWidth() + left;
};

CStatementSinglePanel.prototype._initNameLabel = function(left)
{
    this.__NameLabel = new BiLabel();
    this.__NameLabel.setId(newGuid());
    this.__NameLabel.setCssClassName("eli-statements-single-panel-name");
    this.__NameLabel.setLeft(left);
    this.__NameLabel.setTop(0);
    this.__NameLabel.setHeight(this.__PanelSize.panelHeight);
    this.__NameLabel.setWidth(this.__PanelSize.nameLabelWidth);
    this.__NameLabel.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.panelHeight));
    this.add(this.__NameLabel);

    this.__LastLabelRight = this.__NameLabel + left;
};

CStatementSinglePanel.prototype._setCurrentData = function(data)
{
    this.__CurrentData = data;
    this.__CurrentTime = data[StatementsFields.StartTime.Index];
    this.__CurrentName = data[StatementsFields.Name.Index];
};

CStatementSinglePanel.prototype.updateSinglePanelData = function(data)
{
    this._setCurrentData(data);
    this._updateText(this.__CurrentTime, this.__CurrentName);
};

CStatementSinglePanel.prototype._updateText = function(time, text)
{
    this.__TimeLabel.setText(time);
    this.__NameLabel.setText(text);
};

CStatementSinglePanel.prototype.clearText = function()
{
    this._updateText("", "");
    this.setVisible(false);
};

CStatementSinglePanel.prototype.getSinglePanelHeight = function()
{
    return this.getHeight();
};

CStatementSinglePanel.prototype.getSinglePanelWidth = function()
{
    return this.__TimeLabel.getWidth() + this.__NameLabel.getWidth();
};


