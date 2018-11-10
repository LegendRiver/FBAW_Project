/**
 * Created by zengtao on 2/8/17.
 */

function CAppAdComponent()
{
    BiComponent.call(this); //call super
    this.setId(newGuid());
    this.setCssClassName("eli-app-ad");
    this.__AdSeeDataSpiderApplication = null;
    this.__APP_ICON_SIZE = new CSize(100,100);
    this.__TEXT_ITEM_HEIGHT = 30;
    this.__AD_ITEM_HEIGHT = 430;
    this.__AD_DETAIL_WIDTH = 300;
    this.__AppIconControl = null;
    this.__AppNameControl = null;
    this.__CreateTimeControl = null;
    this.__AdContentContainer = null;
    this.__AdStyleControl = null;
    this.__AdDetailControl = null;
    this.__PromoTextControl = null;
    this.__AdMarkerImageControl = null;
    this.__PromoTitleControl = null;

    this.__ActionCallControl = null;

    this.__CountryControl = null;
    this.__LikeControl = null;
    this.__HeatControl = null;
    this.__FirstSeenControl = null;
    this.__LastSeenControl = null;
    this.__DurationControl = null;
    this.__AudienceAttributionControl = null;

    this.__AppAdData  = null;
}

CAppAdComponent.prototype = new BiComponent;
CAppAdComponent.prototype._className = "CAppAdComponent";

CAppAdComponent.prototype.initObject = function(adSeeDataSpiderApplication)
{
    this.__AdSeeDataSpiderApplication = adSeeDataSpiderApplication;
    this.__init();
};

CAppAdComponent.prototype.__init = function()
{
    this.__initAppIconControl();
    this.__initAppNameControl();
    this.__initCreateTimeControl();
    this.__initAdContentContainer();
};

CAppAdComponent.prototype.__initAppIconControl = function()
{
    this.__AppIconControl = new BiComponent();
    this.__AppIconControl.setId(newGuid());
    this.__AppIconControl.setCssClassName("eli-app-ad-app-icon");
    this.__AppIconControl.setLeft(0);
    this.__AppIconControl.setTop(0);
    this.__AppIconControl.setWidth(this.__APP_ICON_SIZE.Width);
    this.__AppIconControl.setHeight(this.__APP_ICON_SIZE.Height);
    this.add(this.__AppIconControl);
};

CAppAdComponent.prototype.__initAppNameControl = function()
{
    this.__AppNameControl = new BiLabel();
    this.__AppNameControl.setId(newGuid());
    this.__AppNameControl.setCssClassName("eli-app-ad-summary-label");
    this.__AppNameControl.setLeft(this.__APP_ICON_SIZE.Width);
    this.__AppNameControl.setTop(0);
    this.__AppNameControl.setRight(0);
    this.__AppNameControl.setHeight(this.__TEXT_ITEM_HEIGHT);
    this.add(this.__AppNameControl);
};

CAppAdComponent.prototype.__initCreateTimeControl = function()
{
    this.__CreateTimeControl = new BiLabel();
    this.__CreateTimeControl.setId(newGuid());
    this.__CreateTimeControl.setCssClassName("eli-app-ad-summary-label");
    this.__CreateTimeControl.setLeft(this.__APP_ICON_SIZE.Width);
    this.__CreateTimeControl.setTop(this.__AppNameControl.getTop() + this.__AppNameControl.getHeight() + 5);
    this.__CreateTimeControl.setRight(0);
    this.__CreateTimeControl.setHeight(this.__TEXT_ITEM_HEIGHT);
    this.add(this.__CreateTimeControl);
};

CAppAdComponent.prototype.__initAdContentContainer = function()
{
    this.__AdContentContainer = new BiComponent();
    this.__AdContentContainer.setId(newGuid());
    this.__AdContentContainer.setCssClassName("eli-app-ad-content-container");
    this.__AdContentContainer.setLeft(0);
    this.__AdContentContainer.setTop(this.__AppIconControl.getTop() + this.__AppIconControl.getHeight());
    this.__AdContentContainer.setRight(0);
    this.__AdContentContainer.setHeight(this.__AD_ITEM_HEIGHT);
    this.add(this.__AdContentContainer);

    this.__AdStyleControl = new BiComponent();
    this.__AdStyleControl.setId(newGuid());
    this.__AdStyleControl.setCssClassName("eli-app-ad-style");
    this.__AdStyleControl.setLeft(0);
    this.__AdStyleControl.setTop(0);
    this.__AdStyleControl.setRight(this.__AD_DETAIL_WIDTH);
    this.__AdStyleControl.setBottom(0);
    this.__AdContentContainer.add(this.__AdStyleControl);

    this.__PromoTextControl = new BiLabel();
    this.__PromoTextControl.setId(newGuid());
    this.__PromoTextControl.setCssClassName("eli-app-ad-summary-label");
    this.__PromoTextControl.setLeft(0);
    this.__PromoTextControl.setTop(0);
    this.__PromoTextControl.setRight(0);
    this.__PromoTextControl.setHeight(this.__TEXT_ITEM_HEIGHT);
    this.__AdStyleControl.add(this.__PromoTextControl);

    this.__AdMarkerImageControl = new BiComponent();
    this.__AdMarkerImageControl.setId(newGuid());
    this.__AdMarkerImageControl.setCssClassName("eli-app-marker-image");
    this.__AdMarkerImageControl.setLeft(0);
    this.__AdMarkerImageControl.setTop(this.__PromoTextControl.getTop() + this.__PromoTextControl.getHeight());
    this.__AdMarkerImageControl.setRight(0);
    this.__AdMarkerImageControl.setBottom(this.__TEXT_ITEM_HEIGHT);
    this.__AdMarkerImageControl.setHtmlProperty("title","Click show full image");
    this.__AdMarkerImageControl.addEventListener("click", function(event){
        this.__showFullImage();
    }, this);
    this.__AdStyleControl.add(this.__AdMarkerImageControl);

    this.__PromoTitleControl = new BiLabel();
    this.__PromoTitleControl.setId(newGuid());
    this.__PromoTitleControl.setCssClassName("eli-app-ad-summary-label");
    this.__PromoTitleControl.setLeft(0);
    this.__PromoTitleControl.setBottom(0);
    this.__PromoTitleControl.setRight(0);
    this.__PromoTitleControl.setHeight(this.__TEXT_ITEM_HEIGHT);
    this.__AdStyleControl.add(this.__PromoTitleControl);

    this.__ActionCallControl = new BiLabel();
    this.__ActionCallControl.setId(newGuid());
    this.__ActionCallControl.setCssClassName("eli-app-ad-action-call");
    this.__ActionCallControl.setRight(10);
    this.__ActionCallControl.setBottom(0);
    this.__ActionCallControl.setWidth(130);
    this.__ActionCallControl.setHeight(this.__TEXT_ITEM_HEIGHT);
    this.__AdStyleControl.add(this.__ActionCallControl);

    this.__AdDetailControl = new BiLabel();
    this.__AdDetailControl.setId(newGuid());
    this.__AdDetailControl.setCssClassName("eli-app-ad-detail");
    this.__AdDetailControl.setRight(0);
    this.__AdDetailControl.setTop(0);
    this.__AdDetailControl.setWidth(this.__AD_DETAIL_WIDTH);
    this.__AdDetailControl.setBottom(0);
    this.__AdContentContainer.add(this.__AdDetailControl);
    this.__initAdDetailItems();
};

CAppAdComponent.prototype.__initAdDetailItems = function()
{
    this.__CountryControl = new BiLabel();
    this.__CountryControl.setId(newGuid());
    this.__CountryControl.setCssClassName("eli-app-ad-summary-label");
    this.__CountryControl.setLeft(0);
    this.__CountryControl.setTop(0);
    this.__CountryControl.setRight(0);
    this.__CountryControl.setHeight(this.__TEXT_ITEM_HEIGHT);
    this.__AdDetailControl.add(this.__CountryControl);

    this.__LikeControl = new BiLabel();
    this.__LikeControl.setId(newGuid());
    this.__LikeControl.setCssClassName("eli-app-ad-summary-label");
    this.__LikeControl.setLeft(0);
    this.__LikeControl.setTop(this.__CountryControl.getTop() + this.__CountryControl.getHeight() + 5);
    this.__LikeControl.setRight(0);
    this.__LikeControl.setHeight(this.__TEXT_ITEM_HEIGHT);
    this.__AdDetailControl.add(this.__LikeControl);

    this.__HeatControl = new BiLabel();
    this.__HeatControl.setId(newGuid());
    this.__HeatControl.setCssClassName("eli-app-ad-summary-label");
    this.__HeatControl.setLeft(0);
    this.__HeatControl.setTop(this.__LikeControl.getTop() + this.__LikeControl.getHeight() + 5);
    this.__HeatControl.setRight(0);
    this.__HeatControl.setHeight(this.__TEXT_ITEM_HEIGHT);
    this.__AdDetailControl.add(this.__HeatControl);

    this.__FirstSeenControl = new BiLabel();
    this.__FirstSeenControl.setId(newGuid());
    this.__FirstSeenControl.setCssClassName("eli-app-ad-summary-label");
    this.__FirstSeenControl.setLeft(0);
    this.__FirstSeenControl.setTop(this.__HeatControl.getTop() + this.__HeatControl.getHeight() + 5);
    this.__FirstSeenControl.setRight(0);
    this.__FirstSeenControl.setHeight(this.__TEXT_ITEM_HEIGHT);
    this.__AdDetailControl.add(this.__FirstSeenControl);

    this.__LastSeenControl = new BiLabel();
    this.__LastSeenControl.setId(newGuid());
    this.__LastSeenControl.setCssClassName("eli-app-ad-summary-label");
    this.__LastSeenControl.setLeft(0);
    this.__LastSeenControl.setTop(this.__FirstSeenControl.getTop() + this.__FirstSeenControl.getHeight() + 5);
    this.__LastSeenControl.setRight(0);
    this.__LastSeenControl.setHeight(this.__TEXT_ITEM_HEIGHT);
    this.__AdDetailControl.add(this.__LastSeenControl);

    this.__AudienceAttributionControl = new BiLabel();
    this.__AudienceAttributionControl.setId(newGuid());
    this.__AudienceAttributionControl.setCssClassName("eli-app-ad-summary-label");
    this.__AudienceAttributionControl.setLeft(0);
    this.__AudienceAttributionControl.setTop(this.__LastSeenControl.getTop() + this.__LastSeenControl.getHeight() + 5);
    this.__AudienceAttributionControl.setRight(0);
    this.__AudienceAttributionControl.setHeight(this.__TEXT_ITEM_HEIGHT);
    this.__AdDetailControl.add(this.__AudienceAttributionControl);

    this.__AudienceControl = new BiTextArea();
    this.__AudienceControl.setId(newGuid());
    this.__AudienceControl.setCssClassName("eli-app-ad-text-area");
    this.__AudienceControl.setLeft(0);
    this.__AudienceControl.setTop(this.__AudienceAttributionControl.getTop() + this.__AudienceAttributionControl.getHeight() + 5);
    this.__AudienceControl.setRight(0);
    this.__AudienceControl.setBottom(5);
    this.__AdDetailControl.add(this.__AudienceControl);
};

CAppAdComponent.prototype.setAppAdData = function(appAdData)
{
    this.__AppAdData = appAdData;
    this.__PromoTextControl.setText(this.__AppAdData.promoText);
    this.__PromoTitleControl.setText(this.__AppAdData.promoTitle);
    this.__AppIconControl.setBackgroundImage(this.__AppAdData.actorImg);
    this.__AppNameControl.setText(this.__AppAdData.actorName);
    this.__AdMarkerImageControl.setBackgroundImage(this.__AppAdData.cdnMarkImg);
    this.__ActionCallControl.setText(this.__AppAdData.actionCall);
    this.__CreateTimeControl.setText(sprintf("Create Time:%s", this.__AppAdData.createTime));

    this.__CountryControl.setText(sprintf("Country:%s",this.__AppAdData.audience.country.join(" ")));
    this.__LikeControl.setText(sprintf("Like:%s",this.__AppAdData.likeCount));
    this.__HeatControl.setText(sprintf("Heat:%s",this.__AppAdData.occurCount));
    this.__FirstSeenControl.setText(sprintf("First Seen:%s",this.__AppAdData.createTime));
    this.__LastSeenControl.setText(sprintf("Last Seen:%s",this.__AppAdData.lastSeeTime));
    //var days = Math.ceil((Date.parse(this.__AppAdData.lastSeeTime)  - Date.parse(this.__AppAdData.createTime)) / 24*60*60*1000);
    this.__AudienceControl.setText(JSON.stringify(this.__AppAdData.audience));
    this.__AudienceAttributionControl.setText(sprintf("Audience Attribution:%s",this.__AppAdData.audience.promoReasonAge));
};

CAppAdComponent.prototype.__showFullImage = function()
{
    var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
    window.open(this.__AppAdData.cdnOriginImg, "_blank", strWindowFeatures);
};