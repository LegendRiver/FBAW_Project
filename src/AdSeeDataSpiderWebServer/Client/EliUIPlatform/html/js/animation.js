/*
 * Bindows 4.2
 * http://www.bindows.net/
 * Copyright (c) 2003-2013 MB Technologies
 *
 * Bindows(tm) belongs to MB Technologies (Georgia, USA). All rights reserved.
 * You are not allowed to copy or modify this code. Commercial use requires
 * license.
 */
function BiMath() {
    if (_biInPrototype) return;
    BiObject.call(this);
}
_p = _biExtend(BiMath, BiObject, "BiMath");
BiMath.drawLine = function (x1, y1, x2, y2) {
    var line = new BiLine();
    var steep = Math.abs(y2 - y1) > Math.abs(x2 - x1);
    if (steep) {
        var t = y1;
        y1 = x1;
        x1 = t;
        t = y2;
        y2 = x2;
        x2 = t;
    }
    var deltaX = Math.abs(x2 - x1);
    var deltaY = Math.abs(y2 - y1);
    var error = 0;
    var xStep;
    var yStep;
    var x = x1;
    var y = y1;
    if (x1 < x2) {
        xStep = 1;
    } else {
        xStep = -1;
    } if (y1 < y2) {
        yStep = 1;
    } else {
        yStep = -1;
    } if (steep) {
        line.addPoint(y, x);
    } else {
        line.addPoint(x, y);
    }
    while (x != x2) {
        x = x + xStep;
        error = error + deltaY;
        if (2 * error >= deltaX) {
            y = y + yStep;
            error = error - deltaX;
        }
        if (steep) {
            line.addPoint(y, x);
        } else {
            line.addPoint(x, y);
        }
    }
    return line;
};
BiMath.constantSpeed = function (curPosMs, startPosPx, distance, timeMs) {
    return distance * curPosMs / timeMs + startPosPx;
};
BiMath.slowToFast = function (curPosMs, startPosPx, distance, timeMs) {
    return distance * (curPosMs /= timeMs) * curPosMs + startPosPx;
};
BiMath.fastToSlow = function (curPosMs, startPosPx, distance, timeMs) {
    return -distance * (curPosMs /= timeMs) * (curPosMs - 2) + startPosPx;
};
BiMath.slowToSlow = function (curPosMs, startPosPx, distance, timeMs) {
    if ((curPosMs /= timeMs / 2) < 1) return distance / 2 * curPosMs * curPosMs + startPosPx;
    return -distance / 2 * ((--curPosMs) * (curPosMs - 2) - 1) + startPosPx;
};

function BiLine() {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._points = new Array();
};
_p = _biExtend(BiLine, BiObject, "BiLine");
_p._className = "BiLine";
_p._points = null;
_p.addPoint = function (x, y) {
    var p = [x, y];
    this._points.push(p);
};
_p.getXAt = function (index) {
    return this._points[index][0];
};
_p.getYAt = function (index) {
    return this._points[index][1];
};
_p.getLength = function () {
    return this._points.length;
};
_p.reverse = function () {
    this._points.reverse();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiObject.prototype.dispose.call(this);
    this._points = null;
};

function BiFrameProgressionEvent(sType, generator) {
    if (_biInPrototype) return;
    BiEvent.call(this, sType);
    this._generator = generator;
}
_p = _biExtend(BiFrameProgressionEvent, BiEvent, "BiFrameProgressionEvent");
_p._generator = null;
_p.getFPSGenerator = function () {
    return this._generator;
};
_p.dispose = function () {
    if (this._disposed) return;
    BiEvent.prototype.dispose.call(this);
    this._generator = null;
};

function BiFpsGenerator(nFps) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    nFps = nFps || BiFpsGenerator.DEFAULT_FRAME_RATE;
    this.setFrameRate(nFps);
    var oThis = this;
    this._onTick = function () {
        oThis._run();
    };
    this._timerId = 0;
};
_p = _biExtend(BiFpsGenerator, BiEventTarget, "BiFpsGenerator");
_p._className = "BiFpsGenerator";
_p._runningAnimations = 0;
_p._adaptiveFps = false;
BiFpsGenerator.STRING_FRAMEPROGRESSION = "frameprogression";
_p.addEventListener = function () {
    var a0 = arguments[0];
    if (a0 == BiFpsGenerator.STRING_FRAMEPROGRESSION || (a0 instanceof BiEventListener && a0.getType() == BiFpsGenerator.STRING_FRAMEPROGRESSION)) {
        this.start();
    }
    BiEventTarget.prototype.addEventListener.apply(this, arguments);
};
_p.removeEventListener = function () {
    BiEventTarget.prototype.removeEventListener.apply(this, arguments);
    if (!this._listenersCount || !this._listeners[BiFpsGenerator.STRING_FRAMEPROGRESSION]) {
        this.stop();
    }
};
BiFpsGenerator.DEFAULT_FRAME_RATE = 50;
BiFpsGenerator.globalInstance = null;
_p._fps = null;
_p._curFrame = 0;
_p._started = false;
BiFpsGenerator.create = function (nFps) {
    if (nFps < 1) throw new Error("frame rate must be at least 1");
    if (!nFps || nFps == BiFpsGenerator.DEFAULT_FRAME_RATE) {
        if (BiFpsGenerator.globalInstance == null) {
            var g = BiFpsGenerator.globalInstance = new BiFpsGenerator(nFps);
            if (g._adaptiveFps) {
                var afc = new BiAdaptiveFpsCalculator(nFps, g._delay, nFps);
                g._setAdaptiveFpsCalculator(afc);
            }
        }
        return BiFpsGenerator.globalInstance;
    } else {
        return new BiFpsGenerator(nFps);
    }
};
_p._setAdaptiveFpsCalculator = function (oAfc) {
    this._Afc = oAfc;
};
_p.start = function () {
    if (this._started) return;
    this._started = true;
    this._run();
};
_p.stop = function () {
    clearTimeout(this._timerId);
    this._started = false;
};
_p.isGlobalGenerator = function () {
    return typeof BiFpsGenerator.globalInstance != "undefined" && this == BiFpsGenerator.globalInstance;
};
_p.setFrameRate = function (nFps) {
    this._fps = nFps;
    this._delay = this._fpsToMs(nFps);
};
_p.getFrameRate = function () {
    return this._fps;
};
_p._run = function () {
    if (!this._started) return;
    if (this._Afc != null) this._Afc.measure();
    this._updateCurFrame();
    this._notifyList();
    application.flushLayoutQueue();
    this._timerId = setTimeout(this._onTick, this._delay);
};
_p._updateCurFrame = function () {
    if (this._curFrame == this._fps) this._curFrame = 1;
    else this._curFrame++;
};
_p._fpsToMs = function (nFps) {
    return 1000 / nFps;
};
_p._notifyList = function () {
    this.dispatchEvent(new BiFrameProgressionEvent(BiFpsGenerator.STRING_FRAMEPROGRESSION, this));
};
_p.getCurrentFrame = function () {
    return this._curFrame;
};
_p.dispose = function () {
    if (this._disposed) return;
    if (typeof BiFpsGenerator.globalInstance != "undefined" && this == BiFpsGenerator.globalInstance) {
        return;
    }
    BiEventTarget.prototype.dispose.call(this);
    delete this._onTick;
};

function BiComponentAnimation(oComp, nFrameRate, bAutoStart) {
    if (_biInPrototype) return;
    BiEventTarget.call(this);
    this._autoStart = bAutoStart || false;
    nFrameRate = nFrameRate || BiFpsGenerator.DEFAULT_FRAME_RATE;
    this._curRange = 0;
    this._posMs = 0;
    this._generator = BiFpsGenerator.create(nFrameRate);
    this._components = new Array();
    this._animRanges = new Array();
    if (oComp) this.addComponent(oComp);
}
_p = _biExtend(BiComponentAnimation, BiEventTarget, "BiComponentAnimation");
BiComponentAnimation.CONSTANT_SPEED = 0;
BiComponentAnimation.SLOW_TO_FAST = 1;
BiComponentAnimation.FAST_TO_SLOW = 2;
BiComponentAnimation.SLOW_TO_SLOW = 3;
_p._animRanges = null;
_p._curRange = null;
_p._posMs = null;
_p._looping = false;
_p._components = null;
_p._running = false;
_p.getCurrentPosition = function () {
    return this._posMs;
};
_p.getCurrentAnimationRange = function () {
    return this._curRange;
};
_p.getAnimationRange = function (nIndex) {
    return this._animRanges[nIndex];
};
_p._autoStart = false;
_p.rewind = function () {
    var oldRunning = this._running;
    if (this._running) this.stop();
    for (var i = 0; i < this._animRanges.length; i++) {
        this._animRanges[i].rewind();
    }
    this._curRange = 0;
    this._posMs = 0;
    if (oldRunning) this.start();
};
_p.getFrameRate = function () {
    return this.getGenerator().getFrameRate();
};
_p.setFrameRate = function (fps) {
    this.getGenerator().setFrameRate(fps);
};
_p.start = function () {
    if (!this._running) {
        this._running = true;
        this._generator.addEventListener("frameprogression", this._onFrameProgression, this);
    }
};
_p.stop = function () {
    if (this._running) {
        this._running = false;
        this._generator.removeEventListener("frameprogression", this._onFrameProgression, this);
    }
};
BiComponentAnimation.addProperty("looping", BiAccessType.READ_WRITE);
_p.setAutoStart = function (b) {
    this._autoStart = b;
};
_p.getGenerator = function () {
    return this._generator;
};
_p.setGenerator = function (oGenerator) {
    if (!oGenerator) throw new Error("The generator must not be set to null");
    if (!(oGenerator instanceof BiFpsGenerator)) throw new Error("The generator must be of type BiFpsGenerator");
    if (this._generator && !this._generator.isGlobalGenerator()) this._generator.dispose();
    this._generator = oGenerator;
};
_p.dispose = function () {
    if (this._disposed) return;
    this.stop();
    BiEventTarget.prototype.dispose.call(this);
    if (!this._generator.isGlobalGenerator()) this._generator.dispose();
    this.disposeFields("_animRanges", "_curRange");
    for (var i = 0; i < this._components.length; i++) {
        this._components[i].removeEventListener("dispose", this._onComponentDisposed, this);
    }
    this._components = null;
};
_p.addComponent = function (oComp) {
    this._components.push(oComp);
    if (this._autoStart) {
        this.start();
        this._autoStart = false;
    }
    oComp.addEventListener("dispose", this._onComponentDisposed, this);
};
_p._onComponentDisposed = function (e) {
    this.removeComponent(e.getTarget());
    if (this._components.length == 0) {
        this.stop();
    }
};
_p.pushAnimationRange = function (oRange) {
    this._animRanges.push(oRange);
};
_p.removeAnimationRange = function () {
    this._animRanges.pop();
};
_p.clearAllAnimationRanges = function () {
    this._animRanges = null;
};
_p._createDefaultAnimationRange = function (nStartValue, nEndValue, nAccType, nSpeed) {
    this._animRanges[0] = null;
    this._animRanges[0] = new BiAnimationRange(nStartValue, nEndValue, nAccType, nSpeed);
    return this._animRanges[0];
};
_p.getDefaultAnimationRange = function () {
    return this._animRanges[0];
};
_p.removeComponent = function (oComp) {
    this._components.remove(oComp);
    oComp.removeEventListener("dispose", this._onComponentDisposed, this);
};
_p._onFrameProgression = function (e) {
    if (!this._running) return;
    this._curFrame = e.getFPSGenerator().getCurrentFrame();
    var fps = e.getFPSGenerator().getFrameRate();
    this._posMs += (1000 / fps);
    var oRange = this._animRanges[this._curRange];
    oRange.displace(this._posMs);
    var valuePos = oRange.getCurValue();
    this.onFrameProgression(valuePos);
    this.dispatchEvent(e);
    if (oRange.positionAtMax()) {
        this._onMax();
    }
};
_p._nextRange = function () {
    this._curRange++;
    if (this._curRange > this._animRanges.length - 1) {
        this._curRange = 0;
    }
};
_p.onFrameProgression = function (pos) {};
_p.onMax = function () {
    var e = new BiFrameProgressionEvent("animationend", this);
    this.dispatchEvent(e);
    e.dispose();
    e = null;
};
_p._onMax = function () {
    this._animRanges[this._curRange].rewind();
    this._posMs = 0;
    var bLastRange = false;
    var numRanges = this._animRanges.length;
    if (numRanges == this._curRange + 1) bLastRange = true;
    if (!bLastRange) this._nextRange();
    if (bLastRange && this._looping) {
        this._curRange = 0;
    }
    if (bLastRange && !this._looping) {
        this.stop();
    }
    this.onMax();
};

function BiOpacityAnimator(fMinOpacity, nSpeed, bLoop, nAccType, oComp, nFrameRate, bAutoStart, bForward) {
    if (_biInPrototype) return;
    BiComponentAnimation.call(this, oComp, nFrameRate, bAutoStart);
    if (fMinOpacity == null) fMinOpacity = 0.2;
    this.setMinOpacity(fMinOpacity);
    nSpeed = nSpeed || 500;
    nAccType = nAccType || BiComponentAnimation.CONSTANT_SPEED;
    var oRange = new BiAnimationRange(0, 100, nAccType, nSpeed);
    this.pushAnimationRange(oRange);
    this._directionForward = bForward;
    this.setLooping(bLoop);
};
_p = _biExtend(BiOpacityAnimator, BiComponentAnimation, "BiOpacityAnimator");
_p._minOpacity = null;
_p._directionForward = null;
BiOpacityAnimator.SPEED1 = 2500;
BiOpacityAnimator.SPEED2 = 1500;
BiOpacityAnimator.SPEED3 = 1000;
BiOpacityAnimator.SPEED4 = 800;
BiOpacityAnimator.SPEED5 = 200;
_p.rewind = function () {
    this._directionForward = true;
    BiComponentAnimation.prototype.rewind.call(this);
};
_p.setType = function (sType, nSpeed) {
    switch (sType) {
    case "pulsate":
        this._updateDefaultRange(BiComponentAnimation.SLOW_TO_SLOW, BiOpacityAnimator.SPEED3);
        this.setLooping(true);
        break;
    case "blink":
        this._updateDefaultRange(BiComponentAnimation.CONSTANT_SPEED, nSpeed || 70);
        this.setLooping(true);
        break;
    case "fadeIn":
        this._directionForward = true;
        this._updateDefaultRange(BiComponentAnimation.CONSTANT_SPEED, nSpeed || 3000);
        this.setLooping(false);
        break;
    case "fadeOut":
        this._directionForward = false;
        this._updateDefaultRange(BiComponentAnimation.CONSTANT_SPEED, nSpeed || 3000);
        this.setLooping(false);
        break;
    default:
        throw new Error("Unknown opacity animator type: " + sType);
    }
};
BiOpacityAnimator.createPulse = function (oComp, nSpeed, fMinOpacity) {
    var anim = new BiOpacityAnimator(fMinOpacity, nSpeed, true, null, oComp, null, true);
    anim.setType("pulsate", nSpeed);
    return anim;
};
BiOpacityAnimator.createBlink = function (oComp, nSpeed, fMinOpacity) {
    var anim = new BiOpacityAnimator(fMinOpacity, nSpeed, true, null, oComp, null, true);
    anim.setType("blink", nSpeed);
    return anim;
};
BiOpacityAnimator.createLimitedBlink = function (oComp, nSpeed, fMinOpacity, nNumBlinks) {
    nNumBlinks |= 10;
    fMinOpacity |= 0;
    var anim = new BiOpacityAnimator(fMinOpacity, nSpeed, true, null, oComp, null, true);
    anim.setType("blink", nSpeed);
    anim.blinkCount = 0;
    anim.addEventListener("animationend", function () {
        anim.blinkCount++;
        if (anim.blinkCount == nNumBlinks) {
            anim.stop();
            anim.dispose();
            anim = null;
        }
    }, this);
};
BiOpacityAnimator.createFadeIn = function (oComp, nSpeed) {
    var anim = new BiOpacityAnimator(0, nSpeed, true, null, oComp, null, true);
    anim.setType("fadeIn", nSpeed);
    anim.addEventListener("animationend", function () {
        anim.stop();
        anim.dispose();
        anim = null;
    }, this);
};
BiOpacityAnimator.createFadeOut = function (oComp, nSpeed) {
    var anim = new BiOpacityAnimator(0, nSpeed, true, null, oComp, null, false);
    anim.setType("fadeOut", nSpeed);
    anim.start();
    anim.addEventListener("animationend", function () {
        anim.stop();
        anim.dispose();
        anim = null;
    }, this);
};
_p.setMinOpacity = function (fMinOpacity) {
    this._minOpacity = fMinOpacity;
};
_p.onFrameProgression = function (pos) {
    if (!this._directionForward) pos = this._reversePosition(pos);
    var comps = this._components;
    for (var i = 0; i < comps.length; i++) {
        var c = comps[i];
        c.setOpacity((pos / 100) + this._minOpacity);
    }
};
_p.setSpeed = function (nSpeed) {
    if (typeof nSpeed == "string") {
        if (nSpeed == "slowest") {
            this._updateDefaultRange(null, BiOpacityAnimator.SPEED1);
        } else if (nSpeed == "slow") {
            this._updateDefaultRange(null, BiOpacityAnimator.SPEED2);
        } else if (nSpeed == "normal") {
            this._updateDefaultRange(null, BiOpacityAnimator.SPEED3);
        } else if (nSpeed == "fast") {
            this._updateDefaultRange(null, BiOpacityAnimator.SPEED4);
        } else if (nSpeed == "fastest") {
            this._updateDefaultRange(null, BiOpacityAnimator.SPEED5);
        } else {
            throw new Error("Unknown speed constant: " + nSpeed);
        }
    } else {
        this._updateDefaultRange(null, nSpeed);
    }
};
_p._updateDefaultRange = function (nAccType, nSpeed) {
    var oldRange = this._animRanges[0];
    nAccType = nAccType || oldRange.getAccType() || BiComponentAnimation.CONSTANT_SPEED;
    nSpeed = nSpeed || oldRange.getTime() || 2000;
    this._animRanges[0] = null;
    this._animRanges[0] = new BiAnimationRange(0, 100, nAccType, nSpeed);
};
_p.onMax = function () {
    BiComponentAnimation.prototype.onMax.call(this);
    this._directionForward = !this._directionForward;
};
_p._reversePosition = function (pos) {
    return Math.abs(pos - 100) + this._minOpacity;
};

function BiLocationAnimator(x1, y1, x2, y2, nSpeed, bLoop, nAccType, oComp, nFrameRate, bAutoStart) {
    if (_biInPrototype) return;
    BiComponentAnimation.call(this, oComp, nFrameRate, bAutoStart);
    this._lines = new Array();
    this._fromComp = null;
    this._toComp = null;
    application.getWindow().addEventListener("resize", this._onWindowResize, this);
    x1 |= 0;
    y1 |= 0;
    x2 |= 0;
    y2 |= 0;
    nSpeed |= 500;
    nAccType |= BiComponentAnimation.CONSTANT_SPEED;
    this.pushPath(x1, y1, x2, y2, nSpeed, nAccType);
    this.setLooping(bLoop);
};
_p = _biExtend(BiLocationAnimator, BiComponentAnimation, "BiLocationAnimator");
_p._lines = null;
_p._fromComp = null;
_p._toComp = null;
_p._usingSetFromTop = -1;
_p._usingSetFromBottom = -1;
_p._usingSetFromLeft = -1;
_p._usingSetFromRight = -1;
_p._usingSetToTop = -1;
_p._usingSetToBottom = -1;
_p._usingSetToLeft = -1;
_p._usingSetToRight = -1;
BiLocationAnimator.SPEED1 = 9000;
BiLocationAnimator.SPEED2 = 4000;
BiLocationAnimator.SPEED3 = 1200;
BiLocationAnimator.SPEED4 = 500;
BiLocationAnimator.SPEED5 = 200;
_p.pushPath = function (x1, y1, x2, y2, nSpeed, nAccType) {
    x1 |= 0;
    y1 |= 0;
    x2 |= 0;
    y2 |= 0;
    nSpeed |= 500;
    nAccType |= BiComponentAnimation.CONSTANT_SPEED;
    var line = BiMath.drawLine(x1, y1, x2, y2);
    this._lines.push(line);
    var oRange = new BiAnimationRange(0, line.getLength() - 1, nAccType, nSpeed);
    this.pushAnimationRange(oRange);
};
_p.popPath = function () {
    var l = this._lines.pop();
    l.dispose();
    l = null;
};
_p._createDefaultPath = function (x1, y1, x2, y2) {
    var line = BiMath.drawLine(x1, y1, x2, y2);
    if (typeof this._lines[0] != "undefined") this._lines[0].dispose();
    this._lines[0] = line;
    return line.getLength();
};
_p.getMotionPaths = function () {
    return this._lines;
};
_p._createDefaultAnimationRange = function (nLength, nAccType, nSpeed) {
    this._animRanges[0] = null;
    this._animRanges[0] = new BiAnimationRange(0, nLength, nAccType, nSpeed);
};
_p._updateDefaultMotionPath = function (x1, y1, x2, y2, nLength, nAccType, nSpeed) {
    var oldPath = this._lines[0];
    x1 = x1 || oldPath.getXAt(0) || 0;
    y1 = y1 || oldPath.getYAt(0) || 0;
    x2 = x2 || oldPath.getXAt(oldPath.getLength() - 1) || 0;
    y2 = y2 || oldPath.getYAt(oldPath.getLength() - 1) || 0;
    var oldRange = this._animRanges[0];
    nAccType = nAccType || oldRange.getAccType() || BiComponentAnimation.CONSTANT_SPEED;
    nSpeed = nSpeed || oldRange.getTime() || 500;
    var mPLength = this._createDefaultPath(x1, y1, x2, y2);
    this._createDefaultAnimationRange(mPLength - 1, nAccType, nSpeed);
};
_p.setFromTo = function (x1, y1, x2, y2) {
    this._updateDefaultMotionPath(x1, y1, x2, y2);
};
_p.setFromX = function (x1) {
    this._updateDefaultMotionPath(x1);
};
_p.setFromY = function (y1) {
    this._updateDefaultMotionPath(null, y1);
};
_p.setToX = function (x2) {
    this._updateDefaultMotionPath(null, null, x2);
};
_p.setToY = function (y2) {
    this._updateDefaultMotionPath(null, null, null, y2);
};
_p.setAccType = function (nAccType) {
    this._updateDefaultMotionPath(null, null, null, null, null, nAccType);
};
_p.setSpeed = function (nSpeed) {
    if (typeof nSpeed == "string") {
        if (nSpeed == "slowest") {
            nSpeed = BiLocationAnimator.SPEED1;
        } else if (nSpeed == "slow") {
            nSpeed = BiLocationAnimator.SPEED2;
        } else if (nSpeed == "normal") {
            nSpeed = BiLocationAnimator.SPEED3;
        } else if (nSpeed == "fast") {
            nSpeed = BiLocationAnimator.SPEED4;
        } else if (nSpeed == "fastest") {
            nSpeed = BiLocationAnimator.SPEED5;
        } else {
            throw new Error("BiLocationAnimator: Unknown speed constant: " + nSpeed);
        }
    }
    this._updateDefaultMotionPath(null, null, null, null, null, null, nSpeed);
};
_p.onFrameProgression = function (pos) {
    var x = this._lines[this._curRange].getXAt(pos);
    var y = this._lines[this._curRange].getYAt(pos);
    var comps = this._components;
    for (var i = 0; i < comps.length; i++) {
        var c = comps[i];
        c.setLocation(x, y);
    }
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponentAnimation.prototype.dispose.call(this);
    if (this._fromComp) {
        this._fromComp.removeEventListener("resize", this._onFromComponentChanged, this);
        this._fromComp.removeEventListener("move", this._onFromComponentChanged, this);
        if (this._fromComp instanceof BiImage) this._fromComp.removeEventListener("load", this._onFromComponentChanged, this);
        this._fromComp = null;
    }
    if (this._toComp) {
        this._toComp.removeEventListener("resize", this._onToComponentChanged, this);
        this._toComp.removeEventListener("move", this._onToComponentChanged, this);
        if (this._toComp instanceof BiImage) this._toComp.removeEventListener("load", this._onToComponentChanged, this);
        this._toComp = null;
    }
    application.getWindow().removeEventListener("resize", this._onWindowResize, this);
    this.disposeFields("line");
};
_p.setType = function (sType) {
    switch (sType) {
    case "normal":
        this.setSpeed(BiSizeAnimator.SPEED4);
        this.setAccType(BiComponentAnimation.CONSTANT_SPEED);
        break;
    case "smooth":
        this.setSpeed(BiSizeAnimator.SPEED4);
        this.setAccType(BiComponentAnimation.SLOW_TO_SLOW);
        break;
    default:
        throw new Error("Unkown size animator type:" + sType);
    }
};
_p._onWindowResize = function () {
    if (!this._fromComp) {
        this._onFromComponentChanged();
    }
    if (!this._toComp) {
        this._onToComponentChanged();
    }
};
_p._onFromComponentChanged = function () {
    if (this._usingSetFromTop != -1) this.setFromTop(this._usingSetFromTop);
    if (this._usingSetFromBottom != -1) this.setFromBottom(this._usingSetFromBottom);
    if (this._usingSetFromLeft != -1) this.setFromLeft(this._usingSetFromLeft);
    if (this._usingSetFromRight != -1) this.setFromRight(this._usingSetFromRight);
};
_p._onToComponentChanged = function () {
    if (this._usingSetToTop != -1) this.setToTop(this._usingSetToTop);
    if (this._usingSetToBottom != -1) this.setToBottom(this._usingSetToBottom);
    if (this._usingSetToLeft != -1) this.setToLeft(this._usingSetToLeft);
    if (this._usingSetToRight != -1) this.setToRight(this._usingSetToRight);
};
_p.setFromComponent = function (oComp) {
    if (this._fromComp || oComp == null) {
        this._fromComp.removeEventListener("resize", this._onFromComponentChanged, this);
        this._fromComp.removeEventListener("move", this._onFromComponentChanged, this);
        if (this._fromComp instanceof BiImage) this._fromComp.removeEventListener("load", this._onFromComponentChanged, this);
        this._fromComp = null;
    }
    if (oComp == null) return;
    oComp.addEventListener("resize", this._onFromComponentChanged, this);
    oComp.addEventListener("move", this._onFromComponentChanged, this);
    if (oComp instanceof BiImage) oComp.addEventListener("load", this._onFromComponentChanged, this);
    this._fromComp = oComp;
    this.setFromTop();
    this.setFromLeft();
};
_p.setToComponent = function (oComp) {
    if (this._toComp || oComp == null) {
        this._toComp.removeEventListener("resize", this._onToComponentChanged, this);
        this._toComp.removeEventListener("move", this._onToComponentChanged, this);
        if (this._toComp instanceof BiImage) this._toComp.removeEventListener("load", this._onToComponentChanged, this);
        this._toComp = null;
    }
    if (oComp == null) return;
    oComp.addEventListener("resize", this._onToComponentChanged, this);
    oComp.addEventListener("move", this._onToComponentChanged, this);
    if (oComp instanceof BiImage) oComp.addEventListener("load", this._onToComponentChanged, this);
    this._toComp = oComp;
    this.setToTop();
    this.setToLeft();
};
_p.setFromTop = function (nTop) {
    nTop |= 0;
    var finalPos;
    if (this._fromComp) {
        var yPos = this._fromComp.getClientTop();
        finalPos = nTop + yPos;
    } else {
        finalPos = nTop;
    }
    this._usingSetFromTop = nTop;
    this._usingSetFromBottom = -1;
    this.setFromY(finalPos);
};
_p.setToTop = function (nTop) {
    nTop |= 0;
    var finalPos;
    if (this._toComp) {
        var yPos = this._toComp.getClientTop();
        finalPos = nTop + yPos;
    } else {
        finalPos = nTop;
    }
    this._usingSetToTop = nTop;
    this._usingSetToBottom = -1;
    this.setToY(finalPos);
};
_p.setFromLeft = function (nLeft) {
    nLeft |= 0;
    var finalPos;
    if (this._fromComp) {
        var xPos = this._fromComp.getClientLeft();
        finalPos = nLeft + xPos;
    } else {
        finalPos = nLeft;
    }
    this._usingSetFromLeft = nLeft;
    this._usingSetFromRight = -1;
    this.setFromX(finalPos);
};
_p.setToLeft = function (nLeft) {
    nLeft |= 0;
    var finalPos;
    if (this._toComp) {
        var xPos = this._toComp.getClientLeft();
        finalPos = nLeft + xPos;
    } else {
        finalPos = nLeft;
    }
    this._usingSetToLeft = nLeft;
    this._usingSetToRight = -1;
    this.setToX(finalPos);
};
_p.setFromBottom = function (nBottom) {
    nBottom |= 0;
    var finalPos, height;
    if (this._fromComp) {
        height = this._fromComp.getHeight();
        var top = this._fromComp.getClientTop();
        var compBottom = height + top;
        finalPos = compBottom - nBottom;
    } else {
        height = application.getWindow().getHeight();
        finalPos = height - nBottom;
    }
    this._usingSetFromBottom = nBottom;
    this._usingSetFromTop = -1;
    this.setFromY(finalPos);
};
_p.setToBottom = function (nBottom) {
    nBottom |= 0;
    var finalPos, height;
    if (this._toComp) {
        height = this._toComp.getHeight();
        var top = this._toComp.getClientTop();
        var compBottom = height + top;
        finalPos = compBottom - nBottom;
    } else {
        height = application.getWindow().getHeight();
        finalPos = height - nBottom;
    }
    this._usingSetToBottom = nBottom;
    this._usingSetToTop = -1;
    this.setToY(finalPos);
};
_p.setFromRight = function (nRight) {
    nRight |= 0;
    var finalPos, clientWidth;
    if (this._fromComp) {
        clientWidth = application.getWindow().getWidth();
        var compWidth = this._fromComp.getWidth();
        finalPos = clientWidth - this._fromComp.getClientLeft() - compWidth;
    } else {
        clientWidth = application.getWindow().getWidth();
        finalPos = clientWidth - nRight;
    }
    this._usingSetFromRight = nRight;
    this._usingSetFromLeft = -1;
    this.setFromX(finalPos);
};
_p.setToRight = function (nRight) {
    nRight |= 0;
    var finalPos;
    if (this._toComp) {
        var compWidth = this._toComp.getWidth();
        var compLeft = this._toComp.getClientLeft();
        finalPos = compLeft + compWidth;
    } else {
        var clientWidth = application.getWindow().getWidth();
        finalPos = clientWidth - nRight;
    }
    this._usingSetToRight = nRight;
    this._usingSetToLeft = -1;
    this.setToX(finalPos);
};
BiLocationAnimator.createSlide = function (x1, y1, x2, y2, oComp, nSpeed) {
    nSpeed = nSpeed || BiLocationAnimator.SPEED3;
    var anim = new BiLocationAnimator(x1, y1, x2, y2, nSpeed, false, BiComponentAnimation.FAST_TO_SLOW, oComp, null, true);
    anim.addEventListener("animationend", function () {
        anim.dispose();
        anim = null;
    }, this);
};
BiLocationAnimator.createConstantSpeed = function (x1, y1, x2, y2, oComp, nSpeed) {
    nSpeed = nSpeed || BiLocationAnimator.SPEED3;
    var anim = new BiLocationAnimator(x1, y1, x2, y2, nSpeed, false, BiComponentAnimation.CONSTANT_SPEED, oComp, null, true);
    anim.addEventListener("animationend", function () {
        anim.dispose();
        anim = null;
    }, this);
};

function BiSizeAnimator(nFromWidth, nFromHeight, nToWidth, nToHeight, nSpeed, bLoop, nAccType, oComp, nFrameRate, bAutoStart) {
    if (_biInPrototype) return;
    BiComponentAnimation.call(this, oComp, nFrameRate, bAutoStart);
    this._pushPath(nFromWidth, nFromHeight, nToWidth, nToHeight, nAccType, nSpeed);
    this.setLooping(bLoop);
    this._fromComp = null;
    this._toComp = null;
    this._relativeFromHeight = -1;
    this._relativeFromWidth = -1;
    this._relativeToHeight = -1;
    this._relativeToWidth = -1;
}
_p = _biExtend(BiSizeAnimator, BiComponentAnimation, "BiSizeAnimator");
BiSizeAnimator.SPEED1 = 9000;
BiSizeAnimator.SPEED2 = 4000;
BiSizeAnimator.SPEED3 = 1200;
BiSizeAnimator.SPEED4 = 500;
BiSizeAnimator.SPEED5 = 200;
_p._xOriginal = 0;
_p._yOriginal = 0;
_p._xDisplacement = 0;
_p._yDisplacement = 0;
_p._xIncreasingSize = null;
_p._yIncreasingSize = null;
_p._diffFactor = 0;
_p._toHeight = 0;
_p._toWidth = 0;
_p._fromHeight = 0;
_p._fromWidth = 0;
_p._fromComp = null;
_p._toComp = null;
_p._relativeFromHeight = null;
_p._relativeFromWidth = null;
_p._relativeToHeight = null;
_p._relativeToWidth = null;
BiSizeAnimator.createNormalResize = function (nFromWidth, nFromHeight, nToWidth, nToHeight, oComp, nSpeed) {
    nSpeed = nSpeed || BiSizeAnimator.SPEED4;
    var anim = new BiSizeAnimator(nFromWidth, nFromHeight, nToWidth, nToHeight, nSpeed, false, BiComponentAnimation.CONSTANT_SPEED, oComp, null, true);
    anim.addEventListener("animationend", function () {
        anim.dispose();
        anim = null;
    });
};
BiSizeAnimator.createSmoothResize = function (nFromWidth, nFromHeight, nToWidth, nToHeight, oComp, nSpeed) {
    nSpeed = nSpeed || BiSizeAnimator.SPEED4;
    var anim = new BiSizeAnimator(nFromWidth, nFromHeight, nToWidth, nToHeight, nSpeed, false, BiComponentAnimation.SLOW_TO_SLOW, oComp, null, true);
    anim.addEventListener("animationend", function () {
        anim.dispose();
        anim = null;
    });
};
_p.setFromTo = function (nFromWidth, nFromHeight, nToWidth, nToHeight) {
    this._pushPath(nFromWidth, nFromHeight, nToWidth, nToHeight);
};
_p._pushPath = function (nFromWidth, nFromHeight, nToWidth, nToHeight, nAccType, nSpeed) {
    if (nFromWidth == null) this._fromWidth |= 0;
    else this._fromWidth = nFromWidth; if (nFromHeight == null) this._fromHeight |= 0;
    else this._fromHeight = nFromHeight; if (nToWidth == null) this._toWidth |= 0;
    else this._toWidth = nToWidth; if (nToHeight == null) this._toHeight |= 0;
    else this._toHeight = nToHeight;
    nFromWidth = this._fromWidth;
    nFromHeight = this._fromHeight;
    nToWidth = this._toWidth;
    nToHeight = this._toHeight;
    var oldRange = this._animRanges[0];
    if (!oldRange) oldRange = this._createDefaultAnimationRange(0, 0, BiComponentAnimation.CONSTANT_SPEED, 500);
    nAccType = nAccType || oldRange.getAccType() || BiComponentAnimation.CONSTANT_SPEED;
    nSpeed = nSpeed || oldRange.getTime() || 500;
    this._xDisplacement = Math.abs(nToWidth - nFromWidth);
    this._yDisplacement = Math.abs(nToHeight - nFromHeight);
    this._xOriginal = nFromWidth;
    this._yOriginal = nFromHeight;
    this._xIncreasingSize = nToWidth > nFromWidth;
    this._yIncreasingSize = nToHeight > nFromHeight;
    if (Math.min(this._xDisplacement, this._yDisplacement) == 0) this._diffFactor = 0;
    else this._diffFactor = Math.min(this._xDisplacement, this._yDisplacement) / Math.max(this._xDisplacement, this._yDisplacement); if (this._diffFactor == -Infinity) this._diffFactor = 1;
    var distance = Math.max(Math.abs(this._xDisplacement), Math.abs(this._yDisplacement));
    this._createDefaultAnimationRange(0, distance, nAccType, nSpeed);
};
_p.onFrameProgression = function (pos) {
    var xIncr = this._getXIncr(pos);
    var yIncr = this._getYIncr(pos);
    var xSize = 0;
    var ySize = 0;
    if (this._xDisplacement == 0) xSize = this._xOriginal;
    else if (this._xIncreasingSize) xSize = this._xOriginal + xIncr;
    else xSize = this._xOriginal - xIncr; if (this._yDisplacement == 0) ySize = this._yOriginal;
    else if (this._yIncreasingSize) ySize = this._yOriginal + yIncr;
    else ySize = this._yOriginal - yIncr;
    var comps = this._components;
    for (var i = 0; i < comps.length; i++) {
        var c = comps[i];
        c.setSize(xSize, ySize);
        if (this._animatePreferredSize) c.setPreferredSize(xSize, ySize);
    }
};
_p._getXIncr = function (pos) {
    if (this._xDisplacement == 0) return 0;
    if (this._xDisplacement > this._yDisplacement) return pos;
    else return pos * this._diffFactor;
};
_p._getYIncr = function (pos) {
    if (this._yDisplacement == 0) return 0;
    if (this._yDisplacement > this._xDisplacement) return pos;
    else return pos * this._diffFactor;
};
_p.setType = function (sType) {
    switch (sType) {
    case "normal":
        this.setSpeed(BiSizeAnimator.SPEED4);
        this.setAccType(BiComponentAnimation.CONSTANT_SPEED);
        break;
    case "smooth":
        this.setSpeed(BiSizeAnimator.SPEED4);
        this.setAccType(BiComponentAnimation.SLOW_TO_SLOW);
        break;
    default:
        throw new Error("Unkown size animator type:" + sType);
    }
};
_p.setFromWidth = function (nFromWidth) {
    this.setFromTo(nFromWidth);
};
_p.setFromHeight = function (nFromHeight) {
    this.setFromTo(null, nFromHeight);
};
_p.setToWidth = function (nToWidth) {
    this.setFromTo(null, null, nToWidth);
};
_p.setToHeight = function (nToHeight) {
    this.setFromTo(null, null, null, nToHeight);
};
_p.setFromSize = function (nFromSize) {
    this.setFromHeight(nFromSize);
    this.setFromWidth(nFromSize);
};
_p.setToSize = function (nToSize) {
    this.setToHeight(nToSize);
    this.setToWidth(nToSize);
};
_p.setAccType = function (nAccType) {
    this._pushPath(null, null, null, null, nAccType);
};
_p._setSpeed = function (nSpeed) {
    this._pushPath(null, null, null, null, null, nSpeed);
};
_p.setSpeed = function (nSpeed) {
    if (typeof nSpeed == "string") {
        if (nSpeed == "slowest") {
            this._setSpeed(BiSizeAnimator.SPEED1);
        } else if (nSpeed == "slow") {
            this._setSpeed(BiSizeAnimator.SPEED2);
        } else if (nSpeed == "normal") {
            this._setSpeed(BiSizeAnimator.SPEED3);
        } else if (nSpeed == "fast") {
            this._setSpeed(BiSizeAnimator.SPEED4);
        } else if (nSpeed == "fastest") {
            this._setSpeed(BiSizeAnimator.SPEED5);
        } else {
            throw new Error("Unknown speed constant: " + nSpeed);
        }
    } else {
        this._setSpeed(nSpeed);
    }
};
_p.getSpeed = function () {
    return this.getDefaultAnimationRange().getTime();
};
_p.dispose = function () {
    if (this._disposed) return;
    BiComponentAnimation.prototype.dispose.call(this);
    if (this._fromComp) {
        this._fromComp.removeEventListener("resize", this._onFromComponentChanged, this);
        this._fromComp = null;
    }
    if (this._toComp) {
        this._toComp.removeEventListener("resize", this._onToComponentChanged, this);
        this._toComp = null;
    }
};
_p._onFromComponentChanged = function () {
    if (this._relativeFromHeight != -1) this.setRelativeFromHeight(this._relativeFromHeight);
    if (this._relativeFromWidth != -1) this.setRelativeFromWidth(this._relativeFromWidth);
};
_p._onToComponentChanged = function () {
    if (this._relativeToHeight != -1) this.setRelativeToHeight(this._relativeToHeight);
    if (this._relativeToWidth != -1) this.setRelativeToWidth(this._relativeToWidth);
};
_p.setFromComponent = function (oComp) {
    if (this._fromComp || oComp == null) {
        this._relativeFromHeight = -1;
        this._relativeFromWidth = -1;
        this._fromComp.removeEventListener("resize", this._onFromComponentChanged, this);
        this._fromComp = null;
    }
    if (oComp == null) return;
    oComp.addEventListener("resize", this._onFromComponentChanged, this);
    this._fromComp = oComp;
    this.setRelativeFromHeight();
    this.setRelativeFromWidth();
};
_p.setToComponent = function (oComp) {
    if (this._toComp || oComp == null) {
        this._relativeToHeight = -1;
        this._relativeToWidth = -1;
        this._toComp.removeEventListener("resize", this._onToComponentChanged, this);
        this._toComp = null;
    }
    if (oComp == null) return;
    oComp.addEventListener("resize", this._onToComponentChanged, this);
    this._toComp = oComp;
    this.setRelativeToHeight();
    this.setRelativeToWidth();
};
_p.setRelativeFromHeight = function (offset) {
    offset |= 0;
    this._relativeFromHeight = offset;
    var targetHeight;
    if (this._fromComp) {
        targetHeight = this._fromComp.getHeight();
    }
    this.setFromHeight(targetHeight + offset);
};
_p.setRelativeToHeight = function (offset) {
    offset |= 0;
    this._relativeToHeight = offset;
    var targetHeight;
    if (this._toComp) {
        targetHeight = this._toComp.getHeight();
    }
    this.setToHeight(targetHeight + offset);
};
_p.setRelativeFromWidth = function (offset) {
    offset |= 0;
    this._relativeFromWidth = offset;
    var targetWidth;
    if (this._fromComp) {
        targetWidth = this._fromComp.getWidth();
    }
    this.setFromWidth(targetWidth + offset);
};
_p.setRelativeToWidth = function (offset) {
    offset |= 0;
    this._relativeToWidth = offset;
    var targetWidth;
    if (this._toComp) {
        targetWidth = this._toComp.getWidth();
    }
    this.setToWidth(targetWidth + offset);
};
_p.onMax = function () {
    var cs = this._components;
    for (var i = 0; i < cs.length; i++) {
        cs[i].setSize(this._toWidth, this._toHeight);
    }
    BiComponentAnimation.prototype.onMax.call(this);
};
BiSizeAnimator.addProperty("animatePreferredSize", Function.READ_WRITE);

function BiAnimationRange(nStartValue, nEndValue, nAccType, nTime) {
    if (_biInPrototype) return;
    BiObject.call(this);
    this._startValue = nStartValue || 0;
    this._endValue = nEndValue || 100;
    this._accType = nAccType || BiComponentAnimation.CONSTANT_SPEED;
    this._time = nTime || 500;
    this._curValue = this._startValue;
};
_p = _biExtend(BiAnimationRange, BiObject, "BiAnimationRange");
BiAnimationRange.addProperty("startValue", BiAccessType.READ_WRITE);
BiAnimationRange.addProperty("endValue", BiAccessType.READ_WRITE);
BiAnimationRange.addProperty("accType", BiAccessType.READ_WRITE);
BiAnimationRange.addProperty("time", BiAccessType.READ_WRITE);
BiAnimationRange.addProperty("curValue", BiAccessType.READ_WRITE);
_p.rewind = function () {
    this._curValue = this._startValue;
};
_p.displace = function (curMs) {
    if (curMs >= this._time) {
        return this._curValue = this._endValue;
    }
    var distance = Math.abs(this._endValue - this._startValue);
    switch (this._accType) {
    case BiComponentAnimation.CONSTANT_SPEED:
        this._curValue = BiMath.constantSpeed(curMs, this._startValue, distance, this._time);
        break;
    case BiComponentAnimation.SLOW_TO_FAST:
        this._curValue = BiMath.slowToFast(curMs, this._startValue, distance, this._time);
        break;
    case BiComponentAnimation.FAST_TO_SLOW:
        this._curValue = BiMath.fastToSlow(curMs, this._startValue, distance, this._time);
        break;
    case BiComponentAnimation.SLOW_TO_SLOW:
        this._curValue = BiMath.slowToSlow(curMs, this._startValue, distance, this._time);
        break;
    default:
        throw new Error("Unknown acceleration constant: " + this._accType);
    }
    this._curValue = Math.round(this._curValue);
    return this._curValue = Math.max(0, Math.min(this._curValue, this._endValue));
};
_p.positionAtMax = function () {
    return this._curValue >= this._endValue;
};

function BiCollapsiblePanel(sTitle, sOrientation) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this.setHideFocus(true);
    this.setTabIndex(1);
    this.setCssClassName("bi-collapsible-panel");
    this.setAppearance("collapsible-panel");
    this._initCaption(sTitle, sOrientation || "north");
    this._initContentPanel();
    this._initAnimator();
    this.addEventListener("resize", this._onResize, this);
    this.addEventListener("create", this._onCreate, this);
}
_p = _biExtend(BiCollapsiblePanel, BiComponent, "BiCollapsiblePanel");
_p._orientation = "north";
BiCollapsiblePanel.addProperty("folded", Function.READ);
BiCollapsiblePanel.addProperty("initiallyFolded", Function.WRITE);
BiCollapsiblePanel.addProperty("caption", Function.READ);
BiCollapsiblePanel.addProperty("contentPanel", Function.READ_WRITE);
BiCollapsiblePanel.addProperty("animator", Function.READ);
_p.setOverflow = function (b) {
    this._contentPanel.setOverflow(b);
};
_p.getOverflow = function () {
    return this._contentPanel.getOverflow();
};
_p.setCenterTitle = function (b) {
    this._caption.setCenterTitle(b);
};
_p.getCenterTitle = function () {
    return this._caption.getCenterTitle();
};
_p.setShowCollapseButton = function (b) {
    this._caption.setShowCollapseButton(b);
};
_p.getShowCollapseButton = function () {
    return this._caption.getShowCollapseButton();
};
_p.setButtonOrientation = function (sOrientation) {
    this._caption.setButtonOrientation(sOrientation);
};
_p.getButtonOrientation = function () {
    return this._caption.getButtonOrientation();
};
_p.setShowCaptionBackground = function (bShow) {
    this._caption.setShowCaptionBackground(bShow);
};
_p.getShowCaptionBackground = function () {
    return this._caption.getShowCaptionBackground();
};
_p.setTitle = function (sTitle) {
    this._caption.setTitle(sTitle);
};
_p.getTitle = function () {
    return this._caption.getTitle();
};
_p.setSpeed = function (nSpeed) {
    this._animator.setSpeed(nSpeed);
};
_p.getSpeed = function () {
    return this._animator.getSpeed();
};
_p.setToggleFoldingOnCaptionClick = function (bFold) {
    if (this._toggleFoldingOnCaptionClick == bFold) return;
    this._toggleFoldingOnCaptionClick = bFold;
    if (bFold) this._caption.addEventListener("click", this.toggleFolding, this);
    else this._caption.removeEventListener("click", this.toggleFolding, this);
};
_p.getToggleFoldingOnCaptionClick = function () {
    return this._toggleFoldingOnCaptionClick;
};
_p.setOrientation = function (sOrientation) {
    this._orientation = sOrientation;
    this._caption.setOrientation(sOrientation);
};
_p.getOrientation = function () {
    return this._orientation;
};
_p._initCaption = function (sTitle, sOrientation) {
    this._caption = new BiCollapsiblePanelCaption(sTitle, sOrientation);
    this._caption.setLocation(0, 0);
    this._caption.setRight(0);
    BiComponent.prototype.add.call(this, this._caption);
    this._caption.getCollapseButton().addEventListener("action", this._onButton, this);
};
_p._initContentPanel = function () {
    this._contentPanel = new BiComponent();
    this._contentPanel.setCssClassName("bi-collapsible-panel-content-panel");
    this._contentPanel.setAppearance("collapsible-panel-content-panel");
    this._contentPanel.setLeft(0);
    this._contentPanel.setRight(0);
    this._contentPanel.setTop(this._caption.getHeight());
    this._contentPanel.setBottom(0);
    BiComponent.prototype.add.call(this, this._contentPanel);
};
_p._initAnimator = function () {
    this._animator = new BiSizeAnimator();
    this._animator.addComponent(this);
    this._animator.setSpeed("fastest");
    this._animator.setAnimatePreferredSize(true);
    this._animator.setAccType(BiComponentAnimation.FAST_TO_SLOW);
    this._animator.addEventListener("animationend", this._onAnimationEnd, this);
};
_p.fold = function (bQuickFold) {
    if (this._folded) return;
    if (this._currentlyAnimating) {
        this._animator.stop();
        this._animator.rewind();
    } else {
        this._saveWidthAndHeight();
    } if (bQuickFold) {
        this._quickFolding = true;
        this.dispatchEvent("beforecollapse");
        if (BiCollapsiblePanel.getVerticalOrientation(this._orientation)) {
            this.setWidth(this._savedWidth);
            this.setPreferredWidth(this._savedWidth);
            this.setHeight(this._caption.getHeight() + BiCollapsiblePanel._getBorderWidth(this));
            this.setPreferredHeight(this._caption.getHeight() + BiCollapsiblePanel._getBorderWidth(this));
        } else {
            this.setHeight(this._savedHeight);
            this.setPreferredHeight(this._savedHeight);
            this.setWidth(this._caption.getMinimumWidth() + BiCollapsiblePanel._getBorderWidth(this));
            this.setPreferredWidth(this._caption.getMinimumWidth() + BiCollapsiblePanel._getBorderWidth(this));
            this._hideTitleAndPanel();
        }
        this._folded = true;
        this._caption.setShowCollapsedState(this._folded);
        this._quickFolding = false;
        this.dispatchEvent("collapsed");
    } else {
        if (BiCollapsiblePanel.getVerticalOrientation(this._orientation)) {
            this._animator.setToWidth(this._savedWidth);
            this._animator.setFromHeight(this.getHeight());
            this._animator.setToHeight(this._caption.getHeight() + BiCollapsiblePanel._getBorderWidth(this));
            this._setAnimatorKeepWidths();
        } else {
            this._animator.setFromHeight(this.getHeight());
            this._animator.setToHeight(this._savedHeight);
            this._animator.setFromWidth(this.getWidth());
            this._animator.setToWidth(this._caption.getMinimumWidth() + BiCollapsiblePanel._getBorderWidth(this));
        }
        this._folded = true;
        this.dispatchEvent("beforecollapse");
        this._startAnimation();
    }
};
_p.unfold = function () {
    if (!this._folded) return;
    if (this._currentlyAnimating) {
        this._animator.stop();
        this._animator.rewind();
    }
    if (BiCollapsiblePanel.getVerticalOrientation(this._orientation)) {
        var fromHeight = this._currentlyAnimating ? this.getHeight() : this._caption.getHeight();
        this._animator.setFromHeight(fromHeight);
        this._animator.setToHeight(this._savedHeight);
        this._setAnimatorKeepWidths();
    } else {
        var fromWidth = this._currentlyAnimating ? this.getWidth() : this._caption.getMinimumWidth();
        this._animator.setFromWidth(fromWidth);
        this._animator.setToWidth(this._savedWidth);
        this._setAnimatorKeepHeights();
    }
    this._folded = false;
    this.dispatchEvent("beforeexpand");
    this._startAnimation();
};
_p._saveWidthAndHeight = function () {
    this._savedHeight = this._parentIsLayoutContainer() ? this.getPreferredHeight() : this.getHeight();
    this._savedWidth = this._parentIsLayoutContainer() ? this.getPreferredWidth() : this.getWidth();
};
_p._setAnimatorKeepWidths = function () {
    var curWidth = this.getWidth();
    this._animator.setFromWidth(curWidth);
    this._animator.setToWidth(curWidth);
};
_p._setAnimatorKeepHeights = function () {
    var curHeight = this.getHeight();
    this._animator.setFromHeight(curHeight);
    this._animator.setToHeight(curHeight);
};
_p.toggleFolding = function () {
    if (this._folded) this.unfold();
    else this.fold();
};
_p._startAnimation = function () {
    this._currentlyAnimating = true;
    this._animator.start();
    this._caption.setHideTitle(false);
    this._contentPanel.setVisible(true);
};
_p._onAnimationEnd = function (e) {
    if (this._folded) this._hideTitleAndPanel();
    this._caption.setShowCollapsedState(this._folded);
    if (this._folded) {
        this.dispatchEvent("collapsed");
    } else {
        this.dispatchEvent("expanded");
    }
    BiTimer.callOnce(function () {
        this._currentlyAnimating = false;
    }, 1, this);
};
_p._hideTitleAndPanel = function () {
    if (!BiCollapsiblePanel.getVerticalOrientation(this._orientation)) {
        this._caption.setHideTitle(true);
        this._contentPanel.setVisible(false);
    }
};
_p._onResize = function (e) {
    if (!this._currentlyAnimating && !this.getFolded() && !this._quickFolding) {
        this._savedHeight = this.getHeight();
        this._savedWidth = this.getWidth();
    }
};
_p._onCreate = function () {
    if (this._initiallyFolded) {
        this._saveWidthAndHeight();
        this.fold(true);
    }
};
_p._onButton = function (e) {
    if (this.getToggleFoldingOnCaptionClick()) return;
    this.toggleFolding();
};
_p.add = function (oComponent) {
    this._contentPanel.add(oComponent);
};
_p.getPreferredWidth = function () {
    if (this._preferredWidth != null) return this._preferredWidth;
    if (this.getFolded()) {
        return this._caption.getPreferredWidth() + BiCollapsiblePanel._getBorderWidth(this);
    }
    var preferredWidth = this._caption.getPreferredWidth();
    preferredWidth += BiCollapsiblePanel._getBorderWidth(this);
    return preferredWidth;
};
_p.getPreferredHeight = function () {
    if (this._preferredHeight != null) return this._preferredHeight;
    if (this.getFolded()) {
        return this._caption.getPreferredHeight() + BiComponent.prototype.getPreferredHeight.call(this);
    }
    var preferredHeight = this._caption.getPreferredHeight();
    preferredHeight += BiCollapsiblePanel._getBorderHeight(this);
    var cp = this._contentPanel;
    preferredHeight += BiCollapsiblePanel._getBorderHeight(cp);
    var children = cp.getChildren();
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        preferredHeight += child.getPreferredHeight();
    }
    return preferredHeight;
};
BiCollapsiblePanel._getBorderWidth = function (object) {
    var border = object.getBorder();
    return (border.getLeftWidth() || 0) + (border.getRightWidth() || 0);
};
BiCollapsiblePanel._getBorderHeight = function (object) {
    var border = object.getBorder();
    return (border.getTopWidth() || 0) + (border.getBottomWidth() || 0);
};
BiCollapsiblePanel.getVerticalOrientation = function (sOrientation) {
    if (sOrientation == "north" || sOrientation == "south") return true;
    else if (sOrientation == "east" || sOrientation == "west") return false;
    else throw new Error("Illegal orientation value for BiCollapsiblePanel: " + sOrientation);
};
_p.dispose = function () {
    BiComponent.prototype.dispose.call(this);
    this._caption.removeEventListener("click", this.toggleFolding, this);
    this.disposeFields("_caption", "_contentPanel", "_animator");
};
_p._parentIsLayoutContainer = function () {
    var parent = this.getParent();
    return parent instanceof BiBox || parent instanceof BiGridPanel2 || parent instanceof BiGridPanel || parent instanceof BiDockPanel || parent instanceof BiFlowPanel;
};

function BiCollapsiblePanelCaption(sTitle, sOrientation) {
    if (_biInPrototype) return;
    BiComponent.call(this);
    this._initCaptionLabel(sTitle);
    this._initCollapseButton();
    this.setCssClassName("bi-collapsible-panel-caption");
    this.setAppearance("collapsible-panel-caption");
    this.setHeight(this.getPreferredHeight());
    this._buttonOrientation = "right";
    this.setOrientation((sOrientation || "north"));
    this.addEventListener("create", this._onCreate, this);
}
_p = _biExtend(BiCollapsiblePanelCaption, BiComponent, "BiCollapsiblePanelCaption");
_p._orientation = "north";
_p.getLabelSpacing = function () {
    if (this._labelSpacing != null) return this._labelSpacing;
    return application.getThemeManager().getDefaultTheme().getAppearanceProperty(this.getCssClassName(), "labelSpacing") || 10;
};
_p.getPreferredHeight = function () {
    if (this._preferredHeight != null) return this._preferredHeight;
    return application.getThemeManager().getDefaultTheme().getAppearanceProperty(this.getCssClassName(), "minimumSize") || 22;
};
BiCollapsiblePanelCaption.addProperty("captionLabel", Function.READ_WRITE);
BiCollapsiblePanelCaption.addProperty("showCollapsedState", Function.READ);
_p.setShowCollapsedState = function (bState) {
    this._showCollapsedState = bState;
    this._updateButtonImageStates();
};
BiCollapsiblePanelCaption.addProperty("collapseButton", Function.READ);
BiCollapsiblePanelCaption.addProperty("buttonOrientation", Function.READ);
_p.setButtonOrientation = function (sButtonOrientation) {
    this._buttonOrientation = sButtonOrientation;
    this._updateLayout();
};
_p.setOrientation = function (sOrientation) {
    this._orientation = sOrientation;
    this._updateLayout();
};
_p._updateLayout = function () {
    if (!this._created) return;
    this._updateButtonImageStates();
    if (this.getShowCollapseButton()) {
        if (this._buttonOrientation == "left") {
            this._collapseButton.setRight(null);
            this._collapseButton.setLeft(5);
            this._captionLabel.setLeft(this._collapseButton.getWidth() + this.getLabelSpacing());
            this._captionLabel.setRight(this._collapseButton.getWidth() + this.getLabelSpacing());
        } else if (this._buttonOrientation == "right") {
            this._collapseButton.setLeft(null);
            this._collapseButton.setRight(5);
            this._captionLabel.setLeft(5);
            this._captionLabel.setRight(5);
        } else {
            throw new Error("buttonOrientation has bad value: " + this._buttonOrientation);
        }
    } else {
        this._captionLabel.setLeft(5);
    }
};
_p._updateButtonImageStates = function () {
    if (!this.getShowCollapseButton()) return;
    var cs = this.getShowCollapsedState();
    switch (this._orientation) {
    case "north":
        if (cs) this._collapseButton.setAppearance("collapsible-panel-caption-button down");
        else this._collapseButton.setAppearance("collapsible-panel-caption-button up");
        break;
    case "south":
        if (cs) this._collapseButton.setAppearance("collapsible-panel-caption-button up");
        else this._collapseButton.setAppearance("collapsible-panel-caption-button down");
        break;
    case "east":
        if (cs) this._collapseButton.setAppearance("collapsible-panel-caption-button left");
        else this._collapseButton.setAppearance("collapsible-panel-caption-button right");
        break;
    case "west":
        if (cs) this._collapseButton.setAppearance("collapsible-panel-caption-button right");
        else this._collapseButton.setAppearance("collapsible-panel-caption-button left");
        break;
    default:
        throw new Error("bad orientation value in BiCollapsiblePanelCaption: " + this._orientation);
    }
};
_p.setShowCollapseButton = function (bShow) {
    if (this.getShowCollapseButton() == bShow) return;
    if (bShow) this.add(this._collapseButton);
    else this.remove(this._collapseButton);
    this._updateLayout();
};
_p.getShowCollapseButton = function () {
    return this.getChildren().contains(this._collapseButton);
};
BiCollapsiblePanelCaption.addProperty("centerTitle", Function.READ);
_p.setCenterTitle = function (bCenter) {
    if (bCenter) this._captionLabel.setAlign("center");
    else this._captionLabel.setAlign("left");
    this._centerTitle = bCenter;
};
_p.getTitle = function () {
    return this._captionLabel.getText();
};
_p.setTitle = function (sTitle) {
    this._captionLabel.setText(sTitle);
};
_p.setShowCaptionBackground = function (bShow) {
    this._showCaptionBackground = bShow;
    if (bShow) this.setAppearance("collapsible-panel-caption");
    else {
        this.setAppearance("collapsible-panel-caption-nochrome");
    }
};
_p.getShowCaptionBackground = function () {
    return this._showCaptionBackground;
};
_p._initCaptionLabel = function (sTitle) {
    this._captionLabel = new BiLabel(sTitle);
    this._captionLabel.setAppearance("collapsible-panel-caption-label");
    this.add(this._captionLabel);
};
_p._initCollapseButton = function () {
    this._collapseButton = new BiButton();
    this._collapseButton.setTop(2);
    this._collapseButton._themeKey = BiTheme.KEYS.collapsiblePanelCaptionButton;
    this._collapseButton.setAppearance("collapsible-panel-caption-button");
    this._collapseButton.setPadding(0);
    this._collapseButton.setTabIndex(-1);
    this._collapseButton.setSize(18, 18);
    this.add(this._collapseButton);
};
_p.getMinimumWidth = function () {
    if (BiCollapsiblePanel.getVerticalOrientation(this._orientation)) {
        return BiComponent.prototype.getMinimumWidth.call(this);
    } else {
        return this._collapseButton.getWidth() + this.getLabelSpacing();
    }
};
_p.setHideTitle = function (bHide) {
    this._captionLabel.setVisible(!bHide);
};
_p._onCreate = function () {
    this._updateLayout();
    this.removeEventListener("create", this._onCreate, this);
};
_p.dispose = function () {
    BiComponent.prototype.dispose.call(this);
    this.disposeFields("_captionLabel", "_collapseButton");
};