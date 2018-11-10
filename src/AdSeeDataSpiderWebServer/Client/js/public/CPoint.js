/**
 * Created by zengtao on 3/3/15.
 */

/**
 * CPoint类构造函数
 * @param xPos x坐标值
 * @param yPos y坐标值
 * @constructor
 */
function CPoint(xPos, yPos)
{
    this.x = xPos;
    this.y = yPos;
}


/**
 * 用坐标对象更新坐标
 * @param newPoint 坐标对象
 */
CPoint.prototype.update = function(newPoint)
{
    this.x = newPoint.x;
    this.y = newPoint.y;
};

CPoint.prototype.toString = function()
{
    return sprintf("%.4f %.4f", this.x, this.y);
};

CPoint.prototype.scale = function(scaleDelta)
{
    var point = new CPoint(0, 0);
    point.x = this.x * scaleDelta;
    point.y = this.y * scaleDelta;

    return point;
};

CPoint.prototype.distance = function(toPoint)
{
    return Math.sqrt(Math.pow((toPoint.x - this.x),2) + Math.pow((toPoint.y - this.y), 2));
};

CPoint.prototype.getCenterPoint = function(secondPoint)
{
    var centerPoint = new CPoint(0,0);
    var deltaX = (secondPoint.x - this.x) / 2;
    var deltaY = (secondPoint.y - this.y) / 2;

    if(deltaX < 0)
    {
        centerPoint.x = this.x - Math.abs(deltaX);
    }
    else
    {
        centerPoint.x = this.x + Math.abs(deltaX);
    }

    if(deltaY < 0)
    {
        centerPoint.y = this.y - Math.abs(deltaY);
    }
    else
    {
        centerPoint.y = this.y + Math.abs(deltaY);
    }

    return centerPoint;
};