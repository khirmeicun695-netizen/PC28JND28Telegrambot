var express = require('express');
var mysql = require('mysql');
var request = require('request');
var request1 = require('request-promise');
const cheerio = require('cheerio');
const querystring = require('querystring');
var conf = require('./config/conf');
var common = require('./config/common');
var TelegramBot = require('node-telegram-bot-api');
var cors = require('cors');
var fs = require('fs');
var moment = require('moment');
var TronWeb = require('tronweb')
const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { "TRON-PRO-API-KEY": "8d230cce-9474-459f-b6bd-71e97d9465d2" }
  });

var login = require('./api/login');
var chart = require('./api/chart');
var table = require('./api/table');
var result = require('./api/result');

const route = express.Router();
var app = express();
app.use(cors())

// 配置静态文件服务 - 为管理后台提供静态文件访问
app.use('/admin', express.static('./admin'));

// 为根路径的 config.js 请求提供支持
app.get('/config.js', (req, res) => {
    res.sendFile(__dirname + '/admin/config.js');
});

app.use(login);
app.use(chart);
app.use(table);
app.use(result);

var tzxz = "./img/tzxz.jpg"
var ksxz = "./img/ksxz.jpg"
var cankaijiang = true
var iskey,iszaliu,a, b, c,ssss,daxiao,danshuang,baozi,shunzi,duizi,jdjx,value,date,minutes,isfengpantixing = false,isfengpan = false,iskaijiang = false,resultArray = [],resultid,
resultCount = [
    {value :0},
    {value :0},
    {value :0},
    {value :0},
    {value :0},
    {value :0}
],
resultdxds = {
    big:0,
    small:0,
    odd:0,
    even:0,
    baozi:0,
    shunzi:0,
    duizi:0
}
var isfp7 = false
var isweihu = false
console.log("=== 程序启动信息 ===");
console.log("启动时间:", new Date().toLocaleString());
console.log("Node.js 版本:", process.version);
console.log("操作系统:", process.platform);
console.log("监听端口:", conf.port);
console.log("数据库配置:", `${conf.pool.config.user}@${conf.pool.config.host}:${conf.pool.config.port}/${conf.pool.config.database}`);

// 测试数据库连接
conf.pool.getConnection(function(err, connection) {
    if (err) {
        console.log("❌ 数据库连接失败:", err.message);
    } else {
        console.log("✅ 数据库连接成功");
        connection.destroy();
    }
});

console.log("===================");

var server = app.listen(conf.port, function () {
    console.log("=== 服务器启动成功 ===");
    console.log("服务器正在监听端口:", conf.port);
    console.log("启动完成时间:", new Date().toLocaleString());
    console.log("======================");
    console.log("=== 定时器启动成功 ===");
    console.log("开始执行开奖检测定时器...");
    
    setInterval(function() {
        console.log("=== 定时器执行 ===", new Date().toLocaleString());
        getfengpan()
        date = new Date();
        if (date.getHours()==23 && date.getMinutes()==55 && date.getSeconds()==0) {// 
            fafanshui()
        }
        if (date.getHours()==19 && date.getMinutes()==0 && date.getSeconds()==0) {// 
            fengpanneirong = `📣📣尊敬的各位老板：
加拿大PC28官方停盘休息，请耐心等待加拿大PC28官方开奖，请各位老板稍作休息，等待开盘！
加拿大官方封盘时间为：
            
⏱周一 封盘时间：19:00 - 21:10左右
⏱周二至周日封盘时间：19:00 - 20:10左右
            
❤️‍🔥停盘维护期间，可继续交流和上分❤️‍🔥`
                                    bot.sendMessage(conf.sxfqunid,fengpanneirong,{
                                        parse_mode:"HTML",
                                        disable_web_page_preview:true,
                                        reply_markup:{
                                            inline_keyboard:conf.xiazhukeyboard
                                        }
                                    })
                                    bot.sendMessage(conf.chatid,fengpanneirong,{
                                        parse_mode:"HTML",
                                        disable_web_page_preview:true,
                                        reply_markup:{
                                            inline_keyboard:conf.xiazhukeyboard
                                        }
                                    })
        }
        conf.pool.getConnection(function(err, connection) {
            if (err) return err;
            connection.query(`SELECT * FROM result  order by result_time desc limit 1;`,(error, result)=> {
                if (error) return error;
                connection.destroy();
                console.log("正在获取开奖数据...");
                request({
                    url:`http://www.xzhiway.com/`,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                        'Connection': 'keep-alive'
                    }
                }, function (error, response, body) {
                        if(error || response.statusCode!=200){
                            console.log("❌ 获取开奖数据失败:", error)
                            return;
                        }else{
                            console.log("✅ 开奖数据获取成功");
                            let newdata;
                            try {
                                const $ = cheerio.load(body);
                                newdata = parseInt($('#period').text());
                                console.log("📊 解析到的期号:", newdata);
                                if (!newdata) {
                                    console.log("❌ 期号为空，跳过");
                                    return;
                                }
                                if (isNaN(Number(newdata,10))) {
                                    console.log("❌ 期号不是数字，跳过");
                                    return;
                                }
                                a = parseInt($('#num1').text());
                                b = parseInt($('#num2').text());
                                c = parseInt($('#num3').text());
                                value = a+b+c;
                                console.log("🎯 开奖数字:", a, b, c, "总和:", value);
                                if (isNaN(a) || isNaN(b) || isNaN(c)) {
                                    console.log("❌ 号码为空，跳过");
                                    return;
                                }
                            } catch (e) {
                                console.log("❌ 解析HTML数据失败:", e);
                                return;
                            }
                            if (result[0]) {
                                resultid = parseInt(newdata)
                                console.log("🔍 数据库最新期号:", result[0].id, "API期号:", resultid);
                                conf.pool.getConnection(function(err, connection) {
                                    if (err) return err;
                                    connection.query(`SELECT * FROM fengpan where resultid = "${resultid+1}";`,(error, fengpanresult)=> {
                                        connection.destroy();
                                        console.log("📅 封盘信息查询结果:", fengpanresult ? fengpanresult.length : 0, "条记录");
                                        if (!fengpanresult[0]) {
                                            if (!isweihu) {
                                                isweihu = true;
                                                conf.pool.getConnection(function(err, connection) {
                                                    if (err) return err
                                                    connection.query(`SELECT * FROM bet where resultid = "${resultid}" and result is null order by telegramid desc;`,(error, result)=> {
                                                        if (error) return error;
                                                        connection.destroy();
                                                        resultArray = result;
                                                        if (result[0]) {
                                                            setResult();
                                                        }
                                                    });
                                                });
                                            }
                                            return
                                        }
                                        console.log("⚙️ 开奖状态检查 - 数据库期号:", result[0].id, "API期号:", resultid, "cankaijiang:", cankaijiang);
                                        if (parseInt(result[0].id)<parseInt(resultid) && cankaijiang) {
                                            console.log("🎊 触发开奖条件！数据库期号:", result[0].id, "< API期号:", resultid);
                                            console.log("🎯 开始执行开奖流程...");
                                            iskaijiang = true;
                                            cankaijiang = false
                                            conf.pool.getConnection(function(err, connection) {
                                                if (err) return err
                                                connection.query(`SELECT * FROM bet where resultid = "${resultid}" and result is null order by telegramid desc;`,(error, result)=> {
                                                    if (error) return error;
                                                    connection.destroy();
                                                    resultArray = result;
                                                    console.log("💰 本期投注记录:", result.length, "条");
                                                    setResult();
                                                });
                                            });
                                            setTimeout(function () {
                                                cankaijiang = true
                                            },60000)
                                        }else if(parseInt(fengpanresult[0].closeTime)<parseInt(Math.round(new Date())+20000) && isfengpantixing==false){
                                            isfengpantixing = true;
                                            fengpantixing();
                                        }else if(parseInt(fengpanresult[0].closeTime)<parseInt(Math.round(new Date())-5000) && isfengpan==false){
                                            isfengpan = true;
                                            setTimeout(function () {
                                                getAllbet();
                                            },3000)
                                        }
                                        resultid = parseInt(newdata)	
                                        
                                    })
                                })
                                
                            }else{
                                conf.pool.getConnection(function(err, connection) {
                                    if (err) return err
                                    connection.query(`SELECT * FROM bet where resultid = "${resultid}" order by telegramid desc;`,(error, result)=> {
                                        if (error) return error;
                                        connection.destroy();
                                        resultArray = result;
                                        setResult();
                                    });
                                });
                            }

                            
                        }
                    });
                
            });
        });
    },1000)
})

function fafanshui() {
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM users where fanshui > 0;update users set fanshui = 0;`,(error, result)=> {
            connection.destroy();
            var fanshuisql = ""
            var fanshuimessage = ""
            var fanshuiamount = ""
            var todayfanshui = 0;
            for (let index = 0; index < result[0].length; index++) {
                // if (result[0][index].fanshui>80000) {
                //     fanshuiamount=0.012
                // }else if (result[0][index].fanshui>70000) {
                //     fanshuiamount=0.01
                // }else if (result[0][index].fanshui>60000) {
                //     fanshuiamount=0.009
                // }else if (result[0][index].fanshui>50000) {
                //     fanshuiamount=0.008
                // }else if (result[0][index].fanshui>40000) {
                //     fanshuiamount=0.007
                // }else if (result[0][index].fanshui>30000) {
                //     fanshuiamount=0.006
                // }else if (result[0][index].fanshui>20000) {
                //     fanshuiamount=0.005
                // }else if (result[0][index].fanshui>10000) {
                //     fanshuiamount=0.004
                // }else if (result[0][index].fanshui>5000) {
                //     fanshuiamount=0.003
                // }else if (result[0][index].fanshui>2000) {
                //     fanshuiamount=0.002
                // }else{
                //     fanshuiamount=0.001
                // }
                fanshuiamount=0.003
                fanshuisql+=`update users set balance = balance + ${fanshuiamount*result[0][index].fanshui},zwfanshui = ${fanshuiamount*result[0][index].fanshui} where telegramid = "${result[0][index].telegramid}";`
                fanshuimessage += `〖${result[0][index].nickname}〗返现 <code>${(fanshuiamount*result[0][index].fanshui).toFixed(2)}</code>元（流水${result[0][index].fanshui}×${fanshuiamount*100}%）\n`
                todayfanshui+=fanshuiamount*result[0][index].fanshui;
            }
            conf.pool.getConnection(function(err, connection) {
                if (err) return err;
                connection.query(fanshuisql,(error, result)=> {
                    connection.destroy();
                    if (error) return error;
                    bot.sendMessage(conf.chatid,`📣今日返现 <code>${todayfanshui.toFixed(2)}</code>元`,{
                        parse_mode:"HTML"
                    })
                    .then(res=>{
                        bot.pinChatMessage(res.chat.id,res.message_id)
                        bot.sendMessage(conf.chatid,`${fanshuimessage}`,{
                            parse_mode:"HTML",
                            disable_web_page_preview:true
                        })
                    })
                })
            })
            
        })
    })
}
// function getfengpan() {
//     request({
// 		url:`http://pcapi.bm888.vip/fengpan`,
// 		method:"get",
// 	}, function (error, response, body) {
// 		if (error) {
// 			return
// 		}
// 		try {
// 			var allinfo = JSON.parse(body).message.all.keno28.data[0]
// 			conf.pool.getConnection(function(err, connection) {
// 				if (err) return err;
// 				connection.query(`SELECT * FROM fengpan where resultid = "${allinfo.term}"`,(error, result)=> {
// 					if (!result[0]) {
// 						connection.query(`Insert into fengpan (resultid,closeTime,openTime,time) values ("${allinfo.term}","${allinfo.closeTime}","${allinfo.openTime}",now());`,(error, result)=> {
// 							connection.destroy();
// 							if (error) return error;
// 						});
// 					}else{
// 						connection.destroy();
// 					}
                    
// 				})
// 			})
// 		} catch (error) {
// 			return
// 		}
        
// 	});
// }

function qunfa(msg) {
    
    conf.pool.getConnection(function(err, connection) {
    if (err) {
      console.error('连接数据库时出错:', err);
      return;
    }

    connection.query('SELECT * FROM users', (error, result) => {
      if (error) {
        console.error('查询数据库时出错:', error);
        connection.release(); // 释放数据库连接回连接池
        return;
      }

      console.log('成功获取用户数据:', result);

      const messagesToSend = result.map((row) => {
        const chatId = row.telegramid;
        const messageText = msg.text.split('/send')[1];
        return bot.sendMessage(chatId, messageText, {
          parse_mode: 'HTML',
          disable_web_page_preview: true
        });
      });

      Promise.all(messagesToSend)
        .then((results) => {
          const successfulMessages = results.filter((result) => result.message_id);
          const failedMessages = results.filter((result) => !result.message_id);

          console.log('成功发送消息的数量:', successfulMessages.length);
          console.log('发送失败的消息数量:', failedMessages.length);
          const messagesToSend = result.map((row) => {
             
         });
        
          bot.sendMessage(msg.chat.id, `管理员操作群发\n\n成功发送消息的数量: ${successfulMessages.length}\n\n发送失败的消息数量: ${failedMessages.length}`, {
              parse_mode: 'HTML',
              disable_web_page_preview: true
            });
        })
        .catch((err) => {
          console.error('发送消息时出错:', err);
        })
        .finally(() => {
          connection.release(); // 释放数据库连接回连接池
        });
    });
  });
}

function getfengpan() {
    console.log("📡 正在获取封盘信息...");
    
    // 临时解决方案：基于当前期号生成封盘信息
    conf.pool.getConnection(function(err, connection) {
        if (err) {
            console.log("❌ 数据库连接失败:", err);
            return;
        }
        
        // 从xzhiway.com获取当前期号，生成下一期封盘信息
        request({
            url:`http://www.xzhiway.com/`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Connection': 'keep-alive'
            }
        }, function (error, response, body) {
            if(error || response.statusCode!=200){
                console.log("❌ 获取期号失败:", error);
                connection.destroy();
                return;
            }
            
            try {
                const $ = cheerio.load(body);
                const currentPeriod = parseInt($('#period').text());
                const nextPeriod = currentPeriod + 1;
                
                console.log("🔢 当前期号:", currentPeriod, "下一期:", nextPeriod);
                
                // 检查下一期封盘信息是否已存在
                connection.query(`SELECT * FROM fengpan where resultid = "${nextPeriod}"`,(error, result)=> {
                    if (error) {
                        console.log("❌ 查询封盘信息失败:", error);
                        connection.destroy();
                        return;
                    }
                    
                    if (!result[0]) {
                        // 生成下一期封盘信息（假设每期3分钟）
                        const now = Date.now();
                        const closeTime = now + (3 * 60 * 1000); // 3分钟后封盘
                        const openTime = closeTime + 30000; // 封盘30秒后开奖
                        
                        connection.query(`Insert into fengpan (resultid,closeTime,openTime,time) values ("${nextPeriod}","${closeTime}","${openTime}",now());`,(error, insertResult)=> {
                            connection.destroy();
                            if (error) {
                                console.log("❌ 插入封盘信息失败:", error);
                                return;
                            }
                            console.log("✅ 成功生成", nextPeriod, "期封盘信息");
                        });
                    } else {
                        connection.destroy();
                        console.log("📋 期号", nextPeriod, "封盘信息已存在");
                    }
                });
            } catch (parseError) {
                console.log("❌ 解析期号失败:", parseError);
                connection.destroy();
            }
        });
    });
}

console.log("=== Bot 初始化开始 ===");
console.log("时间:", new Date().toLocaleString());
console.log("Bot Token:", conf.token.substring(0, 10) + "...");
console.log("轮询模式: 启用");

var bot = new TelegramBot(conf.token, {polling: true});

console.log("Bot 对象创建成功");
console.log("正在启动轮询...");

// 监听轮询启动成功事件
bot.on('polling_error', () => {}); // 确保错误监听器已注册

// 添加连接成功的检测
setTimeout(() => {
    bot.getMe()
        .then((botInfo) => {
            console.log("=== Bot 连接成功 ===");
            console.log("Bot 用户名:", botInfo.username);
            console.log("Bot ID:", botInfo.id);
            console.log("Bot 名称:", botInfo.first_name);
            console.log("=====================");
        })
        .catch((error) => {
            console.log("=== Bot 连接测试失败 ===");
            console.log("错误:", error.message);
            console.log("=======================");
        });
}, 2000);
// 开奖控制变量初始化
var cankaijiang = true;
var iskaijiang = false;
var isweihu = false;
var isfengpan = false;
var isfengpantixing = false;

var allkeyword = ["1","2","3","4","流水","走势","反水","返水","余额","注单","/start","/odds","/help","/invite","赠送","取消","全部取消","历史","上分","下分","汇率","大","小","单","双","豹子","对子","顺子","押","操","和","杀","草","极大","极小","d","x","s","dz","sz","bz","jx","jd","开始娱乐","个人中心","❓娱乐规则","客服","充值","地址"]

console.log("🎯 开奖控制变量初始化完成");
/*监听新的文字消息*/
bot.on('text', (msg) => { 
    if (msg.text=="大" || msg.text=="小" || msg.text=="单" || msg.text=="双" || msg.text=="豹子" || msg.text=="对子" || msg.text=="顺子" || msg.text=="押") {
        return
    }
    if(msg.text=="1" && msg.reply_to_message && msg.reply_to_message.text.search("上分")==0){
        conf.pool.getConnection(function(err, connection) {
            if (err) return err;
            connection.query(`SELECT * FROM groupadmin where telegramid = "${msg.from.id}"`,(error, result)=> {
                connection.destroy();
                if (result[0]) {
                    huifushangfenadmin(msg.reply_to_message.text,msg.reply_to_message.from.id,msg.reply_to_message.from.username,(msg.reply_to_message.from.first_name?msg.reply_to_message.from.first_name:"")+(msg.reply_to_message.from.last_name?msg.reply_to_message.from.last_name:""),msg.message_id,msg.chat.id)
                }
            })
        })
        return
    }else if(msg.text=="1" && msg.reply_to_message && msg.reply_to_message.text.search("下分")==0){
        conf.pool.getConnection(function(err, connection) {
            if (err) return err;
            connection.query(`SELECT * FROM groupadmin where telegramid = "${msg.from.id}"`,(error, result)=> {
                if (error) return error;
                connection.destroy();
                if (result[0]) {
                    console.log(msg);
                    huifuxiafenadmin(msg.reply_to_message.text,msg.reply_to_message.from.id,msg.reply_to_message.from.username,(msg.reply_to_message.from.first_name?msg.reply_to_message.from.first_name:"")+(msg.reply_to_message.from.last_name?msg.reply_to_message.from.last_name:""),msg.message_id,msg.chat.id)
                }
            })
        })
        return
    }else if(msg.text.search(`\\+`)!=-1 && msg.reply_to_message){
        conf.pool.getConnection(function(err, connection) {
            if (err) return err;
            connection.query(`SELECT * FROM groupadmin where telegramid = "${msg.from.id}"`,(error, result)=> {
                if (error) return error;
                connection.destroy();
                if (result[0]) {
                    shangfenadmin(msg.text,msg.reply_to_message.from.id,msg.reply_to_message.from.username,(msg.reply_to_message.from.first_name?msg.reply_to_message.from.first_name:"")+(msg.reply_to_message.from.last_name?msg.reply_to_message.from.last_name:""),msg.message_id,msg.chat.id)
                }
            })
        })
        
    }else if(msg.text.search(`\\-`)!=-1 && msg.reply_to_message){
        conf.pool.getConnection(function(err, connection) {
            if (err) return err;
            connection.query(`SELECT * FROM groupadmin where telegramid = "${msg.from.id}"`,(error, result)=> {
                if (error) return error;
                connection.destroy();
                if (result[0]) {
                    xiafenadmin(msg.text,msg.reply_to_message.from.id,msg.reply_to_message.from.username,(msg.reply_to_message.from.first_name?msg.reply_to_message.from.first_name:"")+(msg.reply_to_message.from.last_name?msg.reply_to_message.from.last_name:""),msg.message_id,msg.chat.id)
                }
            })
        })
        
    }else if (msg.text.search("机器人")!=-1) {
        bot.sendMessage(msg.chat.id, `<a href="http://t.me/${msg.from.username}">您</a>好 <a href="${conf.botusername}">我</a>时刻在您身边`,{
            parse_mode:"HTML",
            disable_web_page_preview:true,
            reply_to_message_id: msg.message_id
        })
    }else if (msg.text.search("杀人")!=-1 || msg.text.search("杀猪")!=-1) {
        bot.sendMessage(msg.chat.id, `创智娱乐的系统基于加拿大28官方开奖数据 因此结果无法被人为操纵 如果您对开奖结果的准确性有疑虑，可以通过<a href="https://www.google.com/ncr">谷歌</a>或<a href="https://www.baidu.com/">百度</a>等搜索引擎查询“加拿大28开奖”🌐加拿大PC28:【<a href="http://fcpc28.xyz/">官方网址</a>】
加拿大28开奖并将本群开奖结果与各大开奖网站上的开奖结果进行对比 这样可以更好地确保游戏的公正性和透明度`,{
            reply_to_message_id: msg.message_id,
            parse_mode:"HTML",
            disable_web_page_preview:true
        })
    }else if(tronWeb.isAddress(msg.text)){
        searchusdt(msg)
    }else if(msg.text.search("u")!=-1){
        usdttormb(msg)
    }else if(msg.text.search("r")!=-1){
        rmbtousdt(msg)
    }else if(msg.text=="赔率"){
        bot.sendMessage(msg.chat.id,`🤖<a href="${conf.botusername}">机器人</a> ➜ ☰菜单 ➜ ⚖️赔率`,{
            parse_mode:"HTML",
            disable_web_page_preview:true
        })
    }else if(msg.text=="汇率"){
        huilv(msg)
    }else if(msg.text=="客服"){
        bot.sendMessage(msg.chat.id,`出来接客
平台客服➜ @chuangzhikeji`,{
            reply_to_message_id: msg.message_id,
            parse_mode:"HTML",
            disable_web_page_preview:true
        })
    }

    var msgtxt = msg.text;
    iskey = false;
    for (let index = 0; index < allkeyword.length; index++) {
        if (msgtxt.search(allkeyword[index])!=-1) {
            iskey=true;
        }
    }
    if (iskey) {
        conf.pool.getConnection(function(err, connection) {
            if (err) return err;
            connection.query(`SELECT * FROM users where telegramid = "${msg.from.id}"`,(error, result)=> {
                if (error) return error;
                if (result.length==0) {
                    var inviter_telegramid = "无邀请人";
                    if (msg.text.search("/start")==0) {
                        if (msg.text.split(" ")[1]) {
                            inviter_telegramid = msg.text.split(" ")[1]
                        }
                        
                    }
                    connection.query(`Insert into users (name,nickname,telegramid,inviter_telegramid,register_time) values ("${msg.from.username}","${utf16toEntities((msg.from.first_name?msg.from.first_name:"")+(msg.from.last_name?msg.from.last_name:""))}","${msg.from.id}","${inviter_telegramid}",now());`,(error, result)=> {
                        connection.destroy();
                        if (error) return error;

                        if (msg.chat.id==conf.chatid) {
                            main(msg);
                        }else if (msg.chat.id==conf.sxfqunid){
                            sxf(msg); 
                        }else if(msg.chat.type=="private"){
                            privatemain(msg)
                        }
                        
                    });
                }else{
                    connection.destroy();
                    if (msg.chat.id==conf.chatid) {
                        main(msg);
                    }else if (msg.chat.id==conf.sxfqunid){
                        sxf(msg); 
                    }else if(msg.chat.type=="private"){
                        privatemain(msg)
                    }
                }
            })
        })
    }
    if (msg.forward_date==undefined && msg.text){
        if(msg.chat.type=="group" || msg.chat.type=="supergroup"){
            if (msg.chat.id==conf.chatid || msg.chat.id==conf.sxfqunid) {
                
            }
        }else{

        }
    }
});

/*监听错误*/
bot.on('error', (error) => { 
    console.log("=== 监听到普通错误 ===");
    console.log("时间:", new Date().toLocaleString());
    console.log("错误类型:", error.name);
    console.log("错误代码:", error.code);
    console.log("错误消息:", error.message);
    console.log("完整错误:", error);
    console.log("========================");
});

bot.on('polling_error', (error) => {
    console.log("=== 监听到轮询错误 ===");
    console.log("时间:", new Date().toLocaleString());
    console.log("错误类型:", error.name);
    console.log("错误代码:", error.code);
    console.log("错误消息:", error.message);
    if (error.response) {
        console.log("HTTP状态码:", error.response.statusCode);
        console.log("响应体:", error.response.body);
    }
    if (error.request) {
        console.log("请求信息:", error.request.method, error.request.uri?.href);
    }
    console.log("完整错误:", error);
    console.log("错误堆栈:", error.stack);
    console.log("========================");
});

bot.on('webhook_error', (error) => {
    console.log("=== 监听到webhook错误 ===");
    console.log("时间:", new Date().toLocaleString());
    console.log("错误类型:", error.name);
    console.log("错误代码:", error.code);
    console.log("错误消息:", error.message);
    console.log("完整错误:", error);
    console.log("==========================");
});


/*监听内联键盘*/
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    switch (callbackQuery.data) {
        case "6":
            getBalance(callbackQuery.from.id,callbackQuery.from.username,(callbackQuery.from.first_name?callbackQuery.from.first_name:"")+(callbackQuery.from.last_name?callbackQuery.from.last_name:""),callbackQuery.id);
            break;
        case "7":
            getMyBet(callbackQuery.from.id,callbackQuery.from.username,callbackQuery.id);
            break;
        case "8":
            getTodayBill(callbackQuery.from.id,callbackQuery.from.username,callbackQuery.id);
            break;
        case "9":
            getReturnWater(callbackQuery.from.id,callbackQuery.from.username,callbackQuery.id);
            break;
        default:
            break;
    }
});

function main(msg) {
    if(msg.text.search("上分")!=-1){
        shangfen(msg.text,msg.from.id,msg.from.username,msg.message_id,msg.chat.id,(msg.from.first_name?msg.from.first_name:"")+(msg.from.last_name?msg.from.last_name:""))
    }else if(msg.text.search("下分")!=-1){
        xiafen(msg.text,msg.from.id,msg.from.username,msg.message_id,msg.chat.id,(msg.from.first_name?msg.from.first_name:"")+(msg.from.last_name?msg.from.last_name:""))
    }else if(msg.text=="取消"){
        quanbuchehui(msg.text,msg.from.id,msg.from.username,msg.message_id)
    }else if(msg.text=="2" || msg.text=="历史" || msg.text=="走势"){
        lishitxt(msg.text,msg.from.id,msg.from.username,msg.message_id)
    }else if(msg.text.search("历史")!=-1){
        // lishi(msg.text,msg.from.id,msg.from.username,msg.message_id)
    }else if(msg.text=="1" || msg.text=="余额" || msg.text=="ye1"){
        benqitouzhutxt(msg.text,msg.from.id,msg.from.username,msg.message_id,msg.chat.id,(msg.from.first_name?msg.from.first_name:"未设置用户名")) 
    }else if(msg.text=="3" || msg.text=="流水"){
        getTodayBilltxt(msg.text,msg.from.id,msg.from.username,msg.message_id,msg.chat.id) 
    }else if(msg.text=="反水" || msg.text=="返水"){
        getReturnWatertxt(msg.text,msg.from.id,msg.from.username,msg.message_id,msg.chat.id) 
    }else if(msg.text=="注单" || msg.text=="4"){
        getMyBettxt(msg.text,msg.from.id,msg.from.username,msg.message_id,msg.chat.id) 
    }else if(msg.text=="充值" || msg.text=="地址"){
        bot.sendMessage(msg.chat.id, `💸 充值地址

TRON地址: <code>${conf.czaddress}</code>

请使用TRX或TRC20代币进行充值，系统会自动为您上分。

⚠️ 充值前请确认地址正确，充值后请耐心等待到账。`,{
            reply_to_message_id: msg.message_id,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        })
    }else if (msg.text.search("赠送")==0 && msg.reply_to_message){
        zengsong(msg)
    }else{
            bet(msg.text,msg.from.id,msg.from.username,msg.message_id, msg.from.first_name);
    }
}


function privatemain(msg) {
    if(msg.text.search("/start")==0){
        start(msg)
    }else if(msg.text=="/odds"){
        odds(msg)
    }else if(msg.text=="/help"){
        help(msg)
    }else if(msg.text=="/invite"){
        invite(msg)
    }else if (msg.text=="👤个人中心") {
        start(msg)
    }else if (msg.text=="🎮开始娱乐"){
        startgame(msg)
    }else if (msg.text=="💸上下分群"){
        startgame(msg)
    }else if (msg.text=="❓娱乐规则"){
        yuleguize(msg)
    }else if(msg.text=="充值" || msg.text=="地址"){
        bot.sendMessage(msg.chat.id, `💸 充值地址

TRON地址: <code>${conf.czaddress}</code>

请使用TRX或TRC20代币进行充值，系统会自动为您上分。

⚠️ 充值前请确认地址正确，充值后请耐心等待到账。`,{
            reply_to_message_id: msg.message_id,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        })
    }else if (msg.text.indexOf('/send')===0 && msg.from.id == conf.adminid) {
        qunfa(msg)
    }
}

function startgame(msg) {
    bot.sendMessage(msg.chat.id, `点击按钮进入开始游戏或加入上下分群`,{
                    parse_mode:"HTML",
                    disable_web_page_preview:true,
                    reply_markup:{
                        inline_keyboard:conf.startinlinekeyboard
                    }
                })
}

function yuleguize(msg) {
    bot.sendMessage(msg.chat.id, `—— —— —— —— —— —— —— ——
    🏆玩法限额/赔率：
    ♦️大小单双
    ♦️组合
    ♦️数字
    🔹对子 3倍
    🔹顺子 12倍
    🔹豹子 60倍
    🔹极值 12倍
    🔥大小单双 2.8倍🔸小单大双 6倍🔸大单小双 6倍
    ⚠️遇13/14 、对子、顺子、豹子退回下注中奖本金
    （注：开出890/190等三个数字均为顺子）
    —— —— —— —— —— —— 
    0/27=500倍   💵  1/26=120倍
    2/25=98倍    💵  3/24=58倍
    4/23=48倍    💵  5/22=32倍
    6/21=25倍    💵  7/20=20倍
    8/19=17倍    💵  9/18=15倍
    10/17=14倍   💵  11/16=13倍
    12/15=11倍   💵  13/14=10倍
    —— —— —— —— —— ——
    单个玩家单期单注封顶10000r
    单期玩家单期总注封顶20000r
    🔥每1万反30，每天23：59自动反水❗️
    🔰🔰🔰🔰🔰🔰🔰🔰🔰🔰
    —— —— —— —— —— —— —— ——
    
    ⛔️下注结束，全体禁言停止下注！
    ⚠️下注结束出现编辑 分数清0！
    ⚠️多次下注等于叠加下注/加注！
    ⚠️一切以机器人录入结算为准！
    
    ‼️开奖依据加拿大28官方为准‼️
    📣创智娱乐㊗️老板们：旗开得胜、盈利多多、天天提款！💰`,{
                    parse_mode:"HTML",
                    disable_web_page_preview:true,
                    reply_markup:{
                        inline_keyboard:conf.startinlinekeyboard
                    }
                })
}

function sxf(msg) {
    if(msg.text.search("上分")!=-1){
        shangfensxfq(msg.text,msg.from.id,msg.from.username,msg.message_id,msg.chat.id,(msg.from.first_name?msg.from.first_name:"")+(msg.from.last_name?msg.from.last_name:""))
    }else if(msg.text.search("下分")!=-1){
        xiafensxfq(msg.text,msg.from.id,msg.from.username,msg.message_id,msg.chat.id,(msg.from.first_name?msg.from.first_name:"")+(msg.from.last_name?msg.from.last_name:""))
    }else if(msg.text=="1" || msg.text=="余额"){
        yuetxt(msg.text,msg.from.id,(msg.from.first_name?msg.from.first_name:"")+(msg.from.last_name?msg.from.last_name:""),msg.message_id,msg.chat.id,msg.from.username) 
    }else if(msg.text.search("/zjtz")!=-1){
        // getMyBettxt(msg.text,msg.from.id,msg.from.username,msg.message_id,msg.chat.id) 
    }else if(msg.text.search("/ckls")!=-1 || msg.text=="流水"){
        // getTodayBilltxt(msg.text,msg.from.id,msg.from.username,msg.message_id,msg.chat.id) 
    }else if(msg.text.search("/lqfs")!=-1 || msg.text=="反水"){
        // getReturnWatertxt(msg.text,msg.from.id,msg.from.username,msg.message_id,msg.chat.id) 
    }
}


/*上分*/
function shangfensxfq(contant,telegramid,username,replyMessageid,chatid,name) {
    conf.pool.getConnection(function(err, connection) {
        connection.query(`select * from users where telegramid = "${telegramid}";`,(error, result)=> {
            connection.destroy();
            if (error) return error;
            bot.sendMessage(chatid, `👤<a href="http://t.me/${username}">${name}</a>
👨‍💻用户id:<code>${telegramid}</code>
💰账户余额 <code>${result[0].balance}</code>元
⚡️今日流水 <code>${result[0].liushui}</code>元
⚠️主动私聊你的都是骗子！`,{
                reply_to_message_id: replyMessageid,
                disable_web_page_preview:true,
                parse_mode: 'HTML',
                reply_markup:{
                    inline_keyboard:conf.sf1inline_keyboard
                }
            })
        });
    })
}

/*上分*/
function shangfen(contant,telegramid,username,replyMessageid,chatid,name) {
    conf.pool.getConnection(function(err, connection) {
        connection.query(`select * from users where telegramid = "${telegramid}";`,(error, result)=> {
            connection.destroy();
            if (error) return error;
            bot.sendMessage(chatid, `👤<a href="http://t.me/${username}">${name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a>
👨‍💻用户id:<code>${telegramid}</code>
💰账户余额 <code>${result[0].balance}</code>元
👉点击进入 ➜ <a href="https://t.me/+Qs89a1mVmas2MWZk">上下分群</a>
⚠️主动私聊你的都是骗子！`,{
                reply_to_message_id: replyMessageid,
                disable_web_page_preview:true,
                parse_mode: 'HTML',
                reply_markup:{
                    inline_keyboard:conf.sfcgkeyboard
                }
            })
        });
    })
}


/*下分*/
function xiafensxfq(contant,telegramid,username,replyMessageid,chatid,name) {
    conf.pool.getConnection(function(err, connection) {
        connection.query(`select * from users where telegramid = "${telegramid}";`,(error, result)=> {
            connection.destroy();
            if (error) return error;
            bot.sendMessage(chatid, `👤<a href="http://t.me/${username}">${name}</a>
👨‍💻用户id:<code>${telegramid}</code>
💰账户余额 <code>${result[0].balance}</code>元
⚡️今日流水 <code>${result[0].liushui}</code>元
⚠️主动私聊你的都是骗子！`,{
                reply_to_message_id: replyMessageid,
                disable_web_page_preview:true,
                parse_mode: 'HTML',
                reply_markup:{
                    inline_keyboard:conf.sf1inline_keyboard
                }
            })
        });
    })
}

/*下分*/
function xiafen(contant,telegramid,username,replyMessageid,chatid,name) {
    conf.pool.getConnection(function(err, connection) {
        connection.query(`select * from users where telegramid = "${telegramid}";`,(error, result)=> {
            connection.destroy();
            if (error) return error;
            bot.sendMessage(chatid, `👤<a href="http://t.me/${username}">${name}</a>
👨‍💻用户id:<code>${telegramid}</code>
💰账户余额 <code>${result[0].balance}</code>元
⚡️今日流水 <code>${result[0].liushui}</code>元
⚠️主动私聊你的都是骗子！`,{
                reply_to_message_id: replyMessageid,
                disable_web_page_preview:true,
                parse_mode: 'HTML',
                reply_markup:{
                    inline_keyboard:conf.sfcgkeyboard
                }
            })
        });
    })
}
/*发送即将封盘提醒*/
function fengpantixing() {
    bot.sendMessage(conf.chatid,`⏰<code>${parseInt(resultid)+1}</code>期 \n\n即将封盘（还有30秒）`,{
        parse_mode:"HTML",

    })
    .catch(err=>{
        console.log(err);
        
    })
}

function sha(msg) {
    bot.sendMessage(msg.chat.id,`创智娱乐的系统基于加拿大28官方开奖数据 因此结果无法被人为操纵 如果您对开奖结果的准确性有疑虑，可以通过<a href="https://www.google.com/ncr">谷歌</a>或<a href="https://www.baidu.com/">百度</a>等搜索引擎查询“加拿大28开奖”🌐加拿大PC28:【<a href="http://fcpc28.xyz/">官方网址</a>】
加拿大28开奖并将本群开奖结果与各大开奖网站上的开奖结果进行对比 这样可以更好地确保游戏的公正性和透明度`,{
        parse_mode:"HTML",
        disable_web_page_preview:true
    })
}

/*查询开奖历史*/
function lishitxt(contant,telegramid,name,replyMessageid) {
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM result ORDER by result_time desc limit 10 ;`,(error, result)=> {
            if (error) return error;
            connection.destroy();
            var historylist = "";
            var biaoqing = ""
            if (parseInt(result[0].one)%3==0) {
                biaoqing = "🌑"
            }else if (parseInt(result[0].one)%3==1) {
                biaoqing = "🔆"
            }else{
                biaoqing = "🌕"
            }
            for (let index = 0; index < result.length; index++) {
                iszaliu = 0;
                if (result[index].baozi==0 && result[index].shunzi==0 && result[index].duizi==0) {
                    iszaliu = 1;
                }
                historylist = `${biaoqing}<code>${result[index].id}</code>期 <code>${result[index].one}+${result[index].two}+${result[index].three}=${(result[index].one+result[index].two+result[index].three<10?" "+(result[index].one+result[index].two+result[index].three):result[index].one+result[index].two+result[index].three)}</code> <code>${(result[index].big==1?"大":"")}${(result[index].small==1?"小":"")}</code> <code>${(result[index].odd==1?"单 ":"")}${(result[index].even==1?"双 ":"")}</code><code>${(result[index].baozi==1?"豹子":"")}${(result[index].shunzi==1?"顺子":"")}${(result[index].duizi==1?"对子":"")}${(iszaliu==1?"杂六":"")}</code>\n${historylist}`
            }
            bot.sendMessage(conf.chatid, `📝开奖记录（最近 10 期）\n${historylist}`,{
                reply_to_message_id: replyMessageid,
                parse_mode:"HTML"
            })
        });
    });
}
/*查询开奖历史*/
function lishi(contant,telegramid,name,replyMessageid) {
    if (parseInt(contant.split('历史')[1])%1!=0 || parseInt(contant.split('历史')[1])>100 || parseInt(contant.split('历史')[1])<0 || isNaN(Number(contant.split("历史")[1],10))) {
       return 
    }
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM result ORDER by result_time desc limit ${parseInt(contant.split('历史')[1])} ;`,(error, result)=> {
            if (error) return error;
            connection.destroy();
            var historylist = "";
            for (let index = 0; index < result.length; index++) {
                iszaliu = 0;
                if (result[index].baozi==0 && result[index].shunzi==0 && result[index].duizi==0) {
                    iszaliu = 1;
                }
                historylist = `${historylist}${result[index].id}期  ${result[index].one} ${result[index].two} ${result[index].three} = ${(parseInt(result[index].one+result[index].two+result[index].three)<10?"0"+parseInt(result[index].one+result[index].two+result[index].three):result[index].one+result[index].two+result[index].three)}\n`;
            }
            bot.sendMessage(conf.chatid, `${historylist}`,{
                reply_to_message_id: replyMessageid
            })
        });
    });
}

function zengsong(msg) {
    var jine = parseFloat(msg.text.split("赠送")[1])
    if (isNaN(jine,10)) {
        return
    }
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM users where telegramid = "${msg.from.id}";SELECT * FROM users where telegramid = "${msg.reply_to_message.from.id}";`,(error, result)=> {
            connection.destroy();
            if (error) return error;
            if (result[0][0].balance<jine) {
                bot.sendMessage(conf.chatid, `余额不足，转增失败`,{
                })
            }else if (jine<10) {
                bot.sendMessage(conf.chatid, `⚠️赠送失败\n（最低赠送金额 10元）`,{
                })
            }else if(!result[1][0]){
                bot.sendMessage(conf.chatid, `转增用户未注册，转增失败`,{
                })
            }else{
                conf.pool.getConnection(function(err, connection) {
                    if (err) return err;
                    connection.query(`update users set balance = balance - ${jine+7} where telegramid = "${msg.from.id}";update users set balance = balance + ${jine} where telegramid = "${msg.reply_to_message.from.id}";`,(error, re)=> {
                        if (error) return error;
                        connection.destroy();
                        bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${msg.from.username}">${(msg.from.first_name?msg.from.first_name:"")+(msg.from.last_name?msg.from.last_name:"")}</a>
用户id: <code>${msg.from.id}</code>
💰<code>${result[0][0].balance}</code>-<code>${jine}</code>-<code>7</code>=<code>${result[0][0].balance-jine-1}</code>元

👤<a href="http://t.me/${msg.reply_to_message.from.username}">${(msg.reply_to_message.from.first_name?msg.reply_to_message.from.first_name:"")+(msg.reply_to_message.from.last_name?msg.reply_to_message.from.last_name:"")}</a>
🧑‍💻用户id:<code>${msg.reply_to_message.from.id}</code>
💰<code>${result[1][0].balance}</code>+<code>${jine}</code>=<code>${result[1][0].balance+jine}</code>元 `,{
                            parse_mode:"HTML",
                            disable_web_page_preview:true
                        })
                    });
                });
            }
            
        });
    });
}
/*取消单个*/
function chehui(contant,telegramid,name,replyMessageid,message_thread_id) {
    if (isfengpan) {
        bot.sendMessage(conf.chatid, `取消失败！\n原因:已经封盘`,{
            reply_to_message_id: replyMessageid
        })
        return
    }
    if (!message_thread_id) {
        bot.sendMessage(conf.chatid, `无法获取消息的回复id，请使用“全部取消”功能！`,{
            reply_to_message_id: replyMessageid
        })
        return
    }
    var chehuisql = "";
    var chehuiorder = "";
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM bet where messageid = "${message_thread_id}" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";`,(error, result)=> {
            if (error) return error;
            for (let index = 0; index < result.length; index++) {
                chehuiorder = `${chehuiorder}${result[index].guess}-${result[index].amount}\n`
                chehuisql =  `${chehuisql}DELETE FROM bet  where id  ='${result[index].id}';UPDATE users set balance = balance + ${result[index].amount} where telegramid = "${result[index].telegramid}"; `
            }
            if (result.length==0) {
                connection.destroy();
                bot.sendMessage(conf.chatid, `取消失败！\n原因:已经开奖`,{
                    reply_to_message_id: replyMessageid
                })
            } else {
                connection.query(chehuisql,(error, result)=> {
                    connection.destroy();
                    if (error) return error;
                    bot.sendMessage(conf.chatid, `取消成功！\n包含的投注有：\n${chehuiorder}`,{
                        reply_to_message_id: replyMessageid
                    })
                });
            }
            
        });
    });
}



/*文字消息查看余额*/
function benqitouzhutxt(contant,telegramid,name,replyMessageid,chatid,firstname) {
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM users where telegramid = "${telegramid}";SELECT * FROM bet where resultid = "${parseInt(resultid)+1}" and telegramid = "${telegramid}";`,(error, result)=> {
            connection.destroy();
            if (error) return error;
            if (!result[0][0]) {
                bot.sendMessage(chatid, `余额：0.00`,{
                    reply_to_message_id: replyMessageid
                })
            }else if(!result[1][0]){
                bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n💰账户余额 <code>${result[0][0].balance.toFixed(2)}</code>元`,{
                    reply_to_message_id: replyMessageid,
                    reply_markup:{
                        // inline_keyboard:conf.xiazhukeyboard
                    },
                    disable_web_page_preview:true,
                    parse_mode:"HTML"
                })
            }else if(result[1][0]){
                var quanbutouzhu = "";
                for(var index = 0;index<result[1].length;index++){
                    quanbutouzhu += `🛎️已经下注 ${result[1][index].guess} <code>${result[1][index].amount}</code>${conf.coin}\n`
                }
                bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n${quanbutouzhu}💰账户余额 <code>${result[0][0].balance.toFixed(2)}</code>元`,{
                    reply_to_message_id: replyMessageid,
                    reply_markup:{
                        // inline_keyboard:conf.xiazhukeyboard
                    },
                    disable_web_page_preview:true,
                    parse_mode:"HTML"
                })
            }
        });
        
    });
    
}

function help(msg) {
    bot.sendMessage(msg.from.id, `〖您的账号〗<code>${msg.from.id}</code>（点击复制）
〖您的昵称〗<a href="http://t.me/${msg.from.username}">${(msg.from.first_name?msg.from.first_name:"")+(msg.from.last_name?msg.from.last_name:"")}</a>
    
我们的游戏系统基于加拿大28官方开奖数据，因此结果无法被人为操纵。
如果您对开奖结果的准确性有疑虑，可以通过<a href="https://www.google.com/ncr">谷歌</a>或<a href="https://www.baidu.com/">百度</a>等搜索引擎查询“加拿大28开奖”，并将本群开奖结果与各大开奖网站上的开奖结果进行对比。这样可以更好地确保游戏的公正性和透明度。

<b><a href="https://t.me/chuangzhikeji">💬创智娱乐客服</a>
<a href="https://t.me/chuangzhikeji">💬创智娱乐客服</a>

<a href="https://t.me/fuguikeji">👨‍💻软件开发技术售后</a>
（定制、开发、搭建 机器人）</b>`,{
        parse_mode:"HTML",
        disable_web_page_preview:true,
        reply_markup:{
            // inline_keyboard:conf.sfinline_keyboard
        }
    })
}
function huilv(msg) {
    request({
        url: `https://www.okx.com/v3/c2c/tradingOrders/books?quoteCurrency=CNY&baseCurrency=USDT&side=buy&paymentMethod=all&userType=blockTrade`, //aliPay wxPay
    }, (error, response, body) => {
        if (!error || response.statusCode == 200) {
            var allprice = 0
            try {
                for (let index = 0; index < 1; index++) {
                    const element = JSON.parse(body).data.buy[index];
                    allprice+= parseFloat(element.price)
                }
                usdthuilv = (allprice+0.03).toFixed(2)
                bot.sendMessage(msg.chat.id,`💸查询汇率\n⚖️<code>1</code> <code>CNY</code> = <code>${(1/usdthuilv).toFixed(2)}</code> <code>USD</code>\n⚖️<code>1</code> <code>USD</code> = <code>${usdthuilv}</code> CNY\n🕛<code>${moment().format("YYYY-MM-DD HH:mm")}</code>（北京时间）`,{
                    parse_mode:"HTML"
                })
            } catch (e) {
                return
            }
        }
    })
}




function odds(msg) {
    bot.sendMessage(msg.from.id, `大/小/单/双：2.8倍（含本金）
小单/大双：6倍（含本金）
小双/大单：6倍（含本金）
极大/极小：12倍（含本金）
特殊规则：
1、大小单双（当期大小单双总注10000以上2.7倍） 例如：5000大5000单。中了赔2.7倍
2、组合（当期组合总注4999以上5.9倍） 例如：2500大双2500大单。中了赔5.9倍

对子：3倍（含本金）
顺子：12倍（含本金）注：890 ,019等三个数字连在一起均为顺子
豹子：60倍（含本金）
龙/虎/豹：2.92倍（含本金）
开13/14/对子/顺子/豹子/ 中奖单注组合回本
龙号码：00/03/06/09/12/15/18/21/24/27
虎号码：01/04/07/10/13/16/19/22/25
豹号码：02/05/08/11/14/17/20/23/26

数字（00/27）：500倍（含本金）
数字（01/26）：128倍（含本金）
数字（02/25）：88倍 （含本金）
数字（03/24）：58倍（含本金）
数字（04/23）：48倍（含本金）
数字（05/22）：38倍（含本金）
数字（06/21）：28倍（含本金）
数字（07/20）：18倍（含本金）
数字（08/19）：15倍（含本金）
数字（09/18）：15倍（含本金）
数字（10/17）：14倍（含本金）
数字（11/16）：13倍（含本金）
数字（12/15）：12倍（含本金）
数字（13/14）：11倍（含本金）
总注最高限额：20000封顶
大/小/单/双：10000封顶
组合：5000封顶
极大/极小：5000封顶
数字0/27：100封顶
数字01/26：200封顶
数字02/25：500封顶
其他数字：1000封顶
对子：10000封顶
顺子：5000封顶
豹子：200封顶
龙：15000封顶
虎：15000封顶
豹：15000封顶
快投连踢数字每注区间用空格隔开， 例如 13点50 14点50 如没有隔开一律按机器识别为准无须纠结。   `,{
        parse_mode:"HTML",
        // reply_markup:{
        //     inline_keyboard:conf.startkeyboard
        // }
    })
}


function invite(msg) {
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM users where telegramid = "${msg.from.id}";SELECT count(*) FROM users where inviter_telegramid = "${msg.from.id}";`,(error, result)=> {
            connection.destroy();
            if (error) return error;
            if (result[0][0]) {
                bot.sendMessage(msg.chat.id, `🎁终身邀请分润

〖您的账号〗<code>${msg.from.id}</code>（点击复制）
〖您的昵称〗

〖邀请链接〗点击复制👇
<code>${conf.botusername}?start=${msg.from.id}</code>
〖您已邀请〗<code>${result[1][0]["count(*)"]}</code> 人

诚招代理:您终生享受被邀用户流水金额的 ${conf.yongjin*100}% 作为奖励（实时到账）`,{
                    parse_mode:"HTML",
                    disable_web_page_preview:true,
                    reply_markup:{
                        inline_keyboard:conf.inviteinline_keyboard
                    }
                })
            }
            
        });
    });
}

function start(msg) {
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM users where telegramid = "${msg.from.id}";`,(error, result)=> {
            connection.destroy();
            if (error) return error;
            if (result[0]) {
                bot.sendMessage(msg.chat.id, `〖您的账号〗<code>${msg.from.id}</code>\n〖您的昵称〗<a href="http://t.me/${msg.from.username}">${(msg.from.first_name?msg.from.first_name:"")+(msg.from.last_name?msg.from.last_name:"")}</a>\n〖账户资金〗<code>${result[0].balance}</code>${conf.coin}`,{
                    parse_mode:"HTML",
                    disable_web_page_preview:true,
                    reply_markup:{
                        keyboard:conf.startkeyboard,
                        resize_keyboard: true
                    }
                })
            }
            
        });
    });
}

/*文字消息查看余额*/
function yuetxt(contant,telegramid,name,replyMessageid,chatid,nickname) {
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM users where telegramid = "${telegramid}";`,(error, result)=> {
            if (error) return error;
            var balance = result[0].balance;
            connection.query(`SELECT * FROM bet where telegramid = "${telegramid}" and time LIKE CONCAT(CURDATE(), '%');`,(error, res)=> {
                if (error) return error;
                connection.destroy();
                bot.sendMessage(chatid, `〖您的账号〗<code>${telegramid}</code>\n〖您的昵称〗<a href="http://t.me/${nickname}">${name}</a>\n〖账户资金〗<code>${balance}</code> \n〖今日流水〗<code>${result[0].liushui}</code>`,{
                    reply_to_message_id: replyMessageid,
                    parse_mode:"HTML",
                    reply_markup:{
                        inline_keyboard:conf.sfinline_keyboard
                    },
                    disable_web_page_preview:true
                })
            });
        });
    });
}

/*文字消息查询我的投注记录*/
function getMyBettxt(contant,telegramid,name,replyMessageid,chatid) {
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM bet where telegramid = '${telegramid}' order by time desc LIMIT 10;`,(error, result)=> {
            if (error) return error;
            connection.destroy();
            var myBet = "";
            for (let index = 0; index < result.length; index++) {
                if (result[index].resultid==parseInt(resultid)+1) {
                    result_money = `⏰`
                }else if (result[index].result == 0) {
                    result_money = `❌`
                }else{
                    result_money = `✅`
                }
                myBet = `${myBet}${result_money} <code>${result[index].resultid}</code>- <b>${result[index].guess}</b> -投注金额：<code>${result[index].amount}</code>\n`;
            }
            if(result.length==0){
                myBet = `🈚有效投注`
            }
            bot.sendMessage(chatid, `最近投注记录：\n\n${myBet}`,{
                reply_to_message_id: replyMessageid,
                parse_mode:"HTML"
            })
        });
    });
}

/*文字消息查询流水*/
function getTodayBilltxt(contant,telegramid,name,replyMessageid,chatid) {
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM bet where telegramid = "${telegramid}" and time LIKE CONCAT(CURDATE(), '%');`,(error, result)=> {
            if (error) return error;
            connection.destroy();
            var todayWin = 0;
            var todayPurchase = 0;
            var todayWaitResult = 0;
            for (let index = 0; index < result.length; index++) {
                if (resultid!=result[index].resultid) {
                    todayWin = todayWin+result[index].result-result[index].amount+result[index].amountreturn;
                    todayPurchase = todayPurchase + result[index].amount;
                }else{
                    todayWaitResult = todayWaitResult + result[index].amount;
                }
            }
            bot.sendMessage(chatid, `待结算：${todayWaitResult.toFixed(2)} ${conf.coin}\n今日输赢：${todayWin.toFixed(2)} ${conf.coin}\n今日总流水：${todayPurchase.toFixed(2)} ${conf.coin}`,{
                reply_to_message_id: replyMessageid
            })
        });
    });
}

/*文字消息领取反水*/
function getReturnWatertxt(contant,telegramid,name,replyMessageid,chatid) {
    bot.sendMessage(chatid, `⏰每天 23:59 自动返现\n流水越多 返现比例越大`,{
        reply_to_message_id: replyMessageid,
    })
}

/*全部取消*/
function quanbuchehui(contant,telegramid,name,replyMessageid) {
    // bot.sendMessage(conf.chatid, `⚠️买定离手，不予取消！`,{
    //     reply_to_message_id: replyMessageid,
    // })
    // return
    if (isfengpan) {
        bot.sendMessage(conf.chatid, `取消失败！\n原因:已经封盘`,{
            reply_to_message_id: replyMessageid
        })
        return
    }
    var chehuisql = "";
    var chehuiorder = "";
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM bet where telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";`,(error, result)=> {
            if (error) return error;
            if (result.length==0) {
                connection.destroy();
                bot.sendMessage(conf.chatid, `取消失败！\n原因:本期没有参与投注`,{
                    reply_to_message_id: replyMessageid
                })
            } else {
                for (let index = 0; index < result.length; index++) {
                    chehuiorder = `${chehuiorder}${result[index].guess}-${result[index].amount}\n`
                    chehuisql =  `${chehuisql}DELETE FROM bet  where id  ='${result[index].id}';UPDATE users set balance = balance + ${result[index].amount} where telegramid = "${result[index].telegramid}"; `
                }
                connection.query(chehuisql,(error, result)=> {
                    connection.destroy();
                    if (error) return error;
                    bot.sendMessage(conf.chatid, `🔙 ${parseInt(resultid)+1}期投注取消成功！`,{
                        reply_to_message_id: replyMessageid
                    })
                });
            }
        });
    });
    
}

/*设置开奖期数*/
function setResultID() {
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT COUNT(*) FROM result WHERE result_time LIKE CONCAT(CURDATE(), '%');`,(error, result)=> {
            if (error) return error;
            connection.destroy();
            resultid = `${date.getFullYear()}${(date.getMonth()+1<10?"0"+(date.getMonth()+1):date.getMonth()+1)}${(date.getDate()<10?"0"+date.getDate():date.getDate())}${result[0]['COUNT(*)']+1}`;
        });
    });
    
}

/*查询用户余额*/
function getBalance(telegramid,name,nickname,callbackQueryid) {
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM users where telegramid = '${telegramid}';`,(error, result)=> {
            if (error) return error;
            console.log("yonghuyue",name);
            if (result.length==0) {
                connection.query(`Insert into users (name,telegramid,register_time) values ('${name}','${telegramid}',now());`,(error, result)=> {
                    connection.destroy();
                    if (error) return error;
                    bot.answerCallbackQuery(callbackQueryid,{
                        text: `〖账号〗${telegramid}\n〖昵称〗${nickname}\n〖资金〗0.00${conf.coin}`,
                        show_alert:true,
                        cache_time:10
                    })
                });
            }else{
                connection.destroy();
                bot.answerCallbackQuery(callbackQueryid,{
                    text: `〖账号〗${telegramid}\n〖昵称〗${nickname}\n〖资金〗${result[0].balance.toFixed(2)}${conf.coin}`,
                    show_alert:true,
                    cache_time:10
                })
            }
        });
    });
}

/*查询我的投注记录*/
function getMyBet(telegramid,name,callbackQueryid) {
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM bet where telegramid = '${telegramid}' order by time desc LIMIT 5;`,(error, result)=> {
            if (error) return error;
            console.log("touzhujilu",name);
            connection.destroy();
            var myBet = "";
            for (let index = 0; index < result.length; index++) {
                if (result[index].resultid==parseInt(resultid)+1) {
                    result_money = `⏰`
                }else if (result[index].result == 0) {
                    result_money = `❌`
                }else{
                    result_money = `✅`
                }
                myBet = `${myBet}${result_money} ${result[index].resultid}-${result[index].guess}-投注：${result[index].amount}\n`;
            }
            if(result.length==0){
                myBet = `🈚有效投注`
            }
            bot.answerCallbackQuery(callbackQueryid,{
                text: `最近投注记录：\n${myBet}`,
                show_alert:true,
                cache_time:10
            })
            
        });
    });
}


/*封盘*/
function getAllbet(telegramid) {
    conf.pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            return;
        }
        connection.query(`SELECT * FROM bet where resultid = "${parseInt(resultid)+1}" order by telegramid desc;`,(error, result)=> {
            if (error) {
                console.log(error);
                return;
            }
            connection.destroy();
            var AllBet = ``;
            for (let index = 0; index < result.length; index++) {
                AllBet = `${AllBet}\n${entitiestoUtf16(result[index].firstname)} ${result[index].guess} ${result[index].amount}`;
            }
            if (result.length==0) {
                AllBet = `${AllBet}\n🈚人投注 `;
            }
            if (AllBet.length>900) {
                AllBet = ""
                for (let index = 0; index < 40; index++) {
                    AllBet = `${AllBet}\n〖<a href="http://t.me/${result[index].name}">${entitiestoUtf16(result[index].firstname)}</a>〗${result[index].guess}➜<code>${result[index].amount}</code>${conf.coin}`;
                }
                AllBet += `\n等${result.length}次投注`
            }
            
            resultArray = result;
            var fengpanresulttxt = `⛔️<code>${parseInt(resultid)+1}</code>期
封盘（停止下注）
`;
// 🏪本群24小时营业
// 👩‍💻财务24小时在线
// 🧧上分下分：USDT 10U起
            if (conf.sendmode=="t") {
                bot.sendMessage(conf.chatid, fengpanresulttxt,{
                    parse_mode: 'HTML',
                    disable_web_page_preview:true,   
                })
                .then(res=>{
                    iskaijiang = false;
                    bot.sendMessage(conf.chatid, `-----本期下注玩家-----${AllBet}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview:true,
                        
                    })
                })
                .catch(e=>{
                    console.log(e);
                    iskaijiang = false;
                });
            }else if(conf.sendmode=="pt"){
                bot.sendPhoto(conf.chatid, "./img/tzxz.jpg",{
                    caption:fengpanresulttxt,
                    parse_mode: 'HTML',
                    disable_web_page_preview:true,
                    reply_markup:{
                        inline_keyboard:conf.sxfinline_keyboard
                    }
                })
                .then(res=>{
                    iskaijiang = false;
                    bot.sendMessage(conf.chatid, `-----本期下注玩家-----${AllBet}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview:true,
                    })
                    if (date.getHours() == 19 && date.getMinutes() == 0) {
                        isfp7 = true
                        var fengpanneirong = ""
                        if (new Date().getDay()==1) {
                            fengpanneirong = `📣📣尊敬的各位老板：
加拿大PC28官方停盘休息，请耐心等待加拿大PC28官方开奖，请各位老板稍作休息，等待开盘！
加拿大官方封盘时间为：

⏱周一 封盘时间：19:00 - 21:10左右
⏱周二至周日封盘时间：19:00 - 20:10左右

❤️‍🔥停盘维护期间，可继续交流和上分❤️‍🔥`
                        }else{
                            fengpanneirong = `📣📣尊敬的各位老板：
加拿大PC28官方停盘休息，请耐心等待加拿大PC28官方开奖，请各位老板稍作休息，等待开盘！
加拿大官方封盘时间为：

⏱周一 封盘时间：19:00 - 21:10左右
⏱周二至周日封盘时间：19:00 - 20:10左右

❤️‍🔥停盘维护期间，可继续交流和上分❤️‍🔥`
                        }
                        bot.sendMessage(conf.sxfqunid,fengpanneirong,{
                            parse_mode:"HTML",
                            disable_web_page_preview:true,
                            reply_markup:{
                                inline_keyboard:conf.xiazhukeyboard
                            }
                        })
                        bot.sendMessage(conf.chatid,fengpanneirong,{
                            parse_mode:"HTML",
                            disable_web_page_preview:true,
                            reply_markup:{
                                inline_keyboard:conf.xiazhukeyboard
                            }
                        })
                        .then(res=>{
                            bot.setChatPermissions(res.chat.id, {
                                can_send_messages: false,
                                can_send_media_messages: false,
                                can_send_polls: false,
                                can_send_other_messages: false,
                            })
                        })
                    }
                })
                .catch(e=>{
                    console.log(e);
                    iskaijiang = false;
                });
            }
        });
    });
}

/*下注*/
function bet(contant,telegramid,name,replyMessageid,firstname) {
    var shuzisql = ""
    for (let index = 0; index <= 27; index++) {
        shuzisql += `select sum(amount) from bet where telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}" and guess ="押${index}点";`
    }
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM users where telegramid = "${telegramid}";${shuzisql}`,(error, result)=> {
            if (error) return error;
            var userBalance = result[0][0].balance;
            var userinfo = result[0][0];
            var shuzi_xiazhujine = 0
            var xiazhujine = 0;
            const contantArray = contant.split(/\s+/);
            var shuziamount = {
                "押0点":(result[1][0]['sum(amount)']?result[1][0]['sum(amount)']:0),
                "押1点":(result[2][0]['sum(amount)']?result[2][0]['sum(amount)']:0),
                "押2点":(result[3][0]['sum(amount)']?result[3][0]['sum(amount)']:0),
                "押3点":(result[4][0]['sum(amount)']?result[4][0]['sum(amount)']:0),
                "押4点":(result[5][0]['sum(amount)']?result[5][0]['sum(amount)']:0),
                "押5点":(result[6][0]['sum(amount)']?result[6][0]['sum(amount)']:0),
                "押6点":(result[7][0]['sum(amount)']?result[7][0]['sum(amount)']:0),
                "押7点":(result[8][0]['sum(amount)']?result[8][0]['sum(amount)']:0),
                "押8点":(result[9][0]['sum(amount)']?result[9][0]['sum(amount)']:0),
                "押9点":(result[10][0]['sum(amount)']?result[10][0]['sum(amount)']:0),
                "押10点":(result[11][0]['sum(amount)']?result[11][0]['sum(amount)']:0),
                "押11点":(result[12][0]['sum(amount)']?result[12][0]['sum(amount)']:0),
                "押12点":(result[13][0]['sum(amount)']?result[13][0]['sum(amount)']:0),
                "押13点":(result[14][0]['sum(amount)']?result[14][0]['sum(amount)']:0),
                "押14点":(result[15][0]['sum(amount)']?result[15][0]['sum(amount)']:0),
                "押15点":(result[16][0]['sum(amount)']?result[16][0]['sum(amount)']:0),
                "押16点":(result[17][0]['sum(amount)']?result[17][0]['sum(amount)']:0),
                "押17点":(result[18][0]['sum(amount)']?result[18][0]['sum(amount)']:0),
                "押18点":(result[19][0]['sum(amount)']?result[19][0]['sum(amount)']:0),
                "押19点":(result[20][0]['sum(amount)']?result[20][0]['sum(amount)']:0),
                "押20点":(result[21][0]['sum(amount)']?result[21][0]['sum(amount)']:0),
                "押21点":(result[22][0]['sum(amount)']?result[22][0]['sum(amount)']:0),
                "押22点":(result[23][0]['sum(amount)']?result[23][0]['sum(amount)']:0),
                "押23点":(result[24][0]['sum(amount)']?result[24][0]['sum(amount)']:0),
                "押24点":(result[25][0]['sum(amount)']?result[25][0]['sum(amount)']:0),
                "押25点":(result[26][0]['sum(amount)']?result[26][0]['sum(amount)']:0),
                "押26点":(result[27][0]['sum(amount)']?result[27][0]['sum(amount)']:0),
                "押27点":(result[28][0]['sum(amount)']?result[28][0]['sum(amount)']:0),
            }
                var xiazhujinearray = [0,0,0,0,0,0,0,0,0,0,0,0,0] //d x d s dd xd ds xs shunzi duizi baozi jixiao jida 
                var allbet = "",amount,guess = "",peilv = "",sql = "INSERT INTO bet (telegramid ,name ,amount ,guess ,time ,resultid,messageid,firstname,peilv) VALUES";
                if(contant.search("哈")!=-1 && contant.split("哈").length==2){
                    if (contant.split("哈")[0]=="" || contant.split("梭哈")[0]=="") {
                        amount = userBalance;
                        guess = contant.split("哈")[1];
                        peilv = 0;
                        if (contant.split("哈")[1]=="大") { 
                            peilv = conf.peilv['dxds'];
                            xiazhujinearray[0] = amount
                        }
                        if (contant.split("哈")[1]=="小") { 
                            peilv = conf.peilv['dxds'];
                            xiazhujinearray[1] = amount
                        }
                        if (contant.split("哈")[1]=="单") { 
                            peilv = conf.peilv['dxds'];
                            xiazhujinearray[2] = amount
                        }
                        if (contant.split("哈")[1]=="双") { 
                            peilv = conf.peilv['dxds'];
                            xiazhujinearray[3] = amount
                        }
                        if (contant.split("哈")[1]=="大单") { 
                            peilv = conf.peilv['fushi1'];
                            xiazhujinearray[4] = amount
                        }
                        if (contant.split("哈")[1]=="小单") { 
                            peilv = conf.peilv['fushi2'];
                            xiazhujinearray[5] = amount
                        }
                        if (contant.split("哈")[1]=="大双") { 
                            peilv = conf.peilv['fushi2'];
                            xiazhujinearray[6] = amount
                        }
                        if (contant.split("哈")[1]=="小双") { 
                            peilv = conf.peilv['fushi1'];
                            xiazhujinearray[7] = amount
                        }
                        if (contant.split("哈")[1]=="顺子") {
                            peilv = conf.peilv['shunzi'];
                            xiazhujinearray[8] = amount
                        }
                        if (contant.split("哈")[1]=="对子") {
                            peilv = conf.peilv['duizi'];
                            xiazhujinearray[9] = amount
                        }
                        if (contant.split("哈")[1]=="豹子") {
                            peilv = conf.peilv['baozi'];
                            xiazhujinearray[10] = amount
                        }
                        if (contant.split("哈")[1]=="极小") {
                            peilv = conf.peilv['jdjx'];
                            xiazhujinearray[11] = amount
                        }
                        if (contant.split("哈")[1]=="极大") {
                            peilv = conf.peilv['jdjx'];
                            xiazhujinearray[12] = amount
                        }
                        if (isfengpan) {
                            bot.sendMessage(conf.chatid, `慢！本期已封盘 , 投注无效！`,{
                                reply_to_message_id: replyMessageid,
                                parse_mode:"HTML"
                            })
                            connection.destroy();
                            return;
                        }
                        if(guess=="" || peilv == 0){
                            connection.destroy();
                            return;
                        }
                        
                        if (userBalance<=0) {
                            bot.sendMessage(conf.chatid, `您的余额不足，请充值后再进行投注!`,{
                                reply_to_message_id: replyMessageid,
                                parse_mode:"HTML"
                            })
                            connection.destroy();
                            return;
                        }
    
                        if(amount>conf.betMax || amount<conf.betMin){
                            bot.sendMessage(conf.chatid, `投注失败，下注金额超过上限`,{
                                reply_to_message_id: replyMessageid,
                                parse_mode:"HTML"
                            })
                            connection.destroy();
                            return;
                        }
                        connection.query(`select sum(amount) from bet where resultid = "${parseInt(resultid)+1}" and telegramid = "${telegramid}";`,(error, result)=> {
                            if (error) return error;
                            if ((result[0]['sum(amount)']?parseFloat(result[0]['sum(amount)']):0)+amount>conf.xianzhu.dianshabaozi) {
                                bot.sendMessage(conf.chatid, `投注失败，下注金额超过上限`,{
                                    reply_to_message_id: replyMessageid,
                                    parse_mode:"HTML"
                                })
                                connection.destroy();
                                return
                            }
                            
                            connection.query(`select sum(amount) from bet where guess = "大" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "小" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "单" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "双" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "大单" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "小单" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "大双" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "小双" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "顺子" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "对子" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "豹子" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "极小" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "极大" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";`,(error, result)=> {
                                if (error) return error;
                                console.log(amount)
                                let zongzhu = parseInt(amount)
                                for (let index = 0; index < result.length; index++) {
                                    if (result[index][0]['sum(amount)'] == null || isNaN(parseInt(result[index][0]['sum(amount)']))) {
                                        continue
                                    }
                                    zongzhu += parseInt(result[index][0]['sum(amount)'])
                                    console.log(zongzhu)
                                    
                                }
                                if (zongzhu > conf.xianzhu.zongzhu) {
                                    bot.sendMessage(conf.chatid, `投注失败，下注金额超过总注上限`,{
                                        reply_to_message_id: replyMessageid,
                                        parse_mode:"HTML"
                                    }) 
                                    return;
                                }
                                for (let index = 0; index < 4; index++) {
                                    if (parseInt((result[index][0]['sum(amount)']?result[index][0]['sum(amount)']:0))+parseInt(xiazhujinearray[index])>conf.xianzhu.dxds) {
                                        connection.destroy();
                                        bot.sendMessage(conf.chatid, `投注失败，下注金额超过上限`,{
                                            reply_to_message_id: replyMessageid,
                                            parse_mode:"HTML"
                                        }) 
                                        return;
                                    }
                                }
                                for (let index = 4; index < 8; index++) {
                                    if (parseInt((result[index][0]['sum(amount)']?result[index][0]['sum(amount)']:0))+parseInt(xiazhujinearray[index])>conf.xianzhu.zuhe) {
                                        connection.destroy();
                                        bot.sendMessage(conf.chatid, `投注失败，下注金额超过上限`,{
                                            reply_to_message_id: replyMessageid,
                                            parse_mode:"HTML"
                                        }) 
                                        return;
                                    }
                                }
                                for (let index = 8; index < 10; index++) {
                                    if (parseInt((result[index][0]['sum(amount)']?result[index][0]['sum(amount)']:0))+parseFloat(xiazhujinearray[index])>conf.xianzhu.qita) {
                                        connection.destroy();
                                        bot.sendMessage(conf.chatid, `投注失败，下注金额超过上限`,{
                                            reply_to_message_id: replyMessageid,
                                            parse_mode:"HTML"
                                        }) 
                                        return;
                                    }
                                }
                                for (let index = 10; index < 11; index++) {
                                    if (parseInt((result[index][0]['sum(amount)']?result[index][0]['sum(amount)']:0))+parseFloat(xiazhujinearray[index])>conf.xianzhu.baozi) {
                                        connection.destroy();
                                        bot.sendMessage(conf.chatid, `投注失败，下注金额超过上限`,{
                                            reply_to_message_id: replyMessageid,
                                            parse_mode:"HTML"
                                        }) 
                                        return;
                                    }
                                }
                                for (let index = 11; index < 13; index++) {
                                    if (parseInt((result[index][0]['sum(amount)']?result[index][0]['sum(amount)']:0))+parseInt(xiazhujinearray[index])>conf.xianzhu.jizhi) {
                                        connection.destroy();
                                        bot.sendMessage(conf.chatid, `投注失败，下注金额超过上限`,{
                                            reply_to_message_id: replyMessageid,
                                            parse_mode:"HTML"
                                        }) 
                                        return;
                                    }
                                }
                                connection.query(`select * from users where telegramid = "${telegramid}";`,(error, userresult)=> {
                                    if (error){
                                        connection.destroy();
                                        return;
                                    }
                                    if (userresult[0].balance<=0) {
                                        bot.sendMessage(conf.chatid, `您的余额不足，请充值后再进行投注!`,{
                                            reply_to_message_id: replyMessageid,
                                            parse_mode:"HTML"
                                        })
                                        connection.destroy();
                                        return;
                                    }
                                    amount = userresult[0].balance;
                                    connection.query(`INSERT INTO bet (telegramid ,name ,amount ,guess ,time ,resultid,messageid,firstname,peilv) VALUES ("${telegramid}","${name}",${amount},"${guess}",now(),"${parseInt(resultid)+1}","${replyMessageid}","${utf16toEntities(firstname)}","${peilv}");UPDATE users set balance = balance - ${amount}  where telegramid = "${telegramid}";`,(error, result)=> {
                                        if (error) {
                                            connection.destroy();
                                            return
                                        };
                                        connection.query(`select * from users where telegramid = "${telegramid}";select * from bet where  telegramid = "${telegramid}" and resultid = '${parseInt(resultid)+1}';`,(error, result)=> {
                                            connection.destroy();
                                            if (error) return error;
                                            var quanbutouzhu = "";
                                            for(var index = 0;index<result[1].length-1;index++){
                                                quanbutouzhu += `🛎️已经下注 <code>${result[1][index].guess}</code> <code>${result[1][index].amount}</code>${conf.coin}\n`
                                            }
                                            bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n${quanbutouzhu}🧿成功下注 <code>${guess}</code> <code>${amount}</code>${conf.coin}\n💰账户余额 <code>${(result[0][0].balance).toFixed(2)}</code>${conf.coin}`,{
                                                reply_to_message_id: replyMessageid,
                                                parse_mode:"HTML",
                                                disable_web_page_preview:true
                                            })
                                        });
                                    });
                                });
                                
                            });
                            
                        });
                    }
                    
                    
                }else{
                    for (let index = 0; index < contantArray.length; index++) {
                        amount = 0,guess = "";
                        if(contantArray[index].search("大单")!=-1 && contantArray[index].split("大单").length==2){
                            if (contantArray[index].split("大单")[0]=="" || contantArray[index].split("大单")[1]=="") {
                                if (contantArray[index].split("大单")[0]=="") {
                                    amount = contantArray[index].split("大单")[1];
                                }else{
                                    amount = contantArray[index].split("大单")[0];
                                }
                                guess = "大单";
                                peilv = conf.peilv['fushi1'];
                                xiazhujinearray[4] += parseInt(amount)
                            }
                            
                        }else{
                            
                            if(contantArray[index].search("大")!=-1 && contantArray[index].split("大").length==2){
                                if (contantArray[index].split("大")[0]=="" || contantArray[index].split("大")[1]=="") {
                                    if (contantArray[index].split("大")[0]=="") {
                                        amount = contantArray[index].split("大")[1];
                                    }else{
                                        amount = contantArray[index].split("大")[0];
                                    }
                                    guess = "大";
                                    peilv = conf.peilv['dxds'];
                                    xiazhujinearray[0] += parseInt(amount)
                                }
                            }
                            if(contantArray[index].search("单")!=-1 && contantArray[index].split("单").length==2){
                                if (contantArray[index].split("单")[0]=="" || contantArray[index].split("单")[1]=="") {
                                    if (contantArray[index].split("单")[0]=="") {
                                        amount = contantArray[index].split("单")[1];
                                    }else{
                                        amount = contantArray[index].split("单")[0];
                                    }
                                    guess = "单";
                                    peilv = conf.peilv['dxds'];
                                    xiazhujinearray[2] += parseInt(amount)
                                }
                            }
                        } 

                        if(contantArray[index].search("dd")!=-1 && contantArray[index].split("dd").length==2){
                            if (contantArray[index].split("dd")[0]=="" || contantArray[index].split("dd")[1]=="") {
                                if (contantArray[index].split("dd")[0]=="") {
                                    amount = contantArray[index].split("dd")[1];
                                }else{
                                    amount = contantArray[index].split("dd")[0];
                                }
                                guess = "大单";
                                peilv = conf.peilv['fushi1'];
                                xiazhujinearray[4] += parseInt(amount)
                            }
                            
                        }else{
                            
                            if(contantArray[index].search("da")!=-1 && contantArray[index].split("da").length==2){
                                if (contantArray[index].split("da")[0]=="" || contantArray[index].split("da")[1]=="") {
                                    if (contantArray[index].split("da")[0]=="") {
                                        amount = contantArray[index].split("da")[1];
                                    }else{
                                        amount = contantArray[index].split("da")[0];
                                    }
                                    guess = "大";
                                    peilv = conf.peilv['dxds'];
                                    xiazhujinearray[0] += parseInt(amount)
                                }
                            }
                            if(contantArray[index].search("dan")!=-1 && contantArray[index].split("dan").length==2){
                                if (contantArray[index].split("dan")[0]=="" || contantArray[index].split("dan")[1]=="") {
                                    if (contantArray[index].split("dan")[0]=="") {
                                        amount = contantArray[index].split("dan")[1];
                                    }else{
                                        amount = contantArray[index].split("dan")[0];
                                    }
                                    guess = "单";
                                    peilv = conf.peilv['dxds'];
                                    xiazhujinearray[2] += parseInt(amount)
                                }
                            }
                        } 
    
                        if(contantArray[index].search("小双")!=-1 && contantArray[index].split("小双").length==2){
                            if (contantArray[index].split("小双")[0]=="" || contantArray[index].split("小双")[1]=="") {
                                if (contantArray[index].split("小双")[0]=="") {
                                    amount = contantArray[index].split("小双")[1];
                                }else{
                                    amount = contantArray[index].split("小双")[0];
                                }
                                guess = "小双";
                                peilv = conf.peilv['fushi1'];
                                xiazhujinearray[7] += parseInt(amount)
                            }
                            
                        }else{
                            if(contantArray[index].search("小")!=-1 && contantArray[index].split("小").length==2){
                                if (contantArray[index].split("小")[0]=="" || contantArray[index].split("小")[1]=="") {
                                    if (contantArray[index].split("小")[0]=="") {
                                        amount = contantArray[index].split("小")[1];
                                    }else{
                                        amount = contantArray[index].split("小")[0];
                                    }
                                    guess = "小";
                                    peilv = conf.peilv['dxds'];
                                    xiazhujinearray[1] += parseInt(amount)
                                }
                                
                            }
                            if(contantArray[index].search("双")!=-1 && contantArray[index].split("双").length==2){
                                if (contantArray[index].split("双")[0]=="" || contantArray[index].split("双")[1]=="") {
                                    if (contantArray[index].split("双")[0]=="") {
                                        amount = contantArray[index].split("双")[1];
                                    }else{
                                        amount = contantArray[index].split("双")[0];
                                    }
                                    guess = "双";
                                    peilv = conf.peilv['dxds'];
                                    xiazhujinearray[3] += parseInt(amount)
                                }
                                
                            }
                        }

                        if(contantArray[index].search("xs")!=-1 && contantArray[index].split("xs").length==2){
                            if (contantArray[index].split("xs")[0]=="" || contantArray[index].split("xs")[1]=="") {
                                if (contantArray[index].split("xs")[0]=="") {
                                    amount = contantArray[index].split("xs")[1];
                                }else{
                                    amount = contantArray[index].split("xs")[0];
                                }
                                guess = "小双";
                                peilv = conf.peilv['fushi1'];
                                xiazhujinearray[7] += parseInt(amount)
                            }
                            
                        }else{
                            if(contantArray[index].search("xiao")!=-1 && contantArray[index].split("xiao").length==2){
                                if (contantArray[index].split("xiao")[0]=="" || contantArray[index].split("xiao")[1]=="") {
                                    if (contantArray[index].split("xiao")[0]=="") {
                                        amount = contantArray[index].split("xiao")[1];
                                    }else{
                                        amount = contantArray[index].split("xiao")[0];
                                    }
                                    guess = "小";
                                    peilv = conf.peilv['dxds'];
                                    xiazhujinearray[1] += parseInt(amount)
                                }
                                
                            }
                            if(contantArray[index].search("shuang")!=-1 && contantArray[index].split("shuang").length==2){
                                if (contantArray[index].split("shuang")[0]=="" || contantArray[index].split("shuang")[1]=="") {
                                    if (contantArray[index].split("shuang")[0]=="") {
                                        amount = contantArray[index].split("shuang")[1];
                                    }else{
                                        amount = contantArray[index].split("shuang")[0];
                                    }
                                    guess = "双";
                                    peilv = conf.peilv['dxds'];
                                    xiazhujinearray[3] += parseInt(amount)
                                }
                                
                            }
                        }
    
                        if(contantArray[index].search("大双")!=-1 && contantArray[index].split("大双").length==2){
                            if (contantArray[index].split("大双")[0]=="" || contantArray[index].split("大双")[1]=="") {
                                if (contantArray[index].split("大双")[0]=="") {
                                    amount = contantArray[index].split("大双")[1];
                                }else{
                                    amount = contantArray[index].split("大双")[0];
                                }
                                guess = "大双";
                                peilv = conf.peilv['fushi2'];
                                xiazhujinearray[6] += parseInt(amount)
                            }
                        }
    
                        if(contantArray[index].search("小单")!=-1 && contantArray[index].split("小单").length==2){
                            if (contantArray[index].split("小单")[0]=="" || contantArray[index].split("小单")[1]=="") {
                                if (contantArray[index].split("小单")[0]=="") {
                                    amount = contantArray[index].split("小单")[1];
                                }else{
                                    amount = contantArray[index].split("小单")[0];
                                }
                                guess = "小单";
                                peilv = conf.peilv['fushi2'];
                                xiazhujinearray[5] += parseInt(amount)
                            }
                        }
                        if(contantArray[index].search("ds")!=-1 && contantArray[index].split("ds").length==2){
                            if (contantArray[index].split("ds")[0]=="" || contantArray[index].split("ds")[1]=="") {
                                if (contantArray[index].split("ds")[0]=="") {
                                    amount = contantArray[index].split("ds")[1];
                                }else{
                                    amount = contantArray[index].split("ds")[0];
                                }
                                guess = "大双";
                                peilv = conf.peilv['fushi2'];
                                xiazhujinearray[6] += parseInt(amount)
                            }
                        }
    
                        if(contantArray[index].search("xd")!=-1 && contantArray[index].split("xd").length==2){
                            if (contantArray[index].split("xd")[0]=="" || contantArray[index].split("xd")[1]=="") {
                                if (contantArray[index].split("xd")[0]=="") {
                                    amount = contantArray[index].split("xd")[1];
                                }else{
                                    amount = contantArray[index].split("xd")[0];
                                }
                                guess = "小单";
                                peilv = conf.peilv['fushi2'];
                                xiazhujinearray[5] += parseInt(amount)
                            }
                        }
                        if(contantArray[index].search("顺子")!=-1 && contantArray[index].split("顺子").length==2){
                            if (contantArray[index].split("顺子")[0]=="") {
                                amount = contantArray[index].split("顺子")[1];
                            }else{
                                amount = contantArray[index].split("顺子")[0];
                            }
                            guess = "顺子";
                            peilv = conf.peilv['shunzi'];
                            xiazhujinearray[8] += parseInt(amount)
                        }
                        if(contantArray[index].search("对子")!=-1 && contantArray[index].split("对子").length==2){
                            if (contantArray[index].split("对子")[0]=="") {
                                amount = contantArray[index].split("对子")[1];
                            }else{
                                amount = contantArray[index].split("对子")[0];
                            }
                            guess = "对子";
                            peilv = conf.peilv['duizi'];
                            xiazhujinearray[9] += parseInt(amount)
                        }
    
                        if(contantArray[index].search("豹子")!=-1 && contantArray[index].split("豹子").length==2){
                            if (contantArray[index].split("豹子")[0]=="") {
                                amount = contantArray[index].split("豹子")[1];
                            }else{
                                amount = contantArray[index].split("豹子")[0];
                            }
                            guess = "豹子";
                            peilv = conf.peilv['baozi'];
                            xiazhujinearray[10] += parseInt(amount)
                        }

                        if(contantArray[index].search("sz")!=-1 && contantArray[index].split("sz").length==2){
                            if (contantArray[index].split("sz")[0]=="") {
                                amount = contantArray[index].split("sz")[1];
                            }else{
                                amount = contantArray[index].split("sz")[0];
                            }
                            guess = "顺子";
                            peilv = conf.peilv['shunzi'];
                            xiazhujinearray[8] += parseInt(amount)
                        }
                        if(contantArray[index].search("dz")!=-1 && contantArray[index].split("dz").length==2){
                            if (contantArray[index].split("dz")[0]=="") {
                                amount = contantArray[index].split("dz")[1];
                            }else{
                                amount = contantArray[index].split("dz")[0];
                            }
                            guess = "对子";
                            peilv = conf.peilv['duizi'];
                            xiazhujinearray[9] += parseInt(amount)
                        }
    
                        if(contantArray[index].search("bz")!=-1 && contantArray[index].split("bz").length==2){
                            if (contantArray[index].split("bz")[0]=="") {
                                amount = contantArray[index].split("bz")[1];
                            }else{
                                amount = contantArray[index].split("bz")[0];
                            }
                            guess = "豹子";
                            peilv = conf.peilv['baozi'];
                            xiazhujinearray[10] += parseInt(amount)
                        }
    
                        if(contantArray[index].search("极小")!=-1 && contantArray[index].split("极小").length==2){
                            if (contantArray[index].split("极小")[0]=="") {
                                amount = contantArray[index].split("极小")[1];
                            }else{
                                amount = contantArray[index].split("极小")[0];
                            }
                            guess = "极小";
                            peilv = conf.peilv['jdjx'];
                            xiazhujinearray[11] += parseInt(amount)
                        }
    
                        if(contantArray[index].search("极大")!=-1 && contantArray[index].split("极大").length==2){
                            if (contantArray[index].split("极大")[0]=="") {
                                amount = contantArray[index].split("极大")[1];
                            }else{
                                amount = contantArray[index].split("极大")[0];
                            }
                            guess = "极大";
                            peilv = conf.peilv['jdjx'];
                            xiazhujinearray[12] += parseInt(amount)
                        }

                        if(contantArray[index].search("jx")!=-1 && contantArray[index].split("jx").length==2){
                            if (contantArray[index].split("jx")[0]=="") {
                                amount = contantArray[index].split("jx")[1];
                            }else{
                                amount = contantArray[index].split("jx")[0];
                            }
                            guess = "极小";
                            peilv = conf.peilv['jdjx'];
                            xiazhujinearray[11] += parseInt(amount)
                        }
    
                        if(contantArray[index].search("jd")!=-1 && contantArray[index].split("jd").length==2){
                            if (contantArray[index].split("jd")[0]=="") {
                                amount = contantArray[index].split("jd")[1];
                            }else{
                                amount = contantArray[index].split("jd")[0];
                            }
                            guess = "极大";
                            peilv = conf.peilv['jdjx'];
                            xiazhujinearray[12] += parseInt(amount)
                        }
                        
                        if(contantArray[index].search("押")!=-1){
                            if (parseInt(contantArray[index].split("押")[0])>=0 && parseInt(contantArray[index].split("押")[0])<=27) {
                                if (typeof parseFloat(contantArray[index].split("押")[1]) === 'number' && !isNaN(contantArray[index].split("押")[1])  ) {
                                    amount = contantArray[index].split("押")[1];
                                    guess = "押"+parseInt(contantArray[index].split("押")[0])+"点";
                                    peilv = conf.peilv['s'+contantArray[index].split("押")[0]+'d'];
                                    shuzi_xiazhujine += parseInt(amount)
                                    if (shuziamount[guess]+parseFloat(amount)>conf.xianzhu.shuzi) {
                                        bot.sendMessage(conf.chatid, `投注失败，下注金额超过上限`,{
                                            reply_to_message_id: replyMessageid,
                                            parse_mode:"HTML"
                                        })
                                        connection.destroy();
                                        return;
                                    }
                                }
                            }
                        }
    
                        if(contantArray[index].search("t")!=-1){
                            if (parseInt(contantArray[index].split("t")[0])>=0 && parseInt(contantArray[index].split("t")[0])<=27) {
                                if (typeof parseFloat(contantArray[index].split("t")[1]) === 'number' && !isNaN(contantArray[index].split("t")[1])  ) {
                                    amount = contantArray[index].split("t")[1];
                                    guess = "押"+parseInt(contantArray[index].split("t")[0])+"点";
                                    peilv = conf.peilv['s'+contantArray[index].split("t")[0]+'d'];
                                    shuzi_xiazhujine += parseInt(amount)
                                    if (shuziamount[guess]+parseFloat(amount)>conf.xianzhu.shuzi) {
                                        bot.sendMessage(conf.chatid, `投注失败，下注金额超过上限`,{
                                            reply_to_message_id: replyMessageid,
                                            parse_mode:"HTML"
                                        })
                                        connection.destroy();
                                        return;
                                    }
                                }
                            }
                        }

                        if(contantArray[index].search("操")!=-1){
                            if (parseInt(contantArray[index].split("操")[0])>=0 && parseInt(contantArray[index].split("操")[0])<=27) {
                                if (typeof parseFloat(contantArray[index].split("操")[1]) === 'number' && !isNaN(contantArray[index].split("操")[1])  ) {
                                    amount = contantArray[index].split("操")[1];
                                    guess = "押"+parseInt(contantArray[index].split("操")[0])+"点";
                                    peilv = conf.peilv['s'+contantArray[index].split("操")[0]+'d'];
                                    shuzi_xiazhujine += parseInt(amount)
                                    if (shuziamount[guess]+parseFloat(amount)>conf.xianzhu.shuzi) {
                                        bot.sendMessage(conf.chatid, `投注失败，下注金额超过上限`,{
                                            reply_to_message_id: replyMessageid,
                                            parse_mode:"HTML"
                                        })
                                        connection.destroy();
                                        return;
                                    }
                                }
                            }
                        }

                        if(contantArray[index].search("杀")!=-1){
                            if (parseInt(contantArray[index].split("杀")[0])>=0 && parseInt(contantArray[index].split("杀")[0])<=27) {
                                if (typeof parseFloat(contantArray[index].split("杀")[1]) === 'number' && !isNaN(contantArray[index].split("杀")[1])  ) {
                                    amount = contantArray[index].split("杀")[1];
                                    guess = "押"+parseInt(contantArray[index].split("杀")[0])+"点";
                                    peilv = conf.peilv['s'+contantArray[index].split("杀")[0]+'d'];
                                    shuzi_xiazhujine += parseInt(amount)
                                    if (shuziamount[guess]+parseFloat(amount)>conf.xianzhu.shuzi) {
                                        bot.sendMessage(conf.chatid, `投注失败，下注金额超过上限`,{
                                            reply_to_message_id: replyMessageid,
                                            parse_mode:"HTML"
                                        })
                                        connection.destroy();
                                        return;
                                    }
                                }
                            }
                        }

                        if(contantArray[index].search("草")!=-1){
                            if (parseInt(contantArray[index].split("草")[0])>=0 && parseInt(contantArray[index].split("草")[0])<=27) {
                                if (typeof parseFloat(contantArray[index].split("草")[1]) === 'number' && !isNaN(contantArray[index].split("草")[1])  ) {
                                    amount = contantArray[index].split("草")[1];
                                    guess = "押"+parseInt(contantArray[index].split("草")[0])+"点";
                                    peilv = conf.peilv['s'+contantArray[index].split("草")[0]+'d'];
                                    shuzi_xiazhujine += parseInt(amount)
                                    if (shuziamount[guess]+parseFloat(amount)>conf.xianzhu.shuzi) {
                                        bot.sendMessage(conf.chatid, `投注失败，下注金额超过上限`,{
                                            reply_to_message_id: replyMessageid,
                                            parse_mode:"HTML"
                                        })
                                        connection.destroy();
                                        return;
                                    }
                                }
                            }
                        }

                        
                        if(contantArray[index].search("T")!=-1){
                            if (parseInt(contantArray[index].split("T")[0])>=0 && parseInt(contantArray[index].split("T")[0])<=27) {
                                if (typeof parseFloat(contantArray[index].split("T")[1]) === 'number' && !isNaN(contantArray[index].split("T")[1])  ) {
                                    amount = contantArray[index].split("T")[1];
                                    guess = "押"+parseInt(contantArray[index].split("T")[0])+"点";
                                    peilv = conf.peilv['s'+contantArray[index].split("T")[0]+'d'];
                                    shuzi_xiazhujine += parseInt(amount)
                                    if (shuziamount[guess]+parseFloat(amount)>conf.xianzhu.shuzi) {
                                        bot.sendMessage(conf.chatid, `投注失败，下注金额超过上限`,{
                                            reply_to_message_id: replyMessageid,
                                            parse_mode:"HTML"
                                        })
                                        connection.destroy();
                                        return;
                                    }
                                }
                            }
                        }
                        xiazhujine += parseInt(amount);
                        if (index==0) {
                            sql = sql + ` ("${telegramid}","${name}",${amount},"${guess}",now(),"${parseInt(resultid)+1}","${replyMessageid}","${utf16toEntities(firstname)}","${peilv}")`;
                        } else {
                            sql = sql + ` ,("${telegramid}","${name}",${amount},"${guess}",now(),"${parseInt(resultid)+1}","${replyMessageid}","${utf16toEntities(firstname)}","${peilv}")`;
                        }
    
                        allbet = allbet + `🧿成功下注 <code>${guess}</code> <code>${amount}</code>${conf.coin}\n`
                        
                        if(amount=="" || /[\u4e00-\u9fa5]+/.test(amount) || /[a-zA-Z]+/.test(amount) || amount%1!=0){
                            connection.destroy();
                            return;
                        }
                        if (isfengpan ) {
                            bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n⚠️下注无效（已经封盘）\n💰账户余额 <code>${userBalance}</code>元`,{
                                reply_to_message_id: replyMessageid,
                                parse_mode:"HTML",
                                disable_web_page_preview:true
                            })
                            connection.destroy();
                            return;
                        }
                        if(amount<=0 || guess==""){
                            bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n⚠️格式有误，本次投注无效！\n💰账户余额 <code>${userBalance}</code>元`,{
                                reply_to_message_id: replyMessageid,
                                parse_mode:"HTML",
                                disable_web_page_preview:true
                            })
                            connection.destroy();
                            return;
                        }
    
                        if(amount>conf.betMax || amount<conf.betMin){
                            bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n⚠️请勿超过投注范围 ${conf.betMin}-${conf.betMax}，本次投注无效！\n💰账户余额 <code>${userBalance}</code>元`,{
                                reply_to_message_id: replyMessageid,
                                parse_mode:"HTML",
                                disable_web_page_preview:true
                            })
                            connection.destroy();
                            return;
                        }
                        
                    }
                    if (userBalance<xiazhujine) {
                        bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n⚠️下注无效（余额不足）\n💰账户余额 <code>${userBalance}</code>元`,{
                            parse_mode:"HTML",
                            reply_to_message_id: replyMessageid,
                            disable_web_page_preview:true
                        })
                        connection.destroy();
                        return;
                    }
                    connection.query(`select sum(amount) from bet where guess = "大"  and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "小"  and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "单"  and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "双"  and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "大单"  and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "小单"  and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "大双"  and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "小双"  and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "顺子"  and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "对子"  and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "豹子"  and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "极小"  and resultid = "${parseInt(resultid)+1}";
                            select sum(amount) from bet where guess = "极大"  and resultid = "${parseInt(resultid)+1}";`,(error, dqresult)=> {
                                if (error) {
                                    console.log(error)
                                    return error;
                                }
                                let dqzongzhu = parseInt(amount)
                                for (let index = 0; index < dqresult.length; index++) {
                                    if (dqresult[index][0]['sum(amount)'] == null || isNaN(parseInt(dqresult[index][0]['sum(amount)']))) {
                                        continue
                                    }
                                    dqzongzhu += parseInt(dqresult[index][0]['sum(amount)'])
                                }
                                console.log(dqzongzhu + "单期总注")
                                if (dqzongzhu > conf.xianzhu.dqzongzhu) {
                                    bot.sendMessage(conf.chatid, `投注失败，下注金额超过单期总注上限`,{
                                        reply_to_message_id: replyMessageid,
                                        parse_mode:"HTML"
                                    })
                                    connection.destroy();
                                    return
                                }
                            })
                    connection.query(`select sum(amount) from bet where guess = "大" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                    select sum(amount) from bet where guess = "小" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                    select sum(amount) from bet where guess = "单" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                    select sum(amount) from bet where guess = "双" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                    select sum(amount) from bet where guess = "大单" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                    select sum(amount) from bet where guess = "小单" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                    select sum(amount) from bet where guess = "大双" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                    select sum(amount) from bet where guess = "小双" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                    select sum(amount) from bet where guess = "顺子" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                    select sum(amount) from bet where guess = "对子" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                    select sum(amount) from bet where guess = "豹子" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                    select sum(amount) from bet where guess = "极小" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";
                    select sum(amount) from bet where guess = "极大" and telegramid = "${telegramid}" and resultid = "${parseInt(resultid)+1}";`,(error, result)=> {
                        if (error) return error;
    
                        for (let index = 0; index < 4; index++) {
                            if (parseInt((result[index][0]['sum(amount)']?result[index][0]['sum(amount)']:0))+parseInt(xiazhujinearray[index])>conf.xianzhu.dxds) {
                                connection.destroy();
                                bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n⚠️投注失败，下注金额超过上限\n💰账户余额 <code>${userBalance}</code>元`,{
                                    parse_mode:"HTML",
                                    reply_to_message_id: replyMessageid,
                                    disable_web_page_preview:true
                                })
                                return;
                            }
                        }
                        for (let index = 4; index < 8; index++) {
                            if (parseInt((result[index][0]['sum(amount)']?result[index][0]['sum(amount)']:0))+parseFloat(xiazhujinearray[index])>conf.xianzhu.zuhe) {
                                connection.destroy();
                                bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n⚠️投注失败，下注金额超过上限\n💰账户余额 <code>${userBalance}</code>元`,{
                                    parse_mode:"HTML",
                                    reply_to_message_id: replyMessageid,
                                    disable_web_page_preview:true
                                })
                                return;
                            }
                        }
                        for (let index = 8; index < 9; index++) {
                            if (parseInt((result[index][0]['sum(amount)']?result[index][0]['sum(amount)']:0))+parseFloat(xiazhujinearray[index])>conf.xianzhu.shunzi) {
                                connection.destroy();
                                bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n⚠️投注失败，下注金额超过上限\n💰账户余额 <code>${userBalance}</code>元`,{
                                    parse_mode:"HTML",
                                    reply_to_message_id: replyMessageid,
                                    disable_web_page_preview:true
                                })
                                return;
                            }
                        }
                        for (let index = 9; index < 10; index++) {
                            if (parseInt((result[index][0]['sum(amount)']?result[index][0]['sum(amount)']:0))+parseFloat(xiazhujinearray[index])>conf.xianzhu.duizi) {
                                connection.destroy();
                                bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n⚠️投注失败，下注金额超过上限\n💰账户余额 <code>${userBalance}</code>元`,{
                                    parse_mode:"HTML",
                                    reply_to_message_id: replyMessageid,
                                    disable_web_page_preview:true
                                })
                                return;
                            }
                        }
                        for (let index = 10; index < 11; index++) {
                            if (parseInt((result[index][0]['sum(amount)']?result[index][0]['sum(amount)']:0))+parseFloat(xiazhujinearray[index])>conf.xianzhu.baozi) {
                                connection.destroy();
                                bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n⚠️投注失败，下注金额超过上限\n💰账户余额 <code>${userBalance}</code>元`,{
                                    parse_mode:"HTML",
                                    reply_to_message_id: replyMessageid,
                                    disable_web_page_preview:true
                                })
                                
                                return;
                            }
                        }
                        for (let index = 11; index < 13; index++) {
                            if (parseInt((result[index][0]['sum(amount)']?result[index][0]['sum(amount)']:0))+parseFloat(xiazhujinearray[index])>conf.xianzhu.jizhi) {
                                connection.destroy();
                                bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n⚠️投注失败，下注金额超过上限\n💰账户余额 <code>${userBalance}</code>元`,{
                                    parse_mode:"HTML",
                                    reply_to_message_id: replyMessageid,
                                    disable_web_page_preview:true
                                })
                                
                                return;
                            }
                        }

                        let zongzhu = parseInt(amount)
                        console.log(amount)
                        for (let index = 0; index < result.length; index++) {
                            if (result[index][0]['sum(amount)'] == null || isNaN(parseInt(result[index][0]['sum(amount)']))) {
                                continue
                            }
                            zongzhu += parseInt(result[index][0]['sum(amount)'])
                            console.log(zongzhu)
                        }
                        if (zongzhu > conf.xianzhu.zongzhu) {
                            bot.sendMessage(conf.chatid, `投注失败，下注金额超过总注上限`,{
                                reply_to_message_id: replyMessageid,
                                parse_mode:"HTML"
                            }) 
                            return;
                        }

                        connection.query(`UPDATE users set balance = balance - ${xiazhujine}  where telegramid = "${telegramid}";`,(error, result)=> {
                            if (error) return error;
                            connection.query(`select * from users where telegramid = "${telegramid}";select * from bet where  telegramid = "${telegramid}" and resultid = '${parseInt(resultid)+1}';${sql};`,(error, result)=> {
                                connection.destroy();
                                if (error) return error;
                                var quanbutouzhu = "";
                                for(var index = 0;index<result[1].length;index++){
                                    quanbutouzhu += `🛎️已经下注 <code>${result[1][index].guess}</code> <code>${result[1][index].amount}</code>${conf.coin}\n`
                                }
                                bot.sendMessage(conf.chatid, `👤<a href="http://t.me/${name}">${firstname}</a>\n${quanbutouzhu}${allbet}💰账户余额 <code>${(result[0][0].balance).toFixed(2)}</code>${conf.coin}`,{
                                    reply_to_message_id: replyMessageid,
                                    parse_mode:"HTML",
                                    disable_web_page_preview:true
                                })
                                
                            });
                        });
    
                    })
                }
                

                    
                
        });
    });
}

/*查询流水*/
function getTodayBill(telegramid,name,callbackQueryid) {
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM bet where telegramid = "${telegramid}" and time LIKE CONCAT(CURDATE(), '%');`,(error, result)=> {
            if (error) return error;
            console.log("liushui",name);
            connection.destroy();
            var todayWin = 0;
            var todayPurchase = 0;
            var todayWaitResult = 0;
            for (let index = 0; index < result.length; index++) {
                if (resultid!=result[index].resultid) {
                    todayWin = todayWin+result[index].result-result[index].amount+result[index].amountreturn;
                    todayPurchase = todayPurchase + result[index].amount;
                }else{
                    todayWaitResult = todayWaitResult + result[index].amount;
                }
            }
            bot.answerCallbackQuery(callbackQueryid,{
                text: `〖今日流水〗${todayPurchase.toFixed(2)}${conf.coin}\n〖今日输赢〗${todayWin.toFixed(2)}${conf.coin}`,
                show_alert:true,
                cache_time:10
            })
        });
    });
}

/*领取反水*/
function getReturnWater(telegramid,name,callbackQueryid) {
    conf.pool.getConnection(function(err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM bet where telegramid = "${telegramid}" and isreturn = 0 and resultid != "${parseInt(resultid)+1}";`,(error, result)=> {
            console.log("lingqufanshui",name);
            if (error) return error;
            var myReturnWater = 0;
            for (let index = 0; index < result.length; index++) {
                myReturnWater = myReturnWater + result[index].amount*conf.returnWater;
            }
            connection.query(`UPDATE users set balance = balance + ${myReturnWater} where telegramid = "${telegramid}";UPDATE bet set isreturn = 1,amountreturn = amount*${conf.returnWater} where telegramid = "${telegramid}" and resultid != "${parseInt(resultid)+1}";`,(error, result)=> {
                connection.destroy();
                if (error) return error;
                bot.answerCallbackQuery(callbackQueryid,{
                    text: `领取反水：${myReturnWater} ${conf.coin}`,
                    show_alert:true,
                    cache_time:1
                })
                .catch(e=>{
                    console.log("领取反水出错");
                })
            });
        });
    });
}

/*开奖*/
function setResult() {
    isfengpantixing = false;
    resultdxds = {
        big:0,
        small:0,
        odd:0,
        even:0,
        baozi:0,
        shunzi:0,
        duizi:0
    }
    baozi = "";
    shunzi = "";
    duizi = "";
    daxiao = "";
    danshuang = "";
    ssss = "";
    jdjx = "";



    if  (c-b==1 && b-a==1) {
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }
    if  (c-a==1 && b-c==1) {
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }
    if  (a-b==1 && c-a==1) {
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }
    if  (b-a==1 && a-c==1) {
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a-b==1 && b-c==1) {
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }
    if  (a-c==1 && c-b==1) { 
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a==1 && b==0 && c==9) { 
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a==1 && b==9 && c==0) { 
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a==0 && b==9 && c==1) { 
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a==0 && b==1 && c==9) { 
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a==9 && b==0 && c==1) { 
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a==9 && b==1 && c==0) { 
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a==0 && b==9 && c==8) { 
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a==0 && b==8 && c==9) { 
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a==8 && b==9 && c==0) { 
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a==8 && b==0 && c==9) { 
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a==9 && b==8 && c==0) { 
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a==9 && b==0 && c==8) { 
        resultdxds.shunzi = 1;
        shunzi = "顺子";
    }

    if  (a==b && b!=c) {
        resultdxds.duizi = 1;
        duizi = "对子";
    }
    if  (b==c && c!=a) {
        resultdxds.duizi = 1;
        duizi = "对子";
    }
    if  (a==c && c!=b) {
        resultdxds.duizi = 1;
        duizi = "对子";
    }
    
    if (a==b && b==c && c==a) { //如果是豹子，通押
        resultdxds.baozi = 1;
        baozi = "豹子";
    }
    
    /*大小*/
    if(value>13){
        resultdxds.big = 1;
        daxiao = "大";
    }
    if(value<=13){
        resultdxds.small = 1;
        daxiao = "小";
    } 
    /*单双*/
    if(value%2==1){
        resultdxds.odd = 1;
        danshuang = "单";
    }
    if(value%2==0){
        resultdxds.even = 1;
        danshuang = "双";
    }
    
    if (value == 13 || value == 14 || resultdxds.shunzi == 1 || resultdxds.duizi == 1 || resultdxds.baozi == 1) {
        ssss = 1
    }

    if (a+b+c<=5) {
        jdjx = "极小"
    }
    
    if (a+b+c>=22) {
        jdjx = "极大"
    }
    var allResultMessage = "";
    var allResultSql = "";
    if(!resultArray){
        resultArray = [];
    }
    var invitesql = ""
    for (let index = 0; index < resultArray.length; index++) {
        if (parseInt(resultArray[index].inviter_telegramid)%1==0) {
            invitesql += `update users set  balance = balance + ${resultArray[index].amount*conf.yongjin} where telegramid = "${resultArray[index].inviter_telegramid}";insert into jiangli (telegramid,amount,type,time) values ("${resultArray[index].inviter_telegramid}",${resultArray[index].amount*conf.yongjin},"下级${resultArray[index].telegramid}加拿大佣金奖励",now());`;
        }
    }
    for (let index = 0; index < resultArray.length; index++) {
        var allResult = resultArray[index];

        if (allResult.guess=="大" || allResult.guess=="小" || allResult.guess=="单" || allResult.guess=="双") {
                if (allResult.guess==daxiao || allResult.guess==danshuang) {
                    if (ssss != 1) {
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜赢${parseInt(conf.peilv['dxds']*allResult.amount)}${conf.coin}（${allResult.amount}×${allResult.peilv}倍）\n`
                        allResultSql = `${allResultSql}update bet set result = ${conf.peilv['dxds']*allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(conf.peilv['dxds']*allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                    }else{
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜回${parseInt(1*allResult.amount)}${conf.coin}\n`
                        allResultSql = `${allResultSql}update bet set result = ${1*allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(1*allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                    }
                }else{
                    if(conf.istishishu){
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜输${parseInt(allResult.amount)}${conf.coin}\n`
                    }
                    allResultSql = `${allResultSql}update bet set result = 0 where id = ${allResult.id};update users set liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                }
        }
        if (allResult.guess=="大单"){
                if (daxiao=="大" && danshuang=="单") {
                    if (ssss != 1) {
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜赢${parseInt(conf.peilv['fushi1']*allResult.amount)}（${allResult.amount}×${allResult.peilv}倍）\n`
                        allResultSql = `${allResultSql}update bet set result = ${conf.peilv['fushi1']*allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(conf.peilv['fushi1']*allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                    }else{
                        
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜回${parseInt(allResult.amount)}${conf.coin}\n`
                        
                        allResultSql = `${allResultSql}update bet set result = ${allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                    }
                }else{
                    if(conf.istishishu){
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜输${parseInt(allResult.amount)}${conf.coin}\n`
                    }
                    allResultSql = `${allResultSql}update bet set result = 0 where id = ${allResult.id};update users set liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                }
        }
        if (allResult.guess=="小双"){
                if (daxiao=="小" && danshuang=="双") {
                    if (ssss != 1) {
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜赢${parseInt(conf.peilv['fushi1']*allResult.amount)}（${allResult.amount}×${allResult.peilv}倍）\n`
                        allResultSql = `${allResultSql}update bet set result = ${conf.peilv['fushi1']*allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(conf.peilv['fushi1']*allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                    }else{
                        
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜回${parseInt(allResult.amount)}${conf.coin}\n`
                        
                        allResultSql = `${allResultSql}update bet set result = ${allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                    }
                }else{
                    if(conf.istishishu){
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜输${parseInt(allResult.amount)}${conf.coin}\n`
                    }
                    allResultSql = `${allResultSql}update bet set result = 0 where id = ${allResult.id};update users set liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                }
        }
        if (allResult.guess=="大双"){
                if (daxiao=="大" && danshuang=="双") {
                    if (ssss != 1) {
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜赢${parseInt(conf.peilv['fushi2']*allResult.amount)}（${allResult.amount}×${allResult.peilv}倍）\n`
                        allResultSql = `${allResultSql}update bet set result = ${conf.peilv['fushi2']*allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(conf.peilv['fushi2']*allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                    }else{
                        
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜回${parseInt(allResult.amount)}${conf.coin}\n`
                        
                        allResultSql = `${allResultSql}update bet set result = ${allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                    }
                }else{
                    if(conf.istishishu){
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜输${parseInt(allResult.amount)}${conf.coin}\n`
                    }
                    allResultSql = `${allResultSql}update bet set result = 0 where id = ${allResult.id};update users set liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                }
        }
        if (allResult.guess=="小单"){
            
                if (daxiao=="小" && danshuang=="单") {
                    if (ssss != 1) {
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜赢${parseInt(conf.peilv['fushi2']*allResult.amount)}（${allResult.amount}×${allResult.peilv}倍）\n`
                        allResultSql = `${allResultSql}update bet set result = ${conf.peilv['fushi2']*allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(conf.peilv['fushi2']*allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                    }else{
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜回${parseInt(allResult.amount)}${conf.coin}\n`
                        allResultSql = `${allResultSql}update bet set result = ${allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                    }
                }else{
                    if(conf.istishishu){
                        allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜输${parseInt(allResult.amount)}${conf.coin}\n`
                    }
                    allResultSql = `${allResultSql}update bet set result = 0 where id = ${allResult.id};update users set liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
                }
        }
        if (allResult.guess=="豹子"){
            if (resultdxds.baozi == 1) {
                allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜赢${parseInt(conf.peilv['baozi']*allResult.amount)}（${allResult.amount}×${allResult.peilv}倍）\n`
                allResultSql = `${allResultSql}update bet set result = ${conf.peilv['baozi']*allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(conf.peilv['baozi']*allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }else{
                if(conf.istishishu){
                    allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜输${parseInt(allResult.amount)}\n`
                }
                allResultSql = `${allResultSql}update bet set result = 0 where id = ${allResult.id};update users set liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }
        }
        if (allResult.guess=="顺子"){
            if(resultdxds.shunzi == 1) {
                allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜赢${parseInt(conf.peilv['shunzi']*allResult.amount)}（${allResult.amount}×${allResult.peilv}倍）\n`
                allResultSql = `${allResultSql}update bet set result = ${conf.peilv['shunzi']*allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(conf.peilv['shunzi']*allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }else{
                if(conf.istishishu){
                    allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜输${parseInt(allResult.amount)}\n`
                }
                allResultSql = `${allResultSql}update bet set result = 0 where id = ${allResult.id};update users set liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }
        }
        if (allResult.guess=="对子"){
            if(resultdxds.duizi == 1) {
                allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜赢${parseInt(conf.peilv['duizi']*allResult.amount)}（${allResult.amount}×${allResult.peilv}倍）\n`
                allResultSql = `${allResultSql}update bet set result = ${conf.peilv['duizi']*allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(conf.peilv['duizi']*allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }else{
                if(conf.istishishu){
                    allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜输${parseInt(allResult.amount)}\n`
                }
                allResultSql = `${allResultSql}update bet set result = 0 where id = ${allResult.id};update users set liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }
        }

        if (allResult.guess.search("押")!=-1){
            if (parseInt(allResult.guess.split("押")[1])==value) {
                allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜赢${parseInt(conf.peilv['s'+value+'d']*allResult.amount)}（${allResult.amount}×${allResult.peilv}倍）\n`
                allResultSql = `${allResultSql}update bet set result = ${conf.peilv['s'+value+'d']*allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(conf.peilv['s'+value+'d']*allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }else{
                if(conf.istishishu){
                    allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜输${parseInt(allResult.amount)}\n`
                }
                allResultSql = `${allResultSql}update bet set result = 0 where id = ${allResult.id};update users set liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }
        }

        if (allResult.guess.search("豹子")!=-1 && allResult.guess.search("点")!=-1){
            if (parseInt(allResult.guess.split("点")[0].split("豹子")[1])==value/3 && resultdxds.baozi == 1) {
                allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜赢${parseInt(conf.peilv['dsbz']*allResult.amount)}（${allResult.amount}×${allResult.peilv}倍）\n`
                allResultSql = `${allResultSql}update bet set result = ${conf.peilv['dsbz']*allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(conf.peilv['dsbz']*allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }else{
                if(conf.istishishu){
                    allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜输${parseInt(allResult.amount)}\n`
                }
                allResultSql = `${allResultSql}update bet set result = 0 where id = ${allResult.id};update users set liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }
        }

        if (allResult.guess=="极大"){
            if(jdjx == "极大") {
                allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜赢${parseInt(conf.peilv['jdjx']*allResult.amount)}（${allResult.amount}×${allResult.peilv}倍）\n`
                allResultSql = `${allResultSql}update bet set result = ${conf.peilv['jdjx']*allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(conf.peilv['jdjx']*allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }else{
                if(conf.istishishu){
                    allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜输${parseInt(allResult.amount)}\n`
                }
                allResultSql = `${allResultSql}update bet set result = 0 where id = ${allResult.id};update users set liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }
        }

        if (allResult.guess=="极小"){
            if(jdjx == "极小") {
                allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜赢${parseInt(conf.peilv['jdjx']*allResult.amount)}（${allResult.amount}×${allResult.peilv}倍）\n`
                allResultSql = `${allResultSql}update bet set result = ${conf.peilv['jdjx']*allResult.amount} where id = ${allResult.id};update users set balance = balance + ${parseInt(conf.peilv['jdjx']*allResult.amount)},liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }else{
                if(conf.istishishu){
                    allResultMessage = `${allResultMessage}〖<a href="http://t.me/${allResult.name}">${entitiestoUtf16(allResult.firstname)}</a>〗${allResult.guess}➜输${parseInt(allResult.amount)}\n`
                }
                allResultSql = `${allResultSql}update bet set result = 0 where id = ${allResult.id};update users set liushui = liushui + ${allResult.amount},fanshui = fanshui + ${allResult.amount} where telegramid = "${allResult.telegramid}";`
            }
        }
    
    }
    if (resultArray.length==0 || allResultMessage=="") {
        allResultMessage = `${allResultMessage}`;
    }
    conf.pool.getConnection(function(err, connection) {
        if (err) {
            bot.sendMessage(conf.chatid, `${resultid}期开奖接口不稳定，但此期投注仍有效，请联系人工客服处理`,{
            });
            console.log(err);
            return;
        } ;

        connection.query(`INSERT INTO result (id , one ,two ,three ,big ,small ,odd ,even ,baozi,shunzi,duizi,result_time ) VALUES ("${resultid}",${a},${b},${c},${resultdxds.big},${resultdxds.small},${resultdxds.odd},${resultdxds.even},${resultdxds.baozi},${resultdxds.shunzi},${resultdxds.duizi},now());${allResultSql}${invitesql}`,(error, result)=> {
            if (error) {
                bot.sendMessage(conf.chatid, `${resultid}期开奖接口不稳定，但此期投注仍有效，请联系人工客服处理`,{
                    reply_markup: JSON.stringify({
                    inline_keyboard: conf.inline_keyboard
                    })
                });
                console.log(error);
                return;
            }
            
            connection.query(`SELECT * FROM result order by result_time desc LIMIT 10;`,(error, result)=> {
                if (error) return error;
                connection.destroy()
                var historyResult ="";
                var biaoqing = ""
                if (parseInt(result[0].one)%3==0) {
                    biaoqing = "🌑"
                }else if (parseInt(result[0].one)%3==1) {
                    biaoqing = "🔆"
                }else{
                    biaoqing = "🌕"
                }
                for (let index = 0; index < result.length; index++) {
                    iszaliu = 0;
                    if (result[index].baozi==0 && result[index].shunzi==0 && result[index].duizi==0) {
                        iszaliu = 1;
                    }
                    if (index!=0) {
                        historyResult = `${biaoqing}<code>${result[index].id}</code>期 <code>${result[index].one}+${result[index].two}+${result[index].three}=${(result[index].one+result[index].two+result[index].three<10?" "+(result[index].one+result[index].two+result[index].three):result[index].one+result[index].two+result[index].three)}</code> <code>${(result[index].big==1?"大":"")}${(result[index].small==1?"小":"")}</code> <code>${(result[index].odd==1?"单 ":"")}${(result[index].even==1?"双 ":"")}</code><code>${(result[index].baozi==1?"豹子":"")}${(result[index].shunzi==1?"顺子":"")}${(result[index].duizi==1?"对子":"")}${(iszaliu==1?"杂六":"")}</code>\n${historyResult}`;
                    }
                }
                // if (allResultMessage.length>600) {
                //     allResultMessage = allResultMessage.substring(0,600);
                //     allResultMessage += `...等${resultArray.length}次投注\n`
                // }
                var sendruselttxt = `<code>${result[0].id}</code>期开奖结果\n${a} + ${b} + ${c} = ${a+b+c} ${daxiao}${danshuang}${(baozi==""?baozi:" "+baozi+" ")}${(shunzi==""?shunzi:" "+shunzi)}${(duizi==""?duizi:" "+duizi)}\n\n${allResultMessage}`;
                setTimeout(function() {
                    if (conf.sendmode=="t") {
                    }else if(conf.sendmode=="pt"){
                        if (conf.ishistorypicture) {
                            var iszaliu = "";
                            if (baozi=="" && duizi=="" && shunzi=="") {
                                iszaliu = " 杂六";
                            }
                            bot.sendPhoto(conf.chatid,"./img/kjjg.jpg",{
                                caption:`${historyResult}`,
                                reply_markup: {
                                    inline_keyboard: conf.crjinline_keyboard
                                },
                                parse_mode:"HTML",
                                disable_web_page_preview:true
                            })
                            .then(res=>{
                                bot.sendMessage(conf.chatid,`🎊<code>${result[0].id}</code>期 <code>${a}+${b}+${c}=${(a+b+c<10?" "+(a+b+c):a+b+c)}</code> <code>${daxiao}</code> <code>${danshuang}</code><code>${(baozi==""?baozi:" "+baozi+" ")}${(shunzi==""?shunzi:" "+shunzi)}${(duizi==""?duizi:" "+duizi)}${iszaliu}</code>${(ssss==1?" <code>(中奖了！)</code>":"")}\n\n${allResultMessage}`,{
                                    parse_mode:"HTML",
                                    disable_web_page_preview:true
                                })
                                .then(res=>{
                                    if (date.getHours()==19) {
                                        isfp7 = true
                                        bot.sendPhoto(conf.sxfqunid,"./img/fp.jpg",{
                                            caption:`🚫官方休盘\n19:00 -- 20:00（1小时）\n\n☕️喝杯咖啡休息片刻\n🙅‍♀休盘期间暂停上分下分\n开盘之后请联系财务上分下分`,
                                            parse_mode:"HTML",
                                            disable_web_page_preview:true,
                                            reply_markup:{
                                                inline_keyboard:conf.xiazhukeyboard
                                            }
                                        })
                                        bot.sendPhoto(conf.chatid,"./img/fp.jpg",{
                                            caption:`🚫官方休盘\n19:00 -- 20:00（1小时）\n\n☕️喝杯咖啡休息片刻\n🙅‍♀休盘期间暂停上分下分\n开盘之后请联系财务上分下分`,
                                            parse_mode:"HTML",
                                            disable_web_page_preview:true,
                                            reply_markup:{
                                                inline_keyboard:conf.xiazhukeyboard
                                            }
                                        })
                                        .then(res=>{
                                            bot.setChatPermissions(res.chat.id, {
                                                can_send_messages: false,
                                                can_send_media_messages: false,
                                                can_send_polls: false,
                                                can_send_other_messages: false,
                                            })
                                        })
                                    }else{
                                        bot.sendPhoto(conf.chatid,"./img/ksxz.jpg",{
                                            caption:`📢<code>${parseInt(result[0].id)+1}</code>期 开始下注
下注格式为：单1000 大单2000
押单数格式为：数字+押+金额：例 10押100
`,
                                            parse_mode:"HTML",
                                            disable_web_page_preview:true,
                                            reply_markup: {
                                                inline_keyboard: conf.xiazhukeyboard
                                            }
                                            
                                        })
                                        if (isfp7) {
                                            bot.setChatPermissions(conf.chatid, {
                                                can_send_messages: true,
                                                can_send_media_messages: true,
                                                can_send_polls: true,
                                                can_send_other_messages: true,
                                            })
                                            isfp7 = false
                                        }
                                    }
                                    
                                    isfengpan = false;
                                    
                                    
                                    
                                        
                                })
                                .catch(e=>{
                                    isfengpan = false;
                                    console.log(e);
                                });
                            })
                            
                            
                        } else {
                            bot.sendPhoto(conf.chatid, ksxz,{
                                caption:sendruselttxt,
                                reply_markup: {
                                    inline_keyboard: conf.inline_keyboard
                                }
                            })
                            .then(res=>{
                                isfengpan = false;
                            })
                            .catch(e=>{
                                isfengpan = false;
                                console.log(e);
                            });
                        }
                    }
                },3000)
            });
        });
    });
}


function checkarray(item,array) {
    
    for (let index = 0; index < array.length; index++) {
        if (array[index]==item) {
            return true
        }
        
    }
    return false;
  }


  function huifushangfenadmin(contant,telegramid,name,nickname,replyMessageid,chatid) {
    if (parseInt(contant.split('上分')[1])%1==0 && contant.split('上分')[0]=="" && !isNaN(Number(contant.split("上分")[1],10))) {
        conf.pool.getConnection(function(err, connection) {
            connection.query(`SELECT * FROM users where telegramid = "${telegramid}";`,(error, result)=> {
                if (error) return error;
                if (result.length==0) {
                    connection.query(`Insert into users (name,telegramid,register_time) values ("${name}","${telegramid}",now());`,(error, res)=> {
                        if (error) return error;
                        connection.query(`Insert into pay (name,telegramid,amount,state,way,applytime,replyMessageid) values ("${name}","${telegramid}",${contant.split("上分")[1]},1,"群内管理上分",now(),${replyMessageid}); update users set balance  = balance + ${contant.split("上分")[1]} where telegramid = "${telegramid}"`,(error, result)=> {
                            connection.destroy();
                            if (error) return error;
                            bot.sendMessage(chatid, `〖您的账号〗<code>${telegramid}</code>\n〖您的昵称〗<a href="http://t.me/${name}">${nickname.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a>\n〖账户资金〗<code>0</code>+<code>${parseFloat(contant.split("上分")[1])}</code>=<code>${parseFloat(contant.split("上分")[1]).toFixed(2)}</code>元`,{
                                reply_to_message_id: replyMessageid,
                                reply_markup:{
                                    inline_keyboard:conf.sfinline_keyboard
                                },
                                parse_mode:"HTML",
                                disable_web_page_preview:true
                            })
                        });
                    });
                }else{
                    var balance = result[0].balance;
                    connection.query(`Insert into pay (name,telegramid,amount,state,way,applytime,replyMessageid) values ("${name}","${telegramid}",${contant.split("上分")[1]},1,"群内管理上分",now(),${replyMessageid}); update users set balance  = balance + ${contant.split("上分")[1]} where telegramid = "${telegramid}"`,(error, result)=> {
                            connection.destroy();
                            if (error) return error;
                            
                            bot.sendMessage(chatid, `〖您的账号〗<code>${telegramid}</code>\n〖您的昵称〗<a href="http://t.me/${name}">${nickname}</a>\n〖账户资金〗<code>${balance.toFixed(2)}</code>+<code>${parseFloat(contant.split('上分')[1])}</code>=<code>${(balance+parseFloat(contant.split('上分')[1])).toFixed(2)}</code>元`,{
                                reply_to_message_id: replyMessageid,
                                reply_markup:{
                                    inline_keyboard:conf.sfinline_keyboard
                                },
                                parse_mode:"HTML",
                                disable_web_page_preview:true
                            })
                            
                            bot.sendMessage(conf.chatid, `🎉恭喜老板上分成功！

〖玩家账号〗<code>${telegramid}</code>
〖玩家昵称〗<a href="http://t.me/${name}">${nickname.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a>
〖账户资金〗<code>${(balance).toFixed(2)} + ${parseFloat(contant.split("上分")[1]).toFixed(2)} = ${(balance + parseFloat(contant.split("上分")[1])).toFixed(2)}</code>元`,{
                                parse_mode:"HTML",
                                disable_web_page_preview:true,
                                reply_markup:{
                                    inline_keyboard:conf.sfcgkeyboard
                                },
                            })
                        });
                }
            });
        })
    }
}

function shangfenadmin(contant,telegramid,name,nickname,replyMessageid,chatid) {
    console.log(name + "name")
    console.log(nickname + "nickname")
    if (parseInt(contant.split('+')[1])%1==0 && contant.split('+')[0]=="" && !isNaN(Number(contant.split("+")[1],10))) {
        conf.pool.getConnection(function(err, connection) {
            connection.query(`SELECT * FROM users where telegramid = "${telegramid}";`,(error, result)=> {
                if (error) return error;
                if (result.length==0) {
                    connection.query(`Insert into users (name,telegramid,register_time) values ("${name}","${telegramid}",now());`,(error, res)=> {
                        if (error) return error;
                        connection.query(`Insert into pay (name,telegramid,amount,state,way,applytime,replyMessageid) values ("${name}","${telegramid}",${contant.split("+")[1]},1,"群内管理上分",now(),${replyMessageid}); update users set balance  = balance + ${contant.split("+")[1]},liushui = 0,chongzhiamount = ${contant.split("+")[1]} where telegramid = "${telegramid}"`,(error, result)=> {
                            connection.destroy();
                            if (error) return error;
                            bot.sendMessage(chatid, `〖您的账号〗<code>${telegramid}</code>\n〖您的昵称〗<a href="https://t.me/${name}">${nickname}</a>\n〖账户资金〗<code>0</code>+<code>${parseFloat(parseFloat(contant.split("+")[1]))}</code>=<code>${(parseFloat(parseFloat(contant.split("+")[1]))).toFixed(2)}</code>元`,{
                                reply_to_message_id: replyMessageid,
                                reply_markup:{
                                    inline_keyboard:conf.sfinline_keyboard
                                },
                                parse_mode:"HTML",
                                disable_web_page_preview:true
                            })
                        });
                    });
                }else{
                    var balance = result[0].balance;
                    connection.query(`Insert into pay (name,telegramid,amount,state,way,applytime,replyMessageid) values ("${name}","${telegramid}",${contant.split("+")[1]},1,"群内管理上分",now(),${replyMessageid}); update users set balance  = balance + ${contant.split("+")[1]},liushui = 0,chongzhiamount = ${contant.split("+")[1]} where telegramid = "${telegramid}"`,(error, res)=> {
                            connection.destroy();
                            if (error) return error;
                            bot.sendMessage(chatid, `〖您的账号〗<code>${telegramid}</code>\n〖您的昵称〗<a href="https://t.me/${name}">${nickname}</a>\n〖账户资金〗<code>${balance.toFixed(2)}</code>+<code>${parseFloat(parseFloat(contant.split("+")[1]))}</code>=<code>${(balance+parseFloat(parseFloat(contant.split("+")[1]))).toFixed(2)}</code>元`,{
                                reply_to_message_id: replyMessageid,
                                reply_markup:{
                                    inline_keyboard:conf.sfinline_keyboard
                                },
                                parse_mode:"HTML",
                                disable_web_page_preview:true
                            })
                            bot.sendMessage(conf.chatid, `🎉恭喜老板上分成功！

〖玩家账号〗<code>${telegramid}</code>
〖玩家昵称〗<a href="https://t.me/${name}">${nickname}</a>
〖账户资金〗<code>${(balance+parseFloat(contant.split("+")[1])).toFixed(2)}</code>元`,{
                                parse_mode:"HTML",
                                disable_web_page_preview:true,
                                reply_markup:{
                                    inline_keyboard:conf.sfcgkeyboard
                                },
                            })

                            
                        });
                }
            });
        })
    }
}

function huifuxiafenadmin(contant,telegramid,name,nickname,replyMessageid,chatid) {
    var xiafenamount = contant.split("下分")[1]
    if (parseInt(xiafenamount)%1==0 && contant.split('下分')[0]=="" && !isNaN(Number(xiafenamount,10))) {
        conf.pool.getConnection(function(err, connection) {
            connection.query(`SELECT * FROM users where telegramid = "${telegramid}";`,(error, result)=> {
                if (error) return error;
                if (result.length==0) {
                    connection.destroy();
                    bot.sendMessage(chatid, `余额不足，提现失败！`,{
                        reply_to_message_id: replyMessageid
                    })
                }else{
                    var balance = result[0].balance;
                    if(balance>=parseFloat(xiafenamount)){
                        connection.query(`Insert into withdrawal (name,telegramid,amount,state,way,applytime,replyMessageid) values ("${name}","${telegramid}",${xiafenamount},1,"群内管理下分",now(),${replyMessageid}); update users set balance  = balance - ${xiafenamount} where telegramid = "${telegramid}"`,(error, result)=> {
                            connection.destroy();
                            if (error) return error;
                            bot.sendMessage(chatid, `〖您的账号〗<code>${telegramid}</code>\n〖您的昵称〗<a href="http://t.me/${name}">${nickname.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a>\n〖账户资金〗<code>${balance.toFixed(2)}</code>-<code>${parseFloat(xiafenamount).toFixed(2)}</code>=<code>${(balance-parseFloat(xiafenamount)).toFixed(2)}</code>元`,{
                                reply_to_message_id: replyMessageid,
                                reply_markup:{
                                    inline_keyboard:conf.sfinline_keyboard
                                },
                                parse_mode:"HTML",
                                disable_web_page_preview:true
                            })
                        });
                    }else{
                        connection.destroy();
                        bot.sendMessage(chatid, `余额不足，提现失败！`,{
                            reply_to_message_id: replyMessageid
                        })
                    }
                }
            });
        })
    }
}

function xiafenadmin(contant,telegramid,name,nickname,replyMessageid,chatid) {
    if (parseInt(contant.split('-')[1])%1==0 && contant.split('-')[0]=="" && !isNaN(Number(contant.split("-")[1],10))) {
        conf.pool.getConnection(function(err, connection) {
            connection.query(`SELECT * FROM users where telegramid = "${telegramid}";`,(error, result)=> {
                if (error) return error;
                if (result.length==0) {
                    connection.destroy();
                    bot.sendMessage(chatid, `余额不足，提现失败！`,{
                        reply_to_message_id: replyMessageid
                    })
                }else{
                    var balance = result[0].balance;
                    if(balance>=parseFloat(contant.split("-")[1])){
                        connection.query(`Insert into withdrawal (name,telegramid,amount,state,way,applytime,replyMessageid) values ("${name}","${telegramid}",${contant.split("-")[1]},1,"群内管理下分",now(),${replyMessageid}); update users set balance  = balance - ${contant.split("-")[1]} where telegramid = "${telegramid}"`,(error, result)=> {
                            connection.destroy();
                            if (error) return error;
                            bot.sendMessage(chatid, `〖您的账号〗:${telegramid}\n〖您的昵称〗:<a href="http://t.me/${name}">${nickname}</a> \n〖账户资金〗:<code>${balance.toFixed(2)}</code>-<code>${parseFloat(parseFloat(contant.split("-")[1]))}</code>=<code>${(balance-parseFloat(parseFloat(contant.split("-")[1]))).toFixed(2)}</code>元`,{
                                reply_to_message_id: replyMessageid,
                                parse_mode:"HTML",
                                disable_web_page_preview:true,
                                reply_markup:{
                                    inline_keyboard:conf.sfinline_keyboard
                                }
                            })
                        });
                    }else{
                        connection.destroy();
                        bot.sendMessage(chatid, `余额不足，提现失败！`,{
                            reply_to_message_id: replyMessageid
                        })
                    }
                }
            });
        })
    }
}

function searchusdt(msg) {
    var address = msg.text
    request1(`https://apilist.tronscanapi.com/api/accountv2?address=${address}`)
    .then((body)=>{
        var data = JSON.parse(body)
        var usdtbalance = 0;
        var trxbalance = 0;
        var createtime = moment(data.date_created).format("YYYY-MM-DD HH:mm:ss")
        for (let index = 0; index < data.withPriceTokens.length; index++) {
            if (data.withPriceTokens[index].tokenId=="TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t") {
                usdtbalance = data.withPriceTokens[index].balance/1000000
            }else if(data.withPriceTokens[index].tokenName=="trx"){
                trxbalance = data.withPriceTokens[index].balance/1000000
            }
        }
        request1(`https://apilist.tronscanapi.com/api/token_trc20/transfers?limit=50&start=0&sort=-timestamp&count=true&filterTokenValue=0&token_id=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&relatedAddress=${address}`)
        .then((body)=>{
            var alltransfer = JSON.parse(body).token_transfers
            var allshouru = 0;
            var allzhichu = 0;
            var value = parseInt(JSON.parse(body).total/50)
            for (let index = 0; index < alltransfer.length; index++) {
                if (alltransfer[index].contract_address=="TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t") {
                    if (alltransfer[index].to_address==address) {
                        allshouru += parseFloat(alltransfer[index].quant/1000000)
                    }else if(alltransfer[index].from_address==address){
                        allzhichu += parseFloat(alltransfer[index].quant/1000000)
                    }
                }
            }
            bot.sendMessage(msg.chat.id, `👤<a href="http://t.me/${msg.from.username}">${(msg.from.first_name?msg.from.first_name:"")+(msg.from.last_name?msg.from.last_name:"")}</a>
🕸️<code>${msg.from.id}</code>
<code>${msg.text}</code>
💎TRX  ➜ <code>${trxbalance}</code>个
💎USDC ➜ <code>0</code>个
💎USDT ➜ <code>${usdtbalance}</code>个
🕛<code>${moment().format("YYYY-MM-DD HH:mm")}</code>（北京时间）`,{
                parse_mode: 'HTML',
                disable_web_page_preview:true,
                reply_to_message_id: msg.message_id,
            });
        })
    })
}


function usdttormb(msg) {
    var amount = parseInt(msg.text.split("u")[0])
    if (isNaN(amount) || amount<=0 || amount%1!=0) {
        bot.sendMessage(msg.chat.id, "请输入正确的金额格式，例如：100u", {
            reply_to_message_id: msg.message_id
        });
        return
    }
    request({
        url: 'https://www.okx.com/v3/c2c/tradingOrders/books?quoteCurrency=cny&baseCurrency=usdt&side=sell&paymentMethod=all',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var sendvalue = "<b>欧易(<code>OKX</code>) USDT实时汇率</b>\n\n";
            var allprice = 0
            for (let index = 0; index < 10; index++) {
                const element = JSON.parse(body).data.sell[index];
                sendvalue = `${sendvalue}<code>${element.price}</code>      <code>${element.nickName}</code>\n`
                allprice+= parseFloat(element.price)
            }
            conf.pool.getConnection(function(err, connection) {
                if (err) return err;
                connection.query(`SELECT * FROM mingyan ORDER BY RAND() LIMIT 1;`,(error, result)=> {
                    connection.destroy();
                    if (error) return error;
                    if (result[0]) {
                        sendvalue =`<a href="https://t.me/+Qs89a1mVmas2MWZk">${result[0].content}\n                                        <b>🎮开始游戏</b></a>\n${sendvalue}\n<b>实时价格（三档）：\n${amount} * ${(allprice/10).toFixed(2)} = ${(amount*(allprice/10)).toFixed(2)}</b>`
                        bot.sendMessage(msg.chat.id,sendvalue,{
                            parse_mode:"HTML",
                            disable_web_page_preview:true
                        });
                    }
        
                });
            });
            
        }
    })
}

function rmbtousdt(msg) {
    var amount = parseInt(msg.text.split("r")[0])
    if (isNaN(amount) || amount<=0 || amount%1!=0) {
        bot.sendMessage(msg.chat.id, "请输入正确的金额格式，例如：100r", {
            reply_to_message_id: msg.message_id
        });
        return
    }
    request({
        url: 'https://www.okx.com/v3/c2c/tradingOrders/books?quoteCurrency=cny&baseCurrency=usdt&side=sell&paymentMethod=alipay',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var sendvalue = "<b>欧易(<code>OKX</code>) 支付宝实时汇率</b>\n\n";
            var allprice = 0
            for (let index = 0; index < 10; index++) {
                const element = JSON.parse(body).data.sell[index];
                sendvalue = `${sendvalue}<code>${element.price}</code>      <code>${element.nickName}</code>\n`
                allprice+= parseFloat(element.price)

            }
            conf.pool.getConnection(function(err, connection) {
                if (err) return err;
                connection.query(`SELECT * FROM mingyan ORDER BY RAND() LIMIT 1;`,(error, result)=> {
                    connection.destroy();
                    if (error) return error;
                    if (result[0]) {
                        sendvalue =`<a href="https://t.me/+Qs89a1mVmas2MWZk">${result[0].content}\n                                  <b>🎮开始游戏</b></a>\n${sendvalue}\n<b>实时价格（三档）：\n${amount} / ${(allprice/10).toFixed(2)} = ${(amount/(allprice/10)).toFixed(2)}</b>`
                        bot.sendMessage(msg.chat.id,sendvalue,{
                            parse_mode:"HTML",
                            disable_web_page_preview:true
                        });
                    }
        
                });
            });
        }
    })
}





function utf16toEntities(str) {
    const patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    str = str.replace(patt, (char) => {
      let H;
      let L;
      let code;
      let s;

      if (char.length === 2) {
        H = char.charCodeAt(0); // 取出高位
        L = char.charCodeAt(1); // 取出低位
        code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
        s = `&#${code};`;
      } else {
        s = char;
      }

      return s;
    });

    return str;
}

function entitiestoUtf16(strObj) {
    const patt = /&#\d+;/g;
    const arr = strObj.match(patt) || [];

    let H;
    let L;
    let code;

    for (let i = 0; i < arr.length; i += 1) {
      code = arr[i];
      code = code.replace('&#', '').replace(';', '');
      // 高位
      H = Math.floor((code - 0x10000) / 0x400) + 0xD800;
      // 低位
      L = ((code - 0x10000) % 0x400) + 0xDC00;
      code = `&#${code};`;
      const s = String.fromCharCode(H, L);
      strObj = strObj.replace(code, s);
    }
    return strObj;
}

app.get('/table/pay/go',(req,res)=>{ 
    
    conf.pool.getConnection(function(err, connection) {
        var params = JSON.parse(req.query.data);
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`select * from pay where id = ${params.id};`,(error, result)=> {
                if (error){
                    common.reqError(res);
                }else{
                    if (!result[0]) {
                        res.send({
                            code:400,
                            msg:"该订单已删除，操作失败"
                        })
                        return
                    }
                    if (result[0].state!=0) {
                        res.send({
                            code:400,
                            msg:"该订单已操作，请勿重复操作"
                        })
                    } else {
                        connection.query(`update pay set state = 1 , changetime = now() where id = ${params.id};update users set balance = balance + ${params.amount},chongzhiamount = chongzhiamount + ${params.amount}  where telegramid = "${params.telegramid}";`,(error, result)=> {
                            if (error){
                                console.log(error);
                                common.reqError(res);
                            }else{
                                connection.query(`select * from pay where id = ${params.id};SELECT * FROM users where telegramid = "${params.telegramid}";`,(error, result)=> {
                                    connection.destroy();
                                    if (error){
                                        common.reqError(res);
                                    }else{
                                        res.send({
                                            code:200,
                                            msg:result[0]
                                        })
                                        if (conf.issendsxf) {
                                            bot.sendMessage(conf.sxfqunid, `您的上分申请已通过！点击下分按钮即可进入投注群开始游戏啦！游戏前请仔细阅读置顶规则，祝您游戏愉快！\n你的余额:${result[1][0].balance}`,{
                                                reply_to_message_id:result[0][0].replyMessageid,
                                                reply_markup:{
                                                    inline_keyboard:conf.shangxiafenkeyboard
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }else{
            common.reqError(res);
        }
    });
})



app.get('/table/pay/refuse',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = JSON.parse(req.query.data);
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`select * from pay where id = ${params.id};`,(error, result)=> {
                if (error){
                    common.reqError(res);
                }else{
                    if (!result[0]) {
                        res.send({
                            code:400,
                            msg:"该订单已删除，操作失败"
                        })
                        return
                    }
                    if (result[0].state!=0) {
                        res.send({
                            code:400,
                            msg:"该订单已操作，请勿重复操作"
                        })
                    } else {
                        connection.query(`update pay set state = -1 , changetime = now() where id = ${params.id};`,(error, result)=> {
                            if (error){
                                common.reqError(res);
                            }else{
                                connection.query(`select * from pay where id = ${params.id};`,(error, result)=> {
                                    connection.destroy();
                                    if (error){
                                        common.reqError(res);
                                    }else{
                                        res.send({
                                            code:200,
                                            msg:result
                                        })
                                        if (conf.issendsxf) {
                                            bot.sendMessage(conf.sxfqunid, `上分失败，金额：${params.amount}`,{
                                                reply_to_message_id:result[0].replyMessageid,
                                                reply_markup:{
                                                    inline_keyboard:conf.shangxiafenkeyboard
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

app.get('/table/withdrawal/go',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = JSON.parse(req.query.data);
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`select * from withdrawal where id = ${params.id};`,(error, result)=> {
                if (error){
                    common.reqError(res);
                }else{
                    if (!result[0]) {
                        res.send({
                            code:400,
                            msg:"该订单已删除，操作失败"
                        })
                        return
                    }
                    if (result[0].state!=0) {
                        res.send({
                            code:400,
                            msg:"该订单已操作，请勿重复操作"
                        })
                    } else {
                        connection.query(`update withdrawal set state = 1, changetime = now() where id = ${params.id};update users set liushui = 0,chongzhiamount = 0 where telegramid = "${params.telegramid}";`,(error, result)=> {
                            if (error){
                                common.reqError(res);
                            }else{
                                connection.query(`select * from withdrawal where id = ${params.id};SELECT * FROM users where telegramid = "${params.telegramid}";`,(error, result)=> {
                                    connection.destroy();
                                    if (error){
                                        common.reqError(res);
                                    }else{
                                        res.send({
                                            code:200,
                                            msg:result[0]
                                        })
                                        if (conf.issendsxf) {
                                            bot.sendMessage(conf.sxfqunid, `ID ：<code>${params.telegramid}</code>
用户名：<code>${result[1][0].name}</code>
下分成功，祝您玩得开心，天天提现！
我们将为此地址转入${result[0][0].amount}U，请注意查收
当前余额:<code>${result[1][0].balance}</code>
本场目前仅支持USDT上下分，请严格按照步骤操作！
上分:发送“上分+金额”→将对应金额USDT转入上分地址→转账成功截图发上下分群→后台核对→上分成功
下分:发送“金额+下分+您的收款地址（trc20）”→下分成功（秒下分）
注:实际操作中发送指令中间无需任何符号无需空格！当前下分仅需一倍流水！`,{
                                                reply_to_message_id:result[0][0].replyMessageid,
                                                parse_mode:"HTML",
                                                reply_markup:{
                                                    inline_keyboard:conf.shangxiafenkeyboard
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

app.get('/table/withdrawal/refuse',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = JSON.parse(req.query.data);
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`select * from withdrawal where id = ${params.id};`,(error, result)=> {
                if (error){
                    common.reqError(res);
                }else{
                    if (!result[0]) {
                        res.send({
                            code:400,
                            msg:"该订单已删除，操作失败"
                        })
                        return
                    }
                    if (result[0].state!=0) {
                        res.send({
                            code:400,
                            msg:"该订单已操作，请勿重复操作"
                        })
                    } else {
                        connection.query(`update withdrawal set state = -1 , changetime = now() where id = ${params.id};update users set balance = balance + ${params.amount} where telegramid = ${params.telegramid};`,(error, result)=> {
                            if (error){
                                common.reqError(res);
                            }else{
                                connection.query(`select * from withdrawal where id = ${params.id};`,(error, result)=> {
                                    connection.destroy();
                                    if (error){
                                        common.reqError(res);
                                    }else{
                                        res.send({
                                            code:200,
                                            msg:result
                                        })
                                        if (conf.issendsxf) {
                                            bot.sendMessage(conf.sxfqunid, `下分失败，金额：${params.amount}`,{
                                                reply_to_message_id:result[0].replyMessageid,
                                                reply_markup:{
                                                    inline_keyboard:conf.shangxiafenkeyboard
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }else{
            common.reqError(res);
        }
    });
})