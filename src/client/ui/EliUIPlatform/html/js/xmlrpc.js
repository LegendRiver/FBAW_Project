/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiBase64(sBase64Data) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._base64 = sBase64Data;
    this._text = null;
};
_p = _biExtend(BiBase64, BiObject, "BiBase64");
_p.getBase64 = function () {
    if (this._base64 != null) return this._base64;
    else return this._base64 = BiBase64.encode(this._text);
};
_p.setBase64 = function (sBase64Data) {
    this._base64 = sBase64Data;
    this._text = null;
};
_p.getText = function () {
    if (this._text != null) return this._text;
    else return this._text = BiBase64.decode(this._base64);
};
_p.setText = function (sText) {
    this._base64 = null;
    this._text = sText;
};
BiBase64._base64String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
BiBase64._reversedBase64 = (function () {
    var s = BiBase64._base64String;
    var r = {};
    for (var i = 0; i < s.length; i++) r[s.charAt(i)] = i;
    return r;
})();
BiBase64._getIndexOf = function (s) {
    return BiBase64._reversedBase64[s];
};
BiBase64.encode = function (ds) {
    var bits, dual;
    var sb = [];
    var b64s = BiBase64._base64String;
    var i = 0;
    while (ds.length >= i + 3) {
        bits = (ds.charCodeAt(i++) & 0xff) << 16 | (ds.charCodeAt(i++) & 0xff) << 8 | ds.charCodeAt(i++) & 0xff;
        sb.push(b64s.charAt((bits & 0x00fc0000) >> 18), b64s.charAt((bits & 0x0003f000) >> 12), b64s.charAt((bits & 0x00000fc0) >> 6), b64s.charAt((bits & 0x0000003f)));
    }
    if (ds.length - i > 0 && ds.length - i < 3) {
        dual = Boolean(ds.length - i - 1);
        bits = ((ds.charCodeAt(i++) & 0xff) << 16) | (dual ? (ds.charCodeAt(i) & 0xff) << 8 : 0);
        sb.push(b64s.charAt((bits & 0x00fc0000) >> 18), b64s.charAt((bits & 0x0003f000) >> 12), (dual ? b64s.charAt((bits & 0x00000fc0) >> 6) : '='), '=');
    }
    return sb.join("");
};
BiBase64.decode = function (es) {
    var bits;
    var sb = [];
    var i = 0;
    for (; i < es.length; i += 4) {
        bits = (BiBase64._getIndexOf(es.charAt(i)) & 0xff) << 18 | (BiBase64._getIndexOf(es.charAt(i + 1)) & 0xff) << 12 | (BiBase64._getIndexOf(es.charAt(i + 2)) & 0xff) << 6 | BiBase64._getIndexOf(es.charAt(i + 3)) & 0xff;
        sb.push(String.fromCharCode((bits & 0xff0000) >> 16, (bits & 0xff00) >> 8, bits & 0xff));
    }
    var ds = sb.join("");
    if (es.charCodeAt(i - 2) == 61) return ds.substring(0, ds.length - 2);
    else if (es.charCodeAt(i - 1) == 61) return ds.substring(0, ds.length - 1);
    else return ds;
};

function BiXmlRpcInt(n) {
    if (_biInPrototype) return;
    this._value = Math.floor(Number(n));
}
_p = _biExtend(BiXmlRpcInt, Number, "BiXmlRpcInt");
_p.valueOf = function () {
    return this._value;
};

function BiXmlRpcDouble(n) {
    if (_biInPrototype) return;
    this._value = Number(n);
}
_p = _biExtend(BiXmlRpcDouble, Number, "BiXmlRpcDouble");
_p.valueOf = function () {
    return this._value;
};

function BiXmlRpc(oUri) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    if (oUri) this.setUri(oUri);
};
_p = _biExtend(BiXmlRpc, BiEventTarget, "BiXmlRpc");
BiXmlRpc.MAX_INT = 4294967296;
BiXmlRpc.getJsType = function (v) {
    switch (typeof v) {
    case "number":
        if (v == Math.floor(v) && v < BiXmlRpc.MAX_INT) return "int";
        return "double";
    case "object":
        if (v.constructor == Date) return "dateTime.iso8601";
        if (v.constructor == Array) return "array";
        else if (v instanceof BiXmlRpcDouble) return "double";
        else if (v instanceof BiBase64) return "base64";
        else return "struct";
    default:
        return typeof v;
    }
};
BiXmlRpc.jsDateToIso8601 = function (d) {
    function pz(n) {
        return n > 9 ? String(n) : "0" + n;
    }
    return d.getFullYear() + pz(d.getMonth() + 1) + pz(d.getDate()) + "T" + pz(d.getHours()) + ":" + pz(d.getMinutes()) + ":" + pz(d.getSeconds());
};
BiXmlRpc.iso8601ToJsDate = function (s) {
    var d = new Date;
    d.setFullYear(s.substring(0, 4), s.substring(4, 6) - 1, s.substring(6, 8));
    d.setHours(s.substring(9, 11), s.substring(12, 14), s.substring(15, 17), 0);
    return d;
};
BiXmlRpc.xmlNodeToJs = function (n) {
    var l, i;
    if (n.nodeType == 3) return n.data;
    switch (n.tagName) {
    case "string":
        return n.text ? n.text : n.nodeValue;
    case "boolean":
        return (n.text ? n.text : n.nodeValue) == "1";
    case "int":
    case "i4":
    case "double":
        return Number(n.text ? n.text : n.nodeValue);
    case "dateTime.iso8601":
        return BiXmlRpc.iso8601ToJsDate(n.text ? n.text : n.nodeValue);
    case "array":
        var items = BiXmlRpc._getFirstChildElement(n).childNodes;
        l = items.length;
        var res = [];
        for (i = 0; i < l; i++) {
            if (items[i].nodeType == 1) res.push(BiXmlRpc.xmlValueNodeToJs(items[i]));
        }
        return res;
    case "struct":
        var members = n.childNodes;
        l = members.length;
        var o = {};
        var nameEl, name, valueEl, value;
        for (i = 0; i < l; i++) {
            if (members[i].nodeType == 1) {
                nameEl = BiXmlRpc._getFirstChildElement(members[i]);
                name = nameEl.text ? nameEl.text : nameEl.nodeValue;
                valueEl = BiXmlRpc._getLastChildElement(members[i]);
                value = BiXmlRpc.xmlValueNodeToJs(valueEl);
                o[name] = value;
            }
        }
        return o;
    case "base64":
        return new BiBase64(n.text ? n.text : n.nodeValue);
    default:
        return undefined;
    }
};
BiXmlRpc.xmlValueNodeToJs = function (n) {
    var c = BiXmlRpc._getFirstChildElement(n) || n.firstChild;
    if (c) return BiXmlRpc.xmlNodeToJs(c);
    return "";
};
BiXmlRpc.jsToXmlNode = function (v, doc) {
    var el;
    switch (BiXmlRpc.getJsType(v)) {
    case "string":
        el = doc.createElement("string");
        el.appendChild(doc.createTextNode(v));
        return el;
    case "boolean":
        el = doc.createElement("boolean");
        el.appendChild(doc.createTextNode(v ? 1 : 0));
        return el;
    case "int":
        el = doc.createElement("int");
        el.appendChild(doc.createTextNode(v));
        return el;
    case "double":
        el = doc.createElement("double");
        if (Math.floor(v) == v) v = v + ".0";
        el.appendChild(doc.createTextNode(v.toString()));
        return el;
    case "dateTime.iso8601":
        el = doc.createElement("dateTime.iso8601");
        el.appendChild(doc.createTextNode(BiXmlRpc.jsDateToIso8601(v)));
        return el;
    case "array":
        el = doc.createElement("array");
        var data = doc.createElement("data");
        el.appendChild(data);
        var l = v.length;
        for (var i = 0; i < l; i++) data.appendChild(BiXmlRpc.jsToXmlValueNode(v[i], doc));
        return el;
    case "struct":
        el = doc.createElement("struct");
        for (var p in v) el.appendChild(BiXmlRpc.jsFieldToXmlMemberNode(p, v[p], doc));
        return el;
    case "base64":
        el = doc.createElement("base64");
        el.appendChild(doc.createTextNode(v.getBase64()));
        return el;
    }
    throw new Error("Unknown javascript type");
};
BiXmlRpc.jsToXmlValueNode = function (v, doc) {
    var value = doc.createElement("value");
    value.appendChild(BiXmlRpc.jsToXmlNode(v, doc));
    return value;
};
BiXmlRpc.jsFieldToXmlMemberNode = function (sName, v, doc) {
    var member = doc.createElement("member");
    var name = doc.createElement("name");
    name.appendChild(doc.createTextNode(sName));
    var value = BiXmlRpc.jsToXmlValueNode(v, doc);
    member.appendChild(name);
    member.appendChild(value);
    return member;
};
BiXmlRpc.makeXmlRpcMessage = function (sMethodName, args) {
    if (!args) args = [];
    var doc = BiXmlDocument.create();
    doc.loadXML("<?xml version=\"1.0\"?>\n" + "<methodCall/>");
    var methodCall = doc.documentElement;
    var methodName = doc.createElement("methodName");
    methodName.appendChild(doc.createTextNode(sMethodName));
    methodCall.appendChild(methodName);
    var params = doc.createElement("params");
    methodCall.appendChild(params);
    var param;
    for (var i = 0; i < args.length; i++) {
        param = doc.createElement("param");
        param.appendChild(BiXmlRpc.jsToXmlValueNode(args[i], doc));
        params.appendChild(param);
    }
    return doc;
};
BiXmlRpc.parseXmlRpcResponse = function (doc) {
    var value = doc.selectSingleNode("/methodResponse/params/param/value");
    if (value) return BiXmlRpc.xmlValueNodeToJs(value, doc);
    var faultValue = doc.selectSingleNode("/methodResponse/fault/value");
    if (faultValue) {
        var errorStruct = BiXmlRpc.xmlValueNodeToJs(faultValue);
        throw new BiXmlRpcError(errorStruct.faultString, errorStruct.faultCode, true);
    }
    throw new BiXmlRpcError("Invalid XML document returned from XML-RPC server");
};
BiXmlRpc._getFirstChildElement = function (p) {
    var c = p.firstChild;
    while (c) {
        if (c.nodeType == 1) return c;
        c = c.nextSibling;
    }
    return null;
};
BiXmlRpc._getLastChildElement = function (p) {
    var c = p.lastChild;
    while (c) {
        if (c.nodeType == 1) return c;
        c = c.previousSibling;
    }
    return null;
};
_p._async = true;
_p._uri = null;
BiXmlRpc.addProperty("uri", BiAccessType.READ);
_p.setUri = function (oUri) {
    if (oUri instanceof BiUri) this._uri = oUri;
    else this._uri = new BiUri(application.getAdfPath(), oUri);
};
_p.useService = function (oUri) {
    this.setUri(oUri);
};
BiXmlRpc.addProperty("async", BiAccessType.READ_WRITE);
BiXmlRpc.addProperty("user", BiAccessType.READ_WRITE);
BiXmlRpc.addProperty("password", BiAccessType.READ_WRITE);
_p.getLoading = function () {
    return Boolean(this._xmlLoader && this._xmlLoader.getLoading());
};
_p.getLoaded = function () {
    return Boolean(this._xmlLoader && this._xmlLoader.getLoaded());
};
BiXmlRpc.addProperty("xmlLoader", BiAccessType.READ);
_p.callMethod = function (sMethodName, oArg) {
    var args = [];
    for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
    return this._invoke(sMethodName, this._async, args);
};
_p.syncInvoke = function (sMethodName, oArg) {
    var args = [];
    for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
    return this._invoke(sMethodName, false, args);
};
_p.asyncInvoke = function (sMethodName, oArg) {
    var args = [];
    for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
    this._invoke(sMethodName, true, args);
};
_p._invoke = function (sMethodName, bAsync, oArgs) {
    delete this._cachedResponse;
    if (this._xmlLoader) this._xmlLoader.dispose();
    this._xmlLoader = new BiXmlLoader;
    this._xmlLoader.open("POST", String(this._uri), bAsync, this._user, this._password);
    this._xmlLoader._xmlHttp.setRequestHeader("Content-Type", "text/xml");
    if (bAsync) this._xmlLoader.addEventListener("load", this._onMethodCallLoad, this);
    var doc = BiXmlRpc.makeXmlRpcMessage(sMethodName, oArgs);
    this._xmlLoader.send(doc);
    if (!bAsync) return this.getResult();
};
_p.getResult = function () {
    if (this._xmlLoader) {
        if (this._xmlLoader.getError() || !this._xmlLoader.getDocument()) throw new BiXmlRpcError("Failed to load XML-RPC response");
        if (this._cachedResponse == null) this._cachedResponse = BiXmlRpc.parseXmlRpcResponse(this._xmlLoader.getDocument());
        return this._cachedResponse;
    }
    throw new Error("Can only get the result after the XML-RPC client has loaded the response");
};
_p._onMethodCallLoad = function (e) {
    this.dispatchEvent("load");
    e = new BiXmlRpcCallCompleteEvent("callcomplete", this);
    this.dispatchEvent(e);
    e.dispose();
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiEventTarget.prototype.dispose.call(this);
    if (this._xmlLoader) this._xmlLoader.dispose();
    this._xmlLoader = null;
    delete this._cachedResponse;
};

function BiXmlRpcError(sMessage, nCode, bServerGenerated) {
    if (_biInPrototype) return;
    Error.call(this, sMessage);
    this.faultString = this.message = this.description = sMessage;
    this.faultCode = nCode;
    this._serverGenerated = Boolean(bServerGenerated);
};
_p = _biExtend(BiXmlRpcError, Error, "BiXmlRpcError");
_p.toString = function () {
    return this.message;
};
_p.getFaultCode = function () {
    return this.faultCode;
};
_p.getFaultString = function () {
    return this.message;
};
BiXmlRpcError.addProperty("serverGenerated", BiAccessType.READ);

function BiXmlRpcCallCompleteEvent(sType, oXmlRpc) {
    if (_biInPrototype) return;
    BiEvent.call(this, sType);
    this._xmlRpc = oXmlRpc;
}
_p = _biExtend(BiXmlRpcCallCompleteEvent, BiEvent, "BiXmlRpcCallCompleteEvent");
_p.getResult = function () {
    try {
        return this._xmlRpc.getResult();
    } catch (ex) {
        return null;
    }
};
_p.getErrorObject = function () {
    try {
        this._xmlRpc.getResult();
        return null;
    } catch (ex) {
        return ex;
    }
};
_p.getError = function () {
    return Boolean(this.getErrorObject());
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiEvent.prototype.dispose.call(this);
    this._xmlRpc = null;
};