const express = require('express');
const mysql = require('mysql');
const conf = require('../config/conf');
const common = require('../config/common');

const route = express.Router();

route.get('/chart/jr',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT SUM(amount) FROM bet where time LIKE CONCAT(CURDATE(), '%');
            SELECT SUM(result),SUM(amountreturn) FROM bet where time LIKE CONCAT(CURDATE(), '%');
            SELECT COUNT(*) FROM bet where time LIKE CONCAT(CURDATE(), '%');
            SELECT COUNT(*) FROM users where register_time LIKE CONCAT(CURDATE(), '%');
            SELECT SUM(amount) FROM pay where applytime LIKE CONCAT(CURDATE(), '%') and state = 1;
            SELECT SUM(amount) FROM withdrawal where applytime LIKE CONCAT(CURDATE(), '%') and state = 1;
            SELECT COUNT(*) FROM pay where applytime LIKE CONCAT(CURDATE(), '%') and state = 0;
            SELECT COUNT(*) FROM withdrawal where applytime LIKE CONCAT(CURDATE(), '%') and state = 0;
            SELECT COUNT(*) FROM bet where time LIKE CONCAT(CURDATE(), '%') and result != 0;
            SELECT SUM(amount) FROM withdrawal WHERE state = 0;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        stateCode:200,
                        message:{
                            jrls:result[0][0]['SUM(amount)'],
                            jryl:result[0][0]['SUM(amount)']-result[1][0]['SUM(result)']-result[1][0]['SUM(amountreturn)'],
                            jrtzcs:result[2][0]['COUNT(*)'],
                            xzcwj:result[3][0]['COUNT(*)'],
                            jrcz:result[4][0]['SUM(amount)'],
                            jrtx:result[5][0]['SUM(amount)'],
                            dczczsq:result[6][0]['COUNT(*)'],
                            dcztxsq:result[7][0]['COUNT(*)'],
                            jrsl:result[8][0]['COUNT(*)']/result[2][0]['COUNT(*)'],
                            dtx:result[9][0]['SUM(amount)'],
                        }
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})

route.get('/chart/all',(req,res)=>{ 
    conf.pool.getConnection(function(err, connection) {
        var params = req.query;
        if(err){
            common.reqError(res);
        }else if(common.oc(req)){
            connection.query(`SELECT SUM(amount) FROM bet ;
            SELECT SUM(result),SUM(amountreturn) FROM bet;
            SELECT COUNT(*) FROM bet;
            SELECT COUNT(*) FROM users;
            SELECT SUM(amount) FROM pay where state = 1;
            SELECT SUM(amount) FROM withdrawal where state = 1;
            SELECT COUNT(*) FROM bet where result != 0;
            SELECT SUM(balance) FROM users;`,(error, result)=> {
                connection.destroy();
                if (error){
                    common.reqError(res);
                }else{
                    res.send({
                        stateCode:200,
                        message:{
                            jrls:result[0][0]['SUM(amount)'],
                            jryl:result[0][0]['SUM(amount)']-result[1][0]['SUM(result)']-result[1][0]['SUM(amountreturn)'],
                            jrtzcs:result[2][0]['COUNT(*)'],
                            xzcwj:result[3][0]['COUNT(*)'],
                            jrcz:result[4][0]['SUM(amount)'],
                            jrtx:result[5][0]['SUM(amount)'],
                            jrsl:result[6][0]['COUNT(*)']/result[2][0]['COUNT(*)'],
                            ye:result[7][0]['SUM(balance)'],
                        }
                    })
                }
            });
        }else{
            common.reqError(res);
        }
    });
})


module.exports = route;