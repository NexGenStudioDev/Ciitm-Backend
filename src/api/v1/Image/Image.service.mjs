import ImageModel from './Image.model.mjs';
import { Delete_From_Cloudinary } from '../../../utils/Cloudinary.mjs';

class Image_Service {
  create = async ({ userID, albumID, url }) => {
    let createdImage = await ImageModel.create({
      userID: userID,
      albumID: albumID,
      url: url,
    });

    return createdImage;
  };

  delete = async (imageId) => {
    let image = await ImageModel.findById(imageId);
    if (!image) {
      throw new Error('Image not found');
    }
    if (image.url) {
      try {
        await Delete_From_Cloudinary(image.url);
      } catch {
        // ignore cloudinary error
      }
    }
    return ImageModel.findByIdAndDelete(imageId);
  };
}

export default new Image_Service();
