/**
 * Created by VV on 2016/4/1.
 */
    /*
    * 糖果布局与消除逻辑    *
    * */

var GameLayer = cc.Layer.extend({

    _isTouch    :   true,       //是否可以点击
    _pointBefore:   null,       //点击的点前

    _ui         :   null,        //ui
    _mapPanel   :   null,       //地图容器层
    _map        :   null,       //地图里面盛放糖果的数组

    _level      :   0,          //关卡
    _score      :   0,          //分数
    _steps      :   0,          //走的步数
    _limitStep  :   0,          //总步数
    _targetScore:   0,          //任务分数

    _restartBut :   null,       //刷新

    _bg:null,                       //背景


    _moving     :   false,  //糖果正在移动，不接受再次点击事件


    ctor : function(){

        this._super();
        var Wsize = cc.director.getWinSize();


        //背景
        this._bg = new cc.Sprite();
        this._bg.attr({
            x  :  Wsize.width/2,
            y  :  Wsize.height/2
        });
        this.addChild(this._bg, -1);
        //刷新菜单
        var restart_item = new cc.MenuItemImage(res.png_restart, res.png_restart, res.png_restart, this.clickRestartButFunc, this);
        restart_item.attr({
            x   :   Wsize.width/2+100,
            y   :   200
        });
        restart_item.setScale(2.0);
        this._restartBut = restart_item;

        var Item4 = new cc.MenuItemImage(res.back1_png,res.back1_png,function(){
            if(GC.EFFECTFLAG) {
                cc.audioEngine.playEffect(res.Yinxiao_dian);
            }
            cc.director.runScene(new optionScene());
        },this);
        Item4.x = Wsize.width/2-100;
        Item4.y = 200;
        Item4.setScale(2.0);



        var mainMenu = new cc.Menu(restart_item,Item4);
        mainMenu.attr({
            anchorX : 0,
            anchorY : 0,
            x       : 0,
            y       : 0
        });
        this.addChild(mainMenu, 20);

        //1.创建裁剪节点
        //创建裁剪节点ClippingNode对象  不带模板
        var clippingPanel = new cc.ClippingNode();
        this.addChild(clippingPanel, 2);

        //3.创建底板
        this._mapPanel = new cc.Layer();
        this._mapPanel.x = (Wsize.width - GC.USERDATA.CANDY_WIDTH*GC.USERDATA.MAP_SIZE)/2;
        this._mapPanel.y = (Wsize.height- GC.USERDATA.CANDY_WIDTH*GC.USERDATA.MAP_SIZE)/2;
        //4、加入底板
        clippingPanel.addChild(this._mapPanel, 1);

        //2.设置模板
        var stencil = new cc.DrawNode();
        stencil.drawRect(cc.p(this._mapPanel.x, this._mapPanel.y), cc.p(this._mapPanel.x + GC.USERDATA.CANDY_WIDTH*GC.USERDATA.MAP_SIZE, this._mapPanel.y + GC.USERDATA.CANDY_WIDTH*GC.USERDATA.MAP_SIZE), cc.color(0, 0, 0), 1, cc.p(0, 0, 0));
        clippingPanel.stencil = stencil;//设置模板
        //clippingPanel.inverted = true;//显示被模板裁剪下来的底板内容。默认为false 显示被剪掉部分。
                                        // 设置底板可见，显示剩余部分

        cc.eventManager.addListener({
            event         : cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan  : this.onTouchBegan.bind(this),
            onTouchEnded  : this.onTouchEnded.bind(this),
        }, this._mapPanel);

        this.init();
        //初始化ui
        this._ui = new GameUI(this);
        this.addChild(this._ui, 3);

        /*******测试代码区********/
        //this._ui.showFail();
        //this._ui.showSuccess();

        return true;
    },

    clickRestartButFunc : function(){
      cc.log("clickRestartButFunc.");
        if(GC.EFFECTFLAG) {
            cc.audioEngine.playEffect(res.Yinxiao_dian);
        }

        this.scheduleOnce(function(){
            this._steps = 0;

            switch (GC.VV){
                case 1: {
                    this._level = Storage.getCurrentLevel();
                    this._score = Storage.getCurrentScore();

                    this._limitStep   = GC.LEVELSDATA[this._level].limitStep;
                    this._targetScore = GC.LEVELSDATA[this._level].targetScore;
                    break;
                }
                case 2: {
                    this._level = Storage.getCurrentLevel2();
                    this._score = Storage.getCurrentScore2();

                    this._limitStep   = GC.LEVELSDATA2[this._level].limitStep;
                    this._targetScore = GC.LEVELSDATA2[this._level].targetScore;
                    break;
                }
                case 3: {
                    this._level = Storage.getCurrentLevel3();
                    this._score = Storage.getCurrentScore3();

                    this._limitStep   = GC.LEVELSDATA3[this._level].limitStep;
                    this._targetScore = GC.LEVELSDATA3[this._level].targetScore;
                    break;
                }
            }


            this.scheduleOnce(function(){
                cc.director.runScene(new GameScene());
            }, 0.3);
        }, 0.1);
    },

    init : function () {

        //初始化数据
        this._steps = 0;

        switch (GC.VV){
            case 1: {
                this._level = Storage.getCurrentLevel();
                this._score = Storage.getCurrentScore();

                this._limitStep   = GC.LEVELSDATA[this._level].limitStep;
                this._targetScore = GC.LEVELSDATA[this._level].targetScore;
                this._bg.setTexture(GC.LEVELSDATA[this._level].bg);
                break;
            }
            case 2: {
                this._level = Storage.getCurrentLevel2();
                this._score = Storage.getCurrentScore2();

                this._limitStep   = GC.LEVELSDATA2[this._level].limitStep;
                this._targetScore = GC.LEVELSDATA2[this._level].targetScore;
                this._bg.setTexture(GC.LEVELSDATA2[this._level].bg);
                break;
            }
            case 3: {
                this._level = Storage.getCurrentLevel3();
                this._score = Storage.getCurrentScore3();

                this._limitStep   = GC.LEVELSDATA3[this._level].limitStep;
                this._targetScore = GC.LEVELSDATA3[this._level].targetScore;
                this._bg.setTexture(GC.LEVELSDATA3[this._level].bg);
                break;
            }
        }

        //盛放糖果的数组
        this._map = [];
        for (var i = 0; i<GC.USERDATA.MAP_SIZE; i++){
            var column = [];//行数组
            for (var j = 0; j<GC.USERDATA.MAP_SIZE; j++){
                var candyTemp = Candy.createRandomType(i, j);
                this._mapPanel.addChild(candyTemp);

                candyTemp.x = i * GC.USERDATA.CANDY_WIDTH + GC.USERDATA.CANDY_WIDTH/2;
                candyTemp.y = j * GC.USERDATA.CANDY_WIDTH + GC.USERDATA.CANDY_WIDTH/2;

                column.push(candyTemp);
            }
            this._map.push(column);  //二维数组
        }
    },

    onTouchBegan : function (touch, event){
        cc.log("onTouchBegan");
        this._pointBefore  = touch.getLocation();
        if(GC.EFFECTFLAG) {
            cc.audioEngine.playEffect(res.Yinxiao_dian);
        }

        return this._isTouch;
    },

    onTouchEnded :function(touch, event){
        cc.log("onTouchEnded.");
        var point  = touch.getLocation();

        //判断点击开始点和结束点是否为同一个点。
        if(this._pointBefore.x==point.x && this._pointBefore.y==point.y) {
            cc.log("The same point.");
            //floor向下取整得到行和列
            var column = Math.floor((point.x - this._mapPanel.x) / GC.USERDATA.CANDY_WIDTH);
            var row = Math.floor((point.y - this._mapPanel.y) / GC.USERDATA.CANDY_WIDTH);
            cc.log("(" + column + "," + row + ")");

            if (column >= 0 && column <= 9 && row >= 0 && row <= 9) {
                this.popCandy(column, row);
            }
            else {
                cc.log("Other.");
            }
        }
        else {
            cc.log("Not same point.");
        }
    },

    /*
    * 建立集合,存储全部相连的糖果。初始时只有被点击的糖果
    * 遍历集合中的糖果，判断上，下，左，右4个方向的糖果是否跟该糖果是同一个颜色，如果是，则把旁边的糖果加入到数组中。把新糖果加入之前检查是否已经存在。
    * 遍历完集合的时候，相连的糖果就被找出来了
    *
    * 得到相连糖果：=1，2  不执行消除
    *             >=3 执行消除，增加已用步数，并计算当前得到的分数。
    *             删除后再执行生成新的糖果，同时检查进度。
    *
    * */
    popCandy :function(column, row){
        cc.log("popCandy_column_row = ", column, row);
        if (this._moving){
            return;
        }

        //找出跟点击糖果相连的全部糖果，初始只有点击的糖果
        var joinCandys = [this._map[column][row]];
        cc.log("joinCandy = ", joinCandys.length);
        var index = 0;

        //添加到相连糖果数组中
        var pushIntoCandys = function(element){
            //indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
            //stringObject.indexOf(searchvalue,fromindex)
            //searchvalue	必需。规定需检索的字符串值。
            //fromindex	可选的整数参数。规定在字符串中开始检索的位置。它的合法取值是 0 到 stringObject.length - 1。
            //如省略该参数，则将从字符串的首字符开始检索。
            //indexOf() 方法对大小写敏感！
            //如果要检索的字符串值没有出现，则该方法返回 -1。
            //TODO ?
            if(joinCandys.indexOf(element) < 0){
                joinCandys.push(element);
                cc.log("******************************************"+joinCandys.indexOf(element));

                cc.log("pushIntoCandys_joinCandys.length = ", joinCandys.length);
            }
        };

        while (index < joinCandys.length){
            var candy = joinCandys[index];
            //左（存在，并且颜色一样）
            if (this.checkCandyExist(candy._column-1, candy._row) && this._map[candy._column-1][candy._row]._type == candy._type){
               pushIntoCandys(this._map[candy._column-1][candy._row]);
            }

            //右
            if (this.checkCandyExist(candy._column+1, candy._row) && this._map[candy._column+1][candy._row]._type == candy._type){
                pushIntoCandys(this._map[candy._column+1][candy._row]);
            }

            //上
            if (this.checkCandyExist(candy._column, candy._row-1) && this._map[candy._column][candy._row-1]._type == candy._type){
                pushIntoCandys(this._map[candy._column][candy._row-1]);
            }

            //下
            if (this.checkCandyExist(candy._column, candy._row+1) && this._map[candy._column][candy._row+1]._type == candy._type){
                pushIntoCandys(this._map[candy._column][candy._row+1]);
            }
            index++;
        }

        //如果点击的星星周围没有相同颜色的星星，则返回
        cc.log("joinCandys.length = ", joinCandys.length);
        if (joinCandys.length <=2) {
            cc.log("joinCandys.length <=1");
            return;
        }

        this._steps++;
        this._moving = true;

        //cc.audioEngine.playEffect(res.Yinxiao_clear,false);

        //移除糖果
        for (var i = 0; i<joinCandys.length; i++){
            if(GC.EFFECTFLAG) {
                cc.audioEngine.playEffect(res.Yinxiao_clear);
            }
            var candy = joinCandys[i];
            this._mapPanel.removeChild(candy);
            this._map[candy._column][candy._row] = null;
        }
        //得分
        this._score += joinCandys.length * joinCandys.length;
        //补充糖果
        this.generateNewCandy();
        //展示结果
        this.checkSucceedOrFail();
    },

    checkCandyExist : function(i, j){
        if(i>=0 && i<GC.USERDATA.MAP_SIZE && j>=0 &&j<GC.USERDATA.MAP_SIZE){
           // cc.log("in.");
            return true;
        }
        //cc.log("out.");
        return false;
    },
/*
*
* 补充糖果
* 该列消除了多少个糖果，并在上方生成多少个糖果
*
* */
    generateNewCandy : function(){
        cc.log("generateNewCandy.");
        var maxTime = 0;
        for (var i = 0; i<GC.USERDATA.MAP_SIZE; i++){
            var missCount = 0;
            for (var j = 0; j<this._map[i].length; j++){
                var candy = this._map[i][j];
                if(!candy){
                    //TODO ?
                    var candy = Candy.createRandomType(i, GC.USERDATA.MAP_SIZE + missCount);
                    candy.x   = candy._column * GC.USERDATA.CANDY_WIDTH + GC.USERDATA.CANDY_WIDTH/2;
                    candy.y   = candy._row    * GC.USERDATA.CANDY_WIDTH + GC.USERDATA.CANDY_WIDTH/2;
                    this._mapPanel.addChild(candy);

                    this._map[i][candy._row] = candy;
                    missCount++;
                }
                else {
                    var fallLength = missCount;
                    if(fallLength > 0){
                        var duration = Math.sqrt(2*fallLength/GC.USERDATA.FALL_ACCELERATION);
                        if (duration>maxTime){
                            maxTime = duration;
                        }
                            //easing：指定动画效果，Easing js提供多种动画效果，有匀速运动、变加速运动、缓冲波动效果，
                            var action = new cc.MoveTo(duration, candy.x, candy.y - GC.USERDATA.CANDY_WIDTH*fallLength).easing(cc.easeIn(2));
                            candy.runAction(action);
                            candy._row -= fallLength;

                            this._map[i][j] = null;
                            this._map[i][candy._row] = candy;
                    }
                }
            }
            //移除超出地图的临时元素位置
            //splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目。
            //arrayObject.splice(index,howmany,item1,.....,itemX)
            //index	必需。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。
            //howmany	必需。要删除的项目数量。如果设置为 0，则不会删除项目。
            //itemX	可选。向数组添加的新项目。
            for(var j = this._map[i].length; j>=GC.USERDATA.MAP_SIZE; j--){
                this._map[i].splice(j, 1);
            }
        }
        this.scheduleOnce(this.finishCandyFalls.bind(this), maxTime);
    },

    checkSucceedOrFail : function(){
        cc.log("this._score = ", this._score);
        cc.log("this._targetScore = ", this._targetScore);
        cc.log("this._steps = ", this._steps);
        cc.log("this._limitStep = ", this._limitStep);

        if(GC.EFFECTFLAG) {
            cc.audioEngine.playEffect(res.Yinxiao_win);
        }

        if(this._score >= this._targetScore){

            this._isTouch = false;
            this._score += (this._limitStep - this._steps) * 30;
            if(this._level<5){
                switch (GC.VV){
                    case 1: {
                        Storage.setCurrentLevel(this._level+1);
                        Storage.setCurrentScore(this._score);
                        break;
                    }
                    case 2: {
                        Storage.setCurrentLevel2(this._level+1);
                        Storage.setCurrentScore2(this._score);
                        break;
                    }
                    case 3: {
                        Storage.setCurrentLevel3(this._level+1);
                        Storage.setCurrentScore3(this._score);
                        break;
                    }
                }
            }else{
                switch (GC.VV){
                    case 1: {
                        Storage.setCurrentLevel(0);
                        Storage.setCurrentScore(0);
                        break;
                    }
                    case 2: {
                        Storage.setCurrentLevel2(0);
                        Storage.setCurrentScore2(0);
                        break;
                    }
                    case 3: {
                        Storage.setCurrentLevel3(0);
                        Storage.setCurrentScore3(0);
                        break;
                    }
                }

                if(GC.EFFECTFLAG) {
                    cc.audioEngine.playEffect(res.Yinjiao_mp3);
                }
                cc.director.runScene(new winScene());
            }

            this._ui.showSuccess();

            this.scheduleOnce(function(){
                this._isTouch = true;
                cc.director.runScene(new GameScene());
            }, 3);
        }
        else if(this._steps >= this._limitStep){
            this._ui.showFail();
            if(GC.EFFECTFLAG) {
                cc.audioEngine.playEffect(res.Yinxiao_lose);
            }
            this._isTouch = false;

            switch (GC.VV){
                case 1: {
                    Storage.setCurrentLevel(0);
                    Storage.setCurrentScore(0);
                    break;
                }
                case 2: {
                    Storage.setCurrentLevel2(0);
                    Storage.setCurrentScore2(0);
                    break;
                }
                case 3: {
                    Storage.setCurrentLevel3(0);
                    Storage.setCurrentScore3(0);
                    break;
                }
            }



            this.scheduleOnce(function(){
                this._isTouch = true;
                cc.director.runScene(new GameScene());
            }, 3);
        }
    },

    finishCandyFalls : function(){
        this._moving = false;
    }

});

var GameScene = cc.Scene.extend({
    onEnter : function () {
        this._super();

        var layer = new GameLayer();
        this.addChild(layer);
    }
});






























