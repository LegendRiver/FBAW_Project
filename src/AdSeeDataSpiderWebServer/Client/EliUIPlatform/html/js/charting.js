/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiGraphBase() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._series = [];
    this._charts = {};
    this._categories = [];
    this._seriesMap = {};
    this._categoriesMap = {};
    this._points = {};
    this._presentationManager = new BiChartPresentationManager(this);
    this._chartPresentations = {};
    this.setSize(300, 200);
    this.setForeColor("black");
    this.addEventListener("click", this._onMouseEvent);
    this.addEventListener("mousedown", this._onMouseEvent);
    this.addEventListener("mouseup", this._onMouseEvent);
    this.addEventListener("mouseover", this._onMouseEvent);
    this.addEventListener("mouseout", this._onMouseEvent);
    this.addEventListener("mousemove", this._onMouseEvent);
    this.addEventListener("dblclick", this._onMouseEvent);
    this.addEventListener("contextmenu", this._onMouseEvent);
    this.addEventListener("mousewheel", this._onMouseEvent);
};
_p = _biExtend(BiGraphBase, BiComponent, "BiGraphBase");
_p._chartType = "column";
_p._xAxis = null;
_p._yAxis = null;
_p._gridLines = null;
_p._chartArea = null;
_p._chartAreaLeft = 100;
_p._chartAreaTop = 100;
_p._chartAreaWidth = 800;
_p._chartAreaHeight = 800;
_p._autoScale = false;
_p._scaleFactor = null;
_p._catScaleFactor = null;
BiGraphBase.addProperty("presentationManager", BiAccessType.READ);
BiGraphBase.addProperty("chartArea", BiAccessType.READ);
BiGraphBase.addProperty("valueAxis", BiAccessType.READ);
BiGraphBase.addProperty("categoryAxis", BiAccessType.READ);
BiGraphBase.addProperty("gridLines", BiAccessType.READ);
BiGraphBase.addProperty("legend", BiAccessType.READ);
BiGraphBase.addProperty("autoScale", BiAccessType.READ);
_p.setAutoScale = function (b) {};
_p.getGrid = function () {
    return this._gridComponent;
};
_p._scaleFont = function () {
    if (this._autoScale) {
        this.setFontSize(Math.min(this.getClientWidth(), this.getClientHeight()) / 25);
    }
};
_p.setFontSize = function (n) {
    this._valueAxis.setFontSize(n);
    this._categoryAxis.setFontSize(n);
    this._legend.setFontSize(n);
};
_p.getFontSize = function () {
    var s1 = this._valueAxis.getFontSize();
    var s2 = this._categoryAxis.getFontSize();
    var s3 = this._legend.getFontSize();
    if (s1 == s2 && s2 == s3) return s1;
    return null;
};
_p.addSeries = function (oSeries) {
    var id = oSeries.getId();
    this._series.push(oSeries);
    this._seriesMap[id] = oSeries;
    oSeries._index = this._series.length - 1;
    this._chartPresentations[id] = new BiChartPresentation(this, oSeries);
};
_p.removeSeries = function (oSeries) {
    this._series.remove(oSeries);
    delete this._seriesMap[oSeries.getId()];
    var chart = this.getChartForSeries(oSeries);
    this._removeChart(chart);
    oSeries._index = null;
    for (var i = 0; i < this._series.length; i++) this._series[i]._index = i;
};
_p.clearSeries = function () {
    for (var i = 0; i < this._series.length; i++) this._series[i]._index = null;
    this._series = [];
    this._seriesMap = {};
};
_p.getSeriesById = function (sId) {
    return this._seriesMap[sId];
};
BiGraphBase.addProperty("series", BiAccessType.READ);
_p.setSeries = function (aSeries) {
    this.clearSeries();
    for (var i = 0; i < aSeries.length; i++) this.addSeries(aSeries[i]);
};
_p.addCategory = function (oCategory) {
    this._categories.push(oCategory);
    this._categoriesMap[oCategory.getId()] = oCategory;
    oCategory._index = this._categories.length - 1;
};
_p.removeCategory = function (oCategory) {
    this._categories.remove(oCategory);
    delete this._categoriesMap[oCategory.getId()];
    for (var i = 0; i < this._categories.length; i++) this._categories[i]._index = i;
};
_p.clearCategories = function () {
    for (var i = 0; i < this._categories.length; i++) this._categories[i]._index = null;
    this._categories = [];
    this._categoriesMap = {};
};
_p.getCategoryById = function (sId) {
    return this._categoriesMap[sId];
};
BiGraphBase.addProperty("categories", BiAccessType.READ);
_p.setCategories = function (aCategories) {
    this.clearCategories();
    for (var i = 0; i < aCategories.length; i++) this.addCategory(aCategories[i]);
};
_p.addPoint = function (oPoint) {
    var sId = oPoint.getSeriesId();
    var cId = oPoint.getCategoryId();
    if (this._points[sId] == null) this._points[sId] = {};
    this._points[sId][cId] = oPoint;
};
_p.removePoint = function (oPoint) {
    var sId = oPoint.getSeriesId();
    var cId = oPoint.getCategoryId();
    if (this._points[sId] == null) return;
    delete this._points[sId][cId];
};
_p.clearPoints = function () {
    this._points = {};
};
_p.getPointByIds = function (sSeriesId, sCategoryId) {
    if (this._points[sSeriesId]) return this._points[sSeriesId][sCategoryId];
    return null;
};
_p.getPoints = function () {
    var res = [];
    for (var sId in this._points) {
        for (var cId in this._points[sId]) res.push(this._points[sId][cId]);
    }
    return res;
};
_p.setPoints = function (aPoints) {
    this.clearPoints();
    for (var i = 0; i < aPoints.length; i++) this.addPoint(aPoints[i]);
};
_p.getComponentByIds = function (sSeriesId, sCategoryId) {
    var c = this._charts[sSeriesId];
    if (!c) return null;
    return c.getComponentByCategoryId(sCategoryId);
};
_p.getChartPresentationBySeriesId = function (sSeriesId) {
    return this._chartPresentations[sSeriesId];
};
_p.getChartPresentation = BiGraphBase.prototype.getChartPresentationBySeriesId;
BiGraphBase.addProperty("chartType", BiAccessType.READ);
_p.setChartType = function (sType) {
    if (this._chartType != sType) {
        this._chartType = sType;
        if (sType == "grid" && this._legend) this._legend.setZIndex(-1);
        else if (this._legend) this._legend.setZIndex(1000);
        this._currentColorIndex = 0;
        this._syncChartForSeries();
    }
};
_p.getCharts = function () {
    var res = [];
    for (var sId in this._charts) res.push(this._charts[sId]);
    return res;
};
_p.getChartForSeries = function (oSeries) {
    var id = oSeries.getId();
    return this._charts[id];
};
_p._syncChartForSeries = function () {
    var sType = this.getChartType();
    this._removeAllCharts();
    if (sType != "grid") {
        if (this._gridComponent) {
            this.remove(this._gridComponent);
            this._gridComponent.dispose();
            this._gridComponent = null;
        }
        var l = sType == "pie" ? (this._series.length > 0 ? 1 : 0) : this._series.length;
        for (var i = 0; i < l; i++) this._createChartFromSeries(this._series[i]);
    } else {
        if (!this._gridComponent) {
            this._gridComponent = new BiGridChart(this);
            this._gridComponent.setLocation(0, 0);
            this._gridComponent.setRight(0);
            this._gridComponent.setBottom(0);
            this._gridComponent.setBorder(new BiBorder(0));
            this.add(this._gridComponent);
        }
    }
};
_p._removeChart = function (oChart) {
    var id = oChart.getSeries().getId();
    this._chartArea.remove(oChart);
    delete this._charts[id];
    oChart.dispose();
};
_p._removeAllCharts = function () {
    for (var id in this._charts) {
        this._chartArea.remove(this._charts[id]);
        this._charts[id].dispose();
        delete this._charts[id];
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    var i, j;
    for (i = this._series.length - 1; i >= 0; i--) this._series[i].dispose();
    for (i = this._categories.length - 1; i >= 0; i--) this._categories[i].dispose();
    for (i in this._seriesMap) this._seriesMap[i].dispose();
    for (i in this._categoriesMap) this._categoriesMap[i].dispose();
    for (i in this._points) {
        for (j in this._points[i]) this._points[i][j].dispose();
    }
    for (i in this._charts) this._charts[i].dispose();
    for (i in this._chartPresentations) this._chartPresentations[i].dispose();
    this._presentationManager.dispose();
    this._points = null;
    this._chartPresentations = null;
    this._charts = null;
    this._series = null;
    this._seriesMap = null;
    this._categories = null;
    this._categoriesMap = null;
    this._gridComponent = null;
    this._chartArea = null;
    this._valueAxis = null;
    this._categoryAxis = null;
    this._legend = null;
    this._contentArea = null;
    this._gridLines = null;
};
_p._getCategoryOnXAxis = function () {
    switch (this._chartType) {
    case "bar":
    case "stackedbar":
    case "percentagestackedbar":
        return false;
    default:
        return true;
    }
};
_p._getStackedChart = function () {
    switch (this._chartType) {
    case "stackedcolumn":
    case "stackedbar":
    case "percentagestackedcolumn":
    case "percentagestackedbar":
        return true;
    default:
        return false;
    }
};
_p._getPercentageStack = function () {
    switch (this._chartType) {
    case "percentagestackedcolumn":
    case "percentagestackedbar":
        return true;
    default:
        return false;
    }
};
_p._getSupportsValueAxis = function () {
    var cs = this.getCharts();
    if (cs.length == 0) return false;
    return cs[0].getSupportsValueAxis();
};
_p._getSupportsCategoryAxis = function () {
    var cs = this.getCharts();
    if (cs.length == 0) return false;
    return cs[0].getSupportsCategoryAxis();
};
_p._getSupportsGridLines = function () {
    var cs = this.getCharts();
    if (cs.length == 0) return false;
    return cs[0].getSupportsGridLines();
};
_p._updateCharts = function () {
    for (var id in this._charts) this._charts[id]._updateChart();
};
_p.update = function () {};
_p.updatePoint = function (sSeriesId, sCategoryId) {
    var c;
    if (this.getChartType() == "grid") {
        if (!this._gridComponent) return;
        c = this._gridComponent.getCellByIds(sSeriesId, sCategoryId);
        if (c) c.update();
        else {
            var r = this._gridComponent.getRowById(sSeriesId);
            if (r) r.update();
        }
    } else {
        c = this.getChartForSeries(this.getSeriesById(sSeriesId));
        if (!c) return;
        if (sCategoryId != null) c._updateValueByCategoryId(sCategoryId);
        else c._updateValues();
    }
};
_p.fromXmlDocument = function (oDoc) {
    this._removeAllCharts();
    this.clearCategories();
    this.clearSeries();
    var docEl = oDoc.documentElement;
    var title = docEl.selectSingleNode("Title");
    title = title ? title.text : null;
    var dataEl = docEl.selectSingleNode("Data");
    var categories = dataEl.selectNodes("Categories/Category");
    var i, l = categories.length;
    for (i = 0; i < l; i++) this.addCategory(BiChartCategory.fromXmlElement(this, categories[i]));
    var series = dataEl.selectNodes("SeriesGroup/Series");
    l = series.length;
    for (i = 0; i < l; i++) this.addSeries(BiChartSeries.fromXmlElement(this, series[i]));
    var presentation = docEl.selectSingleNode("Presentation");
    this.setChartType(presentation.getAttribute("Type") || "line");
    var chartArea = presentation.selectSingleNode("ChartArea");
    if (chartArea) this._chartArea.fromXmlElement(chartArea);
    var points = presentation.selectNodes("Points/Point");
    l = points.length;
    for (i = 0; i < l; i++) {
        this.addPoint(BiChartPoint.fromXmlElement(this, points[i]));
    }
    var charts = presentation.selectNodes("Charts/Chart");
    l = charts.length;
    var cp;
    for (i = 0; i < l; i++) {
        cp = BiChartPresentation.fromXmlElement(this, charts[i]);
        if (cp) this._chartPresentations[cp.getSeries().getId()] = cp;
    }
    var legend = presentation.selectSingleNode("Legend");
    if (legend) this._legend.fromXmlElement(legend);
    var valueAxis = presentation.selectSingleNode("Axes/ValueAxis");
    if (valueAxis) this._valueAxis.fromXmlElement(valueAxis);
    var categoryAxis = presentation.selectSingleNode("Axes/CategoryAxis");
    if (categoryAxis) this._categoryAxis.fromXmlElement(categoryAxis);
    var gridLines = presentation.selectSingleNode("GridLines");
    if (gridLines) {
        this._gridLines.fromXmlElement(gridLines);
    }
};
_p.toXmlDocument = function () {
    var doc = new BiXmlDocument();
    doc.loadXML("<Graph><Data><Categories/><SeriesGroup/></Data><Presentation/></Graph>");
    var docEl = doc.documentElement;
    var i, categoriesEl = docEl.firstChild.firstChild;
    for (i = 0; i < this._categories.length; i++) categoriesEl.appendChild(this._categories[i].toXmlElement(doc));
    var seriesGroupEl = docEl.firstChild.lastChild;
    for (i = 0; i < this._series.length; i++) seriesGroupEl.appendChild(this._series[i].toXmlElement(doc));
    var presentationEl = docEl.lastChild;
    presentationEl.setAttribute("Type", this.getChartType());
    presentationEl.appendChild(this._legend.toXmlElement(doc));
    var axesEl = doc.createElement("Axes");
    presentationEl.appendChild(axesEl);
    axesEl.appendChild(this._valueAxis.toXmlElement(doc));
    axesEl.appendChild(this._categoryAxis.toXmlElement(doc));
    presentationEl.appendChild(this._gridLines.toXmlElement(doc));
    presentationEl.appendChild(this._chartArea.toXmlElement(doc));
    var points = this.getPoints();
    var pointsEl = doc.createElement("Points");
    for (i = 0; i < points.length; i++) pointsEl.appendChild(points[i].toXmlElement(doc));
    presentationEl.appendChild(pointsEl);
    var chartsEl = doc.createElement("Charts");
    for (var id in this._chartPresentations) chartsEl.appendChild(this._chartPresentations[id].toXmlElement(doc));
    presentationEl.appendChild(chartsEl);
    return doc;
};
_p._onMouseEvent = function (e) {
    var c = e.getTarget();
    while (c != null && c != this && (typeof c.getSeries != "function" || typeof c.getCategory != "function")) c = c.getParent();
    if (c == this || c == null) return;
    var sType = "point" + e.getType();
    var ce = new BiChartMouseEvent(sType, e._event, c.getSeries(), c.getCategory());
    this.dispatchEvent(ce);
    ce.dispose();
};
_p.getContextMenuForPoint = function (oSeries, oCategory) {
    return null;
};
_p.getToolTipForPoint = function (oSeries, oCategory) {
    var tt = BiToolTip.getTextToolTip("Series \"" + oSeries.getTitle() + "\" Category \"" + oCategory.getTitle() + "\"\nValue: " + oSeries.getValueByCategoryId(oCategory.getId()));
    tt.setHideInterval(600 * 1000);
    return tt;
};

function BiChartCategory(oGraph, sId, sTitle) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._graph = oGraph;
    this._id = sId;
    if (sTitle) this._title = sTitle;
};
_p = _biExtend(BiChartCategory, BiObject, "BiChartCategory");
_p._id = null;
_p._title = "";
_p._index = null;
BiChartCategory.addProperty("id", BiAccessType.READ);
BiChartCategory.addProperty("title", BiAccessType.READ_WRITE);
BiChartCategory.addProperty("index", BiAccessType.READ);
BiChartCategory.fromXmlElement = function (oGraph, oNode) {
    var cat = new BiChartCategory(oGraph);
    cat.fromXmlElement(oNode);
    return cat;
};
_p.fromXmlElement = function (oNode) {
    var id = oNode.getAttribute("Id");
    var title = oNode.selectSingleNode("Title");
    title = title ? title.text : null;
    this._id = id;
    this._title = title;
};
_p.toXmlElement = function (oDoc) {
    var category = oDoc.createElement("Category");
    category.setAttribute("Id", this.getId());
    if (this.getTitle()) {
        var titleEl = oDoc.createElement("Title");
        titleEl.appendChild(oDoc.createTextNode(this.getTitle()));
        category.appendChild(titleEl);
    }
    return category;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this._graph = null;
};

function BiChartSeries(oGraph, sId, sTitle, oValues) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._graph = oGraph;
    this._id = sId;
    this._categoryValueMap = {};
    if (sTitle) this._title = sTitle;
    if (oValues) this.setValues(oValues);
}
_p = _biExtend(BiChartSeries, BiObject, "BiChartSeries");
_p._title = "";
_p._cachedSum = null;
_p._cachedAbsSum = null;
_p._cachedValues = null;
_p._cachedMaximumValue = null;
_p._cachedMinimumValue = null;
BiChartSeries.fromXmlElement = function (oGraph, oNode) {
    var series = new BiChartSeries(oGraph);
    series.fromXmlElement(oNode);
    return series;
};
_p.fromXmlElement = function (oNode) {
    var id = oNode.getAttribute("Id");
    var title = oNode.selectSingleNode("Title");
    title = title ? title.text : null;
    this._id = id;
    this._title = title;
    var values = oNode.selectNodes("Values/Value");
    var l = values.length;
    var catId;
    for (var i = 0; i < l; i++) {
        catId = values[i].getAttribute("Category");
        this.setValueByCategoryId(catId, Number(values[i].text));
    }
};
_p.toXmlElement = function (oDoc) {
    var series = oDoc.createElement("Series");
    series.setAttribute("Id", this.getId());
    if (this.getTitle()) {
        var titleEl = oDoc.createElement("Title");
        titleEl.appendChild(oDoc.createTextNode(this.getTitle()));
        series.appendChild(titleEl);
    }
    var valuesEl = oDoc.createElement("Values");
    var valueEl;
    for (var catId in this._categoryValueMap) {
        valueEl = oDoc.createElement("Value");
        valueEl.setAttribute("Category", catId);
        valueEl.appendChild(oDoc.createTextNode(this._categoryValueMap[catId].toString()));
        valuesEl.appendChild(valueEl);
    }
    series.appendChild(valuesEl);
    return series;
};
BiChartSeries.addProperty("title", BiAccessType.READ_WRITE);
BiChartSeries.addProperty("id", BiAccessType.READ);
BiChartSeries.addProperty("index", BiAccessType.READ);
_p.getValueByCategory = function (oCategory) {
    return this.getValueByCategoryId(oCategory.getId());
};
_p.setValueByCategory = function (oCategory, nValue) {
    this.setValueByCategoryId(oCategory.getId(), nValue);
};
_p.getValueByCategoryId = function (sCatId) {
    var v = this._categoryValueMap[sCatId];
    return isNaN(v) ? null : v;
};
_p.setValueByCategoryId = function (sCatId, nValue) {
    this._clearCache();
    if (nValue == null || isNaN(nValue)) delete this._categoryValueMap[sCatId];
    else this._categoryValueMap[sCatId] = nValue;
};
_p.setValues = function (aValues) {
    var cats = this._graph.getCategories();
    var l = cats.length;
    var id;
    this._values = new Array(l);
    for (var i = 0; i < l; i++) {
        id = cats[i].getId();
        if (aValues[i] == null || isNaN(aValues[i])) delete this._categoryValueMap[id];
        else this._categoryValueMap[id] = aValues[i];
    }
    this._clearCache();
};
_p.getValues = function () {
    if (this._cachedValues != null) return this._cachedValues;
    var cats = this._graph.getCategories();
    var l = cats.length;
    var res = new Array(l);
    var v;
    for (var i = 0; i < l; i++) {
        v = this._categoryValueMap[cats[i].getId()];
        res[i] = isNaN(v) ? null : v;
    }
    return this._cachedValues = res;
};
_p.getValueByIndex = function (i) {
    var cat = this._graph.getCategories()[i];
    return cat ? this.getValueByCategory(cat) : null;
};
_p.setValueByIndex = function (i, nValue) {
    var cat = this._graph.getCategories()[i];
    if (cat) this.setValueByCategory(cat, nValue);
};
_p.getMaximumValue = function () {
    if (this._cachedMaximumValue != null) return this._cachedMaximumValue;
    return this._cachedMaximumValue = Math.max.apply(null, this.getValues());
};
_p.getMinimumValue = function () {
    if (this._cachedMinimumValue != null) return this._cachedMinimumValue;
    return this._cachedMinimumValue = Math.min.apply(null, this.getValues());
};
_p.getSum = function () {
    if (this._cachedSum != null) return this._cachedSum;
    var sum = 0;
    for (var id in this._categoryValueMap) sum += this._categoryValueMap[id];
    return this._cachedSum = sum;
};
_p.getAbsSum = function () {
    if (this._cachedAbsSum != null) return this._cachedAbsSum;
    var sum = 0;
    for (var id in this._categoryValueMap) sum += Math.abs(this._categoryValueMap[id]);
    return this._cachedAbsSum = sum;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    for (var id in this._categoryValueMap) delete this._categoryValueMap[id];
    this._categoryValueMap = null;
    this._clearCache();
};
_p._clearCache = function () {
    this._cachedSum = null;
    this._cachedAbsSum = null;
    this._cachedValues = null;
    this._cachedMaximumValue = null;
    this._cachedMinimumValue = null;
};

function BiGridChart(oGraph) {
    if (_biInPrototype) return;
    BiGrid.call(this);
    this._graph = oGraph;
    this._rowsById = {};
    this._cellsById = {};
    this._fromGraph();
    this.setShowRowHeaders(true);
    this.setSelectionMode("cell");
    this.setRowHeadersWidth(70);
}
_p = _biExtend(BiGridChart, BiGrid, "BiGridChart");
BiGridChart.addProperty("graph", BiAccessType.READ);
_p._fromGraph = function () {
    var cats = this._graph.getCategories();
    this.setColumnCount(cats.length);
    var columnNames = [];
    var columnWidths = [];
    var columnAligns = [];
    var i;
    for (i = 0; i < cats.length; i++) {
        columnNames[i] = cats[i].getTitle();
        columnWidths[i] = 50;
        columnAligns[i] = "right";
    }
    this.setColumnNames(columnNames);
    this.setColumnWidths(columnWidths);
    this.setColumnAligns(columnAligns);
    var series = this._graph.getSeries();
    var row, cell, sId, catId;
    for (i = 0; i < series.length; i++) {
        sId = series[i].getId();
        row = new BiGridChartRow(this._graph, sId);
        this.addRow(row);
        this._cellsById[sId] = {};
        this._rowsById[sId] = row;
        for (var j = 0; j < cats.length; j++) {
            catId = cats[j].getId();
            cell = new BiGridChartCell(this._graph, sId, catId);
            row.addCell(cell);
            this._cellsById[sId][catId] = cell;
        }
    }
};
_p.getRowById = function (sSeriesId) {
    return this._rowsById[sSeriesId];
};
_p.getCellByIds = function (sSeriesId, sCategoryId) {
    return this._cellsById[sSeriesId][sCategoryId];
};
_p.dispose = function () {
    if (this._disposed) return;
    BiGrid.prototype.dispose.call(this);
    this._graph = null;
    var i;
    for (i in this._rowsById) delete this._rowsById[i];
    this._rowsById = null;
    for (i in this._cellsById) {
        for (var j in this._cellsById[i]) delete this._cellsById[i][j];
        delete this._cellsById[i];
    }
    this._cellsById = null;
};

function BiGridChartRow(oGraph, sSeriesId) {
    if (_biInPrototype) return;
    BiGridRow.call(this);
    this._graph = oGraph;
    this._seriesId = sSeriesId;
};
_p = _biExtend(BiGridChartRow, BiGridRow, "BiGridChartRow");
BiGridChartRow.addProperty("graph", BiAccessType.READ);
BiGridChartRow.addProperty("seriesId", BiAccessType.READ);
_p.getRowHeaderLabelHtml = function () {
    return this._graph.getSeriesById(this._seriesId).getTitle();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiGridCell.prototype.dispose.call(this);
    this._graph = null;
};

function BiGridChartCell(oGraph, sSeriesId, sCategoryId) {
    if (_biInPrototype) return;
    BiGridCell.call(this);
    this._graph = oGraph;
    this._seriesId = sSeriesId;
    this._categoryId = sCategoryId;
};
_p = _biExtend(BiGridChartCell, BiGridCell, "BiGridChartCell");
BiGridChartCell.addProperty("graph", BiAccessType.READ);
BiGridChartCell.addProperty("seriesId", BiAccessType.READ);
BiGridChartCell.addProperty("categoryId", BiAccessType.READ);
_p.getData = function () {
    return this._graph.getSeriesById(this._seriesId).getValueByCategoryId(this._categoryId);
};
_p.getLabelHtml = function () {
    var v = this.getData();
    return v != null ? v : "&nbsp;";
};
_p.dispose = function () {
    if (this._disposed) return;
    BiGridCell.prototype.dispose.call(this);
    this._graph = null;
};

function BiChartLegend(oGraph) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._graph = oGraph;
    this.setSize(50, 20);
    this.setRight(10);
    this.setBorder(new BiBorder(1, "solid", "black"));
    this.setBackColor("white");
    this.setZIndex(1000);
};
_p = _biExtend(BiChartLegend, BiComponent, "BiChartLegend");
_p._fontSize = 11;
_p._topSet = false;
BiChartLegend.addProperty("graph", BiAccessType.READ_WRITE);
BiChartLegend.addProperty("fontSize", BiAccessType.READ);
_p.layoutComponent = function () {
    if (this.getCreated()) {
        var ph = this.getPreferredHeight();
        this.pack();
        if (!this._topSet) this._setTop((this.getParent().getClientHeight() - ph) / 2);
    }
    BiComponent.prototype.layoutComponent.call(this);
};
_p._update = function () {
    if (!this.getCreated()) return;
    var cs = this.getChildren();
    var tmp, label, items;
    for (var i = cs.length - 1; i >= 0; i--) {
        tmp = cs[i];
        this.remove(tmp);
        tmp.dispose();
    }
    if (!this.getVisible()) return;
    if (this._graph.getChartType() == "pie") items = this._graph.getCharts()[0].getChildren();
    else items = this._graph.getCharts();
    var l = items.length;
    for (i = 0; i < l; i++) {
        label = new BiChartLegendLabel(items[i]);
        label._setFontSize(this._fontSize);
        this.add(label);
    }
    this.invalidateParentLayout(BiComponent.STRING_SIZE);
    this.invalidateLayout();
};
_p.layoutAllChildren = function () {
    if (!this.getCreated()) return;
    var y = 0;
    var cs = this.getChildren();
    for (var i = 0; i < cs.length; i++) {
        cs[i].setTop(y);
        y += cs[i].getPreferredHeight();
    }
    BiComponent.prototype.layoutAllChildren.call(this);
};
_p._computePreferredWidth = function () {
    var pw = 0;
    var cs = this.getChildren();
    for (var i = 0; i < cs.length; i++) {
        pw = Math.max(pw, cs[i].getPreferredWidth());
    }
    return this.getInsetLeft() + this.getInsetRight() + pw;
};
_p._computePreferredHeight = function () {
    var ph = 0;
    var cs = this.getChildren();
    for (var i = 0; i < cs.length; i++) {
        ph += cs[i].getPreferredHeight();
    }
    return this.getInsetTop() + this.getInsetBottom() + ph;
};
_p.setFontSize = function (n) {
    if (n != this._fontSize) {
        this._fontSize = n;
        var cs = this.getChildren();
        for (var i = 0; i < cs.length; i++) {
            cs[i]._setFontSize(n);
        }
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._graph = null;
};
_p.fromXmlElement = function (oNode) {
    this.setVisible(oNode.getAttribute("Visible") != "false");
};
_p.toXmlElement = function (oDoc) {
    var el = oDoc.createElement("Legend");
    el.setAttribute("Visible", String(this.getVisible()));
    return el;
};
_p._setTop = function (n) {
    BiComponent.prototype.setTop.call(this, n);
};
_p.setTop = function (nTop) {
    this._topSet = nTop != null;
    BiComponent.prototype.setTop.call(this, nTop);
};
_p.setLocation = function (nLeft, nTop) {
    this._topSet = nTop != null;
    BiComponent.prototype.setLocation.call(this, nLeft, nTop);
};

function BiChartLegendLabel(oLegendFor) {
    if (_biInPrototype) return;
    BiLabel.call(this);
    this._legendFor = oLegendFor;
    this.setPadding(2);
    this.setText(oLegendFor.getTitle());
    this.setIcon(oLegendFor);
    this.setLeft(0);
    this.setRight(0);
}
_p = _biExtend(BiChartLegendLabel, BiLabel, "BiChartLegendLabel");
_p._legendFor = null;
BiChartLegendLabel.addProperty("legendFor", BiAccessType.READ);
_p.setLegendFor = function (oLegendFor) {
    this._legendFor = oLegendFor;
    this.setText(oLegendFor.getTitle());
    this.setIcon(oLegendFor);
};
_p._setFontSize = function (n) {
    this.setStyleProperty("fontSize", n + "px");
    this.invalidateParentLayout("preferred");
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiLabel.prototype.dispose.call(this);
    this._graph = null;
    this._legendFor = null;
};

function BiChartPoint(oGraph, sSeriesId, sCategoryId) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._graph = oGraph;
    this._seriesId = sSeriesId;
    this._categoryId = sCategoryId;
};
_p = _biExtend(BiChartPoint, BiObject, "BiChartPoint");
_p._categoryId = null;
_p._seriesId = null;
_p._fillOpacity = null;
_p._fillColor = null;
_p._fillColor2 = null;
_p._fillType = null;
_p._fillAngle = null;
_p._strokeOpacity = null;
_p._strokeColor = null;
BiChartPoint.addProperty("categoryId", BiAccessType.READ);
BiChartPoint.addProperty("seriesId", BiAccessType.READ);
BiChartPoint.addProperty("fillOpacity", BiAccessType.READ);
BiChartPoint.addProperty("fillColor", BiAccessType.READ);
BiChartPoint.addProperty("fillColor2", BiAccessType.READ);
BiChartPoint.addProperty("fillType", BiAccessType.READ);
BiChartPoint.addProperty("fillAngle", BiAccessType.READ);
BiChartPoint.addProperty("strokeOpacity", BiAccessType.READ);
BiChartPoint.addProperty("strokeColor", BiAccessType.READ);
BiChartPoint.addProperty("markerType", BiAccessType.READ);
BiChartPoint.addProperty("markerVisible", BiAccessType.READ);
BiChartPoint.addProperty("explode", BiAccessType.READ);
_p.hasFillOpacity = function () {
    return this._fillOpacity != null;
};
_p.hasFillColor = function () {
    return this._fillColor != null;
};
_p.hasFillColor2 = function () {
    return this._fillColor2 != null;
};
_p.hasFillType = function () {
    return this._fillType != null;
};
_p.hasFillAngle = function () {
    return this._fillAngle != null;
};
_p.hasStrokeOpacity = function () {
    return this._strokeOpacity != null;
};
_p.hasStrokeColor = function () {
    return this._strokeColor != null;
};
_p.hasMarkerType = function () {
    return this._markerType != null;
};
_p.hasMarkerVisible = function () {
    return this._markerVisible != null;
};
_p.hasExplode = function () {
    return this._explode != null;
};
_p.getComponent = function () {
    var s = this._graph.getSeriesById(this._seriesId);
    var c = this._graph.getChartForSeries(s);
    if (!c) return null;
    var cat = this._graph.getCategoryById(this._categoryId);
    return c.getComponentForCategory(cat);
};
BiChartPoint.fromXmlElement = function (oGraph, oNode) {
    var p = new BiChartPoint(oGraph);
    p.fromXmlElement(oNode);
    return p;
};
_p.fromXmlElement = function (oNode) {
    var seriesId = oNode.getAttribute("Series");
    var categoryId = oNode.getAttribute("Category");
    this._seriesId = seriesId;
    this._categoryId = categoryId;
    var n = oNode.selectSingleNode("Stroke/@Opacity");
    if (n) this.setStrokeOpacity(Number(n.text ? n.text : n.nodeValue));
    n = oNode.selectSingleNode("Stroke/@Color");
    if (n) this.setStrokeColor(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Opacity");
    if (n) this.setFillOpacity(Number(n.text ? n.text : n.nodeValue));
    n = oNode.selectSingleNode("Fill/@Color");
    if (n) this.setFillColor(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Color2");
    if (n) this.setFillColor2(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Type");
    if (n) this.setFillType(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Angle");
    if (n) this.setFillAngle(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Marker/@Type");
    if (n) this.setMarkerType(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Marker/@Visible");
    if (n) this.setMarkerVisible((n.text ? n.text : n.nodeValue) != "false");
    n = oNode.selectSingleNode("Explode");
    if (n) this.setExplode(Number(n.text ? n.text : n.nodeValue));
};
_p.toXmlElement = function (oDoc) {
    var p = oDoc.createElement("Point");
    p.setAttribute("Series", this.getSeriesId());
    p.setAttribute("Category", this.getCategoryId());
    var el;
    if (this.hasStrokeColor() || this.hasStrokeOpacity()) {
        el = oDoc.createElement("Stroke");
        if (this.hasStrokeOpacity()) el.setAttribute("Opacity", String(this.getStrokeOpacity()));
        if (this.hasStrokeColor()) el.setAttribute("Color", this.getStrokeColor());
        p.appendChild(el);
    }
    if (this.hasFillColor() || this.hasFillColor2() || this.hasFillType() || this.hasFillAngle() || this.hasFillOpacity()) {
        el = oDoc.createElement("Fill");
        if (this.hasFillOpacity()) el.setAttribute("Opacity", String(this.getFillOpacity()));
        if (this.hasFillColor()) el.setAttribute("Color", this.getFillColor());
        if (this.hasFillColor2()) el.setAttribute("Color2", this.getFillColor2());
        if (this.hasFillType()) el.setAttribute("Type", this.getFillType());
        if (this.hasFillAngle()) el.setAttribute("Angle", this.getFillAngle());
        p.appendChild(el);
    }
    if (this.hasMarkerVisible() || this.hasMarkerType()) {
        el = oDoc.createElement("Marker");
        if (this.hasMarkerVisible()) el.setAttribute("Visible", this.getMarkerVisible());
        if (this.hasMarkerType()) el.setAttribute("Type", this.getMarkerType());
        p.appendChild(el);
    }
    if (this.hasExplode()) {
        el = oDoc.createElement("Explode");
        el.appendChild(oDoc.createTextNode(String(this.getExplode())));
        p.appendChild(el);
    }
    return p;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this._graph = null;
};
_p._setPropForPoint = function (sFieldName, sSetterName, oArg) {
    this[sFieldName] = oArg;
    var g = this._graph;
    var c = g.getComponentByIds(this._seriesId, this._categoryId);
    if (c && c[sSetterName]) c[sSetterName](oArg);
};
_p.setFillOpacity = function (v) {
    this._setPropForPoint("_fillOpacity", "setFillOpacity", v);
};
_p.setFillColor = function (v) {
    this._setPropForPoint("_fillColor", "setFillColor", v);
};
_p.setFillColor2 = function (v) {
    this._setPropForPoint("_fillColor2", "setFillColor2", v);
};
_p.setFillType = function (v) {
    this._setPropForPoint("_fillType", "setFillType", v);
};
_p.setFillAngle = function (v) {
    this._setPropForPoint("_fillAngle", "setFillAngle", v);
};
_p.setStrokeOpacity = function (v) {
    this._setPropForPoint("_strokeOpacity", "setStrokeOpacity", v);
};
_p.setStrokeColor = function (v) {
    this._setPropForPoint("_strokeColor", "setStrokeColor", v);
};
_p.setMarkerType = function (v) {
    this._setPropForPoint("_markerType", "setMarkerType", v);
};
_p.setMarkerVisible = function (v) {
    this._setPropForPoint("_markerVisible", "setMarkerVisible", v);
};
_p.setExplode = function (v) {
    this._setPropForPoint("_explode", "setExplode", v);
};

function BiChartPresentation(oGraph, oSeries) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._graph = oGraph;
    this._series = oSeries;
};
_p = _biExtend(BiChartPresentation, BiObject, "BiChartPresentation");
_p._fillOpacity = null;
_p._fillColor = null;
_p._fillColor2 = null;
_p._fillType = null;
_p._fillAngle = null;
_p._strokeOpacity = null;
_p._strokeColor = null;
_p._strokeWidth = null;
_p._markerType = null;
_p._markerVisible = null;
_p._explode = null;
_p._barSpacing = null;
BiChartPresentation.addProperty("graph", BiAccessType.READ);
BiChartPresentation.addProperty("series", BiAccessType.READ);
BiChartPresentation.addProperty("fillOpacity", BiAccessType.READ_WRITE);
BiChartPresentation.addProperty("fillColor", BiAccessType.READ_WRITE);
BiChartPresentation.addProperty("fillColor2", BiAccessType.READ_WRITE);
BiChartPresentation.addProperty("fillType", BiAccessType.READ_WRITE);
BiChartPresentation.addProperty("fillAngle", BiAccessType.READ_WRITE);
BiChartPresentation.addProperty("strokeColor", BiAccessType.READ_WRITE);
BiChartPresentation.addProperty("strokeWidth", BiAccessType.READ_WRITE);
BiChartPresentation.addProperty("strokeOpacity", BiAccessType.READ_WRITE);
BiChartPresentation.addProperty("markerType", BiAccessType.READ_WRITE);
BiChartPresentation.addProperty("markerVisible", BiAccessType.READ_WRITE);
BiChartPresentation.addProperty("explode", BiAccessType.READ_WRITE);
BiChartPresentation.addProperty("barSpacing", BiAccessType.READ);
_p.hasFillOpacity = function () {
    return this._fillOpacity != null;
};
_p.hasFillColor = function () {
    return this._fillColor != null;
};
_p.hasFillColor2 = function () {
    return this._fillColor2 != null;
};
_p.hasFillType = function () {
    return this._fillType != null;
};
_p.hasFillAngle = function () {
    return this._fillAngle != null;
};
_p.hasStrokeColor = function () {
    return this._strokeColor != null;
};
_p.hasStrokeWidth = function () {
    return this._strokeWidth != null;
};
_p.hasStrokeOpacity = function () {
    return this._strokeOpacity != null;
};
_p.hasMarkerType = function () {
    return this._markerType != null;
};
_p.hasMarkerVisible = function () {
    return this._markerVisible != null;
};
_p.hasExplode = function () {
    return this._explode != null;
};
_p.hasBarSpacing = function () {
    return this._barSpacing != null;
};
_p.setBarSpacing = function (n) {
    this._barSpacing = n;
    this._graph.getPresentationManager().setBarSpacingForPoint(null, null, n);
};
BiChartPresentation.fromXmlElement = function (oGraph, oNode) {
    var p = new BiChartPresentation(oGraph);
    p.fromXmlElement(oNode);
    if (p._series == null) return null;
    return p;
};
_p.fromXmlElement = function (oNode) {
    var seriesId = oNode.getAttribute("Series");
    var series = this._graph.getSeriesById(seriesId);
    if (!series) return null;
    this._series = series;
    var n = oNode.selectSingleNode("Stroke/@Opacity");
    if (n) this.setStrokeOpacity(Number(n.text ? n.text : n.nodeValue));
    n = oNode.selectSingleNode("Stroke/@Color");
    if (n) this.setStrokeColor(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Stroke/@Width");
    if (n) this.setStrokeWidth(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Opacity");
    if (n) this.setFillOpacity(Number(n.text ? n.text : n.nodeValue));
    n = oNode.selectSingleNode("Fill/@Color");
    if (n) this.setFillColor(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Color2");
    if (n) this.setFillColor2(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Type");
    if (n) this.setFillType(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Angle");
    if (n) this.setFillAngle(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Marker/@Type");
    if (n) this.setMarkerType(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Marker/@Visible");
    if (n) this.setMarkerVisible((n.text ? n.text : n.nodeValue) != "false");
    n = oNode.selectSingleNode("Explode");
    if (n) this.setExplode(Number(n.text ? n.text : n.nodeValue));
    n = oNode.selectSingleNode("BarSpacing");
    if (n) this.setBarSpacing(Number(n.text ? n.text : n.nodeValue));
};
_p.toXmlElement = function (oDoc) {
    var c = oDoc.createElement("Chart");
    c.setAttribute("Series", this.getSeries().getId());
    var el;
    if (this.hasStrokeColor() || this.hasStrokeOpacity() || this.hasStrokeWidth()) {
        el = oDoc.createElement("Stroke");
        if (this.hasStrokeOpacity()) el.setAttribute("Opacity", String(this.getStrokeOpacity()));
        if (this.hasStrokeColor()) el.setAttribute("Color", this.getStrokeColor());
        if (this.hasStrokeWidth()) el.setAttribute("Width", this.getStrokeColor());
        c.appendChild(el);
    }

    if (this.hasFillColor() || this.hasFillColor2() || this.hasFillType() || this.hasFillAngle() || this.hasFillOpacity()) {
        el = oDoc.createElement("Fill");
        if (this.hasFillOpacity()) el.setAttribute("Opacity", String(this.getFillOpacity()));
        if (this.hasFillColor()) el.setAttribute("Color", this.getFillColor());
        if (this.hasFillColor2()) el.setAttribute("Color2", this.getFillColor2());
        if (this.hasFillType()) el.setAttribute("Type", this.getFillType());
        if (this.hasFillAngle()) el.setAttribute("Angle", this.getFillAngle());
        c.appendChild(el);
    }
    if (this.hasMarkerVisible() || this.hasMarkerType()) {
        el = oDoc.createElement("Marker");
        if (this.hasMarkerVisible()) el.setAttribute("Visible", this.getMarkerVisible());
        if (this.hasMarkerType()) el.setAttribute("Type", this.getMarkerType());
        c.appendChild(el);
    }
    if (this.hasExplode()) {
        el = oDoc.createElement("Explode");
        el.appendChild(oDoc.createTextNode(String(this.getExplode())));
        c.appendChild(el);
    }
    if (this.hasBarSpacing()) {
        el = oDoc.createElement("BarSpacing");
        el.appendChild(oDoc.createTextNode(String(this.getBarSpacing())));
        c.appendChild(el);
    }
    return c;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this._graph = null;
    this._series = null;
};

function BiChartPresentationManager(oGraph) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._graph = oGraph;
}
_p = _biExtend(BiChartPresentationManager, BiObject, "BiChartPresentationManager");
_p._barSpacing = null;
_p._defaultColors = ["Red", "Green", "Blue", "Yellow", "Aqua", "Fuchsia", "Lime", "Maroon", "Navy", "Olive", "Purple", "Teal"];
_p.getDefaultColor = function (sSeriesId, sCategoryId) {
    var i = this._getDefaulSettingIndex(sSeriesId, sCategoryId);
    if (i >= this._defaultColors.length) {
        return "#" + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16);
    } else return this._defaultColors[i];
};
_p._defaultMarkers = ["diamond", "square", "triangle", "circle"];
_p.getDefaultMarker = function (sSeriesId, sCategoryId) {
    var i = this._getDefaulSettingIndex(sSeriesId, sCategoryId);
    i = i % this._defaultMarkers.length;
    return this._defaultMarkers[i];
};
_p._getDefaulSettingIndex = function (sSeriesId, sCategoryId) {
    if (this._graph.getChartType() == "pie" && sCategoryId != null) return this._graph.getCategoryById(sCategoryId).getIndex();
    return this._graph.getSeriesById(sSeriesId).getIndex();
};
_p.getFillOpacityForPoint = function (sSeriesId, sCategoryId) {
    var g = this._graph;
    var p = g.getPointByIds(sSeriesId, sCategoryId);
    if (p && p.hasFillOpacity()) return p.getFillOpacity();
    var cp = g.getChartPresentation(sSeriesId);
    if (cp && cp.hasFillOpacity()) return cp.getFillOpacity();
    return 1;
};
_p.getFillColorForPoint = function (sSeriesId, sCategoryId) {
    var g = this._graph;
    var p = g.getPointByIds(sSeriesId, sCategoryId);
    if (p && p.hasFillColor()) return p.getFillColor();
    var cp = g.getChartPresentation(sSeriesId);
    if (cp && cp.hasFillColor()) return cp.getFillColor();
    return this.getDefaultColor(sSeriesId, sCategoryId);
};
_p.getFillColor2ForPoint = function (sSeriesId, sCategoryId) {
    var g = this._graph;
    var p = g.getPointByIds(sSeriesId, sCategoryId);
    if (p && p.hasFillColor2()) return p.getFillColor2();
    var cp = g.getChartPresentation(sSeriesId);
    if (cp && cp.hasFillColor2()) return cp.getFillColor2();
    return null;
};
_p.getFillTypeForPoint = function (sSeriesId, sCategoryId) {
    var g = this._graph;
    var p = g.getPointByIds(sSeriesId, sCategoryId);
    if (p && p.hasFillType()) return p.getFillType();
    var cp = g.getChartPresentation(sSeriesId);
    if (cp && cp.hasFillType()) return cp.getFillType();
    return null;
};
_p.getFillAngleForPoint = function (sSeriesId, sCategoryId) {
    var g = this._graph;
    var p = g.getPointByIds(sSeriesId, sCategoryId);
    if (p && p.hasFillAngle()) return p.getFillAngle();
    var cp = g.getChartPresentation(sSeriesId);
    if (cp && cp.hasFillAngle()) return cp.getFillAngle();
    return null;
};
_p.getStrokeOpacityForPoint = function (sSeriesId, sCategoryId) {
    var g = this._graph;
    var p = g.getPointByIds(sSeriesId, sCategoryId);
    if (p && p.hasStrokeOpacity()) return p.getStrokeOpacity();
    var cp = g.getChartPresentation(sSeriesId);
    if (cp && cp.hasStrokeOpacity()) return cp.getStrokeOpacity();
    if (g.getChartType() == "line") return this.getFillOpacityForPoint(sSeriesId, sCategoryId);
    return 1;
};
_p.getStrokeColorForPoint = function (sSeriesId, sCategoryId) {
    var g = this._graph;
    var p = g.getPointByIds(sSeriesId, sCategoryId);
    if (p && p.hasStrokeColor()) return p.getStrokeColor();
    var cp = g.getChartPresentation(sSeriesId);
    if (cp && cp.hasStrokeColor()) return cp.getStrokeColor();
    if (g.getChartType() == "line") return this.getFillColorForPoint(sSeriesId, sCategoryId);
    return "#000";
};
_p.getStrokeWidthForPoint = function (sSeriesId, sCategoryId) {
    var g = this._graph;
    var p = g.getPointByIds(sSeriesId, sCategoryId);
    if (p && p.hasStrokeWidth()) return p.getStrokeWidth();
    var cp = g.getChartPresentation(sSeriesId);
    if (cp && cp.hasStrokeWidth()) return cp.getStrokeWidth();
    return 1;
};
_p.getMarkerTypeForPoint = function (sSeriesId, sCategoryId) {
    var g = this._graph;
    var p = g.getPointByIds(sSeriesId, sCategoryId);
    if (p && p.hasMarkerType()) return p.getMarkerType();
    var cp = g.getChartPresentation(sSeriesId);
    if (cp && cp.hasMarkerType()) return cp.getMarkerType();
    return this.getDefaultMarker(sSeriesId, sCategoryId);
};
_p.getMarkerVisibleForPoint = function (sSeriesId, sCategoryId) {
    var g = this._graph;
    var p = g.getPointByIds(sSeriesId, sCategoryId);
    if (p && p.hasMarkerVisible()) return p.getMarkerVisible();
    var cp = g.getChartPresentation(sSeriesId);
    if (cp && cp.hasMarkerVisible()) return cp.getMarkerVisible();
    return true;
};
_p.getExplodeForPoint = function (sSeriesId, sCategoryId) {
    var g = this._graph;
    var p = g.getPointByIds(sSeriesId, sCategoryId);
    if (p && p.hasExplode()) return p.getExplode();
    var cp = g.getChartPresentation(sSeriesId);
    if (cp && cp.hasExplode()) return cp.getExplode();
    return 0.05;
};
_p.getBarSpacingForPoint = function (sSeriesId, sCategoryId) {
    if (this._barSpacing != null) return this._barSpacing;
    return 1;
};
_p.getStrokeOpacity = _p.getStrokeOpacityForPoint;
_p.getStrokeColor = _p.getStrokeColorForPoint;
_p.getStrokeWidth = _p.getStrokeWidthForPoint;
_p.getFillOpacity = _p.getFillOpacityForPoint;
_p.getFillColor = _p.getFillColorForPoint;
_p.getFillColor2 = _p.getFillColor2ForPoint;
_p.getFillType = _p.getFillTypeForPoint;
_p.getFillAngle = _p.getFillAngleForPoint;
_p.getMarkerType = _p.getMarkerTypeForPoint;
_p.getMarkerVisible = _p.getMarkerVisibleForPoint;
_p.getExplode = _p.getExplodeForPoint;
_p.getBarSpacing = _p.getBarSpacingForPoint;
_p._setPropForPoint = function (sSetterName, sSeriesId, sCategoryId, oArg) {
    var g = this._graph;
    var p = g.getPointByIds(sSeriesId, sCategoryId);
    if (!p) {
        p = new BiChartPoint(g, sSeriesId, sCategoryId);
        g.addPoint(p);
    }
    if (p[sSetterName]) p[sSetterName](oArg);
    var c = g.getComponentByIds(sSeriesId, sCategoryId);
    if (c && c[sSetterName]) c[sSetterName](oArg);
};
_p.setStrokeOpacityForPoint = function (sSeriesId, sCategoryId, oArg) {
    this._setPropForPoint("setStrokeOpacity", sSeriesId, sCategoryId, oArg);
};
_p.setStrokeColorForPoint = function (sSeriesId, sCategoryId, oArg) {
    this._setPropForPoint("setStrokeColor", sSeriesId, sCategoryId, oArg);
};
_p.setStrokeWidthForPoint = function (sSeriesId, sCategoryId, oArg) {
    this._setPropForPoint("setStrokeWidth", sSeriesId, sCategoryId, oArg);
};
_p.setFillOpacityForPoint = function (sSeriesId, sCategoryId, oArg) {
    this._setPropForPoint("setFillOpacity", sSeriesId, sCategoryId, oArg);
};
_p.setFillColorForPoint = function (sSeriesId, sCategoryId, oArg) {
    this._setPropForPoint("setFillColor", sSeriesId, sCategoryId, oArg);
};
_p.setFillColor2ForPoint = function (sSeriesId, sCategoryId, oArg) {
    this._setPropForPoint("setFillColor2", sSeriesId, sCategoryId, oArg);
};
_p.setFillTypeForPoint = function (sSeriesId, sCategoryId, oArg) {
    this._setPropForPoint("setFillType", sSeriesId, sCategoryId, oArg);
};
_p.setFillAngleForPoint = function (sSeriesId, sCategoryId, oArg) {
    this._setPropForPoint("setFillAngle", sSeriesId, sCategoryId, oArg);
};
_p.setMarkerTypeForPoint = function (sSeriesId, sCategoryId, oArg) {
    this._setPropForPoint("setMarkerType", sSeriesId, sCategoryId, oArg);
};
_p.setMarkerVisibleForPoint = function (sSeriesId, sCategoryId, oArg) {
    this._setPropForPoint("setMarkerVisible", sSeriesId, sCategoryId, oArg);
};
_p.setExplodeForPoint = function (sSeriesId, sCategoryId, oArg) {
    this._setPropForPoint("setExplode", sSeriesId, sCategoryId, oArg);
};
_p.setBarSpacingForPoint = function (sSeriesId, sCategoryId, oArg) {
    this._barSpacing = oArg;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this._graph = null;
};

function BiChartMouseEvent(sType, oEvent, oSeries, oCategory) {
    if (_biInPrototype) return;
    BiMouseEvent.call(this, sType, oEvent);
    this._event = oEvent;
    this._series = oSeries;
    this._category = oCategory;
}
_p = _biExtend(BiChartMouseEvent, BiMouseEvent, "BiChartMouseEvent");
_p._bubbles = false;
_p._propagationStopped = true;
BiChartMouseEvent.addProperty("series", BiAccessType.READ);
BiChartMouseEvent.addProperty("category", BiAccessType.READ);
_p.dispose = function () {
    if (this._disposed) return;
    BiMouseEvent.prototype.dispose.call(this);
    this._series = null;
    this._category = null;
};

function BiAbstractChartBase(oGraph, oSeries) {
    if (_biInPrototype) return;
    if (!oGraph) return;
    BiComponent.call(this);
    this._graph = oGraph;
    this._series = oSeries;
    this._seriesId = this._series.getId();
};
_p = _biExtend(BiAbstractChartBase, BiComponent, "BiAbstractChartBase");
BiAbstractChartBase.addProperty("series", BiAccessType.READ);
BiAbstractChartBase.addProperty("graph", BiAccessType.READ);
_p.getComponentByCategoryId = function (sCatId) {
    return null;
};
_p.getStrokeOpacity = function () {
    return this._graph.getPresentationManager().getStrokeOpacity(this._seriesId, null);
};
_p.getStrokeColor = function () {
    return this._graph.getPresentationManager().getStrokeColor(this._seriesId, null);
};
_p.getStrokeWidth = function () {
    return this._graph.getPresentationManager().getStrokeWidth(this._seriesId, null);
};
_p.getFillOpacity = function () {
    return this._graph.getPresentationManager().getFillOpacity(this._seriesId, null);
};
_p.getFillColor = function () {
    return this._graph.getPresentationManager().getFillColor(this._seriesId, null);
};
_p.getFillColor2 = function () {
    return this._graph.getPresentationManager().getFillColor2(this._seriesId, null);
};
_p.getFillType = function () {
    return this._graph.getPresentationManager().getFillType(this._seriesId, null);
};
_p.getFillAngle = function () {
    return this._graph.getPresentationManager().getFillAngle(this._seriesId, null);
};
_p.getMarkerType = function () {
    return this._graph.getPresentationManager().getMarkerType(this._seriesId, null);
};
_p.getMarkerVisible = function () {
    return this._graph.getPresentationManager().getMarkerVisible(this._seriesId, null);
};
_p.getExplode = function () {
    return this._graph.getPresentationManager().getExplode(this._seriesId, null);
};
_p.getBarSpacing = function () {
    return this._graph.getPresentationManager().getBarSpacing(this._seriesId, null);
};
_p.getSupportsValueAxis = function () {
    return true;
};
_p.getSupportsCategoryAxis = function () {
    return true;
};
_p.getSupportsGridLines = function () {
    return true;
};
_p.getTitle = function () {
    return this._series.getTitle();
};
_p.getIconHtml = function (bHasText, bEnabled, sIconPosition, nIconTextGap, sClassName) {
    var marginSide, blockStyle = "";
    switch (sIconPosition) {
    case "right":
        marginSide = "left";
        break;
    case "top":
        marginSide = "bottom";
        blockStyle = "display:block;";
        break;
    case "bottom":
        marginSide = "top";
        blockStyle = "display:block;";
        break;
    default:
        marginSide = "right";
        break;
    }
    var iconTextGap = bHasText ? nIconTextGap : 0;
    return "<img alt=\"\" style=\"vertical-align:middle;border:0.05em solid " + this.getStrokeColor() + ";overflow:hidden;background-color:" + this.getFillColor() + ";" + "width:0.667em;height:0.667em;" + blockStyle + "margin-" + marginSide + ":" + iconTextGap + "px;\"" + (sClassName ? " class=\"" + sClassName + "\"" : "") + " src=\"" + application.getPath() + "images/blank.gif\">";
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._series = null;
    this._graph = null;
};

function BiAbstractChartSectionBase(oChart, oCategory) {
    if (_biInPrototype) return;
    if (!oChart) return;
    BiComponent.call(this);
    this._chart = oChart;
    this._series = oChart._series;
    this._seriesId = this._series.getId();
    this._category = oCategory;
    this._categoryId = oCategory.getId();
    this._graph = oChart.getGraph();
};
_p = _biExtend(BiAbstractChartSectionBase, BiComponent, "BiAbstractChartSectionBase");
BiAbstractChartSectionBase.addProperty("chart", BiAccessType.READ);
BiAbstractChartSectionBase.addProperty("series", BiAccessType.READ);
BiAbstractChartSectionBase.addProperty("category", BiAccessType.READ);
BiAbstractChartSectionBase.addProperty("graph", BiAccessType.READ);
_p._fillColor = null;
_p._markerType = null;
_p._markerVisible = null;
_p._explode = null;
_p.getStrokeOpacity = function () {
    return this._graph.getPresentationManager().getStrokeOpacity(this._seriesId, this._categoryId);
};
_p.getStrokeColor = function () {
    return this._graph.getPresentationManager().getStrokeColor(this._seriesId, this._categoryId);
};
_p.getFillOpacity = function () {
    return this._graph.getPresentationManager().getFillOpacity(this._seriesId, this._categoryId);
};
_p.getFillColor = function () {
    return this._graph.getPresentationManager().getFillColor(this._seriesId, this._categoryId);
};
_p.getFillColor2 = function () {
    return this._graph.getPresentationManager().getFillColor2(this._seriesId, this._categoryId);
};
_p.getFillType = function () {
    return this._graph.getPresentationManager().getFillType(this._seriesId, this._categoryId);
};
_p.getFillAngle = function () {
    return this._graph.getPresentationManager().getFillAngle(this._seriesId, this._categoryId);
};
_p.getMarkerType = function () {
    return this._graph.getPresentationManager().getMarkerType(this._seriesId, this._categoryId);
};
_p.getMarkerVisible = function () {
    return this._graph.getPresentationManager().getMarkerVisible(this._seriesId, this._categoryId);
};
_p.getExplode = function () {
    return this._graph.getPresentationManager().getExplode(this._seriesId, this._categoryId);
};
_p.setStrokeColor = function (s) {};
_p.setFillOpacity = function (n) {};
_p.setFillColor = function (s) {};
_p.setStrokeOpacity = function (n) {};
_p.setFillColor2 = function (s) {};
_p.setFillType = function (s) {};
_p.setFillAngle = function (s) {};
_p.setMarkerType = function (s) {};
_p.setMarkerVisible = function (s) {};
_p.setExplode = function (s) {};
_p.hasStrokeColor = function () {
    return this._strokeColor != null;
};
_p.hasStrokeOpacity = function () {
    return this._strokeOpacity != null;
};
_p.hasFillOpacity = function () {
    return this._fillOpacity != null;
};
_p.hasFillColor = function () {
    return this._fillColor != null;
};
_p.hasFillColor2 = function () {
    return this._fillColor2 != null;
};
_p.hasFillType = function () {
    return this._fillType != null;
};
_p.hasFillAngle = function () {
    return this._fillAngle != null;
};
_p.hasMarkerType = function () {
    return this._markerType != null;
};
_p.hasMarkerVisible = function () {
    return this._markerVisible != null;
};
_p.hasExplode = function () {
    return this._explode != null;
};
_p.getToolTip = function () {
    return this.getGraph().getToolTipForPoint(this._series, this._category);
};
_p.getContextMenu = function () {
    return this.getGraph().getContextMenuForPoint(this._series, this._category);
};
_p.getTitle = function () {
    return this._category.getTitle();
};
_p.getIconHtml = function (bHasText, bEnabled, sIconPosition, nIconTextGap, sClassName) {
    var marginSide, blockStyle = "";
    switch (sIconPosition) {
    case "right":
        marginSide = "left";
        break;
    case "top":
        marginSide = "bottom";
        blockStyle = "display:block;";
        break;
    case "bottom":
        marginSide = "top";
        blockStyle = "display:block;";
        break;
    default:
        marginSide = "right";
        break;
    }
    var iconTextGap = bHasText ? nIconTextGap : 0;
    return "<img alt=\"\" style=\"vertical-align:middle;border:0.05em solid " + this.getStrokeColor() + ";overflow:hidden;background-color:" + this.getFillColor() + ";" + "width:0.667em;height:0.667em;" + blockStyle + "margin-" + marginSide + ":" + iconTextGap + "px;\"" + (sClassName ? " class=\"" + sClassName + "\"" : "") + " src=\"" + application.getPath() + "images/blank.gif\">";
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._chart = null;
    this._series = null;
    this._category = null;
    this._graph = null;
    this._fillEl = null;
};

function BiChartValueAxisBase(oGraph) {
    if (_biInPrototype) return;
    if (!oGraph) return;
    BiComponent.call(this);
    this._graph = oGraph;
    this._labels = [];
};
_p = _biExtend(BiChartValueAxisBase, BiComponent, "BiChartValueAxisBase");
_p._majorTickInterval = null;
_p._minorTickInterval = null;
_p._labelInterval = null;
_p._maximum = null;
_p._minimum = null;
_p._showMajorTicks = false;
_p._showMinorTicks = false;
_p._showLabels = true;
_p._fontSize = 11;
_p._desiredVisible = true;
BiChartValueAxisBase.addProperty("showMajorTicks", BiAccessType.READ);
BiChartValueAxisBase.addProperty("showMinorTicks", BiAccessType.READ);
BiChartValueAxisBase.addProperty("showLabels", BiAccessType.READ);
BiChartValueAxisBase.addProperty("fontSize", BiAccessType.READ);
_p.setMajorTickInterval = function (n) {
    this._majorTickInterval = n;
    this._clearCache();
};
_p.setMinorTickInterval = function (n) {
    this._minorTickInterval = n;
    this._clearCache();
};
_p.setMaximum = function (n) {
    this._maximum = n;
    this._clearCache();
};
_p.setMinimum = function (n) {
    this._minimum = n;
    this._clearCache();
};
_p.setShowMajorTicks = function (b) {
    if (this._showMajorTicks != b) {
        this._showMajorTicks = b;
        this._updateMajorTicks();
    }
};
_p.setShowMinorTicks = function (b) {
    if (this._showMinorTicks != b) {
        this._showMinorTicks = b;
        this._updateMinorTicks();
    }
};
_p.setShowLabels = function (b) {
    if (this._showLabels != b) {
        this._showLabels = b;
        this._updateLabels();
    }
};
_p.getMaximumValue = function () {
    if (this._graph._getPercentageStack()) return 1;
    var i, s = this._graph.getSeries();
    if (this._graph._getStackedChart()) {
        var cats = this._graph.getCategories();
        var l = cats.length;
        var sum, id;
        var max = 0;
        for (var j = 0; j < l; j++) {
            sum = 0;
            id = cats[j].getId();
            for (i = 0; i < s.length; i++) {
                sum += Math.abs(s[i].getValueByCategoryId(id));
            }
            max = Math.max(max, sum);
        }
        return max;
    } else {
        var maxValue = -Infinity;
        for (i = 0; i < s.length; i++) maxValue = Math.max(maxValue, s[i].getMaximumValue());
        return maxValue;
    }
};
_p.getMinimumValue = function () {
    if (this._graph._getStackedChart()) return 0;
    var minValue = Infinity;
    var s = this._graph.getSeries();
    for (var i = 0; i < s.length; i++) minValue = Math.min(minValue, s[i].getMinimumValue());
    return minValue;
};
_p.getMaximum = function () {
    if (this._maximum != null) return this._maximum;
    if (this._graph._getPercentageStack()) return 1;
    return this._getDefaultProperties().max;
};
_p.getMinimum = function () {
    if (this._minimum != null) return this._minimum;
    return this._getDefaultProperties().min;
};
_p.getMajorTickInterval = function () {
    if (this._majorTickInterval != null) return this._majorTickInterval;
    return this._getDefaultProperties().major;
};
_p.getMinorTickInterval = function () {
    if (this._minorTickInterval != null) return this._minorTickInterval;
    return this._getDefaultProperties().minor;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._graph = null;
    for (var i = 0; i < this._labels.length; i++) this._labels[i] = null;
    this._labels = null;
    this._clearCache();
    this._majorTicks = null;
    this._minorTicks = null;
    this._axisLine = null;
};
_p._getDefaultProperties = function () {
    if (this._cachedDefaultProperties != null) return this._cachedDefaultProperties;
    var max = this._maximum != null ? this._maximum : this.getMaximumValue();
    var min = this._minimum != null ? this._minimum : Math.min(0, this.getMinimumValue());
    var diff = max - min;
    var zeros = Math.floor(Math.log(diff) / Math.log(10));
    var major;
    if (this._majorTickInterval != null) {
        major = this._majorTickInterval;
    } else {
        major = Math.pow(10, zeros);
        var x = diff / major;
        if (x < 2) major = major / 5;
        else if (x < 5) major = major / 2;
    }
    var minor = this._minorTickInterval != null ? this._minorTickInterval : major / 5;
    var newMax = Math.ceil((max + major / 2) / major) * major;
    var newMin;
    if (min == 0) newMin = 0;
    else newMin = Math.floor((min - major / 2) / major) * major;
    return this._cachedDefaultProperties = {
        max: newMax,
        min: newMin,
        major: major,
        minor: minor
    };
};
_p.setFontSize = function (n) {};
_p.setVisible = function (b) {};
_p.getVisible = function () {
    return this._desiredVisible;
};
_p._updateVisible = function () {
    this.setVisible(this._desiredVisible);
};
_p.fromXmlElement = function (oNode) {
    var s = oNode.getAttribute("Visible");
    if (s) this.setVisible(s != "false");
    s = oNode.getAttribute("ShowMajorTicks");
    if (s) this.setShowMajorTicks(s != "false");
    s = oNode.getAttribute("ShowMinorTicks");
    if (s) this.setShowMinorTicks(s == "true");
    s = oNode.getAttribute("ShowLabels");
    if (s) this.setShowLabels(s != "false");
    s = oNode.getAttribute("MajorTickInterval");
    if (s) this.setMajorTickInterval(Number(s));
    s = oNode.getAttribute("MinorTickInterval");
    if (s) this.setMinorTickInterval(Number(s));
    s = oNode.getAttribute("Maximum");
    if (s) this.setMaximum(Number(s));
    s = oNode.getAttribute("Minimum");
    if (s) this.setMinimum(Number(s));
};
_p.toXmlElement = function (oDoc) {
    var el = oDoc.createElement("ValueAxis");
    el.setAttribute("Visible", String(this._desiredVisible));
    if (this._showMajorTicks != null) el.setAttribute("ShowMajorTicks", String(this._showMajorTicks));
    if (this._showMinorTicks != null) el.setAttribute("ShowMinorTicks", String(this._showMinorTicks));
    if (this._showLabels != null) el.setAttribute("ShowLabels", String(this._showLabels));
    if (this._majorTickInterval != null) el.setAttribute("MajorTickInterval", String(this._majorTickInterval));
    if (this._minorTickInterval != null) el.setAttribute("MinorTickInterval", String(this._minorTickInterval));
    if (this._maximum != null) el.setAttribute("Maximum", String(this._majorTickInterval));
    if (this._minimum != null) el.setAttribute("Minimum", String(this._minorTickInterval));
    return el;
};
_p._clearCache = function () {
    this._cachedDefaultProperties = null;
};

function BiChartCategoryAxisBase(oGraph) {
    if (_biInPrototype) return;
    if (!oGraph) return;
    BiComponent.call(this);
    this._graph = oGraph;
    this._labels = [];
};
_p = _biExtend(BiChartCategoryAxisBase, BiComponent, "BiChartCategoryAxisBase");
_p._axisBetweenCategories = true;
_p._desiredVisible = true;
_p._majorTickInterval = null;
_p._minorTickInterval = null;
_p._showMajorTicks = true;
_p._showMinorTicks = true;
_p._showLabels = true;
_p._fontSize = 11;
BiChartCategoryAxisBase.addProperty("majorTickInterval", BiAccessType.WRITE);
BiChartCategoryAxisBase.addProperty("minorTickInterval", BiAccessType.WRITE);
BiChartCategoryAxisBase.addProperty("showMajorTicks", BiAccessType.READ_WRITE);
BiChartCategoryAxisBase.addProperty("showMinorTicks", BiAccessType.READ_WRITE);
BiChartCategoryAxisBase.addProperty("showLabels", BiAccessType.READ_WRITE);
BiChartCategoryAxisBase.addProperty("axisBetweenCategories", BiAccessType.READ_WRITE);
BiChartCategoryAxisBase.addProperty("fontSize", BiAccessType.READ);
_p.setFontSize = function (n) {};
_p.getMaximum = function () {
    var l = this._graph.getCategories().length;
    if (this._axisBetweenCategories) return l;
    return l - 1;
};
_p.getMinimum = function () {
    return 0;
};
_p.getMajorTickInterval = function () {
    if (this._majorTickInterval != null) return this._majorTickInterval;
    return 1;
};
_p.getMinorTickInterval = function () {
    if (this._minorTickInterval != null) return this._minorTickInterval;
    return this.getMajorTickInterval() / 2;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._graph = null;
    for (var i = 0; i < this._labels.length; i++) this._labels[i] = null;
    this._labels = null;
    this._majorTicks = null;
    this._minorTicks = null;
    this._axisLine = null;
};
_p.setVisible = function (b) {};
_p.getVisible = function () {
    return this._desiredVisible;
};
_p._updateVisible = function () {
    this.setVisible(this._desiredVisible);
};
_p.fromXmlElement = function (oNode) {
    var s = oNode.getAttribute("Visible");
    if (s) this.setVisible(s != "false");
    s = oNode.getAttribute("ShowMajorTicks");
    if (s) this.setShowMajorTicks(s != "false");
    s = oNode.getAttribute("ShowMinorTicks");
    if (s) this.setShowMinorTicks(s == "true");
    s = oNode.getAttribute("ShowLabels");
    if (s) this.setShowLabels(s != "false");
    s = oNode.getAttribute("MajorTickInterval");
    if (s) this.setMajorTickInterval(Number(s));
    s = oNode.getAttribute("MinorTickInterval");
    if (s) this.setMinorTickInterval(Number(s));
    s = oNode.getAttribute("AxisBetweenCategories");
    if (s) this.setAxisBetweenCategories(s != "false");
};
_p.toXmlElement = function (oDoc) {
    var el = oDoc.createElement("CategoryAxis");
    el.setAttribute("Visible", String(this._desiredVisible));
    if (this._showMajorTicks != null) el.setAttribute("ShowMajorTicks", String(this._showMajorTicks));
    if (this._showMinorTicks != null) el.setAttribute("ShowMinorTicks", String(this._showMinorTicks));
    if (this._majorTickInterval != null) el.setAttribute("MajorTickInterval", String(this._majorTickInterval));
    if (this._minorTickInterval != null) el.setAttribute("MinorTickInterval", String(this._minorTickInterval));
    return el;
};

function BiChartAreaBase(oGraph) {
    if (_biInPrototype) return;
    if (!oGraph) return;
    BiComponent.call(this);
    this._graph = oGraph;
};
_p = _biExtend(BiChartAreaBase, BiComponent, "BiChartAreaBase");
_p._fillColor = null;
_p._strokeColor = null;
_p._updateCoordSize = function (sCoordSize, sCoordOrigin) {};
_p.setFillColor = function (s) {};
_p.getFillColor = function () {
    return this._fillColor;
};
_p.hasFillColor = function () {
    return this._fillColor != null;
};
_p.getFillColor2 = function () {
    return this._fillColor2;
};
_p.setFillColor2 = function (s) {
    this._fillColor2 = s;
};
_p.hasFillColor2 = function () {
    return this._fillColor2 != null;
};
_p.getFillOpacity = function () {
    return this._fillOpacity;
};
_p.setFillOpacity = function (n) {
    this._fillOpacity = n;
};
_p.hasFillOpacity = function () {
    return this._fillOpacity != null;
};
_p.getFillType = function () {
    return this._fillType;
};
_p.setFillType = function (s) {
    this._fillType = s;
};
_p.hasFillType = function () {
    return this._fillType != null;
};
_p.getFillAngle = function () {
    return this._fillAngle;
};
_p.setFillAngle = function (n) {
    this._fillAngle = n;
};
_p.hasFillAngle = function () {
    return this._fillAngle != null;
};
_p.setStrokeColor = function (s) {};
_p.getStrokeColor = function () {
    return this._strokeColor;
};
_p.hasStrokeColor = function () {
    return this._strokeColor != null;
};
_p.getStrokeOpacity = function () {
    return this._strokeOpacity;
};
_p.setStrokeOpacity = function (n) {
    this._strokeOpacity = n;
};
_p.hasStrokeOpacity = function () {
    return this._strokeOpacity != null;
};
_p.fromXmlElement = function (oNode) {
    var n = oNode.selectSingleNode("Stroke/@Opacity");
    if (n) this.setStrokeOpacity(Number(n.text ? n.text : n.nodeValue));
    n = oNode.selectSingleNode("Stroke/@Color");
    if (n) this.setStrokeColor(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Opacity");
    if (n) this.setFillOpacity(Number(n.text ? n.text : n.nodeValue));
    n = oNode.selectSingleNode("Fill/@Color");
    if (n) this.setFillColor(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Color2");
    if (n) this.setFillColor2(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Type");
    if (n) this.setFillType(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Angle");
    if (n) this.setFillAngle(n.text ? n.text : n.nodeValue);
};
_p.toXmlElement = function (oDoc) {
    if (!this.hasFillColor() && !this.hasStrokeColor() && !this.hasFillColor2() && !this.hasFillType() && !this.hasFillAngle()) return oDoc.createDocumentFragment();
    var ca = oDoc.createElement("ChartArea");
    var el;
    if (this.hasStrokeColor() || this.hasStrokeOpacity()) {
        el = oDoc.createElement("Stroke");
        if (this.hasStrokeOpacity()) el.setAttribute("Opacity", String(this.getStrokeOpacity()));
        if (this.hasStrokeColor()) el.setAttribute("Color", this.getStrokeColor());
        ca.appendChild(el);
    }
    if (this.hasFillColor() || this.hasFillColor2() || this.hasFillType() || this.hasFillAngle() || this.hasFillOpacity()) {
        el = oDoc.createElement("Fill");
        if (this.hasFillOpacity()) el.setAttribute("Opacity", String(this.getFillOpacity()));
        if (this.hasFillColor()) el.setAttribute("Color", this.getFillColor());
        if (this.hasFillColor2()) el.setAttribute("Color2", this.getFillColor2());
        if (this.hasFillType()) el.setAttribute("Type", this.getFillType());
        if (this.hasFillAngle()) el.setAttribute("Angle", this.getFillAngle());
        ca.appendChild(el);
    }
    return ca;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._graph = null;
    this._outlineRect = null;
    this._backgroundRect = null;
    this._fillEl = null;
};

function BiChartGridLinesBase(oGraph) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._graph = oGraph;
};
_p = _biExtend(BiChartGridLinesBase, BiComponent, "BiChartGridLinesBase");
BiChartGridLinesBase.addProperty("graph", BiAccessType.READ);
_p._desiredVisible = true;
_p._showMinorCategory = null;
_p._showMinorValue = null;
_p._showMajorCategory = null;
_p._showMajorValue = null;
_p._minorCategoryStrokeColor = null;
_p._majorCategoryStrokeColor = null;
_p._minorValueStrokeColor = null;
_p._majorValueStrokeColor = null;
_p.setShowMinorValue = function (b) {
    if (this._showMinorValue != b) {
        this._showMinorValue = b;
        this._updateMinorValue();
    }
};
_p.getShowMinorValue = function () {
    return this._showMinorValue != null ? this._showMinorValue : false;
};
_p.setShowMajorValue = function (b) {
    if (this._showMajorValue != b) {
        this._showMajorValue = b;
        this._updateMajorValue();
    }
};
_p.getShowMajorValue = function () {
    return this._showMajorValue != null ? this._showMajorValue : true;
};
_p.setShowMinorCategory = function (b) {
    if (this._showMinorCategory != b) {
        this._showMinorCategory = b;
        this._updateMinorCategory();
    }
};
_p.getShowMinorCategory = function () {
    return this._showMinorCategory != null ? this._showMinorCategory : false;
};
_p.setShowMajorCategory = function (b) {
    if (this._showMajorCategory != b) {
        this._showMajorCategory = b;
        this._updateMajorCategory();
    }
};
_p.getShowMajorCategory = function () {
    return this._showMajorCategory != null ? this._showMajorCategory : true;
};
_p.hasShowMinorValue = function () {
    return this._showMinorValue != null;
};
_p.hasShowMajorValue = function () {
    return this._showMajorValue != null;
};
_p.hasShowMinorCategory = function () {
    return this._showMinorCategory != null;
};
_p.hasShowMajorCategory = function () {
    return this._showMajorCategory != null;
};
_p.getMinorCategoryStrokeColor = function () {
    return this._minorCategoryStrokeColor || "#ddd";
};
_p.setMinorCategoryStrokeColor = function (s) {};
_p.getMajorCategoryStrokeColor = function () {
    return this._majorCategoryStrokeColor || "#333";
};
_p.setMajorCategoryStrokeColor = function (s) {};
_p.getMinorValueStrokeColor = function () {
    return this._minorValueStrokeColor || "#ddd";
};
_p.setMinorValueStrokeColor = function (s) {};
_p.getMajorValueStrokeColor = function () {
    return this._majorValueStrokeColor || "#333";
};
_p.setMajorValueStrokeColor = function (s) {};
_p.hasMinorCategoryStrokeColor = function () {
    return this._minorCategoryStrokeColor != null;
};
_p.hasMajorCategoryStrokeColor = function () {
    return this._majorCategoryStrokeColor != null;
};
_p.hasMinorValueStrokeColor = function () {
    return this._minorValueStrokeColor != null;
};
_p.hasMajorValueStrokeColor = function () {
    return this._majorValueStrokeColor != null;
};
_p.fromXmlElement = function (oElement) {
    var n = oElement.selectSingleNode("MajorValue/@Visible");
    if (n) this.setShowMajorValue((n.text ? n.text : n.nodeValue) == "true");
    n = oElement.selectSingleNode("MinorValue/@Visible");
    if (n) this.setShowMinorValue((n.text ? n.text : n.nodeValue) == "true");
    n = oElement.selectSingleNode("MajorCategory/@Visible");
    if (n) this.setShowMajorCategory((n.text ? n.text : n.nodeValue) == "true");
    n = oElement.selectSingleNode("MinorCategory/@Visible");
    if (n) this.setShowMinorCategory((n.text ? n.text : n.nodeValue) == "true");
    n = oElement.selectSingleNode("MinorCategory/Stroke/@Color");
    if (n) this.setMinorCategoryStrokeColor(n.text ? n.text : n.nodeValue);
    n = oElement.selectSingleNode("MajorCategory/Stroke/@Color");
    if (n) this.setMajorCategoryStrokeColor(n.text ? n.text : n.nodeValue);
    n = oElement.selectSingleNode("MinorValue/Stroke/@Color");
    if (n) this.setMinorValueStrokeColor(n.text ? n.text : n.nodeValue);
    n = oElement.selectSingleNode("MajorValue/Stroke/@Color");
    if (n) this.setMajorValueStrokeColor(n.text ? n.text : n.nodeValue);
};
_p.toXmlElement = function (oDoc) {
    var gd = oDoc.createElement("GridLines");
    var el, n;
    if (this.hasShowMajorValue() || this.hasMajorValueStrokeColor()) {
        n = oDoc.createElement("MajorValue");
        if (this.hasShowMajorValue()) n.setAttribute("Visible", String(this.getShowMajorValue()));
        if (this.hasMajorValueStrokeColor()) {
            el = oDoc.createElement("Stroke");
            el.setAttribute("Color", this.getMajorValueStrokeColor());
            n.appendChild(el);
        }
        gd.appendChild(n);
    }
    if (this.hasShowMinorValue() || this.hasMinorValueStrokeColor()) {
        n = oDoc.createElement("MinorValue");
        if (this.hasShowMinorValue()) n.setAttribute("Visible", String(this.getShowMinorValue()));
        if (this.hasMinorValueStrokeColor()) {
            el = oDoc.createElement("Stroke");
            el.setAttribute("Color", this.getMinorValueStrokeColor());
            n.appendChild(el);
        }
        gd.appendChild(n);
    }
    if (this.hasShowMajorCategory() || this.hasMajorCategoryStrokeColor()) {
        n = oDoc.createElement("MajorCategory");
        if (this.hasShowMajorCategory()) n.setAttribute("Visible", String(this.getShowMajorCategory()));
        if (this.hasMajorCategoryStrokeColor()) {
            el = oDoc.createElement("Stroke");
            el.setAttribute("Color", this.getMajorCategoryStrokeColor());
            n.appendChild(el);
        }
        gd.appendChild(n);
    }
    if (this.hasShowMinorCategory() || this.hasMinorCategoryStrokeColor()) {
        n = oDoc.createElement("MinorCategory");
        if (this.hasShowMinorCategory()) n.setAttribute("Visible", String(this.getShowMinorCategory()));
        if (this.hasMinorCategoryStrokeColor()) {
            el = oDoc.createElement("Stroke");
            el.setAttribute("Color", this.getMinorCategoryStrokeColor());
            n.appendChild(el);
        }
        gd.appendChild(n);
    }
    return gd;
};

function BiChartComponent() {
    if (_biInPrototype) return;
    BiSvgComponent.call(this);
    if (this._tagName == "svg") this.setHtmlProperty("preserveAspectRatio", "none");
}
_p = _biExtend(BiChartComponent, BiSvgComponent, "BiChartComponent");
BiChartComponent.addProperty("insideWidth", BiAccessType.READ);
BiChartComponent.addProperty("insideHeight", BiAccessType.READ);
BiChartComponent.addProperty("minY", BiAccessType.READ);
BiChartComponent.addProperty("minX", BiAccessType.READ);
_p._setHtmlProperties = function () {
    var el = this._element;
    var hp = this._htmlProperties;
    for (var p in hp) {
        el.setAttribute(p, hp[p]);
    }
};
_p.setChartViewBox = function (minX, minY, w, h, xf, yf) {
    minX = minX - w * 0.01;
    w += w * 0.01;
    h += h * 0.02;
    minY -= h * 0.01;
    var xFactor = (xf ? xf : 0.0);
    var yFactor = (yf ? yf : 0.0);
    var ysp = h * yFactor;
    var xsp = w * xFactor;
    this._insideWidth = (w + xsp);
    this._insideHeight = (h + ysp);
    this._minY = (minY - ysp / 2);
    this._minX = minX;
    BiSvgComponent.prototype.setViewBox.call(this, minX, this._minY, this._insideWidth, this._insideHeight);
    this._calcConstant = h + 2 * minY - 1;
};
_p.setViewBox2 = function (orig, siz) {
    var p = orig.split(",");
    var p1 = siz.split(",");
    this.setViewBox(Number(p[0]), Number(p[1]), Number(p1[0]), Number(p1[1]));
};
_p.calculateFlippedY = function (n) {
    return this._calcConstant - n;
};
BiChartComponent.newChartComponent = function (name) {
    var c = new BiChartComponent;
    c._tagName = name || "svg";
    return c;
};

function BiSvgGraphBase() {
    if (_biInPrototype) return;
    BiChartComponent.call(this);
    this._series = [];
    this._charts = {};
    this._categories = [];
    this._seriesMap = {};
    this._categoriesMap = {};
    this._points = {};
    this._presentationManager = new BiChartPresentationManager(this);
    this._chartPresentations = {};
    this.setSize(300, 200);
    this.setForeColor("black");
    this.addEventListener("click", this._onMouseEvent);
    this.addEventListener("mousedown", this._onMouseEvent);
    this.addEventListener("mouseup", this._onMouseEvent);
    this.addEventListener("mouseover", this._onMouseEvent);
    this.addEventListener("mouseout", this._onMouseEvent);
    this.addEventListener("mousemove", this._onMouseEvent);
    this.addEventListener("dblclick", this._onMouseEvent);
    this.addEventListener("contextmenu", this._onMouseEvent);
    this.addEventListener("mousewheel", this._onMouseEvent);
};
_p = _biExtend(BiSvgGraphBase, BiChartComponent, "BiSvgGraphBase");
_p._chartType = "column";
_p._xAxis = null;
_p._yAxis = null;
_p._gridLines = null;
_p._chartArea = null;
_p._chartAreaLeft = 100;
_p._chartAreaTop = 100;
_p._chartAreaWidth = 800;
_p._chartAreaHeight = 800;
_p._autoScale = false;
_p._scaleFactor = null;
_p._catScaleFactor = null;
BiSvgGraphBase.addProperty("presentationManager", BiAccessType.READ);
BiSvgGraphBase.addProperty("chartArea", BiAccessType.READ);
BiSvgGraphBase.addProperty("valueAxis", BiAccessType.READ);
BiSvgGraphBase.addProperty("categoryAxis", BiAccessType.READ);
BiSvgGraphBase.addProperty("gridLines", BiAccessType.READ);
BiSvgGraphBase.addProperty("legend", BiAccessType.READ);
BiSvgGraphBase.addProperty("autoScale", BiAccessType.READ);
_p.getGrid = function () {
    return this._gridComponent;
};
_p.setAutoScale = function (b) {};
_p._scaleFont = function () {
    if (this._autoScale) {
        this.setFontSize(Math.min(this.getClientWidth(), this.getClientHeight()) / 25);
    }
};
_p.setFontSize = function (n) {
    this._valueAxis.setFontSize(n);
    this._categoryAxis.setFontSize(n);
    this._legend.setFontSize(n);
};
_p.getFontSize = function () {
    var s1 = this._valueAxis.getFontSize();
    var s2 = this._categoryAxis.getFontSize();
    var s3 = this._legend.getFontSize();
    if (s1 == s2 && s2 == s3) return s1;
    return null;
};
_p.addSeries = function (oSeries) {
    var id = oSeries.getId();
    this._series.push(oSeries);
    this._seriesMap[id] = oSeries;
    oSeries._index = this._series.length - 1;
    this._chartPresentations[id] = new BiChartPresentation(this, oSeries);
};
_p.removeSeries = function (oSeries) {
    this._series.remove(oSeries);
    delete this._seriesMap[oSeries.getId()];
    var chart = this.getChartForSeries(oSeries);
    this._removeChart(chart);
    oSeries._index = null;
    for (var i = 0; i < this._series.length; i++) this._series[i]._index = i;
};
_p.clearSeries = function () {
    for (var i = 0; i < this._series.length; i++) this._series[i]._index = null;
    this._series = [];
    this._seriesMap = {};
};
_p.getSeriesById = function (sId) {
    return this._seriesMap[sId];
};
BiSvgGraphBase.addProperty("series", BiAccessType.READ);
_p.setSeries = function (aSeries) {
    this.clearSeries();
    for (var i = 0; i < aSeries.length; i++) this.addSeries(aSeries[i]);
};
_p.addCategory = function (oCategory) {
    this._categories.push(oCategory);
    this._categoriesMap[oCategory.getId()] = oCategory;
    oCategory._index = this._categories.length - 1;
};
_p.removeCategory = function (oCategory) {
    this._categories.remove(oCategory);
    delete this._categoriesMap[oCategory.getId()];
    for (var i = 0; i < this._categories.length; i++) this._categories[i]._index = i;
};
_p.clearCategories = function () {
    for (var i = 0; i < this._categories.length; i++) this._categories[i]._index = null;
    this._categories = [];
    this._categoriesMap = {};
};
_p.getCategoryById = function (sId) {
    return this._categoriesMap[sId];
};
BiSvgGraphBase.addProperty("categories", BiAccessType.READ);
_p.setCategories = function (aCategories) {
    this.clearCategories();
    for (var i = 0; i < aCategories.length; i++) this.addCategory(aCategories[i]);
};
_p.addPoint = function (oPoint) {
    var sId = oPoint.getSeriesId();
    var cId = oPoint.getCategoryId();
    if (this._points[sId] == null) this._points[sId] = {};
    this._points[sId][cId] = oPoint;
};
_p.removePoint = function (oPoint) {
    var sId = oPoint.getSeriesId();
    var cId = oPoint.getCategoryId();
    if (this._points[sId] == null) return;
    delete this._points[sId][cId];
};
_p.clearPoints = function () {
    this._points = {};
};
_p.getPointByIds = function (sSeriesId, sCategoryId) {
    if (this._points[sSeriesId]) return this._points[sSeriesId][sCategoryId];
    return null;
};
_p.getPoints = function () {
    var res = [];
    for (var sId in this._points) {
        for (var cId in this._points[sId]) res.push(this._points[sId][cId]);
    }
    return res;
};
_p.setPoints = function (aPoints) {
    this.clearPoints();
    for (var i = 0; i < aPoints.length; i++) this.addPoint(aPoints[i]);
};
_p.getComponentByIds = function (sSeriesId, sCategoryId) {
    var c = this._charts[sSeriesId];
    if (c) return c.getComponentByCategoryId(sCategoryId);
    return null;
};
_p.getChartPresentation = _p.getChartPresentationBySeriesId = function (sSeriesId) {
    return this._chartPresentations[sSeriesId];
};
BiSvgGraphBase.addProperty("chartType", BiAccessType.READ);
_p.setChartType = function (sType) {
    if (this._chartType != sType) {
        this._chartType = sType;
        if (sType == "grid" && this._legend) this._legend.setZIndex(-1);
        else if (this._legend) this._legend.setZIndex(1000);
        this._currentColorIndex = 0;
        this._syncChartForSeries();
    }
};
_p.getCharts = function () {
    var res = [];
    for (var sId in this._charts) res.push(this._charts[sId]);
    return res;
};
_p.getChartForSeries = function (oSeries) {
    var id = oSeries.getId();
    return this._charts[id];
};
_p._syncChartForSeries = function () {
    var sType = this.getChartType();
    this._removeAllCharts();
    if (sType != "grid") {
        if (this._gridComponent) {
            this._parent.remove(this._gridComponent);
            this._gridComponent.dispose();
            this._gridComponent = null;
        }
        var l = sType == "pie" ? (this._series.length > 0 ? 1 : 0) : this._series.length;
        for (var i = 0; i < l; i++) this._createChartFromSeries(this._series[i]);
    } else {
        if (!this._gridComponent) {
            this._gridComponent = new BiGridChart(this);
            this._gridComponent.setLocation(10, 10);
            this._gridComponent.setRight(10);
            this._gridComponent.setBottom(10);
            this._gridComponent.setBorder(new BiBorder(0));
            this._parent.add(this._gridComponent);
        }
    }
};
_p._removeChart = function (oChart) {
    var id = oChart.getSeries().getId();
    this._chartArea.remove(oChart);
    delete this._charts[id];
    oChart.dispose();
};
_p._removeAllCharts = function () {
    for (var id in this._charts) {
        this._chartArea.remove(this._charts[id]);
        this._charts[id].dispose();
        delete this._charts[id];
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiChartComponent.prototype.dispose.call(this);
    var i, j;
    for (i = this._series.length - 1; i >= 0; i--) this._series[i].dispose();
    for (i = this._categories.length - 1; i >= 0; i--) this._categories[i].dispose();
    for (i in this._seriesMap) this._seriesMap[i].dispose();
    for (i in this._categoriesMap) this._categoriesMap[i].dispose();
    for (i in this._points) {
        for (j in this._points[i]) this._points[i][j].dispose();
    }
    for (i in this._charts) this._charts[i].dispose();
    for (i in this._chartPresentations) this._chartPresentations[i].dispose();
    this._presentationManager.dispose();
    this._points = null;
    this._chartPresentations = null;
    this._charts = null;
    this._series = null;
    this._seriesMap = null;
    this._categories = null;
    this._categoriesMap = null;
    this._gridComponent = null;
    this._chartArea = null;
    this._valueAxis = null;
    this._categoryAxis = null;
    this._legend = null;
    this._contentArea = null;
    this._gridLines = null;
};
_p._getCategoryOnXAxis = function () {
    switch (this._chartType) {
    case "bar":
    case "stackedbar":
    case "percentagestackedbar":
        return false;
    default:
        return true;
    }
};
_p._getStackedChart = function () {
    switch (this._chartType) {
    case "stackedcolumn":
    case "stackedbar":
    case "percentagestackedcolumn":
    case "percentagestackedbar":
        return true;
    default:
        return false;
    }
};
_p._getPercentageStack = function () {
    switch (this._chartType) {
    case "percentagestackedcolumn":
    case "percentagestackedbar":
        return true;
    default:
        return false;
    }
};
_p._getSupportsValueAxis = function () {
    var cs = this.getCharts();
    if (cs.length == 0) return false;
    return cs[0].getSupportsValueAxis();
};
_p._getSupportsCategoryAxis = function () {
    var cs = this.getCharts();
    if (cs.length == 0) return false;
    return cs[0].getSupportsCategoryAxis();
};
_p._getSupportsGridLines = function () {
    var cs = this.getCharts();
    if (cs.length == 0) return false;
    return cs[0].getSupportsGridLines();
};
_p._updateCharts = function () {
    for (var id in this._charts) this._charts[id]._updateChart();
};
_p.update = function () {};
_p.updatePoint = function (sSeriesId, sCategoryId) {
    var c;
    if (this.getChartType() == "grid") {
        if (!this._gridComponent) return;
        c = this._gridComponent.getCellByIds(sSeriesId, sCategoryId);
        if (c) c.update();
        else {
            var r = this._gridComponent.getRowById(sSeriesId);
            if (r) r.update();
        }
    } else {
        c = this.getChartForSeries(this.getSeriesById(sSeriesId));
        if (!c) return;
        if (sCategoryId != null) c._updateValueByCategoryId(sCategoryId);
        else c._updateValues();
    }
};
_p.fromXmlDocument = function (oDoc) {
    this._removeAllCharts();
    this.clearCategories();
    this.clearSeries();
    var docEl = oDoc.documentElement;
    var title = docEl.selectSingleNode("Title");
    title = title ? title.text : null;
    var dataEl = docEl.selectSingleNode("Data");
    var categories = dataEl.selectNodes("Categories/Category");
    var i, l = categories.length;
    for (i = 0; i < l; i++) this.addCategory(BiChartCategory.fromXmlElement(this, categories[i]));
    var series = dataEl.selectNodes("SeriesGroup/Series");
    l = series.length;
    for (i = 0; i < l; i++) this.addSeries(BiChartSeries.fromXmlElement(this, series[i]));
    var presentation = docEl.selectSingleNode("Presentation");
    this.setChartType(presentation.getAttribute("Type") || "line");
    var chartArea = presentation.selectSingleNode("ChartArea");
    if (chartArea) this._chartArea.fromXmlElement(chartArea);
    var points = presentation.selectNodes("Points/Point");
    l = points.length;
    for (i = 0; i < l; i++) {
        this.addPoint(BiChartPoint.fromXmlElement(this, points[i]));
    }
    var charts = presentation.selectNodes("Charts/Chart");
    l = charts.length;
    var cp;
    for (i = 0; i < l; i++) {
        cp = BiChartPresentation.fromXmlElement(this, charts[i]);
        if (cp) this._chartPresentations[cp.getSeries().getId()] = cp;
    }
    var legend = presentation.selectSingleNode("Legend");
    if (legend) this._legend.fromXmlElement(legend);
    var valueAxis = presentation.selectSingleNode("Axes/ValueAxis");
    if (valueAxis) this._valueAxis.fromXmlElement(valueAxis);
    var categoryAxis = presentation.selectSingleNode("Axes/CategoryAxis");
    if (categoryAxis) this._categoryAxis.fromXmlElement(categoryAxis);
    var gridLines = presentation.selectSingleNode("GridLines");
    if (gridLines) {
        this._gridLines.fromXmlElement(gridLines);
    }
};
_p.toXmlDocument = function () {
    var doc = new BiXmlDocument();
    doc.loadXML("<Graph><Data><Categories/><SeriesGroup/></Data><Presentation/></Graph>");
    var docEl = doc.documentElement;
    var i, categoriesEl = docEl.firstChild.firstChild;
    for (i = 0; i < this._categories.length; i++) categoriesEl.appendChild(this._categories[i].toXmlElement(doc));
    var seriesGroupEl = docEl.firstChild.lastChild;
    for (i = 0; i < this._series.length; i++) seriesGroupEl.appendChild(this._series[i].toXmlElement(doc));
    var presentationEl = docEl.lastChild;
    presentationEl.setAttribute("Type", this.getChartType());
    presentationEl.appendChild(this._legend.toXmlElement(doc));
    var axesEl = doc.createElement("Axes");
    presentationEl.appendChild(axesEl);
    axesEl.appendChild(this._valueAxis.toXmlElement(doc));
    axesEl.appendChild(this._categoryAxis.toXmlElement(doc));
    presentationEl.appendChild(this._gridLines.toXmlElement(doc));
    presentationEl.appendChild(this._chartArea.toXmlElement(doc));
    var points = this.getPoints();
    var pointsEl = doc.createElement("Points");
    for (i = 0; i < points.length; i++) pointsEl.appendChild(points[i].toXmlElement(doc));
    presentationEl.appendChild(pointsEl);
    var chartsEl = doc.createElement("Charts");
    for (var id in this._chartPresentations) chartsEl.appendChild(this._chartPresentations[id].toXmlElement(doc));
    presentationEl.appendChild(chartsEl);
    return doc;
};
_p._onMouseEvent = function (e) {
    var c = e.getTarget();
    while (c != null && c != this && (typeof c.getSeries != "function" || typeof c.getCategory != "function")) c = c.getParent();
    if (c == this || c == null) return;
    var sType = "point" + e.getType();
    var ce = new BiChartMouseEvent(sType, e._event, c.getSeries(), c.getCategory());
    this.dispatchEvent(ce);
    ce.dispose();
};
_p.getContextMenuForPoint = function (oSeries, oCategory) {
    return null;
};
_p.getToolTipForPoint = function (oSeries, oCategory) {
    var tt = BiToolTip.getTextToolTip("Series \"" + oSeries.getTitle() + "\" Category \"" + oCategory.getTitle() + "\"\nValue: " + oSeries.getValueByCategoryId(oCategory.getId()));
    tt.setHideInterval(600 * 1000);
    return tt;
};

function BiSvgAbstractChartBase(oGraph, oSeries) {
    if (_biInPrototype) return;
    if (!oGraph) return;
    BiChartComponent.call(this);
    this._graph = oGraph;
    this._series = oSeries;
    this._seriesId = this._series.getId();
};
_p = _biExtend(BiSvgAbstractChartBase, BiChartComponent, "BiSvgAbstractChartBase");
BiSvgAbstractChartBase.addProperty("series", BiAccessType.READ);
BiSvgAbstractChartBase.addProperty("graph", BiAccessType.READ);
_p.getComponentByCategoryId = function (sCatId) {
    return null;
};
_p.getStrokeOpacity = function () {
    return this._graph.getPresentationManager().getStrokeOpacity(this._seriesId, null);
};
_p.getStrokeColor = function () {
    return this._graph.getPresentationManager().getStrokeColor(this._seriesId, null);
};
_p.getStrokeWidth = function () {
    return this._graph.getPresentationManager().getStrokeWidth(this._seriesId, null);
};
_p.getFillOpacity = function () {
    return this._graph.getPresentationManager().getFillOpacity(this._seriesId, null);
};
_p.getFillColor = function () {
    return this._graph.getPresentationManager().getFillColor(this._seriesId, null);
};
_p.getFillColor2 = function () {
    return this._graph.getPresentationManager().getFillColor2(this._seriesId, null);
};
_p.getFillType = function () {
    return this._graph.getPresentationManager().getFillType(this._seriesId, null);
};
_p.getFillAngle = function () {
    return this._graph.getPresentationManager().getFillAngle(this._seriesId, null);
};
_p.getMarkerType = function () {
    return this._graph.getPresentationManager().getMarkerType(this._seriesId, null);
};
_p.getMarkerVisible = function () {
    return this._graph.getPresentationManager().getMarkerVisible(this._seriesId, null);
};
_p.getExplode = function () {
    return this._graph.getPresentationManager().getExplode(this._seriesId, null);
};
_p.getBarSpacing = function () {
    return this._graph.getPresentationManager().getBarSpacing(this._seriesId, null);
};
_p.getSupportsValueAxis = function () {
    return true;
};
_p.getSupportsCategoryAxis = function () {
    return true;
};
_p.getSupportsGridLines = function () {
    return true;
};
_p.getTitle = function () {
    return this._series.getTitle();
};
_p.getIconHtml = function (bHasText, bEnabled, sIconPosition, nIconTextGap, sClassName) {
    var marginSide, blockStyle = "";
    switch (sIconPosition) {
    case "right":
        marginSide = "left";
        break;
    case "top":
        marginSide = "bottom";
        blockStyle = "display:block;";
        break;
    case "bottom":
        marginSide = "top";
        blockStyle = "display:block;";
        break;
    default:
        marginSide = "right";
        break;
    }
    var iconTextGap = bHasText ? nIconTextGap : 0;
    return "<img alt=\"\" style=\"vertical-align:middle;border:0.05em solid " + this.getStrokeColor() + ";overflow:hidden;background-color:" + this.getFillColor() + ";" + "width:0.667em;height:0.667em;" + blockStyle + "margin-" + marginSide + ":" + iconTextGap + "px;\"" + (sClassName ? " class=\"" + sClassName + "\"" : "") + " src=\"" + application.getPath() + "images/blank.gif\">";
};
_p.dispose = function () {
    if (this._disposed) return;
    BiChartComponent.prototype.dispose.call(this);
    this._series = null;
    this._graph = null;
};

function BiSvgAbstractChartSectionBase(oChart, oCategory) {
    if (_biInPrototype) return;
    if (!oChart) return;
    BiChartComponent.call(this);
    this._chart = oChart;
    this._series = oChart._series;
    this._seriesId = this._series.getId();
    this._category = oCategory;
    this._categoryId = oCategory.getId();
    this._graph = oChart.getGraph();
};
_p = _biExtend(BiSvgAbstractChartSectionBase, BiChartComponent, "BiSvgAbstractChartSectionBase");
BiSvgAbstractChartSectionBase.addProperty("chart", BiAccessType.READ);
BiSvgAbstractChartSectionBase.addProperty("series", BiAccessType.READ);
BiSvgAbstractChartSectionBase.addProperty("category", BiAccessType.READ);
BiSvgAbstractChartSectionBase.addProperty("graph", BiAccessType.READ);
_p._fillColor = null;
_p._markerType = null;
_p._markerVisible = null;
_p._explode = null;
_p.getStrokeOpacity = function () {
    return this._graph.getPresentationManager().getStrokeOpacity(this._seriesId, this._categoryId);
};
_p.getStrokeColor = function () {
    return this._graph.getPresentationManager().getStrokeColor(this._seriesId, this._categoryId);
};
_p.getFillOpacity = function () {
    return this._graph.getPresentationManager().getFillOpacity(this._seriesId, this._categoryId);
};
_p.getFillColor = function () {
    return this._graph.getPresentationManager().getFillColor(this._seriesId, this._categoryId);
};
_p.getFillColor2 = function () {
    return this._graph.getPresentationManager().getFillColor2(this._seriesId, this._categoryId);
};
_p.getFillType = function () {
    return this._graph.getPresentationManager().getFillType(this._seriesId, this._categoryId);
};
_p.getFillAngle = function () {
    return this._graph.getPresentationManager().getFillAngle(this._seriesId, this._categoryId);
};
_p.getMarkerType = function () {
    return this._graph.getPresentationManager().getMarkerType(this._seriesId, this._categoryId);
};
_p.getMarkerVisible = function () {
    return this._graph.getPresentationManager().getMarkerVisible(this._seriesId, this._categoryId);
};
_p.getExplode = function () {
    return this._graph.getPresentationManager().getExplode(this._seriesId, this._categoryId);
};
_p.setStrokeColor = function (s) {};
_p.setFillOpacity = function (n) {};
_p.setFillColor = function (s) {};
_p.setStrokeOpacity = function (n) {};
_p.setFillColor2 = function (s) {};
_p.setFillType = function (s) {};
_p.setFillAngle = function (s) {};
_p.setMarkerType = function (s) {};
_p.setMarkerVisible = function (s) {};
_p.setExplode = function (s) {};
_p.hasStrokeColor = function () {
    return this._strokeColor != null;
};
_p.hasStrokeOpacity = function () {
    return this._strokeOpacity != null;
};
_p.hasFillOpacity = function () {
    return this._fillOpacity != null;
};
_p.hasFillColor = function () {
    return this._fillColor != null;
};
_p.hasFillColor2 = function () {
    return this._fillColor2 != null;
};
_p.hasFillType = function () {
    return this._fillType != null;
};
_p.hasFillAngle = function () {
    return this._fillAngle != null;
};
_p.hasMarkerType = function () {
    return this._markerType != null;
};
_p.hasMarkerVisible = function () {
    return this._markerVisible != null;
};
_p.hasExplode = function () {
    return this._explode != null;
};
_p.getToolTip = function () {
    return this.getGraph().getToolTipForPoint(this._series, this._category);
};
_p.getContextMenu = function () {
    return this.getGraph().getContextMenuForPoint(this._series, this._category);
};
_p.getTitle = function () {
    return this._category.getTitle();
};
_p.getIconHtml = function (bHasText, bEnabled, sIconPosition, nIconTextGap, sClassName) {
    var marginSide, blockStyle = "";
    switch (sIconPosition) {
    case "right":
        marginSide = "left";
        break;
    case "top":
        marginSide = "bottom";
        blockStyle = "display:block;";
        break;
    case "bottom":
        marginSide = "top";
        blockStyle = "display:block;";
        break;
    default:
        marginSide = "right";
        break;
    }
    var iconTextGap = bHasText ? nIconTextGap : 0;
    return "<img alt=\"\" style=\"vertical-align:middle;border:0.05em solid " + this.getStrokeColor() + ";overflow:hidden;background-color:" + this.getFillColor() + ";" + "width:0.667em;height:0.667em;" + blockStyle + "margin-" + marginSide + ":" + iconTextGap + "px;\"" + (sClassName ? " class=\"" + sClassName + "\"" : "") + " src=\"" + application.getPath() + "images/blank.gif\">";
};
_p.dispose = function () {
    if (this._disposed) return;
    BiChartComponent.prototype.dispose.call(this);
    this._chart = null;
    this._series = null;
    this._category = null;
    this._graph = null;
    this._fillEl = null;
};

function BiSvgChartValueAxisBase(oGraph) {
    if (_biInPrototype) return;
    if (!oGraph) return;
    BiChartComponent.call(this);
    this._graph = oGraph;
    this._labels = [];
};
_p = _biExtend(BiSvgChartValueAxisBase, BiChartComponent, "BiSvgChartValueAxisBase");
_p._majorTickInterval = null;
_p._minorTickInterval = null;
_p._labelInterval = null;
_p._maximum = null;
_p._minimum = null;
_p._showMajorTicks = false;
_p._showMinorTicks = false;
_p._showLabels = true;
_p._fontSize = 11;
_p._desiredVisible = true;
BiSvgChartValueAxisBase.addProperty("showMajorTicks", BiAccessType.READ);
BiSvgChartValueAxisBase.addProperty("showMinorTicks", BiAccessType.READ);
BiSvgChartValueAxisBase.addProperty("showLabels", BiAccessType.READ);
BiSvgChartValueAxisBase.addProperty("fontSize", BiAccessType.READ);
_p.setMajorTickInterval = function (n) {
    this._majorTickInterval = n;
    this._clearCache();
};
_p.setMinorTickInterval = function (n) {
    this._minorTickInterval = n;
    this._clearCache();
};
_p.setMaximum = function (n) {
    this._maximum = n;
    this._clearCache();
};
_p.setMinimum = function (n) {
    this._minimum = n;
    this._clearCache();
};
_p.setShowMajorTicks = function (b) {
    if (this._showMajorTicks != b) {
        this._showMajorTicks = b;
        this._updateMajorTicks();
    }
};
_p.setShowMinorTicks = function (b) {
    if (this._showMinorTicks != b) {
        this._showMinorTicks = b;
        this._updateMinorTicks();
    }
};
_p.setShowLabels = function (b) {
    if (this._showLabels != b) {
        this._showLabels = b;
        this._updateLabels();
    }
};
_p.getMaximumValue = function () {
    if (this._graph._getPercentageStack()) return 1;
    var i, s = this._graph.getSeries();
    if (this._graph._getStackedChart()) {
        var cats = this._graph.getCategories();
        var l = cats.length;
        var sum, id;
        var max = 0;
        for (var j = 0; j < l; j++) {
            sum = 0;
            id = cats[j].getId();
            for (i = 0; i < s.length; i++) {
                sum += Math.abs(s[i].getValueByCategoryId(id));
            }
            max = Math.max(max, sum);
        }
        return max;
    } else {
        var maxValue = -Infinity;
        for (i = 0; i < s.length; i++) maxValue = Math.max(maxValue, s[i].getMaximumValue());
        return maxValue;
    }
};
_p.getMinimumValue = function () {
    if (this._graph._getStackedChart()) return 0;
    var minValue = Infinity;
    var s = this._graph.getSeries();
    for (var i = 0; i < s.length; i++) minValue = Math.min(minValue, s[i].getMinimumValue());
    return minValue;
};
_p.getMaximum = function () {
    if (this._maximum != null) return this._maximum;
    if (this._graph._getPercentageStack()) return 1;
    return this._getDefaultProperties().max;
};
_p.getMinimum = function () {
    if (this._minimum != null) return this._minimum;
    return this._getDefaultProperties().min;
};
_p.getMajorTickInterval = function () {
    if (this._majorTickInterval != null) return this._majorTickInterval;
    return this._getDefaultProperties().major;
};
_p.getMinorTickInterval = function () {
    if (this._minorTickInterval != null) return this._minorTickInterval;
    return this._getDefaultProperties().minor;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiChartComponent.prototype.dispose.call(this);
    this._graph = null;
    for (var i = 0; i < this._labels.length; i++) this._labels[i] = null;
    this._labels = null;
    this._clearCache();
    this._majorTicks = null;
    this._minorTicks = null;
    this._axisLine = null;
};
_p._getDefaultProperties = function () {
    if (this._cachedDefaultProperties != null) return this._cachedDefaultProperties;
    var max = this._maximum != null ? this._maximum : this.getMaximumValue();
    var min = this._minimum != null ? this._minimum : Math.min(0, this.getMinimumValue());
    var diff = max - min;
    var zeros = Math.floor(Math.log(diff) / Math.log(10));
    var major;
    if (this._majorTickInterval != null) {
        major = this._majorTickInterval;
    } else {
        major = Math.pow(10, zeros);
        var x = diff / major;
        if (x < 2) major = major / 5;
        else if (x < 5) major = major / 2;
    }
    var minor = this._minorTickInterval != null ? this._minorTickInterval : major / 5;
    var newMax = Math.ceil((max + major / 2) / major) * major;
    var newMin;
    if (min == 0) newMin = 0;
    else newMin = Math.floor((min - major / 2) / major) * major;
    return this._cachedDefaultProperties = {
        max: newMax,
        min: newMin,
        major: major,
        minor: minor
    };
};
_p.setFontSize = function (n) {};
_p.setVisible = function (b) {};
_p.getVisible = function () {
    return this._desiredVisible;
};
_p._updateVisible = function () {
    this.setVisible(this._desiredVisible);
};
_p.fromXmlElement = function (oNode) {
    var s = oNode.getAttribute("Visible");
    if (s) this.setVisible(s != "false");
    s = oNode.getAttribute("ShowMajorTicks");
    if (s) this.setShowMajorTicks(s != "false");
    s = oNode.getAttribute("ShowMinorTicks");
    if (s) this.setShowMinorTicks(s == "true");
    s = oNode.getAttribute("ShowLabels");
    if (s) this.setShowLabels(s != "false");
    s = oNode.getAttribute("MajorTickInterval");
    if (s) this.setMajorTickInterval(Number(s));
    s = oNode.getAttribute("MinorTickInterval");
    if (s) this.setMinorTickInterval(Number(s));
    s = oNode.getAttribute("Maximum");
    if (s) this.setMaximum(Number(s));
    s = oNode.getAttribute("Minimum");
    if (s) this.setMinimum(Number(s));
};
_p.toXmlElement = function (oDoc) {
    var el = oDoc.createElement("ValueAxis");
    el.setAttribute("Visible", String(this._desiredVisible));
    if (this._showMajorTicks != null) el.setAttribute("ShowMajorTicks", String(this._showMajorTicks));
    if (this._showMinorTicks != null) el.setAttribute("ShowMinorTicks", String(this._showMinorTicks));
    if (this._showLabels != null) el.setAttribute("ShowLabels", String(this._showLabels));
    if (this._majorTickInterval != null) el.setAttribute("MajorTickInterval", String(this._majorTickInterval));
    if (this._minorTickInterval != null) el.setAttribute("MinorTickInterval", String(this._minorTickInterval));
    if (this._maximum != null) el.setAttribute("Maximum", String(this._majorTickInterval));
    if (this._minimum != null) el.setAttribute("Minimum", String(this._minorTickInterval));
    return el;
};
_p._clearCache = function () {
    this._cachedDefaultProperties = null;
};

function BiSvgChartCategoryAxisBase(oGraph) {
    if (_biInPrototype) return;
    if (!oGraph) return;
    BiChartComponent.call(this);
    this._graph = oGraph;
    this._labels = [];
};
_p = _biExtend(BiSvgChartCategoryAxisBase, BiChartComponent, "BiSvgChartCategoryAxisBase");
_p._axisBetweenCategories = true;
_p._desiredVisible = true;
_p._majorTickInterval = null;
_p._minorTickInterval = null;
_p._showMajorTicks = true;
_p._showMinorTicks = true;
_p._showLabels = true;
_p._fontSize = 11;
BiSvgChartCategoryAxisBase.addProperty("majorTickInterval", BiAccessType.WRITE);
BiSvgChartCategoryAxisBase.addProperty("minorTickInterval", BiAccessType.WRITE);
BiSvgChartCategoryAxisBase.addProperty("showMajorTicks", BiAccessType.READ_WRITE);
BiSvgChartCategoryAxisBase.addProperty("showMinorTicks", BiAccessType.READ_WRITE);
BiSvgChartCategoryAxisBase.addProperty("showLabels", BiAccessType.READ_WRITE);
BiSvgChartCategoryAxisBase.addProperty("axisBetweenCategories", BiAccessType.READ_WRITE);
BiSvgChartCategoryAxisBase.addProperty("fontSize", BiAccessType.READ);
_p.getMaximum = function () {
    var l = this._graph.getCategories().length;
    if (this._axisBetweenCategories) return l;
    return l - 1;
};
_p.getMinimum = function () {
    return 0;
};
_p.getMajorTickInterval = function () {
    if (this._majorTickInterval != null) return this._majorTickInterval;
    return 1;
};
_p.getMinorTickInterval = function () {
    if (this._minorTickInterval != null) return this._minorTickInterval;
    return this.getMajorTickInterval() / 2;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiChartComponent.prototype.dispose.call(this);
    this._graph = null;
    for (var i = 0; i < this._labels.length; i++) this._labels[i] = null;
    this._labels = null;
    this._majorTicks = null;
    this._minorTicks = null;
    this._axisLine = null;
};
_p.setFontSize = function (n) {};
_p.setVisible = function (b) {};
_p.getVisible = function () {
    return this._desiredVisible;
};
_p._updateVisible = function () {
    this.setVisible(this._desiredVisible);
};
_p.fromXmlElement = function (oNode) {
    var s = oNode.getAttribute("Visible");
    if (s) this.setVisible(s != "false");
    s = oNode.getAttribute("ShowMajorTicks");
    if (s) this.setShowMajorTicks(s != "false");
    s = oNode.getAttribute("ShowMinorTicks");
    if (s) this.setShowMinorTicks(s == "true");
    s = oNode.getAttribute("ShowLabels");
    if (s) this.setShowLabels(s != "false");
    s = oNode.getAttribute("MajorTickInterval");
    if (s) this.setMajorTickInterval(Number(s));
    s = oNode.getAttribute("MinorTickInterval");
    if (s) this.setMinorTickInterval(Number(s));
    s = oNode.getAttribute("AxisBetweenCategories");
    if (s) this.setAxisBetweenCategories(s != "false");
};
_p.toXmlElement = function (oDoc) {
    var el = oDoc.createElement("CategoryAxis");
    el.setAttribute("Visible", String(this._desiredVisible));
    if (this._showMajorTicks != null) el.setAttribute("ShowMajorTicks", String(this._showMajorTicks));
    if (this._showMinorTicks != null) el.setAttribute("ShowMinorTicks", String(this._showMinorTicks));
    if (this._majorTickInterval != null) el.setAttribute("MajorTickInterval", String(this._majorTickInterval));
    if (this._minorTickInterval != null) el.setAttribute("MinorTickInterval", String(this._minorTickInterval));
    return el;
};

function BiSvgChartAreaBase(oGraph) {
    if (_biInPrototype) return;
    if (!oGraph) return;
    BiChartComponent.call(this);
    this._graph = oGraph;
};
_p = _biExtend(BiSvgChartAreaBase, BiChartComponent, "BiSvgChartAreaBase");
_p._fillColor = null;
_p._strokeColor = null;
_p._updateCoordSize = function (sCoordSize, sCoordOrigin) {};
_p.setFillColor = function (s) {};
_p.getFillColor = function () {
    return this._fillColor;
};
_p.hasFillColor = function () {
    return this._fillColor != null;
};
_p.hasFillColor2 = function () {
    return this._fillColor2 != null;
};
_p.getFillColor2 = function () {
    return this._fillColor2;
};
_p.setFillColor2 = function (s) {
    this._fillColor2 = s;
};
_p.hasFillOpacity = function () {
    return this._fillOpacity != null;
};
_p.getFillOpacity = function () {
    return this._fillOpacity;
};
_p.setFillOpacity = function (n) {
    this._fillOpacity = n;
};
_p.hasFillType = function () {
    return this._fillType != null;
};
_p.getFillType = function () {
    return this._fillType;
};
_p.setFillType = function (s) {
    this._fillType = s;
};
_p.hasFillAngle = function () {
    return this._fillAngle != null;
};
_p.getFillAngle = function () {
    return this._fillAngle;
};
_p.setFillAngle = function (n) {
    this._fillAngle = n;
};
_p.setStrokeColor = function (s) {};
_p.getStrokeColor = function () {
    return this._strokeColor;
};
_p.hasStrokeColor = function () {
    return this._strokeColor != null;
};
_p.hasStrokeOpacity = function () {
    return this._strokeOpacity != null;
};
_p.getStrokeOpacity = function () {
    return this._strokeOpacity;
};
_p.setStrokeOpacity = function (n) {
    this._strokeOpacity = n;
};
_p.fromXmlElement = function (oNode) {
    var n = oNode.selectSingleNode("Stroke/@Opacity");
    if (n) this.setStrokeOpacity(Number(n.text ? n.text : n.nodeValue));
    n = oNode.selectSingleNode("Stroke/@Color");
    if (n) this.setStrokeColor(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Opacity");
    if (n) this.setFillOpacity(Number(n.text ? n.text : n.nodeValue));
    n = oNode.selectSingleNode("Fill/@Color");
    if (n) this.setFillColor(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Color2");
    if (n) this.setFillColor2(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Type");
    if (n) this.setFillType(n.text ? n.text : n.nodeValue);
    n = oNode.selectSingleNode("Fill/@Angle");
    if (n) this.setFillAngle(n.text ? n.text : n.nodeValue);
};
_p.toXmlElement = function (oDoc) {
    if (!this.hasFillColor() && !this.hasStrokeColor() && !this.hasFillColor2() && !this.hasFillType() && !this.hasFillAngle()) return oDoc.createDocumentFragment();
    var ca = oDoc.createElement("ChartArea");
    var el;
    if (this.hasStrokeColor() || this.hasStrokeOpacity()) {
        el = oDoc.createElement("Stroke");
        if (this.hasStrokeOpacity()) el.setAttribute("Opacity", String(this.getStrokeOpacity()));
        if (this.hasStrokeColor()) el.setAttribute("Color", this.getStrokeColor());
        ca.appendChild(el);
    }
    if (this.hasFillColor() || this.hasFillColor2() || this.hasFillType() || this.hasFillAngle() || this.hasFillOpacity()) {
        el = oDoc.createElement("Fill");
        if (this.hasFillOpacity()) el.setAttribute("Opacity", String(this.getFillOpacity()));
        if (this.hasFillColor()) el.setAttribute("Color", this.getFillColor());
        if (this.hasFillColor2()) el.setAttribute("Color2", this.getFillColor2());
        if (this.hasFillType()) el.setAttribute("Type", this.getFillType());
        if (this.hasFillAngle()) el.setAttribute("Angle", this.getFillAngle());
        ca.appendChild(el);
    }
    return ca;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiChartComponent.prototype.dispose.call(this);
    this._graph = null;
    this._outlineRect = null;
    this._backgroundRect = null;
    this._fillEl = null;
};

function BiSvgChartGridLinesBase(oGraph) {
    if (_biInPrototype) return;
    BiChartComponent.call(this);
    this._graph = oGraph;
};
_p = _biExtend(BiSvgChartGridLinesBase, BiChartComponent, "BiSvgChartGridLinesBase");
BiSvgChartGridLinesBase.addProperty("graph", BiAccessType.READ);
_p._desiredVisible = true;
_p._showMinorCategory = null;
_p._showMinorValue = null;
_p._showMajorCategory = null;
_p._showMajorValue = null;
_p._minorCategoryStrokeColor = null;
_p._majorCategoryStrokeColor = null;
_p._minorValueStrokeColor = null;
_p._majorValueStrokeColor = null;
_p.setShowMinorValue = function (b) {
    if (this._showMinorValue != b) {
        this._showMinorValue = b;
        this._updateMinorValue();
    }
};
_p.setShowMajorValue = function (b) {
    if (this._showMajorValue != b) {
        this._showMajorValue = b;
        this._updateMajorValue();
    }
};
_p.setShowMinorCategory = function (b) {
    if (this._showMinorCategory != b) {
        this._showMinorCategory = b;
        this._updateMinorCategory();
    }
};
_p.setShowMajorCategory = function (b) {
    if (this._showMajorCategory != b) {
        this._showMajorCategory = b;
        this._updateMajorCategory();
    }
};
_p.getShowMinorValue = function () {
    return this._showMinorValue != null ? this._showMinorValue : false;
};
_p.getShowMajorValue = function () {
    return this._showMajorValue != null ? this._showMajorValue : true;
};
_p.getShowMinorCategory = function () {
    return this._showMinorCategory != null ? this._showMinorCategory : false;
};
_p.getShowMajorCategory = function () {
    return this._showMajorCategory != null ? this._showMajorCategory : true;
};
_p.hasShowMinorValue = function () {
    return this._showMinorValue != null;
};
_p.hasShowMajorValue = function () {
    return this._showMajorValue != null;
};
_p.hasShowMinorCategory = function () {
    return this._showMinorCategory != null;
};
_p.hasShowMajorCategory = function () {
    return this._showMajorCategory != null;
};
_p.getMinorCategoryStrokeColor = function () {
    return this._minorCategoryStrokeColor || "#ddd";
};
_p.getMajorCategoryStrokeColor = function () {
    return this._majorCategoryStrokeColor || "#333";
};
_p.getMinorValueStrokeColor = function () {
    return this._minorValueStrokeColor || "#ddd";
};
_p.getMajorValueStrokeColor = function () {
    return this._majorValueStrokeColor || "#333";
};
_p.hasMinorCategoryStrokeColor = function () {
    return this._minorCategoryStrokeColor != null;
};
_p.hasMajorCategoryStrokeColor = function () {
    return this._majorCategoryStrokeColor != null;
};
_p.hasMinorValueStrokeColor = function () {
    return this._minorValueStrokeColor != null;
};
_p.hasMajorValueStrokeColor = function () {
    return this._majorValueStrokeColor != null;
};
_p.setMinorCategoryStrokeColor = function (s) {};
_p.setMajorCategoryStrokeColor = function (s) {};
_p.setMinorValueStrokeColor = function (s) {};
_p.setMajorValueStrokeColor = function (s) {};
_p.fromXmlElement = function (oElement) {
    var n = oElement.selectSingleNode("MajorValue/@Visible");
    if (n) this.setShowMajorValue((n.text ? n.text : n.nodeValue) == "true");
    n = oElement.selectSingleNode("MinorValue/@Visible");
    if (n) this.setShowMinorValue((n.text ? n.text : n.nodeValue) == "true");
    n = oElement.selectSingleNode("MajorCategory/@Visible");
    if (n) this.setShowMajorCategory((n.text ? n.text : n.nodeValue) == "true");
    n = oElement.selectSingleNode("MinorCategory/@Visible");
    if (n) this.setShowMinorCategory((n.text ? n.text : n.nodeValue) == "true");
    n = oElement.selectSingleNode("MinorCategory/Stroke/@Color");
    if (n) this.setMinorCategoryStrokeColor(n.text ? n.text : n.nodeValue);
    n = oElement.selectSingleNode("MajorCategory/Stroke/@Color");
    if (n) this.setMajorCategoryStrokeColor(n.text ? n.text : n.nodeValue);
    n = oElement.selectSingleNode("MinorValue/Stroke/@Color");
    if (n) this.setMinorValueStrokeColor(n.text ? n.text : n.nodeValue);
    n = oElement.selectSingleNode("MajorValue/Stroke/@Color");
    if (n) this.setMajorValueStrokeColor(n.text ? n.text : n.nodeValue);
};
_p.toXmlElement = function (oDoc) {
    var gd = oDoc.createElement("GridLines");
    var el, n;
    if (this.hasShowMajorValue() || this.hasMajorValueStrokeColor()) {
        n = oDoc.createElement("MajorValue");
        if (this.hasShowMajorValue()) n.setAttribute("Visible", String(this.getShowMajorValue()));
        if (this.hasMajorValueStrokeColor()) {
            el = oDoc.createElement("Stroke");
            el.setAttribute("Color", this.getMajorValueStrokeColor());
            n.appendChild(el);
        }
        gd.appendChild(n);
    }
    if (this.hasShowMinorValue() || this.hasMinorValueStrokeColor()) {
        n = oDoc.createElement("MinorValue");
        if (this.hasShowMinorValue()) n.setAttribute("Visible", String(this.getShowMinorValue()));
        if (this.hasMinorValueStrokeColor()) {
            el = oDoc.createElement("Stroke");
            el.setAttribute("Color", this.getMinorValueStrokeColor());
            n.appendChild(el);
        }
        gd.appendChild(n);
    }
    if (this.hasShowMajorCategory() || this.hasMajorCategoryStrokeColor()) {
        n = oDoc.createElement("MajorCategory");
        if (this.hasShowMajorCategory()) n.setAttribute("Visible", String(this.getShowMajorCategory()));
        if (this.hasMajorCategoryStrokeColor()) {
            el = oDoc.createElement("Stroke");
            el.setAttribute("Color", this.getMajorCategoryStrokeColor());
            n.appendChild(el);
        }
        gd.appendChild(n);
    }
    if (this.hasShowMinorCategory() || this.hasMinorCategoryStrokeColor()) {
        n = oDoc.createElement("MinorCategory");
        if (this.hasShowMinorCategory()) n.setAttribute("Visible", String(this.getShowMinorCategory()));
        if (this.hasMinorCategoryStrokeColor()) {
            el = oDoc.createElement("Stroke");
            el.setAttribute("Color", this.getMinorCategoryStrokeColor());
            n.appendChild(el);
        }
        gd.appendChild(n);
    }
    return gd;
};

function BiGraph() {
    if (_biInPrototype) return;
    BiGraphBase.call(this);
    this._legend = new BiChartLegend();
    this._graphInside = new BiGraphInside(this._legend);
    this.add(this._graphInside);
    this._legend.setGraph(this._graphInside);
    this.add(this._legend);
};
_p = _biExtend(BiGraph, BiGraphBase, "BiGraph");
_p.update = function () {
    this._graphInside.update();
};
_p.setAutoScale = function (b) {
    this._graphInside.setAutoScale(b);
};
_p.layoutAllChildren = function () {
    this._graphInside.setSize(this.getClientWidth(), this.getClientHeight());
    this._graphInside.layoutAllChildren();
    BiComponent.prototype.layoutAllChildren.call(this);
};
_p.getGrid = function () {
    return this._graphInside._gridComponent;
};
_p.addSeries = function (oSeries) {
    this._graphInside.addSeries(oSeries);
};
_p.removeSeries = function (oSeries) {
    this._graphInside.removeSeries(oSeries);
};
_p.clearSeries = function () {
    this._graphInside.clearSeries();
};
_p.getSeriesById = function (sId) {
    return this._graphInside.getSeriesById(sId);
};
_p.setSeries = function (aSeries) {
    this._graphInside.setSeries(aSeries);
};
_p.addCategory = function (oCategory) {
    this._graphInside.addCategory(oCategory);
};
_p.removeCategory = function (oCategory) {
    this._graphInside.removeCategory(oCategory);
};
_p.clearCategories = function () {
    this._graphInside.clearCategories();
};
_p.getCategoryById = function (sId) {
    return this._graphInside.getCategoryById(sId);
};
_p.setCategories = function (aCategories) {
    this._graphInside.setCategories(aCategories);
};
_p.getCategories = function () {
    return this._graphInside.getCategories();
};
_p.addPoint = function (oPoint) {
    this._graphInside.addPoint(oPoint);
};
_p.removePoint = function (oPoint) {
    this._graphInside.removePoint(oPoint);
};
_p.clearPoints = function () {
    this._graphInside.clearPoints();
};
_p.getPointByIds = function (sSeriesId, sCategoryId) {
    return this._graphInside.getPointByIds(sSeriesId, sCategoryId);
};
_p.getPoints = function () {
    return this._graphInside.getPoints();
};
_p.setPoints = function (aPoints) {
    this._graphInside.setPoints(aPoints);
};
_p.getComponentByIds = function (sSeriesId, sCategoryId) {
    return this._graphInside.getComponentByIds(sSeriesId, sCategoryId);
};
_p.getChartPresentation = _p.getChartPresentationBySeriesId = function (sSeriesId) {
    return this._graphInside.getChartPresentation();
};
_p.setChartType = function (sType) {
    this._graphInside.setChartType(sType);
};
_p.getChartType = function () {
    return this._graphInside.getChartType();
};
_p.setChartArea = function (oArea) {
    this._graphInside.setChartArea(oArea);
};
_p.getChartArea = function () {
    return this._graphInside.getChartArea();
};
_p.getCharts = function () {
    return this._graphInside.getCharts();
};
_p.getChartForSeries = function (oSeries) {
    return this._graphInside.getChartForSeries(oSeries);
};
_p.fromXmlDocument = function (oDoc) {
    this._graphInside.fromXmlDocument(oDoc);
};
_p.updatePoint = function (sSeriesId, sCategoryId) {
    this._graphInside.updatePoint(sSeriesId, sCategoryId);
};
_p.toXmlDocument = function () {
    return this._graphInside.toXmlDocument();
};
_p.getChartPresentation = _p.getChartPresentationBySeriesId = function (sSeriesId) {
    return this._graphInside._chartPresentations[sSeriesId];
};
_p.getCategoryAxis = function () {
    return this._graphInside.getCategoryAxis();
};
_p.getValueAxis = function () {
    return this._graphInside.getValueAxis();
};
_p.getGridLines = function () {
    return this._graphInside.getGridLines();
};
BiGraph.fromUri = function (sUri) {
    return BiGraphInside.fromUri(sUri);
};
BiGraph.fromXmlDocument = function (oDoc) {
    return BiGraphInside.fromXmlDocument(oDoc);
};

function BiGraphInside(legend) {
    if (_biInPrototype) return;
    BiSvgGraphBase.call(this);
    this.setViewBox(0, 0, 1000, 1000);
    this._contentArea = new BiGraphContentArea;
    this._chartArea = new BiChartArea(this);
    this._valueAxis = new BiChartValueAxis(this);
    this._categoryAxis = new BiChartCategoryAxis(this);
    this._gridLines = new BiChartGridLines(this);
    this._legend = legend;
    this._legend.setRight(10);
    this._contentArea.add(this._chartArea);
    this.add(this._contentArea);
    this._chartArea.add(this._gridLines);
    this._chartArea.add(this._valueAxis);
    this._chartArea.add(this._categoryAxis);
    this._defs = BiSvgComponent.newSvgComponent("defs");
    this.add(this._defs);
    this._valueLabels = [];
    this._categoryLabels = [];
};
_p = _biExtend(BiGraphInside, BiSvgGraphBase, "BiGraphInside");
_p._chartType = "line";
_p._autoScale = true;
_p._scaleFactor = 1e4;
_p._catScaleFactor = 1e4;
_p._coordWidth = 1000;
_p._coordHeight = 1000;
_p.setAutoScale = function (b) {
    if (this._autoScale != b) {
        this._autoScale = b;
        if (b) {
            this._contentArea.setHtmlProperty("coordsize", "1000,1000");
            this._chartArea.setLocation(this._chartAreaLeft, this._chartAreaTop);
            this._chartArea.setSize(this._chartAreaWidth, this._chartAreaHeight);
            this._legend.setRight(10);
            this._legend.setWidth(null);
            this._legend.setLocation(null, null);
            this._legend._topSet = false;
        }
        if (this.getCreated()) this.layoutAllChildren();
    }
};
_p.layoutAllChildren = function () {
    if (!this._autoScale) {
        this._contentArea.setHtmlProperty("coordsize", this.getClientWidth() + "," + this.getClientHeight());
    }
    this._scaleFont();
    BiSvgGraphBase.prototype.layoutAllChildren.call(this);
    this._chartArea.layoutAllChildren();
    this._legend.layoutComponent();
    this._updateLabels();
};
_p._createChartFromSeries = function (oSeries) {
    var c;
    switch (this._chartType) {
    case "pie":
        c = new BiPieChart(this, oSeries);
        break;
    case "bar":
        c = new BiBarChart(this, oSeries);
        break;
    case "stackedbar":
        c = new BiStackedBarChart(this, oSeries);
        break;
    case "percentagestackedbar":
        c = new BiPercentageStackedBarChart(this, oSeries);
        break;
    case "column":
        c = new BiColumnChart(this, oSeries);
        break;
    case "stackedcolumn":
        c = new BiStackedColumnChart(this, oSeries);
        break;
    case "percentagestackedcolumn":
        c = new BiPercentageStackedColumnChart(this, oSeries);
        break;
    case "line":
    default:
        c = new BiLineChart(this, oSeries);
        break;
    }
    this._charts[oSeries.getId()] = c;
    this._chartArea.add(c);
};
_p.update = function () {
    this._syncChartForSeries();
    this._updateCoordSize();
    this._updateCharts();
    this._legend._update();
    this._valueAxis._updateVisible();
    this._categoryAxis._updateVisible();
    this._gridLines._updateVisible();
    if (this.getChartType() == "grid") this._gridComponent.update();
};
BiGraphInside.fromXmlDocument = function (oDoc) {
    var g = new BiGraph;
    g.fromXmlDocument(oDoc);
    return g;
};
BiGraphInside.fromUri = function (sUri) {
    var g = new BiGraph;
    var xmlLoader = new BiXmlLoader;
    xmlLoader.setAsync(false);
    xmlLoader.load(sUri);
    g.fromXmlDocument(xmlLoader.getDocument());
    xmlLoader.dispose();
    return g;
};
_p._updateLabels = function () {
    if (this._chartType == "pie" || this._chartType == "grid") {
        this.clearCategoryLabels();
        this.clearValueLabels();
    } else {
        var startY = this._chartAreaTop * this.getClientHeight() / 1000;
        var startX = this._chartAreaLeft * this.getClientWidth() / 1000;
        var chartAreaPointHtmlWidth = ((this._chartAreaWidth / 1000) * this.getClientWidth()) / (this._valueAxis.getInsideWidth());
        var chartAreaPointHtmlHeight = ((this._chartAreaHeight / 1000) * this.getClientHeight()) / (this._valueAxis.getInsideHeight());
        var fontSize = Math.floor(Math.min(this.getClientWidth(), this.getClientHeight()) * 0.038);
        var labelWidth = 0;
        var i, l;
        for (i = 0; i < this._valueLabels.length; i++) {
            l = this._valueLabels[i].label.getPreferredWidth();
            if (l > labelWidth) labelWidth = l;
        }
        for (i = 0; i < this._valueLabels.length; i++) {
            var labelHeight = this._valueLabels[i].label.getPreferredHeight();
            this._valueLabels[i].label.setFont(new BiFont(fontSize));
            this._valueLabels[i].label.setWidth(labelWidth);
            this._valueLabels[i].label.setTop((startY + chartAreaPointHtmlHeight * (this._valueLabels[i].top - this._valueAxis.getMinY())) - (this._getCategoryOnXAxis() ? labelHeight / 2 : 0));
            this._valueLabels[i].label.setLeft((startX + chartAreaPointHtmlWidth * (this._valueLabels[i].left - this._valueAxis.getMinX())) - (this._getCategoryOnXAxis() ? labelWidth : labelWidth / 2));
        }
        var catLabelWidth = 0;
        for (i = 0; i < this._categoryLabels.length; i++) {
            l = this._categoryLabels[i].label.getPreferredWidth();
            if (l > catLabelWidth) catLabelWidth = l;
        }
        chartAreaPointHtmlWidth = ((this._chartAreaWidth / 1000) * this.getClientWidth()) / (this._categoryAxis.getInsideWidth());
        chartAreaPointHtmlHeight = ((this._chartAreaHeight / 1000) * this.getClientHeight()) / (this._categoryAxis.getInsideHeight());
        for (i = 0; i < this._categoryLabels.length; i++) {
            this._categoryLabels[i].label.setFont(new BiFont(fontSize));
            this._categoryLabels[i].label.setWidth(catLabelWidth);
            this._categoryLabels[i].label.setTop((startY + chartAreaPointHtmlHeight * (this._categoryLabels[i].top - this._categoryAxis.getMinY())) - this._categoryLabels[i].label.getPreferredHeight() / 2);
            this._categoryLabels[i].label.setLeft((startX + chartAreaPointHtmlWidth * (this._categoryLabels[i].left - this._categoryAxis.getMinX())) - (this._getCategoryOnXAxis() ? catLabelWidth / 2 : catLabelWidth));
        }
        this._parent.invalidateLayout();
    }
};
_p._updateCoordSize = function () {
    this._valueAxis._clearCache();
    var max = this._valueAxis.getMaximum();
    var min = this._valueAxis.getMinimum();
    var catCoordSize = this._categoryAxis.getMaximum();
    var absMax = Math.max(Math.abs(max), Math.abs(min));
    var pow = Math.floor(Math.log(absMax) / Math.log(10));
    this._scaleFactor = Math.pow(10, 4 - pow);
    max = Math.ceil(max * this._scaleFactor);
    min = Math.floor(min * this._scaleFactor);
    var coordSize, coordOrigin;
    if (this._getCategoryOnXAxis()) {
        this._coordWidth = catCoordSize * this._catScaleFactor;
        this._coordHeight = (max - min);
        coordOrigin = "0," + min;
    } else {
        this._coordWidth = (max - min);
        this._coordHeight = catCoordSize * this._catScaleFactor;
        coordOrigin = min + ",0";
    }
    this._min = min;
    coordSize = this._coordWidth + "," + this._coordHeight;
    this._chartArea._updateCoordSize(coordSize, coordOrigin);
    this._valueAxis._updateCoordSize(coordSize, coordOrigin);
    this._categoryAxis._updateCoordSize(coordSize, coordOrigin);
    this._gridLines._updateCoordSize(coordSize, coordOrigin);
    this._updateLabels();
};
BiGraphInside._addExtendedFillInterface = function (p) {
    p._fillOpacity = null;
    p._fillColor2 = null;
    p._fillType = null;
    p._fillAngle = null;
    p._createFill2 = function () {
        if (this._graph._defs) {
            if (!this._fill) {
                this._fill = new BiSvgFill(this.getId());
                this._graph._defs.add(this._fill);
                this._fillObject.setHtmlProperty("fill", "url(#" + this._fill.getHtmlProperty("id") + ")");
            }
            this._fill.setFillColor2(this.getFillColor2());
            this._fill.setFillColor(this.getFillColor());
            this._fill.setFillAngle(this.getFillAngle());
        }
    };
    p._createFill = function (o) {
        if (o) this._fillObject = o;
        else this._fillObject = this; if (this.getFillType() == "gradient") this._createFill2();
        else this.setFillColor(this.getFillColor());
    };
    p.setFillOpacity = function (n) {
        this._fillOpacity = n;
    };
    p.getFillOpacity = function () {
        return this._fillOpacity;
    };
    p.hasFillOpacity = function () {
        return this._fillOpacity != null;
    };
    p.setFillColor2 = function (s) {
        this._fillColor2 = s;
        this._createFill2();
    };
    p.getFillColor2 = function () {
        return this._fillColor2;
    };
    p.hasFillColor2 = function () {
        return this._fillColor2 != null;
    };
    p.setFillColor = function (s) {
        this._fillColor = s;
        if (this._fillType != "gradient") this._fillObject.setHtmlProperty("fill", (s ? s : "none"));
    };
    p.setFillType = function (s) {
        this._fillType = s;
        if (this._fillType == "gradient") this._createFill2();
    };
    p.getFillType = function () {
        return this._fillType;
    };
    p.hasFillType = function () {
        return this._fillType != null;
    };
    p.setFillAngle = function (s) {
        this._fillAngle = (s ? s : "90");
        if (this._fillType == "gradient") this._createFill2();
    };
    p.getFillAngle = function () {
        return (this._fillAngle ? this._fillAngle : "90");
    };
    p.hasFillAngle = function () {
        return this._fillAngle != null;
    };
};
BiGraphInside._addExtendedStrokeInterface = function (p) {
    p._strokeOpacity = null;
    p._createStroke = function (o) {
        this.setStrokeOpacity(this.getStrokeOpacity(), o);
    };
    p.setStrokeOpacity = function (n, o) {
        this._strokeOpacity = n;
        if (o) o.setHtmlProperty("stroke-opacity", n);
        else this.setHtmlProperty("stroke-opacity", n);
    };
    p.getStrokeOpacity = function () {
        return this._strokeOpacity;
    };
    p.hasStrokeOpacity = function () {
        return this._strokeOpacity != null;
    };
};
_p.getClientWidth = function () {
    return this._parent.getClientWidth();
};
_p.getClientHeight = function () {
    return this._parent.getClientHeight();
};
_p.addCategoryLabel = function (sText, sAlign, x, y) {
    var l = new BiLabel(sText);
    l.setAlign(sAlign);
    l.setWidth(100);
    this._parent.add(l);
    this._categoryLabels[this._categoryLabels.length] = {
        label: l,
        top: y,
        left: x
    };
};
_p.addValueLabel = function (sText, sAlign, x, y) {
    var l = new BiLabel(sText);
    l.setWidth(30);
    l.setAlign(sAlign);
    this._parent.add(l);
    this._valueLabels[this._valueLabels.length] = {
        label: l,
        top: y,
        left: x
    };
};
_p.clearCategoryLabels = function () {
    for (var i = this._categoryLabels.length - 1; i >= 0; i--) {
        var tmp = this._categoryLabels[i].label;
        this._parent.remove(tmp);
        tmp.dispose();
    }
    this._categoryLabels = [];
};
_p.clearValueLabels = function () {
    for (var i = this._valueLabels.length - 1; i >= 0; i--) {
        var tmp = this._valueLabels[i].label;
        this._parent.remove(tmp);
        tmp.dispose();
    }
    this._valueLabels = [];
};

function BiGraphContentArea() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setLocation(0, 0);
    this.setRight(0);
    this.setBottom(0);
}
_p = _biExtend(BiGraphContentArea, BiSvgComponent, "BiGraphContentArea");
_p._tagName = "g";
_p.getClientWidth = function () {
    var p = this.getParent();
    if (p) return p.getClientWidth();
    return BiComponent.prototype.getClientWidth.call(this);
};
_p.getClientHeight = function () {
    var p = this.getParent();
    if (p) return p.getClientHeight();
    return BiComponent.prototype.getClientHeight.call(this);
};

function BiChartArea(oGraph) {
    if (_biInPrototype) return;
    BiSvgChartAreaBase.call(this, oGraph);
    this.setStyleProperty("flip", "y");
    this.setLocation(oGraph._chartAreaLeft, oGraph._chartAreaTop);
    this.setSize(oGraph._chartAreaWidth, oGraph._chartAreaHeight);
    this.setViewBox(0, 0, 1000, 1000);
    this._backgroundRect = BiChartComponent.newChartComponent("rect");
    this._backgroundRect.setLocation(0, 0);
    this._backgroundRect.setSize(1000, 1000);
    this._backgroundRect.setHtmlProperty("fill", "none");
    this._backgroundRect.setZIndex(0);
    this._backgroundRect.setStyleProperty("antialias", "false");
    this.add(this._backgroundRect);
    this._createFill(this._backgroundRect);
    this._createStroke(this._backgroundRect);
};
_p = _biExtend(BiChartArea, BiSvgChartAreaBase, "BiChartArea");
_p._tagName = "svg";
_p.layoutAllChildren = function () {
    BiSvgChartAreaBase.prototype.layoutAllChildren.call(this);
    if (this._graph.getChartType() == "pie" && this._graph.getCharts()[0]) {
        this._graph.getCharts()[0].layoutAllChildren();
    }
};
_p.setStrokeColor = function (s) {
    this._strokeColor = s;
    if (s != "transparent") this._outlineRect.setHtmlProperty("stroke", s);
};
BiGraphInside._addExtendedFillInterface(_p);
BiGraphInside._addExtendedStrokeInterface(_p);
BiChartArea.fromXmlElement = function (oGraph, oNode) {
    var ca = new BiChartArea(oGraph);
    ca.fromXmlElement(oNode);
    return ca;
};

function BiChartValueAxis(oGraph) {
    if (_biInPrototype) return;
    BiSvgChartValueAxisBase.call(this, oGraph);
    this._majorTicks = BiSvgComponent.newSvgComponent("path");
    this._minorTicks = BiSvgComponent.newSvgComponent("path");
    this._axisLine = BiSvgComponent.newSvgComponent("path");
    this._majorTicks.setVisible(this._showMajorTicks);
    this._minorTicks.setVisible(this._showMinorTicks);
    this.setStyleProperty("antialias", "false");
    this.add(this._minorTicks);
    this.add(this._majorTicks);
    this.add(this._axisLine);
    this.setLocation(0, 0);
    this.setSize(1000, 1000);
};
_p = _biExtend(BiChartValueAxis, BiSvgChartValueAxisBase, "BiChartValueAxis");
_p._showMajorTicks = true;
_p._showMinorTicks = true;
_p._updateCoordSize = function (sCoordSize, sCoordOrigin) {
    var p = sCoordSize.split(",");
    var w = Number(p[0]),
        h = Number(p[1]);
    p = sCoordOrigin.split(",");
    var x = Number(p[0]),
        y = Number(p[1]);
    this._coordSize = this._graph._getCategoryOnXAxis() ? w : h;
    this.setChartViewBox(x, y, w, h);
    this._w = w;
    this._h = h;
    var s = this._graph.getSeries();
    var c;
    for (var i = 0; i < s.length; i++) {
        c = this._graph.getChartForSeries(s[i]);
        if (c) c._updateCoordSize(sCoordSize, sCoordOrigin);
    }
    this._updateMajorTicks();
    this._updateMinorTicks();
    this._updateAxisLine();
    this._updateLabels();
};
_p._updateAxisLine = function () {
    var min = Math.round(this.getMinimum() * this._graph._scaleFactor);
    var max = Math.round(this.getMaximum() * this._graph._scaleFactor);
    var x0 = 0;
    var onX = this._graph._getCategoryOnXAxis();
    if (onX) this._axisLine.setHtmlProperty("d", " M" + x0 + "," + this.calculateFlippedY(min) + " L" + x0 + "," + this.calculateFlippedY(max));
    else this._axisLine.setHtmlProperty("d", " M" + min + "," + this.calculateFlippedY(x0) + " L" + max + "," + this.calculateFlippedY(x0));
    this._axisLine.setHtmlProperty("stroke", "black");
    this._axisLine.setHtmlProperty("stroke-width", onX ? this.getInsideWidth() * 0.001 : this.getInsideHeight() * 0.001);
};
_p._updateMajorTicks = function () {
    if (this._showMajorTicks) {
        var min = this.getMinimum();
        var max = this.getMaximum();
        var major = this.getMajorTickInterval();
        var x0 = 0;
        var x1 = -0.5 * 1000;
        var onX = this._graph._getCategoryOnXAxis();
        var sb = [];
        var y = min;
        if (y / major % 1 != 0) y = y + (min < 0 ? 0 : major) - y % major;
        var y2;
        while (y <= max) {
            y2 = Math.round(y * this._graph._scaleFactor);
            if (onX) sb.push(" M", x0, ",", this.calculateFlippedY(y2), " L", x1, ",", this.calculateFlippedY(y2));
            else sb.push(" M", y2, ",", this.calculateFlippedY(x0), " L", y2, ",", this.calculateFlippedY(x1));
            y += major;
            y = Math.round(y / major) * major;
        }
        this._majorTicks.setHtmlProperty("d", sb.join(""));
        this._majorTicks.setHtmlProperty("stroke", "black");
        this._majorTicks.setHtmlProperty("stroke-width", onX ? this.getInsideHeight() * 0.003 : this.getInsideWidth() * 0.003);
    }
};
_p._updateMinorTicks = function () {
    if (this._showMinorTicks) {
        var min = this.getMinimum();
        var max = this.getMaximum();
        var minor = this.getMinorTickInterval();
        var x0 = 0;
        var x1 = -0.25 * 1000;
        var onX = this._graph._getCategoryOnXAxis();
        var sb = [];
        var y = min;
        if (y / minor % 1 != 0) y = y + (min < 0 ? 0 : minor) - y % minor;
        var y2;
        while (y <= max) {
            y2 = Math.round(y * this._graph._scaleFactor);
            if (onX) sb.push(" M", x0, ",", this.calculateFlippedY(y2), " L", x1, ",", this.calculateFlippedY(y2));
            else sb.push(" M", y2, ",", this.calculateFlippedY(x0), " L", y2, ",", this.calculateFlippedY(x1));
            y += minor;
            y = Math.round(y / minor) * minor;
        }
        this._minorTicks.setHtmlProperty("d", sb.join(""));

        this._minorTicks.setHtmlProperty("stroke", "black");
        this._minorTicks.setHtmlProperty("stroke-width", onX ? this.getInsideHeight() * 0.002 : this.getInsideWidth() * 0.002);
    }
};
_p._updateLabels = function () {
    if (!this._created) return;
    this._graph.clearValueLabels();
    if (this._showLabels) {
        var min = this.getMinimum();
        var max = this.getMaximum();
        var major = this.getMajorTickInterval();
        var y = min;
        if (y / major % 1 != 0) y = y + (min < 0 ? 0 : major) - y % major;
        var y2, ys;
        var onX = this._graph._getCategoryOnXAxis();
        var percentage = this._graph._getPercentageStack();
        while (y <= max) {
            y2 = Math.round(y * this._graph._scaleFactor);
            if (percentage) ys = Math.round(y * 100) + "%";
            else ys = y; if (ys == "") ys = "0";
            if (onX) {
                this._graph.addValueLabel(ys, "right", 0 - this.getInsideWidth() * 0.018, this.calculateFlippedY(y2));
            } else {
                this._graph.addValueLabel(ys, "center", y2, this.calculateFlippedY((-2 * 1000)));
            }
            y += major;
            y = Math.round(y / major) * major;
            y = Math.round(y * 1000) / 1000;
        }
    }
};
_p.setFontSize = function (n) {
    this._fontSize = n;
};
_p.setVisible = function (b) {
    this._desiredVisible = b;
    BiComponent.prototype.setVisible.call(this, b && this._graph._getSupportsValueAxis());
};
BiChartValueAxis.fromXmlElement = function (oGraph, oNode) {
    var ax = new BiChartValueAxis(oGraph);
    ax.fromXmlElement(oNode);
    return ax;
};

function BiChartCategoryAxis(oGraph) {
    if (_biInPrototype) return;
    BiSvgChartCategoryAxisBase.call(this, oGraph);
    this._majorTicks = BiSvgComponent.newSvgComponent("path");
    this._minorTicks = BiSvgComponent.newSvgComponent("path");
    this._axisLine = BiSvgComponent.newSvgComponent("path");
    this._majorTicks.setVisible(this._showMajorTicks);
    this._minorTicks.setVisible(this._showMinorTicks);
    this.setStyleProperty("antialias", "false");
    this.add(this._minorTicks);
    this.add(this._majorTicks);
    this.add(this._axisLine);
    this.setLocation(0, 0);
    this.setSize(1000, 1000);
};
_p = _biExtend(BiChartCategoryAxis, BiSvgChartCategoryAxisBase, "BiChartCategoryAxis");
_p._updateCoordSize = function (sCoordSize, sCoordOrigin) {
    var p = sCoordSize.split(",");
    var w = Number(p[0]),
        h = Number(p[1]);
    p = sCoordOrigin.split(",");
    var x = Number(p[0]),
        y = Number(p[1]);
    this._coordSize = this._graph._getCategoryOnXAxis() ? h : w;
    this.setChartViewBox(x, y, w, h);
    this._w = w;
    this._h = h;
    this._updateMajorTicks();
    this._updateMinorTicks();
    this._updateAxisLine();
    this._updateLabels();
};
_p._updateAxisLine = function () {
    var y0 = 0;
    var max = this._graph._categoryAxis.getMaximum() * this._graph._catScaleFactor;
    var min = 0;
    var onX = this._graph._getCategoryOnXAxis();
    if (onX) this._axisLine.setHtmlProperty("d", " M" + min + "," + this.calculateFlippedY(y0) + " L" + max + "," + this.calculateFlippedY(y0));
    else this._axisLine.setHtmlProperty("d", " M" + y0 + "," + this.calculateFlippedY(min) + " L" + y0 + "," + this.calculateFlippedY(max));
    this._axisLine.setHtmlProperty("stroke", "black");
    this._axisLine.setHtmlProperty("stroke-width", onX ? this.getInsideHeight() * 0.001 : this.getInsideWidth() * 0.001);
};
_p._updateMajorTicks = function () {
    if (this._showMajorTicks) {
        var y0 = 0;
        var y1 = Math.round(y0 - 0.01 * this._coordSize);
        var major = this._graph._categoryAxis.getMajorTickInterval();
        var catMax = this._graph._categoryAxis.getMaximum();
        var sb = [];
        var x = 0;
        var onX = this._graph._getCategoryOnXAxis();
        var x2;
        while (x <= catMax) {
            x2 = Math.round(x * this._graph._catScaleFactor);
            if (onX) sb.push(" M", x2, ",", this.calculateFlippedY(y0), " L", x2, ",", this.calculateFlippedY(y1));
            else sb.push(" M", y0, ",", this.calculateFlippedY(x2), " L", y1, ",", this.calculateFlippedY(x2));
            x += major;
            x = Math.round(x / major) * major;
        }
        this._majorTicks.setHtmlProperty("d", sb.join(""));
        this._majorTicks.setHtmlProperty("stroke", "black");
        this._majorTicks.setHtmlProperty("stroke-width", onX ? this.getInsideWidth() * 0.003 : this.getInsideHeight() * 0.003);
    }
};
_p._updateMinorTicks = function () {
    if (this._showMinorTicks) {
        var y0 = 0;
        var y1 = Math.round(y0 - 0.005 * this._coordSize);
        var minor = this._graph._categoryAxis.getMinorTickInterval();
        var catMax = this._graph._categoryAxis.getMaximum();
        var sb = [];
        var x = minor;
        var onX = this._graph._getCategoryOnXAxis();
        var x2;
        while (x < catMax) {
            x2 = Math.round(x * this._graph._catScaleFactor);
            if (onX) sb.push(" M", x2, ",", this.calculateFlippedY(y0), " L", x2, ",", this.calculateFlippedY(y1));
            else sb.push(" M", y0, ",", this.calculateFlippedY(x2), " L", y1, ",", this.calculateFlippedY(x2));
            x += minor;
            x = Math.round(x / minor) * minor;
        }
        this._minorTicks.setHtmlProperty("d", sb.join(""));
        this._minorTicks.setHtmlProperty("stroke", "black");
        this._minorTicks.setHtmlProperty("stroke-width", onX ? this.getInsideWidth() * 0.002 : this.getInsideHeight() * 0.002);
    }
};
_p._updateLabels = function () {
    if (!this._created) return;
    this._graph.clearCategoryLabels();
    if (this._showLabels) {
        var major = this._graph._categoryAxis.getMajorTickInterval();
        var catMax = this._graph._categoryAxis.getMaximum();
        var x = this._axisBetweenCategories ? 0.5 : 0;
        var cats = this._graph.getCategories();
        var x2;
        var onX = this._graph._getCategoryOnXAxis();
        while (x <= catMax) {
            x2 = Math.round(x * this._graph._catScaleFactor);
            if (onX) {
                this._graph.addCategoryLabel(cats[Math.floor(x)].getTitle(), "center", x2, this.calculateFlippedY(-.04 * this._coordSize));
            } else {
                this._graph.addCategoryLabel(cats[Math.floor(x)].getTitle(), "right", -.02 * this._coordSize, this.calculateFlippedY(x2));
            }
            x += major;
        }
    }
};
_p.setFontSize = function (n) {
    this._fontSize = n;
    for (var i = 0; i < this._labels.length; i++) this._labels[i].setFontSize(n);
};
_p.setVisible = function (b) {
    this._desiredVisible = b;
    BiComponent.prototype.setVisible.call(this, b && this._graph._getSupportsCategoryAxis());
};
BiChartCategoryAxis.fromXmlElement = function (oGraph, oNode) {
    var ax = new BiChartCategoryAxis(oGraph);
    ax.fromXmlElement(oNode);
    return ax;
};

function BiChartGridLines(oGraph) {
    if (_biInPrototype) return;
    BiSvgChartGridLinesBase.call(this, oGraph);
    this.setSize(1000, 1000);
    this.setLocation(0, 0);
    this.setViewBox(0, 0, 1000, 1000);
    this._minorCategory = BiChartComponent.newChartComponent("path");
    this._minorValue = BiChartComponent.newChartComponent("path");
    this._majorCategory = BiChartComponent.newChartComponent("path");
    this._majorValue = BiChartComponent.newChartComponent("path");
    this._minorCategory.setVisible(this.getShowMinorCategory());
    this._minorValue.setVisible(this.getShowMinorValue());
    this._majorCategory.setVisible(this.getShowMajorCategory());
    this._majorValue.setVisible(this.getShowMajorValue());
    this._minorCategory.setHtmlProperty("stroke", this.getMinorCategoryStrokeColor());
    this._minorValue.setHtmlProperty("stroke", this.getMajorCategoryStrokeColor());
    this._majorCategory.setHtmlProperty("stroke", this.getMinorValueStrokeColor());
    this._majorValue.setHtmlProperty("stroke", this.getMajorValueStrokeColor());
    this._minorCategory.setHtmlProperty("stroke-width", "20");
    this._minorValue.setHtmlProperty("stroke-width", "20");
    this._majorCategory.setHtmlProperty("stroke-width", "20");
    this._majorValue.setHtmlProperty("stroke-width", "20");
    this.add(this._minorCategory);
    this.add(this._minorValue);
    this.add(this._majorCategory);
    this.add(this._majorValue);
};
_p = _biExtend(BiChartGridLines, BiSvgChartGridLinesBase, "BiChartGridLines");
_p.setShowMinorValue = function (b) {
    BiSvgChartGridLinesBase.prototype.setShowMinorValue.call(this, b);
    this._minorValue.setVisible(b);
};
_p.setShowMajorValue = function (b) {
    BiSvgChartGridLinesBase.prototype.setShowMajorValue.call(this, b);
    this._majorValue.setVisible(b);
};
_p.setShowMinorCategory = function (b) {
    BiSvgChartGridLinesBase.prototype.setShowMinorCategory.call(this, b);
    this._minorCategory.setVisible(b);
};
_p.setShowMajorCategory = function (b) {
    BiSvgChartGridLinesBase.prototype.setShowMajorCategory.call(this, b);
    this._majorCategory.setVisible(b);
};
_p.setMinorCategoryStrokeColor = function (s) {
    this._minorCategoryStrokeColor = s;
    if (s != "transparent") this._minorCategory.setHtmlProperty("stroke", s);
};
_p.setMajorCategoryStrokeColor = function (s) {
    this._majorCategoryStrokeColor = s;
    if (s != "transparent") this._majorCategory.setHtmlProperty("stroke", s);
};
_p.setMinorValueStrokeColor = function (s) {
    this._minorValueStrokeColor = s;
    if (s != "transparent") this._minorValue.setHtmlProperty("stroke", s);
};
_p.setMajorValueStrokeColor = function (s) {
    this._majorValueStrokeColor = s;
    if (s != "transparent") this._majorValue.setHtmlProperty("stroke", s);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiSvgChartGridLinesBase.prototype.dispose.call(this);
    this._graph = null;
    this._minorValue = null;
    this._majorValue = null;
    this._minorCategory = null;
    this._majorCategory = null;
};
_p._updateCoordSize = function (sCoordSize, sCoordOrigin) {
    var p = sCoordSize.split(",");
    var w = Number(p[0]),
        h = Number(p[1]);
    p = sCoordOrigin.split(",");
    var x = Number(p[0]),
        y = Number(p[1]);
    this.setChartViewBox(x, y, w, h);
    this._minorCategory.setViewBox2(sCoordOrigin, sCoordSize);
    this._minorValue.setViewBox2(sCoordOrigin, sCoordSize);
    this._majorCategory.setViewBox2(sCoordOrigin, sCoordSize);
    this._majorValue.setViewBox2(sCoordOrigin, sCoordSize);
    this._updateMajorValue();
    this._updateMinorValue();
    this._updateMajorCategory();
    this._updateMinorCategory();
};
_p._updateMajorValue = function () {
    if (this.getShowMajorValue()) {
        var min = this._graph._valueAxis.getMinimum();
        var max = this._graph._valueAxis.getMaximum();
        var major = this._graph._valueAxis.getMajorTickInterval();
        var catCoordSize = this._graph._categoryAxis.getMaximum();
        var x0 = 0;
        var x1 = Math.round(catCoordSize * this._graph._catScaleFactor);
        var onX = this._graph._getCategoryOnXAxis();
        var sb = [];
        var y = min;
        if (y % major != 0) y = y + (min < 0 ? 0 : major) - y % major;
        var y2;
        while (y <= max) {
            y2 = Math.round(y * this._graph._scaleFactor);
            if (onX) sb.push(" M", x0, ",", this.calculateFlippedY(y2), " L", x1, ",", this.calculateFlippedY(y2));
            else sb.push(" M", y2, ",", this.calculateFlippedY(x0), " L", y2, ",", this.calculateFlippedY(x1));
            y += major;
        }
        this._majorValue.setHtmlProperty("d", sb.join(""));
    }
};
_p._updateMinorValue = function () {
    if (this.getShowMinorValue()) {
        var min = this._graph._valueAxis.getMinimum();
        var max = this._graph._valueAxis.getMaximum();
        var minor = this._graph._valueAxis.getMinorTickInterval();
        var catCoordSize = this._graph._categoryAxis.getMaximum();
        var x0 = 0;
        var x1 = Math.round(catCoordSize * this._graph._catScaleFactor);
        var onX = this._graph._getCategoryOnXAxis();
        var sb = [];
        var y = min;
        if (y % minor != 0) y = y + (min < 0 ? 0 : minor) - y % minor;
        var y2;
        while (y <= max) {
            y2 = Math.round(y * this._graph._scaleFactor);
            if (onX) sb.push(" M", x0, ",", this.calculateFlippedY(y2), " L", x1, ",", this.calculateFlippedY(y2));
            else sb.push(" M", this.calculateFlippedY(y2), ",", x0, " L", y2, ",", this.calculateFlippedY(x1));
            y += minor;
        }
        this._minorValue.setHtmlProperty("d", sb.join(""));
    }
};
_p._updateMajorCategory = function () {
    if (this.getShowMajorCategory()) {
        var y0 = Math.round(this._graph._valueAxis.getMinimum() * this._graph._scaleFactor);
        var y1 = Math.round(this._graph._valueAxis.getMaximum() * this._graph._scaleFactor);
        var major = this._graph._categoryAxis.getMajorTickInterval();
        var catMax = this._graph._categoryAxis.getMaximum();
        var sb = [];
        var x = major;
        var onX = this._graph._getCategoryOnXAxis();
        var x2;
        while (x < catMax) {
            x2 = Math.round(x * this._graph._catScaleFactor);
            if (onX) sb.push(" M", x2, ",", this.calculateFlippedY(y0), " L", x2, ",", this.calculateFlippedY(y1));
            else sb.push(" M", y0, ",", this.calculateFlippedY(x2), " L", y1, ",", this.calculateFlippedY(x2));
            x += major;
        }
        this._majorCategory.setHtmlProperty("d", sb.join(""));
    }
};
_p._updateMinorCategory = function () {
    if (this.getShowMinorCategory()) {
        var y0 = Math.round(this._graph._valueAxis.getMinimum() * this._graph._scaleFactor);
        var y1 = Math.round(this._graph._valueAxis.getMaximum() * this._graph._scaleFactor);
        var minor = this._graph._categoryAxis.getMinorTickInterval();
        var catMax = this._graph._categoryAxis.getMaximum();
        var sb = [];
        var x = minor;
        var onX = this._graph._getCategoryOnXAxis();
        var x2;
        while (x < catMax) {
            x2 = Math.round(x * this._graph._catScaleFactor);
            if (onX) sb.push(" M", x2, ",", this.calculateFlippedY(y0), " L", x2, ",", this.calculateFlippedY(y1));
            else sb.push(" M", y0, ",", this.calculateFlippedY(x2), " L", y1, ",", this.calculateFlippedY(x2));
            x += minor;
        }
        this._minorCategory.setHtmlProperty("d", sb.join(""));
    }
};
_p.setVisible = function (b) {
    this._desiredVisible = b;
    BiComponent.prototype.setVisible.call(this, b && this._graph._getSupportsGridLines());
};
_p.getVisible = function () {
    return this._desiredVisible;
};
_p._updateVisible = function () {
    this.setVisible(this._desiredVisible);
};

function BiAbstractChart(oGraph, oSeries) {
    if (_biInPrototype) return;
    if (!oGraph) return;
    BiSvgAbstractChartBase.call(this, oGraph, oSeries);
    this.setStyleProperty("width", "100%");
    this.setStyleProperty("height", "100%");
    this.setZIndex(2);
};
_p = _biExtend(BiAbstractChart, BiSvgAbstractChartBase, "BiAbstractChart");

function BiAbstractChartSection(oChart, oCategory) {
    if (_biInPrototype) return;
    if (!oChart) return;
    BiSvgAbstractChartSectionBase.call(this, oChart, oCategory);
    this.setHtmlProperty("fill", this.getFillColor());
    this.setHtmlProperty("stroke", this.getStrokeColor());
    this.setHtmlProperty("stroke-width", 4);
    this._createFill();
    this._createStroke();
};
_p = _biExtend(BiAbstractChartSection, BiSvgAbstractChartSectionBase, "BiAbstractChartSection");
BiGraphInside._addExtendedFillInterface(_p);
BiGraphInside._addExtendedStrokeInterface(_p);
_p.getStrokeOpacity = function () {
    return this._graph.getPresentationManager().getStrokeOpacity(this._seriesId, this._categoryId);
};
_p.getFillOpacity = function () {
    return this._graph.getPresentationManager().getFillOpacity(this._seriesId, this._categoryId);
};
_p.getFillColor2 = function () {
    return this._graph.getPresentationManager().getFillColor2(this._seriesId, this._categoryId);
};
_p.getFillType = function () {
    return this._graph.getPresentationManager().getFillType(this._seriesId, this._categoryId);
};
_p.getFillAngle = function () {
    return this._graph.getPresentationManager().getFillAngle(this._seriesId, this._categoryId);
};
_p.setStrokeOpacity = function (n) {
    this.setHtmlProperty("stroke-opacity", n);
};
_p.setStrokeColor = function (s) {
    this.setHtmlProperty("stroke", s);
};
_p.setFillOpacity = function (n) {};
_p.setFillColor = function (s) {
    if (!this.getHtmlProperty("fill")) this.setHtmlProperty("fill", s);
};
_p.setFillColor2 = function (s) {};
_p.setFillType = function (s) {};

function BiLineChart(oGraph, oSeries) {
    if (_biInPrototype) return;
    BiAbstractChart.call(this, oGraph, oSeries);
    this._pathComponent = BiSvgComponent.newSvgComponent("path");
    this._pathComponent.setHtmlProperty("stroke", this.getStrokeColor());
    this._pathComponent.setHtmlProperty("stroke-width", "20");
    this._pathComponent.setHtmlProperty("fill", "none");
    this.add(this._pathComponent);
    this._markersByCat = {};
    this._createShapeType();
};
_p = _biExtend(BiLineChart, BiAbstractChart, "BiLineChart");
_p._tagName = "svg";
_p._showMarkers = true;
BiGraphInside._addExtendedStrokeInterface(_p);
_p.setChartViewBox = function (minX, minY, w, h, xf, yf) {
    BiAbstractChart.prototype.setChartViewBox.call(this, minX, minY, w, h, xf, yf);
    var min = Math.min(this._graph.getClientWidth() || this._graph.getWidth(), this._graph.getClientHeight() || this._graph.getHeight());
    if (min) this._pathComponent.setHtmlProperty("stroke-width", this.getStrokeWidth() * Math.min(this._insideWidth, this._insideHeight) / min);
};
_p.getStrokeOpacity = function () {
    return this._graph.getPresentationManager().getStrokeOpacity(this._seriesId, null);
};
_p._setPath = function () {
    var sb = [];
    var dx = this._graph._categoryAxis.getAxisBetweenCategories() ? 0.5 : 0;
    var vs = this._series.getValues();
    var l = vs.length;
    for (var i = 0; i < l; i++) {
        if (vs[i - 1] != null && vs[i] != null) sb.push("M", ((i - 1 + dx) * this._graph._catScaleFactor), ",", this.calculateFlippedY(Math.round(vs[i - 1] * this._graph._scaleFactor)), "L", ((i + dx) * this._graph._catScaleFactor), ",", this.calculateFlippedY(Math.round(vs[i] * this._graph._scaleFactor)));
    }
    this._pathComponent.setHtmlProperty("d", sb.join(""));
};
_p.getComponentByCategoryId = function (sCatId) {
    return this._markersByCat[sCatId];
};
_p._createMarkers = function () {
    var cs = this.getChildren();
    var i, tmp;
    for (i = cs.length - 1; i >= 2; i--) {
        tmp = cs[i];
        this.remove(tmp);
        tmp.dispose();
    }
    this._markersByCat = {};
    if (this._showMarkers) {
        var dx = this._graph._categoryAxis.getAxisBetweenCategories() ? 0.5 : 0;
        var pm = this._graph.getPresentationManager();
        var sId = this._series.getId();
        var vs = this._series.getValues();
        var cats = this._graph.getCategories();
        var l = vs.length;
        var m, cId;
        for (i = 0; i < l; i++) {
            cId = cats[i].getId();
            if (vs[i] != null && pm.getMarkerVisible(sId, cId)) {
                m = new BiLineMarker(this._lineMarker, this.getStrokeColor(), cats[i]);
                m.setSize(this._coordSizeW / 50, this._coordSizeH / 50);
                m.setLocation((i + dx) * this._graph._catScaleFactor - this.getInsideWidth() * 0.01, (this.calculateFlippedY(Math.round(vs[i] * this._graph._scaleFactor))) - this.getInsideHeight() * 0.01);
                this.add(m);
                this._markersByCat[cats[i].getId()] = m;
            }
        }
    }
};
_p._updateMarkerByCategoryId = function (sId) {
    var m = this._markersByCat[sId];
    if (m) m.setTop(this.calculateFlippedY(this._series.getValueByCategoryId(sId) * this._graph._scaleFactor));
};
_p._updateCoordSize = function (sCoordSize, sCoordOrigin) {
    var p = sCoordSize.split(",");
    var w = Number(p[0]),
        h = Number(p[1]);
    p = sCoordOrigin.split(",");
    var x = Number(p[0]),
        y = Number(p[1]);
    this.setChartViewBox(x, y, w, h);
    this._pathComponent.setLocation(x, y);
    this._coordSizeW = w + 3000;
    this._coordSizeH = h + 3000;
    this._createMarkers();
};
_p.update = function () {
    this._updateChart();
};
_p._updateChart = function () {
    this._setPath();
};
_p._updateValues = function () {
    this._setPath();
    var cats = this._graph.getCategories();
    for (var i = 0; i < cats.length; i++) {
        this._updateValueByCategoryId(cats[i].getId());
    }
};
_p._updateValueByCategoryId = function (sId) {
    this._setPath();
    this._updateMarkerByCategoryId(sId);
};
_p._createShapeType = function () {
    switch (this.getMarkerType()) {
    case "square":
        this._lineMarker = "M-400,-400 L400,-400 L400,400 L-400,400";
        break;
    case "circle":
        this._lineMarker = "M-500,-500 A500,500 0 0 1 -500,-500";
        break;
    case "triangle":
        this._lineMarker = "M-500,-289 L0,500 L500,-289";
        break;
    case "diamond":
    default:
        this._lineMarker = "M-500,0 L0,-500 L500,0 L0,500 L-500,0";
        break;
    };
};
_p.dispose = function () {
    if (this._disposed) return;
    BiAbstractChart.prototype.dispose.call(this);
    this._pathComponent = null;
    for (var hc in this._markersByCat) delete this._markersByCat[hc];
    this._markersByCat = null;
};

function BiLineMarker(pathStr, color, category) {
    if (_biInPrototype) return;
    BiChartComponent.call(this);
    this._pathComponent = BiChartComponent.newChartComponent("path");
    this._pathComponent.setHtmlProperty("fill", color);
    this._pathComponent.setHtmlProperty("d", pathStr);
    this.add(this._pathComponent);
    this.setViewBox(-500, -500, 1000, 1000);
};
_p = _biExtend(BiLineMarker, BiChartComponent, "BiLineMarker");

function BiColumnChart(oGraph, oSeries) {
    if (_biInPrototype) return;
    if (!oGraph) return;
    BiAbstractChart.call(this, oGraph, oSeries);
    this._rectsByCat = {};
    this.setSize(1000, 1000);
    this.setViewBox(0, 0, 1000, 1000);
};
_p = _biExtend(BiColumnChart, BiAbstractChart, "BiColumnChart");
_p._isBar = false;
_p._isStacked = false;
_p._isPercentage = false;
_p._barSpacing = 1;
_p.getComponentByCategoryId = function (sCatId) {
    return this._rectsByCat[sCatId];
};
_p._updateCoordSize = function (sCoordSize, sCoordOrigin) {
    var p = sCoordSize.split(",");
    var w = Number(p[0]),
        h = Number(p[1]);
    p = sCoordOrigin.split(",");
    var x = Number(p[0]),
        y = Number(p[1]);
    this.setChartViewBox(x, y, w, h);
};
_p._updateChart = function () {
    var el = this._element;
    var pn = el.parentNode;
    var ns = el.nextSibling;
    pn.removeChild(el);
    var cs = this.getChildren();
    var i, id, rect;
    for (i = cs.length - 1; i >= 0; i--) this.remove(cs[i]);
    var charts = this._graph.getCharts();
    var chartCount = charts.length;
    var index = charts.indexOf(this);
    var bs = this.getBarSpacing();
    var w = this._isStacked ? 1 / (1 + bs) : 1 / (chartCount + bs);
    var dx = bs * w / 2 + (this._isStacked ? 0 : index * w) - (this._graph._categoryAxis.getAxisBetweenCategories() ? 0 : 0.5);
    var vs = this._series.getValues();
    var l = vs.length;
    var cats = this._graph.getCategories();
    for (i = 0; i < l; i++) {
        if (vs[i] != null) {
            id = cats[i].getId();
            rect = new BiColumnChartSection(this, cats[i]);
            if (this._isBar) {
                var w_ = this._graph._scaleFactor * this._getRectHeight(id);
                rect.setLocation(this._graph._scaleFactor * this._getRectTop(id) + (w_ < 0 ? w_ : 0), this.calculateFlippedY(this._graph._catScaleFactor * (i + dx)) - Math.abs(this._graph._catScaleFactor * w));
                rect.setSize(Math.abs(w_), this._graph._catScaleFactor * w);
            } else {
                var h = this._graph._scaleFactor * this._getRectHeight(id);
                rect.setLocation(this._graph._catScaleFactor * (i + dx), this.calculateFlippedY(this._graph._scaleFactor * this._getRectTop(id)) - (h >= 0 ? h : 0));
                rect.setSize(this._graph._catScaleFactor * w, Math.abs(h));
            }
            this.add(rect);
            this._rectsByCat[id] = rect;
        }
    }
    pn.insertBefore(el, ns);
};
_p.update = function () {
    this._updateChart();
};
_p._updateValues = function () {
    var cats = this._graph.getCategories();
    for (var i = 0; i < cats.length; i++) {
        this._updateValueByCategoryId(cats[i].getId());
    }
};
_p._updateValueByCategoryId = function (sId) {
    this._updateRectByCategoryId(sId);
    if (this._isStacked) {
        var charts = this._graph.getCharts();
        var found = this._graph._getPercentageStack();
        for (var i = 0; i < charts.length; i++) {
            if (!found && charts[i] == this) {
                found = this;
                continue;
            }
            if (found) {
                charts[i]._updateRectByCategoryId(sId);
            }
        }
    }
};
_p._updateRectByCategoryId = function (sId) {
    var rect = this._rectsByCat[sId];
    if (!rect) return;
    if (this._isBar) rect.setWidth(this._getRectHeight(sId) * this._graph._scaleFactor);
    else {
        rect.setHeight(this._getRectHeight(sId) * this._graph._scaleFactor);
    } if (this._isStacked) {
        if (this._isBar) rect.setLeft(this._getRectTop(sId) * this._graph._scaleFactor);
        else rect.setTop(this.calculateFlippedY(this._getRectTop(sId) * this._graph._scaleFactor) - this._getRectHeight(sId) * this._graph._scaleFactor);
    } else {
        if (this._isBar) rect.setLeft(0);
        else rect.setTop(this.calculateFlippedY(0) - this._getRectHeight(sId) * this._graph._scaleFactor);
    }
};
_p._getRectHeight = function (sCategoryId) {
    return Number(this._series.getValueByCategoryId(sCategoryId));
};
_p._getRectTop = function (sCategoryId) {
    return 0;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiAbstractChart.prototype.dispose.call(this);
    for (var hc in this._rectsByCat) delete this._rectsByCat[hc];
    this._rectsByCat = null;
};

function BiBarChart(oGraph, oSeries) {
    if (_biInPrototype) return;
    BiColumnChart.call(this, oGraph, oSeries);
};
_p = _biExtend(BiBarChart, BiColumnChart, "BiBarChart");
_p._isBar = true;

function BiStackedColumnChart(oGraph, oSeries) {
    if (_biInPrototype) return;
    BiColumnChart.call(this, oGraph, oSeries);
};
_p = _biExtend(BiStackedColumnChart, BiColumnChart, "BiStackedColumnChart");
_p._isBar = false;
_p._isStacked = true;
_p._getRectHeight = function (sCategoryId) {
    return Math.abs(this._series.getValueByCategoryId(sCategoryId));
};
_p._getRectTop = function (sCategoryId) {
    var charts = this._graph.getCharts();
    var sum = 0;
    for (var i = 0; i < charts.length; i++) {
        if (charts[i] == this) return sum;
        sum += Math.abs(charts[i]._series.getValueByCategoryId(sCategoryId));
    }
    return sum;
};

function BiStackedBarChart(oGraph, oSeries) {
    if (_biInPrototype) return;
    BiStackedColumnChart.call(this, oGraph, oSeries);
};
_p = _biExtend(BiStackedBarChart, BiStackedColumnChart, "BiStackedBarChart");
_p._isBar = true;

function BiPercentageStackedColumnChart(oGraph, oSeries) {
    if (_biInPrototype) return;
    BiColumnChart.call(this, oGraph, oSeries);
};
_p = _biExtend(BiPercentageStackedColumnChart, BiColumnChart, "BiPercentageStackedColumnChart");
_p._isBar = false;
_p._isStacked = true;
_p._isPercentage = true;
_p._getRectHeight = function (sCategoryId) {
    var charts = this._graph.getCharts();
    var sum = 0;
    for (var i = 0; i < charts.length; i++) {
        sum += Math.abs(charts[i]._series.getValueByCategoryId(sCategoryId));
    }
    return Math.abs(this._series.getValueByCategoryId(sCategoryId)) / sum;
};
_p._getRectTop = function (sCategoryId) {
    var charts = this._graph.getCharts();
    var sum = 0;
    var y;
    for (var i = 0; i < charts.length; i++) {
        if (charts[i] == this) y = sum;
        sum += Math.abs(charts[i]._series.getValueByCategoryId(sCategoryId));
    }
    return y / sum;
};

function BiPercentageStackedBarChart(oGraph, oSeries) {
    if (_biInPrototype) return;
    BiPercentageStackedColumnChart.call(this, oGraph, oSeries);
};
_p = _biExtend(BiPercentageStackedBarChart, BiPercentageStackedColumnChart, "BiPercentageStackedBarChart");
_p._isBar = true;

function BiColumnChartSection(oChart, oCategory) {
    if (_biInPrototype) return;
    BiAbstractChartSection.call(this, oChart, oCategory);
}
_p = _biExtend(BiColumnChartSection, BiAbstractChartSection, "BiColumnChartSection");
_p._tagName = "rect";

function BiPieChart(oGraph, oSeries) {
    if (_biInPrototype) return;
    BiAbstractChart.call(this, oGraph, oSeries);
    this._sectionsByCategory = {};
    this.setLocation(0, 0);
    this.setViewBox(-500, -500, 1000, 1000);
    this._updateAspectRatio();
};
_p = _biExtend(BiPieChart, BiAbstractChart, "BiPieChart");
BiPieChart.addProperty("series", BiAccessType.READ);
BiPieChart.addProperty("graph", BiAccessType.READ);
_p.getComponentByCategoryId = function (sCatId) {
    return this._sectionsByCategory[sCatId];
};
_p.layoutAllChildren = function () {
    BiAbstractChart.prototype.layoutAllChildren.call(this);
    this._updateAspectRatio();
};
_p._updateAspectRatio = function (e) {
    var cw = this._graph.getClientWidth();
    var ch = this._graph.getClientHeight();
    var coordSize, coordOrigin;
    if (cw > ch) {
        coordSize = Math.round(cw / ch * 1000) + ",1000";
        coordOrigin = -Math.round(cw / ch * 500) + ",-500";
    } else {
        coordSize = "1000," + Math.round(ch / cw * 1000);
        coordOrigin = "-500," + -Math.round(ch / cw * 500);
    }
    var p = coordSize.split(",");
    var w = Number(p[0]),
        h = Number(p[1]);
    p = coordOrigin.split(",");
    var x = Number(p[0]),
        y = Number(p[1]);
    this.setChartViewBox(x, y, w, h, 0.25, 0.25);
};
_p._updateCoordSize = function (sCoordSize, sCoordOrigin) {};
_p.update = function () {
    this._updateChart();
};
_p._updateChart = function () {
    this._createChartComponents();
    this._updateAllSections();
};
_p._updateValues = function () {
    this._updateAllSections();
};
_p._updateValueByCategoryId = function (sId) {
    this._updateAllSections();
};
_p._createChartComponents = function () {
    var cs = this.getChildren();
    var i, id, tmp, section;
    for (i = cs.length - 1; i >= 0; i--) {
        tmp = cs[i];
        this.remove(tmp);
        tmp.dispose();
    }
    var cats = this._graph.getCategories();
    var l = cats.length;
    for (i = 0; i < l; i++) {
        id = cats[i].getId();
        if (this._series.getValueByCategoryId(id) != null) {
            section = this._sectionsByCategory[id] = new BiPieChartSection(this, cats[i]);
            this.add(section);
        }
    }
};
_p._updateAllSections = function () {
    var i, sum = 0;
    var values = this._series.getValues();
    for (i = 0; i < values.length; i++) sum += Math.abs(values[i]);
    var cats = this._graph.getCategories();
    var l = cats.length;
    var v = 0;
    var id, section;
    for (i = 0; i < l; i++) {
        id = cats[i].getId();
        section = this._sectionsByCategory[id];
        if (section) {
            section._startAngle = v;
            v += Math.abs(this._series.getValueByCategoryId(id) / sum * 2 * Math.PI);
            section._endAngle = v;
            section._setPath();
        }
    }
};
_p.getSupportsValueAxis = function () {
    return false;
};
_p.getSupportsCategoryAxis = function () {
    return false;
};
_p.getSupportsGridLines = function () {
    return false;
};

function BiPieChartSection(oChart, oCategory, nStartAngle, nEndAngle) {
    if (_biInPrototype) return;
    BiAbstractChartSection.call(this, oChart, oCategory);
    if (nStartAngle != null) this._startAngle = nStartAngle;
    if (nEndAngle != null) this._endAngle = nEndAngle;
    if (nStartAngle != null && nEndAngle != null) this._setPath();
};
_p = _biExtend(BiPieChartSection, BiAbstractChartSection, "BiPieChartSection");
_p._tagName = "path";
_p._startAngle = null;
_p._endAngle = null;
_p._radius = 0.95;
_p._explode = 0.05;
BiPieChartSection.addProperty("startAngle", BiAccessType.READ);
BiPieChartSection.addProperty("endAngle", BiAccessType.READ);
BiPieChartSection.addProperty("radius", BiAccessType.READ);
_p.setStartAngle = function (n) {
    if (this._startAngle != n) {
        this._startAngle = n;
        this._setPath();
    }
};
_p.setEndAngle = function (n) {
    if (this._endAngle != n) {
        this._endAngle = n;
        this._setPath();
    }
};
_p.setRadius = function (n) {
    if (this._radius != n) {
        this._radius = n;
        this._setPath();
    }
};
_p.setExplode = function (n) {
    if (this._explode != n) {
        this._explode = n;
        this._setPath();
    }
};
_p._setPath = function () {
    var sPath;
    if (this._startAngle == this._endAngle) {
        sPath = "M0,0";
    } else {
        var r = this._radius * 500;
        var explode = this.getExplode();
        var centerAngle = Math.PI / 2 - this._startAngle - (this._endAngle - this._startAngle) / 2;
        var startAngle = Math.PI / 2 - this._startAngle;
        var endAngle = Math.PI / 2 - this._endAngle;
        var sweep = (Math.abs(startAngle - endAngle) > Math.PI ? 1 : 0);
        var startX = explode * r * Math.cos(centerAngle);
        var startY = explode * r * Math.sin(centerAngle);
        var startRadX = Math.round(startX + Math.cos(startAngle) * r);
        var startRadY = Math.round(startY + Math.sin(startAngle) * r);
        var endRadX = Math.round(startX + Math.cos(endAngle) * r);
        var endRadY = Math.round(startY + Math.sin(endAngle) * r);
        startX = Math.round(startX);
        startY = Math.round(startY);
        if (startRadX == endRadX && startRadY == endRadY) endRadX = -1;
        sPath = "M" + startX + "," + this._parent.calculateFlippedY(startY) + " L" + startRadX + "," + this._parent.calculateFlippedY(startRadY) + " A" + r + "," + r + " 0 " + sweep + " 1 " + endRadX + "," + this._parent.calculateFlippedY(endRadY) + " L" + startX + "," + this._parent.calculateFlippedY(startY);
    }
    this.setHtmlProperty("d", sPath);
};

function BiSvgFill() {
    if (_biInPrototype) return;
    BiSvgComponent.call(this);
    this._stop1 = BiSvgComponent.newSvgComponent("stop");
    this._stop2 = BiSvgComponent.newSvgComponent("stop");
    this._stop1.setHtmlProperty("offset", "0%");
    this._stop2.setHtmlProperty("offset", "100%");
    this.add(this._stop1);
    this.add(this._stop2);
};
_p = _biExtend(BiSvgFill, BiSvgComponent, "BiSvgFill");
_p._tagName = "linearGradient";
_p._fillOpacity = null;
_p._fillColor2 = null;
_p._fillColor = null;
_p.setFillOpacity = function (n) {
    this._fillOpacity = n;
};
_p.getFillOpacity = function () {
    return this._fillOpacity;
};
_p.hasFillOpacity = function () {
    return this._fillOpacity != null;
};
_p.setFillColor2 = function (s) {
    this._fillColor2 = s;
    this._stop2.setHtmlProperty("stop-color", s);
};
_p.getFillColor2 = function () {
    return this._fillColor2;
};
_p.hasFillColor2 = function () {
    return this._fillColor2 != null;
};
_p.setFillColor = function (s) {
    this._fillColor = s;
    this._stop1.setHtmlProperty("stop-color", s);
};
_p.getFillColor = function () {
    return this._fillColor;
};
_p.hasFillColor = function () {
    return this._fillColor != null;
};
_p.setFillAngle = function (s) {
    this._fillAngle = s;
    var a = s == null ? 270 : 90 - Number(s);
    a %= 360;
    this.setHtmlProperty("gradientTransform", (a > 180 ? "translate(0,1)," : "") + "rotate(" + a + ")");
};
_p.getFillAngle = function () {
    return this._fillAngle;
};
_p.hasFillAngle = function () {
    return this._fillAngle != null;
};

function BiChartArea2(oGraph) {
    if (_biInPrototype) return;
    BiChartAreaBase.call(this, oGraph);
    this._backgroundComponent = new BiComponent;
    this._backgroundComponent.setLocation(0, 0);
    this.setLocation(30, 30);
    this.setRight(30);
    this.setBottom(30);
    this.add(this._backgroundComponent, null, true);
};
_p = _biExtend(BiChartArea2, BiChartAreaBase, "BiChartArea2");
_p.setFillColor = function (s) {
    this._fillColor = s;
    this._backgroundComponent.setBackColor(s);
};
_p.setFillOpacity = function (n) {
    this._fillOpacity = n;
    this._backgroundComponent.setOpacity(n);
};
_p.setStrokeColor = function (s) {
    this._strokeColor = s;
    if (!this._strokeBorder) this._strokeBorder = new BiBorder(1, "solid");
    this._strokeBorder.setWidth(s == "transparent" ? 0 : 1);
    this._strokeBorder.setColor(s);
    this._backgroundComponent.setBorder(this._strokeBorder);
};
BiChartArea2.fromXmlElement = function (oGraph, oNode) {
    var ca = new BiChartArea2(oGraph);
    ca.fromXmlElement(oNode);
    return ca;
};
_p.layoutComponent = function () {
    this._graph._resetScaleFactor();
    BiComponent.prototype.layoutComponent.call(this);
    this._backgroundComponent.setSize(this.getWidth(), this.getHeight());
};

function BiAbstractChart2(oGraph, oSeries) {
    if (_biInPrototype) return;
    if (!oGraph) return;
    BiAbstractChartBase.call(this, oGraph, oSeries);
    this.setLocation(0, 0);
    this.setRight(0);
    this.setBottom(0);
};
_p = _biExtend(BiAbstractChart2, BiAbstractChartBase, "BiAbstractChart2");

function BiAbstractChartSection2(oChart, oCategory) {
    if (_biInPrototype) return;
    if (!oChart) return;
    BiAbstractChartSectionBase.call(this, oChart, oCategory);
    this.setFillColor(this.getFillColor());
    this.setStrokeColor(this.getStrokeColor());
    this.setFillOpacity(this.getFillOpacity());
};
_p = _biExtend(BiAbstractChartSection2, BiAbstractChartSectionBase, "BiAbstractChartSection2");
_p._defaultStrokeBorder = new BiBorder(1, "solid", "black");
_p.setStrokeColor = function (s) {
    this._strokeColor = s;
    if (!this._strokeBorder) this._strokeBorder = new BiBorder(1, "solid");
    this._strokeBorder.setWidth(s == "transparent" ? 0 : 1);
    this._strokeBorder.setColor(s);
    this.setBorder(this._strokeBorder);
};
_p.setFillColor = function (s) {
    this.setBackColor(s);
};
_p.setFillOpacity = function (n) {
    this.setOpacity(n);
};

function BiChartCategoryAxis2(oGraph) {
    if (_biInPrototype) return;
    BiChartCategoryAxisBase.call(this, oGraph);
    this.setLocation(0, 0);
    this.setRight(0);
    this.setBottom(0);
    this._axisLine = new BiComponent;
    this._axisLine.setBackColor("black");
    this.add(this._axisLine);
};
_p = _biExtend(BiChartCategoryAxis2, BiChartCategoryAxisBase, "BiChartCategoryAxis2");
_p._updateAxisLine = function () {
    if (!this.getCreated() || !this._desiredVisible) return;
    var onX = this._graph._getCategoryOnXAxis();
    var ca = this._graph.getChartArea();
    var sf = this._graph._getScaleFactor();
    if (!onX) {
        var minValue = this._graph.getValueAxis().getMinimum();
        this._axisLine.setBounds(ca.getLeft() - minValue * sf, ca.getTop(), 1, ca.getHeight());
    } else {
        var maxVal = this._graph.getValueAxis().getMaximum();
        this._axisLine.setBounds(ca.getLeft(), ca.getTop() + maxVal * sf - 1, ca.getWidth(), 1);
    }
};
_p._updateMajorTicks = BiAccessType.FUNCTION_EMPTY;
_p._updateMinorTicks = BiAccessType.FUNCTION_EMPTY;
_p._createLabels = function () {
    if (!this.getCreated() || !this._desiredVisible) return;
    var l;
    for (var i = this._labels.length - 1; i >= 0; i--) {
        l = this._labels[i];
        this.remove(l);
        l.dispose();
    }
    this._labels = [];
    if (this._showLabels) {
        var major = this._graph._categoryAxis.getMajorTickInterval();
        var catMax = this._graph._categoryAxis.getMaximum();
        var x = this._axisBetweenCategories ? 0.5 : 0;
        var cats = this._graph.getCategories();
        var onX = this._graph._getCategoryOnXAxis();
        while (x <= catMax) {
            l = new BiLabel(cats[Math.floor(x)].getTitle());
            l.setStyleProperty("visibility", "inherit");
            l.setWidth(100);
            l._chartValue = x;
            l.setStyleProperty("fontSize", this._fontSize + "px");
            if (onX) {
                l.setAlign("center");
            } else {
                l.setAlign("right");
            }
            this.add(l);
            this._labels.push(l);
            x += major;
        }
    }
};
_p._layoutLabels = function () {
    if (this.getCreated() && this._showLabels && this._desiredVisible) {
        var l, v;
        var caTop = this._graph.getChartArea().getTop();
        var caHeight = this._graph.getChartArea().getHeight();
        var caLeft = this._graph.getChartArea().getLeft();
        var sf = this._graph._getScaleFactor();
        var csf = this._graph._getCatScaleFactor();
        var onX = this._graph._getCategoryOnXAxis();
        var maxVal = this._graph.getValueAxis().getMaximum();
        var minVal = this._graph.getValueAxis().getMinimum();
        for (var i = 0; i < this._labels.length; i++) {
            l = this._labels[i];
            v = l._chartValue;
            if (onX) {
                l.setLocation(caLeft + v * csf - 50, caTop + maxVal * sf + 3);
            } else {
                l.setLocation(caLeft - minVal * sf - 103, caTop + caHeight - v * csf - l.getHeight() / 2);
            }
        }
    }
};
_p._updateLabels = function () {
    this._createLabels();
    this._layoutLabels();
};
_p.setFontSize = function (n) {
    this._fontSize = n;
    for (var i = 0; i < this._labels.length; i++) this._labels[i].setStyleProperty("fontSize", n + "px");
    this._layoutLabels();
};
_p.setVisible = function (b) {
    this._desiredVisible = b;
    var s = b && this._graph._getSupportsCategoryAxis() ? "inherit" : "hidden";
    this._axisLine.setStyleProperty("visibility", s);
    for (var i = 0; i < this._labels.length; i++) this._labels[i].setStyleProperty("visibility", s);
};
BiChartCategoryAxis2.fromXmlElement = function (oGraph, oNode) {
    var ax = new BiChartCategoryAxis2(oGraph);
    ax.fromXmlElement(oNode);
    return ax;
};
_p.layoutAllChildren = function () {
    BiComponent.prototype.layoutAllChildren.call(this);
    this._layoutLabels();
    this._updateAxisLine();
};

function BiChartValueAxis2(oGraph) {
    if (_biInPrototype) return;
    BiChartValueAxisBase.call(this, oGraph);
    this.setLocation(0, 0);
    this.setRight(0);
    this.setBottom(0);
    this._axisLine = new BiComponent;
    this._axisLine.setBackColor("black");
    this.add(this._axisLine);
};
_p = _biExtend(BiChartValueAxis2, BiChartValueAxisBase, "BiChartValueAxis2");
_p._showMajorTicks = false;
_p._showMinorTicks = false;
_p._updateAxisLine = function () {
    if (!this.getCreated() || !this._desiredVisible) return;
    var onX = this._graph._getCategoryOnXAxis();
    var ca = this._graph.getChartArea();
    if (onX) {
        this._axisLine.setBounds(ca.getLeft(), ca.getTop(), 1, ca.getHeight());
    } else {
        this._axisLine.setBounds(ca.getLeft(), ca.getTop() + ca.getHeight() - 1, ca.getWidth(), 1);
    }
};
_p._updateMajorTicks = BiAccessType.FUNCTION_EMPTY;
_p._updateMinorTicks = BiAccessType.FUNCTION_EMPTY;
_p._createLabels = function () {
    if (!this.getCreated() || !this._desiredVisible) return;
    var l;
    for (var i = this._labels.length - 1; i >= 0; i--) {
        l = this._labels[i];
        this.remove(l);
        l.dispose();
    }
    this._labels = [];
    if (this._showLabels) {
        var min = this.getMinimum();
        var max = this.getMaximum();
        var major = this.getMajorTickInterval();
        var y = min;
        if (y / major % 1 != 0) y = y + (min < 0 ? 0 : major) - y % major;
        var ys;
        var onX = this._graph._getCategoryOnXAxis();
        var percentage = this._graph._getPercentageStack();
        while (y <= max) {
            if (percentage) ys = Math.round(y * 100) + "%";
            else ys = String(y);
            l = new BiLabel(ys);
            l.setStyleProperty("visibility", "inherit");
            l.setWidth(100);
            l._chartValue = y;
            l.setStyleProperty("fontSize", this._fontSize + "px");
            if (onX) {
                l.setAlign("right");
            } else {
                l.setAlign("center");
            }
            this.add(l);
            this._labels.push(l);
            y += major;
            y = Math.round(y / major) * major;
        }
    }
};
_p._layoutLabels = function () {
    if (this.getCreated() && this._showLabels && this._desiredVisible) {
        var onX = this._graph._getCategoryOnXAxis();
        var minVal = this.getMinimum();
        var maxVal = this.getMaximum();
        var sf = this._graph._getScaleFactor();
        var l, v;
        var caTop = this._graph.getChartArea().getTop();
        var caHeight = this._graph.getChartArea().getHeight();
        var caLeft = this._graph.getChartArea().getLeft();
        for (var i = 0; i < this._labels.length; i++) {
            l = this._labels[i];
            v = l._chartValue;
            if (onX) {
                l.setLocation(caLeft - 100 - 3, caTop + (maxVal - v) * sf - l.getHeight() / 2);
            } else {
                l.setLocation(caLeft + (v - minVal) * sf - 50, caTop + caHeight + 3);
            }
        }
    }
};
_p._updateLabels = function () {
    this._createLabels();
    this._layoutLabels();
};
_p.setFontSize = function (n) {
    this._fontSize = n;
    for (var i = 0; i < this._labels.length; i++) this._labels[i].setStyleProperty("fontSize", n + "px");
    this._layoutLabels();
};
_p.setVisible = function (b) {
    this._desiredVisible = b;
    var s = b && this._graph._getSupportsValueAxis() ? "inherit" : "hidden";
    this._axisLine.setStyleProperty("visibility", s);
    for (var i = 0; i < this._labels.length; i++) this._labels[i].setStyleProperty("visibility", s);
};
BiChartValueAxis2.fromXmlElement = function (oGraph, oNode) {
    var ax = new BiChartValueAxis2(oGraph);
    ax.fromXmlElement(oNode);
    return ax;
};
_p.layoutAllChildren = function () {
    BiChartValueAxisBase.prototype.layoutAllChildren.call(this);
    this._layoutLabels();
    this._updateAxisLine();
};

function BiColumnChart2(oGraph, oSeries) {
    if (_biInPrototype) return;
    if (!oGraph) return;
    BiAbstractChart2.call(this, oGraph, oSeries);
    this._rectsByCat = {};
};
_p = _biExtend(BiColumnChart2, BiAbstractChart2, "BiColumnChart2");
_p._isBar = false;
_p._isStacked = false;
_p._isPercentage = false;
_p._barSpacing = 1;
_p.getComponentByCategoryId = function (sCatId) {
    return this._rectsByCat[sCatId];
};
_p._updateChart = function () {
    var cs = this._children;
    var c, i;
    for (i = cs.length - 1; i >= 0; i--) {
        c = cs[i];
        this.remove(c);
        c.dispose();
    }
    var vs = this._series.getValues();
    var l = vs.length;
    var cats = this._graph.getCategories();
    var id;
    var rect;
    for (i = 0; i < l; i++) {
        if (vs[i] != null) {
            id = cats[i].getId();
            rect = new BiColumnChartSection2(this, cats[i]);
            this._rectsByCat[id] = rect;
            this.add(rect);
        }
    }
};
_p.layoutChild = function (c) {
    if (!c._layoutSuspendCount) c._doLayout();
    BiAbstractChart2.prototype.layoutChild.call(this, c);
};
_p.update = function () {
    this._updateChart();
};
_p._updateValues = function () {
    var cats = this._graph.getCategories();
    for (var i = 0; i < cats.length; i++) {
        this._updateValueByCategoryId(cats[i].getId());
    }
};
_p._updateValueByCategoryId = function (sId) {
    this._updateRectByCategoryId(sId);
    if (this._isStacked) {
        var charts = this._graph.getCharts();
        var found = this._graph._getPercentageStack();
        for (var i = 0; i < charts.length; i++) {
            if (!found && charts[i] == this) {
                found = this;
                continue;
            }
            if (found) {
                charts[i]._updateRectByCategoryId(sId);
            }
        }
    }
};
_p._updateRectByCategoryId = function (sId) {
    var rect = this._rectsByCat[sId];
    if (!rect) return;
    rect._doLayout();
};
_p._getRectHeight = function (sCategoryId) {
    return Number(this._series.getValueByCategoryId(sCategoryId));
};
_p._getRectTop = function (sCategoryId) {
    return 0;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiAbstractChart2.prototype.dispose.call(this);
    for (var hc in this._rectsByCat) delete this._rectsByCat[hc];
    this._rectsByCat = null;
};

function BiBarChart2(oGraph, oSeries) {
    if (_biInPrototype) return;
    BiColumnChart2.call(this, oGraph, oSeries);
};
_p = _biExtend(BiBarChart2, BiColumnChart2, "BiBarChart2");
_p._isBar = true;

function BiStackedColumnChart2(oGraph, oSeries) {
    if (_biInPrototype) return;
    BiColumnChart2.call(this, oGraph, oSeries);
};
_p = _biExtend(BiStackedColumnChart2, BiColumnChart2, "BiStackedColumnChart2");
_p._isBar = false;
_p._isStacked = true;
_p._getRectHeight = function (sCategoryId) {
    return Math.abs(this._series.getValueByCategoryId(sCategoryId));
};
_p._getRectTop = function (sCategoryId) {
    var charts = this._graph.getCharts();
    var sum = 0;
    for (var i = 0; i < charts.length; i++) {
        if (charts[i] == this) return sum;
        sum += Math.abs(charts[i]._series.getValueByCategoryId(sCategoryId));
    }
    return sum;
};

function BiStackedBarChart2(oGraph, oSeries) {
    if (_biInPrototype) return;
    BiStackedColumnChart2.call(this, oGraph, oSeries);
};
_p = _biExtend(BiStackedBarChart2, BiStackedColumnChart2, "BiStackedBarChart2");
_p._isBar = true;

function BiPercentageStackedColumnChart2(oGraph, oSeries) {
    if (_biInPrototype) return;
    BiColumnChart2.call(this, oGraph, oSeries);
};
_p = _biExtend(BiPercentageStackedColumnChart2, BiColumnChart2, "BiPercentageStackedColumnChart2");
_p._isBar = false;
_p._isStacked = true;
_p._isPercentage = true;
_p._getRectHeight = function (sCategoryId) {
    var charts = this._graph.getCharts();
    var sum = 0;
    for (var i = 0; i < charts.length; i++) {
        sum += Math.abs(charts[i]._series.getValueByCategoryId(sCategoryId));
    }
    return Math.abs(this._series.getValueByCategoryId(sCategoryId)) / sum;
};
_p._getRectTop = function (sCategoryId) {
    var charts = this._graph.getCharts();
    var sum = 0;
    var y;
    for (var i = 0; i < charts.length; i++) {
        if (charts[i] == this) y = sum;
        sum += Math.abs(charts[i]._series.getValueByCategoryId(sCategoryId));
    }
    return y / sum;
};

function BiPercentageStackedBarChart2(oGraph, oSeries) {
    if (_biInPrototype) return;
    BiPercentageStackedColumnChart2.call(this, oGraph, oSeries);
};
_p = _biExtend(BiPercentageStackedBarChart2, BiPercentageStackedColumnChart2, "BiPercentageStackedBarChart2");
_p._isBar = true;

function BiColumnChartSection2(oChart, oCategory) {
    if (_biInPrototype) return;
    BiAbstractChartSection2.call(this, oChart, oCategory);
}
_p = _biExtend(BiColumnChartSection2, BiAbstractChartSection2, "BiColumnChartSection2");
_p._layoutSuspendCount = 0;
_p._doLayout = function () {
    this._layoutSuspendCount++;
    var chartCount = this._graph.getCharts().length;
    var chartIndex = this._series.getIndex();
    var chart = this._chart;
    var bs = chart.getBarSpacing();
    var stacked = chart._isStacked;
    var w = stacked ? 1 / (1 + bs) : 1 / (chartCount + bs);
    var dx = bs * w / 2 + (stacked ? 0 : chartIndex * w) - (this._graph._categoryAxis.getAxisBetweenCategories() ? 0 : 0.5);
    var i = this._category.getIndex();
    var id = this._categoryId;
    var sf = this._graph._getScaleFactor();
    var csf = this._graph._getCatScaleFactor();
    var minVal = this._graph._valueAxis.getMinimum();
    var maxVal = this._graph._valueAxis.getMaximum();
    var h = chart._getRectHeight(id);
    var t = chart._getRectTop(id);
    var hsf, mtsf;
    if (chart._isBar) {
        var catCount = this._graph.getCategories().length;
        hsf = Math.round(h * sf);
        mtsf = (t - minVal) * sf;
        if (h >= 0) {
            this.setBounds(mtsf, csf * (catCount - 1 - i + dx), hsf, csf * w);
        } else {
            this.setBounds(mtsf + hsf + 1, csf * (catCount - 1 - i + dx), -hsf, csf * w);
        }
    } else {
        hsf = Math.round(h * sf);
        mtsf = Math.round((maxVal - t) * sf);
        if (h >= 0) {
            this.setBounds(csf * (i + dx), mtsf - hsf, csf * w, hsf);
        } else {
            this.setBounds(csf * (i + dx), mtsf - 1, csf * w, -hsf);
        }
    }
    this._layoutSuspendCount--;
};

function BiChartGridLines2(oGraph) {
    if (_biInPrototype) return;
    BiChartGridLinesBase.call(this, oGraph);
    this.setLocation(0, 0);
    this.setRight(0);
    this.setBottom(0);
    this._minorCategoryLines = [];
    this._minorValueLines = [];
    this._majorCategoryLines = [];
    this._majorValueLines = [];
};
_p = _biExtend(BiChartGridLines2, BiChartGridLinesBase, "BiChartGridLines2");
_p.setMinorCategoryStrokeColor = function (s) {
    this._minorCategoryStrokeColor = s;
    for (var i = 0; i < this._minorCategoryLines.length; i++) this._minorCategoryLines[i].setBackColor(s);
};
_p.setMajorCategoryStrokeColor = function (s) {
    this._majorCategoryStrokeColor = s;
    for (var i = 0; i < this._majorCategoryLines.length; i++) this._majorCategoryLines[i].setBackColor(s);
};
_p.setMinorValueStrokeColor = function (s) {
    this._minorValueStrokeColor = s;
    for (var i = 0; i < this._minorValueLines.length; i++) this._minorValueLines[i].setBackColor(s);
};
_p.setMajorValueStrokeColor = function (s) {
    this._majorValueStrokeColor = s;
    for (var i = 0; i < this._majorValueLines.length; i++) this._majorValueLines[i].setBackColor(s);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiChartGridLinesBase.prototype.dispose.call(this);
    var i;
    for (i = this._majorValueLines.length - 1; i >= 0; i--) {
        this._majorValueLines[i].dispose();
        this._majorValueLines[i] = null;
    }
    for (i = this._minorValueLines.length - 1; i >= 0; i--) {
        this._minorValueLines[i].dispose();
        this._minorValueLines[i] = null;
    }
    for (i = this._majorCategoryLines.length - 1; i >= 0; i--) {
        this._majorCategoryLines[i].dispose();
        this._majorCategoryLines[i] = null;
    }
    for (i = this._minorCategoryLines.length - 1; i >= 0; i--) {
        this._minorCategoryLines[i].dispose();
        this._minorCategoryLines[i] = null;
    }
    this._minorValueLines = null;
    this._majorValueLines = null;
    this._minorCategoryLines = null;
    this._majorCategoryLines = null;
};
_p._createValueLines = function (oLines, bShow, nInterval, sColor) {
    if (!this.getCreated()) return;
    for (var i = oLines.length - 1; i >= 0; i--) {
        this.remove(oLines[i]);
        oLines[i].dispose();
        oLines[i] = null;
    }
    oLines.length = 0;
    if (bShow) {
        var min = this._graph._valueAxis.getMinimum();
        var max = this._graph._valueAxis.getMaximum();
        var onX = this._graph._getCategoryOnXAxis();
        var y = min;
        if (y % nInterval != 0) y = y + (min < 0 ? 0 : nInterval) - y % nInterval;
        var l;
        while (y <= max) {
            l = new BiComponent;
            l.setBackColor(sColor);
            l._chartValue = y;
            if (onX) {
                l.setLeft(0);
                l.setHeight(1);
            } else {
                l.setTop(0);
                l.setWidth(1);
            }
            this.add(l);
            oLines.push(l);
            y += nInterval;
        }
    }
};
_p._createCategoryLines = function (oLines, bShow, nInterval, sColor) {
    if (!this.getCreated()) return;
    for (var i = oLines.length - 1; i >= 0; i--) {
        this.remove(oLines[i]);
        oLines[i].dispose();
        oLines[i] = null;
    }
    oLines.length = 0;
    if (bShow) {
        var catMax = this._graph._categoryAxis.getMaximum();
        var onX = this._graph._getCategoryOnXAxis();
        var x = nInterval;
        var l;
        while (x <= catMax) {
            l = new BiComponent;
            l.setBackColor(sColor);
            l._chartValue = x;
            if (!onX) {
                l.setLeft(0);
                l.setHeight(1);
            } else {
                l.setTop(0);
                l.setWidth(1);
            }
            this.add(l);
            oLines.push(l);
            x += nInterval;
        }
    }
};
_p._layoutValueLines = function (oLines) {
    var minVal = this._graph._valueAxis.getMinimum();
    var maxVal = this._graph._valueAxis.getMaximum();
    var sf = this._graph._getScaleFactor();
    var onX = this._graph._getCategoryOnXAxis();
    var l, y;
    var caHeight = this._graph.getChartArea().getHeight();
    var caWidth = this._graph.getChartArea().getWidth();
    for (var i = 0; i < oLines.length; i++) {
        l = oLines[i];
        y = l._chartValue;
        if (onX) {
            l.setTop(Math.max((maxVal - y) * sf - 1, 0));
            l.setWidth(caWidth);
        } else {
            l.setLeft(Math.min((y - minVal) * sf, caWidth - 1));
            l.setHeight(caHeight);
        }
    }
};
_p._layoutCategoryLines = function (oLines) {
    var catMax = this._graph._categoryAxis.getMaximum();
    var onX = this._graph._getCategoryOnXAxis();
    var csf = this._graph._getCatScaleFactor();
    var l, x;
    var caHeight = this._graph.getChartArea().getHeight();
    var caWidth = this._graph.getChartArea().getWidth();
    for (var i = 0; i < oLines.length; i++) {
        l = oLines[i];
        x = l._chartValue;
        if (onX) {
            l.setLeft(Math.min(x * csf, caWidth - 1));
            l.setHeight(caHeight);
        } else {
            l.setTop(Math.max((catMax - x) * csf - 1, 0));
            l.setWidth(caWidth);
        }
    }
};
_p._createMajorValueLines = function () {
    this._createValueLines(this._majorValueLines, this.getShowMajorValue(), this._graph._valueAxis.getMajorTickInterval(), this.getMajorValueStrokeColor());
};
_p._layoutMajorValueLines = function () {
    if (this.getCreated() && this.getShowMajorValue()) this._layoutValueLines(this._majorValueLines);
};
_p._updateMajorValue = function () {
    this._createMajorValueLines();
    this._layoutMajorValueLines();
};
_p._createMinorValueLines = function () {
    this._createValueLines(this._minorValueLines, this.getShowMinorValue(), this._graph._valueAxis.getMinorTickInterval(), this.getMinorValueStrokeColor());
};
_p._layoutMinorValueLines = function () {
    if (this.getCreated() && this.getShowMinorValue()) this._layoutValueLines(this._minorValueLines);
};
_p._updateMinorValue = function () {
    this._createMinorValueLines();
    this._layoutMinorValueLines();
};
_p._createMajorCategoryLines = function () {
    this._createCategoryLines(this._majorCategoryLines, this.getShowMajorCategory(), this._graph._categoryAxis.getMajorTickInterval(), this.getMajorCategoryStrokeColor());
};
_p._layoutMajorCategoryLines = function () {
    if (this.getCreated() && this.getShowMajorCategory()) this._layoutCategoryLines(this._majorCategoryLines);
};
_p._updateMajorCategory = function () {
    this._createMajorCategoryLines();
    this._layoutMajorCategoryLines();
};
_p._createMinorCategoryLines = function () {
    this._createCategoryLines(this._minorCategoryLines, this.getShowMinorCategory(), this._graph._categoryAxis.getMinorTickInterval(), this.getMinorCategoryStrokeColor());
};
_p._layoutMinorCategoryLines = function () {
    if (this.getCreated() && this.getShowMinorCategory()) this._layoutCategoryLines(this._minorCategoryLines);
};
_p._updateMinorCategory = function () {
    this._createMinorCategoryLines();
    this._layoutMinorCategoryLines();
};
_p.layoutAllChildren = function () {
    BiComponent.prototype.layoutAllChildren.call(this);
    this._layoutMinorCategoryLines();
    this._layoutMajorCategoryLines();
    this._layoutMinorValueLines();
    this._layoutMajorValueLines();
};

function BiGraph2() {
    if (_biInPrototype) return;
    BiGraphBase.call(this);
    this._chartArea = new BiChartArea2(this);
    this._valueAxis = new BiChartValueAxis2(this);
    this._categoryAxis = new BiChartCategoryAxis2(this);
    this._gridLines = new BiChartGridLines2(this);
    this._legend = new BiChartLegend(this);
    this.add(this._chartArea);
    this._chartArea.add(this._gridLines);
    this.add(this._valueAxis);
    this.add(this._categoryAxis);
    this.add(this._legend);
};
_p = _biExtend(BiGraph2, BiGraphBase, "BiGraph2");
_p._scaleChartArea = function () {
    if (this._autoScale) {
        var cw = this.getClientWidth();
        var ch = this.getClientHeight();
        this._chartArea.setRight(null);
        this._chartArea.setBottom(null);
        this._chartArea.setSize(this._chartAreaWidth / 1000 * cw, this._chartAreaHeight / 1000 * ch);
        this._chartArea.setLocation(this._chartAreaLeft / 1000 * cw, this._chartAreaTop / 1000 * ch);
    } else {
        this._chartArea.setLocation(30, 30);
        this._chartArea.setRight(30);
        this._chartArea.setBottom(30);
    }
};
_p.setAutoScale = function (b) {
    if (this._autoScale != b) {
        this._autoScale = b;
        this._scaleChartArea();
        if (!b) this.setFontSize(11);
        if (this.getCreated()) this.update();
    }
};
_p.layoutAllChildren = function () {
    if (this._autoScale) this._scaleChartArea();
    this._scaleFont();
    BiGraphBase.prototype.layoutAllChildren.call(this);
};
_p._createChartFromSeries = function (oSeries) {
    var c;
    switch (this._chartType) {
    case "bar":
        c = new BiBarChart2(this, oSeries);
        break;
    case "stackedbar":
        c = new BiStackedBarChart2(this, oSeries);
        break;
    case "percentagestackedbar":
        c = new BiPercentageStackedBarChart2(this, oSeries);
        break;
    case "column":
        c = new BiColumnChart2(this, oSeries);
        break;
    case "stackedcolumn":
        c = new BiStackedColumnChart2(this, oSeries);
        break;
    case "percentagestackedcolumn":
        c = new BiPercentageStackedColumnChart2(this, oSeries);
        break;
    default:
        throw new Error("Chart type \"" + this._chartType + "\" is not supported");
        break;
    }
    this._charts[oSeries.getId()] = c;
    this._chartArea.add(c);
};
_p.update = function () {
    this._syncChartForSeries();
    if (this.getChartType() != "grid") {
        this._valueAxis._clearCache();
        this.layoutAllChildren();
        this._valueAxis._updateVisible();
        this._valueAxis._createLabels();
        this._valueAxis.layoutAllChildren();
        this._categoryAxis._updateVisible();
        this._categoryAxis._createLabels();
        this._categoryAxis.layoutAllChildren();
        this._updateCharts();
        this._legend._update();
        this._gridLines._createMinorCategoryLines();
        this._gridLines._createMajorCategoryLines();
        this._gridLines._createMinorValueLines();
        this._gridLines._createMajorValueLines();
        this._gridLines.layoutAllChildren();
    } else this._gridComponent.update();
};
BiGraph2.fromXmlDocument = function (oDoc) {
    var g = new BiGraph2;
    g.fromXmlDocument(oDoc);
    return g;
};
BiGraph2.fromUri = function (sUri) {
    var g = new BiGraph2;
    var xmlLoader = new BiXmlLoader;
    xmlLoader.setAsync(false);
    xmlLoader.load(sUri);
    g.fromXmlDocument(xmlLoader.getDocument());
    xmlLoader.dispose();
    return g;
};
_p._getScaleFactor = function () {
    if (this._scaleFactor != null) return this._scaleFactor;
    this._updateScaleFactor();
    return this._scaleFactor;
};
_p._getCatScaleFactor = function () {
    if (this._catScaleFactor != null) return this._catScaleFactor;
    this._updateScaleFactor();
    return this._catScaleFactor;
};
_p._updateScaleFactor = function () {
    var ca = this.getChartArea();
    var cw = ca.getClientWidth();
    var ch = ca.getClientHeight();
    if (this._getCategoryOnXAxis()) {
        this._scaleFactor = ch / (this._valueAxis.getMaximum() - this._valueAxis.getMinimum());
        this._catScaleFactor = cw / this._categoryAxis.getMaximum();
    } else {
        this._scaleFactor = cw / (this._valueAxis.getMaximum() - this._valueAxis.getMinimum());
        this._catScaleFactor = ch / this._categoryAxis.getMaximum();
    }
};
_p._resetScaleFactor = function () {
    this._scaleFactor = null;
    this._catScaleFactor = null;
};