/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiSvgDrawLine(nWidth, sType, sForeColor, sStartArrowStyle, sEndArrowStyle) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._elementProperties = {};
    if (nWidth) this.setWidth(nWidth);
    if (sType) this.setType(sType);
    if (sForeColor) this.setForeColor(sForeColor);
    if (sStartArrowStyle) this.setStartArrowStyle(sStartArrowStyle);
    if (sEndArrowStyle) this.setEndArrowStyle(sEndArrowStyle);
    this.addEventListener("mouseover", function (e) {
        if (this._hoverColor) {
            this._oldColor = this._foreColor;
            this.setForeColor(this._hoverColor || this._foreColor);
        }
    });
    this.addEventListener("mouseout", function (e) {
        this.setForeColor(this._oldColor || this._foreColor);
    });
}
_p = _biExtend(BiSvgDrawLine, BiComponent, "BiSvgDrawLine");
_p._width = 1;
_p._startArrowStyle = null;
_p._endArrowStyle = null;
_p._type = "solid";
_p._foreColor = "#000";
_p._startX = 0;
_p._startY = 0;
_p._endX = 0;
_p._endY = 0;
_p._tagName = "g";
_p._elementProperties = null;
_p._lineElement = null;
_p._element = null;
_p._startArrowElement = null;
_p._endArrowElement = null;
_p._hoverColor = null;
BiSvgDrawLine.addProperty("hoverColor", BiAccessType.READ_WRITE);
BiSvgDrawLine.addProperty("type", BiAccessType.READ);
BiSvgDrawLine.addProperty("startArrowStyle", BiAccessType.READ);
BiSvgDrawLine.addProperty("endArrowStyle", BiAccessType.READ);
BiSvgDrawLine.addProperty("width", BiAccessType.READ);
BiSvgDrawLine.addProperty("foreColor", BiAccessType.READ);
_p._create = function (oDocument) {
    this._document = oDocument || document;
    var ns = BiSvgCanvas.SVGNS;
    var el = this._element = this._document.createElementNS(ns, this._tagName);
    el._biComponent = this;
    el.appendChild(this._lineElement = this._document.createElementNS(ns, "line"));
    this._created = true;
    this.setForeColor(this._foreColor);
    this.setHoverColor(this._hoverColor);
    this.setStartPoint(this._startX, this._startY);
    this.setEndPoint(this._endX, this._endY);
    this.setWidth(this._width);
    this.setType(this._type);
    this.setEndArrowStyle(this._endArrowStyle);
    this.setStartArrowStyle(this._startArrowStyle);
    return this._element;
};
_p.setStyleProperty = _p.setHtmlProperty = BiAccessType.FUNCTION_EMPTY;
_p.getStyleProperty = _p.getHtmlProperty = BiAccessType.FUNCTION_EMPTY;
_p.removeStyleProperty = _p.removeHtmlProperty = BiAccessType.FUNCTION_EMPTY;
_p.setStartArrowStyle = function (style) {
    this._startArrowStyle = style;
    if (this._created) {
        var el = this._startArrowElement;
        if (el) this._element.removeChild(el);
        switch (style) {
        case "circle":
            el = this._createCircle();
            break;
        case "arrow":
            el = this._createArrow(true);
            break;
        default:
            el = null;
        }
        if (el) this._element.appendChild(el);
        this._startArrowElement = el;
        this._updateStartArrowPlacement();
    }
};
_p.setEndArrowStyle = function (style) {
    this._endArrowStyle = style;
    if (this._created) {
        var el = this._endArrowElement;
        if (el) this._element.removeChild(el);
        switch (style) {
        case "circle":
            el = this._createCircle();
            break;
        case "arrow":
            el = this._createArrow(false);
            break;
        default:
            el = null;
        }
        if (el) this._element.appendChild(el);
        this._endArrowElement = el;
        this._updateEndArrowPlacement();
    }
};
_p._createCircle = function () {
    var el = document.createElementNS(BiSvgCanvas.SVGNS, "circle");
    el.setAttribute("r", this._width <= 1 ? 4 : this._width * 1.5);
    el.setAttribute("fill", this._foreColor);
    return el;
};
_p._createArrow = function (start) {
    var id = "svg" + Math.round(Math.random() * 10000);
    var el = document.createElementNS(BiSvgCanvas.SVGNS, "marker");
    el.setAttribute("id", id);
    el.setAttribute("viewBox", "0 0 10 10");
    el.setAttribute("refY", "5");
    el.setAttribute("orient", "auto");
    if (this._width <= 1) {
        el.setAttribute("markerWidth", 5);
        el.setAttribute("markerHeight", 5);
    }
    var pathEl = document.createElementNS(BiSvgCanvas.SVGNS, "path");
    pathEl.setAttribute("fill", this._foreColor);
    el.appendChild(pathEl);
    if (start) {
        el.setAttribute("refX", "5");
        pathEl.setAttribute("d", "M 10 0 L 0 5 L 10 10 z");
        this._lineElement.setAttribute("marker-start", "url(#" + id + ")");
    } else {
        el.setAttribute("refX", "9.5");
        pathEl.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
        this._lineElement.setAttribute("marker-end", "url(#" + id + ")");
    }
    return el;
};
_p._updateStartArrowPlacement = function () {
    if (this._startArrowElement) {
        switch (this._startArrowStyle) {
        case "circle":
            var x2 = this._startX,
                y2 = this._startY;
            var diff = parseInt(this._startArrowElement.getAttributeNS(null, "r")) / 4;
            x2 += x2 < this._endX ? diff : x2 > this._endX ? -diff : 0;
            y2 += y2 < this._endY ? diff : y2 > this._endY ? -diff : 0;
            this._startArrowElement.setAttribute("cx", x2);
            this._startArrowElement.setAttribute("cy", y2);
            break;
        }
    }
};
_p._updateEndArrowPlacement = function () {
    if (this._endArrowElement) {
        switch (this._endArrowStyle) {
        case "circle":
            var x2 = this._endX,
                y2 = this._endY;
            var diff = parseInt(this._endArrowElement.getAttributeNS(null, "r")) / 4;
            x2 += x2 < this._startX ? diff : x2 > this._startX ? -diff : 0;
            y2 += y2 < this._startY ? diff : y2 > this._startY ? -diff : 0;
            this._endArrowElement.setAttribute("cx", x2);
            this._endArrowElement.setAttribute("cy", y2);
            break;
        }
    }
};
_p.setStartPoint = function (x, y) {
    this._startX = x;
    this._startY = y;
    if (this._created) {
        this._lineElement.setAttribute("x1", x);
        this._lineElement.setAttribute("y1", y);
        this._updateStartArrowPlacement();
    }
};
_p.getStartPoint = function () {
    return [this._startX, this._startY];
};
_p.setEndPoint = function (x, y) {
    this._endX = x;
    this._endY = y;
    if (this._created) {
        this._lineElement.setAttribute("x2", x);
        this._lineElement.setAttribute("y2", y);
        this._updateEndArrowPlacement();
    }
};
_p.getEndPoint = function () {
    return [this._endX, this._endY];
};
_p.setForeColor = function (sColor) {
    this._foreColor = sColor;
    if (this._created) {
        this._lineElement.setAttribute("stroke", sColor);
        var el = this._startArrowElement;
        if (el) {
            if (this._startArrowStyle == "arrow") el = el.childNodes[0];
            el.setAttribute("fill", sColor);
        }
        if ((el = this._endArrowElementl)) {
            if (this._endArrowStyle == "arrow") el = el.childNodes[0];
            el.setAttribute("fill", sColor);
        }
    }
};
_p.setWidth = function (nWidth) {
    this._width = nWidth;
    if (this._created) {
        this._lineElement.setAttribute("stroke-width", this._width);
        this.setStartArrowStyle(this._startArrowStyle);
        this.setEndArrowStyle(this._endArrowStyle);
    }
};
_p.setType = function (sType) {
    this._type = sType;
    if (this._created) {
        var spaceWidth, dashWidth;
        switch (this._type) {
        case "dotted":
            spaceWidth = this._width * 5;
            dashWidth = spaceWidth / 4;
            break;
        case "dashed":
            spaceWidth = this._width * 2;
            dashWidth = spaceWidth / 0.5;
            break;
        case "solid":
            spaceWidth = dashWidth = 0;
            break;
        }
        this._lineElement.setAttribute("stroke-dasharray", dashWidth + "," + spaceWidth);
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    this.disposeFields(["_type", "_startArrowStyle", "_endArrowStyle", "_startX", "_startY", "_endX", "_endY", "_foreColor", "_elementProperties", "_endArrowElement", "_startArrowElement", "_element", "_lineElement", "_hoverColor"]);
    BiComponent.prototype.dispose.call(this);
};

function BiDrawLine(nWidth, sType, sForeColor, sStartArrowStyle, sEndArrowStyle) {
    if (_biInPrototype) return;
    var superClass = BiBrowserCheck.features.hasSvg ? BiSvgDrawLine : BiVmlDrawLine;
    superClass.call(this, nWidth, sType, sForeColor, sStartArrowStyle, sEndArrowStyle);
}
_biExtend(BiDrawLine, BiComponent, "BiDrawLine");
BiDrawLine.addProperty("foreColor", BiAccessType.READ_WRITE);
BiDrawLine.addProperty("hoverColor", BiAccessType.READ_WRITE);
BiDrawLine.addProperty("startArrowStyle", BiAccessType.READ_WRITE);
BiDrawLine.addProperty("endArrowStyle", BiAccessType.READ_WRITE);
BiDrawLine.addProperty("width", BiAccessType.READ_WRITE);
BiDrawLine.addProperty("type", BiAccessType.READ_WRITE);
_p = _biExtend(BiDrawLine, BiBrowserCheck.features.hasSvg ? BiSvgDrawLine : BiVmlDrawLine, "BiDrawLine");

function BiSvgCanvas() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setLocation(0, 0);
    this.setRight(0);
    this.setBottom(0);
    this._childQueue = [];
    this.setHideFocus(true);
    this.setCanSelect(false);
    this.setTabIndex(-1);
    this.setBackColor("transparent");
}
BiSvgCanvas.SVGNS = "http://www.w3.org/2000/svg";
_p = _biExtend(BiSvgCanvas, BiComponent, "BiSvgCanvas");
_p.__canvasLoaded = false;
_p._childQueue = null;
_p._svgElement = null;
_p._create = function (oDocument) {
    BiComponent.prototype._create.call(this, oDocument);
    this._svgElement = oDocument.createElementNS(BiSvgCanvas.SVGNS, "svg");
    this._element.appendChild(this._svgElement);
    this.__canvasLoaded = true;
    this._addChildren();
};
BiSvgCanvas.addProperty("svgElement", BiAccessType.READ);
_p.setWidth = function (nWidth) {
    BiComponent.prototype.setWidth.call(this, nWidth);
    if (this._svgElement) {
        this._svgElement.setAttributeNS(null, "width", nWidth);
    }
};
_p.setHeight = function (nHeight) {
    BiComponent.prototype.setHeight.call(this, nHeight);
    if (this._svgElement) {
        this._svgElement.setAttributeNS(null, "height", nHeight);
    }
};
_p._addChildren = function () {
    for (var i = 0; i < this._childQueue.length; i++) this.add(this._childQueue[i]);
    this._childQueue = [];
};
_p.add = function (oChild) {
    if (oChild instanceof BiDrawLine) {
        if (this.__canvasLoaded) {
            var el = oChild._created ? oChild._element : oChild._create();
            this.getSvgElement().appendChild(el);
            this._children.push(oChild);
            oChild._parent = this;
        } else this._childQueue.push(oChild);
    }
};
_p.remove = function (oChild) {
    if (oChild instanceof BiDrawLine) {
        if (oChild._parent == this) {
            this.getSvgElement().removeChild(oChild._element);
            this._children.remove(oChild);
            oChild._parent = null;
        } else this._childQueue.remove(oChild);
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    this.disposeFields("_childQueue");
    BiComponent.prototype.dispose.call(this);
};

function BiDrawAnchor() {
    if (_biInPrototype) return;
    BiObject.call(this);
}
_p = _biExtend(BiDrawAnchor, BiObject, "BiDrawAnchor");
BiDrawAnchor.TL = 0x01;
BiDrawAnchor.TC = 0x02;
BiDrawAnchor.TR = 0x04;
BiDrawAnchor.ML = 0x08;
BiDrawAnchor.MC = 0x10;
BiDrawAnchor.MR = 0x20;
BiDrawAnchor.BL = 0x40;
BiDrawAnchor.BC = 0x80;
BiDrawAnchor.BR = 0x100;
BiDrawAnchor.T = BiDrawAnchor.TL | BiDrawAnchor.TC | BiDrawAnchor.TR;
BiDrawAnchor.M = BiDrawAnchor.ML | BiDrawAnchor.MC | BiDrawAnchor.MR;
BiDrawAnchor.B = BiDrawAnchor.BL | BiDrawAnchor.BC | BiDrawAnchor.BR;
BiDrawAnchor.L = BiDrawAnchor.TL | BiDrawAnchor.ML | BiDrawAnchor.BL;
BiDrawAnchor.C = BiDrawAnchor.TC | BiDrawAnchor.MC | BiDrawAnchor.BC;
BiDrawAnchor.R = BiDrawAnchor.TR | BiDrawAnchor.MR | BiDrawAnchor.BR;
BiDrawAnchor.ANY = BiDrawAnchor.T | BiDrawAnchor.M | BiDrawAnchor.B;
BiDrawAnchor.EDGES = BiDrawAnchor.TC | BiDrawAnchor.ML | BiDrawAnchor.MR | BiDrawAnchor.BC;
BiDrawAnchor.CORNERS = BiDrawAnchor.TL | BiDrawAnchor.TR | BiDrawAnchor.BL | BiDrawAnchor.BR;
BiDrawAnchor._PRIMARY = [BiDrawAnchor.TC, BiDrawAnchor.MR, BiDrawAnchor.BC, BiDrawAnchor.ML, BiDrawAnchor.TL, BiDrawAnchor.TR, BiDrawAnchor.BR, BiDrawAnchor.BL];

function BiLink(oStartComponent, oEndComponent, oLine, nStartAnchor, nEndAnchor, nDirection) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._startComponent = oStartComponent;
    this._endComponent = oEndComponent;
    this._line = oLine;
    this._startAnchor = nStartAnchor;
    this._endAnchor = nEndAnchor;
    this.setDirection(nDirection);
}
BiLink.LEFT = 10;
BiLink.RIGHT = 11;
BiLink.BOTH = 12;
_p = _biExtend(BiLink, BiEventTarget, "BiLink");
_p._direction = BiLink.BOTH;
_p._startComponent = null;
_p._endComponent = null;
_p._line = null;
_p._startAnchor = null;
_p._endAnchor = null;
BiLink.addProperty("startComponent", BiAccessType.READ_WRITE);
BiLink.addProperty("endComponent", BiAccessType.READ_WRITE);
BiLink.addProperty("line", BiAccessType.READ_WRITE);
BiLink.addProperty("startAnchor", BiAccessType.READ_WRITE);
BiLink.addProperty("endAnchor", BiAccessType.READ_WRITE);
BiLink.addProperty("direction", BiAccessType.READ_WRITE);
_p.dispose = function () {
    if (this._disposed) return;
    this._startComponent = null;
    this._endComponent = null;
    if (this._line._parent) this._line._parent.remove(this._line);
    this._line.dispose();
    this._startAnchor = null;
    this._endAnchor = null;
    this._direction = null;
    BiEventTarget.prototype.dispose.call(this);
};

function BiLinkManager() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._links = [];
    if (BiBrowserCheck.features.hasSvg) {
        this.add(this._canvas = new BiSvgCanvas());
    } else {
        this._canvas = this;
    }
}
_p = _biExtend(BiLinkManager, BiComponent, "BiLinkManager");
_p._links = null;
_p._lastLine = null;
BiLinkManager.addProperty("links", BiAccessType.READ);
_p._getDockPoints = function (oComp, sAnchor) {
    var x = oComp.getLeft();
    var y = oComp.getTop();
    var w = (oComp.getClipWidth() ? oComp.getClipWidth() : oComp.getWidth()) - 1;
    var h = (oComp.getClipHeight() ? oComp.getClipHeight() : oComp.getHeight()) - 1;
    var pts = {};
    var sAnchor2;
    for (var i = 0; i < BiDrawAnchor._PRIMARY.length; i++) {
        sAnchor2 = BiDrawAnchor._PRIMARY[i];
        if (sAnchor & sAnchor2) {
            pts[sAnchor2] = this._getPointFromAnchor(oComp, sAnchor2, x, y, w, h);
        }
    }
    return pts;
};
_p._getPointFromAnchor = function (oComp, sAnchor, x, y, w, h) {
    var px, py;
    switch (sAnchor) {
    case BiDrawAnchor.TL:
        px = x;
        py = y;
        break;
    case BiDrawAnchor.TC:
        px = x + (w / 2);
        py = y;
        break;
    case BiDrawAnchor.TR:
        px = x + w;
        py = y;
        break;
    case BiDrawAnchor.ML:
        px = x;
        py = y + (h / 2);
        break;
    case BiDrawAnchor.MC:
        px = x + (w / 2);
        py = y + (h / 2);
        break;
    case BiDrawAnchor.MR:
        px = x + w;
        py = y + (h / 2);
        break;
    case BiDrawAnchor.BL:
        px = x;
        py = y + h;
        break;
    case BiDrawAnchor.BC:
        px = x + (w / 2);
        py = y + h;
        break;
    case BiDrawAnchor.BR:
        px = x + w;
        py = y + h;
        break;
    }
    return [Math.round(px), Math.round(py)];
};
_p._computeDistance = function (x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return dx * dx + dy * dy;
};
_p._getMinPoints = function (c1Points, c2Points) {
    var min_distance = Number.MAX_VALUE,
        distance;
    var p1, p2, t1, t2;
    for (var i1 in c1Points) {
        t1 = c1Points[i1];
        for (var i2 in c2Points) {
            t2 = c2Points[i2];
            distance = this._computeDistance(t1[0], t1[1], t2[0], t2[1]);
            if (distance < min_distance) {
                p1 = t1;
                p2 = t2;
                min_distance = distance;
            }
        }
    }
    return [p1, p2];
};
_p._updateLink = function (oLink) {
    if (!this._links.contains(oLink)) throw new Error("Link not found!");
    var line = oLink.getLine();
    var minPoints = this._getMinPoints(this._getDockPoints(oLink.getStartComponent(), oLink.getStartAnchor()), this._getDockPoints(oLink.getEndComponent(), oLink.getEndAnchor()));
    line.setStartPoint(minPoints[0][0], minPoints[0][1]);
    line.setEndPoint(minPoints[1][0], minPoints[1][1]);
};
_p.update = function () {
    for (var i = 0; i < this._links.length; i++) {
        this._updateLink(this._links[i]);
    }
};
_p.addLink = function (oLink) {
    if (!(oLink instanceof BiLink)) throw new Error("Can only add BiLink objects to BiLinkManager!");
    if (!this._links.contains(oLink)) {
        this._links.push(oLink);
        this._updateLink(oLink);
        var sc = oLink.getStartComponent(),
            ec = oLink.getEndComponent();
        sc.addEventListener("move", this._eventUpdateLink, this);
        sc.addEventListener("resize", this._eventUpdateLink, this);
        ec.addEventListener("move", this._eventUpdateLink, this);
        ec.addEventListener("resize", this._eventUpdateLink, this);
        this._canvas.add(oLink.getLine());
    }
};
_p.removeLink = function (oLink) {
    if (this._links.contains(oLink)) {
        this._links.remove(oLink);
        var sc = oLink.getStartComponent();
        var ec = oLink.getEndComponent();
        if (this.getLinksForComponent(sc).length == 0) {
            sc.removeEventListener("move", this._eventUpdateLink, this);
            sc.removeEventListener("resize", this._eventUpdateLink, this);
        }
        if (this.getLinksForComponent(ec).length == 0) {
            ec.removeEventListener("move", this._eventUpdateLink, this);
            ec.removeEventListener("resize", this._eventUpdateLink, this);
        }
        if (!this._disposed) {
            this._canvas.remove(oLink.getLine());
        }
    }
};
_p._eventUpdateLink = function (e) {
    var t = e.getTarget();
    if (!t) return;
    var links = this.getLinksForComponent(t);
    for (var i = 0; i < links.length; i++) this._updateLink(links[i]);
};
_p.getLinkForLine = function (oLine) {
    for (var i = 0; i < this._links.length; i++)
        if (this._links[i].getLine() == oLine) return this._links[i];
    return null;
};
_p.getLinksForComponent = function (oComp) {
    var ls = [];
    var l;
    for (var i = 0; i < this._links.length; i++) {
        l = this._links[i];
        if (!ls.contains(l) && (l.getStartComponent() == oComp || l.getEndComponent() == oComp)) ls.push(l);
    }
    return ls;
};
_p._layoutChild = function (oChild) {
    if (BiBrowserCheck.features.hasSvg && oChild instanceof BiSvgCanvas) {
        oChild.setWidth(this.getScrollWidth());
        oChild.setHeight(this.getScrollHeight());
    } else {
        return BiComponent.prototype._layoutChild.call(this, oChild);
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    for (var i = 0; i < this._links.length; i++) this.removeLink(this._links[i]);
    this.disposeFields("_links");
    if (!this._canvas._disposed) {
        this.remove(this._canvas);
        this._canvas.dispose();
    }
};