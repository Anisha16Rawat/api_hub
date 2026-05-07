const mysqlcon = require("../config/db_connection");
const config = require("../config/config");
const helpers = require("../helper/gatewayhelper");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const md5 = require("md5");
const ejs = require("ejs");
const path = require("path");
const https = require("https");
const { Buffer } = require("buffer");

let today = new Date();
let date = today.toISOString().split("T")[0];
let time = today.toLocaleTimeString([], { hour12: false });
let dateTime = `${date} ${time}`;

const querystring = require("querystring");
const emailvalidate = require("email-validator");
const Flutterwave = require("flutterwave-node-v3");
const xml2js = require("xml2js");
const forge = require("node-forge");
const { extname } = require("path");
const NodeRSA = require("node-rsa");
const { DOMParser } = require("xmldom");
const qs = require("qs");
const iconv = require("iconv-lite");
const nodemailer = require("nodemailer");
const webhookUrl = process.env.WEBHOOK;

module.exports.dnsPay = async (req, res) => {
  try {
    let endpointGroupId = "2518";
    let client_orderid = "902B4FF5";
    let amount = "100.00";
    let email = "john.sm@gmail.com";
    let merchant_control = "74365gf1-BDA2-492F-BF28-9F73C2A4C87C";
    let concatenatedString =
      endpointGroupId +
      client_orderid +
      parseFloat(amount) * 100 +
      email +
      merchant_control;
    let control = crypto
      .createHash("sha1")
      .update(concatenatedString)
      .digest("hex");
    let order_desc = "Test Order Description";
    let currency = "USD";
    let zip_code = "98102";
    let country = "US";
    let city = "Seattle";
    let phone = "12063582043";
    let cvv2 = "123";
    let credit_card_number = "4538977399606732";
    let card_printed_name = "John Doe";
    let expire_month = "12";
    let expire_year = "2099";
    let first_name = "John";
    let last_name = "Smith";
    let state = "WA";
    let address1 = "100 Main st";

    let requestData = {
      card_printed_name: card_printed_name,
      credit_card_number: credit_card_number,
      expire_year: expire_year,
      expire_month: expire_month,
      cvv2: cvv2,
      client_orderid: client_orderid,
      order_desc: order_desc,
      first_name: first_name,
      last_name: last_name,
      ssn: "1267",
      birthday: "19820115",
      address1: address1,
      city: city,
      state: state,
      zip_code: zip_code,
      country: country,
      phone: phone,
      amount: amount,
      email: email,
      currency: currency,
      ipaddress: "192.185.129.71",
      site_url:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
      purpose: "user_account1",
      redirect_url:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
      server_callback_url:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
      redirect_success_url:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
      redirect_fail_url:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
      merchant_data: "VIP customer",
      dapi_imei: "123",
      control: control,
    };

    let requestDatajson = querystring.stringify(requestData);

    let config = {
      method: "post",
      url: `https://sandbox.dns-pay.com/paynet/api/v2/sale/group/${endpointGroupId}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: requestDatajson,
    };

    const response = await axios(config);

    if (response.status === 200) {
      const responseData = response.data.split("\n").reduce((acc, line) => {
        const [key, value] = line.split("=");
        acc[key] = value;
        return acc;
      }, {});
      return res.send(responseData);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.dnspayment = async (req, res) => {
  try {
    let endpointGroupId = "2518";
    let merchant_control = "794A8371-BDA2-492F-BF28-9F73C2A4C87C";
    let client_orderid = "902B4FF5";
    let order_desc = "Test Order Description";
    let first_name = "John";
    let last_name = "Smith";
    let ssn = "1267";
    let birthday = "19820115";
    let address1 = "100 Main st";
    let city = "Seattle";
    let state = "WA";
    let zip_code = "98102";
    let country = "US";
    let phone = "2B12063582043";
    let cell_phone = "2B19023384543";
    let amount = "10.42";
    let email = "john.smith@gmail.com";
    let currency = "USD";
    let ipaddress = "65.153.12.232";
    let site_url =
      "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php";
    let redirect_url =
      "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php";
    let server_callback_url =
      "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php";
    let merchant_data = "VIP customer";
    let concatenatedString =
      endpointGroupId +
      client_orderid +
      parseFloat(amount) * 100 +
      email +
      merchant_control;
    let control = crypto
      .createHash("sha1")
      .update(concatenatedString)
      .digest("hex");
    let credit_card_number = "4455555555555544";
    let expire_month = "12";
    let expire_year = "2088";
    let cvv2 = "432";

    let reqData = {
      client_orderid: client_orderid,
      order_desc: order_desc,
      first_name: first_name,
      last_name: last_name,
      ssn: ssn,
      birthday: birthday,
      address1: address1,
      city: city,
      state: state,
      zip_code: zip_code,
      country: country,
      phone: phone,
      cell_phone: cell_phone,
      amount: amount,
      email: email,
      currency: currency,
      ipaddress: ipaddress,
      site_url: site_url,
      purpose: "user_account1",
      redirect_url: redirect_url,
      server_callback_url: server_callback_url,
      merchant_data: merchant_data,
      control: control,
      credit_card_number: credit_card_number,
      expire_month: expire_month,
      expire_year: expire_year,
      cvv2: cvv2,
    };

    let requestDatajson = querystring.stringify(reqData);

    let config = {
      method: "post",
      url: `https://sandbox.dns-pay.com/paynet/api/v2/sale-form/group/${endpointGroupId}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: requestDatajson,
    };

    const response = await axios(config);

    if (response.status === 200) {
      const responseData = response.data.split("\n").reduce((acc, line) => {
        const [key, value] = line.split("=");
        acc[key] = value;
        return acc;
      }, {});
      const decodedRedirectUrl = decodeURIComponent(
        responseData["&redirect-url"],
      );
      return res.send(decodedRedirectUrl);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error",
    });
  }
};

// {
//   "type": "async-response",
//   "&serial-number": "00000000-0000-0000-0000-00000439c312",
//   "&merchant-order-id": "902B4FF5",
//   "&paynet-order-id": "1964915",
//   "&end-point-id": "12175"
// }

module.exports.statusapidns = async (req, res) => {
  //invalid error
  try {
    let endpointGroupId = "2518";
    let merchant_control = "794A8371-BDA2-492F-BF28-9F73C2A4C87C";
    let login = "merchant";
    let client_orderid = "902B4FF5";
    let paynet_order_id = "1964915";

    let concatenatedString =
      login + client_orderid + paynet_order_id + merchant_control;
    let control = crypto
      .createHash("sha1")
      .update(concatenatedString)
      .digest("hex");

    let statusData = {
      login: login,
      "client-order-id": client_orderid,
      "paynet-order-id": paynet_order_id,
      control: control,
    };

    let requestDatajson = querystring.stringify(statusData);

    let config = {
      method: "post",
      url: `https://sandbox.dns-pay.com/paynet/api/v2/status/group/${endpointGroupId}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: requestDatajson,
    };

    const response = await axios(config);

    if (response.status === 200) {
      const responseData = response.data;
      return res.send(responseData);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.dnsnetbank = async (req, res) => {
  //invalid error
  try {
    let endpointId = "2518";
    let client_orderid = "902B4FF5";
    let amount = "100.00";
    let email = "john.smith@gmail.com";
    let merchant_control = "794A8371-BDA2-492F-BF28-9F73C2A4C87C";
    let consumerKey = "merchantlogin";
    let consumerSecret = "11111111-1111-1111-1111-111111111111";
    let concatenatedString =
      endpointId +
      client_orderid +
      parseFloat(amount) * 100 +
      email +
      merchant_control;
    let hmac = crypto.createHmac("sha1", consumerSecret);
    hmac.update(concatenatedString);
    let control = hmac.digest("hex");
    let order_desc = "Test Order Description";
    let currency = "USD";
    let zip_code = "98102";
    let country = "US";
    let city = "Seattle";
    let phone = "12063582043";
    let first_name = "John";
    let last_name = "Smith";
    let state = "WA";
    let address1 = "100 Main st";

    let reqData = {
      client_orderid: client_orderid,
      order_desc: order_desc,
      first_name: first_name,
      last_name: last_name,
      ssn: "1267",
      birthday: "19820115",
      address1: address1,
      city: city,
      state: state,
      zip_code: zip_code,
      country: country,
      phone: phone,
      email: email,
      amount: amount,
      currency: currency,
      ipaddress: "192.185.129.71",
      site_url:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
      control: control,
      redirect_url:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
      server_callback_url:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
      redirect_success_url:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
      redirect_fail_url:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
    };

    let requestDatajson = querystring.stringify(reqData);

    let config = {
      method: "post",
      url: `https://sandbox.dns-pay.com/paynet/api/v2/preauth-form/${endpointId}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${consumerKey}`,
      },
      data: requestDatajson,
    };

    const response = await axios(config);
    let responseData = {};
    Object.entries(querystring.parse(response.data)).forEach(([key, value]) => {
      responseData[key] = value.replace(/\n$/, "");
    });

    return res.send(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred",
    });
  }
};

module.exports.simPaisaCard = async (req, res) => {
  try {
    let MerchantId = "2000789";
    let OrderId = "23456543";
    let Currency = "PKR";
    let Amount = "10";
    let RedirectUrl =
      "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php";

    let resData = {
      MerchantId: MerchantId,
      OrderId: OrderId,
      Currency: Currency,
      Amount: Amount,
      RedirectUrl: RedirectUrl,
    };

    let queryString = Object.keys(resData)
      .map((key) => `${key}=${encodeURIComponent(resData[key])}`)
      .join("&");

    let url = `https://sandbox.simpaisa.com/card/registrationfull?${queryString}`;

    let config = {
      method: "get",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await axios(config);

    return res.send(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error",
    });
  }
};

module.exports.simPaisaCardVerify = async (req, res) => {
  try {
    let MerchantId = "2000789";
    let OrderId = "23456543";

    let resData = {
      merchantId: MerchantId,
      orderId: OrderId,
    };

    let url = `https://sandbox.simpaisa.com/card/finalize`;

    let config = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: resData,
    };

    const response = await axios(config);

    return res.send(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error",
    });
  }
};

module.exports.simPaisaWallet = async (req, res) => {
  try {
    let merchantId = "2000789";
    let operatorId = "100007";
    let userKey = "23456543";
    let msisdn = "3097524704";
    let transactionType = "0";
    let amount = "01";
    let productReference = "test";

    let reqData = {
      merchantId: merchantId,
      operatorId: operatorId,
      userKey: userKey,
      msisdn: msisdn,
      transactionType: transactionType,
      amount: amount,
      productReference: productReference,
    };

    let config = {
      method: "POST",
      url: `https://sandbox.simpaisa.com/v2/wallets/transaction/initiate`,
      header: {
        "Content-Type": "application/json",
      },
      data: reqData,
    };

    let response = await axios(config);
    return res.send(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error",
    });
  }
};

module.exports.simPaisaWalletVeify = async (req, res) => {
  //mobile no. need
  try {
    let merchantId = "2000789";
    let operatorId = "100007";
    let userKey = "23456543";
    let msisdn = "3097524704";
    let transactionType = "0";
    let amount = "01";
    let productReference = "test";
    let otp = "5678";

    let reqData = {
      merchantId: merchantId,
      operatorId: operatorId,
      userKey: userKey,
      msisdn: msisdn,
      transactionType: transactionType,
      amount: amount,
      otp: otp,
      productReference: productReference,
    };

    let config = {
      method: "POST",
      url: `https://sandbox.simpaisa.com/v2/wallets/transaction/verify`,
      header: {
        "Content-Type": "application/json",
      },
      data: reqData,
    };

    let response = await axios(config);
    return res.send(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error",
    });
  }
};

module.exports.singlePayoutPayment = async (req, res) => {
  try {
    let { userid } = req.body;

    if (!userid) {
      return res.status(400).json({
        message:
          "Unable to create a payout transaction. No user selected for payout.",
      });
    }

    let merchant = await helpers.getMerchantDetail(userid);

    let end_point_url = merchant[0].end_point_url;

    if (!end_point_url.trim()) {
      return res
        .status(400)
        .json({
          message: "Unable to create a payout transaction. End URL is not set.",
        });
    }

    let pdata = req.body;
    let jrequest = "";
    let url = "";
    req.body.pincode = "201301";
    req.body.bankcode = req.body.bankcode || "NOCode";

    if (req.body.currency && req.body.currency.toUpperCase().trim() === "INR") {
      jrequest = JSON.stringify([
        {
          order_id: req.body.transaction_id,
          bank: req.body.bankcode,
          trx_type: req.body.txn_type,
          payeename: req.body.account_name,
          bnf_nick_name: req.body.account_name,
          amount: req.body.amount,
          account_no: req.body.account_no,
          ifsc: req.body.ifsc_code,
          address1: req.body.address,
          city: req.body.city,
          state: req.body.province,
          pincode: req.body.pincode,
          email: req.body.email,
          phone: req.body.phone,
        },
      ]);
      url = "http://localhost:3001/payoutNonInr";
    } else {
      jrequest = JSON.stringify([
        {
          TransactionID: req.body.transaction_id,
          MemberID: merchant[0].id,
          CurrencyCode: req.body.currency,
          BankCode: req.body.bankcode,
          ToAccountNumber: req.body.account_no,
          ToAccountName: req.body.account_name,
          ToProvince: req.body.province,
          ToCity: req.body.city,
          ToBranch: req.body.branch,
          ToAddress: req.body.address,
          Email: req.body.email,
          Phone: req.body.phone,
          Amount: req.body.amount,
          Note: req.body.notes,
          Optional: {
            AccountType: "CHECKING",
            Method: "bank-transfer-br",
            DocumentNumber: "21532652313",
            DocumentType: "CPF",
            Region: "Amazonas",
          },
        },
      ]);
      url = "http://localhost:3001/payoutNonInr";
    }

    let enc_data = encryptedValueNew(
      jrequest,
      merchant[0].id,
      merchant[0].secretkey,
      merchant[0].sec_iv,
    );

    let utoken = Buffer.from(
      `${merchant[0].id}::${merchant[0].secretkey}`,
    ).toString("base64");

    let data1 = {
      enc_payout_json: enc_data,
      end_point_url: end_point_url,
      callback_url:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
    };
    let req_data = JSON.stringify(data1);
    let resdata = JSON.parse(req_data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3001/payoutNonInr",
      headers: {
        "X-API-KEY": "bankconnect_123",
        "User-token": utoken,
        Authorization:
          "Basic YmFua2Nvbm5lY3Rfc2VjdXJlX0FQSTpwYXNzd29yZF9zZWN1cmVfQVBJ",
      },
      data: resdata,
    };

    const response = await axios.request(config);
    // return res.send(response.data)
    let encrpyted = response.data;

    if (encrpyted.status === false) {
      return res.status(400).json(encrpyted);
    }

    let data = decryptedValueNew(
      encrpyted,
      merchant[0].id,
      merchant[0].secretkey,
      merchant[0].sec_iv,
    );

    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error",
      error,
    });
  }
};

function encryptedValueNew(id, merchantId, merchantSecret, merchantiv) {
  try {
    sample_string = btoa(id); // Convert json into base-64
    const algorithm = "aes-128-ctr"; // algoritm name
    const encryption_iv = merchantiv.substring(0, 16); // assigning merchantiv to encryption_iv, it should be 16 digits
    let encryption_key = crypto
      .createHash("md5")
      .update(merchantId + merchantSecret)
      .digest("hex")
      .substring(0, 16); // Creation of encryption key i.e. md5 then substring it to 16 digit
    const cipher = crypto.createCipheriv(
      algorithm,
      encryption_key,
      encryption_iv,
    ); // creation of cipher
    let encryption = btoa(
      cipher.update(sample_string, "utf-8", "base64") + cipher.final("base64"),
    ); // updation of cipher using json data and then conversion into base-64
    return encryption; // returning  the final encrypted json data
  } catch (ex) {
    return ex; // return the exception
  }
}

function decryptedValueNew(
  encrypted_msg,
  merchantId,
  merchantSecret,
  merchantiv,
) {
  try {
    encrypted_msg = atob(encrypted_msg); // re-convert encrpyted base-64 to encrypted data
    const algorithm = "aes-128-ctr"; // algoritm name
    const encryption_iv = merchantiv.substring(0, 16); // assigning merchantiv to encryption_iv
    let encryption_key = crypto
      .createHash("md5")
      .update(merchantId + merchantSecret)
      .digest("hex")
      .substring(0, 16); // Creation of encryption key i.e. md5 then substring it to 16 digit
    const decipher = crypto.createDecipheriv(
      algorithm,
      encryption_key,
      encryption_iv,
    ); // creation of decipher
    let decryption = atob(
      decipher.update(encrypted_msg, "base64", "utf-8") +
        decipher.final("utf-8"),
    ); // creating base-64 using decipher and then conversion into json data
    return JSON.parse(decryption); // returning json data after parsing.
  } catch (ex) {
    return ex; // return the Exception
  } finally {
    return res.status(500).json({
      message: "Encryption Function successfully executed",
    });
  }
}

function isJSON(string) {
  try {
    JSON.parse(string);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports.h2hPayment = async (req, res) => {
  try {
    let {
      order_id,
      merchantno,
      amount,
      fname,
      lname,
      email,
      mobile_no,
      state,
      city,
      country,
      secretkey,
      address,
      pincode,
      callback_url,
      return_url,
      description,
      orderAmount,
      txStatus,
      pay_by,
      upi_id,
      paymentCode,
      language,
    } = req.body;

    let reqdata = {
      order_id: order_id,
      merchantno: merchantno,
      fname: fname,
      lname: lname,
      email: email,
      mobile_no: mobile_no,
      state: state,
      city: city,
      country: country,
      secretkey: secretkey,
      address: address,
      pincode: pincode,
      callback_url: callback_url,
      return_url: return_url,
      description: description,
      orderAmount: orderAmount,
      txStatus: txStatus,
      pay_by: pay_by,
      upi_id: upi_id,
      paymentCode: paymentCode,
      language,
    };
    let config = {
      method: "POST",
      url: `http://localhost:3001/check`,
      header: {
        "Content-Type": "application/json",
      },
      data: reqdata,
    };
    let response = await axios(config);
    return res.send(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error",
      error,
    });
  }
};

module.exports.check = async (req, res) => {
  let data = req.body;
  return res.send(data);
};

module.exports.flutterwebss = async (req, res) => {
  try {
  
    const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY ;
    const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY;
    const FLW_ENCRYPTION_KEY = process.env.FLW_ENCRYPTION_KEY ;

    const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);
    let order_id = 'ANISHA' + Date.now();
    let payload = {
      card_number: '4017040888032736',
      cvv: '704',
      expiry_month: '11',
      expiry_year: '29',
      currency: 'NGN',
      amount: '7500',
      email: 'user@example.com',
      fullname: 'Flutterwave Developers',
      tx_ref: order_id,
      redirect_url: 'https://example_company.com/success',
      enckey: FLW_ENCRYPTION_KEY,
      authorization: {
        mode: 'pin',
        pin: '3310'
      }
    };
    

    let response = await flw.Charge.card(payload);
    let flw_ref = response.data.flw_ref

    let validateresponse = await flw.Charge.validate({
      otp: '12345',
      flw_ref: flw_ref
    });

    let transactionId = validateresponse.data.id;
    let verifyResponse =  await flw.Transaction.verify({
        id: transactionId
    });
    return res.status(200).json(verifyResponse);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'error',
      error: error.message
    });
  }
};


// function encrypt(encryptionKey, payload) {
//   const text = JSON.stringify(payload);
//   const cipher = forge.cipher.createCipher(
//       "3DES-ECB",
//       forge.util.createBuffer(encryptionKey)
//   );
//   cipher.start({iv: ""});
//   cipher.update(forge.util.createBuffer(text, "utf-8"));
//   cipher.finish();
//   const encrypted = cipher.output;
//   return forge.util.encode64(encrypted.getBytes());
// }

module.exports.flutterweb = async (req, res) => {
  try {
    const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY 
    const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY 
    const FLW_ENCRYPTION_KEY = process.env.FLW_ENCRYPTION_KEY
    let order_id = 'ANISHA' + Date.now();

    const payload = {
      card_number: '5531886652142950',
      cvv: '564',
      expiry_month: '09',
      expiry_year: '32',
      currency: 'NGN',
      amount: '7500',
      email: 'user@example.com',
      fullname: 'Flutterwave Developers',
      tx_ref: order_id,
      redirect_url: 'https://example_company.com/success',
      authorization: {
        mode: 'pin',
        pin: '3310'
      }
    }

    const encryptedPayload = encrypt(FLW_ENCRYPTION_KEY, payload);

    const chargeUrl = 'https://api.flutterwave.com/v3/charges?type=card';

    const chargeHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FLW_SECRET_KEY}`
    };

    const chargeResponse = await axios.post(chargeUrl, { client: encryptedPayload }, { headers: chargeHeaders });

    const flw_ref = chargeResponse.data.data.flw_ref;
    
    const validateUrl = 'https://api.flutterwave.com/v3/validate-charge';
    const validateHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FLW_SECRET_KEY}`
    };

    const validatePayload = {
      otp: '12345',
      flw_ref: flw_ref
    };

    const validateResponse = await axios.post(validateUrl, validatePayload, { headers: validateHeaders });

    const transactionId = validateResponse.data.data.id;

    const verifyUrl = `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FLW_SECRET_KEY}` 
    };

    const verifyResponse = await axios.get(verifyUrl, { headers });

    console.log('Transaction Verification Response:', verifyResponse.data);

    return res.status(200).json(verifyResponse.data);

  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
    return res.status(500).json({
      message: 'error',
      error: error.response ? error.response.data : error.message
    });
  }
};

// module.exports.flutterweb3d = async (req, res) => {
//   try {
//     const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY ;
//     const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY
//     const FLW_ENCRYPTION_KEY = process.env.FLW_ENCRYPTION_KEY ;
//     const transactionStore = {};
//     const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);

//     const order_id = 'ANISHA' + Date.now();

//     const payload = {
//       card_number: '5438898014560229', 
//       cvv: '564',
//       expiry_month: '10',
//       expiry_year: '31',
//       currency: 'NGN',
//       amount: '7500',
//       email: 'user@example.com',
//       fullname: 'Flutterwave Developers',
//       tx_ref: order_id,
//       redirect_url: 'https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php',
//       enckey: FLW_ENCRYPTION_KEY,
//     };


//     const response = await flw.Charge.card(payload);

//     if (response.status === 'success' && response.meta.authorization.mode === 'redirect') {
//       const transactionId = response.data.id;
//       const txRef = response.data.tx_ref;
//       const authUrl = response.meta.authorization.redirect;

//       transactionStore[txRef] = transactionId;

//       return res.send(authUrl);
//     } else {
//       return res.status(400).json({
//         message: 'Authorization mode not supported',
//         data: response.data
//       });
//     }
//   } catch (error) {
//     console.error('Payment processing error:', error);
//     return res.status(500).json({
//       message: 'An error occurred during payment processing',
//       error: error.message
//     });
//   }
// };


module.exports.flutterweb3dhttp = async (req, res) => {
  try {
    const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
    const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY
    const FLW_ENCRYPTION_KEY = process.env.FLW_ENCRYPTION_KEY ;
    const transactionStore = {};
    const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);
    // let ExpirationYear = expirationYear.toString().slice(-2).padStart(2, '0');
    const payload = {
      card_number: '5438898014560229',
      cvv: '564',
      expiry_month: '10',
      expiry_year: '31',
      currency: 'NGN',
       email: 'anisha16rawat@gmail.com',
      fullname: 'Flutterwave Developers',
      tx_ref: 'bsbvxg478',
      redirect_url: 'https://bankconnect.live/casino/bizera',
      enckey: FLW_ENCRYPTION_KEY,
    };
    const response = await flw.Charge.card(payload);
    return res.send(response)
    const encryptedPayload = encrypt(FLW_ENCRYPTION_KEY, payload)

    // const response = await axios.post('https://api.flutterwave.com/v3/charges?type=card', encryptedPayload, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${FLW_SECRET_KEY}`
    //   }
    // });

    

    if (response.data.status === 'success' && response.data.meta.authorization.mode === 'redirect') {
      const transactionId = response.data.data.id;
      const txRef = response.data.data.tx_ref;
      const authUrl = response.data.meta.authorization.redirect;

      transactionStore[txRef] = transactionId;

      return res.send(authUrl);
    } else {
      return res.status(400).json({
        message: 'Authorization mode not supported',
        data: response.data
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({
      message: 'An error occurred during payment processing',
      error: error.message
    });
  }
};


function encrypt(encryptionKey, payload) {
    const text = JSON.stringify(payload);
    const cipher = forge.cipher.createCipher('3DES-ECB', forge.util.createBuffer(encryptionKey));
    cipher.start({ iv: '' });
    cipher.update(forge.util.createBuffer(text, 'utf-8'));
    cipher.finish();
    const encrypted = cipher.output;
    return forge.util.encode64(encrypted.getBytes());
}

module.exports.flutterweb3d = async (req, res) => {
  try {
    const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
    const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY
    const FLW_ENCRYPTION_KEY = process.env.FLW_ENCRYPTION_KEY ;
    const transactionStore = {};

    const order_id = 'ANISHA' + Date.now();

    const payload = {
      card_number: '5438898014560229',
      cvv: '564',
      expiry_month: '10',
      expiry_year: '31',
      currency: 'NGN',
      amount: '7500',
      email: 'user@example.com',
      fullname: 'Flutterwave Developers',
      tx_ref: order_id,
      redirect_url: 'https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php',
    };

    const encryptedPayload = {
      client: encrypt(FLW_ENCRYPTION_KEY, payload)
    };

    const response = await axios.post('https://api.flutterwave.com/v3/charges?type=card', encryptedPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FLW_SECRET_KEY}`
      }
    });

    if (response.data.status === 'success' && response.data.meta.authorization.mode === 'redirect') {
      const transactionId = response.data.data.id;
      const txRef = response.data.data.tx_ref;
      const authUrl = response.data.meta.authorization.redirect;

      transactionStore[txRef] = transactionId;

      return res.send(authUrl);
    } else {
      return res.status(400).json({
        message: 'Authorization mode not supported',
        data: response.data
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({
      message: 'An error occurred during payment processing',
      error: error.message
    });
  }
};

// FLWPUBK-a8630a1851860da39c695f28ad4c65de-X
// FLWSECK-8423a35f47d417439fff5fd2ec5ae2c9-190a06cb528vt-X
// 8423a35f47d4cc753f1023a4

module.exports.convergeGate = async (req, res) => {
  try {
    let apiUser = "456fdfchg";
    let apiPassword = "teedsgffcgh";
    let apiCmd = "700";
    let amount = "10.00";
    let curcode = "EUR";
    let ccnumber = "9653231562";
    let cccvv = "138";
    let nameoncard = "Anisha";
    let expmonth = "12";
    let expyear = "2028";

    const merchanttransids = "ANISHA" + Date.now();
    const apiKey = "0F8A5F54-3D61-98AF-BEDA-EFB004CC0F04";

    const checksumString =
      apiUser +
      apiPassword +
      apiCmd +
      merchanttransids +
      amount +
      curcode +
      ccnumber +
      cccvv +
      nameoncard +
      apiKey;

    const checkSums = crypto
      .createHash("sha1")
      .update(checksumString)
      .digest("hex");

    const reqData = {
      apiUser: apiUser,
      apiPassword: apiPassword,
      apiCmd: apiCmd,
      transaction: {
        merchanttransid: merchanttransids,
        amount: amount,
        curcode: curcode,
        description: "Test",
      },
      customer: {
        firstname: "anisha ",
        lastname: "rawat",
        birthday: "29",
        birthmonth: "02",
        birthyear: "1920",
        email: "aks@gmail.com",
        countryiso: "FR",
        stateregioniso: "Miami",
        zippostal: "33122",
        city: "Florida",
        address1: "123 ave test",
        phone1phone: "+1234567890",
        accountid: "adfed1234",
        ipaddress: "192.185.129.71",
      },
      creditcard: {
        ccnumber: ccnumber,
        cccvv: cccvv,
        expmonth: expmonth,
        expyear: expyear,
        nameoncard: nameoncard,
        billingcountryiso: "IND",
        billingstateregioniso: "IND",
        billingzippostal: "201301",
        billingcity: "Noida",
        billingaddress1: "Noida",
        billingphone1phone: "8541236989",
        returnurl:
          "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php",
      },
      checksum: checkSums,
      auth: {
        type: "3DS",
      },
    };

    const config = {
      method: "POST",
      url: "https://testapi.convergegate.com/v1/transactions ",
      headers: {
        "Content-Type": "application/json",
      },
      data: reqData,
    };
    const response = await axios(config);
    const parser = new xml2js.Parser();
    const result = await new Promise((resolve, reject) => {
      parser.parseString(response.data, (err, parsedResult) => {
        if (err) {
          reject(new Error("Error parsing response"));
        } else {
          resolve(parsedResult);
        }
      });
    });
    return res.send(result);
  } catch (error) {
    return res.status(500).json({
      message: "error",
    });
  }
};

// module.exports.convergeGateStatus = async(req,res)=>{
//   let gatetransid = 'BC386936-54A3-AD1C-E5BF-CB95D1F0AED0'
//   let apiUser = '3979uBk'
//   let apiPassword = 'e88145bc9102'
//   let apiCmd = '709'
//   let merchanttransid = 'UB-9713640489'
//   let apiKey = 'AD3E57A0-8C38-3AD3-BFDD-4C8C3BA12008'
//   const checksumString = (apiUser + apiPassword + apiCmd + merchanttransid + apiKey )
//   let checkSum = crypto.createHash('sha1').update(checksumString).digest('hex');
//   let reqData = {
//     transaction : {
//       apiUser : apiUser,
//       apiPassword : apiPassword,
//       apiCmd : apiCmd,
//       merchanttransid : merchanttransid,
//       checksum : checkSum
//     }
//   }
//   const config = {
//     method: "POST",
//     url: 'https://testapi.convergegate.com/v1/transactions',
//     headers: {
//       "Content-Type": "application/xml",
//     },
//     data: reqData,
//   };
//   const response = await axios(config);
//   return res.send(response.data);
// }

module.exports.convergeGateStatus = async (req, res) => {
  let apiUser = "3979uBk";
  let apiPassword = "e88145bc9102";
  let apiCmd = "709";
  let merchanttransid = "ANISHA1733209704122";
  let apiKey = "AD3E57A0-8C38-3AD3-BFDD-4C8C3BA12008";

  const checksumString =
    apiUser + apiPassword + apiCmd + merchanttransid + apiKey;

  let checkSum = crypto.createHash("sha1").update(checksumString).digest("hex");

  let reqData = {
    transaction: {
      apiUser: apiUser,
      apiPassword: apiPassword,
      apiCmd: apiCmd,
      merchanttransid: merchanttransid,
      checksum: checkSum,
    },
  };

  const builder = new xml2js.Builder({ headless: true });
  const xmlRequest = builder.buildObject(reqData);

  const config = {
    method: "POST",
    url: "https://testapi.convergegate.com/v1/transactions",
    headers: {
      "Content-Type": "application/xml",
    },
    data: xmlRequest,
  };

  const response = await axios(config);
  return res.send(response.data);
};

module.exports.piniklePSP = async (req, res) => {
  let apiKey =
    "eyJ0eXAiOiJKV1QiLCJhhfdgfhjklhgfdsfghjkY3ODQ1OTg5YTc4NTE3NWVkN2EzYWI3OGEwOGI1MDkxYzcwOGFiNjc1M2Y4ZmFkMDM4NDdmY2YyNWUyMTNiZjYiLCJpYXQiOjE3MjQ4MzE2MDcuNTE3NTYxLCJuYmYiOjE3MjQ4MzE2MDcuNTE3NTY2LCJleHAiOjE3NTYzNjc2MDcuNDczODU5LCJzdWIiOiI1OCIsInNjb3BlcyI6W119.Qu37sdTGFXGYHCJHVJHBMHBQRKNkQjSTtXf3iwardAnt9xJ2rhKmzzRGjYdprBgvWuEl_rloTZyrY-R6K8GLQoAQFucieGXyNjVnMVb4FuitKlH6J8MSYecBfVb-yG8ufAgh0syDcczTwwlj2z3jiOALyU_TOXgj8D-jdMG5pXb_s_4rAEghDKGuPsvdCbWKrDHszB3U1cJvRpMkKF3bD_yekI2ItQzXXpRuX_JaV65Nm3bxARcGPf_-Gx0OY1CRPyUvB8hhIEgmVeN5stHbuyUxX5YTbf_uy3zxBJLf2_vjrzn9I7JrE1bq1iJwS7PVD0qg2Fm2PbcX-C7h3mHCWmgh3OeBBmIEk4VlFBBfrT7GNYWjrLzixYXfCJ9qCMI_cgD6FyMSf1W2MGkdDzGLCrcxq8yeKWssEQefVCaUII";

  let reqData = {
    amount: "150",
    currency: "USD",
    mobileNumber: "8541236989",
    email: "aks@gmail.com",
    firstName: "anisha",
    lastName: "rawat",
    success_url: "https://www.yahoo.com",
    fail_url: "https://www.twitter.com",
    cancel_url: "https://www.twitter.com",
  };

  const config = {
    method: "POST",
    url: "https://sandbox-api.pinikle.com/api/listOfPayments",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    data: reqData,
  };

  const response = await axios(config);

  let responsedata = response.data;

  let initiatedata = {
    refid: responsedata.refid,
    gateway: responsedata.data[0].gateway,
    subPaymentId: responsedata.data[0].subPaymentId,
  };

  const configInitiate = {
    method: "POST",
    url: "https://sandbox-api.pinikle.com/api/initiatePayment",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    data: initiatedata,
  };
  const responseInitate = await axios(configInitiate);
  return res.send(responseInitate.data);
};

module.exports.statusPinikle = async (req, res) => {
  let apiKey =
    "eyJ0eXAiOiJKV1QiLCJhbdsffgfrthyjhkmjnbvcxvYjY5NTA5YzIzMjZiZGY3ODQ1OTg5YTc4NTE3NWVkN2EzYWI3OGEwOGI1MDkxYzcwOGFiNjc1M2Y4ZmFkMDM4NDdmY2YyNWUyMTNiZjYiLCJpYXQiOjE3MjQ4MzE2MDcuNTE3NTYxLCJuYmYiOjE3MjQ4MzE2MDcuNTE3NTY2LCJleHAiOjE3NTYzNjc2MDcuNDczODU5LCJzdWIiOiI1OCIsInNjb3BlcyI6W119.Qu37sdTSxt0BRiBBHfZsh3sKlIBMA2LCu_-4to_7H7AlRheeFNSFwinnfjQHxmyLXgkrcugCpvKDkeH90JOiHhAgzqae-qHKl3SBY70TPhrXoW4nkcsJogWzNo8XIdiXtZX54-Nc8unu5LkJbMr-WFaWCJTEcSraxiFkshSxjGX9R5cLgenOVEpvZ1GrKyWDiZLokWO8Ic6L00_2Gsk_8vqfgYZPSlhnJf2NF5Iou-xTGcUExzK27ejE--_LcUZ4qTlJkMZYFrxRqzNYShSg_C-pQRKNkQjSTtXf3iwardAnt9xJ2rhKmzzRGjYdprBgvWuEl_rloTZyrY-R6K8GLQoAQFucieGXyNjVnMVb4FuitKlH6J8MSYecBfVb-yG8ufAgh0syDcczTwwlj2z3jiOALyU_TOXgj8D-jdMG5pXb_s_4rAEghDKGuPsvdCbWKrDHszB3U1cJvRpMkKF3bD_yekI2ItQzXXpRuX_JaV65Nm3bxARcGPf_-Gx0OY1CRPyUvB8hhIEgmVeN5stHbuyUxX5YTbf_uy3zxBJLf2_vjrzn9I7JrE1bq1iJwS7PVD0qg2Fm2PbcX-C7h3mHCWmgh3OeBBmIEk4VlFBBfrT7GNYWjrLzixYXfCJ9qCMI_cgD6FyMSf1W2MGkdDzGLCrcxq8yeKWssEQefVCaUII";

  let reqData = {
    refid: "ae64c4fa-37a6-410e-8db1-9169c3be02cc",
    gateway: "worldwidecc",
  };

  const config = {
    method: "POST",
    url: "https://sandbox-api.pinikle.com/api/checkPaymentStatus",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    data: reqData,
  };

  const response = await axios(config);
  return res.send(response.data);
};

function parseBigInteger(b64) {
  const decoded = Buffer.from(b64, "base64");
  const hex = decoded.toString("hex");
  return new forge.jsbn.BigInteger(hex, 16);
}

function encryptForge(data, rsaPubKey) {
  const rsaKeyValue = Buffer.from(
    rsaPubKey.replace("4096!", ""),
    "base64",
  ).toString();

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rsaKeyValue, "text/xml");
  const modulus = xmlDoc.getElementsByTagName("Modulus")[0].textContent;
  const exponent = xmlDoc.getElementsByTagName("Exponent")[0].textContent;

  const modulusBI = parseBigInteger(modulus);
  const exponentBI = parseBigInteger(exponent);

  const publicKey = forge.pki.setRsaPublicKey(modulusBI, exponentBI);
  const encrypted = publicKey.encrypt(data, "RSAES-PKCS1-V1_5");

  return Buffer.from(encrypted, "binary").toString("base64");
}

module.exports.transactpay = async (req, res) => {
  try {
    const order_id = "ANISHA" + Date.now();
    const data = {
      customer: {
        firstname: "transact",
        lastname: "pay",
        mobile: "+2348134543421",
        country: "NG",
        email: "email@transactpay.ai",
      },
      order: {
        amount: 100,
        reference: order_id,
        description: "Pay",
        currency: "USD",
      },
      payment: {
        RedirectUrl:
          "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php",
      },
    };

    const rsaPubKey =
      "NDA5NiE8UlNBS2V5VmFsdWUsdfghjknmbvcxdgfchngjh1cyblhpeDJLYmZ6Rjg5blpBWEpXWkdweVQxVXJMNzBaU2dpeUErODJMVE1YSHZNZ3FjdW5UL215RW4veXRZdXJGL2RhOGgxZndwNjRXSGJBNHZWNW1SNS9uUmV6dlFCdGsxaDArVHhGR3NnMm1Ic1BQT01lbkhjLzQ2ZGlIb0NvbmlGRVpsWHZ6RzRDeVg4eHowWDdwSGZYcnBmY0VrWWZXams4MXFMMkpjMFdTTTNVMEdFQ0Rtb0tMUjdYSEJBOHFqWXZ4RkdvV2s0WlFDS2djVHdiR0JmNGNwUTIvZC9uUm84SHlwcDRMMVVpR0EwejZNOERGUWxFN09WYWF1cWNoM2hRcTFreTBIU3Z0ck1DeXhaY25OMGkvRDRqWmpacWZDTkxvMDVPTnJyZVQ5S2hMRG1YK0FELzJCOGdZSzVCQlNuMVJ4dU1IQVcvZ29ibGl6RFZqQXVSZVFqeG1JdnhSVkZMREtZbEE5K0s0MUxvNzhQS1JUK1o4eTdHWklPbHNxb3dpRFdWTU9tKzN1a1c5VEFxMFBJTGR6WUdidC9TVmZwYUVlK3grNDc5aGpMMUNNaEk1WnhMRU5ucjdjODJCK3VsNThVeDlUd2tETXJMcGdJdFh4d0lvMHRjUFZqak9idHZ4NkEvcVNvZ0YxaG9sNGd5NWlic1JPUUZYOWYwb2loQ3dCRFN0N2pRWXUyU0E1UEVtbm00UmcwOEhCYVorVnRHNEh6S1BHeWI4NVUxWHJwUDRsQ2IxMVArbFFIYTVyRGRYbldUZ2RIUWRRVGZXM0l4QTJhcGJWUHRQaXdmQXA4Yk1HdkdsWmg2YkJLUTRQRWZqUUtpVm5OczNLWUFrL05mckxwWllDbWNPQi83cjB4aTdpK1U9PC9Nb2R1bHVzPjxFeHBvbmVudD5BUUFCPC9FeHBvbmVudD48L1JTQUtleVZhbHVlPg==";

    const encryptedData = encryptForge(JSON.stringify(data), rsaPubKey);

    const payload = {
      data: encryptedData,
    };

    const config = {
      method: "POST",
      url: "https://payment-api-service.transactpay.ai/payment/order/create",
      headers: {
        "api-key": "PGW-PUBLICKEY-TEST-C11A46BF1E2746A3806F8F79FA647D5A",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload),
    };

    const response = await axios(config);
    let responsedata = response.data;
    let orderReference = responsedata.data.order.reference;

    let resdata = {
      reference: orderReference,
      paymentoption: "C",
      country: "NG",
      card: {
        cardnumber: "5123450000000008",
        expirymonth: "01",
        expiryyear: "29",
        cvv: "100",
        // "authOption": "NOAUTH"
      },
    };

    const encryptedDataurl = encryptForge(JSON.stringify(resdata), rsaPubKey);

    const payload1 = {
      data: encryptedDataurl,
    };
    const configdata = {
      method: "POST",
      url: "https://payment-api-service.transactpay.ai/payment/order/pay",
      headers: {
        "api-key": "PGW-PUBLICKEY-TEST-C11A46BF1E2746A3806F8F79FA647D5A",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload1),
    };

    const responseurl = await axios(configdata);
    let responsedataurl = responseurl.data;
    return res.send(responsedataurl);
  } catch (error) {
    console.error(
      "Error occurred:",
      error.response ? error.response.data : error.message,
    );
    return res
      .status(400)
      .send({
        error: error.response ? error.response.data : "Something went wrong",
      });
  }
};

module.exports.transactpayStatus = async (req, res) => {
  try {
    const data = {
      reference: "ANISHA1729245426279",
    };

    const rsaPubKey =
      "NDA5NiE8UlNBS2V5VmFsdWU+PE1vZHVsdXM+dE9ZMlBHRXRDTFRFY24zQWpid1cyblhpeDJLYmZ6Rjg5blpBWEpXWkdweVQxVXJMNzBaU2dpeUErODJMVE1YSHZNZ3FjdW5UL215RW4veXRZdXJGL2RhOGgxZndwNjRXSGJBNHZWNW1SNS9uUmV6dlFCdGsxaDArVHhGR3NnMm1Ic1BQT01lbkhjLzQ2ZGlIb0NvbmlGRVpsWHZ6RzRDeVg4eHowWDdwSGZYcnBmY0VrWWZXams4MXFMMkpjMFdTTTNVMEdFQ0Rtb0tMUjdYSEJBOHFqWXZ4RkdvV2s0WlFDS2djVHdiR0JmNGNwUTIvZC9uUm84SHlwcDRMMVVpR0EwejZNOERGUWxFN09WYWF1cWNoM2hRcTFreTBIU3Z0ck1DeXhaY25OMGkvRDRqWmpacWZDTkxvMDVPTnJyZVQ5S2hMRG1YK0FELzJCOGdZSzVCQlNuMVJ4dU1IQVcvZ29ibGl6RFZqQXVSZVFqeG1JdnhSVkZMREtZbEE5K0s0MUxvNzhQS1JUK1o4eTdHWklPbHNxb3dpRFdWTU9tKzN1a1c5VEFxMFBJTGR6WUdidC9TVmZwYUVlK3grNDc5aGpMMUNNaEk1WnhMRU5ucjdjODJCK3VsNThVeDlUd2tETXJMcGdJdFh4d0lvMHRjUFZqak9idHZ4NkEvcVNvZ0YxaG9sNGd5NWlic1JPUUZYOWYwb2loQ3dCRFN0N2pRWXUyU0E1UEVtbm00UmcwOEhCYVorVnRHNEh6S1BHeWI4NVUxWHJwUDRsQ2IxMVArbFFIYTVyRGRYbldUZ2RIUWRRVGZXM0l4QTJhcGJWUHRQaXdmQXA4Yk1HdkdsWmg2YkJLUTRQRWZqUUtpVm5OczNLWUFrL05mckxwWllDbWNPQi83cjB4aTdpK1U9PC9Nb2R1bHVzPjxFeHBvbmVudD5BUUFCPC9FeHBvbmVudD48L1JTQUtleVZhbHVlPg==";

    const encryptedData = encryptForge(JSON.stringify(data), rsaPubKey);

    const payload = {
      data: encryptedData,
    };

    const config = {
      method: "POST",
      url: "https://payment-api-service.transactpay.ai/payment/order/status",
      headers: {
        "api-key": "PGW-PUBLICKEY-TEST-C11A46BF1E2746A3806F8F79FA647D5A",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload),
    };

    const response = await axios(config);
    let responsedata = response.data;
    return res.send(responsedata);
  } catch (error) {
    console.error(
      "Error occurred:",
      error.response ? error.response.data : error.message,
    );
    return res
      .status(400)
      .send({
        error: error.response ? error.response.data : "Something went wrong",
      });
  }
};

module.exports.pay_every = async (req, res) => {
  try {
    let key = "sk_test7duqck8bsfdghjkopojgho3ffj";
    let clientId = "gfchgvg";
    let order_id = "TestSandbox_02";
    const Tamount = parseFloat(10.1);
    // let payload =
    // {
    //     "reference": "TestSandb455ox334_07",
    //     "amount": 10.00,
    //     "currency": "USD",
    //     "callbackUrl": "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
    //     "customerName": "aks",
    //     "customerEmail": "aks@gmail.com",
    //     "customerPhone": "08400137432",
    //     "cardDetails": {
    //       "expiryMonth": "01",
    //       "expiryYear": "39",
    //       "cvv": "100",
    //       "cardNumber": "450814521741019"
    //     }
    // }

    const data = {
      reference: "Ubanktest001",
      amount: "10.00",
      currency: "NGN",
      callbackUrl:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
      customerName: "Jon Doe",
      customerEmail: "jondoe@examplmail.com",
      customerPhone: "8030000000",
      cardDetails: {
        expiryMonth: "12",
        expiryYear: "28",
        cvv: "138",
        cardNumber: "5376523683730622",
      },
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://devbox.paydestal.com/pay/api/v1/card/init?clientId=${clientId}`,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    // return res.send(config.data)

    const response = await axios.request(config);
    let bankdataResponse = response.data;

    return res.send(bankdataResponse);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
};

module.exports.instaExchange = async (req, res) => {
  let data = {
    accountRefId: "suycz2st6yf8ons6s7hctd5k",
    fromAmount: 10.0,
    fromCurrency: "USD",
    address: "TRDRhMRF9x1yiVdQeNDtipwDQ9YnYNZu6K",
    amountDirection: "sending",
    returnUrl:
      "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php",
    method: "card",
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://instaxchange.com/api/session`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  // return res.send(config.data)

  const response = await axios.request(config);
  let bankdataResponse = response.data;
  return res.send(bankdataResponse);
};

const FormData = require("form-data");
const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY ;
const SUMSUB_BASE_URL = "https://api.sumsub.com";

function createSignature(url, method, data = null) {
  const ts = Math.floor(Date.now() / 1000);
  const signature = crypto.createHmac("sha256", SUMSUB_SECRET_KEY);
  signature.update(`${ts}${method.toUpperCase()}${url}`);

  if (data instanceof FormData) {
    signature.update(data.getBuffer());
  } else if (data) {
    signature.update(data);
  }

  const headers = {
    "X-App-Access-Ts": ts,
    "X-App-Access-Sig": signature.digest("hex"),
    "X-App-Token": SUMSUB_APP_TOKEN,
    Accept: "*/*",
  };
  return headers;
}

async function getWebSDKLink(levelName, userId) {
  const url = `/resources/sdkIntegrations/levels/${encodeURIComponent(levelName)}/websdkLink?externalUserId=${userId}`;
  const method = "POST";

  const headers = createSignature(url, method);

  const response = await fetch(SUMSUB_BASE_URL + url, {
    method: method,
    headers: headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return data;
}

async function resetUserProfile(userId) {
  const url = `/resources/applicants/${userId}/reset`;
  const method = "POST";

  const headers = createSignature(url, method);

  const response = await fetch(SUMSUB_BASE_URL + url, {
    method: method,
    headers: headers,
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(response);
    throw new Error(error);
  }

  const data = await response.json();
  return data;
}

async function checkUserStatus(userId) {
  const SUMSUB_BASE_URL = "https://api.sumsub.com";
  const urls = `${SUMSUB_BASE_URL}/resources/applicants/-;externalUserId=${userId}/one`;

  const url = `/resources/applicants/-;externalUserId=${userId}/one`;
  const method = "GET";

  const headers = createSignature(url, method);
  const response = await fetch(urls, {
    method: method,
    headers: headers,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Error fetching user status:", error);
    return res
      .status(500)
      .send({ error: error.description || "Failed to fetch user status" });
  }

  const data = await response.json();
  return data;
}

module.exports.checkUserStatusR = async (req, res) => {
  let userid = "123";
  let srtatusresponse = await checkUserStatus(userid);

  let reviewStatus = srtatusresponse.review?.reviewStatus;

  return res.send(reviewStatus);
};

async function generate(userId) {
  const externalUserId = userId;
  const levelName = "basic-kyc-level";

  try {
    const response = await getWebSDKLink(levelName, externalUserId);
    console.log("Web SDK Link Response:\n", response);
    return response.url;
  } catch (error) {
    console.error(error);
  }
}

async function reGenerate(userId) {
  const externalUserId = userId;
  const levelName = "basic-kyc-level";

  try {
    const userData = await checkUserStatus(externalUserId);
    console.log("User Status Response:\n", userData);

    await resetUserProfile(userData.id);

    const response = await getWebSDKLink(levelName, externalUserId);
    // console.log("Web SDK Link Response:\n", response);
    return response.url;
  } catch (error) {
    console.error(error);
  }
}

module.exports.phpnibbl = async (req, res) => {
  try {
    // Step 1: Generate Token
    const tokenResponse = await axios.post(
      "https://api.nimbbl.tech/api/v3/generate-token",
      {
        access_key: "access_key_mZR7lk6AG9n9109p",
        access_secret: "access_secret_GZ3pwjw96J4djvbM",
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    const accessToken = tokenResponse.data.token;

    const totalAmount = 497.77;
    const email = "adarsh@gmail.com";
    const orderId = "Nimbll" + Date.now();
    function generateRandomIndianIp() {
      const firstOctet = 49;
      const secondOctet = Math.floor(Math.random() * (63 - 32 + 1)) + 32;
      const thirdOctet = Math.floor(Math.random() * 256);
      const fourthOctet = Math.floor(Math.random() * 256);
      return `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`;
    }
    const randomIndianIp = generateRandomIndianIp();
    // Step 2: Create Order
    const requestData = {
      amount_before_tax: totalAmount,
      tax: 0,
      total_amount: totalAmount,
      user: {
        email: email,
        first_name: "Adarsh",
        last_name: "Singh",
        country_code: "+91",
        mobile_number: "8929543007",
      },
      shipping_address: {
        address_1: "delhi",
        street: "delhi",
        landmark: "delhi",
        area: "delhi",
        city: "delhi",
        state: "delhi",
        pincode: "229129",
        address_type: "delhi",
      },
      currency: "INR",
      invoice_id: orderId,
      referrer_platform: "string",
      referrer_platform_version: "string",
      ip_address: "103.153.58.59",
      merchant_shopfront_domain: "https://yeppe.in/web/",
      order_line_items: [
        {
          sku_id: "item" + Date.now(),
          title: "Best Sliced Alphonso Mango",
          description: "The Alphonso",
          image_url:
            "https://en.wikipedia.org/wiki/Alphonso_mango#/media/File:Alphonso_mango.jpg",
          rate: 1050,
          quantity: 2,
          amount_before_tax: totalAmount,
          tax: 0.0,
          total_amount: totalAmount,
        },
      ],
      bank_account: {
        account_number: "6048244857",
        name: "Hariox Unit Management Pvt Ltd",
        ifsc: "KKBK0000677",
      },
      custom_attributes: {
        name: "Diana",
        place: "Themyscira",
        animal: "Jumpa",
        thing: "Tiara",
      },
    };

    const orderResponse = await axios.post(
      "https://api.nimbbl.tech/api/v3/create-order",
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const { status, order_id: createdOrderId } = orderResponse.data;
    if (status === "new") {
      // Step 3: Validate VPA
      const vpaData = { upi_id: "8929543007@ptyes" };
      const vpaResponse = await axios.post(
        "https://api.nimbbl.tech/api/v3/validate-vpa",
        vpaData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (vpaResponse.data.isVPAValid) {
        // Step 4: Initiate Payment
        const paymentData = {
          order_id: createdOrderId,
          callback_url:
            "http://yeppe.in/webpayment/phonepe/Phonepe/nibblephonepaycallbackresponse",
          payment_mode_code: "upi",
          payment_flow: "collect",
          upi_id: "8929543007@ptyes",
          device: {
            fingerprint: crypto
              .createHash("md5")
              .update(Date.now().toString())
              .digest("hex"),
            user_agent:
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            ip_address: randomIndianIp,
          },
        };
        const paymentResponse = await axios.post(
          "https://api.nimbbl.tech/api/v3/initiate-payment",
          paymentData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        return res.send(paymentResponse.data);
      } else {
        return res.send("VPA VALIDATION FAILED.");
      }
    }
  } catch (error) {
    console.log(error);
    return (
      res.status(500),
      {
        message: "Internal server error",
        error: error.response ? error.response.data : error.message,
      }
    );
  }
};

module.exports.caresPay = async (req, res) => {
  let order_id = "Anisha" + Date.now();
  let merNo = "100204";
  let amount = "10.00";
  let billNo = order_id;
  let currency = "1";
  let returnURL =
    "https://payoway.com/web/bankpay/Testmrityu/carreturnresponse";
  let notifyUrl =
    "https://payoway.com/web/bankpay/Testmrityu/carespaycallbackresponse";
  let phone = "9784561122";
  let language = "EN";
  let zipCode = "279511";
  let shippingFirstName = "Jane";
  let shippingLastName = "Doe";
  let shippingCountry = "US";
  let shippingState = "CA";
  let shippingCity = "Los Angeles";
  let shippingAddress = "456 Elm St";
  let shippingZipCode = "90002";
  let shippingEmail = "jane.doe@example.com";
  let shippingPhone = "0987654321";
  let key = "Dp}MwSfW";
  let ip = "192.185.129.71";
  let cardnumber = "5123450000000008";
  let expirymonth = "01";
  let expiryyear = "2029";
  let cvv = "100";

  let md5signature = merNo + billNo + currency + amount + returnURL + key;
  let md5Info = crypto.createHash("md5").update(md5signature).digest("hex");

  let request_data = {
    merNo: merNo,
    billNo: billNo,
    currency: "1",
    amount: amount,
    returnURL: returnURL,
    notifyUrl: notifyUrl,
    lastName: "Jane",
    firstName: "Doe",
    country: "US",
    state: "CA",
    city: "Los Angeles",
    address: "456 Elm St",
    zipCode: zipCode,
    email: "jane.doe@example.com",
    phone: phone,
    productInfo: "test",
    shippingFirstName: shippingFirstName,
    shippingLastName: shippingLastName,
    shippingCountry: shippingCountry,
    shippingState: shippingState,
    shippingCity: shippingCity,
    shippingAddress: shippingAddress,
    shippingZipCode: shippingZipCode,
    shippingEmail: shippingEmail,
    shippingPhone: shippingPhone,
    cardNum: cardnumber,
    year: expiryyear,
    month: expirymonth,
    cvv2: cvv,
    ip: ip,
    language: language,
    md5Info: md5Info,
  };

  let data = qs.stringify(request_data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://testurl.carespay.com:28081/carespay/pay",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: "JSESSIONID=0B7DB04C00D03936844B4AF95A5D9456",
    },
    data: data,
  };
  const response = await axios.request(config);
  let bankdataResponse = response.data;
  return res.send(bankdataResponse);
};

module.exports.connPay = async (req, res) => {
  try {
    let token =
      "bt_VsYytGkbUCoFYKWwUpKzjtSSzKKWvhyGEYWbSgnmSUtSXUminrSotnNrjkJSOWiW";
    // 'bt_ohcxvohswxgeqvhrnmzifkyqqodosmdfvjhzbfswopvshknmrmittsclmxlpdqxe'
    let requestorId = "4625";
    let baseReturnUrl =
      "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php/";
    let webhookRef = "0002349-live";
    let DataConnPayreq = {
      order: {
        orderMerchantId: "0002349-live",
        orderDescription: "Description 1",
        orderPurpose: "test",
        orderAmount: "10.00",
        orderCurrencyCode: "EUR",
      },
      browser: {
        ipAddress: "122.160.253.65",
        acceptHeader:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        colorDepth: 24,
        javaEnabled: false,
        javascriptEnabled: true,
        acceptLanguage: "en-GB",
        screenWidth: 412,
        screenHeight: 846,
        timeZone: 0,
        userAgent:
          "Mozilla/5.0 (Linux; Android 10; SM-G965F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/106.0.5249.126 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/391.1.0.37.104;]",
      },
      customer: {
        firstname: "Ubank",
        lastname: "Ubank",
        address: {
          countryCode: "IN",
          stateCode: "DL",
          zipCode: "20394",
          city: "chhatpur",
          line1: "jmd house",
          line2: "string",
        },
        resident: true,
        customerPhone: 37187078730,
        customerEmail: "email@noanymail.com",
      },
      card: {
        // cardNumber: '',
        // cvv2: '',
        // expireMonth: '',
        // expireYear: '',
        // cardPrintedName: ' '
      },
      urls: {
        resultUrl: `${baseReturnUrl}${webhookRef}`,
        cresUrl:
          "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
        webhookUrl:
          "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
        redirectWebhookUrl:
          "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
      },
      paymentMethod: "CARD",
    };

    const config = {
      method: "post",
      url: `https://live.connpay.com/api/payments/sale/${requestorId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: DataConnPayreq,
    };

    const response = await axios(config);
    console.log(response);
    let bankdataResponse = response.data;

    let data2 = {
      orderSystemId: bankdataResponse.orderSystemId,
      orderMerchantId: bankdataResponse.orderMerchantId,
      byCorrelationId: bankdataResponse.correlationId,
    };

    // Wait for 20 seconds before hitting the next URL
    setTimeout(async () => {
      const options = {
        method: "POST",
        url: `https://live.connpay.com/api/payments/status/${requestorId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: ` Bearer ${token}`,
        },
        data: data2,
      };

      const redirectUrlResponse = await axios(options);
      console.log(redirectUrlResponse.data);
      return res.send(redirectUrlResponse.data);
    }, 20000);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.instaXchange = async (req, res) => {
  try {
    const webhookRef1 = "testUsd000113";
    const baseReturnUrl =
      "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php/";
    let requestInstaXchange = {
      accountRefId: "suycz2st6yf8ons6s7hctd5k",
      fromAmount: 100.0,
      toCurrency: "USDT-TRON",
      fromCurrency: "DKK",
      address: "TRDRhMRF9x1yiVdQeNDtipwDQ9YnYNZu6K",
      amountDirection: "sending",
      webhookRef: webhookRef1,
      returnUrl: `${baseReturnUrl}${webhookRef1}`,
      method: "card",
      firstName: "VKR",
      lastName: "TEst",
      email: "vrop@test.gmail",
      country: "DE",
    };

    const config = {
      method: "post",
      url: `https://instaxchange.com/api/session`,
      headers: {
        "Content-Type": "application/json",
      },
      data: requestInstaXchange,
    };

    const response = await axios(config);
    const clonedData = structuredClone(response.data);
    const sessionId = clonedData.id;

    const iframeUrl = ` https://instaxchange.com/embed/${sessionId}`;

    return res.send(iframeUrl);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

// module.exports.aiApi = async(req,res)=>{
//   const { code } = req.body;

//   if (!code) {
//       return res.status(400).json({ error: 'Please provide code for analysis.' });
//   }

//   const OPENAI_API_KEY = process.env.OPENAI_API_KEY

//   const response = await axios.post(
//     'https://api.openai.com/v1/completions',
//     {
//         model: 'code-davinci-002',
//         prompt: `Analyze the following code for bugs, improvements, and best practices:\n\n${code}`,
//         max_tokens: 500,
//         temperature: 0.2
//     },
//     {
//         headers: {
//             Authorization: `Bearer ${OPENAI_API_KEY}`
//         }
//     }
// );
// const suggestions = response.data.choices[0].text;
// return res.send(suggestions)
// }

// module.exports.aronJCB = async (req, res) => {
//   try {
//     let requestData = {
//       aid: 'A0000203',
//       cardNo: '5376523683730622',
//       purchAmount: '1055',
//       expiry: '2812',
//       userId: '32123',
//       url : 'https://threebestrated.in/shopping-malls-in-ghaziabad-up',
//       name: 'anisha',
//       transID: 'UB12334',
//       cardBrand: 'Master',
//       returnUrl: 'https://api.bankconnect.live/callbackAronURl',
//       email: 'anisha@ubankconnect.com',
//     };

//     const urlEncodedData = qs.stringify(requestData);

//     const encodedData = iconv.encode(urlEncodedData, 'euc-kr');

//     const response = await axios.post('https://api.wswitching.com/api/KMPI/start.asp',encodedData, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Content-Encoding': 'euc-kr',
//       },
//     });

//     return res.send(response.data);

//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ error: error.message });
//   }
// };

module.exports.aronJCB = async (req, res) => {
  try {
    let requestData = {
      aid: "A0000203",
      cardNo: "5376523683730622",
      purchAmount: "1055",
      expiry: "2812",
      userId: "32123",
      url: "https://threebestrated.in/shopping-malls-in-ghaziabad-up",
      name: "anisha",
      transID: "UB12332",
      cardBrand: "Master",
      returnUrl: "https://api.bankconnect.live/callbackAronURl",
      email: "anisha@ubankconnect.com",
    };
    const urlEncodedData = qs.stringify(requestData);
    const encodedData = iconv.encode(urlEncodedData, "euc-kr");
    const response = await axios.post(
      "https://api.wswitching.com/api/KMPI/start.asp",
      encodedData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Encoding": "euc-kr",
        },
      },
    );
    return res.send(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
};

module.exports.callbackAronURl = async (req, res) => {
  try {
    let requestData = {
      aid: "A0000202",
      ordr_idxx: "UB12332",
      good_name: "Laptop",
      buyr_name: "Anisha",
      buyr_mail: "anisha@ubankconnect.com",
      good_mny: 1055,
      card_no: "5376523683730622",
      expiry_yy: "28",
      expiry_mm: "12",
      cavv: "",
      xid: "a202ba46-48cf-4ac2-9c84-abe862c1c265",
      eci: "00",
    };

    const urlEncodedData = qs.stringify(requestData);

    const encodedData = iconv.encode(urlEncodedData, "euc-kr");

    const response = await axios.post(
      "https://api.wswitching.com/api/kcp/3d_new/approval.asp",
      encodedData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // URL encoded data type
          "Content-Encoding": "euc-kr", // Using EUC-KR encoding for the content
        },
      },
    );

    return res.send(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
};

module.exports.merchantPaymentStatusUpdateOnEndPoint = async (req, res) => {
  const { fields } = req.body;
  const json_data = JSON.stringify(fields);
  let paymentStaticUrl =
    "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php";
  const response = await fetch(paymentStaticUrl, {
    method: "POST",
    body: json_data,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 0, // No timeout (equivalent to CURLOPT_CONNECTTIMEOUT)
    agent: new https.Agent({ rejectUnauthorized: false }), // Equivalent to CURLOPT_SSL_VERIFYPEER
  });

  if (!response.ok) {
    throw new Error(`HTTP request failed with status ${response.status}`);
  }

  const fileContents = await response.text();

  return res.send(fileContents);
};

module.exports.patently = async (req, res) => {
  const data = qs.stringify({
    grant_type: "client_credentials",
    client_id: "673bf6409cf546584650db9b1333f",
    client_secret: "ygX4PiMR3zGDXYHFCDHJGFJHGUym2HWw9n3tOVwCRtAYE2kBsQuoK",
    audience: "https://api.paytently.io",
  });
  const config1 = {
    method: "post",
    url: "https://v2.paytently.io/auth/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };
  let response = await axios(config1);
  //    console.log(response.data);
  let token = response.data.access_token;
  //  return res.send(token)
  const payload = {
    amount: 10,
    reference: "ord126",
    currency: "EUR",
    device_ip_address: "192.0.2.0",
    route: {
      id: "rou_47md735a319wdd2adeempkgx5c",
    },
    customer: {
      id: "ec3f8ed0-1568-4065-a35e-21cb6aad6963",
      first_name: "Joe",
      last_name: "Bloggs",
      birth_date: "1990-07-25",
      contact: {
        phone: {
          country_code: "91",
          number: "07812345678",
        },
        email: "joe.bloggs@example.com",
      },
    },
    method: {
      type: "card",
      card: {
        number: "5376523683730622",
        cvv: "138",
        expiry_year: "28",
        expiry_month: "12",
        name_on_card: "anisha rawat",
      },
    },
    billing_address: {
      line_one: "123 Rye Lane",
      postal_code: "SE15 5ET",
      city: "London",
      country: "GBR",
    },
    urls: {
      authorize: {
        success:
          "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php",
        failure:
          "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php",
      },
      webhook: "https://example.com/webhook",
    },
    metadata: {
      property1: "string",
      property2: "string",
    },
  };
  // return res.send(payload)
  const config2 = {
    method: "post",
    url: "https://api.paytently.io/payments",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: payload,
  };
  let response2 = await axios(config2);
  console.log(response2.data);
  return res.send(response2.data);
};

// module.exports = { generate, reGenerate };
// route.get('/kyc/start',authMiddleware, async (req, res) => {
//     const { userId } = req.query; // Get the userId from query params
//     if (!userId) {
//         return res.status(400).json({ status: false, message: "Invalid request. No userId provided." });
//     }
//     try {
//         // Check if the user exists in the database
//         const query = "SELECT * FROM crypto_tbl_user WHERE userId = ?";
//         const user = await mysqlcon(query, [userId]);
//         if (user.length === 0) {
//             return res.status(404).json({ status: false, message: "User not found" });
//         }
//         // Generate the KYC link using Sumsub API
//         const kycLink = await sumsubService.generate(userId);
//         // Redirect to the KYC Web SDK
//         return res.redirect(kycLink);
//     } catch (error) {
//         console.error('Error generating KYC link:', error);
//         return res.status(500).json({ status: false, message: "Failed to generate KYC link." });
//     }
// })

// AAAAB3NzaC1yc2EAAAADAQABAAABAQCklumhSQi1u1uIij2ErQA4IxK9w6GLF39U
// +8kSml/5UCg/0l8C8OPluzECLbZKlxKlWbZbg+rqy+FISbP0QRGFeSRbnSMFA+JG
// 43El4OTjSVGP1piYgR28nP9giamigtkCKRPqJog3KLSvjmyrvjuKqAxUKdJEeaxB
// 7T23wkk/u/z7ZcaJV1QjsR/K3cvwrX47WSoLE00WuhJ+yAd0VfkE7mY63HrFy4ge
// fmj4Xr7k5bt+pS3wyeEeH+7a6eFvGYJsfCSGe7AA5csWMucEVCx+fUaO7T7FYmL3
// DdlIlYRmT1YNR7LP+5aX5co1LJ1x7iuhXcWUJXfsExeEDV8kkO6r

module.exports.dsa = async (req, res) => {
  var bdata = [1, 5, 3, 7, 89, 3];
  let n = length.bdata;
  for (i in range(n - 1)) {
    for (j in range(n - i - 1));
    if (bdata[j] > bdata[j + 1]) {
      (bdata[j], (bdata[j + 1] = bdata[j + 1]), bdata[j]);
    }
  }
};

module.exports.refundpatently = async (req, res) => {
  try {
    let amount = "10";
    let amount_request = amount || 0;
    let requestAmount = Math.round(amount_request * 100);
    let paytentlyID = "pay_4zcdkybcrv9n50rjgq2c4kkp5h";

    const tokenResponse = await axios({
      method: "post",
      url: "https://api.paytently.io/auth/token",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        grant_type: "client_credentials",
        client_id: "673bf6409cf84949805b540db9b1333f",
        client_secret: "ygX4PiMR3zdyvfDJX3aC2OTUym2HWw9n3tOVwCRtAYE2kBsQuoK",
        audience: "https://api.paytently.io",
      }),
    });
    const token = tokenResponse.data.access_token;

    let refId = "REF_" + Math.floor(100000 + Math.random() * 900000);
    let payload = {
      amount: requestAmount,
      reference: refId,
    };
    let response = await axios({
      method: "post",
      url: `https://api.paytently.io/payments/${paytentlyID}/refunds`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(payload),
    });

    let responseData = response.data;
    let refund_id = responseData.id;

    let refundstatusrequestUrl = `https://api.paytently.io/payments/${paytentlyID}/refunds/${refund_id}`;

    let responseStatus = await axios({
      method: "get",
      url: refundstatusrequestUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(responseStatus.data);
    return res.send(responseStatus.data);
  } catch (error) {
    console.log(error);
    return res.status(500, {
      message: "INTERNAL SERVER ERROR",
      error: error.message,
    });
  }
};

module.exports.retriveRefundDetails = async (req, res) => {
  try {
    let payment_id = "pay_4jkfrxjtsydv97ygxpnddn79n8";
    let refund_id = "ref_4mj0ggtgeyww80a73gytf662da";
    let refundstatusrequestUrl = `https://api.paytently.io/payments/${payment_id}/refunds/${refund_id}`;
    const tokenResponse = await axios({
      method: "post",
      url: "https://api.paytently.io/auth/token",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        grant_type: "client_credentials",
        client_id: "673bf6409cf84949805b540db9b1333f",
        client_secret: "ygX4PiMR3zdyvfDJX3aC2OTUym2HWw9n3tOVwCRtAYE2kBsQuoK",
        audience: "https://api.paytently.io",
      }),
    });
    const token = tokenResponse.data.access_token;
    let response = await axios({
      method: "get",
      url: refundstatusrequestUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return res.send(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500, {
      message: "INTERNAL SERVER ERROR",
      error: error.message,
    });
  }
};

module.exports.fastPay = async (req, res) => {
  try {
    const mchKey = "UNdeQ0Ayj701EuDqQb9VD8canHd68TgC";

    const amount = 10 * 100; // Replace 10 with your logic if needed
    const member_ip = "223.233.70.208"; //'103.153.58.10';
    const backend_url = "https://bankconnect.online/fastpay-payment-response";
    const redirect_url = "https://bankconnect.online/tests/responce1.php"; // Match PHP spelling
    const remarks = "Martin Mystery";
    const service_version = "2.1";
    const partner_code = "FPUB8888";
    const order_id = "fastpay02";
    const bank_code = "VBARD.VN";
    let fname = "ani";
    let currency = "VND";

    const signString = `service_version=${service_version}&partner_code=${partner_code}&partner_orderid=${order_id}&member_id=${fname}&member_ip=${member_ip}&currency=${currency}&amount=${amount}&backend_url=${backend_url}&redirect_url=${redirect_url}&bank_code=${bank_code}&key=${mchKey}`;
    const sign = crypto
      .createHash("sha1")
      .update(signString)
      .digest("hex")
      .toUpperCase();

    const payload = {
      service_version,
      partner_code,
      partner_orderid: order_id,
      member_id: fname,
      member_ip,
      currency,
      amount,
      backend_url,
      redirect_url,
      bank_code,
      remarks,
      sign,
    };

    const config = {
      method: "post",
      url: "https://www.fastmart168.com/fundtransfer.php",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: qs.stringify(payload),
    };

    const response = await axios(config);
    const html = response.data;
    const match = html.match(/var\s+ftData\s*=\s*JSON\.parse\('([^']+)'\);/);

    if (match && match[1]) {
      const jsonString = match[1].replace(/\\"/g, '"');
      const ftData = JSON.parse(jsonString);
      return res.json(ftData);
    } else {
      return res
        .status(500)
        .json({ error: "Could not extract ftData JSON from HTML" });
    }
    return res.json(response.data);
  } catch (error) {
    console.error("FastPay API Error:", error);
    return res.status(500).json({
      error: "FastPay API Error",
      details: error.response?.data || error.message,
    });
  }
};

module.exports.korapay = async (req, res) => {
  try {
    const return_url = 'https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php';
    const callback_url = 'https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php';

    const fname = 'ani';
    const lname = 'rawat';
    const full_name = `${fname} ${lname}`;
    const orderNo = `ANISHA${Date.now()}`;
    const pay_by = '3'; // Use string since you're comparing it with '3' or '4'
    let amount = 100;
    const email = 'anisha@ubankconnect.com';
    const mobileNo = '2250714462945';
    let currency = 'NGN';
    let apiUrl;
    let payload;
    const description = 'Korapay Payment'; // Add appropriate description

    if (pay_by === '3') {
      apiUrl = `${process.env.KORAPAY_BASE_URL}/charges/bank-transfer`;

      payload = {
        account_name: full_name,
        amount: amount,
        currency: currency,
        reference: orderNo,
        notification_url: callback_url,
        customer: {
          name: full_name,
          email: email
        }
      };
    } else if (pay_by === '4') {
       apiUrl = `${process.env.KORAPAY_BASE_URL}/charges/mobile-money`;

      if (currency === 'GHC') {
        currency = 'GHS';
      }

      payload = {
        amount: amount,
        currency: currency,
        reference: orderNo,
        description: description,
        notification_url: callback_url,
        redirect_url: return_url,
        customer: {
          name: full_name,
          email: email
        },
        merchant_bears_cost: true,
        mobile_money: {
          number: mobileNo
        }
      };
    } else {
      return res.status(400).json({ error: 'Invalid pay_by value' });
    }
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    const config = {
      method: 'post',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${stripeKey}`
      },
      data: payload
    };

    const response = await axios(config);
    return res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({
      message: error.message,
      error: error.response?.data || null
    });
  }
};

module.exports.korapaystatus = async (req, res) => {
  try {
    let orderId = 'ANISHA1746518180074'
    const apiUrl = `${process.env.KORAPAY_BASE_URL}/charges/${orderId}`;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    const config = {
      method: 'get',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${stripeKey}`
      }
    };

    const response = await axios(config);
    return res.json(response.data.data?.status);
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({
      message: error.message,
      error: error.response?.data
    });
  }
};

module.exports.merchantPay = async (req, res) => {
  let appId = "10126";
  let orderId = "MERCHANTPAY123";
  let money = "10";
  let notifyUrl = "https://gamez360.com/home/transaction";
  let channel = "100";
  let phone = "03341234567";
  let token = "dcbb406f0e00b426efdea8536f67fef2";
  const signatureString = `appId=${appId}&money=${money}&notifyUrl=${notifyUrl}&orderId=${orderId}&_token=${token}`;
  const sign = crypto.createHash("md5").update(signatureString).digest("hex");

  let data = {
    appId: appId,
    orderId: orderId,
    money: money,
    notifyUrl: notifyUrl,
    channel: channel,
    phone: phone,
    sign: sign,
  };

  const config = {
    method: "post",
    url: "https://api768f2e4dc.abcpayapp.com/index/pakistan",
    headers: { "Content-Type": "application/json" },
    data: data,
  };

  const response = await axios(config);
  return res.send(response.data);
};

module.exports.readyPay = async (req, res) => {
  let endpoint_url = "https://pay.redipay.app/oauth/token";
  let grant_type = "client_credentials";
  let client_id = "60131808";
  let client_secret = "mREXkk4nau06P6DlBuXz2N1xuoxZC8YFVwxj6Wpr";
  let request_data = {
    grant_type: grant_type,
    client_id: client_id,
    client_secret: client_secret,
  };
  const configtoken = {
    method: "post",
    url: endpoint_url,
    headers: { "Content-Type": "application/json" },
    data: request_data,
  };

  const responsetoken = await axios(configtoken);
  let token = responsetoken.data.access_token;

  let api_url = "https://pay.redipay.app/api/payments/payment";
  let amount = 100;
  let reference_no = "Ready123";
  let item = "baju kemeja";
  let callback_url =
    "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php";
  let email = "nurhidayah@gmail.com";
  let name = "nurhidayah";
  let data = {
    amount: amount,
    reference_no: reference_no,
    item: item,
    callback_url: callback_url,
    email: email,
    name: name,
  };

  const config = {
    method: "post",
    url: api_url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  const response = await axios(config);
  return res.send(response.data);
};

module.exports.camlenio = async (req, res) => {
  let datacam = {
    address: "noida",
    payment_type: 2,
    amount: 1,
    email: "anisha@ubankconnect.com",
    name: "ani",
    mobile_number: "7894561237",
    vpa: "anisha16rawat-1@okicici",
    merchant_order_id: "cam12",
  };

  let secret =
    "6332db35bb0252dda11a833cc4249c0a9eb0bb1a21ac4edf0bc3df82a6da53f80d3e1237a6c8a732babe01e68dc809b7";
  let timestamp = dateTime;
  let path = "";
  let query_string = "";
  let method = "POST";
  let body = "";

  const message = `${method}\n${path}\n${query_string}\n${body}\n${timestamp}\n`;

  let signaturehash = crypto
    .createHmac("sha512", secret)
    .update(message)
    .digest("hex");

  console.log("Generated Signature:", signaturehash);

  const config = {
    method: method,
    url: "https://partner.camlenio.com/api/v1/payout/payoutprocessUpi",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "team testing",
      ApiKey:
        "962952836005cc1877da41560e77caa26d5b21aff4715af51d96c68030d6ce5a",
      signature: signaturehash,
      SecretKey: secret,
      UserId: "2110229081",
    },
    data: datacam,
  };
  const response = await axios(config);
  return res.json(response.data);
};

module.exports.fluterwave = async (req, res) => {
  try {
    let orderNo = "UB1234";
    let merchantno = "UB1234";
    let currency = "RFW";
    if (currency === "RFW") {
      currency = "RWF";
      const code = "mobile_money_rwanda";
      const secretKey =
        "FLWSECK-8423a35f47d417439fff5fd2ec5ae2c9-190a06cb528vt-X";
      const url = `https://api.flutterwave.com/v3/charges?type=${code}`;
      const orderNo = `${merchantno}00${Date.now()}`;
      const payload = {
        tx_ref: orderNo,
        order_id: orderNo,
        amount: "100",
        currency: currency,
        email: "vroop@ubankconnect.com",
        phone_number: "8400137432",
        fullname: "Stark Ubank",
      };
      // Send request to Flutterwave
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      });
      const redirectUrl = response.data;
      return res.send(redirectUrl);
    }
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.redipayStatus = async (req, res) => {
  try {
    const url = "https://pay.redipay.app/oauth/token";

    const payload = {
      grant_type: "client_credentials",
      client_id: "60131808",
      client_secret: "mREXkk4nau06P6DlBuXz2N1xuoxZC8YFVwxj6Wpr",
    };

    // Step 1: Get Access Token
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const token = response.data.access_token;
    const order_no = "463058480263";

    // Step 2: Get Payment Status
    const readiURL = `https://pay.redipay.app/api/payments/${order_no}/status`;
    const paymentResponse = await axios.get(readiURL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let resp = paymentResponse.data;
    return res.json(resp.status);
  } catch (error) {
    console.error(
      "Payment Error:",
      error.response ? error.response.data : error.message,
    );
    res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: error.response ? error.response.data : error.message,
      });
  }
};

const SECRET_KEY = "FLWSECK-8423a35f47d417439fff5fd2ec5ae2c9-190a06cb528vt-X";
const FLUTTERWAVE_URL = "https://api.flutterwave.com/v3/charges";

const formatPhoneNumber = (number, countryCode) => {
  number = number.toString();
  if (number.startsWith(countryCode)) return number;
  if (number.startsWith("+" + countryCode))
    return number.slice(countryCode.length + 1);
  return countryCode + number;
};

const removePrefixIfMatch = (number, prefix) => {
  let numStr = number.toString();
  if (numStr.startsWith(prefix)) return numStr.slice(prefix.length);
  if (numStr.startsWith(`+${prefix}`)) return numStr.slice(prefix.length + 1);
  return numStr;
};

module.exports.fluterwave = async (req, res) => {
  const {
    currency,
    amount,
    email,
    fname,
    lname,
    mobile_no,
    user_txn_id,
    amount_come,
    return_url,
    merchantno,
    paymentCode,
    pay_by,
  } = req.body;
  const orderNo = `ORD-${Date.now()}`;
  let code, formattedPhone;
  // Assign payment method & format phone number
  if (currency === "GHC" || currency === "GHS") {
    code = "mobile_money_ghana";
    formattedPhone = mobile_no;
  } else if (currency === "UGX") {
    code = "mobile_money_uganda";
    formattedPhone = formatPhoneNumber(mobile_no, "256");
  } else {
    return res.status(400).json({ error: "Unsupported currency" });
  }
  // Ensure correct phone number format
  if (currency === "UGX") {
    formattedPhone = "256" + removePrefixIfMatch(mobile_no, "256");
  } else {
    formattedPhone = "254" + removePrefixIfMatch(mobile_no, "254");
  }
  // Validate amount before processing
  if (
    (currency === "UGX" && (amount < 10 || amount > 149999)) ||
    (currency !== "GHS" &&
      currency !== "GHC" &&
      (amount < 100 || amount > 500000))
  ) {
    return res.json({
      order_id: user_txn_id,
      orderAmount: amount_come,
      requestedAmount: amount_come,
      currency,
      txStatus: "FAILED",
      txMsg: `Min amount must be ${currency} 10 and max amount must be ${currency} 150000 for assigned gateway`,
      txTime: new Date().toISOString(),
      txCode: "SUCC202",
      checksum: crypto
        .createHash("md5")
        .update(
          `${user_txn_id}|${amount_come}|FAILED|${new Date().toISOString()}|${user_txn_id}|${SECRET_KEY}`,
        )
        .digest("hex"),
      url: return_url,
    });
  }
  // Prepare payload for Flutterwave API request
  const payload = {
    tx_ref: orderNo,
    amount: amount,
    currency: currency,
    voucher: Date.now(),
    network: paymentCode,
    email: email,
    phone_number: formattedPhone,
    fullname: `${fname} ${lname}`,
    client_ip: "103.153.58.10",
    device_fingerprint: crypto
      .createHash("md5")
      .update(Date.now().toString())
      .digest("hex"),
    meta: { flightID: "UB_" + Date.now() },
  };
  // Make API request to Flutterwave
  try {
    const response = await axios.post(
      `${FLUTTERWAVE_URL}?type=${code}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (
      !response.data ||
      !response.data.meta ||
      !response.data.meta.authorization
    ) {
      return res
        .status(400)
        .json({ error: "Invalid API response from Flutterwave" });
    }
    // Replacing the URL for redirection
    const redirectUrl = response.data.meta.authorization.redirect;
    // Return API response
    return res.json({
      order_id: user_txn_id,
      transfer_reference: response.data.meta.authorization.transfer_reference,
      transfer_account: response.data.meta.authorization.transfer_account,
      transfer_bank: response.data.meta.authorization.transfer_bank,
      transfer_amount: response.data.meta.authorization.transfer_amount,
      redirect_url: redirectUrl,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Payment processing failed", details: error.message });
  }
};

module.exports.payazapay = async (req, res) => {
  try {
    // const { merchantno, paymentCode, amount, mobile_no, description, currency, email, fname, lname, return_url } = req.body;
    const mid = "1234";
    // let payin_charges = 0;
    // if (merchantno === '1762' && paymentCode === 'WAVCIV') {
    //     payin_charges = (amount * 4.5) / 100;
    // }
    const orderNo = `${mid}00${Date.now()}`;
    const transaction_reference = orderNo;
    // let country_code = '';
    // if (['MTNBEN', 'MOOBEN'].includes(paymentCode)) {
    //     country_code = 'BJ';
    // } else if (currency === 'XOF') {
    //     country_code = 'CI';
    // } else if (currency === 'GHS') {
    //     country_code = 'GH';
    // } else if (currency === 'TZS') {
    //     country_code = 'TZ';
    // } else if (currency === 'KES') {
    //     country_code = 'KE';
    // } else if (currency === 'UGX') {
    //     country_code = 'UG';
    // }
    let requestData = {
      amount: "100",
      customer_number: "2250748293975",
      transaction_reference: transaction_reference,
      transaction_description: "test ",
      customer_bank_code: "WAVCIV",
      currency_code: "XOF",
      customer_email: "vroop@ubankconnect.com",
      customer_first_name: "Stark",
      customer_last_name: "Ubank",
      customer_phone_number: "2250748293975",
      country_code: "CI",
      redirect_url:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php",
    };
    //  return res.send(requestData)
    const response = await axios.post(
      "https://api.payaza.africa/live/subsidiary/collections/v1/process-collection",
      requestData,
      {
        headers: {
          "X-TenantID": "live",
          "X-ProductID": "app",
          Authorization:
            "Payaza UFo3OC1QS0xJVkUtNTBCQUIxQUQtNDk4My00QjMzLThDMDMtNkVBNUNFRDVBRDYz",
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response);
    const processCollection = response.data;
    return res.send(processCollection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

async function payazapayOrderEnquiry(order_no, countryCode) {
  const url = `https://api.payaza.africa/live/subsidiary/collections/v1/check-status?transaction_reference=${order_no}&country_code=${countryCode}`;
  const response = await axios.get(url, {
    headers: {
      "X-TenantID": "live",
      "X-ProductID": "app",
      "Content-Type": "application/json",
      Authorization:
        "Payaza UFo3OC1QS0xJVkUtNTBCQUIxQUQtNDk4My00QjMzLThDMDMtNkVBNUNFRDVBRDYz",
    },
  });
  return response.data; // Return the JSON response
}

function fixKey(key) {
  const CIPHER_KEY_LEN = 16;
  if (key.length < CIPHER_KEY_LEN) {
    return key.padEnd(CIPHER_KEY_LEN, "0");
  }
  if (key.length > CIPHER_KEY_LEN) {
    return key.substring(0, CIPHER_KEY_LEN);
  }
  return key;
}

function encrypt(key, iv, data) {
  const fixedKey = fixKey(key);
  const cipher = crypto.createCipheriv("aes-128-cbc", fixedKey, iv);
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  const encodedIV = Buffer.from(iv).toString("base64");
  return `${encrypted}:${encodedIV}`;
}

// function removePrefixIfMatch(number) {
//   const numberStr = String(number).trim();
//   const prefixes = {
//     '+91': 3,
//     '91': 2,
//     '0': 1
//   };
//   for (const prefix in prefixes) {
//     if (numberStr.startsWith(prefix)) {
//       return numberStr.substring(prefixes[prefix]);
//     }
//   }
//   return numberStr;
// }

// Your original code with values coming from req.body

module.exports.subPaisa = async (req, res) => {
  const clientCode = "HAR9I9";
  const username = "vijaygupta8991_19811";
  const password = "HAR9I9_SP19811";
  const authKey = "cT06ZaSMESCr8Xsi";
  const authIV = "cgmmWsnZ65pjTWYu";

  const payerName = "anisha";
  const payerEmail = "anisha@ubankconnect.com";
  const payerMobile = "8541236989";
  const payerAddress = "US";

  const clientTxnId = "subpaisa8";
  const amount = 250;
  const amountType = "INR";
  const mcc = 5137;
  const channelId = "W";
  const callbackUrl =
    "https://yeppe.in/webpayment/sabpaisaintent/Sabpaisaintent/sabpaisaintentsuccessurl";
  const byPassFlag = "true";
  const modeTransfer = "UPI_APPS_MODE_TRANSFER";
  const seamlessType = "S2S";

  const encData =
    `clientCode=${clientCode}&transUserName=${username}&transUserPassword=${password}` +
    `&payerName=${payerName}&payerMobile=${payerMobile}&payerEmail=${payerEmail}` +
    `&payerAddress=${payerAddress}&clientTxnId=${clientTxnId}&amount=${amount}` +
    `&amountType=${amountType}&mcc=${mcc}&channelId=${channelId}&callbackUrl=${callbackUrl}` +
    `&browserDetails=English|24-bit|1080|1920|UTC+2&modeTransfer=${modeTransfer}` +
    `&byPassFlag=${byPassFlag}&seamlessType=${seamlessType}`;

  const encryptedData = encrypt(authKey, authIV, encData);

  const form_data = qs.stringify({
    encData: encryptedData,
    clientCode: clientCode,
  });

  const response = await axios.post(
    "https://yeppe.in/webpayment/sabpaisaintent/Sabpaisaintent/payment1",
    form_data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  let upiUrl = response.data;
  return res.send(upiUrl);
  const qrImage = await QRCode.toDataURL(upiUrl); // base64 encoded PNG

  return res.send({
    upiUrl: upiUrl,
    qrCode: qrImage,
    sabPaisaResponse: response.data,
  });
};

module.exports.payload_payport = async (req, res) => {
  try {
    console.log("🔹 Server Received Request:", req.body);

    const BASE_URL = "https://paymarket.live/api/v3/payment";
    const ACCESS_TOKEN =
      "ITAUQkHzyO3Bdre2inOXy5xLiEMuX2914oNmf5xi4jcA47sfG66b4L7x2pcY6EaFMfjkWIiAoFdcTR4Z7mKcOHkCtQWKximvBTqjSbb06Pw8BzyoWH2FRX8yLcW86nl9";
    const HEADERS = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    };

    const customer_id = "PAYPORT" + Date.now().toString().slice(-6);
    const requestPayload = {
      amount: 10000,
      currency: "EGP",
      exact_currency: 1,
      locale: "en",
      customer_id: customer_id,
    };

    const json = JSON.stringify(requestPayload);

    const requestResponse = await axios.post(`${BASE_URL}/request`, json, {
      headers: HEADERS,
    });
    // return res.send(requestResponse.data)

    const ad_id = requestResponse.data.data[0].ad_id;

    const createPayload = {
      ad_id: ad_id,
      amount: 10000,
      currency: "EGP",
      server_url:
        "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
      locale: "en",
      customer_id: customer_id,
      payment_attributes: {
        phone_number: "08929543007",
        client_name: "test@gmail.com",
        client_email: "testsingh@gmail.com",
      },
    };
    // return res.send(createPayload)

    const json1 = JSON.stringify(createPayload);

    const createResponse = await axios.post(`${BASE_URL}/create`, json1, {
      headers: HEADERS,
    });

    invoiceId1 = createResponse.data.data.invoice_id;
    const paymentUrl = createResponse.data.data.payment_url;

    const checkPayload = { invoice_id: invoiceId1, locale: "en" };
    //  return res.send(checkPayload)
    const checkPayload1 = JSON.stringify(checkPayload);
    const checkResponse = await axios.post(
      `${BASE_URL}/check/approved`,
      checkPayload1,
      { headers: HEADERS },
    );
    //
    return res.status(200).json({
      message: "Payment initialized",
      payment_url: paymentUrl,
      invoice_id: invoiceId1,
      status_check: checkResponse.data,
    });
  } catch (error) {
    console.error(
      "❌ Error:",
      error.response ? error.response.data : error.message,
    );
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message });
  }
};

module.exports.subPaisaStatus = async (req, res) => {
  function decryptData(encData, key, iv) {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key),
      Buffer.from(iv),
    );
    let decrypted = decipher.update(encData, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  function fixKey(key) {
    const CIPHER_KEY_LEN = 16;
    if (key.length < CIPHER_KEY_LEN) {
      return key.padEnd(CIPHER_KEY_LEN, "0");
    }
    if (key.length > CIPHER_KEY_LEN) {
      return key.substring(0, CIPHER_KEY_LEN);
    }
    return key;
  }

  function encrypt(key, iv, data) {
    const fixedKey = fixKey(key);
    const cipher = crypto.createCipheriv("aes-128-cbc", fixedKey, iv);
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    const encodedIV = Buffer.from(iv).toString("base64");
    return `${encrypted}:${encodedIV}`;
  }

  const clientTxnId = req.body.order_id;
  const clientCode = "DOTO93";
  const authKey = "YyKkrmH35Pz5jwQX";
  const authIV = "7Ib84dQOPJp3e3YI";

  const encData = `clientCode=${clientCode}&clientTxnId=${clientTxnId}`;
  const statusTransEncData = encrypt(authKey, authIV, encData);

  const postData = {
    clientCode,
    statusTransEncData,
  };

  const response = await axios.post(
    "https://txnenquiry.sabpaisa.in/SPTxtnEnquiry/getTxnStatusByClientxnId",
    postData,
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  const data = response.data;

  if (data.statusResponseData) {
    const decText = decryptData(authKey, authIV, data.statusResponseData);
    res.send(decText);
  } else {
    res.json({
      error: 402,
      status: "PENDING",
      programId: clientCode,
      message: data.Message || "Invalid or missing response from API",
    });
  }
};

module.exports.subpaisalsi = async (req, res) => {
  function fixKey(key) {
    return key.padEnd(16, "0").substring(0, 16);
  }

  function encrypt(key, iv, data) {
    const cipher = crypto.createCipheriv("aes-128-cbc", fixKey(key), iv);
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    return `${encrypted}:${Buffer.from(iv).toString("base64")}`;
  }

  const authKey = "W5xyGyalFvWMPXw0";
  const authIV = "vSuFywoYFDuXoHKA";
  const formData = {
    clientCode: "RIS98H",
    transUserName: "rishienterprises863@gmail.com",
    transUserPassword: "RIS98H_SP20482",
    payerName: "Adarsh",
    payerMobile: "8127343545",
    payerEmail: "Test@email.in",
    payerAddress: "Patna, Bihar",
    clientTxnId: Date.now().toString(),
    amount: 10,
    amountType: "INR",
    mcc: 5137,
    channelId: "W",
    callbackUrl:
      "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
    browserDetails: "English|24-bit|1080|1920|UTC+2",
    modeTransfer: "UPI_APPS_MODE_TRANSFER",
    byPassFlag: "true",
    seamlessType: "S2S",
  };

  const encDataString = querystring.stringify(formData);
  const encryptedData = encrypt(authKey, authIV, encDataString);

  const postData = querystring.stringify({
    encData: encryptedData,
    clientCode: formData.clientCode,
  });

  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL verification (not recommended for production)
  });

  let response = await axios.post(
    "https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1",
    postData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
      },
      httpsAgent: agent,
    },
  );
  return res.send(response.data);
};

const OPENSSL_CIPHER_NAME = "aes-128-cbc";
const CIPHER_KEY_LEN = 16; // 128 bits
const IV_LEN = 16;

// Ensure key is exactly 16 bytes (pad with '0' or trim)
// const fixKey = (key) => {
//     if (!key || typeof key !== 'string') throw new Error('Key must be a string');
//     return key.substring(0, CIPHER_KEY_LEN).padEnd(CIPHER_KEY_LEN, '0');
// };

// // Ensure IV is exactly 16 bytes (pad with '0' or trim)
// const fixIV = (iv) => {
//     if (!iv || typeof iv !== 'string') throw new Error('IV must be a string');
//     return iv.substring(0, IV_LEN).padEnd(IV_LEN, '0');
// };

// // Encrypts data using AES-128-CBC
// const encrypt = (key, iv, data) => {
//     const fixedKey = Buffer.from(fixKey(key), 'utf8');
//     const fixedIV = Buffer.from(fixIV(iv), 'utf8');

//     const cipher = crypto.createCipheriv(OPENSSL_CIPHER_NAME, fixedKey, fixedIV);
//     let encrypted = cipher.update(data, 'utf8', 'base64');
//     encrypted += cipher.final('base64');

//     // Return base64 encrypted data and IV (in base64) separated by ':'
//     return `${encrypted}:${fixedIV.toString('base64')}`;
// };

const decrypt = (key, encResponse) => {
  const [encText, encodedIV] = encResponse.split(":");
  if (!encText || !encodedIV) {
    throw new Error("Encrypted text or IV missing");
  }
  const fixedKey = fixKey(key);
  const iv = Buffer.from(encodedIV, "base64");
  const decipher = crypto.createDecipheriv("aes-128-cbc", fixedKey, iv);
  let decrypted = decipher.update(encText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports.paymentRequestXuwiSubpaisaInt = async (req, res) => {
  let requestData = req.body;
  // const clientCode = 'KASH19';
  // const username = 'akskarshanroop@gmail.com';
  // const password = 'KASH19_SP21300';
  const authKey = "m7NSCv6ACEr7mwWJ";
  // const authIV = 'uQByb7VKcLgE0OPI';

  // const encData = {
  //   clientCode,
  //   transUserName: username,
  //   transUserPassword: password,
  //   payerName: "ADARSH",
  //   payerMobile: "8127343545",
  //   payerEmail: "adarshtest@gmail.com",
  //   payerAddress: "BSI Noida",
  //   clientTxnId: 'Anisha' + Date.now(),
  //   amount: 100,
  //   amountType: "INR",
  //   mcc: 5137,
  //   channelId: "W",
  //   callbackUrl:
  //     "https://yeppe.in/webpayment/sabpaisaintent/Sabpaisaintent/sabpaisaintentsuccessurl",
  //   browserDetails: "English|24-bit|1080|1920|UTC+2",
  //   modeTransfer: "UPI_APPS_MODE_TRANSFER",
  //   byPassFlag: "true",
  //   seamlessType: "S2S",
  // };

  // const dataString = querystring.stringify(encData);

  // const encryptedData = encrypt(authKey, authIV, dataString);
  // const requestData = {
  //   encData: encryptedData,
  //   clientCode: clientCode,
  // };

  const baseUrl = "https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1";
  try {
    // Send POST request
    const response = await axios.post(
      baseUrl,
      querystring.stringify(requestData),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    const responseData = response.data;
    if (responseData && responseData.data) {
      const parsedData = querystring.parse(responseData.data);
      if (parsedData.encData) {
        const enc = parsedData.encData.replace(/ /g, "+");
        const decryptedResponse = decrypt(authKey, enc);
        return res.send(decryptedResponse);
      } else {
        console.error("No encData found in response.");
      }
    } else {
      console.error("No encrypted response data found.");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.mersecet = async (req, res) => {
  try {
    let sql = "SELECT secretkey FROM tbl_user WHERE id = ? ";
    let result = await mysqlcon(sql, [req.body.id]);
    return res.send(result[0].secretkey);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

module.exports.passWayInrrequest = async (req, res) => {
  let payload = {
    integrationId: "0faa2872-2b17-481a-9884-c894f7c8b813",
    clientRefId: `ANISHA${Date.now()}`,
    amount: "1.00",
    note: "SampleNote",
    customerName: "Ani Aks",
    customerVpa: "transbank867@appl",
    customerMcc: "0000",
    expiryValue: "1",
  };

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://sandbox-api.passway.in/api/v1/upi/collect",
    headers: {
      "x-api-key": "URfL6nZY7z4umt6Qp7tXY2DuXLWDCBXIaizqr0EY ",
      "Content-Type": "application/json",
    },
    data: payload,
  };

  axios
    .request(config)
    .then((response) => {
      return res.send(JSON.stringify(response.data));
    })
    .catch((error) => {
      return res.send(error);
    });
};

module.exports.passWayInrStatus = async (req, res) => {
  let payload = {
    clientRefId: "",
    integrationId: "",
  };

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://sandbox-api.passway.in/api/v1/upi/collect/status",
    headers: {
      "x-api-key": "URfL6nZY7z4umt6Qp7tXY2DuXLWDCBXIaizqr0EY ",
      "Content-Type": "application/json",
    },
    data: payload,
  };

  axios
    .request(config)
    .then((response) => {
      return res.send(JSON.stringify(response.data));
    })
    .catch((error) => {
      return res.send(error);
    });
};

module.exports.finic = async (req, res) => {
  function generateInitPayoutRequestSignature(data, apiSecret, timestamp) {
    let url = "https://api.finic.tech/api/v1/payout/initiate";

    let body =
      data.order_id +
      data.amount +
      data.transfer_type +
      data.account_number +
      data.ifsc;

    let plainSignaturePayload = method + url + body + timestamp;
    let signaturehash = crypto
      .createHash("sha256", apiSecret)
      .update(plainSignaturePayload)
      .digest("hex");

    return signaturehash;
  }

  const client_id = "FIN1761717721";
  const client_key = "finic_key_7XfClygLaIq1DMWjjlYSWh"; // For header
  const api_secret = "finic_sec_ZqBkNQrPUFDDM2Sj2SMouY"; // For signature

  const url = "https://api.finic.tech/api/v1/payout/wallet/balance";
  const path = "/api/v1/payout/initiate";

  let data = {
    order_id: "3e77edc2-ffaa-4bef-90ae-3b2566ad5434",
    wallet_id: "8745645645",
    customer_id: "CUST1515041",
    customer_name: "ABC XYZ",
    customer_email: "abcxyz@gmail.com",
    customer_phone: "9898989898",
    amount: 10,
    transfer_type: "IMPS",
    account_number: "658041548454",
    ifsc: "ICIC0000000",
  };

  const signature = generateInitPayoutRequestSignature(
    data,
    api_secret,
    timestamp,
  );
};

module.exports.finic = async (req, res) => {
  try {
    function generateInitPayoutRequestSignature(data, apiSecret, timestamp) {
      const method = "POST";
      const url = "https://api.finic.tech/api/v1/payout/initiate";

      const body =
        data.order_id +
        data.amount +
        data.transfer_type +
        data.account_number +
        data.ifsc;

      const plainSignaturePayload = method + url + body + timestamp;

      const signatureHash = crypto
        .createHmac("sha256", apiSecret)
        .update(plainSignaturePayload)
        .digest("hex");

      return signatureHash;
    }

    const timestamp = dateTime;
    const client_id = "FIN1761717721";
    const client_key = "finic_key_7XfClygLaIq1DMWjjlYSWh";
    const api_secret = "finic_sec_ZqBkNQrPUFDDM2Sj2SMouY";

    // const url = "https://api.finic.tech/api/v1/payout/wallet/balance";

    const data = {
      order_id: "finic" + Date.now(),
      wallet_id: "8745645645",
      customer_id: "CUST1515041",
      customer_name: "ABC XYZ",
      customer_email: "abcxyz@gmail.com",
      customer_phone: "9898989898",
      amount: 10,
      transfer_type: "IMPS",
      account_number: "658041548454",
      ifsc: "ICIC0000000",
    };

    const signature = generateInitPayoutRequestSignature(
      data,
      api_secret,
      timestamp,
    );

    let config = {
      method: "post",
      url: "https://api.finic.tech/api/v1/payout/wallet/balance",
      headers: {
        "x-fin-Client-ID": client_id,
        "x-fin-Client-Key": client_key,
        "X-FIN-Timestamp": timestamp,
        "X-FIN-Signature": signature,
        "Content-Type": "application/json",
      },
      data: data,
    };

    let response = await axios.post(config);

    return res.send(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message,
    );
    return res.status(500).json({
      success: false,
      message: "API Request Failed",
      error: error.response ? error.response.data : error.message,
    });
  }
};


module.exports.ofapayout = async (req, res) => {
  const scode = "161195980113";
  const orderid = Date.now().toString();
  const money = "10.00";
  const bankname = "GCASH";
  const bankno = "600";
  const branchname = "noida";
  const branchcode = "TR" + Date.now();
  const accountno = "5678909876";
  const accountname = "saaho";
  const notifyurl =
    "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php";
  const key = "DreSt3fror9CROV";

  const params = {
    accountname,
    accountno,
    bankname,
    bankno,
    branchcode,
    branchname,
    money,
    notifyurl,
    orderid,
    scode,
  };

  // ✅ Create sign string
  const signString =
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&") + `&key=${key}`;
  console.log(signString);

  const sign = crypto.createHash("md5").update(signString).digest("hex");
  console.log(sign);

  const payload = {
    ...params,
    sign,
  };
  // return res.send(payload)

  try {
    const response = await axios({
      method: "post",
      url: "https://www.jzc899.com/betdf/df.aspx",
      data: qs.stringify(payload),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json(error.response?.data || error.message);
  }
};

module.exports.subvalixa = async (req, res) => {
  function encryptedData(aesKeyBase64, hmacKeyBase64, plainText) {
    const aesKey = Buffer.from(aesKeyBase64, "base64"); // 32 bytes
    const hmacKey = Buffer.from(hmacKeyBase64, "base64"); // any length

    if (aesKey.length !== 32) {
      throw new Error("Invalid AES-256 key length");
    }

    const IV_SIZE = 12;
    const TAG_SIZE = 16;
    const HMAC_LENGTH = 48;

    const iv = crypto.randomBytes(IV_SIZE);

    const cipher = crypto.createCipheriv("aes-256-gcm", aesKey, iv);
    const cipherText = Buffer.concat([
      cipher.update(plainText, "utf8"),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();
    const encryptedMessage = Buffer.concat([iv, cipherText, tag]);

    const hmac = crypto
      .createHmac("sha384", hmacKey)
      .update(encryptedMessage)
      .digest();

    return Buffer.concat([hmac, encryptedMessage])
      .toString("hex")
      .toUpperCase();
  }

  const clientCode = "CLAS84";
  const authKey = "RzNc6TYY629lsdfghG/8gyRUyEuIl5kM0=";
  const authIV =
    "A48cJRNK0P4K/T2sMSkasdfgh8nVO8fw1kP9Z/28Q0/Vby9SnIs5m1";

  const username = "aks@gmail.com";
  const password = "CLAS84_SP24387";

  const payerName = "Allen Solly";
  const payerEmail = "allensolly@gmail.com";
  const payerMobile = "7779998882"; //mob
  const payerAddress = "Noida Sector 63 Uttar Pradesh";

  const clientTxnId = "ELVYN" + Date.now();
  const amount = "20.00";
  const amountType = "INR";
  const mcc = 5137;
  const channelId = "W";
  const callbackUrl = "https://velixa.co.in";
  const payerVpa = "anirawat@okaxis";
  const byPassFlag = "true";
  const modeTransfer = "UPI_MODE_TRANSFER";

  const encData =
    `clientCode=${clientCode}` +
    `&transUserName=${username}` +
    `&transUserPassword=${password}` +
    `&payerName=${payerName}` +
    `&payerMobile=${payerMobile}` +
    `&payerEmail=${payerEmail}` +
    `&payerAddress=${payerAddress}` +
    `&clientTxnId=${clientTxnId}` +
    `&amount=${amount}` +
    `&amountType=${amountType}` +
    `&mcc=${mcc}` +
    `&channelId=${channelId}` +
    `&callbackUrl=${callbackUrl}` +
    `&payerVpa=${payerVpa}` +
    `&byPassFlag=${byPassFlag}` +
    `&modeTransfer=${modeTransfer}`;

  const encryptSabPaisa = encryptedData(authKey, authIV, encData);

  const formData = {
    encryptSabPaisa,
    clientCode,
  };

  res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting to SabPaisa</title>
      </head>
      <body onload="document.forms[0].submit()">
        <form method="post" action="https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1">
          <input type="hidden" name="encData" value="${encryptSabPaisa}" />
          <input type="hidden" name="clientCode" value="${clientCode}" />
          <noscript>
            <input type="submit" value="Continue to Payment">
          </noscript>
        </form>
      </body>
      </html>
      `);

  // const config = {
  //   method: 'post',
  //   url: "https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1'>",
  //   headers: { 'Content-Type': 'application/json' },
  //   data: formData,
  // }
  // const response = await axios(config);
  // return (response.data)
};
