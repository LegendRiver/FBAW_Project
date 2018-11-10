/**
 * Created by yangtian on 16/11/19.
 */

function CEliSystemEntrance()
{
    BiComponent.call(this);
    this.setId(newGuid());
    this.setCssClassName("eli-entrance-panel");


}

CEliSystemEntrance.prototype = new BiComponent;
CEliSystemEntrance.prototype._className = "CEliSystemEntrance";

CEliSystemEntrance.prototype.initObject = function(parent)
{
    this.__Parent = parent;
    this._init();
};

CEliSystemEntrance.prototype._init = function()
{

};


