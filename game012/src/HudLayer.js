/**
 * Created by apple on 16/2/18.
 */

/* HUD layer*/
var HudLayer = cc.Layer.extend({
    _levelArray:[],

    ctor:function(){
        this._super();
        this.init();
        return true;
    },
    init:function(){
        var winSize = cc.director.getVisibleSize();
        var y = winSize.height-40;
        for(var i=0;i<GC.TOTAL_LEVELS;i++){
            var levelsp =new cc.Sprite(res.Level_normal_png);
            var x = 39 + 43*i;
            levelsp.setPosition(cc.p(x, y));
            this.addChild(levelsp);

            this._levelArray.push(levelsp);
        }
    },
    changeLevelIndicator:function(index, type){
        var indpng = null;

        switch(type)
        {
            case GC.LEVELIND.NORMAL:
                indpng = res.Level_normal_png;
                break;

            case GC.LEVELIND.CORRECT:
                indpng = res.Level_correct_png;
                break;

            case GC.LEVELIND.WRONG:
                indpng = res.Level_wrong_png;
                break;
            default:
                break;
        }

        if(indpng != null){
            this._levelArray[index].setTexture(indpng);
        }
    }
});
