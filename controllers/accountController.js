const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const Verification = require('../models/verification');
const helpers = require('../utils/helpers');


/**
 * Start user registration and verification.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.checkRegistration = async (req, res) => {
  const phone = req.params.phone;

  if (!helpers.checkPhone(phone))
    return res.status(500).json(false);
  else {
    await User.findOne({ phone: phone }, async (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json(false);
      }

      const code = helpers.randomCode(4);
      const data = { phone: phone, code: bcrypt.hashSync(code, bcrypt.genSaltSync()) };

      await Verification.create(data, (err, doc) => {
        if (err) {
          console.error(err);
          return res.status(500).json(false);
        }

        const SMS = "Votre code MaxAds est " + code + ", vous pouvez appuyer sur ce lien pour vérifier votre appareil: https://v.maxads.com/" + code;
        let sended = helpers.sendSms(phone, SMS);

        if (sended) {
          if (user != null)
            user.update({ lastVerification: new Date() });

          return res.json(true);
        } else {
          doc.deleteOne();
          return res.json(false);
        }
      });
    });
  }
}

/**
 * Check registration verification code.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.verify = async (req, res) => {
  const code = req.params.code;
  const phone = req.data.phone;

  await Verification.find({ phone: phone }, (err, verifications) => {
    if (err) {
      console.error(err);
      return res.json(false);
    }

    verifications.forEach(async (verification) => {
      await bcrypt.compare(code, verification.code, async (err, same) => {
        if (err)
          console.error(err);

        if (same) {
          const now = new Date();
          await User.findOne({ phone: verification.phone }, (err, doc) => {
            if (err) {
              console.error(err);
              return res.status(500).json(false);
            }

            if (doc != null) {
              doc.update({ active: true, verified: true, lastConnection: now, lastVerification: now }, (err, updated) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json(false);
                }

                verification.deleteOne();
                const token = jwt.sign({ phone: verification.phone, lastVerification: doc.lastVerification, lastConnection: doc.lastConnection }, Constants.AUTH_SECRET);
                return res.json({ token: token, phone: phone });
              });
            } else {
              const user = new User({ phone: verification.phone, active: true, verified: true, lastVerification: now, lastConnection: now });
              user.save((err, doc) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json(false);
                }

                verification.deleteOne();
                const token = jwt.sign({ phone: verification.phone, lastVerification: doc.lastVerification, lastConnection: doc.lastConnection }, Constants.AUTH_SECRET);
                return res.json({ token: token, phone: phone });
              });
            }
          });
        }
      });
    });

    return false;
  });
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