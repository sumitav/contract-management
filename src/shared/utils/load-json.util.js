import fs from 'fs';
import path from 'path';

export const loadJSON = (filePath) => {
  const absolutePath = path.resolve(filePath);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
};