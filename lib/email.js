import nodemailer from 'nodemailer';

let transporter;

try {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
} catch (error) {
  console.error('邮件服务配置错误:', error);
}

export async function sendVerificationEmail(to, token) {
  if (!transporter) {
    console.error('邮件服务未正确配置');
    return;
  }

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: '验证您的邮箱',
    html: `
      <h1>欢迎注册</h1>
      <p>请点击下面的链接验证您的邮箱：</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>此链接24小时内有效</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('发送验证邮件失败:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(to, token) {
  if (!transporter) {
    console.error('邮件服务未正确配置');
    return;
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: '重置密码',
    html: `
      <h1>重置密码请求</h1>
      <p>请点击下面的链接重置您的密码：</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>此链接1小时内有效</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('发送重置密码邮件失败:', error);
    throw error;
  }
} 