/**
 * Created by VV on 2016/4/1.
 */

var GameUI = cc.Layer.extend({

    _levelText : null,  //关卡label
    _scoreText : null,  //分数label
    _stepText  : null,  //步骤label
    _gameLayer : null,  //游戏层

    ctor : function(gameLayer){
        this._super();
        this._gameLayer = gameLayer;

        this.init();
        this.scheduleUpdate();//开启游戏循环
    },

    init : function(){

       var Wsize = cc.director.getWinSize();

        var yy=70;

        //关卡标签
        var levelLabel = new cc.LabelTTF("Level", "arial", 36);
        levelLabel.attr({
            x   :   100,
            y   :   Wsize.height - 50 -yy
        });
        levelLabel.setColor(cc.color(0, 0, 0));
        levelLabel.set_textFillColor = cc.color(0, 0, 0);
        this.addChild(levelLabel);
        //关卡内容
        var levelText = new cc.LabelTTF("1", "arial", 36);
        levelText.attr({
            x   :   levelLabel.x,
            y   :   levelLabel.y - 40 -yy
        });
        levelText.setColor(cc.color(0, 0, 0));
        levelText.set_textFillColor = cc.color(0, 0, 0);

        this.addChild(levelText);
        this._levelText = levelText;

        //分数标签
        var scoreLabel = new cc.LabelTTF("Score", "arial", 36);
        scoreLabel.attr({
            x   :   370,
            y   :   levelLabel.y
        });
        scoreLabel.setColor(cc.color(0, 0, 0));
        scoreLabel.set_textFillColor = cc.color(0, 0, 0);

        this.addChild(scoreLabel);
        //分数内容
        var scoreText = new cc.LabelTTF("0", "arial", 36);
        scoreText.attr({
            x   :   scoreLabel.x,
            y   :   levelText.y
        });
        scoreText.setColor(cc.color(0, 0, 0));
        scoreText.set_textFillColor = cc.color(0, 0, 0);

        this.addChild(scoreText);
        this._scoreText = scoreText;

        //步骤标签
        var stepLabel = new cc.LabelTTF("Step", "arial", 36);
        stepLabel.attr({
            x   :   620,
            y   :   levelLabel.y
        });
        stepLabel.setColor(cc.color(0, 0, 0));
        stepLabel.set_textFillColor = cc.color(0, 0, 0);

        this.addChild(stepLabel);
        //步骤内容
        var stepText = new cc.LabelTTF("0", "arial", 36);
        stepText.attr({
            x   :   stepLabel.x,
            y   :   levelText.y
        });
        stepText.setColor(cc.color(0, 0, 0));
        stepText.set_textFillColor = cc.color(0, 0, 0);

        this.addChild(stepText);
        this._stepText = stepText;
    },

    showSuccess : function(){
        var Wsize = cc.director.getWinSize();

        var bg = new cc.Sprite(res.Shuying_png);
        bg.attr({
            x   :   Wsize.width/2,
            y   :   Wsize.height/2
        });
        this.addChild(bg, 1);

        var text = new cc.LabelTTF("恭喜, 已完成第" + (this._gameLayer._level+1) + "关, \n剩余步数30倍奖励！", "arial", 50);
        text.setColor(cc.color(0, 0, 0));
        text.attr({
            x   : 40,
            y   : 70,
            anchorX:0,
            anchorY:0
        });
        bg.addChild(text);
    },

    showFail : function(){
        var Wsize = cc.director.getWinSize();
        var bg = new cc.Sprite(res.Shuying_png);
        bg.attr({
            x   :   Wsize.width/2,
            y   :   Wsize.height/2
        });
        this.addChild(bg, 1);

        var text = new cc.LabelTTF("   失败了,\n重新开始吧！", "arial", 56);
        text.setColor(cc.color(0, 0, 0));
        text.attr({
            x   : 100,
            y   : 70,
            anchorX:0,
            anchorY:0
        });
        bg.addChild(text);
    },

    update : function(){

        this._levelText.setString((this._gameLayer._level+1).toString());
        this._scoreText.setString((this._gameLayer._score).toString());
        this._stepText.setString((this._gameLayer._limitStep - this._gameLayer._steps).toString());
    }
});



















