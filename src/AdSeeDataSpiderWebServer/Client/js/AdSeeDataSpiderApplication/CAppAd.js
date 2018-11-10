/**
 * Created by zengtao on 2/8/17.
 */

function CAppAd()
{
    Object.call(this);
    this.pageid = "";// : "414626141967240"
    this.pkg = "";// : "com.qihoo.security"
    this.actorName="";// : "360 Security - Antivirus"
    this.actorImg="";// : "https://piccdn.accimg.com/ddicon/0b9d9046fadac6e3d96cb8d0096fa087.jpg"
    this.actionCall="";// : "Install Now"
    this.postTitle="";// : "360 Security Center"
    this.promoTitle="";// : "360 Security - Antivirus"
    this.promoText="";// : ""
    this.promoImgNormal="";// : "ddimg/7b2ca146d903609f.png"
    this.logTime="";// : "2017-01-16 16:00:00"
    this.adTime="";// : "2017-01-16 00:47:35"
    this.createTime="";// : "2017-01-17 01:17:25"
    this.updateTime="";// : "2017-01-17 01:17:25"
    this.likeCount="";// : 0
    this.occurCount="";// : 31
    this.lastSeeTime="";// : "2017-01-16 16:00:00"
    this.audience="";//
    this.country="";//
    this.promoReasonSex="";//
    this.promoReasonAgeMin="";//
    this.promoReasonAgeMax="";//
    this.promoReasonSexIso="";//
    this.promoReasonMarriageStateIso="";//
    this.promoReasonCoutry="";//
    this.promoReasonAge="";// : "13岁以上"
    this.originalImg="";// : "1"
    this.cdnMarkImg="";// : "https://piccdn.accimg.com/ddimg/7b2ca146d903609f.png"
    this.cdnOriginImg="";// : "https://piccdn.accimg.com/ddoriginimg/329fd78831505afd.png"
    this.adCount="";// : 0
}

CAppAd.prototype.parse = function(appAdData)
{
    if(!appAdData)
    {
        return false;
    }

    this.pageid = appAdData.pageid;// : "414626141967240"
    this.pkg = appAdData.pkg;// : "com.qihoo.security"
    this.actorName= replaceAll(appAdData.actorName,'+', ' ');// : "360 Security - Antivirus"
    this.actorImg=appAdData.actorImg;// : "https://piccdn.accimg.com/ddicon/0b9d9046fadac6e3d96cb8d0096fa087.jpg"
    this.actionCall=appAdData.actionCall;// : "Install Now"
    this.postTitle= replaceAll(appAdData.postTitle, '+', ' ');// : "360 Security Center"
    this.promoTitle= replaceAll(appAdData.promoTitle, '+', ' ');// : "360 Security - Antivirus"
    this.promoText= replaceAll(appAdData.promoText, '+', " ");// : ""
    this.promoImgNormal=appAdData.promoImgNormal;// : "ddimg/7b2ca146d903609f.png"
    this.logTime= replaceAll(appAdData.logTime, '+', ' ');// : "2017-01-16 16:00:00"
    this.adTime= replaceAll(appAdData.adTime, '+', ' ');// : "2017-01-16 00:47:35"
    this.createTime= replaceAll(appAdData.createTime, '+', ' ');// : "2017-01-17 01:17:25"
    this.updateTime= replaceAll(appAdData.updateTime, '+', ' ');// : "2017-01-17 01:17:25"
    this.likeCount=appAdData.likeCount;// : 0
    this.occurCount=appAdData.occurCount;// : 31
    this.lastSeeTime= replaceAll(appAdData.lastSeeTime, '+', ' ');// : "2017-01-16 16:00:00"
    this.audience=appAdData.audience;//
    this.country=appAdData.country;//
    this.promoReasonSex=appAdData.promoReasonSex;//
    this.promoReasonAgeMin=appAdData.promoReasonAgeMin;//
    this.promoReasonAgeMax=appAdData.promoReasonAgeMax;//
    this.promoReasonSexIso=appAdData.promoReasonSexIso;//
    this.promoReasonMarriageStateIso=appAdData.promoReasonMarriageStateIso;//
    this.promoReasonCoutry=appAdData.promoReasonCoutry;//
    this.promoReasonAge=appAdData.promoReasonAge;// : "13岁以上"
    this.originalImg=appAdData.originalImg;// : "1"
    this.cdnMarkImg=appAdData.cdnMarkImg;// : "https://piccdn.accimg.com/ddimg/7b2ca146d903609f.png"
    this.cdnOriginImg=appAdData.cdnOriginImg;// : "https://piccdn.accimg.com/ddoriginimg/329fd78831505afd.png"
    this.adCount=appAdData.adCount;// : 0
    return true;
};