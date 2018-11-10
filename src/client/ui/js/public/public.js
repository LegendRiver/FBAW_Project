// JavaScript Document

/**
 * 调试信息输出函数
 * @param ErrorLevel 调试信息级别
 * @param message 调试信息内容
 */
function writeLogMessage(ErrorLevel,message)
{
    var currentTime = new Date();
    var logMessage = "[" + currentTime + "][" + ErrorLevel + "][" + message + "]";
    if(((ErrorLevel === "ERROR") || (ErrorLevel === "ERR")) && (!BiBrowserCheck.ie))
    {
        console.log(logMessage);
    }
}

function newGuid()
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
}

/**
 * 去掉字符串两边的空格
 * @param str 需要去掉空格的字符串
 * @returns {XML|string|void|*} 返加去掉空格后的字符串
 */
function trim(str)
{
     return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 去掉字符右侧指定字符
 * @param stringObj 需去掉指定字符的字符串
 * @param removeChar 要去掉的字符
 * @returns {string|*} 返回处理后的字符串
 */
function removeRightChar(stringObj, removeChar)
{
    var strLen = stringObj.length;
    for (var index = (strLen - 1); index > 0; --index)
    {
        if(stringObj[index] != removeChar)
        {
            break;
        }
    }

    return stringObj.substring(0, (index + 1));
}

/**
 * 获取[Min,Max]之间的随机数，闭区间
 * @param min 下限
 * @param max 上限
 * @returns {number}
 */
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max-(min+1)) + (min+1));
}

function addDays(date, days)
{
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function convertString2Date(dateString)
{
    try
    {
        return new Date(Date.parse(dateString));
    }
    catch(e)
    {
        writeLogMessage("ERROR", sprintf("Convert<%s> to date object failed, error message<%s>.", dateString, e.message));
        return null;
    }
}

function getTimeString(dateObject)
{
    var hour = dateObject.getHours();
    var minutes = dateObject.getMinutes();
    return sprintf("%02d:%02d", hour, minutes);
}

function diffDateTime(date1, date2)
{
    return (date2 - date1);
}

function getDateString(dateObject)
{
    var year = dateObject.getFullYear().toString();
    var month = (dateObject.getMonth()+1).toString(); // getMonth() is zero-based
    var day  = dateObject.getDate().toString();
    return sprintf("%04d-%02d-%02d", year, month, day);
}

function getCurrentFullTime()
{
    var d = new Date();
    return sprintf("%04d-%02d-%02d %02d:%02d:%02d",
        d.getFullYear(), (d.getMonth()+1),d.getDate(),
        d.getHours(), d.getMinutes(), d.getSeconds());
}

function formatFullTime(date)
{
    return sprintf("%04d-%02d-%02d %02d:%02d:%02d",
        date.getFullYear(), (date.getMonth()+1),date.getDate(),
        date.getHours(), date.getMinutes(), date.getSeconds());
}

/**
 * 获取系统时间，返回格式:yyyy-mm-dd
 * @returns {*}
 */
function getCurrentDate()
{
    var d = new Date();
    return sprintf("%04d-%02d-%02d", d.getFullYear(), (d.getMonth()+1),d.getDate());
}

/**
 * 获取系统时间，返回格式:yyyy-mm-dd hh:mm:ss
 * @returns {*}
 */
function getCurrentDateTime()
{
    var d = new Date();
    return sprintf("%04d-%02d-%02d %02d:%02d:%02d", d.getFullYear(), (d.getMonth()+1),d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
}

function getCurrentYearBeigin()
{
    var d = new Date();
    return sprintf("%04d-%02d-%02d", d.getFullYear(), 01,01);
}

function getLastYearCurrentDate()
{
    var d = new Date();
    return sprintf("%04d-%02d-%02d", d.getFullYear()-1, (d.getMonth()+1),d.getDate());
}

function getTimeStamp()
{
    var timeStamp = new Date().getTime();
    return timeStamp;
}

function utf8(wide)
{
    var c, s;
    var enc = "";
    var i = 0;
    while (i < wide.length)
    {
        c = wide.charCodeAt(i++);
        // handle UTF-16 surrogates
        if (c >= 0xDC00 && c < 0xE000)
        {
            continue;
        }
        if (c >= 0xD800 && c < 0xDC00)
        {
            if (i >= wide.length)
            {
                continue;
            }

            s = wide.charCodeAt(i++);
            if (s < 0xDC00 || c >= 0xDE00) continue;
            c = ((c - 0xD800) << 10) + (s - 0xDC00) + 0x10000;
        }
        // output value
        if (c < 0x80) enc += String.fromCharCode(c);
        else if (c < 0x800) enc += String.fromCharCode(0xC0 + (c >> 6), 0x80 + (c & 0x3F));
        else if (c < 0x10000) enc += String.fromCharCode(0xE0 + (c >> 12), 0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
        else enc += String.fromCharCode(0xF0 + (c >> 18), 0x80 + (c >> 12 & 0x3F), 0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
    }

    return enc;
}

var hexchars = "0123456789ABCDEF";
function toHex(n)
{
    return hexchars.charAt(n >> 4) + hexchars.charAt(n & 0xF);
}


var okURIchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
function encodeURIComponentNew(s)
{
    var s = utf8(s);
    var enc = "";
    for (var i = 0; i < s.length; i++)
    {
        if (okURIchars.indexOf(s.charAt(i)) == -1)
            enc += "%" + toHex(s.charCodeAt(i));
        else
            enc += s.charAt(i);
    }
    return enc;
}

function diffDateTime(date1, date2)
{
    return (date2 - date1);
}

/**
 * 比较两个时间大小，
 * time1<=time2 return true
 * time1>time2 return false
 * @param time1
 * @param time2
 */
function compareTime(time1,time2)
{
    var date1 = convertString2Date(time1);

    var date2 = convertString2Date(time2);
    var num1 = date1.getTime();
    var num2 = date2.getTime();
    return (num1<num2);
}

function isShifKey(keyCode)
{
    return (keyCode == 16);
}

function isControlKey(keyCode)
{
    return (keyCode == 17);
}

function isAltKey(keyCode)
{
    return (keyCode == 18);
}

function isCommandKey(keyCode)
{
    return (keyCode == 91);
}

function loadJavaScriptFile(filename)
{
    var fileref=document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", filename);
}

function getCenterPoint()
{
    return new CPoint((window.screen.availWidth / 2), (window.screen.availHeight / 2));
}

function getPassedSeconds(date1, date2)
{
    return Math.floor((date1.getTime() - date2.getTime()) / 1000);
}

function getSeconds(hour)
{
    return (hour * 60 * 60);
}

function isChrome()
{
    return (navigator.userAgent.toLowerCase().indexOf('chrome') > -1);
}

function isSafari()
{
    return ( navigator.userAgent.toLowerCase().indexOf('safari') > -1);
}

function downloadFile(fileUrl, fileName)
{
    //If in Chrome or Safari - download via virtual link click
    if (isChrome() || isSafari())
    {
        //Creating new link node.
        var link = document.createElement('a');
        link.href = fileUrl;

        if (link.download !== undefined){
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            //var fileName = fileUrl.substring(sUrl.lastIndexOf('/') + 1, fileUrl.length);
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click' ,true ,true);
            link.dispatchEvent(e);
            return true;
        }
    }

    // Force file download (whether supported by server).
    var query = '?download';

    window.open(fileUrl + query);
}

/**
 * 计算字符串长度
 * @param stringContent
 * @returns {number}
 */
function calculateStringLength(stringContent)
{
    //assuming the String is UCS-2(aka UTF-16) encoded
    var length = 0;
    var originalLength = stringContent.length;
    for (var index = 0, originalLength = stringContent.length; index < originalLength; index++) {
        var charValue = stringContent.charCodeAt(index);
        if (charValue < 0x0080)//[0x0000, 0x007F]
        {
            length += 1;
        }
        else if (charValue < 0x0800)//[0x0080, 0x07FF]
        {
            length += 2;
        }
        else if (charValue < 0xD800)//[0x0800, 0xD7FF]
        {
            length += 3;
        }
        else if (charValue < 0xDC00)//[0xD800, 0xDBFF]
        {
            var lo = stringContent.charCodeAt(++index);
            if (index < originalLength && lo >= 0xDC00 && lo <= 0xDFFF)//followed by [0xDC00, 0xDFFF]
            {
                length += 4;
            }
            else
            {
                throw new Error("UCS-2 String malformed");
            }
        }
        else if (charValue < 0xE000)//[0xDC00, 0xDFFF]
        {
            throw new Error("UCS-2 String malformed");
        }
        else//[0xE000, 0xFFFF]
        {
            length += 3;
        }
    }

    return length;
}

function isFullScreen()
{
    return (document.fullScreenElement && document.fullScreenElement !== null)
        || document.mozFullScreen
        || document.webkitIsFullScreen;
}

function requestFullScreen(element)
{
    if (element.requestFullscreen)
        element.requestFullscreen();
    else if (element.msRequestFullscreen)
        element.msRequestFullscreen();
    else if (element.mozRequestFullScreen)
        element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen)
        element.webkitRequestFullscreen();
}

function exitFullScreen()
{
    if (document.exitFullscreen)
        document.exitFullscreen();
    else if (document.msExitFullscreen)
        document.msExitFullscreen();
    else if (document.mozCancelFullScreen)
        document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen)
        document.webkitExitFullscreen();
}

function toggleFullScreen(element)
{
    if (isFullScreen())
        cancelFullScreen();
    else
        requestFullScreen(element || document.documentElement);
}

