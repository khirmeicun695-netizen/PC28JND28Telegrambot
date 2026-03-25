const mysql = require('mysql');

var common = {
    reqError(res) { //return错误状态
        return res.send({
            stateCode:400,
            message:"系统错误,请重试"
        })
    },
    oc(req) { //api验证函数
        /*pool.getConnection(function(err, connection) {
            connection.query(`SELECT * FROM userinfo where token = ${req.headers.token}`,(error, result)=> {
                if(error){
                    return false;
                }else if (result.length!=0 && req.headers.oc/666+500>Date.now()) {
                    return true;
                }else{
                    return false;
                }
            });
        });*/
        /*if(req.headers.oc/666+500>Date.now() && req.headers.token){
            return true;
        }else{
            return false;
        }*/
        return true
    },
    od(req) { //api验证函数
        return true //req.headers.oc/666+500>Date.now();
    }
};

module.exports = common;