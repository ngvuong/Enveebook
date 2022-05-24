import cloudinary from 'cloudinary';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import User from '../../../models/user';
import dbConnect from '../../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({
    uploadDir: './',
  });

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      const { image } = files;
      const { user_id } = fields;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      if (
        err ||
        (image &&
          (!allowedTypes.includes(image.mimetype) || image.size > 5000000))
      ) {
        res.status(400).json({ error: 'Image could not be uploaded' });
        fs.unlink(image.filepath, (err) => {
          if (err) {
            throw err;
          }
        });
        return;
      }

      try {
        await dbConnect();
        const user = await User.findById(user_id);

        if (user.image.url && user.image.public_id) {
          cloudinary.v2.uploader.destroy(user.image.public_id, (err) => {
            if (err) {
              throw err;
            }
          });
        }

        if (image) {
          const result = await cloudinary.v2.uploader.upload(image.filepath, {
            transformation: [
              {
                width: 150,
                height: 150,
                gravity: 'face',
                crop: 'thumb',
              },
            ],
            resource_type: 'image',
            public_id: `enveebook_avatars/${image.newFilename}`,
            overwrite: true,
          });

          user.image = { url: result.secure_url, public_id: result.public_id };
          await user.save({ validateBeforeSave: false });

          fs.unlink(image.filepath, (err) => {
            if (err) {
              throw err;
            }
          });
        } else {
          user.image = { url: '', public_id: '' };
          await user.save({ validateBeforeSave: false });
        }

        const updatedUser = {
          id: user._id,
          image: user.image,
          name: user.name,
          email: user.email,
          bio: user.bio,
        };

        res.status(200).json(updatedUser);
        return resolve();
      } catch (error) {
        res.status(400).json({ error: error.message });

        fs.unlink(image.filepath, (err) => {
          if (err) {
            throw err;
          }
        });

        return resolve();
      }
    });
  });
}
