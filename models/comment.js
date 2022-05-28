import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Joi from 'joi';

// const replySchema = new Schema(
//   {
//     content: {
//       type: String,
//       required: true,
//     },
//     author: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     comment: {
//       type: Schema.Types.ObjectId,
//       ref: 'Comment',
//       required: true,
//     },
//     likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
//   },
//   { timestamps: true }
// );

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['comment', 'reply'],
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
    replies: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
      default: undefined,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

commentSchema.statics.validateComment = function (comment) {
  const schema = Joi.object({
    content: Joi.string().trim().max(1000).required().messages({
      'string.empty': 'Content is required',
      'string.max': 'Content must be less than 1000 characters long',
    }),
    type: Joi.string().trim().required().valid('comment', 'reply').messages({
      'string.empty': 'Type is required',
      'string.only': 'Type must be either comment or reply',
    }),
    author: Joi.string()
      .trim()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.empty': 'Author is required',
      }),
    post: Joi.string()
      .trim()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.empty': 'Post is required',
      }),
    replies: Joi.array().optional(),
    likes: Joi.array().optional(),
  });

  return schema.validate(comment, { abortEarly: false });
};

export default mongoose.models.Comment ||
  mongoose.model('Comment', commentSchema);
