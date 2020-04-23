const config = require('@src/config');
const nodemailer = require('nodemailer');
const logger = require('@src/server_setup/logging');

const sendEmail = {};

sendEmail.usingNodeMailer = async (sendTo, subject, message, htmlMessage) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const account = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });

  const mailOptions = {
    subject,
    from: `"${config.SEND_FROM_NAME}" <${config.SEND_FROM_EMAIL}>`,
    to: sendTo,
    text: message,
    html: htmlMessage
  };

  const response = await transporter.sendMail(mailOptions);
  logger.logInfo('Message sent: %s', response.messageId);
  // Preview only available when sending through an Ethereal account
  logger.logInfo('Preview URL: %s', nodemailer.getTestMessageUrl(response));
};

module.exports = sendEmail;
