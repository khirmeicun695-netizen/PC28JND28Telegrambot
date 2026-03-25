var express = require('express');
var mysql = require('mysql');
var TelegramBot = require('node-telegram-bot-api');
var moment = require('moment');
var conf = require('../config/conf');
var common = require('../config/common');

var route = express.Router();


route.get('/table/admin/insert',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = JSON.parse(req.query.data);
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`Insert into groupadmin (telegramid,time) values ("${params.telegramid}",now()) ;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:200,
                        msg:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/admin/delete',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`delete from groupadmin where  telegramid  = "${params.telegramid}";`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:200,
                        msg:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/admin/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`select * from groupadmin;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:200,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/admin/reload',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`select * from groupadmin;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/pay/insert',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = JSON.parse(req.query.data);
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM users where name = "${params.name}";`,(error, result)=> {
                if (error || result.length==0){
                    common.reqError(res);
                    return
                }
                connection.query(`Insert into pay (telegramid,name,amount,state,way,applytime,changetime) values ("${result[0].telegramid}","${params.name}",${params.amount},"1","${params.way}",now(),now()) ;update users set balance = balance + ${params.amount} where telegramid = ${result[0].telegramid};`,(error, result)=> {
                    connection.destroy();
                    if (error){
                        common.reqError(res);
                    }else{
                        res.send({
                            code:200,
                            msg:result
                        })
                    }
                });
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/pay/id/insert',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM users where telegramid = "${params.telegramid}";`,(error, result)=> {
                if (error || result.length==0){
                    common.reqError(res);
                    return
                }
                var chongtisql = ""
                var yongjinchisql =""
                if (params.amount>0) {
                    if (result[0].inviter_telegramid!="无邀请人") {
                        yongjinchisql = `update yongjinchi set amount = amount + ${parseInt(params.amount)*conf.yongjinchi};update users set zongyongjin = zongyongjin + ${parseInt(params.amount)*conf.zongyongjinbili} where telegramid = "${result[0].inviter_telegramid}";`
                    }
                    chongtisql = `Insert into pay (telegramid,name,amount,state,way,applytime,changetime) values ("${result[0].telegramid}","${result[0].name}",${params.amount},"1","${params.way}",now(),now()) ;update users set balance = balance + ${params.amount},chongzhiamount = chongzhiamount + ${params.amount},lastpay_time = now(),todaychongzhi = todaychongzhi + ${params.amount} where telegramid = ${result[0].telegramid};`
                } else {
                    chongtisql = `Insert into withdrawal (telegramid,name,amount,state,way,applytime,changetime) values ("${result[0].telegramid}","${result[0].name}",${params.amount},"1","${params.way}",now(),now()) ;update users set balance = balance ${params.amount},liushui = 0,chongzhiamount = 0 where telegramid = ${result[0].telegramid};`
                }
                
                connection.query(chongtisql+yongjinchisql,(error, result)=> {
                    console.log(error);
                    connection.destroy();
                    if (error){
                        common.reqError(res);
                    }else{
                        res.send({
                            code:200,
                            msg:result
                        })
                    }
                });
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/qiangkou/pay/id/insert',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM users where telegramid = "${params.telegramid}";`,(error, result)=> {
                if (error || result.length==0){
                    common.reqError(res);
                    return
                }
                var chongtisql = ""
                if (params.amount>0) {
                    chongtisql = `Insert into pay (telegramid,name,amount,state,way,applytime,changetime) values ("${result[0].telegramid}","${result[0].name}",${params.amount},"1","${params.way}",now(),now()) ;update users set balance = balance + ${params.amount},lastpay_time = now(),todaychongzhi = todaychongzhi + ${params.amount} where telegramid = ${result[0].telegramid};`
                } else {
                    chongtisql = `Insert into withdrawal (telegramid,name,amount,state,way,applytime,changetime) values ("${result[0].telegramid}","${result[0].name}",${params.amount},"1","${params.way}",now(),now()) ;update users set balance = balance ${params.amount} where telegramid = ${result[0].telegramid};`
                }
                connection.query(chongtisql,(error, result)=> {
                    console.log(error);
                    connection.destroy();
                    if (error){
                        common.reqError(res);
                    }else{
                        res.send({
                            code:200,
                            msg:result
                        })
                    }
                });
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/seven/pay',(req,res)=>{ 
    var params = req.query;
    conf.pool.getConnection(function(err, connection) {
        connection.query(`SELECT sum(amount) FROM pay where telegramid = "${params.telegramid}" and applytime > "${moment(Math.round(new Date())-1000*60*60*24*7).format("YYYY-MM-DD HH:mm:ss")}";`,(error, result)=> {
            if (error) return error;
            res.send({
                code:200,
                msg:(result[0]['sum(amount)']?result[0]['sum(amount)']:0)
            })
        });
    })
})

route.get('/table/yongjin/pay/id/insert',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM users where telegramid = "${params.telegramid}";`,(error, result)=> {
                if (error || result.length==0){
                    common.reqError(res);
                    return
                }
                if (params.amount>0){
                    connection.query(`Insert into withdrawal (telegramid,name,amount,state,way,applytime,changetime) values ("${result[0].telegramid}","${result[0].name}",${params.amount},"1","${params.way}",now(),now()) ;update users set yongjinbalance = yongjinbalance - ${params.amount} where telegramid = "${result[0].telegramid}";`,(error, result)=> {
                        console.log(error);
                        connection.destroy();
                        if (error){
                            common.reqError(res);
                        }else{
                            res.send({
                                code:200,
                                msg:result
                            })
                        }
                    });
                }else{
                    res.send({
                        code:400,
                    })
                }
               
            });
        }else{
            common.reqError(res);
        }
    });
})



route.get('/table/pay/apply',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM pay where state = 0 and way = "群内上分" order by id desc;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})


route.get('/table/pay/apply/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM pay where ${params.key} = "${params.value}" AND state = 0;`,(error, result)=> {
                if (error){
                    common.reqError(res);
                    connection.destroy();
                }else{
                    var count = result.length;
                    connection.query(`SELECT * FROM pay where ${params.key} = "${params.value}" and state = 0  and way = "群内上分" order by id desc limit ${(params.page-1)*params.limit} , ${params.limit};`,(error, result)=> {
                        connection.destroy();
                        if (error){
                            common.reqError(res);
                        }else{
                            res.send({
                                code:0,
                                msg:"",
                                count:count,
                                data:result
                            })
                        }
                    });
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/pay/cancelall',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`Update pay set state = "-1",changetime = now() WHERE state = "0" and way = "群内上分";`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:200,
                        msg:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/pay/update',(req,res)=>{ 
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
                            msg:"该订单已删除，编辑失败"
                        })
                    } else {
                        connection.query(`Update pay set telegramid = "${params.telegramid}",name = "${params.name}",amount = ${params.amount},way = "${params.way}",applytime = "${params.applytime}" WHERE id = ${params.id};`,(error, result)=> {
                            connection.destroy();
                            if (error){
                                common.reqError(res);
                            }else{
                                res.send({
                                    code:200,
                                    msg:result
                                })
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

route.get('/table/pay/delete',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
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
                            msg:"该订单已操作，请勿重复操作"
                        })
                    } else {
                        connection.query(`DELETE FROM pay WHERE id = ${params.id};`,(error, result)=> {
                            connection.destroy();
                            if (error){
                                common.reqError(res);
                            }else{
                                res.send({
                                    code:200,
                                    msg:result
                                })
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

route.get('/table/pay/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM pay where ${params.key} = "${params.value}";`,(error, result)=> {
                if (error){
                    common.reqError(res);
                    connection.destroy();                    
                }else{
                    var count = result.length;
                    connection.query(`SELECT * FROM pay where ${params.key} = "${params.value}" order by id desc limit ${(params.page-1)*params.limit} , ${params.limit};`,(error, result)=> {
                        connection.destroy();
                        if (error){
                            common.reqError(res);
                        }else{
                            res.send({
                                code:0,
                                msg:"",
                                count:count,
                                data:result
                            })
                        }
                    });
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/pay',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM pay order by id desc limit 100;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})
/***************withdrawal****************** */
route.get('/table/withdrawal/insert',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = JSON.parse(req.query.data);
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM users where name = "${params.name}";`,(error, result)=> {
                if (error || result.length==0){
                    common.reqError(res);
                    return
                }
                connection.query(`Insert into withdrawal (telegramid,name,amount,state,way,applytime,changetime) values ("${result[0].telegramid}","${params.name}",${params.amount},"1","${params.way}",now(),now()) ;update users set balance = balance - ${params.amount} where telegramid = ${result[0].telegramid}`,(error, result)=> {
                    connection.destroy();
                    if (error){
                        common.reqError(res);
                    }else{
                        res.send({
                            code:200,
                            msg:result
                        })
                    }
                });
            });
        }else{
            common.reqError(res);
        }
    });
})



route.get('/table/withdrawal/apply',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM withdrawal where state = 0 and way = "群内下分" order by id desc;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})
route.get('/table/withdrawal/apply/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM withdrawal where ${params.key} = "${params.value}" AND state = 0;`,(error, result)=> {
                if (error){
                    common.reqError(res);
                    connection.destroy();                    
                }else{
                    var count = result.length;
                    connection.query(`SELECT * FROM withdrawal where ${params.key} = "${params.value}" and state = 0 and way = "群内下分" order by id desc limit ${(params.page-1)*params.limit} , ${params.limit};`,(error, result)=> {
                        connection.destroy();
                        if (error){
                            common.reqError(res);
                        }else{
                            res.send({
                                code:0,
                                msg:"",
                                count:count,
                                data:result
                            })
                        }
                    });
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/withdrawal/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM withdrawal where ${params.key} = "${params.value}";`,(error, result)=> {
                if (error){
                    common.reqError(res);
                    connection.destroy();                    
                }else{
                    var count = result.length;
                    connection.query(`SELECT * FROM withdrawal where ${params.key} = "${params.value}" order by id desc limit ${(params.page-1)*params.limit} , ${params.limit};`,(error, result)=> {
                        connection.destroy();
                        if (error){
                            common.reqError(res);
                        }else{
                            res.send({
                                code:0,
                                msg:"",
                                count:count,
                                data:result
                            })
                        }
                    });
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/withdrawal/liushuichaxun',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = JSON.parse(req.query.data);
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT SUM(amount) FROM bet WHERE name = "${params.name}" AND time > "${params.applytime}";`,(error, result)=> {
                if (error){
                    common.reqError(res);
                    connection.destroy();                    
                }else{
                    res.send({
                        code:1,
                        msg:"",
                        count:1,
                        data:result[0]['SUM(amount)']
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/withdrawal/update',(req,res)=>{ 
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
                            msg:"该订单已删除，编辑失败"
                        })
                    } else {
                        connection.query(`Update withdrawal set telegramid = "${params.telegramid}",name = "${params.name}",amount = ${params.amount},way = "${params.way}",applytime = "${params.applytime}" WHERE id = ${params.id};`,(error, result)=> {
                            connection.destroy();
                            if (error){
                                common.reqError(res);
                            }else{
                                res.send({
                                    code:200,
                                    msg:result
                                })
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

route.get('/table/withdrawal/delete',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
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
                            msg:"该订单已操作，请勿重复操作"
                        })
                    } else {
                        connection.query(`DELETE FROM withdrawal WHERE id = ${params.id};`,(error, result)=> {
                            connection.destroy();
                            if (error){
                                common.reqError(res);
                            }else{
                                res.send({
                                    code:200,
                                    msg:result
                                })
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

route.get('/table/withdrawal',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM withdrawal order by id desc limit 100;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/users',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM users order by balance desc;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/users/update',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = JSON.parse(req.query.data);
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`Update users set inviter_telegramid = "${params.inviter_telegramid}",zhouyongjin = "${params.zhouyongjin}",zongyongjin = ${params.zongyongjin},yongjinbalance = ${params.yongjinbalance} WHERE id = ${params.id};`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:200,
                        msg:result
                    })
                }
            });
            
        }else{
            common.reqError(res);
        }
    });
})


route.get('/table/users/ban',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query
        connection.query(`select * from users where id = "${params.id}";
        select * from users where inviter_telegramid = "${params.inviter_telegramid}";
        select sum(amount) from bet where telegramid = "${params.telegramid}";
        select sum(amount) from jndbet where telegramid = "${params.telegramid}";
        select sum(amount) from pcbet where telegramid = "${params.telegramid}";
        select sum(amount) from klsfbet where telegramid = "${params.telegramid}";`,(error, result)=> {
            connection.destroy();
            if (result[1][0]) {
                var kouchuyongjin = (result[2][0]["sum(amount)"]+result[3][0]["sum(amount)"]+result[4][0]["sum(amount)"]+result[5][0]["sum(amount)"])*0.01
                console.log(kouchuyongjin);
                conf.pool.getConnection(function(err, connection) {
                    connection.query(`update yongjinchi set amount = amount - ${result[0][0].yongjinchiedu};
                    update users set inviter_telegramid = "无邀请人",yongjinchiedu = 0 where telegramid = "${result[0][0].telegramid}";
                    update users set zhouyongjin = zhouyongjin - ${kouchuyongjin},yongjinbalance = yongjinbalance - ${kouchuyongjin},zongyongjin = zongyongjin - ${result[0][0].yongjinchiedu} where telegramid = "${params.inviter_telegramid}";`,(error, result)=> {
                        connection.destroy();
                        if (error){
                            common.reqError(res);
                        }else{
                            res.send({
                                code:200,
                                msg:"success",
                            })
                        }
                    });
                });
            }
        });
    });
})

route.get('/table/users/chongti',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = JSON.parse(req.query.data);
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT SUM(amount) FROM pay WHERE telegramid = "${params.telegramid}" AND applytime >= "${params.time}" and state = 1;SELECT SUM(amount) FROM withdrawal WHERE telegramid = "${params.telegramid}" AND applytime >= "${params.time}" and state = 1;`,(error, result)=> {
                connection.destroy();
                if (error){
                    
                    common.reqError(res);
                }else{
                    var cz;
                    if (result[0][0]['SUM(amount)']==null) {
                        cz = 0.00;
                    }else{
                        cz = result[0][0]['SUM(amount)'];
                    }
                    var tx;
                    if (result[1][0]['SUM(amount)']==null) {
                        tx = 0.00;
                    }else{
                        tx = result[1][0]['SUM(amount)'];
                    }
                    res.send({
                        code:1,
                        msg:"",
                        count:2,
                        data:{
                            cz,
                            tx
                        }
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/users/shuying',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = JSON.parse(req.query.data);
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT SUM(result),SUM(amountreturn),SUM(amount) FROM bet WHERE name = "${params.name}" AND time >= "${params.time}";`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    if (!result[0]['SUM(amount)']) {
                        var tz = 0.00;
                        var fs = 0.00;
                        var jj = 0.00;
                        var sy = 0.00;
                    }else{
                        var tz = result[0]['SUM(amount)'];
                        var fs = result[0]['SUM(amountreturn)'];
                        var jj = result[0]['SUM(result)'];
                        var sy = (result[0]['SUM(result)']+result[0]['SUM(amountreturn)']-result[0]['SUM(amount)']).toFixed(2);
                    }
                    res.send({
                        code:1,
                        msg:"",
                        count:4,
                        data:{
                            tz,
                            fs,
                            jj,
                            sy
                        }
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/users/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM users where ${params.key} = "${params.value}";`,(error, result)=> {
                var count = result.length;
                connection.query(`SELECT * FROM users where ${params.key} = "${params.value}" order by id desc limit ${(params.page-1)*params.limit} , ${params.limit};`,(error, result)=> {
                    connection.destroy();
                    if (error){
                        common.reqError(res);
                    }else{
                        res.send({
                            code:0,
                            msg:"",
                            count:count,
                            data:result
                        })
                    }
                });
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/jnd20bet',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM jndbet order by id desc limit 100;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/jnd20bet/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM jndbet where ${params.key} = "${params.value}";`,(error, result)=> {
                var count = result.length;
                connection.query(`SELECT * FROM jndbet where ${params.key} like "%${params.value}%" order by id desc limit ${(params.page-1)*params.limit} , ${params.limit};`,(error, result)=> {
                    connection.destroy();
                    if (error){
                        common.reqError(res);
                    }else{
                        res.send({
                            code:0,
                            msg:"",
                            count:count,
                            data:result
                        })
                    }
                });
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/jnd28bet',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM bet order by id desc limit 100;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/jnd28bet/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM bet where ${params.key} = "${params.value}";`,(error, result)=> {
                var count = result.length;
                connection.query(`SELECT * FROM bet where ${params.key} like "%${params.value}%" order by id desc limit ${(params.page-1)*params.limit} , ${params.limit};`,(error, result)=> {
                    connection.destroy();
                    if (error){
                        common.reqError(res);
                    }else{
                        res.send({
                            code:0,
                            msg:"",
                            count:count,
                            data:result
                        })
                    }
                });
            });
        }else{
            common.reqError(res);
        }
    });
})


route.get('/table/klsfbet',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM klsfbet order by id desc limit 100;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/bet',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM bet order by id desc limit 100;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/klsfbet/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM klsfbet where ${params.key} = "${params.value}";`,(error, result)=> {
                var count = result.length;
                connection.query(`SELECT * FROM klsfbet where ${params.key} like "%${params.value}%" order by id desc limit ${(params.page-1)*params.limit} , ${params.limit};`,(error, result)=> {
                    connection.destroy();
                    if (error){
                        common.reqError(res);
                    }else{
                        res.send({
                            code:0,
                            msg:"",
                            count:count,
                            data:result
                        })
                    }
                });
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/bet/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM bet where ${params.key} = "${params.value}";`,(error, result)=> {
                var count = result.length;
                connection.query(`SELECT * FROM bet where ${params.key} like "%${params.value}%" order by id desc limit ${(params.page-1)*params.limit} , ${params.limit};`,(error, result)=> {
                    connection.destroy();
                    if (error){
                        common.reqError(res);
                    }else{
                        res.send({
                            code:0,
                            msg:"",
                            count:count,
                            data:result
                        })
                    }
                });
            });
        }else{
            common.reqError(res);
        }
    });
})


route.get('/table/jndresult',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM result order by result_time desc limit 100;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/jndresult/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM result where ${params.key} = "${params.value}";`,(error, result)=> {
                var count = result.length;
                connection.query(`SELECT * FROM result where ${params.key} = "${params.value}" order by result_time desc limit ${(params.page-1)*params.limit} , ${params.limit};`,(error, result)=> {
                    connection.destroy();
                    if (error){
                        common.reqError(res);
                    }else{
                        res.send({
                            code:0,
                            msg:"",
                            count:count,
                            data:result
                        })
                    }
                });
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/klsfresult',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM klsfresult order by result_time desc limit 100;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/klsfresult/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM klsfresult where ${params.key} = "${params.value}";`,(error, result)=> {
                var count = result.length;
                connection.query(`SELECT * FROM klsfresult where ${params.key} = "${params.value}" order by result_time desc limit ${(params.page-1)*params.limit} , ${params.limit};`,(error, result)=> {
                    connection.destroy();
                    if (error){
                        common.reqError(res);
                    }else{
                        res.send({
                            code:0,
                            msg:"",
                            count:count,
                            data:result
                        })
                    }
                });
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/result',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM result order by result_time desc limit 100;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/result/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM result where ${params.key} = "${params.value}";`,(error, result)=> {
                var count = result.length;
                connection.query(`SELECT * FROM result where ${params.key} = "${params.value}" order by result_time desc limit ${(params.page-1)*params.limit} , ${params.limit};`,(error, result)=> {
                    connection.destroy();
                    if (error){
                        common.reqError(res);
                    }else{
                        res.send({
                            code:0,
                            msg:"",
                            count:count,
                            data:result
                        })
                    }
                });
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/jiangli',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM jiangli order by time desc limit 100;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        code:0,
                        msg:"",
                        count:result.length,
                        data:result
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/table/jiangli/search',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM jiangli where ${params.key} = "${params.value}";`,(error, result)=> {
                var count = result.length;
                connection.query(`SELECT * FROM jiangli where ${params.key} = "${params.value}" order by time desc limit ${(params.page-1)*params.limit} , ${params.limit};`,(error, result)=> {
                    connection.destroy();
                    if (error){
                        common.reqError(res);
                    }else{
                        res.send({
                            code:0,
                            msg:"",
                            count:count,
                            data:result
                        })
                    }
                });
            });
        }else{
            common.reqError(res);
        }
    });
})

module.exports = route;