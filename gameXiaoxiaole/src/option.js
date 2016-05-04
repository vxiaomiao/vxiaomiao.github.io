var optionLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        var size =cc.winSize;
        var Item1 = new cc.MenuItemImage(res.option_png,res.option_png,function(){
            if(GC.EFFECTFLAG) {
                cc.audioEngine.playEffect(res.Yinxiao_dian);
            }
            GC.VV =1;
            this.unschedule(this.addSnow);
            cc.director.runScene(new GameScene());
        },this);
        Item1.x = size.width/2-150;
        Item1.y = size.height/2;

        var Item2 = new cc.MenuItemImage(res.option_png,res.option_png,function(){
            if(GC.EFFECTFLAG) {
                cc.audioEngine.playEffect(res.Yinxiao_dian);
            }
            GC.VV =2;
            this.unschedule(this.addSnow);
            cc.director.runScene(new GameScene());
        },this);
        Item2.x = size.width/2;
        Item2.y = size.height/2;

        var Item3 = new cc.MenuItemImage(res.option_png,res.option_png,function(){
            if(GC.EFFECTFLAG) {
                cc.audioEngine.playEffect(res.Yinxiao_dian);
            }
            GC.VV =3;
            this.unschedule(this.addSnow);
            cc.director.runScene(new GameScene());
        },this);
        Item3.x = size.width/2+150;
        Item3.y = size.height/2;

        var Item4 = new cc.MenuItemImage(res.back_png,res.back_png,function(){
            if(GC.EFFECTFLAG) {
                cc.audioEngine.playEffect(res.Yinxiao_dian);
            }
            this.unschedule(this.addSnow);
            cc.director.runScene(new startScene());
        },this);
        Item4.x = 90;
        Item4.y = size.height-100;

        var Item5 = new cc.MenuItemImage(res.Sound_kai_png,res.Sound_kai_png,function(sender){

            if(GC.EFFECTFLAG) {
                cc.audioEngine.playEffect(res.Yinxiao_dian);
            }

            GC.EFFECTFLAG = !GC.EFFECTFLAG;
            var imgfile = GC.EFFECTFLAG?res.Sound_kai_png:res.Sound_guan_png;
            sender.getNormalImage().setTexture(imgfile);
            if(GC.EFFECTFLAG) {
                cc.audioEngine.playEffect(res.Yinxiao_bg,true);
            }else{
                cc.audioEngine.stopAllEffects();
            }

        },this);
        Item5.x = size.width-90;
        Item5.y = size.height-100;


        var menu =new cc.Menu(Item1,Item2,Item3,Item4,Item5);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu,10);


        var bkImage = new cc.Sprite(res.option_bg_png);
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

        var tip = new cc.LabelTTF("简单","Arial",40);
        tip.attr({
            x:cc.winSize.width/2-150,
            y:size.height/2
        });
        tip.setColor(cc.color(0,0,255,0));
        tip.set_textFillColor = cc.color(0, 0, 255, 0);
        this.addChild(tip,11);

        var tip2 = new cc.LabelTTF("普通","Arial",40);
        tip2.attr({
            x:cc.winSize.width/2,
            y:size.height/2
        });
        tip2.setColor(cc.color(0, 0, 255, 0));
        tip2.set_textFillColor = cc.color(0, 0, 255, 0);

        this.addChild(tip2,11);

        var tip3 = new cc.LabelTTF("困难","Arial",40);
        tip3.attr({
            x:cc.winSize.width/2+150,
            y:size.height/2
        });
        tip3.setColor(cc.color(0, 0, 255, 0));
        tip3.set_textFillColor = cc.color(0, 0, 255, 0);

        this.addChild(tip3,11);
        this.schedule(this.addSnow,0.7);

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

var optionScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new optionLayer();
        this.addChild(layer);
    }
});