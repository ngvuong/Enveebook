import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import User from '../../../models/user';
import Post from '../../../models/post';
import dbConnect from '../../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({
    uploadDir: '/temp',
  });

  return new Promise(() => {
    form.parse(req, async (err, fields, files) => {
      const { image } = files;
      const { text, user_id } = fields;

      if (!image && !text) {
        return res.status(400).json({ error: 'Please provide post content' });
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      try {
        if (
          err ||
          (image &&
            (!allowedTypes.includes(image.mimetype) || image.size > 5000000))
        ) {
          res.status(400).json({ error: 'Invalid post content' });

          if (image) {
            fs.unlink(image.filepath, (err) => {
              if (err) {
                throw err;
              }
            });
          }

          return;
        }
        await dbConnect();
        const user = await User.findById(user_id);

        if (image) {
          const result = await cloudinary.uploader.upload(image.filepath, {
            transformation: [
              {
                width: 750,
                height: 750,
                gravity: 'face',
                crop: 'fill',
              },
            ],
            resource_type: 'image',
            public_id: `enveebook_images/${image.newFilename}`,
            overwrite: true,
          });

          fs.unlink(image.filepath, (err) => {
            if (err) {
              throw err;
            }
          });

          const newPost = {
            content: {
              ...(text && { text }),
              image: { url: result.secure_url, public_id: result.public_id },
            },
            author: user_id,
          };

          const { error } = Post.validatePost(newPost);
          if (error) {
            return res.status(400).json({ error: error.details[0].message });
          }

          const post = await Post.create(newPost);

          user.posts = [post._id, ...user.posts];
        } else {
          const newPost = {
            content: {
              ...(text && { text }),
            },
            author: user_id,
          };

          const { error } = Post.validatePost(newPost);
          if (error) {
            return res.status(400).json({ error: error.details[0].message });
          }

          const post = await Post.create(newPost);

          user.posts = [post._id, ...user.posts];
        }

        await user.save({ validateBeforeSave: false });

        res.status(200).json({ message: 'Post created successfully' });
      } catch (error) {
        res.status(400).json({ error: error.message });
        if (image) {
          fs.unlink(image.filepath, (err) => {
            if (err) {
              throw err;
            }
          });
        }
      }
    });
  });
}
