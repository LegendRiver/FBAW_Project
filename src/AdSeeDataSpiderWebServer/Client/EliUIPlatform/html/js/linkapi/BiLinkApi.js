/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
if (typeof BiTextLoader == "function" && typeof BiBrowserCheck == "function") {
    var path = application.getPath() + (BiBrowserCheck.ie ? "js/linkapi/linkapi.ie.js" : "js/linkapi/linkapi.js");
    var code = BiTextLoader.load(path);
    if (code) {
        eval(code + "//@ sourceURL=" + path);
    }
} else throw new Error("BiTextLoader or BiBrowserCheck were not located!");