import cloudinary from 'cloudinary';
import User from '../../../models/user';
import dbConnect from '../../../lib/db';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
export default async function handler(req, res) {
  // if (!session) {
  //   return res.redirect('/');
  // }

  console.log(req.body);

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // console.log(req.body);
  await dbConnect();
  const user = await User.findById(req.body.id);
  if (user.image) {
    const public_id =
      'enveebook_avatars/' + user.image.split('/').pop().split('.')[0];
    cloudinary.v2.uploader.destroy(public_id, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
    });
  }

  await User.findByIdAndUpdate(
    req.body.id,
    {
      image: req.body.image,
    },
    { runValidators: true }
  );

  res.status(200).json({ message: 'User updated successfully' });

  // const formData = new FormData();

  // formData.append('file', file);
  // formData.append('upload_preset', 'enveebook_avatars');

  // try {
  //   const data = await fetch(
  //     'https://api.cloudinary.com/v1_1/envee/image/upload',
  //     {
  //       method: 'POST',
  //       body: formData,
  //     }
  //   ).then((res) => res.json());

  //   await User.findByIdAndUpdate(
  //     userId,
  //     {
  //       image: data.secure_url,
  //     },
  //     { new: true, runValidators: true }
  //   );
  // } catch (error) {
  //   console.error(error);
  // }
}
