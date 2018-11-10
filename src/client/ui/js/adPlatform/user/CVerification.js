/**
 * Created by mac on 16/9/27.
 */
function CVerification()
{
    Object.call(this);
    this.__EliApplication = null;

    this.__ErrorCode = {
        emailRight : 0,
        emailNull : 1,
        emailFormat : 2,
    };

    this.__Pattern = {
        email : /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
        phone : /^0?1[3|4|5|8][0-9]\d{8}$/,
    };

    this.__ErrorMsg = {
        emailFormat :"*格式错误",
        emailNull :"*不能为空",
        phoneNull : "*不能为空",
        phoneFormat : "*号码错误",
        passwordLen : "*长度至少6位",
        passwordSpace : "*密码不能含有空格",
        passwordNull : "*密码不能为空",
        userNameNull : "*用户名不能为空"
    };

}

CVerification.prototype.initObject = function(application)
{
    this.__EliApplication = application;
};

CVerification.prototype.checkEmail = function(email)
{
    if(email == null || email == "")
    {
        return this.__ErrorMsg.emailNull;
    }
    else if(this.__Pattern.email.test(email))
    {
        return 0;
    }
    else
    {
        return this.__ErrorMsg.emailFormat;
    }
};

CVerification.prototype.checkPhone = function(phone)
{
    if(phone == null || phone == "")
    {
        return this.__ErrorMsg.phoneNull;
    }
    else if(this.__Pattern.phone.test(phone))
    {
        return 0;
    }
    else
    {
        return this.__ErrorMsg.phoneFormat;
    }
};

CVerification.prototype.checkPassword = function(password)
{
    var len = password.length;

    if(password == null || password == "")
    {
        return this.__ErrorMsg.passwordNull;

    }

    if(len < 6)
    {
        return this.__ErrorMsg.passwordLen;
    }

    if(password.indexOf(" ") != -1)
    {
        return this.__ErrorMsg.passwordSpace;
    }
    return 0;
};

CVerification.prototype.checkUsername = function(username)
{
    if(username == null || username == "")
    {
        return this.__ErrorMsg.userNameNull;
    }

    return 0;
};

CVerification.prototype.getErrorCode = function()
{
    return this.__ErrorCode;
};

CVerification.prototype.getErrorMsg = function()
{
    return this.__ErrorMsg;
};

CVerification.prototype.inputCheck = function(input)
{
    if(input == null || input == "")
    {
        return "此项输入不能为空";
    }

    return 0;
};

CVerification.prototype.uploadFileCheck = function(id)
{
    if(id == null || id == "")
    {
        return "请上传营业执照";
    }

    return 0;
};