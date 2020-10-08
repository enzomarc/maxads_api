const Discussion = require('../models/discussion');
const User = require('../models/user');

/**
 * Get specified user discussions.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.all = async (req, res) => {
  const prefix = req.params.prefix;
  const phone = req.params.phone;

  const user = await User.findOne({ prefix: prefix, phone: phone }).populate('discussions');

  console.log(user);

  if (user)
    return res.json(user.discussions);
  else
    return res.json(false);
}

exports.store = async (req, res) => {
  const prefix = req.params.prefix;
  const phone = req.params.phone;
  const to = req.body.to;

  const user = await User.findOne({ prefix: prefix, phone: phone }).populate('discussions');

  if (user) {
    const toUser = await User.findById(to);

    if (toUser) {
      const discussion = new Discussion({ from: user._id, to: to });
      await discussion.save((err, res) => {
        if (err) {
          console.error(err);
          return res.json({ message: "Impossible de créer une nouvelle discussion." });
        }

        return res.json(discussion);
      });
    }
  }
}