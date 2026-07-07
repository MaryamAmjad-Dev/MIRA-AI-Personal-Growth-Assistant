import crypto from 'crypto';
import VaultEntry from '../../models/VaultEntry.js';
import { env } from '../../config/env.js';

const ALGO = 'aes-256-gcm';

function deriveKey(passphrase, userId) {
  return crypto.scryptSync(passphrase, `${userId}-${env.jwtSecret}`, 32);
}

export function encryptVaultContent(content, passphrase, userId) {
  const key = deriveKey(passphrase, userId.toString());
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  let encrypted = cipher.update(content, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return { encryptedContent: encrypted, iv: iv.toString('hex'), authTag };
}

export function decryptVaultContent(entry, passphrase, userId) {
  const key = deriveKey(passphrase, userId.toString());
  const decipher = crypto.createDecipheriv(ALGO, key, Buffer.from(entry.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(entry.authTag, 'hex'));
  let decrypted = decipher.update(entry.encryptedContent, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function createVaultEntry(userId, { title, content, passphrase }) {
  if (!passphrase || passphrase.length < 4) throw new Error('Vault passphrase required (min 4 chars)');
  const encrypted = encryptVaultContent(content, passphrase, userId);
  return VaultEntry.create({
    user: userId,
    title: title || 'Private Entry',
    ...encrypted,
  });
}

export async function listVaultEntries(userId) {
  return VaultEntry.find({ user: userId }).select('title createdAt updatedAt').sort({ createdAt: -1 }).lean();
}

export async function unlockVaultEntry(userId, entryId, passphrase) {
  const entry = await VaultEntry.findOne({ _id: entryId, user: userId });
  if (!entry) throw new Error('Vault entry not found');
  try {
    const content = decryptVaultContent(entry, passphrase, userId);
    return { title: entry.title, content, createdAt: entry.createdAt };
  } catch {
    throw new Error('Invalid vault passphrase');
  }
}

export async function deleteVaultEntry(userId, entryId) {
  return VaultEntry.findOneAndDelete({ _id: entryId, user: userId });
}
