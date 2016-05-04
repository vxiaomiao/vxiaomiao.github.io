/**
 * Created by VV on 2016/4/1.
 */

var GC = GC || {};


//播放音效
GC.EFFECTFLAG = true;

GC.USERDATA = {
    CANDY_TYPE_COUNT  : 5,
    CANDY_WIDTH       : 64,
    MAP_SIZE          : 10,
    FALL_ACCELERATION : 30
};

GC.VV = 1;

GC.LEVELSDATA = [
    {limitStep:30, targetScore:200,bg:res.png_bg1},
    {limitStep:25, targetScore:1000,bg:res.png_bg2},
    {limitStep:20, targetScore:1800,bg:res.png_bg3},
    {limitStep:20, targetScore:2500,bg:res.png_bg4},
    {limitStep:15, targetScore:3000,bg:res.png_bg5},
    {limitStep:10, targetScore:3500,bg:res.png_bg6}
];

GC.LEVELSDATA2 = [
    {limitStep:25, targetScore:300,bg:res.png_b1},
    {limitStep:20, targetScore:800,bg:res.png_b2},
    {limitStep:20, targetScore:1500,bg:res.png_b3},
    {limitStep:15, targetScore:2000,bg:res.png_b4},
    {limitStep:15, targetScore:3000,bg:res.png_b5},
    {limitStep:10, targetScore:4000,bg:res.png_b6}
];

GC.LEVELSDATA3 = [
    {limitStep:20, targetScore:350,bg:res.png_bb1},
    {limitStep:18, targetScore:800,bg:res.png_bb2},
    {limitStep:18, targetScore:1000,bg:res.png_bb3},
    {limitStep:15, targetScore:2000,bg:res.png_bb4},
    {limitStep:15, targetScore:3000,bg:res.png_bb5},
    {limitStep:10, targetScore:4000,bg:res.png_bb6}
];