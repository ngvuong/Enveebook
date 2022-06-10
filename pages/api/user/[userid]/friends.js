import User from '../../../../models/user';
import dbConnect from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userid } = req.query;
    const { current_user_id, type } = req.body;

    await dbConnect();

    if (type === 'request') {
      await User.findByIdAndUpdate(
        userid,
        {
          $push: {
            friendRequests: {
              $each: [current_user_id],
              $position: 0,
            },
          },
        },
        { runValidators: false }
      );

      return res.status(200).json({ message: 'Friend request sent' });
    } else if (type === 'accept') {
      await User.findByIdAndUpdate(
        userid,
        {
          $push: { friends: { $each: [current_user_id], $position: 0 } },
        },
        { runValidators: false }
      );

      await User.findByIdAndUpdate(
        current_user_id,
        {
          $push: { friends: { $each: [userid], $position: 0 } },
          $pull: { friendRequests: userid },
        },
        { runValidators: false }
      );

      return res.status(200).json({ message: 'Friend request accepted' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
