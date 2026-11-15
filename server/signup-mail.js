import nodemailer from 'nodemailer';

const applicationName = 'ATM Content Studio';
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

function workspaceUrl(env) {
  try {
    const url = new URL(env.APP_BASE_URL);
    if (url.protocol !== 'https:' || url.username || url.password) return '';
    return new URL('/admin', url.origin).href;
  } catch { return ''; }
}

function signupContent(row, owner, env) {
  const name = row.name || 'there';
  const url = workspaceUrl(env);
  const title = owner ? 'A new account needs your review.' : 'Welcome. Your account is created.';
  const preview = owner ? 'Review the new signup and choose a project to grant access.' : 'Your content access request is awaiting administrator approval.';
  const introduction = owner
    ? 'Someone has joined ATM Content Studio and is waiting for project access. Review their details below before approving the request.'
    : `Hello ${name}, thank you for joining ATM Content Studio. Your account has been created, and your request for content access has been sent to the administrator.`;
  const steps = owner
    ? ['Sign in with your administrator account and open Access requests.', 'Find this account and select the project they should work on.', 'Choose Approve access. The user can then sign in and check their access.']
    : ['If you receive an email verification message, follow its link to verify your address.', 'Your administrator will review your request and assign you to a project.', 'Once approved, sign in and choose Check access again to open your workspace.'];
  const details = owner
    ? [['Name', row.name || 'Not provided'], ['Email', row.email], ['Account ID', row.user_id]]
    : [['Your account', row.email], ['Access status', 'Awaiting approval']];
  const action = owner ? 'Review access requests' : 'Open your workspace';
  const guidance = owner ? 'Approval grants access to the selected project. It does not give the user administrator permissions.' : 'You can sign in now, but content editing becomes available after your administrator approves access.';
  const footer = owner ? 'This notification was sent because a new account requested content access.' : 'Did not create this account? Contact atmenterprise23@gmail.com so we can help.';
  return renderContent({ title, preview, introduction, details, action, guidance, footer, steps, url,
    eyebrow: owner ? 'ACTION REQUIRED · NEW SIGNUP' : 'ACCOUNT CREATED · ACCESS PENDING',
    stepsTitle: owner ? 'Approve access in three steps' : 'What happens next' });
}

function decisionContent(row, approved, env) {
  const project = row.project_name || row.project_id;
  return renderContent({
    title: approved ? 'Your account is approved.' : 'Your access request was denied.',
    preview: approved ? 'Your project access is ready. Sign in to start working.' : 'Your administrator has reviewed your access request.',
    eyebrow: approved ? 'ACCESS APPROVED · WELCOME ABOARD' : 'ACCESS REQUEST · REVIEW COMPLETE',
    introduction: approved
      ? `Hello ${row.name || 'there'}, your administrator has approved your account for project access in ATM Content Studio. You can now open your assigned project and start managing its content.`
      : `Hello ${row.name || 'there'}, your administrator has reviewed your request for access to ATM Content Studio and has not approved it at this time.`,
    details: [['Your account', row.email], ['Access status', approved ? 'Approved' : 'Denied'], ...(approved ? [['Project', project]] : [])],
    stepsTitle: approved ? 'Your workspace is ready' : 'Need help with this decision?',
    steps: approved
      ? ['Sign in to ATM Content Studio with your account.', 'If the waiting screen is still open, choose Check access again.', 'Open your assigned project to start editing content.']
      : ['If you believe this decision was made in error, contact the administrator.', 'Include the account email shown above so the team can find your request.'],
    guidance: approved ? 'Your access applies to the assigned project. Keep your sign-in details private.' : 'This request has not granted you project access. Contact the team if you need further assistance.',
    action: approved ? 'Open your workspace' : 'Contact the team',
    url: approved ? workspaceUrl(env) : 'mailto:atmenterprise23@gmail.com',
    footer: 'Questions about your access? Contact atmenterprise23@gmail.com.',
  });
}

function renderContent({ title, preview, introduction, details, action, guidance, footer, steps, url, eyebrow, stepsTitle }) {
  const text = `${applicationName}\n\n${title}\n\n${introduction}\n\n${details.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\nWhat happens next\n${steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\n${guidance}\n\n${url ? `${action}: ${url}` : 'Open ATM Content Studio using your usual workspace address.'}\n\n${footer}\n\nATM Enterprise · Apps That Matter`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background-color:#f3f5f9;color:#243047;font-family:Arial,Helvetica,sans-serif;line-height:1.6;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f5f9;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e1e6ef;border-radius:16px;overflow:hidden;">
<tr><td style="background-color:#14213d;padding:28px 32px;"><p style="margin:0;color:#ffffff;font-size:21px;font-weight:700;letter-spacing:-0.4px;">${applicationName}</p><p style="margin:5px 0 0;color:#c5cee0;font-size:12px;letter-spacing:1.5px;">YOUR CONTENT. YOUR WORKSPACE.</p></td></tr>
<tr><td style="padding:32px;">
<p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:1px;color:#805300;">${escapeHtml(eyebrow)}</p>
<h1 style="margin:0 0 18px;font-size:28px;line-height:1.25;color:#14213d;">${escapeHtml(title)}</h1>
<p style="margin:0 0 24px;font-size:16px;">${escapeHtml(introduction)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fb;border:1px solid #e1e6ef;border-radius:10px;">${details.map(([label, value]) => `<tr><td style="padding:12px 18px;border-bottom:1px solid #e1e6ef;"><p style="margin:0;font-size:12px;color:#5b667b;">${escapeHtml(label)}</p><p style="margin:3px 0 0;font-size:15px;font-weight:600;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(value)}</p></td></tr>`).join('')}</table>
<h2 style="margin:28px 0 12px;font-size:18px;color:#14213d;">${escapeHtml(stepsTitle)}</h2>
<ol style="margin:0 0 20px;padding-left:22px;">${steps.map(step => `<li style="padding:0 0 10px 4px;">${escapeHtml(step)}</li>`).join('')}</ol>
<p style="margin:0 0 24px;font-size:14px;color:#5b667b;">${escapeHtml(guidance)}</p>
${url ? `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:8px;background-color:#14213d;"><a href="${escapeHtml(url)}" style="display:inline-block;padding:14px 24px;border:1px solid #14213d;border-radius:8px;color:#ffffff;font-weight:700;text-decoration:none;">${action} &rarr;</a></td></tr></table><p style="margin:16px 0 0;font-size:12px;color:#5b667b;">Button not working? <a href="${escapeHtml(url)}" style="color:#243f77;text-decoration:underline;">Use this link</a>.</p>` : '<p style="margin:0;font-weight:700;">Open ATM Content Studio using your usual workspace address.</p>'}
</td></tr><tr><td style="padding:22px 32px;border-top:1px solid #e1e6ef;background-color:#fafbfd;"><p style="margin:0 0 10px;font-size:12px;color:#5b667b;">${escapeHtml(footer)}</p><p style="margin:0;font-size:12px;color:#5b667b;">ATM Enterprise · Apps That Matter</p></td></tr>
</table></td></tr></table></body></html>`;
  return { text, html };
}

export async function sendSignupMail(row, kind, env = process.env, createTransport = nodemailer.createTransport) {
  return sendNotificationMail(row, kind, env, createTransport);
}

export async function sendDecisionMail(row, kind, env = process.env, createTransport = nodemailer.createTransport) {
  if (!['approved', 'denied'].includes(kind)) throw new Error('Invalid access decision.');
  return sendNotificationMail(row, kind, env, createTransport);
}

async function sendNotificationMail(row, kind, env, createTransport) {
  if (!env.GMAIL_SMTP_USER || !env.GMAIL_SMTP_APP_PASSWORD) throw new Error('Configure Gmail SMTP credentials.');
  const transport = createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user: env.GMAIL_SMTP_USER, pass: env.GMAIL_SMTP_APP_PASSWORD.replace(/\s/g, '') },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
  });
  const owner = kind === 'owner';
  const decision = ['approved', 'denied'].includes(kind);
  const info = await transport.sendMail({
    from: { name: applicationName, address: env.GMAIL_SMTP_USER },
    to: { address: owner ? 'atmenterprise23@gmail.com' : row.email, name: owner ? 'ATM Enterprise' : row.name },
    subject: decision ? (kind === 'approved' ? 'Your account is approved | ATM Content Studio' : 'Your access request was denied | ATM Content Studio') : owner ? 'Action required: new access request | ATM Content Studio' : 'Welcome to ATM Content Studio — your access request is received',
    ...(decision ? decisionContent(row, kind === 'approved', env) : signupContent(row, owner, env)),
  });
  if (!info.accepted?.length) throw new Error('SMTP did not accept the notification.');
}
