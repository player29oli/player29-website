import "server-only";

import { timingSafeEqual } from "node:crypto";

export function secretsEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function emailsEqual(left: string, right: string): boolean {
  return secretsEqual(left.trim().toLowerCase(), right.trim().toLowerCase());
}
