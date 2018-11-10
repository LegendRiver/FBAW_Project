/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function Eli(sName) {
    if (_biInPrototype)return;
    BiTheme.call(this, sName || "Eli");
    var base = String(new BiUri(application.getPath(), "themes/Eli/"));
    var imgBase = base + "images/";
    this.addAppearance("accordion-button", ["checked"]);
    this.addAppearance("button", ["hover", "active", "disabled", "focus"]);
    this.addAppearance("calendar", ["focus"]);
    this.addAppearance("combo-box", ["focus", "disabled"]);
    this.addAppearance("grid", ["focus"]);
    this.addAppearance("group-box", ["focus"]);
    this.addAppearance("iframe", ["focus"]);
    this.addAppearance("list", ["focus"]);
    this.addAppearance("olap-grid", ["focus"]);
    this.addAppearance("three-state-check-box", ["checked", "disabled", "undetermined"]);
    this.addAppearance("scroll-bar-block-button", ["active", "hover"]);
    this.addAppearance("scroll-bar-dec-button", ["active", "disabled"]);
    this.addAppearance("scroll-bar-inc-button", ["active", "disabled"]);
    this.addAppearance("scroll-bar-thumb", ["active"]);
    this.addAppearance("text-field", ["disabled", "focus"]);
    this.addAppearance("tool-bar-button", ["hover", "active", "checked", "focus"]);
    this.addAppearance("tree-view", ["focus"]);
    this.addAppearance("window-close-button", ["active", "disabled"]);
    this.addAppearance("window-maximize-button", ["active", "disabled"]);
    this.addAppearance("window-minimize-button", ["active", "disabled"]);
    this.addAppearance("window-restore-button", ["active", "disabled"]);
    this.setAppearanceProperty("color-picker", "brightness-handle-image", imgBase + "brightnesshandle.gif");
    this.setAppearanceProperty("color-picker", "hue-saturation-handle-image", imgBase + "huesaturationhandle.gif");
    this.setAppearanceProperty("grid", "ascending-icon", imgBase + "sortarrow-ascending.gif");
    this.setAppearanceProperty("grid", "blank-icon", imgBase + "blank.gif");
    this.setAppearanceProperty("grid", "default-icon", imgBase + "file.gif");
    this.setAppearanceProperty("grid", "descending-icon", imgBase + "sortarrow-descending.gif");
    this.setAppearanceProperty("grid", "i-icon", imgBase + "i.gif");
    this.setAppearanceProperty("grid", "l-icon", imgBase + "l.gif");
    this.setAppearanceProperty("grid", "l-minus-icon", imgBase + "l-minus.gif");
    this.setAppearanceProperty("grid", "l-plus-icon", imgBase + "l-plus.gif");
    this.setAppearanceProperty("grid", "minus-icon", imgBase + "minus.gif");
    this.setAppearanceProperty("grid", "plus-icon", imgBase + "plus.gif");
    this.setAppearanceProperty("grid", "rtl-i-icon", imgBase + "i-rtl.gif");
    this.setAppearanceProperty("grid", "rtl-l-icon", imgBase + "l-rtl.gif");
    this.setAppearanceProperty("grid", "rtl-l-minus-icon", imgBase + "l-minus-rtl.gif");
    this.setAppearanceProperty("grid", "rtl-l-plus-icon", imgBase + "l-plus-rtl.gif");
    this.setAppearanceProperty("grid", "rtl-minus-icon", imgBase + "minus-rtl.gif");
    this.setAppearanceProperty("grid", "rtl-plus-icon", imgBase + "plus-rtl.gif");
    this.setAppearanceProperty("grid", "rtl-t-icon", imgBase + "t-rtl.gif");
    this.setAppearanceProperty("grid", "rtl-t-minus-icon", imgBase + "t-minus-rtl.gif");
    this.setAppearanceProperty("grid", "rtl-t-plus-icon", imgBase + "t-plus-rtl.gif");
    this.setAppearanceProperty("grid", "t-icon", imgBase + "t.gif");
    this.setAppearanceProperty("grid", "t-minus-icon", imgBase + "t-minus.gif");
    this.setAppearanceProperty("grid", "t-plus-icon", imgBase + "t-plus.gif");
    this.setAppearanceProperty("group-box-header-left", "minimumHeight", 8);
    this.setAppearanceProperty("group-box-header-left", "minimumWidth", 8);
    this.setAppearanceProperty("group-box-header-left", "preferredHeight", 8);
    this.setAppearanceProperty("group-box-header-left", "preferredWidth", 8);
    this.setAppearanceProperty("group-box", "hide-focus", true);
    this.setAppearanceProperty("menu", "icon-hides-separator", true);
    this.setAppearanceProperty("option-pane", "error-image", imgBase + "stopmark.32.png");
    this.setAppearanceProperty("option-pane", "information-image", imgBase + "infomark.32.png");
    this.setAppearanceProperty("option-pane", "question-image", imgBase + "questionmark.32.png");
    this.setAppearanceProperty("option-pane", "warning-image", imgBase + "exclamation.32.png");
    this.setAppearanceProperty("split-pane-horizontal-divider", "preferredWidth", 7);
    this.setAppearanceProperty("split-pane-vertical-divider", "preferredHeight", 7);
    this.setAppearanceProperty("tab-bar", "scroll-left-icon", imgBase + "previous.gif");
    this.setAppearanceProperty("tab-bar", "scroll-right-icon", imgBase + "next.gif");
    this.setAppearanceProperty("tab-button", "hide-focus", true);
    this.setAppearanceProperty("tree-view", "ascending-icon", imgBase + "sortarrow-ascending.gif");
    this.setAppearanceProperty("tree-view", "blank-icon", imgBase + "blank.gif");
    this.setAppearanceProperty("tree-view", "descending-icon", imgBase + "sortarrow-descending.gif");
    this.setAppearanceProperty("tree-view", "file-icon", imgBase + "file.gif");
    this.setAppearanceProperty("tree-view", "folder-icon", imgBase + "folder.gif");
    this.setAppearanceProperty("tree-view", "minus-icon", imgBase + "tree-view-minus.gif");
    this.setAppearanceProperty("tree-view", "open-folder-icon", imgBase + "openfolder.gif");
    this.setAppearanceProperty("tree-view", "plus-icon", imgBase + "tree-view-plus.gif");
    this.setAppearanceProperty("window-manager", "cascade-icon", imgBase + "cascade.16.gif");
    this.setAppearanceProperty("window-manager", "close-all-icon", imgBase + "blank.gif");
    this.setAppearanceProperty("window-manager", "tile-horizontally-icon", imgBase + "tilehorizontally.16.gif");
    this.setAppearanceProperty("window-manager", "tile-vertically-icon", imgBase + "tilevertically.16.gif");
    this.setAppearanceProperty("window", "default-icon", imgBase + "window.png");
    this.setAppearanceProperty("wizard-pane", "backdrop-image", imgBase + "wizardbackdrop.gif");
    this.setAppearanceProperty("bi-collapsible-panel-caption", "minimumSize", 22);
    this.setAppearanceProperty("bi-collapsible-panel-caption", "labelSpacing", 10);
};
_p = _biExtend(Eli, BiTheme, "Eli");
_p._themeTypes = {};
_p._themeTypes[BiTheme.KEYS.window] = {sizes: {l: 15, r: 15, t: 100, b: 20}};
_p._themeTypes[BiTheme.KEYS.popupBackground] = {sizes: {l: 6, r: 6, t: 10, b: 10}};
_p._themeTypes[BiTheme.KEYS.groupBoxTitleBackground] = _p._themeTypes[BiTheme.KEYS.groupBoxBackground] = {
    sizes: {
        l: 6,
        r: 6,
        t: 10,
        b: 10
    }
};
_p._themeTypes[BiTheme.KEYS.toolBarButton] = _p._themeTypes[BiTheme.KEYS.button] = {sizes: {l: 4, r: 4, t: 11, b: 11}};
_p._themeTypes[BiTheme.KEYS.tabButton] = {sizes: {l: 5, r: 5, t: 11, b: 11}};
_p._themeTypes[BiTheme.KEYS.scrollbarDecButton] = _p._themeTypes[BiTheme.KEYS.scrollbarIncButton] = _p._themeTypes[BiTheme.KEYS.tabScrollButton] = _p._themeTypes[BiTheme.KEYS.spinnerButton] = _p._themeTypes[BiTheme.KEYS.comboBoxButton] = {
    sizes: {
        l: 6,
        r: 6,
        t: 5,
        b: 5
    }
};
_p._windowLayoutGeometry = {
    showChrome: {cp_top: 29, cp_left: 5, cp_right: 5, cp_bottom: 5, mb_left: 6, mb_right: 6},
    hideChrome: {cp_left: 5, cp_right: 5, cp_top: 5, cp_bottom: 5, mb_left: 6, mb_right: 6},
    maximized: {left: -4, right: -4, top: -6, bottom: -4}
};
_p.themeComponent = function (oComponent) {
    var c = oComponent;
    var tt = this._themeTypes[c._themeKey];
    if (c instanceof BiButton && tt) {
        c.setBackgroundFiller(new BiImageBorderFiller(tt.sizes));
        c.__hideFocus = c.getHideFocus();
        c.setHideFocus(true);
    }
    else if (c instanceof BiWindow) {
        c._chrome.setBackgroundFiller(new BiImageBorderFiller(tt.sizes));
        c._windowCaption.setLocation(3, 2);
        c._windowCaption.setRight(3);
        c._windowCaption.setHeight(27);
        c._layoutGeometry = this._windowLayoutGeometry;
        c._setContentPaneSize();
        c._setState();
        c._minimizeButton.setSize(18, 15);
        c._maximizeButton.setSize(18, 15);
        c._closeButton.setSize(18, 15);
    }
    else if (tt) {
        c.setBackgroundFiller(new BiImageBorderFiller(tt.sizes));
    }
    else if (c instanceof BiRichEdit) {
        c.setBackColor("white");
    }
};
_p.unthemeComponent = function (oComponent) {
    var c = oComponent;
    var tt = this._themeTypes[c._themeKey];
    if (c instanceof BiButton && tt) {
        c.setBackgroundFiller(null);
        c.setHideFocus(c.__hideFocus);
        delete c.__hideFocus;
    }
    else if (c instanceof BiWindow) {
        c._chrome.setBackgroundFiller(null);
        c._windowCaption.setLocation(2, 2);
        c._windowCaption.setRight(2);
        c._windowCaption.setHeight(19);
        delete c._layoutGeometry;
        c._setContentPaneSize();
        c._setState();
        c._minimizeButton.setSize(16, 14);
        c._maximizeButton.setSize(16, 14);
        c._closeButton.setSize(16, 14);
    }
    else if (tt) {
        c.setBackgroundFiller(null);
    }
};
application.getThemeManager().addTheme(new Eli);
if (BiBrowserCheck.ie && (BiBrowserCheck.versionNumber >= 8)) {
    application.getThemeManager().addCssRule("* html .bi-tree-view-table td .icon", "top: 1px;");
}
;
