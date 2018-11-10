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
Object.isEmpty = function (o) {
    for (var _ in o) return false;
    return true;
};
Object.getKeys = function (o) {
    var r = [];
    for (var i in o) {
        r.push(i);
    }
    return r;
};
Object.getValues = function (o) {
    var r = [];
    for (var i in o) {
        r.push(o[i]);
    }
    return r;
};
_p = Array.prototype;
if (!_p.indexOf) {
    _p.indexOf = function (obj, fromIndex) {
        var l = this.length;
        if (fromIndex == null) {
            fromIndex = 0;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, l + fromIndex);
        }
        for (var i = fromIndex; i < l; i++) {
            if (this[i] === obj) return i;
        }
        return -1;
    };
}
if (!_p.lastIndexOf) {
    _p.lastIndexOf = function (obj, fromIndex) {
        if (fromIndex == null) {
            fromIndex = this.length - 1;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, this.length + fromIndex);
        }
        for (var i = fromIndex; i >= 0; i--) {
            if (this[i] === obj) return i;
        }
        return -1;
    };
}
_p.contains = function (o) {
    return this.indexOf(o) != -1;
};
_p.copy = function () {
    return this.concat();
};
_p.insertAt = function (o, i) {
    this.splice(i, 0, o);
};
_p.insertBefore = function (o, o2) {
    var i = this.indexOf(o2);
    if (i == -1) this.push(o);
    else this.splice(i, 0, o);
};
_p.removeAt = function (i) {
    this.splice(i, 1);
};
_p.remove = function (o) {
    var i = this.indexOf(o);
    if (i != -1) this.splice(i, 1);
};
if (!_p.forEach) {
    _p.forEach = function (f, obj) {
        var l = this.length;
        for (var i = 0; i < l; i++) {
            f.call(obj, this[i], i, this);
        }
    };
}
if (!_p.filter) {
    _p.filter = function (f, obj) {
        var l = this.length;
        var res = [];
        for (var i = 0; i < l; i++) {
            if (f.call(obj, this[i], i, this)) {
                res.push(this[i]);
            }
        }
        return res;
    };
}
if (!_p.map) {
    _p.map = function (f, obj) {
        var l = this.length;
        var res = [];
        for (var i = 0; i < l; i++) {
            res.push(f.call(obj, this[i], i, this));
        }
        return res;
    };
}
if (!_p.some) {
    _p.some = function (f, obj) {
        var l = this.length;
        for (var i = 0; i < l; i++) {
            if (f.call(obj, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };
}
if (!_p.every) {
    _p.every = function (f, obj) {
        var l = this.length;
        for (var i = 0; i < l; i++) {
            if (!f.call(obj, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
}
BiString = {
    EMPTY: "",
    BOOLEAN_TRUE: "true",
    BOOLEAN_FALSE: "false",
    SET: "set",
    GET: "get",
    EXEC: "call",
    _rExpTrim: /(^\s+)|\s+$/g
};
_p = String.prototype;
_p.trim = function () {
    return this.replace(BiString._rExpTrim, BiString.EMPTY);
};
_p.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.substr(1);
};
_p.startsWith = function (s) {
    return this.substring(0, s.length) == s;
};
_p.endsWith = function (s) {
    return this.substring(this.length - s.length, this.length) == s;
};
BiNumber = {
    INTEGER_INFINITY: 0xEFFFFFFF
};
BiAccessType = {
    NONE: 0,
    READ: 1,
    WRITE: 2,
    READ_WRITE: 3,
    EXEC: 4,
    READ_EXEC: 5,
    WRITE_EXEC: 6,
    READ_WRITE_EXEC: 7,
    FUNCTION_EMPTY: function () {}
};
Function.prototype.addProperty = function (sName, nAccessTypes) {
    var p = this.prototype;
    var accessTypes = nAccessTypes || BiAccessType.READ_WRITE;
    var capitalized = sName.capitalize();
    sName = "_" + sName;
    if (accessTypes & BiAccessType.READ) {
        p["get" + capitalized] = function () {
            return this[sName];
        };
    }
    if (accessTypes & BiAccessType.WRITE) {
        p["set" + capitalized] = function (v) {
            this[sName] = v;
        };
    }
    if (accessTypes & BiAccessType.EXEC) {
        p[BiString.EXEC + capitalized] = function () {
            this[sName]();
        };
    }
};
if (typeof Function.prototype.bind == "undefined") {
    Function.prototype.bind = function () {
        var A = function (a) {
            return Array.prototype.slice.call(a);
        };
        if (arguments.length < 2 && (typeof arguments[0] == 'undefined')) return this;
        var method = this,
            args = A(arguments),
            object = args.shift();
        return function () {
            return method.apply(object, args.concat(A(arguments)));
        };
    };
}

function BiObject() {
    this._objId = BiObject._objCounter++;
}
_p = _biExtend(BiObject, Object, "BiObject");
_p._disposed = false;
_p._id = null;
BiObject.TYPE_FUNCTION = "function";
BiObject.TYPE_OBJECT = "object";
BiObject.TYPE_STRING = "string";
BiObject.STRING_PROPERTY_OBJECT = "PropertyObject";
BiObject._hashCodeCounter = 1;
BiObject._objCounter = 1;
BiObject.toHashCode = function (o) {
    if (o.hasOwnProperty("_hashCode")) return o._hashCode;
    return o._hashCode = "_" + (BiObject._hashCodeCounter++).toString(32);
};
BiObject.addProperty("disposed", BiAccessType.READ);
BiObject.addProperty("id", BiAccessType.READ_WRITE);
BiObject.addProperty("userData", BiAccessType.READ_WRITE);
_p.toHashCode = function () {
    return BiObject.toHashCode(this);
};
_p.dispose = function () {
    this._disposed = true;
    delete this._userData;
    delete this._id;
    this.dispose = BiAccessType.FUNCTION_EMPTY;
};
_p.disposeFields = function (fieldNames) {
    var fields = fieldNames instanceof Array ? fieldNames : arguments;
    var n, o, p;
    for (var i = 0; i < fields.length; i++) {
        n = fields[i];
        if (this.hasOwnProperty(n)) {
            o = this[n];
            if (o != null) {
                if (typeof o.dispose == BiObject.TYPE_FUNCTION) {
                    o.dispose();
                } else if (o.constructor == Array) {
                    for (var j = o.length - 1; j >= 0; j--) {
                        p = o[j];
                        if (p && typeof p.dispose == BiObject.TYPE_FUNCTION) {
                            p.dispose();
                        }
                    }
                }
            }
            delete this[n];
        }
    }
};
_p.toString = function () {
    if (this._className) return "[object " + this._className + "]";
    return "[object Object]";
};
_p.getProperty = function (sPropertyName) {
    var getterName = "get" + sPropertyName.capitalize();
    if (typeof this[getterName] == "function") return this[getterName]();
    throw new Error("No such property, " + sPropertyName);
};
_p.setProperty = function (sPropertyName, oValue) {
    var setterName = "set" + sPropertyName.capitalize();
    if (typeof this[setterName] == "function") this[setterName](oValue);
    else throw new Error("No such property, " + sPropertyName);
};
_p.setProperties = function (oProperties) {
    for (var p in oProperties) {
        this.setProperty(p, oProperties[p]);
    }
};
_p.setAttribute = function (sName, sValue, oParser) {
    var v, vv;
    if (sValue == BiString.BOOLEAN_TRUE) v = true;
    else if (sValue == BiString.BOOLEAN_FALSE) v = false;
    else if ((vv = parseFloat(sValue)) == sValue) v = vv;
    else v = sValue;
    this.setProperty(sName, v);
};
_p.getAttribute = function (sName) {
    return String(this.getProperty(sName));
};
_p.addXmlNode = function (oNode, oParser) {
    if (oNode.nodeType == 1) {
        var o = oParser.fromNode(oNode, this);
        this.addParsedObject(o);
    }
};
_p.addParsedObject = function (o) {
    if (o instanceof BiProperty) this.addProperty(o);
    else if (o instanceof BiAction && (!(o instanceof BiEventListener))) this.addAction(o);
};
_p.addProperty = function (oProperty) {
    var p = (oProperty instanceof BiProperty) ? oProperty : new BiProperty(oProperty, arguments[1], arguments[2]);
    var name = p.getName();
    var accessTypes = p._getAccessTypes();
    var capitalized = name.capitalize();
    name = "_" + name;
    p._parent = this;
    this[BiString.GET + capitalized + BiObject.STRING_PROPERTY_OBJECT] = function () {
        return p;
    };
    if (accessTypes & BiAccessType.READ) {
        this[BiString.GET + capitalized] = function () {
            return p.getValue();
        };
        this._addProperty(p);
    }
    if (accessTypes & BiAccessType.WRITE) {
        this[BiString.SET + capitalized] = function (v) {
            p.setValue(v);
        };
        this._addProperty(p);
    }
    if (accessTypes & BiAccessType.EXEC) {
        this[BiString.EXEC + capitalized] = function () {
            return p.exec();
        };
        this.addAction(p);
    }
};
_p._addProperty = function (oProperty) {
    if (!this._dataColumns) {
        this._dataColumns = {};
    }
    this._dataColumns[oProperty._name] = oProperty;
};
BiObject.addProperty("dataColumns", BiAccessType.READ);
BiObject.addProperty("actions", BiAccessType.READ);
_p.addAction = function (oAction) {
    var a = (arguments[0] instanceof BiAction) ? arguments[0] : new BiAction(arguments[0]);
    if (!this._actions) {
        this._actions = {};
    }
    if (a._name) {
        this._actions[a._name || BiObject.toHashCode(a)] = a;
        this[BiString.EXEC + a._name.capitalize()] = function () {
            return a.exec();
        };
    }
};
_p.callAction = function (sName, oEvent) {
    this._actions[sName].exec(oEvent, this);
};
_p.getEvents = function () {
    throw new Error("Event dispatching not implemented in " + this);
};
_p.getObjectByName = function (sName) {
    if (this[sName] && this[sName] instanceof BiObject) {
        return this[sName];
    } else {
        var getterName = BiString.GET + sName.capitalize();
        if (this[getterName]) {
            return this[getterName]();
        } else {
            var scope = this._nameRoot;
            if (scope[sName] && scope[sName] instanceof BiObject) {
                return scope[sName];
            } else if (scope[getterName]) {
                return scope[getterName]();
            }
        }
    }
};
_p._nameRoot = null;
BiObject.addProperty("nameRoot", BiAccessType.READ_WRITE);
_p.setNameRoot = function (o) {
    this._nameRoot = o;
    if (this._name) {
        this._setNameOnNameRoot(this._name);
    }
};
BiObject.addProperty("isNameRoot", BiAccessType.READ);
_p.setIsNameRoot = function (b) {
    this._isNameRoot = b;
    if (b) {
        this._nameRoot = this;
    }
};
BiObject.addProperty("name", BiAccessType.READ_WRITE);
_p.setName = function (sName) {
    this._name = sName;
    this._setNameOnNameRoot(sName);
};
_p._setNameOnNameRoot = function (sName) {
    var nameRoot = this._nameRoot;
    if (this._isNameRoot) {
        if (this === nameRoot) {
            if (this._parent && this._parent._nameRoot) {
                this._parent._setNameOnNameRoot(sName);
            } else {
                return;
            }
        }
    }
    if (nameRoot && nameRoot instanceof BiObject) {
        if (nameRoot[sName] || nameRoot[BiString.GET + sName.capitalize()]) {
            throw new Error("name " + this._name + " already exists in name scope!");
        } else {
            nameRoot[sName] = this;
        }
    }
};
BiObject._createDelegate = function (oPrototype, sField, sName, nReadWrite) {
    nReadWrite = nReadWrite || BiAccessType.READ_WRITE;
    var sCapitalized = sName.capitalize();
    if (nReadWrite & BiAccessType.READ) {
        oPrototype["get" + sCapitalized] = function () {
            return this[sField]["get" + sCapitalized].apply(this[sField], arguments);
        };
    }
    if (nReadWrite & BiAccessType.WRITE) {
        oPrototype["set" + sCapitalized] = function () {
            return this[sField]["set" + sCapitalized].apply(this[sField], arguments);
        };
    }
    if (nReadWrite & BiAccessType.EXEC) {
        oPrototype[sName] = function () {
            return this[sField][sName].apply(this[sField], arguments);
        };
    }
};
BiObject._createDelegates = function (oPrototype, sField, aProperties) {
    var l = aProperties.length;
    for (var i = 0; i < l; i++) {
        BiObject._createDelegate(oPrototype, sField, aProperties[i][0], aProperties[i][1] || BiAccessType.READ_WRITE);
    }
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

function BiUri(sBase, sRel) {
    if (_biInPrototype) return;
    this._params = {};
    if (sBase) {
        this.setHref(sBase);
        if (sRel) this._setRelative(sRel);
    }
}
_p = _biExtend(BiUri, BiObject, "BiUri");
_p._scheme = "";
_p._userInfo = "";
_p._port = "";
_p._host = "";
_p._path = "";
_p._dirPath = "";
_p._fragment = "";
_p._query = "";
_p._hrefCache = null;
_p._generic = true;
BiUri.addProperty("scheme", BiAccessType.READ);
BiUri.addProperty("path", BiAccessType.READ);
BiUri.addProperty("dirPath", BiAccessType.READ);
BiUri.addProperty("host", BiAccessType.READ);
BiUri.addProperty("port", BiAccessType.READ);
BiUri.addProperty("fragment", BiAccessType.READ);
BiUri.addProperty("userInfo", BiAccessType.READ);
BiUri.regExps = {
    scheme: /^([^:]+)\:.+$/,
    user: /^([^@\/]+)@.+$/,
    host: /^([^:\/\?\#]+).*$/,
    port: /^:(\d+)/,
    path: /^([^\?#]*)/,
    dirPath: /^(.*\/)[^\/]*$/,
    fragment: /^[^#]*#(.*)$/,
    absUri: /^\w(\w|\d|\+|\-|\.)*:/i
};
_p.toString = function () {
    return this.getHref();
};
_p.setHref = function (s) {
    this._hrefCache = null;
    s = String(s);
    this._scheme = "";
    this._userInfo = "";
    this._host = "";
    this._port = null;
    this._path = "";
    this._dirPath = "";
    this._query = "";
    this._fragment = "";
    this._params = {};
    var err = new Error("Not a well formatted URI " + s);
    var ok = BiUri.regExps.scheme.test(s);
    if (!ok) throw err;
    this._scheme = RegExp.$1;
    this._generic = s.substr(this._scheme.length, 3) == "://";
    if (this._generic) s = s.substring(this._scheme.length + 3);
    else s = s.substring(this._scheme.length + 1); if (this._generic || this._scheme == "mailto" || this._scheme == "news") {
        ok = BiUri.regExps.user.test(s);
        if (ok) {
            this._userInfo = RegExp.$1;
            s = s.substring(this._userInfo.length + 1);
        }
        if ((this._scheme != "file" && this._scheme != "x-gadget") || s.charAt(0) != "/") {
            ok = BiUri.regExps.host.test(s);
            if (!ok) throw err;
            this._host = RegExp.$1;
            s = s.substring(this._host.length);
        }
        ok = BiUri.regExps.port.test(s);
        if (ok) {
            this._port = Number(RegExp.$1);
            s = s.substring(RegExp.$1.length + 1);
        }
    }
    this._parsePathAndRest(s);
};
_p._parsePathAndRest = function (s) {
    var err = new Error("Not a well formatted URI " + s);
    var i;
    var ok = BiUri.regExps.path.test(s);
    if (!ok) throw err;
    this._path = RegExp.$1;
    s = s.substring(this._path.length);
    if (this._path == "" && (this._scheme == "file" || this._scheme == "http" || this._scheme == "https" || this._scheme == "ftp")) {
        this._path = "/";
    }
    var segments = this._path.split("/");
    var sb = [];
    var j = 0;
    for (i = 0; i < segments.length; i++) {
        if (segments[i] == ".") continue;
        if (segments[i] == "..") {
            j--;
            delete sb[j];
            sb.length = j;
            continue;
        }
        sb[j++] = segments[i];
    }
    this._path = sb.join("/");
    if (this._path.length > 0) {
        ok = BiUri.regExps.dirPath.test(this._path);
        if (!ok) throw err;
        this._dirPath = RegExp.$1;
    }
    ok = BiUri.regExps.fragment.test(s);
    if (ok) {
        this._fragment = RegExp.$1;
        s = s.substring(0, s.length - this._fragment.length - 1);
        this._fragment = "#" + this._fragment.replace("#", "%23");
    }
    this._query = s;
    s = s.substring(1);
    if (this._query != "") {
        var pairs = s.split(/\;|\&/);
        var parts, name, value;
        for (i = 0; i < pairs.length; i++) {
            parts = pairs[i].split("=");
            try {
                name = decodeURIComponent(parts[0]);
            } catch (e) {
                name = parts[0];
            }
            if (parts.length == 2) {
                try {
                    value = decodeURIComponent(parts[1]);
                } catch (e) {
                    value = parts[1];
                }
            } else value = null; if (name in this._params) this._params[name].push(value);
            else this._params[name] = [value];
        }
    }
};
_p._setRelative = function (s) {
    this._hrefCache = null;
    s = String(s);
    var isAbsolute = BiUri.regExps.absUri.test(s);
    if (isAbsolute) {
        this.setHref(s);
        return;
    }
    var dirPath = this._dirPath;
    this._path = "";
    this._dirPath = "";
    this._query = "";
    this._fragment = "";
    this._params = {};
    if (s.charAt(0) == "/") {
        this._parsePathAndRest(s);
    } else this._parsePathAndRest(dirPath + s);
};
_p.getHref = function () {
    if (this._hrefCache != null) return this._hrefCache;
    var s = this._scheme + (this._generic ? "://" : ":") + this._userInfo + (this._userInfo == "" ? "" : "@") + this._host + (this._port != null ? ":" + this._port : "") + this._path;
    return this._hrefCache = s + this.getQuery() + this._fragment;
};
_p.getParam = function (sName) {
    if (sName in this._params) return this._params[sName][this._params[sName].length - 1];
    return undefined;
};
_p.setParam = function (sName, sValue) {
    this._hrefCache = null;
    return this._params[sName] = [String(sValue)];
};
_p.removeParam = function (sName) {
    this._hrefCache = null;
    delete this._params[sName];
};
_p.hasParam = function (sName) {
    return sName in this._params;
};
_p.getParams = function (sName) {
    if (sName in this._params) return this._params[sName].concat();
    return [];
};
_p.addParam = function (sName, sValue) {
    this._hrefCache = null;
    var v = sValue == null ? null : String(sValue);
    if (sName in this._params) this._params[sName].push(v);
    else this._params[sName] = [v];
};
_p.getQuery = function () {
    var sb = [];
    var sb2, sb3, v;
    for (var name in this._params) {
        sb2 = [];
        for (var i = 0; i < this._params[name].length; i++) {
            sb3 = [];
            v = this._params[name][i];
            if (v == null) sb2.push(encodeURIComponent(name));
            else {
                sb3.push(encodeURIComponent(name), "=", encodeURIComponent(v));
                sb2.push(sb3.join(""));
            }
        }
        sb.push(sb2.join("&"));
    }
    return (sb.length > 0 ? "?" + sb.join("&") : "");
};

function BiEvent(sType) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._type = sType;
}
_p = _biExtend(BiEvent, BiObject, "BiEvent");
_p._bubbles = false;
_p._propagationStopped = true;
_p._defaultPrevented = false;
BiEvent.addProperty("type", BiAccessType.READ_WRITE);
BiEvent.addProperty("target", BiAccessType.READ);
BiEvent.addProperty("currentTarget", BiAccessType.READ);
BiEvent.addProperty("bubbles", BiAccessType.READ);
_p.stopPropagation = function () {
    this._propagationStopped = true;
};
BiEvent.addProperty("propagationStopped", BiAccessType.READ);
_p.preventDefault = function () {
    this._defaultPrevented = true;
};
BiEvent.addProperty("defaultPrevented", BiAccessType.READ);
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    delete this._target;
    delete this._currentTarget;
    delete this._bubbles;
    delete this._propagationStopped;
    delete this._defaultPrevented;
};
_p.getDefaultPrevented = function () {
    return this._defaultPrevented;
};
BiEvent._addDOMEventListener = function (target, type, listener, useCapture) {
    if (!target) return;
    if (target.addEventListener) target.addEventListener(type, listener, useCapture);
    else if (target.attachEvent) target.attachEvent("on" + type, listener);
    else throw new Error("cannot register event listener");
};
BiEvent._removeDOMEventListener = function (target, type, listener, useCapture) {
    if (!target) return;
    if (target.removeEventListener) target.removeEventListener(type, listener, useCapture);
    else if (target.detachEvent) target.detachEvent("on" + type, listener);
    else throw new Error("cannot unregister event listener");
};

function BiMouseEvent() {}

function BiKeyboardEvent() {}

function BiEventTarget() {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._listeners = {};
    this._listenersCount = 0;
}
_p = _biExtend(BiEventTarget, BiObject, "BiEventTarget");
_p.addEventListener = function (oListener) {
    var f, type;
    var argv = arguments;
    if (argv[1]) {
        type = argv[0];
        f = {
            _handler: argv[1],
            _scope: argv[2] || this
        };
    } else {
        f = oListener;
        type = f._type;
        if (!f._scope) f._scope = this;
        if (!f._handler) {
            if (f._handlerStatements) {
                f.setHandler(BiAction.createHandlerFunction(f.getHandlerStatements()));
            }
        }
    }
    var ls = this._listeners[type] || (this._listeners[type] = []);
    this._listenersCount++;
    ls.push(f);
};
_p.removeEventListener = function (sType, fHandler, oObject) {
    var l = this._listeners;
    if (this._disposed || !(sType in l)) return;
    var t = l[sType];
    var inDispatch = t._dispatching;
    var scope = oObject || this;
    var tl = t.length;
    var n = 0;
    var o;
    while (n < tl) {
        o = t[n];
        if (!o) {
            if (inDispatch) {
                n++;
            } else {
                t.splice(n, 1);
                tl--;
                this._listenersCount--;
            }
        } else if (fHandler === o._handler && scope === o._scope) {
            if (inDispatch) {
                t[n] = null;
                n++;
            } else {
                t.splice(n, 1);
                tl--;
                this._listenersCount--;
            }
        } else {
            n++;
        }
    };
    if (t.length == 0) delete l[sType];
};
_p.dispatchEvent = function (e) {
    if (this._disposed) return false;
    if (typeof e == BiObject.TYPE_STRING) {
        e = new BiEvent(e);
    }
    e._target = this;
    this._dispatchEvent(e);
    delete e._target;
    return !e._defaultPrevented;
};
_p._dispatchEvent = function (e) {
    e._currentTarget = this;
    if (this._listenersCount > 0 && (!(e instanceof BiMouseEvent) && !(e instanceof BiKeyboardEvent) || this.getIsEnabled())) {
        var type = e.getType();
        var fs = this._listeners[type];
        if (fs) {
            fs._dispatching = true;
            var l = fs.length;
            var newL = 0;
            for (var i = 0; i < l; i++) {
                var ho = fs[i];
                if (ho) {
                    if (ho.exec) ho.exec(e, ho._scope);
                    else ho._handler.call(ho._scope, e);
                    fs[newL++] = fs[i];
                }
            }
            l = fs.length;
            for (; i < l; i++) fs[newL++] = fs[i];
            fs.length = newL;
            fs._dispatching = false;
        }
    }
    if (e._bubbles && !e._propagationStopped && this._parent && !this._parent._disposed) {
        this._parent._dispatchEvent(e);
    }
    delete e._currentTarget;
};
_p.setAttribute = function (sName, sValue, oParser) {
    if (sName.substring(0, 2) == "on") {
        var type = sName.substring(2);
        this.addEventListener(type, BiAction.createHandlerFunction(sValue), oParser);
    } else BiObject.prototype.setAttribute.call(this, sName, sValue, oParser);
};
_p.addParsedObject = function (o) {
    if (o instanceof BiEventListener) {
        var oThis = this;
        if (o.getTarget()) {
            oThis = o.getTarget();
            if (!o.getScope()) {
                o.setScope(this);
            }
        }
        oThis.addEventListener(o);
    } else BiObject.prototype.addParsedObject.call(this, o);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    for (var t in this._listeners) {
        delete this._listeners[t];
    }
    delete this._listeners;
    delete this._listenersCount;
};
_p.hasListeners = function (sType) {
    return this._listenersCount > 0 && (sType == null || sType in this._listeners);
};
BiEventTarget.addProperty("events", BiAccessType.READ);
_p.hasEventType = function (sType) {
    return Boolean(this._events && this._events[sType]);
};

function BiCustomClass() {
    if (_biInPrototype) return;
    BiObject.call(this);
}
_p = _biExtend(BiCustomClass, BiObject, "BiCustomClass");
BiClass = BiCustomClass;
_p._node = null;
BiCustomClass.addProperty("name", BiAccessType.READ_WRITE);
BiCustomClass.addProperty("uri", BiAccessType.READ_WRITE);
BiCustomClass.addProperty("preCompile", BiAccessType.READ_WRITE);
_p.setPreCompile = _p.getPreCompile = function () {
    throw new Error("Not implemented");
};
_p.load = function () {
    if (this._uri) {
        var o = this._class = BiXmlResourceParser.getClassFromUri(this._uri);
        if (o.prototype instanceof BiCustomClass) this._class = new o()._class;
        if (this._name) window[this._name] = this._class;
    }
};
_p.loadResources = function (oNode, oParser) {
    var slq = new BiScriptLoaderQueue();
    slq.setAsync(false);

    function SLQ() {
        return slq;
    }
    var rl = new BiResourceLoader(SLQ);
    rl.addResourcesFromNode(oNode);
    rl.load();
    application.addEventListener("dispose", rl.dispose, rl);
    slq.dispose();
    SLQ = slq = null;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this.disposeFields("_class");
};
_p.addXmlNode = function (oNode, oParser) {
    if (oNode.tagName == "Resources") return;
    if (oNode.nodeType == 1) {
        if (this._class) throw new Error("Class node has already been processed!");
        this._class = BiXmlResourceParser.getClassFromNode(oNode);
        if (this._name) window[this._name] = this._class;
    }
};

function BiAbstractActionThread(oAction) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._action = oAction;
    this._runonce = {
        arguments: true,
        children: true,
        handler: true
    };
};
_p = _biExtend(BiAbstractActionThread, BiEventTarget, "BiAbstractActionThread");
_p._async = false;
_p._events = {
    exec: true,
    completed: true
};
BiAbstractActionThread.addProperty("async", BiAccessType.READ);
BiAbstractActionThread.addProperty("scope", BiAccessType.READ);
BiAbstractActionThread.addProperty("action", BiAccessType.READ);
BiAbstractActionThread.addProperty("caller", BiAccessType.READ);
BiAbstractActionThread.addProperty("threadPrepared", BiAccessType.READ);
BiAbstractActionThread.addProperty("completed", BiAccessType.READ_WRITE);
BiAbstractActionThread.addProperty("arguments", BiAccessType.READ);
BiAbstractActionThread.addProperty("children", BiAccessType.READ);
BiAbstractActionThread.addProperty("returns", BiAccessType.READ_WRITE);
BiAbstractActionThread.addProperty("eventTarget", BiAccessType.READ);
BiAbstractActionThread.addProperty("eventType", BiAccessType.READ);
_p.exec = function (oCaller, oEvent) {
    this.dispatchEvent(BiAction.STRING_EXEC);
    if (!this._threadPrepared) {
        throw new Error(this._className + " was called without preparing its dependencies!");
    }
    if (oCaller) {
        this._caller = oCaller;
        this._event = oEvent || this._caller._event;
        this._eventTarget = (oEvent) ? oEvent._target : this._caller._eventTarget;
        this._eventType = (oEvent) ? oEvent._type : this._caller._eventType;
    }
    if (this._runonce.arguments && this._arguments) {
        this._runonce.arguments = false;
        this.processArguments();
    }
    if (this._arguments && !this._arguments._completed) {
        return;
    }
    if (this._runonce.children && this._children) {
        this._runonce.children = false;
        this.processChildren();
    }
    if (this._children && !this._children._completed) {
        return;
    }
    if (this._runonce.handler && this._handlers) {
        this._runonce.handler = false;
        this.processHandler();
    }
    if (this._handlers && !this._handlers._completed) {
        return;
    }
    this.setCompleted(true);
    this.processReturns();
    if (this._async) {
        var e = new BiEvent(BiAction.STRING_COMPLETED);
        e.setUserData(this.getReturns());
        this.dispatchEvent(e);
        this._action.dispatchEvent(e);

    } else {
        return this.getReturns();
    }
};
_p.prepare = function (oScope, nType) {
    this._threadPrepared = true;
};
_p.processArguments = function () {
    throw new Error("Not Implemented");
};
_p.processChildren = function () {
    throw new Error("Not Implemented");
};
_p.processHandler = function () {
    throw new Error("Not Implemented");
};
_p.processReturns = function () {
    var returns = 'Not Implemented';
    this.setReturns(returns);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiEventTarget.prototype.dispose.call(this);
    delete this._runonce;
    delete this._arguments;
    delete this._action;
    delete this._scope;
    delete this._caller;
    delete this._children;
};

function BiActionThread(oAction) {
    if (_biInPrototype) return;
    BiAbstractActionThread.call(this);
    this._action = oAction;
    this._runonce = {
        arguments: true,
        children: true,
        handler: true
    };
    this._debugCounter = 0;
}
_p = _biExtend(BiActionThread, BiAbstractActionThread, "BiActionThread");
BiActionThread.MODEL_ASYNC = 0;
BiActionThread.MODEL_FLOW = 1;
_p.exec = function (oCaller, oEvent) {
    this.dispatchEvent(BiAction.STRING_EXEC);
    if (!this._threadPrepared) {
        throw new Error(this._className + " was called without preparing its dependencies!");
    }
    if (oCaller) {
        this._caller = oCaller;
        this._event = oEvent || this._caller._event;
        this._eventTarget = (oEvent) ? oEvent._target : this._caller._eventTarget;
        this._eventType = (oEvent) ? oEvent._type : this._caller._eventType;
    }
    if (this._runonce.arguments && this._arguments) {
        this._runonce.arguments = false;
        this.processArguments();
    }
    if (this._arguments && !this._arguments._completed) {
        return;
    }
    if (this._runonce.children && this._children) {
        this._runonce.children = false;
        this.processChildren();
    }
    if (this._children && !this._children._completed) {
        return;
    }
    if (this._runonce.handler && this._handlers) {
        this._runonce.handler = false;
        this.processHandler();
    }
    if (this._handlers && !this._handlers._completed) {
        return;
    }
    if (this._completed) {
        return;
    }
    this.setCompleted(true);
    this.processReturns();
    if (this._async) {
        var e = new BiEvent(BiAction.STRING_COMPLETED);
        e.setUserData(this.getReturns());
        this.dispatchEvent(e);
        this._action.dispatchEvent(e);
    } else {
        return this.getReturns();
    }
};
_p.prepare = function (oScope, nType) {
    this._prepareProperties(oScope, nType);
    this._prepareArguments(oScope, nType);
    this._prepareChildren(oScope, nType);
    this._prepareHandler(oScope, nType);
    this._threadPrepared = true;
};
_p.processArguments = function () {
    var handler = BiActionThread._onArgumentsCompleted;
    this._setDependencyValues(this._arguments, handler);
};
_p.processChildren = function () {
    var handler = BiActionThread._onChildrenCompleted;
    this._setDependencyValues(this._children, handler);
};
_p.processHandler = function () {
    var handler = BiActionThread._onHandlersCompleted;
    this._setDependencyValues(this._handlers, handler);
};
_p.processReturns = function () {
    var arg = this._arguments;
    var hnd = this._handlers;
    this.setReturns((hnd && hnd._values && hnd._values.length > 0) ? hnd._values[0] : (arg && arg._values));
};
_p._prepareProperties = function (oScope, nType) {
    var action = this._action;
    var actionscope = BiReference.getReference(action._scope, action._parent, action._parent);
    this._scope = actionscope || oScope;
    this._async = action._async;
    var src, parts;
    if (this._action instanceof BiReference && !action._name) {
        parts = action._src.match(/^(.*\.)*([^\.]+)$/);
        src = parts[1];
        this._name = parts[2];
    } else {
        this._name = action._name;
        src = action._src;
    };
    this._src = BiReference.getReference(src, this._scope, this._scope);
    this._runEnv = actionscope || (action._src && this._src) || oScope;
};
_p._prepareArguments = function (oScope, nType) {
    var owner = this._action;
    var type;
    var ownerArgs = owner._arguments;
    if (ownerArgs) {
        var oal = ownerArgs.length;
        if (oal > 0) {
            var arg = this._arguments = new BiActionThread._DependencyObj;
            for (var i = 0; i < oal; i++) {
                if (ownerArgs[i].createThread) {
                    if (ownerArgs[i]._type & BiReference.TYPE_PROPERTY) {
                        type = BiReference.TYPE_PROPERTY_GET;
                    } else {
                        type = null;
                    }
                    var a = ownerArgs[i].createThread(oScope, type);
                    arg.addAction(a);
                } else {
                    arg.addAction(ownerArgs[i]);
                }
            }
        }
    }
};
_p._prepareChildren = function (oScope, nType) {
    var owner = this._action;
    var ownerChildren = owner._children;
    if (ownerChildren) {
        var ocl = ownerChildren.length;
        if (ocl > 0) {
            var child = this._children = new BiActionThread._DependencyObj;
            for (var i = 0; i < ocl; i++) {
                if (ownerChildren[i].createThread) {
                    var c = ownerChildren[i].createThread(this._scope);
                    child.addAction(c);
                } else {
                    child.addAction(ownerChildren[i]);
                }
            }
        }
    }
};
_p._prepareHandler = function (oScope, nType) {
    var owner = this._action;
    var handler = owner.getHandler && owner.getHandler();
    if (owner instanceof BiAction) {
        if (!handler) {
            if (owner._handlerStatements) {
                owner.setHandler(BiAction.createHandlerFunction(owner.getHandlerStatements()));
                handler = owner.getHandler();
            }
        }
    } else if (owner instanceof BiReference) {
        handler = this._prepareReferenceThread(nType);
    }
    if (handler) {
        if (handler.createThread) {
            handler = handler.createThread(this._scope);
        }
        this._handlers = new BiActionThread._DependencyObj;
        this._handlers.addAction(handler);
    }
};
_p._prepareReferenceThread = function (oType) {
    var action = this._action;
    var name = this._name;
    var type = action._type;
    var src = this._src;
    this._type = (oType || type);
    if (action._type & BiReference.TYPE_PROPERTY) {
        name = ((this._type & BiReference.TYPE_PROPERTY_SET) ? BiString.SET : BiString.GET) + name.capitalize();
    }
    var handler = src[name] || src;
    if (handler instanceof BiAction || handler instanceof BiReference) {
        handler = handler.createThread(this._scope);
        handler._arguments = this._arguments;
    }
    return handler;
};
_p._setDependencyValues = function (oDependsRef, fHandler) {
    var d = oDependsRef;
    var a = d._actions;
    var v = d._values;
    for (var i in a) {
        v[i] = this._setDependencyValue(a[i], fHandler, i);
        if (a[i].exec) {
            if (a[i].getAsync()) {
                if (d._execModel == BiActionThread.MODEL_FLOW) {
                    return;
                }
            } else {
                if (a[i].getCompleted()) {
                    d.delAction(i);
                } else {
                    a[i]._depIndex = i;
                    a[i].addEventListener(BiAction.STRING_COMPLETED, fHandler, this);
                    if (d._execModel == BiActionThread.MODEL_FLOW) {
                        return;
                    }
                }
            }
        } else {
            d.delAction(i);
        }
    }
};
_p._setDependencyValue = function (oAction, fHandler, nIndex) {
    var o = oAction;
    if (o.exec) {
        if (o.getAsync()) {
            o._depIndex = nIndex;
            o.addEventListener(BiAction.STRING_COMPLETED, fHandler, this);
            o._caller = this;
            BiTimer.callOnce(BiActionThread._execAsync, 1, o);
        } else {
            return o.exec(this);
        }
    } else if (typeof o == BiObject.TYPE_FUNCTION) {
        var scope = this._runEnv || this._scope;
        if (this._type & BiReference.TYPE_PROPERTY_SET) {
            return o.call(scope, this._arguments && this._arguments._values[0]);
        } else if (this._type & BiReference.TYPE_PROPERTY_GET) {
            return o.call(scope);
        } else if (this._type & BiReference.TYPE_ACTION) {
            return o.apply(scope, this._arguments && this._arguments._values || []);
        } else {
            return o.apply(scope, [this._event, (this._arguments) ? this._arguments._values : BiString.EMPTY], this);
        }
    } else {
        return o;
    }
};
BiActionThread._execAsync = function () {
    this.exec(this._caller);
};
BiActionThread._onArgumentsCompleted = function (e) {
    var target = e.getTarget();
    var data = e.getUserData();
    var ref = this._arguments;
    BiActionThread._onCompleted.call(this, target, data, ref);
};
BiActionThread._onChildrenCompleted = function (e) {
    var target = e.getTarget();
    var data = e.getUserData();
    var ref = this._children;
    BiActionThread._onCompleted.call(this, target, data, ref);
};
BiActionThread._onHandlersCompleted = function (e) {
    var target = e.getTarget();
    var data = e.getUserData();
    var ref = this._handlers;
    BiActionThread._onCompleted.call(this, target, data, ref);
};
BiActionThread._onCompleted = function (oThread, oData, aDepends) {
    var i = oThread._depIndex;
    aDepends._values[i] = oData;
    aDepends.delAction(i);
    this.exec();
};
BiActionThread._DependencyObj = function () {
    this._actionsCount = 0;
    this._completed = false;
    this._actions = {};
    this._values = [];
};
_p = _biExtend(BiActionThread._DependencyObj, Object, "BiActionThread._DependencyObj");
_p._execModel = BiActionThread.MODEL_ASYNC;
_p.addAction = function (o) {
    var i = this._actionsCount;
    this._actionsCount++;
    this._actions[i] = o;
};
_p.delAction = function (i) {
    delete this._actions[i];
    this._actionsCount--;
    if (this._actionsCount == 0) {
        this._completed = true;
        delete this._actions;
    }
};
_p.getValue = function (i) {
    return this._values[i];
};

function BiEventListenerActionThread(oAction) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._action = oAction;
};
_p = _biExtend(BiEventListenerActionThread, BiEventTarget, "BiEventListenerActionThread");
_p._async = false;
_p._events = {
    exec: true,
    completed: true
};
BiEventListenerActionThread.addProperty("async", BiAccessType.READ);
_p.setAsync = function (b) {
    throw new Error("Async handling not implemented in " + this._className);
};
BiEventListenerActionThread.addProperty("scope", BiAccessType.READ_WRITE);
BiEventListenerActionThread.addProperty("action", BiAccessType.READ_WRITE);
BiEventListenerActionThread.addProperty("caller", BiAccessType.READ);
BiEventListenerActionThread.addProperty("threadPrepared", BiAccessType.READ_WRITE);
BiEventListenerActionThread.addProperty("completed", BiAccessType.READ_WRITE);
_p.exec = function (oCaller, oEvent) {
    this.dispatchEvent(BiAction.STRING_EXEC);
    if (oCaller) {
        this._caller = oCaller;
        this._event = oEvent || this._caller._event;
        this._eventTarget = (oEvent) ? oEvent._target : this._caller._eventTarget;
        this._eventType = (oEvent) ? oEvent._type : this._caller._eventType;
    }
    var scope = this._runEnv || this._scope;
    var results = this._action._handler.call(scope, this._event);
    this.setCompleted(true);
    if (this._async) {
        var e = new BiEvent(BiAction.STRING_COMPLETED);
        e.setUserData(results);
        this.dispatchEvent(e);
        this._action.dispatchEvent(e);
    }
    return results;
};
_p.prepare = function (oScope, nType) {
    BiActionThread.prototype._prepareProperties.call(this, oScope, nType);
    this._prepareHandler(oScope, nType);
    this.setThreadPrepared(true);
};
_p._prepareHandler = function (oScope, nType) {
    this._handler = this._action.getHandler && this._action.getHandler();
};

function BiAction(sName, fHandler) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._children = [];
    this._arguments = [];
    this._handlerStatements = [];
    this._actionThreads = [];
    if (sName) {
        this.setName(sName);
    }
    if (fHandler) {
        this.setHandler(fHandler);
    }
}
_p = _biExtend(BiAction, BiEventTarget, "BiAction");
_p._async = false;
_p._events = {
    exec: true,
    completed: true
};
_p._threadConstructor = BiActionThread;
BiAction.HANDLER_START = "var f = function () {\nif (_c == 1)\nreturn;\n var event = arguments[0];\n var argv = arguments[1];\n var thread = arguments[2];\n";
BiAction.HANDLER_END = "\n};";
BiAction.STRING_EXEC = "exec";
BiAction.STRING_COMPLETED = "completed";
BiAction.addProperty("async", BiAccessType.READ_WRITE);
BiAction.addProperty("children", BiAccessType.READ);
BiAction.addProperty("handler", BiAccessType.READ);
_p.setHandler = function (o) {
    if (o) {
        if (typeof o == BiObject.TYPE_FUNCTION) {
            this._handler = o;
        } else if (typeof o == BiObject.TYPE_STRING) {
            this._handler = BiAction.createHandlerFunction(o);
        }
    } else {
        throw new Error(this + " : " + o + " is not defined");
    }
};
BiAction.addProperty("scope", BiAccessType.READ_WRITE);
_p.getHandlerStatements = function () {
    if (this._handlerStatements.length > 0) {
        return this._handlerStatements.join(BiString.EMPTY);
    } else {}
};
BiAction.addProperty("threadConstructor", BiAccessType.READ_WRITE);
_p.createThread = function (oScope, nType) {
    var t = new(this._threadConstructor)(this);
    if (!t.getThreadPrepared()) {
        t.prepare(oScope, nType);
    }
    return t;
};
_p.exec = function (oEvent, oScope) {
    var scope = oScope || this._parent;
    return (this.createThread(scope)).exec(this, oEvent);
};
BiAction.createHandlerFunction = function (sHandler) {
    var _c = 1;
    eval(BiAction.HANDLER_START + sHandler + BiAction.HANDLER_END);
    _c = 0;
    return f;
};
_p.addChild = function (oChild) {
    this._children.push(oChild);
};
_p.addArgument = function (oArgument) {
    this._arguments.push(oArgument);
};
_p.addHandlerStatement = function (sHandlerStatement) {
    this._handlerStatements.push(sHandlerStatement);
};
_p.setAttribute = function (sName, sValue, oParser) {
    var v, res;
    switch (sName) {
    case "scope":
    case "target":
        if (sValue == "this") {} else if (res = sValue.match(/^\#\{([^\}]+)\}$/)) {
            alert("Here we should implement a handler for object(beans) paths\nvalue: " + res[1]);
        } else if (sValue.charAt(0) == "#") {
            v = oParser.getComponentById(sValue.substr(1));
        } else {
            v = sValue;
        }
        this.setProperty(sName, v);
        break;
    default:
        BiEventTarget.prototype.setAttribute.call(this, sName, sValue, oParser);
    }
};
_p.addParsedObject = function (o) {
    if (o instanceof BiEventListener) {
        (o.getTarget() || this).addEventListener(o);
    } else if (o instanceof BiAction) {
        this.addChild(o);
    } else if (o instanceof BiReference) {
        this.addChild(o);
    }
};
_p.addXmlNode = function (oNode, oXmlResourceParser) {
    if (oNode.nodeType == 1) {
        BiEventTarget.prototype.addXmlNode.call(this, oNode, oXmlResourceParser);
    } else if (oNode.nodeType == 3 || oNode.nodeType == 4) {
        if (!/^\s+$/.test(oNode.nodeValue)) this.addHandlerStatement(oNode.nodeValue);
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiEventTarget.prototype.dispose.call(this);
    delete this._children;
    delete this._arguments;
    delete this._handlerStatements;
    delete this._actionThreads;
    delete this._threadConstructor;
    delete this._scope;
    delete this._target;
    delete this._handler;
};

function BiEventListener(sType, fHandler, oScope) {
    if (_biInPrototype) return;
    BiAction.call(this, null, fHandler);
    this._type = sType;
    this._scope = oScope;
};
_p = _biExtend(BiEventListener, BiAction, "BiEventListener");
BiEventListener.addProperty("type", BiAccessType.READ_WRITE);
_p.setTarget = function (s) {
    this._target = s;
};
_p.getTarget = function () {
    if (this._target) {
        return BiReference.getReference(this._target, this._parent, this._parent);
    } else {
        return false;
    }
};

function BiReference() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._arguments = [];
    this._actionThreads = [];
};
_p = _biExtend(BiReference, BiEventTarget, "BiReference");
_p._async = false;
_p._threadConstructor = BiActionThread;
BiReference.TYPE_OBJECT = BiAccessType.NONE;
BiReference.TYPE_PROPERTY_GET = BiAccessType.READ;
BiReference.TYPE_PROPERTY_SET = BiAccessType.WRITE;
BiReference.TYPE_PROPERTY = BiAccessType.READ_WRITE;
BiReference.TYPE_ACTION = BiAccessType.EXEC;
_p._type = _p._defaultType = BiReference.TYPE_OBJECT;
BiReference.STRING_PROPERTY = "property";
BiReference.STRING_PROPERTY_GET = "get";
BiReference.STRING_PROPERTY_SET = "set";
BiReference.STRING_ACTION = "action";
BiReference.addProperty("async", BiAccessType.READ_WRITE);
BiReference.addProperty("type", BiAccessType.READ);
_p.setType = function (o) {
    this._setType(o);
};
BiReference.addProperty("src", BiAccessType.READ_WRITE);
BiReference.addProperty("name", BiAccessType.READ_WRITE);
BiReference.addProperty("arguments", BiAccessType.READ);
_p.setArguments = function (oArgument) {
    this.addArgument(oArgument);
};
BiReference.addProperty("threadConstructor", BiAccessType.READ_WRITE);
_p.createThread = function (oScope, nType) {
    var t = new(this._threadConstructor)(this);
    if (!t.getThreadPrepared()) {
        t.prepare(oScope, nType);
    }
    return t;
};
BiReference.getReference = function (oRef, oThis, oDefaultReturns) {
    var o = oRef;
    if (o) {
        if (o instanceof BiObject) {
            return o;
        } else if (typeof o == BiObject.TYPE_STRING) {
            var oObj;
            if (o.charAt(0) == BiProperty.STRING_PREFIX_LOCAL) {
                oObj = oThis;
            } else {
                var parts = o.match(/(\w+)((\.|\[)(.*))?/);
                oObj = oThis.getObjectByName(parts && parts[1] || o);
                o = parts && parts[2];
            } if (o) {
                o.replace(/(\.|\[|\]\[|\])(\w+)/g, function () {
                    oObj = oObj.getObjectByName(arguments[2]);
                });
            }
            return oObj;
        } else {
            return oDefaultReturns || null;
        }
    } else {
        return oDefaultReturns || null;
    }
};
_p._setType = function (o) {
    var r = BiReference;
    if (isNaN(o)) {
        switch (o) {
        case r.STRING_PROPERTY_SET:
            this._type = r.TYPE_PROPERTY_SET;
            break;
        case r.STRING_PROPERTY_GET:
            this._type = r.TYPE_PROPERTY_GET;
            break;
        case r.STRING_PROPERTY:
            this._type = r.TYPE_PROPERTY_SET;
            break;
        case BiReference.STRING_ACTION:
            this._type = r.TYPE_ACTION;
            break;
        default:
            this._type = this._defaultType;
        }
    } else {
        this._type = o & r.TYPE_ACTION || o & r.TYPE_PROPERTY_SET || o & r.TYPE_PROPERTY_GET || this._defaultType;
    }
};
_p.addArgument = function (oArgument) {
    this._arguments.push(oArgument);
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
    case "src":
        if (sValue == "this") {} else if (sValue.charAt(0) == "#") {
            sValue = sValue.substr(1);
            var s = oParser.getComponentById(sValue);
            this.setSrc(s);
        } else {
            this.setSrc(sValue);
        }
        break;
    case "arguments":
        var parts = sValue.split(",");
        if (parts.length > 1) {
            for (var i = 0; i < parts.length; i++) {
                BiObject.prototype.setAttribute.call(this, sName, parts[i], oParser);
            }
        } else {
            BiObject.prototype.setAttribute.call(this, sName, sValue, oParser);
        }
        break;
    default:
        BiEventTarget.prototype.setAttribute.call(this, sName, sValue, oParser);
    }
};

function BiTestActionThread(oAction) {
    if (_biInPrototype) return;
    BiActionThread.call(this, oAction);
};
_p = _biExtend(BiTestActionThread, BiActionThread, "BiTestActionThread");
_p.prepare = function (oScope, nType) {
    this._scope = oScope;
    this._prepareArguments(oScope, nType);
    this._children = true;
    this._prepareHandler(oScope, nType);
    this._threadPrepared = true;
};
_p._prepareChildren = function (oScope, nType, bTest) {
    if (!bTest) return;
    var owner = this._action;
    var ownerChild = owner._children;
    if (ownerChild) {
        var ocl = ownerChild.length;
        if (ocl == 1) {
            var child = this._children = new BiActionThread._DependencyObj;
            var oc = ownerChild[0];
            if (oc.createThread) {
                var c = oc.createThread(this._scope);
                child.addAction(c);
            } else {
                child.addAction(oc);
            }
        }
    }
};
_p.processChildren = function () {
    var handler = BiActionThread._onChildrenCompleted;
    this._prepareChildren(this._scope, "action", (this._arguments ? this._arguments._values[0] : false));
    this._setDependencyValues(this._children, handler);
};

function BiTest(sName, fHandler) {
    if (_biInPrototype) return;
    BiAction.call(this, sName, fHandler);
}
_p = _biExtend(BiTest, BiAction, "BiTest");
_p.setExpr = function (oExpr) {
    this._arguments[0] = oExpr;
};
_p._threadConstructor = BiTestActionThread;

function BiOperator() {
    if (_biInPrototype) return;
    this._src = this;
    this._name = BiOperator.STRING_HANDLER;
    BiReference.call(this);
};
_p = _biExtend(BiOperator, BiReference, "BiOperator");
BiOperator.STRING_HANDLER = "_actionHandler";
_p._actionHandler = function (oEvent, aArguments) {
    return aArguments.every(this._callBackFunction, this);
};
_p._callBackFunction = function (oElement, nIndex, oArray) {
    if (nIndex == 0) {
        return true;
    } else {
        return this._operatorFunction(oArray[nIndex - 1], oElement);
    }
};
_p._operatorFunction = function (oLeftValue, oRightValue) {
    return oLeftValue, oRightValue;
};
BiOperator.addProperty("operatorFunction", BiAccessType.READ_WRITE);
_p.addXmlNode = function (oNode, oParser) {
    if (oNode.nodeType == 1) {
        var o = oParser.fromNode(oNode, this);
        this.addArgument(o);
    } else if (oNode.nodeType == 3 || oNode.nodeType == 4) {
        var v = oNode.nodeValue.replace(/^\s+|\s+$/, '');
        if (v.length) {
            var parts = v.split(",");
            if (parts.length > 1) {
                for (var i = 0; i < parts.length; i++) this.addArgument(parts[i]);
            } else this.addArgument(v);
        }
    }
};

function BiEq() {
    if (_biInPrototype) return;
    BiOperator.call(this);
};
_p = _biExtend(BiEq, BiOperator, "BiEq");
_p._operatorFunction = function (oLeftValue, oRightValue) {
    return oLeftValue == oRightValue;
};

function BiNeq() {
    if (_biInPrototype) return;
    BiOperator.call(this);
};
_p = _biExtend(BiNeq, BiOperator, "BiNeq");
_p._operatorFunction = function (oLeftValue, oRightValue) {
    return oLeftValue != oRightValue;
};

function BiLt() {
    if (_biInPrototype) return;
    BiOperator.call(this);
};
_p = _biExtend(BiLt, BiOperator, "BiLt");
_p._operatorFunction = function (oLeftValue, oRightValue) {
    return oLeftValue < oRightValue;
};

function BiGt() {
    if (_biInPrototype) return;
    BiOperator.call(this);
};
_p = _biExtend(BiGt, BiOperator, "BiGt");
_p._operatorFunction = function (oLeftValue, oRightValue) {
    return oLeftValue > oRightValue;
};

function BiLtEq() {
    if (_biInPrototype) return;
    BiOperator.call(this);
};
_p = _biExtend(BiLtEq, BiOperator, "BiLtEq");
_p._operatorFunction = function (oLeftValue, oRightValue) {
    return oLeftValue <= oRightValue;
};

function BiGtEq() {
    if (_biInPrototype) return;
    BiOperator.call(this);
};
_p = _biExtend(BiGtEq, BiOperator, "BiGtEq");
_p._operatorFunction = function (oLeftValue, oRightValue) {
    return oLeftValue >= oRightValue;
};

function BiAnd() {
    if (_biInPrototype) return;
    BiOperator.call(this);
};
_p = _biExtend(BiAnd, BiOperator, "BiAnd");
_p._operatorFunction = function (oLeftValue, oRightValue) {
    return oLeftValue && oRightValue;
};

function BiOr() {
    if (_biInPrototype) return;
    BiOperator.call(this);
};
_p = _biExtend(BiOr, BiOperator, "BiOr");
_p._operatorFunction = function (oLeftValue, oRightValue) {
    return oLeftValue || oRightValue;
};

function BiNand() {
    if (_biInPrototype) return;
    BiOperator.call(this);
};
_p = _biExtend(BiNand, BiOperator, "BiNand");
_p._operatorFunction = function (oLeftValue, oRightValue) {
    return !(oLeftValue && oRightValue);
};

function BiNor() {
    if (_biInPrototype) return;
    BiOperator.call(this);
};
_p = _biExtend(BiNor, BiOperator, "BiNor");
_p._operatorFunction = function (oLeftValue, oRightValue) {
    return !(oLeftValue || oRightValue);
};

function BiNot() {
    if (_biInPrototype) return;
    BiOperator.call(this);
};
_p = _biExtend(BiNot, BiOperator, "BiNot");
_p._operatorFunction = function (oLeftValue, oRightValue) {
    return !oLeftValue;
};

function BiChooseActionThread(oAction) {
    if (_biInPrototype) return;
    BiActionThread.call(this, oAction);
};
_p = _biExtend(BiChooseActionThread, BiActionThread, "BiChooseActionThread");
_p.prepare = function (oScope, nType) {
    this._scope = oScope;
    this._prepareArguments(oScope, nType);
    this._children = true;
    this._prepareHandler(oScope, nType);
    this._threadPrepared = true;
};
_p._prepareChildren = function (oScope, nType) {
    if (this._arguments) {
        var index = -1;
        var i;
        for (i = 0; i < this._arguments._values.length; i++) {
            if (this._arguments._values[i]) {
                index = i;
                break;
            }
        }
        var op = (index == -1 ? this._action._otherwise : this._action._whenList[index]);
        if (op) {
            var owner = op;
            var ownerChild = owner._children;
            if (ownerChild) {
                var ocl = ownerChild.length;
                if (ocl > 0) {
                    var child = this._children = new BiActionThread._DependencyObj;
                    for (i = 0; i < ocl; i++) {
                        if (ownerChild[i].createThread) {
                            var c = ownerChild[i].createThread(this._scope);
                            child.addAction(c);
                        } else {
                            child.addAction(ownerChild[i]);
                        }
                    }
                }
            }
        }
    }
};
_p.processChildren = function () {
    var handler = BiActionThread._onChildrenCompleted;
    this._prepareChildren(this._scope, "action");
    this._setDependencyValues(this._children, handler);
};

function BiChoose(sName, fHandler) {
    if (_biInPrototype) return;
    BiAction.call(this, sName, fHandler);
    this._whenList = [];
    this._otherwise = null;
};
_p = _biExtend(BiChoose, BiAction, "BiChoose");
_p._threadConstructor = BiChooseActionThread;
_p.addParsedObject = function (o) {
    if (o instanceof BiWhen) {
        var expr = o.getExpr();
        this._arguments.push(expr);
        this._whenList.push(o);
    } else if (o instanceof BiOtherwise) {
        this._otherwise = o;
    }
};
_p.addArgument = function (o) {};

function BiOtherwise() {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._children = [];
};
_p = _biExtend(BiOtherwise, BiObject, "BiOtherwise");
_p.addChild = function (oChild) {
    this._children.push(oChild);
};
_p.addParsedObject = function (o) {
    if (o instanceof BiAction || o instanceof BiReference) this.addChild(o);
};

function BiWhen() {
    if (_biInPrototype) return;
    BiOtherwise.call(this);
    this._children = [];
};
_p = _biExtend(BiWhen, BiOtherwise, "BiWhen");
BiWhen.addProperty("expr", BiAccessType.READ_WRITE);

function BiProperty(sName, nAccessTypes, oValue) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._name = sName;
    this._privateName = BiProperty.STRING_PREFIX_PRIVATE + sName;
    if (nAccessTypes) {
        this._setAccessTypes(nAccessTypes);
    }
    this._value = oValue;
};
_p = _biExtend(BiProperty, BiEventTarget, "BiProperty");
_p._read = BiAccessType.READ;
_p._write = BiAccessType.WRITE;
_p._exec = 0;
BiProperty.STRING_PREFIX_PRIVATE = "_";
BiProperty.STRING_PREFIX_LOCAL = ".";
BiProperty.STRING_PREFIX_ID = "#";
BiProperty.STRING_SQUARE_BRACKET = "[";
BiProperty.addProperty("name", BiAccessType.READ);
_p.setName = function (s) {
    this._name = s;
    this._privateName = BiProperty.STRING_PREFIX_PRIVATE + s;
};
BiProperty.addProperty("src", BiAccessType.WRITE);
_p.getSrc = function () {
    if (this._src) {
        return BiReference.getReference(this._src, this._parent, this._parent);
    } else {
        return false;
    }
};
BiProperty.addProperty("srcProperty", BiAccessType.READ_WRITE);
_p.getValue = function () {
    if (this._src) {
        var s = this._srcProperty || this._name;
        return this.getSrc()[BiString.GET + s.capitalize()]();
    } else {
        return this._value;
    }
};
_p.setValue = function (v) {
    this.dispatchEvent("beforechange");
    if (this._src) {
        var s = this._srcProperty || this._name;
        this.getSrc()[BiString.SET + s.capitalize()](v);
    } else {
        this._value = v;
    }
    this.dispatchEvent("change");
};
BiProperty.addProperty("read", BiAccessType.READ);
_p.setRead = function (b) {
    this._read = b ? BiAccessType.READ : 0;
};
BiProperty.addProperty("write", BiAccessType.READ_WRITE);
_p.setWrite = function (b) {
    this._write = b ? BiAccessType.WRITE : 0;
};
BiProperty.addProperty("exec", BiAccessType.READ_WRITE);
_p.setExec = function (b) {
    this._exec = b ? BiAccessType.EXEC : 0;
};
BiProperty.addProperty("getter", BiAccessType.READ_WRITE);
_p.setGetter = _p.getGetter = function () {
    throw new Error("Not implemented");
};
BiProperty.addProperty("setter", BiAccessType.READ_WRITE);
_p.setSetter = _p.getSetter = function () {
    throw new Error("Not implemented");
};
_p.toString = function () {
    return this._value;
};
BiProperty.setName = function (oSource, sName) {
    oSource._propertyName = sName;
};
_p._getAccessTypes = function () {
    return this._read + this._write + this._exec;
};
_p._setAccessTypes = function (nAccessTypes) {
    if (nAccessTypes) {
        this._read = nAccessTypes & BiAccessType.READ;
        this._write = nAccessTypes & BiAccessType.WRITE;
        this._exec = nAccessTypes & BiAccessType.EXEC;
    }
};

function BiLoaderActionThread(oAction) {
    if (_biInPrototype) return;
    BiActionThread.call(this, oAction);
};
_p = _biExtend(BiLoaderActionThread, BiActionThread, "BiLoaderActionThread");
_p.prepare = function (oScope, nType) {
    this._scope = this;
    this._async = this._action._async;
    this._uri = this._action._uri;
    var loaderType = this._getLoaderType();
    this._src = new(loaderType);
    this._runEnv = this._src;
    this._prepareArguments(oScope, nType);
    this._prepareChildren(oScope, nType);
    this._type = (nType || this._action._type);
    if (this._type & BiReference.TYPE_PROPERTY_GET) {
        this._name = "load";
    } else {
        this._name = "post";
    }
    this._handler = this._src;
    this._handlers = new BiActionThread._DependencyObj;
    this._handlers.addAction(this._handler);
    this._threadPrepared = true;
};
_p.processHandler = function () {
    var loader = this._src;
    var almostUnique = (new Date()).getTime() + this._hashCode;
    loader.setAsync(this._async);
    loader.setUri(this._uri + '?' + almostUnique);
    loader._depIndex = 0;
    if (this._async) {
        loader.addEventListener("load", this._onLoad, this);
    };
    this.processHandlerArguments();
    if (this._async) {
        BiTimer.callOnce(function () {
            this._handler[this._name].apply(this._src, this._handlerArguments);
        }, 1, this);
    } else {
        var handler = this._handler;
        var depObj = this._handlers;
        handler[this._name].apply(this._src, this._handlerArguments);
        var data = handler[this._getDataAccessorName()]();
        handler.dispose();
        depObj._values[handler._depIndex] = data;
        depObj.delAction(handler._depIndex);
    };
};
_p.processHandlerArguments = function () {
    var arg = this.getArguments() && this.getArguments()._values;
    if (arg) {
        this._handlerArguments = [encodeURIComponent(arg[0])];
    } else {
        this._handlerArguments = [null];
    }
};
_p._getLoaderType = function () {
    switch (this._action.getDataType()) {
    case "xml":
    case "XML":
        return BiXmlLoader;
    case "json":
    case "JSON":
        return BiJsonLoader;
    case "text":
    case "Text":
    default:
        return BiTextLoader;
    }
};
_p._getDataAccessorName = function () {
    switch (this._action.getDataType()) {
    case "xml":
    case "XML":
        return "getDocument";
    case "json":
    case "JSON":
        return "getData";
    case "text":
    case "Text":
    default:
        return "getText";
    }
};
_p._onLoad = function (e) {
    var target = e.getTarget();
    var data = target[this._getDataAccessorName()]();
    target.dispose();
    this._handlers._values[target._depIndex] = data;
    this._handlers.delAction(target._depIndex);
    this.exec();
};

function BiLoaderAction() {
    if (_biInPrototype) return;
    BiReference.call(this);
};
_p = _biExtend(BiLoaderAction, BiReference, "BiLoaderAction");
_p._async = true;
_p._threadConstructor = BiLoaderActionThread;
BiLoaderAction.addProperty("uri", BiAccessType.READ_WRITE);
BiLoaderAction.addProperty("dataType", BiAccessType.READ_WRITE);
_p.setName = BiAccessType.FUNCTION_EMPTY;
_p.setSrc = BiAccessType.FUNCTION_EMPTY;
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

function BiAbstractLoader() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
}
_p = _biExtend(BiAbstractLoader, BiEventTarget, "BiAbstractLoader");
_p._async = true;
_p._supportsSync = false;
_p._loading = false;
_p._loaded = false;
_p._error = false;
BiAbstractLoader.addProperty("async", BiAccessType.READ_WRITE);
BiAbstractLoader.addProperty("supportsSync", BiAccessType.READ_WRITE);
_p.load = function () {
    throw new Error("load not implemented");
};
_p.abort = function () {
    throw new Error("abort not implemented");
};
_p.getLoaded = function () {
    throw new Error("getLoaded not implemented");
};
_p.getLoading = function () {
    throw new Error("getLoaded not implemented");
};
_p.getError = function () {
    throw new Error("getError not implemented");
};

function BiTextLoader() {
    if (_biInPrototype) return;
    BiAbstractLoader.call(this);
    this._xmlHttp = new BiXmlHttp();
    var oThis = this;
    this.__onreadystatechange = function () {
        oThis._onreadystatechange();
    };
}
_p = _biExtend(BiTextLoader, BiAbstractLoader, "BiTextLoader");
_p._method = "GET";
_p._async = true;
_p._uri = null;
_p._user = "";
_p._password = "";
_p._loadCount = 0;
BiTextLoader.load = function (oUri) {
    var tl = new BiTextLoader;
    tl.setAsync(false);
    tl.load(oUri);
    var s = tl.getText();
    tl.dispose();
    return s;
};
BiTextLoader.addProperty("method", BiAccessType.READ_WRITE);
BiTextLoader.addProperty("uri", BiAccessType.READ);
_p.setUri = function (oUri) {
    if (oUri instanceof BiUri) {
        this._uri = oUri;
    } else {
        this._uri = new BiUri(application.getAdfPath(), oUri);
    }
};
BiTextLoader.addProperty("user", BiAccessType.READ_WRITE);
BiTextLoader.addProperty("password", BiAccessType.READ_WRITE);
_p.load = function (oUri) {
    this.open("GET", oUri || this._uri, this._async);
    this.send();
};
_p.post = function (oUri, oXmlDocument) {
    this.open("POST", oUri || this._uri, this._async);
    this.send(oXmlDocument);
};
_p.open = function (sMethod, oUri, bAsync, sUser, sPassword) {
    this._method = sMethod;
    this.setUri(oUri);
    this._async = bAsync != null ? bAsync : true;
    this._user = sUser;
    this._password = sPassword;
    this._xmlHttp.abort();
    this._xmlHttp.onreadystatechange = this.__onreadystatechange;
    this._xmlHttp.open(this._method, String(this._uri), this._async, this._user, this._password);
    if (BiBrowserCheck.ie && BiBrowserCheck.version >= 10) {
        try {
            this._xmlHttp.responseType = 'msxml-document';
        } catch (e) {}
    }
};
_p.send = function (oObject) {
    this._loadCount = 0;
    this._aborted = false;
    if (!BiBrowserCheck.quirks.forbidsAcceptEncoding) this._xmlHttp.setRequestHeader("Accept-Encoding", "gzip, deflate");
    this._xmlHttp.send(oObject);
    if (!this._async && BiBrowserCheck.moz) {
        this._onload();
    }
};
_p.abort = function () {
    this._aborted = true;
    this._xmlHttp.abort();
};
_p.getAborted = function () {
    return this._aborted;
};
_p.getLoaded = function () {
    return this._xmlHttp.readyState == 4 && this._loadCount > 0;
};
_p.getLoading = function () {
    return this._xmlHttp.readyState > 0 && this._xmlHttp.readyState < 4 || this._loadCount == 0 && !this._aborted;
};
_p.getText = function () {
    return String(this._xmlHttp.responseText);
};
_p.getXmlHttp = function () {
    return this._xmlHttp;
};
_p.getError = function () {
    if (!this.getLoaded()) return false;
    var s = this.getUri().getScheme();
    if (s == "http" || s == "https") {
        return this._xmlHttp.status != 200;
    } else if (BiBrowserCheck.quirks.bogusNonHttpRequestStatus) return 0;
    else return this._xmlHttp.status != 0;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiAbstractLoader.prototype.dispose.call(this);
    delete this.__onreadystatechange;
    delete this._xmlHttp.onreadystatechange;
    delete this._xmlHttp;
    this.disposeFields("_uri");
};
_p._onreadystatechange = function () {
    if (this._xmlHttp && this._xmlHttp.readyState == 4) {
        if (this._async) BiTimer.callOnce(this._onload, 0, this);
        else this._onload();
    }
};
_p._onload = function () {
    if (this._loadCount == 0) {
        this._loadCount++;
        if (!this._aborted) this.dispatchEvent("load");
    }
};

function BiXmlLoader() {
    if (_biInPrototype) return;
    BiTextLoader.call(this);
}
_p = _biExtend(BiXmlLoader, BiTextLoader, "BiXmlLoader");
BiXmlLoader.load = function (oUri) {
    var xl = new BiXmlLoader();
    xl.setAsync(false);
    xl.load(oUri);
    var doc = xl.getDocument();
    xl.dispose();
    return doc;
};
_p.getDocument = function () {
    var doc = this.getXmlHttp().responseXML;
    return this._isError(doc) ? null : doc;
};
_p.getError = function () {
    if (!this.getLoaded()) return false;
    return BiTextLoader.prototype.getError.call(this) || this._isError(this.getDocument());
};
_p._isError = function (oDoc) {
    return !oDoc || !oDoc.documentElement || oDoc.documentElement.nodeName === "parsererror" || (oDoc.parseError && oDoc.parseError.errorCode != 0);
};
_p._onload = function () {
    if (BiBrowserCheck.ie && this.getUri().getScheme() == "file" && !BiTextLoader.prototype.getError.call(this)) {
        var s = this.getText();
        s = s.replace(/<\?xml[^\?]*\?>/, "");
        var d = this.getXmlHttp().responseXML;
        d.loadXML(s);
    }
    if (BiBrowserCheck.moz && !this._aborted && this.getXmlHttp().responseXML) this.getXmlHttp().responseXML.normalize();
    BiTextLoader.prototype._onload.call(this);
};

function BiL10nLoader(sLanguage, sDefaultLanguage, oUri, sPrefix) {
    if (_biInPrototype) return;
    BiXmlLoader.call(this);
    this._async = true;
    this._language = application.getStringBundle().getLanguage();
    this._defaultLanguage = sDefaultLanguage || "en";
    this._prefix = sPrefix || application._uriParams.getParam("AdfName");
    this._uri = oUri;
    this.addEventListener("load", this._interpret);
}
_p = _biExtend(BiL10nLoader, BiXmlLoader, "BiL10nLoader");
_p._disposed = false;
_p.__loaded = false;
BiL10nLoader.addProperty("language", BiAccessType.READ_WRITE);
BiL10nLoader.addProperty("defaultLanguage", BiAccessType.READ_WRITE);
BiL10nLoader.addProperty("prefix", BiAccessType.READ_WRITE);
_p._load = function (sLanguage) {
    var lang;
    var stop = false;
    while (!stop) {
        if (!lang) lang = sLanguage;
        else if (lang.length > 2) lang = lang.substring(0, 2);
        else {
            lang = this._defaultLanguage;
            stop = true;
        }
        var name = this._prefix + "_" + lang + ".xml";
        var uri;
        if (!this._uri) uri = new BiUri(application.getAdfPath(), name);
        else uri = new BiUri(this._uri, name);
        try {
            BiXmlLoader.prototype.load.call(this, uri);
            stop = true;
            this._language = lang;
        } catch (err) {
            if (stop) this.__loaded = true;
        }
    }
};
_p.load = function (sLanguage) {
    this._load(sLanguage || this._language);
};
_p.getLoaded = function () {
    return this.__loaded;
};
_p._readL10nDoc = function (oDocument) {
    BiXmlDocument.setNamespaces(oDocument, {
        l10n: "http://www.bindows.net/xmlns/l10n"
    });
    var L10N_TAG = "l10n:L10n",
        TEMPLATE_TAG = "l10n:Template";
    if (BiBrowserCheck.quirks.obsoleteMsxml) {
        L10N_TAG = "L10n";
        TEMPLATE_TAG = "Template";
    }
    var nl = oDocument.selectNodes(L10N_TAG);
    if (nl) {
        for (var i = 0; i < nl.length; i++) {
            var n = nl[i];
            var lang = n.getAttribute("language") || this._language;
            if (lang) {
                var templates = application.getStringBundle().getBundle(lang);
                var tl = n.selectNodes(TEMPLATE_TAG);
                if (tl) {
                    for (var j = 0; j < tl.length; j++) {
                        var t = tl[j];
                        templates[t.getAttribute("name")] = t.getAttribute("text");
                    }
                    application.getStringBundle().addBundle(lang, templates);
                }
            }
        }
    }
};
_p._interpret = function () {
    var doc = this.getDocument();
    if (doc && doc.documentElement) {
        this._readL10nDoc(doc);
        this.__loaded = true;
    }
};

function BiScriptLoaderQueue() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._items = [];
    this._uris = {};
}
_p = _biExtend(BiScriptLoaderQueue, BiEventTarget, "BiScriptLoaderQueue");
_p._async = true;
BiScriptLoaderQueue.addProperty("async", BiAccessType.READ_WRITE);
_p._notLoaded = 0;
_p._executed = 0;
_p.add = function (oUri) {
    var sUri = String(oUri);
    if (sUri in this._uris) return;
    this._notLoaded++;
    var tl = new BiTextLoader();
    tl.setUri(oUri);
    this._uris[sUri] = true;
    this._items.push({
        src: oUri,
        textLoader: tl
    });
};
_p.addInline = function (sText) {
    this._notLoaded++;
    this._items.push({
        text: sText
    });
};
_p.load = function () {
    if (this._notLoaded) {
        var async = this._async;
        var items = this._items;
        var tl, i, l = items.length;
        for (i = 0; i < l; i++) {
            tl = items[i].textLoader;
            if (tl) {
                tl.setAsync(async);
                tl.load();
            }
        }
        this._startExecuting();
    } else {
        this._onAllLoaded();
    }
};
_p._executeAllOrWait = function () {
    this._executeUntilPending();
};
_p._executeUntilPending = function (nMax) {
    var items = this._items,
        l = items.length;
    var start = this._executed;
    var end = Math.min(nMax ? nMax + start : l, l);
    for (var i = start; i < end; i++) {
        var item = items[i];
        var tl = item.textLoader;
        if (tl && tl.getError()) {
            this.dispatchEvent(this._createErrorEvent("HTTP GET '" + item.src + "' returned status: " + tl.getXmlHttp().status));
        } else if (!tl || tl.getLoaded()) {
            var script = tl ? tl.getText() : item.text;
            try {
                this.execScript(script, item.src);
            } catch (ex) {
                ex.text = item.text;
                ex.textLoader = tl;
                this.dispatchEvent(this._createErrorEvent('<'+item.src + '><' +ex.message+'>'));
            }
            this._notLoaded--;
            this.dispatchEvent("progress");
        } else {
            this._executed = i;
            tl.addEventListener("load", this._executeAllOrWait, this);
            return;
        }
    }
    this._executed = end;
    if (end == l) this._onAllLoaded();
};
_p._startExecuting = function () {
    this._executeAllOrWait();
};
_p.abort = function () {
    for (var i = 0; i < this._items.length; i++) {
        if (this._items[i].textLoader) this._items[i].textLoader.abort();
    }
};
_p.getLoaded = function () {
    return this._notLoaded == 0;
};
_p.getLoadedCount = function () {
    return this._items.length - this._notLoaded;
};
_p.getScriptCount = function () {
    return this._items.length;
};
_p._onAllLoaded = function () {
    this.dispatchEvent("progress");
    this.dispatchEvent("load");
    this._uris = {};
};
_p.dispose = function () {
    if (this._disposed) return;
    BiEventTarget.prototype.dispose.call(this);
    if (this._items) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i].textLoader) this._items[i].textLoader.dispose();
            this._items[i].textLoader = null;
            this._items[i].text = null;
            this._items[i].src = null;
            this._items[i] = null;
        }
        delete this._items;
    }
};
_p.execScript = function (s, url) {
    if (!s) return;
    if (window.execScript) {
        window.execScript(s);
    } else if (BiBrowserCheck.quirks.brokenEvalContext) {
        var e = document.createElement("script");
        e.type = "text/javascript";
        e.appendChild(document.createTextNode(s));
        document.getElementsByTagName("head")[0].appendChild(e);
    } else {
        if (url) {
            s += "//@ sourceURL=" + url;
        }
        window.eval(s);
    }
};
_p._createErrorEvent = function (error) {
    var event = new BiEvent("error");
    event.setUserData(error);
    return event;
};

function BiTimerScriptLoaderQueue() {
    if (_biInPrototype) return;
    BiScriptLoaderQueue.call(this);
    this._timer = new BiTimer(this._groupInterval);
    this._timer.addEventListener("tick", this._executeAllOrWait, this);
}
_p = _biExtend(BiTimerScriptLoaderQueue, BiScriptLoaderQueue, "BiTimerScriptLoaderQueue");
_p._groupInterval = 8;
_p._groups = 4;
BiTimerScriptLoaderQueue.addProperty("groups", BiAccessType.READ_WRITE);
_p._executeAllOrWait = function () {
    this._executeUntilPending(this._groupSize);
};
_p._onAllLoaded = function () {
    this._timer.stop();
    BiScriptLoaderQueue.prototype._onAllLoaded.call(this);
};
_p._startExecuting = function () {
    var groups = this._groups;
    this._groupSize = groups ? Math.round(this._items.length / groups) : 1;
    this._timer.start();
};
_p.dispose = function () {
    if (!this.getDisposed()) {
        this.disposeFields("_timer");
        BiScriptLoaderQueue.prototype.dispose.call(this);
    }
};

function BiXmlResourceParser() {
    if (_biInPrototype) return;
    BiXmlLoader.call(this);
    this._componentsById = {};
}
_p = _biExtend(BiXmlResourceParser, BiXmlLoader, "BiXmlResourceParser");
_p._disposed = false;
_p._autoNameMapping = false;
BiXmlResourceParser._namespaceObjects = {};
BiXmlResourceParser.addProperty("autoNameMapping", BiAccessType.READ_WRITE);
_p._rootNode = null;
BiXmlResourceParser.getClassFromUri = function (oUri) {
    return BiXmlResourceParser.getClassFromDocument(BiXmlLoader.load(oUri));
};
BiXmlResourceParser.getClassFromDocument = function (oDoc) {
    return BiXmlResourceParser.getClassFromNode(oDoc.documentElement);
};
BiXmlResourceParser.getClassFromNode = function (oNode) {
    if (oNode == null || oNode.nodeType != 1) return null;
    var constr = BiXmlResourceParser._getConstructor(oNode);
    if (typeof constr == "function") {
        _biInPrototype = true;
        var p = new constr;
        _biInPrototype = false;
        var newConstr = function () {
            if (_biInPrototype) return;
            constr.apply(this, arguments);
            var rp = this._xmlResourceParser = new BiXmlResourceParser;
            rp.setRootNode(oNode);
            rp._processNode(this, oNode);
            if (typeof p.initialize == "function") p.initialize.apply(this, arguments);
        };
        newConstr.prototype = p;
        p.dispose = function () {
            if (this.getDisposed()) return;
            constr.prototype.dispose.call(this);
            this._xmlResourceParser.dispose();
            delete this._xmlResourceParser;
        };
        p.getComponentById = function (sId) {
            return this._xmlResourceParser.getComponentById(sId);
        };
        p.getXmlResourceParser = function () {
            return this._xmlResourceParser;
        };
        p.initialize = p.initialize || BiAccessType.FUNCTION_EMPTY;
        application.addEventListener("dispose", function () {
            newConstr = null;
            oNode = null;
        });
        return newConstr;
    }
    throw new Error("BiXmlResourceParser getClassFromNode. Cannot create object from \"" + oNode.tagName + "\"");
};
BiXmlResourceParser._getNamespaceObject = function (oNode) {
    var uri = oNode.namespaceURI;
    if (!uri) return window;
    else {
        var nso = BiXmlResourceParser._namespaceObjects[uri];
        if (nso) return nso;
        else {
            /.*?\/\/(.*?)(?:\/(.*?)[\?\.\/]?)?$/.test(uri);
            var domain = RegExp.$1;
            var path = RegExp.$2;
            var nameParts = domain.split(".").reverse();
            if (path) nameParts = nameParts.concat(path.split("/"));
            nso = window;
            for (var i = 0; nso && i < nameParts.length; i++) {
                nso = nso[nameParts[i]];
            }
            if (nso) {
                BiXmlResourceParser._namespaceObjects[uri] = nso;
                return nso;
            } else return window;
        }
    }
};
BiXmlResourceParser._getConstructor = function (oNode) {
    var nso = BiXmlResourceParser._getNamespaceObject(oNode);
    var tagName = oNode.localName || oNode.baseName;
    return nso["Bi" + tagName] || nso[tagName];
};
BiXmlResourceParser.addProperty("rootNode", BiAccessType.WRITE);
_p.getRootNode = function () {
    if (this._rootNode) {
        return this._rootNode;
    } else {
        if (this.getLoaded()) return this.getDocument();
        return null;
    }
};
_p._getResourcesNode = function (node) {
    var l = node.childNodes.length;
    for (var i = 0; i < l; i++) {
        var c = node.childNodes[i];
        if (c.tagName == "Resources") return c;
    }
    return null;
};
_p.fromNode = function (oNode, oParent) {
    if (oNode == null || oNode.nodeType != 1) return null;
    var id = oNode.getAttribute("id");
    var c;
    if (id && (c = this._componentsById[id])) {
        if (c.getDisposed()) {
            this._removeObject(id);
        } else {
            if (oParent) {
                if (c instanceof BiAction || c instanceof BiProperty) {
                    c._parent = oParent;
                }
                if (oParent._nameRoot instanceof BiObject && c instanceof BiObject) {
                    c.setNameRoot(oParent._nameRoot);
                }
            }
            return c;
        }
    }
    var constr = BiXmlResourceParser._getConstructor(oNode);
    if (typeof constr == "function") {
        var o = new constr;
        if (oParent) {
            if (o instanceof BiAction || o instanceof BiProperty) {
                o._parent = oParent;
            }
            if (oParent._nameRoot instanceof BiObject && o instanceof BiObject) {
                o.setNameRoot(oParent._nameRoot);
            }
        }
        this._processNode(o, oNode);
        return o;
    }
    throw new Error("BiXmlResourceParser fromNode. Cannot create object from \"" + oNode.tagName + "\"");
};
_p._removeObject = function (id) {
    delete this._componentsById[id];
    if (this._autoNameMapping) {
        try {
            delete window[id];
        } catch (ex) {
            window[id] = null;
        }
    }
};
_p._addObject = function (o, id) {
    this._componentsById[id] = o;
    if (this._autoNameMapping) {
        window[id] = o;
    }
    var orgDispose = o.dispose;
    var oResParser = this;
    o.dispose = function () {
        if (oResParser && !oResParser.getDisposed()) oResParser._removeObject(id);
        if (orgDispose) orgDispose.call(this);
        orgDispose = null;
        oResParser = null;
    };
};
_p._processNode = function (o, oNode) {
    this.processAttributes(o, oNode);
    if (o.interpretXmlNode) o.interpretXmlNode(oNode, this);
    if (o.loadResources) {
        var rNode = this._getResourcesNode(oNode);
        if (rNode) o.loadResources(rNode, this);
    }
    this.processChildNodes(o, oNode);
    if (o.parseXmlNodeComplete) o.parseXmlNodeComplete(this);
};
_p.processAttributes = function (o, oNode) {
    var attrs = oNode.attributes;
    var l = attrs.length;
    for (var i = 0; i < l; i++) {
        var attr = attrs[i];
        var name = attr.localName || attr.baseName;
        var value = attr.value;//attr.nodeValue;
        if (attr.prefix == "xmlns" || attr.name == "xmlns" || /http:\/\/www\.w3\.org/.test(attr.namespaceURI)) continue;
        var nso = BiXmlResourceParser._getNamespaceObject(attr);
        if (name.indexOf(".") > 0) {
            var parts = name.split(".");
            var className = parts[0];
            var setterName = "set" + parts[1].capitalize();
            var constr = nso["Bi" + className] || nso[className];
            if (typeof constr == "function") {
                if (typeof constr[setterName] == "function") {
                    constr[setterName](o, value);
                } else throw new Error("No such attached property \"" + name + "\"");
            } else throw new Error("No such class: \"" + className + "\"");
        } else o.setAttribute(name, value, this); if (name == "id") this._addObject(o, value);
    }
};
_p.processChildNodes = function (obj, oNode) {
    var tagName = oNode.localName || oNode.baseName;
    var re = new RegExp("^" + tagName + "\\.(.+)$");
    var cs = oNode.childNodes;
    var l = cs.length;
    var s;
    var emptyRe = /^\s*$/;
    for (var i = 0; i < l; i++) {
        if (re.test(cs[i].localName || cs[i].baseName)) {
            var propertyName = RegExp.$1;
            var cs2 = cs[i].childNodes;
            var l2 = cs2.length;
            for (var j = 0; j < l2; j++) {
                if (cs2[j].nodeType == 3) {
                    s = cs2[j].data;
                    if (emptyRe.test(s)) continue;
                    obj.setAttribute(propertyName, s, this);
                    break;
                } else if (cs2[j].nodeType == 1) {
                    obj.setProperty(propertyName, this.fromNode(cs2[j]));
                }
            }
        } else obj.addXmlNode(cs[i], this);
    }
};
_p.getComponentById = function (sId) {
    var o = this._componentsById[sId];
    if (o) {
        if (o.getDisposed()) this._removeObject(sId);
        else return o;
    }
    if (this.getLoaded()) {
        var rn = this.getRootNode();
        var n = rn.selectSingleNode("//*[@id='" + sId + "']");
        if (!n) return null;
        o = this.fromNode(n);
        if (o) return o;
    }
    return null;
};
_p.getLoaded = function () {
    return this._rootNode != null || BiXmlLoader.prototype.getLoaded.call(this);
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiXmlLoader.prototype.dispose.call(this);
    for (var id in this._componentsById) {
        this._removeObject(id);
    }
    delete this._componentsById;
    delete this._rootNode;
};

function BiResourceLoader(oScriptLoaderQueueConstructor) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._resources = [];
    this._resourcesById = {};
    this._duplicateScripts = {};
    this._scriptLoaderQueueConstructor = oScriptLoaderQueueConstructor || BiScriptLoaderQueue;
}
_p = _biExtend(BiResourceLoader, BiEventTarget, "BiResourceLoader");
_p._lastLoaded = -1;
_p._lastStarted = -1;
_p._count = 0;
_p._loaded = false;
_p._autoNameMapping = false;
BiResourceLoader.addProperty("autoNameMapping", BiAccessType.READ);
BiResourceLoader.addProperty("scriptLoaderQueueConstructor", BiAccessType.READ);
_p.setAutoNameMapping = function (b) {
    this._autoNameMapping = b;
    if (this._xmlResourceParser) this._xmlResourceParser.setAutoNameMapping(b);
};
_p.getResourceById = function (sId) {
    if (this._resourcesById[sId]) {
        return this._resourcesById[sId].object;
    }
    return null;
};
_p.addResource = function (sType, oData, sId) {
    var lastRes = this._resources[this._resources.length - 1];
    if ((sType == "script" || sType == "inlinescript") && !(lastRes instanceof BiScriptLoaderQueue)) {
        lastRes = new this._scriptLoaderQueueConstructor;
        lastRes.addEventListener("load", this.load, this);
        lastRes.addEventListener("progress", this._onprogress, this);
        lastRes.addEventListener("error", this._onerror, this);
        this._resources.push(lastRes);
    }
    if (sType == "script") {
        if (!this._duplicateScripts[oData]) {
            lastRes.add(oData);
            this._duplicateScripts[oData] = true;
            this._count++;
        }
    } else if (sType == "inlinescript") {
        lastRes.addInline(oData);
        this._count++;
    } else {
        var item = {
            name: sType,
            node: oData,
            id: sId
        };
        this._resources.push(item);
        if (sId) this._resourcesById[sId] = item;
        this._count++;
    }
};
_p.addResourcesFromNode = function (oNode) {
    var n = oNode;
    var nl = n.childNodes;
    var l = nl.length;
    var uri;
    var systemRootPath = application.getPath();
    for (var i = 0; i < l; i++) {
        if (nl[i].nodeType != 1) continue;
        uri = nl[i].getAttribute("uri") || nl[i].getAttribute("src");
        switch (nl[i].tagName) {
        case "package":
        case "Package":
            if (uri) this.addResource("script", new BiUri(systemRootPath, uri));
            else if (nl[i].getAttribute("name")) {
                var uris = application.getPackage(nl[i].getAttribute("name"));
                for (var j = 0; j < uris.length; j++) this.addResource("script", new BiUri(systemRootPath, uris[j]));
            }
            break;
        case "script":
        case "Script":
            application._addAccessibilityPackage();
            if (uri) this.addResource("script", uri);
            else if ((nl[i].text ? nl[i].text : nl[i].nodeValue) != "") {
                this.addResource("inlinescript", nl[i].text ? nl[i].text : nl[i].nodeValue);
            }
            break;
        default:
            this.addResource(nl[i].tagName, nl[i], nl[i].getAttribute("id"));
        }
    }
};
_p._createGeneralObject = function (oItem) {
    var node = oItem.node;
    if (!this._xmlResourceParser) {
        this._xmlResourceParser = new BiXmlResourceParser;
        this._xmlResourceParser.setRootNode(node.parentNode);
        this._xmlResourceParser.setAutoNameMapping(this._autoNameMapping);
    }
    var o = this._xmlResourceParser.fromNode(node);
    oItem.object = o;
    oItem.node = null;
    var loadEventListenerAdded = false;
    if (o instanceof BiEventTarget) {
        loadEventListenerAdded = true;
        o.addEventListener("load", this.load, this);
        o.addEventListener("error", this._onerror, this);
    }
    if (typeof o.load == "function") o.load();
    if (!loadEventListenerAdded) this.load();
};
_p.load = function () {
    if (this._loaded) return;
    var allLoaded = true;
    if (this._lastStarted == -1) {
        allLoaded = false;
        this._lastStarted = 0;
        this._startLoad(this._resources[0]);
    } else {
        for (var i = this._lastStarted; i < this._resources.length; i++) {
            var obj = this._resources[i];
            if (this._isLoaded(obj)) {
                this._lastLoaded = i;
                this._removeListeners(obj);
                this._onprogress();
            } else {
                if (i == this._lastStarted) {
                    allLoaded = false;
                    break;
                }
                this._lastStarted = i;
                this._startLoad(obj);
                if (!this._isLoaded(obj)) {
                    allLoaded = false;
                    break;
                } else {
                    this._lastLoaded = i;
                    this._removeListeners(obj);
                    this._onprogress();
                }
            }
        }
    } if (allLoaded) this._onAllLoaded();
};
_p._startLoad = function (obj) {
    if (obj instanceof BiScriptLoaderQueue) obj.load();
    else this._createGeneralObject(obj);
};
_p._isLoaded = function (obj) {
    if (obj instanceof BiScriptLoaderQueue) return obj.getLoaded();
    else if (obj.object == null) return false;
    else if (typeof obj.object.getLoaded == "function") return obj.object.getLoaded();
    else return true;
};
_p._removeListeners = function (obj) {
    if (obj instanceof BiScriptLoaderQueue) {
        obj.removeEventListener("load", this.load, this);
        obj.removeEventListener("progress", this._onprogress, this);
        obj.removeEventListener("error", this._onerror, this);
    } else if (obj.object != null && obj.object instanceof BiEventTarget) {
        obj.object.removeEventListener("load", this.load, this);
        obj.object.removeEventListener("error", this._onerror, this);
    }
};
_p.abort = function () {
    var items = this._resources;
    var l = items.length;
    for (var i = 0; i < l; i++) {
        if (items[i] instanceof BiScriptLoaderQueue) items[i].abort();
        else if (items[i].object && typeof items[i].object.abort == "function") items[i].object.abort();
    }
};
_p.getLoaded = function () {
    return this._lastLoaded == this._resources.length - 1;
};
_p.getLoadedCount = function () {
    var n = 0;
    var items = this._resources;
    var l = items.length;
    for (var i = 0; i < l; i++) {
        if (items[i] instanceof BiScriptLoaderQueue) n += items[i].getLoadedCount();
        else if (this._isLoaded(items[i])) n++;
    }
    return n;
};
BiResourceLoader.addProperty("count", BiAccessType.READ);
_p.dispose = function () {
    if (this._disposed) return;
    BiEventTarget.prototype.dispose.call(this);
    var item;
    for (var i = this._resources.length - 1; i >= 0; i--) {
        item = this._resources[i];
        if (item instanceof BiScriptLoaderQueue) item.dispose();
        else if (item.object && typeof item.object.dispose == "function") item.object.dispose();
        item.object = null;
        item.uri = null;
        item.constr = null;
    }
    delete this._resources;
    delete this._resourcesById;
    delete this._duplicateScripts;
    delete this._scriptLoaderQueueConstructor;
};
_p._onprogress = function () {
    if (this._loaded) return;
    this.dispatchEvent("progress");
};
_p._onerror = function (e) {
    if (!e.getUserData()) {
        var t = e.getTarget();
        e.setUserData("Error loading " + t + "\nURI: " + t.getUri());
    }
    this._dispatchEvent(e);
};
_p._onAllLoaded = function () {
    if (this._loaded) return;
    this._loaded = true;
    this._onprogress();
    this.dispatchEvent("load");
};

function BiStringBundle() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._bundles = {};
    this._language = this._lastUserLang = this.getUserLanguage();
    this._majorLanguage = this.getMajorLanguage();
}
_p = _biExtend(BiStringBundle, BiEventTarget, "BiStringBundle");
BiStringBundle.formatString = function (sPattern, args) {
    var _args = arguments;
    return sPattern && sPattern.replace(/\%(\d+)/g, function (s, n) {
        return _args[n];
    });
};
_p.setLanguage = function (s) {
    if (s != this._language) {
        this._language = s;
        this._majorLanguage = null;
        this.dispatchEvent("change");
    }
};
_p.getLanguage = function () {
    return this._language;
};
_p.getLanguages = function () {
    var res = [];
    for (var s in this._bundles) res.push(s);
    return res;
};
_p.getStringKeys = function (sLanguage) {
    var b = this.getBundleForLanguage(sLanguage);
    var res = [];
    for (var key in b) res.push(key);
    return res;
};
_p.getMajorLanguage = function () {
    if (this._majorLanguage != null) return this._majorLanguage;
    return this._majorLanguage = this._language.split("-")[0];
};
_p.getString = function (sStringId, sLanguage) {
    return this._getString(sLanguage, sStringId);
};
_p.getFormattedString = function (sStringId, args) {
    var _args = [];
    _args[0] = this._getString(null, sStringId);
    for (var i = 1; i < arguments.length; i++) _args[i] = arguments[i];
    return BiStringBundle.formatString.apply(BiStringBundle, _args);
};
_p.addBundle = function (sLanguage, oStringMap) {
    this._bundles[sLanguage] = oStringMap;
    if (sLanguage == this._language) this.dispatchEvent("change");
};
_p.appendBundle = function (sLanguage, oStringMap) {
    if (sLanguage in this._bundles) {
        var o = this._bundles[sLanguage];
        for (var key in oStringMap) o[key] = oStringMap[key];
    } else {
        this._bundles[sLanguage] = oStringMap;
    }
};
_p.removeBundle = function (sLanguage) {
    delete this._bundles[sLanguage];
};
_p.getUserLanguage = function () {
    var sLanguage = navigator.userLanguage || navigator.language;
    if (sLanguage.length > 3) sLanguage = sLanguage.substr(0, 3) + sLanguage.substr(3).toUpperCase();
    return sLanguage;
};
_p.getBundleForLanguage = function (sLanguage) {
    if (sLanguage) {
        if (sLanguage in this._bundles) return this._bundles[sLanguage];
        var p0 = sLanguage.split("-")[0];
        if (p0 in this._bundles) return this._bundles[p0];
    }
    if (this.getLanguage() in this._bundles) return this._bundles[this.getLanguage()];
    if (this.getMajorLanguage() in this._bundles) return this._bundles[this.getMajorLanguage()];
    if ("en" in this._bundles) return this._bundles.en;
    return {};
};
_p.getBundle = function (sLanguage) {
    if (sLanguage) {
        if (sLanguage in this._bundles) return this._bundles[sLanguage];
    }
    return {};
};
_p._getString = function (sLang, sKey) {
    var bs = this._bundles;
    if (sLang) {
        if (sLang in bs && sKey in bs[sLang]) return bs[sLang][sKey];
        var p0 = sLang.split("-")[0];
        if (p0 in bs && sKey in bs[p0]) return bs[p0][sKey];
    }
    var l;
    if ((l = this.getLanguage()) in bs && sKey in bs[l]) return bs[l][sKey];
    if ((l = this.getMajorLanguage()) in bs && sKey in bs[l]) return bs[l][sKey];
    if ("en" in bs && sKey in bs.en) return bs.en[sKey];
    return null;
};
_p.getBundles = function () {
    var res = [];
    for (var s in this._bundles) res.push(this._bundles[s]);
    return res;
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    this._bundles = null;
    BiEventTarget.prototype.dispose.call(this);
};
BiStringBundle._stringBundleMacro = function (p, fOnChange) {
    if (fOnChange) {
        p.setStringBundle = function (sb) {
            if (this._stringBundle != sb) {
                if (sb && !this._stringBundle) application.getStringBundle().removeEventListener("change", fOnChange, this);
                if (this._stringBundle) this._stringBundle.removeEventListener("change", fOnChange, this);
                this._stringBundle = sb;
                if (this._stringBundle) this._stringBundle.addEventListener("change", fOnChange, this);
                fOnChange.call(this);
            }
        };
    } else {
        p.setStringBundle = function (sb) {
            this._stringBundle = sb;
        };
    }
    p._getString = function (s) {
        var sb = this._stringBundle || application.getStringBundle();
        return sb.getFormattedString.apply(sb, arguments);
    };
};

function LoadingStatus() {
    this._element = document.createElement("DIV");
    this._element.className = "bi-loading-status";
    this._htmlElement = document.createElement("DIV");
    this._htmlElement.className = "bi-loading-status-html";
    this._element.appendChild(this._htmlElement);
    this._textElement = document.createElement("DIV");
    this._textElement.className = "bi-loading-status-text";
    this._element.appendChild(this._textElement);
    this._pbElement = document.createElement("DIV");
    this._pbElement.className = "bi-loading-status-progress-bar";
    this._element.appendChild(this._pbElement);
    this._fillElement = document.createElement("DIV");
    this._pbElement.appendChild(this._fillElement);
    document.body.appendChild(this._element);
    var oThis = this;
    this._onresize = function () {
        oThis.fixSize();
    };
    BiEvent._addDOMEventListener(window, "resize", this._onresize);
    this.fixSize();
    this.setHtmlText(LoadingStatus._defaultHtml);

}
_p = LoadingStatus.prototype = new Object();
_p.dispose = function (nValue) {
    if (this._disposed) return;
    BiEvent._removeDOMEventListener(window, "resize", this._onresize);
    this._element.style.filter = "none";
    if (document.body && !(application && application._disposed)) document.body.removeChild(this._element);
    this._element = this._htmlElement = this._pbElement = this._textElement = this._fillElement = this._onresize = null;
    this._disposed = true;
};
_p.setValue = function (nValue) {
    this._fillElement.style.width = (nValue == null ? "10" : nValue) + "%";
};
_p.setText = function (s) {
    while (this._textElement.hasChildNodes()) this._textElement.removeChild(this._textElement.lastChild);
    this._textElement.appendChild(document.createTextNode(s));
};
_p.fixSize = function () {
    this._element.style.left = Math.max(0, (document.body.clientWidth - this._element.offsetWidth) / 2) + "px";
    this._element.style.top = Math.max(0, (document.body.clientHeight - this._element.offsetHeight) / 2) + "px";
};
_p.setHtmlText = function (sHtml, sStyle) {
    if (typeof application != "undefined") {
        sHtml = sHtml.replace(/%VERSION%/g, application.getVersion());
        sHtml = sHtml.replace(/%ROOT%/g, application._findRootPath());
    }
    this._htmlElement.innerHTML = sHtml;
    if (sStyle) this._htmlElement.style.cssText = sStyle;
};
_p.setStyle = function (sStyle) {
    if (!/visibility/i.test(sStyle) && this._element.style.visibility != "") {
        sStyle = "visibility:" + this._element.style.visibility + ";" + sStyle;
    }
    this._element.style.cssText = sStyle;
    this.fixSize();
};
_p.setStatusTextStyle = function (sStyle) {
    if (sStyle) this._textElement.style.cssText = sStyle;
};
_p.setProgressBarStyle = function (sStyle) {
    if (sStyle) this._pbElement.style.cssText = sStyle;
};
_p.setVisible = function (b) {
    this._element.style.visibility = b ? "visible" : "hidden";
};

LoadingStatus._defaultHtml = '<div style="position:absolute; top: 5px;left:5px;width:280px;"><img src="%ROOT%images/bindows_logo.png"/>' + '<div style="position:absolute;left:0px;right:10px;bottom:-15px;color:red;font-size:111%;font-weight:bold;white-space:nowrap">系统正在加载，请稍后…</div>' + '<p style="font-size:110%;margin:10px 0;">Eli&#8482; ADS！</p></div>' + '<div style="position:absolute;bottom:5px;left:10px">Version 0.0.10</div>' + '<div style="position:absolute;bottom:5px;right:10px">&#x00A9; 2014&ndash;2015.</div>';

function BiThemeManager() {
    if (_biInPrototype) return;
    if (BiThemeManager._singleton) return BiThemeManager._singleton;
    BiEventTarget.call(this);
    this._themes = {};
    BiThemeManager._singleton = this;
}
_p = _biExtend(BiThemeManager, BiEventTarget, "BiThemeManager");
_p.applyTheme = function (oComponent) {
    var t = oComponent._activeTheme;
    if (t && t != this._defaultTheme) {
        t.unthemeComponent(oComponent);
    }
    if (t != this._defaultTheme) {
        this._defaultTheme.themeComponent(oComponent);
        oComponent._activeTheme = this._defaultTheme;
    }
};
_p.setClassAppearance = function (fClass, sName, bManual) {
    this.setAppearance(fClass.prototype, sName, bManual);
};
_p.setAppearance = function (oComp, sName, bManual) {
    if (bManual != null) oComp._themeManualInteractivity = Boolean(bManual);
};
_p.addAppearanceListeners = function (oComp) {
    var app = oComp.getAppearance();
    var states = this.getAppearanceStates(app);
    this._addAppearanceListeners(oComp, states);
};
_p._addAppearanceListeners = function (oComp, oStates) {
    if (Object.isEmpty(oStates) || oComp._themeManualInteractivity) return;
    var win = application.getWindow();
    if (!win) return;
    if ("hover" in oStates) {
        oComp.addEventListener("mouseover", this._handleMouseOver, this);
        oComp.addEventListener("mouseout", this._handleMouseOut, this);
    }
    if ("active" in oStates) {
        oComp.addEventListener("mousedown", this._handleMouseDown, this);
    }
    if ("focus" in oStates) {
        oComp.addEventListener("focusin", this._handleFocusIn, this);
        oComp.addEventListener("focusout", this._handleFocusOut, this);
    }
    if ("checked" in oStates) {
        oComp.addEventListener("change", this._handleChange, this);
    }
    if ("disabled" in oStates) {
        oComp.addEventListener("enabledchanged", this._handleEnabledChanged, this);
    }
};
_p.removeAppearanceListeners = function (oComp) {
    var app = oComp.getAppearance();
    var states = this.getAppearanceStates(app);
    this._removeAppearanceListeners(oComp, states);
};
_p._removeAppearanceListeners = function (oComp, oStates) {
    if (Object.isEmpty(oStates) || oComp._themeManualInteractivity) return;
    var win = application.getWindow();
    if (!win) return;
    if ("hover" in oStates) {
        oComp.removeEventListener("mouseover", this._handleMouseOver, this);
        oComp.removeEventListener("mouseout", this._handleMouseOut, this);
    }
    if ("active" in oStates) {
        oComp.removeEventListener("mousedown", this._handleMouseDown, this);
        if (this._addedMouseUpListeners) {
            win.removeEventListener("mouseup", this._handleMouseUp, this);
            this._addedMouseUpListeners = false;
        }
    }
    if ("focus" in oStates) {
        oComp.removeEventListener("focusin", this._handleFocusIn, this);
        oComp.removeEventListener("focusout", this._handleFocusOut, this);
    }
    if ("checked" in oStates) {
        oComp.removeEventListener("change", this._handleChange, this);
    }
    if ("disabled" in oStates) {
        oComp.removeEventListener("enabledchanged", this._handleEnabledChanged, this);
    }
};
_p.addAppearance = function (oComp) {
    oComp._themeStates = {};
    this.applyAppearance(oComp);
    this.addAppearanceListeners(oComp);
    var app = oComp.getAppearance();
    var states = this.getAppearanceStates(app);
    if (Object.isEmpty(states)) return;
    var changed = false;
    if ("focus" in states && oComp.getContainsFocus()) {
        this.addState(oComp, "focus");
        changed = true;
    }
    if ("selected" in states && oComp.getSelected()) {
        this.addState(oComp, "selected");
        changed = true;
    }
    if ("checked" in states && oComp.getChecked && oComp.getChecked()) {
        this.addState(oComp, "checked");
        changed = true;
    }
    if ("disabled" in states && !oComp.getEnabled()) {
        this.addState(oComp, "disabled");
        changed = true;
    }
    if (changed) this.applyAppearance(oComp);
};
_p.getAppearanceStates = function (sName) {
    var t = this.getDefaultTheme();
    return t.getAppearanceStates(sName);
};
_p.getCurrentState = function (oComp) {
    return oComp._themeStates;
};
_p.getAppearanceTag = function (oComp) {
    var app = oComp.getAppearance();
    if (app) return this._getAppearanceTag(app, oComp._themeStates);
    return "";
};
_p._getAppearanceTag = function (sName, oStates) {
    var s = " " + sName;
    for (var pseudo in oStates) s += " " + sName + "-" + pseudo;
    return s;
};
_p.applyAppearance = function (oComp) {
    if (!oComp.getDisposed()) {
        oComp.setHtmlProperty("className", oComp._cssClassName + this.getAppearanceTag(oComp));
    }
};
_p.addState = function (oComp, sPseudo) {
    oComp._themeStates[sPseudo] = true;
};
_p.removeState = function (oComp, sPseudo) {
    if (oComp._themeStates) {
        delete oComp._themeStates[sPseudo];
    }
};
_p.setStateValue = function (oComp, sPseudo, bAdd) {
    if (bAdd) this.addState(oComp, sPseudo);
    else this.removeState(oComp, sPseudo);
};
_p.addTheme = function (oTheme) {
    var n = oTheme.getName();
    if (!this._themes[n]) {
        this._themes[n] = oTheme;
        oTheme._create();
        if (oTheme.getName() == this._defaultThemeName) {
            this._defaultThemeName = "";
            this.setDefaultTheme(oTheme);
        }
    } else if (this._themes[n] !== oTheme) {
        throw new Error("Cannot add another theme with the same name: " + n);
    }
};
_p.removeTheme = function (oTheme) {
    if (oTheme.getDefault()) oTheme.setDefault(false);
    delete this._themes[oTheme.getName()];
};
_p.getThemes = function () {
    var themes = [];
    for (var name in this._themes) {
        if (this._themes.hasOwnProperty(name)) {
            themes.push(this._themes[name]);
        }
    }
    return themes;
};
_p.getDefaultTheme = function () {
    if (this._defaultTheme) return this._defaultTheme;
    return this._defaultTheme = this._themes[this._defaultThemeName];
};
_p.setDefaultTheme = function (oTheme) {
    if (oTheme != this._defaultTheme) {
        this._setDefaultThemeByName(oTheme.getName());
        this.dispatchEvent("themechanged");
    }
};
_p._setDefaultThemeByName = function (sName) {
    if (this._defaultThemeName !== sName) {
        this._defaultThemeName = sName;
        if (this._themes[sName]) {
            this._defaultTheme = this._themes[sName];
            for (var name in this._themes) {
                if (this._themes.hasOwnProperty(name)) {
                    this._themes[name].setDefault(name === sName);
                }
            }
            if (window.BiComponent && BiComponent.invalidateAll) BiComponent.invalidateAll();
            if (window.BiMenu && BiMenu.invalidateAll) BiMenu.invalidateAll();
        }
    }
};
_p.addCssRule = function (sSelector, sStyle) {
    if (!sSelector || !sStyle) {
        return;
    }
    if (!this._sharedStyleSheet) {
        this._sharedStyleSheet = BiThemeManager._createStyleElement();
        this._sharedStyleSheet.id = "bi-theme-shared-style-sheet";
    }
    var ss;
    if (BiBrowserCheck.ie) {
        ss = document.styleSheets["bi-theme-shared-style-sheet"];
        ss.addRule(sSelector, sStyle);
    } else {
        ss = this._sharedStyleSheet.sheet;
        ss.insertRule(sSelector + "{" + sStyle + "}", ss.cssRules.length);
    }
};
_p.removeCssRule = function (sSelector) {
    if (sSelector == null || !this._sharedStyleSheet) {
        return;
    }
    var ss, rules, l, i;
    if (BiBrowserCheck.ie) {
        ss = document.styleSheets["bi-theme-shared-style-sheet"];
        rules = ss.rules;
        l = rules.length;
        for (i = rules.length - 1; i >= 0; i--) {
            if (rules[i].selectorText == sSelector) {
                ss.removeRule(i);
            }
        }
    } else {
        ss = this._sharedStyleSheet.sheet;
        rules = ss.cssRules;
        l = rules.length;
        for (i = rules.length - 1; i >= 0; i--) {
            if (rules[i].selectorText == sSelector) {
                ss.deleteRule(i);
            }
        }
    }
};
BiThemeManager._createStyleElement = function (sCssText, sClassName) {
    var el;
    if (BiBrowserCheck.ie) {
        var ss = document.createStyleSheet();
        if (sCssText) ss.cssText = sCssText;
        el = ss.owningElement;
    } else {
        el = document.createElement("STYLE");
        el.type = "text/css";
        el.appendChild(document.createTextNode(sCssText));
        var h = document.getElementsByTagName("HEAD")[0];
        h.appendChild(el);
    } if (sClassName) el.className = sClassName;
    return el;
};
BiThemeManager._createLinkElement = function (sName, oUri, sClassName) {
    var uri = String(oUri);
    var el = document.createElement("link");
    el.type = "text/css";
    el.rel = "stylesheet";
    el.href = uri;
    var h = document.getElementsByTagName("HEAD")[0];
    h.appendChild(el);
    el.className = sClassName || "bi-theme-link";
    el.disabled = false;
    return el;
};
_p._handleMouseDown = function (e) {
    var c = e.getCurrentTarget();
    this._mouseActivatedComponent = c;
    this.addState(c, "active");
    this.applyAppearance(c);
};
_p._handleMouseUp = function (e) {
    var c = this._mouseActivatedComponent;
    if (c) {
        this.removeState(c, "active");
        this.applyAppearance(c);
        this._mouseActivatedComponent = null;
    }
};
_p._handleMouseOver = function (e) {
    var c = e.getCurrentTarget();
    this.addState(c, "hover");
    if (c.getContainsFocus()) {
        this.addState(c, "hover-focus");
    }
    if (this._mouseActivatedComponent === c) {
        this.addState(c, "active");
    }
    this.applyAppearance(c);
};
_p._handleMouseOut = function (e) {
    var c = e.getCurrentTarget();
    this.removeState(c, "active");
    this.removeState(c, "hover");
    this.removeState(c, "hover-focus");
    this.applyAppearance(c);
};
_p._handleFocusIn = function (e) {
    var c = e.getCurrentTarget();
    this.addState(c, "focus");
    if (c._themeStates.hover) this.addState(c, "hover-focus");
    this.applyAppearance(c);
};
_p._handleFocusOut = function (e) {
    var c = e.getCurrentTarget();
    this.removeState(c, "focus");
    this.removeState(c, "hover-focus");
    this.applyAppearance(c);
};
_p._handleChange = function (e) {
    var c = e.getCurrentTarget();
    if (c.getChecked && c.getChecked()) this.addState(c, "checked");
    else this.removeState(c, "checked");
    this.applyAppearance(c);
};
_p._handleEnabledChanged = function (e) {
    var c = e.getCurrentTarget();
    if (c.getEnabled()) this.removeState(c, "disabled");
    else this.addState(c, "disabled");
    this.applyAppearance(c);
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiObject.prototype.dispose.call(this);
    for (var name in this._themes) {
        if (this._themes.hasOwnProperty(name)) {
            this._themes[name].dispose();
        }
    }
    delete this._themes;
    this._sharedStyleSheet = null;
    delete BiThemeManager._singleton;
};

function BiTheme(sName) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._appearances = {};
    this._appearanceProperties = {};
    if (sName) this._name = sName;
}
_p = _biExtend(BiTheme, BiObject, "BiTheme");
BiTheme.KEYS = {
    dialog: 1,
    button: 2,
    calendarButton: 3,
    comboBoxButton: 4,
    groupBox: 5,
    groupBoxBackground: 6,
    groupBoxTitleBackground: 7,
    menuBackground: 8,
    popupBackground: 9,
    scrollbarDecButton: 10,
    scrollbarIncButton: 11,
    scrollbarBlockButton: 12,
    spinnerButton: 13,
    tabButton: 14,
    tabScrollButton: 15,
    toolBarButton: 16,
    window: 17,
    windowControlButton: 18,
    collapsiblePanelCaptionButton: 19
};
_p._themeTypes = {};
_p._name = "";
_p._default = false;
BiTheme.addProperty("name", BiAccessType.READ);
BiTheme.addProperty("default", BiAccessType.READ);
_p.setDefault = function (b) {
    if (b != this._default) {
        this._default = b;
        if (this._created) {
            this._linkEl.disabled = !b;
        }
        if (b) application.getThemeManager().setDefaultTheme(this);
    }
};
_p.themeComponent = function (oComponent) {};
_p.unthemeComponent = function (oComponent) {};
_p.addAppearance = function (sAppearanceName, oStates) {
    var hash = {};
    for (var i = 0; i < oStates.length; i++) hash[oStates[i]] = true;
    this._appearances[sAppearanceName] = hash;
};
_p.removeAppearance = function (sAppearanceName) {
    delete this._appearances[sAppearanceName];
};
_p.getAppearanceStates = function (sName) {
    return this._appearances[sName] || {};
};
_p.getAppearanceProperty = function (sName, sPropertyName) {
    if (sName in this._appearanceProperties) return this._appearanceProperties[sName][sPropertyName];
    return null;
};
_p.setAppearanceProperty = function (sName, sPropertyName, oValue) {
    if (!(sName in this._appearanceProperties)) this._appearanceProperties[sName] = {};
    this._appearanceProperties[sName][sPropertyName] = oValue;
};
_p._create = function () {
    if (this._created) return;
    this._linkEl = application.getAdf()._findLinkElement(this.getName());
    if (this._linkEl) {
        this._linkEl.disabled = !this.getDefault();
    };
    this._created = true;
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiObject.prototype.dispose.call(this);
    if (this._linkEl) {
        if (!BiBrowserCheck.moz) {
            this._linkEl.disabled = true;
        }
        this._linkEl.onload = null;
    }
    this._linkEl = null;
};

function BiAbstractFiller() {
    if (_biInPrototype) return;
    BiObject.call(this);
}
_p = _biExtend(BiAbstractFiller, BiObject, "BiAbstractFiller");
_p.apply = function (oComponent) {
    if (this._component) throw new Error("this filler has already been applied to a component");
    this._component = oComponent;
    this._component.addEventListener("resize", this._layout, this);
    if (oComponent._created) {
        this._apply();
    } else {
        oComponent.addEventListener("create", this._apply, this);
    }
};
_p._apply = function () {};
_p._layout = function () {};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    if (this._component) {
        this._component._backgroundFiller = null;
        this._component.removeEventListener("resize", this._layout, this);
        this._component.removeEventListener("create", this._apply, this);
        delete this._component;
    }
};

function BiImageBorderFiller(borderSizes) {
    if (_biInPrototype) return;
    BiAbstractFiller.call(this);
    this._borderSizes = borderSizes;
}
_p = _biExtend(BiImageBorderFiller, BiAbstractFiller, "BiImageBorderFiller");
BiImageBorderFiller._STRING_DIV = "DIV";
BiImageBorderFiller._STRING_PX = "px";
BiImageBorderFiller.addProperty("borderSizes", BiAccessType.READ_WRITE);
_p._apply = function () {
    //modify by zengtao 2015-02-27 delete windows border
    return;
    //modify by zengtao 2015-02-27
    if (!this._component._element) throw new Error("Error component has no element!");
    var p = this._component._element;
    var firstChild = p.firstChild;
    var el;
    var w = p.offsetWidth || p.clientWidth;
    var h = p.offsetHeight || p.clientHeight;
    var leftBorder = this._borderSizes.l;
    var rightBorder = this._borderSizes.r;
    var topBorder = this._borderSizes.t;
    var bottomBorder = this._borderSizes.b;
    var innerW = Math.max(0, w - leftBorder - rightBorder);
    var innerH = Math.max(0, h - topBorder - bottomBorder);
    var d = p.ownerDocument || p.document;
    el = d.createElement(BiImageBorderFiller._STRING_DIV);
    el.className = "border border-bl";
    this._bl = p.insertBefore(el, firstChild);
    el = d.createElement(BiImageBorderFiller._STRING_DIV);
    el.className = "border border-br";
    this._br = p.insertBefore(el, firstChild);
    el = d.createElement(BiImageBorderFiller._STRING_DIV);
    el.className = "border border-tl";
    this._tl = p.insertBefore(el, firstChild);
    el = d.createElement(BiImageBorderFiller._STRING_DIV);
    el.className = "border border-tr";
    this._tr = p.insertBefore(el, firstChild);
    el = d.createElement(BiImageBorderFiller._STRING_DIV);
    el.className = "border border-fill";
    el.style.width = innerW + BiImageBorderFiller._STRING_PX;
    el.style.height = innerH + BiImageBorderFiller._STRING_PX;
    el.style.left = leftBorder + BiImageBorderFiller._STRING_PX;
    el.style.top = topBorder + BiImageBorderFiller._STRING_PX;
    if (innerH > 0) p.insertBefore(el, this._bl);
    this._fill = el;
    el = d.createElement(BiImageBorderFiller._STRING_DIV);
    el.className = "border border-l";
    el.style.height = innerH + BiImageBorderFiller._STRING_PX;
    if (innerH > 0) p.insertBefore(el, this._bl);
    this._l = el;
    el = d.createElement(BiImageBorderFiller._STRING_DIV);
    el.className = "border border-r";
    el.style.height = innerH + BiImageBorderFiller._STRING_PX;
    if (innerH > 0) p.insertBefore(el, this._bl);
    this._r = el;
    el = d.createElement(BiImageBorderFiller._STRING_DIV);
    el.className = "border border-b";
    el.style.width = innerW + BiImageBorderFiller._STRING_PX;
    if (innerW > 0) p.insertBefore(el, this._bl);
    this._b = el;
    el = d.createElement(BiImageBorderFiller._STRING_DIV);
    el.className = "border border-t";
    el.style.width = innerW + BiImageBorderFiller._STRING_PX;
    if (innerW > 0) p.insertBefore(el, this._bl);
    this._t = el;
};
_p._layout = function () {
    if (this._fill) {
        var leftBorder = this._borderSizes.l;
        var rightBorder = this._borderSizes.r;
        var topBorder = this._borderSizes.t;
        var bottomBorder = this._borderSizes.b;
        var p = this._component._element;
        var w = (p.offsetWidth || p.clientWidth) - leftBorder - rightBorder;
        var h = (p.offsetHeight || p.clientHeight) - topBorder - bottomBorder;
        var wpx = w + BiImageBorderFiller._STRING_PX;
        var hpx = h + BiImageBorderFiller._STRING_PX;
        if (w > 0) {
            if (this._fill.parentNode != p) p.insertBefore(this._fill, this._bl);
            if (this._t.parentNode != p) {
                p.insertBefore(this._b, this._bl);
                p.insertBefore(this._t, this._bl);
            }
            this._t.style.width = wpx;
            this._b.style.width = wpx;
            this._fill.style.width = wpx;
        } else {
            if (this._fill.parentNode == p) p.removeChild(this._fill);
            if (this._t.parentNode == p) {
                p.removeChild(this._t);
                p.removeChild(this._b);
            }
        } if (h > 0) {
            if (this._fill.parentNode != p) p.insertBefore(this._fill, this._bl);
            if (this._l.parentNode != p) {
                p.insertBefore(this._l, this._bl);
                p.insertBefore(this._r, this._bl);
            }
            this._l.style.height = hpx;
            this._r.style.height = hpx;
            this._fill.style.height = hpx;
        } else {
            if (this._fill.parentNode == p) p.removeChild(this._fill);
            if (this._l.parentNode == p) {
                p.removeChild(this._l);
                p.removeChild(this._r);
            }
        }
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    if (this._fill) {
        var p = this._tl.parentNode;
        if (p) {
            p.removeChild(this._tl);
            p.removeChild(this._tr);
            p.removeChild(this._bl);
            p.removeChild(this._br);
            if (this._fill.parentNode == p) p.removeChild(this._fill);
            if (this._l.parentNode == p) {
                p.removeChild(this._l);
                p.removeChild(this._r);
            }
            if (this._t.parentNode == p) {
                p.removeChild(this._t);
                p.removeChild(this._b);
            }
        }
        delete this._fill;
        delete this._tl;
        delete this._t;
        delete this._tr;
        delete this._l;
        delete this._r;
        delete this._b;
        delete this._bl;
        delete this._br;
    }
    BiAbstractFiller.prototype.dispose.call(this);
};

function BiAdf() {
    if (_biInPrototype) return;
    BiXmlLoader.call(this);
    this._async = true;
    this._scripts = [];
    this._linkEls = {};
    this._xmlResourceParser = new BiXmlResourceParser;
}
_p = _biExtend(BiAdf, BiXmlLoader, "BiAdf");
_p._disposed = false;
BiAdf.addProperty("caption", BiAccessType.READ_WRITE);
BiAdf.addProperty("xmlResourceParser", BiAccessType.READ);
_p.setAutoNameMapping = function (b) {
    if (this._autoNameMapping != b) {
        this._autoNameMapping = b;
        if (this._xmlResourceParser) this._xmlResourceParser.setAutoNameMapping(b);
        var rl = application.getResourceLoader();
        if (rl) rl.setAutoNameMapping(b);
        application.setAutoNameMapping(b);
    }
};
_p.getAutoNameMapping = function () {
    return application.getAutoNameMapping();
};
_p.setKeyBundleFile = function (s) {
    application.setKeyBundleFile(s);
};
_p.getKeyBundleFile = function () {
    return application.getKeyBundleFile();
};
_p._getNsAgnosticXpath = function (sNoNsXpath) {
    return BiXmlDocument._PARTIAL_XPATH_SUPPORT ? sNoNsXpath : sNoNsXpath.replace(/(\w+)/g, "*[name()='$1']");
};
_p._interpret = function () {
    var doc = this.getDocument();
    var caption = doc.selectSingleNode(this._getNsAgnosticXpath("/Application/Window/@caption"));
    if (caption) document.title = caption.text ? caption.text : caption.nodeValue;
    var appEl = doc.documentElement;
    this._xmlResourceParser.processAttributes(application, appEl);
    this._insertThemeCss();
    this._createSplashScreen();
};
_p._addResources = function () {
    var rl = application.getResourceLoader();
    rl.setAutoNameMapping(this._autoNameMapping);
    var doc = this.getDocument();
    var n = doc.selectSingleNode(this._getNsAgnosticXpath("/Application/Resources"));
    if (n) rl.addResourcesFromNode(n);
};
_p._createSplashScreen = function () {
    application._loadStatus.setVisible(false);
};
_p.parseXmlResources = function () {
    this._xmlResourceParser.setAutoNameMapping(this._autoNameMapping);
    var doc = this.getDocument();
    var windowEl = doc.selectSingleNode(this._getNsAgnosticXpath("/Application/Window"));
    if (!windowEl) return;
    this._xmlResourceParser.setRootNode(windowEl);
    var win = application.getWindow();
    var adfAttrs = ["left", "right", "top", "bottom", "width", "height", "centered", "resizable", "fullScreen"];
    var temp = {};
    for (var i = 0; i < adfAttrs.length; i++) {
        if (windowEl.getAttributeNode(adfAttrs[i]) != null) {
            temp[adfAttrs[i]] = windowEl.getAttribute(adfAttrs[i]);
            windowEl.removeAttribute(adfAttrs[i]);
        }
    }
    this._xmlResourceParser.processAttributes(win, windowEl);
    this._xmlResourceParser.processChildNodes(win, windowEl);
    for (var attr in temp) {
        windowEl.setAttribute(attr, temp[attr]);
        temp[attr] = null;
    }
};
_p._insertThemeCss = function () {
    var doc = this.getDocument();
    var themeNodes = doc.selectNodes(this._getNsAgnosticXpath("/Application/Theme"));
    var themeLoaded = false,
        defaultThemeName = null;
    for (var i = 0; i < themeNodes.length; i++) {
        var name = themeNodes[i].getAttribute("name");
        var cssUri = themeNodes[i].getAttribute("cssUri");
        var jsUri = themeNodes[i].getAttribute("jsUri");
        this._loadTheme(name, false, cssUri, jsUri);
        if (i == 0 || themeNodes[i].getAttribute("default") == "true") defaultThemeName = name;
        themeLoaded = true;
    }
    if (defaultThemeName) application.getThemeManager()._setDefaultThemeByName(defaultThemeName);
    else if (!themeLoaded) {
        this._loadTheme("Default", true, new BiUri(application.getPath(), "themes/Default/theme.css"), new BiUri(application.getPath(), "themes/Default/theme.js"));
    }
};
_p._loadTheme = function (sName, bDefault, sCssUri, sJsUri) {
    if (!sCssUri) sCssUri = new BiUri(application.getPath(), "themes/" + sName + "/theme.css");
    else sCssUri = new BiUri(application.getAdfPath(), sCssUri); if (!sJsUri) sJsUri = new BiUri(application.getPath(), "themes/" + sName + "/theme.js");
    else sJsUri = new BiUri(application.getAdfPath(), sJsUri);
    var linkEl = BiThemeManager._createLinkElement(sName, sCssUri);
    linkEl.disabled = !bDefault;
    this._linkEls[sName] = linkEl;
    application.getResourceLoader().addResource("script", sJsUri);
    if (bDefault) application.getThemeManager()._setDefaultThemeByName(sName);
};
_p._findLinkElement = function (sName) {
    return this._linkEls[sName];
};
_p.getScriptLoaderConstructor = function () {
    return BiScriptLoaderQueue;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiXmlLoader.prototype.dispose.call(this);
    for (var n in this._linkEls) {
        delete this._linkEls[n];
    }
    this.disposeFields("_linkEls", "_scripts", "_xmlResourceParser");
};

function BiTimerManager() {
    if (_biInPrototype) return;
    if (BiTimerManager._singleton) return BiTimerManager._singleton;
    BiObject.call(this);
    this._timers = [];
    BiTimerManager._singleton = this;
    application.addEventListener("dispose", this.dispose, this);
}
_p = _biExtend(BiTimerManager, BiObject, "BiTimerManager");
_p.add = function (oTimer) {
    this._timers[oTimer._objId] = oTimer;
};
_p.remove = function (oTimer) {
    delete this._timers[oTimer._objId];
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    for (var i in this._timers) {
        if (String(i >>> 0) == i && i >>> 0 != 0xffffffff) {
            this._timers[i].dispose();
        }
    }
    delete this._timers;
    application.removeEventListener("dispose", this.dispose, this);
    delete BiTimerManager._singleton;
};

function BiTimer(nInterval) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    (new BiTimerManager).add(this);
    if (nInterval >= 0) this._interval = nInterval;
    var oThis = this;
    this.__ontick = function () {
        if (!oThis) return;
        if (oThis._disposed) oThis = null;
        else oThis._ontick();
    };
}
_p = _biExtend(BiTimer, BiEventTarget, "BiTimer");
_p._enabled = false;
_p._interval = 1000;
_p._intervalHandle = null;
BiTimer.addProperty("enabled", BiAccessType.READ_WRITE);
BiTimer.addProperty("interval", BiAccessType.READ);
_p.setInterval = function (nInterval) {
    if (this._enabled) this.stop();
    this._interval = nInterval;
};
_p.start = function () {
    if (this._enabled) this.stop();
    this._enabled = true;
    this._intervalHandle = window.setInterval(this.__ontick, this._interval);
};
_p.stop = function () {
    this._enabled = false;
    window.clearInterval(this._intervalHandle);
    delete this._intervalHandle;
};
_p._ontick = function () {
    if (this._enabled) {
        var e = new BiEvent("tick");
        this.dispatchEvent(e);
        e.dispose();
        application.flushLayoutQueue();
    }
};
_p.getIsStarted = function () {
    return this._intervalHandle != null;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiEventTarget.prototype.dispose.call(this);
    this.stop();
    (new BiTimerManager).remove(this);
    this.__ontick();
    delete this.__ontick;
    delete this._interval;
};
BiTimer.callOnce = function (fun, time, obj) {
    var t = new BiTimer(time != null ? time : 1);
    t.addEventListener("tick", function (e) {
        t.dispose();
        t = null;
        fun.call(obj, e);
        obj = fun = null;
    }, obj);
    t.start();
    return t;
};

function BiKeyBundle() {
    if (_biInPrototype) return;
    BiAbstractLoader.call(this);
}
_p = _biExtend(BiKeyBundle, BiAbstractLoader, "BiKeyBundle");
_p._async = false;
BiKeyBundle.addProperty("text", BiAccessType.READ);
BiKeyBundle.addProperty("uri", BiAccessType.READ_WRITE);
_p.getSrc = function () {
    return this.getUri();
};
_p.setSrc = function (s) {
    return this.setUri(s);
};
BiKeyBundle.addProperty("merge", BiAccessType.READ_WRITE);
BiKeyBundle.addProperty("bundle", BiAccessType.READ);
_p.getShortcuts = function (sName) {
    return this._lookup(sName, "keystrokes", BiKeystroke.fromString);
};
_p.getModifiers = function (sName) {
    return this._lookup(sName, "modifiers", BiKeystroke.modifiersFromString);
};
_p._lookup = function (sName, sCategory, fFromString) {
    var bundled = this._bundle[sCategory];
    var value = bundled[sName];
    if (typeof value == "string") return bundled[sName] = [fFromString(value)];
    else if (value && value.length && typeof value[0] == "string") return bundled[sName] = value.map(fFromString);
    else return value;
};
_p._setShortcuts = function (sName, sShortcut) {
    var shortcuts = Array.prototype.slice.call(arguments, 1);
    this._setKeyBundleValue(sName, "keystrokes", shortcuts);
};
_p._setModifiers = function (sName, sModifiers) {
    var modifiers = Array.prototype.slice.call(arguments, 1);
    this._setKeyBundleValue(sName, "modifiers", modifiers);
};
_p._setKeyBundleValue = function (sName, sCategory, oValues) {
    this._bundle[sCategory][sName] = oValues;
};
_p.getLoaded = function () {
    return Boolean(this._text);
};
_p.getLoading = function () {
    return this._loader && this._loader.getLoading();
};
_p.getError = function () {
    return this._loader && this._loader.getError();
};
_p.abort = function () {
    if (this._loader) this._loader.abort();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiAbstractLoader.prototype.dispose.call(this);
    this.disposeFields("_loader", "_text");
};
_p.addXmlNode = function (n, p) {
    this._text = n.text;
};
_p.load = function () {
    if (this._uri) {
        var sl = this._loader;
        if (!sl) {
            sl = this._loader = new BiTextLoader;
            sl.addEventListener("load", this._onload, this);
        }
        sl.setAsync(this.getAsync());
        sl.setUri(this._uri);
        sl.load();
    } else if (this._text) this._onload();
};
_p._onload = function () {
    if (this._loader) this._text = this._loader.getText();
    var kb = this._bundle = eval("(" + this._text + ")");
    if (!kb.modifiers && !kb.keystrokes) kb = {
        keystrokes: kb
    };
    this._applyMacOverrides();
    if (this._merge) {
        var appKb = application._keyBundle._bundle;
        this._mergeInto(appKb.keystrokes, kb.keystrokes || kb);
        this._mergeInto(appKb.modifiers, kb.modifiers);
    } else {
        application._keyBundle = this;
        if (!kb.modifiers) kb.modifiers = {};
    }
    this.dispatchEvent("load");
};
_p._mergeInto = function (dest, overrides) {
    for (var n in overrides) dest[n] = overrides[n];
};
_p._applyMacOverrides = function () {
    var kb = this._bundle;
    var macOverrides = BiBrowserCheck.platformIsMac && kb.macOverrides;
    if (macOverrides) {
        this._mergeInto(kb.keystrokes, macOverrides.keystrokes);
        this._mergeInto(kb.modifiers, macOverrides.modifiers);
    }
};

function BiApplication() {
    if (_biInPrototype) return;
    if (typeof application == "object") return application;
    application = this;
    this._spellCheck = false;
    BiEventTarget.call(this);
    this._progressStatus = "";
    this._adf = new BiAdf;
}
var application;
_p = _biExtend(BiApplication, BiEventTarget, "BiApplication");
_p._version = "4.2";
BiApplication.addProperty("version", BiAccessType.READ);
_p.start = function (sRootPath, sAdfPath, oArgs)
{
    if (!BiBrowserCheck.supported)
    {
        alert("SmartUIPlatform is not supported for your Browser.");
        return;
    }
    this.addEventListener("progressstatus", this._onprogressstatus);
    this._loadStatus = new LoadingStatus();
    this._loadStatus.setValue(2);
    if (arguments.length != 0) this._buildArgumentsMapFromArguments(arguments);
    this._loadAdf();
    if (BiBrowserCheck.ie) window.attachEvent("onunload", this._onunload);
    else window.addEventListener("unload", this._onunload, false);
};
_p._findRootPath = function () {
    if (window.BINDOWS_PATH) return new BiUri(location.href, BINDOWS_PATH.replace(/\/$/, "") + "/").toString();
    var els = document.getElementsByTagName("script");
    var l = els.length;
    var p, src;
    var re = /(^|\/)js\/(?:application|bilauncher)\.js$/;
    for (var i = 0; i < l; i++) {
        src = els[i].src;
        if (re.test(src)) {
            p = RegExp.leftContext;
            if (p == "") p = "./";
            else if (p.charAt(p.length - 1) != "/") {
                p += "/";
            }
            return new BiUri(this._uri, p);
        }
    }
    return null;
};
_p._onunload = function () {
    application.dispose();
};
var href = window.location.href;
_p._uri = new BiUri(href);
_p._uriParams = new BiUri(href);
_p._systemRootPath = new BiUri(href, "./");
_p.getPath = function () {
    return this._systemRootPath;
};
_p.getAdfPath = function () {
    if (this._adfPath) return this._adfPath;
    var p = this._uriParams.getParam("Adf");
    return this._adfPath = new BiUri(p, "./");
};
BiApplication.addProperty("progressStatus", BiAccessType.READ_WRITE);
BiApplication.addProperty("window", BiAccessType.READ);
BiApplication.addProperty("adf", BiAccessType.READ);
BiApplication.addProperty("uri", BiAccessType.READ);
_p._accessibilityMode = false;
_p.getAccessibilityManager = function () {
    return null;
};
BiApplication.addProperty("accessibilityMode", BiAccessType.READ);
_p.setAccessibilityMode = function (b) {
    if (!BiBrowserCheck.ie) return;
    var doneStartup = Boolean(this._window);
    if (b && doneStartup && !this._accessibilityMode) {
        this._accessibilityMode = true;
        this._addAccessibilityPackage();
        BiTimer.callOnce(function () {
            this._initAccessibilityForAll(this._window);
        }, 0, this);
    } else this._accessibilityMode = b || this._accessibilityMode && doneStartup; if (b) this._addAccessibilityStyles();
};
_p._initAccessibilityForAll = function (c) {
    c.initAccessibility();
    var children = c.getChildren();
    var l = children.length;
    for (var i = 0; i < l; i++) this._initAccessibilityForAll(children[i]);
};
_p._addAccessibilityStyles = function () {
    var style = "visibility:visible; filter:alpha(opacity=99)";
    application.getThemeManager().addCssRule(".tool-bar .button-hover .bi-button-label", style);
    application.getThemeManager().addCssRule(".tool-bar .button-focus .bi-button-label", style);
    application.getThemeManager().addCssRule(".tool-bar .button-hover-focus .bi-button-label", style);
    application.getThemeManager().addCssRule(".tool-bar .button-active .bi-button-label", style);
    application.getThemeManager().addCssRule(".tool-bar .button-checked .bi-button-label", style);
};
_p._accessibilityDescription = null;
BiApplication.addProperty("accessibilityDescription", BiAccessType.READ_WRITE);
_p._autoNameMapping = false;
BiApplication.addProperty("autoNameMapping", BiAccessType.READ);
_p.setAutoNameMapping = function (b) {
    if (this._autoNameMapping != b) {
        this._autoNameMapping = b;
        this._adf.setAutoNameMapping(b);
    }
};
BiApplication.addProperty("loaderType", BiAccessType.READ_WRITE);
_p._focusOnLoad = true;
_p.getFocusOnLoad = function () {
    return this._focusOnLoad;
};
_p.setFocusOnLoad = function (b) {
    this._focusOnLoad = b;
};
_p._buildArgumentsMapFromArguments = function (oArguments) {
    var adfName = "";
    var adfPath;
    var a0 = oArguments[0];
    if (a0.charAt(a0.length - 1) != "/") a0 += "/";
    this._systemRootPath = String(new BiUri(this._uri, a0));
    var re = /([\w ]+)(?:\.[\w ]+)?(?:$|\?)/;
    var ok = re.test(oArguments[1]);
    if (ok) adfName = RegExp.$1;
    else this._reportError(this._getString("ApplicationIncorrectAdfArgument"));
    adfPath = String(new BiUri(this._uri, oArguments[1]));
    var uri = this._uriParams;
    var l = oArguments.length;
    uri.setParam("AdfName", adfName);
    uri.setParam("Adf", adfPath);
    uri.setParam("Params", l - 2);
    for (var i = 2; i < l; i++) uri.setParam("Param" + (i - 2), oArguments[i]);
};
_p._loadAdf = function () {
    this._progressStatus = this._getString("ApplicationLoadingAdf");
    this.dispatchEvent("progressstatus");
    this._adf.addEventListener("load", this._onAdfLoaded, this);
    var adf = this._uriParams.getParam("Adf");
    if (this._uriParams.getParam("accessibilityMode") == "true") this.setAccessibilityMode(true);
    if (adf != null) this._adf.load(adf);
    else this._reportError(this._getString("ApplicationNoAdf"));
};
_p._onAdfLoaded = function () {
    this._progressStatus = this._getString("ApplicationAdfLoaded");
    this.dispatchEvent("progressstatus");
    if (this._adf.getError()) {
        var xmlHttp = this._adf.getXmlHttp();
        this._reportError(this._getString("ApplicationAdfLoadError"), this._getString("ApplicationAdfLoadErrorDetails", this._uriParams.getParam("Adf"), xmlHttp.status, xmlHttp.statusText));
    } else {
        this._resourceLoader = new BiResourceLoader(this._adf.getScriptLoaderConstructor());
        this._adf._interpret();
        BiTimer.callOnce(this._loadResources, 1, this);
    }
};
_p.getResourceLoader = function () {
    return this._resourceLoader;
};
_p.getResourceById = function (sId) {
    if (this._resourceLoader == null) return null;
    return this._resourceLoader.getResourceById(sId);
};
_p.getComponentById = function (sId) {
    if (this._adf && this._adf.getXmlResourceParser()) return this._adf.getXmlResourceParser().getComponentById(sId);
    return null;
};
_p._loadResources = function () {
    var rl = this._resourceLoader;
    var defaultPackages = this._defaultPackages;
    var l = defaultPackages.length;
    for (var i = 0; i < l; i++) this._addPackage(defaultPackages[i]);
    this._adf._addResources();
    this._addAccessibilityPackage();
    rl.addEventListener("progress", this._onprogressstatus, this);
    rl.addEventListener("error", this._onerror, this);
    rl.addEventListener("load", this._onResourcesLoaded, this);
    this._progressStatus = "Loading Resources";
    rl.load();
};
_p._addAccessibilityPackage = function () {
    if (this._accessibilityMode && !this._508Added) {
        this._addPackage("Accessibility");
        this._508Added = true;
    }
};
_p._addPackage = function (sName) {
    var systemRootPath = this.getPath();
    var files = this.getPackage(sName);
    var l = files.length;
    var rl = this._resourceLoader;
    for (var i = 0; i < l; i++) rl.addResource("script", new BiUri(systemRootPath, files[i]));
};
_p._onprogressstatus = function () {
    var rl = this._resourceLoader;
    var c = rl && rl.getCount();
    if (c) {
        var lc = rl.getLoadedCount();
        this._loadStatus.setValue(Math.max(5, Math.min(95, lc / c * 100)));
        this._progressStatus = this._getString("ApplicationLoadingResources", lc, c);
    } else this._loadStatus.setValue(5);
    this._loadStatus.setText(this.getProgressStatus());
};
_p._onerror = function (e) {
    this._reportError(e.getUserData());
};
_p._onResourcesLoaded = function () {
    this._useTimersWorkAround = BiBrowserCheck.moz && BiBrowserCheck.versionNumber < 1.7;
    this._loadStatus.setText(this._getString("ApplicationLoadingCompleted"));
    this._loadStatus.setValue(100);
    this._window = new BiApplicationWindow;
    this._window._create();
    this.setSpellCheck(this._spellCheck);
    if (this._useTimersWorkAround) {
        BiTimer.callOnce(this._onResourcesLoaded2, 1, this);
    } else this._onResourcesLoaded2();
};
_p._onResourcesLoaded2 = function () {
    this._adf.parseXmlResources();
    this.dispatchEvent("resourcesready");
    if (this._useTimersWorkAround) {
        BiTimer.callOnce(this._onResourcesLoaded3, 1, this);
    } else this._onResourcesLoaded3();
};
_p._onResourcesLoaded3 = function () {
    this.flushLayoutQueue();
    if (this._focusOnLoad) {
        try {
            window.focus();
        } catch (ex) {}
    }
    if (this._useTimersWorkAround) {
        BiTimer.callOnce(this._onResourcesLoaded4, 1, this);
    } else {
        application._onResourcesLoaded4();
    }
};
_p._onResourcesLoaded4 = function () {
    var appClassName = this._uriParams.getParam("AdfName");
    if (window[appClassName] && typeof window[appClassName].main == "function") {
        var uri = this._uriParams;
        var argc = Number(uri.getParam("Params"));
        var argv = new Array(argc);
        for (var i = 0; i < argc; i++) argv[i] = uri.getParam("Param" + i);
        try {
            window[appClassName].main.apply(window[appClassName], argv);
        } catch (e) {
            this._reportError(this._getString("ApplicationErrorInMain", e.message));
            throw e;
        }
    }
    if (application._loadStatus) {
        application._loadStatus.dispose();
        delete application._loadStatus;
    }
    this.dispatchEvent("load");
    this._loaded = true;
    this.flushLayoutQueue();
};
_p._reportError = function (s, s2) {
    if (this._loadStatus) this._loadStatus.setText(s);
    throw new Error(s2 || s);
};
_p.dispose = function () {
    if (this._disposed) return;
    this.dispatchEvent("dispose");
    if (BiBrowserCheck.ie) window.detachEvent("onunload", this._onunload);
    else window.removeEventListener("unload", this._onunload, false);
    this.disposeFields("_window", "_adfPath", "_systemRootPath", "_themeManager", "_focusManager", "_loadStatus", "_resourceLoader", "_adf", "_inactivityTimeout", "_uri", "_uriParams");
    BiEventTarget.prototype.dispose.call(this);
    application = null;
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
    case "defaultPackages":
        this.setProperty(sName, sValue.split(/\s*,\s*/));
        break;
    default:
        BiEventTarget.prototype.setAttribute.apply(this, arguments);
    }
};
_p.flushLayoutQueue = function () {
    if (typeof BiComponent == BiObject.TYPE_FUNCTION) {
        BiComponent.flushLayoutQueue();
    }
};
_p.getThemeManager = function () {
    if (!this._themeManager) {
        this._themeManager = new BiThemeManager;
    }
    return this._themeManager;
};
_p.getTheme = function () {
    return this.getThemeManager().getDefaultTheme();
};
_p.getFocusManager = function () {
    if (!this._focusManager) {
        this._focusManager = new BiFocusManager;
    }
    return this._focusManager;
};
BiApplication.addProperty("inactivityTimeout", BiAccessType.READ);
_p.setInactivityTimeout = function (n) {
    n = Number(n) || 0;
    if (this._inactivityTimeout != n) {
        this._inactivityTimeout = n;
        if (!this._inactivityTimer) {
            this._inactivityTimer = new BiTimer;
            this._inactivityTimer.addEventListener("tick", function (e) {
                this._inactivityTimer.stop();
                this.dispatchEvent("inactive");
            }, this);
        }
        this._inactivityTimer.setInterval(60000 * n);
        if (n > 0) this._inactivityTimer.start();
        else this._inactivityTimer.stop();
    }
};
_p.restartInactivityTimer = function () {
    if (this._inactivityTimer && this._inactivityTimeout > 0) {
        this._inactivityTimer.start();
    }
};
_p._setSpellCheck = function (bOn) {
    application.getWindow()._setHtmlAttribute("spellcheck", bOn);
};
_p.setSpellCheck = function (bOn) {
    this._spellCheck = bOn;
    var appWin = application.getWindow();
    if (appWin && appWin._created) this._setSpellCheck(bOn);
};
_p.getSpellCheck = function () {
    return this._spellCheck;
};
_p._defaultPackages = ["Core", "Gui", "XmlRpc", "Grid", "TreeView"];
_p.getPackage = function (sName) {
    if (sName in this._packages) return this._packages[sName];
    return [];
};
_p.getPackages = function () {
    return Object.getKeys(this._packages);
};
_p.addPackage = function (sName, oFiles) {
    this._packages[sName] = oFiles;
};
BiApplication.addProperty("defaultPackages", BiAccessType.READ_WRITE);
BiApplication.addProperty("stringBundle", BiAccessType.READ_WRITE);
_p._getString = function (s) {
    var o = this._stringBundle;
    return o.getFormattedString.apply(o, arguments);
};
_p._stringBundle = new BiStringBundle;
_p._stringBundle.addBundle("en", {
    ApplicationIncorrectAdfArgument: "The ADF argument is incorrect",
    ApplicationLoadingAdf: "Loading Application Description File",
    ApplicationNoAdf: "No ADF specified",
    ApplicationAdfLoaded: "Application Description File Loaded",
    ApplicationAdfLoadError: "Error loading ADF",
    ApplicationAdfLoadErrorDetails: "Error loading ADF\nURI: %1\nStatus: %2, %3",
    ApplicationLoadingResources: "加载资源 (%1/%2)",
    ApplicationLoadingCompleted: "加载完成",
    ApplicationErrorInMain: "应用程序错误: %1"
});
_p._keyBundle = new BiKeyBundle();
application = new BiApplication;
application._keyBundle._bundle = {
    keystrokes: {
        "prevented.inlinefind": "ctrl+f",
        "window.next": ["ctrl+tab", "ctrl+page_up"],
        "window.previous": ["shift+ctrl+tab", "ctrl+page_down"],
        "window.close": ["ctrl+w", "ctrl+F4"],
        "window.iconmenu": "ctrl+alt+space",
        "window.menu": ["ctrl+alt", "F10"],
        "tree.expand": "right",
        "tree.collapse": "left",
        "tree.edit": "F2",
        "olap.up": "shift+enter",
        "olap.down": "enter",
        "olap.left": "shift+tab",
        "olap.right": "tab",
        "popup.close": "esc",
        "popup.toggle": ["alt+up", "alt+down", "F4"],
        "controls.accept": "enter",
        "controls.toggle": "space",
        "controls.cancel": "esc",
        "controls.action": ["space", "enter"],
        "focus.next": "tab",
        "focus.previous": "shift+tab",
        "focus.movein": "ctrl+F6",

        "focus.moveout": "shift+ctrl+F6",
        "selection.all": "ctrl+a",
        "selection.toggle": ["ctrl+space", "space"],
        "selection.topleft": "ctrl+home",
        "selection.bottomright": "ctrl+end",
        "selection.first": "home",
        "selection.last": "end",
        "selection.page.previous": "page_up",
        "selection.page.next": "page_down",
        "selection.up": "up",
        "selection.down": "down",
        "selection.left": "left",
        "selection.right": "right"
    },
    modifiers: {
        "menu.accesskey": "alt",
        "menu.itemaccesskey": "",
        "drag.alias": ["shift+ctrl", "alt"],
        "drag.copy": ["shift+alt", "ctrl"],
        "drag.move": "shift",
        "selection.contiguous": ["shift", "shift+ctrl"],
        "selection.preserved": ["ctrl", "shift+ctrl"],
        "selection.leaditem": "ctrl"
    },
    macOverrides: {
        keystrokes: {
            "prevented.inlinefind": "cmd+f",
            "selection.all": "cmd+a",
            "selection.first": "cmd+left",
            "selection.last": "cmd+right"
        },
        modifiers: {
            "drag.alias": ["cmd+option", "shift+cmd+option", "ctrl+cmd+option", "shift+ctrl+cmd+option"],
            "drag.copy": ["option", "shift+option", "ctrl+option", "shift+ctrl+option"],
            "drag.move": ["cmd", "shift+cmd", "ctrl+cmd", "shift+ctrl+cmd"],
            "selection.contiguous": ["shift", "shift+cmd"],
            "selection.preserved": ["cmd", "shift+cmd"]
        }
    }
};
application._keyBundle._applyMacOverrides();
application._packages = {
    Core: [BiBrowserCheck.ie ? 'js/core.ie.js' : 'js/core.js'],
    XmlRpc: ['js/xmlrpc.js'],
    Gui: ['js/gui1.js', BiBrowserCheck.ie ? 'js/gui2.ie.js' : 'js/gui2.js', 'js/gui3.js'],
    Grid: ['js/grids.js'],
    TreeView: ['js/treeview.js'],
    Charting: [BiBrowserCheck.ie ? 'js/charting.ie.js' : 'js/charting.js'],
    WebService2: ['js/webservice2.js'],
    OlapGrid: ['js/olapgrid.js'],
    Loaders: ['js/loaders.js'],
    Gauge2: [BiBrowserCheck.ie ? 'js/gauge2.ie.js' : 'js/gauge2.js'],
    Animation: ['js/animation.js'],
    Accessibility: BiBrowserCheck.ie ? ['js/accessibility.ie.js'] : []
};