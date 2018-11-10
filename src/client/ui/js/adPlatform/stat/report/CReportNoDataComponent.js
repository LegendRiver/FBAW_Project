/**
 * Created by yangtian on 16/11/11.
 */

function CReportNoDataComponent()
{
    BiComponent.call(this);
    this.setCssClassName("eli-no-data-component");
    this.setId(newGuid());
    this.__TextLabelHeight =600;
    this.__TextLabelContent = "当前暂无数据";
}

CReportNoDataComponent.prototype = new BiComponent;
CReportNoDataComponent.prototype._className = "CReportNoDataComponent";

CReportNoDataComponent.prototype.initObject = function(parent)
{
    this.__Parent = parent;
    this._init();
};

CReportNoDataComponent.prototype._init = function()
{
    this._initTextLabel();
};

CReportNoDataComponent.prototype._initTextLabel = function()
{
    this.__TextLabel = new BiLabel();
    this.__TextLabel.setId(newGuid());
    this.__TextLabel.setCssClassName("eli-no-data-panel");
    this.__TextLabel.setText(this.__TextLabelContent);
    this.__TextLabel.setLeft(0);
    this.__TextLabel.setRight(0);
    this.__TextLabel.setTop(0);
    this.__TextLabel.setHeight(this.__TextLabelHeight);
    this.__TextLabel.setStyleProperty("line-height", sprintf("%dpx", this.__TextLabelHeight));
    this.add(this.__TextLabel);
};

CReportNoDataComponent.prototype.updatePanelVisible = function(flag)
{
    this.setVisible(flag);
};




