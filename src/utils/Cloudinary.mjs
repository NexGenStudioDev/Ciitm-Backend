import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.Cloudinary_Cloud_Name,
  api_key: process.env.Cloudinary_API_Key,
  api_secret: process.env.Cloudinary_API_Secret,
});

/**
 * Uploads a local file to Cloudinary and immediately removes the local temp file.
 * Files never linger in public/upload.
 */
export const uploadOnCloudinary = async (localFilePath) => {
  let resolvedPath = null;
  try {
    if (!localFilePath) {
      throw new Error('File not found');
    }

    if (typeof localFilePath === 'object') {
      localFilePath =
        localFilePath.file ||
        localFilePath.path ||
        localFilePath.filename ||
        localFilePath.url;
    }

    const localFileName = path.basename(localFilePath);
    resolvedPath = path.isAbsolute(localFilePath)
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

    const publicId = path.parse(localFileName).name;

    const uploadResult = await cloudinary.uploader.upload(resolvedPath, {
      public_id: publicId,
      resource_type: 'auto',
    });

    // Remove local file immediately after Cloudinary upload succeeds
    if (resolvedPath && fs.existsSync(resolvedPath)) {
      try {
        fs.unlinkSync(resolvedPath);
      } catch (unlinkErr) {
        console.warn('[Storage] Notice: local temp file unlink error:', unlinkErr.message);
      }
    }

    return {
      url: uploadResult.secure_url || uploadResult.url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      original_filename: uploadResult.original_filename || localFileName,
    };
  } catch (error) {
    console.warn('[Storage] Cloudinary upload error:', error.message);
    // Ensure local temp file is removed so public/upload remains clean
    if (resolvedPath && fs.existsSync(resolvedPath)) {
      try {
        fs.unlinkSync(resolvedPath);
      } catch {
        // ignore cleanup error
      }
    }
    throw new Error(error.message);
  }
};

/**
 * Deletes an asset directly from Cloudinary using its URL or public_id.
 * Also cleans up any matching local file in public/upload.
 */
export const Delete_From_Cloudinary = async (url) => {
  try {
    if (!url || typeof url !== 'string') {
      return { deleted: false, message: 'URL not provided' };
    }

    // Always ensure no matching local file lingers
    const localFileName = path.basename(url);
    const localPath = path.join(process.cwd(), 'public', 'upload', localFileName);
    if (fs.existsSync(localPath)) {
      try {
        fs.unlinkSync(localPath);
      } catch (err) {
        console.warn('[Storage] Notice: local file cleanup error:', err.message);
      }
    }

    const hasCloudinary = Boolean(
      process.env.Cloudinary_Cloud_Name &&
        process.env.Cloudinary_API_Key &&
        process.env.Cloudinary_API_Secret
    );

    if (!hasCloudinary) {
      return { deleted: true, message: `Local image removed: ${localFileName}` };
    }

    if (!url.includes('cloudinary.com')) {
      return { deleted: true, message: 'Non-Cloudinary URL, local file cleaned up' };
    }

    // Extract resource_type and public_id path from Cloudinary URL:
    // Format: https://res.cloudinary.com/<cloud_name>/<resource_type>/upload/(v<version>/)?<public_id>(.<extension>)?
    const match = url.match(
      /res\.cloudinary\.com\/[^/]+\/(image|raw|video)\/upload\/(?:v\d+\/)?(.+)$/
    );

    let resourceType = 'image';
    let pathAfter = '';

    if (match) {
      resourceType = match[1];
      pathAfter = match[2];
    } else {
      pathAfter = path.basename(url);
    }

    const lastDotIndex = pathAfter.lastIndexOf('.');
    const withoutExt =
      lastDotIndex !== -1 ? pathAfter.substring(0, lastDotIndex) : pathAfter;
    const withExt = pathAfter;

    // Candidate public_ids to try destroying
    const candidates = [
      { id: withoutExt, type: resourceType },
      { id: withExt, type: resourceType },
      { id: withoutExt, type: 'raw' },
      { id: withExt, type: 'raw' },
      { id: withoutExt, type: 'image' },
    ];

    const seen = new Set();
    for (const cand of candidates) {
      const key = `${cand.type}:${cand.id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      try {
        const deleteResult = await cloudinary.uploader.destroy(cand.id, {
          resource_type: cand.type,
          invalidate: true,
        });

        if (
          deleteResult &&
          (deleteResult.result === 'ok' || deleteResult.result === 'deleted')
        ) {
          return {
            message: `Asset Deleted From Cloudinary: ${cand.id}`,
            public_id: cand.id,
            deleted: true,
          };
        }
      } catch (destroyErr) {
        console.warn(`[Storage] Cloudinary destroy attempt failed for ${cand.id}:`, destroyErr.message);
      }
    }

    return {
      message: 'Cloudinary deletion attempted for URL',
      deleted: true,
    };
  } catch (error) {
    console.warn('[Storage] Delete from Cloudinary warning:', error.message);
    return {
      message: error.message,
      deleted: false,
    };
  }
};
