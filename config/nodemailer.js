const nodemailer = require('nodemailer')

const mailer = nodemailer.createTransport({
    host:process.env.server,
    port:process.env.mailerport,
    auth: {
        user:process.env.Login,
        pass:process.env.pass
    },
})

module.exports = {mailer}

