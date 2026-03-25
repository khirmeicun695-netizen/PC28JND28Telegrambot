var mysql = require('mysql');

module.exports = {
    pool: mysql.createPool({
        port:3306, //mysql端口
        user     : 'your_username', //mysql用户名
        password : 'your_password', //mysql密码
        database : 'your_database', //mysql数据库
        multipleStatements: true //不要改这个
    }),
    token: 'your_bot_token', //机器人的token
    chatid :  -1234567890, //开奖群的id
    sxfqunid:  -1234567890, //上下分群的id
    houtaiqunid:  -1234567890, 
    inline_keyboard : [ //内联键盘
        [{ text: '👤账户信息', callback_data: '6'},{ text: '💳当前流水', callback_data: '8'}],

    ], 
    sxfinline_keyboard : [ //内联键盘N7ZXzeEcuFcwNDA1
        [{ text: '💸上分', url: 'your_group_link'},{ text: '💰下分', url: 'your_group_link'}],
    ],
    sf1inline_keyboard : [ //内联键盘
        [{ text: '🎮开始游戏', url: 'your_group_link'},{ text: '💬娱乐客服', url: 'your_support_link'}]
    ],
    inviteinline_keyboard : [ //内联键盘
        [{ text: '🎮开始娱乐', url: 'your_group_link'}],
    ],
    sfinline_keyboard : [ //内联键盘
        [{ text: '🎰开奖群', url: 'your_group_link'},{ text: '🤖机器人', url: 'your_bot_link'}],
    ],
    crjinline_keyboard : [ //内联键盘
        [{ text: '💸入金', url: 'your_group_link'},{ text: '💰出金', url: 'your_group_link'}],
    ],
    xiazhukeyboard:[
        [{ text: '👤账户信息', callback_data: '6'},{ text: '💳当前流水', callback_data: '8'}],
    ],
    sfcgkeyboard:[
        [{ text: '💸上下分群', url: 'your_group_link'}],
    ],
    startkeyboard:[
        [{ text: '🎮开始娱乐' }, { text: '💸上下分群' }],
        [{ text: '❓娱乐规则' },{ text: '👤个人中心' }]
    ],
    startinlinekeyboard:[
        [{text:'🎮开始游戏',url: 'your_group_link'}, { text: '💸上下分群', url: 'your_group_link'}]
    ],

    betMin : 10.00, //单笔最小下注
    betMax: 100000.00, //单笔最大下注
    returnWater: 0.001, //反水比例，默认1.5%
    yongjin:0.01,//fuyingli
    coin: "元", //货币单位
    peilv:{ //赔率设置
        dxds:2.8, //大小单双
        fushi1:6, //大单小双
        fushi2:6, //小单大双
        baozi:60, //豹子
        duizi:3, //对子
        shunzi:12, //顺子
        s0d:500, //押0点
        s1d:120, //押1点
        s2d:98, //押2点
        s3d:58, //押3点
        s4d:48, //押4点
        s5d:32, //押5点
        s6d:25, //押6点
        s7d:20, //押7点
        s8d:17, //押8点
        s9d:15, //押9点
        s10d:14, //押10点
        s11d:13, //押11点
        s12d:11, //押12点
        s13d:10, //押13点
        s14d:10, //押14点
        s15d:11, //押15点
        s16d:13, //押16点
        s17d:14, //押17点
        s18d:15, //押18点
        s19d:17, //押19点
        s20d:20, //押20点
        s21d:25, //押21点
        s22d:32, //押22点
        s23d:48, //押23点
        s24d:58, //押24点
        s25d:98, //押25点
        s26d:120, //押26点
        s27d:500, //押27点
        jdjx:12, //极大极小
    },
    xianzhu:{
        dianshabaozi:1000,
        dxds:20000,
        zuhe:5000,
        shunzi:5000,
        duizi:10000,
        shuzi:1000,
        baozi:1000,
        jizhi:5000,
        zongzhu: 20000,
        dqzongzhu: 20000
    },
    sendmode:"pt", //发送提醒消息的模式 pt:图片+文字 t:文字
    isfptx:true, //是否开启即将封盘提醒 false:关闭 true:开启
    istishishu:true, //是否在开奖结果展示输的用户投注 false:不展示 true:展示
    ishistorypicture:true, //是否开奖历史以图片的形式发送 false:否 true:是
    issendsxf:true, //是否发送上下分成功的提示 false:否 true:是
    czaddress:"your_trx_address", //人工上分的充值地址
    trxPrivateKey:"your_trx_private_key",
    port:5898,//运行端口
    czMin : 30.00, //单笔最小充值
    txMin : 10.00, //单笔最小提现
    txfee : 0,
    adminid : [000000000], //下分管理员id
    youxigrouplink:"your_group_link",
    isnoticegroup:true,
    botusername:"your_bot_username",
    utormb:7
}

/*玩法
一、单式：
（赔率2倍）
（押注口令：玩法+金额）
例：单100
小 : 总点数为 4 至 10  
大 : 总点数为 11 至 17  
单 : 总点数为 5, 7, 9, 11, 13, 15, 17  
双 : 总点数为 4, 6, 8, 10, 12, 14, 16 
 （豹子不计入，押注限制封顶5000u）

二、复式  ：
（押注口令：玩法+金额）
例：大单100
大单：11, 13, 15, 17 点（赔率3.4倍） 
小双：4, 6, 8, 10 点 （赔率3.4倍） 
大双：12, 14, 16 点（赔率4.4倍） 
小单：5, 7, 9 点 （赔率4.4倍）  
（豹子不计入，押注限制封顶5000u）


三、特殊玩法： 
豹子下注：豹子100 （赔率25倍）  
（押注限制封顶600U）
对子下注：对子100 （赔率2倍）
（押注限制封顶5000u）
顺子下注：顺子100 （赔率6倍）
（押注限制封顶1000U）
 
四、点杀玩法： 
三颗骰子之和，即为点杀数 
（押注口令:点数+杀+金额）
            例：15杀100
4、17点（赔率50倍） 
5、16点（赔率25倍） 
6、15点（赔率12倍） 
7、14点（赔率12倍） 
8、13点（赔率8倍） 
9、10点（赔率6倍）
11、12点（赔率6倍）
（押注限制封顶10-500U）

五、点杀豹子玩法：
 （押注口令：点数+豹子+金额）
     例：1豹子100、2豹子100
各点数均为:1/2/3/4/5/6    （赔率125倍）
（押注限制封顶10-100U）
--------------------------------------
【特别提醒】：
1、出豹子庄家通杀（除押对豹子玩法和押对杀点数玩法其他通杀）*/