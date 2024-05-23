const nodemailer = require('nodemailer');
const { nodeMailConfig, mailTemplate } = require('../config/email');
const { generateRandomCode } = require('../helper/helper');

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
};
