/**
 * Created by caojie on 16/3/2.
 */

var gameLayer=cc.Layer.extend({
    _player:null,           //主角
    _hudLayer:null,         //关卡层;
    _curIdx:0,              //当前关卡数;
    _listenner:null,        //触摸;
    _gameInfo:null,         //操作信息;
    _leveltimer:0.0,        //游戏时间;
    _isRight:null,          //当前关卡答案是否正确;
    _json:null,             //studio的json文件;

    _beganPos:null,         //点到图片时坐标;
    _spPos:null,            //点击的图片原本坐标;
    _imgArr:[],             //操作的图片数组;
    _imgArrIndex:null,      //当前点击的是数组里面的第几个;
    _isMove:null,           //是否允许拖动;
    _isRotation:null,       //是否可以旋转了;
    //-------------从Json取数据----------------
    _posArr:[],             //坐标数组;
    _answerArr:[],          //隐藏的答案数组;

    //----------- 菜单按钮全局变量 ---------------
    _nextButton:null,       //下一关菜单按钮;
    _refreshButton:null,    //重新开始菜单按钮;
    _tipBtn:null,
    _rotateBtn:null,




    ctor:function(){
        this._super();

        this.init();
        return true;
    },
    init:function(){
        //游戏屏幕大小;
        var winSize=cc.winSize;

        //关卡显示Layer;
        this._hudLayer=new HudLayer();
        this.addChild(this._hudLayer,10);

        //外边框;
        var frameSp=new cc.Sprite(res.SceneBounds_png);
        frameSp.setPosition(winSize.width/2,winSize.height/2);
        this.addChild(frameSp,100);

        //主角精灵;
        this._player = new cc.Sprite();
        this._player.setScale(1);
        this._player.setAnchorPoint(cc.p(0,0));
        this._player.setPosition(cc.p(20,40));
        this.addChild(this._player,10);


        //初始化操作信息;
        this._gameInfo = new GameInfo(this._curIdx);

        //初始化菜单;
        this.initMenu();

        //开始游戏 load Json;
        this.starGame();

        //添加触摸;
        this.initTouch();

    },

    //初始化菜单;
    initMenu:function(){
        //游戏屏幕大小;
        var winSize=cc.winSize;

        //Menu横坐标值;
        var menuPosX=winSize.width-49;


        //音乐开关按钮;
        var item1=new cc.MenuItemImage(res.Menu_music_normal_png,res.Menu_music_select_png,this.onMenuMusicCallback,this);
        item1.attr({
            x:menuPosX,
            y:winSize.height-50
        });

        //暂停菜单;
        var item2 = new cc.MenuItemImage(res.Menu_pause_normal_png, res.Menu_pause_select_png, this.onMenuPauseCallback, this);
        item2.attr({
            x:menuPosX,
            y:winSize.height-120
        });
        //帮助游戏菜单;
        var item3= new cc.MenuItemImage(res.Menu_help_normal_png, res.Menu_help_normal_png,res.Menu_help_heibai_png, this.onMenuHelpCallback, this);
        item3.attr({
            x:menuPosX,
            y:winSize.height-190   //y:winSize.height*0.4
        });

        //退出游戏菜单;
        var item4= new cc.MenuItemImage(res.Menu_exit_normal_png, res.Menu_exit_select_png, this.onMenuExitCallback, this);
        item4.attr({
            x:menuPosX,
            y:winSize.height-260   //y:winSize.height*0.4
        });

        //下一关菜单按钮;
        var item5 = new cc.MenuItemImage(res.Menu_next_normal_png, res.Menu_next_select_png, this.onMenuNextCallback, this);
        item5.attr({
            x:winSize.width-68,
            y:50
        });
        this._nextButton = item5;

        //重新开始菜单;
        var item6 = new cc.MenuItemImage(res.Menu_refresh_normal_png, res.Menu_refresh_select_png, this.onMenuRefreshCallback, this);
        item6.attr({
            x:menuPosX,
            y:120   //y:winSize.height*0.25
        });
        this._refreshButton = item6;

        //投降 surrender;
        var item7 = new cc.MenuItemImage(res.Menu_surrender_select_png, res.Menu_surrender_select_png, this.onMenuTipCallback, this);
        item7.attr({
            x:280,
            y:50
        });
        this._tipBtn=item7;

        
        //旋转菜单;
        var item8 = new cc.MenuItemImage(res.Final_rotation_png, res.Final_rotation_png, this.onRotitionCallback, this);
        item8.attr({
            x:winSize.width-145,
            y:50
        });
        this._rotateBtn=item8;

        var mainMenu = new cc.Menu(item1,item2,item3,item4, item5,item7, item6,item8);
        mainMenu.attr({
            anchorX:0,
            anchorY:0,
            x:0,
            y:0
        });
        this.addChild(mainMenu,30);
    },

    /*
    * 开始游戏；
    */

    starGame: function () {

        //读取JSon文件;
        cc.loader.loadJson(res.Json_config,function(err,ret){

            //当json出错时;
            if(err){
                return;
            }
            if(GC.LEVELS.length){
                GC.LEVELS=[];
            }

            var items=ret["items"];

            var randArr=GC.RandomArray();

            cc.log(randArr);

            var iCut=0;

            for(var i in randArr){
                var itemkey="item"+randArr[i];

                var item=items[itemkey];

                var que=item["question"];

                var imgs=item["imgs"];

                var nums=item["nums"];

                var reqd=item["reqd"];

                var q=new Question(que,imgs,nums,reqd);
                q.setResult(0);
                GC.LEVELS.push(q);

                iCut++;

                if(iCut>=GC.TOTAL_LEVELS){
                    break;
                }
            }
            
            //答案是否正确的obj;
            for(var x=0;x<GC.LEVELS.length;x++){
                var lev=new Object();
                lev.num=0;
                GC.LEVELSRIGHT.push(lev);
            }

            this._curIdx=0;
            //加载关卡;
            this.loadQuestion(this._curIdx)

            this.schedule(this.playTimeTicker, 0.1);

        }.bind(this));

    },
    //加载相应的关卡;
    loadQuestion:function(curIdx){
        //如果关卡数不在应有的范围内;
        if(curIdx<0 || curIdx>(GC.LEVELS.length-1)){
           return;
        }

        //初始化信息对象;
        this._gameInfo.setBarrier(this._curIdx);
        if(this._json!=null){
            this._json.removeFromParent();
        }

        //不能旋转;
        this._isRotation=false;

        this._rotateBtn.setEnabled(true);

        this._tipBtn.setEnabled(true);

        //待机动画  GC.LEVELIND 关卡状态  人物动画函数;
        this.playRoleAnim(GC.LEVELIND.NORMAL);

        var json=GC.LEVELS[curIdx];

        var que=json.getQuestion();

        var level=eval(que["t1"]);

        //添加背景Json;
        var levelJson=ccs.load(level.toString());
        this.addChild(levelJson.node);
        this._json=levelJson.node;


        //关卡图片数量;
        var levelNum=parseInt(json.getAnswer());
        //得到隐藏的坐标图片;
        this.initPosArr(levelNum);

        var reqd=json.getReqd();

        //隐藏的答案图片;
        this.initAnswerArr(levelNum,reqd);

        var imgs=json.getOptions();

        this.initImgArr(imgs);

        //开启触摸;
        if(this._listenner!=null){
            cc.eventManager.addListener(this._listenner,this);
        }

        //隐藏下一关、提示、重新开始菜单;
        this._nextButton.setVisible(false);
        this._refreshButton.setVisible(false);
    },
    //初始化坐标数组;
    initPosArr:function(num){

        this._posArr=[];
        for(var x=1;x<=num;x++){
            var posImg=this._json.getChildByName("t"+x);
            this._posArr.push(posImg);
        }

    },

    //初始化图片数组;
    initImgArr:function(arr){

        if(this._imgArr.length>0){
            for(var x=0;x<this._imgArr.length;x++){
                this._imgArr[x].removeFromParent();
            }
        }
        this._imgArr=[];


        for(var x=0;x<arr.length;x++){
            var sp=new baseSprite(eval(arr[x][0]),arr[x][1],arr[x][2]);
            sp.setPosition(this._posArr[x].getPosition());
            this.addChild(sp);
            this._imgArr.push(sp);
        }

    },

    initImgArrScale:function(){
        for(var x=0;x<this._imgArr.length;x++){
            this._imgArr[x].setScale(1.0);
        }
    },

    //初始化答案数组;
    initAnswerArr:function(num,reqd){

        this._answerArr=[];
        for(var x=1;x<=num;x++){
            var answerImg=this._json.getChildByName("a"+x);

            var obj=new Object();
            obj.sp=answerImg;
            obj.type=reqd[(x-1)][0];
            obj.num=reqd[(x-1)][1];
            obj.isVisi=false;
            this._answerArr.push(obj);
        }


    },
    //游戏时间函数;
    playTimeTicker:function(dt) {
        if (GC.ISPAUSE){
            this._leveltimer += dt;
        }
        //cc.log("time:"+ this._leveltimer);
    },

    //人物动画函数;
    playRoleAnim: function (status) {

        var plist = null, prefix = null, framecnt = 0, startidx = 0;

        switch (status){
            case GC.LEVELIND.NORMAL:
                plist = res.Anim_player_idle_plist;
                prefix = "idle";                //待机 key值前缀;
                framecnt = 30;                  //张数;
                startidx = 10000;               //key值;
                break;
            case GC.LEVELIND.WRONG:
                plist = res.Anim_player_sad_plist;
                prefix = "sad";                  //难过;
                framecnt = 30;
                startidx = 10000;
                break;
            case GC.LEVELIND.CORRECT:
                plist = res.Anim_player_happy_plist;
                prefix = "happy";               //开心;
                framecnt = 30;
                startidx = 10000;
                break;
        }

        this._player.stopAllActions();

        //getAnimation 获取动画对象;
        var anim = cc.animationCache.getAnimation(prefix);
        if(anim != null){
            this._player.runAction(anim.repeatForever());
        }else{
            anim = GC.prepareAnimation(plist, prefix, framecnt, startidx);
            //通过动画和名字添加到缓存;
            cc.animationCache.addAnimation(anim, prefix);
            this._player.runAction(anim.repeatForever());
        }
    },

    //添加触摸;
    initTouch:function(){

        this._listenner =cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(touch,event){

                var Pos=touch.getLocation();
                var me=event.getCurrentTarget();

                me._isMove=false;
                for(var x=0;x<me._imgArr.length;x++){
                    if(cc.rectContainsPoint(me._imgArr[x].getBoundingBox(),Pos)){
                        me.initImgArrScale();
                        me._isRotation=true;
                        me._isMove=true;
                        me._imgArrIndex=x;
                        me._beganPos=Pos;
                        me._spPos=me._imgArr[me._imgArrIndex].getPosition();
                        me._imgArr[me._imgArrIndex].setLocalZOrder(10);
                        if(me._imgArr[me._imgArrIndex].getMove()){
                            me._imgArr[me._imgArrIndex].setScale(1.1);
                            me._imgArr[me._imgArrIndex].setLocalZOrder(10);
                        }

                    }
                }

                return true;
            },
            onTouchMoved:function(touch,event){

                var Pos=touch.getLocation();
                var me=event.getCurrentTarget();
                var PosX=0;
                var PosY=0;



                if(me._isMove && me._imgArr[me._imgArrIndex].getMove()){
                    PosX=Pos.x-me._beganPos.x;
                    PosY=Pos.y-me._beganPos.y;
                    me._imgArr[me._imgArrIndex].setPosition(me._spPos.x+PosX,
                                                            me._spPos.y+PosY);
                }

            },
            onTouchEnded:function(touch,event) {

                var Pos = touch.getLocation();
                var me = event.getCurrentTarget();

                if(!me._isMove){
                    return;
                }

                for(var x=0;x<me._answerArr.length;x++){
                    if(cc.rectContainsPoint(me._answerArr[x].sp.getBoundingBox(),Pos)){
                        if(me._imgArr[me._imgArrIndex].getType()==me._answerArr[x].type &&
                            me._imgArr[me._imgArrIndex].getnumber()==me._answerArr[x].num &&
                            me._answerArr[x].isVisi==false){

                            me._imgArr[me._imgArrIndex].setPosition(me._answerArr[x].sp.getPosition());
                            me._answerArr[x].isVisi=true;
                            me._imgArr[me._imgArrIndex].setMove(false);
                            me._imgArr[me._imgArrIndex].setIsRotation(false);
                            me.initImgArrScale();

                            me.guoguan();
                            return;
                        }

                    }

                }

                me._imgArr[me._imgArrIndex].setPosition(me._spPos.x,me._spPos.y);

            }
        });
        cc.eventManager.addListener(this._listenner,this);
    },

    guoguan:function(){

        var isTrun=true;
        for(var x=0;x<this._answerArr.length;x++){
            if(this._answerArr[x].isVisi==false){
                isTrun=false;
                break;
            }
        }

        if(isTrun){
            this._isRight=true;
            this.onMenuTrueCallback();
        }
    },

    //------------------菜单回调-----------------------------

    //声音开关回调;
    onMenuMusicCallback:function(sender){
        //取当时开关的相反数;
        GC.EFFECTFLAG = !GC.EFFECTFLAG;

        //根据是否时开关 设置相应的纹理;
        var imgFile=GC.EFFECTFLAG?res.Menu_music_normal_png:res.Menu_music_disable_png;
        sender.getNormalImage().setTexture(imgFile);

    },
    //暂停菜单回调;
    onMenuPauseCallback:function(sender){

        //开启暂停;
        GC.ISPAUSE=false;

        var pauseLayer=new PauseLayer();
        //设置代理;
        pauseLayer.setDelegate(this);
        this.addChild(pauseLayer,100);

    },
    //退出菜单回调;
    onMenuExitCallback:function(sender){

        //停止时间的走动;
        this.unschedule(this.playTimeTicker);

        //添加退出层;
        var quitLayer=new QuitLayer();
        //设置代理;
        quitLayer.setDelegate(this);
        this.addChild(quitLayer,100);
    },
    //下一关菜单回调;
    onMenuNextCallback:function(){

        /*
         *      try {
         * 　　// 此处是可能产生例外的语句
         *　　} catch(error) {
         *　　// 此处是负责例外处理的语句
         *　　} finally {
         *　　// 此处是出口语句
         *　　}
         *
         *　　上述代码中，try块中的语句首先被执行。如果运行中发生了错误，
         *  控制就会转移到位于catch块中语句，其中括号中的error参数被作为例外变量传递。
         *  否则，catch块的语句被跳过不执行。无论是发生错误时catch块中的语句执行完毕，
         *  或者没有发生错误try块中的语句执行完毕，最后将执行finally块中的语句。
         */

        //当前关卡＋＋;
        this._curIdx++;

        //关卡是否在范围内  如果不在范围内;
        if(this._curIdx<0 || this._curIdx>(GC.LEVELS.length-1))
        {

            //停止时间的走动;
            this.unschedule(this.playTimeTicker);

            if(this._curIdx>(GC.LEVELS.length-1))
            {
                var correctNum=0;
                for(var i =0;i< GC.LEVELSRIGHT.length;i++){
                    if(GC.LEVELSRIGHT[i].num==1)
                    {
                        correctNum++;
                    }
                }
                var sunmaryL=new SummaryLayer(correctNum);
                sunmaryL.setDelegate(this);
                this.addChild(sunmaryL,200);
            }
            return;
        }

        //加载游戏;
        this.loadQuestion(this._curIdx);

        //重置时间计数
        this._leveltimer = 0.0;
    },
    //重新开始回调;
    onMenuRefreshCallback:function(){

        //player恢复正常待机动画
        this.playRoleAnim(GC.LEVELIND.NORMAL);

        //关卡层 相应的关卡 重新赋值;
        this._hudLayer.changeLevelIndicator(this._curIdx, GC.LEVELIND.NORMAL);

        this._leveltimer=0.0;

        //撤销次数加1
        this._gameInfo.setRestart(this._gameInfo.getRestart()+1);

        //重新加载当前问题
        this.loadQuestion(this._curIdx)

    },
    //投降;
    onMenuTipCallback:function(){
        /*

        //提示次数加1
        this._gameInfo.setPrompt(this._gameInfo.getPrompt()+1);
        cc.eventManager.removeListener(this._listenner);
        */

        this._isRight=false;
        this._rotateBtn.setEnabled(false);
        this.onMenuTrueCallback();

    },

    //旋转角度;
    onRotitionCallback:function() {
        if(this._isRotation && this._imgArrIndex!=null&&this._imgArr[this._imgArrIndex].getIsRotation()){
            this._imgArr[this._imgArrIndex].setRotation( this._imgArr[this._imgArrIndex].getRotation()+90);
            this._imgArr[this._imgArrIndex].setnumber(this._imgArr[this._imgArrIndex].getnumber()+1);
        }
    },

    //暂停界面的代理回调方法;
    playClicked:function(sender){
        GC.ISPAUSE=true;
    },

    //帮助菜单回调;
    onMenuHelpCallback:function(){

        GC.ISPAUSE=false;
        GMSG.playHelpVideo(GMSG.HelpAction == GMSG.HelpFlag.FRAME?undefined:this);

        /*
       var layer=new helpLayer();
       layer.setPosition(0,0);
       this.addChild(layer,200);
       */
    },

    //确认提交按钮回调;
    onMenuTrueCallback:function(){
        
        
       //注销点击事件;
        cc.eventManager.removeListener(this._listenner);

        //答案正确;
        if(this._isRight){
           //设置当前关卡层;
            this._hudLayer.changeLevelIndicator(this._curIdx,GC.LEVELIND.CORRECT);

            if(GC.EFFECTFLAG){
                cc.audioEngine.playEffect(res.right_mp3);
                cc.audioEngine.playEffect(res.effort_mp3);
            }

            //保存答案是否正确信息;
            GC.LEVELSRIGHT[this._curIdx].num=1;

            //待机动画  GC.LEVELIND 关卡状态  人物动画函数;
            this.playRoleAnim(GC.LEVELIND.CORRECT);

            //显示结果 成功或者失败的;
            this.showResult(true);

        }else{

            //设置关卡等级;
            this._hudLayer.changeLevelIndicator(this._curIdx,GC.LEVELIND.WRONG);
            this.showResult(false);

            //待机动画  GC.LEVELIND 关卡状态  人物动画函数;
            this.playRoleAnim(GC.LEVELIND.WRONG);

            //保存答案是否正确信息;
            GC.LEVELSRIGHT[this._curIdx].num=0;
            if(GC.EFFECTFLAG){
                cc.audioEngine.playEffect(res.wrong_mp3);
                cc.audioEngine.playEffect(res.playup_mp3);
            }


        }

        //显示下一关按钮;
        this._nextButton.setVisible(true);
        this._refreshButton.setVisible(true);
        this._tipBtn.setEnabled(false);


        //收集用户游戏数据
        try{
            //solution 1:
            var barrier = this._curIdx + 1;
            //是否为正确过关;
            var ret = this._isRight?1:0;
            var po=this._gameInfo.getPrompt()>0?1:0;
            var totaltime = Math.ceil(this._leveltimer * 1000);    //毫秒
            GP.postUserData(barrier,ret, totaltime, this._gameInfo.getRestart(),po);
            this._gameInfo.setPrompt(0);

        }catch(e){
            cc.log(e.name + ":" + e.message);
        }
    },

    //成功或者失败的界面回调;
    showResult:function(bSuccessful){

        var showLayer=new ResultLayer(bSuccessful);
        this.addChild(showLayer,100);
    },


    //-------------------代理回调-----------------------------

    /*
     * 退出界面代理回调
     */

    //确定退出界面;
    yesClicked:function(sender){
        GMSG.exitGame();
        /*
        if(window.grwl){
            window.grwl.endFunction();
        }else{
            cc.log("no grwl");
        }
        */
    },
    //取消退出界面;
    noClicked : function(sender){
        this.schedule(this.playTimeTicker, 0.1);
    },
    

    //过关界面的代理回调;
    exitMenuClicked:function(sender){

        //TODO: 退出游戏
        GMSG.exitGame();
        /*
        if(window.grwl) {
            window.grwl.endFunction();
        }else{
            cc.log("no grwl object!");
        }
        */
    },
    restartMenuClicked : function(sender){
        cc.log("restartMenuClicked=====")

        //TODO:重新开始游戏
        this._curIdx = 0;
        this._leveltimer = 0.0;
        this._gameInfo.resetData();
        for(var i=0;i<GC.LEVELS.length;i++){
            this._hudLayer.changeLevelIndicator(i, GC.LEVELIND.NORMAL);
        }
        this.starGame();
    }

});

var GameScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new gameLayer();
        this.addChild(layer);
    }

});