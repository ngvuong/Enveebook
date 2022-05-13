import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Joi from 'joi';

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

postSchema.static.validatePost = function (post) {
  const schema = Joi.object({
    content: Joi.string().trim().required().messages({
      'string.empty': 'Content is required',
    }),
    author: Joi.string().trim().required().messages({
      'string.empty': 'Author is required',
    }),
    comments: Joi.array().optional().messages({
      'array.empty': 'Comments is required',
    }),
    likes: Joi.array().optional().messages({
      'array.empty': 'Likes is required',
    }),
  });

  return schema.validate(post, { abortEarly: false });
};

export default mongoose.models.Post || mongoose.model('Post', postSchema);
