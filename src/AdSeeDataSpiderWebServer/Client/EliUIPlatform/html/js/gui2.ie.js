/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiGauge() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._rangeModel = new BiRangeModel();
    this.setHtmlProperty("coordsize", "1000 1000");
    this._rangeModel.addEventListener("change", this._onchange, this);
    this.setCursor("default");
    this._sections = [];
    this._minorTicks = new BiGaugeMinorTicks(this);
    this._majorTicks = new BiGaugeMajorTicks(this);
    this._plate = new BiGaugePlate(this);
    this._warningSection = new BiGaugeSection(this, 90, 100);
    this._needle = new BiGaugeNeedle(this);
    this._labels = new BiGaugeLabels(this);
    this._title = new BiGaugeTitle(this);
    this._warningSection.setOpacity(0.75);
    this.add(this._plate);
    this.add(this._warningSection);
    this.add(this._minorTicks);
    this.add(this._majorTicks);
    this.add(this._labels);
    this.add(this._title);
    this.add(this._needle);
}
_p = _biExtend(BiGauge, BiComponent, "BiGauge");
_p._minimumAngle = -135;
_p._maximumAngle = 135;
_p._majorTickInterval = 10;
_p._minorTickInterval = 1;
_p._labelInterval = 20;
_p._warningValue = 90;
_p._tagName = "v:group";
_p._showLabels = true;
_p._showMajorTicks = true;
_p._showMinorTicks = true;
_p._showWarningSection = true;
_p._showTitle = false;
BiGauge._addNs = function (d) {
    if (!d) d = document;
    if (!d.namespaces["v"]) {
        d.namespaces.add("v", "urn:schemas-microsoft-com:vml");
    }
};
_p.add = function (oChild, oBefore) {
    BiComponent.prototype.add.call(this, oChild, oBefore);
    if (oChild instanceof BiGaugeSection) {
        if (oBefore instanceof BiGaugeSection) this._sections.insertBefore(oChild, oBefore);
        else this._sections.push(oChild);
    }
};
_p.remove = function (oChild) {
    BiComponent.prototype.remove.call(this, oChild);
    if (oChild instanceof BiGaugeSection) this._sections.remove(oChild);
    return oChild;
};
BiGauge.addProperty("sections", BiAccessType.READ);
BiGauge.addProperty("plate", BiAccessType.READ);
BiGauge.addProperty("minorTicks", BiAccessType.READ);
BiGauge.addProperty("majorTicks", BiAccessType.READ);
BiGauge.addProperty("needle", BiAccessType.READ);
BiGauge.addProperty("title", BiAccessType.READ);
BiGauge.addProperty("labels", BiAccessType.READ);
_p.setPlate = function (oPlate) {
    this.add(oPlate, this._plate);
    this._plate = oPlate;
};
_p.setMinorTicks = function (oTicks) {
    this.add(oTicks, this._minorTicks);
    this._minorTicks = oTicks;
};
_p.setMajorTicks = function (oTicks) {
    this.add(oTicks, this._majorTicks);
    this._majorTicks = oTicks;
};
_p.setNeedle = function (oNeedle) {
    this.add(oNeedle, this._needle);
    this._needle = oNeedle;
};
_p.setWarningSection = function (oSection) {
    this.add(oSection, this._warningSextion);
    this._warningSection = oSection;
};
_p.setTitle = function (oTitle) {
    this.add(oTitle, this._title);
    this._title = oTitle;
};
_p.setLabels = function (oLabels) {
    this.add(oLabels, this._labels);
    this._labels = oLabels;
};
_p.setValue = function (nValue) {
    this._rangeModel.setValue(nValue);
};
_p.getValue = function () {
    return this._rangeModel.getValue();
};
_p.setMaximum = function (nMaximum) {
    this._rangeModel.setMaximum(nMaximum);
    if (this._warningSection) this._warningSection.setEndValue(nMaximum);
    this._updateAll();
};
_p.getMaximum = function () {
    return this._rangeModel.getMaximum();
};
_p.setMinimum = function (nMinimum) {
    this._rangeModel.setMinimum(nMinimum);
    this._updateAll();
};
_p.getMinimum = function () {
    return this._rangeModel.getMinimum();
};
_p.setWarningValue = function (n) {
    if (this._warningValue != n) {
        this._warningValue = n;
        if (this._warningValue) this._warningSection.setStartValue(n);
    }
};
BiGauge.addProperty("warningValue", BiAccessType.READ);
_p.setShowLabels = function (b) {
    if (this._showLabels != b) {
        this._showLabels = b;
        this._labels.setVisible(b);
    }
};
BiGauge.addProperty("showLabels", BiAccessType.READ);
_p.setShowTitle = function (b) {
    this._showTitle = b;
    this._title.setVisible(b);
};
BiGauge.addProperty("showTitle", BiAccessType.READ);
_p.setShowMajorTicks = function (b) {
    this._showMajorTicks = b;
    this._majorTicks.setVisible(b);
};
BiGauge.addProperty("showMajorTicks", BiAccessType.READ);
_p.setShowMinorTicks = function (b) {
    if (this._showMinorTicks != b) {
        this._showMinorTicks = b;
        this._minorTicks.setVisible(b);
    }
};
BiGauge.addProperty("showMinorTicks", BiAccessType.READ);
_p.setShowWarningSection = function (b) {
    if (this._showWarningSection != b) {
        this._showWarningSection = b;
        if (this._warningSection) this._warningSection.setVisible(b);
    }
};
BiGauge.addProperty("showWarningSection", BiAccessType.READ);
_p.setLabelInterval = function (n) {
    if (this._labelInterval != n) {
        this._labelInterval = n;
        this._labels._update();
    }
};
BiGauge.addProperty("labelInterval", BiAccessType.READ);
_p.setMajorTickInterval = function (n) {
    if (this._majorTickInterval != n) {
        this._majorTickInterval = n;
        this._majorTicks._update();
    }
};
BiGauge.addProperty("majorTickInterval", BiAccessType.READ);
_p.setMinorTickInterval = function (n) {
    if (this._minorTickInterval != n) {
        this._minorTickInterval = n;
        this._minorTicks._update();
    }
};
BiGauge.addProperty("minorTickInterval", BiAccessType.READ);
_p.setMinimumAngle = function (n) {
    if (this._minimumAngle != n) {
        this._minimumAngle = n;
        this._updateAll();
    }
};
BiGauge.addProperty("minimumAngle", BiAccessType.READ);
_p.setMaximumAngle = function (n) {
    if (this._maximumAngle != n) {
        this._maximumAngle = n;
        this._updateAll();
    }
};
BiGauge.addProperty("maximumAngle", BiAccessType.READ);
_p._updateAll = function () {
    this._labels._update();
    this._majorTicks._update();
    this._minorTicks._update();
    this._positionNeedle();
    this._positionSections();
};
_p._positionNeedle = function () {
    this._needle.setValue(this.getValue());
};
_p._positionSections = function () {
    var s;
    for (var i = 0; i < this._sections.length; i++) {
        s = this._sections[i];
        s.setStartValue(s.getStartValue());
        s.setEndValue(s.getEndValue());
    }
};
_p._valueToAngle = function (n) {
    return (n - this.getMinimum()) / (this.getMaximum() - this.getMinimum()) * (this._maximumAngle - this._minimumAngle) + this._minimumAngle;
};
_p._getTickPath = function (nValue, r1, r2) {
    var v = this._valueToAngle(nValue);
    var vr = v / 180 * Math.PI;
    var x1 = r1 * Math.sin(vr);
    var y1 = r1 * Math.cos(vr);
    var x2 = r2 * Math.sin(vr);
    var y2 = r2 * Math.cos(vr);
    x1 = Math.round(500 + x1);
    y1 = Math.round(500 - y1);
    x2 = Math.round(500 + x2);
    y2 = Math.round(500 - y2);
    return "m" + x1 + "," + y1 + "l" + x2 + "," + y2;
};
_p._create = function (d) {
    BiGauge._addNs(d);
    BiComponent.prototype._create.call(this, d);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._sections = null;
    this._plate = null;
    this._needle = null;
    this._majorTicks = null;
    this._minorTicks = null;
    this._labels = null;
};
_p._onchange = function (e) {
    this._positionNeedle();
};

function BiGaugeSection(oGauge, nStart, nEnd) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._gauge = oGauge;
    this.setZIndex(0);
    var r = 425;
    this.setSize(r * 2, r * 2);
    this.setLocation(500 - r, 500 - r);
    this.setColor("red");
    this.setStartValue(typeof nStart == "number" ? nStart : 90);
    this.setEndValue(typeof nEnd == "number" ? nEnd : 100);
    this.setHtmlProperty("filled", false);
    this._stroke = new BiComponent;
    this._stroke._tagName = "v:stroke";
    this.add(this._stroke);
}
_p = _biExtend(BiGaugeSection, BiComponent, "BiGaugeSection");
_p._tagName = "v:arc";
_p._startValue = 90;
_p._endValue = 100;
_p._color = null;
_p.setColor = function (sColor) {
    this._color = sColor;
    this.setHtmlProperty("strokecolor", sColor);
};
BiGaugeSection.addProperty("color", BiAccessType.READ);
_p.setStartValue = function (n) {
    this._startValue = n;
    var g = this.getGauge();
    n = Math.min(g.getMaximum(), Math.max(g.getMinimum(), n));
    this.setHtmlProperty("startangle", g._valueToAngle(n));
};
_p.setEndValue = function (n) {
    this._endValue = n;
    var g = this.getGauge();
    n = Math.min(g.getMaximum(), Math.max(g.getMinimum(), n));
    this.setHtmlProperty("endangle", g._valueToAngle(n));
};
BiGaugeSection.addProperty("startValue", BiAccessType.READ);
BiGaugeSection.addProperty("endValue", BiAccessType.READ);
BiGaugeSection.addProperty("gauge", BiAccessType.READ);
_p.layoutComponent = function () {
    BiComponent.prototype.layoutComponent.call(this);
    this._resizeNonScalable();
};
_p._resizeNonScalable = function () {
    if (!this.getCreated()) return;
    var cw = this.getGauge().getClientWidth();
    var ch = this.getGauge().getClientHeight();
    var s = Math.min(cw, ch);
    try {
        this._element.stroke.weight = s / 45;
    } catch (ex) {
        this.setHtmlProperty("strokeweight", s / 45);
    }
};
_p.setOpacity = function (n) {
    this._opacity = n;
    this._stroke.setHtmlProperty("opacity", n);
};

function BiGaugePlate(oGauge) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._gauge = oGauge;
    this.setZIndex(0);
    this.setLocation(3, 3);
    this.setSize(994, 994);
    this.setStrokeColor("windowtext");
    this.setFillColor("window");
};
_p = _biExtend(BiGaugePlate, BiComponent, "BiGaugePlate");
_p._tagName = "v:oval";
BiGaugePlate.addProperty("gauge", BiAccessType.READ);
_p.layoutComponent = function () {
    BiComponent.prototype.layoutComponent.call(this);
    this._resizeNonScalable();
};
_p._resizeNonScalable = function () {
    if (!this.getCreated()) return;
    var cw = this.getGauge().getClientWidth();
    var ch = this.getGauge().getClientHeight();
    var s = Math.min(cw, ch);
    this.setHtmlProperty("strokeweight", s / 200);
};
BiGaugePlate.addProperty("fillColor", BiAccessType.READ);
_p.setFillColor = function (s) {
    this._fillColor = s;
    this.setHtmlProperty("fillcolor", s);
};
BiGaugePlate.addProperty("strokeColor", BiAccessType.READ);
_p.setStrokeColor = function (s) {
    this._strokeColor = s;
    this.setHtmlProperty("strokecolor", s);
};

function BiGaugeNeedle(oGauge) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._gauge = oGauge;
    this.setHtmlProperty("coordsize", "1000,1000");
    this.setHtmlProperty("coordorigin", "0,0");
    this.setLocation(0, 0);
    this.setSize(1000, 1000);
    this.setZIndex(3);
    this._needle = new BiComponent;
    this._needle._tagName = "v:polyline";
    this.add(this._needle);
    this._knob = new BiComponent;
    this._knob._tagName = "v:oval";
    this._knob.setLocation(460, 460);
    this._knob.setSize(80, 80);
    this.add(this._knob);
    this.setStrokeColor("windowtext");
    this.setFillColor("windowtext");
    this.setValue(0);
};
_p = _biExtend(BiGaugeNeedle, BiComponent, "BiGaugeNeedle");
_p._value = 0;
BiGaugeNeedle.addProperty("value", BiAccessType.READ);
_p.setValue = function (n) {
    this._value = n;
    var v = this.getGauge()._valueToAngle(n);
    var vr = v / 180 * Math.PI;
    var r = 330;
    var r2 = 20;
    var p1x = r * Math.sin(vr);
    var p1y = r * Math.cos(vr);
    var p2x = r2 * Math.cos(vr);
    var p2y = -r2 * Math.sin(vr);
    var p3x = -p2x;
    var p3y = -p2y;
    p1x = 500 + p1x;
    p1y = 500 - p1y;
    p2x = 500 + p2x;
    p2y = 500 - p2y;
    p3x = 500 + p3x;
    p3y = 500 - p3y;
    var pointsValue = p3x + "," + p3y + " " + p1x + "," + p1y + " " + p2x + "," + p2y + " " + p3x + "," + p3y;
    try {
        this._needle._element.points.value = pointsValue;
    } catch (ex) {
        this._needle.setHtmlProperty("points", pointsValue);
    }
    this._knob.setLocation(460, 460);
    this._knob.setSize(80, 80);
};
BiGaugeNeedle.addProperty("gauge", BiAccessType.READ);
BiGaugeNeedle.addProperty("fillColor", BiAccessType.READ);
_p.setFillColor = function (s) {
    this._fillColor = s;
    this._needle.setHtmlProperty("fillcolor", s);
    this._knob.setHtmlProperty("fillcolor", s);
};
BiGaugeNeedle.addProperty("strokeColor", BiAccessType.READ);
_p.setStrokeColor = function (s) {
    this._strokeColor = s;
    this._needle.setHtmlProperty("strokecolor", s);
    this._knob.setHtmlProperty("strokecolor", s);
};

function BiGaugeMinorTicks(oGauge) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._gauge = oGauge;
    this.setZIndex(1);
    this.setHtmlProperty("strokeweight", 1);
    this.setHtmlProperty("strokecolor", "windowtext");
    this.setVisible(oGauge.getShowMinorTicks());
    this.setLocation(0, 0);
    this.setSize(1000, 1000);
    this._update();
};
_p = _biExtend(BiGaugeMinorTicks, BiComponent, "BiGaugeMinorTicks");
_p._tagName = "v:shape";
BiGaugeMinorTicks.addProperty("gauge", BiAccessType.READ);
_p._update = function () {
    var g = this.getGauge();
    var max = g.getMaximum();
    var min = g.getMinimum();
    var minTick = g.getMinorTickInterval();
    var majTick = g.getMajorTickInterval();
    var sb = [];
    for (var i = min + 1; i < max; i++) {
        if (i % minTick == 0 && i % majTick != 0) {
            sb.push(g._getTickPath(i, 440, 435));
        }
    }
    sb.push("e");
    this.setHtmlProperty("path", sb.join(BiString.EMPTY));
};
_p.layoutComponent = function () {
    BiComponent.prototype.layoutComponent.call(this);
    this._resizeNonScalable();
};
_p._resizeNonScalable = function () {
    if (!this.getCreated()) return;
    var cw = this.getGauge().getClientWidth();
    var ch = this.getGauge().getClientHeight();
    var s = Math.min(cw, ch);
    this.setHtmlProperty("strokeweight", s / 300);
};

function BiGaugeMajorTicks(oGauge) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._gauge = oGauge;
    this.setZIndex(2);
    this.setHtmlProperty("strokeweight", 1);
    this.setHtmlProperty("strokecolor", "windowtext");
    this.setVisible(oGauge.getShowMajorTicks());
    this.setLocation(0, 0);
    this.setSize(1000, 1000);
    this._update();
};
_p = _biExtend(BiGaugeMajorTicks, BiComponent, "BiGaugeMajorTicks");
_p._tagName = "v:shape";
BiGaugeMajorTicks.addProperty("gauge", BiAccessType.READ);
_p._update = function () {
    var g = this.getGauge();
    var max = g.getMaximum();
    var min = g.getMinimum();
    var majTick = g.getMajorTickInterval();
    var sb = [];
    sb.push(g._getTickPath(min, 440, 410));
    for (var i = min + 1; i < max; i++) {
        if (i % majTick == 0) {
            sb.push(g._getTickPath(i, 440, 410));
        }
    }
    sb.push(g._getTickPath(max, 440, 410), "e");
    this.setHtmlProperty("path", sb.join(BiString.EMPTY));
};
_p.layoutComponent = function () {
    BiComponent.prototype.layoutComponent.call(this);
    this._resizeNonScalable();
};
_p._resizeNonScalable = function () {
    if (!this.getCreated()) return;
    var cw = this.getGauge().getClientWidth();
    var ch = this.getGauge().getClientHeight();
    var s = Math.min(cw, ch);
    this.setHtmlProperty("strokeweight", s / 200);
};

function BiGaugeLabels(oGauge) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._gauge = oGauge;
    this.setLocation(0, 0);
    this.setRight(0);
    this.setBottom(0);
}
_p = _biExtend(BiGaugeLabels, BiComponent, "BiGaugeLabels");
BiGaugeLabels.addProperty("gauge", BiAccessType.READ);
_p.layoutComponent = function () {
    BiComponent.prototype.layoutComponent.call(this);
    this._resizeNonScalable();
};
_p._resizeNonScalable = function () {
    if (!this.getCreated()) return;
    var g = this.getGauge();
    var cw = g.getClientWidth();
    var ch = g.getClientHeight();
    var s = Math.min(cw, ch);
    for (var i = 0; i < this._labels.length; i++) this._labels[i].style.fontSize = s / 22 + "px";
};
_p._createLabels = function () {
    var g = this.getGauge();
    var labels = [];
    labels[0] = this._createLabel(g.getMinimum());
    for (var i = g.getMinimum() + 1; i < g.getMaximum(); i++) {
        if (i % g.getLabelInterval() == 0) labels.push(this._createLabel(i));
    }
    labels.push(this._createLabel(g.getMaximum(), true));
    this._labels = labels;
};
_p._createLabel = function (nValue) {
    var g = this.getGauge();
    var v = g._valueToAngle(nValue);
    var vr = v / 180 * Math.PI;
    var r = 365;
    var el = this._document.createElement("v:shape");
    var x = r * Math.sin(vr);
    var y = r * Math.cos(vr);
    x = 500 + x;
    y = 500 - y;
    el.style.left = Math.max(0, x - 50);
    el.style.top = Math.max(0, y - 25);
    el.style.width = 100;
    el.style.height = 50;
    el.style.textAlign = "center";
    this._element.appendChild(el);
    el.innerText = nValue;
    return el;
};
_p._removeLabels = function () {
    if (!this.getCreated()) return;
    for (var i = 0; i < this._labels.length; i++) {
        this._element.removeChild(this._labels[i]);
        this._labels[i] = null;
    }
    this._labels = [];
};
_p._create = function (d) {
    BiComponent.prototype._create.call(this, d);
    this._createLabels();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    if (this._labels) {
        for (var i = 0; i < this._labels.length; i++) this._labels[i] = null;
        this._labels = null;
    }
};
_p._update = function () {
    if (this.getCreated()) {
        this._removeLabels();
        this._createLabels();
        this._resizeNonScalable();
    }
};

function BiGaugeTitle(oGauge, sText) {
    if (_biInPrototype) return;
    BiLabel.call(this, sText);
    this._gauge = oGauge;
    this.setZIndex(1);
    this.setVisible(oGauge.getShowTitle());
};
_p = _biExtend(BiGaugeTitle, BiLabel, "BiGaugeTitle");
BiGaugeTitle.addProperty("gauge", BiAccessType.READ);
_p.layoutComponent = function () {
    this._resizeNonScalable();
    BiComponent.prototype.layoutComponent.call(this);
};
_p._resizeNonScalable = function () {
    if (!this.getCreated() || "_inResizeNonScalable" in this) return;
    this._inResizeNonScalable = true;
    var cw = this.getGauge().getClientWidth();
    var ch = this.getGauge().getClientHeight();
    var s = Math.min(cw, ch);
    var f = this.getFont();
    f.setSize(s / 22);
    this.setFont(f);
    var w = this.getWidth();
    this.setLocation((cw - w) / 2, ch * 0.70);
    delete this._inResizeNonScalable;
};

function BiMenuManager() {
    if (BiMenuManager._singleton) return BiMenuManager._singleton;
    BiMenuManager._singleton = this;
    BiObject.call(this);
}
_p = _biExtend(BiMenuManager, BiObject, "BiMenuManager");
BiMenuManager.addProperty("currentMenuButton", BiAccessType.READ);
_p.setCurrentMenuButton = function (oMenuButton) {
    var btn = this._currentMenuButton;
    if (btn == oMenuButton) return;
    this._currentMenuButton = oMenuButton;
    if (btn) btn._deactivate();
};

function BiMenu() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this.addEventListener("mousedown", this._handleMouseDown);
    this._children = [];
    this._actOnMouseUp = true;
    new BiAsyncTaskQueue().addTask(this, this._createPopup);
}
_p = _biExtend(BiMenu, BiEventTarget, "BiMenu");
_p._popupCreated = false;
BiMenu.SCROLL_DISTANCE = 5;
BiMenu.SCROLL_INTERVAL = 30;
_p._desiredTop = 0;
_p.__p_isPopupAncestorOf = function (oPopup) {
    while (oPopup != null && oPopup != this) oPopup = oPopup._parentPopup;
    return oPopup == this;
};
_p.__down_setEnabled = function (b) {
    this.setAppearance(b ? "down-arrow" : "down-arrow scroll-disabled");
    BiComponent.prototype._setEnabled.call(this, b);
};
_p.__up_setEnabled = function (b) {
    this.setAppearance(b ? "up-arrow" : "up-arrow scroll-disabled");
    BiComponent.prototype._setEnabled.call(this, b);
};
_p.__vc_create = function (oDocument) {
    BiComponent.prototype._create.call(this, oDocument);
    var tbody = oDocument.createElement("tbody");
    this._element.appendChild(tbody);
};
_p._createPopup = function () {
    if (this._popupCreated || this._disposed) return;
    this._popupCreated = true;
    var p = this._popup = new BiPopup();
    p._bgComponent._themeKey = BiTheme.KEYS.menuBackground;
    p._bgComponent.setCssClassName("bi-menu-background");
    p.isPopupAncestorOf = this.__p_isPopupAncestorOf;
    p.setCssClassName("bi-menu");
    p.addEventListener("show", this._onShowHide, this);
    p.addEventListener("hide", this._onHide, this);
    p.setOpaque(this._opaque);
    var sp = this._scrollPane = new BiComponent();
    sp.setLocation(0, 0);
    sp.setOverflow("hidden");
    p.add(sp);
    var vc = this._viewComponent = new BiComponent();
    vc._isMenu = true;
    vc._tagName = "table";
    vc.setCssClassName("bi-menu-table");
    vc.setTabIndex(0);
    vc.setHideFocus(true);
    vc._create = this.__vc_create;
    vc.setHtmlProperty("cellSpacing", 0);
    vc.addEventListener("keydown", this._handleKey, this);
    vc.addEventListener("mousedown", this._handleMouse, this);
    vc.addEventListener("mouseover", this._handleMouse, this);
    vc.addEventListener("mousemove", this._handleMouse, this);
    vc.addEventListener("contextmenu", this._handleContextMenu, this);
    vc.addEventListener("create", this.dispatchEvent, this);
    sp.add(vc);
    var ei = this._emptyItem = new BiMenuItem();
    ei.setEnabled(false);
    vc.add(ei._getViewComponent(), null, true);
    this._updateEmptyItemVisible();
    this._updateEmptyItemText();
    var up = this._upScroll = new BiComponent();
    up._setEnabled = this.__up_setEnabled;
    up.setProperties({
        top: 0,
        right: 0,
        height: 10,
        left: 0,
        enabled: false,
        visible: false
    });
    p.add(up);
    var sut = this._scrollUpTimer = new BiTimer();
    sut.setInterval(BiMenu.SCROLL_INTERVAL);
    sut.addEventListener("tick", this._scrollUp, this);
    up.addEventListener("mouseover", sut.start, sut);
    up.addEventListener("mouseout", sut.stop, sut);
    var down = this._downScroll = new BiComponent();
    down._setEnabled = this.__down_setEnabled;
    down.setProperties({
        right: 0,
        height: 10,
        left: 0,
        enabled: false,
        visible: false
    });
    p.add(down);
    var sdt = this._scrollDownTimer = new BiTimer();
    sdt.setInterval(BiMenu.SCROLL_INTERVAL);
    sdt.addEventListener("tick", this._scrollDown, this);
    down.addEventListener("mouseover", sdt.start, sdt);
    down.addEventListener("mouseout", sdt.stop, sdt);
    var sb = application.getStringBundle();
    sb.addEventListener("change", this._updateEmptyItemText, this);
    var l = this._children.length;
    for (var i = 0; i < l; i++) {
        this._add(this._children[i]);
    }
};
_p._getPopup = function () {
    this._createPopup();
    return this._popup;
};
_p._getViewComponent = function () {
    this._createPopup();
    return this._viewComponent;
};
_p._updateEmptyItemText = function () {
    var ei = this._emptyItem;
    var sb = application.getStringBundle();
    ei.setText(sb.getString("MenuEmptyItem"));
};
_p._scrollUp = function () {
    this._scroll(-BiMenu.SCROLL_DISTANCE, this._scrollUpTimer);
};
_p._scrollDown = function () {
    this._scroll(BiMenu.SCROLL_DISTANCE, this._scrollDownTimer);
};
_p._scroll = function (amount, timer) {
    if (this._scrollUpTimer.getInterval() != BiMenu.SCROLL_INTERVAL) {
        var started = this._scrollUpTimer.getIsStarted();
        this._scrollUpTimer.setInterval(BiMenu.SCROLL_INTERVAL);
        if (started) this._scrollUpTimer.start();
        started = this._scrollDownTimer.getIsStarted();
        this._scrollDownTimer.setInterval(BiMenu.SCROLL_INTERVAL);
        if (started) this._scrollDownTimer.start();
    }
    var sp = this._scrollPane;
    var currentTop = sp.getScrollTop();
    var newTop = amount + currentTop;
    var up = this._upScroll;
    var down = this._downScroll;
    if (newTop <= 0) {
        sp.setScrollTop(0);
        up.setEnabled(false);
        down.setEnabled(true);
        timer.stop();
    } else {
        var h = sp.getHeight();
        var sh = sp.getScrollHeight();
        var max = sh - h;
        if (newTop >= max) {
            sp.setScrollTop(max);
            up.setEnabled(true);
            down.setEnabled(false);
            timer.stop();
        } else {
            sp.setScrollTop(newTop);
            up.setEnabled(true);
            down.setEnabled(true);
        }
    }
};
_p.getShowTimeStamp = function () {
    return this._popup.getShowTimeStamp();
};
_p.getHideTimeStamp = function () {
    return this._popup.getHideTimeStamp();
};
BiMenu.addProperty("parent", BiAccessType.READ);
BiMenu.addProperty("opaque", BiAccessType.READ);
_p.setOpaque = function (b) {
    this._opaque = b;
    if (this._popup) this._popup.setOpaque(b);
};
_p.getParentMenu = function () {
    if (this._parent) return this._parent.getParent();
    return null;
};
_p.hasChildren = function () {
    return this._children.length > 0;
};
_p.getTopLevelComponent = function () {
    if (this._parent == null) return null;
    return this._parent.getTopLevelComponent();
};
_p.contains = function (oDescendant) {
    if (oDescendant == null) return false;
    if (oDescendant == this) return true;
    var p = oDescendant.getParent();
    return this.contains(p);
};
_p.setLocation = function (nLeft, nTop) {
    this._getPopup().setLocation(nLeft, nTop);
};
_p.setLeft = function (nLeft) {
    this.setLocation(nLeft, this.getTop());
};
_p.getLeft = function () {
    return this._getPopup().getLeft();
};
_p.setTop = function (nTop) {
    this.setLocation(this.getLeft(), nTop);
};
_p.getTop = function () {
    return this._getPopup().getTop();
};
_p.setSize = function (nWidth, nHeight) {
    this._getPopup().setSize(nWidth, nHeight);
};
_p.setWidth = function (nWidth) {
    this.setSize(nWidth, this.getHeight());
};
_p.getWidth = function () {
    return this._getPopup().getWidth();
};
_p.getScreenLeft = function () {
    return this._popup.getScreenLeft();
};
_p.getScreenTop = function () {
    return this._popup.getScreenTop();
};
_p.setHeight = function (nHeight) {
    this.setSize(this.getWidth(), nHeight);
};
_p.getHeight = function () {
    return this._getPopup().getHeight();
};
_p.getIsVisible = function () {
    return this._getPopup().getIsVisible();
};
_p.getPreferredWidth = function () {
    return this._getPopup().getPreferredWidth();
};
_p.getPreferredHeight = function () {
    return this._getPopup().getPreferredHeight();
};
_p.getInsetLeft = function () {
    return this._getViewComponent().getInsetLeft();
};
_p.getInsetRight = function () {
    return this._getViewComponent().getInsetRight();
};
_p.getInsetTop = function () {
    return this._getViewComponent().getInsetTop();
};
_p.getInsetBottom = function () {
    return this._getViewComponent().getInsetBottom();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiEventTarget.prototype.dispose.call(this);
    var sb = application.getStringBundle();
    sb.removeEventListener("change", this._updateEmptyItemText, this);
    if (!this._popupCreated) {
        new BiAsyncTaskQueue().removeTask(this, this._createPopup);
    }
    delete this._component;
    delete this._parent;
    delete this._emptyItem;
    delete this._upScroll;
    delete this._downScroll;
    delete this._scrollPane;
    delete this._viewComponent;
    this.disposeFields("_popup", "_children", "_scrollUpTimer", "_scrollDownTimer");
};
BiMenu.addProperty("component", BiAccessType.READ);
BiMenu.addProperty("children", BiAccessType.READ);
_p._enabled = true;
BiMenu.addProperty("enabled", BiAccessType.READ);
_p.setEnabled = function (b) {
    if (this._enabled != b) {
        this._enabled = b;
        this.dispatchEvent("enabledchanged");
    }
};
_p.getIsEnabled = function () {
    return this._enabled;
};
_p.setRightToLeft = function (b) {
    this._getPopup().setRightToLeft(b);
};
_p.getRightToLeft = function () {
    return this._getPopup().getRightToLeft();
};
_p.initAccessibility = BiAccessType.FUNCTION_EMPTY;
_p._handleKey = function (e) {
    this.dispatchEvent(e);
    if (this._children.length == 0) return;
    var next = null;
    var nextItems = {
        "selection.up": "previous",
        "selection.down": "next",
        "selection.first": "first",
        "selection.last": "last"
    };
    for (var n in nextItems)
        if (e.matchesBundleShortcut(n)) next = this._getEnabledItems()[nextItems[n]];
    if (next == null) {
        if (e.matchesBundleShortcut("popup.close")) {
            this.setVisible(false);
            next = this.getParent();
        } else next = e.matchesBundleModifiers("menu.itemaccesskey") && this._useMnemonic(String.fromCharCode(e.getKeyCode()));
    }
    if (next) next._select();
};
_p._useMnemonic = function (sMnemonic) {
    sMnemonic = sMnemonic.toLowerCase();
    var found, multiple, next, sure;
    for (var i = 0; i < this._children.length; i++) {
        var child = this._children[i];
        if (!child.getVisible() || !child.getEnabled()) continue;
        if (child.getMnemonic() == sMnemonic) {
            if (next) {
                multiple = true;
                if (found && !sure) {
                    sure = true;
                    next = child;
                }
            } else {
                next = child;
                if (found) sure = true;
            }
        }
        if (child == this._selectedItem) found = true;
    }
    if (!multiple && next) {
        if (next._subMenu) {
            next._select();
            next._showSubMenu();
        }
        return this._performActionOn(next);
    } else return next;
};
_p._performActionOn = function (oNext) {
    oNext._performAction();
    return null;
};
_p._getEnabledItems = function () {
    var found, next, prev, first, last;
    for (var i = 0; i < this._children.length; i++) {
        var child = this._children[i];
        if (!child.getVisible() || !child.getEnabled()) continue;
        if (!first) first = child;
        if (found && !next) next = child;
        if (child == this._selectedItem) found = true;
        if (!found) prev = child;
        last = child;
    }
    return {
        first: first,
        last: last,
        next: next || first,
        previous: prev || last
    };
};
_p._handleMouse = function (e) {
    this._dispatchEvent(e);
};
_p._handleContextMenu = function (e) {
    e.stopPropagation();
};
_p._handleMouseDown = function (e) {
    this._actOnMouseUp = true;
};
_p._itemSelectedChanged = function (e) {
    var item = e.getTarget();
    var selected = item._selected;
    var prevSelected = this._selectedItem;
    if (selected) {
        this._selectedItem = item;
        if (prevSelected && prevSelected != item) prevSelected._deselect();
    } else if (item == prevSelected) {
        this._selectedItem = null;
    }
};
_p.add = function (oItem, oBefore) {
    var p = oItem._parent;
    if (oBefore == null) {
        if (p != null) p.remove(oItem);
        this._children.push(oItem);
    } else {
        if (oBefore._parent != this) throw new Error("Can only add items before siblings");
        if (p != null) p.remove(oItem);
        this._children.insertBefore(oItem, oBefore);
    }
    oItem._parent = this;
    this._add(oItem, oBefore);
};
_p._add = function (oItem, oBefore) {
    if (this._popupCreated) {
        this._getViewComponent().add(oItem._getViewComponent(), oBefore && oBefore._getViewComponent());
        oItem.addEventListener("selectedchanged", this._itemSelectedChanged, this);
        this._updateEmptyItemVisible();
        if (this.getVisible()) {
            this._setVisible(false);
            this._setVisible(true);
        }
    }
};
_p.remove = function (oItem) {
    this._children.remove(oItem);
    oItem._parent = null;
    if (this._selectedItem == oItem) this._selectedItem = null;
    if (this._popupCreated) {
        oItem.removeEventListener("selectedchanged", this._itemSelectedChanged, this);
        this._getViewComponent().remove(oItem._getViewComponent());
        this._updateEmptyItemVisible();
        this._popup.setSize(1, 1);
    }
    return oItem;
};
_p._updateEmptyItemVisible = function () {
    this._emptyItem.setVisible(!this.hasChildren());
};
_p.removeAt = function (nIndex) {
    var item = this._children[nIndex];
    return this.remove(item);
};
_p.removeAll = function () {
    this._selectedItem = null;
    var cs = this._children;
    this._children = [];
    if (this._popupCreated) {
        this._viewComponent.removeAll();
        this._updateEmptyItemVisible();
        this._popup.setSize(1, 1);
    }
    cs.forEach(function (item) {
        item.dispose();
    });
};
_p.addAt = function (oChild, nIndex) {
    var old = this._children[nIndex];
    this.add(oChild, old);
};
_p.getFirstChild = function () {
    return this._children[0];
};
_p.getLastChild = function () {
    return this._children[this._children.length - 1];
};
_p.addParsedObject = function (o) {
    if (o instanceof BiMenuItem) this.add(o);
    else BiEventTarget.prototype.addParsedObject.call(this, o);
};
_p._setVisible = function (b) {
    var i;
    if (b) {
        if (!this._getPopup()._parent) application.getWindow().add(this._getPopup(), null, true);
        if (this._selectedItem) this._selectedItem._setSelected(false);
        this._emptyItem._setHtml();
        for (i = 0; i < this._children.length; i++) this._children[i]._setHtml();
    } else {
        for (i = 0; i < this._children.length; i++) {
            var c = this._children[i];
            if (c._subMenu) c._subMenu.setVisible(false);
        }
    }
    this._getPopup().setVisible(b);
    if (b) {
        this._showOrHideScrolls();
        this._getViewComponent().setFocused(true);
    }
};
_p.setVisible = function (b) {
    if (b)
        if (!this.dispatchEvent("beforeshow")) return;
    this._setVisible(b);
};
_p.getVisible = function () {
    return this._getPopup().getVisible();
};
_p.selectFirstItem = function () {
    this._selectItemOrMenu(this._getEnabledItems().first);
};
_p.selectLastItem = function () {
    this._selectItemOrMenu(this._getEnabledItems().last);
};
_p._selectItemOrMenu = function (oItem) {
    if (oItem) oItem._select();
    else this._viewComponent.setFocused(true);
};
_p.popupAtMouse = function (oMouseEvent, bSelectFirst) {
    var clientX = oMouseEvent.getClientX();
    var clientY = oMouseEvent.getClientY();
    var target = oMouseEvent.getTarget();
    if (window.BiRichEdit && target instanceof BiRichEdit) {
        clientX += target.getClientLeft();
        clientY += target.getClientTop();
    }
    var p = this._getPopup();
    p.setLocation(clientX, clientY);
    if (application.getWindow().getRightToLeft()) {
        this._suppressShowHide = true;
        this.setVisible(true);
        this.setVisible(false);
        p.setLeft(clientX - p.getWidth());
        this._suppressShowHide = false;
    }
    this.setVisible(true);
    this._actOnMouseUp = false;
    if (bSelectFirst) this.selectFirstItem();
};
_p.popupAtComponent = function (oComponent, bSelectFirst) {
    var desiredTop = this._desiredTop = oComponent.getClientTop() + oComponent.getHeight();
    var p = this._getPopup();
    p.setLocation(oComponent.getClientLeft(), desiredTop);
    if (oComponent.getRightToLeft()) {
        this._suppressShowHide = true;
        this.setVisible(true);
        var pw = p.getWidth();
        this.setVisible(false);
        p.setLeft(oComponent.getClientLeft() + oComponent.getWidth() - pw);
        this._suppressShowHide = false;
    }
    this._component = oComponent;
    this.setVisible(true);
    if (bSelectFirst) this.selectFirstItem();
};
_p._showOrHideScrolls = function () {
    var top = this._desiredTop;
    this._desiredTop = 0;
    this._scrollPane.setScrollTop(0);
    var ch = this._getPopup()._parent.getClientHeight() - 5;
    var h = this._scrollPane.getScrollHeight();
    var tooBig, tooFarDown = this._component && (ch < top + 50);
    if (tooFarDown) {
        ch = this._component.getClientTop();
        top = ch - h;
        tooBig = top < 0;
        if (tooBig) top = 0;
        this.setTop(top);
    } else tooBig = h > ch - top; if (tooBig) {
        this.setHeight(ch - top);
        this._scrollPane.setTop(this._upScroll.getHeight());
        this._scrollPane.setBottom(this._downScroll.getHeight());
        this._downScroll.setBottom(0);
    } else {
        this.setHeight(h + 2);
        this._scrollPane.setTop(0);
        this._scrollPane.setBottom(0);
    }
    this._upScroll.setVisible(tooBig);
    this._downScroll.setVisible(tooBig);
    this._downScroll.setEnabled(tooBig);
};
_p._onHide = function (e) {
    if (!this._parent && !new BiMenuManager().getCurrentMenuButton()) BiEventManager.restoreFocused();
    this._onShowHide(e);
};
_p._onShowHide = function (e) {
    if (!this._suppressShowHide) this.dispatchEvent(e._type);
};
_p._getActOnMouseUp = function () {
    return this._actOnMouseUp;
};
application.getStringBundle().appendBundle("en", {
    MenuEmptyItem: "<Empty>"
});

function BiMenuItem(sText, oSubMenu) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._text = sText;
    this.setSubMenu(oSubMenu);
}
_p = _biExtend(BiMenuItem, BiEventTarget, "BiMenuItem");
_p._viewComponentCreated = false;
_p._enabled = true;
_p._createViewComponent = function () {
    if (this._viewComponentCreated || this._disposed) return;
    this._viewComponentCreated = true;
    var vc = this._viewComponent = new BiComponent();
    vc._tagName = "tr";
    vc.setTabIndex(0);
    vc._addHtmlElementToParent = this.__addHtmlElementToParent;
    vc._removeHtmlElementFromParent = this.__removeHtmlElementFromParent;
    vc.addEventListener("keydown", this._handleKey, this);
    vc.addEventListener("mousemove", this._handleMouseOver, this);
    vc.addEventListener("mouseout", this._handleMouseOut, this);
    vc.addEventListener("mouseup", this._handleMouseUp, this);
    vc.setCssClassName("bi-menu-item");
    vc.setAppearance("menu-item");
    vc.setHideFocus(true);
    this._setVcEnabled(this._enabled);
    vc.setToolTipText(this._toolTipText);
    this.__overrideSyncWithCommand(vc);
    vc.setCommand(this._command);
    vc._isMenu = true;
    var interval = 200;
    this._showMenuTimer = new BiTimer();
    this._showMenuTimer.setInterval(interval);
    this._showMenuTimer.addEventListener("tick", this._showSubMenu, this);
    this._hideMenuTimer = new BiTimer();
    this._hideMenuTimer.setInterval(interval);
    this._hideMenuTimer.addEventListener("tick", this._hideSubMenu, this);
};
_p.__overrideSyncWithCommand = function (vc) {
    var oThis = this;
    vc._syncWithCommand = function () {
        oThis._syncWithCommand();
    };
};
_p._getViewComponent = function () {
    this._createViewComponent();
    return this._viewComponent;
};
BiMenuItem.addProperty("parent", BiAccessType.READ);
_p.getTopLevelComponent = function () {
    if (this._parent == null) return null;
    return this._parent.getTopLevelComponent();
};
_p.contains = function (oDescendant) {
    if (oDescendant == null) return false;
    if (oDescendant == this) return true;
    var p = oDescendant.getParent();
    return this.contains(p);
};
_p.getPreviousSibling = function () {
    var p = this.getParent();
    if (p == null) return null;
    var cs = p.getChildren();
    return cs[cs.indexOf(this) - 1];
};
_p.getNextSibling = function () {
    var p = this.getParent();
    if (p == null) return null;
    var cs = p.getChildren();
    return cs[cs.indexOf(this) + 1];
};
_p._selected = false;
BiMenuItem.addProperty("text", BiAccessType.READ);
_p.setText = function (s) {
    this._text = s;
    this._validContent = false;
};
BiMenuItem.addProperty("html", BiAccessType.READ);
_p.setHtml = function (s) {
    this._html = s;
    this._validContent = false;
};
BiMenuItem.addProperty("icon", BiAccessType.READ);
_p.setIcon = function (o) {
    this._icon = o;
    this._validContent = false;
};
BiMenuItem.addProperty("mnemonic", BiAccessType.READ);
_p.setMnemonic = function (s) {
    this._mnemonic = s.charAt(0).toLowerCase();
    this._validContent = false;
};
_p._setSelected = function (b) {
    if (this._selected != b) {
        this._selected = b;
        this.dispatchEvent("selectedchanged");
    }
    if (b && this._getViewComponent()._created) this._focus();
    this._getViewComponent().setAppearance(b ? "menu-item menu-item-hover" : "menu-item");
};
_p._focus = function () {
    this._getViewComponent().setFocused(true);
    this._scrollIntoView();
};
_p._scrollIntoView = function () {
    var sp = this._parent._scrollPane;
    var st = sp.getScrollTop();
    var ch = sp.getHeight();
    var vc = this._getViewComponent();
    var t = vc.getTop();
    var ns = this.getNextSibling();
    var b = ns ? ns._viewComponent.getTop() : sp.getScrollHeight();
    if (st > t) sp.setScrollTop(t);
    else if (st < b - ch) sp.setScrollTop(b - ch);
};
_p._select = function () {
    this._setSelected(true);
};
_p._deselect = function () {
    if (this._subMenu) this._subMenu.setVisible(false);
    this._setSelected(false);
};
BiMenuItem.addProperty("subMenu", BiAccessType.READ);
_p.setSubMenu = function (oMenu) {
    if (this._subMenu != oMenu) {
        if (this._subMenu) {
            this._subMenu.removeEventListener("keydown", this._handleSubMenuKey, this);
            this._subMenu.removeEventListener("mousemove", this._handleMouseOver, this);
            this._subMenu._getPopup()._parentPopup = null;
            this._subMenu._getPopup()._autoHide = true;
            this._subMenu._parent = null;
        }
        if (oMenu) {
            oMenu.addEventListener("keydown", this._handleSubMenuKey, this);
            oMenu.addEventListener("mousemove", this._handleMouseOver, this);
            oMenu._parent = this;
        }
        this._subMenu = oMenu;
        this._validContent = false;
    }
};
_p._visible = true;
BiMenuItem.addProperty("visible", BiAccessType.READ);
_p.setVisible = function (b) {
    var vc = this._getViewComponent();
    vc.setVisible(b);
    vc.setStyleProperty("display", b ? "" : "none");
    this._visible = b;
};
_p.getIsVisible = function () {
    return this._visible && this._parent && this._parent.getIsVisible();
};
BiMenuItem.addProperty("enabled", BiAccessType.READ);
_p.setEnabled = function (b) {
    if (b != this._enabled) {
        var vc = this._getViewComponent();
        if (vc._created && this._icon) {
            var icon = vc._element.firstChild;
            if (icon) icon.innerHTML = this._icon.getIconHtml(false, b);
        }
        this._setVcEnabled(b);
        this._enabled = b;
        this.dispatchEvent("enabledchanged");
    }
};
_p._setVcEnabled = function (b) {
    var vc = this._viewComponent;
    if (!vc) return;
    vc.setEnabled(b);
    vc.setAppearance(b ? "menu-item" : "menu-item menu-item-disabled");
};
_p._setEnabled = BiAccessType.FUNCTION_EMPTY;
_p.getIsEnabled = function () {
    return this.getEnabled() && (this._parent && this._parent.getIsEnabled());
};
BiMenuItem.addProperty("shortcutText", BiAccessType.READ_WRITE);
_p.getScreenLeft = function () {
    return this._viewComponent.getScreenLeft();
};
_p.getScreenTop = function () {
    return this._viewComponent.getScreenTop();
};
BiMenuItem.addProperty("toolTipText", BiAccessType.READ);
_p.setToolTipText = function (s) {
    var vc = this._viewComponent;
    if (vc) vc.setToolTipText(s);
    this._toolTipText = s;
};
_p.addXmlNode = function (oNode, oXmlResourceParser) {
    if (oNode.nodeType == 3) {
        if (!/^\s*$/.test(oNode.data)) this.setText((this.getText() || "") + oNode.data);
    } else BiEventTarget.prototype.addXmlNode.call(this, oNode, oXmlResourceParser);
};
_p.addParsedObject = function (o) {
    if (o instanceof BiMenu && !this.getSubMenu()) this.setSubMenu(o);
    else BiObject.prototype.addParsedObject.call(this, o);
};
BiMenuItem.addProperty("command", BiObject.READ);
_p.setCommand = function (cmd) {
    var vc = this._viewComponent;
    this._command = cmd;
    this._syncWithCommand();
    if (vc) vc.setCommand(cmd);
};
_p._syncWithCommand = function () {
    if (this._command) {
        this.setEnabled(this._command.getEnabled());
        var stroke = this._command.getShortcutKeystroke();
        this.setShortcutText(stroke ? stroke.toString() : "");
    }
};
_p.setAttribute = function (sName, sValue, oXmlResourceParser) {
    switch (sName) {
    case "icon":
        this.setIcon(BiImage.fromUri(sValue));
        break;
    case "command":
        if (sValue.charAt(0) == "#") sValue = sValue.substr(1);
        var c = oXmlResourceParser.getComponentById(sValue);
        this.setCommand(c);
        break;
    default:
        BiEventTarget.prototype.setAttribute.apply(this, arguments);
    }
};
_p.__addHtmlElementToParent = function (oParent, oBefore) {
    if (this._lazyCreate && !this.getVisible()) return;
    if (!this._created) this._create(oParent._document);
    var beforeElement = oBefore ? oBefore._element : null;
    if (beforeElement) oParent._element.getElementsByTagName("tbody")[0].insertBefore(this._element, beforeElement);
    else oParent._element.getElementsByTagName("tbody")[0].appendChild(this._element);
    this._created = true;
    this._createChildren();
    this.invalidateParentLayout();
    if (oParent.getHtmlProperty("disabled") && !this.getHtmlProperty("disabled")) {
        this._setEnabled(false);
    }
    this.dispatchEvent(BiComponent._createEvent);
};
_p.__removeHtmlElementFromParent = function (oParent) {
    if (this._created && (oParent && oParent._created && oParent._element) && !(application && application._disposed)) {
        oParent._element.getElementsByTagName("tbody")[0].removeChild(this._element);
    }
};
_p._setHtml = function () {
    if (!this._getViewComponent()._created) return;
    if (this._validContent) return;
    this._validContent = true;
    var element = this._getViewComponent()._element;
    while (element.firstChild) element.removeChild(element.lastChild);
    this._appendCells(element);
};
_p._getTextHtml = function () {
    return BiLabel.addMnemonic(BiLabel.textToHtml(this._text), this._mnemonic);
};
_p._appendCells = function (trElement) {
    var d = BiXml.getOwnerDocument(trElement);
    var icon = d.createElement("td");
    icon.className = "icon-column";
    icon.noWrap = true;
    if (this._icon) {
        icon.innerHTML = this._icon.getIconHtml(false, this.getIsEnabled());
    }
    trElement.appendChild(icon);
    var text = d.createElement("td");
    text.className = "text";
    text.noWrap = true;
    text.innerHTML = this._html || this._getTextHtml();
    trElement.appendChild(text);
    if (this._shortcutText) {
        var shortcut = d.createElement("td");
        shortcut.className = "shortcut";
        shortcut.noWrap = true;
        shortcut.innerHTML = this._shortcutText;
        trElement.appendChild(shortcut);
    } else text.colSpan = 2;
    var arrow = d.createElement("td");
    arrow.innerHTML = "&nbsp;";
    arrow.noWrap = true;
    arrow.className = "arrow-column";
    if (this._subMenu) {
        arrow.className += " arrow";
        if (this._getViewComponent().getRightToLeft()) arrow.className += "-rtl";
    }
    trElement.appendChild(arrow);
};
_p._handleKey = function (e) {
    var action = e.matchesBundleShortcut("controls.action");
    if (this._subMenu) {
        if (action || e.matchesBundleShortcut("tree.expand")) {
            this._showSubMenu();
            this._subMenu.selectFirstItem();
        }
    } else if (action) this._performAction();
};
_p._handleSubMenuKey = function (e) {
    if (e.matchesBundleShortcut("tree.collapse")) {
        e.stopPropagation();
        this._subMenu.setVisible(false);
        this._focus();
    }
};
_p._handleMouseOver = function () {
    if (!this._selected && this.getIsEnabled()) {
        if (this._subMenu) {
            this._hideMenuTimer.stop();
            this._showMenuTimer.start();
        }
        this._setSelected(true);
    }
};
_p._handleMouseOut = function (e) {
    var sm = this._subMenu;
    var t = e.getRelatedTarget();
    if (sm && sm._popupCreated && (sm._popup == t || (sm._viewComponent && sm._viewComponent.contains(t)))) return;
    if (this._selected) {
        if (sm) {
            this._showMenuTimer.stop();
            this._hideMenuTimer.start();
        }
        this._setSelected(false);
    }
};
_p._handleMouseUp = function (e) {
    if (this._parent._getActOnMouseUp()) this._performAction();
};
_p._showSubMenu = function () {
    this._showMenuTimer.stop();
    var parentPopup = this._parent._getPopup();
    var subPopup = this._subMenu._getPopup();
    subPopup._parentPopup = parentPopup;
    var st = this._parent._scrollPane.getScrollTop();
    if (this._parent._upScroll.getVisible()) st -= 10;
    subPopup.setLocation(parentPopup.getLeft() + parentPopup.getWidth() - 5, parentPopup.getTop() + this._getViewComponent().getTop() - st);
    if (this._getViewComponent().getRightToLeft()) {
        this._subMenu.setVisible(true);
        this._subMenu.setVisible(false);
        subPopup.setLeft(parentPopup.getLeft() - subPopup.getWidth() + 5);
    }
    this._subMenu.setVisible(true);
};
_p._hideSubMenu = function () {
    this._hideMenuTimer.stop();
    this._subMenu.setVisible(false);
};
_p._performAction = function () {
    if (!this.getEnabled()) return;
    if (this._subMenu) this._showSubMenu();
    else {
        new BiMenuManager().setCurrentMenuButton(null);
        new BiPopupManager().hideAutoHiding(null);
    }
    this.dispatchEvent("action");
    if (this._command) this._command.execute();
};
_p.dispose = function () {
    if (this._disposed) return;
    if (this._viewComponent) delete this._viewComponent._syncWithCommand;
    if (this._viewComponent && this._command) this.setCommand(null);
    this.disposeFields("_viewComponent", "_subMenu");
    BiEventTarget.prototype.dispose.call(this);
};

function BiMenuSeparator() {
    if (_biInPrototype) return;
    BiMenuItem.call(this);
    this._preferredHeight = 1;
}
_p = _biExtend(BiMenuSeparator, BiMenuItem, "BiMenuSeparator");
_p._enabled = false;
_p._createViewComponent = function () {
    if (this._viewComponentCreated || this._disposed) return;
    BiMenuItem.prototype._createViewComponent.call(this);
    this._viewComponent.setEnabled(false);
};
_p._getCssClass = function () {
    return "";
};
_p._appendCells = function (trElement) {
    var d = BiXml.getOwnerDocument(trElement);
    var td = d.createElement("td");
    var theme = application.getThemeManager().getDefaultTheme();
    if (theme.getAppearanceProperty("menu", "icon-hides-separator")) {
        td.colSpan = 3;
        var icon = d.createElement("td");
        icon.className = "icon-column";
        trElement.appendChild(icon);
    } else td.colSpan = 4;
    td.innerHTML = "<img class='separator'>";
    trElement.appendChild(td);
};

function BiCheckBoxMenuItem(sText, bChecked, oSubMenu) {
    if (_biInPrototype) return;
    BiMenuItem.call(this, sText, oSubMenu);
    this.setChecked(bChecked);
}
_p = _biExtend(BiCheckBoxMenuItem, BiMenuItem, "BiCheckBoxMenuItem");
_p._userValue = null;
_p._styleName = "checkbox";
BiCheckBoxMenuItem.addProperty("userValue", BiAccessType.READ);
_p.setUserValue = function (v) {
    if (this._userValue != v) {
        this._userValue = v;
        if (this._command) this._command.setUserValue(v);
    }
};
BiCheckBoxMenuItem.addProperty("checked", BiAccessType.READ);
_p.setChecked = function (b) {
    if (this._checked != b) {
        this._validContent = false;
        this._checked = b;
        if (this._command) this._command.setChecked(b);
        this.dispatchEvent("change");
    }
};
_p._performAction = function () {
    if (!this.getEnabled()) return;
    this.setChecked(!this._checked);
    BiMenuItem.prototype._performAction.call(this);
};
_p._syncWithCommand = function () {
    BiMenuItem.prototype._syncWithCommand.call(this);
    if (this._command) {
        this.setChecked(this._command.getChecked());
        this.setUserValue(this._command.getUserValue());
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    delete this._userValue;
    BiMenuItem.prototype.dispose.call(this);
};
_p._appendCells = function (trElement) {
    BiMenuItem.prototype._appendCells.call(this, trElement);
    var icon = trElement.firstChild;
    icon.className = "icon-column " + this._styleName + (this._checked ? "-checked" : "");
};

function BiRadioButtonMenuItem(sText, bChecked, oSubMenu) {
    if (_biInPrototype) return;
    BiCheckBoxMenuItem.call(this, sText, oSubMenu);
    this._checked = bChecked;
}
_p = _biExtend(BiRadioButtonMenuItem, BiCheckBoxMenuItem, "BiRadioButtonMenuItem");
_p._styleName = "radiobutton";
_p.setChecked = function (b) {
    if (this._checked != b) {
        this._validContent = false;
        this._checked = b;
        if (this._group && b) this._group.setSelected(this);
        if (this._command) this._command.setChecked(b);
        this.dispatchEvent("change");
    }
};
_p.getValue = _p.getChecked;
_p.setValue = _p.setChecked;
BiRadioButtonMenuItem.addProperty("group", BiAccessType.READ);
_p.setGroup = function (oRadioGroup) {
    if (this._group != oRadioGroup) {
        if (this._group) this._group.remove(this);
        this._group = oRadioGroup;
        if (this._group) {
            this._group.add(this);
        }
    }
};
_p._performAction = function () {
    this._checked = false;
    BiCheckBoxMenuItem.prototype._performAction.call(this);
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
    case "group":
        if (sValue.charAt(0) == "#") sValue = sValue.substr(1);
        var c = oParser.getComponentById(sValue);
        this.setGroup(c);
        break;
    default:
        BiMenuItem.prototype.setAttribute.apply(this, arguments);
    }
};
_p._syncWithCommand = function () {
    BiMenuItem.prototype._syncWithCommand.call(this);
    if (this._command) {
        this.setChecked(this._command.getChecked());
        this.setUserValue(this._command.getUserValue());
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    if (this._group) {
        this._group.remove(this);
        this._group = null;
    }
    BiCheckBoxMenuItem.prototype.dispose.call(this);
};

function BiMenuButton(sText, oMenu) {
    if (_biInPrototype) return;
    BiLabel.call(this, sText, null);
    this.setMenu(oMenu);
    this.setTabIndex(0);
    this.setCssClassName("bi-menu-button");
    this.setAppearance("menu-button");
    this.addEventListener("mousedown", this._onMouseDown);
    this.addEventListener("mouseover", this._activate);
    this.addEventListener("mouseout", this._onMouseOut);
    this.addEventListener("create", this.pack);
    this.addEventListener("keydown", this._onKeyDown);
};
_p = _biExtend(BiMenuButton, BiLabel, "BiMenuButton");
BiMenuButton.DEFAULT = "menu-button";
BiMenuButton.HOVERED = "menu-button menu-button-hover";
BiMenuButton.ACTIVE = "menu-button menu-button-active";
_p._isMenu = true;
_p._tagName = "SPAN";
BiMenuButton.addProperty("menu", BiAccessType.READ);
_p.setMenu = function (oMenu) {
    var oldMenu = this._menu;
    this._menu = oMenu;
    this._menuEventListeners(oldMenu, "remove", this);
    this._menuEventListeners(oMenu, "add", this);
};
_p.getSubMenu = _p.getMenu;
_p.setSubMenu = _p.setMenu;
_p._menuEventListeners = function (menu, s, t) {
    if (menu) {
        var method = s + "EventListener";
        BiMenuButton.MENU_EVENT_LISTENERS.forEach(function (o) {
            menu[method](o.type, o.listener, t);
            if (o.call) o.listener.call(this);
        }, this);
    }
};
_p._activate = function () {
    var manager = new BiMenuManager();
    var mb = manager.getCurrentMenuButton();
    if (mb == this) return;
    var app = (mb && mb.getAppearance()) || BiMenuButton.HOVERED;
    this.setAppearance(app);
    if (mb && mb.getFocused()) this.setFocused(true);
    manager.setCurrentMenuButton(this);
    if (this.getAppearance() == BiMenuButton.ACTIVE) this.popupMenu();
};
_p._deactivate = function () {
    if (this._menu) this._menu.setVisible(false);
    this.setAppearance(BiMenuButton.DEFAULT);
};
_p._onMenuHide = function () {
    if (this._escFlag) {
        this._escFlag = false;
        this.setFocused(true);
        this.setAppearance(BiMenuButton.HOVERED);
    } else {
        var manager = new BiMenuManager();
        if (manager.getCurrentMenuButton() == this) manager.setCurrentMenuButton(null);
        this.setAppearance(BiMenuButton.DEFAULT);
    }
};
_p._onMenuShow = function () {
    this.setAppearance(BiMenuButton.ACTIVE);
    new BiMenuManager().setCurrentMenuButton(this);
};
_p._onKeyDown = function (e) {
    var up = e.matchesBundleShortcut("selection.up");
    var down = e.matchesBundleShortcut("selection.down");
    if (up || down) {
        this.popupMenu(down);
        if (up) this._menu.selectLastItem();
    } else if (e.matchesBundleShortcut("popup.close")) {
        BiEventManager.restoreFocused();
        this._onMenuHide();
    } else this._onMenuKeyDown(e);
};
_p._onMenuKeyDown = function (e) {
    if (this._menu.getIsVisible() && e.matchesBundleShortcut("popup.close")) this._escFlag = true;
    var item = e.getTarget()._selectedItem;
    if (!item || !item._subMenu || e.matchesBundleShortcut("tree.collapse")) this.dispatchEvent(new BiKeyboardEvent("menukeydown", e._event));
};
_p._onMouseOut = function (e) {
    var t = e.getRelatedTarget();
    if (t instanceof BiMenuButton || this._isMenu(t)) return;
    if (this.getAppearance() == BiMenuButton.HOVERED) new BiMenuManager().setCurrentMenuButton(null);
};
_p._isMenu = function (c) {
    return c && (c instanceof BiPopup || this._isMenu(c._parent));
};
_p._onMouseDown = function () {
    var m = this._menu;
    if (m && new BiMenuManager().getCurrentMenuButton() == this) {
        if (m.getIsVisible()) m.setVisible(false);
        else this.popupMenu();
    } else this._activate();
};
_p.popupMenu = function (bSelectFirst) {
    if (this._menu) this._menu.popupAtComponent(this, bSelectFirst);
};
_p.setEnabled = function (b) {
    BiLabel.prototype.setEnabled.call(this, b);
    this._matchEnabled();
};
_p._matchEnabled = function () {
    if (this._menu) {
        var enabled = this._menu.getEnabled();
        if (this._enabled != enabled) this.setEnabled(enabled);
    }
};
_p.setText = function (sText) {
    var w = this.getWidth();
    BiLabel.prototype.setText.apply(this, arguments);
    if (this._created) {
        this.pack();
        if (w != this.getWidth()) this.dispatchEvent("resize");
    }
};
_p.setLeft = function () {
    BiLabel.prototype.setLeft.apply(this, arguments);
};
_p.addParsedObject = function (o) {
    if (o instanceof BiMenu) {
        if (!this._menu) this.setMenu(o);
    } else BiLabel.prototype.addParsedObject.call(this, o);
};
_p.setMnemonic = function (key) {
    BiLabel.prototype.setMnemonic.call(this, key);
    this.setAccessKey(key);
};
BiMenuButton.MENU_EVENT_LISTENERS = [{
    type: "hide",
    listener: _p._onMenuHide
}, {
    type: "show",
    listener: _p._onMenuShow
}, {
    type: "keydown",
    listener: _p._onMenuKeyDown
}, {
    type: "enabledchanged",
    listener: _p._matchEnabled,
    call: true
}];
_p.setVisible = function (bVisible) {
    if (bVisible != this._visible) {
        BiLabel.prototype.setVisible.call(this, bVisible);
        if (this._parent) this._parent._layoutButtons();
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    this.setMenu(null);
    delete this._menu;
    BiLabel.prototype.dispose.call(this);
};

function BiMenuBar() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-menu-bar");
}
_p = _biExtend(BiMenuBar, BiComponent, "BiMenuBar");
_p._left = 0;
_p._right = 0;
_p._acceptsEnter = true;
_p._acceptsEsc = true;
_p._isMenu = true;
BiMenuBar.addProperty("acceptsEnter", BiAccessType.READ);
BiMenuBar.addProperty("acceptsEsc", BiAccessType.READ);
_p.add = function (oChild, oBefore) {
    BiComponent.prototype.add.call(this, oChild, oBefore);
    oChild.addEventListener("menukeydown", this._onMenuKeyDown, this);
    oChild.addEventListener("resize", this._layoutButtons, this);
    if (this._created) {
        this._layoutButtons();
    }
};
_p.remove = function (oChild) {
    BiComponent.prototype.remove.call(this, oChild);
    oChild.removeEventListener("menukeydown", this._onMenuKeyDown, this);
    oChild.removeEventListener("resize", this._layoutButtons, this);
    this._layoutButtons();
};
_p._onMenuKeyDown = function (e) {
    var left = e.matchesBundleShortcut("tree.collapse");
    var right = e.matchesBundleShortcut("tree.expand");
    var step = right ? 1 : left ? -1 : 0;
    if (step) {
        var next = e.getTarget();
        do {
            next = this._getNext(next, step);
        } while (!next.getEnabled());
        next._activate();
    } else this.showMenuByMnemonic(String.fromCharCode(e.getKeyCode()));
};
_p._getNext = function (oMenuButton, nStep) {
    var cs = this._children;
    var n = cs.indexOf(oMenuButton) + nStep;
    n = (n + cs.length) % cs.length;
    return cs[n];
};
_p._getVisibleMenu = function () {
    var l = this._children.length;
    for (var i = 0; i < l; i++) {
        var c = this._children[i];
        if (c instanceof BiMenuButton) {
            var menu = c.getMenu();
            if (menu && menu.getVisible()) return c.getMenu();
        }
    }
    return null;
};
_p._layoutButtons = function () {
    var next = 0;
    var cs = this._children;
    for (var i = 0; i < cs.length; i++) {
        var c = cs[i];
        if (c.getVisible()) {
            if (this.getRightToLeft()) {
                c.setRight(next);
                if (BiBrowserCheck.moz) c.setRightToLeft(false);
            } else c.setLeft(next);
            next += c.getWidth();
        }
    }
    if (this._height == null && (this._top == null || this._bottom == null)) this.setStyleProperty("height", this.getPreferredHeight() + "px");
};
_p.showMenuByMnemonic = function (sKey) {
    if (!this.getIsEnabled()) return false;
    var button = this._findButtonByMnemonic(sKey);
    if (!button || !button.getEnabled()) return false;
    if (BiBrowserCheck.ie && button._menu) BiTimer.callOnce(function () {
        button.setFocused(true);
        button.popupMenu(true);
    }, 0, this);
    else button.popupMenu(true);
    return true;
};
_p._findButtonByMnemonic = function (sKey) {
    var key = sKey.toUpperCase();
    for (var i = 0; i < this._children.length; i++) {
        var button = this._children[i];
        var mnemonic = button.getMnemonic();
        mnemonic = mnemonic && mnemonic.toUpperCase();
        if (mnemonic == key) return button;
    }
    return null;
};
_p.toggleFocus = function () {
    var currentButton = new BiMenuManager().getCurrentMenuButton();
    if (currentButton) {
        if (currentButton instanceof BiMenuButton) {
            currentButton._onMenuHide();
            BiEventManager.restoreFocused();
        }
    } else {
        var first = this._children[0];
        while (first && (!first.getEnabled() || !first.getVisible())) first = this._getNext(first, 1);
        if (first) {
            first._activate();
            first.setFocused(true);
        }
    }
};

function BiMoveEvent(sType, nLeft, nTop) {
    if (_biInPrototype) return;
    BiEvent.call(this, sType);
    this._left = nLeft;
    this._top = nTop;
}
_p = _biExtend(BiMoveEvent, BiEvent, "BiMoveEvent");
BiMoveEvent.addProperty("left", BiAccessType.READ);
BiMoveEvent.addProperty("top", BiAccessType.READ);

function BiResizeEvent(sType, nLeft, nTop, nWidth, nHeight) {
    if (_biInPrototype) return;
    BiMoveEvent.call(this, sType, nLeft, nTop);
    this._width = nWidth;
    this._height = nHeight;
}
_p = _biExtend(BiResizeEvent, BiMoveEvent, "BiResizeEvent");
BiResizeEvent.addProperty("width", BiAccessType.READ);
BiResizeEvent.addProperty("height", BiAccessType.READ);

function BiMoveHandle(oHandleFor, oGhost) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCursor("move");
    this._handleFor = oHandleFor || this;
    this._ghost = oGhost;
    if (this._ghost != null) {
        var gp = this._ghost.getParent();
        if (gp != null) gp.remove(this._ghost);
        this._ghost.setZIndex(999999);
        this._ghost.setVisible(false);
        this._continuousLayout = false;
    }
    this.addEventListener("mousedown", this._startMove, this);
}
_p = _biExtend(BiMoveHandle, BiComponent, "BiMoveHandle");
_p._handleFor = null;
_p._ghost = null;
_p._moveDirection = "both";
_p._continuousLayout = true;
BiMoveHandle.addProperty("continuousLayout", BiAccessType.READ_WRITE);
BiMoveHandle.addProperty("ghost", BiAccessType.READ_WRITE);
BiMoveHandle.addProperty("handleFor", BiAccessType.READ_WRITE);
BiMoveHandle.addProperty("moveDirection", BiAccessType.READ_WRITE);
_p.startMove = function (e) {
    this._startMove(e);
};
_p._startMove = function (e) {
    if (!this._handleFor) return;
    if (this.dispatchEvent("movestart")) {
        var c = this._continuousLayout ? this._handleFor : this._ghost;
        if (!this._continuousLayout) {
            if (this._handleFor.getParent() != c.getParent()) BiComponent.prototype.add.call(this._handleFor.getParent(), c, null, true);
            var nLeft = this._handleFor.getLeft();
            var nTop = this._handleFor.getTop();
            if (nLeft != c.getLeft() || nTop != c.getTop()) c.setLocation(nLeft, nTop);
            var nWidth = this._handleFor.getWidth();
            var nHeight = this._handleFor.getHeight();
            if (nWidth != c.getWidth() || nHeight != c.getHeight()) c.setSize(nWidth, nHeight);
        }
        c.addEventListener("mouseup", this._endMove, this);
        c.addEventListener("losecapture", this._endMove, this);
        c.setCapture(true);
        var p = c.getParent();
        if (p) {
            p._showGlassPane();
            if (!this._continuousLayout) {
                c.addEventListener("mousemove", this._initiateMove, this);
            }
            c.addEventListener("mousemove", this._continueMove, this);
            var r = BiComponent._getElementPositionInFrame(p._element);
            this._moveData = {
                dx: e.getClientX() - c.getClientLeft(),
                dy: e.getClientY() - c.getClientTop(),
                limit: {
                    left: r.x,
                    top: r.y,
                    width: p.getClientWidth() - 1,
                    height: p.getClientHeight() - 1
                }
            };
        } else {
            c.addEventListener("mousemove", this._continueMoveWindow, this);
            this._moveData = {
                startX: e.getClientX(),
                startY: e.getClientY()
            };
        }
        e.preventDefault();
    }
};
_p._initiateMove = function (e) {
    var c = this._continuousLayout ? this._handleFor : this._ghost;
    c.setVisible(true);
    c.removeEventListener("mousemove", this._initiateMove, this);
};
_p._continueMove = function (e) {
    var x = Math.min(Math.max(e.getClientX() - this._moveData.limit.left, 0), this._moveData.limit.width);
    var y = Math.min(Math.max(e.getClientY() - this._moveData.limit.top, 0), this._moveData.limit.height);
    x -= this._moveData.dx;
    y -= this._moveData.dy;
    if (this.dispatchEvent(new BiMoveEvent("beforemove", x, y))) {
        var c = this._continuousLayout ? this._handleFor : this._ghost;
        if (this._moveDirection == "both") c.setLocation(x, y);
        else if (this._moveDirection == "horizontal") c.setLeft(x);
        else c.setTop(y);
        this.dispatchEvent(new BiMoveEvent("move", x, y));
    }
    e.preventDefault();
};
_p._continueMoveWindow = function (e) {
    var x = this._moveDirection === "vertical" ? 0 : e.getClientX() - this._moveData.startX;
    var y = this._moveDirection === "horizontal" ? 0 : e.getClientY() - this._moveData.startY;
    if ((x || y) && this.dispatchEvent(new BiMoveEvent("beforemove", x, y))) {
        var c = this._continuousLayout ? this._handleFor : this._ghost;
        c._moveBy(x, y);
        this.dispatchEvent(new BiMoveEvent("move", x, y));
    }
    e.preventDefault();
};
_p._endMove = function (e) {
    var c = !this._continuousLayout ? this._ghost : this._handleFor;
    c.removeEventListener("mousemove", this._continueMove, this);
    c.removeEventListener("mousemove", this._continueMoveWindow, this);
    c.removeEventListener("mouseup", this._endMove, this);
    c.removeEventListener("losecapture", this._endMove, this);
    c.setCapture(false);
    if (c.getParent()) {
        c.getParent()._hideGlassPane();
    }
    if (!this._continuousLayout) {
        var nLeft = c.getLeft();
        var nTop = c.getTop();
        if (this._moveDirection == "both") {
            if (nLeft != this._handleFor.getLeft() || nTop != this._handleFor.getTop()) this._handleFor.setLocation(nLeft, nTop);
        } else if (this._moveDirection == "horizontal") {
            if (nLeft != this._handleFor.getLeft()) this._handleFor.setLeft(nLeft);
        } else {
            if (nTop != this._handleFor.getTop()) this._handleFor.setTop(nTop);
        }
        c.removeEventListener("mousemove", this._initiateMove, this);
        c.setVisible(false);
        BiComponent.prototype.remove.call(c.getParent(), c);
    }
    this._moveData = null;
    this.dispatchEvent("moveend");
    e.preventDefault();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._handleFor = null;
    this._moveData = null;
    this.disposeFields("_ghost");
};
_p.getMoving = function () {
    return this._moveData != null;
};
_p.setAttribute = function (sName, sValue, oXmlResourceParser) {
    switch (sName) {
    case "handleFor":
        if (sValue.charAt(0) == "#") sValue = sValue.substr(1);
        var c = oXmlResourceParser.getComponentById(sValue);
        this.setHandleFor(c);
        break;
    default:
        BiComponent.prototype.setAttribute.apply(this, arguments);
    }
};

function BiResizeHandle(oHandleFor, oGhost) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-resize-handle");
    var c = this._image = new BiComponent();
    c.setProperties({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        cssClassName: "bi-resize-image"
    });
    this.add(c);
    this.setRight(0);
    this.setBottom(0);
    this.setHandleFor(oHandleFor || this);
    this._ghost = oGhost;
    if (this._ghost != null) {
        var gp = this._ghost.getParent();
        if (gp != null) gp.remove(this._ghost);
        this._ghost.setZIndex(999999);
        this._ghost.setVisible(false);
        this._continuousLayout = false;
    }
    this.addEventListener("mousedown", this._startResize, this);
}
_p = _biExtend(BiResizeHandle, BiComponent, "BiResizeHandle");
_p._handleFor = null;
_p._ghost = null;
_p._resizeDirection = "se";
_p._continuousLayout = true;
BiResizeHandle.addProperty("continuousLayout", BiAccessType.READ_WRITE);
BiResizeHandle.addProperty("ghost", BiAccessType.READ_WRITE);
BiResizeHandle.addProperty("handleFor", BiAccessType.READ);
_p.setHandleFor = function (o) {
    this._handleFor = o;
    var forWindow = (this._handleFor instanceof BiWindow) || (this._handleFor instanceof BiApplicationWindow);
    if (forWindow) this.setCursor(BiResizeHandle._getCursor("se"));
    this._image.setVisible(forWindow);
};
_p.setResizeDirection = function (sDir) {
    this._resizeDirection = sDir;
    var forWindow = (this._handleFor instanceof BiWindow) || (this._handleFor instanceof BiApplicationWindow);
    if (!forWindow) this.setCursor(BiResizeHandle._getCursor(sDir));
};
BiResizeHandle._getCursor = function (sResizeDir) {
    if (BiBrowserCheck.ie) return sResizeDir + "-resize";
    switch (sResizeDir) {
    case "ne":
    case "sw":
        return "nesw-resize";
    case "nw":
    case "se":
        return "nwse-resize";
    case "n":
    case "s":
        return "ns-resize";
    case "e":
    case "w":
        return "ew-resize";
    default:
        return "";
    }
};
BiResizeHandle.addProperty("resizeDirection", BiAccessType.READ);
_p.startResize = function (sDir, e) {
    if (sDir) this.setResizeDirection(sDir);
    this._startResize(e);
};
_p._startResize = function (e) {
    if (!this._handleFor) return;
    if (this.dispatchEvent("resizestart")) {
        var c = this._continuousLayout ? this._handleFor : this._ghost;
        var appWin = application.getWindow();
        var oldWindowCursor = appWin.getCursor();
        appWin.setCursor(BiResizeHandle._getCursor(this._resizeDirection));
        if (!this._continuousLayout) {
            BiComponent.prototype.add.call(this._handleFor.getParent(), c, null, true);
            c.setLocation(this._handleFor.getLeft(), this._handleFor.getTop());
            c.setSize(this._handleFor.getWidth(), this._handleFor.getHeight());
            c.setMinimumWidth(this._handleFor.getMinimumWidth());
            c.setMinimumHeight(this._handleFor.getMinimumHeight());
            c.setMaximumWidth(this._handleFor.getMaximumWidth());
            c.setMaximumHeight(this._handleFor.getMaximumHeight());
        }
        c.addEventListener("mouseup", this._endResize, this);
        c.addEventListener("losecapture", this._endResize, this);
        c.setCapture(true);
        this._resizeData = {
            startX: c.getLeft(),
            startY: c.getTop(),
            startW: c.getWidth(),
            startH: c.getHeight(),
            windowCursor: oldWindowCursor
        };
        var p = c.getParent();
        if (p) {
            p._showGlassPane();
            if (!this._continuousLayout) {
                c.addEventListener("mousemove", this._initiateResize, this);
            }
            c.addEventListener("mousemove", this._continueResize, this);
            var r = BiComponent._getElementPositionInFrame(p._element);
            this._resizeData.limit = {
                left: r.x,
                top: r.y,
                width: p.getClientWidth() - 1,
                height: p.getClientHeight() - 1
            };
        } else {
            c.addEventListener("mousemove", this._continueResizeWindow, this);
            this._resizeData.screenX = e.getScreenX();
            this._resizeData.screenY = e.getScreenY();
        }
        e.preventDefault();
    }
};
_p._initiateResize = function () {
    var c = this._continuousLayout ? this._handleFor : this._ghost;
    c.setVisible(true);
    c.removeEventListener("mousemove", this._initiateResize, this);
};
_p._continueResize = function (e) {
    var dir = this._resizeDirection;
    var c = this._continuousLayout ? this._handleFor : this._ghost;
    var width = this._resizeData.startW;
    var height = this._resizeData.startH;
    var left = this._resizeData.startX;
    var top = this._resizeData.startY;
    var x = Math.min(Math.max(e.getClientX() - this._resizeData.limit.left, 0), this._resizeData.limit.width);
    var y = Math.min(Math.max(e.getClientY() - this._resizeData.limit.top, 0), this._resizeData.limit.height);
    if (/e/i.test(dir)) {
        width = Math.max(Number(c.getMinimumWidth()), Math.min(Number(c.getMaximumWidth()), x - this._resizeData.startX));
    } else if (/w/i.test(dir)) {
        width = Math.max(Number(c.getMinimumWidth()), Math.min(Number(c.getMaximumWidth()), this._resizeData.startW + this._resizeData.startX - x));
        left = this._resizeData.startX + this._resizeData.startW - width;
    }
    if (/s/i.test(dir)) {
        height = Math.max(Number(c.getMinimumHeight()), Math.min(Number(c.getMaximumHeight()), y - this._resizeData.startY));
    } else if (/n/i.test(dir)) {
        height = Math.max(Number(c.getMinimumHeight()), Math.min(Number(c.getMaximumHeight()), this._resizeData.startH + this._resizeData.startY - y));
        top = this._resizeData.startY + this._resizeData.startH - height;
    }
    if (this.dispatchEvent(new BiResizeEvent("beforeresize", left, top, width, height))) {
        c.setSize(width, height);
        c.setLocation(left, top);
        this.dispatchEvent(new BiResizeEvent("resize", left, top, width, height));
    }
    e.preventDefault();
};
_p._continueResizeWindow = function (e) {
    var dir = this._resizeDirection;
    var x = e.getScreenX() - this._resizeData.screenX;
    var y = e.getScreenY() - this._resizeData.screenY;
    var dx = 0;
    var dy = 0;
    var dw = 0;
    var dh = 0;
    if (/e/i.test(dir)) {
        dw = x;
    } else if (/w/i.test(dir)) {
        dw = -x;
        dx = x;
    }
    if (/s/i.test(dir)) {
        dh = y;
    } else if (/n/i.test(dir)) {
        dh = -y;
        dy = y;
    }
    var width = this._resizeData.startW + dw;
    var height = this._resizeData.startH + dh;
    var left = this._resizeData.startX + dx;
    var top = this._resizeData.startY + dy;
    if (this.dispatchEvent(new BiResizeEvent("beforeresize", left, top, width, height))) {
        var c = this._continuousLayout ? this._handleFor : this._ghost;
        c._resizeTo(width, height);
        c._moveTo(left, top);
        this.dispatchEvent(new BiResizeEvent("resize", left, top, width, height));
    }
    e.preventDefault();
};
_p._endResize = function (e) {
    var c = !this._continuousLayout ? this._ghost : this._handleFor;
    c.removeEventListener("mousemove", this._continueResize, this);
    c.removeEventListener("mousemove", this._continueResizeWindow, this);
    c.removeEventListener("mouseup", this._endResize, this);
    c.removeEventListener("losecapture", this._endResize, this);
    c.setCapture(false);
    if (c._parent) {
        c._parent._hideGlassPane();
    }
    if (!this._continuousLayout) {
        this._handleFor.setSize(c.getWidth(), c.getHeight());
        this._handleFor.setLocation(c.getLeft(), c.getTop());
        c.removeEventListener("mousemove", this._initiateResize, this);
        c.setVisible(false);
        BiComponent.prototype.remove.call(c.getParent(), c);
    }
    application.getWindow().setCursor(this._resizeData.windowCursor);
    this._resizeData = null;
    this.dispatchEvent("resizeend");
    e.preventDefault();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._handleFor = null;
    this._resizeData = null;
    this.disposeFields("_ghost");
};
_p.getResizing = function () {
    return this._resizeData != null;
};
_p.setAttribute = function (sName, sValue, oXmlResourceParser) {
    switch (sName) {
    case "handleFor":
        if (sValue.charAt(0) == "#") sValue = sValue.substr(1);
        var c = oXmlResourceParser.getComponentById(sValue);
        this.setHandleFor(c);
        break;
    default:
        BiComponent.prototype.setAttribute.apply(this, arguments);
    }
};

function BiWindow(sCaption) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.makeThemeAware();
    this.setSize(400, 200);
    this.setTabIndex(0);
    this.setHideFocus(true);
    this._chrome = new BiComponent;
    this._chrome.setProperties({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        cssClassName: "bi-window",
        appearance: "window"
    });
    this._commands = {};
    this._windowCaption = new BiComponent;
    this._windowCaption.setCssClassName("bi-window-caption");
    this._windowCaption.setAppearance("window-caption");
    this._windowIcon = new BiImage(this._getDefaultIcon(), 16, 16);
    this._captionLabel = new BiLabel(sCaption);
    this._minimizeButton = new BiButton();
    this._minimizeButton._tagName = "DIV";
    this._minimizeButton.setAppearance("window-minimize-button");
    this._minimizeButton.setTabIndex(-1);
    this._minimizeButton._themeKey = BiTheme.KEYS.windowControlButton;
    this._maximizeButton = new BiButton();
    this._maximizeButton._tagName = "DIV";
    this._maximizeButton.setAppearance("window-maximize-button");
    this._maximizeButton.setTabIndex(-1);
    this._maximizeButton._themeKey = BiTheme.KEYS.windowControlButton;
    this._closeButton = new BiButton();
    this._closeButton._tagName = "DIV";
    this._closeButton.setAppearance("window-close-button");
    this._closeButton.setTabIndex(-1);
    this._closeButton._themeKey = BiTheme.KEYS.windowControlButton;
    this._contentPane = new BiComponent;
    this._contentPane.setAppearance("window-content-pane");
    this.setCursor("default");
    this._windowCaption.add(this._windowIcon);
    this._windowCaption.add(this._captionLabel);
    this._windowCaption.add(this._minimizeButton);
    this._windowCaption.add(this._maximizeButton);
    this._windowCaption.add(this._closeButton);
    this._chrome.add(this._windowCaption);
    this._chrome.add(this._contentPane);
    BiComponent.prototype.add.call(this, this._chrome);
    this._fixedLayout();
    this._wireFrame = new BiComponent();
    this._wireFrame.setAppearance("window-wireframe");
    this._resizeHandler = new BiResizeHandle(this, this._wireFrame);
    this._moveHandler = new BiMoveHandle(this, this._wireFrame);
    this._captionLabel.addEventListener("mousedown", this._onCaptionDown, this);
    this._minimizeButton.addEventListener("click", this._onMinimizeButtonClick, this);
    this._maximizeButton.addEventListener("click", this._onMaximizeButtonClick, this);
    this._closeButton.addEventListener("click", this._onCloseButtonClick, this);
    this._captionLabel.addEventListener("dblclick", this._onMaximizeButtonClick, this);
    this._windowIcon.addEventListener("dblclick", this._onCloseButtonClick, this);
    this.addEventListener("mousemove", this._checkForResize);
    this.addEventListener("mousedown", this._onEdgeDown);
    this.addEventListener("focusin", this._onFocusIn);
    this.addEventListener("focusout", this._onFocusOut);
    this.addEventListener("focus", this._onFocus);
    this.addEventListener("beforeclose", this._closeWireFrame, this);
    this._captionLabel.addEventListener("contextmenu", this._showWindowMenu, this);
    this._windowIcon.addEventListener("contextmenu", this._showWindowMenu, this);
    this._windowIcon.addEventListener("mousedown", this._showWindowMenu, this);
    this.addEventListener("mouseover", this._onMouseEvent);
    this.addEventListener("mousemove", this._onMouseEvent);
    this.addEventListener("mouseout", this._onMouseEvent);
    this.addEventListener("mousedown", this._onMouseEvent);
    this.addEventListener("mouseup", this._onMouseEvent);
    this.addEventListener("click", this._onMouseEvent);
    this.addEventListener("dblclick", this._onMouseEvent);
    this.addEventListener("contextmenu", this._onMouseEvent);
    this.addEventListener("mousewheel", this._onMouseEvent);
    if (BiBrowserCheck.moz) this.addEventListener("keypress", this._onkeydown);
    else this.addEventListener("keydown", this._onkeydown);
    this.addEventListener("keyup", this._onkeyup);
    this.addEventListener("keydown", this._onDefaultButtonKeyDown);
    this.addEventListener("keydown", this._onKeyEvent);
    this.addEventListener("keypress", this._onKeyEvent);
    this.addEventListener("keyup", this._onKeyEvent);
}
_p = _biExtend(BiWindow, BiComponent, "BiWindow");
_p._themeKey = BiTheme.KEYS.window;
_p._showIcon = true;
_p._showMinimize = true;
_p._showMaximize = true;
_p._showClose = true;
_p._canMinimize = true;
_p._canClose = true;
_p._resizable = true;
_p._movable = true;
_p._state = "normal";
_p._icon = null;
_p._activeComponent = null;
_p._lastActive = null;
_p._hideChrome = false;
_p._continuousLayout = false;
_p._wireFrame = null;
_p._minimumWidth = 120;
_p._maximumWidth = Infinity;
_p._minimumHeight = 120;
_p._maximumHeight = Infinity;
_p._disposeOnClose = true;
_p._layoutGeometry = {
    showChrome: {
        cp_top: 21,
        cp_left: 2,
        cp_right: 2,
        cp_bottom: 2,
        mb_left: 0,
        mb_right: 0
    },
    hideChrome: {
        cp_left: 0,
        cp_right: 0,
        cp_top: 0,
        cp_bottom: 0,
        mb_left: 0,
        mb_right: 0
    },
    maximized: {
        left: -4,
        right: -4,
        top: -4,
        bottom: -4
    }
};
BiWindow.addProperty("menuBar", BiAccessType.READ_WRITE);
BiWindow.addProperty("disposeOnClose", BiAccessType.READ_WRITE);
BiWindow.addProperty("canClose", BiAccessType.READ);
_p.setCanClose = function (b) {
    if (this._canClose != b) {
        this._canClose = b;
        this._closeButton.setEnabled(b);
    }
};
_p.setTop = function (n) {
    BiComponent.prototype.setTop.call(this, Math.max(n, 0));
};
_p.setLocation = function (nLeft, nTop) {
    BiComponent.prototype.setLocation.call(this, nLeft, Math.max(nTop, 0));
};
_p.addMenuBar = function (oMenuBar) {
    if (this._menuBar) this._chrome.remove(this._menuBar);
    this.setMenuBar(oMenuBar);
    if (this._menuBar) this._chrome.add(this._menuBar);
    this._setContentPaneSize();
};
BiWindow.addProperty("continuousLayout", BiAccessType.READ);
BiWindow.addProperty("wireFrame", BiAccessType.READ);
_p.setContinuousLayout = function (b) {
    if (b != this._continuousLayout) {
        this._continuousLayout = b;
        this._resizeHandler.setContinuousLayout(b);
        this._moveHandler.setContinuousLayout(b);
    }
};
_p._closeWireFrame = function (e) {
    if (!this._continuousLayout) {
        if (this._moveHandler.getMoving()) {
            this._moveHandler._endMove();
        } else if (this._resizeHandler.getResizing()) {
            this._resizeHandler._endResize();
        }
    }
};
_p._getDefaultIcon = function () {
    return application.getTheme().getAppearanceProperty("window", "default-icon");
};
_p.layoutAllChildren = function () {
    BiComponent.prototype.layoutAllChildren.call(this);
    this._layoutChrome();
};
_p._fixedLayout = function () {
    this._windowCaption.setLocation(2, 2);
    this._windowCaption.setRight(2);
    this._windowCaption.setHeight(19);
    this._windowIcon.setLocation(2, 1);
    this._minimizeButton.setSize(16, 14);
    this._maximizeButton.setSize(16, 14);
    this._closeButton.setSize(16, 14);
    this._minimizeButton.setTop(2);
    this._maximizeButton.setTop(2);
    this._closeButton.setTop(2);
    this._closeButton.setRight(2);
    this._setContentPaneSize();
    this._captionLabel.setTop(0);
    this._captionLabel.setBottom(0);
    this._windowIcon.setVisible(this._showIcon);
    this._minimizeButton.setVisible(this._showMinimize);
    this._maximizeButton.setVisible(this._showMaximize);
    this._closeButton.setVisible(this._showClose);
};
_p._layoutChrome = function () {
    if (this._showIcon) this._captionLabel.setLeft(18);
    else this._captionLabel.setLeft(0);
    var r = 2;
    var w = this._closeButton._width || this._closeButton.getWidth();
    w += 2;
    if (this._showClose) r += w;
    this._maximizeButton.setRight(r);
    if (this._showMaximize) r += w;
    this._minimizeButton.setRight(r);
    if (this._showMinimize) r += w;
    r += 2;
    this._captionLabel.setRight(r);
};
BiWindow.addProperty("contentPane", BiAccessType.READ);
_p.setContentPane = function (oComp) {
    if (oComp && oComp != this._contentPane) {
        this._chrome.add(oComp, this._contentPane);
        this._chrome.remove(this._contentPane);
        this._contentPane = oComp;
        this._setContentPaneSize();
        oComp.setCursor("default");
    }
};
BiWindow.addProperty("showIcon", BiAccessType.READ);
_p.setShowIcon = function (b) {
    if (this._showIcon != b) {
        this._showIcon = b;
        this._windowIcon.setVisible(b);
        this._layoutChrome();
    }
};
BiWindow.addProperty("showMinimize", BiAccessType.READ);
_p.setShowMinimize = function (b) {
    if (this._showMinimize != b) {
        this._showMinimize = b;
        this._minimizeButton.setVisible(b);
        this._layoutChrome();
    }
};
BiWindow.addProperty("showMaximize", BiAccessType.READ);
_p.setShowMaximize = function (b) {
    if (this._showMaximize != b) {
        this._showMaximize = b;
        this._maximizeButton.setVisible(b);
        this._layoutChrome();
    }
};
BiWindow.addProperty("showClose", BiAccessType.READ);
_p.setShowClose = function (b) {
    if (this._showClose != b) {
        this._showClose = b;
        this._closeButton.setVisible(b);
        this._layoutChrome();
    }
};
_p.setCaption = function (sCaption) {
    var oldCaption = this._captionLabel.getText();
    this._captionLabel.setText(sCaption);
    if (oldCaption != this._captionLabel.getText()) this.dispatchEvent("captionchanged");
};
_p.getCaption = function () {
    return this._captionLabel.getText();
};
_p.getIcon = function () {
    if (this._icon == null) this._icon = new BiImage(this._windowIcon.getUri(), 16, 16);
    return this._icon;
};
_p.setIcon = function (oImage) {
    if (oImage == null) oImage = new BiImage(this._getDefaultIcon(), 16, 16);
    var oldUri = this.getIcon().getUri();
    this._windowIcon.setUri(oImage.getUri());
    this._icon = oImage;
    if (oldUri != oImage.getUri()) this.dispatchEvent("iconchanged");
};
_p.setVisible = function (bBoolean) {
    if (!bBoolean && this._windowMenu) this._windowMenu.setVisible(false);
    if (this._windowManager) {
        if (bBoolean) this._windowManager._addWindowToVisible(this);
        else this._windowManager._removeWindowFromVisible(this);
    }
    BiComponent.prototype.setVisible.call(this, bBoolean);
};
BiWindow.addProperty("canMinimize", BiAccessType.READ);
_p.setCanMinimize = function (b) {
    if (this._canMinimize != b) {
        this._canMinimize = b;
        this._minimizeButton.setEnabled(b);
    }
};
BiWindow.addProperty("hideChrome", BiAccessType.READ);
_p.setHideChrome = function (b) {
    if (this._hideChrome != b) {
        this._hideChrome = b;
        this._windowCaption.setVisible(!b);
        this._setContentPaneSize();
    }
};
_p._setContentPaneSize = function () {
    var mb = this._menuBar;
    var measureMb = mb && mb._parent == this._chrome;
    if (measureMb && !mb.getCreated()) {
        mb.addEventListener("create", this._setContentPaneSize, this);
        return;
    }
    var menuHeight = measureMb ? mb.getPreferredHeight() : 0;
    var g = this._hideChrome ? this._layoutGeometry.hideChrome : this._layoutGeometry.showChrome;
    this._contentPane.setRight(g.cp_right);
    this._contentPane.setLeft(g.cp_left);
    this._contentPane.setTop(g.cp_top + menuHeight);
    this._contentPane.setBottom(g.cp_bottom);
    if (mb) {
        mb.setLocation(g.mb_left, g.cp_top);
        mb.setRight(g.mb_right);
    }
};
BiWindow.addProperty("resizable", BiAccessType.READ);
_p.setResizable = function (b) {
    if (this._resizable != b) {
        this._resizable = b;
        this._maximizeButton.setEnabled(b);
    }
};
BiWindow.addProperty("movable", BiAccessType.WRITE);
_p.getMovable = function () {
    return this.getState() == "normal" && this._movable;
};
_p._computePreferredWidth = function () {
    return this._chrome.getInsetLeft() + this._contentPane.getLeft() + this._contentPane.getPreferredWidth() + this._contentPane.getRight() + this._chrome.getInsetRight();
};
_p._computePreferredHeight = function () {
    return this._chrome.getInsetTop() + this._contentPane.getTop() + this._contentPane.getPreferredHeight() + this._contentPane.getBottom() + this._chrome.getInsetBottom();
};
_p.layoutComponent = function () {
    if (this._width != null) this._width = Math.max(this.getMinimumWidth(), Math.min(this.getMaximumWidth(), this._width));
    if (this._height != null) this._height = Math.max(this.getMinimumHeight(), Math.min(this.getMaximumHeight(), this._height));
    BiComponent.prototype.layoutComponent.call(this);
};
_p.close = function () {
    var rv = this.dispatchEvent("beforeclose");
    if (rv) {
        this.setVisible(false);
        this.dispatchEvent("close");
        if (this.getDisposeOnClose()) this.dispose();
    }
};
BiWindow.addProperty("state", BiAccessType.READ);
_p.setState = function (s) {
    if (this._state == s) return;
    if (s == "minimized" && !this._canMinimize || s == "maximized" && !this._resizable) return;
    if (s == "minimized") this.dispatchEvent("beforeminimize");
    if (s == "maximized") this.dispatchEvent("beforemaximize");
    if (s == "normal") this.dispatchEvent("beforenormal");
    if (this._state != s) {
        if (this._state == "normal") {
            this._normalWidth = this.getWidth();
            this._normalHeight = this.getHeight();
            this._normalLeft = this.getLeft();
            this._normalTop = this.getTop();
            if (this._normalLeft == null) this._normalLeft = 0;
            if (this._normalTop == null) this._normalTop = 0;
        }
        this._state = s;
        this.setVisible(this._state != "minimized");
        this._setState(s);
        this.dispatchEvent("statechanged");
    }
};
_p._setState = function (s) {
    var ismaxed = this._state == "maximized";
    if (ismaxed) {
        var g = this._layoutGeometry.maximized;
        this.setLocation(g.left, g.top);
        this.setRight(g.right);
        this.setBottom(g.bottom);
        this._maximizeButton.setAppearance("window-restore-button");
        this._setCursor("default");
    } else if (this._state == "normal" && this._normalLeft != null) {
        this.setLocation(this._normalLeft, this._normalTop);
        this.setRight(null);
        this.setBottom(null);
        this.setSize(this._normalWidth, this._normalHeight);
        this._maximizeButton.setAppearance("window-maximize-button");
    }
    this._resizeHandler.setHandleFor(ismaxed ? null : this);
};
BiWindow.addProperty("active", BiAccessType.READ);
_p.setActive = function (b) {
    if (this._active != b) {
        this._active = b;
        this._chrome.setCssClassName("bi-window" + (b ? " active" : ""));
        var tm = application.getThemeManager();
        if (b) {
            tm.addState(this._chrome, "active");
            this.bringToFront();
            var ac = this.getActiveComponent();
            if (ac && ac.getCanFocus()) {
                ac.setFocused(true);
            } else {
                this.setFocused(true);
            }
            this.dispatchEvent("activated");
        } else {
            tm.removeState(this._chrome, "active");
            this.setFocused(false);
            this.dispatchEvent("deactivated");
        }
        tm.applyAppearance(this._chrome);
    }
};
_p.bringToFront = function () {
    var p = this._parent;
    if (this.getCreated() && p) {
        var cs = p.getChildren();
        var max = -Infinity;
        for (var i = 0; i < cs.length; i++) max = Math.max(max, cs[i].getZIndex());
    }
    this.setZIndex(max + 1);
    this._wireFrame.setZIndex(max + 2);
};
_p.sendToBack = function () {
    var p = this._parent;
    if (this.getCreated() && p) {
        var cs = p.getChildren();
        var min = Infinity;
        for (var i = 0; i < cs.length; i++) min = Math.min(min, cs[i].getZIndex());
    }
    this.setZIndex(min - 1);
    this._wireFrame.setZIndex(min - 1);
};
_p.getFocusRoot = function () {
    return this;
};
_p.isFocusRoot = function () {
    return true;
};
_p.getActiveComponent = function () {
    if (this._activeComponent && this._activeComponent.getDisposed()) this._activeComponent = null;
    return this._activeComponent;
};
BiWindow.addProperty("acceptButton", BiAccessType.READ_WRITE);
BiWindow.addProperty("cancelButton", BiAccessType.READ_WRITE);
_p.addCommand = function (c) {
    if (c.getOwnerWindow()) {
        c.getOwnerWindow().removeCommand(c);
    }
    this._commands[c.toHashCode()] = c;
    c._ownerWindow = this;
};
_p.removeCommand = function (c) {
    if (c._ownerWindow != this) throw new Error("Can only remove owned commands");
    delete this._commands[c.toHashCode()];
    c._ownerWindow = null;
};
BiWindow.addProperty("opaque", BiAccessType.READ);
_p.setOpaque = function (b) {
    if (this._opaque != b) {
        this._opaque = b;
        if (b) {
            if (!this._opaqueIframe) {
                this._opaqueIframe = new BiIframe(application.getPath() + "blank.html");
                this._opaqueIframe.setHtmlProperty("allowTransparency", false);
                if (application.getAccessibilityMode()) this._opaqueIframe.setProperties({
                    opacity: 99,
                    left: -2,
                    right: -2,
                    top: -2,
                    bottom: -2
                });
                else this._opaqueIframe.setProperties({
                    opacity: 0,
                    left: -2,
                    right: -2,
                    top: -2,
                    bottom: -2
                });
                this.add(this._opaqueIframe, this.getFirstChild(), true);
            }
        } else {
            if (this._opaqueIframe) {
                this.remove(this._opaqueIframe);
                this._opaqueIframe.dispose();
                delete this._opaqueIframe;
            }
        }
    }
};
_p.setBorder = function (oBorder) {
    this._chrome.setBorder(oBorder);
};
_p.getBorder = function () {
    return this._chrome.getBorder();
};
_p.setAppearance = function (sName) {
    this._chrome.setAppearance(sName);
};
_p.getAppearance = function () {
    return this._chrome.getAppearance();
};
_p._onCloseButtonClick = function (e) {
    if (this._canClose) this.close();
};
_p._onMinimizeButtonClick = function (e) {
    if (this._canMinimize) this.setState("minimized");
};
_p._onMaximizeButtonClick = function (e) {
    if (this._resizable) {
        if (this.getState() == "normal") this.setState("maximized");
        else this.setState("normal");
    }
};
_p._onCaptionDown = function (e) {
    this.setActive(true);
    if (!this.getMovable() || e.getButton() != BiMouseEvent.LEFT) return;
    this._moveHandler.startMove(e);
};
_p._onMouseEvent = function (e) {
    e.stopPropagation();
};
_p._checkForResize = function (e) {
    if (this._resizeData || this._state == "maximized") return;
    this._resizeDir = "";
    if (this._moveData == null && e.getTarget() == this._chrome) {
        if (this.getResizable()) {
            var oy = e.getOffsetY();
            if (oy <= 20) this._resizeDir += "n";
            else if (oy >= this.getHeight() - 20) this._resizeDir += "s";
            var ox = e.getOffsetX();
            if (ox <= 20) this._resizeDir += "w";
            else if (ox >= this.getWidth() - 20) this._resizeDir += "e";
        }
        if (this._resizeDir != "") this._setCursor(BiResizeHandle._getCursor(this._resizeDir));
        else this._setCursor("default");
    }
};
_p._onEdgeDown = function (e) {
    this.setActive(true);
    if (e.getButton() == BiMouseEvent.LEFT && this._resizeDir != "" && e.getTarget() == this._chrome) {
        this._resizeHandler.startResize(this._resizeDir, e);
    }
};
_p._onFocus = function (e) {
    if (this._lastActive && this.contains(this._lastActive) && this._lastActive.getCanFocus()) {
        this._lastActive.setFocused(true);
    }
};
_p._onFocusIn = function (e) {
    if (e.getTarget() != this) this._lastActive = e.getTarget();
    this.setActive(true);
    e.stopPropagation();
};
_p._onFocusOut = function (e) {
    var rt = e.getRelatedTarget();
    if (this.contains(rt) || (rt && rt._isMenu)) return;
    else this.setActive(false);
    e.stopPropagation();
};
_p._onkeyup = function (e) {
    if (this._menuBar && e.matchesBundleShortcut("window.menu")) this._menuBar.toggleFocus();
    else if (this._windowIcon && e.matchesBundleShortcut("window.iconmenu")) {
        this.getWindowMenu().popupAtComponent(this._windowIcon);
    }
};
_p._onkeydown = function (e) {
    application.getFocusManager().processKeyEvent(this, e);
    if (!this._windowManager && (e.matchesBundleShortcut("window.next") || e.matchesBundleShortcut("window.previous"))) {
        e.preventDefault();
    } else if (e.matchesBundleShortcut("window.close")) {
        e.preventDefault();
        if (this._canClose) this.close();
    } else if (e.matchesBundleShortcut("focus.moveout")) {
        e.preventDefault();
        if (this._parent.getCanFocus()) this._parent.setFocused(true);
    } else if (e.matchesBundleModifiers("menu.accesskey") && this._showMenuByMnemonic(String.fromCharCode(e.getKeyCode()))) {
        if (!BiBrowserCheck.ie) e.preventDefault();
    }
};
_p._showMenuByMnemonic = function (key) {
    if (this._menuBar && this._menuBar.showMenuByMnemonic(key)) return true;
    else {
        var p = this._parent;
        while (!p._showMenuByMnemonic) p = p._parent;
        return p._showMenuByMnemonic(key);
    }
};
_p._getCanExecute = function (oCommand) {
    return oCommand.getOwnerWindow() == this || oCommand.getShortcutBubbles();
};
_p._onDefaultButtonKeyDown = function (e) {
    var c;
    var w = this;
    while (w) {
        for (var hc in w._commands) {
            c = w._commands[hc];
            var enabled = c.getEnabled() && this._getCanExecute(c);
            if (enabled && c.matchesKeyboardEvent(e)) {
                if (!c.execute()) e.preventDefault();
            }
        }
        var p = w.getParent();
        w = p ? p.getFocusRoot() : null;
    }
    var t = e.getTarget();
    if (!t.getAcceptsEnter() && e.matchesBundleShortcut("controls.accept")) this._triggerDefaultAction(e, "_acceptButton");
    else if (!t.getAcceptsEsc() && e.matchesBundleShortcut("controls.cancel")) this._triggerDefaultAction(e, "_cancelButton");
};
_p._triggerDefaultAction = function (e, sButton) {
    var button = this[sButton];
    if (button && button.getEnabled()) {
        button.dispatchEvent("action");
        button = this[sButton];
        var cmd = button && typeof button.getCommand == "function" && button.getCommand();
        if (cmd) cmd.execute();
        e.preventDefault();
        e.stopPropagation();
    }
};
_p._onKeyEvent = function (e) {
    e.stopPropagation();
};
_p._disposeCheck = function (oChild) {
    var p = oChild.getParent ? oChild.getParent() : null;
    while (p && p != this._contentPane) {
        p = p.getParent();
    }
    return p == this._contentPane;
};
_p.dispose = function () {
    if (this._disposed) return;
    if (this._activeComponent) {
        if (!this._disposeCheck(this._activeComponent)) {
            this._activeComponent = null;
        }
    }
    if (this._lastActive) {
        if (!this._disposeCheck(this._lastActive)) {
            this._lastActive = null;
        }
    }
    try {
        this._element.outerHTML = BiString.EMPTY;
    } catch (ex) {}
    BiComponent.prototype.dispose.call(this);
    for (var c in this._commands) {
        this._commands[c].dispose();
        delete this._commands[c];
    }
    delete this._commands;
    if (this._windowManager) {
        this._windowManager.remove(this);
        delete this._windowManager;
    }
    this.disposeFields("_resizeHandler", "_moveHandler", "_opaqueIframe", "_activeComponent", "_lastActive", "_icon", "_acceptButton", "_cancelButton", "_chrome", "_windowCaption", "_windowIcon", "_captionLabel", "_minimizeButton", "_maximizeButton", "_closeButton", "_contentPane", "_windowMenu", "_restoreMenuItem", "_minimizeMenuItem", "_maximizeMenuItem", "_closeMenuSeparator", "_closeMenuItem", "_wireFrame");
};
_p.addParsedObject = function (o) {
    if (o instanceof BiMenuBar) this.addMenuBar(o);
    else if (o instanceof BiComponent) this._contentPane.add(o);
    else if (o instanceof BiCommand) this.addCommand(o);
    else BiComponent.prototype.addParsedObject.call(this, o);
};
_p._showWindowMenu = function (e) {
    var m = this.getWindowMenu();
    if (this._restoreMenuItem.getVisible() || this._minimizeMenuItem.getVisible() || this._maximizeMenuItem.getVisible() || this._closeMenuItem.getVisible()) {
        if (e.getType() != "contextmenu" && e.getButton() == BiMouseEvent.LEFT) {
            m.popupAtComponent(this._windowIcon);
        } else {
            m.popupAtMouse(e);
        }
        e.preventDefault();
    }
};
_p.getWindowMenu = function () {
    if (!this._windowMenu) {
        var m = this._windowMenu = new BiMenu;
        this._restoreMenuItem = new BiMenuItem;
        m.add(this._restoreMenuItem);
        this._minimizeMenuItem = new BiMenuItem;
        m.add(this._minimizeMenuItem);
        this._maximizeMenuItem = new BiMenuItem;
        m.add(this._maximizeMenuItem);
        this._closeMenuSeparator = new BiMenuSeparator;
        this._windowMenu.add(this._closeMenuSeparator);
        this._closeMenuItem = new BiMenuItem;
        m.add(this._closeMenuItem);
        application.getStringBundle().addEventListener("change", this._updateStrings, this);
        this._updateStrings();
        this._restoreMenuItem.addEventListener("action", this._restore, this);
        this._minimizeMenuItem.addEventListener("action", this._minimize, this);
        this._maximizeMenuItem.addEventListener("action", this._maximize, this);
        this._closeMenuItem.addEventListener("action", this.close, this);
    }
    this._syncWindowMenu();
    return this._windowMenu;
};
_p._restore = function () {
    this.setState("normal");
    this.setActive(true);
};
_p._minimize = function () {
    this.setState("minimized");
};
_p._maximize = function () {
    this.setState("maximized");
    this.setActive(true);
};
_p._syncWindowMenu = function () {
    var showClose = this.getShowClose();
    var showMinimize = this.getShowMinimize();
    var showMaximize = this.getShowMaximize();
    var showRestore = showMinimize || showMaximize;
    var resizable = this.getResizable();
    this._restoreMenuItem.setEnabled(this._state == "minimized" || (resizable && this._state != "normal"));
    this._restoreMenuItem.setVisible(showRestore);
    this._minimizeMenuItem.setEnabled(this.getCanMinimize() && this._state != "minimized");
    this._minimizeMenuItem.setVisible(showMinimize);
    this._maximizeMenuItem.setEnabled(resizable && this._state != "maximized");
    this._maximizeMenuItem.setVisible(showMaximize);
    this._closeMenuItem.setEnabled(this.getCanClose());
    this._closeMenuItem.setVisible(showClose);
    this._closeMenuSeparator.setVisible((showRestore || showMinimize || showMaximize) && showClose);
};
_p._updateStrings = function () {
    if (!this._windowMenu) return;
    this._restoreMenuItem.setText(this._getString("WindowRestore"));
    this._restoreMenuItem.setMnemonic(this._getString("WindowRestoreMnemonic"));
    this._minimizeMenuItem.setText(this._getString("WindowMinimize"));
    this._minimizeMenuItem.setMnemonic(this._getString("WindowMinimizeMnemonic"));
    this._maximizeMenuItem.setText(this._getString("WindowMaximize"));
    this._maximizeMenuItem.setMnemonic(this._getString("WindowMaximizeMnemonic"));
    this._closeMenuItem.setText(this._getString("WindowClose"));
    this._closeMenuItem.setMnemonic(this._getString("WindowCloseMnemonic"));
};
BiWindow.addProperty("stringBundle", BiAccessType.READ_WRITE);
BiStringBundle._stringBundleMacro(_p, _p._updateStrings);
application.getStringBundle().appendBundle("en", {
    WindowRestore: "Restore",
    WindowRestoreMnemonic: "R",
    WindowMinimize: "Minimize",
    WindowMinimizeMnemonic: "n",
    WindowMaximize: "Maximize",
    WindowMaximizeMnemonic: "x",
    WindowClose: "Close",
    WindowCloseMnemonic: "C"
});
_p.setBackColor = function (s) {
    this.getContentPane().setBackColor(s);
};
_p.getBackColor = function () {
    return this.getContentPane().getBackColor();
};
_p.setForeColor = function (s) {
    this.getContentPane().setForeColor(s);
};
_p.getForeColor = function (s) {
    return this.getContentPane().getForeColor();
};
_p._setCursor = _p.setCursor;
_p.setCursor = function (s) {
    this.getContentPane().setCursor(s);
};
_p.getCursor = function () {
    return this.getContentPane().getCursor();
};
_p.setBackgroundImage = function (s) {
    this.getContentPane().setBackgroundImage(s);
};
_p.getBackgroundImage = function () {
    return this.getContentPane().getBackgroundImage();
};

function BiWindowManager(oComponent) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._windows = [];
    this._visibleWindows = [];
    this._menuItemsHash = {};
    this._lastStatesHash = {};
    this._component = oComponent;
}
_p = _biExtend(BiWindowManager, BiEventTarget, "BiWindowManager");
_p._component = null;
_p._lastLeft = 0;
_p._lastTop = 0;
_p._positionOffset = 25;
_p._activeWindow = null;
BiWindowManager.addProperty("component", BiAccessType.READ_WRITE);
BiWindowManager.addProperty("windows", BiAccessType.READ);
BiWindowManager.addProperty("activeWindow", BiAccessType.READ);
_p.setActiveWindow = function (oWindow) {
    if (oWindow != null) oWindow.setActive(true);
    else if (this._activeWindow != null) this._activeWindow.setActive(false);
};
_p.getWindowsMenu = function () {
    if (this._windowsMenu == null) this._createWindowsMenu();
    return this._windowsMenu;
};
_p.add = function (oWindow) {
    if (this._windows.contains(oWindow)) return;
    this._windows.push(oWindow);
    if (oWindow._left == null) this._positionWindowX(oWindow);
    if (oWindow._top == null) this._positionWindowY(oWindow);
    if (!oWindow._created || isNaN(parseInt(oWindow._element.style.zIndex))) oWindow.setZIndex(0);
    oWindow.addEventListener("close", this._onclose, this);
    oWindow.addEventListener("statechanged", this._onstatechanged, this);
    oWindow.addEventListener("activated", this._onactivatechanged, this);
    oWindow.addEventListener("deactivated", this._onactivatechanged, this);
    oWindow.addEventListener("captionchanged", this._oncaptionchanged, this);
    oWindow.addEventListener("keydown", this._onkeydown, this);
    if (oWindow.getActive()) {
        this._activeWindow = oWindow;
        this._visibleWindows.push(oWindow);
    } else if (oWindow._visible) {
        this._visibleWindows.insertBefore(oWindow, this._activeWindow);
    }
    if (this._windowsMenu) {
        var mi = new BiRadioButtonMenuItem(oWindow.getCaption(), oWindow.getActive());
        mi.addEventListener("action", this._onmenuitemaction, this);
        this._menuItemsHash[oWindow.toHashCode()] = mi;
        mi._menuItemForWindow = oWindow;
        if (this._windows.length > 0) this._separatorItem.setVisible(true);
        this._windowsMenu.add(mi);
    }
    this._lastStatesHash[oWindow.toHashCode()] = oWindow.getState() != "minimized" ? oWindow.getState() : "normal";
    oWindow._windowManager = this;
};
_p.remove = function (oWindow) {
    if (!this._windows.contains(oWindow)) return oWindow;
    var vc = this._windowsMenu;
    if (vc) vc = vc._viewComponent;
    if (vc && !vc.getDisposed()) {
        var mi = this._menuItemsHash[oWindow.toHashCode()];
        this._windowsMenu.remove(mi);
        mi._menuItemForWindow = null;
        mi.dispose();
    }
    oWindow.removeEventListener("close", this._onclose, this);
    oWindow.removeEventListener("statechanged", this._onstatechanged, this);
    oWindow.removeEventListener("activated", this._onactivatechanged, this);
    oWindow.removeEventListener("deactivated", this._onactivatechanged, this);
    oWindow.removeEventListener("captionchanged", this._oncaptionchanged, this);
    oWindow.removeEventListener("keydown", this._onkeydown, this);
    this._visibleWindows.remove(oWindow);
    if (this._activeWindow == oWindow) {
        this._activeWindow = null;
        this._activateLastVisible();
    }
    this._windows.remove(oWindow);
    if (vc && !vc.getDisposed()) {
        delete this._menuItemsHash[oWindow.toHashCode()];
        if (this._windows.length == 0) this._separatorItem.setVisible(false);
    }
    delete oWindow._windowManager;
    return oWindow;
};
_p._addWindowToVisible = function (oWindow) {
    if (!this._windows.contains(oWindow)) this.add(oWindow);
    else {
        this._visibleWindows.remove(oWindow);
        this._visibleWindows.push(oWindow);
    }
};
_p._removeWindowFromVisible = function (oWindow) {
    this._visibleWindows.remove(oWindow);
};
_p._positionWindowX = function (oWindow) {
    if (!oWindow.getMovable()) return;
    if (oWindow.getCreated() && oWindow.getWidth() + this._lastLeft > this._component.getClientWidth()) this._lastLeft = 0;
    oWindow.setLeft(this._lastLeft);
    this._lastLeft += this._positionOffset;
};
_p._positionWindowY = function (oWindow) {
    if (!oWindow.getMovable()) return;
    if (oWindow.getCreated() && oWindow.getHeight() + this._lastTop > this._component.getClientHeight()) this._lastTop = 0;
    oWindow.setTop(this._lastTop);
    this._lastTop += this._positionOffset;
};
_p.cascade = function () {
    var sorted = this._getShownWindows();
    sorted.sort(this._compareByZIndex);
    this._lastLeft = 0;
    this._lastTop = 0;
    var w = this._component.getClientWidth() * 0.75;
    var h = this._component.getClientHeight() * 0.75;
    for (var i = 0; i < sorted.length; i++) {
        if (sorted[i].getState() == "maximized") sorted[i].setState("normal");
        if (sorted[i].getResizable()) sorted[i].setSize(w, h);
        this._positionWindowX(sorted[i]);
        this._positionWindowY(sorted[i]);
    }
};
_p.tileVertically = function () {
    var sorted = this._getShownWindows();
    sorted.sort(this._compareByZIndex);
    sorted.reverse();
    var l = sorted.length;
    if (l == 0) return;
    var cw = this._component.getClientWidth();
    var ch = this._component.getClientHeight();
    var w = cw / l;
    var x = 0;
    for (var i = 0; i < l; i++) {
        if (sorted[i].getState() == "maximized") sorted[i].setState("normal");
        if (sorted[i].getResizable() && sorted[i].getMovable()) sorted[i].setBounds(x, 0, w, ch);
        else if (sorted[i].getResizable()) sorted[i].setSize(w, ch);
        else if (sorted[i].getMovable()) sorted[i].setLocation(x, 0);
        x += w;
    }
};
_p.tileHorizontally = function () {
    var sorted = this._getShownWindows();
    sorted.sort(this._compareByZIndex);
    sorted.reverse();
    var l = sorted.length;
    if (l == 0) return;
    var cw = this._component.getClientWidth();
    var ch = this._component.getClientHeight();
    var h = ch / l;
    var y = 0;
    for (var i = 0; i < l; i++) {
        if (sorted[i].getState() == "maximized") sorted[i].setState("normal");
        if (sorted[i].getResizable() && sorted[i].getMovable()) sorted[i].setBounds(0, y, cw, h);
        else if (sorted[i].getResizable()) sorted[i].setSize(cw, h);
        else if (sorted[i].getMovable()) sorted[i].setLocation(0, y);
        y += h;
    }
};
_p.closeAll = function () {
    for (var i = this._windows.length - 1; i >= 0; i--) this._windows[i].close();
};
_p.minimizeAll = function () {
    for (var i = this._windows.length - 1; i >= 0; i--) this._windows[i].setState("minimized");
};
_p._compareByZIndex = function (w1, w2) {
    return w1.getZIndex() - w2.getZIndex();
};
_p.getLastState = function (oWindow) {
    return this._lastStatesHash[oWindow.toHashCode()];
};
_p._activateLastVisible = function () {
    var w = this._visibleWindows;
    var l = w.length;
    if (l > 0) {
        var nextWin = w[l - 1];
        if (nextWin.getIsVisible()) nextWin.setActive(true);
    }
};
_p.activateNext = function (oWindow) {
    var w = this._windows;
    var l = w.length;
    var i = oWindow == null ? -1 : w.indexOf(oWindow);
    var nextWin = w[(i + 1) % l];
    if (nextWin.getState() == "minimized") {
        nextWin.setState(this.getLastState(nextWin));
    } else if (!nextWin.getIsVisible()) {
        nextWin.setVisible(true);
    }
    nextWin.setActive(true);
};
_p.activatePrevious = function (oWindow) {
    var w = this._windows;
    var l = w.length;
    var i = oWindow == null ? -1 : w.indexOf(oWindow);
    var nextWin = w[(i - 1 + l) % l];
    if (nextWin.getState() == "minimized") {
        nextWin.setState(this.getLastState(nextWin));
    } else if (!nextWin.getIsVisible()) {
        nextWin.setVisible(true);
    }
    nextWin.setActive(true);
};
_p._createWindowsMenu = function () {
    this._windowsMenu = new BiMenu;
    this._cascadeItem = new BiMenuItem;
    this._cascadeItem.setIcon(new BiImage(application.getTheme().getAppearanceProperty("window-manager", "cascade-icon")));
    this._windowsMenu.add(this._cascadeItem);
    this._tileHorizontallyItem = new BiMenuItem;
    this._tileHorizontallyItem.setIcon(new BiImage(application.getTheme().getAppearanceProperty("window-manager", "tile-horizontally-icon")));
    this._windowsMenu.add(this._tileHorizontallyItem);
    this._tileVerticallyItem = new BiMenuItem;
    this._tileVerticallyItem.setIcon(new BiImage(application.getTheme().getAppearanceProperty("window-manager", "tile-vertically-icon")));
    this._windowsMenu.add(this._tileVerticallyItem);
    this._minimizeAllItem = new BiMenuItem;
    this._windowsMenu.add(this._minimizeAllItem);
    this._closeAllItem = new BiMenuItem;
    this._closeAllItem.setIcon(new BiImage(application.getTheme().getAppearanceProperty("window-manager", "close-all-icon")));
    this._windowsMenu.add(this._closeAllItem);
    this._separatorItem = new BiMenuSeparator;
    this._separatorItem.setVisible(false);
    this._windowsMenu.add(this._separatorItem);
    application.getStringBundle().addEventListener("change", this._updateStrings, this);
    this._updateStrings();
    this._cascadeItem.addEventListener("action", this.cascade, this);
    this._tileHorizontallyItem.addEventListener("action", this.tileHorizontally, this);
    this._tileVerticallyItem.addEventListener("action", this.tileVertically, this);
    this._minimizeAllItem.addEventListener("action", this.minimizeAll, this);
    this._closeAllItem.addEventListener("action", this.closeAll, this);
    for (var i = 0; i < this._windows.length; i++) {
        var win = this._windows[i];
        var mi = new BiRadioButtonMenuItem(win.getCaption(), win.getActive());
        mi.addEventListener("action", this._onmenuitemaction, this);
        this._menuItemsHash[win.toHashCode()] = mi;
        mi._menuItemForWindow = win;
        this._windowsMenu.add(mi);
    }
    if (this._windows.length > 0) this._separatorItem.setVisible(true);
    application.getThemeManager().addEventListener("themechanged", this._onThemeChanged, this);
};
_p._onThemeChanged = function () {
    var t = application.getTheme();
    this._cascadeItem.setIcon(new BiImage(t.getAppearanceProperty("window-manager", "cascade-icon")));
    this._tileHorizontallyItem.setIcon(new BiImage(t.getAppearanceProperty("window-manager", "tile-horizontally-icon")));
    this._tileVerticallyItem.setIcon(new BiImage(t.getAppearanceProperty("window-manager", "tile-vertically-icon")));
    this._closeAllItem.setIcon(new BiImage(t.getAppearanceProperty("window-manager", "close-all-icon")));
};
_p._updateStrings = function () {
    if (!this._windowsMenu) return;
    this._cascadeItem.setText(this._getString("WindowManagerCascade"));
    this._cascadeItem.setMnemonic(this._getString("WindowManagerCascadeMnemonic"));
    this._tileHorizontallyItem.setText(this._getString("WindowManagerTileHorizontally"));
    this._tileHorizontallyItem.setMnemonic(this._getString("WindowManagerTileHorizontallyMnemonic"));
    this._tileVerticallyItem.setText(this._getString("WindowManagerTileVertically"));
    this._tileVerticallyItem.setMnemonic(this._getString("WindowManagerTileVerticallyMnemonic"));
    this._tileVerticallyItem.setIcon(new BiImage(application.getTheme().getAppearanceProperty("window-manager", "tile-vertically-icon")));
    this._minimizeAllItem.setText(this._getString("WindowManagerMinimizeAll"));
    this._minimizeAllItem.setMnemonic(this._getString("WindowManagerMinimizeAllMnemonic"));
    this._closeAllItem.setText(this._getString("WindowManagerCloseAll"));
    this._closeAllItem.setMnemonic(this._getString("WindowManagerCloseAllMnemonic"));
};
_p._getShownWindows = function () {
    return this._visibleWindows;
};
_p._onclose = function (e) {
    var win = e.getTarget();
    this.remove(win);
};
_p._onstatechanged = function (e) {
    var win = e.getTarget();
    if (win.getState() != "minimized") {
        this._lastStatesHash[win.toHashCode()] = win.getState();
        this._addWindowToVisible(win);
    } else {
        this._removeWindowFromVisible(win);
        if (this._getShownWindows().length > 0 && this._activeWindow == null) {
            this._activateLastVisible();
        }
    }
};
_p._onmenuitemaction = function (e) {
    var mi = e.getTarget();
    var win = mi._menuItemForWindow;
    if (win.getState() == "minimized") win.setState(this.getLastState(win));
    win.setActive(true);
};
_p._onactivatechanged = function (e) {
    if (this.getActiveWindow() == null) {
        this.dispatchEvent("activation");
    }
    var win = e.getTarget();
    if (this._windowsMenu) {
        var mi = this._menuItemsHash[win.toHashCode()];
        mi.setValue(win.getActive());
    }
    if (this._activeWindow && win.getActive() && win != this._activeWindow) {
        this._activeWindow.setActive(false);
    }
    if (win.getActive()) {
        this._activeWindow = win;
        this._addWindowToVisible(win);
    } else if (win == this._activeWindow) {
        this._activeWindow = null;
        this.dispatchEvent("deactivation");
    }
};
_p._oncaptionchanged = function (e) {
    var win = e.getTarget();
    if (this._windowsMenu) {
        var mi = this._menuItemsHash[win.toHashCode()];
        mi.setText(win.getCaption());
    }
};
_p._onkeydown = function (e) {
    if (e.matchesBundleShortcut("window.next")) {
        this.activateNext(this._activeWindow);
        e.preventDefault();
    } else if (e.matchesBundleShortcut("window.previous")) {
        this.activatePrevious(this._activeWindow);
        e.preventDefault();
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    application.getStringBundle().removeEventListener("change", this._updateStrings, this);
    for (var i in this._menuItemsHash) {
        this._menuItemsHash[i].dispose();
        this._menuItemsHash[i] = null;
    }
    this._windows = null;
    this._menuItemsHash = null;
    this._lastStatesHash = null;
    this._component = null;
    this._activeWindow = null;
    if (this._windowsMenu && !this._windowsMenu.getDisposed()) {
        var cs = this._windowsMenu.getChildren();
        for (i = cs.length - 1; i >= 0; i--) {
            cs[i]._menuItemForWindow = null;
        }
        application.getThemeManager().removeEventListener("themechanged", this._onThemeChanged, this);
        this._windowsMenu.dispose();
    }
    this._windowsMenu = null;
};
BiWindowManager.addProperty("stringBundle", BiAccessType.READ_WRITE);
BiStringBundle._stringBundleMacro(_p, _p._updateStrings);
application.getStringBundle().appendBundle("en", {
    WindowManagerCascade: "Cascade",
    WindowManagerCascadeMnemonic: "s",
    WindowManagerTileHorizontally: "Tile Horizontally",
    WindowManagerTileHorizontallyMnemonic: "h",
    WindowManagerTileVertically: "Tile Vertically",
    WindowManagerTileVerticallyMnemonic: "v",
    WindowManagerMinimizeAll: "Minimize All",
    WindowManagerMinimizeAllMnemonic: "m",
    WindowManagerCloseAll: "Close All",
    WindowManagerCloseAllMnemonic: "a"
});

function BiDesktopPane() {
    if (_biInPrototype) return;
    this._windowManager = new BiWindowManager(this);
    BiComponent.call(this);
    this.setCssClassName("bi-desktop-pane");
    this.addEventListener("keydown", this._onKeyDown, this);
    this.setTabIndex(1);
}
_p = _biExtend(BiDesktopPane, BiComponent, "BiDesktopPane");
BiDesktopPane.addProperty("windowManager", BiAccessType.READ);
_p.add = function (oChild, oBefore, bAnon) {
    BiComponent.prototype.add.call(this, oChild, oBefore, bAnon);
    if (oChild instanceof BiWindow) this._windowManager.add(oChild);
};
_p.remove = function (oChild) {
    BiComponent.prototype.remove.call(this, oChild);
    if (oChild instanceof BiWindow) this._windowManager.remove(oChild);
    return oChild;
};
_p.getWindows = function () {
    return this._windowManager.getWindows();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._windowManager.dispose();
    this._windowManager = null;
};
_p._onKeyDown = function (e) {
    if (e.matchesBundleShortcut("focus.movein")) {
        this._windowManager._activateLastVisible();
        e.preventDefault();
    }
};

function BiOptionPane(oMessage, sMessageType, sOptionType, oImage, oOptions, oInitialValue) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setSize(250, 100);
    this._message = oMessage;
    this._messageComponent = BiOptionPane.getComponentFromObject(this._message);
    this._messageType = sMessageType || "plain";
    this._optionType = sOptionType || "default";
    this._image = oImage || BiOptionPane.getImageFromOptionType(this._messageType);
    this._options = oOptions;
    this._optionComponents = this._getOptionComponents();
    this.setInitialValue(oInitialValue);
    this._addComponents();
    this._fixedLayout();
}
_p = _biExtend(BiOptionPane, BiComponent, "BiOptionPane");
BiOptionPane.BUTTONS_GAP = 6;
BiOptionPane.IMAGE_MESSAGE_GAP = 18;
BiOptionPane.MESSAGE_INPUT_GAP = 10;
BiOptionPane.MESSAGE_BUTTONS_GAP = 18;
BiOptionPane.PADDING_LEFT = 11;
BiOptionPane.PADDING_RIGHT = 11;
BiOptionPane.PADDING_TOP = 11;
BiOptionPane.PADDING_BOTTOM = 11;
_p._message = null;
_p._messageType = "plain";
_p._optionType = "default";
_p._options = null;
_p._inputComponent = null;
_p._acceptButton = null;
_p._cancelButton = null;
_p._dialog = null;
_p._value = null;
BiOptionPane.getComponentFromObject = function (o) {
    if (o instanceof BiComponent) return o;
    var l = new BiLabel(String(o));
    l.setWrap(true);
    return l;
};
BiOptionPane.getImageFromOptionType = function (sOptionType) {
    if (sOptionType == "plain") return null;
    var srcId;
    switch (sOptionType) {
    case "error":
        srcId = "error-image";
        break;
    case "information":
        srcId = "information-image";
        break;
    case "warning":
        srcId = "warning-image";
        break;
    case "question":
        srcId = "question-image";
        break;
    }
    return new BiImage(application.getTheme().getAppearanceProperty("option-pane", srcId), 32, 32);
};
BiOptionPane.addProperty("message", BiAccessType.READ);
BiOptionPane.addProperty("messageType", BiAccessType.READ);
BiOptionPane.addProperty("options", BiAccessType.READ);
BiOptionPane.addProperty("optionType", BiAccessType.READ);
BiOptionPane.addProperty("image", BiAccessType.READ);
BiOptionPane.addProperty("initialValue", BiAccessType.READ);
_p.setInitialValue = function (oInitialValue) {
    this._initialValue = oInitialValue;
    if (oInitialValue != null) {
        var idx = this._options.indexOf(this._initialValue);

        this._acceptButton = this._optionComponents[idx];
    }
    this._value = oInitialValue;
};
BiOptionPane.addProperty("acceptButton", BiAccessType.READ_WRITE);
BiOptionPane.addProperty("cancelButton", BiAccessType.READ_WRITE);
BiOptionPane.addProperty("dialog", BiAccessType.READ);
BiOptionPane.addProperty("value", BiAccessType.READ_WRITE);
BiOptionPane.addProperty("inputComponent", BiAccessType.READ);
_p.setInputComponent = function (oComponent) {
    if (this._inputComponent != oComponent) {
        if (this._inputComponent) this.remove(this._inputComponent);
        this._inputComponent = oComponent;
        if (this._inputComponent) this.add(this._inputComponent, this._optionComponents[0]);
        this._fixedLayout();
        if (this.getCreated()) this._layoutInputComponent();
    }
};
BiOptionPane.BUTTONS_RESULT_PROPERTY = "";
_p._getOptionComponents = function () {
    var res = [];
    var i;
    if (this._options != null) {
        var sProp = BiOptionPane.BUTTONS_RESULT_PROPERTY.capitalize();
        var sRes;
        for (i = 0; i < this._options.length; i++) {
            if (sProp.length && this._options[i]["get" + sProp]) sRes = this._options[i].getProperty(sProp);
            else sRes = this._options[i];
            res[i] = this._getOptionButton(this._options[i], sRes);
        }
    } else {
        if (this._optionType == "default" || this._optionType == "okcancel") res.push(this._getOptionButton(this._getString("OptionPaneOK"), "ok"));
        if (this._optionType == "yesno" || this._optionType == "yesnocancel") {
            res.push(this._getOptionButton(this._getString("OptionPaneYes"), "yes"));
            res.push(this._getOptionButton(this._getString("OptionPaneNo"), "no"));
        }
        if (this._optionType == "okcancel" || this._optionType == "yesnocancel") res.push(this._getOptionButton(this._getString("OptionPaneCancel"), "cancel"));
    }
    return res;
};
BiOptionPane.BUTTONS_WIDTH = 75;
_p._getOptionButton = function (oText, oDialogResult) {
    var b;
    if (oText instanceof BiComponent) {
        b = oText;
        if (b.getWidth() == 0) b.setWidth(BiOptionPane.BUTTONS_WIDTH);
    } else {
        b = new BiButton(String(oText));
        b.setWidth(BiOptionPane.BUTTONS_WIDTH);
    }
    b.addEventListener("action", function (e) {
        this._onOptionAction(e, oDialogResult);
    }, this);
    return b;
};
_p._addComponents = function () {
    if (this._image) this.add(this._image);
    this.add(this._messageComponent);
    if (this._inputComponent) this.add(this._inputComponent);
    for (var i = 0; i < this._optionComponents.length; i++) this.add(this._optionComponents[i]);
};
_p.layoutAllChildren = function () {
    BiComponent.prototype.layoutAllChildren.call(this);
    this._layoutOptionComponents();
    this._layoutInputComponent();
};
_p._fixedLayout = function () {
    var messageLeft;
    if (this._image) {
        this._image.setLocation(BiOptionPane.PADDING_LEFT, BiOptionPane.PADDING_TOP);
        messageLeft = BiOptionPane.PADDING_LEFT + this._image.getWidth() + BiOptionPane.IMAGE_MESSAGE_GAP;
    } else {
        messageLeft = BiOptionPane.PADDING_LEFT;
    }
    this._messageComponent.setLocation(messageLeft, BiOptionPane.PADDING_TOP);
    this._messageComponent.setRight(BiOptionPane.PADDING_RIGHT);
    if (this._inputComponent) {
        this._inputComponent.setLeft(messageLeft);
        this._inputComponent.setRight(BiOptionPane.PADDING_RIGHT);
    }
};
_p._getOptionComponentsWidth = function () {
    var w = 0;
    for (var i = 0; i < this._optionComponents.length; i++) w += this._optionComponents[i].getWidth() + BiOptionPane.BUTTONS_GAP;
    w -= BiOptionPane.BUTTONS_GAP;
    return w;
};
_p._getOptionComponentsHeight = function () {
    var h = 0;
    for (var i = 0; i < this._optionComponents.length; i++) h = Math.max(h, this._optionComponents[i].getHeight());
    return h;
};
_p._layoutOptionComponents = function () {
    var cw = this.getClientWidth() - BiOptionPane.PADDING_LEFT - BiOptionPane.PADDING_RIGHT;
    var bw = this._getOptionComponentsWidth();
    var x = BiOptionPane.PADDING_LEFT + (cw - bw) / 2;
    for (var i = 0; i < this._optionComponents.length; i++) {
        this._optionComponents[i].setLeft(x);
        x += this._optionComponents[i].getWidth() + BiOptionPane.BUTTONS_GAP;
    }
    var maxHeight = this._getOptionComponentsHeight();
    for (i = 0; i < this._optionComponents.length; i++) {
        this._optionComponents[i].setBottom(BiOptionPane.PADDING_BOTTOM + (maxHeight - this._optionComponents[i].getHeight()) / 2);
    }
};
_p._layoutInputComponent = function () {
    if (this._inputComponent) {
        this._inputComponent.setTop(BiOptionPane.PADDING_TOP + this._messageComponent.getHeight() + BiOptionPane.MESSAGE_INPUT_GAP);
    }
};
_p._computePreferredWidth = function () {
    var w = (this._image ? this._image.getWidth() + BiOptionPane.IMAGE_MESSAGE_GAP : 0) + Math.max(this._messageComponent.getPreferredWidth(), (this._inputComponent ? this._inputComponent.getPreferredWidth() : 0));
    return BiOptionPane.PADDING_LEFT + BiOptionPane.PADDING_RIGHT + Math.max(w, this._getOptionComponentsWidth());
};
_p._computePreferredHeight = function () {
    var h = Math.max(this._image ? this._image.getHeight() : 0, this._messageComponent.getPreferredHeight() + (this._inputComponent ? this._inputComponent.getPreferredHeight() + BiOptionPane.MESSAGE_INPUT_GAP : 0));
    return BiOptionPane.PADDING_TOP + h + BiOptionPane.MESSAGE_BUTTONS_GAP + this._getOptionComponentsHeight() + BiOptionPane.PADDING_BOTTOM;
};
_p.createDialog = function (sCaption) {
    var d = new BiDialog(sCaption);
    d.setResizable(true);
    d.setMinimumWidth(250);
    d.setMinimumHeight(123);
    var cp = d.getContentPane();
    d.setContentPane(this);
    cp.dispose();
    var aw = application.getWindow();
    aw.add(d);
    this.layoutAllChildren();
    var pw = Math.max(d.getPreferredWidth(), d.getMinimumWidth());
    var ph = Math.max(d.getPreferredHeight(), d.getMinimumHeight());
    pw = Math.min(aw.getClientWidth(), pw);
    d.setSize(pw, ph);
    d.setResizable(false);
    if (!this._acceptButton && !this._options) this._acceptButton = this._optionComponents[0];
    if (!this._cancelButton && !this._options) this._cancelButton = this._optionComponents[this._optionComponents.length - 1];
    d.setAcceptButton(this._acceptButton);
    d.setCancelButton(this._cancelButton);
    this._dialog = d;
    return d;
};
_p._onOptionAction = function (e, oDialogResult) {
    if (this._inputComponent) {
        if (oDialogResult == "cancel") this.setValue(null);
        else if (typeof this._inputComponent.getValue == "function") this.setValue(this._inputComponent.getValue());
        else if (typeof this._inputComponent.getText == "function") this.setValue(this._inputComponent.getText());
        else this.setValue(String(this._inputComponent));
    } else this.setValue(oDialogResult); if (this._dialog) {
        this._dialog.setDialogResult(this.getValue());
        this._dialog.close();
    }
};
BiOptionPane.createMessageDialog = function (oMessage, sCaption, sMessageType, oImage) {
    var op = new BiOptionPane(oMessage, sMessageType || "information", "default", oImage);
    return op.createDialog(sCaption || op._getString("OptionPaneMessage"));
};
BiOptionPane.createOptionDialog = function (oMessage, sCaption, sMessageType, sOptionType, oImage, oOptions, oInitialValue) {
    var op = new BiOptionPane(oMessage, sMessageType, sOptionType, oImage, oOptions, oInitialValue);
    return op.createDialog(sCaption);
};
BiOptionPane.createConfirmDialog = function (oMessage, sCaption, sMessageType, sOptionType, oImage) {
    var op = new BiOptionPane(oMessage, sMessageType || "question", sOptionType || "yesnocancel", oImage);
    return op.createDialog(sCaption || op._getString("OptionPaneSelectAnOption"));
};
BiOptionPane.createInputDialog = function (oMessage, sCaption, sMessageType, oImage, sDefaultValue) {
    var op = new BiOptionPane(oMessage, sMessageType || "question", "okcancel", oImage);
    op.setInputComponent(new BiTextField(sDefaultValue));
    var d = op.createDialog(sCaption || op._getString("OptionPaneInput"));
    d.setDefaultFocusedComponent(op.getInputComponent());
    return d;
};
BiOptionPane.addProperty("stringBundle", BiAccessType.READ_WRITE);
BiStringBundle._stringBundleMacro(_p);
application.getStringBundle().appendBundle("en", {
    OptionPaneYes: "Yes",
    OptionPaneNo: "No",
    OptionPaneOK: "OK",
    OptionPaneCancel: "Cancel",
    OptionPaneMessage: "Message",
    OptionPaneSelectAnOption: "Select an Option",
    OptionPaneInput: "Input"
});

function BiDialog(sCaption) {
    if (_biInPrototype) return;
    BiWindow.call(this, sCaption);
    this.setSize(200, 100);
    this.setShowMinimize(false);
    this.setShowMaximize(false);
    this.setShowIcon(false);
    this.setShowClose(false);
    this.setResizable(false);
    this.setCanMinimize(false);
    BiWindow.prototype.setVisible.call(this, false);
}
_p = _biExtend(BiDialog, BiWindow, "BiDialog");
_p._dialogResult = null;
_p._defaultFocusedComponent = null;
_p._focusAcceptButton = true;
_p._centered = true;
_p.setAttribute = function (sName, sValue, oXmlResourceParser) {
    switch (sName) {
    case "defaultFocusedComponent":
        if (sValue.charAt(0) == "#") sValue = sValue.substr(1);
        var c = oXmlResourceParser.getComponentById(sValue);
        this.setDefaultFocusedComponent(c);
        break;
    default:
        BiWindow.prototype.setAttribute.apply(this, arguments);
    }
};
_p._showMenuByMnemonic = function (key) {
    if (this._menuBar && this._menuBar.showMenuByMnemonic(key)) return true;
};
BiDialog.addProperty("dialogResult", BiAccessType.READ_WRITE);
BiDialog.addProperty("defaultFocusedComponent", BiAccessType.READ_WRITE);
BiDialog.addProperty("focusAcceptButton", BiAccessType.READ_WRITE);
BiDialog.addProperty("centered", BiAccessType.READ_WRITE);
_p.centerDialog = function () {
    var p = this.getParent();
    if (!p) return;
    var cw = p.getClientWidth();
    var ch = p.getClientHeight();
    var w = this.getWidth();
    var h = this.getHeight();
    var minMargins = 20;
    if (cw - minMargins < w) this.setWidth(w = cw - minMargins);
    if (ch - minMargins < h) this.setHeight(h = ch - minMargins);
    this.setLocation((cw - w) / 2, (ch - h) / 2);
};
_p.setVisible = function (b) {
    if (this._visible != b) {
        if (b && this._parent != application.getWindow()) application.getWindow().add(this);
        if (b && this._centered) this.centerDialog();
        BiWindow.prototype.setVisible.call(this, b);
        if (b) {
            this.setActive(b);
        }
        application.getWindow().updateGlassPane(this, b);
        if (b) {
            if (BiBrowserCheck.quirks.mozDisappearingCaretBug) {
                this.setOverflow("auto");
            }
            var componentToFocus = this._determineComponentToFocus();
            if (componentToFocus) {
                if (application.getAccessibilityMode()) application.getAccessibilityManager().setPreDescription(this.getDescription());
                componentToFocus.setFocused(true);
                if (componentToFocus instanceof BiTextField) {
                    componentToFocus.selectAll();
                }
                setTimeout(function () {
                    componentToFocus._focusComponent();
                });
            }
        }
        if (!b) this.dispatchEvent("dialogresult");
    }
};
_p._determineComponentToFocus = function () {
    var dfc = this.getDefaultFocusedComponent();
    if (dfc) return dfc;
    if (this.getFocusAcceptButton()) {
        var ab = this.getAcceptButton();
        if (ab && ab.getCanFocus()) return ab;
    }
    return this.getContentPane().getFirstFocusable();
};
_p._getCanExecute = function (oCommand) {
    return oCommand.getOwnerWindow() == this;
};
_p.close = function () {
    BiWindow.prototype.close.call(this);
    window.focus();
};
BiDialog.createMessageDialog = function (oMessage, sCaption, sMessageType, oImage) {
    return BiOptionPane.createMessageDialog.apply(this, arguments);
};
BiDialog.createOptionDialog = function (oMessage, sCaption, sMessageType, sOptionType, oImage, oOptions, oInitialValue) {
    return BiOptionPane.createOptionDialog.apply(this, arguments);
};
BiDialog.createConfirmDialog = function (oMessage, sCaption, sMessageType, sOptionType, oImage) {
    return BiOptionPane.createConfirmDialog.apply(this, arguments);
};
BiDialog.createInputDialog = function (oMessage, sCaption, sMessageType, oImage, sDefaultValue) {
    return BiOptionPane.createInputDialog.apply(this, arguments);
};

function BiColorPicker() {
    if (_biInPrototype) return;
    BiDialog.call(this);
    var cp = this.getContentPane();
    var l = this._colors.length;
    this._items = new Array(l);
    var item, y, i = 0;
    for (y = 0; y < 6; y++) {
        for (var x = 0; x < 8; x++) {
            item = new BiComponent;
            item.setBackColor(this._colors[i]);
            item.setAppearance("color-picker-box");
            item.setBounds(5 + x * (this._itemWidth + this._itemGap), 5 + y * (this._itemHeight + this._itemGap), this._itemWidth, this._itemHeight);
            cp.add(item);
            this._items[i] = item;
            i++;
        }
    }
    this._colorBox = new BiComponent;
    this._colorBox.setAppearance("color-picker-box");
    this._colorBox.setBounds(150, 230, 50, 25);
    this._colorBox.setBackColor("red");
    cp.add(this._colorBox);
    this._colorLabel = new BiLabel;
    this._colorLabel.setAlign("right");
    this._colorLabel.setBounds(5, 235, 140, 15);
    cp.add(this._colorLabel);
    this.setSize(518, 322);
    var gridWidth = 8 * (this._itemWidth + this._itemGap) - 5;
    this._hueBack = new BiComponent;
    this._hueBack.setAppearance("color-picker-box");
    this._hueBack.setBackColor("#000");
    this._hueBack.setSize(250, 250);
    this._hueBack.setLocation(gridWidth + 15, 5);
    cp.add(this._hueBack);
    this._hueImage = new BiImage(BiColorPicker.HUE_SATURATION_IMAGE_URI, 246, 246);
    this._hueImage.setLocation(gridWidth + 15 + 2, 5 + 2);
    cp.add(this._hueImage);
    this._hueHandle = new BiImage(application.getTheme().getAppearanceProperty("color-picker", "hue-saturation-handle-image"), 11, 11);
    this._hueHandle.setLocation(gridWidth + 15 + 2 - 6, 5 + 2 - 6);
    cp.add(this._hueHandle);
    this._brightnessImage = new BiImage(BiColorPicker.BRIGHTNESS_IMAGE_URI, 19, 246);
    this._brightnessImage.setAppearance("color-picker-box");
    this._brightnessImage.setLocation(gridWidth + 280, 5);
    cp.add(this._brightnessImage);
    this._brightnessHandle = new BiImage(application.getTheme().getAppearanceProperty("color-picker", "brightness-handle-image"), 35, 11);
    this._brightnessHandle.setLocation(gridWidth + 274, 0);
    cp.add(this._brightnessHandle);
    this.addEventListener("mouseup", this._onClick);
    this._hueImage.addEventListener("mousedown", this._onHueDown, this);
    this._hueHandle.addEventListener("mousedown", this._onHueDown, this);
    this._brightnessImage.addEventListener("mousedown", this._onBrightnessDown, this);
    this._brightnessHandle.addEventListener("mousedown", this._onBrightnessDown, this);
    this._hueLabel = new BiLabel;
    this._satLabel = new BiLabel;
    this._lumLabel = new BiLabel;
    this._redLabel = new BiLabel;
    this._greenLabel = new BiLabel;
    this._blueLabel = new BiLabel;
    this._hueField = new BiSpinner;
    this._satField = new BiSpinner;
    this._lumField = new BiSpinner;
    this._redField = new BiSpinner;
    this._greenField = new BiSpinner;
    this._blueField = new BiSpinner;
    var tmp = ["hue", "sat", "lum", "red", "green", "blue"];
    var f;
    for (i = 0; i < tmp.length; i++) {
        f = this["_" + tmp[i] + "Field"];
        l = this["_" + tmp[i] + "Label"];
        f.setMinimum(0);
        f.setMaximum(255);
        f.setWidth(50);
        f.setTabIndex(i + 2);
        l.setWidth(40);
        l.setLabelFor(f);
        l.setAlign("right");
        cp.add(l);
        cp.add(f);
    }
    this._hueField.setMaximum(360);
    this._satField.setMaximum(100);
    this._lumField.setMaximum(100);
    for (i = 0; i < tmp.length; i++) {
        f = this["_" + tmp[i] + "Field"];
        f.addEventListener("change", this._onSpinnerChange, this);
    }
    y = 145;
    for (i = 0; i < 3; i++) {
        f = this["_" + tmp[i] + "Field"];
        l = this["_" + tmp[i] + "Label"];
        l.setLocation(5, y + 2);
        f.setLocation(50, y);
        y += 25;
    }
    y = 145;
    for (i = 3; i < 6; i++) {
        f = this["_" + tmp[i] + "Field"];
        l = this["_" + tmp[i] + "Label"];
        l.setLocation(105, y + 2);
        f.setLocation(150, y);
        y += 25;
    }
    this._colorOkButton = new BiButton;
    this._colorCancelButton = new BiButton;
    this.setAcceptButton(this._colorOkButton);
    this.setCancelButton(this._colorCancelButton);
    cp.add(this._colorOkButton);
    cp.add(this._colorCancelButton);
    this._colorOkButton.setWidth(75);
    this._cancelButton.setWidth(75);
    this._colorCancelButton.setRight(5);
    this._colorCancelButton.setBottom(5);
    this._colorOkButton.setRight(85);
    this._colorOkButton.setBottom(5);
    this._colorOkButton.addEventListener("action", function (e) {
        this.setDialogResult(this.getRgbString());
        this.close();
    }, this);
    this._colorCancelButton.addEventListener("action", function (e) {
        this.setDialogResult(null);
        this.close();
    }, this);
    this._hsl = {
        h: 0,
        s: 0,
        l: 1
    };
    this._rgb = {
        r: 0,
        g: 0,
        b: 0
    };
    this.setRgb({
        r: 255,
        g: 0,
        b: 0
    });
    application.getStringBundle().addEventListener("change", this._updateStrings, this);
    this._updateStrings();
}
_p = _biExtend(BiColorPicker, BiDialog, "BiColorPicker");
_p._updateStrings = function () {
    this.setCaption(this._getString("ColorPickerCaption"));
    this._colorLabel.setText(this._getString("ColorPickerSelectedColor"));
    this._hueLabel.setText(this._getString("ColorPickerHue"));
    this._satLabel.setText(this._getString("ColorPickerSat"));
    this._lumLabel.setText(this._getString("ColorPickerLum"));
    this._redLabel.setText(this._getString("ColorPickerRed"));
    this._greenLabel.setText(this._getString("ColorPickerGreen"));
    this._blueLabel.setText(this._getString("ColorPickerBlue"));
    this._colorOkButton.setText(this._getString("ColorPickerOK"));
    this._colorCancelButton.setText(this._getString("ColorPickerCancel"));
    BiDialog.prototype._updateStrings.call(this);
};
BiColorPicker.HUE_SATURATION_IMAGE_URI = application.getPath() + "images/huesaturation.jpg";
BiColorPicker.HUE_SATURATION_HANDLE_IMAGE_URI = application.getPath() + "images/huesaturationhandle.gif";
BiColorPicker.BRIGHTNESS_IMAGE_URI = application.getPath() + "images/brightness.jpg";
BiColorPicker.BRIGHTNESS_HANDLE_IMAGE_URI = application.getPath() + "themes/" + application.getThemeManager().getDefaultTheme().getName() + "/images/brightnesshandle.gif";
_p._colors = ["rgb(255,128,128)", "rgb(255,255,128)", "rgb(128,255,128)", "rgb(0,155,128)", "rgb(128,255,255)", "rgb(0,128,255)", "rgb(255,128,192)", "rgb(255,128,255)", "rgb(255,0,0)", "rgb(255,255,0)", "rgb(128,255,0)", "rgb(0,255,64)", "rgb(0,255,255)", "rgb(0,128,192)", "rgb(128,128,192)", "rgb(255,0,255)", "rgb(128,64,64)", "rgb(255,128,64)", "rgb(0,255,0)", "rgb(0,128,128)", "rgb(0,64,128)", "rgb(128,128,255)", "rgb(128,0,64)", "rgb(255,0,128)", "rgb(128,0,0)", "rgb(255,128,0)", "rgb(0,128,0)", "rgb(0,128,64)", "rgb(0,0,255)", "rgb(0,160,160)", "rgb(128,0,128)", "rgb(128,0,255)", "rgb(64,0,0)", "rgb(128,64,0)", "rgb(0,64,0)", "rgb(0,64,64)", "rgb(0,0,128)", "rgb(0,0,64)", "rgb(64,0,64)", "rgb(64,0,128)", "rgb(0,0,0)", "rgb(128,128,0)", "rgb(128,128,64)", "rgb(128,128,128)", "rgb(64,128,128)", "rgb(192,192,192)", "rgb(32,0,32)", "rgb(255,255,255)"];
_p._itemWidth = 20;
_p._itemHeight = 17;
_p._itemGap = 5;
_p._rgbString = "rgb(255,0,0)";
_p._fireChange = true;
BiColorPicker.hslToRgb = function (hsl) {
    var rgb = {};
    var h = hsl.h;
    var s = hsl.s;
    var l = hsl.l * 255;
    if (s == 0) {
        rgb.r = rgb.g = rgb.b = l;
        return rgb;
    }
    h = h / 60 % 6;
    var i = Math.floor(h);
    var f = h - i;
    var p = l * (1 - s);
    var q = l * (1 - s * f);
    var t = l * (1 - s * (1 - f));
    switch (i) {
    case 0:
        rgb.r = l;
        rgb.g = t;
        rgb.b = p;
        break;
    case 1:
        rgb.r = q;
        rgb.g = l;
        rgb.b = p;
        break;
    case 2:
        rgb.r = p;
        rgb.g = l;
        rgb.b = t;
        break;
    case 3:
        rgb.r = p;
        rgb.g = q;
        rgb.b = l;
        break;
    case 4:
        rgb.r = t;
        rgb.g = p;
        rgb.b = l;
        break;
    default:
        rgb.r = l;
        rgb.g = p;
        rgb.b = q;
        break;
    }
    return rgb;
};
BiColorPicker.rgbToHsl = function (rgb) {
    var hsl = {};
    var min = Math.min(rgb.r, rgb.g, rgb.b);
    var max = Math.max(rgb.r, rgb.g, rgb.b);
    hsl.l = max;
    var delta = max - min;
    if (max != 0) hsl.s = delta / max;
    else {
        hsl.s = 0;
        hsl.h = 0;
        return hsl;
    } if (rgb.r == max) hsl.h = (rgb.g - rgb.b) / delta;
    else if (rgb.g == max) hsl.h = 2 + (rgb.b - rgb.r) / delta;
    else hsl.h = 4 + (rgb.r - rgb.g) / delta;
    hsl.h *= 60;
    if (hsl.h < 0) hsl.h += 360;
    hsl.l /= 255;
    return hsl;
};
BiColorPicker.getRgbFromRgbString = function (s) {
    var re = /^rgb\s*\(\s*(\d+)\s*\,\s*(\d+)\s*\,\s*(\d+)\s*\)$/i;
    re.exec(s);
    return {
        r: Number(RegExp.$1),
        g: Number(RegExp.$2),
        b: Number(RegExp.$3)
    };
};
BiColorPicker.getRgbStringFromRgb = function (rgb) {
    return "rgb(" + Math.floor(rgb.r) + "," + Math.floor(rgb.g) + "," + Math.floor(rgb.b) + ")";
};
_p.setRgbString = function (sValue) {
    this.setRgb(BiColorPicker.getRgbFromRgbString(sValue));
};
_p.getRgbString = function () {
    return this._rgbString;
};
_p._onClick = function (e) {
    var t = e.getTarget();
    if (this._items.contains(t)) {
        this.setRgbString(t.getBackColor());
    }
};
_p._onHueDown = function (e) {
    this._hueImage.addEventListener("mousemove", this._onHueMove, this);
    this._hueImage.addEventListener("mouseup", this._onHueUp, this);
    this._hueImage.addEventListener("losecapture", this._onHueUp, this);
    this._hueImage.setCapture(true);
    this._onHueMove(e);
    e.preventDefault();
};
_p._onHueMove = function (e) {
    var width = this._hueImage.getWidth();
    var height = this._hueImage.getHeight();
    var left = Math.min(this._hueImage.getWidth(), Math.max(0, e.getClientX() - this._hueImage.getClientLeft()));
    var top = Math.min(this._hueImage.getHeight(), Math.max(0, e.getClientY() - this._hueImage.getClientTop()));
    var s = (1 - top / height);
    var h = Math.max(0, Math.min(360, (360 * (left / width))));
    this.setHsl({
        h: h,
        s: s,
        l: this._hsl.l
    });
};
_p._onHueUp = function (e) {
    this._hueImage.removeEventListener("mousemove", this._onHueMove, this);
    this._hueImage.removeEventListener("mouseup", this._onHueUp, this);
    this._hueImage.removeEventListener("losecapture", this._onHueUp, this);
    this._hueImage.setCapture(false);
};
_p._onBrightnessDown = function (e) {
    this._brightnessImage.addEventListener("mousemove", this._onBrightnessMove, this);
    this._brightnessImage.addEventListener("mouseup", this._onBrightnessUp, this);
    this._brightnessImage.addEventListener("losecapture", this._onBrightnessUp, this);
    this._brightnessImage.setCapture(true);
    this._onBrightnessMove(e);
    e.preventDefault();
};
_p._onBrightnessMove = function (e) {
    var height = this._brightnessImage.getHeight();
    var top = Math.min(height, Math.max(0, e.getClientY() - this._brightnessImage.getClientTop()));
    var l = (1 - top / height);
    this.setHsl({
        h: this._hsl.h,
        s: this._hsl.s,
        l: l
    });
};
_p._onBrightnessUp = function (e) {
    this._brightnessImage.removeEventListener("mousemove", this._onBrightnessMove, this);
    this._brightnessImage.removeEventListener("mouseup", this._onBrightnessUp, this);
    this._brightnessImage.removeEventListener("losecapture", this._onBrightnessUp, this);
    this._brightnessImage.setCapture(false);
};
_p._syncHandles = function () {
    if (this._dontSync) return;
    var brightnessHeight = this._brightnessImage.getHeight();
    var width = this._hueImage.getWidth();
    var height = this._hueImage.getHeight();
    this._hueHandle.setLeft(this._hueImage.getLeft() - Math.floor(this._hueHandle.getWidth() / 2) + this._hsl.h / 360 * width);
    this._hueHandle.setTop(this._hueImage.getTop() - Math.floor(this._hueHandle.getHeight() / 2) + height - this._hsl.s * height);
    this._brightnessHandle.setTop(brightnessHeight - this._hsl.l * brightnessHeight);
    this._hueImage.setOpacity(this._hsl.l);
};
_p.setRgb = function (rgb) {
    this.setHsl(BiColorPicker.rgbToHsl(rgb));
};
_p.getRgb = function () {
    return {
        r: this._rgb.r,
        g: this._rgb.g,
        b: this._rgb.b
    };
};
_p.setHsl = function (hsl) {
    if (this._hsl.h != hsl.h || this._hsl.s != hsl.s || this._hsl.l != hsl.l) {
        var oldFireChange = this._fireChange;
        this._fireChange = false;
        if (hsl.h == -1 || isNaN(hsl.h)) hsl = {
            h: this._hsl.h,
            s: hsl.s,
            l: hsl.l
        };
        this._hsl = hsl;
        this._rgb = BiColorPicker.hslToRgb(hsl);
        this._hueField.setValue(Math.round(this._hsl.h));
        this._satField.setValue(Math.round(100 * this._hsl.s));
        this._lumField.setValue(Math.round(100 * this._hsl.l));
        this._redField.setValue(Math.round(this._rgb.r));
        this._greenField.setValue(Math.round(this._rgb.g));
        this._blueField.setValue(Math.round(this._rgb.b));
        this._rgbString = BiColorPicker.getRgbStringFromRgb(this._rgb);
        this._colorBox.setBackColor(this._rgbString);
        this._hueImage.setOpacity(this._hsl.l);
        this._syncHandles();
        this._fireChange = oldFireChange;
        if (this._fireChange) this.dispatchEvent("change");
    }
};
_p.getHsl = function () {
    return {
        h: this._hsl.h,
        g: this._hsl.s,
        b: this._hsl.l
    };
};
_p._onSpinnerChange = function (e) {
    if (!this._fireChange) return;
    var oldFireChange = this._fireChange;
    this._fireChange = false;
    var t = e.getTarget();
    switch (t) {
    case this._hueField:
        this.setHsl({
            h: t.getValue(),
            s: this._hsl.s,
            l: this._hsl.l
        });
        break;
    case this._satField:
        this.setHsl({
            h: this._hsl.h,
            s: t.getValue() / 100,
            l: this._hsl.l
        });
        break;
    case this._lumField:
        this.setHsl({
            h: this._hsl.h,
            s: this._hsl.s,
            l: t.getValue() / 100
        });
        break;
    case this._redField:
        this.setRgb({
            r: t.getValue(),
            g: this._rgb.g,
            b: this._rgb.b
        });
        break;
    case this._greenField:
        this.setRgb({
            r: this._rgb.r,
            g: t.getValue(),
            b: this._rgb.b
        });
        break;
    case this._blueField:
        this.setRgb({
            r: this._rgb.r,
            g: this._rgb.g,
            b: t.getValue()
        });
        break;
    }
    this._fireChange = oldFireChange;
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiDialog.prototype.dispose.call(this);
    application.getStringBundle().removeEventListener("change", this._updateStrings, this);
};
BiColorPicker.addProperty("stringBundle", BiAccessType.READ_WRITE);
BiStringBundle._stringBundleMacro(_p, _p._updateStrings);
application.getStringBundle().appendBundle("en", {
    ColorPickerCaption: "Color",
    ColorPickerOK: "OK",
    ColorPickerCancel: "Cancel",
    ColorPickerHue: "Hue:",
    ColorPickerSat: "Sat:",
    ColorPickerLum: "Lum:",
    ColorPickerRed: "Red:",
    ColorPickerGreen: "Green:",
    ColorPickerBlue: "Blue:",
    ColorPickerSelectedColor: "Selected Color:"
});

function BiWizardPane() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setAppearance("wizard-pane");
    this.setSize(440, 310);
    this._pages = [];
    this._backButton = new BiButton;
    this._nextButton = new BiButton;
    this._finishButton = new BiButton;
    this._cancelButton = new BiButton;
    application.getStringBundle().addEventListener("change", this._updateStrings, this);
    this._updateStrings();
    this._backButton.setWidth(75);
    this._nextButton.setWidth(75);
    this._finishButton.setWidth(75);
    this._cancelButton.setWidth(75);
    this._backButton.setBottom(10);
    this._nextButton.setBottom(10);
    this._finishButton.setBottom(10);
    this._cancelButton.setBottom(10);
    this._backButton.setRight(170);
    this._nextButton.setRight(95);
    this._finishButton.setRight(95);
    this._cancelButton.setRight(10);
    this._separator = new BiComponent;
    this._separator.setAppearance("wizard-pane-separator");
    this._separator.setHeight(47);
    this._separator.setLeft(0);
    this._separator.setRight(0);
    this._separator.setBottom(0);
    this._backButton.setTabIndex(1000);
    this._nextButton.setTabIndex(1001);
    this._finishButton.setTabIndex(1002);
    this._cancelButton.setTabIndex(1003);
    this.setBackdropImage(new BiImage(application.getTheme().getAppearanceProperty("wizard-pane", "backdrop-image"), 132, 300));
    this.add(this._separator, null);
    this.add(this._backButton, null);
    this.add(this._nextButton, null);
    this.add(this._finishButton, null);
    this.add(this._cancelButton, null);
    this._backButton.addEventListener("action", this.back, this);
    this._nextButton.addEventListener("action", this.next, this);
    this._finishButton.addEventListener("action", this.finish, this);
    this._cancelButton.addEventListener("action", this.cancel, this);
    this._syncNavigationButtons();
}
_p = _biExtend(BiWizardPane, BiComponent, "BiWizardPane");
_p._updateStrings = function () {
    this._backButton.setText(this._getString("WizardPaneBack"));
    this._nextButton.setText(this._getString("WizardPaneNext"));
    this._finishButton.setText(this._getString("WizardPaneFinish"));
    this._cancelButton.setText(this._getString("WizardPaneCancel"));
    this._backButton.setMnemonic(this._getString("WizardPaneBackMnemonic"));
    this._nextButton.setMnemonic(this._getString("WizardPaneNextMnemonic"));
    this._backButton.setAccessKey(this._getString("WizardPaneBackAccessKey"));
    this._nextButton.setAccessKey(this._getString("WizardPaneNextAccessKey"));
};
BiWizardPane.addProperty("selectedIndex", BiAccessType.READ);
BiWizardPane.addProperty("selectedPage", BiAccessType.READ);
BiWizardPane.addProperty("pages", BiAccessType.READ);
BiWizardPane.addProperty("nextButton", BiAccessType.READ);
BiWizardPane.addProperty("backButton", BiAccessType.READ);
BiWizardPane.addProperty("finishButton", BiAccessType.READ);
BiWizardPane.addProperty("cancelButton", BiAccessType.READ);
_p._selectedIndex = -1;
_p._selectedPage = null;
_p.setSelectedIndex = function (n) {
    if (this._selectedPage) {
        if (!this._selectedPage.dispatchEvent("deactivated")) return;
    }
    if (!this.dispatchEvent("beforechange")) return;
    if (this._selectedPage) this.remove(this._selectedPage);
    var p = this._pages[n];
    if (p) {
        p.setTop(10);
        p.setRight(10);
        p.setLeft((this._backdropImage ? this._backdropImage.getWidth() : 0) + 15);
        p.setBottom(47 + 10);
        this._selectedPage = p;
        this._selectedIndex = n;
        this.add(p);
        this._syncNavigationButtons();
        BiTimer.callOnce(function () {
            if (this._cancelButton._element) {
                var next = application.getFocusManager()._getNext(this._cancelButton, 1);
                if (this._backButton.contains(next)) next = this._nextButton.getEnabled() ? this._nextButton : this._finishButton;
                next.setFocused(true);
            }
            p.dispatchEvent("activated");
        }, 20, this);
        this.dispatchEvent("change");
    } else {
        this._selectedPage = null;
        this._selectedIndex = -1;
    }
};
_p.setSelectedPage = function (p) {
    var i = this._pages.indexOf(p);
    this.setSelectedIndex(i);
};
_p._syncNavigationButtons = function () {
    var n = this.getSelectedIndex();
    var l = this._pages.length;
    var last = n == l - 1;
    var fb = this._nextButton.getContainsFocus() || this._finishButton.getContainsFocus();
    this._backButton.setEnabled(n != 0 && l > 0);
    this._nextButton.setEnabled(!last && l > 0);
    this._finishButton.setEnabled(last);
    this._nextButton.setVisible(!last);
    this._finishButton.setVisible(last);
    if (fb) {
        if (last) this._finishButton.setFocused(true);
        else this._nextButton.setFocused(true);
    }
};
_p.next = function () {
    if (this.dispatchEvent("beforenext")) {
        var newIndex = this.getSelectedIndex() + 1;
        this.setSelectedIndex(newIndex);
        if (this.getSelectedIndex() == newIndex) {
            this.dispatchEvent("next");
        }
    }
};
_p.back = function () {
    if (this.dispatchEvent("beforeback")) {
        var newIndex = this.getSelectedIndex() - 1;
        this.setSelectedIndex(newIndex);
        if (this.getSelectedIndex() == newIndex) {
            this.dispatchEvent("back");
        }
    }
};
_p.finish = function () {
    if (this.dispatchEvent("beforefinish")) {
        this.dispatchEvent("finish");
    }
};
_p.cancel = function () {
    if (this.dispatchEvent("beforecancel")) {
        this.dispatchEvent("cancel");
    }
};
_p.addPage = function (oPage, oBefore) {
    if (oBefore == null) this._pages.push(oPage);
    else this._pages.insertBefore(oPage, oBefore); if (this._pages.length == 1) this.setSelectedIndex(0);
    this._syncNavigationButtons();
};
_p.removePage = function (oPage) {
    var idx = this._pages.indexOf(oPage);
    var wasSelected = idx == this.getSelectedIndex();
    this._pages.remove(oPage);
    if (wasSelected) {
        if (idx < this._pages.length) this.setSelectedIndex(idx);
        else if (this._pages.length > 0) this.setSelectedIndex(this._pages.length - 1);
    }
    this._syncNavigationButtons();
    return oPage;
};
_p.addParsedObject = function (o) {
    if (o instanceof BiComponent) this.addPage(o);
    else BiComponent.prototype.addParsedObject.call(this, o);
};
BiWizardPane.addProperty("backdropImage", BiAccessType.READ_WRITE);
_p.setBackdropImage = function (oImage) {
    if (this._backdropImage) this.remove(this._backdropImage);
    if (oImage) {
        oImage.setLocation(0, 0);
        this.add(oImage, this.getFirstChild());
    }
    this._backdropImage = oImage;
    if (this._selectedPage) this._selectedPage.setLeft((this._backdropImage ? this._backdropImage.getWidth() : 0) + 15);
};
_p._backdropImage = null;
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiComponent.prototype.dispose.call(this);
    application.getStringBundle().removeEventListener("change", this._updateStrings, this);
    this.disposeFields("_backButton", "_nextButton", "_finishButton", "_cancelButton", "_separator", "_pages", "_selectedPage", "_selectedIndex");
};
BiWizardPane.addProperty("stringBundle", BiAccessType.READ_WRITE);
BiStringBundle._stringBundleMacro(_p, _p._updateStrings);
application.getStringBundle().appendBundle("en", {
    WizardPaneBack: "< Back",
    WizardPaneNext: "Next >",
    WizardPaneFinish: "Finish",
    WizardPaneCancel: "Cancel",
    WizardPaneBackMnemonic: "b",
    WizardPaneNextMnemonic: "n",
    WizardPaneBackAccessKey: "b",
    WizardPaneNextAccessKey: "n"
});

function BiWizard(sCaption) {
    if (_biInPrototype) return;
    BiDialog.call(this, sCaption);
    this.setSize(450, 330);
    var wp = new BiWizardPane;
    this.setContentPane(wp);
    this.setCancelButton(wp._cancelButton);
    wp.addEventListener("finish", this.finish, this);
    wp.addEventListener("cancel", this.cancel, this);
    wp.addEventListener("next", this._onWizardPaneNext, this);
    wp.addEventListener("back", this._onWizardPaneBack, this);
    wp.addEventListener("change", this._onWizardPaneChange, this);
    wp.addEventListener("beforechange", this._onWizardPaneBeforeChange, this);
    wp.addEventListener("beforenext", this._onWizardPaneBeforeNext, this);
    wp.addEventListener("beforeback", this._onWizardPaneBeforeBack, this);
}
_p = _biExtend(BiWizard, BiDialog, "BiWizard");
_p.setSelectedIndex = function (n) {
    this.getContentPane().setSelectedIndex(n);
};
_p.getSelectedIndex = function () {
    return this.getContentPane().getSelectedIndex();
};
_p.setSelectedPage = function (p) {
    this.getContentPane().setSelectedPage(p);
};
_p.getSelectedPage = function () {
    return this.getContentPane().getSelectedPage();
};
_p.setBackdropImage = function (oImage) {
    this.getContentPane().setBackdropImage(oImage);
};
_p.getBackdropImage = function () {
    return this.getContentPane().getBackdropImage();
};
_p.next = function () {
    this.getContentPane().next();
};
_p.back = function () {
    this.getContentPane().back();
};
_p.finish = function () {
    if (this.dispatchEvent("beforefinish")) {
        this.dispatchEvent("finish");
        this.close();
    }
};
_p.cancel = function () {
    if (this.dispatchEvent("beforecancel")) {
        this.dispatchEvent("cancel");
        this.close();
    }
};
_p.addPage = function (oPage, oBefore) {
    this.getContentPane().addPage(oPage, oBefore);
    this._syncNavigationButtons();
};
_p.removePage = function (oPage) {
    this.getContentPane().removePage(oPage);
    this._syncNavigationButtons();
    return oPage;
};
_p.getPages = function () {
    return this.getContentPane().getPages();
};
_p._onWizardPaneChange = function (e) {
    this.dispatchEvent("change");
    this._syncNavigationButtons();
};
_p._onWizardPaneBack = function (e) {
    this.dispatchEvent("back");
};
_p._onWizardPaneNext = function (e) {
    this.dispatchEvent("next");
};
_p._onWizardPaneBeforeChange = function (e) {
    if (!this.dispatchEvent("beforechange")) {
        e.preventDefault();
    }
};
_p._onWizardPaneBeforeBack = function (e) {
    if (!this.dispatchEvent("beforeback")) {
        e.preventDefault();
    }
};
_p._onWizardPaneBeforeNext = function (e) {
    if (!this.dispatchEvent("beforenext")) {
        e.preventDefault();
    }
};
_p._syncNavigationButtons = function () {
    var wp = this.getContentPane();
    var n = wp.getSelectedIndex();
    var b = n == wp._pages.length - 1 ? wp._finishButton : wp._nextButton;
    this.setAcceptButton(b);
    var ac = this.getActiveComponent();
    if ((ac == null || ac == this) && b.getCanFocus()) b.setFocused(true);
};
_p.addParsedObject = function (o) {
    if (o instanceof BiComponent) this.addPage(o);
    else BiDialog.prototype.addParsedObject.call(this, o);
};
_p.setStringBundle = function (sb) {
    this.getContentPane().setStringBundle(sb);
};
_p.getStringBundle = function () {
    return this.getContentPane().getStringBundle();
};
_p._determineComponentToFocus = function () {
    return null;
};

function BiDataSet(sName) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    if (sName) this._name = sName;
    this._tables = [];
    this._tablesByName = {};
}
_p = _biExtend(BiDataSet, BiEventTarget, "BiDataSet");
_p._name = "Unnamed Data Set";
_p._dataReady = true;
BiDataSet.addProperty("tables", BiAccessType.READ);
BiDataSet.addProperty("name", BiAccessType.READ);
BiDataSet.addProperty("dataReady", BiAccessType.READ);
_p.getTableByName = function (s) {
    return this._tablesByName[String(s).toLowerCase()];
};
_p.addTable = function (oTable, oBefore) {
    if (oBefore == null) this._tables.push(oTable);
    else this._tables.insertBefore(oTable, oBefore);
    var tName = oTable.getName();
    if (!tName) tName = oTable._name = String(this._tables.indexOf(oTable));
    this._tablesByName[tName.toLowerCase()] = oTable;
    if (oTable._dataSet) oTable._dataSet.removeTable(oTable);
    oTable._dataSet = this;
};
_p.removeTable = function (oTable) {
    this._tables.remove(oTable);
    delete this._tablesByName[oTable.getName().toLowerCase()];
    oTable._dataSet = null;
    return oTable;
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiObject.prototype.dispose.call(this);
    for (var i = this._tables.length - 1; i >= 0; i--) {
        this._tables[i].dispose();
        this._tables[i] = null;
    }
    this._tables = null;
    for (i in this._tablesByName) {
        this._tablesByName[i] = null;
    }
    this._tablesByName = null;
};

function BiDataTable(sName) {
    if (_biInPrototype) return;
    BiObject.call(this);
    if (sName) this._name = sName;
    this._columns = [];
    this._rows = [];
    this._columnsByName = {};
}
_p = _biExtend(BiDataTable, BiObject, "BiDataTable");
_p._name = null;
_p._dataSet = null;
BiDataTable.addProperty("name", BiAccessType.READ);
BiDataTable.addProperty("dataSet", BiAccessType.READ);
BiDataTable.addProperty("columns", BiAccessType.READ);
BiDataTable.addProperty("rows", BiAccessType.READ);
_p.getColumnByName = function (s) {
    return this._columnsByName[String(s).toLowerCase()];
};
_p.addRow = function (oRow, oBefore) {
    if (oBefore) {
        this._rows.insertBefore(oRow, oBefore);
    } else {
        this._rows.push(oRow);
    } if (oRow._table) {
        oRow._table.removeRow(oRow);
    }
    oRow._table = this;
};
_p.removeRow = function (oRow) {
    this._rows.remove(oRow);
    oRow._table = null;
    return oRow;
};
_p.addColumn = function (oColumn, oBefore) {
    if (oBefore == null) {
        oColumn._index = this._columns.length;
        this._columns.push(oColumn);
    } else {
        this._columns.insertBefore(oColumn, oBefore);
        for (var i = 0; i < this._columns.length; i++) this._columns[i]._index = i;
    }
    var cName = oColumn.getName();
    if (!cName) cName = oColumn._name = String(this._columns.indexOf(oColumn));
    this._columnsByName[cName.toLowerCase()] = oColumn;
    if (oColumn._table) oColumn._table.removeColumn(oColumn);
    oColumn._table = this;
};
_p.removeColumn = function (oColumn) {
    this._columns.remove(oColumn);
    oColumn._index = null;
    for (var i = 0; i < this._columns.length; i++) this._columns[i]._index = i;
    delete this._columnsByName[oColumn.getName().toLowerCase()];
    oColumn._table = null;
    return oColumn;
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiObject.prototype.dispose.call(this);
    for (var i = this._columns.length - 1; i >= 0; i--) {
        this._columns[i].dispose();
        this._columns[i] = null;
    }
    this._columns = null;
    for (i = this._rows.length - 1; i >= 0; i--) {
        this._rows[i].dispose();
        this._rows[i] = null;
    }
    this._rows = null;
    for (i in this._columnsByName) this._columnsByName[i] = null;
    this._columnsByName = null;
    this._dataSet = null;
};
_p.getDataReady = function () {
    return this._dataSet ? this._dataSet.getDataReady() : false;
};

function BiDataColumn(sName) {
    if (_biInPrototype) return;
    BiObject.call(this);
    if (sName) this._name = sName;
}
_p = _biExtend(BiDataColumn, BiObject, "BiDataColumn");
_p._name = null;
_p._table = null;
_p._dataType = "string";
_p._defaultValue = null;
BiDataColumn.addProperty("index", BiAccessType.READ);
BiDataColumn.addProperty("name", BiAccessType.READ);
BiDataColumn.addProperty("table", BiAccessType.READ);
BiDataColumn.addProperty("dataType", BiAccessType.READ_WRITE);
BiDataColumn.addProperty("defaultValue", BiAccessType.READ_WRITE);
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiObject.prototype.dispose.call(this);
    this._table = null;
};

function BiDataRow() {
    if (_biInPrototype) return;
    BiObject.call(this);
}
_p = _biExtend(BiDataRow, BiObject, "BiDataRow");
_p._table = null;
BiDataRow.addProperty("table", BiAccessType.READ);
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiObject.prototype.dispose.call(this);
    this._table = null;
};
_p.getValueByIndex = function (n) {
    return null;
};
_p.getValueByName = function (s) {
    return null;
};

function BiXsTypeConverter() {
    if (_biInPrototype) return;
    BiObject.call(this);
}
_p = _biExtend(BiXsTypeConverter, BiObject, "BiXsTypeConverter");
BiXsTypeConverter._types = {
    "negativeInteger": 0,
    "unsignedShort": 0,
    "unsignedByte": 0,
    "unsignedLong": 0,
    "unsignedInt": 0,
    "decimal": 0,
    "boolean": 0,
    "integer": 0,
    "double": 0,
    "float": 0,
    "short": 0,
    "byte": 0,
    "long": 0,
    "int": 0,
    "QName": 1,
    "string": 1,
    "normalizedString": 2,
    "dateTime": 3,
    "date": 4,
    "time": 5
};
BiXsTypeConverter.getJsType = function (sXsType) {
    switch (BiXsTypeConverter._types[sXsType]) {
    case 0:
        return Number;
    case 1:
    case 2:
        return String;
    case 3:
    case 4:
    case 5:
        return Date;
    }
    return String;
};
BiXsTypeConverter.getJsTypeName = function (sXsType) {
    switch (BiXsTypeConverter._types[sXsType]) {
    case 0:
        return "number";
    case 1:
    case 2:
        return "string";
    case 3:
    case 4:
    case 5:
        return "date";
    }
    return "string";
};
BiXsTypeConverter.getJsValue = function (sValue, sXsType) {
    if (sValue == null) {
        if (BiXsTypeConverter._types[sXsType] == null || BiXsTypeConverter._types[sXsType] == 1) {
            return "";
        }
        return null;
    }
    switch (BiXsTypeConverter._types[sXsType]) {
    case 0:
        if (sValue == "INF") return Infinity;
        if (sValue == "-INF") return -Infinity;
        return Number(sValue);
    case 1:
    case 2:
        return sValue;
    case 3:
        return BiXsTypeConverter.decodeIsoDateTime(sValue);
    case 4:
        return BiXsTypeConverter.decodeIsoDate(sValue);
    case 5:
        return BiXsTypeConverter.decodeIsoTime(sValue);
    }
    return sValue;
};
BiXsTypeConverter.decodeIsoDateTime = function (s) {
    var parts = s.split("T");
    var d = new Date;
    if (parts.length > 0) {
        BiXsTypeConverter._decodeIsoDate(d, parts[0]);
        if (parts.length > 1) BiXsTypeConverter._decodeIsoTime(d, parts[1]);
    }
    return d;
};
BiXsTypeConverter.decodeIsoDate = function (s) {
    var d = new Date;
    BiXsTypeConverter._decodeIsoDate(d, s);
    return d;
};
BiXsTypeConverter.decodeIsoTime = function (s) {
    var d = new Date;
    BiXsTypeConverter._decodeIsoTime(d, s);
    return d;
};
BiXsTypeConverter._decodeIsoDate = function (d, s) {
    d.setFullYear(s.substr(0, 4));
    d.setMonth(s.substr(5, 2) - 1);
    d.setDate(s.substr(8, 2));
    s = s.substr(10);
    var i = s.indexOf("+");
    if (i < 0) i = s.indexOf("-");
    if (i > 0) BiXsTypeConverter._applyTimeZone(d, s.substring(i));
};
BiXsTypeConverter._decodeIsoTime = function (d, s) {
    var tzs = null;
    var i = s.indexOf("+");
    if (i < 0) i = s.indexOf("-");
    if (i > 0) {
        tzs = s.substring(i);
        s = s.substring(0, i);
    }
    d.setHours(s.substr(0, 2));
    d.setMinutes(s.substr(3, 2));
    d.setSeconds(s.substr(6, 2));
    var msi = s.indexOf(".");
    if (msi > 0) d.setMilliseconds(parseFloat("0." + s.substr(9)) * 1000);
    if (tzs != null) BiXsTypeConverter._applyTimeZone(d, tzs);
};
BiXsTypeConverter._applyTimeZone = function (d, s) {
    var tzo = 0;
    var parts = s.split(":");
    if (parts.length > 0) tzo += parts[0] * 60;
    if (parts.length > 1) tzo += (tzo < 0 ? -1 : 1) * Number(parts[1]);
    d.setTime(d.getTime() - (tzo + d.getTimezoneOffset()) * 60000);
};

function BiXmlDataSet(oSource) {
    if (_biInPrototype) return;
    BiDataSet.call(this);
    if (typeof oSource == "string" || oSource instanceof BiUri) this.setUri(oSource);
    else if (typeof oSource == "object") {
        this._uri = null;
        this.fromXmlNode(oSource);
        this._dataReady = true;
    }
}
_p = _biExtend(BiXmlDataSet, BiDataSet, "BiXmlDataSet");
_p._uri = null;
_p._rootNode = null;
BiXmlDataSet.encodeName = function (s) {
    return s.replace(/(^\d)|(_x[0-9a-f]{4}_)|[\s\W]/gi, BiXmlDataSet._encodeName);
};
BiXmlDataSet._encodeName = function (s) {
    if (s.length != 1) return "_x005F_" + s.substr(1);
    var cc = s.charCodeAt(0);
    var s2 = "";
    if (cc < 0x10) s2 = "000";
    else if (cc < 0x100) s2 = "00";
    else if (cc < 0x1000) s2 = "0";
    return "_x" + s2 + cc.toString(16).toUpperCase() + "_";
};
BiXmlDataSet.decodeName = function (s) {
    return s.replace(/_x([0-9a-f]+)_/gi, BiXmlDataSet._decodeName);
};
BiXmlDataSet._decodeName = function (s0, s1) {
    return String.fromCharCode(parseInt(s1, 16));
};
_p.setUri = function (oUri) {
    if (this._xmlLoader) this._xmlLoader.dispose();
    if (oUri instanceof BiUri) this._uri = oUri;
    else this._uri = new BiUri(application.getAdfPath(), oUri);
    this._dataReady = false;
    this._xmlLoader = new BiXmlLoader;
    this._xmlLoader.setAsync(true);
    this._xmlLoader.addEventListener("load", this._onXmlLoad, this);
    this._xmlLoader.load(this._uri);
};
BiXmlDataSet.addProperty("uri", BiAccessType.READ);
_p.setRootNode = function (oNode) {
    this._uri = null;
    this.fromXmlNode(oNode);
    this._dataReady = true;
};
BiXmlDataSet.addProperty("rootNode", BiAccessType.READ);
_p.fromXmlNode = function (oNode) {
    for (var i = this._tables.length - 1; i >= 0; i--) {
        this._tables[i].dispose();
        this._tables[i] = null;
    }
    this._tables = [];
    this._rootNode = oNode;
    var xp = this.getDataSetNamePath();
    var schemaRoot;
    BiXmlDocument.addNamespaces(oNode, {
        xs: "http://www.w3.org/2001/XMLSchema",
        msdata: "urn:schemas-microsoft-com:xml-msdata"
    });
    if (oNode.tagName == "xs:schema") {
        schemaRoot = oNode;
    } else {
        schemaRoot = oNode.getElementsByTagName("schema")[0] || oNode.getElementsByTagName("xs:schema")[0];
    }
    var nl = schemaRoot.selectSingleNode(xp);
    var s;
    if (nl) s = nl.text ? nl.text : nl.nodeValue;
    else if (this._rootNode.nodeType == 9) s = this._rootNode.documentElement.tagName;
    else s = this._rootNode.tagName;
    this._encodedName = s;
    this._name = BiXmlDataSet.decodeName(s);
    xp = this.getTableNamesPath(this._encodedName);
    nl = schemaRoot.selectNodes(xp);
    var l = nl.length;
    var t;
    for (i = 0; i < l; i++) {
        t = this._tables[i] = new BiXmlDataTable(nl[i].text ? nl[i].text : nl[i].nodeValue);
        t._dataSet = this;
        this._tablesByName[t.getName().toLowerCase()] = t;
        t.fromXmlNode(oNode);
    }
};
_p._onXmlLoad = function (e) {
    if (this._xmlLoader.getError()) {
        throw new Error("Error loading Xml file for BiXmlDataSet");
    } else {
        this._dataReady = true;
        this.fromXmlNode(this._xmlLoader.getDocument());
        this.dispatchEvent("dataready");
    }
};
BiXmlDataSet.addProperty("encodedName", BiAccessType.READ);
_p._nodeListToArray = function (nl) {
    var l = nl.length;
    var res = new Array(l);
    for (var i = 0; i < l; i++) res[i] = nl[i].text ? nl[i].text : nl[i].nodeValue;
    return res;
};
_p.getDataSetNamePath = function () {
    return ".//xs:element[@msdata:IsDataSet=\"true\"]/@name";
};
_p.getTableNamesPath = function (sDataSetXmlName) {
    return ".//xs:element[@name=\"" + sDataSetXmlName + "\"]/*/*/xs:element/@name";
};
_p.getColumnNamesPath = function (sTableXmlName) {
    return ".//xs:element[@name=\"" + sTableXmlName + "\"]//xs:element/@name";
};
_p.getColumnTypesPath = function (sTableXmlName) {
    return ".//xs:element[@name=\"" + sTableXmlName + "\"]//xs:element/@type";
};
_p.getRowsPath = function (sTableXmlName) {
    return ".//" + this._encodedName + "/" + sTableXmlName;
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiDataSet.prototype.dispose.call(this);
    if (this._xmlLoader) {
        this._xmlLoader.dispose();
        this._xmlLoader = null;
    }
};

function BiXmlDataTable(sEncodedName) {
    if (_biInPrototype) return;
    this._encodedName = sEncodedName;
    BiDataTable.call(this, BiXmlDataSet.decodeName(sEncodedName));
};
_p = _biExtend(BiXmlDataTable, BiDataTable, "BiXmlDataTable");
BiXmlDataTable.addProperty("encodedName", BiAccessType.READ);
_p.fromXmlNode = function (oNode) {
    for (var i = this._columns.length - 1; i >= 0; i--) {
        this._columns[i].dispose();
        this._columns[i] = null;
    }
    this._columns = [];
    for (i = this._rows.length - 1; i >= 0; i--) {
        this._rows[i].dispose();
        this._rows[i] = null;
    }
    this._rows = [];
    var ds = this._dataSet;
    var schemaRoot;
    if (oNode.tagName == "xs:schema") {
        schemaRoot = oNode;
    } else {
        schemaRoot = oNode.getElementsByTagName("schema")[0] || oNode.getElementsByTagName("xs:schema")[0];
    }
    var xp = ds.getColumnNamesPath(this._encodedName);
    var nl = schemaRoot.selectNodes(xp);
    var l = nl.length;
    var c;
    for (i = 0; i < l; i++) {
        c = this._columns[i] = new BiXmlDataColumn(nl[i].text ? nl[i].text : nl[i].nodeValue);
        c._index = i;
        c._table = this;
        this._columnsByName[c.getName().toLowerCase()] = c;
    }
    xp = ds.getColumnTypesPath(this._encodedName);
    nl = schemaRoot.selectNodes(xp);
    l = nl.length;
    for (i = 0; i < l; i++) {
        this._columns[i].setXsType(nl[i].text ? nl[i].text : nl[i].nodeValue);
    }
    xp = ds.getRowsPath(this._encodedName);
    nl = oNode.selectNodes(xp);
    l = nl.length;
    for (i = 0; i < l; i++) {
        this._rows[i] = new BiXmlDataRow(nl[i]);
        this._rows[i]._table = this;
    }
};
_p.addRow = function (oRow, oBefore) {
    if (!oRow) oRow = new BiXmlDataRow;
    BiDataTable.prototype.addRow.call(this, oRow, oBefore);
    var doc = this._dataSet._rootNode;
    if (oRow._xmlElement == null) {
        var oNodeTable = doc.createElement(this.getName());
        for (var i = 0; i < this.getColumns().length; i++) {
            var oField = doc.createElement(this.getColumns()[i].getName());
            oNodeTable.appendChild(oField);
        }
        oRow._xmlElement = oNodeTable;
    }
    if (oBefore) doc.documentElement.insertBefore(oRow._xmlElement, oBefore._xmlElement);
    else doc.documentElement.appendChild(oRow._xmlElement);
};
_p.removeRow = function (oRow) {
    oRow._xmlElement.parentNode.removeChild(oRow._xmlElement);
    return BiDataTable.prototype.removeRow.call(this, oRow);
};

function BiXmlDataColumn(sEncodedName) {
    if (_biInPrototype) return;
    this._encodedName = sEncodedName;
    BiDataColumn.call(this, BiXmlDataSet.decodeName(sEncodedName));
};
_p = _biExtend(BiXmlDataColumn, BiDataColumn, "BiXmlDataColumn");
BiXmlDataColumn.addProperty("encodedName", BiAccessType.READ);
BiXmlDataColumn.addProperty("xsType", BiAccessType.READ);
_p.setXsType = function (s) {
    this._xsType = s.replace(/^([^:]+:)/, "");
    this._dataType = BiXsTypeConverter.getJsTypeName(this._xsType);
};

function BiXmlDataRow(oXmlElement) {
    if (_biInPrototype) return;
    BiDataRow.call(this);
    this._xmlElement = oXmlElement;
};
_p = _biExtend(BiXmlDataRow, BiDataRow, "BiXmlDataRow");
_p.getValueByIndex = function (n) {
    var name = this._table.getColumns()[n].getName();
    return this.getValueByName(name);
};
_p.getValueByName = function (s) {
    var c = this._table.getColumnByName(s);
    if (c) {
        var n = c.getEncodedName();
        var node = this._xmlElement.selectSingleNode(n);
        return BiXsTypeConverter.getJsValue(node ? node.text : c.getDefaultValue(), c.getXsType());
    }
    return null;
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiDataRow.prototype.dispose.call(this);
    this._xmlElement = null;
};

function BiAccordionPane() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._radioGroup = new BiRadioGroup();
    this.setAppearance("accordion-pane");
    this.setSize(400, 200);
}
_p = _biExtend(BiAccordionPane, BiComponent, "BiAccordionPane");
_p._animated = true;
_p._animationSpeed = 1.4;
BiAccordionPane.addProperty("animated", BiAccessType.READ_WRITE);
_p.setAnimationSpeed = function (iSpeed) {
    this._animationSpeed = Math.max(parseFloat(iSpeed), 1);
};
BiAccordionPane.addProperty("animationSpeed", BiAccessType.READ);
_p.add = function (oChild, oBefore, bAnon) {
    if (oChild instanceof BiAccordionPage) {
        BiComponent.prototype.add.call(this, oChild, oBefore, bAnon);
        this._radioGroup.add(oChild);
        if (this._radioGroup.getSelected() == null) oChild.setChecked(true);
        this.invalidateLayout();
    }
};
_p.remove = function (oChild) {
    if (oChild instanceof BiAccordionPage) {
        this._radioGroup.remove(oChild);
        BiComponent.prototype.remove.call(this, oChild);
        this.invalidateLayout();
        return oChild;
    }
};
_p.getTabChildren = function () {
    var res = [];
    this._children.filter(function (c) {
        return c instanceof BiAccordionPage;
    }).forEach(function (c) {
        if (c.getSelected()) {
            res.push(c.getAccordionButton());
            res.push(c.getContentPane());
        }
    });
    return res;
};
_p.layoutAllChildren = function () {
    if (!this._created || this._disposed) return;
    if (this._animated && this._animationSpeed != 1) {
        if (!this._animation) {
            this._animation = new BiTimer(50);
            this._animation.addEventListener("tick", this._animateLayout, this);
        }
        this._animation.start();
    } else {
        this._animateLayout();
    }
};
_p._animateLayout = function () {
    var i;
    if (!this._children || this._children.length == 0) return;
    var c = this._children;
    var heights = [];
    var selected = c.indexOf(this._radioGroup.getSelected());
    var ch = this.getClientHeight();
    var maxHeight = ch - this.getMinimumHeight() + c[selected].getMinimumHeight();
    var remainingHeight = ch;
    var dirty = false;
    var animated = this._animated && this._animationSpeed != 1;
    for (i = 0; i < c.length; i++) {
        if (selected == i) continue;
        var h = c[i].getClipHeight() || 0;
        remainingHeight -= heights[i] = Math.max(animated ? h - Math.ceil(h / this._animationSpeed) : 0, c[i].getMinimumHeight());
        if (heights[i] != h) dirty = true;
    }
    if (selected != -1) heights[selected] = remainingHeight;
    var animationFinished = !dirty && this.getIsAnimated();
    if (animationFinished) this._animation.stop();
    var w = this.getClientWidth();
    var y = 0;
    for (i = 0; i < c.length; i++) {
        c[i].setClipHeight(heights[i]);
        c[i].getContentPane().setVisible(heights[i] > c[i].getMinimumHeight());
        this._layoutChild2(c[i], 0, y, w, maxHeight, true);
        y += heights[i];
    }
    if (animationFinished || !animated) this.dispatchEvent("change");
};
_p.getSelected = function () {
    return this._radioGroup.getSelected();
};
_p.setSelected = function (oButton) {
    if (oButton) this._radioGroup.setSelected(oButton);
};
_p.getIsAnimated = function () {
    return this._animation && this._animation.getEnabled();
};
_p.getMinimumHeight = function () {
    if (!this._children || this._children.length == 0) return 0;
    var h = 0;
    for (var i = 0; i < this._children.length; i++) h += this._children[i].getMinimumHeight();
    return h;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    if (this._animation) {
        this._animation.removeEventListener("tick", this._animateLayout, this);
        this._animation.dispose();
    }
    this._radioGroup.dispose();
    this._radioGroup = null;
};

function BiAccordionButton(sText, oIcon) {
    if (_biInPrototype) return;
    BiButton.call(this, sText || "Untitled");
    this.setIcon(oIcon);
    this.setTabIndex(0);
    this.setCanSelect(false);
    this.setAppearance("accordion-button");
    this.makeThemeAware();
    this._maybeHideFocus();
    this._label._preventCacheHeight = true;
}
_p = _biExtend(BiAccordionButton, BiButton, "BiAccordionButton");
_p._tagName = "DIV";
_p._preventCacheHeight = true;
_p.getChecked = function () {
    return this._parent ? this._parent.getChecked() || false : false;
};
_p.setChecked = function (bChecked) {
    this.setTabIndex(bChecked ? 1 : 0);
    return this._parent.setChecked(bChecked || false);
};
_p._maybeHideFocus = function () {
    this.setHideFocus(application.getThemeManager().getDefaultTheme().getAppearanceProperty("tab-button", "hide-focus"));
};

function BiAccordionPage(sText, oIcon) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setHideFocus(true);
    this.setAppearance("accordion-page");
    this._pageButton = new BiAccordionButton(sText || "Untitled", oIcon);
    BiComponent.prototype.add.call(this, this._pageButton);
    this.setContentPane(new BiComponent());
    this._pageButton.addEventListener("action", this._onButtonClick, this);
    this._pageButton.addEventListener("keydown", this._onButtonKeyDown, this);
}
_p = _biExtend(BiAccordionPage, BiComponent, "BiAccordionPage");
_p._checked = false;
_p.getAccordionButton = function () {
    return this._pageButton;
};
_p.getText = function () {
    return this._pageButton.getText();
};
_p.setText = function (sText) {
    this._pageButton.setText(sText);
};
_p.getIcon = function () {
    return this._pageButton.getIcon();
};
_p.setIcon = function (oIcon) {
    this._pageButton.setIcon(oIcon);
};
BiAccordionPage.addProperty("contentPane", BiAccessType.READ);
_p.setContentPane = function (oObject) {
    if (this._contentPane) {
        BiComponent.prototype.remove.call(this, this._contentPane);
        this._contentPane.dispose();
    }
    this._contentPane = oObject;
    oObject._preventCacheHeight = true;
    BiComponent.prototype.add.call(this, this._contentPane, null, true);
};
_p.add = function (oChild, oBefore, bAnon) {
    this._contentPane.add(oChild, oBefore, bAnon);
};
_p.remove = function (oChild) {
    this._contentPane.remove(oChild);
};
_p.getChildren = function () {
    return this._contentPane.getChildren();
};
_p.getFirstChild = function () {
    return this._contentPane.getFirstChild();
};
_p.getLastChild = function () {
    return this._contentPane.getLastChild();
};
BiAccordionPage.addProperty("userValue", BiAccessType.READ_WRITE);
BiAccordionPage.addProperty("group", BiAccessType.READ);
_p.setGroup = function (oRadioGroup) {
    if (this._radioGroup != oRadioGroup) {
        if (this._radioGroup) this._radioGroup.remove(this);
        this._radioGroup = oRadioGroup;
        if (this._radioGroup) this._radioGroup.add(this);
    }
};
_p.getValue = _p.getSelected = _p.getChecked = function () {
    return this._checked;
};
_p.setValue = _p.setSelected = _p.setChecked = function (bChecked) {
    if (this._checked != bChecked) {
        this._checked = bChecked;
        this._pageButton.setTabIndex(bChecked ? 1 : 0);
        this._pageButton.dispatchEvent("change");
        if (this._radioGroup && bChecked) this._radioGroup.setSelected(this);
        if (this._parent) this._parent.invalidateLayout();
    }
};
_p._onButtonClick = function (e) {
    if (this._pageButton.getIsEnabled()) {
        this._pageButton.setChecked(true);
    }
};
_p._onButtonKeyDown = function (e) {
    var actions = {
        "selection.up": "getPreviousSibling",
        "selection.left": "getPreviousSibling",
        "selection.down": "getNextSibling",
        "selection.right": "getNextSibling"
    };
    for (var n in actions)
        if (e.matchesBundleShortcut(n)) {
            var action = actions[n];
            var next = this[action]();
            if (next) {
                next.setChecked(true);
                next.getAccordionButton().setFocused(true);
            }
            e.preventDefault();
            break;
        }
};
_p.getMinimumHeight = function () {
    return this._pageButton.getPreferredHeight();
};
_p.layoutAllChildren = function () {
    if (!this._created || this._disposed) return;
    var mh = this.getMinimumHeight();
    var w = this.getClientWidth();
    var h = this.getClientHeight();
    this._pageButton.setWidth(w);
    this._layoutChild2(this._pageButton, 0, 0, w, mh);
    this._pageButton.invalidateLayout();
    this._layoutChild2(this._contentPane, 0, mh, w, h - mh, true);
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
    case "icon":
        this.setIcon(BiImage.fromUri(sValue));
        break;
    default:
        BiComponent.prototype.setAttribute.apply(this, arguments);
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    this._pageButton.dispose();
    this._contentPane.dispose();
    BiComponent.prototype.dispose.call(this);
};