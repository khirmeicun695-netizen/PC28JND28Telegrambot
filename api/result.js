var express = require('express');
var mysql = require('mysql');
var conf = require('../config/conf');
var common = require('../config/common');

var route = express.Router();

route.get('/result',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        
        if(err || !params.m || !params.n){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT * FROM result order by id desc limit ${params.m} ,${params.n};`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                    return
                }
                res.send({
                    state:1,
                    msg:"success",
                    data:{
                        list:result
                    }
                })
            });
        }else{
            common.reqError(res);
        }
    });
})


module.exports = route;