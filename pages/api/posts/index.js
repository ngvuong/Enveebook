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
    uploadDir: './',
  });

  return new Promise(() => {
    form.parse(req, async (err, fields, files) => {
      const { image } = files;
      const { text, user_id } = fields;

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      if (!text && !image) {
        return res.status(400).json({ error: 'Please provide post content' });
      }

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
                width: 500,
                height: 500,
              },
            ],
            resource_type: 'image',
            public_id: `enveebook_images/${image.newFilename}`,
            overwrite: true,
          });

          const post = await Post.create({
            content: {
              ...(text && { text }),
              image: result.secure_url,
            },
            author: user.name,
          });

          user.posts = [...user.posts, post._id];

          fs.unlink(image.filepath, (err) => {
            if (err) {
              throw err;
            }
          });
        } else {
          const post = await Post.create({
            content: {
              text,
            },
            author: user.name,
          });

          user.posts = [...user.posts, post._id];
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
