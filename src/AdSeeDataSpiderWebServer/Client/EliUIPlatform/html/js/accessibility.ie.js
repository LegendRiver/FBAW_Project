/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiAccessibilityManager() {
    if (_biInPrototype) return;
    BiObject.call(this);
    if (BiAccessibilityManager._singleton) return BiAccessibilityManager._singleton;
    BiAccessibilityManager._singleton = this;
};
_p = _biExtend(BiAccessibilityManager, BiObject, "BiAccessibilityManager");
_p._activeComponent = null;
BiAccessibilityManager.addProperty("activeComponent", BiAccessType.READ);
BiAccessibilityManager.addProperty("preDescription", BiAccessType.READ_WRITE);
_p.setActiveComponent = function (c, sTitle, bFocus) {
    if (this._activeComponent && this._activeComponent._element && this._activeComponent != c) {
        this._activeComponent._element.title = "";
        var children = this._activeComponent._element.childNodes;
        for (var i = 0; i < children.length; i++) {
            if (children[i].title && children[i].title != "") {
                children[i].title = "";
            }
        }
    }
    this._activeComponent = c;
    if (c instanceof BiComponent && !c.getContainsFocus() && !(c instanceof BiWindow || c instanceof BiMenuBar)) {
        return;
    }
    var el = (c._document || document).activeElement;
    if (!el) {
        return;
    }
    if (sTitle != null) {
        el.title = sTitle;
    }
    if (bFocus) {
        el.fireEvent("onfocus");
    }
};
_p.articulateDescription = function (component, bUseFullDescription, bFocus) {
    var title = this._preDescription ? this._preDescription + " " : "";
    if (bUseFullDescription) {
        var forLabel = component.getForLabel();
        title += (forLabel ? forLabel.getText() + " " : "");
        title += component.getDescription();
    } else title += component.getChangeDescription();
    this.setActiveComponent(component, title, bFocus);
};
_p.speak = function (sText, bExcludeFocusDescription) {
    if (!this._activeComponent) return;
    var s = sText;
    if (!bExcludeFocusDescription) {
        var desc = this._activeComponent.getDescription();
        if (desc) {
            s += ". ";
            s += desc;
        }
    }
    this.setActiveComponent(this._activeComponent, s, true);
};
_p._firstMenuBar = true;
BiAccessibilityManager.addProperty("firstMenuBar", BiAccessType.READ_WRITE);
_p._firstMenu = true;
BiAccessibilityManager.addProperty("firstMenu", BiAccessType.READ);
_p.setFirstMenu = function (bFirstMenu) {
    BiTimer.callOnce(function () {
        this._firstMenu = bFirstMenu;
    }, 500, this);
};
_p.addFormsModeTextField = function () {
    var fmtf = new BiTextField(" ");
    fmtf.setProperties({
        opacity: 0.01,
        left: -10,
        top: -10,
        width: 11,
        height: 11,
        tabIndex: 0,
        zIndex: 1000
    });
    var win = application.getWindow();
    application.getWindow().add(fmtf, win._children[0], true);
    fmtf._element.title = "Please press Enter if forms mode is on. Then press tab to enter the application.";
    this._fmtf = fmtf;
};
_p._titleLbl = null;
_p._menuLbl = null;
_p._createMenuLabel = function () {
    var menuLbl = new BiLabel();
    menuLbl.setProperties({
        left: 0,
        top: 0,
        width: 1,
        height: 1,
        tabIndex: 0
    });
    menuLbl.addEventListener("keydown", function (e) {
        if (e.matchesBundleShortcut("focus.next") || e.matchesBundleShortcut("focus.previous")) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
    var win = application.getWindow();
    win.add(menuLbl, null, true);
    this._menuLbl = menuLbl;
};
_p._createTitleLabel = function () {
    var titleLbl = new BiLabel();
    titleLbl.setProperties({
        left: 0,
        top: 0,
        width: 1,
        height: 1,
        tabIndex: 0
    });
    titleLbl.addEventListener("keydown", function (e) {
        var focusBack = e.matchesBundleShortcut("focus.previous");
        if (focusBack || e.matchesBundleShortcut("focus.next")) {
            e.preventDefault();
            var isInlineEdit = false;
            var p = this._owner._parent;
            if (p instanceof BiTreeViewBase) {
                var iem = p.getInlineEditModel();
                isInlineEdit = iem && iem.getIsEditing();
            }
            if (isInlineEdit) {
                p._onAttachedComponentKeyDown(e);
                var sm = p.getSelectionModel();
                var item = p._getNextTabItem(sm.getLeadItem(), focusBack);
                if (item) {
                    sm.setSelectedItems([item]);
                    sm.setLeadItem(item);
                    sm.setAnchorItem(item);
                    sm.scrollItemIntoView(item);
                }
            } else {
                e.stopPropagation();
                application.getFocusManager()._getNext(this._owner, focusBack ? -1 : 1).setFocused(true);
            }
        } else if (this._parent instanceof BiComboBoxItem && !(e.matchesBundleShortcut("controls.accept") || e.matchesBundleShortcut("selection.up") || e.matchesBundleShortcut("selection.down"))) {
            this._owner._element.focus();
        }
    });
    titleLbl.getDescription = function () {
        if (this._owner) {
            return this._owner.getDescription();
        }
        return BiComponent.prototype.getDescription.call(this);
    };
    this._titleLbl = titleLbl;
};
_p.moveMenuLabel = function (top, left) {
    this._menuLbl.setTop(top);
    this._menuLbl.setLeft(left);
};
_p.getTitleLabel = function () {
    if (!this._titleLbl || this._titleLbl._disposed) this._createTitleLabel();
    return this._titleLbl;
};
_p.manageFocus = function (oAddTo, oOwner) {
    if (oAddTo && oAddTo.getIsVisible() && oOwner.getContainsFocus()) {
        this.getTitleLabel()._owner = oOwner;
        oAddTo.add(this.getTitleLabel());
        if (oOwner != oAddTo) this.getTitleLabel().setLocation(0, 0);
        this.getTitleLabel()._element.focus();
    }
};
_p.moveFocus = function () {
    if (this._menuLbl._element != document.activeElement) {
        this.setFirstMenuBar(true);
        this.setFirstMenu(true);
        if (!this._oldFocus) this._oldFocus = document.activeElement;
        this._menuLbl.setFocused(true);
    }
};
_p.restoreFocus = function () {
    try {
        this.setFirstMenuBar(true);
        this.setFirstMenu(true);
        this._oldFocus.focus();
    } catch (ex) {}
    delete this._oldFocus;
};
application.getAccessibilityManager = function () {
    return new BiAccessibilityManager();
};
application.addEventListener("load", function () {
    var am = application.getAccessibilityManager();
    am._createMenuLabel();
    am.addFormsModeTextField();
    var description = application.getAccessibilityDescription();
    if (description != null) {
        alert(description);
    }
});
if (typeof BiAccordionButton == "function") {
    BiAccordionButton.prototype.getDescription = function () {
        return this.getText() + " accordion page, to switch pages use the arrow keys";
    };
};
if (typeof BiCalendar == "function") {
    _p = BiCalendar.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this.addEventListener("change", this._on508Change);
    };
    _p._on508Focus = function (e) {
        var leadItemDate = this.getSelectedDate();
        if (leadItemDate != null) {
            BiTimer.callOnce(function () {
                var am = application.getAccessibilityManager();
                leadItemDate = new Date(leadItemDate);
                BiCalendar._unifyDate(leadItemDate);
                var leadItem = this._dateToLabel[String(leadItemDate.valueOf())];
                am.manageFocus(leadItem, this);
                am.setActiveComponent(this, this.getDescription(), false);
            }, 1, this);
        } else {
            var am = application.getAccessibilityManager();
            am.setActiveComponent(this, this.getDescription(), true);
        }
    };
    _p._on508Change = function (e) {
        if (!this._created) return;
        var leadItemDate = this.getSelectedDate();
        var am = application.getAccessibilityManager();
        if (leadItemDate != null) {
            leadItemDate = new Date(leadItemDate);
            BiCalendar._unifyDate(leadItemDate);
            var leadItem = this._dateToLabel[String(leadItemDate.valueOf())];
            if (this._parent instanceof BiPopup && this._parent._parent instanceof BiDatePicker) {
                am.manageFocus(leadItem, this._parent._parent);
                am.setActiveComponent(this._parent._parent, this._parent._parent.getChangeDescription(), false);
            } else {
                am.manageFocus(leadItem, this);
                am.setActiveComponent(this, this.getChangeDescription(), false);
            }
        }
    };
    _p.getDescription = function () {
        var description = "calendar, ";
        var df;
        if (this.getSelectedDate()) {
            df = new BiDateFormat("d");
            description += df.format(this.getSelectedDate()) + ", ";
        }
        df = new BiDateFormat("MMMM yyyy");
        description += df.format(this.getCurrentDate()) + ", ";
        description += "to change the date use the arrow keys";
        return description;
    };
    _p.getChangeDescription = function () {
        var df = new BiDateFormat("d, MMMM yyyy");
        return df.format(this.getSelectedDate());
    };
};
if (typeof BiCheckBox == "function") {
    _p = BiCheckBox.prototype;
    _p.initAccessibility = function () {
        BiLabel.prototype.initAccessibility.call(this);
        this.addEventListener("change", this._on508Change);
        this.__on508onActivate = function () {
            this._div._biComponent._on508onActivate();
            event.returnValue = false;
            return false;
        };
        if (BiBrowserCheck.ie) {
            this.addEventListener("create", function (e) {
                this._input.onbeforeactivate = this.__on508onActivate;
            });
            if (this._created) this._input.onbeforeactivate = this.__on508onActivate;
        }
    };
    _p._on508onActivate = function () {
        this._element.setActive();
    };
    _p.getDescription = function () {
        return this.getChangeDescription() + "to " + (this.getChecked() ? "clear" : "check") + " press space bar";
    };
    _p.getChangeDescription = function () {
        var description = this.getText();
        if (description == "") {
            description = this.getToolTipText();
        }
        description += " check box ";
        description += (this.getChecked() ? "" : "not ") + "checked, ";
        return description;
    };
};
if (typeof BiColorPicker == "function") {
    BiColorPicker.prototype.getDescription = function () {
        return "color picker";
    };
};
if (typeof BiComboBox == "function") {
    _p = BiComboBox.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this.addEventListener("change", this._on508Change);
        this.addEventListener("activechanged", this._on508ActiveChange);
        this.addEventListener("mousemove", this._on508MouseMove);
        this.addEventListener("keydown", this._on508KeyDown);
    };
    _p.getDescription = function () {
        var itemCount = this.getChildren().length;
        var selectedItem = this.getSelectedItem();
        var description = this.getEditable() ? "edit " : "";
        description += "combo box with ";
        description += itemCount + (itemCount == 1 ? " item" : " items");
        if (selectedItem) {
            description += ", " + selectedItem.getText();
            description += ", " + (selectedItem.getIndex() + 1) + " of " + itemCount;
        }
        description += ", to select items use the arrow keys";
        if (this.getEditable()) description += " or type the value";
        return description;
    };
    _p.getChangeDescription = function () {
        var itemCount = this.getChildren().length;
        var item = this.getSelectedItem();
        var description = "";
        if (item) {
            description += "selected " + item.getText();
            description += ", " + (item.getIndex() + 1) + " of " + itemCount;
        }
        return description;
    };
    _p._on508PopupShow = _p._onPopupShow;
    _p._onPopupShow = function (e) {
        this._on508PopupShow();
        if (this._stop508Focus) return;
        var selectedItem = this.getSelectedItem();
        if (selectedItem) {
            var am = application.getAccessibilityManager();
            am.manageFocus(selectedItem, this);
        }
    };
    _p._on508PopupHide = _p._onPopupHide;
    _p._onPopupHide = function (e) {
        this._on508PopupHide();
        var tf = this.getTextField();
        var el = tf.getIsVisible() ? tf._element : this._element;
        el.focus();
    };
    _p._on508MouseMove = function () {
        this._stop508Focus = true;
    };
    _p._on508KeyDown = function () {
        this._stop508Focus = false;
    };
    _p._on508ActiveChange = function () {
        if (this._stop508Focus) return;
        if (!this._created) return;
        if (!this._list._created) return;
        var item = this._list.getSelectedItem();
        var am = application.getAccessibilityManager();
        if (item) {
            am.manageFocus(item, this);
            var itemCount = this.getChildren().length;
            var description = "";
            description += item.getText();
            description += ", " + (item.getIndex() + 1) + " of " + itemCount;
            am.setActiveComponent(this, description, true);
        }
    };
};
if (typeof BiComponent == "function") {
    _p = BiComponent.prototype;
    _p.initAccessibility = function () {
        this.addEventListener("mousedown", this._on508MouseDown);
        this.addEventListener("mouseup", this._on508MouseUp);
        this.addEventListener("focus", this._on508Focus);
    };
    _p._on508MouseDown = function (e) {
        if (e.getOffsetX() > this.getClientWidth() || e.getOffsetY() > this.getClientHeight()) {
            this._ignoreFocus = true;
        }
    };
    _p._on508MouseUp = function (e) {
        this._ignoreFocus = false;
    };
    _p._on508Focus = function () {
        this.articulateDescription();
    };
    _p._on508Change = function () {
        if (this.getFocused()) this.articulateChangeDescription(this, false, true);
    };
    _p.articulateDescription = function () {
        application.getAccessibilityManager().articulateDescription(this, true, false);
    };
    _p.articulateChangeDescription = function () {
        application.getAccessibilityManager().articulateDescription(this, false, true);
    };
};
if (typeof BiDatePicker == "function") {
    _p = BiDatePicker.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this.addEventListener("change", this._on508Change);
        this.addEventListener("show", this._onCalendarShow);
        this.addEventListener("hide", this._onCalendarHide);
    };
    _p.getDescription = function () {
        return "date picker, " + this.getChangeDescription() + "to change the date use the arrow keys or type the value";
    };
    _p.getChangeDescription = function () {
        if (this.getSelectedDate()) {
            var df = new BiDateFormat("d, MMMM yyyy");
            return df.format(this.getSelectedDate());
        } else return "No date is currently selected,";
    };
    _p._onCalendarShow = function (e) {
        application.getAccessibilityManager().getTitleLabel().addEventListener("keydown", this._moveKeyEvent, this);
        BiTimer.callOnce(function () {
            var leadItemDate = this._calendar.getSelectedDate();
            if (leadItemDate == null) return;
            leadItemDate = new Date(leadItemDate);
            BiCalendar._unifyDate(leadItemDate);
            var leadItem = this._calendar._dateToLabel[String(leadItemDate.valueOf())];
            var am = application.getAccessibilityManager();
            am.manageFocus(leadItem, this);
            var description = "showing ";
            description += this._calendar.getDescription();
            am.setActiveComponent(this, description, false);
        }, 1, this);
    };
    _p._onCalendarHide = function (e) {
        var am = application.getAccessibilityManager();
        am.getTitleLabel().removeEventListener("keydown", this._moveKeyEvent, this);
        var description = "hiding calendar";
        if (this.getSelectedDate()) {
            var df = new BiDateFormat("d, MMMM yyyy");
            description += ", " + df.format(this.getSelectedDate());
        }
        am.setActiveComponent(this, description);
    };
    _p._moveKeyEvent = function (e) {
        if (e.matchesBundleShortcut("controls.accept")) this._textField._element.focus();
        else if (e.matchesBundleShortcut("popup.close")) {
            this._onKeyDown(e);
            this._textField._element.focus();
        }
    };
};
if (typeof BiDesktopPane == "function") {
    BiDesktopPane.prototype.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this._windowManager.addEventListener("activation", function (e) {
            application.getAccessibilityManager().speak("You are now entering the desktop pane,");
        }, this);
        this._windowManager.addEventListener("deactivation", function () {
            this._justDeactivated = true;
        }, this);
    };
    BiDesktopPane.prototype.getDescription = function () {
        var leavingDP = "";
        if (this._justDeactivated) {
            leavingDP = "Leaving ";
            this._justDeactivated = false;
        }
        var description = leavingDP + "desktop pane, to enter first child window press control + F 6 ,  to get back to main window, press shift + control + F 6 , there ";
        var l = this._windowManager._visibleWindows.length;
        if (l == 0) description += "are no open windows.";
        else if (l == 1) description += "is one open window.";
        else {
            description += "are ";
            description += l;
            description += " open windows.";
        }
        return description;
    };
};
if (typeof BiDialog == "function") {
    BiDialog.prototype.getDescription = function () {
        var description = this.getCaption();
        var cp = this.getContentPane();
        if (cp instanceof BiOptionPane) {
            var type = cp.getMessageType();
            if (type == "error" || type == "information" || type == "warning") {
                description += " " + type;
            }
            description += " dialog, " + cp.getMessage();
        } else {
            description += " dialog";
        }
        return description;
    };
};
if (typeof BiGauge == "function") {
    _p = BiGauge.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
    };
    _p.getDescription = function () {
        var value = this.getValue();
        var description = "gauge, " + value;
        if (this.getShowWarningSection() && value >= this.getWarningValue()) return description + ", warning, value is above " + this.getWarningValue();
        else return description;
    };
};
if (typeof BiGraph == "function") {
    _p = BiGraph.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
    };
    _p.getDescription = function () {
        var description = "graph ";
        var series = this.getSeries();
        var categories = this.getCategories();
        var values;
        for (var i = 0; i < series.length; i++) {
            description += ", " + series[i].getTitle();
            for (var j = 0; j < categories.length; j++) {
                values = series[i].getValues();
                description += ", " + categories[j].getTitle() + " " + values[j];
            }
        }
        return description;
    };
};
if (typeof BiGraph2 == "function") {
    _p = BiGraph2.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
    };
    _p.getDescription = function () {
        var description = "graph ";
        var series = this.getSeries();
        var categories = this.getCategories();
        var values;
        for (var i = 0; i < series.length; i++) {
            description += ", " + series[i].getTitle();
            for (var j = 0; j < categories.length; j++) {
                values = series[i].getValues();
                description += ", " + categories[j].getTitle() + " " + values[j];
            }
        }
        return description;
    };
};
if (typeof BiGrid == "function") {
    _p = BiGrid.prototype;
    _p.getDescription = function () {
        return "list view, " + this.getChangeDescription() + ", to move to items use the arrow keys";
    };
    _p.getChangeDescription = function () {
        var description = "";
        var leadItem = this.getSelectionModel().getLeadItem();
        if (leadItem) {
            if (!leadItem.getSelected()) description += "not selected ";
            var columnNames = this.getColumnNames();
            if (leadItem instanceof BiGridRow) {
                var cells = leadItem.getCells();
                var order = this.getColumnOrders();
                var cols = this.getColumns();
                for (var i = 0; i < order.length; i++) {
                    if (cols[order[i]].getVisible()) {
                        description += columnNames[order[i]] + " ";
                        description += cells[order[i]].getData() + ", ";
                    }
                }
            } else if (leadItem instanceof BiGridCell) {
                description += columnNames[leadItem.getColumnIndex()] + " ";
                description += leadItem.getData() + ", ";
            }
            var rows = this.getRows().length;
            description += (leadItem.getRowIndex() + 1) + " of " + rows;
        }
        return description;
    };
};
if (typeof BiGrid2 == "function") {
    _p = BiGrid2.prototype;
    _p.getDescription = function () {
        return "list view, " + this.getChangeDescription() + ", to move to items use the arrow keys";
    };
    _p.getChangeDescription = function () {
        return this._getLeadItemDescription();
    };
};
if (typeof BiGroupBox == "function") {
    _p = BiGroupBox.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
    };
    _p.getDescription = function () {
        return this.getText();
    };
};
if (typeof BiImage == "function") {
    _p = BiImage.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
    };
    _p.getDescription = function () {
        var description = "";
        if (this.getAlt() != null) description += this.getAlt() + " ";
        return description + "graphic";
    };
};
if (typeof BiIpField == "function") {
    _p = BiIpField.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this.addEventListener("fieldchange", this._on508Change);
        this.addEventListener("invalidinput", this._onInvalidInput);
    };
    _p.getDescription = function () {
        var description = "I P field, I P address " + this.getIp();
        if (this._activeTextField) return description + ", " + this.getChangeDescription();
        else return description;
    };
    _p.getChangeDescription = function () {
        var name = this._activeTextField.getName();
        if (name != null) return name;
        else return "";
    };
    _p._onInvalidInput = function (e) {
        var description = "Invalid input, you can only write a number from 0 to 255 in each part";
        if (this._textFields.indexOf(this._activeTextField) < this._textFields.length - 1) description += ", to move to the next part write a dot, or use tab or the arrow keys";
        application.getAccessibilityManager().speak(description);
    };
};
if (typeof BiLabel == "function") {
    _p = BiLabel.prototype;
    _p.getDescription = function () {
        return this.getText() || "";
    };
    _p.setLabelFor = function (oComponent) {
        oComponent._forLabel = this;
        this._labelFor = oComponent;
        if (oComponent instanceof BiTextField || oComponent instanceof BiTextArea || oComponent instanceof BiPasswordField || oComponent instanceof BiButton || oComponent instanceof BiCheckBox || oComponent instanceof BiRadioButton) {
            this.setHtmlProperty("htmlFor", oComponent == null ? "" : oComponent.getHtmlProperty("id"));
        }
    };
};
if (typeof BiList == "function") {
    _p = BiList.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this.addEventListener("change", this._on508Change);
        this.addEventListener("create", this._addSelectionChangeListener, this);
        if (this._created) this._addSelectionChangeListener();
    };
    _p._addSelectionChangeListener = function () {
        var selectionModel = this.getSelectionModel();
        if (selectionModel) selectionModel.addEventListener("leaditemchange", this._on508Change, this);
    };
    _p._removeSelectionChangeListener = function () {
        var selectionModel = this.getSelectionModel();
        if (selectionModel) selectionModel.removeEventListener("leaditemchange", this._on508Change, this);
    };
    _p._on508Focus = function (e) {
        this._element.title = " ";
        BiTimer.callOnce(function () {
            this._addFocusLabel(true);
        }, 1, this);
    };
    _p._on508Change = function () {
        if (!this._created) return;
        if (this._parent instanceof BiPopup && this._parent._parent instanceof BiComboBox) return;
        this._addFocusLabel(false);
    };
    _p._addFocusLabel = function (bUseFullDescription) {
        if (this._ignoreFocus) return;
        var scroll = this.getScrollTop();
        var leadItem = this.getSelectionModel().getLeadItem();
        var am = application.getAccessibilityManager();
        am.manageFocus(leadItem, this);
        am.articulateDescription(this, bUseFullDescription, false);
        this.setScrollTop(scroll);
        if (leadItem != null) leadItem.scrollIntoView();
    };
    _p.getDescription = function () {
        var itemCount = this.getChildren().length;
        var description = "list box with ";
        description += itemCount + (itemCount == 1 ? " item" : " items");
        return description + ", " + this.getChangeDescription() + ", to move to items use the arrow keys";
    };
    _p.getChangeDescription = function () {
        var itemCount = this.getChildren().length;
        var leadItem = this.getSelectionModel().getLeadItem();
        var description = "";
        if (leadItem) {
            description += (leadItem.getSelected() ? "" : "not ") + "selected " + leadItem.getText();
            description += ", " + (leadItem.getIndex() + 1) + " of " + itemCount;
        }
        return description;
    };
    _p._508dispose = _p.dispose;
    _p.dispose = function () {
        if (this._disposed) return;
        this._508dispose();
        this._removeSelectionChangeListener();
    };
};
if (typeof BiMenu == "function") {
    _p = BiMenu.prototype;
    _p._performActionOn = function (oNext) {
        BiTimer.callOnce(oNext._performAction, 0, oNext);
        application.getAccessibilityManager().setPreDescription("menu action,");
        return oNext;
    };
    _p._setVisible508 = _p.setVisible;
    _p.setVisible = function (b) {
        if (!b) application.getAccessibilityManager().setPreDescription("closing menu");
        this._setVisible508(b);
    };
}
if (typeof BiMenuItem == "function") {
    var _p = BiMenuItem.prototype;
    _p._508appendCells = _p._appendCells;
    _p._appendCells = function (trElement) {
        this._508appendCells(trElement);
        var el = this._accElement = BiXml.getOwnerDocument(trElement).createElement("div");
        el.tabIndex = 0;
        el.className = "accessibility-focus";
        trElement.firstChild.appendChild(el);
    };
    _p._focus = function () {
        var el = this._accElement;
        el.focus();
        var am = application.getAccessibilityManager();
        var predesc = am.getPreDescription();
        am.setPreDescription(null);
        var s = (predesc ? predesc + " " : "") + this.getText();
        var mnemonic = this.getMnemonic();
        if (mnemonic) s += " " + mnemonic;
        var shortcut = this.getShortcutText();
        if (shortcut) s += " " + shortcut;
        if (this._subMenu) s += " press right or left to access sub menu";
        el.title = s;
    };
}
if (typeof BiMenuButton == "function") {
    _p = BiMenuButton.prototype;
    _p._508popupMenu = _p.popupMenu;
    _p.popupMenu = function (b) {
        var s = this.getText() + " menu";
        var mnemonic = this.getMnemonic();
        if (mnemonic) s += " alt+" + mnemonic;
        var am = application.getAccessibilityManager();
        am.setPreDescription(s + ",");
        this._508popupMenu(b);
    };
};
if (typeof BiOlapGrid == "function") {
    _p = BiOlapGrid.prototype;
    _p.getDescription = function () {
        return "olap grid, " + this._getLeadItemDescription() + ", " + "to move to items use the arrow keys";
    };
    _p._moveTitleLabel = function () {
        var am = application.getAccessibilityManager();
        if (!am._titleLbl) return;
        var leadItem = this.getSelectionModel().getLeadItem();
        if (!leadItem) return;
        var vm = this.getViewManager();
        var axisHeight = vm.getAxisHeight();
        var axisWidth = vm.getAxisWidth();
        var scrollLeft = this.getScrollLeft();
        var scrollTop = this.getScrollTop();
        var nonFixedRow = vm.getNonFixedCell(1);
        var nonFixedCol = vm.getNonFixedCell(0);
        var col = leadItem.getLeft();
        var row = leadItem.getTop();
        var x = vm.getCellLeft(col) + axisWidth - (col >= nonFixedCol ? scrollLeft : 0);
        var y = vm.getCellTop(row) + axisHeight - (row >= nonFixedRow ? scrollTop : 0);
        am._titleLbl.setLocation(x, y);
    };
    _p.getChangeDescription = function () {
        return this._getLeadItemDescription();
    };
    _p._getLeadItemDescription = function () {
        var description = "";
        var sm = this.getSelectionModel();
        var leadItem = sm.getLeadItem();
        if (leadItem) {
            var x = leadItem.getLeft();
            var y = leadItem.getTop();
            var dm = this.getDataModel();
            var vm = this.getViewManager();
            var pos;
            if (!sm.getCellSelected(x, y)) description += "not selected ";
            var dim, axis = 1;
            for (dim = 0; dim < dm.getAxisDimensionCount(axis); dim++) {
                pos = vm.getAxisCellStartPosition(axis, dim, y);
                description += dm.getAxisDimensionName(axis, dim) + " ";
                description += dm.getAxisCellText(axis, dim, pos) + ", ";
            }
            axis = 0;
            for (dim = 0; dim < dm.getAxisDimensionCount(axis); dim++) {
                pos = vm.getAxisCellStartPosition(axis, dim, x);
                description += dm.getAxisDimensionName(axis, dim) + " ";
                description += dm.getAxisCellText(axis, dim, pos) + ", ";
            }
            description += BiLabel.htmlToText(dm.getCellText(x, y));
        }
        return description;
    };
    _p._on508AttachedComponentFocusIn = _p._onAttachedComponentFocusIn;
    _p._onAttachedComponentFocusIn = function (e) {
        this._ignoreFocus = true;
        if (e.getTarget() != application.getAccessibilityManager().getTitleLabel()) this._on508AttachedComponentFocusIn(e);
    };
}
if (typeof BiOlapGridSelectionModel == "function") {
    BiOlapGridSelectionModel.prototype._508getItemToSelect = BiOlapGridSelectionModel.prototype.getItemToSelect;
    BiOlapGridSelectionModel.prototype.getItemToSelect = function (e) {
        if (!(e.matchesBundleShortcut("focus.next") || e.matchesBundleShortcut("focus.previous"))) return this._508getItemToSelect(e);
    };
};
if (typeof BiProgressBar == "function") {
    _p = BiProgressBar.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this.addEventListener("change", function (e) {
            var time = new Date();
            if (!this._lastReadTime || time - this._lastReadTime > 5000 || this.getValue() == this.getMaximum()) {
                this._on508Change(e);
                this._lastReadTime = time;
            }
        }, this);
    };
    _p.getDescription = function () {
        this._lastReadTime = new Date();
        return "progress bar, " + this.getChangeDescription();
    };
    _p.getChangeDescription = function () {
        var value = Math.ceil(this.getValue() / (this.getMaximum() - this.getMinimum()) * 100);
        return value + " per cent";
    };
};
if (typeof BiRadioButton == "function") {
    _p = BiRadioButton.prototype;
    _p.initAccessibility = function () {
        BiLabel.prototype.initAccessibility.call(this);
        this.addEventListener("change", this._on508Change);
        this.__on508onActivate = function () {
            this._div._biComponent._on508onActivate();
            event.returnValue = false;
            return false;
        };
        if (BiBrowserCheck.ie) {
            this.addEventListener("create", function (e) {
                this._input.onbeforeactivate = this.__on508onActivate;
            });
            if (this._created) this._input.onbeforeactivate = this.__on508onActivate;
        }
    };
    _p._on508onActivate = function () {
        this._element.setActive();
    };
    _p.getDescription = function () {
        return this.getChangeDescription() + (this.getChecked() ? "" : ", to check press spacebar");
    };
    _p.getChangeDescription = function () {
        var description = this.getText() || this.getToolTipText();
        if (this.getGroup() && this.getGroup()._forLabel) description = this.getGroup()._forLabel.getText() + ", " + description;
        return description + " radio button " + (this.getChecked() ? "" : "not ") + "checked ";
    };
    _p._508setChecked = _p.setChecked;
    _p.setChecked = function (b) {
        if (this._checked != b) {
            this._508setChecked(b);
            this._on508Change();
        }
    };
};
if (typeof BiRichEdit == "function") {
    _p = BiRichEdit.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
    };
    _p.getDescription = function () {
        return "rich edit";
    };
};
if (typeof BiSlider == "function") {
    _p = BiSlider.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this.addEventListener("change", this._on508Change);
    };
    _p.getDescription = function () {
        return (this.getOrientation() == "horizontal" ? "left right slider " : "up down slider ") + ", " + this.getValue() + ", to increase or decrease use the arrow keys";
    };
    _p.getChangeDescription = function () {
        return this.getValue() + " ";
    };
};
if (typeof BiSpinner == "function") {
    _p = BiSpinner.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this.addEventListener("change", this._on508Change);
        this.addEventListener("invalidcharacter", this._onInvalidCharacter);
        this.addEventListener("invalidvalue", this._onInvalidValue);
    };
    _p.getDescription = function () {
        return "edit spinn box, value " + this.getValue() + ", to set the value use the arrow keys or type the value";
    };
    _p.getChangeDescription = function () {
        return "spinn box, value " + this.getValue();
    };
    _p._onInvalidCharacter = function (e) {
        var description = "unacceptable character, you can only type a number here";
        application.getAccessibilityManager().speak(description, true);
    };
    _p._onInvalidValue = function (e) {
        var description = "the value is not valid, the value must be between " + this.getMinimum() + " and " + this.getMaximum() + ", value changed to " + this.getValue();
        application.getAccessibilityManager().speak(description, true);
    };
};
if (typeof BiStatusBarPanel == "function") {
    BiStatusBarPanel.prototype.getDescription = function () {
        var description = "status bar message";
        if (this.getText() != null) {
            description += ", " + this.getText();
        }
        return description;
    };
};
if (typeof BiTabButton == "function") {
    _p = BiTabButton.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
    };
    _p.getDescription = function () {
        return this.getText() + " tab, to switch pages use the arrow keys";
    };
};
if (typeof BiTimePicker == "function") {
    _p = BiTimePicker.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this.addEventListener("fieldchange", this._on508Change);
        this.addEventListener("change", this._on508Change);
        this.addEventListener("invalidcharacter", this._onInvalidCharacter);
    };
    _p.getDescription = function () {
        return "time edit spin box, " + "to set the value use the arrow keys or type the value," + this.getChangeDescription();
    };
    _p.getChangeDescription = function () {
        return this._activeTextField.getName() || "";
    };
    _p._onInvalidCharacter = function (e) {
        var description = "Unacceptable character, you can only type a number here";
        application.getAccessibilityManager().speak(description, true);
    };
};
if (typeof BiToolBarButton == "function") {
    _p = BiToolBarButton.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
    };
    _p.getDescription = function () {
        var description = "tool bar ";
        if (this.getText() != "") {
            description += this.getText();
        } else if (this.getToolTipText() != "") {
            description += this.getToolTipText();
        }
        if (this.getIcon()) description += this.getIcon().getDescription();
        description += " button, ";
        description += "to activate press space bar";
        return description;
    };
}
if (typeof BiToolBarRadioButton == "function") {
    _p = BiToolBarRadioButton.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this.addEventListener("change", this._on508Change);
    };
    _p.getDescription = function () {
        var description = "tool bar ";
        if (this.getText() != "") {
            description += this.getText();
        } else if (this.getToolTipText() != "") {
            description += this.getToolTipText();
        }
        if (this.getIcon()) description += this.getIcon().getDescription();
        description += " radio button ";
        return description + (this.getChecked() ? "checked, to select another use the arrow keys" : "not checked, to activate press space bar");
    };
    _p.getChangeDescription = function () {
        if (this.getChecked()) return "checked";
        else return "not checked";
    };
}
if (typeof BiToolBarToggleButton == "function") {
    _p = BiToolBarToggleButton.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this.addEventListener("change", this._on508Change);
    };
    _p.getDescription = function () {
        return this.getChangeDescription() + "to change value press space bar";
    };
    _p.getChangeDescription = function () {
        var description = "tool bar ";
        if (this.getText() != "") {
            description += this.getText();
        } else if (this.getToolTipText() != "") {
            description += this.getToolTipText();
        }
        if (this.getIcon()) description += this.getIcon().getDescription();
        description += " toggle button ";
        description += (this.getChecked() ? "" : "not ") + "checked, ";
        return description;
    };
}
if (typeof BiToolBarMenuButton == "function") {
    BiToolBarMenuButton.prototype.getDescription = function () {
        var description = "tool bar ";
        if (this.getText() != "") {
            description += this.getText();
        } else if (this.getToolTipText() != "") {
            description += this.getToolTipText();
        }
        if (this.getIcon()) description += this.getIcon().getDescription();
        description += " menu button, ";
        description += "to show menu press space bar";
        return description;
    };
};
if (typeof BiTree == "function") {
    _p = BiTree.prototype;
    _p.initAccessibility = function () {
        BiAbstractGrid.prototype.initAccessibility.call(this);
        this.addEventListener("expandedchanged", this._on508Change);
    };
    _p.getDescription = function () {
        var leadItem = this.getSelectionModel().getLeadItem();
        if (leadItem) this._lastDepth = leadItem.getLevel();
        else this._lastDepth = 1;
        return "tree view, " + this._getLeadItemDescription() + ", to move through or expand items use the arrow keys";
    };
    _p.getChangeDescription = function () {
        var leadItem = this.getSelectionModel().getLeadItem();
        if (leadItem) {
            var depth = leadItem.getLevel();
            if (this._lastDepth != depth) {
                this._lastDepth = depth;
                return "level " + depth + ", " + this._getLeadItemDescription();
            }
        }
        return this._getLeadItemDescription();
    };
    _p._getLeadItemDescription = function () {
        var description = "";
        var leadItem = this.getSelectionModel().getLeadItem();
        if (leadItem) {
            if (!leadItem.getSelected()) description += "not selected ";
            var order = this.getColumnOrders();
            var columns = this.getColumns();
            var columnNames = this.getColumnNames();
            for (var i = 0; i < order.length; i++) {
                if (columns[order[i]].getVisible()) {
                    description += columnNames[order[i]] + " ";
                    description += leadItem.getData(order[i]) + ", ";
                }
            }
            if (!leadItem.isLeaf()) {
                if (leadItem.getExpanded()) description += "expanded, ";
                else description += "collapsed, ";
            }
            if (!leadItem.isLeaf() && leadItem.getExpanded()) {
                var items = leadItem.getNodes().length;
                description += items + " item" + (items == 1 ? "" : "s");
            } else {
                var parent = leadItem.getParentNode();
                if (!parent) parent = this;
                var nodes = parent.getNodes();
                var nodeCount = nodes.length;
                var index;
                for (index = 0; index < nodeCount; index++) {
                    if (nodes[index] == leadItem) break;
                }
                description += (index + 1) + " of " + nodeCount;
            }
        }
        return description;
    };
};
if (typeof BiTreeView == "function") {
    _p = BiTreeView.prototype;
    _p.initAccessibility = function () {
        BiTreeViewBase.prototype.initAccessibility.call(this);
        this.addEventListener("create", this._addDataModelListeners, this);
        if (this._created) this._addDataModelListeners();
    };
    _p._addDataModelListeners = function () {
        var dataModel = this.getDataModel();
        if (dataModel) {
            dataModel.addEventListener("collapse", this._on508Toggle, this);
            dataModel.addEventListener("expand", this._on508Toggle, this);
        }
    };
    _p._removeDataModelListeners = function () {
        var dataModel = this.getDataModel();
        if (dataModel) {
            dataModel.removeEventListener("collapse", this._on508Toggle, this);
            dataModel.removeEventListener("expand", this._on508Toggle, this);
        }
    };
    _p._moveTitleLabel = function () {
        var am = application.getAccessibilityManager();
        if (!am._titleLbl) return;
        var leadItem = this.getSelectionModel().getLeadItem();
        if (!leadItem) return;
        var pos;
        if (this.getSelectionModel().getSelectionMode() == "row") pos = this.getViewManager().getRowBounds(leadItem.getRow());
        else pos = this.getViewManager().getCellBounds(leadItem.getColumn(), leadItem.getRow());
        am._titleLbl.setLocation(pos.left - this.getScrollLeft(), pos.top - this.getScrollTop());
    };
    _p._508setDataModel = _p.setDataModel;
    _p.setDataModel = function (dm) {
        this._removeDataModelListeners();
        this._508setDataModel(dm);
        this._addDataModelListeners();
    };
    _p._on508Toggle = function (e) {
        var leadItem = this.getSelectionModel().getLeadItem();
        if (leadItem && leadItem.getRow() == e.getRowIndex()) this._on508Change(e);
    };
    _p.getDescription = function () {
        var leadItem = this.getSelectionModel().getLeadItem();
        if (leadItem) this._lastDepth = this.getDataModel().getDepth(leadItem.getRow());
        else this._lastDepth = 0;
        return "tree view, " + this._getLeadItemDescription() + ", to move through or expand items use the arrow keys";
    };
    _p.getChangeDescription = function () {
        var description = "";
        var leadItem = this.getSelectionModel().getLeadItem();
        if (leadItem) {
            var depth = this.getDataModel().getDepth(leadItem.getRow());
            if (this._lastDepth != depth) {
                this._lastDepth = depth;
                description += "level " + (depth + 1) + ", ";
            }
        }
        description += this._getLeadItemDescription();
        return description;
    };
    _p._getLeadItemDescription = function () {
        var description = "";
        var leadItem = this.getSelectionModel().getLeadItem();
        if (leadItem) {
            var x = leadItem.getColumn();
            var y = leadItem.getRow();
            var dm = this.getDataModel();
            if (x == -1) {
                if (!dm.getRowSelected(y)) description += "not selected ";
            } else if (!dm.getCellSelected(x, y)) description += "not selected ";
            var vm = this.getViewManager();
            if (vm.getShowRowHeaders()) description += "row " + BiLabel.htmlToText(dm.getRowHeaderCellText(y)) + ", ";
            if (x == -1) {
                var order = vm.getColumnOrders();
                for (var i = 0; i < order.length; i++) {
                    if (vm.getColumnVisible(order[i])) {
                        description += BiLabel.htmlToText(dm.getHeaderCellText(order[i])) + " ";
                        description += BiLabel.htmlToText(dm.getCellText(order[i], y)) + ", ";
                    }
                }
            } else {
                description += BiLabel.htmlToText(dm.getHeaderCellText(x)) + " ";
                description += BiLabel.htmlToText(dm.getCellText(x, y)) + ", ";
            } if (dm.getHasChildren(y)) {
                if (dm.getExpanded(y)) description += "expanded, ";
                else description += "collapsed, ";
            }
            if (dm.getHasChildren(y) && dm.getExpanded(y)) {
                var items = this._getItems(y);
                description += items + " item" + (items == 1 ? "" : "s");
            } else {
                var before = this._getItemsBefore(y);
                var after = this._getItemsAfter(y);
                description += (before + 1) + " of " + (before + 1 + after);
            }
        }
        return description;
    };
    _p._getItemsBefore = function (y) {
        var dm = this.getDataModel();
        var currentDepth = dm.getDepth(y);
        var depth, items = 0;
        for (y = y - 1; y >= 0 && (depth = dm.getDepth(y)) >= currentDepth; y--) {
            if (depth == currentDepth) items++;
        }
        return items;
    };
    _p._getItemsAfter = function (y) {
        var dm = this.getDataModel();
        var rows = dm.getRowCount();
        var currentDepth = dm.getDepth(y);
        var depth, items = 0;
        for (y = y + 1; y < rows && (depth = dm.getDepth(y)) >= currentDepth; y++) {
            if (depth == currentDepth) items++;
        }
        return items;
    };
    _p._getItems = function (y) {
        var dm = this.getDataModel();
        var rows = dm.getRowCount();
        var currentDepth = dm.getDepth(y);
        var depth, items = 0;
        for (y = y + 1; y < rows && (depth = dm.getDepth(y)) > currentDepth; y++) {
            if (depth == currentDepth + 1) items++;
        }
        return items;
    };
    _p._on508AttachedComponentFocusIn = _p._onAttachedComponentFocusIn;
    _p._onAttachedComponentFocusIn = function (e) {
        this._ignoreFocus = true;
        if (e.getTarget() != application.getAccessibilityManager().getTitleLabel()) this._on508AttachedComponentFocusIn(e);
    };
};
if (typeof BiTreeViewBase == "function") {
    _p = BiTreeViewBase.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this.addEventListener("scroll", this._moveTitleLabel);
        this.addEventListener("dblclick", this._on508DblClick);
        this.addEventListener("create", this._addSelectionChangeListeners, this);
        if (this._created) this._addSelectionChangeListeners();
    };
    _p._start508Editing = _p._startEditing;
    _p._startEditing = function (oArea) {
        var c = this._start508Editing(oArea);
        if (c) c.articulateDescription();
    };
    _p._addSelectionChangeListeners = function () {
        var selectionModel = this.getSelectionModel();
        if (selectionModel) {
            selectionModel.addEventListener("change", this._on508Change, this);
            selectionModel.addEventListener("leaditemchange", this._on508Change, this);
        }
    };
    _p._removeSelectionChangeListeners = function () {
        var selectionModel = this.getSelectionModel();
        if (selectionModel) {
            selectionModel.removeEventListener("change", this._on508Change, this);
            selectionModel.removeEventListener("leaditemchange", this._on508Change, this);
        }
    };
    _p._set508SelectionModel = _p.setSelectionModel;
    _p.setSelectionModel = function (sm) {
        this._removeSelectionChangeListeners();
        this._set508SelectionModel(sm);
        this._addSelectionChangeListeners();
    };
    _p._on508MouseUp = function (e) {
        if (this._ignoreFocus) {
            var am = application.getAccessibilityManager();
            am.manageFocus(this, this);
            this._moveTitleLabel();
        }
        BiComponent.prototype._on508MouseUp.call(this, e);
    };
    _p._on508DblClick = function (e) {
        var cellInfo = this.getCellInfoFromMouseEvent(e);
        var x = cellInfo.getColumn();
        var y = cellInfo.getRow();
        var iem = this.getInlineEditModel();
        this._ignoreFocus = iem && iem.getCanEdit(x, y);
    };
    _p._on508Focus = function (e) {
        var iem = this.getInlineEditModel();
        if (iem && iem.getIsEditing()) return;
        var dm = this.getDataModel();
        if (dm && dm.getRowCount && dm.getRowCount() == 0) return;
        this._addFocusLabel();
        var am = application.getAccessibilityManager();
        if (am) am.setActiveComponent(this, this.getDescription(), true);
    };
    _p._on508EditComponentHide = _p._onEditComponentHide;
    _p._onEditComponentHide = function (e) {
        this._on508EditComponentHide(e);
        this._ignoreFocus = false;
        this.setFocused(true);
        this._addFocusLabel(true);
    };
    _p._addFocusLabel = function (bFlag) {
        if (this._ignoreFocus) return;
        var am = application.getAccessibilityManager();
        am.manageFocus(this, this, bFlag);
        this._moveTitleLabel();
    };
    _p._on508Change = function () {
        if (this.getInlineEditModel() && this.getInlineEditModel().getIsEditing()) return;
        if (!this._created || !this.getContainsFocus()) return;
        this._addFocusLabel();
        var am = application.getAccessibilityManager();
        am.setActiveComponent(this, this.getChangeDescription(), true);
    };
    _p._508dispose = _p.dispose;
    _p.dispose = function () {
        this._508dispose();
        this._removeSelectionChangeListeners();
    };
};
if (typeof BiUndeterminedProgressBar == "function") {
    _p = BiUndeterminedProgressBar.prototype;
    _p._ANIM_DELAY = 100;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
    };
    _p.getDescription = function () {
        var state = this.getStarted() ? "started" : "stopped";
        return "undetermined progress bar, " + state;
    };
    _p._508start = _p.start;
    _p._508stop = _p.stop;
    _p.stop = function () {
        this._508stop();
        if (this.getFocused()) application.getAccessibilityManager().speak("stopped", true);
    };
    _p.start = function () {
        this._508start();
        if (this.getFocused()) application.getAccessibilityManager().speak("started", true);
    };
};
if (typeof BiWindow == "function") {
    var _p = BiWindow.prototype;
    _p.getDescription = function () {
        return this.getCaption() + " window";
    };
    _p.setActive = function (b) {
        if (this._active != b) {
            this._active = b;
            this._chrome.setCssClassName("bi-window" + (b ? " active" : ""));
            if (b) {
                this.bringToFront();
                var ac = this.getActiveComponent();
                if (ac && ac.getCanFocus()) {
                    if (this instanceof BiDialog) {
                        application.getAccessibilityManager().setPreDescription(this.getDescription());
                        ac.setFocused(true);
                    } else {
                        ac.setFocused(true);
                    }
                } else {
                    this.setFocused(true);
                }
                this.dispatchEvent("activated");
            } else {
                this.setFocused(false);
                this.dispatchEvent("deactivated");
            }
        }
    };
};
if (typeof BiWizard == "function") {
    BiWizard.prototype.getDescription = function () {
        return this.getCaption() + " wizard";
    };
};
if (typeof BiAbstractGrid == "function") {
    _p = BiAbstractGrid.prototype;
    _p.initAccessibility = function () {
        BiComponent.prototype.initAccessibility.call(this);
        this.addEventListener("change", this._on508Change);
        this.addEventListener("scroll", this._moveTitleLabel);
        this.addEventListener("create", this._addSelectionChangeListener, this);
        if (this._created) this._addSelectionChangeListener();
    };
    _p._addSelectionChangeListener = function () {
        var selectionModel = this.getSelectionModel();
        if (selectionModel) selectionModel.addEventListener("leaditemchange", this._on508Change, this);
    };
    _p._removeSelectionChangeListener = function () {
        var selectionModel = this.getSelectionModel();
        if (selectionModel) selectionModel.removeEventListener("leaditemchange", this._on508Change, this);
    };
    _p._moveTitleLabel = function () {
        var am = application.getAccessibilityManager();
        if (!am._titleLbl) return;
        var leadItem = this.getSelectionModel().getLeadItem();
        if (leadItem != null) {
            var x = leadItem.getLeft ? leadItem.getLeft() - this.getScrollLeft() : this.getShowRowHeaders() ? this.getRowHeadersWidth() : 0;
            var y = leadItem.getTop() - this.getScrollTop();
        } else {
            x = this.getLeft();
            y = this.getTop();
        }
        am._titleLbl.setLocation(x, y);
    };
    _p._on508MouseUp = function (e) {
        if (this._ignoreFocus) {
            var am = application.getAccessibilityManager();
            am.manageFocus(this, this);
            this._moveTitleLabel();
        }
        BiComponent.prototype._on508MouseUp.call(this, e);
    };
    _p._addFocusLabel = function (sDescription) {
        if (this._ignoreFocus) return;
        var am = application.getAccessibilityManager();
        am.manageFocus(this, this);
        this._moveTitleLabel();
        am.setActiveComponent(this, sDescription, false);
    };
    _p._on508Focus = function (e) {
        this._element.title = this._className;
        BiTimer.callOnce(function () {
            this._addFocusLabel(this.getDescription());
        }, 1, this);
    };
    _p._on508Change = function () {
        if (!this._created || !this.getContainsFocus()) return;
        this._addFocusLabel(this.getChangeDescription());
    };
    _p._on508LeadItemChange = function () {
        if (!this._created || !this.getContainsFocus()) return;
        this._addFocusLabel(this.getChangeDescription());
    };
    _p._set508SelectionModel = BiAbstractGrid.prototype.setSelectionModel;
    _p.setSelectionModel = function (sm) {
        this._removeSelectionChangeListener();
        this._set508SelectionModel(sm);
        this._addSelectionChangeListener();
    };
    _p._508dispose = BiAbstractGrid.prototype.dispose;
    _p.dispose = function () {
        this._508dispose();
        this._removeSelectionChangeListener();
    };
};
if (typeof BiButton == "function") {
    BiButton.prototype.getDescription = function () {
        var description = "";
        if (this.getIcon()) description += ", " + this.getIcon().getDescription();
        if (this.getText() && this.getText().length > 0) description += ", " + this.getText();
        return description;
    };
};
if (typeof BiTextField == "function") {
    _p = BiTextField.prototype;
    _p.articulateDescription = function () {
        application.getAccessibilityManager().articulateDescription(this, true, true);
    };
    _p.getDescription = function () {
        var description = "text field ";
        var sText = this.getText();
        if (sText) {
            description += " current text, ";
            description += sText;
            if (this._created) {
                var selText = this.getSelectionText();
                if (selText.length && selText != sText) {
                    description += ", selected text, ";
                    description += selText;
                }
            }
        }
        return description;
    };
    _p.getChangeDescription = function () {
        return this.getDescription();
    };
};
if (typeof BiPasswordField == "function") {
    BiPasswordField.prototype.getDescription = function () {
        return "password field. ";
    };
};