import User from '../../../models/user';
import dbConnect from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bio, user_id } = req.body;

  try {
    await dbConnect();
    const user = await User.findById(user_id);

    if (user.bio !== bio) {
      user.bio = bio;
      await user.save();
    }

    const updatedUser = {
      id: user._id,
      image: user.image,
      name: user.name,
      email: user.email,
      bio: user.bio,
    };

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
}
