/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiOlapGridCellInfo() {
    if (_biInPrototype) return;
    BiObject.call(this);
}
_p = _biExtend(BiOlapGridCellInfo, BiObject, "BiOlapGridCellInfo");
_p._header = false;
_p._body = false;
BiOlapGridCellInfo.addProperty("header", BiAccessType.READ_WRITE);
BiOlapGridCellInfo.addProperty("body", BiAccessType.READ_WRITE);
BiOlapGridCellInfo.addProperty("row", BiAccessType.READ_WRITE);
BiOlapGridCellInfo.addProperty("column", BiAccessType.READ_WRITE);
BiOlapGridCellInfo.addProperty("dimension", BiAccessType.READ_WRITE);
BiOlapGridCellInfo.addProperty("axis", BiAccessType.READ_WRITE);
BiOlapGridCellInfo.addProperty("axisPosition", BiAccessType.READ_WRITE);
BiOlapGridCellInfo.addProperty("quadrant", BiAccessType.READ_WRITE);
_p.equals = function (oInfo) {
    return this._axis == oInfo._axis && (this._header && oInfo._header && this._dimension == oInfo._dimension && this._axisPosition == oInfo._axisPosition || this._body && oInfo._body && this._row == oInfo._row && this._column == oInfo._column);
};

function BiOlapGridDropMarker() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setBackColor("highlight");
}
_p = _biExtend(BiOlapGridDropMarker, BiComponent, "BiOlapGridDropMarker");
_p.showDimensionDropMarker = function (grid, info, before) {
    var vm = grid.getViewManager();
    if (this.getParent() != grid) grid.add(this, null, true);
    var left, right;
    if (info.getAxis() == 0) {
        if (before) this.setTop(vm.getDimensionTop(info.getDimension()) - 1);
        else this.setTop(vm.getDimensionTop(info.getDimension()) + vm.getDimensionHeight(info.getDimension()) - 1);
        this.setHeight(2);
        this.setBottom(null);
        left = vm.getShowHeaders(1) ? vm.getAxisWidth() : 0;
        right = 0;
    } else {
        if (before) left = vm.getDimensionLeft(info.getDimension()) - 1;
        else left = vm.getDimensionLeft(info.getDimension()) + vm.getDimensionWidth(info.getDimension()) - 1;
        this.setWidth(2);
        right = null;
        this.setTop(vm.getShowHeaders(0) ? vm.getAxisHeight() : 0);
        this.setBottom(0);
    } if (grid.getRightToLeft()) {
        this.setRight(left);
        this.setLeft(right);
    } else {
        this.setLeft(left);
        this.setRight(right);
    }
};
_p.hide = function () {
    if (this._parent) this._parent.remove(this);
};

function BiOlapGridDragEvent(sType, oDragEvent) {
    if (_biInPrototype) return;
    BiDragEvent.call(this, sType, oDragEvent && oDragEvent._event);
};
_p = _biExtend(BiOlapGridDragEvent, BiDragEvent, "BiOlapGridDragEvent");
BiOlapGridDragEvent.BEFORE = 1;
BiOlapGridDragEvent.AFTER = 2;
BiOlapGridDragEvent.OVER = 3;
_p.initEvent = function (oSrc, oDst, nRelative) {
    this._sourceInfo = oSrc;
    this._destinationInfo = oDst;
    this._relative = nRelative || BiOlapGridDragEvent.OVER;
};
BiOlapGridDragEvent.addProperty("destinationInfo", BiAccessType.READ);
BiOlapGridDragEvent.addProperty("sourceInfo", BiAccessType.READ);
BiOlapGridDragEvent.addProperty("relative", BiAccessType.READ);
_p.dispose = function () {
    if (this._disposed) return;
    BiDragEvent.prototype.dispose.call(this);
    delete this._sourceInfo;
    delete this._destinationInfo;
    delete this._relative;
};

function BiOlapGrid() {
    if (_biInPrototype) return;
    BiTreeViewBase.call(this);
    this.setCssClassName("bi-olap-grid");
    this.setAppearance("olap-grid");
    this._selectionModel = new BiOlapGridSelectionModel(this);
    this._stateManager = new BiOlapGridStateManager;
    this._viewManager = new BiOlapGridViewManager(this);
    this._invalidSelectionAreas = new BiAreaCollection;
    if (!this._useNativeScrollBars) {
        this._vScrollBar.setUnitIncrement(19);
    }
    this._stateManager.addEventListener("hoverchanged", this._onHoverChanged, this);
}
_p = _biExtend(BiOlapGrid, BiTreeViewBase, "BiOlapGrid");
_p.dispose = function () {
    if (this._disposed) return;
    BiTreeViewBase.prototype.dispose.call(this);
    this._invalidSelectionAreas.dispose();
    this._invalidSelectionAreas = null;
};
_p._allowHeaderSelection = true;
BiOlapGrid.addProperty("allowHeaderSelection", BiAccessType.WRITE);
_p.getAllowHeaderSelection = function () {
    return this._allowHeaderSelection && !this.getCanReorganizeDimensions();
};
_p.setViewManager = function (o) {
    if (o) o._olapGrid = this;
    this._viewManager = o;
};
_p.setDataModel = function (dm) {
    if (this._dataModel != dm) {
        if (this._dataModel) {
            this._dataModel.removeEventListener("datachanged", this._onDataChanged, this);
            this._dataModel.removeEventListener("beforedatastructurechanged", this._onBeforeDataStructureChanged, this);
            this._dataModel.removeEventListener("datastructurechanged", this._onDataStructureChanged, this);
        }
        this._dataModel = dm;
        if (dm != null) {
            dm.addEventListener("datachanged", this._onDataChanged, this);
            dm.addEventListener("beforedatastructurechanged", this._onBeforeDataStructureChanged, this);
            dm.addEventListener("datastructurechanged", this._onDataStructureChanged, this);
        }
        this._resetUpdateCache();
        this._viewManager.resetCache();
        this._forceMeasure = true;
        this.updateContentSize();
        this.updateSize();
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
            if (this._gridFixedTopElement && this._gridFixedTopElement.lastChild && /bi-olap-grid-body-content/.test(this._gridFixedTopElement.lastChild.className)) this._gridFixedTopElement.lastChild.scrollTop = 0;
            if (this._gridFixedCornerElement && this._gridFixedCornerElement.lastChild && /bi-olap-grid-body-content/.test(this._gridFixedCornerElement.lastChild.className)) this._gridFixedCornerElement.lastChild.scrollTop = 0;
        }
        this._updateGrid();
        this.dispatchEvent("scroll");
    }
};
_p.updateContentSize = function () {
    var vm = this.getViewManager();
    if (!this.getCreated()) return;
    if (this._useNativeScrollBars) {
        var cw = this._gridBodyElement.clientWidth;
        var ch = this._gridBodyElement.clientHeight;
        this._gridBodyFillerElement.style.width = vm.getVisibleCellsWidth() + "px";
        this._gridBodyFillerElement.style.height = vm.getVisibleCellsHeight() + "px";
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
    var fixedLeftWidth = vm.getFixedLeftWidth();
    var fixedTopHeight = vm.getFixedTopHeight();
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
    this._gridBodyContentElement.style.width = Math.max(0, availWidth - fixedLeftWidth) + "px";
    this._gridBodyContentElement.style.left = rtl ? scrollBarWidth : fixedLeftWidth + "px";
    if (fixedLeftWidth > 0) {
        this._gridFixedLeftElement.style.display = "block";
        this._gridFixedCornerElement.style.display = "block";
        this._gridFixedLeftElement.style.width = Math.min(availWidth, fixedLeftWidth) + "px";
        this._gridFixedCornerElement.style.width = Math.min(availWidth, fixedLeftWidth) + "px";
        this._gridFixedLeftElement.style.height = Math.max(0, availHeight - fixedTopHeight) + "px";
        this._gridFixedLeftElement.style.top = fixedTopHeight + "px";
        this._gridFixedLeftElement.style.left = this._gridFixedCornerElement.style.left = rtl ? clientWidth - fixedLeftWidth + "px" : 0;
    } else {
        this._gridFixedLeftElement.style.display = "none";
        this._gridFixedCornerElement.style.display = "none";
    } if (fixedTopHeight > 0) {
        this._gridFixedTopElement.style.display = "block";
        this._gridFixedTopElement.style.height = Math.min(availHeight, fixedTopHeight) + "px";
        this._gridFixedTopElement.style.width = Math.max(0, availWidth - fixedLeftWidth) + "px";
        this._gridFixedTopElement.style.left = rtl ? scrollBarWidth : fixedLeftWidth + "px";
        if (fixedLeftWidth > 0) {
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
_p._doCustomOverflow = function () {
    if (!this.getCreated()) {
        return;
    }
    var vm = this.getViewManager();
    var dm = this.getDataModel();
    var contentWidth = vm.getVisibleCellsWidth(0);
    var clientWidth = this._element.clientWidth;
    var availWidth = clientWidth;
    var contentHeight = dm ? vm.getVisibleCellsHeight(1) : 0;
    var clientHeight = this._element.clientHeight;
    var availHeight = clientHeight;
    var vpw = this._vScrollBar.getPreferredWidth();
    var hph = this._hScrollBar.getPreferredHeight();
    var rtl = this.getRightToLeft();
    contentWidth += vm.getFixedLeftWidth();
    contentHeight += vm.getFixedTopHeight();
    var ox = this.getOverflowX();
    var oy = this.getOverflowY();
    var hVis, vVis;
    var oldVisV = this._vScrollBar.getVisible();
    var oldVisH = this._hScrollBar.getVisible();
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
    this._beginScrollBatch();
    this._syncScrollBars();
    this._vScrollBar.setExtent(availHeight);
    this._hScrollBar.setExtent(availWidth);
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
_p.getHtmlCode = function (nStartCol, nStartRow, nWidth, nHeight) {
    this._createUpdateCache();
    var uc = this._updateCache;
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    var sm = this._selectionModel;
    if (!dm) return "";
    var axis = 0;
    var rowCount = dm.getAxisPositionWidth(1 - axis);
    var colCount = dm.getAxisPositionWidth(axis);
    var ieNoBr = uc.ieNoBr;
    var ieNoBrClose = uc.ieNoBrClose;
    var sb = [];
    var yPos = 0;
    var xPos, w, my, mx, rowHeight;
    mx = nStartCol;
    if (mx != null) {
        my = nStartRow;
        while (my != null && my < rowCount && yPos < nHeight) {
            rowHeight = vm.getCellHeight(my);
            sb.push("<tr class=\"", "\" style=\"height:", rowHeight, "px\">");
            mx = nStartCol;
            xPos = 0;
            while (mx != null && mx < colCount && xPos < nWidth) {
                w = vm.getCellWidth(mx);
                sb.push("<td style=\"width:", (w - vm.getCellPaddingX()), "px;height:", rowHeight, "px;", dm.getCellStyle(mx, my), "\" class=\"", (sm.getCellSelected(mx, my) ? "selected" : ""), (sm.getCellIsLead(mx, my) ? " lead" : ""), (sm.getCellIsAnchor(mx, my) ? " anchor" : ""), "\">", ieNoBr, (dm.getHasIcon(mx, my) ? "<img alt=\"\" src=\"" + dm.getIcon(mx, my) + "\" style=\"" + dm.getIconStyle(mx, my) + "\" class=\"icon\">" : ""), dm.getCellText(mx, my), ieNoBrClose, "</td>");
                if (this._getHasAttachedComponent(mx, my)) {
                    var ac = this._getAttachedComponent(mx, my);
                    this._attachedComponents[ac.toHashCode()] = {
                        col: mx,
                        row: my,
                        width: w,
                        height: rowHeight,
                        component: ac
                    };
                }
                xPos += w;
                mx = vm.getNextVisibleCell(axis, mx);
            }
            if (xPos < nWidth) sb.push("<td class=\"horizontal-filler\" style=\"width:", (nWidth - xPos), "px;", dm.getFillerCellStyle(mx, my), "\">&nbsp;</td>");
            sb.push("</tr>");
            yPos += rowHeight;
            my = vm.getNextVisibleCell(1 - axis, my);
        }
        if (yPos < nHeight) {
            mx = nStartCol;
            xPos = 0;
            sb.push("<tr style=\"height:", (nHeight - yPos), "px;\" class=\"vertical-filler\">");
            while (mx != null && xPos < nWidth) {
                w = vm.getCellWidth(mx);
                sb.push("<td style=\"width:", (w - vm.getCellPaddingX()), "px;", dm.getFillerCellStyle(mx, my), "\"", ">&nbsp;</td>");
                xPos += w;
                mx = vm.getNextVisibleCell(mx);
            }
            if (xPos < nWidth) sb.push("<td class=\"horizontal-filler\" style=\"width:", (nWidth - xPos), "px;", dm.getFillerCellStyle(mx, my), "\">&nbsp;</td>");
            sb.push("</tr>");
        }
    }
    sb.push("</tbody></table>");
    return "<table cellspacing=\"0\" class=\"bi-olap-grid-table\" style=\"width:" + xPos + "px\"><tbody class=\"" + (vm.getShowGridLines() ? "bi-show-grid-lines" : "") + (this.getContainsFocus() ? " focused" : "") + "\">" + sb.join("");
};
_p.getFixedTopHtmlCode = function (nScrollLeft, nWidth, nHeight) {
    this._createUpdateCache();
    var uc = this._updateCache;
    var vm = this.getViewManager();
    var axis = 0;
    var headerHeight = vm.getAxisHeight();
    var fixedTopHeight = vm.getFixedTopHeight();
    var contentHeight = fixedTopHeight - headerHeight;
    if (fixedTopHeight <= 0 || nWidth <= 0) {
        return "";
    } else if (headerHeight >= nHeight) {
        return this.getHeadersHtmlCode(uc.startCol, nWidth, headerHeight);
    } else {
        var startRow = vm.getFixedCell(1 - axis);
        if (!vm.getCellVisible(1 - axis, startRow)) startRow = vm.getNextVisibleCell(1 - axis, startRow);
        if (startRow == null || startRow >= vm.getNonFixedCell(1 - axis)) return this.getHeadersHtmlCode(uc.startCol, nWidth, headerHeight);
        else return this.getHeadersHtmlCode(uc.startCol, nWidth, headerHeight) + "<div class=\"bi-olap-grid-body-content bi-olap-grid-fixed-bottom-border\" " + "style=\"left:0;top:" + headerHeight + "px;" + "width:" + nWidth + "px;" + "height:" + contentHeight + "px;\">" + this.getHtmlCode(uc.startCol, startRow, nWidth, contentHeight) + "</div>";
    }
};
_p.getHeadersHtmlCode = function (nStartCol, nWidth, nHeight) {
    this._createUpdateCache();
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    var axis = 0;
    var dimCount = dm.getAxisDimensionCount(axis);
    var sb = [];
    var mx, xPos, my, yPos, h, w, dist, deltaLeft;
    var fillerLeftPos = 0;
    var fillerLeft = 0;
    var minStart = Infinity;
    var maxWidth = nWidth;
    var leftProp = this.getRightToLeft() ? "right" : "left";
    my = vm.getFirstVisibleDimension(axis);
    if (dm != null && my != null && nStartCol != null) {
        for (yPos = 0; my != null && my < dimCount && yPos < nHeight; my = vm.getNextDimension(axis, my), yPos += h) {
            h = vm.getDimensionHeight(my);
            xPos = 0;
            mx = nStartCol;
            fillerLeft = 0;
            var startPos = vm.getAxisCellStartPosition(axis, my, mx);
            minStart = vm.getMinCellPosition(axis, startPos, minStart);
            dist = vm.getAxisPositionDistance(axis, minStart, startPos);
            if (dist > 0) {
                fillerLeftPos = dist;
                fillerLeft = vm.getCellLeft(startPos) - vm.getCellLeft(minStart);
                xPos += fillerLeft;
            }
            mx = startPos;
            deltaLeft = vm.getCellLeft(nStartCol) - vm.getCellLeft(minStart);
            while (mx != null && xPos < nWidth + deltaLeft) {
                w = vm.getAxisCellWidth(my, mx);
                sb.push("<div style=\"width:", w, "px;", "height:", h, "px;", "top:", yPos, "px;", leftProp, ":", xPos, "px;", dm.getAxisCellStyle(axis, my, mx), "\"", " class=\"grid-header\">", dm.getAxisCellText(axis, my, mx), "</div>");
                xPos += w;
                mx = vm.getNextAxisPosition(axis, my, mx);
            }
            maxWidth = Math.max(maxWidth, xPos);
            if (xPos < nWidth + deltaLeft) {
                sb.push("<div class=\"filler grid-header\" style=\"width:", (nWidth + deltaLeft - xPos), "px;", leftProp, ":", xPos, "px;", "top:", yPos, "px;", "height:", h, "px;", "\"></div>");
                xPos += nWidth - xPos + deltaLeft;
            }
            maxWidth = Math.max(maxWidth, xPos);
        }
    }
    sb.push("</div>");
    return "<div class=\"bi-olap-grid-headers-table\" style=\"width:" + (maxWidth + deltaLeft) + "px;" + leftProp + ":" + (-fillerLeft) + "px;position:relative;\">" + sb.join("");
};
_p.getFixedLeftHtmlCode = function (nScrollTop, nWidth, nHeight) {
    this._createUpdateCache();
    var uc = this._updateCache;
    var vm = this.getViewManager();
    var axis = 1;
    var rowHeaderWidth = vm.getAxisWidth();
    var fixedLeftWidth = vm.getFixedLeftWidth();
    var contentWidth = fixedLeftWidth - rowHeaderWidth;
    if (fixedLeftWidth <= 0 || nHeight <= 0) {
        return "";
    } else if (rowHeaderWidth >= nWidth) {
        return this.getRowHeadersHtmlCode(uc.startRow, rowHeaderWidth, nHeight);
    } else {
        var startCol = vm.getFixedCell(1 - axis);
        if (!vm.getCellVisible(1 - axis, startCol)) startCol = vm.getNextVisibleCell(1 - axis, startCol);
        if (startCol == null || startCol >= vm.getNonFixedCell(1 - axis)) {
            return this.getRowHeadersHtmlCode(uc.startRow, rowHeaderWidth, nHeight);
        } else {
            return this.getRowHeadersHtmlCode(uc.startRow, rowHeaderWidth, nHeight) + "<div class=\"bi-olap-grid-body-content bi-olap-grid-fixed-right-border\" " + "style=\"left:" + rowHeaderWidth + "px;top:0;" + "width:" + contentWidth + "px;" + "height:" + nHeight + "px;\">" + this.getHtmlCode(startCol, uc.startRow, contentWidth, nHeight) + "</div>";
        }
    }
};
_p.getRowHeadersHtmlCode = function (nStartRow, nWidth, nHeight) {
    this._createUpdateCache();
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    var axis = 1;
    var dimCount = dm.getAxisDimensionCount(axis);
    var sb = [];
    var mx, xPos, my, yPos, h, w, dist, deltaTop;
    var fillerTopPos = 0;
    var fillerTop = 0;
    var minStart = Infinity;
    var maxHeight = nHeight;
    var leftProp = this.getRightToLeft() ? "right" : "left";
    mx = vm.getFirstVisibleDimension(axis);
    if (dm != null && mx != null && nStartRow != null) {
        for (xPos = 0; mx != null && mx < dimCount && xPos < nWidth; mx = vm.getNextDimension(axis, mx), xPos += w) {
            w = vm.getDimensionWidth(mx);
            yPos = 0;
            my = nStartRow;
            fillerTop = 0;
            var startPos = vm.getAxisCellStartPosition(axis, mx, my);
            minStart = vm.getMinCellPosition(axis, startPos, minStart);
            dist = vm.getAxisPositionDistance(axis, minStart, startPos);
            if (dist > 0) {
                fillerTopPos = dist;
                fillerTop = vm.getCellTop(startPos) - vm.getCellTop(minStart);
                yPos += fillerTop;
            }
            my = startPos;
            deltaTop = vm.getCellTop(nStartRow) - vm.getCellTop(minStart);;
            while (my != null && yPos < nHeight + deltaTop) {
                h = vm.getAxisCellHeight(mx, my);
                sb.push("<div style=\"width:", w, "px;", "height:", h, "px;", "top:", yPos, "px;", leftProp, ":", xPos, "px;", dm.getAxisCellStyle(axis, mx, my), "\"", " class=\"grid-header\">", dm.getAxisCellText(axis, mx, my), "</div>");
                yPos += h;
                my = vm.getNextAxisPosition(axis, mx, my);
            }
            maxHeight = Math.max(maxHeight, yPos);
            if (yPos < nHeight + deltaTop) {
                sb.push("<div class=\"filler grid-header\" style=\"height:", (nHeight + deltaTop - yPos), "px;", leftProp, ":", xPos, "px;", "top:", yPos, "px;", "width:", w, "px;", "\"></div>");
                yPos += nHeight - yPos + deltaTop;
            }
            maxHeight = Math.max(maxHeight, yPos);
        }
    }
    sb.push("</div>");
    return "<div class=\"bi-olap-grid-headers-table\" style=\"height:" + (maxHeight + deltaTop) + "px;top:" + (-fillerTop) + "px;position:relative;\">" + sb.join("");
};
_p.getFixedCornerHtmlCode = function (nWidth, nHeight) {
    this._createUpdateCache();
    var vm = this.getViewManager();
    var axis = 0;
    var rowHeaderWidth = vm.getAxisWidth();
    var headerHeight = vm.getAxisHeight();
    var fixedTopHeight = Math.min(nHeight, vm.getFixedTopHeight());
    var fixedLeftWidth = Math.min(nWidth, vm.getFixedLeftWidth());
    var contentWidth = fixedLeftWidth - rowHeaderWidth;
    var contentHeight = fixedTopHeight - headerHeight;
    var s = "";
    if (contentWidth > 0) {
        s += "<div class=\"bi-olap-grid-headers bi-olap-grid-fixed-right-border\" " + "style=\"top:0;left:" + rowHeaderWidth + "px;" + "width:" + contentWidth + "px;height:" + headerHeight + "px;\">" + this.getHeadersHtmlCode(vm.getFixedCell(axis), contentWidth, headerHeight) + "</div>";
    }
    if (contentHeight > 0) {
        s += "<div class=\"bi-olap-grid-row-headers bi-olap-grid-fixed-bottom-border\" " + "style=\"left:0;top:" + headerHeight + "px;" + "width:" + rowHeaderWidth + "px;height:" + contentHeight + "px;\">" + this.getRowHeadersHtmlCode(vm.getFixedCell(1 - axis), rowHeaderWidth, contentHeight) + "</div>";
    }
    if (contentHeight > 0 || contentWidth > 0) {
        var startRow = vm.getFixedCell(1 - axis);
        var startCol = vm.getFixedCell(axis);
        if (!vm.getCellVisible(axis, startCol)) startCol = vm.getNextVisibleCell(axis, startCol);
        if (!vm.getCellVisible(1 - axis, startRow)) startRow = vm.getNextVisibleCell(axis, startRow);
        if (!(startCol == null || startRow == null || startCol >= vm.getNonFixedCell(axis) || startRow >= vm.getNonFixedCell(1 - axis))) {
            s += "<div class=\"bi-olap-grid-body-content bi-olap-grid-fixed-right-border bi-olap-grid-fixed-bottom-border\" " + "style=\"left:" + rowHeaderWidth + "px;top:" + headerHeight + "px;" + "width:" + contentWidth + "px;" + "height:" + contentHeight + "px;\">" + this.getHtmlCode(startCol, startRow, contentWidth, contentHeight) + "</div>";
        }
    }
    return s;
};
_p._updateGrid = function (bForceContainer, bForceHeader, bForceRowHeader) {
    if (!this.getCreated()) return;
    var vm = this.getViewManager();
    var container = this._gridBodyContentElement;
    var headers = this._gridFixedTopElement;
    var rowHeaders = this._gridFixedLeftElement;
    var corner = this._gridFixedCornerElement;
    this._createUpdateCache();
    var uc = this._updateCache;
    var scrollLeft = uc.scrollLeft;
    var scrollTop = uc.scrollTop;
    var clientWidth = uc.clientWidth;
    var clientHeight = uc.clientHeight;
    var startRow = uc.startRow;
    var startCol = uc.startCol;
    var fixedTopHeight = vm.getFixedTopHeight();
    var fixedLeftWidth = vm.getFixedLeftWidth();
    clientWidth = Math.max(0, uc.scrollClientWidth - fixedLeftWidth);
    clientHeight = Math.max(0, uc.scrollClientHeight - fixedTopHeight);
    if (startCol != this._lastStartCol || startRow != this._lastStartRow || bForceContainer) {
        container.innerHTML = this.getHtmlCode(startCol, startRow, clientWidth, clientHeight);
    }
    if (fixedTopHeight > 0 && (startCol != this._lastStartCol || bForceHeader)) headers.innerHTML = this.getFixedTopHtmlCode(scrollLeft, clientWidth, uc.realClientHeight);
    if (fixedLeftWidth > 0 && (startRow != this._lastStartRow || bForceRowHeader)) rowHeaders.innerHTML = this.getFixedLeftHtmlCode(scrollTop, uc.realClientWidth, clientHeight);
    if (bForceHeader || bForceRowHeader) corner.innerHTML = this.getFixedCornerHtmlCode(uc.realClientWidth, uc.realClientHeight);
    this._updateAttachedComponents();
    this._lastStartCol = startCol;
    this._lastStartRow = startRow;
    this._invalidSelectionAreas.removeAll();
    this._resetUpdateCache();
};
_p.getScrollTop = function () {
    var vm = this.getViewManager();
    if (this.getCreated() && vm) {
        var axis = 1;
        return vm.getCellTop(vm.getFirstViewCell(axis)) - vm.getCellTop(vm.getNonFixedCell(axis));
    }
    return 0;
};
_p.getScrollLeft = function () {
    var vm = this.getViewManager();
    if (this.getCreated() && vm) {
        var axis = 0;
        return vm.getCellLeft(vm.getFirstViewCell(axis)) - vm.getCellLeft(vm.getNonFixedCell(axis));
    }
    return 0;
};
_p.getScrollWidth = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    if (this._useNativeScrollBars) {
        return this._gridBodyElement.scrollWidth;
    } else {
        var vm = this.getViewManager();
        return vm.getVisibleCellsWidth(0) + vm.getFixedLeftWidth();
    }
};
_p.getScrollHeight = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    if (this._useNativeScrollBars) {
        return this._gridBodyElement.scrollHeight;
    } else {
        var vm = this.getViewManager();
        return vm.getVisibleCellsHeight(0) + vm.getFixedTopHeight();
    }
};
_p._create = function (oDoc) {
    BiComponent.prototype._create.call(this, oDoc);
    this._gridBodyElement = this._document.createElement("DIV");
    this._gridBodyElement.className = "bi-olap-grid-body";
    this._gridBodyElement.onscroll = BiTreeViewBase.__onBiTreeViewBaseScroll;
    this._element.appendChild(this._gridBodyElement);
    if (this._useNativeScrollBars) {
        this._addNativeScrollBars();
    }
    this._gridBodyContentElement = this._document.createElement("DIV");
    this._gridBodyContentElement.className = "bi-olap-grid-body-content";
    this._element.appendChild(this._gridBodyContentElement);
    this._gridFixedTopElement = this._document.createElement("DIV");
    this._gridFixedTopElement.className = "bi-olap-grid-headers";
    this._element.appendChild(this._gridFixedTopElement);
    this._gridFixedLeftElement = this._document.createElement("DIV");
    this._gridFixedLeftElement.className = "bi-olap-grid-row-headers";
    this._element.appendChild(this._gridFixedLeftElement);
    this._gridFixedCornerElement = this._document.createElement("DIV");
    this._gridFixedCornerElement.className = "bi-olap-grid-header-corner";
    this._element.appendChild(this._gridFixedCornerElement);
    this._updateOverflow();
    this._updateCanSelect();
};
_p._addNativeScrollBars = function () {
    BiTreeViewBase.prototype._addNativeScrollBars.call(this);
    this._gridBodyFillerElement.className = "bi-olap-grid-body-filler";
};
_p._updateCellSelected = function (x, y, bHtml) {
    var dm = this.getDataModel();
    var sm = this.getSelectionModel();
    var td = this._getTd(x, y);
    if (td) {
        var bSelected = sm.getCellSelected(x, y);
        var bLead = sm.getCellIsLead(x, y);
        var bAnchor = sm.getCellIsAnchor(x, y);
        td.className = (bSelected ? "selected" : "") + (bLead ? " lead" : "") + (bAnchor ? " anchor" : "");
        if (bHtml) {
            var uc = this._updateCache;
            td.innerHTML = uc.ieNoBr + (dm.getHasIcon(x, y) ? "<img alt=\"\" src=\"" + dm.getIcon(x, y) + "\" style=\"" + dm.getIconStyle(x, y) + "\" class=\"icon\">" : "") + dm.getCellText(x, y) + uc.ieNoBrClose;
        }
        var style = dm.getCellStyle(x, y);
        if (style != "") {
            var width = td.style.width;
            var height = td.style.height;
            td.style.cssText = style;
            td.style.width = width;
            td.style.height = height;
        }
        this._updateAttachedComponent(x, y);
    }
    this._resetUpdateCache();
};
_p._updateAreaSelected = function (oArea) {
    this._invalidSelectionAreas.add(oArea);
};
_p._getTd = function (x, y) {
    var dm = this.getDataModel();
    var vm = this.getViewManager();
    var axis = 0;
    if (this._contentSizeDirty || !this.getCreated() || !dm) return null;
    vm.resetCache();
    this._resetUpdateCache();
    this._createUpdateCache();
    var uc = this._updateCache;
    var startRow = uc.startRow;
    var startCol = uc.startCol;
    if (x >= dm.getAxisPositionWidth(axis) || y >= dm.getAxisPositionWidth(1 - axis)) return null;
    var table, tr, td, rowIndex, colIndex;
    if (x < vm._nonFixedCell[axis]) {
        if (y < vm._nonFixedCell[1 - axis]) {
            table = this._gridFixedCornerElement.lastChild.firstChild;
            rowIndex = vm.getVisibleCellIndex(1 - axis, y) - vm.getVisibleCellIndex(1 - axis, vm._fixedCell[1 - axis]);
            colIndex = vm.getVisibleCellIndex(axis, x) - vm.getVisibleCellIndex(axis, vm._fixedCell[axis]);
        } else if (y >= startRow) {
            table = this._gridFixedLeftElement.childNodes[1].firstChild;
            rowIndex = vm.getVisibleCellIndex(1 - axis, y) - vm.getVisibleCellIndex(1 - axis, startRow);
            colIndex = vm.getVisibleCellIndex(axis, x) - vm.getVisibleCellIndex(axis, vm._fixedCell[axis]);
        }
    } else {
        if (y < vm._nonFixedCell[1 - axis] && x >= startCol) {
            table = this._gridFixedTopElement.childNodes[1].firstChild;
            rowIndex = vm.getVisibleCellIndex(1 - axis, y) - vm.getVisibleCellIndex(1 - axis, vm._fixedCell[1 - axis]);
            colIndex = vm.getVisibleCellIndex(axis, x) - vm.getVisibleCellIndex(axis, startCol);
        } else if (y >= startRow && x >= startCol) {
            table = this._gridBodyContentElement.firstChild;
            rowIndex = vm.getVisibleCellIndex(1 - axis, y) - vm.getVisibleCellIndex(1 - axis, startRow);
            colIndex = vm.getVisibleCellIndex(axis, x) - vm.getVisibleCellIndex(axis, startCol);
        }
    }
    try {
        if (table && rowIndex != -1 && colIndex != -1) {
            if (rowIndex != null) {
                tr = table.tBodies[0].rows[rowIndex];
                if (tr) {
                    if (colIndex != null) {
                        td = tr.cells[colIndex];
                    }
                }
            }
        }
    } catch (ex) {
        return null;
    }
    return td;
};
_p._createUpdateCache = function () {
    if (BiBrowserCheck.moz && this._updateCache) return;
    var vm = this.getViewManager();
    var axis = 0;
    var startCol = vm.getFirstViewCell(axis);
    var startRow = vm.getFirstViewCell(1 - axis);
    var scrollLeft, scrollTop, clientWidth, clientHeight, scrollClientHeight, scrollClientWidth, realClientWidth, realClientHeight;
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
    realClientWidth = this._element.clientWidth;
    realClientHeight = this._element.clientHeight;
    this._updateCache = {
        startRow: startRow,
        startCol: startCol,
        ieNoBr: (BiBrowserCheck.ie ? "<nobr>" : ""),
        ieNoBrClose: (BiBrowserCheck.ie ? "</nobr>" : ""),
        ieExtraPadding: BiBrowserCheck.ie ? 3 : 0,
        scrollLeft: scrollLeft,
        scrollTop: scrollTop,
        clientHeight: clientHeight,
        clientWidth: clientWidth,
        scrollClientHeight: scrollClientHeight,
        scrollClientWidth: scrollClientWidth,
        realClientWidth: realClientWidth,
        realClientHeight: realClientHeight,
        colCount: vm.getVisibleCellsCount(axis),
        rowCount: vm.getVisibleCellsCount(1 - axis)
    };
};
_p._onMouseWheel = function (e) {
    var st1 = this._getInternalScrollTop();
    this._setInternalScrollTop(st1 - 19 * e.getWheelDelta());
    var st2 = this._getInternalScrollTop();
    if (BiBrowserCheck.moz && st1 != st2 && this._useNativeScrollBars) {
        if (this._onBiOlapGridScroll) this._onBiOlapGridScroll();
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
    var sm = this._stateManager;
    if (e.getType() == "contextmenu") {
        this._onContextMenu(e, info);
    }
    if (!info.getHeader() && !info.getBody()) {
        sm.updateState(e.getType(), null, e);
        return;
    }
    sm.updateState(e.getType(), info, e);
    if (e.getType() == "mouseout" || e.getType() == "mouseover") return;
    if (info.getHeader()) {
        this._handleHeaderMouseEvent(e, info);
        return;
    }
    this._mouseSelect(e, info);
    this._updateInvalidSelectionState();
};
_p._mouseSelect = function (e, info, type) {
    if (!type) type = e.getType();
    var a = new BiArea;
    var dm = this.getDataModel();
    if (info.getHeader()) {
        if (info.getAxis() == 0) {
            a.setLeft(info.getAxisPosition());
            a.setWidth(dm.getAxisCellWidth(info.getAxis(), info.getDimension(), info.getAxisPosition()));
            a.setTop(0);
            a.setHeight(Infinity);
        } else {
            a.setTop(info.getAxisPosition());
            a.setHeight(dm.getAxisCellWidth(info.getAxis(), info.getDimension(), info.getAxisPosition()));
            a.setLeft(0);
            a.setWidth(Infinity);
        }
    } else {
        if (info.getColumn() == null) {
            a.setLeft(0);
            a.setWidth(Infinity);
        } else {
            a.setLeft(info.getColumn());
        } if (info.getRow() == null) {
            a.setTop(0);
            a.setHeight(Infinity);
        } else {
            a.setTop(info.getRow());
        }
    }
    var me = e._mouseEvent || e;
    switch (type) {
    case "mousedown":
        this._selectionModel.handleMouseDown(a, me);
        break;
    case "mouseup":
        this._selectionModel.handleMouseUp(a, me);
        break;
    case "click":
        this._selectionModel.handleClick(a, me);
        break;
    case "dblclick":
        this._selectionModel.handleDblClick(a, me);
        if (info.getBody()) this._startEditing(a, e);
        break;
    case "mouseover":
        this._selectionModel.handleMouseOver(a, me);
        break;
    }
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
    sm.handleKeyDown(e);
    this._updateInvalidSelectionState();
};
_p._updateInvalidSelectionState = function () {
    var dm = this.getDataModel();
    var axis = 0;
    var cols = dm.getAxisPositionWidth(axis);
    var rows = dm.getAxisPositionWidth(1 - axis);
    var areas = this._invalidSelectionAreas.toArray();
    var area, startX, startY, endX, endY;
    var hash = {};
    for (var i = 0; i < areas.length; i++) {
        area = areas[i];
        startY = area.getTop();
        endY = startY + area.getHeight();
        startX = area.getLeft();
        endX = startX + area.getWidth();
        for (var y = startY; y < endY && y < rows; y++) {
            for (var x = startX; x < endX && x < cols; x++) {
                hash[x + "-" + y] = {
                    x: x,
                    y: y
                };
            }
        }
    }
    for (var key in hash) {
        this._updateCellSelected(hash[key].x, hash[key].y);
        delete hash[key];
    }
    this._invalidSelectionAreas.removeAll();
};
_p._onContextMenu = function (e, info) {
    if (!this._useNativeScrollBars) {
        var target = e.getTarget();
        if (this._hScrollBar.contains(target) || this._vScrollBar.contains(target)) {
            return;
        }
    }
    var dm = this.getDataModel();
    this._dataModelContextMenu = null;
    if (info.getBody()) this._dataModelContextMenu = dm.getContextMenu(info.getColumn(), info.getRow());
    else if (info.getHeader()) this._dataModelContextMenu = dm.getAxisContextMenu(info.getAxis(), info.getDimension(), info.getAxisPosition());
};
_p._onMouseMove = function (e) {
    if (!this._useNativeScrollBars) {
        var target = e.getTarget();
        if (this._hScrollBar.contains(target) || this._vScrollBar.contains(target)) {
            return;
        }
    }
    var info;
    info = this.getCellInfoFromMouseEvent(e);
    var x = e.getClientX() - this.getClientLeft() - this.getInsetLeft();
    var y = e.getClientY() - this.getClientTop() - this.getInsetTop();
    if (info.getHeader()) {
        var resInfo = this._getResizeInfo(x, y, info);
        var ie55 = BiBrowserCheck.ie && BiBrowserCheck.versionNumber == 5.5;
        if (info.getQuadrant() == 1) {
            if (!resInfo.dir) this._gridFixedTopElement.style.cursor = "";
            else this._gridFixedTopElement.style.cursor = ie55 ? "hand" : BiResizeHandle._getCursor(resInfo.dir);
        } else if (info.getQuadrant() == 3) {
            if (!resInfo.dir) this._gridFixedLeftElement.style.cursor = "";
            else this._gridFixedLeftElement.style.cursor = ie55 ? "hand" : BiResizeHandle._getCursor(resInfo.dir);
        } else if (info.getQuadrant() == 2) {
            if (!resInfo.dir) this._gridFixedCornerElement.style.cursor = "";
            else this._gridFixedCornerElement.style.cursor = ie55 ? "hand" : BiResizeHandle._getCursor(resInfo.dir);
        }
    } else {
        this._gridFixedTopElement.style.cursor = "";
        this._gridFixedLeftElement.style.cursor = "";
        this._gridFixedCornerElement.style.cursor = "";
    }
    this._stateManager.setHover(info, e);
};
_p.getCellInfo = function (nOffsetX, nOffsetY) {
    var vm = this.getViewManager();
    var res = new BiOlapGridCellInfo;
    var axis = 0;
    var cell, headersWidth, headersHeight, dim, pos;
    var x = nOffsetX;
    var y = nOffsetY;
    var rtl = this.getRightToLeft();
    if (rtl) x = this._gridBodyElement.offsetWidth - x;
    var clientHeight = this._gridBodyElement.clientHeight;
    if (y < 0 || y > clientHeight) return res;
    var realClientWidth = this._element.clientWidth;
    var clientWidth = this._gridBodyElement.clientWidth;
    if (x < 0 || x > clientWidth || x > realClientWidth) return res;
    if (x > vm.getFixedLeftWidth() && y > vm.getFixedTopHeight()) {
        res._quadrant = 4;
        res._axis = axis;
        x -= vm.getFixedLeftWidth() - this.getScrollLeft();
        y -= vm.getFixedTopHeight() - this.getScrollTop();
        cell = vm.getCellAt(x, y, vm.getNonFixedCell(axis), vm.getNonFixedCell(1 - axis));
        res._body = true;
        res._row = cell.y;
        res._column = cell.x;
    } else if (x > vm.getFixedLeftWidth()) {
        res._quadrant = 1;
        res._axis = axis;
        headersHeight = vm.getAxisHeight();
        if (y > headersHeight) {
            x -= vm.getFixedLeftWidth() - this.getScrollLeft();
            y -= headersHeight;
            cell = vm.getCellAt(x, y, vm.getNonFixedCell(axis), vm.getFixedCell(1 - axis));
            res._body = true;
            res._row = cell.y;
            res._column = cell.x;
        } else {
            x -= vm.getFixedLeftWidth() - this.getScrollLeft();
            dim = vm.getDimensionAt(axis, y);
            pos = vm._getCellAt(axis, x, vm.getNonFixedCell(axis));
            res._column = pos;
            pos = vm.getAxisCellStartPosition(axis, dim, pos);
            res._dimension = dim;
            res._axisPosition = pos;
            res._header = true;
        }
    } else if (y > vm.getFixedTopHeight()) {
        res._quadrant = 3;
        headersWidth = vm.getAxisWidth();
        if (x > headersWidth) {
            y -= vm.getFixedTopHeight() - this.getScrollTop();
            x -= headersWidth;
            cell = vm.getCellAt(x, y, vm.getFixedCell(axis), vm.getNonFixedCell(1 - axis));
            res._axis = axis;
            res._body = true;
            res._row = cell.y;
            res._column = cell.x;
        } else {
            y -= vm.getFixedTopHeight() - this.getScrollTop();
            dim = vm.getDimensionAt(1 - axis, x);
            pos = vm._getCellAt(1 - axis, y, vm.getNonFixedCell(1 - axis));
            res._row = pos;
            pos = vm.getAxisCellStartPosition(1 - axis, dim, pos);
            res._axis = 1 - axis;
            res._dimension = dim;
            res._axisPosition = pos;
            res._header = true;
        }
    } else {
        res._quadrant = 2;
        headersWidth = vm.getAxisWidth();
        headersHeight = vm.getAxisHeight();
        if (x > headersWidth && y > headersHeight) {
            y -= headersHeight;
            x -= headersWidth;
            cell = vm.getCellAt(x, y, vm.getFixedCell(axis), vm.getFixedCell(1 - axis));
            res._axis = axis;
            res._body = true;
            res._row = cell.y;
            res._column = cell.x;
        } else if (x > headersWidth) {
            x -= headersWidth;
            dim = vm.getDimensionAt(axis, y);
            pos = vm._getCellAt(axis, x, vm.getFixedCell(axis));
            res._column = pos;
            pos = vm.getAxisCellStartPosition(axis, dim, pos);
            res._axis = axis;
            res._dimension = dim;
            res._axisPosition = pos;
            res._header = true;
        } else if (y > headersHeight) {
            y -= headersHeight;
            dim = vm.getDimensionAt(1 - axis, x);
            pos = vm._getCellAt(1 - axis, y, vm.getFixedCell(1 - axis));
            res._row = pos;
            pos = vm.getAxisCellStartPosition(1 - axis, dim, pos);
            res._axis = 1 - axis;
            res._dimension = dim;
            res._axisPosition = pos;
            res._header = true;
        } else {}
    }
    return res;
};
_p._getResizeInfo = function (x, y, info) {
    var res = {
        dir: "",
        axis: info.getAxis(),
        dimension: info.getDimension(),
        axisPosition: null
    };
    if (!info.getHeader() || info.getAxisPosition() == null || info.getDimension() == null) return res;
    var pos, left, top, width, height;
    var vm = this.getViewManager();
    var rtl = this.getRightToLeft();
    if (rtl) x = this._gridBodyElement.offsetWidth - x;
    if (info.getAxisPosition() == null) return res;
    if (info.getQuadrant() == 1) {
        left = vm.getCellLeft(info.getAxisPosition()) - vm.getCellLeft(vm.getNonFixedCell(info.getAxis()));
        width = vm.getAxisCellWidth(info.getDimension(), info.getAxisPosition());
        x -= vm.getFixedLeftWidth();
        x += this.getScrollLeft();
        if (x - left <= 5) {
            pos = info.getAxisPosition();
            pos = vm.getPreviousVisibleCell(info.getAxis(), pos);
            if (pos == null || pos < vm.getFirstViewCell(info.getAxis())) return res;
            pos = vm.getAxisCellStartPosition(info.getAxis(), info.getDimension(), pos);
            res.dir = rtl ? "w" : "e";
            res.axisPosition = pos;
        } else if (left + width - x <= 5) {
            res.dir = rtl ? "w" : "e";
            res.axisPosition = info.getAxisPosition();
        }
    } else if (info.getQuadrant() == 3) {
        top = vm.getCellTop(info.getAxisPosition()) - vm.getCellTop(vm.getNonFixedCell(info.getAxis()));
        height = vm.getAxisCellHeight(info.getDimension(), info.getAxisPosition());
        y -= vm.getFixedTopHeight();
        y += this.getScrollTop();
        if (y - top <= 5) {
            pos = info.getAxisPosition();
            pos = vm.getPreviousVisibleCell(info.getAxis(), pos);
            if (pos == null || pos < vm.getFirstViewCell(info.getAxis())) return res;
            pos = vm.getAxisCellStartPosition(info.getAxis(), info.getDimension(), pos);
            res.dir = "s";
            res.axisPosition = pos;
        } else if (top + height - y <= 5) {
            res.dir = "s";
            res.axisPosition = info.getAxisPosition();
        }
    } else if (info.getQuadrant() == 2) {
        if (info.getAxis() == 0) {
            left = vm.getCellLeft(info.getAxisPosition()) - vm.getCellLeft(vm.getFixedCell(info.getAxis()));
            width = vm.getAxisCellWidth(info.getDimension(), info.getAxisPosition());
            x -= vm.getAxisWidth();
            if (x - left <= 5) {
                pos = info.getAxisPosition();
                pos = vm.getPreviousVisibleCell(info.getAxis(), pos);
                if (pos == null || pos < vm.getFixedCell(info.getAxis())) return res;
                pos = vm.getAxisCellStartPosition(info.getAxis(), info.getDimension(), pos);
                res.dir = rtl ? "w" : "e";
                res.axisPosition = pos;
            } else if (left + width - x <= 5) {
                res.dir = rtl ? "w" : "e";
                res.axisPosition = info.getAxisPosition();
            }
        } else {
            top = vm.getCellTop(info.getAxisPosition()) - vm.getCellTop(vm.getFixedCell(info.getAxis()));
            height = vm.getAxisCellHeight(info.getDimension(), info.getAxisPosition());
            y -= vm.getAxisHeight();
            if (y - top <= 5) {
                pos = info.getAxisPosition();
                pos = vm.getPreviousVisibleCell(info.getAxis(), pos);
                if (pos == null || pos < vm.getFixedCell(info.getAxis())) return res;
                pos = vm.getAxisCellStartPosition(info.getAxis(), info.getDimension(), pos);
                res.dir = "s";
                res.axisPosition = pos;
            } else if (top + height - y <= 5) {
                res.dir = "s";
                res.axisPosition = info.getAxisPosition();
            }
        }
    }
    return res;
};
_p._handleHeaderMouseEvent = function (e, info) {
    var vm;
    var doSelect = true;
    switch (e.getType()) {
    case "mousedown":
        if (e.getButton() != BiMouseEvent.LEFT) return;
        vm = this.getViewManager();
        var x = e.getClientX() - this.getClientLeft() - this.getInsetLeft();
        var y = e.getClientY() - this.getClientTop() - this.getInsetTop();
        var resInfo = this._resizeInfo = this._getResizeInfo(x, y, info);
        if (resInfo.dir && resInfo.axisPosition != null) {
            this._stateManager.setActive(null, e);
            info.setAxisPosition(resInfo.axisPosition);
            if (!this._resizeOutline) {
                this._resizeOutline = new BiOlapGridResizeOutline;
                this._resizeOutline.addEventListener("resize", this._onColumnResize, this);
                this._resizeOutline.addEventListener("resizeend", this._onColumnResizeEnd, this);
            }
            var bounds = this.getCellInfoBounds(info);
            if (this.getRightToLeft()) this._resizeOutline.setBounds(this._gridBodyElement.offsetWidth - bounds.left, bounds.top, bounds.width, bounds.height);
            else this._resizeOutline.setBounds(bounds.left, bounds.top, bounds.width, bounds.height);
            this._resizeOutline.setResizeDirection(resInfo.dir);
            this.add(this._resizeOutline);
            this._resizeOutline.startResize(resInfo.dir, e);
            e.preventDefault();
            doSelect = false;
        }
        break;
    }
    if (doSelect && this.getAllowHeaderSelection()) {
        this._mouseSelect(e, info);
        this._updateInvalidSelectionState();
    }
};
_p._onHoverChanged = function (e) {
    this._hideDataModelToolTip();
    var sm = this._stateManager;
    var dm = this.getDataModel();
    var axis = 0;
    var tt, x, y;
    var info = sm.getHover();
    this._dataModelToolTip = null;
    if (info.getBody()) {
        x = info.getColumn();
        y = info.getRow();
        var colCount = dm.getAxisPositionWidth(axis);
        var rowCount = dm.getAxisPositionWidth(1 - axis);
        if (x != null && y != null && x >= 0 && x < colCount && y >= 0 && y < rowCount) {
            tt = dm.getToolTip(x, y);
        }
        this._mouseSelect(e, info, "mouseover");
        this._updateInvalidSelectionState();
    } else if (info.getHeader()) {
        tt = dm.getAxisToolTip(info.getAxis(), info.getDimension(), info.getAxisPosition());
        this._mouseSelect(e, info, "mouseover");
        this._updateInvalidSelectionState();
    }
    if (BiBrowserCheck.ie && !tt && info.getBody()) {
        x = info.getColumn();
        y = info.getRow();
        var td = this._getTd(x, y);
        if (td && td.firstChild.scrollWidth > td.firstChild.clientWidth) tt = BiToolTip.getTextToolTip(BiLabel.htmlToText(dm.getCellText(x, y)));
    }
    if (tt) {
        this._dataModelToolTip = tt;
        tt._startShowTimer();
    }
};
_p._hideDataModelToolTip = function () {
    if (this._dataModelToolTip) {
        this._dataModelToolTip.setVisible(false);
        this._dataModelToolTip = null;
    }
};
_p._onColumnResizeEnd = function (e) {
    var vm = this.getViewManager();
    var dm = this.getDataModel();
    var changed = false;
    var resInfo = this._resizeInfo;
    var axis = resInfo.axis;
    var count, visCount, lastVis;
    if (axis == 0) {
        var w = this._resizeOutline.getWidth();
        var oldW = vm.getAxisCellWidth(resInfo.dimension, resInfo.axisPosition);
        var minWidth = vm.getCellMinimumWidth();
        count = dm.getAxisCellWidth(resInfo.axis, resInfo.dimension, resInfo.axisPosition);
        visCount = vm.getAxisCellPositionWidth(axis, resInfo.dimension, resInfo.axisPosition);
        lastVis = vm.getPreviousVisibleCell(axis, resInfo.axisPosition + count);
        var cw = vm.getCellWidth(lastVis);
        var newW = Math.max(minWidth, cw + w - oldW);
        if (cw != newW) {
            vm.setCellWidth(lastVis, newW);
            changed = true;
        }
    } else {
        var h = this._resizeOutline.getHeight();
        var oldH = vm.getAxisCellHeight(resInfo.dimension, resInfo.axisPosition);
        var minHeight = vm.getCellMinimumHeight();
        count = dm.getAxisCellWidth(resInfo.axis, resInfo.dimension, resInfo.axisPosition);
        visCount = vm.getAxisCellPositionWidth(axis, resInfo.dimension, resInfo.axisPosition);
        lastVis = vm.getPreviousVisibleCell(axis, resInfo.axisPosition + count);
        var ch = vm.getCellHeight(lastVis);
        var newH = Math.max(minHeight, ch + h - oldH);
        if (ch != newH) {
            vm.setCellHeight(lastVis, newH);
            changed = true;
        }
    }
    this.remove(this._resizeOutline);
    this._resizeInfo = null;
    if (changed) {}
    this._gridFixedTopElement.style.cursor = "";
    this._gridFixedLeftElement.style.cursor = "";
    this._gridFixedCornerElement.style.cursor = "";
    if (changed) {
        this.invalidateLayout();
    }
};
_p._beforeSupportsDrop = function (e) {
    var info = this.getCellInfoFromMouseEvent(e);
    this._stateManager.setDragOver(info, e);
};
_p.getDropDataTypes = function () {
    if (this._dropDataTypes) return this._dropDataTypes;
    var dm = this.getDataModel();
    var sm = this._stateManager;
    var info = sm.getDragOver();
    var axis = info.getAxis();
    if (info.getBody()) {
        return dm.getDropDataTypes(info.getColumn(), info.getRow()) || [];
    } else if (info.getHeader()) {
        if (this.getCanReorganizeDimensions()) {
            var dndm = new BiDragAndDropManager();
            if (dndm.getSource() == this) {
                var info2 = dndm.getData("bindows/BiOlapGridCellInfo");
                if (info2 && info2.getHeader()) {
                    return ["bindows/BiOlapGridCellInfo"];
                }
            }
        }
        return dm.getAxisDropDataTypes(axis, info.getDimension(), info.getAxisPosition()) || [];
    }
    return [];
};
BiOlapGrid.addProperty("canReorganizeDimensions", BiAccessType.READ);
_p.setCanReorganizeDimensions = function (b) {
    if (this._canReorganizeDimensions != b) {
        this._canReorganizeDimensions = b;
        if (b) {
            this.addEventListener("dragstart", this._onDimDragStart);
            this.addEventListener("dragmove", this._onDimDragMove);
            this.addEventListener("dragout", this._onDimDragOut);
            this.addEventListener("dragdrop", this._onDimDragDrop);
        } else {
            this.removeEventListener("dragstart", this._onDimDragStart);
            this.removeEventListener("dragmove", this._onDimDragMove);
            this.removeEventListener("dragout", this._onDimDragOut);
            this.removeEventListener("dragdrop", this._onDimDragDrop);
        }
    }
};
_p._onDimDragStart = function (e) {
    var g = e.getTarget();
    if (g != this) return;
    var info = g.getStateManager().getDrag();
    if (info.getHeader()) {
        e.addData("bindows/BiOlapGridCellInfo", info);
        e.addAction("move");
        e.startDrag();
        if (!this._dropMarker) {
            this._dropMarker = new BiOlapGridDropMarker;
        }
        this._dropMarker.showDimensionDropMarker(g, info, this._shouldDropBefore(g, info, e));
    }
};
_p._onDimDragMove = function (e) {
    var g = e.getTarget();
    if (g != this) return;
    var info = g.getStateManager().getDragOver();
    if (info.getHeader()) {
        this._dropMarker.showDimensionDropMarker(g, info, this._shouldDropBefore(g, info, e));
    }
};
_p._onDimDragOut = function (e) {
    this._dropMarker.hide();
};
_p._onDimDragDrop = function (e) {
    var g = e.getTarget();
    var dst = g.getStateManager().getDragOver();
    var before = this._shouldDropBefore(g, dst, e);
    var src = e.getData("bindows/BiOlapGridCellInfo");
    var relPos;
    if (before) relPos = BiOlapGridDragEvent.BEFORE;
    else relPos = BiOlapGridDragEvent.AFTER;
    var e2 = new BiOlapGridDragEvent("dimensiondrop", e);
    e2.initEvent(src, dst, relPos);
    this.dispatchEvent(e2);
    e2.dispose();
};
_p._shouldDropBefore = function (g, info, e) {
    var vm = g.getViewManager();
    if (info.getAxis() == 0) {
        var top = vm.getDimensionTop(info.getDimension());
        var height = vm.getDimensionHeight(info.getDimension());
        var y = e.getClientY() - g.getClientTop() - g.getInsetTop();
        return y - top < height / 2;
    } else {
        var left = vm.getDimensionLeft(info.getDimension());
        var width = vm.getDimensionWidth(info.getDimension());
        var x = e.getClientX() - g.getClientLeft() - g.getInsetLeft();
        return x - left < width / 2;
    }
};
_p.getCellInfoBounds = function (oCellInfo) {
    var x, y, w, h;
    var vm = this.getViewManager();
    var axis = oCellInfo.getAxis();
    if (oCellInfo.getQuadrant() == 4) {
        x = vm.getCellLeft(oCellInfo.getColumn()) - vm.getCellLeft(vm.getNonFixedCell(axis));
        y = vm.getCellTop(oCellInfo.getRow()) - vm.getCellTop(vm.getNonFixedCell(1 - axis));
        x -= this.getScrollLeft();
        y -= this.getScrollTop();
        x += vm.getFixedLeftWidth();
        y += vm.getFixedTopHeight();
        w = vm.getCellWidth(oCellInfo.getColumn());
        h = vm.getCellHeight(oCellInfo.getRow());
    } else if (oCellInfo.getQuadrant() == 1) {
        if (oCellInfo.getBody()) {
            x = vm.getCellLeft(oCellInfo.getColumn()) - vm.getCellLeft(vm.getNonFixedCell(axis));
            y = vm.getCellTop(oCellInfo.getRow()) - vm.getCellTop(vm.getFixedCell(1 - axis));
            x -= this.getScrollLeft();
            x += vm.getFixedLeftWidth();
            y += vm.getAxisHeight();
            w = vm.getCellWidth(oCellInfo.getColumn());
            h = vm.getCellHeight(oCellInfo.getRow());
        } else if (oCellInfo.getHeader()) {
            x = vm.getCellLeft(oCellInfo.getAxisPosition()) - vm.getCellLeft(vm.getNonFixedCell(axis));
            y = vm.getDimensionTop(oCellInfo.getDimension());
            x -= this.getScrollLeft();
            x += vm.getFixedLeftWidth();
            w = vm.getAxisCellWidth(oCellInfo.getDimension(), oCellInfo.getAxisPosition());
            h = vm.getDimensionHeight(oCellInfo.getDimension());
        }
    } else if (oCellInfo.getQuadrant() == 3) {
        if (oCellInfo.getBody()) {
            x = vm.getCellLeft(oCellInfo.getColumn()) - vm.getCellLeft(vm.getFixedCell(axis));
            y = vm.getCellTop(oCellInfo.getRow()) - vm.getCellTop(vm.getNonFixedCell(1 - axis));
            y -= this.getScrollTop();
            y += vm.getFixedTopHeight();
            x += vm.getAxisWidth();
            w = vm.getCellWidth(oCellInfo.getColumn());
            h = vm.getCellHeight(oCellInfo.getRow());
        } else if (oCellInfo.getHeader()) {
            y = vm.getCellTop(oCellInfo.getAxisPosition()) - vm.getCellTop(vm.getNonFixedCell(axis));
            x = vm.getDimensionLeft(oCellInfo.getDimension());
            y -= this.getScrollTop();
            y += vm.getFixedTopHeight();
            h = vm.getAxisCellHeight(oCellInfo.getDimension(), oCellInfo.getAxisPosition());
            w = vm.getDimensionWidth(oCellInfo.getDimension());
        }
    } else {
        if (oCellInfo.getBody()) {
            x = vm.getCellLeft(oCellInfo.getColumn()) - vm.getCellLeft(vm.getFixedCell(axis));
            y = vm.getCellTop(oCellInfo.getRow()) - vm.getCellTop(vm.getFixedCell(1 - axis));
            x += vm.getAxisWidth();
            y += vm.getAxisHeight();
            w = vm.getCellWidth(oCellInfo.getColumn());
            h = vm.getCellHeight(oCellInfo.getRow());
        } else if (oCellInfo.getHeader()) {
            if (oCellInfo.getAxis() == 0) {
                x = vm.getCellLeft(oCellInfo.getAxisPosition()) - vm.getCellLeft(vm.getFixedCell(axis));
                y = vm.getDimensionTop(oCellInfo.getDimension());
                x += vm.getAxisWidth();
                w = vm.getAxisCellWidth(oCellInfo.getDimension(), oCellInfo.getAxisPosition());
                h = vm.getDimensionHeight(oCellInfo.getDimension());
            } else {
                y = vm.getCellTop(oCellInfo.getAxisPosition()) - vm.getCellTop(vm.getFixedCell(axis));
                x = vm.getDimensionLeft(oCellInfo.getDimension());
                y += vm.getAxisHeight();
                h = vm.getAxisCellHeight(oCellInfo.getDimension(), oCellInfo.getAxisPosition());
                w = vm.getDimensionWidth(oCellInfo.getDimension());
            }
        }
    }
    return {
        left: x,
        top: y,
        width: w,
        height: h
    };
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
    var obj, c, x, y, row, col, axis, clipWidth, clipHeight;
    axis = 0;
    var axisHeight = vm.getShowHeaders(axis) ? vm.getAxisHeight() : 0;
    var axisWidth = vm.getShowHeaders(1 - axis) ? vm.getAxisWidth() : 0;
    var nonFixedRow = vm.getNonFixedCell(1 - axis);
    var nonFixedCol = vm.getNonFixedCell(axis);
    scrollLeft = this.getScrollLeft();
    scrollTop = this.getScrollTop();
    var iem = this.getInlineEditModel();
    if (iem) iem.addEventListener("beforehide", this._preventHide);
    for (hc in this._attachedComponents) {
        obj = this._attachedComponents[hc];
        c = obj.component;
        row = obj.row;
        col = obj.col;
        axis = obj.axis;
        if (!this._getHasAttachedComponent(col, row)) {
            this._removeAttachedComponent(hc);
        } else {
            x = vm.getCellLeft(col) + axisWidth - (col >= nonFixedCol ? scrollLeft : 0);
            y = vm.getCellTop(row) + axisHeight - (row >= nonFixedRow ? scrollTop : 0);
            if (row >= nonFixedRow && row < startRow || col >= nonFixedCol && col < startCol) {
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
    var axis = 0;
    var dm = this.getDataModel();
    if (x >= dm.getAxisPositionWidth(axis) || y >= dm.getAxisPositionWidth(1 - axis)) {
        return false;
    }
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
    } else if (e.matchesBundleShortcut("olap.up") || e.matchesBundleShortcut("olap.down") || e.matchesBundleShortcut("olap.right") || e.matchesBundleShortcut("olap.left") || e.matchesBundleShortcut("selection.up") || e.matchesBundleShortcut("selection.down")) {
        if (!e.getDefaultPrevented()) {
            var sm = this._selectionModel;
            var oldItem = sm.getLeadItem();
            if (wasEditing) iem._onComponentChange();
            sm.handleKeyDown(e);
            var item = sm.getLeadItem();
            if (item && !item.equals(oldItem)) {
                var x = item.getLeft();
                var y = item.getTop();
                if (wasEditing) {
                    if (iem.getCanEdit(x, y)) this._startEditing(item, e);
                    else iem.commitEdit();
                }
            }
            e.preventDefault();
        }
    }
    e.stopPropagation();
    this._updateInvalidSelectionState();
};
_p._onAttachedComponentFocusIn = function (e) {
    var c = e.getCurrentTarget();
    var hash = this._attachedComponents[c.toHashCode()];
    var item = new BiArea(hash.col, hash.row);
    this._selectionModel.setSelectedItems([item]);
    this._selectionModel.setLeadItem(item);
    this._selectionModel.setAnchorItem(item);
    this._updateInvalidSelectionState();
};
_p._onAttachedComponentMouseDown = function (e) {
    var info = this.getCellInfoFromMouseEvent(e);
    var item = new BiArea(info.getColumn(), info.getRow());
    this._stateManager.updateState(e.getType(), info, e);
    if (this._selectionModel._selectionMode == "row") {
        info.setColumn(-1);
    }
    var iem = this.getInlineEditModel();
    if (!iem || !iem.getCanEdit(info.getColumn(), info.getRow())) this._selectionModel.handleMouseDown(item, e);
    e.stopPropagation();
};
_p._onAttachedComponentMouseUp = function (e) {
    var info = this.getCellInfoFromMouseEvent(e);
    var item = new BiArea(info.getColumn(), info.getRow());
    this._stateManager.updateState(e.getType(), info, e);
    if (this._selectionModel._selectionMode == "row") {
        info.setColumn(-1);
    }
    var iem = this.getInlineEditModel();
    if (!iem || !iem.getCanEdit(info.getColumn(), info.getRow())) this._selectionModel.handleMouseUp(item, e);
    e.stopPropagation();
};
_p._onAttachedComponentClick = function (e) {
    var info = this.getCellInfoFromMouseEvent(e);
    var item = new BiArea(info.getColumn(), info.getRow());
    this._selectionModel.handleClick(item, e);
    e.stopPropagation();
};
_p._onAttachedComponentDblClick = function (e) {
    var info = this.getCellInfoFromMouseEvent(e);
    var item = new BiArea(info.getColumn(), info.getRow());
    this._selectionModel.handleDblClick(item, e);
    e.stopPropagation();
};
_p.getPrintHtml = function () {
    var vm = this.getViewManager();
    var axis = 0;
    var x = vm.getFirstVisibleCell(axis);
    var y = vm.getFirstVisibleCell(1 - axis);
    var sb = [];
    sb.push("<style>", ".grid-header{position:absolute}", "table{table-layout:fixed}", "</style>");
    var left = vm.getAxisWidth();
    var top = vm.getAxisHeight();
    sb.push("<div style=\"position:absolute;top:0;left:", left, "px\">");
    sb.push(this.getHeadersHtmlCode(x, Infinity, Infinity));
    sb.push("</div>");
    sb.push("<div style=\"position:absolute;left:0;top:", top, "px\">");
    sb.push(this.getRowHeadersHtmlCode(y, Infinity, Infinity));
    sb.push("</div>");
    sb.push("<div style=\"position:absolute;top:", top, "px;left:", left, "px\">");
    sb.push(this.getHtmlCode(x, y, Infinity, Infinity));
    sb.push("</div>");
    return sb.join("");
};
_p.print = function () {
    var f = new BiIframe;
    var aw = application.getWindow();
    f.setLeft(0);
    f.setRight(0);
    f.setTop(0);
    f.setBottom(0);
    f.setBackColor("window");
    f.setBorder(new BiBorder(0));
    aw.add(f);
    var d = f.getContentDocument();
    d.open();
    d.write(this.getPrintHtml());
    d.close();
    var w = f.getContentWindow();
    w.focus();
    w.print();
    aw.remove(f);
};
_p._allowTab = false;
BiOlapGrid.addProperty("allowTab", BiAccessType.READ);
_p.getAllowTab = function () {
    var iem = this.getInlineEditModel();
    return iem && iem.getIsEditing() || this._allowTab;
};

function BiOlapGridDataModel() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
}
_p = _biExtend(BiOlapGridDataModel, BiEventTarget, "BiOlapGridDataModel");
_p.getCellText = function (x, y) {
    return y + ", " + x;
};
_p.getHasIcon = function (x, y) {
    return false;
};
_p.getIcon = function (x, y) {};
_p.getCellStyle = function (x, y) {
    return "";
};
_p.getFillerCellStyle = function (x, y) {
    return "";
};
_p.getIconStyle = function (x, y) {
    return "";
};
_p.getContextMenu = function (x, y) {
    return null;
};
_p.getAxisContextMenu = function (nAxis, nDim, nPos) {
    return null;
};
_p.getToolTip = function (x, y) {
    return null;
};
_p.getAxisToolTip = function (nAxis, nDim, nPos) {
    return null;
};
_p.getDropDataTypes = function (x, y) {
    return [];
};
_p.getAxisDropDataTypes = function (nAxis, nDim, nPos) {
    return [];
};
_p.getAxisDimensionCount = function (nAxis) {
    return 0;
};
_p.getAxisCellStartPosition = function (nAxis, nDim, nPos) {
    return null;
};
_p.getAxisPositionWidth = function (nAxis) {
    return 0;
};
_p.getAxisDimensionName = function (nAxis, nDim) {
    return "Dimension " + nAxis + "." + nDim;
};
_p.getAxisCellText = function (nAxis, nDim, nPos) {
    return "Cell " + nAxis + "." + nDim + "." + nPos;
};
_p.getAxisCellWidth = function (nAxis, nDim, nPos) {
    return 1;
};
_p.getAxisCellStyle = function (nAxis, nDim, nPos) {
    return "";
};

function BiOlapGridResizeOutline() {
    if (_biInPrototype) return;
    BiResizeHandle.call(this);
    this.setRight(null);
    this._handleFor = this;
    this.setMinimumWidth(19);
    this.setMinimumHeight(19);
    this.setStyleProperty("MozAppearance", "none");
    this.removeAll();
}
_p = _biExtend(BiOlapGridResizeOutline, BiResizeHandle, "BiOlapGridResizeOutline");
_p.setResizeDirection = function (sDir) {
    BiResizeHandle.prototype.setResizeDirection.call(this, sDir);
    var b = new BiBorder;
    switch (sDir) {
    case "e":
        b.setRight(1, "solid", "black");
        this.setRight(null);
        this.setTop(0);
        this.setBottom(0);
        break;
    case "s":
        b.setBottom(1, "solid", "black");
        this.setBottom(null);
        this.setLeft(0);
        this.setRight(0);
        break;
    }
    this.setBorder(b);
};

function BiArea(nLeft, nTop, nWidth, nHeight) {
    if (_biInPrototype) return;
    this._left = nLeft;
    this._top = nTop;
    if (nWidth != null) this._width = nWidth;
    if (nHeight != null) this._height = nHeight;
}
_p = _biExtend(BiArea, BiObject, "BiArea");
_p._width = 1;
_p._height = 1;
BiArea.addProperty("left", BiAccessType.READ_WRITE);
BiArea.addProperty("top", BiAccessType.READ_WRITE);
BiArea.addProperty("width", BiAccessType.READ_WRITE);
BiArea.addProperty("height", BiAccessType.READ_WRITE);
_p.hitTest = function (x, y) {
    return x >= this._left && x < this._left + this._width && y >= this._top && y < this._top + this._width;
};
_p.contains = function (a) {
    return a && this._left <= a._left && this._left + this._width >= a._left + a._width && this._top <= a._top && this._top + this._height >= a._top + a._height;
};
_p.equals = function (oArea) {
    return oArea != null && oArea._left == this._left && oArea._top == this._top && oArea._width == this._width && oArea._height == this._height;
};
BiArea.enclose = function (a1, a2) {
    var a = new BiArea;
    a._left = Math.min(a1._left, a2._left);
    a._top = Math.min(a1._top, a2._top);
    var r1 = a1._left + a1._width;
    var r2 = a2._left + a2._width;
    var r = Math.max(r1, r2);
    a._width = r - a._left;
    var b1 = a1._top + a1._height;
    var b2 = a2._top + a2._height;
    var b = Math.max(b1, b2);
    a._height = b - a._top;
    return a;
};

function BiAreaCollection() {
    if (_biInPrototype) return;
    this._c = [];
}
_p = _biExtend(BiAreaCollection, BiObject, "BiAreaCollection");
_p.add = function (oArea) {
    if (!this.contains(oArea)) this._c.push(oArea);
};
_p.hitTest = function (x, y) {
    for (var i = 0; i < this._c.length; i++) {
        if (this._c[i].hitTest(x, y)) return true;
    }
    return false;
};
_p.remove = function (oArea) {
    for (var i = 0; i < this._c.length; i++) {
        if (this._c[i].equals(oArea)) {
            this._c.splice(i, 1);
            return;
        }
    }
};
_p.removeAll = function () {
    this._c = [];
};
_p.contains = function (oArea) {
    for (var i = 0; i < this._c.length; i++) {
        if (this._c[i].contains(oArea)) return true;
    }
    return false;
};
_p.getItemHashCode = function (oItem) {
    return "{x:" + oItem._left + "," + "y:" + oItem._top + "," + "w:" + oItem._width + "," + "h:" + oItem._height + "}";
};
_p.toArray = function () {
    return this._c.concat();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this._c = null;
};
_p.getChangeValue = function () {
    var sb = [];
    for (var i = 0; i < this._c.length; i++) sb.push(this.getItemHashCode(this._c[i]));
    sb.sort();
    return sb.join(",");
};
_p.isEmpty = function () {
    return this._c.length == 0;
};

function BiOlapGridSelectionModel(oOwner) {
    if (_biInPrototype) return;
    BiSelectionModel.call(this, oOwner);
    this._selectedItems = new BiAreaCollection;
}
_p = _biExtend(BiOlapGridSelectionModel, BiSelectionModel, "BiOlapGridSelectionModel");
_p._canDeselect = false;
_p._dragSelection = true;
_p.setCanDeselect = function (b) {
    this._canDeselect = false;
};
_p.getViewManager = function () {
    return this._owner.getViewManager();
};
_p.getDataModel = function () {
    return this._owner.getDataModel();
};
_p.getFirst = function () {
    var vm = this.getViewManager();
    var x = vm.getNonFixedCell(0);
    var y = vm.getNonFixedCell(1);
    if (x != null && y != null) return new BiArea(x, y);
    return null;
};
_p.getLast = function () {
    var vm = this.getViewManager();
    var x = vm.getLastVisibleCell(0);
    var y = vm.getLastVisibleCell(1);
    if (x != null && y != null) return new BiArea(x, y);
    return null;
};
_p.isBefore = function (oItem1, oItem2) {
    return this._compare(oItem1, oItem2) < 0;
};
_p._compare = function (oItem1, oItem2) {
    if (oItem1.getTop() == oItem2.getTop()) return oItem1.getLeft() - oItem2.getLeft();
    return oItem1.getTop() - oItem2.getTop();
};
_p.isEqual = function (oItem1, oItem2) {
    return oItem1 && oItem1.equals(oItem2);
};
_p.setLeadItem = function (oItem) {
    if (this._leadItem == null) this._leadItem = new BiArea(0, 0);
    BiSelectionModel.prototype.setLeadItem.call(this, oItem);
};
_p.getItems = function () {
    var c = new BiAreaCollection();
    c.add(new BiArea(0, 0, Infinity, Infinity));
    return c;
};
_p.getNext = function (oItem) {
    var vm = this.getViewManager();
    var x, y;
    if (oItem == null) {
        y = vm.getFirstVisibleCell(1);
        if (y == null) return null;
        x = vm.getFirstVisibleCell(0);
        if (x == null) return null;
        return new BiArea(x, y);
    }
    y = vm.getNextVisibleCell(1, oItem.getTop());
    if (y != null) return new BiArea(oItem.getLeft(), y);
    return null;
};
_p.getPrevious = function (oItem) {
    var vm = this.getViewManager();
    var x, y;
    if (oItem == null) {
        y = vm.getLastVisibleCell(1);
        if (y == null) return null;
        x = vm.getLastVisibleCell(0);
        if (x == null) return null;
        return new BiArea(x, y);
    }
    y = vm.getPreviousVisibleCell(1, oItem.getTop());
    if (y != null) return new BiArea(oItem.getLeft(), y);
    return null;
};
_p.getRight = function (oItem) {
    var vm = this.getViewManager();
    if (oItem == null) return this.getFirst();
    var x;
    if (this._owner.getRightToLeft()) x = vm.getPreviousVisibleCell(0, oItem.getLeft());
    else x = vm.getNextVisibleCell(0, oItem.getLeft()); if (x != null) return new BiArea(x, oItem.getTop());
    return null;
};
_p.getLeft = function (oItem) {
    var vm = this.getViewManager();
    if (oItem == null) return this.getLast();
    var x;
    if (this._owner.getRightToLeft()) x = vm.getNextVisibleCell(0, oItem.getLeft());
    else x = vm.getPreviousVisibleCell(0, oItem.getLeft()); if (x != null) return new BiArea(x, oItem.getTop());
    return null;
};
_p.getUp = function (oItem) {
    return !oItem ? this.getLast() : this.getPrevious(oItem);
};
_p.getDown = function (oItem) {
    return !oItem ? this.getFirst() : this.getNext(oItem);
};
_p.getHome = function (oItem) {
    if (oItem == null) return this.getFirst();
    var vm = this.getViewManager();
    var x = vm.getNonFixedCell(0);
    if (x != null) return new BiArea(x, oItem.getTop());
    return null;
};
_p.getCtrlHome = function (oItem) {
    return this.getFirst();
};
_p.getEnd = function (oItem) {
    if (oItem == null) return this.getLast();
    var vm = this.getViewManager();
    var x = vm.getLastVisibleCell(0);
    if (x != null) return new BiArea(x, oItem.getTop());
    return null;
};
_p.getCtrlEnd = function (oItem) {
    return this.getLast();
};
_p.getItemHashCode = function (oItem) {
    return oItem.toHashCode();
};
_p.scrollItemIntoView = function (oItem) {
    this.getViewManager().scrollAreaIntoView(oItem);
};
_p.getItemLeft = function (oItem) {
    var vm = this.getViewManager();
    return vm.getCellLeft(oItem);
};
_p.getItemWidth = function (oItem) {
    var vm = this.getViewManager();
    return vm.getAreaWidth(oItem);
};
_p.getItemTop = function (oItem) {
    var vm = this.getViewManager();
    return vm.getCellTop(oItem);
};
_p.getItemHeight = function (oItem) {
    var vm = this.getViewManager();
    return vm.getAreaHeight(oItem);
};
_p.updateItemSelectionState = function (oItem, bSelected) {
    this._owner._updateAreaSelected(oItem);
};
_p.updateItemLeadState = function (oItem, bLead) {
    this._owner._updateAreaSelected(oItem);
};
_p.updateItemAnchorState = function (oItem, bAnchor) {
    this._owner._updateAreaSelected(oItem);
};
_p.getItemSelected = function (oItem) {
    return this._selectedItems.contains(oItem);
};
_p._selectItemRange = function (item1, item2, bDeselect) {
    var a = BiArea.enclose(item1, item2);
    if (bDeselect) this._deselectAll();
    this._selectedItems.add(a);
    this.updateItemSelectionState(a, true);
};
_p._deselectItemRange = function (item1, item2) {
    var a = BiArea.enclose(item1, item2);
    this._selectedItems.remove(a);
    this.updateItemSelectionState(a, false);
};
_p._deselectAll = function () {
    var a = this._selectedItems.toArray();
    this._selectedItems.removeAll();
    for (var i = 0; i < a.length; i++) this.updateItemSelectionState(a[i], false);
};
_p._selectAll = function () {
    if (!this._multipleSelection) return;
    var a = new BiArea(0, 0, Infinity, Infinity);
    this._selectedItems.removeAll();
    this._selectedItems.add(a);
    this.updateItemSelectionState(a, true);
};
_p.getRowSelected = function (y) {
    return this._selectedItems.contains(new BiArea(0, y, Infinity, 1));
};
_p.setRowSelected = function (y, b) {
    this.setItemSelected(new BiArea(0, y, Infinity, 1), b);
};
_p.getColumnSelected = function (x) {
    return this._selectedItems.contains(new BiArea(x, 0, 1, Infinity));
};
_p.setColumnSelected = function (x, b) {
    this.setItemSelected(new BiArea(x, 0, 1, Infinity), b);
};
_p.getCellSelected = function (x, y) {
    return this._selectedItems.contains(new BiArea(x, y));
};
_p.setCellSelected = function (x, y, b) {
    this.setItemSelected(new BiArea(x, y), b);
};
_p.getCellIsLead = function (x, y) {
    return this._leadItem == null ? x == 0 && y == 0 : new BiArea(x, y).equals(this._leadItem);
};
_p.getCellIsAnchor = function (x, y) {
    return this._anchorItem != null && new BiArea(x, y).equals(this._anchorItem);
};
_p.getItemToSelect = function (e) {
    var actions = {
        "olap.up": "getUp",
        "olap.down": "getDown",
        "olap.left": "getLeft",
        "olap.right": "getRight"
    };
    for (var n in actions)
        if (e.matchesBundleShortcut(n)) {
            this._ignoreShift = true;
            var action = actions[n];
            return this[action](this._leadItem);
        }
    return BiSelectionModel.prototype.getItemToSelect.call(this, e);
};
_p._update = BiAccessType.FUNCTION_EMPTY;

function BiOlapGridStateManager() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._active = new BiOlapGridCellInfo;
    this._hover = new BiOlapGridCellInfo;
    this._dragOver = new BiOlapGridCellInfo;
}
_p = _biExtend(BiOlapGridStateManager, BiEventTarget, "BiOlapGridStateManager");
BiOlapGridStateManager.addProperty("active", BiAccessType.READ);
_p.setActive = function (oCellInfo) {
    this._active = oCellInfo || new BiOlapGridCellInfo;
};
BiOlapGridStateManager.addProperty("hover", BiAccessType.READ);
_p.setHover = function (oCellInfo, e) {
    if (oCellInfo == null) oCellInfo = new BiOlapGridCellInfo;
    if (!this._hover.equals(oCellInfo)) {
        this._hover = oCellInfo;
        this.dispatchEvent(new BiOlapStateEvent("hoverchanged", e));
    }
};
BiOlapGridStateManager.addProperty("drag", BiAccessType.READ);
_p.setDrag = function (oCellInfo, e) {
    this._active = oCellInfo || new BiOlapGridCellInfo;
};
_p.getDrag = function () {
    return this._active;
};
BiOlapGridStateManager.addProperty("dragOver", BiAccessType.READ);
_p.setDragOver = function (oCellInfo, e) {
    if (oCellInfo == null) oCellInfo = new BiOlapGridCellInfo;
    if (!this._hover.equals(oCellInfo)) {
        this._dragOver = oCellInfo;
        this.dispatchEvent(new BiOlapStateEvent("dropoverchanged", e));
    }
};
_p.updateState = function (sType, oCellInfo, e) {
    switch (sType) {
    case "mousedown":
        this.setActive(oCellInfo || new BiOlapGridCellInfo, e);
        break;
    case "mouseup":
        this.setActive(null, e);
        break;
    case "mouseover":
    case "mousemove":
        this.setHover(oCellInfo || new BiOlapGridCellInfo, e);
        break;
    case "mouseout":
        this.setHover(null, e);
        break;
    }
};

function BiOlapStateEvent(sType, oMouseEvent) {
    if (_biInPrototype) return;
    BiEvent.call(this, sType);
    this._mouseEvent = oMouseEvent;
};
_p = _biExtend(BiOlapStateEvent, BiEvent, "BiOlapStateEvent");

function BiOrderedIterator() {
    if (_biInPrototype) return;
    this._count = 0;
    this._first = null;
    this._items = {};
    this._current = this._first;
}
_p = _biExtend(BiOrderedIterator, BiObject, "BiOrderedIterator");
_p.add = function (nIndex, val) {
    var current, next, previous;
    if (nIndex in this._items) {
        current = this._items[nIndex];
        current.value = val;
    } else if (this._first == null) {
        this._first = {
            index: nIndex,
            value: val,
            next: null,
            previous: null
        };
        this._items[nIndex] = this._first;
        this._count = 1;
    } else {
        current = this._first;
        while (current.next != null && current.index < nIndex) {
            current = current.next;
        }
        if (current.index < nIndex) {
            previous = current;
            current = {
                index: nIndex,
                value: val,
                next: null,
                previous: previous
            };
            previous.next = current;
        } else {
            previous = current.previous;
            next = current;
            current = {
                index: nIndex,
                value: val,
                next: next,
                previous: previous
            };
            if (previous) previous.next = current;
            next.previous = current;
            if (next == this._first) this._first = current;
        }
        this._items[nIndex] = current;
        this._count++;
    }
};
_p.remove = function (nIndex) {
    if (!(nIndex in this._items)) return null;
    var current = this._items[nIndex];
    if (this._current == current) {
        this._current = current.previous || this._first;
    }
    if (current == this._first) this._first = current.next;
    if (current.previous) current.previous.next = current.next;
    if (current.next) current.next.previous = current.previous;
    var val = current.value;
    current.value = null;
    delete this._items[nIndex];
    this._count--;
    return val;
};
_p.first = function () {
    this._current = this._first;
};
_p.next = function () {
    if (this._current) this._current = this._current.next;
};
_p.getDone = function () {
    return this._current == null;
};
_p.getCount = function () {
    return this._count;
};
_p.getCurrentValue = function () {
    return this._current.value;
};
_p.getCurrentIndex = function () {
    return this._current.index;
};
_p.containsIndex = function (nIndex) {
    return nIndex in this._items;
};
_p.getValueAt = function (nIndex) {
    return this._items[nIndex].value;
};

function BiOlapGridViewManager(oOlapGrid) {
    if (_biInPrototype) return;
    this._olapGrid = oOlapGrid;
    this._cellWidthIters = [new BiOrderedIterator, new BiOrderedIterator];
    this._cellHeightIters = [new BiOrderedIterator, new BiOrderedIterator];
    this._cellVisibleIters = [new BiOrderedIterator, new BiOrderedIterator];
    this._dimensionWidths = {};
    this._dimensionHeights = {};
    this._axisDimensionVisible = {};
    this._fixedCell = [0, 0];
    this._nonFixedCell = [0, 0];
    this._showHeaders = [true, true];
    this.resetCache();
}
_p = _biExtend(BiOlapGridViewManager, BiObject, "BiOlapGridViewManager");
_p._axisOnTop = 0;
BiOlapGridViewManager.addProperty("olapGrid", BiAccessType.READ);
_p.getDataModel = function () {
    return this._olapGrid.getDataModel();
};
_p._showGridLines = true;
BiOlapGridViewManager.addProperty("showGridLines", BiAccessType.READ_WRITE);
_p.resetCache = function () {
    this._cache = null;
    this._cellLeftCache = [{}, {}];
    this._cellTopCache = [{}, {}];
    this._axisCellStartPositionCache = {};
    this._axisWidthCache = {};
    this._axisHeightCache = {};
    this._axisDimensionCountCache = {};
    this._axisCellIsVisibleCache = {};
    this._axisCellWidthCache = {};
    this._axisCellHeightCache = {};
    this._visibleCellsWidth = null;
    this._visibleCellsHeight = null;
    this._axisCellPositionWidthCache = {};
    this._visibleCellsCount = null;
    this._visibleCellsWidth = null;
    this._visibleCellsHeight = null;
};
_p.setScrollLeft = function (n) {
    if (this._cache == null) this._cache = {};
    var g = this._olapGrid;
    if (g.getRightToLeft()) n = g.getScrollWidth() - g.getClientWidth() - n;
    if (this._cache.scrollLeftExact != n) {
        var axis = 0;
        this._cache.scrollLeftExact = n;
        this._cache.firstVisibleColumn = this._getFirstViewCell(axis, n);
        this._cache.scrollLeft = this.getCellLeft(this._cache.firstVisibleColumn);
    }
};
_p.setScrollTop = function (n) {
    if (this._cache == null) this._cache = {};
    if (this._cache.scrollTopExact != n) {
        var axis = 1;
        this._cache.scrollTopExact = n;
        this._cache.firstVisibleRow = this._getFirstViewCell(axis, n);
        this._cache.scrollTop = this.getCellTop(this._cache.firstVisibleRow);
    }
};
_p._ensureCache = function () {
    if (this._cache == null) this._cache = {};
    this._cache.scrollLeft = -1;
    this._cache.scrollTop = -1;
    if (this._olapGrid && this._olapGrid.getCreated()) {
        this.setScrollLeft(this._olapGrid.getScrollLeftExact());
        this.setScrollTop(this._olapGrid.getScrollTopExact());
    } else {
        this.setScrollLeft(0);
        this.setScrollTop(0);
    }
};
_p.scrollColumnIntoView = function (x) {
    this._scrollAreaIntoViewX(new BiArea(x, 0, 1, Infinity));
};
_p.scrollRowIntoView = function (y) {
    this._scrollAreaIntoViewY(new BiArea(0, y, Infinity, 1));
};
_p.scrollCellIntoView = function (x, y) {
    this.scrollAreaIntoView(new BiArea(x, y));
};
_p.scrollAreaIntoView = function (oArea) {
    this._scrollAreaIntoViewX(oArea);
    this._scrollAreaIntoViewY(oArea);
};
_p._scrollAreaIntoViewX = function (oArea) {
    var x = oArea.getLeft();
    var axis = 0;
    if (x < this._nonFixedCell[axis]) return;
    var g = this._olapGrid;
    var clientWidth = g.getClientWidth() - this.getFixedLeftWidth();
    var left = this.getCellLeft(x) - this.getCellLeft(this._nonFixedCell[axis]);
    var width = this.getAreaWidth(oArea);
    var scrollLeft = this._cache.scrollLeftExact;
    if (clientWidth > 0) {
        if (left < scrollLeft || width > clientWidth) {
            g.setScrollLeft(left);
        } else if (width != Infinity && left + width > scrollLeft + clientWidth) g.setScrollLeft(left + width - clientWidth);
    }
};
_p._scrollAreaIntoViewY = function (oArea) {
    var y = oArea.getTop();
    var axis = 1;
    if (y < this._nonFixedCell[axis]) return;
    var g = this._olapGrid;
    var clientHeight = g.getClientHeight() - this.getFixedTopHeight();
    var top = this.getCellTop(y) - this.getCellTop(this._nonFixedCell[axis]);
    var height = this.getAreaHeight(oArea);
    var scrollTop = this._cache.scrollTopExact;
    if (clientHeight > 0) {
        if (top < scrollTop || height > clientHeight) {
            g.setScrollTop(top);
        } else if (height != Infinity && top + height > scrollTop + clientHeight) g.setScrollTop(top + height - clientHeight);
    }
};
_p.getAreaWidth = function (oArea) {
    var x = oArea.getLeft();
    var w = oArea.getWidth();
    if (w == Infinity) return Infinity;
    var lastX = x + w - 1;
    return this.getCellLeft(lastX) - this.getCellLeft(x) + this.getCellWidth(lastX);
};
_p.getAreaHeight = function (oArea) {
    var y = oArea.getTop();
    var h = oArea.getHeight();
    if (h == Infinity) return Infinity;
    var lastY = y + h - 1;
    return this.getCellTop(lastY) - this.getCellTop(y) + this.getCellHeight(lastY);
};
_p.getVisibleCellsWidth = function () {
    var axis = 0;
    this._ensureVisibleCellsWidth();
    return this._visibleCellsWidth[axis] - this.getCellLeft(this._nonFixedCell[axis]);
};
_p.getVisibleCellsHeight = function () {
    var axis = 1;
    this._ensureVisibleCellsHeight();
    return this._visibleCellsHeight[axis] - this.getCellTop(this._nonFixedCell[axis]);
};
_p.getVisibleCellsCount = function (nAxis) {
    this._ensureVisibleCellsCount();
    return this._visibleCellsCount[nAxis];
};
_p.getFirstVisibleCell = function (nAxis) {
    var dm = this.getDataModel();
    var count = dm.getAxisPositionWidth(nAxis);
    for (var x = 0; x < count; x++) {
        if (this.getCellVisible(nAxis, x)) return x;
    }
    return null;
};
_p.getLastVisibleCell = function (nAxis) {
    var dm = this.getDataModel();
    var count = dm.getAxisPositionWidth(nAxis);
    for (var x = count - 1; x >= 0; x--) {
        if (this.getCellVisible(nAxis, x)) return x;
    }
    return null;
};
_p.getCellPaddingX = function () {
    return BiBrowserCheck.quirks.useContentBoxForTd ? 8 : 0;
};
_p.getCellPaddingY = function () {
    return 0;
};
_p.getShowHeaders = function (nAxis) {
    return this._showHeaders[nAxis];
};
_p.setShowHeaders = function (nAxis, b) {
    this._showHeaders[nAxis] = b;
};
_p.getHeaderCellPaddingX = function () {};
_p.getFixedLeftWidth = function () {
    var axis = 0;
    return (this.getShowHeaders(1 - axis) ? this.getAxisWidth() : 0) + this.getCellLeft(this._nonFixedCell[axis]) - this.getCellLeft(this._fixedCell[axis]);
};
_p.getFixedTopHeight = function () {
    var axis = 0;
    return (this.getShowHeaders(axis) ? this.getAxisHeight() : 0) + this.getCellTop(this._nonFixedCell[1 - axis]) - this.getCellTop(this._fixedCell[1 - axis]);
};
BiOlapGridViewManager.addProperty("axisOnTop", BiAccessType.READ_WRITE);
_p.getDimensionHeight = function (nDim) {
    var id = String(nDim);
    if (id in this._dimensionHeights) return this._dimensionHeights[id];
    return 19;
};
_p.setDimensionHeight = function (nDim, nHeight) {
    var id = String(nDim);
    this._dimensionHeights[id] = nHeight;
};
_p.getDimensionWidth = function (nDim) {
    var id = String(nDim);
    if (id in this._dimensionWidths) return this._dimensionWidths[id];
    return 100;
};
_p.setDimensionWidth = function (nDim, nWidth) {
    var id = String(nDim);
    this._dimensionWidths[id] = nWidth;
};
_p.getAxisCellWidth = function (nDim, nPos) {
    var axis = 0;
    var id = nDim + "_" + nPos;
    if (id in this._axisCellWidthCache) return this._axisCellWidthCache[id];
    var dm = this.getDataModel();
    var w = dm.getAxisCellWidth(axis, nDim, nPos);
    var sum = 0;
    for (var x = nPos; x < w + nPos; x++) {
        if (this.getCellVisible(axis, x)) sum += this.getCellWidth(x);
    }
    return this._axisCellWidthCache[id] = sum;
};
_p.getAxisCellHeight = function (nDim, nPos) {
    var axis = 1;
    var id = nDim + "_" + nPos;
    if (id in this._axisCellHeightCache) return this._axisCellHeightCache[id];
    var dm = this.getDataModel();
    var w = dm.getAxisCellWidth(axis, nDim, nPos);
    var sum = 0;
    for (var x = nPos; x < w + nPos; x++) {
        if (this.getCellVisible(axis, x)) sum += this.getCellHeight(x);
    }
    return this._axisCellHeightCache[id] = sum;
};
_p.getAxisHeight = function () {
    var axis = 0;
    if (axis in this._axisHeightCache) return this._axisHeightCache[axis];
    var dm = this.getDataModel();
    var dimCount = dm.getAxisDimensionCount(axis);
    var h = 0;
    for (var y = this.getFirstVisibleDimension(axis); y != null && y < dimCount; y = this.getNextDimension(axis, y)) {
        h += this.getDimensionHeight(y);
    }
    return this._axisHeightCache[axis] = h;
};
_p.getAxisWidth = function () {
    var axis = 1;
    if (axis in this._axisWidthCache) return this._axisWidthCache[axis];
    var dm = this.getDataModel();
    var dimCount = dm.getAxisDimensionCount(axis);
    var w = 0;
    for (var x = this.getFirstVisibleDimension(axis); x != null && x < dimCount; x = this.getNextDimension(axis, x)) {
        w += this.getDimensionWidth(x);
    }
    return this._axisWidthCache[axis] = w;
};
_p.getAxisDimensionCount = function (nAxis) {
    if (nAxis in this._axisDimensionCountCache) return this._axisDimensionCountCache[nAxis];
    var dm = this.getDataModel();
    if (!dm) return 0;
    var dmDimCount = dm.getAxisDimensionCount(nAxis);
    var sum = 0;
    for (var y = 0; y < dmDimCount; y++) {
        if (this.getAxisDimensionVisible(nAxis, y)) sum++;
    }
    return this._axisDimensionCountCache[nAxis] = sum;
};
_p.getAxisDimensionVisible = function (nAxis, nDim) {
    return !(nAxis + "-" + nDim in this._axisDimensionVisible);
};
_p.setAxisDimensionVisible = function (nAxis, nDim, bVisible) {
    var id = nAxis + "-" + nDim;
    if (bVisible) delete this._axisDimensionVisible[id];
    else this._axisDimensionVisible[id] = false;
};
_p.getAxisCellIsVisible = function (nAxis, nDim, nPos) {
    var id = nAxis + "-" + nDim + "-" + nPos;
    if (id in this._axisCellIsVisibleCache) return this._axisCellIsVisibleCache[id];
    var dm = this.getDataModel();
    if (!dm) return false;
    var w = dm.getAxisCellWidth(nAxis, nDim, nPos);
    var end = nPos + w;
    for (var x = nPos; x < end; x++) {
        if (this.getCellVisible(nAxis, x)) return this._axisCellIsVisibleCache[id] = true;
    }
    return this._axisCellIsVisibleCache[id] = false;
};
_p.getAxisCellPositionWidth = function (nAxis, nDim, nPos) {
    var id = nAxis + "-" + nDim + "-" + nPos;
    if (id in this._axisCellPositionWidthCache) return this._axisCellPositionWidthCache[id];
    var dm = this.getDataModel();
    if (!dm) return 0;
    var sum = 0;
    var w = dm.getAxisCellWidth(nAxis, nDim, nPos);
    var end = nPos + w;
    for (var x = nPos; x < end; x++) {
        if (this.getCellVisible(nAxis, x)) sum++;
    }
    return this._axisCellPositionWidthCache[id] = sum;
};
_p.getNextDimension = function (nAxis, nDim) {
    var dm = this.getDataModel();
    var dimCount = dm.getAxisDimensionCount(nAxis);
    for (var y = nDim + 1; y < dimCount; y++) {
        if (this.getAxisDimensionVisible(nAxis, y)) return y;
    }
    return null;
};
_p.getFirstVisibleDimension = function (nAxis) {
    var dm = this.getDataModel();
    if (!dm) return null;
    var dimCount = dm.getAxisDimensionCount(nAxis);
    if (dimCount == 0) return null;
    for (var y = 0; y < dimCount; y++) {
        if (this.getAxisDimensionVisible(nAxis, y)) return y;
    }
    return null;
};
_p.getNextAxisPosition = function (nAxis, nDim, nPos) {
    var dm = this.getDataModel();
    if (!dm || nPos == null) return null;
    var dmWidth = dm.getAxisCellWidth(nAxis, nDim, nPos);
    var posCount = dm.getAxisPositionWidth(nAxis, nDim);
    for (var modPos = nPos + dmWidth; modPos != null && modPos < posCount; modPos += dm.getAxisCellWidth(nAxis, nDim, modPos)) {
        if (this.getAxisCellIsVisible(nAxis, nDim, modPos)) {
            return modPos;
        }
    }
    return null;
};
_p.getAxisCellStartPosition = function (nAxis, nDim, nPos) {
    if (nPos == null) return null;
    var dm = this.getDataModel();
    if (dm) {
        var dmRes = dm.getAxisCellStartPosition(nAxis, nDim, nPos);
        if (dmRes != null && dmRes != -1) return dmRes;
    }
    var id = nAxis + "-" + nDim + "-" + nPos;
    if (id in this._axisCellStartPositionCache) return this._axisCellStartPositionCache[id];
    var tmpId, w;
    var startPos = 0;
    for (var x = nPos; x >= 0; x--) {
        tmpId = nAxis + "-" + nDim + "-" + x;
        if (tmpId in this._axisCellStartPositionCache) {
            startPos = this._axisCellStartPositionCache[tmpId];
            break;
        }
    }
    for (var mx = startPos; mx != null && mx < nPos; mx += w) {
        w = dm.getAxisCellWidth(nAxis, nDim, mx);
        if (mx + w > nPos) {
            break;
        }
        this._axisCellStartPositionCache[nAxis + "-" + nDim + "-" + mx] = mx;
    }
    return this._axisCellStartPositionCache[id] = mx;
};
_p.getAxisPositionDistance = function (nAxis, p1, p2) {
    if (p1 > p2) {
        var tmp = p1;
        p1 = p2;
        p2 = tmp;
    }
    var dist = 0;
    var size = this.getVisibleCellsCount(nAxis);
    for (var x = p1; x < p2 && x < size; x++) {
        if (this.getCellVisible(nAxis, x)) dist++;
    }
    return dist;
};
_p.getMinCellPosition = function (nAxis, p1, p2) {
    return Math.min(p1, p2);
};
_p.getDimensionTop = function (nDim) {
    var axis = 0;
    var dm = this.getDataModel();
    var top = 0;
    var dims = dm.getAxisDimensionCount(axis);
    for (var y = 0; y < dims && y < nDim; y++) {
        if (this.getAxisDimensionVisible(axis, y)) top += this.getDimensionHeight(y);
    }
    return top;
};
_p.getDimensionLeft = function (nDim) {
    var axis = 1;
    var dm = this.getDataModel();
    var left = 0;
    var dims = dm.getAxisDimensionCount(axis);
    for (var x = 0; x < dims && x < nDim; x++) {
        if (this.getAxisDimensionVisible(axis, x)) left += this.getDimensionWidth(x);
    }
    return left;
};
_p._defaultCellWidth = 100;
_p._defaultCellHeight = 19;
_p.getCellWidth = function (x) {
    var axis = 0;
    var iter = this._cellWidthIters[axis];
    if (iter.containsIndex(x)) return iter.getValueAt(x);
    return this._defaultCellWidth;
};
_p.setCellWidth = function (x, w) {
    var axis = 0;
    var oldW = this.getCellWidth(x);
    var iter = this._cellWidthIters[axis];
    iter.add(x, w);
    if (this.getCellVisible(axis, x)) {
        this._ensureVisibleCellsWidth();
        this._visibleCellsWidth[axis] += w - oldW;
    }
    this._cellLeftCache[axis] = {};
    this._axisCellWidthCache = {};
};
_p.getCellHeight = function (y) {
    var axis = 1;
    var iter = this._cellHeightIters[axis];
    if (iter.containsIndex(y)) return iter.getValueAt(y);
    return this._defaultCellHeight;
};
_p.setCellHeight = function (y, h) {
    var axis = 1;
    var oldH = this.getCellHeight(y);
    var iter = this._cellHeightIters[axis];
    iter.add(y, h);
    if (this.getCellVisible(axis, y)) {
        this._ensureVisibleCellsHeight();
        this._visibleCellsHeight[axis] += h - oldH;
    }
    this._cellTopCache[axis] = {};
    this._axisCellHeightCache = {};
};
_p.getCellLeft = function (mx) {
    var axis = 0;
    if (mx in this._cellLeftCache[axis]) return this._cellLeftCache[axis][mx];
    if (mx == 0 || mx >= this.getDataModel().getAxisPositionWidth(axis)) return this._cellLeftCache[axis][mx] = 0;
    var previous = mx - 1;
    if (previous in this._cellLeftCache[axis]) {
        this._cellLeftCache[axis][mx] = this._cellLeftCache[axis][previous];
        if (this.getCellVisible(axis, previous)) this._cellLeftCache[axis][mx] += this.getCellWidth(previous);
        return this._cellLeftCache[axis][mx];
    }
    var left = 0,
        x;
    var vIter = this._cellVisibleIters[axis];
    var wIter = this._cellWidthIters[axis];
    for (x = 0, wIter.first(); x < mx && !wIter.getDone(); wIter.next()) {
        if (wIter.getCurrentIndex() < mx) {
            left += (wIter.getCurrentIndex() - x) * this._defaultCellWidth;
            left += wIter.getCurrentValue();
            x = wIter.getCurrentIndex() + 1;
        } else {
            left += (mx - x) * this._defaultCellWidth;
            x = mx;
        }
    }
    if (x < mx) left += (mx - x) * this._defaultCellWidth;
    for (x = 0, vIter.first(); x < mx && !vIter.getDone(); vIter.next()) {
        x = vIter.getCurrentIndex();
        if (x < mx) {
            left -= this.getCellWidth(x);
        }
    }
    return this._cellLeftCache[axis][mx] = left;
};
_p.getCellTop = function (my) {
    var axis = 1;
    if (my in this._cellTopCache[axis]) return this._cellTopCache[axis][my];
    if (my == 0 || my >= this.getDataModel().getAxisPositionWidth(axis)) return this._cellTopCache[axis][my] = 0;
    var previous = my - 1;
    if (previous in this._cellTopCache[axis]) {
        this._cellTopCache[axis][my] = this._cellTopCache[axis][previous];
        if (this.getCellVisible(axis, previous)) this._cellTopCache[axis][my] += this.getCellHeight(previous);
        return this._cellTopCache[axis][my];
    }
    var top = 0,
        y;
    var vIter = this._cellVisibleIters[axis];
    var hIter = this._cellHeightIters[axis];
    for (y = 0, hIter.first(); y < my && !hIter.getDone(); hIter.next()) {
        if (hIter.getCurrentIndex() < my) {
            top += (hIter.getCurrentIndex() - y) * this._defaultCellHeight;
            top += hIter.getCurrentValue();
            y = hIter.getCurrentIndex() + 1;
        } else {
            top += (my - y) * this._defaultCellHeight;
            y = my;
        }
    }
    if (y < my) top += (my - y) * this._defaultCellHeight;
    for (y = 0, vIter.first(); y < my && !vIter.getDone(); vIter.next()) {
        y = vIter.getCurrentIndex();
        if (y < my) {
            top -= this.getCellHeight(y);
        }
    }
    return this._cellTopCache[axis][my] = top;
};
_p.getCellBounds = function (x, y) {
    return {
        left: this.getCellLeft(),
        top: this.getCellTop(),
        width: this.getCellWidth(),
        height: this.getCellHeight()
    };
};
_p.getCellVisible = function (nAxis, nPos) {
    var iter = this._cellVisibleIters[nAxis];
    if (iter.containsIndex(nPos)) return iter.getValueAt(nPos);
    return true;
};
_p.setCellVisible = function (nAxis, nPos, bVis) {
    var iter = this._cellVisibleIters[nAxis];
    var dm = this.getDataModel();
    if (bVis && iter.containsIndex(nPos)) {
        iter.remove(nPos);
        if (nPos < dm.getAxisPositionWidth(nAxis)) {
            if (nAxis == this.getAxisOnTop()) {
                this._ensureVisibleCellsWidth();
                this._visibleCellsWidth[nAxis] += this.getCellWidth(nAxis, nPos);
            } else {
                if (nPos < dm.getAxisPositionWidth(nAxis)) this._ensureVisibleCellsHeight();
                this._visibleCellsHeight[nAxis] += this.getCellHeight(nAxis, nPos);
            }
        }
    } else if (!bVis) {
        iter.add(nPos, false);
        if (nPos < dm.getAxisPositionWidth(nAxis)) {
            if (nAxis == this.getAxisOnTop()) {
                this._ensureVisibleCellsWidth();
                this._visibleCellsWidth[nAxis] -= this.getCellWidth(nAxis, nPos);
            } else {
                this._ensureVisibleCellsHeight();
                this._visibleCellsHeight[nAxis] -= this.getCellHeight(nAxis, nPos);
            }
        }
    }
    this._ensureVisibleCellsCount();
    this._visibleCellsCount[nAxis]++;
    this.resetCache();
};
_p.getVisibleCellIndex = function (nAxis, nPos) {
    if (!this.getCellVisible(nAxis, nPos)) return null;
    var i = nPos;
    var iter = this._cellVisibleIters[nAxis];
    for (iter.first(); !iter.getDone(); iter.next()) {
        if (iter.getCurrentIndex() > nPos) return i;
        i--;
    }
    return i;
};
_p.getNextVisibleCell = function (nAxis, nPos) {
    var dm = this.getDataModel();
    var posCount = dm.getAxisPositionWidth(nAxis);
    for (var mx = nPos + 1; mx < posCount; mx++) {
        if (this.getCellVisible(nAxis, mx)) return mx;
    }
    return null;
};
_p.getPreviousVisibleCell = function (nAxis, nPos) {
    for (var x = nPos - 1; x >= 0; x--) {
        if (this.getCellVisible(nAxis, x)) return x;
    }
    return null;
};
_p._ensureVisibleCellsWidth = function () {
    if (this._visibleCellsWidth == null) {
        var dm = this.getDataModel();
        var defaultCellWidth = this._defaultCellWidth;
        var res = new Array(2);
        var cellCount;
        var i = 0;
        cellCount = dm.getAxisPositionWidth(i);
        res[i] = cellCount * defaultCellWidth;
        var wIter = this._cellWidthIters[i];
        for (wIter.first(); !wIter.getDone(); wIter.next()) {
            if (wIter.getCurrentIndex() > cellCount) break;
            res[i] += wIter.getCurrentValue() - defaultCellWidth;
        }
        var vIter = this._cellVisibleIters[i];
        for (vIter.first(); !vIter.getDone(); vIter.next()) {
            if (vIter.getCurrentIndex() > cellCount) break;
            res[i] -= this.getCellWidth(i, vIter.getCurrentIndex());
        }
        this._visibleCellsWidth = res;
    }
};
_p._ensureVisibleCellsHeight = function () {
    if (this._visibleCellsHeight == null) {
        var dm = this.getDataModel();
        var defaultCellHeight = this._defaultCellHeight;
        var res = new Array(2);
        var cellCount;
        var i = 1;
        cellCount = dm.getAxisPositionWidth(i);
        res[i] = cellCount * defaultCellHeight;
        var hIter = this._cellHeightIters[i];
        for (hIter.first(); !hIter.getDone(); hIter.next()) {
            if (hIter.getCurrentIndex() > cellCount) break;
            res[i] += hIter.getCurrentValue() - defaultCellHeight;
        }
        var vIter = this._cellVisibleIters[i];
        for (vIter.first(); !vIter.getDone(); vIter.next()) {
            if (vIter.getCurrentIndex() > cellCount) break;
            res[i] -= this.getCellHeight(i, vIter.getCurrentIndex());
        }
        this._visibleCellsHeight = res;
    }
};
_p._ensureVisibleCellsCount = function () {
    if (this._visibleCellsCount == null) {
        var dm = this.getDataModel();
        if (!dm) {
            this._visibleCellsCount = [0, 0];
        } else {
            this._visibleCellsCount = new Array(2);
            var cellCount;
            for (var i = 0; i < 2; i++) {
                cellCount = dm.getAxisPositionWidth(i);
                var vIter = this._cellVisibleIters[i];
                for (vIter.first(); !vIter.getDone(); vIter.next()) {
                    if (vIter.getCurrentIndex() > cellCount) break;
                    cellCount--;
                }
                this._visibleCellsCount[i] = cellCount;
            }
        }
    }
};
_p.getFirstViewCell = function (nAxis) {
    if (this._cache == null) this._ensureCache();
    if (nAxis == 0) return this._cache.firstVisibleColumn;
    else return this._cache.firstVisibleRow;
};
_p.getFixedCell = function (nAxis) {
    return this._fixedCell[nAxis];
};
_p.setFixedCell = function (nAxis, nPos) {
    this._fixedCell[nAxis] = nPos;
    this.resetCache();
};
_p.getNonFixedCell = function (nAxis) {
    return this._nonFixedCell[nAxis];
};
_p.setNonFixedCell = function (nAxis, nPos) {
    this._nonFixedCell[nAxis] = nPos;
    this.resetCache();
};
_p.getCellAt = function (nLeft, nTop, nStartCol, nStartRow) {
    var axis = 0;
    return {
        x: this._getCellAt(axis, nLeft, nStartCol),
        y: this._getCellAt(1 - axis, nTop, nStartRow)
    };
};
_p._getCellAt = function (nAxis, nScroll, nStartCell) {
    var defaultCellWidth = this._defaultCellWidth;
    var defaultCellHeight = this._defaultCellHeight;

    function noIterX() {
        var tmp = Math.ceil((nScroll - x) / defaultCellWidth);
        x += tmp * defaultCellWidth;
        if (tmp >= 1) lastI = i + tmp - 1;
        i += tmp;
    }

    function useVIterX() {
        var tmp = (vIter.getCurrentIndex() - i) * defaultCellWidth;
        if (x + tmp > nScroll) {
            noIterX();
        } else {
            x += tmp;
            i = vIter.getCurrentIndex();
            i++;
            vIter.next();
        }
    }

    function useWIterX() {
        var tmp = (wIter.getCurrentIndex() - i) * defaultCellWidth;
        if (x + tmp > nScroll) {
            noIterX();
        } else {
            x += tmp;
            i = wIter.getCurrentIndex();
            lastI = i;
            x += wIter.getCurrentValue();
            i++;
            wIter.next();
        }
    }

    function noIterY() {
        var tmp = Math.ceil((nScroll - y) / defaultCellHeight);
        y += tmp * defaultCellHeight;
        if (tmp >= 1) lastI = i + tmp - 1;
        i += tmp;
    }

    function useVIterY() {
        var tmp = (vIter.getCurrentIndex() - i) * defaultCellHeight;
        if (y + tmp > nScroll) {
            noIterY();
        } else {
            y += tmp;
            i = vIter.getCurrentIndex();
            i++;
            vIter.next();
        }
    }

    function useHIterY() {
        var tmp = (hIter.getCurrentIndex() - i) * defaultCellHeight;
        if (y + tmp > nScroll) {
            noIterY();
        } else {
            y += tmp;
            i = hIter.getCurrentIndex();
            lastI = i;
            y += hIter.getCurrentValue();
            i++;
            hIter.next();
        }
    }
    var i = 0,
        lastI = 0,
        tmp, oldI;
    var vIter = this._cellVisibleIters[nAxis];
    vIter.first();
    var dm = this.getDataModel();
    if (nAxis == 0) {
        var x = -this.getCellLeft(nStartCell);
        var wIter = this._cellWidthIters[nAxis];
        wIter.first();
        var cols = dm.getAxisPositionWidth(nAxis);
        while (x < nScroll) {
            if (i >= cols) return null;
            if (wIter.getDone() && vIter.getDone()) {
                oldI = i;
                noIterX();
                if (oldI == i) break;
            } else if (wIter.getDone() && !vIter.getDone()) {
                tmp = (vIter.getCurrentIndex() - i) * this._defaultCellWidth;
                if (x + tmp > nScroll) {
                    oldI = i;
                    noIterX();
                    if (oldI == i) break;
                } else {
                    useVIterX();
                }
            } else if (!wIter.getDone() && vIter.getDone()) {
                tmp = (wIter.getCurrentIndex() - i) * this._defaultCellWidth;
                if (x + tmp > nScroll) {
                    oldI = i;
                    noIterX();
                    if (oldI == i) break;
                } else {
                    useWIterX();
                }
            } else {
                if (wIter.getCurrentIndex() == vIter.getCurrentIndex()) {
                    useVIterX();
                    wIter.next();
                } else if (wIter.getCurrentIndex() < vIter.getCurrentIndex()) {
                    useWIterX();
                } else {
                    useVIterX();
                }
            }
        }
        if (lastI >= cols) return null;
        if (!this.getCellVisible(nAxis, lastI)) lastI = this.getNextVisibleCell(nAxis, lastI);
        return lastI;
    } else {
        var y = -this.getCellTop(nStartCell);
        var hIter = this._cellHeightIters[nAxis];
        hIter.first();
        var rows = dm.getAxisPositionWidth(nAxis);
        while (y < nScroll) {
            if (i >= rows) return null;
            if (hIter.getDone() && vIter.getDone()) {
                oldI = i;
                noIterY();
                if (oldI == i) break;
            } else if (hIter.getDone() && !vIter.getDone()) {
                tmp = (vIter.getCurrentIndex() - i) * this._defaultCellHeight;
                if (y + tmp > nScroll) {
                    oldI = i;
                    noIterY();
                    if (oldI == i) break;
                } else {
                    useVIterY();
                }
            } else if (!hIter.getDone() && vIter.getDone()) {
                tmp = (hIter.getCurrentIndex() - i) * this._defaultCellHeight;
                if (y + tmp > nScroll) {
                    oldI = i;
                    noIterY();
                    if (oldI == i) break;
                } else {
                    useHIterY();
                }
            } else {
                if (hIter.getCurrentIndex() == vIter.getCurrentIndex()) {
                    useVIterY();
                    hIter.next();
                } else if (hIter.getCurrentIndex() < vIter.getCurrentIndex()) {
                    useHIterY();
                } else {
                    useVIterY();
                }
            }
        }
        if (lastI >= rows) return null;
        if (!this.getCellVisible(nAxis, lastI)) lastI = this.getNextVisibleCell(nAxis, lastI);
        return lastI;
    }
};
_p._getFirstViewCell = function (nAxis, nScroll) {
    if (nScroll == 0) {
        var pos = this._nonFixedCell[nAxis];
        if (this.getCellVisible(nAxis, pos)) return pos;
        return this.getNextVisibleCell(nAxis, pos);
    }
    var res = this._getCellAt(nAxis, nScroll, this._nonFixedCell[nAxis]);
    var next = this.getNextVisibleCell(nAxis, res);
    if (next == null) return res;
    return next;
};
_p.getDimensionAt = function (nAxis, y) {
    var dm = this.getDataModel();
    var count = dm.getAxisDimensionCount(nAxis);
    var top = 0;
    var h;
    for (var dim = 0; dim < count && top < y; dim++) {
        if (this.getAxisDimensionVisible(nAxis, dim)) {
            h = nAxis == 0 ? this.getDimensionHeight(dim) : this.getDimensionWidth(dim);
            if (top + h >= y) return dim;
            top += h;
        }
    }
    return null;
};
_p._cellMinimumWidth = 18;
BiOlapGridViewManager.addProperty("cellMinimumWidth", BiAccessType.READ_WRITE);
_p._cellMinimumHeight = 19;
BiOlapGridViewManager.addProperty("cellMinimumHeight", BiAccessType.READ_WRITE);