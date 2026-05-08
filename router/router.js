const myapihubroute = require('express').Router()
const helper = require("../helper/jwt");
const multer = require("multer");
const apiController = require("../controller/adminmerchant")

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    let imgname = new Date().toString();
    imgname = imgname.replace(/ |:|\+|\(|\)/gi, "-");
    let imgext = path.extname(file.originalname);
    let image = `${imgname}${imgext}`;
    cb(null, image);
  },
});
const uploads = multer({ storage: storage })

myapihubroute.post("/login",apiController.login)
myapihubroute.post("/modulePesmission",apiController.modulePesmission)
myapihubroute.post("/getTypeDetails",apiController.getTypeDetails)
myapihubroute.post("/readBankCode",apiController.readBankCode)
myapihubroute.post("/deleteContact",apiController.deleteContact)
myapihubroute.post("/readContact",apiController.readContact)
myapihubroute.post("/countryList",apiController.countryList)
myapihubroute.post("/createAllUpi",apiController.createAllUpi)
myapihubroute.post("/addBanks",apiController.addBanks)
myapihubroute.post("/createMid",apiController.createMid)
myapihubroute.post("/createMerchantAdmin",apiController.createMerchantAdmin)
myapihubroute.post("/sendMail",apiController.sendMail)
myapihubroute.post("/allGateway",apiController.allGateway);
myapihubroute.post("/createIPWhitelist",apiController.createIPWhitelist);
myapihubroute.post("/toggleIP",apiController.toggleIP);
myapihubroute.post("/readOneIP",apiController.readOneIP);
myapihubroute.post("/editIP",apiController.editIP);
myapihubroute.post("/deleteIp",apiController.deleteIp);
myapihubroute.post("/getIdMT",apiController.getIdMT)
myapihubroute.post("/toggleCron",apiController.toggleCron)
myapihubroute.post("/toggleSwitch",apiController.toggleSwitch)
myapihubroute.post("/cronMerchantLogs",apiController.cronMerchantLogs)
myapihubroute.post("/DepositManualCallback",helper.verify,apiController.DepositManualCallback)
myapihubroute.post("/DepositManualCallbackMulti",helper.verify,apiController.DepositManualCallbackMulti)
myapihubroute.post("/walletupdate",helper.verify,apiController.walletupdate)
myapihubroute.post("/loginGamez",apiController.loginGamez)
myapihubroute.post("/updatePendingsPayout",apiController.updatePendingsPayout)
myapihubroute.post("/singleClickCheckout",apiController.singleClickCheckout)
myapihubroute.post("/defaultMT",apiController.defaultMT)
myapihubroute.post("/uploadDocument",apiController.uploadDocument)
myapihubroute.post("/kycdetails",apiController.kycdetails)
myapihubroute.post("addFund",apiController.addFund)




module.exports = myapihubroute