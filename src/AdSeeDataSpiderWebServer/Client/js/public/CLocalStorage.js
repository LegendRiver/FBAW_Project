/**
 * Created by fact  zengtao on 6/25/15 8:54 AM.
 */

function CLocalStorage()
{
    Object.call(this);
}

CLocalStorage.prototype.initObject = function(cacheTtl)
{
    this.__CACHE_PREFIX="ELI";
    this.__CacheTtl = cacheTtl;
    this.__Storage = window.localStorage;
    this.__MemoryCacheTable = new BiHashTable();
};

CLocalStorage.prototype.setCache = function(itemKey, itemData)
{
    var stamp, obj;
    stamp = Date.now();

    var dataKey = sprintf("%s_%s", this.__CACHE_PREFIX, itemKey);
    obj = {
        date: stamp,
        data: itemData
    };

    try
    {
        this.__Storage.setItem(dataKey, JSON.stringify(obj));
    }
    catch (ex)
    {
        writeLogMessage("WARNING", sprintf("add item failed,error message<%s>.", ex.message));
    }

    this.__MemoryCacheTable.add(dataKey, obj);
};

CLocalStorage.prototype.getCachedItem = function(itemKey)
{
    var key, obj;

    key = sprintf("%s_%s",this.__CACHE_PREFIX,itemKey);

    if(this.__MemoryCacheTable.hasKey(key))
    {
        var item = this.__MemoryCacheTable.item(key);
        if(item.date - Date.now() > this.__CacheTtl)
        {
            this.__Storage.removeItem(key);
            this.__MemoryCacheTable.remove(key);
            return false;
        }

        return item.data;
    }


    obj = this.__Storage.getItem(key);
    if(obj)
    {
        obj = JSON.parse(obj);

        if (Date.now() - parseInt(obj.date, 10) > CACHE_TTL)
        {
            //cache is expired! let us purge that item
            this.__Storage.removeItem(key);
            this.__MemoryCacheTable.remove(key);
            return false;
        }

        this.__MemoryCacheTable.add(key, obj);
        return obj.data;
    }

    return false;
};


CLocalStorage.prototype.removeCahcedItem = function(itemKey)
{
    var key, obj;
    key = sprintf("%s_%s",this.__CACHE_PREFIX,itemKey);

    if(this.__MemoryCacheTable.hasKey(key))
    {
        this.__MemoryCacheTable.remove(key);
        this.__Storage.removeItem(key);
    }

    obj = this.__Storage.getItem(key);
    if(obj)
    {
        this.__Storage.removeItem(key);
    }

    return true;
};