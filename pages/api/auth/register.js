import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/db';
import User from '../../../models/user';

const validateUsername = async (username) => {
  if (username.length < 3) {
    return { error: 'Username must be at least 3 characters long' };
  }

  const user = await User.findOne({ username });
  if (user) {
    return { error: 'Username already exists' };
  }
  return { success: true };
};

const validateEmail = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    return { error: 'Email already exists' };
  }
  return { success: true };
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { username, email, password, confirmPassword } = req.body;

    if (username && email && password && password === confirmPassword) {
      try {
        const isValidUsername = await validateUsername(username);

        const isValidEmail = await validateEmail(email);

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
          username,
          email,
          password: hashedPassword,
        });

        res.status(201).json({ newUser });
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
