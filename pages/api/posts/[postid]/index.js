import Post from '../../../../models/post';
import User from '../../../../models/user';
import Comment from '../../../../models/comment';
import dbConnect from '../../../../lib/db';

export default async function handler(req, res) {
  const { postid } = req.query;

  if (req.method === 'GET') {
    try {
      await dbConnect();

      const post = await Post.findById(postid, 'likes').populate(
        'likes',
        'name image'
      );

      res.status(200).json(post.likes);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  } else if (req.method === 'PUT') {
    const { user_id, user_name, user_image } = req.body;

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
        post.likes.unshift({
          _id: user_id,
          name: user_name,
          image: user_image,
        });
      }

      await post.save();

      res.status(200).json({ likes: post.likes });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      await dbConnect();

      const post = await Post.findByIdAndDelete(postid);
      await User.findByIdAndUpdate(post.author, { $pull: { posts: postid } });
      await Comment.deleteMany({ post: postid });

      res.status(200).json({ message: 'Post deleted' });
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
