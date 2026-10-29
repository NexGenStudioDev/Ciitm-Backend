import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import Notice_Constants from './notice.constant.mjs';
import noticeService from './notice.service.mjs';
import noticeUtils from './notice.utils.mjs';

class Notice_Controller {
  Create = async (req, res) => {
    try {
      const { title, type, target, priority } = req.body;
      const content = req.body.content || req.body.noticeContent || '';

      if (!title || !content) {
        throw new Error('Title and notice content are required');
      }

      let doc_link = null;
      const uploadedFile = req.file || (req.files && req.files[0]);

      if (uploadedFile && uploadedFile.filename) {
        const uploadResult = await uploadOnCloudinary(uploadedFile.filename);
        if (uploadResult?.url) {
          doc_link = uploadResult.url;
        }
      } else if (req.body.doc_link && req.body.doc_link !== 'null' && req.body.doc_link !== 'undefined') {
        doc_link = req.body.doc_link;
      }

      const Created_Notice = await noticeService.create_Notice({
        title,
        content,
        type: type || 'General',
        target: target || 'All Students & Faculty',
        priority: priority || 'normal',
        doc_link,
      });

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        Notice_Constants.CREATED,
        Created_Notice
      );
    } catch (error) {
      console.error('[NoticeController] Create error:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };

  Find = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const page = parseInt(req.query.page) || 1;
      const Found_Notice = await noticeUtils.FIND(limit, page);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Notice_Constants.FIND,
        Found_Notice || []
      );
    } catch (error) {
      console.error('[NoticeController] Find error:', error);
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
      console.error('[NoticeController] Delete error:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };
}

export default new Notice_Controller();
