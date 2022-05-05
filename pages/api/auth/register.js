import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/db';
import User from '../../../models/user';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { username, email, password, passwordConfirmation } = req.body;

    if (username && email && password && password === passwordConfirmation) {
      try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
          username,
          email,
          password: hashedPassword,
        });

        res.status(201).json({ user });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    } else {
      res
        .status(400)
        .json({ error: 'Please provide username, email and password' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
