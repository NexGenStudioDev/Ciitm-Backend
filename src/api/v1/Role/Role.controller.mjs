import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import RoleConstant from './Role.constant.mjs';
import RoleService from './Role.service.mjs';
import RoleUtils from './Role.utils.mjs';

class Role_Controller {
  Create_Admin_Role_Controller = async (req, res) => {
    try {
      let { email } = req.body;

      let find_Admin_Role = await RoleUtils.Find_Role(email);
      if (find_Admin_Role) {
        throw new Error(RoleConstant.ROLE_ALREADY_EXISTS);
      }

      let Create_Admin = await RoleService.create_Admin_Role(email);

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        RoleConstant.ROLE_CREATED,
        Create_Admin
      );
    } catch (error) {
      console.log('error', error);
      SendResponse.error(
        res,
        500,
        error.message || RoleConstant.ROLE_NOT_CREATED
      );
    }
  };
}

export default new Role_Controller();
