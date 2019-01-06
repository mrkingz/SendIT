/* eslint-disable no-empty */
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.load();

/**
 * 
 *
 * @export
 * @class NotificationService
 */
export default class NotificationService {
  /**
   * Send an email notification
   *
   * @static
   * @param {object} options
   * @memberof NotificationService
   */
  static sendEmail(options) {
    const transporter = this.createEmailTransporter();
    const mailOptions = {
      from: process.env.EMAIL,
      to: options.receiver.email,
      subject: options.subject || `SendIT Notification`,
      html: `<h3>Hi, ${options.receiver.name};</h3>
              <p>${options.message}</p>
              <p><b>Thank you for your patronage!</b></p>
              <p><b>SendIT Management </b></p>
              <p> Regards!</p>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (process.env.NODE_ENV === 'development') {
        if (error) console.log(error);
        if (info) console.log(info.response);
      }
    });
  }

  /**
   * Create email notification transporter
   *
   * @static
   * @returns {object} the transporter
   * @method createEmailTransporter
   * @memberof NotificationService
   */
  static createEmailTransporter() {
    return nodemailer.createTransport({
      secure: true,
      host: "smtp.gmail.com",
      type: "OAuth2",
      auth: { user: process.env.EMAIL, pass: process.env.PASSWORD }
    });
  }
}