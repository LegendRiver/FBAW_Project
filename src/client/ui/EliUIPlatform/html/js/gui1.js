/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiCommand() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    if (application && application.getWindow && application.getWindow()) application.getWindow().addCommand(this);
}
_p = _biExtend(BiCommand, BiEventTarget, "BiCommand");
_p._enabled = true;
_p._checked = false;
_p._userValue = null;
_p._shortcut = null;
_p._keyCode = null;
_p._ownerWindow = null;
BiCommand.addProperty("enabled", BiAccessType.READ);
BiCommand.addProperty("checked", BiAccessType.READ);
BiCommand.addProperty("userValue", BiAccessType.READ);
BiCommand.addProperty("shortcut", BiAccessType.READ);
_p.getShortcutKeystroke = function () {
    return this._keystroke || (this._keystroke = this._shortcut && BiKeystroke.fromString(this._shortcut));
};
BiCommand.addProperty("keyCode", BiAccessType.READ_WRITE);
BiCommand.addProperty("ownerWindow", BiAccessType.READ);
BiCommand.addProperty("shortcutBubbles", BiAccessType.READ_WRITE);
_p.execute = function () {
    var e = new BiEvent("execute");
    e.preventDefault();
    return this.dispatchEvent(e);
};
_p.setEnabled = function (b) {
    if (this._enabled != b) {
        this._enabled = b;
        this.dispatchEvent("enabledchanged");
    }
};
_p.setChecked = function (b) {
    if (this._checked != b) {
        this._checked = b;
        this.dispatchEvent("checkedchanged");
    }
};
_p.setUserValue = function (v) {
    if (this._userValue != v) {
        this._userValue = v;
        this.dispatchEvent("uservaluechanged");
    }
};
_p.setShortcut = function (s) {
    if (this._shortcut != s) {
        this._shortcut = s;
        delete this._keystroke;
        this.dispatchEvent("shortcutchanged");
    }
};
_p.matchesKeyboardEvent = function (e) {
    var keystroke = this.getShortcutKeystroke();
    return keystroke && e.getKeystroke().matches(keystroke);
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    this._ownerWindow = null;
    BiEventTarget.prototype.dispose.call(this);
};

function BiButton(sText) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.makeThemeAware();
    this.setTabIndex(1);
    this.addEventListener("click", this._onClick);
    this.setCanSelect(false);
    var label = this._label = new BiLabel(sText);
    label._acceptsEnter = true;
    label.setCssClassName("bi-button-label");
    label._dispatchEvent = function (e) {
        var b = this._parent;
        if (e instanceof BiInputEvent) {
            e.getTarget = function () {
                return b;
            };
            b._dispatchEvent(e);
        } else BiLabel.prototype._dispatchEvent.apply(this, arguments);
    };
    label.setLeft(0);
    label.setRight(0);
    label.setTabIndex(-1);
    this.add(label);
    this.setCssClassName("bi-button");
    this.setAppearance("button");
    var dragEvents = ["dragstart", "dragover", "dragout", "dragmove", "dragdrop", "dragend"];
    for (var i = 0; i < dragEvents.length; i++) {
        label.addEventListener(dragEvents[i], function (e) {
            this.dispatchEvent(new BiDragEvent(e.getType(), e));
        }, this);
    }
    if (!BiBrowserCheck.ie) label.setHtmlProperty("type", "button");
    this.addEventListener("keydown", this._onKeyDown, this);
    this.addEventListener("keyup", this._onKeyUp, this);
    this.addEventListener(BiComponent.STRING_RESIZE, this._layoutHack);
}
_p = _biExtend(BiButton, BiComponent, "BiButton");
_p._themeKey = BiTheme.KEYS.button;
_p._acceptsEnter = true;
_p._minimumWidth = 67;
_p._minimumHeight = 23;
_p._userWidth = null;
_p._userHeight = null;
_p.invalidateChild = function (oChild, sHint) {
    BiComponent.prototype.invalidateChild.call(this, oChild, sHint);
    if (oChild == this._label) {
        this.invalidateParentLayout(sHint);
    }
};
_p.setBackColor = function (sBackColor) {
    BiComponent.prototype.setBackColor.call(this, sBackColor);
    this.setStyleProperty("backgroundImage", sBackColor != BiString.EMPTY ? "url(none)" : "");
};
_p._onKeyDown = function (e) {
    if (e.matchesBundleShortcut("controls.action")) {
        this._enterSpace = true;
        var tm = application.getThemeManager();
        tm.addState(this, "active");
        tm.applyAppearance(this);
    }
};
_p._onKeyUp = function (e) {
    var tm = application.getThemeManager();
    tm.removeState(this, "active");
    tm.applyAppearance(this);
    if (e.matchesBundleShortcut("controls.action")) {
        if (this._enterSpace) this.dispatchEvent("click");
        this._enterSpace = false;
    }
};
_p._onClick = function () {
    if (this.getIsEnabled()) {
        this.dispatchEvent("action");
        if (this._command) this._command.execute();
    }
};
_p.setPreferredHeight = function (n) {
    BiComponent.prototype.setPreferredHeight.call(this, n);
    this._label.setPreferredHeight(n);
};
_p.setPreferredWidth = function (n) {
    BiComponent.prototype.setPreferredWidth.call(this, n);
    this._label.setPreferredWidth(n);
};
_p._computePreferredWidth = function () {
    if (BiBrowserCheck.moz && BiBrowserCheck.versionNumber < 1.9) {
        return this._label._element.scrollWidth;
    } else {
        return this._label.getPreferredWidth();
    }
};
_p._computePreferredHeight = function () {
    if (BiBrowserCheck.moz && BiBrowserCheck.versionNumber < 1.7 && this._label._tagName == "BUTTON") {
        return this._label._element.scrollHeight;
    } else {
        return this._label.getPreferredHeight();
    }
};
_p.layoutComponent = function () {
    if (this._created) {
        if (this._userWidth == null) this._width = this.getPreferredWidth();
        if (this._userHeight == null) this._height = this.getPreferredHeight();
        this._layoutHack();
        BiComponent.prototype.layoutComponent.call(this);
    }
};
_p._layoutHack = function () {
    var h, ih;
    if (h = this._measuredHeight || this._height) {
        var img = this._label._icon;
        if (img) {
            if (BiBrowserCheck.moz || BiBrowserCheck.webkit) {
                this._label.setStyleProperty("marginTop", "1px");
            } else {
                this._label.setStyleProperty("marginTop", "0px");
            }
            if (this._label._iconPosition == "left" || this._label._iconPosition == "right") {
                if (ih = img._height) {
                    this._label.setStyleProperty("lineHeight", ih + "px");
                }
            }
        }
        this._label._top = (h - this._label.getPreferredHeight()) / 2;
    }
};
_p.setSize = function (nWidth, nHeight) {
    this.setWidth(nWidth);
    this.setHeight(nHeight);
};
_p.setWidth = function (nWidth) {
    this._userWidth = nWidth;
    BiComponent.prototype.setWidth.apply(this, arguments);
};
_p.getWidth = function () {
    return BiComponent.prototype.getWidth.call(this);
};
_p.setHeight = function (nHeight) {
    this._userHeight = nHeight;
    BiComponent.prototype.setHeight.apply(this, arguments);
};
_p.getHeight = function () {
    return BiComponent.prototype.getHeight.call(this);
};
_p.setText = function (sText) {
    this._updateAccessibilityLink();
    this._label.setText(sText);
    this.invalidateParentLayout();
};
_p.setAttribute = function (sName, sValue, oXmlResourceParser) {
    switch (sName) {
        case "labelFor":
        case "font":
        case "padding":
        case "icon":
            this._label.setAttribute(sName, sValue, oXmlResourceParser);
            break;
        default:
            BiComponent.prototype.setAttribute.apply(this, arguments);
    }
};
_p.addXmlNode = function (oNode, oXmlResourceParser) {
    if (oNode.nodeType == 3) this._label.addXmlNode(oNode, oXmlResourceParser);
    else BiComponent.prototype.addXmlNode.apply(this, arguments);
};
BiButton.addProperty("text", BiAccessType.READ);
BiButton.addProperty("html", BiAccessType.READ_WRITE);
BiButton.addProperty("mnemonic", BiAccessType.READ_WRITE);
BiButton.addProperty("align", BiAccessType.READ_WRITE);
BiButton.addProperty("font", BiAccessType.READ_WRITE);
_p.setPadding = function (nLeft, nRight, nTop, nBottom) {
    this._label.setPadding.apply(this._label, arguments);
};
BiButton.addProperty("paddingLeft", BiAccessType.READ_WRITE);
BiButton.addProperty("paddingRight", BiAccessType.READ_WRITE);
BiButton.addProperty("paddingTop", BiAccessType.READ_WRITE);
BiButton.addProperty("paddingBottom", BiAccessType.READ_WRITE);
BiButton.addProperty("icon", BiAccessType.READ_WRITE);
BiButton.addProperty("iconPosition", BiAccessType.READ_WRITE);
BiButton.addProperty("iconTextGap", BiAccessType.READ_WRITE);
BiButton.addProperty("wrap", BiAccessType.READ_WRITE);
BiObject._createDelegates(BiButton.prototype, "_label", [
    ["text", BiAccessType.READ],
    ["html"],
    ["mnemonic"],
    ["overflowX"],
    ["align"],
    ["font"],
    ["paddingLeft"],
    ["paddingRight"],
    ["paddingTop"],
    ["paddingBottom"],
    ["rightToLeft"],
    ["icon"],
    ["iconPosition"],
    ["iconTextGap"],
    ["foreColor"],
    ["backColor"],
    ["wrap"]
]);

function BiRepeatButton(sText) {
    if (_biInPrototype) return;
    BiButton.call(this, sText);
    this._timer = new BiTimer;
    this._timer.setInterval(this._interval);
    this._timer.addEventListener("tick", this._onTick, this);
    this.addEventListener("mousedown", this._onMouseDown);
    this.addEventListener("mouseup", this._onMouseUp);
    this.addEventListener("mouseover", this._onMouseOver);
    this.addEventListener("mouseout", this._onMouseOut);
}
_p = _biExtend(BiRepeatButton, BiButton, "BiRepeatButton");
_p._interval = 100;
_p._firstInterval = 500;
_p._firedAction = false;
BiRepeatButton.addProperty("interval", BiAccessType.READ);
_p.setInterval = function (n) {
    if (this._interval != n) {
        this._interval = n;
        this._timer.setInterval(n);
    }
};
BiRepeatButton.addProperty("firstInterval", BiAccessType.READ_WRITE);
_p._onMouseDown = function (e) {
    if (e.getButton() != BiMouseEvent.LEFT) return;
    this._timer.setInterval(this._firstInterval);
    this._timer.start();
};
_p._onMouseOver = function (e) {
    var tm = new BiThemeManager;
    var state = tm.getCurrentState(this);
    if (state.active) {
        this._timer.setInterval(this._firstInterval);
        this._timer.start();
    }
};
_p._onMouseUp = function (e) {
    if (!this._timer.getEnabled()) return;
    this._timer.stop();
    if (!this._firedAction) {
        this.dispatchEvent("action");
        if (this._command) this._command.execute();
    }
    this._firedAction = false;
};
_p._onMouseOut = function (e) {
};
_p._onTick = function (e) {
    var tm = new BiThemeManager;
    var state = tm.getCurrentState(this);
    if (!state.active) {
        this._timer.stop();
        return;
    }
    var bx = this.getClientLeft();
    var by = this.getClientTop();
    var ex = BiMouseEvent.getClientX();
    var ey = BiMouseEvent.getClientY();
    if (ex < bx || ex > bx + this.getWidth() || ey < by || ey > by + this.getHeight()) {
        tm.removeState(this, "hover");
        tm.removeState(this, "active");
        tm.applyAppearance(this);
        return;
    }
    tm.addState(this, "hover");
    tm.applyAppearance(this);
    this._timer.stop();
    this._timer.setInterval(this._interval);
    this.dispatchEvent("action");
    if (this._command) this._command.execute();
    this._firedAction = true;
    this._timer.start();
};
_p._onClick = function (e) {
    if (!(e instanceof BiMouseEvent) || e.getButton() != BiMouseEvent.LEFT) {
        BiButton.prototype._onClick.call(this, e);
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiButton.prototype.dispose.call(this);
    this._timer.dispose();
    delete this._timer;
};

function BiCheckBox(sText, bChecked) {
    if (_biInPrototype) return;
    BiLabel.call(this, sText);
    this._checkBoxId = this.getHtmlProperty("id") + "-check-box";
    this._checked = Boolean(bChecked);
    this.setHtmlProperty("htmlFor", this._checkBoxId);
    this.setTabIndex(1);
    this.addEventListener("click", this._onclick);
    this.addEventListener("keyup", this._onkeyup);
    if (BiBrowserCheck.quirks.controlProcessMouseDown) this.addEventListener("mousedown", this._clickOnMouseDown);
}
_p = _biExtend(BiCheckBox, BiLabel, "BiCheckBox");
_p._drawIcon = true;
_p._iconTextGap = 5;
_p._acceptsEnter = false;
_p._acceptsEsc = false;
_p._userValue = null;
BiCheckBox.addProperty("userValue", BiAccessType.READ);
_p.setUserValue = function (v) {
    if (this._userValue != v) {
        this._userValue = v;
        if (this._command) {
            this._command.setUserValue(v);
        }
    }
};
_p._clickOnMouseDown = function (e) {
    if (e._event.button == 1) this._onclick(e);
};
_p._getIconHtml = function () {
    var marginSide, blockStyle = "";
    switch (this._iconPosition) {
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
    var bHasText = !(this._html == "" || this._text == "");
    var iconTextGap = bHasText ? this._iconTextGap : 0;
    var enabled = this.getIsEnabled();
    return "<input type=\"checkbox\" tabIndex=\"-1\" class=\"bi-check-box-input\"" + (this._checked ? " checked=\"true\"" : "") + (!enabled ? " disabled=\"true\"" : "") + " id=\"" + this._checkBoxId + "\"" + " style=\"" + blockStyle + "margin-" + marginSide + ":" + iconTextGap + "px;" + (!BiBrowserCheck.ie && (this._iconPosition == "left" || this._iconPosition == "right") ? "position:relative;top:-1px;" : "") + "\">";
};
_p.setLabelFor = _p.getLabelFor = _p.setIcon = _p.getIcon = function () {
    throw new Error("Not supported by BiCheckBox");
};
BiCheckBox.addProperty("checked", BiAccessType.READ);
_p.setChecked = function (bChecked) {
    if (this._checked != bChecked) {
        this._checked = bChecked;
        if (this._input) {
            this._input.checked = bChecked;
            this._input.defaultChecked = bChecked;
        }
        this.dispatchEvent("change");
        if (this._command) this._command.setChecked(this.getChecked());
    }
};
_p.setValue = _p.setChecked;
_p.getValue = _p.getChecked;
_p._setHtml = function () {
    BiLabel.prototype._setHtml.call(this);
    if (this._created) {
        this._input = this._element.getElementsByTagName("INPUT")[0];
        this._input._div = this._element;
        if (BiBrowserCheck.ie) {
            this._element.onclick = BiComponent.__oninlineevent;
        }
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    if (this._element) {
        this._element.onclick = null;
    }
    BiLabel.prototype.dispose.call(this);
    delete this._input;
    delete this._userValue;
    delete this._checked;
    delete this._checkBoxId;
};
_p._onclick = function (e) {
    if (this.getIsEnabled()) {
        var be = e._event;
        var el = be.target || be.srcElement;
        this.setChecked(el == this._input ? this._input.checked : !this._input.checked);
        this._dispatchAction();
    }
};
_p._onkeyup = function (e) {
    if (e.matchesBundleShortcut("controls.toggle")) {
        var be = e._event;
        var el = be.target || be.srcElement;
        if (el == this._input) return;
        this.setChecked(!this._input.checked);
        this._dispatchAction();
    }
};
_p._oninlineevent = function (e) {
    if (BiBrowserCheck.ie) {
        e = this._document.parentWindow.event;
        if (e.type == "click") {
            e.cancelBubble = e.srcElement != this._input;
        } else {
            BiComponent.prototype._oninlineevent.call(this, e);
        }
    } else {
        BiComponent.prototype._oninlineevent.call(this, e);
    }
};
_p._dispatchAction = function () {
    this.dispatchEvent("action");
    if (this._command) {
        this._command.execute();
    }
};
_p._syncWithCommand = function () {
    if (this._command) {
        this.setEnabled(this._command.getEnabled());
        this.setChecked(this._command.getChecked());
        this.setUserValue(this._command.getUserValue());
    }
};

function BiThreeStateCheckBox(sText, bChecked) {
    if (_biInPrototype) return;
    BiCheckBox.call(this, sText, bChecked);
    this.setCssClassName("bi-three-state-check-box");
    this.setAppearance("three-state-check-box");
    if (BiBrowserCheck.quirks.controlProcessMouseDown) this.removeEventListener("mousedown", this._clickOnMouseDown);
}
_p = _biExtend(BiThreeStateCheckBox, BiCheckBox, "BiThreeStateCheckBox");
_p._getIconHtml = function () {
    return "<div class='three-state-checkmark'></div>";
};
_p._setHtml = function () {
    BiLabel.prototype._setHtml.call(this);
};
_p.setChecked = function (b) {
    this._setChecked(Boolean(b));
};
_p._setChecked = function (b) {
    if (this._checked == b) return;
    var tm = application.getThemeManager();
    if (!this._checked) {
        if (this._checked == null) {
            tm.removeState(this, "undetermined");
        } else {
            tm.removeState(this, "checked");
        }
    }
    this._checked = b;
    if (b) {
        tm.addState(this, "checked");
    } else {
        if (b == null) tm.addState(this, "undetermined");
    }
    this.dispatchEvent("change");
};
_p.getIsUndetermined = function () {
    return this._checked == null;
};
_p.makeUndetermined = function () {
    this._setChecked(null);
};
_p._onclick = function (e) {
    if (this.getIsEnabled()) {
        this.setChecked(!this._checked);
        this._dispatchAction();
    }
};
_p._onkeyup = function (e) {
    if (e.matchesBundleShortcut("controls.toggle")) {
        this.setChecked(!this._checked);
        this._dispatchAction();
    }
};
_p._oninlineevent = function (e) {
    BiLabel.prototype._oninlineevent.call(this, e);
};

function BiRadioButton(sText, bChecked) {
    if (_biInPrototype) return;
    BiLabel.call(this, sText);
    this._radioButtonId = this.getHtmlProperty("id") + "-radio-button";
    this._checked = Boolean(bChecked);
    this.setHtmlProperty("htmlFor", this._radioButtonId);
    this.setTabIndex(1);
    this.addEventListener("click", this._onclick);
    this.addEventListener("keydown", this._onkeydown);
    this.addEventListener("keyup", this._onkeyup);
    if (BiBrowserCheck.quirks.controlProcessMouseDown) this.addEventListener("mousedown", this._onclick);
}
_p = _biExtend(BiRadioButton, BiLabel, "BiRadioButton");
_p._drawIcon = true;
_p._iconTextGap = 5;
_p._radioGroup = null;
_p._acceptsEnter = true;
_p._acceptsEsc = false;
_p._userValue = null;
BiRadioButton.addProperty("userValue", BiAccessType.READ);
_p.setUserValue = function (v) {
    if (this._userValue != v) {
        this._userValue = v;
        if (this._command) {
            this._command.setUserValue(v);
        }
    }
};
_p._getIconHtml = function () {
    var marginSide, blockStyle = "";
    switch (this._iconPosition) {
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
    var bHasText = !(this._html == "" || this._text == "");
    var iconTextGap = bHasText ? this._iconTextGap : 0;
    var enabled = this.getIsEnabled();
    var modifyPositionTop = 0;
    if (BiBrowserCheck.webkit) modifyPositionTop = -2;
    else if (BiBrowserCheck.moz && BiBrowserCheck.platform.startsWith("Win")) modifyPositionTop = -1;
    return "<input type=\"radio\" tabIndex=\"-1\" class=\"bi-radio-button-input\"" + (this._checked ? " checked=\"true\"" : "") + (!enabled ? " disabled=\"true\"" : "") + " id=\"" + this._radioButtonId + "\"" + " name=\"" + this._getGroupName() + "\"" + " style=\"" + blockStyle + "margin-" + marginSide + ":" + iconTextGap + "px;" + (modifyPositionTop ? " position:relative; top:" + modifyPositionTop + "px;" : "") + "\">";
};
_p.setLabelFor = _p.getLabelFor = _p.setIcon = _p.getIcon = function () {
    throw new Error("Not supported by BiRadioButton");
};
BiRadioButton.addProperty("checked", BiAccessType.READ);
_p.setChecked = function (bChecked) {
    if (this._checked != bChecked) {
        this._checked = bChecked;
        if (this._input) {
            this._input.checked = bChecked;
            this._input.defaultChecked = bChecked;
        }
        if (this._group && bChecked) this._group.setSelected(this);
        this.dispatchEvent("change");
    }
};
_p.setValue = _p.setChecked;
_p.getValue = _p.getChecked;
BiRadioButton.addProperty("group", BiAccessType.READ);
_p.setGroup = function (oRadioGroup) {
    if (this._group != oRadioGroup) {
        if (this._group) this._group.remove(this);
        this._group = oRadioGroup;
        if (this._group) {
            this._group.add(this);
        }
        this._setHtml();
    }
};
_p._getGroupName = function () {
    return this._group ? this._group._groupName : this._radioButtonId;
};
_p._setHtml = function () {
    BiLabel.prototype._setHtml.call(this);
    if (this._created) {
        this._input = this._element.getElementsByTagName("INPUT")[0];
        this._input._div = this._element;
        if (BiBrowserCheck.ie) {
            this._element.onclick = BiComponent.__oninlineevent;
        }
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    if (this._element) {
        this._element.onclick = null;
    }
    if (this._group) {
        this._group._remove(this);
        this._group = null;
    }
    BiLabel.prototype.dispose.call(this);
    delete this._input;
    delete this._userValue;
    delete this._checked;
    delete this._radioButtonId;
};
_p._onclick = function (e) {
    if (this.getIsEnabled()) {
        var be = e._event;
        var el = be.target || be.srcElement;
        if (el == this._input) {
            this.setChecked(true);
            this.dispatchEvent("action");
        } else {
            this.setChecked(true);
            this.dispatchEvent("action");
        }
    }
};
_p._onkeydown = function (e) {
    if (e.matchesBundleShortcut("controls.accept")) {
        this.setChecked(true);
        this.dispatchEvent("action");
    } else if (this._group && (e.matchesBundleShortcut("selection.up") || e.matchesBundleShortcut("selection.left"))) {
        e.preventDefault();
        this._group.selectPrevious(this);
    } else if (this._group && (e.matchesBundleShortcut("selection.right") || e.matchesBundleShortcut("selection.down"))) {
        e.preventDefault();
        this._group.selectNext(this);
    }
};
_p._onkeyup = function (e) {
    if (e.matchesBundleShortcut("controls.toggle")) {
        var be = e._event;
        var el = be.target || be.srcElement;
        if (el == this._input) return;
        this.setChecked(true);
        this.dispatchEvent("action");
    }
};
_p._oninlineevent = function (e) {
    if (BiBrowserCheck.ie) {
        e = this._document.parentWindow.event;
        if (e.type == "click") {
            e.cancelBubble = e.srcElement != this._input;
        } else {
            BiComponent.prototype._oninlineevent.call(this, e);
        }
    } else {
        BiComponent.prototype._oninlineevent.call(this, e);
    }
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
        case "group":
            if (sValue.charAt(0) == "#") sValue = sValue.substr(1);
            var c = oParser.getComponentById(sValue);
            this.setGroup(c);
            break;
        default:
            BiLabel.prototype.setAttribute.apply(this, arguments);
    }
};
_p._syncWithCommand = function () {
    if (this._command) {
        this.setEnabled(this._command.getEnabled());
        this.setChecked(this._command.getChecked());
        this.setUserValue(this._command.getUserValue());
    }
};

function BiRadioGroup() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._items = [];
    BiRadioGroup._radioGroupCount++;
    this._groupName = BiRadioGroup._radioGroupName + BiRadioGroup._radioGroupCount;
}
BiRadioGroup._radioGroupName = "bi-radio-group-";
BiRadioGroup._radioGroupCount = 0;
_p = _biExtend(BiRadioGroup, BiEventTarget, "BiRadioGroup");
_p._selected = null;
_p._enabled = true;
BiRadioGroup.addProperty("items", BiAccessType.READ);
_p.add = function (oRadioButton) {
    if (this._items.indexOf(oRadioButton) === -1) {
        this._items.push(oRadioButton);
        oRadioButton.setGroup(this);
        if (oRadioButton.getChecked() || this.getUserValue() != null && oRadioButton.getUserValue() == this.getUserValue()) {
            this.setSelected(oRadioButton);
        }
        oRadioButton.setEnabled(this.getEnabled());
    }
};
_p.remove = function (oRadioButton) {
    this._remove(oRadioButton);
    oRadioButton._group = null;
    if (oRadioButton.getChecked()) this.setSelected(null);
};
_p._remove = function (oRadioButton) {
    var i = this._items.indexOf(oRadioButton);
    if (i !== -1) {
        this._items.splice(i, 1);
    }
};
_p.setSelected = function (oRadioButton) {
    if (this._selected != oRadioButton) {
        if (this._selected && !this._selected._disposed) this._selected.setChecked(false);
        this._selected = oRadioButton;
        if (this._selected) this._selected.setChecked(true);
        this.dispatchEvent("change");
        if (this._command) this._command.setUserValue(oRadioButton ? oRadioButton.getUserValue() : null);
    }
};
BiRadioGroup.addProperty("selected", BiAccessType.READ);
_p.selectNext = function (oRadioButton) {
    this._selectAdjacentButton(oRadioButton, 1);
};
_p.selectPrevious = function (oRadioButton) {
    this._selectAdjacentButton(oRadioButton, -1);
};
_p._selectAdjacentButton = function (oRadioButton, nDirection) {
    var i = this._items.indexOf(oRadioButton);
    var i0;
    var l = this._items.length;
    if (i !== -1) {
        i0 = i;
        do {
            i += nDirection + l;
            i %= l;
        } while (!this._items[i].getIsEnabled() && i !== i0);
        var item = this._items[i];
        if (item.getIsEnabled()) {
            this.setSelected(item);
            BiTimer.callOnce(function () {
                item.setFocused(true);
                if (BiBrowserCheck.moz && BiBrowserCheck.versionNumber == 1.8) item._getFocusElement().focus();
            });
        }
    }
};
_p.setEnabled = function (b) {
    if (this._enabled != b) {
        this._enabled = b;
        this._items.forEach(function (item) {
            item.setEnabled(b);
        });
        this.dispatchEvent("enabledchanged");
    }
};
BiRadioGroup.addProperty("enabled", BiAccessType.READ);
_p.getUserValue = function () {
    var s = this.getSelected();
    return s ? s.getUserValue() : null;
};
_p.setUserValue = function (v) {
    if (this.getUserValue() != v) {
        var previousMatch = false;
        this._items.forEach(function (item) {
            var match = item.getUserValue() == v;
            item.setChecked(match && !previousMatch);
            previousMatch = previousMatch || match;
        });
        if (!previousMatch) this._selected = null;
        if (this._command) this._command.setUserValue(v);
    }
};
_p._command = null;
BiRadioGroup.addProperty("command", BiAccessType.READ);
_p.setCommand = function (oCommand) {
    if (this._command != oCommand) {
        if (this._command) {
            this._command.removeEventListener("enabledchanged", this._syncWithCommand, this);
            this._command.removeEventListener("uservaluechanged", this._syncWithCommand, this);
        }
        this._command = oCommand;
        if (this._command) {
            this._syncWithCommand();
            this._command.addEventListener("enabledchanged", this._syncWithCommand, this);
            this._command.addEventListener("uservaluechanged", this._syncWithCommand, this);
        }
    }
};
_p._syncWithCommand = function () {
    if (this._command) {
        this.setEnabled(this._command.getEnabled());
        this.setUserValue(this._command.getUserValue());
    }
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
        case "command":
            if (sValue.charAt(0) == "#") sValue = sValue.substr(1);
            var ref = oParser.getComponentById(sValue);
            this.setProperty(sName, ref);
            break;
        default:
            BiEventTarget.prototype.setAttribute.apply(this, arguments);
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiEventTarget.prototype.dispose.call(this);
    this.setCommand(null);
    this._items.forEach(function (item) {
        item._group = null;
    });
    delete this._items;
    delete this._selected;
    delete this._enabled;
    delete this._groupName;
};

function BiTextField(sText) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    if (sText != null) this._text = String(sText);
    this.setCssClassName("bi-text-field");
    this.setTabIndex(1);
    this.setCanSelect(true);
    this.setHtmlProperty("value", this._text);
    this.setHtmlProperty("type", "text");
    this._setHtmlAttribute("autocomplete", "OFF");
    this.addEventListener("keypress", this._onKeyPress);
    this.addEventListener("keydown", this._onKeyDown);
    this.addEventListener("focus", this._onFocus);
    this.addEventListener("blur", this._onBlur);
    this.setAppearance("text-field");
}
_p = _biExtend(BiTextField, BiComponent, "BiTextField");
_p._tagName = "INPUT";
_p._text = "";
_p._invalidMessage = "";
_p._validator = null;
_p.setText = function (sText) {
    var oldText = this.getText();
    if (oldText != sText) {
        this._text = sText;
        this.setHtmlProperty("value", sText);
        if (this._created) this.dispatchEvent("textchanged");
    }
};
_p.getText = function () {
    if (this.getCreated()) return this._text = this._element.value;
    return this._text;
};
_p.setFont = function (oFont) {
    this._font = oFont;
    oFont.paintFont(this);
};
_p.getFont = function () {
    return this._font ? this._font : new BiFont;
};
_p.setAlign = function (sAlign) {
    this.setStyleProperty("textAlign", sAlign);
};
_p.getAlign = function () {
    return this.getStyleProperty("textAlign");
};
_p.setVerticalAlign = function (sVerticalAlign) {
    this.setStyleProperty("verticalAlign", sVerticalAlign);
};
_p.setMaxLength = function (nMaxLength) {
    this.setHtmlProperty("maxLength", nMaxLength);
};
_p.getMaxLength = function () {
    return this.getHtmlProperty("maxLength");
};
_p.setReadOnly = function (bReadOnly) {
    this.setHtmlProperty("readOnly", bReadOnly);
    var tm = application.getThemeManager();
    tm.setStateValue(this, "read-only", bReadOnly);
    tm.applyAppearance(this);
};
_p.getReadOnly = function () {
    return this.getHtmlProperty("readOnly");
};
BiTextField.addProperty("validator", BiAccessType.READ_WRITE);
BiTextField.addProperty("invalidMessage", BiAccessType.READ_WRITE);
_p.getIsValid = function () {
    if (typeof this._validator != "function") return true;
    return this._validator(this.getText());
};
BiTextField.createRegExpValidator = function (oRegExp) {
    return function (s) {
        return oRegExp.test(s);
    };
};
_p.setSelectionStart = function (nSelectionStart) {
    if (BiBrowserCheck.ie) {
        var s = this._element.value;
        var i = 0;
        var max = nSelectionStart;
        while (i != -1 && i < max) {
            i = s.indexOf("\r\n", i);
            if (i != -1 && i < max) {
                nSelectionStart--;
                i++;
            }
        }
        var r = this._getRange();
        r.collapse();
        r.move("character", nSelectionStart);
        r.select();
    } else {
        if (!this._created) throw new Error("Visual property on non created component");
        this._element.selectionStart = nSelectionStart;
    }
};
_p.getSelectionStart = function () {
    if (BiBrowserCheck.ie) {
        var r = this._getRange();
        var sr = this._getSelectionRange();
        if (!this._element.contains(sr.parentElement())) return -1;
        r.setEndPoint("EndToStart", sr);
        return r.text.length;
    } else {
        if (!this._created) throw new Error("Visual property on non created component");
        return this._element.selectionStart;
    }
};
_p.setSelectionLength = function (nSelectionLength) {
    if (BiBrowserCheck.ie) {
        var sr = this._getSelectionRange();
        if (!this._element.contains(sr.parentElement())) return;
        sr.collapse();
        sr.moveEnd("character", nSelectionLength);
        sr.select();
    } else {
        if (!this._created) throw new Error("Visual property on non created component");
        this._element.selectionEnd = this._element.selectionStart + nSelectionLength;
    }
};
_p.getSelectionLength = function () {
    if (BiBrowserCheck.ie) {
        var sr = this._getSelectionRange();
        if (!this._element.contains(sr.parentElement())) return 0;
        return sr.text.length;
    } else {
        if (!this._created) throw new Error("Visual property on non created component");
        return this._element.selectionEnd - this._element.selectionStart;
    }
};
_p.setSelectionText = function (sText) {
    if (!this._created) throw new Error("Visual property on non created component");
    if (BiBrowserCheck.ie) {
        var r = this._getSelectionRange();
        if (!this._element.contains(r.parentElement())) return;
        var r2 = r.duplicate();
        r.text = sText;
        r.setEndPoint("StartToStart", r2);
        r.select();
    } else {
        var s = this._element.value;
        var selStart = this._element.selectionStart;
        var before = s.substr(0, selStart);
        var after = s.substr(this._element.selectionEnd);
        this._element.value = before + sText + after;
        this._element.selectionStart = selStart;
        this.setSelectionLength(sText.length);
    }
};
_p.getSelectionText = function () {
    if (BiBrowserCheck.ie) {
        var sr = this._getSelectionRange();
        if (!this._element.contains(sr.parentElement())) return "";
        return sr.text;
    } else {
        if (!this._created) throw new Error("Visual property on non created component");
        return this._element.value.substr(this.getSelectionStart(), this.getSelectionLength());
    }
};
_p._getRange = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    return this._element.createTextRange();
};
_p._getSelectionRange = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    return this._document.selection.createRange();
};
_p.selectAll = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    if (BiBrowserCheck.moz) {
        this.setSelectionStart(0);
        this.setSelectionLength(this.getText().length);
    }
    this._element.select();
};
_p._selectOnTabFocus = function () {
    this.selectAll();
};
_p._deselectOnTabBlur = function () {
    if (!this._disposed && this.getIsVisible()) {
        if (BiBrowserCheck.ie) {
            var sr = this._getSelectionRange();
            if (!this._element.contains(sr.parentElement())) {
                return;
            }
            sr.collapse();
            sr.select();
        } else {
        }
    }
};
_p._preferredWidth = 143;
_p._preferredHeight = 22;
_p._computePreferredWidth = function () {
    if (BiBrowserCheck.ie) {
        var r = this._getRange();
        var bcr = r.getBoundingClientRect();
        return bcr.right - bcr.left + this.getInsetLeft() + this.getPaddingLeft() + this.getInsetRight() + this.getPaddingRight();
    } else {
        return this._element.offsetWidth;
    }
};
_p._computePreferredHeight = function () {
    if (BiBrowserCheck.ie) {
        var r = this._getRange();
        var bcr = r.getBoundingClientRect();
        return bcr.bottom - bcr.top + this.getInsetTop() + this.getPaddingTop() + this.getInsetBottom() + this.getPaddingBottom();
    } else {
        return this._element.offsetHeight;
    }
};
_p._allowTab = false;
BiTextField.addProperty("allowTab", BiAccessType.READ_WRITE);
_p.setPadding = function (nLeft, nRight, nTop, nBottom) {
    if (arguments.length == 1) {
        nRight = nTop = nBottom = nLeft;
    } else if (arguments.length == 2) {
        nTop = nBottom = nRight;
        nRight = nLeft;
    }
    this.setPaddingLeft(nLeft);
    this.setPaddingRight(nRight);
    this.setPaddingTop(nTop);
    this.setPaddingBottom(nBottom);
};
_p.setPaddingLeft = function (nPaddingLeft) {
    this.setStyleProperty("paddingLeft", nPaddingLeft + "px");
};
_p.getPaddingLeft = function () {
    return parseInt(this.getStyleProperty("paddingLeft"));
};
_p.setPaddingRight = function (nPaddingRight) {
    this.setStyleProperty("paddingRight", nPaddingRight + "px");
};
_p.getPaddingRight = function () {
    return parseInt(this.getStyleProperty("paddingRight"));
};
_p.setPaddingTop = function (nPaddingTop) {
    this.setStyleProperty("paddingTop", nPaddingTop + "px");
};
_p.getPaddingTop = function () {
    return parseInt(this.getStyleProperty("paddingTop"));
};
_p.setPaddingBottom = function (nPaddingBottom) {
    this.setStyleProperty("paddingBottom", nPaddingBottom + "px");
};
_p.getPaddingBottom = function () {
    return parseInt(this.getStyleProperty("paddingBottom"));
};
_p.dispose = function () {
    if (this._disposed) return;
    if (this._element) {
        if (BiBrowserCheck.moz) {
            this._element.removeEventListener("input", BiComponent.__oninlineevent, false);
        } else {
            this._element.onpropertychange = null;
        }
    }
    BiComponent.prototype.dispose.call(this);
    this._validator = null;
    this._invalidMessage = null;
    if (this._font) this._font.dispose();
    this._font = null;
    this._valueOnFocus = null;
    this._text = null;
};
_p._create = function (oDocument) {
    BiComponent.prototype._create.call(this, oDocument);
    BiTimer.callOnce(function () {
        if (this._disposed) return;
        var focused = this.getFocused();
        if (focused) {
            try {
                var s = this.getSelectionStart();
                var l = this.getSelectionLength();
            } catch (e) {
            }
        }
        this.setHtmlProperty("value", this._text);
        if (focused) {
            this.setSelectionStart(s);
            this.setSelectionLength(l);
        }
        if (typeof this._element.onpropertychange !== "undefined") this._element.onpropertychange = BiComponent.__oninlineevent;
        else BiEvent._addDOMEventListener(this._element, "input", BiComponent.__oninlineevent);
    }, 0, this);
};
_p._oninlineevent = function (e) {
    if (!e) e = this._document.parentWindow.event;
    if (e.type == "propertychange" && e.propertyName == "value" || e.type == "input") {
        if (this._text == this._element.value) return;
        this._text = this._element.value;
        this.dispatchEvent("textchanged");
        this._textchanged = true;
        application.flushLayoutQueue();
    } else {
        BiComponent.prototype._oninlineevent.call(this, e);
    }
};
_p._onKeyPress = function (e) {
    if (e.matchesBundleShortcut("controls.accept")) {
        this.dispatchEvent("action");
        if (this._command) this._command.execute();
    }
    if (this._allowTab && BiBrowserCheck.moz && (e.matchesBundleShortcut("focus.next") || e.matchesBundleShortcut("focus.previous"))) {
        e.preventDefault();
    }
};
_p._onKeyDown = function (e) {
    if (this._allowTab && (e.matchesBundleShortcut("focus.next") || e.matchesBundleShortcut("focus.previous"))) {
        if (BiBrowserCheck.ie) {
            this._getSelectionRange().text = "\t";
        } else {
            var el = this._element;
            var s = el.value;
            var selStart = el.selectionStart;
            var before = s.substr(0, selStart);
            var after = s.substr(el.selectionEnd);
            el.value = before + "\t" + after;
            el.selectionStart = el.selectionEnd = selStart + 1;
        }
        e.preventDefault();
    }
};
_p._onFocus = function (e) {
    this._valueOnFocus = this.getText();
};
_p._onBlur = function (e) {
    if (this.getText() != this._valueOnFocus) this.dispatchEvent("change");
    delete this._valueOnFocus;
};
_p._addHtmlElementToParent = function (oParent, oBefore, bLayout) {
    BiComponent.prototype._addHtmlElementToParent.apply(this, arguments);
    if (BiBrowserCheck.ie) {
        this.addEventListener("keydown", this._ieFirstInputHack1, this);
    }
};
_p._ieFirstInputHack1 = function (e) {
    BiTimer.callOnce(this._ieFirstInputHack2, 1, this);
};
_p._ieFirstInputHack2 = function () {
    if (!this._disposed && this._text != this._element.value) {
        this._text = this._element.value;
        this.dispatchEvent(new BiEvent("textchanged"));
        this.removeEventListener("keydown", this._ieFirstInputHack1, this);
    } else if (this._textchanged) this.removeEventListener("keydown", this._ieFirstInputHack1, this);
};
_p.addXmlNode = function (oNode, oXmlResourceParser) {
    if (oNode.nodeType == 3 && !/^\s*$/.test(oNode.nodeValue)) {
        this.setText(this.getText() + oNode.nodeValue.trim());
    } else {
        BiComponent.prototype.addXmlNode.call(this, oNode, oXmlResourceParser);
    }
};
_p.setAttribute = function (sName, sValue, oXmlResourceParser) {
    switch (sName) {
        case "font":
            if (sValue.charAt(0) == "#") {
                sValue = sValue.substr(1);
                var f = oXmlResourceParser.getComponentById(sValue);
                this.setFont(f);
            } else {
                this.setFont(BiFont.fromString(sValue));
            }
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

function BiIpField(sIp) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-ip-field");
    this.setHideFocus(true);
    this.setSize(120, 22);
    if (sIp && this._validateIp(sIp)) {
        this._ip = sIp.split(".");
        this._texts = sIp.split(".");
    } else {
        this._ip = ["0", "0", "0", "0"];
        this._texts = ["0", "0", "0", "0"];
    }
    this._textFields = [];
    this._fields = [];
    this._activeTextField = null;
    this._createFields();
    if (this._created) this._layoutFields();
    this.setTabIndex(1);
    this.addEventListener("keydown", this._onFieldKeyDown);
    this.addEventListener("focusin", this._onFocusIn);
    this.addEventListener("blur", this._onBlur);
    this.addEventListener("mousedown", this._selectOnClick);
};
_p = _biExtend(BiIpField, BiComponent, "BiIpField");
_p._preferredHeight = 22;
_p._preferredWidth = 120;
_p.getIp = function () {
    return this._ip.join(".");
};
_p.setIp = function (sIp) {
    if (sIp == this.getIp()) return;
    if (this._validateIp(sIp)) {
        this._ip = sIp.split(".");
        this._texts = sIp.split(".");
        this._updateTextFields();
        this.dispatchEvent("textchanged");
    } else this.dispatchEvent("invalidinput");
};
BiIpField.addProperty("textFields", BiAccessType.READ);
_p.setTabIndex = function (tabIndex) {
    BiComponent.prototype.setTabIndex.call(this, tabIndex);
    for (var i = 0; i < this._textFields.length; i++) this._textFields[i].setTabIndex(tabIndex);
};
_p._updateTextFields = function () {
    for (var i = 0; i < this._textFields.length; i++) {
        this._textFields[i].setText(this._ip[i]);
    }
};
_p._validateIp = function (sIp) {
    var re = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    var a = re.exec(sIp);
    return (a && a[1] <= 255 && a[2] <= 255 && a[3] <= 255 && a[4] <= 255);
};
_p._onFieldKeyDown = function (e) {
    if (!this._activeTextField) return;
    var selRight = e.matchesBundleShortcut("selection.right");
    var selLeft = e.matchesBundleShortcut("selection.left");
    var focusNext = e.matchesBundleShortcut("focus.next");
    var focusPrev = e.matchesBundleShortcut("focus.previous");
    var focusChange = focusNext || focusPrev;
    var next;
    var step = focusNext || selRight ? 1 : -1;
    if (focusChange) {
        next = this._textFields[this._textFields.indexOf(this._activeTextField) + step];
        while (next && !next.getIsEnabled()) next = this._textFields[this._textFields.indexOf(next) + step];
    } else if (selRight || selLeft) {
        var selStart = this._activeTextField.getSelectionStart();
        var selLength = this._activeTextField.getSelectionLength();
        var textLength = this._activeTextField.getText().length;
        var atExtreme = selRight ? selStart + selLength >= textLength : selStart == 0;
        if (atExtreme && !e.matchesBundleModifiers("selection.contiguous")) {
            next = this._textFields[this._textFields.indexOf(this._activeTextField) + step];
            while (next && !next.getIsEnabled()) next = this._textFields[this._textFields.indexOf(next) + step];
        }
    }
    if (next || focusChange) {
        if (this._activeTextField.getText() == "") this._activeTextField.setText("0");
    }
    if (next) {
        this._activeTextField = next;
        this._activeTextField.setFocused(true);
        this._activeTextField.setSelectionStart(selLeft ? textLength : 0);
        this._activeTextField.setSelectionLength(focusChange ? this._activeTextField.getText().length : 0);
        this._preventKeyPress = true;
        e.preventDefault();
        this.dispatchEvent("fieldchange");
    }
};
_p._onKeyPress = function (e) {
    if (BiBrowserCheck.moz && this._preventKeyPress) {
        e.preventDefault();
        delete this._preventKeyPress;
    } else if (e.matchesBundleShortcut("controls.accept")) {
        this.dispatchEvent("action");
        if (this._command) this._command.execute();
    } else if (e.getKeyCode() == 46) {
        var next = this._textFields[this._textFields.indexOf(this._activeTextField) + 1];
        while (next && !next.getIsEnabled()) next = this._textFields[this._textFields.indexOf(next) + 1];
        if (next) {
            if (this._activeTextField.getText() == "") this._activeTextField.setText("0");
            this._activeTextField = next;
            this._activeTextField.setFocused(true);
            this._activeTextField.setSelectionStart(0);
            this._activeTextField.setSelectionLength(this._activeTextField.getText().length);
            e.preventDefault();
            this.dispatchEvent("fieldchange");
        }
    }
};
_p._onTextChanged = function (e) {
    var tf = e.getTarget();
    var tft = tf.getText();
    var oldText = this._texts[this._textFields.indexOf(tf)];
    var internalChange = false;
    if (tft == oldText) return;
    var selstart = tf.getSelectionStart();
    if (this._validateIp(tft) && tft != this.getIp()) {
        if (this.getIsEnabled()) {
            this.setIp(tft);
            return;
        } else {
            tf.setText(oldText);
            tf.setSelectionStart(selstart - 1);
            this.dispatchEvent("invalidinput");
            return;
        }
    }
    if (tft.search(/\D/) != -1) {
        tf.setText(oldText);
        tf.setSelectionStart(selstart - 1);
        this.dispatchEvent("invalidinput");
        return;
    }
    if (tft > 255) {
        tf.setText(oldText);
        tf.setSelectionStart(selstart - 1);
        this.dispatchEvent("invalidinput");
        return;
    }
    if (tft != "0" && tft.substring(0, 1) == "0") {
        tft = tft.substring(1);
        internalChange = true;
    }
    if (tft == "") this._ip[this._textFields.indexOf(tf)] = "0";
    else this._ip[this._textFields.indexOf(tf)] = tft;
    this._texts[this._textFields.indexOf(tf)] = tft;
    if (internalChange) tf.setText(tft);
    this.dispatchEvent("textchanged");
};
_p._createFields = function () {
    var c;
    var ipPart = 0;
    this._fields = [];
    this._textFields = [];
    for (var i = 0; i < 7; i++) {
        if (i % 2) {
            c = new BiLabel(".");
        } else {
            c = new BiTextField(this._ip[ipPart++]);
            c.setWidth(25);
            c.setPreferredWidth(25);
            c.setAlign("center");
            c.setAllowTab(false);
            c.setName("part " + String(ipPart));
        }
        if (c instanceof BiTextField) {
            this._textFields.push(c);
            c.addEventListener("keypress", this._onKeyPress, this);
            c.addEventListener("textchanged", this._onTextChanged, this);
        }
        c.setTop(0);
        c.setBottom(0);
        c.setPadding(0, 2);
        this.add(c, null, true);
        this._fields.push(c);
    }
};
_p._destroyFields = function () {
    var c;
    for (var i = 0; i < this._fields.length; i++) {
        c = this._fields[i];
        if (c.getParent()) this.remove(c);
        c.dispose();
    }
    this._fields = null;
    this._textFields = null;
    this._activeTextField = null;
};
_p.layoutAllChildren = function () {
    BiComponent.prototype.layoutAllChildren.call(this);
    this._layoutFields();
};
_p._layoutFields = function () {
    var w;
    var x = this.getClientWidth();
    for (var i = this._fields.length - 1; i >= 0; i--) {
        w = this._fields[i].getPreferredWidth();
        x -= w;
        this._fields[i].setLeft(x);
        this._fields[i].setWidth(w);
    }
};
_p.setFocused = function (bFocused) {
    if (this.getCanFocus()) {
        if (this._activeTextField) this._activeTextField.setFocused(bFocused);
        else this._selectField(0);
    }
};
_p._onFocusIn = function (e) {
    this._valueOnFocus = this.getIp();
};
_p._onBlur = function (e) {
    this._updateTextFields();
    if (this._valueOnFocus != this.getIp()) this.dispatchEvent("change");
    delete this._valueOnFocus;
    this._activeTextField = null;
    for (var i = 0; i < this._textFields.length; i++) {
        this._textFields[i].setSelectionLength(0);
    }
};
_p._selectOnClick = function (e) {
    var fieldIndex = 0;
    for (var i = 0; i < this._fields.length; i++) {
        if (e.getTarget() == this._fields[i]) {
            if (this._fields[i] instanceof BiTextField) fieldIndex = this._textFields.indexOf(this._fields[i]);
            else fieldIndex = this._textFields.indexOf(this._fields[i + 1]);
            break;
        }
    }
    this._selectField(fieldIndex);
};
_p._selectOnTabFocus = function () {
    this._selectField(0);
};
_p._selectField = function (index) {
    this._updateTextFields();
    for (var i = index; i < this._textFields.length; i++) {
        if (this._textFields[i].getIsEnabled()) {
            this._activeTextField = this._textFields[i];
            break;
        }
    }
    if (this._activeTextField) {
        this._activeTextField.setFocused(true);
        this._activeTextField.setSelectionStart(0);
        this._activeTextField.setSelectionLength(this._activeTextField.getText().length);
    }
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiComponent.prototype.dispose.call(this);
    this._destroyFields();
    this._ip = null;
    this._valueOnFocus = null;
    this._texts = null;
};

function BiPasswordField(sText) {
    if (_biInPrototype) return;
    BiTextField.call(this, sText);
    this.setHtmlProperty("type", "password");
}
_p = _biExtend(BiPasswordField, BiTextField, "BiPasswordField");

function BiTextArea(sText) {
    if (_biInPrototype) return;
    BiTextField.call(this, sText);
    this.setOverflow("auto");
    this.removeHtmlProperty("type");
    this.setHeight(50);
}
_p = _biExtend(BiTextArea, BiTextField, "BiTextArea");
_p._tagName = "TEXTAREA";
_p._acceptsEnter = true;
_p._acceptsEsc = false;
_p._preferredWidth = 182;
_p._preferredHeight = 38;
BiTextArea.addProperty("maxLength", BiAccessType.READ_WRITE);
_p._create = function (oDocument) {
    BiTextField.prototype._create.call(this, oDocument);
    this.addEventListener("textchanged", function (e) {
        if (this._maxLength > 0) {
            var overflow = this.getText().length - this._maxLength;
            if (overflow > 0) {
                var self = this;

                function adjustTextLength() {
                    var t = self.getText();
                    var overflow = t.length - self._maxLength;
                    if (overflow <= 0) return;
                    var s = self.getSelectionStart() || overflow;
                    var newtext = t.substring(0, s - overflow) + t.substring(s);
                    if (BiBrowserCheck.ie && newtext.lastIndexOf('\r') == (newtext.length - 1)) {
                        newtext = newtext.substring(0, newtext.length - 1);
                    }
                    self.setText(newtext);
                    self.setSelectionStart(s - overflow);
                    self.setSelectionLength(0);
                }

                if (BiBrowserCheck.ie && this.getSelectionStart() == -1) BiTimer.callOnce(adjustTextLength, 0, this);
                else adjustTextLength();
                e.preventDefault();
            }
            ;
        }
    }, this);
    if (BiBrowserCheck.webkit) {
        this.addEventListener("keypress", function (e) {
            var oThis = this;
            BiTimer.callOnce(function (e) {
                oThis._oninlineevent({
                    type: "input"
                });
            });
        }, this);
    }
};
_p.setWrap = function (bWrap) {
    if (BiBrowserCheck.ie) this.setHtmlProperty("wrap", bWrap ? "soft" : "off");
    else this.setStyleProperty("whiteSpace", bWrap ? "normal" : "nowrap");
};
_p.getWrap = function () {
    if (BiBrowserCheck.ie) return this.getHtmlProperty("wrap") != "off";
    else return this.getStyleProperty("whiteSpace") == "normal";
};
_p._onKeyDown = function (e) {
    if (e.matchesBundleShortcut("controls.cancel")) e.preventDefault();
    BiTextField.prototype._onKeyDown.call(this, e);
};
_p.getSelectionStart = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    if (typeof this._element.selectionStart !== "undefined") return this._element.selectionStart;
    else if (typeof this._document.selection !== "undefined") {
        var r;
        var sr = this._document.selection.createRange();
        if (!this._element.contains(sr.parentElement())) return -1;
        r = sr.duplicate();
        r.moveToElementText(this._element);
        var r2 = sr.duplicate();
        var backwards = -1;
        var l = sr.text.length;
        do {
            if (r2.compareEndPoints("StartToStart", r) == 0) {
                backwards = 0;
                break;
            }
            r2.moveStart("character", -1);
            backwards++;
        } while (r2.text.length == l);
        r.setEndPoint("EndToStart", sr);
        return r.text.length + backwards * 2;
    } else throw new Error("selection range not supported");
};

function BiGroupBox(sText) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setAppearance("group-box");
    this._maybeHideFocus();
    var bg = this._bgComponent = new BiComponent();
    bg.setAppearance("group-box-bg");
    bg._themeKey = BiTheme.KEYS.groupBoxBackground;
    bg.makeThemeAware();
    var tbg = this._titleBg = new BiComponent();
    tbg.setAppearance("group-box-title-bg");
    tbg.makeThemeAware();
    tbg._themeKey = BiTheme.KEYS.groupBoxTitleBackground;
    this._container = new BiComponent;
    this._container.setAppearance("group-box-container");
    this._container.getMinimumHeight = BiGroupBox._container_getMinimumHeight;
    this._headerLeft = new BiComponent;
    this._headerLeft.setAppearance("group-box-header-left");
    this._headerLeft._computePreferredHeight = BiGroupBox._computePreferredHeaderHeight;
    this._headerLeft.getMinimumWidth = BiGroupBox._header_getMinimumWidth;
    this._headerRight = new BiComponent;
    this._headerRight.setAppearance("group-box-header-right");
    this._headerRight._computePreferredHeight = BiGroupBox._computePreferredHeaderHeight;
    this._headerRight.getMinimumWidth = BiGroupBox._header_getMinimumWidth;
    BiComponent.prototype.add.call(this, bg, null, true);
    BiComponent.prototype.add.call(this, tbg, null, true);
    BiComponent.prototype.add.call(this, this._headerLeft, null, true);
    BiComponent.prototype.add.call(this, this._headerRight, null, true);
    BiComponent.prototype.add.call(this, this._container, null, true);
    if (sText != null) this.setText(sText);
}
_p = _biExtend(BiGroupBox, BiComponent, "BiGroupBox");
_p._themeKey = BiTheme.KEYS.groupBox;
_p._groupBoxTitle = null;
_p._titlePosition = "left";
BiGroupBox._computePreferredHeaderHeight = function () {
    return application.getThemeManager().getDefaultTheme().getAppearanceProperty(this.getAppearance(), "preferredHeight") || 2;
};
BiGroupBox._header_getMinimumWidth = function () {
    if (this._minimumWidth != null) return this._minmumWidth;
    return application.getThemeManager().getDefaultTheme().getAppearanceProperty(this.getAppearance(), "minimumWidth") || 7;
};
BiGroupBox._container_getMinimumHeight = function () {
    if (this._minimumHeight != null) return this._minmumHeight;
    return application.getThemeManager().getDefaultTheme().getAppearanceProperty(this.getAppearance(), "minimumHeight") || 2;
};
_p.getGroupBoxTitle = function () {
    return this._groupBoxTitle;
};
_p.setGroupBoxTitle = function (oGroupBoxTitle) {
    if (this._groupBoxTitle && this._groupBoxTitle != oGroupBoxTitle) BiComponent.prototype.remove.call(this, this._groupBoxTitle);
    this._groupBoxTitle = oGroupBoxTitle;
    if (this._groupBoxTitle) {
        BiComponent.prototype.add.call(this, this._groupBoxTitle, this._headerRight, true);
        this._groupBoxTitle.setTitlePosition(this._titlePosition);
    }
    this.invalidateLayout();
};
BiGroupBox.addProperty("titlePosition", BiAccessType.READ);
_p.setTitlePosition = function (s) {
    if (s != this._titlePosition) {
        this._titlePosition = s;
        if (this._groupBoxTitle) this._groupBoxTitle.setTitlePosition(this._titlePosition);
        this.invalidateLayout();
    }
};
_p.setText = function (sText) {
    if (sText == null) {
        this.setGroupBoxTitle(null);
    } else {
        if (this._groupBoxTitle == null) this.setGroupBoxTitle(new BiGroupBoxTitle(sText));
        else this._groupBoxTitle.setText(sText);
    }
};
_p.getText = function () {
    if (this._groupBoxTitle) return this._groupBoxTitle.getText();
    return null;
};
_p.layoutAllChildren = function () {
    var cw = BiComponent.prototype.getClientWidth.call(this);
    var ch = BiComponent.prototype.getClientHeight.call(this);
    var changed;
    var headerPrefHeight = Math.max(this._headerLeft.getPreferredHeight(), this._headerRight.getPreferredHeight());
    if (!this._groupBoxTitle) {
        this._titleBg.setVisible(false);
        var halfWidth = Math.ceil(cw / 2);
        this._layoutChild2(this._headerLeft, 0, 0, halfWidth, headerPrefHeight);
        this._layoutChild2(this._headerRight, halfWidth, 0, cw - halfWidth, headerPrefHeight);
        this._layoutChild2(this._bgComponent, 0, 0, cw, ch);
        changed = this._layoutChild2(this._container, 0, headerPrefHeight, cw, ch - headerPrefHeight);
        if (changed) this._container.invalidateLayout();
    } else {
        this._titleBg.setVisible(true);
        var titlePrefWidth = this._groupBoxTitle.getPreferredWidth();
        var titlePrefHeight = this._groupBoxTitle.getPreferredHeight();
        var leftMinLeft = this._headerLeft.getMinimumWidth();
        var rightMinLeft = this._headerRight.getMinimumWidth();
        var w = Math.max(0, Math.min(cw - leftMinLeft - rightMinLeft, titlePrefWidth));
        var h = Math.max(0, Math.min(ch - this._container.getMinimumHeight(), titlePrefHeight), headerPrefHeight);
        var h2 = h / 2;
        if (this._titlePosition == "center") {
            this._layoutChild2(this._headerLeft, 0, Math.floor(h2), Math.ceil((cw - w) / 2), Math.ceil(h2));
            var x = Math.ceil((cw - w) / 2);
            this._layoutChild2(this._titleBg, x, 0, w, h);
            changed = this._layoutChild2(this._groupBoxTitle, x, 0, w, h);
            if (changed) this._groupBoxTitle.invalidateLayout();
            this._layoutChild2(this._headerRight, cw - Math.floor((cw - w) / 2), Math.floor(h2), Math.floor((cw - w) / 2), Math.ceil(h2));
        } else if (this._titlePosition == "left" || this.getRightToLeft()) {
            this._layoutChild2(this._headerLeft, 0, Math.floor(h2), leftMinLeft, Math.ceil(h2));
            this._layoutChild2(this._titleBg, leftMinLeft, 0, w, h);
            changed = this._layoutChild2(this._groupBoxTitle, leftMinLeft, 0, w, h);
            if (changed) this._groupBoxTitle.invalidateLayout();
            this._layoutChild2(this._headerRight, leftMinLeft + w, Math.floor(h2), cw - leftMinLeft - w, Math.ceil(h2));
        } else {
            this._layoutChild2(this._headerLeft, 0, Math.floor(h2), cw - rightMinLeft - w, Math.ceil(h2));
            this._layoutChild2(this._titleBg, cw - rightMinLeft - w, 0, w, h);
            changed = this._layoutChild2(this._groupBoxTitle, cw - rightMinLeft - w, 0, w, h);
            if (changed) this._groupBoxTitle.invalidateLayout();
            this._layoutChild2(this._headerRight, cw - rightMinLeft, Math.floor(h2), rightMinLeft, Math.ceil(h2));
        }
        this._layoutChild2(this._bgComponent, 0, Math.floor(h2), cw, ch - Math.ceil(h2));
        changed = this._layoutChild2(this._container, 0, h, cw, ch - h);
        if (changed) this._container.invalidateLayout();
    }
};
_p.invalidateChild = function (oChild, sHint) {
    this.invalidateLayout();
    this._invalidateChild(oChild, sHint);
};
_p.add = function (oChild, oBefore, bAnon) {
    this._container.add(oChild, oBefore, bAnon);
};
_p.remove = function (oChild) {
    return this._container.remove(oChild);
};
_p.removeAll = function () {
    return this._container.removeAll();
};
_p.hasChildren = function () {
    return this._container.hasChildren();
};
_p.getChildren = function () {
    return this._container.getChildren();
};
_p.getFirstChild = function () {
    return this._container.getFirstChild();
};
_p.getLastChild = function () {
    return this._container.getLastChild();
};
_p.getOverflow = function () {
    return this._container.getOverflow();
};
_p.getOverflowX = function () {
    return this._container.getOverflowX();
};
_p.getOverflowY = function () {
    return this._container.getOverflowY();
};
_p.getScrollTop = function () {
    return this._container.getScrollTop();
};
_p.getScrollLeft = function () {
    return this._container.getScrollLeft();
};
_p.getScrollWidth = function () {
    return this._container.getScrollWidth();
};
_p.getScrollHeight = function () {
    return this._container.getScrollHeight();
};
_p.getInsetLeft = function () {
    return this._container.getInsetLeft();
};
_p.getInsetRight = function () {
    return this._container.getInsetRight();
};
_p.getInsetBottom = function () {
    return this._container.getInsetBottom();
};
_p.setOverflow = function (v) {
    this._container.setOverflow(v);
};
_p.setOverflowX = function (v) {
    this._container.setOverflowX(v);
};
_p.setOverflowY = function (v) {
    this._container.setOverflowY(v);
};
_p.setScrollTop = function (v) {
    this._container.setScrollTop(v);

};
_p.setScrollLeft = function (v) {
    this._container.setScrollLeft(v);
};
_p.getInsetTop = function () {
    if (this._groupBoxTitle) return this._groupBoxTitle.getPreferredHeight();
    return Math.max(this._headerLeft.getPreferredHeight(), this._headerRight.getPreferredHeight());
};
_p.setBorder = function (b) {
    if (this._border) {
        if (this._topLeftBorder) this._topLeftBorder.removeBorder(this._headerLeft);
        if (this._topRightBorder) this._topRightBorder.removeBorder(this._headerRight);
        if (this._containerBorder) this._containerBorder.removeBorder(this._container);
    }
    this._border = b;
    if (b) {
        var tlb = new BiBorder;
        tlb.setTop(b.getTopWidth(), b.getTopStyle(), b.getTopColor());
        tlb.setLeft(b.getLeftWidth(), b.getLeftStyle(), b.getLeftColor());
        this._topLeftBorder = tlb;
        var trb = new BiBorder;
        trb.setTop(b.getTopWidth(), b.getTopStyle(), b.getTopColor());
        trb.setRight(b.getRightWidth(), b.getRightStyle(), b.getRightColor());
        this._topRightBorder = trb;
        var cb = new BiBorder;
        cb.setLeft(b.getLeftWidth(), b.getLeftStyle(), b.getLeftColor());
        cb.setRight(b.getRightWidth(), b.getRightStyle(), b.getRightColor());
        cb.setBottom(b.getBottomWidth(), b.getBottomStyle(), b.getBottomColor());
        this._containerBorder = cb;
    } else {
        this._topLeftBorder = this._topRightBorder = this._containerBorder = null;
    }
    this._headerLeft.setBorder(this._topLeftBorder);
    this._headerRight.setBorder(this._topRightBorder);
    this._container.setBorder(this._containerBorder);
    this._invalidatePreferredOrActualSize();
    this.invalidateLayout();
};
_p._computePreferredHeaderHeight = function () {
    if (this._preferredHeight != null) return this._preferredHeight;
    return this._container.getPreferredHeight();
};
_p._computePreferredWidth = function () {
    return this._container.getPreferredWidth();
};
_p.onThemeChanged = function (e) {
    BiComponent.prototype.onThemeChanged.call(this, e);
    this._maybeHideFocus();
};
_p._maybeHideFocus = function () {
    this.setHideFocus(application.getThemeManager().getDefaultTheme().getAppearanceProperty("group-box", "hide-focus"));
};

function BiGroupBoxTitle(sText) {
    if (_biInPrototype) return;
    BiLabel.call(this, sText);
    this.setAppearance("group-box-title");
}
_p = _biExtend(BiGroupBoxTitle, BiLabel, "BiGroupBoxTitle");
_p._titlePosition = "left";
_p.setTitlePosition = function (s) {
    if (s != this._titlePosition) {
        this._titlePosition = s;
        if (this._parent instanceof BiGroupBox) this._parent.setTitlePosition(s);
    }
};
BiGroupBoxTitle.addProperty("titlePosition", BiAccessType.READ);

function BiRangeModel() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
}
_p = _biExtend(BiRangeModel, BiEventTarget, "BiRangeModel");
_p._value = 0;
_p._minimum = 0;
_p._maximum = 100;
_p._extent = 0;
_p._isChanging = false;
BiRangeModel.addProperty("value", BiAccessType.READ);
_p.setValue = function (nValue) {
    nValue = Math.floor(nValue);
    if (this._value != nValue) {
        if (nValue + this._extent > this._maximum) this._value = this._maximum - this._extent;
        else if (nValue < this._minimum) this._value = this._minimum;
        else this._value = nValue;
        if (!this._isChanging) this.dispatchEvent("change");
    }
};
BiRangeModel.addProperty("maximum", BiAccessType.READ);
_p.setMaximum = function (nMaximum) {
    nMaximum = Math.floor(nMaximum);
    if (this._maximum != nMaximum) {
        var oldIsChanging = this._isChanging;
        this._isChanging = true;
        this._maximum = nMaximum;
        if (nMaximum < this._value) this.setValue(nMaximum - this._extent);
        if (nMaximum < this._minimum) {
            this._extent = 0;
            this.setMinimum(nMaximum);
            this.setValue(nMaximum);
        }
        if (nMaximum < this._minimum + this._extent) this._extent = this._maximum - this._minimum;
        if (nMaximum < this._value + this._extent) this._extent = this._maximum - this._value;
        this._isChanging = oldIsChanging;
        if (!this._isChanging) this.dispatchEvent("change");
    }
};
BiRangeModel.addProperty("minimum", BiAccessType.READ);
_p.setMinimum = function (nMinimum) {
    nMinimum = Math.floor(nMinimum);
    if (this._minimum != nMinimum) {
        var oldIsChanging = this._isChanging;
        this._isChanging = true;
        this._minimum = nMinimum;
        if (nMinimum > this._value) this.setValue(nMinimum);
        if (nMinimum > this._maximum) {
            this._extent = 0;
            this.setMaximum(nMinimum);
            this.setValue(nMinimum);
        }
        if (nMinimum + this._extent > this._maximum) this._extent = this._maximum - this._minimum;
        this._isChanging = oldIsChanging;
        if (!this._isChanging) this.dispatchEvent("change");
    }
};
BiRangeModel.addProperty("extent", BiAccessType.READ);
_p.setExtent = function (nExtent) {
    nExtent = Math.floor(nExtent);
    if (this._extent != nExtent) {
        if (nExtent < 0) this._extent = 0;
        else if (this._value + nExtent > this._maximum) this._extent = this._maximum - this._value;
        else this._extent = nExtent;
        if (!this._isChanging) this.dispatchEvent("change");
    }
};

function BiProgressBar(nValue) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-progress-bar");
    this.setAppearance("progress-bar");
    this._rangeModel = new BiRangeModel();
    if (nValue) this.setValue(nValue);
    this._rangeModel.addEventListener("change", this._onchange, this);
}
_p = _biExtend(BiProgressBar, BiComponent, "BiProgressBar");
_p._preferredHeight = 16;
_p._preferredWidth = 200;
_p.setValue = function (nValue) {
    this._rangeModel.setValue(nValue);
};
_p.getValue = function () {
    return this._rangeModel.getValue();
};
_p.setMaximum = function (nMaximum) {
    this._rangeModel.setMaximum(nMaximum);
};
_p.getMaximum = function () {
    return this._rangeModel.getMaximum();
};
_p.setMinimum = function (nMinimum) {
    this._rangeModel.setMinimum(nMinimum);
};
_p.getMinimum = function () {
    return this._rangeModel.getMinimum();
};
_p._layoutThumb = function () {
    if (this._thumb) {
        this._thumb.style.width = 100 * (this.getValue() - this.getMinimum()) / (this.getMaximum() - this.getMinimum()) + "%";
    }
};
_p._create = function (oDocument) {
    BiComponent.prototype._create.call(this, oDocument);
    this._thumb = this._document.createElement("DIV");
    this._thumb.className = "bi-progress-bar-thumb progress-bar-thumb";
    this._element.insertBefore(this._thumb, this._element.firstChild);
    this._layoutThumb();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._rangeModel.dispose();
    this._rangeModel = null;
    if (this._thumb) this._thumb.style.filter = "none";
    this._thumb = null;
};
_p._onchange = function () {
    this._layoutThumb();
    this.dispatchEvent("change");
};

function BiUndeterminedProgressBar() {
    if (_biInPrototype) return;
    BiProgressBar.call(this);
    this._rangeModel.setMaximum(50);
    this.addEventListener("create", this._layoutThumb);
};
_p = _biExtend(BiUndeterminedProgressBar, BiProgressBar, "BiUndeterminedProgressBar");
_p._started = false;
_p._ANIM_DELAY = 50;
_p.layoutComponent = function () {
    this._layoutThumb();
    return BiProgressBar.prototype.layoutComponent.call(this);
};
_p._layoutThumb = function () {
    if (this.getCreated()) {
        var max = this.getMaximum();
        var min = this.getMinimum();
        var size = max - min;
        var v = (this.getValue() - min) / size;
        var w = 0.3;
        var left, right, width;
        if (v <= 0.5) {
            right = (v * 2) * (1 + w);
            left = right - w;
            this._thumb.className = "bi-progress-bar-thumb progress-bar-thumb";
        } else {
            left = 1 - (1 + w) * 2 * (v - 0.5);
            right = left + w;
            this._thumb.className = "bi-progress-bar-reverse-thumb progress-bar-reverse-thumb";
        }
        left = Math.max(0, Math.min(1, left));
        right = Math.max(0, Math.min(1, right));
        width = right - left;
        var cw = this.getClientWidth();
        this._thumb.style.marginLeft = Math.round(left * cw) + "px";
        this._thumb.style.width = Math.round(width * cw) + "px";
    }
};
_p._ontick = function (e) {
    if (!this._started) return;
    if (this.getValue() == this.getMaximum()) this.setValue(this.getMinimum());
    else this.setValue(this.getValue() + 1);
    BiTimer.callOnce(this._ontick, this._ANIM_DELAY, this);
};
_p.start = function () {
    this._started = true;
    this._ontick();
};
_p.stop = function () {
    this._started = false;
};
_p.getStarted = function () {
    return this._started;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiProgressBar.prototype.dispose.call(this);
};

function BiSlider(sOrientation) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-slider");
    this._rangeModel = new BiRangeModel();
    this._line = new BiComponent;
    this._line.setCssClassName("bi-slider-line");
    this._line.setAppearance("slider-line");
    this.add(this._line);
    this._thumb = new BiComponent;
    this._thumb.setCssClassName("bi-slider-thumb");
    this._thumb.setAppearance("slider-thumb");
    this.add(this._thumb);
    this._orientation = null;
    this.setOrientation(sOrientation || "horizontal");
    if (this._orientation == "horizontal") this.setSize(200, 22);
    else this.setSize(22, 200);
    this.setTabIndex(1);
    this._timer = new BiTimer;
    this._timer.setInterval(100);
    this._rangeModel.addEventListener("change", this._onchange, this);
    this.addEventListener("mousedown", this._onmousedown);
    this.addEventListener("mousewheel", this._onmousewheel);
    if (BiBrowserCheck.quirks.doesNotRepeatArrowKeysOnKeyDown) this.addEventListener("keypress", this._onkeydown);
    else this.addEventListener("keydown", this._onkeydown);
    this._timer.addEventListener("tick", this._ontick, this);
    this.addEventListener("focus", this._onfocus);
    this.addEventListener("blur", this._onblur);
    this.setHideFocus(true);
}
_p = _biExtend(BiSlider, BiComponent, "BiSlider");
_p._blockIncrement = 10;
_p._unitIncrement = 1;
_p._tickIncrease = null;
_p.setEnabled = function (b) {
    if (this._enabled != b) {
        BiComponent.prototype.setEnabled.call(this, b);
        if (b) {
            this._thumb.setAppearance("slider-thumb");
            this._line.setAppearance("slider-line");
        } else {
            this._thumb.setAppearance("slider-thumb slider-thumb-disabled");
            this._line.setAppearance("slider-line slider-line-disabled");
        }
    }
};
BiSlider.addProperty("orientation", BiAccessType.READ);
_p.setOrientation = function (sOrientation) {
    if (this._orientation != sOrientation) {
        this._orientation = sOrientation;
        this.setAppearance("slider-" + sOrientation);
        if (sOrientation == "horizontal") {
            this._line.setLeft(0);
            this._line.setRight(0);
            this._line.setBottom(null);
        } else {
            this._line.setTop(0);
            this._line.setBottom(0);
            this._line.setRight(null);
        }
        this._layoutLine();
        this._layoutThumb();
    }
};
_p._computePreferredWidth = function () {
    return this._orientation == "horizontal" ? 200 : 22;
};
_p._computePreferredHeight = function () {
    return this._orientation == "horizontal" ? 22 : 200;
};
_p.setValue = function (nValue) {
    if (nValue >= this.getMaximum()) {
        this._rangeModel.setValue(nValue);
    } else {
        var m = nValue % this._unitIncrement;
        nValue -= m;
        if (2 * m > this._unitIncrement) nValue += this._unitIncrement;
        this._rangeModel.setValue(nValue);
    }
};
_p.getValue = function () {
    return this._rangeModel.getValue();
};
_p.setMaximum = function (nMaximum) {
    this._rangeModel.setMaximum(nMaximum);
};
_p.getMaximum = function () {
    return this._rangeModel.getMaximum();
};
_p.setMinimum = function (nMinimum) {
    this._rangeModel.setMinimum(nMinimum);
};
_p.getMinimum = function () {
    return this._rangeModel.getMinimum();
};
_p.layoutAllChildren = function () {
    this._layoutThumb();
    this._layoutLine();
    BiComponent.prototype.layoutAllChildren.call(this);
};
_p._layoutLine = function () {
    if (this._created) {
        if (this._orientation == "horizontal") {
            this._line.setTop((this.getClientHeight() - this._line.getHeight()) / 2);
        } else {
            this._line.setLeft((this.getClientWidth() - this._line.getWidth()) / 2);
        }
    }
};
_p._layoutThumb = function () {
    if (this._created) {
        if (this._orientation == "horizontal") {
            this._thumb.setLeft((this.getValue() - this.getMinimum()) / (this.getMaximum() - this.getMinimum()) * (this.getClientWidth() - this._thumb.getWidth()));
            this._thumb.setTop((this.getClientHeight() - this._thumb.getHeight()) / 2);
        } else {
            this._thumb.setLeft((this.getClientWidth() - this._thumb.getWidth()) / 2);
            this._thumb.setTop((this.getClientHeight() - this._thumb.getHeight()) * (1 - (this.getValue() - this.getMinimum()) / (this.getMaximum() - this.getMinimum())));
        }
    }
};
BiSlider.addProperty("unitIncrement", BiAccessType.READ_WRITE);
BiSlider.addProperty("blockIncrement", BiAccessType.READ_WRITE);
_p._onmousedown = function (e) {
    if (e.getButton() != BiMouseEvent.LEFT) {
        return;
    }
    this.addEventListener("mousemove", this._onmousemove);
    this.addEventListener("mouseup", this._onmouseup);
    this.addEventListener("losecapture", this._onmouseup);
    this.setCapture(true);
    if (this.getCanFocus()) this.setFocused(true);
    if (e.getTarget() == this._thumb) {
        this._dragData = {
            screenX: e.getScreenX(),
            screenY: e.getScreenY(),
            dx: e.getScreenX() - this._thumb.getLeft(),
            dy: e.getScreenY() - this._thumb.getTop(),
            startValue: this.getValue()
        };
    } else {
        this._timer.start();
    }
};
_p._onmousemove = function (e) {
    if (this._dragData) {
        var size, pos, reset;
        if (this._orientation == "horizontal") {
            size = this.getClientWidth() - this._thumb.getWidth();
            pos = e.getScreenX() - this._dragData.dx;
            reset = Math.abs(e.getScreenY() - this._dragData.screenY) > 100;
        } else {
            size = this.getClientHeight() - this._thumb.getHeight();
            pos = size - (e.getScreenY() - this._dragData.dy);
            reset = Math.abs(e.getScreenX() - this._dragData.screenX) > 100;
        }
        this.setValue(reset ? this._dragData.startValue : this.getMinimum() + (this.getMaximum() - this.getMinimum()) * pos / size);
    } else {
    }
};
_p._onmouseup = function (e) {
    this.removeEventListener("mousemove", this._onmousemove);
    this.removeEventListener("mouseup", this._onmouseup);
    this.removeEventListener("losecapture", this._onmouseup);
    this.setCapture(false);
    if (this._dragData) {
        this._dragData = null;
    } else {
        this._timer.stop();
        this._tickIncrease = null;
    }
};
_p._onkeydown = function (e) {
    var horiz = this.getOrientation() == "horizontal";
    var moveAmounts = {
        "selection.page.previous": "+getBlockIncrement",
        "selection.page.next": "-getBlockIncrement",
        "selection.first": horiz ? "getMinimum" : "getMaximum",
        "selection.last": horiz ? "getMaximum" : "getMinimum",
        "selection.up": "+getUnitIncrement",
        "selection.right": "+getUnitIncrement",
        "selection.down": "-getUnitIncrement",
        "selection.left": "-getUnitIncrement"
    };
    for (var n in moveAmounts) {
        if (e.matchesBundleShortcut(n)) {
            var amount = moveAmounts[n];
            var add = amount.charAt(0) == "+",
                subtract = amount.charAt(0) == "-";
            amount = this[add || subtract ? amount.substring(1) : amount]();
            this.setValue(add ? this.getValue() + amount : subtract ? this.getValue() - amount : amount);
            e.preventDefault();
        }
    }
};
_p._onmousewheel = function (e) {
    this.setValue(this.getValue() + e.getWheelDelta() * this.getUnitIncrement());
    if (this.getContainsFocus()) {
        e.preventDefault();
    }
};
_p._ontick = function (e) {
    if (this._orientation == "horizontal") {
        var mouseX = BiMouseEvent.getClientX() - this.getClientLeft();
        var l = this._thumb.getLeft();
        var w = this._thumb.getWidth();
        if (mouseX < l && this._tickIncrease != true) {
            this.setValue(this.getValue() - this.getBlockIncrement());
            this._tickIncrease = false;
        } else if (mouseX > l + w && this._tickIncrease != false) {
            this.setValue(this.getValue() + this.getBlockIncrement());
            this._tickIncrease = true;
        }
    } else {
        var mouseY = BiMouseEvent.getClientY() - this.getClientTop();
        var t = this._thumb.getTop();
        var h = this._thumb.getHeight();
        if (mouseY < t && this._tickIncrease != false) {
            this.setValue(this.getValue() + this.getBlockIncrement());
            this._tickIncrease = true;
        } else if (mouseY > t + h && this._tickIncrease != true) {
            this.setValue(this.getValue() - this.getBlockIncrement());
            this._tickIncrease = false;
        }
    }
};
_p._onchange = function (e) {
    this._layoutThumb();
    this.dispatchEvent("change");
};
_p._onfocus = function (e) {
    this._thumb.setAppearance("slider-thumb slider-thumb-focused");
};
_p._onblur = function (e) {
    this._thumb.setAppearance("slider-thumb");
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this.disposeFields("_rangeModel", "_line", "_thumb", "_orientation", "_timer");
};

function BiSpinner() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-spinner");
    this.setAppearance("combo-box");
    this.setSize(50, 22);
    this._rangeModel = new BiRangeModel();
    this._upButton = new BiButton;
    this._upButton.setCssClassName("bi-button bi-spinner-up-button");
    this._upButton.setTabIndex(-1);
    this._upButton._themeKey = BiTheme.KEYS.spinnerButton;
    var arrowImg = new BiComponent;
    arrowImg.setAppearance("spinner-up-arrow");
    this._upButton.add(arrowImg, null, true);
    this.add(this._upButton, null, true);
    this._downButton = new BiButton;
    this._downButton.setCssClassName("bi-button bi-spinner-down-button");
    this._downButton.setTabIndex(-1);
    this._downButton._themeKey = BiTheme.KEYS.spinnerButton;
    arrowImg = new BiComponent;
    arrowImg.setAppearance("spinner-down-arrow");
    this._downButton.add(arrowImg, null, true);
    this.add(this._downButton, null, true);
    this._textField = new BiTextField;
    this._textField.setMaxLength(3);
    this._textField.setText("0");
    this.add(this._textField, null, true);
    this._upButton.setWidth(16);
    this._upButton.setTop(0);
    this._downButton.setWidth(16);
    this._downButton.setBottom(0);
    this._textField.setTop(0);
    this._textField.setBottom(0);
    this._positionComponents();
    this._timer = new BiTimer;
    this._timer.setInterval(this._interval);
    this.setTabIndex(1);
    this._textField.setTabIndex(0);
    this.addEventListener("keypress", this._onkeypress, this);
    this.addEventListener("keydown", this._onkeydown, this);
    this.addEventListener("keyup", this._onkeyup, this);
    this._upButton.addEventListener("mousedown", this._onmousedown, this);
    this._downButton.addEventListener("mousedown", this._onmousedown, this);
    this._rangeModel.addEventListener("change", this._onchange, this);
    this._timer.addEventListener("tick", this._ontick, this);
    this._textField.addEventListener("textchanged", this._ontextchanged, this);
    this._textField.addEventListener("mousewheel", this._onmousewheel, this);
    this.addEventListener("blur", this._onblur);
}
_p = _biExtend(BiSpinner, BiComponent, "BiSpinner");
_p._tickIncrease = null;
_p._incrementAmount = 1;
_p._interval = 100;
_p._firstInterval = 500;
_p._preferredHeight = 22;
_p.setValue = function (nValue) {
    this._rangeModel.setValue(nValue);
    if (nValue < this._rangeModel.getValue() || nValue > this._rangeModel.getValue()) {
        this.dispatchEvent("invalidvalue");
    }
};
_p.getValue = function () {
    this._ensureValidValue();
    return this._rangeModel.getValue();
};
_p.setMaximum = function (nMaximum) {
    this._rangeModel.setMaximum(nMaximum);
};
_p.getMaximum = function () {
    return this._rangeModel.getMaximum();
};
_p.setMinimum = function (nMinimum) {
    this._rangeModel.setMinimum(nMinimum);
};
_p.getMinimum = function () {
    return this._rangeModel.getMinimum();
};
_p.layoutAllChildren = function () {
    BiComponent.prototype.layoutAllChildren.call(this);
    this._layoutSpinnerButtons();
};
_p._layoutSpinnerButtons = function () {
    var h = this.getClientHeight();
    this._upButton.setHeight(Math.ceil(h / 2));
    this._downButton.setHeight(Math.floor(h / 2));
};
_p.getPreferredWidth = function () {
    var pw = Math.max(this._textField.getPreferredWidth(), this._textField.getMaxLength() * 9);
    var labelW = this._textField.getLeft() + pw - (this.getRightToLeft() ? 16 : 0);
    return labelW + 5 + 16;
};
_p.getPreferredHeight = function () {
    return this._textField.getPreferredHeight();
};
_p.setFont = function (oFont) {
    this._textField.setFont(oFont);
};
_p.getFont = function () {
    return this._textField.getFont();
};
_p.setAlign = function (sAlign) {
    this._textField.setAlign(sAlign);
};
_p.getAlign = function () {
    return this._textField.getAlign();
};
_p._getFocusElement = function () {
    return this._textField._element;
};
_p.setEnabled = function (b) {
    BiComponent.prototype.setEnabled.call(this, b);
    this._upButton.setEnabled(b);
    this._downButton.setEnabled(b);
    this._textField.setEnabled(b);
};
_p._selectOnTabFocus = function () {
    this._textField.selectAll();
};
_p.setRightToLeft = function (b) {
    BiComponent.prototype.setRightToLeft.call(this, b);
    this._positionComponents();
    this._textField.setAlign(this.getRightToLeft() ? "left" : "right");
};
_p._positionComponents = function () {
    if (this.getRightToLeft()) {
        this._upButton.setRight(null);
        this._upButton.setLeft(0);
        this._downButton.setRight(null);
        this._downButton.setLeft(0);
        this._textField.setRight(0);
        this._textField.setLeft(16);
    } else {
        this._upButton.setLeft(null);
        this._upButton.setRight(0);
        this._downButton.setLeft(null);
        this._downButton.setRight(0);
        this._textField.setLeft(0);
        this._textField.setRight(16);
    }
};
_p._onkeypress = function (e) {
    if (e.matchesBundleShortcut("controls.accept")) {
        this._ensureValidValue();
        this._textField.selectAll();
        this.dispatchEvent("action");
        if (this._command) this._command.execute();
    } else BiSpinner.filterInput(this, e);
};
BiSpinner.filterInput = function (oTarget, e) {
    var kc = e.getKeyCode();
    if (BiBrowserCheck.moz && e.matchesBundleShortcut("focus.next") || e.matchesBundleShortcut("focus.previous")) return;
    if (kc < 48 || kc > 57) {
        var modifiers = e.getKeystroke().getModifiers();
        if (!BiKeystroke._flagsExcept(BiKeystroke.MODIFIER_FLAGS.SHIFT, modifiers)) {
            e.preventDefault();
            oTarget.dispatchEvent("invalidcharacter");
        }
    }
};
_p._onkeydown = function (e) {
    if (this._tickIncrease == null && (e.matchesBundleShortcut("selection.up") || e.matchesBundleShortcut("selection.down"))) {
        if (e.matchesBundleShortcut("selection.down")) {
            if (!this._decreaseAllowed()) {
                this.dispatchEvent("invalidvalue");
                return;
            }
        }
        if (e.matchesBundleShortcut("selection.up")) {
            if (!this._increaseAllowed()) {
                this.dispatchEvent("invalidvalue");
                return;
            }
        }
        this._tickIncrease = e.matchesBundleShortcut("selection.up");
        this._resetIncrements();
        this._ensureValidValue();
        this._increment();
        this._timer.setInterval(this._firstInterval);
        this._timer.start();
    }
};
_p._onkeyup = function (e) {
    if (this._tickIncrease != null && (e.matchesBundleShortcut("selection.up") || e.matchesBundleShortcut("selection.down"))) {
        this._timer.stop();
        this._tickIncrease = null;
    }
};
_p._decreaseAllowed = function () {
    var min = this._rangeModel.getMinimum();
    var ext = Math.max(this._rangeModel.getExtent(), 1);
    var val = this._rangeModel.getValue();
    return (val - ext) >= min;
};
_p._increaseAllowed = function () {
    var max = this._rangeModel.getMaximum();
    var ext = Math.max(this._rangeModel.getExtent(), 1);
    var val = this._rangeModel.getValue();
    return (val + ext) <= max;
};
_p._onmousedown = function (e) {
    if (e.getButton() != BiMouseEvent.LEFT) return;
    var b = e.getCurrentTarget();
    if (b == this._downButton) {
        if (!this._decreaseAllowed()) {
            this.dispatchEvent("invalidvalue");
            return;
        }
    } else if (b == this._upButton) {
        if (!this._increaseAllowed()) {
            this.dispatchEvent("invalidvalue");
            return;
        }
    }
    this._ensureValidValue();
    b.addEventListener("mouseup", this._onmouseup, this);
    b.addEventListener("mouseout", this._onmouseup, this);
    this._tickIncrease = b == this._upButton;
    this._resetIncrements();
    this._increment();
    this._textField.selectAll();
    this._timer.setInterval(this._firstInterval);
    this._timer.start();
};
_p._onmouseup = function (e) {
    var b = e.getCurrentTarget();
    b.removeEventListener("mouseup", this._onmouseup, this);
    b.removeEventListener("mouseout", this._onmouseup, this);
    this._textField.selectAll();
    this._textField.setFocused(true);
    this._timer.stop();
    this._tickIncrease = null;
};
_p._onmousewheel = function (e) {
    if (!this.getFocused()) return;
    var delta = e.getWheelDelta();
    this._tickIncrease = delta > 0;
    this._ensureValidValue();
    this._increment();
    if (this.getContainsFocus()) {
        e.preventDefault();
    }
};
_p._onchange = function (e) {
    var max = Math.ceil(Math.log(this.getMaximum() + 1) / Math.LN10);
    var val = this._rangeModel.getValue();
    if (BiBrowserCheck.webkit && val < 0) max++;
    this._textField.setMaxLength(max);
    this._textField.setText(String(val));
    this.dispatchEvent("change");
};
_p._ontextchanged = function (e) {
    this.dispatchEvent("textchanged");
};
_p._onblur = function (e) {
    this._ensureValidValue();
};
_p._ontick = function (e) {
    this._timer.stop();
    this._interval = Math.max(20, this._interval - 2);
    if (this._interval == 20) this._incrementAmount = 1.01 * this._incrementAmount;
    this._increment();
    this._timer.setInterval(this._interval);
    this._timer.start();
};
_p._ontextfieldfocuschanged = function (e) {
    this.dispatchEvent(new BiEvent(e.getType()));
};
_p._ensureValidValue = function () {
    var v = parseInt(this._textField.getText());
    var oldValue = v;
    if (!isNaN(v)) {
        this._rangeModel.setValue(v);
    }
    v = this._rangeModel.getValue();
    if (String(v) != this._textField.getText()) {
        this._textField.setText(String(v));
    }
    if (oldValue > this._rangeModel.getMaximum() || oldValue < this._rangeModel.getMinimum()) {
        this.dispatchEvent("invalidvalue");
    }
};
_p._increment = function () {
    this._rangeModel.setValue(this._rangeModel.getValue() + (this._tickIncrease ? 1 : -1) * this._incrementAmount);
};
_p._resetIncrements = function () {
    this._incrementAmount = BiSpinner.prototype._incrementAmount;
    this._interval = BiSpinner.prototype._interval;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this.disposeFields("_rangeModel", "_upButton", "_downButton", "_textField", "_timer");
};

function BiScrollBar(sOrientation) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-scroll-bar");
    this.setAppearance("scroll-bar-horizontal");
    this._unitDecButton = new BiRepeatButton();
    this._unitDecButton.setHideFocus(true);
    this._unitDecButton.addEventListener("action", this._onUnitDec, this);
    this._unitDecButton.setCssClassName("bi-scroll-bar-button");
    this._unitDecButton.setAppearance("scroll-bar-dec-button");
    this._unitDecButton._themeKey = BiTheme.KEYS.scrollbarDecButton;
    this.add(this._unitDecButton);
    this._unitIncButton = new BiRepeatButton();
    this._unitIncButton.setHideFocus(true);
    this._unitIncButton.addEventListener("action", this._onUnitInc, this);
    this._unitIncButton.setCssClassName("bi-scroll-bar-button");
    this._unitIncButton.setAppearance("scroll-bar-inc-button");
    this._unitIncButton._themeKey = BiTheme.KEYS.scrollbarIncButton;
    this.add(this._unitIncButton);
    this._blockDecButton = new BiRepeatButton();
    this._blockDecButton._tagName = "DIV";
    this._blockDecButton.setHideFocus(true);
    this._blockDecButton.addEventListener("action", this._onBlockDec, this);
    this._blockDecButton.setCssClassName("bi-scroll-bar-block-button");
    this._blockDecButton.setAppearance("scroll-bar-block-button");
    this._blockDecButton._themeKey = BiTheme.KEYS.scrollbarBlockButton;
    this.add(this._blockDecButton);
    this._blockIncButton = new BiRepeatButton();
    this._blockIncButton._tagName = "DIV";
    this._blockIncButton.setHideFocus(true);
    this._blockIncButton.addEventListener("action", this._onBlockInc, this);
    this._blockIncButton.setCssClassName("bi-scroll-bar-block-button");
    this._blockIncButton.setAppearance("scroll-bar-block-button");
    this._blockIncButton._themeKey = BiTheme.KEYS.scrollbarBlockButton;
    this.add(this._blockIncButton);
    this._thumb = new BiMoveHandle();
    this._thumb.addEventListener("beforemove", this._onBeforeMove, this);
    this._thumb.addEventListener("moveend", this._onMoveEnd, this);
    this._thumb.setMoveDirection("horizontal");
    this._thumb.setCssClassName("bi-scroll-bar-thumb");
    this._thumb.setAppearance("scroll-bar-thumb");
    this._thumb.setCursor("default");
    this.add(this._thumb);
    this._range = new BiRangeModel();
    this._range.addEventListener("change", this._onChange, this);
    this._orientation = null;
    this.setOrientation(sOrientation || "horizontal");
}
_p = _biExtend(BiScrollBar, BiComponent, "BiScrollBar");
_p.getExtent = function () {
    return this._range.getExtent();
};
_p.setExtent = function (nExtent) {
    this._range.setExtent(nExtent);
};
_p.getMaximum = function () {
    return this._range.getMaximum();
};
_p.setMaximum = function (nMaximum) {
    this._range.setMaximum(nMaximum);
};
_p.getMinimum = function () {
    return this._range.getMinimum();
};
_p.setMinimum = function (nMinimum) {
    this._range.setMinimum(nMinimum);
};
_p.getValue = function () {
    return this._range.getValue();
};
_p.setValue = function (nValue) {
    this._range.setValue(nValue);
};
_p._minThumbSize = 8;
BiScrollBar.addProperty("minThumbSize", BiAccessType.READ_WRITE);
_p._unitIncrement = 1;
BiScrollBar.addProperty("unitIncrement", BiAccessType.READ_WRITE);
_p._blockIncrement = null;
BiScrollBar.addProperty("blockIncrement", BiAccessType.WRITE);
_p.getBlockIncrement = function () {
    if (this._blockIncrement == null) {
        var extent = this.getExtent();
        if (extent != null && extent > 0) {
            return extent;
        } else {
            return 10;
        }
    } else {
        return this._blockIncrement;
    }
};
_p._preferredSize = 16;
_p.getPreferredWidth = function () {
    return (this._orientation == "horizontal") ? 200 : this._preferredSize;
};
_p.getPreferredHeight = function () {
    return (this._orientation == "horizontal") ? this._preferredSize : 200;
};
BiScrollBar.addProperty("orientation", BiAccessType.READ);
_p.setOrientation = function (sOrientation) {
    if (this._orientation != sOrientation) {
        this._orientation = sOrientation;
        this.setAppearance("scroll-bar-" + sOrientation);
        this.pack();
        this._thumb.setMoveDirection(sOrientation);
        this.layoutAllChildren();
    }
};
_p.setEnabled = function (bEnabled) {
    if (bEnabled != this._enabled) {
        BiComponent.prototype.setEnabled.call(this, bEnabled);
        this._unitDecButton.setEnabled(bEnabled);
        this._unitIncButton.setEnabled(bEnabled);
        this._blockDecButton.setEnabled(bEnabled);
        this._blockIncButton.setEnabled(bEnabled);
        this._thumb.setEnabled(bEnabled);
    }
};
_p.layoutAllChildren = function () {
    this._layoutButtons();
    this._layoutScroll();
};
_p._layoutButtons = function () {
    if (!this.getCreated()) {
        return;
    }
    var y1, w1, h1, x2, y2, w2, h2 = 0;
    var width = this.getClientWidth();
    var height = this.getClientHeight();
    if (this._orientation == "horizontal") {
        if (width < 2 * this._preferredSize) {
            w1 = w2 = width / 2;
        } else {
            w1 = w2 = this._preferredSize;
        }
        x2 = width - w2;
        h1 = h2 = height;
    } else {
        if (height < 2 * this._preferredSize) {
            h1 = h2 = height / 2;
        } else {
            h1 = h2 = this._preferredSize;
        }
        y2 = height - h2;
        w1 = w2 = width;
    }
    this._layoutChild2(this._unitDecButton, null, y1, w1, h1, true);
    this._layoutChild2(this._unitIncButton, x2, y2, w2, h2, true);
};
_p._layoutScroll = function () {
    if (!this.getCreated()) {
        return;
    }
    var min = this.getMinimum();
    var max = this.getMaximum();
    var extent = this.getExtent();
    var value = this.getValue();
    var width = this.getClientWidth();
    var height = this.getClientHeight();
    var start, contentSize;
    if (this._orientation == "horizontal") {
        start = this._preferredSize;
        contentSize = width - start - this._preferredSize;
    } else {
        start = this._preferredSize;
        contentSize = height - start - this._preferredSize;
    }
    var size = 0;
    if (max > min) {
        size = Math.ceil(extent * contentSize / (max - min));
    }
    if (size < this._minThumbSize) {
        size = this._minThumbSize;
    }
    if (contentSize < size) {
        size = 0;
        this._thumb.setVisible(false);
    } else if (extent >= max - min) {
        this._thumb.setVisible(false);
    } else {
        this._thumb.setVisible(true);
    }
    var before = value - min;
    var after = max - extent - value;
    var beforeSize = (contentSize - size) * before / (before + after);
    if (beforeSize < 0) {
        beforeSize = 0;
    }
    var afterSize = contentSize - size - beforeSize;
    if (afterSize < 0) {
        afterSize = 0;
        beforeSize = contentSize - size;
    }
    if (this._orientation == "horizontal") {
        this._layoutChild2(this._thumb, beforeSize + start, 0, size, height, true);
        if (size > 0) {
            this._layoutChild2(this._blockDecButton, start, 0, beforeSize, height, true);
            this._layoutChild2(this._blockIncButton, beforeSize + start + size, 0, afterSize, height, true);
            this._blockDecButton.setVisible(true);
            this._blockIncButton.setVisible(true);
        } else {
            this._blockDecButton.setVisible(false);
            this._blockIncButton.setVisible(false);
        }
    } else {
        this._layoutChild2(this._thumb, 0, beforeSize + start, width, size, true);
        if (size > 0) {
            this._layoutChild2(this._blockDecButton, 0, start, width, beforeSize, true);
            this._layoutChild2(this._blockIncButton, 0, beforeSize + start + size, width, afterSize, true);
            this._blockDecButton.setVisible(true);
            this._blockIncButton.setVisible(true);
        } else {
            this._blockDecButton.setVisible(false);
            this._blockIncButton.setVisible(false);
        }
    }
};
_p._onChange = function (e) {
    if (this.getExtent() >= this.getMaximum() - this.getMinimum()) {
        this.setEnabled(false);
    } else {
        this.setEnabled(true);
    }
    this._layoutScroll();
    this.dispatchEvent("change");
};
_p._onBeforeMove = function (e) {
    var min = this.getMinimum();
    var max = this.getMaximum();
    var extent = this.getExtent();
    var position, start, end, contentSize, thumbSize;
    if (this._orientation == "horizontal") {
        position = e.getLeft();
        start = this._preferredSize;
        contentSize = this.getClientWidth() - start - this._preferredSize;
        end = start + contentSize;
        thumbSize = this._thumb.getWidth();
    } else {
        position = e.getTop();
        start = this._preferredSize;
        contentSize = this.getClientHeight() - start - this._preferredSize;
        end = start + contentSize;
        thumbSize = this._thumb.getHeight();
    }
    var beforeSize = position - start;
    if (beforeSize < 0) {
        beforeSize = 0;
    }
    var afterSize = contentSize - beforeSize - thumbSize;
    var value = (max - extent - min) * beforeSize / (beforeSize + afterSize);
    if (value <= min) {
        this.setValue(min);
        e.preventDefault();
    } else if (value >= max - extent) {
        this.setValue(max - extent);
        e.preventDefault();
    } else {
        this.setValue(value);
    }
};
_p._onMoveEnd = function (e) {
    this.dispatchEvent("scrollend");
};
_p._onUnitDec = function (e) {
    this.setValue(this.getValue() - this.getUnitIncrement());
};
_p._onUnitInc = function (e) {
    this.setValue(this.getValue() + this.getUnitIncrement());
};
_p._onBlockDec = function (e) {
    this.setValue(this.getValue() - this.getBlockIncrement());
};
_p._onBlockInc = function (e) {
    this.setValue(this.getValue() + this.getBlockIncrement());
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._unitDecButton.dispose();
    this._unitIncButton.dispose();
    this._blockDecButton.dispose();
    this._blockIncButton.dispose();
    this._thumb.dispose();
    this._range.dispose();
    this._unitDecButton = null;
    this._unitIncButton = null;
    this._blockDecButton = null;
    this._blockIncButton = null;
    this._thumb = null;
    this._range = null;
};

function BiSelectionModel(oOwner) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._owner = oOwner;
    this._selectedItems = new BiSelectionItemCollection;
}
_p = _biExtend(BiSelectionModel, BiEventTarget, "BiSelectionModel");
_p._multipleSelection = true;
_p._canDeselect = true;
_p._dragSelection = false;
_p._fireChange = true;
_p._anchorItem = null;
_p._leadItem = null;
BiSelectionModel.SELECTION_MODE_ROW = "row";
BiSelectionModel.SELECTION_MODE_CELL = "cell";
_p._ignoreShift = false;
_p._ignoreCtrl = false;
BiSelectionModel.addProperty("owner", BiAccessType.READ_WRITE);
BiSelectionModel.addProperty("multipleSelection", BiAccessType.READ_WRITE);
BiSelectionModel.addProperty("canDeselect", BiAccessType.READ_WRITE);
BiSelectionModel.addProperty("dragSelection", BiAccessType.READ_WRITE);
_p.getFirst = function () {
    return this._owner.getFirstChild();
};
_p.getLast = function () {
    return this._owner.getLastChild();
};
_p.getItems = function () {
    return this._owner.getChildren();
};
_p.getNext = function (oItem) {
    if (oItem) return oItem.getNextSibling();
    return null;
};
_p.getPrevious = function (oItem) {
    if (oItem) return oItem.getPreviousSibling();
    return null;
};
_p.isBefore = function (oItem1, oItem2) {
    var cs = this.getItems();
    return cs.indexOf(oItem1) < cs.indexOf(oItem2);
};
_p.isEqual = function (oItem1, oItem2) {
    return oItem1 == oItem2;
};
_p.getItemSelected = function (oItem) {
    return this._selectedItems.contains(oItem);
};
_p.updateItemSelectionState = function (oItem, bSelected) {
};
_p.updateItemAnchorState = function (oItem, bAnchor) {
};
_p.updateItemLeadState = function (oItem, bLead) {
};
_p.scrollItemIntoView = function (oItem) {
    oItem.scrollIntoView();
};
_p.getItemLeft = function (oItem) {
    return oItem.getLeft();
};
_p.getItemTop = function (oItem) {
    return oItem.getTop();
};
_p.getItemWidth = function (oItem) {
    return oItem.getWidth();
};
_p.getItemHeight = function (oItem) {
    return oItem.getHeight();
};
_p.setItemSelected = function (oItem, bSelected) {
    if (!this._multipleSelection) {
        var item0 = this.getSelectedItems()[0];
        if (bSelected) {
            if (this.isEqual(oItem, item0)) return;
            if (item0 != null) this.updateItemSelectionState(item0, false);
            this.updateItemSelectionState(oItem, true);
            this._selectedItems.removeAll();
            this._selectedItems.add(oItem);
            this._dispatchChange();
        } else {
            if (this.isEqual(item0, oItem)) {
                this.updateItemSelectionState(oItem, false);
                this._selectedItems.removeAll();
                this._dispatchChange();
            }
        }
    } else {
        if (this.getItemSelected(oItem) == bSelected) return;
        this.updateItemSelectionState(oItem, bSelected);
        if (bSelected) this._selectedItems.add(oItem);
        else this._selectedItems.remove(oItem);
        this._dispatchChange();
    }
};
_p.setAnchorItem = function (oItem) {
    if (this._anchorItem != null && !this.isEqual(this._anchorItem, oItem)) this.updateItemAnchorState(this._anchorItem, false);
    this._anchorItem = oItem;
    if (oItem != null) this.updateItemAnchorState(oItem, true);
};
BiSelectionModel.addProperty("anchorItem", BiAccessType.READ);
_p.setLeadItem = function (oItem) {
    if (this._leadItem != null && !this.isEqual(this._leadItem, oItem)) this.updateItemLeadState(this._leadItem, false);
    this._leadItem = oItem;
    if (oItem != null) this.updateItemLeadState(oItem, true);
    this.dispatchEvent("leaditemchange");
};
_p.getLeadItem = function () {
    if (this._leadItem == null) {
        var selectedItems = this.getSelectedItems();
        if (selectedItems.length > 0) this.setLeadItem(selectedItems[0]);
        else {
            var item = this.getFirst();
            if (item) this.setLeadItem(item);
        }
    }
    return this._leadItem;
};
_p.getSelectedItems = function () {
    return this._selectedItems.toArray();
};
_p.setSelectedItems = function (oItems) {
    var oldVal = this._getChangeValue();
    var oldFireChange = this._fireChange;
    this._fireChange = false;
    this._deselectAll();
    var item;
    for (var i = 0; i < oItems.length; i++) {
        item = oItems[i];
        this._selectedItems.add(item);
        this.updateItemSelectionState(item, true);
    }
    this._fireChange = oldFireChange;
    if (this._fireChange && this._hasChanged(oldVal)) this._dispatchChange();
};
_p.selectAll = function () {
    var oldVal = this._getChangeValue();
    var oldFireChange = this._fireChange;
    this._fireChange = false;
    this._selectAll();
    this._fireChange = oldFireChange;
    if (this._fireChange && this._hasChanged(oldVal)) this._dispatchChange();
};
_p._selectAll = function () {
    if (!this._multipleSelection) return;
    var items = this.getItems();
    this._selectedItems.removeAll();
    for (var i = 0; i < items.length; i++) {
        this.updateItemSelectionState(items[i], true);
        this._selectedItems.add(items[i]);
    }
};
_p.deselectAll = function () {
    var oldVal = this._getChangeValue();
    var oldFireChange = this._fireChange;
    this._fireChange = false;
    this._deselectAll();
    this._fireChange = oldFireChange;
    if (this._fireChange && this._hasChanged(oldVal)) this._dispatchChange();
};
_p._deselectAll = function () {
    var items = this._selectedItems.toArray();
    for (var i = 0; i < items.length; i++) {
        this.updateItemSelectionState(items[i], false);
    }
    this._selectedItems.removeAll();
};
_p.selectItemRange = function (oItem1, oItem2) {
    var oldVal = this._getChangeValue();
    var oldFireChange = this._fireChange;
    this._fireChange = false;
    this._selectItemRange(oItem1, oItem2, true);
    this._fireChange = oldFireChange;
    if (this._fireChange && this._hasChanged(oldVal)) this._dispatchChange();
};
_p._selectItemRange = function (item1, item2, bDeselectAll) {
    if (this.isBefore(item2, item1)) {
        this._selectItemRange(item2, item1, bDeselectAll);
        return;
    }
    if (bDeselectAll) this._deselectAll();
    var item = item1;
    while (item != null) {
        this._selectedItems.add(item);
        this.updateItemSelectionState(item, true);
        if (this.isEqual(item, item2)) break;
        item = this.getNext(item);
    }
};
_p._deselectItemRange = function (item1, item2) {
    if (this.isBefore(item2, item1)) {
        this._deselectItemRange(item2, item1);
        return;
    }
    var item = item1;
    while (item != null) {
        this._selectedItems.remove(item);
        this.updateItemSelectionState(item, false);
        if (this.isEqual(item, item2)) break;
        item = this.getNext(item);
    }
};
_p.handleMouseDown = function (oItem, e) {
    if (e.getButton() != BiMouseEvent.LEFT && e.getButton() != BiMouseEvent.RIGHT) return;
    var contiguous = e.matchesBundleModifiers("selection.contiguous");
    var preserved = e.matchesBundleModifiers("selection.preserved");
    if (contiguous || this._dragSelection || (!this.getItemSelected(oItem) && !preserved)) this._onmouseevent(oItem, e);
    else this.setLeadItem(oItem);
    this._isDraggingSelection = this._dragSelection;
    if (this._isDraggingSelection) {
        this._owner.addEventListener("losecapture", this._loseCapture, this);
        this._owner.addEventListener("mouseup", this._loseCapture, this);
        this._owner.setCapture(true);
    }
};
_p._loseCapture = function (e) {
    this._owner.removeEventListener("losecapture", this._loseCapture, this);
    this._owner.removeEventListener("mouseup", this._loseCapture, this);
    this._isDraggingSelection = false;
    this._owner.setCapture(false);
};
_p.handleMouseUp = function (oItem, e) {
    if (e.getButton() != BiMouseEvent.LEFT) return;
    var contiguous = e.matchesBundleModifiers("selection.contiguous");
    var preserved = e.matchesBundleModifiers("selection.preserved");
    if (!contiguous && (preserved || this.getItemSelected(oItem)) && !this._isDraggingSelection) this._onmouseevent(oItem, e);
    if (this._isDraggingSelection) {
        this._isDraggingSelection = false;
        this._owner.setCapture(false);
    }
};
_p.handleClick = function (oItem, e) {
};
_p.handleDblClick = function (oItem, e) {
};
_p.handleMouseOver = function (oItem, e) {
    if (!this._dragSelection || !this._isDraggingSelection) return;
    this._onmouseevent(oItem, e, true);
};
_p._onmouseevent = function (oItem, e, bOver) {
    var oldVal = this._getChangeValue();
    var oldFireChange = this._fireChange;
    this._fireChange = false;
    var contiguous = e.matchesBundleModifiers("selection.contiguous");
    var preserved = e.matchesBundleModifiers("selection.preserved");
    var selectedItems = this.getSelectedItems();
    var selectedCount = selectedItems.length;
    var oldLead = this._leadItem;
    this.setLeadItem(oItem);
    var aItem = this._anchorItem;
    if (!aItem || selectedCount == 0 || (preserved && !contiguous && this._multipleSelection && !this._dragSelection)) {
        this.setAnchorItem(oItem);
        aItem = oItem;
    }
    if ((!preserved && !contiguous && !this._isDraggingSelection || !this._multipleSelection)) {
        this._deselectAll();
        this.setAnchorItem(oItem);
        if (!this.getItemSelected(oItem)) this.updateItemSelectionState(oItem, true);
        this._selectedItems.removeAll();
        this._selectedItems.add(oItem);
        this._addToSel = true;
    } else if (this._isDraggingSelection && bOver) {
        if (oldLead) this._deselectItemRange(aItem, oldLead);
        if (this._addToSel) this._selectItemRange(aItem, oItem, false);
        else this._deselectItemRange(aItem, oItem);
    } else if (this._multipleSelection && preserved && !contiguous) {
        if (!this._isDraggingSelection) this._addToSel = !(this._canDeselect && this.getItemSelected(oItem));
        this.setItemSelected(oItem, this._addToSel);
        this.setAnchorItem(oItem);
    } else if (this._multipleSelection && preserved && contiguous) {
        if (!this._isDraggingSelection) {
            this._addToSel = true;
        }
        if (this._addToSel) this._selectItemRange(aItem, oItem, false);
        else this._deselectItemRange(aItem, oItem);
    } else if (this._multipleSelection && !preserved && contiguous) {
        if (this._canDeselect) {
            this._selectItemRange(aItem, oItem, true);
        } else {
            if (oldLead) this._deselectItemRange(aItem, oldLead);
            this._selectItemRange(aItem, oItem, false);
        }
    }
    this._fireChange = oldFireChange;
    if (this._fireChange && this._hasChanged(oldVal)) this._dispatchChange();
};
_p.handleKeyDown = function (e) {
    var oldVal = this._getChangeValue();
    var oldFireChange = this._fireChange;
    this._fireChange = false;
    this._ignoreCtrl = false;
    this._ignoreShift = false;
    if (e.matchesBundleShortcut("selection.all")) {
        if (this._multipleSelection) {
            this._selectAll();
            this.setLeadItem(this.getFirst());
        }
    } else if (this._multipleSelection && e.matchesBundleShortcut("selection.toggle")) {
        var leadItem = this.getLeadItem();
        if (this._selectedItems.contains(leadItem)) {
            this.updateItemSelectionState(leadItem, false);
            this._selectedItems.remove(leadItem);
        } else if (leadItem) {
            this.updateItemSelectionState(leadItem, true);
            this._selectedItems.add(leadItem);
        }
        this.setAnchorItem(leadItem);
    } else {
        var aIndex = this._anchorItem;
        var itemToSelect = this.getItemToSelect(e);
        if (itemToSelect) {
            this.setLeadItem(itemToSelect);
            this.scrollItemIntoView(itemToSelect);
            e.preventDefault();
            if (this._multipleSelection && !this._ignoreShift && e.matchesBundleModifiers("selection.contiguous")) {
                if (aIndex == null) this.setAnchorItem(itemToSelect);
                this._selectItemRange(this._anchorItem, itemToSelect, true);
            } else if (!this._multipleSelection || this._ignoreCtrl || !e.matchesBundleModifiers("selection.leaditem")) {
                this._deselectAll();
                this.updateItemSelectionState(itemToSelect, true);
                this._selectedItems.add(itemToSelect);
                this.setAnchorItem(itemToSelect);
            }
        }
    }
    if (e.getCtrlKey() && BiBrowserCheck.moz && e.getKeyCode() == BiKeyboardEvent.SPACE) e.preventDefault();
    this._fireChange = oldFireChange;
    if (this._fireChange && this._hasChanged(oldVal)) this._dispatchChange();
};
_p.inlineFind = function (e, oComponent) {
    if (!oComponent.getAllowInlineFind()) return;
    if (e.matchesBundleShortcut("prevented.inlinefind")) e.preventDefault();
    if (e.getKeystroke().getModifiers() & (BiKeystroke.MODIFIER_FLAGS.CTRL + BiKeystroke.MODIFIER_FLAGS.META)) return;
    var keyCode = e.getKeyCode();
    var keyChar = String.fromCharCode(keyCode);
    if (new Date - this._lastKeyPress <= 1000) this._accumulatedKeys += keyChar;
    else this._accumulatedKeys = keyChar;
    var item = oComponent._findItem(this._accumulatedKeys, null, "String");
    if (item) {
        var oldVal = this._getChangeValue();
        var oldFireChange = this._fireChange;
        this._fireChange = false;
        this._deselectAll();
        this.setItemSelected(item, true);
        this.setAnchorItem(item);
        this.setLeadItem(item);
        item.scrollIntoView();
        this._fireChange = oldFireChange;
        if (this._fireChange && this._hasChanged(oldVal)) this._dispatchChange();
    }
    this._lastKeyPress = (new Date).valueOf();
};
_p._dispatchChange = function () {
    if (!this._fireChange) return;
    this.dispatchEvent("change");
};
_p._hasChanged = function (sOldValue) {
    return sOldValue != this._getChangeValue();
};
_p._getChangeValue = function () {
    return this._selectedItems.getChangeValue();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiEventTarget.prototype.dispose.call(this);
    this._owner = null;
    this._selectedItems.dispose();
    this._selectedItems = null;
};
_p.getHome = function (oItem) {
    return this.getFirst();
};
_p.getCtrlHome = function (oItem) {
    return this.getFirst();
};
_p.getEnd = function (oItem) {
    return this.getLast();
};
_p.getCtrlEnd = function (oItem) {
    return this.getLast();
};
_p.getDown = function (oItem) {
    return !oItem ? this.getFirst() : this.getNext(oItem);
};
_p.getUp = function (oItem) {
    return !oItem ? this.getLast() : this.getPrevious(oItem);
};
_p.getLeft = function (oItem) {
    return oItem;
};
_p.getRight = function (oItem) {
    return oItem;
};
_p.getPageUp = function (oItem) {
    var vpTop = this._owner.getScrollTop();
    var next;
    if (!this._leadItem) next = this.getFirst();
    else next = this._leadItem;
    var tries = 0;
    while (tries < 2) {
        while (next && (this.getItemTop(next) - this.getItemHeight(next) >= vpTop)) next = this.getUp(next);
        if (next == null) {
            tries = 2;
            break;
        }
        if (next != this._leadItem) break;
        this._owner.setScrollTop(vpTop - this._owner.getClientHeight() - this.getItemHeight(next));
        vpTop = this._owner.getScrollTop();
        tries++;
    }
    return next;
};
_p.getPageDown = function (oItem) {
    var vpTop = this._owner.getScrollTop();
    var vpHeight = this._owner.getClientHeight();
    var next;
    if (!this._leadItem) next = this.getLast();
    else next = this._leadItem;
    var tries = 0;
    while (tries < 2) {
        while (next && (this.getItemTop(next) + 2 * this.getItemHeight(next) <= vpTop + vpHeight)) next = this.getDown(next);
        if (next == null) {
            tries = 2;
            break;
        }
        if (next != this._leadItem) break;
        this._owner.setScrollTop(vpTop + vpHeight - 2 * this.getItemHeight(next));
        vpTop = this._owner.getScrollTop();
        tries++;
    }
    return next;
};
_p.getItemToSelect = function (e) {
    var actions = {
        "selection.left": "getLeft",
        "selection.right": "getRight",
        "selection.up": "getUp",
        "selection.down": "getDown",
        "selection.first": "getHome",
        "selection.topleft": "getCtrlHome",
        "selection.last": "getEnd",
        "selection.bottomright": "getCtrlEnd",
        "selection.page.previous": "getPageUp",
        "selection.page.next": "getPageDown"
    };
    for (var n in actions) {
        if (e.matchesBundleShortcut(n, true)) {
            var action = actions[n];
            this._ignoreCtrl = /Ctrl/.test(action);
            return this[action](this._leadItem);
        }
    }
    return null;
};

function BiSelectionItemCollection() {
    if (_biInPrototype) return;
    this._c = {};
    this._a = [];
}
_p = _biExtend(BiSelectionItemCollection, BiObject, "BiSelectionItemCollection");
_p.add = function (oItem) {
    this._c[this.getItemHashCode(oItem)] = oItem;
    this._a.push(oItem);
};
_p.remove = function (oItem) {
    delete this._c[this.getItemHashCode(oItem)];
    for (var i = 0; i < this._a.length; i++)
        if (this.getItemHashCode(this._a[i]) == this.getItemHashCode(oItem)) this._a.removeAt(i);
};
_p.removeAll = function () {
    this._c = {};
    this._a = [];
};
_p.contains = function (oItem) {
    return oItem && this.getItemHashCode(oItem) in this._c;
};
_p.toArray = function () {
    return this._a;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this._c = null;
    this._a = null;
};
_p.getChangeValue = function () {
    var sb = [];
    for (var hc in this._c) sb.push(hc);
    sb.sort();
    return sb.join(",");
};
_p.getItemHashCode = function (oItem) {
    return oItem.toHashCode();
};
_p.isEmpty = function () {
    return Object.isEmpty(this._c);
};

function BiList() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-list");
    this.setAppearance("list");
    this.setTabIndex(1);
    this.setHideFocus(false);
    this.addEventListener("mousedown", this._onmousevent);
    this.addEventListener("mouseup", this._onmousevent);
    this.addEventListener("click", this._onmousevent);
    this.addEventListener("dblclick", this._onmousevent);
    this.addEventListener("mouseover", this._onmousevent);
    this.addEventListener("keydown", this._onkeydown);
    this.addEventListener("keypress", this._onKeyPress);
    this.addEventListener("create", this._onCreate);
    this._selectionModel = new BiListSelectionModel(this);
    this._selectionModel.addEventListener("change", function (e) {
        this.dispatchEvent("change");
        if (this._command) this._command.setUserValue(this.getUserValue());
    }, this);
}
_p = _biExtend(BiList, BiComponent, "BiList");
_p._lastKeyPress = 0;
_p._accumulatedKeys = "";
_p._sortType = "string";
_p._sortFunction = null;
_p._allowInlineFind = true;
BiList.addProperty("allowInlineFind", BiAccessType.READ_WRITE);
_p.getSelectedItem = function () {
    return this.getSelectedItems()[0];
};
_p.getSelectedItems = function () {
    return this._selectionModel.getSelectedItems();
};
BiList.addProperty("sortType", BiAccessType.READ_WRITE);
BiList.addProperty("sortFunction", BiAccessType.READ_WRITE);
_p.getSortFunction = function () {
    var f;
    if (this._sortFunction != null) {
        f = this._sortFunction;
    } else {
        switch (this._sortType.toLowerCase()) {
            case "string":
                f = BiSort.stringCompare;
                break;
            case "caseinsensitivestring":
                f = BiSort.caseInsensitiveStringCompare;
                break;
            case "number":
                f = BiSort.numberCompare;
                break;
            case "date":
                f = BiSort.dateCompare;
                break;
            default:
                f = BiSort.lessThanCompare;
        }
    }
    return function (item1, item2) {
        if (item1.getValue() && item2.getValue()) return f(item1.getValue(), item2.getValue());
        else return f(item1.getText(), item2.getText());
    };
};
_p.sort = function (update) {
    var f = this.getSortFunction();
    var childArray = this.getChildren();
    var sortedArray;
    if (childArray) {
        sortedArray = childArray.sort(f);
        if (update != false) {
            for (var i = 0; i < sortedArray.length; i++) this.add(sortedArray[i]);
        }
    }
    return sortedArray;
};
_p.getUserValue = function () {
    var si = this.getSelectedItem();
    if (si) return si.getUserValue();
    return null;
};
_p.setUserValue = function (v) {
    var item = this.findUserValueExact(v);
    if (item) {
        this._selectionModel._deselectAll();
        item.setSelected(true);
        this._selectionModel.setAnchorItem(item);
        this._selectionModel.setLeadItem(item);
    }
};
_p.getUserValues = function () {
    var sis = this.getSelectedItems();
    var l = sis.length;
    var res = new Array(l);
    for (var i = 0; i < l; i++) res[i] = sis[i].getUserValue();
    return res;
};
_p.getValue = _p.getUserValue;
_p.setValue = _p.setUserValue;
_p.getValues = _p.getUserValues;
BiList.addProperty("selectionModel", BiAccessType.READ_WRITE);
_p.add = function (oChild, oBefore) {
    var b = oChild.getSelected();
    BiComponent.prototype.add.call(this, oChild, oBefore);
    if (b) {
        this._selectionModel.setItemSelected(oChild, false);
        this._selectionModel.setItemSelected(oChild, true);
    }
    var hf = this._children ? this._children.length > 0 : false;
    if (hf != this._hideFocus) this.setHideFocus(hf);
};
_p.remove = function (oChild) {
    var b = oChild.getSelected();
    var sm = this._selectionModel;
    var next;
    if (sm._leadItem == oChild || sm._anchorItem == oChild) {
        next = oChild.getNextSibling() || oChild.getPreviousSibling();
        if (sm._leadItem == oChild) sm.setLeadItem(next);
        if (sm._anchorItem == oChild) sm.setAnchorItem(next);
    }
    BiComponent.prototype.remove.call(this, oChild);
    if (b) {
        sm.setItemSelected(oChild, false);
        oChild.setSelected(true);
    }
    var hf = this._children ? this._children.length > 0 : false;
    if (hf != this._hideFocus) this.setHideFocus(hf);
};
_p.removeAll = function () {
    var sm = this.getSelectionModel();
    sm.deselectAll();
    sm.setAnchorItem(null);
    sm.setLeadItem(null);
    BiComponent.prototype.removeAll.call(this);
};
_p.setMultipleSelection = function (b) {
    this._selectionModel.setMultipleSelection(b);
};
_p.getMultipleSelection = function () {
    return this._selectionModel.getMultipleSelection();
};
_p.findString = function (sText, nStartIndex) {
    return this._findItem(sText, nStartIndex || 0, "String");
};
_p.findStringExact = function (sText, nStartIndex) {
    return this._findItem(sText, nStartIndex || 0, "StringExact");
};
_p._findItem = function (oUserValue, nStartIndex, sType) {
    var i;
    var items = this.getChildren();
    if (nStartIndex == null) {
        var si = this.getSelectedItem();
        nStartIndex = items.indexOf(si);
    }
    if (nStartIndex == -1) nStartIndex = 0;
    var methodName = "matches" + sType;
    for (i = nStartIndex; i < items.length; i++) {
        if (items[i].getEnabled() && items[i].getVisible() && items[i][methodName](oUserValue)) return items[i];
    }
    for (i = 0; i < nStartIndex; i++) {
        if (items[i].getEnabled() && items[i].getVisible() && items[i][methodName](oUserValue)) return items[i];
    }
    return null;
};
_p.findUserValueExact = function (oUserValue, nStartIndex) {
    var items = this.getChildren();
    if (isNaN(nStartIndex)) nStartIndex = 0;
    for (var i = nStartIndex; i < items.length; i++) {
        if (items[i].getUserValue() == oUserValue) return items[i];
    }
    return null;
};
_p.findValueExact = _p.findUserValueExact;
_p._computePreferredHeight = function () {
    var el = this._element;
    if (BiBrowserCheck.ie && this._measuredHeight == 0) {
        var old = el.runtimeStyle.display;
        el.runtimeStyle.display = BiString.EMPTY;
    }
    var el = this._element;
    var style = el.runtimeStyle || el.style;
    var w = style.width;
    var h = style.height;
    style.width = BiComponent.STYLE_AUTO;
    style.height = BiComponent.STYLE_AUTO;
    style.overflow = BiComponent.STYLE_HIDDEN;
    var rv = this.getInsetTop() + this.getInsetBottom();
    var c = this.getLastChild();
    if (c) rv += c.getTop() + c.getHeight();
    style.width = w;
    style.height = h;
    style.overflow = BiComponent.STYLE_AUTO;
    if (BiBrowserCheck.ie && this._measuredHeight == 0) {
        this._element.runtimeStyle.display = old;
    }
    return rv;
};
_p._onmousevent = function (e) {
    var item = e.getTarget();
    if (item instanceof BiList && e.getType() == "mousedown") {
        var oh = item._element.offsetHeight;
        var sh = item._element.scrollHeight;
    }
    while (item != null && item.getParent() != this) item = item.getParent();
    if (item != null && item.getEnabled()) {
        switch (e.getType()) {
            case "mousedown":
                this._selectionModel.handleMouseDown(item, e);
                break;
            case "mouseup":
                this._selectionModel.handleMouseUp(item, e);
                break;
            case "click":
                this._selectionModel.handleClick(item, e);
                break;
            case "dblclick":
                this._selectionModel.handleDblClick(item, e);
                break;
            case "mouseover":
                this._selectionModel.handleMouseOver(item, e);
                break;
        }
    }
};
_p._onkeydown = function (e) {
    if (e.matchesBundleShortcut("controls.accept")) {
        var items = this.getSelectedItems();
        for (var i = 0; i < items.length; i++) items[i]._dispatchAction();
    } else {
        this._selectionModel.handleKeyDown(e);
    }
};
_p._onKeyPress = function (e) {
    this._selectionModel.inlineFind(e, this);
};
_p._onCreate = function (e) {
    var lead = this._selectionModel.getLeadItem();
    if (lead != null) this._selectionModel.scrollItemIntoView(lead);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this.disposeFields("_selectionModel", "_dataSource");
};
_p._syncWithCommand = function () {
    if (this._command) {
        this.setEnabled(this._command.getEnabled());
        this.setUserValue(this._command.getUserValue());
    }
};
_p._dataSource = null;
_p._dataTextField = null;
_p._dataUserValueField = null;
_p._dataPageSize = null;
_p._dataPageCount = 1;
_p._currentDataPage = 0;
BiList.addProperty("dataTextField", BiAccessType.READ_WRITE);
BiList.addProperty("dataUserValueField", BiAccessType.READ_WRITE);
BiList.addProperty("dataSource", BiAccessType.READ);
_p.setDataSource = function (oDs) {
    if (oDs instanceof BiDataSet || oDs instanceof BiDataTable) this._dataSource = oDs;
    else throw new Error("Data source format not supported");
};
BiList.addProperty("dataPageSize", BiAccessType.READ);
_p.setDataPageSize = function (n) {
    if (this._dataPageSize != n) {
        this._dataPageSize = n;
        if (this._dataSource && this._dataSource.getDataReady()) {
            var t = this._dataSource;
            if (t instanceof BiDataSet) t = t.getTables()[0];
            var rows = t.getRows().length;
            this._dataPageCount = Math.ceil(rows / this._dataPageSize);
            this._populateWithDataSource();
        }
    }
};
BiList.addProperty("dataPageCount", BiAccessType.READ);
BiList.addProperty("currentDataPage", BiAccessType.READ);
_p.setCurrentDataPage = function (n) {
    n = Math.min(Math.max(0, n), this.getDataPageCount() - 1);
    if (this._currentDataPage != n) {
        this._currentDataPage = n;
        if (this._dataSource && this._dataSource.getDataReady()) {
            this._populateWithDataSource();
        }
    }
};
_p.getDataValueField = _p.getDataUserValueField;
_p.setDataValueField = _p.setDataUserValueField;
_p.dataBind = function () {
    var ds = this._dataSource;
    if (ds instanceof BiDataTable) ds = this._dataSource.getDataSet();
    if (ds.getDataReady()) this._populateWithDataSource();
    else ds.addEventListener("dataready", this._populateWithDataSource, this);
};
_p._populateWithDataSource = function () {
    var cs = this.getChildren();
    var c;
    for (var i = cs.length - 1; i >= 0; i--) {
        c = cs[i];
        this.remove(c);
        c.dispose();
    }
    var ds = this._dataSource;
    if (ds instanceof BiDataSet && ds.getTables().length == 0) {
        this._dataPageSize = null;
        this._dataPageCount = 1;
        this._currentDataPage = 0;
    } else {
        if (ds instanceof BiDataSet) ds = ds.getTables()[0];
        var rows = ds.getRows();
        var startIndex = 0;
        var endIndex = rows.length;
        var dps = this.getDataPageSize();
        if (dps != null && dps > 0) {
            this._dataPageCount = Math.max(1, Math.ceil(endIndex / dps));
            startIndex = dps * this._currentDataPage;
            if (startIndex + dps > endIndex) startIndex = endIndex - (endIndex % dps || dps);
            if (startIndex < 0) startIndex = 0;
            endIndex = Math.min(endIndex, startIndex + dps);
            this._currentDataPage = startIndex / dps;
        }
        for (var y = startIndex; y < endIndex; y++) this.add(this.createItemFromDataRow(rows[y]));
    }
    this.dispatchEvent("databind");
};
_p.createItemFromDataRow = function (oRow) {
    return new BiListItem(oRow.getValueByName(this._dataTextField), oRow.getValueByName(this._dataUserValueField));
};
_p.layoutAllChildren = function () {
    var cs = this._children;
    var l = cs.length;
    var i;
    var sw = 0;
    if (BiBrowserCheck.ie) {
        var rtl = this.getRightToLeft();
        var r = this._document.body.createTextRange();
        for (i = 0; i < l; i++) {
            r.moveToElementText(cs[i]._element);
            var bcr = r.getBoundingClientRect();
            sw = Math.max(sw, bcr.right - bcr.left + cs[i].getPaddingLeft() + cs[i].getPaddingRight());
        }
    } else {
        sw = this.getScrollWidth();
    }
    var overflowX = sw > this.getClientWidth();
    for (i = 0; i < l; i++) {
        if (overflowX) cs[i].setStyleProperty("width", sw + "px");
        else cs[i].removeStyleProperty("width");
    }
};
_p.layoutChild = _p._layoutChild = _p._layoutChild2 = BiAccessType.FUNCTION_EMPTY;

function BiListItem(sText, oUserValue) {
    if (_biInPrototype) return;
    BiLabel.call(this, sText);
    if (oUserValue != null) this._userValue = oUserValue;
    this.setCssClassName("bi-list-item");
    this.setAppearance("list-item");
    this.addEventListener("dblclick", this._onDblClick);
    this.addEventListener("create", this._onCreate, this);
}
_p = _biExtend(BiListItem, BiLabel, "BiListItem");
_p._selected = false;
_p._anchor = false;
_p._lead = false;
_p._userValue = null;
_p.setVisible = function (b) {
    BiLabel.prototype.setVisible.call(this, b);
    if (this._element) this._element.style.display = b ? "" : "none";
};
_p._onCreate = function (e) {
    this._element.style.display = this.getVisible() ? "" : "none";
};
BiListItem.addProperty("selected", BiAccessType.READ);
_p.setSelected = function (bSelected) {
    if (this._selected != bSelected) {
        var p;
        if ((p = this.getParent()) != null) {
            p._selectionModel.setItemSelected(this, bSelected);
        }
        this._setSelected(bSelected);
    }
};
BiListItem.addProperty("userValue", BiAccessType.READ);
_p.setUserValue = function (v) {
    if (this._userValue != v) {
        this._userValue = v;
        if (this._command) this._command.setUserValue(v);
    }
};
_p.getValue = _p.getUserValue;
_p.setValue = _p.setUserValue;
_p._setSelected = function (bSelected) {
    this._selected = bSelected;
    var tm = application.getThemeManager();
    if (bSelected && this.getEnabled()) tm.addState(this, "selected");
    else tm.removeState(this, "selected");
    tm.applyAppearance(this);
    this.dispatchEvent("change");
};
_p._setAnchor = function (bAnchor) {
    this._anchor = bAnchor;
    var tm = application.getThemeManager();
    if (bAnchor && this.getEnabled()) tm.addState(this, "anchor");
    else tm.removeState(this, "anchor");
    tm.applyAppearance(this);
};
_p._setLead = function (bLead) {
    this._lead = bLead;
    var tm = application.getThemeManager();
    if (bLead && this.getEnabled()) tm.addState(this, "lead");
    else tm.removeState(this, "lead");
    tm.applyAppearance(this);
};
_p.getIndex = function () {
    var p;
    if ((p = this.getParent()) != null) return p.getChildren().indexOf(this);
    return -1;
};
_p.matchesString = function (sText) {
    return sText != "" && this.getText().toLowerCase().indexOf(sText.toLowerCase()) == 0;
};
_p.matchesStringExact = function (sText) {
    return sText != "" && this.getText().toLowerCase() == String(sText).toLowerCase();
};
_p._onDblClick = function (e) {
    var p = this.getParent();
    if (p && p.getIsEnabled()) this._dispatchAction();
};
_p._dispatchAction = function () {
    if (this.getIsEnabled()) {
        this.dispatchEvent("action");
        if (this._command) this._command.execute();
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiLabel.prototype.dispose.call(this);
    delete this._userValue;
};
_p._syncWithCommand = function () {
    if (this._command) {
        this.setEnabled(this._command.getEnabled());
        this.setUserValue(this._command.getUserValue());
    }
};
_p.getWidth = function () {
    if (this._created) {
        BiComponent.flushLayoutComponent(this);
        return this._element.offsetWidth;
    }
    return this._width;
};
_p.getHeight = function () {
    if (this._created) {
        BiComponent.flushLayoutComponent(this);
        return this._element.offsetHeight;
    }
    return this._height;
};
_p.layoutComponent = BiAccessType.FUNCTION_EMPTY;
_p._mozForceReflow = BiAccessType.FUNCTION_EMPTY;

function BiListSelectionModel(oList) {
    if (_biInPrototype) return;
    BiSelectionModel.call(this, oList);
};
_p = _biExtend(BiListSelectionModel, BiSelectionModel, "BiListSelectionModel");
_p.isBefore = function (oItem1, oItem2) {
    return oItem1.getIndex() < oItem2.getIndex();
};
_p.getItemSelected = function (oItem) {
    return oItem._selected;
};
_p.updateItemSelectionState = function (oItem, bSelected) {
    oItem._setSelected(bSelected);
};
_p.updateItemAnchorState = function (oItem, bAnchor) {
    oItem._setAnchor(bAnchor);
};
_p.updateItemLeadState = function (oItem, bLead) {
    oItem._setLead(bLead);
};
_p.getFirst = function () {
    var o = BiSelectionModel.prototype.getFirst.call(this);
    if (o && !o.getEnabled()) return this.getNext(o);
    return o;
};
_p.getLast = function () {
    var o = BiSelectionModel.prototype.getLast.call(this);
    if (o && !o.getEnabled()) return this.getPrevious(o);
    return o;
};
_p.getPrevious = function (oItem) {
    var o = null;
    if (oItem) {
        o = oItem.getPreviousSibling();
        while (o && !o.getEnabled()) o = o.getPreviousSibling();
    }
    return o;
};
_p.getNext = function (oItem) {
    var o = null;
    if (oItem) {
        o = oItem.getNextSibling();
        while (o && !o.getEnabled()) o = o.getNextSibling();
    }
    return o;
};
_p.getPageDown = function (oItem) {
    var next = BiSelectionModel.prototype.getPageDown.call(this, oItem) || this.getLast();
    while (next && !next.getEnabled()) next = next.getPreviousSibling();
    return next;
};
_p.getPageUp = function (oItem) {
    var next = BiSelectionModel.prototype.getPageUp.call(this, oItem) || this.getFirst();
    while (next && !next.getEnabled()) next = next.getNextSibling();
    return next;
};

function BiComboBox(oItems) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-combo-box");
    this.setAppearance("combo-box");
    this.setSize(100, 22);
    this.setHideFocus(true);
    this._button = new BiButton;
    this._button.setTabIndex(-1);
    this._button.setWidth(16);
    this._button.setTop(0);
    this._button.setBottom(0);
    this._button._themeKey = BiTheme.KEYS.comboBoxButton;
    var arrowImg = new BiComponent;
    arrowImg.setAppearance("combo-box-arrow");
    this._button.add(arrowImg);
    this._label = new BiLabel;
    this._label.setAppearance("combo-box-label");
    this._label.setTop(1);
    this._label.setBottom(1);
    BiComponent.prototype.add.call(this, this._label, null, true);
    BiComponent.prototype.add.call(this, this._button, null, true);
    this.setTabIndex(1);
    this.addEventListener("mousedown", this._onMouseDown, this);
    this.addEventListener("keydown", this._onKeyDown, this);
    this.addEventListener("keypress", this._onKeyPress, this);
    this.addEventListener("focus", this._onFocus, this);
    this.addEventListener("blur", this._onBlur, this);
    this.addEventListener("resize", this._onResize, this);
    this._pendingItems = [];
    if (oItems) {
        for (var i = 0; i < oItems.length; i++) this.add(new BiComboBoxItem(String(oItems[i])));
    }
}
_p = _biExtend(BiComboBox, BiComponent, "BiComboBox");
BiComboBox.BUTTON_IMAGE = application.getPath() + "images/arrow.down.gif";
_p._selectedItem = null;
_p._editable = false;
_p._typedMatch = null;
_p._invalidMessage = "";
_p._validator = null;
BiComboBox.addProperty("popup", BiAccessType.READ);
_p.getPopup = function () {
    if (!this._popup) this._createPopup();
    return this._popup;
};
_p._getList = function () {
    if (!this._popup) this._createPopup();
    return this._list;
};
_p.getTextField = function () {
    if (!this._textField) {
        var tf = this._textField = new BiTextField;
        tf.setTabIndex(0);
        tf.setTop(1);
        tf.setBottom(1);
        tf.setVisible(false);
        BiComponent.prototype.add.call(this, tf, null, true);
        tf.addEventListener("textchanged", this._onTextChanged, this);
        this._label.setLabelFor(tf);
    }
    return this._textField;
};
_p.getTextBox = function () {
    if (this._editable) return this._textField;
    else return this._label;
};
BiComboBox.addProperty("sortType", BiAccessType.READ_WRITE);
_p.setSortType = function (sType) {
    this._getList().setSortType(sType);
};
_p.getSortType = function () {
    return this._getList().getSortType();
};
BiComboBox.addProperty("sortFunction", BiAccessType.READ_WRITE);
_p.getSortFunction = function () {
    return this._getList().getSortFunction();
};
_p.setSortFunction = function (f) {
    this._getList().setSortFunction(f);
};
_p.sort = function (update) {
    return this._getList().sort(update);
};
_p._createPopup = function () {
    if (this._popup) return;
    this._popup = new BiPopup;
    this._popup._lazyCreate = false;
    this._popup.positionRelativeToComponent(this, "vertical");
    BiComponent.prototype.add.call(this, this._popup, null, true);
    this._popup.addEventListener("hide", this._onPopupHide, this);
    this._popup.addEventListener("show", this._onPopupShow, this);
    this._popup.setMaximumHeight(300);
    this._popup._computePreferredWidth = BiComboBox._popupPreferredWidth;
    this._popup.getPreferredHeight = BiComboBox._popupPreferredHeight;
    if (BiBrowserCheck.quirks.mozScrollBarBug) {
        this._mozScrollBarBugWorkaround = true;
        this._popup.setStyleProperty("display", "none !important");
    }
    this._list = new BiList;
    this._list.setCssClassName("bi-combo-box-list");
    this._list.setAppearance("combo-box-list");
    this._list.setTabIndex(-1);
    this._list.setMultipleSelection(false);
    this._list.setLocation(0, 0);
    this._list.setRight(0);
    this._list.setBottom(0);
    var othis = this;
    this._list._computePreferredHeight = function () {
        var el = this._element;
        if (BiBrowserCheck.ie && this._measuredHeight == 0) {
            var old = el.runtimeStyle.display;
            el.runtimeStyle.display = BiString.EMPTY;
        }
        var style = el.runtimeStyle || el.style;
        var w = style.width;
        var h = style.height;
        style.width = othis.getWidth() + "px";
        style.height = BiComponent.STYLE_AUTO;
        var rv = el.scrollHeight + el.offsetHeight - el.clientHeight;
        style.width = w;
        style.height = h;
        style.overflow = BiComponent.STYLE_AUTO;
        if (BiBrowserCheck.ie && this._measuredHeight == 0) {
            this._element.runtimeStyle.display = old;
        }
        return rv;
    };
    this._list.addEventListener("change", function (e) {
        this.dispatchEvent("activechanged");
    }, this);
    this._list.addEventListener("mouseup", this._onListMouseUp, this);
    this._popup.add(this._list);
    if (this._pendingItems) {
        var l = this._pendingItems.length;
        for (var i = 0; i < l; i++) {
            var item = this._pendingItems[i];
            this._list.add(item[0], item[1], item[2]);
            if (item[0].getSelected()) {
                this._updateSelected();
            }
        }
    }
    this._list.setHideFocus(false);
    delete this._pendingItems;
};
_p.getSelectionModel = function () {
    return this._getList().getSelectionModel();
};
BiComboBox._popupPreferredWidth = function () {
    return this._parent._getListPreferredWidth();
};
BiComboBox._popupPreferredHeight = function () {
    return Math.min(this.getMaximumHeight(), Math.max(20, this._parent._list.getPreferredHeight()));
};
_p.add = function (oChild, oBefore, bAnonymous) {
    if (oChild instanceof BiComboBoxItem) {
        if (!this._list) {
            this._pendingItems.push([oChild, oBefore, bAnonymous]);
            if (oChild.getSelected()) this._updateSelected(false, oChild);
        } else {
            this._list.add(oChild, oBefore, bAnonymous);
            if (oChild.getSelected()) this._updateSelected();
        }
    } else {
        BiComponent.prototype.add.call(this, oChild, oBefore, bAnonymous);
    }
};
_p.remove = function (oChild) {
    if (oChild instanceof BiComboBoxItem) {
        var b = oChild.getSelected();
        this._getList().remove(oChild);
        if (oChild === this._typedMatch) {
            this._typedMatch = null;
        }
        if (oChild === this._partialTypeMatch) {
            this._partialTypeMatch = null;
        }
        if (b) this._updateSelected();
    } else {
        BiComponent.prototype.remove.call(this, oChild);
    }
};
_p.removeAll = function () {
    if (this._list) {
        this._getList().removeAll();
    } else {
        this.disposeFields("_pendingItems");
    }
    this._typedMatch = null;
    this._partialTypeMatch = null;
    this._updateSelected();
};
_p.getChildren = function () {
    return this._getList().getChildren();
};
_p.hasChildren = function () {
    return this._getList().hasChildren();
};
_p.getFirstChild = function () {
    return this._getList().getFirstChild();
};
_p.getLastChild = function () {
    return this._getList().getLastChild();
};
_p._ensurePopupAdded = function () {
    this.getPopup();
};
_p._getFocusElement = function () {
    return this._editable ? this.getTextField()._element : this._element;
};
BiComboBox.addProperty("selectedItem", BiAccessType.READ);
_p.setSelectedItem = function (oItem) {
    if (this._selectedItem != oItem) {
        if (oItem == null && this._selectedItem != null) this._selectedItem.__setSelected(false);
        if (oItem) oItem.__setSelected(true);
        this._updateSelected(true, oItem);
    }
};
_p.getSelectedIndex = function () {
    if (this._selectedItem) return this._getList().getChildren().indexOf(this._selectedItem);
    return -1;
};
_p.setSelectedIndex = function (n) {
    if (n == -1) this.setSelectedItem(null);
    else this.setSelectedItem(this._getList().getChildren()[n]);
};
BiComboBox.addProperty("userValue", BiAccessType.READ_WRITE);
BiComboBox.addProperty("value", BiAccessType.READ_WRITE);
_p.setValue = _p.setUserValue = function (oUserValue) {
    var item = this.findUserValueExact(oUserValue);
    if (item) this.setSelectedItem(item);
};
_p.getValue = _p.getUserValue = function () {
    var item = this.getSelectedItem();
    return item ? item.getUserValue() : null;
};
BiComboBox.addProperty("editable", BiAccessType.READ);
_p.setEditable = function (bEditable) {
    if (this._editable != bEditable) {
        var ti = this.getTabIndex();
        this._editable = bEditable;
        this.getTextField().setVisible(bEditable);
        if (bEditable) this._label.setText("");
        else this.getTextField().setText("");
        this.setTabIndex(ti);
        var tm = application.getThemeManager();
        tm.setStateValue(this, "editable", bEditable);
        tm.applyAppearance(this);
        this._typedMatch = null;
        if (this._selectedItem || this._list) this._updateSelected(true, this._selectedItem);
    }
};
_p.setEnabled = function (b) {
    this.getTextField().setEnabled(b);
    this._button.setEnabled(b);
    this._label.setEnabled(b);
    BiComponent.prototype.setEnabled.call(this, b);
    this._updateSelected();
};
_p.setRightToLeft = function (b) {
    BiComponent.prototype.setRightToLeft.call(this, b);
    this.getPopup().setRightToLeft(b);
    this._positionComponents();
};
_p.layoutAllChildren = function () {
    BiComponent.prototype.layoutAllChildren.call(this);
    this._positionComponents();
};
_p._positionComponents = function () {
    var b = this._button;
    var l = this._label;
    var tf = this._textField;
    var i = l.getIcon();
    if (this.getRightToLeft()) {
        b.setRight(null);
        b.setLeft(0);
        l.setLeft(17);
        l.setRight(1);
        if (tf) {
            tf.setLeft(17);
            tf.setRight(1 + (i ? i.getWidth() + l.getPaddingRight() : 0));
        }
    } else {
        b.setLeft(null);
        b.setRight(0);
        l.setLeft(1);
        l.setRight(17);
        if (tf) {
            tf.setRight(17);
            tf.setLeft(1 + (i ? i.getWidth() + l.getPaddingLeft() : 0));
        }
    }
    if (i && BiBrowserCheck.ie) l.setPaddingTop(0);
    else if (i && BiBrowserCheck.webkit) {
        tf.setPaddingLeft(2);
        if (/Chrome\//i.test(navigator.userAgent)) l.setPaddingTop(this._editable ? 1 : 2);
    }
};
_p.setDropDownVisible = function (bVisible) {
    this.getPopup().setVisible(bVisible);
};
_p.getDropDownVisible = function () {
    return this.getPopup().getIsVisible();
};
_p.setDropDownWidth = function (nWidth) {
    this._dropDownWidth = nWidth;
};
_p.getDropDownWidth = function () {
    return this._getListPreferredWidth();
};
_p.findString = function (sText, nStartIndex) {
    return this._getList().findString(sText, nStartIndex);
};
_p.findStringExact = function (sText, nStartIndex) {
    return this._getList().findStringExact(sText, nStartIndex);
};
_p.findUserValueExact = function (oUserValue, nStartIndex) {
    return this._getList().findUserValueExact(oUserValue, nStartIndex);
};
_p.findValueExact = function (oUserValue, nStartIndex) {
    return this.findUserValueExact(oUserValue, nStartIndex);
};
_p.getText = function () {
    if (this._editable) return this.getTextField().getText();
    else return this._label.getText();
};
_p.setText = function (s) {
    if (this._editable) return this.getTextField().setText(s);
    else return this._label.setText(s);
};
BiComboBox.addProperty("validator", BiAccessType.READ_WRITE);
BiComboBox.addProperty("invalidMessage", BiAccessType.READ_WRITE);
_p.getIsValid = function () {
    if (typeof this._validator != "function") return true;
    return this._validator(this.getText());
};
BiComboBox.createRegExpValidator = function (oRegExp) {
    return function (s) {
        return oRegExp.test(s);
    };
};
_p._selectOnTabFocus = function () {
    if (this._editable) this.getTextField().selectAll();
};
_p._getListPreferredWidth = function () {
    this._ensurePopupAdded();
    var w = this._dropDownWidth ? this._dropDownWidth : 0;
    return Math.max(this.getWidth(), w);
};
_p._preferredWidth = 100;
_p._computePreferredWidth = function () {
    this._ensurePopupAdded();
    var listW = this._getList().getPreferredWidth();
    var labelW = (this._editable ? this.getTextField().getLeft() + this.getTextField().getPreferredWidth() : this._label.getLeft() + this._label.getPreferredWidth() + 1) - (this.getRightToLeft() ? 16 : 0);
    return Math.max(listW, labelW) + 4 + 16;
};
_p._preferredHeight = 22;
_p._computePreferredHeight = function () {
    return Math.max(16, (this._editable ? this.getTextField().getPreferredHeight() : this._label.getPreferredHeight())) + 6;
};
_p._updateSelected = function (bDoNotSelect, selectedItem) {
    if (!selectedItem) {
        if (!this._getList()) return;
        selectedItem = this._getList().getSelectedItems()[0];
    }
    var changed = this._selectedItem != selectedItem;
    var si = this._selectedItem = selectedItem;
    var l = this._label;
    var tf = this.getTextField();
    if (si) {
        l.setFont(si.getFont());
        if (!isNaN(si.getPaddingRight())) l.setPaddingRight(si.getPaddingRight());
        l.setAlign(si.getAlign());
        if (!this._editable) {
            l.setIcon(si.getIcon());
            l.setIconTextGap(si.getIconTextGap());
            if (!isNaN(si.getPaddingLeft())) l.setPaddingLeft(si.getPaddingLeft());
            l.setHtml(si.getHtml());
        } else {
            tf = this.getTextField();
            this._setEditableIcon(si);
            tf.setText(si.getText());
            if (!bDoNotSelect && this.getFocused()) tf.selectAll();
        }
    } else {
        l.setIcon(null);
        l.setText("");
        if (tf) {
            if (this.getRightToLeft()) tf.setRight(1);
            else tf.setLeft(1);
        }
    }
    this._positionComponents();
    if (changed) {
        this.dispatchEvent("change");
        if (this._command) this._command.setUserValue(this.getUserValue());
    }
};
_p._setEditableIcon = function (oComboBoxItem) {
    var tf = this.getTextField();
    var l = this._label;
    var i = oComboBoxItem ? oComboBoxItem.getIcon() : null;
    l.setIcon(i);
    if (i) l.setIconTextGap(oComboBoxItem.getIconTextGap());
    if (this.getRightToLeft()) {
        l.setPaddingRight(oComboBoxItem ? oComboBoxItem.getPaddingRight() : 5);
        tf.setLeft(17);
        tf.setRight(l.getRight() + (i ? i.getWidth() + oComboBoxItem.getPaddingRight() : 0));
        tf.setPaddingRight(i ? oComboBoxItem.getIconTextGap() : (oComboBoxItem ? oComboBoxItem.getPaddingRight() : 5));
    } else {
        var pl = oComboBoxItem ? oComboBoxItem.getPaddingLeft() : 5;
        if (!isNaN(pl)) l.setPaddingLeft(pl);
        tf.setRight(17);
        tf.setLeft(l.getLeft() + (i ? i.getWidth() + oComboBoxItem.getPaddingLeft() : 0));
        pl = i ? oComboBoxItem.getIconTextGap() : (oComboBoxItem ? oComboBoxItem.getPaddingLeft() : 5);
        if (!isNaN(pl)) tf.setPaddingLeft(pl);
    }
};
_p._syncListWithTextField = function () {
    if (this._typedMatch) {
        this._getList().getSelectionModel().setItemSelected(this._typedMatch, true);
        this._getList().getSelectionModel().setLeadItem(this._typedMatch);
        this._typedMatch.scrollIntoView();
    } else if (this._partialTypeMatch) {
        this._getList().getSelectionModel().setItemSelected(this._partialTypeMatch, true);
        this._getList().getSelectionModel().setLeadItem(this._partialTypeMatch);
        this._partialTypeMatch.scrollIntoView();
    } else {
        var si = this._getList().getSelectedItems()[0];
        if (si) this._getList().getSelectionModel().setItemSelected(si, false);
        this._getList().getSelectionModel().setLeadItem(null);
    }
};
_p._onMouseDown = function (e) {
    if (e.getButton() != BiMouseEvent.LEFT) return;
    if ((!this._editable || this._button.contains(e.getTarget())) && !this.getPopup().contains(e.getTarget())) {
        var show = !this.getPopup().getIsVisible() && (new Date - this.getPopup().getHideTimeStamp() > 100);
        this.setFocused(true);
        this.getPopup().setVisible(show);
    }
};
_p._onPopupHide = function (e) {
    BiTimer.callOnce(function () {
        delete this._acceptsEnter;
        delete this._acceptsEsc;
    }, 0, this);
    if (!this._editable) this._label.setCssClassName("bi-label" + (this.getFocused() ? " focused" : ""));
    if (this._selectedItem && this._selectedItem != this._list.getSelectionModel().getSelectedItems()[0]) {
        this._list.getSelectionModel().deselectAll();
        this._list.getSelectionModel().setItemSelected(this._selectedItem, true);
    }
    if (BiBrowserCheck.quirks.mozDisappearingCaretBug) {
        this._savedOverflow = this._getList().getOverflow();
        this._getList().setOverflow(BiComponent.STYLE_HIDDEN);
    }
};
_p._onPopupShow = function (e) {
    if (this._mozScrollBarBugWorkaround) {
        delete this._mozScrollBarBugWorkaround;
        this._popup.removeStyleProperty("display");
    }
    if (BiBrowserCheck.quirks.mozDisappearingCaretBug) this._getList().setOverflow(this._savedOverflow || BiComponent.STYLE_AUTO);
    this._acceptsEnter = this._acceptsEsc = true;
    if (BiBrowserCheck.ie) {
        this._list.invalidateParentLayout("preferred");
    }
    this.getPopup().pack();
    var si = this.getSelectedItem();
    if (!this._editable) {
        this._label.setCssClassName("bi-label");
        if (si) {
            si.__setSelected(true);
        } else {
            this._getList().getSelectionModel().setLeadItem(null);
        }
    } else {
        if (si) {
            si.scrollIntoView();
        }
        this._syncListWithTextField();
    }
    this.getPopup().setHtmlProperty("className", this.getPopup().getHtmlProperty("className"));
};
_p._onListMouseUp = function (e) {
    if (e.getButton() != BiMouseEvent.LEFT || e.getTarget() == this._getList()) return;
    this._updateSelected();
    this.getPopup().setVisible(false);
    this._focusComponent();
};
_p._onKeyDown = function (e) {
    var popup = this.getPopup();
    var popupVisible = popup.getIsVisible();
    if (e.matchesBundleShortcut("popup.close") && popupVisible || e.matchesBundleShortcut("popup.toggle")) {
        popup.setVisible(!popupVisible);
        e.preventDefault();
    } else if (popupVisible) {
        if (e.matchesBundleShortcut("controls.accept")) {
            this._updateSelected();
            popup.setVisible(false);
            this._dispatchAction();
        } else if (e.getTarget() == this || e.getTarget() == this._textField) {
            this._scrollingList = true;
            this._list.getSelectionModel().handleKeyDown(e);
        }
    } else if (e.matchesBundleShortcut("selection.up") || e.matchesBundleShortcut("selection.down")) {
        popup.setVisible(true);
        e.preventDefault();
    } else if (e.matchesBundleShortcut("controls.accept")) this._dispatchAction();
};
_p._dispatchAction = function () {
    this.dispatchEvent("action");
    if (this._command) this._command.execute();
};
_p._onKeyPress = function (e) {
    if (!this._editable) {
        this._getList()._onKeyPress(e);
        if (!this._popup || !this._popup.getIsVisible()) this._updateSelected();
    }
};
_p._onTextChanged = function (e) {
    if (this._editable) {
        this._matchTextToItem();
        this.dispatchEvent("textchanged");
    }
};
_p._onTextChangeAutoComplete = function (e) {
    this._matchTextToItem();
    this._syncListWithTextField();
    this._setEditableIcon(this._getList().getSelectedItems()[0]);
    if (this._partialTypeMatch && !this.getPopup().getIsVisible()) {
        this.getPopup().setVisible(true);
    }
};
_p._matchTextToItem = function () {
    var item = this._getList().findStringExact(this.getTextField().getText());
    this._typedMatch = item;
    if (!item) {
        item = this._getList().findString(this.getTextField().getText());
        this._partialTypeMatch = item;
    } else this._partialTypeMatch = null;
};
_p._onFocus = function (e) {
    if (!this._editable) this._label.setCssClassName("bi-label" + (this.getPopup().getIsVisible() ? "" : " focused"));
    else this.getTextField().addEventListener("textchanged", this._onTextChangeAutoComplete, this);
};
_p._onBlur = function (e) {
    if (!this._editable) this._label.setCssClassName("bi-label");
    else this.getTextField().removeEventListener("textchanged", this._onTextChangeAutoComplete, this);
};
_p._onResize = function (e) {
    if (this._popup) this._popup.invalidateParentLayout(BiComponent.STRING_SIZE);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    if (this._pendingItems) {
        var l = this._pendingItems.length;
        var items = this._pendingItems;
        for (var i = 0; i < l; i++) {
            if (items[i] && items[i][0] instanceof BiComboBoxItem) {
                items[i][0].dispose();
            }
            items[i] = null;
        }
        delete this._pendingItems;
    }
    this.disposeFields("_list", "_popup", "_button", "_label", "_dataSource", "_textField");
    delete this._selectedItem;
    delete this._typedMatch;
    delete this._editable;
    delete this._acceptsEnter;
    delete this._acceptsEsc;
    delete this._invalidMessage;
    delete this._validator;
    delete this._scrollingList;
};
_p._syncWithCommand = function () {
    if (this._command) {
        this.setEnabled(this._command.getEnabled());
        this.setUserValue(this._command.getUserValue());
    }
};
_p.setDataSource = BiList.prototype.setDataSource;
_p.dataBind = BiList.prototype.dataBind;
_p._populateWithDataSource = BiList.prototype._populateWithDataSource;
_p.setCurrentDataPage = BiList.prototype.setCurrentDataPage;
_p.setDataPageSize = BiList.prototype.setDataPageSize;
_p._dataSource = null;
_p._dataTextField = null;
_p._dataUserValueField = null;
_p._dataPageSize = null;
_p._dataPageCount = 1;
_p._currentDataPage = 0;
BiComboBox.addProperty("dataTextField", BiAccessType.READ_WRITE);
BiComboBox.addProperty("dataUserValueField", BiAccessType.READ_WRITE);
BiComboBox.addProperty("dataSource", BiAccessType.READ);
BiComboBox.addProperty("dataPageSize", BiAccessType.READ);
BiComboBox.addProperty("dataPageCount", BiAccessType.READ);
BiComboBox.addProperty("currentDataPage", BiAccessType.READ);
_p.getDataValueField = _p.getDataUserValueField;
_p.setDataValueField = _p.setDataUserValueField;
_p.createItemFromDataRow = function (oRow) {
    return new BiComboBoxItem(oRow.getValueByName(this._dataTextField), oRow.getValueByName(this._dataUserValueField));
};

function BiComboBoxItem(sText, oUserValue) {
    if (_biInPrototype) return;
    BiListItem.call(this, sText, oUserValue);
}
_p = _biExtend(BiComboBoxItem, BiListItem, "BiComboBoxItem");
_p._onmouseover = function (e) {
    if (this._parent && this._parent._parent && this._parent._parent._parent && this._parent._parent._parent._scrollingList) {
        delete this._parent._parent._parent._scrollingList;
        return;
    }
    this.__setSelected(true);
};
_p._create = function (oDocument) {
    this.addEventListener("mouseover", this._onmouseover);
    BiListItem.prototype._create.call(this, oDocument);
};
_p.setSelected = function (bSelected) {
    if (this._selected != bSelected) {
        this.__setSelected(bSelected);
        if (this._parent && bSelected) {
            if (this._parent._parent && this._parent._parent._parent) this._parent._parent._parent._updateSelected();
        }
    }
};
_p.__setSelected = function (bSelected) {
    BiListItem.prototype.setSelected.call(this, bSelected);
    if (this._parent && bSelected) {
        this._parent.getSelectionModel().setLeadItem(this);
    }
    this.scrollIntoView();
};

function BiAutoComplete(oDataModel) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-combo-box");
    this.setAppearance("combo-box");
    this.setSize(100, 22);
    this.setHideFocus(true);
    this.setTabIndex(1);
    var tf = this._textField = new BiTextField;
    tf.setTabIndex(0);
    tf.setTop(1);
    tf.setBottom(1);
    BiComponent.prototype.add.call(this, tf, null, true);
    tf.addEventListener("textchanged", this._onTextChanged, this);
    this.addEventListener("keydown", this._onKeyDown, this);
    this.addEventListener("focus", this._onFocus, this);
    this.addEventListener("blur", this._onBlur, this);
    this._pendingItems = [];
    if (oDataModel && oDataModel.length) this.setDataModel(new BiArrayAutoCompleteDataModel(oDataModel));
    else this.setDataModel(oDataModel || new BiArrayAutoCompleteDataModel);
}
_p = _biExtend(BiAutoComplete, BiComponent, "BiAutoComplete");
_p._selectedItem = null;
_p._typedMatch = null;
_p._invalidMessage = "";
_p._validator = null;
BiAutoComplete.addProperty("dataModel", BiAccessType.READ);
_p.setDataModel = function (oDataModel) {
    if (this._dataModel) this._dataModel.removeEventListener("dataready", this._onDataReady, this);
    this._dataModel = oDataModel;
    this._dataModel.addEventListener("dataready", this._onDataReady, this);
};
_p.addItemText = function (sText) {
    this.add(new BiAutoCompleteItem(sText));
};
BiAutoComplete.addProperty("maximumItemNum", BiAccessType.READ);
BiAutoComplete.addProperty("popup", BiAccessType.READ);
_p.getPopup = function () {
    if (!this._popup) this._createPopup();
    return this._popup;
};
_p._getList = function () {
    if (!this._popup) this._createPopup();
    return this._list;
};
_p.getTextField = function () {
    return this._textField;
};
BiAutoComplete.addProperty("sortType", BiAccessType.READ_WRITE);
_p.setSortType = function (sType) {
    this._getList().setSortType(sType);
};
_p.getSortType = function () {
    return this._getList().getSortType();
};
BiAutoComplete.addProperty("sortFunction", BiAccessType.READ_WRITE);
_p.getSortFunction = function () {
    return this._getList().getSortFunction();
};
_p.setSortFunction = function (f) {
    this._getList().setSortFunction(f);
};
_p.sort = function (update) {
    return this._getList().sort(update);
};
_p._createPopup = function () {
    if (this._popup) return;
    this._popup = new BiPopup;
    this._popup._lazyCreate = false;
    this._popup.positionRelativeToComponent(this, "vertical");
    BiComponent.prototype.add.call(this, this._popup, null, true);
    this._popup.addEventListener("hide", this._onPopupHide, this);
    this._popup.addEventListener("show", this._onPopupShow, this);
    this._popup.setMaximumHeight(300);
    this._popup._computePreferredWidth = BiAutoComplete._popupPreferredWidth;
    this._popup.getPreferredHeight = BiAutoComplete._popupPreferredHeight;
    this._list = new BiList;
    this._list.setCssClassName("bi-combo-box-list");
    this._list.setAppearance("combo-box-list");
    this._list.setTabIndex(-1);
    this._list.setMultipleSelection(false);
    this._list.setLocation(0, 0);
    this._list.setRight(0);
    this._list.setBottom(0);
    this._list.addEventListener("change", function (e) {
        this.dispatchEvent("activechanged");
    }, this);
    this._list.addEventListener("mouseup", this._onListMouseUp, this);
    this._popup.add(this._list);
    if (this._pendingItems) {
        var l = this._pendingItems.length;
        for (var i = 0; i < l; i++) {
            var item = this._pendingItems[i];
            this._list.add(item[0], item[1], item[2]);
            if (item[0].getSelected()) {
                this._updateSelected();
            }
        }
    }
    this._list.setHideFocus(false);
    delete this._pendingItems;
    if (this._created) this._popup.pack();
};
_p.getSelectionModel = function () {
    return this._getList().getSelectionModel();
};
BiAutoComplete._popupPreferredWidth = function () {
    return this._parent._getListPreferredWidth();
};
BiAutoComplete._popupPreferredHeight = function () {
    return Math.min(this.getMaximumHeight(), Math.max(20, this._parent._list.getPreferredHeight()));
};
_p.add = function (oChild, oBefore, bAnonymous) {
    if (oChild instanceof BiAutoCompleteItem) {
        if (!this._list) {
            this._pendingItems.push([oChild, oBefore, bAnonymous]);
            if (oChild.getSelected()) this._updateSelected(false, oChild);
        } else {
            this._list.add(oChild, oBefore, bAnonymous);
            if (oChild.getSelected()) this._updateSelected();
        }
    } else {
        BiComponent.prototype.add.call(this, oChild, oBefore, bAnonymous);
    }
};
_p.remove = function (oChild) {
    if (oChild instanceof BiAutoCompleteItem) {
        var b = oChild.getSelected();
        this._getList().remove(oChild);
        if (oChild === this._typedMatch) {
            this._typedMatch = null;
        }
        if (oChild === this._partialTypeMatch) {
            this._partialTypeMatch = null;
        }
        if (b) this._updateSelected();
        if (this._created) this._popup.pack();
    } else {
        BiComponent.prototype.remove.call(this, oChild);
    }
};
_p.removeAll = function () {
    if (this._list) {
        this._getList().removeAll();
        if (this._created) this._popup.pack();
    } else {
        this.disposeFields("_pendingItems");
    }
    this._typedMatch = null;
    this._partialTypeMatch = null;
    this._updateSelected();
};
_p.getChildren = function () {
    return this._getList().getChildren();
};
_p.hasChildren = function () {
    return this._getList().hasChildren();
};
_p.getFirstChild = function () {
    return this._getList().getFirstChild();
};
_p.getLastChild = function () {
    return this._getList().getLastChild();
};
_p._ensurePopupAdded = function () {
    this.getPopup();
};
_p._getFocusElement = function () {
    return this.getTextField()._element;
};
BiAutoComplete.addProperty("selectedItem", BiAccessType.READ);
_p.setSelectedItem = function (oItem) {
    if (this._selectedItem != oItem) {
        if (oItem == null && this._selectedItem != null) this._selectedItem.__setSelected(false);
        if (oItem) oItem.__setSelected(true);
        this._updateSelected(true, oItem);
    }
};
_p.getSelectedIndex = function () {
    if (this._selectedItem) return this._getList().getChildren().indexOf(this._selectedItem);
    return -1;
};
_p.setSelectedIndex = function (n) {
    if (n == -1) this.setSelectedItem(null);
    else this.setSelectedItem(this._getList().getChildren()[n]);
};
BiAutoComplete.addProperty("userValue", BiAccessType.READ_WRITE);
BiAutoComplete.addProperty("value", BiAccessType.READ_WRITE);
_p.setValue = _p.setUserValue = function (oUserValue) {
    var item = this.findUserValueExact(oUserValue);
    if (item) this.setSelectedItem(item);
};
_p.getValue = _p.getUserValue = function () {
    var item = this.getSelectedItem();
    return item ? item.getUserValue() : null;
};
_p.setEnabled = function (b) {
    this.getTextField().setEnabled(b);
    BiComponent.prototype.setEnabled.call(this, b);
    this._updateSelected();
};
_p.setRightToLeft = function (b) {
    BiComponent.prototype.setRightToLeft.call(this, b);
    this.getPopup().setRightToLeft(b);
    this._positionComponents();
};
_p.layoutAllChildren = function () {
    BiComponent.prototype.layoutAllChildren.call(this);
    this._positionComponents();
};
_p._positionComponents = function () {
    var tf = this._textField;
    if (this.getRightToLeft()) {
        tf.setLeft(1);
        tf.setRight(1);
    } else {
        tf.setRight(1);
        tf.setLeft(1);
    }
};
_p.setDropDownVisible = function (bVisible) {
    this.getPopup().setVisible(bVisible);
};
_p.getDropDownVisible = function () {
    return this.getPopup().getIsVisible();
};
_p.setDropDownWidth = function (nWidth) {
    this._dropDownWidth = nWidth;
};
_p.getDropDownWidth = function () {
    return this._getListPreferredWidth();
};
_p.getText = function () {
    return this.getTextField().getText();
};
_p.setText = function (s) {
    return this.getTextField().setText(s);
};
BiAutoComplete.addProperty("validator", BiAccessType.READ_WRITE);
BiAutoComplete.addProperty("invalidMessage", BiAccessType.READ_WRITE);
_p.getIsValid = function () {
    if (typeof this._validator != "function") return true;
    return this._validator(this.getText());
};
BiAutoComplete.createRegExpValidator = function (oRegExp) {
    return function (s) {
        return oRegExp.test(s);
    };
};
_p._selectOnTabFocus = function () {
    this.getTextField().selectAll();
};
_p._getListPreferredWidth = function () {
    this._ensurePopupAdded();
    var w = this._dropDownWidth ? this._dropDownWidth : 0;
    return Math.max(this.getWidth(), w);
};
_p._preferredWidth = 100;
_p._computePreferredWidth = function () {
    this._ensurePopupAdded();
    var listW = BiList.prototype.getPreferredWidth.call(this._getList());
    var labelW = this.getTextField().getLeft() + this.getTextField().getPreferredWidth() - (this.getRightToLeft() ? 16 : 0);
    return Math.max(listW, labelW) + 4 + 16;
};
_p._preferredHeight = 22;
_p._computePreferredHeight = function () {
    return Math.max(16, this.getTextField().getPreferredHeight() + 6);
};
_p._updateSelected = function (bDoNotSelect, selectedItem) {
    if (!selectedItem) {
        if (!this._getList()) return;
        selectedItem = this._getList().getSelectedItems()[0];
    }
    var changed = this._selectedItem != selectedItem;
    var si = this._selectedItem = selectedItem;
    var tf = this._textField;
    if (si) {
        tf = this.getTextField();
        tf.setText(si.getText());
        if (!bDoNotSelect && this.getFocused()) tf.selectAll();
    } else {
        if (tf) {
            if (this.getRightToLeft()) tf.setRight(1);
            else tf.setLeft(1);
        }
    }
    this._positionComponents();
    if (changed) {
        this.dispatchEvent("change");
        if (this._command) this._command.setUserValue(this.getUserValue());
    }
};
_p._syncListWithTextField = function () {
    if (this._typedMatch) {
        this._getList().getSelectionModel().setItemSelected(this._typedMatch, true);
        this._getList().getSelectionModel().setLeadItem(this._typedMatch);
        this._typedMatch.scrollIntoView();
    } else if (this._partialTypeMatch) {
        this._getList().getSelectionModel().setItemSelected(this._partialTypeMatch, true);
        this._getList().getSelectionModel().setLeadItem(this._partialTypeMatch);
        this._partialTypeMatch.scrollIntoView();
    } else {
        var si = this._getList().getSelectedItems()[0];
        if (si) this._getList().getSelectionModel().setItemSelected(si, false);
        this._getList().getSelectionModel().setLeadItem(null);
    }
};
_p._onPopupHide = function (e) {
    BiTimer.callOnce(function () {
        delete this._acceptsEnter;
        delete this._acceptsEsc;
    }, 0, this);
};
_p._onPopupShow = function (e) {
    this._acceptsEnter = this._acceptsEsc = true;
    this.getPopup().pack();
    var si = this.getSelectedItem();
    if (si) {
        si.scrollIntoView();
    }
    this._syncListWithTextField();
    this.getPopup().setHtmlProperty("className", this.getPopup().getHtmlProperty("className"));
};
_p._onListMouseUp = function (e) {
    if (e.getButton() != BiMouseEvent.LEFT || e.getTarget() == this._getList()) return;
    this._updateSelected();
    this.getPopup().setVisible(false);
};
_p._onKeyDown = function (e) {
    var popup = this.getPopup();
    var popupVisible = popup.getIsVisible();
    if (e.matchesBundleShortcut("controls.cancel") && popupVisible || e.matchesBundleShortcut("popup.toggle")) {
        popup.setVisible(!popupVisible);
        e.preventDefault();
    } else if (popupVisible) {
        if (e.matchesBundleShortcut("controls.accept")) {
            this._updateSelected();
            popup.setVisible(false);
            this._dispatchAction();
        } else if (e.getTarget() == this || e.getTarget() == this._textField) {
            this._list.getSelectionModel().handleKeyDown(e);
        }
    } else if (e.matchesBundleShortcut("controls.accept")) this._dispatchAction();
};
_p._dispatchAction = function () {
    this.dispatchEvent("action");
    if (this._command) this._command.execute();
};
_p._onDataReady = function (e) {
    for (var i = 0; i < this._dataModel.getItemCount(); i++) this.addItemText(this._dataModel.getItem(i));
    this.setDropDownVisible(!!this._dataModel.getItemCount());
    this._popup.pack();
};
_p._onTextChanged = function (e) {
    this.removeAll();
    if (!this._textField.getText().length) this.setDropDownVisible(false);
    else var b = this._dataModel.prepareData(this._textField.getText());
    this.dispatchEvent("textchanged");
};
_p._onTextChangeAutoComplete = function (e) {
    this._syncListWithTextField();
    if (this._partialTypeMatch && !this.getPopup().getIsVisible()) {
        this.getPopup().setVisible(true);
    }
};
_p._onFocus = function (e) {
    this.getTextField().addEventListener("textchanged", this._onTextChangeAutoComplete, this);
};
_p._onBlur = function (e) {
    this.getTextField().removeEventListener("textchanged", this._onTextChangeAutoComplete, this);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    if (this._pendingItems) {
        var l = this._pendingItems.length;
        var items = this._pendingItems;
        for (var i = 0; i < l; i++) {
            if (items[i] && items[i][0] instanceof BiAutoCompleteItem) {
                items[i][0].dispose();
            }
            items[i] = null;
        }
        delete this._pendingItems;
    }
    this.disposeFields("_list", "_popup", "_dataSource", "_textField");
    delete this._selectedItem;
    delete this._typedMatch;
    delete this._acceptsEnter;
    delete this._acceptsEsc;
    delete this._invalidMessage;
    delete this._validator;
    delete this._searchStr;
};
_p._syncWithCommand = function () {
    if (this._command) {
        this.setEnabled(this._command.getEnabled());
        this.setUserValue(this._command.getUserValue());
    }
};
_p.setDataSource = BiList.prototype.setDataSource;
_p.dataBind = BiList.prototype.dataBind;
_p._populateWithDataSource = BiList.prototype._populateWithDataSource;
_p.setCurrentDataPage = BiList.prototype.setCurrentDataPage;
_p.setDataPageSize = BiList.prototype.setDataPageSize;
_p._dataSource = null;
_p._dataTextField = null;
_p._dataUserValueField = null;
_p._dataPageSize = null;
_p._dataPageCount = 1;
_p._currentDataPage = 0;
BiAutoComplete.addProperty("dataTextField", BiAccessType.READ_WRITE);
BiAutoComplete.addProperty("dataUserValueField", BiAccessType.READ_WRITE);
BiAutoComplete.addProperty("dataSource", BiAccessType.READ);
BiAutoComplete.addProperty("dataPageSize", BiAccessType.READ);
BiAutoComplete.addProperty("dataPageCount", BiAccessType.READ);
BiAutoComplete.addProperty("currentDataPage", BiAccessType.READ);
_p.getDataValueField = _p.getDataUserValueField;
_p.setDataValueField = _p.setDataUserValueField;
_p.createItemFromDataRow = function (oRow) {
    return new BiAutoCompleteItem(oRow.getValueByName(this._dataTextField), oRow.getValueByName(this._dataUserValueField));
};

function BiAbstractAutoCompleteDataModel() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
};
_p = _biExtend(BiAbstractAutoCompleteDataModel, BiEventTarget, "BiAbstractAutoCompleteDataModel");
_p.dispatchDataReady = function (oData) {
    var e = new BiEvent("dataready");
    e.setUserData(oData);
    this.dispatchEvent(e);
    e.dispose();
};
_p.getItemCount = function () {
    return 0;
};
_p.getItem = function (nIndex) {
    return null;
};
_p.prepareData = function (sText) {
};

function BiArrayAutoCompleteDataModel(aData) {
    if (_biInPrototype) return;
    BiAbstractAutoCompleteDataModel.call(this);
    this._data = aData || [];
};
_p = _biExtend(BiArrayAutoCompleteDataModel, BiAbstractAutoCompleteDataModel, "BiArrayAutoCompleteDataModel");
BiArrayAutoCompleteDataModel.addProperty("data", BiAccessType.READ_WRITE);
BiArrayAutoCompleteDataModel.addProperty("caseSensitive", BiAccessType.READ_WRITE);
_p.getItemCount = function () {
    return this._currentData ? this._currentData.length : 0;
};
_p.getItem = function (nIndex) {
    return this._currentData[nIndex];
};
_p.prepareData = function (sText) {
    this._currentData = [];
    if (!this._caseSensitive) sText = sText.toLowerCase();
    for (var i = 0; i < this._data.length; i++) {
        var d = this._data[i];
        var lcased = d && !this._caseSensitive ? d.toLowerCase() : d;
        if (lcased.indexOf(sText) == 0) this._currentData.push(d);
    }
    this.dispatchDataReady();
};

function BiAutoCompleteItem(sText, oUserValue) {
    if (_biInPrototype) return;
    BiListItem.call(this, sText, oUserValue);
}
_p = _biExtend(BiAutoCompleteItem, BiListItem, "BiAutoCompleteItem");
_p._onmouseover = function (e) {
    this.__setSelected(true);
};
_p._create = function (oDocument) {
    this.addEventListener("mouseover", this._onmouseover);
    BiListItem.prototype._create.call(this, oDocument);
};
_p.setSelected = function (bSelected) {
    if (this._selected != bSelected) {
        this.__setSelected(bSelected);
        if (this._parent && bSelected) {
            if (this._parent._parent && this._parent._parent._parent) this._parent._parent._parent._updateSelected();
        }
    }
};
_p.__setSelected = function (bSelected) {
    BiListItem.prototype.setSelected.call(this, bSelected);
    if (this._parent && bSelected) {
        this._parent.getSelectionModel().setLeadItem(this);
    }
    this.scrollIntoView();
};

function BiSplitPane(sOrientation, oLeftComponent, oRightComponent) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setSize(200, 200);
    this._ghost = new BiComponent;
    this._ghost.setBackColor("threeddarkshadow");
    this._ghost.setOpacity(0.5);
    this._divider = new BiMoveHandle(this._divider, this._ghost);
    this._divider.setContinuousLayout(true);
    this.add(this._divider, null, true);
    this.setOrientation(sOrientation || "horizontal");
    if (oLeftComponent) this.setLeftComponent(oLeftComponent);
    if (oRightComponent) this.setRightComponent(oRightComponent);
    this._divider.addEventListener("move", this._onDividerMove, this);
    this._divider.addEventListener("moveend", this._onDividerMoveEnd, this);
    if (BiBrowserCheck.moz) this._divider.addEventListener("create", this._mozAddTextToDivider);
    if (!BiBrowserCheck.ie) this._divider.addEventListener("beforemove", this._onDividerBeforeMove, this);
}
_p = _biExtend(BiSplitPane, BiComponent, "BiSplitPane");
_p._leftComponent = null;
_p._rightComponent = null;
_p._orientation = null;
_p._dividerLocation = 100;
_p._desiredDividerLocation = 100;
_p._dividerSize = null;
_p._continuousLayout = true;
_p._leftVisible = true;
_p._rightVisible = true;
_p._mozAddTextToDivider = function (e) {
    var sp = this._document.createElement("SPAN");
    sp.appendChild(this._document.createTextNode(String.fromCharCode(160)));
    sp.style.fontSize = "1px";
    sp.style.MozUserSelect = "none";
    this._element.appendChild(sp);
};
BiSplitPane.addProperty("continuousLayout", BiAccessType.READ_WRITE);
_p.setContinuousLayout = function (b) {
    this._continuousLayout = b;
    this._divider.setContinuousLayout(b);
};
BiSplitPane.addProperty("ghost", BiAccessType.READ_WRITE);
_p.setGhost = function (o) {
    if (this._ghost) {
        this._ghost.dispose();
    }
    this._ghost = o;
    this._divider.setGhost(this._ghost);
    this._makeGhostOpaque();
};
_p._makeGhostOpaque = function () {
    if (!BiBrowserCheck.ie) return;
    if (this._leftComponent instanceof BiIframe || this._rightComponent instanceof BiIframe) {
        if (this._ghostOpaqueIframe) return;
        var ghostOpaqueIframe = this._ghostOpaqueIframe = new BiIframe(application.getPath() + "blank.html");
        ghostOpaqueIframe.setHtmlProperty("allowTransparency", false);
        ghostOpaqueIframe.setProperties({
            opacity: 0,
            left: -2,
            right: -2,
            top: -2,
            bottom: -2
        });
        this._ghost.add(ghostOpaqueIframe, this._ghost.getFirstChild(), true);
    } else if (this._ghostOpaqueIframe) {
        this._ghost.remove(this._ghostOpaqueIframe);
        this._ghostOpaqueIframe = null;
    }
};

BiSplitPane.addProperty("orientation", BiAccessType.READ);
_p.setOrientation = function (s) {
    if (this._orientation != s) {
        this._orientation = s;
        this._divider.setMoveDirection(s);
        if (s == "horizontal") {
            this._divider.setCursor(BiResizeHandle._getCursor("e"));
            this._divider.setLeft(null);
            this._divider.setRight(null);
            this._divider.setTop(0);
            this._divider.setBottom(0);
        } else {
            this._divider.setCursor(BiResizeHandle._getCursor("s"));
            this._divider.setLeft(0);
            this._divider.setRight(0);
            this._divider.setTop(null);
            this._divider.setBottom(null);
        }
        this._divider.setAppearance("split-pane-" + s + "-divider");
        this.invalidateLayout();
    }
};
BiSplitPane.addProperty("fixedComponent", BiAccessType.READ);
_p.setFixedComponent = function (s) {
    var newVal;
    switch (s) {
        case "left":
        case "right":
        case "none":
            newVal = s;
            break;
        case "second":
        case "bottom":
            newVal = "right";
            break;
        default:
            newVal = "left";
    }
    if (newVal != this._fixedComponent) {
        this._fixedComponent = newVal;
        if (newVal == "left") this._updateActualDividerLocation();
        if (this._created) {
            this._desiredDividerLocation = this._dividerLocation;
            this._updateDesiredRight();
        }
    }
};
BiSplitPane.addProperty("dividerLocation", BiAccessType.READ);
_p.setDividerLocation = function (n) {
    if (n != this._dividerLocation) {
        this._dividerLocation = n;
        this._desiredDividerLocation = n;
        if (this._created) this._updateDesiredRight();
        else this.addEventListener("create", this._updateDesiredRight);
        this.invalidateLayout();
        this.dispatchEvent("dividerlocationchanged");
    }
};
_p._updateDesiredRight = function () {
    var cs = this._orientation == "horizontal" ? this.getClientWidth() : this.getClientHeight();
    this._desiredRight = cs - this._dividerSize - this._desiredDividerLocation;
};
BiSplitPane.addProperty("dividerLocationPercent", BiAccessType.READ);
_p.setDividerLocationPercent = function (n) {
    this.setFixedComponent("none");
    this._dividerLocationPercent = n;
    if (this._created) this._updateLocationPercent();
    else this.addEventListener("create", this._updateLocationPercent);
};
_p._updateLocationPercent = function () {
    var clientSize = this._orientation == "horizontal" ? this.getClientWidth() : this.getClientHeight();
    var dividerLocation = (clientSize - this._dividerSize) / 100 * this._dividerLocationPercent;
    this.setDividerLocation(dividerLocation);
};
_p.setDividerSize = function (n) {
    if (this._dividerSize != n) {
        this._dividerSize = n;
        this.invalidateLayout();
    }
};
_p.getDividerSize = function () {
    if (this._dividerSize != null) return this._dividerSize;
    var t = application.getThemeManager().getDefaultTheme();
    if (this.getOrientation() == "vertical") return t.getAppearanceProperty("split-pane-vertical-divider", "preferredHeight") || 3;
    else return t.getAppearanceProperty("split-pane-horizontal-divider", "preferredWidth") || 3;
};
BiSplitPane.addProperty("leftComponent", BiAccessType.READ);
_p.setLeftComponent = function (c) {
    var old = this._leftComponent;
    if (old != c) {
        if (old) this.remove(old);
        this._leftComponent = c;
        if (c == this._rightComponent) this._rightComponent = null;
        else if (c) this.add(c, this._rightComponent || this._divider);
        this.invalidateLayout();
        this._makeGhostOpaque();
    }
};
BiSplitPane.addProperty("rightComponent", BiAccessType.READ);
_p.setRightComponent = function (c) {
    var old = this._rightComponent;
    if (old != c) {
        if (old) this.remove(old);
        this._rightComponent = c;
        if (c == this._leftComponent) this._leftComponent = null;
        else if (c) this.add(c, this._divider);
        this.invalidateLayout();
        this._makeGhostOpaque();
    }
};
_p.setTopComponent = function (c) {
    this.setLeftComponent(c);
};
_p.getTopComponent = function () {
    return this.getLeftComponent();
};
_p.setBottomComponent = function (oComponent) {
    this.setRightComponent(oComponent);
};
_p.getBottomComponent = function () {
    return this.getRightComponent();
};
BiSplitPane.addProperty("leftVisible", BiAccessType.READ);
_p.setLeftVisible = function (b) {
    if (this._leftVisible != b) {
        this._leftVisible = b;
        this.invalidateLayout();
    }
};
_p.setTopVisible = function (b) {
    this.setLeftVisible(b);
};
_p.getTopVisible = function () {
    return this.getLeftVisible();
};
BiSplitPane.addProperty("rightVisible", BiAccessType.READ);
_p.setRightVisible = function (b) {
    if (this._rightVisible != b) {
        this._rightVisible = b;
        this.invalidateLayout();
    }
};
_p.setBottomVisible = function (b) {
    this.setRightVisible(b);
};
_p.getBottomVisible = function () {
    return this.getRightVisible();
};
_p._makeDividerOnTop = function () {
    var max = 0;
    var lc = this._leftComponent;
    var rc = this._rightComponent;
    if (lc) max = Math.max(max, lc.getZIndex());
    if (rc) max = Math.max(max, rc.getZIndex());
    this._divider.setZIndex(max + 1);
};
_p._onDividerBeforeMove = function (e) {
    if (this._leftComponentCover == null) {
        var lcc = this._leftComponentCover = new BiComponent();
        lcc.setProperties({
            backColor: "transparent"
        });
        this.add(lcc);
        var rcc = this._rightComponentCover = new BiComponent();
        rcc.setProperties({
            backColor: "transparent"
        });
        this.add(rcc);
    }
    var lc = this._leftComponent;
    var rc = this._rightComponent;
    this._leftComponentCover.setProperties({
        left: lc.getLeft(),
        top: lc.getTop(),
        width: lc.getWidth(),
        height: lc.getHeight()
    });
    this._rightComponentCover.setProperties({
        left: rc.getLeft(),
        top: rc.getTop(),
        width: rc.getWidth(),
        height: rc.getHeight()
    });
};
_p._onDividerMove = function (e) {
    var isForValidReason = e instanceof BiMoveEvent;
    if (!isForValidReason) return;
    if (this._continuousLayout) {
        this._updateActualDividerLocation();
        this.invalidateLayout();
    }
};
_p._onDividerMoveEnd = function (e) {
    this._updateActualDividerLocation();
    if (!BiBrowserCheck.ie) {
        var lcc = this._leftComponentCover;
        var rcc = this._rightComponentCover;
        if (lcc) this.remove(lcc);
        if (rcc) this.remove(rcc);
        this._leftComponentCover = null;
        this._rightComponentCover = null;
    }
    this.invalidateLayout();
};
_p._updateActualDividerLocation = function () {
    var d = this._divider;
    var v = this._orientation == "horizontal" ? this.getRightToLeft() ? d.getRight() : d.getLeft() : d.getTop();
    v = this._getValueInRange(v);
    this.setDividerLocation(v);
};
_p._getValueInRange = function (n) {
    var lc = this._leftComponent;
    var rc = this._rightComponent;
    var lv = lc && this._leftVisible;
    var rv = rc && this._rightVisible;
    if (this._created) {
        if (lv) {
            n = Math.max(n, this._orientation == "horizontal" ? lc.getMinimumWidth() : lc.getMinimumHeight());
        }
        if (rv) {
            n = Math.min(n, this._orientation == "horizontal" ? this.getClientWidth() - this.getDividerSize() - rc.getMinimumWidth() : this.getClientHeight() - this.getDividerSize() - rc.getMinimumHeight());
        }
        var dividerSize = lv && rv ? this.getDividerSize() : 0;
        if (this._orientation == "horizontal") n = Math.min(n, this.getClientWidth() - dividerSize);
        else n = Math.min(n, this.getClientHeight() - dividerSize);
    }
    n = Math.max(n, 0);
    return n;
};
_p._getLeftMinSize = function () {
    var lc = this._leftComponent;
    if (lc) {
        if (this._orientation == "horizontal") return lc.getMinimumWidth();
        else return lc.getMinimumHeight();
    }
    return 0;
};
_p._getRightMinSize = function () {
    var rc = this._rightComponent;
    if (rc) {
        if (this._orientation == "horizontal") return rc.getMinimumWidth();
        else return rc.getMinimumHeight();
    }
    return 0;
};
_p.getMinimumWidth = function () {
    if (this._minimumWidth != null) return this._minimumWidth;
    var min;
    if (this._orientation == "horizontal") min = this._getLeftMinSize() + this.getDividerSize() + this._getRightMinSize();
    else {
        var lc = this._leftComponent;
        var rc = this._rightComponent;
        min = Math.max(lc ? lc.getMinimumWidth() : 0, rc ? rc.getMinimumWidth() : 0);
    }
    return Math.max(this._minimumWidth, min);
};
_p.getMinimumHeight = function () {
    if (this._minimumHeight != null) return this._minimumHeight;
    var min;
    if (this._orientation != "horizontal") min = this._getLeftMinSize() + this.getDividerSize() + this._getRightMinSize();
    else {
        var lc = this._leftComponent;
        var rc = this._rightComponent;
        min = Math.max(lc ? lc.getMinimumHeight() : 0, rc ? rc.getMinimumHeight() : 0);
    }
    return Math.max(this._minimumHeight, min);
};
_p.layoutAllChildren = function () {
    var lc = this._leftComponent;
    var rc = this._rightComponent;
    var lv = lc && this._leftVisible;
    var rv = rc && this._rightVisible;
    if (lv && !lc.getCreated() || rv && !rc.getCreated() || !this._divider.getCreated()) {
        this.invalidateLayout();
        return;
    }
    var cw = this.getClientWidth();
    var ch = this.getClientHeight();
    this._divider.setVisible(lv && rv);
    if (lc) lc.setVisible(lv);
    if (rc) rc.setVisible(rv);
    var dividerSize = lv && rv ? this.getDividerSize() : 0;
    var rtl = this.getRightToLeft();
    var changedL, changedD, changedR;
    var n = this._desiredDividerLocation;
    var availableSize = (this._orientation == "horizontal" ? cw : ch) - dividerSize;
    if (rv && lv) {
        var r = this._desiredRight;
        switch (this._fixedComponent) {
            case "right":
                n = availableSize - r;
                break;
            case "none":
                n = n * availableSize / (r + n);
        }
    }
    n = this._getValueInRange(n);
    if (this._orientation == "horizontal") {
        if (lv) {
            if (rv) {
                if (rtl) changedL = this._layoutChild2(lc, cw - n, 0, n, ch);
                else changedL = this._layoutChild2(lc, 0, 0, n, ch);
            } else {
                changedL = this._layoutChild2(lc, 0, 0, cw, ch);
            }
        }
        if (lv && rv) {
            if (rtl) changedD = this._layoutChild2(this._divider, cw - n - dividerSize, 0, dividerSize, ch);
            else changedD = this._layoutChild2(this._divider, n, 0, dividerSize, ch);
        }
        if (rv) {
            if (lv) {
                if (rtl) changedR = this._layoutChild2(rc, 0, 0, cw - n - dividerSize, ch);
                else changedR = this._layoutChild2(rc, n + dividerSize, 0, cw - n - dividerSize, ch);
            } else {
                changedR = this._layoutChild2(rc, 0, 0, cw, ch);
            }
        }
    } else {
        if (lv) {
            if (rv) changedL = this._layoutChild2(lc, 0, 0, cw, n);
            else changedL = this._layoutChild2(lc, 0, 0, cw, ch);
        }
        if (lv && rv) {
            changedD = this._layoutChild2(this._divider, 0, n, cw, dividerSize);
        }
        if (rv) {
            if (lv) changedR = this._layoutChild2(rc, 0, n + dividerSize, cw, ch - n - dividerSize);
            else changedR = this._layoutChild2(rc, 0, 0, cw, ch);
        }
    }
    if (changedL) lc.invalidateLayout();
    if (changedD) this._divider.invalidateLayout();
    if (changedR) rc.invalidateLayout();
};
_p.addParsedObject = function (o) {
    if (o instanceof BiComponent) {
        if (!this.getLeftComponent()) this.setLeftComponent(o);
        else if (!this.getRightComponent()) this.setRightComponent(o);
    } else BiComponent.prototype.addParsedObject.call(this, o);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this.disposeFields("_ghost", "_divider");
};

function BiStatusBar() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-status-bar");
    this.setAppearance("status-bar");
    this.setLeft(0);
    this.setRight(0);
    this.setBottom(0);
    this.setHeight(20);
};
_p = _biExtend(BiStatusBar, BiComponent, "BiStatusBar");
_p._preferredHeight = 20;

function BiStatusBarPanel(sText) {
    if (_biInPrototype) return;
    BiLabel.call(this, sText);
    this.setCssClassName("bi-status-bar-panel");
    this.setAppearance("status-bar-panel");
    this.setTop(0);
    this.setBottom(0);
};
_p = _biExtend(BiStatusBarPanel, BiLabel, "BiStatusBarPanel");

function BiToolBar() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-tool-bar");
    this.setAppearance("tool-bar");
}
_p = _biExtend(BiToolBar, BiComponent, "BiToolBar");
_p._computePreferredHeight = function () {
    if (this._children.length > 0) {
        var max = 0;
        for (var i = 0; i < this._children.length; i++) {
            var ph = this._children[i].getPreferredHeight();
            if (ph > max) max = ph;
        }
        return max + this.getInsetTop() + this.getInsetBottom();
    }
    return BiComponent.prototype._computePreferredHeight.call(this);
};
_p.layoutComponent = function () {
    var cs = this._children;
    var l = cs.length;
    if (l > 0 && !this._height && (this._bottom == null || this._top == null)) {
        this._height = this.getPreferredHeight();
    }
    BiComponent.prototype.layoutComponent.call(this);
};

function BiToolBarButton(sText, oIcon) {
    if (_biInPrototype) return;
    BiButton.call(this, sText);
    delete this._label._right;
    delete this._label._bottom;
    this.setTabIndex(-1);
    this.setCanSelect(false);
    this.setIcon(oIcon);
    this.removeEventListener("click", this._onClick);
    this.addEventListener("mouseover", this._onMouseOver);
    this.addEventListener("mouseout", this._onMouseOut);
    this.addEventListener("mousedown", this._onMouseDown);
    this.addEventListener("mouseup", this._onMouseUp);
    this.addEventListener("keypress", this._onKeyPress);
    this.setCssClassName("bi-tool-bar-button");
    this.setAppearance("button");
}
_p = _biExtend(BiToolBarButton, BiButton, "BiToolBarButton");
_p._minimumWidth = null;
_p._minimumHeight = null;
_p._themeKey = BiTheme.KEYS.toolBarButton;
_p._top = 0;
_p._bottom = 0;
_p._checked = false;
_p._mouseDown = false;
_p._hover = false;
_p._droppedDown = false;
_p.setEnabled = function (b) {
    BiLabel.prototype.setEnabled.call(this, b);
    if (!b && (this._mouseDown || this._hover || this._droppedDown)) {
        this._mouseDown = false;
        this._hover = false;
        this._droppedDown = false;
        this._updateState();
    }
};
_p._updateState = function () {
    var tm = application.getThemeManager();
    if (this._checked) tm.addState(this, "checked");
    else tm.removeState(this, "checked");
    if (this._mouseDown && this._hover || this._droppedDown) tm.addState(this, "active");
    else tm.removeState(this, "active");
    if (this._hover) tm.addState(this, "hover");
    else tm.removeState(this, "hover");
    tm.applyAppearance(this);
};
_p._onMouseOver = function (e) {
    var rel = e.getRelatedTarget();
    if (!this.getIsEnabled() || !this.contains(e.getTarget()) || rel && this.contains(rel)) return;
    this._hover = true;
    this._updateState();
};
_p._onMouseOut = function (e) {
    var rel = e.getRelatedTarget();
    if (!this.getIsEnabled() || !this.contains(e.getTarget()) || rel && this.contains(rel)) return;
    this._hover = false;
    this._updateState();
};
_p._onMouseDown = function (e) {
    if (!this.getIsEnabled() || e.getButton() != BiMouseEvent.LEFT) return;
    this._mouseDown = true;
    this._updateState();
    this.setCapture(true);
    this.addEventListener("losecapture", this._onlosecapture);
};
_p._onMouseUp = function (e) {
    if (!this.getIsEnabled() || e.getButton() != BiMouseEvent.LEFT) return;
    this.removeEventListener("losecapture", this._onlosecapture);
    this.setCapture(false);
    var click = this._mouseDown && this._hover;
    this._mouseDown = false;
    this._updateState();
    if (click) this._onClick(e);
};
_p._onlosecapture = function (e) {
    this.removeEventListener("losecapture", this._onlosecapture);
    this.setCapture(false);
    this._mouseDown = false;
    this._updateState();
};
_p._onClick = function (e) {
    this._dispatchAction();
};
_p._onKeyDown = function (e) {
};
_p._onKeyUp = function (e) {
    if (e.matchesBundleShortcut("controls.toggle")) this._dispatchAction();
};
_p._onKeyPress = function (e) {
    if (e.matchesBundleShortcut("controls.accept")) this._dispatchAction();
};
_p._dispatchAction = function () {
    this.dispatchEvent("action");
    if (this._command) this._command.execute();
};

function BiToolBarToggleButton(sText, oIcon, bChecked) {
    if (_biInPrototype) return;
    BiToolBarButton.call(this, sText, oIcon);
    this.setChecked(Boolean(bChecked));
}
_p = _biExtend(BiToolBarToggleButton, BiToolBarButton, "BiToolBarToggleButton");
_p._checked = false;
_p._userValue = null;
BiToolBarToggleButton.addProperty("checked", BiAccessType.READ);
_p.setChecked = function (b) {
    if (this._checked != b) {
        this._checked = b;
        this._updateState();
        this.dispatchEvent("change");
        if (this._command) this._command.setChecked(b);
    }
};
_p.getValue = _p.getChecked;
_p.setValue = _p.setChecked;
BiToolBarToggleButton.addProperty("userValue", BiAccessType.READ);
_p.setUserValue = function (v) {
    if (this._userValue != v) {
        this._userValue = v;
        if (this._command) this._command.setUserValue(v);
    }
};
_p._onClick = function (e) {
    this.setChecked(!this.getChecked());
    this._dispatchAction();
};
_p._onKeyPress = function (e) {
    if (e.matchesBundleShortcut("controls.accept")) {
        this.setChecked(!this.getChecked());
        this._dispatchAction();
    }
};
_p._onKeyUp = function (e) {
    if (e.matchesBundleShortcut("controls.toggle")) {
        this.setChecked(!this.getChecked());
        this._dispatchAction();
    }
};
_p._syncWithCommand = function () {
    if (this._command) {
        this.setEnabled(this._command.getEnabled());
        this.setChecked(this._command.getChecked());
        this.setUserValue(this._command.getUserValue());
    }
};

function BiToolBarRadioButton(sText, oIcon, bChecked) {
    if (_biInPrototype) return;
    BiToolBarToggleButton.call(this, sText, oIcon, bChecked);
}
_p = _biExtend(BiToolBarRadioButton, BiToolBarToggleButton, "BiToolBarRadioButton");
_p._group = null;
_p.setChecked = function (b) {
    if (this._checked != b) {
        if (this._group && b) this._group.setSelected(this);
        BiToolBarToggleButton.prototype.setChecked.call(this, b);
    }
};
BiToolBarRadioButton.addProperty("group", BiAccessType.READ);
_p.setGroup = function (oRadioGroup) {
    if (this._group != oRadioGroup) {
        if (this._group) this._group.remove(this);
        this._group = oRadioGroup;
        if (this._group) this._group.add(this);
    }
};
_p._onClick = function (e) {
    this.setChecked(true);
    this._dispatchAction();
};
_p._onKeyDown = function (e) {
    if (this._group) {
        if (e.matchesBundleShortcut("selection.up") || e.matchesBundleShortcut("selection.left")) {
            this._group.selectPrevious(this);
            e.preventDefault();
        } else if (e.matchesBundleShortcut("selection.down") || e.matchesBundleShortcut("selection.right")) {
            this._group.selectNext(this);
            e.preventDefault();
        }
    }
};
_p._onKeyPress = function (e) {
    if (e.matchesBundleShortcut("controls.accept")) {
        this.setChecked(true);
        this._dispatchAction();
    }
};
_p._onKeyUp = function (e) {
    if (e.matchesBundleShortcut("controls.toggle")) {
        this.setChecked(true);
        this._dispatchAction();
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiToolBarToggleButton.prototype.dispose.call(this);
    if (this._group) {
        this._group.remove(this);
    }
    delete this._group;
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
        case "group":
            if (sValue.charAt(0) == "#") sValue = sValue.substr(1);
            var c = oParser.getComponentById(sValue);
            this.setGroup(c);
            break;
        default:
            BiLabel.prototype.setAttribute.apply(this, arguments);
    }
};

function BiToolBarMenuButton(sText, oIcon, oMenu) {
    if (_biInPrototype) return;
    BiToolBarButton.call(this, sText, oIcon);
    this.setCssClassName("bi-tool-bar-menu-button");
    this.setAppearance("button");
    this.setMenu(oMenu);
    this._dropDownArrowImage = new BiComponent;
    this._dropDownArrowImage.setAppearance("tool-bar-menu-button-drop-down-arrow");
    this.add(this._dropDownArrowImage);
}
_p = _biExtend(BiToolBarMenuButton, BiToolBarButton, "BiToolBarMenuButton");
_p._menu = null;
BiToolBarMenuButton.addProperty("menu", BiAccessType.READ);
_p.setMenu = function (oMenu) {
    if (this._menu != oMenu) {
        if (this._menu) this._menu.removeEventListener("hide", this._onhide, this);
        this._menu = oMenu;
        if (this._menu) this._menu.addEventListener("hide", this._onhide, this);
    }
};
_p.layoutAllChildren = function () {
    this._layoutDropDownArrow();
    BiToolBarButton.prototype.layoutAllChildren.call(this);
};
_p._layoutDropDownArrow = function () {
    var deltaX = this._droppedDown ? 1 : 0;
    var deltaY = this._droppedDown ? 1 : 0;
    if (this.getRightToLeft()) this._dropDownArrowImage.setLeft(3 - deltaX);
    else this._dropDownArrowImage.setRight(3 - deltaX);
    this._dropDownArrowImage.setTop(1 + deltaY);
    this._dropDownArrowImage.setBottom(1 - deltaY);
};
_p._updateState = function () {
    BiToolBarButton.prototype._updateState.call(this);
    this._layoutDropDownArrow();
};
_p.setText = function (sText) {
    BiToolBarButton.prototype.setText.call(this, sText);
    this._dropDownArrowImage.invalidateParentLayout();
};
_p.setEnabled = function (b) {
    BiToolBarButton.prototype.setEnabled.call(this, b);
    this._dropDownArrowImage.setEnabled(b);
};
_p._toggleMenu = function () {
    if (this._menu.getIsVisible() || new Date - this._menu.getHideTimeStamp() < 100) {
        this._mouseDown = false;
        this._droppedDown = false;
        this._updateState();
    } else {
        this._mouseDown = true;
        this._droppedDown = true;
        this._updateState();
        this._menu.popupAtComponent(this, true);
    }
};
_p._toggleMenuOnMouse = function (e) {
    if (this.getIsEnabled() && e.getButton() == BiMouseEvent.LEFT) {
        if (!this._hideFlag) {
            this._menu.popupAtComponent(this);
        }
    }
};
_p._onMouseDown = function (e) {
    this._toggleMenuOnMouse(e);
};
_p._onKeyDown = function (e) {
    if (e.matchesBundleShortcut("selection.down") || e.matchesBundleShortcut("selection.up")) {
        this._toggleMenu();
        e.preventDefault();
    }
    BiToolBarButton.prototype._onKeyDown.call(this, e);
};
_p._onKeyUp = function (e) {
    if (e.matchesBundleShortcut("controls.toggle")) {
        this._toggleMenu();
    }
    BiToolBarButton.prototype._onKeyUp.call(this, e);
};
_p._onKeyPress = function (e) {
    if (e.matchesBundleShortcut("controls.accept")) {
        this._toggleMenu();
    }
    BiToolBarButton.prototype._onKeyPress.call(this, e);
};
_p._onhide = function (e) {
    this._hideFlag = true;
    BiTimer.callOnce(function () {
        this._hideFlag = false;
    }, 0, this);
    this._droppedDown = false;
    this._mouseDown = false;
    this._updateState();
};
_p.addParsedObject = function (o) {
    if (o instanceof BiMenu) this.setMenu(o);
    else BiToolBarButton.prototype.addParsedObject.call(this, o);
};

function BiToolBarSeparator() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-tool-bar-separator");
    this.setWidth(8);
    this.setTop(0);
    this.setBottom(0);
    this._line = new BiComponent;
    this._line.setCssClassName("bi-tool-bar-separator-line");
    this._line.setAppearance("tool-bar-separator-line");
    this._line.setLocation(3, 2);
    this._line.setWidth(2);
    this._line.setBottom(2);
    this.add(this._line);
}
_p = _biExtend(BiToolBarSeparator, BiComponent, "BiToolBarSeparator");
_p._tagName = "SPAN";

function BiToolBarSplitMenuButton(sText, oImage, oMenu) {
    if (_biInPrototype) return;
    BiToolBarButton.call(this, sText, oImage);
    this._menuButton = new BiToolBarMenuButton(null, null, oMenu);
    this._menuButton.setStyleProperty("position", "absolute");
    this._menuButton._updateState = this._updateStateForMenuButton;
    this._menuButton._toggleMenu = this._toggleMenu;
    this._menuButton._toggleMenuOnMouse = this._toggleMenuOnMouse;
    this._menuButton._bottom = 0;
    this._menuButton._width = 13;
    this._menuButton.layoutComponent = BiComponent.prototype.layoutComponent;
    this.add(this._menuButton);
}
_p = _biExtend(BiToolBarSplitMenuButton, BiToolBarButton, "BiToolBarSplitMenuButton");
_p.setMenu = function (oMenu) {
    this._menuButton.setMenu(oMenu);
};
_p.getMenu = function () {
    return this._menuButton._menu;
};
_p.layoutAllChildren = function () {
    this._layoutDropDownArrow();
    BiToolBarButton.prototype.layoutAllChildren.call(this);
};
_p._layoutDropDownArrow = function () {
    this._menuButton.setRight(0);
    this._menuButton.setTop(0);
    this._menuButton.setBottom(0);
};
_p._updateState = function () {
    BiToolBarButton.prototype._updateState.call(this);
    this._layoutDropDownArrow();
};
_p.setText = function (sText) {
    BiToolBarButton.prototype.setText.call(this, sText);
    this._menuButton.invalidateParentLayout();
};
_p.setEnabled = function (bEnabled) {
    BiToolBarButton.prototype.setEnabled.call(this, bEnabled);
    this._menuButton.setEnabled(bEnabled);
};
_p.addParsedObject = function (o) {
    if (o instanceof BiMenu) this.setMenu(o);
    else BiToolBarButton.prototype.addParsedObject.call(this, o);
};
_p._updateStateForMenuButton = function () {
    BiToolBarMenuButton.prototype._updateState.call(this);
    if (this.getParent()._droppedDown != this._droppedDown) {
        this.getParent()._droppedDown = this._droppedDown;
        this.getParent()._updateState();
    }
};
_p._toggleMenu = function () {
    if (this.getParent()._menu.getIsVisible() || new Date - this.getParent()._menu.getHideTimeStamp() < 100) {
        this._mouseDown = false;
        this._droppedDown = false;
        this._updateState();
    } else {
        this._mouseDown = true;
        this._droppedDown = true;
        this._updateState();
        this._menu.popupAtComponent(this.getParent());
    }
};
_p._onMouseDown = function (rMouseEvent) {
    if (!this._menuButton._hover) BiToolBarButton.prototype._onMouseDown.call(this, rMouseEvent);
};
_p._onMouseUp = function (rMouseEvent) {
    if (!this._menuButton._hover) BiToolBarButton.prototype._onMouseUp.call(this, rMouseEvent);
};
_p._onClick = function (rMouseEvent) {
    if (!this._menuButton._hover) BiToolBarButton.prototype._onClick.call(this, rMouseEvent);
};
_p._onKeyDown = function (rKeyboardEvent) {
    if (!this._menuButton._hover) BiToolBarButton.prototype._onKeyDown.call(this, rKeyboardEvent);
};
_p._onKeyUp = function (rKeyboardEvent) {
    if (!this._menuButton._hover) BiToolBarButton.prototype._onKeyUp.call(this, rKeyboardEvent);
};
_p._onKeyPress = function (rKeyboardEvent) {
    if (!this._menuButton._hover) BiToolBarButton.prototype._onKeyPress.call(this, rKeyboardEvent);
};
_p._toggleMenuOnMouse = function (e) {
    if (this.getIsEnabled() && e.getButton() == BiMouseEvent.LEFT) {
        if (!this._hideFlag) this._menu.popupAtComponent(this.getParent());
    }
};
_p._computePreferredWidth = function () {
    return BiToolBarButton.prototype._computePreferredWidth.call(this) + this._menuButton._width + 2;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiToolBarButton.prototype.dispose.call(this);
    this.disposeFields("_intercept", "_separator", "_menuButton");
};

function BiToolBarSplitToggleMenuButton(sText, oImage, oMenu) {
    if (_biInPrototype) return;
    BiToolBarToggleButton.call(this, sText, oImage);
    this._menuButton = new BiToolBarMenuButton(null, null, oMenu);
    this._menuButton.setStyleProperty("position", "absolute");
    this._menuButton._updateState = this._updateStateForMenuButton;
    this._menuButton._toggleMenu = this._toggleMenu;
    this._menuButton._toggleMenuOnMouse = this._toggleMenuOnMouse;
    this._menuButton._bottom = 0;
    this._menuButton._width = 13;
    this._menuButton.layoutComponent = BiComponent.prototype.layoutComponent;
    this.add(this._menuButton);
}
_p = _biExtend(BiToolBarSplitToggleMenuButton, BiToolBarToggleButton, "BiToolBarSplitToggleMenuButton");
_p.setMenu = function (oMenu) {
    this._menuButton.setMenu(oMenu);
};
_p.getMenu = function () {
    return this._menuButton._menu;
};
_p.layoutAllChildren = function () {
    this._layoutDropDownArrow();
    BiToolBarToggleButton.prototype.layoutAllChildren.call(this);
};
_p._layoutDropDownArrow = function () {
    this._menuButton.setRight(0);
    this._menuButton.setTop(0);
    this._menuButton.setBottom(0);
};
_p._updateState = function () {
    BiToolBarToggleButton.prototype._updateState.call(this);
    this._layoutDropDownArrow();
};
_p.setText = function (sText) {
    BiToolBarToggleButton.prototype.setText.call(this, sText);
    this._menuButton.invalidateParentLayout();
};
_p.setEnabled = function (bEnabled) {
    BiToolBarToggleButton.prototype.setEnabled.call(this, bEnabled);
    this._menuButton.setEnabled(bEnabled);
};
_p.addParsedObject = function (o) {
    if (o instanceof BiMenu) this.setMenu(o);
    else BiToolBarToggleButton.prototype.addParsedObject.call(this, o);
};
_p._updateStateForMenuButton = function () {
    BiToolBarMenuButton.prototype._updateState.call(this);
    if (this.getParent()._droppedDown != this._droppedDown) {
        this.getParent()._droppedDown = this._droppedDown;
        this.getParent()._updateState();
    }
};
_p._getScreenLeftForMenuButton = function () {
    return (this._intercept ? this.getParent().getScreenLeft() : BiToolBarMenuButton.prototype.getScreenLeft.call(this));
};
_p._getScreenTopForMenuButton = function () {
    return (this._intercept ? this.getParent().getScreenTop() : BiToolBarMenuButton.prototype.getScreenTop.call(this));
};
_p._getWidthForMenuButton = function () {
    return (this._intercept ? this.getParent().getWidth() : BiToolBarMenuButton.prototype.getWidth.call(this));
};
_p._getHeightForMenuButton = function () {
    return (this._intercept ? this.getParent().getHeight() : BiToolBarMenuButton.prototype.getHeight.call(this));
};
_p._onMouseDown = function (rMouseEvent) {
    if (!this._menuButton._hover) BiToolBarToggleButton.prototype._onMouseDown.call(this, rMouseEvent);
};
_p._onMouseUp = function (rMouseEvent) {
    if (!this._menuButton._hover) BiToolBarToggleButton.prototype._onMouseUp.call(this, rMouseEvent);
};
_p._onClick = function (rMouseEvent) {
    if (!this._menuButton._hover) BiToolBarToggleButton.prototype._onClick.call(this, rMouseEvent);
};
_p._onKeyDown = function (rKeyboardEvent) {
    if (!this._menuButton._hover) BiToolBarToggleButton.prototype._onKeyDown.call(this, rKeyboardEvent);
};
_p._onKeyUp = function (rKeyboardEvent) {
    if (!this._menuButton._hover) BiToolBarToggleButton.prototype._onKeyUp.call(this, rKeyboardEvent);
};
_p._onKeyPress = function (rKeyboardEvent) {
    if (!this._menuButton._hover) BiToolBarToggleButton.prototype._onKeyPress.call(this, rKeyboardEvent);
};
_p._toggleMenuOnMouse = function (e) {
    if (this.getIsEnabled() && e.getButton() == BiMouseEvent.LEFT) {
        if (!this._hideFlag) this._menu.popupAtComponent(this.getParent());
    }
};
_p._computePreferredWidth = function () {
    return BiToolBarButton.prototype._computePreferredWidth.call(this) + this._menuButton._width + 2;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiToolBarToggleButton.prototype.dispose.call(this);
    this.disposeFields("_intercept", "_separator", "_menuButton");
};

function BiTabBar() {
    if (_biInPrototype) return;
    BiToolBar.call(this);
    this._tabButtons = [];
    this.setCssClassName("bi-tab-bar");
    this.setAppearance(this._getAppearance());
    this.setSize(200, 21);
    this._radioGroup = new BiRadioGroup;
    this._bottomLine = new BiComponent;
    this._bottomLine.setAppearance("tab-bar-line");
    this._bottomLine.setZIndex(2);
    BiToolBar.prototype.add.call(this, this._bottomLine, null, true);
    this._scrollArrows = new BiComponent;
    this._scrollArrows.setAppearance("tab-bar-scroll-arrows");
    this._scrollArrows.setZIndex(4);
    BiToolBar.prototype.add.call(this, this._scrollArrows, null, true);
    this._scrollArrowsLine = new BiComponent;
    this._scrollArrowsLine.setAppearance("tab-bar-line");
    this._scrollArrowsLine.setZIndex(2);
    this._scrollArrows.add(this._scrollArrowsLine);
    this._scrollLeftButton = new BiRepeatButton;
    this._scrollLeftButton._themeKey = BiTheme.KEYS.tabScrollButton;
    this._scrollLeftButton.setFirstInterval(0);
    this._scrollLeftButton.setAppearance("tab-scroll-left");
    this._scrollLeftButton.setTabIndex(-1);
    this._scrollLeftButton._label.setPadding(0);
    this._scrollLeftButton.setLocation(0, 20);
    this._scrollLeftButton.setWidth(18);
    this._scrollArrows.add(this._scrollLeftButton);
    this._scrollRightButton = new BiRepeatButton;
    this._scrollRightButton._themeKey = BiTheme.KEYS.tabScrollButton;
    this._scrollRightButton.setFirstInterval(0);
    this._scrollRightButton.setAppearance("tab-scroll-right");
    this._scrollRightButton.setTabIndex(-1);
    this._scrollRightButton._label.setPadding(0);
    this._scrollRightButton.setLocation(18, 2);
    this._scrollRightButton.setWidth(18);
    this._scrollArrows.add(this._scrollRightButton);
    this._radioGroup.addEventListener("change", this._onRadioGroupChange, this);
    this._scrollLeftButton.addEventListener("action", this._doScroll, this);
    this._scrollRightButton.addEventListener("action", this._doScroll, this);
}
_p = _biExtend(BiTabBar, BiToolBar, "BiTabBar");
_p._alignment = "top";
BiTabBar.addProperty("alignment", BiAccessType.READ);
_p.setAlignment = function (s) {
    if (s != this._alignment) {
        this._alignment = s;
        for (var i = 0; i < this._tabButtons.length; i++) this._tabButtons[i].setAlignment(s);
        this.setAppearance(this._getAppearance());
        this.invalidateLayout();
    }
};
_p.setRightToLeft = function (b) {
    BiToolBar.prototype.setRightToLeft.call(this, b);
    this.invalidateLayout();
};
_p.add = function (oChild, oBefore, bAnon) {
    if (oChild instanceof BiTabButton) {
        if (oBefore == null) this._tabButtons.push(oChild);
        else this._tabButtons.insertBefore(oChild, oBefore);
    }
    BiToolBar.prototype.add.call(this, oChild, oBefore, bAnon);
    if (oChild instanceof BiTabButton) {
        oChild.setAlignment(this.getAlignment());
        this._radioGroup.add(oChild);
        if (this._radioGroup.getSelected() == null) oChild.setChecked(true);
    }
};
_p.remove = function (oChild) {
    if (this._disposed) return;
    if (oChild instanceof BiTabButton) {
        var idx = this._tabButtons.indexOf(oChild);
        var wasSelected = oChild.getChecked();
        this._tabButtons.remove(oChild);
        this._radioGroup.remove(oChild);
    }
    BiToolBar.prototype.remove.call(this, oChild);
    if (wasSelected) {
        if (idx < this._tabButtons.length) this.setSelectedIndex(idx);
        else if (this._tabButtons.length > 0) this.setSelectedIndex(this._tabButtons.length - 1);
    }
};
_p.removeAll = function () {
    var cs = this.getChildren();
    for (var i = cs.length - 1; i >= 0; i--) {
        BiToolBar.prototype.remove.call(this, cs[i]);
        this._radioGroup.remove(cs[i]);
        cs[i].dispose();
    }
    this.setSelectedIndex(-1);
    this._tabButtons = [];
    this.invalidateLayout();
};
_p.getSelected = function () {
    return this._radioGroup.getSelected();
};
_p.setSelected = function (oButton) {
    if (oButton) this._radioGroup.setSelected(oButton);
};
_p.setSelectedIndex = function (n) {
    this.setSelected(this._tabButtons[n]);
};
_p.getSelectedIndex = function () {
    return this._tabButtons.indexOf(this.getSelected());
};
_p._onRadioGroupChange = function (e) {
    this.dispatchEvent("change");
};
BiTabBar.addProperty("tabButtons", BiAccessType.READ);
_p._tabBarScrollLeft = 0;
_p._layoutTabBarComponents = function () {
    if (!this._created) return;
    var lefts = [];
    var widths = [];
    var x = 2;
    var cw = this.getClientWidth();
    var ch = this.getClientHeight();
    var c;
    for (var i = 0; i < this._children.length; i++) {
        c = this._children[i];
        if (!c._disposed && c instanceof BiTabButton && c.getVisible()) {
            widths[i] = c.getPreferredWidth();
            if (c.getChecked()) {
                lefts[i] = x - 2;
                x += widths[i] - 4;
            } else {
                lefts[i] = x;
                x += widths[i];
            }
        }
    }
    var showScroll = x > cw;
    this._tabBarScrollLeft = Math.max(0, Math.min(x - cw + (showScroll ? 36 + 4 : 0), this._tabBarScrollLeft));
    var alignTop = this.getAlignment() != "bottom";
    var rtl = this.getRightToLeft();
    for (i = 0; i < this._children.length; i++) {
        c = this._children[i];
        if (!c._disposed && c instanceof BiTabButton) {
            this._layoutChild2(c, rtl ? cw - widths[i] - lefts[i] + this._tabBarScrollLeft : lefts[i] - this._tabBarScrollLeft, c.getChecked() || !alignTop ? 0 : 2, widths[i], ch - (c.getChecked() ? 0 : 2), true);
        }
    }
    this._scrollArrows.setVisible(showScroll);
    if (alignTop) {
        this._layoutChild2(this._bottomLine, 0, ch - 1, cw, 10);
        this._layoutChild2(this._scrollArrowsLine, 0, ch - 1, cw, 10);
    } else {
        this._layoutChild2(this._bottomLine, 0, -8, cw, 10);
        this._layoutChild2(this._scrollArrowsLine, 0, -8, cw, 10);
    }
    if (showScroll) {
        this._layoutChild2(this._scrollArrows, rtl ? 1 : cw - 36, 0, 36, ch);
        this._scrollLeftButton._height = ch - 7;
        this._scrollRightButton._height = ch - 7;
        if (alignTop) {
            this._scrollLeftButton._top = 5;
            this._scrollRightButton._top = 5;
        } else {
            this._scrollLeftButton._top = 0;
            this._scrollRightButton._top = 0;
        }
        this.layoutChild(this._scrollLeftButton);
        this.layoutChild(this._scrollRightButton);
    }
};
_p.layoutAllChildren = function () {
    this._layoutTabBarComponents();
};
_p._computePreferredHeight = function () {
    var max = 21;
    for (var i = 0; i < this._tabButtons.length; i++) max = Math.max(max, this._tabButtons[i].getPreferredHeight());
    return max;
};
_p._doScroll = function (e) {
    var toLeft = e.getCurrentTarget() == this._scrollLeftButton;
    var sl = this._tabBarScrollLeft;
    sl += toLeft == this.getRightToLeft() ? 25 : -25;
    this._tabBarScrollLeft = Math.max(0, sl);
    this._layoutTabBarComponents();
};
_p.invalidateChild = function (oChild, sHint) {
    this.invalidateLayout();
    this._invalidateChild(oChild, sHint);
};
_p._getAppearance = function () {
    return "tab-bar-alignment-" + this.getAlignment();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiToolBar.prototype.dispose.call(this);
    this.disposeFields("_tabButtons", "_tabBarScrollLeft", "_scrollLeftButton", "_scrollRightButton", "_radioGroup", "_bottomLine", "_scrollArrows", "_scrollArrowsLine", "_alignment");
};

function BiTabButton(sText, oIcon) {
    if (_biInPrototype) return;
    BiToolBarRadioButton.call(this, sText, oIcon);
    this._label.setRight(0);
    this._label.setBottom(0);
    this.setTabIndex(0);
    this.setCssClassName("bi-tab-button");
    this.setAppearance(this._getAppearance());
    this.setZIndex(1);
};
_p = _biExtend(BiTabButton, BiToolBarRadioButton, "BiTabButton");
_p._themeKey = BiTheme.KEYS.tabButton;
_p._alignment = "top";
_p._top = null;
_p._bottom = null;
_p.layoutComponent = BiButton.prototype.layoutComponent;
_p.getWidth = BiButton.prototype.getWidth;
_p.getHeight = BiButton.prototype.getHeight;
BiTabButton.addProperty("alignment", BiAccessType.READ);
_p.setAlignment = function (s) {
    if (s != this._alignment) {
        this._alignment = s;
        this.setAppearance(this._getAppearance());
    }
};
_p.setValue = _p.setChecked = function (b) {
    if (this._checked != b) {
        this.setTabIndex(b ? 1 : 0);
        BiToolBarRadioButton.prototype.setChecked.call(this, b);
        application.getThemeManager().applyAppearance(this);
        this.setZIndex(0);
        this.invalidateParentLayout();
        if (b) this._setHtmlAttribute("selected", "true");
        else this._removeHtmlAttribute("selected");
        this.setZIndex(b ? 3 : 1);
    }
};
_p._makeRaised = function () {
};
_p._makeNormal = function () {
};
_p._makePressed = function () {
};
_p._setBackground = function () {
};
_p._getAppearance = function () {
    return "tab-button-alignment-" + this.getAlignment();
};
_p._setHtml = function () {
    BiToolBarRadioButton.prototype._setHtml.call(this);
    if (this.getHasFixedWidth() && this.getHasFixedHeight()) {
        this.invalidateParentLayout("size");
    }
};

function BiTabPane() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._pages = [];
    this.setCssClassName("bi-tab-pane");
    this.setAppearance(this._getAppearance());
    this.setSize(200, 200);
    this._tabBar = new BiTabBar;
    this._tabBar.setHeight(21);
    this._tabBar.setLeft(0);
    this._tabBar.setRight(0);
    BiComponent.prototype.add.call(this, this._tabBar, null, true);
    this._tabBar.addEventListener("change", this._onTabBarChange, this);
    this.addEventListener("keydown", this._onKeyDown);
};
_p = _biExtend(BiTabPane, BiComponent, "BiTabPane");
BiTabPane.addProperty("pages", BiAccessType.READ);
BiTabPane.addProperty("tabBar", BiAccessType.READ);
_p.getTabChildren = function () {
    var p = this.getSelected();
    if (p) {
        return [p.getTabButton()].concat(p.getTabChildren());
    }
    return this._tabBar.getTabChildren();
};
_p._alignment = "top";
BiTabPane.addProperty("alignment", BiAccessType.READ);
_p.setAlignment = function (s) {
    if (s != this._alignment) {
        this._alignment = s;
        this._tabBar.setAlignment(s);
        for (var i = 0; i < this._pages.length; i++) {
            this._pages[i].setAlignment(s);
        }
        this.setAppearance(this._getAppearance());
        this.invalidateLayout();
    }
};
_p.setRightToLeft = function (b) {
    BiComponent.prototype.setRightToLeft.call(this, b);
    this._tabBar.invalidateLayout();
};
_p.add = function (oChild, oBefore, bAnon) {
    if (oChild instanceof BiTabPage) {
        if (oBefore == null) this._pages.push(oChild);
        else this._pages.insertBefore(oChild, oBefore);
        oChild.setAlignment(this.getAlignment());
        this._tabBar.add(oChild._tabButton, oBefore ? oBefore._tabButton : null);
        this.invalidateLayout();
    }
    BiComponent.prototype.add.call(this, oChild, oBefore, bAnon);
};
_p.remove = function (oChild) {
    if (oChild instanceof BiTabPage) {
        this._pages.remove(oChild);
        this._tabBar.remove(oChild._tabButton);
    }
    BiComponent.prototype.remove.call(this, oChild);
};
_p.removeAll = function () {
    var i;
    var cs = this.getChildren();
    var l = cs.length;
    for (i = 0; i < l; i++) {
        BiComponent.prototype.remove.call(this, cs[i]);
    }
    this._pages = [];
    this._tabBar.removeAll();
    this.setSelectedIndex(-1);
    for (i = 0; i < l; i++) {
        cs[i].dispose();
    }
};
_p.getSelected = function () {
    for (var i = 0; i < this._pages.length; i++) {
        if (this._pages[i].getSelected()) {
            return this._pages[i];
        }
    }
    return null;
};
_p.setSelected = function (oTabPage) {
    if (oTabPage) {
        oTabPage.setSelected(true);
    }
};
_p.setSelectedIndex = function (nIndex) {
    this.setSelected(this._pages[nIndex]);
};
_p.getSelectedIndex = function () {
    for (var i = 0; i < this._pages.length; i++) {
        if (this._pages[i].getSelected()) {
            return i;
        }
    }
    return -1;
};
_p._onTabBarChange = function (e) {
    this.dispatchEvent("change");
};
_p.invalidateChild = function (oChild, sHint) {
    if (oChild == this._tabBar) {
        this.invalidateLayout();
    }
    this._invalidateChild(oChild, sHint);
};
_p.layoutAllChildren = function () {
    var cw = this.getClientWidth();
    var ch = this.getClientHeight();
    var h = this._tabBar.getPreferredHeight();
    var top = (this._alignment == "top");
    var pageHeight = Math.max(ch - h, 0);
    this._layoutChild2(this._tabBar, 0, top ? 0 : pageHeight, cw, h, true);
    for (i = 0; i < this._pages.length; i++)
        if (this._pages[i].getSelected()) {
            this._layoutChild2(this._pages[i], 0, top ? h : 0, cw, pageHeight, true);
            break;
        }
};
_p._onKeyDown = function (e) {
    var tb = this._tabBar.getSelected();
    if (e.matchesBundleShortcut("window.next")) {
        tb._group.selectNext(tb);
        e.preventDefault();
        e.stopPropagation();
    } else if (e.matchesBundleShortcut("window.previous")) {
        tb._group.selectPrevious(tb);
        e.preventDefault();
        e.stopPropagation();
    }
};
_p._getAppearance = function () {
    return "tab-pane-alignment-" + this.getAlignment();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this.disposeFields("_tabBar", "_pages", "_alignment");
};

function BiTabPage(sText, oIcon) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-tab-page");
    this.setAppearance(this._getAppearance());
    this._tabButton = new BiTabButton(sText || "Untitled", oIcon);
    this.setVisible(false);
    this.setZIndex(0);
    this._tabButton.addEventListener("change", this._onChange, this);
}
_p = _biExtend(BiTabPage, BiComponent, "BiTabPage");
_p._lazyCreate = true;
_p._alignment = "top";
BiTabPage.addProperty("alignment", BiAccessType.READ);
_p.setAlignment = function (s) {
    if (s != this._alignment) {
        this._alignment = s;
        this.setAppearance(this._getAppearance());
        this.invalidateLayout();
    }
};
_p._onChange = function (e) {
    if (this._disposed) return;
    var b = this._tabButton.getChecked();
    this.setVisible(b);
    this.setZIndex(b ? 1 : 0);
    if (b && this._parent) {
        this._parent.invalidateLayout();
    }
    this.dispatchEvent("change");
};
BiTabPage.addProperty("tabButton", BiAccessType.READ);
_p.setTabButton = function (oTabButton) {
    if (this._tabButton) {
        this._tabButton.removeEventListener("change", this._onChange, this);
        oTabButton.setChecked(this._tabButton.getChecked());
        var p = this._tabButton.getParent();
        if (p) {
            var ns = this._tabButton.getNextSibling();
            p.remove(this._tabButton);
            p.add(oTabButton, ns);
        }
    }
    this._tabButton = oTabButton;
    oTabButton.addEventListener("change", this._onChange, this);
};
_p.setRightToLeft = function (b) {
    this._tabButton.setRightToLeft(b);
    BiComponent.prototype.setRightToLeft.call(this, b);
};
_p.getSelected = function () {
    return this._tabButton.getChecked();
};
_p.setSelected = function (b) {
    this._tabButton.setChecked(b);
};
_p.setText = function (sText) {
    this._tabButton.setText(sText);
};
_p.getText = function () {
    return this._tabButton.getText();
};
_p.setIcon = function (oIcon) {
    this._tabButton.setIcon(oIcon);
};
_p.getIcon = function () {
    return this._tabButton.getIcon();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this.disposeFields("_tabButton");
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
_p.setEnabled = function (b) {
    this._tabButton.setEnabled(b);
    BiComponent.prototype.setEnabled.call(this, b);
};
_p._getAppearance = function () {
    return "tab-page-alignment-" + this.getAlignment();
};

function BiIframe(oUri) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setBackColor("window");
    this.setHtmlProperty("allowTransparency", true);
    this.setHtmlProperty("frameBorder", 0);
    this.setCssClassName('bi-iframe');
    this.setAppearance("iframe");
    this.setTabIndex(1);
    if (oUri) this.setUri(oUri);
    this.addEventListener("keydown", this._onKeyDown, this);
}
_p = _biExtend(BiIframe, BiComponent, "BiIframe");
_p._tagName = "IFRAME";
_p._uri = null;
_p._loaded = false;
_p.setUri = function (oUri) {
    this._uri = oUri;
    var absUri = new BiUri(application.getAdfPath(), this._uri);
    this._loaded = false;
    this.setHtmlProperty("src", absUri);
};
_p.getUri = function () {
    return this._uri;
};
_p.setSrc = _p.setUri;
_p.getSrc = _p.getUri;
_p._maintainFocusRootOnFocusOut = function () {
    if (!BiBrowserCheck.ie) return;
    var cw = this.getContentWindow();
    var allowDeactivate = true;
    try {
        this.getContentDocument().body.onkeydown = function () {
            if (cw.event.keyCode == BiKeyboardEvent.TAB) allowDeactivate = false;
        };
    } catch (ex) {
        return;
    }
    this._element.onbeforedeactivate = function () {
        if (!allowDeactivate) this.setActive();
        allowDeactivate = true;
    };
};
_p.getContentDocument = function () {
    if (BiBrowserCheck.ie) {
        var w = this.getContentWindow();
        return w ? w.document : null;
    } else {
        if (!this._created) return null;
        try {
            return this._element.contentDocument;
        } catch (ex) {
            return null;
        }
    }
};
_p.getContentWindow = function () {
    if (BiBrowserCheck.ie) {
        if (!this._created) return null;
        try {
            return this._element.contentWindow;
        } catch (ex) {
            return null;
        }
    } else {
        var d = this.getContentDocument();
        return d ? d.defaultView : null;
    }
};
_p.getLoaded = function () {
    if (BiBrowserCheck.ie) {
        var doc = this.getContentDocument();
        return doc ? doc.readyState == "complete" : false;
    } else return this._loaded;
};
_p._addHtmlElementToParent = function () {
    BiComponent.prototype._addHtmlElementToParent.apply(this, arguments);
    if (BiBrowserCheck.ie) try {
        this.getContentDocument().location.href = this._element.src;
    } catch (ex) {
    }
};
_p._create = function (oDocument) {
    BiComponent.prototype._create.call(this, oDocument);
    if (BiBrowserCheck.ie) this._element.onreadystatechange = BiComponent.__oninlineevent;
    else this._element.onload = BiComponent.__oninlineevent;
};
_p.dispose = function () {
    if (this._disposed) return;
    if (this._element) this._element.onreadystatechange = this._element.onload = null;
    BiComponent.prototype.dispose.call(this);
};
_p._oninlineevent = function (e) {
    if (!e) e = this._document.parentWindow.event;
    switch (e.type) {
        case "readystatechange":
            if (this._element.readyState == "complete") {
                this._prepareInnerDocument();
                this._maintainFocusRootOnFocusOut();
                this.dispatchEvent("load");
                application.flushLayoutQueue();
            }
            return;
        case "load":
            this._loaded = true;
            this._prepareInnerDocument();
            if (BiBrowserCheck.moz) this.setOverflow("auto");
            this._maintainFocusRootOnFocusOut();
            this.dispatchEvent("load");
            application.flushLayoutQueue();
            return;
    }
    BiComponent.prototype._oninlineevent.call(this, e);
};
_p._prepareInnerDocument = function () {
    if (BiBrowserCheck.ie) {
        try {
            this.getContentDocument().body.style.backgroundColor = "transparent";
        } catch (ex) {
        }
        ;
    }
};
_p._onKeyDown = function (e) {
    if (e.matchesBundleShortcut("focus.movein")) {
        if (this._element.contentWindow) {
            this._element.title = "";
            this._element.contentWindow.focus();
        }
        e.preventDefault();
    }
};

function BiRichEdit() {
    if (_biInPrototype) return;
    BiIframe.call(this);
    this.makeThemeAware();
    this.addEventListener("load", this._onIframeLoad);
    this.setCanSelect(true);
    this.setHtmlProperty("frameBorder", "0");
    this.setHideFocus(true);
    this.setTabIndex(1);
    this.addEventListener("mousedown", this._activate);
    this.addEventListener("keydown", this._activate);
    this.addEventListener("keydown", this._onkeydown);
    this.addEventListener("keypress", this._onkeypress);
    this._cssRuleSelectors = [];
}
_p = _biExtend(BiRichEdit, BiIframe, "BiRichEdit");
_p._tmpContents = null;
_p._captureTab = false;
_p._tabWidth = 4;
_p._tabHtml = '&nbsp;&nbsp;&nbsp;&nbsp;';
_p._maintainFocusRootOnFocusOut = BiAccessType.FUNCTION_EMPTY;
BiRichEdit.addProperty("captureTab", BiAccessType.READ_WRITE);
BiRichEdit.addProperty("tabWidth", BiAccessType.READ);
_p.setTabWidth = function (nWidth) {
    this._tabWidth = nWidth;
    this._tabHtml = "";
    for (var i = 0; i < nWidth; i++) this._tabHtml += "&nbsp;";
};
BiRichEdit.addProperty("tabHtml", BiAccessType.READ_WRITE);
_p._onkeydown = function (e) {
    var focusChange = e.matchesBundleShortcut("focus.next") || e.matchesBundleShortcut("focus.previous");
    if (focusChange && this._captureTab) {
        this.insertHtml(this._tabHtml);
        e.preventDefault();
    }
    if (BiBrowserCheck.ie) {
        if (focusChange) this._element.setActive();
    }
};
_p._onkeypress = function (e) {
    if (this._captureTab && BiBrowserCheck.moz && e.matchesBundleShortcut("focus.next") || e.matchesBundleShortcut("focus.previous")) {
        e.preventDefault();
    }
};
_p.insertHtml = function (sHtml) {
    if (BiBrowserCheck.ie) {
        var doc = this.getContentDocument();
        var range = doc.selection.createRange();
        range.pasteHTML(sHtml);
    } else {
        this.execCommand("inserthtml", false, sHtml);
    }
};
_p.execCommand = function (sCommand, bUi, oCommandValue) {
    var doc = this.getContentDocument();
    return doc.execCommand(sCommand, bUi, oCommandValue);
};
_p.queryCommandValue = function (sCommand) {
    var doc = this.getContentDocument();
    return doc && doc.queryCommandValue(sCommand);
};
_p.queryCommandState = function (sCommand) {
    var doc = this.getContentDocument();
    return doc && doc.queryCommandState(sCommand);
};
_p.queryCommandEnabled = function (sCommand) {
    var doc = this.getContentDocument();
    return doc && doc.queryCommandEnabled(sCommand);
};
_p._onIframeLoad = function (e) {
    var d = this.getContentDocument();
    this.removeEventListener("load", this._onIframeLoad);
    if (d.designMode != "On" && d.designMode != "on") d.designMode = "On";
    BiTimer.callOnce(function () {
        if (!this._disposed) {
            var d = this.getContentDocument();
            if (d.body && this._eventManager == null) {
                d.body._biComponent = this;
                d.documentElement._biComponent = this;
                this._eventManager = new BiEventManager;
                this._eventManager.attachToWindow(d.defaultView || d.parentWindow);
            }
            this.addEventListener("load", this._onIframeLoad);
        }
    }, 100, this);
    if (BiBrowserCheck.webkit) {
        var oThis = this;
        BiEvent._addDOMEventListener(d, "keydown", function BiRichEdit_onWebKitKeydown(e) {
            if (e.keyCode == BiKeyboardEvent.TAB) {
                e.returnValue = false;
                if (oThis._captureTab) oThis.insertHtml(oThis._tabHtml);
                else {
                    var appWin = application.getWindow();
                    var keyEvent = new BiKeyboardEvent("keydown", e);
                    appWin._focusManager.processKeyEvent(appWin, keyEvent);
                }
            }
        });
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    var d = this.getContentDocument();
    if (d && BiBrowserCheck.webkit) BiEvent._removeDOMEventListener(d, "keydown", BiRichEdit_onWebKitKeydown);
    if (d && d.body) d.body._biComponent = null;
    if (d && d.documentElement) d.documentElement._biComponent = null;
    if (this._eventManager) {
        this._eventManager.dispose();
        this._eventManager = null;
    }
    this._styleSheet = null;
    this._cssRuleSelectors = null;
    BiIframe.prototype.dispose.call(this);
};
_p._prepareInnerDocument = function () {
    BiIframe.prototype._prepareInnerDocument.call(this);
    var win = this.getContentWindow();
    if (BiBrowserCheck.quirks.noNativeOuterHTML) {
        win.HTMLElement.prototype.__defineGetter__("outerHTML", HTMLElement.prototype.__lookupGetter__("outerHTML"));
        win.HTMLElement.prototype.__defineSetter__("outerHTML", HTMLElement.prototype.__lookupSetter__("outerHTML"));
    }
};
_p.setFocused = function (bFocused) {
    if (bFocused && !this.getCanFocus()) throw new Error("Cannot set focus to component");
    if (this._focused != bFocused) {
        var eventManager = this.getTopLevelComponent()._eventManager;
        if (bFocused) {
            this.getContentWindow().focus();
            if (BiBrowserCheck.ie) this._activate();
        } else {
            eventManager._setFocusedComponent(null);
            this.getContentWindow().blur();
        }
    }
};
_p._activate = function () {
    if (BiBrowserCheck.ie) {
        var d = this.getContentDocument();
        if (d) d.body.setActive();
    }
};
_p.getContentHtml = function () {
    var doc = this.getContentDocument();
    return doc.documentElement.outerHTML;
};
_p.setContentHtml = function (s) {
    var d = this.getContentDocument();
    if (d && d.body) d.body._biComponent = null;
    if (this._eventManager) {
        this._eventManager.dispose();
        this._eventManager = null;
    }
    this._styleSheet = null;
    this._cssRuleSelectors = [];
    d.open();
    d.write(s);
    d.close();
    this._onIframeLoad();
};
_p.addCssRule = function (sSelector, sStyle) {
    if (!sSelector || !sStyle) {
        return;
    }
    if (!this._styleSheet) {
        this._styleSheet = this._createStyleElement();
        this._styleSheet.id = "bi-rtf-style-sheet";
    }
    var ss;
    if (BiBrowserCheck.ie) {
        ss = this.getContentDocument().styleSheets["bi-rtf-style-sheet"];
        ss.addRule(sSelector, sStyle);
    } else {
        ss = this._styleSheet.sheet;
        ss.insertRule(sSelector + "{" + sStyle + "}", this._cssRuleSelectors.length);
        this._cssRuleSelectors.push(sSelector);
    }
};
_p.removeCssRule = function (sSelector) {
    if (sSelector == null || !this._styleSheet) {
        return;
    }
    var ss, rules, l, i;
    if (BiBrowserCheck.ie) {
        ss = this.getContentDocument().styleSheets["bi-rtf-style-sheet"];
        rules = ss.rules;
        l = rules.length;
        for (i = rules.length - 1; i >= 0; i--) {
            if (rules[i].selectorText.toLowerCase() == sSelector.toLowerCase()) {
                ss.removeRule(i);
            }
        }
    } else {
        ss = this._styleSheet.sheet;
        rules = this._cssRuleSelectors;
        l = rules.length;
        for (i = rules.length - 1; i >= 0; i--) {
            if (rules[i].toLowerCase() == sSelector.toLowerCase()) {
                ss.deleteRule(i);
                rules.removeAt(i);
            }
        }
    }
};
_p._createStyleElement = function (sCssText, sClassName) {
    var el;
    var d = this.getContentDocument();
    if (BiBrowserCheck.ie) {
        var ss = d.createStyleSheet();
        if (sCssText) ss.cssText = sCssText;
        el = ss.owningElement;
    } else {
        if (BiBrowserCheck.webkit) {
            var hEl = d.createElement("HEAD");
            var topEl = d.getElementsByTagName("HTML")[0];
            var bodyEl = d.getElementsByTagName("BODY")[0];
            topEl.insertBefore(hEl, bodyEl);
        }
        el = d.createElement("STYLE");
        el.type = "text/css";
        if (sCssText) el.appendChild(d.createTextNode(sCssText));
        var h = d.getElementsByTagName("HEAD")[0];
        h.appendChild(el);
    }
    if (sClassName) el.className = sClassName;
    return el;
};
_p._setDesignModeOn = function (bOn) {
    var d = this.getContentDocument();
    d.designMode = bOn ? "On" : "Inherit";
};
_p._getDesignModeOn = function () {
    var d = this.getContentDocument();
    return d.designMode == "On";
};
_p._addHtmlElementToParent = function (oParent, oBefore) {
    BiComponent.prototype._addHtmlElementToParent.call(this, oParent, oBefore);
    if (BiBrowserCheck.ie) {
        var p = this.getParent();
        while (p && !(p instanceof BiWindow)) p = p.getParent();
        if (p) {
            p.addEventListener("beforeminimize", this._onBeforeWindowMinimizing, this);
            p.addEventListener("beforemaximize", this._onBeforeWindowMaximizing, this);
            p.addEventListener("beforenormal", this._onBeforeWindowRestoring, this);
        }
    }
};
_p._onBeforeWindowMinimizing = function () {
    var d = this.getContentDocument();
    this._tmpContents = d.body.outerHTML;
    this._setDesignModeOn(false);
};
_p._onBeforeWindowMaximizing = function () {
    this._setDesignModeOn(true);
    this._restoreContentsAfterMinimize();
};
_p._onBeforeWindowRestoring = function () {
    this._setDesignModeOn(true);
    this._restoreContentsAfterMinimize();
};
_p._restoreContentsAfterMinimize = function () {
    var d = this.getContentDocument();
    d.open();
    d.write(this._tmpContents);
    d.close();
};
_p.setVisible = function (bVisible) {
    BiIframe.prototype.setVisible.call(this, bVisible);
    if (BiBrowserCheck.ie) {
        this.setStyleProperty("display", bVisible ? "inline" : "none");
        if (this.getIsEnabled() && !bVisible) {
            var oDoc = this.getContentDocument();
            if (oDoc) {
                oDoc.body.contentEditable = !oDoc.body.contentEditable;
                oDoc.body.disabled = true;
                oDoc.body.contentEditable = !oDoc.body.contentEditable;
                oDoc.body.disabled = false;
            }
        }
    }
};
_p.setEnabled = function (bEnabled) {
    BiIframe.prototype.setEnabled.call(this, bEnabled);
    if (BiBrowserCheck.ie) {
        var oDoc = this.getContentDocument();
        if (oDoc) oDoc.body.contentEditable = bEnabled;
    }
};

function BiPrintFrame(oTemplateUri, oStringContainer, bPrintOnce) {
    if (_biInPrototype) return;
    BiIframe.call(this, oTemplateUri);
    this._textParser = new BiTextParser;
    if (oStringContainer) {
        this._stringContainer = oStringContainer;
    }
    ;
    if (bPrintOnce) {
        this.addEventListener("load", function () {
            this._onLoad();
        }, this);
    }
    ;
};
_p = _biExtend(BiPrintFrame, BiIframe, "BiPrintFrame");
_p._height = 1;
_p._width = 1;
_p._stringContainer = window;
BiPrintFrame.addProperty("textParser", BiAccessType.READ_WRITE);
_p.parse = function (oStringContainer) {
    var doc = this.getContentDocument().body;
    doc.innerHTML = this.getTextParser().parse(doc.innerHTML, oStringContainer || this._stringContainer);
};
_p.print = function () {
    var win = this.getContentWindow();
    win.focus();
    win.print();
};
_p._onLoad = function () {
    BiTimer.callOnce(function () {
        this.parse(this._stringContainer);
        this.print();
    }, 1, this);
};
_p.importNode = function (oNode, bDeep) {
    if (this.getContentDocument().importNode) {
        return this.getContentDocument().importNode(oNode, bDeep);
    } else {
        return this._importComponentNode(oNode, bDeep);
    }
};
_p._importComponentNode = function (oNode, bDeep) {
    var o = oNode._biComponent;
    var el = this.getContentDocument().createElement(o._tagName);
    var es = el.style;
    var p, sp = o._style;
    for (p in sp) {
        es[p] = sp[p];
    }
    var hp = o._htmlProperties;
    for (p in hp) {
        el[p] = hp[p];
    }
    if (bDeep) {
        el.innerHTML = oNode.innerHTML;
    }
    return el;
};

function BiAttachedComponentModel() {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
}
_p = _biExtend(BiAttachedComponentModel, BiEventTarget, "BiAttachedComponentModel");
_p.getHasAttachedComponent = function (x, y) {
    return false;
};
_p.getAttachedComponent = function (x, y) {
    return null;
};
_p.updateAttachedComponent = function (x, y) {
};
_p._hide = function (c) {
    if (!this._internalFocusSet) {
        if (c.getParent()) {
            this._internalFocusSet = true;
            var p = c.getParent();
            var focusParent = c.getContainsFocus();
            c.setFocused(false);
            if (p) {
                p.remove(c);
                if (focusParent) {
                    try {
                        p._element.setActive();
                    } catch (e) {
                    }
                }
            }
            delete this._internalFocusSet;
        }
    }
};

function BiInlineEditModel() {
    if (_biInPrototype) return;
    BiAttachedComponentModel.call(this);
    this._componentsByType = [];
}
_p = _biExtend(BiInlineEditModel, BiAttachedComponentModel, "BiInlineEditModel");
BiInlineEditModel.EDIT_TYPE_STRING = 1;
BiInlineEditModel.EDIT_TYPE_ENUM = 2;
BiInlineEditModel.EDIT_TYPE_NUMBER = 3;
BiInlineEditModel.EDIT_TYPE_BOOLEAN = 4;
_p._row = null;
_p._column = null;
_p._isEditing = false;
_p._currentEditComponent = null;
BiInlineEditModel.addProperty("row", BiAccessType.READ);
BiInlineEditModel.addProperty("column", BiAccessType.READ);
BiInlineEditModel.addProperty("isEditing", BiAccessType.READ);
BiInlineEditModel.addProperty("currentEditComponent", BiAccessType.READ);
_p.setEditCell = function (x, y) {
    if (this._currentEditComponent && this._isEditing && this._row == y && this._column == x) {
        return;
    }
    if (this._currentEditComponent && (this._row != y || this._column != x)) {
        this._wasEditingComponent = this._currentEditComponent;
        this._onComponentChange();
    }
    this._row = y;
    this._column = x;
    if (this._row != null && this._column != null) {
        if (this.dispatchEvent("beforeshow")) {
            this._startValue = this.getValue();
            this._isEditing = true;
            if (this._currentEditComponent) {
                try {
                    this._currentEditComponent._focused = false;
                    this._currentEditComponent.setFocused(true);
                } catch (ex) {
                }
            }
        }
    }
};
_p.getCanEdit = function (x, y) {
    return true;
};
_p.getEditType = function (x, y) {
    return BiInlineEditModel.EDIT_TYPE_STRING;
};
_p._value = null;
BiInlineEditModel.addProperty("value", BiAccessType.READ);
_p.setValue = function (oValue) {
    if (oValue != this._value) {
        this._value = oValue;
        this.dispatchEvent("change");
    }
};
_p.getEditOptions = function (x, y) {
    return {};
};
_p.cancelEdit = function () {
    if (!this._isEditing) return;
    this._internalChange = true;
    this._wasEditingComponent = this._currentEditComponent;
    this._hideComponent();
    this.setValue(this._startValue);
    delete this._startValue;
    this._internalChange = false;
};
_p.commitEdit = function () {
    if (!this._isEditing) return;
    this._onComponentChange();
    this._wasEditingComponent = this._currentEditComponent;
    this._hideComponent();
};
_p.getHasAttachedComponent = function (x, y) {
    return this._isEditing && this._row == y && this._column == x;
};
_p.getAttachedComponent = function (x, y) {
    var type = this.getEditType(x, y);
    var c = this._componentsByType[type];
    if (!c) {
        c = this.createAttachedComponent(type);
        if (c) c.addEventListener("blur", this._onBlur, this);
        this._componentsByType[type] = c;
    }
    return this._currentEditComponent = c;
};
_p.createAttachedComponent = function (nEditType) {
    var c = null;
    switch (nEditType) {
        case BiInlineEditModel.EDIT_TYPE_STRING:
            c = new BiTextField;
            c.setBorder(new BiBorder(1, "solid", "ThreeDShadow"));
            c.setPadding(0, 0, 0, 0);
            c.addEventListener("change", this._onComponentChange, this);
            c.setFocused = function (b) {
                BiTextField.prototype.setFocused.call(this, b);
                if (b) this.selectAll();
            };
            break;
        case BiInlineEditModel.EDIT_TYPE_ENUM:
            c = new BiComboBox;
            c.setBorder(new BiBorder(1, "solid", "ThreeDShadow"));
            c.addEventListener("change", this._onComponentChange, this);
            c.addEventListener("keydown", this._disableUpDown, this);
            c.addEventListener("move", function () {
                c.setDropDownVisible(false);
            });
            break;
        case BiInlineEditModel.EDIT_TYPE_NUMBER:
            c = new BiSpinner;
            c.setBorder(new BiBorder(1, "solid", "ThreeDShadow"));
            c.addEventListener("change", this._onComponentChange, this);
            c.addEventListener("keydown", this._disableUpDown, this);
            break;
        case BiInlineEditModel.EDIT_TYPE_BOOLEAN:
            c = new BiCheckBox;
            c.setBorder(new BiBorder(1, "solid", "ThreeDShadow"));
            c.setBackColor("Window");
            c.addEventListener("change", this._onComponentChange, this);
            break;
    }
    return c;
};
_p.updateAttachedComponent = function (x, y) {
    if (this._isEditing && this._row == y && this._column == x) {
        var type = this.getEditType(x, y);
        var v = this.getValue();
        this._internalChange = true;
        var c = this.getAttachedComponent(x, y);
        switch (type) {
            case BiInlineEditModel.EDIT_TYPE_STRING:
                this._currentEditComponent.setText(String(v));
                break;
            case BiInlineEditModel.EDIT_TYPE_ENUM:
                c.removeAll();
                var items = this.getEditOptions(x, y);
                if (items) {
                    for (var i = 0; i < items.length; i++) {
                        c.add(new BiComboBoxItem(items[i].text, items[i].userValue));
                    }
                    var item = c.findUserValueExact(v) || c.findStringExact(v);
                    if (item) {
                        c.setSelectedItem(item);
                    } else {
                        c.setText(String(v));
                    }
                }
                ;
                c._popup.pack();
                break;
            case BiInlineEditModel.EDIT_TYPE_NUMBER:
                var options = this.getEditOptions(x, y);
                if (options) {
                    if ("minimum" in options) c.setMinimum(options.minimum);
                    if ("maximum" in options) c.setMaximum(options.maximum);
                }
                c.setValue(Math.floor(parseFloat(v)));
                break;
            case BiInlineEditModel.EDIT_TYPE_BOOLEAN:
                c.setChecked(Boolean(v));
                break;
        }
        this._internalChange = false;
    }
};
_p._onComponentChange = function () {
    if (this._internalChange || !this._isEditing) return;
    var c = this._currentEditComponent;
    var type = this.getEditType(this._column, this._row);
    switch (type) {
        case BiInlineEditModel.EDIT_TYPE_STRING:
            this.setValue(c.getText());
            break;
        case BiInlineEditModel.EDIT_TYPE_ENUM:
            var v = c.getUserValue();
            this.setValue(v == null ? c.getText() : v);
            break;
        case BiInlineEditModel.EDIT_TYPE_NUMBER:
            this.setValue(c.getValue());
            break;
        case BiInlineEditModel.EDIT_TYPE_BOOLEAN:
            this.setValue(c.getChecked());
            break;
    }
};
_p._disableUpDown = function (e) {
    if (e.matchesBundleShortcut("selection.up") || e.matchesBundleShortcut("selection.down")) {
        e.stopPropagation();
        e.preventDefault();
    }
};
_p._hideComponent = function () {
    if (this.dispatchEvent("beforehide")) {
        this._isEditing = false;
        this.dispatchEvent("hide");
        this._currentEditComponent = null;
        this._wasEditingComponent = null;
    }
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiAttachedComponentModel.prototype.dispose.call(this);
    for (var i = 0; i < this._componentsByType.length; i++) {
        if (this._componentsByType[i] instanceof BiComponent) this._componentsByType[i].dispose();
        this._componentsByType[i] = null;
    }
    this._componentsByType = null;
};
_p._onBlur = function (e) {
    if (this._currentEditComponent && !this._currentEditComponent.getContainsFocus()) {
        this._blurComponent = this._currentEditComponent;
        this._hideComponent();
    }
};

function BiTreeViewBase() {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCanSelect(false);
    this.setTabIndex(1);
    this.setHideFocus(true);
    this._attachedComponents = {};
    this._invalidRows = {
        length: 0
    };
    if (!this._useNativeScrollBars) {
        this._hScrollBar = new BiScrollBar("horizontal");
        this._vScrollBar = new BiScrollBar("vertical");
        this.add(this._hScrollBar, null, true);
        this.add(this._vScrollBar, null, true);
        this._hScrollBar.setUnitIncrement(10);
        this._vScrollBar.setUnitIncrement(BiTreeViewBase._getDefaultRowHeight());
        this._hScrollBar.addEventListener("change", this._onBiTreeViewBaseScroll2, this);
        this._vScrollBar.addEventListener("change", this._onBiTreeViewBaseScroll2, this);
    }
    this.addEventListener("mousewheel", this._onMouseWheel);
    this.addEventListener("mousedown", this._onMouseEvent);
    this.addEventListener("contextmenu", this._onMouseEvent);
    this.addEventListener("mouseup", this._onMouseEvent);
    this.addEventListener("mouseover", this._onMouseEvent);
    this.addEventListener("mouseout", this._onMouseEvent);
    this.addEventListener("mousemove", this._onMouseMove);
    this.addEventListener("click", this._onMouseEvent);
    this.addEventListener("dblclick", this._onMouseEvent);
    this.addEventListener("keydown", this._onKeyDown);
    this.addEventListener("keypress", this._onKeyPress);
    this.addEventListener("focusin", this._onFocusChange);
    this.addEventListener("focusout", this._onFocusChange);
}
_p = _biExtend(BiTreeViewBase, BiComponent, "BiTreeViewBase");
_p._useNativeScrollBars = true;
_p._overflowX = "auto";
_p._overflowY = "auto";
BiTreeViewBase.addProperty("attachedComponents", BiAccessType.READ);
BiTreeViewBase.addProperty("useNativeScrollBars", BiAccessType.READ);
_p.setUseNativeScrollBars = function (b) {
    if (this._useNativeScrollBars != b) {
        var st, sl;
        if (this._created) {
            st = this.getScrollTopExact();
            sl = this.getScrollLeftExact();
        }
        this._useNativeScrollBars = b;
        if (!b) {
            if (this._created) {
                this._removeNativeScrollBars();
                this._gridBodyElement.style.overflowY = this._gridBodyElement.style.overflowX = "hidden";
            }
            this._hScrollBar = new BiScrollBar("horizontal");
            this._vScrollBar = new BiScrollBar("vertical");
            this.add(this._hScrollBar, null, true);
            this.add(this._vScrollBar, null, true);
            if (this._viewManager instanceof BiTreeViewViewManager) {
                this._vScrollBar.setUnitIncrement(this._viewManager.getRowHeight());
            } else {
                this._vScrollBar.setUnitIncrement(BiTreeViewBase._getDefaultRowHeight());
            }
            this._hScrollBar.setUnitIncrement(10);
            this._hScrollBar.addEventListener("change", this._onBiTreeViewBaseScroll2, this);
            this._vScrollBar.addEventListener("change", this._onBiTreeViewBaseScroll2, this);
        } else {
            if (this._created) {
                this._addNativeScrollBars();
                this._updateOverflow();
            }
            this._hScrollBar.removeEventListener("change", this._onBiTreeViewBaseScroll2, this);
            this._vScrollBar.removeEventListener("change", this._onBiTreeViewBaseScroll2, this);
            this.remove(this._hScrollBar);
            this.remove(this._vScrollBar);
        }
        if (this._created) {
            this.updateContentSize();
            this.setScrollTop(st);
            this.setScrollLeft(sl);
            this.invalidateLayout();
        }
    }
};
BiTreeViewBase.addProperty("selectionModel", BiAccessType.READ_WRITE);
BiTreeViewBase.addProperty("viewManager", BiAccessType.READ_WRITE);
BiTreeViewBase.addProperty("stateManager", BiAccessType.READ);
BiTreeViewBase.addProperty("dataModel", BiAccessType.READ_WRITE);
BiTreeViewBase.addProperty("inlineEditModel", BiAccessType.READ);
_p.setInlineEditModel = function (oModel) {
    if (this._inlineEditModel != oModel) {
        if (this._inlineEditModel) {
            this._inlineEditModel.removeEventListener("hide", this._onEditComponentHide, this);
            this._inlineEditModel.removeEventListener("change", this._onEditComponentChange, this);
        }
        this.setUseNativeScrollBars(oModel == null);
        this._inlineEditModel = oModel;
        if (oModel) {
            oModel.addEventListener("hide", this._onEditComponentHide, this);
            oModel.addEventListener("change", this._onEditComponentChange, this);
        }
    }
};
BiTreeViewBase.addProperty("attachedComponentModel", BiAccessType.READ);
_p.setAttachedComponentModel = function (am) {
    this._attachedComponentModel = am;
    this.setUseNativeScrollBars(am == null);
};
_p._contentSizeDirty = false;
_p._scrollSubtreeIntoViewRow = -1;
_p._preventScrollUpdates = false;
BiTreeViewBase.__onBiTreeViewBaseScroll = function () {
    this.parentNode._biComponent._onBiTreeViewBaseScroll();
};
_p._onBiTreeViewBaseScroll = function () {
};
_p._onBiTreeViewBaseScroll2 = function () {
    if (this._scrollBatchCount == 0 || this._useNativeScrollBars) {
        this._onBiTreeViewBaseScroll();
    }
};
_p._getInternalScrollLeft = function () {
    if (this._useNativeScrollBars) {
        return this._gridBodyElement.scrollLeft;
    } else {
        return this._hScrollBar.getValue();
    }
};
_p._getInternalScrollTop = function () {
    if (this._useNativeScrollBars) {
        return this._gridBodyElement.scrollTop;
    } else {
        return this._vScrollBar.getValue();
    }
};
_p._setInternalScrollLeft = function (v) {
    if (this._useNativeScrollBars) {
        this._gridBodyElement.scrollLeft = v;
    } else {
        this._hScrollBar.setValue(v);
    }
};
_p._setInternalScrollTop = function (v) {
    if (this._useNativeScrollBars) {
        this._gridBodyElement.scrollTop = v;
    } else {
        this._vScrollBar.setValue(v);
    }
};
_p._syncScrollBars = function () {
    var vm = this.getViewManager();
    var sw = this.getScrollWidth();
    var extent = this.getClientWidth();
    this._beginScrollBatch();
    this._hScrollBar.setMaximum(sw);
    if (this._hScrollBar.getValue() + extent > sw) {
        this._hScrollBar.setValue(sw - extent);
    }
    var sh = this.getScrollHeight();
    extent = this.getClientHeight();
    this._vScrollBar.setMaximum(sh);
    if (this._vScrollBar.getValue() + extent > sh) {
        this._vScrollBar.setValue(sh - extent);
    }
    vm.setScrollLeft(this._getInternalScrollLeft());
    vm.setScrollTop(this._getInternalScrollTop());
    this._endScrollBatch();
};
_p._measure = function () {
    if (this._forceMeasure) {
        if (BiBrowserCheck.ie) {
            var old = this._preventScrollUpdates;
            var sl = this._gridBodyElement.scrollLeft;
            var st = this._gridBodyElement.scrollTop;
            this._preventScrollUpdates = true;
            this._gridBodyElement.scrollLeft += 1;
            this._gridBodyElement.scrollTop += 1;
            this._gridBodyElement.scrollLeft -= 1;
            this._gridBodyElement.scrollTop -= 1;
            this._gridBodyElement.scrollLeft = sl;
            this._gridBodyElement.scrollTop = st;
            this._preventScrollUpdates = old;
        } else {
            var tmp = this._gridBodyElement.offsetWidth;
        }
        this._forceMeasure = false;
    }
};
_p.layoutAllChildren = function () {
    BiComponent.prototype.layoutAllChildren.call(this);
    if (this.getCreated()) {
        if (!this._useNativeScrollBars) {
            this._doCustomOverflow();
        }
        this._clientSizeChanged = true;
        this._forceMeasure = true;
        this.updateContentSize();
        this.updateSize();
        this._updateGrid(true, true, true);
        this._clientSizeChanged = false;
    }
};
_p.layoutComponent = function () {
    BiComponent.prototype.layoutComponent.call(this);
    if (this._useNativeScrollBars && BiBrowserCheck.moz) {
        this._updateOverflow();
    }
};
_p._addHtmlElementToParent = function (oParent, oBefore) {
    BiComponent.prototype._addHtmlElementToParent.call(this, oParent, oBefore);
    this.update();
};
_p.update = function () {
    this._updateCache = null;
    this._forceMeasure = true;
    this.updateContentSize();
    this.updateSize();
    this._updateGrid(true, true, true);
    this._selectionModel._update();
};
_p.setScrollTop = function (n) {
    if (this.getCreated()) {
        if (this._useNativeScrollBars) {
            if (BiBrowserCheck.moz) {
                var before = this._gridBodyElement.scrollTop;
                this._gridBodyElement.scrollTop = n;
                var after = this._gridBodyElement.scrollTop;
                if (before != after) this._onBiTreeViewBaseScroll();
            } else {
                this._gridBodyElement.scrollTop = n;
            }
        } else {
            this._vScrollBar.setValue(n);
        }
    }
};
_p.getScrollLeftExact = function () {
    if (this._useNativeScrollBars) {
        return this._gridBodyElement.scrollLeft;
    } else {
        return this._hScrollBar.getValue();
    }
};
_p.setScrollLeft = function (n) {
    if (this.getCreated()) {
        if (this._useNativeScrollBars) {
            if (BiBrowserCheck.moz) {
                var before = this._gridBodyElement.scrollLeft;
                this._gridBodyElement.scrollLeft = n;
                var after = this._gridBodyElement.scrollLeft;
                if (before != after) this._onBiTreeViewBaseScroll();
            } else {
                this._gridBodyElement.scrollLeft = n;
            }
        } else {
            this._hScrollBar.setValue(n);
        }
    }
};
_p.getScrollTopExact = function () {
    if (this._useNativeScrollBars) {
        return this._gridBodyElement.scrollTop;
    } else {
        return this._vScrollBar.getValue();
    }
};
_p.getClientWidth = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    BiComponent.flushLayoutComponent(this);
    return this._gridBodyElement.clientWidth;
};
_p.getClientHeight = function () {
    if (!this._created) throw new Error("Visual property on non created component");
    return this._gridBodyElement.clientHeight;
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiComponent.prototype.dispose.call(this);
    if (this._gridBodyElement) {
        this._gridBodyElement._biComponent = null;
        this._gridBodyElement.onscroll = null;
    }
    this._gridBodyElement = null;
    this._gridBodyFillerElement = null;
    this._gridBodyContentElement = null;
    this._gridFixedTopElement = null;
    this._gridFixedLeftElement = null;
    this._gridFixedCornerElement = null;
    this.disposeFields("_dragHeader", "_dragHeaderMarker", "_resizeOutline", "_dataModel", "_selectionModel", "_viewManager", "_stateManager", "_hScrollBar", "_vScrollBar", "_scrollBatchStartValues");
};
_p.updateCell = function (x, y) {
    this._updateCellSelected(x, y, true);
};
_p._resetUpdateCache = function () {
    this._updateCache = null;
};
_p._handleContentSizeDirty = function () {
    if (this._contentSizeDirty && this.getCreated()) {
        this._hideDataModelToolTip();
        var oldPreventScrollUpdates = this._preventScrollUpdates;
        this._preventScrollUpdates = true;
        this._forceMeasure = true;
        this.updateContentSize();
        this._resetUpdateCache();
        if (this._clientSizeChanged) this.updateSize();
        if (this._scrollSubtreeIntoViewRow != -1) {
            this.getViewManager().scrollSubtreeIntoView(this._scrollSubtreeIntoViewRow);
            this._scrollSubtreeIntoViewRow = -1;
        }
        this._updateGrid(true, true, true);
        this._preventScrollUpdates = oldPreventScrollUpdates;
        this._contentSizeDirty = false;
        this._clientSizeChanged = false;
        if (BiBrowserCheck.moz) this._updateOverflow();
    }
};
_p.getContextMenu = function () {
    if (this._dataModelContextMenu) return this._dataModelContextMenu;
    return BiComponent.prototype.getContextMenu.call(this);
};
_p._onKeyPress = function (e) {
};
_p._onKeyUp = function (e) {
};
_p._onMouseEvent = function (e) {
};
_p._onMouseWheel = function (e) {
};
_p._onMouseMove = function (e) {
};
_p._onKeyDown = function (e) {
};
_p._onFocusChange = function (e) {
    if (this._gridBodyContentElement && this._gridBodyContentElement.firstChild) {
        var tbodies = this._element.getElementsByTagName("TBODY");
        var l = tbodies.length;
        var className = (this.getViewManager().getShowGridLines() ? "bi-show-grid-lines" : "") + (this.getContainsFocus() ? " focused" : "");
        for (var i = 0; i < l; i++) tbodies[i].className = className;
    }
    if (!this.getContainsFocus()) this._hideDataModelToolTip();
};
_p.getCellInfoFromMouseEvent = function (e) {
    var x = e.getClientX() - this.getClientLeft() - this.getInsetLeft();
    var y;
    if (BiBrowserCheck.ie) {
        y = e._event.clientY - this.getClientTop();
    } else {
        y = e.getClientY() - this.getClientTop() - this.getInsetTop();
    }
    return this.getCellInfo(x, y);
};
_p._onColumnResize = function (e) {
};
_p._onDataChanged = function (e) {
    this._updateGrid(true, true, true);
};
_p._onBeforeDataStructureChanged = function (e) {
    this._resetUpdateCache();
    var sm = this.getSelectionModel();
    sm.setLeadItem(null);
    sm.setAnchorItem(null);
    sm.deselectAll();
};
_p._onDataStructureChanged = function (e) {
    this._resetUpdateCache();
    this.getViewManager().resetCache();
    this._updateCache = null;
    this._clientSizeChanged = true;
    this._contentSizeDirty = true;
    this._handleContentSizeDirty();
};
_p.setOverflow = function (s) {
    this._overflowX = s;
    this._overflowY = s;
    if (this._useNativeScrollBars) {
        this._updateOverflow();
    } else {
        this._doCustomOverflow();
    }
};
_p.getOverflow = function () {
    if (this._overflowX == this._overflowY) return this._overflowX;
    return null;
};
_p.setOverflowX = function (sOverflowX) {
    if (this._overflowX != sOverflowX) {
        this._overflowX = sOverflowX;
        if (this._useNativeScrollBars) {
            this._updateOverflow();
        } else {
            this._doCustomOverflow();
        }
    }
};
_p.setOverflowY = function (sOverflowY) {
    if (this._overflowY != sOverflowY) {
        this._overflowY = sOverflowY;
        if (this._useNativeScrollBars) {
            this._updateOverflow();
        } else {
            this._doCustomOverflow();
        }
    }
};
BiTreeViewBase.addProperty("overflowX", BiAccessType.READ);
BiTreeViewBase.addProperty("overflowY", BiAccessType.READ);
_p._updateOverflow = function () {
    if (!this.getCreated() || !this._gridBodyElement || !this._useNativeScrollBars) return;
    if (BiBrowserCheck.features.hasOverflowX) {
        if (this._overflowX) this._gridBodyElement.style.overflowX = this._overflowX;
        if (this._overflowY) this._gridBodyElement.style.overflowY = this._overflowY;
        this.invalidateLayout();
    } else {
        var s;
        if (this._overflowX == "hidden" && this._overflowY == "hidden") s = "-moz-scrollbars-none";
        else if (this._overflowX == this._overflowY) s = this._overflowX;
        else if (this._overflowX == "hidden" && this._overflowY == "scroll") s = "-moz-scrollbars-vertical";
        else if (this._overflowX == "scroll" && this._overflowY == "hidden") s = "-moz-scrollbars-horizontal";
        else if (this._overflowX == "hidden" && this._overflowY == "auto" && this.getClientHeight() < this.getScrollHeight()) s = "-moz-scrollbars-vertical";
        else if (this._overflowX == "hidden" && this._overflowY == "auto") s = "-moz-scrollbars-none";
        else if (this._overflowX == "scroll" && this._overflowY == "auto" && this.getClientHeight() < this.getScrollHeight()) s = "scroll";
        else if (this._overflowX == "scroll" && this._overflowY == "auto") s = "-moz-scrollbars-horizontal";
        else if (this._overflowX == "auto" && this._overflowY == "hidden" && this.getClientWidth() < this.getScrollWidth()) s = "-moz-scrollbars-horizontal";
        else if (this._overflowX == "auto" && this._overflowY == "hidden") s = "-moz-scrollbars-none";
        else if (this._overflowX == "auto" && this._overflowY == "scroll" && this.getClientWidth() < this.getScrollWidth()) s = "scroll";
        else if (this._overflowX == "auto" && this._overflowY == "scroll") s = "-moz-scrollbars-vertical";
        else s = "auto";
        if (this._mozOverflow != s) {
            this._mozOverflow = s;
            this._gridBodyElement.style.overflow = this._mozOverflow;
            this.invalidateParentLayout();
            this.invalidateLayout();
        }
    }
};
_p._removeNativeScrollBars = function () {
    this._gridBodyElement.removeChild(this._gridBodyFillerElement);
    this._gridBodyFillerElement.onscroll = null;
    this._gridBodyFillerElement = null;
};
_p._addNativeScrollBars = function () {
    this._gridBodyFillerElement = this._document.createElement("DIV");
    this._gridBodyFillerElement.onscroll = BiTreeViewBase.__onBiTreeViewBaseScroll;
    this._gridBodyElement.appendChild(this._gridBodyFillerElement);
    this._gridBodyElement.style.width = "";
    this._gridBodyElement.style.height = "";
};
_p.setCanSelect = function (b) {
    if (BiBrowserCheck.moz) {
        if (this._canSelect != b) {
            this._canSelect = b;
            this._updateCanSelect();
        }
    } else {
        BiComponent.prototype.setCanSelect.call(this, b);
    }
};
_p._updateCanSelect = function () {
    if (BiBrowserCheck.moz && this._element) {
        this._element.style.MozUserSelect = "";
        var s = this._canSelect ? "" : "none";
        if (this._gridBodyElement) this._gridBodyElement.style.MozUserSelect = s;
        if (this._gridBodyContentElement) this._gridBodyContentElement.style.MozUserSelect = s;
        if (this._gridFixedTopElement) this._gridFixedTopElement.style.MozUserSelect = s;
        if (this._gridFixedLeftElement) this._gridFixedLeftElement.style.MozUserSelect = s;
        if (this._gridFixedCornerElement) this._gridFixedCornerElement.style.MozUserSelect = s;
    }
};
_p.getInsetLeft = function () {
    var res = BiComponent.prototype.getInsetLeft.call(this);
    if (this.getRightToLeft()) res += this._gridBodyElement.offsetWidth - this._gridBodyElement.clientWidth;
    return res;
};
_p.getInsetRight = function () {
    var res = BiComponent.prototype.getInsetRight.call(this);
    if (!this.getRightToLeft()) res += this._gridBodyElement.offsetWidth - this._gridBodyElement.clientWidth;
    return res;
};
_p.getInsetBottom = function () {
    var res = BiComponent.prototype.getInsetBottom.call(this);
    res += this._gridBodyElement.offsetHeight - this._gridBodyElement.clientHeight;
    return res;
};
_p._startEditing = function (oArea) {
    if (!this._inlineEditModel) return;
    var x = oArea.getLeft();
    if (x == -1) x = this._lastEditColumn || 0;
    var y = oArea.getTop();
    var vm = this.getViewManager();
    var iem = this.getInlineEditModel();
    if (x == null || y == null || !iem.getCanEdit(x, y)) return;
    iem.setEditCell(x, y);
    var c = iem.getAttachedComponent(x, y);
    if (c) {
        var cb = vm.getCellBounds(x, y);
        c.setLocation(cb.left, cb.top);
        this._attachedComponents[c.toHashCode()] = {
            col: x,
            row: y,
            width: vm.getCellWidth(x),
            height: vm.getCellHeight(y),
            component: c
        };
        this._lastEditColumn = x;
        this._updateAttachedComponents();
        try {
            if (BiBrowserCheck.moz) BiTimer.callOnce(function () {
                c.setFocused(true);
            }, 0);
            else c.setFocused(true);
        } catch (ex) {
        }
    }
    if (BiBrowserCheck.moz && this._element) {
        this._element.scrollTop = 0;
        this._element.scrollLeft = 0;
    }
    return c;
};
_p.startEditing = function (oCell) {
    this._startEditing(oCell);
};
_p._removeAttachedComponent = function (hc) {
    if (!(hc in this._attachedComponents)) return;
    var obj = this._attachedComponents[hc];
    var c = obj.component;
    var wasAdded = c.getParent() == this;
    if (wasAdded) {
        if (this._inlineEditModel) this._inlineEditModel._hide(c);
    }
    obj.component = null;
    delete this._attachedComponents[hc];
    if (wasAdded) {
        c.removeEventListener("mousedown", this._onAttachedComponentMouseDown, this);
        c.removeEventListener("mouseup", this._onAttachedComponentMouseUp, this);
        c.removeEventListener("click", this._onAttachedComponentClick, this);
        c.removeEventListener("dblclick", this._onAttachedComponentDblClick, this);
        c.removeEventListener("contextmenu", BiTreeViewBase._stopPropagation);
        c.removeEventListener("keydown", this._onAttachedComponentKeyDown, this);
        c.removeEventListener("keypress", this._onAttachedComponentKeyPress, this);
        c.removeEventListener("keyup", BiTreeViewBase._stopPropagation);
        c.removeEventListener("focusin", this._onAttachedComponentFocusIn, this);
    }
};
_p._addAttachedComponent = function (hc) {
    var obj = this._attachedComponents[hc];
    var c = obj.component;
    var wasAdded = c.getParent() == this;
    if (!wasAdded) {
        if (BiBrowserCheck.moz) c.setVisible(false);
        this.add(c);
    }
    this._updateAttachedComponent(obj.col, obj.row);
    if (!wasAdded) {
        c.addEventListener("mousedown", this._onAttachedComponentMouseDown, this);
        c.addEventListener("mouseup", this._onAttachedComponentMouseUp, this);
        c.addEventListener("click", this._onAttachedComponentClick, this);
        c.addEventListener("dblclick", this._onAttachedComponentDblClick, this);
        c.addEventListener("contextmenu", BiTreeViewBase._stopPropagation);
        c.addEventListener("keydown", this._onAttachedComponentKeyDown, this);
        c.addEventListener("keypress", this._onAttachedComponentKeyPress, this);
        c.addEventListener("keyup", BiTreeViewBase._stopPropagation);
        c.addEventListener("focusin", this._onAttachedComponentFocusIn, this);
    }
};
BiTreeViewBase._stopPropagation = function (e) {
    e.stopPropagation();
};
_p._getAttachedComponent = function (x, y) {
    var iem = this.getInlineEditModel();
    var acm = this.getAttachedComponentModel();
    var c;
    if (iem && iem.getHasAttachedComponent(x, y)) {
        c = iem.getAttachedComponent(x, y);
    } else if (acm) {
        c = acm.getAttachedComponent(x, y);
    }
    return c;
};
_p._updateAttachedComponent = function (x, y) {
    var iem = this.getInlineEditModel();
    var acm = this.getAttachedComponentModel();
    if (iem && iem.getHasAttachedComponent(x, y)) {
        iem.updateAttachedComponent(x, y);
    } else if (acm && acm.getHasAttachedComponent(x, y)) {
        acm.updateAttachedComponent(x, y);
    }
};
_p._onEditComponentHide = function (e) {
    this._onEditComponentChange(e);
    var iem = this._inlineEditModel;
    if (iem) {
        var c = iem.getCurrentEditComponent();
        if (c) this._removeAttachedComponent(c.toHashCode());
    }
    this.setFocused(true);
};
_p._onEditComponentChange = function (e) {
    var iem = this._inlineEditModel;
    if (iem) {
        var row = iem.getRow();
        var col = iem.getColumn();
        if (col == -1) col = this._lastEditColumn || 0;
        this.updateCell(col, row);
    }
};
_p._onAttachedComponentKeyPress = function (e) {
    var iem = this.getInlineEditModel();
    if (BiBrowserCheck.moz && iem && iem.getIsEditing() && e.getKeyCode() == BiKeyboardEvent.TAB) {
        e.preventDefault();
    }
};
_p._scrollBatchCount = 0;
_p._beginScrollBatch = function () {
    if (this._useNativeScrollBars) {
        return;
    }
    if (this._scrollBatchCount == 0) {
        var hsb = this._hScrollBar;
        var vsb = this._vScrollBar;
        this._scrollBatchStartValues = {
            vValue: vsb.getValue(),
            vExtent: vsb.getExtent(),
            vMaximum: vsb.getMaximum(),
            hValue: hsb.getValue(),
            hExtent: hsb.getExtent(),
            hMaximum: hsb.getMaximum()
        };
    }
    this._scrollBatchCount++;
};
_p._endScrollBatch = function () {
    if (this._useNativeScrollBars) {
        return;
    }
    this._scrollBatchCount--;
    if (this._scrollBatchCount == 0) {
        var hsb = this._hScrollBar;
        var vsb = this._vScrollBar;
        var old = this._scrollBatchStartValues;
        if (old.vValue != vsb.getValue() || old.vExtent != vsb.getExtent() || old.vMaximum != vsb.getMaximum() || old.hValue != hsb.getValue() || old.hExtent != hsb.getExtent() || old.hMaximum != hsb.getMaximum()) {
            this._onBiTreeViewBaseScroll();
        }
    }
};
BiTreeViewBase._getDefaultRowHeight = function () {
    return 19;
};

function BiImageMap(oImage) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._areas = [];
    if (oImage) this.setImage(oImage);
}
_p = _biExtend(BiImageMap, BiEventTarget, "BiImageMap");
_p._image = null;
_p._areas = null;
BiImageMap.addProperty("image", BiAccessType.READ);
BiImageMap.addProperty("areas", BiAccessType.READ);
_p.addArea = function (oArea) {
    if (!this._areas.contains(oArea)) {
        this._areas.push(oArea);
        oArea._map = this;
    }
};
_p.removeArea = function (oArea) {
    this._areas.remove(oArea);
    oArea._map = null;
};
_p.setAreas = function (oAreas) {
    for (var i = 0; i < oAreas.length; i++) this.addArea(oAreas[i]);
};
_p.dispose = function () {
    if (this._disposed) return;
    if (this._image) {
        this._unHookListeners(this._image);
        this._image.setToolTip(null);
        this._image.setCursor(null);
        this._image = null;
    }
    this.disposeFields("_areas");
    BiEventTarget.prototype.dispose.call(this);
};
_p.addParsedObject = function (o) {
    if (o instanceof BiImageMapArea) this.addArea(o);
    else BiEventTarget.prototype.addParsedObject.call(this, o);
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
        case "image":
        {
            if (sValue.charAt(0) == "#") this.setImage(oParser.getComponentById(sValue.substr(1)));
            else this.setImage(new BiImage(sValue));
            break;
        }
        default:
            BiEventTarget.prototype.setAttribute.apply(this, arguments);
            break;
    }
};
_p.setImage = function (oImage) {
    if (this._image != null) this._unHookListeners(this._image);
    if (oImage) {
        if (!(oImage instanceof BiImage)) throw new Error("BiImage Expected!");
        this._image = oImage;
        this._hookListeners(this._image);
    } else this._image = null;
};
_p._unHookListeners = function (oImg) {
    oImg.removeEventListener("click", this._clickEvent, this);
    oImg.removeEventListener("contextmenu", this._clickEvent, this);
    oImg.removeEventListener("mousemove", this._checkIntersections, this);
    oImg.removeEventListener("mouseout", this._mouseEvent, this);
    oImg.removeEventListener("mousedown", this._clickEvent, this);
    oImg.removeEventListener("mouseup", this._clickEvent, this);
};
_p._hookListeners = function (oImg) {
    oImg.addEventListener("click", this._clickEvent, this);
    oImg.addEventListener("contextmenu", this._clickEvent, this);
    oImg.addEventListener("mousemove", this._checkIntersections, this);
    oImg.addEventListener("mouseout", this._mouseEvent, this);
    oImg.addEventListener("mousedown", this._clickEvent, this);
    oImg.addEventListener("mouseup", this._clickEvent, this);
};
_p._mouseEvent = function (e) {
    if (e.getType() == "mouseout") {
        var tp = this._image.getToolTip();
        if (tp) tp.setVisible(false);
    }
    var areas = this._areas,
        ar;
    for (var i = 0; i < areas.length; i++) {
        ar = areas[i];
        if (ar.__mouseoutFired && ar.__focused) {
            ar.__focused = false;
            ar.__mouseoutFired = false;
            ar.dispatchEvent(new BiImageMapEvent("mouseout", e));
        }
    }
};
_p._clickEvent = function (e) {
    var x = e.getOffsetX(),
        y = e.getOffsetY();
    var type = e.getType(),
        cx = "contextmenu";
    var area;
    for (var i = 0; i < this._areas.length; i++) {
        area = this._areas[i];
        if (area.contains(x, y)) {
            area.dispatchEvent(new BiImageMapEvent(type, e));
            if (type == cx && area._contextMenu) {
                var m = area._contextMenu;
                m.popupAtMouse(e);
            }
        }
    }
};
_p._checkIntersections = function (e) {
    var x = e.getOffsetX(),
        y = e.getOffsetY(),
        type = e.getType();
    for (var i = 0; i < this._areas.length; i++) {
        var tp, area = this._areas[i];
        if (area.contains(x, y)) {
            if (area.__focused && type == "mousemove") {
                area.dispatchEvent(new BiImageMapEvent("mousemove", e));
                if (this._image.getCursor() == null || this._image.getCursor() == "default") this._image.setCursor(area.getCursor());
            } else {
                area.dispatchEvent(new BiImageMapEvent("mouseover", e));
                area.__focused = true;
                tp = area.getToolTip();
                var tpText = area.getToolTipText() || "";
                if (!tp && tpText.length > 0) {
                    tp = BiToolTip.getTextToolTip(tpText);
                }
                if (tp) {
                    this._image.setToolTip(tp);
                    tp._startShowTimer();
                }
                this._image.setCursor(area.getCursor());
            }
        } else if (area.__focused) {
            area.dispatchEvent(new BiImageMapEvent("mouseout", e));
            area.__focused = false;
            area.__mouseoutFired = true;
            tp = area.getToolTip() || BiToolTip.getTextToolTip(area.getToolTipText());
            if (tp && tp == this._image.getToolTip()) {
                tp.setVisible(false);
                this._image.setToolTip(null);
            }
            this._image.setCursor(null);
        }
    }
};

function BiImageMapEvent(sType, oEvent) {
    if (_biInPrototype) return;
    BiEvent.call(this, sType);
    this._associatedEvent = oEvent;
}
_p = _biExtend(BiImageMapEvent, BiEvent, "BiImageMapEvent");
_p._associatedEvent = null;
BiImageMapEvent.addProperty("associatedEvent", BiAccessType.READ);
_p.dispose = function () {
    if (this._disposed) return;
    this.disposeFields("_associatedEvent");
    BiEvent.prototype.dispose.call(this);
};

function BiImageMapArea(oShapes) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._shapes = [];
    if (oShapes instanceof Array) this.setShapes(oShapes);
    else if (oShapes instanceof BiShape) this.addShape(oShapes);
}
_p = _biExtend(BiImageMapArea, BiEventTarget, "BiImageMapArea");
_p._map = null;
_p._shapes = null;
_p._toolTip = null;
_p._toolTipText = "";
_p._contextMenu = null;
_p._cursor = null;
BiImageMapArea.addProperty("map", BiAccessType.READ);
BiImageMapArea.addProperty("shapes", BiAccessType.READ);
BiImageMapArea.addProperty("toolTip", BiAccessType.READ);
BiImageMapArea.addProperty("toolTipText", BiAccessType.READ);
BiImageMapArea.addProperty("contextMenu", BiAccessType.READ);
BiImageMapArea.addProperty("cursor", BiAccessType.READ_WRITE);
_p.addShape = function (oShape) {
    if (!(oShape instanceof BiShape)) throw new Error("Shape Object Expected!");
    if (!this._shapes.contains(oShape)) this._shapes.push(oShape);
};
_p.removeShape = function (oShape) {
    if (!(oShape instanceof BiShape)) throw new Error("Shape Object Expected!");
    if (!this._shapes.contains(oShape)) throw new Error("Can only remove known shapes!");
    this._shapes.remove(oShape);
};
_p.__focused = false;
_p.__mouseoutFired = false;
_p.contains = function (x, y) {
    x = Math.round(x);
    y = Math.round(y);
    for (var i = 0; i < this._shapes.length; i++)
        if (this._shapes[i].contains(x, y)) return true;
    return false;
};
_p.addParsedObject = function (o) {
    if (o instanceof BiShape) this.addShape(o);
    else BiEventTarget.prototype.addParsedObject.call(this, o);
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
        case "map":
        {
            if (sValue.charAt(0) == "#") this.setMap(oParser.getComponentById(sValue.substr(1)));
            break;
        }
        case "shape":
        {
            if (sValue.charAt(0) == "#") this.addShape(oParser.getComponentById(sValue.substr(1)));
            break;
        }
        case "shapes":
        {
            var s = sValue.split(","),
                id;
            for (var i = 0; i < s.length; i++) {
                id = s[i];
                if (id.charAt(0) != "#") throw new Error("Id must be preceded by a '#' !");
                this.addShape(oParser.getComponentById(id.substr(1)));
            }
            break;
        }
        case "toolTip":
        {
            if (sValue.charAt(0) == "#") this.setToolTip(oParser.getComponentById(sValue.substr(1)));
            break;
        }
        case "contextMenu":
        {
            this.setContextMenu(oParser.getComponentById(sValue.substr(sValue.charAt(0) == "#")));
            break;
        }
        default:
            BiEventTarget.prototype.setAttribute.apply(this, arguments);
            break;
    }
};
_p.setContextMenu = function (oMenu) {
    if (oMenu && !(oMenu instanceof BiMenu)) throw new Error("BiMenu expected!");
    this._contextMenu = oMenu;
};
_p.setToolTipText = function (sText) {
    this._toolTipText = String(sText);
};
_p.setToolTip = function (oToolTip) {
    if (oToolTip && !(oToolTip instanceof BiToolTip)) throw new Error("BiToolTip expected!");
    this._toolTip = oToolTip;
};
_p.setMap = function (oMap) {
    if (this._map) this._map.removeArea(this);
    this._map = oMap;
};
_p.setShapes = function (oShapes) {
    for (var i = 0; i < oShapes.length; i++) this.addShape(oShapes[i]);
};
_p.dispose = function () {
    if (this._disposed) return;
    this.disposeFields("__focused", "_shapes", "__mouseoutFired", "_toolTipText", "_cursor");
    this._map = null;
    BiEventTarget.prototype.dispose.call(this);
};

function BiShape() {
    if (_biInPrototype) return;
    BiObject.call(this);
}
_p = _biExtend(BiShape, BiObject, "BiShape");
_p.contains = function (x, y) {
    return false;
};

function BiCircle(oCenter, nRadius) {
    if (_biInPrototype) return;
    BiShape.call(this);
    if (oCenter) this.setCenter(oCenter);
    if (nRadius) this.setRadius(nRadius);
}
_p = _biExtend(BiCircle, BiShape, "BiCircle");
_p._center = null;
_p._radius = 0;
BiCircle.addProperty("center", BiAccessType.READ);
BiCircle.addProperty("radius", BiAccessType.READ);
_p.setRadius = function (nRadius) {
    if (Number(nRadius) <= 0) throw new Error("Need a positive number for circle radius!");
    this._radius = nRadius;
};
_p.setCenter = function (oCenter) {
    if (!(oCenter instanceof BiPoint)) {
        if (typeof oCenter == "string") {
            var pts = oCenter.split(",");
            if (pts.length == 2) this._center = new BiPoint(parseInt(pts[0]), parseInt(pts[1]));
            return;
        }
        throw new Error("Need a center for circle!");
    }
    this._center = oCenter;
};
_p.contains = function (x, y) {
    var a = this._center.getX() - x;
    var b = this._center.getY() - y;
    var c = Math.sqrt(a * a + b * b);
    return c <= this._radius;
};
_p.addParsedObject = function (o) {
    if (o instanceof BiPoint) this._center = o;
    else BiShape.prototype.addParsedObject.call(this, o);
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
        case "center":
        {
            if (sValue.charAt(0) == "#") this.setCenter(oParser.getComponentById(sValue.substr(1)));
            else this.setCenter(sValue);
            break;
        }
        default:
            BiShape.prototype.setAttribute.apply(this, arguments);
            break;
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    this.disposeFields("_radius", "_center");
    BiShape.prototype.dispose.call(this);
};

function BiPolygon(oVertices) {
    if (_biInPrototype) return;
    BiShape.call(this);
    this._vertices = oVertices instanceof Array ? oVertices : [];
}
_p = _biExtend(BiPolygon, BiShape, "BiPolygon");
_p._vertices = null;
BiPolygon.addProperty("vertices", BiAccessType.READ_WRITE);
_p.dispose = function () {
    if (this._disposed) return;
    this.disposeFields("_vertices");
    BiShape.prototype.dispose.call(this);
};
_p.addParsedObject = function (o) {
    if (o instanceof BiPoint) this._vertices.push(o);
    else BiShape.prototype.addParsedObject.call(this, o);
};
_p.setAttribute = function (sName, sValue, oParser) {
    switch (sName) {
        case "vertices":
        {
            var nums = sValue.split(",");
            if (nums.length % 2 != 0) throw new Error("Illegal Definition of Vertices!");
            var vertices = new Array(nums.length / 2);
            for (var i = 0, q = 0; i < nums.length; q++) vertices[q] = new BiPoint(nums[i++], nums[i++]);
            this.setVertices(vertices);
            break;
        }
        default:
            BiShape.prototype.setAttribute.apply(this, arguments);
            break;
    }
};
_p.contains = function (x, y) {
    var e = false,
        ps = this._vertices,
        a, b, c, d;
    for (var i = 0, npol = this._vertices.length, j = npol - 1; i < npol; j = i++) {
        a = ps[i].getX();
        b = ps[i].getY();
        c = ps[j].getX();
        d = ps[j].getY();
        if ((((b <= y) && (y < d)) || ((d <= y) && (y < b))) && (x < (c - a) * (y - b) / (d - b) + a)) e = !e;
    }
    return e;
};
_p.toString = function () {
    var str = "";
    for (var i = 0; i < this._vertices.length; i++) str += this._vertices[i].toString() + "\n";
    return str;
};

function BiPoint(x, y) {
    if (_biInPrototype) return;
    this._x = Math.round(x);
    this._y = Math.round(y);
}
_p = _biExtend(BiPoint, BiObject, "BiPoint");
_p._x = _p._y = 0;
BiPoint.addProperty("x", BiAccessType.READ);
BiPoint.addProperty("y", BiAccessType.READ);
_p.setX = function (x) {
    this._x = Number(x);
};
_p.setY = function (y) {
    this._y = Number(y);
};
_p.dispose = function () {
    if (this._disposed) return;
    this.disposeFields("_x", "_y");
    BiObject.prototype.dispose.call(this);
};
_p.toString = function () {
    var str = BiObject.prototype.toString();
    if (!this._disposed) str += ": (" + this._x + "," + this._y + ")";
    return str;
};