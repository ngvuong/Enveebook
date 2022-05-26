import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/db';
import User from '../../../models/user';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { name, email, password, confirmPassword } = req.body;

    try {
      const errors = [];
      if (password !== confirmPassword) {
        errors.push({
          param: 'confirmPassword',
          message: 'Passwords do not match',
        });
      }
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      const newUser = { name: capitalizedName, email, password };
      const { error } = User.validateUser(newUser);
      if (error) {
        errors.push(
          ...error.details.map((detail) => ({
            param: detail.context.key,
            message: detail.message,
          }))
        );
      }

      const existingName = await User.findOne({ name: capitalizedName });
      const existingEmail = await User.findOne({ email });

      if (existingName) {
        errors.push({
          param: 'name',
          message: 'Username already exists',
        });
      }

      if (existingEmail) {
        errors.push({
          param: 'email',
          message: 'Email already exists',
        });
      }

      if (errors.length) {
        return res.status(400).json({ error: errors });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create({ ...newUser, password: hashedPassword });
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      res.status(500).json({ error: [err.message] });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
