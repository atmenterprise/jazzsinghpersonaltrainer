'use client';
import { createAuthClient } from '@neon/auth/next';

// Uses the same-origin /api/auth proxy, including HttpOnly session cookies.
export const authClient = createAuthClient();
