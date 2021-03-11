const nodemailer = require('nodemailer')

//test mailtrap.io/inboxes
module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "04efce5ddf3f88",
    pass: "20fcd255e1460a"
  }
});


