const User = require("../models/user");
const Preference = require("../models/preference");


/**
 * Save user preferences.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  const phone = req.params.phone;

  await User.findOne({ phone: phone }, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Impossible de modifier les paramètres de l'utilisateur.", error: err });
    }

    if (user) {
      await Preference.findOne({ user_id: user._id }, async (err, preference) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Impossible de modifier les paramètres de l'utilisateur.", error: err });
        }

        if (preference) {
          await preference.update(req.body, (err, save) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Impossible de modifier les paramètres de l'utilisateur.", error: err });
            }

            return res.json({ message: "Paramètres modifiés avec succès.", preference: preference });
          });
        } else {
          const data = {
            user_id: user._id,
            ...req.body
          };

          await Preference.create(data, (err, doc) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Impossible de modifier les paramètres de l'utilisateur.", error: err });
            }

            return res.json({ message: "Paramètres modifiés avec succès.", preference: doc });
          });
        }
      });
    }
  });
}

/**
 * Get user preferences.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.show = async (req, res) => {
  const phone = req.params.phone;

  await User.findOne({ phone: phone }, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Impossible d'obtenir les paramètres de l'utilisateur.", error: err });
    }

    if (user) {
      await Preference.findOne({ user_id: user._id }, async (err, preference) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Impossible d'obtenir les paramètres de l'utilisateur.", error: err });
        }

        if (preference) {
          return res.json(preference);
        } else {
          return res.status(404).json({ message: "Impossible d'obtenir les paramètres de l'utilisateur." });
        }
      });
    } else {
      return res.status(404).json({ message: "Impossible d'obtenir les paramètres de l'utilisateur." });
    }
  });
}

/**
 * Update user profile pic.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.avatar = async (req, res) => {
  const phone = req.params.phone;

  await User.findOne({ phone: phone }, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Impossible d'obtenir les paramètres de l'utilisateur.", error: err });
    }

    if (user) {
      await Preference.findOne({ user_id: user._id }, async (err, preference) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Impossible d'obtenir les paramètres de l'utilisateur.", error: err });
        }

        if (preference) {
          if (req.file != null) {
            console.log(req.file);
            preference.avatar = `${req.protocol}://${req.get('host')}/content/upload/pics/${req.file.filename}`;

            await preference.save((err, saved) => {
              if (err) {
                console.error(err);
                return res.status(500).json(false);
              }

              return res.json({ preference: saved });
            });
          }
        } else {
          return res.status(404).json({ message: "Impossible d'obtenir les paramètres de l'utilisateur." });
        }
      });
    }
  });
}