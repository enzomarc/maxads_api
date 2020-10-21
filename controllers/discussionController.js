const Discussion = require('../models/discussion');
const Message = require('../models/message');
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

  const user = await User.findOne({ prefix: prefix, phone: phone });

  if (user) {
    const discussions = await Discussion.find({ from: user._id }).populate('messages');
    console.log(discussions);

    return res.json(discussions);
  }
  else
    return res.json(false);
}

/**
 * Store sended messages.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  const body = req.body
  const user = await User.findById(body.from).populate('discussions');

  if (user) {
    const toUser = await User.findById(body.to);

    if (toUser) {
      let discussion = await Discussion.findOne({ from: user._id, to: toUser._id }).populate('messages');

      if (!discussion) {
        discussion = new Discussion({ from: user._id, to: body.to });

        await discussion.save(async (err, saved) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Impossible de créer une nouvelle discussion." });
          }

          const message = new Message({ discussion: discussion._id, type: body.type, content: body.content, from: body.from });
          await message.save();

          discussion.messages.push(message);
          await discussion.save();

          if (user._id != toUser._id) {
            user.discussions.push(discussion._id);
            toUser.discussions.push(new Discussion({ from: toUser._id, to: user._id }));
            await user.save();
            await toUser.save();
          } else {
            user.discussions.push(discussion);
            await user.save();
          }
        });
      } else {
        const message = new Message({ discussion: discussion._id, type: body.type, content: body.content, from: body.from });
        await message.save();

        discussion.messages.push(message);
        await discussion.save();

        if (user._id != toUser._id) {
          user.discussions.push(discussion);
          toUser.discussions.push(discussion);
          await user.save();
          await toUser.save();
        } else {
          user.discussions.push(discussion);
          await user.save();
        }
      }

      discussion = await discussion.populate('messages').execPopulate();
      return res.json(discussion);
    }
  }
}