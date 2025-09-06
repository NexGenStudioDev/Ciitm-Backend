import { Delete_From_Cloudinary } from '../../../utils/Cloudinary.mjs';
import ImageModel from '../Image/Image.model.mjs';
import AlbumConstant from './Album.constant.mjs';
import Album from './Album.model.mjs';
import AlbumUtils from './Album.utils.mjs';

class Album_Service {
  create = async ({ albumName, albumDescription, Url }) => {
    let createdAlbum = await Album.create({
      aName: albumName,
      aDescription: albumDescription,
      aImage_url: Url,
    });

    return createdAlbum;
  };

  delete = async (albumId) => {
    // Find and delete the album
    let deletedAlbum = await AlbumUtils.findByIdAndDelete(albumId);

    if (!deletedAlbum) {
      throw new Error(AlbumConstant.NOT_DELETED);
    }

    // Find all images related to this album
    const images = await ImageModel.find({ albumId: albumId });

    // Delete each image from Cloudinary and DB
    for (const image of images) {
      if (image.url) {
        await Delete_From_Cloudinary(image.url);
      }
      await ImageModel.findByIdAndDelete(image._id);
    }

    return deletedAlbum;
  };
}

export default new Album_Service();
