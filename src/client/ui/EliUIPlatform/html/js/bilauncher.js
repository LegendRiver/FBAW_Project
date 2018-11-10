/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
var _biInPrototype = false;

function _biExtend(fConstr, fSuperConstr, sName) {
    _biInPrototype = true;
    var p = fConstr.prototype = new fSuperConstr;
    if (sName) {
        p._className = sName;
    }
    p.constructor = fConstr;
    _biInPrototype = false;
    return p;
};
if (typeof BiObject == "undefined") BiObject = new Function;

function BiBrowserCheck() {
    throw new Error("Cannot create instance of BiBrowserCheck.");
};
_biExtend(BiBrowserCheck, BiObject, "BiBrowserCheck");
BiBrowserCheck.hasCssProperty = function (prop) {
    return document.documentElement.style[prop] !== undefined;
};
BiBrowserCheck.webkit = /WebKit\//i.test(navigator.userAgent);
BiBrowserCheck.ie = /msie/i.test(navigator.userAgent);
BiBrowserCheck.moz = navigator.product == "Gecko" && !BiBrowserCheck.webkit;
BiBrowserCheck.platform = navigator.platform;
BiBrowserCheck.platformIsMac = /^Mac/.test(navigator.platform);
BiBrowserCheck.khtml = /KHTML\//i.test(navigator.userAgent);
BiBrowserCheck.chrome = BiBrowserCheck.webkit && /Chrome\//i.test(navigator.userAgent);
BiBrowserCheck.safari = BiBrowserCheck.webkit && !BiBrowserCheck.chrome && /Safari\//i.test(navigator.userAgent);
BiBrowserCheck.hta = BiBrowserCheck.ie && !window.external;
BiBrowserCheck.version = (function () {
    var versionRegExp;
    if (BiBrowserCheck.moz) versionRegExp = /rv\:(.+?)[\);]/;
    else if (BiBrowserCheck.ie) versionRegExp = /MSIE\s+(.+?)[\);]/;
    else if (BiBrowserCheck.webkit) versionRegExp = /WebKit\/([\.\d]+)/;
    else if (BiBrowserCheck.khtml) versionRegExp = /KHTML\/([\.\d]+)/;
    else throw new Error("Unable to detect Browser version.");
    versionRegExp.test(navigator.userAgent);
    return RegExp.$1;
})();
BiBrowserCheck.versionNumber = parseFloat(BiBrowserCheck.version);
BiBrowserCheck.supported = (BiBrowserCheck.ie && BiBrowserCheck.versionNumber >= 5.5) || (BiBrowserCheck.moz && BiBrowserCheck.versionNumber >= 1.4) || (BiBrowserCheck.webkit && BiBrowserCheck.versionNumber >= 525);
BiBrowserCheck.features = {
    hasInnerText: document.documentElement.innerText !== undefined,
    hasTextContent: document.documentElement.textContent !== undefined,
    hasElementFromPoint: document.documentElement.elementFromPoint !== undefined,
    hasScreenLeftTop: (document.defaultView || document.parentWindow).screenLeft !== undefined,
    hasGetBoxObjectFor: document.getBoxObjectFor !== undefined,
    hasGetBoundingClientRect: document.documentElement.getBoundingClientRect !== undefined,
    hasSvg: !BiBrowserCheck.ie,
    hasOverflowX: BiBrowserCheck.hasCssProperty('overflowX'),
    quirksMode: document.compatMode === "BackCompat",
    strictMode: document.compatMode === "CSS1Compat"
};
BiBrowserCheck.quirks = {
    obsoleteMsxml: false,
    contextmenuPrevented: BiBrowserCheck.moz && BiBrowserCheck.platformIsMac && BiBrowserCheck.versionNumber >= 1.9,
    brokenEvalContext: false,
    noLoadEventFromLinkElement: !BiBrowserCheck.ie,
    doubleFocusHackNeededForBrowser: BiBrowserCheck.moz && BiBrowserCheck.version.match(/1\.8\.0/),
    forbidsAcceptEncoding: BiBrowserCheck.webkit || BiBrowserCheck.khtml,
    bogusNonHttpRequestStatus: BiBrowserCheck.webkit || BiBrowserCheck.khtml,
    brokenTabIndex: BiBrowserCheck.moz && BiBrowserCheck.versionNumber < 1.8,
    useContentBoxForTd: BiBrowserCheck.moz && BiBrowserCheck.versionNumber < 1.9,
    openWindowAtLeftTopIsRelativeToChromeWindow: BiBrowserCheck.chrome,
    scrollAlwaysFires: BiBrowserCheck.webkit,
    screenError: undefined,
    controlProcessMouseDown: BiBrowserCheck.ie && BiBrowserCheck.versionNumber > 6.0,
    noNativeOuterHTML: typeof HTMLElement != "undefined" && !("outerHTML" in HTMLElement.prototype),
    tableLineHeightAdjust: BiBrowserCheck.safari ? -1 : 0,
    windowMoveToOffsetsY: BiBrowserCheck.safari && BiBrowserCheck.platformIsMac,
    gridNeedsLineHeight: BiBrowserCheck.safari,
    mozScrollBarBug: BiBrowserCheck.platformIsMac && BiBrowserCheck.moz && BiBrowserCheck.versionNumber < 1.9,
    mozDisappearingCaretBug: BiBrowserCheck.moz && BiBrowserCheck.versionNumber < 1.9,
    doesNotRepeatArrowKeysOnKeyDown: BiBrowserCheck.moz && BiBrowserCheck.platformIsMac
};
BiBrowserCheck.constants = {
    OPACITY_STYLE: BiBrowserCheck.moz ? "opacity" : BiBrowserCheck.webkit ? "WebkitOpacity" : "",
    USER_SELECT_STYLE: BiBrowserCheck.moz ? "MozUserSelect" : BiBrowserCheck.webkit ? "WebkitUserSelect" : null
};
if (BiBrowserCheck.quirks.noNativeOuterHTML) {
    var _emptyTags = {
        "IMG": true,
        "BR": true,
        "INPUT": true,
        "META": true,
        "LINK": true,
        "PARAM": true,
        "HR": true
    };
    HTMLElement.prototype.__defineGetter__("outerHTML", function () {
        var attrs = this.attributes;
        var str = "<" + this.tagName;
        for (var i = 0; i < attrs.length; i++) str += " " + attrs[i].name + "=\"" + attrs[i].value + "\"";
        if (_emptyTags[this.tagName]) return str + ">";
        return str + ">" + this.innerHTML + "</" + this.tagName + ">";
    });
    HTMLElement.prototype.__defineSetter__("outerHTML", function (sHTML) {
        var r = this.ownerDocument.createRange();
        r.setStartBefore(this);
        var df = r.createContextualFragment(sHTML);
        this.parentNode.replaceChild(df, this);
    });
}
if (typeof HTMLElement != "undefined" && typeof HTMLElement.prototype.insertAdjacentHTML == "undefined") {
    HTMLElement.prototype.insertAdjacentHTML = function (where, html) {
        var df;
        var r = this.ownerDocument.createRange();
        switch (String(where).toLowerCase()) {
        case "beforebegin":
            r.setStartBefore(this);
            df = r.createContextualFragment(html);
            this.parentNode.insertBefore(df, this);
            break;
        case "afterbegin":
            r.selectNodeContents(this);
            r.collapse(true);
            df = r.createContextualFragment(html);
            this.insertBefore(df, this.firstChild);
            break;
        case "beforeend":
            r.selectNodeContents(this);
            r.collapse(false);
            df = r.createContextualFragment(html);
            this.appendChild(df);
            break;
        case "afterend":
            r.setStartAfter(this);
            df = r.createContextualFragment(html);
            this.parentNode.insertBefore(df, this.nextSibling);
            break;
        }
    };
}
if (typeof HTMLElement != "undefined" && typeof HTMLElement.prototype.insertAdjacentText == "undefined") {
    HTMLElement.prototype.insertAdjacentText = function (where, text) {
        text = text.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        this.insertAdjacentHTML(where, text);
    };
};
BiXml = {};
BiXml.getOwnerDocument = function (oNode) {
    return oNode.ownerDocument || oNode.document || (oNode._biComponent && oNode._biComponent._document) || document;
};

function BiXmlHttp() {
    if (_biInPrototype) return;
    if (typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest;
    }
    throw new Error("Your browser does not support XML HTTP Requests");
}
BiXmlHttp.prototype = new Object;
BiXmlHttp.create = function () {
    return new BiXmlHttp();
};

function BiXmlDocument() {
    if (_biInPrototype) return;
    if (document.implementation && document.implementation.createDocument) {
        return document.implementation.createDocument("", "", null);
    } else if (window.ActiveXObject) {
        return new ActiveXObject(BiXmlDocument._ACTIVEX_NAME);
    }
    throw new Error("Your browser does not support creating DOM documents at runtime");
}
BiXmlDocument.prototype = new Object;
BiXmlDocument.create = function () {
    return new BiXmlDocument();
};
BiXmlDocument.getNamespaces = function (oNode) {
    if (BiBrowserCheck.quirks.obsoleteMsxml) return {};
    if (!BiBrowserCheck.ie) return {};
    if (oNode.nodeType != 9) {
        oNode = BiXml.getOwnerDocument(oNode);
    }
    var res = {};
    var s = oNode.getProperty("SelectionNamespaces");
    s.replace(/(?:^|\s+)xmlns\:(.+?)=(["'])(.*?)\2/g, function () {
        res[arguments[1]] = arguments[3];
    });
    return res;
};
BiXmlDocument.setNamespaces = function (oNode, oNamespaces) {
    if (BiBrowserCheck.quirks.obsoleteMsxml) return;
    if (oNode.nodeType != 9) {
        oNode = BiXml.getOwnerDocument(oNode);
    }
    var sb = [];
    for (var i in oNamespaces) {
        sb.push("xmlns:", i, "=\"", oNamespaces[i], "\" ");
    }
    oNode.setProperty("SelectionNamespaces", sb.join(""));
};
BiXmlDocument.addNamespaces = function (oNode, oNamespaces) {
    if (BiBrowserCheck.quirks.obsoleteMsxml) return;
    var current = BiXmlDocument.getNamespaces(oNode);
    for (var i in oNamespaces) {
        current[i] = oNamespaces[i];
    }
    BiXmlDocument.setNamespaces(oNode, current);
};
BiXmlDocument.removeNamespaces = function (oNode, oNamespaces) {
    if (BiBrowserCheck.quirks.obsoleteMsxml) return;
    var current = BiXmlDocument.getNamespaces(oNode);
    for (var i in oNamespaces) {
        delete current[i];
    }
    BiXmlDocument.setNamespaces(oNamespaces, current);
};
if (typeof ActiveXObject == "undefined") {
    (function () {
        var _xmlDocPrototype = XMLDocument.prototype;
        _xmlDocPrototype.__proto__ = {
            __proto__: _xmlDocPrototype.__proto__
        };
        var _p = _xmlDocPrototype.__proto__;
        _p.createNode = function (aType, aName, aNamespace) {
            switch (aType) {
            case 1:
                if (aNamespace && aNamespace != "") return this.createElementNS(aNamespace, aName);
                else return this.createElement(aName);
            case 2:
                if (aNamespace && aNamespace != "") return this.createAttributeNS(aNamespace, aName);
                else return this.createAttribute(aName);
            case 3:
            default:
                return this.createTextNode("");
            }
        };
        _p.__realLoad = _xmlDocPrototype.load;
        _p.load = function (sUri) {
            this.readyState = 0;
            this.__realLoad(sUri);
        };
        _p.loadXML = function (s) {
            var doc2 = (new DOMParser).parseFromString(s, "text/xml");
            while (this.hasChildNodes()) this.removeChild(this.lastChild);
            var cs = doc2.childNodes;
            var l = cs.length;
            for (var i = 0; i < l; i++) this.appendChild(this.importNode(cs[i], true));
        };
        _p.setProperty = function (sName, sValue) {
            if (sName == "SelectionNamespaces") {
                this._selectionNamespaces = {};
                var parts = sValue.split(/\s+/);
                var re = /^xmlns\:([^=]+)\=((\"([^\"]*)\")|(\'([^\']*)\'))$/;
                for (var i = 0; i < parts.length; i++) {
                    re.test(parts[i]);
                    this._selectionNamespaces[RegExp.$1] = RegExp.$4 || RegExp.$6;
                }
            }
        };
        _p.__defineSetter__("onreadystatechange", function (f) {
            if (this._onreadystatechange) this.removeEventListener("load", this._onreadystatechange, false);
            this._onreadystatechange = f;
            if (f) this.addEventListener("load", f, false);
            return f;
        });
        _p.__defineGetter__("onreadystatechange", function () {
            return this._onreadystatechange;
        });
        BiXmlDocument._mozHasParseError = function (oDoc) {
            return !oDoc.documentElement || oDoc.documentElement.localName == "parsererror" && oDoc.documentElement.getAttribute("xmlns") == "http://www.mozilla.org/newlayout/xml/parsererror.xml";
        };
        _p.__defineGetter__("parseError", function () {
            var hasError = BiXmlDocument._mozHasParseError(this);
            var res = {
                errorCode: 0,
                filepos: 0,
                line: 0,
                linepos: 0,
                reason: "",
                srcText: "",
                url: ""
            };
            if (hasError) {
                res.errorCode = -1;
                try {
                    res.srcText = this.getElementsByTagName("sourcetext")[0].firstChild.data;
                    res.srcText = res.srcText.replace(/\n\-\^$/, "");
                } catch (ex) {
                    res.srcText = "";
                }
                try {
                    var s = this.documentElement.firstChild.data;
                    var re = /XML Parsing Error\: (.+)\nLocation\: (.+)\nLine Number (\d+)\, Column (\d+)/;
                    var a = re.exec(s);
                    res.reason = a[1];
                    res.url = a[2];
                    res.line = a[3];
                    res.linepos = a[4];
                } catch (ex) {
                    res.reason = "Unknown";
                }
            }
            return res;
        });
        var _nodePrototype = Node.prototype;
        _nodePrototype.__proto__ = {
            __proto__: _nodePrototype.__proto__
        };
        _p = _nodePrototype.__proto__;
        _p.__defineGetter__("xml", function () {
            return (new XMLSerializer).serializeToString(this);
        });
        _p.__defineGetter__("baseName", function () {
            var lParts = this.nodeName.split(":");
            return lParts[lParts.length - 1];
        });
        _p.__defineGetter__("text", function () {
            var cs = this.childNodes;
            var l = cs.length;
            var sb = new Array(l);
            for (var i = 0; i < l; i++) sb[i] = cs[i].text ? cs[i].text : cs[i].nodeValue;
            return sb.join("");
        });
        _p.selectNodes = function (sExpr) {
            var doc = this.nodeType == 9 ? this : BiXml.getOwnerDocument(this);
            var nsRes = doc.createNSResolver(this.nodeType == 9 ? this.documentElement : this);
            var nsRes2;
            if (doc._selectionNamespaces) {
                nsRes2 = function (s) {
                    if (s in doc._selectionNamespaces) return doc._selectionNamespaces[s];
                    return nsRes.lookupNamespaceURI(s);
                };
            } else {
                nsRes2 = nsRes;
            }
            var xpRes = doc.evaluate(sExpr, this, nsRes2, 5, null);
            var res = [];
            var item;
            while ((item = xpRes.iterateNext())) res.push(item);
            return res;
        };
        _p.selectSingleNode = function (sExpr) {
            var doc = this.nodeType == 9 ? this : BiXml.getOwnerDocument(this);
            var nsRes;
            try {
                nsRes = doc.createNSResolver(this.nodeType == 9 ? this.documentElement : this);
            } catch (e) {
                nsRes = null;
            }
            var nsRes2;
            if (doc._selectionNamespaces) {
                nsRes2 = function (s) {
                    if (s in doc._selectionNamespaces) return doc._selectionNamespaces[s];
                    return nsRes.lookupNamespaceURI(s);
                };
            } else {
                nsRes2 = nsRes;
            }
            var xpRes = doc.evaluate(sExpr, this, nsRes2, 9, null);
            return xpRes.singleNodeValue;
        };
        _p.transformNode = function (oXsltNode) {
            var doc = this.nodeType == 9 ? this : BiXml.getOwnerDocument(this);
            var processor = new XSLTProcessor();
            processor.importStylesheet(oXsltNode);
            var df = processor.transformToFragment(this, doc);
            return df.xml;
        };
        _p.transformNodeToObject = function (oXsltNode, oOutputDocument) {
            var doc = this.nodeType == 9 ? this : BiXml.getOwnerDocument(this);
            var outDoc = oOutputDocument.nodeType == 9 ? oOutputDocument : BiXml.getOwnerDocument(oOutputDocument);
            var processor = new XSLTProcessor();
            processor.importStylesheet(oXsltNode);
            var df = processor.transformToFragment(this, doc);
            while (oOutputDocument.hasChildNodes()) oOutputDocument.removeChild(oOutputDocument.lastChild);
            var cs = df.childNodes;
            var l = cs.length;
            for (var i = 0; i < l; i++) oOutputDocument.appendChild(outDoc.importNode(cs[i], true));
        };
        var _attrPrototype = Attr.prototype;
        _attrPrototype.__proto__ = {
            __proto__: _attrPrototype.__proto__
        };
        _p = _attrPrototype.__proto__;
        _p.__defineGetter__("xml", function () {
            var nv = (new XMLSerializer).serializeToString(this);
            return this.nodeName + "=\"" + nv.replace(/\"/g, "&quot;") + "\"";
        });
        var _textPrototype = Text.prototype;
        _textPrototype.__proto__ = {
            __proto__: _textPrototype.__proto__
        };
        _p = _textPrototype.__proto__;
        _p.__defineGetter__("text", function () {
            return this.nodeValue;
        });
    })();
} else {
    (function () {
        var MSXML3 = {
            DomDocument: "Microsoft.XMLDOM",
            HttpRequest: "Microsoft.XMLHTTP",
            partialXpath: true
        };
        var MSXML6 = {
            DomDocument: "MSXML2.DOMDocument.6.0",
            HttpRequest: "MSXML2.XMLHTTP.6.0"
        };

        function tryVersion(version, both) {
            try {
                var doc = new ActiveXObject(version.DomDocument);
                if (both) new ActiveXObject(version.HttpRequest);
                BiBrowserCheck.quirks.obsoleteMsxml = !("setProperty" in doc);
                return version;
            } catch (error) {
                return null;
            }
        }
        var xmlVersion = window.XMLHttpRequest ? tryVersion(MSXML3) : tryVersion(MSXML6, 1) || tryVersion(MSXML3, 1);
        if (!xmlVersion) throw new Error("Could not find a supported MSXML version");
        BiXmlHttp._ACTIVEX_NAME = xmlVersion.HttpRequest;
        BiXmlDocument._ACTIVEX_NAME = xmlVersion.DomDocument;
        BiXmlDocument._PARTIAL_XPATH_SUPPORT = xmlVersion.partialXpath;
    })(); if (!window.XMLHttpRequest) {
        XMLHttpRequest = function () {
            return new ActiveXObject(BiXmlHttp._ACTIVEX_NAME);
        };
    }
    if (!window.DOMParser) {
        DOMParser = function () {};
        DOMParser.prototype.parseFromString = function (s, mime) {
            var doc = new BiXmlDocument;
            doc.loadXML(s);
            return doc;
        };
    }
    if (!window.XMLSerializer) {
        XMLSerializer = function () {};
        XMLSerializer.prototype.serializeToString = function (n) {
            return n.xml;
        };
    }
};

function BiLauncher(sRootPath) {
    if (_biInPrototype) return;
    if (sRootPath) this.setRootPath(sRootPath);
    this._arguments = [];
}
_p = _biExtend(BiLauncher, Object, "BiLauncher");
_p._reuseWindow = true;
_p._newWindow = true;
_p._errorMessage = "";
_p._accessibilityMode = false;
_p._focusOnLoad = true;
BiLauncher.MISSING_ADF_ARGUMENT = "Missing ADF argument";
BiLauncher.ADF_ARGUMENT_PARSE_ERROR = "The ADF argument cannot be parsed";
BiLauncher.IE_ERROR_PLATFORM = "Bindows requires Internet Explorer for Windows";
BiLauncher.IE_ERROR_VERSION = "Bindows requires Internet Explorer 5.5 or later";
BiLauncher.GECKO_ERROR_VERSION = "Bindows requires Mozilla (Gecko) 1.4 or later";
BiLauncher.NOT_SUPPORTED_ERROR = "Bindows requires Internet Explorer 5.5+ or Mozilla 1.4+";
BiLauncher.FILE_NOT_FOUND = "File not found";
BiLauncher.POPUP_BLOCKER_QUESTION = "Failed to open window. Are you using a popup blocker?";
_p.getReuseWindow = function () {
    return this._reuseWindow;
};
_p.setReuseWindow = function (b) {
    this._reuseWindow = b;
};
_p.getNewWindow = function () {
    return this._newWindow;
};
_p.setNewWindow = function (b) {
    this._newWindow = b;
};
_p.getWindow = function () {
    return this._window || null;
};
_p.getRootPath = function () {
    return this._rootPath;
};
_p.setRootPath = function (s) {
    s = String(s);
    if (s.charAt(s.length - 1) != "/") s += "/";
    this._rootPath = s;
};
_p.getAdfPath = function () {
    return this._adfPath;
};
_p.setAdfPath = function (s) {
    if (s == null || s == "") {
        this._errorMessage = BiLauncher.MISSING_ADF_ARGUMENT;
        return;
    }
    s = String(s);
    var re = /([\w ]+)(?:\.[\w ]+)?(?:$|\?)/;
    if (re.test(s)) {
        this._adfName = RegExp.$1;
        this._adfPath = s;
    } else {
        this._errorMessage = BiLauncher.ADF_ARGUMENT_PARSE_ERROR;
    }
};
_p.getAdfName = function () {
    return this._adfName;
};
_p.setAdfName = function (s) {
    this._adfName = s;
};
_p.getArguments = function () {
    return this._arguments;
};
_p.setArguments = function (a) {
    this._arguments = [];
    for (var i = 0; i < a.length; i++) this._arguments.push(String(a[i]));
};
_p.getTarget = function () {
    return this._target;
};
_p.setTarget = function (s) {
    this._target = s;
};
_p.setAccessibilityMode = function (b) {
    this._accessibilityMode = b;
};
_p.getAccessibilityMode = function () {
    return this._accessibilityMode;
};
_p.getFocusOnLoad = function () {
    return this._focusOnLoad;
};
_p.setFocusOnLoad = function (b) {
    this._focusOnLoad = b;
};
_p.getSupported = function () {
    var p;
    if (BiBrowserCheck.ie) {
        p = String(BiBrowserCheck.platform).toLowerCase();
        if (p != "win32" && p != "win64") {
            this._errorMessage = BiLauncher.IE_ERROR_PLATFORM;
            return false;
        }
        if (BiBrowserCheck.versionNumber < 5.5) {
            this._errorMessage = BiLauncher.IE_ERROR_VERSION;
            return false;
        }
        return true;
    } else if (BiBrowserCheck.moz) {
        if (BiBrowserCheck.versionNumber < 1.4) {
            this._errorMessage = BiLauncher.GECKO_ERROR_VERSION;
            return false;
        }
        return true;
    }
    return true;
};
_p.getErrorMessage = function () {
    return this._errorMessage;
};
_p.getHasError = function () {
    return this._errorMessage != "";
};
_p.launch = function (sAdfPath, oArgs) {
    var left, right, top, bottom, width, height, centered, resizable, fullScreen;
    var adfPath, adfName, args;
    if (!this.getSupported()) return false;
    if (sAdfPath) this.setAdfPath(sAdfPath);
    if (this.getHasError()) return false;
    var bUseCurrentWindow = !this.getNewWindow();
    var sRootPath = this.getRootPath();
    var sAdfRelPath = this.getAdfPath();
    if (arguments.length > 1) {
        args = [];
        for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
        this.setArguments(args);
    }
    adfName = this.getAdfName();
    args = this.getArguments();
    if (/^((https?|file):|\/)/.test(sAdfRelPath)) {
        adfPath = sAdfRelPath;
    } else {
        var curPath = document.location.href;
        var q = curPath.indexOf('?');
        if (q >= 0) {
            curPath = curPath.substring(0, q);
        }
        var slashIndex = curPath.lastIndexOf("/");
        curPath = curPath.substring(0, slashIndex);
        adfPath = curPath + "/" + sAdfRelPath;
    }
    var uri = sRootPath + "bimain.html?Adf=" + encodeURIComponent(adfPath) + ";AdfName=" + adfName + (this._accessibilityMode ? ";accessibilityMode=true" : "") + ";Params=" + args.length;
    for (i = 0; i < args.length; i++) {
        uri += ";Param" + i + "=" + encodeURIComponent(args[i]);
    }
    var xmlHttp = new BiXmlHttp;
    xmlHttp.open("GET", adfPath, false);
    if (BiBrowserCheck.ie && BiBrowserCheck.version >= 10) {
        try {
            xmlHttp.responseType = 'msxml-document';
        } catch (e) {}
    }
    try {
        xmlHttp.send(null);
    } catch (ex) {

        this._errorMessage = BiLauncher.FILE_NOT_FOUND;
        return false;
    }
    var fs = /^file\:/.test(adfPath);
    if (fs) {
        var s = String(xmlHttp.responseText).replace(/<\?xml[^\?]*\?>/, "");
        xmlHttp.responseXML.loadXML(s);
    } else if (xmlHttp.status != 200) {
        this._errorMessage = xmlHttp.status + ": " + xmlHttp.statusText;
        return false;
    }
    if (xmlHttp.responseXML.parseError && xmlHttp.responseXML.parseError.errorCode != 0) {
        this._errorMessage = xmlHttp.responseXML.parseError.reason;
        return false;
    }
    var n, doc = xmlHttp.responseXML;
    try {
        n = doc.selectSingleNode("/*[name()='Application']/*[name()='Window']");
    } catch (ignored) {
        n = doc.selectSingleNode("/application/window | /Application/Window");
    }
    left = BiLauncher._getAttr(n, "left", "", "x");
    right = BiLauncher._getAttr(n, "right", "", "x");
    top = BiLauncher._getAttr(n, "top", "", "y");
    bottom = BiLauncher._getAttr(n, "bottom", "", "y");
    width = BiLauncher._getAttr(n, "width", "", "x");
    height = BiLauncher._getAttr(n, "height", "", "y");
    centered = BiLauncher._getAttr(n, "centered", "false") == "true";
    resizable = BiLauncher._getAttr(n, "resizable", "true") != "false";
    fullScreen = BiLauncher._getAttr(n, "fullScreen", "false") == "true";
    var sw = screen.width;
    var sh = screen.height;
    if (right != "" && width != "") left = sw - width - right;
    else if (left != "" && right != "") width = sw - left - right;
    if (bottom != "" && height != "") top = sh - height - bottom;
    else if (top != "" && bottom != "") height = sh - top - bottom;
    if (left == "" && right == "" && centered) left = (sw - width) / 2;
    if (top == "" && bottom == "" && centered) top = (sh - height) / 2;
    try {
        n = doc.selectSingleNode("/*[name()='Application']/@focusOnLoad");
    } catch (ignored) {
        n = doc.selectSingleNode("/application/@focusOnLoad | /Application/@focusOnLoad");
    }
    if (n) this._focusOnLoad = n.text != "false";
    if (BiBrowserCheck.webkit) {
        if (!width) width = sw;
        if (!height) height = sh;
    }
    if (!bUseCurrentWindow) {
        var windowName = this.getReuseWindow() ? this._target || adfName : "";
        var w = window.open(uri, windowName, "menubar=0,location=0,status=0,toolbar=0,scrollbars=1" + (left ? ",left=" + left : "") + (top ? ",top=" + top : "") + (width ? ",width=" + (width - 8) : "") + (height ? ",height=" + (height - 32) : "") + (fullScreen ? ",fullscreen=1" : "") + (resizable ? ",resizable=1" : ""), false);
        if (!w) {
            this._errorMessage = BiLauncher.POPUP_BLOCKER_QUESTION;
            return false;
        }
        if (this._focusOnLoad) w.focus();
        this._window = w;
    } else {
        document.location.href = uri;
        if (this._focusOnLoad) window.focus();
        this._window = window;
    }
    return true;
};
BiLauncher._toPixel = function (s, sAxis) {
    if (String(s).indexOf("%") != -1) {
        var n = Number(s.replace(/\%/g, ""));
        return n / 100 * (sAxis == "x" ? screen.availWidth : screen.availHeight);
    }
    return s;
};
BiLauncher._getAttr = function (el, name, def, tp) {
    var res;
    if (!el || !el.getAttribute(name)) res = def;
    else res = el.getAttribute(name); if (tp) return BiLauncher._toPixel(res, tp);
    return res;
};

function biExec(sRootPath, sAdfRelPath, bUseCurrentWindow, sArgs) {
    var args = Array.prototype.slice.call(arguments, 3);
    args.unshift(sAdfRelPath);
    var l = new BiLauncher(sRootPath);
    l.setAdfPath(sAdfRelPath);
    l.setNewWindow(!bUseCurrentWindow);
    var ok = l.launch.apply(l, args);
    if (!ok) alert(l.getErrorMessage());
    return ok;
};