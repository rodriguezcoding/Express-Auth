const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
const smtp = require("nodemailer-smtp-transport");

const emailConfirmation = (user) => {
  const xoAuthGenerate = xoauth2.createXOAuth2Generator({
    type: "OAuth2",
    user: "luis.rodriguezcastro31@gmail.com",
    clientId: process.env.SECRET_KEY_EMAIL_CLIENTID,
    clientSecret: process.env.SECRET_KEY_EMAIL_SECRETKEY,
    refreshToken: process.env.SECRET_KEY_EMAIL_REFRESH_TOKEN
  });

  let mailOptions = {
    from: "NoReply<authenticate.noreply@gmail.com>",
    to: user.email,
    subject: "Confirm Your Email",
    generateTextFromHTML: true,
    html: `<b>Hello welcome to the service, to complete registrarion please click: http://localhost:3000/emailConfirmation/verify/${
      user.hashedId
    } </b>`
  };

  const smtpTransport = nodemailer.createTransport(
    smtp({
      service: "gmail",
      auth: {
        xoauth2: xoAuthGenerate
      }
    })
  );

  return {
    smtpTransport: smtpTransport.sendMail(mailOptions),
    close: smtpTransport
  };
};

module.exports = emailConfirmation;
