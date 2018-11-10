/**
 * Created by zengtao on 9/23/16.
 */

function CEliImageSlider()
{
    BiComponent.call(this); //call super
    this.setId(newGuid());
    this.setCssClassName("fact-eli-image-slider");
    this.__EliApplication = null;
    this.__ImageIndex = 0;
    this.__ImageArray = null;
    this.__ImageLabelContents = null;


    this.__ImageView = null;
    this.__ImageLabelBackground = null;
    this.__ImageLabel = null;
    this.__LeftButton = null;
    this.__RightButton = null;
    this.__ImageNavigationPanel = null;
    this.__ImageButtons = null;
}

CEliImageSlider.prototype = new BiComponent;
CEliImageSlider.prototype._className = "CEliImageSlider";


CEliImageSlider.LEFT_BUTTON_IMAGE = "/images/index/arrow-left.png";
CEliImageSlider.RIGHT_BUTTON_IMAGE = "/images/index/arrow-right.png";


CEliImageSlider.prototype.initObject = function (eliApplication, imagesArray, imageLabelContents)
{
    this.__ImageArray = [];
    this.__ImageLabelContents = [];
    this.__EliApplication = eliApplication;
    this.__ImageArray = this.__ImageArray.concat(imagesArray);
    this.__ImageLabelContents = this.__ImageLabelContents.concat(imageLabelContents);
    this.__ImageButtons = [];
    this.__initImageView();
    this.__initImageNavigationPanel();
    this.__initNavigationButtons();
    this.__showImage();
};

CEliImageSlider.prototype.__initNavigationButtons = function ()
{
    this.__LeftButton = new BiComponent();
    this.__LeftButton.setId(newGuid());
    this.__LeftButton.setCssClassName("fact-image-slider-navigation-button");
    this.__LeftButton.setStyleProperty("left", sprintf("%d%s", 2, "%"));
    this.__LeftButton.setBackgroundImage(CEliImageSlider.LEFT_BUTTON_IMAGE);
    this.__LeftButton.addEventListener("click", function (event)
    {
        if(this.__ImageIndex > 0)
        {
            this.__ImageIndex -= 1;
            this.__showImage();
        }
    }, this);

    this.add(this.__LeftButton);

    this.__RightButton = new BiComponent();
    this.__RightButton.setId(newGuid());
    this.__RightButton.setCssClassName("fact-image-slider-navigation-button");
    this.__RightButton.setStyleProperty("right", sprintf("%d%s", 2, "%"));
    this.__RightButton.setBackgroundImage(CEliImageSlider.RIGHT_BUTTON_IMAGE);
    this.__RightButton.addEventListener("click", function (event)
    {
        var imageNumber = this.__ImageArray.length;
        if(this.__ImageIndex < (imageNumber - 1))
        {
            this.__ImageIndex += 1;
            this.__showImage();
        }
    }, this);

    this.add(this.__RightButton);
};

CEliImageSlider.prototype.__initImageNavigationPanel = function ()
{
    this.__ImageNavigationPanel = new BiHBox("center", "center");
    this.__ImageNavigationPanel.setId(newGuid());
    this.__ImageNavigationPanel.setCssClassName("fact-image-slider-image-navigation");
    this.add(this.__ImageNavigationPanel);

    var imageButton = null;
    var imageLabel = null;
    var imageNumber = this.__ImageArray.length;
    for(var index = 0; index < imageNumber; ++index)
    {
        imageButton = new BiComponent();
        imageButton.setId(newGuid());
        imageButton.setCssClassName("fact-image-slider-image-navigation-button");
        imageButton.setStyleProperty("width", sprintf("%d%s", 15, "px"));
        imageButton.setStyleProperty("height", sprintf("%d%s", 15, "px"));
        imageButton.setUserData(index);
        imageButton.addEventListener("click", function (event)
        {
            var imageButton = event.getCurrentTarget();
            this.__ImageIndex =  parseInt(imageButton.getUserData());
            this.__showImage();
        }, this);

        imageLabel = new BiLabel();
        imageLabel.setId(newGuid());
        imageLabel.setStyleProperty("left", sprintf("%d%s", 0, "px"));
        imageLabel.setStyleProperty("top", sprintf("%d%s", 0, "px"));
        imageLabel.setStyleProperty("width", sprintf("%d%s", 15, "px"));
        imageLabel.setStyleProperty("height", sprintf("%d%s", 15, "px"));
        imageButton.add(imageLabel);
        this.__ImageNavigationPanel.add(imageButton);
        this.__ImageButtons.push(imageButton);

        var space = new BiLabel();
        space.setId(newGuid());
        space.setStyleProperty("width", sprintf("%d%s", 15, "px"));
        space.setStyleProperty("height", sprintf("%d%s", 15, "px"));
        this.__ImageNavigationPanel.add(space);
    }
};

CEliImageSlider.prototype.__showImage = function ()
{
    this.__ImageView.setBackgroundImage(this.__ImageArray[this.__ImageIndex]);
    this.__ImageLabel.setText(this.__ImageLabelContents[this.__ImageIndex]);
};

CEliImageSlider.prototype.__initImageView = function ()
{
    this.__ImageView = new BiComponent();
    this.__ImageView.setId(newGuid());
    this.__ImageView.setCssClassName("eli-product-index-image");
    this.add(this.__ImageView);

    this.__ImageLabelBackground = new BiComponent();
    this.__ImageLabelBackground.setId(newGuid());
    this.__ImageLabelBackground.setCssClassName("fact-image-slider-label-background");
    this.__ImageView.add(this.__ImageLabelBackground);

    this.__ImageLabel = new BiLabel();
    this.__ImageLabel.setId(newGuid());
    this.__ImageLabel.setCssClassName("fact-image-slider-label");
    this.__ImageLabel.setAlign("center");
    this.__ImageView.add(this.__ImageLabel);
};
