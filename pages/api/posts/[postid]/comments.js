import Post from '../../../../models/post';
import Comment from '../../../../models/comment';
import dbConnect from '../../../../lib/db';

export default async function handler(req, res) {
  const { postid } = req.query;

  if (req.method === 'GET') {
    try {
      await dbConnect();
      const comments = await Comment.find({ post: postid })
        .populate('author', 'name image')
        .populate({
          path: 'replies',
          populate: { path: 'author', select: 'name image' },
        })
        .sort({
          createdAt: -1,
        });

      return res.status(200).json(comments);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    const { content, user_id, comment_id } = req.body;

    try {
      await dbConnect();
      const comment = await Comment.create({
        content,
        post: postid,
        author: user_id,
        type: comment_id ? 'reply' : 'comment',
      });

      if (comment_id) {
        await Comment.findByIdAndUpdate(comment_id, {
          $push: {
            replies: { $each: [comment._id], $position: 0 },
          },
        });
      }

      await Post.findByIdAndUpdate(postid, {
        $push: {
          comments: {
            $each: [comment._id],
            $position: 0,
          },
        },
      });

      return res.status(200).json({ message: 'Comment created successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
