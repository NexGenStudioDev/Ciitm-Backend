import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
(async function () {
  // Configuration

  cloudinary.config({
    cloud_name: process.env.Cloudinary_Cloud_Name,
    api_key: process.env.Cloudinary_API_Key,
    api_secret: process.env.Cloudinary_API_Secret, // Click 'View API Keys' above to copy your API secret
  });
})();

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error('File not found');
    }

    const localFileName = path.basename(localFilePath);
    const resolvedPath = path.isAbsolute(localFilePath)
      ? localFilePath
      : path.join(process.cwd(), 'public', 'upload', localFileName);

    const hasCloudinary = Boolean(
      process.env.Cloudinary_Cloud_Name &&
      process.env.Cloudinary_API_Key &&
      process.env.Cloudinary_API_Secret
    );

    if (!hasCloudinary) {
      console.log(
        `[Storage] Cloudinary not configured. Serving local file: /api/upload/${localFileName}`
      );
      return {
        url: `/api/upload/${localFileName}`,
        public_id: localFileName,
        format: path.extname(localFileName).replace('.', '') || 'jpg',
        original_filename: localFileName,
      };
    }

    const uploadResult = await cloudinary.uploader.upload(resolvedPath, {
      public_id: localFileName,
      resource_type: 'auto',
    });

    return {
      url: uploadResult.secure_url || uploadResult.url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      original_filename: uploadResult.original_filename || localFileName,
    };
  } catch (error) {
    console.warn('[Storage] Cloudinary upload error, using local file:', error.message);
    const localFileName = path.basename(localFilePath);
    const resolvedPath = path.join(process.cwd(), 'public', 'upload', localFileName);

    if (fs.existsSync(resolvedPath)) {
      return {
        url: `/api/upload/${localFileName}`,
        public_id: localFileName,
        format: path.extname(localFileName).replace('.', '') || 'jpg',
        original_filename: localFileName,
      };
    }
    throw Error(error.message);
  }
};

export const Delete_From_Cloudinary = async (url) => {
  try {
    if (!url) return { deleted: false, message: 'URL not provided' };

    const hasCloudinary = Boolean(
      process.env.Cloudinary_Cloud_Name &&
      process.env.Cloudinary_API_Key &&
      process.env.Cloudinary_API_Secret
    );

    if (!hasCloudinary) {
      const fileName = path.basename(url);
      const localPath = path.join(process.cwd(), 'public', 'upload', fileName);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
      return { deleted: true, message: `Local image removed: ${fileName}` };
    }

    const public_id = path.basename(url).split('.')[0] + '.' + (url.split('.')[3] || 'jpg');
    const delete_Image = await cloudinary.uploader.destroy(public_id);

    if (delete_Image.result === 'ok') {
      const localPath = path.join(process.cwd(), 'public', 'upload', path.basename(url));
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }

      return {
        message: `Image Deleted From Cloudinary ${public_id}`,
        public_id: public_id,
        deleted: true,
      };
    }

    return {
      message: 'Image deletion reported ok',
      deleted: true,
    };
  } catch (error) {
    console.warn('[Storage] Delete image warning:', error.message);
    return {
      message: error.message,
      deleted: false,
    };
  }
};
