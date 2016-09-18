/**
 * Created by jinling on 16/5/13.
 */

var GMSG = GMSG || {};

GMSG.HelpFlag = {
    FRAME:0,
    GAME:1
};

//设定当前的帮助类型
GMSG.HelpAction = GMSG.HelpFlag.GAME;

/**
 * 调用框架提交数据
 */
GMSG.postGameData = function(data){
    try{
        if(window.grwl) {
            window.grwl.startFunction(data);
        }else if(window.parent.grwl){
            window.parent.grwl.startFunction(data);
        }else{
            cc.log("no grwl object!");
        }
    }catch(e){
        cc.log(e.name + ":" + e.message);
    }

}

/**
 * 退出游戏
 */
GMSG.exitGame = function(){
    try{
        if(window.grwl) {
            window.grwl.endFunction();
        }else if(window.parent.grwl) {
            window.parent.grwl.endFunction();
        }else{
            cc.log("no grwl object!");
        }
    }catch(e){
        cc.log(e.name + ":" + e.message);
    }
}

/**
 *   调用java接口来播放帮助视频
 */
GMSG.playHelpVideo = function(){
    var sceneLayer = (arguments[0] && arguments[0] instanceof gameLayer)?arguments[0]:undefined;

    if(sceneLayer){ //使用图文帮助
        cc.log("--->will use help layer");
        try{
            var helpL = new helpLayer();
            //helpL.setDelegate(sceneLayer);
            sceneLayer.addChild(helpL, 999);
        }catch(e){
            cc.log(e.name + ":" + e.message);
        }

    }else{  //使用框架帮助方法
        cc.log("--->will call frame help video");
        try{
            if(window.grwl) {
                window.grwl.playHelpVideo();
            }else if(window.parent.grwl){
                window.parent.grwl.playHelpVideo();
            }else{
                cc.log("no grwl object!");
            }
        }catch(e){
            cc.log(e.name + ":" + e.message);
        }
    }

}