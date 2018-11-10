/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiGridHeaders() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._columnWidths = [];
    this._columnOrders = [];
    this._invertedColumnOrders = [];
    this.setCssClassName("bi-tree-headers");
    this.setTop(0);
    this.setSize(296, 18);
    this._resizeHandle = new BiResizeHandle;
    this._moveHandle = new BiMoveHandle;
    this._moveHandle.setMoveDirection("horizontal");
    this._resizeHandle.addEventListener("beforeresize", this._onBeforeResizeHandleResize, this);
    this._resizeHandle.addEventListener("resize", this._onResizeHandleResize, this);
    this._resizeHandle.addEventListener("resizeend", this._onResizeHandleResizeEnd, this);
    this._moveHandle.addEventListener("moveend", this._onMoveHandleMoveEnd, this);
    this._moveHandle.addEventListener("move", this._onMoveHandleMove, this);
    this._filler = new this._gridHeaderFillerConstructor;
    this.add(this._filler);
}
_p = _biExtend(BiGridHeaders, BiComponent, "BiGridHeaders");
_p._gridHeaderFillerConstructor = BiGridHeaderFiller;
_p._gridHeaderConstructor = BiGridHeader;
_p._sortColumn = -1;
_p._ascending = null;
_p._columnCount = 0;
_p._fitColumnWidths = false;
BiGridHeaders.addProperty("fitColumnWidths", BiAccessType.READ);
_p.setFitColumnWidths = function (b) {
    if (this._fitColumnWidths != b) {
        this._fitColumnWidths = b;
        if (this.getCreated()) this.layoutAllChildren();
    }
};
BiGridHeaders.addProperty("filler", BiAccessType.READ);
_p.layoutAllChildren = function () {
    if (this._fitColumnWidths) this._distributeColumns();
    var l = Math.min(this._columnCount, this._children.length);
    var sum = 0;
    var j;
    for (var i = 0; i < l; i++) {
        j = this._columnOrders[i];
        if (this._children[j].getVisible()) sum += this._columnWidths[j];
    }
    var fillerWidth = this.getCreated() ? this.getClientWidth() - sum : 0;
    if (this.getRightToLeft()) {
        this._filler.setLeft(0);
        this._filler.setWidth(fillerWidth);
        var x = fillerWidth;
        for (i = l - 1; i >= 0; i--) {
            j = this._columnOrders[i];
            if (this._children[j].getVisible()) {
                this._children[j].setLeft(x);
                this._children[j].setWidth(this._columnWidths[j]);
                x += this._columnWidths[j];
            }
        }
    } else {
        x = 0;
        for (i = 0; i < l; i++) {
            j = this._columnOrders[i];
            if (this._children[j].getVisible()) {
                this._children[j].setLeft(x);
                this._children[j].setWidth(this._columnWidths[j]);
                x += this._columnWidths[j];
            }
        }
        this._filler.setLeft(x);
        if (this.getCreated()) {
            this._filler.setWidth(fillerWidth);
        }
    }
    BiComponent.prototype.layoutAllChildren.call(this);
};
_p._distributeColumns = function () {
    var cs = this._children;
    var sBefore = this._columnWidths.join("-");
    var l = Math.min(this._columnCount, cs.length);
    var j, mw, i;
    var sum = 0;
    var minSum = 0;
    var availWidth = this.getClientWidth();
    for (i = 0; i < l; i++) {
        j = this._columnOrders[i];
        if (cs[j].getVisible()) {
            mw = cs[j].getMinimumWidth();
            availWidth -= mw;
            sum += this._columnWidths[j] - mw;
            minSum += mw;
        }
    }
    if (availWidth < 0) availWidth = 0;
    if (sum <= 0) sum = minSum;
    var w, nSum = 0;
    for (i = 0; i < l; i++) {
        if (cs[i].getVisible()) {
            w = this._columnWidths[i];
            mw = cs[i].getMinimumWidth();
            this._columnWidths[i] = mw + Math.round((w - mw) / sum * availWidth);
            nSum += this._columnWidths[i];
        }
    }
    if (nSum > 0 && this.getClientWidth() > nSum && this._parent && this._parent.getFitColumnWidths && this._parent.getFitColumnWidths()) {
        var nSuggestedWidth = Math.floor(this.getClientWidth() / l);
        var nRemainingWidth = this.getClientWidth() % l;
        for (i = 0; i < l; i++) {
            if (cs[i].getVisible()) {
                this._columnWidths[i] = nSuggestedWidth;
                if (i == l - 1) this._columnWidths[i] += nRemainingWidth;
            }
        }
    }
    var sAfter = this._columnWidths.join("-");
    if (sAfter != sBefore) this.dispatchEvent("columnwidthschanged");
};
_p.add = function (oChild, oBefore) {
    if (oBefore == null && oChild != this._filler) oBefore = this._filler;
    BiComponent.prototype.add.call(this, oChild, oBefore);
    if (oChild instanceof BiGridHeader && !(oChild instanceof BiGridHeaderFiller)) {
        oChild._columnIndex = this._children.indexOf(oChild);
    }
};
_p.remove = function (oChild) {
    BiComponent.prototype.remove.call(this, oChild);
    if (oChild instanceof BiGridHeader && !oChild instanceof BiGridHeaderFiller) {
        delete oChild._columnIndex;
    }
};
BiGridHeaders.addProperty("columnCount", BiAccessType.READ_WRITE);
BiGridHeaders.addProperty("columnWidths", BiAccessType.READ);
_p.setColumnWidths = function (aWidths) {
    var sBefore = this._columnWidths.join("-");
    this._columnWidths = aWidths;
    for (var i = 0; i < aWidths.length; i++) this._columnWidths[i] = Number(aWidths[i]);
    var sAfter = this._columnWidths.join("-");
    if (sAfter != sBefore) {
        this.invalidateLayout();
        this.dispatchEvent("columnwidthschanged");
    }
};
BiGridHeaders.addProperty("columnOrders", BiAccessType.READ);
_p.setColumnOrders = function (aOrders) {
    var sBefore = this._columnOrders.join("-");
    this._columnOrders = aOrders;
    this._invertedColumnOrders = new Array(aOrders.length);
    for (var i = 0; i < aOrders.length; i++) {
        this._columnOrders[i] = Number(aOrders[i]);
        this._invertedColumnOrders[aOrders[i]] = i;
    }
    var sAfter = this._columnOrders.join("-");
    if (sAfter != sBefore) this.dispatchEvent("columnorderschanged");
};
BiGridHeaders.addProperty("sortColumn", BiAccessType.READ);
_p.setSortColumn = function (n) {
    if (this._sortColumn != n) {
        if (this._sortColumn != -1) this._children[this._sortColumn].setAscending(null);
        this._sortColumn = n;
        if (n != -1) this._children[this._sortColumn].setAscending(this._ascending);
        this.dispatchEvent("sortcolumnchanged");
    }
};
BiGridHeaders.addProperty("ascending", BiAccessType.READ);
_p.setAscending = function (b) {
    if (this._ascending != b) {
        this._ascending = b;
        if (this._children[this._sortColumn]) this._children[this._sortColumn].setAscending(this._ascending);
        this.dispatchEvent("ascendingchanged");
    }
};
_p._onBeforeResizeHandleResize = function (e) {
    this._beforeWidth = e.getTarget().getHandleFor().getWidth();
};
_p._onResizeHandleResize = function (e) {
    if (this._fitColumnWidths) {
        var current = e.getTarget().getHandleFor();
        var visualIndex = this._invertedColumnOrders[current._columnIndex];
        var nextIndex = this._columnOrders[visualIndex + 1];
        var next = this._children[nextIndex];
        if (next) {
            var delta = current.getWidth() - this._beforeWidth;
            var mw = next.getMinimumWidth();
            var w = Math.max(mw, next.getWidth() - delta);
            next.setWidth(w);
            if (w == mw) current.setWidth(this._beforeWidth);
        }
    }
    var l = Math.min(this._columnWidths.length, this._children.length);
    for (var i = 0; i < l; i++) {
        this._columnWidths[i] = this._children[i].getWidth();
    }
    this._columnResized = true;
    this.layoutAllChildren();
    this.dispatchEvent("columnwidthschanging");
};
_p._onResizeHandleResizeEnd = function (e) {
    var sAfter = this._columnWidths.join("-");
    if (this._beforeColumnWidths != sAfter) {
        delete this._beforeColumnWidths;
        this.dispatchEvent("columnwidthschanged");
    }
};
_p._onMoveHandleMove = function (e) {
    if (Math.abs(this._moveHeader.getLeft() - this._currentDragHeader.getLeft()) > 5) {
        this._moveHeader.setVisible(true);
        this._headerDropMarker.setVisible(true);
        this._columnDragged = true;
    }
    var left = BiMouseEvent.getClientX() - this.getClientLeft() - this.getInsetLeft() + this.getScrollLeft();
    if (left < 0) return;
    var x = 0;
    var l = this._columnWidths.length;
    var i = 0;
    var j;
    for (; i < l; i++) {
        j = this._columnOrders[i];
        if (this._children[j].getVisible()) {
            if (left >= x - (this._columnWidths[this._columnOrders[i - 1]] || 0) / 2 && left <= x + this._columnWidths[j] / 2) break;
            x += this._columnWidths[j];
        }
    }
    this._headerDropMarker.setLeft(x - 1);
    this._headerDropMarker._dropIndex = i;
};
_p._onMoveHandleMoveEnd = function (e) {
    var dropIndex = this._headerDropMarker._dropIndex;
    this._moveHandle.setHandleFor(null);
    this.remove(this._moveHeader);
    this._moveHeader.dispose();
    this._moveHeader = null;
    this.remove(this._headerDropMarker);
    this._headerDropMarker.dispose();
    this._headerDropMarker = null;
    if (typeof dropIndex == "number") {
        var colIndex = this._currentDragHeader._columnIndex;
        var visIndex = this._invertedColumnOrders[colIndex];
        if (visIndex == dropIndex || visIndex + 1 == dropIndex) {} else {
            var tmp;
            if (dropIndex < visIndex) {
                tmp = this._columnOrders.copy();
                tmp.remove(colIndex);
                tmp.insertAt(colIndex, dropIndex);
                this.setColumnOrders(tmp);
            } else {
                tmp = this._columnOrders.copy();
                tmp.remove(colIndex);
                tmp.insertAt(colIndex, dropIndex - 1);
                this.setColumnOrders(tmp);
            }
            this.layoutAllChildren();
        }
    }
    if (this._currentDragHeader) {
        this._currentDragHeader._setDownState(false);
        this._currentDragHeader = null;
    }
};
_p._startDrag = function (oSrc, e) {
    this._columnResized = false;
    this._columnDragged = false;
    this._currentDragHeader = oSrc;
    this._moveHeader = new this._gridHeaderConstructor;
    var tm = application.getThemeManager();
    tm.setStateValue(this._moveHeader, "active", true);
    tm.applyAppearance(this._moveHeader);
    this._moveHeader.setVisible(false);
    this._moveHeader.setOpacity(0.7);
    this._moveHeader.setText(oSrc.getText());
    this._moveHeader.setAscending(oSrc.getAscending());
    this._moveHeader.setLeft(oSrc.getLeft());
    this._moveHeader.setWidth(oSrc.getWidth());
    this._moveHeader.setZIndex(1);
    this.add(this._moveHeader);
    this._headerDropMarker = new BiComponent;
    this._headerDropMarker.setVisible(false);
    this._headerDropMarker.setBackColor("blue");
    this._headerDropMarker.setWidth(2);
    this._headerDropMarker.setTop(0);
    this._headerDropMarker.setBottom(0);
    this._headerDropMarker.setZIndex(1);
    this.add(this._headerDropMarker, this._moveHeader);
    this._moveHandle.setHandleFor(this._moveHeader);
    this._moveHandle.startMove(e);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._resizeHandle.dispose();
    this._moveHandle.dispose();
    this._filler.dispose();
    if (this._moveHeader) this._moveHeader.dispose();
    if (this._headerDropMarker) this._headerDropMarker.dispose();
    this._resizeHandle = null;
    this._moveHandle = null;
    this._filler = null;
    this._moveHeader = null;
    this._headerDropMarker = null;
    this._currentDragHeader = null;
};

function BiGridHeader(sText) {
    if (_biInPrototype) return;
    BiLabel.call(this, sText);
    this.setCssClassName("bi-grid-header");
    this.setAppearance("grid-header");
    this.setIconPosition("right");
    this.setTop(0);
    this.setBottom(0);
    this.addEventListener("mousedown", this._onMouseDown);
    this.addEventListener("mouseup", this._onMouseUp);
    this.addEventListener("mousemove", this._onMouseMove);
}
_p = _biExtend(BiGridHeader, BiLabel, "BiGridHeader");
_p._minimumWidth = 20;
_p._ascending = null;
_p._resizable = true;
_p._sortable = true;
_p._movable = true;
BiGridHeader.addProperty("resizable", BiAccessType.READ_WRITE);
BiGridHeader.addProperty("sortable", BiAccessType.READ_WRITE);
BiGridHeader.addProperty("movable", BiAccessType.READ_WRITE);
BiGridHeader.addProperty("columnIndex", BiAccessType.READ);
BiGridHeader.addProperty("ascending", BiAccessType.READ);
_p.setAscending = function (b) {
    this._ascending = b;
    if (b == null) this.setIcon(null);
    else if (b) this.setIcon(this.getAscendingIcon());
    else this.setIcon(this.getDescendingIcon());
};
BiGridHeader.addProperty("ascendingIcon", BiAccessType.WRITE);
_p.getAscendingIcon = function () {
    if (this._ascendingIcon != null) return this._ascendingIcon;
    return new BiImage(application.getTheme().getAppearanceProperty("grid", "ascending-icon"));
};
BiGridHeader.addProperty("descendingIcon", BiAccessType.WRITE);
_p.getDescendingIcon = function () {
    if (this._descendingIcon != null) return this._descendingIcon;
    return new BiImage(application.getTheme().getAppearanceProperty("grid", "descending-icon"));
};
_p._onMouseDown = function (e) {
    if (e.getButton() != BiMouseEvent.LEFT) return;
    if (this._resizeDir != "" && this._resizeDir != null) {
        var p = this._parent;
        if (this._resizeDir == "e") {
            p._resizeHandle.setHandleFor(this);
        } else {
            var visualIndex = p._invertedColumnOrders[this._columnIndex];
            var previousIndex = p._columnOrders[visualIndex - 1];
            p._resizeHandle.setHandleFor(p._children[previousIndex]);
        }
        p._columnResized = false;
        p._columnDragged = false;
        p._beforeColumnWidths = p._columnWidths.join("-");
        p._resizeHandle.startResize("e", e);
    } else {
        if (this._sortable) this._setDownState(true);
        if (this._movable) {
            this.setCursor("");
            this._parent._startDrag(this, e);
        }
    }
};
_p._setDownState = function (b) {
    var tm = application.getThemeManager();
    tm.setStateValue(this, "active", b);
    tm.applyAppearance(this);
};
_p._onMouseUp = function (e) {
    if (e.getButton() != BiMouseEvent.LEFT) return;
    if (this._parent._currentDragHeader && this != this._parent._currentDragHeader) {
        this._parent._currentDragHeader._onMouseUp(e);
        return;
    }
    if (this._resizeDir) return;
    if (this._sortable) {
        this._setDownState(false);
    }
    if (!this._parent._columnDragged && !this._parent._columnResized && this._sortable) {
        var oldAscending = this._ascending;
        var newAscending = oldAscending == null ? true : !oldAscending;
        if (this._parent.getSortColumn() == this._columnIndex) this._parent.setAscending(newAscending);
        else {
            this._parent._ascending = newAscending;
            this._parent.setSortColumn(this._columnIndex);
        }
    }
};
_p._onMouseMove = function (e) {
    var p = this.getParent();
    var visualIndex = p._invertedColumnOrders[this._columnIndex];
    var previousIndex = p._columnOrders[visualIndex - 1];
    var ps = p._children[previousIndex];
    if (!this._resizable && (ps == null || !ps._resizable)) return;
    if (p._currentDragHeader) this._resizeDir = "";
    else if (e.getOffsetX() <= 8 && ps) this._resizeDir = "w";
    else if (e.getOffsetX() + 8 >= this.getWidth()) this._resizeDir = "e";
    else this._resizeDir = ""; if (this._resizeDir != "") {
        if (BiBrowserCheck.ie && BiBrowserCheck.version == 5.5) this.setCursor("hand");
        else if (BiBrowserCheck.ie) this.setCursor("col-resize");
        else this.setCursor("e-resize");
    } else this.setCursor("");
};

function BiGridHeaderFiller() {
    if (_biInPrototype) return;
    BiGridHeader.call(this);
};
_p = _biExtend(BiGridHeaderFiller, BiGridHeader, "BiGridHeaderFiller");
_p._sortable = false;
_p._resizable = false;
_p._movable = false;

function BiGridHeaderCorner() {
    if (_biInPrototype) return;
    BiGridHeader.call(this);
    this.setLocation(0, 0);
    this.setRight(null);
    this.setBottom(null);
}
_p = _biExtend(BiGridHeaderCorner, BiGridHeader, "BiGridHeaderCorner");
_p._sortable = false;
_p._resizable = false;
_p._movable = false;

function BiGridRowHeaders() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-grid-row-headers");
}
_p = _biExtend(BiGridRowHeaders, BiComponent, "BiGridRowHeaders");
_p._setHeadersHtml = function (s) {
    if (this.getCreated()) {
        this._element.innerHTML = s + '<div class="bi-grid-row-header-filler grid-header"></div>';
    }
};

function BiAbstractGrid() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setTabIndex(1);
    this.setHideFocus(true);
    this._rows = [];
    this._nodes = this._rows;
    this._gridElements = {};
    this._columns = [];
    this._columnOrders = [];
    this._invertedColumnOrders = [];
    this._columnWidths = [];
    this._columnNames = [];
    this._columnAligns = [];
    this._columnSortTypes = [];
    this.setSize(300, 300);
    application.getThemeManager().addEventListener("themechanged", this.update, this);
}
_p = _biExtend(BiAbstractGrid, BiComponent, "BiAbstractGrid");
_p._gridHeadersConstructor = BiGridHeaders;
_p._gridColumnConstructor = BiGridColumn;
_p._lastKeyPress = 0;
_p._accumulatedKeys = "";
_p._columnCount = 0;
_p._columns = null;
_p._columnOrders = null;
_p._invertedColumnOrders = null;
_p._columnWidths = null;
_p._columnNames = null;
_p._columnAligns = null;
_p._columnSortTypes = null;
_p._iconColumn = -1;
_p._showHeaders = true;
_p._showRowHeaders = false;
_p._liveResize = false;
_p._sortColumn = -1;
_p._ascending = null;
_p._selectionModel = null;
_p._allNodes = null;
_p._gridCreated = false;
_p._rowHeight = 19;
_p._fontSize = 11;
_p._rowHeadersWidth = 30;
_p._headersHeight = 19;
_p._overflowX = "auto";
_p._overflowY = "auto";
_p._allowInlineFind = true;
BiAbstractGrid.addProperty("fontSize", BiAccessType.READ_WRITE);
BiAbstractGrid.addProperty("allowInlineFind", BiAccessType.READ_WRITE);
BiAbstractGrid.addProperty("columns", BiAccessType.READ);
BiAbstractGrid.addProperty("showRowHeaders", BiAccessType.READ_WRITE);
BiAbstractGrid.addProperty("rowHeadersWidth", BiAccessType.READ_WRITE);
BiAbstractGrid.addProperty("sortColumn", BiAccessType.READ);
BiAbstractGrid.addProperty("ascending", BiAccessType.READ);
BiAbstractGrid.addProperty("rowHeight", BiAccessType.READ);
_p.setRowHeight = function (rowHeight) {
    this._rowHeight = rowHeight;
    this.updateColumns();
};
BiAbstractGrid.addProperty("headers", BiAccessType.READ);
_p._getFillerHeight = function () {
    return this._showHeaders ? this._headersHeight : 0;
};
_p._getFillerWidth = function () {
    return this._showRowHeaders ? this._rowHeadersWidth : 0;
};
_p._getScrollWidth = function () {
    var l = Math.min(this._columnCount, this._headers._children.length);
    var sum = 0;
    var j;
    for (var i = 0; i < l; i++) {
        j = this._headers._columnOrders[i];
        if (this._headers._children[j].getVisible()) sum += this._columnWidths[j];
    }
    return sum;
};
_p._getScrollHeight = function () {
    if (this.getCreated()) return this._gridBodyElement.scrollHeight;
    else return 0;
};
_p.layoutAllChildren = function () {
    this._layoutHeaders();
    BiComponent.prototype.layoutAllChildren.call(this);
};
BiAbstractGrid.addProperty("columnCount", BiAccessType.READ);
_p.setColumnCount = function (n) {
    var i;
    if (this._columnCount > n) {
        for (i = n; i < this._columnCount; i++) {
            this._headers.remove(this._columns[i].getHeader());
            this._columns[i].dispose();
        }
        this._columns = this._columns.slice(0, n);
    } else {
        for (i = this._columnCount; i < n; i++) {
            var c = this._columns[i] = new this._gridColumnConstructor(this._columnNames[i]);
            c._columnIndex = i;
            c._orderIndex = i;
            c._grid = this;
            c.setAlign(this._columnAligns[i]);
            this._headers.add(c.getHeader());
        }
        this.setColumnOrders(BiAbstractGrid._expandArray2(this._columnOrders, n, Number));
        this.setColumnWidths(BiAbstractGrid._expandArray(this._columnWidths, n, 100, Number));
        this.setColumnNames(BiAbstractGrid._expandArray(this._columnNames, n, "Untitled", String));
        this.setColumnAligns(BiAbstractGrid._expandArray(this._columnAligns, n, "left", String));
        this.setColumnSortTypes(BiAbstractGrid._expandArray(this._columnSortTypes, n, "string", String));
    }
    this._columnCount = n;
    this._headers.setColumnCount(n);
};
BiAbstractGrid._expandArray = function (a, n, v, f) {
    for (var i = a.length; i < n; i++) a[i] = f(v);
    return a;
};
BiAbstractGrid._expandArray2 = function (a, n, f) {
    for (var i = a.length; i < n; i++) a[i] = f(i);
    return a;
};
BiAbstractGrid.addProperty("columnWidths", BiAccessType.READ);
_p.setColumnWidths = function (aWidths) {
    this._columnWidths = aWidths;
    for (var i = 0; i < this._columnCount; i++) {
        this._columns[i].setWidth(aWidths[i]);
    }
    this._headers.setColumnWidths(aWidths);
};
_p.getColumnWidth = function (x) {
    return this._columns[x].getWidth();
};
BiAbstractGrid.addProperty("columnOrders", BiAccessType.READ);
_p.setColumnOrders = function (aOrderIndexes) {
    var i;
    this._columnOrders = aOrderIndexes;
    for (i = 0; i < this._columnCount; i++) {
        this._columns[aOrderIndexes[i]]._orderIndex = i;
    }
    this._invertedColumnOrders = new Array(aOrderIndexes.length);
    for (i = 0; i < aOrderIndexes.length; i++) {
        this._invertedColumnOrders[aOrderIndexes[i]] = i;
    }
    this._headers.setColumnOrders(aOrderIndexes);
};
_p.getColumnOrder = function (x) {
    return this._columns[x].getOrderIndex();
};
BiAbstractGrid.addProperty("columnAligns", BiAccessType.READ);
_p.setColumnAligns = function (aAligns) {
    this._columnAligns = aAligns;
    for (var i = 0; i < this._columnCount; i++) {
        this._columns[i].setAlign(aAligns[i]);
    }
};
_p.getColumnAlign = function (x) {
    return this._columns[x].getAlign();
};
BiAbstractGrid.addProperty("columnNames", BiAccessType.READ);
_p.setColumnNames = function (aNames) {
    this._columnNames = aNames;
    for (var i = 0; i < this._columnCount; i++) {
        this._columns[i].setName(aNames[i]);
    }
};
_p.getColumnName = function (x) {
    return this._columns[x].getName();
};
BiAbstractGrid.addProperty("columnSortTypes", BiAccessType.READ);
_p.setColumnSortTypes = function (aSortTypes) {
    this._columnSortTypes = aSortTypes;
    for (var i = 0; i < this._columnCount; i++) {
        this._columns[i].setSortType(aSortTypes[i]);
    }
};
_p.getColumnSortType = function (x) {
    return this._columns[x].getSortType();
};
BiAbstractGrid.addProperty("iconColumn", BiAccessType.READ);
_p.setIconColumn = function (n) {
    var cs = this._columns;
    var col0 = cs[this._iconColumn];
    if (col0) col0._iconColumn = false;
    this._iconColumn = n;
    var coln = cs[n];
    if (coln) coln._iconColumn = true;
};
_p.setFitColumnWidths = function (b) {
    this._headers.setFitColumnWidths(b);
    this.setOverflowX(b ? "hidden" : "auto");
};
_p.getFitColumnWidths = function () {
    return this._headers.getFitColumnWidths();
};
BiAbstractGrid.addProperty("liveResize", BiAccessType.READ);
_p.setLiveResize = function (b) {
    if (this._liveResize != b) {
        if (b) this._headers.addEventListener("columnwidthschanging", this.updateColumns, this);
        else this._headers.removeEventListener("columnwidthschanging", this.updateColumns, this);
        this._liveResize = b;
    }
};
BiAbstractGrid.addProperty("showHeaders", BiAccessType.READ_WRITE);
_p.setShowHeaders = function (b) {
    if (this._showHeaders != b) {
        this._showHeaders = b;
        this._headers.setVisible(b);
        if (this._headerCorner) this._headerCorner.setVisible(this.getShowHeaders() && this.getShowRowHeaders());
        if (this.getCreated()) this._gridBodyElement.style.paddingTop = this._getFillerHeight() + "px";
        if (this._rowHeaders) {
            this._rowHeaders.setTop(this._getFillerHeight());
            this._updateRowHeadersHeight();
        }
        if (b) this.updateHeadersWidth();
    }
};
BiAbstractGrid.addProperty("headersHeight", BiAccessType.READ_WRITE);
_p.setHeadersHeight = function (n) {
    if (this._headersHeight != n) {
        this._headersHeight = n;
        this._headers.setHeight(n);
        var corner = this._headerCorner;
        if (corner) corner.setHeight(n);
        if (this.getCreated()) this._gridBodyElement.style.paddingTop = this._getFillerHeight() + "px";
        var rh = this._rowHeaders;
        if (rh) {
            rh.setTop(this._getFillerHeight());
            this._updateRowHeadersHeight();
        }
    }
};
_p.update = function () {
    this.updateColumns();
    this.updateData();
};
_p.updateColumns = function () {
    if (this.getCreated()) {
        var rs = this._getStyleRules();
        if (BiBrowserCheck.ie) this._styleSheet.cssText = rs.join(BiString.EMPTY);
        else {
            this._removeStyleRules();
            for (var i = 0; i < rs.length; i++) this._styleSheet.insertRule(rs[i], i);
        }
        this.updateHeadersWidth();
    }
};
_p._removeStyleRules = function () {
    var ss = this._styleSheet;
    if (!ss) return;
    if (BiBrowserCheck.ie) ss.cssText = "";
    else
        for (var i = ss.cssRules.length - 1; i >= 0; i--) ss.deleteRule(i);
};
if (BiBrowserCheck.moz) {
    _p.setStyleProperty = function (sProp, sValue) {
        BiComponent.prototype.setStyleProperty.call(this, sProp, sValue);
        if (this._created && sProp == "backgroundColor") this._gridBodyElement.style[sProp] = sValue;
    };
    _p._setCssProperties = function () {
        BiComponent.prototype._setCssProperties.call(this);
        var style = this._style;
        if (style && "backgroundColor" in style) this._gridBodyElement.style.backgroundColor = style.backgroundColor;
    };
}
_p.updateData = function ()
{
    if (this.getCreated())
    {
        this._clearCache();
        this._innerBodyElement.innerHTML = this.getGridBodyHtml();
        this.updateHeadersWidth();
        this._gridCreated = true;
    }
};
_p.updateHeadersWidth = function () {
    if (this.getCreated() && this._headers.getCreated()) {
        var gbe = this._gridBodyElement;
        var fw = this._getFillerWidth();
        var newWidth = gbe.clientWidth - fw;
        this._headers.setWidth(newWidth);
        this._headers.setLeft(this.getRightToLeft() ? gbe.offsetWidth - gbe.clientWidth : fw);
        var corner = this._headerCorner;
        if (corner) {
            if (this.getRightToLeft()) corner.setLeft(gbe.offsetWidth - fw);
            else corner.setLeft(0);
        }
        this._innerBodyElement.style.width = this._getScrollWidth();
    }
};
_p._updateHeadersWidth = function () {
    var t = new BiTimer(1);
    t.addEventListener("tick", function (e) {
        t.stop();
        this.updateHeadersWidth();
        t.dispose();
    }, this);
    t.start();
};
_p._create = function (oDoc) {
    BiComponent.prototype._create.call(this, oDoc);
    var doc = this._document;
    if (BiBrowserCheck.ie) this._styleSheet = doc.createStyleSheet();
    else {
        var el = doc.createElement("STYLE");
        el.type = "text/css";
        doc.getElementsByTagName("HEAD")[0].appendChild(el);
        this._styleSheet = el.sheet;
    }
    var ge = this._gridBodyElement = doc.createElement("DIV");
    ge.className = "bi-grid-body";
    ge.onscroll = BiComponent.__oninlineevent;
    this._element.appendChild(ge);
    this._innerBodyElement = doc.createElement("DIV");
    ge.appendChild(this._innerBodyElement);
    var geStyle = ge.style;
    if (this.getRightToLeft()) geStyle.paddingRight = this._getFillerWidth() + "px";
    else geStyle.paddingLeft = this._getFillerWidth() + "px";
    geStyle.paddingTop = this._getFillerHeight() + "px";
    this._updateOverflow();
};
_p.dispose = function () {
    if (this._disposed) return;
    this._removeStyleRules();
    BiComponent.prototype.dispose.call(this);
    this._selectionModel.dispose();
    this._selectionModel = null;
    application.getThemeManager().removeEventListener("themechanged", this.update, this);
    for (var i = this._rows.length - 1; i >= 0; i--) this._rows[i].dispose();
    this._clearCache();
    this._styleSheet = null;
    var gbe = this._gridBodyElement;
    if (gbe) gbe.onscroll = null;
    this.disposeFields("_dataSource", "_rows", "_nodes", "_gridBodyElement", "_gridElements", "_innerBodyElement", "_columns", "_invertedColumnOrders", "_icon");
};
_p._getAllNodes = function () {
    var nodes = this._allNodes;
    if (nodes == null) {
        nodes = this._allNodes = {};
        var cs = this._rows;
        var l = cs.length;
        for (var i = 0; i < l; i++) cs[i]._getAllNodes(nodes);
    }
    return nodes;
};
_p._getGridElement = function (oNode) {
    if (!this._created) return null;
    var hc = oNode.toHashCode();
    var els = this._gridElements;
    if (!els[hc]) {
        els[hc] = this._document.getElementById(hc);
    }
    return els[hc];
};
_p._clearCache = function () {
    this._depth = null;
    this._allNodes = null;
    var els = this._gridElements;
    for (var hc in els) delete els[hc];
};
_p.getGridBodyHtml = function () {
    var cs = this._rows;
    var l = cs.length;
    var sb = new Array(l);
    for (var i = 0; i < l; i++)
        sb[i] = cs[i].getHtml();
    return sb.join("");
};
_p.getSelectedNode = function () {
    return this.getSelectedRows()[0];
};
_p.getSelectedRow = function () {
    return this.getSelectedRows()[0];
};
_p.getSelectedNodes = function () {
    return this._selectionModel.getSelectedItems();
};
_p.getSelectedRows = function () {
    return this._selectionModel.getSelectedItems();
};
_p.setMultipleSelection = function (b) {
    this._selectionModel.setMultipleSelection(b);
};
_p.getMultipleSelection = function () {
    return this._selectionModel.getMultipleSelection();
};
BiAbstractGrid.addProperty("selectionModel", BiAccessType.READ);
_p.setSelectionModel = function (sm) {
    var sm0 = this._selectionModel;
    if (sm0 != sm) {
        if (sm0) sm0.deselectAll();
        this._selectionModel = sm;
    }
};
_p.findString = function (sText, nStartIndex) {
    return this._findItem(sText, nStartIndex || 0, "String");
};
_p.findStringExact = function (sText, nStartIndex) {
    return this._findItem(sText, nStartIndex || 0, "StringExact");
};
_p.setScrollLeft = function (n) {
    if (this.getCreated()) {
        this._gridBodyElement.scrollLeft = n;
        if (BiBrowserCheck.moz) this._headers.setScrollLeft(this.getScrollLeft());
    }
};
_p.getScrollLeft = function () {
    if (this.getCreated()) return this._gridBodyElement.scrollLeft;
};
_p.setScrollTop = function (n) {
    if (this.getCreated()) this._gridBodyElement.scrollTop = n;
};
_p.getScrollTop = function (n) {
    if (this.getCreated()) return this._gridBodyElement.scrollTop;
};
_p.getScrollWidth = function (n) {
    if (this.getCreated()) return this._gridBodyElement.scrollWidth;
};
_p.getScrollHeight = function (n) {
    if (this.getCreated()) return this._gridBodyElement.scrollHeight;
};
_p.getClientWidth = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    return this._gridBodyElement.clientWidth;
};
_p.getClientHeight = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    return this._gridBodyElement.clientHeight;
};
_p.setOverflow = function (s) {
    this._overflowX = s;
    this._overflowY = s;
    this._updateOverflow();
};
_p.getOverflow = function () {
    if (this._overflowX == this._overflowY) return this._overflowX;
    return null;
};
BiAbstractGrid.addProperty("overflowX", BiAccessType.READ);
_p.setOverflowX = function (sOverflowX) {
    if (this._overflowX != sOverflowX) {
        this._overflowX = sOverflowX;
        this._updateOverflow();
    }
};
BiAbstractGrid.addProperty("overflowY", BiAccessType.READ);
_p.setOverflowY = function (sOverflowY) {
    if (this._overflowY != sOverflowY) {
        this._overflowY = sOverflowY;
        this._updateOverflow();
    }
};
_p._updateOverflow = function () {
    if (!this.getCreated() || !this._gridBodyElement) return;
    var ox = this._overflowX;
    var oy = this._overflowY;
    var gbeStyle = this._gridBodyElement.style;
    if (BiBrowserCheck.features.hasOverflowX) {
        if (ox) gbeStyle.overflowX = ox;
        if (oy) gbeStyle.overflowY = oy;
        this.invalidateLayout();
    } else {
        var s;
        var autoX = ox == "auto";
        var autoY = oy == "auto";
        if (autoX && autoY) s = "auto";
        else {
            var scrollX = ox == "scroll" || (autoX && this.getClientWidth() < this._getScrollWidth());
            var scrollY = oy == "scroll" || (autoY && this.getClientHeight() < this._getScrollHeight());
            s = scrollX && scrollY ? "scroll" : scrollX ? "-moz-scrollbars-horizontal" : scrollY ? "-moz-scrollbars-vertical" : "-moz-scrollbars-none";
        } if (this._mozOverflow != s) {
            this._mozOverflow = s;
            gbeStyle.overflow = s;
            this.invalidateLayout();
        }
    }
};
_p.sort = function (nCol, bAscending) {
    if (nCol == -1 && nCol == this._sortColumn) return;
    if (!this.dispatchEvent("beforesort")) return;
    if (nCol != -1) {
        var f = this._columns[nCol].getSortFunction();
    }
    this._sortColumn = nCol;
    this._ascending = Boolean(bAscending);
    this._headers.setSortColumn(nCol);
    this._headers.setAscending(bAscending);
    if (nCol != -1) {
        this._sort(f, bAscending);
        this.updateData();
    }
    this.dispatchEvent("sort");
};
_p._sort = function (fCompare, bAscending) {
    var rows = this._rows;
    rows.sort(fCompare);
    if (!bAscending) rows.reverse();
};
_p._onFocusChange = function (e) {
    var items = this.getSelectedRows();
    for (var i = 0; i < items.length; i++) items[i]._updateClassName();
    var li = this._selectionModel._leadItem;
    if (li) li._updateClassName();
};
_p._onKeyPress = function (e) {
    this._selectionModel.inlineFind(e, this);
};

function BiAbstractGridRow() {
    if (_biInPrototype) return;
    BiObject.call(this);
}
_p = _biExtend(BiAbstractGridRow, BiObject, "BiAbstractGridRow");
_p._grid = null;
_p._icon = null;
_p._selected = false;
_p._anchor = false;
_p._lead = false;
BiAbstractGridRow.addProperty("backColor", BiAccessType.READ_WRITE);
BiAbstractGridRow.addProperty("foreColor", BiAccessType.READ_WRITE);
_p._getStyle = function () {
    if (!this._backColor && !this._foreColor)
        return "";
    return " style=\"" + (this._backColor ? "background-color:" + this._backColor + ";" : "") + (this._foreColor ? "color:" + this._foreColor + ";" : "") + "\"";
};
_p.setIcon = function (oIcon) {
    return this._icon = oIcon == null || oIcon instanceof BiImage ? oIcon : new BiImage(oIcon);
};
_p.getIcon = function () {
    var icon = this._icon;
    if (icon) return icon;
    return application.getThemeManager().getDefaultTheme().getAppearanceProperty("grid", "default-icon") || "";
};
BiAbstractGridRow.addProperty("selected", BiAccessType.READ);
_p.setSelected = function (bSelected) {
    if (this._selected != bSelected) {
        var g = this.getGrid();
        if (g != null) {
            g._selectionModel.setItemSelected(this, bSelected);
        }
        this._setSelected(bSelected);
    }
};
_p._setSelected = function (bSelected) {
    this._selected = bSelected;
    this._updateClassName();
};
_p._setAnchor = function (bAnchor) {
    this._anchor = bAnchor;
    this._updateClassName();
};
_p._setLead = function (bLead) {
    this._lead = bLead;
    this._updateClassName();
};
_p.getCreated = function () {
    var t = this.getGrid();
    if (!t || !t._gridCreated) return false;
    var el = this._element = t._getGridElement(this);
    return el != null;
};
_p._updateClassName = function () {
    if (!this.getCreated()) return;
    this._element.firstChild.className = this.getCssClassName();
};
_p.update = function () {
    var g = this.getGrid();
    if (!this.getCreated() || !g) return;
    this._element.outerHTML = this.getHtml();
    g._clearCache();
};
_p.scrollIntoView = function (bTopLeft) {
    this.scrollIntoViewY(bTopLeft);
};
_p.getHeight = function () {
    return this.getGrid().getRowHeight();
};
_p.getTop = function () {
    if (this.getCreated()) {
        var grid = this.getGrid();
        return BiComponent._getElementPositionInFrame(this._element).y - BiComponent._getElementPositionInFrame(grid._element).y + grid.getScrollTop() - grid.getInsetTop();
    }
};
_p.scrollIntoViewY = function (bTop) {
    if (!this.getCreated()) {
        return;
    }
    var p = this.getGrid();
    if (!p) return;
    var t = this.getTop();
    var h = this.getHeight();
    var st = p.getScrollTop();
    var ch = p.getClientHeight();
    var fh = p._getFillerHeight();
    if (bTop) p.setScrollTop(t - fh);
    else if (bTop == false) p.setScrollTop(t + h - ch);
    else if (h > ch || t - fh < st) {
        p.setScrollTop(t - fh);
    } else if (t + h > st + ch) {
        p.setScrollTop(t + h - ch);
    }
};
_p.matchesString = function (sText, nCellIndex) {
    return false;
};
_p.matchesStringExact = function (sText, nCellIndex) {
    return false;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this._grid = null;
    this._icon = null;
};

function BiGridColumn(sName) {
    if (_biInPrototype) return;
    BiObject.call(this);
    if (sName) this._name = sName;
    this._header = new this._gridHeaderConstructor(this._name);
};
_p = _biExtend(BiGridColumn, BiObject, "BiGridColumn");
_p._gridHeaderConstructor = BiGridHeader;
_p._name = "Untitled";
_p._width = 200;
_p._align = "left";
_p._indentColumn = false;
_p._iconColumn = false;
_p._orderIndex = -1;
_p._columnIndex = -1;
_p._grid = null;
_p._sortType = "string";
_p._visible = true;
BiGridColumn.addProperty("header", BiAccessType.READ);
BiGridColumn.addProperty("grid", BiAccessType.READ);
BiGridColumn.addProperty("orderIndex", BiAccessType.READ);
BiGridColumn.addProperty("columnIndex", BiAccessType.READ);
_p.getTree = function () {
    return this._grid;
};
_p.setAlign = function (s) {
    this._align = s;
    this._grid._columnAligns[this._columnIndex] = s;
    this._header.setAlign(s);
};
_p.getAlign = function () {
    return this._align || "left";
};
BiGridColumn.addProperty("name", BiAccessType.READ);
_p.setName = function (s) {
    this._name = s;
    this._grid._columnNames[this._columnIndex] = s;
    this._header.setText(s);
};
BiGridColumn.addProperty("width", BiAccessType.READ);
_p.setWidth = function (n) {
    this._width = n;
    this._grid._columnWidths[this._columnIndex] = n;
};
BiGridColumn.addProperty("indentColumn", BiAccessType.READ);
_p.setIndentColumn = function (b) {
    if (this._indentColumn != b) {
        this._indentColumn = b;
        if (b) this._grid.setIndentColumn(this._columnIndex);
    }
};
BiGridColumn.addProperty("iconColumn", BiAccessType.READ);
_p.setIconColumn = function (b) {
    if (this._iconColumn != b) {
        this._iconColumn = b;
        if (b) this._grid.setIconColumn(this._columnIndex);
    }
};
BiGridColumn.addProperty("visible", BiAccessType.READ);
_p.setVisible = function (b) {
    if (this._visible != b) {
        this._visible = b;
        this._header.setVisible(b);
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this._header.dispose();
    this._header = null;
    this._grid = null;
};
BiGridColumn.addProperty("sortType", BiAccessType.READ);
_p.setSortType = function (sType) {
    this._sortType = sType;
};
_p.getSortFunction = function () {
    var f;
    switch (this._sortType.toLowerCase()) {
    case "string":
        f = BiGridColumn.stringCompare;
        break;
    case "caseinsensitivestring":
        f = BiGridColumn.caseInsensitiveStringCompare;
        break;
    case "number":
        f = BiGridColumn.numberCompare;
        break;
    case "date":
        f = BiGridColumn.dateCompare;
        break;
    case "ip":
        f = BiGridColumn.ipCompare;
        break;
    default:
        f = BiGridColumn.lessThanCompare;
    }
    var index = this._columnIndex;
    return function (r1, r2) {
        return f(r1.getData(index), r2.getData(index));
    };
};
BiGridColumn.numberCompare = function (n1, n2) {
    return BiSort.numberCompare(n1, n2);
};
BiGridColumn.dateCompare = function (d1, d2) {
    return BiSort.dateCompare(d1, d2);
};
BiGridColumn.lessThanCompare = function (v1, v2) {
    return BiSort.lessThanCompare(v1, v2);
};
BiGridColumn.stringCompare = function (s1, s2) {
    return BiSort.stringCompare(s1, s2);
};
BiGridColumn.caseInsensitiveStringCompare = function (s1, s2) {
    return BiSort.caseInsensitiveStringCompare(s1, s2);
};
BiGridColumn.ipCompare = function (ip1, ip2) {
    return BiSort.ipCompare(ip1, ip2);
};

function BiTree() {
    if (_biInPrototype) return;
    BiAbstractGrid.call(this);
    this.setCssClassName("bi-tree");
    this.setAppearance("grid");
    this._selectionModel = new BiTreeSelectionModel(this);
    this._selectionModel.setMultipleSelection(false);
    this._headers = new this._gridHeadersConstructor;
    this.addEventListener("mousedown", this._onMouseEvent);
    this.addEventListener("mouseup", this._onMouseEvent);
    this.addEventListener("click", this._onMouseEvent);
    this.addEventListener("dblclick", this._onMouseEvent);
    this.addEventListener("keydown", this._onKeyDown);
    this.addEventListener("keypress", this._onKeyPress);
    this.addEventListener("focus", this._onFocusChange);
    this.addEventListener("blur", this._onFocusChange);
    this._selectionModel.addEventListener("change", function (e) {
        this.dispatchEvent("change");
    }, this);
    this.add(this._headers);
    this._headers.addEventListener("columnwidthschanged", this.updateColumns, this);
    this._headers.addEventListener("columnorderschanged", function (e) {
        this.setColumnOrders(this._headers.getColumnOrders());
        this.updateColumns();
        this.updateData();
    }, this);
    this._headers.addEventListener("sortcolumnchanged", function (e) {
        this.sort(this._headers.getSortColumn(), this._headers.getAscending());
    }, this);
    this._headers.addEventListener("ascendingchanged", function (e) {
        this.sort(this._headers.getSortColumn(), this._headers.getAscending());
    }, this);
    this.addEventListener("scroll", function (e) {
        this._headers.setScrollLeft(this.getScrollLeft());
    });
}
_p = _biExtend(BiTree, BiAbstractGrid, "BiTree");
_p._indentColumn = -1;
_p._indentWidth = 32;
_p._showLines = true;
_p._showRootLines = false;
_p._showPlusMinus = true;
_p._parentNode = null;
BiTree.addProperty("indentWidth", BiAccessType.READ_WRITE);
BiTree.addProperty("showPlusMinus", BiAccessType.READ_WRITE);
BiTree.addProperty("showRootLines", BiAccessType.READ_WRITE);
_p._layoutHeaders = function () {
    this.updateHeadersWidth();
};
_p.addNode = function (oChild, oBefore) {
    var p = oChild._parentNode;
    if (oBefore == null)
    {
        if (p != null)
            p.removeNode(oChild);
        this._nodes.push(oChild);
    } else {
        if (oBefore._parentNode != this)
            throw new Error("Can only add components before siblings");
        if (p != null)
            p.removeNode(oChild);
        this._nodes.insertBefore(oChild, oBefore);
        this._rows = this._nodes;
    }

    oChild._parentNode = this;
    oChild._grid = this;
    oChild._level = 1;
    this._clearCache();
};
_p.removeNode = function (oChild) {
    if (oChild._parentNode != this) throw new Error("Can only remove children");
    this._nodes.remove(oChild);
    this._rows = this._nodes;
    oChild._parentNode = null;
    oChild._grid = null;
    this._clearCache();
    return oChild;
};
_p.getGrid = function () {
    return this;
};
_p.getTree = function () {
    return this;
};
_p.getLevel = function () {
    return -1;
};
_p.containsNode = function (oDescendant) {
    if (oDescendant == null) return false;
    if (oDescendant == this) return true;
    var p = oDescendant._parentNode;
    return this.containsNode(p);
};
_p.getFirstNode = function () {
    return this._nodes[0];
};
_p.getLastNode = function () {
    return this._nodes[this._nodes.length - 1];
};
BiTree.addProperty("nodes", BiAccessType.READ);
_p.hasNodes = function () {
    return this._nodes.length > 0;
};
_p.isLeaf = function () {
    return !this.hasNodes();
};
_p.getNextSiblingNode = function () {
    return null;
};
_p.getPreviousSiblingNode = function () {
    return null;
};
_p.isLastSiblingNode = function () {
    return true;
};
_p.getParentNode = function () {
    return null;
};
_p.removeAll = function () {
    this._selectionModel.deselectAll();
    for (var i = this._nodes.length - 1; i >= 0; i--) {
        var n = this._nodes[i];
        n.dispose();
    }
    this._nodes.length = 0;
};
BiTree.addProperty("indentColumn", BiAccessType.READ);
_p.setIndentColumn = function (n) {
    if (this._columns[this._indentColumn]) this._columns[this._indentColumn]._indentColumn = false;
    this._indentColumn = n;
    if (this._columns[this._indentColumn]) this._columns[this._indentColumn]._indentColumn = true;
};
BiTree.addProperty("showLines", BiAccessType.WRITE);
_p.getShowLines = function () {
    return this._showLines && this._indentColumn >= 0 && this._indentColumn < this._columnCount;
};
_p._getStyleRules = function () {
    var prefix = "#" + this.getHtmlProperty("id") + " ";
    var align, i;
    var widthSum = 0;
    var cols = this._columns;
    var colprefix = prefix + ".col-";
    var rs = [];
    var rule;
    for (i = 0; i < this._columnCount; i++) {
        rule = [colprefix, i, "{"];
        if (!cols[i].getVisible()) rule.push("display:none;");
        else {
            rule.push("width:", this._columnWidths[i], "px;");
            if (this._columnAligns[i] != "left") rule.push("text-align:", this._columnAligns[i], ";");
            widthSum += this._columnWidths[i];
        }
        rule.push("}");
        rs.push(rule.join(BiString.EMPTY));
    }
    if (this._indentColumn != -1 && this._indentColumn < this._columnCount && this._columns[this._indentColumn].getVisible()) {
        if (this._showPlusMinus || this._showLines) rs.push([colprefix, this._indentColumn, "{padding-left:0;}"].join(BiString.EMPTY));
        var indentColumnLeft = 0;
        var visIndex = this._columns[this._indentColumn].getOrderIndex();
        for (i = 0; i < this._columnCount; i++) {
            if (this._columns[i].getVisible() && this._columns[i].getOrderIndex() < visIndex) indentColumnLeft += this._columnWidths[i];
        }
        var accumSelector = prefix + ".bi-tree-children ";
        var accumPadding = this._indentWidth + (this._showPlusMinus || this._showLines ? 0 : 16);
        var d = this.getDepth();
        var indentIsRtl = this._columnAligns[this._indentColumn] == "right";
        var backgroundPositionStart = indentColumnLeft + (indentIsRtl ? this._columnWidths[this._indentColumn] + 2 : -this._indentWidth);
        for (i = 1; i < d; i++) {
            var paddingStyle = indentIsRtl ? "padding-right:" : "padding-left:";
            rs.push([accumSelector, ".col-", this._indentColumn, "{", paddingStyle, accumPadding, "px;}"].join(BiString.EMPTY));
            rs.push([accumSelector, "SPAN {margin-right:", accumPadding, "px;}"].join(BiString.EMPTY));
            if (accumPadding - Math.ceil(this._indentWidth / 2) > this._columnWidths[this._indentColumn])
                break;
            var rtlFactor = indentIsRtl ? -1 : 1;
            rs.push([accumSelector, "{background-position:", backgroundPositionStart + rtlFactor * accumPadding, "px 0;}"].join(BiString.EMPTY));
            accumPadding += this._indentWidth;
            accumSelector += ".bi-tree-children ";
        }
    }
    rs.push([prefix, ".bi-tree-row { width:", widthSum, "px;}"].join(BiString.EMPTY));
    rs.push([prefix, ".bi-tree-row,", prefix, ".bi-tree-cell {height:", this._rowHeight, "px;line-height:", this._rowHeight, "px;}"].join(BiString.EMPTY));
    rs.push([prefix, ".grid-row-lead .bi-tree-cell {height:", this._rowHeight - 2, "px;line-height:", this._rowHeight - 2, "px;}"].join(BiString.EMPTY));
    return rs;
};
_p.getDepth = function () {
    if (this._depth != null) return this._depth;
    var d = 0;
    var cs = this._nodes;
    var l = cs.length;
    for (var i = 0; i < l; i++) d = Math.max(d, cs[i].getDepth() + 1);
    return this._depth = d;
};
_p._findItem = function (oValue, nStartIndex, sType) {
    var i;
    var items = BiTreeHelper.getPreorderShownNodes(this);
    if (nStartIndex == null) {
        var si = this.getSelectedNode();
        nStartIndex = items.indexOf(si);
        if (nStartIndex == -1) nStartIndex = 0;
    }
    var methodName = "matches" + sType;
    for (i = nStartIndex; i < items.length; i++) {
        if (items[i][methodName](oValue)) return items[i];
    }
    for (i = 0; i < nStartIndex; i++) {
        if (items[i][methodName](oValue)) return items[i];
    }
    return null;
};
_p._getMouseEventInfo = function (e, inEl) {
    var el = inEl || e._event.srcElement || e._event.target;
    if (el == null) return null;
    var res = {};
    res.expandIconClicked = el.tagName == "IMG" && el.className == "bi-tree-expand-icon";
    var cellRe = /bi-tree-cell/;
    var cellEl = el;
    while (cellEl != null && !cellRe.test(cellEl.className)) cellEl = cellEl.parentNode;
    if (cellEl != null) {
        if (cellRe.test(cellEl.className)) {
            res.cellIndex = Number(cellEl.className.replace(/.*col-(\d+).*/, "$1"));
        }
        el = cellEl;
    } else {
        res.cellIndex = -1;
    }
    while (el != null && !/bi-tree-node/.test(el.className)) el = el.parentNode;
    if (el == null) return null;
    res.treeNode = this._getAllNodes()[el.id];
    return res;
};
_p._toggleNode = function (oNode) {
    oNode.toggle();
    this.dispatchEvent("expandedchanged");
    if (oNode.getExpanded()) oNode._scrollSubtreeIntoView();
};
_p._onMouseEvent = function (e) {
    var info = this._getMouseEventInfo(e);
    if (info == null || info.treeNode == null) return;
    var node = info.treeNode;
    switch (e.getType()) {
    case "mousedown":
        if (info.expandIconClicked && node.hasNodes()) {
            this._toggleNode(node);
        } else this._selectionModel.handleMouseDown(node, e);
        break;
    case "mouseup":
        if (!info.expandIconClicked || !node.hasNodes()) this._selectionModel.handleMouseUp(node, e);
        break;
    case "click":
        this._selectionModel.handleClick(node, e);
        break;
    case "dblclick":
        if (node && node.hasNodes()) {
            this._toggleNode(node);
        } else this._selectionModel.handleDblClick(node, e);
        break;
    }
};
_p._onKeyDown = function (e) {
    var leadItem = this._selectionModel.getLeadItem();
    if (leadItem) {
        if (e.matchesBundleShortcut("tree.expand")) {
            if (leadItem.hasNodes()) {
                if (leadItem.getExpanded()) this._selectionModel.setLeadItem(leadItem.getFirstNode());
                else {
                    leadItem.setExpanded(true);
                    leadItem._scrollSubtreeIntoView();
                    this.dispatchEvent("expandedchanged");
                }
            }
        } else if (e.matchesBundleShortcut("tree.collapse")) {
            if (leadItem.hasNodes() && leadItem.getExpanded()) {
                leadItem.setExpanded(false);
                this.dispatchEvent("expandedchanged");
            } else {
                var p = leadItem.getParentNode();
                if (p != leadItem.getTree()) this._selectionModel.setLeadItem(p);
            }
        }
    }
    this._selectionModel.handleKeyDown(e);
};
_p.getExpanded = function () {
    return true;
};
_p.setExpanded = function (b) {};
_p.reveal = function () {};
_p._sort = function (fCompare, bAscending) {
    if (this.hasNodes()) {
        for (var i = 0; i < this._nodes.length; i++) this._nodes[i]._sort(fCompare, bAscending);
        this._nodes.sort(fCompare);
        if (!bAscending) this._nodes.reverse();
    }
};
_p.getRowAtPoint = function (nClientX, nClientY) {
    return this.getNodeAtPoint(nClientX, nClientY);
};
_p.getNodeAtPoint = function (nClientX, nClientY) {
    if (BiBrowserCheck.ie) {
        var el = this._document.elementFromPoint(nClientX, nClientY);
        if (el == null) return null;
        var res = this._getMouseEventInfo(null, el);
        return res ? res.treeNode : null;
    } else {
        var y = nClientY - this.getClientTop() - this.getInsetTop();
        if (this._getFillerHeight() >= y) return null;
        y = y - this._getFillerHeight() + this.getScrollTop();
        var rowIndex = Math.floor(y / this._rowHeight);
        var rows = [];
        this._getAllRows(this, rows);
        if (rowIndex > rows.length) return null;
        return rows[rowIndex];
    }
};
_p._getAllRows = function (p, out) {
    if (p.getExpanded()) {
        var cs = p.getNodes();
        for (var i = 0; i < cs.length; i++) {
            out.push(cs[i]);
            this._getAllRows(cs[i], out);
        }
    }
};

function BiTreeNode(oData) {
    if (_biInPrototype) return;
    BiAbstractGridRow.call(this);
    this._nodes = [];
    this._data = oData || [];
}
_p = _biExtend(BiTreeNode, BiAbstractGridRow, "BiTreeNode");
_p._indentWidth = 32;
_p._expanded = true;
_p._icon = BiTree.DEFAULT_ICON;
_p.getData = function (x) {
    return this._data[x];
};
_p.setData = function (x, oData) {
    this._data[x] = oData;
};
_p.matchesString = function (sText, nCellIndex) {
    return sText != "" && BiLabel.htmlToText(this.getCellHtml(nCellIndex || 0).toLowerCase()).indexOf(sText.toLowerCase()) == 0;
};
_p.matchesStringExact = function (sText, nCellIndex) {
    return sText != "" && BiLabel.htmlToText(this.getCellHtml(nCellIndex || 0)).toLowerCase() == String(sText).toLowerCase();
};
_p.getHtml = function () {
    var childrenHtml;
    if (this.hasNodes())
    {
        var sb = ['<div class="bi-tree-children" style="', this._getLineStyle(), (this.getExpanded() ? "" : "display:none;"), "\">"];
        var cs = this._nodes;
        var l = cs.length;
        for (var y = 0; y < l; y++)
            sb.push(cs[y].getHtml());
        sb.push("</div>");
        childrenHtml = sb.join("");
    }
    else
        childrenHtml = "";
    return ['<div class="bi-tree-node" id="', this.toHashCode(), '">', this.getRowHtml(), childrenHtml, "</div>"].join("");
};
_p.getRowHtml = function () {
    var tree = this.getTree();
    var sb = ['<div class="', this.getCssClassName(), '"', this._getStyle(), ">"];
    var cols = tree._columns;
    var cox;
    for (var x = 0; x < cols.length; x++)
    {
        cox = tree._columnOrders[x];
        if (cols[cox].getVisible())
            sb.push(this.getCellHtml(cox));
    }

    sb.push("</div>");
    return sb.join("");
};
_p.getCssClassName = function () {
    return "bi-tree-row grid-row" + (this._selected ? " grid-row-selected" : "") + (this._lead ? " grid-row-lead" : "");
};
_p.getCellHtml = function (nCol) {
    var t = this.getTree();
    var icon = (nCol == t.getIconColumn());
    var indent = (nCol == t.getIndentColumn());
    var sRtl = "";
    if (indent && t._columnAligns[nCol] == "right") {
        sRtl = ' style="direction: rtl;"';
        t._rtl = true;
    }
    return ['<div class="bi-tree-cell grid-cell col-', nCol, '"', sRtl, '>', (indent ? this.getExpandIconHtml(sRtl != "") : ""), (icon ? this.getIconHtml() : ""), this.getLabelHtml(nCol), "</div>"].join("");
};
_p.getLabelHtml = function (nCol) {
    return this._data[nCol];
};
_p.getIconHtml = function () {
    var i = this.getIcon();
    if (!i) return "";
    if (i.getIconHtml)
        return i.getIconHtml(this.getLabelHtml() != "", true, "left", 3, "bi-tree-icon");
    else {
        return '<img alt="" class="bi-tree-icon" src="' + i + '">';
    }
};
_p.getExpandIconSrc = function (bRtl) {
    var src;
    var tree = this.getTree();
    if (this.hasNodes()) {
        if (!tree.getShowLines() || this.getLevel() == 1 && !tree.getShowRootLines()) {
            if (!tree.getShowPlusMinus()) src = "blank-icon";
            else if (this.getExpanded()) src = "minus-icon";
            else src = "plus-icon";
        } else if (this.isLastSiblingNode()) {
            if (!tree.getShowPlusMinus()) src = "l-icon";
            else if (this.getExpanded()) src = "l-minus-icon";
            else src = "l-plus-icon";
        } else {
            if (!tree.getShowPlusMinus()) src = "t-icon";
            else if (this.getExpanded()) src = "t-minus-icon";
            else src = "t-plus-icon";
        }
    } else {
        if (!this.getTree().getShowLines() || this.getLevel() == 1 && !tree.getShowRootLines())
            src = "blank-icon";
        else if (this.isLastSiblingNode())
            src = "l-icon";
        else
            src = "t-icon";
    }
    if (bRtl)
    {
        if (src.charAt(0) != "b")
            src = "rtl-" + src;
    }
    return application.getThemeManager().getDefaultTheme().getAppearanceProperty("grid", src);
};
_p.getExpandIconHtml = function (bRtl) {
    var tree = this.getTree();
    if (!tree.getShowPlusMinus() && !tree.getShowLines()) return "";
    return '<img alt="" class="bi-tree-expand-icon" ' + 'src="' + this.getExpandIconSrc(bRtl) + '">';
};
_p._getLineStyle = function () {
    return !this._getShowChildrenLine() ? "background-position: -100px 0 !important;" : "";
};
_p._getShowChildrenLine = function () {
    var tree = this.getTree();
    return tree.getShowLines() && !this.isLastSiblingNode() && !(!tree.getShowRootLines() && this.getLevel() == 1);
};
_p.update = function () {
    BiAbstractGridRow.prototype.update.call(this);
    this.getTree()._updateHeadersWidth();
};
_p.updateRow = function () {
    if (!this.getCreated() || !this.getTree())
        return;
    this._element.firstChild.outerHTML = this.getRowHtml();
    this.getTree()._clearCache();
};
_p.addNode = function (oChild, oBefore) {
    var p = oChild._parentNode;
    if (oBefore == null) {
        if (p != null) p.removeNode(oChild);
        this._nodes.push(oChild);
    } else {
        if (oBefore._parentNode != this) throw new Error("Can only add components before siblings");
        if (p != null) p.removeNode(oChild);
        var i = this._nodes.indexOf(oBefore);
        this._nodes.insertAt(oChild, i);
    }
    oChild._parentNode = this;
    if (this.getTree()) {
        oChild._grid = this.getTree();
        oChild._grid._clearCache();
    }
    if (this.getLevel() != null) oChild._level = this.getLevel() + 1;
};
_p.removeNode = function (oChild) {
    var i = this._nodes.indexOf(oChild);
    return this.removeNodeAt(i);
};
_p.removeNodeAt = function (i) {
    var oChild = this._nodes[i];
    if (oChild._parentNode != this) throw new Error("Can only remove children");
    this._nodes.removeAt(i);
    oChild._parentNode = null;
    if (oChild._grid) {
        oChild._grid._clearCache();
    }
    oChild._grid = null;

    oChild._level = null;
    return oChild;
};
_p.removeAll = function () {
    for (var i = this.getNodes().length - 1; i >= 0; i--) {
        this.removeNodeAt(i).dispose();
    }
};
BiTreeNode.addProperty("parentNode", BiAccessType.READ);
_p.getNodes = function () {
    return this._nodes;
};
_p.containsNode = function (oDescendant) {
    if (oDescendant == null) return false;
    if (oDescendant == this) return true;
    var p = oDescendant._parentNode;
    return this.containsNode(p);
};
_p.getFirstNode = function () {
    return this._nodes[0];
};
_p.getLastNode = function () {
    return this._nodes[this._nodes.length - 1];
};
_p.getPreviousSiblingNode = function () {
    var p = this._parentNode;
    if (p == null) return null;
    var cs = p._nodes;
    return cs[cs.indexOf(this) - 1];
};
_p.getNextSiblingNode = function () {
    var p = this._parentNode;
    if (p == null) return null;
    var cs = p._nodes;
    return cs[cs.indexOf(this) + 1];
};
_p.getLevel = function () {
    if (this._level != null) return this._level;
    if (this._parentNode) {
        var pd = this._parentNode.getLevel();
        return this._level = (pd != null ? pd + 1 : null);
    }
    return null;
};
_p.hasNodes = function () {
    return this._nodes.length > 0;
};
_p.isLeaf = function () {
    return !this.hasNodes();
};
_p.getGrid = function () {
    return this.getTree();
};
_p.getTree = function () {
    if (this._grid) return this._grid;
    if (this._parentNode) return this._grid = this._parentNode.getTree();
    return null;
};
_p.getDepth = function () {
    var d = 0;
    var cs = this._nodes;
    var l = cs.length;
    for (var i = 0; i < l; i++) d = Math.max(d, cs[i].getDepth() + 1);
    return d;
};
_p.isLastSiblingNode = function () {
    return this._parentNode && this == this._parentNode.getLastNode();
};
BiTreeNode.addProperty("expanded", BiAccessType.READ);
_p.setExpanded = function (b) {
    if (this._expanded != b) {
        if (!this.hasNodes()) {
            this._expanded = false;
            return;
        }
        this._expanded = b;
        if (this.getCreated()) {
            var rowEl = this._element.firstChild;
            var childrenEl = this._element.lastChild;
            rowEl.outerHTML = this.getRowHtml();
            childrenEl.style.display = b ? "" : "none";
        }
        var tree = this.getTree();
        if (tree) {
            if (!b) tree._selectionModel._collapseNode(this);
            tree._updateHeadersWidth();
        }
    }
};
_p.reveal = function () {
    var p = this.getParentNode();
    if (p) {
        p.setExpanded(true);
        p.reveal();
    }
};
_p.toggle = function () {
    this.setExpanded(!this.getExpanded());
};
_p._sort = function (fCompare, bAscending) {
    if (this.hasNodes()) {
        for (var i = 0; i < this._nodes.length; i++) this._nodes[i]._sort(fCompare, bAscending);
        this._nodes.sort(fCompare);
        if (!bAscending) this._nodes.reverse();
    }
};
_p._getAllNodes = function (oHash) {
    oHash[this.toHashCode()] = this;
    var cs = this._nodes;
    var l = cs.length;
    for (var i = 0; i < l; i++) cs[i]._getAllNodes(oHash);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiAbstractGridRow.prototype.dispose.call(this);
    for (var i = this._nodes.length - 1; i >= 0; i--) this._nodes[i].dispose();
    this._element = null;
    this._grid = null;
    this._disposed = true;
};
_p._scrollSubtreeIntoView = function () {
    if (!this.getCreated()) {
        return;
    }
    var p = this.getGrid();
    if (!p) return;
    var t = this.getTop();
    var st = p.getScrollTop();
    var ch = p.getClientHeight();
    var fh = p._getFillerHeight();
    var last = BiTreeHelper.getLastShownDescendant(this);
    var lastTop = last.getTop();
    var lastHeight = last.getHeight();
    var h = lastTop + lastHeight - t;
    if (h > ch || t - fh < st) p.setScrollTop(t - fh);
    else if (t + h > st + ch) p.setScrollTop(t + h - ch);
};

function BiTreeHelper() {
    if (_biInPrototype) return;
    BiObject.call(this);
}
_p = _biExtend(BiTreeHelper, BiObject, "BiTreeHelper");
BiTreeHelper.getLastShownDescendant = function (n) {
    if (!n.getExpanded() || n.isLeaf()) return n;
    return BiTreeHelper.getLastShownDescendant(n.getLastNode());
};
BiTreeHelper.getNextShownNode = function (n) {
    var cs = n.getNodes();
    if (cs.length > 0 && n.getExpanded()) return cs[0];
    else {
        var p = n;
        var next;
        while (p != null) {
            next = p.getNextSiblingNode();
            if (next != null) return next;
            p = p.getParentNode();
        }
        return null;
    }
};
BiTreeHelper.getPreviousShownNode = function (n) {
    var ps = n.getPreviousSiblingNode();
    if (ps != null) {
        return BiTreeHelper.getLastShownDescendant(ps);
    }
    var p = n.getParentNode();
    return p != n.getTree() ? n.getParentNode() : null;
};
BiTreeHelper.getPreorderShownNodes = function (n) {
    var res = [];
    BiTreeHelper._getPreorderShownNodes(n, res);
    return res;
};
BiTreeHelper._getPreorderShownNodes = function (n, arr) {
    if (n != n.getTree()) arr.push(n);
    if (n.getExpanded()) {
        for (var i = 0; i < n._nodes.length; i++) BiTreeHelper._getPreorderShownNodes(n._nodes[i], arr);
    }
};
BiTreeHelper.isBefore = function (n1, n2) {
    if (n1 == n2) return false;
    if (n1.containsNode(n2)) return true;
    if (n2.containsNode(n1)) return false;
    var p1 = n1.getParentNode();
    var p2 = n2.getParentNode();
    if (p1 == p2) {
        var ns = p1.getNodes();
        for (var i = 0; i < ns.length; i++) {
            if (ns[i] == n1) return true;
            if (ns[i] == n2) return false;
        }
    }
    var l1 = n1.getLevel();
    var l2 = n2.getLevel();
    if (l1 > l2) return BiTreeHelper.isBefore(n1.getParentNode(), n2);
    else return BiTreeHelper.isBefore(n1, n2.getParentNode());
};

function BiTreeSelectionModel(oTree) {
    if (_biInPrototype) return;
    BiSelectionModel.call(this, oTree);
}
_p = _biExtend(BiTreeSelectionModel, BiSelectionModel, "BiTreeSelectionModel");
_p.getItemSelected = function (oItem) {
    return oItem._selected;
};
_p.updateItemSelectionState = function (oItem, bSelected) {
    oItem._setSelected(bSelected);
};
_p.updateItemAnchorState = function (oItem, bAnchor) {
    oItem._setAnchor(bAnchor);
};
_p.updateItemLeadState = function (oItem, bLead) {
    oItem._setLead(bLead);
};
_p.getFirst = function () {
    return this._owner.getFirstNode();
};
_p.getLast = function () {
    return BiTreeHelper.getLastShownDescendant(this._owner);
};
_p.getItems = function () {
    return BiTreeHelper.getPreorderShownNodes(this._owner);
};
_p.getNext = function (oItem) {
    return BiTreeHelper.getNextShownNode(oItem);
};
_p.getPrevious = function (oItem) {
    return BiTreeHelper.getPreviousShownNode(oItem);
};
_p.isBefore = function (n1, n2) {
    return BiTreeHelper.isBefore(n1, n2);
};
_p._containsLeadItem = function (n) {
    return this._leadItem && n.containsNode(this._leadItem);
};
_p._containsAnchorItem = function (n) {
    return this._anchorItem && n.containsNode(this._anchorItem);
};
_p.containsSelectedNodes = function (n) {
    var items = this._selectedItems.toArray();
    for (var i = 0; i < items.length; i++) {
        if (n.containsNode(items[i])) return true;
    }
    return false;
};
_p._collapseNode = function (n) {
    if (this._containsLeadItem(n)) this.setLeadItem(n);
    if (this._containsAnchorItem(n)) this.setAnchorItem(n);
    if (this.containsSelectedNodes(n)) {
        var oldVal = this._getChangeValue();
        var oldFireChange = this._fireChange;
        this._fireChange = false;
        this._deselectAllDescendants(n);
        this.setItemSelected(n, true);
        this._fireChange = oldFireChange;
        if (this._fireChange && this._hasChanged(oldVal)) this._dispatchChange();
    }
};
_p._deselectAllDescendants = function (n) {
    var n2;
    var items = this._selectedItems.toArray();
    for (var i = 0; i < items.length; i++) {
        n2 = items[i];
        if (n.containsNode(n2) && n != n2) this.setItemSelected(n2, false);
    }
};
_p.getPageUp = function (oItem) {
    var vpTop = this._owner.getScrollTop();
    var next;
    if (!this._leadItem) next = this.getFirst();
    else next = this._leadItem;
    var fillerHeight = this._owner._getFillerHeight();
    var tries = 0;
    while (tries < 2) {
        while (next && (next.getTop() - next.getHeight() - fillerHeight >= vpTop)) next = this.getUp(next);
        if (next == null) {
            tries = 2;
            break;
        }
        if (next != this._leadItem) break;
        this._owner.setScrollTop(vpTop - this._owner.getClientHeight() - next.getHeight());
        vpTop = this._owner.getScrollTop();
        tries++;
    }
    return next;
};

function BiGrid(oGridData, oColumnNames) {
    if (_biInPrototype) return;
    BiAbstractGrid.call(this);
    this.setCssClassName("bi-grid");
    this.setAppearance("grid");
    this._selectionModel = new BiGridSelectionModel(this);
    this._selectionModel.setMultipleSelection(false);
    this._headers = new this._gridHeadersConstructor;
    this._rowHeaders = new this._gridRowHeadersConstructor;
    this._rowHeaders.setWidth(this._rowHeadersWidth);
    this._headerCorner = new this._gridHeaderCornerConstructor;
    this._headerCorner.setRight(null);
    this._headerCorner.setSize(this._rowHeadersWidth, this._getFillerHeight());
    this._headers.setLeft(this._getFillerWidth());
    this._rowHeaders.setTop(this._getFillerHeight());
    this._rowHeaders.setVisible(false);
    this._headerCorner.setVisible(false);
    this.add(this._headers);
    this.add(this._rowHeaders);
    this.add(this._headerCorner);
    this.addEventListener("mousedown", this._onMouseEvent);
    this.addEventListener("mouseup", this._onMouseEvent);
    this.addEventListener("click", this._onMouseEvent);
    this.addEventListener("dblclick", this._onMouseEvent);
    this.addEventListener("mousewheel", this._onMouseEvent);
    this.addEventListener("keydown", this._onKeyDown);
    this.addEventListener("keypress", this._onKeyPress);
    this.addEventListener("focus", this._onFocusChange);
    this.addEventListener("blur", this._onFocusChange);
    this._selectionModel.addEventListener("change", function (e) {
        this.dispatchEvent("change");
    }, this);
    this._headers.addEventListener("columnwidthschanged", this.updateColumns, this);
    this._headers.addEventListener("columnorderschanged", function (e) {
        this.setColumnOrders(this._headers.getColumnOrders());
        this.updateColumns();
        this.updateData();
    }, this);
    this._headers.addEventListener("sortcolumnchanged", function (e) {
        this.sort(this._headers.getSortColumn(), this._headers.getAscending());
    }, this);
    this._headers.addEventListener("ascendingchanged", function (e) {
        this.sort(this._headers.getSortColumn(), this._headers.getAscending());
    }, this);
    this.addEventListener("scroll", function (e) {
        this._headers.setScrollLeft(this.getScrollLeft());
        this._rowHeaders.setScrollTop(this.getScrollTop());
    });
    if (oGridData) {
        var h = oGridData.length;
        var w = oGridData[0].length;
        this.setColumnCount(w);
        if (oColumnNames) {
            this.setColumnNames(oColumnNames);
        }
        for (var y = 0; y < h; y++) {
            this.addRow(new BiGridRow(oGridData[y]));
        }
    }
}
_p = _biExtend(BiGrid, BiAbstractGrid, "BiGrid");
_p._gridRowHeadersConstructor = BiGridRowHeaders;
_p._gridHeaderCornerConstructor = BiGridHeaderCorner;
BiGrid.addProperty("rowHeaders", BiAccessType.READ);
BiGrid.addProperty("headerCorner", BiAccessType.READ);
_p._layoutHeaders = function () {
    this.updateHeadersWidth();
    this.updateRowHeadersHeight();
    this._updateHeadersWidth();
    this._updateRowHeadersHeight();
};
_p.setShowRowHeaders = function (b) {
    if (this._showRowHeaders != b) {
        this._showRowHeaders = b;
        this._rowHeaders.setVisible(b);
        this._headerCorner.setVisible(this.getShowHeaders() && this.getShowRowHeaders());
        if (this.getCreated()) {
            if (this.getRightToLeft()) {
                this._gridBodyElement.style.paddingRight = this._getFillerWidth() + "px";
                this._gridBodyElement.style.paddingLeft = 0;
            } else {
                this._gridBodyElement.style.paddingLeft = this._getFillerWidth() + "px";
                this._gridBodyElement.style.paddingRight = 0;
            }
        }
        this._rowHeaders.setTop(this._getFillerHeight());
        this.updateHeadersWidth();
        if (b) this.updateRowHeadersHeight();
    }
};
_p.setRowHeadersWidth = function (n) {
    n = Math.max(0, n);
    if (this._rowHeadersWidth != n) {
        this._rowHeadersWidth = n;
        this._rowHeaders.setWidth(n);
        this._headerCorner.setWidth(n);
        this.updateHeadersWidth();
        if (this.getCreated()) {
            if (this.getRightToLeft()) this._gridBodyElement.style.paddingRight = n + "px";
            else this._gridBodyElement.style.paddingLeft = n + "px";
        }
    }
};
_p.updateColumns = function () {
    BiAbstractGrid.prototype.updateColumns.call(this);
    if (this.getCreated()) {
        this._updateRowHeadersHeight(500);
    }
};
_p.updateData = function () {
    BiAbstractGrid.prototype.updateData.call(this);
    if (this.getCreated()) {
        this._rowHeaders._setHeadersHtml(this.getRowHeadersHtml());
    }
};
_p.updateRowHeadersHeight = function () {
    if (this.getCreated() && this._rowHeaders.getCreated()) {
        this._rowHeaders.setHeight(this._gridBodyElement.clientHeight - this._getFillerHeight());
        this._rowHeaders.setScrollTop(this.getScrollTop());
    }
};
_p._updateRowHeadersHeight = function (n) {
    var t = this._updateRowHeadersHeightTimer;
    if (t) {
        t.stop();
        t.dispose();
    }
    t = new BiTimer(n || 1);
    this._updateRowHeadersHeightTimer = t;
    t.addEventListener("tick", function (e) {
        t.stop();
        this.updateRowHeadersHeight();
        t.dispose();
    }, this);
    t.start();
};
_p._getStyleRules = function () {
    var prefix = "#" + this.getHtmlProperty("id") + " ";
    var cols = this._columns;
    var colprefix = prefix + ".col-";
    var rs = [];
    var rule;
    for (var i = 0; i < this._columnCount; i++) {
        rule = [colprefix, i, "{"];
        if (!cols[i].getVisible()) rule.push("display:none;");
        else {
            rule.push("width:", this._columnWidths[i], "px;");
            if (this._columnAligns[i] != "left") rule.push("text-align:", this._columnAligns[i], ";");
        }
        rule.push("}");
        rs.push(rule.join(BiString.EMPTY));
    }
    rs.push([prefix, ".bi-grid-row { height:", this._rowHeight, "px;line-height:", this._rowHeight, "px;}"].join(BiString.EMPTY));
    rs.push([prefix, ".bi-grid-cell { height:", this._rowHeight, "px;line-height:", this._rowHeight, "px;}"].join(BiString.EMPTY));
    rs.push([prefix, ".grid-row-lead .bi-grid-cell { height:", this._rowHeight - 2, "px;line-height:", this._rowHeight - 2, "px;}"].join(BiString.EMPTY));
    rs.push([prefix, ".grid-cell-lead { line-height:", this._rowHeight - 2 + "px;}"].join(BiString.EMPTY));
    return rs;
};
_p.getRowHeadersHtml = function () {
    var cs = this._rows;
    var l = cs.length;
    var sb = new Array(l);
    for (var i = 0; i < l; i++) sb[i] = cs[i].getRowHeaderHtml();
    return sb.join("");
};
_p.setSelectionMode = function (s) {
    this._selectionModel.setSelectionMode(s);
};
_p.getSelectionMode = function () {
    return this._selectionModel.getSelectionMode();
};
_p._findItem = function (oValue, nStartIndex, sType) {
    var i;
    var items = this.getRows();
    if (nStartIndex == null) {
        var si = this.getSelectedNode();
        nStartIndex = items.indexOf(si);
        if (nStartIndex == -1) nStartIndex = 0;
    }
    var methodName = "matches" + sType;
    for (i = nStartIndex; i < items.length; i++) {
        if (items[i][methodName](oValue)) return items[i];
    }
    for (i = 0; i < nStartIndex; i++) {
        if (items[i][methodName](oValue)) return items[i];
    }
    return null;
};
_p._getMouseEventInfo = function (e, inEl) {
    var el = inEl || e._event.srcElement || e._event.target;
    if (el == null) return null;
    var res = {};
    var cellRe = /bi-grid-cell/;
    var cellEl = el;
    while (cellEl != null && !cellRe.test(cellEl.className)) {
        cellEl = cellEl.parentNode;
    }
    if (cellEl != null) {
        res.cellIndex = Number(cellEl.className.replace(/.*col-(\d+).*/, "$1"));
        el = cellEl;
        res.gridCell = this._getAllNodes()[el.id];
    } else {
        res.cellIndex = -1;
    }
    while (el != null && !/bi-grid-(node|row-header)/.test(el.className)) {
        el = el.parentNode;
    }
    if (el == null) return null;
    res.gridRow = this._getAllNodes()[el.id];
    return res;
};
_p._onMouseEvent = function (e) {
    if (e.getType() == "mousewheel") {
        if (BiBrowserCheck.moz) {
            this.setScrollTop(this.getScrollTop() - this._rowHeight * e.getWheelDelta());
            return;
        }
    }
    var info = this._getMouseEventInfo(e);
    if (info == null) return;
    var node;
    if (this._selectionModel._selectionMode == "row") node = info.gridRow;
    else if (this._selectionModel._selectionMode == "cell") node = info.gridCell;
    if (!node) return;
    switch (e.getType()) {
    case "mousedown":
        this._selectionModel.handleMouseDown(node, e);
        break;
    case "mouseup":
        this._selectionModel.handleMouseUp(node, e);
        break;
    case "click":
        this._selectionModel.handleClick(node, e);
        break;
    case "dblclick":
        this._selectionModel.handleDblClick(node, e);
        break;
    }
};
_p._onKeyDown = function (e) {
    this._selectionModel.handleKeyDown(e);
};
_p.setScrollTop = function (n) {
    BiAbstractGrid.prototype.setScrollTop.call(this, n);
    if (BiBrowserCheck.moz && this.getCreated()) this._rowHeaders.setScrollTop(this.getScrollTop());
};
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
    for (var i = 0; i < oChild._cells.length; i++) oChild._cells[i]._grid = this;
    this._clearCache();
};
_p.removeRow = function (oChild) {
    var i = this._rows.indexOf(oChild);
    return this.removeRowAt(i);
};
_p.removeRowAt = function (i) {
    var oChild = this._rows[i];
    if (oChild._grid != this) throw new Error("Can only remove children");
    this._rows.removeAt(i);
    oChild._grid = null;
    for (var j = oChild._cells.length - 1; j >= 0; j--) {
        oChild._cells[j]._grid = null;
    }
    this._clearCache();
    return oChild;
};
_p.getGrid = function () {
    return this;
};
_p.getFirstRow = function () {
    return this._rows[0];
};
_p.getLastRow = function () {
    return this._rows[this._rows.length - 1];
};
BiGrid.addProperty("rows", BiAccessType.READ);
_p.hasRows = function () {
    return this._rows.length > 0;
};
_p.removeAll = function () {
    this._selectionModel.deselectAll();
    for (var i = this._rows.length - 1; i >= 0; i--) {
        this.removeRowAt(i).dispose();
    }
};
_p.getCellAtPoint = function (nClientX, nClientY) {
    if (BiBrowserCheck.features.hasElementFromPoint) {
        var el = this._document.elementFromPoint(nClientX, nClientY);
        if (el == null) return null;
        var res = this._getMouseEventInfo(null, el);
        return res ? res.gridCell : null;
    } else {
        var x = nClientX - this.getClientLeft() - this.getInsetLeft();
        var y = nClientY - this.getClientTop() - this.getInsetTop();
        if (this._getFillerWidth() >= x || this._getFillerHeight() >= y) return null;
        x = x - this._getFillerWidth() + this.getScrollLeft();
        y = y - this._getFillerHeight() + this.getScrollTop();
        var rowIndex = Math.floor(y / this._rowHeight);
        var rows = this.getRows();
        if (rowIndex > rows.length) return null;
        var sum = 0;
        var cols = this._columnWidths;
        for (var i = 0; i < cols.length; i++) {
            if (sum + cols[this._columnOrders[i]] > x) return rows[rowIndex].getCells()[this._columnOrders[i]];
            sum += cols[this._columnOrders[i]];
        }
        return null;
    }
};
_p.getRowAtPoint = function (nClientX, nClientY) {
    if (BiBrowserCheck.features.hasElementFromPoint) {
        var el = this._document.elementFromPoint(nClientX, nClientY);
        if (el == null) return null;
        var res = this._getMouseEventInfo(null, el);
        return res ? res.gridRow : null;
    } else {
        var y = nClientY - this.getClientTop() - this.getInsetTop();
        if (this._getFillerHeight() >= y) return null;
        y = y - this._getFillerHeight() + this.getScrollTop();
        var rowIndex = Math.floor(y / this._rowHeight);
        var rows = this.getRows();
        if (rowIndex > rows.length) return null;
        return rows[rowIndex];
    }
};
BiGrid.addProperty("dataSource", BiAccessType.READ);
_p.setDataSource = function (oDs) {
    return BiList.prototype.setDataSource.apply(this, arguments);
};
_p.dataBind = function () {
    return BiList.prototype.dataBind.apply(this, arguments);
};
BiGrid.addProperty("currentDataPage", BiAccessType.READ);
_p.setCurrentDataPage = function (n) {
    return BiList.prototype.setCurrentDataPage.apply(this, arguments);
};
BiGrid.addProperty("dataPageSize", BiAccessType.READ);
_p.setDataPageSize = function (n) {
    return BiList.prototype.setDataPageSize.apply(this, arguments);
};
_p._dataSource = null;
_p._dataPageSize = null;
_p._dataPageCount = 1;
_p._currentDataPage = 0;
BiGrid.addProperty("dataPageCount", BiAccessType.READ);
_p._populateWithDataSource = function (e) {
    this.removeAll();
    this.sort(-1);
    var ds = this._dataSource;
    if (ds instanceof BiDataSet && ds.getTables().length == 0) {
        this.setColumnCount(0);
        this._dataPageSize = null;
        this._dataPageCount = 1;
        this._currentDataPage = 0;
    } else {
        if (ds instanceof BiDataSet) ds = ds.getTables()[0];
        var columns = ds.getColumns();
        var cols = columns.length;
        this.setColumnCount(cols);
        var x, colOrders = new Array(cols);
        for (x = 0; x < cols; x++) colOrders[x] = x;
        this.setColumnOrders(colOrders);
        var colNames = new Array(cols);
        for (x = 0; x < cols; x++) colNames[x] = columns[x].getName();
        this.setColumnNames(colNames);
        var sortTypes = new Array(cols);
        var aligns = new Array(cols);
        var dt;
        for (x = 0; x < cols; x++) {
            dt = columns[x].getDataType();
            sortTypes[x] = dt;
            aligns[x] = dt == "number" ? "right" : "left";
        }
        this.setColumnSortTypes(sortTypes);
        this.setColumnAligns(aligns);
        var rows = ds.getRows();
        var startIndex = 0;
        var endIndex = rows.length;
        var dps = this.getDataPageSize();
        if (dps != null && dps > 0) {
            this._dataPageCount = Math.max(1, Math.ceil(endIndex / dps));
            startIndex = dps * this._currentDataPage;
            if (startIndex + dps > endIndex) startIndex = endIndex - (endIndex % dps || dps);
            if (startIndex < 0) startIndex = 0;
            endIndex = Math.min(endIndex, startIndex + dps);
            this._currentDataPage = startIndex / dps;
        }
        for (var y = startIndex; y < endIndex; y++) this.addRow(this.createItemFromDataRow(rows[y]));
    }
    this.update();
    this._headers.layoutAllChildren();
    this.dispatchEvent("databind");
};
_p.createItemFromDataRow = function (oRow) {
    var cols = oRow.getTable().getColumns().length;
    var cellData = new Array(cols);
    for (var x = 0; x < cols; x++) {
        cellData[x] = oRow.getValueByIndex(x);
    }
    return new BiGridRow(cellData);
};
_p.addParsedObject = function (o) {
    if (o instanceof BiAbstractGridRow) this.addRow(o);
    else BiAbstractGrid.prototype.addParsedObject.call(this, o);
};
BiGrid._getArrayFromString = function (s, fCast) {
    var parts = s.split(/\s*,\s*/);
    if (fCast) {
        for (var i = 0; i < parts.length; i++) parts[i] = fCast(parts[i]);
    }
    return parts;
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
    case "rowHeadersWidth":
    case "columnOrders":
        this.setProperty(sName, BiGrid._getArrayFromString(sValue, Number));
        break;
    case "columnAligns":
    case "columnNames":
    case "columnSortTypes":
        this.setProperty(sName, BiGrid._getArrayFromString(sValue));
        break;
    default:
        BiAbstractGrid.prototype.setAttribute.apply(this, arguments);
    }
};

function BiGridRow(oData) {
    if (_biInPrototype) return;
    BiAbstractGridRow.call(this);
    this._data = oData;
    this._cells = [];
    if (oData) {
        var l = oData.length;
        for (var i = 0; i < l; i++) this.addCell(new this._gridCellConstructor(oData[i]));
    }
}
_p = _biExtend(BiGridRow, BiAbstractGridRow, "BiGridRow");
_p._gridCellConstructor = BiGridCell;
_p._icon = BiGrid.DEFAULT_ICON;
_p.getData = function (x) {
    return this._cells[x].getData();
};
_p.setData = function (x, oData) {
    this.getCell(x).setData(oData);
};
_p.getCell = function (nCol) {
    return this._cells[nCol];
};
BiGridRow.addProperty("cells", BiAccessType.READ);
_p.matchesString = function (sText, nCellIndex) {
    return sText != "" && BiLabel.htmlToText(this._cells[nCellIndex || 0].getHtml().toLowerCase()).indexOf(sText.toLowerCase()) == 0;
};
_p.matchesStringExact = function (sText, nCellIndex) {
    return sText != "" && BiLabel.htmlToText(this._cells[nCellIndex || 0].getHtml().toLowerCase()) == String(sText).toLowerCase();
};
_p.getHtml = function () {
    return "<div class=\"bi-grid-node\" id=\"" + this.toHashCode() + "\">" + this._getRowHtml() + "</div>";
};
_p._getRowHtml = function () {
    var grid = this.getGrid();
    var cells = this._cells;
    var sb = ["<div class=\"", this.getCssClassName(), "\"", this._getStyle(), ">"];
    var cols = grid._columns;
    var cox;
    for (var x = 0; x < cols.length; x++) {
        cox = grid._columnOrders[x];
        if (cols[cox].getVisible()) cells[cox]._buildHtml(sb);
    }
    sb.push("</div>");
    return sb.join(BiString.EMPTY);
};
_p.getCssClassName = function () {
    return "bi-grid-row grid-row" + (this._selected ? " grid-row-selected" : "") + (this._lead ? " grid-row-lead" : "");
};
_p.getRowHeaderHtml = function () {
    return '<div class="bi-grid-row-header grid-header" id="' + this.toHashCode() + '" style="height:' + this._grid._rowHeight + 'px;">' + this.getRowHeaderLabelHtml() + '</div>';
};
_p.getRowHeaderLabelHtml = function () {
    return this.getRowIndex();
};
_p.addCell = function (oChild, oBefore) {
    var g = this._grid;
    var r = oChild._row;
    if (oBefore == null) {
        if (r != null) r.removeCell(oChild);
        oChild._columnIndex = this._cells.length;
        this._cells.push(oChild);
    } else {
        if (oBefore._row != this) throw new Error("Can only add components before siblings");
        if (r != null) r.removeCell(oChild);
        this._cells.insertBefore(oChild, oBefore);
        for (var j = i; j < this._cells.length; j++) this._cells[j]._columnIndex = j;
    }
    oChild._row = this;
    oChild._grid = this._grid;
    if (g) g._clearCache();
};
_p.removeCell = function (oChild) {
    var g = this._grid;
    if (oChild._row != this) throw new Error("Can only remove children");
    this._cells.remove(oChild);
    for (var i = 0; i < this._cells.length; i++) this._cells[i]._columnIndex = i;
    oChild._grid = null;
    oChild._row = null;
    oChild._columnIndex = null;
    if (g) g._clearCache();
    return oChild;
};
_p.getRowIndex = function () {
    var p = this._grid;
    if (p == null) return -1;
    return p._rows.indexOf(this);
};
_p.getPreviousSiblingRow = function () {
    var p = this._grid;
    if (p == null) return null;
    var cs = p._rows;
    return cs[cs.indexOf(this) - 1];
};
_p.getNextSiblingRow = function () {
    var p = this._grid;
    if (p == null) return null;
    var cs = p._rows;
    return cs[cs.indexOf(this) + 1];
};
BiGridRow.addProperty("grid", BiAccessType.READ);
_p.dispose = function () {
    if (this._disposed) return;
    BiAbstractGridRow.prototype.dispose.call(this);
    this._element = null;
    this._grid = null;
    this._data = null;
    for (var i = this._cells.length - 1; i >= 0; i--) this._cells[i].dispose();
    this._cells = null;
    this._disposed = true;
};
_p._getAllNodes = function (oHash) {
    oHash[this.toHashCode()] = this;
    for (var i = 0; i < this._cells.length; i++) {
        oHash[this._cells[i].toHashCode()] = this._cells[i];
    }
};
_p.addParsedObject = function (o) {
    if (o instanceof BiGridCell) this.addCell(o);
    else BiAbstractGridRow.prototype.addParsedObject.call(this, o);
};

function BiGridCell(oData) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._data = oData;
    this._tagName = BiBrowserCheck.ie ? 'span' : 'div';
}
_p = _biExtend(BiGridCell, BiObject, "BiGridCell");
_p._selected = false;
_p._anchor = false;
_p._lead = false;
BiGridCell.addProperty("row", BiAccessType.READ);
BiGridCell.addProperty("columnIndex", BiAccessType.READ);
BiGridCell.addProperty("data", BiAccessType.READ_WRITE);
BiGridCell.addProperty("backColor", BiAccessType.READ_WRITE);
BiGridCell.addProperty("foreColor", BiAccessType.READ_WRITE);
BiGridCell.addProperty("bold", BiAccessType.READ_WRITE);
_p.getRowIndex = function () {
    return this._row.getRowIndex();
};
_p.getHtml = function () {
    var sb = [];
    this._buildHtml(sb);
    return sb.join(BiString.EMPTY);
};
_p._buildHtml = function (sb) {
    sb.push('<', this._tagName, ' id="', this.toHashCode(), '" class="', this.getCssClassName(), '" ', this._getStyle(), '>', this.isIconCell() ? this.getIconHtml() : '', this.getLabelHtml(), '</', this._tagName, '>');
};
_p.isIconCell = function () {
    return this.getGrid().getIconColumn() == this._columnIndex;
};
_p.getLabelHtml = function () {
    return String(this._data);
};
_p.getIcon = function () {
    return this._row.getIcon();
};
_p.getIconHtml = function () {
    var i = this.getIcon();
    if (!i) return "";
    if (i.getIconHtml) return i.getIconHtml(this.getLabelHtml() != "", true, "left", 3, "bi-grid-icon");
    else return "<img alt=\"\" class=\"bi-grid-icon\" src=\"" + i + "\">";
};
_p._getStyle = function () {
    if (!this._backColor && !this._foreColor && !this._bold) return "";
    return " style=\"" + (this._backColor ? "background-color:" + this._backColor + ";" : "") + (this._bold ? "font-weight:" + "bold" + ";" : "normal") + (this._foreColor ? "color:" + this._foreColor + ";" : "") + "\"";
};
_p.getGrid = function () {
    return this._grid;
};
_p.getCssClassName = function () {
    return "bi-grid-cell grid-cell col-" + this._columnIndex + (this._selected ? " grid-cell-selected" : "") + (this._lead ? " grid-cell-lead" : "");
};
_p._updateClassName = function () {
    if (!this.getCreated()) return;
    this._element.className = this.getCssClassName();
};
_p.getCreated = function () {
    var g = this.getGrid();
    if (!g || !g._gridCreated) return false;
    this._element = g._getGridElement(this);
    return this._element != null;
};
_p.update = function () {
    var g = this.getGrid();
    if (!this.getCreated() || !g) return;
    this._element.outerHTML = this.getHtml();
    g._clearCache();
};
_p.getHeight = function () {
    return this.getGrid().getRowHeight();
};
_p.getTop = function () {
    if (this.getCreated()) {
        var grid = this.getGrid();
        return BiComponent._getElementPositionInFrame(this._element).y - BiComponent._getElementPositionInFrame(grid._element).y + grid.getScrollTop() - grid.getInsetTop();
    }
};
_p.getWidth = function () {
    if (this.getCreated()) {
        return this._element.offsetWidth;
    }
};
_p.getLeft = function () {
    if (this.getCreated()) {
        var grid = this.getGrid();
        return BiComponent._getElementPositionInFrame(this._element).x - BiComponent._getElementPositionInFrame(grid._element).x + grid.getScrollLeft() - grid.getLeft();
    }
};
_p.scrollIntoViewX = function (bLeft) {
    if (!this.getCreated()) {
        return;
    }
    var p = this.getGrid();
    if (!p) return;
    var l = this.getLeft();
    var w = this.getWidth();
    var sl = p.getScrollLeft();
    var cw = p.getClientWidth();
    var fw = p._getFillerWidth();
    if (bLeft) p.setScrollLeft(l - fw);
    else if (bLeft == false) p.setScrollLeft(l + w - cw);
    else if (w > cw || l - fw < sl) p.setScrollLeft(l - fw);
    else if (l + w > sl + cw) p.setScrollLeft(l + w - cw);
};
_p.scrollIntoViewY = function (bTop) {
    this.getRow().scrollIntoViewY(bTop);
};
_p.scrollIntoView = function (bTopLeft) {
    this.scrollIntoViewX(bTopLeft);
    this.scrollIntoViewY(bTopLeft);
};
BiGridCell.addProperty("selected", BiAccessType.READ);
_p.setSelected = function (bSelected) {
    if (this._selected != bSelected) {
        var p;
        if ((p = this.getGrid()) != null) {
            p._selectionModel.setItemSelected(this, bSelected);
        }
        this._setSelected(bSelected);
    }
};
_p._setSelected = function (bSelected) {
    this._selected = bSelected;
    this._updateClassName();
};
_p._setAnchor = function (bAnchor) {
    this._anchor = bAnchor;
    this._updateClassName();
};
_p._setLead = function (bLead) {
    this._lead = bLead;
    this._updateClassName();
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
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this._element = null;
    this._row = null;
    this._data = null;
    this._disposed = true;
};

function BiGridSelectionModel(oGrid) {
    if (_biInPrototype) return;
    BiSelectionModel.call(this, oGrid);
}
_p = _biExtend(BiGridSelectionModel, BiSelectionModel, "BiGridSelectionModel");
_p._selectionMode = "row";
BiGridSelectionModel.addProperty("selectionMode", BiAccessType.READ);
_p.setSelectionMode = function (s) {
    if (this._selectionMode != s) {
        this._selectionMode = s;
        this.deselectAll();
        this.setLeadItem(null);
        this.setAnchorItem(null);
    }
};
_p.getItemSelected = function (oItem) {
    return oItem._selected;
};
_p.updateItemSelectionState = function (oItem, bSelected) {
    oItem._setSelected(bSelected);
};
_p.updateItemAnchorState = function (oItem, bAnchor) {
    oItem._setAnchor(bAnchor);
};
_p.updateItemLeadState = function (oItem, bLead) {
    oItem._setLead(bLead);
};
_p.getFirst = function () {
    if (this._selectionMode == "row") return this._owner.getFirstRow();
    else if (this._selectionMode == "cell") {
        var r = this._owner.getFirstRow();
        if (r) {
            var cols = this._owner.getColumns();
            var cox;
            var g = this._owner;
            for (var x = 0; x < cols.length; x++) {
                cox = g._columnOrders[x];
                if (cols[cox].getVisible()) return r.getCell(cox);
            }
        }
        return null;
    }
};
_p.getLast = function () {
    if (this._selectionMode == "row") return this._owner.getLastRow();
    else if (this._selectionMode == "cell") {
        var r = this._owner.getLastRow();
        if (r) {
            var cols = this._owner.getColumns();
            var cox;
            var g = this._owner;
            for (var x = cols.length - 1; x >= 0; x--) {
                cox = g._columnOrders[x];
                if (cols[cox].getVisible()) return r.getCell(cox);
            }
        }
        return null;
    }
};
_p.getItems = function () {
    if (this._selectionMode == "row") return this._owner.getRows();
    else if (this._selectionMode == "cell") {
        var res = [];
        var rows = this._owner.getRows();
        var cs;
        var cols = this._owner.getColumns();
        for (var y = 0; y < rows.length; y++) {
            cs = rows[y].getCells();
            for (var x = 0; x < cs.length; x++) {
                if (cols[x].getVisible()) res.push(cs[x]);
            }
        }
        return res;
    }
};
_p.getNext = function (oItem) {
    if (this._selectionMode == "row") return oItem.getNextSiblingRow();
    else {
        var r = oItem.getRow().getNextSiblingRow();
        if (r) return r.getCell(oItem.getColumnIndex());
        return null;
    }
};
_p.getPrevious = function (oItem) {
    if (this._selectionMode == "row") return oItem.getPreviousSiblingRow();
    else {
        var r = oItem.getRow().getPreviousSiblingRow();
        if (r) return r.getCell(oItem.getColumnIndex());
        return null;
    }
};
_p.isBefore = function (n1, n2) {
    if (this._selectionMode == "row") {
        var ns = n1.getGrid().getRows();
        return ns.indexOf(n1) < ns.indexOf(n2);
    } else {
        return n1.getRowIndex() <= n2.getRowIndex() && n1.getColumnIndex() < n2.getColumnIndex();
    }
};
_p._selectItemRange = function (item1, item2, bDeselect) {
    if (this._selectionMode == "row") BiListSelectionModel.prototype._selectItemRange.call(this, item1, item2, bDeselect);
    else if (this._selectionMode == "cell") {
        if (bDeselect) this._deselectAll();
        var g = item1.getGrid();
        var ri1 = item1.getRowIndex();
        var ci1 = item1.getColumnIndex();
        var vi1 = g._invertedColumnOrders[ci1];
        var ri2 = item2.getRowIndex();
        var ci2 = item2.getColumnIndex();
        var vi2 = g._invertedColumnOrders[ci2];
        var yMin = Math.min(ri1, ri2);
        var yMax = Math.max(ri1, ri2);
        var xMin = Math.min(vi1, vi2);
        var xMax = Math.max(vi1, vi2);
        var rows = this._owner.getRows();
        var cols = this._owner.getColumns();
        var c, cox;
        for (var y = yMin; y <= yMax; y++) {
            for (var x = xMin; x <= xMax; x++) {
                cox = g._columnOrders[x];
                if (cols[cox].getVisible()) c = rows[y].getCell(cox);
                c._setSelected(true);
                this._selectedItems.add(c);
            }
        }
    }
};
_p.getLeft = function (oItem) {
    if (this._selectionMode == "row") return BiListSelectionModel.prototype.getLeft.call(this, oItem);
    if (!oItem) return null;
    var g = this._owner;
    var r = oItem.getRow();
    var ci = oItem.getColumnIndex();
    var vi = g._invertedColumnOrders[ci];
    var cols = g.getColumns();
    var cox;
    for (var x = vi - 1; x >= 0; x--) {
        cox = g._columnOrders[x];
        if (cols[cox].getVisible()) return r.getCell(cox);
    }
    return null;
};
_p.getRight = function (oItem) {
    if (this._selectionMode == "row") return BiListSelectionModel.prototype.getRight.call(this, oItem);
    if (!oItem) return null;
    var g = this._owner;
    var r = oItem.getRow();
    var ci = oItem.getColumnIndex();
    var vi = g._invertedColumnOrders[ci];
    var cols = g.getColumns();
    var cox;
    for (var x = vi + 1; x < cols.length; x++) {
        cox = g._columnOrders[x];
        if (cols[cox].getVisible()) return r.getCell(cox);
    }
    return null;
};
_p.getUp = function (oItem) {
    if (!oItem) return this.getLast();
    if (this._selectionMode == "row") return oItem.getPreviousSiblingRow();
    else {
        if (!oItem) return null;
        var r = oItem.getRow().getPreviousSiblingRow();
        if (r) return r.getCell(oItem.getColumnIndex());
        return null;
    }
};
_p.getDown = function (oItem) {
    if (!oItem) return this.getFirst();
    var row = oItem.getRow ? oItem.getRow() : oItem;
    if (this._selectionMode == "row") return row.getNextSiblingRow();
    else {
        if (!oItem) return null;
        var r = row.getNextSiblingRow();
        if (r) {
            var ci = oItem.getColumnIndex ? oItem.getColumnIndex() : 0;
            return r.getCell(ci);
        }
        return null;
    }
};
_p.getHome = function (oItem) {
    oItem = this._leadItem;
    if (this._selectionMode == "row") return this.getFirst();
    if (!oItem) return null;
    var g = oItem.getGrid();
    var r = oItem.getRow();
    var cols = g.getColumns();
    var cox;
    for (var x = 0; x < cols.length; x++) {
        cox = g._columnOrders[x];
        if (cols[cox].getVisible()) return r.getCell(cox);
    }
    return null;
};
_p.getCtrlHome = function (oItem) {
    if (this._selectionMode == "row") return this.getHome();
    var g = this._owner;
    var r = g.getFirstRow();
    var cols = g.getColumns();
    var cox;
    for (var x = 0; x < cols.length; x++) {
        cox = g._columnOrders[x];
        if (cols[cox].getVisible()) return r.getCell(cox);
    }
    return null;
};
_p.getEnd = function (oItem) {
    if (this._selectionMode == "row") return this.getLast();
    if (!oItem) return null;
    var g = oItem.getGrid();
    var r = oItem.getRow();
    var cols = g.getColumns();
    var cox;
    for (var x = cols.length - 1; x >= 0; x--) {
        cox = g._columnOrders[x];
        if (cols[cox].getVisible()) return r.getCell(cox);
    }
    return null;
};
_p.getCtrlEnd = function (oItem) {
    if (this._selectionMode == "row") return this.getEnd();
    var g = this._owner;
    var r = g.getLastRow();
    var cols = g.getColumns();
    var cox;
    for (var x = cols.length - 1; x >= 0; x--) {
        cox = g._columnOrders[x];
        if (cols[cox].getVisible()) return r.getCell(cox);
    }
    return null;
};
_p.getPageUp = function (oItem) {
    var vpTop = this._owner.getScrollTop();
    var next;
    if (!this._leadItem) next = this.getFirst();
    else next = this._leadItem;
    var fillerHeight = this._owner._getFillerHeight();
    var tries = 0;
    while (tries < 2) {
        while (next && (next.getTop() - next.getHeight() - fillerHeight >= vpTop)) next = this.getUp(next);
        if (next == null) {
            tries = 2;
            break;
        }
        if (next != this._leadItem) break;
        this._owner.setScrollTop(vpTop - this._owner.getClientHeight() - next.getHeight());
        vpTop = this._owner.getScrollTop();
        tries++;
    }
    return next;
};