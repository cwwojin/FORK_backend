/** load email config from env */
const verificationMailTemplate = `<h1>Enter the Verification Code Below \n\n\n\n\n</h1>`;

module.exports = {
    nodeMailConfig: {
        host: process.env.NODEMAIL_HOST,
        port: process.env.NODEMAIL_PORT,
        secure: true,
        pool: true,
        auth: {
            user: process.env.NODEMAIL_USER,
            pass: process.env.NODEMAIL_PASSWORD,
        }
    },
    mailTemplate: verificationMailTemplate,

}
