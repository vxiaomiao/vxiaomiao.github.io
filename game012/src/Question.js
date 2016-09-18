/**
 * Created by caojie on 16/3/2.
 */

var Question = cc.Class.extend({
    _options:null,
    _answer:null,
    _question:null,
    _reqd:null,
    _result:0,

    ctor:function(question,opts,answer,reqd){
        this._question=question;
        this._options=opts;
        this._answer=answer;
        this._reqd=reqd;
    },
    getQuestion:function(){
        return this._question;
    },
    setQuestion:function(que){
        this._question=que;
    },

    //options getter/setter
    getOptions : function(){
        return this._options;
    },
    setOptions : function(opts){
        this._options = opts;
    },
    //answer getter/setter
    getAnswer : function(){
        return this._answer;
    },
    setAnswer : function(ans){
        this._answer = ans;
    },
    getResult : function () {
        return this._result;
    },
    setResult : function(ret){
        this._result = ret;
    },
    getReqd : function () {
        return this._reqd;
    },
    setReqd : function(ret){
        this._reqd = ret;
    }
});