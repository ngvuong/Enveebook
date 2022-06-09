import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Joi from 'joi';
import './comment';

const postSchema = new Schema(
  {
    content: {
      text: String,
      image: { url: String, public_id: String },
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
        'string.empty': 'Please provide post content',
        'string.max': 'Post must be 1000 characters or less',
      }),
      image: Joi.object({
        url: Joi.string().trim().required().uri().messages({
          'string.uri': 'Image url is not valid',
          'string.empty': 'Image url is required',
          'any.required': 'Image url is required',
        }),
        public_id: Joi.string().trim().required().messages({
          'string.empty': 'Image public id is required',
          'any.required': 'Image public id is required',
        }),
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
