/**
 * Created by caojie on 16/3/21.
 */

var helpLayer=cc.Layer.extend({
    _layerBG:null,
    _fileIndex:1,
    _maxFileNum:null,
    _goLeft:null,
    _goRight:null,

    ctor:function(){

        this._super();

        this.initMenu();
        this.init();
        this.initTouch();

        return true;

    },
    init:function(){

        var winSize=cc.winSize;

        //当前值;
        this._maxFileNum=3;

        //遮罩;
        var bg=new cc.Sprite(res.Final_maskbg2_png);
        bg.setPosition(winSize.width/2,winSize.height/2);
        this.addChild(bg);

        //背景;
        this._layerBG=new cc.Sprite();
        this.addChild(this._layerBG,5);
        this._layerBG.setPosition(winSize.width/2,winSize.height/2);
        this.initLayerBG(this._fileIndex);


    },
    initTouch:function(){
        var listener=cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }
        });
        cc.eventManager.addListener(listener,this);
    },
    initLayerBG:function(index){

        //添加帮助音效;
        cc.audioEngine.stopAllEffects();
        var music=eval("res.help"+index+"_music");
        cc.audioEngine.playEffect(music);

        //设置纹理;
        var file= "res/Help/game"+index+".jpg";
        this._layerBG.initWithFile(file);
        this._goLeft.setVisible(true);
        this._goRight.setVisible(true);
        //根据状态 隐藏菜单;
        if(this._fileIndex==1){
            this._goLeft.setVisible(false);
        }else if(this._fileIndex==this._maxFileNum){
            this._goRight.setVisible(false);
        }

/*
        //播放音频;
        cc.audioEngine.stopAllEffects();
        var music="res/Help/hp"+index+".mp3";
        cc.audioEngine.playEffect(music);
*/
    },
    initMenu:function(){

        var winSize=cc.winSize;

/*
        //手动切图;
        var golNormal=new cc.Sprite(res.helpgoLeft_png,cc.rect(0,0,26,40));
        var golSelected=new cc.Sprite(res.helpgoLeft_png,cc.rect(0,40,26,40));
        var golDisabled=new cc.Sprite(res.helpgoLeft_png,cc.rect(0,40*2,26,39));

        var gorNormal=new cc.Sprite(res.helpgoRight_png,cc.rect(0,0,26,40));
        var gorSelected=new cc.Sprite(res.helpgoRight_png,cc.rect(0,40,26,40));
        var gorDisabled=new cc.Sprite(res.helpgoRight_png,cc.rect(0,40*2,26,39));

*/

       this._goLeft=new cc.MenuItemImage(
            res.helpgoLeft_png,
            res.helpgoLeft2_png,
            function(){
                if(this._fileIndex>1){
                    this._fileIndex--;
                    this.initLayerBG(this._fileIndex);
                }
            }.bind(this));

        this._goLeft.setPosition(50,winSize.height/2);


        this._goRight=new cc.MenuItemImage(
            res.helpgoRight_png,
            res.helpgoRight2_png,
            function(){
                if(this._fileIndex<this._maxFileNum){
                    this._fileIndex++;
                    this.initLayerBG(this._fileIndex);
                }
            }.bind(this));

        this._goRight.setPosition(winSize.width-51,winSize.height/2);


        var quit=new cc.MenuItemImage(
            res.quit_png,
            res.quit_png,
            this.quitLayer,
            this);

        quit.setPosition(winSize.width-55,winSize.height-69);


        var menu=new cc.Menu(this._goLeft,this._goRight,quit);
        menu.setPosition(0,0);
        this.addChild(menu,10);

    },
    quitLayer:function(){
        GC.ISPAUSE=true;
        cc.audioEngine.stopAllEffects();
        this.removeFromParent();
    }


});