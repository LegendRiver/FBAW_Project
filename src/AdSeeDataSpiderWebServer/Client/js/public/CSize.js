/**
 * Created by zengtao on 3/3/15.
 */

function CSize(width, height)
{
    this.Width = width;
    this.Height = height;
}

CSize.prototype.initObject = function(width, height)
{
    this.Width = width;
    this.Height = height;
};

CSize.prototype.update = function(width, height)
{
    this.Width = width;
    this.Height = height;
};

CSize.prototype.toString = function()
{
    return sprintf("<%d,%d>", this.Width, this.Height);
};
