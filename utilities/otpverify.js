
// const dotenv = require('dotenv')
// dotenv.config({ path: './.env' })


// const accountSid = process.env.ACCOUNT_SID;
// const authToken = process.env.AUTH_TOKEN;
// // const verifySid = process.env.SSID
// const client = require('twilio')(accountSid,authToken);

// let sid;

// function sendotp(sendotpphone) {
// console.log("opt w8ing")
//     client.verify.v2.services
//         .create({ friendlyName: 'OTP' })
//         .then(service => {
//             sid = service.sid;
//             client.verify.v2
//                 .services(sid)
//                 .verifications.create({ to: `+91${sendotpphone}`, channel: "sms" })
//                 .then((verification) => console.log(verification.status));
//         })



// }

// function verifyotp(phone, otp) {
//     console.log(phone, otp)
//     return new Promise((resolve, reject) => {
//         client.verify.v2
//             .services(sid)
//             .verificationChecks.create({ to: `+91${phone}`, code: otp })
//             .then((verification_check) => {
//                 console.log(verification_check.status)
//                 resolve(verification_check)
//             })
//     })
// }

// const dotenv = require('dotenv')
const dotenv = require('dotenv')

dotenv.config({path:'./.env'})


const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const verifySid = process.env.SSID


const client = require('twilio')(accountSid,authToken);

function sendotp(sendotpphone){
    client.verify.v2
   .services(verifySid)
   .verifications.create({ to:`+91${sendotpphone}`, channel: "sms" })
   .then((verification) => console.log(verification.status));

}

function verifyotp(phone,otp){
    return new  Promise((resolve,reject)=>{
        client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: `+91${phone}`, code: otp })
         .then((verification_check) => {console.log(verification_check.status)
         resolve(verification_check)})
        })
  

}
module.exports = {
    sendotp,
    verifyotp

}