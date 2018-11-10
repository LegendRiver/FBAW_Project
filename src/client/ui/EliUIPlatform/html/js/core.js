/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiAsyncTaskQueue() {
    if (_biInPrototype) return;
    if (BiAsyncTaskQueue._singleton) return BiAsyncTaskQueue._singleton;
    BiEventTarget.call(this);
    this._taskQueue = [];
    this._timer = new BiTimer(BiAsyncTaskQueue.TASK_INTERVAL);
    this._timer.addEventListener("tick", this._onTick, this);
    application.addEventListener("dispose", this.dispose, this);
    BiAsyncTaskQueue._singleton = this;
}
_p = _biExtend(BiAsyncTaskQueue, BiEventTarget, "BiAsyncTaskQueue");
BiAsyncTaskQueue.TASK_INTERVAL = 200;
_p.addTask = function (oScope, fTaskFunc) {
    var task = [oScope, fTaskFunc];
    this._taskQueue.push(task);
    if (!this._timer.getIsStarted()) {
        this._timer.start();
    }
};
_p.removeTask = function (oScope, fTaskFunc) {
    var l = this._taskQueue.length;
    for (var i = 0; i < l; i++) {
        var task = this._taskQueue[i];
        if (task[0] === oScope & task[1] === fTaskFunc) {
            this._taskQueue.removeAt(i);
            return;
        }
    }
};
_p._onTick = function () {
    var task = this._taskQueue.shift();
    if (!task) {
        this._timer.stop();
        return;
    }
    if (typeof task[1] == BiObject.TYPE_FUNCTION) task[1].call(task[0]);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiEventTarget.prototype.dispose.call(this);
    this.disposeFields("_taskQueue", "_timer");
    delete BiAsyncTaskQueue._singleton;
};

function BiStringBuffer(sInitialValue) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._buffer = sInitialValue ? [sInitialValue] : [];
    this._length = sInitialValue && sInitialValue.length || 0;
}
_p = _biExtend(BiStringBuffer, BiObject, "BiStringBuffer");
BiStringBuffer.addProperty("length", BiAccessType.READ);
_p.match = function (oRegExp) {
    return this.toString().match(oRegExp);
};
_p.append = function (sAppendString) {
    var strings = this._getNonEmptyStrings(arguments, 0);
    if (strings.length) {
        this._buffer.push.apply(this._buffer, strings);
        this._addLengths(strings);
    }
    return this;
};
_p.insert = function (atIndex, sAppendString) {
    var oldLength = this._length;
    if (atIndex >= this._length) {
        arguments.shift();
        this.append.apply(this, arguments);
    } else {
        var strings = this._getNonEmptyStrings(arguments, 1);
        if (strings.length == 0) return this;
        this._addLengths(strings);
        if (atIndex == 0) this._buffer.unshift(strings);
        else {
            var lengthBeforePart = oldLength;
            var partIndex = this._buffer.length;
            while (partIndex > 0 && lengthBeforePart > atIndex) lengthBeforePart -= this._buffer[--partIndex].length;
            var args = [partIndex, 1];
            var part = this._buffer[partIndex];
            var atPartIndex = atIndex - lengthBeforePart;
            if (atPartIndex) {
                args.push(part.substring(0, atPartIndex));
                args.push.apply(args, strings);
                args.push(part.substring(atPartIndex));
            } else {
                args.push.apply(args, strings);
                args.push(part);
            }
            this._buffer.splice.apply(this._buffer, args);
        }
    }
    return this;
};
_p._getNonEmptyStrings = function (objects, firstIndex) {
    var strings = new Array(objects.length);
    var arrIndex = 0;
    for (var i = firstIndex || 0; i < objects.length; i++) {
        var string = String(objects[i] || "");
        if (string) strings[arrIndex++] = string;
    }
    strings.length = arrIndex;
    return strings;
};
_p._addLengths = function (strings) {
    var sum = 0;
    for (var i = 0; i < strings.length; i++) sum += strings[i].length;
    this._length += sum;
};
_p.replace = function (sToReplace, sReplaceWith) {
    if (!sToReplace) return;
    var s = this.toString();
    this._buffer = [s.replace(sToReplace, sReplaceWith)];
    this._length = this._buffer[0].length;
    return this;
};
_p.substring = function (startIndex, stopIndex) {
    return this.toString().substring(startIndex, stopIndex);
};
_p.indexOf = function (sValue, startIndex) {
    return this.toString().indexOf(sValue, startIndex);
};
_p.toString = function () {
    return this._length > 0 ? this._buffer.join(BiString.EMPTY) : BiString.EMPTY;
};
_p.clear = function () {
    this._buffer = [];
    this._length = 0;
    return this;
};
_p.dispose = function () {
    if (this._disposed) return;
    this._buffer = null;
    BiObject.prototype.dispose.call(this);
};

function BiInputEvent(sType, oEvent) {
    if (_biInPrototype) return;
    BiEvent.call(this, sType);
    this._event = oEvent;
}
_p = _biExtend(BiInputEvent, BiEvent, "BiInputEvent");
_p._bubbles = true;
_p._propagationStopped = false;
_p.getCtrlKey = function () {
    return this._event.ctrlKey;
};
_p.getShiftKey = function () {
    return this._event.shiftKey;
};
_p.getAltKey = function () {
    return this._event.altKey;
};
_p.getMetaKey = function () {
    return this._event.metaKey;
};
_p.matchesBundleModifiers = function (sName) {
    var modifiers = BiKeystroke._modifiersFromDOMEvent(this._event);
    return BiKeystroke.modifiersMatchBundle(sName, modifiers);
};

function BiMouseEvent(sType, oEvent) {
    if (_biInPrototype) return;
    BiInputEvent.call(this, sType, oEvent);
}
_p = _biExtend(BiMouseEvent, BiInputEvent, "BiMouseEvent");
if (BiBrowserCheck.ie) {
    BiMouseEvent.NONE = 0;
    BiMouseEvent.LEFT = 1;
    BiMouseEvent.RIGHT = 2;
    BiMouseEvent.MIDDLE = 4;
} else {
    BiMouseEvent.NONE = -1;
    BiMouseEvent.LEFT = 0;
    BiMouseEvent.MIDDLE = 1;
    BiMouseEvent.RIGHT = 2;
}
_p.getClientX = function () {
    return this._event.clientX;
};
_p.getClientY = function () {
    return this._event.clientY;
};
_p.getScreenX = function () {
    return this._event.screenX;
};
_p.getScreenY = function () {
    return this._event.screenY;
};
_p.getOffsetX = function () {
    return this.getClientX() - this.getTarget().getClientLeft();
};
_p.getOffsetY = function () {
    return this.getClientY() - this.getTarget().getClientTop();
};
_p.getRelatedTarget = function () {
    var relEl;
    if (BiBrowserCheck.ie) {
        if (this._type == "mouseover") relEl = this._event.fromElement;
        else if (this._type == "mouseout") relEl = this._event.toElement;
    } else relEl = this._event.relatedTarget;
    try {
        return BiComponent.findComponentFor(relEl);
    } catch (ex) {
        return null;
    }
};
_p.getButton = function () {
    if (BiBrowserCheck.ie && this._event.type == "click") return 1;
    else return this._event.button;
};
_p.getWheelDelta = function () {
    if (BiBrowserCheck.ie) return this._event.wheelDelta / 40;
    else if (BiBrowserCheck.webkit) return this._event.wheelDelta / 120 - this._event.detail / 3;
    else {
        var v = this._event.detail || 0;
        if (v > 1000) v = 3;
        else if (v < -1000) v = -3;
        return -v;
    }
};
_p.getTarget = function () {
    var el = this._event.target || this._event.srcElement;
    return BiComponent.findComponentFor(el) || this._target;
};
_p.preventDefault = function () {
    this._defaultPrevented = true;
    if (BiBrowserCheck.moz) this._event.preventDefault();
    this._event.returnValue = false;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiEvent.prototype.dispose.call(this);
    this._event = null;
};
BiMouseEvent._storeEventState = function (biEvent) {
    BiMouseEvent._screenX = biEvent.getScreenX();
    BiMouseEvent._screenY = biEvent.getScreenY();
    BiMouseEvent._clientX = biEvent.getClientX();
    BiMouseEvent._clientY = biEvent.getClientY();
    BiMouseEvent._button = biEvent.getButton();
};
BiMouseEvent.getScreenX = function () {
    return BiMouseEvent._screenX;
};
BiMouseEvent.getScreenY = function () {
    return BiMouseEvent._screenY;
};
BiMouseEvent.getClientX = function () {
    return BiMouseEvent._clientX;
};
BiMouseEvent.getClientY = function () {
    return BiMouseEvent._clientY;
};
BiMouseEvent.getButton = function () {
    return BiMouseEvent._button;
};
BiMouseEvent._screenX = BiMouseEvent._screenY = BiMouseEvent._clientX = BiMouseEvent._clientY = BiMouseEvent._button = 0;
if (BiBrowserCheck.moz) BiMouseEvent._button = -1;

function BiKeyboardEvent(sType, oEvent) {
    if (_biInPrototype) return;
    BiInputEvent.call(this, sType, oEvent);
    this._keyCode = oEvent.keyCode || oEvent.charCode;
}
_p = _biExtend(BiKeyboardEvent, BiInputEvent, "BiKeyboardEvent");
BiKeyboardEvent.addProperty("keyCode", BiAccessType.READ);
_p.matchesBundleShortcut = function (sName, bIgnoreZero) {
    var target = this.getTarget(),
        rtl = target && target.getRightToLeft();
    return this.getKeystroke().matchesBundleShortcut(sName, bIgnoreZero, rtl);
};
_p.getKeystroke = function () {
    return this._keystroke || (this._keystroke = BiKeystroke._fromDOMEvent(this._event));
};
_p.preventDefault = function () {
    this._defaultPrevented = true;
    if (BiBrowserCheck.moz) this._event.preventDefault();
    this._event.returnValue = false;
    if (BiBrowserCheck.ie) {
        try {
            this._event.keyCode = 0;
        } catch (ex) {}
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiEvent.prototype.dispose.call(this);
    this._event = null;
};
BiKeyboardEvent.ENTER = 13;
BiKeyboardEvent.TAB = 9;
BiKeyboardEvent.UP = 38;
BiKeyboardEvent.DOWN = 40;
BiKeyboardEvent.LEFT = 37;
BiKeyboardEvent.RIGHT = 39;
BiKeyboardEvent.SPACE = 32;
BiKeyboardEvent.SHIFT = 16;
BiKeyboardEvent.CTRL = 17;
BiKeyboardEvent.CONTROL = 17;
BiKeyboardEvent.ALT = 18;
BiKeyboardEvent.META = BiBrowserCheck.moz && BiBrowserCheck.platformIsMac ? 224 : 91;
BiKeyboardEvent.ESC = 27;
BiKeyboardEvent.F1 = 112;
BiKeyboardEvent.F2 = 113;
BiKeyboardEvent.F3 = 114;
BiKeyboardEvent.F4 = 115;
BiKeyboardEvent.F5 = 116;
BiKeyboardEvent.F6 = 117;
BiKeyboardEvent.F7 = 118;
BiKeyboardEvent.F8 = 119;
BiKeyboardEvent.F9 = 120;
BiKeyboardEvent.F10 = 121;
BiKeyboardEvent.F11 = 122;
BiKeyboardEvent.F12 = 123;
BiKeyboardEvent.DEL = 46;
BiKeyboardEvent.DELETE = 46;
BiKeyboardEvent.BACKSPACE = 8;
BiKeyboardEvent.INSERT = 45;
BiKeyboardEvent.HOME = 36;
BiKeyboardEvent.END = 35;
BiKeyboardEvent.PAGE_UP = 33;
BiKeyboardEvent.PAGE_DOWN = 34;
BiKeyboardEvent.NUM_LOCK = 144;
BiKeyboardEvent.NUMPAD0 = 96;
BiKeyboardEvent.NUMPAD1 = 97;
BiKeyboardEvent.NUMPAD2 = 98;
BiKeyboardEvent.NUMPAD3 = 99;
BiKeyboardEvent.NUMPAD4 = 100;
BiKeyboardEvent.NUMPAD5 = 101;
BiKeyboardEvent.NUMPAD6 = 102;
BiKeyboardEvent.NUMPAD7 = 103;
BiKeyboardEvent.NUMPAD8 = 104;
BiKeyboardEvent.NUMPAD9 = 105;
BiKeyboardEvent.NUMPAD_DIVIDE = 111;
BiKeyboardEvent.NUMPAD_MULTIPLY = 106;
BiKeyboardEvent.NUMPAD_MINUS = 109;
BiKeyboardEvent.NUMPAD_PLUS = 107;

function BiKeystroke(nModifiers, nKeyCode) {
    this._modifiers = nModifiers;
    this._keyCode = nKeyCode;
}
_p = _biExtend(BiKeystroke, BiObject, "BiKeystroke");
BiKeystroke.addProperty("modifiers", BiAccessType.READ);
BiKeystroke.addProperty("keyCode", BiAccessType.READ);
BiKeystroke.MODIFIER_FLAGS = {
    SHIFT: 1,
    CTRL: 2,
    CONTROL: 2,
    ALT: 4,
    OPTION: 4,
    META: 8,
    COMMAND: 8,
    CMD: 8
};
BiKeystroke._MODIFIER_OUTPUT_STRINGS = null;
BiKeystroke._MAC_MODIFIER_CHARACTERS = {};
(function () {
    var chars = BiKeystroke._MAC_MODIFIER_CHARACTERS;
    var flags = BiKeystroke.MODIFIER_FLAGS;
    chars[flags.CTRL] = "\u2303";
    chars[flags.OPTION] = "\u2325";
    chars[flags.SHIFT] = "\u21E7";
    chars[flags.CMD] = "\u2318";
    for (var i in chars) flags[chars[i]] = i;
    if (BiBrowserCheck.platformIsMac) BiKeystroke._MODIFIER_OUTPUT_STRINGS = chars;
    else {
        var outStrings = BiKeystroke._MODIFIER_OUTPUT_STRINGS = {};
        outStrings[flags.SHIFT] = "Shift+";
        outStrings[flags.CTRL] = "Ctrl+";
        outStrings[flags.ALT] = "Alt+";
        outStrings[flags.META] = "Meta+";
    }
})();
BiKeystroke.fromString = function (s) {
    if (!s) return null;
    var modifiers, keyName;
    if (/^[\u21E7\u2325\u2303\u2318]+/.test(s)) {
        var modNames = RegExp.lastMatch.split('');
        keyName = RegExp.rightContext || modNames.pop();
        modifiers = BiKeystroke._parseModifiers(modNames);
    } else {
        var a = s.trim().toUpperCase().split(/\s*[+-]\s*/);
        keyName = a.pop();
        modifiers = BiKeystroke._parseModifiers(a);
    }
    var keyCode = BiKeystroke._KEY_CODE_BY_NAME[keyName] || keyName.charCodeAt(0);
    return new BiKeystroke(modifiers, keyCode);
};
BiKeystroke.modifiersFromString = function (s) {
    s = s.trim().toUpperCase();
    if (!s.length) return 0;
    var keys = /^[\u21E7\u2325\u2303\u2318]+$/.test(s) ? s.split('') : s.split(/\s*[+-]\s*/);
    return BiKeystroke._parseModifiers(keys);
};
BiKeystroke._parseModifiers = function (oStrings) {
    var flags = 0;
    oStrings.forEach(function (key) {
        if (key in BiKeystroke.MODIFIER_FLAGS) flags |= BiKeystroke.MODIFIER_FLAGS[key];
        else throw new Error("Unknown keystroke modifier: " + key);
    });
    return flags;
};
BiKeystroke._modifiersFromDOMEvent = function (e) {
    var flags = BiKeystroke.MODIFIER_FLAGS;
    var metaKey = Boolean(e.metaKey);
    return e.shiftKey * flags.SHIFT + e.ctrlKey * flags.CTRL + e.altKey * flags.ALT + metaKey * flags.META;
};
BiKeystroke._fromDOMEvent = function (e) {
    var modifiers = BiKeystroke._modifiersFromDOMEvent(e);
    return new BiKeystroke(modifiers, e.keyCode || e.charCode);
};
_p.toString = function (bKeypress) {
    var strings = BiKeystroke._MODIFIER_OUTPUT_STRINGS;
    var flags = BiKeystroke.MODIFIER_FLAGS;
    var codes = BiKeystroke._KEY_CODE_BY_NAME;
    var ms = this._modifiers;
    var kc = this._keyCode;
    var s = [];
    for (var m in strings)
        if (ms & m) {
            if ((m & flags.SHIFT) && kc == codes.SHIFT) continue;
            if ((m & flags.CTRL) && kc == codes.CTRL) continue;
            if ((m & flags.ALT) && kc == codes.ALT) continue;
            if ((m & flags.META) && kc == codes.META) continue;
            s.push(strings[m]);
        }
    s.push(!bKeypress && BiKeystroke._KEY_NAME_BY_CODE[kc] || String.fromCharCode(kc));
    return s.join(BiString.EMPTY);
};
_p.matches = function (oKeystroke) {
    return this.matchesShortcut(oKeystroke);
};
_p.matchesShortcut = function (oKeystroke, bIgnoreZero, bRtl) {
    var matchedKey = oKeystroke._keyCode;
    if (bRtl) {
        var right = BiKeystroke._KEY_CODE_BY_NAME.RIGHT;
        var left = BiKeystroke._KEY_CODE_BY_NAME.LEFT;
        matchedKey = matchedKey == right ? left : matchedKey == left ? right : matchedKey;
    }
    return this._keyCode == matchedKey && BiKeystroke._testFlags(oKeystroke._modifiers, this._modifiers, bIgnoreZero);
};
_p.matchesString = function (s) {
    return this.matches(BiKeystroke.fromString(s));
};
_p.matchesBundleShortcut = function (sName, bIgnoreZero, bRtl) {
    var shortcuts = application._keyBundle.getShortcuts(sName);
    return shortcuts && shortcuts.some(function (scm) {
        return this.matchesShortcut(scm, bIgnoreZero, bRtl);
    }, this);
};
BiKeystroke.modifiersMatchBundle = function (sName, nModifiers, bIgnoreZero) {
    var modifiers = application._keyBundle.getModifiers(sName);
    return modifiers && modifiers.some(function (scm) {
        return BiKeystroke._testFlags(scm, nModifiers, bIgnoreZero);
    });
};
BiKeystroke._testFlags = function (nExpected, nActual, bIgnoreZero) {
    if (typeof bIgnoreZero == "number") nActual &= bIgnoreZero;
    else if (bIgnoreZero) nActual &= nExpected;
    return nActual == nExpected;
};
BiKeystroke._flagsExcept = function (nIgnored, nActual) {
    return (nActual | nIgnored) - nIgnored;
};
BiKeystroke._KEY_CODE_BY_NAME = {};
BiKeystroke._KEY_NAME_BY_CODE = {};
(function () {
    var NUMBER = "number";
    var codes = BiKeystroke._KEY_CODE_BY_NAME;
    var names = BiKeystroke._KEY_NAME_BY_CODE;
    for (var n in BiKeyboardEvent) {
        var code = BiKeyboardEvent[n];
        if (typeof code == NUMBER) {
            var duplicate = names[code];
            if (!duplicate || n < duplicate) names[code] = n;
            codes[n] = code;
        }
    }
    var macKeys = {
        "\u2326": codes.DEL,
        "\u232B": codes.BACKSPACE,
        "\u238B": codes.ESC,
        "\u21E5": codes.TAB,
        "\u2192": codes.RIGHT,
        "\u2190": codes.LEFT,
        "\u2191": codes.UP,
        "\u2193": codes.DOWN,
        "\u21DE": codes.PAGE_UP,
        "\u21DF": codes.PAGE_DOWN,
        "\u2198": codes.END,
        "\u2196": codes.HOME,
        "\u21A9": codes.ENTER,
        "\u2327": codes.NUM_LOCK,
        "\u2303": codes.CTRL,
        "\u2325": codes.ALT,
        "\u21E7": codes.SHIFT,
        "\u2318": codes.META
    };
    for (var mk in macKeys) {
        var keyCode = macKeys[mk];
        if (BiBrowserCheck.platformIsMac) names[keyCode] = mk;
        codes[mk] = keyCode;
    }
})();

function BiFocusEvent(sType) {
    if (_biInPrototype) return;
    BiEvent.call(this, sType);
    if (sType == "focusin" || sType == "focusout") {
        this._bubbles = true;
        this._propagationStopped = false;
    }
}
_p = _biExtend(BiFocusEvent, BiEvent, "BiFocusEvent");
BiFocusEvent._lastFocused = null;
BiFocusEvent.addProperty("relatedTarget", BiAccessType.READ);

function BiEventManager() {
    if (_biInPrototype) return;
    BiObject.call(this);
    var oThis = this;
    this.__dispose = function () {
        oThis = null;
        delete this.__dispose;
    };
    this.__onmouseevent = function (e) {
        return oThis._onmouseevent(e);
    };
    this.__onkeyevent = function (e) {
        return oThis._onkeyevent(e);
    };
    this.__onselectevent = function (e) {
        return oThis._onselectevent(e);
    };
    this.__onwindowblur = function (e) {
        return oThis._onwindowblur(e);
    };
    this.__ondragevent = function (e) {
        return oThis._ondragevent(e);
    };
    if (BiBrowserCheck.ie) {
        this.__onactivateevent = function (e) {
            return oThis._onactivateevent(e);
        };
        this.__onbeforeactivateevent = function (e) {
            return oThis._onbeforeactivateevent(e);
        };
        this.__onbeforedeactivateevent = function (e) {
            return oThis._onbeforedeactivateevent(e);
        };
    }
    this.__onresizeevent = function (e) {
        return oThis._onresizeevent(e);
    };
    this._mozActiveElement = null;
}
_p = _biExtend(BiEventManager, BiObject, "BiEventManager");
_p._lastFocused = null;
_p._lastMouseEventType = null;
_p._lastMouseDown = false;
_p._lastMouseEventDate = 0;
_p._allowBrowserContextMenu = false;
BiEventManager.addProperty("allowBrowserContextMenu", BiAccessType.READ_WRITE);
_p.attachToWindow = function (oWindow) {
    this._window = oWindow;
    this.attachMouseEvents();
    this.attachKeyboardEvents();
    var doc = oWindow.document;
    doc.body.onselect = doc.onselectstart = doc.onselectionchange = this.__onselectevent;
    doc.ondragstart = this.__ondragevent;
    oWindow.onblur = this.__onwindowblur;
    if (BiBrowserCheck.ie) {
        doc.body.onactivate = this.__onactivateevent;
        doc.body.onbeforeactivate = this.__onbeforeactivateevent;
        doc.onbeforedeactivate = this.__onbeforedeactivateevent;
    }
    BiEvent._addDOMEventListener(oWindow, "resize", this.__onresizeevent);
};
BiEventManager._mouseEventTypes = ["mouseover", "mousemove", "mouseout", "mousedown", "mouseup", "click", "dblclick", "contextmenu", (BiBrowserCheck.moz ? "DOMMouseScroll" : "mousewheel")];
_p.attachMouseEvents = function () {
    var doc = this._window.document;
    var types = BiEventManager._mouseEventTypes;
    for (var i = 0; i < types.length; i++) BiEvent._addDOMEventListener(doc, types[i], this.__onmouseevent);
};
_p.detachMouseEvents = function () {
    var doc = this._window.document;
    var types = BiEventManager._mouseEventTypes;
    for (var i = 0; i < types.length; i++) BiEvent._removeDOMEventListener(doc, types[i], this.__onmouseevent);
};
BiEventManager._keyboardEventTypes = ["keydown", "keypress", "keyup"];
_p.attachKeyboardEvents = function () {
    var doc = this._window.document;
    var types = BiEventManager._keyboardEventTypes;
    for (var i = 0; i < types.length; i++) BiEvent._addDOMEventListener(doc, types[i], this.__onkeyevent);
};
_p.detachKeyboardEvents = function () {
    var doc = this._window.document;
    var types = BiEventManager._keyboardEventTypes;
    for (var i = 0; i < types.length; i++) BiEvent._removeDOMEventListener(doc, types[i], this.__onkeyevent);
};
_p._onmouseevent = function (e) {
    application.restartInactivityTimer();
    if (!e) e = this._window.event;
    if (BiBrowserCheck.quirks.screenError === undefined) {
        var sc = BiComponent._getElementScreenPosition(document.documentElement);
        sc.x += e.clientX;
        sc.y += e.clientY;
        var x = e.screenX - sc.x;
        var y = e.screenY - sc.y;
        var se = x == 0 && y == 0 ? null : {
            x: x,
            y: y
        };
        BiBrowserCheck.quirks.screenError = se;
    }
    var type = e.type;
    if (BiBrowserCheck.ie) {
        if (type == "mousedown") this._mouseIsDown = true;
        else if (type == "mouseup") this._mouseIsDown = false;
        else if (type == "mousemove" && this._mouseIsDown && e.button == 0) {
            this._onmouseevent2(e, "mouseup");
            this._mouseIsDown = false;
        }
        if (type == "mouseup" && !this._lastMouseDown && new Date - this._lastMouseEventDate < 250) {
            this._onmouseevent2(e, "mousedown");
        } else if (type == "dblclick" && this._lastMouseEventType == "mouseup" && new Date - this._lastMouseEventDate < 250) {
            this._onmouseevent2(e, "click");
        }
        switch (type) {
        case "mousedown":
        case "mouseup":
        case "click":
        case "dblclick":
        case "contextmenu":
            this._lastMouseEventType = type;
            this._lastMouseEventDate = (new Date).valueOf();
            this._lastMouseDown = type == "mousedown";
        }
    } else {
        switch (type) {
        case "DOMMouseScroll":
            type = "mousewheel";
            break;
        case "click":
        case "dblclick":
            if (e.button != BiMouseEvent.LEFT) return;
            break;
        case "mousedown":
            if (e.target && e.target.localName == "IMG") e.preventDefault();
            break;
        }
    }
    this._onmouseevent2(e, type);
};
_p._onmouseevent2 = function (e, type) {
    if (type == "contextmenu" && !this._allowBrowserContextMenu) this._preventDefault(e);
    else if (type == "mousedown" && !BiBrowserCheck.ie) this._onactivateevent(e);
    var target;
    if (this._captureComponent) {
        target = this._captureComponent;
    } else {
        var el = e.target || e.srcElement;
        target = BiComponent.findComponentFor(el);
    } if (target == null) return;
    var enabledAncestor = null;
    var c = target;
    while (c) {
        if (!c.getEnabled()) enabledAncestor = null;
        else if (enabledAncestor == null) enabledAncestor = c;
        c = c._parent;
    }
    target = enabledAncestor;
    if (target == null) return;
    if (!BiBrowserCheck.ie && type == "mousedown" && target.getTabIndex() < 0) {
        e.preventDefault();
        if (BiBrowserCheck.quirks.contextmenuPrevented && e.button == 2) setTimeout(this._onmouseevent2.bind(this, e, "contextmenu"), 0);
    }
    var biEvent = new BiMouseEvent(type, e);
    BiMouseEvent._storeEventState(biEvent);
    switch (type) {
    case "mousedown":
        (new BiPopupManager).hideAutoHiding(target);
        var tmp = target;
        while (tmp != null && !tmp.getCanFocus()) tmp = tmp._parent;
        if (tmp != null && tmp.getCanFocus()) {
            if (BiBrowserCheck.ie) {
                if (tmp._element.tagName != "IFRAME") tmp._element.setActive();
            } else {}
        }
        break;
    case "mouseover":
        try {
            tmp = e.relatedTarget || e.fromElement;
            if (BiComponent.findComponentFor(tmp) == target) {
                biEvent.dispose();
                return;
            }
        } catch (ex) {
            biEvent.dispose();
            return;
        }
        break;
    case "mouseout":
        try {
            tmp = e.relatedTarget || e.toElement;
            if (BiComponent.findComponentFor(tmp) == target) {
                biEvent.dispose();
                return;
            }
        } catch (ex) {
            biEvent.dispose();
            return;
        }
        break;
    }
    var rv = target.dispatchEvent(biEvent);
    biEvent._target = target;
    if (type == "mouseup") {
        application.getThemeManager()._handleMouseUp(biEvent);
    }
    switch (type) {
    case "mouseover":
        (new BiToolTipManager).handleMouseOver(biEvent);
        break;
    case "mouseout":
        (new BiToolTipManager).handleMouseOut(biEvent);
        break;
    case "contextmenu":
        if (!rv) break;
        var cm;
        while (target && !(cm = target.getContextMenu()) && !target.isFocusRoot()) target = target._parent;
        if (cm) {
            this._preventDefault(e);
            cm._component = target;
            cm.popupAtMouse(biEvent);
        }
        break;
    case "mousewheel":
        if (!rv) this._preventDefault(e);
        else if (!BiBrowserCheck.ie && target instanceof BiComponent) this._onMozMouseWheel(target, biEvent);
        break;
    }(new BiDragAndDropManager).handleMouseEvent(biEvent);
    biEvent.dispose();
    if (!BiBrowserCheck.ie && this._mozActiveElement && type == "click" && e.target != this._mozActiveElement) {
        this._mozActiveElement.focus();
    }
    application.flushLayoutQueue();
};
_p._preventDefault = function (e) {
    e.returnValue = false;
    if (BiBrowserCheck.moz) e.preventDefault();
};
_p._onMozMouseWheel = function (c, e) {
    if (c == null || c instanceof BiApplicationWindow) return;
    if (c.getOverflowY() == "hidden") {
        this._onMozMouseWheel(c._parent, e);
        return;
    }
    var st = c.getScrollTop();
    var delta = 20 * e.getWheelDelta();
    if (st == 0 && delta > 0) {
        this._onMozMouseWheel(c._parent, e);
        return;
    }
    var sh = c.getScrollHeight();
    var ch = c.getClientHeight();
    if (st + ch >= sh && delta < 0) {
        this._onMozMouseWheel(c._parent, e);
        return;
    }
    c.setScrollTop(st - delta);
    e._event.preventDefault();
};
_p._onkeyevent = function (e) {
    application.restartInactivityTimer();
    if (!e) e = this._window.event;
    var el = this._mozActiveElement || e.target || e.srcElement;
    var target = BiComponent.findComponentFor(el);
    while (target && !target.getEnabled()) target = target._parent;
    if (target == null) return;
    var biEvent = new BiKeyboardEvent(e.type, e);
    target.dispatchEvent(biEvent);
    biEvent._target = target;
    (new BiDragAndDropManager).handleKeyboardEvent(biEvent);
    var keyCode = biEvent.getKeyCode();
    if (window.frameElement && biEvent.matchesBundleShortcut("focus.moveout")) {
        window.frameElement.focus();
        biEvent.preventDefault();
    }
    var tagName = el.tagName.toLowerCase();
    if (BiBrowserCheck.ie && (tagName != "input" && tagName != "textarea" || el.readOnly) && !(el._biComponent instanceof BiRichEdit) && keyCode == BiKeyboardEvent.BACKSPACE) biEvent.preventDefault();
    biEvent.dispose();
    application.flushLayoutQueue();
};
_p._onactivateevent = function (e) {
    if (!e) e = this._window.event;
    if (!e) return;
    var appEm = application.getWindow()._eventManager;
    if (this != appEm) appEm._onactivateevent(e);
    var el = e.target || e.srcElement;
    var previousActiveElement = e.fromElement || this._mozActiveElement;
    if (el == previousActiveElement) return;
    var target = BiComponent.findComponentFor(el);
    while (target != null && !target.getCanFocus()) target = target._parent;
    if (target == null) return;
    if (!BiBrowserCheck.ie) this._mozActiveElement = (target instanceof BiRichEdit) ? el : target._element;
    if (target instanceof BiWindow && target._lastActive && !(target._lastActive instanceof BiRichEdit) && target._lastActive._element == previousActiveElement) {
        if (!BiBrowserCheck.ie) {
            this._mozActiveElement = previousActiveElement;
        } else previousActiveElement.setActive();
    } else this._setFocusedComponent(target);
};
_p._onbeforeactivateevent = function () {
    var e = this._window.event;
    if (!e) return;
    var c, el, d, w, em;
    d = this._window.document;
    if (e.srcElement == d.body) {
        if (window.BiRichEdit && d.body._biComponent instanceof BiRichEdit) return;
        try {
            el = d.activeElement;
        } catch (error) {
            el = null;
        }
        while (el && !c) {
            c = el._biComponent;
            el = el.parentNode;
        }
        if (!c) return;
        if (c.getFocused()) e.returnValue = false;
        else if ((em = (w = d.body._biComponent)._eventManager)._lastFocused && em._lastFocused._element && BiXml.getOwnerDocument(em._lastFocused._element) != d && c.getCanFocus()) {
            c.setFocused(true);
            w._activeComponent = c;
            e.returnValue = false;
        }
    }
};
_p._onbeforedeactivateevent = function () {
    var e = this._window.event;
    if (!e) return;
    var c = null,
        el = e.srcElement;
    while (c == null && el != null) {
        c = el._biComponent;
        el = el._parent;
    }
    if (c && c.getAppearance && /menu-item/.test(c.getAppearance()) && e.toElement && e.toElement.parentElement === e.srcElement) {
        return false;
    }
    if (c && c.getIsValid && !c.getIsValid()) {
        c.dispatchEvent("validationfailed");
    }
};
_p._setFocusedComponent = function (oComponent) {
    if (this._lastFocused == oComponent) return;
    var blurComp = this._lastFocused;
    var focusComp = oComponent;
    while (blurComp && blurComp._anonymous) blurComp = blurComp.getParent();
    while (focusComp && focusComp._anonymous) focusComp = focusComp.getParent();
    if (blurComp == focusComp) return;
    var fr;
    if (oComponent) {
        fr = oComponent.getFocusRoot();
        fr._activeComponent = oComponent;
    } else if (this._lastFocused) {
        fr = this._lastFocused.getFocusRoot();
        fr._activeComponent = null;
    }
    this._lastFocused = oComponent;
    if (oComponent && !oComponent._isMenu) BiEventManager._lastFocused = oComponent;
    (new BiPopupManager).hideAutoHiding(focusComp);
    var e;
    if (blurComp) {
        blurComp._focused = false;
        e = new BiFocusEvent("focusout");
        e._relatedTarget = focusComp;
        blurComp.dispatchEvent(e);
        e.dispose();
    }
    if (focusComp) {
        focusComp._focused = true;
        e = new BiFocusEvent("focusin");
        e._relatedTarget = blurComp;
        focusComp.dispatchEvent(e);
        e.dispose();
    }
    if (blurComp) {
        e = new BiFocusEvent("blur");
        e._relatedTarget = focusComp;
        blurComp.dispatchEvent(e);
        e._target = blurComp;
        (new BiToolTipManager).handleBlur(e);
        e.dispose();
    }
    if (focusComp) {
        e = new BiFocusEvent("focus");
        e._relatedTarget = blurComp;
        focusComp.dispatchEvent(e);
        e._target = focusComp;
        (new BiToolTipManager).handleFocus(e);
        e.dispose();
    }
    if (BiBrowserCheck.moz && blurComp) blurComp._blurComponent();
    if (BiBrowserCheck.quirks.doubleFocusHackNeededForBrowser && focusComp && !this._refocusing) {
        this._refocusing = true;
        focusComp._element.focus();
        this._refocusing = false;
    }
};
_p._onwindowblur = function (e) {
    if (BiBrowserCheck.ie)(new BiPopupManager).hideAutoHiding();
};
_p._onresizeevent = function (e) {
    if (this._layoutTimer) {
        this._layoutTimer.dispose();
    }
    this._layoutTimer = BiTimer.callOnce(function () {
        var c = this._window.document.body._biComponent;
        if (c && typeof c._onresize == 'function') {
            c._onresize();
        }
        application.flushLayoutQueue();
    }, 100, this);
};
_p._onselectevent = function (e) {
    if (!e) e = this._window.event;
    if (!e) return;
    var el = e.target || e.srcElement;
    var target = BiComponent.findComponentFor(el);
    if (target && !target.getCanSelect()) this._preventDefault(e);
};
_p._ondragevent = function (e) {
    if (!e) e = this._window.event;
    if ((e.target || e.srcElement).tagName == "IMG") this._onselectevent();
};
BiEventManager.addProperty("captureComponent", BiAccessType.READ_WRITE);
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    if (this._window) {
        this.detachMouseEvents();
        this.detachKeyboardEvents();
        var doc = this._window.document;
        if (doc) {
            if (doc.body) {
                doc.body.onselect = doc.body.onactivate = doc.body.onbeforeactivate = null;
            }
            doc.onselectstart = doc.onselectionchange = doc.ondragstart = doc.onbeforedeactivate = null;
        }
        try {
            this._window.onblur = null;
            BiEvent._removeDOMEventListener(this._window, "resize", this.__onresizeevent);
        } catch (e) {}
    }
    delete this.__onmouseevent;
    delete this.__onkeyevent;
    delete this.__onselectevent;
    delete this.__onwindowblur;
    delete this.__ondragevent;
    delete this.__onactivateevent;
    delete this.__onbeforeactivateevent;
    delete this.__onresizeevent;
    delete this._mozActiveElement;
    delete this._lastFocused;
    delete this._lastMouseEventType;
    delete this._lastMouseDown;
    delete this._lastMouseEventDate;
    delete this._allowBrowserContextMenu;
    delete this._window;
    this.__dispose();
};
_p._mozOnFocus = function (e, c, el) {
    if (BiBrowserCheck.ie) return;
    var old = this._mozActiveElement;
    this._mozActiveElement = el;
    this._mozUpdateFocusVisuals(el);
    if (old && old != el) this._mozUpdateFocusVisuals(old);
    this._setFocusedComponent(c);
    if (e) e.stopPropagation();
};
_p._mozOnBlur = function (e, c, el) {
    if (BiBrowserCheck.ie) return;
    if (this._mozActiveElement == el) this._mozActiveElement = null;
    this._mozUpdateFocusVisuals(el);
};
_p._mozUpdateFocusVisuals = function (el) {
    if (el == this._mozActiveElement) el.setAttribute("bi-moz-focused", "true");
    else el.removeAttribute("bi-moz-focused");
};
BiEventManager.getLastFocused = function () {
    return BiEventManager._lastFocused;
};
BiEventManager.restoreFocused = function () {
    var c = BiEventManager.getLastFocused();
    if (c && !c.getDisposed() && c.getCanFocus()) {
        c.setFocused(true);
        if (!(c instanceof BiRichEdit)) c._focusComponent();
        else c._activate();
    } else {
        var win = application.getWindow();
        var first = win.getFirstFocusable();
        if (first) first.setFocused(true);
        else {
            var ti = win.getTabIndex();
            win.setTabIndex(0);
            win.setFocused(true);
            win.setTabIndex(ti);
        }
    }
};

function BiBorder(nWidth, sStyle, sColor) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._props = {};
    this._set("border", (nWidth != null ? nWidth + "px " : "") + (sStyle ? sStyle + " " : "") + (sColor ? sColor : ""));
    this._leftWidth = this._rightWidth = this._topWidth = this._bottomWidth = nWidth;
    this._leftStyle = this._rightStyle = this._topStyle = this._bottomStyle = sStyle;
    this._leftColor = this._rightColor = this._topColor = this._bottomColor = sColor;
    if (BiBrowserCheck.moz) {
        this._mozSyncLeftColors();
        this._mozSyncRightColors();
        this._mozSyncTopColors();
        this._mozSyncBottomColors();
    }
}
_p = _biExtend(BiBorder, BiObject, "BiBorder");
BiBorder.addProperty("leftWidth", BiAccessType.READ);
BiBorder.addProperty("leftStyle", BiAccessType.READ);
BiBorder.addProperty("leftColor", BiAccessType.READ);
BiBorder.addProperty("rightWidth", BiAccessType.READ);
BiBorder.addProperty("rightStyle", BiAccessType.READ);
BiBorder.addProperty("rightColor", BiAccessType.READ);
BiBorder.addProperty("topWidth", BiAccessType.READ);
BiBorder.addProperty("topStyle", BiAccessType.READ);
BiBorder.addProperty("topColor", BiAccessType.READ);
BiBorder.addProperty("bottomWidth", BiAccessType.READ_WRITE);
BiBorder.addProperty("bottomStyle", BiAccessType.READ_WRITE);
BiBorder.addProperty("bottomColor", BiAccessType.READ_WRITE);
_p.setLeft = function (nWidth, sStyle, sColor) {
    this._set("borderLeft", (nWidth != null ? nWidth + "px " : "") + (sStyle ? sStyle + " " : "") + (sColor ? sColor : ""));
    this._leftWidth = nWidth;
    this._leftStyle = sStyle;
    this._leftColor = sColor;
    if (BiBrowserCheck.moz) this._mozSyncLeftColors();
};
_p.setRight = function (nWidth, sStyle, sColor) {
    this._set("borderRight", (nWidth != null ? nWidth + "px " : "") + (sStyle ? sStyle + " " : "") + (sColor ? sColor : ""));
    this._rightWidth = nWidth;
    this._rightStyle = sStyle;
    this._rightColor = sColor;
    if (BiBrowserCheck.moz) this._mozSyncRightColors();
};
_p.setTop = function (nWidth, sStyle, sColor) {
    this._set("borderTop", (nWidth != null ? nWidth + "px " : "") + (sStyle ? sStyle + " " : "") + (sColor ? sColor : ""));
    this._topWidth = nWidth;
    this._topStyle = sStyle;
    this._topColor = sColor;
    if (BiBrowserCheck.moz) this._mozSyncTopColors();
};
_p.setBottom = function (nWidth, sStyle, sColor) {
    this._set("borderBottom", (nWidth != null ? nWidth + "px " : "") + (sStyle ? sStyle + " " : "") + (sColor ? sColor : ""));
    this._bottomWidth = nWidth;
    this._bottomStyle = sStyle;
    this._bottomColor = sColor;
    if (BiBrowserCheck.moz) this._mozSyncBottomColors();
};
_p.setWidth = function (nWidth) {
    this._set("borderWidth", nWidth + "px");
    this._leftWidth = this._rightWidth = this._topWidth = this._bottomWidth = nWidth;
};
_p.setStyle = function (sStyle) {
    this._set("borderStyle", sStyle);
    this._leftStyle = this._rightStyle = this._topStyle = this._bottomStyle = sStyle;
    if (BiBrowserCheck.moz) {
        this._mozSyncLeftColors();
        this._mozSyncRightColors();
        this._mozSyncTopColors();
        this._mozSyncBottomColors();
    }
};
_p.setColor = function (sColor) {
    this._set("borderColor", sColor);
    this._leftColor = this._rightColor = this._topColor = this._bottomColor = sColor;
    if (BiBrowserCheck.moz) {
        this._mozSyncLeftColors();
        this._mozSyncRightColors();
        this._mozSyncTopColors();
        this._mozSyncBottomColors();
    }
};
_p.setLeftWidth = function (nWidth) {
    this.setLeft(nWidth, this._leftStyle, this._leftColor);
};
_p.setRightWidth = function (nWidth) {
    this.setRight(nWidth, this._rightStyle, this._rightColor);
};
_p.setTopWidth = function (nWidth) {
    this.setTop(nWidth, this._topStyle, this._topColor);
};
_p.setBottomWidth = function (nWidth) {
    this.setBottom(nWidth, this._bottomStyle, this._bottomColor);
};
_p.setLeftStyle = function (sStyle) {
    this.setLeft(this._leftWidth, sStyle, this._leftColor);
    if (BiBrowserCheck.moz) this._mozSyncLeftColors();
};
_p.setRightStyle = function (sStyle) {
    this.setRight(this._rightWidth, sStyle, this._rightColor);
    if (BiBrowserCheck.moz) this._mozSyncRightColors();
};
_p.setTopStyle = function (sStyle) {
    this.setTop(this._topWidth, sStyle, this._topColor);
    if (BiBrowserCheck.moz) this._mozSyncTopColors();
};
_p.setBottomStyle = function (sStyle) {
    this.setBottom(this._bottomWidth, sStyle, this._bottomColor);
    if (BiBrowserCheck.moz) this._mozSyncBottomColors();
};
_p.setLeftColor = function (sColor) {
    this.setLeft(this._leftWidth, this._leftStyle, sColor);
    if (BiBrowserCheck.moz) this._mozSyncLeftColors();
};
_p.setRightColor = function (sColor) {
    this.setRight(this._rightWidth, this._rightStyle, sColor);
    if (BiBrowserCheck.moz) this._mozSyncRightColors();
};
_p.setTopColor = function (sColor) {
    this.setTop(this._topWidth, this._topStyle, sColor);
    if (BiBrowserCheck.moz) this._mozSyncTopColors();
};
_p.setBottomColor = function (sColor) {
    this.setBottom(this._bottomWidth, this._bottomStyle, sColor);
    if (BiBrowserCheck.moz) this._mozSyncBottomColors();
};
_p._setLeftColors = function (sColors) {
    this._set("MozBorderLeftColors", sColors);
};
_p._setRightColors = function (sColors) {
    this._set("MozBorderRightColors", sColors);
};
_p._setTopColors = function (sColors) {
    this._set("MozBorderTopColors", sColors);
};
_p._setBottomColors = function (sColors) {
    this._set("MozBorderBottomColors", sColors);
};
_p.paintBorder = function (oComponent) {
    for (var p in this._props) {
        oComponent.setStyleProperty(p, this._props[p]);
    }
};
_p.removeBorder = function (oComponent) {
    for (var p in this._props) {
        oComponent.removeStyleProperty(p);
    }
};
_p._set = function (sName, sValue) {
    if (sValue == "" || sValue == null) delete this._props[sName];
    else this._props[sName] = sValue;
};
_p._mozSyncLeftColors = function () {
    if (this._leftColor) this._setLeftColors("");
    else {
        switch (this._leftStyle) {
        case "groove":
            this._setLeftColors("ThreeDShadow ThreeDHighlight");
            break;
        case "ridge":
            this._setLeftColors("ThreeDHighlight ThreeDShadow");
            break;
        case "inset":
            this._setLeftColors("ThreeDShadow ThreeDDarkShadow");
            break;
        case "outset":
            this._setLeftColors("ThreeDLightShadow ThreeDHighlight");
            break;
        default:
            this._setLeftColors("");
        }
    }
};
_p._mozSyncRightColors = function () {
    if (this._rightColor) this._setRightColors("");
    else {
        switch (this._rightStyle) {
        case "groove":
            this._setRightColors("ThreeDHighlight ThreeDShadow");
            break;
        case "ridge":
            this._setRightColors("ThreeDShadow ThreeDHighlight");
            break;
        case "inset":
            this._setRightColors("ThreeDHighlight ThreeDLightShadow");
            break;
        case "outset":
            this._setRightColors("ThreeDDarkShadow ThreeDShadow");
            break;
        default:
            this._setRightColors("");
        }
    }
};
_p._mozSyncTopColors = function () {
    if (this._topColor) this._setTopColors("");
    else {
        switch (this._topStyle) {
        case "groove":
            this._setTopColors("ThreeDShadow ThreeDHighlight");
            break;
        case "ridge":
            this._setTopColors("ThreeDHighlight ThreeDShadow");
            break;
        case "inset":
            this._setTopColors("ThreeDShadow ThreeDDarkShadow");
            break;
        case "outset":
            this._setTopColors("ThreeDLightShadow ThreeDHighlight");
            break;
        default:
            this._setTopColors("");
        }
    }
};
_p._mozSyncBottomColors = function () {
    if (this._bottomColor) this._setBottomColors("");
    else {
        switch (this._bottomStyle) {
        case "groove":
            this._setBottomColors("ThreeDHighlight ThreeDShadow");
            break;
        case "ridge":
            this._setBottomColors("ThreeDShadow ThreeDHighlight");
            break;
        case "inset":
            this._setBottomColors("ThreeDHighlight ThreeDLightShadow");
            break;
        case "outset":
            this._setBottomColors("ThreeDDarkShadow ThreeDShadow");
            break;
        default:
            this._setBottomColors("");
        }
    }
};
BiBorder.THIN_INSET_BORDER = new BiBorder(1, "solid", "ThreeDShadow");
BiBorder.THIN_INSET_BORDER.setRightColor("ThreeDHighlight");
BiBorder.THIN_INSET_BORDER.setBottomColor("ThreeDHighlight");
BiBorder.THIN_OUTSET_BORDER = new BiBorder(1, "solid", "ThreeDShadow");
BiBorder.THIN_OUTSET_BORDER.setLeftColor("ThreeDHighlight");
BiBorder.THIN_OUTSET_BORDER.setTopColor("ThreeDHighlight");
BiBorder.INSET_BORDER = new BiBorder(2, "inset");
BiBorder.OUTSET_BORDER = new BiBorder(2, "outset");
BiBorder.GROOVE_BORDER = new BiBorder(2, "groove");
BiBorder.RIDGE_BORDER = new BiBorder(2, "ridge");
BiBorder.fromString = function (s) {
    var b = new BiBorder;
    var part;
    var parts = s.split(/\s+/);
    for (var i = 0; i < parts.length; i++) {
        part = parts[i];
        switch (part) {
        case "groove":
        case "ridge":
        case "inset":
        case "outset":
        case "solid":
        case "dotted":
        case "dashed":
        case "double":
        case "none":
            b.setStyle(part);
            break;
        default:
            var n = parseFloat(part);
            if (n == part || part.indexOf("px") != -1) b.setWidth(n);
            else b.setColor(part);
            break;
        }
    }
    return b;
};

function BiComponent(sName) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    if (sName) this._name = sName;
    this._children = [];
    this._style = {};
    this._htmlProperties = {
        id: BiComponent.createElementId(),//([this._className, BiComponent.STRING_DASH, ++BiComponent._componentCount]).join(BiString.EMPTY),
        className: this._cssClassName,
        unselectable: "on"
    };
    this._htmlAttributes = {};
    if (application._accessibilityMode) {
        this.initAccessibility();
    }
}
_p = _biExtend(BiComponent, BiEventTarget, "BiComponent");
BiComponent._componentCount = 0;
BiComponent.__oninlineevent = function (e) {
    return BiComponent.findComponentFor(this)._oninlineevent(e);
};
_p._parent = null;
_p._name = BiString.EMPTY;
_p._enabled = true;
_p._capture = false;
_p._canSelect = false;
_p._focused = false;
_p._created = false;
_p._tabIndex = -1;
_p._hideFocus = false;
_p._tagName = "DIV";
_p._cssClassName = "bi-component";
_p._toolTip = null;
_p._toolTipText = null;
_p._opacity = 1;
_p._visible = true;
_p._left = _p._right = _p._top = _p._bottom = _p._width = _p._height = null;
_p._measuredWidth = null;
_p._measuredHeight = null;
_p._minimumWidth = _p._maximumWidth = _p._minimumHeight = _p._maximumHeight = null;
_p._acceptsEnter = false;
_p._acceptsEsc = false;
_p._lazyCreate = false;
BiComponent.STYLE_AUTO = "auto";
BiComponent.STYLE_HIDDEN = "hidden";
BiComponent.STYLE_SCROLL = "scroll";
BiComponent.STYLE_NONE = "none";
BiComponent.STYLE_INHERIT = "inherit";
BiComponent.STYLE_VISIBLE = "visible";
BiComponent.STYLE_RTL = "rtl";
BiComponent.STYLE_LTR = "ltr";
BiComponent.STYLE_MOZ_SCROLLBARS_HORIZONTAL = "-moz-scrollbars-horizontal";
BiComponent.STYLE_MOZ_SCROLLBARS_VERTICAL = "-moz-scrollbars-vertical";
BiComponent.STYLE_MOZ_SCROLLBARS_NONE = "-moz-scrollbars-none";
BiComponent.STRING_DASH = "-";
BiComponent.STRING_MOVE = "move";
BiComponent.STRING_RESIZE = "resize";
BiComponent.STRING_SIZE = "size";
if (BiBrowserCheck.ie) {
    BiComponent.STRING_LEFT = "pixelLeft";
    BiComponent.STRING_TOP = "pixelTop";
    BiComponent.STRING_WIDTH = "pixelWidth";
    BiComponent.STRING_HEIGHT = "pixelHeight";
} else {
    BiComponent.STRING_LEFT = "left";
    BiComponent.STRING_TOP = "top";
    BiComponent.STRING_WIDTH = "width";
    BiComponent.STRING_HEIGHT = "height";
    BiComponent.STRING_PX = "px";
}

BiComponent.createElementId = function ()
{
    var guid = "";
    for (var i = 1; i <= 32; i++)
    {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if((i==8)||(i==12)||(i==16)||(i==20))
            guid += "_";
    }

    return "X_" + guid.toUpperCase();
};

_p.add = function (oChild, oBefore, bAnonymous) {
    var p = oChild._parent;
    if (oBefore == null) {
        if (p != null) p.remove(oChild);
        this._children.push(oChild);
    } else {
        if (oBefore._parent != this) throw new Error("Can only add components before siblings");
        if (p != null) p.remove(oChild);
        this._children.insertBefore(oChild, oBefore);
    }
    oChild._anonymous = Boolean(bAnonymous);
    oChild._parent = this;
    if (oChild._propertyName) this.addProperty(oChild._propertyName, BiAccessType.READ_WRITE, oChild);
    if (this._created) oChild._addHtmlElementToParent(this, oBefore);
    if ((oChild instanceof BiMenuBar) && !this._setMenuBarOnWindow(oChild)) {
        this._menuBar = oChild;
        this.addEventListener("create", this._onCreateForMenuBar, this);
    }
    this.invalidateParentLayout("preferred");
};
_p.remove = function (oChild) {
    if (oChild._parent != this) throw new Error("Can only remove children");
    oChild._parent = null;
    oChild._anonymous = false;
    if (this._children) this._children.remove(oChild);
    this._removeHtmlElement(oChild);
    if (oChild instanceof BiMenuBar) this._unsetMenuBarOnWindow(oChild);
    this.invalidateParentLayout("preferred");
    return oChild;
};
_p.removeAll = function () {
    var cs = this._children;
    this._children = [];
    var l = cs.length;
    for (var i = 0; i < l; i++) {
        var c = cs[i];
        if (c._anonymous) {
            this._children.push(c);
        } else {
            if (c instanceof BiMenuBar) this._unsetMenuBarOnWindow(c);
            c.dispose();
        }
    }
    this.invalidateParentLayout("preferred");
};
_p.getParent = function () {
    if (this._parent == null || !this._parent._anonymous) return this._parent;
    return this._parent.getParent();
};
_p.setParent = function (p) {
    if (p != null && p != this._parent) {
        p.add(this);
    } else if (this._parent != null) {
        this._parent.remove(this);
    }
};
_p.getChildren = function () {
    var res = [];
    var cs = this._children;
    var l = cs.length;
    for (var i = 0; i < l; i++) {
        if (!cs[i]._anonymous) res.push(cs[i]);
    }
    return res;
};
_p.setChildren = function (cs) {
    this.removeAll();
    if (cs != null) {
        for (var i = 0; i < cs.length; i++) {
            this.add(cs[i]);
        }
    }
};
_p.hasChildren = function () {
    var cs = this._children;
    var l = cs.length;
    for (var i = 0; i < l; i++) {
        if (!cs[i]._anonymous) return true;
    }
    return false;
};
_p.getTopLevelComponent = function () {
    if (this._parent == null) return null;
    return this._parent.getTopLevelComponent();
};
_p.contains = function (oDescendant) {
    while (oDescendant) {
        if (oDescendant == this) return true;
        oDescendant = oDescendant._parent;
    }
    return false;
};
_p.getFirstChild = function () {
    var cs = this._children;
    var l = cs.length;
    for (var i = 0; i < l; i++) {
        if (!cs[i]._anonymous) return cs[i];
    }
    return null;
};
_p.getLastChild = function () {
    var cs = this._children;
    var l = cs.length;
    for (var i = l - 1; i >= 0; i--) {
        if (!cs[i]._anonymous) return cs[i];
    }
    return null;
};
_p.getPreviousSibling = function () {
    var p = this._parent;
    if (p == null) return null;
    var cs = p._children;
    for (var i = cs.indexOf(this) - 1; i >= 0; i--) {
        if (!cs[i]._anonymous) return cs[i];
    }
    return null;
};
_p.getNextSibling = function () {
    var p = this._parent;
    if (p == null) return null;
    var cs = p._children;
    var l = cs.length;
    for (var i = cs.indexOf(this) + 1; i < l; i++) {
        if (!cs[i]._anonymous) return cs[i];
    }
    return null;
};
BiComponent.addProperty("anonymous", BiAccessType.READ);
BiComponent.addProperty("acceptsEnter", BiAccessType.READ);
BiComponent.addProperty("acceptsEsc", BiAccessType.READ);
_p.setStyleProperty = function (sProp, sValue) {
    if (sValue == null || sValue === BiString.EMPTY) {
        delete this._style[sProp];
    } else {
        this._style[sProp] = sValue;
    } if (this._created) this._element.style[sProp] = sValue == null ? BiString.EMPTY : sValue;
};
_p.getStyleProperty = function (sProp) {
    if (this._created) {
        if (BiBrowserCheck.ie) return this._element.currentStyle[sProp];
        else return this._document.defaultView.getComputedStyle(this._element, BiString.EMPTY)[sProp];
    } else return this._style[sProp];
};
_p.removeStyleProperty = function (sProp) {
    delete this._style[sProp];
    if (this._created) this._element.style[sProp] = BiString.EMPTY;
};
_p.getHtmlProperty = function (sProp) {
    if (this._created) return this._element[sProp];
    return this._htmlProperties[sProp];
};
_p.setHtmlProperty = function (sProp, oValue) {
    this._htmlProperties[sProp] = oValue;
    if (this._created) {
        this._element[sProp] = oValue;
        this._setElementPropertyHack(sProp, oValue);
    }
};
_p._setElementPropertyHack = function (sProp, oValue) {
    if (BiBrowserCheck.webkit && sProp == "accessKey") {
        if (oValue) this._element.setAttribute(sProp, oValue);
        else this._element.removeAttribute(sProp);
    }
};
_p.removeHtmlProperty = function (sProp) {
    delete this._htmlProperties[sProp];
    if (this._created) {
        if (BiBrowserCheck.ie) this._element.removeAttribute(sProp);
        else delete this._element[sProp];
    }
};
_p._getHtmlAttribute = function (sName) {
    if (this._created) return this._element.getAttribute(sName);
    else return this._htmlAttributes[sName];
};
_p._setHtmlAttribute = function (sName, sValue) {
    this._htmlAttributes[sName] = sValue;
    if (this._created) this._element.setAttribute(sName, sValue);
};
_p._removeHtmlAttribute = function (sName) {
    delete this._htmlAttributes[sName];
    if (this._created) this._element.removeAttribute(sName);
};
_p.setId = function (sId) {
    BiEventTarget.prototype.setId.call(this, sId);
    this.setHtmlProperty("id", sId);
};
_p.setForeColor = function (sForeColor) {
    this.setStyleProperty("color", sForeColor);
};
_p.getForeColor = function () {
    return this.getStyleProperty("color");
};
_p.setBackColor = function (sBackColor) {
    this.setStyleProperty("backgroundColor", sBackColor);
};
_p.getBackColor = function () {
    return this.getStyleProperty("backgroundColor");
};
_p.setZIndex = function (nZIndex) {
    nZIndex = Math.min(nZIndex, BiNumber.INTEGER_INFINITY);
    this.setStyleProperty("zIndex", BiBrowserCheck.ie ? nZIndex : String(nZIndex));
};
_p.getZIndex = function () {
    var z = this.getStyleProperty("zIndex");
    return isNaN(z) ? 0 : Number(z);
};
_p.setVisible = function (bVisible) {
    var wasVisible = this._visible;
    if (!bVisible && this.getContainsFocus()) this.setFocused(false);
    this._visible = bVisible;
    this.setStyleProperty("visibility", bVisible ? BiComponent.STYLE_INHERIT : BiComponent.STYLE_HIDDEN);
    if (this._lazyCreate && !this._created && bVisible) {
        var p = this.getParent();
        if (p && p._created) this._addHtmlElementToParent(p, this.getNextSibling(), true);
    }
    if (wasVisible != bVisible && this._parent) this.invalidateParentLayout("preferred");
};
BiComponent.addProperty(BiComponent.STYLE_VISIBLE, BiAccessType.READ);
_p.getIsVisible = function () {
    if (!this.getVisible() || !this.getCreated()) return false;
    var el = this._element;
    BiComponent.flushLayoutComponent(this);
    if (el.offsetHeight == 0 || el.offsetWidth == 0) {
        return false;
    }
    if (BiBrowserCheck.ie) {
        while (el.tagName != "BODY") {
            if (el.currentStyle.visibility == BiComponent.STYLE_INHERIT) {
                el = el.parentNode;
                continue;
            }
            return el.currentStyle.visibility == BiComponent.STYLE_VISIBLE;
        }
    } else {
        var compStyle = this._document.defaultView.getComputedStyle(el, null);
        return compStyle.visibility != BiComponent.STYLE_HIDDEN && compStyle.display != BiComponent.STYLE_NONE;
    }
    return true;
};
_p.setCursor = function (sCursor) {
    if (!sCursor) {
        this.removeStyleProperty("cursor");
    } else {
        this.setStyleProperty("cursor", BiBrowserCheck.ie && BiBrowserCheck.versionNumber == 5.5 && sCursor == "pointer" ? "hand" : sCursor);
    }
};
_p.getCursor = function () {
    var c = this.getStyleProperty("cursor");
    return c == "hand" ? "pointer" : (c || BiString.EMPTY);
};
_p.setBackgroundImage = function (oUri) {
    if (oUri == null || oUri == BiString.EMPTY) {
        this.removeStyleProperty("backgroundImage");
    } else {
        var uri;
        if (oUri instanceof BiUri) uri = oUri;
        else uri = new BiUri(application.getAdfPath(), oUri);
        this.setStyleProperty("backgroundImage", "url(" + uri + ")");
    }
};
_p.getBackgroundImage = function () {
    var s = this.getStyleProperty("backgroundImage");
    if (s == null || s == BiString.EMPTY || s == BiComponent.STYLE_NONE) return null;
    return new BiUri(s.match(/^url\((.+)\)$/i)[1]);
};
_p.setOpacity = function (n) {
    n = Math.max(0, Math.min(1, n));
    if (this._opacity != n) {
        this._opacity = n;
        if (BiBrowserCheck.ie) {
            this.setStyleProperty("filter", this._getIeFilter());
        } else {
            if (n == 1) {
                this.removeStyleProperty(BiBrowserCheck.constants.OPACITY_STYLE);
            } else {
                this.setStyleProperty(BiBrowserCheck.constants.OPACITY_STYLE, n);
            }
        }
    }
};
BiComponent.addProperty("opacity", BiAccessType.READ);
_p._getIeFilter = function () {
    if (this._opacity == 1) {
        return BiString.EMPTY;
    }
    return "Alpha(Opacity=" + Math.round(this._opacity * 100) + ")";
};
_p.setLeft = function (nLeft) {
    if (this._left != nLeft) {
        this._left = nLeft;
        this.invalidateParentLayout(BiComponent.STRING_SIZE);
    }
};
_p.setRight = function (nRight) {
    if (this._right != nRight) {
        this._right = nRight;
        this.invalidateParentLayout(BiComponent.STRING_SIZE);
    }
};
_p.setTop = function (nTop) {
    if (this._top != nTop) {
        this._top = nTop;
        this.invalidateParentLayout(BiComponent.STRING_SIZE);
    }
};
_p.setBottom = function (nBottom) {
    if (this._bottom != nBottom) {
        this._bottom = nBottom;
        this.invalidateParentLayout(BiComponent.STRING_SIZE);
    }
};
_p.setTlrb = function (nValue) {
    this.setTop(nValue);
    this.setLeft(nValue);
    this.setRight(nValue);
    this.setBottom(nValue);
};
_p.setWidth = function (nWidth) {
    if (this._width != nWidth) {
        this._width = nWidth;
        this.invalidateParentLayout(BiComponent.STRING_SIZE);
    }
};
_p.setHeight = function (nHeight) {
    if (this._height != nHeight) {
        this._height = nHeight;
        this.invalidateParentLayout(BiComponent.STRING_SIZE);
    }
};
_p.setSize = function (nWidth, nHeight) {
    if (this._width != nWidth || this._height != nHeight) {
        this._width = nWidth;
        this._height = nHeight;
        this.invalidateParentLayout(BiComponent.STRING_SIZE);
    }
};
_p.setLocation = function (nLeft, nTop) {
    if (this._left != nLeft || this._top != nTop) {
        this._left = nLeft;
        this._top = nTop;
        this.invalidateParentLayout(BiComponent.STRING_SIZE);
    }
};
_p.setBounds = function (nLeft, nTop, nWidth, nHeight) {
    if (this._left != nLeft || this._top != nTop || this._width != nWidth || this._height != nHeight) {
        this._left = nLeft;
        this._top = nTop;
        this._width = nWidth;
        this._height = nHeight;
        this.invalidateParentLayout(BiComponent.STRING_SIZE);
    }
};
_p._invalidatePreferredOrActualSize = function () {
    this.invalidateParentLayout(this.getHasFixedWidth() && this.getHasFixedHeight() ? "preferred" : BiComponent.STRING_SIZE);
};
_p.invalidateParentLayout = function (sHint) {
    if (sHint !== "preferred") {
        this._invalidBoundaries = true;
    }
    if (!sHint || sHint === BiComponent.STRING_SIZE || sHint === "preferred") {
        this._cachedPreferredWidth = null;
        this._cachedPreferredHeight = null;
    }
    var p = this._parent;
    if (p) p.invalidateChild(this, sHint);
};
_p.invalidateLayout = function () {
    this._invalidLayout = true;
    if (this._created) BiComponent.enqueueLayout(this);
};
_p.invalidateChild = function (oChild, sHint) {
    if (sHint == null || sHint == BiComponent.STRING_SIZE) this._invalidateChild(oChild, sHint);
};
_p._invalidateChild = function (oChild, sHint) {
    if (!oChild._invalidBoundaries) {
        oChild._invalidBoundaries = true;
        oChild.invalidateParentLayout(sHint);
    }
    oChild._invalidBoundaries = true;
    if (oChild._created) BiComponent.enqueueLayout(oChild);
};
_p._invalidBoundaries = true;
_p._invalidLayout = false;
BiComponent._layoutQueue = [];
BiComponent._inFlushLayoutQueue = false;
BiComponent._inFlushLayoutComponent = false;
BiComponent.enqueueLayout = function (c) {
    if (!c._inLayoutQueue) {
        this._layoutQueue.push(c);
        c._inLayoutQueue = true;
    }
};
BiComponent.flushLayoutQueue = function () {
    if (this._inFlushLayoutQueue || this._inFlushLayoutComponent) return;
    this._inFlushLayoutQueue = true;
    for (var i = 0, c;
        (c = this._layoutQueue[i]); i++) {
        if (c._inLayoutQueue) {
            this.flushLayoutComponent(c);
        }
    }
    this._layoutQueue = [];
    this._inFlushLayoutQueue = false;
};
BiComponent.flushLayoutComponent = function (c) {
    if (this._inFlushLayoutComponent) return;
    this._inFlushLayoutComponent = true;
    var hc;
    var cs = [];
    while (c) {
        if (c._inLayoutQueue) {
            cs.push(c);
        }
        c = c._parent;
    }
    for (var i = cs.length - 1; c = cs[i]; i--) {
        c._inLayoutQueue = false;
        if (c.getDisposed()) continue;
        if (c._invalidBoundaries) c.layoutComponent();
        if (c._invalidLayout) c.layoutAllChildren();
    }
    this._inFlushLayoutComponent = false;
};
_p.layoutComponent = function () {
    var p;
    if (this._created && (p = this._parent)) {
        p.layoutChild(this);
    }
};
_p.layoutChild = function (oChild) {
    var sizeChanged = this._layoutChild(oChild);
    if (sizeChanged) {
        oChild.invalidateLayout();
        this._refreshMozScrollBars();
    }
};
_p._refreshMozScrollBars = function () {
    if (!BiBrowserCheck.moz || BiBrowserCheck.versionNumber < 1.8 || this._refreshingScrollBars) return;
    this._refreshingScrollBars = true;
    var sx = this.getStyleProperty("overflowX");
    var sy = this.getStyleProperty("overflowY");
    if (sx != "hidden" || sy != "hidden") {
        this.setStyleProperty("overflowX", "hidden");
        this.setStyleProperty("overflowY", "hidden");
        var oThis = this;
        BiTimer.callOnce(function () {
            oThis._refreshingScrollBars = false;
            oThis.setStyleProperty("overflowX", sx);
            oThis.setStyleProperty("overflowY", sy);
        }, 0);
    }
};
_p.layoutChildX = _p.layoutChild;
_p.layoutChildY = _p.layoutChild;
_p.layoutAllChildren = function () {
    var cs = this._children;
    var l = cs.length;
    for (var i = 0; i < l; i++) {
        cs[i].layoutComponent();
    }
    this._invalidLayout = false;
};
_p.layoutAllChildrenX = _p.layoutAllChildren;
_p.layoutAllChildrenY = _p.layoutAllChildren;
_p._layoutChild = function (oChild) {
    var x, y, w, h;
    var cw, ch;
    if (oChild._left != null) {
        x = oChild._left;
        if (oChild._right != null) {
            cw = this.getClientWidth();
            w = cw - oChild._left - oChild._right;
        } else if (oChild._width != null) {
            w = oChild._width;
        }
    } else if (oChild._right != null) {
        if (oChild._width != null) w = oChild._width;
        else {
            oChild.removeStyleProperty("width");
            if (BiBrowserCheck.ie && oChild._measuredHeight == 0 && oChild._created) {
                oChild._element.runtimeStyle.display = BiString.EMPTY;
            }
            w = oChild.getWidth();
        }
        cw = this.getClientWidth();
        x = cw - w - oChild._right;
    } else if (oChild._width != null) {
        w = oChild._width;
    }
    if (oChild._top != null) {
        y = oChild._top;
        if (oChild._bottom != null) {
            ch = this.getClientHeight();
            h = ch - oChild._top - oChild._bottom;
        } else if (oChild._height != null) {
            h = oChild._height;
        }
    } else if (oChild._bottom != null) {
        if (oChild._height != null) h = oChild._height;
        else {
            oChild.removeStyleProperty("height");
            if (BiBrowserCheck.ie && oChild._measuredHeight == 0 && oChild._created) {
                oChild._element.runtimeStyle.display = BiString.EMPTY;
            }
            h = oChild.getHeight();
        }
        ch = this.getClientHeight();
        y = ch - h - oChild._bottom;
    } else if (oChild._height != null) {
        h = oChild._height;
    }
    return this._layoutChild2(oChild, x, y, w, h);
};
_p._layoutChild2 = function (c, x, y, w, h, bInvalidate) {
    var wChanged = false;
    var hChanged = false;
    var componentMoved = (x != (c._clientLeft || 0)) || (y != (c._clientTop || 0));
    c._clientLeft = x;
    c._clientTop = y;
    c._invalidBoundaries = false;
    if (w != null) {
        wChanged = w != c._measuredWidth;
        c._measuredWidth = w;
    }
    if (h != null) {
        hChanged = h != c._measuredHeight;
        c._measuredHeight = h;
    }
    if (BiBrowserCheck.ie) {
        if (x != null) c.setStyleProperty(BiComponent.STRING_LEFT, x);
        if (y != null) c.setStyleProperty(BiComponent.STRING_TOP, y);
        if (w != null) c.setStyleProperty(BiComponent.STRING_WIDTH, w);
        if (h != null) c.setStyleProperty(BiComponent.STRING_HEIGHT, h);
    } else {
        if (x != null) c.setStyleProperty(BiComponent.STRING_LEFT, x + BiComponent.STRING_PX);
        if (y != null) c.setStyleProperty(BiComponent.STRING_TOP, y + BiComponent.STRING_PX);
        if (w != null) c.setStyleProperty(BiComponent.STRING_WIDTH, w + BiComponent.STRING_PX);
        if (h != null) c.setStyleProperty(BiComponent.STRING_HEIGHT, h + BiComponent.STRING_PX);
    } if (componentMoved) {
        c.dispatchEvent(BiComponent.STRING_MOVE);
    }
    if (wChanged || hChanged) {
        c.dispatchEvent(BiComponent.STRING_RESIZE);
        if (bInvalidate) {
            c.invalidateLayout();
        }
        return true;
    }
    return false;
};
_p.getLeft = function () {
    if (this._created && this._parent) {
        BiComponent.flushLayoutComponent(this);
        return this._element.offsetLeft;
    }
    return this._left;
};
_p.getRight = function () {
    if (this._created && this._parent) {
        BiComponent.flushLayoutComponent(this);
        return this._parent.getClientWidth() - this.getLeft() - this.getWidth();
    }
    return this._right;
};
_p.getTop = function () {
    if (this._created && this._parent) {
        BiComponent.flushLayoutComponent(this);
        return this._element.offsetTop;
    }
    return this._top;
};
_p.getBottom = function () {
    if (this._created && this._parent) {
        BiComponent.flushLayoutComponent(this);
        return this._parent.getClientHeight() - this.getTop() - this.getHeight();
    }
    return this._bottom;
};
_p.getWidth = function () {
    if (this._created) {
        BiComponent.flushLayoutComponent(this);
        return BiBrowserCheck.moz ? this._measureElement().width : this._element.offsetWidth;
    }
    return this._width;
};
_p.getHeight = function () {
    if (this._created) {
        BiComponent.flushLayoutComponent(this);
        return BiBrowserCheck.moz ? this._measureElement().height : this._element.offsetHeight;
    }
    return this._height;
};
_p._measureElement = function () {
    if (this._element.style.width == BiString.EMPTY) {
        var ps = this._element.parentNode.style;
        var w = ps.width;
        var h = ps.height;
        ps.width = ps.height = "9999999px";
    }
    var res = {
        width: this._element.offsetWidth,
        height: this._element.offsetHeight
    };
    if (ps !== undefined) {
        ps.width = w;
        ps.height = h;
    }
    return res;
};
_p.getHasFixedWidth = function () {
    return this._width != null || this._left != null && this._right != null;
};
_p.getHasFixedHeight = function () {
    return this._height != null || this._top != null && this._bottom != null;
};
_p.getClientWidth = function () {
    if (this._created) {
        BiComponent.flushLayoutComponent(this);
        return this._element.clientWidth;
    }
    throw new Error("Visual property on non created component");
};
_p.getClientHeight = function () {
    if (this._created) {
        BiComponent.flushLayoutComponent(this);
        return this._element.clientHeight;
    }
    throw new Error("Visual property on non created component");
};
_p.getInsetLeft = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    BiComponent.flushLayoutComponent(this);
    var el = this._element;
    if (typeof el.clientLeft != 'undefined') return el.clientLeft;
    else {
        var rtl = this.getRightToLeft();
        var cs = this._document.defaultView.getComputedStyle(el, BiString.EMPTY);
        if (!rtl) return parseInt(cs.borderLeftWidth);
        return el.offsetWidth - el.clientWidth - parseInt(cs.borderRightWidth);
    }
};
_p.getInsetRight = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    BiComponent.flushLayoutComponent(this);
    var el = this._element;
    if (BiBrowserCheck.ie) {
        if (this.getStyleProperty("overflowY") == BiComponent.STYLE_HIDDEN || el.clientWidth == 0) {
            if (el.currentStyle.borderRightStyle == BiComponent.STYLE_NONE) return 0;
            var brw = el.currentStyle.borderRightWidth;
            if (brw.indexOf("px") != -1) return parseInt(brw);
        }
        return Math.max(0, el.offsetWidth - el.clientLeft - el.clientWidth);
    } else {
        var rtl = this.getRightToLeft();
        var cs = this._document.defaultView.getComputedStyle(el, BiString.EMPTY);
        if (rtl) return parseInt(cs.borderRightWidth);
        return Math.max(0, el.offsetWidth - el.clientWidth - parseInt(cs.borderLeftWidth));
    }
};
_p.getInsetTop = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    BiComponent.flushLayoutComponent(this);
    if (typeof this._element.clientTop != 'undefined') return this._element.clientTop;
    else return parseInt(window.getComputedStyle(this._element, BiString.EMPTY).borderTopWidth);
};
_p.getInsetBottom = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    BiComponent.flushLayoutComponent(this);
    var el = this._element;
    if (BiBrowserCheck.ie) {
        if (this.getStyleProperty("overflowX") == BiComponent.STYLE_HIDDEN || el.clientHeight == 0) {
            if (el.currentStyle.borderBottomStyle == BiComponent.STYLE_NONE) return 0;
            var bbw = el.currentStyle.borderBottomWidth;
            if (bbw.indexOf("px") != -1) return parseInt(bbw);
        }
        return Math.max(0, this._element.offsetHeight - this._element.clientTop - this._element.clientHeight);
    } else {
        var cs = this._document.defaultView.getComputedStyle(el, BiString.EMPTY);
        return Math.max(0, el.offsetHeight - el.clientHeight - parseInt(cs.borderTopWidth));
    }
};
_p.getClientLeft = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    BiComponent.flushLayoutComponent(this);
    return BiComponent._getElementPositionInFrame(this._element).x;
};
_p.getClientTop = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    BiComponent.flushLayoutComponent(this);
    return BiComponent._getElementPositionInFrame(this._element).y;
};
_p.getScreenLeft = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    BiComponent.flushLayoutComponent(this);
    return BiComponent._getElementScreenPosition(this._element).x;
};
_p.getScreenTop = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    BiComponent.flushLayoutComponent(this);
    return BiComponent._getElementScreenPosition(this._element).y;
};
_p.getContentBox = function () {
    BiComponent.flushLayoutComponent(this);
    var box = BiComponent._getElementPositionInFrame(this._element);
    box.width = this._element.clientWidth;
    box.height = this._element.clientHeight;
    return box;
};
_p.getPreferredWidth = function () {
    if (this._preferredWidth != null) return this._preferredWidth;
    if (this._cachedPreferredWidth != null) {
        return this._cachedPreferredWidth;
    }
    if (!this._created) {
        throw new Error("Visual property on non created component");
    }
    BiComponent.flushLayoutQueue();
    return this._cachedPreferredWidth = this._computePreferredWidth();
};
_p._computePreferredWidth = function () {
    if (BiBrowserCheck.ie && this._measuredHeight == 0) {
        var old = this._element.runtimeStyle.display;
        this._element.runtimeStyle.display = BiString.EMPTY;
    }
    var el = this._element;
    var style = el.runtimeStyle || el.style;
    var w = style.width;
    var h = style.height;
    style.width = BiComponent.STYLE_AUTO;
    style.height = BiComponent.STYLE_AUTO;
    var max = el.scrollWidth;
    var rtl = this.getRightToLeft();
    var cs = this._children;
    var l = cs.length;
    for (var i = 0; i < l; i++) {
        if (cs[i] instanceof BiComponent) {
            max = Math.max(max, (rtl ? cs[i].getRight() : cs[i].getLeft()) + cs[i].getWidth());
        }
    }
    style.width = w;
    style.height = h;
    var rv = this.getInsetLeft() + max + this.getInsetRight();
    if (BiBrowserCheck.ie && this._measuredHeight == 0) {
        this._element.runtimeStyle.display = old;
    }
    return rv;
};
_p.getPreferredHeight = function () {
    if (this._preferredHeight != null) return this._preferredHeight;
    if (!this._preventCacheHeight && this._cachedPreferredHeight != null) {
        return this._cachedPreferredHeight;
    }
    if (!this._created) {
        throw new Error("Visual property on non created component");
    }
    BiComponent.flushLayoutQueue();
    return this._cachedPreferredHeight = this._computePreferredHeight();
};
_p._computePreferredHeight = function () {
    if (BiBrowserCheck.ie && this._measuredHeight == 0) {
        var old = this._element.runtimeStyle.display;
        this._element.runtimeStyle.display = BiString.EMPTY;
    }
    var el = this._element;
    var style = el.runtimeStyle || el.style;
    var w = style.width;
    var h = style.height;
    style.width = BiComponent.STYLE_AUTO;
    style.height = BiComponent.STYLE_AUTO;
    var max = el.scrollHeight;
    var cs = this._children;
    var l = cs.length;
    for (var i = 0; i < l; i++) {
        if (cs[i] instanceof BiComponent) {
            max = Math.max(max, cs[i].getTop() + cs[i].getHeight());
        }
    }
    style.width = w;
    style.height = h;
    var rv = this.getInsetTop() + max + this.getInsetBottom();
    if (BiBrowserCheck.ie && this._measuredHeight == 0) {
        this._element.runtimeStyle.display = old;
    }
    return rv;
};
_p.setPreferredWidth = function (n) {
    if (this._preferredWidth != n) {
        this._preferredWidth = n;
        this.invalidateParentLayout("preferred");
    }
};
_p.setPreferredHeight = function (n) {
    if (this._preferredHeight != n) {
        this._preferredHeight = n;
        this.invalidateParentLayout("preferred");
    }
};
_p.setPreferredSize = function (nWidth, nHeight) {
    this.setPreferredWidth(nWidth);
    this.setPreferredHeight(nHeight);
};
_p.pack = function () {
    this.setSize(this.getPreferredWidth(), this.getPreferredHeight());
};
_p.getMinimumWidth = function () {
    return this._minimumWidth || 0;
};
_p.setMinimumWidth = function (n) {
    if (this._minimumWidth != n) {
        this._minimumWidth = n;
        this.invalidateParentLayout("minimum");
    }
};
_p.getMaximumWidth = function () {
    return this._maximumWidth || Infinity;
};
_p.setMaximumWidth = function (n) {
    if (this._maximumWidth != n) {
        this._maximumWidth = n;
        this.invalidateParentLayout("maximum");
    }
};
_p.getMinimumHeight = function () {
    return this._minimumHeight || 0;
};
_p.setMinimumHeight = function (n) {
    if (this._minimumHeight != n) {
        this._minimumHeight = n;
        this.invalidateParentLayout("minimum");
    }
};
_p.getMaximumHeight = function () {
    return this._maximumHeight || Infinity;
};
_p.setMaximumHeight = function (n) {
    if (this._maximumHeight != n) {
        this._maximumHeight = n;
        this.invalidateParentLayout("maximum");
    }
};
_p.setBorder = function (oBorder) {
    if (this._border) this._border.removeBorder(this);
    this._border = oBorder;
    if (oBorder) this._border.paintBorder(this);
    this._invalidatePreferredOrActualSize();
    this.invalidateLayout();
};
_p.getBorder = function () {
    return this._border || new BiBorder;
};
_p._marginLeft = 0;
_p._marginRight = 0;
_p._marginTop = 0;
_p._marginBottom = 0;
BiComponent.addProperty("marginLeft", BiAccessType.READ);
_p.setMarginLeft = function (n) {
    if (this._marginLeft != n) {
        this._marginLeft = Number(n);
        this.invalidateParentLayout("margin");
    }
};
BiComponent.addProperty("marginRight", BiAccessType.READ);
_p.setMarginRight = function (n) {
    if (this._marginRight != n) {
        this._marginRight = Number(n);
        this.invalidateParentLayout("margin");
    }
};
BiComponent.addProperty("marginTop", BiAccessType.READ);
_p.setMarginTop = function (n) {
    if (this._marginTop != n) {
        this._marginTop = Number(n);
        this.invalidateParentLayout("margin");
    }
};
BiComponent.addProperty("marginBottom", BiAccessType.READ);
_p.setMarginBottom = function (n) {
    if (this._marginBottom != n) {
        this._marginBottom = Number(n);
        this.invalidateParentLayout("margin");
    }
};
_p.setMargin = function (nLeft, nRight, nTop, nBottom) {
    if (arguments.length == 1) {
        nBottom = nTop = nRight = nLeft;
    } else if (arguments.length == 2) {
        nTop = nBottom = nRight;
        nRight = nLeft;
    }
    this._marginLeft = Number(nLeft);
    this._marginRight = Number(nRight);
    this._marginTop = Number(nTop);
    this._marginBottom = Number(nBottom);
    this.invalidateParentLayout("margin");
};
_p._clipLeft = null;
_p._clipRight = null;
_p._clipTop = null;
_p._clipBottom = null;
_p.setClip = function (nLeft, nTop, nWidth, nHeight) {
    if (nLeft == BiComponent.STYLE_AUTO) nLeft = null;
    if (nTop == BiComponent.STYLE_AUTO) nTop = null;
    if (nWidth == BiComponent.STYLE_AUTO) nWidth = null;
    if (nHeight == BiComponent.STYLE_AUTO) nHeight = null;
    if (nLeft != this._clipLeft || nTop != this._clipTop || nWidth != this._clipWidth || nHeight != this._clipHeight) {
        this._clipLeft = nLeft;
        this._clipTop = nTop;
        this._clipWidth = nWidth;
        this._clipHeight = nHeight;
        this._setClipValue();
    }
};
BiComponent.addProperty("clipLeft", BiAccessType.READ);
_p.setClipLeft = function (nLeft) {
    if (nLeft == BiComponent.STYLE_AUTO) nLeft = null;
    if (this._clipLeft != nLeft) {
        this._clipLeft = nLeft;
        this._setClipValue();
    }
};
BiComponent.addProperty("clipTop", BiAccessType.READ);
_p.setClipTop = function (nTop) {
    if (nTop == BiComponent.STYLE_AUTO) nTop = null;
    if (this._clipTop != nTop) {
        this._clipTop = nTop;
        this._setClipValue();
    }
};
BiComponent.addProperty("clipWidth", BiAccessType.READ);
_p.setClipWidth = function (nWidth) {
    if (nWidth == BiComponent.STYLE_AUTO) nWidth = null;
    if (this._clipWidth != nWidth) {
        this._clipWidth = nWidth;
        this._setClipValue();
    }
};
BiComponent.addProperty("clipHeight", BiAccessType.READ);
_p.setClipHeight = function (nHeight) {
    if (nHeight == BiComponent.STYLE_AUTO) nHeight = null;
    if (this._clipHeight != nHeight) {
        this._clipHeight = nHeight;
        this._setClipValue();
    }
};
_p._setClipValue = function () {
    var left = this._clipLeft;
    var top = this._clipTop;
    var width = this._clipWidth;
    var height = this._clipHeight;
    var right, bottom;
    if (left == null) {
        if (width == null) right = BiComponent.STYLE_AUTO;
        else right = width + "px";
        left = BiComponent.STYLE_AUTO;
    } else {
        if (width == null) right = BiComponent.STYLE_AUTO;
        else right = left + width + "px";
        left = left + "px";
    } if (top == null) {
        if (height == null) bottom = BiComponent.STYLE_AUTO;
        else bottom = height + "px";
        top = BiComponent.STYLE_AUTO;
    } else {
        if (height == null) bottom = BiComponent.STYLE_AUTO;
        else bottom = top + height + "px";
        top = top + "px";
    }
    this.setStyleProperty("clip", "rect(" + top + "," + right + "," + bottom + "," + left + ")");
};
_p.setOverflow = function (sOverflow) {
    if (BiBrowserCheck.features.hasOverflowX) {
        this.setOverflowX(sOverflow);
        this.setOverflowY(sOverflow);
    } else {
        this._overflow = sOverflow;
        this._overflowX = sOverflow;
        this._overflowY = sOverflow;
        if (sOverflow == BiComponent.STYLE_HIDDEN) sOverflow = BiComponent.STYLE_MOZ_SCROLLBARS_NONE;
        this.setStyleProperty("overflow", sOverflow);
        this._invalidatePreferredOrActualSize();
        this.invalidateLayout();
    }
};
_p.getOverflow = function () {
    if (BiBrowserCheck.features.hasOverflowX) {
        var x = this.getOverflowX();
        var y = this.getOverflowY();
        return x == y ? x : null;
    } else {
        var s = this.getStyleProperty("overflow");
        if (s == BiComponent.STYLE_MOZ_SCROLLBARS_HORIZONTAL || s == BiComponent.STYLE_MOZ_SCROLLBARS_VERTICAL) return null;
        else if (s == BiComponent.STYLE_MOZ_SCROLLBARS_NONE) return BiComponent.STYLE_HIDDEN;
        else return s;
    }
};
_p.setOverflowX = function (sOverflowX) {
    if (this._overflowX != sOverflowX) {
        if (BiBrowserCheck.features.hasOverflowX) this.setStyleProperty("overflowX", sOverflowX);
        else {
            var s;
            this._overflowX = sOverflowX;
            if (this._overflowX == BiComponent.STYLE_HIDDEN && this._overflowY == BiComponent.STYLE_HIDDEN) s = BiComponent.STYLE_MOZ_SCROLLBARS_NONE;
            else if (this._overflowX == this._overflowY) s = sOverflowX;
            else if (this._overflowX == BiComponent.STYLE_HIDDEN && this._overflowY == BiComponent.STYLE_SCROLL) s = BiComponent.STYLE_MOZ_SCROLLBARS_VERTICAL;
            else if (this._overflowX == BiComponent.STYLE_SCROLL || this._overflowY == BiComponent.STYLE_SCROLL) s = BiComponent.STYLE_SCROLL;
            else if (this._overflowX == BiComponent.STYLE_AUTO || this._overflowY == BiComponent.STYLE_AUTO) s = BiComponent.STYLE_AUTO;
            else s = BiComponent.STYLE_MOZ_SCROLLBARS_HORIZONTAL;
            this.setStyleProperty("overflow", s);
        }
        this._invalidatePreferredOrActualSize();
        this.invalidateLayout();
    }
};
_p.setOverflowY = function (sOverflowY) {
    if (this._overflowY != sOverflowY) {
        if (BiBrowserCheck.features.hasOverflowX) this.setStyleProperty("overflowY", sOverflowY);
        else {
            var s;
            this._overflowY = sOverflowY;
            if (this._overflowX == BiComponent.STYLE_HIDDEN && this._overflowY == BiComponent.STYLE_HIDDEN) s = BiComponent.STYLE_MOZ_SCROLLBARS_NONE;
            else if (this._overflowX == this._overflowY) s = sOverflowY;
            else if (this._overflowX == BiComponent.STYLE_HIDDEN && this._overflowY == BiComponent.STYLE_SCROLL) s = BiComponent.STYLE_MOZ_SCROLLBARS_VERTICAL;
            else if (this._overflowX == BiComponent.STYLE_SCROLL || this._overflowY == BiComponent.STYLE_SCROLL) s = BiComponent.STYLE_SCROLL;
            else if (this._overflowX == BiComponent.STYLE_AUTO || this._overflowY == BiComponent.STYLE_AUTO) s = BiComponent.STYLE_AUTO;
            else s = BiComponent.STYLE_MOZ_SCROLLBARS_HORIZONTAL;
            this.setStyleProperty("overflow", s);
        }
        this._invalidatePreferredOrActualSize();
        this.invalidateLayout();
    }
};
_p.getOverflowX = function () {
    if (BiBrowserCheck.features.hasOverflowX) return this.getStyleProperty("overflowX");
    else {
        var s = this.getStyleProperty("overflow");
        if (s == BiComponent.STYLE_MOZ_SCROLLBARS_HORIZONTAL) return BiComponent.STYLE_SCROLL;
        else if (s == BiComponent.STYLE_MOZ_SCROLLBARS_VERTICAL || s == BiComponent.STYLE_MOZ_SCROLLBARS_NONE) return BiComponent.STYLE_HIDDEN;
        else return s;
    }
};
_p.getOverflowY = function () {
    if (BiBrowserCheck.features.hasOverflowX) return this.getStyleProperty("overflowY");
    else {
        var s = this.getStyleProperty("overflow");
        if (s == BiComponent.STYLE_MOZ_SCROLLBARS_VERTICAL) return BiComponent.STYLE_SCROLL;
        else if (s == BiComponent.STYLE_MOZ_SCROLLBARS_HORIZONTAL || s == BiComponent.STYLE_MOZ_SCROLLBARS_NONE) return BiComponent.STYLE_HIDDEN;
        else return s;
    }
};
_p.setScrollLeft = function (nScrollLeft) {
    if (!this._created) throw new Error("Visual property on non created component");
    if (!BiBrowserCheck.quirks.scrollAlwaysFires || this._element.scrollLeft !== nScrollLeft) this._element.scrollLeft = nScrollLeft;
};
_p.setScrollTop = function (nScrollTop) {
    if (!this._created) throw new Error("Visual property on non created component");
    if (!BiBrowserCheck.quirks.scrollAlwaysFires || this._element.scrollTop !== nScrollTop) this._element.scrollTop = nScrollTop;
};
_p.getScrollLeft = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    BiComponent.flushLayoutComponent(this);
    var ow = this._element.offsetWidth;
    return this._element.scrollLeft;
};
_p.getScrollTop = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    BiComponent.flushLayoutComponent(this);
    var oh = this._element.offsetHeight;
    return this._element.scrollTop;
};
_p.getScrollWidth = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    BiComponent.flushLayoutComponent(this);
    var ow = this._element.offsetWidth;
    if (BiBrowserCheck.ie && BiBrowserCheck.versionNumber == 5.5) {
        var max = this._element.scrollWidth;
        var cs = this._children;
        var l = cs.length;
        for (var i = 0; i < l; i++) max = Math.max(max, cs[i].getLeft() + cs[i].getWidth());
        return max;
    } else return this._element.scrollWidth;
};
_p.getScrollHeight = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    BiComponent.flushLayoutComponent(this);
    var oh = this._element.offsetHeight;
    if (BiBrowserCheck.ie && BiBrowserCheck.versionNumber == 5.5) {
        var max = this._element.scrollHeight;
        var cs = this._children;
        var l = cs.length;
        for (var i = 0; i < l; i++) max = Math.max(max, cs[i].getTop() + cs[i].getHeight());
        return max;
    } else return this._element.scrollHeight;
};
_p.scrollIntoView = function (bTopLeft) {
    this.scrollIntoViewX(bTopLeft);
    this.scrollIntoViewY(bTopLeft);
};
_p.scrollIntoViewX = function (bLeft) {
    var p = this._parent;
    if (!this._created || !p) return;
    var l = this.getLeft();
    var w = this.getWidth();
    var sl = p.getScrollLeft();
    var cw = p.getClientWidth();
    var rtl = this.getRightToLeft();
    var pos, scroll;
    if (rtl) {
        pos = cw - l - w;
        var sw = p.getScrollWidth();
        scroll = sw - cw - sl;
    } else {
        pos = l;
        scroll = sl;
    } if (bLeft === true) scroll = pos;
    else if (bLeft === false) scroll = pos + width;
    else scroll = BiComponent._scrollIntoViewX(pos, w, scroll, cw); if (scroll != null) p.setScrollLeft(rtl ? sw - cw - scroll : scroll);
};
BiComponent._scrollIntoViewX = function (pos, width, scrollPos, clientWidth) {
    if (pos < scrollPos || width > clientWidth) return pos;
    var rightJustifyPos = pos + width - clientWidth;
    if (scrollPos < rightJustifyPos) return rightJustifyPos;
    return null;
};
_p.scrollIntoViewY = function (bTop) {
    if (!this._created) {
        return;
    }
    var p = this._parent;
    if (!p) return;
    var t = this.getTop();
    var h = this.getHeight();
    var st = p.getScrollTop();
    var ch = p.getClientHeight();
    if (bTop) p.setScrollTop(t);
    else if (bTop == false) p.setScrollTop(t + h - ch);
    else if (h > ch || t < st) p.setScrollTop(t);
    else if (t + h > st + ch) p.setScrollTop(t + h - ch);
};
BiComponent.addProperty("tabIndex", BiAccessType.READ);
_p.setTabIndex = function (nTabIndex) {
    this._tabIndex = nTabIndex;
    if (BiBrowserCheck.ie) {
        this.setHtmlProperty("unselectable", nTabIndex < 0 || !this._enabled);
    } else {
        this.setStyleProperty("MozUserFocus", nTabIndex < 0 ? "ignore" : "normal");
    }
    this.setHtmlProperty("tabIndex", nTabIndex < 0 ? -1 : nTabIndex > 0 ? 1 : 0);
};
_p.initAccessibility = function () {};
_p.getDescription = function () {
    return BiString.EMPTY;
};
_p.getChangeDescription = function () {
    return BiString.EMPTY;
};
_p.getAccessibilityLink = function () {
    return this._accessibilityLink && this._accessibilityLink.getEnabled();
};
_p.setAccessibilityLink = function (bLinkOn) {
    if (!this._accessibilityLink) this._accessibilityLink = new BiAccessibilityLink(this);
    this._accessibilityLink.setEnabled(bLinkOn);
};
_p._updateAccessibilityLink = function () {
    if (this._accessibilityLink) this._accessibilityLink.update();
};
BiComponent.addProperty("hideFocus", BiAccessType.READ);
_p.setHideFocus = function (bHideFocus) {
    this._hideFocus = bHideFocus;
    if (BiBrowserCheck.ie) this.setHtmlProperty("hideFocus", bHideFocus);
    else {
        if (bHideFocus) {
            this.setStyleProperty("MozOutline", BiComponent.STYLE_NONE);
            this.setStyleProperty("outline", BiComponent.STYLE_NONE);
        } else {
            this.removeStyleProperty("MozOutline");
            this.removeStyleProperty("outline");
        }
    }
};
_p._getFocusElement = function () {
    return this._element;
};
_p._focusComponent = function () {
    var elt = this._getFocusElement();
    try {
        if (elt.setActive) elt.setActive();
        else if (elt.focus) {
            var scrollLeft = [];
            var scrollTop = [];
            var body = this._document.body;
            var e = elt.parentNode || body;
            while (e.nodeType == 1 && e != body) {
                scrollLeft.push(e.scrollLeft);
                scrollTop.push(e.scrollTop);
                e = e.parentNode;
            }
            elt.focus();
            e = elt.parentNode || body;
            var left, top, hidden;
            var view = this._document.defaultView;
            while (e.nodeType == 1 && e != body) {
                hidden = (view.getComputedStyle(e, BiString.EMPTY).getPropertyValue("overflow") == BiComponent.STYLE_HIDDEN);
                left = scrollLeft.shift();
                top = scrollTop.shift();
                if (hidden) {
                    if (e.scrollLeft != left) e.scrollLeft = left;
                    if (e.scrollTop != top) e.scrollTop = top;
                }
                e = e.parentNode;
            }
        }
        var tlc = this.getTopLevelComponent();
        if (tlc) tlc._eventManager._mozOnFocus(null, this, elt);
    } catch (ex) {}
};
_p._blurComponent = function () {
    if (this.getDisposed()) return;
    var elt = this._getFocusElement();
    try {
        elt.blur();
        var tlc = this.getTopLevelComponent();
        if (tlc) tlc._eventManager._mozOnBlur(null, this, elt);
    } catch (ex) {}
};
BiComponent.addProperty("focused", BiAccessType.READ);
_p.setFocused = function (bFocused) {
    if (bFocused && !this.getCanFocus()) throw new Error("Cannot set focus to component");
    if (this._focused != bFocused) {
        if (bFocused) this._focusComponent();
        else {
            var tlc = this.getTopLevelComponent();
            if (tlc) tlc._eventManager._setFocusedComponent(null);
            this._blurComponent();
        }
    }
};
_p.getFirstFocusable = function () {
    if (this.getCanFocus()) return this;
    return application.getFocusManager().getFirst(this);
};
_p.getContainsFocus = function () {
    var fr = this.getFocusRoot();
    if (fr) return this.contains(fr.getActiveComponent());
    return false;
};
_p.getCanFocus = function () {
    return this._created && this.getTabIndex() >= 0 && this.getIsEnabled() && this.getIsVisible();
};
_p.getFocusRoot = function () {
    if (this._parent) return this._parent.getFocusRoot();
    return null;
};
_p.getActiveComponent = function () {
    var fr = this.getFocusRoot();
    if (fr) return fr.getActiveComponent();
    return null;
};
_p.isFocusRoot = function () {
    return false;
};
_p.getTabChildren = function () {
    return this.getChildren();
};
BiComponent.addProperty("canSelect", BiAccessType.READ);
_p.setCanSelect = function (bCanSelect) {
    this._canSelect = bCanSelect;
    var userSelectStyle = BiBrowserCheck.constants.USER_SELECT_STYLE;
    if (userSelectStyle) {
        if (bCanSelect) this.removeStyleProperty(userSelectStyle);
        else this.setStyleProperty(userSelectStyle, BiComponent.STYLE_NONE);
    } else {
        if (bCanSelect) this.removeHtmlProperty("unselectable");
        else this.setHtmlProperty("unselectable", "on");
    }
};
BiComponent.addProperty("enabled", BiAccessType.READ);
_p.setEnabled = function (bEnabled) {
    if (this._enabled != bEnabled) {
        this._enabled = bEnabled;
        if (this._command) this._command.setEnabled(bEnabled);
        if (!bEnabled || !this._parent || !this._parent.getHtmlProperty("disabled")) this._setEnabled(bEnabled);
        this._updateAccessibilityLink();
        this.dispatchEvent("enabledchanged");
    }
};
_p._setEnabled = function (bEnabled) {
    if (this.getTabIndex() >= 0) {
        if (BiBrowserCheck.ie) {
            if (!bEnabled || !this._canSelect) this.setHtmlProperty("unselectable", "on");
            else this.removeHtmlProperty("unselectable");
        }
        if (!bEnabled && this.getFocused()) {
            this.setFocused(false);
        }
    }
    this.setHtmlProperty("disabled", !bEnabled);
    if (!BiBrowserCheck.ie) {
        if (bEnabled) this._removeHtmlAttribute("disabled");
        else this._setHtmlAttribute("disabled", "true");
    }
    var tlc;
    if (bEnabled && this.getCanFocus() && (tlc = this.getTopLevelComponent()) && tlc.getActiveComponent() == this) {
        this.setFocused(true);
    }
    var cs = this._children;
    var l = cs.length;
    for (var i = 0; i < l; i++) {
        cs[i]._setEnabled(bEnabled && cs[i].getEnabled());
    }
};
_p.getIsEnabled = function () {
    if (!this.getEnabled()) {
        return false;
    }
    if (this._created) {
        if (BiBrowserCheck.ie) {
            return !this._element.isDisabled;
        } else {
            var el = this._element;
            while (el) {
                if (el.nodeType == 1 && el.hasAttribute("disabled")) {
                    return false;
                }
                el = el.parentNode;
            }
        }
        return true;
    } else {
        var p = this.getParent();
        if (p) return p.getIsEnabled();
        return true;
    }
};
BiComponent.addProperty("capture", BiAccessType.READ);
_p.setCapture = function (bCapture) {
    if (this._created) {
        var tlc = this.getTopLevelComponent();
        this._element.onlosecapture = BiComponent.__oninlineevent;
        this._capture = bCapture;
        if (bCapture) {
            if (BiBrowserCheck.ie) this._element.setCapture();
            if (tlc) tlc._eventManager.setCaptureComponent(this);
        } else {
            if (BiBrowserCheck.ie) this._element.releaseCapture();
            else if (tlc) tlc._eventManager.setCaptureComponent(null);
        }
    }
};
_p._addGlassPane = function () {
    var gp = this._captureGlassPane = new BiComponent;
    gp.setLocation(0, 0);
    gp.setRight(0);
    gp.setBottom(0);
    this.add(gp);
    return gp;
};
_p._showGlassPane = function () {
    var gp = this._captureGlassPane || this._addGlassPane();
    gp.setVisible(true);
    var cs = this._children;
    var max = 0;
    for (var i = 0; i < cs.length; i++) {
        if (cs[i] !== gp) {
            max = Math.max(max, cs[i].getZIndex());
        }
    }
    gp.setZIndex(max + 1);
};
_p._hideGlassPane = function () {
    if (this._captureGlassPane) {
        this._captureGlassPane.setVisible(false);
    }
};
_p.setAccessKey = function (sAccessKey) {
    this.setHtmlProperty("accessKey", sAccessKey);
};
_p.getAccessKey = function () {
    return this.getHtmlProperty("accessKey");
};
BiComponent.addProperty("contextMenu", BiAccessType.READ_WRITE);
BiComponent.addProperty("name", BiAccessType.READ);
_p.setName = function (sName) {
    this._name = sName;
    this._setNameOnNameRoot(sName);
};
BiComponent.addProperty("toolTip", BiAccessType.WRITE);
BiComponent.addProperty("toolTipText", BiAccessType.READ_WRITE);
_p.getToolTip = function () {
    if (this._toolTip != null) return this._toolTip;
    if (this._toolTipText != null) return BiToolTip.getTextToolTip(this._toolTipText);
    return null;
};
_p.setRightToLeft = function (b) {
    if (b == null) this.removeStyleProperty("direction");
    else if (b) this.setStyleProperty("direction", BiComponent.STYLE_RTL);
    else this.setStyleProperty("direction", BiComponent.STYLE_LTR);
};
_p.getRightToLeft = function () {
    var v = this.getStyleProperty("direction");
    if (v == null) {
        if (this._parent) return this._parent.getRightToLeft();
        else if (application.getWindow()) return application.getWindow().getRightToLeft();
    }
    return v == BiComponent.STYLE_RTL;
};
_p._forLabel = null;
BiComponent.addProperty("forLabel", BiAccessType.READ);
BiComponent.addProperty("created", BiAccessType.READ);
BiComponent._createEvent = new BiEvent("create");
_p._create = function (oDocument) {
    this._document = oDocument || document;
    var el = this._element = this._document.createElement(this._tagName);
    el._biComponent = this;
    this._setHtmlAttributes();
    this._setHtmlProperties();
    this._setCssProperties();
    if (BiBrowserCheck.ie) {
        el.onscroll = BiComponent.__oninlineevent;
    } else {
        el.onscroll = el.onfocus = BiComponent.__oninlineevent;
    }
};
_p._createChildren = function () {
    var cs = this._children;
    var l = cs.length;
    for (var i = 0; i < l; i++) {
        cs[i]._addHtmlElementToParent(this, null);
    }
};
_p._setCssProperties = function () {
    var es = this._element.style;
    var sp = this._style;
    for (var p in sp) {
        es[p] = sp[p];
    }
};
_p._setHtmlProperties = function () {
    var el = this._element;
    var hp = this._htmlProperties;
    for (var p in hp) {
        el[p] = hp[p];
        this._setElementPropertyHack(p, hp[p]);
    }
};
_p._setHtmlAttributes = function () {
    var el = this._element;
    var ha = this._htmlAttributes;
    for (var n in ha) el.setAttribute(n, ha[n]);
};
_p._addHtmlElementToParent = function (oParent, oBefore) {
    if (this._lazyCreate && !this._created && !this.getVisible()) return;
    var createNow = !this._created;
    if (createNow) this._create(oParent._document);
    var beforeElement = oBefore ? oBefore._element : null;
    while (beforeElement && beforeElement.parentNode != oParent._element) beforeElement = beforeElement.parentNode;
    this._created = true;
    if (beforeElement) oParent._element.insertBefore(this._element, beforeElement);
    else oParent._element.appendChild(this._element);
    this._createChildren();
    this.invalidateParentLayout();
    if (oParent.getHtmlProperty("disabled") && !this.getHtmlProperty("disabled")) {
        this._setEnabled(false);
    }
    if (createNow) this.dispatchEvent(BiComponent._createEvent);
};
_p._removeHtmlElement = function (oChild) {
    oChild._removeHtmlElementFromParent(this);
};
_p._removeHtmlElementFromParent = function (oParent) {
    if (this._created && (oParent && oParent._created && oParent._element) && !(application && application._disposed)) {
        if (this.getEnabled() && this.getHtmlProperty("disabled")) {
            this._setEnabled(true);
        }
        oParent._element.removeChild(this._element);
    }
};
_p._oninlineevent = function (e) {
    if (this._disposed) return;
    if (!e) e = this._document.parentWindow.event;
    var tlc;
    switch (e.type) {
    case "losecapture":
        this._capture = false;
        tlc = this.getTopLevelComponent();
        if (tlc) tlc._eventManager.setCaptureComponent(null);
        break;
    case "focus":
        tlc = this.getTopLevelComponent();
        if (this.getCanFocus() && tlc) tlc._eventManager._mozOnFocus(e, this, this._element);
        return;
    case "propertychange":
        if (e.propertyName == "onpropertychange") return;
        break;
    }
    this.dispatchEvent(new BiEvent(e.type));
    application.flushLayoutQueue();
};
_p.setBackgroundFiller = function (oBackgroundFiller) {
    if (this._backgroundFiller) this._backgroundFiller.dispose();
    this._backgroundFiller = oBackgroundFiller;
    if (oBackgroundFiller) this._backgroundFiller.apply(this);
};
_p.makeThemeAware = function () {
    if (this._themeAware) return;
    this._themeAware = true;
    var tm = application.getThemeManager();
    tm.addEventListener("themechanged", this.onThemeChanged, this);
    if (this._created) {
        application.getThemeManager().applyTheme(this);
    } else {
        this.addEventListener("create", this.onThemeChanged, this);
    }
};
_p.onThemeChanged = function (e) {
    application.getThemeManager().applyTheme(this);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiEventTarget.prototype.dispose.call(this);
    this.setCommand(null);
    if (this._parent) {
        try {
            this._parent.remove(this);
        } catch (e) {}
        delete this._parent;
    }
    this.disposeFields("_children");
    if (this._themeAware) {
        var tm = application.getThemeManager();
        tm.removeEventListener("themechanged", this.onThemeChanged, this);
    }
    var el = this._element;
    if (el) {
        el.onscroll = el.onfocus = el.onlosecapture = null;
        el._biComponent = null;
        if (BiBrowserCheck.ie) {
            el.removeAttribute("_biComponent");
        }
        el = null;
    }
    this.disposeFields("_backgroundFiller", "_border", "__oninlineevent", "_document", "_style", "_htmlProperties", "_htmlAttributes", "_created", "_element", "_accessibilityLink", "_cssClassName", "_captureGlassPane");
};
_p.addParsedObject = function (o) {
    if (o instanceof BiComponent) this.add(o);
    else BiEventTarget.prototype.addParsedObject.call(this, o);
};
_p.setAttribute = function (sName, sValue, oParser) {
    var i, parts;
    switch (sName) {
    case "size":
        {
            parts = sValue.split(",");
            if (parts.length != 2) {
                throw new Error("Need attributes: <width>,<height>");
            }
            for (i = 0; i < parts.length; i++) {
                if (isNaN(parts[i] = parseInt(parts[i]))) {
                    throw new Error("Check attributes format [Expecting Number] !");
                }
            }
            this.setSize(parts[0], parts[1]);
            break;
        }
    case "location":
        {
            parts = sValue.split(",");
            if (parts.length != 2) {
                throw new Error("Need attributes: <left>,<top>");
            }
            for (i = 0; i < parts.length; i++) {
                if (isNaN(parts[i] = parseInt(parts[i]))) {
                    throw new Error("Check attributes format [Expecting Number] !");
                }
            }
            this.setLocation(parts[0], parts[1]);
            break;
        }
    case "bounds":
        {
            parts = sValue.split(",");
            if (parts.length != 4) {
                throw new Error("Need attributes: <left>,<top>,<width>,<height>");
            }
            for (i = 0; i < parts.length; i++) {
                if (isNaN(parts[i] = parseInt(parts[i]))) {
                    throw new Error("Check attributes format [Expecting Number] !");
                }
            }
            this.setBounds(parts[0], parts[1], parts[2], parts[3]);
            break;
        }
    case "border":
        if (sValue.charAt(0) == "#") {
            sValue = sValue.substr(1);
            var b = oParser.getComponentById(sValue);
            this.setBorder(b);
        } else this.setBorder(BiBorder.fromString(sValue));
        break;
    case "contextMenu":
    case "toolTip":
    case "command":
        if (sValue.charAt(0) == "#") sValue = sValue.substr(1);
        var ref = oParser.getComponentById(sValue);
        this.setProperty(sName, ref);
        break;
    case "margin":
        parts = sValue.split(/\s+/).map(parseFloat);
        this.setMargin.apply(this, parts);
        break;
    case "animation":
        if (sValue.charAt(0) == "#") {
            var a = sValue.split(",");
            for (i = 0; i < a.length; i++) {
                var anim = oParser.getComponentById(a[i].substr(1));
                this.setAnimation(anim);
            }
        } else throw new Error("The value must start with '#' and be followed by an ID.");
        break;
    default:
        BiEventTarget.prototype.setAttribute.apply(this, arguments);
    }
};
_p.setAnimation = function (oAnimation) {
    oAnimation.addComponent(this);
};
_p._command = null;
BiComponent.addProperty("command", BiAccessType.READ);
_p.setCommand = function (oCommand) {
    if (this._command != oCommand) {
        if (this._command) {
            this._command.removeEventListener("enabledchanged", this._syncWithCommand, this);
            this._command.removeEventListener("checkedchanged", this._syncWithCommand, this);
            this._command.removeEventListener("uservaluechanged", this._syncWithCommand, this);
            this._command.removeEventListener("shortcutchanged", this._syncWithCommand, this);
        }
        this._command = oCommand;
        if (this._command) {
            this._syncWithCommand();
            this._command.addEventListener("enabledchanged", this._syncWithCommand, this);
            this._command.addEventListener("checkedchanged", this._syncWithCommand, this);
            this._command.addEventListener("uservaluechanged", this._syncWithCommand, this);
            this._command.addEventListener("shortcutchanged", this._syncWithCommand, this);
        }
    }
    this._updateAccessibilityLink();
};
_p._syncWithCommand = function () {
    if (this._command) {
        this.setEnabled(this._command.getEnabled());
    }
};
_p.setDropDataTypes = function (aDataTypes) {
    this._dropDataTypes = aDataTypes;
};
_p.getDropDataTypes = function () {
    return this._dropDataTypes || [];
};
_p._traverseToMenuHandler = function () {
    var p = this;
    while (p && !p.setMenuBar) p = p._parent;
    return p;
};
_p._setMenuBarOnWindow = function (o) {
    var p = this._traverseToMenuHandler();
    if (p) {
        p.setMenuBar(o);
        return true;
    }
    return false;
};
_p._unsetMenuBarOnWindow = function (o) {
    var p = this._traverseToMenuHandler();
    if (p) {
        var mb = p.getMenuBar();
        if (mb == o) p.setMenuBar(null);
        return true;
    }
    return false;
};
_p._onCreateForMenuBar = function () {
    if (this._menuBar) {
        this._setMenuBarOnWindow(this._menuBar);
        delete this._menuBar;
    }
};
_p.setCssClassName = function (s) {
    this._cssClassName = s;
    this.setHtmlProperty("className", s + application.getThemeManager().getAppearanceTag(this));
};
_p.getCssClassName = function () {
    return this._cssClassName;
};
_p.setAppearance = function (sName) {
    this._appearance = sName;
    var tm = application.getThemeManager();
    tm.addAppearance(this);
};
_p.getAppearance = function () {
    return this._appearance;
};
_p.getAppearanceProperty = function (sPropertyName, defaultValue) {
    return application.getThemeManager().getDefaultTheme().getAppearanceProperty(this.getAppearance(), sPropertyName) || defaultValue;
};
BiComponent.invalidateAll = function () {
    var els;
    if (BiBrowserCheck.ie) els = document.all;
    else els = document.getElementsByTagName("*");
    var l = els.length;
    var cs = [];
    var i;
    for (i = 0; i < l; i++) {
        var el = els[i];
        if (el._biComponent && el._biComponent instanceof BiComponent && !el._biComponent.getDisposed()) {
            cs.push(el._biComponent);
        }
    }
    l = cs.length;
    for (i = 0; i < l; i++) {
        cs[i]._invalidLayout = true;
        cs[i]._invalidBoundaries = true;
        BiComponent.enqueueLayout(cs[i]);
    }
};
BiComponent.findComponentFor = function (oElement) {
    while (oElement && !oElement._biComponent) oElement = oElement.parentNode;
    return oElement ? oElement._biComponent : null;
};
BiComponent._getElementPositionInFrame = function (elt) {
    var p = {
        x: 0,
        y: 0
    };
    var doc = elt.ownerDocument || elt.document;
    if (BiBrowserCheck.features.hasGetBoundingClientRect) {
        var box = elt.getBoundingClientRect();
        p.x = box.left + (doc.scrollLeft || doc.body.scrollLeft);
        p.y = box.top + (doc.scrollTop || doc.body.scrollTop);
        p.x = Math.round(p.x);
        p.y = Math.round(p.y);
        if (BiBrowserCheck.ie && BiBrowserCheck.features.strictMode) {
            p.x -= doc.style.borderLeftWidth;
            p.y -= doc.style.borderTopWidth;
        }
    } else if (BiBrowserCheck.features.hasGetBoxObjectFor) {
        var box = doc.getBoxObjectFor(elt);
        p.x = box.x;
        p.y = box.y;
        var style = doc.defaultView.getComputedStyle(elt, BiString.EMPTY);
        p.x -= parseInt(style.borderLeftWidth);
        p.y -= parseInt(style.borderTopWidth);
        elt = elt.parentNode;
        while (elt.nodeType == 1) {
            p.x -= elt.scrollLeft;
            p.y -= elt.scrollTop;
            elt = elt.parentNode;
        }
    } else {
        p.x = elt.offsetLeft;
        p.y = elt.offsetTop;
        var node = elt.offsetParent;
        while (node) {
            p.x += node.offsetLeft + (node.clientLeft || 0);
            p.y += node.offsetTop + (node.clientTop || 0);
            node = node.offsetParent;
        }
        var body = doc.body || doc.getElementsByTagName("body")[0];
        elt = elt.parentNode || body;
        while (elt.nodeType == 1 && elt != body) {
            p.x -= elt.scrollLeft;
            p.y -= elt.scrollTop;
            elt = elt.parentNode;
        }
    }
    return p;
};
BiComponent._getElementScreenPosition = function (elt) {
    var doc = elt.ownerDocument || elt.document;
    var win = doc.defaultView || doc.parentWindow;
    var p = BiComponent._getElementPositionInFrame(elt);
    p.x += BiBrowserCheck.features.hasScreenLeftTop ? win.screenLeft : win.screenX;
    p.y += BiBrowserCheck.features.hasScreenLeftTop ? win.screenTop : win.screenY;
    var se = BiBrowserCheck.quirks.screenError;
    if (se) {
        p.x += se.x;
        p.y += se.y;
    }
    return p;
};

function BiSvgComponent() {
    if (_biInPrototype) return;
    BiComponent.call(this);
}
_p = _biExtend(BiSvgComponent, BiComponent, "BiSvgComponent");
_p._tagName = "svg";
_p._create = function (oDocument) {
    this._document = oDocument || document;
    var el = this._element = this._document.createElementNS("http://www.w3.org/2000/svg", this._tagName);
    el._biComponent = this;
    this._setHtmlAttributes();
    this._setHtmlProperties();
    this._setCssProperties();
    if (BiBrowserCheck.ie) {
        el.onscroll = BiComponent.__oninlineevent;
    } else {
        el.onscroll = el.onfocus = BiComponent.__oninlineevent;
    }
};
_p._setHtmlProperties = function () {
    var el = this._element;
    var hp = this._htmlProperties;
    for (var p in hp) {
        if (p.indexOf("xlink:") == 0) this._element.setAttributeNS("http://www.w3.org/1999/xlink", p.split(':')[1], hp[p]);
        else el.setAttribute(p, hp[p]);
    }
};
_p.setHtmlProperty = function (sProp, oValue) {
    this._htmlProperties[sProp] = oValue;
    if (this._created) {
        if (sProp.indexOf("xlink:") == 0) this._element.setAttributeNS("http://www.w3.org/1999/xlink", sProp.split(':')[1]);
        else this._element.setAttribute(sProp, oValue);
    }
};
_p.setViewBox = function (minX, minY, w, h) {
    this.setHtmlProperty("viewBox", "" + minX + " " + minY + " " + w + " " + h);
};
_p.calculateFlippedY = function (n) {
    return this._calcConstant - n;
};
_p.setLocation = function (left, top) {
    this.setHtmlProperty("x", left);
    this.setHtmlProperty("y", top);
};
_p.setLeft = function (left) {
    this.setHtmlProperty("x", left);
};
_p.setTop = function (top) {
    this.setHtmlProperty("y", top);
};
_p.setSize = function (w, h) {
    this.setWidth(w);
    this.setHeight(h);
};
_p.setWidth = function (w) {
    this._width = w;
    this.setHtmlProperty("width", w);
};
_p.setHeight = function (h) {
    this._height = h;
    this.setHtmlProperty("height", h);
};
_p.getWidth = function () {
    return this._width;
};
_p.getHeight = function (h) {
    return this._height;
};
_p.createSvgElement = function (name) {
    return this._document.createElementNS("http://www.w3.org/2000/svg", name);
};
BiSvgComponent.newSvgComponent = function (name) {
    var c = new BiSvgComponent;
    c._tagName = name || "svg";
    return c;
};

function BiInlineComponent(sId) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._inlineId = sId;
    this.setCssClassName("bi-inline-component");
}
_p = _biExtend(BiInlineComponent, BiComponent, "BiInlineComponent");
_p._create = function (oDocument) {
    this._document = oDocument || document;
    var el = this._element = this._document.getElementById(this._inlineId);
    if (!el) throw new Error("BiInlineComponent, could not find element in page");
    el._biComponent = this;
    this._setHtmlAttributes();
    this._setHtmlProperties();
    this._setCssProperties();
    if (BiBrowserCheck.ie) el.onscroll = el.onresize = BiComponent.__oninlineevent;
    else {
        el.onscroll = el.onfocus = BiComponent.__oninlineevent;
    }
};
_p._addHtmlElementToParent = function (oParent, oBefore, bLayout) {
    if (bLayout == null) bLayout = true;
    if (!this._created) this._create(oParent._document);
    this._created = true;
    this._createChildren();
    this.invalidateParentLayout();
    this.dispatchEvent(BiComponent._createEvent);
};
_p._removeHtmlElementFromParent = function (oParent) {};
BiInlineComponent.addProperty("inlineId", BiAccessType.READ_WRITE);
_p.layoutComponent = function () {
    BiComponent.prototype.layoutComponent.call(this);
    this.layoutAllChildren();
};

function BiApplicationWindow() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.removeHtmlProperty("className");
    this.removeHtmlProperty("id");
    this.setRightToLeft(false);
    this._shownDialogs = [];
    this._commands = {};
    this._eventManager = new BiEventManager;
    this._glassPane = new BiComponent;
    this._glassPane.setCssClassName("bi-glass-pane");
    this._glassPane.setLocation(0, 0);
    this._glassPane.setRight(0);
    this._glassPane.setBottom(0);
    this.addEventListener("keydown", this._ondefaultbuttonkeydown);
    this.addEventListener("keydown", this._onkeyevent);
    this.addEventListener("keypress", this._onkeyevent);
    this.addEventListener("keyup", this._onkeyup);
    if (BiBrowserCheck.moz) {
        this._canSelect = true;
    }
    this.setOverflow("hidden");
};
_p = _biExtend(BiApplicationWindow, BiComponent, "BiApplicationWindow");
_p._diff = null;
_p._insets = null;
_p._insetLeft = 4;
_p._insetRight = 4;
_p._insetTop = 30;
_p._insetBottom = 4;
_p._lastActive = null;
_p._activeComponent = null;
_p._globalCursor = null;
_p.setScrollTop = BiAccessType.FUNCTION_EMPTY;
_p.setScrollLeft = BiAccessType.FUNCTION_EMPTY;
BiApplicationWindow.addProperty("menuBar", BiAccessType.READ_WRITE);
_p.addMenuBar = function (oMenuBar, oBefore) {
    if (this._menuBar) this.remove(this._menuBar);
    this.setMenuBar(oMenuBar);
    if (this._menuBar) this._superAdd(this._menuBar, oBefore);
};
_p.add = function (oMenuBar, oBefore) {
    if (oMenuBar instanceof BiMenuBar) this.addMenuBar(oMenuBar, oBefore);
    else this._superAdd(oMenuBar, oBefore);
};
_p._superAdd = function (oComponent, oBefore) {
    BiComponent.prototype.add.call(this, oComponent, oBefore);
};
_p._moveTo = function (nLeft, nTop) {
    if (BiBrowserCheck.windowMoveToOffsetsY) nTop -= 22;
    try {
        this._window.moveTo(nLeft, nTop);
    } catch (ex) {}
};
_p._moveBy = function (x, y) {
    try {
        this._window.moveBy(x, y);
    } catch (ex) {}
};
_p._resizeTo = function (nWidth, nHeight) {
    try {
        this._window.resizeTo(nWidth, nHeight);
    } catch (ex) {}
};
_p._resizeBy = function (x, y) {
    try {
        this._window.resizeBy(x, y);
    } catch (ex) {}
};
_p.setLeft = function (nLeft) {
    this._moveTo(nLeft, this.getTop());
};
_p.setRight = function (nRight) {
    this.setLeft(this._window.screen.width - this.getWidth() - nRight);
};
_p.getScreenLeft = _p.getLeft = function () {
    if (BiBrowserCheck.ie) return this._window.screenLeft - this._getInsets().left;
    else return this._window.screenX;
};
_p.getRight = function () {
    return this._window.screen.width - this.getLeft() - this.getWidth();
};
_p.setTop = function (nTop) {
    this._moveTo(this.getLeft(), nTop);
};
_p.setBottom = function (nBottom) {
    this.setTop(this._window.screen.height - this.getHeight() - nBottom);
};
_p.setLocation = function (nLeft, nTop) {
    this._moveTo(nLeft, nTop);
};
_p.getScreenTop = _p.getTop = function () {
    if (BiBrowserCheck.ie) return this._window.screenTop - this._getInsets().top;
    else return this._window.screenY;
};
_p.getBottom = function () {
    return this._window.screen.height - this.getTop() - this.getHeight();
};
_p.setWidth = function (nWidth) {
    if (BiBrowserCheck.ie) this._resizeTo(nWidth, this.getHeight());
    else this._window.outerWidth = nWidth;
};
_p.getWidth = function () {
    if (BiBrowserCheck.ie) return this._getSize().width;
    else return this._window.outerWidth;
};
_p.setHeight = function (nHeight) {
    if (BiBrowserCheck.ie) this._resizeTo(this.getWidth(), nHeight);
    else this._window.outerHeight = nHeight;
};
_p.setSize = function (nWidth, nHeight) {
    this._resizeTo(nWidth, nHeight);
};
_p.getHeight = function () {
    if (BiBrowserCheck.ie) return this._getSize().height;
    else return this._window.outerHeight;
};
_p.getInsetLeft = function () {
    return this._getInsets().left + BiComponent.prototype.getInsetLeft.call(this);
};
_p.getInsetRight = function () {
    return this.getWidth() - this.getInsetLeft() - this.getClientWidth();
};
_p.getInsetTop = function () {
    return this._getInsets().top + BiComponent.prototype.getInsetTop.call(this);
};
_p.getInsetBottom = function () {
    return this.getHeight() - this.getInsetTop() - this.getClientHeight();
};
_p.getClientLeft = function () {
    return -this.getInsetLeft();
};
_p.getClientTop = function () {
    return -this.getInsetTop();
};
_p.setZIndex = _p.getZIndex = _p.setVisible = _p.getVisible = function () {
    throw new Error("Not supported");
};
_p.getTopLevelComponent = function () {
    return this;
};
_p.getIsVisible = function () {
    return true;
};
_p.getCaption = function () {
    return this._window.document.title;
};
_p.setCaption = function (sTitle) {
    this._window.document.title = sTitle;
};
_p.getFullScreen = function () {
    throw new Error("Not yet implemented");
};
_p.getResizable = function () {
    throw new Error("Not yet implemented");
};
_p.close = function () {
    this._window.close();
};
_p.print = function () {
    this._window.print();
};
_p.isFocusRoot = function () {
    return true;
};
_p.getFocusRoot = function () {
    return this;
};
_p.getActiveComponent = function () {
    if (this._activeComponent && this._activeComponent.getDisposed()) this._activeComponent = null;
    return this._activeComponent;
};
BiApplicationWindow.addProperty("acceptButton", BiAccessType.READ_WRITE);
BiApplicationWindow.addProperty("cancelButton", BiAccessType.READ_WRITE);
_p.addCommand = function (c) {
    if (c.getOwnerWindow()) c.getOwnerWindow().removeCommand(c);
    this._commands[c.toHashCode()] = c;
    c._ownerWindow = this;
};
_p.removeCommand = function (c) {
    if (c._ownerWindow != this) throw new Error("Can only remove owned commands");
    delete this._commands[c.toHashCode()];
    c._ownerWindow = null;
};
_p.remove = function (c) {
    if (c instanceof BiDialog && c.getIsVisible()) c.setVisible(false);
    if (c == this._menuBar) delete this._menuBar;
    BiComponent.prototype.remove.call(this, c);
};
_p.updateGlassPane = function (oDialog, bVisible) {
    this._shownDialogs.remove(oDialog);
    if (bVisible) {
        this.add(this._glassPane, oDialog);
        this._glassPane.setZIndex(oDialog.getZIndex());
        if (BiBrowserCheck.moz) {
            oDialog.setZIndex(oDialog.getZIndex() + 1);
        }
        this._shownDialogs.push(oDialog);
    } else {
        if (this._shownDialogs.length == 0) {
            this.remove(this._glassPane);
            var c = this.getActiveComponent();
            if (c && c.getCanFocus()) {
                c.setFocused(true);
            }
        } else {
            var d = this._shownDialogs[this._shownDialogs.length - 1];
            this._glassPane.setZIndex(d.getZIndex());
            d.setActive(true);
        }
    }
};
_p.setGlassPaneVisible = function (b) {
    var gp = this._glassPane;
    if (b) {
        this.add(gp);
        var cs = this._children;
        var max = 0;
        for (var i = 0; i < cs.length; i++) {
            max = Math.max(max, cs[i].getZIndex());
        }
        gp.setZIndex(max + 1);
        gp.setTabIndex(1);
        gp.setHideFocus(true);
        gp.getFocusRoot = function () {
            return this;
        };
        gp.isFocusRoot = function () {
            return true;
        };
        gp.setFocused(true);
    } else {
        if (this._shownDialogs.length == 0) {
            if (gp._parent == this) {
                this.remove(gp);
                gp.setZIndex(0);
                gp.setTabIndex(-1);
                gp.getFocusRoot = function () {
                    return this._parent;
                };
                gp.isFocusRoot = function () {
                    return false;
                };
                var c = this.getActiveComponent();
                if (c && c.getCanFocus()) {
                    c.setFocused(true);
                }
            }
        }
    }
};
_p.getGlassPaneVisible = function () {
    return this._glassPane.getVisible();
};
BiApplicationWindow.addProperty("globalCursor", BiAccessType.READ);
_p.setGlobalCursor = function (sCursor) {
    this._globalCursor = sCursor;
    var tm = application.getThemeManager();
    if (sCursor == null || sCursor == "") {
        tm.removeCssRule("*");
        tm.removeCssRule("");
    } else {
        tm.addCssRule("*", "cursor:" + sCursor + " !important");
    }
};
_p.getAllowBrowserContextMenu = function () {
    return this._eventManager.getAllowBrowserContextMenu();
};
_p.setAllowBrowserContextMenu = function (b) {
    return this._eventManager.setAllowBrowserContextMenu(b);
};
_p.getPreferredWidth = function () {
    if (this._preferredWidth != null) return this._preferredWidth;
    return this._computePreferredWidth();
};
_p.getPreferredHeight = function () {
    if (this._preferredHeight != null) return this._preferredHeight;
    return this._computePreferredHeight();
};
_p._create = function (oWindow) {
    this._window = oWindow || window;
    this._document = this._window.document;
    var el = this._element = this._document.body;
    el._biComponent = this;
    this._window._biComponent = this;
    this._document.documentElement._biComponent = this;
    this._eventManager.attachToWindow(this._window);
    this._setHtmlAttributes();
    this._setHtmlProperties();
    this._setCssProperties();
    if (BiBrowserCheck.ie) el.onscroll = BiComponent.__oninlineevent;
    else {
        el.onscroll = el.onfocus = BiComponent.__oninlineevent;
    }
    this._created = true;
    this._createChildren();
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiComponent.prototype.dispose.call(this);
    if (this._cursorStyleEl) {
        this._cursorStyleEl.disabled = true;
        this._cursorStyleEl.cssText = "";
        delete this._cursorStyleEl;
    }
    this._eventManager.dispose();
    delete this._eventManager;
    for (var i = this._shownDialogs.length - 1; i >= 0; i--) this._shownDialogs[i] = null;
    delete this._shownDialogs;
    for (var c in this._commands) delete this._commands[c];
    delete this._commands;
    this._window.document.documentElement._biComponent = null;
    this._window._biComponent = null;
    delete this._window;
    this._glassPane.dispose();
    delete this._glassPane;
};
_p._invalidBoundaries = false;
_p._onresize = function (e) {
    var b = this._window.document.body;
    var newW = b.offsetWidth;
    var newH = b.offsetHeight;
    if (this._lastResizeW != newW || this._lastResizeH != newH) {
        this._lastResizeW = newW;
        this._lastResizeH = newH;
        (new BiPopupManager).hideAutoHiding();
        this.invalidateLayout();
        this.dispatchEvent("resize");
    }
};
_p._onkeyup = function (e) {
    if (this._menuBar && e.matchesBundleShortcut("window.menu")) this._menuBar.toggleFocus();
};
_p._onkeyevent = function (e) {
    application.getFocusManager().processKeyEvent(this, e);
    if (e.getType() == (BiBrowserCheck.moz ? "keypress" : "keydown")) {
        var keyCode = e.getKeyCode();
        var key = String.fromCharCode(keyCode);
        if (e.matchesBundleModifiers("menu.accesskey") && this._showMenuByMnemonic(key)) {
            if (!BiBrowserCheck.ie) e.preventDefault();
        }
    }
};
_p._showMenuByMnemonic = function (sKey) {
    return this._menuBar && this._menuBar.showMenuByMnemonic(sKey);
};
_p._ondefaultbuttonkeydown = function (e) {
    var c;
    for (var hc in this._commands) {
        c = this._commands[hc];
        if (c.getEnabled() && c.matchesKeyboardEvent(e)) {
            if (!c.execute()) e.preventDefault();
        }
    }
    var t = e.getTarget();
    if (this._acceptButton && this._acceptButton.getEnabled() && !t.getAcceptsEnter() && e.matchesBundleShortcut("controls.accept")) {
        this._acceptButton.dispatchEvent("action");
        if (this._acceptButton.getCommand()) {
            this._acceptButton.getCommand().execute();
        }
    } else if (this._cancelButton && this._cancelButton.getEnabled() && !t.getAcceptsEsc() && e.matchesBundleShortcut("controls.cancel")) {
        this._cancelButton.dispatchEvent("action");
        if (this._cancelButton.getCommand()) {
            this._cancelButton.getCommand().execute();
        }
    }
};
_p._getSize = function () {
    var oldInnerSize = this._getInnerSize();
    if (this._diff == null) this._diff = {
        width: Number(this._insetLeft) + Number(this._insetRight),
        height: Number(this._insetTop) + Number(this._insetBottom)
    };
    this._resizeTo(oldInnerSize.width + this._diff.width, oldInnerSize.height + this._diff.height);
    var newInnerSize = this._getInnerSize();
    var diff = {
        width: oldInnerSize.width - newInnerSize.width + this._diff.width,
        height: oldInnerSize.height - newInnerSize.height + this._diff.height
    };
    this._resizeTo(oldInnerSize.width + diff.width, oldInnerSize.height + diff.height);
    this._diff = diff;
    return {
        width: oldInnerSize.width + diff.width,
        height: oldInnerSize.height + diff.height
    };
};
_p._getInnerSize = function () {
    return {
        width: this.getClientWidth(),
        height: this.getClientHeight()
    };
};
_p._getInsets = function () {
    if (BiBrowserCheck.ie) {
        if (this._insets) return this._insets;
        var oldScreenLeft = this._window.screenLeft;
        var oldScreenTop = this._window.screenTop;
        if (this._insets == null) this._insets = {
            left: Number(this._insetLeft),
            top: Number(this._insetTop)
        };
        this._moveTo(oldScreenLeft - this._insets.left, oldScreenTop - this._insets.top);
        var newScreenLeft = this._window.screenLeft;
        var newScreenTop = this._window.screenTop;
        var res = {
            left: newScreenLeft - oldScreenLeft + this._insets.left,
            top: newScreenTop - oldScreenTop + this._insets.top
        };
        this._moveTo(oldScreenLeft - res.left, oldScreenTop - res.top);
        return this._insets = res;
    } else {
        var pos = BiComponent._getElementScreenPosition(this._document.documentElement);
        return {
            left: pos.x - this._window.screenX,
            top: pos.y - this._window.screenY
        };
    }
};

function BiFocusElementWrapper(el) {
    if (_biInPrototype) return;
    if (el._biComponent) {
        return el._biComponent;
    }
    this._element = el;
    this._document = el.ownerDocument || el.document;
}
_p = _biExtend(BiFocusElementWrapper, BiObject, "BiFocusElementWrapper");
_p.getTabIndex = function () {
    return Math.max(1, parseFloat(this._element.tabIndex));
};
_p.getAnonymous = function () {
    return false;
};
_p.getCanFocus = function () {
    return this.getIsVisible() && this.getIsEnabled();
};
_p.getIsVisible = function () {
    if (!this.getVisible()) return false;
    var el = this._element;
    if (el.offsetHeight == 0 || el.offsetWidth == 0) {
        return false;
    }
    if (BiBrowserCheck.ie) {
        while (el.tagName != "BODY") {
            if (el.currentStyle.visibility == "inherit") {
                el = el.parentNode;
                continue;
            }
            return el.currentStyle.visibility == "visible";
        }
    } else {
        var dv = this._document.defaultView;
        while (el.tagName != "BODY") {
            if (dv.getComputedStyle(el, null).visibility == "inherit") {
                el = el.parentNode;
                continue;
            }
            return dv.getComputedStyle(el, null).visibility == "visible";
        }
    }
    return true;
};
_p.getVisible = function () {
    var s = BiBrowserCheck.ie ? this._element.currentStyle : this._document.defaultView.getComputedStyle(this._element, null);
    return s.visibility != "hidden" && s.display != "none";
};
_p.getIsEnabled = function () {
    if (BiBrowserCheck.ie) {
        return !this._element.isDisabled;
    } else {
        var el = this._element;
        while (el) {
            if (el.nodeType == 1 && el.hasAttribute("disabled")) {
                return false;
            }
            el = el.parentNode;
        }
    }
    return true;
};
_p.isFocusRoot = function () {
    return false;
};
_p.setFocused = function (b) {
    if (b) {
        this._element.focus();
    }
};
_p.getFocusRoot = function () {
    return this._document.body._biComponent;
};
_p._focusComponent = function () {};
_p._blurComponent = function () {
    this._element.blur();
};
_p.getFocused = function () {
    return false;
};
BiFocusElementWrapper._tags = {
    "A": true,
    "a": true,
    "INPUT": true,
    "input": true,
    "SELECT": true,
    "select": true,
    "TEXTAREA": true,
    "textarea": true,
    "BUTTON": true,
    "button": true,
    "IFRAME": true,
    "iframe": true,
    "OBJECT": true,
    "object": true,
    "BODY": true,
    "body": true
};
BiFocusElementWrapper.canFocus = function (el) {
    var c, ti;
    if ((c = el._biComponent)) {
        return !c.getAnonymous() && c.getTabIndex() > 0 && c.getCanFocus();
    }
    if (BiBrowserCheck.ie) {
        ti = el.tabIndex;
        if (ti < 0) {
            return false;
        } else if (ti > 0) {
            return true;
        } else {
            if (el.tagName in BiFocusElementWrapper._tags) {
                return ti >= 0;
            }
            var el2 = el.cloneNode(false);
            var s = el2.outerHTML;
            el2.removeAttribute("tabIndex");
            return s != el2.outerHTML;
        }
    } else if (BiBrowserCheck.quirks.brokenTabIndex) return el.tagName in BiFocusElementWrapper._tags;
    else return el.tabIndex >= 0;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this._element = null;
    this._document = null;
};

function BiFocusManager() {
    if (_biInPrototype) return;
    if (BiFocusManager._singleton) return BiFocusManager._singleton;
    BiObject.call(this);
    BiFocusManager._singleton = this;
}
_p = _biExtend(BiFocusManager, BiObject, "BiFocusManager");
_p.processKeyEvent = function (oContainer, e) {
    if (e.getDefaultPrevented()) return;
    if (e.getType() == (BiBrowserCheck.moz ? "keypress" : "keydown")) {
        var focusBack = e.matchesBundleShortcut("focus.previous");
        if (focusBack || e.matchesBundleShortcut("focus.next")) {
            var step = focusBack ? -1 : 1;
            e.preventDefault();
            e.stopPropagation();
            var ac = oContainer.getActiveComponent();
            var current = new BiFocusElementWrapper(e._event.target || e._event.srcElement);
            if (ac != null && ac !== current && current instanceof BiApplicationWindow) {
                current = ac;
            } else if (current._isMenu) {
                var currentMenuBar = new BiMenuManager().getCurrentMenuButton()._parent;
                currentMenuBar.toggleFocus();
                return;
            }
            var next = this._getNext(current, step);
            if (next) {
                if (current && current.getFocused()) {
                    current._blurComponent();
                    if (next instanceof BiFocusElementWrapper) {
                        current.setFocused(false);
                    }
                    if (typeof current._deselectOnTabBlur == "function") {
                        current._deselectOnTabBlur();
                    }
                }
                next.setFocused(true);
                if (!(next instanceof BiRichEdit)) next._focusComponent();
                if (typeof next._selectOnTabFocus == "function") next._selectOnTabFocus();
            }
        }
    }
};
_p.getFirst = function (oComponent) {
    var cs = this._getSortedDecendants(oComponent);
    return cs[cs.length - 1];
};
_p.getLast = function (oComponent) {
    return this._getSortedDecendants(oComponent)[0];
};
_p._getNext = function (current, direction) {
    while (current && !current.isFocusRoot() && current.getTabIndex() <= 0) current = current.getParent();
    var root = current ? current.getFocusRoot() : application.getWindow();
    var cs = this._getSortedDecendants(root, root);
    var l = cs.length;
    if (l) {
        var ci = cs.indexOf(current);
        if (ci == -1 && direction == -1) ci = 0;
        var next = cs[(ci + direction + l) % l];
        return next == current ? null : next;
    } else return null;
};
_p._getSortedDecendants = function (parent, root) {
    var cs = [];
    var elements = parent._element.all || parent._element.getElementsByTagName("*");
    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        var component = el._biComponent;
        if (!component) {
            while (el && !el._biComponent) el = el.parentNode;
            if (!el) component = new BiFocusElementWrapper(elements[i]);
        }
        if (!component || !component.getCanFocus() || (root && component.getFocusRoot() != root)) continue;
        var tabIndex = component.getTabIndex();
        if (tabIndex <= 0) continue;
        var j = cs.length;
        while (j > 0 && cs[j - 1].getTabIndex() > tabIndex) {
            cs[j] = cs[j - 1];
            j--;
        }
        cs[j] = component;
    }
    return cs;
};
_p.dispose = function () {
    BiObject.prototype.dispose.call(this);
    delete BiFocusManager._singleton;
};

function BiFont(nSize, sName) {
    if (_biInPrototype) return;
    BiObject.call(this);
    if (nSize != null) this._size = nSize;
    if (sName != null) this._name = sName;
}
_p = _biExtend(BiFont, BiObject, "BiFont");
BiFont.addProperty("size", BiAccessType.READ_WRITE);
BiFont.addProperty("bold", BiAccessType.READ_WRITE);
BiFont.addProperty("italic", BiAccessType.READ_WRITE);
BiFont.addProperty("underline", BiAccessType.READ_WRITE);
BiFont.addProperty("strikeout", BiAccessType.READ_WRITE);
BiFont.addProperty("name", BiAccessType.READ_WRITE);
_p.paintFont = function (oComponent) {
    if (this._name) oComponent.setStyleProperty("fontFamily", this._name);
    if (this._size != null) oComponent.setStyleProperty("fontSize", this._size + "px");
    if (this._bold != null) oComponent.setStyleProperty("fontWeight", this._bold ? "bold" : "normal");
    if (this._italic != null) oComponent.setStyleProperty("fontStyle", this._italic ? "italic" : "normal");
    var td = null;
    if (this._underline == false && this._strikeout == false) td = "none";
    else if (this._underline != null || this._strikeout != null) {
        td = (this._underline ? "underline" : "") + (this._strikeout ? " line-through" : "");
    }
    if (td != null) oComponent.setStyleProperty("textDecoration", td);
};
_p.removeFont = function (oComponent) {
    oComponent.removeStyleProperty("fontFamily");
    oComponent.removeStyleProperty("fontSize");
    oComponent.removeStyleProperty("fontWeight");
    oComponent.removeStyleProperty("fontStyle");
    oComponent.removeStyleProperty("textDecoration");
};
BiFont.fromString = function (s) {
    var f = new BiFont;
    var parts = s.split(/\s+/);
    var nameSb = [];
    var part;
    for (var i = 0; i < parts.length; i++) {
        part = parts[i];
        switch (part) {
        case "bold":
            f.setBold(true);
            break;
        case "italic":
            f.setItalic(true);
            break;
        case "underline":
            f.setUnderline(true);
            break;
        case "strikeout":
            f.setStrikeout(true);
            break;
        default:
            var n = parseFloat(part);
            if (n == part || part.indexOf("px") != -1) f.setSize(n);
            else nameSb.push(part);
            break;
        }
    }
    if (nameSb.length > 0) f.setName(nameSb.join(" "));
    return f;
};

function BiImagePreloaderManager() {
    if (_biInPrototype) return;
    if (BiImagePreloaderManager._singleton) return BiImagePreloaderManager._singleton;
    BiObject.call(this);
    this._imagePreloaders = {};
    BiImagePreloaderManager._singleton = this;
    application.addEventListener("dispose", this.dispose, this);
}
_p = _biExtend(BiImagePreloaderManager, BiObject, "BiImagePreloaderManager");
_p.getPreloader = function (oUri) {
    return this._imagePreloaders[String(oUri)];
};
_p.addPreloader = function (oImagePreloader) {
    this._imagePreloaders[String(oImagePreloader._uri)] = oImagePreloader;
};
_p.hasPreloader = function (oUri) {
    return String(oUri) in this._imagePreloaders;
};
_p.dispose = function () {
    if (this._disposed) return;
    application.removeEventListener("dispose", this.dispose, this);
    for (var uri in this._imagePreloaders) {
        this._imagePreloaders[uri].dispose();
        delete this._imagePreloaders[uri];
    }
    delete BiImagePreloaderManager._singleton;
    BiObject.prototype.dispose.call(this);
};

function BiImagePreloader(oUri) {
    if (_biInPrototype) return;
    var man = new BiImagePreloaderManager();
    var sUri = String(oUri);
    if (man.hasPreloader(sUri)) return man.getPreloader(sUri);
    BiEventTarget.call(this);
    this._uri = oUri;
    this._jsImage = new Image();
    if (this._uri) this._jsImage.src = sUri;
    this._createImageListeners();
    man.addPreloader(this);
}
_p = _biExtend(BiImagePreloader, BiEventTarget, "BiImagePreloader");
_p._loaded = false;
_p._createImageListeners = function () {
    var self = this;
    this._jsImage.onload = function () {
        self._onload();
    };
    this._jsImage.onerror = function () {
        self._onerror();
    };
};
_p.getWidth = function () {
    if (this._error) return 0;
    if (BiBrowserCheck.moz) return this._jsImage.naturalWidth;
    else return this._jsImage.width;
};
_p.getHeight = function () {
    if (this._error) return 0;
    if (BiBrowserCheck.moz) return this._jsImage.naturalHeight;
    else return this._jsImage.height;
};
_p.getLoaded = function () {
    if (BiBrowserCheck.ie) return this._jsImage.readyState == "complete";
    else return this._loaded;
};
_p._isPng = function () {
    return /\.png$/i.test(this._jsImage.nameProp);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiEventTarget.prototype.dispose.call(this);
    this._jsImage.onload = this._jsImage.onerror = null;
    this.disposeFields("_jsImage", "_uri", "_loaded", "_error");
};
_p._onload = function () {
    this._error = false;
    this._loaded = true;
    this.dispatchEvent("load");
    application.flushLayoutQueue();
};
_p._onerror = function () {
    this._error = true;
    this._loaded = false;
    this.dispatchEvent("error");
    application.flushLayoutQueue();
};

function BiImage(oUri, nWidth, nHeight) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setHtmlProperty("src", BiImage.BLANK_IMAGE_URI);
    this.setHtmlProperty("alt", "");
    this.setCanSelect(false);
    if (nWidth != null) this.setWidth(nWidth);
    if (nHeight != null) this.setHeight(nHeight);
    if (oUri) this.setUri(oUri);
}
_p = _biExtend(BiImage, BiComponent, "BiImage");
BiImage.BLANK_IMAGE_URI = application.getPath() + "images/blank.gif";
BiImage.fromUri = function (oUri) {
    return new BiImage(oUri);
};
_p._alt = null;
_p._uri = null;
_p._tagName = "IMG";
_p._width = null;
_p._height = null;
BiImage.addProperty("alt", BiAccessType.READ_WRITE);
_p.setUri = function (oUri) {
    if (oUri != null && !(oUri instanceof BiUri)) {
        oUri = new BiUri(application.getAdfPath(), oUri);
    }
    if (String(this._uri) != String(oUri)) {
        if (this._imagePreloader) {
            this._imagePreloader.removeEventListener("load", this._onload, this);
            this._imagePreloader.removeEventListener("error", this._onerror, this);
            this._imagePreloader = null;
        }
        this._uri = oUri;
        if (this._uri) {
            this._imagePreloader = new BiImagePreloader(this._uri);
            if (this._imagePreloader.getLoaded()) this._onload();
            else {
                this._imagePreloader.addEventListener("load", this._onload, this);
                this._imagePreloader.addEventListener("error", this._onerror, this);
            }
        }
    }
};
BiImage.addProperty("uri", BiAccessType.READ);
_p.getPreferredWidth = function () {
    if (this._imagePreloader) return this._imagePreloader.getWidth();
    throw new Error("No image file");
};
_p.getPreferredHeight = function () {
    if (this._imagePreloader) return this._imagePreloader.getHeight();
    throw new Error("No image file");
};
_p.getWidth = function () {
    if (this._width != null && (this._left == null || this._right == null)) {
        return this._width;
    } else {
        if (!this._element || this._element.style.width == "") return this.getPreferredWidth();
        return BiComponent.prototype.getWidth.call(this);
    }
};
_p.getHeight = function () {
    if (this._height != null && (this._top == null || this._bottom == null)) {
        return this._height;
    } else {
        if (!this._element || this._element.style.height == "") return this.getPreferredHeight();
        return BiComponent.prototype.getHeight.call(this);
    }
};
_p.getLoaded = function () {
    if (this._imagePreloader) return this._imagePreloader.getLoaded();
    throw new Error("No image file");
};
_p.dispose = function () {
    if (this._disposed) return;
    if (this._imagePreloader) {
        this._imagePreloader.removeEventListener("load", this._onload, this);
        this._imagePreloader.removeEventListener("error", this._onerror, this);
    }
    this._imagePreloader = null;
    if (this._element) this._element.style.filter = "";
    BiComponent.prototype.dispose.call(this);
};
_p._create = function (oDocument) {
    BiComponent.prototype._create.call(this, oDocument);
    this._element.removeAttribute("width");
    this._element.removeAttribute("height");
};
_p._recreate = function () {
    if (!this._created || this._disposed) return;
    var el = this._element;
    if (!el || !el.parentNode) return;
    if (el) {
        el.onscroll = el.onfocus = el.onlosecapture = null;
        el._biComponent = null;
        el.style.filter = "";
        delete this._element;
    }
    this._create(this._document);
    if (el.parentNode) el.parentNode.replaceChild(this._element, el);
};
_p._onload = function () {
    this._invalidatePreferredOrActualSize();
    if (BiBrowserCheck.ie && BiBrowserCheck.versionNumber < 7) {
        if (this._isPng()) {
            this.setHtmlProperty("src", BiImage.BLANK_IMAGE_URI);
            if (this._width == null) this.setStyleProperty("width", this.getPreferredWidth() + "px");
            if (this._height == null) this.setStyleProperty("height", this.getPreferredHeight() + "px");
            var v = this._getIeFilter();
            var f;
            if (this._created && (f = this._element.filters["DXImageTransform.Microsoft.AlphaImageLoader"])) {
                f.src = String(this._uri);
                this._style.filter = v;
            } else {
                this.setStyleProperty("filter", v);
            }
        } else {
            this.setStyleProperty("filter", this._getIeFilter());
            this.setHtmlProperty("src", String(this._uri));
            if (this._width == "" || this._width == null) this.removeStyleProperty("width");
            if (this._height == "" || this._height == null) this.removeStyleProperty("height");
        }
    } else {
        this.setHtmlProperty("src", String(this._uri));
    }
    this.dispatchEvent("load");
};
_p._onerror = function () {
    this.dispatchEvent("error");
};
_p._isPng = function () {
    if (this._imagePreloader) return this._imagePreloader._isPng();
    return false;
};
_p._getIeFilter = function () {
    if (BiBrowserCheck.versionNumber < 7 && this._isPng()) {
        return "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this._uri + "',sizingMethod='scale')";
    }
    return BiComponent.prototype._getIeFilter.call(this);
};
_p.getIconHtml = function (bHasText, bEnabled, sIconPosition, nIconTextGap, sClassName) {
    if (typeof bHasText != "boolean") {
        throw new Error("BiImage getIconHtml has changed");
    }
    var w = this._width;
    if (w == null) w = this._preferredWidth;
    if (w == null) w = this._imagePreloader.getWidth();
    var h = this._height;
    if (h == null) h = this._preferredHeight;
    if (h == null) h = this._imagePreloader.getHeight();
    var marginSide, blockStyle = "";
    switch (sIconPosition) {
    case "right":
        if (!this.getRightToLeft()) marginSide = "left";
        else marginSide = "right";
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
        if (!this.getRightToLeft()) marginSide = "right";
        else marginSide = "left";
        break;
    }
    var iconTextGap = bHasText ? nIconTextGap : 0;
    if (BiBrowserCheck.ie) {
        var uri;
        var imgFilter, spanFilter;
        if (this._isPng()) {
            uri = BiImage.BLANK_IMAGE_URI;
            imgFilter = "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.getUri() + "',sizingMethod='scale');";
            spanFilter = bEnabled ? "" : "filter:gray() alpha(opacity=50);";
            return ["<span style=\"vertical-align:middle;", spanFilter, "width:", w + iconTextGap, "px;", blockStyle, (h ? "height:" + h + "px;" : ""), "\">", "<img alt=\"", this.getAlt(), "\" src=\"", uri, "\" style=\"", (w ? "width:" + w + "px;" : ""), (h ? "height:" + h + "px;" : ""), blockStyle, imgFilter, "margin-", marginSide, ":", iconTextGap, "px;\"", (sClassName ? " class=\"" + sClassName + "\"" : ""), "></span>"].join("");
        } else {
            uri = this.getUri();
            imgFilter = bEnabled ? "" : "filter:gray() alpha(opacity=50);";
        }
        return ["<img alt=\"", this.getAlt(), "\" src=\"", uri, "\" style=\"vertical-align:middle;", (w ? "width:" + w + "px;" : ""), (h ? "height:" + h + "px;" : ""), blockStyle, imgFilter, "margin-", marginSide, ":", iconTextGap, "px;\"", (sClassName ? " class=\"" + sClassName + "\"" : ""), ">"].join("");
    } else {
        var opacityFlag;
        if (BiBrowserCheck.moz) opacityFlag = "-moz-opacity:0.5;opacity:0.2;";
        else if (BiBrowserCheck.webkit) opacityFlag = "opacity:0.2;";
        else opacityFlag = "";
        var brBefore = sIconPosition == "bottom" && bHasText ? "<br>" : "";
        var brAfter = sIconPosition == "top" && bHasText ? "<br>" : "";
        return [brBefore, "<img alt=\"", this.getAlt(), "\" src=\"", this.getUri(), "\" style=\"vertical-align:middle;", (w ? "width:" + w + "px;" : ""), (h ? "height:" + h + "px;" : "") + (!bEnabled ? opacityFlag : ""), "margin-", marginSide, ":", iconTextGap, "px;\"", (sClassName ? " class=\"" + sClassName + "\"" : ""), ">", brAfter].join("");
    }
};
_p._removeHtmlElementFromParent = function (p) {
    if (BiBrowserCheck.ie && BiBrowserCheck.versionNumber < 7 && this._element) {
        this._element.style.filter = "";
    }
    BiComponent.prototype._removeHtmlElementFromParent.call(this, p);
};
_p._addHtmlElementToParent = function (oParent, oBefore) {
    if (BiBrowserCheck.ie && BiBrowserCheck.versionNumber < 7 && this._element && this._style.filter) {
        this._element.style.filter = this._style.filter;
    }
    BiComponent.prototype._addHtmlElementToParent.call(this, oParent, oBefore);
};

function BiLabel(sText) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    if (sText) this._text = String(sText);
    this.setCssClassName("bi-label");
    this.setCanSelect(false);
    this.setWrap(false);
    this.addEventListener("resize", this._onresize, this);
};
_p = _biExtend(BiLabel, BiComponent, "BiLabel");
_p._text = "";
_p._html = null;
_p._realHtml = null;
_p._realText = null;
_p._mnemonic = null;
_p._icon = null;
_p._drawIcon = false;
_p._iconPosition = "left";
_p._iconTextGap = 3;
_p._labelFor = null;
if (BiBrowserCheck.ie) {
    if (BiBrowserCheck.versionNumber < 7 && !application.getAccessibilityMode()) _p._tagName = "LABEL";
    else _p._tagName = "SPAN";
}
BiLabel.htmlToText = function (s) {
    return String(s).replace(/\s+|<([^>])+>|&amp;|&lt;|&gt;|&quot;|&nbsp;|&#[0-9]+;|&#x[0-9a-fA-F];]/gi, BiLabel._htmlToText);
};
BiLabel._htmlToText = function (s) {
    switch (s) {
    case "&amp;":
        return "&";
    case "&lt;":
        return "<";
    case "&gt;":
        return ">";
    case "&quot;":
        return "\"";
    case "&nbsp;":
        return String.fromCharCode(160);
    default:
        if (s.substring(0, 3) == "&#x") {
            return String.fromCharCode(parseInt("0x" + s.substring(3, s.length - 1)));
        }
        if (s.substring(0, 2) == "&#") {
            return String.fromCharCode(s.substring(2, s.length - 1));
        }
        if (/^\s+$/.test(s)) return " ";
        if (/^<BR/gi.test(s)) return "\n";
        return "";
    }
};
BiLabel.textToHtml = function (s) {
    return String(s).replace(/&|<|>|\n|\u00A0/g, BiLabel._textToHtml);
};
BiLabel._textToHtml = function (s) {
    switch (s) {
    case "&":
        return "&amp;";
    case "<":
        return "&lt;";
    case ">":
        return "&gt;";
    case "\n":
        return "<BR>";
    default:
        return "&nbsp;";
    }
};
BiLabel._textToHtml2 = function (s) {
    return String(s).replace(/&|<|>|\u00A0/g, BiLabel._textToHtml);
};
_p._onresize = function () {
    if (this._wrap) this.invalidateParentLayout("preferred");
};
_p.setText = function (sText) {
    this._text = String(sText);
    this._html = null;
    this._setHtml();
};
_p.getText = function () {
    if (this._text != null) return this._text;
    if (this._html != null) {
        return BiLabel.htmlToText(this._html);
    }
    return "";
};
_p.setHtml = function (sHtml) {
    this._html = String(sHtml);
    this._text = null;
    this._setHtml();
};
_p.getHtml = function () {
    if (this._html != null) return this._html;
    if (this._text != null) {
        return BiLabel.textToHtml(this._text);
    }
    return "";
};
_p._setHtml = function () {
    if (!this._created) return;
    var el = this._element;
    if (BiBrowserCheck.ie && this._html == null && !this._drawIcon && this._mnemonic == null) {
        if (this._realText == this._text) return;
        this._realHtml = null;
        this._realText = this._text;
        if (!this.hasChildren()) {
            if (BiBrowserCheck.features.hasInnerText) el.innerText = this._text;
            else if (BiBrowserCheck.features.hasTextContent) el.textContent = this._text;
        } else {
            while (el.firstChild != this.getFirstChild()._element) el.removeChild(el.firstChild);
            el.insertAdjacentText("AfterBegin", this._text);
        }
    } else {
        var iconBefore = this._iconPosition == "left" || this._iconPosition == "top";
        var sHtml = this._html != null ? this._html : (this._text != null ? BiLabel.textToHtml(this._text) : "");
        if (this._mnemonic) sHtml = BiLabel.addMnemonic(sHtml, this._mnemonic);
        var s = (iconBefore ? this._getIconHtml() : "") + sHtml + (!iconBefore ? this._getIconHtml() : "");
        if (this._realHtml == s) return;
        this._realHtml = s;
        this._realText = null;
        if (s == "") s = "&nbsp;";
        if (!this.hasChildren()) el.innerHTML = s;
        else {
            if (s == "&nbsp;") el.insertAdjacentHTML("AfterEnd", s);
            else {
                while (el.firstChild && el.firstChild != this.getFirstChild()._element) el.removeChild(el.firstChild);
                el.insertAdjacentHTML("AfterBegin", s);
            }
        } if (BiBrowserCheck.moz) {
            this._mozForceReflow();
        }
    }
    this._invalidatePreferredOrActualSize();
};
_p._mozForceReflow = function () {
    var el = this._element;
    var style = el.style;
    if (this._height != null || this._top != null && this._bottom != null) {
        return;
    }
    if (this._iconPosition == "top" || this._iconPosition == "bottom" || style.paddingLeft || style.paddingRight || style.paddingTop || style.paddingBottom || style.padding || style.textAlign) {
        var s = el.offsetHeight;
        var of = style.overflow;
        style.overflow = "visible";
        style.overflow = of;
    }
};
BiLabel.addMnemonic = function (sHtml, sMnemonic) {
    var s = sHtml,
        m = sMnemonic;
    if (!s || !m) return s;
    var re = new RegExp("^((?:(?:<(?:[^>]|" + m + ")+>)|(?:&(?:[^;]|" + m + ")+;)|[^&" + m + "])*)(" + m + ")", "i");
    if (re.test(s)) {
        return RegExp.$1 + "<span class=\"mnemonic\">" + RegExp.$2 + "</span>" + RegExp.rightContext;
    } else {
        var re2 = /(\.{3,}$)/;
        if (re2.test(s)) return s.substr(0, s.length - RegExp.$1.length) + "(<span class=\"mnemonic\">" + m + "</span>)" + RegExp.$1;
        else return s + "(<span class=\"mnemonic\">" + m + "</span>)";
    }
};
BiLabel.addProperty("mnemonic", BiAccessType.READ);
_p.setMnemonic = function (sMnemonic) {
    if (this._mnemonic != sMnemonic) {
        this._mnemonic = sMnemonic;
        this._setHtml();
    }
};
_p.setFont = function (oFont) {
    if (this._font) this._font.removeFont(this);
    this._font = oFont;
    if (oFont) oFont.paintFont(this);
    this._invalidatePreferredOrActualSize();
};
_p.getFont = function () {
    return this._font ? this._font : new BiFont;
};
BiLabel.addProperty("labelFor", BiAccessType.READ);
_p.setLabelFor = function (oComponent) {
    oComponent._forLabel = this;
    this._labelFor = oComponent;
    this.setHtmlProperty("htmlFor", oComponent == null ? "" : oComponent.getHtmlProperty("id"));
};
_p.setWrap = function (bWrap) {
    this._wrap = bWrap;
    this.setStyleProperty("whiteSpace", bWrap ? "normal" : "nowrap");
    this._invalidatePreferredOrActualSize();
};
_p.getWrap = function () {
    return this._wrap;
};
if (BiBrowserCheck.ie) {
    _p.setOverflowX = function (sOverflowX) {
        this.setStyleProperty("textOverflow", sOverflowX == "hidden" ? "ellipsis" : "clip");
        this.setStyleProperty("overflowX", sOverflowX);
    };
}
_p.setPadding = function (nLeft, nRight, nTop, nBottom) {
    if (arguments.length == 1) {
        nRight = nTop = nBottom = nLeft;
    } else if (arguments.length == 2) {
        nTop = nBottom = nRight;
        nRight = nLeft;
    }
    this.setStyleProperty("paddingLeft", nLeft + "px");
    this.setStyleProperty("paddingRight", nRight + "px");
    this.setStyleProperty("paddingTop", nTop + "px");
    this.setStyleProperty("paddingBottom", nBottom + "px");
    this._invalidatePreferredOrActualSize();
    this.invalidateLayout();
};
_p.setPaddingLeft = function (n) {
    this._setPadding("paddingLeft", n);
};
_p.getPaddingLeft = function () {
    return parseInt(this.getStyleProperty("paddingLeft"));
};
_p.setPaddingRight = function (n) {
    this._setPadding("paddingRight", n);
};
_p.getPaddingRight = function () {
    return parseInt(this.getStyleProperty("paddingRight"));
};
_p.setPaddingTop = function (n) {
    this._setPadding("paddingTop", n);
};
_p.getPaddingTop = function () {
    return parseInt(this.getStyleProperty("paddingTop"));
};
_p.setPaddingBottom = function (n) {
    this._setPadding("paddingBottom", n);
};
_p.getPaddingBottom = function () {
    return parseInt(this.getStyleProperty("paddingBottom"));
};
_p._setPadding = function (s, n) {
    this.setStyleProperty(s, n + "px");
    this._invalidatePreferredOrActualSize();
    this.invalidateLayout();
};
_p.setAlign = function (sAlign) {
    if (sAlign) this.setStyleProperty("textAlign", sAlign);
    else this.removeStyleProperty("textAlign");
};
_p.getAlign = function () {
    return this.getStyleProperty("textAlign");
};
_p._computePreferredWidth = function () {
    if (BiBrowserCheck.ie && this._measuredHeight == 0) {
        var old = this._element.runtimeStyle.display;
        this._element.runtimeStyle.display = "";
    }
    var el = this._element;
    var style = el.runtimeStyle || el.style;
    var w = style.width;
    var h = style.height;
    style.width = "auto";
    style.height = "auto";
    var max = 0;
    if (BiBrowserCheck.ie && (this.getIsVisible() || this.getParent() instanceof BiToolBarButton)) {
        var r = this._document.body.createTextRange();
        r.moveToElementText(this._element);
        var bcr = r.getBoundingClientRect();
        max = Math.max(0, bcr.right - bcr.left + this.getPaddingLeft() + this.getPaddingRight());
    } else {
        if (BiBrowserCheck.moz && BiBrowserCheck.version > 17) max = el.clientWidth;
        else max = el.scrollWidth;
    }
    var cs = this._children;
    var l = cs.length;
    for (var i = 0; i < l; i++) {
        if (cs[i].getVisible()) max = Math.max(max, cs[i].getLeft() + cs[i].getWidth());
    }
    style.width = w;
    style.height = h;
    var rv = this.getInsetLeft() + max + this.getInsetRight();
    if (BiBrowserCheck.ie && this._measuredHeight == 0) {
        this._element.runtimeStyle.display = old;
    }
    return rv;
};
_p._computePreferredHeight = function () {
    BiComponent.flushLayoutQueue();
    if (BiBrowserCheck.ie && this._measuredHeight == 0) {
        var old = this._element.runtimeStyle.display;
        this._element.runtimeStyle.display = "";
    }
    var el = this._element;
    var style = el.runtimeStyle || el.style;
    var w = style.width;
    var h = style.height;
    style.width = "auto";
    style.height = "auto";
    var max;
    if (BiBrowserCheck.ie && this.getIsVisible()) {
        var r = this._document.body.createTextRange();
        r.moveToElementText(this._element);
        var bcr = r.getBoundingClientRect();
        max = Math.max(0, bcr.bottom - bcr.top + this.getPaddingTop() + this.getPaddingBottom());
    } else {
        if (BiBrowserCheck.moz && BiBrowserCheck.version > 17) max = el.clientHeight;
        else max = el.scrollHeight
    }
    var cs = this._children;
    var l = cs.length;
    for (var i = 0; i < l; i++) {
        if (cs[i].getVisible()) max = Math.max(max, cs[i].getTop() + cs[i].getHeight());
    }
    style.width = w;
    style.height = h;
    var rv = this.getInsetTop() + max + this.getInsetBottom();
    if (BiBrowserCheck.ie && this._measuredHeight == 0) {
        this._element.runtimeStyle.display = old;
    }
    return rv;
};
BiLabel.addProperty("icon", BiAccessType.READ);
_p.setIcon = function (oImage) {
    if (this._icon != oImage) {
        if (this._icon instanceof BiEventTarget) {
            this._icon.removeEventListener("load", this._oniconload, this);
        }
        this._icon = oImage;
        this._drawIcon = oImage != null;
        this._setHtml();
        if (this._icon instanceof BiImage) {
            if (this._icon.getLoaded()) this._oniconload();
            else this._icon.addEventListener("load", this._oniconload, this);
        }
    }
};
BiLabel.addProperty("iconPosition", BiAccessType.READ);
_p.setIconPosition = function (s) {
    if (this._iconPosition != s) {
        this._iconPosition = s;
        this._setHtml();
    }
};
BiLabel.addProperty("iconTextGap", BiAccessType.READ);
_p.setIconTextGap = function (n) {
    if (this._iconTextGap != n) {
        this._iconTextGap = n;
        this._setHtml();
    }
};
_p._setEnabled = function (bEnabled) {
    BiComponent.prototype._setEnabled.call(this, bEnabled);
    this._setHtml();
};
_p._getIconHtml = function () {
    if (!this._icon) return "";
    else return this._icon.getIconHtml(!(this._html == "" || this._text == ""), this.getIsEnabled(), this._iconPosition, this._iconTextGap);
};
_p._createChildren = function () {
    this._setHtml();
    BiComponent.prototype._createChildren.call(this);
};
_p.dispose = function () {
    if (this._disposed) return;
    if (this._icon instanceof BiEventTarget) {
        this._icon.removeEventListener("load", this._oniconload, this);
    }
    BiComponent.prototype.dispose.call(this);
    this.disposeFields("_icon", "_text", "_html", "_realHtml", "_realText", "_mnemonic", "_drawIcon", "_iconPosition", "_iconTextGap");
    delete this._labelFor;
};
_p._oniconload = function () {
    this._setHtml();
    this.invalidateParentLayout();
};
_p.addXmlNode = function (oNode, oXmlResourceParser) {
    var s;
    if (oNode.nodeType == 3) {
        s = oNode.nodeValue;
        if (oNode.parentNode.childNodes.length == 1) {
            if (!/^\s+$/.test(s)) this.setText(s.trim());
        } else {
            if (oNode == oNode.parentNode.firstChild && s.match(/^\s+/m)) {
                s = s.replace(/^\s+/m, "");
            } else if (oNode == oNode.parentNode.lastChild && s.match(/\s+$/m)) {
                s = s.replace(/\s+$/m, "");
            }
            if (s != "") {
                this.setHtml(this.getHtml() + BiLabel._textToHtml2(s));
            }
        }
    } else if (oNode.nodeType == 1) {
        var xhtmlNs = "http://www.w3.org/1999/xhtml";
        var ns = oNode.namespaceURI;
        if (ns == xhtmlNs) {
            var prefix = oNode.prefix;
            s = oNode.xml.replace(new RegExp("<" + prefix + ":", "g"), "<").replace(new RegExp("</" + prefix + ":", "g"), "</");
            this.setHtml(this.getHtml() + s);
        } else {
            BiComponent.prototype.addXmlNode.call(this, oNode, oXmlResourceParser);
        }
    }
};
_p.setRightToLeft = function (b) {
    if (this._icon) {
        this._icon.setRightToLeft(b);
        this._setHtml();
    }
    BiComponent.prototype.setRightToLeft.call(this, b);
};
_p.setAttribute = function (sName, sValue, oXmlResourceParser) {
    switch (sName) {
    case "text":
        this.setText(sValue);
        break;
    case "icon":
        this.setIcon(BiImage.fromUri(sValue));
        break;
    case "labelFor":
        if (sValue.charAt(0) == "#") sValue = sValue.substr(1);
        var c = oXmlResourceParser.getComponentById(sValue);
        this.setLabelFor(c);
        break;
    case "font":
        if (sValue.charAt(0) == "#") {
            sValue = sValue.substr(1);
            var f = oXmlResourceParser.getComponentById(sValue);
            this.setFont(f);
        } else this.setFont(BiFont.fromString(sValue));
        break;
    case "padding":
        var parts = sValue.split(/\s+/);
        for (var i = 0; i < parts.length; i++) parts[i] = parseFloat(parts[i]);
        this.setPadding.apply(this, parts);
        break;
    default:
        BiComponent.prototype.setAttribute.apply(this, arguments);
    }
};

function BiDragEvent(sType, oMouseEvent) {
    if (_biInPrototype) return;
    BiMouseEvent.call(this, sType, oMouseEvent && oMouseEvent._event);
    this._manager = new BiDragAndDropManager;
}
_p = _biExtend(BiDragEvent, BiMouseEvent, "BiDragEvent");
BiDragEvent.addProperty("manager", BiAccessType.READ);
_p.startDrag = function () {
    if (this._type != "dragstart") throw new Error("BiDragEvent startDrag can only be called during the dragstart event");
    this.stopPropagation();
    this._manager.startDrag();
};
_p.addData = function (sType, oData) {
    this._manager.addData(sType, oData);
};
_p.getData = function (sType) {
    return this._manager.getData(sType);
};
_p.clearData = function () {
    this._manager.clearData();
};
_p.getDropDataTypes = function () {
    return this._manager.getDropDataTypes();
};
_p.addAction = function (sAction) {
    this._manager.addAction(sAction);
};
_p.removeAction = function (sAction) {
    this._manager.removeAction(sAction);
};
_p.getAction = function () {
    return this._manager.getAction();
};
_p.clearActions = function () {
    this._manager.clearActions();
};
_p.getTarget = function () {
    switch (this._type) {
    case "dragstart":
    case "dragend":
    case "dragover":
    case "dragout":
    case "dragmove":
        return this._target;
    case "dragdrop":
        return this._manager.getDestination();
    default:
        return BiMouseEvent.prototype.getTarget.call(this);
    }
};
_p.getRelatedTarget = function () {
    switch (this._type) {
    case "dragover":
    case "dragout":
        return this._relatedTarget;
    case "dragdrop":
        return this._manager.getSource();
    case "dragend":
        return this._manager.getDestination();
    default:
        return BiMouseEvent.prototype.getRelatedTarget.call(this);
    }
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiMouseEvent.prototype.dispose.call(this);
    delete this._manager;
    delete this._relatedTarget;
};
_p.setDragIcon = function (oComp) {
    this._manager.setDragIcon(oComp);
};
_p.getDragIcon = function () {
    return this._manager.getDragIcon();
};
_p.getRealTarget = function () {
    return BiMouseEvent.prototype.getTarget.call(this);
};

function BiDragAndDropManager() {
    if (_biInPrototype) return;
    if (BiDragAndDropManager._singleton) return BiDragAndDropManager._singleton;
    BiObject.call(this);
    this._data = {};
    this._actions = {};
    application.addEventListener("dispose", this.dispose, this);
    BiDragAndDropManager._singleton = this;
}
_p = _biExtend(BiDragAndDropManager, BiObject, "BiDragAndDropManager");
BiDragAndDropManager.MOVE_ICON = new BiImage(application.getPath() + "images/move.gif", 13, 9);
BiDragAndDropManager.MOVE_ICON.setZIndex(BiNumber.INTEGER_INFINITY);
BiDragAndDropManager.COPY_ICON = new BiImage(application.getPath() + "images/copy.gif", 19, 15);
BiDragAndDropManager.COPY_ICON.setZIndex(BiNumber.INTEGER_INFINITY);
BiDragAndDropManager.ALIAS_ICON = new BiImage(application.getPath() + "images/alias.gif", 19, 15);
BiDragAndDropManager.ALIAS_ICON.setZIndex(BiNumber.INTEGER_INFINITY);
BiDragAndDropManager.NO_DROP_ICON = new BiImage(application.getPath() + "images/nodrop.gif", 20, 20);
BiDragAndDropManager.NO_DROP_ICON.setZIndex(BiNumber.INTEGER_INFINITY);
BiDragAndDropManager.addProperty("source", BiAccessType.READ);
BiDragAndDropManager.addProperty("destination", BiAccessType.READ);
_p.addData = function (sType, oData) {
    this._data[sType] = oData;
};
_p.getData = function (sType) {
    return this._data[sType];
};
_p.clearData = function () {
    this._data = {};
};
_p.getDropDataTypes = function () {
    var dst = this.getDestination();
    if (!dst) return [];
    var res = [];
    var dstTypes = dst.getDropDataTypes();
    for (var i = 0; i < dstTypes.length; i++) {
        if (dstTypes[i] in this._data) res.push(dstTypes[i]);
    }
    return res;
};
_p.startDrag = function () {
    if (!this._dragInfo) throw new Error("Invalid use of BiDragAndDropManager startDrag");
    this._dragInfo.dragging = true;
    this._source = this._dragInfo.startComponent;
};
_p.handleMouseEvent = function (e) {
    switch (e.getType()) {
    case "mousedown":
        this.handleMouseDown(e);
        break;
    case "mouseup":
        this.handleMouseUp(e);
        break;
    case "mousemove":
        this.handleMouseMove(e);
    }
};
BiDragAndDropManager.addProperty("validDragButtons", BiAccessType.READ);
_p._validDragButtons = [BiMouseEvent.LEFT];
_p.handleMouseDown = function (e) {
    if (!this._validDragButtons.contains(e.getButton())) return;
    if (!e.getDefaultPrevented()) {
        this._dragInfo = {
            dragging: false,
            hasFiredDragStart: false,
            startScreenX: e.getScreenX(),
            startScreenY: e.getScreenY(),
            startComponent: e.getTarget(),
            clientX: e.getClientX(),
            clientY: e.getClientY()
        };
    }
};
_p.handleMouseMove = function (e) {
    if (!this._dragInfo) return;
    var c;
    if (this._dragInfo.dragging) {
        this._dragInfo.clientX = e.getClientX();
        this._dragInfo.clientY = e.getClientY();
        c = this.getDropTarget(e);
        if (!c) this.setAction(null);
        else this.setAction(this._getAction(e));
        this._fireDragOverOut(this._dragInfo.over, c, e);
        this._dragInfo.over = c;
        this._updateIcon();
        if (c) this._scrollDropTarget(c, e);
    } else if (!this._dragInfo.hasFiredDragStart) {
        if (Math.abs(e.getClientX() - this._dragInfo.clientX) > 5 || Math.abs(e.getClientY() - this._dragInfo.clientY) > 5) {
            c = this._dragInfo.startComponent;
            c.dispatchEvent(new BiDragEvent("dragstart", e));
            this._dragInfo.hasFiredDragStart = true;
            if (this._dragInfo.dragging) {
                this._fireDragOverOut(this._dragInfo.over, c, e);
                this._dragInfo.over = this._dragInfo.startComponent = c;
                application.getWindow().setCapture(true);
                application.getWindow().addEventListener("losecapture", this.cancelDrag, this);
            }
        }
    }
};
_p._fireDragOverOut = function (oFrom, oTo, e) {
    if (oFrom && oFrom != oTo) {
        var outEvent = new BiDragEvent("dragout", e);
        outEvent._relatedTarget = oTo;
        oFrom.dispatchEvent(outEvent);
        outEvent.dispose();
    }
    if (oTo) {
        if (oFrom != oTo) {
            var overEvent = new BiDragEvent("dragover", e);
            overEvent._relatedTarget = oFrom;
            oTo.dispatchEvent(overEvent);
            overEvent.dispose();
        }
        var moveEvent = new BiDragEvent("dragmove", e);
        oTo.dispatchEvent(moveEvent);
        moveEvent.dispose();
    }
};
_p.handleMouseUp = function (e) {
    if (!this._dragInfo) return;
    if (this._dragInfo.dragging) this._endDrag(this.getDropTarget(e), e);
    else this._dragInfo = null;
};
_p.handleKeyboardEvent = function (e) {
    switch (e.getType()) {
    case "keydown":
        this.handleKeyDown(e);
        break;
    case "keyup":
        this.handleKeyUp(e);
    }
};
_p.handleKeyDown = function (e) {
    if (!this._dragInfo) return;
    if (e.matchesBundleShortcut("controls.cancel")) {
        this.cancelDrag();
    } else if (this._action) {
        this.setAction(this._getAction(e));
        this._updateIcon();
    }
};
_p.handleKeyUp = function (e) {
    if (!this._dragInfo) return;
    if (this._action) {
        this.setAction(this._getAction(e));
        this._updateIcon();
    }
};
_p.cancelDrag = function (e) {
    this._endDrag(null, e);
};
_p._endDrag = function (c, e) {
    application.getWindow().removeEventListener("losecapture", this.cancelDrag, this);
    application.getWindow().setCapture(false);
    var over = this._dragInfo && this._dragInfo.over;
    var p, ns, ps;
    if (this._currentDragIcon) {
        p = this._currentDragIcon.getParent();
        ns = this._currentDragIcon.getNextSibling();
        ps = this._currentDragIcon.getPreviousSibling();
    }
    if (c) {
        this._destination = c;
        c.dispatchEvent(new BiDragEvent("dragdrop", e));
    }
    var src = this.getSource();
    if (src) {
        src.dispatchEvent(new BiDragEvent("dragend", e));
    }
    this._fireDragOverOut(over, null, e);
    if (this._currentDragIcon && p == this._currentDragIcon.getParent() && (ns == this._currentDragIcon.getNextSibling() || ps == this._currentDragIcon.getPreviousSibling())) {
        this._removeIcon();
    }
    if (this._dragInfo) {
        this._dragInfo.over = null;
        this._dragInfo = null;
    }
    this.clearData();
    this.clearActions();
    this._source = null;
    this._destination = null;
};
_p._removeIcon = function () {
    if (this._currentDragIcon && this._currentDragIcon.getParent()) {
        this._currentDragIcon.getParent().remove(this._currentDragIcon);
    }
    this._currentDragIcon = null;
};
_p._updateIcon = function () {
    var win = application.getWindow();
    var icon = this._getDragIcon();
    if (this._currentDragIcon && icon != this._currentDragIcon && this._currentDragIcon.getParent() == win) {
        win.remove(this._currentDragIcon);
    }
    if (icon.getParent() != win) win.add(icon);
    this._currentDragIcon = icon;
    this._currentDragIcon.setLocation(this._dragInfo.clientX + 5, this._dragInfo.clientY + 15);
};
_p.supportsDrop = function (oComponent) {
    var types = oComponent.getDropDataTypes();
    for (var i = 0; i < types.length; i++) {
        if (types[i] in this._data) return true;
    }
    return false;
};
_p.getDropTarget = function (e) {
    var c = e.getTarget();
    while (c != null) {
        if ("_beforeSupportsDrop" in c) c._beforeSupportsDrop(e);
        if (this.supportsDrop(c)) return c;
        c = c.getParent();
    }
    return null;
};
_p.addAction = function (sAction) {
    this._actions[sAction] = true;
    if (!this._action) this._action = sAction;
};
_p.clearActions = function () {
    this._actions = {};
    this._action = null;
};
_p.removeAction = function (sAction) {
    delete this._actions[sAction];
    if (this._action == sAction) this._action = null;
};
_p.getAction = function () {
    return this._action;
};
_p.setAction = function (s) {
    if (s != null && !(s in this._actions)) this.addAction(s);
    this._action = s;
};
BiDragAndDropManager.addProperty("dragIcon", BiAccessType.READ);
_p.setDragIcon = function (oComp) {
    this._dragIcon = oComp;
    if (this._dragInfo) this._updateIcon();
};
_p._getDragIcon = function () {
    if (this._action == null) return BiDragAndDropManager.NO_DROP_ICON;
    if (this._dragIcon) return this._dragIcon;
    if (this._action == "move") return BiDragAndDropManager.MOVE_ICON;
    if (this._action == "copy") return BiDragAndDropManager.COPY_ICON;
    if (this._action == "alias") return BiDragAndDropManager.ALIAS_ICON;
    return BiDragAndDropManager.NO_DROP_ICON;
};
_p._getAction = function (e) {
    var actions = {
        "drag.alias": "alias",
        "drag.copy": "copy",
        "drag.move": "move"
    };
    for (var n in actions) {
        if (e.matchesBundleModifiers(n)) return actions[n];
    }
    for (var action in this._actions) return action;
    return null;
};
_p._supportAction = function (sAction) {
    return sAction in this._actions;
};
_p._scrollDropTarget = function (c, e) {
    var cw = c.getClientWidth();
    var ch = c.getClientHeight();
    var x = e.getClientX() - c.getClientLeft();
    var y = e.getClientY() - c.getClientTop();
    var canScrollX = c.getScrollWidth() > cw;
    var canScrollY = c.getScrollHeight() > ch;
    if (canScrollX) {
        if (x < 20) c.setScrollLeft(c.getScrollLeft() - 5);
        else if (cw - x < 20) c.setScrollLeft(c.getScrollLeft() + 5);
    }
    if (canScrollY) {
        if (y < 20) c.setScrollTop(c.getScrollTop() - 20);
        else if (ch - y < 20) c.setScrollTop(c.getScrollTop() + 20);
    }
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiObject.prototype.dispose.call(this);
    application.removeEventListener("dispose", this.dispose, this);
    delete BiDragAndDropManager._singleton;
    delete this._data;
    delete this._actions;
    delete this._source;
    delete this._destination;
    delete this._dragInfo;
    delete this._dragIcon;
    BiDragAndDropManager.MOVE_ICON.dispose();
    delete BiDragAndDropManager.MOVE_ICON;
    BiDragAndDropManager.COPY_ICON.dispose();
    delete BiDragAndDropManager.COPY_ICON;
    BiDragAndDropManager.ALIAS_ICON.dispose();
    delete BiDragAndDropManager.ALIAS_ICON;
    BiDragAndDropManager.NO_DROP_ICON.dispose();
    delete BiDragAndDropManager.NO_DROP_ICON;
};

function BiPopupManager() {
    if (_biInPrototype) return;
    if (BiPopupManager._singleton) return BiPopupManager._singleton;
    BiObject.call(this);
    BiPopupManager._singleton = this;
    this._showingPopups = {};
    application.addEventListener("dispose", this.dispose, this);
}
_p = _biExtend(BiPopupManager, BiObject, "BiPopupManager");
_p._useOpaquePopups = false;
BiPopupManager.addProperty("useOpaquePopups", BiAccessType.READ_WRITE);
_p.addShowing = function (oPopup) {
    this._showingPopups[oPopup.toHashCode()] = oPopup;
};
_p.removeShowing = function (oPopup) {
    delete this._showingPopups[oPopup.toHashCode()];
};
_p.hideAutoHiding = function (oTarget) {
    var isToolTip = oTarget != null && oTarget instanceof BiToolTip;
    var targetPopup = oTarget;
    while (targetPopup != null && !(targetPopup instanceof BiPopup)) targetPopup = targetPopup._parent;
    for (var hc in this._showingPopups) {
        var p = this._showingPopups[hc];
        if (!p._autoHide || p.isPopupAncestorOf(targetPopup)) continue;
        if (!oTarget || p != oTarget && (!p.contains(oTarget) || p.getVisible() && !p.getIsVisible()) && new Date - p.getShowTimeStamp() > 100 && (!isToolTip || p instanceof BiToolTip)) {
            p.setVisible(false);
        }
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    application.removeEventListener("dispose", this.dispose, this);
    BiObject.prototype.dispose.call(this);
    delete this._showingPopups;
    delete BiPopupManager._singleton;
};

function BiPopup(sText) {
    if (_biInPrototype) return;
    BiLabel.call(this, sText);
    var bg = this._bgComponent = new BiComponent();
    bg.setVisible(false);
    bg.setCssClassName("bi-popup-background");
    bg.makeThemeAware();
    bg._popup = this;
    bg._themeKey = BiTheme.KEYS.popupBackground;
    this.setCssClassName("bi-popup");
    this.setZIndex(1e6);
    this._visible = false;
    if ((new BiPopupManager()).getUseOpaquePopups()) this.setOpaque(true);
}
_p = _biExtend(BiPopup, BiLabel, "BiPopup");
_p._autoHide = true;
_p._allowOffScreen = false;
_p._relLeft = null;
_p._relTop = null;
_p._relRight = null;
_p._relBottom = null;
_p._screenLeft = null;
_p._screenTop = null;
_p._wasShowing = false;
_p._showTimeStamp = new Date(0);
_p._hideTimeStamp = new Date(0);
_p._shadowSize = BiBrowserCheck.ie ? 3 : 0;
_p.setZIndex = function (nIndex) {
    this._bgComponent.setZIndex(nIndex - 1);
    BiLabel.prototype.setZIndex.call(this, nIndex);
};
_p.setScreenLeft = function (nLeft) {
    if (this._screenLeft != nLeft) {
        this._screenLeft = nLeft;
        this._relLeft = null;
        this.layoutComponent();
    }
};
_p.setScreenTop = function (nTop) {
    if (this._screenTop != nTop) {
        this._screenTop = nTop;
        this._relTop = null;
        this.layoutComponent();
    }
};
_p.setLeft = function (nLeft) {
    if (this._relLeft != nLeft) {
        this._screenLeft = null;
        this._relLeft = nLeft;
        this.layoutComponent();
    }
};
_p.setTop = function (nTop) {
    if (this._relTop != nTop) {
        this._screenTop = null;
        this._relTop = nTop;
        this.layoutComponent();
    }
};
_p.setLocation = function (nLeft, nTop) {
    this.setLeft(nLeft);
    this.setTop(nTop);
};
_p.setClientLeft = function (nLeft) {
    if (this._left != nLeft) {
        this._screenLeft = null;
        this._relLeft = null;
        this._left = nLeft;
        this.layoutComponent();
    }
};
_p.setClientTop = function (nTop) {
    if (this._top != nTop) {
        this._screenTop = null;
        this._relTop = null;
        this._top = nTop;
        this.layoutComponent();
    }
};
_p.setVisible = function (bVisible) {
    if (this.getVisible() == bVisible) return;
    if (this._lazyCreate && !this.getCreated() && bVisible) {
        var p = this.getParent();
        if (p && p.getCreated()) {
            var old = this._visible;
            this._visible = true;
            this.setStyleProperty("visibility", "inherit");
            this._addHtmlElementToParent(p, this.getNextSibling());
            this._visible = old;
            this.setStyleProperty("visibility", "hidden");
        }
    }
    if (this.getCreated()) {
        if (bVisible) {
            if (!this._element.parentNode || this._element.parentNode.nodeType != 1) this._addHtmlElementToParent(this._parent);
            this.removeStyleProperty("display");
            this.dispatchEvent("beforeshow");
            this.setStyleProperty("visibility", bVisible ? "inherit" : "hidden");
            this.pack();
            this.layoutAllChildren();
            this.layoutComponent();
            this.bringToFront();
        } else {
            this.setStyleProperty("display", "none");
        }
    }
    this._visible = bVisible;
    this.setStyleProperty("visibility", bVisible ? "inherit" : "hidden");
    var bg = this._bgComponent;
    var noshadow = BiBrowserCheck.ie && application.getWindow().getOpacity() != 1;
    if (noshadow) bg.setStyleProperty("filter", "none");
    bg.setVisible(bVisible);
    this._layoutBgComponent(noshadow);
    if (this.getIsVisible() != this._wasShowing) {
        if (bVisible) this._dispatchShow();
        else this._dispatchHide();
    }
};
BiPopup.addProperty("opaque", BiAccessType.READ);
_p.setOpaque = function (b) {
    if (this._opaque != b) {
        this._opaque = b;
        if (b) {
            if (!this._opaqueIframe) {
                var o = this._opaqueIframe = new BiIframe(application.getPath() + "blank.html");
                o.setZIndex(-1);
                o.setHtmlProperty("allowTransparency", false);
                o.setOpacity(0);
                o.setLocation(-2, -2);
                o.setRight(-2);
                o.setBottom(-2);
                this._bgComponent.add(this._opaqueIframe);
            }
        } else if (this._opaqueIframe) {
            this._opaqueIframe.dispose();
            delete this._opaqueIframe;
        }
    }
};
_p.getCanFocus = function () {
    return true;
};
_p.bringToFront = function () {
    var cs, i;
    var p = this._parent;
    if (this.getCreated() && p) {
        var max = -Infinity;
        if (BiBrowserCheck.ie) {
            cs = this._document.body.children;
            for (i = 0; i < cs.length; i++) {
                if (cs[i].nodeType == 1) max = Math.max(max, cs[i].currentStyle.zIndex);
            }
        } else {
            cs = this._document.body.childNodes;
            var view = this._document.defaultView;
            var zi;
            for (i = 0; i < cs.length; i++) {
                if (cs[i].nodeType == 1) {
                    zi = cs[i].style.zIndex;
                    if (zi == "" || isNaN(zi)) {
                        zi = view.getComputedStyle(cs[i], "").zIndex;
                        if (zi == "" || isNaN(zi)) zi = 0;
                    }
                    max = Math.max(max, zi);
                }
            }
        }
        this.setZIndex(max + 1);
    }
};
_p.sendToBack = function () {
    var p = this._parent;
    if (this.getCreated() && p) {
        var min = Infinity;
        if (BiBrowserCheck.ie) {
            var cs = this._document.body.children;
            for (var i = 0; i < cs.length; i++) {
                if (cs[i].nodeType == 1) min = Math.min(min, cs[i].currentStyle.zIndex);
            }
        } else {
            cs = this._document.body.childNodes;
            var view = this._document.defaultView;
            for (i = 0; i < cs.length; i++) {
                if (cs[i].nodeType == 1) min = Math.min(min, view.getComputedStyle(cs[i], "").zIndex);
            }
        }
        this.setZIndex(min - 1);
    }
};
BiPopup.addProperty("autoHide", BiAccessType.READ_WRITE);
BiPopup.addProperty("allowOffScreen", BiAccessType.READ_WRITE);
BiPopup.addProperty("showTimeStamp", BiAccessType.READ);
BiPopup.addProperty("hideTimeStamp", BiAccessType.READ);
_p.layoutComponent = function () {
    if (!this.getCreated()) return;
    var root = this.getTopLevelComponent();
    if (!root) return;
    var oldLeft = this._left;
    var oldRight = this._right;
    var oldTop = this._top;
    var oldBottom = this._bottom;
    var oldHeight = this._height;
    if (this._relativeToComponent && !this._relativeToComponent.getDisposed()) this._layoutRelative();
    else {
        delete this._relativeToComponent;
        var appWin = application.getWindow();
        var sl = root.getScrollLeft();
        var p = this._parent;
        var pBox = p.getContentBox();
        if (this._relLeft != null) this._left = pBox.x + this._relLeft;
        else if (this._screenLeft != null) {
            var screenX = (appWin.getScreenLeft() + appWin.getInsetLeft());
            this._left = this._screenLeft - screenX + sl;
        }
        if (this._right != null) this._right = pBox.x + pBox.width - this._right;
        if (!this._allowOffScreen) {
            var h = root.getClientWidth();
            if (this._left != null) this._left = Math.max(sl, this._left);
            if (this._right != null) this._right = Math.max(0, this._right);
            if (this._width != null) this._width = Math.min(h, this._width);
            if (this._left != null && this._width != null && this._left + this._width > h + sl) {
                this._left = h + sl - this._width;
                this._right = null;
            } else if (this._right != null && this._width != null && this._right + this._width > h) {
                this._left = 0;
                this._right = null;
            }
        }
        var st = root.getScrollTop();
        if (this._relTop != null) this._top = pBox.y + this._relTop;
        else if (this._screenTop != null) {
            var screenY = (appWin.getScreenTop() + appWin.getInsetTop());
            this._top = this._screenTop - screenY + st;
        }
        if (this._bottom != null) this._bottom = pBox.y + pBox.height - this._bottom;
        if (!this._allowOffScreen) {
            h = root.getClientHeight();
            if (this._top != null) this._top = Math.max(st, this._top);
            if (this._bottom != null) this._bottom = Math.max(0, this._bottom);
            if (this._height != null) this._height = Math.min(h, this._height);
            if (this._top != null && this._height != null && this._top + this._height > h + st) {
                this._top = h + st - this._height;
                this._bottom = null;
            } else if (this._bottom != null && this._height != null && this._bottom + this._height > h) {
                this._top = 0;
                this._bottom = null;
            }
        }
    }
    this._width = this._width || this.getPreferredWidth();
    this._height = this._height || this.getPreferredHeight();
    root.layoutChild(this);
    this._left = oldLeft;
    this._right = oldRight;
    this._top = oldTop;
    this._bottom = oldBottom;
    this._height = oldHeight;
    this._layoutBgComponent();
};
_p._layoutBgComponent = function (bNoShadow) {
    var shadowSize = bNoShadow ? 0 : this._shadowSize;
    this._bgComponent.setBounds(this.getLeft(), this.getTop(), this.getWidth() + shadowSize, this.getHeight() + shadowSize);
};
_p.positionRelativeToComponent = function (oComponent, sDir) {
    this._relativeToComponent = oComponent;
    this._relativeDirection = sDir || "vertical";
    this.layoutComponent();
};
_p._layoutRelative = function () {
    var comp = this._relativeToComponent;
    var p = BiComponent._getElementPositionInFrame(comp._element);
    var compWidth = comp.getWidth();
    var compHeight = comp.getHeight();
    var width = this.getPreferredWidth();
    var height = this.getPreferredHeight();
    var docWidth = this._document.body.clientWidth;
    var docHeight = this._document.body.clientHeight;
    this._left = null;
    this._right = null;
    this._top = null;
    this._bottom = null;
    if (this._relativeDirection == "vertical") {
        if (p.x + width <= docWidth) this._left = p.x;
        else if (docWidth >= width) this._left = docWidth - width;
        else {
            if (!this._allowOffScreen) {
                this._left = 0;
                this._width = docWidth;
            } else {
                this._left = 0;
                this._width = width;
            }
        }
    } else {
        if (p.x + compWidth + width <= docWidth) this._left = p.x + compWidth;
        else if (p.x - width >= 0) this._left = p.x - width;
        else if (docWidth - p.x - compWidth >= p.x) {
            this._left = p.x + compWidth;
            if (!this._allowOffScreen) this._width = docWidth - p.x - compWidth;
            else this._width = width;
        } else {
            if (!this._allowOffScreen) {
                this._left = 0;
                this._width = p.x;
            } else {
                this._left = p.x - width;
                this._width = width;
            }
        }
    }
    this._left += this.getTopLevelComponent().getScrollLeft();
    if (this._relativeDirection == "vertical") {
        if (p.y + compHeight + height <= docHeight) this._top = p.y + compHeight;
        else if (p.y >= height) {
            this._top = p.y - height;
        } else if (docHeight - p.y - compHeight >= p.y) {
            this._top = p.y + compHeight;
            if (!this._allowOffScreen) this._height = docHeight - p.y - compHeight;
            else this._height = height;
        } else {
            if (!this._allowOffScreen) {
                this._top = 0;
                this._height = p.y;
            } else {
                this._top = p.y - height;
                this._height = height;
            }
        }
    } else {
        if (p.y + height <= docHeight) this._top = p.y;
        else if (p.y + compHeight - height >= 0 && p.y + compHeight <= docHeight) this._top = p.y + compHeight - height;
        else if (docHeight >= height) {
            this._top = docHeight - height;
        } else {
            if (!this._allowOffScreen) {
                this._top = 0;
                this._height = docHeight;
            } else {
                this._top = 0;
                this._height = height;
            }
        }
    }
    this._top += this.getTopLevelComponent().getScrollTop();
};
_p._dispatchShow = function () {
    var pm = new BiPopupManager;
    pm.addShowing(this);
    pm.hideAutoHiding(this);
    this._wasShowing = true;
    this._showTimeStamp = new Date;
    this.dispatchEvent("show");
};
_p._dispatchHide = function () {
    (new BiPopupManager).removeShowing(this);
    this._wasShowing = false;
    this._hideTimeStamp = new Date;
    this.dispatchEvent("hide");
};
_p.getInsetRight = function () {
    var el = this._element;
    if (BiBrowserCheck.ie && this.getStyleProperty("overflowY") == "hidden" || el.clientWidth == 0) {
        return BiLabel.prototype.getInsetRight.call(this);
    }
    return BiLabel.prototype.getInsetRight.call(this) - this._shadowSize;
};
_p.getInsetBottom = function () {
    var el = this._element;
    if (BiBrowserCheck.ie && this.getStyleProperty("overflowX") == "hidden" || el.clientHeight == 0) {
        return BiLabel.prototype.getInsetBottom.call(this);
    }
    return BiLabel.prototype.getInsetBottom.call(this) - this._shadowSize;
};
_p.getWidth = function () {
    return BiLabel.prototype.getWidth.call(this) - this._shadowSize;
};
_p.getHeight = function () {
    return BiLabel.prototype.getHeight.call(this) - this._shadowSize;
};
_p._addHtmlElementToParent = function (oParent, oBefore) {
    if (this._lazyCreate && !this._created && !this.getVisible()) return;
    var createNow = !this._created;
    if (createNow) this._create(oParent._document);
    this._document.body.appendChild(this._element);
    this._created = true;
    this._createChildren();
    application.getWindow().add(this._bgComponent, null, true);
    this.invalidateParentLayout();
    if (oParent.getHtmlProperty("disabled") && !this.getHtmlProperty("disabled")) {
        this._setEnabled(false);
    }
    if (createNow) this.dispatchEvent(BiComponent._createEvent);
};
_p._removeHtmlElementFromParent = function (oParent) {
    if (this.getCreated()) {
        var parent = this._bgComponent.getParent();
        if (parent) parent.remove(this._bgComponent);
        this._element.parentNode.removeChild(this._element);
        (new BiPopupManager).removeShowing(this);
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    if (this._element) this._element.style.filter = "none";
    BiLabel.prototype.dispose.call(this);
    (new BiPopupManager).removeShowing(this);
    delete this._bgComponent._popup;
    this.disposeFields("_opaqueIframe", "_bgComponent", "_relativeDirection", "_autoHide", "_allowOffScreen", "_relLeft", "_relTop", "_relRight", "_relBottom", "_screenLeft", "_screenTop", "_wasShowing", "_showTimeStamp", "_hideTimeStamp");
    delete this._relativeToComponent;
};
_p.isPopupAncestorOf = function (oPopup) {
    return false;
};

function BiToolTipManager() {
    if (_biInPrototype) return;
    if (BiToolTipManager._singleton) return BiToolTipManager._singleton;
    BiObject.call(this);
    BiToolTipManager._singleton = this;
    application.addEventListener("dispose", this.dispose, this);
};
_p = _biExtend(BiToolTipManager, BiObject, "BiToolTipManager");
_p._currentToolTip = null;
_p.handleMouseOver = function (e) {
    var to = e.getTarget();
    var c = to;
    var tt;
    while (c != null && !(tt = c.getToolTip())) {
        c = c.getParent();
    }
    if (this._currentToolTip && (to == this._currentToolTip || this._currentToolTip.contains(to))) return;
    if (this._currentToolTip != tt || this._currentToolTip && this._currentToolTip._toolTipForComponent != c) {
        if (this._currentToolTip) {
            this._currentToolTip._toolTipForComponent = null;
            this._currentToolTip.setVisible(false);
        }
        if (tt) {
            this._currentToolTip = tt;
            tt.positionRelativeToComponent(null);
            tt._startShowTimer();
            this._currentToolTip._toolTipForComponent = c;
        }
    }
};
_p.handleMouseOut = function (e) {
    var to = e.getRelatedTarget();
    var from = e.getTarget();
    if (this._currentToolTip && (to == this._currentToolTip || this._currentToolTip.contains(to))) return;
    if (to && from.contains(to)) return;
    if (this._currentToolTip && !to) {
        this._currentToolTip._toolTipForComponent = null;
        this._currentToolTip.setVisible(false);
        this._currentToolTip = null;
    }
};
_p.handleFocus = function (e) {
    var c = e.getTarget();
    var tt = c.getToolTip();
    if (tt && this._currentToolTip != tt) {
        if (this._currentToolTip) {
            this._currentToolTip._toolTipForComponent = null;
            this._currentToolTip.setVisible(false);
        }
        this._currentToolTip = tt;
        tt.positionRelativeToComponent(c);
        tt._startShowTimer();
        this._currentToolTip._toolTipForComponent = c;
    }
};
_p.handleBlur = function (e) {
    var c = e.getTarget();
    if (!c) return;
    var tt = c.getToolTip();
    if (this._currentToolTip && this._currentToolTip == tt) {
        this._currentToolTip._toolTipForComponent = null;
        tt.setVisible(false);
        this._currentToolTip = null;
    }
};
BiToolTipManager.addProperty("currentToolTip", BiAccessType.READ_WRITE);
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    application.removeEventListener("dispose", this.dispose, this);
    delete BiToolTipManager._singleton;
    delete this._currentToolTip;
};

function BiToolTip(sText) {
    if (_biInPrototype) return;
    BiPopup.call(this, sText);
    this._showTimer = new BiTimer();
    this._showTimer.setInterval(this._showInterval);
    this._showTimer.addEventListener("tick", this._onshowtick, this);
    this._hideTimer = new BiTimer();
    this._hideTimer.setInterval(this._hideInterval);
    this._hideTimer.addEventListener("tick", this._onhidetick, this);
    this.addEventListener("mouseover", this._onmouseover);
    this.addEventListener("mouseout", this._onmouseover);
    this.setCssClassName("bi-tool-tip");
    this.setAppearance("tool-tip");
}
_p = _biExtend(BiToolTip, BiPopup, "BiToolTip");
_p._toolTipManager = new BiToolTipManager();
_p._showInterval = 1000;
_p._hideInterval = 4000;
_p._hideOnHover = true;
_p._mousePointerOffsetX = 1;
_p._mousePointerOffsetY = 20;
_p._toolTipForComponent = null;
BiToolTip.addProperty("hideOnHover", BiAccessType.READ_WRITE);
BiToolTip.addProperty("mousePointerOffsetX", BiAccessType.READ_WRITE);
BiToolTip.addProperty("mousePointerOffsetY", BiAccessType.READ_WRITE);
_p.setHideInterval = function (nHideInterval) {
    this._hideInterval = nHideInterval;
    this._hideTimer.setInterval(nHideInterval);
};
BiToolTip.addProperty("hideInterval", BiAccessType.READ);
_p.setShowInterval = function (nShowInterval) {
    this._showInterval = nShowInterval;
    this._showTimer.setInterval(nShowInterval);
};
BiToolTip.addProperty("showInterval", BiAccessType.READ);
_p._startShowTimer = function () {
    if (!this._showTimer.getEnabled()) this._showTimer.start();
};
_p.getComponent = function () {
    return this._toolTipForComponent;
};
_p.dispose = function () {
    if (this._disposed) return;
    this.removeEventListener("mouseover", this._onmouseover);
    this._showTimer.removeEventListener("tick", this._onshowtick, this);
    this._showTimer.dispose();
    this._showTimer = null;
    this._hideTimer.removeEventListener("tick", this._onhidetick, this);
    this._hideTimer.dispose();
    this._hideTimer = null;
    this._toolTipForComponent = null;
    BiPopup.prototype.dispose.call(this);
};
_p.setVisible = function (bVisible) {
    if (bVisible && !this.getParent()) {
        application.getWindow().add(this);
    }
    this._showTimer.stop();
    this._hideTimer.stop();
    BiPopup.prototype.setVisible.call(this, bVisible);
};
_p._onmouseover = function (e) {
    if (this._hideOnHover) this.setVisible(false);
};
_p._onshowtick = function (e) {
    this._showTimer.stop();
    if (this._relativeToComponent && this._relativeToComponent._disposed) {
        delete this._relativeToComponent;
        return;
    }
    this.setScreenLeft(BiMouseEvent.getScreenX() + this._mousePointerOffsetX);
    this.setScreenTop(BiMouseEvent.getScreenY() + this._mousePointerOffsetY);
    this.setVisible(true);
};
_p._onhidetick = function (e) {
    this._hideTimer.stop();
    this.setVisible(false);
};
_p._dispatchShow = function () {
    this._showTimer.stop();
    this._hideTimer.start();
    BiPopup.prototype._dispatchShow.call(this);
};
_p._dispatchHide = function () {
    this._hideTimer.stop();
    this._showTimer.stop();
    this._toolTipManager._currentToolTip = null;
    BiPopup.prototype._dispatchHide.call(this);
};
BiToolTip.getTextToolTip = function (sText) {
    if (!BiToolTip._textToolTip) {
        BiToolTip._textToolTip = new BiToolTip;
    }
    if (BiToolTip._textToolTip.getParent()) BiToolTip._textToolTip.getParent().remove(BiToolTip._textToolTip);
    BiToolTip._textToolTip.setText(sText);
    if (BiToolTip._textToolTip.getShowInterval() != 1000) {
        BiToolTip._textToolTip.setShowInterval(1000);
    }
    BiToolTip._textToolTip.setHideInterval(4000);
    return BiToolTip._textToolTip;
};

function BiJson() {
    throw new Error("Cannot create instance of BiJson.");
}
_p = _biExtend(BiJson, BiObject, "BiJson");
BiJson.deserialize = function (s) {
    return eval("(" + s + ")");
};
BiJson.serialize = function (obj) {
    var sb = [];
    BiJson._serialize(obj, sb);
    return sb.join("");
};
BiJson._serialize = function (obj, sb) {
    switch (typeof obj) {
    case "string":
        BiJson._serializeString(obj, sb);
        return;
    case "boolean":
        BiJson._serializeBoolean(obj, sb);
        return;
    case "number":
        BiJson._serializeNumber(obj, sb);
        return;
    case "undefined":
        sb.push("null");
        return;
    case "object":
        if (obj === null) {
            sb.push("null");
        } else if (typeof obj.serialize == "function") {
            sb.push(obj.serialize());
        } else if (obj instanceof Array) {
            BiJson._serializeArray(obj, sb);
        } else if (obj instanceof String) {
            BiJson._serializeString(obj, sb);
        } else if (obj instanceof Boolean) {
            BiJson._serializeBoolean(obj, sb);
        } else if (obj instanceof Number) {
            BiJson._serializeNumber(obj, sb);
        } else if (obj instanceof Date) {
            BiJson._serializeDate(obj, sb);
        } else {
            BiJson._serializeObject(obj, sb);
        }
        return;
    }
    throw new Error("JSON could not serialize object: " + obj);
};
BiJson._serializeString = function (obj, sb) {
    sb.push("\"");
    for (var i = 0; i < obj.length; i++) {
        var c = obj.charAt(i);
        if (c >= " ") {
            if (c == "\"" || c == "\\") {
                sb.push("\\");
            }
            sb.push(c);
        } else {
            sb.push("\\");
            switch (c) {
            case "\b":
                sb.push("b");
                break;
            case "\f":
                sb.push("f");
                break;
            case "\n":
                sb.push("n");
                break;
            case "\r":
                sb.push("r");
                break;
            case "\t":
                sb.push("t");
                break;
            default:
                var hex = "000" + c.charCodeAt(0).toString(16);
                sb.push("u", hex.substring(hex.length - 4));
            }
        }
    }
    sb.push("\"");
};
BiJson._serializeBoolean = function (obj, sb) {
    sb.push(String(obj));
};
BiJson._serializeNumber = function (obj, sb) {
    if (isFinite(obj)) {
        sb.push(String(obj));
    } else {
        sb.push("null");
    }
};
BiJson._serializeArray = function (obj, sb) {
    sb.push("[");
    for (var i = 0; i < obj.length; i++) {
        if (i > 0) {
            sb.push(",");
        }
        BiJson._serialize(obj[i], sb);
    }
    sb.push("]");
};
BiJson._serializeDate = function (obj, sb) {
    sb.push('new Date(', obj.getTime(), ')');
};
BiJson._serializeObject = function (obj, sb) {
    sb.push("{");
    var first = true;
    for (var n in obj) {
        if (!first) {
            sb.push(",");
        } else {
            first = false;
        }
        BiJson._serialize(n, sb);
        sb.push(":");
        BiJson._serialize(obj[n], sb);
    }
    sb.push("}");
};

function BiSort() {
    if (_biInPrototype) return;
    BiObject.call(this);
}
_p = _biExtend(BiSort, BiObject, "BiSort");
BiSort.numberCompare = function (n1, n2) {
    return n1 - n2;
};
BiSort.dateCompare = function (d1, d2) {
    return d1 - d2;
};
BiSort.lessThanCompare = function (v1, v2) {
    return v1 < v2 ? -1 : v2 < v1 ? 1 : 0;
};
BiSort.stringCompare = function (s1, s2) {
    return s1 < s2 ? -1 : s2 < s1 ? 1 : 0;
};
BiSort.caseInsensitiveStringCompare = function (s1, s2) {
    return BiSort.stringCompare(s1.toLowerCase(), s2.toLowerCase());
};
BiSort.ipCompare = function (ip1, ip2) {
    function getIPArray(ip) {
        var result = [];
        var parts = ip.split('.');
        for (var i = 0; i < parts.length; i++) {
            result.push(parts[i]);
        }
        return result;
    }
    var ipArray1 = getIPArray(ip1);
    var ipArray2 = getIPArray(ip2);
    for (var i = 0; i < ipArray1.length; i++) {
        var diff = ipArray1[i] - ipArray2[i];
        if (diff != 0) return diff;
    }
    return 0;
};

function BiTextParser(sText, oStringContainer, bParseOnce) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    if (bParseOnce) {
        return this.parse(sText, oStringContainer);
    }
};
_p = _biExtend(BiTextParser, BiEventTarget, "BiTextParser");
BiTextParser.addProperty("replacePattern", BiAccessType.READ_WRITE);
_p._replacePattern = "(?:%%)([^%%]*)(?:%%)";
BiTextParser.addProperty("replaceFlags", BiAccessType.READ_WRITE);
_p._replaceFlags = "gim";
BiTextParser.addProperty("parseRegExp", BiAccessType.READ);
_p.getParseRegExp = function () {
    return this._parseRegExp || (this._parseRegExp = new RegExp(this._replacePattern, this._replaceFlags));
};
BiTextParser.addProperty("printStringBundle", BiAccessType.READ_WRITE);
_p._printStringBundle = window;
BiTextParser.addProperty("parseFunction", BiAccessType.READ_WRITE);
_p._parseFunction = function (o) {
    return function () {
        return o[arguments[1]];
    };
};
_p.parse = function (sText, oStringContainer) {
    return sText.replace(this.getParseRegExp(), this.getParseFunction()(oStringContainer || this._printStringBundle));
};

function BiL10nString(sName) {
    this._name = sName;
}
_p = BiL10nString.prototype = new String;
_p._className = "BiL10nString";
_p.setName = function (sName) {
    this._name = sName;
};
_p.getName = function () {
    return this._name;
};
_p.toString = function () {
    var s = application.getStringBundle().getString(this._name);
    return s || this._name;
};
_p.setAttribute = function (sName, sValue) {
    if (sName == "name") this.setName(sValue);
};

function BiHashTable() {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._hash = {};
    this._count = 0;
    this._addCount = 0;
}
_p = _biExtend(BiHashTable, BiObject, "BiHashTable");
_p.add = function (key, val) {
    if (!this.hasKey(key)) {
        this._hash[key] = val;
        this._count++;
        this._addCount++;
    }
};
_p.remove = function (key) {
    if (this.hasKey(key)) {
        delete this._hash[key];
        this._count--;
        if (BiBrowserCheck.ie && this._addCount > this._count * 4) {
            this._recreate();
        }
    }
};
_p.clear = function () {
    this._hash = {};
    this._count = 0;
    this._addCount = 0;
};
_p.item = function (key) {
    if (this.hasKey(key)) {
        return this._hash[key];
    }
    return undefined;
};
_p.hasKey = function (key) {
    return this._hash.hasOwnProperty(key);
};
_p.getKeys = function () {
    var res = [];
    for (var k in this._hash) {
        if (this._hash.hasOwnProperty(k)) {
            res.push(k);
        }
    }
    return res;
};
_p.getValues = function () {
    var res = [];
    for (var k in this._hash) {
        if (this._hash.hasOwnProperty(k)) {
            res.push(this._hash[k]);
        }
    }
    return res;
};
_p.isEmpty = function () {
    return this._count == 0;
};
_p._recreate = function () {
    var tmp = {};
    for (var k in this._hash) {
        if (this._hash.hasOwnProperty(k)) {
            tmp[k] = this._hash[k];
        }
    }
    this._hash = tmp;
    this._addCount = this._count;
};
BiHashTable.addProperty("count", BiAccessType.READ);
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    delete this._hash;
};

function BiSet() {
    if (_biInPrototype) return;
    this._items = new BiHashTable;
}
_p = _biExtend(BiSet, BiObject, "BiSet");
_p.add = function (o) {
    this._items.add(BiObject.toHashCode(o), o);
};
_p.remove = function (o) {
    this._items.remove(BiObject.toHashCode(o));
};
_p.contains = function (o) {
    return o && this._items.hasKey(BiObject.toHashCode(o));
};
_p.clear = function () {
    this._items.clear();
};
_p.toArray = function () {
    return this._items.getValues();
};
_p.getValues = function () {
    return this._items.getValues();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this._items.dispose();
    delete this._items;
};