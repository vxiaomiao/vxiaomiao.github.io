/**
 * Created by Jinling on 16/2/3.
 */

var ResultLayer = cc.Layer.extend({
    ctor: function (bSuccessful) {
        this._super();

        this.init(bSuccessful);
        return true;
    },
    init: function (bSuccessful) {

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan
        }, this);
        var winSize = cc.director.getVisibleSize();
        var imgPath = bSuccessful ? res.Background_success_png : res.Background_failed_png;
        var spBg = cc.Sprite.create(imgPath);
        spBg.attr({
            anchorX: 0,
            anchorY: 0.5,
            x: winSize.width,
            y: winSize.height / 2
        });
        this.addChild(spBg);
        var act1 = cc.moveTo(1.0, cc.p(0, winSize.height / 2));
        var act2 = cc.fadeOut(2.5);
        var callback = cc.callFunc(this.onResultcallback.bind(this));
        spBg.runAction(cc.sequence(act1, cc.delayTime(0.5), act2, callback));
    },
    onTouchBegan: function (touch, event) {
        return true;
    },
    onResultcallback: function () {
        this.removeFromParent(true);
    },
});