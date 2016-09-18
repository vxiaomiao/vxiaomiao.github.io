/**
 * Created by Jinling on 16/2/26.
 */

/*字段名	类型	说明	是否可以为空
classNo	string	班级id	否
kindergarten	string	幼儿园id	否
username	string	用户名称	否
gameNo	string	游戏编号	否
barrier	string	关卡编号	否
correctElements	number	关卡正确要素数量	否
totalElements	number	关卡要素总数	否
productionName	string	产生式名称	否
subject	string	学科	否
revoke	number	撤销次数	是
time	number	时长（毫秒）	否
result	number	结果（0表示错误，1表示正确）	否
prompt	number	查看提示次数	是
correct	number	产生式正确要素数量	否
total	number	产生式要素总数	否 */

/*
 SK20150615095450285q2QtF5 思维
 SK20150618170152802NVBFDo 科学
 SK2015110310154266B05W6g 音乐
 SK20151103101611478HnE275 英语
 SK2015110310162007Sod1bH 人格
*/

var GameInfo = cc.Class.extend({
    ctor:function(barrier){
        this._barrier = barrier;
        this.resetData();
    },
    resetData:function(){
        this._time = 0;             //时间;
        this._result = 0;           //成绩;
        this._prompt = 0;           //提示次数;
        this._revoke = 0;
        this._correct = 0;
        this._total = 1;
        this._restart = 0;          //重玩次数;
    },
    getBarrier : function(){
        return this._barrier;
    },
    setBarrier : function(val){
        if(this._barrier != val) {
            this._barrier = val;
            this.resetData();
        }
    },
    getTime : function(){
        return this._time;
    },
    setTime : function(val){
        this._time = val;
    },
    getResult : function(){
        return this._result;
    },
    setResult : function(val){
        this._result = val;
    },
    getPrompt : function(){
        return this._prompt;
    },
    setPrompt : function(val){
        this._prompt = val;
    },
    getRevoke : function(){
        return this._revoke;
    },
    setRevoke : function(val){
        this._revoke = val;
    },
    getCorrect : function(){
        return this._correct;
    },
    setCorrect : function(val){
        this._correct = val;
    },
    getTotal : function(){
        return this._total;
    },
    setTotal : function(val){
        this._total = val;
    },
    getRestart : function(){
        return this._restart;
    },
    setRestart : function(val){
        this._restart = val;
    }
});


var GP = GP || {};

//=========修改部分=========
GP.SUBJECT="思维";
GP.SUBJECTCODE = "SK20150615095450285q2QtF5";
GP.GAMENO = "012";
GP.GAMENAME = "平面图形拼图2";

GP.PRODUCTIONS = [
    "平面图形拼图2"
];

//关卡正确元素数量
GP.correctElements = 1;
//关卡元素总数
GP.totalElements = 6;
//=========修改部分=========


GP.postUserData = function(barrier, result, time, restart, prompt, correct, total){
    time=time<1000?1000:time;
    var jsonStr = GP.genJSONString(barrier, result, time, restart, prompt, correct, total);
    cc.log(jsonStr);
    GMSG.postGameData(jsonStr);

    /*
    if(window.grwl) {
        window.grwl.startFunction(jsonStr);
    }else{
        cc.log("no grwl object!");
    }
    */
    /*var xhr = cc.loader.getXMLHttpRequest();
    xhr.open("POST", GP.POSTURL);
    xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
            var httpStatus = xhr.statusText;
            var response = xhr.responseText.substring(0, 100) + "...";
            cc.log(response);
        }
    };
    xhr.send(jsonStr);*/
};


GP.genJSONString = function(barrier, result, time, restart, prompt, correct, total){
    var ret = new Object();

    ret.restartNum = 0;
    //第多少个游戏编号;
    ret.game_no = GP.GAMENO;
    ret.barrier = barrier.toString();
    //关卡正确元素数量 3;
    ret.correctElements = GP.correctElements;
    //totalElements 15;
    ret.totalElements = GP.totalElements;
    ret.restartNum = restart;
    var pArr = [];
    for(var i=0;i<GP.PRODUCTIONS.length;i++){
        var p = new Object();
        p.productionNo = (i+1).toString();
        p.productionName = GP.PRODUCTIONS[i];
        p.subject = GP.SUBJECTCODE;
        p.revoke = 0;
        p.result = result;
        p.time = (i==0)?time:0;
        p.prompt = prompt;
        p.correct = (arguments[5])?correct:0;
        p.total = (arguments[6])?total:1;

        pArr.push(p);
    }

    ret.productions = pArr;

    return JSON.stringify(ret);
};
