import { Request } from 'express';

export function fileFilter(
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  if (!file) return callback(new Error('No file was uploaded.'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtensions.includes(fileExtension)) {
    return callback(null, true);
  }

  callback(null, false);
}
