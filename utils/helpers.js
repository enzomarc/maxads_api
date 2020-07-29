const axios = require('axios').default;

// Constants
const smsApiUser = "groupebbf2020";
const smsApiPassword = "l3oM4UgD";
const smsApiSender = "MaxAds";

exports.smsApiUrl = (message, destination = "") => {
  return encodeURI("https://obitsms.com/api/bulksms?username=" + smsApiUser + "&password=" + smsApiPassword + "&sender=" + smsApiSender + "&message=" + message + "&destination=" + destination);
}

exports.randomCode = (length) => {
  let code = "";

  for (i = 0; i < length; i++)
    code += Math.floor(Math.random() * 9).toString();

  return code;
}

exports.sendSms = async (destination, sms) => {
  await axios.get(this.smsApiUrl(sms, destination))
    .then((response) => {
      return response.status == 200;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
}

/**
 * Check if given phone format is correct
 * 
 * @param {string} phone 
 */
exports.checkPhone = (phone) => {
  if (phone.length < 13)
    return false;

  if (!phone.startsWith('+237'))
    return false;

  return true;
}