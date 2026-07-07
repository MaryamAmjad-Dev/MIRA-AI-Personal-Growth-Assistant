import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.js';

let client = null;

function getGoogleClient() {
  if (!env.googleClientId) return null;
  if (!client) client = new OAuth2Client(env.googleClientId);
  return client;
}

export async function verifyGoogleToken(credential) {
  const googleClient = getGoogleClient();

  if (!googleClient) {
    throw new Error('Google authentication is not configured on the server');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId,
  });

  const payload = ticket.getPayload();

  if (!payload?.email || !payload.sub) {
    throw new Error('Invalid Google token payload');
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name || payload.email.split('@')[0],
    avatar: payload.picture || '',
    emailVerified: payload.email_verified,
  };
}
