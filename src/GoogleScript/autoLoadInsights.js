function main()
{
    var currentDate = new Date();
    var reportDate = new Date(currentDate);
    reportDate.setDate(reportDate.getDate() -1);

    var eliClient = new CEliClient();
    eliClient.init();
    eliClient.saveAllAdStatRecord(CEliClient.formatDate(reportDate),CEliClient.formatDate(reportDate));
    eliClient.printAdStatRecords();

    Logger.log("Run completed.");
}

function CEliClient()
{
    this.__Id = null;
    this.__AdStatRecordSet = null;
    this.__SERVICE_URL = "http://www.eliads.com:9090/EliAccountManagerService.php";
    this.__METHOD_TYPE = "POST";
    this.__PARAMETER_SERVICE_NAME = "SERVICE_NAME";
    this.__PARAMETER_CLASS_INSTANCE = "CLASS_INSTANCE";
    this.__PARAMETER_FUNCTION_NAME = "FUNCTION_NAME";
    this.__PARAMETER_DATA = "DATA";
    this.__PARAMETER_CALL_TAG = "CALL_TAG";
    this.__REPORT_FIELDS = ["ID","ELI_CAMPAIGN_ID","ELI_ADSET_ID","ELI_AD_ID","PUBLISHER_CAMPAIGN_ID","PUBLISHER_ADSET_ID","PUBLISHER_AD_ID","REPORT_START_TIME","REPORT_END_TIME","REQUEST_TIME","RESULT_VALUE","RESULT_TYPE","REACH","COST_PER_RESULT","SPENT","IMPRESSIONS","CLICKS","CPC","CTR","RESULT_RATE","CPM","INSTALLS","CPI","CVR","BOUNCE_RATE","AVERAGE_PAGE_VIEWS","AVERAGE_POSITION","AVERAGE_TIME_ON_SITE"];
    this.__ServiceName = "EliAccountManagerService";
    this.__ClassInstance="CEliAccountManager";
    this.__FunctionName="updateCampaignConfigSpent";
    this.__CALL_TAG="google";
}

CEliClient.prototype.init = function()
{
    this.__Id = CEliClient.getGuid();
    this.__AdStatRecordSet = [];
};

CEliClient.prototype.__sendDataToServer = function()
{
    var parameters =   {
        "SERVICE_NAME":this.__ServiceName,
        "CLASS_INSTANCE": this.__ClassInstance,
        "FUNCTION_NAME": this.__FunctionName,
        "DATA":  this.__encodeAdRecordData(),
        "CALL_TAG": this.__CALL_TAG
    };

    var options = {
        'method' : 'post',
        'payload' : parameters
    };

    var response = UrlFetchApp.fetch(this.__SERVICE_URL, options);
    this.setData(response);
};

CEliClient.prototype.__encodeAdRecordData = function()
{
    var data = {
        "FIELDS":this.__REPORT_FIELDS,
        "RECORDS":this.__AdStatRecordSet
    };

    return  CEliBase64.encode(JSON.stringify(data));
};

CEliClient.prototype.setData = function(resultData)
{
    Logger.log(resultData);
    var errorMessage = "";
    if(resultData != null)
    {
        var resultObj = null;
        try
        {
            resultObj = eval('(' + resultData + ')');
        }
        catch(e)
        {
            errorMessage = sprintf("<%s>,<%s>", "ERROR", e.message);
            Logger.log(errorMessage);
            return;
        }

        var errorCode = parseInt(resultObj.errorCode);

        if(errorCode == 0)
        {
            errorMessage = sprintf("<%s>,Send data to Server<%s> success,error code <%d>.", "ERROR", this.__SERVICE_URL, errorCode);
        }
        else
        {
            errorMessage = sprintf("<%s>,Send data to Server<%s> failed,error code <%d>.", "ERROR", this.__SERVICE_URL, errorCode);
            MailApp.sendEmail("webservice@eliads.com", "SYNC REPORT",  errorMessage);
        }
        Logger.log(errorMessage);
    }
};

CEliClient.prototype.getId = function()
{
    return this.__Id;
};

CEliClient.prototype.printAdStatRecords = function()
{
    var recordNumber = this.__AdStatRecordSet.length;
    for(var index = 0; index < recordNumber; ++index)
    {
        Logger.log(this.__AdStatRecordSet[index]);
    }
};

CEliClient.prototype.saveAllAdStatRecord = function(fromeDate,toDate)
{
    this.__saveAllAccountAdStatRecord(fromeDate,toDate, this.__AdStatRecordSet);
    this.__sendDataToServer();
};

CEliClient.prototype.__saveAdStatRecordToGoogleDrive = function(fromeDate,toDate)
{
    var fileName = sprintf("%s_%s.dat", fromeDate,toDate);
    DriveApp.createFile(fileName, JSON.stringify(this.__AdStatRecordSet), MimeType.JAVASCRIPT);
};

CEliClient.prototype.__saveAllAccountAdStatRecord = function(fromeDate,toDate, adRecordSet)
{
    var accountIterator = MccApp.accounts().get();
    while (accountIterator.hasNext())
    {
        var account = accountIterator.next();
        this.getAllCampaigns(account,fromeDate,toDate, adRecordSet);
    }
};

CEliClient.prototype.getCampaignAdStat = function(account, campaign, fromDate, endDate, adRecordSet)
{
    var adGroupsIterator = campaign.adGroups().get();
    while(adGroupsIterator.hasNext())
    {
        var adGroup = adGroupsIterator.next();
        var campaignBudget = campaign.getBudget();
        var campaignStartDate = campaign.getStartDate();
        var adIterator = adGroup.ads().get();
        while(adIterator.hasNext())
        {
            var ad = adIterator.next();
            var adStat = ad.getStatsFor(fromDate, endDate);
            //["ID","ELI_CAMPAIGN_ID","ELI_ADSET_ID","ELI_AD_ID",
            //"PUBLISHER_CAMPAIGN_ID","PUBLISHER_ADSET_ID","PUBLISHER_AD_ID","REPORT_START_TIME","REPORT_END_TIME","REQUEST_TIME",
            //"RESULT_VALUE","RESULT_TYPE","REACH","COST_PER_RESULT","SPENT",
            //"IMPRESSIONS","CLICKS","CPC","CTR","RESULT_RATE",
            //"CPM","INSTALLS","CPI","CVR","BOUNCE_RATE",
            //"AVERAGE_PAGE_VIEWS","AVERAGE_POSITION","AVERAGE_TIME_ON_SITE"];
            var adStatRecord = sprintf("%s,%s,%s,%s, %s,%s,%s,%s,%s,%s, %.2f,%.2f,%.2f, %.2f,%.2f,%d, %.2f, %.2f,%.2f, %.2f, %d",
                CEliClient.getGuid(), CEliClient.getGuid(), CEliClient.getGuid(), CEliClient.getGuid(),
                campaign.getId(), adGroup.getId(), ad.getId(), fromDate, endDate,fromDate,
                adStat.getClicks(),"CLICK",adStat.getConversions(),0,adStat.getCost(),
                adStat.getImpressions(),adStat.getClicks(),adStat.getAverageCpc(),adStat.getCtr(), 0,
                adStat.getAverageCpm(), adStat.getConversions(),(adStat.getClicks()/adStat.getCost()), adStat.getConversionRate(),adStat.getBounceRate(),
                adStat.getAveragePageviews(),adStat.getAveragePosition(), adStat.getAverageTimeOnSite());
            adRecordSet.push(adStatRecord);
        }
    }
};

CEliClient.prototype.getAllCampaigns = function(account, fromeDate,toDate, adRecordSet)
{
    MccApp.select(account);
    var campaignIterator = AdWordsApp.campaigns().get();
    if (campaignIterator.hasNext())
    {
        var campaign = campaignIterator.next();
        this.getCampaignAdStat(account, campaign, fromeDate, toDate, adRecordSet);
    }
};

CEliClient.formatDate=function(dateObject)
{
    return sprintf("%04d%02d%02d", dateObject.getFullYear(), (dateObject.getMonth() + 1), dateObject.getDate());
};

CEliClient.getGuid = function()
{
    var guid = "";
    for (var i = 1; i <= 32; i++)
    {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if((i==8)||(i==12)||(i==16)||(i==20))
        {
            guid += "_";
        }
    }

    return guid.toUpperCase();
};

sprintfWrapper = {

    __init : function () {

        if (typeof arguments == "undefined") { return null; }
        if (arguments.length < 1) { return null; }
        if (typeof arguments[0] != "string") { return null; }
        if (typeof RegExp == "undefined") { return null; }

        var string = arguments[0];
        var exp = new RegExp(/(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d)?)?([bcdfosxX])))/g);
        var matches = new Array();
        var strings = new Array();
        var convCount = 0;
        var stringPosStart = 0;
        var stringPosEnd = 0;
        var matchPosEnd = 0;
        var newString = '';
        var match = null;

        while (match = exp.exec(string)) {
            if (match[9]) { convCount += 1; }

            stringPosStart = matchPosEnd;
            stringPosEnd = exp.lastIndex - match[0].length;
            strings[strings.length] = string.substring(stringPosStart, stringPosEnd);

            matchPosEnd = exp.lastIndex;
            matches[matches.length] = {
                match: match[0],
                left: match[3] ? true : false,
                sign: match[4] || '',
                pad: match[5] || ' ',
                min: match[6] || 0,
                precision: match[8],
                code: match[9] || '%',
                negative: parseInt(arguments[convCount]) < 0 ? true : false,
                argument: String(arguments[convCount])
            };
        }
        strings[strings.length] = string.substring(matchPosEnd);

        if (matches.length == 0) { return string; }
        if ((arguments.length - 1) < convCount) { return null; }

        var code = null;
        var match = null;
        var i = null;

        for (i=0; i < matches.length; i++) {

            if (matches[i].code == '%') { substitution = '%' }
            else if (matches[i].code == 'b') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(2));
                substitution = sprintfWrapper.convert(matches[i], true);
            }
            else if (matches[i].code == 'c') {
                matches[i].argument = String(String.fromCharCode(parseInt(Math.abs(parseInt(matches[i].argument)))));
                substitution = sprintfWrapper.convert(matches[i], true);
            }
            else if (matches[i].code == 'd') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)));
                substitution = sprintfWrapper.convert(matches[i]);
            }
            else if (matches[i].code == 'f') {
                matches[i].argument = String(Math.abs(parseFloat(matches[i].argument)).toFixed(matches[i].precision ? matches[i].precision : 6));
                substitution = sprintfWrapper.convert(matches[i]);
            }
            else if (matches[i].code == 'o') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(8));
                substitution = sprintfWrapper.convert(matches[i]);
            }
            else if (matches[i].code == 's') {
                matches[i].argument = matches[i].argument.substring(0, matches[i].precision ? matches[i].precision : matches[i].argument.length)
                substitution = sprintfWrapper.convert(matches[i], true);
            }
            else if (matches[i].code == 'x') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                substitution = sprintfWrapper.convert(matches[i]);
            }
            else if (matches[i].code == 'X') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                substitution = sprintfWrapper.convert(matches[i]).toUpperCase();
            }
            else {
                substitution = matches[i].match;
            }

            newString += strings[i];
            newString += substitution;

        }
        newString += strings[i];

        return newString;

    },

    convert : function(match, nosign){
        if (nosign) {
            match.sign = '';
        } else {
            match.sign = match.negative ? '-' : match.sign;
        }
        var l = match.min - match.argument.length + 1 - match.sign.length;
        var pad = new Array(l < 0 ? 0 : l).join(match.pad);
        if (!match.left) {
            if (match.pad == "0" || nosign) {
                return match.sign + pad + match.argument;
            } else {
                return pad + match.sign + match.argument;
            }
        } else {
            if (match.pad == "0" || nosign) {
                return match.sign + match.argument + pad.replace(/0/g, ' ');
            } else {
                return match.sign + match.argument + pad;
            }
        }

    }
}

sprintf = sprintfWrapper.__init;
function CEliBase64()
{
}

CEliBase64._base64String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
CEliBase64._reversedBase64 = (function () {
    var s = CEliBase64._base64String;
    var r = {};
    for (var i = 0; i < s.length; i++) r[s.charAt(i)] = i;
    return r;
})();
CEliBase64._getIndexOf = function (s) {
    return CEliBase64._reversedBase64[s];
};
CEliBase64.encode = function (ds) {
    var bits, dual;
    var sb = [];
    var b64s = CEliBase64._base64String;
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
CEliBase64.decode = function (es) {
    var bits;
    var sb = [];
    var i = 0;
    for (; i < es.length; i += 4) {
        bits = (CEliBase64._getIndexOf(es.charAt(i)) & 0xff) << 18 | (CEliBase64._getIndexOf(es.charAt(i + 1)) & 0xff) << 12 | (CEliBase64._getIndexOf(es.charAt(i + 2)) & 0xff) << 6 | CEliBase64._getIndexOf(es.charAt(i + 3)) & 0xff;
        sb.push(String.fromCharCode((bits & 0xff0000) >> 16, (bits & 0xff00) >> 8, bits & 0xff));
    }
    var ds = sb.join("");
    if (es.charCodeAt(i - 2) == 61) return ds.substring(0, ds.length - 2);
    else if (es.charCodeAt(i - 1) == 61) return ds.substring(0, ds.length - 1);
    else return ds;
};