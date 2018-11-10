
function CCopyRightComponent()
{
    BiComponent.call(this); //call super
    this.setCssClassName("eli-copyright-component");
    this.__EliApplication = null;
    this.__CONTENT_PANEL_HEIGHT = 40;
    this.__ContentPanel = null;

    this.__CopyrightInformationLabel = null;
    this.__CopyrightContent = "Copyright © 2016 eliads.com. All Rights Reserved. 亿栗科技 版权所有 ";

    this.__ICPInformationLabel = null;
    this.__ICPContent = "京ICP证1234567号";

    this.__InternetInformationServiceRegistrationLabel = null;
    this.__InternetInformationServiceRegistrationContent = "京公网安备11111111111111号";
}

CCopyRightComponent.prototype = new BiComponent;
CCopyRightComponent.prototype._className = "CCopyRightComponent";

CCopyRightComponent.prototype.initObject = function(eliApplication)
{
    this.__EliApplication = eliApplication;
    this.__initContentPanel();
};

CCopyRightComponent.prototype.__initContentPanel = function()
{
    this.__ContentPanel = new BiHBox();
    this.__ContentPanel.setId(newGuid());
    this.__ContentPanel.setLeft(80);
    this.__ContentPanel.setTop(15);
    this.__ContentPanel.setRight(0);
    this.__ContentPanel.setHeight(this.__CONTENT_PANEL_HEIGHT);
    this.add(this.__ContentPanel);

    this.__initCopyrightInformation();
    //this.__initICPInformation();
    //this.__initInternetInformationServiceRegistration();
};

CCopyRightComponent.prototype.__initCopyrightInformation = function()
{
    this.__CopyrightInformationLabel = new BiLabel();
    this.__CopyrightInformationLabel.setId(newGuid());
    this.__CopyrightInformationLabel.setCssClassName("eli-copyright-information");
    this.__CopyrightInformationLabel.setText(this.__CopyrightContent);
    this.__ContentPanel.add(this.__CopyrightInformationLabel);
};

CCopyRightComponent.prototype.__initICPInformation = function()
{
    this.__ICPInformationLabel = new BiLabel();
    this.__ICPInformationLabel.setId(newGuid());
    this.__ICPInformationLabel.setCssClassName("eli-icp-information");
    this.__ICPInformationLabel.setText(this.__ICPContent);
    this.__ContentPanel.add(this.__ICPInformationLabel);
};

CCopyRightComponent.prototype.__initInternetInformationServiceRegistration = function()
{
    this.__InternetInformationServiceRegistrationLabel = new BiLabel();
    this.__InternetInformationServiceRegistrationLabel.setId(newGuid());
    this.__InternetInformationServiceRegistrationLabel.setCssClassName("eli-iisr-information");
    this.__InternetInformationServiceRegistrationLabel.setIcon(new BiImage("images/police.png", 20,20));
    this.__InternetInformationServiceRegistrationLabel.setIconPosition("left");
    this.__InternetInformationServiceRegistrationLabel.setText(this.__InternetInformationServiceRegistrationContent);
    this.__ContentPanel.add(this.__InternetInformationServiceRegistrationLabel);
};