import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import Notice_Constants from './notice.constant.mjs';
import noticeService from './notice.service.mjs';
import noticeUtils from './notice.utils.mjs';

class Notice_Controller {
  Create = async (req, res) => {
    try {
      let { title, content, type } = req.body;
      const { filename } = req.file;

      let doc = await uploadOnCloudinary(filename);

      let Created_Notice = await noticeService.create_Notice({
        title,
        content,
        type,
        doc_link: doc.url,
      });

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        Notice_Constants.CREATED,
        Created_Notice
      );
    } catch (error) {
      console.log(error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };

  Find = async (req, res) => {
    try {
      let Found_Notice = await noticeUtils.FIND(
        parseInt(req.query.limit),
        parseInt(req.query.page)
      );

      if (!Found_Notice || Found_Notice.length <= 0) {
        throw new Error(Notice_Constants.NOT_FOUND);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Notice_Constants.FIND,
        Found_Notice
      );
    } catch (error) {
      console.log(error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };

  Delete = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error('Notice ID is required');
      }
      const deletedNotice = await noticeService.delete_Notice(id);
      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Notice deleted successfully',
        deletedNotice
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };
}

export default new Notice_Controller();
