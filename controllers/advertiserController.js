const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Constants = require('../utils/constants');
const Advertiser = require('../models/advertiser');

/**
 * Create a new advertiser.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.register = async (req, res) => {
  await Advertiser.findOne({ email: req.body.email }, async (err, advertiser) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Un compte avec les mêmes informations existe déjà. Mot de passe oublié?" });
    }

    if (advertiser) {
      return res.status(500).json({ message: "Un compte avec les mêmes informations existe déjà. Mot de passe oublié?" });
    } else {
      const data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        email: req.body.email,
        address: {
          country: req.body.country,
          city: req.body.city
        },
        type: req.body.type,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync()),
      };

      advertiser = new Advertiser(data);

      await advertiser.save((err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Une erreur est survenue lors de la création de l'annonceur." });
        }

        return res.status(201).json({ message: "Votre compte annonceur a été créé avec succès, vous recevrez une confirmation par mail.", advertiser: result });
      });
    }
  });
}

/**
 * Login and generate token for the advertiser with given credentials.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.login = async (req, res) => {
  const credentials = { email: req.body.email, password: req.body.password };

  await Advertiser.findOne({ email: credentials.email }, (err, advertiser) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Une erreur est survenue lors de la connexion." });
    }

    if (advertiser) {
      if (!advertiser.active)
        return res.status(401).json({ message: "Votre compte est inactif, vous trouverez plus amples d'informations dans votre boîte mail." });

      if (bcrypt.compareSync(credentials.password, advertiser.password)) {
        const token = jwt.sign({ phone: advertiser.phone, email: advertiser.email }, Constants.ADS_SECRET);

        return res.json({ token: token });
      } else {
        return res.status(401).json({ message: "Adresse email ou mot de passe invalide(s)." });
      }
    } else {
      return res.status(401).json({ message: "Adresse email ou mot de passe invalide(s)." });
    }
  });
}
