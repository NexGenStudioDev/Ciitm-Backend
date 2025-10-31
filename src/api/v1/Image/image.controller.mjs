import { get } from 'mongoose';
import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import AlbumConstant from '../Album/Album.constant.mjs';
import AlbumUtils from '../Album/Album.utils.mjs';
import AuthConstant from '../Auth/Auth.constant.mjs';
import Authentication from '../Auth/Auth.model.mjs';
import AuthUtils from '../Auth/Auth.utils.mjs';
import ImageConstant from './Image.constant.mjs';
import ImageService from './Image.service.mjs';
import { Create_Image_Validator } from './image.validator.mjs';
import Album from '../Album/Album.model.mjs';
import logger from '../../../middleware/loggerMiddleware.js';
import ImageUtils from './Image.utils.mjs';

class Image_Controller {
  create_Image = async (req, res) => {
    try {
      const { albumName } = req.body;
      const { filename } = req.file;
      const token = req.cookies.token;

      let email = await AuthUtils.DecodeToken(token);

      let find_Admin = await AuthUtils.FindByEmail(email);

      if (!find_Admin) {
        throw new Error(AuthConstant.USER_NOT_FOUND);
      }

      const findAlbum = await AlbumUtils.FindByAlbumName(albumName);

      if (!findAlbum) {
        throw new Error(AlbumConstant.ALBUM_NOT_FOUND);
      }

      let Cloudinary = await uploadOnCloudinary(filename);

      if (!Cloudinary) {
        throw new Error(AlbumConstant.CLOUDINARY_ERROR);
      }

      const { error: validationError } = Create_Image_Validator.validate({
        albumName: findAlbum.aName,
        url: Cloudinary.url,
      });

      if (validationError) {
        throw new Error(validationError.message);
      }

      // userID: userID,
      // albumID: albumID,
      // url: url,

      let createdImage = await ImageService.create({
        userID: find_Admin._id.toString(),
        albumID: findAlbum._id.toString(),

        url: Cloudinary.url,
      });

      if (!createdImage) {
        throw new Error(ImageConstant.NOT_CREATED);
      }

      findAlbum.images.push(createdImage._id.toString());
      await findAlbum.save();

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        ImageConstant.CREATE_IMAGE,
        createdImage
      );
    } catch (error) {
      console.error('Error in create_Image:', error);
      SendResponse.error(res, StatusCodeConstant.BAD_REQUEST, error.message);
    }
  };

  get_Image = async (req, res) => {
    try {
      const { Album__Name } = req.params;

      const Find_Album = await AlbumUtils.FindByAlbumName(Album__Name);

      if (!Find_Album) {
        throw new Error(AlbumConstant.ALBUM_NOT_FOUND);
      }

      const Find_All_Image_Based_On_AlbumId = await ImageUtils.FIND_BY_ALBUM_ID(
        Find_Album._id
      );

      if (!Find_All_Image_Based_On_AlbumId) {
        throw new Error(ImageConstant.NOT_FOUND);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.ACCEPTED,
        ImageConstant.FIND_IMAGE,
        Find_All_Image_Based_On_AlbumId
      );
    } catch (error) {
      SendResponse.error(res, StatusCodeConstant.BAD_REQUEST, error.message);
    }
  };

  get_All_Image = async (req, res) => {
    try {
      const Find_All_Image = await ImageUtils.FIND_ALL_IMAGE();

      if (!Find_All_Image) {
        throw new Error(ImageConstant.NOT_FOUND);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.ACCEPTED,
        ImageConstant.FIND_ALL_IMAGE,
        Find_All_Image
      );
    } catch (error) {
      SendResponse.error(res, StatusCodeConstant.BAD_REQUEST, error.message);
    }
  };
}

export default new Image_Controller();
