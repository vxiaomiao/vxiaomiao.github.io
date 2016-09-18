/**
 * 暂停Layer
 *Created by Jinling on 16/2/24.
 */

var PauseLayerDelegate = cc.Class.extend({
    playClicked : function(sender){}
});

var PauseLayer = cc.Layer.extend({
    _delegate :null,

    ctor: function () {
        this._super();

        this.init();
        return true;
    },
    init: function () {
        var winSize=cc.winSize;

        var label = new cc.LabelTTF("v07.04", "Arial", 30);
        label.setColor(cc.color(255,0,0));
        label.x =  260;
        label.y =  winSize.height - 130;
        this.addChild(label,100);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan
        }, this);

        var winSize = cc.director.getVisibleSize();
        var spBg = cc.Sprite.create(res.Pause_bg_png);
        spBg.attr({
            x: winSize.width/2,
            y: winSize.height/2
        });
        this.addChild(spBg);

        //添加菜单
        var item1 = new cc.MenuItemImage(res.Pause_play_png, res.Pause_play_png, this.onMenuPlayCallback, this);
        item1.attr({
            x:winSize.width/2,
            y:winSize.height*0.45
        });

        var mainMenu = new cc.Menu(item1);
        mainMenu.attr({
            anchorX:0,
            anchorY:0,
            x:0,
            y:0
        });
        this.addChild(mainMenu);
    },
    onTouchBegan: function (touch, event) {
        return true;
    },
    getDelegate:function () {
        return this._delegate;
    },
    setDelegate:function (delegate) {
        this._delegate = delegate;
    },
    onMenuPlayCallback: function (sender) {
        this.removeFromParent(true);

        if(this._delegate && this._delegate.playClicked){
            cc.log("call continue delegate func---");
            this._delegate.playClicked(sender);
        }
    }
});

