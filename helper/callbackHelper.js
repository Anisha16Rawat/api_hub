const mysqlcon = require("../config/db_connection");
const homesupport = require("../helper/homemodel")
const send_mail = require('../helper/send-mail');
const md5 = require("md5");
const axios = require('axios');
const crypto = require("crypto");
const https = require('https');
const qs = require('qs')
const path = require('path');
const ejs = require('ejs');
class callback{

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
    }

    async update_payment_status(order_no, status, dateTime) {
      try {
        console.log("hdbdjwh",order_no, status, dateTime)
        let orderhistory = await homesupport.get_update_payment_details(order_no);
        if (!orderhistory || orderhistory.length === 0) {
          throw new Error("Order not found");
        }
        let data = {
          status: status,
          pending_hit_response_by: 2,
          merchant_db_response: 0,
          updated_on: dateTime,
        };
        if (status == 4 || status == 5 || status == 9) {
          data.refund_chargeb_date = dateTime;
        }
        switch (status) {
          case 1:
            data.payment_status = "Transaction is Success";
            break;
          case 0:
            data.payment_status = "Transaction is Failed";
            break;
          case 3:
            data.payment_status = "Payment has been Initiated";
            break;
          case 4:
            data.payment_status = "The transaction has been refunded";
            break;
          case 5:
            data.payment_status = "The transaction has been chargebacked";
            break;
          case 9:
            data.payment_status = "The transaction has been chargebacked-Settled";
            break;
        }
        let userid = orderhistory[0].user_id;
        let updateMerchantTrans = 'UPDATE tbl_merchant_transaction SET ? WHERE order_no = ? AND user_id = ?';
        await mysqlcon(updateMerchantTrans, [data, order_no, userid]);
      } catch (err) {
        console.error("Error in update_payment_status:", err);
        throw err;
      }
    }

    async  change_order_status_without_status_api(order_no, status, dateTime,req) {
        const sqlSelect = `SELECT * FROM tbl_merchant_transaction WHERE (invoice_id = ? OR order_no = ?)`;
        const resultrow = await mysqlcon(sqlSelect, [order_no, order_no]);

        const row = resultrow[0];
        const update_status = row.status;
        const change_user_ip = await homesupport.getClientIps(req);
        const logEntry = {
          order_no: row.order_no,
          order_description: JSON.stringify(row),
          previous_status: row.status,
          current_status: status,
          changed_by: change_user_ip,
          creation_date: dateTime
        };
        // Update payment status based on logic
        if (status === 4 || status === 5) {
          await update_payment_status(row.invoice_id, status, dateTime);
        } else if (row.status_code && row.status_code.trim() !== '') {
          await update_payment_status(row.invoice_id, update_status, dateTime);
        }
        // const sqlInsert = 'INSERT INTO tbl_order_status SET ?'
        // let rowcreate = await mysqlcon(sqlInsert, [logEntry]);
        
        // Status labels array
        const status_array = ['FAILED', 'SUCCESS', 'WAITING', 'PENDING', 'REFUND', 'CHARGEBACK'];

        await send_mail.mail(
          {
            email : 'anisha@ubankconnect.com',
            subject: "Manual Callback To Merchant",
            order_no: row.order_no,
            previous_status: status_array[row.status],
            current_status: status_array[status],
            status_code: row.status_code || '',
            bank_status: status_array[status],
            changed_by: change_user_ip,
            creation_date: dateTime,
          },
          'callbackMail'
        );

    }

    async merchantPaymentDbStatus(order){
      let sql = `UPDATE tbl_merchant_transaction SET merchant_db_response = 1 WHERE order_no = ? `
      let result = await mysqlcon(sql,[order])
      return result
    }
}
module.exports = new callback;