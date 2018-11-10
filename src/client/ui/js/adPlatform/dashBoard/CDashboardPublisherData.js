/**
 * Created by yangtian on 16/11/10.
 */

function CDashboardPublisherData()
{
    this.__PublishersDataHash = new BiHashTable();
    this.__PublisherTotalSpent = 0;
}

CDashboardPublisherData.prototype.updatePublisherData = function(date, impression, click, spent)
{
    this.__PublisherTotalSpent += spent;
    if(!this.__PublishersDataHash.hasKey(date))
    {
        var array = [];
        array.push(impression);

        array.push(click);
        array.push(spent);

        this.__PublishersDataHash.add(date, array);
        return;
    }

    var values = this.__PublishersDataHash.item(date);
    var array = [];
    array.push(values[0] + impression);
    array.push(values[1] + click);
    array.push(values[2] + spent);

    this.__PublishersDataHash.remove(date);
    this.__PublishersDataHash.add(date, array);
};

CDashboardPublisherData.prototype.getPublishersData = function()
{
    return this.__PublishersDataHash;
};

CDashboardPublisherData.prototype.getPUblisherTotalSpent = function()
{
    return this.__PublisherTotalSpent;
};