import Post from '../../../../models/post';
import User from '../../../../models/user';
import dbConnect from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userid } = req.query;

    await dbConnect();
    const user = await User.findById(userid);
    const authorList = [user._id, ...user.friends];
    const posts = await Post.find({ author: { $in: authorList } })
      .populate('author', 'name image')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name image' },
      })
      .sort({
        createdAt: -1,
      });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
