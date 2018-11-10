/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiDateFormatSymbols(sLanguage) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._language = sLanguage || BiDateFormatSymbols._bundle.getLanguage();
}
_p = _biExtend(BiDateFormatSymbols, BiObject, "BiDateFormatSymbols");
BiDateFormatSymbols._bundle = new BiStringBundle;
BiDateFormatSymbols.addBundle = function (sLanguage, oStringMap) {
    BiDateFormatSymbols._bundle.addBundle(sLanguage, oStringMap);
};
BiDateFormatSymbols.getStringBundle = function () {
    return BiDateFormatSymbols._bundle;
};
_p._getString = function (s) {
    return BiDateFormatSymbols.getStringBundle().getString(s, this._language);
};
BiDateFormatSymbols.addProperty("amPmStrings", BiAccessType.WRITE);
_p.getAmPmStrings = function () {
    if (this._amPmStrings) return this._amPmStrings;
    return this._amPmStrings = [this._getString("am"), this._getString("pm")];
};
BiDateFormatSymbols.addProperty("eras", BiAccessType.WRITE);
_p.getEras = function () {
    if (this._eras) return this._eras;
    return this._eras = [this._getString("bc"), this._getString("ad")];
};
BiDateFormatSymbols.addProperty("localePatternChars", BiAccessType.WRITE);
_p.getLocalePatternChars = function () {
    if (this._localePatternChars) return this._localePatternChars;
    return this._localePatternChars = this._getString("localePatternChars");
};
BiDateFormatSymbols.addProperty("months", BiAccessType.WRITE);
_p.getMonths = function () {
    if (this._months) return this._months;
    return this._months = [this._getString("JanuaryLong"), this._getString("FebruaryLong"), this._getString("MarchLong"), this._getString("AprilLong"), this._getString("MayLong"), this._getString("JuneLong"), this._getString("JulyLong"), this._getString("AugustLong"), this._getString("SeptemberLong"), this._getString("OctoberLong"), this._getString("NovemberLong"), this._getString("DecemberLong")];
};
BiDateFormatSymbols.addProperty("shortMonths", BiAccessType.WRITE);
_p.getShortMonths = function () {
    if (this._shortMonths) return this._shortMonths;
    return this._shortMonths = [this._getString("Jan"), this._getString("Feb"), this._getString("Mar"), this._getString("Apr"), this._getString("May"), this._getString("Jun"), this._getString("Jul"), this._getString("Aug"), this._getString("Sep"), this._getString("Oct"), this._getString("Nov"), this._getString("Dec")];
};
BiDateFormatSymbols.addProperty("weekdays", BiAccessType.WRITE);
_p.getWeekdays = function () {
    if (this._weekdays) return this._weekdays;
    return this._weekdays = [this._getString("Sunday"), this._getString("Monday"), this._getString("Tuesday"), this._getString("Wednesday"), this._getString("Thursday"), this._getString("Friday"), this._getString("Saturday")];
};
BiDateFormatSymbols.addProperty("shortWeekdays", BiAccessType.WRITE);
_p.getShortWeekdays = function () {
    if (this._shortWeekdays) return this._shortWeekdays;
    return this._shortWeekdays = [this._getString("Sun"), this._getString("Mon"), this._getString("Tue"), this._getString("Wed"), this._getString("Thu"), this._getString("Fri"), this._getString("Sat")];
};
_p._getLongAndShortWeekdays = function () {
    if (this._longAndShortWeekdays) return this._longAndShortWeekdays;
    return this._longAndShortWeekdays = this.getWeekdays().concat(this.getShortWeekdays());
};
BiDateFormatSymbols.addProperty("shortWeekdays", BiAccessType.WRITE);
_p.getShortWeekdays = function () {
    if (this._shortWeekdays) return this._shortWeekdays;
    return this._shortWeekdays = [this._getString("Sun"), this._getString("Mon"), this._getString("Tue"), this._getString("Wed"), this._getString("Thu"), this._getString("Fri"), this._getString("Sat")];
};
BiDateFormatSymbols.addProperty("datePatterns", BiAccessType.WRITE);
_p.getDatePatterns = function () {
    if (this._datePatterns) return this._datePatterns;
    return this._datePatterns = [this._getString("shortDatePattern"), this._getString("mediumDatePattern"), this._getString("longDatePattern")];
};
BiDateFormatSymbols.addProperty("timePatterns", BiAccessType.WRITE);
_p.getTimePatterns = function () {
    if (this._timePatterns) return this._timePatterns;
    return this._timePatterns = [this._getString("shortTimePattern"), this._getString("mediumTimePattern"), this._getString("longTimePattern")];
};
BiDateFormatSymbols.addProperty("dateTimePatterns", BiAccessType.WRITE);
_p.getDateTimePatterns = function () {
    if (this._dateTimePatterns) return this._dateTimePatterns;
    return this._dateTimePatterns = [this._getString("shortDateTimePattern"), this._getString("mediumDateTimePattern"), this._getString("longDateTimePattern")];
};
BiDateFormatSymbols.addProperty("firstWeekday", BiAccessType.WRITE);
_p.getFirstWeekday = function () {
    if (this._firstWeekday != null) return this._firstWeekday;
    var n = Number(this._getString("firstWeekday"));
    if (isNaN(n)) n = 1;
    return this._firstWeekday = n;
};
_p.setRedWeekdays = function (a) {
    this._redWeekdays = a;
    this._redWeekdaysMap = null;
};
_p.getRedWeekdays = function () {
    if (this._redWeekdays != null) return this._redWeekdays;
    var parts = this._getString("redWeekdays").split(",");
    var res = new Array(parts.length);
    for (var i = 0; i < parts.length; i++) res[i] = Number(parts[i]);
    return this._redWeekdays = res;
};
_p.getIsRedWeekday = function (n) {
    if (this._redWeekdaysMap == null) {
        this._redWeekdaysMap = {};
        var rwd = this.getRedWeekdays();
        for (var i = 0; i < rwd.length; i++) this._redWeekdaysMap[rwd[i]] = true;
    }
    return n in this._redWeekdaysMap;
};
BiDateFormatSymbols.addProperty("rightToLeft", BiAccessType.WRITE);
_p.getRightToLeft = function () {
    if (this._rightToLeft != null) return this._rightToLeft;
    var rtl = this._getString("rightToLeft") == "true";
    return this._rightToLeft = rtl;
};

function BiDateFormat(sPattern, sLanguage) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._dateFormatSymbols = new BiDateFormatSymbols(sLanguage);
    if (sPattern) this.setPattern(sPattern);
    else {
        this._pattern = "";
        this._tokens = [];
    }
}
_p = _biExtend(BiDateFormat, BiObject, "BiDateFormat");
BiDateFormat.SHORT = "short";
BiDateFormat.MEDIUM = "medium";
BiDateFormat.LONG = "long";
BiDateFormat.getDateInstance = function (sType, sLanguage) {
    var res = new BiDateFormat("", sLanguage);
    var patterns = res.getDateFormatSymbols().getDatePatterns();
    switch (sType) {
    case BiDateFormat.SHORT:
        res.setPattern(patterns[0]);
        break;
    case BiDateFormat.MEDIUM:
        res.setPattern(patterns[1]);
        break;
    case BiDateFormat.LONG:
        res.setPattern(patterns[2]);
        break;
    default:
        throw new Error("BiDateFormat: Invalid argument");
    }
    return res;
};
BiDateFormat.getDateTimeInstance = function (sType, sLanguage) {
    var res = new BiDateFormat("", sLanguage);
    var patterns = res.getDateFormatSymbols().getDateTimePatterns();
    switch (sType) {
    case BiDateFormat.SHORT:
        res.setPattern(patterns[0]);
        break;
    case BiDateFormat.MEDIUM:
        res.setPattern(patterns[1]);
        break;
    case BiDateFormat.LONG:
        res.setPattern(patterns[2]);
        break;
    default:
        throw new Error("BiDateFormat: Invalid argument");
    }
    return res;
};
BiDateFormat.getTimeInstance = function (sType, sLanguage) {
    var res = new BiDateFormat("", sLanguage);
    var patterns = res.getDateFormatSymbols().getTimePatterns();
    switch (sType) {
    case BiDateFormat.SHORT:
        res.setPattern(patterns[0]);
        break;
    case BiDateFormat.MEDIUM:
        res.setPattern(patterns[1]);
        break;
    case BiDateFormat.LONG:
        res.setPattern(patterns[2]);
        break;
    default:
        throw new Error("BiDateFormat: Invalid argument");
    }
    return res;
};
_p.format = function (oDate) {
    var tokens = this._tokens;
    var sb = [];
    for (var i = 0; i < tokens.length; i++) sb.push(this._format(oDate, tokens[i]));
    return sb.join("");
};
BiDateFormat.addProperty("dateFormatSymbols", BiAccessType.READ_WRITE);
BiDateFormat._pattern = "GyMdkHmsSEDFwWahKzZ";
BiDateFormat.addProperty("pattern", BiAccessType.READ);
_p.setPattern = function (s) {
    try {
        this._tokens = this._tokenize(s);
        this._pattern = s;
    } catch (ex) {
        this._tokens = [];
        this._pattern = "";
        throw ex;
    }
};
_p.setLocalizedPattern = function (s) {
    var lc = this._dateFormatSymbols.getLocalPatternChars();
    s = BiDateFormatSymbols._replaceChars(s, lc, BiDateFormat._pattern);
    this.setPattern(s);
};
_p.getLocalizedPattern = function () {
    var lc = this._dateFormatSymbols.getLocalePatternChars();
    return BiDateFormat._replaceChars(this._pattern, BiDateFormat._pattern, lc);
};
_p._lenient = true;
BiDateFormat.addProperty("lenient", BiAccessType.READ_WRITE);
BiDateFormat.Tokens = {
    Era: "G",
    Year: "y",
    MonthInYear: "M",
    WeekInYear: "w",
    WeekInMonth: "W",
    DayInYear: "D",
    DayInMonth: "d",
    DayOfWeekInMonth: "F",
    DayInWeek: "E",
    AmPm: "a",
    HourInDay: "H",
    HourInDay2: "k",
    HourInAmPm: "K",
    HourInAmPm2: "h",
    Minute: "m",
    Second: "s",
    Millisecond: "S",
    TimeZone: "z",
    TimeZone2: "Z"
};
BiDateFormat.TokenTypes = {
    String: 1,
    QuotedString: 2,
    Apos: 3
};
BiDateFormat._reverseTokens = {};
(function () {
    var i = 4;
    for (var name in BiDateFormat.Tokens) {
        BiDateFormat.TokenTypes[name] = i;
        BiDateFormat._reverseTokens[BiDateFormat.Tokens[name]] = i++;
    }
})();
_p._tokenize = function (sPattern) {
    var tokens = [];
    var inApos = false;
    var c, accumString = "";
    var i = 0;
    while (i < sPattern.length) {
        c = sPattern.charAt(i++);
        if (inApos) {
            if (c == "'") {
                if (accumString == "") tokens.push({
                    type: BiDateFormat.TokenTypes.Apos,
                    string: "'"
                });
                tokens.push({
                    type: BiDateFormat.TokenTypes.QuotedString,
                    string: accumString
                });
                inApos = false;
            } else accumString += c;
        } else {
            if (c == "'") {
                inApos = true;
                accumString = "";
            } else {
                switch (c) {
                case "G":
                case "y":
                case "M":
                case "d":
                case "F":
                case "E":
                case "a":
                case "H":
                case "k":
                case "K":
                case "h":
                case "m":
                case "s":
                case "S":
                case "Z":
                case "w":
                case "W":
                case "D":
                case "z":
                    i = this._addToken(tokens, i - 1, sPattern);
                    break;
                default:
                    var cc = c.charCodeAt(0);
                    if (cc >= 65 && cc <= 90 || cc >= 97 && cc <= 122) throw new Error("BiDateFormat: Invalid letter, '" + c + "' in pattern");
                    tokens.push({
                        type: BiDateFormat.TokenTypes.String,
                        string: c
                    });
                }
            }
        }
    }
    return tokens;
};
_p._addToken = function (oTokens, i, sPattern) {
    var c = sPattern.charAt(i++);
    var token = {
        type: BiDateFormat._reverseTokens[c]
    };
    var s = c;
    var l = sPattern.length;
    while (i < l && sPattern.charAt(i) == c) {
        s += c;
        i++;
    }
    token.string = s;
    oTokens.push(token);
    return i;
};
_p._format = function (d, tok) {
    var l, h;
    switch (tok.type) {
    case BiDateFormat.TokenTypes.String:
    case BiDateFormat.TokenTypes.Apos:
    case BiDateFormat.TokenTypes.QuotedString:
        return tok.string;
    case BiDateFormat.TokenTypes.Era:
        if (d.getFullYear() < 0) return this._dateFormatSymbols.getEras()[0];
        return this._dateFormatSymbols.getEras()[1];
    case BiDateFormat.TokenTypes.Year:
        return this._formatNumber(d.getFullYear(), tok, true);
    case BiDateFormat.TokenTypes.MonthInYear:
        var m = d.getMonth();
        l = tok.string.length;
        if (l >= 4) return this._dateFormatSymbols.getMonths()[m];
        if (l == 3) return this._dateFormatSymbols.getShortMonths()[m];
        return this._formatNumber(m + 1, tok);
    case BiDateFormat.TokenTypes.DayInMonth:
        return this._formatNumber(d.getDate(), tok);
    case BiDateFormat.TokenTypes.DayOfWeekInMonth:
        return this._formatNumber(d.getDay(), tok);
    case BiDateFormat.TokenTypes.DayInWeek:
        var day = d.getDay();
        l = tok.string.length;
        if (l >= 4) return this._dateFormatSymbols.getWeekdays()[day];
        return this._dateFormatSymbols.getShortWeekdays()[day];
    case BiDateFormat.TokenTypes.AmPm:
        h = d.getHours();
        return this._dateFormatSymbols.getAmPmStrings()[h < 12 ? 0 : 1];
    case BiDateFormat.TokenTypes.HourInDay:
        return this._formatNumber(d.getHours(), tok);
    case BiDateFormat.TokenTypes.HourInDay2:
        h = d.getHours();
        if (h == 0) h = 24;
        return this._formatNumber(h, tok);
    case BiDateFormat.TokenTypes.HourInAmPm:
        return this._formatNumber(d.getHours() % 12, tok);
    case BiDateFormat.TokenTypes.HourInAmPm2:
        h = d.getHours() % 12;
        if (h == 0) h = 12;
        return this._formatNumber(h, tok);
    case BiDateFormat.TokenTypes.Minute:
        return this._formatNumber(d.getMinutes(), tok);
    case BiDateFormat.TokenTypes.Second:
        return this._formatNumber(d.getSeconds(), tok);
    case BiDateFormat.TokenTypes.Millisecond:
        return this._formatNumber(d.getMilliseconds(), tok);
    case BiDateFormat.TokenTypes.TimeZone:
        l = tok.string.length;
        if (l >= 4) throw new Error("Not supported");
        else return "GMT" + this._formatTimeZone(d);
    case BiDateFormat.TokenTypes.TimeZone2:
        return this._formatTimeZone(d);
    case BiDateFormat.TokenTypes.WeekInYear:
    case BiDateFormat.TokenTypes.WeekInMonth:
    case BiDateFormat.TokenTypes.DayInYear:
        throw new Error("Not supported");
    }
};
_p._formatNumber = function (n, tok, bTruncate) {
    var l = tok.string.length;
    var s;
    var bSign = false;
    if (n < 0) {
        bSign = true;
        n = -n;
    }
    if (bTruncate) s = String(n % Math.pow(10, l));
    else s = String(n);
    while (s.length < l) s = "0" + s;
    if (bSign) s = "-" + s;
    return s;
};
_p._formatTimeZone = function (d) {
    var offset = d.getTimezoneOffset();
    var neg = offset < 0;
    offset = Math.abs(offset);
    var hours = Math.floor(offset / 60);
    var mins = offset % 60;
    return (neg ? "+" : "-") + (hours < 10 ? "0" : "") + hours + (mins < 10 ? "0" : "") + mins;
};
_p.parse = function (sDate, basicDaysInMonthValidation) {
    var d;
    sDate = String(sDate);
    try {
        var tokens = this._tokens;
        d = new Date(2000, 0, 1, 12, 0, 0, 0);
        if (basicDaysInMonthValidation) {
            var dateAux = new Date(2000, 0, 1, 12, 0, 0, 0);
            var j = 0;
            for (var ti = 0; ti < tokens.length; ti++) {
                j = this._parse(sDate, j, tokens[ti], dateAux, BiDateFormat._isNumberToken(tokens[ti + 1]), true, false);
            }
            d.setMonth(dateAux.getMonth());
            d.setYear(dateAux.getFullYear() ? dateAux.getFullYear() : dateAux.getYear());
        }
        var i = 0;
        for (var ti = 0; ti < tokens.length; ti++) {
            i = this._parse(sDate, i, tokens[ti], d, BiDateFormat._isNumberToken(tokens[ti + 1]), false, basicDaysInMonthValidation);
        }
        if (i != sDate.length) throw new Error("Failed to parse date string, " + sDate.substr(i));
        if (ti != tokens.length) throw new Error("Failed to parse date string The string is too short");
        if (isNaN(d.getTime())) throw new Error("Failed to parse date string the date is invalid");
        return d;
    } catch (ex) {
        if (this._lenient) {
            d = Date.parse(sDate);
            if (isNaN(d) || basicDaysInMonthValidation) throw ex;
            return new Date(d);
        }
        throw ex;
    }
};
_p._parse = function (sDate, i, tok, d, bUseMaxLength, isAux, throwErrors) {
    var l, n;
    switch (tok.type) {
    case BiDateFormat.TokenTypes.String:
    case BiDateFormat.TokenTypes.QuotedString:
        l = tok.string.length;
        if (tok.string == sDate.substr(i, l)) return i + l;
        throw new Error("Expected '" + tok.string + "', found " + sDate.substr(i));
    case BiDateFormat.TokenTypes.Apos:
        if (sDate.charAt(i) == "'") return i + 1;
        throw new Error("Expected a ', found " + sDate.substr(i));
    case BiDateFormat.TokenTypes.Era:
        var eras = this._dateFormatSymbols.getEras();
        var bcString = eras[0];
        var adString = eras[1];
        if (sDate.substr(i, bcString.length) == bcString) {
            if (!isAux) d.setFullYear(-d.getFullYear());
            return i + bcString.length;
        }
        if (sDate.substr(i, adString.length) == adString) return i + bcString.length;
        throw new Error("Expected '" + bcString + "' or '" + adString + "', found " + sDate.substr(i));
    case BiDateFormat.TokenTypes.Year:
        l = tok.string.length;
        if (l <= 2) {
            n = {};
            i = BiDateFormat._parseNumber(sDate, i, bUseMaxLength ? l : Infinity, n);
            d.setYear(n.value);
        } else {
            n = {};
            i = BiDateFormat._parseNumber(sDate, i, bUseMaxLength ? l : Infinity, n);
            d.setFullYear(n.value);
        }
        return i;
    case BiDateFormat.TokenTypes.MonthInYear:
        l = tok.string.length;
        if (l <= 2) {
            n = {};
            i = BiDateFormat._parseNumber(sDate, i, bUseMaxLength ? l : Infinity, n);
            if (throwErrors && n.value != null && (n.value > 12 || n.value < 1)) {
                throw new Error("Unexpected Date");
            }
            d.setMonth(throwErrors ? n.value - 1 : d.getMonth() + n.value - 1);
            return i;
        }
        n = {};
        var months = this._dateFormatSymbols.getMonths();
        i = BiDateFormat._parseKeyword(sDate, i, months, n);
        if (throwErrors && n.value != null && (n.value > 12 || n.value < 1)) {
            throw new Error("Unexpected Date");
        }
        d.setMonth(throwErrors ? n.value : d.getMonth() + n.value);
        return i;
        months = this._dateFormatSymbols.getShortMonths();
        i = BiDateFormat._parseKeyword(sDate, i, months, n);
        if (throwErrors && n.value != null && (n.value > 12 || n.value < 1)) {
            throw new Error("Unexpected Date");
        }
        d.setMonth(throwErrors ? n.value : d.getMonth() + n.value);
        return i;
        throw new Error("Expected a month string, found " + sDate.substr(i));
    case BiDateFormat.TokenTypes.DayInMonth:
        l = tok.string.length;
        n = {};
        i = BiDateFormat._parseNumber(sDate, i, bUseMaxLength ? l : Infinity, n);
        var currentDate = new Date();
        if (throwErrors) {
            var daysInMonth = new Date(d.getFullYear() ? d.getFullYear() : currentDate.getFullYear(), (d.getMonth() != null && typeof d.getMonth() !== 'undefined') ? d.getMonth() + 1 : currentDate.getMonth() + 1, 0).getDate();
            if (n.value < 1 || n.value > daysInMonth) {
                throw new Error("Unexpected Date");
            }
        }
        if (!isAux) d.setDate(n.value);
        return i;
    case BiDateFormat.TokenTypes.DayOfWeekInMonth:
        l = tok.string.length;
        n = {};
        i = BiDateFormat._parseNumber(sDate, i, bUseMaxLength ? l : Infinity, n);
        d.setDate(d.getDate() - d.getDay() + n.value);
        return i;
    case BiDateFormat.TokenTypes.DayInWeek:
        n = {};
        var days = this._dateFormatSymbols._getLongAndShortWeekdays();
        i = BiDateFormat._parseKeyword(sDate, i, days, n);
        if (n.value != null) return i;
        throw new Error("Expected a weekday string, found " + sDate.substr(i));
    case BiDateFormat.TokenTypes.AmPm:
        n = {};
        var amPmStrings = this._dateFormatSymbols.getAmPmStrings();
        i = BiDateFormat._parseKeyword(sDate, i, amPmStrings, n);
        if (n.value != null) {
            if (!isAux) {
                if (n.value == 1 && d.getHours() < 12) d.setHours(d.getHours() + 12);
                else if (n.value == 0 && d.getHours() >= 12) d.setHours(d.getHours() - 12);
            }
            return i;
        }
        throw new Error("Expected an am or pm string, found " + sDate.substr(i));
    case BiDateFormat.TokenTypes.HourInDay:
    case BiDateFormat.TokenTypes.HourInDay2:
        l = tok.string.length;
        n = {};
        i = BiDateFormat._parseNumber(sDate, i, bUseMaxLength ? l : Infinity, n);
        if (!isAux) d.setHours(n.value);
        return i;
    case BiDateFormat.TokenTypes.HourInAmPm:
    case BiDateFormat.TokenTypes.HourInAmPm2:
        l = tok.string.length;
        n = {};
        i = BiDateFormat._parseNumber(sDate, i, bUseMaxLength ? l : Infinity, n);
        if (!isAux) {
            if (n.value == 12 && d.getHours() < 12) d.setHours(0);
            else {
                if (d.getHours() >= 12 && n.value < 12) d.setHours(n.value + 12);
                else d.setHours(n.value);
            }
        }
        return i;
    case BiDateFormat.TokenTypes.Minute:
        l = tok.string.length;
        n = {};
        i = BiDateFormat._parseNumber(sDate, i, bUseMaxLength ? l : Infinity, n);
        if (!isAux) d.setMinutes(n.value);
        return i;
    case BiDateFormat.TokenTypes.Second:
        l = tok.string.length;
        n = {};
        i = BiDateFormat._parseNumber(sDate, i, bUseMaxLength ? l : Infinity, n);
        if (!isAux) d.setSeconds(n.value);
        return i;
    case BiDateFormat.TokenTypes.Millisecond:
        l = tok.string.length;
        n = {};
        i = BiDateFormat._parseNumber(sDate, i, bUseMaxLength ? l : Infinity, n);
        if (!isAux) d.setMilliseconds(n.value);
        return i;
    case BiDateFormat.TokenTypes.TimeZone:
        if (sDate.substr(i, 3).toUpperCase() == "GMT") i += 3;
        var mins = {};
        i = BiDateFormat._parseTimezone(sDate, i, mins);
        if (!isAux) d.setMinutes(d.getMinutes() - d.getTimezoneOffset() + mins.value);
        return i;
    case BiDateFormat.TokenTypes.TimeZone2:
        mins = {};
        i = BiDateFormat._parseTimezone(sDate, i, mins);
        if (!isAux) d.setMinutes(d.getMinutes() - d.getTimezoneOffset() + mins.value);
        return i;
    case BiDateFormat.TokenTypes.WeekInYear:
    case BiDateFormat.TokenTypes.WeekInMonth:
    case BiDateFormat.TokenTypes.DayInYear:
        throw new Error("Not supported");
    }
};
BiDateFormat._isDigit = function (s, i) {
    var cc = s.charCodeAt(i);
    return cc >= 48 && cc <= 57;
};
BiDateFormat._parseNumber = function (s, i, maxLength, numberOut) {
    var out = "";
    var c = s.charAt(i);
    if (BiDateFormat._isDigit(s, i)) {
        out += c;
        i++;
        maxLength--;
    } else if (c == "+" || c == "-") {
        out += c;
        i++;
    } else throw new Error("Expected a number, found '" + s.substr(i) + "'");
    while (maxLength > 0 && i < s.length) {
        if (BiDateFormat._isDigit(s, i)) {
            out += s.charAt(i);
            i++;
            maxLength--;
        } else break;
    }
    var n = Number(out);
    if (isNaN(n)) throw new Error("Expected a number, found '" + out + "'");
    numberOut.value = n;
    return i;
};
BiDateFormat._parseKeyword = function (s, i, words, outValue) {
    var longest = -1;
    for (var j = 0; j < words.length; j++) {
        if (s.substr(i, words[j].length).toLowerCase() == words[j].toLowerCase() && words[j].length > longest) {
            outValue.value = j;
            longest = words[j].length;
        }
    }
    if (longest > -1) return i + words[outValue.value].length;
    else return i;
};
BiDateFormat._parseTimezone = function (s, i, outMins) {
    if (/^([-+])(\d?\d):?(\d\d)?/.test(s.substr(i))) {
        var offset = Number(RegExp.$3) + 60 * Number(RegExp.$2);
        if (RegExp.$1 == "+") offset = -offset;
        outMins.value = offset;
        return i + RegExp.lastMatch.length;
    }
    throw new Error("Expected an RFC 822 time zone, found " + s.substr(i));
};
BiDateFormat._isNumberToken = function (tok) {
    if (!tok) return false;
    switch (tok.type) {
    case BiDateFormat.TokenTypes.Year:
    case BiDateFormat.TokenTypes.MonthInYear:
    case BiDateFormat.TokenTypes.DayInMonth:
    case BiDateFormat.TokenTypes.DayOfWeekInMonth:
    case BiDateFormat.TokenTypes.HourInDay:
    case BiDateFormat.TokenTypes.HourInDay2:
    case BiDateFormat.TokenTypes.HourInAmPm:
    case BiDateFormat.TokenTypes.HourInAmPm2:
    case BiDateFormat.TokenTypes.Minute:
    case BiDateFormat.TokenTypes.Second:
    case BiDateFormat.TokenTypes.Millisecond:
    case BiDateFormat.TokenTypes.WeekInYear:
    case BiDateFormat.TokenTypes.WeekInMonth:
    case BiDateFormat.TokenTypes.DayInYear:
        return true;
    default:
        return false;
    }
};
BiDateFormat._replaceChars = function (s, p1, p2) {
    var inApos = false;
    var c, index;
    var i = 0;
    var sb = [];
    while (i < s.length) {
        c = s.charAt(i);
        if (inApos) {
            sb.push(c);
            if (c == "'") inApos = false;
        } else {
            if (c == "'") {
                sb.push(c);
                if (s.charAt(i + 1) == "'") {
                    sb.push("'");
                    i++;
                } else inApos = true;
            } else {
                index = p1.indexOf(c);
                if (index >= 0) sb.push(p1.charAt(index));
                else sb.push(c);
            }
        }
        i++;
    }
    return sb.join("");
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this._dateFormatSymbols.dispose();
    this._dateFormatSymbols = null;
};

function BiCalendar(oDate) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setTabIndex(1);
    this.setHideFocus(true);
    this.setAppearance("calendar");
    this._selectionModel = new BiCalendarSelectionModel(this);
    this._dateFormatSymbols = new BiDateFormatSymbols;
    this.setRightToLeft(this._dateFormatSymbols.getRightToLeft());
    this.setSize(this.getPreferredWidth(), this.getPreferredHeight());
    this._caption = new BiComponent;
    this._caption.setAppearance("calendar-caption");
    this._caption.setLocation(0, 0);
    this._caption.setHeight(23);
    this._caption.setRight(0);
    this.add(this._caption);
    this._previousYearButton = new BiButton;
    this._previousMonthButton = new BiButton;
    this._monthLabel = new BiLabel;
    this._nextMonthButton = new BiButton;
    this._nextYearButton = new BiButton;
    this._previousYearButton._themeKey = BiTheme.KEYS.calendarButton;
    this._previousMonthButton._themeKey = BiTheme.KEYS.calendarButton;
    this._nextMonthButton._themeKey = BiTheme.KEYS.calendarButton;
    this._nextYearButton._themeKey = BiTheme.KEYS.calendarButton;
    this._previousYearButton.setAppearance("calendar-previous-year-button");
    this._previousMonthButton.setAppearance("calendar-previous-month-button");
    this._nextMonthButton.setAppearance("calendar-next-month-button");
    this._nextYearButton.setAppearance("calendar-next-year-button");
    this._previousYearButton.setPadding(0);
    this._previousMonthButton.setPadding(0);
    this._nextMonthButton.setPadding(0);
    this._nextYearButton.setPadding(0);
    this._previousYearButton.setTabIndex(-1);
    this._previousMonthButton.setTabIndex(-1);
    this._nextMonthButton.setTabIndex(-1);
    this._nextYearButton.setTabIndex(-1);
    var bw = 18,
        bh = 18;
    this._previousYearButton.setSize(bw, bh);
    this._previousMonthButton.setSize(bw, bh);
    this._nextMonthButton.setSize(bw, bh);
    this._nextYearButton.setSize(bw, bh);
    this._monthLabel.setAlign("center");
    this._monthLabel.setStyleProperty("lineHeight", "22px");
    var f2 = new BiFont;
    f2.setBold(true);
    this._monthLabel.setFont(f2);
    this._previousYearButton.setTop(2);
    this._previousMonthButton.setTop(2);
    this._monthLabel.setTop(0);
    this._nextMonthButton.setTop(2);
    this._nextYearButton.setTop(2);
    this._layoutCaption();
    this._caption.add(this._previousYearButton);
    this._caption.add(this._previousMonthButton);
    this._caption.add(this._monthLabel);
    this._caption.add(this._nextMonthButton);
    this._caption.add(this._nextYearButton);
    this._createDayLabels();
    this._createDayBlocks();
    this._headerLine = new BiComponent;
    this._headerLine.setAppearance("calendar-header-line");
    this._headerLine.setLeft(2);
    this._headerLine.setRight(2);
    this.add(this._headerLine);
    this._writeWeekdayLabels();
    this._currentDate = null;
    this.setCurrentDate(oDate || new Date);
    this.addEventListener("mousedown", this._onMouseEvent);
    this.addEventListener("mouseup", this._onMouseEvent);
    this.addEventListener("click", this._onMouseEvent);
    this.addEventListener("dblclick", this._onMouseEvent);
    this.addEventListener("keydown", this._onKeyDown);
    this.addEventListener("mousewheel", this._onMouseWheel);
    this._previousYearButton.addEventListener("action", this.previousYear, this);
    this._previousMonthButton.addEventListener("action", this.previousMonth, this);
    this._nextMonthButton.addEventListener("action", this.nextMonth, this);
    this._nextYearButton.addEventListener("action", this.nextYear, this);
    this._selectionModel.addEventListener("change", this._onSelectionChange, this);
    this._caption.addEventListener("contextmenu", function (e) {
        this._caption.setContextMenu(this._getMonthsMenu());
    }, this);
}
_p = _biExtend(BiCalendar, BiComponent, "BiCalendar");
_p.setAttribute = function (sName, sValue, oParser) {
    var v, vv;
    if (sValue == BiString.BOOLEAN_TRUE) v = true;
    else if (sValue == BiString.BOOLEAN_FALSE) v = false;
    else if ((vv = parseFloat(sValue)) == sValue) v = vv;
    else if (sValue.startsWith("new Date")) v = eval(sValue);
    else v = sValue;
    this.setProperty(sName, v);
};
_p.getMaximum = function () {
    return this._selectionModel.getMaximum();
};
_p.setMaximum = function (d) {
    return this._selectionModel.setMaximum(d);
};
_p.getMinimum = function () {
    return this._selectionModel.getMinimum();
};
_p.setMinimum = function (d) {
    return this._selectionModel.setMinimum(d);
};
BiCalendar._unifyDate = function (d) {
    d.setHours(12);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
};
BiCalendar.isSameDay = function (d1, d2) {
    return d1 != null && d2 != null && d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate();
};
BiCalendar.isSameMonth = function (d1, d2) {
    return d1 != null && d2 != null && d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth();
};
_p._showYearButtons = true;
BiCalendar.addProperty("showYearButtons", BiAccessType.READ);
_p.setShowYearButtons = function (b) {
    if (this._showYearButtons != b) {
        this._showYearButtons = b;
        this._layoutCaption();
    }
};
_p._showMonthButtons = true;
BiCalendar.addProperty("showMonthButtons", BiAccessType.READ);
_p.setShowMonthButtons = function (b) {
    if (this._showMonthButtons != b) {
        this._showMonthButtons = b;
        this._layoutCaption();
    }
};
_p._showCaption = true;
BiCalendar.addProperty("showCaption", BiAccessType.READ);
_p.setShowCaption = function (b) {
    if (this._showCaption != b) {
        this._showCaption = b;
        this._layoutCaption();
        this.layoutAllChildren();
    }
};
_p._scaleFonts = false;
BiCalendar.addProperty("scaleFonts", BiAccessType.READ);
_p.setScaleFonts = function (b) {
    if (this._scaleFonts != b) {
        this._scaleFonts = b;
        this.layoutAllChildren();
    }
};
_p.getPreferredWidth = function () {
    if (this._preferredWidth != null) return this._preferredWidth;
    return 260;
};
_p.getPreferredHeight = function () {
    if (this._preferredHeight != null)
    {
        return this._preferredHeight;
    }
    return this._showCaption ? 143 : 120;
};
_p.setCurrentDate = function (d) {
    var nd = new Date(+d);
    nd.setDate(1);
    BiCalendar._unifyDate(nd);
    if (this._currentDate == null || !BiCalendar.isSameMonth(nd, this._currentDate)) {
        this._currentDate = nd;
        this._writeCaptionText();
        this._writeDayBlocks();
    } else this._currentDate = nd;
};
_p.getCurrentDate = function () {
    return new Date(+this._currentDate);
};
_p.previousYear = function () {
    var d = this.getSelectedDate() || this._currentDate;
    this.goToYear(d.getFullYear() - 1);
};
_p.previousMonth = function () {
    var d = this.getSelectedDate() || this._currentDate;
    this.goToMonth(d.getMonth() - 1);
};
_p.nextYear = function () {
    var d = this.getSelectedDate() || this._currentDate;
    this.goToYear(d.getFullYear() + 1);
};
_p.nextMonth = function () {
    var d = this.getSelectedDate() || this._currentDate;
    this.goToMonth(d.getMonth() + 1);
};
_p.goToYear = function (nFullYear) {
    var d = this.getSelectedDate() || this._currentDate;
    var nd = new Date(+d);
    nd.setFullYear(nFullYear);
    if (nd.getMonth() != d.getMonth()) nd.setDate(0);
    this.setSelectedDate(nd);
};
_p.goToMonth = function (nMonth) {
    var d = this.getSelectedDate() || this._currentDate;
    var nd = new Date(+d);
    nd.setMonth(nMonth);
    if (nd.getMonth() != (nMonth + 12) % 12) nd.setDate(0);
    this.setSelectedDate(nd);
};
_p.goToToday = function () {
    var d = new Date;
    BiCalendar._unifyDate(d);
    this.setSelectedDate(d);
};
_p._createDayBlocks = function () {
    this._days = new Array(6);
    var l;
    for (var y = 0; y < 6; y++) {
        this._days[y] = new Array(7);
        for (var x = 0; x < 7; x++) {
            l = this._days[y][x] = new BiLabel;
            l.setAppearance("calendar-day");
            this.add(l);
        }
    }
};
_p._createDayLabels = function () {
    this._dayLabels = new Array(7);
    var l;
    for (var x = 0; x < 7; x++) {
        l = this._dayLabels[x] = new BiLabel;
        l.setAppearance("calendar-day-label");
        this.add(l);
    }
};
_p._getWeekdayName = function (nIndex) {
    return this._dateFormatSymbols.getShortWeekdays()[nIndex];
};
_p._getFirstWeekday = function () {
    return this._dateFormatSymbols.getFirstWeekday();
};
_p._getIsRedWeekday = function (n) {
    return this._dateFormatSymbols.getIsRedWeekday(n);
};
_p._getMonths = function (nIndex) {
    return this._dateFormatSymbols.getMonths()[nIndex];
};
BiCalendar.addProperty("dateFormatSymbols", BiAccessType.READ);
_p.setDateFormatSymbols = function (oSymbols) {
    if (this._dateFormatSymbols != oSymbols) {
        this._dateFormatSymbols = oSymbols;
        this.setRightToLeft(this._dateFormatSymbols.getRightToLeft());
        this._writeCaptionText();
        this._writeWeekdayLabels();
        this._writeDayBlocks();
        this.layoutAllChildren();
        if (BiBrowserCheck.webkit && this._parent && this._parent._parent instanceof BiDatePicker) {
            delete this._parent._parent._layoutOnce;
        }
        if (this._monthsMenu) {
            this._monthsMenu.dispose();
            this._monthsMenu = null;
        }
    }
};
_p.getCaptionText = function () {
    var d = this._currentDate;
    if (this.getDateFormatSymbols()._language == 'ja') return d.getFullYear() + this.getDateFormatSymbols()._getString("yearSuffix") + this._getMonths(d.getMonth());
    else return this._getMonths(d.getMonth()) + " " + d.getFullYear();
};
_p.getSelectedDate = function () {
    return this._selectionModel.getSelectedItems()[0];
};
_p.setSelectedDate = function (d) {
    if (d != null) {
        this._selectionModel.setSelectedItems(d != null ? [d] : []);
        this.setCurrentDate(d);
        this._selectionModel.setLeadItem(d);
    } else this._selectionModel.setSelectedItems([]);
};
_p.getSelectedDates = function () {
    return this._selectionModel.getSelectedItems();
};
_p.setSelectedDates = function (ds) {
    this._selectionModel.setSelectedItems(ds);
    if (ds.length > 0) {
        this.setCurrentDate(ds[ds.length - 1]);
        this._selectionModel.setLeadItem(ds[ds.lnegth - 1]);
    }
};
BiCalendar.addProperty("selectionModel", BiAccessType.READ);
_p.getContextMenu = function () {
    return this._getGoToTodayMenu();
};
_p._writeWeekdayLabels = function () {
    var fwd = this._getFirstWeekday();
    for (var x = 0; x < 7; x++) {
        this._dayLabels[x].setText(this._getWeekdayName((x + fwd) % 7));
    }
};
_p._writeDayBlocks = function () {
    var currentDate = this._currentDate;
    var d = new Date(+currentDate);
    BiCalendar._unifyDate(d);
    d.setDate(d.getDate() - (currentDate.getDay() - this._getFirstWeekday()));
    if (d > currentDate) d.setDate(d.getDate() - 7);
    var date, l;
    this._dateToLabel = {};
    for (var y = 0; y < 6; y++) {
        for (var x = 0; x < 7; x++) {
            date = d.getDate();
            l = this._days[y][x];
            l._date = new Date(+d);
            this._dateToLabel[String(l._date.valueOf())] = l;
            this.updateDateLabel(d, l);
            d.setDate(date + 1);
        }
    }
};
_p.updateDateLabel = function (oDate, oLabel) {
    oLabel.setText(oDate.getDate());
    this._updateLabelAppearance(oDate, oLabel);
};
_p._writeCaptionText = function () {
    this._monthLabel.setText(this.getCaptionText());
};
_p._getGoToTodayMenu = function () {
    if (this._goToTodayMenu) return this._goToTodayMenu;
    var m = new BiMenu;
    var mi = new BiMenuItem("Go to today");
    mi.addEventListener("action", this.goToToday, this);
    m.add(mi);
    return this._goToTodayMenu = m;
};
_p._getMonthsMenu = function () {
    if (this._monthsMenu) return this._monthsMenu;
    var m = new BiMenu;
    var mi;
    for (var i = 0; i < 12; i++) {
        mi = new BiMenuItem(this._getMonths(i));
        mi.addEventListener("action", (function (ii) {
            return function (e) {
                this.goToMonth(ii);
            };
        })(i), this);
        m.add(mi);
    }
    return this._monthsMenu = m;
};
_p._doLayout = function () {
    if (!this.getCreated()) return;
    var cw = Math.max(0, this.getClientWidth() - 4);
    var ch = this.getClientHeight();
    var w = cw / 7;
    var rtl = this._dateFormatSymbols.getRightToLeft();
    var top = this._showCaption ? 25 : 2;
    var availHeight = Math.max(0, ch - top - 4);
    var h = availHeight / 7;
    var changed, l;
    if (this._scaleFonts) {
        var fontMargin = (BiBrowserCheck.ie) ? 5 : 0;
        var fontSize = h > fontMargin ? h - fontMargin : h;
    }
    for (var x = 0; x < 7; x++) {
        l = this._dayLabels[x];
        if (rtl) {
            this._layoutChild2(l, cw - w - w * x + 2, top, w, h);
        } else {
            this._layoutChild2(l, w * x + 2, top, w, h);
        }
        this._dayLabels[x].setStyleProperty("lineHeight", h + "px");
        if (this._scaleFonts) {
            this._dayLabels[x].setStyleProperty("fontSize", fontSize + "px");
        } else this._dayLabels[x].removeStyleProperty("fontSize"); if (changed) l.invalidateLayout();
    }
    for (var y = 0; y < 6; y++) {
        for (x = 0; x < 7; x++) {
            l = this._days[y][x];
            if (rtl) {
                changed = this._layoutChild2(l, cw - w - w * x + 2, top + 2 + (y + 1) * h, w, h);
            } else {
                changed = this._layoutChild2(l, w * x + 2, top + 2 + (y + 1) * h, w, h);
            }
            this._days[y][x].setStyleProperty("lineHeight", h + "px");
            if (this._scaleFonts) {
                this._days[y][x].setStyleProperty("fontSize", fontSize + "px");
            } else this._days[y][x].removeStyleProperty("fontSize"); if (changed) l.invalidateLayout();
        }
    }
    this._headerLine.setTop(top + h);
};
_p._layoutCaption = function () {
    this._caption.setVisible(this._showCaption);
    if (!this._showCaption) return;
    var x = 2;
    this._previousYearButton.setVisible(this._showYearButtons);
    this._nextYearButton.setVisible(this._showYearButtons);
    if (this._showYearButtons) {
        this._previousYearButton.setLeft(x);
        this._nextYearButton.setRight(x);
        x += this._previousYearButton.getWidth() + 2;
    }
    this._previousMonthButton.setVisible(this._showMonthButtons);
    this._nextMonthButton.setVisible(this._showMonthButtons);
    if (this._showMonthButtons) {
        this._previousMonthButton.setLeft(x);
        this._nextMonthButton.setRight(x);
        x += this._previousMonthButton.getWidth() + 2;
    }
    this._monthLabel.setLeft(x);
    this._monthLabel.setRight(x);
};
_p.layoutAllChildren = function () {
    this._doLayout();
    BiComponent.prototype.layoutAllChildren.call(this);
};
_p._onMouseEvent = function (e) {
    var t = e.getTarget();
    while (t.getAppearance() != "calendar-day" && t != this) {
        t = t.getParent();
    }
    if (t.getAppearance() == "calendar-day" && t.getEnabled()) {
        var d = this._selectionModel._getValidDate(t._date);
        if (d != null) {
            switch (e.getType()) {
            case "mousedown":
                if (e.getButton() == BiMouseEvent.LEFT) this._selectionModel.handleMouseDown(d, e);
                break;
            case "mouseup":
                if (e.getButton() == BiMouseEvent.LEFT) this._selectionModel.handleMouseUp(d, e);
                break;
            case "click":
                this._selectionModel.handleClick(d, e);
                this.dispatchEvent("action");
                break;
            case "dblclick":
                this._selectionModel.handleDblClick(d, e);
                break;
            }
        }
    }
};
_p._onKeyDown = function (e) {
    this._selectionModel.handleKeyDown(e);
    if (this.getSelectedDate() && e.matchesBundleShortcut("controls.accept")) {
        this.dispatchEvent("action");
    }
};
_p._onSelectionChange = function (e) {
    var d = this.getSelectedDate();
    if (d && d.getMonth() != this._currentDate.getMonth()) this.setCurrentDate(d);
    this.dispatchEvent("change");
};
_p._onMouseWheel = function (e) {
    var d = this.getSelectedDate() || this._currentDate;
    this.goToMonth(d.getMonth() - e.getWheelDelta() / 3);
};
_p._updateItemSelectionState = function (d, b) {
    var nd = new Date(d);
    BiCalendar._unifyDate(nd);
    var l = this._dateToLabel[String(nd.valueOf())];
    if (l) {
        var tm = application.getThemeManager();
        tm.setStateValue(l, "selected", b);
        tm.applyAppearance(l);
    }
};
_p._updateLabelAppearance = function (d, l) {
    var tm = application.getThemeManager();
    var today = new Date;
    tm.setStateValue(l, "selected", this._selectionModel.getItemSelected(d));
    tm.setStateValue(l, "red", this._getIsRedWeekday(d.getDay()));
    tm.setStateValue(l, "other-month", !BiCalendar.isSameMonth(d, this._currentDate));
    tm.setStateValue(l, "today", BiCalendar.isSameDay(d, today));
    tm.applyAppearance(l);
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiComponent.prototype.dispose.call(this);
    if (this._goToTodayMenu) {
        this._goToTodayMenu.dispose();
        this._goToTodayMenu = null;
    }
    if (this._monthsMenu) {
        this._monthsMenu.dispose();
        this._monthsMenu = null;
    }
    if (this._selectionModel) this._selectionModel.dispose();
};

function BiCalendarSelectionModel(oOwner) {
    if (_biInPrototype) return;
    BiSelectionModel.call(this, oOwner);
    this._selectedItems.getItemHashCode = BiCalendarSelectionModel._getItemHashCode;
}
_p = _biExtend(BiCalendarSelectionModel, BiSelectionModel, "BiCalendarSelectionModel");
_p._multipleSelection = false;
BiCalendarSelectionModel.addProperty("minimum", BiAccessType.READ_WRITE);
_p.setMinimum = function (d) {
    if (this._maximum < d) throw new Error("Minimum must be less than maximum.");
    this._minimum = d;
};
BiCalendarSelectionModel.addProperty("maximum", BiAccessType.READ_WRITE);
_p.setMaximum = function (d) {
    if (this._minimum > d) throw new Error("Minimum must be less than maximum.");
    this._maximum = d;
};
_p._getValidDate = function (d) {
    if (this._minimum && d.getTime() < this._minimum.getTime()) return new Date(+this._minimum);
    else if (this._maximum && d.getTime() > this._maximum.getTime()) return new Date(+this._maximum);
    else return d;
};
_p.setSelectedItems = function (oDates) {
    for (var i = 0; i < oDates.length; i++) oDates[i] = this._getValidDate(oDates[i]);
    BiSelectionModel.prototype.setSelectedItems.call(this, oDates);
};
_p.getFirst = function () {
    var current = this._leadItem || new Date;
    current = new Date(+current);
    BiCalendar._unifyDate(current);
    current.setDate(1);
    return current;
};
_p.getLast = function () {
    var current = this._leadItem || new Date;
    current = new Date(+current);
    BiCalendar._unifyDate(current);
    current.setDate(1);
    current.setMonth(current.getMonth() + 1);
    current.setDate(0);
    return current;
};
_p.getItems = function () {
    var current = this._leadItem || new Date;
    current = new Date(+current);
    BiCalendar._unifyDate(current);
    current.setDate(1);
    var currentMonth = current.getMonth();
    var res = [];
    while (current.getMonth() == currentMonth) {
        res.push(new Date(+current));
        current.setDate(current.getDate() + 1);
    }
    return res;
};
_p.getNext = function (oDate) {
    var nd = new Date(+oDate);
    nd.setDate(oDate.getDate() + 1);
    return nd;
};
_p.getPrevious = function (oDate) {
    var nd = new Date(+oDate);
    nd.setDate(oDate.getDate() - 1);
    return nd;
};
_p.isBefore = function (d1, d2) {
    return d1.getTime() < d2.getTime();
};
_p.isEqual = function (d1, d2) {
    return BiCalendar.isSameDay(d1, d2);
};
BiCalendarSelectionModel._getItemHashCode = function (d) {
    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
};
_p.scrollItemIntoView = function (d) {
    this._owner.setCurrentDate(d);
};
_p.getItemLeft = _p.getItemTop = _p.getItemWidth = _p.getItemHeight = function () {
    return 0;
};
_p.getHome = function (d) {
    if (!d) return this.getFirst();
    var nd = new Date(+d);
    nd.setDate(1);
    return this._getValidDate(nd);
};
_p.getCtrlHome = function (d) {
    if (!d) return this.getFirst();
    var nd = new Date(+d);
    nd.setDate(1);
    nd.setMonth(0);
    return nd;
};
_p.getEnd = function (d) {
    if (!d) return this.getLast();
    var nd = new Date(+d);
    nd.setDate(1);
    nd.setMonth(nd.getMonth() + 1);
    nd.setDate(0);
    return this._getValidDate(nd);
};
_p.getCtrlEnd = function (d) {
    if (!d) return this.getLast();
    var nd = new Date(+d);
    nd.setFullYear(nd.getFullYear() + 1);
    nd.setMonth(0);
    nd.setDate(0);
    return this._getValidDate(nd);
};
_p.getDown = function (d) {
    if (!d) return this.getFirst();
    var nd = new Date(+d);
    nd.setDate(nd.getDate() + 7);
    return this._getValidDate(nd);
};
_p.getUp = function (d) {
    if (!d) return this.getLast();
    var nd = new Date(+d);
    nd.setDate(nd.getDate() - 7);
    return this._getValidDate(nd);
};
_p.getLeft = function (d) {
    var nd;
    if (this._owner.getRightToLeft()) {
        if (!d) return this.getFirst();
        nd = new Date(+d);
        nd.setDate(nd.getDate() + 1);
        return this._getValidDate(nd);
    } else {
        if (!d) return this.getLast();
        nd = new Date(+d);
        nd.setDate(nd.getDate() - 1);
        return this._getValidDate(nd);
    }
};
_p.getRight = function (d) {
    var nd;
    if (this._owner.getRightToLeft()) {
        if (!d) return this.getLast();
        nd = new Date(+d);
        nd.setDate(nd.getDate() - 1);
        return this._getValidDate(nd);
    } else {
        if (!d) return this.getFirst();
        nd = new Date(+d);
        nd.setDate(nd.getDate() + 1);
        return this._getValidDate(nd);
    }
};
_p.getPageUp = function (d) {
    if (!d) return this.getLast();
    var nd = new Date(+d);
    nd.setMonth(nd.getMonth() - 1);
    if (d.getMonth() == nd.getMonth()) nd.setDate(0);
    return this._getValidDate(nd);
};
_p.getPageDown = function (d) {
    if (!d) return this.getFirst();
    var nd = new Date(+d);
    nd.setMonth(nd.getMonth() + 1);
    if (nd.getMonth() - d.getMonth() > 1) nd.setDate(0);
    return this._getValidDate(nd);
};
_p.updateItemSelectionState = function (oItem, bSelected) {
    this._owner._updateItemSelectionState(oItem, bSelected);
};

function BiDatePicker(oDate) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-combo-box");
    this.setAppearance("combo-box");
    this.setSize(130, 22);
    this.setHideFocus(true);
    this._popup = new BiPopup;
    this._popup._lazyCreate = true;
    this._popup.positionRelativeToComponent(this, "vertical");
    this._popup.isPopupAncestorOf = function (oPopup) {
        return oPopup;
    };
    this._calendar = new BiCalendar(oDate);
    this._calendar.goToToday = this._goToToday;
    this._calendar.setTabIndex(-1);
    this._calendar.setLocation(0, 0);
    application.getThemeManager().addState(this._calendar, "focus");
    this._button = new BiButton;
    this._button.setTabIndex(-1);
    this._button.setWidth(16);
    this._button.setTop(0);
    this._button.setBottom(0);
    this._button._themeKey = BiTheme.KEYS.comboBoxButton;
    var arrowImg = new BiComponent;
    arrowImg.setAppearance("combo-box-arrow");
    this._button.add(arrowImg);
    this._textField = new BiTextField;
    this._textField.setTop(1);
    this._textField.setBottom(1);
    this._textField.setTabIndex(0);
    this._positionComponents();
    this.add(this._popup, null, true);
    this._popup.add(this._calendar);
    this.add(this._button, null, true);
    this.add(this._textField, null, true);
    this.setTabIndex(1);
    this.setDateFormat(BiDateFormat.getDateInstance(BiDateFormat.LONG));
    this._calendar.addEventListener("action", this._onCalendarAction, this);
    this._calendar.addEventListener("change", this._onCalendarChange, this);
    this.addEventListener("mousedown", this._onMouseDown, this);
    this._popup.addEventListener("hide", this._onPopupHide, this);
    this._popup.addEventListener("show", this._onPopupShow, this);
    this.addEventListener("keydown", this._onKeyDown, this);
    this._textField.addEventListener("textchanged", this._onTextChanged, this);
    this.addEventListener("blur", this._onBlur, this);
    this._popup.setPreferredWidth(this._calendar.getPreferredWidth());
    this._popup.setPreferredHeight(this._calendar.getPreferredHeight());
}
_p = _biExtend(BiDatePicker, BiComponent, "BiDatePicker");
_p._acceptsEnter = true;
_p._acceptsEsc = true;
_p._invalidMessage = "";
_p._validator = null;
_p._preferredWidth = 130;
_p._preferredHeight = 22;
_p._basicDaysInMonthValidation = false;

_p._showCurrentDateOnPopupShow = false;
_p.getMaximum = function () {
    return this._calendar.getMaximum();
};
_p.setMaximum = function (d) {
    return this._calendar.setMaximum(d);
};
_p.getMinimum = function () {
    return this._calendar.getMinimum();
};
_p.setMinimum = function (d) {
    return this._calendar.setMinimum(d);
};
BiDatePicker.addProperty("popup", BiAccessType.READ);
BiDatePicker.addProperty("textField", BiAccessType.READ);
BiDatePicker.addProperty("button", BiAccessType.READ);
BiDatePicker.addProperty("basicDaysInMonthValidation", BiAccessType.READ_WRITE);
BiDatePicker.addProperty("showCurrentDateOnPopupShow", BiAccessType.READ_WRITE);
_p._getFocusElement = function () {
    return this._textField._element;
};
_p.setSelectedDate = function (oDate) {
    this._calendar.setSelectedDate(oDate);
};
_p.getSelectedDate = function () {
    return this._calendar.getSelectedDate();
};
_p.setDateFormat = function (oDateFormat) {
    if (this._dateFormat != oDateFormat) {
        this._dateFormat = oDateFormat;
        this._calendar.setDateFormatSymbols(oDateFormat.getDateFormatSymbols());
        this._updateText();
    }
};
BiDatePicker.addProperty("dateFormat", BiAccessType.READ);
_p.setEnabled = function (b) {
    this._textField.setEnabled(b);
    this._button.setEnabled(b);
    BiComponent.prototype.setEnabled.call(this, b);
};
_p.setRightToLeft = function (b) {
    BiComponent.prototype.setRightToLeft.call(this, b);
    this._popup.setRightToLeft(b);
    this._positionComponents();
};
_p._positionComponents = function () {
    if (this.getRightToLeft()) {
        this._button.setRight(null);
        this._button.setLeft(0);
        this._textField.setLeft(17);
        this._textField.setRight(1);
    } else {
        this._button.setLeft(null);
        this._button.setRight(0);
        this._textField.setLeft(1);
        this._textField.setRight(17);
    }
};
_p._updateText = function () {
    var d = this.getSelectedDate();
    if (d) {
        this._textField.setText(this._dateFormat.format(d));
    } else this._textField.setText("");
};
_p._parseText = function () {
    var s = this._textField.getText();
    if (!s) {
        this._calendar.setSelectedDate(null);
        return;
    }
    try {
        var d = this._dateFormat.parse(s, this._basicDaysInMonthValidation);
        this._calendar.setSelectedDate(d);
    } catch (ex) {
        if (this._basicDaysInMonthValidation) BiDialog.createMessageDialog(this._invalidMessage ? this._invalidMessage : 'date input error', '', 'error').setVisible(true);
    }
};
_p.setDropDownVisible = function (b) {
    this._popup.setVisible(b);
};
_p.getDropDownVisible = function () {
    return this._popup.getIsVisible();
};
_p.getText = function () {
    return this._textField.getText();
};
_p.setText = function (s) {
    this._textField.setText(s);
};
BiDatePicker.addProperty("validator", BiAccessType.READ_WRITE);
BiDatePicker.addProperty("invalidMessage", BiAccessType.READ_WRITE);
_p.getIsValid = function () {
    if (typeof this._validator != "function") return true;
    return this._validator(this.getText());
};
BiDatePicker.createRegExpValidator = function (oRegExp) {
    return function (s) {
        return oRegExp.test(s);
    };
};
_p._selectOnTabFocus = function () {
    this._textField.selectAll();
};
_p._onMouseDown = function (e) {
    if (e.getButton() != BiMouseEvent.LEFT) return;
    if (this._button.contains(e.getTarget()) && !this._popup.contains(e.getTarget())) {
        var show = !this._popup.getIsVisible() && (new Date - this._popup.getHideTimeStamp() > 100);
        if (this.getCanFocus()) {
            this._textField.setFocused(true);
        }
        this._popup.setVisible(show);
    } else if (this._popup.contains(e.getTarget())) {
        this._textField.setFocused(true);
    }
};
_p._onPopupHide = function (e) {
    this.dispatchEvent("hide");
};
_p._onPopupShow = function (e) {
    if (!this._layoutOnce) {
        this._calendar.layoutAllChildren();
        this._layoutOnce = true;
    }
    this._calendar.setCssClassName("bi-calendar focused");
    this._parseText();
    this._startDate = this.getSelectedDate();
    if (this._showCurrentDateOnPopupShow && !this.getSelectedDate()) {
        this._calendar.setCurrentDate(new Date());
    }
    this.dispatchEvent("show");
};
_p._onKeyDown = function (e) {
    if (e.matchesBundleShortcut("popup.close") && this._popup.getIsVisible()) {
        this._popup.setVisible(false);
        e.preventDefault();
        this.setSelectedDate(this._startDate);
        this._startDate = null;
    } else if (e.matchesBundleShortcut("popup.toggle")) {
        this._popup.setVisible(!this._popup.getIsVisible());
    } else if (this._popup.getIsVisible()) {
        if (e.getTarget() == this || e.getTarget() == this._textField) this._calendar._selectionModel.handleKeyDown(e);
        if (e.matchesBundleShortcut("controls.accept") && this.getSelectedDate()) {
            this._popup.setVisible(false);
            this.dispatchEvent("action");
        }
    } else if (e.matchesBundleShortcut("selection.down") || e.matchesBundleShortcut("selection.up")) this._popup.setVisible(true);
    else if (e.matchesBundleShortcut("controls.accept")) this.dispatchEvent("action");
};
_p._onTextChanged = function (e) {
    this.dispatchEvent("textchanged");
};
_p._onCalendarAction = function (e) {
    this._popup.setVisible(false);
    this._updateText();
    this.dispatchEvent("action");
};
_p._onCalendarChange = function (e) {
    this._updateText();
    this.dispatchEvent("change");
};
_p._onBlur = function (e) {
    this._parseText();
    this._updateText();
};
_p._goToToday = function () {
    BiCalendar.prototype.goToToday.call(this);
    this.getParent()._popup.setVisible(false);
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiComponent.prototype.dispose.call(this);
    if (this._calendar) this._calendar.dispose();
    if (this._popup) this._popup.dispose();
    if (this._button) this._button.dispose();
    this._list = null;
    this._popup = null;
    this._button = null;
};

function BiTimePicker(oDate) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setCssClassName("bi-spinner");
    this.setAppearance("combo-box");
    this.setHideFocus(true);
    this.setSize(140, 22);
    this._date = oDate || new Date;
    this._textFields = [];
    this._fields = [];
    this._upButton = new BiRepeatButton;
    this._upButton._themeKey = BiTheme.KEYS.spinnerButton;
    if (BiBrowserCheck.moz) this._upButton._tagName = "DIV";
    this._upButton.setCssClassName("bi-button bi-spinner-up-button");
    this._upButton.setTabIndex(-1);
    var arrowImg = new BiComponent;
    arrowImg.setAppearance("spinner-up-arrow");
    this._upButton.add(arrowImg, null, true);
    this.add(this._upButton, null, true);
    this._downButton = new BiRepeatButton;
    this._downButton._themeKey = BiTheme.KEYS.spinnerButton;
    if (BiBrowserCheck.moz) this._downButton._tagName = "DIV";
    this._downButton.setCssClassName("bi-button bi-spinner-down-button");
    this._downButton.setTabIndex(-1);
    arrowImg = new BiComponent;
    arrowImg.setAppearance("spinner-down-arrow");
    this._downButton.add(arrowImg, null, true);
    this.add(this._downButton, null, true);
    this._upButton.setWidth(16);
    this._upButton.setTop(0);
    this._downButton.setWidth(16);
    this._downButton.setBottom(0);
    this._positionComponents();
    this.setTabIndex(1);
    this._upButton.addEventListener("action", this._increase, this);
    this._downButton.addEventListener("action", this._decrease, this);
    this.setDateFormat(BiDateFormat.getTimeInstance(BiDateFormat.MEDIUM));
    this.addEventListener("keydown", this._onFieldKeyDown);
    this.addEventListener("blur", this._onBlur);
}
_p = _biExtend(BiTimePicker, BiComponent, "BiTimePicker");
_p._preferredHeight = 22;
_p._preferredWidth = 130;
BiTimePicker.addProperty("minimum", BiAccessType.READ_WRITE);
_p.setMinimum = function (d) {
    if (this._maximum < d) throw new Error("Minimum must be less than maximum.");
    if (d && this._date < d) {
        this.setDate(d);
    }
    this._minimum = d;
};
BiTimePicker.addProperty("maximum", BiAccessType.READ_WRITE);
_p.setMaximum = function (d) {
    if (this._maximum < d) throw new Error("Minimum must be less than maximum.");
    if (d && this._date > d) {
        this.setDate(d);
    }
    this._maximum = d;
};
BiTimePicker.addProperty("date", BiAccessType.READ);
_p.setDate = function (d) {
    if (this._date.valueOf() != d.valueOf()) {
        this._date = new Date(d);
        this._updateTextFields();
        this._dispatchChange();
    }
};
BiTimePicker.addProperty("dateFormat", BiAccessType.READ);
_p.setDateFormat = function (oDateFormat) {
    if (this._dateFormat != oDateFormat) {
        this._destroyFields();
        this._dateFormat = oDateFormat;
        this._createFields();
        this._updateTextFields();
        if (this.getCreated()) this._layoutFields();
    }
};
_p._positionComponents = function () {
    if (this.getRightToLeft()) {
        this._upButton.setRight(null);
        this._upButton.setLeft(0);
        this._downButton.setRight(null);
        this._downButton.setLeft(0);
    } else {
        this._upButton.setLeft(null);
        this._upButton.setRight(0);
        this._downButton.setLeft(null);
        this._downButton.setRight(0);
    }
};
_p._onFieldMouseDown = function (e) {
    this._activeTextField = e.getTarget();
    BiTimer.callOnce(function () {
        this._activeTextField.selectAll();
    }, 1, this);
};
_p._onFieldKeyDown = function (e) {
    if (!this._activeTextField) {
        return;
    }
    var outOfBounds = false;
    if (e.matchesBundleShortcut("selection.right")) {
        var selStart = this._activeTextField.getSelectionStart();
        var selLength = this._activeTextField.getSelectionLength();
        var textLength = this._activeTextField.getText().length;
        if (selStart + selLength >= textLength) {
            var next = this._textFields[this._textFields.indexOf(this._activeTextField) + 1];
            if (!next) {
                next = this._textFields[this._textFields.length - 1];
                outOfBounds = true;
            }
            this._syncDate(this._activeTextField);
            this._activeTextField = next;
            if (BiBrowserCheck.webkit) this._activeTextField._focusComponent();
            else this._activeTextField.setFocused(true);
            this._activeTextField.setSelectionStart(0);
            this._activeTextField.setSelectionLength(0);
            this._preventKeyPress = true;
            e.preventDefault();
            if (!outOfBounds) {
                this.dispatchEvent("fieldchange");
                this._dispatchChange();
            }
        }
        this._selectOnTabFocus();
    } else if (e.matchesBundleShortcut("selection.left")) {
        selStart = this._activeTextField.getSelectionStart();
        if (selStart == 0) {
            var prev = this._textFields[this._textFields.indexOf(this._activeTextField) - 1];
            if (!prev) {
                prev = this._textFields[0];
                outOfBounds = true;
            }
            this._syncDate(this._activeTextField);
            textLength = prev.getText().length;
            this._activeTextField = prev;
            if (BiBrowserCheck.webkit) this._activeTextField._focusComponent();
            else this._activeTextField.setFocused(true);
            this._activeTextField.setSelectionStart(textLength);
            this._activeTextField.setSelectionLength(0);
            this._preventKeyPress = true;
            e.preventDefault();
            if (!outOfBounds) {
                this.dispatchEvent("fieldchange");
                this._dispatchChange();
            }
        }
        this._selectOnTabFocus();
    } else if (e.matchesBundleShortcut("selection.up")) {
        this._increase();
        e.preventDefault();
        this._preventKeyPress = true;
    } else if (e.matchesBundleShortcut("selection.down")) {
        this._decrease();
        e.preventDefault();
        this._preventKeyPress = true;
    }
};
_p._onKeyPress = function (e) {
    if (BiBrowserCheck.moz && this._preventKeyPress) {
        e.preventDefault();
        delete this._preventKeyPress;
    }
    if (e.matchesBundleShortcut("controls.accept")) {
        this._syncDate(e.getTarget());
        this.dispatchEvent("action");
        if (this._command) this._command.execute();
    } else if (e.getTarget()._token.type != BiDateFormat.TokenTypes.AmPm) BiSpinner.filterInput(this, e);
};
_p._onTextChanged = function (e) {
    e.getTarget()._hasPotentionallyChanged = true;
};
_p._onBlur = function (e) {
    this._syncDates();
};
_p._createFields = function () {
    var tokens = this._dateFormat._tokens;
    var c;
    this._fields = [];
    this._textFields = [];
    for (var i = 0; i < tokens.length; i++) {
        switch (tokens[i].type) {
        case BiDateFormat.TokenTypes.Apos:
        case BiDateFormat.TokenTypes.String:
        case BiDateFormat.TokenTypes.QuotedString:
            c = new BiLabel(tokens[i].string);
            break;
        case BiDateFormat.TokenTypes.AmPm:
            c = new BiTextField("PM");
            c.setWidth(25);
            c.setPreferredWidth(25);
            c.setAlign("left");
            var ampPmStrings = this._dateFormat.getDateFormatSymbols().getAmPmStrings();
            c.setMaxLength(Math.max(ampPmStrings[0].length, ampPmStrings[1].length));
            break;
        case BiDateFormat.TokenTypes.HourInDay:
        case BiDateFormat.TokenTypes.HourInDay2:
        case BiDateFormat.TokenTypes.HourInAmPm:
        case BiDateFormat.TokenTypes.HourInAmPm2:
            c = new BiTextField("55");
            c.setWidth(18);
            c.setPreferredWidth(18);
            c.setMaxLength(2);
            c.setName("hour");
            break;
        case BiDateFormat.TokenTypes.Minute:
            c = new BiTextField("55");
            c.setWidth(18);
            c.setPreferredWidth(18);
            c.setMaxLength(2);
            c.setName("minute");
            break;
        case BiDateFormat.TokenTypes.Second:
            c = new BiTextField("55");
            c.setWidth(18);
            c.setPreferredWidth(18);
            c.setMaxLength(2);
            c.setName("second");
            break;
        case BiDateFormat.TokenTypes.Millisecond:
        case BiDateFormat.TokenTypes.TimeZone:
        case BiDateFormat.TokenTypes.TimeZone2:
        default:
            break;
            throw new Error("BiTimePicker does not support this time pattern type, " + tokens[i].string);
        }
        if (!c) continue;
        if (c instanceof BiTextField) {
            c.setTabIndex(BiBrowserCheck.webkit ? -1 : 0);
            this._textFields.push(c);
            c.addEventListener("mousedown", this._onFieldMouseDown, this);
            c.addEventListener("click", this._onFieldMouseDown, this);
            c.addEventListener("keypress", this._onKeyPress, this);
            c.addEventListener("textchanged", this._onTextChanged, this);
        }
        c.setTop(0);
        c.setBottom(0);
        c.setPadding(0, 2);
        c.setPaddingRight(1);
        c._token = tokens[i];
        this.add(c, null, true);
        this._fields.push(c);
        if (this._textFields.length > 0) this._activeTextField = this._textFields[0];
    }
};
_p._destroyFields = function () {
    var c;
    for (var i = 0; i < this._fields.length; i++) {
        c = this._fields[i];
        c._token = null;
        c.dispose();
    }
    this._fields = null;
    this._textFields = [];
    this._activeTextField = null;
};
_p.layoutAllChildren = function () {
    BiComponent.prototype.layoutAllChildren.call(this);
    this._layoutSpinnerButtons();
    this._layoutFields();
};
_p._layoutSpinnerButtons = function () {
    var h = this.getClientHeight();
    this._upButton.setHeight(Math.ceil(h / 2));
    this._downButton.setHeight(Math.floor(h / 2));
};
_p._layoutFields = function () {
    var w;
    var cw = this.getClientWidth();
    var x = cw - 16 - 3;
    for (var i = this._fields.length - 1; i >= 0; i--) {
        w = this._fields[i].getPreferredWidth();
        x -= w;
        this._fields[i].setLeft(x);
        this._fields[i].setWidth(w);
    }
};
_p._getFocusElement = function () {
    return this._activeTextField._element;
};
_p.setEnabled = function (b) {
    this._upButton.setEnabled(b);
    this._downButton.setEnabled(b);
    this._textFields.forEach(function (field) {
        if (field._created) field.setSelectionLength(0);
        field.setEnabled(b);
    }, this);
    BiComponent.prototype.setEnabled.call(this, b);
};
_p._selectOnTabFocus = function () {
    if (!this._activeTextField) this._activeTextField = this._textFields[0];
    if (this._activeTextField) this._activeTextField.selectAll();
};
_p._increase = function () {
    if (!this._activeTextField) this._activeTextField = this._textFields[0];
    var tf = this._activeTextField;
    if (!tf) return;
    this._syncDate(tf);
    var token = tf._token;
    var d = this._date;
    switch (token.type) {
    case BiDateFormat.TokenTypes.AmPm:
        if (d.getHours() >= 12) d.setHours(d.getHours() - 12);
        else d.setHours(d.getHours() + 12);
        this._updateTextField(tf);
        break;
    case BiDateFormat.TokenTypes.HourInDay:
    case BiDateFormat.TokenTypes.HourInDay2:
        d.setHours((d.getHours() + 1) % 24);
        this._updateTextField(tf);
        break;
    case BiDateFormat.TokenTypes.HourInAmPm:
    case BiDateFormat.TokenTypes.HourInAmPm2:
        if (d.getHours() >= 12) d.setHours(12 + (d.getHours() + 1) % 12);
        else d.setHours((d.getHours() + 1) % 12);
        this._updateTextField(tf);
        break;
    case BiDateFormat.TokenTypes.Minute:
        d.setMinutes((d.getMinutes() + 1) % 60);
        this._updateTextField(tf);
        break;
    case BiDateFormat.TokenTypes.Second:
        d.setSeconds((d.getSeconds() + 1) % 60);
        this._updateTextField(tf);
        break;
    }
    tf.selectAll();
    this._dispatchChange();
};
_p._decrease = function () {
    if (!this._activeTextField) this._activeTextField = this._textFields[0];
    var tf = this._activeTextField;
    if (!tf) return;
    this._syncDate(tf);
    var token = tf._token;
    var d = this._date;
    switch (token.type) {
    case BiDateFormat.TokenTypes.AmPm:
        if (d.getHours() >= 12) d.setHours(d.getHours() - 12);
        else d.setHours(d.getHours() + 12);
        this._updateTextField(tf);
        break;
    case BiDateFormat.TokenTypes.HourInDay:
    case BiDateFormat.TokenTypes.HourInDay2:
        d.setHours((d.getHours() + 23) % 24);
        this._updateTextField(tf);
        break;
    case BiDateFormat.TokenTypes.HourInAmPm:
    case BiDateFormat.TokenTypes.HourInAmPm2:
        if (d.getHours() >= 12) d.setHours(12 + (d.getHours() + 11) % 12);
        else d.setHours((d.getHours() + 11) % 12);
        this._updateTextField(tf);
        break;
    case BiDateFormat.TokenTypes.Minute:
        d.setMinutes((d.getMinutes() + 59) % 60);
        this._updateTextField(tf);
        break;
    case BiDateFormat.TokenTypes.Second:
        d.setSeconds((d.getSeconds() + 59) % 60);
        this._updateTextField(tf);
        break;
    }
    tf.selectAll();
    this._dispatchChange();
};
_p._updateTextField = function (tf) {
    if (this._maximum && this._date > this._maximum) {
        this._date = new Date(this._maximum);
        this._updateTextFields();
    } else if (this._minimum && this._date < this._minimum) {
        this._date = new Date(this._minimum);
        this._updateTextFields();
    } else {
        tf.setText(this._dateFormat._format(this._date, tf._token));
        delete tf._hasPotentionallyChanged;
    }
};
_p._updateTextFields = function () {
    for (var i = 0; i < this._textFields.length; i++) this._updateTextField(this._textFields[i]);
};
_p._syncDate = function (tf) {
    if (!tf._hasPotentionallyChanged) return;
    try {
        this._dateFormat._parse(tf.getText(), 0, tf._token, this._date, false);
    } catch (ex) {}
    this._updateTextFields();
    this._dispatchChange();
};
_p._syncDates = function () {
    var tf;
    for (var i = 0; i < this._textFields.length; i++) {
        tf = this._textFields[i];
        if (!tf._hasPotentionallyChanged) continue;
        try {
            this._dateFormat._parse(tf.getText(), 0, tf._token, this._date, false);
        } catch (ex) {}
        this._updateTextField(tf);
    }
    this._dispatchChange();
};
_p._dispatchChange = function () {
    if (this._date.valueOf() != this._lastFiredDate) {
        this.dispatchEvent("change");
        this._lastFiredDate = this._date.valueOf();
    }
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiComponent.prototype.dispose.call(this);
    this._destroyFields();
    this._date = null;
    if (this._dateFormat) {
        this._dateFormat.dispose();
        this._dateFormat = null;
    }
};
BiDateFormatSymbols.addBundle("de", {
    "am": "AM",
    "pm": "PM",
    "bc": "v. Chr.",
    "ad": "n. Chr.",
    "JanuaryLong": "Januar",
    "FebruaryLong": "Februar",
    "MarchLong": BiLabel.htmlToText("M&#228;rz"),
    "AprilLong": "April",
    "MayLong": "Mai",
    "JuneLong": "Juni",
    "JulyLong": "Juli",
    "AugustLong": "August",
    "SeptemberLong": "September",
    "OctoberLong": "Oktober",
    "NovemberLong": "November",
    "DecemberLong": "Dezember",
    "Jan": "Jan",
    "Feb": "Feb",
    "Mar": "Mrz",
    "Apr": "Apr",
    "May": "Mai",
    "Jun": "Jun",
    "Jul": "Jul",
    "Aug": "Aug",
    "Sep": "Sep",
    "Oct": "Okt",
    "Nov": "Nov",
    "Dec": "Dez",
    "Sunday": "Sonntag",
    "Monday": "Montag",
    "Tuesday": "Dienstag",
    "Wednesday": "Mittwoch",
    "Thursday": "Donnerstag",
    "Friday": "Freitag",
    "Saturday": "Samstag",
    "Sun": "So",
    "Mon": "Mo",
    "Tue": "Di",
    "Wed": "Mi",
    "Thu": "Do",
    "Fri": "Fr",
    "Sat": "Sa",
    "shortDateTimePattern": "dd.MM.yy HH:mm",
    "shortDatePattern": "dd.MM.yy",
    "shortTimePattern": "HH:mm",
    "mediumDateTimePattern": "dd.MM.yyyy HH:mm:ss",
    "mediumDatePattern": "dd.MM.yyyy",
    "mediumTimePattern": "HH:mm:ss",
    "longDateTimePattern": "d. MMMM yyyy HH:mm:ss z",
    "longDatePattern": "d. MMMM yyyy",
    "longTimePattern": "HH:mm:ss z",
    "firstWeekday": "1",
    "redWeekdays": "0",
    "localePatternChars": "GuMtkHmsSEDFwWahKzZ",
    "rightToLeft": "false"
});
BiDateFormatSymbols.addBundle("en", {
    "am": "AM",
    "pm": "PM",
    "bc": "BC",
    "ad": "AD",
    "JanuaryLong": "January",
    "FebruaryLong": "February",
    "MarchLong": "March",
    "AprilLong": "April",
    "MayLong": "May",
    "JuneLong": "June",
    "JulyLong": "July",
    "AugustLong": "August",
    "SeptemberLong": "September",
    "OctoberLong": "October",
    "NovemberLong": "November",
    "DecemberLong": "December",
    "Jan": "Jan",
    "Feb": "Feb",
    "Mar": "Mar",
    "Apr": "Apr",
    "May": "May",
    "Jun": "Jun",
    "Jul": "Jul",
    "Aug": "Aug",
    "Sep": "Sep",
    "Oct": "Oct",
    "Nov": "Nov",
    "Dec": "Dec",
    "Sunday": "Sunday",
    "Monday": "Monday",
    "Tuesday": "Tuesday",
    "Wednesday": "Wednesday",
    "Thursday": "Thursday",
    "Friday": "Friday",
    "Saturday": "Saturday",
    "Sun": "Sun",
    "Mon": "Mon",
    "Tue": "Tue",
    "Wed": "Wed",
    "Thu": "Thu",
    "Fri": "Fri",
    "Sat": "Sat",
    "shortDateTimePattern": "M/d/yy h:mm a",
    "shortDatePattern": "M/d/yy",
    "shortTimePattern": "h:mm a",
    "mediumDateTimePattern": "MMM d, yyyy h:mm:ss a",
    "mediumDatePattern": "MMM d, yyyy",
    "mediumTimePattern": "h:mm:ss a",
    "longDateTimePattern": "MMMM d, yyyy h:mm:ss a z",
    "longDatePattern": "MMMM d, yyyy",
    "longTimePattern": "h:mm:ss a z",
    "firstWeekday": "0",
    "redWeekdays": "0",
    "localePatternChars": "GyMdkHmsSEDFwWahKzZ",
    "rightToLeft": "false"
});
BiDateFormatSymbols.addBundle("es", {
    "am": "AM",
    "pm": "PM",
    "bc": "BC",
    "ad": "AD",
    "JanuaryLong": "enero",
    "FebruaryLong": "febrero",
    "MarchLong": "marzo",
    "AprilLong": "abril",
    "MayLong": "mayo",
    "JuneLong": "junio",
    "JulyLong": "julio",
    "AugustLong": "agosto",
    "SeptemberLong": "septiembre",
    "OctoberLong": "octubre",
    "NovemberLong": "noviembre",
    "DecemberLong": "diciembre",
    "Jan": "ene",
    "Feb": "feb",
    "Mar": "mar",
    "Apr": "abr",
    "May": "may",
    "Jun": "jun",
    "Jul": "jul",
    "Aug": "ago",
    "Sep": "sep",
    "Oct": "oct",
    "Nov": "nov",
    "Dec": "dic",
    "Sunday": "domingo",
    "Monday": "lunes",
    "Tuesday": "martes",
    "Wednesday": BiLabel.htmlToText("mi&#233;rcoles"),
    "Thursday": "jueves",
    "Friday": "viernes",
    "Saturday": BiLabel.htmlToText("s&#225;bado"),
    "Sun": "dom",
    "Mon": "lun",
    "Tue": "mar",
    "Wed": BiLabel.htmlToText("mi&#233;"),
    "Thu": "jue",
    "Fri": "vie",
    "Sat": BiLabel.htmlToText("s&#225;b"),
    "shortDateTimePattern": "d/MM/yy H:mm",
    "shortDatePattern": "d/MM/yy",
    "shortTimePattern": "H:mm",
    "mediumDateTimePattern": "dd-MMM-yyyy H:mm:ss",
    "mediumDatePattern": "dd-MMM-yyyy",
    "mediumTimePattern": "H:mm:ss",
    "longDateTimePattern": "d' de 'MMMM' de 'yyyy H:mm:ss z",
    "longDatePattern": "d' de 'MMMM' de 'yyyy",
    "longTimePattern": "H:mm:ss z",
    "firstWeekday": "1",
    "redWeekdays": "0",
    "localePatternChars": "GyMdkHmsSEDFwWahKzZ",
    "rightToLeft": "false"
});
BiDateFormatSymbols.addBundle("fr", {
    "am": "AM",
    "pm": "PM",
    "bc": "BC",
    "ad": "ap. J.-C.",
    "JanuaryLong": "janvier",
    "FebruaryLong": BiLabel.htmlToText("f&#233;vrier"),
    "MarchLong": "mars",
    "AprilLong": "avril",
    "MayLong": "mai",
    "JuneLong": "juin",
    "JulyLong": "juillet",
    "AugustLong": BiLabel.htmlToText("ao&#251;t"),
    "SeptemberLong": "septembre",
    "OctoberLong": "octobre",
    "NovemberLong": "novembre",
    "DecemberLong": BiLabel.htmlToText("d&#233;cembre"),
    "Jan": "janv.",
    "Feb": BiLabel.htmlToText("f&#233;vr."),
    "Mar": "mars",
    "Apr": "avr.",
    "May": "mai",
    "Jun": "juin",
    "Jul": "juil.",
    "Aug": BiLabel.htmlToText("ao&#251;t"),
    "Sep": "sept.",
    "Oct": "oct.",
    "Nov": "nov.",
    "Dec": BiLabel.htmlToText("d&#233;c."),
    "Sunday": "dimanche",
    "Monday": "lundi",
    "Tuesday": "mardi",
    "Wednesday": "mercredi",
    "Thursday": "jeudi",
    "Friday": "vendredi",
    "Saturday": "samedi",
    "Sun": "dim.",
    "Mon": "lun.",
    "Tue": "mar.",
    "Wed": "mer.",
    "Thu": "jeu.",
    "Fri": "ven.",
    "Sat": "sam.",
    "shortDateTimePattern": "dd/MM/yy HH:mm",
    "shortDatePattern": "dd/MM/yy",
    "shortTimePattern": "HH:mm",
    "mediumDateTimePattern": "d MMM yyyy HH:mm:ss",
    "mediumDatePattern": "d MMM yyyy",
    "mediumTimePattern": "HH:mm:ss",
    "longDateTimePattern": "d MMMM yyyy HH:mm:ss z",
    "longDatePattern": "d MMMM yyyy",
    "longTimePattern": "HH:mm:ss z",
    "firstWeekday": "1",
    "redWeekdays": "0",
    "localePatternChars": "GyMdkHmsSEDFwWahKzZ",
    "rightToLeft": "false"
});
BiDateFormatSymbols.addBundle("he", {
    "am": "AM",
    "pm": "PM",
    "bc": BiLabel.htmlToText("&#1500;&#1505;&#1492;\"&#1504;"),
    "ad": BiLabel.htmlToText("&#1500;&#1508;&#1505;&#1492;\"&#1504;"),
    "JanuaryLong": BiLabel.htmlToText("&#1497;&#1504;&#1493;&#1488;&#1512;"),
    "FebruaryLong": BiLabel.htmlToText("&#1508;&#1489;&#1512;&#1493;&#1488;&#1512;"),
    "MarchLong": BiLabel.htmlToText("&#1502;&#1512;&#1509;"),
    "AprilLong": BiLabel.htmlToText("&#1488;&#1508;&#1512;&#1497;&#1500;"),
    "MayLong": BiLabel.htmlToText("&#1502;&#1488;&#1497;"),
    "JuneLong": BiLabel.htmlToText("&#1497;&#1493;&#1504;&#1497;"),
    "JulyLong": BiLabel.htmlToText("&#1497;&#1493;&#1500;&#1497;"),
    "AugustLong": BiLabel.htmlToText("&#1488;&#1493;&#1490;&#1493;&#1505;&#1496;"),
    "SeptemberLong": BiLabel.htmlToText("&#1505;&#1508;&#1496;&#1502;&#1489;&#1512;"),
    "OctoberLong": BiLabel.htmlToText("&#1488;&#1493;&#1511;&#1496;&#1493;&#1489;&#1512;"),
    "NovemberLong": BiLabel.htmlToText("&#1504;&#1493;&#1489;&#1502;&#1489;&#1512;"),
    "DecemberLong": BiLabel.htmlToText("&#1491;&#1510;&#1502;&#1489;&#1512;"),
    "Jan": BiLabel.htmlToText("&#1497;&#1504;&#1493;"),
    "Feb": BiLabel.htmlToText("&#1508;&#1489;&#1512;"),
    "Mar": BiLabel.htmlToText("&#1502;&#1512;&#1509;"),
    "Apr": BiLabel.htmlToText("&#1488;&#1508;&#1512;"),
    "May": BiLabel.htmlToText("&#1502;&#1488;&#1497;"),
    "Jun": BiLabel.htmlToText("&#1497;&#1493;&#1504;"),
    "Jul": BiLabel.htmlToText("&#1497;&#1493;&#1500;"),
    "Aug": BiLabel.htmlToText("&#1488;&#1493;&#1490;"),
    "Sep": BiLabel.htmlToText("&#1505;&#1508;&#1496;"),
    "Oct": BiLabel.htmlToText("&#1488;&#1493;&#1511;"),
    "Nov": BiLabel.htmlToText("&#1504;&#1493;&#1489;"),
    "Dec": BiLabel.htmlToText("&#1491;&#1510;&#1502;"),
    "Sunday": BiLabel.htmlToText("&#1497;&#1493;&#1501; &#1512;&#1488;&#1513;&#1493;&#1503;"),
    "Monday": BiLabel.htmlToText("&#1497;&#1493;&#1501; &#1513;&#1504;&#1497;"),
    "Tuesday": BiLabel.htmlToText("&#1497;&#1493;&#1501; &#1513;&#1500;&#1497;&#1513;&#1497;"),
    "Wednesday": BiLabel.htmlToText("&#1497;&#1493;&#1501; &#1512;&#1489;&#1497;&#1506;&#1497;"),
    "Thursday": BiLabel.htmlToText("&#1497;&#1493;&#1501; &#1495;&#1502;&#1497;&#1513;&#1497;"),
    "Friday": BiLabel.htmlToText("&#1497;&#1493;&#1501; &#1513;&#1497;&#1513;&#1497;"),
    "Saturday": BiLabel.htmlToText("&#1513;&#1489;&#1514;"),
    "Sun": BiLabel.htmlToText("&#1488;"),
    "Mon": BiLabel.htmlToText("&#1489;"),
    "Tue": BiLabel.htmlToText("&#1490;"),
    "Wed": BiLabel.htmlToText("&#1491;"),
    "Thu": BiLabel.htmlToText("&#1492;"),
    "Fri": BiLabel.htmlToText("&#1493;"),
    "Sat": BiLabel.htmlToText("&#1513;"),
    "shortDateTimePattern": "HH:mm dd/MM/yy",
    "shortDatePattern": "dd/MM/yy",
    "shortTimePattern": "HH:mm",
    "mediumDateTimePattern": "HH:mm:ss dd/MM/yyyy",
    "mediumDatePattern": "dd/MM/yyyy",
    "mediumTimePattern": "HH:mm:ss",
    "longDateTimePattern": "HH:mm:ss z d MMMM yyyy",
    "longDatePattern": "d MMMM yyyy",
    "longTimePattern": "HH:mm:ss z",
    "firstWeekday": "0",
    "redWeekdays": "6",
    "localePatternChars": "GanjkHmsSEDFwWxhKzZ",
    "rightToLeft": "true"
});
BiDateFormatSymbols.addBundle("ja", {
    "am": BiLabel.htmlToText("&#21320;&#21069;"),
    "pm": BiLabel.htmlToText("&#21320;&#24460;"),
    "bc": BiLabel.htmlToText("&#32000;&#20803;&#21069;"),
    "ad": BiLabel.htmlToText("&#35199;&#26278;"),
    "JanuaryLong": BiLabel.htmlToText("1&#26376;"),
    "FebruaryLong": BiLabel.htmlToText("2&#26376;"),
    "MarchLong": BiLabel.htmlToText("3&#26376;"),
    "AprilLong": BiLabel.htmlToText("4&#26376;"),
    "MayLong": BiLabel.htmlToText("5&#26376;"),
    "JuneLong": BiLabel.htmlToText("6&#26376;"),
    "JulyLong": BiLabel.htmlToText("7&#26376;"),
    "AugustLong": BiLabel.htmlToText("8&#26376;"),
    "SeptemberLong": BiLabel.htmlToText("9&#26376;"),
    "OctoberLong": BiLabel.htmlToText("10&#26376;"),
    "NovemberLong": BiLabel.htmlToText("11&#26376;"),
    "DecemberLong": BiLabel.htmlToText("12&#26376;"),
    "Jan": "1",
    "Feb": "2",
    "Mar": "3",
    "Apr": "4",
    "May": "5",
    "Jun": "6",
    "Jul": "7",
    "Aug": "8",
    "Sep": "9",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12",
    "Sunday": BiLabel.htmlToText("&#26085;&#26332;&#26085;"),
    "Monday": BiLabel.htmlToText("&#26376;&#26332;&#26085;"),
    "Tuesday": BiLabel.htmlToText("&#28779;&#26332;&#26085;"),
    "Wednesday": BiLabel.htmlToText("&#27700;&#26332;&#26085;"),
    "Thursday": BiLabel.htmlToText("&#26408;&#26332;&#26085;"),
    "Friday": BiLabel.htmlToText("&#37329;&#26332;&#26085;"),
    "Saturday": BiLabel.htmlToText("&#22303;&#26332;&#26085;"),
    "Sun": BiLabel.htmlToText("&#26085;"),
    "Mon": BiLabel.htmlToText("&#26376;"),
    "Tue": BiLabel.htmlToText("&#28779;"),
    "Wed": BiLabel.htmlToText("&#27700;"),
    "Thu": BiLabel.htmlToText("&#26408;"),
    "Fri": BiLabel.htmlToText("&#37329;"),
    "Sat": BiLabel.htmlToText("&#22303;"),
    "shortDateTimePattern": "yy/MM/dd H:mm",
    "shortDatePattern": "yy/MM/dd",
    "shortTimePattern": "H:mm",
    "mediumDateTimePattern": "yyyy/MM/dd H:mm:ss",
    "mediumDatePattern": "yyyy/MM/dd",
    "mediumTimePattern": "H:mm:ss",
    "longDateTimePattern": "yyyy/MM/dd H:mm:ss z",
    "longDatePattern": "yyyy/MM/dd",
    "longTimePattern": "H:mm:ss z",
    "firstWeekday": "0",
    "redWeekdays": "0",
    "localePatternChars": "GyMdkHmsSEDFwWahKzZ",
    "rightToLeft": "false",
    "yearSuffix": BiLabel.htmlToText("&#24180;")
});
BiDateFormatSymbols.addBundle("ko", {
    "am": BiLabel.htmlToText("&#50724;&#51204;"),
    "pm": BiLabel.htmlToText("&#50724;&#54980;"),
    "bc": "BC",
    "ad": "AD",
    "JanuaryLong": BiLabel.htmlToText("1&#50900;"),
    "FebruaryLong": BiLabel.htmlToText("2&#50900;"),
    "MarchLong": BiLabel.htmlToText("3&#50900;"),
    "AprilLong": BiLabel.htmlToText("4&#50900;"),
    "MayLong": BiLabel.htmlToText("5&#50900;"),
    "JuneLong": BiLabel.htmlToText("6&#50900;"),
    "JulyLong": BiLabel.htmlToText("7&#50900;"),
    "AugustLong": BiLabel.htmlToText("8&#50900;"),
    "SeptemberLong": BiLabel.htmlToText("9&#50900;"),
    "OctoberLong": BiLabel.htmlToText("10&#50900;"),
    "NovemberLong": BiLabel.htmlToText("11&#50900;"),
    "DecemberLong": BiLabel.htmlToText("12&#50900;"),
    "Jan": BiLabel.htmlToText("1&#50900;"),
    "Feb": BiLabel.htmlToText("2&#50900;"),
    "Mar": BiLabel.htmlToText("3&#50900;"),
    "Apr": BiLabel.htmlToText("4&#50900;"),
    "May": BiLabel.htmlToText("5&#50900;"),
    "Jun": BiLabel.htmlToText("6&#50900;"),
    "Jul": BiLabel.htmlToText("7&#50900;"),
    "Aug": BiLabel.htmlToText("8&#50900;"),
    "Sep": BiLabel.htmlToText("9&#50900;"),
    "Oct": BiLabel.htmlToText("10&#50900;"),
    "Nov": BiLabel.htmlToText("11&#50900;"),
    "Dec": BiLabel.htmlToText("12&#50900;"),
    "Sunday": BiLabel.htmlToText("&#51068;&#50836;&#51068;"),
    "Monday": BiLabel.htmlToText("&#50900;&#50836;&#51068;"),
    "Tuesday": BiLabel.htmlToText("&#54868;&#50836;&#51068;"),
    "Wednesday": BiLabel.htmlToText("&#49688;&#50836;&#51068;"),
    "Thursday": BiLabel.htmlToText("&#47785;&#50836;&#51068;"),
    "Friday": BiLabel.htmlToText("&#44552;&#50836;&#51068;"),
    "Saturday": BiLabel.htmlToText("&#53664;&#50836;&#51068;"),
    "Sun": BiLabel.htmlToText("&#51068;"),
    "Mon": BiLabel.htmlToText("&#50900;"),
    "Tue": BiLabel.htmlToText("&#54868;"),
    "Wed": BiLabel.htmlToText("&#49688;"),
    "Thu": BiLabel.htmlToText("&#47785;"),
    "Fri": BiLabel.htmlToText("&#44552;"),
    "Sat": BiLabel.htmlToText("&#53664;"),
    "shortDateTimePattern": "yy. M. d a h:mm",
    "shortDatePattern": "yy. M. d",
    "shortTimePattern": "a h:mm",
    "mediumDateTimePattern": "yyyy. M. d a h:mm:ss",
    "mediumDatePattern": "yyyy. M. d",
    "mediumTimePattern": "a h:mm:ss",
    "longDateTimePattern": BiLabel.htmlToText("yyyy'&#45380;' M'&#50900;' d'&#51068;' '('EE')' a h'&#49884;' mm'&#48516;' ss'&#52488;'"),
    "longDatePattern": BiLabel.htmlToText("yyyy'&#45380;' M'&#50900;' d'&#51068;' '('EE')'"),
    "longTimePattern": BiLabel.htmlToText("a h'&#49884;' mm'&#48516;' ss'&#52488;'"),
    "firstWeekday": "0",
    "redWeekdays": "0",
    "localePatternChars": "GyMdkHmsSEDFwWahKzZ",
    "rightToLeft": "false"
});
BiDateFormatSymbols.addBundle("pt", {
    "am": "AM",
    "pm": "PM",
    "bc": "BC",
    "ad": "AD",
    "JanuaryLong": "Janeiro",
    "FebruaryLong": "Fevereiro",
    "MarchLong": BiLabel.htmlToText("Mar&#231;o"),
    "AprilLong": "Abril",
    "MayLong": "Maio",
    "JuneLong": "Junho",
    "JulyLong": "Julho",
    "AugustLong": "Agosto",
    "SeptemberLong": "Setembro",
    "OctoberLong": "Outubro",
    "NovemberLong": "Novembro",
    "DecemberLong": "Dezembro",
    "Jan": "Jan",
    "Feb": "Fev",
    "Mar": "Mar",
    "Apr": "Abr",
    "May": "Mai",
    "Jun": "Jun",
    "Jul": "Jul",
    "Aug": "Ago",
    "Sep": "Set",
    "Oct": "Out",
    "Nov": "Nov",
    "Dec": "Dez",
    "Sunday": "Domingo",
    "Monday": "Segunda-feira",
    "Tuesday": BiLabel.htmlToText("Ter&#231;a-feira"),
    "Wednesday": "Quarta-feira",
    "Thursday": "Quinta-feira",
    "Friday": "Sexta-feira",
    "Saturday": BiLabel.htmlToText("S&#225;bado"),
    "Sun": "Dom",
    "Mon": "Seg",
    "Tue": "Ter",
    "Wed": "Qua",
    "Thu": "Qui",
    "Fri": "Sex",
    "Sat": BiLabel.htmlToText("S&#225;b"),
    "shortDateTimePattern": "dd-MM-yyyy H:mm",
    "shortDatePattern": "dd-MM-yyyy",
    "shortTimePattern": "H:mm",
    "mediumDateTimePattern": "d/MMM/yyyy H:mm:ss",
    "mediumDatePattern": "d/MMM/yyyy",
    "mediumTimePattern": "H:mm:ss",
    "longDateTimePattern": "d' de 'MMMM' de 'yyyy H:mm:ss z",
    "longDatePattern": "d' de 'MMMM' de 'yyyy",
    "longTimePattern": "H:mm:ss z",
    "firstWeekday": "1",
    "redWeekdays": "0",
    "localePatternChars": "GyMdkHmsSEDFwWahKzZ",
    "rightToLeft": "false"
});
BiDateFormatSymbols.addBundle("ru", {
    "am": "AM",
    "pm": "PM",
    "bc": BiLabel.htmlToText("&#1076;&#1086; &#1085;.&#1101;."),
    "ad": BiLabel.htmlToText("&#1085;.&#1101;."),
    "JanuaryLong": BiLabel.htmlToText("&#1071;&#1085;&#1074;&#1072;&#1088;&#1100;"),
    "FebruaryLong": BiLabel.htmlToText("&#1060;&#1077;&#1074;&#1088;&#1072;&#1083;&#1100;"),
    "MarchLong": BiLabel.htmlToText("&#1052;&#1072;&#1088;&#1090;"),
    "AprilLong": BiLabel.htmlToText("&#1040;&#1087;&#1088;&#1077;&#1083;&#1100;"),
    "MayLong": BiLabel.htmlToText("&#1052;&#1072;&#1081;"),
    "JuneLong": BiLabel.htmlToText("&#1048;&#1102;&#1085;&#1100;"),
    "JulyLong": BiLabel.htmlToText("&#1048;&#1102;&#1083;&#1100;"),
    "AugustLong": BiLabel.htmlToText("&#1040;&#1074;&#1075;&#1091;&#1089;&#1090;"),
    "SeptemberLong": BiLabel.htmlToText("&#1057;&#1077;&#1085;&#1090;&#1103;&#1073;&#1088;&#1100;"),
    "OctoberLong": BiLabel.htmlToText("&#1054;&#1082;&#1090;&#1103;&#1073;&#1088;&#1100;"),
    "NovemberLong": BiLabel.htmlToText("&#1053;&#1086;&#1103;&#1073;&#1088;&#1100;"),
    "DecemberLong": BiLabel.htmlToText("&#1044;&#1077;&#1082;&#1072;&#1073;&#1088;&#1100;"),
    "Jan": BiLabel.htmlToText("&#1103;&#1085;&#1074;"),
    "Feb": BiLabel.htmlToText("&#1092;&#1077;&#1074;"),
    "Mar": BiLabel.htmlToText("&#1084;&#1072;&#1088;"),
    "Apr": BiLabel.htmlToText("&#1072;&#1087;&#1088;"),
    "May": BiLabel.htmlToText("&#1084;&#1072;&#1081;"),
    "Jun": BiLabel.htmlToText("&#1080;&#1102;&#1085;"),
    "Jul": BiLabel.htmlToText("&#1080;&#1102;&#1083;"),
    "Aug": BiLabel.htmlToText("&#1072;&#1074;&#1075;"),
    "Sep": BiLabel.htmlToText("&#1089;&#1077;&#1085;"),
    "Oct": BiLabel.htmlToText("&#1086;&#1082;&#1090;"),
    "Nov": BiLabel.htmlToText("&#1085;&#1086;&#1103;"),
    "Dec": BiLabel.htmlToText("&#1076;&#1077;&#1082;"),
    "Sunday": BiLabel.htmlToText("&#1074;&#1086;&#1089;&#1082;&#1088;&#1077;&#1089;&#1077;&#1085;&#1100;&#1077;"),
    "Monday": BiLabel.htmlToText("&#1087;&#1086;&#1085;&#1077;&#1076;&#1077;&#1083;&#1100;&#1085;&#1080;&#1082;"),
    "Tuesday": BiLabel.htmlToText("&#1074;&#1090;&#1086;&#1088;&#1085;&#1080;&#1082;"),
    "Wednesday": BiLabel.htmlToText("&#1089;&#1088;&#1077;&#1076;&#1072;"),
    "Thursday": BiLabel.htmlToText("&#1095;&#1077;&#1090;&#1074;&#1077;&#1088;&#1075;"),
    "Friday": BiLabel.htmlToText("&#1087;&#1103;&#1090;&#1085;&#1080;&#1094;&#1072;"),
    "Saturday": BiLabel.htmlToText("&#1089;&#1091;&#1073;&#1073;&#1086;&#1090;&#1072;"),
    "Sun": BiLabel.htmlToText("&#1042;&#1089;"),
    "Mon": BiLabel.htmlToText("&#1055;&#1085;"),
    "Tue": BiLabel.htmlToText("&#1042;&#1090;"),
    "Wed": BiLabel.htmlToText("&#1057;&#1088;"),
    "Thu": BiLabel.htmlToText("&#1063;&#1090;"),
    "Fri": BiLabel.htmlToText("&#1055;&#1090;"),
    "Sat": BiLabel.htmlToText("&#1057;&#1073;"),
    "shortDateTimePattern": "dd.MM.yy H:mm",
    "shortDatePattern": "dd.MM.yy",
    "shortTimePattern": "H:mm",
    "mediumDateTimePattern": "dd.MM.yyyy H:mm:ss",
    "mediumDatePattern": "dd.MM.yyyy",
    "mediumTimePattern": "H:mm:ss",
    "longDateTimePattern": BiLabel.htmlToText("d MMMM yyyy '&#1075;.' H:mm:ss z"),
    "longDatePattern": BiLabel.htmlToText("d MMMM yyyy '&#1075;.'"),
    "longTimePattern": "H:mm:ss z",
    "firstWeekday": "1",
    "redWeekdays": "0",
    "localePatternChars": "GanjkHmsSEDFwWxhKzZ",
    "rightToLeft": "false"
});
BiDateFormatSymbols.addBundle("sv", {
    "am": "AM",
    "pm": "PM",
    "bc": "BC",
    "ad": "AD",
    "JanuaryLong": "januari",
    "FebruaryLong": "februari",
    "MarchLong": "mars",
    "AprilLong": "april",
    "MayLong": "maj",
    "JuneLong": "juni",
    "JulyLong": "juli",
    "AugustLong": "augusti",
    "SeptemberLong": "september",
    "OctoberLong": "oktober",
    "NovemberLong": "november",
    "DecemberLong": "december",
    "Jan": "jan",
    "Feb": "feb",
    "Mar": "mar",
    "Apr": "apr",
    "May": "maj",
    "Jun": "jun",
    "Jul": "jul",
    "Aug": "aug",
    "Sep": "sep",
    "Oct": "okt",
    "Nov": "nov",
    "Dec": "dec",
    "Sunday": BiLabel.htmlToText("s&#246;ndag"),
    "Monday": BiLabel.htmlToText("m&#229;ndag"),
    "Tuesday": "tisdag",
    "Wednesday": "onsdag",
    "Thursday": "torsdag",
    "Friday": "fredag",
    "Saturday": BiLabel.htmlToText("l&#246;rdag"),
    "Sun": BiLabel.htmlToText("s&#246;"),
    "Mon": BiLabel.htmlToText("m&#229;"),
    "Tue": "ti",
    "Wed": "on",
    "Thu": "to",
    "Fri": "fr",
    "Sat": BiLabel.htmlToText("l&#246;"),
    "shortDateTimePattern": "yyyy-MM-dd HH:mm",
    "shortDatePattern": "yyyy-MM-dd",
    "shortTimePattern": "HH:mm",
    "mediumDateTimePattern": "yyyy-MMM-dd HH:mm:ss",
    "mediumDatePattern": "yyyy-MMM-dd",
    "mediumTimePattern": "HH:mm:ss",
    "longDateTimePattern": "'den 'd MMMM yyyy HH:mm:ss z",
    "longDatePattern": "'den 'd MMMM yyyy",
    "longTimePattern": "HH:mm:ss z",
    "firstWeekday": "1",
    "redWeekdays": "0",
    "localePatternChars": "GyMdkHmsSEDFwWahKzZ",
    "rightToLeft": "false"
});
BiDateFormatSymbols.addBundle("tr", {
    "am": "AM",
    "pm": "PM",
    "bc": "BC",
    "ad": "AD",
    "JanuaryLong": "Ocak",
    "FebruaryLong": BiLabel.htmlToText("&#350;ubat"),
    "MarchLong": "Mart",
    "AprilLong": "Nisan",
    "MayLong": BiLabel.htmlToText("May&#305;s"),
    "JuneLong": "Haziran",
    "JulyLong": "Temmuz",
    "AugustLong": BiLabel.htmlToText("A&#287;ustos"),
    "SeptemberLong": BiLabel.htmlToText("Eyl&#252;l"),
    "OctoberLong": "Ekim",
    "NovemberLong": BiLabel.htmlToText("Kas&#305;m"),
    "DecemberLong": BiLabel.htmlToText("Aral&#305;k"),
    "Jan": "Oca",
    "Feb": BiLabel.htmlToText("&#350;ub"),
    "Mar": "Mar",
    "Apr": "Nis",
    "May": "May",
    "Jun": "Haz",
    "Jul": "Tem",
    "Aug": BiLabel.htmlToText("A&#287;u"),
    "Sep": "Eyl",
    "Oct": "Eki",
    "Nov": "Kas",
    "Dec": "Ara",
    "Sunday": "Pazar",
    "Monday": "Pazartesi",
    "Tuesday": BiLabel.htmlToText("Sal&#305;"),
    "Wednesday": BiLabel.htmlToText("&#199;ar&#351;amba"),
    "Thursday": BiLabel.htmlToText("Per&#351;embe"),
    "Friday": "Cuma",
    "Saturday": "Cumartesi",
    "Sun": "Paz",
    "Mon": "Pzt",
    "Tue": "Sal",
    "Wed": BiLabel.htmlToText("&#199;ar"),
    "Thu": "Per",
    "Fri": "Cum",
    "Sat": "Cmt",
    "shortDateTimePattern": "dd.MM.yyyy HH:mm",
    "shortDatePattern": "dd.MM.yyyy",
    "shortTimePattern": "HH:mm",
    "mediumDateTimePattern": "dd.MMM.yyyy HH:mm:ss",
    "mediumDatePattern": "dd.MMM.yyyy",
    "mediumTimePattern": "HH:mm:ss",
    "longDateTimePattern": "dd MMMM yyyy EEEE HH:mm:ss z",
    "longDatePattern": "dd MMMM yyyy EEEE",
    "longTimePattern": "HH:mm:ss z",
    "firstWeekday": "1",
    "redWeekdays": "0",
    "localePatternChars": "GanjkHmsSEDFwWxhKzZ",
    "rightToLeft": "false"
});
BiDateFormatSymbols.addBundle("zh-CN", {
    "am": BiLabel.htmlToText("&#19978;&#21320;"),
    "pm": BiLabel.htmlToText("&#19979;&#21320;"),
    "bc": BiLabel.htmlToText("&#20844;&#20803;&#21069;"),
    "ad": BiLabel.htmlToText("&#20844;&#20803;"),
    "JanuaryLong": BiLabel.htmlToText("&#19968;&#26376;"),
    "FebruaryLong": BiLabel.htmlToText("&#20108;&#26376;"),
    "MarchLong": BiLabel.htmlToText("&#19977;&#26376;"),
    "AprilLong": BiLabel.htmlToText("&#22235;&#26376;"),
    "MayLong": BiLabel.htmlToText("&#20116;&#26376;"),
    "JuneLong": BiLabel.htmlToText("&#20845;&#26376;"),
    "JulyLong": BiLabel.htmlToText("&#19971;&#26376;"),
    "AugustLong": BiLabel.htmlToText("&#20843;&#26376;"),
    "SeptemberLong": BiLabel.htmlToText("&#20061;&#26376;"),
    "OctoberLong": BiLabel.htmlToText("&#21313;&#26376;"),
    "NovemberLong": BiLabel.htmlToText("&#21313;&#19968;&#26376;"),
    "DecemberLong": BiLabel.htmlToText("&#21313;&#20108;&#26376;"),
    "Jan": BiLabel.htmlToText("&#19968;&#26376;"),
    "Feb": BiLabel.htmlToText("&#20108;&#26376;"),
    "Mar": BiLabel.htmlToText("&#19977;&#26376;"),
    "Apr": BiLabel.htmlToText("&#22235;&#26376;"),
    "May": BiLabel.htmlToText("&#20116;&#26376;"),
    "Jun": BiLabel.htmlToText("&#20845;&#26376;"),
    "Jul": BiLabel.htmlToText("&#19971;&#26376;"),
    "Aug": BiLabel.htmlToText("&#20843;&#26376;"),
    "Sep": BiLabel.htmlToText("&#20061;&#26376;"),
    "Oct": BiLabel.htmlToText("&#21313;&#26376;"),
    "Nov": BiLabel.htmlToText("&#21313;&#19968;&#26376;"),
    "Dec": BiLabel.htmlToText("&#21313;&#20108;&#26376;"),
    "Sunday": BiLabel.htmlToText("&#26143;&#26399;&#26085;"),
    "Monday": BiLabel.htmlToText("&#26143;&#26399;&#19968;"),
    "Tuesday": BiLabel.htmlToText("&#26143;&#26399;&#20108;"),
    "Wednesday": BiLabel.htmlToText("&#26143;&#26399;&#19977;"),
    "Thursday": BiLabel.htmlToText("&#26143;&#26399;&#22235;"),
    "Friday": BiLabel.htmlToText("&#26143;&#26399;&#20116;"),
    "Saturday": BiLabel.htmlToText("&#26143;&#26399;&#20845;"),
    "Sun": BiLabel.htmlToText("&#26143;&#26399;&#26085;"),
    "Mon": BiLabel.htmlToText("&#26143;&#26399;&#19968;"),
    "Tue": BiLabel.htmlToText("&#26143;&#26399;&#20108;"),
    "Wed": BiLabel.htmlToText("&#26143;&#26399;&#19977;"),
    "Thu": BiLabel.htmlToText("&#26143;&#26399;&#22235;"),
    "Fri": BiLabel.htmlToText("&#26143;&#26399;&#20116;"),
    "Sat": BiLabel.htmlToText("&#26143;&#26399;&#20845;"),
    "shortDateTimePattern": "yy-M-d ah:mm",
    "shortDatePattern": "yy-M-d",
    "shortTimePattern": "ah:mm",
    "mediumDateTimePattern": "yyyy-M-d H:mm:ss",
    "mediumDatePattern": "yyyy-M-d",
    "mediumTimePattern": "H:mm:ss",
    "longDateTimePattern": BiLabel.htmlToText("yyyy'&#24180;'M'&#26376;'d'&#26085;' ahh'&#26102;'mm'&#20998;'ss'&#31186;'"),
    "longDatePattern": BiLabel.htmlToText("yyyy'&#24180;'M'&#26376;'d'&#26085;'"),
    "longTimePattern": BiLabel.htmlToText("ahh'&#26102;'mm'&#20998;'ss'&#31186;'"),
    "firstWeekday": "0",
    "redWeekdays": "0",
    "localePatternChars": "GanjkHmsSEDFwWxhKzZ",
    "rightToLeft": "false"
});
BiDateFormatSymbols.addBundle("zh-TW", {
    "am": BiLabel.htmlToText("&#19978;&#21320;"),
    "pm": BiLabel.htmlToText("&#19979;&#21320;"),
    "bc": BiLabel.htmlToText("&#35199;&#20803;&#21069;"),
    "ad": BiLabel.htmlToText("&#35199;&#20803;"),
    "JanuaryLong": BiLabel.htmlToText("&#19968;&#26376;"),
    "FebruaryLong": BiLabel.htmlToText("&#20108;&#26376;"),
    "MarchLong": BiLabel.htmlToText("&#19977;&#26376;"),
    "AprilLong": BiLabel.htmlToText("&#22235;&#26376;"),
    "MayLong": BiLabel.htmlToText("&#20116;&#26376;"),
    "JuneLong": BiLabel.htmlToText("&#20845;&#26376;"),
    "JulyLong": BiLabel.htmlToText("&#19971;&#26376;"),
    "AugustLong": BiLabel.htmlToText("&#20843;&#26376;"),
    "SeptemberLong": BiLabel.htmlToText("&#20061;&#26376;"),
    "OctoberLong": BiLabel.htmlToText("&#21313;&#26376;"),
    "NovemberLong": BiLabel.htmlToText("&#21313;&#19968;&#26376;"),
    "DecemberLong": BiLabel.htmlToText("&#21313;&#20108;&#26376;"),
    "Jan": BiLabel.htmlToText("&#19968;&#26376;"),
    "Feb": BiLabel.htmlToText("&#20108;&#26376;"),
    "Mar": BiLabel.htmlToText("&#19977;&#26376;"),
    "Apr": BiLabel.htmlToText("&#22235;&#26376;"),
    "May": BiLabel.htmlToText("&#20116;&#26376;"),
    "Jun": BiLabel.htmlToText("&#20845;&#26376;"),
    "Jul": BiLabel.htmlToText("&#19971;&#26376;"),
    "Aug": BiLabel.htmlToText("&#20843;&#26376;"),
    "Sep": BiLabel.htmlToText("&#20061;&#26376;"),
    "Oct": BiLabel.htmlToText("&#21313;&#26376;"),
    "Nov": BiLabel.htmlToText("&#21313;&#19968;&#26376;"),
    "Dec": BiLabel.htmlToText("&#21313;&#20108;&#26376;"),
    "Sunday": BiLabel.htmlToText("&#26143;&#26399;&#26085;"),
    "Monday": BiLabel.htmlToText("&#26143;&#26399;&#19968;"),
    "Tuesday": BiLabel.htmlToText("&#26143;&#26399;&#20108;"),
    "Wednesday": BiLabel.htmlToText("&#26143;&#26399;&#19977;"),
    "Thursday": BiLabel.htmlToText("&#26143;&#26399;&#22235;"),
    "Friday": BiLabel.htmlToText("&#26143;&#26399;&#20116;"),
    "Saturday": BiLabel.htmlToText("&#26143;&#26399;&#20845;"),
    "Sun": BiLabel.htmlToText("&#26143;&#26399;&#26085;"),
    "Mon": BiLabel.htmlToText("&#26143;&#26399;&#19968;"),
    "Tue": BiLabel.htmlToText("&#26143;&#26399;&#20108;"),
    "Wed": BiLabel.htmlToText("&#26143;&#26399;&#19977;"),
    "Thu": BiLabel.htmlToText("&#26143;&#26399;&#22235;"),
    "Fri": BiLabel.htmlToText("&#26143;&#26399;&#20116;"),
    "Sat": BiLabel.htmlToText("&#26143;&#26399;&#20845;"),
    "shortDateTimePattern": "yyyy/M/d a h:mm",
    "shortDatePattern": "yyyy/M/d",
    "shortTimePattern": "a h:mm",
    "mediumDateTimePattern": "yyyy/M/d a hh:mm:ss",
    "mediumDatePattern": "yyyy/M/d",
    "mediumTimePattern": "a hh:mm:ss",
    "longDateTimePattern": BiLabel.htmlToText("yyyy'&#24180;'M'&#26376;'d'&#26085;' ahh'&#26178;'mm'&#20998;'ss'&#31186;'"),
    "longDatePattern": BiLabel.htmlToText("yyyy'&#24180;'M'&#26376;'d'&#26085;'"),
    "longTimePattern": BiLabel.htmlToText("ahh'&#26178;'mm'&#20998;'ss'&#31186;'"),
    "firstWeekday": "0",
    "redWeekdays": "0",
    "localePatternChars": "GyMdkHmsSEDFwWahKzZ",
    "rightToLeft": "false"
});

function BiGridPanel(sRows, sCols, nHGap, nVGap) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    if (sRows != null) this.setRows(sRows);
    else this._rowsArray = []; if (sCols != null) this.setCols(sCols);
    else this._colsArray = []; if (nHGap != null) this._hGap = nHGap;
    if (nVGap != null) this._vGap = nVGap;
}
_p = _biExtend(BiGridPanel, BiComponent, "BiGridPanel");
_p._rows = "";
_p._cols = "";
_p._rowsCount = 0;
_p._colsCount = 0;
_p._hGap = 0;
_p._vGap = 0;
BiGridPanel.addProperty("hGap", BiAccessType.READ);
_p.setHGap = function (n) {
    if (this._hGap != n) {
        this._hGap = n;
        this.invalidateLayout();
    }
};
BiGridPanel.addProperty("vGap", BiAccessType.READ);
_p.setVGap = function (n) {
    if (this._vGap != n) {
        this._vGap = n;
        this.invalidateLayout();
    }
};
_p.getCols = function () {
    return this._cols;
};
_p.setCols = function (s) {
    s = String(s);
    if (this._cols != s) {
        this._cols = s;
        this._colsArray = this._parseWidths(s);
        this._colsCount = this._colsArray.length;
        this.invalidateLayout();
    }
};
_p.getRows = function () {
    return this._rows;
};
_p.setRows = function (s) {
    s = String(s);
    if (this._rows != s) {
        this._rows = s;
        this._rowsArray = this._parseWidths(s);
        this._rowsCount = this._rowsArray.length;
        this.invalidateLayout();
    }
};
_p.add = function () {
    BiComponent.prototype.add.apply(this, arguments);
    this.invalidateLayout();
};
_p.remove = function () {
    BiComponent.prototype.remove.apply(this, arguments);
    this.invalidateLayout();
};
_p.invalidateChild = function (oChild, sHint) {};
_p.setRightToLeft = function (b) {
    BiComponent.prototype.setRightToLeft.call(this, b);
    this.invalidateLayout();
};
_p._parseWidths = function (s) {
    var parts = s.split(",");
    var res = new Array(parts.length);
    for (var i = 0; i < parts.length; i++) res[i] = this._parseWidth(parts[i].trim());
    return res;
};
_p._parseWidth = function (s) {
    var obj = {};
    if (s == "*") {
        obj.type = "*";
        obj.value = 1;
    } else {
        if (s.indexOf("*") != -1) obj.type = "*";
        else if (s.indexOf("%") != -1) obj.type = "%";
        else if (s.indexOf("-") != -1) obj.type = "-";
        else obj.type = "";
        obj.value = parseFloat(s.replace(/\*|\%|-/g, ""));
        obj.value = isNaN(obj.value) ? 0 : obj.value;
    }
    return obj;
};
BiGridPanel._getFixedSizes = function (nAvailWidth, nItems, oSizes) {
    var sizeLength = oSizes.length;
    var fixedWidths = 0,
        osi;
    for (var i = 0; i < nItems && i < sizeLength; i++) {
        osi = oSizes[i];
        osi.effValue = osi.type == "%" ? nAvailWidth * osi.value / 100 : Number(osi.value);
        if (osi.type != "*") {
            if (osi.minimum != null) osi.effValue = Math.max(osi.minimum, osi.effValue);
            if (osi.maximum != null) osi.effValue = Math.min(osi.maximum, osi.effValue);
            fixedWidths += osi.effValue;
        }
    }
    var flexWidths = 0;
    for (i = 0; i < nItems; i++) {
        if (i >= sizeLength) flexWidths++;
        else if (oSizes[i].type == "*") {
            flexWidths += oSizes[i].effValue;
        }
    }
    var flexBase = Math.max(0, flexWidths != 0 ? (nAvailWidth - fixedWidths) / flexWidths : 0);
    var res = new Array(nItems);
    var oddSize = new Array(nItems);
    var floorSum = 0;
    var v, floorV;
    for (i = 0; i < nItems; i++) {
        if (i >= sizeLength) {
            v = flexBase;
        } else {
            osi = oSizes[i];
            if (osi.type == "" || osi.type == "%" || osi.type == "-") {
                v = osi.effValue;
            } else if (osi.type == "*") {
                v = flexBase * osi.effValue;
                if (osi.minimum != null) v = Math.max(osi.minimum, v);
                if (osi.maximum != null) v = Math.min(osi.maximum, v);
            }
        }
        floorV = Math.floor(v);
        res[i] = floorV;
        floorSum += floorV;
        oddSize[i] = v - floorV;
    }
    var oddsSum = nAvailWidth - floorSum;
    for (i = 0; i < nItems; i++) {
        if (oddsSum <= 0) break;
        if (oddSize[i] != 0) {
            res[i]++;
            oddsSum--;
        }
    }
    return res;
};
_p._getColsRowsCount = function () {
    var cs = this._children;
    var l = cs.length;
    var cols, rows;
    if (this._colsCount != 0) {
        cols = this._colsCount;
        rows = Math.ceil(l / cols);
    } else if (this._rowsCount != 0) {
        rows = this._rowsCount;
        cols = Math.ceil(l / rows);
    } else {
        cols = 1;
        rows = l;
    }
    return {
        cols: cols,
        rows: rows
    };
};
_p.layoutAllChildren = function () {
    var cs = this._children;
    var l = cs.length;
    var o = this._getColsRowsCount();
    var cols = o.cols;
    var rows = o.rows;
    var w = this.getClientWidth();
    var h = this.getClientHeight();
    var availWidth = w - (cols - 1) * this._hGap;
    var availHeight = h - (rows - 1) * this._vGap;
    var i, j;
    for (i = 0; i < this._colsArray.length; i++) {
        if (this._colsArray[i].type == "-" || this._colsArray[i].value.toString() == "NaN") {
            var pw = 0;
            for (j = i; j < l; j += cols) pw = Math.max(pw, cs[j].getPreferredWidth());
            this._colsArray[i].value = pw;
        }
    }
    for (i = 0; i < this._rowsArray.length; i++) {
        if (this._rowsArray[i].type == "-" || this._rowsArray[i].value.toString() == "NaN") {
            var ph = 0;
            for (j = i * cols; j < i * cols + cols && j < l; j++) ph = Math.max(ph, cs[j].getPreferredHeight());
            this._rowsArray[i].value = ph;
        }
    }
    var colSizes = BiGridPanel._getFixedSizes(availWidth, cols, this._colsArray);
    var rowSizes = BiGridPanel._getFixedSizes(availHeight, rows, this._rowsArray);
    var x = 0;
    var y = 0;
    var w2, h2, changed;
    var rtl = this.getRightToLeft();
    for (i = 0; i < l; i++) {
        if (i % cols == 0) x = 0;
        if (i > 0 && i % cols == 0) y += h2 + this._vGap;
        w2 = colSizes[i % cols];
        h2 = rowSizes[Math.floor(i / cols)];
        changed = rtl ? this._layoutChild2(cs[i], w - w2 - x, y, w2, h2) : this._layoutChild2(cs[i], x, y, w2, h2);
        x += w2 + this._hGap;
        if (changed) cs[i].invalidateLayout();
    }
    this._invalidLayout = false;
};
_p._computePreferredWidth = function () {
    return this._getSizeHelperX("Preferred", "max");
};
_p._computePreferredHeight = function () {
    return this._getSizeHelperY("Preferred", "max");
};
_p.getMinimumWidth = function () {
    if (this._minimumWidth != null) return this._minimumWidth;
    return this._getSizeHelperX("Minimum", "max");
};
_p.getMinimumHeight = function () {
    if (this._minimumHeight != null) return this._minimumHeight;
    return this._getSizeHelperY("Minimum", "max");
};
_p.getMaximumWidth = function () {
    if (this._maximumWidth != null) return this._maximumWidth;
    return this._getSizeHelperX("Maximum", "min");
};
_p.getMaximumHeight = function () {
    if (this._maximumHeight != null) return this._maximumHeight;
    return this._getSizeHelperY("Maximum", "min");
};
_p._getSizeHelperX = function (sType, sMax) {
    var cs = this._children;
    var l = cs.length;
    var o = this._getColsRowsCount();
    var cols = o.cols;
    var item;
    var colWidths = new Array(cols);
    var flexWidths = new Array(cols);
    for (var i = 0; i < cols; i++) {
        colWidths[i] = flexWidths[i] = sMax == "max" ? 0 : Infinity;
    }
    var w;
    var x;
    var width;
    for (i = 0; i < l; i++) {
        x = i % cols;
        item = this._colsArray[x];
        if (!item) {
            width = cs[i]["get" + sType + "Width"]();
            flexWidths[x] = Math[sMax](flexWidths[x], width);
        } else if (item.type == "*") {
            width = cs[i]["get" + sType + "Width"]();
            flexWidths[x] = Math[sMax](flexWidths[x], width / item.value);
        }
    }
    var flexPref = sMax == "max" ? 0 : Infinity;
    for (i = 0; i < cols; i++) {
        flexPref = Math[sMax](flexWidths[i], flexPref);
    }
    for (i = 0; i < l; i++) {
        x = i % cols;
        item = this._colsArray[x];
        if (!item) w = flexPref;
        else if (item.type == "") w = item.value;
        else if (item.type == "*") w = flexPref * item.value;
        else w = cs[i]["get" + sType + "Width"]();
        colWidths[x] = Math[sMax](colWidths[x], w);
    }
    var sum = (cols - 1) * this._hGap;
    for (i = 0; i < cols; i++) {
        sum += colWidths[i];
    }
    return sum + this.getInsetLeft() + this.getInsetRight();
};
_p._getSizeHelperY = function (sType, sMax) {
    var cs = this._children;
    var l = cs.length;
    var o = this._getColsRowsCount();
    var cols = o.cols;
    var rows = o.rows;
    var item;
    var rowHeights = new Array(rows);
    var flexHeights = new Array(rows);
    for (var i = 0; i < rows; i++) {
        rowHeights[i] = flexHeights[i] = sMax == "max" ? 0 : Infinity;
    }
    var h;
    var y;
    var height;
    for (i = 0; i < l; i++) {
        y = Math.floor(i / cols);
        item = this._rowsArray[y];
        if (!item) {
            height = cs[i]["get" + sType + "Height"]();
            flexHeights[y] = Math[sMax](flexHeights[y], height);
        } else if (item.type == "*") {
            height = cs[i]["get" + sType + "Height"]();
            flexHeights[y] = Math[sMax](flexHeights[y], height / item.value);
        }
    }
    var flexPref = sMax == "max" ? 0 : Infinity;
    for (i = 0; i < rows; i++) {
        flexPref = Math[sMax](flexHeights[i], flexPref);
    }
    for (i = 0; i < l; i++) {
        y = Math.floor(i / cols);
        item = this._rowsArray[y];
        if (!item) h = flexPref;
        else if (item && item.type == "") h = item.value;
        else if (item.type == "*") h = flexPref * item.value;
        else h = cs[i]["get" + sType + "Height"]();
        rowHeights[y] = Math[sMax](rowHeights[y], h);
    }
    var sum = (rows - 1) * this._vGap;
    for (i = 0; i < rows; i++) {
        sum += rowHeights[i];
    }
    return sum + this.getInsetTop() + this.getInsetBottom();
};

function BiDockPanel() {
    if (_biInPrototype) return;
    BiComponent.call(this);
}
_p = _biExtend(BiDockPanel, BiComponent, "BiDockPanel");
BiDockPanel._dockProperties = {};
BiDockPanel.setDock = function (oSource, sDock) {
    this._dockProperties[oSource.toHashCode()] = sDock;
};
BiDockPanel.getDock = function (oSource) {
    return this._dockProperties[oSource.toHashCode()];
};
_p.add = function () {
    BiComponent.prototype.add.apply(this, arguments);
    this.invalidateLayout();
};
_p.remove = function () {
    BiComponent.prototype.remove.apply(this, arguments);
    this.invalidateLayout();
};
_p.invalidateChild = function (oChild, sHint) {
    if (sHint == null || sHint == "size" || sHint == "preferred") {
        this.invalidateLayout();
        this._invalidateChild(oChild, sHint);
    }
};
_p.layoutAllChildren = function () {
    var rect = {
        width: this.getClientWidth(),
        height: this.getClientHeight(),
        left: 0,
        top: 0
    };
    var cs = this._children;
    var l = cs.length;
    var dock, ml, mr, mt, mb, mw, mh, ph, pw, x, y, w, h;
    for (var i = 0; i < l; i++) {
        if (!cs[i].getCreated() || !cs[i].getVisible()) continue;
        dock = BiDockPanel.getDock(cs[i]) || "top";
        ml = cs[i].getMarginLeft();
        mr = cs[i].getMarginRight();
        mt = cs[i].getMarginTop();
        mb = cs[i].getMarginBottom();
        mw = ml + mr;
        mh = mt + mb;
        switch (dock) {
        case "fill":
            pw = Math.max(0, rect.width - mw);
            ph = Math.max(0, rect.height - mh);
            x = rect.left + ml;
            y = rect.top + mt;
            w = pw;
            h = ph;
            rect.width = 0;
            rect.height = 0;
            break;
        case "left":
            pw = Math.max(0, Math.min(cs[i].getPreferredWidth(), rect.width - mw));
            x = rect.left + ml;
            y = rect.top + mt;
            w = pw;
            h = rect.height - mh;
            rect.width -= pw + mw;
            rect.left += pw + mw;
            break;
        case "right":
            pw = Math.max(0, Math.min(cs[i].getPreferredWidth(), rect.width - mw));
            x = rect.left + rect.width - pw - mr;
            y = rect.top + mt;
            w = pw;
            h = rect.height - mh;
            rect.width -= pw + mw;
            break;
        case "top":
            ph = Math.max(0, Math.min(cs[i].getPreferredHeight(), rect.height - mh));
            x = rect.left + ml;
            y = rect.top + mt;
            w = rect.width - mw;
            h = ph;
            rect.height -= ph + mh;
            rect.top += ph + mh;
            break;
        case "bottom":
            ph = Math.max(0, Math.min(cs[i].getPreferredHeight(), rect.height - mh));
            x = rect.left + ml;
            y = rect.top + rect.height - ph - mb;
            w = rect.width - mw;
            h = ph;
            rect.height -= ph + mh;
            break;
        }
        var changed = this._layoutChild2(cs[i], x, y, w, h);
        if (changed) cs[i].invalidateLayout();
    }
    this._invalidLayout = false;
};
_p._computePreferredWidth = function () {
    return this.getInsetLeft() + this.getInsetRight() + this._recursiveSizeHelper(0, "max", "Preferred", true);
};
_p._computePreferredHeight = function () {
    return this.getInsetTop() + this.getInsetBottom() + this._recursiveSizeHelper(0, "max", "Preferred", false);
};
_p.getMinimumWidth = function () {
    if (this._minimumWidth != null) return this._minimumWidth;
    return this.getInsetLeft() + this.getInsetRight() + this._recursiveSizeHelper(0, "max", "Minimum", true);
};
_p.getMinimumHeight = function () {
    if (this._minimumHeight != null) return this._minimumHeight;
    return this.getInsetTop() + this.getInsetBottom() + this._recursiveSizeHelper(0, "max", "Minimum", false);
};
_p.getMaximumWidth = function () {
    if (this._maximumWidth != null) return this._maximumWidth;
    return this.getInsetLeft() + this.getInsetRight() + this._recursiveSizeHelper(0, "min", "Maximum", true);
};
_p.getMaximumHeight = function () {
    if (this._maximumHeight != null) return this._maximumHeight;
    return this.getInsetTop() + this.getInsetBottom() + this._recursiveSizeHelper(0, "min", "Maximum", false);
};
_p._recursiveSizeHelper = function (i, sMax, sType, bWidth) {
    var cs = this._children;
    var l = cs.length;
    if (i < l) {
        if (!cs[i].getCreated() || !cs[i].getVisible()) return this._recursiveSizeHelper(i + 1, sMax, sType, bWidth);
        var dock = BiDockPanel.getDock(cs[i]) || "top";
        var w;
        if (bWidth) {
            w = cs[i]["get" + sType + "Width"]() + cs[i].getMarginLeft() + cs[i].getMarginRight();
        } else {
            w = cs[i]["get" + sType + "Height"]() + cs[i].getMarginTop() + cs[i].getMarginBottom();
        }
        switch (dock) {
        case "fill":
            return w;
        case "left":
        case "right":
            if (bWidth) return w + this._recursiveSizeHelper(i + 1, sMax, sType, bWidth);
            else return Math[sMax](w, this._recursiveSizeHelper(i + 1, sMax, sType, bWidth));
        case "top":
        case "bottom":
            if (bWidth) return Math[sMax](w, this._recursiveSizeHelper(i + 1, sMax, sType, bWidth));
            else return w + this._recursiveSizeHelper(i + 1, sMax, sType, bWidth);
        }
    }
    return sMax == "max" ? 0 : Infinity;
};

function BiBox(sOrient, sAlign, sPack) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    if (sOrient) this._orient = sOrient;
    if (sAlign) this._align = sAlign;
    if (sPack) this._pack = sPack;
}
_p = _biExtend(BiBox, BiComponent, "BiBox");
_p._orient = "horizontal";
_p._align = "stretch";
_p._pack = "start";
BiBox._flexProperties = {};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponent.prototype.dispose.call(this);
    this._orient = null;
    this._align = null;
    this._pack = null;
};
BiBox.setFlex = function (oSource, nFlex) {
    this._flexProperties[oSource.toHashCode()] = Math.max(0, nFlex);
};
BiBox.getFlex = function (oSource) {
    return this._flexProperties[oSource.toHashCode()];
};
BiBox.addProperty("orient", BiAccessType.READ);
_p.setOrient = function (s) {
    if (this._orient != s) {
        this._orient = s;
        this.invalidateLayout();
    }
};
BiBox.addProperty("align", BiAccessType.READ);
_p.setAlign = function (s) {
    if (this._align != s) {
        this._align = s;
        this.invalidateLayout();
    }
};
BiBox.addProperty("pack", BiAccessType.READ);
_p.setPack = function (s) {
    if (this._pack != s) {
        this._pack = s;
        this.invalidateLayout();
    }
};
_p.layoutAllChildren = function () {
    if (this._orient == "horizontal") this._hBoxLayout();
    else this._vBoxLayout();
    this._invalidLayout = false;
};
_p._hBoxLayout = function () {
    var cs = this._children;
    var l = cs.length;
    var cw = this.getClientWidth();
    var ch = this.getClientHeight();
    var availWidth = cw;
    var layoutHints = [];
    var flex;
    for (var i = 0; i < l; i++) {
        if (!cs[i].getVisible()) continue;
        if (!cs[i].getCreated()) {
            this.invalidateLayout();
            return;
        }
        flex = BiBox.getFlex(cs[i]) || 0;
        layoutHints.push({
            value: flex != 0 ? flex : cs[i].getPreferredWidth(),
            type: flex != 0 ? "*" : "",
            minimum: cs[i].getMinimumWidth(),
            maximum: cs[i].getMaximumWidth()
        });
    }
    var lastMargin = 0;
    for (i = 0; i < l; i++) {
        if (!cs[i].getVisible()) continue;
        availWidth -= Math.max(lastMargin, cs[i].getMarginLeft());
        lastMargin = cs[i].getMarginRight();
    }
    availWidth -= lastMargin;
    var sizes = BiGridPanel._getFixedSizes(availWidth, layoutHints.length, layoutHints);
    var startX = 0;
    var x, y, w, h;
    if (this._pack != "start") {
        var sizeSum = 0;
        for (i = 0; i < layoutHints.length; i++) {
            sizeSum += sizes[i];
        }
        if (this._pack == "end") startX = availWidth - sizeSum;
        else startX = Math.floor((availWidth - sizeSum) / 2);
        startX = Math.max(0, startX);
    }
    x = startX;
    var rtl = this.getRightToLeft();
    lastMargin = 0;
    var mt, mb, changed;
    var j = 0;
    for (i = 0; i < l; i++) {
        if (!cs[i].getVisible()) continue;
        w = sizes[j];
        mt = cs[i].getMarginTop();
        mb = cs[i].getMarginBottom();
        switch (this._align) {
        case "center":
        case "start":
        case "end":
            h = cs[i].getPreferredHeight();
            break;
        case "stretch":
        default:
            h = ch - mt - mb;
            break;
        }
        h = Math.max(cs[i].getMinimumHeight(), Math.min(cs[i].getMaximumHeight(), h));
        switch (this._align) {
        case "center":
            y = mt + Math.floor((ch - h - mt - mb) / 2);
            break;
        case "end":
            y = ch - h - mb;
            break;
        case "start":
        case "stretch":
        default:
            y = mt;
            break;
        }
        y = Math.max(mt, y);
        x += Math.max(lastMargin, cs[i].getMarginLeft());
        if (rtl) changed = this._layoutChild2(cs[i], cw - w - x, y, w, h);
        else changed = this._layoutChild2(cs[i], x, y, w, h);
        x += w;
        lastMargin = cs[i].getMarginRight();
        if (changed) cs[i].invalidateLayout();
        j++;
    }
    if (cw != this.getClientWidth() || ch != this.getClientHeight()) {
        if (arguments.callee.caller != arguments.callee.caller.caller) {
            this._hBoxLayout();
        }
    }
};
_p._vBoxLayout = function () {
    var cs = this._children;
    var l = cs.length;
    var cw = this.getClientWidth();
    var ch = this.getClientHeight();
    var availHeight = ch;
    var layoutHints = [];
    var flex;
    for (var i = 0; i < l; i++) {
        if (!cs[i].getVisible()) continue;
        if (!cs[i].getCreated()) {
            this.invalidateLayout();
            return;
        }
        flex = BiBox.getFlex(cs[i]) || 0;
        layoutHints.push({
            value: flex != 0 ? flex : cs[i].getPreferredHeight(),
            type: flex != 0 ? "*" : "",
            minimum: cs[i].getMinimumHeight(),
            maximum: cs[i].getMaximumHeight()
        });
    }
    var lastMargin = 0;
    for (i = 0; i < l; i++) {
        if (!cs[i].getVisible()) continue;
        availHeight -= Math.max(lastMargin, cs[i].getMarginTop());
        lastMargin = cs[i].getMarginBottom();
    }
    availHeight -= lastMargin;
    var sizes = BiGridPanel._getFixedSizes(availHeight, layoutHints.length, layoutHints);
    var startY = 0;
    var x, y, w, h;
    if (this._pack != "start") {
        var sizeSum = 0;
        for (i = 0; i < layoutHints.length; i++) {
            sizeSum += sizes[i];
        }
        if (this._pack == "end") startY = availHeight - sizeSum;
        else startY = Math.floor((availHeight - sizeSum) / 2);
        startY = Math.max(0, startY);
    }
    y = startY;
    lastMargin = 0;
    var ml, mr, changed;
    var j = 0;
    for (i = 0; i < l; i++) {
        if (!cs[i].getVisible()) continue;
        h = sizes[j];
        ml = cs[i].getMarginLeft();
        mr = cs[i].getMarginRight();
        switch (this._align) {
        case "center":
        case "start":
        case "end":
            w = cs[i].getPreferredWidth();
            break;
        default:
            w = cw - ml - mr;
            break;
        }
        w = Math.max(cs[i].getMinimumWidth(), Math.min(cs[i].getMaximumWidth(), w));
        switch (this._align) {
        case "center":
            x = ml + Math.floor((cw - w - ml - mr) / 2);
            break;
        case "end":
            x = cw - w - mr;
            break;
        default:
            x = ml;
            break;
        }
        x = Math.max(ml, x);
        y += Math.max(lastMargin, cs[i].getMarginTop());
        changed = this._layoutChild2(cs[i], x, y, w, h);
        y += h;
        lastMargin = cs[i].getMarginBottom();
        if (changed) cs[i].invalidateLayout();
        j++;
    }
    if (cw != this.getClientWidth() || ch != this.getClientHeight()) {
        if (arguments.callee.caller != arguments.callee.caller.caller) {
            this._vBoxLayout();
        }
    }
};
_p.add = function () {
    BiComponent.prototype.add.apply(this, arguments);
    this.invalidateLayout();
};
_p.remove = function () {
    BiComponent.prototype.remove.apply(this, arguments);
    this.invalidateLayout();
};
_p.invalidateChild = function (oChild, sHint) {
    this.invalidateParentLayout("preferred");
    this.invalidateLayout();
    this._invalidateChild(oChild, sHint);
};
_p.setRightToLeft = function (b) {
    BiComponent.prototype.setRightToLeft.call(this, b);
    this.invalidateLayout();
};
_p.getMinimumWidth = function () {
    if (this._minimumWidth != null) return this._minimumWidth;
    var cs = this._children;
    var l = cs.length;
    var res;
    if (this._orient == "vertical") {
        var max = 0;
        for (var i = 0; i < l; i++) {
            if (cs[i].getCreated() && cs[i].getVisible()) {
                max = Math.max(max, Math.min(cs[i].getMinimumWidth(), cs[i].getMaximumWidth()) + cs[i].getMarginLeft() + cs[i].getMarginRight());
            }
        }
        res = max;
    } else {
        var sum = 0;
        var lastMargin = 0;
        for (i = 0; i < l; i++) {
            if (cs[i].getCreated() && cs[i].getVisible()) {
                sum += Math.max(cs[i].getMarginLeft(), lastMargin) + Math.min(cs[i].getMinimumWidth(), cs[i].getMaximumWidth());
                lastMargin = cs[i].getMarginRight();
            }
        }
        res = sum + lastMargin;
    }
    return res + this.getInsetLeft() + this.getInsetRight();
};
_p.getMinimumHeight = function () {
    if (this._minimumHeight != null) return this._minimumHeight;
    var cs = this._children;
    var l = cs.length;
    var res;
    if (this._orient == "horizontal") {
        var max = 0;
        for (var i = 0; i < l; i++) {
            if (cs[i].getCreated() && cs[i].getVisible()) {
                max = Math.max(max, Math.min(cs[i].getMinimumHeight(), cs[i].getMaximumHeight()) + cs[i].getMarginTop() + cs[i].getMarginBottom());
            }
        }
        res = max;
    } else {
        var sum = 0;
        var lastMargin = 0;
        for (i = 0; i < l; i++) {
            if (cs[i].getCreated() && cs[i].getVisible()) {
                sum += Math.max(cs[i].getMarginTop(), lastMargin) + Math.min(cs[i].getMinimumHeight(), cs[i].getMaximumHeight());
                lastMargin = cs[i].getMarginBottom();
            }
        }
        res = sum + lastMargin;
    }
    return res + this.getInsetTop() + this.getInsetBottom();
};
_p.getMaximumWidth = function () {
    if (this._maximumWidth != null) return this._maximumWidth;
    var cs = this._children;
    var l = cs.length;
    var res;
    if (this._orient == "vertical") {
        var min = Infinity;
        for (var i = 0; i < l; i++) {
            if (cs[i].getCreated() && cs[i].getVisible()) {
                min = Math.min(min, cs[i].getMaximumWidth() + cs[i].getMarginLeft() + cs[i].getMarginRight());
            }
        }
        res = min;
    } else {
        var sum = (l == 0 ? Infinity : 0);
        var lastMargin = 0;
        for (i = 0; i < l && sum < Infinity; i++) {
            if (cs[i].getCreated() && cs[i].getVisible()) {
                sum += Math.max(cs[i].getMarginLeft(), lastMargin) + cs[i].getMaximumWidth();
                lastMargin = cs[i].getMarginRight();
            }
        }
        res = sum + lastMargin;
    }
    return res + this.getInsetLeft() + this.getInsetRight();
};
_p.getMaximumHeight = function () {
    if (this._maximumHeight != null) return this._maximumHeight;
    var cs = this._children;
    var l = cs.length;
    var res;
    if (this._orient == "horizontal") {
        var min = Infinity;
        for (var i = 0; i < l; i++) {
            if (cs[i].getCreated() && cs[i].getVisible()) {
                min = Math.min(min, cs[i].getMaximumHeight() + cs[i].getMarginTop() + cs[i].getMarginBottom());
            }
        }
        res = min;
    } else {
        var sum = (l == 0 ? Infinity : 0);
        var lastMargin = 0;
        for (i = 0; i < l && sum < Infinity; i++) {
            if (cs[i].getCreated() && cs[i].getVisible()) {
                sum += Math.max(cs[i].getMarginTop(), lastMargin) + cs[i].getMaximumHeight();
                lastMargin = cs[i].getMarginBottom();
            }
        }
        res = sum + lastMargin;
    }
    return res + this.getInsetTop() + this.getInsetBottom();
};
_p._computePreferredWidth = function () {
    var cs = this._children;
    var l = cs.length;
    var res;
    if (this._orient == "vertical") {
        var max = 0;
        for (var i = 0; i < l; i++) {
            if (cs[i].getCreated() && cs[i].getVisible()) {
                pw = Math.min(cs[i].getMaximumWidth(), Math.max(cs[i].getPreferredWidth(), cs[i].getMinimumWidth()));
                max = Math.max(max, pw + cs[i].getMarginLeft() + cs[i].getMarginRight());
            }
        }
        res = max;
    } else {
        var sum = 0,
            pw;
        var lastMargin = 0;
        for (i = 0; i < l; i++) {
            if (cs[i].getCreated() && cs[i].getVisible()) {
                pw = Math.min(cs[i].getMaximumWidth(), Math.max(cs[i].getPreferredWidth(), cs[i].getMinimumWidth()));
                sum += Math.max(cs[i].getMarginLeft(), lastMargin) + pw;
                lastMargin = cs[i].getMarginRight();
            }
        }
        res = sum + lastMargin;
    }
    return res + this.getInsetLeft() + this.getInsetRight();
};
_p._computePreferredHeight = function () {
    var cs = this._children;
    var l = cs.length;
    var res, ph;
    if (this._orient == "horizontal") {
        var max = 0;
        for (var i = 0; i < l; i++) {
            if (cs[i].getCreated() && cs[i].getVisible()) {
                ph = Math.min(cs[i].getMaximumHeight(), Math.max(cs[i].getPreferredHeight(), cs[i].getMinimumHeight()));
                max = Math.max(max, ph + cs[i].getMarginTop() + cs[i].getMarginBottom());
            }
        }
        res = max;
    } else {
        var sum = 0;
        var lastMargin = 0;
        for (i = 0; i < l; i++) {
            if (cs[i].getCreated() && cs[i].getVisible()) {
                ph = Math.min(cs[i].getMaximumHeight(), Math.max(cs[i].getPreferredHeight(), cs[i].getMinimumHeight()));
                sum += Math.max(cs[i].getMarginTop(), lastMargin) + ph;
                lastMargin = cs[i].getMarginBottom();
            }
        }
        res = sum + lastMargin;
    }
    return res + this.getInsetTop() + this.getInsetBottom();
};

function BiHBox(sAlign, sPack) {
    if (_biInPrototype) return;
    BiBox.call(this, "horizontal", sAlign, sPack);
}
_p = _biExtend(BiHBox, BiBox, "BiHBox");
BiHBox.setFlex = function (oSource, nFlex) {
    BiBox.setFlex(oSource, nFlex);
};
BiHBox.getFlex = function (oSource) {
    return BiBox.getFlex(oSource);
};

function BiVBox(sAlign, sPack) {
    if (_biInPrototype) return;
    BiBox.call(this, "vertical", sAlign, sPack);
}
_p = _biExtend(BiVBox, BiBox, "BiVBox");
BiVBox.setFlex = function (oSource, nFlex) {
    BiBox.setFlex(oSource, nFlex);
};
BiVBox.getFlex = function (oSource) {
    return BiBox.getFlex(oSource);
};

function BiFlowPanel(sAlign) {
    if (_biInPrototype) return;
    BiComponent.call(this);
}
_p = _biExtend(BiFlowPanel, BiComponent, "BiFlowPanel");
_p._align = "start";
_p._vAlign = "start";
_p._baselineAlign = "center";
_p._wrap = true;
BiFlowPanel._baselineAlignProperties = {};
BiFlowPanel.setBaselineAlign = function (oSource, sAlign) {
    this._baselineAlignProperties[oSource.toHashCode()] = sAlign;
};
BiFlowPanel.getBaselineAlign = function (oSource) {
    return this._baselineAlignProperties[oSource.toHashCode()];
};
BiFlowPanel.addProperty("align", BiAccessType.READ);
_p.setAlign = function (s) {
    if (this._align != s) {
        this._align = s;
        this.invalidateLayout();
    }
};
BiFlowPanel.addProperty("vAlign", BiAccessType.READ);
_p.setVAlign = function (s) {
    if (this._vAlign != s) {
        this._vAlign = s;
        this.invalidateLayout();
    }
};
BiFlowPanel.addProperty("baselineAlign", BiAccessType.READ);
_p.setBaselineAlign = function (s) {
    if (this._baselineAlign != s) {
        this._baselineAlign = s;
        this.invalidateLayout();
    }
};
BiFlowPanel.addProperty("wrap", BiAccessType.READ);
_p.setWrap = function (b) {
    if (this._wrap != b) {
        this._wrap = b;
        this.invalidateLayout();
    }
};
_p.layoutAllChildren = function () {
    var cs = this._children;
    var l = cs.length;
    var cw = this.getClientWidth();
    var ch = this.getClientHeight();
    var lines = [];
    var x = 0;
    var y = 0;
    var lastMargin = 0;
    var pw, ph, dml, ml, mr, mt, mb, minH, maxH, minW, maxW, item;
    var linesSum = 0;
    for (var i = 0; i < l; i++) {
        if (!cs[i].getCreated() || !cs[i].getVisible()) continue;
        minW = cs[i].getMinimumWidth();
        maxW = cs[i].getMaximumWidth();
        pw = cs[i].getPreferredWidth();
        pw = Math.max(minW, Math.min(maxW, pw));
        if (pw <= 0) continue;
        ph = cs[i].getPreferredHeight();
        minH = cs[i].getMinimumHeight();
        maxH = cs[i].getMaximumHeight();
        ml = cs[i].getMarginLeft();
        mr = cs[i].getMarginRight();
        mt = cs[i].getMarginTop();
        mb = cs[i].getMarginBottom();
        dml = Math.max(lastMargin, ml);
        item = {
            left: dml,
            component: cs[i],
            width: pw,
            height: Math.max(minH, Math.min(maxH, ph))
        };
        if (x == 0) {
            lines[y] = {
                width: 0,
                items: [],
                prefHeight: 0,
                maxHeight: Infinity,
                minHeight: 0
            };
            lines[y].items.push(item);
            lines[y].width += Math.max(lastMargin, ml) + item.width;
            lastMargin = mr;
            x++;
        } else if (!this._wrap || lines[y].width + dml + pw + mr <= cw) {
            item.left += lines[y].width;
            lines[y].items.push(item);
            lines[y].width += Math.max(lastMargin, ml) + item.width;
            lastMargin = mr;
            x++;
        } else {
            lines[y].width += lastMargin;
            linesSum += lines[y].prefHeight;
            lastMargin = 0;
            y++;
            x = 1;
            lines[y] = {
                width: 0,
                items: [],
                prefHeight: 0,
                maxHeight: Infinity,
                minHeight: 0
            };
            item.left = ml;
            lines[y].items.push(item);
            lines[y].width += Math.max(lastMargin, ml) + item.width;
            lastMargin = mr;
        }
        lines[y].minHeight = Math.max(lines[y].minHeight, minH + mt + mb);
        lines[y].maxHeight = Math.min(lines[y].maxHeight, maxH + mt + mb);
        lines[y].prefHeight = Math.min(Math.max(ph + mt + mb, lines[y].prefHeight, lines[y].minHeight), lines[y].maxHeight);
    }
    if (lines[y]) {
        lines[y].width += lastMargin;
        linesSum += lines[y].prefHeight;
    }
    var left;
    var top = 0,
        dTop, c;
    var rtl = this.getRightToLeft();
    var changed;
    switch (this._vAlign) {
    case "center":
        top = Math.max(0, (ch - linesSum) / 2);
        break;
    case "end":
    case "bottom":
        top = Math.max(0, ch - linesSum);
        break;
    }
    for (y = 0; y < lines.length; y++) {
        left = 0;
        switch (this._align) {
        case "center":
            left = Math.max(0, Math.floor((cw - lines[y].width) / 2));
            break;
        case "end":
        case "right":
            left = Math.max(0, cw - lines[y].width);
            break;
        }
        for (x = 0; x < lines[y].items.length; x++) {
            item = lines[y].items[x];
            c = item.component;
            mt = c.getMarginTop();
            mb = c.getMarginBottom();
            switch (BiFlowPanel.getBaselineAlign(c) || this.getBaselineAlign()) {
            case "center":
                dTop = Math.max(0, Math.floor((lines[y].prefHeight - item.height - mt - mb) / 2));
                break;
            case "end":
            case "bottom":
                dTop = Math.max(0, lines[y].prefHeight - item.height - mt - mb);
                break;
            default:
                dTop = 0;
            }
            dTop += mt;
            if (rtl) changed = this._layoutChild2(c, cw - item.width - left - item.left, top + dTop, item.width, item.height);
            else changed = this._layoutChild2(c, left + item.left, top + dTop, item.width, item.height); if (changed) c.invalidateLayout();
        }
        top += lines[y].prefHeight;
    }
    this._invalidLayout = false;
    if (cw != this.getClientWidth() || ch != this.getClientHeight()) {
        if (arguments.callee.caller != arguments.callee.caller.caller) {
            this.layoutAllChildren();
        }
    }
};
_p.add = function () {
    BiComponent.prototype.add.apply(this, arguments);
    this.invalidateLayout();
};
_p.remove = function () {
    BiComponent.prototype.remove.apply(this, arguments);
    this.invalidateLayout();
};
_p.invalidateChild = function (oChild, sHint) {
    this.invalidateLayout();
    this._invalidateChild(oChild, sHint);
};
_p.setRightToLeft = function (b) {
    BiComponent.prototype.setRightToLeft.call(this, b);
    this.invalidateLayout();
};
_p.getMinimumWidth = function () {
    if (this._minimumWidth != null) return this._minimumWidth;
    var cs = this._children;
    var l = cs.length;
    var sum = 0;
    var lastMargin = 0;
    for (var i = 0; i < l; i++) {
        if (!cs[i].getCreated() || !cs[i].getVisible()) continue;
        sum += Math.max(lastMargin, cs[i].getMarginLeft()) + cs[i].getMinimumWidth();
        lastMargin = cs[i].getMarginRight();
    }
    sum += lastMargin;
    return this.getInsetLeft() + this.getInsetRight() + sum;
};
_p.getMaximumWidth = function () {
    if (this._maximumWidth != null) return this._maximumWidth;
    var cs = this._children;
    var l = cs.length;
    var sum = 0;
    var lastMargin = 0;
    for (var i = 0; i < l; i++) {
        if (!cs[i].getCreated() || !cs[i].getVisible()) continue;
        sum += Math.max(lastMargin, cs[i].getMarginLeft()) + cs[i].getMaximumWidth();
        lastMargin = cs[i].getMarginRight();
    }
    sum += lastMargin;
    return this.getInsetLeft() + this.getInsetRight() + sum;
};
_p._computePreferredWidth = function () {
    var cs = this._children;
    var l = cs.length;
    var sum = 0;
    var lastMargin = 0;
    for (var i = 0; i < l; i++) {
        if (!cs[i].getCreated() || !cs[i].getVisible()) continue;
        sum += Math.max(lastMargin, cs[i].getMarginLeft()) + cs[i].getPreferredWidth();
        lastMargin = cs[i].getMarginRight();
    }
    sum += lastMargin;
    return this.getInsetLeft() + this.getInsetRight() + sum;
};
_p.getMinimumHeight = function () {
    if (this._minimumHeight != null) return this._minimumHeight;
    var cs = this._children;
    var l = cs.length;
    var max = 0;
    for (var i = 0; i < l; i++) {
        if (!cs[i].getCreated() || !cs[i].getVisible()) continue;
        max = Math.max(max, cs[i].getMarginTop() + cs[i].getMinimumHeight() + cs[i].getMarginBottom());
    }
    return this.getInsetTop() + this.getInsetBottom() + max;
};
_p.getMaximumHeight = function () {
    if (this._maximumHeight != null) return this._maximumHeight;
    var cs = this._children;
    var l = cs.length;
    var min = Infinity;
    for (var i = 0; i < l; i++) {
        if (!cs[i].getCreated() || !cs[i].getVisible()) continue;
        min = Math.min(min, cs[i].getMarginTop() + cs[i].getMaximumHeight() + cs[i].getMarginBottom());
    }
    return this.getInsetTop() + this.getInsetBottom() + min;
};
_p._computePreferredHeight = function () {
    var cs = this._children;
    var l = cs.length;
    var max = 0;
    for (var i = 0; i < l; i++) {
        if (!cs[i].getCreated() || !cs[i].getVisible()) continue;
        max = Math.max(max, cs[i].getMarginTop() + cs[i].getPreferredHeight() + cs[i].getMarginBottom());
    }
    return this.getInsetTop() + this.getInsetBottom() + max;
};

function BiGridPanel2() {
    if (_biInPrototype) return;
    BiGridPanel.apply(this, arguments);
    this._gridRows = [];
    this._filledCells = {};
}
_p = _biExtend(BiGridPanel2, BiGridPanel, "BiGridPanel2");
BiGridPanel2._STRETCH_NONE = 0;
BiGridPanel2._STRETCH_HORIZONTAL = 1;
BiGridPanel2._STRETCH_VERTICAL = 2;
BiGridPanel2._STRETCH_BOTH = 3;
_p._cellPadding = 0;
_p._align = "left";
_p._valign = "middle";
_p._defaultColWidth = "*";
_p._defaultColObj = {
    type: "*",
    value: 1
};
_p._defaultRowHeight = "*";
_p._defaultRowObj = {
    type: "*",
    value: 1
};
_p._colsArray = [];
_p._rowsArray = [];
BiGridPanel2.addProperty("defaultColWidth", BiAccessType.READ);
_p.setDefaultColWidth = function (sWidth) {
    sWidth = String(sWidth);
    this._defaultColWidth = sWidth;
    this._defaultColObj = this._parseWidth(sWidth);
    this.setCols(this._cols);
};
BiGridPanel2.addProperty("defaultRowHeight", BiAccessType.READ);
_p.setDefaultRowHeight = function (sHeight) {
    sHeight = String(sHeight);
    this._defaultRowHeight = sHeight;
    this._defaultRowObj = this._parseWidth(sHeight);
    this.setRows(this._rows);
};
BiGridPanel2.addProperty("cellPadding", BiAccessType.READ_WRITE);
BiGridPanel2.addProperty("align", BiAccessType.READ_WRITE);
BiGridPanel2.addProperty("valign", BiAccessType.READ_WRITE);
BiGridPanel2.addProperty("gridRows", BiAccessType.READ);
BiGridPanel2.addProperty("colSizes", BiAccessType.READ);
BiGridPanel2.addProperty("rowSizes", BiAccessType.READ);
_p.setRows = function (s) {
    delete this._rows;
    BiGridPanel.prototype.setRows.call(this, s);
    var l = this._rowCount || this._rowsArray.length;
    this._rowsArray = this._padArray(this._rowsArray, l, this._defaultRowObj);
    this._checkForPreferredSizes();
};
_p.setCols = function (s) {
    delete this._cols;
    BiGridPanel.prototype.setCols.call(this, s);
    var l = this._colCount || this._colsArray.length;
    this._colsArray = this._padArray(this._colsArray, l, this._defaultColObj);
    this._checkForPreferredSizes();
};
_p._padArray = function (a, l, o) {
    if (l)
        for (var i = 0; i < l; i++)
            if (!a[i] || (!a[i].type && !a[i].value)) a[i] = {
                type: o.type,
                value: o.value
            };
    if (l && a.length > l) a = a.slice(0, l);
    return a;
};
_p._checkForPreferredSizes = function () {
    var calc = false;
    var i, a = this._colsArray;
    if (a)
        for (i = 0; i < a.length && !calc; i++) calc = a[i].type == "-" || a[i].value.toString() == "NaN";
    a = this._rowsArray;
    if (a && !calc)
        for (i = 0; i < a.length && !calc; i++) calc = a[i].type == "-" || a[i].value.toString() == "NaN";
    this._hasPreferredSizes = this._invalidPreferredSizes = calc;
};
_p.addParsedObject = function (o) {
    if (o instanceof BiGridPanel2Row) this.add(o);
    else BiGridPanel.prototype.addParsedObject.call(this, o);
};
_p.invalidateChild = function (oChild, sHint) {
    var cell = this._filledCells[BiObject.toHashCode(oChild)];
    if (!cell) return;
    if ((this._rowsArray[cell._row] && this._rowsArray[cell._row].type == "-") || (this._colsArray[cell._col] && this._colsArray[cell._col].type == "-")) {
        this._invalidatePreferredSizes();
    } else if (cell._stretch != "both") {
        BiComponent.prototype.invalidateChild(oChild, sHint);
    }
};
_p._invalidatePreferredSizes = function () {
    this._invalidPreferredSizes = this._hasPreferredSizes;
    this.invalidateLayout();
    delete this._matrix;
};
_p.add = function (oRow) {
    if (!(oRow instanceof BiGridPanel2Row)) throw new Error("Not a BiGridPanel2Row object.");
    this._gridRows.push(oRow);
    oRow._parent = this;
    var cells = oRow.getCells();
    for (var i = 0; i < cells.length; i++) {
        var c = cells[i].getContentComponent();
        if (c) {
            this._addCellComponent(c);
        }
    }
    this._invalidatePreferredSizes();
};
_p._addCellComponent = function (c) {
    if (!(c instanceof BiComponent)) throw new Error("Not an instance of BiComponent!");
    this._invalidatePreferredSizes();
    BiComponent.prototype.add.call(this, c);
};
_p.remove = function (oRow) {
    if (oRow instanceof BiGridPanel2Row) {
        var i = this._gridRows.indexOf(oRow);
        if (i >= 0) {
            this._gridRows.removeAt(i);
            var cells = oRow.getCells();
            for (i = 0; i < cells.length; i++) {
                var c = cells[i].getContentComponent();
                if (c) {
                    this._removeCellComponent(c);
                }
            }
            this._invalidatePreferredSizes();
        }
    } else {
        this._removeCellComponent(oRow);
    }
};
_p.removeAll = function () {
    while (this._gridRows.length > 0) this.remove(this._gridRows[this._gridRows.length - 1]);
};
_p._removeCellComponent = function (c) {
    this._invalidatePreferredSizes();
    BiComponent.prototype.remove.call(this, c);
    if (c._disposed && this._filledCells) {
        var hc = BiObject.toHashCode(c);
        var cell = this._filledCells[hc];
        if (cell) {
            cell._contentComponent = null;
            delete this._filledCells[hc];
        }
    }
};
_p.getCellMatrix = function () {
    if (this._matrix) return this._matrix;
    var rs = this._gridRows;
    var rowSpan = [];
    this._filledCells = {};
    var i, j, k;
    var m = this._matrix = [];
    var hasMoreRows = rs.length > 0;
    var hasMoreCols;
    for (i = 0; hasMoreRows; i++) {
        m[i] = [];
        var cs = rs[i] ? rs[i].getCells() : [];
        hasMoreRows = i < rs.length - 1;
        hasMoreCols = cs.length > 0 || rowSpan.length > 0;
        for (j = 0, k = 0; hasMoreCols; j++, k++) {
            hasMoreCols = ((k < cs.length - 1) || (j < rowSpan.length - 1));
            if (rowSpan[j] > 1) {
                rowSpan[j]--;
                k--;
                m[i][j] = m[i - 1][j];
                hasMoreRows |= rowSpan[j] > 1;
                continue;
            }
            var cell = cs[k];
            if (!cell) continue;
            var colSpan = cell._colSpan || 1;
            if (this._colsArray && this._colsArray.length && colSpan > this._colsArray.length) colSpan = this._colsArray.length;
            for (var jj = j; jj < j + colSpan; jj++) {
                rowSpan[jj] = cell._rowSpan || 1;
                m[i][jj] = cell;
            }
            cell._row = i;
            cell._col = j;
            if (cell.getContentComponent()) {
                this._filledCells[BiObject.toHashCode(cell.getContentComponent())] = cell;
            }
            j += (colSpan - 1);
            hasMoreCols |= (j < rowSpan.length - 1);
        }
    }
    var colCount = this._colCount = rowSpan.length;
    var rowCount = this._rowCount = m.length;
    for (i = 0; i < rowCount; i++)
        while (m[i].length < colCount) m[i].push(null);
    if (this._colCount != this._colsArray.length) this.setCols(this._cols);
    if (this._rowCount != this._rowsArray.length) this.setRows(this._rows);
    return m;
};
_p._calcPreferredSizes = function () {
    var m = this.getCellMatrix();
    var cols = this._colsArray.length;
    var rows = this._rowsArray.length;
    var hs = new Array(rows);
    var ws = new Array(cols);
    var ac = this._colsArray;
    var ar = this._rowsArray;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = m[i][j];
            if (cell) {
                var c = cell._contentComponent;
                if (c && !c.getCreated() && c.getVisible()) return false;
                if (ac[j].type == "-" && cell.getColSpan() <= 1) ac[j].value = ws[j] = Math.max(ws[j] || 0, cell.getPreferredWidth());
                if (ar[i].type == "-" && cell.getRowSpan() <= 1) ar[i].value = hs[i] = Math.max(hs[i] || 0, cell.getPreferredHeight());
            }
        }
    }
    this._invalidPreferredSizes = false;
    return true;
};
_p.layoutAllChildren = function () {
    this.getCellMatrix();
    var cols = this._colsArray.length;
    var rows = this._rowsArray.length;
    var w = this.getClientWidth();
    var h = this.getClientHeight();
    if (w == 0 || h == 0) return;
    var availWidth = w - (cols - 1) * this._hGap;
    var availHeight = h - (rows - 1) * this._vGap;
    var rtl = this.getRightToLeft();
    var posX = [0],
        posY = [0];
    var i;
    var x, y;
    var w2, h2, changed;
    var cell, p;
    if (this._invalidPreferredSizes)
        if (!this._calcPreferredSizes()) return;
    var colSizes = this._colSizes = BiGridPanel._getFixedSizes(availWidth, cols, this._colsArray);
    var rowSizes = this._rowSizes = BiGridPanel._getFixedSizes(availHeight, rows, this._rowsArray);
    for (i = 1; i < cols; i++) posX[i] = posX[i - 1] + colSizes[i - 1] + this._hGap;
    for (i = 1; i < rows; i++) posY[i] = posY[i - 1] + rowSizes[i - 1] + this._vGap;
    var l;
    for (var k in this._filledCells) {
        cell = this._filledCells[k];
        if (!cell._contentComponent) {
            delete this._filledCells[k];
            continue;
        }
        x = posX[cell._col];
        y = posY[cell._row];
        w2 = colSizes[cell._col];
        h2 = rowSizes[cell._row];
        p = cell._cellPadding != null ? cell._cellPadding : cell._parent._cellPadding != null ? cell._parent._cellPadding : this._cellPadding || 0;
        if (cell._colSpan > 1) {
            l = Math.min(cell._col + cell._colSpan, cols);
            for (i = cell._col + 1; i < l; i++) {
                w2 += colSizes[i] + this._hGap;
            }
        }
        if (cell._rowSpan > 1) {
            l = Math.min(cell._row + cell._rowSpan, rows);
            for (i = cell._row + 1; i < l; i++) {
                h2 += rowSizes[i] + this._vGap;
            }
        }
        changed = rtl ? this._layoutChild(cell, w - w2 - p - x, y + p, w2 - 2 * p, h2 - 2 * p) : this._layoutChild(cell, x + p, y + p, w2 - 2 * p, h2 - 2 * p);
        if (changed) cell._contentComponent.invalidateLayout();
    }
    this._invalidLayout = false;
};
_p._layoutChild = function (o, x, y, _w, _h) {
    if (!(o instanceof BiGridPanel2Cell)) {
        this.invalidateLayout();
        return;
    }
    var oChild = o._contentComponent;
    var w = _w,
        h = _h;
    if (!(o._nStretch & BiGridPanel2._STRETCH_HORIZONTAL)) {
        if (oChild._left != null) {
            x += oChild._left;
            if (oChild._right != null) {
                w = _w - oChild._left - oChild._right;
            } else if (oChild._width != null) {
                w = oChild._width;
            } else {
                w -= oChild._left;
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
            x += _w - w - oChild._right;
        } else if (oChild._width != null) {
            w = oChild._width;
        } else {
            w = o._getPreferredContentWidth();
        }
        var align = o._align || o._parent._align || this._align;
        switch (align) {
        case "center":
            x += (_w - w) / 2;
            break;
        case "right":
            x += _w - w;
            break;
        }
    }
    if (!(o._nStretch & BiGridPanel2._STRETCH_VERTICAL)) {
        if (oChild._top != null) {
            y += oChild._top;
            if (oChild._bottom != null) {
                h = _h - oChild._top - oChild._bottom;
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
            y += _h - h - oChild._bottom;
        } else if (oChild._height != null) {
            h = oChild._height;
        } else {
            h = o._getPreferredContentHeight();
        }
        var valign = o._valign || o._parent._valign || this._valign;
        switch (valign) {
        case "top":
            break;
        case "bottom":
            y += _h - h;
            break;
        default:
            y += (_h - h) / 2;
            break;
        }
    }
    return this._layoutChild2(oChild, x, y, w, h);
};
_p._getSizeHelperX = function (sType, sMax) {
    var m = this.getCellMatrix();
    if (!m || !m.length || !m[0].length) return 0;
    var cols = this._colsArray.length;
    var rows = this._rowsArray.length;
    var item;
    var colWidths = new Array(cols);
    var flexWidths = new Array(cols);
    for (var i = 0; i < cols; i++) {
        colWidths[i] = flexWidths[i] = sMax == "max" ? 0 : Infinity;
    }
    var w;
    var cell;
    var x;
    for (i = 0; i < rows; i++) {
        for (x = 0; x < cols; x++) {
            if (!(cell = m[i][x])) continue;
            item = this._colsArray[x];
            if (item.type == "*") {
                w = cell["get" + sType + "Width"]() / cell.getColSpan();
                flexWidths[x] = Math[sMax](flexWidths[x], w / item.value);
            }
        }
    }
    var flexPref = sMax == "max" ? 0 : Infinity;
    for (i = 0; i < cols; i++) {
        flexPref = Math[sMax](flexWidths[i], flexPref);
    }
    for (i = 0; i < rows; i++) {
        for (x = 0; x < cols; x++) {
            item = this._colsArray[x];
            cell = m[i][x];
            if (item.type == "") w = item.value;
            else if (item.type == "*") w = flexPref * item.value;
            else if (item.type == "-" && cell && cell._col == x) w = cell["get" + sType + "Width"]();
            else w = 0;
            colWidths[x] = Math[sMax](colWidths[x], w);
        }
    }
    var sum = (cols - 1) * this._hGap;
    for (i = 0; i < cols; i++) {
        sum += colWidths[i];
    }
    return sum + this.getInsetLeft() + this.getInsetRight();
};
_p._getSizeHelperY = function (sType, sMax) {
    var m = this.getCellMatrix();
    if (!m || !m.length || !m[0].length) return 0;
    var cols = this._colsArray.length;
    var rows = this._rowsArray.length;
    var item, i;
    var rowHeights = new Array(rows);
    var flexHeights = new Array(rows);
    for (i = 0; i < rows; i++) {
        rowHeights[i] = flexHeights[i] = sMax == "max" ? 0 : Infinity;
    }
    var h, y;
    var cell;
    for (i = 0; i < cols; i++) {
        for (y = 0; y < rows; y++) {
            if (!(cell = m[y][i])) continue;
            item = this._rowsArray[y];
            if (item.type == "*") {
                h = cell["get" + sType + "Height"]() / cell.getRowSpan();
                flexHeights[y] = Math[sMax](flexHeights[y], h / item.value);
            }
        }
    }
    var flexPref = sMax == "max" ? 0 : Infinity;
    for (i = 0; i < rows; i++) {
        flexPref = Math[sMax](flexHeights[i], flexPref);
    }
    for (i = 0; i < cols; i++) {
        for (y = 0; y < rows; y++) {
            item = this._rowsArray[y];
            cell = m[y][i];
            if (item.type == "") h = item.value;
            else if (item.type == "*") h = flexPref * item.value;
            else if (item.type == "-" && cell && cell._row == y) h = cell["get" + sType + "Height"]();
            else h = 0;
            rowHeights[y] = Math[sMax](rowHeights[y], h);
        }
    }
    var sum = (rows - 1) * this._vGap;
    for (i = 0; i < rows; i++) {
        sum += rowHeights[i];
    }
    return sum + this.getInsetTop() + this.getInsetBottom();
};
_p.dispose = function () {
    if (this.getDisposed()) return;
    BiGridPanel.prototype.dispose.call(this);
    this.disposeFields("_gridRows, _filledCells");
};

function BiGridPanel2Row() {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._cells = [];
}
_p = _biExtend(BiGridPanel2Row, BiObject, "BiGridPanel2Row");
_p.getCellPadding = function () {
    return this._cellPadding != null ? this._cellPadding : this._parent ? this._parent.getCellPadding() || 0 : 0;
};
_p.setCellPadding = function (n) {
    this._cellPadding = n;
    if (this._parent) this._parent._invalidatePreferredSizes();
};
BiGridPanel2Row.addProperty("cells", BiAccessType.READ);
BiGridPanel2Row.addProperty("parent", BiAccessType.READ);
_p.getAlign = function () {
    return this._align || (this._parent ? this._parent.getAlign() : 0) || "left";
};
_p.setAlign = function (sAlign) {
    this._align = sAlign;
    if (this._parent) this._parent.invalidateLayout();
};
_p.getValign = function () {
    return this._valign || (this._parent ? this._parent.getValign() : 0) || "middle";
};
_p.setValign = function (sValign) {
    this._valign = sValign;
    if (this._parent) this._parent.invalidateLayout();
};
_p.getNumberOfColumns = function () {
    var n = 0;
    var cs = this._cells;
    for (var i = 0; i < cs.length; i++) n += cs[i]._colSpan > 0 ? cs[i]._colSpan : 1;
    return n;
};
_p.addParsedObject = function (o) {
    if (o instanceof BiGridPanel2Cell) this.add(o);
    else BiObject.prototype.addParsedObject.call(this, o);
};
_p.add = function (oChild) {
    if (!(oChild instanceof BiGridPanel2Cell)) throw new Error("Can only add BiGridPanel2Cell to the row.");
    this._cells.push(oChild);
    oChild.setParent(this);
    var c = oChild.getContentComponent();
    if (c && this._parent) {
        this._parent._addCellComponent(c);
    }
};
_p.remove = function (oChild) {
    this._cells.remove(oChild);
    if (this._parent && oChild.getContentComponent()) {
        this._parent._removeCellComponent(oChild.getContentComponent());
    }
    oChild.setParent(null);
};
_p.getPreferredHeight = function () {
    var h = 0;
    for (var i = 0; i < this._cells.length; i++) {
        var c = this._cells[i];
        h = Math.max(h, c.getPreferredHeight());
    }
    return h;
};
_p.dispose = function () {
    if (this._disposed) return;
    if (this._parent) this._parent.removeRow(this);
    BiObject.prototype.dispose.call(this);
    delete this._cells;
    delete this._parent;
};

function BiGridPanel2Cell(o) {
    if (_biInPrototype) return;
    BiObject.call(this);
    if (o) this.setContentComponent(o);
}
_p = _biExtend(BiGridPanel2Cell, BiObject, "BiGridPanel2Cell");
_p._colSpan = 1;
_p._rowSpan = 1;
_p._nStretch = BiGridPanel2._STRETCH_BOTH;
_p._stretch = "both";
_p.getCellPadding = function () {
    return this._cellPadding != null ? this._cellPadding : this._parent ? this._parent.getCellPadding() || 0 : 0;
};
_p.setCellPadding = function (n) {
    this._cellPadding = n;
    if (this._getGridPanel()) this._getGridPanel()._invalidatePreferredSizes();
};
BiGridPanel2Cell.addProperty("contentComponent", BiAccessType.READ);
_p.setContentComponent = function (oComp) {
    var gp = this._getGridPanel();
    if (this._contentComponent && gp) {
        gp._removeCellComponent(this._contentComponent);
    }
    this._contentComponent = oComp;
    if (gp && oComp) {
        gp._addCellComponent(oComp);
    }
};
_p.add = function (oComp) {
    if (this._contentComponent) throw new Error("The cell already has a content component!");
    this.setContentComponent(oComp);
};
BiGridPanel2Cell.addProperty("stretch", BiAccessType.READ);
_p.setStretch = function (s) {
    if (this._stretch != s) {
        this._stretch = s;
        switch (s) {
        case "both":
            this._nStretch = BiGridPanel2._STRETCH_BOTH;
            break;
        case "horizontal":
            this._nStretch = BiGridPanel2._STRETCH_HORIZONTAL;
            break;
        case "vertical":
            this._nStretch = BiGridPanel2._STRETCH_VERTICAL;
            break;
        default:
            this._stretch = "none";
            this._nStretch = BiGridPanel2._STRETCH_NONE;
        }
        if (this._contentComponent && this._getGridPanel()) this._getGridPanel().invalidateLayout();
    }
};
_p._getGridPanel = function () {
    return this._parent ? this._parent._parent : null;
};
BiGridPanel2Cell.addProperty("parent", BiAccessType.READ_WRITE);
BiGridPanel2Cell.addProperty("colSpan", BiAccessType.READ_WRITE);
BiGridPanel2Cell.addProperty("rowSpan", BiAccessType.READ_WRITE);
_p.getAlign = function () {
    return this._align || (this._parent ? this._parent.getAlign() : 0) || "left";
};
_p.setAlign = function (sAlign) {
    this._align = sAlign;
    if (this._contentComponent && this._getGridPanel()) this._getGridPanel().invalidateLayout();
};
_p.getValign = function () {
    return this._valign || (this._parent ? this._parent.getValign() : 0) || "middle";
};
_p.setValign = function (sValign) {
    this._valign = sValign;
    if (this._contentComponent && (this._getGridPanel())) this._getGridPanel().invalidateLayout();
};
_p.getPreferredWidth = function () {
    var pad = this.getCellPadding() * 2;
    return Math.max(this._getPreferredContentWidth() + pad, 2);
};
_p.setPreferredWidth = function (n) {
    this._preferredWidth = n;
    if (this._getGridPanel()) this._getGridPanel()._invalidatePreferredSizes();
};
_p.getPreferredHeight = function () {
    var pad = this.getCellPadding() * 2;
    return Math.max(this._getPreferredContentHeight() + pad, 2);
};
_p._getPreferredContentWidth = function () {
    var c = this._contentComponent;
    return c && c.getCreated() && c.getVisible() ? c.getPreferredWidth() : 0;
};
_p._getPreferredContentHeight = function () {
    var c = this._contentComponent;
    return c && c.getCreated() && c.getVisible() ? c.getPreferredHeight() : 0;
};
_p.setPreferredHeight = function (n) {
    this._preferredHeight = n;
    if (this._getGridPanel()) this._getGridPanel()._invalidatePreferredSizes();
};
_p.getMaximumWidth = function () {
    var c = this._contentComponent;
    return c ? c.getMaximumWidth() : 0;
};
_p.getMinimumWidth = function () {
    var c = this._contentComponent;
    return c ? c.getMinimumWidth() : 0;
};
_p.getMaximumHeight = function () {
    var c = this._contentComponent;
    return c ? c.getMaximumHeight() : 0;
};
_p.getMinimumHeight = function () {
    var c = this._contentComponent;
    return c ? c.getMinimumHeight() : 0;
};
_p.addParsedObject = function (o) {
    if (o instanceof BiComponent) this._contentComponent = o;
    else BiObject.prototype.addParsedObject.call(this, o);
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    delete this._contentComponent;
};