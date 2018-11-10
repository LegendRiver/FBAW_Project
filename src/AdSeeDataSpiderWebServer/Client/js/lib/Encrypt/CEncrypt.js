/**
 * Created by zengtao on 10/19/16.
 */
function CEncrypt()
{
    Object.call(this);
    this.__DataBase64 = "";
    this.__KeyBase64 = "";
}

CEncrypt.HEX_CHAR = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
CEncrypt.prototype.getRandomHex = function(charNumber)
{
    var rangNumber = "";
    for (var i = 1; i <= charNumber; i++)
    {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        rangNumber += n;
    }

    return rangNumber.toUpperCase();
};

CEncrypt.prototype.encrypt = function(password, content)
{
    this.__DataBase64 = Aes.Ctr.encrypt(content, password, 256);
    this.__KeyBase64 = BiBase64.encode(password);
};

CEncrypt.prototype.decrypt = function (encryptContent, password)
{
    this.__KeyBase64 = BiBase64.decode(password);
    return Aes.Ctr.decrypt(encryptContent, this.__KeyBase64, 256);
};

CEncrypt.prototype.getEncryptedData = function ()
{
    var encryptData = new Object();
    encryptData["DATA_BASE64"] = this.__DataBase64;
    encryptData["KEY_BASE64"] = this.__KeyBase64;

    return JSON.stringify(encryptData);
};
