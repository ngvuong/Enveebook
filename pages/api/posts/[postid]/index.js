import { v2 as cloudinary } from 'cloudinary';
import Post from '../../../../models/post';
import User from '../../../../models/user';
import Comment from '../../../../models/comment';
import dbConnect from '../../../../lib/db';

export default async function handler(req, res) {
  const { postid } = req.query;

  if (req.method === 'GET') {
    try {
      await dbConnect();

      const post = await Post.findById(postid, 'likes').populate({
        path: 'likes',
        select: 'name image friends',
      });

      if (!post) {
        return res.status(404).json([]);
      }

      res.status(200).json(post.likes);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  } else if (req.method === 'PUT') {
    const { user_id } = req.body;

    try {
      await dbConnect();

      const post = await Post.findById(postid);

      if (post.likes.some((like) => like.toString() === user_id)) {
        post.likes = post.likes.filter((like) => like.toString() !== user_id);
      } else {
        post.likes = [user_id, ...post.likes];
      }

      await post.save();

      res.status(200).json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      await dbConnect();

      const post = await Post.findByIdAndDelete(postid);

      if (post.content.image.url) {
        cloudinary.uploader.destroy(post.content.image.public_id, (err) => {
          if (err) {
            throw err;
          }
        });
      }

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
