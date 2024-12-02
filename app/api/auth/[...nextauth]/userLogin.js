import { User } from '@/models/User';

export async function userLogin( email, password) {
  try {

    const user = await User.findByEmail(email);
    if (!user) {
      return false;
    }

    const isValidPassword = await User.comparePassword(user.password, password);
    if (!isValidPassword) {
      return false;
    }
    
    return user;

  } catch (error) {
    console.error('登录错误:', error);
    return false;
  }
} 