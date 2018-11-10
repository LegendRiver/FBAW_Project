/**
 * Created by zengtao on 2015/2/5.
 */

function CTimeInterval(ownerObject, intervalTriggerEvent)
{
    this.Owner = ownerObject;
    this.IntervalTriggerEvent = intervalTriggerEvent;
    this.handlInterval = -1;
}

CTimeInterval.prototype.run = function(intervalObj)
{
    if(intervalObj.IntervalTriggerEvent && (intervalObj.handlInterval != -1))
    {
        intervalObj.IntervalTriggerEvent(intervalObj);
    }
};

CTimeInterval.prototype.startInterval = function(intervalObj, intervalValue)
{
    this.handlInterval = setInterval(intervalObj.run, intervalValue, intervalObj, intervalValue);
};

CTimeInterval.prototype.stopInterval = function()
{
    clearInterval(this.handlInterval);
    this.handlInterval = -1;
};