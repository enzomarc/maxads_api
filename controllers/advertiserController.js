const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');
const mailer = require('../utils/mailer');
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

      await advertiser.save(async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Une erreur est survenue lors de la création de l'annonceur." });
        }

        // Generate advertiser activation and send mail
        const url = `${req.protocol}://${req.get('host')}/api/advertisers/confirm/${advertiser._id}`;
        const mailContent = mailer.parseEmail('registration_confirmation.html', { VERIF_URL: url, USERNAME: advertiser.first_name + ' ' + advertiser.last_name });

        await mailer.sendMail('emarc237@gmail.com', "Confirmez votre inscription", mailContent)
          .then((sended) => {
            if (sended)
              return res.status(201).json({ message: "Votre compte annonceur a été créé avec succès, vous recevrez une confirmation par mail.", advertiser: result });
            else
              return res.status(201).json({ message: "Votre compte annonceur a été créé avec succès." });
          })
          .catch((err) => {
            console.error(err);
            return res.status(201).json({ message: "Votre compte annonceur a été créé avec succès." });
          });
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
        const token = jwt.sign({ phone: advertiser.phone, email: advertiser.email }, constants.ADS_SECRET);

        return res.json({ token: token });
      } else {
        return res.status(401).json({ message: "Adresse email ou mot de passe invalide(s)." });
      }
    } else {
      return res.status(401).json({ message: "Adresse email ou mot de passe invalide(s)." });
    }
  });
}

/**
 * Activate advertiser account.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.verify = async (req, res) => {
  const id = req.params.code;

  await Advertiser.findById(id, async (err, advertiser) => {
    if (err) {
      console.error(err);
      return res.status(500).json(false);
    }

    if (advertiser) {
      if (advertiser.active) {
        return res.status(500).json(false);
      } else {
        advertiser.active = true;

        await advertiser.save((err, saved) => {
          if (err) {
            console.error(err);
            return res.status(500).json(false);
          }

          return res.json(true);
        });
      }
    } else {
      return res.status(500).json({ message: "Le compte de l'annonceur est introuvable." });
    }
  });
}

exports.update = async (req, res) => {
  const id = req.params.id;

  await Advertiser.findById(id, async (err, advertiser) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Une erreur est survenue lors de la modification du profil.", error: err });
    }

    if (advertiser) {
      const data = req.body;
      const avatar = req.file;

      delete data['type'];
      delete data['email'];
      delete data['phone'];
      delete data['password'];
      delete data['active'];
      delete data['verified'];
      delete data['avatar'];

      for (const key in data) {
        advertiser[key] = data[key];
      }

      await advertiser.save(async (err, updated) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Une erreur est survenue lors de la modification du profil.", error: err });
        }

        if (avatar != null) {
          advertiser.avatar = `${req.protocol}://${req.get('host')}/content/upload/advertisers_pics/${avatar.filename}`;

          await advertiser.save((err, saved) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Une erreur est survenue lors de la modification de la photo de profil.", error: err });
            }

            return res.json({ message: "Le profil de l'annonceur a été mis à jour avec succès.", advertiser: saved });
          });
        }

        return res.json({ message: "Le profil de l'annonceur a été mis à jour avec succès.", advertiser: updated });
      });
    } else {
      return res.status(500).json({ message: "Le compte de l'annonceur est introuvable." });
    }
  });
}