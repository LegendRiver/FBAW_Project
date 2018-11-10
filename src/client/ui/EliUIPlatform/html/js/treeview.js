/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiTreeViewCellInfo() {
    if (_biInPrototype) return;
    BiObject.call(this);
}
_p = _biExtend(BiTreeViewCellInfo, BiObject, "BiTreeViewCellInfo");
BiTreeViewCellInfo.addProperty("row", BiAccessType.READ_WRITE);
BiTreeViewCellInfo.addProperty("column", BiAccessType.READ_WRITE);
_p.getLeft = function () {
    return this._column;
};
_p.getTop = function () {
    return this._row;
};
_p.equals = function (oInfo) {
    return this._row == oInfo._row && this._column == oInfo._column;
};

function BiTreeViewStateManager() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
}
_p = _biExtend(BiTreeViewStateManager, BiEventTarget, "BiTreeViewStateManager");
_p._activeX = -1;
_p._activeY = -1;
_p._hoverX = -1;
_p._hoverY = -1;
_p._dragOverX = -1;
_p._dragOverY = -1;
BiTreeViewStateManager.addProperty("activeX", BiAccessType.READ);
BiTreeViewStateManager.addProperty("activeY", BiAccessType.READ);
BiTreeViewStateManager.addProperty("hoverX", BiAccessType.READ);
BiTreeViewStateManager.addProperty("hoverY", BiAccessType.READ);
_p.getDragX = function () {
    return this._activeX;
};
_p.getDragY = function () {
    return this._activeY;
};
BiTreeViewStateManager.addProperty("dragOverX", BiAccessType.READ);
BiTreeViewStateManager.addProperty("dragOverY", BiAccessType.READ);
_p.updateState = function (sType, x, y) {
    switch (sType) {
    case "mousedown":
        this.setActive(x, y);
        break;
    case "mouseup":
        this.setActive(-1, -1);
        break;
    case "mouseover":
    case "mousemove":
        this.setHover(x, y);
        break;
    case "mouseout":
        this.setHover(-1, -1);
        break;
    }
};
_p.getHeaderActive = function (x) {
    return this._activeX == x && this._activeY == -1;
};
_p.setActive = function (x, y) {
    this._activeX = x;
    this._activeY = y;
};
_p.setHover = function (x, y) {
    if (this._hoverX != x || this._hoverY != y) {
        this._hoverX = x;
        this._hoverY = y;
        this.dispatchEvent("hoverchanged");
    }
};
_p.setDragOver = function (x, y) {
    if (this._dragOverX != x || this._dragOverY != y) {
        this._dragOverX = x;
        this._dragOverY = y;
        this.dispatchEvent("dropoverchanged");
    }
};
_p.getActive = function (x, y) {
    return this._activeX == x && this._activeY == y;
};
_p.getHover = function (x, y) {
    return this._hoverX == x && this._hoverY == y;
};
_p.getDragOver = function (x, y) {
    return this._dragOverX == x && this._dragOverY == y;
};

function BiTreeViewSelectionModel(oOwner) {
    if (_biInPrototype) return;
    BiSelectionModel.call(this, oOwner);
    this._selectedItems.getItemHashCode = this.getItemHashCode;
}
_p = _biExtend(BiTreeViewSelectionModel, BiSelectionModel, "BiTreeViewSelectionModel");
_p._selectionMode = BiSelectionModel.SELECTION_MODE_ROW;
BiTreeViewSelectionModel.addProperty("selectionMode", BiAccessType.READ);
_p.setSelectionMode = function (sMode) {
    if (this._selectionMode != sMode) {
        this.deselectAll();
        this.setLeadItem(null);
        this.setAnchorItem(null);
        switch (sMode) {
        case "cell":
            this._selectionMode = BiSelectionModel.SELECTION_MODE_CELL;
            break;
        case "row":
            this._selectionMode = BiSelectionModel.SELECTION_MODE_ROW;
            break;
        }
    }
};
_p.getViewManager = function () {
    return this._owner.getViewManager();
};
_p.getDataModel = function () {
    return this._owner.getDataModel();
};
_p.getFirst = function () {
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (!dm || !vm) return null;
    if (dm.getRowCount() == 0) return null;
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) return new BiTreeViewSelectionModelItem(null, 0);
    else return vm.getColumnCount() > 0 ? new BiTreeViewSelectionModelItem(vm.getModelColumn(0), 0) : null;
};
_p.getLast = function () {
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (!dm || !vm || dm.getRowCount() == 0) return null;
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) return new BiTreeViewSelectionModelItem(null, dm.getRowCount() - 1);
    else return vm.getColumnCount() > 0 ? new BiTreeViewSelectionModelItem(vm.getModelColumn(vm.getColumnCount() - 1), dm.getRowCount() - 1) : null;
};
_p.isBefore = function (oItem1, oItem2) {
    return this._compare(oItem1, oItem2) < 0;
};
_p._compare = function (oItem1, oItem2) {
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) return oItem1.getRow() - oItem2.getRow();
    else {
        if (oItem1.getRow() == oItem2.getRow()) {
            var vm = this.getViewManager();
            return vm.getViewColumn(oItem1.getColumn()) - vm.getViewColumn(oItem2.getColumn());
        }
        return oItem1.getRow() - oItem2.getRow();
    }
};
_p.isEqual = function (oItem1, oItem2) {
    return oItem1 && oItem1.equals(oItem2);
};
_p.getItems = function () {
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (!dm || !vm) return [];
    var rc = dm.getRowCount();
    var res = [];
    var y;
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) {
        for (y = 0; y < rc; y++) res.push(new BiTreeViewSelectionModelItem(null, y));
    } else {
        var cc = vm.getColumnCount();
        for (y = 0; y < rc; y++)
            for (var x = 0; x < cc; x++) res.push(new BiTreeViewSelectionModelItem(vm.getModelColumn(x), y));
    }
    return res;
};
_p.getNext = function (oItem) {
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (!dm || !vm || dm.getRowCount() == 0) return null;
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) {
        if (oItem == null) return new BiTreeViewSelectionModelItem(null, 0);
        if (oItem.getRow() < dm.getRowCount() - 1) return new BiTreeViewSelectionModelItem(null, oItem.getRow() + 1);
        return null;
    } else {
        if (vm.getColumnCount() == 0) return null;
        if (oItem == null) return new BiTreeViewSelectionModelItem(vm.getModelColumn(0), 0);
        if (oItem.getRow() < dm.getRowCount() - 1) return new BiTreeViewSelectionModelItem(oItem.getColumn(), oItem.getRow() + 1);
        return null;
    }
};
_p.getPrevious = function (oItem) {
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (!dm || !vm) return null;
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) {
        if (oItem == null) return new BiTreeViewSelectionModelItem(null, dm.getRowCount() - 1);
        if (oItem.getRow() > 0) return new BiTreeViewSelectionModelItem(null, oItem.getRow() - 1);
        return null;
    } else {
        if (oItem == null) return new BiTreeViewSelectionModelItem(vm.getModelColumn(vm.getColumnCount() - 1), dm.getRowCount() - 1);
        if (oItem.getRow() > 0) return new BiTreeViewSelectionModelItem(oItem.getColumn(), oItem.getRow() - 1);
        return null;
    }
};
_p.getRight = function (oItem) {
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (!dm || !vm) return null;
    if (oItem == null) return this.getFirst();
    var x;
    if (this._owner.getRightToLeft()) x = vm.getPreviousColumn(oItem.getColumn());
    else x = vm.getNextColumn(oItem.getColumn()); if (x != null) return new BiTreeViewSelectionModelItem(x, oItem.getRow());
    return oItem;
};
_p.getLeft = function (oItem) {
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (!dm || !vm) return null;
    if (oItem == null) return this.getLast();
    var x;
    if (this._owner.getRightToLeft()) x = vm.getNextColumn(oItem.getColumn());
    else x = vm.getPreviousColumn(oItem.getColumn()); if (x != null) return new BiTreeViewSelectionModelItem(x, oItem.getRow());
    return oItem;
};
_p.getUp = function (oItem) {
    return !oItem ? this.getLast() : this.getPrevious(oItem);
};
_p.getDown = function (oItem) {
    return !oItem ? this.getFirst() : this.getNext(oItem);
};
_p.getPageUp = function (oItem) {
    if (oItem == null) return this.getLast();
    var vm = this.getViewManager();
    var startRow = vm.getFirstVisibleRow();
    var row;
    if (oItem.getRow() != startRow) row = startRow;
    else {
        var rowsPerPage = Math.floor((this._owner.getClientHeight() - (vm.getShowHeaders() ? vm.getHeadersHeight() : 0)) / vm.getRowHeight());
        row = oItem.getRow() - rowsPerPage + 1;
    }
    row = Math.max(0, row);
    return this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW ? new BiTreeViewSelectionModelItem(null, row) : new BiTreeViewSelectionModelItem(oItem.getColumn(), row);
};
_p.getPageDown = function (oItem) {
    if (oItem == null) return this.getFirst();
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (!dm || !vm) return null;
    var startRow = vm.getFirstVisibleRow();
    var rowsPerPage = Math.floor((this._owner.getClientHeight() - (vm.getShowHeaders() ? vm.getHeadersHeight() : 0)) / vm.getRowHeight());
    var row;
    if (oItem.getRow() != startRow + rowsPerPage - 1) row = startRow + rowsPerPage - 1;
    else row = oItem.getRow() + rowsPerPage - 1;
    row = Math.min(row, dm.getRowCount() - 1);
    return this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW ? new BiTreeViewSelectionModelItem(null, row) : new BiTreeViewSelectionModelItem(oItem.getColumn(), row);
};
_p.getHome = function (oItem) {
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW || oItem == null) return this.getFirst();
    var vm = this.getViewManager();
    return new BiTreeViewSelectionModelItem(vm.getModelColumn(0), oItem.getRow());
};
_p.getCtrlHome = function (oItem) {
    return this.getFirst();
};
_p.getEnd = function (oItem) {
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW || oItem == null) return this.getLast();
    var vm = this.getViewManager();
    return new BiTreeViewSelectionModelItem(vm.getModelColumn(vm.getColumnCount() - 1), oItem.getRow());
};
_p.getCtrlEnd = function (oItem) {
    return this.getLast();
};
_p.getItemHashCode = function (oItem) {
    return oItem.getRow() + "-" + oItem.getColumn();
};
_p.scrollItemIntoView = function (oItem) {
    var col = oItem.getColumn();
    if (col != -1 && col != null) this.getViewManager().scrollCellIntoView(col, oItem.getRow());
    else this.getViewManager().scrollRowIntoView(oItem.getRow());
};
_p.getItemLeft = function (oItem) {
    var vm = this.getViewManager();
    var col = oItem.getColumn();
    if (col != -1 && col != null) return vm.getCellBounds(col, oItem.getRow()).left;
    else return vm.getRowBounds(oItem.getRow()).left;
};
_p.getItemWidth = function (oItem) {
    var vm = this.getViewManager();
    var col = oItem.getColumn();
    if (col != -1 && col != null) return vm.getCellBounds(col, oItem.getRow()).width;
    else return vm.getRowBounds(oItem.getRow()).width;
};
_p.getItemTop = function (oItem) {
    var vm = this.getViewManager();
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) return vm.getRowBounds(oItem.getRow()).top;
    else return vm.getCellBounds(oItem.getColumn(), oItem.getRow()).top;
};
_p.getItemHeight = function (oItem) {
    return this.getDataModel().getRowHeight();
};
_p.updateItemSelectionState = function (oItem, bSelected) {
    var dm = this.getDataModel();
    if (!dm) return;
    var x = oItem.getColumn();
    var y = oItem.getRow();
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) {
        if (dm.getRowSelected(y) != bSelected) {
            dm._setRowSelected(y, bSelected);
            this._owner._updateRowSelected(y);
        }
    } else {
        if (dm.getCellSelected(x, y) != bSelected) {
            this.getDataModel()._setCellSelected(x, y, bSelected);
            this._owner._updateCellSelected(x, y);
        }
    }
};
_p.updateItemLeadState = function (oItem, bLead) {
    var dm = this.getDataModel();
    if (!dm) return;
    var x = oItem.getColumn();
    var y = oItem.getRow();
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) {
        if (dm.getRowIsLead(y) != bLead) {
            dm._setRowIsLead(y, bLead);
            this._owner._updateRowSelected(y);
        }
    } else {
        if (dm.getCellIsLead(x, y) != bLead) {
            this.getDataModel()._setCellIsLead(x, y, bLead);
            this._owner._updateCellSelected(x, y);
        }
    }
};
_p.updateItemAnchorState = function (oItem, bAnchor) {
    var dm = this.getDataModel();
    if (!dm) return;
    var x = oItem.getColumn();
    var y = oItem.getRow();
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) {
        if (dm.getRowIsAnchor(y) != bAnchor) {
            dm._setRowIsAnchor(y, bAnchor);
            this._owner._updateRowSelected(y);
        }
    } else {
        if (dm.getCellIsAnchor(x, y) != bAnchor) {
            dm._setCellIsAnchor(x, y, bAnchor);
            this._owner._updateCellSelected(x, y);
        }
    }
};
_p.getItemSelected = function (oItem) {
    if (!this.getDataModel()) return false;
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) return this.getDataModel().getRowSelected(oItem.getRow());
    else return this.getDataModel().getCellSelected(oItem.getColumn(), oItem.getRow());
};
_p._selectItemRange = function (item1, item2, bDeselect) {
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) BiListSelectionModel.prototype._selectItemRange.call(this, item1, item2, bDeselect);
    else if (this._selectionMode == BiSelectionModel.SELECTION_MODE_CELL) {
        if (bDeselect) this._deselectAll();
        var vm = this.getViewManager();
        var ri1 = item1.getRow();
        var ci1 = vm.getViewColumn(item1.getColumn());
        var ri2 = item2.getRow();
        var ci2 = vm.getViewColumn(item2.getColumn());
        var yMin = Math.min(ri1, ri2);
        var yMax = Math.max(ri1, ri2);
        var xMin = Math.min(ci1, ci2);
        var xMax = Math.max(ci1, ci2);
        var ci;
        for (var y = yMin; y <= yMax; y++) {
            for (var x = xMin; x <= xMax; x++) {
                ci = new BiTreeViewSelectionModelItem(vm.getModelColumn(x), y);
                this._selectedItems.add(ci);
                this.updateItemSelectionState(ci, true);
            }
        }
    }
};
_p._containsItem = function (oItem, oChild) {
    return this.__containsItem(oItem.getRow(), oChild.getRow());
};
_p.__containsItem = function (nRow, nChild) {
    if (nRow > nChild) return false;
    if (nRow == nChild) return true;
    return (nChild <= nRow + this.getDataModel().getShownChildrenCount(nRow));
};
_p._containsLeadItem = function (oItem) {
    return this._leadItem && this._containsItem(oItem, this._leadItem);
};
_p._containsAnchorItem = function (oItem) {
    return this._anchorItem && this._containsItem(oItem, this._anchorItem);
};
_p.containsSelectedNodes = function (oItem) {
    var items = this._selectedItems.toArray();
    for (var i = 0; i < items.length; i++) {
        if (this._containsItem(oItem, items[i])) return true;
    }
    return false;
};
_p._collapseNode = function (oItem) {
    var fireChange = false;
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_CELL && oItem.getColumn() == -1) oItem._column = 0;
    if (this._containsLeadItem(oItem)) this.setLeadItem(oItem);
    if (this._containsAnchorItem(oItem)) this.setAnchorItem(oItem);
    if (this.containsSelectedNodes(oItem)) {
        var oldVal = this._getChangeValue();
        var oldFireChange = this._fireChange;
        this._fireChange = false;
        this._deselectAllDescendants(oItem);
        this.setItemSelected(oItem, true);
        this._fireChange = oldFireChange;
        if (this._fireChange && this._hasChanged(oldVal)) fireChange = true;
    }
    this.adjustSelection(oItem.getRow() + 1, -this.getDataModel().getShownChildrenCount(oItem.getRow()));
    if (fireChange) this._dispatchChange();
};
_p._expandNode = function (oItem) {
    this.adjustSelection(oItem.getRow() + 1, this.getDataModel().getShownChildrenCount(oItem.getRow()));
};
_p._deselectAllDescendants = function (oItem) {
    var i2;
    var items = this._selectedItems.toArray();
    for (var i = items.length - 1; i >= 0; i--) {
        i2 = items[i];
        if (oItem != i2 && this._containsItem(oItem, i2)) {
            this.setItemSelected(i2, false);
            this._selectedItems.remove(i2);
        }
    }
};
_p.getRowSelected = function (y) {
    return this.getDataModel().getRowSelected(y);
};
_p.setRowSelected = function (y, b) {
    this.setItemSelected(new BiTreeViewSelectionModelItem(null, y), b);
};
_p.getCellSelected = function (x, y) {
    return this.getDataModel().getCellSelected(x, y);
};
_p.setCellSelected = function (x, y, b) {
    this.setItemSelected(new BiTreeViewSelectionModelItem(x, y), b);
};
_p.getRowIsLead = function (y) {
    return this.getDataModel().getRowIsLead(y);
};
_p.getCellIsLead = function (x, y) {
    return this.getDataModel().getCellIsLead(x, y);
};
_p.getCellIsAnchor = function (x, y) {
    return this.getDataModel().getCellIsAnchor(x, y);
};
_p.setLeadItem = function (oItem) {
    BiSelectionModel.prototype.setLeadItem.call(this, oItem);
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) {
        if (this._leadItem && !this.isEqual(oItem, this._leadItem)) {
            this.getDataModel()._setRowIsLead(this._leadItem.getRow(), false);
        }
        if (oItem) {
            this.getDataModel()._setRowIsLead(oItem.getRow(), true);
        }
    } else {
        if (this._leadItem && !this.isEqual(oItem, this._leadItem)) {
            this.getDataModel()._setCellIsLead(this._leadItem.getColumn(), this._leadItem.getRow(), false);
            this._leadItem = null;
        }
        if (oItem) {
            this.getDataModel()._setCellIsLead(oItem.getColumn(), oItem.getRow(), true);
        }
    }
};
_p.setAnchorItem = function (oItem) {
    BiSelectionModel.prototype.setAnchorItem.call(this, oItem);
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) {
        if (this._anchorItem && !this.isEqual(oItem, this._anchorItem)) {
            this.getDataModel()._setRowIsAnchor(this._anchorItem.getRow(), false);
        }
        if (oItem) {
            this.getDataModel()._setRowIsAnchor(oItem.getRow(), true);
        }
    } else {
        if (this._anchorItem && !this.isEqual(oItem, this._anchorItem)) {
            this.getDataModel()._setCellIsAnchor(this._anchorItem.getColumn(), this._anchorItem.getRow(), false);
            this._anchorItem = null;
        }
        if (oItem) {
            this.getDataModel()._setCellIsAnchor(oItem.getColumn(), oItem.getRow(), true);
        }
    }
};
_p.adjustSelection = function (nRow, nCount) {
    var reinsert = [];
    var item, itemRow;
    var leadRow = this._leadItem ? this._leadItem.getRow() : -1;
    var anchorRow = this._anchorItem ? this._anchorItem.getRow() : -1;
    var hasSelected = false;
    var items = this._selectedItems.toArray();
    var i;
    for (i = items.length - 1; i >= 0; i--) {
        item = items[i];
        itemRow = item.getRow();
        if (itemRow >= nRow) {
            this._selectedItems.remove(item);
            if (!(nCount < 0 && itemRow <= nRow - nCount - 1)) {
                item.setRow(itemRow + nCount);
                reinsert.push(item);
                continue;
            }
        }
        hasSelected = true;
    }
    for (i = 0; i < reinsert.length; i++) {
        item = reinsert[i];
        this._selectedItems.add(item);
    }
    var rowCount = this.getDataModel().getRowCount();
    var col, row;
    if (leadRow >= rowCount || nCount < 0 && leadRow > nRow || nCount > 0 && leadRow >= nRow) {
        col = this._leadItem.getColumn();
        this._leadItem = null;
        row = Math.min(rowCount - 1, leadRow + nCount);
        if (row >= 0) this._leadItem = new BiTreeViewSelectionModelItem(col, row);
    }
    if (anchorRow >= rowCount || nCount < 0 && anchorRow > nRow || nCount > 0 && anchorRow >= nRow) {
        col = this._anchorItem.getColumn();
        this._anchorItem = null;
        row = Math.min(rowCount - 1, anchorRow + nCount);
        if (row >= 0) this._anchorItem = new BiTreeViewSelectionModelItem(col, row);
    }
    var stillAnySelected = this._selectedItems.toArray().length > 0;
    if (hasSelected && !stillAnySelected && this._leadItem) this._selectedItems.add(this._leadItem);
};
_p._syncAfterSort = function () {
    var dm = this.getDataModel();
    var rowCount = dm.getRowCount();
    var columnCount = this.getViewManager().getColumnCount();
    this._selectedItems.removeAll();
    this._leadItem = null;
    this._anchorItem = null;
    var item, y;
    if (this._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) {
        for (y = 0; y < rowCount; y++) {
            if (dm.getRowSelected(y)) {
                item = new BiTreeViewSelectionModelItem(null, y);
                this._selectedItems.add(item);
            }
            if (dm.getRowIsLead(y)) item = this._leadItem = item || new BiTreeViewSelectionModelItem(null, y);
            if (dm.getRowIsAnchor(y)) this._anchorItem = item || new BiTreeViewSelectionModelItem(null, y);
        }
    } else {
        for (y = 0; y < rowCount; y++) {
            for (var x = 0; x < columnCount; x++) {
                if (dm.getCellSelected(x, y)) {
                    item = new BiTreeViewSelectionModelItem(x, y);
                    this._selectedItems.add(item);
                }
                if (dm.getCellIsLead(x, y)) item = this._leadItem = item || new BiTreeViewSelectionModelItem(x, y);
                if (dm.getCellIsAnchor(x, y)) this._anchorItem = item || new BiTreeViewSelectionModelItem(x, y);
            }
        }
    }
};
_p._removeAt = function (row) {
    var is = this.getSelectedItems();
    for (var i = is.length - 1; i >= 0; i--) {
        var item = is[i];
        var ri = item.getRow();
        if (row == ri) this.setItemSelected(item, false);
        else if (ri > row) item.setRow(ri - 1);
    }
};
_p._update = function () {
    var dm = this.getDataModel();
    if (!dm) {
        return;
    }
    var rowCount = dm.getRowCount();
    if (rowCount > 0) {
        var leadRow = this._leadItem ? this._leadItem.getRow() : -1;
        var leadCol = this._leadItem ? this._leadItem.getColumn() : null;
        var anchorRow = this._anchorItem ? this._anchorItem.getRow() : -1;
        var anchorCol = this._anchorItem ? this._anchorItem.getColumn() : null;
        if (leadRow >= rowCount) {
            this._leadItem = new BiTreeViewSelectionModelItem(leadCol, rowCount - 1);
        }
        if (anchorRow >= rowCount) {
            this._anchorItem = new BiTreeViewSelectionModelItem(anchorCol, rowCount - 1);
        }
    } else this._leadItem = this._anchorItem = null;
};

function BiTreeViewSelectionModelItem(x, y) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._row = y;
    this._column = x == null ? -1 : x;
}
_p = _biExtend(BiTreeViewSelectionModelItem, BiObject, "BiTreeViewSelectionModelItem");
BiTreeViewSelectionModelItem.addProperty("row", BiAccessType.READ_WRITE);
_p.getLeft = function () {
    return this._column;
};
_p.getTop = function () {
    return this._row;
};
BiTreeViewSelectionModelItem.addProperty("column", BiAccessType.READ_WRITE);
_p.equals = function (oItem2) {
    return oItem2 != null && this._row == oItem2.getRow() && this._column == oItem2.getColumn();
};

function BiTreeViewViewManager(oTreeView) {
    if (_biInPrototype) return;
    this._treeView = oTreeView;
    this._cache = null;
};
_p = _biExtend(BiTreeViewViewManager, BiObject, "BiTreeViewViewManager");
BiTreeViewViewManager.addProperty("treeView", BiAccessType.READ);
_p.setTreeView = function (tv) {
    this._treeView = tv;
    if (this._rowHeight) this.setRowHeight(this._rowHeight);
};
_p.getDataModel = function () {
    return this._treeView.getDataModel();
};
_p._showGridLines = true;
BiTreeViewViewManager.addProperty("showGridLines", BiAccessType.READ_WRITE);
_p.resetCache = function () {
    this._visibleColumnOrders = null;
    this._invertedColumnOrders = null;
    this._columnCache = null;
    this._cache = null;
};
_p.setScrollLeft = function (n) {
    if (this._cache == null) this._cache = {};
    if (this._cache.scrollLeft != n) {
        this._cache.scrollLeft = n;
        var fvc = this._getFirstVisibleColumn(n);
        if (fvc == null) {
            fvc = this._getLastVisibleColumn() || 0;
        }
        this._cache.firstVisibleColumn = fvc;
        this._cache.scrollLeft = this.getColumnLeft(this._cache.firstVisibleColumn);
    }
};
_p.setScrollTop = function (n) {
    if (this._cache == null) this._cache = {};
    if (this._cache.scrollTop != n) {
        this._cache.scrollTop = n;
        this._cache.firstVisibleRow = this._getFirstVisibleRow(n);
        this._cache.scrollTop = this._cache.firstVisibleRow * this.getRowHeight();
    }
};
_p._ensureCache = function () {
    if (this._cache == null) this._cache = {};
    this._cache.scrollLeft = -1;
    this._cache.scrollTop = -1;
    if (this._treeView && this._treeView.getCreated()) {
        this.setScrollLeft(this._treeView.getScrollLeftExact());
        this.setScrollTop(this._treeView.getScrollTopExact());
    } else {
        this.setScrollLeft(0);
        this.setScrollTop(0);
    }
};
_p.scrollColumnIntoView = function (x) {
    if (this._cache == null) this._ensureCache();
    var l = this.getShowRowHeaders() ? this.getRowHeadersWidth() : 0;
    var g = this._treeView;
    var scrollLeft = this._cache.scrollLeft;
    var clientWidth = g.getClientWidth();
    var bounds = this.getColumnBounds(x);
    var rtl = this._getRightToLeft();
    if (!rtl) {
        if (bounds.left - l < scrollLeft) g.setScrollLeft(bounds.left - l);
        else if (bounds.left + bounds.width > scrollLeft + clientWidth) g.setScrollLeft(bounds.left + bounds.width - clientWidth);
    } else {
        var sr2;
        if (bounds.left - l <= scrollLeft) sr2 = bounds.left - l;
        else if (bounds.left + bounds.width >= scrollLeft + clientWidth) sr2 = bounds.left + bounds.width - clientWidth;
        g.setScrollLeft(this._treeView._gridBodyElement.scrollWidth - sr2 - clientWidth);
    }
};
_p.scrollRowIntoView = function (y) {
    if (this._cache == null) this._ensureCache();
    var g = this._treeView;
    var t = this.getShowHeaders() ? this.getHeadersHeight() : 0;
    var scrollTop = this._cache.scrollTop;
    var clientHeight = g.getClientHeight() - t;
    var bounds = this.getRowBounds(y);
    if (bounds.top <= scrollTop) g.setScrollTop(bounds.top);
    else if (bounds.top + bounds.height > scrollTop + clientHeight) g.setScrollTop(Math.ceil((bounds.top + bounds.height - clientHeight) / this.getRowHeight()) * this.getRowHeight());
};
_p.scrollCellIntoView = function (x, y) {
    this.scrollRowIntoView(y);
    this.scrollColumnIntoView(x);
};
_p.scrollSubtreeIntoView = function (y) {
    if (this._cache == null) this._ensureCache();
    var bounds = this.getRowBounds(y);
    var g = this._treeView;
    var t = bounds.top;
    var st = this._cache.scrollTop;
    var ch = g.getClientHeight();
    var fh = this.getShowHeaders() ? this.getHeadersHeight() : 0;
    var lastY = y + this.getDataModel().getShownChildrenCount(y);
    var lastBounds = this.getRowBounds(lastY);
    var lastTop = lastBounds.top;
    var lastHeight = lastBounds.height;
    var h = lastTop + lastHeight - t;
    if (h > ch || t <= st) g.setScrollTop(t - fh);
    else if (t + h > st + ch) g.setScrollTop(Math.ceil((t + h - ch) / this.getRowHeight()) * this.getRowHeight());
    this._ensureCache();
};
_p.getColumnCount = function () {
    if (this._columnCache && "count" in this._columnCache) return this._columnCache.count;
    var dm = this.getDataModel();
    if (!this._columnCache) this._columnCache = {};
    if (dm) {
        var l = dm.getColumnCount();
        var sum = 0;
        for (var mx = 0; mx < l; mx++) {
            if (this.getColumnVisible(mx)) sum++;
        }
        return this._columnCache.count = sum;
    }
    return this._columnCache.count = 0;
};
_p.getColumnVisible = function (x) {
    return !("_hiddenColumns" in this && x in this._hiddenColumns);
};
_p.setColumnVisible = function (x, b) {
    if (!("_hiddenColumns" in this)) this._hiddenColumns = {};
    if (!b) this._hiddenColumns[x] = true;
    else delete this._hiddenColumns[x];
    this._visibleColumnOrders = null;
    this._invertedColumnOrders = null;
    this._columnCache = null;
    this._cache = null;
};
_p.getCanResizeColumn = function (x) {
    return true;
};
_p.getCanMoveColumn = function (x) {
    return true;
};
_p._indentColumn = -1;
BiTreeViewViewManager.addProperty("indentColumn", BiAccessType.READ_WRITE);
_p.getShowExpandIcon = function (y) {
    return true;
};
_p._highlightSortColumn = true;
BiTreeViewViewManager.addProperty("highlightSortColumn", BiAccessType.READ_WRITE);
_p._columnCache = null;
_p.getFirstVisibleColumn = function () {
    if (this._cache == null) this._ensureCache();
    this._ensureColumnOrders();
    return this._cache.firstVisibleColumn;
};
_p._getFirstVisibleColumn = function (nScrollLeft) {
    var i = 0;
    var x = 0;
    var mx;
    var scrollX = this._getRightToLeft() ? this._getScrollRight(nScrollLeft) - 1 : nScrollLeft;
    var count = this.getColumnCount();
    while (x < scrollX && i < count) {
        mx = this.getModelColumn(i);
        if (this.getColumnVisible(mx)) x += this.getColumnWidth(mx);
        i++;
    }
    return this.getModelColumn(i);
};
_p._getLastVisibleColumn = function () {
    var mx;
    for (var vx = this.getColumnCount() - 1; vx >= 0; vx--) {
        mx = this.getModelColumn(vx);
        if (this.getColumnVisible(mx)) return mx;
    }
    return null;
};
_p._getRightToLeft = function () {
    return this._treeView.getRightToLeft();
};
_p._getScrollRight = function (nScrollLeft) {
    return this._treeView._gridBodyElement.scrollWidth - nScrollLeft - this._treeView._gridBodyElement.clientWidth;
};
_p.getColumnBounds = function (x) {
    var t = this.getShowHeaders() ? this.getHeadersHeight() : 0;
    var l = this.getShowRowHeaders() ? this.getRowHeadersWidth() : 0;
    return {
        left: l + this.getColumnLeft(x),
        width: this.getColumnWidth(x),
        top: t,
        height: this.getDataModel().getRowCount() * this.getRowHeight()
    };
};
_p.getColumnLeft = function (x) {
    if (this._columnCache) {
        if ("left" in this._columnCache) {
            if (x in this._columnCache.left) return this._columnCache.left[x];
        } else this._columnCache.left = {};
    } else this._columnCache = {
        left: {}
    };
    var sum = 0;
    for (var mx = this.getModelColumn(0); mx != x && mx != null; mx = this.getNextColumn(mx)) {
        this._columnCache.left[mx] = sum;
        if (this.getColumnVisible(mx)) sum += this.getColumnWidth(mx);
    }
    return this._columnCache.left[x] = sum;
};
_p.getNextColumn = function (mx) {
    return this._visibleColumnOrders[this._invertedColumnOrders[mx] + 1];
};
_p.getPreviousColumn = function (mx) {
    return this._visibleColumnOrders[this._invertedColumnOrders[mx] - 1];
};
_p.insertColumnBefore = function (x, beforeX) {
    this._columnOrders.remove(x);
    this._columnOrders.insertBefore(x, beforeX);
    this._columnCache = null;
    this._visibleColumnOrders = null;
    this._invertedColumnOrders = null;
};
_p.getColumnAt = function (x) {
    if (this._getRightToLeft()) x = this._treeView._gridBodyElement.offsetWidth - x;
    var rowHeadersWidth = this.getShowRowHeaders() ? this.getRowHeadersWidth() : 0;
    if (x < rowHeadersWidth) return -1;
    if (this._cache == null) this._ensureCache();
    x -= rowHeadersWidth;
    var mx = this._cache.firstVisibleColumn;
    var l = this.getColumnLeft(mx) - (this.getColumnVisible(mx) ? this.getColumnWidth(mx) : 0);
    x += l;
    for (; mx != null; mx = this.getNextColumn(mx)) {
        if (this.getColumnVisible(mx)) l += this.getColumnWidth(mx);
        if (l > x) return mx;
    }
    if (mx == null) return this.getModelColumn(this.getColumnCount());
    return this.getModelColumn(this.getColumnCount() - 1);
};
_p.getColumnWidth = function (x) {
    if (this._columnWidths && x in this._columnWidths) return this._columnWidths[x];
    return 150;
};
_p.setColumnWidth = function (x, w) {
    this._columnCache = null;
    if (!this._columnWidths) this._columnWidths = {};
    this._columnWidths[x] = w;
};
_p.getShownColumnsWidth = function () {
    if (this._columnCache) {
        if ("total" in this._columnCache) return this._columnCache.total;
        if (!("left" in this._columnCache)) this._columnCache.left = {};
    } else this._columnCache = {
        left: {}
    };
    var sum = 0;
    if (this.getColumnCount() > 0) {
        for (var mx = this.getModelColumn(0); mx != null; mx = this.getNextColumn(mx)) {
            this._columnCache.left[mx] = sum;
            if (this.getColumnVisible(mx)) sum += this.getColumnWidth(mx);
        }
    }
    return this._columnCache.total = sum;
};
_p._ensureColumnOrders = function () {
    var cc, dmcc, i;
    var dm = this.getDataModel();
    if (!dm) {
        if (!this._columnOrders) this._columnOrders = [];
        this._visibleColumnOrders = [];
        this._invertedColumnOrders = [];
        return;
    }
    dmcc = dm.getColumnCount();
    if (!this._columnOrders) {
        this._columnOrders = [];
        for (i = 0; i < dmcc; i++) this._columnOrders.push(i);
        this._visibleColumnOrders = null;
        this._invertedColumnOrders = null;
    }
    if (this._columnOrders.length > dmcc) {
        for (i = this._columnOrders.length - 1; i >= 0; i--)
            if (this._columnOrders[i] >= dmcc || this._columnOrders[i] == null) this._columnOrders.removeAt(i);
    }
    if (this._columnOrders.length < dmcc) {
        var hash = {};
        for (i = 0; i < this._columnOrders.length; i++) hash[this._columnOrders[i]] = true;
        for (i = 0; i < dmcc; i++) {
            if (!(i in hash)) {
                this._columnOrders.push(i);
                hash[i] = true;
            }
        }
    }
    if (!this._visibleColumnOrders) {
        this._visibleColumnOrders = [];
        for (i = 0; i < dmcc; i++) {
            if (this.getColumnVisible(this._columnOrders[i])) this._visibleColumnOrders.push(this._columnOrders[i]);
        }
        this._invertedColumnOrders = null;
    }
    if (!this._invertedColumnOrders) {
        cc = this._visibleColumnOrders.length;
        this._invertedColumnOrders = [];
        for (i = 0; i < cc; i++) this._invertedColumnOrders[this._visibleColumnOrders[i]] = i;
    }
};
_p.fitColumnWidths = function () {
    var cc = this.getColumnCount();
    var maxWidth = this._treeView.getClientWidth();
    var rowHeaderWidth = this.getShowRowHeaders() ? this.getRowHeadersWidth() : 0;
    maxWidth -= rowHeaderWidth;
    var columnWidth = Math.max(1, (maxWidth / cc));
    var l = this.getDataModel().getColumnCount();
    for (var i = 0; i < l; i++) {
        if (this.getColumnVisible(i)) {
            this.setColumnWidth(i, columnWidth);
        }
    }
    this._treeView.update();
};
_p.getModelColumn = function (vx) {
    this._ensureColumnOrders();
    return this._visibleColumnOrders[vx];
};
_p.getViewColumn = function (mx) {
    this._ensureColumnOrders();
    return this._invertedColumnOrders[mx];
};
_p.setColumnOrders = function (oOrders) {
    var dm = this.getDataModel();
    this._columnCache = null;
    this._columnOrders = [];
    var dmcc = dm.getColumnCount();
    for (var x = 0; x < dmcc; x++) {
        this._columnOrders.push(oOrders[x]);
    }
    this._visibleColumnOrders = null;
    this._invertedColumnOrders = null;
};
_p.getColumnOrders = function () {
    return this._columnOrders.concat([]);
};
_p._rowHeight = BiTreeViewBase._getDefaultRowHeight();
BiTreeViewViewManager.addProperty("rowHeight", BiAccessType.READ);
_p.setRowHeight = function (nHeight) {
    this._rowHeight = nHeight;
    if (this._treeView && !this._treeView._useNativeScrollBars) this._treeView._vScrollBar.setUnitIncrement(nHeight);
};
_p.getCellHeight = function (y) {
    return this.getRowHeight();
};
_p.getCellWidth = function (x) {
    return this.getColumnWidth(x);
};
_p.getRowBounds = function (y) {
    var l = this.getShowRowHeaders() ? this.getRowHeadersWidth() : 0;
    return {
        left: l,
        width: l + this.getShownColumnsWidth(),
        top: y * this.getRowHeight(),
        height: this.getRowHeight()
    };
};
_p.getRowAt = function (y) {
    if (this._cache == null) this._ensureCache();
    var nScrollTop = this._cache.scrollTop;
    var headersHeight = this.getShowHeaders() ? this.getHeadersHeight() : 0;
    if (y < headersHeight) return -1;
    y -= headersHeight;
    return Math.floor((y + nScrollTop) / this.getRowHeight());
};
_p.getFirstVisibleRow = function () {
    if (this._cache == null) this._ensureCache();
    return this._cache.firstVisibleRow;
};
_p._getFirstVisibleRow = function (nScrollTop) {
    return Math.ceil(nScrollTop / this.getRowHeight());
};
_p.getPageCount = function () {
    return Math.ceil((this._treeView.getClientHeight() - (this.getShowHeaders() ? this.getHeadersHeight() : 0)) / this.getRowHeight());
};
_p.rowCountChanged = function (nRow, nCount) {
    this._treeView.getSelectionModel().adjustSelection(nRow, nCount);
};
_p.getCellPaddingX = function () {
    return BiBrowserCheck.quirks.useContentBoxForTd ? 8 : 0;
};
_p.getCellBounds = function (x, y) {
    var l = this.getShowRowHeaders() ? this.getRowHeadersWidth() : 0;
    var t = this.getShowHeaders() ? this.getHeadersHeight() : 0;
    return {
        left: l + this.getColumnLeft(x),
        top: t + y * this.getRowHeight(),
        width: this.getColumnWidth(x),
        height: this.getRowHeight()
    };
};
_p._showHeaders = true;
BiTreeViewViewManager.addProperty("showHeaders", BiAccessType.READ_WRITE);
_p._headersHeight = BiTreeViewBase._getDefaultRowHeight();
BiTreeViewViewManager.addProperty("headersHeight", BiAccessType.READ_WRITE);
BiTreeViewViewManager.addProperty("ascendingIcon", BiAccessType.WRITE);
_p.getAscendingIcon = function () {
    if (this._ascendingIcon != null) return this._ascendingIcon;
    return application.getTheme().getAppearanceProperty("tree-view", "ascending-icon");
};
BiTreeViewViewManager.addProperty("descendingIcon", BiAccessType.WRITE);
_p.getDescendingIcon = function () {
    if (this._descendingIcon != null) return this._descendingIcon;
    return application.getTheme().getAppearanceProperty("tree-view", "descending-icon");
};
_p.getHeaderCellPaddingX = function () {
    return BiBrowserCheck.quirks.useContentBoxForTd ? 8 : 0;
};
_p.getHeaderBounds = function (x) {
    var l = this.getShowRowHeaders() ? this.getRowHeadersWidth() : 0;
    return {
        left: l + this.getColumnLeft(x),
        top: 0,
        width: this.getColumnWidth(x),
        height: this.getHeadersHeight()
    };
};
_p._showRowHeaders = true;
BiTreeViewViewManager.addProperty("showRowHeaders", BiAccessType.READ_WRITE);
_p._rowHeadersWidth = 50;
BiTreeViewViewManager.addProperty("rowHeadersWidth", BiAccessType.READ_WRITE);

function BiTreeViewResizeOutline() {
    if (_biInPrototype) return;
    BiResizeHandle.call(this);
    var b = new BiBorder;
    b.setLeft(1, "solid", "black");
    b.setRight(1, "solid", "black");
    this.setBorder(b);
    this.setRight(null);
    this._handleFor = this;
    this.setMinimumWidth(20);
    this.setStyleProperty("MozAppearance", "none");
    this.removeAll();
}
_p = _biExtend(BiTreeViewResizeOutline, BiResizeHandle, "BiTreeViewResizeOutline");

function BiTreeViewDragHeader() {
    if (_biInPrototype) return;
    BiLabel.call(this);
    this.setAppearance("grid-header");
    this.setOpacity(0.7);
    this.setIconPosition("right");
    this._moveHandler = new BiMoveHandle(this);
    this._moveHandler.setMoveDirection("horizontal");
    this.addEventListener("mousedown", this.startMove, this);
    this._moveHandler.addEventListener("movestart", this._forwardEvent, this);
    this._moveHandler.addEventListener("beforemove", this._forwardEvent, this);
    this._moveHandler.addEventListener("move", this._forwardEvent, this);
    this._moveHandler.addEventListener("moveend", this._forwardEvent, this);
}
_p = _biExtend(BiTreeViewDragHeader, BiLabel, "BiTreeViewDragHeader");
_p._column = -1;
_p.syncToHeaderCell = function (oTreeView, nCol) {
    this._column = nCol;
    var dm = oTreeView.getDataModel();
    var vm = oTreeView.getViewManager();
    var firstCol = vm.getFirstVisibleColumn();
    var b = vm.getHeaderBounds(firstCol);
    var b2 = vm.getHeaderBounds(nCol);
    var rowHeadersWidth = vm.getShowRowHeaders() ? vm.getRowHeadersWidth() : 0;
    var tm = application.getThemeManager();
    tm.setStateValue(this, "active", dm.getCanSortColumn(nCol));
    tm.applyAppearance(this);
    this.setHtml(dm.getHeaderCellText(nCol));
    if (dm.getSortColumn() == nCol) this.setIcon(new BiImage(dm.getSortAscending() ? vm.getAscendingIcon() : vm.getDescendingIcon()));
    else this.setIcon(null); if (oTreeView.getRightToLeft()) this.setLocation(oTreeView._gridBodyElement.offsetWidth - (b2.left - b.left + rowHeadersWidth) - b2.width, b2.top);
    else this.setLocation(b2.left - b.left + rowHeadersWidth, b2.top);
    this.setSize(b2.width, b2.height);
};
_p.startMove = function (e) {
    this._moveHandler.startMove(e);
};
_p._forwardEvent = function (e) {
    var e2 = new BiEvent(e.getType());
    if (!this.dispatchEvent(e2)) e.preventDefault();
    e2.dispose();
};
BiTreeViewDragHeader.addProperty("column", BiAccessType.READ);

function BiTreeViewDragHeaderMarker() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setSize(2, BiTreeViewBase._getDefaultRowHeight());
    this.setBackColor("Highlight");
}
_p = _biExtend(BiTreeViewDragHeaderMarker, BiComponent, "BiTreeViewDragHeaderMarker");
_p._column = -1;
_p.syncToHeaderCell = function (oTreeView, nCol) {
    this._column = nCol;
    var vm = oTreeView.getViewManager();
    var firstCol = vm.getFirstVisibleColumn();
    var b = vm.getHeaderBounds(firstCol);
    var colCount = vm.getColumnCount();
    var vx = vm.getViewColumn(nCol);
    var rowHeadersWidth = vm.getShowRowHeaders() ? vm.getRowHeadersWidth() : 0;
    var b2;
    var rtl = oTreeView.getRightToLeft();
    if (vx >= colCount || nCol == null) {
        b2 = vm.getHeaderBounds(vm.getModelColumn(colCount - 1));
        if (rtl) this.setLocation(oTreeView._gridBodyElement.offsetWidth - (b2.left - b.left + rowHeadersWidth + b2.width) - 1, b2.top);
        else this.setLocation(b2.left - b.left + rowHeadersWidth - 1 + b2.width, b2.top);
    } else {
        b2 = vm.getHeaderBounds(nCol);
        if (rtl) this.setLocation(oTreeView._gridBodyElement.offsetWidth - (b2.left - b.left + rowHeadersWidth) - 1, b2.top);
        else this.setLocation(b2.left - b.left + rowHeadersWidth - 1, b2.top);
    }
    this.setHeight(b2.height);
};
BiTreeViewDragHeaderMarker.addProperty("column", BiAccessType.READ);

function BiTreeView() {
    if (_biInPrototype) return;
    BiTreeViewBase.call(this);
    this.setCssClassName("bi-tree-view");
    this.setAppearance("tree-view");
    this._selectionModel = new BiTreeViewSelectionModel(this);
    this._stateManager = new BiTreeViewStateManager;
    this._viewManager = new BiTreeViewViewManager(this);
    this._invalidRows = {
        length: 0
    };
    if (!this._useNativeScrollBars) {
        this._vScrollBar.setUnitIncrement(this._viewManager.getRowHeight());
    }
    this._stateManager.addEventListener("hoverchanged", this._onHoverChanged, this);
}
_p = _biExtend(BiTreeView, BiTreeViewBase, "BiTreeView");
BiTreeView.addProperty("showBrokenCellTextAsToolTip", BiAccessType.READ_WRITE);
_p._showBrokenCellTextAsToolTip = false;
_p.setViewManager = function (vm) {
    this._viewManager = vm;
    vm.setTreeView(this);
    if (!this._useNativeScrollBars) {
        this._vScrollBar.setUnitIncrement(vm.getRowHeight());
    }
};
_p.setDataModel = function (dm) {
    var oldColumnCount = 0;
    var newColumnCount = 0;
    var oldRowCount = 0;
    var newRowCount = 0;
    if (this._dataModel != dm) {
        if (this._dataModel) {
            oldColumnCount = this._dataModel.getColumnCount();
            oldRowCount = this._dataModel.getRowCount();
            this._dataModel.removeEventListener("datachanged", this._onDataChanged, this);
            this._dataModel.removeEventListener("beforedatastructurechanged", this._onBeforeDataStructureChanged, this);
            this._dataModel.removeEventListener("datastructurechanged", this._onDataStructureChanged, this);
            this._dataModel.removeEventListener("rowcountchanged", this._onRowCountChanged, this);
            this._dataModel.removeEventListener("beforeexpand", this._onBeforeExpand, this);
            this._dataModel.removeEventListener("expand", this._onExpand, this);
            this._dataModel.removeEventListener("beforecollapse", this._onBeforeCollapse, this);
            this._dataModel.removeEventListener("collapse", this._onCollapse, this);
            for (var ac in this._attachedComponents) {
                this._removeAttachedComponent(ac);
            }
        }
        this._selectionModel.setLeadItem(null);
        this._selectionModel.setAnchorItem(null);
        this._selectionModel.deselectAll();
        this._dataModel = dm;
        if (dm != null) {
            newColumnCount = dm.getColumnCount();
            newRowCount = dm.getRowCount();
            dm.addEventListener("datachanged", this._onDataChanged, this);
            dm.addEventListener("beforedatastructurechanged", this._onBeforeDataStructureChanged, this);
            dm.addEventListener("datastructurechanged", this._onDataStructureChanged, this);
            dm.addEventListener("rowcountchanged", this._onRowCountChanged, this);
            dm.addEventListener("beforeexpand", this._onBeforeExpand, this);
            dm.addEventListener("expand", this._onExpand, this);
            dm.addEventListener("beforecollapse", this._onBeforeCollapse, this);
            dm.addEventListener("collapse", this._onCollapse, this);
        }
        this._resetUpdateCache();
        if (oldColumnCount != newColumnCount) this._viewManager.resetCache();
        if (oldRowCount != newRowCount || oldColumnCount != newColumnCount) {
            this._forceMeasure = true;
            this.updateContentSize();
            this.updateSize();
        }
        this._updateGrid(true, true, true);
    }
};
_p._onBiTreeViewBaseScroll = function () {
    if (!this._preventScrollUpdates) {
        this._resetUpdateCache();
        this._viewManager.setScrollLeft(this._getInternalScrollLeft());
        this._viewManager.setScrollTop(this._getInternalScrollTop());
        if (BiBrowserCheck.moz) {
            if (this._element) this._element.scrollTop = 0;
            if (this._gridBodyContentElement) this._gridBodyContentElement.scrollTop = 0;
        }
        this._updateGrid();
        this.dispatchEvent("scroll");
    }
};
_p.updateContentSize = function () {
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (!this.getCreated()) return;
    if (this._useNativeScrollBars) {
        var rc = dm ? dm.getRowCount() : 0;
        var sh = rc * vm.getRowHeight();
        var cw = this._gridBodyElement.clientWidth;
        var ch = this._gridBodyElement.clientHeight;
        this._gridBodyFillerElement.style.width = vm.getShownColumnsWidth() + "px";
        this._gridBodyFillerElement.style.height = sh + "px";
        vm.setScrollLeft(this._getInternalScrollLeft());
        vm.setScrollTop(this._getInternalScrollTop());
        this._measure();
        var newCw = this._gridBodyElement.clientWidth;
        var newCh = this._gridBodyElement.clientHeight;
        if (cw != newCw || ch != newCh) {
            this._clientSizeChanged = true;
        }
    } else {
        this._syncScrollBars();
        this._doCustomOverflow();
    }
    this._contentSizeDirty = false;
};
_p.updateSize = function () {
    if (!this.getCreated()) return;
    this._measure();
    var vm = this.getViewManager();
    var rtl = this.getRightToLeft();
    var fixedLeftWidth = vm.getShowRowHeaders() ? vm.getRowHeadersWidth() : 0;
    var fixedTopHeight = vm.getShowHeaders() ? vm.getHeadersHeight() : 0;
    var availWidth = this._gridBodyElement.clientWidth;
    var availHeight = this._gridBodyElement.clientHeight;
    var clientWidth = this._element.clientWidth;
    var scrollBarWidth = clientWidth - availWidth;
    if (this._useNativeScrollBars) {
        this._gridBodyFillerElement.style.marginTop = fixedTopHeight + "px";
        this._gridBodyFillerElement.style.marginLeft = rtl ? 0 : fixedLeftWidth + "px";
        this._gridBodyFillerElement.style.marginRight = rtl ? fixedLeftWidth + "px" : 0;
    } else {
        this._syncScrollBars();
    }
    this._gridBodyContentElement.style.height = Math.max(0, availHeight - fixedTopHeight) + "px";
    this._gridBodyContentElement.style.top = fixedTopHeight + "px";
    this._gridFixedLeftElement.style.height = Math.max(0, availHeight - fixedTopHeight) + "px";
    this._gridFixedLeftElement.style.top = fixedTopHeight + "px";
    this._gridBodyContentElement.style.width = Math.max(0, availWidth - fixedLeftWidth) + "px";
    this._gridBodyContentElement.style.left = rtl ? scrollBarWidth : fixedLeftWidth + "px";
    this._gridFixedTopElement.style.width = Math.max(0, availWidth - fixedLeftWidth) + "px";
    this._gridFixedTopElement.style.left = rtl ? scrollBarWidth : fixedLeftWidth + "px";
    if (vm.getShowRowHeaders()) {
        this._gridFixedLeftElement.style.display = "block";
        this._gridFixedCornerElement.style.display = "block";
        this._gridFixedLeftElement.style.width = Math.min(availWidth, fixedLeftWidth) + "px";
        this._gridFixedCornerElement.style.width = Math.min(availWidth, fixedLeftWidth) + "px";
        this._gridFixedLeftElement.style.left = this._gridFixedCornerElement.style.left = rtl ? clientWidth - fixedLeftWidth + "px" : 0;
    } else {
        this._gridFixedLeftElement.style.display = "none";
        this._gridFixedCornerElement.style.display = "none";
    } if (vm.getShowHeaders()) {
        this._gridFixedTopElement.style.display = "block";
        this._gridFixedTopElement.style.height = Math.min(availHeight, fixedTopHeight) + "px";
        if (vm.getShowRowHeaders()) {
            this._gridFixedCornerElement.style.display = "block";
            this._gridFixedCornerElement.style.height = Math.min(availHeight, fixedTopHeight) + "px";
        }
    } else {
        this._gridFixedTopElement.style.display = "none";
        this._gridFixedCornerElement.style.display = "none";
    }
    vm.setScrollLeft(this._getInternalScrollLeft());
    vm.setScrollTop(this._getInternalScrollTop());
};
_p.layoutAllChildren = function () {
    BiComponent.prototype.layoutAllChildren.call(this);
    if (this.getCreated()) {
        if (!this._useNativeScrollBars) {
            this._doCustomOverflow();
        }
        this._clientSizeChanged = true;
        this._forceMeasure = true;
        this.updateContentSize();
        this.updateSize();
        this._updateGrid(true, true, true);
        this._clientSizeChanged = false;
    }
};
_p._doCustomOverflow = function () {
    if (!this.getCreated()) {
        return;
    }
    var vm = this.getViewManager();
    var dm = this.getDataModel();
    var contentWidth = vm.getShownColumnsWidth();
    var clientWidth = this._element.clientWidth;
    var availWidth = clientWidth;
    var contentHeight = dm ? dm.getRowCount() * vm.getRowHeight() : 0;
    var clientHeight = this._element.clientHeight;
    var availHeight = clientHeight;
    var vpw = this._vScrollBar.getPreferredWidth();
    var hph = this._hScrollBar.getPreferredHeight();
    var rtl = this.getRightToLeft();
    if (vm.getShowRowHeaders()) {
        contentWidth += vm.getRowHeadersWidth();
    }
    if (vm.getShowHeaders()) {
        contentHeight += vm.getHeadersHeight();
    }
    var ox = this.getOverflowX();
    var oy = this.getOverflowY();
    var hVis, vVis;
    var oldVisV = this._vScrollBar.getVisible();
    var oldVisH = this._hScrollBar.getVisible();
    this._beginScrollBatch();
    if (ox == "hidden") {
        hVis = false;
    } else if (ox == "scroll") {
        hVis = true;
    } else {
        if (oldVisV) {
            hVis = contentWidth > availWidth - vpw;
        } else {
            hVis = contentWidth > availWidth;
        }
    } if (hVis) {
        availHeight -= hph;
    }
    if (oy == "hidden") {
        vVis = false;
    } else if (oy == "scroll") {
        vVis = true;
    } else {
        vVis = contentHeight > availHeight;
    } if (vVis) {
        availWidth -= vpw;
    }
    this._gridBodyElement.style.width = Math.max(0, availWidth) + "px";
    this._gridBodyElement.style.height = Math.max(0, availHeight) + "px";
    this._syncScrollBars();
    this._vScrollBar.setExtent(availHeight);
    this._hScrollBar.setExtent(availWidth);
    var rh = vm.getRowHeight();
    this._vScrollBar.setBlockIncrement(Math.floor(availHeight / rh) * rh);
    this._vScrollBar.setVisible(vVis);
    this._hScrollBar.setVisible(hVis);
    this._vScrollBar.setTop(0);
    this._vScrollBar.setLeft(rtl ? 0 : clientWidth - vpw);
    this._vScrollBar.setHeight(clientHeight - (hVis ? hph : 0));
    this._hScrollBar.setLeft(vVis && rtl ? vpw : 0);
    this._hScrollBar.setTop(clientHeight - hph);
    this._hScrollBar.setWidth(clientWidth - (vVis ? vpw : 0));
    if (vVis != oldVisV || hVis != oldVisH) {
        this._doCustomOverflow();
        this.updateSize();
    }
    this._endScrollBatch();
};
_p.getHtmlCode = function (nScrollLeft, nScrollTop, nWidth, nHeight) {
    var dm = this.getDataModel();
    if (!dm) return "";
    var vm = this.getViewManager();
    this._createUpdateCache();
    var uc = this._updateCache;
    var startRow = uc.startRow;
    var startCol = uc.startCol;
    var rowCount = uc.rowCount;
    var colCount = uc.colCount;
    var rowHeight = uc.rowHeight;
    var sb = [];
    var y = startRow;
    var yPos = 0;
    var mx, w;
    var vx = uc.vx;
    if (vx < colCount) {
        var colCacheVx = {};
        var colCacheWidth = {};
        var nextColCache = {};
        var cellPaddingX = vm.getCellPaddingX();
        if (y < rowCount) {
            mx = startCol;
            var xPos = 0;
            while (mx != null && xPos < nWidth) {
                w = vm.getColumnWidth(mx);
                colCacheWidth[mx] = w;
                xPos += w;
                colCacheVx[mx] = vm.getViewColumn(mx);
                mx = nextColCache[mx] = vm.getNextColumn(mx);
            }
        }
        while (y < rowCount && yPos < nHeight) {
            this._buildRowHtml(sb, y, colCacheVx, colCacheWidth, nextColCache);
            yPos += rowHeight;
            y++;
        }
        if (yPos < nHeight) {
            mx = startCol;
            xPos = 0;
            sb.push("<tr style=\"height:", (nHeight - yPos), "px;\" class=\"vertical-filler\">");
            while (mx != null && xPos < nWidth) {
                w = colCacheWidth[mx];
                sb.push("<td style=\"width:", (w - cellPaddingX), "px;\"", ">&nbsp;</td>");
                xPos += w;
                mx = nextColCache[mx];
            }
            sb.push("</tr>");
        }
    }
    sb.push("</tbody></table>");
    sb.unshift("<table cellspacing=\"0\" class=\"bi-tree-view-table\" style=\"width:", nWidth + "px\"><tbody class=\"", (vm.getShowGridLines() ? "bi-show-grid-lines" : ""), (this.getContainsFocus() ? " focused" : ""), "\">");
    return sb.join("");
};
_p._getRowHtml = function (sb, y) {
    this._createUpdateCache();
    var uc = this._updateCache;
    var startCol = uc.startCol;
    var nWidth = uc.clientWidth;
    var rowCount = uc.rowCount;
    var mx = startCol;
    var colCacheVx = {};
    var colCacheWidth = {};
    var nextColCache = {};
    if (y < rowCount) {
        mx = startCol;
        var xPos = 0;
        var vm = this.getViewManager();
        while (mx != null && xPos < nWidth) {
            var w = vm.getColumnWidth(mx);
            colCacheWidth[mx] = w;
            xPos += w;
            colCacheVx[mx] = vm.getViewColumn(mx);
            mx = nextColCache[mx] = vm.getNextColumn(mx);
        }
    }
    return this._buildRowHtml(sb, y, colCacheVx, colCacheWidth, nextColCache);
};
_p._buildRowHtml = function (sb, y, colCacheVx, colCacheWidth, nextColCache) {
    var sm = this._selectionModel;
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    this._createUpdateCache();
    var uc = this._updateCache;
    var colCount = uc.colCount;
    var ieExtraPadding = uc.ieExtraPadding;
    var indentProperty = uc.indentProperty;
    var ieNoBr = uc.ieNoBr;
    var ieNoBrClose = uc.ieNoBrClose;
    var nWidth = uc.clientWidth;
    var mx = uc.startCol;
    var xPos = 0;
    var cellPaddingX = vm.getCellPaddingX();
    var sortCol = dm.getSortColumn();
    var highlightSortCol = vm.getHighlightSortColumn();
    sb.push('<tr class="', sm.getRowSelected(y) ? " selected" : "", sm.getRowIsLead(y) ? " lead" : "", '" style="height:', uc.rowHeight, "px;", dm.getRowStyle(y), '">');
    while (mx != null && xPos < nWidth) {
        var vx = colCacheVx[mx];
        if (vx == null || vx >= colCount) break;
        var w = colCacheWidth[mx];
        var indentWidth = vm.getIndentColumn() == mx ? dm.getDepth(y) * 19 + ieExtraPadding : 0;
        sb.push("<td style=\"width:", (w - cellPaddingX), "px;", (indentWidth ? indentProperty + indentWidth + "px;" : ""), dm.getCellStyle(mx, y), BiBrowserCheck.quirks.gridNeedsLineHeight || dm.getHasIcon(mx, y) || this.getExpandIconHtml(mx, y) ? uc.lineHeightStyle : '', "\" class=\"", (sm.getCellSelected(mx, y) ? "selected" : ""), (sortCol == mx && highlightSortCol ? " sort-column" : ""), (sm.getCellIsLead(mx, y) ? " lead" : ""), "\">", ieNoBr, this.getExpandIconHtml(mx, y), (dm.getHasIcon(mx, y) ? "<img alt=\"\" src=\"" + dm.getIcon(mx, y) + "\" style=\"" + dm.getIconStyle(mx, y) + "\" class=\"icon\">" : ""), dm.getCellText(mx, y), ieNoBrClose, "</td>");
        if (this._getHasAttachedComponent(mx, y)) {
            var ac = this._getAttachedComponent(mx, y);
            this._attachedComponents[ac.toHashCode()] = {
                col: mx,
                row: y,
                width: w,
                height: uc.rowHeight,
                component: ac
            };
        }
        xPos += w;
        mx = nextColCache[mx];
    }
    if (xPos < nWidth) sb.push("<td class=\"horizontal-filler\" style=\"width:", (nWidth - xPos), "px;\">&nbsp;</td>");
    sb.push("</tr>");
    return xPos;
};
_p.getHeaderHtmlCode = function (nScrollLeft, nWidth) {
    var vm = this.getViewManager();
    if (!vm.getShowHeaders()) return "";
    this._createUpdateCache();
    var uc = this._updateCache;
    var dm = this.getDataModel();
    var sm = this._stateManager;
    var startCol = uc.startCol;
    var colCount = uc.colCount;
    var sb = ["<table cellspacing=\"0\" class=\"bi-tree-view-headers-table\" style=\"width:", nWidth, "px;height:", vm.getHeadersHeight(), "px\"><tbody>", "<tr>"];
    var mx, xPos, w, vx;
    mx = startCol;
    xPos = 0;
    var ieNoBr = uc.ieNoBr;
    var ieNoBrClose = uc.ieNoBrClose;
    while (dm != null && mx != null && xPos < nWidth) {
        vx = vm.getViewColumn(mx);
        if (vx == null || vx >= colCount) break;
        w = vm.getColumnWidth(mx);
        sb.push("<td style=\"width:", (w - vm.getHeaderCellPaddingX()), "px;", dm.getHeaderCellStyle(mx), "\"", " class=\"grid-header", (sm.getHeaderActive(mx) && dm.getCanSortColumn(mx) ? " grid-header-active" : ""), "\">", ieNoBr, dm.getHeaderCellText(mx), (dm.getSortColumn() == mx ? "<img alt=\"\" src=\"" + (dm.getSortAscending() ? vm.getAscendingIcon() : vm.getDescendingIcon()) + "\" class=\"bi-tree-view-sort-arrow\">" : ""), ieNoBrClose, "</td>");
        xPos += w;
        mx = vm.getNextColumn(mx);
    }
    if (xPos < nWidth) {
        sb.push("<td class=\"filler grid-header\" style=\"width:", (nWidth - xPos), "px\">&nbsp;</td>");
    }
    sb.push("</tr></tbody></table>");
    return sb.join(BiString.EMPTY);
};
_p.getRowHeaderHtmlCode = function (nScrollTop, nHeight) {
    this._createUpdateCache();
    var uc = this._updateCache;
    var vm = this.getViewManager();
    var startRow = uc.startRow;
    var rowCount = uc.rowCount;
    var rowHeight = uc.rowHeight;
    var sb = ["<table cellspacing=\"0\" class=\"bi-tree-view-row-headers-table\" style=\"width:", vm.getRowHeadersWidth(), "px\"><tbody>"];
    var y = startRow;
    var yPos = 0;
    while (y < rowCount && yPos < nHeight) {
        this._getRowHeaderCellHtml(sb, y);
        yPos += rowHeight;
        y++;
    }
    if (yPos < nHeight) {
        sb.push("<tr class=\"filler\" style=\"height:", (nHeight - yPos), "px\"><td class=\"grid-header\">&nbsp;</td></tr>");
    }
    sb.push("</tbody></table>");
    return sb.join(BiString.EMPTY);
};
_p._getRowHeaderCellHtml = function (sb, y) {
    this._createUpdateCache();
    var uc = this._updateCache;
    var dm = this.getDataModel();
    sb.push("<tr", " style=\"", dm.getRowHeaderCellStyle(y), ";height:", uc.rowHeight, "px;\">");
    sb.push("<td class=\"grid-header", (dm.getRowSelected(y) ? " grid-header-selected" : ""), "\">", uc.ieNoBr, dm.getRowHeaderCellText(y), uc.ieNoBrClose, "</td>");
    sb.push("</tr>");
};
_p.getExpandIconHtml = function (x, y) {
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (vm.getIndentColumn() != x || !vm.getShowExpandIcon(y)) return "";
    var srcId;
    if (!dm.getHasChildren(y)) srcId = "blank-icon";
    else {
        if (dm.getExpanded(y)) srcId = "minus-icon";
        else srcId = "plus-icon";
    }
    var src = application.getTheme().getAppearanceProperty("tree-view", srcId);
    return "<img alt=\"\" src=\"" + src + "\" class=\"bi-tree-view-expand-icon\">";
};
_p._updateGrid = function (bForceContainer, bForceHeader, bForceRowHeader) {
    if (!this.getCreated()) return;
    var vm = this.getViewManager();
    var container = this._gridBodyContentElement;
    var headers = this._gridFixedTopElement;
    var rowHeaders = this._gridFixedLeftElement;
    this._createUpdateCache();
    var uc = this._updateCache;
    var scrollLeft = uc.scrollLeft;
    var scrollTop = uc.scrollTop;
    var clientWidth = uc.clientWidth;
    var clientHeight = uc.clientHeight;
    var startRow = uc.startRow;
    var startCol = uc.startCol;
    if (startCol != this._lastStartCol || startRow != this._lastStartRow || bForceContainer) {
        container.innerHTML = this.getHtmlCode(scrollLeft, scrollTop, clientWidth, clientHeight);
    }
    if (vm.getShowHeaders() && (startCol != this._lastStartCol || bForceHeader)) headers.innerHTML = this.getHeaderHtmlCode(scrollLeft, clientWidth);
    if (vm.getShowRowHeaders() && (startRow != this._lastStartRow || bForceRowHeader)) rowHeaders.innerHTML = this.getRowHeaderHtmlCode(scrollTop, clientHeight);
    this._updateAttachedComponents();
    this._lastStartCol = startCol;
    this._lastStartRow = startRow;
    this._invalidRows = {
        length: 0
    };
    this._resetUpdateCache();
};
_p.getScrollTopExact = function () {
    if (this._useNativeScrollBars) {
        return this._gridBodyElement.scrollTop;
    } else {
        return this._vScrollBar.getValue();
    }
};
_p.getScrollTop = function () {
    var vm = this.getViewManager();
    if (this.getCreated() && vm) {
        return vm.getFirstVisibleRow() * vm.getRowHeight();
    }
    return 0;
};
_p.getScrollLeftExact = function () {
    if (this._useNativeScrollBars) {
        return this._gridBodyElement.scrollLeft;
    } else {
        return this._hScrollBar.getValue();
    }
};
_p.getScrollLeft = function () {
    var vm = this.getViewManager();
    if (this.getCreated() && vm) {
        var startCol = vm.getFirstVisibleColumn();
        return vm.getColumnLeft(startCol);
    }
    return 0;
};
_p.getScrollWidth = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    if (this._useNativeScrollBars) {
        return this._gridBodyElement.scrollWidth;
    } else {
        var vm = this.getViewManager();
        var cw = this._gridBodyContentElement.offsetWidth;
        return Math.max(vm.getShownColumnsWidth(), cw) + (vm.getShowRowHeaders() ? vm.getRowHeadersWidth() : 0);
    }
};
_p.getScrollHeight = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    if (this._useNativeScrollBars) {
        return this._gridBodyElement.scrollHeight;
    } else {
        var vm = this.getViewManager();
        var dm = this.getDataModel();
        var ch = 0;
        var rc = dm ? dm.getRowCount() : 0;
        var sh = rc * vm.getRowHeight();
        return Math.max(sh, ch) + (vm.getShowHeaders() ? vm.getHeadersHeight() : 0);
    }
};
_p._create = function (oDoc) {
    BiComponent.prototype._create.call(this, oDoc);
    this._gridBodyElement = this._document.createElement("DIV");
    this._gridBodyElement.className = "bi-tree-view-body";
    this._gridBodyElement.onscroll = BiTreeViewBase.__onBiTreeViewBaseScroll;
    this._element.appendChild(this._gridBodyElement);
    if (this._useNativeScrollBars) {
        this._addNativeScrollBars();
    }
    this._gridBodyContentElement = this._document.createElement("DIV");
    this._gridBodyContentElement.className = "bi-tree-view-body-content";
    this._element.appendChild(this._gridBodyContentElement);
    this._gridFixedTopElement = this._document.createElement("DIV");
    this._gridFixedTopElement.className = "bi-tree-view-headers";
    this._element.appendChild(this._gridFixedTopElement);
    this._gridFixedLeftElement = this._document.createElement("DIV");
    this._gridFixedLeftElement.className = "bi-tree-view-row-headers";
    this._element.appendChild(this._gridFixedLeftElement);
    this._gridFixedCornerElement = this._document.createElement("DIV");
    this._gridFixedCornerElement.className = "bi-tree-view-header-corner grid-header";
    this._element.appendChild(this._gridFixedCornerElement);
    this._updateOverflow();
    this._updateCanSelect();
};
_p._addNativeScrollBars = function () {
    BiTreeViewBase.prototype._addNativeScrollBars.call(this);
    this._gridBodyFillerElement.className = "bi-tree-view-body-filler";
};
_p._updateRowSelected = function (y) {
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (this._contentSizeDirty || !this.getCreated() || !dm) return;
    this._createUpdateCache();
    var uc = this._updateCache;
    var container = this._gridBodyContentElement;
    var rowHeaders = this._gridFixedLeftElement;
    var startRow = uc.startRow;
    if (startRow > y) {
        this._resetUpdateCache();
        return;
    }
    var shownRows = uc.shownRows;
    if (startRow + shownRows < y) {
        this._resetUpdateCache();
        return;
    }
    var bSelected = dm.getRowSelected(y);
    var bLead = dm.getRowIsLead(y);
    var tr = container.firstChild.tBodies[0].rows[y - startRow];
    var style;
    if (tr) {
        tr.className = (bSelected ? "selected" : "") + (bLead ? " lead" : "");
        style = dm.getRowStyle(y);
        if (style != "") {
            tr.style.cssText = style;
            tr.style.height = vm.getRowHeight() + "px";
        }
        if (BiBrowserCheck.ie) {
            var imgs = tr.getElementsByTagName("IMG");
            var l = imgs.length;
            for (var i = 0; i < l; i++) {
                if (imgs[i].className == "icon") imgs[i].style.position = "relative";
            }
        }
    }
    if (vm.getShowRowHeaders()) {
        tr = rowHeaders.firstChild.tBodies[0].rows[y - startRow];
        if (tr) {
            var td = tr.cells[0];
            if (td) td.className = "grid-header" + (bSelected ? " grid-header-selected" : "");
            style = dm.getRowHeaderCellStyle(y);
            if (style != "") tr.style.cssText = style + ";height:" + vm.getRowHeight() + "px";
        }
    }
    this._resetUpdateCache();
};
_p.updateCell = function (x, y) {
    this._updateCellSelected(x, y, true);
};
_p._updateCellSelected = function (x, y, bHtml) {
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (this._contentSizeDirty || !this.getCreated() || !dm) return;
    vm.resetCache();
    this._resetUpdateCache();
    this._createUpdateCache();
    var uc = this._updateCache;
    var container = this._gridBodyContentElement;
    var startRow = uc.startRow;
    var vc = vm.getViewColumn(x);
    var vStartCol = uc.vx;
    if (startRow > y || vStartCol > vc) return;
    var shownRows = uc.shownRows;
    if (startRow + shownRows < y) return;
    var tr = container.firstChild.tBodies[0].rows[y - startRow];
    var td, style;
    if (tr) {
        td = tr.cells[vc - vStartCol];
        if (td) {
            var bSelected = dm.getCellSelected(x, y);
            var bLead = dm.getCellIsLead(x, y);
            td.className = (bSelected ? "selected" : "") + (vm.getHighlightSortColumn() && dm.getSortColumn() == x ? " sort-column" : "") + (bLead ? " lead" : "");
            if (bHtml) {
                td.innerHTML = uc.ieNoBr + this.getExpandIconHtml(x, y) + (dm.getHasIcon(x, y) ? "<img alt=\"\" src=\"" + dm.getIcon(x, y) + "\" style=\"" + dm.getIconStyle(x, y) + "\" class=\"icon\">" : "") + dm.getCellText(x, y) + uc.ieNoBrClose;
            }
            style = dm.getCellStyle(x, y);
            if (style != "") {
                var width = td.style.width;
                var textIndent = td.style.textIndent;
                var paddingLeft = td.style.paddingLeft;
                var paddingRight = td.style.paddingRight;
                td.style.cssText = style;
                td.style.width = width;
                td.style.textIndent = textIndent;
                td.style.paddingLeft = paddingLeft;
                td.style.paddingRight = paddingRight;
            }
            this._updateAttachedComponent(x, y);
        }
    }
    this._resetUpdateCache();
};
_p.updateRow = function (y) {
    this._createUpdateCache();
    var uc = this._updateCache;
    if (uc.startRow > y) return;
    var container = this._gridBodyContentElement;
    var shownRows = uc.shownRows;
    if (uc.startRow + shownRows < y) {
        this._resetUpdateCache();
        return;
    }
    var tr = container.firstChild.tBodies[0].rows[y - uc.startRow];
    if (tr) {
        var sb = [];
        this._getRowHtml(sb, y);
        var tmp = this._document.createElement("DIV");
        tmp.innerHTML = "<table><tbody>" + sb.join("") + "</tbody></table>";
        tr.parentNode.replaceChild(tmp.firstChild.tBodies[0].rows[0], tr);
    }
    this._resetUpdateCache();
};
_p.updateRowHeaderCell = function (y) {
    var vm = this.getViewManager();
    if (!vm.getShowRowHeaders()) return;
    this._createUpdateCache();
    var uc = this._updateCache;
    if (uc.startRow > y) return;
    var rowHeaders = this._gridFixedLeftElement;
    var shownRows = uc.shownRows;
    if (uc.startRow + shownRows < y) {
        this._resetUpdateCache();
        return;
    }
    var tr = rowHeaders.firstChild.tBodies[0].rows[y - uc.startRow];
    if (tr) {
        var sb = [];
        this._getRowHeaderCellHtml(sb, y);
        var tmp = this._document.createElement("DIV");
        tmp.innerHTML = "<table><tbody>" + sb.join("") + "</tbody></table>";
        tr.parentNode.replaceChild(tmp.firstChild.tBodies[0].rows[0], tr);
    }
    this._resetUpdateCache();
};
_p._createUpdateCache = function () {
    if (this._updateCache) return;
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    var startCol = vm.getFirstVisibleColumn();
    var rowHeight = vm.getRowHeight();
    var lineHeight = rowHeight - 2 + BiBrowserCheck.quirks.tableLineHeightAdjust;
    var scrollLeft, scrollTop, clientWidth, clientHeight, scrollClientHeight, scrollClientWidth;
    if (this._useNativeScrollBars) {
        scrollLeft = this._gridBodyElement.scrollLeft;
        scrollTop = this._gridBodyElement.scrollTop;
    } else {
        scrollLeft = this._hScrollBar.getValue();
        scrollTop = this._vScrollBar.getValue();
    }
    clientHeight = this._gridBodyContentElement.offsetHeight;
    clientWidth = this._gridBodyContentElement.offsetWidth;
    scrollClientHeight = this._gridBodyElement.clientHeight;
    scrollClientWidth = this._gridBodyElement.clientWidth;
    this._updateCache = {
        startRow: vm.getFirstVisibleRow(),
        startCol: startCol,
        rowCount: dm ? dm.getRowCount() : 0,
        colCount: vm.getColumnCount(),
        rowHeight: rowHeight,
        lineHeightStyle: 'line-height: ' + lineHeight + 'px;',
        ieNoBr: (BiBrowserCheck.ie ? "<nobr>" : ""),
        ieNoBrClose: (BiBrowserCheck.ie ? "</nobr>" : ""),
        indentProperty: BiBrowserCheck.ie ? (this.getRightToLeft() ? "padding-right:" : "padding-left:") : "text-indent:",
        ieExtraPadding: BiBrowserCheck.ie ? 3 : 0,
        vx: vm.getViewColumn(startCol),
        scrollLeft: scrollLeft,
        scrollTop: scrollTop,
        clientHeight: clientHeight,
        clientWidth: clientWidth,
        scrollClientHeight: scrollClientHeight,
        scrollClientWidth: scrollClientWidth,
        shownRows: Math.ceil(clientHeight / rowHeight)
    };
};
_p._resetUpdateCache = function () {
    this._updateCache = null;
};
_p._onMouseWheel = function (e) {
    var vm = this.getViewManager();
    var st1 = this._getInternalScrollTop();
    this._setInternalScrollTop(st1 - vm.getRowHeight() * e.getWheelDelta());
    var st2 = this._getInternalScrollTop();
    if (BiBrowserCheck.moz && st1 != st2 && this._useNativeScrollBars) {
        this._onBiTreeViewBaseScroll();
        e.preventDefault();
    }
};
_p._onMouseEvent = function (e) {
    var dm = this.getDataModel();
    if (dm == null) return;
    if (!this._useNativeScrollBars) {
        var target = e.getTarget();
        if (this._hScrollBar.contains(target) || this._vScrollBar.contains(target)) {
            return;
        }
    }
    var info = this.getCellInfoFromMouseEvent(e);
    var mouseX = e.getOffsetX();
    var mouseY = e.getOffsetY();
    var vm = this.getViewManager();
    var sm = this._stateManager;
    var gridBody = this._gridBodyElement;
    var x = info.getColumn();
    var y = info.getRow();
    var rowSelMode = this._selectionModel._selectionMode == BiSelectionModel.SELECTION_MODE_ROW;
    var rtl = this.getRightToLeft();
    if (!rtl && mouseX > this.getClientWidth() || rtl && mouseX < gridBody.offsetWidth - gridBody.clientWidth) {
        sm.updateState(e.getType(), -1, -1);
        return;
    }
    sm.updateState(e.getType(), x, y);
    if (e.getType() == "mouseout" || e.getType() == "mouseover") return;
    if (y == -1) {
        this._handleHeaderMouseEvent(e);
        return;
    }
    var vx = vm.getViewColumn(x);
    if (y >= dm.getRowCount() || vx == null || (vx >= vm.getColumnCount() && !rowSelMode)) return;
    if (e.getType() == "contextmenu") this._onContextMenu(e, x, y);
    var clickedExpandIcon = false;
    if (x != -1 && x == vm.getIndentColumn() && e.getButton() == BiMouseEvent.LEFT) {
        var el = e._event.srcElement || e._event.target;
        if (el.className == "bi-tree-view-expand-icon" && dm.getHasChildren(y)) {
            clickedExpandIcon = true;
            if (e.getType() == "mousedown") this.__expand(x, y, !dm.getExpanded(y));
        }
    }
    if (!clickedExpandIcon) {
        if ((vx >= 0 && vx < vm.getColumnCount() || rowSelMode) && y >= 0 && y < dm.getRowCount() && (!rtl && mouseX < gridBody.clientWidth || rtl && mouseX > gridBody.offsetWidth - gridBody.clientWidth) && mouseY < gridBody.clientHeight) {
            var oItem = new BiTreeViewSelectionModelItem(rowSelMode ? null : x, y);
            switch (e.getType()) {
            case "mousedown":
                this._selectionModel.handleMouseDown(oItem, e);
                break;
            case "mouseup":
                this._selectionModel.handleMouseUp(oItem, e);
                break;
            case "click":
                this._selectionModel.handleClick(oItem, e);
                break;
            case "dblclick":
                if (dm.getHasChildren(y)) {
                    this.__expand(x, y, !dm.getExpanded(y));
                }
                this._selectionModel.handleDblClick(oItem, e);
                this._startEditing(info, e);
                break;
            }
        }
    }
    this._updateInvalidRows();
    this._handleContentSizeDirty();
};
_p.__expand = function (x, y, b) {
    var dm = this.getDataModel();
    this._contentSizeDirty = true;
    if (b) this._scrollSubtreeIntoViewRow = y;
    dm.setExpanded(y, b);
};
_p._onKeyDown = function (e) {
    var leadItem = this._selectionModel.getLeadItem();
    var sm = this._selectionModel;
    if (leadItem && e.matchesBundleShortcut("tree.edit")) {
        var item = sm.getLeadItem();
        sm.setSelectedItems([item]);
        sm.setLeadItem(item);
        sm.setAnchorItem(item);
        this._startEditing(item, e);
        return;
    }
    var ec = false;
    if (sm._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) {
        if (leadItem) {
            var y = leadItem.getRow();
            var x = leadItem.getColumn();
            var dm = this.getDataModel();
            if (e.matchesBundleShortcut("tree.expand")) {
                if (dm.getHasChildren(y)) {
                    if (dm.getExpanded(y)) {
                        sm.setLeadItem(new BiTreeViewSelectionModelItem(null, y + 1));
                    } else {
                        this.__expand(x, y, true);
                        ec = true;
                    }
                }
            } else if (e.matchesBundleShortcut("tree.collapse")) {
                if (dm.getHasChildren(y) && dm.getExpanded(y)) {
                    this.__expand(x, y, false);
                    ec = true;
                } else {
                    var py = dm.getParent(y);
                    if (py != null && py != -1) sm.setLeadItem(new BiTreeViewSelectionModelItem(null, py));
                }
            }
        }
    }
    sm.handleKeyDown(e);
    if (BiBrowserCheck.moz && e.getKeyCode() == BiKeyboardEvent.SPACE && sm._multipleSelection) {
        e.preventDefault();
    }
    this._updateInvalidRows();
    if (ec) this._handleContentSizeDirty();
};
_p.invalidateRow = function (y) {
    if (!(y in this._invalidRows)) {
        this._invalidRows.length++;
        this._invalidRows[y] = true;
    }
};
_p._updateInvalidRows = function () {
    if (!this._contentSizeDirty && this.getCreated() && this._invalidRows.length > 0) {
        if (this._invalidRows.length < 20) {
            for (var i in this._invalidRows) {
                if (i != "length") {
                    this.updateRow(i);
                    this.updateRowHeaderCell(i);
                }
            }
        } else this._updateGrid(true, false, true);
        this._invalidRows = {
            length: 0
        };
    }
};
_p._onContextMenu = function (e, x, y) {
    if (!this._useNativeScrollBars) {
        var target = e.getTarget();
        if (this._hScrollBar.contains(target) || this._vScrollBar.contains(target)) {
            return;
        }
    }
    var dm = this.getDataModel();
    this._dataModelContextMenu = null;
    if (typeof dm.getContextMenu == "function") this._dataModelContextMenu = dm.getContextMenu(x, y);
};
_p.getContextMenu = function () {
    if (this._dataModelContextMenu) return this._dataModelContextMenu;
    return BiComponent.prototype.getContextMenu.call(this);
};
_p._onMouseMove = function (e) {
    var vm = this.getViewManager();
    var x;
    if (!this._useNativeScrollBars) {
        var target = e.getTarget();
        if (this._hScrollBar.contains(target) || this._vScrollBar.contains(target)) {
            return;
        }
    }
    if (this._mouseDownX != null) {
        if (Math.abs(e.getScreenX() - this._mouseDownX) > 5) {
            x = e.getOffsetX() + this._mouseDownX - e.getScreenX();
            var ci = vm.getColumnAt(x);
            var vci = vm.getViewColumn(ci);
            if (vm.getCanMoveColumn(ci) && vci >= 0 && vci < vm.getColumnCount()) {
                if (!this._dragHeader) {
                    this._dragHeader = new BiTreeViewDragHeader;
                    this._dragHeader.addEventListener("move", this._onDragHeaderMove, this);
                    this._dragHeader.addEventListener("moveend", this._onDragHeaderMoveEnd, this);
                }
                this._dragHeader.syncToHeaderCell(this, ci);
                this.add(this._dragHeader);
                this._dragHeader.setLeft(this._dragHeader.getLeft() - this._mouseDownX + e.getScreenX());
                this._dragHeader.startMove(e);
                this._dragDeltaX = e.getScreenX() - this._dragHeader.getScreenLeft();
            }
            this._mouseDownX = null;
        }
    }
    var resInfo = this._getResizeInfo(e);
    if (BiBrowserCheck.ie) {
        if (resInfo.column == -1) this._gridFixedTopElement.style.cursor = "default";
        else this._gridFixedTopElement.style.cursor = BiBrowserCheck.versionNumber == 5.5 ? "hand" : "e-resize";
    } else {
        if (resInfo.column == -1) this._gridFixedTopElement.style.cursor = "default";
        else this._gridFixedTopElement.style.cursor = "ew-resize";
    }
    var mouseX = e.getOffsetX();
    var mouseY = e.getOffsetY();
    if (mouseX < this.getClientWidth() && mouseY < this.getClientHeight()) {
        x = vm.getColumnAt(mouseX);
        var y = vm.getRowAt(mouseY);
        this._stateManager.setHover(x, y);
    } else this._stateManager.setHover(-1, -1);
};
_p.getCellInfo = function (nOffsetX, nOffsetY) {
    var vm = this.getViewManager();
    var res = new BiTreeViewCellInfo;
    res._column = vm.getColumnAt(nOffsetX);
    res._row = vm.getRowAt(nOffsetY);
    return res;
};
_p._getResizeInfo = function (e) {
    var res = {
        dir: "",
        column: -1
    };
    var vm = this.getViewManager();
    var y = e.getOffsetY();
    if (!vm.getShowHeaders() || y < 0 || y >= vm.getHeadersHeight()) return res;
    var x = e.getOffsetX();
    var ci = vm.getColumnAt(x);
    var vci = vm.getViewColumn(ci);
    if (vci == null || vci == -1 || vci >= vm.getColumnCount()) return res;
    var rtl = this.getRightToLeft();
    if (rtl) x = this._gridBodyElement.offsetWidth - x;
    x += this.getScrollLeft();
    var bounds = vm.getColumnBounds(ci);
    if (x - bounds.left <= 8) {
        var pc = vm.getPreviousColumn(ci);
        if (pc == null || !vm.getCanResizeColumn(pc)) return res;
        res.column = pc;
    } else if (bounds.left + bounds.width - x <= 8) {
        if (!vm.getCanResizeColumn(ci)) return res;
        res.column = ci;
    }
    res.dir = rtl ? "w" : "e";
    return res;
};
_p._handleHeaderMouseEvent = function (e) {
    var vm, vx;
    switch (e.getType()) {
    case "mousedown":
        if (e.getButton() != BiMouseEvent.LEFT) return;
        vm = this.getViewManager();
        var resInfo = this._resizeInfo = this._getResizeInfo(e);
        vx = vm.getViewColumn(resInfo.column);
        if (resInfo.column != -1 && vx < vm.getColumnCount()) {
            this._stateManager.setActive(-1, -1);
            var scrollLeft = this.getScrollLeft();
            if (!this._resizeOutline) {
                this._resizeOutline = new BiTreeViewResizeOutline;
                this._resizeOutline.addEventListener("resize", this._onColumnResize, this);
                this._resizeOutline.addEventListener("resizeend", this._onColumnResizeEnd, this);
            }
            var bounds = vm.getColumnBounds(resInfo.column);
            if (this.getRightToLeft()) this._resizeOutline.setBounds(this._gridBodyElement.offsetWidth - bounds.left - bounds.width + scrollLeft, 0, bounds.width, this.getClientHeight());
            else this._resizeOutline.setBounds(bounds.left - scrollLeft, 0, bounds.width, this.getClientHeight());
            this._resizeOutline.setResizeDirection(resInfo.dir);
            this.add(this._resizeOutline);
            this._resizeOutline.startResize(resInfo.dir, e);
        } else {
            this._mouseDownX = e.getScreenX();
            if (BiBrowserCheck.ie) {
                BiTimer.callOnce(function () {
                    this._updateGrid(false, true, false);
                }, 1, this);
            } else this._updateGrid(false, true, false);
        }
        break;
    case "mouseup":
        if (e.getButton() != BiMouseEvent.LEFT || !this._resizeInfo || this._resizeInfo.column != -1) return;
        var mouseX = e.getOffsetX();
        var dm = this.getDataModel();
        vm = this.getViewManager();
        var x = vm.getColumnAt(mouseX);
        vx = vm.getViewColumn(x);
        if (x != null && x >= 0 && vx <= vm.getColumnCount() && dm.getCanSortColumn(x)) {
            dm.sort(x);
            this._selectionModel._syncAfterSort();
        } else this._updateGrid(false, true, false);
        this._mouseDownX = null;
    }
};
_p._getCellWidth = function (x, y) {
    this._createUpdateCache();
    var uc = this._updateCache;
    var ieNoBr = uc.ieNoBr;
    var ieNoBrClose = uc.ieNoBrClose;
    var ieExtraPadding = uc.ieExtraPadding;
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (!this._testDiv) {
        this._testDiv = this._document.body.appendChild(this._document.createElement("div"));
        this._testDiv.style.cssText = "position:absolute;visibility:hidden;height:1px;";
    }
    var s = "font-size: 8.3pt; font-family: Tahoma; ";
    var rs = dm.getRowStyle(y);
    var cs = dm.getCellStyle(x, y);
    s += (rs.length ? rs + ";" : "") + cs;
    var innerHTML = ["<div style=\"" + s + "\">", ieNoBr, this.getExpandIconHtml(x, y), (dm.getHasIcon(x, y) ? "<img alt=\"\" src=\"" + dm.getIcon(x, y) + "\" style=\"" + dm.getIconStyle(x, y) + "\" class=\"icon\">" : ""), dm.getCellText(x, y), ieNoBrClose, "</div>"];
    this._testDiv.innerHTML = innerHTML.join("");
    var indentCol = vm.getIndentColumn();
    var indentWidth = indentCol == x ? dm.getDepth(y) * 19 + ieExtraPadding : 0;
    return parseInt(this._testDiv.clientWidth) + indentWidth + 10;
};
_p._onHoverChanged = function (e) {
    this._hideDataModelToolTip();
    var sm = this._stateManager;
    var vm = this.getViewManager();
    var dm = this.getDataModel();
    var x = sm.getHoverX();
    var y = sm.getHoverY();
    if (x != null && y != null && x >= 0 && x < vm.getColumnCount() && y >= 0 && y < dm.getRowCount()) {
        var tt = dm.getToolTip(x, y);
        if (this._showBrokenCellTextAsToolTip && !tt && this._getCellWidth(x, y) > this.getViewManager().getColumnWidth(x)) tt = new BiToolTip(dm.getCellText(x, y));
        if (tt) {
            this._dataModelToolTip = tt;
            tt._startShowTimer();
        }
    }
};
_p._hideDataModelToolTip = function () {
    if (this._dataModelToolTip) {
        this._dataModelToolTip.setVisible(false);
        this._dataModelToolTip = null;
    }
};
_p._onColumnResize = function (e) {};
_p._onColumnResizeEnd = function (e) {
    var w = this._resizeOutline.getWidth();
    this.remove(this._resizeOutline);
    this.getViewManager().setColumnWidth(this._resizeInfo.column, w);
    this._resizeInfo = null;
    this._contentSizeDirty = true;
    this._handleContentSizeDirty();
};
_p._onDragHeaderMove = function (e) {
    var vm = this.getViewManager();
    var x = this._dragHeader.getLeft() + this._dragDeltaX;
    var ci = vm.getColumnAt(x);
    if (this.getRightToLeft()) x -= vm.getColumnWidth(ci) / 2;
    else x += vm.getColumnWidth(ci) / 2;
    ci = vm.getColumnAt(x);
    if (!this._dragHeaderMarker) {
        this._dragHeaderMarker = new BiTreeViewDragHeaderMarker;
    }
    if (!this._dragHeaderMarker.getParent()) this.add(this._dragHeaderMarker);
    this._dragHeaderMarker.syncToHeaderCell(this, ci);
};
_p._onDragHeaderMoveEnd = function (e) {
    if (this._dragHeader && this._dragHeader.getParent() == this && this._dragHeaderMarker && this._dragHeaderMarker.getParent() == this) {
        this.remove(this._dragHeader);
        this.remove(this._dragHeaderMarker);
        this._stateManager.setActive(-1, -1);
        var vm = this.getViewManager();
        var ci = this._dragHeader.getColumn();
        var beforeIndex = this._dragHeaderMarker.getColumn();
        if (ci == beforeIndex || vm.getNextColumn(ci) == beforeIndex) {
            this._updateGrid(false, true, false);
        } else {
            vm.insertColumnBefore(ci, beforeIndex);
            vm._ensureCache();
            this._updateGrid(true, true, false);
        }
    }
};
_p._onRowCountChanged = function (e) {
    this.getViewManager().rowCountChanged(e.getRowIndex(), e.getRowCount());
    this._contentSizeDirty = true;
    this._handleContentSizeDirty();
};
_p._onBeforeExpand = function (e) {};
_p._onExpand = function (e) {
    var sm = this.getSelectionModel();
    var y = e.getRowIndex();
    sm._expandNode(new BiTreeViewSelectionModelItem(null, y));
    this._contentSizeDirty = true;
    if (!e.getPreventUpdate()) {
        this._handleContentSizeDirty();
    }
};
_p._onBeforeCollapse = function (e) {
    var sm = this.getSelectionModel();
    var y = e.getRowIndex();
    sm._collapseNode(new BiTreeViewSelectionModelItem(null, y));
};
_p._onCollapse = function (e) {
    this._contentSizeDirty = true;
    if (!e.getPreventUpdate()) {
        this._handleContentSizeDirty();
    }
};
_p._beforeSupportsDrop = function (e) {
    var vm = this.getViewManager();
    var mouseX = e.getOffsetX();
    var mouseY = e.getOffsetY();
    if (mouseX < this.getClientWidth() && mouseY < this.getClientHeight()) {
        var x = vm.getColumnAt(mouseX);
        var y = vm.getRowAt(mouseY);
        this._stateManager.setDragOver(x, y);
    } else this._stateManager.setDragOver(-1, -1);
};
_p.getDropDataTypes = function () {
    if (this._dropDataTypes) return this._dropDataTypes;
    var sm = this._stateManager;
    var x = sm.getDragOverX();
    var y = sm.getDragOverY();
    return this.getDataModel().getDropDataTypes(x, y) || [];
};
_p._updateAttachedComponents = function () {
    var hc;
    for (hc in this._attachedComponents) {
        this._addAttachedComponent(hc);
    }
    var vm = this.getViewManager();
    this._createUpdateCache();
    var uc = this._updateCache;
    var scrollLeft = uc.scrollLeft;
    var scrollTop = uc.scrollTop;
    var clientWidth = uc.scrollClientWidth;
    var clientHeight = uc.scrollClientHeight;
    var startRow = uc.startRow;
    var startCol = uc.startCol;
    var obj, c, x, y, clipWidth, clipHeight;
    var fixedTopHeight = vm.getShowHeaders() ? vm.getHeadersHeight() : 0;
    var fixedLeftWidth = vm.getShowRowHeaders() ? vm.getRowHeadersWidth() : 0;
    scrollLeft = this.getScrollLeft();
    scrollTop = this.getScrollTop();
    var iem = this.getInlineEditModel();
    if (iem) iem.addEventListener("beforehide", this._preventHide);
    for (hc in this._attachedComponents) {
        obj = this._attachedComponents[hc];
        c = obj.component;
        var row = obj.row;
        var col = obj.col;
        if (col == -1) col = this._lastEditColumn || 0;
        if (!this._getHasAttachedComponent(col, row)) {
            this._removeAttachedComponent(hc);
        } else {
            x = vm.getColumnLeft(col) + fixedLeftWidth - scrollLeft;
            y = row * vm.getRowHeight() + fixedTopHeight - scrollTop;
            if (row < startRow || vm.getViewColumn(col) < vm.getViewColumn(startCol)) {
                this._removeAttachedComponent(hc);
            } else {
                var changed = this._layoutChild2(c, x, y, obj.width, obj.height);
                if (BiBrowserCheck.moz) c.setVisible(true);
                clipWidth = x + obj.width > clientWidth ? clientWidth - x : null;
                clipHeight = y + obj.height > clientHeight ? clientHeight - y : null;
                c.setClip(null, null, clipWidth, clipHeight);
                if (changed) c.invalidateLayout();
            }
        }
    }
    if (iem) iem.removeEventListener("beforehide", this._preventHide);
};
_p._preventHide = function (e) {
    e.preventDefault();
};
_p._getHasAttachedComponent = function (x, y) {
    var iem = this.getInlineEditModel();
    if (iem && iem.getHasAttachedComponent(x, y)) {
        return true;
    }
    var acm = this.getAttachedComponentModel();
    return acm && acm.getHasAttachedComponent(x, y);
};
_p._onAttachedComponentKeyDown = function (e) {
    var iem = this.getInlineEditModel();
    var wasEditing = iem && iem.getIsEditing();
    if (e.matchesBundleShortcut("controls.cancel")) {
        if (wasEditing) iem.cancelEdit();
    } else if (e.matchesBundleShortcut("controls.accept")) {
        if (wasEditing) iem.commitEdit();
    } else {
        var focusBackwards = e.matchesBundleShortcut("focus.previous");
        var focusChange = e.matchesBundleShortcut("focus.next") || focusBackwards;
        if (focusChange || e.matchesBundleShortcut("selection.up") || e.matchesBundleShortcut("selection.down")) {
            if (!e.getDefaultPrevented()) {
                var sm = this._selectionModel;
                var oldItem = sm.getLeadItem();
                if (wasEditing) {
                    iem._onComponentChange();
                    if (BiBrowserCheck.moz && !iem._internalChange && iem._isEditing && iem._currentEditComponent) {
                        iem._currentEditComponent.setVisible(false);
                    }
                }
                var item;
                if (focusChange) {
                    if (wasEditing) {
                        item = this._getNextTabItem(oldItem, focusBackwards);
                        if (item) {
                            if (BiBrowserCheck.moz) {
                                sm.setSelectedItems([]);
                                sm.setLeadItem(null);
                                sm.setAnchorItem(null);
                            } else {
                                sm.setSelectedItems([item]);
                                sm.setLeadItem(item);
                                sm.setAnchorItem(item);
                            }
                            sm.scrollItemIntoView(item);
                        }
                    } else application.getFocusManager().processKeyEvent(this.getFocusRoot(), e);
                } else {
                    sm.handleKeyDown(e);
                    item = sm.getLeadItem();
                } if (item && !item.equals(oldItem)) {
                    var x = item.getColumn();
                    if (x == -1) x = this._lastEditColumn || 0;
                    var y = item.getRow();
                    if (wasEditing) {
                        if (iem.getCanEdit(x, y)) this._startEditing(item, e);
                        else iem.commitEdit();
                    }
                }
                e.preventDefault();
            }
        }
    }
    e.stopPropagation();
    this._updateInvalidRows();
};
_p._getNextTabItem = function (item, bBackwards) {
    var vm = this.getViewManager();
    var dm = this.getDataModel();
    var sm = this.getSelectionModel();
    var iem = this.getInlineEditModel();
    if (!iem) return null;
    var x = item.getColumn();
    var y = item.getRow();
    if (x == -1) x = this._lastEditColumn || 0;
    var next;
    var x2 = x,
        y2 = y,
        rowsChanged = 0;
    item = new BiTreeViewSelectionModelItem(x, y);
    while (rowsChanged <= 1) {
        if (bBackwards) next = sm.getLeft(item);
        else next = sm.getRight(item); if (!next || next == item) {
            if (bBackwards) {
                y2--;
                if (y2 < 0) {
                    y2 = dm.getRowCount() - 1;
                }
                x2 = vm._getLastVisibleColumn();
            } else {
                y2++;
                if (y2 >= dm.getRowCount()) {
                    y2 = 0;
                }
                x2 = vm._getFirstVisibleColumn(0);
            }
            rowsChanged++;
            next = item = new BiTreeViewSelectionModelItem(x2, y2);
            if (!vm.getColumnVisible(x2)) continue;
        }
        if (iem.getCanEdit(next.getColumn(), next.getRow())) {
            break;
        } else {
            item = next;
        }
    }
    return next;
};
_p._onAttachedComponentFocusIn = function (e) {
    var c = e.getCurrentTarget();
    var hash = this._attachedComponents[c.toHashCode()];
    var item = new BiTreeViewSelectionModelItem(hash.col, hash.row);
    this._selectionModel.setSelectedItems([item]);
    this._selectionModel.setLeadItem(item);
    this._selectionModel.setAnchorItem(item);
    this._updateInvalidRows();
};
_p._onAttachedComponentMouseDown = function (e) {
    var c = e.getCurrentTarget();
    var hash = this._attachedComponents[c.toHashCode()];
    var info = new BiTreeViewSelectionModelItem(hash.col, hash.row);
    this._stateManager.updateState(e.getType(), info.getColumn(), info.getRow());
    var iem = this.getInlineEditModel();
    if (!iem || !iem.getIsEditing() || !iem.getCanEdit(info.getColumn(), info.getRow())) {
        if (this._selectionModel._selectionMode == BiSelectionModel.SELECTION_MODE_ROW) info.setColumn(-1);
        this._selectionModel.handleMouseDown(info, e);
    }
    e.stopPropagation();
};
_p._onAttachedComponentMouseUp = function (e) {
    var c = e.getCurrentTarget();
    var hash = this._attachedComponents[c.toHashCode()];
    var info = new BiTreeViewSelectionModelItem(hash.col, hash.row);
    this._stateManager.updateState(e.getType(), info.getColumn(), info.getRow());
    e.stopPropagation();
};
_p._onAttachedComponentClick = function (e) {
    var c = e.getCurrentTarget();
    var hash = this._attachedComponents[c.toHashCode()];
    var info = new BiTreeViewSelectionModelItem(hash.col, hash.row);
    this._selectionModel.handleClick(info, e);
    e.stopPropagation();
};
_p._onAttachedComponentDblClick = function (e) {
    var c = e.getCurrentTarget();
    var hash = this._attachedComponents[c.toHashCode()];
    var info = new BiTreeViewSelectionModelItem(hash.col, hash.row);
    this._selectionModel.handleDblClick(info, e);
    e.stopPropagation();
};

function BiTreeViewDataModel() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
}
_p = _biExtend(BiTreeViewDataModel, BiEventTarget, "BiTreeViewDataModel");
_p.getRowCount = function () {
    return 10000;
};
_p.getColumnCount = function () {
    return 10;
};
_p.getCellText = function (x, y) {
    return y + ", " + x;
};
_p.getHeaderCellText = function (x) {
    return String(x);
};
_p.getRowHeaderCellText = function (y) {
    return String(y);
};
_p._sortColumn = -1;
_p._sortAscending = true;
_p.getCanSortColumn = function (x) {
    return false;
};
_p.getSortColumn = function () {
    return this._sortColumn;
};
_p.getSortAscending = function () {
    return this._sortAscending;
};
_p.sort = function (x, bAscending) {
    if (bAscending == undefined) {
        if (this.getSortColumn() == x) bAscending = !this.getSortAscending();
        else bAscending = true;
    }
    if (x != this.getSortColumn() || bAscending != this.getSortAscending()) {
        this._sortColumn = x;
        this._sortAscending = bAscending;
        this._sort();
        this.dispatchEvent(new BiTreeViewDataModelEvent("datachanged"));
    }
};
_p.getSortFunction = function (x) {};
_p.getDepth = function (y) {
    return 0;
};
_p.getHasChildren = function (y) {
    return false;
};
_p.getExpanded = function (y) {
    return false;
};
_p.setExpanded = function (y, b) {};
_p.setAllExpanded = function (b) {};
_p.getParent = function (y) {
    return -1;
};
_p.getShownChildrenCount = function (y) {
    return 0;
};
_p.getHasIcon = function (x, y) {
    return false;
};
_p.getIcon = function (x, y) {};
_p.getRowStyle = function (y) {
    return "";
};
_p.getCellStyle = function (x, y) {
    return "";
};
_p.getRowHeaderCellStyle = function (y) {
    return "";
};
_p.getHeaderCellStyle = function (x) {
    return "";
};
_p.getIconStyle = function (x, y) {
    return "";
};
_p.getContextMenu = function (x, y) {
    return null;
};
_p.getToolTip = function (x, y) {
    return null;
};
_p.getDropDataTypes = function (x, y) {
    return [];
};
_p.getRowSelected = function (y) {
    return false;
};
_p._setRowSelected = function (y, b) {};
_p.getRowIsLead = function (y) {
    return false;
};
_p._setRowIsLead = function (y, b) {};
_p.getRowIsAnchor = function (y) {
    return false;
};
_p._setRowIsAnchor = function (y, b) {};
_p.getCellSelected = function (x, y) {
    return false;
};
_p._setCellSelected = function (x, y, b) {};
_p.getCellIsLead = function (x, y) {
    return false;
};
_p._setCellIsLead = function (x, y, b) {};
_p.getCellIsAnchor = function (x, y) {
    return false;
};
_p._setCellIsAnchor = function (x, y, b) {};

function BiTreeViewDataModelEvent(sType, nRowIndex, nRowCount) {
    if (_biInPrototype) return;
    BiEvent.call(this, sType);
    this._rowIndex = nRowIndex;
    this._rowCount = nRowCount;
}
_p = _biExtend(BiTreeViewDataModelEvent, BiEvent, "BiTreeViewDataModelEvent");
_p._preventUpdate = false;
BiTreeViewDataModelEvent.addProperty("rowIndex", BiAccessType.READ);
BiTreeViewDataModelEvent.addProperty("rowCount", BiAccessType.READ);
BiTreeViewDataModelEvent.addProperty("preventUpdate", BiAccessType.READ_WRITE);

function BiGridDataModel(oData) {
    if (_biInPrototype) return;
    BiTreeViewDataModel.call(this);
    this._cacheRows(oData || []);
}
_p = _biExtend(BiGridDataModel, BiTreeViewDataModel, "BiGridDataModel");
_p.getRowCount = function () {
    return this._rows.length;
};
_p._columnCount = 0;
BiGridDataModel.addProperty("columnCount", BiAccessType.READ);
_p.getCellText = function (x, y) {
    return String(this._rows[y].data[x]);
};
_p.getCanSortColumn = function (x) {
    return true;
};
_p._sort = function () {
    if (this._sortColumn != null && this._sortColumn >= 0) {
        var f = this.getSortFunction(this._sortColumn);
        this._rows.sort(f);
        if (!this._sortAscending) this._rows.reverse();
    }
};
_p.getSortFunction = function (x) {
    return function (v1, v2) {
        var d1 = v1.data[x];
        var d2 = v2.data[x];
        if (d1 < d2) return -1;
        if (d1 > d2) return 1;
        return 0;
    };
};
_p.getHasIcon = function (x, y) {
    return x == 0;
};
_p.getIcon = function (x, y) {
    return application.getTheme().getAppearanceProperty("tree-view", "file-icon");
};
_p.getDataAt = function (y) {
    return this._rows[y].data;
};
_p.setDataAt = function (y, oData) {
    this._rows[y].data = oData;
    this.dispatchEvent(new BiTreeViewDataModelEvent("datachanged"));
};
_p.removeRowAt = function (y) {
    this._rows.removeAt(y);
    this.dispatchEvent(new BiTreeViewDataModelEvent("rowcountchanged", y, -1));
};
_p.insertRowAt = function (obj, y) {
    this._rows.insertAt({
        data: obj
    }, y);
    this._sort();
    this.dispatchEvent(new BiTreeViewDataModelEvent("rowcountchanged", y, 1));
};
_p._cacheRows = function (oData) {
    var l = oData.length;
    this._rows = new Array(l);
    for (var i = 0; i < l; i++) {
        this._rows[i] = {
            data: oData[i]
        };
    }
    this._columnCount = l > 0 ? this._rows[0].data.length : 0;
};
_p.getRowSelected = function (y) {
    return Boolean(this._rows[y].selected);
};
_p._setRowSelected = function (y, b) {
    this._rows[y].selected = b;
};
_p.getRowIsLead = function (y) {
    return Boolean(this._rows[y].lead);
};
_p._setRowIsLead = function (y, b) {
    this._rows[y].lead = b;
};
_p.getRowIsAnchor = function (y) {
    return Boolean(this._rows[y].anchor);
};
_p._setRowIsAnchor = function (y, b) {
    this._rows[y].anchor = b;
};
_p.getCellSelected = function (x, y) {
    return Boolean(this._rows[y].selectedCells && x in this._rows[y].selectedCells);
};
_p._setCellSelected = function (x, y, b) {
    if (b) {
        if (!this._rows[y].selectedCells) this._rows[y].selectedCells = [];
        this._rows[y].selectedCells[x] = true;
    } else {
        if (this._rows[y].selectedCells) delete this._rows[y].selectedCells[x];
    }
};
_p.getCellIsLead = function (x, y) {
    return this._rows[y].leadCell == x;
};
_p._setCellIsLead = function (x, y, b) {
    if (b) this._rows[y].leadCell = x;
    else delete this._rows[y].leadCell;
};
_p.getCellIsAnchor = function (x, y) {
    return this._rows[y].anchorCell == x;
};
_p._setCellIsAnchor = function (x, y, b) {
    if (b) this._rows[y].anchorCell = x;
    else delete this._rows[y].anchorCell;
};

function BiTreeNode2(oData) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._data = oData;
}
_p = _biExtend(BiTreeNode2, BiObject, "BiTreeNode2");
_p._parent = null;
BiTreeNode2.addProperty("parent", BiAccessType.READ);
BiTreeNode2.addProperty("data", BiAccessType.READ_WRITE);
_p.getChildren = function () {
    return this._children || [];
};
_p.getHasChildren = function () {
    return this._children != null && this._children.length > 0;
};
_p.add = function (oChild, oBefore) {
    var p = oChild._parent;
    if (p != null) p.remove(oChild);
    if (!this._children) this._children = [];
    if (oBefore == null) this._children.push(oChild);
    else {
        if (oBefore._parent != this) throw new Error("Can only add nodes before siblings");
        this._children.insertBefore(oChild, oBefore);
    }
    oChild._parent = this;
};
_p.remove = function (oChild) {
    if (oChild._parent != this) throw new Error("Can only remove children");
    this._children.remove(oChild);
    oChild._parent = null;
    return oChild;
};
_p.toString = function () {
    return String(this._data);
};

function BiTreeDataModel(oRootNode) {
    if (_biInPrototype) return;
    BiTreeViewDataModel.call(this);
    this._collapsedNodes = {};
    if (oRootNode) this.setRootNode(oRootNode);
    this.addEventListener("datastructurechanged", this._onDataStructureChanged, this);
}
_p = _biExtend(BiTreeDataModel, BiTreeViewDataModel, "BiTreeDataModel");
_p._onDataStructureChanged = function (e) {
    this._iterator = null;
};
_p.getRowCount = function () {
    return this._root ? this._root.getSubtreeSize() : 0;
};
_p._columnCount = 1;
_p.getColumnCount = function () {
    return this._columnCount;
};
_p.getCellText = function (x, y) {
    return String(this.getNodeAt(y).getData()[x]);
};
_p.getCanSortColumn = function (x) {
    return true;
};
_p._sort = function () {
    this._sortSubtree(this._root);
};
_p.getSortFunction = function (x) {
    return function (n1, n2) {
        var d1 = n1.getData()[x];
        var d2 = n2.getData()[x];
        if (d1 < d2) return -1;
        if (d1 > d2) return 1;
        return 0;
    };
};
_p._sortSubtree = function (oSubtree) {
    if (this._sortColumn != null && this._sortColumn >= 0) {
        var f = this.getSortFunction(this._sortColumn);
        var f2 = function (subtree1, subtree2) {
            return f(subtree1.getNode(), subtree2.getNode());
        };
        this._sortSubtree2(oSubtree, f2);
        this._iterator = null;
    }
};
_p._sortSubtree2 = function (oSubtree, f) {
    var cs = oSubtree._children;
    if (cs) {
        cs.sort(f);
        if (!this._sortAscending) cs.reverse();
        for (var i = 0; i < cs.length; i++) this._sortSubtree2(cs[i], f);
    }
};
_p.getDepth = function (y) {
    return this._moveIteratorTo(y).getDepth() - 1;
};
_p.getHasChildren = function (y) {
    return this.getNodeAt(y).getHasChildren();
};
_p.getExpanded = function (y) {
    return this._getNodeExpanded(this.getNodeAt(y));
};
_p.setExpanded = function (y, b, preventUpdate) {
    if ((this.getExpanded(y) && b) || (!this.getExpanded(y) && !b)) return;
    var e = new BiTreeViewDataModelEvent(b ? "beforeexpand" : "beforecollapse", y);
    e.setPreventUpdate(preventUpdate);
    this.dispatchEvent(e);
    if (b) this._expandRow(y);
    else this._collapseRow(y);
    e = new BiTreeViewDataModelEvent(b ? "expand" : "collapse", y);
    e.setPreventUpdate(preventUpdate);
    this.dispatchEvent(e);
};
_p.setAllExpanded = function (b) {
    var y;
    if (b) {
        y = 0;
        while (y < this.getRowCount()) {
            this.setExpanded(y, b, y == (this.getRowCount() - 1));
            y++;
        }
    } else {
        y = this.getRowCount() - 1;
        while (y >= 0) {
            this.setExpanded(y, b, y == 1);
            y--;
        }
    }
};
_p.getParent = function (y) {
    this._moveIteratorTo(y);
    var p = this._iterator.getParent();
    var i = this._iterator.getChildIndex() - 1;
    for (; i >= 0; i--) {
        y -= this._getSubtreeSizeFor(p, i) + 1;
    }
    return y - 1;
};
_p.getShownChildrenCount = function (y) {
    var t = this._getSubtreeAt(y);
    return t ? t.getSubtreeSize() : 0;
};
_p.getHasIcon = function (x, y) {
    return x == 0;
};
_p.getIcon = function (x, y) {
    return this._getAppearanceIcon();
};
_p._getAppearanceIcon = function () {
    if (this._appearanceIcon) return this._appearanceIcon;
    return this._appearanceIcon = application.getTheme().getAppearanceProperty("tree-view", "file-icon");
};
_p.getRowSelected = function (y) {
    var t = this._getSubtreeAt(y);
    return t ? t.getSelected() : null;
};
_p._setRowSelected = function (y, b) {
    var t = this._getSubtreeAt(y);
    if (t) t._selected = b;
};
_p.getRowIsLead = function (y) {
    var t = this._getSubtreeAt(y);
    return t ? t.getIsLead() : null;
};
_p._setRowIsLead = function (y, b) {
    var t = this._getSubtreeAt(y);
    if (t) t._isLead = b;
};
_p.getRowIsAnchor = function (y) {
    var t = this._getSubtreeAt(y);
    return t ? t.getIsAnchor() : null;
};
_p._setRowIsAnchor = function (y, b) {
    var t = this._getSubtreeAt(y);
    if (t) t._isAnchor = b;
};
_p._getSubtreeFor = function (oParent, nChildIndex) {
    if (nChildIndex < oParent._count) return oParent.getChildAt(nChildIndex);
    return null;
};
_p._getSubtreeSizeFor = function (oParent, nChildIndex) {
    var tree = this._getSubtreeFor(oParent, nChildIndex);
    return tree.getSubtreeSize();
};
_p._getSubtreeAt = function (y) {
    this._moveIteratorTo(y);
    return this._getSubtreeFor(this._iterator.getParent(), this._iterator.getChildIndex());
};
_p.getNodeAt = function (y) {
    return this._moveIteratorTo(y).getNode();
};
_p.getNodeChildren = function (oNode) {
    return oNode.getChildren();
};
_p.setRootNode = function (oRootNode) {
    this._root = new BiSubtree(null, oRootNode);
    this._iterator = null;
    this._buildSubtree(this._root, oRootNode);
    this._sortSubtree(this._root);
    var n = this.getNodeAt(0);
    var d;
    if (n && n instanceof BiTreeNode2 && (d = n.getData()) && d instanceof Array) {
        this._columnCount = d.length;
    }
};
_p.getRootNode = function () {
    return this._root ? this._root.getNode() : null;
};
_p._removeSubtreeFor = function (oParent, nChildIndex) {
    var subtree = oParent.getChildAt(nChildIndex);
    if (subtree) {
        var size = subtree.getSubtreeSize();
        subtree.clear();
        if (size > 0) {
            for (var t = oParent; t != null; t = t._parent) t._subtreeSize -= size;
        }
    }
    this._iterator = null;
};
_p._buildSubtree = function (oSubtree, oTreeNode) {
    var cs = this.getNodeChildren(oTreeNode);
    var t;
    for (var i = 0; i < cs.length; i++) {
        oSubtree.insertAt(t = new BiSubtree(oSubtree, cs[i]), i);
        if (this._getNodeExpanded(cs[i])) this._buildSubtree(t, cs[i]);
    }
};
_p.removeRowAt = function (y) {
    var subtree = this._getSubtreeAt(y);
    var size = subtree.getSubtreeSize() + 1;
    var p = this._iterator.getParent();
    p.removeAt(this._iterator.getChildIndex());
    this._iterator = null;
    this.dispatchEvent(new BiTreeViewDataModelEvent("rowcountchanged", y, -size));
};
_p.insertRowAt = function (obj, nParentRowIndex, nChildIndex) {
    var p;
    if (nParentRowIndex == null || nParentRowIndex < 0) p = this._root;
    else p = this._getSubtreeAt(nParentRowIndex); if (nChildIndex == null) nChildIndex = p.getCount();
    var t = new BiSubtree(p, obj);
    p.insertAt(t, nChildIndex);
    this._buildSubtree(t, obj);
    this._sortSubtree(p);
    var size = this._getSubtreeSizeFor(p, nChildIndex) + 1;
    var rowIndex = nParentRowIndex;
    for (var i = 0; i < nChildIndex; i++) {
        rowIndex += p.getChildAt(i).getSubtreeSize() + 1;
    }
    this.dispatchEvent(new BiTreeViewDataModelEvent("rowcountchanged", rowIndex + 1, size));
    this._iterator = null;
};
_p._first = function () {
    var it = new BiTreeIterator;
    it.append(this._root, 0);
    it.setRowIndex(0);
    return it;
};
_p._last = function () {
    var it = new BiTreeIterator;
    var current = this._root;
    var count = current.getCount();
    var last;
    do {
        last = count - 1;
        it.append(current, last);
        current = count > 0 ? this._getSubtreeFor(current, last) : null;
    } while (current && ((count = current.getCount()) != 0));
    it._stack[result._top]._childIndex++;
    it.setRowIndex(this._root.getSubtreeSize() + 1);
    return it;
};
_p._moveIteratorTo = function (y) {
    if (this._iterator) {
        var last = this._iterator.getRowIndex();
        if (last != -1) {
            if (y == last) return this._iterator;
            else if (last + 1 == y) return this._iterator.next();
            else if (last - 1 == y) return this._iterator.previous();
        }
    }
    var it = new BiTreeIterator;
    var current = this._root;
    if (current.getSubtreeSize() > 0) {
        var index = 0;
        it.setRowIndex(y);
        var size, subtree;
        do {
            subtree = this._getSubtreeFor(current, index);
            if (subtree == null) return null;
            size = subtree.getSubtreeSize();
            if (size >= y) {
                it.append(current, index);
                current = subtree;
                index = 0;
                y--;
            } else {
                index++;
                y -= size + 1;
            }
        } while (y >= 0);
    }
    return this._iterator = it;
};
_p._setNodeExpanded = function (oNode, b) {
    if (!b) this._collapsedNodes[this.getNodeHashCode(oNode)] = true;
    else delete this._collapsedNodes[this.getNodeHashCode(oNode)];
};
_p._getNodeExpanded = function (oNode) {
    return !(this.getNodeHashCode(oNode) in this._collapsedNodes);
};
_p.getNodeHashCode = function (oNode) {
    return oNode.toHashCode();
};
_p._expandRow = function (nIndex) {
    this._moveIteratorTo(nIndex);
    var subtree = this._iterator.getSubtree();
    var node = subtree.getNode();
    this._setNodeExpanded(node, true);
    this._buildSubtree(subtree, node);
    this._sortSubtree(subtree);
};
_p._collapseRow = function (nIndex) {
    this._moveIteratorTo(nIndex);
    var subtree = this._iterator.getSubtree();
    var node = subtree.getNode();
    this._setNodeExpanded(node, false);
    this._removeSubtreeFor(this._iterator.getParent(), this._iterator.getChildIndex());
};
_p.rebuildSubtree = function (nIndex) {
    if (nIndex == -1) {
        this.rebuildTree();
        return;
    }
    this._moveIteratorTo(nIndex);
    var subtree = this._iterator.getSubtree();
    var sizeBefore = subtree.getSubtreeSize();
    var node = subtree.getNode();
    this._removeSubtreeFor(this._iterator.getParent(), this._iterator.getChildIndex());
    this._buildSubtree(subtree, node);
    this._sortSubtree(subtree);
    var sizeAfter = subtree.getSubtreeSize();
    this.dispatchEvent(new BiTreeViewDataModelEvent("rowcountchanged", nIndex + 1, sizeAfter - sizeBefore));
};
_p.rebuildTree = function () {
    this.setRootNode(this.getRootNode());
};

function BiSubtree(oParent, oNode) {
    if (_biInPrototype) return;
    this._parent = oParent;
    this._node = oNode;
}
_p = _biExtend(BiSubtree, BiObject, "BiSubtree");
_p._node = null;
_p._parent = null;
_p._count = 0;
_p._subtreeSize = 0;
_p._children = null;
_p._selected = false;
_p._isLead = false;
_p._isAnchor = false;
BiSubtree.addProperty("node", BiAccessType.READ);
BiSubtree.addProperty("parent", BiAccessType.READ);
BiSubtree.addProperty("count", BiAccessType.READ);
BiSubtree.addProperty("subtreeSize", BiAccessType.READ);
BiSubtree.addProperty("selected", BiAccessType.READ);
BiSubtree.addProperty("isLead", BiAccessType.READ);
BiSubtree.addProperty("isAnchor", BiAccessType.READ);
_p.getChildAt = function (nIndex) {
    return this._children ? this._children[nIndex] : null;
};
_p.clear = function () {
    this._count = 0;
    this._subtreeSize = 0;
    this._children = [];
};
_p.insertAt = function (oSubtree, nIndex) {
    if (this._children == null) this._children = [];
    this._children.insertAt(oSubtree, nIndex);
    ++this._count;
    for (var t = this; t != null; t = t.getParent()) t._subtreeSize++;
};
_p.removeAt = function (nIndex) {
    if (nIndex < 0 || nIndex >= this._count || this._children == null) return;
    var subtree = this._children[nIndex];
    var subtreeSize = subtree ? subtree._subtreeSize : 0;
    subtreeSize++;
    this._children.removeAt(nIndex);
    --this._count;
    for (var t = this; t != null; t = t._parent) t._subtreeSize -= subtreeSize;
};

function BiTreeIterator(oIterator) {
    if (_biInPrototype) return;
    if (oIterator) {
        this._top = oIterator._top;
        this._rowIndex = oIterator._rowIndex;
        this._stack = oIterator._stack.concat();
    } else {
        this._stack = [];
    }
}
_p = _biExtend(BiTreeIterator, BiObject, "BiTreeIterator");
_p._top = -1;
_p._rowIndex = -1;
_p.next = function () {
    if (this._top < 0) throw new Error("BiTreeIterator not initialized");
    ++this._rowIndex;
    var top = this._stack[this._top];
    var subtree = top.getSubtree();
    if (subtree && subtree.getCount()) {
        this.append(subtree, 0);
        return this;
    }
    if (top._childIndex >= top._parent.getCount() - 1) {
        var i;
        for (i = this._top - 1; i >= 0; --i) {
            var lp = this._stack[i];
            if (lp._childIndex < lp._parent.getCount() - 1) break;
        }
        if (i < 0) {
            top._childIndex++;
            return this;
        }
        this._top = i;
    }
    this._stack[this._top]._childIndex++;
    return this;
};
_p.previous = function () {
    if (this._top < 0) throw new Error("BiTreeIterator not initialized");
    --this._rowIndex;
    var i;
    this._stack[this._top]._childIndex--;
    if (this._stack[this._top]._childIndex < 0) {
        for (i = this._top - 1; i >= 0; --i) {
            var lp = this._stack[i];
            if (lp._childIndex >= 0) break;
        }
        if (i < 0) return this;
        this._top = i;
        return this;
    }
    var p = this._stack[this._top]._parent;
    i = this._stack[this._top]._childIndex;
    var subtree = p.getChildAt(i);
    while (subtree && subtree.getCount() > 0) {
        i = subtree.getCount() - 1;
        this.append(subtree, i);
        p = subtree;
        subtree = p.getChildAt(i);
    }
    return this;
};
_p.append = function (oSubtree, nChildIndex) {
    ++this._top;
    this._stack[this._top] = new BiTreeIteratorStackItem(oSubtree, nChildIndex);
};
_p._push = function (oSubtree, nChildIndex) {
    this._stack.splice(0, 0, new BiTreeIteratorStackItem(oSubtree, nChildIndex));
    ++this._top;
};
_p.pop = function () {
    --this._top;
    this._stack.length = this._top + 1;
    return this;
};
_p.setRowIndex = function (nRowIndex) {
    this._rowIndex = nRowIndex;
};
_p.getParent = function () {
    return this._stack[this._top].getParent();
};
_p.getChildIndex = function () {
    return this._stack[this._top].getChildIndex();
};
_p.getDepth = function () {
    return this._top + 1;
};
_p.getRowIndex = function () {
    return this._rowIndex;
};
_p.getNode = function () {
    if (this._top >= 0) return this._stack[this._top].getNode();
    return null;
};
_p.getSubtree = function () {
    return this._stack[this._top].getSubtree();
};

function BiTreeIteratorStackItem(oParent, nChildIndex) {
    if (_biInPrototype) return;
    this._parent = oParent;
    this._childIndex = nChildIndex;
}
_p = _biExtend(BiTreeIteratorStackItem, BiObject, "BiTreeIteratorStackItem");
_p._parent = null;
_p._childIndex = -1;
_p.getNode = function () {
    return this._parent.getChildAt(this._childIndex).getNode();
};
_p.getSubtree = function () {
    return this._parent.getChildAt(this._childIndex);
};
BiTreeIteratorStackItem.addProperty("parent", BiAccessType.READ);
BiTreeIteratorStackItem.addProperty("childIndex", BiAccessType.READ);

function BiGrid2(oGridData, oColumnNames) {
    if (_biInPrototype) return;
    BiTreeView.call(this);
    this._rows = [];
    this._viewManager.dispose();
    this._viewManager = new BiGrid2ViewManager(this);
    this._columnNames = [];
    this._columnWidths = [];
    if (oColumnNames) {
        this.setColumnNames(oColumnNames);
    }
    if (oGridData) {
        var h = oGridData.length;
        for (var y = 0; y < h; y++) {
            this.addRow(new BiGrid2Row(oGridData[y]));
        }
    }
    this.setDataModel(new BiGrid2DataModel(this));
}
_p = _biExtend(BiGrid2, BiTreeView, "BiGrid2");
_p._columnCount = null;
_p.getColumnCount = function () {
    return this._dataModel.getColumnCount();
};
_p.setColumnCount = function (n) {
    this._dataModel.setColumnCount(n);
    this.getViewManager().resetCache();
};
BiGrid2.addProperty("columnNames", BiAccessType.READ_WRITE);
BiGrid2.addProperty("columnWidths", BiAccessType.READ_WRITE);
_p.setColumnOrders = function (aOrders) {
    this._viewManager.setColumnOrders(aOrders);
};
_p.getColumnOrders = function () {
    return this._viewManager.getColumnOrders();
};
_p._showHeaders = true;
BiGrid2.addProperty("showHeaders", BiAccessType.READ_WRITE);
_p._showRowHeaders = true;
BiGrid2.addProperty("showRowHeaders", BiAccessType.READ_WRITE);
_p._showGridLines = true;
BiGrid2.addProperty("showGridLines", BiAccessType.READ_WRITE);
BiGrid2.addProperty("rows", BiAccessType.READ);
_p.addRow = function (oChild, oBefore) {
    var p = oChild._grid;
    if (oBefore == null) {
        if (p != null) p.removeRow(oChild);
        this._rows.push(oChild);
    } else {
        if (oBefore._grid != this) throw new Error("Can only add components before siblings");
        if (p != null) p.removeRow(oChild);
        this._rows.insertBefore(oChild, oBefore);
    }
    oChild._grid = this;
};
_p.removeRow = function (oChild) {
    if (oChild._grid != this) throw new Error("Can only remove children");
    var r = this._rows.indexOf(oChild);
    this.getSelectionModel()._removeAt(r);
    this._rows.remove(oChild);
    oChild._grid = null;
    oChild._selected = false;
    oChild._isLead = false;
    oChild._isAnchor = false;
    return oChild;
};
_p.removeAll = function () {
    this._selectionModel.deselectAll();
    this._selectionModel.setLeadItem(null);
    this._selectionModel.setAnchorItem(null);
    for (var i = this._rows.length - 1; i >= 0; i--) {
        var n = this._rows[i];
        n.dispose();
    }
    this._rows.length = 0;
};
_p.update = function () {
    var old = this.getColumnCount();
    this._dataModel._cacheRows(this);
    if (old != this.getColumnCount()) this.getViewManager().resetCache();
    BiTreeView.prototype.update.call(this);
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiTreeView.prototype.dispose.call(this);
    if (this._rows) {
        for (var i = this._rows.length - 1; i >= 0; i--) {
            this._rows[i].dispose();
            this._rows[i] = null;
        }
    }
};
_p.addParsedObject = function (o) {
    if (o instanceof BiGrid2Row) this.addRow(o);
    else BiTreeView.prototype.addParsedObject.call(this, o);
};
BiGrid2._getArrayFromString = function (s, fCast) {
    var parts = s.split(/\s*,\s*/);
    if (fCast) {
        for (var i = 0; i < parts.length; i++) parts[i] = fCast(parts[i]);
    }
    return parts;
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
    case "columnWidths":
    case "columnOrders":
        this.setProperty(sName, BiGrid2._getArrayFromString(sValue, Number));
        break;
    case "columnNames":
        this.setProperty(sName, BiGrid2._getArrayFromString(sValue));
        break;
    default:
        BiTreeView.prototype.setAttribute.apply(this, arguments);
    }
};

function BiGrid2Row(oData) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._cells = [];
    if (oData) {
        var l = oData.length;
        for (var i = 0; i < l; i++) this.addCell(new BiGrid2Cell(oData[i]));
    }
}
_p = _biExtend(BiGrid2Row, BiObject, "BiGrid2Row");
BiGrid2Row.addProperty("grid", BiAccessType.READ);
_p.getData = function (nCol) {
    return this._cells[nCol].getData();
};
_p.setData = function (nCol, oData) {
    this._cells[nCol].setData(oData);
};
_p.getCell = function (nCol) {
    return this._cells[nCol];
};
BiGrid2Row.addProperty("cells", BiAccessType.READ);
_p.addCell = function (oChild, oBefore) {
    var r = oChild._row;
    if (oBefore == null) {
        if (r != null) r.removeCell(oChild);
        this._cells.push(oChild);
    } else {
        if (oBefore._row != this) throw new Error("Can only add components before siblings");
        if (r != null) r.removeCell(oChild);
        this._cells.insertBefore(oChild, oBefore);
    }
    oChild._row = this;
};
_p.removeCell = function (oChild) {
    if (oChild._row != this) throw new Error("Can only remove children");
    this._cells.remove(oChild);
    oChild._row = null;
    return oChild;
};
_p._selected = false;
BiGrid2Row.addProperty("selected", BiAccessType.READ);
_p._isLead = false;
BiGrid2Row.addProperty("isLead", BiAccessType.READ);
_p._isAnchor = false;
BiGrid2Row.addProperty("isAnchor", BiAccessType.READ);
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiObject.prototype.dispose.call(this);
    for (var i = this._cells.length - 1; i >= 0; i--) {
        this._cells[i].dispose();
        this._cells[i] = null;
    }
    this._grid = null;
};
_p.addParsedObject = function (o) {
    if (o instanceof BiGrid2Cell) this.addCell(o);
    else BiObject.prototype.addParsedObject.call(this, o);
};

function BiGrid2Cell(oData) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._data = oData;
}
_p = _biExtend(BiGrid2Cell, BiObject, "BiGrid2Cell");
_p.getLabelHtml = function () {
    return String(this._data);
};
BiGrid2Cell.addProperty("data", BiAccessType.READ_WRITE);
BiGrid2Cell.addProperty("row", BiAccessType.READ);
_p.getGrid = function () {
    return this._row && this._row.getGrid();
};
_p._selected = false;
BiGrid2Cell.addProperty("selected", BiAccessType.READ);
_p._isLead = false;
BiGrid2Cell.addProperty("isLead", BiAccessType.READ);
_p._isAnchor = false;
BiGrid2Cell.addProperty("isAnchor", BiAccessType.READ);
_p.dispose = function () {
    if (this.getDisposed()) return;

    BiObject.prototype.dispose.call(this);
    this._data = null;
    this._row = null;
};
_p.addXmlNode = function (oNode, oParser) {
    if (oNode.nodeType == 3) {
        this.setData((this.getData() || "") + oNode.nodeValue);
    } else if (oNode.nodeType == 1) {
        var xhtmlNs = "http://www.w3.org/1999/xhtml";
        var ns = oNode.namespaceURI;
        if (ns == xhtmlNs) {
            var prefix = oNode.prefix;
            var s = oNode.xml.replace(new RegExp("<" + prefix + ":", "g"), "<").replace(new RegExp("</" + prefix + ":", "g"), "</");
            this.setData((this.getData() || "") + s);
        } else BiObject.prototype.addXmlNode.call(this, oNode, oParser);
    }
};

function BiGrid2DataModel(oGrid) {
    if (_biInPrototype) return;
    BiTreeViewDataModel.call(this);
    this.setTreeView(oGrid);
}
_p = _biExtend(BiGrid2DataModel, BiTreeViewDataModel, "BiGrid2DataModel");
BiGrid2DataModel.addProperty("treeView", BiAccessType.READ);
_p.setTreeView = function (oGrid) {
    if (this._treeView != oGrid) {
        this._treeView = oGrid;
        this._cacheRows(oGrid);
    }
};
_p.getRowCount = function () {
    return this._rows.length;
};
_p._columnCount = null;
_p._cellsColumnCount = 0;
BiGrid2DataModel.addProperty("columnCount", BiAccessType.WRITE);
_p.getColumnCount = function () {
    return this._columnCount != null ? this._columnCount : this._cellsColumnCount;
};
_p.getCellText = function (x, y) {
    return this._rows[y].getCell(x).getLabelHtml();
};
_p.getHeaderCellText = function (x) {
    return String(this._treeView._columnNames[x] || x);
};
_p.getCanSortColumn = function (x) {
    return true;
};
_p._sort = function () {
    if (this._sortColumn != null && this._sortColumn >= 0) {
        var f = this.getSortFunction(this._sortColumn);
        this._rows.sort(f);
        if (!this._sortAscending) this._rows.reverse();
    }
};
_p.getSortFunction = function (x) {
    return function (v1, v2) {
        var d1 = v1.getData(x);
        var d2 = v2.getData(x);
        if (d1 < d2) return -1;
        if (d1 > d2) return 1;
        return 0;
    };
};
_p.getHasIcon = function (x, y) {
    return x == 0;
};
_p.getIcon = function (x, y) {
    return this._getAppearanceIcon();
};
_p._getAppearanceIcon = function () {
    if (this._appearanceIcon) return this._appearanceIcon;
    return this._appearanceIcon = application.getTheme().getAppearanceProperty("tree-view", "file-icon");
};
_p.getRowAt = function (y) {
    return this._rows[y];
};
_p.removeRowAt = function (y) {
    this._treeView.removeRow(this.getRowAt(y));
    this._rows.removeAt(y);
    this.dispatchEvent(new BiTreeViewDataModelEvent("rowcountchanged", y, -1));
};
_p.insertRowAt = function (obj, y) {
    this._treeView.addRow(obj, this.getRowAt(y));
    this._rows.insertAt(obj, y);
    this._sort();
    this.dispatchEvent(new BiTreeViewDataModelEvent("rowcountchanged", y, 1));
};
_p._cacheRows = function (oGrid) {
    if (oGrid) {
        var rows = oGrid.getRows();
        var l = rows.length;
        this._rows = new Array(l);
        for (var i = 0; i < l; i++) {
            this._rows[i] = rows[i];
        }
        this._cellsColumnCount = l > 0 ? this._rows[0].getCells().length : 0;
    } else {
        this._rows = [];
        this._cellsColumnCount = 0;
    }
};
_p.getRowSelected = function (y) {
    return this.getRowAt(y).getSelected();
};
_p._setRowSelected = function (y, b) {
    this.getRowAt(y)._selected = b;
};
_p.getRowIsLead = function (y) {
    return this.getRowAt(y).getIsLead();
};
_p._setRowIsLead = function (y, b) {
    this.getRowAt(y)._isLead = b;
};
_p.getRowIsAnchor = function (y) {
    return this.getRowAt(y).getIsAnchor();
};
_p._setRowIsAnchor = function (y, b) {
    this.getRowAt(y)._isAnchor = b;
};
_p.getCellSelected = function (x, y) {
    return this.getRowAt(y).getCell(x).getSelected();
};
_p._setCellSelected = function (x, y, b) {
    this.getRowAt(y).getCell(x)._selected = b;
};
_p.getCellIsLead = function (x, y) {
    return this.getRowAt(y).getCell(x).getIsLead();
};
_p._setCellIsLead = function (x, y, b) {
    this.getRowAt(y).getCell(x)._isLead = b;
};
_p.getCellIsAnchor = function (x, y) {
    return this.getRowAt(y).getCell(x).getIsAnchor();
};
_p._setCellIsAnchor = function (x, y, b) {
    this.getRowAt(y).getCell(x)._isAnchor = b;
};

function BiGrid2ViewManager(oGrid) {
    if (_biInPrototype) return;
    BiTreeViewViewManager.call(this, oGrid);
};
_p = _biExtend(BiGrid2ViewManager, BiTreeViewViewManager, "BiGrid2ViewManager");
_p.getColumnCount = function () {
    return this._treeView.getColumnCount();
};
_p.getColumnWidth = function (x) {
    var cws = this._treeView.getColumnWidths();
    var w = Number(cws[x]);
    if (isNaN(w)) return 100;
    return w;
};
_p.setColumnWidth = function (x, w) {
    this._columnCache = null;
    var cw = this._treeView.getColumnWidths();
    cw[x] = w;
    this._treeView.setColumnWidths(cw);
};
_p.setColumnOrders = function (oOrders) {
    this._columnCache = null;
    this._columnOrders = oOrders;
    this._invertedColumnOrders = null;
};
_p.getShowHeaders = function () {
    return this._treeView.getShowHeaders();
};
_p.getShowRowHeaders = function () {
    return this._treeView.getShowRowHeaders();
};
_p.getShowGridLines = function () {
    return this._treeView.getShowGridLines();
};

function BiTree2(oColumnNames) {
    if (_biInPrototype) return;
    BiTreeView.call(this);
    this._viewManager.dispose();
    this._viewManager = new BiTree2ViewManager(this);
    this._columnNames = [];
    this._columnWidths = [];
    if (oColumnNames) {
        this.setColumnNames(oColumnNames);
    }
    this._rootRow = new BiTree2Row;
    this._rootRow._tree = this;
    this.setDataModel(new BiTree2DataModel(this));
}
_p = _biExtend(BiTree2, BiTreeView, "BiTree2");
_p.getColumnCount = function () {
    return this._dataModel.getColumnCount();
};
_p.setColumnCount = function (n) {
    this._dataModel.setColumnCount(n);
};
BiTree2.addProperty("columnNames", BiAccessType.READ_WRITE);
BiTree2.addProperty("columnWidths", BiAccessType.READ);
_p.setColumnWidths = function (oWidths) {
    this._columnCache = null;
    this._columnWidths = oWidths;
};
_p.setColumnOrders = function (aOrders) {
    this._viewManager.setColumnOrders(aOrders);
};
_p.getColumnOrders = function () {
    return this._viewManager.getColumnOrders();
};
_p._showHeaders = true;
BiTree2.addProperty("showHeaders", BiAccessType.READ_WRITE);
_p._showRowHeaders = false;
BiTree2.addProperty("showRowHeaders", BiAccessType.READ_WRITE);
_p._showGridLines = true;
BiTree2.addProperty("showGridLines", BiAccessType.READ_WRITE);
_p.getRows = function () {
    return this._rootRow._rows;
};
_p.addRow = function (oChild, oBefore) {
    this._rootRow.addRow(oChild, oBefore);
};
_p.removeRow = function (oChild) {
    return this._rootRow.removeRow(oChild);
};
_p.removeAll = function () {
    var dm = this.getDataModel();
    dm.dispatchEvent(new BiTreeViewDataModelEvent("beforedatastructurechanged"));
    this._rootRow.removeAll();
    dm.setRootNode(this._rootRow);
    dm.dispatchEvent(new BiTreeViewDataModelEvent("datastructurechanged"));
};
_p.update = function () {
    var old = this.getColumnCount();
    this._dataModel.setRootNode(this._rootRow);
    if (old != this.getColumnCount()) this.getViewManager().resetCache();
    BiTreeView.prototype.update.call(this);
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiTreeView.prototype.dispose.call(this);
    this._rootRow.dispose();
    this._rootRow._tree = null;
    this._rootRow = null;
};
_p.addParsedObject = function (o) {
    if (o instanceof BiTree2Row) this.addRow(o);
    else BiTreeView.prototype.addParsedObject.call(this, o);
};
BiTree2._getArrayFromString = function (s, fCast) {
    var parts = s.split(/\s*,\s*/);
    if (fCast) {
        for (var i = 0; i < parts.length; i++) parts[i] = fCast(parts[i]);

    }
    return parts;
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
    case "columnWidths":
    case "columnOrders":
        this.setProperty(sName, BiTree2._getArrayFromString(sValue, Number));
        break;
    case "columnNames":
        this.setProperty(sName, BiTree2._getArrayFromString(sValue));
        break;
    default:
        BiTreeView.prototype.setAttribute.apply(this, arguments);
    }
};

function BiTree2Row(oData) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._cells = [];
    this._rows = [];
    if (oData) {
        var l = oData.length;
        for (var i = 0; i < l; i++) this.addCell(new BiTree2Cell(oData[i]));
    }
}
_p = _biExtend(BiTree2Row, BiObject, "BiTree2Row");
BiTree2Row.addProperty("parent", BiAccessType.READ);
_p.getTree = function () {
    for (var t = this; t != null; t = t.getParent()) {
        if (t._tree) return t._tree;
    };
    return null;
};
_p._expanded = true;
BiTree2Row.addProperty("expanded", BiAccessType.READ_WRITE);
_p.getData = function (nCol) {
    return this._cells[nCol].getData();
};
_p.setData = function (nCol, oData) {
    this._cells[nCol].setData(oData);
};
_p.getCell = function (nCol) {
    return this._cells[nCol];
};
BiTree2Row.addProperty("cells", BiAccessType.READ);
_p.addCell = function (oChild, oBefore) {
    var r = oChild._row;
    if (oBefore == null) {
        if (r != null) r.removeCell(oChild);
        this._cells.push(oChild);
    } else {
        if (oBefore._row != this) throw new Error("Can only add components before siblings");
        if (r != null) r.removeCell(oChild);
        this._cells.insertBefore(oChild, oBefore);
    }
    oChild._row = this;
};
_p.removeCell = function (oChild) {
    if (oChild._row != this) throw new Error("Can only remove children");
    this._cells.remove(oChild);
    oChild._row = null;
    return oChild;
};
BiTree2Row.addProperty("rows", BiAccessType.READ);
_p.addRow = function (oChild, oBefore) {
    var p = oChild._parent;
    if (oBefore == null) {
        if (p != null) p.removeRow(oChild);
        this._rows.push(oChild);
    } else {
        if (oBefore._parent != this) throw new Error("Can only add components before siblings");
        if (p != null) p.removeRow(oChild);
        this._rows.insertBefore(oChild, oBefore);
    }
    oChild._parent = this;
};
_p.removeRow = function (oChild) {
    if (oChild._parent != this) throw new Error("Can only remove children");
    this._rows.remove(oChild);
    oChild._parent = null;
    return oChild;
};
_p.removeAll = function () {
    for (var i = this._rows.length - 1; i >= 0; i--) {
        var n = this._rows[i];
        n.dispose();
    }
    this._rows.length = 0;
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiObject.prototype.dispose.call(this);
    for (var i = this._cells.length - 1; i >= 0; i--) {
        this._cells[i].dispose();
        this._cells[i] = null;
    }
    for (i = this._rows.length - 1; i >= 0; i--) {
        this._rows[i].dispose();
        this._rows[i] = null;
    }
    this._parent = null;
};
_p.addParsedObject = function (o) {
    if (o instanceof BiTree2Row) this.addRow(o);
    else if (o instanceof BiTree2Cell) this.addCell(o);
    else BiObject.prototype.addParsedObject.call(this, o);
};

function BiTree2Cell(oData) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._data = oData;
}
_p = _biExtend(BiTree2Cell, BiObject, "BiTree2Cell");
_p.getLabelHtml = function () {
    return String(this._data);
};
BiTree2Cell.addProperty("data", BiAccessType.READ_WRITE);
BiTree2Cell.addProperty("row", BiAccessType.READ);
_p.getTree = function () {
    return this._row && this._row.getTree();
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiObject.prototype.dispose.call(this);
    this._data = null;
    this._row = null;
};
_p.addXmlNode = function (oNode, oParser) {
    if (oNode.nodeType == 3) {
        this.setData((this.getData() || "") + oNode.nodeValue);
    } else if (oNode.nodeType == 1) {
        var xhtmlNs = "http://www.w3.org/1999/xhtml";
        var ns = oNode.namespaceURI;
        if (ns == xhtmlNs) {
            var prefix = oNode.prefix;
            var s = oNode.xml.replace(new RegExp("<" + prefix + ":", "g"), "<").replace(new RegExp("</" + prefix + ":", "g"), "</");
            this.setData((this.getData() || "") + s);
        } else BiObject.prototype.addXmlNode.call(this, oNode, oParser);
    }
};

function BiTree2DataModel(oTree) {
    if (_biInPrototype) return;
    BiTreeDataModel.call(this, oTree ? oTree._rootRow : null);
    this._treeView = oTree;
}
_p = _biExtend(BiTree2DataModel, BiTreeDataModel, "BiTree2DataModel");
BiTree2DataModel.addProperty("treeView", BiAccessType.READ);
_p.setTreeView = function (oTree) {
    if (this._treeView != oTree) {
        this._treeView = oTree;
        this.setRootNode(oTree._rootRow);
    }
};
_p._columnCount = null;
_p._cellsColumnCount = 0;
BiTree2DataModel.addProperty("columnCount", BiAccessType.WRITE);
_p.getColumnCount = function () {
    return this._columnCount != null ? this._columnCount : this._cellsColumnCount;
};
_p.getCellText = function (x, y) {
    return this.getNodeAt(y).getCell(x).getLabelHtml();
};
_p.getHeaderCellText = function (x) {
    return String(this._treeView._columnNames[x] || x);
};
_p.getSortFunction = function (x) {
    return function (v1, v2) {
        var d1 = v1.getData(x);
        var d2 = v2.getData(x);
        if (d1 < d2) return -1;
        if (d1 > d2) return 1;
        return 0;
    };
};
_p.getHasIcon = function (x, y) {
    return x == 0;
};
_p.getIcon = function (x, y) {
    var srcId;
    if (this.getHasChildren(y)) {
        if (this.getExpanded(y)) srcId = "open-folder-icon";
        else srcId = "folder-icon";
    } else {
        srcId = "file-icon";
    }
    return application.getTheme().getAppearanceProperty("tree-view", srcId);
};
_p.getNodeChildren = function (oNode) {
    return oNode.getRows();
};
_p.getHasChildren = function (y) {
    return this.getNodeAt(y).getRows().length > 0;
};
_p.setRootNode = function (oRootNode) {
    BiTreeDataModel.prototype.setRootNode.call(this, oRootNode);
    var rows = oRootNode.getRows();
    if (rows.length > 0) {
        this._cellsColumnCount = rows[0].getCells().length;
        var vm = this._treeView.getViewManager();
        vm.resetCache();
    } else {
        this._cellsColumnCount = 0;
    }
};
_p._setNodeExpanded = function (oNode, b) {
    oNode.setExpanded(b);
};
_p._getNodeExpanded = function (oNode) {
    return oNode.getExpanded();
};

function BiTree2ViewManager(oTree) {
    if (_biInPrototype) return;
    BiTreeViewViewManager.call(this, oTree);
};
_p = _biExtend(BiTree2ViewManager, BiTreeViewViewManager, "BiTree2ViewManager");
_p.getColumnCount = function () {
    return this._treeView.getColumnCount();
};
_p.getColumnWidth = function (x) {
    var cws = this._treeView.getColumnWidths();
    var w = Number(cws[x]);
    if (isNaN(w)) return 100;
    return w;
};
_p.setColumnWidth = function (x, w) {
    this._columnCache = null;
    var cw = this._treeView.getColumnWidths();
    cw[x] = w;
    this._treeView.setColumnWidths(cw);
};
_p.setColumnOrders = function (oOrders) {
    this._columnCache = null;
    this._columnOrders = oOrders;
    this._invertedColumnOrders = null;
};
_p._indentColumn = 0;
BiTree2ViewManager.addProperty("indentColumn", BiAccessType.READ_WRITE);
_p.getShowHeaders = function () {
    return this._treeView.getShowHeaders();
};
_p.getShowRowHeaders = function () {
    return this._treeView.getShowRowHeaders();
};
_p.getShowGridLines = function () {
    return this._treeView.getShowGridLines();
};

function BiDataSetDataModel(oDataSet) {
    if (_biInPrototype) return;
    BiTreeViewDataModel.call(this);
    if (oDataSet) this.setDataSet(oDataSet);
}
_p = _biExtend(BiDataSetDataModel, BiTreeViewDataModel, "BiDataSetDataModel");
_p._rowCount = 0;
_p._columnCount = 0;
_p._dataSetReady = false;
_p.setDataSet = function (ds) {
    if (this._dataSet != ds) {
        if (this._dataSet) {
            if (this._dataSet instanceof BiDataSet) this._dataSet.removeEventListener("dataready", this._onDataSetReady, this);
        }
        this._dataSet = ds;
        if (ds == null) {
            this.dispatchEvent(new BiTreeViewDataModelEvent("beforedatastructurechanged"));
            this._rowCount = 0;
            this._columnCount = 0;
            this._rows = [];
            this._dataSetReady = false;
        } else {
            this._dataSetReady = ds.getDataReady();
            if (this._dataSetReady) {
                this.dispatchEvent(new BiTreeViewDataModelEvent("beforedatastructurechanged"));
                this._cacheRows(ds);
                this.dispatchEvent(new BiTreeViewDataModelEvent("datastructurechanged"));
            } else {
                if (ds instanceof BiDataSet) ds.addEventListener("dataready", this._onDataSetReady, this);
            }
        }
    }
};
BiDataSetDataModel.addProperty("dataSet", BiAccessType.READ);
_p._onDataSetReady = function (e) {
    this.dispatchEvent(new BiTreeViewDataModelEvent("beforedatastructurechanged"));
    this._dataSetReady = true;
    this._cacheRows(this._dataSet);
    if (this._dataSet instanceof BiDataSet) this._dataSet.removeEventListener("dataready", this._onDataSetReady, this);
    this.dispatchEvent(new BiTreeViewDataModelEvent("datastructurechanged"));
};
BiDataSetDataModel.addProperty("rowCount", BiAccessType.READ);
BiDataSetDataModel.addProperty("columnCount", BiAccessType.READ);
_p.getCellText = function (x, y) {
    return String(this._rows[y].getValueByIndex(x));
};
_p.getHeaderCellText = function (x) {
    return this._dataSetColumns[x].getName();
};
_p.getCanSortColumn = function (x) {
    return true;
};
_p._sort = function () {
    if (this._sortColumn != null && this._sortColumn >= 0) {
        var f = this.getSortFunction(this._sortColumn);
        this._rows.sort(f);
        if (!this._sortAscending) this._rows.reverse();
    }
};
_p.getSortFunction = function (x) {
    return function (data1, data2) {
        var v1 = data1.getValueByIndex(x);
        var v2 = data2.getValueByIndex(x);
        if (v1 < v2) return -1;
        if (v1 > v2) return 1;
        return 0;
    };
};
_p._cacheRows = function (oDataSet) {
    var t;
    if (oDataSet instanceof BiDataSet) t = oDataSet.getTables()[0];
    else t = oDataSet;
    var rows = t.getRows();
    var l = this._rowCount = rows.length;
    this._dataSetColumns = t.getColumns();
    this._columnCount = this._dataSetColumns.length;
    this._rows = new Array(l);
    for (var i = 0; i < l; i++) {
        this._rows[i] = rows[i];
    }
    this._sort();
};
_p.getRowSelected = function (y) {
    return Boolean(this._rows[y].selected);
};
_p._setRowSelected = function (y, b) {
    this._rows[y].selected = b;
};
_p.getRowIsLead = function (y) {
    return Boolean(this._rows[y].lead);
};
_p._setRowIsLead = function (y, b) {
    this._rows[y].lead = b;
};
_p.getRowIsAnchor = function (y) {
    return Boolean(this._rows[y].anchor);
};
_p._setRowIsAnchor = function (y, b) {
    this._rows[y].anchor = b;
};
_p.getCellSelected = function (x, y) {
    return Boolean(this._rows[y].selectedCells && x in this._rows[y].selectedCells);
};
_p._setCellSelected = function (x, y, b) {
    if (b) {
        if (!this._rows[y].selectedCells) this._rows[y].selectedCells = [];
        this._rows[y].selectedCells[x] = true;
    } else {
        if (this._rows[y].selectedCells) delete this._rows[y].selectedCells[x];
    }
};
_p.getCellIsLead = function (x, y) {
    return this._rows[y].leadCell == x;
};
_p._setCellIsLead = function (x, y, b) {
    if (b) this._rows[y].leadCell = x;
    else delete this._rows[y].leadCell;
};
_p.getCellIsAnchor = function (x, y) {
    return this._rows[y].anchorCell == x;
};
_p._setCellIsAnchor = function (x, y, b) {
    if (b) this._rows[y].anchorCell = x;
    else delete this._rows[y].anchorCell;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiTreeViewDataModel.prototype.dispose.call(this);
    this.disposeFields("_dataSet");
};

function BiSingleTree() {
    if (_biInPrototype) return;
    BiTreeView.call(this);
    this._viewManager.dispose();
    this._viewManager = new BiSingleTreeViewManager(this);
    this._rootNode = new BiSingleTreeNode;
    this._rootNode._tree = this;
    this.setDataModel(new BiSingleTreeDataModel(this));
    var sm = this._selectionModel;
    sm.addEventListener("change", this._forwardEvent, this);
    sm.addEventListener("leaditemchange", this._forwardEvent, this);
}
_p = _biExtend(BiSingleTree, BiTreeView, "BiSingleTree");
BiSingleTree._USE_PNG_FILTER = BiBrowserCheck.ie && BiBrowserCheck.versionNumber < 7;
_p._forwardEvent = function (e) {
    this.dispatchEvent(e.getType());
};
BiSingleTree.addProperty("useNativeScrollBars", BiAccessType.READ);
_p.setUseNativeScrollBars = BiAccessType.FUNCTION_EMPTY;
_p.getNodes = function () {
    return this._rootNode._nodes;
};
BiSingleTree.addProperty("indentWidth", BiAccessType.READ_WRITE);
_p._indentWidth = 19;
BiSingleTree.addProperty("showExpandIcon", BiAccessType.READ_WRITE);
_p._showExpandIcon = true;
_p._getIconHtml = function (y) {
    var dm = this._dataModel;
    if (!dm.getHasIcon(0, y)) return "";
    var icon = dm.getIcon(0, y);
    if (BiSingleTree._USE_PNG_FILTER && icon.endsWith("png")) {
        return ['<img alt="" src="', BiImage.BLANK_IMAGE_URI, '" class="icon" style="', "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='", icon, "',sizingMethod='scale');", dm.getIconStyle(0, y), '"/>'].join("");
    }
    return ['<img alt="" src="', icon, '" class="icon" style="', dm.getIconStyle(0, y), '"/>'].join("");
};
_p.getHtmlCode = function (nScrollLeft, nScrollTop, nWidth, nHeight) {
    this._createUpdateCache();
    var uc = this._updateCache;
    var dm = this.getDataModel();
    if (!dm) return "";
    var startRow = uc.startRow;
    var rowCount = uc.rowCount;
    var rowHeight = uc.rowHeight;
    var sb = [];
    var y = startRow;
    var yPos = 0;
    var ieNoBr = uc.ieNoBr;
    var ieNoBrClose = uc.ieNoBrClose;
    var indentProperty = uc.indentProperty;
    var indentWidth;
    var ieExtraPadding = uc.ieExtraPadding;
    var w = this._gridBodyElement.clientWidth;
    while (y < rowCount && yPos < nHeight) {
        var bSelected = dm.getCellSelected(0, y) || dm.getRowSelected(y);
        var bLead = dm.getCellIsLead(0, y) || dm.getRowIsLead(y);
        sb.push("<tr style=\"height:", rowHeight, "px;", dm.getRowStyle(y), "\">");
        indentWidth = dm.getDepth(y) * this._indentWidth + ieExtraPadding;
        sb.push("<td style=\"", (indentWidth ? indentProperty + indentWidth + "px;" : ""), dm.getCellStyle(0, y), "\">", ieNoBr, this.getExpandIconHtml(0, y), this._getIconHtml(y), "<span class=\"" + (bSelected ? "selected" : "") + (bLead ? " lead" : "") + "\">", dm.getCellText(0, y), "</span>", ieNoBrClose, "</td>");
        if (this._getHasAttachedComponent(0, y)) {
            var ac = this._getAttachedComponent(0, y);
            this._attachedComponents[ac.toHashCode()] = {
                col: 0,
                row: y,
                width: w,
                height: rowHeight,
                component: ac
            };
        }
        sb.push("</tr>");
        yPos += rowHeight;
        y++;
    }
    if (yPos < nHeight) {
        sb.push("<tr style=\"height:", (nHeight - yPos), "px;\" class=\"vertical-filler\">");
        sb.push("<td>&nbsp;</td>");
        sb.push("</tr>");
    }
    sb.push("</tbody></table>");
    sb.unshift("<table style=\"table-layout:auto;position:absolute;\" cellspacing=\"0\" class=\"bi-tree-view-table\"><tbody class=\"", (this.getContainsFocus() ? " focused" : ""), "\">");
    return sb.join("");
};
_p._getRowHtml = function (sb, y) {
    this._createUpdateCache();
    var uc = this._updateCache;
    var dm = this.getDataModel();
    var rowHeight = uc.rowHeight;
    var ieExtraPadding = uc.ieExtraPadding;
    var indentProperty = uc.indentProperty;
    var ieNoBr = uc.ieNoBr;
    var ieNoBrClose = uc.ieNoBrClose;
    var indentWidth;
    var bSelected = dm.getCellSelected(0, y) || dm.getRowSelected(y);
    var bLead = dm.getCellIsLead(0, y) || dm.getRowIsLead(y);
    sb.push("<tr style=\"height:", rowHeight, "px;", dm.getRowStyle(y), "\">");
    indentWidth = dm.getDepth(y) * this._indentWidth + ieExtraPadding;
    sb.push("<td style=\"", (indentWidth ? indentProperty + indentWidth + "px;" : ""), dm.getCellStyle(0, y), "\">", ieNoBr, this.getExpandIconHtml(0, y), this._getIconHtml(y), "<span class=\"" + (bSelected ? "selected" : "") + (bLead ? " lead" : "") + "\">", dm.getCellText(0, y), "</span>", ieNoBrClose, "</td>");
    if (this._getHasAttachedComponent(0, y)) {
        var ac = this._getAttachedComponent(0, y);
        this._attachedComponents[ac.toHashCode()] = {
            col: 0,
            row: y,
            width: w,
            height: rowHeight,
            component: ac
        };
    }
    sb.push("</tr>");
};
_p._updateRowSelected = function (y) {
    this._updateCellSelected(0, y);
};
_p._updateCellSelected = function (x, y, bHtml) {
    var dm = this.getDataModel();
    if (this._contentSizeDirty || !this.getCreated() || !dm) return;
    this._resetUpdateCache();
    this._createUpdateCache();
    var uc = this._updateCache;
    var container = this._gridBodyContentElement;
    var startRow = uc.startRow;
    if (startRow > y) return;
    var shownRows = uc.shownRows;
    if (startRow + shownRows < y) return;
    var tr = container.firstChild && container.firstChild.tBodies[0].rows[y - startRow];
    var td, style;
    if (tr) {
        td = tr.cells[0];
        if (td) {
            var bSelected = dm.getCellSelected(x, y) || dm.getRowSelected(y);
            var bLead = dm.getCellIsLead(x, y) || dm.getRowIsLead(y);
            if (bHtml) {
                var txt = dm.getCellText(x, y);
                td.innerHTML = uc.ieNoBr + this.getExpandIconHtml(x, y) + this._getIconHtml(y) + "<span>" + txt + "</span>" + uc.ieNoBrClose;
            }
            var span = BiBrowserCheck.ie ? td.lastChild.lastChild : td.lastChild;
            if (span) span.className = (bSelected ? "selected" : "") + (bLead ? " lead" : "");
            style = dm.getCellStyle(x, y);
            if (style != "") {
                var width = td.style.width;
                var textIndent = td.style.textIndent;
                var paddingLeft = td.style.paddingLeft;
                var paddingRight = td.style.paddingRight;
                td.style.cssText = style;
                td.style.width = width;
                td.style.textIndent = textIndent;
                td.style.paddingLeft = paddingLeft;
                td.style.paddingRight = paddingRight;
            }
            this._updateAttachedComponent(x, y);
        }
    }
    this._resetUpdateCache();
};
_p.getCellInfo = function (nOffsetX, nOffsetY) {
    var vm = this.getViewManager();
    var res = new BiTreeViewCellInfo;
    res._column = 0;
    res._row = vm.getRowAt(nOffsetY);
    return res;
};
_p._onMouseMove = function (e) {
    var vm = this.getViewManager();
    if (!this._useNativeScrollBars) {
        var target = e.getTarget();
        if (this._hScrollBar.contains(target) || this._vScrollBar.contains(target)) {
            return;
        }
    }
    var mouseX = e.getOffsetX();
    var mouseY = e.getOffsetY();
    if (mouseX < this.getClientWidth() && mouseY < this.getClientHeight()) {
        var y = vm.getRowAt(mouseY);
        this._stateManager.setHover(0, y);
    } else this._stateManager.setHover(-1, -1);
};
_p.updateContentSize = function () {
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    if (!this.getCreated()) return;
    if (this._useNativeScrollBars) {
        var rc = dm ? dm.getRowCount() : 0;
        var sh = rc * vm.getRowHeight();
        var cw = this._gridBodyElement.clientWidth;
        var ch = this._gridBodyElement.clientHeight;
        this._trimScrollBarSize = true;
        var table = this._gridBodyContentElement.firstChild;
        this._gridBodyFillerElement.style.width = table ? table.clientWidth : 0;
        this._gridBodyFillerElement.style.height = sh + "px";
        vm.setScrollLeft(this._getInternalScrollLeft());
        vm.setScrollTop(this._getInternalScrollTop());
        this._measure();
        var newCw = this._gridBodyElement.clientWidth;
        var newCh = this._gridBodyElement.clientHeight;
        if (cw != newCw || ch != newCh) {
            this._clientSizeChanged = true;
        }
    } else {
        this._syncScrollBars();
        this._doCustomOverflow();
    }
    this._contentSizeDirty = false;
};
_p._updateGrid = function () {
    if (!this.getCreated()) return;
    BiTreeView.prototype._updateGrid.apply(this, arguments);
    var table = this._gridBodyContentElement.firstChild;
    var scrollLeft = this._useNativeScrollBars ? this._gridBodyElement.scrollLeft : this._hScrollBar.getValue();
    table.style[BiComponent.STRING_LEFT] = -scrollLeft;
    if (this._trimScrollBarSize) {
        this._gridBodyFillerElement.style.width = table.clientWidth;
    } else {
        this._gridBodyFillerElement.style.width = Math.max(table.clientWidth, this._gridBodyFillerElement.offsetWidth);
    } if (this._trimScrollBarSize || (this._gridBodyContentElement.clientHeight == this._gridBodyElement.offsetHeight && this._gridBodyFillerElement.clientWidth > this._gridBodyElement.clientWidth)) {
        delete this._trimScrollBarSize;
        BiTimer.callOnce(function () {
            if (!this.getDisposed()) {
                this._gridBodyContentElement.style.height = this._gridBodyElement.clientHeight + "px";
            }
        }, 0, this);
    }
};
_p.update = function () {
    var sm = this._selectionModel;
    var dm = this._dataModel;
    var oldFireChange = sm._fireChange;
    sm._fireChange = false;
    var is = sm.getSelectedItems();
    var ns = [];
    for (var i = is.length - 1; i >= 0; i--) {
        ns[i] = dm.getNodeAt(is[i].getRow());
    }
    var leadItem = sm.getLeadItem();
    var leadNode = leadItem ? dm.getNodeAt(leadItem.getRow()) : null;
    sm.deselectAll();
    dm.setRootNode(this._rootNode);
    BiTreeView.prototype.update.call(this);
    for (i = ns.length - 1; i >= 0; i--) {
        ns[i].setSelected(true);
    }
    if (leadNode) {
        leadNode.setLead(true);
    }
    sm._fireChange = oldFireChange;
};
_p.addParsedObject = function (o) {
    if (o instanceof BiSingleTreeNode) this.addNode(o);
    else BiTreeView.prototype.addParsedObject.call(this, o);
};
BiSingleTree.addProperty("sortFunction", BiAccessType.READ_WRITE);
_p._sortFunction = function (v1, v2) {
    var d1 = v1.getData();
    var d2 = v2.getData();
    return d1 - d2;
};
_p.sort = function (bAscending) {
    this._dataModel.sort(0, bAscending);
};
_p.addNode = function (oChild, oBefore) {
    this._rootNode.addNode(oChild, oBefore);
};
_p.removeNode = function (oChild) {
    return this._rootNode.removeNode(oChild);
};
_p.removeAll = function () {
    var dm = this.getDataModel();
    dm.dispatchEvent(new BiTreeViewDataModelEvent("beforedatastructurechanged"));
    this._rootNode.removeAll();
    dm.setRootNode(this._rootNode);
    dm.dispatchEvent(new BiTreeViewDataModelEvent("datastructurechanged"));
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiTreeView.prototype.dispose.call(this);
    this._rootNode.dispose();
    this._rootNode._tree = null;
    this._rootNode = null;
};
_p.getDepth = function () {
    return this._rootNode.getDepth();
};
_p.hasNodes = function () {
    return this._rootNode.hasNodes();
};
_p.getFirstNode = function () {
    return this._rootNode.getFirstNode();
};
_p.getLastNode = function () {
    return this._rootNode.getLastNode();
};
_p.getSelectedNode = function () {
    var sm = this._selectionModel;
    var is = sm.getSelectedItems();
    return is.length ? this._dataModel.getNodeAt(is[0].getRow()) : null;
};
_p.getRowForNode = function (oNode) {
    var dm = this._dataModel;
    var l = dm.getRowCount();
    if (this._rowHash) {
        var r = this._rowHash[BiObject.toHashCode(oNode)];
        if (r != null && r < l && dm.getNodeAt(r) == oNode) return r;
    }
    this._rowHash = {};
    for (var i = 0; i < l; i++) this._rowHash[BiObject.toHashCode(dm.getNodeAt(i))] = i;
    var y = this._rowHash[BiObject.toHashCode(oNode)];
    return y >= 0 ? y : -1;
};
_p.getNodeAt = function (y) {
    return this._dataModel.getNodeAt(y);
};
_p.getNodeAtPoint = function (x, y) {
    var cx = this.getClientLeft();
    if (x < cx || x > cx + this.getClientWidth()) return null;
    var row = this._viewManager.getRowAt(y - this.getClientTop());
    return row >= 0 && row < this._dataModel.getRowCount() ? this.getNodeAt(row) : null;
};
_p.containsNode = function (oNode) {
    return this._rootNode.containsNode(oNode);
};

function BiSingleTreeNode(oData) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._nodes = [];
    if (oData != null) this.setData(oData);
}
_p = _biExtend(BiSingleTreeNode, BiObject, "BiSingleTreeNode");
_p._selected = false;
BiSingleTreeNode.addProperty("icon", BiAccessType.READ_WRITE);
BiSingleTreeNode.addProperty("expandedIcon", BiAccessType.READ_WRITE);
_p._getIcon = function () {
    return (this._expanded ? this._expandedIcon : null) || this._icon;
};
BiSingleTreeNode.addProperty("data", BiAccessType.READ_WRITE);
BiSingleTreeNode.addProperty("parentNode", BiAccessType.READ);
_p.getTree = function () {
    for (var t = this; t != null; t = t.getParentNode()) {
        if (t._tree) return t._tree;
    };
    return null;
};
BiSingleTreeNode.addProperty("expanded", BiAccessType.READ);
_p._expanded = true;
_p.setExpanded = function (b, bNoUpdate) {
    if (this._expanded != b) {
        this._expanded = b;
        if (!bNoUpdate) {
            var t = this.getTree();
            if (!t) return;
            var p = this._parentNode;
            var visible = true;
            while (p && visible) {
                if (!p.getExpanded()) visible = false;
                p = p._parentNode;
            }
            if (visible) {
                var y = t.getRowForNode(this);
                if (y >= 0) t.__expand(0, y, b);
            }
        }
    }
};
BiSingleTreeNode.addProperty("nodes", BiAccessType.READ);
_p.addNode = function (oChild, oBefore) {
    var p = oChild._parentNode;
    if (oBefore == null) {
        if (p != null) p.removeNode(oChild);
        this._nodes.push(oChild);
    } else {
        if (oBefore._parentNode != this) throw new Error("Can only add components before siblings");
        if (p != null) p.removeNode(oChild);
        this._nodes.insertBefore(oChild, oBefore);
    }
    oChild._parentNode = this;
};
_p.removeNode = function (oChild) {
    if (oChild._parentNode != this) throw new Error("Can only remove children");
    this._nodes.remove(oChild);
    oChild._parentNode = null;
    return oChild;
};
_p.removeAll = function () {
    for (var i = this._nodes.length - 1; i >= 0; i--) {
        var n = this._nodes[i];
        n.dispose();
    }
    this._nodes.length = 0;
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiObject.prototype.dispose.call(this);
    this.disposeFields("_nodes");
    this._parentNode = null;
};
_p.getSelected = function () {
    var t = this.getTree();
    if (!t) return false;
    var sm = t.getSelectionModel();
    var is = sm.getSelectedItems();
    for (var i = 0; i < is.length; i++) {
        if (t.getNodeAt(is[i].getRow()) == this) {
            return true;
        }
    }
    return false;
};
_p.setSelected = function (bSelected) {
    var t = this.getTree();
    if (!t) return false;
    if (bSelected) this.reveal();
    var sm = t.getSelectionModel();
    var y = t.getRowForNode(this);
    if (y >= 0) {
        sm.setItemSelected(new BiTreeViewSelectionModelItem(0, y), bSelected);
        if (bSelected && !sm.getMultipleSelection()) {
            sm.setLeadItem(new BiTreeViewSelectionModelItem(0, y));
        }
    }
};
_p.getLead = function () {
    var t = this.getTree();
    if (!t) return false;
    var sm = t.getSelectionModel();
    var li = sm.getLeadItem();
    return t.getNodeAt(li.getRow()) == this;
};
_p.setLead = function (b) {
    var t = this.getTree();
    if (!t) return false;
    if (this.getLead() == b) return;
    var sm = t.getSelectionModel();
    if (b) {
        this.reveal();
        sm.setLeadItem(new BiTreeViewSelectionModelItem(0, t.getRowForNode(this)));
    } else {
        sm.setLeadItem(null);
    }
};
_p.getLabelHtml = function () {
    return String(this._data);
};
_p.addXmlNode = function (oNode, oParser) {
    if (oNode.nodeType == 3) {
        this.setData((this.getData() || "") + oNode.nodeValue);
    }
    if (oNode.nodeType == 1) {
        var xhtmlNs = "http://www.w3.org/1999/xhtml";
        var ns = oNode.namespaceURI;
        if (ns == xhtmlNs) {
            var prefix = oNode.prefix;
            var s = oNode.xml.replace(new RegExp("<" + prefix + ":", "g"), "<").replace(new RegExp("</" + prefix + ":", "g"), "</");
            this.setData((this.getData() || "") + s);
        } else BiObject.prototype.addXmlNode.call(this, oNode, oParser);
    }
};
_p.addParsedObject = function (o) {
    if (o instanceof BiSingleTreeNode) this.addNode(o);
    else BiObject.prototype.addParsedObject.call(this, o);
};
_p.getNextSiblingNode = function () {
    var p = this._parentNode;
    if (p == null) return null;
    var i = p._nodes.indexOf(this);
    return i >= 0 ? p._nodes[i + 1] : null;
};
_p.getPreviousSiblingNode = function () {
    var p = this._parentNode;
    if (p == null) return null;
    var i = p._nodes.indexOf(this);
    return i > 0 ? p._nodes[i - 1] : null;
};
_p.getLevel = function () {
    if (this._parentNode) return this._parentNode.getLevel() + 1;
    return 0;
};
_p.getDepth = function () {
    var d = 0;
    var cs = this._nodes;
    var l = cs.length;
    for (var i = 0; i < l; i++) d = Math.max(d, cs[i].getDepth() + 1);
    return d;
};
_p.isLeaf = function () {
    return !this.hasNodes();
};
_p.isLastSiblingNode = function () {
    return this._parentNode && this == this._parentNode.getLastNode();
};
_p.hasNodes = function () {
    return this._nodes.length > 0;
};
_p.getFirstNode = function () {
    return this._nodes[0];
};
_p.getLastNode = function () {
    return this._nodes[this._nodes.length - 1];
};
_p.reveal = function (bNoUpdate) {
    var p = this._parentNode;
    while (p) {
        if (!p.getExpanded()) break;
        p = p._parentNode;
    }
    if (!p) return;
    p = this._parentNode;
    if (p) {
        p.setExpanded(true, bNoUpdate);
        p.reveal(bNoUpdate);
    }
};
_p.containsNode = function (oNode) {
    var node = oNode;
    while (node) {
        if (node == this) return true;
        node = node.getParentNode();
    }
    return false;
};

function BiSingleTreeDataModel(oTree) {
    if (_biInPrototype) return;
    BiTreeDataModel.call(this, oTree ? oTree._rootNode : null);
    this._treeView = oTree;
}
_p = _biExtend(BiSingleTreeDataModel, BiTreeDataModel, "BiSingleTreeDataModel");
BiSingleTreeDataModel.addProperty("treeView", BiAccessType.READ);
_p.setTreeView = function (oTree) {
    if (this._treeView != oTree) {
        this._treeView = oTree;
        this.setRootNode(oTree._rootNode);
    }
};
_p.getColumnCount = function () {
    return 1;
};
_p.getCellText = function (x, y) {
    return this.getNodeAt(y).getLabelHtml();
};
_p.getSortFunction = function (x) {
    return this._treeView.getSortFunction();
};
_p.getHasIcon = function (x, y) {
    return true;
};
_p.getIcon = function (x, y) {
    var n = this.getNodeAt(y);
    var icon = n._getIcon();
    if (icon) return icon;
    var srcId;
    if (this.getHasChildren(y)) {
        if (this.getExpanded(y)) srcId = "open-folder-icon";
        else srcId = "folder-icon";
    } else {
        srcId = "file-icon";
    }
    return application.getTheme().getAppearanceProperty("tree-view", srcId);
};
_p.getNodeChildren = function (oNode) {
    return oNode.getNodes();
};
_p.getHasChildren = function (y) {
    return this.getNodeAt(y).hasNodes();
};
_p._setNodeExpanded = function (oNode, b) {
    oNode._expanded = b;
};
_p._getNodeExpanded = function (oNode) {
    return oNode._expanded;
};

function BiSingleTreeViewManager(oTreeView) {
    if (_biInPrototype) return;
    BiTreeViewViewManager.call(this, oTreeView);
}
_p = _biExtend(BiSingleTreeViewManager, BiTreeViewViewManager, "BiSingleTreeViewManager");
_p.getColumnCount = function () {
    return 1;
};
_p.getColumnWidth = _p.setColumnWidth = _p.getShowHeaders = _p.getShowRowHeaders = _p.setColumnOrders = _p.getShowGridLines = _p.scrollColumnIntoView = _p.setColumnVisible = _p.getCanResizeColumn = _p.getCanMoveColumn = _p.setScrollLeft = _p._getRightToLeft = BiAccessType.FUNCTION_EMPTY;
_p.getNextColumn = _p.getPreviousColumn = function () {
    return null;
};
_p.getIndentColumn = _p._getLastVisibleColumn = _p._getFirstVisibleColumn = _p.getFirstVisibleColumn = function () {
    return 0;
};
_p.getColumnVisible = function (x) {
    return x == 0;
};
_p.getShowExpandIcon = function () {
    return this._treeView.getShowExpandIcon();
};