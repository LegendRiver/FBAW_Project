/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiXmlDefinitionsDocument() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._loaded = false;
    this._httpRequest = new BiXmlHttp();
}
_p = _biExtend(BiXmlDefinitionsDocument, BiEventTarget, "BiXmlDefinitionsDocument");
_p.dispose = function () {
    if (this._disposed) return;
    this._httpRequest = null;
    for (var lIdx = 0; lIdx < this._imports.length; lIdx++) {
        this._imports[lIdx].getImportedDefinitionsDocument().dispose();
        this._imports[lIdx] = null;
    }
    BiEventTarget.prototype.dispose.call(this);
};
_p.setSource = function (aSource, aBaseUrl) {
    this._source = aSource;
    this._baseLocation = aBaseUrl;
};
_p.load = function (aAsync) {
    if (typeof (this._source) == "string") {
        this._loadFromUrl(this._source, aAsync);
    } else {
        this._processReceivedDocument(this._source, aAsync);
    }
};
_p._loadFromUrl = function (aUrl, aAsync) {
    if (/^file\:/.test(aUrl)) {
        var xmlHttp = new BiXmlHttp;
        xmlHttp.open("GET", aUrl, false);
        try {
            xmlHttp.send(null);
        } catch (ex) {
            this._errorMessage = BiLauncher.FILE_NOT_FOUND;
            return false;
        }
        var s = String(xmlHttp.responseText).replace(/<\?xml[^\?]*\?>/, "");
        xmlHttp.responseXML.loadXML(s);
        if (xmlHttp.responseXML.parseError.errorCode != 0) {
            this._errorMessage = xmlHttp.responseXML.parseError.reason;
            return false;
        }
        if (xmlHttp.responseXML && xmlHttp.responseXML.documentElement) {
            this._processReceivedDocument(xmlHttp.responseXML.documentElement, aAsync);
        } else {
            var oLoadedEvent = new BiEvent("loaded");
            oLoadedEvent.err = "Error while loading the document: " + aUrl;
            this.dispatchEvent(oLoadedEvent);
        }
        return;
    }
    if (aAsync) {
        var lThis = this;
        this._httpRequest.onreadystatechange = function () {
            if (lThis._httpRequest.readyState == 4) {
                if (lThis._httpRequest.status < 200 || lThis._httpRequest.status > 299) {
                    lThis._reportLoadError(aAsync, new BiWebServiceError("Could not receive XML: " + lThis._httpRequest.status));
                    return;
                }
                var xml = lThis._httpRequest.responseXML;
                if (xml && xml.documentElement) lThis._processReceivedDocument(xml.documentElement, aAsync);
                else {
                    var oLoadedEvent = new BiEvent("loaded");
                    oLoadedEvent.err = "Error while loading the document: " + aUrl;
                    lThis.dispatchEvent(oLoadedEvent);
                }
            }
        };
    }
    this._baseLocation = aUrl;
    this._httpRequest.open("GET", aUrl, aAsync);
    this._httpRequest.send(null);
    if (!aAsync) {
        if (this._httpRequest.status < 200 || this._httpRequest.status > 299) {
            this._reportLoadError(aAsync, new BiWebServiceError("Could not receive XML: " + this._httpRequest.status));
            return;
        }
        this._processReceivedDocument(this._httpRequest.responseXML.documentElement, aAsync);
    }
};
_p._reportLoadError = function (aAsync, aErr) {
    var lErrObj;
    if (typeof aErr == "string") {
        lErrObj = new BiWebServiceError(aErr);
    } else {
        lErrObj = aErr;
    } if (aAsync) {
        var lEvt = new BiEvent("loaded");
        lEvt.err = lErrObj;
        this.dispatchEvent(lEvt);
        delete lEvt.err;
        lEvt.dispose();
    } else {
        throw lErrObj;
    }
};
_p._processReceivedDocument = function (aRootElement, aAsync) {
    this._xmlSource = aRootElement;
    this._initiallyProcessDocument();
    this._imports = this._getImports();
    this._resolveImportsAndFinishLoading(aAsync);
};
_p._resolveImportsAndFinishLoading = function (aAsync) {
    this._pendingImportCount = this._imports.length;
    if (!this._pendingImportCount) {
        this._processLocalDefinitions();
        this._notifyDocumentLoaded();
    }
    for (var lImportIdx = 0; lImportIdx < this._imports.length; lImportIdx++) {
        var lImport = this._imports[lImportIdx].getImportedDefinitionsDocument();
        if (aAsync) {
            lImport.addEventListener("loaded", this._createLoadedEventHandler(this, this._imports[lImportIdx]));
        }
        lImport.load(aAsync);
        if (!aAsync) {
            this._handleReceivedImport(lImport, this._imports[lImportIdx]);
        }
    }
};
_p._createLoadedEventHandler = function (aImporter, aImport) {
    return function (aEvt) {
        if (aEvt.err) {
            aImporter._reportLoadError(true, aEvt.err);
        } else {
            aImporter._handleReceivedImport(aEvt.getTarget(), aImport);
        }
    };
};
_p._handleReceivedImport = function (aImportedDoc, aImportDesc) {
    this._processImport(aImportedDoc, aImportDesc);
    this._pendingImportCount--;
    if (!this._pendingImportCount) {
        this._processLocalDefinitions();
        this._notifyDocumentLoaded();
    }
};
_p.getXml = function () {
    return this._xmlSource;
};
_p._notifyDocumentLoaded = function () {
    this._loaded = true;
    this.dispatchEvent("loaded");
};
_p._initiallyProcessDocument = function () {
    throw new BiWebServiceError("_initiallyProcessDocument must be overriden by BiXmlDefinitionsDocument derivatives.");
};
_p._getImports = function (aDocument) {
    throw new BiWebServiceError("_getImports must be overriden by BiXmlDefinitionsDocument derivatives.");
};
_p._processImport = function (aImportedDoc, aImportDesc) {
    throw new BiWebServiceError("_processImport must be overriden by BiXmlDefinitionsDocument derivatives.");
};
_p._processLocalDefinitions = function () {
    throw new BiWebServiceError("_processLocalDefintions must be overriden by BiXmlDefinitionsDocument derivatives.");
};
BiXmlDefinitionsDocument.getURIFromNode = function (aPrefix, aContext) {
    var lRes = "";
    var lSought = "xmlns";
    if (aPrefix) {
        lSought = lSought + ":" + aPrefix;
    }
    while (aContext && (!lRes || lRes == "")) {
        if (aContext.nodeType == 1) {
            lRes = aContext.getAttribute(lSought);
        }
        aContext = aContext.parentNode;
    }
    return lRes;
};
BiXmlDefinitionsDocument.expandQname = function (aQname, aContext) {
    var lParts = aQname.split(":");
    var lPrefix = lParts.length > 1 ? lParts[0] : "";
    var lLocalPart = lParts.length > 1 ? lParts[1] : lParts[0];
    return "[" + BiXmlDefinitionsDocument.getURIFromNode(lPrefix, aContext) + "]" + lLocalPart;
};
BiXmlDefinitionsDocument.parseExpandedQname = function (aExpandedQname) {
    var lRet = new Object();
    var lRexp = /\[([^\]]*)\](.*)/;
    var lParts = lRexp.exec(aExpandedQname);
    if (!lParts || lParts.length != 3) {
        throw new BiWebServiceError(aExpandedQname + " is not a valid Expanded-QName");
    }
    lRet.ns = lParts[1];
    lRet.localName = lParts[2];
    return lRet;
};

function BiXmlDefinitionsDocumentImportDesc(aDoc) {
    if (_biInPrototype) return;
    this._importedDoc = aDoc;
}
_p = _biExtend(BiXmlDefinitionsDocumentImportDesc, Object, "BiXmlDefinitionsDocumentImportDesc");
_p.getImportedDefinitionsDocument = function () {
    return this._importedDoc;
};

function BiWsdlDefinitionDictionary(aPrimarySource, aObjectsPath, aKeyPath, aObFactory) {
    if (_biInPrototype) return;
    this._obPath = aObjectsPath;
    this._keyPath = aKeyPath;
    this._obFactory = aObFactory;
    this._loadedObjects = {};
    this._loadedObjectNames = [];
    this._primarySource = aPrimarySource;
    this._imports = [];
};
_p = _biExtend(BiWsdlDefinitionDictionary, Object, "BiWsdlDefinitionDictionary");
_p.dispose = function () {
    for (var lIdx = 0; lIdx < this._loadedObjectNames.length; lIdx++) {
        var lDispObj = this._loadedObjectNames[lIdx];
        if (typeof (lDispObj["dispose"]) == "function") {
            lDispObj.dispose();
        }
    }
};
_p.loadDefinitions = function () {
    var lDefNodes = this._primarySource.getXml().selectNodes(this._obPath);
    for (var lIdx = 0; lIdx < lDefNodes.length; lIdx++) {
        var lDefNode = lDefNodes[lIdx];
        var lDefLocalName = lDefNode.selectSingleNode(this._keyPath).nodeValue;
        var lDefName = "[" + this._primarySource.getTargetNamespace() + "]" + lDefLocalName;
        if (!this._loadedObjects[lDefName]) {
            this._loadedObjectNames.push(lDefName);
            this._loadedObjects[lDefName] = this._obFactory(lDefNode, this._primarySource);
            if (this._loadedObjects[lDefName]["finishLoad"]) {
                this._loadedObjects[lDefName].finishLoad();
            }
        }
    }
};
_p.addImport = function (aDefinitionDictionary) {
    this._imports.push(aDefinitionDictionary);
};
_p.getCount = function () {
    return this._enumKeys(null);
};
_p.getKeys = function () {
    var lRes = [];
    this._enumKeys(lRes);
    return lRes;
};
_p.getItem = function (aItemKey) {
    var lRes = this._loadedObjects[aItemKey];
    if (!lRes) {
        var lSoughtName = BiXmlDefinitionsDocument.parseExpandedQname(aItemKey);
        if (lSoughtName.ns == this._primarySource.getTargetNamespace()) {
            var lDefNode = this._primarySource.getXml().selectSingleNode(this._obPath + "[" + this._keyPath + "='" + lSoughtName.localName + "']");
            if (lDefNode) {
                this._loadedObjectNames.push(aItemKey);
                lRes = this._loadedObjects[aItemKey] = this._obFactory(lDefNode, this._primarySource);
                if (lRes["finishLoad"]) {
                    lRes.finishLoad();
                }
            }
        }
    }
    var lIdx = 0;
    while (!lRes && lIdx < this._imports.length) {
        lRes = this._imports[lIdx].getItem(aItemKey);
        lIdx++;
    }
    return lRes;
};
_p._enumKeys = function (aWhereTo) {
    var lCount = this._loadedObjectNames.length;
    if (aWhereTo) {
        for (var lIdx = 0; lIdx < this._loadedObjectNames.length; lIdx++) {
            aWhereTo.push(this._loadedObjectNames[lIdx]);
        }
    }
    for (var lIdx2 = 0; lIdx2 < this._imports.length; lIdx2++) {
        lCount += this._imports[lIdx2]._enumKeys(aWhereTo);
    }
    return lCount;
};

function BiSchemaError(aMessage) {
    if (_biInPrototype) return;
    Error.call(this, aMessage);
    this.errMessage = aMessage;
}
_p = _biExtend(BiSchemaError, Error, "BiSchemaError");
_p.toString = function () {
    return this.errMessage;
};

function BiSchemaType(aName) {
    if (_biInPrototype) return;
    this._name = aName;
}
_p = _biExtend(BiSchemaType, Object, "BiSchemaType");
_p.getName = function () {
    return this._name;
};

function BiSchemaSimpleContentType(aName) {
    if (_biInPrototype) return;
    BiSchemaType.call(this, aName);
}
_p = _biExtend(BiSchemaSimpleContentType, BiSchemaType, "BiSchemaSimpleContentType");
_p.encodeJsValue = function (aValueToEncode) {
    throw new BiSchemaError("BiSchemaSimpleContentType derivatives must implement encodeJsValue.");
};
_p.decodeJsValue = function (aValueToDecode) {
    throw new BiSchemaError("BiSchemaSimpleContentType derivatives must implement decodeJsValue.");
};

function BiSchemaPrimitiveType(aName) {
    if (_biInPrototype) return;
    BiSchemaSimpleContentType.call(this, aName);
}
_p = _biExtend(BiSchemaPrimitiveType, BiSchemaSimpleContentType, "BiSchemaPrimitiveType");

function BiSchemaStringPrimitiveType(aName) {
    if (_biInPrototype) return;
    BiSchemaPrimitiveType.call(this, aName);
}
_p = _biExtend(BiSchemaStringPrimitiveType, BiSchemaPrimitiveType, "BiSchemaStringPrimitiveType");
_p.encodeJsValue = function (aValueToEncode) {
    if (typeof (aValueToEncode) == "string" || typeof (aValueToEncode) == "number" || typeof (aValueToEncode) == "boolean") {
        return aValueToEncode;
    } else if (typeof (aValueToEncode) == "object" && ("toString" in aValueToEncode)) {
        return aValueToEncode.toString();
    } else if (typeof (aValueToEncode) == "undefined") {
        return "";
    } else {
        throw new BiSchemaError("Invalid primitive type value (type=" + typeof (aValueToEncode) + ")");
    }
};
_p.decodeJsValue = function (aValueToDecode) {
    return aValueToDecode;
};

function BiSchemaNumericPrimitiveType(aName) {
    if (_biInPrototype) return;
    BiSchemaPrimitiveType.call(this, aName);
}
_p = _biExtend(BiSchemaNumericPrimitiveType, BiSchemaPrimitiveType, "BiSchemaNumericPrimitiveType");
_p.encodeJsValue = function (aValueToEncode) {
    if (typeof (aValueToEncode) == "number") {
        return aValueToEncode;
    } else {
        throw new BiSchemaError("Invalid primitive type value (type=" + typeof (aValueToEncode) + ")");
    }
};
_p.decodeJsValue = function (aValueToDecode) {
    return new Number(aValueToDecode).valueOf();
};

function BiSchemaBooleanPrimitiveType(aName) {
    if (_biInPrototype) return;
    BiSchemaPrimitiveType.call(this, aName);
}
_p = _biExtend(BiSchemaBooleanPrimitiveType, BiSchemaPrimitiveType, "BiSchemaBooleanPrimitiveType");
_p.encodeJsValue = function (aValueToEncode) {
    return aValueToEncode ? "true" : "false";
};
_p.decodeJsValue = function (aValueToDecode) {
    return (aValueToDecode == "1") || (aValueToDecode == "true");
};

function BiSchemaBase64PrimitiveType(aName) {
    if (_biInPrototype) return;
    BiSchemaPrimitiveType.call(this, aName);
}
_p = _biExtend(BiSchemaBase64PrimitiveType, BiSchemaPrimitiveType, "BiSchemaBase64PrimitiveType");
BiSchemaBase64PrimitiveType._Base64Digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
_p.encodeJsValue = function (aVal) {
    var lEncodingString;
    if (typeof (aVal) == "string") {
        lEncodingString = true;
    } else if (aVal instanceof Array) {
        lEncodingString = false;
    } else {
        throw new BiSchemaError("Invalid value for type " + this.getName());
    }
    var lSrcIdx = 0;
    var lFragments = new Array();
    var lCurTriplet = 0;
    var lEncTriplet = "";
    var lIdx;
    while (lSrcIdx < aVal.length - 2) {
        lCurTriplet = 0;
        lEncTriplet = "";
        for (lIdx = 0; lIdx < 3; lIdx++) {
            lCurTriplet |= (lEncodingString ? aVal.charCodeAt(lSrcIdx + lIdx) : aVal[lSrcIdx + lIdx]) << (16 - 8 * lIdx);
        }
        for (lIdx = 0; lIdx < 4; lIdx++) {
            lEncTriplet = lEncTriplet + BiSchemaBase64PrimitiveType._Base64Digits.charAt((lCurTriplet >>> (18 - lIdx * 6)) & 0x3F);
        }
        lFragments.push(lEncTriplet);
        lSrcIdx += 3;
    }
    var lTripletSize = aVal.length - lSrcIdx;
    if (lTripletSize) {
        lCurTriplet = 0;
        lEncTriplet = "";
        for (lIdx = 0; lIdx < lTripletSize; lIdx++) {
            lCurTriplet |= (lEncodingString ? aVal.charCodeAt(lSrcIdx + lIdx) : aVal[lSrcIdx + lIdx]) << (16 - 8 * lIdx);
        }
        for (lIdx = 0; lIdx < lTripletSize + 1; lIdx++) {
            lEncTriplet = lEncTriplet + BiSchemaBase64PrimitiveType._Base64Digits.charAt((lCurTriplet >>> (18 - lIdx * 6)) & 0x3F);
        }
        lEncTriplet = lEncTriplet + ((lTripletSize == 1) ? "==" : "=");
        lFragments.push(lEncTriplet);
    }
    return lFragments.join("");
};
_p.decodeJsValue = function (aVal) {
    var lRes = new Array();
    var lSrcIdx = 0;
    var lDestIdx = 0;
    var lCurQuartet = 0;
    var lLen = aVal.indexOf("=");
    if (lLen < 0) {
        lLen = aVal.length;
    }
    while (lSrcIdx < lLen) {
        lCurQuartet = lCurQuartet << 6;
        lCurQuartet |= BiSchemaBase64PrimitiveType._Base64Digits.indexOf(aVal.charAt(lSrcIdx));
        if ((lSrcIdx & 0x03) == 0x03) {
            lRes[lDestIdx] = (lCurQuartet >>> 16) & 0xFF;
            lRes[lDestIdx + 1] = (lCurQuartet >>> 8) & 0xFF;
            lRes[lDestIdx + 2] = (lCurQuartet) & 0xFF;
            lCurQuartet = 0;
            lDestIdx += 3;
        }
        lSrcIdx++;
    }
    if ((lSrcIdx & 0x03) == 2) {
        lRes[lDestIdx] = (lCurQuartet >>> 4) & 0xFF;
    } else if ((lSrcIdx & 0x03) == 0x03) {
        lRes[lDestIdx] = (lCurQuartet >>> 10) & 0xFF;
        lRes[lDestIdx + 1] = (lCurQuartet >>> 2) & 0xFF;
    }
    return lRes;
};

function BiSchemaHexPrimitiveType(aName) {
    if (_biInPrototype) return;
    BiSchemaPrimitiveType.call(this, aName);
}
_p = _biExtend(BiSchemaHexPrimitiveType, BiSchemaPrimitiveType, "BiSchemaHexPrimitiveType");
BiSchemaHexPrimitiveType._HexDigits = "0123456789ABCDEF";
_p.encodeJsValue = function (aVal) {
    var lEncodingString;
    if (typeof (aVal) == "string") {
        lEncodingString = true;
    } else if (aVal instanceof Array) {
        lEncodingString = false;
    } else {
        throw BiSchemaError("Invalid value for type " + this.getName());
    }
    var lResFrags = Array();
    var lBt;
    for (var lIdx = 0; lIdx < aVal.length; lIdx++) {
        lBt = lEncodingString ? aVal.charCodeAt(lIdx) : aVal[lIdx];
        lResFrags.push(BiSchemaHexPrimitiveType._HexDigits.charAt((lBt >> 4) & 0xF) + BiSchemaHexPrimitiveType._HexDigits.charAt(lBt & 0xF));
    }
    return lResFrags.join("");
};
_p.decodeJsValue = function (aVal) {
    var lRes = new Array();
    if (aVal.length % 2) {
        throw new BiSchemaError("Invalid hex string length.");
    }
    for (var lIdx = 0; lIdx < aVal.length; lIdx += 2) {
        lRes.push(BiSchemaHexPrimitiveType._HexDigits.indexOf(aVal.charAt(lIdx).toUpperCase()) * 16 + BiSchemaHexPrimitiveType._HexDigits.indexOf(aVal.charAt(lIdx + 1).toUpperCase()));
    }
    return lRes;
};

function BiSchemaDateTimePrimitiveType(aName, aDate, aTime) {
    if (_biInPrototype) return;
    BiSchemaPrimitiveType.call(this, aName);
    this._date = aDate;
    this._time = aTime;
}
_p = _biExtend(BiSchemaDateTimePrimitiveType, BiSchemaPrimitiveType, "BiSchemaDateTimePrimitiveType");
_p._padToTwo = function (aVal) {
    return (aVal < 10) ? ("0" + aVal) : aVal;
};
_p.encodeJsValue = function (aVal) {
    var lRes = "";
    if (this._date) {
        lRes = lRes + aVal.getFullYear() + "-" + this._padToTwo(aVal.getMonth() + 1) + "-" + this._padToTwo(aVal.getDate());
    }
    if (this._date && this._time) {
        lRes = lRes + "T";
    }
    if (this._time) {
        lRes = lRes + this._padToTwo(aVal.getHours()) + ":" + this._padToTwo(aVal.getMinutes()) + ":" + this._padToTwo(aVal.getSeconds()) + (aVal.getMilliseconds() ? ('.' + aVal.getMilliseconds()) : "");
    }
    var lTz = aVal.getTimezoneOffset();
    if (lTz < 0) {
        lRes = lRes + '+';
        lTz = lTz * -1;
    } else {
        lRes = lRes + '-';
    }
    lRes = lRes + this._padToTwo(new Number(lTz / 60)) + ':' + this._padToTwo(lTz % 60);
    return lRes;
};
_p.decodeJsValue = function (aVal) {
    var lTmp, lRes = new Date();
    var lDateTimeTz = [];
    if (this._time && this._date) {
        lTmp = /^([^T]*)T([^Z+\-]*)([Z+\-].*)?$/.exec(aVal);
        if (!lTmp) {
            throw new BiSchemaError("Invalid value for type " + this.getName() + ": " + aVal);
        }
        lDateTimeTz[0] = lTmp[1];
        lDateTimeTz[1] = lTmp[2];
        lDateTimeTz[2] = lTmp[3];
    } else if (this._time) {
        lTmp = /^([0-9+\-][^Z+\-]*)([Z+\-].*)?$/.exec(aVal);
        if (!lTmp) {
            throw new BiSchemaError("Invalid value for type " + this.getName() + ": " + aVal);
        }
        lDateTimeTz[1] = lTmp[1];
        lDateTimeTz[2] = lTmp[2];
    } else if (this._date) {
        lTmp = /^(([+\-]?[0-9]+)-([0-9]+)-([0-9]+))([Z+\-].*)?$/.exec(aVal);
        if (!lTmp) {
            throw new BiSchemaError("Invalid value for type " + this.getName() + ": " + aVal);
        }
        lDateTimeTz[0] = lTmp[1];
        lDateTimeTz[2] = lTmp[5];
    }
    if (this._date) {
        var lDateParts = /^([+\-]?[0-9]+)-([0-9]+)-([0-9]+)$/.exec(lDateTimeTz[0]);
        if (!lDateParts) {
            throw new BiSchemaError("Invalid date format: " + lDateTimeTz[0]);
        }
        lRes.setYear(lDateParts[1]);
        lRes.setMonth(new Number(lDateParts[2]).valueOf() - 1);
        lRes.setDate(lDateParts[3]);
    }
    if (this._time) {
        var lTimeParts = lDateTimeTz[1].split(':');
        if (lTimeParts.length != 3) return;
        lRes.setHours(lTimeParts[0]);
        lRes.setMinutes(lTimeParts[1]);
        var lSecParts = lTimeParts[2].split('.');
        lRes.setSeconds(lSecParts[0]);
        if (lSecParts[1]) {
            lRes.setMilliseconds(lSecParts[1].substring(0, 3));
        }
    }
    if (lDateTimeTz[2]) {
        var lTzOfs = 0;
        if (lDateTimeTz[2] != 'Z') {
            var lTzComps = /([+-])?([0-9]*)(:([0-9]*))?/.exec(lDateTimeTz[2]);
            if (!lTzComps) {
                throw new BiSchemaError("Error in timezone component: " + lDateTimeTz);
            }
            lTzOfs = -1 * (lTzComps[2] * 60 + (lTzComps[4] ? lTzComps[4] * 1 : 0)) * (lTzComps[1] == '-' ? -1 : 1);
        }
        var lCurTz = lRes.getTimezoneOffset();
        lRes.setTime(lRes.getTime() + (lTzOfs - lCurTz) * 60000);
    }
    return lRes;
};
BiSchemaPrimitiveType.PRIMITIVE_TYPES = {
    "[http://www.w3.org/2001/XMLSchema]float": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]float"),
    "[http://www.w3.org/2001/XMLSchema]double": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]double"),
    "[http://www.w3.org/2001/XMLSchema]decimal": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]decimal"),
    "[http://www.w3.org/2001/XMLSchema]integer": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]integer"),
    "[http://www.w3.org/2001/XMLSchema]nonPositiveInteger": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]nonPositiveInteger"),
    "[http://www.w3.org/2001/XMLSchema]negativeInteger": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]negativeInteger"),
    "[http://www.w3.org/2001/XMLSchema]long": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]long"),
    "[http://www.w3.org/2001/XMLSchema]int": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]int"),
    "[http://www.w3.org/2001/XMLSchema]short": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]short"),
    "[http://www.w3.org/2001/XMLSchema]byte": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]byte"),
    "[http://www.w3.org/2001/XMLSchema]nonNegativeInteger": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]nonNegativeInteger"),
    "[http://www.w3.org/2001/XMLSchema]unsignedLong": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]unsignedLong"),
    "[http://www.w3.org/2001/XMLSchema]unsignedInt": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]unsignedInt"),
    "[http://www.w3.org/2001/XMLSchema]unsignedShort": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]unsignedShort"),
    "[http://www.w3.org/2001/XMLSchema]unsignedByte": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]unsignedByte"),
    "[http://www.w3.org/2001/XMLSchema]positiveInteger": new BiSchemaNumericPrimitiveType("[http://www.w3.org/2001/XMLSchema]positiveInteger"),
    "[http://www.w3.org/2001/XMLSchema]string": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]string"),
    "[http://www.w3.org/2001/XMLSchema]anyURI": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]anyURI"),
    "[http://www.w3.org/2001/XMLSchema]QName": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]QName"),
    "[http://www.w3.org/2001/XMLSchema]NOTATION": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]NOTATION"),
    "[http://www.w3.org/2001/XMLSchema]normalizedString": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]normalizedString"),
    "[http://www.w3.org/2001/XMLSchema]token": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]token"),
    "[http://www.w3.org/2001/XMLSchema]language": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]language"),
    "[http://www.w3.org/2001/XMLSchema]IDREFS": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]IDREFS"),
    "[http://www.w3.org/2001/XMLSchema]ENTITIES": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]ENTITIES"),
    "[http://www.w3.org/2001/XMLSchema]NMTOKEN": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]NMTOKEN"),
    "[http://www.w3.org/2001/XMLSchema]NMTOKENS": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]NMTOKENS"),
    "[http://www.w3.org/2001/XMLSchema]Name": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]Name"),
    "[http://www.w3.org/2001/XMLSchema]NCName": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]NCName"),
    "[http://www.w3.org/2001/XMLSchema]ID": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]ID"),
    "[http://www.w3.org/2001/XMLSchema]IDREF": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]IDREF"),
    "[http://www.w3.org/2001/XMLSchema]ENTITY": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]ENTITY"),
    "[http://www.w3.org/2001/XMLSchema]boolean": new BiSchemaBooleanPrimitiveType("[http://www.w3.org/2001/XMLSchema]boolean"),
    "[http://www.w3.org/2001/XMLSchema]base64Binary": new BiSchemaBase64PrimitiveType("[http://www.w3.org/2001/XMLSchema]base64Binary"),
    "[http://www.w3.org/2001/XMLSchema]hexBinary": new BiSchemaHexPrimitiveType("[http://www.w3.org/2001/XMLSchema]hexBinary"),
    "[http://www.w3.org/2001/XMLSchema]dateTime": new BiSchemaDateTimePrimitiveType("[http://www.w3.org/2001/XMLSchema]dateTime", true, true),
    "[http://www.w3.org/2001/XMLSchema]time": new BiSchemaDateTimePrimitiveType("[http://www.w3.org/2001/XMLSchema]time", false, true),
    "[http://www.w3.org/2001/XMLSchema]date": new BiSchemaDateTimePrimitiveType("[http://www.w3.org/2001/XMLSchema]date", true, false),
    "[http://www.w3.org/2001/XMLSchema]duration": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]duration"),
    "[http://www.w3.org/2001/XMLSchema]gYearMonth": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]gYearMonth"),
    "[http://www.w3.org/2001/XMLSchema]gYear": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]gYear"),
    "[http://www.w3.org/2001/XMLSchema]gMonthDay": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]gMonthDay"),
    "[http://www.w3.org/2001/XMLSchema]gDay": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]gDay"),
    "[http://www.w3.org/2001/XMLSchema]gMonth": new BiSchemaStringPrimitiveType("[http://www.w3.org/2001/XMLSchema]gMonth")
};
BiSchemaPrimitiveType.PRIMITIVE_TYPES_COUNT = 44;
BiSchemaPrimitiveType.PRIMITIVE_TYPES_DEFINITIONS_DICTIONARY = {
    "getCount": function () {
        return BiSchemaPrimitiveType.PRIMITIVE_TYPES_COUNT;
    },
    "getKeys": function () {
        var lRes = [];
        this._enumKeys(lRes);
        return lRes;
    },
    "getItem": function (aItemName) {
        return BiSchemaPrimitiveType.PRIMITIVE_TYPES[aItemName];
    },
    "_enumKeys": function (aOut) {
        for (var lIdx in BiSchemaPrimitiveType.PRIMITIVE_TYPES) {
            aOut.push(lIdx);
        }
    }
};

function BiSchemaWildcard(aSchema, aElement) {
    if (_biInPrototype) return;
    var lNamespace = aElement.getAttribute("namespace");
    if (!lNamespace) {
        lNamespace = "##any";
    }
    if (lNamespace == "##any") {
        this._type = "any";
    } else if (lNamespace == "##other") {
        this._type = "not";
        this._namespace = aSchema.getTargetNamespace();
    } else {
        var lNamespaces = lNamespace.split(" ");
        for (var lAnyNsIdx = 0; lAnyNsIdx < lNamespaces.length; lAnyNsIdx++) {
            if (lNamespaces[lAnyNsIdx] == "##targetNamespace") {
                lNamespaces[lAnyNsIdx] = aSchema.getTargetNamespace();
            } else if (lNamespaces[lAnyNsIdx] == "##local") {
                lNamespaces[lAnyNsIdx] = "##local";
            }
        }
        this._type = "list";
        this._namespaces = lNamespaces;
    }
}
_p = _biExtend(BiSchemaWildcard, Object, "BiSchemaWildcard");

function BiSchemaParticle(aSchema, aNode) {
    if (_biInPrototype) return;
    if (aNode.baseName == "element") {
        if (aNode.getAttribute("ref")) {
            this._term = aSchema.getElement(BiXmlDefinitionsDocument.expandQname(aNode.getAttribute("ref"), aNode));
        } else {
            this._term = new BiSchemaElement(aSchema, aNode, false);
            this._term.finishLoad();
        }
    } else if (aNode.baseName == "any") {
        this._term = new BiSchemaWildcard(aSchema, aNode);
    } else if (aNode.baseName == "group") {
        this._term = aSchema.getGroupDef(BiXmlDefinitionsDocument.expandQname(aNode.getAttribute("ref"), aNode)).getModelGroup();
    } else if (aNode.baseName == "all" || aNode.baseName == "sequence" || aNode.baseName == "choice") {
        this._term = BiSchemaModelGroup.loadModelGroup(aSchema, aNode);
    }
    this._minOc = aNode.getAttribute("minOccurs");
    this._maxOc = aNode.getAttribute("maxOccurs");
    if (this._maxOc == null) {
        this._maxOc = 1;
    }
    if (this._minOc == null) {
        this._minOc = 1;
    }
    if (this._maxOc == "unbounded") {
        this._maxOc = null;
    }
    this._optional = this._minOc == 0;
    this._unbounded = this._maxOc == null;
}
_p = _biExtend(BiSchemaParticle, Object, "BiSchemaParticle");
_p.getTerm = function () {
    return this._term;
};
_p.getMinOccurs = function () {
    return this._minOc;
};
_p.getMaxOccurs = function () {
    return this._maxOc;
};
BiSchemaParticle.loadParticle = function (aSchema, aNode) {
    return new BiSchemaParticle(aSchema, aNode);
};
_p.toString = function () {
    return this._term.toString() + "[" + this._minOc + "," + this._maxOc + "]";
};

function BiSchemaModelGroup(aSchema, aNode, aAllowedParticleNodes) {
    if (_biInPrototype) return;
    this._particles = [];
    if (!aNode) return;
    var lPotentialParticles = aNode.selectNodes("*");
    for (var lIdx = 0; lIdx < lPotentialParticles.length; lIdx++) {
        if (lPotentialParticles[lIdx].baseName != "annotation") {
            if (!aAllowedParticleNodes.contains(lPotentialParticles[lIdx].baseName)) {
                throw new BiSchemaError("Model group doesn't permit particle elements of name " + lPotentialParticles[lIdx].baseName);
            } else {
                this._particles.push(BiSchemaParticle.loadParticle(aSchema, lPotentialParticles[lIdx], true));
            }
        }
    }
}
_p = _biExtend(BiSchemaModelGroup, Object, "BiSchemaModelGroup");
BiSchemaModelGroup.loadModelGroup = function (aSchema, aSrcNode) {
    if (aSrcNode.namespaceURI != "http://www.w3.org/2001/XMLSchema") {
        throw new BiSchemaError("Invalid model group namespace: " + aSrcNode.namespaceURI);
    }
    if (aSrcNode.baseName == "all") {
        return new BiSchemaAllModelGroup(aSchema, aSrcNode);
    } else if (aSrcNode.baseName == "choice") {
        return new BiSchemaChoiceModelGroup(aSchema, aSrcNode);
    } else if (aSrcNode.baseName == "sequence") {
        return new BiSchemaSequenceModelGroup(aSchema, aSrcNode);
    } else {
        throw new BiSchemaError("Invalid model group: " + aSrcNode.baseName);
    }
};
_p.getParticles = function () {
    return this._particles;
};

function BiSchemaAllModelGroup(aSchema, aNode) {
    if (_biInPrototype) return;
    BiSchemaModelGroup.call(this, aSchema, aNode, ["element"]);
}
_p = _biExtend(BiSchemaAllModelGroup, BiSchemaModelGroup, "BiSchemaAllModelGroup");
_p.toString = function () {
    return "all";
};

function BiSchemaChoiceModelGroup(aSchema, aNode) {
    if (_biInPrototype) return;
    BiSchemaModelGroup.call(this, aSchema, aNode, ["element", "any", "group", "all", "choice", "sequence"]);
}
_p = _biExtend(BiSchemaChoiceModelGroup, BiSchemaModelGroup, "BiSchemaChoiceModelGroup");
_p.toString = function () {
    return "choice";
};

function BiSchemaSequenceModelGroup(aSchema, aNode) {
    if (_biInPrototype) return;
    BiSchemaModelGroup.call(this, aSchema, aNode, ["element", "any", "group", "all", "choice", "sequence"]);
}
_p = _biExtend(BiSchemaSequenceModelGroup, BiSchemaModelGroup, "BiSchemaSequenceModelGroup");
_p.toString = function () {
    return "sequence";
};

function BiSchemaGroupDef(aSchema, aGroupDefNode) {
    if (_biInPrototype) return;
    var lTestNode = aGroupDefNode.selectSingleNode("xsd:all");
    if (!lTestNode) lTestNode = aGroupDefNode.selectSingleNode("xsd:choice");
    if (!lTestNode) lTestNode = aGroupDefNode.selectSingleNode("xsd:sequence");
    this._loadedNode = lTestNode;
    this._schema = aSchema;
}
_p = _biExtend(BiSchemaGroupDef, Object, "BiSchemaGroupDef");
_p.finishLoad = function () {
    this._modelGroup = BiSchemaModelGroup.loadModelGroup(this._schema, this._loadedNode);
};
_p.getModelGroup = function () {
    return this._modelGroup;
};

function BiSchemaAttributeBag(aSchema, aSrcNode) {
    if (_biInPrototype) return;
    this._attributes = [];
    this._attrByName = {};
    this._prohibitedAttrByName = {};
    this._anyAttrNamespaces = {};
    this._schema = aSchema;
    this._loadAttributes(aSrcNode);
}
_p = _biExtend(BiSchemaAttributeBag, Object, "BiSchemaAttributeBag");
_p._loadAttributes = function (aSrcNode) {
    var lAttrIdx, lAttributeRefs = aSrcNode.selectNodes("xsd:attribute");
    for (lAttrIdx = 0; lAttrIdx < lAttributeRefs.length; lAttrIdx++) {
        var lAttr = null;
        var lAttrNode = lAttributeRefs[lAttrIdx];
        lAttr = new BiSchemaAttrUse(this._schema, lAttrNode);
        if (lAttr.getUseType() != BiSchemaAttrUse.USE_TYPE_PROHIBITED) {
            this._attributes.push(lAttr);
            this._attrByName[lAttr.getExpandedQName()] = lAttr;
        } else {
            this._prohibitedAttrByName[lAttr.getExpandedQName()] = true;
        }
    }
    var lAnyAttribute = aSrcNode.selectSingleNode("xsd:anyAttribute/@namespace");
    if (lAnyAttribute) {
        if (lAnyAttribute.nodeValue == "##any") {
            this._anyAttrNamespaces = {
                "_wcType": "any"
            };
        } else if (lAnyAttribute.nodeValue == "##other") {
            this._anyAttrNamespaces = {
                "_wcType": "not",
                "_namespace": this._schema.getTargetNamespace()
            };
        } else {
            var lAnyAttrNamespaces = lAnyAttribute.nodeValue.split(" ");
            for (var lAnyAttrNsIdx = 0; lAnyAttrNsIdx < lAnyAttrNamespaces.length; lAnyAttrNsIdx++) {
                if (lAnyAttrNamespaces[lAnyAttrNsIdx] == "##targetNamespace") {
                    lAnyAttrNamespaces[lAnyAttrNsIdx] = this._schema.getTargetNamespace();
                } else if (lAnyAttrNamespaces[lAnyAttrNsIdx] == "##local") {
                    lAnyAttrNamespaces[lAnyAttrNsIdx] = "##local";
                }
            }
            this._anyAttrNamespaces = {
                "_wcType": "list",
                "_namespaces": lAnyAttrNamespaces
            };
        }
    }
    var lAttributeGroupRefs = aSrcNode.selectNodes("xsd:attributeGroup[@ref]");
    for (lAttrIdx = 0; lAttrIdx < lAttributeGroupRefs.length; lAttrIdx++) {
        var lAttrGroupFullName = BiXmlDefinitionsDocument.expandQname(lAttributeGroupRefs[lAttrIdx].getAttribute("ref"), lAttributeGroupRefs[lAttrIdx]);
        this.composeBag(this._schema.getAttributeGroup(lAttrGroupFullName).getAttributes(), BiSchemaAttributeBag.COMPOSEBAG_REFERENCE_BAG);
    }
};
_p.getAttrCount = function () {
    return this._attributes.length;
};
_p.getAttributes = function () {
    return this._attributes;
};
_p.getAttribute = function (aExpandedName) {
    return this._attrByName[aExpandedName];
};
_p.composeBag = function (aSrcBag, aComposeType) {
    var lIdx;
    for (var lAttrIdx = 0; lAttrIdx < 0; lAttrIdx++) {
        var lAttr = aSrcBag._attributes[lAttrIdx];
        if (aComposeType != BiSchemaAttributeBag.COMPOSEBAG_RESTRICT_BAG || !((lAttr.getExpandedQName() in this._attrByName) || (lAttr.getExpandedQName() in this._prohibitedAttrByName))) {
            this._attributes.push(lAttr);
            this._attrByName[lAttr.getExpandedQName()] = lAttr;
        }
    }
    if (aComposeType == BiSchemaAttributeBag.COMPOSEBAG_REFERENCE_BAG) {
        if (!this._anyAttrNamespaces) {
            this._anyAttrNamespaces = aSrcBag._anyAttrNamespaces;
        } else if (aSrcBag._anyAttrNamespaces) {
            if (this._anyAttrNamespaces._wcType == "any") {
                this._anyAttrNamespaces = aSrcBag._anyAttrNamespaces;
            } else if (aSrcBag._anyAttrNamespaces._wcType == "any") {} else var lRemovedNs, lSrcSet, lNewSet; if (this._anyAttrNamespaces._wcType == "not" && aSrcBag._anyAttrNamespaces._wcType == "list") {
                lRemovedNs = this._anyAttrNamespaces._namespace;
                lSrcSet = aSrcBag._anyAttrNamespaces._namespaces;
                lNewSet = [];
                for (lIdx = 0; lIdx < lSrcSet.length; lIdx++) {
                    if (lSrcSet[lIdx] != lRemovedNs) {
                        lNewSet.push(lSrcSet[lIdx]);
                    }
                }
            } else if (this._anyAttrNamespaces._wcType == "list" && aSrcBag._anyAttrNamespaces._wcType == "not") {
                lRemovedNs = aSrcBag._anyAttrNamespaces._namespace;
                lSrcSet = this._anyAttrNamespaces._namespaces;
                lNewSet = [];
                for (lIdx = 0; lIdx < lSrcSet.length; lIdx++) {
                    if (lSrcSet[lIdx] != lRemovedNs) {
                        lNewSet.push(lSrcSet[lIdx]);
                    }
                }
            } else if (this._anyAttrNamespaces._wcType == "list" && aSrcBag._anyAttrNamespaces._wcType == "list") {
                lIdx = 0;
                while (lIdx < this._anyAttrNamespaces._namespaces.length) {
                    if (aSrcBag._anyAttrNamespaces._namespaces.contains(this._anyAttrNamespaces._namespaces[lIdx])) {
                        lIdx++;
                    } else {
                        this._anyAttrNamespaces.removeAt(lIdx);
                    }
                }
            } else if (this._anyAttrNamespaces._wcType == "not" && aSrcBag._anyAttrNamespaces._wcType == "not" && this._anyAttrNamespaces._namespace != aSrcBag._anyAttrNamespaces._namespace) {
                throw new BiSchemaError("Intersection of attribute wildcards is inexpressible.");
            }
        }
    } else if (aComposeType == BiSchemaAttributeBag.COMPOSEBAG_RESTRICT_BAG) {} else if (aComposeType == BiSchemaAttributeBag.COMPOSEBAG_EXTEND_BAG) {
        if (!this._anyAttrNamespaces) {
            this._anyAttrNamespaces = aSrcBag._anyAttrNamespaces;
        } else if (aSrcBag._anyAttrNamespaces) {
            if (this._anyAttrNamespaces._wcType == "any" || aSrcBag._anyAttrNamespaces._wcType == "any") {
                this._anyAttrNamespaces = {
                    _wcType: "any"
                };
            } else if (this._anyAttrNamespaces._wcType == "not" && aSrcBag._anyAttrNamespaces._wcType == "list") {
                if (aSrcBag._anyAttrNamespaces._namespaces.contains(this._anyAttrNamespaces._namespace)) {
                    this._anyAttrNamespaces = {
                        _wcType: "any"
                    };
                }
            } else if (this._anyAttrNamespaces._wcType == "list" && aSrcBag._anyAttrNamespaces._wcType == "not") {
                if (this._anyAttrNamespaces._namespaces.contains(aSrcBag._anyAttrNamespaces._namespace)) {
                    this._anyAttrNamespaces = {
                        _wcType: "any"
                    };
                } else {
                    this._anyAttrNamespaces = aSrcBag._anyAttrNamespaces;
                }
            } else if (this._anyAttrNamespaces._wcType == "list" && aSrcBag._anyAttrNamespaces._wcType == "list") {
                lIdx = 0;
                while (lIdx < aSrcBag._anyAttrNamespaces._namespaces.length) {
                    if (!this._anyAttrNamespaces._namespaces.contains(aSrcBag._anyAttrNamespaces._namespaces[lIdx])) {
                        this._anyAttrNamespaces._namespaces.push(aSrcBag._anyAttrNamespaces);
                    }
                }
            } else if (this._anyAttrNamespaces._wcType == "not" && aSrcBag._anyAttrNamespaces._wcType == "not" && this._anyAttrNamespaces._namespace != aSrcBag._anyAttrNamespaces._namespace) {
                throw new BiSchemaError("Union of attribute wildcards is inexpressible.");
            }
        }
    }
};
BiSchemaAttributeBag.COMPOSEBAG_REFERENCE_BAG = 0;
BiSchemaAttributeBag.COMPOSEBAG_EXTEND_BAG = 1;
BiSchemaAttributeBag.COMPOSEBAG_RESTRICT_BAG = 2;

function BiSchemaAttrUse(aSchema, aSrcNode) {
    if (_biInPrototype) return;
    var lTextualUseType = aSrcNode.getAttribute("use");
    if (!lTextualUseType) {
        lTextualUseType = "optional";
    }
    if (lTextualUseType == "optional") {
        this._useType = BiSchemaAttrUse.USE_TYPE_OPTIONAL;
    } else if (lTextualUseType == "prohibited") {
        this._useType = BiSchemaAttrUse.USE_TYPE_PROHIBITED;
    } else if (lTextualUseType == "required") {
        this._useType = BiSchemaAttrUse.USE_TYPE_REQUIRED;
    } else {
        throw new BiSchemaError("Invalid attribute use type specified: " + lTextualUseType);
    }
    var lArrTypeNode = aSrcNode.selectSingleNode("@wsdl:arrayType");
    if (lArrTypeNode) {
        var lArrType = /([^\[\]]*)(\[.*)/.exec(lArrTypeNode.nodeValue);
        if (lArrType.length != 3) {
            throw new BiSchemaError("Invalid wsdl:arrayType value: " + lArrTypeNode.nodeValue);
        }
        this._wsdlArrayBaseType = BiXmlDefinitionsDocument.expandQname(lArrType[1], aSrcNode);
        this._wsdlArraySubscripts = lArrType[2];
    }
    if (aSrcNode.getAttribute("ref")) {
        var lAttrFullName = BiXmlDefinitionsDocument.expandQname(aSrcNode.getAttribute("ref"), aSrcNode);
        this._attr = aSchema.getAttribute(lAttrFullName);
        if (!this._attr) {
            throw new BiSchemaError("Referenced attribute " + lAttrFullName + " not found.");
        }
    } else {
        this._attr = new BiSchemaAttr(aSchema, aSrcNode, false);
        this._attr.finishLoad();
    }
}
_p = _biExtend(BiSchemaAttrUse, Object, "BiSchemaAttrUse");
_p.getAttr = function () {
    return this._attr;
};
_p.getWsdlArrayBaseType = function () {
    return this._wsdlArrayBaseType;
};
_p.getWsdlArraySubscripts = function () {
    return this._wsdlArraySubscripts;
};
_p.getExpandedQName = function () {
    return this._attr.getExpandedQName();
};
_p.getUseType = function () {
    return this._useType;
};
BiSchemaAttrUse.USE_TYPE_OPTIONAL = 0;
BiSchemaAttrUse.USE_TYPE_REQUIRED = 1;
BiSchemaAttrUse.USE_TYPE_PROHIBITED = 2;

function BiSchemaSimpleType(aSchema, aSimpleTypeNode) {
    if (_biInPrototype) return;
    BiSchemaSimpleContentType.call(this, aSimpleTypeNode.getAttribute("name"));
    this._schema = aSchema;
    this._xmlSrc = aSimpleTypeNode;
}
_p = _biExtend(BiSchemaSimpleType, BiSchemaSimpleContentType, "BiSchemaSimpleType");
_p.finishLoad = function () {
    var lTestNode = this._xmlSrc.selectSingleNode("xsd:restriction");
    if (lTestNode) {
        this._loadRestriction(lTestNode);
    } else {
        lTestNode = this._xmlSrc.selectSingleNode("xsd:list");
        if (lTestNode) {
            this._loadList(lTestNode);
        } else {
            lTestNode = this._xmlSrc.selectSingleNode("xsd:union");
            if (lTestNode) {
                this._loadUnion(lTestNode);
            } else {
                throw new BiSchemaError("Invalid simple type defintion: " + "expected content (xsd:restriction | xsd:list | xsd:union); " + "type: " + (this._name ? this._name : "(unnamed simple type)"));
            }
        }
    }
};
_p.encodeJsValue = function (aVal) {
    var lRes;
    var lIdx;
    switch (this._derivationMethod) {
    case BiSchemaSimpleType.DERIVATION_METHOD_RESTRICTION:
        lRes = this._baseTypes[0].encodeJsValue(aVal);
        break;
    case BiSchemaSimpleType.DERIVATION_METHOD_LIST:
        if (aVal instanceof Array) {
            if (!aVal.length) {
                lRes = "";
            } else {
                lRes = this._baseTypes[0].encodeJsValue(aVal[0]);
                for (lIdx = 1; lIdx < aVal.length; lIdx++) {
                    lRes += " " + this._baseTypes[0].encodeJsValue(aVal[lIdx]);
                }
            }
        } else {
            lRes = this._baseTypes[0].encodeJsValue(aVal);
        }
        break;
    case BiSchemaSimpleType.DERIVATION_METHOD_UNION:
        lIdx = 0;
        lRes = null;
        while (lRes == null && lIdx < this._baseTypes.length) {
            lRes = this._baseTypes[lIdx].encodeJsValue(aVal);
            lRes++;
        }
        break;
    }
    return lRes;
};
_p.decodeJsValue = function (aVal) {
    var lRes;
    var lIdx;
    switch (this._derivationMethod) {
    case BiSchemaSimpleType.DERIVATION_METHOD_RESTRICTION:
        lRes = this._baseTypes[0].decodeJsValue(aVal);
        break;
    case BiSchemaSimpleType.DERIVATION_METHOD_LIST:
        var lTokens = aVal.split(' ');
        lRes = new Array();
        for (var lTokenIdx = 0; lTokenIdx < lTokens.length; lTokenIdx++) {
            lRes.push(this._baseTypes[0].decodeJsValue(lTokens[lTokenIdx]));
        }
        break;
    case BiSchemaSimpleType.DERIVATION_METHOD_UNION:
        lIdx = 0;
        lRes = null;
        while (lRes == null && lIdx < this._baseTypes.length) {
            lRes = this._baseTypes[lIdx].decodeJsValue(aVal);
            lRes++;
        }
        break;
    }
    return lRes;
};
_p._loadRestriction = function (aNode) {
    this._derivationMethod = BiSchemaSimpleType.DERIVATION_METHOD_RESTRICTION;
    if (aNode.getAttribute("base")) {
        var lFullBaseTypeName = BiXmlDefinitionsDocument.expandQname(aNode.getAttribute("base"), aNode);
        this._baseTypes = [this._schema.getType(lFullBaseTypeName)];
    } else {
        var lSimpleTypeNode = aNode.selectSingleNode("xsd:simpleType");
        if (!lSimpleTypeNode) {
            throw new BiSchemaError("Invalid base type for restricted simpleType.");
        }
        var lTp = new BiSchemaSimpleType(this._schema, lSimpleTypeNode);
        lTp.finishLoad();
        this._baseTypes = [lTp];
    }
};
_p._loadList = function (aNode) {
    this._derivationMethod = BiSchemaSimpleType.DERIVATION_METHOD_LIST;
    if (aNode.getAttribute("itemType")) {
        var lFullBaseTypeName = BiXmlDefinitionsDocument.expandQname(this._schema.getType(aNode.getAttribute("itemType"), aNode));
        this._baseTypes = [this._schema.getType(lFullBaseTypeName)];
    } else {
        var lSimpleTypeNode = aNode.selectSingleNode("xsd:simpleType");
        if (!lSimpleTypeNode) {
            throw new BiSchemaError("Invalid base type for list simpleType.");
        }
        var lTp = new BiSchemaSimpleType(this._schema, lSimpleTypeNode);
        lTp.finishLoad();
        this._baseTypes = [lTp];
    }
};
_p._loadUnion = function (aNode) {
    this._derivationMethod = BiSchemaSimpleType.DERIVATION_METHOD_UNION;
    this._baseTypes = [];
    if (aNode.getAttribute("memberTypes")) {
        var lBaseTypeNames = aNode.getAttribute("memberTypes").split(" ");
        for (var lTypeIdx = 0; lTypeIdx < lBaseTypeNames.length; lTypeIdx++) {
            var lFullBaseTypeName = BiXmlDefinitionsDocument.expandQname(this._schema.getType(lBaseTypeNames[lTypeIdx], aNode));
            this._baseTypes.push(this._schema.getType(lFullBaseTypeName));
        }
    }
    var lSimpleTypeElements = aNode.selectNodes("xsd:simpleType");
    for (var lSimpleTypeIdx = 0; lSimpleTypeIdx < lSimpleTypeElements.length; lSimpleTypeIdx++) {
        var lSimpleTypeNode = lSimpleTypeElements[lSimpleTypeIdx];
        var lTp = new BiSchemaSimpleType(this._schema, lSimpleTypeNode);
        lTp.finishLoad();
        this._baseTypes.push(lTp);
    }
    if (!this._baseTypes.length) {
        throw new BiSchemaError("Invalid simple type defintion: " + "expected at least one base simpleType for union simpleTypes. " + "type: " + (this._name ? this._name : "(unnamed simple type)"));
    }
};
_p.getDerivationMethod = function () {
    return this._derivationMethod;
};
_p.getBaseTypes = function () {
    return this._baseTypes;
};
BiSchemaSimpleType.DERIVATION_METHOD_RESTRICTION = 0;
BiSchemaSimpleType.DERIVATION_METHOD_LIST = 1;
BiSchemaSimpleType.DERIVATION_METHOD_UNION = 2;

function BiSchemaComplexType(aSchema, aComplexTypeNode) {
    if (_biInPrototype) return;
    var lLocalTypeName = aComplexTypeNode.getAttribute("name");
    BiSchemaType.call(this, lLocalTypeName ? ("[" + aSchema.getTargetNamespace() + "]" + lLocalTypeName) : null);
    this._schema = aSchema;
    this._xmlSrc = aComplexTypeNode;
}
_p = _biExtend(BiSchemaComplexType, BiSchemaType, "BiSchemaComplexType");
_p._loadDirectModel = function (aSrcNode) {
    this._contentType = BiSchemaComplexType.CONTENT_TYPE_PARTICLE;
    this._particle = BiSchemaParticle.loadParticle(this._schema, aSrcNode, false);
};
_p._loadSimpleContentExtension = function (aSrcNode) {
    var lExtensionNode = aSrcNode.selectSingleNode("xsd:extension");
    var lBaseTypeFullName = BiXmlDefinitionsDocument.expandQname(lExtensionNode.getAttribute("base"), lExtensionNode);
    this._baseType = this._schema.getType(lBaseTypeFullName);
    if (!this._baseType) {
        throw new BiSchemaError("Base type not found: " + lBaseTypeFullName);
    }
    this._contentType = BiSchemaComplexType.CONTENT_TYPE_SIMPLE;
    if (this._baseType instanceof BiSchemaSimpleContentType) {
        this._contentSimpleType = this._baseType;
    } else {
        if (this._baseType.getContentType() != BiSchemaComplexType.CONTENT_TYPE_SIMPLE) {
            throw new BiSchemaError("simpleContent extended types must be derived from simpleContent complexTypes or simpleTypes.");
        }
        this._contentSimpleType = this._baseType.getContentSimpleType();
    }
    this._attributeBag = new BiSchemaAttributeBag(this._schema, lExtensionNode);
    if (this._baseType instanceof BiSchemaComplexType) {
        this._attributeBag.composeBag(this._baseType.getAttributeBag(), BiSchemaAttributeBag.COMPOSEBAG_EXTEND_BAG);
    }
};
_p._loadSimpleContentRestriction = function (aSrcNode) {
    var lRestrictionNode = aSrcNode.selectSingleNode("xsd:restriction");
    var lBaseTypeFullName = BiXmlDefinitionsDocument.expandQname(lRestrictionNode.getAttribute("base"), lExtensionNode);
    this._baseType = this._schema.getType(lBaseTypeFullName);
    if (!this._baseType) {
        throw new BiSchemaError("Base type not found: " + lBaseTypeFullName);
    }
    this._contentType = BiSchemaComplexType.CONTENT_TYPE_SIMPLE;
    var lInlineSimpleTypeNode = lRestrictionNode.selectSingleNode("xsd:simpleType");
    if (lInlineSimpleTypeNode) {
        this._contentSimpleType = new BiSchemaSimpleType(this._schema, lInlineSimpleTypeNode);
        this._contentSimpleType.finishLoad();
    } else {
        if (this._baseType.getContentType() != BiSchemaComplexType.CONTENT_TYPE_SIMPLE) {
            throw new BiSchemaError("simpleContent restricted types must be derived from simpleContent complexTypes.");
        }
        this._contentSimpleType = this._baseType.getContentSimpleType();
    }
    this._attributeBag = new BiSchemaAttributeBag(this._schema, lRestrictionNode);
    this._attributeBag.composeBag(this._baseType.getAttributeBag(), BiSchemaAttributeBag.COMPOSEBAG_RESTRICT_BAG);
};
_p._loadComplexContentExtension = function (aSrcNode) {
    var lExtensionNode = aSrcNode.selectSingleNode("xsd:extension");
    var lBaseTypeFullName = BiXmlDefinitionsDocument.expandQname(lExtensionNode.getAttribute("base"), lExtensionNode);
    this._baseType = this._schema.getComplexType(lBaseTypeFullName);
    var bt = this._baseType;
    if (!bt) {
        throw new BiSchemaError("Base type not found: " + lBaseTypeFullName);
    }
    this._contentType = BiSchemaComplexType.CONTENT_TYPE_PARTICLE;
    var lExtParticle = null;
    var lTestNode = lExtensionNode.selectSingleNode("xsd:group");
    if (!lTestNode) lTestNode = lExtensionNode.selectSingleNode("xsd:all");
    if (!lTestNode) lTestNode = lExtensionNode.selectSingleNode("xsd:choice");
    if (!lTestNode) lTestNode = lExtensionNode.selectSingleNode("xsd:sequence");
    if (lTestNode) {
        lExtParticle = BiSchemaParticle.loadParticle(this._schema, lTestNode);
    }
    if (!lExtParticle) {
        this._particle = bt.getParticle();
    } else {
        var baseTypeParticle = bt.getParticle ? bt.getParticle() : bt._particle;
        if (baseTypeParticle) {
            this._particle = lExtParticle;
            var aParticles = baseTypeParticle.getTerm()._particles;
            for (var i = 0; i < aParticles.length; i++) this._particle.getTerm()._particles.push(aParticles[i]);
        } else {
            this._particle = lExtParticle;
        }
    }
    this._attributeBag = new BiSchemaAttributeBag(this._schema, lExtensionNode);
    var baseBag = bt.getAttributeBag ? bt.getAttributeBag() : bt._attributeBag;
    this._attributeBag.composeBag(baseBag, BiSchemaAttributeBag.COMPOSEBAG_EXTEND_BAG);
};
_p._loadComplexContentRestriction = function (aSrcNode) {
    var lRestrictionNode = aSrcNode.selectSingleNode("xsd:restriction");
    var lBaseTypeFullName = BiXmlDefinitionsDocument.expandQname(lRestrictionNode.getAttribute("base"), lRestrictionNode);
    this._baseType = this._schema.getComplexType(lBaseTypeFullName);
    if (!this._baseType) {
        throw new BiSchemaError("Base type not found: " + lBaseTypeFullName);
    }
    this._contentType = BiSchemaComplexType.CONTENT_TYPE_PARTICLE;
    var lRestParticle = null;
    var lTestNode = lRestrictionNode.selectSingleNode("xsd:group");
    if (!lTestNode) lTestNode = lRestrictionNode.selectSingleNode("xsd:all");
    if (!lTestNode) lTestNode = lRestrictionNode.selectSingleNode("xsd:choice");
    if (!lTestNode) lTestNode = lRestrictionNode.selectSingleNode("xsd:sequence");
    if (lTestNode) {
        lRestParticle = BiSchemaParticle.loadParticle(this._schema, lTestNode);
    }
    this._particle = lRestParticle;
    this._attributeBag = new BiSchemaAttributeBag(this._schema, lRestrictionNode);
    this._attributeBag.composeBag(this._baseType.getAttributes(), BiSchemaAttributeBag.COMPOSEBAG_RESTRICT_BAG);
};
_p.finishLoad = function () {
    var lTestNode = this._xmlSrc.selectSingleNode("xsd:simpleContent");
    if (lTestNode) {
        if (lTestNode.selectSingleNode("xsd:extension")) {
            this._loadSimpleContentExtension(lTestNode);
        } else {
            this._loadSimpleContentRestriction(lTestNode);
        }
    } else {
        lTestNode = this._xmlSrc.selectSingleNode("xsd:complexContent");
        if (lTestNode) {
            if (lTestNode.selectSingleNode("xsd:extension")) {
                this._loadComplexContentExtension(lTestNode);
            } else {
                this._loadComplexContentRestriction(lTestNode);
            }
        } else {
            lTestNode = this._xmlSrc.selectSingleNode("xsd:group");
            if (!lTestNode) lTestNode = this._xmlSrc.selectSingleNode("xsd:all");
            if (!lTestNode) lTestNode = this._xmlSrc.selectSingleNode("xsd:choice");
            if (!lTestNode) lTestNode = this._xmlSrc.selectSingleNode("xsd:sequence");
            if (lTestNode) {
                this._loadDirectModel(lTestNode);
            } else {
                this._contentType = BiSchemaComplexType.CONTENT_TYPE_PARTICLE;
                this._particle = null;
            }
            this._attributeBag = new BiSchemaAttributeBag(this._schema, this._xmlSrc);
        }
    }
};
_p.getContentType = function () {
    return this._contentType;
};
_p.getContentParticle = function () {
    return this._particle;
};
_p.getContentSimpleType = function () {
    return this._contentSimpleType;
};
_p.getAttributes = function () {
    return this._attributeBag;
};
BiSchemaComplexType.CONTENT_TYPE_SIMPLE = 0;
BiSchemaComplexType.CONTENT_TYPE_PARTICLE = 1;

function BiSchemaAttr(aSchema, aAttrDefNode, aGlobal) {
    if (_biInPrototype) return;
    if (aGlobal || aAttrDefNode.getAttribute("form") == "qualified" || (!aAttrDefNode.getAttribute("form") && aSchema.getAttrFormDefault() == "qualified")) {
        this._targetNamespace = aSchema.getTargetNamespace();
    } else {
        this._targetNamespace = "";
    }
    this._name = aAttrDefNode.getAttribute("name");
    this._schema = aSchema;
    this._srcXml = aAttrDefNode;
}
_p = _biExtend(BiSchemaAttr, Object, "BiSchemaAttr");
_p.finishLoad = function () {
    var lTypeDefNode = this._srcXml.selectSingleNode("xsd:simpleType");
    if (lTypeDefNode) {
        this._type = new BiSchemaSimpleType(this._schema, lTypeDefNode);
        this._type.finishLoad();
    } else if (this._srcXml.getAttribute("type")) {
        this._type = this._schema.getType(BiXmlDefinitionsDocument.expandQname(this._srcXml.getAttribute("type"), this._srcXml));
    } else {
        this._type = this._schema.getType("[http://www.w3.org/2001/XMLSchema]anySimpleType");
    } if (this._srcXml.getAttribute("fixed")) {
        this._fixedVal = this._srcXml.getAttribute("fixed");
    }
};
_p.getName = function () {
    return this._name;
};
_p.getFixed = function () {
    return this._fixedVal;
};
_p.getExpandedQName = function () {
    return "[" + this._targetNamespace + "]" + this._name;
};
_p.getType = function () {
    return this._type;
};

function BiSchemaElement(aSchema, aElementDefNode, aGlobal) {
    if (_biInPrototype) return;
    if (aGlobal || aElementDefNode.getAttribute("form") == "qualified" || (!aElementDefNode.getAttribute("form") && aSchema.getElementFormDefault() == "qualified")) {
        this._targetNamespace = aSchema.getTargetNamespace();
    } else {
        this._targetNamespace = "";
    }
    this._name = aElementDefNode.getAttribute("name");
    this._srcXml = aElementDefNode;
    this._schema = aSchema;
    this._type = null;
}
_p = _biExtend(BiSchemaElement, Object, "BiSchemaElement");
_p.finishLoad = function () {
    if (this._srcXml.getAttribute("type")) {
        var lExpandedTypeName = BiXmlDefinitionsDocument.expandQname(this._srcXml.getAttribute("type"), this._srcXml);
        this._type = this._schema.getType(lExpandedTypeName);
    } else {
        var lSimpleTypeNode = this._srcXml.selectSingleNode("xsd:simpleType");
        if (lSimpleTypeNode) {
            this._type = new BiSchemaSimpleType(this._schema, lSimpleTypeNode);
            this._type.finishLoad();
        } else {
            var lComplexTypeNode = this._srcXml.selectSingleNode("xsd:complexType");
            if (lComplexTypeNode) {
                this._type = new BiSchemaComplexType(this._schema, lComplexTypeNode);
                this._type.finishLoad();
            }
        }
    }
    this._nillable = this._srcXml.getAttribute("nillable");
    if (this._type instanceof BiSchemaComplexType && this._type.getContentType && this._type.getContentType() == 1 && this._type.getContentParticle && (!this._type.getContentParticle() || this._type.getContentParticle()._optional)) {
        this._nillable = true;
    }
};
_p.getName = function () {
    return this._name;
};
_p.getNamespace = function () {
    return this._targetNamespace;
};
_p.getExpandedQName = function () {
    return "[" + this._targetNamespace + "]" + this._name;
};
_p.getNillable = function () {
    return this._nillable;
};
_p.getType = function () {
    return this._type;
};
_p.toString = function () {
    return "Element " + this.getExpandedQName();
};

function BiSchemaGroupDef(aSchema, aGroupDefNode) {
    if (_biInPrototype) return;
    var lTestNode = aGroupDefNode.selectSingleNode("xsd:all");
    if (!lTestNode) lTestNode = aGroupDefNode.selectSingleNode("xsd:choice");
    if (!lTestNode) lTestNode = aGroupDefNode.selectSingleNode("xsd:sequence");
    this._loadedNode = lTestNode;
    this._schema = aSchema;
}
_p = _biExtend(BiSchemaGroupDef, Object, "BiSchemaGroupDef");
_p.finishLoad = function () {
    this._modelGroup = BiSchemaModelGroup.loadModelGroup(this._schema, this._loadedNode);
};
_p.getModelGroup = function () {
    return this._modelGroup;
};

function BiSchemaAttrGroupDef(aSchema, aAttrGroupDefNode) {
    if (_biInPrototype) return;
    this._schema = aSchema;
    this._srcXml = aAttrGroupDefNode;
}
_p = _biExtend(BiSchemaAttrGroupDef, Object, "BiSchemaAttrGroupDef");
_p.finishLoad = function () {
    this._attrs = new BiSchemaAttributeBag(this._schema, this._srcXml);
};
_p.getAttributes = function () {
    return this._attrs;
};

function BiSchema() {
    if (_biInPrototype) return;
    BiXmlDefinitionsDocument.call(this);
    this._simpleTypes = new BiWsdlDefinitionDictionary(this, "xsd:simpleType", "@name", function (aSimpleTypeNode, aSchema) {
        return new BiSchemaSimpleType(aSchema, aSimpleTypeNode);
    });
    this._complexTypes = new BiWsdlDefinitionDictionary(this, "xsd:complexType", "@name", function (aComplexTypeNode, aSchema) {
        return new BiSchemaComplexType(aSchema, aComplexTypeNode);
    });
    this._attrs = new BiWsdlDefinitionDictionary(this, "xsd:attribute", "@name", function (aAttrDefNode, aSchema) {
        return new BiSchemaAttr(aSchema, aAttrDefNode, true);
    });
    this._elements = new BiWsdlDefinitionDictionary(this, "xsd:element", "@name", function (aElementDefNode, aSchema) {
        return new BiSchemaElement(aSchema, aElementDefNode, true);
    });
    this._groupDefs = new BiWsdlDefinitionDictionary(this, "xsd:group", "@name", function (aGroupDefNode, aSchema) {
        return new BiSchemaGroupDef(aSchema, aGroupDefNode);
    });
    this._attrGroupDefs = new BiWsdlDefinitionDictionary(this, "xsd:attributeGroup", "@name", function (aAttrGroupDefNode, aSchema) {
        return new BiSchemaAttrGroupDef(aSchema, aAttrGroupDefNode);
    });
    this._simpleTypes.addImport(BiSchemaPrimitiveType.PRIMITIVE_TYPES_DEFINITIONS_DICTIONARY);
}
_p = _biExtend(BiSchema, BiXmlDefinitionsDocument, "BiSchema");
_p.dispose = function () {
    if (this._disposed) return;
    this._simpleTypes.dispose();
    this._simpleTypes = null;
    this._complexTypes.dispose();
    this._complexTypes = null;
    this._attrs.dispose();
    this._attrs = null;
    this._elements.dispose();
    this._elements = null;
    this._groupDefs.dispose();
    this._groupDefs = null;
    this._attrGroupDefs.dispose();
    this._attrGroupDefs = null;
    BiXmlDefinitionsDocument.prototype.dispose.call(this);
};
_p._initiallyProcessDocument = function () {
    var lSchemaRootQname = BiXmlDefinitionsDocument.parseExpandedQname(BiXmlDefinitionsDocument.expandQname(this._xmlSource.tagName, this._xmlSource));
    if ((lSchemaRootQname.ns != "http://www.w3.org/2001/XMLSchema" && lSchemaRootQname.ns != "http://www.w3.org/1999/XMLSchema") || lSchemaRootQname.localName != "schema") {
        throw new BiWebServiceError("Invalid schema document; missing <xsd:schema> tag.");
    }
    this._xmlSource.ownerDocument.setProperty("SelectionNamespaces", "xmlns:wsdl='http://schemas.xmlsoap.org/wsdl/' " + "xmlns:xsd='" + lSchemaRootQname.ns + "' " + "xmlns:soap='http://schemas.xmlsoap.org/wsdl/soap/'");
    this._xmlSource.ownerDocument.setProperty("SelectionLanguage", "XPath");
    this._targetNs = "";
    var lTnsNode = this._xmlSource.selectSingleNode("@targetNamespace");
    if (lTnsNode) {
        this._targetNs = lTnsNode.nodeValue;
    }
    this._elementFormDefault = this._xmlSource.getAttribute("elementFormDefault");
    this._attrFormDefault = this._xmlSource.getAttribute("attributeFormDefault");
};
_p._getImports = function () {
    var lResImports = [];
    var lIncludes = this._xmlSource.selectNodes("xsd:include");
    var lImportIdx, lImportNode, lImportedDoc, lImportDesc, lLocation;
    for (lImportIdx = 0; lImportIdx < lIncludes.length; lImportIdx++) {
        lImportNode = lIncludes[lImportIdx];
        lImportedDoc = new BiSchema();
        lImportDesc = new BiXmlDefinitionsDocumentImportDesc(lImportedDoc);
        lImportDesc.importType = "include";
        lLocation = new BiUri(this._baseLocation, lImportNode.getAttribute("schemaLocation")).toString();
        lImportedDoc.setSource(lLocation);
        lResImports.push(lImportDesc);
    }
    var lImports = this._xmlSource.selectNodes("xsd:import[@schemaLocation]");
    for (lImportIdx = 0; lImportIdx < lImports.length; lImportIdx++) {
        lImportNode = lImports[lImportIdx];
        lImportedDoc = new BiSchema();
        lImportDesc = new BiXmlDefinitionsDocumentImportDesc(lImportedDoc);
        lImportDesc.importType = "import";
        lImportDesc.importNamespace = lImportNode.getAttribute("namespace");
        lLocation = new BiUri(this._baseLocation, lImportNode.getAttribute("schemaLocation")).toString();
        lImportedDoc.setSource(lLocation);
        lResImports.push(lImportDesc);
    }
    return lResImports;
};
_p._processImport = function (aImportedDoc, aImportDesc) {
    if (aImportDesc.importType == "include") {
        if (this.getTargetNamespace() != aImportedDoc.getTargetNamespace()) {
            throw new BiSchemaError("<xsd:include>ed schema's target namespace doesn't " + "match the including schema's target namespace in " + this._baseLocation);
        }
    } else {
        if (aImportedDoc.getTargetNamespace() != aImportDesc.importNamespace) {
            throw new BiSchemaError("<xsd:import>ed schema " + aImportedDoc._baseLocation + " defines in target namespace " + aImportedDoc.getTargetNamespace() + " but imported to namespace " + aImportDesc.importNamespace);
        }
    }
    this.importSchema(aImportedDoc);
};
_p._processLocalDefinitions = function () {
    this._simpleTypes.loadDefinitions();
    this._complexTypes.loadDefinitions();
    this._attrs.loadDefinitions();
    this._elements.loadDefinitions();
    this._groupDefs.loadDefinitions();
    this._attrGroupDefs.loadDefinitions();
};
_p.importSchema = function (aImportedDoc) {
    this._simpleTypes.addImport(aImportedDoc._simpleTypes);
    this._complexTypes.addImport(aImportedDoc._complexTypes);
    this._attrs.addImport(aImportedDoc._attrs);
    this._elements.addImport(aImportedDoc._elements);
    this._groupDefs.addImport(aImportedDoc._groupDefs);
    this._attrGroupDefs.addImport(aImportedDoc._attrGroupDefs);
};
_p.getTargetNamespace = function () {
    return this._targetNs;
};
_p.getElementFormDefault = function () {
    return this._elementFormDefault;
};
_p.getAttrFormDefault = function () {
    return this._attrFormDefault;
};
_p.getSimpleType = function (aItemName) {
    return this._simpleTypes.getItem(aItemName);
};
_p.getComplexType = function (aItemName) {
    return this._complexTypes.getItem(aItemName);
};
_p.getAttribute = function (aItemName) {
    return this._attrs.getItem(aItemName);
};
_p.getElement = function (aItemName) {
    return this._elements.getItem(aItemName);
};
_p.getGroupDef = function (aItemName) {
    return this._groupDefs.getItem(aItemName);
};
_p.getAttributeGroup = function (aItemName) {
    return this._attrGroupDefs.getItem(aItemName);
};
_p.getType = function (aItemName) {
    var lRes = this._simpleTypes.getItem(aItemName);
    if (!lRes) {
        lRes = this._complexTypes.getItem(aItemName);
    }
    return lRes;
};

function BiWebServiceError(aMessage) {
    if (_biInPrototype) return;
    Error.call(this, aMessage);
    this.errMessage = aMessage;
}
_p = _biExtend(BiWebServiceError, Error, "BiWebServiceError");
_p.toString = function () {
    return this.errMessage;
};

function BiWsdlProtocolInfoFactory(aBindingTypeDetector, aBindingProtocolInfoClass, aBindingOpProtocolInfoClass, aPortProtocolInfoClass) {
    if (_biInPrototype) return;
    this.detectBindingType = aBindingTypeDetector;
    this._bindingInfoClass = aBindingProtocolInfoClass;
    this._bindingOpInfoClass = aBindingOpProtocolInfoClass;
    this._portInfoClass = aPortProtocolInfoClass;
}
_p = _biExtend(BiWsdlProtocolInfoFactory, Object, "BiWsdlProtocolInfoFactory");
_p.createBindingProtocolInfo = function (aParentBinding, aBindingNode) {
    return new this._bindingInfoClass(aParentBinding, aBindingNode);
};
_p.createBindingOpProtocolInfo = function (aParentOp, aBindingOpNode) {
    return new this._bindingOpInfoClass(aParentOp, aBindingOpNode);
};
_p.createPortProtocolInfo = function (aParentPort, aPortNode) {
    return new this._portInfoClass(aParentPort, aPortNode);
};
ShowDalert = false;

function dalert(aMsg) {
    if (ShowDalert) {
        WScript.Echo(aMsg);
    }
};

function BiWsdlBinding(aParent, aSrcNode) {
    if (_biInPrototype) return;
    this._srcXml = aSrcNode;
    this._portType = aParent.getPortTypes().getItem(BiXmlDefinitionsDocument.expandQname(this._srcXml.getAttribute("type"), this._srcXml));
    this._bindingProtocol = BiWsdlBinding.detectBindingProtocolType(this._srcXml);
    this._protocolInfo = this.getBindingProtocolInfoFactory().createBindingProtocolInfo(this, this._srcXml);
    this._operations = new Object();
    var lBindingOps = this._srcXml.selectNodes("wsdl:operation");
    for (var lOpIdx = 0; lOpIdx < lBindingOps.length; lOpIdx++) {
        var lOpNode = lBindingOps[lOpIdx];
        this._operations[lOpNode.getAttribute("name")] = new BiWsdlBindingOperation(this, lOpNode);
    }
}
_p = _biExtend(BiWsdlBinding, Object, "BiWsdlBinding");
_p.getPortType = function () {
    return this._portType;
};
_p.getBindingProtocol = function () {
    return this._bindingProtocol;
};
_p.getBindingProtocolInfoFactory = function () {
    return BiWsdlBinding.getProtocolInfoFactory(this._bindingProtocol);
};
_p.getBindingProtocolInfo = function () {
    return this._protocolInfo;
};
_p.getOperationNames = function () {
    return this._portType.getOperationNames();
};
_p.getOperation = function (aOpName) {
    return this._operations[aOpName];
};
BiWsdlBinding.registerBindingProtocol = function (aProtocolType, aFactory) {
    BiWsdlBinding.protocolInfoFactories[aProtocolType] = aFactory;
};
BiWsdlBinding.getProtocolInfoFactory = function (aProtocolType) {
    return BiWsdlBinding.protocolInfoFactories[aProtocolType];
};
BiWsdlBinding.detectBindingProtocolType = function (aBindingNode) {
    for (var lProtoType = 1; lProtoType < BiWsdlBinding.protocolInfoFactories.length; lProtoType++) {
        if (BiWsdlBinding.protocolInfoFactories[lProtoType].detectBindingType(aBindingNode)) {
            return lProtoType;
        }
    }
    return BiWsdlBinding.BINDING_PROTOCOL_UNKNOWN;
};
BiWsdlBinding.BINDING_PROTOCOL_UNKNOWN = 0;
BiWsdlBinding.BINDING_PROTOCOL_SOAP = 1;
BiWsdlBinding.protocolInfoFactories = new Array();

function BiWsdlBindingUnknownProtocolInfoFactory() {
    if (_biInPrototype) return;
    this.createBindingProtocolInfo = function (aParentBinding, aBindingNode) {
        return null;
    };
    this.createBindingOpProtocolInfo = function (aParentOp, aBindingOpNode) {
        return null;
    };
    this.createPortProtocolInfo = function (aParentPort, aPortNode) {
        return null;
    };
}
_biExtend(BiWsdlBindingUnknownProtocolInfoFactory, Object, "BiWsdlBindingUnknownProtocolInfoFactory");
BiWsdlBinding.registerBindingProtocol(BiWsdlBinding.BINDING_PROTOCOL_UNKNOWN, new BiWsdlBindingUnknownProtocolInfoFactory());

function BiWsdlServicePort(aService, aSrcNode) {
    if (_biInPrototype) return;
    this._service = aService;
    this._name = aSrcNode.getAttribute("name");
    var lPortFullName = BiXmlDefinitionsDocument.expandQname(aSrcNode.getAttribute("binding"), aSrcNode);
    var lPortBinding = aService.getWsdl().getBindings().getItem(lPortFullName);
    if (!lPortBinding) {
        throw new BiWebServiceError("Service " + aService.getName() + ": Could not find binding " + lPortFullName);
    }
    this._binding = lPortBinding;
    this._protocolInfo = this.getBinding().getBindingProtocolInfoFactory().createPortProtocolInfo(this, aSrcNode);
}
_p = _biExtend(BiWsdlServicePort, Object, "BiWsdlServicePort");
_p.getBinding = function () {
    return this._binding;
};
_p.getService = function () {
    return this._service;
};
_p.getPortName = function () {
    return this._name;
};
_p.getProtocolInfo = function () {
    return this._protocolInfo;
};

function BiWsdlService(aWsdl, aNode) {
    if (_biInPrototype) return;
    this._xmlSource = aNode;
    this._wsdl = aWsdl;
    this._name = "[" + aWsdl.getTargetNamespace() + "]" + aNode.getAttribute("name");
    this._documentation = "";
    var lDocNode = this._xmlSource.selectSingleNode("wsdl:documentation");
    if (lDocNode != null) {
        this._documentation = lDocNode.text;
    }
    this._portNames = new Array();
    this._ports = new Object();
    this._portBindings = new Object();
    var lPortNodes = this._xmlSource.selectNodes("wsdl:port");
    for (var lIdx = 0; lIdx < lPortNodes.length; lIdx++) {
        var lPortNode = lPortNodes[lIdx];
        var lPortName = lPortNode.getAttribute("name");
        this._portNames[lIdx] = lPortName;
        this._ports[lPortName] = new BiWsdlServicePort(this, lPortNode);
    }
}
_p = _biExtend(BiWsdlService, Object, "BiWsdlService");
_p.getPortNames = function () {
    return this._portNames;
};
_p.getPort = function (aPortName) {
    return this._ports[aPortName];
};
_p.getPortDefinitionNode = function (aPortName) {
    return this._portNodes[aPortName];
};
_p.getName = function () {
    return this._name;
};
_p.getWsdl = function () {
    return this._wsdl;
};

function BiWsdlPortType(aParent, aNode) {
    if (_biInPrototype) return;
    this._xmlSource = aNode;
    this._name = BiXmlDefinitionsDocument.expandQname(aNode.getAttribute("name"), aNode);
    var lOpNodes = aNode.selectNodes("wsdl:operation");
    this._operationNames = new Array();
    this._operations = new Object();
    for (var lOpIdx = 0; lOpIdx < lOpNodes.length; lOpIdx++) {
        var lOpNode = lOpNodes[lOpIdx];
        var lOpName = lOpNode.getAttribute("name");
        this._operationNames[lOpIdx] = lOpName;
        this._operations[lOpName] = new BiWsdlPortOperation(aParent, lOpNode);
    }
}
_p = _biExtend(BiWsdlPortType, Object, "BiWsdlPortType");
_p.getOperationNames = function () {
    return this._operationNames;
};
_p.getOperation = function (aName) {
    return this._operations[aName];
};
_p.getName = function () {
    return this._name;
};

function BiWsdlBindingOperation(aParentBinding, aNode) {
    if (_biInPrototype) return;
    this._binding = aParentBinding;
    this._loadFromBindingOpNode(aNode);
}
_p = _biExtend(BiWsdlBindingOperation, Object, "BiWsdlBindingOperation");
_p._loadFromBindingOpNode = function (aOpNode) {
    this._opName = aOpNode.getAttribute("name");
    this._portOperation = this._binding.getPortType().getOperation(this._opName);
    this._protocolInfo = this.getBinding().getBindingProtocolInfoFactory().createBindingOpProtocolInfo(this, aOpNode);
};
_p.getProtocolInfo = function () {
    return this._protocolInfo;
};
_p.getBinding = function () {
    return this._binding;
};
_p.getPortOperation = function () {
    return this._portOperation;
};
_p.getInputMessage = function () {
    return this._portOperation.getInputMessage();
};
_p.getOutputMessage = function () {
    return this._portOperation.getOutputMessage();
};

function BiWsdlPortOperation(aParent, aNode) {
    if (_biInPrototype) return;
    this._name = aNode.getAttribute("name");
    var lNodeChildren = aNode.childNodes;
    if (lNodeChildren.length == 1) {
        if (lNodeChildren[0].tagName == "input") {
            this._opType = this.OPTYPE_ONE_WAY;
        } else if (lNodeChildren[0].tagName == "output") {
            this._opType = this.OPTYPE_NOTIFICATION;
        }
    } else {
        if (lNodeChildren[0].tagName == "input") {
            this._opType = this.OPTYPE_REQUEST_RESPONSE;
        } else if (lNodeChildren[0].tagName == "output") {
            this._opType = this.OPTYPE_SOLICIT_RESPONSE;
        }
    }
    this._inputMessage = null;
    this._outputMessage = null;
    var lInputNode = aNode.selectSingleNode("wsdl:input");
    if (lInputNode != null) {
        var lInpMsgQName = BiXmlDefinitionsDocument.expandQname(lInputNode.getAttribute("message"), lInputNode);
        this._inputMessage = aParent.getMessages().getItem(lInpMsgQName);
    }
    var lOutputNode = aNode.selectSingleNode("wsdl:output");
    if (lOutputNode != null) {
        var lOutMsgQName = BiXmlDefinitionsDocument.expandQname(lOutputNode.getAttribute("message"), lOutputNode);
        this._outputMessage = aParent.getMessages().getItem(lOutMsgQName);
    }
}
_p = _biExtend(BiWsdlPortOperation, Object, "BiWsdlPortOperation");
_p.getOpType = function () {
    return this._opType;
};
_p.getOutputMessage = function () {
    return this._outputMessage;
};
_p.getInputMessage = function () {
    return this._inputMessage;
};
_p.getName = function () {
    return this._name;
};
_p.OPTYPE_ONE_WAY = "one-way";
_p.OPTYPE_NOTIFICATION = "notification";
_p.OPTYPE_REQUEST_RESPONSE = "request-response";
_p.OPTYPE_SOLICIT_RESPONSE = "solicit-response";

function BiWsdlMessage(aParent, aNode) {
    if (_biInPrototype) return;
    this._partNames = new Array();
    this._parts = new Object();
    var lPartNodes = aNode.selectNodes("wsdl:part");
    for (var lPartNodeIdx = 0; lPartNodeIdx < lPartNodes.length; lPartNodeIdx++) {
        var lPartNode = lPartNodes[lPartNodeIdx];
        var lPartNodeName = lPartNode.getAttribute("name");
        this._partNames[lPartNodeIdx] = lPartNodeName;
        this._parts[lPartNodeName] = new BiWsdlMessagePart(aParent, lPartNode);
    }
}
_p = _biExtend(BiWsdlMessage, Object, "BiWsdlMessage");
_p.getPartNames = function () {
    return this._partNames;
};
_p.getPart = function (aPartName) {
    return this._parts[aPartName];
};

function BiWsdlMessagePart(aParent, aNode, aDefWsdl) {
    if (_biInPrototype) return;
    this._name = aNode.getAttribute("name");
    if (aNode.getAttribute("type")) {
        var lTypeName = BiXmlDefinitionsDocument.expandQname(aNode.getAttribute("type"), aNode);
        this._type = aParent.getSchema().getType(lTypeName);
        if (!this._type) {
            throw new BiWebServiceError("Could not resolve type " + lTypeName);
        }
    } else if (aNode.getAttribute("element")) {
        var lElemName = BiXmlDefinitionsDocument.expandQname(aNode.getAttribute("element"), aNode);
        this._element = aParent.getSchema().getElement(lElemName);
        if (!this._element) {
            throw new BiWebServiceError("Could not resolve element " + lElemName);
        }
    }
}
_p = _biExtend(BiWsdlMessagePart, Object, "BiWsdlMessagePart");
_p.getName = function () {
    return this._name;
};
_p.getType = function () {
    return this._type;
};
_p.getElement = function () {
    return this._element;
};

function BiWsdl() {
    if (_biInPrototype) return;
    BiXmlDefinitionsDocument.call(this);
    this._messages = new BiWsdlDefinitionDictionary(this, "wsdl:message", "@name", function (aMessageNode, aWsdl) {
        return new BiWsdlMessage(aWsdl, aMessageNode);
    });
    this._portTypes = new BiWsdlDefinitionDictionary(this, "wsdl:portType", "@name", function (aPortNode, aWsdl) {
        return new BiWsdlPortType(aWsdl, aPortNode);
    });
    this._bindings = new BiWsdlDefinitionDictionary(this, "wsdl:binding", "@name", function (aBindingNode, aWsdl) {
        return new BiWsdlBinding(aWsdl, aBindingNode);
    });
    this._services = new BiWsdlDefinitionDictionary(this, "wsdl:service", "@name", function (aServiceNode, aWsdl) {
        return new BiWsdlService(aWsdl, aServiceNode);
    });
    this._schema = new BiWsdlSchema();
}
_p = _biExtend(BiWsdl, BiXmlDefinitionsDocument, "BiWsdl");
_p.dispose = function () {
    if (this._disposed) return;
    this._messages.dispose();
    this._messages = null;
    this._portTypes.dispose();
    this._portTypes = null;
    this._bindings.dispose();
    this._bindings = null;
    this._services.dispose();
    this.services = null;
    this._schema.dispose();
    this._schema = null;
    BiXmlDefinitionsDocument.prototype.dispose.call(this);
};
_p._initiallyProcessDocument = function () {
    if (BiXmlDefinitionsDocument.expandQname(this._xmlSource.tagName, this._xmlSource) != "[http://schemas.xmlsoap.org/wsdl/]definitions") {
        throw new BiWebServiceError("Invalid WSDL document; missing <wsdl:definitions> tag.");
    }
    this._xmlSource.ownerDocument.setProperty("SelectionNamespaces", "xmlns:wsdl='http://schemas.xmlsoap.org/wsdl/' xmlns:ms='urn:schemas-microsoft-com:xslt' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/wsdl/soap/'");
    this._targetNs = "";
    var lTnsNode = this._xmlSource.selectSingleNode("@targetNamespace");
    if (lTnsNode) {
        this._targetNs = lTnsNode.nodeValue;
    }
};
_p._getImports = function () {
    var lResImports = [];
    var lImportsList = this._xmlSource.selectNodes("wsdl:import");
    var lImportIdx, lImportedDoc, lImportDesc;
    for (lImportIdx = 0; lImportIdx < lImportsList.length; lImportIdx++) {
        var lImportNode = lImportsList[lImportIdx];
        lImportedDoc = new BiWsdl();
        lImportDesc = new BiXmlDefinitionsDocumentImportDesc(lImportedDoc);
        lImportDesc.importType = "wsdl";
        lImportDesc.importedNamespace = lImportNode.getAttribute("namespace");
        var lLocation = new BiUri(this._baseLocation, lImportNode.getAttribute("location")).toString();
        lImportedDoc.setSource(lLocation);
        lResImports.push(lImportDesc);
    }
    var lSchemasList = this._xmlSource.selectNodes("wsdl:types/xsd:schema");
    for (lImportIdx = 0; lImportIdx < lSchemasList.length; lImportIdx++) {
        lImportedDoc = new BiSchema();
        lImportedDoc.importSchema(BiWsdlSchema.getWsdlBuiltinTypesSchema());
        lImportDesc = new BiXmlDefinitionsDocumentImportDesc(lImportedDoc);
        lImportDesc.importType = "schema";
        lImportedDoc.setSource(lSchemasList[lImportIdx], this._baseLocation);
        lResImports.push(lImportDesc);
    }
    return lResImports;
};
_p._processImport = function (aImportedDoc, aImportDesc) {
    if (aImportDesc.importType == "wsdl") {
        if (aImportedDoc.getTargetNamespace() != aImportDesc.importedNamespace) {
            throw new BiWebServiceError("Namespace specified in imported WSDL (" + aImportedDoc.getTargetNamespace() + ") conflicts with namespace specified in <import> tag (" + aImportDesc.importedNamespace + "); occurred in " + aImportedDoc._baseLocation);
        }
        this._messages.addImport(aImportedDoc._messages);
        this._portTypes.addImport(aImportedDoc._portTypes);
        this._bindings.addImport(aImportedDoc._bindings);
        this._services.addImport(aImportedDoc._services);
    } else if (aImportDesc.importType == "schema") {
        this._schema.importSchema(aImportedDoc);
    } else {
        throw new BiWebServiceError("Weird WSDL import: " + aImportDesc.importType);
    }
};
_p._processLocalDefinitions = function () {
    this._messages.loadDefinitions();
    this._portTypes.loadDefinitions();
    this._bindings.loadDefinitions();
    this._services.loadDefinitions();
};
_p.getTargetNamespace = function () {
    return this._targetNs;
};
_p.getServices = function () {
    return this._services;
};
_p.getBindings = function () {
    return this._bindings;
};
_p.getPortTypes = function () {
    return this._portTypes;
};
_p.getMessages = function () {
    return this._messages;
};
_p.getSchema = function () {
    return this._schema;
};

function BiWsdlSchema() {
    if (_biInPrototype) return;
    this._simpleTypes = new BiWsdlDefinitionDictionary(this, "xsd:simpleType", "@name", function (aSimpleTypeNode, aSchema) {
        return new BiSchemaSimpleType(aSchema, aSimpleTypeNode);
    });
    this._complexTypes = new BiWsdlDefinitionDictionary(this, "xsd:complexType", "@name", function (aComplexTypeNode, aSchema) {
        return new BiSchemaComplexType(aSchema, aComplexTypeNode);
    });
    this._attrs = new BiWsdlDefinitionDictionary(this, "xsd:attribute", "@name", function (aAttrDefNode, aSchema) {
        return new BiSchemaAttr(aSchema, aAttrDefNode, true);
    });
    this._elements = new BiWsdlDefinitionDictionary(this, "xsd:element", "@name", function (aElementDefNode, aSchema) {
        return new BiSchemaElement(aSchema, aElementDefNode, true);
    });
    this._groupDefs = new BiWsdlDefinitionDictionary(this, "xsd:group", "@name", function (aGroupDefNode, aSchema) {
        return new BiSchemaGroupDef(aSchema, aGroupDefNode);
    });
    this._attrGroupDefs = new BiWsdlDefinitionDictionary(this, "xsd:attributeGroup", "@name", function (aAttrGroupDefNode, aSchema) {
        return new BiSchemaAttrGroupDef(aSchema, aAttrGroupDefNode);
    });
    this._simpleTypes.addImport(BiSchemaPrimitiveType.PRIMITIVE_TYPES_DEFINITIONS_DICTIONARY);
}
_p = _biExtend(BiWsdlSchema, Object, "BiWsdlSchema");
_p.dispose = function () {
    this._simpleTypes.dispose();
    this._simpleTypes = null;
    this._complexTypes.dispose();
    this._complexTypes = null;
    this._attrs.dispose();
    this._attrs = null;
    this._elements.dispose();
    this._elements = null;
    this._groupDefs.dispose();
    this._groupDefs = null;
    this._attrGroupDefs.dispose();
    this._attrGroupDefs = null;
};
_p.importSchema = function (aImportedDoc) {
    this._simpleTypes.addImport(aImportedDoc._simpleTypes);
    this._complexTypes.addImport(aImportedDoc._complexTypes);
    this._attrs.addImport(aImportedDoc._attrs);
    this._elements.addImport(aImportedDoc._elements);
    this._groupDefs.addImport(aImportedDoc._groupDefs);
    this._attrGroupDefs.addImport(aImportedDoc._attrGroupDefs);
};
_p.getSimpleType = function (aItemName) {
    return this._simpleTypes.getItem(aItemName);
};
_p.getComplexType = function (aItemName) {
    return this._complexTypes.getItem(aItemName);
};
_p.getAttribute = function (aItemName) {
    return this._attrs.getItem(aItemName);
};
_p.getElement = function (aItemName) {
    return this._elements.getItem(aItemName);
};
_p.getGroupDef = function (aItemName) {
    return this._groupDefs.getItem(aItemName);
};
_p.getAttributeGroup = function (aItemName) {
    return this._attrGroupDefs.getItem(aItemName);
};
_p.getType = function (aItemName) {
    var lRes = this._simpleTypes.getItem(aItemName);
    if (!lRes) {
        lRes = this._complexTypes.getItem(aItemName);
    }
    return lRes;
};
_p.getTargetNamespace = function () {
    return "";
};
_p.getXml = function () {
    return null;
};
BiWsdlSchema.getWsdlBuiltinTypesSchema = function () {
    if (!BiWsdlSchema._wsdlBuiltinTypesSchema) {
        BiWsdlSchema._wsdlBuiltinTypesSchema = new BiSchema();
        var lDoc = BiXmlLoader.load(new BiUri(application.getPath(), "BiWsdlBuiltinTypes.xsd"));
        if (lDoc.xml == "") lDoc = BiXmlLoader.load("http://schemas.xmlsoap.org/soap/encoding");
        BiWsdlSchema._wsdlBuiltinTypesSchema.setSource(lDoc.documentElement);
        BiWsdlSchema._wsdlBuiltinTypesSchema.load(false);
    }
    return BiWsdlSchema._wsdlBuiltinTypesSchema;
};

function BiWsdlSoapPortProtocolInfo(aPort, aSrcNode) {
    if (_biInPrototype) return;
    this._address = aSrcNode.selectSingleNode("soap:address/@location").nodeValue;
}
_p = _biExtend(BiWsdlSoapPortProtocolInfo, Object, "BiWsdlSoapPortProtocolInfo");
_p.getAddress = function () {
    return this._address;
};

function BiWsdlBindingOpSoapInfo(aBindingOp, aSrcNode) {
    if (_biInPrototype) return;
    this._bindingOp = aBindingOp;
    this._inputParts = [];
    this._outputParts = [];
    var lSoapBindingNode = aSrcNode.selectSingleNode("soap:operation");
    this._soapAction = lSoapBindingNode.getAttribute("soapAction");
    this._soapStyle = lSoapBindingNode.getAttribute("style");
    if (!this._soapAction || this._soapAction == "") this._soapAction = "undefined";
    if (!this._soapStyle || this._soapStyle == "") {
        this._soapStyle = this._bindingOp.getBinding().getBindingProtocolInfo().getDefaultBindingStyle();
    }
    var lPartsSpec, lPartNames, lIdx;
    if (this._bindingOp.getInputMessage()) {
        var lInputSpecNode = aSrcNode.selectSingleNode("wsdl:input/soap:body");
        lPartsSpec = lInputSpecNode.getAttribute("parts");
        if (!lPartsSpec || lPartsSpec == "") {
            lPartNames = this._bindingOp.getInputMessage().getPartNames();
        } else {
            lPartNames = lPartsSpec.split(" ");
        }
        for (lIdx = 0; lIdx < lPartNames.length; lIdx++) {
            this._inputParts.push(this._bindingOp.getInputMessage().getPart(lPartNames[lIdx]));
        }
        this._inputUse = lInputSpecNode.getAttribute("use");
        this._inputEncodingStyle = lInputSpecNode.getAttribute("encodingStyle");
        this._inputNamespace = lInputSpecNode.getAttribute("namespace");
    }
    if (this._bindingOp.getOutputMessage()) {
        var lOutputSpecNode = aSrcNode.selectSingleNode("wsdl:output/soap:body");
        lPartsSpec = lOutputSpecNode.getAttribute("parts");
        if (!lPartsSpec || lPartsSpec == "") {
            lPartNames = this._bindingOp.getOutputMessage().getPartNames();
        } else {
            lPartNames = lPartsSpec.split(" ");
        }
        for (lIdx = 0; lIdx < lPartNames.length; lIdx++) {
            this._outputParts.push(this._bindingOp.getOutputMessage().getPart(lPartNames[lIdx]));
        }
        this._outputUse = lOutputSpecNode.getAttribute("use");
        this._outputEncodingStyle = lOutputSpecNode.getAttribute("encodingStyle");
        this._outputNamespace = lOutputSpecNode.getAttribute("namespace");
    }
}
_p = _biExtend(BiWsdlBindingOpSoapInfo, Object, "BiWsdlBindingOpSoapInfo");
_p.getInputUse = function () {
    return this._inputUse;
};
_p.getInputParts = function () {
    return this._inputParts;
};
_p.getInputEncodingStyle = function () {
    return this._inputEncodingStyle;
};
_p.getInputNamespace = function () {
    return this._inputNamespace;
};
_p.getOutputUse = function () {
    return this._outputUse;
};
_p.getOutputParts = function () {
    return this._outputParts;
};
_p.getOutputEncodingStyle = function () {
    return this._outputEncodingStyle;
};
_p.getOutputNamespace = function () {
    return this._outputNamespace;
};
_p.getSoapAction = function () {
    return this._soapAction;
};
_p.getSoapStyle = function () {
    return this._soapStyle;
};

function BiWsdlBindingSoapInfo(aParentBinding, aBindingNode) {
    if (_biInPrototype) return;
    aBindingNode = aBindingNode.selectSingleNode("soap:binding");
    this._soapDefaultBindingStyle = aBindingNode.getAttribute("style") == "rpc" ? "rpc" : "document";
    this._soapTransport = aBindingNode.getAttribute("transport");
}
_p = _biExtend(BiWsdlBindingSoapInfo, Object, "BiWsdlBindingSoapInfo");
_p.getDefaultBindingStyle = function () {
    return this._soapDefaultBindingStyle;
};
_p.getTransport = function () {
    return this._soapTransport;
};
BiWsdlBindingSoapInfo.detectSoapBinding = function (aNode) {
    return Boolean(aNode.selectSingleNode("soap:binding"));
};
BiWsdlBindingSoapInfo.SOAP_BINDING_TRANSPORT_HTTP = "http://schemas.xmlsoap.org/soap/http";
BiWsdlBinding.registerBindingProtocol(BiWsdlBinding.BINDING_PROTOCOL_SOAP, new BiWsdlProtocolInfoFactory(BiWsdlBindingSoapInfo.detectSoapBinding, BiWsdlBindingSoapInfo, BiWsdlBindingOpSoapInfo, BiWsdlSoapPortProtocolInfo));

function BiWsOpHandler(aParent) {
    if (_biInPrototype) return;
    this._service = aParent;
    this._invokedPort = null;
    this._invokedOp = null;
    this._callContext = null;
}
_p = _biExtend(BiWsOpHandler, Object, "BiWsOpHandler");
_p.dispose = function () {
    this._service = null;
    this._callContext = null;
};
_p.setInvokedPort = function (aPort) {
    this._invokedPort = aPort;
};
_p.setInvokedOp = function (aBoundOperation) {
    this._invokedOp = aBoundOperation;
    this._invokedOpSoapInfo = this._invokedOp.getProtocolInfo();
};
_p.setInvocationArgs = function (aArgs) {
    this._invokedArgs = aArgs;
};
_p.setCallContext = function (aCallContextOb) {
    this._callContext = aCallContextOb;
};
_p.getCallContext = function () {
    return this._callContext;
};
_p.syncInvoke = function () {
    throw new BiWebServiceError("BiWsOpHandler derivatives must implement syncInvoke.");
};
_p.asyncInvoke = function () {
    throw new BiWebServiceError("BiWsOpHandler derivatives must implement asyncInvoke.");
};

function BiWsCallCompleteEvent(aCall, aResult, aError) {
    if (_biInPrototype) return;
    BiEvent.call(this, "callcomplete");
    this._result = aResult;
    this._error = aError;
    this._call = aCall;
}
_p = _biExtend(BiWsCallCompleteEvent, BiEvent, "BiWsCallCompleteEvent");
_p.getError = function () {
    return Boolean(this._error);
};
_p.getCall = function () {
    return this._call;
};
_p.getErrorObject = function () {
    return this._error;
};
_p.getResult = function () {
    return this._result;
};

function BiWebService2() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._wsdl = new BiWsdl();
    this._wsdl.addEventListener("loaded", this._onWsdlLoaded, this);
    this._serviceOps = {};
    this._callContextStack = [new Object()];
    this._service = null;
    this._serviceName = "";
    this._async = false;
}
_p = _biExtend(BiWebService2, BiEventTarget, "BiWebService2");
_p.getAsync = function () {
    return this._async;
};
_p.setAsync = function (aValue) {
    this._async = aValue;
};
_p.useService = function (aWsdlUri, aServiceName, aAsync) {
    if (typeof (aAsync) == "undefined") {
        aAsync = this._async;
    }
    this._uri = aWsdlUri || this._uri;
    this._serviceName = aServiceName || this._serviceName;
    this._wsdl.setSource(this._uri);
    this._wsdl.load(aAsync);
    if (!aAsync && !this._service) {
        throw new BiWebServiceError("Service " + aServiceName + " not found in WSDL.");
    }
};
_p.getWsdl = function () {
    return this._wsdl;
};
_p.syncInvoke = function (aOpName, other) {
    return this._internalInvoke(false, aOpName, arguments, 1);
};
_p.asyncInvoke = function (aOpName, other) {
    return this._internalInvoke(true, aOpName, arguments, 1);
};
_p.callMethod = function (aOpName, other) {
    return this._internalInvoke(this._async, aOpName, arguments, 1);
};
_p.getLoaded = function () {
    return this._service != null;
};
_p.pushCallContext = function (aContext, aAdditive) {
    if (aAdditive) {
        var lCurCallContext = this._callContextStack[this._callContextStack.length - 1];
        for (var lFld in lCurCallContext) {
            if (!lFld in aContext) {
                aContext[lFld] = lCurCallContext[lFld];
            }
        }
    }
    this._callContextStack.push(aContext);
};
_p.popCallContext = function () {
    this._callContextStack.pop();
};
_p.clear = function () {
    try {
        this._wsdl.dispose();
    } catch (e) {}
    this._wsdl = null;
    this._serviceOps = null;
    delete this._serviceOps;
    this._callContextStack = null;
    delete this._callContextStack;
    this._service = null;
    delete this._service;
    this._serviceName = null;
    delete this._serviceName;
    for (var sServiceName in this.services) {
        for (var sOperationName in this.services[sServiceName]) delete this.services[sServiceName][sOperationName];
        delete this.services[sServiceName];
    }
    delete this.services;

};
_p.reInitialize = function () {
    if (Object.isEmpty(this._serviceOps)) return;
    this.clear();
    this._wsdl = new BiWsdl();
    this._wsdl.addEventListener("loaded", this._onWsdlLoaded, this);
    this._serviceOps = {};
    this._callContextStack = [new Object()];
    this._service = null;
    this._serviceName = "";
};
_p.dispose = function () {
    this.clear();
    BiEventTarget.prototype.dispose.call(this);
};
_p._internalInvoke = function (aAsync, aOpName, aArgs, aArgsStartIndex) {
    if (!this._serviceOps[aOpName]) {
        throw new BiWebServiceError("Operation " + aOpName + " does not exist.");
    }
    var lOpHandler = this._getOperationHandler(this._serviceOps[aOpName]);
    lOpHandler.setInvocationArgs(this._createArgsObjectFromFnArgs(this._serviceOps[aOpName].getOp(), aArgs, aArgsStartIndex));
    lOpHandler.setCallContext(this._callContextStack[this._callContextStack.length - 1]);
    if (aAsync) {
        lOpHandler.asyncInvoke();
        return lOpHandler;
    } else {
        var lRes;
        lRes = lOpHandler.syncInvoke();
        this._releaseOpHandler(lOpHandler);
        return lRes;
    }
};
_p._onWsdlLoaded = function (aEvt) {
    if (aEvt.err) {
        this._dispatchLoadErrEvent(aEvt.err);
        return;
    }
    this._processLoadedWsdl();
    this._dispatchLoadEvent();
};
_p._processLoadedWsdl = function () {
    if (this._serviceName) {
        this._service = this._wsdl.getServices().getItem(this._serviceName);
        if (!this._service) throw new Error("Service " + this._serviceName + " not found in WSDL.");
        else this._processService(this._service);
    } else {
        if (this._wsdl.getServices().getCount() == 0) {
            alert("No services have been loaded from: " + this._uri + "!");
            return "Error: The WSDL file could not be loaded correctly!";
        }
        var aServicesNames = this._wsdl.getServices().getKeys();
        for (var i = 0; i < aServicesNames.length; i++) {
            this._service = this._wsdl.getServices().getItem(aServicesNames[i]);
            this._processService(this._service);
        }
    }
};
_p._processService = function (oService) {
    var lPortNames = oService.getPortNames();
    if (!this.services) this.services = new Object;
    var sServiceName = this._service._xmlSource.getAttribute("name");
    var oServiceHash = this.services[sServiceName] = new Object;
    oServiceHash._webService = this;
    for (var lIdx = 0; lIdx < lPortNames.length; lIdx++) {
        var lCurPortName = lPortNames[lIdx];
        var lCurPort = this._service.getPort(lPortNames[lIdx]);
        if (lCurPort.getBinding().getBindingProtocol() != BiWsdlBinding.BINDING_PROTOCOL_UNKNOWN) {
            var lPortOpNames = lCurPort.getBinding().getOperationNames();
            for (var lIdx2 = 0; lIdx2 < lPortOpNames.length; lIdx2++) {
                this._setupOperation(lCurPort, lPortOpNames[lIdx2]);
                var aOperationHandler = new Array;
                aOperationHandler.push('new Function( "return this._webService.callMethod( \\\"' + lPortOpNames[lIdx2] + '\\\"');
                var nParts = lCurPort.getBinding().getOperation(lPortOpNames[lIdx2]).getInputMessage().getPartNames().length;
                for (var j = 0; j < nParts; j++) aOperationHandler.push(", arguments[ " + j + " ]");
                aOperationHandler.push(' );" );');
                oServiceHash[lPortOpNames[lIdx2]] = eval(aOperationHandler.join(""));
            }
        }
    }
};
_p._setupOperation = function (aServicePort, aOpName) {
    var lOp = new BiWebService2OpDesc(aServicePort, aServicePort.getBinding().getOperation(aOpName));
    this._serviceOps[aServicePort.getPortName() + "." + aOpName] = lOp;
    if (!this._serviceOps[aOpName]) {
        this._serviceOps[aOpName] = lOp;
    }
    var lPortTypeBasedOpName = aServicePort.getBinding().getPortType().getName() + "." + aOpName;
    if (!this._serviceOps[lPortTypeBasedOpName]) {
        this._serviceOps[lPortTypeBasedOpName] = lOp;
    }
};
_p._getOperationHandler = function (aOperationDesc) {
    var lOpHandler;
    if (aOperationDesc.getOp().getBinding().getBindingProtocol() == BiWsdlBinding.BINDING_PROTOCOL_SOAP) {
        lOpHandler = new BiWsSoapOpHandler(this);
    }
    lOpHandler.setInvokedPort(aOperationDesc.getPort());
    lOpHandler.setInvokedOp(aOperationDesc.getOp());
    return lOpHandler;
};
_p._releaseOpHandler = function (aCall) {
    aCall.dispose();
};
_p._createArgsObjectFromFnArgs = function (aOp, aPositionalArray, aArgsStart) {
    var lRes = new Object();
    var lInputPartNames = aOp.getInputMessage().getPartNames();
    var lArgIdx = aArgsStart;
    var lPartIdx = 0;
    while (lArgIdx < aPositionalArray.length && lPartIdx < lInputPartNames.length) {
        lRes[lInputPartNames[lPartIdx++]] = aPositionalArray[lArgIdx++];
    }
    return lRes;
};
_p._dispatchLoadEvent = function () {
    var lEvt = new BiEvent("serviceloaded");
    this.dispatchEvent(lEvt);
    lEvt.dispose();
};
_p._dispatchLoadErrEvent = function (aErr) {
    var lEvt = new BiEvent("serviceloaded");
    lEvt.err = aErr;
    this.dispatchEvent(lEvt);
    delete lEvt.err;
    lEvt.dispose();
};
_p._dispatchAsyncInvokeErr = function (aCall, aError) {
    var lEvt = new BiWsCallCompleteEvent(aCall, null, aError);
    this.dispatchEvent(lEvt);
    this._releaseOpHandler(aCall);
    lEvt.dispose();
};
_p._dispatchAsyncInvokeResult = function (aCall, aResult) {
    var lEvt = new BiWsCallCompleteEvent(aCall, aResult);
    this.dispatchEvent(lEvt);
    this._releaseOpHandler(aCall);
};
BiWebService2.addProperty("uri", BiAccessType.READ_WRITE);
BiWebService2.addProperty("serviceName", BiAccessType.READ_WRITE);
_p.getLastRequest = function () {
    return this._lastRequest;
};
_p.getService = function (sServiceName) {
    return this.services[sServiceName];
};
_p.getOperation = function (sServiceName, sOperationName) {
    return this.services[sServiceName][sOperationName];
};
_p.getServicesList = function () {
    var aServicesArray = new Array;
    var oServices = this._wsdl._services._loadedObjects;
    for (var sCompleteServiceName in oServices) {
        var xService = oServices[sCompleteServiceName]._xmlSource;
        var oDescription = {
            name: xService.getAttribute("name")
        };
        var xDocumentation = xService.selectSingleNode((xService.prefix ? xService.prefix + ":" : "") + "documentation");
        if (xDocumentation) oDescription.documentation = xDocumentation.text;
        aServicesArray.push(oDescription);
    }
    return aServicesArray;
};
_p.getOperationsList = function (sServiceName) {
    var aOperations = new Array;
    for (var sOperationName in this.services[sServiceName]) {
        if (sOperationName == "_webService") continue;
        var oDescription = {
            name: sOperationName
        };
        var xPortTypes = this._serviceOps[sOperationName]._op._binding._portType._xmlSource;
        var sXPathQuery = (xPortTypes.prefix ? xPortTypes.prefix + ":" : "") + "operation[@name='" + sOperationName + "']/" + (xPortTypes.prefix ? xPortTypes.prefix + ":" : "") + "documentation";
        var xDocumentation = xPortTypes.selectSingleNode(sXPathQuery);
        if (xDocumentation) oDescription.documentation = xDocumentation.text;
        aOperations.push(oDescription);
    }
    return aOperations;
};
_p.getWebServiceDescription = function () {
    var aServices = this.getServicesList();
    var sDescription = "";
    for (var i = 0; i < aServices.length; i++) {
        sDescription += ("Service: " + aServices[i].name + "\r\r");
        if (aServices[i].documentation) sDescription += "\tDocumentation: " + aServices[i].documentation + "\r\r";
        var aOperations = this.getOperationsList(aServices[i].name);
        for (var j = 0; j < aOperations.length; j++) {
            sDescription += ("\tOperation: " + aOperations[j].name + "\r\r");
            if (aOperations[j].documentation) sDescription += ("\t\tDocumentation: " + aOperations[j].documentation + "\r\r");
            sDescription += ("\t\tInput arguments:\r");
            var aInputMessageParts = this.getInputArguments(aOperations[j].name);
            sDescription += (aInputMessageParts.join(",\r").replace(/^/gm, "\t\t\t") + "\r\r");
            sDescription += ("\t\tOutput arguments:\r");
            var aOutputMessageParts = this.getOutputArguments(aOperations[j].name);
            sDescription += (aOutputMessageParts.join("\r").replace(/^/gm, "\t\t\t") + "\r\r");
        }
        sDescription += ("\r\r");
    }
    return sDescription;
};
_p.getInputArguments = function (sOperationName) {
    if (!this._serviceOps[sOperationName]) return "Error: The operation doesn't exist!";
    var oInputMessage = this._serviceOps[sOperationName]._op._portOperation._inputMessage;
    return this.serializeWsdlMessage(oInputMessage, true);
};
_p.getOutputArguments = function (sOperationName) {
    if (!this._serviceOps[sOperationName]) return "Error: The operation doesn't exist!";
    var oOutputMessage = this._serviceOps[sOperationName]._op._portOperation._outputMessage;
    return this.serializeWsdlMessage(oOutputMessage, false);
};
_p.serializeWsdlMessage = function (oWsdlMessage, bDisplayPartName) {
    var aPartsArray = new Array;
    var aPartNames = oWsdlMessage._partNames;
    for (var i = 0; i < aPartNames.length; i++) {
        var oPart = oWsdlMessage.getPart(aPartNames[i]);
        aPartsArray.push((bDisplayPartName ? "\"" + oPart._name + "\": " : "") + this.serializeSchemaTypeOrElement(oPart._type || oPart._element, true));
    }
    return aPartsArray;
};
_p.serializeSchemaTypeOrElement = function (oSchemaNode, bHideQuotationMarks) {
    if (oSchemaNode instanceof BiSchemaType) {
        if (oSchemaNode instanceof BiSchemaSimpleContentType) {
            if (oSchemaNode instanceof BiSchemaPrimitiveType) {
                return oSchemaNode._name.replace(/\[http:\/\/www\.w3\.org\/2001\/XMLSchema\]/, "");
            } else {
                switch (oSchemaNode._derivationMethod) {
                case BiSchemaSimpleType.DERIVATION_METHOD_RESTRICTION:
                    if (oSchemaNode._xmlSrc.childNodes[0].childNodes.length == 0) {
                        return this.serializeSchemaTypeOrElement(oSchemaNode._baseTypes[0]);
                    } else {
                        var sDescription = "";
                        var aChildNodes = oSchemaNode._xmlSrc.childNodes[0].childNodes;
                        for (var i = 0; i < aChildNodes.length; i++) {
                            switch (aChildNodes[i].baseName) {
                            case "minExclusive":
                                sDescription += "(minExc: ";
                                break;
                            case "minInclusive":
                                sDescription += "(minInc: ";
                                break;
                            case "maxExclusive":
                                sDescription += "(maxExc: ";
                                break;
                            case "maxInclusive":
                                sDescription += "(maxInc: ";
                                break;
                            case "totalDigits":
                                sDescription += "(totalDigits: ";
                                break;
                            case "fractionDigits":
                                sDescription += "(fractionDigits: ";
                                break;
                            case "length":
                                sDescription += "(length: ";
                                break;
                            case "minLength":
                                sDescription += "(minLength: ";
                                break;
                            case "maxLength":
                                sDescription += "(maxLength: ";
                                break;
                            case "enumeration":
                                sDescription += "(@";
                                break;
                            case "whiteSpace":
                                sDescription += "(whiteSpace: ";
                                break;
                            case "pattern":
                                sDescription += "(pattern: ";
                                break;
                            }
                            sDescription += aChildNodes[i].getAttribute("value") + ")";
                        }
                        return this.serializeSchemaTypeOrElement(oSchemaNode._baseTypes[0]) + "( " + sDescription + " )";
                    }
                    break;
                case BiSchemaSimpleType.DERIVATION_METHOD_LIST:
                    return "List: " + this.serializeSchemaTypeOrElement(oSchemaNode._baseTypes[0]);
                    break;
                case BiSchemaSimpleType.DERIVATION_METHOD_UNION:
                    var sDescription = "Union:\r";
                    for (var i = 0; i < oSchemaNode._baseTypes.length; i++) sDescription += (this.serializeSchemaTypeOrElement(oSchemaNode._baseTypes[i]).replace(/^/gm, "\t") + "\r");
                    return sDescription;
                    break;
                }
            }
        } else if (oSchemaNode instanceof BiSchemaComplexType) {
            var oArrayType = oSchemaNode._attributeBag._attrByName["[http://schemas.xmlsoap.org/soap/encoding/]arrayType"];
            if (oArrayType) {
                var oArrayBaseType = oArrayType._wsdlArrayBaseType;
                var sArraySubscripts = oArrayType._wsdlArraySubscripts;
                if (!oArrayBaseType) {
                    alert("Array type not specified for type: " + oSchemaNode._xmlSource.xml);
                    return "Error: invalid array type!";
                }
                var sName = (/\[.*\](.*)/.test(oArrayBaseType)) ? RegExp.$1 : oArrayBaseType;
                return sArraySubscripts + sName + " -> " + this.serializeSchemaTypeOrElement(oSchemaNode._schema.getType(oArrayBaseType));
            } else if (oSchemaNode._particle) {
                if (oSchemaNode.getContentType) {
                    switch (oSchemaNode._contentType) {
                    case BiSchemaComplexType.CONTENT_TYPE_SIMPLE:
                        break;
                    case BiSchemaComplexType.CONTENT_TYPE_PARTICLE:
                        if (oSchemaNode._particle) {
                            if (oSchemaNode._name) {
                                var sName = oSchemaNode._name + " ";
                                if (/\[.*\](.*)/.test(sName)) sName = RegExp.$1;
                            } else {
                                var sName = "";
                            }
                            return sName + this.serializeSchemaTypeOrElement(oSchemaNode._particle);
                        } else {
                            if (oSchemaNode._attributeBag._attributes.length) {
                                var aPartDescription = new Array;
                                var aAttributes = oSchemaNode.getAttributes().getAttributes();
                                for (var j = 0; j < aAttributes.length; j++) aPartDescription.push(GetPartDescription(aAttributes[j].getAttr()));
                                return aPartDescription.join("\r");
                            } else {
                                return "null";
                            }
                        }
                        break;
                    }
                } else if (oSchemaNode instanceof BiSchemaSimpleType && oSchemaNode.getBaseTypes) {
                    var aPartDescription = new Array;
                    var aBaseTypes = oSchemaNode.getBaseTypes();
                    for (var j = 0; j < aBaseTypes.length; j++) aPartDescription.push(GetPartDescription(aBaseTypes[j]));
                    return aPartDescription.join("") + oSchemaNode.getName();
                } else {
                    throw new BiWebServiceError("Error: Schema node");
                }
            } else {
                return "-> (NULL)";
            }
        }
    } else if (oSchemaNode instanceof BiSchemaElement) {
        return (bHideQuotationMarks ? oSchemaNode._name + " " : "\"" + oSchemaNode._name + "\": ") + this.serializeSchemaTypeOrElement(oSchemaNode._type);
    } else if (oSchemaNode instanceof BiSchemaParticle) {
        return "( min: " + oSchemaNode._minOc + ", max: " + (oSchemaNode._maxOc ? oSchemaNode._maxOc : "unbounded") + " ) " + this.serializeSchemaTypeOrElement(oSchemaNode._term);
    } else if (oSchemaNode instanceof BiSchemaModelGroup) {
        var aDescription = new Array;
        var aParticles = oSchemaNode._particles;
        for (var j = 0; j < aParticles.length; j++) aDescription.push(this.serializeSchemaTypeOrElement(aParticles[j]));
        switch (oSchemaNode._className) {
        case "BiSchemaAllModelGroup":
            var sDescription = "(All)\r{\r";
            break;
        case "BiSchemaChoiceModelGroup":
            var sDescription = "(Choice)\r{\r";
            break;
        case "BiSchemaSequenceModelGroup":
            var sDescription = "(Sequence)\r{\r";
            break;
        }
        return sDescription + aDescription.join(",\r").replace(/^/gm, "\t") + "\r}";
    } else if (oSchemaNode instanceof BiSchemaWildcard) {
        return "anyType";
    }
};
_p.getInputArgumentsObject = function (sOperationName) {
    if (!this._serviceOps[sOperationName]) return "Error: The operation doesn't exist!";
    var oInputMessage = this._serviceOps[sOperationName]._op._portOperation._inputMessage;
    this._aInputBindableObjects = [];
    var oResult = this.serializeWsdlMessageIntoObject(oInputMessage, this._aInputBindableObjects);
    this._oInputBindableObject = oResult.oBindableObject;
    this._aInputBindableObjects.reverse();
    return oResult.aWsdlObject;
};
_p.getOutputArgumentsObject = function (sOperationName) {
    if (!this._serviceOps[sOperationName]) return "Error: The operation doesn't exist!";
    var oOutputMessage = this._serviceOps[sOperationName]._op._portOperation._outputMessage;
    this._aOutputBindableObjects = [];
    var oResult = this.serializeWsdlMessageIntoObject(oOutputMessage, this._aOutputBindableObjects);
    this._oOutputBindableObject = oResult.oBindableObject;
    this._aOutputBindableObjects.reverse();
    return oResult.aWsdlObject;
};
_p.serializeWsdlMessageIntoObject = function (oWsdlMessage, aBindableObjects) {
    var aPartsArray = new Array;
    var aPartNames = oWsdlMessage._partNames;
    if (aPartNames.length) {
        for (var i = 0; i < aPartNames.length; i++) {
            var oPart = oWsdlMessage.getPart(aPartNames[i]);
            var oResult = this.serializeSchemaTypeOrElementIntoObject(oPart._type || oPart._element);
            oResult.partName = oPart._name;
            aPartsArray.push(oResult);
        }
    } else {
        aPartsArray.push({
            type: {
                type: "empty",
                schemaType: "empty"
            },
            name: "empty",
            nillable: true
        });
    }
    var oBindableObject = this.getBindableObject(aPartsArray, "", aBindableObjects);
    return {
        aWsdlObject: aPartsArray,
        oBindableObject: oBindableObject
    };
};
_p.serializeSchemaTypeOrElementIntoObject = function (oSchemaNode) {
    if (oSchemaNode instanceof BiSchemaType) {
        if (oSchemaNode instanceof BiSchemaSimpleContentType) {
            if (oSchemaNode instanceof BiSchemaPrimitiveType) {
                var oResult = new Object;
                oResult.type = {
                    schemaType: "primitive",
                    type: oSchemaNode._name.replace(/\[http:\/\/www\.w3\.org\/2001\/XMLSchema\]/, "")
                };
                return oResult;
            } else {
                switch (oSchemaNode._derivationMethod) {
                case BiSchemaSimpleType.DERIVATION_METHOD_RESTRICTION:
                    if (oSchemaNode._xmlSrc.childNodes[0].childNodes.length == 0) {
                        return this.serializeSchemaTypeOrElementIntoObject(oSchemaNode._baseTypes[0]);
                    } else {
                        var oResult = this.serializeSchemaTypeOrElementIntoObject(oSchemaNode._baseTypes[0]);
                        oResult.restrictions = new Object;
                        var aChildNodes = oSchemaNode._xmlSrc.childNodes[0].childNodes;
                        for (var i = 0; i < aChildNodes.length; i++) {
                            switch (aChildNodes[i].baseName) {
                            case "minExclusive":
                                oResult.restrictions.minExc = aChildNodes[i].getAttribute("value");
                                break;
                            case "minInclusive":
                                oResult.restrictions.minInc = aChildNodes[i].getAttribute("value");
                                break;
                            case "maxExclusive":
                                oResult.restrictions.maxExc = aChildNodes[i].getAttribute("value");
                                break;
                            case "maxInclusive":
                                oResult.restrictions.maxInc = aChildNodes[i].getAttribute("value");
                                break;
                            case "totalDigits":
                                oResult.restrictions.totalDigits = aChildNodes[i].getAttribute("value");
                                break;
                            case "fractionDigits":
                                oResult.restrictions.fractionDigits = aChildNodes[i].getAttribute("value");
                                break;
                            case "length":
                                oResult.restrictions.length = aChildNodes[i].getAttribute("value");
                                break;
                            case "minLength":
                                oResult.restrictions.minLength = aChildNodes[i].getAttribute("value");
                                break;
                            case "maxLength":
                                oResult.restrictions.maxLength = aChildNodes[i].getAttribute("value");
                                break;
                            case "whiteSpace":
                                oResult.restrictions.whiteSpace = aChildNodes[i].getAttribute("value");
                                break;
                            case "pattern":
                                oResult.restrictions.pattern = aChildNodes[i].getAttribute("value");
                                break;
                            case "enumeration":
                                if (!oResult.restrictions.enumeration) oResult.restrictions.enumeration = new Array;
                                oResult.restrictions.enumeration.push(aChildNodes[i].getAttribute("value"));
                                break;
                            }
                        }
                        return oResult;
                    }
                    break;
                case BiSchemaSimpleType.DERIVATION_METHOD_LIST:
                    var oResult = this.serializeSchemaTypeOrElementIntoObject(oSchemaNode._baseTypes[0]);
                    oResult.list = true;
                    return oResult;
                    break;
                case BiSchemaSimpleType.DERIVATION_METHOD_UNION:
                    var oResult = new Object;
                    oResult.union = true;
                    oResult.types = new Array;
                    for (var i = 0; i < oSchemaNode._baseTypes.length; i++) oResult.types.push(this.serializeSchemaTypeOrElementIntoObject(oSchemaNode._baseTypes[i]));
                    return oResult;
                    break;
                }
            }
        } else if (oSchemaNode instanceof BiSchemaComplexType) {
            var oArrayType = oSchemaNode._attributeBag._attrByName["[http://schemas.xmlsoap.org/soap/encoding/]arrayType"];
            if (oArrayType) {
                var oArrayBaseType = oArrayType._wsdlArrayBaseType;
                var sArraySubscripts = oArrayType._wsdlArraySubscripts;
                if (!oArrayBaseType) {
                    alert("Array type not specified for type: " + oSchemaNode._xmlSource.xml);
                    return {
                        type: "Error: invalid array type!"
                    };
                }
                var sName = (/\[.*\](.*)/.test(oArrayBaseType)) ? RegExp.$1 : oArrayBaseType;
                var oResult = this.serializeSchemaTypeOrElementIntoObject(oSchemaNode._schema.getType(oArrayBaseType));
                oResult.name = sName;
                oResult.dimensions = sArraySubscripts;
                return oResult;
            } else if (oSchemaNode._particle) {
                if (oSchemaNode.getContentType) {
                    switch (oSchemaNode._contentType) {
                    case BiSchemaComplexType.CONTENT_TYPE_SIMPLE:
                        break;
                    case BiSchemaComplexType.CONTENT_TYPE_PARTICLE:
                        if (oSchemaNode._particle) {
                            if (oSchemaNode._name) {
                                var sName = oSchemaNode._name + " ";
                                if (/\[.*\](.*)/.test(sName)) sName = RegExp.$1;
                            } else {
                                var sName = "";
                            }
                            var oResult = this.serializeSchemaTypeOrElementIntoObject(oSchemaNode._particle);
                            oResult.name = sName;
                            return oResult;
                        } else {
                            if (oSchemaNode._attributeBag._attributes.length) {
                                var aPartDescription = new Array;
                                var aAttributes = oSchemaNode.getAttributes().getAttributes();
                                for (var j = 0; j < aAttributes.length; j++) aPartDescription.push(GetPartDescription(aAttributes[j].getAttr()));
                                return aPartDescription.join("\r");
                            } else {
                                return "null";
                            }
                        }
                        break;
                    }
                } else {
                    throw new BiWebServiceError("Error: Schema node");
                }
            } else {
                return {
                    type: {
                        type: "empty",
                        schemaType: "empty"
                    },
                    name: "empty",
                    nillable: true
                };
            }
        }
    } else if (oSchemaNode instanceof BiSchemaElement) {
        var oResult = this.serializeSchemaTypeOrElementIntoObject(oSchemaNode._type);
        oResult.elementName = oSchemaNode._name;
        return oResult;
    } else if (oSchemaNode instanceof BiSchemaParticle) {
        var oResult = this.serializeSchemaTypeOrElementIntoObject(oSchemaNode._term);
        oResult.restrictions = new Object;
        oResult.restrictions.minOc = Number(oSchemaNode._minOc);
        oResult.restrictions.maxOc = oSchemaNode._maxOc ? Number(oSchemaNode._maxOc) : "unbounded";
        return oResult;
    } else if (oSchemaNode instanceof BiSchemaModelGroup) {
        var oResult = new Object;
        oResult.type = new Object;
        oResult.type.particles = new Array;
        var aParticles = oSchemaNode._particles;
        for (var j = 0; j < aParticles.length; j++) oResult.type.particles.push(this.serializeSchemaTypeOrElementIntoObject(aParticles[j]));
        switch (oSchemaNode._className) {
        case "BiSchemaAllModelGroup":
            oResult.type.schemaType = "all";
            break;
        case "BiSchemaChoiceModelGroup":
            oResult.type.schemaType = "choice";
            break;
        case "BiSchemaSequenceModelGroup":
            oResult.type.schemaType = "sequence";
            break;
        }
        return oResult;
    } else if (oSchemaNode instanceof BiSchemaWildcard || typeof oSchema == "undefined") {
        return {
            type: {
                schemaType: "anytype"
            }
        };
    }
};
_p.getBindableObject = function (oObject, sObjectName, aBindableObjects) {
    var aBindableObject = [];
    if (typeof oObject == "undefined") {
        var oElement = {
            name: "anyType",
            type: "anyType",
            primitiveType: "anyType"
        };
        oElement.bindingName = (sObjectName ? sObjectName + ".anyType" : (oItem.partName ? "" : "anyType"));
        aBindableObject.push(oElement);
        aBindableObjects.push(oElement);
    } else if (oObject.length != undefined) {
        if (oObject.length) {
            for (var i = 0; i < oObject.length; i++) {
                var oItem = oObject[i];
                var oElement = {};
                var sName = oElement.name = oItem.partName || oItem.elementName || oItem.name;
                oElement.bindingName = (sObjectName ? sObjectName + "." + sName : (oItem.partName ? "" : sName));
                if (oItem.type.schemaType == "primitive") {
                    oElement.type = (oItem.partName ? "direct" : "element");
                    oElement.primitiveType = oItem.type.type;
                } else if (oItem.dimensions || (/^Array/.test(oItem.name) && oItem.name != "ArrayOfAnyType")) {
                    oElement.type = "array";
                    oElement.bindingName += (oItem.dimensions || "[]");
                    oElement.primitiveType = "array";
                    oElement.elements = this.getBindableObject(oItem.type.particles, oElement.bindingName, aBindableObjects);
                } else if (oItem.type.schemaType == "empty") {
                    oElement.type = "empty";
                    oElement.primitiveType = "empty";
                    oElement.nillable = true;
                } else if (oItem.type.schemaType == "anyType") {
                    oElement.type = "anyType";
                    oElement.primitiveType = "anyType";
                } else {
                    oElement.type = "object";
                    oElement.primitiveType = "object";
                    oElement.elements = this.getBindableObject(oItem.type.particles, oElement.bindingName, aBindableObjects);
                } if (oElement.elements && oElement.elements.length && oElement.elements[0].type == "empty") oElement.nillable = true;
                oElement.index = aBindableObject.length;
                aBindableObject.push(oElement);
                aBindableObjects.push(oElement);
                oItem.bindingObject = oElement;
            }
        } else {
            var oElement = {
                type: "empty",
                primitiveType: "empty",
                nillable: true
            };
            aBindableObject.push(oElement);
            aBindableObjects.push(oElement);
        }
    } else {}
    return aBindableObject;
};

function BiWebService2OpDesc(aServicePort, aBindingOp) {
    if (_biInPrototype) return;
    this._port = aServicePort;
    this._op = aBindingOp;
}
_p = _biExtend(BiWebService2OpDesc, BiObject, "BiWebService2OpDesc");
_p.getPort = function () {
    return this._port;
};
_p.getOp = function () {
    return this._op;
};

function BiWebServiceFaultError(aFaultCode, aFaultString, aFaultActor, aDetailNode) {
    if (_biInPrototype) return;
    BiWebServiceError.call(this, "SOAP Fault returned.\nCode: " + aFaultCode + ";\nDescription: " + aFaultString + (aFaultActor != "" ? (";\nActor: " + aFaultActor) : ""));
    this._code = aFaultCode;
    this._faultString = aFaultString;
    this._actor = aFaultActor;
    this._detail = aDetailNode;
}
_p = _biExtend(BiWebServiceFaultError, BiWebServiceError, "BiWebServiceFaultError");
_p.getCode = function () {
    return this._code;
};
_p.getFaultString = function () {
    return this._faultString;
};
_p.getActor = function () {
    return this._actor;
};
_p.getDetail = function () {
    return this._detail;
};

function BiWsSoapSerializerNsManager(aNsRoot) {
    if (_biInPrototype) return;
    this._nsPfx = {};
    this._nsPfxIdx = 30;
    this._nsDeclElem = aNsRoot;
    var lProbedElem = this._nsDeclElem;
    while (lProbedElem != null) {
        var lAttrs = lProbedElem.attributes;
        for (var lIdx = 0; lIdx < lAttrs.length; lIdx++) {
            if (lAttrs[lIdx].nodeName.slice(0, 6) == "xmlns:") {
                this._nsPfx[lAttrs[lIdx].nodeValue] = lAttrs[lIdx].nodeName.slice(6);
            }
        }
        do {
            lProbedElem = lProbedElem.parentNode;
        } while (lProbedElem && lProbedElem.nodeType != 1);
    }
}
_p = _biExtend(BiWsSoapSerializerNsManager, Object, "BiWsSoapSerializerNsManager");
_p.getNsPrefix = function (aNs) {
    if (!this._nsPfx[aNs]) {
        var lNewPfx = "ns" + this._nsPfxIdx++;
        this._nsPfx[aNs] = lNewPfx;
        this._nsDeclElem.setAttribute("xmlns:" + lNewPfx, aNs);
    }
    return this._nsPfx[aNs];
};

function BiWsSoapSerializer() {}
_p = _biExtend(BiWsSoapSerializer, Object, "BiWsSoapSerializer");
_p.setSerializationOobRoot = function (aRoot) {
    this._oobRoot = aRoot;
};
_p.serializePartToElement = function (aPartDesc, aPartElement, aValue) {
    if (!aPartDesc.getType()) {
        this.serializeElement(aPartElement, aPartDesc.getElement(), aValue);
    } else {
        this.serializeType(aPartElement, aPartDesc.getType(), aValue);
    }
};
_p.serializeElement = function (aTargetElement, aElementDef, aValue) {
    throw new BiWebServiceError("BiWsSoapSerializer derivatives must override serializeElement.");
};
_p.serializeType = function (aTargetElement, aTypeDef, aValue) {
    throw new BiWebServiceError("BiWsSoapSerializer derivatives must override serializeType.");
};

function BiWsSoapSchemaBasedSerializer() {
    if (_biInPrototype) return;
    BiWsSoapSerializer.call(this);
    this._nsManager = null;
}
_p = _biExtend(BiWsSoapSchemaBasedSerializer, BiWsSoapSerializer, "BiWsSoapSchemaBasedSerializer");
_p.serializeType = function (aTargetElement, aType, aValue) {
    var lOldNsManager = this._nsManager;
    this._nsManager = new BiWsSoapSerializerNsManager(aTargetElement);
    this._internalSerializeType(aTargetElement, aType, aValue);
    this._nsManager = lOldNsManager;
};
_p.serializeElement = function (aTargetElement, aElement, aValue) {
    var lOldNsManager = this._nsManager;
    this._nsManager = new BiWsSoapSerializerNsManager(aTargetElement);
    this._internalSerializeElement(aTargetElement, aElement, aValue);
    this._nsManager = lOldNsManager;
};
_p._internalSerializeType = function (aTargetElement, aType, aValue) {
    if (aType.getName()) {
        var lTypeAttr = {
            "ns": "http://www.w3.org/2001/XMLSchema-instance",
            "localName": "type"
        };
        try {
            var lTypeQName = BiXmlDefinitionsDocument.parseExpandedQname(aType.getName());
            var lTypePfx = this._nsManager.getNsPrefix(lTypeQName.ns);
            var lTypeCName = lTypePfx + ":" + lTypeQName.localName;
        } catch (e) {
            var lTypeCName = aTargetElement.prefix + ":" + aType.getName();
        }
        this._createAttr(aTargetElement, lTypeAttr, lTypeCName);
    }
    var lSimpleType = null;
    if (aType instanceof BiSchemaSimpleContentType) {
        lSimpleType = aType;
    } else if (aType instanceof BiSchemaComplexType && aType.getContentType() == BiSchemaComplexType.CONTENT_TYPE_SIMPLE) {
        lSimpleType = aType.getContentSimpleType();
        if (aType.getAttributes().getAttrCount() != 0) {
            throw new BiWebServiceError("Don't know how to serialize a complexType with simpleContent and attributes.");
        }
    }
    if (lSimpleType) {
        var lSimpleTypeContent = aType.encodeJsValue(aValue);
        var lSimpleTypeContentNode = aTargetElement.ownerDocument.createNode(3, "", "");
        lSimpleTypeContentNode.nodeValue = lSimpleTypeContent;
        aTargetElement.appendChild(lSimpleTypeContentNode);
    } else {
        var lSerializedParticle = aType.getContentParticle();
        if (lSerializedParticle) {
            this._serializeParticle(aTargetElement, lSerializedParticle, aValue);
        }
        var lAttrs = aType.getAttributes().getAttributes();
        for (var lAttrIdx = 0; lAttrIdx < lAttrs.length; lAttrIdx++) {
            var lAttrUse = lAttrs[lAttrIdx];
            var lAttrNode, lAttrName = BiXmlDefinitionsDocument.parseExpandedQname(lAttrUse.getExpandedQName());
            var lMemberVal = aValue[lAttrName.localName];
            if (lMemberVal) {
                var lAttrVal = lAttrUse.getAttr().getType().encodeJsValue(lMemberVal);
                lAttrNode = this._createAttr(aTargetElement, lAttrName, lAttrVal);
            } else if (lAttrUse.getUseType() == BiSchemaAttrUse.USE_TYPE_REQUIRED) {
                if (lAttrUse.getAttr().getFixed()) {
                    lAttrNode = this._createAttr(aTargetElement, lAttrName, lAttrUse.getAttr().getFixed());
                } else {
                    throw new BiWebServiceError("A required non-fixed attribute " + lAttrName + " was not found.");
                }
            }
        }
    }
};
_p._internalSerializeElement = function (aTargetElement, aElement, aValue) {
    var lElem, lElemName = BiXmlDefinitionsDocument.parseExpandedQname(aElement.getExpandedQName());
    if (aValue == null || typeof (aValue) == "undefined") {
        if (aElement.getNillable()) {
            lElem = this._createElem(aTargetElement, lElemName);
            this._createAttr(lElem, BiXmlDefinitionsDocument.parseExpandedQname("[http://www.w3.org/2001/XMLSchema-instance]nil"), "1");
        } else {
            throw new BiWebServiceError("Attempt to serialize null value for non nullable element " + aElement.getExpandedQName());
        }
    } else {
        lElem = this._createElem(aTargetElement, lElemName);
        this._internalSerializeType(lElem, aElement.getType(), aValue);
    }
};
_p._serializeParticle = function (aTargetElement, aParticle, aValue, aAttemptOnly) {
    if (aParticle.getTerm() instanceof BiSchemaElement) {
        this._serializeParticleElement(aTargetElement, aParticle, aValue, aAttemptOnly);
    } else if (aParticle.getTerm() instanceof BiSchemaWildcard) {
        this._serializeParticleWildcard(aTargetElement, aParticle, aValue, aAttemptOnly);
    } else if (aParticle.getTerm() instanceof BiSchemaAllModelGroup) {
        this._serializeParticleAll(aTargetElement, aParticle, aValue, aAttemptOnly);
    } else if (aParticle.getTerm() instanceof BiSchemaSequenceModelGroup) {
        this._serializeParticleSequence(aTargetElement, aParticle, aValue, aAttemptOnly);
    } else if (aParticle.getTerm() instanceof BiSchemaChoiceModelGroup) {
        this._serializeParticleChoice(aTargetElement, aParticle, aValue, aAttemptOnly);
    } else {
        throw new BiWebServiceError("Don't know how to serialize particle term.");
    }
};
_p._serializeParticleAll = function (aTargetElement, aParticle, aValue, aAttemptOnly) {
    this._serializeParticleSequence(aTargetElement, aParticle, aValue, aAttemptOnly);
};
_p._serializeParticleSequence = function (aTargetElement, aParticle, aValue, aAttemptOnly) {
    var lParticles = aParticle.getTerm().getParticles();
    for (var lIdx = 0; lIdx < lParticles.length; lIdx++) {
        this._serializeParticle(aTargetElement, lParticles[lIdx], aValue, aAttemptOnly);
    }
};
_p._serializeParticleChoice = function (aTargetElement, aParticle, aValue, aAttemptOnly) {
    if (aParticle.getMinOccurs() != 1) {
        throw new BiWebServiceError("Don't know how to serialize a choice with minOccurs>1.");
    }
    var lParticles = aParticle.getTerm().getParticles();
    var lIdx = 0;
    var lFoundParticle = false;
    var lLastErr = null;
    while (lIdx < lParticles.length && !lFoundParticle) {
        this._serializeParticle(aTargetElement, lParticles[lIdx], aValue, true);
        lFoundParticle = true;
        if (!lFoundParticle) {
            lIdx++;
        }
    }
    if (lFoundParticle) {
        if (!aAttemptOnly) {
            this._serializeParticle(aTargetElement, lParticles[lIdx], aValue, false);
        }
    } else {
        throw new BiWebServiceError("Choice particle not satisfied; last option returned " + lLastErr.toString());
    }
};
_p._serializeParticleElement = function (aTargetElement, aParticle, aValue, aAttemptOnly) {
    var lMaxOccurs = aParticle.getMaxOccurs();
    var lMinOccurs = aParticle.getMinOccurs();
    var lSeredValue = aValue[aParticle.getTerm().getName()];
    if ((!lMaxOccurs || lMaxOccurs > 1) && (aParticle.getTerm() instanceof BiSchemaElement) && lSeredValue != null && (lSeredValue instanceof Array)) {
        if ((lSeredValue.length < lMinOccurs) || (lMaxOccurs && (lSeredValue.length > lMaxOccurs))) {
            throw new BiWebServiceError("Array extends beyond particle occurance bounds.");
        }
        for (var lIdx = 0; lIdx < lSeredValue.length; lIdx++) {
            if (!aAttemptOnly) {
                this._internalSerializeElement(aTargetElement, aParticle.getTerm(), lSeredValue[lIdx]);
            } else {
                if ((lSeredValue[lIdx] == null || typeof (lSeredValue[lIdx]) == "undefined") && !aParticle.getTerm().getNillable()) {
                    throw new BiWebServiceError("Attempt to serialize null value for non nullable element");
                }
            }
        }
    } else {
        if ((typeof (lSeredValue) != "undefined" && lSeredValue != null) || lMinOccurs > 0) {
            if (!aAttemptOnly) {
                this._internalSerializeElement(aTargetElement, aParticle.getTerm(), lSeredValue);
            } else {
                if ((lSeredValue == null || typeof (lSeredValue) == "undefined") && !aParticle.getTerm().getNillable()) {
                    throw new BiWebServiceError("Attempt to serialize null value for non nullable element");
                }
            }
        }
    }
};
_p._serializeParticleWildcard = function (aTargetElement, aParticle, aValue, aAttemptOnly) {
    var lMaxOccurs = aParticle.getMaxOccurs();
    var lMinOccurs = aParticle.getMinOccurs();
    if (!(aValue instanceof Array)) {
        aValue = [aValue];
    }
    var lElementCount = 0;
    for (var lIdx = 0; lIdx < aValue.length; lIdx++) {
        if (!aAttemptOnly) {
            var lImportedNode = importNode(aTargetElement.ownerDocument, aValue[lIdx], true);
            if (lImportedNode.nodeType == 2) {
                aTargetElement.setAttributeNode(lImportedNode);
            } else if (lImportedNode.nodeType == 1) {
                aTargetElement.appendChild(lImportedNode);
                lElementCount++;
            }
        } else {
            if (aValue[lIdx].nodeType == 1) {
                lElementCount++;
            }
        }
    }
    if (lElementCount < lMinOccurs || (lMaxOccurs && (lElementCount > lMaxOccurs))) {
        throw new BiWebServiceError("Array extends beyond particle occurance bounds.");
    }
};
_p._createAttr = function (aElement, aName, aValue) {
    var lPfx = "";
    if (aName.ns != "") {
        lPfx = this._nsManager.getNsPrefix(aName.ns) + ":";
    }
    var lAttrNode = aElement.ownerDocument.createNode(2, lPfx + aName.localName, aName.ns);
    lAttrNode.nodeValue = aValue;
    aElement.setAttributeNode(lAttrNode);
};
_p._createElem = function (aElement, aName) {
    var lPfx = "";
    if (aName.ns != "") {
        lPfx = this._nsManager.getNsPrefix(aName.ns) + ":";
    }
    var lElmNode = aElement.ownerDocument.createNode(1, lPfx + aName.localName, aName.ns);
    aElement.appendChild(lElmNode);
    return lElmNode;
};

function BiWsSoapLiteralSerializer() {
    if (_biInPrototype) return;
    BiWsSoapSchemaBasedSerializer.call(this);
}
_p = _biExtend(BiWsSoapLiteralSerializer, BiWsSoapSchemaBasedSerializer, "BiWsSoapLiteralSerializer");

function BiWsSoapEncodedSerializer(aSchema, aEncoding) {
    if (_biInPrototype) return;
    BiWsSoapSchemaBasedSerializer.call(this);
    if (aEncoding != "http://schemas.xmlsoap.org/soap/encoding/") {
        throw new BiWebServiceError("Unsupported SOAP encoding style: " + aEncoding);
    }
    this._schema = aSchema;
    this._multiRefObjects = [];
    this._multiRefNameSeed = 1;
}
_p = _biExtend(BiWsSoapEncodedSerializer, BiWsSoapSchemaBasedSerializer, "BiWsSoapEncodedSerializer");
_p._internalSerializeType = function (aTargetElement, aType, aValue) {
    if ((aType instanceof BiSchemaComplexType) && (aType.getContentType() == BiSchemaComplexType.CONTENT_TYPE_PARTICLE)) {
        var lMrName = this._getMultiRefName(aType, aValue);
        aTargetElement.setAttribute("href", "#" + lMrName);
    } else {
        return BiWsSoapSchemaBasedSerializer.prototype._internalSerializeType.call(this, aTargetElement, aType, aValue);
    }
};
_p._serializeMultiRef = function (aTargetElement, aType, aValue) {
    if ((aType instanceof BiSchemaComplexType) && (aType.getAttributes().getAttribute("[http://schemas.xmlsoap.org/soap/encoding/]arrayType"))) {
        var lArrayBaseType = aType.getAttributes().getAttribute("[http://schemas.xmlsoap.org/soap/encoding/]arrayType").getWsdlArrayBaseType();
        var lArraySubs = aType.getAttributes().getAttribute("[http://schemas.xmlsoap.org/soap/encoding/]arrayType").getWsdlArraySubscripts();
        if (!lArrayBaseType || !lArraySubs) {
            throw new BiWebServiceError("Array type not specified for type " + aType.getName());
        }
        var lParsedBaseType = BiXmlDefinitionsDocument.parseExpandedQname(lArrayBaseType);
        var lPfx = this._nsManager.getNsPrefix(lParsedBaseType.ns);
        var lArrayType = lPfx + ":" + lParsedBaseType.localName + lArraySubs;
        lArrayType = lArrayType.substring(0, lArrayType.lastIndexOf("["));
        this._serializeArray(aTargetElement, lArrayType, aValue);
    } else {
        return BiWsSoapSchemaBasedSerializer.prototype._internalSerializeType.call(this, aTargetElement, aType, aValue);
    }
};
_p._serializeArray = function (aTargetElement, aArrayTypeString, aValue) {
    if (!("length" in aValue)) {
        aValue = [aValue];
    }
    var lArrTypeAttr = aTargetElement.ownerDocument.createNode(2, "SOAP-ENC:arrayType", "http://schemas.xmlsoap.org/soap/encoding/");
    lArrTypeAttr.nodeValue = aArrayTypeString + "[" + aValue.length + "]";
    aTargetElement.setAttributeNode(lArrTypeAttr);
    var lItemType = aArrayTypeString;
    var lSubscriptIdx = lItemType.lastIndexOf("[");
    var lIsArray;
    if (lSubscriptIdx > 0) {
        lItemType = lItemType.substring(0, lSubscriptIdx);
        lIsArray = true;
    } else {
        lItemType = this._schema.getType(BiXmlDefinitionsDocument.expandQname(lItemType, aTargetElement));
        lIsArray = false;
    }
    for (var lIdx = 0; lIdx < aValue.length; lIdx++) {
        var lItemTarget = aTargetElement.ownerDocument.createElement("Item");
        aTargetElement.appendChild(lItemTarget);
        if (lIsArray) {
            this._serializeArray(lItemTarget, lItemType, aValue[lIdx]);
        } else {
            this._internalSerializeType(lItemTarget, lItemType, aValue[lIdx]);
        }
    }
};
_p._getMultiRefName = function (aType, aObject) {
    for (var lIdx = 0; lIdx < this._multiRefObjects.length; lIdx++) {
        if (this._multiRefObjects[lIdx].value == aObject) {
            return this._multiRefObjects[lIdx].name;
        }
    }
    var lMultiRefDesc = new BiWsSoapEncodedSerializerMultiRefObj("id" + this._multiRefNameSeed++, aObject);
    this._multiRefObjects.push(lMultiRefDesc);
    var lElemName = BiXmlDefinitionsDocument.parseExpandedQname(aType.getName());
    var lElement = this._oobRoot.ownerDocument.createNode(1, "mrns:" + lElemName.localName, lElemName.ns);
    lElement.setAttribute("id", lMultiRefDesc.name);
    this._oobRoot.appendChild(lElement);
    lElement.appendChild(lElement.ownerDocument.createTextNode(""));
    var lOldNsManager = this._nsManager;
    this._nsManager = new BiWsSoapSerializerNsManager(this._oobRoot);
    this._serializeMultiRef(lElement, aType, aObject);
    this._nsManager = lOldNsManager;
    return lMultiRefDesc.name;
};

function BiWsSoapEncodedSerializerMultiRefObj(aName, aObj) {
    if (_biInPrototype) return;
    this.value = aObj;
    this.name = aName;
}
_biExtend(BiWsSoapEncodedSerializerMultiRefObj, Object, "BiWsSoapEncodedSerializerMultiRefObj");

function BiWsSoapDeserializer() {}
_p = _biExtend(BiWsSoapDeserializer, Object, "BiWsSoapDeserializer");
_p.setSerializationOobRoot = function (aRoot) {
    this._oobRoot = aRoot;
};
_p.deserializePartFromElement = function (aPartDesc, aPartElement, aValue) {
    if (!aPartDesc.getType()) {
        this.serializeElement(aPartElement, aPartDesc.getElement(), aValue);
    } else {
        this.serializeType(aPartElement, aPartDesc.getType(), aValue);
    }
};
_p._serializeXmlPart = function (aPartDesc, aPartElement, aValue) {
    if (!aPartDesc.getType()) {
        aPartElement.appendChild(importNode(aPartElement.ownerDocument, aValue, true));
    } else {
        var lAttrNodes = aValue.attributes;
        var lIdx, lImportedNode;
        for (lIdx = 0; lIdx < lAttrNodes.length; lIdx++) {
            lImportedNode = importNode(aPartElement.ownerDocument, lAttrNodes[lIdx], false);
            aPartElement.setAttributeNode(lImportedNode);
        }
        var lChildNodes = aValue.childNodes;
        for (lIdx = 0; lIdx < lChildNodes.length; lIdx++) {
            lImportedNode = importNode(aPartElement.ownerDocument, lChildNodes[lIdx], true);
            aPartElement.appendChild(lImportedNode);
        }
    }
};
_p.deserializeElement = function (aElementDef, aSrc) {
    throw new BiWebServiceError("BiWsSoapDeserializer derivatives must override deserializeElement.");
};
_p.deserializeType = function (aTypeDef, aSrc) {
    throw new BiWebServiceError("BiWsSoapDeserializer derivatives must override deserializeType.");
};

function BiWsSoapSchemaBasedDeserializer(aSrcSchema) {
    if (_biInPrototype) return;
    BiWsSoapDeserializer.call(this);
    this._srcSchema = aSrcSchema;
}
_p = _biExtend(BiWsSoapSchemaBasedDeserializer, BiWsSoapDeserializer, "BiWsSoapSchemaBasedDeserializer");
_p.deserializeType = function (aType, aSrc) {
    dalert("DESER TYPE " + aType.getName() + " from " + aSrc.xml);
    if (aType instanceof BiSchemaSimpleContentType) {
        return this._deserializeSimpleContentType(aType, aSrc);
    } else if (aType instanceof BiSchemaComplexType && aType.getContentType() == BiSchemaComplexType.CONTENT_TYPE_SIMPLE) {
        return this._deserializeSimpleContentType(aType.getContentSimpleType(), aSrc);
    }
    var lRetOb = new Object();
    this._deserializeComplexType(aType, aSrc, lRetOb);
    return lRetOb;
};
_p.deserializeElement = function (aElement, aSrc) {
    if ((aSrc.namespaceURI ? aSrc.namespaceURI : "") != aElement.getNamespace() || aSrc.baseName != aElement.getName()) {
        throw new BiWebServiceError("Expecting element " + aElement.getName() + "; found [" + aSrc.namespaceURI + "]" + aSrc.baseName);
    }
    var lNullAttr = aSrc.selectSingleNode("@xsi:nil");
    if (!lNullAttr) {
        lNullAttr = aSrc.selectSingleNode("@xsio:nil");
    }
    if (lNullAttr && (lNullAttr.nodeValue == "true" || lNullAttr.nodeValue == "1")) {
        return null;
    } else {
        var lTypeAttr = aSrc.selectSingleNode("@xsi:type");
        if (!lTypeAttr) {
            lTypeAttr = aSrc.selectSingleNode("@xsio:type");
        }
        var lType;
        if (lTypeAttr) {
            lType = this._srcSchema.getType(BiXmlDefinitionsDocument.expandQname(lTypeAttr.nodeValue, aSrc));
            if (!lType) lType = aElement.getType();
        } else {
            lType = aElement.getType();
        }
        return this.deserializeType(lType, aSrc);
    }
};
_p._deserializeComplexType = function (aType, aSrc, aTargetOb) {
    var lStartNode = aSrc.firstChild;
    while (lStartNode && lStartNode.nodeType != 1) {
        lStartNode = lStartNode.nextSibling;
    }
    var lSrcPtr = {
        "currNode": lStartNode
    };
    if (aType.getContentParticle()) {
        this._deserializeParticle(aType.getContentParticle(), lSrcPtr, aTargetOb, false, false);
    }
    dalert("Ensuring no additional content under " + aType.getName());
    while (lSrcPtr.currNode) {
        if (lSrcPtr.currNode.nodeType == 1) {}
        lSrcPtr.currNode = lSrcPtr.currNode.nextSibling;
    }
    var lAttrs = aType.getAttributes().getAttributes();
    for (var lAttrIdx = 0; lAttrIdx < lAttrs.length; lAttrIdx++) {
        var lAttrUse = lAttrs[lAttrIdx];
        var lAttrName = BiXmlDefinitionsDocument.parseExpandedQname(lAttrUse.getExpandedQName());
        var lAttrNode = aSrc.selectSingleNode("@" + lAttrName.localName);
        if (lAttrNode) {
            aTargetOb[lAttrName.localName] = lAttrUse.getAttr().getType().decodeJsValue(lAttrNode.nodeValue);
        } else {
            if (lAttrUse.getUseType() == BiSchemaAttrUse.USE_TYPE_REQUIRED) {
                throw new BiWebServiceError("A required attribute " + lAttrUse.getExpandedQName() + " was not found.");
            }
        }
    }
};
_p._deserializeSimpleContentType = function (aSimpleContentType, aSrcNode) {
    var lSimpleTypeLiteral;
    switch (aSrcNode.nodeType) {
    case 1:
        lSimpleTypeLiteral = aSrcNode.text;
        break;
    case 2:
        lSimpleTypeLiteral = aSrcNode.nodeValue;
        break;
    default:
        throw new BiWebServiceError("Cannot deserialize simple type from a non-attribute, non-element node.");
    }
    return aSimpleContentType.decodeJsValue(lSimpleTypeLiteral);
};
_p._deserializeParticle = function (aParticle, aSrc, aTargetOb, aAttemptOnly, aArrayDetected) {
    dalert("deserpart");
    var lOccCount = 0;
    var lHasMoreOccurs = true;
    var lLastErr = null;
    var lStartNode;
    if (aParticle.getMaxOccurs() != 1) {
        aArrayDetected = true;
    }
    do {
        lStartNode = aSrc.currNode;
        if (aParticle.getTerm() instanceof BiSchemaSequenceModelGroup) {
            this._deserializeParticleSequenceModelGroup(aParticle, aSrc, aTargetOb, aAttemptOnly, aArrayDetected);
        } else if (aParticle.getTerm() instanceof BiSchemaAllModelGroup) {
            this._deserializeParticleAllModelGroup(aParticle, aSrc, aTargetOb, aAttemptOnly, aArrayDetected);
        } else if (aParticle.getTerm() instanceof BiSchemaChoiceModelGroup) {
            this._deserializeParticleChoiceModelGroup(aParticle, aSrc, aTargetOb, aAttemptOnly, aArrayDetected);
        } else if (aParticle.getTerm() instanceof BiSchemaElement) {
            this._deserializeParticleElement(aParticle, aSrc, aTargetOb, aAttemptOnly, aArrayDetected);
        }
        if (aParticle.getTerm() instanceof BiSchemaWildcard) {
            this._deserializeParticleWildcard(aParticle, aSrc, aTargetOb, aAttemptOnly, aArrayDetected);
        }
        lOccCount++;
    } while ((!aParticle.getMaxOccurs() || lOccCount < aParticle.getMaxOccurs()) && aSrc.currNode && lHasMoreOccurs && aSrc.currNode != lStartNode);
    dalert("DONE " + aParticle.toString());
    if (!lLastErr && aSrc.currNode == lStartNode) {
        return;
    }
    if (lOccCount < aParticle.getMinOccurs()) {
        dalert("THROWING");
        if (lLastErr) {
            throw lLastErr;
        } else {
            throw new BiWebServiceError("Expected " + aParticle.getMinOccurs() + " occurances of particle.");
        }
    }
};
_p._deserializeParticleElement = function (aParticle, aSrc, aTargetOb, aAttemptOnly, aArrayDetected) {
    dalert("desering particle element");
    var lElement = aParticle.getTerm();
    var lElementName = BiXmlDefinitionsDocument.parseExpandedQname(lElement.getExpandedQName());
    var lSrcElement = aSrc.currNode;
    if ((lSrcElement == null) && aParticle._optional) return;
    if (lSrcElement && (lElementName.localName != lSrcElement.baseName || lElementName.ns != (lSrcElement.namespaceURI ? lSrcElement.namespaceURI : ""))) {
        alert("Encountered " + (lSrcElement ? lSrcElement.xml : "[empty]") + " when expecting " + lElement.getExpandedQName());
        return;
    }
    dalert("DESERING " + lElement.getName() + " from " + lSrcElement.xml);
    if (!aAttemptOnly) {
        var lLoadedValue = this.deserializeElement(lElement, lSrcElement);
        if (aTargetOb[lElementName.localName]) {
            if (typeof (aTargetOb[lElementName.localName]) == "object" && aTargetOb[lElementName.localName] instanceof Array) {
                aTargetOb[lElementName.localName].push(lLoadedValue);
            } else {
                var lCurVal = aTargetOb[lElementName.localName];
                aTargetOb[lElementName.localName] = [lCurVal, lLoadedValue];
            }
        } else {
            if (!aArrayDetected) {
                aTargetOb[lElementName.localName] = lLoadedValue;
            } else {
                aTargetOb[lElementName.localName] = [lLoadedValue];
            }
        }
    }
    do {
        aSrc.currNode = aSrc.currNode.nextSibling;
    } while (aSrc.currNode && aSrc.currNode.nodeType != 1);
};
_p._deserializeParticleWildcard = function (aParticle, aSrc, aTargetOb, aAttemptOnly, aArrayDetected) {
    if (!aAttemptOnly) {
        if (aTargetOb["xmlNode"]) {
            if (typeof (aTargetOb["xmlNode"]) == "object" && aTargetOb["xmlNode"] instanceof Array) {
                aTargetOb["xmlNode"].push(aSrc.currNode);
            } else {
                var lCurVal = aTargetOb["xmlNode"];
                aTargetOb["xmlNode"] = [lCurVal, aSrc.currNode];
            }
        } else {
            if (!aArrayDetected) {
                aTargetOb["xmlNode"] = aSrc.currNode;
            } else {
                aTargetOb["xmlNode"] = [aSrc.currNode];
            }
        }
    }
    do {
        aSrc.currNode = aSrc.currNode.nextSibling;
    } while (aSrc.currNode && aSrc.currNode.nodeType != 1);
};
_p._deserializeParticleSequenceModelGroup = function (aParticle, aSrc, aTargetOb, aAttemptOnly, aArrayDetected) {
    var lParticles = aParticle.getTerm().getParticles();
    for (var lIdx = 0; lIdx < lParticles.length; lIdx++) {
        if (lParticles[lIdx]._term) this._deserializeParticle(lParticles[lIdx], aSrc, aTargetOb, aAttemptOnly, aArrayDetected);
    }
};
_p._deserializeParticleAllModelGroup = function (aParticle, aSrc, aTargetOb, aAttemptOnly, aArrayDetected) {
    var lParticles = aParticle.getTerm().getParticles().slice(0, aParticle.getTerm().getParticles().length);
    var lIllegalElementEncountered = false;
    var lElementName;
    var lParticleIdx;
    while (lParticles.length > 0 && aSrc.currNode && !lIllegalElementEncountered) {
        dalert("PRE NAME");
        lElementName = "[" + (aSrc.currNode.namespaceURI ? aSrc.currNode.namespaceURI : "") + "]" + aSrc.currNode.baseName;
        dalert("GOT NAME " + lElementName);
        lParticleIdx = 0;
        while (lParticleIdx < lParticles.length && lElementName != lParticles[lParticleIdx].getTerm().getExpandedQName()) {
            lParticleIdx++;
        }
        if (lParticleIdx < lParticles.length) {
            this._deserializeParticleElement(lParticles[lParticleIdx], aSrc, aTargetOb, aAttemptOnly, aArrayDetected);
            lParticles.splice(lParticleIdx, 1);
        } else {
            lIllegalElementEncountered = true;
        }
    }
    if (lIllegalElementEncountered) {
        throw new BiSchemaElementMismatchError("Invalid element in <all>: " + lElementName);
    }
    for (lParticleIdx = 0; lParticleIdx < lParticles.length; lParticleIdx++) {
        if (lParticles[lParticleIdx].getMinOccurs() > 0) {
            throw new BiSchemaElementMismatchError("Non-optional particle " + lParticles[lParticleIdx].getTerm().getName() + " " + "within 'all' not found.");
        }
    }
};
_p._deserializeParticleChoiceModelGroup = function (aParticle, aSrc, aTargetOb, aAttemptOnly, aArrayDetected) {
    var lChoiceGroupParticles = aParticle.getTerm().getParticles();
    var lTempStart = aSrc.currNode;
    var lLastErr = new BiWebServiceError("No particles in choice");
    for (var lIdx = 0; lIdx < lChoiceGroupParticles.length; lIdx++) {
        aSrc.currNode = lTempStart;
        lLastErr = null;
        this._deserializeParticle(lChoiceGroupParticles[lIdx], lTempStart, aTargetOb, true, aArrayDetected);
        if (!lLastErr) {
            if (!aAttemptOnly) {
                aSrc.currNode = lTempStart;
                this._deserializeParticle(lChoiceGroupParticles[lIdx], aSrc, aTargetOb, false, aArrayDetected);
            }
            return;
        }
    }
    throw lLastErr;
};

function BiSchemaElementMismatchError(aMsg) {
    if (_biInPrototype) return;
    BiSchemaError.call(this, aMsg);
}
_p = _biExtend(BiSchemaElementMismatchError, BiSchemaError, "BiSchemaElementMismatchError");

function dalert(aMsg) {};

function BiWsSoapLiteralDeserializer(aSrcSchema) {
    if (_biInPrototype) return;
    BiWsSoapSchemaBasedDeserializer.call(this, aSrcSchema);
}
_p = _biExtend(BiWsSoapLiteralDeserializer, BiWsSoapSchemaBasedDeserializer, "BiWsSoapLiteralDeserializer");

function BiWsSoapEncodedDeserializer(aSrcSchema, aEncoding) {
    if (_biInPrototype) return;
    BiWsSoapSchemaBasedDeserializer.call(this, aSrcSchema);
    if (aEncoding != "http://schemas.xmlsoap.org/soap/encoding/") {
        throw new BiWebServiceError("Unsupported SOAP encoding style: " + aEncoding);
    }
    this._knownRefs = {};
}
_p = _biExtend(BiWsSoapEncodedDeserializer, BiWsSoapSchemaBasedDeserializer, "BiWsSoapEncodedDeserializer");
_p.deserializeType = function (aType, aSrc) {
    var lElemRef = aSrc.getAttribute("href");
    if (lElemRef) {
        return this._deserializeElementReference(aType, lElemRef);
    }
    var lArrayType = aSrc.selectSingleNode("@SOAP-ENC:arrayType");
    if (lArrayType) {
        return this._deserializeArray(aSrc);
    }
    return BiWsSoapSchemaBasedDeserializer.prototype.deserializeType.call(this, aType, aSrc);
};
_p._deserializeElementReference = function (aType, aRefName) {
    if (aRefName.charAt(0) != "#") {
        throw new BiWebServiceError("Cannot fetch nonlocal encoded object reference: " + aRefName);
    }
    aRefName = aRefName.substring(1);
    if (aRefName in this._knownRefs) {
        return this._knownRefs[aRefName];
    }
    var lSrcElement = this._oobRoot.ownerDocument.documentElement.selectSingleNode("descendant::*[@id='" + aRefName + "']");
    if (!lSrcElement || lSrcElement.nodeType != 1) {
        throw new BiWebServiceError("Could not find multiref object " + aRefName);
    }
    var lNullAttr = lSrcElement.selectSingleNode("@xsi:nil");
    if (!lNullAttr) {
        lNullAttr = lSrcElement.selectSingleNode("@xsio:nil");
    }
    if (lNullAttr && (lNullAttr.nodeValue == "true" || lNullAttr.nodeValue == "1")) {
        this._knownRefs[aRefName] = null;
        return null;
    }
    var lArrayType = lSrcElement.selectSingleNode("@SOAP-ENC:arrayType");
    if (lArrayType) {
        this._knownRefs[aRefName] = new Array();
        this._deserializeArray(lSrcElement, this._knownRefs[aRefName]);
        return this._knownRefs[aRefName];
    } else {
        var lTypeAttr = lSrcElement.selectSingleNode("@xsi:type");
        if (!lTypeAttr) {
            lTypeAttr = lSrcElement.selectSingleNode("@xsio:type");
        }
        if (lTypeAttr) {
            aType = this._srcSchema.getType(BiXmlDefinitionsDocument.expandQname(lTypeAttr.nodeValue, lSrcElement));
        }
        if (aType instanceof BiSchemaSimpleContentType) {
            this._knownRefs[aRefName] = this._deserializeSimpleContentType(aType, lSrcElement);
        } else if (aType instanceof BiSchemaComplexType && aType.getContentType() == BiSchemaComplexType.CONTENT_TYPE_SIMPLE) {
            this._knownRefs[aRefName] = this._deserializeSimpleContentType(aType.getContentSimpleType(), lSrcElement);
        } else {
            this._knownRefs[aRefName] = new Object();
            this._deserializeComplexType(aType, lSrcElement, this._knownRefs[aRefName]);
        }
    }
    return this._knownRefs[aRefName];
};
_p._deserializeArray = function (aSrc, aTarget) {
    var lArrayType = aSrc.selectSingleNode("@SOAP-ENC:arrayType").nodeValue;
    var lArrType = /([^\[\]]*)\[([^\]]*)\]/.exec(lArrayType);
    if (!lArrType.length || lArrType.length != 3) {
        throw new BiWebServiceError("Invalid SOAP-ENC:arrayType value: " + lArrayType);
    }
    var lCertainNestedArray;
    var lElementType;
    if (lArrType[1].indexOf("[") >= 0) {
        lCertainNestedArray = true;
        lElementType = null;
    } else {
        lElementType = this._srcSchema.getType(BiXmlDefinitionsDocument.expandQname(lArrType[1], aSrc));
        lCertainNestedArray = false;
    }
    var lArrayDimensionality = lArrType[2].split(",");
    var lRes = aTarget;
    if (!lRes) lRes = new Array();
    var lReadIdx = 0;
    var lOfs = aSrc.selectSingleNode("@SOAP-ENC:offset");
    if (lOfs) {
        lOfs = (lOfs.nodeValue.substring(1, lOfs.nodeValue.length - 1)).split(",");
        lReadIdx = this._getLinearPos(lOfs, lArrayDimensionality);
    }
    var lItemNodes = aSrc.selectNodes("*");
    for (var lIdx = 0; lIdx < lItemNodes.length; lIdx++) {
        var lPos = lItemNodes[lIdx].selectSingleNode("@SOAP-ENC:position");
        if (lPos) {
            lPos = (lPos.nodeValue.substring(1, lPos.nodeValue.length - 1)).split(",");
            lReadIdx = this._getLinearPos(lPos, lArrayDimensionality);
        }
        if (!lElementType && BiXmlDefinitionsDocument.expandQname(lArrType[1], aSrc) == "[http://www.w3.org/2001/XMLSchema]anyType") {
            var aItemAttributes = lItemNodes[lIdx].attributes;
            for (var k = 0; k < aItemAttributes.length; k++) {
                if (aItemAttributes[k].baseName == "type") {
                    lElementType = this._srcSchema.getType(BiXmlDefinitionsDocument.expandQname(aItemAttributes[k].value, aSrc));
                    break;
                }
            }
        }
        lRes[lReadIdx] = this.deserializeType(lElementType, lItemNodes[lIdx]);
        if (lCertainNestedArray) {
            if (!lRes[lReadIdx] instanceof Array) {
                throw new BiWebServiceError("Nested array expected, but a scalar found.");
            }
        }
        lReadIdx++;
    }
    return lRes;
};
_p._getLinearPos = function (aPos, aDim) {
    if (aPos.length != aDim.length) {
        throw new BiWebServiceError("Position rank doesn't match array rank.");
    }
    var lPos = 0;
    var lOfsFactor = 1;
    for (var lIdx = aPos.length - 1; lIdx >= 0; lIdx--) {
        lPos += lOfsFactor * aPos[lIdx];
        lOfsFactor *= aDim[lIdx];
    }
    return lPos;
};

function BiWsSoapBodyProcessor(aParentOpHandler, aInputSerializer, aOutputDeserializer) {
    if (_biInPrototype) return;
    this._parentOpHandler = aParentOpHandler;
    this._serializer = aInputSerializer;
    this._deserializer = aOutputDeserializer;
}
_p = _biExtend(BiWsSoapBodyProcessor, Object, "BiWsSoapBodyProcessor");
_p._getParent = function () {
    return this._parentOpHandler;
};
_p._getInvokedOpSoapInfo = function () {
    return this._parentOpHandler._invokedOpSoapInfo;
};
_p._getInvokedOp = function () {
    return this._parentOpHandler._invokedOp;
};
_p._getInvokedArgs = function () {
    return this._parentOpHandler._invokedArgs;
};
_p._getSerializer = function () {
    return this._serializer;
};
_p._getDeserializer = function () {
    return this._deserializer;
};
_p.createBody = function (aBodyElement) {
    throw new BiWebServiceError("createBody must be implemented by BiWsSoapBodyProcessor derivatives!");
};
_p.parseBody = function (aBodyElement) {
    throw new BiWebServiceError("parseBody must be implemented by BiWsSoapBodyProcessor derivatives!");
};

function BiWsSoapOpHandler(aParent) {
    if (_biInPrototype) return;
    BiWsOpHandler.call(this, aParent);
    this._currentReq = null;
}
_p = _biExtend(BiWsSoapOpHandler, BiWsOpHandler, "BiWsSoapOpHandler");
_p.dispose = function () {
    if (this._disposed) return;
    this._currentReq = null;
    this._http = null;
    BiWsOpHandler.prototype.dispose.call(this);
};
_p.setInvokedPort = function (aPort) {
    BiWsOpHandler.prototype.setInvokedPort.call(this, aPort);
    this._invokedPortSoapInfo = this._invokedPort.getProtocolInfo();
};
_p.setInvokedOp = function (aBoundOperation) {
    BiWsOpHandler.prototype.setInvokedOp.call(this, aBoundOperation);
    this._invokedOpSoapInfo = this._invokedOp.getProtocolInfo();
    this._invokedOpBodyProcessor = this._createBodyProcessor();
};
_p.setInvocationArgs = function (aArgs) {
    BiWsOpHandler.prototype.setInvocationArgs.call(this, aArgs);
    this._invokedArgs = aArgs;
};
_p.syncInvoke = function () {
    var lOutMessage = this._buildMessage();
    this._currentReq = this._getXmlHttpRequest(false);
    this._currentReq.open("POST", this._invokedPortSoapInfo.getAddress(), false);
    this._applyAuthorization(this._currentReq);
    this._currentReq.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
    this._currentReq.setRequestHeader("SOAPAction", this._invokedOpSoapInfo.getSoapAction());
    this._currentReq.send(lOutMessage.xml);
    lOutMessage = null;
    var lResponseDoc = new BiXmlDocument();
    lResponseDoc.loadXML(this._currentReq.responseText);
    if (lResponseDoc && lResponseDoc.xml) {
        return this._parseResponse(lResponseDoc);
    } else {
        return this._parseResponse(this._currentReq.responseXml);
    }
};
_p.asyncInvoke = function () {
    var lOutMessage = this._buildMessage();
    this._currentReq = this._getXmlHttpRequest(true);
    var lThis = this;
    this._currentReq.onreadystatechange = function () {
        var lReq = lThis._currentReq;
        if (lReq.readyState == 4) {
            lThis._handleAsyncInvokeResult();
        }
    };
    this._currentReq.open("POST", this._invokedPortSoapInfo.getAddress(), true);
    this._applyAuthorization(this._currentReq);
    this._currentReq.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
    this._currentReq.setRequestHeader("SOAPAction", this._invokedOpSoapInfo.getSoapAction());
    this._currentReq.send(lOutMessage.xml);
    lOutMessage = null;
};
_p._applyAuthorization = function (aRequest) {
    if ("user" in this.getCallContext()) {
        var lUser = this.getCallContext().user;
        var lPass = this.getCallContext().password;
        if (lUser) {
            aRequest.setRequestHeader("Authorization ", "Basic " + BiBase64.encode(lUser + ":" + (lPass == null ? "" : lPass)));
        }
    }
};
_p._parseResponse = function (aXml) {
    aXml.setProperty("SelectionNamespaces", "xmlns:soap='" + BiWsSoapOpHandler.SOAP_ENV_NS + "' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsio='http://www.w3.org/1999/XMLSchema-instance' xmlns:SOAP-ENC='http://schemas.xmlsoap.org/soap/encoding/'");
    aXml.setProperty("SelectionLanguage", "XPath");
    dalert("Response = " + aXml.xml);
    var lResBody = aXml.documentElement.selectSingleNode("soap:Body");
    var lFaultNode = lResBody.selectSingleNode("soap:Fault");
    if (lFaultNode) {
        var lFaultCode = lFaultNode.selectSingleNode("faultcode").text;
        var lFaultString = lFaultNode.selectSingleNode("faultstring").text;
        var lFaultActorNode = lFaultNode.selectSingleNode("faultactor");
        var lFaultDetailNode = lFaultNode.selectSingleNode("detail");
        alert("Fault message: " + lFaultString);
        alert(this._service.getLastRequest());
        return lFaultString;
    }
    this._outputDeserializer.setSerializationOobRoot(lResBody);
    var lRes = this._invokedOpBodyProcessor.parseBody(lResBody);
    if (this._invokedOpSoapInfo.getOutputParts().length > 1) {
        return lRes;
    } else {
        return lRes.result;
    }
};
_p._buildMessage = function () {
    var lDoc = new BiXmlDocument();
    var lEnv = lDoc.createNode(1, "soap:Envelope", BiWsSoapOpHandler.SOAP_ENV_NS);
    lDoc.appendChild(lEnv);
    lEnv.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
    lEnv.setAttribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
    lEnv.setAttribute("xmlns:SOAP-ENC", "http://schemas.xmlsoap.org/soap/encoding/");
    var lBody = lDoc.createNode(1, "soap:Body", BiWsSoapOpHandler.SOAP_ENV_NS);
    if (this._invokedOpSoapInfo.getInputEncodingStyle()) {
        var lBodyEnc = lDoc.createNode(2, "soap:encodingStyle", BiWsSoapOpHandler.SOAP_ENV_NS);
        lBodyEnc.value = this._invokedOpSoapInfo.getInputEncodingStyle();
        lBody.setAttributeNode(lBodyEnc);
    }
    lEnv.appendChild(lBody);
    this._inputSerializer.setSerializationOobRoot(lBody);
    this._invokedOpBodyProcessor.createBody(lBody);
    var lXml = lDoc.xml;
    dalert("Request: " + lXml);
    return lDoc;
};
_p._deserializePart = function (aPartDesc, aBodyElement) {
    if (aPartDesc.getType()) {
        return aBodyElement;
    } else {
        var lFullName = BiXmlDefinitionsDocument.parseExpandedQname(aPartDesc.getElement());
        return aBodyElement.getElementsByTagName(lFullName.localName)[0];
    }
};
_p._getXmlHttpRequest = function () {
    if (!this._http) {
        this._http = new BiXmlHttp();
    }
    return this._http;
};
_p._handleAsyncInvokeResult = function () {
    var lRes = null;
    var lResponseDoc = new BiXmlDocument();
    lResponseDoc.loadXML(this._getXmlHttpRequest().responseText);
    if (lResponseDoc && lResponseDoc.xml) {
        lRes = this._parseResponse(lResponseDoc);
    } else {
        lRes = this._parseResponse(this._getXmlHttpRequest().responseXml);
    }
    this._service._dispatchAsyncInvokeResult(this, lRes);
};
_p._createBodyProcessor = function () {
    var lBodyInputSerializer;
    if (this._invokedOpSoapInfo.getInputUse() == "literal") {
        lBodyInputSerializer = new BiWsSoapLiteralSerializer(this._service.getWsdl().getSchema());
    } else if (this._invokedOpSoapInfo.getInputUse() == "encoded") {
        lBodyInputSerializer = new BiWsSoapEncodedSerializer(this._service.getWsdl().getSchema(), this._invokedOpSoapInfo.getInputEncodingStyle());
    } else {
        throw new BiWebServiceError("Could not determine serializer for operation invocation");
    }
    this._inputSerializer = lBodyInputSerializer;
    var lBodyOutputDeserializer;
    if (this._invokedOpSoapInfo.getOutputUse() == "literal") {
        lBodyOutputDeserializer = new BiWsSoapLiteralDeserializer(this._service.getWsdl().getSchema());
    } else if (this._invokedOpSoapInfo.getOutputUse() == "encoded") {
        lBodyOutputDeserializer = new BiWsSoapEncodedDeserializer(this._service.getWsdl().getSchema(), this._invokedOpSoapInfo.getOutputEncodingStyle());
    } else {
        throw new BiWebServiceError("Could not determine deserializer for operation invocation");
    }
    this._outputDeserializer = lBodyOutputDeserializer;
    return this._getBodyProcessor(this._invokedOpSoapInfo.getSoapStyle(), lBodyInputSerializer, lBodyOutputDeserializer);
};
_p._getBodyProcessor = function (aSoapStyle, aInputSerializer, aOutputDeserializer) {
    return new BiWsSoapOpHandler.BODY_PROCESSORS[aSoapStyle](this, aInputSerializer, aOutputDeserializer);
};
BiWsSoapOpHandler.registerBodyProcessor = function (aSoapStyle, aClass) {
    BiWsSoapOpHandler.BODY_PROCESSORS[aSoapStyle] = aClass;
};
BiWsSoapOpHandler.BODY_PROCESSORS = {};
BiWsSoapOpHandler.SOAP_ENV_NS = "http://schemas.xmlsoap.org/soap/envelope/";

function importNode(aDoc, aChild, aDeep) {
    var lNodeClone = aDoc.createNode(aChild.nodeType, aChild.nodeName, aChild.namespaceURI);
    if (aChild.nodeValue != null) {
        lNodeClone.nodeValue = aChild.nodeValue;
    }
    var lIdx;
    if (aChild.nodeType == 1) {
        var lNodeList = aChild.attributes;
        if (lNodeList) {
            for (lIdx = 0; lIdx < lNodeList.length; lIdx++) {
                var lAttrNode = lNodeList[lIdx];
                var lAttrNodeClone = aDoc.createNode(lAttrNode.nodeType, lAttrNode.nodeName, lAttrNode.namespaceURI);
                lAttrNodeClone.nodeValue = lAttrNode.nodeValue;
                lNodeClone.setAttributeNode(lAttrNodeClone);
            }
        }
    }
    if (aChild.nodeType == 1 && aDeep) {
        lNodeList = aChild.childNodes;
        if (lNodeList) {
            for (lIdx = 0; lIdx < lNodeList.length; lIdx++) {
                lNodeClone.appendChild(importNode(aDoc, lNodeList[lIdx], true));
            }
        }
    }
    return lNodeClone;
};

function BiWsSoapDocumentBodyProcessor(aParentWs, aSerializer, aDeserializer) {
    if (_biInPrototype) return;
    BiWsSoapBodyProcessor.call(this, aParentWs, aSerializer, aDeserializer);
}
_p = _biExtend(BiWsSoapDocumentBodyProcessor, BiWsSoapBodyProcessor, "BiWsSoapDocumentBodyProcessor");
_p.createBody = function (aBodyElement) {
    var lInputParts = this._getInvokedOpSoapInfo().getInputParts();
    var lElemParts = true;
    if (lInputParts.length > 0 && lInputParts[0].getType()) {
        if (lInputParts.length > 1) {
            throw new BiWebServiceError("'document' style operation with a type-specified message " + "part must not have additional parts.");
        }
        lElemParts = false;
    }
    for (var lIdx = 0; lIdx < lInputParts.length; lIdx++) {
        if (lElemParts && lInputParts[lIdx].getType()) {
            throw new BiWebServiceError("'document' style operation with a type-specified message " + "part must not have additional parts.");
        }
        var lPartDesc = lInputParts[lIdx];
        var lPartName = lPartDesc.getName();
        var lPartVal = this._getInvokedArgs()[lPartName];
        if (!lPartDesc.getType()) {
            this._getSerializer().serializeElement(aBodyElement, lPartDesc.getElement(), lPartVal);
        } else {
            this._getSerializer().serializeType(aBodyElement, lPartDesc.getType(), lPartVal);
        }
    }
};
_p.parseBody = function (aBodyElement) {
    var lOutParts = this._getInvokedOpSoapInfo().getOutputParts();
    var lRet = new Object();
    lRet.outParams = new Object();
    if (lOutParts[0].getType()) {
        if (lInputParts.length > 1) {
            throw new BiWebServiceError("'document' style operation with a type-specified message " + "part must not have additional parts.");
        }
        lRet.result = this._getDeserializer().deserializeType(lOutParts[0].getType(), aBodyElement);
    } else {
        var lCurLoadedElement = aBodyElement.firstChild;
        while (lCurLoadedElement && lCurLoadedElement.nodeType != 1) {
            lCurLoadedElement = lCurLoadedElement.nextChild;
        }
        lRet.result = this._getDeserializer().deserializeElement(lOutParts[0].getElement(), lCurLoadedElement);
        for (var lPartIdx = 1; lPartIdx < lOutParts.length; lPartIdx++) {
            if (lOutParts[lPartIdx].getType()) {
                throw new BiWebServiceError("'document' style operation with a type-specified message " + "part must not have additional parts.");
            }
            lCurLoadedElement = lCurLoadedElement.nextChild;
            while (lCurLoadedElement && lCurLoadedElement.nodeType != 1) {
                lCurLoadedElement = lCurLoadedElement.nextChild;
            }
            lRet.outParams[lOutParts[lPartIdx].getName()] = this._getParent().deserializeElement(lOutParts[lPartIdx].getElement(), lCurLoadedElement);
        }
    }
    return lRet;
};
BiWsSoapOpHandler.registerBodyProcessor("document", BiWsSoapDocumentBodyProcessor);

function BiWsSoapRpcBodyProcessor(aParentWs, aSerializer, aDeserializer) {
    if (_biInPrototype) return;
    BiWsSoapBodyProcessor.call(this, aParentWs, aSerializer, aDeserializer);
}
_p = _biExtend(BiWsSoapRpcBodyProcessor, BiWsSoapBodyProcessor, "BiWsSoapRpcBodyProcessor");
_p.createBody = function (aBodyElement) {
    var lOpElement = aBodyElement.ownerDocument.createNode(1, "svc:" + this._getInvokedOp().getPortOperation().getName(), this._getInvokedOpSoapInfo().getInputNamespace());
    aBodyElement.appendChild(lOpElement);
    var lInputParts = this._getInvokedOpSoapInfo().getInputParts();
    for (var lIdx = 0; lIdx < lInputParts.length; lIdx++) {
        var lPartDesc = lInputParts[lIdx];
        var lPartName = lPartDesc.getName();
        var lPartVal = this._getInvokedArgs()[lPartName];
        var lPartElement = aBodyElement.ownerDocument.createNode(1, lPartName, "");
        lOpElement.appendChild(lPartElement);
        if (!lPartDesc.getType()) {
            this._getSerializer().serializeElement(lPartElement, lPartDesc.getElement(), lPartVal);
        } else {
            this._getSerializer().serializeType(lPartElement, lPartDesc.getType(), lPartVal);
        }
    }
};
_p.parseBody = function (aBodyElement) {
    var lOutParts = this._getInvokedOpSoapInfo().getOutputParts();
    var lRetWrapper = aBodyElement.selectSingleNode("*");
    var lRetElements = lRetWrapper.getElementsByTagName("*");
    var lRet = new Object();
    lRet.nParts = 0;
    lRet.outParams = new Object();
    if (!lRetElements.length) {
        lRet.result = null;
        return lRet;
    }
    var lElem;
    if (lOutParts[0].getType()) {
        lRet.result = this._getDeserializer().deserializeType(lOutParts[0].getType(), lRetElements[0]);
    } else {
        lElem = lRetElements[0].firstChild;
        while (lElem && lElem.nodeType != 1) {
            lElem = lElem.nextSibling;
        }
        lRet.result = this._getDeserializer().deserializeType(lOutParts[0].getType(), lElem);
    }
    lRet.nParts++;
    for (var lPartIdx = 1; lPartIdx < lOutParts.length; lPartIdx++) {
        var lOutPart = lOutParts[lPartIdx];
        if (lRetElements[lPartIdx].tagName != lOutPart.getName()) {
            throw new BiWebServiceError("Order of part elements in RPC response does not correspond WSDL " + "specification; " + lOutPart.getName() + " expected, but " + lRetElements[lPartIdx] + " found.");
        }
        if (lOutPart.getType()) {
            lRet.outParams[lOutPart.getName()] = this._getDeserializer().deserializeType(lOutPart.getType(), lRetElements[lPartIdx]);
        } else {
            lElem = lRetElements[lPartIdx].firstChild;
            while (lElem && lElem.nodeType != 1) {
                lElem = lElem.nextSibling;
            }
            lRet.outParams[lOutPart.getName()] = this._getDeserializer().deserializeElement(lOutPart.getType(), lElem);
        }
        lRet.nParts++;
    }
    return lRet;
};
BiWsSoapOpHandler.registerBodyProcessor("rpc", BiWsSoapRpcBodyProcessor);