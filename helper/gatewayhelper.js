const mysqlcon = require('../config/db_connection');
const homesupport = require("./homemodel")
const crypto = require('crypto');
const axios = require('axios');
const geoip = require('geoip-lite');
const qs = require('qs');
const https = require('https');
const xml2js = require('xml2js');
const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Zero-padding for month
        const day = ('0' + currentDate.getDate()).slice(-2); // Zero-padding for day
        const time = ('0' + currentDate.getHours()).slice(-2) + ':' + ('0' + currentDate.getMinutes()).slice(-2) + ':' + ('0' + currentDate.getSeconds()).slice(-2);
        let dateTimes = `${year}-${month}-${day} ${time}`;
const querystring = require('querystring');
const md5 = require("md5");
const { log } = require('util');
const Flutterwave = require('flutterwave-node-v3');
// const xml2js = require('xml2js');



function getSettleCurrencyName(id){
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
      return ''; // Return an empty string or handle other cases as needed
  }
}

async function currentCurrency(paymentCurrency, convertCurrency) {
  try {
    const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${paymentCurrency}`);
    
    if (response.data.rates && response.data.rates[convertCurrency]) {
      return response.data.rates[convertCurrency];
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error in currentCurrency:', error);
    return 0;
  }
};

class Default { 

  async getMerchantDetail(usersId) {
    const sql = "SELECT * FROM tbl_user WHERE id = ?";
    const query = await mysqlcon(sql, [usersId]);
     return query
  }
  
  async merchantOrderDetails(order_id) {
    const detailsSql = "SELECT * FROM tbl_merchant_transaction WHERE txn_id = ?";
    const detailResult = await mysqlcon(detailsSql,[order_id])
    return detailResult
  }
  
  get_client_ip()
 {

  let ipaddress = '';
    if (process.env.HTTP_CLIENT_IP){
      ipaddress = process.env.HTTP_CLIENT_IP
    }
    else if (process.env.HTTP_CLIENT_IP){
      ipaddress = process.env.HTTP_CLIENT_IP
    }
    else if (process.env.HTTP_CLIENT_IP){
      ipaddress = process.env.HTTP_CLIENT_IP
    }
    else if (process.env.HTTP_CLIENT_IP){
        ipaddress = process.env.HTTP_CLIENT_IP
    }
    else if (process.env.HTTP_CLIENT_IP){
        ipaddress = process.env.HTTP_CLIENT_IP
    }
    else if (process.env.HTTP_CLIENT_IP){
        ipaddress = process.env.HTTP_CLIENT_IP
    }
    else{
        ipaddress = 'UNKNOWN'
    }
    return ipaddress;
  };

  async getDetailBymer(merchnat){

    let sql = "SELECT * FROM tbl_user WHERE id = ? "
    let result = await mysqlcon(sql,[merchnat])
    return result 
  };
 
  async getCardVerifyCode(card_no) 
 {
    const card_verify = {
    credit_card_amex: [34, 37],
    credit_card_cup: [5610, 560221, 560222, 560223, 560224, 560225],
    credit_card_diners: [36],
    credit_card_master: [51, 52, 53, 54, 55, 2221, 2222, 2223, 2224, 2225, 2226, 2227, 2228, 2229,
      // ... (Add all the values)
    ],
    credit_card_visa: [4],
    debit_card_rupay: [60, 6521, 6522],
    debit_card_visa: [4026, 417500, 4508, 4844, 4913, 4917],
    debit_card_maestro: [
      5018, 5020, 5038, 5893, 6304, 6759, 6761, 6762, 6763, 6759, 676770, 676774,
      // ... (Add all the values)
    ],
  };
  
    const card = card_no.split('');
    const card1 = card[0];
    const card2 = card[0] + card[1];
    const card4 = card[0] + card[1] + card[2] + card[3];
    const card6 = card[0] + card[1] + card[2] + card[3] + card[4] + card[5];
  
    let search_string = '';
  
    if (card_verify.credit_card_amex.includes(parseInt(card2))) {
      search_string = 'credit card amex';
    } 
    else if (
      card_verify.credit_card_cup.includes(parseInt(card4)) ||
      card_verify.credit_card_cup.includes(parseInt(card6))
    ) {
      search_string = 'credit card cup';
    } else if (card_verify.credit_card_diners.includes(parseInt(card2))) {
      search_string = 'credit card diners';
    // } else if (card_verify.credit_card_jcb.includes(parseInt(card4))) {
    //   search_string = 'credit card jcb';
    } else if (
      card_verify.debit_card_rupay.includes(parseInt(card4)) ||
      card_verify.debit_card_rupay.includes(parseInt(card2))
    ) {
      search_string = 'debit card rupay';
    } else if (
      card_verify.debit_card_visa.includes(parseInt(card4)) ||
      card_verify.debit_card_visa.includes(parseInt(card6))
    ) {
      search_string = 'debit card visa';
    } else if (
      card_verify.debit_card_maestro.includes(parseInt(card4)) ||
      card_verify.debit_card_maestro.includes(parseInt(card6))
    ) {
      search_string = 'debit card maestro';
    } else if (
      card_verify.credit_card_master.includes(parseInt(card4)) ||
      card_verify.credit_card_master.includes(parseInt(card2))
    ) {
      search_string = 'credit card master';
    } else if (card_verify.credit_card_visa.includes(parseInt(card1))) {
      search_string = 'credit card visa';
    }
  
    return search_string;
  }
   
  async getBankChargesByCode(pg_id,search_column_type)
  {
    let queryColumn = search_column_type == 1 ? 'code' : 'title';
    let query = `SELECT bank_services_charge FROM tbl_code WHERE payment_gate = ? LIMIT 1`;
    let result = await mysqlcon(query,[pg_id, queryColumn]);
    if (result.length > 0) {
      let bankCharge = result[0].bank_services_charge;
        // Convert bankCharge to integer (assuming it's a numeric value)
        return parseInt(bankCharge);
    } else {
      return  0 ;
    }
  };
 
  async  getMerchantPayinCharges(pay_charge,currency_code,user_id) {
    let str = "";
    if (pay_charge == 1) {
        str = "payin_card as payin_amount ";
    } else if (pay_charge == 2) {
        str = "payin_upi as payin_amount ";
    } else if (pay_charge == 3) {
        str = "payin_netbanking as payin_amount ";
    } else if (pay_charge == 4) {
        str = "payin_wallet as payin_amount ";
    } else if (pay_charge == 5) {
        str = "payin_qr as payin_amount ";
    } else if (pay_charge == 6) {
        str = "vaoffline as payin_amount ";
    } else {
        str = "payin_amount as payin_amount ";
    }
    
    let sql = `SELECT ${str}, gst_amount as gst_amount FROM tbl_merchant_charges WHERE currency_code = ? AND user_id = ?`;
    let result = await mysqlcon(sql, [currency_code, user_id]);
    if (result && result.length > 0) {
      let payin_amount = result[0].payin_amount;
      let gst = result[0].gst_amount;
      return {
          payin_amount,
          gst
      };
    }

  }

  async getBankCodeTitle(code){

    let query = `SELECT title FROM tbl_code WHERE code = ${code}`
    let results = await mysqlcon(query,[code])

    if (results.length > 0) {
      return results[0].title
    } else {
      return 0;
    }
  };

  async getBankCode(assigngatewayid, paymentCode)
  {
    let query = `SELECT code FROM tbl_code WHERE payment_gate = ? AND akontocode = ? `
    let results = await mysqlcon(query,[assigngatewayid, paymentCode])

    if (results.length > 0) {
      return results[0].code;
    } else {
      return 0;
    } 
  };   

  async userOrderPendingStatusUpdate(order_id, assigngatewayid, pending_by){
    let data = {
      status: 3,
      pending_hit_response_by: pending_by,
    };

    let sqlPendingStatus = `UPDATE tbl_merchant_transaction SET ? WHERE merchant_db_response = 0 AND order_no = ? AND gatewayNumber = ?`;
    let resultPendingStatus = await mysqlcon(sqlPendingStatus,[data, order_id, assigngatewayid]);
    if (resultPendingStatus > 0) {
      return resultPendingStatus 
    }
  };


 async merchantPaymentStatusUpdateOnEndPoint(fields, paymentStaticUrl) {
    const json_data = JSON.stringify(fields);

    const response = await fetch(paymentStaticUrl, {
        method: 'POST',
        body: json_data,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 0, // No timeout (equivalent to CURLOPT_CONNECTTIMEOUT)
        agent: new https.Agent({ rejectUnauthorized: false }), // Equivalent to CURLOPT_SSL_VERIFYPEER
      });

      if (!response.ok) {
        throw new Error(`HTTP request failed with status ${response.status}`);
      }

      const fileContents = await response.text();

      return fileContents;
 };

 async userOrderWatingStatusUpdate(order_id,assigngatewayid){

  let detailsSql = `SELECT * FROM tbl_merchant_transaction WHERE order_no = '${order_id}' AND gatewayNumber = '${assigngatewayid}'`
  let detailResult = await mysqlcon(detailsSql)
  let state = 'WAITING';
  let stateCode = 'WAIT200';
  let message = 'Payment initiate';
  /* Code for new order_id send condition */
  let od_id;
  if (detailResult.new_trx == 1) {
    od_id = detailResult.txn_id;
  } else {
    od_id = detailResult.order_no;
  }
  let udetail = await homesupport.getDetailBymer(detailResult[0].user_id);

  let data = {
    order_id: order_id,
    orderAmount: detailResult[0].ammount,
    requestedAmount: detailResult[0].txn_amount || detailResult[0].ammount,
    currency: detailResult[0].ammount_type,
    txStatus: state,
    txMsg: message,
    txTime: detailResult[0].created_on,
    txCode: stateCode,
    checksum: md5(`${detailResult[0].user_id}|${detailResult[0].ammount}|${state}|${detailResult[0].created_on}|${od_id}|${udetail[0].secretkey}`),
  };
  
  let end_point_response = await homesupport.merchantPaymentStatussUpdateOnEndPoint(data, detailResult[0].end_point_url)

  data.end_point_response = end_point_response;

  let data1 = {
    order_no: order_id,
    data: JSON.stringify(data),
    created_on: new Date()
  }
  let sqlInsert = "INSERT INTO tbl_cron_log SET ? "
  await mysqlcon(sqlInsert,[data1]);
  return 1;
 };

 async payoutMerchantOrderDetails(order_id) {
  const detailsSql = "SELECT * FROM tbl_icici_payout_transaction_response_details WHERE uniqueid = ?";
  const detailResult = await mysqlcon(detailsSql,[order_id])
  return detailResult
 };

  async ipaddress(clientIp){
  const ip = clientIp;
  const geo = geoip.lookup(ip);
  if(geo !== null){
    const Country = geo.country
    return(Country)
  }
  else{
    return ('UNKNOWN IP')
  }
  
  };

  //caresPay 
  async caresPaycreate(req, maskedCardNumber,order_id, gateway_id){
    const paymentType = req.payBy;
    if (paymentType == 1) {
      var mode = 'Card';
      var card = maskedCardNumber;
    }


    // const orderNo =  orderNo;
    const merNo =  req.merchantNumber;
    const transactionId = '';
    const paymentStatus = 'Payment initiate';
    const status =  '2';
    const ammountType = req.currency;
    const signInfo = '';
    const endPoint = req.callback_url;
    const redirect = req.return_url;
    const payinCharges = req.payinCharges;
    const gstCharges = req.gstCharges;
    const settleAmount =  req.settleAmount;
    var userId = req.merchantNumber;
    let empId = 0;

    if (req.merchant_emp && !isEmpty(req.merchant_emp)) {
      empId = parseInt(req.merchant_emp);
    } else {
      empId = 0;
    }

    var data = {
      our_bank_charge: req.our_bank_charge,
      our_bank_charge_gst: req.our_bank_charge_gst,
      rolling_reverse_amount: req.rolling_reverse_amount,
      rolling_reverse_on: req.rolling_reverse_on,
      txn_id: req.user_txn_id,
      new_trx: 1,
      merchant_emp: empId,
      sales_from: 2,
      user_id: merNo,
      payin_charges: payinCharges,
      gst_charges: gstCharges,
      settle_amount: settleAmount,
      end_point_url: endPoint,
      redirection_url: redirect,
      order_no: order_id,
      mer_no: merNo,
      transaction_id: transactionId,
      card_4_4: card,
      ammount: req.amount,
      tax_amt: req.tax_amt,
      settle_currency_current_price: await currentCurrency(
      ammountType,
      homesupport.getSettleCurrencyName(homesupport.getMerchantDetail(req.merchantNumber).settle_currency)),
      payment_status: paymentStatus,
      status: status,
      payment_type: mode,
      ammount_type: ammountType,
      bill_address: req.address,
      sign_info: signInfo,
      i_country: req.country,
      i_state: req.state,
      i_city: req.city,
      i_zip: req.postalCode,
      i_ip: req.ip,
      i_flname: `${req.fname} ${req.lname}`,
      i_fname: req.fname,
      i_lname: req.lname,
      i_email: req.email,
      i_number: req.mobile_no,
      discription: req.description,
      baggage: req.baggage,
      reference: req.reference,
      gatewayNumber: gateway_id,
      created_on: dateTimes,
      settlement_on: dateTimes,
      updated_on: dateTimes,
    };
    

    if (req.payment_mode == 'LIVE') {
      data.trx_live_test = 1;
    }else if(req.payment_mode == 'TEST'){
      data.trx_live_test = 0;
    }
    let sqlInsert = "INSERT INTO tbl_merchant_transaction SET ? "
    return await mysqlcon(sqlInsert,[data]);
    
  };

  async  caresPayresponse(data) {
  
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://ssl.carespay.com/carespay/pay',
      headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Cookie': 'JSESSIONID=0B7DB04C00D03936844B4AF95A5D9456'
      },
      data: data
    };

    // Return the promise chain directly
    return axios.request(config).then((response) => {
      return response.data; // Returning only the response data
    });
  }

  async caresPayresponsestatus(billNo){

    let merNo = '371001';
    let key = '8fMqhEvT'
    const secKey = `merNo=${merNo}&billNo=${billNo}&key=${key}`
    const signature = crypto.createHash('md5').update(secKey).digest('hex');

    let status_data = {
      merNo: merNo,
      billNo : billNo,
      signature : signature
    };
    
    let statusdata = qs.stringify(status_data);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://ssl.carespay.com/query/order',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'JSESSIONID=0B7DB04C00D03936844B4AF95A5D9456'
      },
      data: statusdata
    };

    const response = await axios.request(config);
    return response.data;
  }

  async getPendingStatus(gateway_id,orderId) {
    let sql = `SELECT * FROM tbl_merchant_transaction WHERE status = 3 AND merchant_db_response = 0 AND gatewayNumber = '${gateway_id}' AND order_no = '${orderId}'`;
    let result = await mysqlcon(sql)
    return result
  }
  async returnMerchantOrderDetails(order_id) {
    const formatted_date = ["DATE_FORMAT(tbl_merchant_transaction.created_on,'%Y-%m-%d %H:%i:%s') AS created_on"];
    const formatted_dateStr = formatted_date.join(", ");
    const formatted_date1 = ["DATE_FORMAT(tbl_merchant_transaction.updated_on,'%Y-%m-%d %H:%i:%s') AS updated_on"];
    const formatted_dateStr1 = formatted_date1.join(", ");
    const detailsSql = `SELECT *,${formatted_dateStr} ,${formatted_dateStr1} FROM tbl_merchant_transaction WHERE order_no = ?`;
    const detailResult = await mysqlcon(detailsSql,[order_id])
    return detailResult
  }
  
  async setCaresPayTransactionStatus(status, order_id,gatewayno, message, dateTime){

    const sql = `SELECT * FROM tbl_merchant_transaction WHERE gatewayNumber = ? AND order_no = ?`;
    const result = await mysqlcon(sql,[gatewayno, order_id, message])

    if(result){
      if(result[0].status == '3'){
        let  data = {
          status: status,
          payment_status: message,
          updated_on: dateTime,
        }

        let sqlUpdate = "UPDATE tbl_merchant_transaction SET ? WHERE  order_no = ? AND gatewayNumber = ?"
        let resultUpdate = await mysqlcon(sqlUpdate,[data,order_id,gatewayno])
        return resultUpdate
      }
    }
  }

  async update_carespay_merchant_db_response(order,gatewayno)
  {

      let sql = `UPDATE tbl_merchant_transaction SET merchant_db_response = 1 WHERE order_no = ? AND gatewayNumber = ?`
      let result = await mysqlcon(sql,[order,gatewayno])
      return result
  }

  async  Aiforyresponse(requestData, headers) {
    try {
        const response = await axios.post('https://api.aifory.io/payin/process', requestData, {
            headers: headers
        });
        
        let resdata = response.data;
        return resdata

    } catch (error) {
      console.error('Error making the request:', error.message);
      if (error.response) {
          return('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
      }
      throw error;

    }
  }

  async aiforygetresStatus(paymenturl,request_data1,extractPaymentURL){
            const paymentResponse = await axios.post(paymenturl, request_data1);
            
            const paymentHTML = paymentResponse.data;
            const paymentURLFromHTML = await extractPaymentURL(paymentHTML);
            
            const jsonResponse = {
                paymentURL: paymentURLFromHTML
            };
            
            return jsonResponse;

  }

  async Aiforycreate(req, maskedCardNumber, order_id, gateway_id, dateTime){
  const paymentType = req.payBy;
  if (paymentType == 1) {
    var mode = 'Card';
    var card = maskedCardNumber;
  }


  // const orderNo =  orderNo;
  const merNo =  req.merchantNumber;
  const transactionId = '';
  const paymentStatus = 'Payment initiate';
  const status =  '2';
  const ammountType = req.currency;
  const signInfo = '';
  const endPoint = req.callbackUrl;
  const redirect = req.returnUrl;
  const payinCharges = req.payinCharges;
  const gstCharges = req.gstCharges;
  const settleAmount =  req.settleAmount;
  var userId = req.merchantNumber;
  let empId = 0;

  if (req.merchant_emp && !isEmpty(req.merchant_emp)) {
    empId = parseInt(req.merchant_emp);
  } else {
    empId = 0;
  }

  var data = {
    our_bank_charge: req.our_bank_charge,
    our_bank_charge_gst: req.our_bank_charge_gst,
    rolling_reverse_amount: req.rolling_reverse_amount,
    rolling_reverse_on: req.rolling_reverse_on,
    txn_id: req.user_txn_id,
    new_trx: 1,
    merchant_emp: empId,
    sales_from: 3,
    user_id: merNo,
    payin_charges: payinCharges,
    gst_charges: gstCharges,
    settle_amount: settleAmount,
    end_point_url: endPoint,
    redirection_url: redirect,
    order_no: order_id,
    mer_no: merNo,
    transaction_id: transactionId,
    card_4_4: card,
    ammount: req.amount,
    tax_amt: req.tax_amt,
    settle_currency_current_price: await currentCurrency(
    ammountType,homesupport.getSettleCurrencyName(homesupport.getMerchantDetail(req.merchantNumber).settle_currency)),
    payment_status: paymentStatus,
    status: status,
    payment_type: mode,
    ammount_type: ammountType,
    bill_address: req.address,
    sign_info: signInfo,
    i_country: req.country,
    i_state: req.state,
    i_city: req.city,
    i_zip: req.postalCode,
    i_ip: req.ip,
    i_flname: `${req.firstName} ${req.lastName}`,
    i_fname: req.firstName,
    i_lname: req.lastName,
    i_email: req.email,
    i_number: req.mobileNumber,
    discription: req.description,
    baggage: req.baggage,
    reference: req.reference,
    gatewayNumber: gateway_id,
    created_on: dateTime,
    settlement_on: dateTime,
    updated_on: dateTime
  };
  if (req.payment_mode == 'LIVE') {
    data.trx_live_test = 1;
  }
  let sqlInsert = "INSERT INTO tbl_merchant_transaction SET ? "
  return await mysqlcon(sqlInsert,[data]);

  };

  async Aiforyresponsestatus(billNo, orderAmount, requestedAmount, txTime){
    const apiKey = 'm1bVJyrYAxUtfbPcF8HiKGNEWjZm0gCbV9yfUB28nlqlKW617tt2FPkJNUmrdcUey9n3ok1zPnmHYAfa9SwWFJnweeRqBTNwuKPeAhM9Gxej1sCpTBewQyRyKjI46DHAdbYeJZ0aVmO0XXDN6WNTz51g7uKCcOq56Vq3PBRbjF1KQrzUIiUuJAa93MYwj5wPZi38eervFvAqcImNdIoUYjk1hYYFv3gU6JB4ujB6h5ulktWjEpOW7DbSU7VVx56l';
    const secretKey = 'ZvvaGSj0Y0plpcyXi7Y0xOgUvYtwOzn145QISOhEf9RjFmWWTeAdtET4Z9bfPt1vMymD9CXr2rl0nT9lciECaMjo4dMxivhwvuDPrWyYGdL2TRLR8pgejtccovSwhjmLPnGs2PpFnYjeS3nr0DR0uBEKgy3J5paNsjV0KQwLvSuqzdouTanVcthyheZIkXXeYS8YIKthdfxXJ2h78UzQlSN2e7Z9NIcb6GIBzM3JNpgfdWjAFIEFR6NMt9Ar9uvL';
    const userAgentToken = 'D1;>x7';

    let date = txTime * 1000  
    let Exp = (txTime * 1000) + (24 * 60 * 60 * 1000);

    let ID =  1;
    let typeID = 2;
    let statusID = 2;
    let orderType = "payin";
    let amount = orderAmount;
    let successPaid = requestedAmount;
    let fee = 0.5;
    let clientOrderID = billNo;
    let createdAt = 1673825132.75679;
    let expiredAt = 1674825131.754252;
    let currencyID = 2

    const data = {
      
        ID,
        typeID,
        statusID,
        orderType,
        amount,
        successPaid,
        fee,
        clientOrderID,
        createdAt,
        expiredAt,
        currencyID
    }
          const signedApiRequest = crypto.createHmac('sha512', secretKey).update(JSON.stringify(data)).digest('hex');
          
          const headers = {
              'API-Key': apiKey,
              'Content-Type': 'application/json',
              'Signature': signedApiRequest,
              'user-agent': userAgentToken
          }

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.aifory.io/payin/details',
      headers: headers,
      data: data
    };

    const response = await axios.request(config);
    let responseStatus =  response.data
    return responseStatus;
  }

  async setaiforyTransactionStatus(status, order_id,gatewayno, message, dateTime){

    const sql = `SELECT * FROM tbl_merchant_transaction WHERE gatewayNumber = ? AND order_no = ?`;
    const result = await mysqlcon(sql,[gatewayno, order_id, message])

    if(result){
      if(result[0].status == '3'){
        let  data = {
          status: status,
          payment_status: message,
          updated_on: dateTime,
        }
        let sqlUpdate = "UPDATE tbl_merchant_transaction SET ? WHERE  order_no = ? AND gatewayNumber = ?"
        let resultUpdate = await mysqlcon(sqlUpdate,[data,order_id,gatewayno])
        return resultUpdate
      }
    }
  }

  async update_merchant_db_response(order, gatewayNo)
  {
      let sql = `UPDATE tbl_merchant_transaction SET merchant_db_response = 1 WHERE order_no = ? AND gatewayNumber = ?`
      let result = await mysqlcon(sql,[order,gatewayNo])
      return result
  }

  // flutterweb
  async fluttercreate(req, maskedCardNumber,order_id, gateway_id,transactionId){
    const paymentType = req.payBy;
    if (paymentType == 1) {
      var mode = 'Card';
      var card = maskedCardNumber;
    }


    // const orderNo =  orderNo;
    const merNo =  req.merchantNumber;
    // const transactionId = transactionId;
    const paymentStatus = 'Payment initiate';
    const status =  '2';
    const ammountType = req.currency;
    const signInfo = '';
    const endPoint = req.callback_url;
    const redirect = req.return_url;
    const payinCharges = req.payinCharges;
    const gstCharges = req.gstCharges;
    const settleAmount =  req.settleAmount;
    var userId = req.merchantNumber;
    let empId = 0;

    if (req.merchant_emp && !isEmpty(req.merchant_emp)) {
      empId = parseInt(req.merchant_emp);
    } else {
      empId = 0;
    }

    var data = {
      our_bank_charge: req.our_bank_charge,
      our_bank_charge_gst: req.our_bank_charge_gst,
      rolling_reverse_amount: req.rolling_reverse_amount,
      rolling_reverse_on: req.rolling_reverse_on,
      txn_id: req.user_txn_id,
      new_trx: 1,
      merchant_emp: empId,
      sales_from: 2,
      user_id: merNo,
      payin_charges: payinCharges,
      gst_charges: gstCharges,
      settle_amount: settleAmount,
      end_point_url: endPoint,
      redirection_url: redirect,
      order_no: order_id,
      mer_no: merNo,
      transaction_id: transactionId,
      card_4_4: card,
      ammount: req.amount,
      tax_amt: req.tax_amt,
      settle_currency_current_price: await currentCurrency(
      ammountType,
      homesupport.getSettleCurrencyName(homesupport.getMerchantDetail(req.merchantNumber).settle_currency)),
      payment_status: paymentStatus,
      status: status,
      payment_type: mode,
      ammount_type: ammountType,
      bill_address: req.address,
      sign_info: signInfo,
      i_country: req.country,
      i_state: req.state,
      i_city: req.city,
      i_zip: req.postalCode,
      i_ip: req.ip,
      i_flname: `${req.fname} ${req.lname}`,
      i_fname: req.fname,
      i_lname: req.lname,
      i_email: req.email,
      i_number: req.mobile_no,
      discription: req.description,
      baggage: req.baggage,
      reference: req.reference,
      gatewayNumber: gateway_id,
      created_on: dateTimes,
      settlement_on: dateTimes,
      updated_on: dateTimes,
    };
    

    if (req.payment_mode == 'LIVE') {
      data.trx_live_test = 1;
    }else if(req.payment_mode == 'TEST'){
      data.trx_live_test = 0;
    }
    let sqlInsert = "INSERT INTO tbl_merchant_transaction SET ? "
    return await mysqlcon(sqlInsert,[data]);
    
  }

  async flutterwavestatus(order_no){
 
      const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY ;
      const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY;
    
     const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);
      const payload = {
        id : order_no
      }
      const response = await flw.Transaction.verify(payload)
      return response
  }

  async globalResponse(reqData){
    const config = {
      method: 'POST',
      url: 'https://api.convergegate.com/v1/transactions',
      headers: {
        'Content-Type': 'application/json',
      },
      data: reqData,
    };
      const response = await axios(config);
      const parser = new xml2js.Parser();
      
      // Return a promise to ensure the function waits for XML parsing
      const result = await new Promise((resolve, reject) => {
        parser.parseString(response.data, (err, parsedResult) => {
          if (err) {
            reject(new Error('Error parsing response'));
          } else {
            resolve(parsedResult);
          }
        });
      });
      
      return result;
  }

  async globalPcreate(req, maskedCardNumber,order_id, gateway_id,transactionId){
    const paymentType = req.payBy;
    if (paymentType == 1) {
      var mode = 'Card';
      var card = maskedCardNumber;
    }


    // const orderNo =  orderNo;
    const merNo =  req.merchantNumber;
    // const transactionId = transactionId;
    const paymentStatus = 'Payment initiate';
    const status =  '2';
    const ammountType = req.currency;
    const signInfo = '';
    const endPoint = req.callbackUrl;
    const redirect = req.return_url;
    const payinCharges = req.payinCharges;
    const gstCharges = req.gstCharges;
    const settleAmount =  req.settleAmount;
    var userId = req.merchantNumber;
    let empId = 0;

    if (req.merchant_emp && !isEmpty(req.merchant_emp)) {
      empId = parseInt(req.merchant_emp);
    } else {
      empId = 0;
    }

    var data = {
      our_bank_charge: req.our_bank_charge,
      our_bank_charge_gst: req.our_bank_charge_gst,
      rolling_reverse_amount: req.rolling_reverse_amount,
      rolling_reverse_on: req.rolling_reverse_on,
      txn_id: req.user_txn_id,
      new_trx: 1,
      merchant_emp: empId,
      sales_from: 2,
      user_id: merNo,
      payin_charges: payinCharges,
      gst_charges: gstCharges,
      settle_amount: settleAmount,
      end_point_url: endPoint,
      redirection_url: redirect,
      order_no: order_id,
      mer_no: merNo,
      transaction_id: transactionId,
      card_4_4: card,
      ammount: req.amount,
      tax_amt: req.tax_amt,
      settle_currency_current_price: await currentCurrency(
      ammountType,
      homesupport.getSettleCurrencyName(homesupport.getMerchantDetail(req.merchantNumber).settle_currency)),
      payment_status: paymentStatus,
      status: status,
      payment_type: mode,
      ammount_type: ammountType,
      bill_address: req.address,
      sign_info: signInfo,
      i_country: req.country,
      i_state: req.state,
      i_city: req.city,
      i_zip: req.postalCode,
      i_ip: req.ip,
      i_flname: `${req.fname} ${req.lname}`,
      i_fname: req.fname,
      i_lname: req.lname,
      i_email: req.email,
      i_number: req.mobile_no,
      discription: req.description,
      baggage: req.baggage,
      reference: req.reference,
      gatewayNumber: gateway_id,
      created_on: dateTimes,
      settlement_on: dateTimes,
      updated_on: dateTimes,
    };
    

    if (req.payment_mode == 'LIVE') {
      data.trx_live_test = 1;
    }else if(req.payment_mode == 'TEST'){
      data.trx_live_test = 0;
    }
    let sqlInsert = "INSERT INTO tbl_merchant_transaction SET ? "
    return await mysqlcon(sqlInsert,[data]);
    
  }

  async globalStatusresponse(merchanttransid){
     
  let apiUser = '3979uBk'; 
  let apiPassword = 'e88145bc9102'; 
  let apiCmd = '709';  
  let apiKey = 'AD3E57A0-8C38-3AD3-BFDD-4C8C3BA12008'; 
 
  const checksumString = (apiUser + apiPassword + apiCmd + merchanttransid + apiKey); 
 
  let checkSum = crypto.createHash('sha1').update(checksumString).digest('hex'); 
 
  let reqData = { 
    transaction: { 
      apiUser: apiUser, 
      apiPassword: apiPassword, 
      apiCmd: apiCmd, 
      merchanttransid: merchanttransid, 
      checksum: checkSum 
    } 
  }; 

  const builder = new xml2js.Builder({ headless: true });
  const xmlRequest = builder.buildObject(reqData);
 
  const config = { 
    method: "POST", 
    url: 'https://testapi.convergegate.com/v1/transactions', 
    headers: { 
      "Content-Type": "application/xml", 
    }, 
    data: xmlRequest, 
  }; 

  const response = await axios(config);
  const parser = new xml2js.Parser();
  
  // Return a promise to ensure the function waits for XML parsing
  const result = await new Promise((resolve, reject) => {
    parser.parseString(response.data, (err, parsedResult) => {
      if (err) {
        reject(new Error('Error parsing response'));
      } else {
        resolve(parsedResult);
      }
    });
  });
  
  return result;

  }

  async globalrefundresponse(checkSum,reason,gatetransid,amount){
    
    let apiUser = "3979uBk";
    let apiPassword = "43d7ce1351fc";
    let apiCmd = "760";

    let reqData = {
      transaction: {
        apiUser: apiUser,
        apiPassword: apiPassword,
        apiCmd: apiCmd,
        gatetransid: gatetransid,
        amount: amount,
        reason: reason,
        checksum: checkSum,
      },
    };

    let builder = new xml2js.Builder({ headless: true });
    let xmlRequest = builder.buildObject(reqData);

    let config = {
      method: "POST",
      url: "https://testapi.convergegate.com/v1/transactions",
      headers: {
        "Content-Type": "application/xml",
      },
      data: xmlRequest,
    };

    let response = await axios(config);
    const parser = new xml2js.Parser();
    const bankResponse = await new Promise((resolve, reject) => {
      parser.parseString(response.data, (err, parsedResult) => {
        if (err) {
          reject(new Error('Error parsing response'));
        } else {
          resolve(parsedResult);
        }
      });
    })
    return bankResponse

  }
}

module.exports = new Default;


module.exports.createAccDetails = async(req,res)=>{
  try{
    let {currency,iban,bic,beneficiary,beneficiaryAddress,bankName,bankCountry,paymentDetails} = req.body

    let accData = {
      currency,
      iban,
      bic,
      beneficiary,
      beneficiaryAddress,
      bankName,
      bankCountry,
      paymentDetails
    }

    let sqlAcc = 'INSERT INTO crypto_tbl_user SET ?'
    let resultAcc = await mysqlcon(sqlAcc,[accData])

    if(!resultAcc){
      return res.status(201).json({
        message : 'Error While Account Added'
      })
    }else{
      return res.status(200).json({
        message : 'Account Added'
      })
    }
  }catch(error){
    console.log(error)
    return res.status(500).json({
      message : 'error'
    })
  };
  
}

module.exports.showAccDetails = async(req,res)=>{
  try{
    let {id} = req.body

    let sqlAcc = 'SELECT currency,iban,bic,beneficiary,beneficiaryAddress,bankName,bankCountry,paymentDetails FROM crypto_tbl_user'
    let resultAcc = await mysqlcon(sqlAcc,[id])

    if(!resultAcc){
      return res.status(201).json({
        message : 'No Data Found',
        data : resultAcc
      })
    }else{
      return res.status(200).json({
        message : 'Account Data are',
        data : resultAcc
      })
    }
  }catch(error){
    console.log(error)
    return res.status(500).json({
      message : 'error'
    })
  };
  
}
