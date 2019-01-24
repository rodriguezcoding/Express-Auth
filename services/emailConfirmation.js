const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
const smtp = require("nodemailer-smtp-transport");

const emailConfirmation = (isInvite, isRecovery, user) => {
  const xoAuthGenerate = xoauth2.createXOAuth2Generator({
    type: "OAuth2",
    user: "luis.rodriguezcastro31@gmail.com",
    clientId: process.env.SECRET_KEY_EMAIL_CLIENTID,
    clientSecret: process.env.SECRET_KEY_EMAIL_SECRETKEY,
    refreshToken: process.env.SECRET_KEY_EMAIL_REFRESH_TOKEN
  });

  let recovery = {
    from: "NoReply<authenticate.noreply@gmail.com>",
    to: user.email,
    subject: isRecovery ? "Account Recovery" : "Confirm Your Email",
    generateTextFromHTML: true,
    html: `<b>Hello welcome to Super Task, ${
      isRecovery
        ? "please click the next url to recover account:"
        : "to complete registrarion please click:"
    } http://localhost:4741/${
      isRecovery ? "accountRecovery" : "emailConfirmation"
    }/verify/${user.hashedId} </b>`
  };

  let invitation = {
    from: "NoReply<authenticate.noreply@gmail.com>",
    to: user.email,
    subject: "Super Task Team Invitation",
    generateTextFromHTML: true,
    html: `<b>Hello welcome to Super Task, please confirm your invitation: http://localhost:4741/teams/invite/verify/${
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
    smtpTransport: smtpTransport.sendMail(isInvite ? invitation : recovery),
    close: smtpTransport
  };
};

module.exports = emailConfirmation;
