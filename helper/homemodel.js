const mysqlcon = require('../config/db_connection');
const axios = require('axios');
const crypto = require('crypto');
const https = require('https');

let today = new Date(); 
let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date+' '+time;



module.exports.merchantOrderDetail = async (order_id) => {
        let detailsSql = "SELECT * FROM tbl_merchant_transaction WHERE order_no = ?";
        let detailResult = await mysqlcon(detailsSql,[order_id])
        return detailResult; 
};

module.exports.getDetailBymer = async(user_id) => {
        const detailsSql = "SELECT * FROM tbl_user where id = ?";
        const detailResults = await mysqlcon(detailsSql,[user_id])
        return detailResults
};

module.exports.get_update_payment_details = async(order_no) => {
    const detailsSql = "SELECT * FROM tbl_merchant_transaction where order_no = ?";
    const detailResults = await mysqlcon(detailsSql,[order_no])
    return detailResults
};

module.exports.getClientIps = async(req) => {
    let ipAddress;
    let forwardedIpsStr = req.headers['x-forwarded-for'];    
    if (forwardedIpsStr) {
      let forwardedIps = forwardedIpsStr.split(',');        
      ipAddress = forwardedIps[0];
    }    
    if (!ipAddress) {
      ipAddress = req.socket.remoteAddress;   
    }   
    return ipAddress;
};

module.exports.getSettleCurrencyName = async(id) => {
    switch (id) {
      case 1:
        return 'USD';
      case 2:
        return 'GBP';
      case 3:
        return 'INR';
      case 4:
        return 'CNY';
      default:
        return '1';
    }
};

module.exports.getMerchantDetail = async(usersId) => {
    if (!usersId) {
        const user_id = req.user_id;
        res.send(`User ID: ${user_id}`)
    }
    const sql = `SELECT * FROM tbl_user WHERE id = ${usersId}`;
    let merchantDetailResult = await mysqlcon(sql, [usersId])
    if (merchantDetailResult.length > 0) {
        return (merchantDetailResult[0]);
    } 
};

module.exports.merchantPaymentStatussUpdateOnEndPoint = async (fields, payment_static_url) => {
  try {
    let json_data = JSON.stringify(fields);
    const response = await axios.post(payment_static_url, json_data, {
        headers: {
            'Content-Type': 'application/json',
        },
        httpsAgent: new https.Agent({  
            rejectUnauthorized: false, 
        }),
    });
    return response.data;
  } catch (error) {
    console.error('Error making the request:', error.message);
    throw error;
  }
};