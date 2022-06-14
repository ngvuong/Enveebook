import Comment from '../../../../../../models/comment';
import Post from '../../../../../../models/post';
import dbConnect from '../../../../../../lib/db';

export default async function handler(req, res) {
  const { postid, commentid } = req.query;

  if (req.method === 'GET') {
    try {
      await dbConnect();

      const comment = await Comment.findById(commentid, 'likes').populate(
        'likes',
        'name image'
      );

      res.status(200).json(comment.likes);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  } else if (req.method === 'PUT') {
    const { user_id } = req.body;

    try {
      await dbConnect();

      const comment = await Comment.findById(commentid);

      if (comment.likes.some((like) => like.toString() === user_id)) {
        comment.likes = comment.likes.filter(
          (like) => like.toString() !== user_id
        );
      } else {
        comment.likes = [user_id, ...comment.likes];
      }

      await comment.save();

      res.status(200).json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      await dbConnect();

      const comment = await Comment.findByIdAndDelete(commentid);

      const replies = comment.replies ? comment.replies : [];

      if (replies.length) {
        await Comment.deleteMany({ _id: comment.replies });
      }

      await Post.findByIdAndUpdate(postid, {
        $pull: { comments: { $in: [commentid, ...replies] } },
      });

      res.status(200).json({ message: 'Comment deleted' });
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
