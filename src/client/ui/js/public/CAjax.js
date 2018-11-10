/**
 * Created by fact  zengtao on 5/2/15 11:26 AM.
 */

function CAjax(serviceUrl, methodType, caller)
{
    Object.call(this);
    this.Id = newGuid();
    this.Caller = caller;
    this.ServiceUrl = serviceUrl;
    this.MethodType = methodType.toUpperCase();
    this.__TimeOut = 120 * 1000;
    this.__IsAsync = true;
    this.Parameters = new BiHashTable();
    this.__HttpRequest = null;
    this.__IsEncryptData = false;
    this.__Encrypt = new CEncrypt();
}

CAjax.PARAMETER_DATA = "DATA";

CAjax.prototype.setIsEncryptData = function (isEncryptData)
{
    this.__IsEncryptData = isEncryptData;
};

CAjax.prototype.getIsEncryptData = function ()
{
    return this.__IsEncryptData;
};

CAjax.prototype.clearParameters = function()
{
    this.Parameters.clear();
};

CAjax.prototype.registerParameter = function(parameterName, parameterValue)
{
    if(this.Parameters.hasKey(parameterName))
    {
        this.Parameters.remove(parameterName);
    }

    this.Parameters.add(parameterName, parameterValue);
};

CAjax.prototype.__getXmlHttp = function()
{
    this.__HttpRequest = false;
    try
    {
        this.__HttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch(e)
    {
        try
        {
            this.__HttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch(e)
        {
            this.__HttpRequest = false;
        }
    }

    if (!this.__HttpRequest && typeof XMLHttpRequest != 'undefined')
    {
        this.__HttpRequest = new XMLHttpRequest();
    }

    return this.__HttpRequest;
};

CAjax.prototype._createRequestParameter = function()
{
    var keys = this.Parameters.getKeys();
    var keysNumber = keys.length;
    var parameters = [];
    for(var index = 0;index < keysNumber; ++index)
    {
        var key = keys[index];
        parameters.push(sprintf("%s=%s", key, encodeURIComponent(this.Parameters.item(key))))
    }

    return parameters.join('&');
};

CAjax.prototype.__createEncryptRequestParameter = function ()
{
    var keys = this.Parameters.getKeys();
    var keysNumber = keys.length;
    var parameterObject = new Object();
    for(var index = 0;index < keysNumber; ++index)
    {
        var key = keys[index];

        parameterObject[key] = encodeURIComponent(this.Parameters.item(key));
    }

    var parameterData = JSON.stringify(parameterObject);
    this.__Encrypt.encrypt(newGuid(), parameterData);
    var encryptData = BiBase64.encode(this.__Encrypt.getEncryptedData());
    return sprintf("%s=%s", CAjax.PARAMETER_DATA, encryptData);
};

CAjax.prototype.callAjax = function(isAsync)
{
    if(isAsync == null)
    {
        this.__IsAsync = true;
    }
    else
    {
        this.__IsAsync = isAsync;
    }

    var errorMessage = null;
    var httpRequest = this.__getXmlHttp();
    if(!httpRequest)
    {
        errorMessage = "create http request object failed.";
        if(this.Caller.onErrorCallback)
        {
            this.Caller.onErrorCallback(errorMessage);
        }
        else
        {
            writeLogMessage("ERROR", errorMessage);
        }

        return;
    }

    errorMessage = sprintf("Caller Id<%s> Ajax client Id<%s>.", this.Caller.getId(), this.Id);
    writeLogMessage("DEBUG", errorMessage);

    switch (this.MethodType)
    {
        case "GET":
            if(this.__IsEncryptData)
            {
                httpRequest.open(this.MethodType, sprintf("%s?%s", this.ServiceUrl, this.__createEncryptRequestParameter()), this.__IsAsync);
            }
            else
            {
                httpRequest.open(this.MethodType, sprintf("%s?%s", this.ServiceUrl, this._createRequestParameter()), this.__IsAsync);
            }

            httpRequest.Self = this;
            httpRequest.onreadystatechange = function()
            {
                if ((this.readyState == 4) && (this.status == 200))
                {
                    if(this.Self.Caller.setData)
                    {
                        this.Self.Caller.setData(httpRequest.responseText);
                    }
                    else
                    {
                        writeLogMessage("ERROR", "Not register onResponseCallback function");
                    }
                }
                else
                {
                    errorMessage = sprintf("Call service failed, error message<%s>.", this.HttpRequest.statusText);
                    if(this.Self.Caller.onErrorCallback)
                    {
                        this.Self.Caller.onErrorCallback(errorMessage);
                    }
                    else
                    {
                        writeLogMessage("ERROR", errorMessage);
                    }
                }
            };

            httpRequest.send();
            break;
        case "POST":
            httpRequest.open(this.MethodType, this.ServiceUrl, this.__IsAsync);
            //httpRequest.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
            httpRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            if(this.__IsAsync)
            {
                httpRequest.timeout = this.__TimeOut;
            }

            httpRequest.Self = this;
            httpRequest.onerror = function(evt)
            {
                if(this.Self.Caller.onError)
                {
                    this.Self.Caller.onError(evt.error);
                }
            };

            httpRequest.onabort = function(event)
            {
                if(event && event.cancelable)
                {
                    this.abort();
                }

                if(this.Self.Caller.onUserAbort)
                {
                    this.Self.Caller.onUserAbort("用户终止检索");
                }
            };

            httpRequest.ontimeout = function(evt)
            {
                if(evt && evt.cancelable)
                {
                    this.abort();
                }

                if(this.Self.Caller.onTimeOut)
                {
                    this.Self.Caller.onTimeOut("查询超时");
                }

                writeLogMessage("ERROR", "Request timeout.");
            };
            httpRequest.onloadstart = function()
            {
                if(this.Self.Caller.onLoadstart)
                {
                    this.Self.Caller.onLoadstart();
                }
                writeLogMessage("DEBUG", "Start load data.");
                return;
            };

            httpRequest.onloadend = function()
            {
                if(this.Self.Caller.onLoadend)
                {
                    this.Self.Caller.onLoadend();
                }

                writeLogMessage("DEBUG", "End load data.");
                return;
            };

            //httpRequest.addEventListener("progress", this.updateProgress, false);
            httpRequest.onprogress = function(evt)
            {
                if (evt.lengthComputable)
                {
                    var percentComplete = (evt.loaded / evt.total) * 100;
                    if(this.Self.Caller.updateProgress)
                    {
                        this.Self.Caller.updateProgress(percentComplete);
                    }

                    writeLogMessage("INFO", sprintf("Data load progress %.2f.", percentComplete));
                }
            };
            httpRequest.onreadystatechange = function()
            {
                this.Self.stateChange(this);
            };

            if(this.__IsEncryptData)
            {
                httpRequest.send(this.__createEncryptRequestParameter());
            }
            else
            {
                httpRequest.send(this._createRequestParameter());
            }
            break;
        default:
            errorMessage = "Method type error,must be get or post.";

            if(this.Self.Caller.onError)
            {
                this.Self.Caller.onError(errorMessage);
            }
            else
            {
                writeLogMessage("ERROR", errorMessage);
            }
            break;
    }

    return;
};

CAjax.prototype.abort = function()
{
    this.__HttpRequest.abort();
};

CAjax.prototype.stateChange = function(httpRequest)
{
    if (httpRequest.readyState == 4)
    {
        if (httpRequest.status == 200)
        {

            if(httpRequest.Self.Caller.setData)
            {
                httpRequest.Self.Caller.setData(httpRequest.responseText);
            }
            else
            {
                writeLogMessage("ERROR", "Not register onResponseCallback function");
            }
        }
        else
        {
            errorMessage = sprintf("Call service failed,state code <%d>,error message<%s>", httpRequest.status, httpRequest.statusText);
            if (httpRequest.Self.Caller.onError)
            {
                httpRequest.Self.Caller.onError(errorMessage);
            }
            writeLogMessage("ERROR", errorMessage);
        }
    }
};