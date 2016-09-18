/**
 * 离开Layer
 *Created by Jinling on 16/2/24.
 */

var QuitLayerDelegate = cc.Class.extend({
    yesClicked : function(sender){},
    noClicked : function(sender){}
});

var QuitLayer = cc.Layer.extend({
    _delegate :null,

    ctor: function () {
        this._super();

        this.init();
        return true;
    },
    init: function () {
        //添加触摸 目的：阻挡下一层的触摸;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan
        }, this);

        var winSize = cc.director.getVisibleSize();
        var spBg = cc.Sprite.create(res.Quit_bg_png);
        spBg.attr({
            x: winSize.width/2,
            y: winSize.height/2
        });
        this.addChild(spBg);

        //添加菜单
        var item1 = new cc.MenuItemImage(res.Quit_Yes_png, res.Quit_Yes_png, this.onMenuYesCallback, this);
        item1.attr({
            x:winSize.width*0.42,
            y:winSize.height*0.38
        });

        var item2 = new cc.MenuItemImage(res.Quit_No_png, res.Quit_No_png, this.onMenuNoCallback, this);
        item2.attr({
            x:winSize.width*0.62,
            y:winSize.height*0.38
        });

        var mainMenu = new cc.Menu(item1, item2);
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
    onMenuYesCallback: function (sender) {
        this.removeFromParent(true);
        //如果_delegate被赋值，并且赋值的sender调用了yesClicked方法;
        if(this._delegate && this._delegate.yesClicked){
            cc.log("call yes delegate func---");
            this._delegate.yesClicked(sender);
        }
    },
    onMenuNoCallback: function (sender) {
        this.removeFromParent(true);

        if(this._delegate && this._delegate.noClicked){
            cc.log("call no delegate func---");
            this._delegate.noClicked(sender);
        }
    }
});

