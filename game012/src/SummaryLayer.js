/**
 * Created by Jinling on 16/2/22.
 */

var SummaryLayerDelegate = cc.Class.extend({
    exitMenuClicked : function(sender){},
    restartMenuClicked : function(sender){}
});

var SummaryLayer = cc.Layer.extend({
    _delegate :null,

    ctor: function (correctNum) {
        this._super();

        this.init(correctNum);
        return true;
    },
    init: function (correctNum) {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan
        }, this);

        var winSize = cc.director.getWinSize();

        var spBg = new cc.Sprite(res.Final_maskbg_png);
        spBg.attr({
            x: winSize.width/2,
            y: winSize.height/2
        });
        this.addChild(spBg);

        var summaryBg = new cc.Sprite(res.Final_midbg_png);
        summaryBg.attr({
            x: winSize.width*0.4,
            y: winSize.height/2
        });
        this.addChild(summaryBg);

        var iconsp = new cc.Sprite(res.Final_icon_png);
        iconsp.attr({
            x : winSize.width*0.6,
            y: winSize.height*0.2
        });
        this.addChild(iconsp);

        //添加菜单
        this.initMenu(winSize);

        var sugarArr = [];
        var startX = 184, paddingX = 90;
        for(var i=0;i<3;i++){
            var sugar_an = new cc.Sprite(res.Final_tang_an_png);
            var sugar_liang = new cc.Sprite(res.Final_tang_liang_png);

            var x = startX + paddingX*i;
            var y = 180;
            sugar_an.setPosition(cc.p(x, y));
            sugar_liang.setPosition(cc.p(x, y));

            summaryBg.addChild(sugar_an);
            summaryBg.addChild(sugar_liang);
            sugar_liang.setOpacity(0);
            sugarArr.push(sugar_liang);
        }

        var cnt = 0, wordfile = null, effectfile = null;
        if(correctNum <= 2){
            cnt = 1;
            wordfile = res.Final_word1_png;
            effectfile = res.playup_mp3;
        }else if(correctNum>2 && correctNum<=5){
            cnt = 2;
            wordfile = res.Final_word2_png;
            effectfile = res.effort_mp3;
        }else{
            cnt = 3;
            wordfile = res.Final_word3_png;
            effectfile = res.congratulation_mp3;
        }

        var wordsp = new cc.Sprite(wordfile);
        wordsp.setPosition(cc.p(260, 90));
        summaryBg.addChild(wordsp);


        if(GC.EFFECTFLAG) {
            cc.audioEngine.playEffect(effectfile);
        }

        for(var i=0;i<cnt;i++){
            var sugar = sugarArr[i];
            sugar.setOpacity(255);
            var act1 = cc.scaleTo(0.3, 1.3);
            var act2 = cc.scaleTo(0.3, 1.0);
            var anim = cc.sequence(act1,act2).repeat(3);

            sugar.runAction(anim);
        }

    },
    initMenu: function (winSize) {
        var menuItemX = winSize.width - 150;
        var item1 = new cc.MenuItemImage(res.Final_quit_normal_png, res.Final_quit_select_png, this.onMenuQuitCallback, this);
        item1.attr({
            x:menuItemX,
            y:winSize.height*0.7
        });
        this._musicMenu = item1;

        var item2 = new cc.MenuItemImage(res.Final_restart_normal2_png, res.Final_restart_normal2_png, this.onMenuRestartCallback, this);
        item2.attr({
            x:menuItemX,
            y:winSize.height*0.2
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
    onMenuRestartCallback:function(sender){
        this.removeFromParent(true);
        cc.audioEngine.stopAllEffects();
        if(this._delegate && this._delegate.restartMenuClicked){
            cc.log("call restart delegate func---");
            this._delegate.restartMenuClicked(sender);
        }
    },
    onMenuQuitCallback:function(sender){

        this.removeFromParent(true);
        cc.audioEngine.stopAllEffects();
        //TODO:  退出游戏
        if(this._delegate && this._delegate.exitMenuClicked){
            cc.log("call quit delegate func---");
            this._delegate.exitMenuClicked(sender);
        }
    }
});