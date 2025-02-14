import * as bcrypt from 'bcrypt';

export function encrypt(data: string | Buffer) {
  return bcrypt.hashSync(data, 10);
}

export function decrypt(data: string | Buffer, encrypted: string) {
  return bcrypt.compareSync(data, encrypted);
}
