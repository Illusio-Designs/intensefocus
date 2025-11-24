const axios = require('axios').default;

class MSG91Service {
    constructor() {
        this.widgetId = process.env.MSG91_WIDGET_ID;
        this.authKey = process.env.MSG91_AUTH_KEY;
        this.templateId = process.env.MSG91_TEMPLATE_ID;
        this.otpExpiry = process.env.MSG91_OTP_EXPIRY || 5;
        this.baseUrl = 'https://control.msg91.com/api/v5';

        // Validate environment variables
        if (!this.widgetId || !this.authKey) {
            console.warn('⚠️  MSG91 credentials not configured. Set MSG91_WIDGET_ID and MSG91_AUTH_KEY in .env file');
        }
    }

    async sendOtp(phoneNumber) {

        const options = {
            method: 'POST',
            url: `${this.baseUrl}/otp`,
            params: { otp_expiry: this.otpExpiry, template_id: this.templateId, mobile: phoneNumber, authkey: this.authKey, realTimeResponse: 1 },
            headers: { 'content-type': 'application/json', 'Content-Type': 'application/JSON' },
        };

        try {
            const { data } = await axios.request(options);
            return data;
        } catch (error) {
            console.error(error);
        }
    }


    async verifyOtp(phoneNumber, otp) {

        const options = {
            method: 'GET',
            url: `${this.baseUrl}/otp/verify`,
            params: { otp: otp, mobile: phoneNumber },
            headers: { authkey: this.authKey }
        };

        try {
            const { data } = await axios.request(options);
            return data;
        } catch (error) {
            console.error(error);
        }
    }

}

module.exports = new MSG91Service();