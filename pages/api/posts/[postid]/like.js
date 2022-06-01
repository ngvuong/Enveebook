import Post from '../../../../models/post';
import dbConnect from '../../../../lib/db';

export default async function handler(req, res) {
  const { postid } = req.query;

  if (req.method === 'GET') {
    try {
      await dbConnect();

      const post = await Post.findById(postid, 'likes');

      res.status(200).json(post.likes);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  } else if (req.method === 'POST') {
    const { user_id, user_name } = req.body;

    try {
      await dbConnect();
      const post = await Post.findById(postid).populate('likes');

      const alreadyLiked = post.likes.find(
        (like) => like._id.toString() === user_id
      );

      if (alreadyLiked) {
        post.likes = post.likes.filter(
          (like) => like._id.toString() !== user_id
        );
      } else {
        post.likes.push({ _id: user_id, name: user_name });
      }

      await post.save();

      res.status(200).json({ likes: post.likes });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    });
  }
}
