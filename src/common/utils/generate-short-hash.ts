import * as crypto from 'crypto';

export function generateShortHash(length = 8) {
  const buffer = crypto.randomBytes(6);
  const hash = buffer
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, length);

  return hash;
}
