import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Joi from 'joi';

const postSchema = new Schema(
  {
    content: {
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

postSchema.static.validatePost = function (post) {
  const schema = Joi.object({
    content: Joi.object({
      text: Joi.string().trim().max(400).messages({
        'string.max': 'Post must be less than 400 characters long',
      }),
      image: Joi.string().trim().uri().messages({
        'string.uri': 'Image url is not valid',
      }),
    })
      .required()
      .messages({
        'object.empty': 'Post is required',
        'any.required': 'Post is required',
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
