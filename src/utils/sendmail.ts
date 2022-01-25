import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey(`${process.env.SENDGRID_KEY}`);

const SendMail = async (msg, emailType = '') => {
  return sgMail
    .send({
      ...msg,
      from: `${process.env.GOSALON_MAIL_SENDER}` // Change to your verified sender
    })
    .then(() => {
      console.log(`${emailType} email sent!`);
      return true;
    })
    .catch(() => {
      console.log(`${emailType} email failed!`);
    });
};

export default SendMail;