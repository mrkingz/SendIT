/* eslint-disable no-empty */
import dotenv from "dotenv";
import Twilio from "twilio";
import nodemailer from "nodemailer";
import configs from "../configs";

dotenv.config();

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
      if (process.env.NODE_ENV === "development") {
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
      auth: configs.nodemailerConfig
    });
  }

  /**
   * Send sms message
   *
   * @static
   * @param {object} options
   * @return {Promise} a promise
   * @method sendSMS
   * @memberof NotificationService
   */
  static sendSMS(options) {
    const { fromNumber, accountSid, authToken } = configs.twilioConfig;
    const client = new Twilio(accountSid, authToken);
    return client.messages
      .create({
        body: options.message,
        from: fromNumber,
        to: options.phoneNumber
      })
      .then(message => {
        if (process.env.NODE_ENV === "development") console.log(message.body);
        return Promise.resolve({ success: true, message });
      })
      .catch(error =>
        Promise.resolve({ success: false, message: error.message })
      );
  }
}
