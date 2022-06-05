import Post from '../../../../models/post';
import dbConnect from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userid } = req.query;

    await dbConnect();

    const posts = await Post.find({ author: userid })
      .populate('author', 'name image')
      .populate({
        path: 'comments',
        populate: [
          { path: 'author', select: 'name image' },
          {
            path: 'likes',
            select: 'name image',
          },
          {
            path: 'replies',
            populate: [
              { path: 'author', select: 'name image' },
              { path: 'likes', select: 'name image' },
            ],
          },
        ],
      })
      .populate('likes', 'name image')
      .sort({
        createdAt: -1,
      });

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
