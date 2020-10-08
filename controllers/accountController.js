const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const Verification = require('../models/verification');
const Preference = require('../models/preference');
const helpers = require('../utils/helpers');
const constants = require('../utils/constants');


/**
 * Start user registration and verification.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.checkRegistration = async (req, res) => {
  const phone = req.params.phone;
  const prefix = req.params.prefix;

  await User.findOne({ phone: phone }, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json(false);
    }

    const code = helpers.randomCode(4);
    const data = { prefix: prefix, phone: phone, code: bcrypt.hashSync(code, bcrypt.genSaltSync()) };

    await Verification.create(data, async (err, doc) => {
      if (err) {
        console.error(err);
        return res.status(500).json(false);
      }

      const sms = "Votre code MaxAds est " + code + ", vous pouvez appuyer sur ce lien pour vérifier votre appareil: https://v.maxads.com/" + code;
      await helpers.sendSms(prefix + phone, sms).then((sended) => {
        if (sended == true) {
          if (user != null)
            user.update({ lastVerification: new Date() });

          return res.json(true);
        } else {
          doc.deleteOne();
          return res.json(false);
        }
      });
    });
  });
}

/**
 * Check registration verification code.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.verify = async (req, res) => {
  const code = req.body.code;
  const phone = req.body.phone;
  const prefix = req.body.prefix;

  await Verification.find({ prefix: prefix, phone: phone }, (err, verifications) => {
    if (err) {
      console.error(err);
      return res.json(false);
    }

    if (verifications.length <= 0)
      return res.json(false);

    let founded = false;

    verifications.forEach(async (verification) => {
      if (bcrypt.compareSync(code, verification.code)) {
        const now = new Date();
        founded = true;

        await User.findOne({ prefix: verification.prefix, phone: verification.phone }, async (err, doc) => {
          if (err) {
            console.error(err);
            return res.status(500).json(false);
          }

          if (doc != null) {
            const preference = await Preference.findOne({ user_id: doc._id });

            await doc.updateOne({ active: true, verified: true, lastConnection: now, lastVerification: now, preferences: preference ? preference._id : null }, async (err, updated) => {
              if (err) {
                console.error(err);
                return res.status(500).json(false);
              }

              verification.deleteOne();
              const token = jwt.sign({ prefix: verification.prefix, phone: verification.phone, lastVerification: doc.lastVerification, lastConnection: doc.lastConnection, new: false }, constants.AUTH_SECRET);

              return res.json({ token: token, prefix: prefix, phone: phone, username: preference.username, description: preference.description });
            });
          } else {
            const user = new User({ prefix: verification.prefix, phone: verification.phone, active: true, verified: true, lastVerification: now, lastConnection: now });

            await user.save((err, doc) => {
              if (err) {
                console.error(err);
                return res.status(500).json(false);
              }

              verification.deleteOne();

              const token = jwt.sign({ id: doc._id, prefix: doc.prefix, phone: doc.phone, lastVerification: doc.lastVerification, lastConnection: doc.lastConnection, new: true }, constants.AUTH_SECRET);
              return res.json({ token: token, prefix: doc.prefix, phone: doc.phone });
            });
          }
        });
      }
    });

    if (!founded)
      return res.status(404).json(false);
  });
}

/**
 * Authenticate the user with the given token.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.auth = async (req, res) => {
  const token = req.body.token;

  if (token == null) return false;

  await jwt.verify(token, constants.AUTH_SECRET, async (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: 'Invalid token provided.' });
    }

    if (decoded) {
      const phone = decoded.phone;
      const prefix = decoded.prefix;

      await User.findOne({ prefix: prefix, phone: phone }, async (err, user) => {
        if (err) {
          console.error(err);
          return res.status(401).json({ message: 'Error during user retrieve.' });
        }

        if (user) {
          if (user.verified && user.active) {
            user.lastConnection = new Date();

            await user.save((err, saved) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Invalid token provided.' });
              }

              const token = jwt.sign({ id: user._id, prefix: user.prefix, phone: user.phone, lastVerification: user.lastVerification, lastConnection: user.lastConnection, new: false }, constants.AUTH_SECRET);
              return res.json(token);
            });
          } else {
            return res.status(401).json({ message: 'User account is disabled.' });
          }
        } else {
          return res.status(401).json({ message: 'Invalid token provided.' })
        }
      });

      return true;
    } else return false;
  });
}

/**
 * Check wether a given user exists.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.exists = async (req, res) => {
  const phone = req.params.phone;
  const prefix = req.params.prefix;

  await User.findOne({ prefix: prefix, phone: phone }).populate('preferences').exec(async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json(false);
    }

    if (user) {
      console.log(user);
      const description = user.preferences ? user.preferences.description : "";
      const avatar = user.preferences ? user.preferences.avatar : "";

      return res.json({ id: user._id, prefix: user.prefix, phone: user.phone, actu: description, avatar: avatar });
    } else {
      return res.json(false);
    }
  });
}
