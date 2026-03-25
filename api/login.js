const express = require('express');
const mysql = require('mysql');
const conf = require('../config/conf');
const common = require('../config/common');
const route = express.Router();



route.get('/login/username',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        
        var newToken = Math.random()*1000000000000000000;
        if(params.um=="" || params.pw==""){
            res.send({
                stateCode:403,
                message:"登录错误!"
            })
            return
        }
        if(err){
            common.reqError(res);
        }else if(common.od(req)){
            
            connection.query(`SELECT * FROM admin where username = '${params.un}'`,(error, result)=> {
                var userResult = result;
                
                if (error){
                    common.reqError(res);
                    
                } else if(userResult.length==0){
                    res.send({
                        stateCode:400,
                        message:"登录错误!"
                    })
                } else if(userResult[0].time_end<Math.floor(Date.now()/1000)){
                    res.send({
                        stateCode:400,
                        message:"账号过期!"
                    })
                } else if(userResult[0].password==params.pw){
                    var date = new Date();
                    var Y = date.getFullYear() ;
                    var M = date.getMonth() + 1 ;
                    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) ;
                    
                    var h = date.getHours();
                    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
                    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
                    var logintime = Y + '/'+ M+ '/' +D + ' '+h + ':'+m + ':'+s;
                    var value_checktimes = Y.toString() +M.toString() + D.toString();
                    connection.query(`UPDATE admin SET token = "${newToken}" where username = '${params.un}';`,(error, result)=> {
                        if (error){
                            common.reqError(res);
                            
                        } else{
                            
                            connection.destroy();
                            res.send({
                                stateCode:200,
                                message:{
                                    result:"登录成功！",
                                    token:newToken
                                }
                            })
                        }
                    });
                }else{
                    res.send({
                        stateCode:400,
                        message:"登录错误!"
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/login/check',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM admin where token = ${params.token};`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        stateCode:200,
                        message:result.length
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})


module.exports = route;