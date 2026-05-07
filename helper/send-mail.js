const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // replace with your SMTP server
  port: 587, // or 465 for secure
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});
let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views", relativePath+'.ejs'),
    data,
    function (err, template) {
      if (err) {
        console.log("error in rendering template", err);
        return;
      }
      mailHTML = template;
    }
  );
  return mailHTML;
};
module.exports.mail = (data,file) => {
  let htmlString = renderTemplate(data, file);
 
  transporter.sendMail(
    {
      from: process.env.USER,
      to: data.email, 
      subject: data.subject,
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }
      console.log("Message sent", info);
      return;
    }
  );
};