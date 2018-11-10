/**
 * Created by fact  zengtao on 11/6/15 3:32 PM.
 */

function CCheckListBox(controlDef)
{

}

CCheckListBox.prototype = new CBaseControl;
CCheckListBox.prototype._className = "CCheckListBox";

CCheckListBox.prototype.initObject = function(controlDef)
{
    this.__ControlDef = controlDef;
    this.__CHECK_BOX_ITEM_SIZE = new CSize(200,30);
    CBaseControl.call(this);
    this.init(this.__ControlDef);
    this.__CheckBoxTable = null;
    this._init();
};

CCheckListBox.prototype._init = function()
{
    this.__CheckBoxTable = new BiHashTable();
    if(this.__ControlDef.Id)
    {
        this.setId(this.__ControlDef.Id);
    }
    else
    {
        this.setId(newGuid());
    }

    if(this.__ControlDef.CssClassName)
    {
        this.setCssClassName(this.__ControlDef.CssClassName);
    }

    this._Data = [];

};

CCheckListBox.prototype.setData = function(data)
{
    this.__clearCheckBoxItems();
    var resultValue = null;
    try
    {
        resultValue = eval('(' + data + ')');
    }
    catch (e)
    {
        writeLogMessage("ERROR", sprintf("[<%s>%s]", "Invalid data,error message", e.message));
        return;
    }

    var errorCode = parseInt(resultValue.errorCode);
    if (errorCode != 0)
    {
        writeLogMessage("ERROR", sprintf("Server response error, error message<%s>, error code<%d>.", resultValue.message, errorCode));
        return;
    }

    if (resultValue.data.length > 0)
    {
        this.setIsLoaded(true);
        this._Data = resultValue.data;
        this.__createCheckBoxItems();
    }
};

CCheckListBox.prototype.__clearCheckBoxItems = function()
{
    var keys = this.__CheckBoxTable.getKeys();
    var itemNumber = keys.length;
    for(var index = 0; index < itemNumber; ++index)
    {
        var key = keys[index];
        var checkBoxItem = this.__CheckBoxTable.item(key);
        if(checkBoxItem)
        {
            this.remove(checkBoxItem);
        }
    }
    this.__CheckBoxTable.clear();
    this.clearItems();
};

CCheckListBox.prototype.__createCheckBoxItems = function()
{
    //location, size, text, value, isSelected
    var recordNumber = this._Data.length;
    var columnNumber = this.__ControlDef.ColumnNumber;
    var rowNumber = Math.ceil(recordNumber / columnNumber);
    var location = new CPoint(0, 0);
    for(var rowIndex = 0; rowIndex < rowNumber; ++rowIndex)
    {
        location.y = this.__CHECK_BOX_ITEM_SIZE.Height * rowIndex + 5;
        for(var columnIndex = 0; columnIndex < columnNumber; ++columnIndex)
        {
            var recordIndex = rowIndex * columnNumber + columnIndex;
            if(recordIndex > (recordNumber - 1))
            {
                return;
            }
            var record = this._Data[rowIndex * this.__ControlDef.ColumnNumber + columnIndex];
            if(record)
            {
                var label = record[this.__ControlDef.LabelFieldIndex];
                var key = record[this.__ControlDef.KeyFieldIndex];
                var isSelected = (this.__ControlDef.SelectedFieldIndex ? (parseInt(record[this.__ControlDef.SelectedFieldIndex]) == 1):false);
                location.x = this.__CHECK_BOX_ITEM_SIZE.Width * columnIndex + 5;
                var checkBoxItem = new CCheckBox();
                checkBoxItem.initObject(location, this.__CHECK_BOX_ITEM_SIZE, label, record, isSelected);
                this.__CheckBoxTable.add(key, checkBoxItem);
                this.addItem(checkBoxItem);
                this.add(checkBoxItem);
                
            }
        }
    }
};

CCheckListBox.prototype.getKeyFieldIndex = function()
{
    return this.__ControlDef.KeyFieldIndex;
};

CCheckListBox.prototype.getData = function()
{
    var values = [];
    var itemNumber = this._Items.length;
    for(var index = 0; index < itemNumber; ++index)
    {
        var item = this._Items[index];
        if(item.getFieldValue && item.getFieldValue())
        {
            values.push(item.getUserData());
        }
    }

    return values;
};

CCheckListBox.prototype.setSelectedItems = function(selectedItemKeys)
{
    var recordNumber = selectedItemKeys.length;
    for(var index = 0; index < recordNumber; ++index)
    {
        var key = selectedItemKeys[index];
        var checkBoxItem = this.__CheckBoxTable.item(key);
        if(checkBoxItem)
        {
            checkBoxItem.setSelectedState(true);
        }
    }
};

CCheckListBox.prototype.initControl = function()
{
    this.__clearCheckBoxItems();
    this.setIsLoaded(false);
};

CCheckListBox.prototype.setListItems = function(listItems)
{
    this.setIsLoaded(true);
    this._Data = listItems;
    this.__clearCheckBoxItems();
    this.__createCheckBoxItems();
};