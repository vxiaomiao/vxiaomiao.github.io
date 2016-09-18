/**
 * Created by caojie on 16/4/13.
 */

var baseSprite=cc.Sprite.extend({
    _touchnum:0,
    _spType:null,
    _isMove:null,
    _isRotation:null,

    ctor:function(initFile,type,num){
        this._super();

        this.initWithFile(initFile);
        this._spType=type;
        this._touchnum=num;
        this._isMove=true;
        this._isRotation=true;
        return true;
    },
    setnumber:function(num){

        //如果徒刑是圆形或者是正方形，跳过;
        if(this._spType=="GC.SPTYPE.circle"||this._spType=="GC.SPTYPE.square"){
            return;
        }
        if(this._spType=="GC.SPTYPE.rectangle" || this._spType=="GC.SPTYPE.big_rectangle"){
            num=num%2;
            this._touchnum=num;
            return;
        }
        num=num%4;
        this._touchnum=num;
    },
    getnumber:function(){
        return this._touchnum;
    },
    setType:function(type){
        this._spType=type;
    },
    getType:function(){
        return this._spType;
    },
    setMove:function(type){
        this._isMove=type;
    },
    getMove:function(){
        return this._isMove;
    },
    setIsRotation:function(type){
        this._isRotation=type;
    },
    getIsRotation:function(){
        return this._isRotation;
    },

})