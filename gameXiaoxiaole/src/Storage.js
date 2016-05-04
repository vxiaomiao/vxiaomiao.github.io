/**
 * Created by VV on 2016/4/1.
 */

var Storage = {

    getCurrentLevel : function(){
        var level = cc.sys.localStorage.getItem("level") || 0;
        return parseInt(level);
    },

    setCurrentLevel : function(level){
        cc.sys.localStorage.setItem("level", level);
        return true;
    },

    getCurrentScore : function(){
        var score = cc.sys.localStorage.getItem("score") || 0;
        return parseInt(score);
    },

    setCurrentScore : function(score){
        cc.sys.localStorage.setItem("score", score);
        return true;
    },



    getCurrentLevel2 : function(){
        var level = cc.sys.localStorage.getItem("level2") || 0;
        return parseInt(level);
    },

    setCurrentLevel2 : function(level){
        cc.sys.localStorage.setItem("level2", level);
        return true;
    },

    getCurrentScore2 : function(){
        var score = cc.sys.localStorage.getItem("score2") || 0;
        return parseInt(score);
    },

    setCurrentScore2 : function(score){
        cc.sys.localStorage.setItem("score2", score);
        return true;
    },


    getCurrentLevel3 : function(){
        var level = cc.sys.localStorage.getItem("level3") || 0;
        return parseInt(level);
    },

    setCurrentLevel3 : function(level){
        cc.sys.localStorage.setItem("level3", level);
        return true;
    },

    getCurrentScore3 : function(){
        var score = cc.sys.localStorage.getItem("score3") || 0;
        return parseInt(score);
    },

    setCurrentScore3 : function(score){
        cc.sys.localStorage.setItem("score3", score);
        return true;
    }


};











