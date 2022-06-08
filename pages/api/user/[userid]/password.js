import bcrypt from 'bcryptjs';
import User from '../../../../models/user';
import dbConnect from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currentPassword, newPassword, confirmPassword } = req.body;
  const { userid } = req.query;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Please fill out all fields' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      error: 'New passwords do not match',
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      error: 'Password must be at least 6 characters',
    });
  }

  try {
    await dbConnect();
    const user = await User.findById(userid);

    if (!user.password) {
      return res.status(400).json({
        error: 'Cannot change the password for this user',
      });
    }

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid current password' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({ error: 'Please enter a new password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
}
