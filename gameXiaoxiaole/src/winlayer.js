var winLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        var size =cc.winSize;

        var menuItemStart = new cc.MenuItemImage(res.start,res.start,function(){
            if(GC.EFFECTFLAG) {
                cc.audioEngine.playEffect(res.Yinxiao_dian);
            }
            this.unschedule(this.addSnow);
            cc.director.runScene(new optionScene());
        },this);
        menuItemStart.x = size.width/2;
        menuItemStart.y = size.height/2-200;

        var menu =new cc.Menu(menuItemStart);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu,10);

        var bkImage = new cc.Sprite(res.Win_png);
        var bkSize = bkImage.getContentSize();
        var rate = Math.max(bkSize.width/size.width,bkSize.height/size.height);
        bkImage.setScale(1/rate);
        bkImage.attr({
            x:size.width/2,
            y:size.height/2,
            anchorX:0.5,
            anchorY:0.5
        });
        this.addChild(bkImage);

        var kai = new cc.Sprite(res.kaixin);
        kai.attr({
            x  :  size.width/2,
            y  :  size.height/2+300
        });
        kai.setRotation(270);
        this.addChild(kai);

        if(GC.EFFECTFLAG) {
            cc.audioEngine.playEffect(res.Yinxiao_bg,true);
        }

        var button_sp = new cc.Sprite(res.startbutton);
        button_sp.attr({
            x:size.width/2,
            y:size.height/2-210
        });
        this.addChild(button_sp);

        this.schedule(this.addSnow,0.1);
    },
    //添加雪花
    addSnow:function(){
        var apple = new cc.Sprite(res.snow);
        var size = cc.winSize;
        var x = cc.random0To1()*(size.width-apple.width)+apple.width/2;
        var y = size.height + apple.height/2;
        apple.attr({
            x:x,
            y:y,
            scale:cc.random0To1()*0.6+0.5
        });
        apple.runAction(cc.sequence(
            cc.moveBy(3.0,0,-(size.height+apple.height)),
            cc.callFunc(function(){
                apple.removeFromParent(true);
            })
        ));
        this.addChild(apple,1000);
    }
});

var winScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new winLayer();
        this.addChild(layer);
    }
});