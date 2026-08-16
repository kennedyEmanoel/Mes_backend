import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const TOKEN_BYTES = 32;

export function generateRefreshToken(): string {
  return randomBytes(TOKEN_BYTES).toString('hex');
}

export function hashRefreshToken(token: string): Promise<string> {
  return bcrypt.hash(token, SALT_ROUNDS);
}

export function compareRefreshToken(
  token: string,
  tokenHash: string,
): Promise<boolean> {
  return bcrypt.compare(token, tokenHash);
}
