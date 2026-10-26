import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import frontendConstant from './frontend.constant.mjs';
import frontendService from './frontend.service.mjs';
import Frontend_utils from './frontend.utils.mjs';

class FrontendController {
  async find(req, res) {
    try {
      let Find_Frontend = await Frontend_utils.findAll();

      if (!Find_Frontend) {
        throw new Error(frontendConstant.NOT_FOUND);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        frontendConstant.FOUND,
        Find_Frontend
      );
    } catch (error) {
      SendResponse.error(
        res,
        error.status || StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  }

  async Create(req, res) {
    try {
      let Create_Frontend = await Frontend_utils.findAll();

      if (Create_Frontend) {
        throw new Error(frontendConstant.ALREADY_EXISTS);
      }

      let frontend_create = await frontendService.Created_Frontend();

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        frontendConstant.CREATED,
        frontend_create
      );
    } catch (error) {
      SendResponse.error(
        res,
        error.status || StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  }

  async update(req, res) {
    try {
      const updatedFrontend = await frontendService.Update_Frontend(req.body);
      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Frontend settings updated successfully',
        updatedFrontend
      );
    } catch (error) {
      SendResponse.error(
        res,
        error.status || StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  }
}

export default new FrontendController();
