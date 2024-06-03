const nodemailer = require('nodemailer');

const { nodeMailConfig, mailTemplate, passwordResetMailTemplate } = require('../config/email');
const { generateRandomCode, generateRandomPassword } = require('../helper/helper');

const transporter = nodemailer.createTransport(nodeMailConfig);

module.exports = {
    /** send 6-digit code to email */
    sendAuthMail: async (dest) => {
        const code = generateRandomCode();
        const mailOptions = {
            from: process.env.NODEMAIL_ADDRESS,
            to: dest,
            subject: ' FORK - Email Verification ',
            html: mailTemplate + `<h3>\t${code}\t<h3>`,
        };
        try {
            const info = await transporter.sendMail(mailOptions);
            return {
                info: info,
                authCode: code,
            };
        } catch (err) {
            throw {
                status: 500,
                message: `Error occured while sending verification mail : ${err.message}`,
            };
        }
    },
    /** send password reset mail */
    sendPasswordResetMail: async (dest) => {
        const password = generateRandomPassword(10); // default length : 10
        const mailOptions = {
            from: process.env.NODEMAIL_ADDRESS,
            to: dest,
            subject: ' FORK - Password Reset ',
            html: passwordResetMailTemplate + `<h3>\t${password}\t<h3>`,
        };
        try {
            const info = await transporter.sendMail(mailOptions);
            return {
                info: info,
                newPassword: password,
            };
        } catch (err) {
            throw {
                status: 500,
                message: `Error occured while sending password-reset mail : ${err.message}`,
            };
        }
    },
};
