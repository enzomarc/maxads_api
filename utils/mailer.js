const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

/**
 * Send e-mail.
 * 
 * @param {String} to 
 * @param {String} subject 
 * @param {String} content 
 */
exports.sendMail = async (to, subject, content) => {
  const account = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'snowjonn237@gmail.com',
      pass: 'Follow10',
    },
  });

  const info = await transporter.sendMail({
    from: '"MaxAds Support" <support@maxads.com>',
    to: to,
    subject: subject,
    html: content,
  });

  return info.messageId != null;
}

/**
 * Parse e-mail HTML template and replace content if replacements provided.
 * 
 * @param {String} file 
 * @param {Array} replacements 
 */
exports.parseEmail = (template, replacements) => {
  let content = fs.readFileSync(path.resolve(__dirname, '../content/mails/' + template));

  for (var key of Object.keys(replacements)) {
    content = content.toString().replace('%' + key + '%', replacements[key]);
  }

  return content;
}