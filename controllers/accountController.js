const User = require("../models/user");
const Verification = require('../models/verification');
const helpers = require('../utils/helpers');
const bcrypt = require('bcrypt');

exports.sendSMS = async (req, res) => {
  const phone = req.params.phone;

  if (phone.length < 12)
    return res.status(500).json({ message: "Le format du numéro de téléphone est incorrect." });

  const code = helpers.randomCode(4);
  const SMS = "Votre code MaxAds est " + code + ", vous pouvez appuyer sur ce lien pour vérifier votre appareil: https://v.maxads.com/" + code;
  let sended = helpers.sendSms(phone, SMS);
  console.log(sended);

  if (sended) {
    return res.json({ message: "Message envoyé avec succès" });
  } else {
    return res.status(500).json({ message: "Le message n'a pas été envoyé" });
  }
}

exports.exists = async (req, res) => {
  const phone = req.body.phone;
  const register = req.body.register;

  await User.findOne({ phone: phone }, (err, doc) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ exists: false, error: err });
    }

    if (doc != null) {
      if (register) sendSMS(phone);

      return res.json({ user: doc, exists: true });
    }
    else
      return res.json({ exists: false });
  });
}

exports.verify = async (req, res) => {
  const code = req.params.code;

  await Verification.findOne({ code: code }, (err, doc) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    }

    return bcrypt.compareSync(code, doc.code);
  });
}