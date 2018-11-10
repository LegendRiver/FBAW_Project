/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiSerializedLoader() {
    if (_biInPrototype) return;
    BiAbstractLoader.call(this);
    this._items = [];
    this._next = 0;
}
_p = _biExtend(BiSerializedLoader, BiAbstractLoader, "BiSerializedLoader");
_p.add = function (oLoader) {
    if (oLoader instanceof BiAbstractLoader) {
        this._items.push(oLoader);
    } else {}
};
BiSerializedLoader.addProperty("loading", BiAccessType.READ);
BiSerializedLoader.addProperty("loaded", BiAccessType.READ);
BiSerializedLoader.addProperty("error", BiAccessType.READ);
_p._onItemLoad = function (e) {
    var l = this._items[this._next - 1];
    if (l.getError()) {
        this._dispatchError();
    } else {
        this.dispatchEvent("progress");
        this._loadNext();
    }
};
_p._loadNext = function () {
    if (this._next >= this._items.length) {
        this._onAllLoaded();
        return;
    }
    var o = this._items[this._next++];
    if (o.getError()) {
        this._dispatchError();
    } else if (o.getLoaded()) {
        this._onItemLoad();
    } else if (!o.getLoading()) {
        o.addEventListener("load", this._onItemLoad, this);
        o.load();
    }
};
_p._dispatchError = function () {
    this._loaded = this._error = true;
    this._loading = false;
    this.abort();
    this.dispatchEvent("load");
};
_p.abort = function () {
    for (var i = 0, item; item = this._items[i]; i++) {
        item.removeEventListener("load", this._onItemLoad, this);
        item.abort();
    }
    this._loading = this._loaded = false;
};
_p.dispose = function () {
    if (this._disposed) return;
    for (var i = 0, item; item = this._items[i]; i++) {
        item.removeEventListener("load", this._onItemLoad, this);
    }
    BiAbstractLoader.prototype.dispose.call(this);
    this.disposeFields("_items", "_loaded", "_loading");
};
_p.load = function () {
    this._loaded = this._error = false;
    this._loading = true;
    this._loadNext();
};
_p._onAllLoaded = function () {
    this._loading = this._error = false;
    this._loaded = true;
    this.dispatchEvent("load");
};
_p.getCount = function () {
    return this._items.length;
};
_p.getLoadedCount = function () {
    return this._next;
};

function BiObjectLoader(oNode) {
    if (_biInPrototype) return;
    BiAbstractLoader.call(this);
    if (oNode) {
        this.setNode(oNode);
    }
}
_p = _biExtend(BiObjectLoader, BiAbstractLoader, "BiObjectLoader");
BiObjectLoader.addProperty("object", BiAccessType.READ);
BiObjectLoader.addProperty("node", BiAccessType.READ_WRITE);
BiObjectLoader.addProperty("autoNameMapping", BiAccessType.READ_WRITE);
_p.load = function () {
    var p = new BiXmlResourceParser;
    p.setRootNode(this._node);
    p.setAutoNameMapping(this._autoNameMapping);
    p._addObject = function (o, id) {
        this._componentsById.add(id, o);
        if (this._autoNameMapping) {
            window[id] = o;
        }
        var orgDispose = o.dispose;
        var oResParser = this;
        o.dispose = function () {
            if (oResParser && !oResParser.getDisposed()) oResParser._removeObject(this);
            if (this.__resParser) {
                this.__resParser.dispose();
                delete this.__resParser;
            }
            if (orgDispose) orgDispose.call(this);
            orgDispose = null;
            oResParser = null;
        };
    };
    try {
        var o = p.fromNode(this._node);
    } catch (ex) {
        this._error = true;
        this.dispatchEvent("load");
        throw ex;
    }
    this._object = o;
    o.__resParser = p;
    o.getComponentById = function (sId) {
        return this.__resParser._componentsById.item(sId);
    };
    if (o instanceof BiAbstractLoader) {
        if (o.getLoaded() || o.getError()) {
            this.dispatchEvent("load");
        } else {
            o.addEventListener("load", this._onload, this);
            if (!o.getLoading()) {
                o.setAsync(this.getAsync());
                o.load();
            }
        }
    } else {
        this.dispatchEvent("load");
    }
    p = null;
};
_p._onload = function () {
    this.dispatchEvent("load");
};
_p.getLoaded = function () {
    if (this._object) {
        if (this._object instanceof BiAbstractLoader) {
            return this._object.getLoaded();
        }
        return true;
    }
    return false;
};
_p.getLoading = function () {
    if (this._object) {
        if (this._object instanceof BiAbstractLoader) {
            return this._object.getLoading();
        }
        return false;
    }
    return false;
};
_p.getError = function () {
    if (this._error) return this._error;
    if (this._object) {
        if (this._object instanceof BiAbstractLoader) {
            return this._object.getError();
        }
        return false;
    }
    return false;
};
_p.abort = function () {
    if (this._object && this._object instanceof BiAbstractLoader) {
        this._object.abort();
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiAbstractLoader.prototype.dispose.call(this);
    this.disposeFields("_node", "_autoNameMapping");
    delete this._object;
};

function BiJsonLoader() {
    if (_biInPrototype) return;
    BiTextLoader.call(this);
}
_p = _biExtend(BiJsonLoader, BiTextLoader, "BiJsonLoader");
BiJsonLoader.addProperty("errorObject", BiAccessType.READ);
BiJsonLoader.load = function (oUri) {
    var l = new BiJsonLoader();
    l.setAsync(false);
    l.load(oUri);
    var d = l.getData();
    l.dispose();
    return d;
};
_p.getData = function () {
    return !this.getError() && this.getLoaded() ? this._data : null;
};
_p.getError = function () {
    return BiTextLoader.prototype.getError.call(this) || this._error;
};
_p._onload = function () {
    if (!BiTextLoader.prototype.getError.call(this)) {
        try {
            this._data = BiJson.deserialize(this.getText());
            delete this._errorObject;
            delete this._error;
        } catch (ex) {
            this._errorObject = ex;
            this._error = true;
        }
    }
    BiTextLoader.prototype._onload.call(this);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiTextLoader.prototype.dispose.call(this);
    delete this._data;
    delete this._errorObject;
    delete this._error;
};

function BiResources() {
    if (_biInPrototype) return;
    BiSerializedLoader.call(this);
}
_p = _biExtend(BiResources, BiSerializedLoader, "BiResources");
_p.addXmlNode = function (n, p) {
    if (n.nodeType == 1) {
        this.add(new BiObjectLoader(n));
    }
};

function BiScript() {
    if (_biInPrototype) return;
    BiAbstractLoader.call(this);
}
_p = _biExtend(BiScript, BiAbstractLoader, "BiScript");
_p._async = false;
BiScript.addProperty("text", BiAccessType.READ_WRITE);
BiScript.addProperty("uri", BiAccessType.READ_WRITE);
_p._onload = function () {
    this.dispatchEvent("load");
};
_p.getSrc = function () {
    return this.getUri();
};
_p.setSrc = function (s) {
    return this.setUri(s);
};
_p.load = function () {
    if (this._uri) {
        if (this._scriptLoader) {
            this._scriptLoader.dispose();
        }
        var sl = this._scriptLoader = new BiScriptLoader;
        sl.addEventListener("load", this._onload, this);
        sl.setAsync(this.getAsync());
        sl.setUri(this._uri);
        sl.load();
    } else if (this._text) {
        try {
            this._error = false;
            BiScriptLoader.execScript(this._text, this.getSrc());
        } catch (ex) {
            this._error = true;
        }
        this._loaded = true;
        this._loading = false;
    }
};
_p.getLoaded = function () {
    if (this._scriptLoader) {
        return this._scriptLoader.getLoaded();
    }
    return this._loaded;
};
_p.getLoading = function () {
    if (this._scriptLoader) {
        return this._scriptLoader.getLoading();
    }
    return this._loading;
};
_p.getError = function () {
    if (this._scriptLoader) {
        return this._scriptLoader.getError();
    }
    return this._error;
};
_p.abort = function () {
    if (this._scriptLoader) {
        this._scriptLoader.abort();
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiAbstractLoader.prototype.dispose.call(this);
    this.disposeFields("_scriptLoader", "_text");
};
_p.addXmlNode = function (n, p) {
    this.setText(n.text);
};

function BiScriptLoader() {
    if (_biInPrototype) return;
    BiAbstractLoader.call(this);
    var self = this;
    this.__handleEvent = function (e) {
        self._handleEvent(e || window.event);
    };
}
_p = _biExtend(BiScriptLoader, BiAbstractLoader, "BiScriptLoader");
_p._supportsSync = true;
_p._ieDebug = false;
BiScriptLoader.addProperty("uri", BiAccessType.READ);
_p.setUri = function (oUri) {
    if (oUri instanceof BiUri) {
        this._uri = oUri;
    } else {
        this._uri = new BiUri(application.getAdfPath(), oUri);
    }
};
_p.load = function (oUri) {
    if (oUri) {
        this.setUri(oUri);
    }
    this._disposeLoader();
    if (this._async) {
        var el = document.createElement("script");
        el.type = "text/javascript";
        this._element = el;
        el.onload = el.onerror = el.onreadystatechange = this.__handleEvent;
        el.src = String(this.getUri());
        document.getElementsByTagName("head")[0].appendChild(el);
    } else {
        var tl = this._textLoader = new BiTextLoader;
        tl.setUri(String(this.getUri()));
        tl.addEventListener("load", this._onload, this);
        tl.load();
    }
};
_p.abort = function () {
    if (this._async && this._loading) {
        this._element.parentNode.removeChild(this._element);
    } else if (this._textLoader) {
        this._textLoader.abort();
    }
    this._disposeLoader();
    this._error = this._loading = this._loaded = false;
};
_p.getLoaded = function () {
    if (this._async) {
        return this._loaded;
    } else {
        return Boolean(this._textLoader) && this._textLoader.getLoaded();
    }
};
_p.getLoading = function () {
    if (this._async) {
        return this._loading;
    } else {
        return Boolean(this._textLoader) && this._textLoader.getLoading();
    }
};
_p.getError = function () {
    if (this._async) {
        return this._error;
    } else {
        return this._error || Boolean(this._textLoader) && this._textLoader.getError();
    }
};
_p._disposeLoader = function () {
    var el = this._element;
    if (el) {
        el.onload = el.onerror = el.onreadystatechange = null;
        delete this._element;
    }
    this.disposeFields("_textLoader");
};
_p.dispose = function () {
    if (this._disposed) return;
    this._disposeLoader();
    BiAbstractLoader.prototype.dispose.call(this);
    this.disposeFields("_loaded", "_loading", "_error", "__handleEvent");
};
_p._handleEvent = function (e) {
    if (typeof e == "string") {
        this._onerror();
    } else {
        switch (e.type) {
        case "load":
            this._onload();
            break;
        case "readystatechange":
            var el = this._element;
            if (el) {
                var rs = el.readyState;
                if (rs == "complete") {
                    this._onload();
                } else if (rs == "loaded") {
                    if (this._ieDebug) {
                        this._ieDebug404();
                    } else {
                        this._onload();
                    }
                } else if (this._ieDebug && rs == "loading") {
                    this._ieDebug404();
                }
            }
            break;
        }
    }
};
_p._ieDebug404 = function () {
    if (!this._textLoader) {
        this._textLoader = new BiTextLoader;
        this._textLoader.open("HEAD", String(this.getUri()), true);
        this._textLoader.addEventListener("load", function (e) {
            var req = e.getTarget();
            if (req.getError()) {
                this._onerror();
            } else {
                this._onload();
            }
        }, this);
        this._textLoader.send(null);
    }
};
_p._onload = function () {
    if (!this._async) {
        BiScriptLoader.execScript(this._textLoader.getText());
    }
    this._loading = this._error = false;
    this._loaded = true;
    this.dispatchEvent("load");
    this._disposeLoader();
};
_p._onerror = function () {
    this._loading = false;
    this._loaded = this._error = true;
    this.dispatchEvent("load");
    this._disposeLoader();
};
BiScriptLoader.execScript = function (s) {
    if (!s) return;
    var el = document.createElement("script");
    el.type = "text/javascript";
    if (BiBrowserCheck.ie) {
        el.text = s;
    } else {
        el.innerHTML = s;
    }
    document.getElementsByTagName("head")[0].appendChild(el);
};

function BiCssLoader() {
    if (_biInPrototype) return;
    BiAbstractLoader.call(this);
    var self = this;
    this.__handleEvent = function (e) {
        self._handleEvent(e || window.event);
    };
}
_p = _biExtend(BiCssLoader, BiAbstractLoader, "BiCssLoader");
_p._supportsSync = false;
BiCssLoader.addProperty("uri", BiAccessType.READ);
_p.setUri = function (oUri) {
    if (oUri instanceof BiUri) {
        this._uri = oUri;
    } else {
        this._uri = new BiUri(application.getAdfPath(), oUri);
    }
};
_p.load = function (oUri) {
    if (oUri) {
        this.setUri(oUri);
    }
    this._disposeLoader();
    if (this._async) {
        var el = document.createElement("link");
        el.rel = "stylesheet";
        el.type = "text/css";
        this._element = el;
        el.onload = el.onerror = this.__handleEvent;
        el.href = String(this.getUri());
        document.getElementsByTagName("head")[0].appendChild(el);
        if (BiBrowserCheck.quirks.noLoadEventFromLinkElement) {
            this._mozLoadTimer = new BiTimer(50);
            this._mozLoadTimer.addEventListener("tick", this._mozLoadPoll, this);
            this._mozLoadTimer.start();
        }
    } else {
        throw new Error("BiCssLoader only supports asynchronous loading");
    }
};
_p.abort = function () {
    if (this._loading) {
        this._element.parentNode.removeChild(this._element);
    }
    this._disposeLoader();
    this._error = this._loading = this._loaded = false;
};
_p.getLoaded = function () {
    return this._loaded;
};
_p.getLoading = function () {
    return this._loading;
};
_p.getError = function () {
    return this._error;
};
_p._disposeLoader = function () {
    var el = this._element;
    if (el) {
        el.onload = el.onerror = null;
    }
    delete this._element;
};
_p.dispose = function () {
    if (this._disposed) return;
    this._disposeLoader();
    BiAbstractLoader.prototype.dispose.call(this);
    this.disposeFields("_loaded", "_loading", "_error", "__handleEvent");
};
_p._handleEvent = function (e) {
    if (typeof e == "string") {
        this._onerror();
    } else {
        switch (e.type) {
        case "load":
            this._onload();
            break;
        }
    }
};
_p._onload = function () {
    this._loading = this._error = false;
    this._loaded = true;
    this.dispatchEvent("load");
    this._disposeLoader();
};
_p._onerror = function () {
    this._loading = false;
    this._loaded = this._error = true;
    this.dispatchEvent("load");
    this._disposeLoader();
};
BiCssLoader._haslinkEl = function (oUri) {
    if (!this._foundlinks) {
        this._foundlinks = {};
    }
    var sUri;
    if (oUri instanceof BiUri) {
        sUri = String(oUri);
    } else {
        sUri = String(new BiUri(application.getAdfPath(), oUri));
    } if (sUri in this._foundlinks) {
        return true;
    }
    var links = document.getElementsByTagName("link");
    var l = links.length;
    for (var i = 0; i < l; i++) {
        if ("text/css" == links[i].type && links[i].href) {
            if (!links[i]._uri) {
                links[i]._uri = String(new BiUri(application.getPath(), links[i].href));
                this._foundlinks[links[i]._uri] = true;
            }
            if (links[i]._uri == sUri) {
                return true;
            }
        }
    }
    return false;
};
_p._mozLoadPoll = function (e) {
    try {
        if (this._element.sheet.cssRules.length > 0) {
            this._stopMozLoadPoll();
        }
    } catch (ex) {
        this._stopMozLoadPoll();
    }
};
_p._stopMozLoadPoll = function () {
    this._mozLoadTimer.stop();
    this.disposeFields("_mozLoadTimer");
    this._onload();
};
BiCssLoader.addCss = function (s) {
    if (BiBrowserCheck.ie) {
        var ss = document.createStyleSheet();
        ss.cssText = s;
    } else {
        var el = document.createElement("style");
        el.type = "text/css";
        el.innerHTML = s;
        document.getElementsByTagName("head")[0].appendChild(el);
    }
};

function BiImageLoader() {
    if (_biInPrototype) return;
    BiAbstractLoader.call(this);
    var self = this;
    this.__handleEvent = function (e) {
        self._handleEvent(e || window.event);
    };
}
_p = _biExtend(BiImageLoader, BiAbstractLoader, "BiImageLoader");
_p._supportsSync = false;
BiImageLoader.addProperty("uri", BiAccessType.READ);
_p.setUri = function (oUri) {
    if (oUri instanceof BiUri) {
        this._uri = oUri;
    } else {
        this._uri = new BiUri(application.getAdfPath(), oUri);
    }
};
_p.load = function (oUri) {
    if (oUri) {
        this.setUri(oUri);
    }
    this._disposeLoader();
    if (this._async) {
        var el = this._element = new Image;
        el.onload = el.onerror = el.onabort = this.__handleEvent;
        el.src = String(this._uri);
    } else {
        throw new Error("BiImageLoader only supports asynchronous loading");
    }
};
_p.abort = function () {
    this._disposeLoader();
    this._error = this._loading = this._loaded = false;
};
_p.getLoaded = function () {
    return this._loaded;
};
_p.getLoading = function () {
    return this._loading;
};
_p.getError = function () {
    return this._error;
};
_p._disposeLoader = function () {
    var el = this._element;
    if (el) {
        el.onload = el.onerror = el.onabort = null;
    }
    delete this._element;
};
_p.dispose = function () {
    if (this._disposed) return;
    this._disposeLoader();
    BiAbstractLoader.prototype.dispose.call(this);
    this.disposeFields("_loaded", "_loading", "_error", "__handleEvent");
};
_p._handleEvent = function (e) {
    if (typeof e == "string") {
        this._onerror();
    } else {
        switch (e.type) {
        case "load":
            this._onload();
            break;
        case "error":
        case "abort":
            this._onerror();
            break;
        }
    }
};
_p._onload = function () {
    this._loading = this._error = false;
    this._loaded = true;
    this.dispatchEvent("load");
    this._disposeLoader();
};
_p._onerror = function () {
    this._loading = false;
    this._loaded = this._error = true;
    this.dispatchEvent("load");
    this._disposeLoader();
};
BiImageLoader._hasImageEl = function (oUri) {
    if (!this._foundImages) {
        this._foundImages = {};
    }
    var sUri;
    if (oUri instanceof BiUri) {
        sUri = String(oUri);
    } else {
        sUri = String(new BiUri(application.getAdfPath(), oUri));
    } if (sUri in this._foundImages) {
        return true;
    }
    var images = document.images;
    var l = images.length;
    for (var i = 0; i < l; i++) {
        if (images[i].src) {
            this._foundImages[images[i].src] = true;
            if (images[i].src == sUri) {
                return true;
            }
        }
    }
    return false;
};

function BiStyle() {
    if (_biInPrototype) return;
    BiAbstractLoader.call(this);
}
_p = _biExtend(BiStyle, BiAbstractLoader, "BiStyle");
_p._async = true;
BiStyle.addProperty("text", BiAccessType.READ_WRITE);
BiStyle.addProperty("uri", BiAccessType.READ_WRITE);
_p._onload = function () {
    this.dispatchEvent("load");
};
_p.getSrc = function () {
    return this.getUri();
};
_p.setSrc = function (s) {
    return this.setUri(s);
};
_p.load = function () {
    if (this._uri) {
        if (this._cssLoader) {
            this._cssLoader.dispose();
        }
        var sl = this._cssLoader = new BiCssLoader;
        sl.addEventListener("load", this._onload, this);
        sl.setAsync(this.getAsync());
        sl.setUri(this._uri);
        sl.load();
    } else if (this._text) {
        try {
            this._error = false;
            BiCssLoader.addCss(this._text);
        } catch (ex) {
            this._error = true;
        }
        this._loaded = true;
        this._loading = false;
    }
};
_p.getLoaded = function () {
    if (this._cssLoader) {
        return this._cssLoader.getLoaded();
    }
    return this._loaded;
};
_p.getLoading = function () {
    if (this._cssLoader) {
        return this._cssLoader.getLoading();
    }
    return this._loading;
};
_p.getError = function () {
    if (this._cssLoader) {
        return this._cssLoader.getError();
    }
    return this._error;
};
_p.abort = function () {
    if (this._cssLoader) {
        this._cssLoader.abort();
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiAbstractLoader.prototype.dispose.call(this);
    this.disposeFields("_cssLoader", "_text");
};
_p.addXmlNode = function (n, p) {
    this.setText(n.text);
};