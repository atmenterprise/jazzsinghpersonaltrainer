import nodemailer from 'nodemailer';

export async function sendSignupMail(row, kind, env = process.env, createTransport = nodemailer.createTransport) {
  if (!env.GMAIL_SMTP_USER || !env.GMAIL_SMTP_APP_PASSWORD) throw new Error('Configure Gmail SMTP credentials.');
  const transport = createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user: env.GMAIL_SMTP_USER, pass: env.GMAIL_SMTP_APP_PASSWORD.replace(/\s/g, '') },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
  });
  const owner = kind === 'owner';
  const info = await transport.sendMail({
    from: { name: 'ATM Content Studio', address: env.GMAIL_SMTP_USER },
    to: { address: owner ? 'atmenterprise23@gmail.com' : row.email, name: owner ? 'ATM Enterprise' : row.name },
    subject: owner ? 'New account awaiting content access' : 'Your ATM Content Studio account is ready',
    text: owner
      ? `A user has signed up for ATM Content Studio.\n\nName: ${row.name}\nEmail: ${row.email}\nUser ID: ${row.user_id}\n\nSign in to the studio and open Access requests to select a project and approve access.`
      : `Hello ${row.name || 'there'},\n\nYour ATM Content Studio account has been created. Your request for content access has been sent to the administrator. You can sign in and check your access after approval.\n\nIf Neon asks you to verify your email, follow its separate verification email.\n\nATM Enterprise`,
  });
  if (!info.accepted?.length) throw new Error('SMTP did not accept the notification.');
}
