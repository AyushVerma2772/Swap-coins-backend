const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


const sendOtp = (req, res) => {
    const { phoneNumber } = req.body;
    client.verify.v2.services("VAe98bc02114ca1b1a2834c45649c3723a")
        .verifications
        .create({ to: `+91${phoneNumber}`, channel: 'sms' })
        .then(verification => res.json({ success: true, sid: verification.sid, message: "OTP sent successfully" }))
        .catch(error => res.json({ success: false, error, message: "Please enter correct number" }));
}


const verifyOtp = (req, res) => {
    const { phoneNumber, code } = req.body;
    client.verify.v2.services("VAe98bc02114ca1b1a2834c45649c3723a")
        .verificationChecks
        .create({ to: `+91${phoneNumber}`, code })
        .then(verification_check => res.json({ success: verification_check.status === 'approved', message: "OTP verified" }))
        .catch(error => res.json({ success: false, error, message: "Wrong OTP" }));
}

module.exports = { sendOtp, verifyOtp }