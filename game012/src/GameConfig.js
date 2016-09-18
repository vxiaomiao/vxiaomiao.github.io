/**
 * Created by caojie on 16/3/2.
 */

var GC=GC ||{};

//总关卡数;
GC.TOTAL_LEVELS=6;

GC.LEVELSRIGHT=[];

//暂停开关;
GC.ISPAUSE=true;

//关卡标识状态;
GC.LEVELIND={
    NORMAL:0,
    CORRECT:1,
    WRONG:2
};

GC.SPTYPE={
    smallf_labellate:0,     //小的扇形;
    big_labellate:1,        //大的扇形;
    circle:2,               //圆形;
    smallf_hemicycle:3,     //小的半圆;
    big_hemicycle:4,        //大的半圆;
    square:5,               //正方形;
    keystone:6,             //梯形;
    smallf_fan:7,           //小的四分之一扇形;
    big_fan:8,              //大的四分之一扇形;
    zhong_hemicycle:9,      //中等大小的半圆;
    triangle:10,             //三角形;
    rectangle:11,           //矩形;
    big_rectangle:12        //大矩形;
};



//音效开关;
GC.EFFECTFLAG=true;

//资源总组数
GC.ARRAYNUMS = 8;

//关卡对象数组;
GC.LEVELS=[];

GC.RandomArray=function(){
    var array=[];
    for(var i=0;i<GC.ARRAYNUMS;i++){
        array[i]=i;
    }

    for(var i=0;i<GC.ARRAYNUMS;i++){
        var rand=parseInt(GC.ARRAYNUMS * Math.random());
        var temp = array[i];
        array[i] = array[rand];
        array[rand] = temp;
    }
    return array;
}

GC.RandomOptions = function(array){
    var arrLen = array.length;
    for (var i = 0; i < arrLen; i++) {
        var rand = parseInt(arrLen * Math.random());
        var temp=array[i].getPosition();
        array[i].setPosition(array[rand].getPosition());
        array[rand].setPosition(temp);


       /*
        var temp = array[i];
        array[i] = array[rand];
        array[rand] = temp;
        */
    }
        return array;
}
    //通过路径、前缀、数量、key值创建一个动画数组;
GC.prepareAnimation = function (plistFile, prefixFrame, frameCnt, startIdx) {
        cc.spriteFrameCache.addSpriteFrames(plistFile);
        var animation = new cc.Animation();
        for(var i=0;i<frameCnt;i++){
            var frameName = prefixFrame + (startIdx + i);
            //返回一个精灵帧;
            var spFrame = cc.spriteFrameCache.getSpriteFrame(frameName);
            animation.addSpriteFrame(spFrame);
        }
        //总时间，以秒为单位;
        animation.setDelayPerUnit(1/24);
        //设置是否在动画结束时恢复至初始帧;
        animation.setRestoreOriginalFrame(false);
        return  cc.animate(animation);
}
