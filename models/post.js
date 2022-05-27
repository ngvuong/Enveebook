import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Joi from 'joi';
import './comment';

const postSchema = new Schema(
  {
    content: {
      type: Object,
      text: String,
      image: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

postSchema.statics.validatePost = function (post) {
  const schema = Joi.object({
    content: Joi.object({
      text: Joi.string().trim().max(1000).messages({
        'string.max': 'Post must be 1000 characters or less',
      }),
      image: Joi.string().trim().uri().messages({
        'string.uri': 'Image url is not valid',
      }),
    })
      .or('text', 'image')
      .required()
      .messages({
        'object.missing': 'Please provide post content',
      }),
    author: Joi.string()
      .trim()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.empty': 'Author is required',
      }),
    comments: Joi.array().optional(),
    likes: Joi.array().optional(),
  });

  return schema.validate(post);
};

export default mongoose.models.Post || mongoose.model('Post', postSchema);
