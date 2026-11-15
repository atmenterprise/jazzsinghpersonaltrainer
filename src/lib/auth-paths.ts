export const authPaths = ['sign-in', 'sign-up', 'forgot-password', 'reset-password', 'verify-email'] as const;
export type AuthPath = typeof authPaths[number];
