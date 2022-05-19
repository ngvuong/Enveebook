import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Joi from 'joi';

const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
    minLength: [6, 'Password must be at least 6 characters long'],
    required: [true, 'Password is required'],
  },
  bio: {
    type: String,
    maxLength: [140, 'Bio must be less than 140 characters long'],
  },
  image: {
    url: String,
    public_id: String,
  },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

userSchema.statics.validateUser = function (user) {
  const schema = Joi.object({
    name: Joi.string().alphanum().trim().min(3).max(20).required().messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must be less than 20 characters long',
      'string.alphanum': 'Username contains invalid characters',
      'any.required': 'Username is required',
    }),
    email: Joi.string().trim().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Email is not valid',
      'any.required': 'Email is required',
    }),
    password: Joi.string().trim().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
    bio: Joi.string().trim().max(140).messages({
      'string.max': 'Bio must be less than 140 characters long',
    }),
    image: Joi.object({
      url: Joi.string().trim().required().messages({
        'string.empty': 'Image url is required',
        'any.required': 'Image url is required',
      }),
      public_id: Joi.string().trim().required().messages({
        'string.empty': 'Image public id is required',
        'any.required': 'Image public id is required',
      }),
    })
      .optional()
      .messages({ 'object.empty': 'Image is required' }),
    friends: Joi.array()
      .optional()
      .messages({ 'array.empty': 'Friends is required' }),
    friendRequests: Joi.array()
      .optional()
      .messages({ 'array.empty': 'Friend requests is required' }),
    posts: Joi.array()
      .optional()
      .messages({ 'array.empty': 'Posts is required' }),
  });

  return schema.validate(user, { abortEarly: false });
};

export default mongoose.models.User || mongoose.model('User', userSchema);
