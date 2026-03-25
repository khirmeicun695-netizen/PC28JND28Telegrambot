var mysql = require('mysql');

module.exports = {
    pool: mysql.createPool({
        port:3306, //mysql端口
        user     : '', //mysql用户名
        password : '', //mysql密码
        database : '', //mysql数据库
        multipleStatements: true //不要改这个
    }),
    token: '', //机器人的token
    chatid :  0, //开奖群的id
    sxfqunid:  0, //上下分群的id
    houtaiqunid:  0, 
    inline_keyboard : [ //内联键盘
        [{ text: '👤账户信息', callback_data: '6'},{ text: '💳当前流水', callback_data: '8'}],

    ], 
    sxfinline_keyboard : [ //内联键盘N7ZXzeEcuFcwNDA1
        [{ text: '💸上分', url: ''},{ text: '💰下分', url: ''}],
    ],
    sf1inline_keyboard : [ //内联键盘
        [{ text: '🎮开始游戏', url: ''},{ text: '💬娱乐客服', url: ''}]
    ],
    inviteinline_keyboard : [ //内联键盘
        [{ text: '🎮开始娱乐', url: ''}],
    ],
    sfinline_keyboard : [ //内联键盘
        [{ text: '🎰开奖群', url: ''},{ text: '🤖机器人', url: ''}],
    ],
    crjinline_keyboard : [ //内联键盘
        [{ text: '💸入金', url: ''},{ text: '💰出金', url: ''}],
    ],
    xiazhukeyboard:[
        [{ text: '👤账户信息', callback_data: '6'},{ text: '💳当前流水', callback_data: '8'}],
    ],
    sfcgkeyboard:[
        [{ text: '💸上下分群', url: ''}],
    ],
    startkeyboard:[
        [{ text: '🎮开始娱乐' }, { text: '💸上下分群' }],
        [{ text: '❓娱乐规则' },{ text: '👤个人中心' }]
    ],
    startinlinekeyboard:[
        [{text:'🎮开始游戏',url: ''}, { text: '💸上下分群', url: ''}]
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
    czaddress:"", //人工上分的充值地址
    trxPrivateKey:"",
    port:5898,//运行端口
    czMin : 30.00, //单笔最小充值
    txMin : 10.00, //单笔最小提现
    txfee : 0,
    adminid : [], //下分管理员id
    youxigrouplink:"",
    isnoticegroup:true,
    botusername:"",
    utormb:7
}
