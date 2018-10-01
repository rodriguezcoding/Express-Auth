const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
const smtp = require("nodemailer-smtp-transport");

const emailConfirmation = (email, hashId) => {
  const xoAuthGenerate = xoauth2.createXOAuth2Generator({
    type: "OAuth2",
    user: "luis.rodriguezcastro31@gmail.com",
    clientId: process.env.SECRET_KEY_EMAIL_CLIENTID,
    clientSecret: process.env.SECRET_KEY_EMAIL_SECRETKEY,
    refreshToken: process.env.SECRET_KEY_EMAIL_REFRESH_TOKEN
  });

  const smtpTransport = nodemailer.createTransport(
    smtp({
      service: "gmail",
      auth: {
        xoauth2: xoAuthGenerate
      }
    })
  );

  let mailOptions = {
    from: "NoReply<authenticate.noreply@gmail.com>",
    to: email,
    subject: "Confirm Your Email",
    generateTextFromHTML: true,
    html: `<b>Hello welcome to the service, to confirm email please click : http://localhost:3000/emailConfirmation/verify/${hashId}</b>`
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) return console.log(error);
    smtpTransport.close();
  });
};

module.exports = emailConfirmation;
