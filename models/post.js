import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.models.Post || mongoose.model('Post', postSchema);
