import User from '../../../../models/user';
import dbConnect from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bio } = req.body;
  const { userid } = req.query;

  try {
    await dbConnect();

    if (bio.length > 140) {
      return res
        .status(400)
        .json({ error: 'Bio must be less than 140 characters' });
    }

    const user = await User.findById(userid);

    if (user.bio !== bio) {
      user.bio = bio;
      await user.save({ validateBeforeSave: false });
    }

    return res.status(200).json(user.bio);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
}
