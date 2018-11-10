/**
 * Created by mac on 16/9/28.
 */

function CErrorCode()
{
    Object.call(this);

    this.__ServerErrorCode =
    {
        30003: "用户已存在",
        50002: "用户名或密码错误",
        10080: "旧密码错误",

        15001: '验证码错误',
        15000: '验证码过期'
    };

    this.__ServerErrorHash = new BiHashTable();

    this._init();
}

CErrorCode.prototype._init = function()
{
    this._initErrorHash();
};

CErrorCode.prototype._initErrorHash = function()
{
    for(var code in this.__ServerErrorCode)
    {
        this.__ServerErrorHash.add(code, this.__ServerErrorCode[code]);
    }
};

CErrorCode.prototype.getErrorHash = function()
{
    return this.__ServerErrorHash;
};