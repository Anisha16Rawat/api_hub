const mysqlcon = require("../config/db_connection");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const emailvalidator = require("email-validator");
const homesupport = require("../helper/homemodel")
const helpers = require("../helper/callbackHelper")
var md5 = require("md5");
let today = new Date(); 
let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date+' '+time; 

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body)
  try {
    if (emailvalidator.validate(email)) {
      if (email && password) {
        let sql = "select * from tbl_login where email = ? and password = ?";
        let result = await mysqlcon(sql, [email, md5(password)]);
        if(result[0].role === 0){
          return res.status(202).json({
            message:"Role not Assign"
          })
        } else if (Object.keys(result).length > 0) {
          let Email = result[0].email;
          let loginSql = "UPDATE tbl_login SET last_login_date = ? WHERE email = ? "
          let loginResult = await mysqlcon(loginSql, [dateTime, Email])
          let token = jwt.sign(
            // { id: result[0].user_id,role:result[0].role },
            { id: result[0].user_id,role:result[0].role, Status: result[0].status },
            config.JWT_SECRET,
            {
              expiresIn: config.JWT_EXPIRY,
            }
          );
          if(result[0].status === 1){
            return res.status(200).json({
              message: "Login Successful✅",
              token: token,
              role:result[0].role,
              Status: result[0].status,
              loginData: loginResult,
              name: `${result[0].firstname} ${result[0].lastname}`
            });
          } else {
            return res.status(201).json({
              message: "Error! Your account has been deactive. Please contact with admin.",
            });
          }
        } else {
          return res.status(201).json({
            message: "Invalid Email or Password",
          });
        }
      } else {
        return res.status(201).json({
          message: "Please fill all the fields",
        });
      }
    } else {
      return res.status(201).json({
        status: "error",
        message: "Invalid Email",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "error occurered",
      error: error.message,
    });
  }
};

module.exports.modulePesmission = async (req, res) => {
  try {
    const { token } = req.body;
    if (token) {
      jwt.verify(token, config.JWT_SECRET, async (err, payload) => {
        if (err) {
          return res.status(201).json({
            message: "Login First",
          });
        }
        let id = payload.id;
        if (id) {
          let sql = "SELECT role from tbl_login WHERE user_id = ?"
          let result = await mysqlcon(sql, [id])
          let userRole = result[0].role
          // return res.send(result[0])
          let sqlPermission = "select * from tbl_module_action where user_id = ?";
          let permissionResult = await mysqlcon(sqlPermission, [id]);
          let modules = [
            "Sub Admin Module",
            "PG Module",
            "MID Module",
            "Chinese bank Module",
            "Bankcode BankConnect Module",
            "Bankcode Module",
            "Merchant Module",
            "Transaction Module",
            "SandBox Module",
            "Banner Module",
            "Settlement Module",
            "Activity Logs",
            "Contact Module",
            "CMS Module",
            "Meta Module",
            "Setting Module",
            "Change Password",
          ];
          
          let settlementModules = [
            "Bank Deposit Received",
            "Local Payouts",
            "Add Funds",
            "Local Settlement",
            "International Settlement",
            "Dispute/Chargebacks",
            "Refunds",
            "Reports",
            "SettlementChangePassword",
          ];
          let output = [];

          if(userRole === 1){
            for (let i = 0; i < modules.length; i++) {
              var j = 0;
              for (j = 0; j < permissionResult.length; j++) {
                if (permissionResult[j].module === modules[i]) {
                  output.push(permissionResult[j]);
                  break;
                }
              }
              if (j === permissionResult.length) {
                output.push({
                  module: modules[i],
                  m_add: 0,
                  m_edit: 0,
                  m_delete: 0,
                  m_view: 0,
                  status: 0,
                });
              }
            }
          } else if(userRole === 2){
            for (let i = 0; i < settlementModules.length; i++) {
              var j = 0;
              for (j = 0; j < permissionResult.length; j++) {
                if (permissionResult[j].module === settlementModules[i]) {
                  output.push(permissionResult[j]);
                  break;
                }
              }
              if (j === permissionResult.length) {
                output.push({
                  module: settlementModules[i],
                  m_add: 0,
                  m_edit: 0,
                  m_delete: 0,
                  m_view: 0,
                  status: 0,
                });
              }
            }
          }

          if (Object.keys(permissionResult).length > 0) {
            return res.status(200).json({
              message: "Permission List",
              permission: output,
            });
          } else {
            return res.status(201).json({
              message: "No Permission Found",
            });
          }
        } else {
          return res.json(201, {
            message: "Invalid Token",
          });
        }
      });
    } else {
      return res.status(201).json({
        message: "Please Provide token",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "error occurered",
      error: error,
    });
  }
}

module.exports.getTypeDetails = async (req, res) => {
    try {
        // Database queries
        const sql1 = 'SELECT type FROM payout_gateway_detail';
        const sql2 = 'SELECT type FROM gateway_detail';

        // Execute both queries concurrently
        const [payoutGatewayResult, gatewayDetailsResult] = await Promise.all([
            mysqlcon(sql1),
            mysqlcon(sql2)
        ]);

        // Send the response
        res.status(200).json({ payout_gateway: payoutGatewayResult, gateway_details: gatewayDetailsResult });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.readBankCode = async (req, res) => {
  let pagination = (total, page, limit) => {
    let numOfPages = Math.ceil(total / limit);
    let start = page * limit - limit;
    return { limit, start, numOfPages };
  };

  try {
      let sql =
        `select count (*) as Total from tbl_code LEFT join payment_gateway on tbl_code.payment_gate = payment_gateway.id WHERE tbl_code.type IN (${req.body.type})`;
      let sqlCount =
        `SELECT COUNT(*) AS Total FROM tbl_code LEFT JOIN payment_gateway ON tbl_code.payment_gate = payment_gateway.id WHERE tbl_code.type IN (${req.body.type}) AND (tbl_code.akontocode LIKE '%${req.body.searchItem}%' OR tbl_code.title LIKE '%${req.body.searchItem}%' OR tbl_code.code LIKE '%${req.body.searchItem}%')`;

      let result = await mysqlcon(req.body.searchItem ? sqlCount : sql);
      let total = result[0].Total;
      let page = req.body.page ? Number(req.body.page) : 1;
      let limit = req.body.limit ? Number(req.body.limit) : 10;
      let { start, numOfPages } = pagination(total, page, limit);
      

      let sql1 =
        `SELECT payment_gateway.gateway_name, tbl_code.id as identification,tbl_code.status as status2, tbl_code.type as type2, tbl_code.bank_services_charge, tbl_code.title, tbl_code.code, tbl_code.akontocode, DATE_FORMAT(tbl_code.created_on,'%Y-%m-%d %H:%i:%s') AS created_on, DATE_FORMAT(tbl_code.updated_on,'%Y-%m-%d %H:%i:%s') AS updated_on FROM tbl_code LEFT join payment_gateway on tbl_code.payment_gate = payment_gateway.id WHERE tbl_code.type IN (${req.body.type}) ORDER BY tbl_code.created_on DESC LIMIT ?,?`;
        
      let sql2 =
        `SELECT payment_gateway.gateway_name, tbl_code.id as identification, tbl_code.status as status2, tbl_code.type as type2, tbl_code.bank_services_charge, tbl_code.title, tbl_code.code, tbl_code.akontocode, DATE_FORMAT(tbl_code.created_on, '%Y-%m-%d %H:%i:%s') AS created_on, DATE_FORMAT(tbl_code.updated_on, '%Y-%m-%d %H:%i:%s') AS updated_on FROM tbl_code LEFT JOIN payment_gateway ON tbl_code.payment_gate = payment_gateway.id WHERE tbl_code.type IN (${req.body.type}) AND (tbl_code.title LIKE '%${req.body.searchItem}%' OR tbl_code.code LIKE '%${req.body.searchItem}%') ORDER BY tbl_code.created_on LIMIT ?,?`;

      let result1 = await mysqlcon(req.body.searchItem ? sql2 : sql1, [start, limit]);

      let startRange = start + 1;
      let endRange = start + result1.length;

      return res.status(200).json({
        message: result1.length > 0 ? `Showing ${startRange} to ${endRange} data from ${total}` : "NO DATA",
        currentPage: page,
        totalPages: numOfPages,
        pageLimit: limit,
        data: result1,
      });
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};

module.exports.readContact = async function (req, res) {
  try {
    let { id } = req.body;
    let sql = "SELECT * FROM tbl_contact_us WHERE id = ?";
    let result = await mysqlcon(sql, [id]);
    return res.json(200, {
      message: "Data Fetched Successfully✅",
      data: result[0],
    });
  } catch (error) {
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};

module.exports.deleteContact = async function (req, res) {
  try {
    let { id } = req.body;

    let sql = "DELETE FROM tbl_contact_us WHERE id = ?";
    let result = await mysqlcon(sql, [id]);

    if (result) {
      return res.json(200, {
        message: "Delete Successfully✅",
      });
    } else {
      return res.json(201, {
        message: "Error while Deleting",
      });
    }
  } catch (error) {
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};

module.exports.countryList = async (req, res) => {
  try {
    let sql = "SELECT id, name FROM countries ORDER BY name ASC";

    let result = await mysqlcon(sql);
    return res.json(200, {
      result
    });
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};

module.exports.createAllUpi = async function (req, res) {
  try {
    const currentUTC = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; 
    const istTime = new Date(currentUTC.getTime() + istOffset);
    const formattedIST = istTime.toISOString().slice(0, 19).replace('T', ' ');

    let details = {
      merchant_id: req.body.merchant,
      upi_id: req.body.blockValue,
      upi_no: req.body.blockType === '5' ? req.body.blockValue.split("@")[0] : '',
      blockReason : req.body.blockReason,
      blockType: req.body.blockType, 
      status: 0,
      create_on:formattedIST,
      update_on:formattedIST
    };

    let sql = "INSERT INTO tbl_upi_block SET ?";
    let result = await mysqlcon(sql, [details]);

    if (result) {
      return res.json(200, {
        message: "USER BLOCKED SUCCESSFULLY ✅",
      });
    } else {
      return res.json(201, {
        message: "Error While Blocking",
      });
    }
  } catch (error) {
    console.log(error)
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};

module.exports.addBanks = async function(req, res) {
  try {
    let {selectedOption, id} = req.body
    const values = selectedOption.map(item => item.value);
    const commaSeparatedValues = values.join(', ');
    let sql = "UPDATE tbl_user SET bankid = ? where id = ?";
    let result = await mysqlcon(sql, [commaSeparatedValues, id])
    if(result){
      return res.json(200, {
        message: "Merchant Details Updated",
      });
    }
  } catch (error) {
    console.log(error)
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
}

module.exports.createMid = async function (req, res) {
  try {
    let { title, mid, sec_key, iv, merchant_url, merchant_otherurl } = req.body;

    let details = {
      title,
      mid,
      sec_key,
      iv,
      merchant_url,
      merchant_otherurl
    };

    let sql = "INSERT INTO tbl_ingenico_mid SET ?";

    let result = await mysqlcon(sql, [details]);

    if (result) {
      return res.json(200, {
        message: "New MID Created✅",
      });
    } else {
      return res.json(201, {
        message: "Error While Creating",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};

module.exports.createMerchantAdmin = async function (req, res) {
  try {
    const currentUTC = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; 
    const istTime = new Date(currentUTC.getTime() + istOffset);
    const formattedIST = istTime.toISOString().slice(0, 19).replace('T', ' ');
    
    let {
      fname,
      lname,
      email,
      mobile_no,
      bname,
      blocation,
      job_title,
      website,
      apv,
      ata,
      charge_back_per,
      currencies_req,
    } = req.body;
    console.log(req.body)
    // return
    
    let currenciesString = currencies_req.join(',');
    
    let countryIds = [];

    for (let currency of currencies_req) {
      let countrySql = "SELECT id FROM countries WHERE sortname = ?";
      let [country] = await mysqlcon(countrySql, [currency]);
      if (country && country.id) {
        countryIds.push(country.id);
      }
    }
    
    let countryIdsString = countryIds.join(',');

    const defaultPassword = Math.random().toString(36).slice();
    const Password = md5(defaultPassword)

    let details = {
      name: fname + " " + lname,
      fname,
      lname,
      email,
      mobile_no,
      bname,
      blocation,
      job_title,
      website,
      apv,
      ata,
      charge_back_per,
      solution_apply_for_country: countryIdsString,
      currencies_req: currenciesString,
      account_type: 1,
      password: Password,
      created_on : formattedIST,
      updated_on : formattedIST,
      bankid: "abc",
      payoutCountries: 53
    };
   

    let sql = "INSERT INTO tbl_user SET ?";
    let result = await mysqlcon(sql, [details]);

    if (result) {
      var page_path = path.join(__dirname, '../views/submerchant.ejs');
      let name = `${req.body.FirstName} ${req.body.LastName}`;
      send_mail.mail({email: req.body.Email,mobile_no: req.body.MobileNo,name : name, usercode: "Merchant",Password : defaultPassword,subject:"Merchant Created"}, 'Mercahnt');
      return res.json(200, {
        message: "Merchant Added Successfully✅",
      });
    } else {
      return res.json(201, {
        message: "Error While Creating",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};

module.exports.sendMail = async(req,res)=>{
  const {email} = req.body;

  try{
  const defaultPassword = Math.random().toString(36).slice();

  const sql = `UPDATE tbl_user SET password ='${md5(defaultPassword)}' WHERE email='${email}'`
  let result = await mysqlcon(sql,[email])
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    }
  });
  
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: 'Your new password',
    text: 'Your new password is ' + defaultPassword
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error){
      res.status(201).json({
        message : "error",
      })
    } else {
      res.status(200).json({
        message : "New Password Has Been Sent To The Registered Merchant.",
      });
    }
  });
  console.log(email)
  // res.status(200).json({
  //   message : "The reset password link has been sent to your email address",
  // });

  }catch(error){
    console.log(error)
    return res.json(500,{
      message  : "error occurred"
    })
  }
}

module.exports.createIPWhitelist = async function (req, res) {
  try {
    const currentUTC = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; 
    const istTime = new Date(currentUTC.getTime() + istOffset);
    const formattedIST = istTime.toISOString().slice(0, 19).replace('T', ' ');
    console.log(req.body)
    // return

    let details = {
      user_id: req.body.merchant,
      currency: req.body.currency,
      ip: req.body.ip,
      status: 1,
      created_on:formattedIST,
      updated_on:formattedIST
    };

    let sql = "INSERT INTO tbl_ip_whitelist SET ?";

    let result = await mysqlcon(sql, [details]);

    if (result) {
      return res.json(200, {
        message: "IP WHITELISTED SUCCESSFULLY✅",
      });
    } else {
      return res.json(201, {
        message: "Error While Creating",
      });
    }
  } catch (error) {
      console.log(error)
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};

module.exports.allGateway = async function (req, res) {
    try{
        const auth = req.user.email
        sql = "SELECT id, gateway_name from payment_gateway"
        let result = await mysqlcon(sql);
    
        res.status(200).json({
            Data:result,
            auth
        })
    
    }
    catch(err){
      console.log(err)
        res.status(500).json({
            message:"Server Error",
            err,
        })
    }
    
};

module.exports.toggleIP = async function (req, res) {
    try {
      let { status, id } = req.body;
  
      let sql = "UPDATE tbl_ip_whitelist SET status = ? WHERE id = ?";
      let result = await mysqlcon(sql, [status, id]);
      if (result.affectedRows > 0) {
        return res.json(200, {
          message: `Status ${
            status === "1" ? "Enabled" : "Disabled"
          } Successfully `,
          data: result,
          sql,
        });
      } else {
        return res.json(201, {
          message: "Error while Changing Status",
          data: result,
        });
      }
    } catch (error) {
      return res.json(500, {
        message: "error occurered",
        error: error,
      });
    }
};

module.exports.editIP = async function (req, res) {
  try {
    const currentUTC = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; 
    const istTime = new Date(currentUTC.getTime() + istOffset);
    const formattedIST = istTime.toISOString().slice(0, 19).replace('T', ' ');

    let details = {
      user_id: req.body.merchant,
      currency: req.body.currency,
      ip: req.body.ip,
      updated_on:formattedIST
    };

    if (req.body.id) {
      let sql = "UPDATE tbl_ip_whitelist SET ? where id = ?";
      let result = await mysqlcon(sql, [details, req.body.id]);
      return res.json(200, {
        message: "WHITELISTED IP UPDATED ✅",
      });
    } else {
      return res.json(205, {
        message: "Kindly Provide Id",
      });
    }
  } catch (error) {
    console.log(error)
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};

module.exports.readOneIP = async function (req, res) {
  try {
    let { id } = req.body;
    let sql = "SELECT * FROM tbl_ip_whitelist WHERE id = ?";
    let result = await mysqlcon(sql, [id]);
    res.json(result[0]);
  } catch (error) {
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};

module.exports.deleteIp = async function (req, res){
  try{
    let{id}=req.body

    let sql= "DELETE FROM tbl_ip_whitelist WHERE id = ?";
    let result = await mysqlcon(sql, [id]);
    if (result.affectedRows > 0) {
      return res.json(200, {
        message: "WHITELISTED IP DELETED SUCCESSFULLY ✅"
      });
    }else {
      return res.json(201, {
        message: "Error while Deleteing ",
      });
    }
    
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }

}

module.exports.getIdMT = async function (req, res) {
  try {
    let { id } = req.body;
    console.log(id)
    let sql = "SELECT * FROM tbl_merchant_transaction WHERE invoice_id = ?";
    let result = await mysqlcon(sql, [id]);
    if (result.length !== 0) {
      return res.json(200, {
        message: `Records for id =  ${id}`,
        data: result
      });
    } else {
      return res.json(201, {
        message: `No Record Found`,
        data: result[0],
      });
    }
  } catch (error) {
    console.log(error)
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};

module.exports.toggleCron = async function (req, res) {
  try {
    let { cron_status, id } = req.body;

    let sql = "UPDATE payment_gateway SET cron_status = ? WHERE id = ?";
    let result = await mysqlcon(sql, [cron_status, id]);
    if (result.affectedRows > 0) {
      return res.json(200, {
        message: `Status ${
          cron_status === "1" ? "Enabled" : "Disabled"
        } Successfully `,
        data: result,
        sql,
      });
    } else {
      return res.json(201, {
        message: "Error while Changing Status",
        data: result,
      });
    }
  } catch (error) {
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};

module.exports.toggleSwitch = async function (req, res) {
  try {
    let { cron_status, cron_id } = req.body;

    let sql = "UPDATE tbl_cron_status SET cron_status = ?";
    let result = await mysqlcon(sql, [cron_status, cron_id]);
    if (result.affectedRows > 0) {
      return res.json(200, {
        message: `Cron Status For All Gateway ${
          cron_status === "1" ? "Enabled" : "Disabled"
        } Successfully `,
        data: result,
        sql,
      });
    } else {
      return res.json(201, {
        message: "Error while Changing Status",
        data: result,
      });
    }
  } catch (error) {
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};

module.exports.cronMerchantLogs = async function(req, res) {
  try {
    const { id } = req.body;
    const sql = `SELECT tbl_payin_request.*, tbl_payment_gate_response_tale.*, tbl_cron_log.* FROM tbl_merchant_transaction LEFT JOIN tbl_payin_request ON tbl_merchant_transaction.order_no = tbl_payin_request.order_id LEFT JOIN tbl_payment_gate_response_tale ON tbl_merchant_transaction.order_no = tbl_payment_gate_response_tale.order_id LEFT JOIN tbl_cron_log ON tbl_merchant_transaction.order_no = tbl_cron_log.order_no WHERE tbl_merchant_transaction.invoice_id = ?`;
    const result = await mysqlcon(sql, [id]);

    if (result[0].length === 0) {
      return res.status(201).json({
        message: `No Record Found`,
        data: result[0],
      });
    }

    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
}

module.exports.DepositManualCallback = async (req, res) => {
  try{
    const currentServerTime = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(currentServerTime.getTime() + istOffset);
    let dateTime = istTime.toISOString().slice(0, 19).replace('T', ' ');
    let {id, reference, order_no,transaction,status} = req.body;
    let email = req.user.email
    if (order_no) {
      let sql = "UPDATE tbl_merchant_transaction SET baggage = ? WHERE order_no = ?";
      await mysqlcon(sql,[reference,order_no])
    }
    let sqlselect = "SELECT * FROM tbl_login WHERE email = ?";
    let resultselect = await mysqlcon(sqlselect,[email])

    if(!resultselect == 0){
      if(resultselect[0].allow_callback == 1){
        let idorder = order_no || id
        let datastatus = await helpers.change_order_status_without_status_api(idorder,status,dateTime,req)
        let dataupstatus = await helpers.update_payment_status(order_no,status,dateTime);
        let pending_transaction = await homesupport.get_update_payment_details(order_no)
        if(pending_transaction[0].status == 1){
          status = "SUCCESS",
          payment_code = "SUCC200";
        }
        else if(pending_transaction[0].status == 0){
          status = "FAILED",
          payment_code = 'SUCC202'
        }
        else if(pending_transaction[0].status == 2){
          status = "WAITING",
          payment_code = 'WAIT200'
        }
        else if(pending_transaction[0].status == 4){
          status = "REFUND",
          payment_code = "REFU200"
        }
        else if(pending_transaction[0].status == 5){
          status = "CHARGEBACK",
          payment_code = "CBACK200"
        }
        else if(pending_transaction[0].status == 5){
          status = "HARGEBACK-SETTLED",
          payment_code = "CBACKSETT200"
        }
        else{
          status = "PENDING",
          payment_code = "SUCC201"
        }
        if (pending_transaction[0].new_trx == 1) {
            var od_id = pending_transaction[0].txn_id; // merchant order ID
        } else {
            var od_id = pending_transaction[0].order_no;  // Bank order ID
        }
        await homesupport.getDetailBymer(pending_transaction[0].user_id);
        let data = {
          order_id: od_id,
          orderAmount: pending_transaction[0].ammount,
          requestedAmount: pending_transaction[0].ammount,
          currency: pending_transaction[0].ammount_type,
          txStatus: status,
          txMsg: pending_transaction[0].payment_status,
          txTime: pending_transaction[0].created_on,
          txCode: payment_code,
          checksum: md5(`${pending_transaction[0].user_id}${pending_transaction[0].ammount}${status}${pending_transaction[0].created_on}${od_id}${pending_transaction[0].secretkey}`)
        };
        let end_point_response = await  helpers.merchantPaymentStatusUpdateOnEndPoint(data,pending_transaction[0].end_point_url);

        if(end_point_response == "SUCCESS" || end_point_response == "FAILED"){
          if( pending_transaction[0].status == 1 || pending_transaction[0].status == 0){
            await helpers.merchantPaymentDbStatus(pending_transaction[0].order_no);
          }
        }
        if((end_point_response == "OK" && pending_transaction[0].status == 1) || (end_point_response == "OK" && pending_transaction[0].status == 0) ){
          await helpers.merchantPaymentDbStatus(pending_transaction[0].order_no);
        }
        const updatedData = {
          merchant_response: 'Manual',
          date_time: dateTime,
          IP: await homesupport.getClientIps(req),
          email: email,
          end_point_response: end_point_response
        };
        let created_on = dateTime;
        // let sql = "UPDATE tbl_cron_log SET data = ?, created_on = ? WHERE order_no = ?";
         let sql = "UPDATE tbl_cron_log SET data = CONCAT(COALESCE(data, ''), ' ', ?), created_on = ? WHERE order_no = ?";
        await mysqlcon(sql, [
          JSON.stringify(updatedData),
          created_on,
          order_no,
        ]);
        return res.send('Successfully send Manually Callback')
        // const redirectUrl = `https://www.ubankconnect.live/ubankconnectPages/bredirect_response.html?order_id=${order_no}`;
        // res.setHeader("Content-Type", "text/html");
        // return res.send(`
        //   ok
        //   <html>
        //     <head>
        //       <meta http-equiv="refresh" content="0;url=${redirectUrl}" />
        //     </head>
        //     <body>
        //       <script>
        //         window.location.href = "${redirectUrl}";
        //       </script>
        //     </body>
        //   </html>
        // `);
      }else{
        return res.status(201).json({
          message : "allow callback not set",
        })
      }
    }
    }catch(error){
    console.log(error);
    return res.json(500,{
      message: "error",
      error : error.message
    })
  }
};

module.exports.DepositManualCallbackMulti = async (req, res) => {
  try {
    const currentServerTime = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(currentServerTime.getTime() + istOffset);
    const dateTime = istTime.toISOString().slice(0, 19).replace('T', ' ');
    const orderNoList = req.body.orders;
    let status = req.body.status;
    const email = req.user.email;

    if (!Array.isArray(orderNoList) || orderNoList.length === 0) {
      return res.status(400).send('orders field is missing or invalid');
    }
    
    let sqlselect = "SELECT * FROM tbl_login WHERE email = ?";
    let resultselect = await mysqlcon(sqlselect,[email])

    if(resultselect[0].allow_callback == 1){
      const orderNoStr = orderNoList.map(o => `'${o}'`).join(',');
      const sqlSelect = `SELECT * FROM tbl_merchant_transaction WHERE order_no IN (${orderNoStr}) AND status = 3`;
      const payment_transactions = await mysqlcon(sqlSelect);

      if (!payment_transactions.length) return res.status(404).send('Not Found');

      const results = [];

      for (const txn of payment_transactions) {
        try {
          let state = "PENDING";
          let state_code = "SUCC201";
          let message = "Transaction pending";

          if(status == 1){
            message = 'Transaction Success.';
            state = 'SUCCESS';
            state_code = 'SUCC200';
          }else if(status == 0) {
            message = 'Transaction Failed.';
            state = 'FAILED';
            state_code = 'SUCC202';
          }

          const resultSql = `SELECT * FROM tbl_merchant_transaction WHERE gatewayNumber = ${txn.gatewayNumber} AND order_no = '${txn.order_no}'`;
          const result = await mysqlcon(resultSql);
          const resultRow = result[0];

          if (resultRow && resultRow.status === 3) {
            const updateSql = `UPDATE tbl_merchant_transaction SET updated_on = '${dateTime}', status = '${status}', payment_status = '${message}' WHERE order_no = '${resultRow.order_no}' AND gatewayNumber = ${resultRow.gatewayNumber}`;
            await mysqlcon(updateSql);
          }

          const od_id = txn.new_trx === 1 ? txn.txn_id : txn.order_no;

          const userDetailQuery = `SELECT * FROM tbl_user WHERE id = ${txn.user_id}`;
          const userDetail = await mysqlcon(userDetailQuery);
          const udetail = userDetail[0];

          const data = {
            order_id: od_id,
            orderAmount: txn.ammount,
            requestedAmount: txn.txn_amount || txn.ammount,
            currency: txn.ammount_type,
            txStatus: state,
            txMsg: message,
            txTime: txn.created_on,
            txCode: state_code,
            checksum: crypto
              .createHash('md5')
              .update(`${txn.user_id}|${txn.ammount}|${state}|${txn.created_on}|${od_id}|${udetail.secretkey}`)
              .digest('hex')
          };

          if (['SUCCESS', 'FAILED'].includes(state)) {
            const markCallbackSql = `UPDATE tbl_merchant_transaction SET merchant_db_response = 1 WHERE order_no = '${txn.order_no}' AND gatewayNumber = ${txn.gatewayNumber}`;
            await mysqlcon(markCallbackSql);

            const end_point_response = await helpers.merchantPaymentStatusUpdateOnEndPoint(data, txn.end_point_url);

            const updatedData = {
              data : data,
              merchant_response: 'Manual',
              date_time: dateTime,
              IP: await homesupport.getClientIps(req),
              email: email,
              curltime: 'Manual Callback',
              end_point_response : end_point_response
            };
            console.log("cronData",updatedData)

            const logSql = `UPDATE tbl_cron_log SET data = CONCAT(COALESCE(data, ''), ' ', ?), created_on = ? WHERE order_no = ?`;
            await mysqlcon(logSql, [JSON.stringify(updatedData), dateTime, txn.order_no]);
          }

          results.push({ order_no: txn.order_no, status: txn.status });
        } catch (txnError) {
          console.error(`Error processing order ${txn.order_no}:`, txnError);
          results.push({ order_no: txn.order_no, status: 'Error', error: txnError.message });
        }
      }
      return res.status(200).json({
        message: 'Manual Callbacks completed',
        results: results
      });
    }
    else{
      return res.status(201).json({
        message : "allow callback not set",
      })
    }
  } catch (error) {
    console.log('Callback error:', error);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports.walletupdate = async(req,res) =>{
  try{
    let {id,order_id} = req.body

    let sqlwallet = `SELECT tbl_user.wallet AS wallet,tbl_merchant_transaction.settle_amount AS settle_amount FROM  tbl_user INNER JOIN tbl_merchant_transaction ON  tbl_user.id = tbl_merchant_transaction.user_id  WHERE tbl_user.id = ? AND tbl_merchant_transaction.order_no = ?`;
    let resultwallet = await mysqlcon(sqlwallet,[id,order_id])
    let updatewallettot = resultwallet[0].wallet + resultwallet[0].settle_amount

    let data = {
      merchant_id : id ,
      order_id : order_id,
      current_wallet : resultwallet[0].wallet,
      update_wallet_tot	: updatewallettot,
      current_action : '1',
      effective_amt : resultsettle[0].settle_amount ,
      login_admin : '1',
      created_on : dateTime
     }

    let sqlwallwtuser = 'UPDATE tbl_user SET wallet = ? WHERE id = ?'
    await mysqlcon(sqlwallwtuser,[updatewallettot,id])
    let sqlwalletupdate = 'INSERT INTO tbl_wallet_update_log SET ?'
    await mysqlcon(sqlwalletupdate,[data])

  }catch(error){
    console.log(error)
    return res.status(500).json({
      message : 'error'
    })
  }
}

module.exports.loginGamez = async(req,res)=>{  
    try{
        const {email,password} = req.body
        
        if(emailvalidate.validate(email)){
            if(email && password){
                let sqlLogin = "SELECT * FROM tbl_demoweb_login WHERE email = ? AND password = ?"
                let resultLogin = await mysqlcon(sqlLogin,[email,md5(password)])
                if(resultLogin == 0){
                    res.status(201).json({
                        message : 'Data not Found',
                    })
                }else if(Object.keys(resultLogin).length > 0){
                    const Email = resultLogin[0].email
                    
                    let sqlUpdate = "UPDATE tbl_demoweb_login SET updated_on = ? WHERE email = ?"
                    await mysqlcon(sqlUpdate,[dateTime,Email])

                        if(resultLogin[0].status === 1){
                            return res.status(200).json({
                                message: "Welcome To Gamez370",
                                // Status: resultLogin[0].status,
                            });
                        } else {
                            return res.status(201).json({
                                message: "Error!",
                            });
                        }
                    }
                }else{
                    return res.status(201).json({
                    message : "Please Fill All the Field"
                })
            }
        }else{
            return res.status(201).json({
                status: "error",
                message: "Invalid Email",
            })
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : 'error'
        })
    }
}

module.exports.updatePendingsPayout = async (req, res) => {
  try {
    let sqldata = `SELECT * FROM tbl_icici_payout_transaction_response_details WHERE status = 'PENDING'  AND payout_bank = '2080' AND users_id = 62 LIMIT 2`;
    let payment_transaction = await mysqlcon(sqldata);
    if (!payment_transaction.length) {
      return res.json({ message: "No pending payouts found" });
    }

    for (const payment of payment_transaction) {
      let trx_id = payment.uniqueid;
      let findReq = payment.merchant_to_original_req;
      const findReqData = JSON.parse(findReq);

      let paydata = {
        order_id: trx_id,
        wallet_id: "254652",
        customer_id: trx_id,
        customer_name: payment.payee_name,
        customer_email: findReqData.email,
        customer_phone: findReqData.phone,
        amount: payment.amount,
        transfer_type: "IMPS",
        account_number: payment.creditacc,
        ifsc: payment.ifsc,
      };
      let config = {
        method: "post",
        url: "https://www.zenvvy.co.in/webpayment/finic/Finic/payment",
        headers: {
          "Content-Type": "application/json",
        },
        data: paydata,
      };

      let response = await axios.post(config);
      let sqlUpdate =
        "UPDATE tbl_icici_payout_transaction_response_details SET bank_full_response = ?, payout_bank = ? WHERE uniqueid = ?";
      let responseData = response.data;
      let resulupdatet = await mysqlcon(sqlUpdate, [
        responseData,
        "2080",
        trx_id,
      ]);
      return res.send(resulupdatet);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.singleClickCheckout = async (req, res) => {
  let { upi, int, collect, amount } = req.body;

  let sqldata =
    "SELECT * FROM tbl_merchant_transaction WHERE status = '1' ORDER BY invoice_id DESC LIMIT 10";
  let result = await mysqlcon(sqldata);
  let payreq = result[0];
  let order = "PAYMENT" + Date.now();
  let return_url =
    "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php";

  let paydata = {
    merchantno: 62, //payreq.user_id,
    order_id: order,
    amount: amount,
    fname: payreq.i_fname,
    lname: payreq.i_lname,
    email: payreq.i_email,
    mobile_no: payreq.i_number,
    currency: "INR",
    address: payreq.bill_address,
    city: payreq.i_city,
    state: payreq.i_state,
    country: payreq.i_country,
    pincode: payreq.i_zip,
    return_url:
      "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-return.php",
    callback_url:
      "https://homeofbulldogs.com/dev/pay-form/wp-callback/wp-callback.php",
    pay_by: "2",
    paymentMode: "TEST",
    paymentCode: "UPI",
    description: "test",
    checksum: md5(
      `${62}${req.amount}${order}${payreq.i_number}${return_url}${payreq.secretkey}`,
    ),
    upi_id: upi,
  };

  let config = {
    method: "post",
    url: "https://api.securepayments.online/payment-request-secure",
    headers: {
      "Content-Type": "application/json",
    },
    data: paydata,
  };
  let response = await axios.post(config);
  return res.send(response.data);
};

module.exports.defaultMT = async function (req, res) {
  try {
    const {
      searchText,
      to,
      from,
      status,
      merchantName,
      currency,
      gatewayNumber,
      From,
      To,
    } = req.body;
    // console.log(req.body)
    // return

    const formatted_date = [
      "DATE_FORMAT(tbl_merchant_transaction.created_on,'%Y-%m-%d %H:%i:%s') AS created_on",
    ];
    const formatted_dateStr = formatted_date.join(", ");
    const formatted_date1 = [
      "DATE_FORMAT(tbl_merchant_transaction.updated_on,'%Y-%m-%d %H:%i:%s') AS updated_on",
    ];
    const formatted_dateStr1 = formatted_date1.join(", ");

    const pagination = (total, page, limit) => {
      const numOfPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      return { limit, start, numOfPages };
    };

    let merchantString = merchantName ? merchantName.join(", ") : merchantName;
    let statusString = status ? status.join(", ") : status;
    let currenciesString = currency
      ? currency.map((c) => `'${c}'`).join(", ")
      : currency;
    let gatewayString = gatewayNumber
      ? gatewayNumber.join(", ")
      : gatewayNumber;

    const sqlDefault = `SELECT tbl_user.name, payment_gateway.gateway_name, tbl_merchant_transaction.*, ${formatted_dateStr}, ${formatted_dateStr1} FROM tbl_merchant_transaction LEFT JOIN tbl_user ON tbl_user.id = tbl_merchant_transaction.user_id LEFT JOIN payment_gateway ON payment_gateway.id = tbl_merchant_transaction.gatewayNumber`;

    const sqlConditions = [];
    const sqlValues = [];

    if (merchantName) {
      sqlConditions.push(
        `tbl_merchant_transaction.user_id IN (${merchantString})`,
      );
    }

    if (status) {
      sqlConditions.push(
        `tbl_merchant_transaction.status IN (${statusString})`,
      );
    }

    if (to && from) {
      sqlConditions.push(
        "DATE(tbl_merchant_transaction.created_on) >= ? AND DATE(tbl_merchant_transaction.created_on) <= ?",
      );
      sqlValues.push(from, to);
    }

    if (To && From) {
      sqlConditions.push(
        "DATE(tbl_merchant_transaction.updated_on) >= ? AND DATE(tbl_merchant_transaction.updated_on) <= ?",
      );
      sqlValues.push(From, To);
    }

    if (currency) {
      sqlConditions.push(
        `tbl_merchant_transaction.ammount_type IN (${currenciesString})`,
      );
    }

    if (gatewayNumber) {
      sqlConditions.push(
        `tbl_merchant_transaction.gatewayNumber IN (${gatewayString})`,
      );
    }

    // if (searchText) {
    //   sqlConditions.push("MATCH(tbl_merchant_transaction.order_no, tbl_merchant_transaction.txn_id) AGAINST (? IN NATURAL LANGUAGE MODE)");
    //   sqlValues.push(`%${searchText}%`);
    // }
    if (searchText) {
      sqlConditions.push("tbl_merchant_transaction.txn_id = ?");
      sqlValues.push(`${searchText}`);
    }

    const conditionsStr =
      sqlConditions.length > 0 ? `WHERE ${sqlConditions.join(" AND ")}` : "";

    const sqlCount = `SELECT COUNT(*) AS Total FROM tbl_merchant_transaction ${conditionsStr}`;

    let result = await mysqlcon(sqlCount, sqlValues);

    let total = result[0].Total;
    let page = req.body.page ? Number(req.body.page) : 1;
    let limit = req.body.limit ? Number(req.body.limit) : 10;
    let { start, numOfPages } = pagination(total, page, limit);

    const sqlData = `${sqlDefault} ${conditionsStr} ORDER BY tbl_merchant_transaction.created_on DESC LIMIT ?,?`;
    let result1 = await mysqlcon(sqlData, [...sqlValues, start, limit]);

    let startRange = start + 1;
    let endRange = Math.min(start + limit, total);

    return res.json({
      message:
        result1.length > 0
          ? `Showing ${startRange} to ${endRange} data from ${total}`
          : "NO DATA",
      currentPage: page,
      totalPages: numOfPages ? numOfPages : 1,
      pageLimit: limit,
      data: result1,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

module.exports.uploadDocument = async (req, res) => {
  const { id } = req.body;
  let filterType = req.body.filterType ? Number(req.body.filterType) : 1;
  req.body.filterType ? Number(req.body.filterType) : 2;
  req.body.filterType ? Number(req.body.filterType) : 3;
  req.body.filterType ? Number(req.body.filterType) : 4;
  req.body.filterType ? Number(req.body.filterType) : "";
  // console.log(req.body.filterType)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER,
    to: "anisha16rawat@gmail.com",
    subject: "Send Attachament",
    html: "<h1>Hello, This is Attachanment !!</h1><p>This is test mail..!</p>",
    attachments: [
      {
        filename: req.files.image[0].originalname,
        path: filepath + "/" + req.files.image[0].originalname,
      },
      {
        filename: req.files.image1[0].originalname,
        path: filepath + "/" + req.files.image1[0].originalname,
      },
      {
        filename: req.files.image2[0].originalname,
        path: filepath + "/" + req.files.image2[0].originalname,
      },
      {
        filename: req.files.image3[0].originalname,
        path: filepath + "/" + req.files.image3[0].originalname,
      },
    ],
  };

  var llp = {
    merchant_id: id,
    llp_business_identity: req.files.image[0].originalname,
    llp_business_existence: req.files.image1[0].originalname,
    llp_business_owners: req.files.image2[0].originalname,
    llp_business_working: req.files.image3[0].originalname,
  };

  let prtnr = {
    merchant_id: id,
    prtnr_business_identity: req.files.image[0].originalname,
    prtnr_business_existence: req.files.image1[0].originalname,
    prtnr_business_working: req.files.image2[0].originalname,
    prtnr_business_owners: req.files.image3[0].originalname,
  };

  let sole = {
    merchant_id: id,
    sole_business_identity_existence: req.files.image[0].originalname,
    sole_business_working: req.files.image1[0].originalname,
    sole_business_owners: req.files.image2[0].originalname,
    sole_address_owner: req.files.image3[0].originalname,
  };

  let ngo = {
    merchant_id: id,
    ngo_business_identity: req.files.image[0].originalname,
    ngo_business_existence: req.files.image1[0].originalname,
    ngo_business_working: req.files.image2[0].originalname,
    ngo_business_owners: req.files.image3[0].originalname,
  };
  try {
    let sql = "SELECT kyc_type from tbl_user WHERE id = ?";
    let result = await mysqlcon(sql, [id]);
    let test = result[0].kyc_type;
    if (test !== 0) {
      if (test === "llp") {
        let sql =
          "UPDATE kyc_document SET ?, created_on = now(), modified_on = now() WHERE merchant_id = ?  ";
        let result = await mysqlcon(sql, [llp, id]);

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.status(200).json({
              message: "error",
            });
          } else {
            res.status(200).json({
              message: "Documents Uploaded",
            });
          }
        });
      } else if (test === "prtnr") {
        let sql =
          "UPDATE kyc_document  SET ?, created_on = now(), modified_on = now() WHERE merchant_id = ?";
        let result = await mysqlcon(sql, [prtnr, id]);

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.status(200).json({
              message: "error",
            });
          } else {
            res.status(200).json({
              message: "Documents Uploaded",
            });
          }
        });
      } else if (test === "sole") {
        let sql =
          "UPDATE kyc_document  SET ?, created_on = now(), modified_on = now() WHERE merchant_id = ?";
        let result = await mysqlcon(sql, [sole, id]);

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.status(200).json({
              message: "error",
            });
          } else {
            res.status(200).json({
              message: "Documents Uploaded",
            });
          }
        });
      } else if (test === "ngo") {
        let sql =
          "UPDATE kyc_document  SET ?, created_on = now(), modified_on = now() WHERE merchant_id = ?";
        let result = await mysqlcon(sql, [ngo, id]);

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.status(200).json({
              message: "error",
            });
          } else {
            res.status(200).json({
              message: "Documents Uploaded",
            });
          }
        });
      }
    } else {
      if (filterType === 1) {
        let sql =
          "INSERT INTO kyc_document SET ?, created_on = now(), modified_on = now()";
        let userSql = "UPDATE tbl_user SET kyc_type = 'llp' WHERE id = ?";
        let result = await mysqlcon(sql, [llp]);
        let result1 = await mysqlcon(userSql, [id]);

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.status(200).json({
              message: "error",
            });
          } else {
            res.status(200).json({
              message: "Documents Uploaded",
              result1,
            });
          }
        });
      } else if (filterType === 2) {
        let sql =
          "INSERT INTO kyc_document  SET ?, created_on = now(), modified_on = now()";
        let userSql = "UPDATE tbl_user SET kyc_type = 'prtnr' WHERE id = ?";
        let result = await mysqlcon(sql, [prtnr]);
        let result1 = await mysqlcon(userSql, [id]);

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.status(200).json({
              message: "error",
            });
          } else {
            res.status(200).json({
              message: "Documents Uploaded",
            });
          }
        });
      } else if (filterType === 3) {
        let sql =
          "INSERT INTO kyc_document  SET ?, created_on = now(), modified_on = now()";
        let userSql = "UPDATE tbl_user SET kyc_type = 'sole' WHERE id = ?";
        let result = await mysqlcon(sql, [sole]);
        let result1 = await mysqlcon(userSql, [id]);

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.status(200).json({
              message: "error",
            });
          } else {
            res.status(200).json({
              message: "Documents Uploaded",
            });
          }
        });
      } else if (filterType === 4) {
        let sql =
          "INSERT INTO kyc_document  SET ?, created_on = now(), modified_on = now()";
        let userSql = "UPDATE tbl_user SET kyc_type = 'ngo' WHERE id = ?";
        let result = await mysqlcon(sql, [ngo]);
        let result1 = await mysqlcon(userSql, [id]);

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.status(200).json({
              message: "error",
            });
          } else {
            res.status(200).json({
              message: "Documents Uploaded",
            });
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "error",
    });
  }
};

module.exports.kycdetails = async (req, res) => {
  try {
    let user = req.user;
    let ID;
    if (user.account_type === 3) {
      ID = user.parent_id;
    } else {
      ID = user.id;
    }
    let sql = "SELECT kyc_type from tbl_user WHERE id = ?";
    let result = await mysqlcon(sql, [ID]);
    let test = result[0].kyc_type;
    let sqlResult;
    let sql1;
    if (test === "llp") {
      sql1 =
        "SELECT id, merchant_id, llp_business_identity AS doc1,llp_business_existence AS doc2,llp_business_owners AS doc3,llp_business_working AS doc4, document_1, document_2, document_3, document_4 FROM kyc_document WHERE merchant_id = ?";
      sqlResult = await mysqlcon(sql1, [ID]);
    } else if (test === "prtnr") {
      sql1 =
        "SELECT id, merchant_id, prtnr_business_identity AS doc1,prtnr_business_existence AS doc2,prtnr_business_working AS doc3,prtnr_business_owners AS doc4, document_1, document_2, document_3, document_4 FROM kyc_document WHERE merchant_id = ?";
      sqlResult = await mysqlcon(sql1, [ID]);
    } else if (test === "sole") {
      sql1 =
        "SELECT id, merchant_id, sole_business_identity_existence AS doc1,sole_business_working AS doc2,sole_business_owners AS doc3,sole_address_owner AS doc4, document_1, document_2, document_3, document_4 FROM kyc_document WHERE merchant_id = ?";
      sqlResult = await mysqlcon(sql1, [ID]);
    } else if (test === "ngo") {
      sql1 =
        "SELECT id, merchant_id, ngo_business_identity AS doc1,ngo_business_existence AS doc2,ngo_business_working AS doc3,ngo_business_owners AS doc4, document_1, document_2, document_3, document_4 FROM kyc_document WHERE merchant_id = ?";
      sqlResult = await mysqlcon(sql1, [ID]);
    }
    res.status(200).json({
      category: test,
      finalResult: sqlResult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports.addFund = async(req, res)=> {
  try {
    let {merchant, amount, currency, action, objective, remark} = req.body
    const date = new Date();

    const sqlSettCurr = "Select wallet from tbl_user where id = ?";
    const result = await mysqlcon(sqlSettCurr, [merchant]);

    let FinalAddForWallet = action === 'Add' ? result[0].wallet + (Number(amount)) : result[0].wallet - (Number(amount))

    let loginDetails;
    if(req.user.group_id === 1) {
      loginDetails = -1
    } else if(req.user.group_id === 2){
      if(req.user.role === 1){
        loginDetails = 1
      } else if(req.user.role === 2){
        loginDetails= 2
      }
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let order_id = '';
    for (let i = 0; i < 19; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      order_id += chars[randomIndex];
    }

    const insertAddData = {
      merchant_id: merchant,
      order_id: order_id,
      objective: objective,
      currency: currency,
      current_wallet : result[0].wallet,
      update_wallet_tot : FinalAddForWallet,
      effective_amt: amount,
      current_action : action === 'Add' ? 1 : 2,
      remark: remark,
      created_on : date,
      login_admin: loginDetails
    };
    
    const sqlForWall = "Update tbl_user SET wallet = ? WHERE id = ?";
    await mysqlcon(sqlForWall, [FinalAddForWallet, merchant]);
    const sqlForAddFund = "INSERT INTO tbl_wallet_update_log SET ?";
    await mysqlcon(sqlForAddFund, [insertAddData]);
    res.status(200).json({ message: "Fund Added Successfully ✅" });
    
  } catch(error){
    console.log(error)
    return res.json(500,{
      message : 'error'
    });
  }
}
