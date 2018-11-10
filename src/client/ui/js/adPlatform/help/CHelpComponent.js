/**
 * Created by help on 16/9/01.
 */

function CHelpComponent()
{
    BiComponent.call(this);

}

CHelpComponent.prototype = new BiComponent;
CHelpComponent.prototype._className = "CHelpComponent";

CHelpComponent.prototype.initObject = function(eliApplication)
{
    this.__EliApplication = eliApplication;
    this._init();
};

CHelpComponent.prototype._init = function()
{
};