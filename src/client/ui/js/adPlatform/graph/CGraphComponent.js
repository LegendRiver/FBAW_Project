/**
 * Created by yangtian on 16/10/28.
 */

function CGraphComponent()
{
    BiComponent.call(this);
}

CGraphComponent.prototype = new BiComponent;
CGraphComponent.prototype._className = "CGraphComponent";

CGraphComponent.prototype.initObject = function(parent)
{
    this.__Parent = parent;
    this._init();
};

CGraphComponent.prototype._init = function()
{

};

CGraphComponent.prototype.drawCallback = function()
{

};