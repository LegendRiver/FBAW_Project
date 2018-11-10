/**
 * Created by yangtian on 16/9/21.
 */

function CCampaignMainComponent()
{
    BiComponent.call(this);

    this.__BasicInfoComponent = null;
    this.__AdvanceInfoComponent = null;
    this.__BasicInfoComponentHeight = null;
    this.__AdvanceInfoComponentHeight = null;

    this.__SubmitButton = null;

    this.__Verification = null;

    this.__CampaignInfo = null;

}

CCampaignMainComponent.prototype = new BiComponent;
CCampaignMainComponent.prototype._className = "CCampaignMainComponent";

CCampaignMainComponent.prototype.initObject = function(eliApplication)
{
    this.__EliApplication = eliApplication;
    this._init();
};

CCampaignMainComponent.prototype._init = function()
{
    this._initVerification();
    this._initCampaignInfo();
    this._createBasicInfoComponent();
    this._createAdvanceInfoComponent();

    this._initSubmitButton();
};

CCampaignMainComponent.prototype._initCampaignInfo = function()
{
    if(!this.__CampaignInfo)
    {
        this.__CampaignInfo = new CCampaignInfo();
        this.__CampaignInfo.initObject(this.__EliApplication, this);
    }
};

CCampaignMainComponent.prototype._createBasicInfoComponent = function()
{
    if(!this.__BasicInfoComponent)
    {
        this.__BasicInfoComponent = new CBasicInfoComponent();
        this.__BasicInfoComponent.initObject(this.__EliApplication, this);
        this.__BasicInfoComponent.setLeft(0);
        this.__BasicInfoComponent.setRight(0);
        this.__BasicInfoComponent.setTop(0);
        this.__BasicInfoComponentHeight = this.__BasicInfoComponent.getLastPanelBottom();
        this.__BasicInfoComponent.setHeight(this.__BasicInfoComponentHeight);
        this.add(this.__BasicInfoComponent);
    }

    this.__BasicInfoComponent.setVisible(true);
};

CCampaignMainComponent.prototype._createAdvanceInfoComponent = function()
{
    if(!this.__AdvanceInfoComponent)
    {
        this.__AdvanceInfoComponent = new CAdvanceComponent();
        this.__AdvanceInfoComponent.initObject(this.__EliApplication, this);
        this.add(this.__AdvanceInfoComponent);
        this.__AdvanceInfoComponent.setTop(this.__BasicInfoComponentHeight);
        this.__AdvanceInfoComponent.setCssClassName("eli-campaign-advance-panel");
        this.__AdvanceInfoComponent.setLeft(0);
        this.__AdvanceInfoComponent.setRight(0);

        this.__AdvanceInfoComponentHeight = this.__AdvanceInfoComponent.getLastPanelBottom();
        this.__AdvanceInfoComponent.setHeight(this.__AdvanceInfoComponentHeight);
    }

    this.__AdvanceInfoComponent.setVisible(false);
};

CCampaignMainComponent.prototype.getBasicInfoComponent = function()
{
    return this.__BasicInfoComponent;
};

CCampaignMainComponent.prototype.getAdvanceInfoComponent = function()
{
    return this.__AdvanceInfoComponent;
};

CCampaignMainComponent.prototype._initSubmitButton = function()
{
    this.__SubmitButton = this.__BasicInfoComponent.getSubmitButton();
    this.__SubmitButton.addEventListener("click", function () {
        this._onSubmitButtonClick();
    }, this);
};

CCampaignMainComponent.prototype._initVerification = function()
{
    if(!this.__Verification)
    {
        this.__Verification = new CVerification();
        this.__Verification.initObject(this.__EliApplication);
    }
};

CCampaignMainComponent.prototype._onSubmitButtonClick = function()
{
    this.__BasicInfoComponent.basicInfoCheck();
};

CCampaignMainComponent.prototype.getVerification = function()
{
    return this.__Verification;
};

CCampaignMainComponent.prototype.getCampaignInfo = function()
{
    return this.__CampaignInfo;
};

