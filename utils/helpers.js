const axios = require('axios').default;

// Constants
const smsApiUser = "groupebbf2020@gmail.com";
const smsApiPassword = "l3oM4UgD";
const smsApiSender = "MaxAds";

exports.smsApiUrl = (message, destination = "") => {
  return encodeURI("https://obitsms.com/api/bulksms?username=" + smsApiUser + "&password=" + smsApiPassword + "&sender=" + smsApiSender + "&message=" + message + "&destination=" + destination);
}

/**
 * Generate random integer.
 * 
 * @param {Number} length 
 */
exports.randomCode = (length) => {
  let code = "";

  for (i = 0; i < length; i++)
    code += Math.floor(Math.random() * 9).toString();

  return code;
}

/**
 * Send given SMS to given phone number.
 * 
 * @param {String} destination 
 * @param {String} sms 
 */
exports.sendSms = async (destination, sms) => {
  const response = await axios.get(this.smsApiUrl(sms, destination)).catch((err) => {
    console.error(err);
    return false;
  });

  return response != false;
}

/**
 * Check if given phone format is correct
 * 
 * @param {String} phone 
 */
exports.checkPhone = (phone) => {
  if (phone.length < 13)
    return false;

  if (!phone.startsWith('+237'))
    return false;

  return true;
}