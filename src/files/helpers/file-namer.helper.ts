import { Request } from 'express';
import { v4 as uuid } from 'uuid';

export function fileNamer(
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, fileName: string | null) => void,
) {
  if (!file) return callback(new Error('No file was uploaded.'), null);

  const fileExtension = file.mimetype.split('/')[1];

  const fileName = `${uuid()}.${fileExtension}`;

  callback(null, fileName);
}
