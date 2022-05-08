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

    // if (username && email && password && password === confirmPassword) {
    try {
      const newUser = { username, email, password };
      const { error } = User.validateUser(newUser);
      if (error) {
        console.log(error);
        return res.status(400).json({
          error: error.details.map((detail) => ({
            param: detail.context.key,
            message: detail.message,
          })),
        });
      }

      const existingUsername = await User.findOne({ username });
      const existingEmail = await User.findOne({ email });
      const duplicationErrors = [];

      if (existingUsername) {
        duplicationErrors.push({
          param: 'username',
          message: 'Username already exists',
        });
      }
      if (existingEmail) {
        duplicationErrors.push({
          param: 'email',
          message: 'Email already exists',
        });
      }

      if (duplicationErrors.length) {
        return res.status(400).json({ error: duplicationErrors });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create({ ...newUser, password: hashedPassword });
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      res.status(500).json({ error: [err.message] });
    }
    // } else {
    //   res
    //     .status(400)
    //     .json({ error: ['Please provide username, email and password'] });
    // }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
