import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('Comment', commentSchema);
