/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiVmlDrawLine(nWidth, sType, sForeColor, sStartArrowStyle, sEndArrowStyle) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    if (!document.namespaces.v) {
        document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
    }
    this._strokeStyleElement = document.createElement("v:stroke");
    this.setStartArrowStyle(sStartArrowStyle);
    this.setEndArrowStyle(sEndArrowStyle);
    this.setWidth(nWidth);
    this.setType(sType || "solid");
    this.setForeColor(sForeColor || "#000");
    this.setZIndex(-1);
    this.addEventListener("mouseover", function (e) {
        if (this._hoverColor) {
            this._oldColor = this._foreColor;
            this.setForeColor(this._hoverColor);
        }
    });
    this.addEventListener("mouseout", function (e) {
        if (this._hoverColor) this.setForeColor(this._oldColor || this._foreColor);
    });
}
_p = _biExtend(BiVmlDrawLine, BiComponent, "BiVmlDrawLine");
_p._startArrowStyle = null;
_p._endArrowStyle = null;
_p._type = "solid";
_p._tagName = "v:line";
_p._startX = 0;
_p._startY = 0;
_p._endX = 0;
_p._endY = 0;
_p._hoverColor = null;
BiVmlDrawLine.addProperty("hoverColor", BiAccessType.READ);
BiVmlDrawLine.addProperty("startArrowStyle", BiAccessType.READ);
BiVmlDrawLine.addProperty("endArrowStyle", BiAccessType.READ);
_p._create = function (d) {
    BiComponent.prototype._create.call(this, d);
    this._element.appendChild(this._strokeStyleElement);
};
_p.setHoverColor = function (sColor) {
    this._hoverColor = sColor;
};
_p.setStartArrowStyle = function (sStartArrowStyle) {
    var attr;
    switch (sStartArrowStyle) {
    case "circle":
        attr = "oval";
        break;
    case "arrow":
        attr = "classic";
        break;
    default:
        attr = "none";
        break;
    }
    this._strokeStyleElement.setAttribute("startarrow", attr);
};
_p.setEndArrowStyle = function (sEndArrowStyle) {
    var attr;
    switch (sEndArrowStyle) {
    case "circle":
        attr = "oval";
        break;
    case "arrow":
        attr = "classic";
        break;
    default:
        attr = "none";
        break;
    }
    this._strokeStyleElement.setAttribute("endarrow", attr);
};
_p.setWidth = function (nWidth) {
    this.setHtmlProperty("strokeweight", nWidth);
};
_p.getWidth = function () {
    return this.getHtmlProperty("strokeweight");
};
_p.setType = function (sType) {
    switch (sType) {
    case "dotted":
        sType = "dot";
        break;
    case "dashed":
        sType = "dash";
        break;
    case "solid":
        break;
    default:
        throw new Error("Unknown border style!");
    }
    this._strokeStyleElement.setAttribute("dashstyle", sType);
};
_p.getType = function () {
    return this._strokeStyleElement.getAttribute("dashstyle");
};
_p.setForeColor = function (sColor) {
    this._foreColor = sColor;
    this.setHtmlProperty("strokecolor", sColor);
};
_p.getForeColor = function () {
    return this.getHtmlProperty("strokecolor");
};
_p.setStartPoint = function (x, y) {
    this.setHtmlProperty("from", x + "," + y);
    this._startX = x;
    this._startY = y;
};
_p.getStartPoint = function () {
    return [this._startX, this._startY];
};
_p.setEndPoint = function (x, y) {
    this.setHtmlProperty("to", x + "," + y);
    this._endX = x;
    this._endY = y;
};
_p.getEndPoint = function () {
    return [this._endX, this._endY];
};
_p.dispose = function () {
    if (this._disposed) return;
    try {
        this._element.removeChild(this._strokeStyleElement);
    } catch (ex) {}
    this.disposeFields(["_type", "_startArrowStyle", "_endArrowStyle", "_startX", "_startY", "_endX", "_endY", "_lineElement", "_strokeStyleElement"]);
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