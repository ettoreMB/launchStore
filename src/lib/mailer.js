const nodemailer = require('nodemailer')

//test mailtrap.io/inboxes
module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e02f69ec50d28a",
    pass: "921bcd2406b46d"
  }
});


