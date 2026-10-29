import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import RoleConstant from './Role.constant.mjs';
import RoleService from './Role.service.mjs';
import RoleUtils from './Role.utils.mjs';

class Role_Controller {
  Create_Admin_Role_Controller = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        throw new Error('Email is required');
      }

      await RoleUtils.Find_Role(email);

      const Create_Admin = await RoleService.create_Admin_Role(email);

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        RoleConstant.ROLE_CREATED,
        Create_Admin
      );
    } catch (error) {
      console.error('[RoleController] Create error:', error.message);
      SendResponse.error(
        res,
        500,
        error.message || RoleConstant.ROLE_NOT_CREATED
      );
    }
  };

  Get_All_Admins_Controller = async (req, res) => {
    try {
      const admins = await RoleService.getAllAdmins();
      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Administrators retrieved successfully',
        admins
      );
    } catch (error) {
      console.error('[RoleController] Get admins error:', error.message);
      SendResponse.error(
        res,
        500,
        error.message || 'Failed to retrieve administrators'
      );
    }
  };

  Delete_Admin_Role_Controller = async (req, res) => {
    try {
      const identifier = req.params.id || req.params.email || req.body.email || req.body.id;
      if (!identifier) {
        throw new Error('Administrator identifier or email required');
      }

      const result = await RoleService.deleteAdmin(identifier);
      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        result.message || 'Administrator removed successfully',
        result
      );
    } catch (error) {
      console.error('[RoleController] Delete error:', error.message);
      SendResponse.error(
        res,
        500,
        error.message || 'Failed to remove administrator'
      );
    }
  };
}

export default new Role_Controller();
